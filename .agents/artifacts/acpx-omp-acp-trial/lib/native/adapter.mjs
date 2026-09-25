// Shared native adapter: public acpx shared runtime handles, request/window
// correlation over public watchSession, diagnostic drain, public status PID
// sampling, supported cancel/close and read-only signal-0 disposal observation.
// No private acpx imports, process registry, supervisor or termination signal.
import { execFile } from "node:child_process";
import { performance } from "node:perf_hooks";
import { promisify } from "node:util";
import { createAgentRegistry } from "acpx/agent-registry";
import { createSharedAcpRuntime } from "acpx/runtime";
import { exportEvent } from "../evidence/export.mjs";
import { RUNTIME } from "./pins.mjs";
import { RequestWindow } from "./window.mjs";

const execFileP = promisify(execFile);
export const AGENT_ID = "omp-trial";

export const clock = {
  mono: () => Math.round(performance.now()),
  iso: () => new Date().toISOString(),
};

export function createTrialRuntime({ cwd, argv, ttlMs }) {
  const agentRegistry = createAgentRegistry({ overrides: { [AGENT_ID]: argv } });
  return createSharedAcpRuntime({
    cwd,
    agentRegistry,
    permissionMode: RUNTIME.permissionMode,
    nonInteractivePermissions: RUNTIME.nonInteractivePermissions,
    timeoutMs: RUNTIME.timeoutMs,
    ttlMs,
  });
}

const errCode = (error) => (error && typeof error === "object" ? error.code ?? error.name ?? "error" : "error");

/** Public status sample; the agent PID is read from the public `pid=` summary field. */
export async function sampleStatus(runtime, handle, point) {
  const sample = { point, at: clock.iso(), mono: clock.mono() };
  try {
    const status = await runtime.getStatus({ handle });
    const m = /(?:^|\s)pid=(\d+)(?:\s|$)/.exec(status.summary ?? "");
    sample.pid = m ? Number(m[1]) : null;
    sample.backendSessionId = status.backendSessionId ?? null;
    sample.acpxRecordId = status.acpxRecordId ?? null;
    sample.closed = status.details?.closed === true;
    sample.lastRequestId = status.lastRequestId ?? null;
    sample.currentModelId = typeof status.models?.currentModelId === "string" ? status.models.currentModelId : null;
    const usage = status.usage;
    sample.usage = {
      costAmount: typeof usage?.cost?.amount === "number" ? usage.cost.amount : null,
      costCurrency: typeof usage?.cost?.currency === "string" ? usage.cost.currency : null,
      totalTokens: typeof usage?.cumulative?.totalTokens === "number" ? usage.cumulative.totalTokens : null,
    };
  } catch (error) {
    sample.error = errCode(error);
  }
  return sample;
}

/** Read-only signal-0 observation. Only ESRCH proves absence; EPERM proves nothing. */
export function observePid(pid) {
  try {
    process.kill(pid, 0);
    return "present";
  } catch (error) {
    return error.code === "ESRCH" ? "ESRCH" : error.code === "EPERM" ? "EPERM" : `error:${error.code ?? "unknown"}`;
  }
}

/** Public OS command-line observation of a live agent PID (launch argv evidence). */
export async function observeArgv(pid) {
  try {
    const { stdout } = await execFileP("/bin/ps", ["-ww", "-o", "command=", "-p", String(pid)], { timeout: 5_000 });
    return { pid, command: stdout.trim() };
  } catch (error) {
    return { pid, error: errCode(error) };
  }
}

/**
 * Handle-local PID ledger: every positive public pid sample plus signal-0
 * observations. No generation registry or private lease inspection.
 */
