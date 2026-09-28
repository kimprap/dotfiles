// Native adapter: public acpx shared runtime handles, request/window
// correlation over public watchSession, diagnostic drain, public status PID
// sampling, supported cancel/close/shutdown and read-only signal-0 disposal
// observation. No private acpx imports, process registry, supervisor or
// termination signal.
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { createAgentRegistry } from "acpx/agent-registry";
import { createSharedAcpRuntime } from "acpx/runtime";
import { exportEvent } from "./export.mjs";
import { RequestWindow } from "./window.mjs";

export const AGENT_ID = "omp-acp-controller";
export const CONTROLLER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OVERLAY_PATH = path.join(CONTROLLER_ROOT, "config", "omp-overlay.yml");
export const TOOLS = "read,glob,grep,yield";
export const FIXED_FLAGS = Object.freeze(["--no-extensions", "--no-skills", "--no-rules", "--no-lsp", "--no-title"]);

// No turn timeout (omitted timeoutMs) and no idle expiry (ttlMs 0); every
// handle is closed explicitly. Disposal is observed for 10 s after close returns.
export const RUNTIME = Object.freeze({
  permissionMode: "deny-all",
  nonInteractivePermissions: "deny",
  ttlMs: 0,
  postCloseObserveMs: 10_000,
  pidPollMs: 100,
});

export const clock = {
  mono: () => Math.round(performance.now()),
  iso: () => new Date().toISOString(),
};

/** Registry argv array for the resolved `omp`; never shell-composed. */
export function buildAgentArgv({ ompPath, model, thinking, sessionDir, overlayPath = OVERLAY_PATH }) {
  if (!path.isAbsolute(ompPath)) throw new Error(`omp path must be absolute: ${ompPath}`);
  return [
    ompPath, "acp",
    "--model", model,
    "--thinking", thinking,
    "--tools", TOOLS,
    ...FIXED_FLAGS,
    "--config", overlayPath,
    "--session-dir", sessionDir,
  ];
}

/**
 * One shared runtime per launch argv. Session creation/resumption sends the
 * runtime's default empty `mcpServers`; no top-level `mcpServers` option is passed.
 */
