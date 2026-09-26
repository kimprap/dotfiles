import { RpcClient, defineRpcClientTool } from "@oh-my-pi/pi-coding-agent/modes/rpc/rpc-client";
import { ptree } from "@oh-my-pi/pi-utils";
import { compileConsumer, resolveProfiles } from "./lifecycle-consumers.js";

const CALL_SCHEMA = "omp-lifecycle-call/v1";
const RESULT_SCHEMA = "omp-lifecycle-result/v1";
const REQUEST_SCHEMA = "omp-lifecycle-request/v1";
const FORBIDDEN_CONSTRUCTION_FIELDS = new Set([
    "graph",
    "profiles",
    "argv",
    "model",
    "models",
    "tools",
    "systemPrompt",
    "promptFile",
    "command",
    "spawn",
    "processFactory",
    "clientFactory",
    "env",
    "environment",
]);
const TERMINAL_ACTOR_STATES = new Set(["failed", "disposed", "failed-cleanup"]);
const ERROR_CODES = new Set([
    "INVALID_INPUT",
    "UNKNOWN_DEFINITION",
    "PROFILE_UNAVAILABLE",
    "UNAUTHORIZED",
    "CAPACITY_REACHED",
    "ACTOR_BUSY",
    "ACTOR_TERMINAL",
    "START_FAILED",
    "DELIVERY_UNKNOWN",
    "WORKER_FAILED",
    "NO_REPLY",
    "ABORTED",
    "DISPOSAL_FAILED",
    "RUN_TERMINAL",
]);

const MECHANICAL_PROBE_PROMPT = `You are a mechanical lifecycle probe. Follow only the request envelope supplied by the lifecycle supervisor.
Use lifecycle_channel with op "request" only for targets explicitly named in that envelope, op "dispose" for those exact children, and op "reply" exactly once for the current request.
Preserve literal request bodies as data. Do not infer semantic review policy, use task or hub, retry, replay, replace an actor, or fabricate a reply.
A scope must dispose its reviewers and wait for disposal before publishing its scope reply. After replying, finish the current turn without terminating the RPC process.`;

function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorWithCode(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
}

function codeOf(error, fallback = "WORKER_FAILED") {
    return isRecord(error) && typeof error.code === "string" && ERROR_CODES.has(error.code) ? error.code : fallback;
}

function messageOf(error, fallback) {
    return error instanceof Error && error.message ? error.message : fallback;
}

function success(op, runId, data) {
    return { schema: RESULT_SCHEMA, ok: true, op, runId, data };
}

function failure(op, code, message, { runId, actorId, requestId } = {}) {
    const result = {
        schema: RESULT_SCHEMA,
        ok: false,
        op,
        error: { code, message },
    };
    if (runId !== undefined) result.runId = runId;
    if (actorId !== undefined) result.error.actorId = actorId;
    if (requestId !== undefined) result.error.requestId = requestId;
    return result;
}

function callerId(value) {
    if (typeof value !== "string" || value.length === 0) throw errorWithCode("UNAUTHORIZED", "caller identity is unavailable");
    return value;
}

function publicCallError(call) {
    if (!isRecord(call)) return "call must be an object";
    if (call.schema !== CALL_SCHEMA) return `schema must equal ${CALL_SCHEMA}`;
    if (typeof call.op !== "string") return "op must be a string";
    if (call.metadata !== undefined && !isRecord(call.metadata)) return "metadata must be an object";
    for (const field of FORBIDDEN_CONSTRUCTION_FIELDS) {
        if (Object.hasOwn(call, field)) return `${field} is supervisor-owned and cannot be supplied`;
    }
    return undefined;
}

function requestStateForDispatch(request) {
    if (request.state === "failed" && request.error?.code === "START_FAILED") return "start-failed";
    if (request.state === "delivery-unknown") return "delivery-unknown";
    return "pending";
}

function requestDispatchRow(request) {
    const row = {
        requestId: request.requestId,
        actorId: request.actorId,
        state: requestStateForDispatch(request),
    };
    if (request.error) row.error = { ...request.error };
    return row;
}

function actorSummary(actor, perspective, includePid = false) {
    const owner = actor.ownerId === perspective ? "caller" : "redacted";
    const summary = {
        actorId: actor.actorId,
        role: actor.role,
        owner,
        state: actor.state,
        turn: actor.turn,
        reuse: actor.reuse,
        direct: actor.direct,
    };
    if (actor.parentActorId !== undefined) summary.parentActorId = actor.parentActorId;
    if (Number.isInteger(actor.pid) && (includePid || owner === "caller")) summary.pid = actor.pid;
    return summary;
}

function requestView(request, perspective) {
    const view = {
        requestId: request.requestId,
        actorId: request.actorId,
        phase: request.phase,
        state: request.state,
        turn: request.turn,
        reuse: request.reuse,
    };
    if (request.error) view.error = { ...request.error };
    if (request.ownerId === perspective && request.reply) view.reply = { ...request.reply };
    return view;
}

function runSummary(run) {
    const directActors = [...run.actors.values()].filter((actor) => actor.direct);
    return {
        runId: run.runId,
        definition: run.definition,
        state: run.state,
        directCapacity: {
            limit: run.maxDirectActors,
            used: directActors.filter((actor) => actor.state !== "declared" && actor.state !== "disposed").length,
        },
    };
}

