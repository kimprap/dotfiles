// T2 composition over the shared T1 native adapter (reused, not copied).
//
// The shared adapter's journal-window reader attaches only the T1 probe field
// set to candidates. T2 wraps the public runtime's `watchSession` (a public
// acpx API passed into the shared adapter) so that, for the same raw watch
// event the adapter consumes, the T2 closed A7 projection of the candidate
// `details.data` is captured by cursor. No raw event or raw data is retained.
// The wrapper can also deliberately detach one request's observer right after
// its `turn_started` (the planned observer-loss exercise); it never cancels,
// replays or resubmits the actor's turn.
import { exportEvent } from "../evidence/export.mjs";
import { clock, sampleStatus } from "../native/adapter.mjs";
import { isYieldSignature } from "../native/window.mjs";
import { fromProjection, projectResultData, validateResult } from "./domain.mjs";

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export class ObserverDetached extends Error {
  constructor(requestId) {
    super(`trial observer deliberately detached after turn_started of ${requestId}`);
    this.code = "TRIAL_OBSERVER_DETACHED";
  }
}

/** Candidate projection for one raw watch event, or undefined. */
export function captureFromRawEvent(ev) {
  if (ev?.type !== "message") return undefined;
  const u = ev.message?.params?.update;
  if (ev.message?.method !== "session/update" || !isObj(u) || u.sessionUpdate !== "tool_call_update" || u.status !== "completed") return undefined;
  const details = isObj(u.rawOutput) ? u.rawOutput.details : undefined;
  if (!isObj(details) || details.status !== "success" || !Object.hasOwn(details, "data") || details.data === undefined) return undefined;
  return projectResultData(details.data);
}

/**
 * Wraps a public shared runtime. `captured` maps cursor -> closed projection.
 * `detachAfterStart(requestId)` arms a one-shot deliberate observer detach.
 */
export function withCapture(runtime) {
  const captured = new Map();
  const armed = new Set();
  const detachLog = [];
  function watchSession(options) {
    const inner = runtime.watchSession(options);
    return {
      async *[Symbol.asyncIterator]() {
        for await (const ev of inner) {
          const proj = captureFromRawEvent(ev);
          if (proj !== undefined && typeof ev.cursor === "string" && !captured.has(ev.cursor)) captured.set(ev.cursor, proj);
          const detach = ev.type === "turn_started" && armed.has(ev.requestId);
          yield ev;
          if (detach) {
            // Observer loss right after the consumer took turn_started; leaving
            // the for-await closes only this passive observer.
            armed.delete(ev.requestId);
            detachLog.push({ requestId: ev.requestId, afterCursor: ev.cursor ?? null, at: clock.iso(), mono: clock.mono() });
            throw new ObserverDetached(ev.requestId);
          }
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
  return { runtime: wrapped, captured, detachAfterStart: (rid) => armed.add(rid), detachLog };
}

/**
 * A1 closure for a T2 request window (the shared RequestWindow's rows, with the
 * T2 schema). `projection` is the captured closed projection of the first
 * candidate. Validation happens exactly once here.
 */
export function closeRequest({ win, control, projection, phase, ctx }) {
  const unfinishedYield = [...win.invocations.values()].filter((i) => isYieldSignature(i) && !i.terminal).map((i) => i.toolCallId);
  const base = { windowComplete: win.state === "closed", unfinishedYield, unknownRequestIds: [...win.unknownRequestIds], anomalies: [...win.anomalies] };
  if (win.state !== "closed") return { ...base, row: "window-unavailable", c4: false };
  if (win.firstCandidate) {
    if (projection === undefined) return { ...base, row: "evidence-fault", c4: false, defects: ["first candidate has no captured T2 projection"] };
    const v = validateResult(phase, fromProjection(projection), ctx);
    return { ...base, row: v.valid ? "candidate-valid" : "candidate-invalid", c4: !v.valid, defects: v.defects, value: v.value, variant: v.variant };
  }
  if (control.cancelled || control.ceiling || control.revoked) return { ...base, row: "controller-stop", c4: false };
  if (unfinishedYield.length > 0) return { ...base, row: "delivery-uncertain", c4: false };
  if (win.turnResult?.status !== "completed") return { ...base, row: "turn-not-completed", c4: false };
  return { ...base, row: "completed-no-result", c4: true, defects: ["no accepted final `yield` result with explicit `data` was submitted"] };
}

/**
 * Observation recovery (spec "Observation recovery"): re-watch the original
 * request from its last consumed opaque cursor and continue the same window.
 * Admits an already captured original candidate at most once; never resubmits.
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
    if (!abort.signal.aborted) out.error = error?.code ?? error?.name ?? "error";
    else out.error = "deadline";
  } finally {
    clearTimeout(timer);
    abort.abort();
  }
  out.endedAt = clock.iso();
  out.recovered = win.state === "closed";
  out.candidateRecovered = !out.priorCandidate && Boolean(win.firstCandidate);
  out.duplicateCursors = win.duplicateCursorCount - dup0;
  if (out.recovered) {
    rec.window = { ...rec.window, complete: true, startCursor: win.startCursor, endCursor: win.endCursor, events: win.events, anomalies: win.anomalies, rpc: win.rpc, duplicateCursorCount: win.duplicateCursorCount };
    rec.firstCandidate = win.firstCandidate ?? null;
    rec.toolFacts = win.toolFacts();
    ledger.record(await sampleStatus(cap.runtime, handle, `journal-settled:${rec.requestId}:recovered`));
  }
  return out;
}

/** Closed retained form of one request record (drops the in-memory window). */
export function retainRequest(rec, classification, projection) {
  const { win: _win, ...rest } = rec;
  const out = { ...rest, classification: { ...classification } };
  delete out.classification.value;
  if (rec.firstCandidate) out.candidate = { cursor: rec.firstCandidate.cursor, toolCallId: rec.firstCandidate.toolCallId, projection: projection ?? null };
  delete out.firstCandidate;
  return out;
}
