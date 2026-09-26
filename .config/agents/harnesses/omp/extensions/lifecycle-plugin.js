import { createLifecycleSupervisor } from "./lifecycle-supervisor.js";

const CALL_SCHEMA = "omp-lifecycle-call/v1";
const RESULT_SCHEMA = "omp-lifecycle-result/v1";

function ownerFromContext(ctx) {
    return ctx?.sessionManager?.getSessionId?.();
}

function failure(op, code, message, runId = undefined) {
    const result = {
        schema: RESULT_SCHEMA,
        ok: false,
        op,
        error: { code, message },
    };
    if (runId !== undefined) result.runId = runId;
    return result;
}

function toolResult(result) {
    return {
        content: [{ type: "text", text: JSON.stringify(result) }],
        details: result,
        isError: result.ok === false,
    };
}

function lifecycleParameters(Type) {
    return Type.Object(
        {
            schema: Type.String(),
            op: Type.String(),
            definition: Type.Optional(Type.String()),
            binding: Type.Optional(Type.Any()),
            runId: Type.Optional(Type.String()),
            calls: Type.Optional(Type.Array(Type.Any())),
            requestIds: Type.Optional(Type.Array(Type.String())),
            actorId: Type.Optional(Type.String()),
            requestId: Type.Optional(Type.String()),
            subtree: Type.Optional(Type.Boolean()),
            metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
        },
        { additionalProperties: true }
    );
}

export default function lifecyclePlugin(pi) {
    pi.setLabel("lifecycle");

    let supervisor;
    let supervisorOwner;

    const notify = (message) => {
        pi.sendMessage(
            {
                customType: "omp-lifecycle-status/v1",
                content: message,
                display: true,
                attribution: "agent",
            },
            { deliverAs: "aside" }
        );
    };

    function getSupervisor(ctx, create) {
        const owner = ownerFromContext(ctx);
        if (!owner) return { error: failure("open", "UNAUTHORIZED", "physical session identity is unavailable") };
        if (!supervisor && create) {
            supervisorOwner = owner;
            supervisor = createLifecycleSupervisor({
                cwd: ctx.cwd,
                models: ctx.models,
                notify,
                setInterval: ctx.setInterval.bind(ctx),
                clearTimer: ctx.clearTimer.bind(ctx),
            });
        }
        if (!supervisor) return { error: failure("observe", "INVALID_INPUT", "no lifecycle run is open") };
        if (supervisorOwner !== owner) return { error: failure("observe", "UNAUTHORIZED", "session does not own this lifecycle supervisor") };
        return { owner, supervisor };
    }

    pi.registerTool({
        name: "lifecycle",
        label: "Lifecycle",
        description: "Open, dispatch, observe, dispose, abort, or close a named persistent worker lifecycle.",
        parameters: lifecycleParameters(pi.typebox.Type),
        async execute(_toolCallId, params, signal, _onUpdate, ctx) {
            if (signal?.aborted) return toolResult(failure(params?.op ?? "open", "ABORTED", "lifecycle call was aborted"));
            if (params?.schema !== CALL_SCHEMA) {
                return toolResult(failure(params?.op ?? "open", "INVALID_INPUT", `schema must equal ${CALL_SCHEMA}`));
            }
            const state = getSupervisor(ctx, params.op === "open");
            if (state.error) {
                const result = { ...state.error, op: params.op ?? state.error.op };
                return toolResult(result);
            }
            return toolResult(await state.supervisor.call(params, state.owner));
        },
    });

    pi.registerCommand("lifecycle", {
        description: "Inspect lifecycle state or explicitly abort a run/request.",
        handler: async (argumentsText, ctx) => {
            const parts = argumentsText.trim().split(/\s+/).filter(Boolean);
            const state = getSupervisor(ctx, false);
            if (state.error) {
                ctx.ui.notify(state.error.error.message, "warning");
                return;
            }
            if (parts.length === 0 || parts[0] === "status") {
                const runId = parts[1];
                const status = await state.supervisor.status(state.owner, runId);
                ctx.ui.notify(JSON.stringify(status), status?.ok === false ? "warning" : "info");
                return;
            }
            if (parts[0] === "abort" && parts.length === 2) {
                const target = state.supervisor.findRequestOwnerTarget(parts[1], state.owner);
                if (!target) {
                    ctx.ui.notify(`Unknown lifecycle run or request: ${parts[1]}`, "warning");
                    return;
                }
                const result = await state.supervisor.call({ schema: CALL_SCHEMA, op: "abort", ...target }, state.owner);
                ctx.ui.notify(JSON.stringify(result), result.ok ? "info" : "error");
                return;
            }
            ctx.ui.notify("Usage: /lifecycle status [run] | /lifecycle abort <run|request>", "warning");
        },
    });

    pi.on("session_shutdown", async (_event, ctx) => {
        if (!supervisor || !supervisorOwner) return;
        await supervisor.closeAll(supervisorOwner);
        supervisor = undefined;
        supervisorOwner = undefined;
    });
}
