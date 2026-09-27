// Candidate capture and A1 closure over the native adapter. The public
// runtime's `watchSession` is wrapped so that, for the same raw watch event the
// adapter consumes, the explicit `rawOutput.details.data` of a completed
// success tool update is captured by cursor. Admission uses only the closed
// request window; the domain validator is injected by the caller.
import { clock, sampleStatus } from "./adapter.mjs";
import { exportEvent } from "./export.mjs";

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/** Candidate `data` (a deep copy) for one raw watch event, or undefined. */
export function captureFromRawEvent(ev) {
  if (ev?.type !== "message") return undefined;
  const u = ev.message?.params?.update;
  if (ev.message?.method !== "session/update" || !isObj(u) || u.sessionUpdate !== "tool_call_update" || u.status !== "completed") return undefined;
  const details = isObj(u.rawOutput) ? u.rawOutput.details : undefined;
  if (!isObj(details) || details.status !== "success" || !Object.hasOwn(details, "data") || details.data === undefined) return undefined;
  return structuredClone(details.data);
}

/** Wraps a public shared runtime. `captured` maps cursor -> candidate data. */
export function withCapture(runtime) {
  const captured = new Map();
  function watchSession(options) {
    const inner = runtime.watchSession(options);
    return {
      async *[Symbol.asyncIterator]() {
        for await (const ev of inner) {
          const data = captureFromRawEvent(ev);
          if (data !== undefined && typeof ev.cursor === "string" && !captured.has(ev.cursor)) captured.set(ev.cursor, data);
          yield ev;
        }
      },
    };
  }
  const wrapped = new Proxy(runtime, {
    get(target, prop) {
      if (prop === "watchSession") return watchSession;
      const v = target[prop];
      return typeof v === "function" ? v.bind(target) : v;
    },
  });
  return { runtime: wrapped, captured };
}

/**
 * A1 closure for one closed request window (spec-v3 §4.3). Only the first
 * admitted native `yield` candidate counts; it is validated exactly once with
 * `validate(data) -> { valid, defects, value?, variant? }` and an invalid first
 * candidate is kept, never replaced by a later one. Rows:
 *   window-unavailable  window not closed (observation lost; recover, never replay)
 *   tool-policy-stop    a completed tool call outside read/search/yield
 *   candidate-valid     valid first candidate (ordinary meaning)
 *   candidate-invalid   invalid first candidate: one C4 invalid return
 *   evidence-fault      first candidate without captured data
 *   controller-stop     no candidate; controller cancelled or authority revoked
 *   delivery-uncertain  no candidate; a yield started without terminal update
 *   turn-not-completed  no candidate; turn failed or cancelled otherwise
 *   completed-no-result no candidate; completed turn: one C4 invalid return
 */
export function closeRequest({ win, control, data, validate }) {
  const unfinishedYield = win.unfinishedYields();
  const forbidden = win.forbiddenCompleted();
  const base = { windowComplete: win.state === "closed", unfinishedYield, forbidden, unknownRequestIds: [...win.unknownRequestIds], anomalies: [...win.anomalies], turnResult: win.turnResult ?? null };
  if (win.state !== "closed") return { ...base, row: "window-unavailable", c4: false };
  if (forbidden.length) return { ...base, row: "tool-policy-stop", c4: false };
  if (win.firstCandidate) {
    if (data === undefined) return { ...base, row: "evidence-fault", c4: false, defects: ["first candidate has no captured data"] };
    const v = validate(data);
    return { ...base, row: v.valid ? "candidate-valid" : "candidate-invalid", c4: !v.valid, defects: v.defects ?? [], value: v.value, variant: v.variant };
  }
  if (control.cancelled || control.revoked) return { ...base, row: "controller-stop", c4: false };
  if (unfinishedYield.length > 0) return { ...base, row: "delivery-uncertain", c4: false };
  if (win.turnResult?.status !== "completed") return { ...base, row: "turn-not-completed", c4: false };
  return { ...base, row: "completed-no-result", c4: true, defects: ["no accepted final `yield` result with explicit `data` was submitted"] };
}

/**
 * Observation recovery (spec-v3 §4.4): re-watch the original request from its
 * last consumed opaque cursor and continue the same window. Admits an already
 * captured original candidate at most once; never resubmits the prompt.
 */
export async function recoverObservation({ cap, handle, rec, ledger, boundMs }) {
  const win = rec.win;
  const consumed = [...win.seenCursors];
  const fromCursor = win.state === "before" ? rec.windowStartCursor ?? undefined : consumed.at(-1);
  const out = { fromCursor: fromCursor ?? null, startedAt: clock.iso(), priorState: win.state, priorCandidate: Boolean(win.firstCandidate) };
  const dup0 = win.duplicateCursorCount;
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), boundMs);
  try {
    for await (const ev of cap.runtime.watchSession({ handle, cursor: fromCursor, signal: abort.signal })) {
      if (win.accept(exportEvent(ev))) break;
    }
  } catch (error) {
    out.error = abort.signal.aborted ? "deadline" : error?.code ?? error?.name ?? "error";
  } finally {
    clearTimeout(timer);
    abort.abort();
  }
  out.endedAt = clock.iso();
  out.recovered = win.state === "closed";
  out.candidateRecovered = !out.priorCandidate && Boolean(win.firstCandidate);
  out.duplicateCursors = win.duplicateCursorCount - dup0;
  if (out.recovered) {
    rec.window = { ...rec.window, complete: true, startCursor: win.startCursor, endCursor: win.endCursor, anomalies: win.anomalies, rpc: win.rpc, duplicateCursorCount: win.duplicateCursorCount };
    rec.firstCandidate = win.firstCandidate ?? null;
    rec.toolFacts = win.toolFacts();
    ledger.record(await sampleStatus(cap.runtime, handle, `journal-settled:${rec.requestId}:recovered`));
  }
  return out;
}