export function createRuntime({ cwd, argv }) {
  const agentRegistry = createAgentRegistry({ overrides: { [AGENT_ID]: argv } });
  return createSharedAcpRuntime({
    cwd,
    agentRegistry,
    permissionMode: RUNTIME.permissionMode,
    nonInteractivePermissions: RUNTIME.nonInteractivePermissions,
    ttlMs: RUNTIME.ttlMs,
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

/** Read-only signal-0 observation. Only ESRCH proves absence; EPERM proves nothing. Never signals. */
export function observePid(pid) {
  try {
    process.kill(pid, 0);
    return "present";
  } catch (error) {
    return error.code === "ESRCH" ? "ESRCH" : error.code === "EPERM" ? "EPERM" : `error:${error.code ?? "unknown"}`;
  }
}

/**
 * Handle-local PID ledger: every positive public pid sample plus signal-0
 * observations. No generation registry or private lease inspection. An
 * optional `onPid(pid)` hook hears each newly recorded PID.
 */
export class PidLedger {
  constructor(samples = [], pids = []) {
    this.samples = [...samples];
    this.pids = new Map(pids.map((p) => [p.pid, { ...p, observations: [...(p.observations ?? [])] }]));
  }
  static fromJSON(json) {
    return new PidLedger(json?.samples ?? [], json?.pids ?? []);
  }
  record(sample) {
    this.samples.push(sample);
    if (Number.isInteger(sample.pid) && sample.pid > 0 && !this.pids.has(sample.pid)) {
      this.pids.set(sample.pid, { pid: sample.pid, firstPoint: sample.point, observations: [] });
      this.onPid?.(sample.pid);
    }
  }
  observe(pid, point, observer = observePid) {
    const result = observer(pid);
    this.pids.get(pid)?.observations.push({ point, at: clock.iso(), mono: clock.mono(), result });
    return result;
  }
  exited(pid) {
    return this.pids.get(pid)?.observations.some((o) => o.result === "ESRCH") ?? false;
  }
  async waitExit(pid, point, boundMs, pollMs, observer = observePid) {
    const until = clock.mono() + boundMs;
    for (;;) {
      const r = this.observe(pid, point, observer);
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
 * client is alive, so the record is polled through the public
 * findSession/getStatus API while ensureSession runs. Pass `resumeSessionId`
 * in `input` for same-session restore; the caller compares identities.
 */
export async function ensureWithSampling(runtime, input, ledger, pollMs = 10) {
  let done = false;
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
  return { handle, post };
}

/**
 * Submits one request once and assembles its original journal window.
 * The drain of startTurn().events is diagnostics only; admission uses the
 * window. `signal` aborts the turn as an intentional controller cancellation.
 * `rec.win` is the in-memory window for lib/capture.mjs closeRequest.
 */
export async function runRequest({ runtime, handle, ledger, requestId, text, cursor, knownRequestIds, signal, settleBoundMs = 30_000 }) {
  const rec = {
    requestId,
    windowStartCursor: cursor ?? null,
    submittedAt: clock.iso(),
    submittedMono: clock.mono(),
    control: { cancelled: false, revoked: false },
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

  const turn = runtime.startTurn({ handle, text, mode: "prompt", requestId });
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
      ledger.record(await sampleStatus(runtime, handle, `prompt-started:${requestId}`));
    },
    (error) => {
      rec.promptStartFailure = errCode(error);
    },
  );

  const onAbort = () => {
    rec.control.cancelled = true;
    turn.cancel({ reason: "controller cancellation" }).catch(() => {});
  };
  if (signal?.aborted) onAbort();
  else signal?.addEventListener("abort", onAbort, { once: true });
  let result;
  try {
    result = await turn.result;
  } catch (error) {
    result = { status: "failed", error: { code: errCode(error) } };
  } finally {
    signal?.removeEventListener("abort", onAbort);
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
  };
  rec.firstCandidate = win.firstCandidate ?? null;
  rec.toolFacts = win.toolFacts();
  rec.win = win; // in-memory only
  return rec;
}

async function observeLedgerExit(ledger, returned, boundMs, pollMs, observer) {
  const results = [];
  for (const entry of ledger.pids.values()) {
    if (ledger.exited(entry.pid)) {
      results.push({ pid: entry.pid, result: "ESRCH", earlier: true });
      continue;
    }
    const remaining = Math.max(0, returned + boundMs - clock.mono());
    const r = await ledger.waitExit(entry.pid, "post-close", remaining, pollMs, observer);
    results.push({ pid: entry.pid, result: r, earlier: false, observedMsAfterReturn: clock.mono() - returned });
  }
  return results;
}

/**
 * Supported close + separate recorded-closed status + bounded post-return
 * ESRCH observation. `disposed` is true only when close resolved, status shows
 * `details.closed === true`, the PID set is non-empty and every PID showed
 * ESRCH. `observePid` may be injected; it is never a termination signal.
 */
export async function closeAndObserve({ runtime, handle, ledger, reason, boundMs = RUNTIME.postCloseObserveMs, pollMs = RUNTIME.pidPollMs, observePid: observer = observePid }) {
  const out = { reason };
  const pre = await sampleStatus(runtime, handle, "pre-close");
  ledger.record(pre);
  out.lastUsage = pre.usage ?? null;
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
  out.pidResults = await observeLedgerExit(ledger, returned, boundMs, pollMs, observer);
  out.pidCoverageNonEmpty = ledger.pids.size > 0;
  out.allPidsExited = out.pidCoverageNonEmpty && out.pidResults.every((p) => p.result === "ESRCH");
  out.disposed = out.closeResolved && out.recordedClosed && out.allPidsExited;
  return out;
}