export class PidLedger {
  constructor() {
    this.samples = [];
    this.pids = new Map(); // pid -> { firstPoint, observations: [] }
  }
  record(sample) {
    this.samples.push(sample);
    if (Number.isInteger(sample.pid) && sample.pid > 0 && !this.pids.has(sample.pid)) {
      this.pids.set(sample.pid, { pid: sample.pid, firstPoint: sample.point, observations: [] });
    }
  }
  observe(pid, point) {
    const result = observePid(pid);
    const entry = this.pids.get(pid);
    const obs = { point, at: clock.iso(), mono: clock.mono(), result };
    entry?.observations.push(obs);
    return result;
  }
  exited(pid) {
    return this.pids.get(pid)?.observations.some((o) => o.result === "ESRCH") ?? false;
  }
  async waitExit(pid, point, boundMs, pollMs) {
    const until = clock.mono() + boundMs;
    for (;;) {
      const r = this.observe(pid, point);
      if (r !== "present") return r;
      if (clock.mono() >= until) return r;
      await new Promise((res) => setTimeout(res, pollMs));
    }
  }
  toJSON() {
    return { samples: this.samples, pids: [...this.pids.values()] };
  }
}

/**
 * ensureSession plus public PID sampling of the ensure-time creation instance.
 * acpx writes the creating agent's pid into the session record while that
 * client is alive and clears it on close, so the record is polled through the
 * public findSession/getStatus API while ensureSession runs.
 */
export async function ensureWithSampling(runtime, input, ledger, pollMs = 10) {
  let done = false;
  const launchArgv = [];
  const ensured = runtime.ensureSession(input).finally(() => {
    done = true;
  });
  const poll = (async () => {
    const seen = new Set();
    while (!done) {
      try {
        const h = await runtime.findSession(input);
        if (h) {
          const s = await sampleStatus(runtime, h, "during-ensure");
          if (Number.isInteger(s.pid) && !seen.has(s.pid)) {
            seen.add(s.pid);
            ledger.record(s);
            launchArgv.push(await observeArgv(s.pid));
          }
        }
      } catch {
        // Record not yet readable; keep polling until ensureSession settles.
      }
      await new Promise((res) => setTimeout(res, pollMs));
    }
  })();
  let handle;
  try {
    handle = await ensured;
  } finally {
    await poll;
  }
  const post = await sampleStatus(runtime, handle, "post-ensure");
  ledger.record(post);
  return { handle, post, launchArgv };
}

/**
 * After an observed idle-expiry exit, waits (bounded) until public status no
 * longer reports a live agent pid, i.e. the expiring owner has checkpointed the
 * exit. Samples are recorded; nothing is signalled or terminated.
 */
export async function waitStatusPidCleared(runtime, handle, ledger, boundMs, pollMs) {
  const until = clock.mono() + boundMs;
  for (;;) {
    const s = await sampleStatus(runtime, handle, "idle-expiry-status");
    if (s.pid === null || s.pid === undefined) {
      ledger.samples.push(s);
      return { cleared: !s.error, error: s.error };
    }
    if (clock.mono() >= until) {
      ledger.record(s);
      return { cleared: false, lastPid: s.pid };
    }
    await new Promise((res) => setTimeout(res, pollMs));
  }
}
/**
 * Submits one request once and assembles its original journal window.
 * The drain of startTurn().events is diagnostics only; admission uses the window.
 */
