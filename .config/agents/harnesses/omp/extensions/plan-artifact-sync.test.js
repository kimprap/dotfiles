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
const COPY_PROTOCOL = "plan-artifact-copy/v1";
const WARNING_RESULT_SCHEMA = "plan-artifact-sync-result/v1";
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

function planBytes({ status = "PENDING", marker = "base" } = {}) {
    if (!["PENDING", "IN_PROGRESS", "DONE", "CLOSED"].includes(status)) {
        throw new Error(`unsupported fixture status: ${status}`);
    }

    let source = BASE_PLAN.replace(
        "- Non-goals: Runtime implementation or external effects.",
        `- Non-goals: Runtime implementation or external effects; marker ${marker}.`
    );
    if (status === "DONE") return Buffer.from(source);

    source = source.replace(
        "**Status**: DONE\n**Completed At**: 2026-09-04-1230\n",
        `**Status**: ${status}\n`
    );
    source = source.slice(0, source.indexOf("\n## Completion Summary"));
    if (status === "PENDING" || status === "IN_PROGRESS") {
        source = source
            .replace("- [x] T1.", "- [ ] T1.")
            .replace("  completed 2026-09-04-1225\n", "")
            .replaceAll("- [x] AC-", "- [ ] AC-");
    }
    if (status === "IN_PROGRESS") {
        source = source.replace("- [ ] AC-1.", "- [x] AC-1.");
    }
    return Buffer.from(`${source.trimEnd()}\n`);
}

