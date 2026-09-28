// Controller ports: binds the semantic controller to the public acpx adapter
// (spec-v3 §3, §4). Owns the run's private root and child environment, one
// shared runtime per launch argv, actor creation/restoration, one request per
// call with A1 closure, disposal with observed exit, parking, and A4 cleanup.
// No semantic decisions are made here.
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { AGENT_ID, buildAgentArgv, closeAndObserve, createRuntime, ensureWithSampling, PidLedger, observePid as defaultObservePid, RUNTIME, runRequest } from "./adapter.mjs";
import { closeRequest, recoverObservation, withCapture } from "./capture.mjs";
import { childEnv, cleanupLiveSessionFolders, createPrivateRoot, enterChildEnv, newRunId, privateRootFor, readOwnerClaim, removePrivateRoot, sessionDirFor, writeClaim, writeRunRecord } from "./env.mjs";
import { writeJson } from "./io.mjs";
import { OWN_START_UNREADABLE, ownStartReason, OWNER_UNREADABLE, ownerState, selfOwner } from "./preflight.mjs";
import { Spend } from "./spend.mjs";

const RECOVERY_BOUND_MS = 30_000;

function attachRun({ kind, runId, dirs, deps, spend, sessionIds = [], record }) {
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
    sessionIds: new Set([...sessionIds, ...(record?.sessionIds ?? [])]),
    pids: new Set(record?.pids ?? []),
    phase: record?.phase ?? "active",
    recordWrite: Promise.resolve(),
    restoreEnv,
    envRestored: false,
  };
}

/**
 * Queues one atomic `run.json` rewrite `{runId, kind, phase, pids, sessionIds}`
 * from the run's current PID and session-ID sets; returns this write. Each
 * write carries the full current record, so a failed earlier write never
 * blocks a later one.
 */
function syncRunRecord(run) {
  const record = { runId: run.runId, kind: run.kind, phase: run.phase, pids: [...run.pids], sessionIds: [...run.sessionIds] };
  run.recordWrite = run.recordWrite.catch(() => {}).then(() => writeRunRecord(run.dirs, record));
  run.recordWrite.catch(() => {});
  return run.recordWrite;
}

/** Sets the run's recorded phase and waits for the rewrite. */
export async function setRunPhase(run, phase) {
  run.phase = phase;
  await syncRunRecord(run);
}

/** The claim holder this process writes: `deps.owner` or `{ pid, lstart }` of this process. */
const ownerFor = (deps) => (deps.owner ? Promise.resolve(deps.owner) : selfOwner(deps.processStart));

/**
 * Creates the private root (owner claim and `run.json` included) and enters the
 * child environment (before any runtime exists). Throws before creating
 * anything when this process's start time cannot be read.
 */
export async function openRun(kind, deps) {
  const owner = await ownerFor(deps);
  if (!owner.lstart) throw Object.assign(new Error(`${OWN_START_UNREADABLE}: ${ownStartReason(owner.pid)}`), { code: "EOWNSTART" });
  const runId = newRunId(kind);
  const dirs = await createPrivateRoot(runId, deps.tmpRoot, { kind, owner });
  return attachRun({ kind, runId, dirs, deps, spend: new Spend() });
}

/**
 * One controller per run: refuses when this process's own start time is
 * unreadable, while the highest `claim-<n>` holder is live, or while that
 * holder's PID is present with an unreadable start time (it cannot be proven
 * gone); otherwise publishes `claim-<n+1>` with this process as holder.
 * Returns `{ claimed: true }`, `{ claimed: false, refusal, reason }` (refusal
 * title and line), or `{ claimed: false, missingRoot: true }` when the run has
 * no private root.
 */
export async function claimRun(runId, deps) {
  const owner = await ownerFor(deps);
  if (!owner.lstart) return { claimed: false, refusal: OWN_START_UNREADABLE, reason: ownStartReason(owner.pid) };
  const dirs = privateRootFor(runId, deps.tmpRoot);
  const holder = await readOwnerClaim(dirs.root);
  const state = await ownerState(holder, { observePid: deps.observePid ?? defaultObservePid, processStart: deps.processStart });
  if (state === "live") return { claimed: false, refusal: "run claimed by another controller", reason: `run \`${runId}\` is owned by a live controller (PID ${holder.pid})` };
  if (state === "unknown") {
    return { claimed: false, refusal: OWNER_UNREADABLE, reason: `run \`${runId}\` owner PID ${holder.pid} is present but its start time cannot be compared, so it cannot be proven gone; nothing was changed` };
  }
  try {
    await writeClaim(dirs.root, (holder?.index ?? -1) + 1, owner);
  } catch (error) {
    if (error.code === "EEXIST") return { claimed: false, refusal: "run claimed by another controller", reason: `another controller claimed run \`${runId}\` first` };
    if (error.code === "ENOENT") return { claimed: false, missingRoot: true };
    throw error;
  }
  return { claimed: true };
}