export async function runRequest({ runtime, handle, ledger, requestId, text, cursor, knownRequestIds, deadlineMono, settleBoundMs = 30_000, argvProbe }) {
  const rec = {
    requestId,
    windowStartCursor: cursor ?? null,
    submittedAt: clock.iso(),
    submittedMono: clock.mono(),
    control: { cancelled: false, ceiling: false, revoked: false },
  };
  const win = new RequestWindow({ requestId, knownRequestIds });
  const watchAbort = new AbortController();
  let watchError;
  const watchDone = (async () => {
    try {
      for await (const ev of runtime.watchSession({ handle, cursor, signal: watchAbort.signal })) {
        if (win.accept(exportEvent(ev))) {
          rec.windowClosedMono = clock.mono();
          ledger.record(await sampleStatus(runtime, handle, `journal-settled:${requestId}`));
          break;
        }
      }
    } catch (error) {
      if (!watchAbort.signal.aborted) watchError = errCode(error);
    }
  })();

  const turn = runtime.startTurn({ handle, text, mode: "prompt", requestId, timeoutMs: RUNTIME.timeoutMs });
  const drain = (async () => {
    const counts = { events: 0, toolEvents: 0, textDeltas: 0 };
    try {
      for await (const e of turn.events) {
        counts.events++;
        if (e.type === "tool_call") counts.toolEvents++;
        if (e.type === "text_delta") counts.textDeltas++;
      }
    } catch (error) {
      counts.error = errCode(error);
    }
    return counts;
  })();
  const started = turn.promptStarted.then(
    async () => {
      rec.promptStartedMono = clock.mono();
      rec.promptStartedAt = clock.iso();
      const s = await sampleStatus(runtime, handle, `prompt-started:${requestId}`);
      ledger.record(s);
      if (argvProbe && Number.isInteger(s.pid)) rec.launchArgv ??= await observeArgv(s.pid);
    },
    (error) => {
      rec.promptStartFailure = errCode(error);
    },
  );

  const remaining = Math.max(0, deadlineMono - clock.mono());
  const timer = setTimeout(() => {
    rec.control.ceiling = true;
    rec.control.cancelled = true;
    turn.cancel({ reason: "trial wall ceiling" }).catch(() => {});
  }, remaining);
  let result;
  try {
    result = await turn.result;
  } catch (error) {
    result = { status: "failed", error: { code: errCode(error) } };
  } finally {
    clearTimeout(timer);
  }
  rec.turnResult = {
    status: result.status,
    stopReason: result.status === "failed" ? undefined : result.stopReason,
    errorCode: result.status === "failed" ? result.error?.code : undefined,
    errorDetailCode: result.status === "failed" ? result.error?.detailCode : undefined,
  };
  rec.turnSettledMono = clock.mono();
  rec.turnSettledAt = clock.iso();
  await started;
  // The journal's turn_result precedes turn.result settlement; this bound only
  // covers the observer catching up to the already-written marker.
  const bound = setTimeout(() => watchAbort.abort(), settleBoundMs);
  await watchDone;
  clearTimeout(bound);
  watchAbort.abort();
  rec.drain = await drain;
  if (watchError) rec.watchError = watchError;
  rec.window = {
    complete: win.state === "closed",
    startCursor: win.startCursor ?? null,
    endCursor: win.endCursor ?? null,
    duplicateCursorCount: win.duplicateCursorCount,
    nullTraffic: win.nullTraffic,
    otherKnown: win.otherKnown,
    unknownRequestIds: win.unknownRequestIds,
    anomalies: win.anomalies,
    rpc: win.rpc,
    usage: win.usage,
    events: win.events,
  };
  rec.firstCandidate = win.firstCandidate ?? null;
  rec.toolFacts = win.toolFacts();
  rec.win = win; // in-memory only; stripped before retention
  if (rec.promptStartedMono !== undefined) rec.promptToTerminalMs = rec.turnSettledMono - rec.promptStartedMono;
  rec.submitToTerminalMs = rec.turnSettledMono - rec.submittedMono;
  return rec;
}

/** Supported close + separate recorded-closed status + bounded post-return ESRCH observation. */
export async function closeAndObserve({ runtime, handle, ledger, reason, boundMs, pollMs }) {
  const out = { reason };
  ledger.record(await sampleStatus(runtime, handle, "pre-close"));
  out.closeInvokedAt = clock.iso();
  const t0 = clock.mono();
  try {
    await runtime.close({ handle, reason });
    out.closeResolved = true;
  } catch (error) {
    out.closeResolved = false;
    out.closeError = errCode(error);
  }
  const returned = clock.mono();
  out.closeReturnedAt = clock.iso();
  out.closeDurationMs = returned - t0;
  const post = await sampleStatus(runtime, handle, "post-close");
  out.recordedClosed = post.closed === true;
  out.postCloseStatusError = post.error;
  ledger.samples.push(post);
  out.pidResults = [];
  for (const entry of ledger.pids.values()) {
    if (ledger.exited(entry.pid)) {
      out.pidResults.push({ pid: entry.pid, result: "ESRCH", earlier: true });
      continue;
    }
    const remaining = Math.max(0, returned + boundMs - clock.mono());
    const r = await ledger.waitExit(entry.pid, "post-close", remaining, pollMs);
    out.pidResults.push({ pid: entry.pid, result: r, earlier: false, observedMsAfterReturn: clock.mono() - returned });
  }
  out.allPidsExited = ledger.pids.size > 0 && out.pidResults.every((p) => p.result === "ESRCH");
  out.pidCoverageNonEmpty = ledger.pids.size > 0;
  return out;
}
