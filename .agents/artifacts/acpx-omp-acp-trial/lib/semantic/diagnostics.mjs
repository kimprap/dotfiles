// B2 bounded independent capture diagnosis and B5 fail-fast snapshot/offline
// replay. The diagnostic reader below is deliberately independent of the
// shared RequestWindow state machine: it re-derives association and
// start-to-result completeness from A7-projected events only.
import { exportEvent } from "../evidence/export.mjs";
import { clock } from "../native/adapter.mjs";
import { RequestWindow } from "../native/window.mjs";
import { closeRequest } from "./capture.mjs";

/**
 * Offline replay of one retained A7-safe window through the same A1 closure
 * used natively: `events` are exported events, `projections` maps cursor ->
 * closed candidate projection. No raw journal or native session is read.
 */
export function replayOutcome({ requestId, events, projections, control = {}, phase, ctx }) {
  const win = new RequestWindow({ requestId, knownRequestIds: new Set() });
  for (const e of events) if (win.accept(e)) break;
  const projection = win.firstCandidate ? projections[win.firstCandidate.cursor] : undefined;
  const cls = closeRequest({ win, control: { cancelled: false, ceiling: false, revoked: false, ...control }, projection, phase, ctx });
  return { requestId, row: cls.row, value: cls.value, defects: cls.defects, unfinishedYield: cls.unfinishedYield, turnStatus: win.turnResult?.status };
}
/**
 * Independent window reader over A7-projected events for request R.
 * Returns { complete, association, invocations: Map(toolCallId -> terminal status|null) }.
 */
export function readWindowIndependently(events, requestId) {
  let open = false;
  let complete = false;
  let startCursor = null;
  let endCursor = null;
  const seen = new Set();
  const inv = new Map();
  const association = { foreignInside: 0, nullInside: 0, duplicateCursors: 0 };
  for (const e of events) {
    if (e.cursor && seen.has(e.cursor)) {
      association.duplicateCursors++;
      continue;
    }
    if (e.cursor) seen.add(e.cursor);
    if (e.requestId !== requestId) {
      if (open && !complete) e.requestId === null || e.requestId === undefined ? association.nullInside++ : association.foreignInside++;
      continue;
    }
    if (e.type === "turn_started" && !open) {
      open = true;
      startCursor = e.cursor ?? null;
      continue;
    }
    if (!open || complete) continue;
    if (e.type === "turn_result") {
      complete = true;
      endCursor = e.cursor ?? null;
      continue;
    }
    const tool = e.message?.update?.tool;
    if (!tool?.toolCallId) continue;
    if (!inv.has(tool.toolCallId)) inv.set(tool.toolCallId, null);
    if ((tool.status === "completed" || tool.status === "failed") && inv.get(tool.toolCallId) === null) inv.set(tool.toolCallId, tool.status);
  }
  return { opened: open, complete, startCursor, endCursor, association, invocations: inv };
}

/**
 * B2 classification. `observation` is the controller's retained A1 closure:
 * { row, turnStatus, cancelled, validRetained, unfinishedYield[] }.
 * `replay` is { events, error? } from one fresh passive watch.
 */
export function classifyDiagnostic(observation, replay, requestId) {
  const prerequisites = observation.row === "delivery-uncertain" && observation.turnStatus === "completed" && !observation.cancelled && !observation.validRetained && observation.unfinishedYield.length > 0;
  if (!prerequisites) return { result: "not-applicable", codeFault: false, reason: "A2 prerequisites (completed, uncancelled, observable request without a retained valid result) do not hold" };
  if (!replay || replay.error) return { result: "unproved", codeFault: false, reason: `replay unavailable: ${replay?.error ?? "none"}` };
  const w = readWindowIndependently(replay.events, requestId);
  if (!w.opened || !w.complete) return { result: "unproved", codeFault: false, reason: "replayed window is incomplete; absence cannot be proved" };
  const present = observation.unfinishedYield.filter((id) => w.invocations.get(id) === "completed" || w.invocations.get(id) === "failed");
  if (present.length) {
    // Journaled: compare with the controller's retained observation. Presence
    // alone never proves a trial-code fault (B2 rule 3/4).
    return { result: "journaled", codeFault: false, discrepancy: "controller observation lacked a journaled terminal update", toolCallIds: present, reason: "requires independent evidence and offline reproduction before any B4 attribution" };
  }
  return { result: "not-supported-required-observable-path", codeFault: false, toolCallIds: observation.unfinishedYield, reason: "complete, correctly bound window lacks the required terminal update (A2 rule 1)" };
}

