import { afterAll, describe, expect, mock, test } from "bun:test";
import {
    chmod,
    lstat,
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    realpath,
    rename,
    rm,
    symlink,
    writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";

mock.module("@oh-my-pi/pi-coding-agent/internal-urls", () => ({
    resolveLocalUrlToPath(value, options) {
        if (!value.startsWith("local://")) throw new Error("not a local URI");
        return join(options.localRoot, value.slice("local://".length));
    },
}));

const { default: planArtifactSync } = await import("./plan-artifact-sync.js");

const DOTFILES = resolve(import.meta.dir, "../../../../..");
const HELPER = join(DOTFILES, "bin", "omp-copy-plan-artifact");
const CONFIG = join(DOTFILES, ".config", "agents", "harnesses", "omp", "config.yml");
const PLAN_FIXTURE = join(
    DOTFILES,
    ".config",
    "agents",
    "skills",
    "dev-implementation",
    "scripts",
    "fixtures",
    "executor_plan",
    "complete.md"
);
const BASE_PLAN = await readFile(PLAN_FIXTURE, "utf8");
const roots = [];

async function temporaryDirectory(prefix) {
    const directory = await mkdtemp(join(tmpdir(), prefix));
    roots.push(directory);
    return directory;
}

async function exists(filePath) {
    try {
        await lstat(filePath);
        return true;
    } catch (error) {
        if (error?.code === "ENOENT") return false;
        throw error;
    }
}

function planBytes({ status = "PENDING", record = "bare", marker = "base", malformed = false } = {}) {
    let source = BASE_PLAN.replace(
        "without provider-specific semantics.",
        `without provider-specific semantics; marker ${marker}.`
    );
    if (status === "PENDING") return Buffer.from(source);
    if (status === "IN_PROGRESS" || status === "CLOSED") {
        return Buffer.from(source.replace("**Status**: PENDING", `**Status**: ${status}`));
    }
    if (status !== "DONE") throw new Error(`unsupported fixture status: ${status}`);

    source = source.replace("**Status**: PENDING", "**Status**: DONE\n**Completed At**: 2026-08-24-2355");
    if (malformed) return Buffer.from(source);

    const completionPrefix = record === "bulleted" ? "  - completed" : "  completed";
    const lines = [];
    for (const line of source.split("\n")) {
        if (line.startsWith("- [ ] T")) {
            lines.push(line.replace("- [ ]", "- [x]"));
            lines.push(`${completionPrefix} 2026-08-24-2355`);
        } else if (line.startsWith("- [ ] VR-")) {
            lines.push(line.replace("- [ ]", "- [x]"));
        } else {
            lines.push(line);
        }
    }
    return Buffer.from(`${lines.join("\n")}\n## Completion Summary\n\nComplete marker ${marker}.\n`);
}

function planPaths(root, slug = "demo") {
    const identity = `2026-08-09-1700_${slug}.md`;
    return {
        active: join(root, ".agents", "plans", identity),
        archive: join(root, ".agents", "plans", "archive", identity),
    };
}

async function fixture({ slug = "demo", bytes = planBytes() } = {}) {
    const root = await temporaryDirectory("omp-plan-copy-repo-");
    const localRoot = await temporaryDirectory("omp-plan-copy-local-");
    const localPath = join(localRoot, `${slug}-plan.md`);
    await writeFile(localPath, bytes);
    return { root, localRoot, localPath, ...planPaths(root, slug) };
}

async function runProcess(command, args, options) {
    const child = Bun.spawn([command, ...args], {
        cwd: options.cwd,
        env: options.env,
        stdout: "pipe",
        stderr: "pipe",
    });
    const [stdout, stderr, code] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ]);
    return { code, stdout, stderr };
}