function descendants(run, actorId) {
    const result = [];
    const visit = (parentId) => {
        for (const actor of run.actors.values()) {
            if (actor.parentActorId !== parentId) continue;
            visit(actor.actorId);
            result.push(actor);
        }
    };
    visit(actorId);
    return result;
}

function lifecycleToolParameters() {
    return {
        type: "object",
        properties: {
            op: { enum: ["request", "reply", "dispose"] },
            calls: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        target: { type: "string" },
                        phase: { type: "string" },
                        body: { type: "string" },
                    },
                    required: ["target", "phase", "body"],
                    additionalProperties: false,
                },
            },
            body: { type: "string" },
            actorId: { type: "string" },
            subtree: { type: "boolean" },
        },
        required: ["op"],
        additionalProperties: false,
    };
}

function defaultClientFactory(options) {
    return new RpcClient(options);
}

export class LifecycleSupervisor {
    #cwd;
    #env;
    #models;
    #discover;
    #clientFactory;
    #notify;
    #setInterval;
    #clearTimer;
    #wakeIntervalMs;
    #proofOnly;
    #runs = new Map();
    #runSequence = 0;
    #requestSequence = 0;
    #wakeTimer;
    #waiters = new Map();

    constructor({
        cwd,
        env = {},
        models,
        discover,
        clientFactory = defaultClientFactory,
        notify = () => {},
        setInterval: scheduleInterval = globalThis.setInterval,
        clearTimer = globalThis.clearInterval,
        wakeIntervalMs = 300_000,
        proofOnly = false,
    }) {
        this.#cwd = cwd;
        this.#env = env;
        this.#models = models;
        this.#discover = discover;
        this.#clientFactory = clientFactory;
        this.#notify = notify;
        this.#setInterval = scheduleInterval;
        this.#clearTimer = clearTimer;
        this.#wakeIntervalMs = wakeIntervalMs;
        this.#proofOnly = proofOnly;
    }

    get runCount() {
        return this.#runs.size;
    }

    listRuns(caller) {
        const owner = callerId(caller);
        return [...this.#runs.values()].filter((run) => run.rootOwner === owner).map(runSummary);
    }
    async status(caller, runId = undefined) {
        const owner = callerId(caller);
        const runs = [...this.#runs.values()].filter((run) => run.rootOwner === owner);
        const selected = runId === undefined ? runs : runs.filter((run) => run.runId === runId);
        if (runId !== undefined && selected.length === 0) {
            return failure("observe", "INVALID_INPUT", `unknown run: ${runId}`, { runId });
        }
        const observations = [];
        for (const run of selected) {
            const result = await this.call({ schema: CALL_SCHEMA, op: "observe", runId: run.runId }, owner);
            if (!result.ok) return result;
            observations.push(result.data);
        }
        return observations;
    }

    async call(call, caller) {
        const inputError = publicCallError(call);
        const op = isRecord(call) && typeof call.op === "string" ? call.op : "open";
        if (inputError) return failure(op, "INVALID_INPUT", inputError);
        let owner;
        try {
            owner = callerId(caller);
        } catch (error) {
            return failure(op, codeOf(error, "UNAUTHORIZED"), messageOf(error, "caller identity is unavailable"));
        }
        try {
            switch (call.op) {
                case "open":
                    return await this.#open(call, owner);
                case "dispatch":
                    return await this.#dispatch(call, owner);
                case "observe":
                    return this.#observe(call, owner);
                case "dispose":
                    return await this.#disposeCall(call, owner);
                case "abort":
                    return await this.#abortCall(call, owner);
                case "close":
                    return await this.#closeCall(call, owner);
                default:
                    return failure(call.op, "INVALID_INPUT", "op must be open, dispatch, observe, dispose, abort, or close");
            }
        } catch (error) {
            return failure(call.op, codeOf(error), messageOf(error, "lifecycle operation failed"), {
                runId: typeof call.runId === "string" ? call.runId : undefined,
                actorId: typeof error?.actorId === "string" ? error.actorId : undefined,
                requestId: typeof error?.requestId === "string" ? error.requestId : undefined,
            });
        }
    }

    async #open(call, owner) {
        if (typeof call.definition !== "string" || !Object.hasOwn(call, "binding")) {
            return failure("open", "INVALID_INPUT", "open requires definition and binding");
        }
        let topology;
        let profiles;
        try {
            topology = compileConsumer(call.definition, call.binding);
            profiles = await resolveProfiles(topology, {
                cwd: this.#cwd,
                models: this.#models,
                discover: this.#discover,
            });
        } catch (error) {
            return failure("open", codeOf(error, "INVALID_INPUT"), messageOf(error, "consumer construction failed"));
        }

        const runId = `run-${++this.#runSequence}`;
        const actors = new Map();
        for (const definition of topology.actors) {
            const ownerId = definition.owner === "root" ? owner : definition.owner;
            actors.set(definition.actorId, {
                ...definition,
                ownerId,
                state: "declared",
                turn: "unknown",
                reuse: "ready",
                client: undefined,
                pid: null,
                currentRequestId: undefined,
                queuedRequestId: undefined,
                generation: undefined,
                generationSequence: 0,
            });
        }
        const run = {
            runId,
            definition: topology.definition,
            binding: topology.binding,
            maxDirectActors: topology.maxDirectActors,
            rootOwner: owner,
            state: "open",
            actors,
            profiles,
            requests: new Map(),
        };
        this.#runs.set(runId, run);
        return success("open", runId, {
            state: "open",
            actors: [...actors.values()].filter((actor) => actor.ownerId === owner).map((actor) => actorSummary(actor, owner)),
        });
    }

    #ownedRun(op, runId, owner, allowTerminal = false) {
        if (typeof runId !== "string" || runId.length === 0) throw errorWithCode("INVALID_INPUT", `${op} requires runId`);
        const run = this.#runs.get(runId);
        if (!run) throw errorWithCode("INVALID_INPUT", `unknown run: ${runId}`);
        if (run.rootOwner !== owner && ![...run.actors.values()].some((actor) => `actor:${actor.actorId}` === owner)) {
            throw errorWithCode("UNAUTHORIZED", "caller does not own this run");
        }
        if (!allowTerminal && (run.state === "closed" || run.state === "failed-cleanup" || run.state === "closing")) {
            throw errorWithCode("RUN_TERMINAL", `run is ${run.state}`);
        }
        return run;
    }

