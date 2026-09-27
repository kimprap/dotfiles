// A7 closed typed export. Retained evidence is constructed from enumerated
// fields only; nothing is copied from a raw native object and then filtered.
// Excluded by construction: titles, error prose, raw details/metadata objects,
// message text, tool input/output bodies, permission bodies, resource bytes,
// env/headers and every unknown nested extra.
import { projectDomainData } from "../native/domain.mjs";

const YIELD_KEYS = new Set(["type", "data", "error"]);
const TOOL_STATUSES = new Set(["pending", "in_progress", "completed", "failed"]);
const ACP_KINDS = new Set(["read", "edit", "delete", "move", "search", "execute", "think", "fetch", "switch_mode", "other"]);
const DETAILS_STATUSES = new Set(["success", "error", "aborted"]);
const STOP_REASONS = new Set(["end_turn", "max_tokens", "max_turn_requests", "refusal", "cancelled"]);

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v, max = 512) => (typeof v === "string" && v.length <= max ? v : undefined);
const enumOr = (set, v) => (typeof v === "string" ? (set.has(v) ? v : "other-value") : undefined);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

function prune(obj) {
  for (const k of Object.keys(obj)) if (obj[k] === undefined) delete obj[k];
  return obj;
}

/** Projects the policy-relevant facts of one tool_call / tool_call_update. */
export function projectToolUpdate(update) {
  const rawInput = update.rawInput;
  const rawOutput = update.rawOutput;
  const out = {
    toolCallId: str(update.toolCallId, 256),
    status: enumOr(TOOL_STATUSES, update.status),
    acpKind: enumOr(ACP_KINDS, update.kind),
  };
  if (rawInput !== undefined) {
    if (isObj(rawInput)) {
      const keys = Object.keys(rawInput).sort();
      out.input = prune({
        keyCount: keys.length,
        // Only declared yield keys are named; any other key is counted, not named.
        declaredYieldKeys: keys.filter((k) => YIELD_KEYS.has(k)),
        undeclaredKeyCount: keys.filter((k) => !YIELD_KEYS.has(k)).length,
        typeIsArray: Array.isArray(rawInput.type) || undefined,
        useLastTurn: rawInput.useLastTurn === true || undefined,
        hasData: Object.hasOwn(rawInput, "data") || undefined,
        // Policy-relevant explicitly selected argument field for read/search/edit attempts.
        path: str(rawInput.path) ?? str(rawInput.file_path) ?? undefined,
      });
    } else out.input = { nonObject: true };
  }
  if (rawOutput !== undefined) {
    const details = isObj(rawOutput) ? rawOutput.details : undefined;
    out.output = prune({
      detailsStatus: isObj(details) ? enumOr(DETAILS_STATUSES, details.status) : undefined,
      hasData: isObj(details) && Object.hasOwn(details, "data") && details.data !== undefined ? true : undefined,
    });
  }
  return prune(out);
}

/** Returns the candidate domain data projection for a completed yield-shaped update. */
export function projectCandidateData(update) {
  const details = isObj(update.rawOutput) ? update.rawOutput.details : undefined;
  if (!isObj(details) || !Object.hasOwn(details, "data")) return undefined;
  return projectDomainData(details.data);
}

/** Projects one ACP JSON-RPC message observed in a journal window. */
export function projectMessage(message) {
  if (!isObj(message)) return { rpc: "invalid" };
  const hasId = Object.hasOwn(message, "id");
  const method = str(message.method, 128);
  if (method !== undefined) {
    const out = { rpc: hasId ? "request" : "notification", method, id: hasId ? num(message.id) ?? str(message.id, 64) : undefined };
    const params = isObj(message.params) ? message.params : {};
    if (method === "session/resume" || method === "session/load") out.sessionId = str(params.sessionId, 256);
    if (method === "session/update" && isObj(params.update)) {
      const update = params.update;
      const kind = str(update.sessionUpdate, 64);
      out.update = { kind };
      if (kind === "tool_call" || kind === "tool_call_update") out.update.tool = projectToolUpdate(update);
      if (kind === "usage_update") {
        out.update.usage = prune({
          used: num(update.used),
          size: num(update.size),
          costAmount: isObj(update.cost) ? num(update.cost.amount) : undefined,
          costCurrency: isObj(update.cost) ? str(update.cost.currency, 8) : undefined,
        });
      }
    }
    if (method === "session/request_permission" && isObj(params.toolCall)) {
      out.permissionToolCallId = str(params.toolCall.toolCallId, 256);
    }
    return prune(out);
  }
  const out = { rpc: "response", id: num(message.id) ?? str(message.id, 64) };
  if (isObj(message.error)) out.error = prune({ code: num(message.error.code) });
  if (isObj(message.result)) {
    const r = message.result;
    if (typeof r.stopReason === "string") out.stopReason = enumOr(STOP_REASONS, r.stopReason);
    if (typeof r.sessionId === "string") out.newSessionId = str(r.sessionId, 256);
    if (isObj(r.agentCapabilities)) {
      const sc = r.agentCapabilities.sessionCapabilities;
      out.resumeAdvertised = isObj(sc) && Object.hasOwn(sc, "resume");
    }
  }
  return prune(out);
}

/** Projects one public watch event (cursor + kind + owning requestId). */
export function projectWatchEvent(event) {
  const base = { cursor: str(event.cursor, 256), type: event.type, requestId: event.requestId ?? null };
  if (event.type === "message") return { ...base, message: projectMessage(event.message) };
  if (event.type === "turn_result") {
    const r = event.result ?? {};
    return {
      ...base,
      result: prune({
        status: enumOr(new Set(["completed", "cancelled", "failed"]), r.status),
        stopReason: r.status !== "failed" ? enumOr(STOP_REASONS, r.stopReason) : undefined,
        errorCode: r.status === "failed" && isObj(r.error) ? str(r.error.code, 64) : undefined,
        errorDetailCode: r.status === "failed" && isObj(r.error) ? str(r.error.detailCode, 64) : undefined,
        retryable: r.status === "failed" && isObj(r.error) && typeof r.error.retryable === "boolean" ? r.error.retryable : undefined,
      }),
    };
  }
  return base;
}

/**
 * Exports a complete window observation bundle. `context` (env, headers, etc.)
 * is accepted only so callers cannot accidentally route it elsewhere; no field
 * of it is exported.
 */
export function exportWindow({ context: _context, events }) {
  return events.map(exportEvent);
}

/** Exports one raw public watch event; a completed success yield-shaped update also carries its closed domain projection. */
export function exportEvent(e) {
  const projected = projectWatchEvent(e);
  const tool = projected.message?.update?.tool;
  if (tool && tool.status === "completed" && tool.output?.detailsStatus === "success" && tool.output?.hasData) {
    projected.message.update.candidateData = projectCandidateData(e.message.params.update);
  }
  return projected;
}