function createFakePi(execImpl = runProcess) {
    const listeners = new Map();
    const calls = [];
    const registeredTools = [];
    return {
        listeners,
        calls,
        registeredTools,
        on(name, handler) {
            listeners.set(name, handler);
        },
        registerTool(tool) {
            registeredTools.push(tool);
        },
        async exec(command, args, options) {
            calls.push({ command, args: [...args], options: { ...options } });
            return await execImpl(command, args, options);
        },
    };
}

function context(root, localRoot, notifications = []) {
    return {
        cwd: root,
        localProtocolOptions: { localRoot },
        ui: {
            notify(message, severity) {
                notifications.push({ message, severity });
            },
        },
    };
}

async function emit(pi, event, ctx) {
    return await pi.listeners.get("tool_result")(event, ctx);
}

async function runHelper(root, slug, contentFile) {
    return await runProcess(HELPER, ["copy", "--slug", slug, "--content-file", contentFile], { cwd: root });
}

afterAll(async () => {
    for (const root of roots) await rm(root, { recursive: true, force: true });
});

describe("plan-artifact-sync registration and mutation boundary", () => {
    test("keeps the configured extension and registers only the successful mutation listener", async () => {
        const pi = createFakePi();
        planArtifactSync(pi);

        expect([...pi.listeners.keys()]).toEqual(["tool_result"]);
        expect(pi.registeredTools).toEqual([]);
        expect(await readFile(CONFIG, "utf8")).toContain(
            "~/.dotfiles/.config/agents/harnesses/omp/extensions/plan-artifact-sync.js"
        );

        const files = await fixture();
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);
        await emit(pi, { toolName: "write", isError: true, input: { path: files.localPath } }, ctx);
        await emit(pi, { toolName: "read", isError: false, input: { path: files.localPath } }, ctx);
        expect(pi.calls).toEqual([]);
        expect(notifications).toEqual([]);
    });

    test("copies after every physical, logical, and hashline write or edit without helper environment bindings", async () => {
        const files = await fixture();
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);

        expect(
            await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx)
        ).toBeUndefined();
        expect(await readFile(files.active)).toEqual(planBytes());

        const replacement = planBytes({ status: "IN_PROGRESS", marker: "replacement" });
        await writeFile(files.localPath, replacement);
        await emit(pi, { toolName: "edit", isError: false, input: { path: "local://demo-plan.md" } }, ctx);
        expect(await readFile(files.active)).toEqual(replacement);

        const third = planBytes({ status: "IN_PROGRESS", marker: "hashline" });
        await writeFile(files.localPath, third);
        await emit(
            pi,
            {
                toolName: "edit",
                isError: false,
                input: { input: `[${files.localPath}#ABCD]\nPUT 1.=1:\n+changed` },
            },
            ctx
        );
        expect(await readFile(files.active)).toEqual(third);
        expect(pi.calls).toHaveLength(3);
        for (const call of pi.calls) {
            expect(call.args[0]).toBe("copy");
            expect(call.args.slice(1, 3)).toEqual(["--slug", "demo"]);
            expect(call.args[3]).toBe("--content-file");
            expect(call.args[4]).toBe(await realpath(files.localPath));
            expect(call.options).toEqual({ cwd: files.root });
        }
        expect(notifications).toEqual([]);
    });

    test("orders changed slugs canonically and keeps unrelated files silent", async () => {
        const root = await temporaryDirectory("omp-plan-order-repo-");
        const localRoot = await temporaryDirectory("omp-plan-order-local-");
        const alpha = join(localRoot, "alpha-plan.md");
        const zeta = join(localRoot, "zeta-plan.md");
        const note = join(localRoot, "notes.md");
        await writeFile(alpha, planBytes({ marker: "alpha" }));
        await writeFile(zeta, planBytes({ marker: "zeta" }));
        await writeFile(note, "unrelated");

        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(root, localRoot, notifications);
        await emit(
            pi,
            {
                toolName: "edit",
                isError: false,
                input: { input: `[${zeta}#AAAA]\n[${alpha}#BBBB]\n` },
            },
            ctx
        );
        await emit(pi, { toolName: "write", isError: false, input: { path: note } }, ctx);

        expect(pi.calls.map((call) => call.args[2])).toEqual(["alpha", "zeta"]);
        expect(await readFile(planPaths(root, "alpha").active)).toEqual(planBytes({ marker: "alpha" }));
        expect(await readFile(planPaths(root, "zeta").active)).toEqual(planBytes({ marker: "zeta" }));
        expect(notifications).toEqual([]);
    });
});

