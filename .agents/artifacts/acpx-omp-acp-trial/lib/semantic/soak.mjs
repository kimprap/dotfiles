// B1 lightweight native soak (spec-v9 "T2 deterministic mechanics and
// lightweight native soak"): four concurrent tiny-profile sessions, ten
// sequential expectations each, shared C4 re-asks, three size expectations,
// five designated original-request re-watches, four planned between-settled
// idle-expiry restores (short-TTL client -> normal-TTL shared client on the
// same records), four observed closes, then shutdown. No padding, replay,
// fallback or resubmission of uncertain requests.
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { AGENT_ID, PidLedger, clock, closeAndObserve, createTrialRuntime, ensureWithSampling, runRequest, sampleStatus, waitStatusPidCleared } from "../native/adapter.mjs";
import { BUNDLE_DIR, PROBE, PROBE_SOAK_POOL, RUNTIME, buildAgentArgv, sessionDirFor } from "../native/pins.mjs";
import { closeRequest, recoverObservation, retainRequest, withCapture } from "./capture.mjs";
import { classifyDiagnostic, replayWindow } from "./diagnostics.mjs";
import { exampleFor } from "./domain.mjs";

export const SOAK = Object.freeze({
  sessions: 4,
  expectations: 10,
  maxReasks: 3,
  maxSubmissions: 160,
  minPayloadBytes: 32768,
  size: Object.freeze([[1, 3], [2, 3], [3, 3]]),
  rewatch: Object.freeze([[1, 2], [1, 7], [2, 2], [3, 2], [4, 2]]),
  restoreAfter: 5,
});

const isSize = (s, e) => SOAK.size.some(([a, b]) => a === s && b === e);
const isRewatch = (s, e) => SOAK.rewatch.some(([a, b]) => a === s && b === e);

export function loadPrompts(text) {
  const out = {};
  for (const m of text.matchAll(/<!-- prompt:([\w-]+) -->\n([\s\S]*?)<!-- \/prompt -->/g)) out[m[1]] = m[2].trim();
  return out;
}
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k]));

/** Cumulative public-status usage per session, tolerating per-process counter resets. */
export function usageOf(samples, field) {
  let acc = 0;
  let prev = null;
  let known = false;
  for (const s of samples) {
    const v = s.usage?.[field];
    if (typeof v !== "number") continue;
    known = true;
    if (prev !== null && v < prev) acc += prev;
    prev = v;
  }
  return known ? acc + (prev ?? 0) : null;
}

/** `scriptedArgv` is only for the mechanics-only rehearsal against fixture-agent/soak.mjs. */
/**
 * Planned-restore outcome from observed facts only. A same backend ID is
 * required but never proves context integrity (see contextIntegrity).
 */
export function classifyRestore({ identity, attachedIdentity, idleExit, resumes, sessionNew }) {
  if (idleExit !== "ESRCH") return "unproved-idle-exit";
  if (!attachedIdentity || attachedIdentity.backendSessionId !== identity.backendSessionId || attachedIdentity.acpxRecordId !== identity.acpxRecordId) return "changed-identity";
  if (sessionNew !== 0) return "fresh-session-fallback";
  if (resumes.length !== 1) return resumes.length === 0 ? "no-resume-observed" : "multiple-resumes";
  const [x] = resumes;
  if (x.sessionId !== identity.backendSessionId) return "changed-identity";
  if (x.ok === undefined || x.ok === null) return "unknown-outcome";
  return x.ok === true ? "restored-same-id" : "restore-rejected";
}

/**
 * Restored-context integrity (spec-v9 persistence limit): the soak re-supplies
 * every token, so no required context depends on restoration and integrity is
 * reported unproved; exposure is the largest admitted string versus the
 * 500,000-character OMP persistence cap.
 */