/**
 * Re-enters a run's private HOME and session folder from its `run.json` and,
 * when parked, its `state.json`. Call only after `claimRun` and observed exit.
 */
export function reopenRun(runId, deps, { record, state }) {
  const dirs = privateRootFor(runId, deps.tmpRoot);
  return attachRun({ kind: state?.kind ?? record.kind, runId, dirs, deps, spend: state ? Spend.fromJSON(state.spend) : new Spend(), sessionIds: state?.sessionIds ?? [], record });
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
 * Every newly recorded PID and the backend session ID are written to `run.json`.
 */
export async function startActor(run, { name, role, restore }) {
  const cap = runtimeFor(run, role);
  const ledger = restore ? PidLedger.fromJSON(restore.ledger) : new PidLedger();
  const known = run.pids.size;
  for (const pid of ledger.pids.keys()) run.pids.add(pid);
  if (run.pids.size !== known) syncRunRecord(run);
  ledger.onPid = (pid) => {
    run.pids.add(pid);
    syncRunRecord(run);
  };
  const sessionKey = restore?.sessionKey ?? `${run.runId}:${name}`;
  const input = { sessionKey, agent: AGENT_ID, mode: "persistent", cwd: run.dirs.work, ...(restore ? { resumeSessionId: restore.backendSessionId } : {}) };
  const actor = { name, role, sessionKey, cap, ledger, state: "restoring", requests: restore?.requests ?? 0, cursor: restore?.cursor ?? undefined, known: new Set(restore?.known ?? []) };
  run.actors.set(name, actor);
  let handle;
  try {
    ({ handle } = await ensureWithSampling(cap.runtime, input, ledger));
  } catch (error) {
    actor.state = "unrestored";
    await run.recordWrite.catch(() => {});
    throw error;
  }
  actor.handle = handle;
  actor.backendSessionId = handle.backendSessionId;
  if (actor.backendSessionId && !run.sessionIds.has(actor.backendSessionId)) {
    run.sessionIds.add(actor.backendSessionId);
    syncRunRecord(run);
  }
  await run.recordWrite;
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
  await run.recordWrite;
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
 * private root, then `run.json` phase becomes `parked`; the session folder and
 * private root are kept.
 */
export async function parkRun(run, actors, state) {
  const failures = [];
  for (const a of actors) {
    if (a.state === "closed") continue;
    const d = await disposeActor(run, a, "parked for identity-preserving repair");
    if (!d.disposed) failures.push(disposalFailure(a));
  }
  await writeJson(run.dirs.state, { ...state, kind: run.kind, runId: run.runId, sessionIds: [...run.sessionIds], spend: run.spend.toJSON(), actors: actors.map(actorRecord) });
  await setRunPhase(run, "parked");
  await detachRuntimes(run);
  return { parked: failures.length === 0, failures };
}

/**
 * A4 run cleanup: runs only when every actor showed observed exit; then the
 * session folders are cleaned, and only when that cleanup completes is the
 * private root (with `run.json` and its socket folder) removed, so residue
 * never loses its record. Returns `{ complete, unresolved, keptRecord }` naming anything kept.
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
  await run.recordWrite.catch(() => {});
  if (unresolved.length) return { complete: false, unresolved: [...unresolved, `session folder \`${run.sessionDir}\` and private root \`${run.dirs.root}\` kept`] };
  let realCwd;
  try {
    realCwd = await fs.realpath(run.dirs.work);
  } catch {
    realCwd = undefined;
  }
  const cleanup = await cleanupLiveSessionFolders({ sessionDir: run.sessionDir, sessionIds: [...run.sessionIds], realCwd, sessionsRoot: run.deps.sessionsRoot });
  if (!cleanup.complete) {
    const kept = [...cleanup.kept.map((name) => `${run.sessionDir}/${name}`), ...cleanup.folders.filter((f) => f.result.startsWith("kept")).map((f) => f.path)];
    unresolved.push(`session folder cleanup kept: ${kept.map((k) => `\`${k}\``).join(", ")}`, `private root \`${run.dirs.root}\` and its \`run.json\` kept`);
    return { complete: false, unresolved, keptRecord: true };
  }
  const removed = await removePrivateRoot(run.dirs);
  if (!removed.removed) unresolved.push(`private root \`${run.dirs.root}\` or socket folder \`${removed.socketDir}\` kept`);
  return { complete: unresolved.length === 0, unresolved };
}

/**
 * Observes the given PIDs with signal 0 under the post-close bound (never
 * signals). Returns the PIDs not observed as `ESRCH`, as `{ pid, result }`.
 */
export async function observeRunPids(deps, pids) {
  const ledger = new PidLedger([], [...new Set(pids)].map((pid) => ({ pid })));
  const present = [];
  for (const pid of ledger.pids.keys()) {
    const result = await ledger.waitExit(pid, "run-claim", RUNTIME.postCloseObserveMs, RUNTIME.pidPollMs, deps.observePid ?? defaultObservePid);
    if (result !== "ESRCH") present.push({ pid, result });
  }
  return present;
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