    #validateCalls(run, calls, owner) {
        if (!Array.isArray(calls) || calls.length === 0) throw errorWithCode("INVALID_INPUT", "dispatch calls must be non-empty");
        const targets = new Set();
        const prepared = calls.map((call, index) => {
            if (!isRecord(call) || typeof call.target !== "string" || typeof call.phase !== "string" || call.phase.length === 0 || typeof call.body !== "string") {
                throw errorWithCode("INVALID_INPUT", `dispatch calls[${index}] is invalid`);
            }
            if (targets.has(call.target)) throw errorWithCode("ACTOR_BUSY", `batch contains more than one call for ${call.target}`);
            targets.add(call.target);
            const actor = run.actors.get(call.target);
            if (!actor) throw errorWithCode("INVALID_INPUT", `unknown target: ${call.target}`);
            if (actor.ownerId !== owner) throw errorWithCode("UNAUTHORIZED", `caller does not own target: ${call.target}`);
            if (TERMINAL_ACTOR_STATES.has(actor.state) || actor.state === "disposing") {
                const error = errorWithCode("ACTOR_TERMINAL", `actor is ${actor.state}: ${call.target}`);
                error.actorId = call.target;
                throw error;
            }
            if (actor.currentRequestId) {
                const current = run.requests.get(actor.currentRequestId);
                if (current?.state === "delivery-unknown") {
                    const error = errorWithCode(
                        "ACTOR_BUSY",
                        `actor has an unresolved delivery-unknown request: ${call.target}`
                    );
                    error.actorId = call.target;
                    throw error;
                }
            }
            if (actor.currentRequestId && actor.queuedRequestId) {
                const error = errorWithCode("ACTOR_BUSY", `actor already has a delivered turn and reserved successor: ${call.target}`);
                error.actorId = call.target;
                throw error;
            }
            return { actor, phase: call.phase, body: call.body };
        });