/**
 * One finite passive re-watch of the exact original window from the retained
 * cursor before its turn_started (B2 step 1-2). Never decodes or fabricates a
 * cursor, never resubmits, and stops at the matching turn_result.
 */
export async function replayWindow({ runtime, handle, requestId, cursorBefore, deadlineMs }) {
  const events = [];
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), deadlineMs);
  const out = { startedAt: clock.iso(), cursorBefore: cursorBefore ?? null };
  try {
    for await (const ev of runtime.watchSession({ handle, cursor: cursorBefore ?? undefined, signal: abort.signal })) {
      const p = exportEvent(ev);
      events.push(p);
      if (p.type === "turn_result" && p.requestId === requestId) break;
    }
  } catch (error) {
    out.error = abort.signal.aborted ? "deadline" : error?.code ?? error?.name ?? "error";
  } finally {
    clearTimeout(timer);
    abort.abort();
  }
  out.endedAt = clock.iso();
  out.events = events;
  return out;
}

// ------------------------------------------------------------------ B5

const SNAPSHOT_FIELDS = ["invariant", "state", "requestId", "windowStartCursor", "windowEndCursor", "toolCallId", "events"];

/** Closed fail-fast snapshot: enumerated fields only, A7 events, frozen before cleanup. */
export function freezeSnapshot(input) {
  const snap = {};
  for (const k of SNAPSHOT_FIELDS) if (input[k] !== undefined) snap[k] = input[k];
  snap.frozenAt = clock.iso();
  return deepFreeze(JSON.parse(JSON.stringify(snap)));
}

function deepFreeze(o) {
  if (o && typeof o === "object") {
    for (const v of Object.values(o)) deepFreeze(v);
    Object.freeze(o);
  }
  return o;
}

/** Appends cleanup facts without overwriting the frozen fault snapshot. */
export function appendCleanup(record, facts) {
  return { snapshot: record.snapshot, cleanup: [...(record.cleanup ?? []), { at: clock.iso(), ...facts }] };
}

/** Controlled clock for deterministic replay. */
export function controlledClock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms) };
}

/**
 * Runs `fn` with native/network fall-through failing closed: global fetch,
 * net/tls connections and child-process spawning throw while it runs.
 * Returns { value, blocked[] }.
 */
export async function isolated(fn) {
  const net = await import("node:net");
  const tls = await import("node:tls");
  const cp = await import("node:child_process");
  const blocked = [];
  const deny = (what) => () => {
    blocked.push(what);
    throw new Error(`offline replay: ${what} is forbidden`);
  };
  const saved = { fetch: globalThis.fetch, connect: net.default.connect, createConnection: net.default.createConnection, tls: tls.default.connect, spawn: cp.default.spawn, execFile: cp.default.execFile };
  globalThis.fetch = deny("fetch");
  net.default.connect = deny("net.connect");
  net.default.createConnection = deny("net.createConnection");
  tls.default.connect = deny("tls.connect");
  cp.default.spawn = deny("spawn");
  cp.default.execFile = deny("execFile");
  try {
    return { value: await fn(), blocked };
  } catch (error) {
    return { error, blocked };
  } finally {
    globalThis.fetch = saved.fetch;
    net.default.connect = saved.connect;
    net.default.createConnection = saved.createConnection;
    tls.default.connect = saved.tls;
    cp.default.spawn = saved.spawn;
    cp.default.execFile = saved.execFile;
  }
}
