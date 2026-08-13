import { createHash } from "node:crypto";
import { afterEach, describe, expect, mock, test } from "bun:test";
import {
    access,
    chmod,
    mkdir,
    mkdtemp,
    lstat,
    open,
    readFile,
    readdir,
    realpath,
    rename,
    rm,
    symlink,
    utimes,
    writeFile,
} from "node:fs/promises";
import { mkdirSync, renameSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

mock.module("@oh-my-pi/pi-coding-agent/internal-urls", () => ({
    resolveLocalUrlToPath(value, options) {
        if (!value.startsWith("local://")) throw new Error(`not a local URI: ${value}`);
        if (value === "local://url-failure-plan.md") {
            const failure = new Error(`resolver rejected ${join(options.localRoot, value.slice("local://".length))}`);
            failure.code = "URL_FAILURE";
            failure.cause = options.localRoot;
            throw failure;
        }
        return join(options.localRoot, value.slice("local://".length));
    },
}));

const CANDIDATE_ROOT = resolve(import.meta.dir, "../../../../../..");
const DOTFILES = join(CANDIDATE_ROOT, ".dotfiles");
const HELPER = join(DOTFILES, "bin/omp-copy-plan-artifact");
const PYTHON_PARSER = join(CANDIDATE_ROOT, ".agents/skills/dev-implementation/scripts/executor_plan.py");
const PYTHON_FIXTURE = join(
    CANDIDATE_ROOT,
    ".agents/skills/dev-implementation/scripts/fixtures/executor_plan/complete.md"
);
const CANDIDATE_EXTENSION = join(import.meta.dir, "plan-artifact-sync.js");
const {
    linkGenerationNoOverwrite,
    publishLockRecord,
    readVerifiedTargetDescriptor,
    releaseLock,
} = await import(HELPER);
const { default: planArtifactSync } = await import(CANDIDATE_EXTENSION);
const cleanups = [];

function planBytes({
    datetime = "2026-08-10-0310",
    authorityKind = "local-authority",
    mode,
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
            `**Authority kind**: ${authorityKind}`,
            ...(mode ? [`**Mode**: ${mode}`] : []),
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
            const executable = command.endsWith("/omp-copy-plan-artifact") ? HELPER : command;
            const process = Bun.spawn([executable, ...args], {
                cwd: options.cwd,
                stdout: "pipe",
                stderr: "pipe",
                env: options.env,
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

async function runHelper(cwd, operation, slug, contentFile, env = undefined) {
    const process = Bun.spawn([HELPER, operation, "--slug", slug, "--content-file", contentFile], {
        cwd,
        env,
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

function spawnHelper(cwd, slug, contentFile) {
    return Bun.spawn([HELPER, "sync", "--slug", slug, "--content-file", contentFile], {
        cwd,
        stdout: "pipe",
        stderr: "pipe",
    });
}

async function finishProcess(process) {
    const [stdout, stderr, code] = await Promise.all([
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
        process.exited,
    ]);
    return { stdout: stdout.trim(), stderr: stderr.trim(), code };
}

function sha256(bytes) {
    return createHash("sha256").update(bytes).digest("hex");
}

function parseObservedWarningRecords(message) {
    if (message === null) return [];
    expect(message.startsWith("plan-artifact-sync: ")).toBe(true);
    return message
        .slice("plan-artifact-sync: ".length)
        .split("; ")
        .map((entry) => {
            const sync =
                /^(?<identity>[a-z0-9]+(?:-[a-z0-9]+)*): ERROR: (?<code>[A-Z0-9_]+) scope="(?<scope>active|archive|identity)" effect=(?<effect>none|possible-complete)$/.exec(
                    entry
                );
            if (sync) {
                return {
                    kind: "sync",
                    scope: sync.groups.scope,
                    code: sync.groups.code,
                    identity: sync.groups.identity,
                    effect: sync.groups.effect,
                };
            }
            const identified =
                /^(?<identity>[a-z0-9]+(?:-[a-z0-9]+)*): ERROR: (?<code>[A-Z0-9_]+) scope="(?<scope>active|archive|local root|identity)"$/.exec(
                    entry
                );
            if (identified) {
                return {
                    kind: "discovery",
                    scope: identified.groups.scope,
                    code: identified.groups.code,
                    identity: identified.groups.identity,
                };
            }
            const discovery =
                /^(?<scope>active|archive|local root|identity): ERROR: (?<code>[A-Z0-9_]+)$/.exec(entry);
            expect(discovery).not.toBeNull();
            return {
                kind: "discovery",
                scope: discovery.groups.scope,
                code: discovery.groups.code,
                identity: null,
            };
        });
}

function observedWarningEvidenceRow(scenarioId, uiCalls, consoleCalls, helperCalls) {
    expect(uiCalls.length + consoleCalls.length).toBeLessThanOrEqual(1);
    const sinkCall = uiCalls[0] ?? consoleCalls[0];
    const message = sinkCall?.message ?? null;
    return {
        trusted_scenario_id: scenarioId,
        records: parseObservedWarningRecords(message),
        sink: {
            channel: uiCalls.length === 1 ? "ctx.ui.notify" : consoleCalls.length === 1 ? "console.error" : "none",
            count: uiCalls.length + consoleCalls.length,
            severity: uiCalls[0]?.severity ?? null,
            prefix: message === null ? null : "plan-artifact-sync: ",
            message,
        },
        helper_calls: helperCalls,
    };
}

async function expectPathSafeFailure(result, forbiddenPaths) {
    const rendered = JSON.stringify(result);
    const forbidden = new Set([tmpdir(), CANDIDATE_ROOT, CANDIDATE_EXTENSION]);
    for (const filePath of forbiddenPaths) {
        if (!filePath) continue;
        forbidden.add(filePath);
        try {
            forbidden.add(await realpath(filePath));
        } catch {
            // Missing and unsafe paths are still checked by their lexical spelling.
        }
    }
    try {
        forbidden.add(await realpath(tmpdir()));
    } catch {
        // The lexical temporary root remains covered.
    }
    for (const filePath of forbidden) {
        if (filePath.startsWith("/")) expect(rendered).not.toContain(filePath);
    }
    expect(result.stdout).toBe("");
}

async function waitUntil(predicate, timeout = 10_000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        if (await predicate()) return;
        await Bun.sleep(1);
    }
    throw new Error("timed out waiting for deterministic test seam");
}

async function runPythonParser(planPath, contextName, consumer) {
    const process = Bun.spawn(
        ["python3", PYTHON_PARSER, planPath, "--context", contextName, "--consumer", consumer],
        { stdout: "pipe", stderr: "pipe" }
    );
    const result = await finishProcess(process);
    return { ...result, payload: JSON.parse(result.stdout) };
}
async function runPythonPreflight(planPath, contextName, slug, repositoryRoot, localRoot, localPlan) {
    const process = Bun.spawn(
        [
            "python3",
            PYTHON_PARSER,
            planPath,
            "--context",
            contextName,
            "--consumer",
            "backend",
            "--slug",
            slug,
            "--repository-root",
            repositoryRoot,
            "--local-root",
            localRoot,
            "--local-plan",
            localPlan,
        ],
        { stdout: "pipe", stderr: "pipe" }
    );
    const result = await finishProcess(process);
    return { ...result, payload: JSON.parse(result.stdout) };
}


async function planLockPath(root, planId) {
    const canonicalRoot = await realpath(root);
    const key = createHash("sha256").update(`${canonicalRoot}\0${planId}`).digest("hex");
    return join(tmpdir(), "omp-plan-artifact-locks", `${key}.lock`);
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
        expect(notifications).toEqual([
            'plan-artifact-sync: demo: ERROR: PLAN_PROJECTION_AMBIGUOUS scope="identity" effect=none',
        ]);
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
        expect(notifications).toEqual([
            'plan-artifact-sync: bad: ERROR: PLAN_PROJECTION_AMBIGUOUS scope="identity" effect=none',
        ]);
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
        expect(notifications).toEqual([
            'plan-artifact-sync: first: ERROR: PLAN_SYNC_ACK_INVALID scope="identity" effect=possible-complete',
        ]);
        expect(await readFile(firstActive)).toEqual(await readFile(firstPath));
        expect(await readFile(laterActive)).toEqual(await readFile(laterPath));
    });

    test("reports helper unavailability per identity without disabling later synchronization", async () => {
        const root = await temporaryDirectory("omp-plan-sync-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-local-");
        const missingPath = join(localRoot, "missing-plan.md");
        const laterPath = join(localRoot, "later-plan.md");
        const laterActive = join(root, ".agents", "plans", "2026-08-10-0310_later.md");
        await mkdir(join(root, ".agents", "plans"), { recursive: true });
        await writeFile(missingPath, planBytes({ body: "missing helper identity" }));
        await writeFile(laterPath, planBytes({ body: "later identity" }));
        const notifications = [];
        const pi = createFakePi();
        const originalExec = pi.exec;
        pi.exec = async (command, args, options) =>
            args.includes("missing")
                ? { code: 127, stdout: "", stderr: "helper unavailable" }
                : originalExec(command, args, options);
        planArtifactSync(pi);

        await mutate(pi, context(root, localRoot, notifications), {
            toolName: "edit",
            input: {
                input: `[${missingPath}#ABCD]\nPUT 1.=1:\n+# Missing\n[${laterPath}#CDEF]\nPUT 1.=1:\n+# Later`,
            },
        });

        expect(notifications).toHaveLength(1);
        expect(notifications).toEqual([
            'plan-artifact-sync: missing: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete',
        ]);
        expect(await readFile(laterActive)).toEqual(await readFile(laterPath));
    });

    test("redacts unsafe storage paths through the extension warning seam", async () => {
        const root = await temporaryDirectory("omp-plan-sync-warning-root-");
        const localRoot = await temporaryDirectory("omp-plan-sync-warning-local-");
        const outside = await temporaryDirectory("omp-plan-sync-warning-outside-");
        const localPath = join(localRoot, "demo-plan.md");
        const sentinel = join(outside, "sentinel");
        await writeFile(localPath, planBytes());
        await writeFile(sentinel, "unchanged");
        await symlink(outside, join(root, ".agents"));
        const notifications = [];
        const pi = createFakePi();
        planArtifactSync(pi);

        await mutate(pi, context(root, localRoot, notifications), {
            toolName: "write",
            input: { path: "local://demo-plan.md" },
        });

        expect(notifications).toHaveLength(1);
        expect(notifications).toEqual([
            'plan-artifact-sync: demo: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete',
        ]);
        await expectPathSafeFailure(
            { stdout: "", stderr: notifications[0], code: 1 },
            [root, localRoot, localPath, outside, sentinel]
        );
        expect(await readFile(sentinel, "utf8")).toBe("unchanged");
        expect(await readdir(outside)).toEqual(["sentinel"]);
    });

    test("maps missing, unreadable, symlink, and non-directory roots to closed discovery warnings", async () => {
        const root = await temporaryDirectory("omp-plan-sync-root-matrix-repo-");
        const deniedRoot = await temporaryDirectory("omp-plan-sync-root-matrix-denied-");
        const unsafeRoot = join(await temporaryDirectory("omp-plan-sync-root-matrix-file-"), "not-a-directory");
        const symlinkParent = await temporaryDirectory("omp-plan-sync-root-matrix-link-");
        const symlinkRoot = join(symlinkParent, "local");
        const symlinkTarget = await temporaryDirectory("omp-plan-sync-root-matrix-target-");
        const missingRoot = join(await temporaryDirectory("omp-plan-sync-root-matrix-missing-"), "absent");
        const eventRoot = await temporaryDirectory("omp-plan-sync-root-matrix-event-");
        const eventPath = join(eventRoot, "demo-plan.md");
        await writeFile(eventPath, planBytes());
        await writeFile(unsafeRoot, "not a directory");
        await symlink(symlinkTarget, symlinkRoot);

        const cases = [
            [missingRoot, "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_MISSING"],
            [deniedRoot, "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNREADABLE"],
            [unsafeRoot, "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE"],
            [symlinkRoot, "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE"],
        ];
        await chmod(deniedRoot, 0o000);
        try {
            for (const [localRoot, expected] of cases) {
                const calls = [];
                const pi = createFakePi();
                planArtifactSync(pi);
                const result = await mutate(
                    pi,
                    {
                        cwd: root,
                        localProtocolOptions: { localRoot },
                        ui: { notify: (message, severity) => calls.push({ message, severity }) },
                    },
                    { toolName: "write", input: { path: eventPath } }
                );
                expect(result).toBeUndefined();
                expect(calls).toEqual([{ message: expected, severity: "warning" }]);
                await expectPathSafeFailure({ stdout: "", stderr: calls[0].message, code: 1 }, [
                    root,
                    localRoot,
                    symlinkTarget,
                ]);
            }
        } finally {
            await chmod(deniedRoot, 0o700);
        }
    });

    test("keeps unrelated and missing logical or physical candidates silent before root discovery", async () => {
        const repositoryRoot = await temporaryDirectory("omp-plan-sync-no-candidate-repo-");
        const existingRoot = await temporaryDirectory("omp-plan-sync-no-candidate-local-");
        const deniedRoot = await temporaryDirectory("omp-plan-sync-no-candidate-denied-");
        const missingRoot = join(await temporaryDirectory("omp-plan-sync-no-candidate-missing-"), "absent");
        const missingPhysical = join(existingRoot, "missing-plan.md");
        const cases = [
            [missingRoot, { toolName: "write", input: { path: "notes.txt" } }],
            [deniedRoot, { toolName: "edit", input: { path: "notes.txt" } }],
            [existingRoot, { toolName: "write", input: { path: "local://missing-plan.md" } }],
            [existingRoot, { toolName: "edit", input: { path: missingPhysical } }],
        ];

        await chmod(deniedRoot, 0o000);
        try {
            for (const [localRoot, event] of cases) {
                const notifications = [];
                const pi = createFakePi();
                let helperCalls = 0;
                pi.exec = async () => {
                    helperCalls += 1;
                    return { code: 0, stdout: "", stderr: "" };
                };
                planArtifactSync(pi);
                expect(await mutate(pi, context(repositoryRoot, localRoot, notifications), event)).toBeUndefined();
                expect(notifications).toEqual([]);
                expect(helperCalls).toBe(0);
            }
        } finally {
            await chmod(deniedRoot, 0o700);
        }
    });

    test("pins root and candidate identities before the helper and through its no-follow read", async () => {
        {
            const files = await fixture();
            const movedRoot = `${files.localRoot}-moved`;
            const outside = await temporaryDirectory("omp-plan-sync-root-replacement-");
            const sentinel = join(outside, "demo-plan.md");
            await writeFile(sentinel, planBytes({ body: "replacement root sentinel" }));
            const notifications = [];
            const pi = createFakePi();
            const originalExec = pi.exec.bind(pi);
            let helperCalls = 0;
            Object.defineProperty(pi, "exec", {
                configurable: true,
                get() {
                    renameSync(files.localRoot, movedRoot);
                    symlinkSync(outside, files.localRoot);
                    return async (...args) => {
                        helperCalls += 1;
                        return originalExec(...args);
                    };
                },
            });
            planArtifactSync(pi);
            try {
                expect(
                    await mutate(pi, context(files.root, files.localRoot, notifications), {
                        toolName: "write",
                        input: { path: files.localPath },
                    })
                ).toBeUndefined();
                expect(notifications).toEqual([
                    "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE",
                ]);
                expect(helperCalls).toBe(0);
                expect(await readFile(sentinel)).toEqual(planBytes({ body: "replacement root sentinel" }));
                expect(await exists(files.active)).toBe(false);
            } finally {
                unlinkSync(files.localRoot);
                renameSync(movedRoot, files.localRoot);
            }
        }

        {
            const files = await fixture();
            const movedRoot = `${files.localRoot}-moved`;
            const replacement = planBytes({ body: "replacement directory sentinel" });
            const notifications = [];
            const pi = createFakePi();
            const originalExec = pi.exec.bind(pi);
            let helperCalls = 0;
            Object.defineProperty(pi, "exec", {
                configurable: true,
                get() {
                    renameSync(files.localRoot, movedRoot);
                    mkdirSync(files.localRoot);
                    writeFileSync(files.localPath, replacement);
                    return async (...args) => {
                        helperCalls += 1;
                        return originalExec(...args);
                    };
                },
            });
            planArtifactSync(pi);
            try {
                expect(
                    await mutate(pi, context(files.root, files.localRoot, notifications), {
                        toolName: "write",
                        input: { path: files.localPath },
                    })
                ).toBeUndefined();
                expect(notifications).toEqual([
                    "plan-artifact-sync: local root: ERROR: PLAN_SYNC_UNAVAILABLE",
                ]);
                expect(helperCalls).toBe(0);
                expect(await readFile(files.localPath)).toEqual(replacement);
                expect(await exists(files.active)).toBe(false);
            } finally {
                await rm(files.localRoot, { recursive: true, force: true });
                renameSync(movedRoot, files.localRoot);
            }
        }

        {
            const files = await fixture();
            const originalPath = `${files.localPath}.original`;
            const replacement = planBytes({ body: "replacement candidate sentinel" });
            const notifications = [];
            const pi = createFakePi();
            const originalExec = pi.exec.bind(pi);
            let helperCalls = 0;
            Object.defineProperty(pi, "exec", {
                configurable: true,
                get() {
                    renameSync(files.localPath, originalPath);
                    writeFileSync(files.localPath, replacement);
                    return async (...args) => {
                        helperCalls += 1;
                        return originalExec(...args);
                    };
                },
            });
            planArtifactSync(pi);
            try {
                expect(
                    await mutate(pi, context(files.root, files.localRoot, notifications), {
                        toolName: "write",
                        input: { path: "local://demo-plan.md" },
                    })
                ).toBeUndefined();
                expect(notifications).toEqual([
                    'plan-artifact-sync: demo: ERROR: PLAN_SYNC_UNAVAILABLE scope="identity"',
                ]);
                expect(helperCalls).toBe(0);
                expect(await readFile(files.localPath)).toEqual(replacement);
                expect(await exists(files.active)).toBe(false);
            } finally {
                unlinkSync(files.localPath);
                renameSync(originalPath, files.localPath);
            }
        }

        {
            const files = await fixture();
            const pi = createFakePi();
            const originalExec = pi.exec.bind(pi);
            let observed;
            pi.exec = async (command, args, options) => {
                observed = { args, options };
                return originalExec(command, args, options);
            };
            planArtifactSync(pi);
            const notifications = [];
            expect(
                await mutate(pi, context(files.root, files.localRoot, notifications), {
                    toolName: "write",
                    input: { path: "local://demo-plan.md" },
                })
            ).toBeUndefined();
            expect(notifications).toEqual([]);
            expect(observed.args[4]).toBe(await realpath(files.localPath));
            expect(observed.options.env.OMP_PLAN_ARTIFACT_SYNC_ROOT_IDENTITY).toMatch(/^\d+:\d+$/);
            expect(observed.options.env.OMP_PLAN_ARTIFACT_SYNC_SOURCE_IDENTITY).toMatch(/^\d+:\d+$/);
            expect(await readFile(files.active)).toEqual(await readFile(files.localPath));
        }
    });

    test("closes candidate discovery and unknown top-level failures without widening event matching", async () => {
        const root = await temporaryDirectory("omp-plan-sync-discovery-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-discovery-local-");
        const outside = await temporaryDirectory("omp-plan-sync-discovery-outside-");
        const linkPath = join(localRoot, "linked-plan.md");
        const specialPath = join(localRoot, "special-plan.md");
        const unreadablePath = join(localRoot, "unreadable-plan.md");
        const physicalMissing = join(localRoot, "physical-missing-plan.md");
        const outsideFile = join(outside, "raw-content");
        await writeFile(outsideFile, "unchanged");
        await symlink(outsideFile, linkPath);
        await mkdir(specialPath);
        await writeFile(unreadablePath, planBytes());
        await chmod(unreadablePath, 0o000);

        const notifications = [];
        const pi = createFakePi();
        planArtifactSync(pi);
        try {
            const result = await mutate(pi, context(root, localRoot, notifications), {
                toolName: "edit",
                input: {
                    path: "local://missing-plan.md",
                    input: `[${unreadablePath}#ABCD]\nPUT 1.=1:\n+# Unreadable\n[${physicalMissing}#CDEF]\nPUT 1.=1:\n+# Missing`,
                },
                details: {
                    path: "local://url-failure-plan.md",
                    resolvedPath: linkPath,
                    resolved_path: specialPath,
                },
            });
            expect(result).toBeUndefined();
        } finally {
            await chmod(unreadablePath, 0o600);
        }

        expect(notifications).toEqual([
            'plan-artifact-sync: url-failure: ERROR: PLAN_SYNC_UNAVAILABLE scope="identity"; ' +
                'linked: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE scope="identity"; ' +
                'special: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE scope="identity"; ' +
                'unreadable: ERROR: PLAN_SYNC_DISCOVERY_UNREADABLE scope="identity"',
        ]);
        await expectPathSafeFailure({ stdout: "", stderr: notifications[0], code: 1 }, [
            root,
            localRoot,
            outside,
            outsideFile,
            linkPath,
            specialPath,
            unreadablePath,
            physicalMissing,
        ]);
        expect(await readFile(outsideFile, "utf8")).toBe("unchanged");

        const calls = [];
        const ignoredPi = createFakePi();
        ignoredPi.exec = async (...args) => {
            calls.push(args);
            return { code: 0, stdout: "", stderr: "" };
        };
        planArtifactSync(ignoredPi);
        const ignored = context(root, localRoot, []);
        expect(await mutate(ignoredPi, ignored, { toolName: "read", input: { path: unreadablePath } })).toBeUndefined();
        expect(
            await mutate(ignoredPi, ignored, {
                toolName: "write",
                isError: true,
                input: { path: unreadablePath },
            })
        ).toBeUndefined();
        expect(await mutate(ignoredPi, ignored, { toolName: "write", input: { path: physicalMissing } })).toBeUndefined();
        expect(calls).toEqual([]);

        const rawFailure = new Error(`raw top-level ${join(outside, "secret")}`);
        rawFailure.cause = { path: outsideFile };
        rawFailure.stack = `${rawFailure.stack}\n${outsideFile}`;
        const throwingInput = {};
        Object.defineProperty(throwingInput, "path", {
            get() {
                throw rawFailure;
            },
        });
        const consoleMessages = [];
        const originalConsoleError = console.error;
        console.error = (message) => consoleMessages.push(message);
        try {
            const topPi = createFakePi();
            planArtifactSync(topPi);
            expect(
                await mutate(
                    topPi,
                    { cwd: root, localProtocolOptions: { localRoot } },
                    { toolName: "write", input: throwingInput }
                )
            ).toBeUndefined();
        } finally {
            console.error = originalConsoleError;
        }
        expect(consoleMessages).toEqual(["plan-artifact-sync: identity: ERROR: PLAN_SYNC_UNAVAILABLE"]);
        expect(JSON.stringify(consoleMessages)).not.toContain(outside);
        expect(JSON.stringify(consoleMessages)).not.toContain(outsideFile);
    });

    test("validates helper protocol fields, discards raw streams and errors, and preserves first-seen continuation", async () => {
        const root = await temporaryDirectory("omp-plan-sync-helper-matrix-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-helper-matrix-local-");
        const slugs = ["active", "archive", "identity", "rejected", "malformed", "ack", "success"];
        for (const slug of slugs) await writeFile(join(localRoot, `${slug}-plan.md`), planBytes({ body: slug }));
        const rawSecret = join(root, `raw-${Date.now()}-content`);
        const notifications = [];
        const pi = createFakePi();
        const originalExec = pi.exec;
        pi.exec = async (command, args, options) => {
            const slug = args[2];
            const identity = `2026-08-10-0310_${slug}`;
            if (slug === "active") {
                return {
                    code: 1,
                    stdout: `discarded ${rawSecret}`,
                    stderr: `ERROR: PLAN_TARGET_STALE: plan=${identity} state=invalid:stale path=.agents/plans/${identity}.md effect=none: ${rawSecret}\n`,
                };
            }
            if (slug === "archive") {
                return {
                    code: 1,
                    stdout: "",
                    stderr: `ERROR: PLAN_POSTCONDITION_FAILED: plan=${identity} state=postcondition-uncertain path=.agents/plans/archive/${identity}.md effect=possible-complete: ${rawSecret}`,
                };
            }
            if (slug === "identity") {
                return {
                    code: 1,
                    stdout: "",
                    stderr: `ERROR: PLAN_LOCK_UNAVAILABLE: plan=${slug} state=lock-unavailable path=none effect=none: ${rawSecret}`,
                };
            }
            if (slug === "rejected") {
                const error = new Error(`spawn rejected ${rawSecret}`);
                error.cause = rawSecret;
                error.stack = `${error.stack}\n${rawSecret}`;
                throw error;
            }
            if (slug === "malformed") {
                return {
                    code: 1,
                    stdout: `raw stdout ${rawSecret}`,
                    stderr: `ERROR: PLAN_TARGET_STALE: plan=${identity} state=invalid:stale path=.agents/plans/${identity}.md effect=none: ${rawSecret}\nsecond raw line`,
                };
            }
            if (slug === "ack") {
                return { code: 0, stdout: `wrong acknowledgement ${rawSecret}`, stderr: "" };
            }
            return originalExec(command, args, options);
        };
        planArtifactSync(pi);

        const hashline = slugs
            .map((slug, index) => `[${join(localRoot, `${slug}-plan.md`)}#${index.toString(16).padStart(4, "A").toUpperCase()}]`)
            .join("\n");
        expect(
            await mutate(pi, context(root, localRoot, notifications), {
                toolName: "edit",
                input: { input: hashline },
            })
        ).toBeUndefined();

        expect(notifications).toEqual([
            'plan-artifact-sync: active: ERROR: PLAN_TARGET_STALE scope="active" effect=none; ' +
                'archive: ERROR: PLAN_POSTCONDITION_FAILED scope="archive" effect=possible-complete; ' +
                'identity: ERROR: PLAN_LOCK_UNAVAILABLE scope="identity" effect=none; ' +
                'rejected: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete; ' +
                'malformed: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete; ' +
                'ack: ERROR: PLAN_SYNC_ACK_INVALID scope="identity" effect=possible-complete',
        ]);
        const rendered = JSON.stringify(notifications);
        expect(rendered).not.toContain(rawSecret);
        expect(rendered.match(/plan-artifact-sync:/g)).toHaveLength(1);
        expect(await readFile(join(root, ".agents", "plans", "2026-08-10-0310_success.md"))).toEqual(
            await readFile(join(localRoot, "success-plan.md"))
        );
    });

    test("classifies pre-spawn helper unavailability and restores successful silent synchronization", async () => {
        const files = await fixture();
        const helperMode = (await lstat(HELPER)).mode & 0o777;
        const calls = [];
        const pi = createFakePi();
        planArtifactSync(pi);
        const ctx = {
            cwd: files.root,
            localProtocolOptions: { localRoot: files.localRoot },
            ui: { notify: (message, severity) => calls.push({ message, severity }) },
        };

        await chmod(HELPER, 0o000);
        try {
            expect(
                await mutate(pi, ctx, { toolName: "write", input: { path: "local://demo-plan.md" } })
            ).toBeUndefined();
        } finally {
            await chmod(HELPER, helperMode);
        }
        expect(calls).toEqual([
            {
                message:
                    'plan-artifact-sync: demo: ERROR: PLAN_SYNC_HELPER_UNAVAILABLE scope="identity" effect=none',
                severity: "warning",
            },
        ]);
        expect(await exists(files.active)).toBe(false);

        await writeFile(files.localPath, planBytes({ body: "restored helper" }));
        expect(await mutate(pi, ctx, { toolName: "write", input: { path: files.localPath } })).toBeUndefined();
        expect(calls).toHaveLength(1);
        expect(await readFile(files.active)).toEqual(await readFile(files.localPath));
    });

    test("maps real helper active and archive unsafe observations without exposing protected objects", async () => {
        const outside = await temporaryDirectory("omp-plan-sync-handler-storage-outside-");
        const sentinel = join(outside, "sentinel");
        await writeFile(sentinel, "unchanged");

        const activeFiles = await fixture();
        await symlink(sentinel, activeFiles.active);
        const activeNotifications = [];
        const activePi = createFakePi();
        planArtifactSync(activePi);
        await mutate(activePi, context(activeFiles.root, activeFiles.localRoot, activeNotifications), {
            toolName: "write",
            input: { path: activeFiles.localPath },
        });
        expect(activeNotifications).toEqual([
            'plan-artifact-sync: demo: ERROR: PLAN_FILE_KIND_UNSAFE scope="active" effect=none',
        ]);

        const archiveFiles = await fixture({
            status: "DONE",
            taskChecked: true,
            criterionChecked: true,
            completion: "Lifecycle complete.",
        });
        await mkdir(join(archiveFiles.root, ".agents", "plans", "archive"), { recursive: true });
        await symlink(sentinel, archiveFiles.archived);
        const archiveNotifications = [];
        const archivePi = createFakePi();
        planArtifactSync(archivePi);
        await mutate(archivePi, context(archiveFiles.root, archiveFiles.localRoot, archiveNotifications), {
            toolName: "edit",
            input: { path: archiveFiles.localPath },
        });
        expect(archiveNotifications).toEqual([
            'plan-artifact-sync: demo: ERROR: PLAN_FILE_KIND_UNSAFE scope="archive" effect=none',
        ]);
        expect(await readFile(sentinel, "utf8")).toBe("unchanged");
        await expectPathSafeFailure(
            { stdout: "", stderr: `${activeNotifications[0]}; ${archiveNotifications[0]}`, code: 1 },
            [outside, sentinel, activeFiles.root, activeFiles.localRoot, archiveFiles.root, archiveFiles.localRoot]
        );
    });

    test("mechanically generates exact warning-state evidence from the actual adapter", async () => {
        const rows = [];
        const observe = async ({
            id,
            root,
            localRoot,
            event,
            expectedMessage = null,
            expectedChannel = expectedMessage === null ? "none" : "ctx.ui.notify",
            expectedHelperCalls = [],
            configurePi,
            consoleFallback = false,
        }) => {
            const uiCalls = [];
            const consoleCalls = [];
            const helperCalls = [];
            const pi = createFakePi();
            if (configurePi) configurePi(pi);
            const invoke = pi.exec.bind(pi);
            pi.exec = async (command, args, options) => {
                helperCalls.push(args[2]);
                return invoke(command, args, options);
            };
            planArtifactSync(pi);
            const ctx = {
                cwd: root,
                localProtocolOptions: { localRoot },
                ...(consoleFallback
                    ? {}
                    : { ui: { notify: (message, severity) => uiCalls.push({ message, severity }) } }),
            };
            const originalConsoleError = console.error;
            console.error = (message) => consoleCalls.push({ message, severity: null });
            try {
                expect(await mutate(pi, ctx, event)).toBeUndefined();
            } finally {
                console.error = originalConsoleError;
            }
            const row = observedWarningEvidenceRow(id, uiCalls, consoleCalls, helperCalls);
            expect(row.sink.message).toBe(expectedMessage);
            expect(row.sink.channel).toBe(expectedChannel);
            expect(row.helper_calls).toEqual(expectedHelperCalls);
            expect(row.records).toEqual(parseObservedWarningRecords(expectedMessage));
            rows.push(row);
        };

        const repositoryRoot = await temporaryDirectory("omp-plan-sync-proof-repo-");
        const localRoot = await temporaryDirectory("omp-plan-sync-proof-local-");
        await mkdir(join(repositoryRoot, ".agents", "plans"), { recursive: true });

        await observe({
            id: "WS-V6-01-nonmutation-silent",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "read", input: { path: "local://missing-plan.md" } },
        });
        await observe({
            id: "WS-V6-02-unrelated-missing-root-silent",
            root: repositoryRoot,
            localRoot: join(localRoot, "absent-root"),
            event: { toolName: "write", input: { path: "notes.txt" } },
        });
        await observe({
            id: "WS-V6-03-missing-logical-leaf-silent",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: { path: "local://missing-plan.md" } },
        });
        await observe({
            id: "WS-V6-04-missing-physical-leaf-silent",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "edit", input: { path: join(localRoot, "physical-plan.md") } },
        });

        const eventRoot = await temporaryDirectory("omp-plan-sync-proof-event-");
        const eventPath = join(eventRoot, "demo-plan.md");
        await writeFile(eventPath, planBytes());
        await observe({
            id: "WS-V6-05-root-missing",
            root: repositoryRoot,
            localRoot: join(localRoot, "missing-root"),
            event: { toolName: "write", input: { path: eventPath } },
            expectedMessage: "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_MISSING",
        });

        const deniedRoot = await temporaryDirectory("omp-plan-sync-proof-denied-");
        await chmod(deniedRoot, 0o000);
        try {
            await observe({
                id: "WS-V6-06-root-unreadable",
                root: repositoryRoot,
                localRoot: deniedRoot,
                event: { toolName: "write", input: { path: eventPath } },
                expectedMessage: "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNREADABLE",
            });
        } finally {
            await chmod(deniedRoot, 0o700);
        }

        const unsafeParent = await temporaryDirectory("omp-plan-sync-proof-unsafe-");
        const unsafeRoot = join(unsafeParent, "local");
        const unsafeTarget = await temporaryDirectory("omp-plan-sync-proof-unsafe-target-");
        await symlink(unsafeTarget, unsafeRoot);
        await observe({
            id: "WS-V6-07-root-unsafe",
            root: repositoryRoot,
            localRoot: unsafeRoot,
            event: { toolName: "write", input: { path: eventPath } },
            expectedMessage: "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE",
        });

        await observe({
            id: "WS-V6-08-url-resolution-unavailable",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: { path: "local://url-failure-plan.md" } },
            expectedMessage:
                'plan-artifact-sync: url-failure: ERROR: PLAN_SYNC_UNAVAILABLE scope="identity"',
        });

        const unreadablePath = join(localRoot, "unreadable-plan.md");
        await writeFile(unreadablePath, planBytes());
        await chmod(unreadablePath, 0o000);
        try {
            await observe({
                id: "WS-V6-09-candidate-unreadable",
                root: repositoryRoot,
                localRoot,
                event: { toolName: "write", input: { path: unreadablePath } },
                expectedMessage:
                    'plan-artifact-sync: unreadable: ERROR: PLAN_SYNC_DISCOVERY_UNREADABLE scope="identity"',
            });
        } finally {
            await chmod(unreadablePath, 0o600);
        }

        const outside = await temporaryDirectory("omp-plan-sync-proof-outside-");
        const unsafeCandidate = join(localRoot, "unsafe-plan.md");
        await writeFile(join(outside, "sentinel"), planBytes());
        await symlink(join(outside, "sentinel"), unsafeCandidate);
        await observe({
            id: "WS-V6-10-candidate-unsafe",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: { path: unsafeCandidate } },
            expectedMessage:
                'plan-artifact-sync: unsafe: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE scope="identity"',
        });

        const helperPath = join(localRoot, "helper-plan.md");
        await writeFile(helperPath, planBytes({ body: "warning proof helper" }));
        const helperMode = (await lstat(HELPER)).mode & 0o777;
        await chmod(HELPER, 0o000);
        try {
            await observe({
                id: "WS-V6-11-helper-unavailable",
                root: repositoryRoot,
                localRoot,
                event: { toolName: "write", input: { path: helperPath } },
                expectedMessage:
                    'plan-artifact-sync: helper: ERROR: PLAN_SYNC_HELPER_UNAVAILABLE scope="identity" effect=none',
            });
        } finally {
            await chmod(HELPER, helperMode);
        }

        await observe({
            id: "WS-V6-12-helper-rejected",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: { path: helperPath } },
            expectedMessage:
                'plan-artifact-sync: helper: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete',
            expectedHelperCalls: ["helper"],
            configurePi(pi) {
                pi.exec = async () => {
                    throw new Error("raw rejected helper sentinel");
                };
            },
        });

        const helperProtocolCases = [
            {
                id: "WS-V6-13-helper-allowlisted-active",
                stderr:
                    "ERROR: PLAN_TARGET_STALE: plan=2026-08-10-0310_helper state=invalid:stale path=.agents/plans/2026-08-10-0310_helper.md effect=none: raw discarded sentinel",
                message:
                    'plan-artifact-sync: helper: ERROR: PLAN_TARGET_STALE scope="active" effect=none',
            },
            {
                id: "WS-V6-14-helper-allowlisted-archive",
                stderr:
                    "ERROR: PLAN_POSTCONDITION_FAILED: plan=2026-08-10-0310_helper state=postcondition-uncertain path=.agents/plans/archive/2026-08-10-0310_helper.md effect=possible-complete: raw discarded sentinel",
                message:
                    'plan-artifact-sync: helper: ERROR: PLAN_POSTCONDITION_FAILED scope="archive" effect=possible-complete',
            },
            {
                id: "WS-V6-15-helper-allowlisted-identity",
                stderr:
                    "ERROR: PLAN_LOCK_UNAVAILABLE: plan=helper state=lock-unavailable path=none effect=none: raw discarded sentinel",
                message:
                    'plan-artifact-sync: helper: ERROR: PLAN_LOCK_UNAVAILABLE scope="identity" effect=none',
            },
            {
                id: "WS-V6-16-helper-malformed",
                stderr: "raw malformed helper sentinel\nsecond line",
                message:
                    'plan-artifact-sync: helper: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete',
            },
        ];
        for (const helperCase of helperProtocolCases) {
            await observe({
                id: helperCase.id,
                root: repositoryRoot,
                localRoot,
                event: { toolName: "write", input: { path: helperPath } },
                expectedMessage: helperCase.message,
                expectedHelperCalls: ["helper"],
                configurePi(pi) {
                    pi.exec = async () => ({ code: 1, stdout: "raw stdout sentinel", stderr: helperCase.stderr });
                },
            });
        }

        await observe({
            id: "WS-V6-17-ack-invalid",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: { path: helperPath } },
            expectedMessage:
                'plan-artifact-sync: helper: ERROR: PLAN_SYNC_ACK_INVALID scope="identity" effect=possible-complete',
            expectedHelperCalls: ["helper"],
            configurePi(pi) {
                pi.exec = async () => ({ code: 0, stdout: "wrong raw acknowledgement", stderr: "" });
            },
        });
        await observe({
            id: "WS-V6-18-success-silent",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: { path: helperPath } },
            expectedHelperCalls: ["helper"],
            configurePi(pi) {
                pi.exec = async () => ({
                    code: 0,
                    stdout: "plan-artifact-synced: .agents/plans/2026-08-10-0310_helper.md\n",
                    stderr: "",
                });
            },
        });

        const firstPath = join(localRoot, "first-plan.md");
        const laterPath = join(localRoot, "later-plan.md");
        await writeFile(firstPath, planBytes({ body: "first warning" }));
        await writeFile(laterPath, planBytes({ body: "later success" }));
        await observe({
            id: "WS-V6-19-first-seen-continuation",
            root: repositoryRoot,
            localRoot,
            event: {
                toolName: "edit",
                input: {
                    input:
                        `[${firstPath}#ABCD]\nPUT 1.=1:\n+# First\n` +
                        `[${laterPath}#CDEF]\nPUT 1.=1:\n+# Later\n` +
                        `[${firstPath}#ABCD]\nPUT 1.=1:\n+# Duplicate`,
                },
            },
            expectedMessage:
                'plan-artifact-sync: first: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete',
            expectedHelperCalls: ["first", "later"],
            configurePi(pi) {
                pi.exec = async (_command, args) =>
                    args[2] === "first"
                        ? Promise.reject(new Error("raw first sentinel"))
                        : {
                              code: 0,
                              stdout:
                                  "plan-artifact-synced: .agents/plans/2026-08-10-0310_later.md\n",
                              stderr: "",
                          };
            },
        });

        {
            const boundRoot = await temporaryDirectory("omp-plan-sync-proof-root-bound-");
            const movedRoot = `${boundRoot}-moved`;
            const replacementRoot = await temporaryDirectory("omp-plan-sync-proof-root-replacement-");
            const boundPath = join(boundRoot, "bound-plan.md");
            const replacementPath = join(replacementRoot, "bound-plan.md");
            await writeFile(boundPath, planBytes({ body: "bound root" }));
            await writeFile(replacementPath, planBytes({ body: "replacement root" }));
            const uiCalls = [];
            const helperCalls = [];
            const pi = createFakePi();
            const invoke = pi.exec.bind(pi);
            Object.defineProperty(pi, "exec", {
                configurable: true,
                get() {
                    renameSync(boundRoot, movedRoot);
                    symlinkSync(replacementRoot, boundRoot);
                    return async (...args) => {
                        helperCalls.push(args[1][2]);
                        return invoke(...args);
                    };
                },
            });
            planArtifactSync(pi);
            try {
                expect(
                    await mutate(
                        pi,
                        {
                            cwd: repositoryRoot,
                            localProtocolOptions: { localRoot: boundRoot },
                            ui: { notify: (message, severity) => uiCalls.push({ message, severity }) },
                        },
                        { toolName: "write", input: { path: boundPath } }
                    )
                ).toBeUndefined();
                const row = observedWarningEvidenceRow("WS-V6-20-root-boundary-replacement", uiCalls, [], helperCalls);
                expect(row.sink.message).toBe(
                    "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE"
                );
                expect(row.helper_calls).toEqual([]);
                rows.push(row);
            } finally {
                unlinkSync(boundRoot);
                renameSync(movedRoot, boundRoot);
            }
        }

        {
            const boundRoot = await temporaryDirectory("omp-plan-sync-proof-candidate-bound-");
            const boundPath = join(boundRoot, "bound-plan.md");
            const originalPath = `${boundPath}.original`;
            await writeFile(boundPath, planBytes({ body: "bound candidate" }));
            const replacement = planBytes({ body: "replacement candidate" });
            const uiCalls = [];
            const helperCalls = [];
            const pi = createFakePi();
            const invoke = pi.exec.bind(pi);
            Object.defineProperty(pi, "exec", {
                configurable: true,
                get() {
                    renameSync(boundPath, originalPath);
                    writeFileSync(boundPath, replacement);
                    return async (...args) => {
                        helperCalls.push(args[1][2]);
                        return invoke(...args);
                    };
                },
            });
            planArtifactSync(pi);
            try {
                expect(
                    await mutate(
                        pi,
                        {
                            cwd: repositoryRoot,
                            localProtocolOptions: { localRoot: boundRoot },
                            ui: { notify: (message, severity) => uiCalls.push({ message, severity }) },
                        },
                        { toolName: "write", input: { path: "local://bound-plan.md" } }
                    )
                ).toBeUndefined();
                const row = observedWarningEvidenceRow("WS-V6-21-candidate-boundary-swap", uiCalls, [], helperCalls);
                expect(row.sink.message).toBe(
                    'plan-artifact-sync: bound: ERROR: PLAN_SYNC_UNAVAILABLE scope="identity"'
                );
                expect(row.helper_calls).toEqual([]);
                rows.push(row);
            } finally {
                unlinkSync(boundPath);
                renameSync(originalPath, boundPath);
            }
        }

        const throwingInput = {};
        Object.defineProperty(throwingInput, "path", {
            get() {
                throw new Error("raw outer sentinel");
            },
        });
        await observe({
            id: "WS-V6-22-outer-console-fallback",
            root: repositoryRoot,
            localRoot,
            event: { toolName: "write", input: throwingInput },
            expectedMessage: "plan-artifact-sync: identity: ERROR: PLAN_SYNC_UNAVAILABLE",
            expectedChannel: "console.error",
            consoleFallback: true,
        });

        const proofOutput = process.env.AMR_WARNING_PROOF_OUT;
        if (proofOutput) {
            const proof = {
                schema: "atlas-recovery-authority-marker-warning-state-proof/v6",
                generator: {
                    command:
                        "AMR_WARNING_PROOF_OUT=<named-v6-proof> bun test --test-name-pattern 'mechanically generates exact warning-state evidence' plan-artifact-sync.test.js",
                    source: "actual candidate V6 default extension handler",
                },
                authority: {
                    specification_sha256:
                        "689a855165c2a91247b843c521bdaf10a5302d07bb451d42afdfbe7c6fa9befa",
                    task_contract_sha256:
                        "924913a385cd877aaa90c398edf629a0b4b2da61b621843fb3c63bda495519c2",
                    criteria: ["AC-AMR-06", "AC-AMR-09", "AC-AMR-13", "AC-AMR-14", "AM-M20", "TEST-AMR-20"],
                },
                adapter: {
                    relative_path:
                        ".dotfiles/.config/agents/harnesses/omp/extensions/plan-artifact-sync.js",
                    sha256: sha256(await readFile(CANDIDATE_EXTENSION)),
                },
                test: {
                    relative_path:
                        ".dotfiles/.config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js",
                    sha256: sha256(await readFile(import.meta.path)),
                },
                row_count: rows.length,
                result: "all actual rows matched the exact V3 closed warning contract",
                rows,
            };
            await writeFile(proofOutput, `${JSON.stringify(proof, null, 2)}\n`, { flag: "wx" });
        }
        expect(rows).toHaveLength(22);
    });
});

