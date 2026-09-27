#!/usr/bin/env node
// REPRO-1 (spec-v9 B4 cause `t1-session-location`): launcher session location.
// Process A runs ACP session/new and exits; process B runs session/load with the
// same ID. Both use the launcher's own settings: pinned argv from
// `buildAgentArgv("tiny", sessionDirFor(runId, dirs))`, the sanitized env and a
// private cwd. No session/prompt is ever sent. PASS iff the load succeeds and
// every started PID reaches ESRCH within the bound; FAIL otherwise.
// Writes runs/t1-repro-<stamp>-<hex>/{repro.json,accounting.json}; wall time
// counts in the probe/soak pool. Cleanup: rule 5 for a private session dir,
// rules 1–4 for a live-store `acpx-trial-<runId>` folder.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { ClientSideConnection, PROTOCOL_VERSION, ndJsonStream } from "@agentclientprotocol/sdk";
import { BUNDLE_DIR, LIVE_STORE, PROBE, buildAgentArgv, sessionDirFor } from "../../lib/native/pins.mjs";
import { cleanupLiveSessionFolders, createPrivateRoot, removePrivateRoot, sanitizedEnv } from "../../lib/native/env.mjs";
import { observePid } from "../../lib/native/adapter.mjs";

const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const runId = `t1-repro-${stamp()}-${randomBytes(3).toString("hex")}`;
const runDir = path.join(BUNDLE_DIR, "runs", runId);
const t0 = performance.now();
const startedAt = new Date().toISOString();

const dirs = await createPrivateRoot("t1repro");
const env = sanitizedEnv(dirs);
const realCwd = await fs.realpath(dirs.cwd);
const sessionDir = sessionDirFor(runId, dirs);
const argv = buildAgentArgv("tiny", sessionDir);
const liveSessions = path.join(LIVE_STORE, "sessions");
const out = { schema: "acpx-omp-acp-trial.t1-repro.v1", runId, cause: "t1-session-location", startedAt, argv, sessionDir, sessionDirInLiveStore: path.dirname(sessionDir) === liveSessions, processes: [], updates: {} };

async function waitEsrch(pid, boundMs) {
  const start = performance.now();
  for (;;) {
    const r = observePid(pid);
    if (r !== "present") return { pid, result: r, observedMs: Math.round(performance.now() - start) };
    if (performance.now() - start > boundMs) return { pid, result: "alive-after-bound", observedMs: Math.round(performance.now() - start) };
    await new Promise((res) => setTimeout(res, PROBE.pidPollMs));
  }
}

/** One agent process: initialize, run `body(conn)`, close stdin, observe exit. */
async function withAgent(label, body) {
  const child = spawn(argv[0], argv.slice(1), { env, cwd: dirs.cwd, stdio: ["pipe", "pipe", "ignore"] });
  const proc = { label, pid: child.pid };
  out.processes.push(proc);
  const client = {
    requestPermission: async () => ({ outcome: { outcome: "cancelled" } }),
    sessionUpdate: async (n) => {
      const k = n.update?.sessionUpdate ?? "unknown";
      out.updates[k] = (out.updates[k] ?? 0) + 1;
      if (k === "usage_update") out.usageReported = { used: n.update.used ?? null, cost: n.update.cost ?? null };
    },
  };
  const conn = new ClientSideConnection(() => client, ndJsonStream(Writable.toWeb(child.stdin), Readable.toWeb(child.stdout)));
  try {
    await conn.initialize({ protocolVersion: PROTOCOL_VERSION, clientCapabilities: {} });
    return await body(conn);
  } finally {
    const closedAt = performance.now();
    child.stdin.end();
    proc.exit = await waitEsrch(child.pid, PROBE.postCloseObserveMs);
    proc.exit.msAfterStdinClose = Math.round(performance.now() - closedAt);
  }
}

let sessionId;
try {
  await withAgent("A:new", async (conn) => {
    sessionId = (await conn.newSession({ cwd: dirs.cwd, mcpServers: [] })).sessionId;
  });
  out.sessionId = sessionId;
  out.load = await withAgent("B:load", async (conn) => {
    try {
      await conn.loadSession({ sessionId, cwd: dirs.cwd, mcpServers: [] });
      return { ok: true };
    } catch (error) {
      return { ok: false, code: error?.code ?? null, details: typeof error?.data?.details === "string" ? error.data.details : String(error?.message ?? error) };
    }
  });
} catch (error) {
  out.fault = { name: error?.name ?? "Error", code: error?.code ?? null, message: String(error?.message ?? error).slice(0, 300) };
}

const allExited = out.processes.length > 0 && out.processes.every((p) => p.exit?.result === "ESRCH");
out.allPidsExited = allExited;
if (allExited) {
  // Rule 5 (private session dir) or rules 1–4 (live-store run folder).
  out.cleanup = await cleanupLiveSessionFolders({ sessionDir: out.sessionDirInLiveStore ? sessionDir : null, sessionIds: sessionId ? [sessionId] : [], realCwd });
} else out.cleanup = { skipped: "not every started PID reached ESRCH; live-store folders retained" };
out.privateRootRemoval = await removePrivateRoot(dirs);
out.modelRequest = out.usageReported && (out.usageReported.used || out.usageReported.cost?.amount) ? "reported-usage" : "none-reported (no session/prompt sent)";
out.verdict = !out.fault && out.load?.ok === true && allExited && out.modelRequest.startsWith("none") ? "PASS" : "FAIL";
out.wallMs = Math.round(performance.now() - t0);
out.endedAt = new Date().toISOString();

await fs.mkdir(runDir, { recursive: true });
await fs.writeFile(path.join(runDir, "repro.json"), `${JSON.stringify(out, null, 2)}\n`);
await fs.writeFile(path.join(runDir, "accounting.json"), `${JSON.stringify({
  pool: "probe-soak", task: "T1", kind: "repro", startedAt, endedAt: out.endedAt, wallMs: out.wallMs, modelWork: false, countsTowardWall: true,
  cost: { amount: 0, currency: "USD", basis: "no session/prompt sent; no usage reported" },
}, null, 2)}\n`);
process.stdout.write(`RUN=${runDir}\nload=${JSON.stringify(out.load)} exits=${JSON.stringify(out.processes.map((p) => p.exit))} cleanup=${JSON.stringify(out.cleanup)}\nREPRO ${out.verdict}\n`);
process.exit(out.verdict === "PASS" ? 0 : 1);