        const directUsed = [...run.actors.values()].filter(
            (actor) => actor.direct && actor.state !== "declared" && actor.state !== "disposed"
        ).length;
        const newlyReserved = prepared.filter(({ actor }) => actor.direct && actor.state === "declared").length;
        if (directUsed + newlyReserved > run.maxDirectActors) {
            throw errorWithCode("CAPACITY_REACHED", `direct actor capacity ${run.maxDirectActors} is exhausted`);
        }
        return prepared;
    }

    async #dispatch(call, owner) {
        const run = this.#ownedRun("dispatch", call.runId, owner);
        const prepared = this.#validateCalls(run, call.calls, owner);
        const requests = prepared.map(({ actor, phase, body }) => {
            const request = {
                requestId: `request-${++this.#requestSequence}`,
                actorId: actor.actorId,
                ownerId: owner,
                phase,
                body,
                state: "pending",
                turn: "running",
                reuse: "busy",
                reply: undefined,
                error: undefined,
            };
            run.requests.set(request.requestId, request);
            if (actor.currentRequestId) {
                actor.queuedRequestId = request.requestId;
            } else {
                actor.currentRequestId = request.requestId;
                actor.turn = "running";
                actor.reuse = "busy";
                if (actor.state === "declared") actor.state = "starting";
            }
            return request;
        });
        run.state = "active";

        await Promise.all(requests.map(async (request) => {
            const actor = run.actors.get(request.actorId);
            if (actor.currentRequestId !== request.requestId) return;
            if (actor.state === "starting") await this.#startAndDeliver(run, actor, request);
            else await this.#deliver(run, actor, request);
        }));
        this.#refreshWakeTimer();
        return success("dispatch", run.runId, { requests: requests.map(requestDispatchRow) });
    }

    #makeChannelTool(run, actor) {
        return defineRpcClientTool({
            name: "lifecycle_channel",
            label: "Lifecycle channel",
            description: "Connection-bound lifecycle request, reply, and owned-child disposal.",
            parameters: lifecycleToolParameters(),
            hidden: false,
            loadMode: "essential",
            execute: async (params, context) => {
                const result = await this.#channelCall(run, actor, params, context.signal);
                return { content: [{ type: "text", text: JSON.stringify(result) }], details: result };
            },
        });
    }

    #clientOptions(run, actor, generation) {
        const profile = run.profiles.get(actor.profile);
        const systemPrompt = this.#proofOnly ? MECHANICAL_PROBE_PROMPT : profile.systemPrompt;
        return {
            spawn: (agentArgs) => {
                const child = ptree.spawn(["omp", ...agentArgs], {
                    cwd: this.#cwd,
                    env: { ...Bun.env, ...this.#env },
                    stdin: "pipe",
                });
                generation.pid = child.pid;
                generation.exited = child.exited;
                actor.pid = child.pid;
                void child.exited.then(
                    (exitCode) => this.#observeProcessExit(run, actor, generation, { exitCode }),
                    (error) => this.#observeProcessExit(run, actor, generation, { error })
                );
                return child;
            },
            cwd: this.#cwd,
            provider: profile.provider,
            model: profile.model,
            args: [
                "--no-session",
                "--no-extensions",
                "--no-lsp",
                "--tools",
                profile.tools.join(","),
                "--system-prompt",
                systemPrompt,
                ...profile.readOverlayArgs,
            ],
            customTools: [this.#makeChannelTool(run, actor)],
            terminationGraceMs: 1_000,
        };
    }

    #createGeneration(actor) {
        const generation = {
            id: ++actor.generationSequence,
            pid: null,
            exited: undefined,
            exitIntent: undefined,
            exitObserved: false,
            settled: false,
            turnSequence: 0,
            activeTurn: undefined,
            startedRequestId: undefined,
            outcome: undefined,
        };
        actor.generation = generation;
        return generation;
    }

    #observeProcessExit(run, actor, generation, outcome) {
        if (actor.generation !== generation || generation.exitObserved) return;
        generation.exitObserved = true;
        generation.outcome = outcome;
        if (generation.exitIntent || generation.settled) return;
        const detail = outcome.error
            ? messageOf(outcome.error, "worker process exited")
            : `worker process exited with code ${outcome.exitCode}`;
        if (actor.state === "starting") {
            generation.settled = true;
            const request = actor.currentRequestId ? run.requests.get(actor.currentRequestId) : undefined;
            this.#settleStartFailure(run, actor, request, detail);
            return;
        }
        this.#onActorFailure(run, actor, errorWithCode("WORKER_FAILED", detail), generation);
    }

    #settleStartFailure(run, actor, request, message) {
        if (actor.state === "failed" && actor.turn === "failed") return;
        actor.state = "failed";
        actor.turn = "failed";
        actor.reuse = "terminal";
        if (request) {
            request.state = "failed";
            request.turn = "failed";
            request.reuse = "terminal";
            request.error = { code: "START_FAILED", message };
            this.#signalRequest(request);
            this.#emitStateWake(run, request);
        }
        this.#settleQueuedAfterTerminal(run, actor, "ACTOR_TERMINAL", "actor failed before successor delivery");
        this.#refreshWakeTimer();
    }

    async #awaitGenerationExit(actor, generation) {
        if (!generation?.exited) return;
        try {
            await generation.exited;
        } catch {
            // A killed ptree child rejects its normalized exit promise. The
            // rejection itself is the required observation that it exited.
        }
        if (actor.generation === generation) generation.exitObserved = true;
    }

    async #startAndDeliver(run, actor, request) {
        let client;
        const generation = this.#createGeneration(actor);
        try {
            client = this.#clientFactory(this.#clientOptions(run, actor, generation), { run, actor });
            if (!client || typeof client.start !== "function" || typeof client.prompt !== "function" || typeof client.stop !== "function") {
                throw new Error("RPC client factory returned an invalid client");
            }
            actor.client = client;
            client.onEvent?.((event) => this.#onActorEvent(run, actor, event, generation));
            client.onSessionEvent?.((event) => this.#onSessionEvent(run, actor, event, generation));
            client.onFailure?.((error) => this.#onActorFailure(run, actor, error, generation));
            if (actor.pid === null && Number.isInteger(client.pid)) {
                generation.pid = client.pid;
                actor.pid = client.pid;
            }
            await client.start();
            await client.setAutoRetry(false);
            actor.state = "idle";
        } catch (error) {
            generation.settled = true;
            generation.exitIntent ??= "start-failure";
            this.#settleStartFailure(run, actor, request, messageOf(error, "worker start failed"));
            await client?.stop?.().catch(() => {});
            await this.#awaitGenerationExit(actor, generation);
            return;
        }
        await this.#deliver(run, actor, request);
    }

    async #deliver(run, actor, request) {
        if (TERMINAL_ACTOR_STATES.has(actor.state)) {
            request.state = "failed";
            request.turn = "failed";
            request.reuse = "terminal";
            request.error = { code: "ACTOR_TERMINAL", message: `actor is ${actor.state}` };
            this.#signalRequest(request);
            return;
        }
        actor.state = "running";
        actor.turn = "running";
        actor.reuse = "busy";
        request.turn = "running";
        request.reuse = "busy";
        const generation = actor.generation;
        const envelope = JSON.stringify({
            schema: REQUEST_SCHEMA,
            runId: run.runId,
            requestId: request.requestId,
            actorId: actor.actorId,
            phase: request.phase,
            body: request.body,
            requestTargets: actor.requestTargets,
        });
        try {
            await actor.client.prompt(envelope);
        } catch (error) {
            if (actor.generation !== generation || generation?.settled) return;
            request.state = "delivery-unknown";
            request.turn = "unknown";
            request.reuse = "busy";
            request.error = { code: "DELIVERY_UNKNOWN", message: messageOf(error, "prompt acknowledgement was not observed") };
            actor.turn = "unknown";
            this.#signalRequest(request);
            this.#emitStateWake(run, request);
        }
    }

    #onSessionEvent(run, actor, event, generation) {
        if (actor.generation !== generation || generation.exitIntent || generation.settled || !isRecord(event)) return;
        if (event.type === "turn_start") {
            generation.activeTurn = ++generation.turnSequence;
            return;
        }
        if (event.type !== "turn_end") return;
        const endedTurn = generation.activeTurn;
        generation.activeTurn = undefined;
        const request = actor.currentRequestId ? run.requests.get(actor.currentRequestId) : undefined;
        if (
            !request ||
            request.state !== "replied" ||
            !Number.isInteger(request.settlementTurn) ||
            request.settlementTurn !== endedTurn
        ) return;
        request.turn = "succeeded";
        request.reuse = "ready";
        this.#releaseActor(run, actor, request, generation);
    }

    #onActorEvent(run, actor, event, generation) {
        if (!isRecord(event)) return;
        if (actor.generation !== generation || generation.exitIntent || generation.settled) return;
        if (event.type === "agent_start") {
            generation.startedRequestId = actor.currentRequestId;
            return;
        }
        if (event.type !== "agent_end" || event.isTerminal === false) return;
        const requestId = generation.startedRequestId;
        if (!requestId || actor.currentRequestId !== requestId) return;
        const request = run.requests.get(requestId);
        if (!request) return;
        generation.activeTurn = undefined;
        if (request.state === "pending") {
            request.state = "failed";
            request.turn = "succeeded";
            request.reuse = "ready";
            request.error = { code: "NO_REPLY", message: "worker turn ended without an authoritative reply" };
        } else if (request.state === "replied") {
            request.turn = "succeeded";
            request.reuse = "ready";
        } else if (request.state === "delivery-unknown") {
            // A missing prompt acknowledgement is an explicit frontier. Even a
            // later session event does not authorize reuse or successor
            // delivery; only observe or explicit abort may advance it.
            this.#signalRequest(request);
            this.#emitStateWake(run, request);
            return;
        } else {
            return;
        }
        this.#releaseActor(run, actor, request, generation);
    }

    #releaseActor(run, actor, request, generation) {
        actor.turn = request.turn;
        actor.reuse = "ready";
        actor.state = "idle";
        actor.currentRequestId = undefined;
        this.#signalRequest(request);
        this.#emitStateWake(run, request);

        const queuedId = actor.queuedRequestId;
        actor.queuedRequestId = undefined;
        if (queuedId) {
            const queued = run.requests.get(queuedId);
            if (queued) {
                actor.currentRequestId = queuedId;
                void this.#deliver(run, actor, queued).catch((error) => this.#onActorFailure(run, actor, error, generation));
            }
        }
        this.#refreshWakeTimer();
    }

    #onActorFailure(run, actor, error, generation = actor.generation) {
        if (generation && actor.generation !== generation) return;
        if (generation?.settled || actor.state === "disposed" || actor.state === "disposing") return;
        if (generation) generation.settled = true;
        actor.state = "failed";
        actor.turn = "failed";
        actor.reuse = "terminal";
        const request = actor.currentRequestId ? run.requests.get(actor.currentRequestId) : undefined;
        if (request) {
            if (request.state !== "replied") request.state = "failed";
            request.turn = "failed";
            request.reuse = "terminal";
            if (!request.reply) request.error = { code: "WORKER_FAILED", message: messageOf(error, "worker failed") };
            this.#signalRequest(request);
            this.#emitStateWake(run, request);
        }
        this.#settleQueuedAfterTerminal(run, actor, "ACTOR_TERMINAL", "actor became terminal before successor delivery");
        this.#refreshWakeTimer();
    }

    #settleQueuedAfterTerminal(run, actor, code, message) {
        const queuedId = actor.queuedRequestId;
        actor.queuedRequestId = undefined;
        if (!queuedId) return;
        const request = run.requests.get(queuedId);
        if (!request) return;
        request.state = "failed";
        request.turn = "failed";
        request.reuse = "terminal";
        request.error = { code, message };
        this.#signalRequest(request);
        this.#emitStateWake(run, request);
    }

    #observe(call, owner) {
        const run = this.#ownedRun("observe", call.runId, owner, true);
        if (call.requestIds !== undefined && (!Array.isArray(call.requestIds) || call.requestIds.some((id) => typeof id !== "string"))) {
            return failure("observe", "INVALID_INPUT", "requestIds must be an array of strings", { runId: run.runId });
        }
        let requests = [...run.requests.values()];
        if (call.requestIds) {
            requests = call.requestIds.map((id) => {
                const request = run.requests.get(id);
                if (!request) throw errorWithCode("INVALID_INPUT", `unknown request: ${id}`);
                if (request.ownerId !== owner) throw errorWithCode("UNAUTHORIZED", `caller does not own request: ${id}`);
                return request;
            });
        } else if (owner !== run.rootOwner) {
            requests = requests.filter((request) => request.ownerId === owner);
        }
        return success("observe", run.runId, {
            run: runSummary(run),
            actors: [...run.actors.values()].map((actor) => actorSummary(actor, owner)),
            requests: requests.map((request) => requestView(request, owner)),
        });
    }

    async #channelCall(run, actor, params, signal) {
        if (!isRecord(params) || typeof params.op !== "string") {
            return failure("dispatch", "INVALID_INPUT", "lifecycle_channel requires op", { runId: run.runId, actorId: actor.actorId });
        }
        const owner = `actor:${actor.actorId}`;
        if (params.op === "reply") {
            if (typeof params.body !== "string") {
                return failure("dispatch", "INVALID_INPUT", "reply requires body", { runId: run.runId, actorId: actor.actorId });
            }
            const request = actor.currentRequestId ? run.requests.get(actor.currentRequestId) : undefined;
            if (!request || request.ownerId === owner || request.actorId !== actor.actorId) {
                return failure("dispatch", "UNAUTHORIZED", "connection has no current parent-owned request", {
                    runId: run.runId,
                    actorId: actor.actorId,
                });
            }
            if (request.state !== "pending") {
                return failure("dispatch", "ACTOR_BUSY", "the current request already has a reply or terminal outcome", {
                    runId: run.runId,
                    actorId: actor.actorId,
                    requestId: request.requestId,
                });
            }
            if (
                actor.disposeChildrenBeforeReply &&
                descendants(run, actor.actorId).some((child) => child.state !== "declared" && child.state !== "disposed")
            ) {
                return failure("dispatch", "ACTOR_BUSY", "owned children must be disposed before this actor replies", {
                    runId: run.runId,
                    actorId: actor.actorId,
                    requestId: request.requestId,
                });
            }
            request.reply = { body: params.body, acceptedAt: new Date().toISOString() };
            request.state = "replied";
            request.settlementTurn = actor.generation?.activeTurn;
            actor.state = "finishing";
            this.#signalRequest(request);
            this.#emitStateWake(run, request);
            this.#refreshWakeTimer();
            return success("dispatch", run.runId, { request: requestView(request, request.ownerId) });
        }
        if (params.op === "request") {
            if (!Array.isArray(params.calls) || params.calls.some((call) => !actor.requestTargets.includes(call?.target))) {
                return failure("dispatch", "UNAUTHORIZED", "connection requested an undeclared child", {
                    runId: run.runId,
                    actorId: actor.actorId,
                });
            }
            const dispatched = await this.#dispatch({ runId: run.runId, calls: params.calls }, owner);
            if (!dispatched.ok) return dispatched;
            const ids = dispatched.data.requests.map((request) => request.requestId);
            const views = await this.#waitForRequests(run, ids, owner, signal);
            return success("dispatch", run.runId, { requests: views });
        }
        if (params.op === "dispose") {
            if (typeof params.actorId !== "string" || typeof params.subtree !== "boolean") {
                return failure("dispose", "INVALID_INPUT", "dispose requires actorId and subtree", { runId: run.runId });
            }
            return await this.#disposeActor(run, owner, params.actorId, params.subtree);
        }
        return failure("dispatch", "INVALID_INPUT", "lifecycle_channel op must be request, reply, or dispose", {
            runId: run.runId,
            actorId: actor.actorId,
        });
    }

    #waitForRequests(run, ids, owner, signal) {
        const complete = () => ids.every((id) => {
            const state = run.requests.get(id)?.state;
            return state !== "pending";
        });
        if (complete()) return Promise.resolve(ids.map((id) => requestView(run.requests.get(id), owner)));
        return new Promise((resolve, reject) => {
            let settled = false;
            const cleanup = () => {
                for (const id of ids) this.#waiters.get(id)?.delete(waiter);
                signal?.removeEventListener?.("abort", abort);
            };
            const abort = () => {
                if (settled) return;
                settled = true;
                cleanup();
                reject(errorWithCode("ABORTED", "connection-bound child request was aborted"));
            };
            const waiter = () => {
                if (settled || !complete()) return;
                settled = true;
                cleanup();
                resolve(ids.map((id) => requestView(run.requests.get(id), owner)));
            };
            for (const id of ids) {
                let waiters = this.#waiters.get(id);
                if (!waiters) this.#waiters.set(id, (waiters = new Set()));
                waiters.add(waiter);
            }
            if (signal?.aborted) abort();
            else signal?.addEventListener?.("abort", abort, { once: true });
        });
    }

    #signalRequest(request) {
        const waiters = this.#waiters.get(request.requestId);
        if (!waiters) return;
        for (const waiter of [...waiters]) waiter();
        if (waiters.size === 0) this.#waiters.delete(request.requestId);
    }

    async #disposeCall(call, owner) {
        const run = this.#ownedRun("dispose", call.runId, owner);
        if (typeof call.actorId !== "string" || typeof call.subtree !== "boolean") {
            return failure("dispose", "INVALID_INPUT", "dispose requires actorId and subtree", { runId: run.runId });
        }
        return await this.#disposeActor(run, owner, call.actorId, call.subtree);
    }

    async #disposeActor(run, owner, actorId, subtree) {
        const actor = run.actors.get(actorId);
        if (!actor) return failure("dispose", "INVALID_INPUT", `unknown actor: ${actorId}`, { runId: run.runId });
        if (actor.ownerId !== owner) {
            return failure("dispose", "UNAUTHORIZED", "caller does not own actor", { runId: run.runId, actorId });
        }
        if (actor.state === "failed-cleanup") {
            return failure("dispose", "DISPOSAL_FAILED", "actor has unresolved cleanup", { runId: run.runId, actorId });
        }
        const ownedDescendants = descendants(run, actorId).filter((entry) => entry.ownerId === `actor:${actorId}` || subtree);
        const liveDescendants = ownedDescendants.filter((entry) => entry.state !== "disposed" && entry.state !== "declared");
        if (!subtree && liveDescendants.length > 0) {
            return failure("dispose", "INVALID_INPUT", "subtree must be true while descendants are live", { runId: run.runId, actorId });
        }
        const selected = subtree ? [...ownedDescendants, actor] : [actor];
        const summaries = selected.filter((entry) => entry !== actor).map((entry) => actorSummary(entry, owner));
        const failures = [];
        for (const selectedActor of selected) {
            const disposed = await this.#stopActor(run, selectedActor, true);
            if (!disposed) failures.push(selectedActor);
        }
        this.#refreshWakeTimer();
        if (failures.length > 0) {
            return success("dispose", run.runId, {
                actorId,
                state: "failed-cleanup",
                descendants: failures.map((entry) => actorSummary(entry, owner, true)),
            });
        }
        return success("dispose", run.runId, { actorId, state: "disposed", descendants: summaries });
    }

    async #stopActor(run, actor, clearBuffers) {
        if (actor.state === "disposed") return true;
        if (actor.state === "declared") {
            actor.state = "disposed";
            actor.reuse = "terminal";
            if (clearBuffers) this.#clearActorRequests(run, actor.actorId);
            return true;
        }
        const generation = actor.generation;
        if (generation) generation.exitIntent ??= "dispose";
        actor.state = "disposing";
        const request = actor.currentRequestId ? run.requests.get(actor.currentRequestId) : undefined;
        try {
            if (request && request.state === "pending") {
                request.state = "aborted";
                request.turn = "aborted";
                request.reuse = "terminal";
                request.error = { code: "ABORTED", message: "request was terminated by disposal" };
                this.#signalRequest(request);
            }
            await actor.client?.abort?.().catch(() => {});
            await actor.client?.stop?.();
            await this.#awaitGenerationExit(actor, generation);
            if (generation) generation.settled = true;
            actor.state = "disposed";
            actor.turn = request?.reply ? "aborted" : actor.turn;
            actor.reuse = "terminal";
            actor.client = undefined;
            actor.currentRequestId = undefined;
            actor.queuedRequestId = undefined;
            if (clearBuffers) this.#clearActorRequests(run, actor.actorId);
            return true;
        } catch {
            actor.state = "failed-cleanup";
            actor.reuse = "terminal";
            return false;
        }
    }

    #clearActorRequests(run, actorId) {
        for (const [requestId, request] of run.requests) {
            if (request.actorId !== actorId) continue;
            request.reply = undefined;
            run.requests.delete(requestId);
            this.#waiters.delete(requestId);
        }
    }

    async #abortCall(call, owner) {
        const run = this.#ownedRun("abort", call.runId, owner);
        const hasRequest = Object.hasOwn(call, "requestId");
        const hasActor = Object.hasOwn(call, "actorId");
        if (hasRequest && hasActor) return failure("abort", "INVALID_INPUT", "abort accepts requestId or actorId, not both", { runId: run.runId });
        if (hasRequest) {
            if (typeof call.requestId !== "string") return failure("abort", "INVALID_INPUT", "requestId must be a string", { runId: run.runId });
            const request = run.requests.get(call.requestId);
            if (!request) return failure("abort", "INVALID_INPUT", `unknown request: ${call.requestId}`, { runId: run.runId });
            if (request.ownerId !== owner) return failure("abort", "UNAUTHORIZED", "caller does not own request", { runId: run.runId, requestId: request.requestId });
            const actor = run.actors.get(request.actorId);
            if (actor.queuedRequestId === request.requestId) {
                actor.queuedRequestId = undefined;
                request.state = "aborted";
                request.turn = "aborted";
                request.reuse = "terminal";
                request.error = { code: "ABORTED", message: "reserved request was aborted before delivery" };
                this.#signalRequest(request);
            } else {
                await this.#abortActor(run, actor, request);
            }
            this.#refreshWakeTimer();
            return success("abort", run.runId, { target: request.requestId, state: actor.state === "failed-cleanup" ? "failed-cleanup" : "aborted" });
        }
        if (hasActor) {
            if (typeof call.actorId !== "string") return failure("abort", "INVALID_INPUT", "actorId must be a string", { runId: run.runId });
            const actor = run.actors.get(call.actorId);
            if (!actor) return failure("abort", "INVALID_INPUT", `unknown actor: ${call.actorId}`, { runId: run.runId });
            if (actor.ownerId !== owner) return failure("abort", "UNAUTHORIZED", "caller does not own actor", { runId: run.runId, actorId: actor.actorId });
            for (const child of descendants(run, actor.actorId)) await this.#abortActor(run, child);
            await this.#abortActor(run, actor);
            this.#refreshWakeTimer();
            return success("abort", run.runId, { target: actor.actorId, state: actor.state === "failed-cleanup" ? "failed-cleanup" : "aborted" });
        }
        if (run.rootOwner !== owner) return failure("abort", "UNAUTHORIZED", "only the root owner can abort a run", { runId: run.runId });
        const depth = (entry) => {
            let value = 0;
            let current = entry;
            while (current.parentActorId) {
                value += 1;
                current = run.actors.get(current.parentActorId);
            }
            return value;
        };
        for (const actor of [...run.actors.values()].sort((a, b) => depth(b) - depth(a))) {
            await this.#abortActor(run, actor);
        }
        run.state = [...run.actors.values()].some((actor) => actor.state === "failed-cleanup") ? "failed-cleanup" : "closed";
        this.#refreshWakeTimer();
        return success("abort", run.runId, { target: run.runId, state: run.state === "failed-cleanup" ? "failed-cleanup" : "aborted" });
    }

    async #abortActor(run, actor, exactRequest = undefined) {
        if (!actor || actor.state === "declared" || actor.state === "disposed") return;
        const generation = actor.generation;
        if (generation) generation.exitIntent ??= "abort";
        const request = exactRequest ?? (actor.currentRequestId ? run.requests.get(actor.currentRequestId) : undefined);
        if (request && request.state !== "failed" && request.state !== "aborted") {
            request.state = request.reply ? "replied" : "aborted";
            request.turn = "aborted";
            request.reuse = "terminal";
            if (!request.reply) request.error = { code: "ABORTED", message: "request was explicitly aborted" };
            this.#signalRequest(request);
            this.#emitStateWake(run, request);
        }
        try {
            await actor.client?.abort?.().catch(() => {});
            await actor.client?.stop?.();
            await this.#awaitGenerationExit(actor, generation);
            if (generation) generation.settled = true;
            actor.state = "failed";
            actor.turn = "aborted";
            actor.reuse = "terminal";
            actor.client = undefined;
            this.#settleQueuedAfterTerminal(run, actor, "ACTOR_TERMINAL", "actor was aborted before successor delivery");
        } catch {
            actor.state = "failed-cleanup";
            actor.turn = "aborted";
            actor.reuse = "terminal";
        }
    }

    async #closeCall(call, owner) {
        const run = this.#ownedRun("close", call.runId, owner, true);
        if (run.rootOwner !== owner) return failure("close", "UNAUTHORIZED", "only the root owner can close a run", { runId: run.runId });
        if (run.state === "closed") return failure("close", "RUN_TERMINAL", "run is closed", { runId: run.runId });
        run.state = "closing";
        const ordered = [...run.actors.values()].sort((a, b) => {
            const depth = (entry) => {
                let value = 0;
                let current = entry;
                while (current.parentActorId) {
                    value += 1;
                    current = run.actors.get(current.parentActorId);
                }
                return value;
            };
            return depth(b) - depth(a);
        });
        const unresolved = [];
        for (const actor of ordered) {
            if (!(await this.#stopActor(run, actor, true))) unresolved.push(actor);
        }
        run.state = unresolved.length === 0 ? "closed" : "failed-cleanup";
        this.#refreshWakeTimer();
        return success("close", run.runId, {
            state: run.state,
            unresolvedActors: unresolved.map((actor) => actorSummary(actor, owner, true)),
        });
    }

    async closeAll(owner) {
        const results = [];
        for (const run of this.#runs.values()) {
            if (run.rootOwner !== owner || run.state === "closed") continue;
            results.push(await this.#closeCall({ runId: run.runId }, owner));
        }
        return results;
    }

    findRequestOwnerTarget(value, owner) {
        for (const run of this.#runs.values()) {
            if (run.rootOwner !== owner) continue;
            if (run.runId === value) return { runId: run.runId };
            if (run.requests.has(value)) return { runId: run.runId, requestId: value };
        }
        return undefined;
    }

    #pendingRequests() {
        const result = [];
        for (const run of this.#runs.values()) {
            for (const request of run.requests.values()) {
                if (request.state === "pending") result.push({ run, request });
            }
        }
        return result;
    }

    #refreshWakeTimer() {
        const pending = this.#pendingRequests();
        if (pending.length > 0 && !this.#wakeTimer) {
            this.#wakeTimer = this.#setInterval(() => this.#emitPeriodicWake(), this.#wakeIntervalMs);
        } else if (pending.length === 0 && this.#wakeTimer) {
            this.#clearTimer(this.#wakeTimer);
            this.#wakeTimer = undefined;
        }
    }

    #emitPeriodicWake() {
        const pending = this.#pendingRequests();
        if (pending.length === 0) {
            this.#refreshWakeTimer();
            return;
        }
        const statuses = pending.map(({ run, request }) => `${run.runId}/${request.requestId}:${request.state}`).join(",");
        this.#notify(`lifecycle pending ${statuses}; observation only: call lifecycle observe or explicit abort; do not perform semantic work`, {
            kind: "periodic",
        });
    }

    #emitStateWake(run, request) {
        this.#notify(`lifecycle ${run.runId}/${request.requestId}:${request.state}`, { kind: "state" });
    }
}

export function createLifecycleSupervisor(options) {
    return new LifecycleSupervisor(options);
}

export function createMechanicalProbeSupervisor(options) {
    return new LifecycleSupervisor({ ...options, proofOnly: true });
}

export const lifecycleSchemas = Object.freeze({ call: CALL_SCHEMA, result: RESULT_SCHEMA });
