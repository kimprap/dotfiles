// A3 exact public-acpx 2 MiB fixture run (mechanics-only; never a model).
// Route: public shared runtime ensureSession -> startTurn with concurrent
// diagnostic drain and watchSession -> ordinary close/status/disposal.
// `runLargeFixture()` launches an isolated child under a fresh private root
// /tmp/acpx-2m-<uuid> (HOME=root/home, cwd=root/cwd, npm_package_* unset) and
// returns its typed result; the child writes nothing outside that root except
// the returned JSON on stdout.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AGENT_ID, PidLedger, clock, closeAndObserve, createTrialRuntime, ensureWithSampling, runRequest } from "../native/adapter.mjs";
import { createPrivateRoot, removePrivateRoot, sanitizedEnv } from "../native/env.mjs";
import { BUNDLE_DIR, RUNTIME } from "../native/pins.mjs";
import { closeRequest, withCapture } from "./capture.mjs";

const SELF = fileURLToPath(import.meta.url);
export const LARGE = Object.freeze({
  SID: "fixture-2m",
  RID: "fixture-request",
  prompt: "large-payload",
  script: path.join(BUNDLE_DIR, "fixture-agent", "large.mjs"),
  bytes: 2097152,
  sha256: "9c9214717e58d8ceaf581255faab35c026e5d6b408a0a9df56169b7e247cfebf",
  prefix: "BEGIN-2M\n",
  suffix: "\nEND-2M\n",
  queueIpcLimit: 10_485_760,
  acpLineLimit: 67_108_864,
});

export async function runLargeFixture() {
  const dirs = await createPrivateRoot("2m");
  const env = sanitizedEnv(dirs);
  for (const k of Object.keys(env)) if (k.startsWith("npm_package_")) delete env[k];
  let stdout = "";
  const code = await new Promise((resolve) => {
    const c = spawn(process.execPath, [SELF, "--child", dirs.root], { env, cwd: dirs.cwd, stdio: ["ignore", "pipe", "inherit"] });
    c.stdout.on("data", (d) => (stdout += d));
    c.on("exit", (x) => resolve(x ?? 1));
  });
  const removal = await removePrivateRoot(dirs);
  let result;
  try {
    result = JSON.parse(stdout.trim().split("\n").at(-1));
  } catch {
    result = { error: "child produced no result" };
  }
  return { ...result, childExit: code, privateRoot: { pattern: "/tmp/acpx-2m-<uuid>", length: dirs.root.length, removed: removal.removed }, envNpmPackageKeys: Object.keys(env).filter((k) => k.startsWith("npm_package_")).length };
}

async function measureJournal(home) {
  const dir = path.join(home, ".acpx", "sessions");
  const out = [];
  for (const name of await fs.readdir(dir).catch(() => [])) {
    if (!name.endsWith(".ndjson")) continue;
    const buf = await fs.readFile(path.join(dir, name));
    // Sizes only; no content is retained.
    const lines = [];
    let start = 0;
    for (let i = 0; i < buf.length; i++) if (buf[i] === 10) {
      lines.push(i - start + 1);
      start = i + 1;
    }
    out.push({ file: name, bytes: buf.length, lines: lines.length, maxLineBytesInclLf: Math.max(0, ...lines) });
  }
  return out;
}

async function child(root) {
  const home = path.join(root, "home");
  const cwd = path.join(root, "cwd");
  const argv = ["node", LARGE.script];
  const out = { registryArgv: argv, renderedCommandBytes: Buffer.byteLength(argv.join(" ")), scriptPathBytes: Buffer.byteLength(LARGE.script), homeBytes: Buffer.byteLength(home), cwdBytes: Buffer.byteLength(cwd) };
  const runtime = createTrialRuntime({ cwd, argv, ttlMs: RUNTIME.normalTtlMs });
  const cap = withCapture(runtime);
  const ledger = new PidLedger();
  let handle;
  try {
    const ensured = await ensureWithSampling(runtime, { sessionKey: LARGE.SID, agent: AGENT_ID, mode: "persistent", cwd }, ledger);
    handle = ensured.handle;
    out.identity = { acpxRecordId: handle.acpxRecordId ?? ensured.post.acpxRecordId, backendSessionId: handle.backendSessionId ?? ensured.post.backendSessionId };
    const rec = await runRequest({ runtime: cap.runtime, handle, ledger, requestId: LARGE.RID, text: LARGE.prompt, cursor: undefined, knownRequestIds: new Set(), deadlineMono: clock.mono() + 120_000, settleBoundMs: 60_000 });
    const projection = rec.win.firstCandidate ? cap.captured.get(rec.win.firstCandidate.cursor) : undefined;
    const cls = closeRequest({ win: rec.win, control: rec.control, projection, phase: "transport-result", ctx: {} });
    out.turnResult = rec.turnResult;
    out.windowComplete = rec.window.complete;
    out.rpc = { initialize: rec.window.rpc.initialize, sessionNew: rec.window.rpc.sessionNew, sessionResume: rec.window.rpc.sessionResume.map((r) => ({ ok: r.ok, sessionId: r.sessionId })), prompt: rec.window.rpc.prompt };
    out.drain = rec.drain;
    out.row = cls.row;
    const p = projection?.payload;
    out.candidate = rec.win.firstCandidate ? { cursor: rec.win.firstCandidate.cursor, toolCallId: rec.win.firstCandidate.toolCallId, kind: projection?.kind } : null;
    if (typeof p === "string") {
      const b = Buffer.from(p, "utf8");
      out.payload = { bytes: b.length, sha256: createHash("sha256").update(b).digest("hex"), prefixOk: p.startsWith(LARGE.prefix), suffixOk: p.endsWith(LARGE.suffix), lf: (p.match(/\n/g) ?? []).length };
      out.retainedResultLineBytes = Buffer.byteLength(`${JSON.stringify({ kind: projection.kind, payload: p })}\n`);
    }
    out.journal = await measureJournal(home);
    out.limits = { queueIpc: LARGE.queueIpcLimit, acpLine: LARGE.acpLineLimit };
    out.close = await closeAndObserve({ runtime, handle, ledger, reason: "2m fixture complete", boundMs: 10_000, pollMs: 100 });
    await runtime.shutdown();
    out.pids = ledger.toJSON().pids.map((p) => ({ pid: p.pid, firstPoint: p.firstPoint }));
  } catch (error) {
    out.error = error?.code ?? error?.name ?? "error";
    out.errorMessage = String(error?.message ?? "").slice(0, 200);
  }
  process.stdout.write(`${JSON.stringify(out)}\n`);
}

if (process.argv[2] === "--child") await child(process.argv[3]);
