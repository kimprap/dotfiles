// Controller ports: binds the semantic controller to the public acpx adapter
// (spec-v3 §3, §4). Owns the run's private root and child environment, one
// shared runtime per launch argv, actor creation/restoration, one request per
// call with A1 closure, disposal with observed exit, parking, and A4 cleanup.
// No semantic decisions are made here.
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { AGENT_ID, buildAgentArgv, closeAndObserve, createRuntime, ensureWithSampling, PidLedger, observePid as defaultObservePid, RUNTIME, runRequest } from "./adapter.mjs";
import { closeRequest, recoverObservation, withCapture } from "./capture.mjs";
import { childEnv, cleanupLiveSessionFolders, createPrivateRoot, enterChildEnv, newRunId, privateRootFor, removePrivateRoot, sessionDirFor } from "./env.mjs";
import { readJsonIfExists, writeJson } from "./io.mjs";
import { Spend } from "./spend.mjs";

const RECOVERY_BOUND_MS = 30_000;

function attachRun({ kind, runId, dirs, deps, spend, sessionIds = [] }) {
  const restoreEnv = enterChildEnv(childEnv(dirs, deps.env ?? process.env));
  return {
    kind,
    runId,
    dirs,
    deps,
    sessionDir: sessionDirFor(runId, deps.sessionsRoot),
    spend,
    runtimes: new Map(),
    actors: new Map(),
    sessionIds: new Set(sessionIds),
    restoreEnv,
    envRestored: false,
  };
}

/** Creates the private root and enters the child environment (before any runtime exists). */
export async function openRun(kind, deps) {
  const runId = newRunId(kind);
  const dirs = await createPrivateRoot(runId, deps.tmpRoot);
  return attachRun({ kind, runId, dirs, deps, spend: new Spend() });
}

/** Re-enters a parked run: same private HOME and session folder. `null` when no parked state exists. */
export async function reopenRun(runId, deps) {
  const dirs = privateRootFor(runId, deps.tmpRoot);
  const state = await readJsonIfExists(dirs.state);
  if (!state) return null;
  const run = attachRun({ kind: state.kind, runId, dirs, deps, spend: Spend.fromJSON(state.spend), sessionIds: state.sessionIds ?? [] });
  return { run, state };
}

/** Restores the caller's environment exactly once. */
export function leaveRun(run) {
  if (run.envRestored) return;
  run.envRestored = true;
  run.restoreEnv();
}

function runtimeFor(run, role) {
  const argv = buildAgentArgv({ ompPath: run.deps.ompPath, model: role.model, thinking: role.thinking, sessionDir: run.sessionDir, ...(run.deps.overlayPath ? { overlayPath: run.deps.overlayPath } : {}) });
  const key = JSON.stringify(argv);
  if (!run.runtimes.has(key)) run.runtimes.set(key, withCapture(createRuntime({ cwd: run.dirs.work, argv })));
  return run.runtimes.get(key);
}

/**
 * Creates (or, with `restore`, same-session restores) one persistent actor.
 * A restore that returns another backend session is an identity loss and throws.
 */
export async function startActor(run, { name, role, restore }) {
  const cap = runtimeFor(run, role);
  const ledger = restore ? PidLedger.fromJSON(restore.ledger) : new PidLedger();
  const sessionKey = restore?.sessionKey ?? `${run.runId}:${name}`;
  const input = { sessionKey, agent: AGENT_ID, mode: "persistent", cwd: run.dirs.work, ...(restore ? { resumeSessionId: restore.backendSessionId } : {}) };
  const actor = { name, role, sessionKey, cap, ledger, state: "restoring", requests: restore?.requests ?? 0, cursor: restore?.cursor ?? undefined, known: new Set(restore?.known ?? []) };
  run.actors.set(name, actor);
  let handle;
  try {
    ({ handle } = await ensureWithSampling(cap.runtime, input, ledger));
  } catch (error) {
    actor.state = "unrestored";
    throw error;
  }
  actor.handle = handle;
  actor.backendSessionId = handle.backendSessionId;
  if (actor.backendSessionId) run.sessionIds.add(actor.backendSessionId);
  if (restore && handle.backendSessionId !== restore.backendSessionId) {
    actor.state = "unrestored";
    throw Object.assign(new Error(`restored session ${handle.backendSessionId ?? "none"} differs from parked ${restore.backendSessionId}`), { code: "SESSION_IDENTITY_CHANGED" });
  }
  actor.state = "active";
  return actor;
}

/**
 * Submits one request once and closes it (A1). Returns the closeRequest row
 * plus `requestId`. A fresh session inside the window or a changed backend
 * session is reported as row `identity-changed`.
 */
export async function ask(run, actor, text, validate) {
  const requestId = `${actor.name}:${randomUUID()}`;
  const rec = await runRequest({ runtime: actor.cap.runtime, handle: actor.handle, ledger: actor.ledger, requestId, text, cursor: actor.cursor, knownRequestIds: actor.known });
  const close = () => closeRequest({ win: rec.win, control: rec.control, data: actor.cap.captured.get(rec.win.firstCandidate?.cursor), validate });
  let out = close();
  if (out.row === "window-unavailable") {
    const recovery = await recoverObservation({ cap: actor.cap, handle: actor.handle, rec, ledger: actor.ledger, boundMs: RECOVERY_BOUND_MS });
    out = { ...close(), recovery };
  }
  actor.known.add(requestId);
  actor.requests++;
  if (rec.win.state === "closed" && rec.win.endCursor) actor.cursor = rec.win.endCursor;
  const sampled = actor.ledger.samples.filter((s) => s.backendSessionId).at(-1);
  if ((rec.window.rpc?.sessionNew ?? 0) > 0 || (sampled && sampled.backendSessionId !== actor.backendSessionId)) out = { ...out, row: "identity-changed", c4: false };
  const usage = actor.ledger.samples.filter((s) => s.usage).at(-1)?.usage;
  if (usage) run.spend.record(actor.name, actor.role, usage);
  return { ...out, requestId, turnResult: rec.turnResult };
}

