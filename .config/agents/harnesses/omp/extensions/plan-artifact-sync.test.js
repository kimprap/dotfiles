import { createHash } from "node:crypto";
import { afterEach, describe, expect, mock, test } from "bun:test";
import { access, mkdir, mkdtemp, readFile, realpath, rename, rm, symlink, utimes, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

mock.module("@oh-my-pi/pi-coding-agent/internal-urls", () => ({
    resolveLocalUrlToPath(value, options) {
        if (!value.startsWith("local://")) throw new Error(`not a local URI: ${value}`);
        return join(options.localRoot, value.slice("local://".length));
    },
}));

const DOTFILES = "/Users/kim/.dotfiles";
const HELPER = join(DOTFILES, "bin/omp-copy-plan-artifact");
const { publishLockRecord } = await import(HELPER);
const { default: planArtifactSync } = await import("./plan-artifact-sync.js");
const cleanups = [];

function planBytes({
    datetime = "2026-08-10-0310",
    status = "PENDING",
    taskChecked = false,
    criterionChecked = false,
    completion = "Not complete.",
    body = "",
} = {}) {
    return Buffer.from(
        [
            "# Mirror probe",
            "",
            `**Datetime**: ${datetime}`,
            "**Scope**: mirror probe",
            "**Summary**: mirror probe",
            `**Status**: ${status}`,
            "",
            "## Context",
            body,
            "",
            "## Tasks",
            `- [${taskChecked ? "x" : " "}] T1. Exercise lifecycle`,
            ...(taskChecked ? ["  completed 2026-08-10-0311"] : []),
            "",
            "## Verification / Done criteria",
            `- [${criterionChecked ? "x" : " "}] Projection matches authority`,
            "",
            "## Completion Summary",
            completion,
            "",
        ].join("\n")
    );
}

async function temporaryDirectory(prefix) {
    const directory = await mkdtemp(join(tmpdir(), prefix));
    cleanups.push(directory);
    return directory;
}

async function fixture(options = {}) {
    const root = await temporaryDirectory("omp-plan-sync-repo-");
    const localRoot = await temporaryDirectory("omp-plan-sync-local-");
    const localPath = join(localRoot, "demo-plan.md");
    await mkdir(join(root, ".agents", "plans"), { recursive: true });
    await writeFile(localPath, planBytes(options));
    return {
        root,
        localRoot,
        localPath,
        active: join(root, ".agents", "plans", `${options.datetime ?? "2026-08-10-0310"}_demo.md`),
        archived: join(root, ".agents", "plans", "archive", `${options.datetime ?? "2026-08-10-0310"}_demo.md`),
    };
}

function createFakePi() {
    const handlers = new Map();
    const tools = [];
    return {
        handlers,
        tools,
        on(name, handler) {
            handlers.set(name, handler);
        },
        registerTool(tool) {
            tools.push(tool);
        },
        async exec(command, args, options) {
            const process = Bun.spawn([command, ...args], {
                cwd: options.cwd,
                stdout: "pipe",
                stderr: "pipe",
            });
            const [stdout, stderr, code] = await Promise.all([
                new Response(process.stdout).text(),
                new Response(process.stderr).text(),
                process.exited,
            ]);
            return { stdout, stderr, code };
        },
    };
}

function context(root, localRoot, notifications = []) {
    return {
        cwd: root,
        localProtocolOptions: { localRoot },
        ui: { notify: (message) => notifications.push(message) },
    };
}

async function mutate(pi, ctx, event) {
    return pi.handlers.get("tool_result")(
        {
            type: "tool_result",
            toolCallId: "probe",
            content: [],
            isError: false,
            ...event,
        },
        ctx
    );
}

async function runHelper(cwd, operation, slug, contentFile) {
    const process = Bun.spawn([HELPER, operation, "--slug", slug, "--content-file", contentFile], {
        cwd,
        stdout: "pipe",
        stderr: "pipe",
    });
    const [stdout, stderr, code] = await Promise.all([
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
        process.exited,
    ]);
    return { stdout: stdout.trim(), stderr: stderr.trim(), code };
}

async function exists(filePath) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

afterEach(async () => {
    await Promise.all(cleanups.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("plan-artifact-sync extension", () => {
    test("uses native OMP approval and never registers an execution gate or archive tool", () => {
        const pi = createFakePi();
        planArtifactSync(pi);

        expect([...pi.handlers.keys()]).toEqual(["tool_result"]);
        expect(pi.handlers.has("before_agent_start")).toBe(false);
        expect(pi.handlers.has("tool_call")).toBe(false);
        expect(pi.tools).toEqual([]);
    });

    test("mirrors logical and physical write/edit event paths byte-exactly", async () => {
        const files = await fixture();
        const pi = createFakePi();
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);
        planArtifactSync(pi);

        const events = [
            { toolName: "write", input: { path: "local://demo-plan.md" } },
            { toolName: "write", input: { path: files.localPath } },
            { toolName: "edit", input: { input: `[${files.localPath}#ABCD]\nPUT 1.=1:\n+# Mirror probe` } },
            { toolName: "edit", input: {}, details: { path: files.localPath } },
            { toolName: "edit", input: {}, details: { resolvedPath: files.localPath } },
        ];

        for (const [index, event] of events.entries()) {
            await writeFile(files.localPath, planBytes({ body: `revision ${index}` }));
            await mutate(pi, ctx, event);
            expect(await readFile(files.active)).toEqual(await readFile(files.localPath));
        }
        expect(notifications).toEqual([]);
    });

    test("expands tilde paths and ignores unrelated files", async () => {
        const root = await temporaryDirectory("omp-plan-sync-repo-");
        const fakeHome = await temporaryDirectory("omp-plan-sync-home-");
        const localRoot = join(fakeHome, "local");
        const localPath = join(localRoot, "demo-plan.md");
        const unrelated = join(root, "demo-plan.md");
        await mkdir(localRoot, { recursive: true });
        await writeFile(localPath, planBytes());
        await writeFile(unrelated, planBytes());
        const pi = createFakePi();
        const ctx = context(root, localRoot);
        planArtifactSync(pi);
        const originalHome = process.env.HOME;
        process.env.HOME = fakeHome;
        try {
            await mutate(pi, ctx, { toolName: "write", input: { path: "~/local/demo-plan.md" } });
            expect(await readFile(join(root, ".agents", "plans", "2026-08-10-0310_demo.md"))).toEqual(
                await readFile(localPath)
            );

            const calls = [];
            const originalExec = pi.exec;
            pi.exec = async (...args) => {
                calls.push(args);
                return originalExec(...args);
            };
            await mutate(pi, ctx, { toolName: "write", input: { path: unrelated } });
            expect(calls).toEqual([]);
        } finally {
            process.env.HOME = originalHome;
        }
    });

    test("archives a terminal mutation without changing the local authority", async () => {
        const files = await fixture();
        const pi = createFakePi();
        const ctx = context(files.root, files.localRoot);
        planArtifactSync(pi);
        const complete = planBytes({
            status: "DONE",
            taskChecked: true,
            criterionChecked: true,
            completion: "Lifecycle complete.",
        });
        await writeFile(files.localPath, complete);

        await mutate(pi, ctx, {
            toolName: "edit",
            input: { input: `[${files.localPath}#CDEF]\nPUT 1.=1:\n+# Mirror probe` },
        });

        expect(await exists(files.active)).toBe(false);
        expect(await readFile(files.archived)).toEqual(complete);
        expect(await readFile(files.localPath)).toEqual(complete);
    });

    test("warns on projection ambiguity without blocking tools or changing authority", async () => {
        const files = await fixture();
        const notifications = [];
        await mkdir(join(files.root, ".agents", "plans", "archive"), { recursive: true });
        await writeFile(files.active, Buffer.from("active"));
        await writeFile(files.archived, Buffer.from("archive"));
        const authority = await readFile(files.localPath);
        const pi = createFakePi();
        const ctx = context(files.root, files.localRoot, notifications);
        planArtifactSync(pi);

        expect(await mutate(pi, ctx, { toolName: "write", input: { path: files.localPath } })).toBeUndefined();
        expect(notifications).toHaveLength(1);
        expect(notifications[0]).toContain("active and archived targets both exist");
        expect(await readFile(files.localPath)).toEqual(authority);
        expect(await readFile(files.active, "utf8")).toBe("active");
        expect(await readFile(files.archived, "utf8")).toBe("archive");
    });
    test("continues a multi-plan edit after one projection fails", async () => {
        const root = await temporaryDirectory("omp-plan-sync-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-local-");
        const badPath = join(localRoot, "bad-plan.md");
        const goodPath = join(localRoot, "good-plan.md");
        const badActive = join(root, ".agents", "plans", "2026-08-10-0310_bad.md");
        const badArchive = join(root, ".agents", "plans", "archive", "2026-08-10-0310_bad.md");
        const goodActive = join(root, ".agents", "plans", "2026-08-10-0310_good.md");
        await mkdir(join(root, ".agents", "plans", "archive"), { recursive: true });
        await writeFile(badPath, planBytes({ body: "bad local mutation" }));
        await writeFile(goodPath, planBytes({ body: "good local mutation" }));
        await writeFile(badActive, "active");
        await writeFile(badArchive, "archive");
        const notifications = [];
        const pi = createFakePi();
        planArtifactSync(pi);

        await mutate(pi, context(root, localRoot, notifications), {
            toolName: "edit",
            input: { input: `[${badPath}#ABCD]\nPUT 1.=1:\n+# Bad\n[${goodPath}#CDEF]\nPUT 1.=1:\n+# Good` },
        });

        expect(notifications).toHaveLength(1);
        expect(notifications[0]).toContain("bad: ERROR: active and archived targets both exist");
        expect(await readFile(goodActive)).toEqual(await readFile(goodPath));
        expect(await readFile(badActive, "utf8")).toBe("active");
        expect(await readFile(badArchive, "utf8")).toBe("archive");
    });

    test("warns on a lost acknowledgement after effect and continues later identities", async () => {
        const root = await temporaryDirectory("omp-plan-sync-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-local-");
        const firstPath = join(localRoot, "first-plan.md");
        const laterPath = join(localRoot, "later-plan.md");
        const firstActive = join(root, ".agents", "plans", "2026-08-10-0310_first.md");
        const laterActive = join(root, ".agents", "plans", "2026-08-10-0310_later.md");
        await mkdir(join(root, ".agents", "plans"), { recursive: true });
        await writeFile(firstPath, planBytes({ body: "first effect" }));
        await writeFile(laterPath, planBytes({ body: "later effect" }));
        const notifications = [];
        const pi = createFakePi();
        const originalExec = pi.exec;
        pi.exec = async (command, args, options) => {
            const result = await originalExec(command, args, options);
            return args.includes("first") ? { ...result, stdout: "" } : result;
        };
        planArtifactSync(pi);

        await mutate(pi, context(root, localRoot, notifications), {
            toolName: "edit",
            input: { input: `[${firstPath}#ABCD]\nPUT 1.=1:\n+# First\n[${laterPath}#CDEF]\nPUT 1.=1:\n+# Later` },
        });

        expect(notifications).toHaveLength(1);
        expect(notifications[0]).toContain("first: helper acknowledgement was missing or invalid");
        expect(await readFile(firstActive)).toEqual(await readFile(firstPath));
        expect(await readFile(laterActive)).toEqual(await readFile(laterPath));
    });
});

describe("omp-copy-plan-artifact", () => {
    test("keeps incomplete and malformed terminal lifecycles active", async () => {
        const complete = planBytes({
            status: "DONE",
            taskChecked: true,
            criterionChecked: true,
            completion: "Looks complete.",
        }).toString("utf8");
        for (const source of [
            planBytes(),
            planBytes({ status: "DONE", taskChecked: true, criterionChecked: false }),
            planBytes({ status: "DONE", taskChecked: true, criterionChecked: true, completion: "   " }),
            Buffer.from(complete.replace("T1.", "T0.")),
            Buffer.from(complete.replace("T1.", "T01.")),
        ]) {
            const files = await fixture();
            await writeFile(files.localPath, source);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(0);
            expect(result.stdout).toContain("plan-artifact-synced:");
            expect(await readFile(files.active)).toEqual(source);
            expect(await exists(files.archived)).toBe(false);
        }
    });

    test("archives complete projections and updates the archived identity in place", async () => {
        const files = await fixture();
        const complete = planBytes({
            status: "DONE",
            taskChecked: true,
            criterionChecked: true,
            completion: "Complete.",
        });
        await writeFile(files.localPath, complete);
        const archived = await runHelper(files.root, "sync", "demo", files.localPath);
        expect(archived.code).toBe(0);
        expect(archived.stdout).toContain("plan-artifact-archived:");
        expect(await exists(files.active)).toBe(false);
        expect(await readFile(files.archived)).toEqual(complete);

        const override = planBytes({ status: "IN_PROGRESS", body: "Later authority override." });
        await writeFile(files.localPath, override);
        const updated = await runHelper(files.root, "sync", "demo", files.localPath);
        expect(updated.code).toBe(0);
        expect(updated.stdout).toContain("plan-artifact-already-archived:");
        expect(await exists(files.active)).toBe(false);
        expect(await readFile(files.archived)).toEqual(override);
        expect(await readFile(files.localPath)).toEqual(override);
    });

    test("archives uppercase checked Markdown lifecycles", async () => {
        const files = await fixture();
        const complete = Buffer.from(
            planBytes({
                status: "DONE",
                taskChecked: true,
                criterionChecked: true,
                completion: "Uppercase checks complete.",
            })
                .toString("utf8")
                .replaceAll("[x]", "[X]")
        );
        await writeFile(files.localPath, complete);

        const archived = await runHelper(files.root, "sync", "demo", files.localPath);

        expect(archived.code).toBe(0);
        expect(archived.stdout).toContain("plan-artifact-archived:");
        expect(await exists(files.active)).toBe(false);
        expect(await readFile(files.archived)).toEqual(complete);
        expect(await readFile(files.localPath)).toEqual(complete);
    });

    test("rejects noncanonical core datetime metadata without creating a projection", async () => {
        const files = await fixture();
        const malformed = Buffer.from(planBytes().toString("utf8").replace("**Datetime**: ", "**Datetime**:"));
        await writeFile(files.localPath, malformed);

        const synchronized = await runHelper(files.root, "sync", "demo", files.localPath);

        expect(synchronized.code).toBe(1);
        expect(synchronized.stderr).toContain("canonical **Datetime**");
        expect(await exists(files.active)).toBe(false);
        expect(await exists(files.archived)).toBe(false);
        expect(await readFile(files.localPath)).toEqual(malformed);
    });

    test("keeps noncanonical terminal-only metadata active", async () => {
        const canonical = planBytes({
            status: "DONE",
            taskChecked: true,
            criterionChecked: true,
            completion: "Canonical completion.",
        }).toString("utf8");
        for (const name of ["Scope", "Summary", "Status"]) {
            const files = await fixture();
            const malformed = Buffer.from(canonical.replace(`**${name}**: `, `**${name}**:`));
            await writeFile(files.localPath, malformed);

            const synchronized = await runHelper(files.root, "sync", "demo", files.localPath);

            expect(synchronized.code).toBe(0);
            expect(synchronized.stdout).toContain("plan-artifact-synced:");
            expect(await readFile(files.active)).toEqual(malformed);
            expect(await exists(files.archived)).toBe(false);
            expect(await readFile(files.localPath)).toEqual(malformed);
        }
    });

    test("fails closed on active/archive ambiguity and target symlinks", async () => {
        const files = await fixture();
        await mkdir(join(files.root, ".agents", "plans", "archive"), { recursive: true });
        await writeFile(files.active, Buffer.from("active"));
        await writeFile(files.archived, Buffer.from("archive"));
        const ambiguous = await runHelper(files.root, "sync", "demo", files.localPath);
        expect(ambiguous.code).toBe(1);
        expect(ambiguous.stderr).toContain("active and archived targets both exist");
        expect(await readFile(files.active, "utf8")).toBe("active");
        expect(await readFile(files.archived, "utf8")).toBe("archive");

        await rm(files.active);
        await rm(files.archived);
        const outside = join(files.root, "outside.md");
        await writeFile(outside, "outside");
        await symlink(outside, files.active);
        const unsafe = await runHelper(files.root, "sync", "demo", files.localPath);
        expect(unsafe.code).toBe(1);
        expect(unsafe.stderr).toContain("regular non-symlink file");
        expect(await readFile(outside, "utf8")).toBe("outside");
    });

    test("rejects malformed sources without creating a projection", async () => {
        const files = await fixture();
        for (const source of [Buffer.alloc(0), Buffer.from([0xff]), Buffer.from("not a plan\n")]) {
            await rm(files.active, { force: true });
            await writeFile(files.localPath, source);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(await exists(files.active)).toBe(false);
            expect(await exists(files.archived)).toBe(false);
        }
    });

    test("serializes overlapping synchronization for one identity", async () => {
        const files = await fixture({ body: "concurrent" });
        const results = await Promise.all(
            Array.from({ length: 8 }, () => runHelper(files.root, "sync", "demo", files.localPath))
        );
        expect(results.every((result) => result.code === 0)).toBe(true);
        expect(await readFile(files.active)).toEqual(await readFile(files.localPath));
        expect(await exists(files.archived)).toBe(false);
    });

    test("publishes one owner when a paused creator, reclaimer, and third contender collide", async () => {
        const root = await temporaryDirectory("omp-plan-lock-publish-");
        const lockPath = join(root, "generation.lock");
        const ownerPath = join(lockPath, "owner.json");
        await mkdir(lockPath);
        const reclaimer = JSON.stringify({
            pid: process.pid,
            createdAt: new Date().toISOString(),
            token: "active-reclaimer",
        });
        const pausedCreator = JSON.stringify({
            pid: process.pid,
            createdAt: new Date().toISOString(),
            token: "paused-creator",
        });
        const thirdContender = JSON.stringify({
            pid: process.pid,
            createdAt: new Date().toISOString(),
            token: "third-contender",
        });

        expect(await publishLockRecord(ownerPath, reclaimer)).toBe("published");
        expect(await publishLockRecord(ownerPath, pausedCreator)).toBe("occupied");
        expect(await publishLockRecord(ownerPath, thirdContender)).toBe("occupied");
        expect(await readFile(ownerPath, "utf8")).toBe(reclaimer);

        await rm(lockPath, { recursive: true });
        await mkdir(lockPath);
        expect(await publishLockRecord(ownerPath, thirdContender)).toBe("published");
        expect(await readFile(ownerPath, "utf8")).toBe(thirdContender);
    });

    test("reclaims one stale generation before concurrent synchronization", async () => {
        const files = await fixture({ body: "stale lock" });
        const planId = "2026-08-10-0310_demo";
        const canonicalRoot = await realpath(files.root);
        const lockKey = createHash("sha256").update(`${canonicalRoot}\0${planId}`).digest("hex");
        const lockPath = join(tmpdir(), "omp-plan-artifact-locks", `${lockKey}.lock`);
        await rm(lockPath, { recursive: true, force: true });
        await mkdir(lockPath, { recursive: true });
        await writeFile(
            join(lockPath, "owner.json"),
            JSON.stringify({ pid: 99999999, createdAt: "2000-01-01T00:00:00.000Z", token: "dead-generation" })
        );

        try {
            const results = await Promise.all(
                Array.from({ length: 16 }, () => runHelper(files.root, "sync", "demo", files.localPath))
            );
            expect(results.every((result) => result.code === 0)).toBe(true);
            expect(await readFile(files.active)).toEqual(await readFile(files.localPath));
            expect(await exists(files.archived)).toBe(false);
            expect(await exists(lockPath)).toBe(false);
        } finally {
            await rm(lockPath, { recursive: true, force: true });
        }
    });

    test("reclaims a malformed stale owner record", async () => {
        const files = await fixture({ body: "malformed stale lock" });
        const planId = "2026-08-10-0310_demo";
        const canonicalRoot = await realpath(files.root);
        const lockKey = createHash("sha256").update(`${canonicalRoot}\0${planId}`).digest("hex");
        const lockPath = join(tmpdir(), "omp-plan-artifact-locks", `${lockKey}.lock`);
        await rm(lockPath, { recursive: true, force: true });
        await mkdir(lockPath, { recursive: true });
        await writeFile(join(lockPath, "owner.json"), "{invalid-json");
        const staleTime = new Date("2000-01-01T00:00:00.000Z");
        await utimes(lockPath, staleTime, staleTime);

        try {
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(0);
            expect(result.stdout).toContain("plan-artifact-synced:");
            expect(await readFile(files.active)).toEqual(await readFile(files.localPath));
            expect(await exists(files.archived)).toBe(false);
            expect(await exists(lockPath)).toBe(false);
        } finally {
            await rm(lockPath, { recursive: true, force: true });
        }
    });

    test("synchronizes different identities independently", async () => {
        const root = await temporaryDirectory("omp-plan-sync-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-local-");
        const demoPath = join(localRoot, "demo-plan.md");
        const otherPath = join(localRoot, "other-plan.md");
        const demo = planBytes({ body: "demo identity" });
        const other = planBytes({ body: "other identity" });
        await mkdir(join(root, ".agents", "plans"), { recursive: true });
        await writeFile(demoPath, demo);
        await writeFile(otherPath, other);

        const [demoResult, otherResult] = await Promise.all([
            runHelper(root, "sync", "demo", demoPath),
            runHelper(root, "sync", "other", otherPath),
        ]);

        expect(demoResult.code).toBe(0);
        expect(otherResult.code).toBe(0);
        expect(demoResult.stdout).toContain("2026-08-10-0310_demo.md");
        expect(otherResult.stdout).toContain("2026-08-10-0310_other.md");
        expect(await readFile(join(root, ".agents", "plans", "2026-08-10-0310_demo.md"))).toEqual(demo);
        expect(await readFile(join(root, ".agents", "plans", "2026-08-10-0310_other.md"))).toEqual(other);
    });

    test("classifies a discarded acknowledgement without retrying or rolling back local authority", async () => {
        const files = await fixture({ body: "captured revision" });
        const captured = await readFile(files.localPath);
        const result = await runHelper(files.root, "sync", "demo", files.localPath);
        expect(result.code).toBe(0);

        const current = planBytes({ body: "new local revision after discarded acknowledgement" });
        await writeFile(files.localPath, current);

        expect(await readFile(files.active)).toEqual(captured);
        expect(await readFile(files.localPath)).toEqual(current);
        expect(await readFile(files.active)).not.toEqual(await readFile(files.localPath));
        expect(await exists(files.archived)).toBe(false);
    });

    test("reports source drift after an atomic projection effect and preserves both exact revisions", async () => {
        const files = await fixture();
        const captured = planBytes({ body: "a".repeat(64 * 1024 * 1024) });
        const current = planBytes({ body: "b".repeat(64 * 1024 * 1024) });
        const replacement = join(files.localRoot, "replacement.tmp");
        await writeFile(files.localPath, captured);
        await writeFile(replacement, current);
        const process = Bun.spawn([HELPER, "sync", "--slug", "demo", "--content-file", files.localPath], {
            cwd: files.root,
            stdout: "pipe",
            stderr: "pipe",
        });
        let exited;
        process.exited.then((code) => {
            exited = code;
        });
        const deadline = Date.now() + 10_000;
        while (!(await exists(files.active)) && exited === undefined && Date.now() < deadline) {
            await Bun.sleep(1);
        }
        expect(await exists(files.active)).toBe(true);
        await rename(replacement, files.localPath);
        const [stdout, stderr, code] = await Promise.all([
            new Response(process.stdout).text(),
            new Response(process.stderr).text(),
            process.exited,
        ]);

        expect(code).toBe(1);
        expect(stdout).toBe("");
        expect(stderr).toContain("content changed during synchronization");
        expect(await readFile(files.active)).toEqual(captured);
        expect(await readFile(files.localPath)).toEqual(current);
        expect(await exists(files.archived)).toBe(false);
    });

    test("removes preflight and explicit archive operations", async () => {
        const files = await fixture();
        for (const operation of ["preflight", "archive"]) {
            const result = await runHelper(files.root, operation, "demo", files.localPath);
            expect(result.code).toBe(2);
            expect(result.stderr).toContain("expected operation 'sync'");
        }
        expect(await exists(files.active)).toBe(false);
        expect(await exists(files.archived)).toBe(false);
    });

    test("rejects relative and mismatched content identities before projection", async () => {
        const files = await fixture();
        const relative = await runHelper(files.root, "sync", "demo", "demo-plan.md");
        expect(relative.code).toBe(2);
        expect(relative.stderr).toContain("--content-file must be an absolute path");

        const mismatched = await runHelper(files.root, "sync", "other", files.localPath);
        expect(mismatched.code).toBe(1);
        expect(mismatched.stderr).toContain("content file identity must match slug");
        expect(await exists(files.active)).toBe(false);
        expect(await exists(files.archived)).toBe(false);
    });
});