export const PERSISTED_STRING_LIMIT_CHARS = 500_000;
export function contextIntegrity(sessions) {
  let max = 0;
  for (const s of sessions) for (const q of s.requests) for (const v of Object.values(q.candidate?.projection ?? {})) if (typeof v === "string") max = Math.max(max, v.length);
  return { status: "unproved", requiredRestoredContext: "none (every soak prompt re-supplies its token)", maxAdmittedStringChars: max, limitChars: PERSISTED_STRING_LIMIT_CHARS, exposed: max >= PERSISTED_STRING_LIMIT_CHARS, basis: "a stable backend ID after restore does not prove prior-context integrity" };
}

export async function runSoak({ ev, dirs, deadlineMono, priorCostKnownUsd, halt, scriptedArgv }) {
  const prompts = loadPrompts(await fs.readFile(path.join(BUNDLE_DIR, "prompts", "transport-soak.md"), "utf8"));
  const sessionDir = sessionDirFor(ev.runId);
  const argv = scriptedArgv ?? buildAgentArgv("tiny", sessionDir);
  const soak = { sessionDir, registryArgv: argv, agentId: AGENT_ID, startedAt: clock.iso(), sessions: [], submissions: 0, restoreTarget: "same-session-only" };
  ev.soak = soak;
  const short = createTrialRuntime({ cwd: dirs.cwd, argv, ttlMs: RUNTIME.shortTtlMs });
  const normal = createTrialRuntime({ cwd: dirs.cwd, argv, ttlMs: RUNTIME.normalTtlMs });
  const caps = { short: withCapture(short), normal: withCapture(normal) };
  let stopped = false;
  const stop = (why) => {
    if (!stopped) halt(why);
    stopped = true;
  };
  const costNow = () => soak.sessions.reduce((s, x) => s + (usageOf(x.ledger.samples, "costAmount") ?? 0), 0);

  const sessions = [];
  for (let i = 1; i <= SOAK.sessions; i++) {
    const s = { index: i, sessionKey: `t2-soak-s${i}`, ledger: new PidLedger(), expectations: [], requests: [], restores: [], incidental: [], idleSettles: [], rewatches: [], runtime: "short" };
    soak.sessions.push(s);
    sessions.push(s);
  }
  ev.processesStarted = true;
  // Ensure the four sessions concurrently on the short-TTL client.
  await Promise.all(sessions.map(async (s) => {
    s.ensureInvokedAt = clock.iso();
    try {
      const ensured = await ensureWithSampling(short, { sessionKey: s.sessionKey, agent: AGENT_ID, mode: "persistent", cwd: dirs.cwd }, s.ledger);
      s.handle = ensured.handle;
      s.identity = { acpxRecordId: ensured.handle.acpxRecordId ?? ensured.post.acpxRecordId, backendSessionId: ensured.handle.backendSessionId ?? ensured.post.backendSessionId };
      s.creationLaunchArgv = ensured.launchArgv;
      s.observedModel = ensured.post.currentModelId;
      s.state = { cursor: undefined, known: new Set() };
    } catch (error) {
      s.ensureError = error?.code ?? "error";
      stop(`ensure-failed:s${s.index}:${s.ensureError}`);
    }
  }));

  const runSession = async (s) => {
    if (!s.handle) return;
    s.activeFromMono = clock.mono();
    s.activeFrom = clock.iso();
    for (let e = 1; e <= SOAK.expectations; e++) {
      const exp = { index: e, kind: isSize(s.index, e) ? "soak-size" : "soak-token", token: `S${s.index}-E${e}-${randomUUID().slice(0, 6).toUpperCase()}`, requests: [], submissions: 0, invalidReturns: 0, reasks: 0, designatedRewatch: isRewatch(s.index, e) };
      s.expectations.push(exp);
      if (stopped) {
        exp.outcome = "not-run";
        continue;
      }
      if (e === SOAK.restoreAfter + 1) {
        const r = await plannedRestore(s, normal);
        s.restores.push(r);
        if (!r.attached) {
          exp.outcome = "not-run";
          stop(`restore-failed:s${s.index}:${r.error ?? "identity"}`);
          continue;
        }
      }
      const rt = s.runtime === "short" ? caps.short : caps.normal;
      const ctx = exp.kind === "soak-size" ? { minPayloadBytes: SOAK.minPayloadBytes } : { expectedToken: exp.token };
      let text = fill(exp.kind === "soak-size" ? prompts["soak-size"] : prompts["soak-token"], { EXPECTATION: e, TOKEN: exp.token });
      for (;;) {
        if (clock.mono() >= deadlineMono) {
          exp.outcome = "censored-wall-ceiling";
          stop("wall-ceiling: probe/soak pool wall allowance reached before submission");
          break;
        }
        if (priorCostKnownUsd + costNow() >= PROBE_SOAK_POOL.usd) {
          exp.outcome = "censored-cost-ceiling";
          stop(`cost-ceiling: reported probe/soak cost reached USD${PROBE_SOAK_POOL.usd}`);
          break;
        }
        if (stopped) {
          exp.outcome = "stopped";
          break;
        }
        if (soak.submissions >= SOAK.maxSubmissions) {
          exp.outcome = "censored-submission-bound";
          stop("submission-bound");
          break;
        }
        // Short-TTL discipline: never submit into an owner that may be expiring.
        // Wait for the previous owner's observed idle exit (ESRCH) and the public
        // status checkpoint; the submission then restores the same record.
        if (s.runtime === "short" && s.requests.length > 0) {
          const settle = await settleIdle(s, `before-s${s.index}-e${e}-a${exp.submissions + 1}`);
          s.idleSettles.push(settle);
          if (settle.exit !== "ESRCH" || settle.statusPidCleared?.cleared !== true) {
            exp.outcome = "stopped-idle-settle";
            stop(`idle-settle-unobserved:s${s.index}:e${e}`);
            break;
          }
        }
        const requestId = `${ev.runId}-s${s.index}-e${e}-a${exp.submissions + 1}`;
        const detach = exp.designatedRewatch && exp.submissions === 0;
        if (detach) rt.detachAfterStart(requestId);
        exp.submissions++;
        soak.submissions++;
        const rec = await runRequest({ runtime: rt.runtime, handle: s.handle, ledger: s.ledger, requestId, text, cursor: s.state.cursor, knownRequestIds: s.state.known, deadlineMono, argvProbe: true });
        s.state.known.add(requestId);
        if (detach) {
          const recovery = await recoverObservation({ cap: rt, handle: s.handle, rec, ledger: s.ledger, boundMs: 60_000 });
          const detached = rec.watchError === "TRIAL_OBSERVER_DETACHED";
          s.rewatches.push({ expectation: e, requestId, detached, ...recovery });
          if (!detached) s.rewatches.at(-1).note = "observer was not detached (turn_started not consumed before settlement)";
        }
        const projection = rec.win.firstCandidate ? rt.captured.get(rec.win.firstCandidate.cursor) : undefined;
        const cls = closeRequest({ win: rec.win, control: rec.control, projection, phase: exp.kind, ctx });
        rec.expectation = e;
        rec.attempt = exp.submissions;
        rec.runtime = s.runtime;
        exp.requests.push(requestId);
        const resumes = rec.win.rpc.sessionResume;
        if (resumes.length && !(e === SOAK.restoreAfter + 1 && exp.submissions === 1)) s.incidental.push({ requestId, resumes: resumes.map((r) => ({ sameId: r.sessionId === s.identity.backendSessionId, ok: r.ok === true })) });
        if (rec.win.rpc.sessionNew > 0) stop(`fresh-session-fallback:${requestId}`);
        s.requests.push(retainRequest(rec, cls, projection));
        if (rec.win.state === "closed") s.state.cursor = rec.win.endCursor;
        else {
          exp.outcome = `stopped-${cls.row}`;
          stop(`window-unavailable:${requestId}${rec.watchError ? `:${rec.watchError}` : ""}`);
          break;
        }
        if (cls.unknownRequestIds.length) stop(`unknown-request-binding:${requestId}`);
        const post = await sampleStatus(rt.runtime, s.handle, `post-request:${requestId}`);
        s.ledger.record(post);
        if (post.backendSessionId !== s.identity.backendSessionId || post.acpxRecordId !== s.identity.acpxRecordId) stop(`identity-changed:s${s.index}:${requestId}`);
        if (cls.row === "candidate-valid") {
          exp.outcome = "delivered";
          exp.admitted = { requestId, cursor: rec.firstCandidate.cursor, toolCallId: rec.firstCandidate.toolCallId };
          if (exp.kind === "soak-size") exp.admitted.payloadBytes = Buffer.byteLength(cls.value.payload, "utf8");
          break;
        }
        if (cls.c4) {
          exp.invalidReturns++;
          if (exp.invalidReturns > SOAK.maxReasks) {
            exp.outcome = "stopped-four-invalid-returns";
            stop(`s${s.index}-e${e}-four-invalid-returns`);
            break;
          }
          exp.reasks++;
          text = fill(prompts.reask, { DEFECT: cls.defects.join("; "), EXAMPLE: exampleFor(exp.kind) });
          continue;
        }
        if (cls.row === "delivery-uncertain") {
          // B2: one finite passive re-watch of the original window; never resubmitted.
          const replay = await replayWindow({ runtime: rt.runtime, handle: s.handle, requestId, cursorBefore: rec.windowStartCursor, deadlineMs: 30_000 });
          const diag = classifyDiagnostic({ row: cls.row, turnStatus: rec.turnResult.status, cancelled: rec.control.cancelled, validRetained: false, unfinishedYield: cls.unfinishedYield }, replay, requestId);
          s.diagnostics = [...(s.diagnostics ?? []), { requestId, replayError: replay.error ?? null, replayEvents: replay.events?.length ?? 0, ...diag }];
        }
        exp.outcome = `stopped-${cls.row}`;
        stop(`s${s.index}-e${e}-${cls.row}`);
        break;
      }
      exp.firstTryValid = exp.outcome === "delivered" && exp.submissions === 1;
    }
    s.activeUntilMono = clock.mono();
    s.activeUntil = clock.iso();
  };

  const lastPid = (s) => [...s.ledger.samples].reverse().find((x) => Number.isInteger(x.pid))?.pid;
  const settleIdle = async (s, point) => {
    const pre = await sampleStatus(short, s.handle, `pre-settle:${point}`);
    s.ledger.record(pre);
    const pid = Number.isInteger(pre.pid) ? pre.pid : lastPid(s);
    const out = { point, pid: pid ?? null, pidSource: Number.isInteger(pre.pid) ? "pre-settle-status" : "last-public-sample" };
    out.exit = Number.isInteger(pid) ? await s.ledger.waitExit(pid, `idle-settle:${point}`, PROBE.idleExpiryObserveMs, PROBE.pidPollMs) : "no-public-pid";
    if (out.exit === "ESRCH") out.statusPidCleared = await waitStatusPidCleared(short, s.handle, s.ledger, PROBE.idleExpiryObserveMs, PROBE.pidPollMs);
    return out;
  };

  const plannedRestore = async (s, target) => {
    const r = { beforeExpectation: SOAK.restoreAfter + 1, startedAt: clock.iso(), from: "short", to: "normal" };
    const pre = await sampleStatus(short, s.handle, "pre-idle-expiry");
    s.ledger.record(pre);
    r.preIdlePid = pre.pid ?? null;
    // The short-TTL owner may already have expired after the settled request; the
    // last publicly sampled PID of that owner is then the one to observe.
    const last = lastPid(s);
    r.observedPid = Number.isInteger(pre.pid) ? pre.pid : last ?? null;
    r.observedPidSource = Number.isInteger(pre.pid) ? "pre-idle-status" : last ? "last-public-sample" : null;
    r.idleExit = Number.isInteger(r.observedPid) ? await s.ledger.waitExit(r.observedPid, "idle-expiry", PROBE.idleExpiryObserveMs, PROBE.pidPollMs) : "no-public-pid";
    if (r.idleExit === "ESRCH") r.statusPidCleared = await waitStatusPidCleared(short, s.handle, s.ledger, PROBE.idleExpiryObserveMs, PROBE.pidPollMs);
    try {
      // Attach the normal-TTL shared client to the same record; never close to induce expiry.
      const ensured = await ensureWithSampling(target, { sessionKey: s.sessionKey, agent: AGENT_ID, mode: "persistent", cwd: dirs.cwd }, s.ledger);
      r.attachedIdentity = { acpxRecordId: ensured.handle.acpxRecordId ?? ensured.post.acpxRecordId, backendSessionId: ensured.handle.backendSessionId ?? ensured.post.backendSessionId };
      r.sameIdentity = r.attachedIdentity.acpxRecordId === s.identity.acpxRecordId && r.attachedIdentity.backendSessionId === s.identity.backendSessionId;
      r.attached = r.sameIdentity;
      if (r.attached) {
        s.handle = ensured.handle;
        s.runtime = "normal";
      }
    } catch (error) {
      r.attached = false;
      r.error = error?.code ?? "error";
    }
    r.endedAt = clock.iso();
    return r;
  };

  try {
    await Promise.all(sessions.map(runSession));
  } catch (error) {
    process.stderr.write(`soak fault (not retained): ${error?.stack ?? error}\n`);
    ev.fault = { name: error?.name ?? "Error", code: error?.code ?? null, at: clock.iso() };
    stop(`trial-code-or-runtime-fault:${ev.fault.name}${ev.fault.code ? `:${ev.fault.code}` : ""}`);
  }
  // Planned-restore evidence completes with the first post-restore request window.
  for (const s of sessions) for (const r of s.restores) {
    const first = s.requests.find((q) => q.expectation === r.beforeExpectation && q.attempt === 1);
    r.firstRequest = first?.requestId ?? null;
    r.sessionNew = first?.window?.rpc?.sessionNew ?? null;
    r.resume = (first?.window?.rpc?.sessionResume ?? []).map((x) => ({ sameId: x.sessionId === s.identity.backendSessionId, ok: x.ok ?? null }));
    r.outcome = classifyRestore({ identity: s.identity, attachedIdentity: r.attachedIdentity, idleExit: r.idleExit, resumes: first?.window?.rpc?.sessionResume ?? [], sessionNew: r.sessionNew });
    r.restored = r.outcome === "restored-same-id";
  }
  soak.contextIntegrity = contextIntegrity(sessions);

  // Disposal: observed close of each session on its current client, then shutdown.
  soak.disposalOrder = [];
  for (const s of sessions) {
    if (!s.handle) {
      s.close = { skipped: true, reason: "ensureSession failed; no handle to close" };
      continue;
    }
    s.close = await closeAndObserve({ runtime: s.runtime === "short" ? short : normal, handle: s.handle, ledger: s.ledger, reason: "t2 soak complete", boundMs: PROBE.postCloseObserveMs, pollMs: PROBE.pidPollMs });
    soak.disposalOrder.push(`close:s${s.index}`);
  }
  for (const [name, rt] of [["short", short], ["normal", normal]]) {
    const t0 = clock.mono();
    await rt.shutdown();
    soak.disposalOrder.push(`shutdown:${name}`);
    soak[`${name}ShutdownMs`] = clock.mono() - t0;
  }
  soak.detachLog = [...caps.short.detachLog, ...caps.normal.detachLog];
  for (const s of sessions) {
    delete s.handle;
    delete s.state;
    s.ledger = s.ledger.toJSON();
    s.cost = usageOf(s.ledger.samples, "costAmount");
    s.tokens = usageOf(s.ledger.samples, "totalTokens");
  }
  soak.endedAt = clock.iso();
  return soak;
}