describe("omp-copy-plan-artifact", () => {
    test("reads observed target bytes from the verified descriptor after its path changes", async () => {
        const root = await temporaryDirectory("omp-plan-descriptor-");
        const target = join(root, "target.md");
        const original = join(root, "original.md");
        const outside = join(root, "outside.md");
        await writeFile(target, "descriptor bytes");
        await writeFile(outside, "path bytes");
        const expectedStat = await lstat(target);
        const handle = await open(target, "r");
        try {
            await rename(target, original);
            await symlink(outside, target);
            const snapshot = await readVerifiedTargetDescriptor(handle, target, expectedStat);
            expect(snapshot.bytes.toString("utf8")).toBe("descriptor bytes");
            expect(snapshot.stat.dev).toBe(expectedStat.dev);
            expect(snapshot.stat.ino).toBe(expectedStat.ino);
        } finally {
            await handle.close();
        }
    });

    test("rejects root and source identity replacement throughout bound helper reads", async () => {
        {
            const files = await fixture();
            const rootStat = await lstat(files.localRoot);
            const sourceStat = await lstat(files.localPath);
            const env = {
                ...process.env,
                OMP_PLAN_ARTIFACT_SYNC_ROOT_IDENTITY: `${rootStat.dev}:${rootStat.ino}`,
                OMP_PLAN_ARTIFACT_SYNC_SOURCE_IDENTITY: `${sourceStat.dev}:${sourceStat.ino}`,
            };
            const movedRoot = `${files.localRoot}.original`;
            const outside = await temporaryDirectory("omp-plan-bound-helper-root-");
            await writeFile(join(outside, "demo-plan.md"), planBytes({ body: "outside replacement" }));
            renameSync(files.localRoot, movedRoot);
            symlinkSync(outside, files.localRoot);
            try {
                const result = await runHelper(files.root, "sync", "demo", files.localPath, env);
                expect(result.code).toBe(1);
                expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
                expect(result.stderr).toContain("effect=none");
                expect(await exists(files.active)).toBe(false);
            } finally {
                unlinkSync(files.localRoot);
                renameSync(movedRoot, files.localRoot);
            }
        }

        {
            const files = await fixture();
            const rootStat = await lstat(files.localRoot);
            const sourceStat = await lstat(files.localPath);
            const env = {
                ...process.env,
                OMP_PLAN_ARTIFACT_SYNC_ROOT_IDENTITY: `${rootStat.dev}:${rootStat.ino}`,
                OMP_PLAN_ARTIFACT_SYNC_SOURCE_IDENTITY: `${sourceStat.dev}:${sourceStat.ino}`,
            };
            const originalPath = `${files.localPath}.original`;
            renameSync(files.localPath, originalPath);
            writeFileSync(files.localPath, planBytes({ body: "replacement source" }));
            try {
                const result = await runHelper(files.root, "sync", "demo", files.localPath, env);
                expect(result.code).toBe(1);
                expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
                expect(result.stderr).toContain("effect=none");
                expect(await exists(files.active)).toBe(false);
            } finally {
                unlinkSync(files.localPath);
                renameSync(originalPath, files.localPath);
            }
        }
    });

    test("never overwrites a destination that appears before no-overwrite publication", async () => {
        const root = await temporaryDirectory("omp-plan-no-overwrite-");
        const generation = join(root, "generation.md");
        const target = join(root, "target.md");
        await writeFile(generation, "candidate");
        await writeFile(target, "contender");
        await expect(
            linkGenerationNoOverwrite(generation, target, "destination changed")
        ).rejects.toThrow("destination changed");
        expect(await readFile(target, "utf8")).toBe("contender");
        expect(await readFile(generation, "utf8")).toBe("candidate");
    });
    test("releases only the still-owned lock generation", async () => {
        const root = await temporaryDirectory("omp-plan-lock-release-");
        const lockPath = join(root, "generation.lock");
        const ownerPath = join(lockPath, "owner.json");
        await mkdir(lockPath);
        await writeFile(ownerPath, "new-owner");
        await releaseLock({ lockPath, ownerPath, owner: "old-owner" });
        expect(await readFile(ownerPath, "utf8")).toBe("new-owner");
    });


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
        expect(synchronized.stderr).toContain("PLAN_HEADER_INVALID");
        expect(synchronized.stderr).toContain("HEADER_FIELD_MALFORMED");
        expect(await exists(files.active)).toBe(false);
        expect(await exists(files.archived)).toBe(false);
        expect(await readFile(files.localPath)).toEqual(malformed);
    });

    test("rejects malformed terminal metadata instead of treating it as incomplete", async () => {
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

            expect(synchronized.code).toBe(1);
            expect(synchronized.stderr).toContain("PLAN_HEADER_INVALID");
            expect(synchronized.stderr).toContain("effect=none");
            expect(await exists(files.active)).toBe(false);
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

        await writeFile(files.archived, planBytes());
        const unsafeWithExistingArchive = await runHelper(
            files.root,
            "sync",
            "demo",
            files.localPath
        );
        expect(unsafeWithExistingArchive.code).toBe(1);
        expect(unsafeWithExistingArchive.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
        expect(unsafeWithExistingArchive.stderr).not.toContain("PLAN_PROJECTION_AMBIGUOUS");
        expect(await readFile(outside, "utf8")).toBe("outside");
        expect(await readFile(files.archived)).toEqual(planBytes());
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

    test("serializes a legitimate direct writer with the same identity generation", async () => {
        const files = await fixture({ body: "shared generation source" });
        const planId = "2026-08-10-0310_demo";
        const lockPath = await planLockPath(files.root, planId);
        const ownerPath = join(lockPath, "owner.json");
        const owner = JSON.stringify({
            pid: process.pid,
            createdAt: new Date().toISOString(),
            token: "legitimate-direct-writer",
        });
        const direct = planBytes({
            authorityKind: "direct-repository",
            body: "legitimate direct writer generation",
        });
        await rm(lockPath, { recursive: true, force: true });
        await mkdir(lockPath, { recursive: true });
        expect(await publishLockRecord(ownerPath, owner)).toBe("published");
        try {
            const helper = spawnHelper(files.root, "demo", files.localPath);
            await Bun.sleep(100);
            expect(await readFile(ownerPath, "utf8")).toBe(owner);
            await writeFile(files.active, direct, { flag: "wx" });
            await rm(lockPath, { recursive: true });
            const result = await finishProcess(helper);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_AUTHORITY_CONFLICT");
            expect(result.stderr).toContain("effect=none");
            expect(await readFile(files.active)).toEqual(direct);
        } finally {
            await rm(lockPath, { recursive: true, force: true });
        }
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
        expect(stderr).toContain("PLAN_POSTCONDITION_FAILED");
        expect(stderr).toContain("effect=possible-complete");
        expect(stderr).toContain("source changed after publication");
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

    test("applies the local transition table and preserves direct or unclassified targets", async () => {
        for (const location of ["active", "archive"]) {
            const files = await fixture();
            const target = location === "active" ? files.active : files.archived;
            const prior = planBytes({ body: `${location} prior local projection` });
            const current = planBytes({ body: `${location} current local authority` });
            await mkdir(join(files.root, ".agents", "plans", "archive"), { recursive: true });
            await writeFile(files.localPath, current);
            await writeFile(target, prior);

            const result = await runHelper(files.root, "sync", "demo", files.localPath);

            expect(result.code).toBe(0);
            expect(result.stdout).toContain(
                location === "active"
                    ? "plan-artifact-synced:"
                    : "plan-artifact-already-archived:"
            );
            expect(await readFile(target)).toEqual(current);
            expect(await exists(location === "active" ? files.archived : files.active)).toBe(false);
        }

        {
            const files = await fixture();
            const bytes = planBytes({ body: "already equal local projection" });
            await writeFile(files.localPath, bytes);
            await writeFile(files.active, bytes);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(0);
            expect(result.stdout).toBe(
                "plan-artifact-synced: .agents/plans/2026-08-10-0310_demo.md"
            );
            expect(await readFile(files.active)).toEqual(bytes);
        }

        for (const location of ["active", "archive"]) {
            const files = await fixture();
            const target = location === "active" ? files.active : files.archived;
            const local = planBytes({ body: "local authority" });
            const direct = planBytes({
                authorityKind: "direct-repository",
                body: `${location} direct authority`,
            });
            await mkdir(join(files.root, ".agents", "plans", "archive"), { recursive: true });
            await writeFile(files.localPath, local);
            await writeFile(target, direct);
            const before = sha256(await readFile(target));

            const result = await runHelper(files.root, "sync", "demo", files.localPath);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_AUTHORITY_CONFLICT");
            expect(result.stderr).toContain("state=direct-authority");
            expect(result.stderr).toContain(
                location === "active" ? ".agents/plans/2026" : ".agents/plans/archive/2026"
            );
            expect(sha256(await readFile(target))).toBe(before);
        }

        {
            const files = await fixture();
            const local = planBytes({ body: "marker-only conflict" });
            const direct = Buffer.from(
                local.toString("utf8").replace("local-authority", "direct-repository")
            );
            await writeFile(files.localPath, local);
            await writeFile(files.active, direct);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_AUTHORITY_CONFLICT");
            expect(await readFile(files.active)).toEqual(direct);
        }

        {
            const files = await fixture();
            const directSource = planBytes({
                authorityKind: "direct-repository",
                body: "direct bytes at local path",
            });
            await writeFile(files.localPath, directSource);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_AUTHORITY_CONTEXT");
            expect(await exists(files.active)).toBe(false);
            expect(await exists(files.archived)).toBe(false);
        }

        for (const location of ["active", "archive"]) {
            const files = await fixture();
            const target = location === "active" ? files.active : files.archived;
            const local = planBytes({ body: "valid local source" });
            const unmarked = Buffer.from(
                local.toString("utf8").replace("**Authority kind**: local-authority\n", "")
            );
            await mkdir(join(files.root, ".agents", "plans", "archive"), { recursive: true });
            await writeFile(files.localPath, local);
            await writeFile(target, unmarked);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_AUTHORITY_UNCLASSIFIED");
            expect(result.stderr).toContain("state=unclassified");
            expect(result.stderr).toContain(
                location === "active" ? ".agents/plans/2026" : ".agents/plans/archive/2026"
            );
            expect(await readFile(target)).toEqual(unmarked);
        }
    });

    test("rejects every malformed or misplaced header at source and target seams", async () => {
        const valid = planBytes().toString("utf8");
        {
            const files = await fixture();
            const crlf = Buffer.from(valid.replaceAll("\n", "\r\n"));
            await writeFile(files.localPath, crlf);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(0);
            expect(await readFile(files.active)).toEqual(crlf);
        }
        const cases = [
            [
                "unknown",
                Buffer.from(valid.replace("Authority kind", "Authority type")),
                "HEADER_FIELD_UNKNOWN",
            ],
            [
                "bad-value",
                Buffer.from(valid.replace("local-authority", "shared")),
                "HEADER_FIELD_VALUE",
            ],
            [
                "duplicate",
                Buffer.from(
                    valid.replace(
                        "**Scope**:",
                        "**Authority kind**: local-authority\n**Scope**:"
                    )
                ),
                "HEADER_FIELD_DUPLICATE",
            ],
            [
                "miscase",
                Buffer.from(valid.replace("Authority kind", "authority kind")),
                "HEADER_FIELD_CASE",
            ],
            [
                "misplaced",
                Buffer.from(
                    valid.replace("## Context", "## Context\n**Authority kind**: local-authority")
                ),
                "HEADER_FIELD_MISPLACED",
            ],
            [
                "malformed",
                Buffer.from(valid.replace("**Authority kind**: ", "**Authority kind**:")),
                "HEADER_FIELD_MALFORMED",
            ],
            [
                "bare-cr-h1",
                Buffer.from(valid.replace("# Mirror probe", "# Mirror\r probe")),
                "HEADER_H1",
            ],
            [
                "residual-cr-h1-whitespace",
                Buffer.from(valid.replace("# Mirror probe", "#\r Mirror probe")),
                "HEADER_H1",
            ],
            [
                "bare-cr-name",
                Buffer.from(valid.replace("Authority kind", "Authority\r kind")),
                "HEADER_FIELD_MALFORMED",
            ],
            [
                "bare-cr-delimiter",
                Buffer.from(
                    valid.replace(
                        "**Authority kind**: local-authority",
                        "**Authority kind**\r: local-authority"
                    )
                ),
                "HEADER_FIELD_MALFORMED",
            ],
            [
                "bare-cr-value",
                Buffer.from(valid.replace("local-authority", "local-\rauthority")),
                "HEADER_FIELD_MALFORMED",
            ],
            [
                "redacted-secret",
                Buffer.from(valid.replace("local-authority", "AMR_SECRET_SENTINEL_7e26")),
                "HEADER_FIELD_VALUE",
            ],
            [
                "wrong-order",
                Buffer.from(
                    valid.replace(
                        "**Authority kind**: local-authority\n**Scope**: mirror probe",
                        "**Scope**: mirror probe\n**Authority kind**: local-authority"
                    )
                ),
                "HEADER_FIELD_ORDER",
            ],
            [
                "missing",
                Buffer.from(valid.replace("**Authority kind**: local-authority\n", "")),
                "PLAN_AUTHORITY_UNCLASSIFIED",
            ],
            [
                "invalid-utf8",
                Buffer.concat([
                    Buffer.from("# \xff", "latin1"),
                    Buffer.from(valid.slice(1)),
                ]),
                "UTF8",
            ],
            [
                "bom",
                Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(valid)]),
                "HEADER_BOM",
            ],
        ];

        for (const [label, bytes, code] of cases) {
            const files = await fixture();
            await writeFile(files.localPath, bytes);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code, `source ${label}`).toBe(1);
            expect(result.stderr, `source ${label}`).toContain(code);
            expect(result.stderr, `source ${label}`).toContain("effect=none");
            expect(result.stderr, `source ${label}`).not.toContain("AMR_SECRET_SENTINEL_7e26");
            expect(await exists(files.active)).toBe(false);
            expect(await exists(files.archived)).toBe(false);
        }

        for (const [label, bytes, code] of cases) {
            const files = await fixture();
            const source = planBytes({ body: `source for target ${label}` });
            await writeFile(files.localPath, source);
            await writeFile(files.active, bytes);
            const before = sha256(bytes);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code, `target ${label}`).toBe(1);
            expect(result.stderr, `target ${label}`).toContain(code);
            expect(result.stderr, `target ${label}`).toContain("effect=none");
            expect(result.stderr, `target ${label}`).not.toContain("AMR_SECRET_SENTINEL_7e26");
            expect(sha256(await readFile(files.active))).toBe(before);
        }

        {
            const files = await fixture();
            const source = planBytes({ body: "identity source" });
            const otherIdentity = planBytes({
                datetime: "2026-08-10-0311",
                body: "other identity target",
            });
            await writeFile(files.localPath, source);
            await writeFile(files.active, otherIdentity);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_IDENTITY_MISMATCH");
            expect(await readFile(files.active)).toEqual(otherIdentity);
        }
    });

    test("rejects every unsafe storage path without path disclosure or collateral writes", async () => {
        {
            const files = await fixture();
            await mkdir(files.active);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(result.stderr).toContain("effect=none");
            await expectPathSafeFailure(result, [
                files.root,
                files.localRoot,
                files.localPath,
                files.active,
            ]);
        }

        {
            const files = await fixture();
            const fifo = Bun.spawn(["mkfifo", files.active], { stdout: "pipe", stderr: "pipe" });
            expect((await finishProcess(fifo)).code).toBe(0);
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(await exists(files.active)).toBe(true);
            await expectPathSafeFailure(result, [
                files.root,
                files.localRoot,
                files.localPath,
                files.active,
            ]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-missing-source-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-missing-source-local-");
            const localPath = join(localRoot, "demo-plan.md");
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(result.stderr).toContain("state=source-unsafe");
            await expectPathSafeFailure(result, [root, localRoot, localPath]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-directory-source-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-directory-source-local-");
            const localPath = join(localRoot, "demo-plan.md");
            await mkdir(localPath);
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(result.stderr).toContain("regular non-symlink file");
            await expectPathSafeFailure(result, [root, localRoot, localPath]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-symlink-source-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-symlink-source-local-");
            const outside = await temporaryDirectory("omp-plan-sync-symlink-source-outside-");
            const localPath = join(localRoot, "demo-plan.md");
            const sentinel = join(outside, "sentinel-plan.md");
            await writeFile(sentinel, planBytes());
            await symlink(sentinel, localPath);
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(await readFile(sentinel)).toEqual(planBytes());
            await expectPathSafeFailure(result, [root, localRoot, localPath, outside, sentinel]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-unreadable-source-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-unreadable-source-local-");
            const localPath = join(localRoot, "demo-plan.md");
            await writeFile(localPath, planBytes());
            await chmod(localPath, 0o000);
            const result = await runHelper(root, "sync", "demo", localPath);
            await chmod(localPath, 0o600);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            await expectPathSafeFailure(result, [root, localRoot, localPath]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-agents-file-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-agents-file-local-");
            const localPath = join(localRoot, "demo-plan.md");
            await writeFile(localPath, planBytes());
            await writeFile(join(root, ".agents"), "not a directory");
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(result.stderr).toContain("effect=none");
            await expectPathSafeFailure(result, [root, localRoot, localPath, join(root, ".agents")]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-plans-file-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-plans-file-local-");
            const localPath = join(localRoot, "demo-plan.md");
            await writeFile(localPath, planBytes());
            await mkdir(join(root, ".agents"));
            await writeFile(join(root, ".agents", "plans"), "not a directory");
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(result.stderr).toContain("effect=none");
            await expectPathSafeFailure(result, [
                root,
                localRoot,
                localPath,
                join(root, ".agents", "plans"),
            ]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-agents-link-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-agents-link-local-");
            const outside = await temporaryDirectory("omp-plan-sync-agents-link-outside-");
            const localPath = join(localRoot, "demo-plan.md");
            const sentinel = join(outside, "sentinel");
            await writeFile(localPath, planBytes());
            await writeFile(sentinel, "unchanged");
            await symlink(outside, join(root, ".agents"));
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(await readFile(sentinel, "utf8")).toBe("unchanged");
            expect(await readdir(outside)).toEqual(["sentinel"]);
            await expectPathSafeFailure(result, [root, localRoot, localPath, outside, sentinel]);
        }

        {
            const root = await temporaryDirectory("omp-plan-sync-plans-link-root-");
            const localRoot = await temporaryDirectory("omp-plan-sync-plans-link-local-");
            const outside = await temporaryDirectory("omp-plan-sync-plans-link-outside-");
            const localPath = join(localRoot, "demo-plan.md");
            const sentinel = join(outside, "sentinel");
            await writeFile(localPath, planBytes());
            await writeFile(sentinel, "unchanged");
            await mkdir(join(root, ".agents"));
            await symlink(outside, join(root, ".agents", "plans"));
            const result = await runHelper(root, "sync", "demo", localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(await readFile(sentinel, "utf8")).toBe("unchanged");
            expect(await readdir(outside)).toEqual(["sentinel"]);
            await expectPathSafeFailure(result, [root, localRoot, localPath, outside, sentinel]);
        }

        {
            const files = await fixture();
            const outside = await temporaryDirectory("omp-plan-sync-archive-outside-");
            await writeFile(
                files.localPath,
                planBytes({
                    status: "DONE",
                    taskChecked: true,
                    criterionChecked: true,
                    completion: "Terminal source.",
                })
            );
            await symlink(outside, join(files.root, ".agents", "plans", "archive"));
            const result = await runHelper(files.root, "sync", "demo", files.localPath);
            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_FILE_KIND_UNSAFE");
            expect(await readdir(outside)).toEqual([]);
            await expectPathSafeFailure(result, [
                files.root,
                files.localRoot,
                files.localPath,
                outside,
            ]);
        }
    });

    test("detects source drift while waiting on a lock and while staging with no effect", async () => {
        {
            const files = await fixture();
            const lockPath = await planLockPath(files.root, "2026-08-10-0310_demo");
            const ownerPath = join(lockPath, "owner.json");
            const original = planBytes({ body: "source before lock wait" });
            const changed = planBytes({ body: "source changed during lock wait" });
            await writeFile(files.localPath, original);
            await rm(lockPath, { recursive: true, force: true });
            await mkdir(lockPath, { recursive: true });
            const owner = JSON.stringify({
                pid: process.pid,
                createdAt: new Date().toISOString(),
                token: "held-by-test-process",
            });
            expect(await publishLockRecord(ownerPath, owner)).toBe("published");

            const helper = spawnHelper(files.root, "demo", files.localPath);
            await Bun.sleep(100);
            await writeFile(files.localPath, changed);
            await rm(lockPath, { recursive: true });
            const result = await finishProcess(helper);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_SOURCE_STALE");
            expect(result.stderr).toContain("effect=none");
            expect(await exists(files.active)).toBe(false);
            expect(await exists(files.archived)).toBe(false);
        }

        {
            const files = await fixture();
            const original = planBytes({ body: "x".repeat(24 * 1024 * 1024) });
            const changed = planBytes({ body: "source changed while staging" });
            const replacement = join(files.localRoot, "replacement-plan.md");
            await writeFile(files.localPath, original);
            await writeFile(replacement, changed);

            const helper = spawnHelper(files.root, "demo", files.localPath);
            const planDirectory = join(files.root, ".agents", "plans");
            await waitUntil(async () =>
                (await readdir(planDirectory)).some(
                    (name) => name.startsWith(".2026-08-10-0310_demo.md.") && name.endsWith(".tmp")
                )
            );
            await rename(replacement, files.localPath);
            const result = await finishProcess(helper);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_SOURCE_STALE");
            expect(result.stderr).toContain("effect=none");
            expect(await exists(files.active)).toBe(false);
            expect(
                (await readdir(planDirectory)).some((name) => name.endsWith(".tmp"))
            ).toBe(false);
        }
    });

    test("detects target drift before commit and after publication without overwriting it", async () => {
        {
            const files = await fixture();
            const source = planBytes({ body: "x".repeat(24 * 1024 * 1024) });
            const direct = planBytes({
                authorityKind: "direct-repository",
                body: "direct target introduced during staging",
            });
            await writeFile(files.localPath, source);
            const helper = spawnHelper(files.root, "demo", files.localPath);
            const planDirectory = join(files.root, ".agents", "plans");
            await waitUntil(async () =>
                (await readdir(planDirectory)).some(
                    (name) => name.startsWith(".2026-08-10-0310_demo.md.") && name.endsWith(".tmp")
                )
            );
            await writeFile(files.active, direct);
            const result = await finishProcess(helper);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_TARGET_STALE");
            expect(result.stderr).toContain("effect=none");
            expect(await readFile(files.active)).toEqual(direct);
        }

        {
            const files = await fixture();
            const source = planBytes({ body: "x".repeat(24 * 1024 * 1024) });
            const direct = planBytes({
                authorityKind: "direct-repository",
                body: "existing projection replaced during staging",
            });
            await writeFile(files.localPath, source);
            await writeFile(files.active, source);
            const helper = spawnHelper(files.root, "demo", files.localPath);
            const planDirectory = join(files.root, ".agents", "plans");
            await waitUntil(async () =>
                (await readdir(planDirectory)).some(
                    (name) => name.startsWith(".2026-08-10-0310_demo.md.") && name.endsWith(".tmp")
                )
            );
            await writeFile(files.active, direct);
            const result = await finishProcess(helper);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_TARGET_STALE");
            expect(result.stderr).toContain("effect=none");
            expect(await readFile(files.active)).toEqual(direct);
        }

        {
            const files = await fixture();
            const source = planBytes({ body: "x".repeat(64 * 1024 * 1024) });
            const replacement = join(files.root, ".agents", "plans", "replacement.md");
            const direct = planBytes({
                authorityKind: "direct-repository",
                body: "target changed immediately after publication",
            });
            await writeFile(files.localPath, source);
            await writeFile(replacement, direct);
            const helper = spawnHelper(files.root, "demo", files.localPath);
            await waitUntil(() => exists(files.active));
            await rename(replacement, files.active);
            const result = await finishProcess(helper);

            expect(result.code).toBe(1);
            expect(result.stderr).toContain("PLAN_POSTCONDITION_FAILED");
            expect(result.stderr).toContain("effect=possible-complete");
            expect(result.stderr).toContain("target changed after publication");
            expect(await readFile(files.active)).toEqual(direct);
            expect(await readFile(files.localPath)).toEqual(source);
        }
    });

    test("terminal barrier preserves a replaced active object and a newly appeared archive", async () => {
        for (const race of ["active-replaced", "archive-appeared"]) {
            const files = await fixture();
            const source = planBytes({
                status: "DONE",
                taskChecked: true,
                criterionChecked: true,
                completion: "Terminal race fixture complete.",
                body: "x".repeat(64 * 1024 * 1024),
            });
            const protectedBytes = planBytes({
                authorityKind: "direct-repository",
                body: `protected ${race} bytes`,
            });
            const replacement = join(files.root, ".agents", "plans", "protected.tmp");
            await writeFile(files.localPath, source);
            await writeFile(replacement, protectedBytes);
            const helper = spawnHelper(files.root, "demo", files.localPath);
            await waitUntil(() => exists(files.active));
            if (race === "active-replaced") {
                await rename(replacement, files.active);
            } else {
                await rename(replacement, files.archived);
            }
            const result = await finishProcess(helper);

            expect(result.code, race).toBe(1);
            expect(result.stderr, race).toContain("PLAN_POSTCONDITION_FAILED");
            expect(result.stderr, race).toContain("effect=possible-complete");
            expect(result.stderr, race).toContain("terminal publication barrier failed");
            if (race === "active-replaced") {
                expect(await readFile(files.active)).toEqual(protectedBytes);
                expect(await exists(files.archived)).toBe(false);
            } else {
                expect(await readFile(files.active)).toEqual(source);
                expect(await readFile(files.archived)).toEqual(protectedBytes);
            }
            expect(await readFile(files.localPath)).toEqual(source);
        }
    }, 30_000);

    test("reports a failed first publication rename with effect none", async () => {
        const files = await fixture();
        const source = planBytes({ body: "x".repeat(64 * 1024 * 1024) });
        const planDirectory = join(files.root, ".agents", "plans");
        await writeFile(files.localPath, source);
        const helper = spawnHelper(files.root, "demo", files.localPath);
        await waitUntil(async () =>
            (await readdir(planDirectory)).some(
                (name) => name.startsWith(".2026-08-10-0310_demo.md.") && name.endsWith(".tmp")
            )
        );
        await chmod(planDirectory, 0o555);
        const result = await finishProcess(helper);
        await chmod(planDirectory, 0o755);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain("effect=none");
        expect(result.stderr).not.toContain("effect=possible-complete");
        expect(await exists(files.active)).toBe(false);
        expect(await exists(files.archived)).toBe(false);
        for (const name of await readdir(planDirectory)) {
            if (name.endsWith(".tmp")) await rm(join(planDirectory, name));
        }
    }, 20_000);

    test("freshly classifies direct and unclassified targets for every same-identity contender", async () => {
        for (const targetKind of ["direct", "unclassified"]) {
            const files = await fixture();
            const source = planBytes({ body: `${targetKind} contention source` });
            const target =
                targetKind === "direct"
                    ? planBytes({
                          authorityKind: "direct-repository",
                          body: "direct contention target",
                      })
                    : Buffer.from(
                          source
                              .toString("utf8")
                              .replace("**Authority kind**: local-authority\n", "")
                      );
            await writeFile(files.localPath, source);
            await writeFile(files.active, target);

            const results = await Promise.all(
                Array.from({ length: 8 }, () =>
                    runHelper(files.root, "sync", "demo", files.localPath)
                )
            );

            expect(results.every((result) => result.code === 1)).toBe(true);
            expect(
                results.every((result) =>
                    result.stderr.includes(
                        targetKind === "direct"
                            ? "PLAN_AUTHORITY_CONFLICT"
                            : "PLAN_AUTHORITY_UNCLASSIFIED"
                    )
                )
            ).toBe(true);
            expect(await readFile(files.active)).toEqual(target);
            expect(await exists(await planLockPath(files.root, "2026-08-10-0310_demo"))).toBe(
                false
            );
        }
    });

    test("times out on a live lock without target effect", async () => {
        const files = await fixture();
        const lockPath = await planLockPath(files.root, "2026-08-10-0310_demo");
        const ownerPath = join(lockPath, "owner.json");
        const source = planBytes({ body: "live lock timeout source" });
        await writeFile(files.localPath, source);
        await rm(lockPath, { recursive: true, force: true });
        await mkdir(lockPath, { recursive: true });
        const owner = JSON.stringify({
            pid: process.pid,
            createdAt: new Date().toISOString(),
            token: "live-lock-owner",
        });
        expect(await publishLockRecord(ownerPath, owner)).toBe("published");

        const result = await runHelper(files.root, "sync", "demo", files.localPath);

        expect(result.code).toBe(1);
        expect(result.stderr).toContain("PLAN_LOCK_UNAVAILABLE");
        expect(result.stderr).toContain("effect=none");
        expect(await exists(files.active)).toBe(false);
        expect(await readFile(ownerPath, "utf8")).toContain("live-lock-owner");
        await rm(lockPath, { recursive: true });
    }, 20_000);

    test("preflights real local and direct authority paths in both harness contexts", async () => {
        const fixtureBytes = await readFile(PYTHON_FIXTURE);
        const repositoryDirectory = await temporaryDirectory("executor-plan-repository-");
        const localDirectory = await temporaryDirectory("executor-plan-local-");
        const repositoryRoot = await realpath(repositoryDirectory);
        const localRoot = await realpath(localDirectory);
        const active = join(
            repositoryRoot,
            ".agents",
            "plans",
            "2026-08-09-1700_demo.md"
        );
        const archived = join(
            repositoryRoot,
            ".agents",
            "plans",
            "archive",
            "2026-08-09-1700_demo.md"
        );
        const localPlan = join(localRoot, "demo-plan.md");
        await mkdir(join(repositoryRoot, ".agents", "plans", "archive"), { recursive: true });
        await writeFile(active, fixtureBytes);

        for (const contextName of ["omp", "grok"]) {
            const planner = await runPythonParser(active, contextName, "planner");
            expect(planner.code).toBe(0);
            expect(planner.payload.schema).toBe("executor-plan-validation/v1");
            expect(planner.payload.status).toBe("valid");

            const noLocator = await runPythonParser(active, contextName, "backend");
            expect(noLocator.code).toBe(66);
            expect(noLocator.payload.schema).toBe("executor-plan-preflight/v1");
            expect(noLocator.payload.status).toBe("unavailable");

            const direct = await runPythonPreflight(
                active,
                contextName,
                "demo",
                repositoryRoot,
                localRoot,
                localPlan
            );
            expect(direct.code).toBe(0);
            expect(direct.payload.status).toBe("eligible");
            expect(direct.payload.authority_outcome).toBe("direct");
            expect(direct.payload.authority_location).toBe("repository-active");
            expect(direct.payload.plan_sha256).toBe(sha256(fixtureBytes));
            expect(direct.payload.structural.plan_sha256).toBe(sha256(fixtureBytes));
            expect(JSON.stringify(direct.payload)).not.toContain(repositoryRoot);
            expect(JSON.stringify(direct.payload)).not.toContain(localRoot);
        }

        await rename(active, archived);
        for (const contextName of ["omp", "grok"]) {
            const direct = await runPythonPreflight(
                archived,
                contextName,
                "demo",
                repositoryRoot,
                localRoot,
                localPlan
            );
            expect(direct.code).toBe(0);
            expect(direct.payload.status).toBe("eligible");
            expect(direct.payload.authority_outcome).toBe("direct");
            expect(direct.payload.authority_location).toBe("repository-archive");
        }

        await rm(archived);
        const localBytes = Buffer.from(
            fixtureBytes.toString("utf8").replace("direct-repository", "local-authority")
        );
        await writeFile(localPlan, localBytes);
        await writeFile(active, localBytes);
        for (const contextName of ["omp", "grok"]) {
            const local = await runPythonPreflight(
                localPlan,
                contextName,
                "demo",
                repositoryRoot,
                localRoot,
                localPlan
            );
            expect(local.code).toBe(0);
            expect(local.payload.status).toBe("eligible");
            expect(local.payload.authority_outcome).toBe("local");
            expect(local.payload.plan_sha256).toBe(sha256(localBytes));

            const projection = await runPythonPreflight(
                active,
                contextName,
                "demo",
                repositoryRoot,
                localRoot,
                localPlan
            );
            expect(projection.code).toBe(2);
            expect(projection.payload.status).toBe("blocked");
            expect(projection.payload.issues.map((issue) => issue.code)).toContain(
                "PLAN_AUTHORITY_CONTEXT"
            );
        }

        await writeFile(active, fixtureBytes);
        const conflict = await runPythonPreflight(
            active,
            "omp",
            "demo",
            repositoryRoot,
            localRoot,
            localPlan
        );
        expect(conflict.code).toBe(2);
        expect(conflict.payload.authority_outcome).toBe("ambiguous");
        expect(conflict.payload.issues.map((issue) => issue.code)).toContain(
            "PLAN_AUTHORITY_CONFLICT"
        );

        await chmod(localPlan, 0o000);
        const unreadable = await runPythonPreflight(
            active,
            "grok",
            "demo",
            repositoryRoot,
            localRoot,
            localPlan
        );
        await chmod(localPlan, 0o600);
        expect(unreadable.code).toBe(66);
        expect(unreadable.payload.status).toBe("unavailable");
        expect(unreadable.payload.issues.map((issue) => issue.code)).toContain(
            "PLAN_AUTHORITY_UNREADABLE"
        );
    });
});
