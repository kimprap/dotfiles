import { afterEach, describe, expect, setDefaultTimeout, test } from "bun:test";
import { chmod, copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import lifecyclePlugin from "./lifecycle-plugin.js";
import { createLifecycleSupervisor, createMechanicalProbeSupervisor } from "./lifecycle-supervisor.js";
import * as TypeBox from "./node_modules/@oh-my-pi/pi-coding-agent/src/extensibility/legacy-typebox.ts";

const CALL_SCHEMA = "omp-lifecycle-call/v1";
const RESULT_SCHEMA = "omp-lifecycle-result/v1";
const ROOT = "session-root";
setDefaultTimeout(120_000);

const FIXTURE = join(import.meta.dir, "fixtures", "lifecycle-rpc-worker.js");
const harnesses = new Set();

const agents = [
    { name: "task", systemPrompt: "TASK PROFILE PROMPT", model: ["fixture/task"], readSummarize: true, source: "bundled" },
    { name: "second-opinion-a", systemPrompt: "REVIEWER A PROFILE PROMPT", model: ["fixture/a"], readSummarize: false, source: "project" },
    { name: "second-opinion-b", systemPrompt: "REVIEWER B PROFILE PROMPT", model: ["fixture/b"], readSummarize: false, source: "project" },
];

const models = {
    resolve(selector) {
        const [provider, id] = selector.split("/");
        return provider && id ? { provider, id } : undefined;
    },
    current() {
        return { provider: "fixture", id: "current" };
    },
};

async function discover() {
    return { agents };
}

function openReconcile(supervisor, binding = { mode: "standalone", controller: "root" }, metadata = undefined) {
    return supervisor.call({ schema: CALL_SCHEMA, op: "open", definition: "reconcile", binding, metadata }, ROOT);
}

function retraceBinding(scopeIds, normalizer = undefined) {
    return {
        controller: "root",
        ...(normalizer ? { normalizer: { id: normalizer } } : {}),
        scopes: scopeIds.map((id) => ({ id, requires: [] })),
        maxDirectActors: 4,
    };
}

function openRetrace(supervisor, scopeIds, normalizer = undefined) {
    return supervisor.call(
        { schema: CALL_SCHEMA, op: "open", definition: "retrace", binding: retraceBinding(scopeIds, normalizer) },
        ROOT
    );
}

async function createHarness({ behaviors = [], proofOnly = false, clientFactory, discoverAgents = discover } = {}) {
    const directory = await mkdtemp(join(tmpdir(), "omp-lifecycle-"));
    const executable = join(directory, "omp");
    const logPath = join(directory, "processes.jsonl");
    await copyFile(FIXTURE, executable);
    await chmod(executable, 0o755);
    let behaviorIndex = 0;
    const env = {
        PATH: `${directory}:${Bun.env.PATH ?? ""}`,
        LIFECYCLE_FIXTURE_LOG: logPath,
        LIFECYCLE_FIXTURE_BARRIER_DIR: directory,
    };
    Object.defineProperty(env, "LIFECYCLE_FIXTURE_BEHAVIOR", {
        enumerable: true,
        get() {
            return behaviors[behaviorIndex++] ?? "normal";
        },
    });
    const harness = {
        directory,
        logPath,
        notifications: [],
        intervals: [],
        cleared: [],
        async events() {
            try {
                return (await readFile(logPath, "utf8")).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
            } catch (error) {
                if (error?.code === "ENOENT") return [];
                throw error;
            }
        },
        tick() {
            for (const timer of harness.intervals.filter((entry) => entry.active)) timer.callback();
        },
    };
    const options = {
        cwd: import.meta.dir,
        env,
        models,
        discover: discoverAgents,
        ...(clientFactory ? { clientFactory } : {}),
        notify(message, details) {
            harness.notifications.push({ message, details });
        },
        setInterval(callback, ms) {
            const timer = { callback, ms, active: true };
            harness.intervals.push(timer);
            return timer;
        },
        clearTimer(timer) {
            timer.active = false;
            harness.cleared.push(timer);
        },
        wakeIntervalMs: 50,
    };
    harness.supervisor = proofOnly ? createMechanicalProbeSupervisor(options) : createLifecycleSupervisor(options);
    harnesses.add(harness);
    return harness;
}

function expectEnvelope(result, op, ok = true) {
    expect(result.schema).toBe(RESULT_SCHEMA);
    expect(result.op).toBe(op);
    expect(result.ok).toBe(ok);
}

async function observe(supervisor, runId, requestIds = undefined, owner = ROOT) {
    return await supervisor.call({ schema: CALL_SCHEMA, op: "observe", runId, requestIds }, owner);
}

async function dispatch(supervisor, runId, calls, owner = ROOT) {
    return await supervisor.call({ schema: CALL_SCHEMA, op: "dispatch", runId, calls }, owner);
}

async function waitFor(predicate, message = "condition") {
    for (let index = 0; index < 400; index += 1) {
        if (await predicate()) return;
        await Bun.sleep(5);
    }
    throw new Error(`Timed out waiting for ${message}`);
}

async function waitRequest(supervisor, runId, requestId, predicate, message = "request state") {
    let request;
    await waitFor(async () => {
        const view = await observe(supervisor, runId, [requestId]);
        request = view.data.requests[0];
        return predicate(request);
    }, message);
    return request;
}

async function actorProcess(harness, actorId) {
    await waitFor(async () => (await harness.events()).some((entry) => entry.event === "prompt" && entry.actorId === actorId), `${actorId} process`);
    return (await harness.events()).find((entry) => entry.event === "prompt" && entry.actorId === actorId);
}
async function openFixtureBarrier(harness, name) {
    await writeFile(join(harness.directory, name), "");
}

function processIsAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    } catch (error) {
        if (error?.code === "ESRCH") return false;
        throw error;
    }
}