function planPaths(root, slug = "demo") {
    const identity = `2026-09-04-1200_${slug}.md`;
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

function argumentValue(args, name) {
    const index = args.indexOf(name);
    return index === -1 ? undefined : args[index + 1];
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

async function runHelper(root, args) {
    return await runProcess(HELPER, args, { cwd: root });
}

function helperError(stderr) {
    const match = /^ERROR: (PLAN_[A-Z_]+): plan=(\S+) state=(\S+) path=(\S+) effect=(\S+): /.exec(stderr);
    if (!match) return null;
    const [, code, plan, state, path, effect] = match;
    return { code, plan, state, path, effect };
}

afterAll(async () => {
    for (const root of roots) await rm(root, { recursive: true, force: true });
});

describe("plan-artifact-sync registration and mutation boundary", () => {
    test("registers only the successful mutation listener", async () => {
        const pi = createFakePi();
        planArtifactSync(pi);

        expect([...pi.listeners.keys()]).toEqual(["tool_result"]);
        expect(pi.registeredTools).toEqual([]);

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
            expect(call.args).toEqual([
                "copy",
                "--protocol",
                COPY_PROTOCOL,
                "--slug",
                "demo",
                "--content-file",
                await realpath(files.localPath),
            ]);
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

        expect(pi.calls.map((call) => argumentValue(call.args, "--slug"))).toEqual(["alpha", "zeta"]);
        expect(await readFile(planPaths(root, "alpha").active)).toEqual(planBytes({ marker: "alpha" }));
        expect(await readFile(planPaths(root, "zeta").active)).toEqual(planBytes({ marker: "zeta" }));
        expect(notifications).toEqual([]);
    });
});

describe("plan draft discovery and safe paths", () => {
    test("rejects out-of-root and symlink candidates", async () => {
        const root = await temporaryDirectory("omp-plan-safe-repo-");
        const localRoot = await temporaryDirectory("omp-plan-safe-local-");
        const outsideRoot = await temporaryDirectory("omp-plan-safe-outside-");
        const outside = join(outsideRoot, "outside-plan.md");
        const target = join(outsideRoot, "target.md");
        const linked = join(localRoot, "linked-plan.md");
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
                input: { input: `[${outside}#AAAA]\n[${linked}#BBBB]\n` },
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

    test("warns once without a helper retry when a successful plan mutation source disappears", async () => {
        const files = await fixture();
        await rm(files.localPath);
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const event = {
            toolName: "write",
            isError: false,
            input: { path: "local://demo-plan.md" },
            content: [{ type: "text", text: "write succeeded" }],
            details: { changed: true, resolvedPath: files.localPath },
        };

        const result = await emit(pi, event, context(files.root, files.localRoot, notifications));
        const message = 'plan-artifact-sync: demo: ERROR: PLAN_SYNC_DISCOVERY_MISSING scope="identity"';
        expect(pi.calls).toEqual([]);
        expect(notifications).toEqual([{ message, severity: "warning" }]);
        expect(result).toEqual({
            content: [
                { type: "text", text: "write succeeded" },
                { type: "text", text: message },
            ],
            details: {
                changed: true,
                resolvedPath: files.localPath,
                planArtifactSync: {
                    schema: WARNING_RESULT_SCHEMA,
                    status: "failed",
                    warnings: [
                        {
                            kind: "discovery",
                            scope: "identity",
                            code: "PLAN_SYNC_DISCOVERY_MISSING",
                            identity: "demo",
                        },
                    ],
                },
            },
        });
    });

    test("keeps an incidental missing plan-looking reference silent", async () => {
        const root = await temporaryDirectory("omp-plan-incidental-repo-");
        const localRoot = await temporaryDirectory("omp-plan-incidental-local-");
        const note = join(localRoot, "notes.md");
        await writeFile(note, "See local://missing-plan.md\n");
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];

        const result = await emit(
            pi,
            {
                toolName: "write",
                isError: false,
                input: { path: note, content: "See local://missing-plan.md\n" },
                content: [{ type: "text", text: "wrote notes mentioning local://missing-plan.md" }],
                details: { changed: true },
            },
            context(root, localRoot, notifications)
        );

        expect(result).toBeUndefined();
        expect(pi.calls).toEqual([]);
        expect(notifications).toEqual([]);
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
            const slug = argumentValue(args, "--slug");
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
                stdout: "plan-artifact-copied: .agents/plans/2026-09-04-1200_later.md\n",
                stderr: "",
            };
        });
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(root, localRoot, notifications);
        const hashes = ["alpha", "beta", "gamma", "later"]
            .map((slug, index) => `[${join(localRoot, `${slug}-plan.md`)}#${String(index + 1).padStart(4, "A")}]`)
            .join("\n");

        const event = {
            toolName: "edit",
            isError: false,
            input: { input: `${hashes}\n` },
            content: [{ type: "text", text: "edit succeeded" }],
            details: { changed: true },
        };
        const result = await emit(pi, event, ctx);
        expect(pi.calls.map((call) => argumentValue(call.args, "--slug"))).toEqual(["alpha", "beta", "gamma", "later"]);
        const message =
            'plan-artifact-sync: alpha: ERROR: PLAN_ARTIFACT_INVALID scope="identity" effect=none; ' +
            'beta: ERROR: PLAN_SYNC_HELPER_FAILED scope="identity" effect=possible-complete; ' +
            'gamma: ERROR: PLAN_SYNC_ACK_INVALID scope="identity" effect=possible-complete';
        expect(result).toEqual({
            content: [
                { type: "text", text: "edit succeeded" },
                { type: "text", text: message },
            ],
            details: {
                changed: true,
                planArtifactSync: {
                    schema: WARNING_RESULT_SCHEMA,
                    status: "failed",
                    warnings: [
                        {
                            kind: "sync",
                            scope: "identity",
                            code: "PLAN_ARTIFACT_INVALID",
                            identity: "alpha",
                            effect: "none",
                        },
                        {
                            kind: "sync",
                            scope: "identity",
                            code: "PLAN_SYNC_HELPER_FAILED",
                            identity: "beta",
                            effect: "possible-complete",
                        },
                        {
                            kind: "sync",
                            scope: "identity",
                            code: "PLAN_SYNC_ACK_INVALID",
                            identity: "gamma",
                            effect: "possible-complete",
                        },
                    ],
                },
            },
        });
        expect(notifications).toEqual([{ message, severity: "warning" }]);
        expect(JSON.stringify({ notifications, result })).not.toContain(secret);
    });

    test("accepts only copied acknowledgements and the narrowed helper errors", async () => {
        const files = await fixture();
        const cases = [
            {
                response: {
                    code: 0,
                    stdout: "plan-artifact-copied: .agents/plans/2026-09-04-1200_demo.md\n",
                    stderr: "",
                },
                message: null,
            },
            {
                response: {
                    code: 0,
                    stdout: "plan-artifact-archived: .agents/plans/archive/2026-09-04-1200_demo.md\n",
                    stderr: "",
                },
                message: 'plan-artifact-sync: demo: ERROR: PLAN_SYNC_ACK_INVALID scope="identity" effect=possible-complete',
            },
            {
                response: {
                    code: 1,
                    stdout: "",
                    stderr: "ERROR: PLAN_ARCHIVE_CONFLICT: plan=2026-09-04-1200_demo state=archive-exists path=.agents/plans/archive/2026-09-04-1200_demo.md effect=none: conflict\n",
                },
                message: 'plan-artifact-sync: demo: ERROR: PLAN_ARCHIVE_CONFLICT scope="archive" effect=none',
            },
            {
                response: {
                    code: 1,
                    stdout: "",
                    stderr: "ERROR: PLAN_POSTCONDITION_FAILED: plan=2026-09-04-1200_demo state=uncertain path=.agents/plans/2026-09-04-1200_demo.md effect=possible-complete: uncertain\n",
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

describe("wire protocol enforcement and live skew", () => {
    test("accepts only the explicit current protocol", async () => {
        const current = await fixture();
        const currentResult = await runHelper(current.root, [
            "copy",
            "--protocol",
            COPY_PROTOCOL,
            "--slug",
            "demo",
            "--content-file",
            current.localPath,
        ]);
        expect(currentResult).toEqual({
            code: 0,
            stdout: "plan-artifact-copied: .agents/plans/2026-09-04-1200_demo.md\n",
            stderr: "",
        });
        expect(await readFile(current.active)).toEqual(planBytes());

        const unversioned = await fixture();
        const unversionedResult = await runHelper(unversioned.root, [
            "copy",
            "--slug",
            "demo",
            "--content-file",
            unversioned.localPath,
        ]);
        expect({ ...unversionedResult, stderr: helperError(unversionedResult.stderr) }).toEqual({
            code: 2,
            stdout: "",
            stderr: {
                code: "PLAN_SYNC_PROTOCOL_MISMATCH",
                plan: "demo",
                state: "protocol-unsupported",
                path: "none",
                effect: "none",
            },
        });
        expect(await exists(unversioned.active)).toBe(false);

        const obsolete = await fixture();
        const obsoleteResult = await runHelper(obsolete.root, [
            "sync",
            "--slug",
            "demo",
            "--content-file",
            obsolete.localPath,
        ]);
        expect(obsoleteResult.code).toBe(2);
        expect(obsoleteResult.stdout).toBe("");
        expect(obsoleteResult.stderr).toMatch(/^ERROR: /);
        expect(await exists(obsolete.active)).toBe(false);
    });

    test("rejects an unknown protocol before repository mutation", async () => {
        const files = await fixture();
        const result = await runHelper(files.root, [
            "copy",
            "--protocol",
            "plan-artifact-copy/v2",
            "--slug",
            "demo",
            "--content-file",
            files.localPath,
        ]);

        expect({ ...result, stderr: helperError(result.stderr) }).toEqual({
            code: 2,
            stdout: "",
            stderr: {
                code: "PLAN_SYNC_PROTOCOL_MISMATCH",
                plan: "demo",
                state: "protocol-unsupported",
                path: "none",
                effect: "none",
            },
        });
        expect(await exists(files.active)).toBe(false);
    });

    test("rejects a slug and source identity mismatch before repository mutation", async () => {
        const files = await fixture();
        const result = await runHelper(files.root, [
            "copy",
            "--protocol",
            COPY_PROTOCOL,
            "--slug",
            "other",
            "--content-file",
            files.localPath,
        ]);

        expect({ ...result, stderr: helperError(result.stderr) }).toEqual({
            code: 1,
            stdout: "",
            stderr: {
                code: "PLAN_IDENTITY_MISMATCH",
                plan: "other",
                state: "source-basename-mismatch",
                path: "none",
                effect: "none",
            },
        });
        expect(await exists(files.active)).toBe(false);
        expect(await exists(planPaths(files.root, "other").active)).toBe(false);
        expect(await exists(files.archive)).toBe(false);
    });

    test("persists a mismatch when a loaded extension sees a replaced helper", async () => {
        const files = await fixture();
        const helperRoot = await temporaryDirectory("omp-plan-helper-generation-");
        const helperFixture = join(helperRoot, "omp-copy-plan-artifact");
        await writeFile(
            helperFixture,
            '#!/usr/bin/env bun\nconsole.log("plan-artifact-copied: .agents/plans/2026-09-04-1200_demo.md");\n'
        );
        await chmod(helperFixture, 0o755);

        const pi = createFakePi(async (_command, args, options) => await runProcess(helperFixture, args, options));
        planArtifactSync(pi);

        await writeFile(
            helperFixture,
            `#!/usr/bin/env bun
const protocolIndex = process.argv.indexOf("--protocol");
if (protocolIndex === -1 || process.argv[protocolIndex + 1] !== "plan-artifact-copy/v2") {
    console.error(
        "ERROR: PLAN_SYNC_PROTOCOL_MISMATCH: plan=demo state=protocol-unsupported path=none effect=none: unsupported"
    );
    process.exit(2);
}
console.log("plan-artifact-copied: .agents/plans/2026-09-04-1200_demo.md");
`
        );
        await chmod(helperFixture, 0o755);

        const notifications = [];
        const event = {
            toolName: "write",
            isError: false,
            input: { path: files.localPath },
            content: [{ type: "text", text: "write succeeded" }],
            details: { path: files.localPath },
        };
        const result = await emit(pi, event, context(files.root, files.localRoot, notifications));
        const message = 'plan-artifact-sync: demo: ERROR: PLAN_SYNC_PROTOCOL_MISMATCH scope="identity" effect=none';

        expect(pi.calls[0].args).toEqual([
            "copy",
            "--protocol",
            COPY_PROTOCOL,
            "--slug",
            "demo",
            "--content-file",
            await realpath(files.localPath),
        ]);
        expect(result).toEqual({
            content: [
                { type: "text", text: "write succeeded" },
                { type: "text", text: message },
            ],
            details: {
                path: files.localPath,
                planArtifactSync: {
                    schema: WARNING_RESULT_SCHEMA,
                    status: "failed",
                    warnings: [
                        {
                            kind: "sync",
                            scope: "identity",
                            code: "PLAN_SYNC_PROTOCOL_MISMATCH",
                            identity: "demo",
                            effect: "none",
                        },
                    ],
                },
            },
        });
        expect(notifications).toEqual([{ message, severity: "warning" }]);
        expect(await exists(files.active)).toBe(false);
    });

    test("copies distinct slugs safely through concurrent current-protocol calls", async () => {
        const root = await temporaryDirectory("omp-plan-concurrent-repo-");
        const localRoot = await temporaryDirectory("omp-plan-concurrent-local-");
        const alpha = join(localRoot, "alpha-plan.md");
        const zeta = join(localRoot, "zeta-plan.md");
        await Promise.all([
            writeFile(alpha, planBytes({ marker: "alpha" })),
            writeFile(zeta, planBytes({ marker: "zeta" })),
        ]);

        const results = await Promise.all(
            [
                ["alpha", alpha],
                ["zeta", zeta],
            ].map(([slug, contentFile]) =>
                runHelper(root, ["copy", "--protocol", COPY_PROTOCOL, "--slug", slug, "--content-file", contentFile])
            )
        );

        expect(results.map((result) => result.code)).toEqual([0, 0]);
        expect(await readFile(planPaths(root, "alpha").active)).toEqual(planBytes({ marker: "alpha" }));
        expect(await readFile(planPaths(root, "zeta").active)).toEqual(planBytes({ marker: "zeta" }));
    });
});

describe("actual parser-backed active copy behavior", () => {
    test("copies every valid lifecycle to the active path without creating an archive", async () => {
        for (const status of ["PENDING", "IN_PROGRESS", "DONE", "CLOSED"]) {
            const bytes = planBytes({ status, marker: status.toLowerCase() });
            const files = await fixture({ bytes });
            const pi = createFakePi();
            planArtifactSync(pi);
            const notifications = [];
            const ctx = context(files.root, files.localRoot, notifications);

            expect(
                await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx)
            ).toBeUndefined();
            expect(await readFile(files.active)).toEqual(bytes);
            expect(await exists(files.archive)).toBe(false);
            expect(await exists(dirname(files.archive))).toBe(false);

            await emit(pi, { toolName: "edit", isError: false, input: { path: files.localPath } }, ctx);
            expect(await readFile(files.active)).toEqual(bytes);
            expect(await exists(files.archive)).toBe(false);
            expect(notifications).toEqual([]);
        }
    });

    test("refuses parser-invalid bytes without replacing the active plan", async () => {
        const files = await fixture();
        const pi = createFakePi();
        planArtifactSync(pi);
        const notifications = [];
        const ctx = context(files.root, files.localRoot, notifications);
        await emit(pi, { toolName: "write", isError: false, input: { path: files.localPath } }, ctx);
        const before = await readFile(files.active);
        const invalid = Buffer.from(
            planBytes({ status: "DONE", marker: "invalid" })
                .toString("utf8")
                .replace("## Completion Summary", "## Invalid Completion Summary")
        );
        await writeFile(files.localPath, invalid);
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

    test("preserves archive-only and active/archive identity conflicts", async () => {
        const archiveOnly = await fixture({ bytes: planBytes({ status: "DONE", marker: "archive-only" }) });
        await mkdir(dirname(archiveOnly.archive), { recursive: true });
        await writeFile(archiveOnly.archive, "historical-archive-sentinel");
        const archivePi = createFakePi();
        planArtifactSync(archivePi);
        const archiveNotifications = [];
        await emit(
            archivePi,
            { toolName: "write", isError: false, input: { path: archiveOnly.localPath } },
            context(archiveOnly.root, archiveOnly.localRoot, archiveNotifications)
        );
        expect(await exists(archiveOnly.active)).toBe(false);
        expect(await readFile(archiveOnly.archive, "utf8")).toBe("historical-archive-sentinel");
        expect(archiveNotifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_ARCHIVE_CONFLICT scope="archive" effect=none',
                severity: "warning",
            },
        ]);

        const both = await fixture();
        await mkdir(dirname(both.archive), { recursive: true });
        await writeFile(both.active, "active-sentinel");
        await writeFile(both.archive, "archive-sentinel");
        const bothPi = createFakePi();
        planArtifactSync(bothPi);
        const bothNotifications = [];
        await emit(
            bothPi,
            { toolName: "write", isError: false, input: { path: both.localPath } },
            context(both.root, both.localRoot, bothNotifications)
        );
        expect(await readFile(both.active, "utf8")).toBe("active-sentinel");
        expect(await readFile(both.archive, "utf8")).toBe("archive-sentinel");
        expect(bothNotifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_IDENTITY_CONFLICT scope="identity" effect=none',
                severity: "warning",
            },
        ]);
    });

    test("surfaces unsafe active and historical archive targets through redacted warnings", async () => {
        const outside = await temporaryDirectory("omp-plan-target-outside-");

        const activeFiles = await fixture();
        const activeSentinel = join(outside, "active-sentinel.md");
        await mkdir(dirname(activeFiles.active), { recursive: true });
        await writeFile(activeSentinel, "outside-active");
        await symlink(activeSentinel, activeFiles.active);
        const activePi = createFakePi();
        planArtifactSync(activePi);
        const activeNotifications = [];
        await emit(
            activePi,
            { toolName: "write", isError: false, input: { path: activeFiles.localPath } },
            context(activeFiles.root, activeFiles.localRoot, activeNotifications)
        );
        expect(await readFile(activeSentinel, "utf8")).toBe("outside-active");
        expect(activeNotifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_FILE_KIND_UNSAFE scope="active" effect=none',
                severity: "warning",
            },
        ]);

        const archiveFiles = await fixture();
        const archiveSentinel = join(outside, "archive-sentinel.md");
        await mkdir(dirname(archiveFiles.archive), { recursive: true });
        await writeFile(archiveSentinel, "outside-archive");
        await symlink(archiveSentinel, archiveFiles.archive);
        const archivePi = createFakePi();
        planArtifactSync(archivePi);
        const archiveNotifications = [];
        await emit(
            archivePi,
            { toolName: "write", isError: false, input: { path: archiveFiles.localPath } },
            context(archiveFiles.root, archiveFiles.localRoot, archiveNotifications)
        );
        expect(await exists(archiveFiles.active)).toBe(false);
        expect(await readFile(archiveSentinel, "utf8")).toBe("outside-archive");
        expect(archiveNotifications).toEqual([
            {
                message: 'plan-artifact-sync: demo: ERROR: PLAN_FILE_KIND_UNSAFE scope="archive" effect=none',
                severity: "warning",
            },
        ]);
        expect(JSON.stringify({ activeNotifications, archiveNotifications })).not.toContain(outside);
    });

    test("rejects source and target drift before publication", async () => {
        const largeMarker = "A".repeat(32 * 1024 * 1024);
        const large = planBytes({ marker: largeMarker });

        const sourceFiles = await fixture({ bytes: large });
        const sourceReplacement = `${sourceFiles.localPath}.replacement`;
        await writeFile(sourceReplacement, planBytes({ marker: "source replacement" }));
        const sourceProcess = Bun.spawn(
            [HELPER, "copy", "--protocol", COPY_PROTOCOL, "--slug", "demo", "--content-file", sourceFiles.localPath],
            {
                cwd: sourceFiles.root,
                stdout: "pipe",
                stderr: "pipe",
            }
        );
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
        const targetProcess = Bun.spawn(
            [HELPER, "copy", "--protocol", COPY_PROTOCOL, "--slug", "demo", "--content-file", targetFiles.localPath],
            {
                cwd: targetFiles.root,
                stdout: "pipe",
                stderr: "pipe",
            }
        );
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