/** Supported close plus observed exit; spend from the last pre-close sample. */
export async function disposeActor(run, actor, reason) {
  const out = await closeAndObserve({ runtime: actor.cap.runtime, handle: actor.handle, ledger: actor.ledger, reason, observePid: run.deps.observePid ?? defaultObservePid });
  if (out.lastUsage) run.spend.record(actor.name, actor.role, out.lastUsage);
  actor.state = out.disposed ? "closed" : "closing";
  actor.disposal = out;
  return out;
}

/** Human-readable residue of a failed disposal: actor, unexited PIDs, close facts. */
export function disposalFailure(actor) {
  const d = actor.disposal;
  if (!d) return `${actor.name}: not closed`;
  const present = d.pidResults.filter((p) => p.result !== "ESRCH").map((p) => `${p.pid} ${p.result}`);
  const parts = [];
  if (!d.closeResolved) parts.push(`close failed (${d.closeError ?? "error"})`);
  if (!d.recordedClosed) parts.push("record not closed");
  if (!d.pidCoverageNonEmpty) parts.push("no recorded PID");
  if (present.length) parts.push(`PID ${present.join(", ")}`);
  return `${actor.name}: ${parts.join("; ")}`;
}

/** Serializable restore record for one parked actor. */
export function actorRecord(actor) {
  return { name: actor.name, sessionKey: actor.sessionKey, backendSessionId: actor.backendSessionId, cursor: actor.cursor ?? null, known: [...actor.known], requests: actor.requests, ledger: actor.ledger.toJSON() };
}

async function detachRuntimes(run) {
  for (const cap of run.runtimes.values()) await cap.runtime.shutdown().catch(() => {});
  run.runtimes.clear();
}

/**
 * KR13 park: every live actor is closed with observed exit while its stored
 * session stays resumable (same `resumeSessionId`); `state` is written to the
 * private root; the session folder and private root are kept.
 */
export async function parkRun(run, actors, state) {
  const failures = [];
  for (const a of actors) {
    if (a.state === "closed") continue;
    const d = await disposeActor(run, a, "parked for identity-preserving repair");
    if (!d.disposed) failures.push(disposalFailure(a));
  }
  await writeJson(run.dirs.state, { ...state, kind: run.kind, runId: run.runId, sessionIds: [...run.sessionIds], spend: run.spend.toJSON(), actors: actors.map(actorRecord) });
  await detachRuntimes(run);
  return { parked: failures.length === 0, failures };
}

/**
 * A4 run cleanup: runs only when every actor showed observed exit; then the
 * session folder and the private root (with its socket folder) are removed.
 * Returns `{ complete, unresolved }` naming anything kept.
 */
export async function finishRun(run) {
  const unresolved = [];
  const observer = run.deps.observePid ?? defaultObservePid;
  for (const a of run.actors.values()) {
    if (a.state === "closed") continue;
    if (a.handle && a.state === "active") {
      const d = await disposeActor(run, a, "run cleanup");
      if (!d.disposed) unresolved.push(disposalFailure(a));
      continue;
    }
    if (a.state === "closing") {
      unresolved.push(disposalFailure(a));
      continue;
    }
    // Never-established or unrestored session: only observed exit of every recorded PID counts.
    for (const { pid } of a.ledger.pids.values()) {
      const r = await a.ledger.waitExit(pid, "cleanup-unrestored", RUNTIME.postCloseObserveMs, RUNTIME.pidPollMs, observer);
      if (r !== "ESRCH") unresolved.push(`${a.name}: PID ${pid} ${r}`);
    }
  }
  await detachRuntimes(run);
  if (unresolved.length) return { complete: false, unresolved: [...unresolved, `session folder \`${run.sessionDir}\` and private root \`${run.dirs.root}\` kept`] };
  let realCwd;
  try {
    realCwd = await fs.realpath(run.dirs.work);
  } catch {
    realCwd = undefined;
  }
  const cleanup = await cleanupLiveSessionFolders({ sessionDir: run.sessionDir, sessionIds: [...run.sessionIds], realCwd, sessionsRoot: run.deps.sessionsRoot });
  const removed = await removePrivateRoot(run.dirs);
  if (!cleanup.complete) unresolved.push(`session folder \`${run.sessionDir}\` kept: ${[...cleanup.kept, ...cleanup.folders.filter((f) => f.result.startsWith("kept")).map((f) => f.path)].join(", ")}`);
  if (!removed.removed) unresolved.push(`private root \`${run.dirs.root}\` or socket folder \`${removed.socketDir}\` kept`);
  return { complete: unresolved.length === 0, unresolved };
}

/** Observes every PID recorded for a parked run (never signals). */
export async function observeParkedPids(run, records) {
  const present = [];
  for (const r of records) {
    const ledger = PidLedger.fromJSON(r.ledger);
    for (const { pid } of ledger.pids.values()) {
      const result = await ledger.waitExit(pid, "dispose-parked", RUNTIME.postCloseObserveMs, RUNTIME.pidPollMs, run.deps.observePid ?? defaultObservePid);
      if (result !== "ESRCH") present.push(`${r.name}: PID ${pid} ${result}`);
    }
  }
  return present;
}
