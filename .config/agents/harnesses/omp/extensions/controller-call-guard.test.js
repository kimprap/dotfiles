import { describe, expect, test } from "bun:test";

import controllerCallGuard from "./controller-call-guard.js";

const CLI = "node .config/agents/harnesses/omp/acp-controller/cli.mjs";
const KILL_SCOPE_DIR = "/tmp/acp-killscope-abc123";
const PROBE = `node ${KILL_SCOPE_DIR}/caller.mjs reconcile < ${KILL_SCOPE_DIR}/request.json`;
const KILL_SCOPE_LAUNCH = `~/.local/bin/omp -p --no-session --thinking=low 'Run this exact command with your bash tool, with timeout: 5, from the current directory:\n\n${PROBE}\n\nDo nothing else.'`;

function guardHandler() {
    const handlers = new Map();
    controllerCallGuard({
        setLabel() {},
        on(name, handler) {
            handlers.set(name, handler);
        },
    });
    return handlers.get("tool_call");
}

const handler = guardHandler();

function bash(input) {
    return handler({ toolName: "bash", toolCallId: "call-1", input });
}

describe("controller call", () => {
    test("service fields and a nonzero timeout are rewritten; other fields stay", () => {
        const result = bash({
            command: `${CLI} reconcile < /tmp/req/reconcile-request.json`,
            cwd: "/Users/kim/.dotfiles",
            i: "Running controller",
            timeout: 10,
            name: "controller",
            ready: { log: "done" },
            async: true,
            pty: true,
        });
        expect(result.input).toEqual({
            command: `${CLI} reconcile < /tmp/req/reconcile-request.json`,
            cwd: "/Users/kim/.dotfiles",
            i: "Running controller",
            timeout: 0,
        });
        expect(result.additionalContext).toBe(
            "controller-call-guard rewrote this controller call: set timeout to 0 (was 10); removed name, ready, async, pty."
        );
    });

    test("a missing timeout is set to 0", () => {
        const result = bash({ command: `${CLI} roles < /tmp/req/roles-body.json` });
        expect(result.input).toEqual({ command: `${CLI} roles < /tmp/req/roles-body.json`, timeout: 0 });
        expect(result.additionalContext).toBe(
            "controller-call-guard rewrote this controller call: set timeout to 0 (was unset)."
        );
    });

    test("an absolute node path after cd and env assignments is a run", () => {
        const command = `cd /Users/kim/.dotfiles && FOO=1 /opt/homebrew/bin/node "$PWD/.config/agents/harnesses/omp/acp-controller/cli.mjs" stop run-1 2>&1`;
        expect(bash({ command, timeout: 0, name: "stop" })).toEqual({
            input: { command, timeout: 0 },
            additionalContext: "controller-call-guard rewrote this controller call: removed name.",
        });
    });
});

describe("kill-scope launch", () => {
    test("omp -p naming a killscope folder is rewritten", () => {
        const result = bash({ command: KILL_SCOPE_LAUNCH, timeout: 600, async: true, name: "killscope" });
        expect(result.input).toEqual({ command: KILL_SCOPE_LAUNCH, timeout: 0 });
        expect(result.additionalContext).toBe(
            "controller-call-guard rewrote this kill-scope launch: set timeout to 0 (was 600); removed name, async."
        );
    });
});

describe("controller suite", () => {
    test("npm test with an acp-controller cwd keeps async", () => {
        const cwd = "/Users/kim/.dotfiles/.config/agents/harnesses/omp/acp-controller";
        const command = "npm test > /tmp/suite.log 2>&1";
        const result = bash({ command, cwd, async: true, pty: false, ready: { port: 1 } });
        expect(result.input).toEqual({ command, cwd, async: true, timeout: 0 });
        expect(result.additionalContext).toBe(
            "controller-call-guard rewrote this controller suite: set timeout to 0 (was unset); removed ready, pty."
        );
    });

    test("npm test with acp-controller named in the command is rewritten", () => {
        const command = "cd .config/agents/harnesses/omp/acp-controller && npm test";
        expect(bash({ command, timeout: 300 }).input).toEqual({ command, timeout: 0 });
    });
});

describe("left untouched", () => {
    test.each([
        ["the kill-scope probe", { command: PROBE, timeout: 5 }],
        ["the quick-check omp -p without a killscope folder", { command: "omp -p --no-session --thinking=low 'Say hi'" }],
        ["a command that only mentions cli.mjs", { command: "grep -n reconcile .config/agents/harnesses/omp/acp-controller/cli.mjs" }],
        ["node running another script that names cli.mjs", { command: "node lint.mjs acp-controller/cli.mjs" }],
        ["npm test elsewhere", { command: "npm test", cwd: "/Users/kim/project" }],
        ["a correct controller call", { command: `${CLI} roles < /tmp/r.json`, timeout: 0, i: "Roles" }],
        ["a correct suite call", { command: "npm test", cwd: "/x/acp-controller", timeout: 0, async: true }],
    ])("%s", (_label, input) => {
        expect(bash(input)).toBeUndefined();
    });

    test("a non-bash tool", () => {
        expect(handler({ toolName: "eval", input: { command: `${CLI} roles`, timeout: 10 } })).toBeUndefined();
    });

    test.each([
        ["no event", undefined],
        ["no input", { toolName: "bash" }],
        ["a non-string command", { toolName: "bash", input: { command: ["node", "cli.mjs"] } }],
        ["a throwing getter", { toolName: "bash", get input() { throw new Error("boom"); } }],
    ])("malformed input: %s returns undefined without throwing", (_label, event) => {
        expect(handler(event)).toBeUndefined();
    });
});