describe("plan draft discovery and safe paths", () => {
    test("rejects out-of-root and symlink candidates while absent candidates remain silent", async () => {
        const root = await temporaryDirectory("omp-plan-safe-repo-");
        const localRoot = await temporaryDirectory("omp-plan-safe-local-");
        const outsideRoot = await temporaryDirectory("omp-plan-safe-outside-");
        const outside = join(outsideRoot, "outside-plan.md");
        const target = join(outsideRoot, "target.md");
        const linked = join(localRoot, "linked-plan.md");
        const missing = join(localRoot, "missing-plan.md");
        await writeFile(outside, planBytes());
        await writeFile(target, planBytes());
        await symlink(target, linked);

        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(root, localRoot, notifications);
        await emit(
            pi,
            {
                toolName: "edit",
                isError: false,
                input: { input: `[${outside}#AAAA]\n[${linked}#BBBB]\n[${missing}#CCCC]\n` },
            },
            ctx
        );

        expect(pi.calls).toEqual([]);
        expect(notifications).toEqual([
            {
                message:
                    'plan-artifact-sync: linked: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE scope="identity"; ' +
                    'outside: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE scope="identity"',
                severity: "warning",
            },
        ]);
    });

    test("closes missing and unsafe local roots but never discovers a root for unrelated input", async () => {
        const root = await temporaryDirectory("omp-plan-root-repo-");
        const outside = await temporaryDirectory("omp-plan-root-source-");
        const candidate = join(outside, "demo-plan.md");
        const unrelated = join(outside, "notes.md");
        const missingRoot = join(outside, "missing-root");
        const symlinkRoot = join(outside, "linked-root");
        const symlinkTarget = await temporaryDirectory("omp-plan-root-target-");
        await writeFile(candidate, planBytes());
        await writeFile(unrelated, "notes");
        await symlink(symlinkTarget, symlinkRoot);

        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        await emit(
            pi,
            { toolName: "write", isError: false, input: { path: unrelated } },
            context(root, missingRoot, notifications)
        );
        await emit(
            pi,
            { toolName: "write", isError: false, input: { path: candidate } },
            context(root, missingRoot, notifications)
        );
        await emit(
            pi,
            { toolName: "write", isError: false, input: { path: candidate } },
            context(root, symlinkRoot, notifications)
        );

        expect(pi.calls).toEqual([]);
        expect(notifications).toEqual([
            {
                message: "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_MISSING",
                severity: "warning",
            },
            {
                message: "plan-artifact-sync: local root: ERROR: PLAN_SYNC_DISCOVERY_UNSAFE",
                severity: "warning",
            },
        ]);
    });

    test("revalidates the discovered candidate identity before invoking the helper", async () => {
        const files = await fixture();
        const replacement = `${files.localPath}.replacement`;
        await writeFile(replacement, planBytes({ marker: "replacement" }));
        let replaced = false;
        const options = {};
        Object.defineProperty(options, "localRoot", {
            enumerable: true,
            get() {
                if (!replaced) {
                    replaced = true;
                    rename(files.localPath, `${files.localPath}.original`).then(() =>
                        rename(replacement, files.localPath)
                    );
                }
                return files.localRoot;
            },
        });

        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);
        ctx.localProtocolOptions = options;
        await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx);

        expect(pi.calls).toEqual([]);
        expect(notifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_SYNC_UNAVAILABLE scope="identity"',
                severity: "warning",
            },
        ]);
    });
});