class CleanupRefusalClient {
    constructor(options) {
        this.options = options;
        this.pid = 424_242;
        this.listeners = new Set();
    }
    onEvent(listener) {
        this.listeners.add(listener);
    }
    async start() {}
    async setAutoRetry() {}
    async prompt() {}
    async abort() {}
    async stop() {
        throw new Error("controlled cleanup refusal");
    }
}

afterEach(async () => {
    for (const harness of harnesses) {
        await harness.supervisor.closeAll(ROOT).catch(() => {});
        await rm(harness.directory, { recursive: true, force: true });
    }
    harnesses.clear();
});

describe("replacement lifecycle plugin", () => {
    test("compiles named consumers before effects", async () => {
        const harness = await createHarness();
        for (const binding of [null, {}, { mode: "standalone" }, { mode: "standalone", controller: "../unsafe" }, { mode: "delegated", controller: "root" }]) {
            const result = await openReconcile(harness.supervisor, binding);
            expectEnvelope(result, "open", false);
            expect(result.error.code).toBe("INVALID_INPUT");
        }
        const cyclic = await harness.supervisor.call({
            schema: CALL_SCHEMA,
            op: "open",
            definition: "retrace",
            binding: { controller: "root", scopes: [{ id: "one", requires: ["two"] }, { id: "two", requires: ["one"] }], maxDirectActors: 4 },
        }, ROOT);
        expect(cyclic.error.code).toBe("INVALID_INPUT");
        expect(harness.supervisor.runCount).toBe(0);
        expect(await harness.events()).toHaveLength(0);

        const standalone = await openReconcile(harness.supervisor, undefined, { trace: "ignored" });
        expect(standalone.data.actors.map((actor) => actor.actorId)).toEqual(["reviewer-a", "reviewer-b"]);
        const delegated = await openReconcile(harness.supervisor, { mode: "delegated", controller: "root", scope: "scope-one" });
        expect(delegated.data.actors.map((actor) => actor.actorId)).toEqual(["reviewer-a", "reviewer-b"]);
        const retrace = await openRetrace(harness.supervisor, ["scope-one", "scope-two"], "normalizer");
        expect(retrace.data.actors.map((actor) => actor.actorId)).toEqual(["normalizer", "scope-one", "scope-two"]);
        const sent = await dispatch(harness.supervisor, retrace.runId, [{ target: "scope-one", phase: "candidate", body: "silent" }]);
        expect(sent.data.requests[0].state).toBe("pending");
        const production = (await harness.events()).find((entry) => entry.event === "start" && entry.argv.includes("TASK PROFILE PROMPT"));
        expect(production.argv[production.argv.indexOf("--system-prompt") + 1]).toBe("TASK PROFILE PROMPT");

        const proofHarness = await createHarness({ proofOnly: true });
        const proof = await openRetrace(proofHarness.supervisor, ["scope-one"]);
        await dispatch(proofHarness.supervisor, proof.runId, [{ target: "scope-one", phase: "probe", body: "silent" }]);
        const proofStart = (await proofHarness.events()).find((entry) => entry.event === "start");
        expect(proofStart.argv[proofStart.argv.indexOf("--system-prompt") + 1]).toContain("mechanical lifecycle probe");
        expect(production.argv.join(" ")).not.toContain("mechanical lifecycle probe");
    });

    test("implements the complete lifecycle interface", async () => {
        const registeredTools = [];
        const registeredCommands = [];
        const listeners = new Map();
        lifecyclePlugin({
            typebox: TypeBox,
            setLabel() {}, registerTool(tool) { registeredTools.push(tool); },
            registerCommand(name, command) { registeredCommands.push({ name, command }); },
            on(name, handler) { listeners.set(name, handler); }, sendMessage() {},
        });
        expect(registeredTools.map((tool) => tool.name)).toEqual(["lifecycle"]);
        expect(registeredCommands.map((command) => command.name)).toEqual(["lifecycle"]);
        expect([...listeners.keys()]).toEqual(["session_shutdown"]);
        const validOpenBody = {
            schema: CALL_SCHEMA,
            op: "open",
            definition: "reconcile",
            binding: { mode: "standalone", controller: "root" },
        };
        expect(registeredTools[0].parameters.assert(validOpenBody)).toEqual(validOpenBody);
        expect(() => registeredTools[0].parameters.assert({ ...validOpenBody, op: 17 })).toThrow();

        const harness = await createHarness();
        const invalid = await harness.supervisor.call({ schema: "wrong", op: "open" }, ROOT);
        const forbidden = [];
        for (const field of ["command", "spawn", "processFactory", "clientFactory", "env", "environment"]) {
            forbidden.push(await harness.supervisor.call({ schema: CALL_SCHEMA, op: "open", definition: "reconcile", binding: { mode: "standalone", controller: "root" }, [field]: "forbidden" }, ROOT));
        }
        expect(forbidden.every((result) => result.error.code === "INVALID_INPUT")).toBe(true);
        const unknown = await harness.supervisor.call({ schema: CALL_SCHEMA, op: "open", definition: "third-consumer", binding: {} }, ROOT);
        const unavailableHarness = await createHarness({ discoverAgents: async () => ({ agents: [] }) });
        const profileFailure = await openReconcile(unavailableHarness.supervisor);

        const opened = await openReconcile(harness.supervisor);
        const pending = await dispatch(harness.supervisor, opened.runId, [{ target: "reviewer-a", phase: "initial", body: "silent" }]);
        const unauthorized = await observe(harness.supervisor, opened.runId, undefined, "other-session");
        await dispatch(harness.supervisor, opened.runId, [{ target: "reviewer-a", phase: "rethink", body: "queued" }]);
        const busy = await dispatch(harness.supervisor, opened.runId, [{ target: "reviewer-a", phase: "third", body: "blocked" }]);
        const aborted = await harness.supervisor.call({ schema: CALL_SCHEMA, op: "abort", runId: opened.runId, requestId: pending.data.requests[0].requestId }, ROOT);
        expect(aborted.data.state).toBe("aborted");
        const abortedView = await observe(harness.supervisor, opened.runId, [pending.data.requests[0].requestId]);
        const terminal = await dispatch(harness.supervisor, opened.runId, [{ target: "reviewer-a", phase: "late", body: "blocked" }]);

        const startHarness = await createHarness({ behaviors: ["start-exit"] });
        const startOpen = await openReconcile(startHarness.supervisor);
        const startFailed = await dispatch(startHarness.supervisor, startOpen.runId, [{ target: "reviewer-a", phase: "start", body: "x" }]);

        const deliveryHarness = await createHarness();
        const deliveryOpen = await openReconcile(deliveryHarness.supervisor);
        const deliveryUnknown = await dispatch(deliveryHarness.supervisor, deliveryOpen.runId, [{ target: "reviewer-a", phase: "deliver", body: "delivery-unknown" }]);

        const noReplyHarness = await createHarness();
        const noReplyOpen = await openReconcile(noReplyHarness.supervisor);
        const noReplyDispatch = await dispatch(noReplyHarness.supervisor, noReplyOpen.runId, [{ target: "reviewer-a", phase: "end", body: "no-reply" }]);
        const noReply = await waitRequest(noReplyHarness.supervisor, noReplyOpen.runId, noReplyDispatch.data.requests[0].requestId, (request) => request.error?.code === "NO_REPLY");

        const workerHarness = await createHarness();
        const workerOpen = await openReconcile(workerHarness.supervisor);
        const workerDispatch = await dispatch(workerHarness.supervisor, workerOpen.runId, [{ target: "reviewer-a", phase: "fail", body: "post-ack-exit" }]);
        const workerFailed = await waitRequest(workerHarness.supervisor, workerOpen.runId, workerDispatch.data.requests[0].requestId, (request) => request.error?.code === "WORKER_FAILED");

        const capacityHarness = await createHarness();
        const capacityOpen = await openRetrace(capacityHarness.supervisor, ["c1", "c2", "c3", "c4", "c5"]);
        await dispatch(capacityHarness.supervisor, capacityOpen.runId, ["c1", "c2", "c3", "c4"].map((target) => ({ target, phase: "scope", body: "silent" })));
        const capacity = await dispatch(capacityHarness.supervisor, capacityOpen.runId, [{ target: "c5", phase: "scope", body: "silent" }]);

        const refusalHarness = await createHarness({ clientFactory: (options) => new CleanupRefusalClient(options) });
        const refusalOpen = await openReconcile(refusalHarness.supervisor);
        await dispatch(refusalHarness.supervisor, refusalOpen.runId, [{ target: "reviewer-a", phase: "cleanup", body: "silent" }]);
        await refusalHarness.supervisor.call({ schema: CALL_SCHEMA, op: "dispose", runId: refusalOpen.runId, actorId: "reviewer-a", subtree: false }, ROOT);
        const disposalFailed = await refusalHarness.supervisor.call({ schema: CALL_SCHEMA, op: "dispose", runId: refusalOpen.runId, actorId: "reviewer-a", subtree: false }, ROOT);

        await harness.supervisor.call({ schema: CALL_SCHEMA, op: "close", runId: opened.runId }, ROOT);
        const runTerminal = await dispatch(harness.supervisor, opened.runId, [{ target: "reviewer-b", phase: "late", body: "x" }]);
        expect(new Set([
            invalid.error.code, unknown.error.code, profileFailure.error.code, unauthorized.error.code, busy.error.code,
            capacity.error.code, terminal.error.code, startFailed.data.requests[0].error.code,
            deliveryUnknown.data.requests[0].error.code, workerFailed.error.code, noReply.error.code,
            abortedView.data.requests[0].error.code,
            disposalFailed.error.code, runTerminal.error.code,
        ])).toEqual(new Set(["INVALID_INPUT", "UNKNOWN_DEFINITION", "PROFILE_UNAVAILABLE", "UNAUTHORIZED", "ACTOR_BUSY", "CAPACITY_REACHED", "ACTOR_TERMINAL", "START_FAILED", "DELIVERY_UNKNOWN", "WORKER_FAILED", "NO_REPLY", "ABORTED", "DISPOSAL_FAILED", "RUN_TERMINAL"]));
    });

    test("enforces owner visibility and direct capacity", async () => {
        const harness = await createHarness();
        const opened = await openRetrace(harness.supervisor, ["s1", "s2", "s3", "s4", "s5"]);
        await dispatch(harness.supervisor, opened.runId, ["s1", "s2", "s3", "s4"].map((target) => ({ target, phase: "scope", body: "silent" })));
        const refused = await dispatch(harness.supervisor, opened.runId, [{ target: "s5", phase: "scope", body: "silent" }]);
        expect(refused.error.code).toBe("CAPACITY_REACHED");
        const firstProcess = await actorProcess(harness, "s1");
        const ownerView = await observe(harness.supervisor, opened.runId);
        expect(ownerView.data.actors.find((actor) => actor.actorId === "s1").pid).toBe(firstProcess.pid);
        const disposed = await harness.supervisor.call({ schema: CALL_SCHEMA, op: "dispose", runId: opened.runId, actorId: "s1", subtree: true }, ROOT);
        expect(disposed.data.state).toBe("disposed");
        expect(processIsAlive(firstProcess.pid)).toBe(false);
        expect((await dispatch(harness.supervisor, opened.runId, [{ target: "s5", phase: "scope", body: "silent" }])).ok).toBe(true);

        const nestedHarness = await createHarness();
        const nestedOpen = await openRetrace(nestedHarness.supervisor, ["scope"]);
        await dispatch(nestedHarness.supervisor, nestedOpen.runId, [{ target: "scope", phase: "scope", body: "scope-children-hold" }]);
        await waitFor(async () => {
            const view = await observe(nestedHarness.supervisor, nestedOpen.runId);
            return view.data.requests.filter((request) => request.actorId.startsWith("scope/reviewer")).length === 2;
        }, "nested replies");
        const rootView = await observe(nestedHarness.supervisor, nestedOpen.runId);
        const nestedRequests = rootView.data.requests.filter((request) => request.actorId.startsWith("scope/reviewer"));
        expect(nestedRequests).toHaveLength(2);
        expect(nestedRequests.every((request) => request.reply === undefined)).toBe(true);
        const nestedActors = rootView.data.actors.filter((actor) => actor.actorId.startsWith("scope/reviewer"));
        expect(nestedActors.every((actor) => actor.owner === "redacted")).toBe(true);
        expect(nestedActors.every((actor) => !Object.hasOwn(actor, "pid"))).toBe(true);
        expect((await observe(nestedHarness.supervisor, nestedOpen.runId, [nestedRequests[0].requestId])).error.code).toBe("UNAUTHORIZED");
        expect((await nestedHarness.supervisor.call({ schema: CALL_SCHEMA, op: "dispose", runId: nestedOpen.runId, actorId: "scope/reviewer-a", subtree: false }, ROOT)).error.code).toBe("UNAUTHORIZED");
        const nestedDisposed = await nestedHarness.supervisor.call({
            schema: CALL_SCHEMA,
            op: "dispose",
            runId: nestedOpen.runId,
            actorId: "scope",
            subtree: true,
        }, ROOT);
        expect(nestedDisposed.data.state).toBe("disposed");
        expect(nestedDisposed.data.descendants.every((actor) => !Object.hasOwn(actor, "pid"))).toBe(true);
    });

    test("separates first reply from turn and observed process exit", async () => {
        for (const queueSuccessorBeforeReady of [true, false]) {
            const harness = await createHarness();
            const opened = await openReconcile(harness.supervisor);
            const body = "  byte-exact\nreply\u0000  ";
            const first = await dispatch(harness.supervisor, opened.runId, [{
                target: "reviewer-a",
                phase: "initial",
                body: `reply-stale-terminal:${body}`,
            }]);
            const firstId = first.data.requests[0].requestId;
            const replied = await waitRequest(harness.supervisor, opened.runId, firstId, (request) => request.state === "replied", "first reply");
            expect(replied).toMatchObject({ state: "replied", reply: { body }, turn: "running", reuse: "busy" });
            const firstProcess = await actorProcess(harness, "reviewer-a");

            let successor;
            if (queueSuccessorBeforeReady) {
                successor = await dispatch(harness.supervisor, opened.runId, [{
                    target: "reviewer-a",
                    phase: "rethink",
                    body: "reply:scope-result",
                }]);
                expect(successor.data.requests[0]).toMatchObject({ state: "pending" });
                expect((await harness.events()).filter((entry) => entry.event === "prompt")).toHaveLength(1);
            }

            await openFixtureBarrier(harness, "release-predecessor");
            await waitRequest(harness.supervisor, opened.runId, firstId, (request) => request.turn === "succeeded", "predecessor readiness");

            if (!queueSuccessorBeforeReady) {
                const readyView = await observe(harness.supervisor, opened.runId, [firstId]);
                expect(readyView.data.requests[0]).toMatchObject({
                    state: "replied",
                    reply: { body },
                    turn: "succeeded",
                    reuse: "ready",
                });
                successor = await dispatch(harness.supervisor, opened.runId, [{
                    target: "reviewer-a",
                    phase: "rethink",
                    body: "reply:scope-result",
                }]);
            }

            const successorId = successor.data.requests[0].requestId;
            await waitFor(
                async () => (await harness.events()).some(
                    (entry) => entry.event === "barrier-wait" && entry.name === "emit-predecessor-terminal"
                ),
                "successor dispatch barrier"
            );
            const queued = await dispatch(harness.supervisor, opened.runId, [{
                target: "reviewer-a",
                phase: "after-rethink",
                body: "silent",
            }]);
            const queuedId = queued.data.requests[0].requestId;
            const wakeBaseline = harness.notifications.length;

            await openFixtureBarrier(harness, "emit-predecessor-terminal");
            await waitFor(
                async () => (await harness.events()).some(
                    (entry) => entry.event === "host-result" && entry.kind === "predecessor-terminal-barrier"
                ),
                "predecessor terminal processing"
            );

            const staleEndView = await observe(harness.supervisor, opened.runId);
            expect(staleEndView.data.requests.find((request) => request.requestId === firstId)).toMatchObject({
                state: "replied",
                reply: { body },
                turn: "succeeded",
                reuse: "ready",
            });
            expect(staleEndView.data.requests.find((request) => request.requestId === successorId)).toMatchObject({
                state: "pending",
                turn: "running",
                reuse: "busy",
            });
            expect(staleEndView.data.requests.find((request) => request.requestId === queuedId)).toMatchObject({
                state: "pending",
                turn: "running",
                reuse: "busy",
            });
            expect(staleEndView.data.actors.find((actor) => actor.actorId === "reviewer-a")).toMatchObject({
                state: "running",
                turn: "running",
                reuse: "busy",
                pid: firstProcess.pid,
            });
            expect(harness.notifications).toHaveLength(wakeBaseline);
            expect((await harness.events()).filter((entry) => entry.event === "prompt")).toHaveLength(2);
            expect(processIsAlive(firstProcess.pid)).toBe(true);

            await openFixtureBarrier(harness, "start-successor");
            const completedSuccessor = await waitRequest(
                harness.supervisor,
                opened.runId,
                successorId,
                (request) => request.turn === "succeeded",
                "successor completion"
            );
            expect(completedSuccessor).toMatchObject({
                state: "replied",
                reply: { body: "scope-result" },
                turn: "succeeded",
                reuse: "ready",
            });
            await waitFor(
                async () => (await harness.events()).filter((entry) => entry.event === "prompt").length === 3,
                "queued delivery after successor completion"
            );

            const completedView = await observe(harness.supervisor, opened.runId);
            expect(completedView.data.requests.find((request) => request.requestId === firstId)).toMatchObject({
                state: "replied",
                reply: { body },
                turn: "succeeded",
                reuse: "ready",
            });
            expect(completedView.data.actors.find((actor) => actor.actorId === "reviewer-a").pid).toBe(firstProcess.pid);
            expect(processIsAlive(firstProcess.pid)).toBe(true);

            const recordedEvents = await harness.events();
            const successorPromptIndex = recordedEvents.findIndex(
                (entry) => entry.event === "prompt" && entry.requestId === successorId
            );
            const predecessorEnd = recordedEvents.find((entry) => entry.event === "predecessor-terminal");
            const predecessorEndIndex = recordedEvents.indexOf(predecessorEnd);
            const successorStartIndex = recordedEvents.findIndex(
                (entry, index) => index > predecessorEndIndex && entry.event === "session-event" && entry.frame.type === "agent_start"
            );
            expect(predecessorEnd.requestId).toBe(firstId);
            expect(successorPromptIndex).toBeGreaterThan(-1);
            expect(predecessorEndIndex).toBeGreaterThan(successorPromptIndex);
            expect(successorStartIndex).toBeGreaterThan(predecessorEndIndex);

            await harness.supervisor.call({ schema: CALL_SCHEMA, op: "abort", runId: opened.runId, requestId: queuedId }, ROOT);
            expect(processIsAlive(firstProcess.pid)).toBe(false);
        }

        const preReplyHarness = await createHarness();
        const preReplyOpen = await openReconcile(preReplyHarness.supervisor);
        const preReplyDispatch = await dispatch(preReplyHarness.supervisor, preReplyOpen.runId, [{
            target: "reviewer-a",
            phase: "initial",
            body: "pre-reply-events",
        }]);
        const preReplyId = preReplyDispatch.data.requests[0].requestId;
        await waitFor(
            async () => (await preReplyHarness.events()).some(
                (entry) => entry.event === "host-result" && entry.kind === "event-barrier"
            ),
            "pre-reply event processing"
        );
        const preReply = await observe(preReplyHarness.supervisor, preReplyOpen.runId, [preReplyId]);
        expect(preReply.data.requests[0]).toMatchObject({ state: "pending", turn: "running", reuse: "busy" });

        const duplicateHarness = await createHarness();
        const duplicateOpen = await openReconcile(duplicateHarness.supervisor);
        const duplicateDispatch = await dispatch(duplicateHarness.supervisor, duplicateOpen.runId, [{ target: "reviewer-a", phase: "initial", body: "reply-duplicate:first" }]);
        const duplicateView = await waitRequest(duplicateHarness.supervisor, duplicateOpen.runId, duplicateDispatch.data.requests[0].requestId, (request) => request.turn === "succeeded", "duplicate rejection");
        expect(duplicateView.reply.body).toBe("first");
        await waitFor(async () => (await duplicateHarness.events()).some((entry) => entry.kind === "duplicate"), "duplicate result");

        const startupHarness = await createHarness({ behaviors: ["start-exit"] });
        const startupOpen = await openReconcile(startupHarness.supervisor);
        const startup = await dispatch(startupHarness.supervisor, startupOpen.runId, [{ target: "reviewer-a", phase: "startup", body: "x" }]);
        expect(startup.data.requests[0]).toMatchObject({ state: "start-failed", error: { code: "START_FAILED" } });
        expect((await startupHarness.events()).filter((entry) => entry.event === "start")).toHaveLength(1);

        const postAckHarness = await createHarness();
        const postAckOpen = await openReconcile(postAckHarness.supervisor);
        const postAckDispatch = await dispatch(postAckHarness.supervisor, postAckOpen.runId, [{ target: "reviewer-a", phase: "exit", body: "post-ack-exit" }]);
        const postAck = await waitRequest(postAckHarness.supervisor, postAckOpen.runId, postAckDispatch.data.requests[0].requestId, (request) => request.error?.code === "WORKER_FAILED", "post-ack exit");
        expect(postAck).toMatchObject({ state: "failed", turn: "failed", reuse: "terminal" });
        const preAckHarness = await createHarness();
        const preAckOpen = await openReconcile(preAckHarness.supervisor);
        const preAckDispatch = await dispatch(preAckHarness.supervisor, preAckOpen.runId, [{ target: "reviewer-a", phase: "exit", body: "pre-ack-exit" }]);
        const preAck = await waitRequest(preAckHarness.supervisor, preAckOpen.runId, preAckDispatch.data.requests[0].requestId, (request) => request.error?.code === "WORKER_FAILED", "pre-ack exit");
        expect(preAck).toMatchObject({ state: "failed", turn: "failed", reuse: "terminal" });


        const replyExitHarness = await createHarness();
        const replyExitOpen = await openReconcile(replyExitHarness.supervisor);
        const replyExitDispatch = await dispatch(replyExitHarness.supervisor, replyExitOpen.runId, [{ target: "reviewer-a", phase: "exit", body: "reply-exit:kept" }]);
        const replyExit = await waitRequest(replyExitHarness.supervisor, replyExitOpen.runId, replyExitDispatch.data.requests[0].requestId, (request) => request.turn === "failed", "reply then exit");
        expect(replyExit).toMatchObject({ state: "replied", reply: { body: "kept" }, turn: "failed", reuse: "terminal" });

        const reservedHarness = await createHarness();
        const reservedOpen = await openReconcile(reservedHarness.supervisor);
        const current = await dispatch(reservedHarness.supervisor, reservedOpen.runId, [{ target: "reviewer-a", phase: "initial", body: "reply-exit-delay:kept-current" }]);
        await waitRequest(reservedHarness.supervisor, reservedOpen.runId, current.data.requests[0].requestId, (request) => request.state === "replied");
        const notificationBaseline = reservedHarness.notifications.length;
        const reserved = await dispatch(reservedHarness.supervisor, reservedOpen.runId, [{ target: "reviewer-a", phase: "rethink", body: "must-not-deliver" }]);
        const reservedId = reserved.data.requests[0].requestId;
        const reservedFailure = await waitRequest(reservedHarness.supervisor, reservedOpen.runId, reservedId, (request) => request.error?.code === "ACTOR_TERMINAL", "reserved successor exit");
        expect(reservedFailure).toMatchObject({ state: "failed", turn: "failed", reuse: "terminal" });
        expect((await reservedHarness.events()).filter((entry) => entry.event === "prompt")).toHaveLength(1);
        const terminalWakes = reservedHarness.notifications.slice(notificationBaseline).filter((entry) => entry.details.kind === "state");
        expect(terminalWakes.filter((entry) => entry.message.includes(reservedId))).toHaveLength(1);

        const noReplyHarness = await createHarness();
        const noReplyOpen = await openReconcile(noReplyHarness.supervisor);
        const noReplyDispatch = await dispatch(noReplyHarness.supervisor, noReplyOpen.runId, [{ target: "reviewer-a", phase: "end", body: "no-reply" }]);
        const noReply = await waitRequest(noReplyHarness.supervisor, noReplyOpen.runId, noReplyDispatch.data.requests[0].requestId, (request) => request.error?.code === "NO_REPLY");
        expect(noReply.reply).toBeUndefined();

        const abortHarness = await createHarness();
        const abortOpen = await openReconcile(abortHarness.supervisor);
        const abortDispatch = await dispatch(abortHarness.supervisor, abortOpen.runId, [{ target: "reviewer-a", phase: "abort", body: "silent" }]);
        const abortProcess = await actorProcess(abortHarness, "reviewer-a");
        await abortHarness.supervisor.call({ schema: CALL_SCHEMA, op: "abort", runId: abortOpen.runId, requestId: abortDispatch.data.requests[0].requestId }, ROOT);
        expect(processIsAlive(abortProcess.pid)).toBe(false);
        expect((await abortHarness.events()).filter((entry) => entry.event === "start")).toHaveLength(1);
    });

    test("retains successful siblings across partial dispatch failure", async () => {
        const harness = await createHarness({ behaviors: ["normal", "start-exit", "normal"] });
        const opened = await openRetrace(harness.supervisor, ["ok", "start-fail", "delivery-unknown"]);
        const result = await dispatch(harness.supervisor, opened.runId, [
            { target: "ok", phase: "scope", body: "reply:successful sibling" },
            { target: "start-fail", phase: "scope", body: "bad-start" },
            { target: "delivery-unknown", phase: "scope", body: "delivery-unknown" },
        ]);
        expect(result.data.requests.map((request) => request.state)).toEqual(["pending", "start-failed", "delivery-unknown"]);
        const ok = await waitRequest(harness.supervisor, opened.runId, result.data.requests[0].requestId, (request) => request.reply?.body === "successful sibling");
        expect(ok.reply.body).toBe("successful sibling");
        const events = await harness.events();
        const starts = events.filter((entry) => entry.event === "start");
        expect(starts).toHaveLength(3);
        const originalPids = new Set(starts.map((entry) => entry.pid));
        expect(originalPids.size).toBe(3);
        expect((await dispatch(harness.supervisor, opened.runId, [{ target: "delivery-unknown", phase: "again", body: "must-not-send" }])).error.code).toBe("ACTOR_BUSY");
        expect(new Set((await harness.events()).filter((entry) => entry.event === "start").map((entry) => entry.pid))).toEqual(originalPids);
        const frontiers = await observe(harness.supervisor, opened.runId);
        expect(frontiers.data.requests.map((request) => request.requestId)).toEqual(result.data.requests.map((request) => request.requestId));
    });

    test("keeps silent work pending until explicit abort", async () => {
        const harness = await createHarness();
        const opened = await openRetrace(harness.supervisor, ["silent-scope"]);
        const dispatched = await dispatch(harness.supervisor, opened.runId, [{ target: "silent-scope", phase: "scope", body: "silent" }]);
        const requestId = dispatched.data.requests[0].requestId;
        const worker = await actorProcess(harness, "silent-scope");
        harness.tick();
        harness.tick();
        const periodic = harness.notifications.filter((entry) => entry.details.kind === "periodic");
        expect(periodic).toHaveLength(2);
        for (const notification of periodic) {
            expect(notification.message).toContain(`${opened.runId}/${requestId}:pending`);
            expect(notification.message).toContain("observation only");
            expect(notification.message).not.toContain("silent-scope");
        }
        expect((await observe(harness.supervisor, opened.runId, [requestId])).data.requests[0]).toMatchObject({ state: "pending", turn: "running", reuse: "busy" });
        const aborted = await harness.supervisor.call({ schema: CALL_SCHEMA, op: "abort", runId: opened.runId, requestId }, ROOT);
        expect(aborted.data).toEqual({ target: requestId, state: "aborted" });
        expect(processIsAlive(worker.pid)).toBe(false);
        expect((await harness.events()).filter((entry) => entry.event === "start")).toHaveLength(1);
        expect((await observe(harness.supervisor, opened.runId, [requestId])).data.requests[0]).toMatchObject({ state: "aborted", turn: "aborted", reuse: "terminal" });
    });

    test("disposes observed stock processes before parent replies", async () => {
        const harness = await createHarness();
        const opened = await openRetrace(harness.supervisor, ["scope", "sibling"]);
        const result = await dispatch(harness.supervisor, opened.runId, [
            { target: "scope", phase: "scope", body: "scope-flow" },
            { target: "sibling", phase: "scope", body: "silent" },
        ]);
        const scopeRequestId = result.data.requests[0].requestId;
        const scopeReply = await waitRequest(harness.supervisor, opened.runId, scopeRequestId, (request) => request.reply?.body === "scope-result", "scope result");
        expect(scopeReply.reply.body).toBe("scope-result");
        const reviewerA = await actorProcess(harness, "scope/reviewer-a");
        const reviewerB = await actorProcess(harness, "scope/reviewer-b");
        expect(processIsAlive(reviewerA.pid)).toBe(false);
        expect(processIsAlive(reviewerB.pid)).toBe(false);
        const sibling = await actorProcess(harness, "sibling");
        const scope = await actorProcess(harness, "scope");
        const disposed = await harness.supervisor.call({ schema: CALL_SCHEMA, op: "dispose", runId: opened.runId, actorId: "scope", subtree: true }, ROOT);
        expect(disposed.data.state).toBe("disposed");
        expect(processIsAlive(scope.pid)).toBe(false);
        expect(processIsAlive(sibling.pid)).toBe(true);
        expect((await observe(harness.supervisor, opened.runId)).data.requests.every((request) => request.actorId === "sibling")).toBe(true);

        const raceHarness = await createHarness();
        const raceOpen = await openReconcile(raceHarness.supervisor);
        const raceDispatch = await dispatch(raceHarness.supervisor, raceOpen.runId, [{ target: "reviewer-a", phase: "race", body: "silent" }]);
        const raceProcess = await actorProcess(raceHarness, "reviewer-a");
        const [abortResult, closeResult] = await Promise.all([
            raceHarness.supervisor.call({ schema: CALL_SCHEMA, op: "abort", runId: raceOpen.runId, requestId: raceDispatch.data.requests[0].requestId }, ROOT),
            raceHarness.supervisor.call({ schema: CALL_SCHEMA, op: "close", runId: raceOpen.runId }, ROOT),
        ]);
        expect([abortResult.ok, closeResult.ok]).toEqual([true, true]);
        expect(processIsAlive(raceProcess.pid)).toBe(false);
        expect((await raceHarness.supervisor.call({ schema: CALL_SCHEMA, op: "close", runId: raceOpen.runId }, ROOT)).error.code).toBe("RUN_TERMINAL");

        const refusalHarness = await createHarness({ clientFactory: (options) => new CleanupRefusalClient(options) });
        const refusalOpen = await openRetrace(refusalHarness.supervisor, ["blocked", "next-1", "next-2", "next-3", "next-4"]);
        await dispatch(refusalHarness.supervisor, refusalOpen.runId, [{ target: "blocked", phase: "scope", body: "silent" }]);
        const closed = await refusalHarness.supervisor.call({ schema: CALL_SCHEMA, op: "close", runId: refusalOpen.runId }, ROOT);
        expect(closed.data.state).toBe("failed-cleanup");
        expect(closed.data.unresolvedActors).toEqual([expect.objectContaining({ actorId: "blocked", pid: 424_242 })]);
        expect((await observe(refusalHarness.supervisor, refusalOpen.runId)).data.actors.find((actor) => actor.actorId === "blocked").state).toBe("failed-cleanup");
    });

    test("uses stock RpcClient framing against the deterministic worker", async () => {
        const harness = await createHarness();
        const opened = await openReconcile(harness.supervisor);
        const dispatched = await dispatch(harness.supervisor, opened.runId, [{ target: "reviewer-a", phase: "framing", body: "large-reply-size:1100000" }]);
        const reply = await waitRequest(harness.supervisor, opened.runId, dispatched.data.requests[0].requestId, (request) => request.state === "replied", "chunked stock reply");
        expect(reply.reply.body).toBe("x".repeat(1_100_000));
        const processRecord = await actorProcess(harness, "reviewer-a");
        const closed = await harness.supervisor.call({ schema: CALL_SCHEMA, op: "close", runId: opened.runId }, ROOT);
        expect(closed.data.state).toBe("closed");
        expect(processIsAlive(processRecord.pid)).toBe(false);
    });
});