describe("helper protocol and nonblocking continuation", () => {
    test("continues later identities and aggregates one redacted warning", async () => {
        const root = await temporaryDirectory("omp-plan-continue-repo-");
        const localRoot = await temporaryDirectory("omp-plan-continue-local-");
        for (const slug of ["alpha", "beta", "gamma", "later"]) {
            await writeFile(join(localRoot, `${slug}-plan.md`), planBytes({ marker: slug }));
        }
        const secret = join(root, "raw-secret-path");
        const pi = createFakePi(async (_command, args) => {
            const slug = args[2];
            if (slug === "alpha") {
                return {
                    code: 1,
                    stdout: "",
                    stderr: "ERROR: PLAN_ARTIFACT_INVALID: plan=alpha state=parser:HEADER_H1 path=none effect=none: invalid\n",
                };
            }
            if (slug === "beta") {
                return {
                    code: 1,
                    stdout: "",
                    stderr: `ERROR: PLAN_${"LOCK"}_UNAVAILABLE: plan=beta state=old path=none effect=none: old\n`,
                };
            }
            if (slug === "gamma") {
                return { code: 0, stdout: `wrong ${secret}`, stderr: "" };
            }
            return {
                code: 0,
                stdout: "plan-artifact-copied: .agents/plans/2026-08-09-1700_later.md\n",
                stderr: "",
            };
        });
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(root, localRoot, notifications);
        const hashes = ["alpha", "beta", "gamma", "later"]
            .map((slug, index) => `[${join(localRoot, `${slug}-plan.md`)}#${String(index + 1).padStart(4, "A")}]`)
            .join("\n");

        expect(
            await emit(pi, { toolName: "edit", isError: false, input: { input: `${hashes}\n` } }, ctx)
        ).toBeUndefined();
        expect(pi.calls.map((call) => call.args[2])).toEqual(["alpha", "beta", "gamma", "later"]);
        expect(notifications).toEqual([
            {
                message:
                    'plan-artifact-sync: alpha: ERROR: PLAN_ARTIFACT_INVALID scope="identity" effect=none; ' +
                    'beta: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete; ' +
                    'gamma: ERROR: PLAN_SYNC_ACK_INVALID scope="identity" effect=possible-complete',
                severity: "warning",
            },
        ]);
        expect(JSON.stringify(notifications)).not.toContain(secret);
    });

    test("accepts only copied or archived acknowledgements and the narrowed helper errors", async () => {
        const files = await fixture();
        const cases = [
            {
                response: {
                    code: 0,
                    stdout: "plan-artifact-copied: .agents/plans/2026-08-09-1700_demo.md\n",
                    stderr: "",
                },
                message: null,
            },
            {
                response: {
                    code: 0,
                    stdout: "plan-artifact-archived: .agents/plans/archive/2026-08-09-1700_demo.md\n",
                    stderr: "",
                },
                message: null,
            },
            {
                response: {
                    code: 1,
                    stdout: "",
                    stderr: "ERROR: PLAN_ARCHIVE_CONFLICT: plan=2026-08-09-1700_demo state=archive-divergent path=.agents/plans/archive/2026-08-09-1700_demo.md effect=none: conflict\n",
                },
                message: 'plan-artifact-sync: demo: ERROR: PLAN_ARCHIVE_CONFLICT scope="archive" effect=none',
            },
            {
                response: {
                    code: 1,
                    stdout: "",
                    stderr: "ERROR: PLAN_POSTCONDITION_FAILED: plan=2026-08-09-1700_demo state=uncertain path=.agents/plans/2026-08-09-1700_demo.md effect=possible-complete: uncertain\n",
                },
                message:
                    'plan-artifact-sync: demo: ERROR: PLAN_POSTCONDITION_FAILED scope="active" effect=possible-complete',
            },
        ];

        for (const item of cases) {
            const pi = createFakePi(async () => item.response);
            planArtifactSync(pi);
            const notifications = [];
            await emit(
                pi,
                { toolName: "write", isError: false, input: { path: files.localPath } },
                context(files.root, files.localRoot, notifications)
            );
            expect(notifications.map((entry) => entry.message)).toEqual(item.message === null ? [] : [item.message]);
        }
    });
});

describe("actual parser-backed copy and archive behavior", () => {
    test("creates and replaces active bytes through consecutive mutations", async () => {
        const files = await fixture();
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);

        await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx);
        expect(await readFile(files.active)).toEqual(planBytes());

        const replacement = planBytes({ status: "IN_PROGRESS", marker: "second" });
        await writeFile(files.localPath, replacement);
        await emit(pi, { toolName: "edit", isError: false, input: { path: files.localPath } }, ctx);
        expect(await readFile(files.active)).toEqual(replacement);
        expect(notifications).toEqual([]);
    });

    test("archives both completion-record spellings and repeats exact terminal bytes", async () => {
        for (const record of ["bare", "bulleted"]) {
            const terminal = planBytes({ status: "DONE", record, marker: record });
            const files = await fixture({ bytes: terminal });
            const pi = createFakePi();
            planArtifactSync(pi);
            const notifications = [];
            const ctx = context(files.root, files.localRoot, notifications);

            await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx);
            expect(await exists(files.active)).toBe(false);
            expect(await readFile(files.archive)).toEqual(terminal);
            await emit(pi, { toolName: "edit", isError: false, input: { path: files.localPath } }, ctx);
            expect(await readFile(files.archive)).toEqual(terminal);
            expect(notifications).toEqual([]);
        }
    });

    test("archives CLOSED and refuses malformed terminal state without replacing active bytes", async () => {
        const closed = planBytes({ status: "CLOSED", marker: "closed" });
        const closedFiles = await fixture({ bytes: closed });
        const closedPi = createFakePi();
        planArtifactSync(closedPi);
        const closedNotifications = [];
        await emit(
            closedPi,
            { toolName: "write", isError: false, input: { path: closedFiles.localPath } },
            context(closedFiles.root, closedFiles.localRoot, closedNotifications)
        );
        expect(await readFile(closedFiles.archive)).toEqual(closed);
        expect(closedNotifications).toEqual([]);

        const files = await fixture();
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);
        await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx);
        const before = await readFile(files.active);
        await writeFile(files.localPath, planBytes({ status: "DONE", malformed: true, marker: "invalid" }));
        await emit(pi, { toolName: "edit", isError: false, input: { path: files.localPath } }, ctx);

        expect(await readFile(files.active)).toEqual(before);
        expect(await exists(files.archive)).toBe(false);
        expect(notifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_ARTIFACT_INVALID scope="identity" effect=none',
                severity: "warning",
            },
        ]);
    });

    test("refuses divergent archives and active/archive ambiguity without collateral mutation", async () => {
        const terminal = planBytes({ status: "DONE", marker: "original" });
        const files = await fixture({ bytes: terminal });
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);
        await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx);
        const originalArchive = await readFile(files.archive);

        await writeFile(files.localPath, planBytes({ status: "DONE", marker: "divergent" }));
        await emit(pi, { toolName: "edit", isError: false, input: { path: files.localPath } }, ctx);
        expect(await readFile(files.archive)).toEqual(originalArchive);
        expect(notifications.at(-1)?.message).toBe(
            'plan-artifact-sync: demo: ERROR: PLAN_ARCHIVE_CONFLICT scope="archive" effect=none'
        );

        const conflict = await fixture();
        await mkdir(dirname(conflict.archive), { recursive: true });
        await writeFile(conflict.active, "active-sentinel");
        await writeFile(conflict.archive, "archive-sentinel");
        const conflictPi = createFakePi();
        planArtifactSync(conflictPi);
        const conflictNotifications = [];
        await emit(
            conflictPi,
            { toolName: "write", isError: false, input: { path: conflict.localPath } },
            context(conflict.root, conflict.localRoot, conflictNotifications)
        );
        expect(await readFile(conflict.active, "utf8")).toBe("active-sentinel");
        expect(await readFile(conflict.archive, "utf8")).toBe("archive-sentinel");
        expect(conflictNotifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_IDENTITY_CONFLICT scope="identity" effect=none',
                severity: "warning",
            },
        ]);
    });

    test("surfaces unsafe repository targets through one redacted nonblocking warning", async () => {
        const files = await fixture();
        const outside = await temporaryDirectory("omp-plan-target-outside-");
        const sentinel = join(outside, "sentinel.md");
        await mkdir(dirname(files.active), { recursive: true });
        await writeFile(sentinel, "outside");
        await symlink(sentinel, files.active);

        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        expect(
            await emit(
                pi,
                { toolName: "write", isError: false, input: { path: files.localPath } },
                context(files.root, files.localRoot, notifications)
            )
        ).toBeUndefined();
        expect(await readFile(sentinel, "utf8")).toBe("outside");
        expect(notifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_FILE_KIND_UNSAFE scope="active" effect=none',
                severity: "warning",
            },
        ]);
        expect(JSON.stringify(notifications)).not.toContain(outside);
    });

    test("rejects source and target drift before publication", async () => {
        const largeMarker = "A".repeat(32 * 1024 * 1024);
        const large = Buffer.from(BASE_PLAN.replace("## Authority", `${largeMarker}\n\n## Authority`, 1));

        const sourceFiles = await fixture({ bytes: large });
        const sourceReplacement = `${sourceFiles.localPath}.replacement`;
        await writeFile(sourceReplacement, planBytes({ marker: "source replacement" }));
        const sourceProcess = Bun.spawn([HELPER, "copy", "--slug", "demo", "--content-file", sourceFiles.localPath], {
            cwd: sourceFiles.root,
            stdout: "pipe",
            stderr: "pipe",
        });
        const sourceDeadline = Date.now() + 30_000;
        while (!(await exists(join(sourceFiles.root, ".agents", "plans"))) && Date.now() < sourceDeadline) {
            await Bun.sleep(1);
        }
        await rename(sourceReplacement, sourceFiles.localPath);
        const [sourceError, sourceCode] = await Promise.all([
            new Response(sourceProcess.stderr).text(),
            sourceProcess.exited,
        ]);
        expect(sourceCode).toBe(1);
        expect(sourceError).toContain("ERROR: PLAN_SOURCE_STALE:");
        expect(await exists(sourceFiles.active)).toBe(false);

        const targetFiles = await fixture({ bytes: large });
        await mkdir(dirname(targetFiles.active), { recursive: true });
        await writeFile(targetFiles.active, planBytes({ marker: "initial active" }));
        const targetReplacement = `${targetFiles.active}.replacement`;
        await writeFile(targetReplacement, "target-drift-sentinel");
        const targetProcess = Bun.spawn([HELPER, "copy", "--slug", "demo", "--content-file", targetFiles.localPath], {
            cwd: targetFiles.root,
            stdout: "pipe",
            stderr: "pipe",
        });
        const targetDeadline = Date.now() + 30_000;
        let staged = false;
        while (!staged && Date.now() < targetDeadline) {
            const directory = dirname(targetFiles.active);
            const entries = (await exists(directory)) ? await readdir(directory) : [];
            staged = entries.some((entry) => entry.startsWith(".") && entry.endsWith(".tmp"));
            if (!staged) await Bun.sleep(1);
        }
        expect(staged).toBe(true);
        await rename(targetReplacement, targetFiles.active);
        const [targetError, targetCode] = await Promise.all([
            new Response(targetProcess.stderr).text(),
            targetProcess.exited,
        ]);
        expect(targetCode).toBe(1);
        expect(targetError).toContain("ERROR: PLAN_TARGET_STALE:");
        expect(await readFile(targetFiles.active, "utf8")).toBe("target-drift-sentinel");
    }, 60_000);
});
