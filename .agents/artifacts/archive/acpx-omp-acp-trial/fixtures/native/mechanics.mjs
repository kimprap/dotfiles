#!/usr/bin/env node
// Offline adapter mechanics check against the scripted ACP agent (no model, no
// OMP). Runs under a private HOME/TMPDIR, exercises public acpx runtime paths
// used by the probe (window assembly, A1 rows, A7 exclusion, reuse, idle
// expiry, same-ID restore, close + signal-0) and removes its private root.
// Prints `MECHANICS PASS` or `MECHANICS FAIL: ...`. Mechanics-only evidence.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PidLedger, closeAndObserve, createTrialRuntime, runRequest, sampleStatus, clock, waitStatusPidCleared, ensureWithSampling } from "../../lib/native/adapter.mjs";
import { createPrivateRoot, removePrivateRoot, sanitizedEnv } from "../../lib/native/env.mjs";

const SELF = fileURLToPath(import.meta.url);
const AGENT = path.join(path.dirname(SELF), "scripted-agent.mjs");
const CANARY = "CANARY-SCRIPTED-OUTPUT-7f3a";

if (process.argv[2] !== "--child") {
  const dirs = await createPrivateRoot("mech");
  const code = await new Promise((resolve) => {
    const c = spawn(process.execPath, [SELF, "--child", dirs.root], { env: sanitizedEnv(dirs), stdio: "inherit" });
    c.on("exit", (x) => resolve(x ?? 1));
  });
  const removed = await removePrivateRoot(dirs);
  if (!removed.removed) {
    console.log("MECHANICS FAIL: private root not removed");
    process.exit(1);
  }
  process.exit(code);
}

const root = process.argv[3];
const cwd = path.join(root, "cwd");
const failures = [];
const expect = (cond, msg) => cond || failures.push(msg);
const argv = [process.execPath, AGENT];
const deadline = clock.mono() + 120_000;

async function drive(runtime, handle, ledger, st, text, kind) {
  const requestId = `mech-${st.n++}`;
  const rec = await runRequest({ runtime, handle, ledger, requestId, text, cursor: st.cursor, knownRequestIds: st.known, deadlineMono: deadline });
  st.known.add(requestId);
  const cls = rec.win.close(rec.control, kind);
  delete rec.win;
  if (rec.window.complete) st.cursor = rec.window.endCursor;
  return { rec, cls };
}

try {
  const normal = createTrialRuntime({ cwd, argv, ttlMs: 7_800_000 });
  const short = createTrialRuntime({ cwd, argv, ttlMs: 1_000 });
  const ln = new PidLedger();
  const ls = new PidLedger();
  const { handle: hn } = await ensureWithSampling(normal, { sessionKey: "mech-normal", agent: "omp-trial", mode: "persistent", cwd }, ln);
  const { handle: hs } = await ensureWithSampling(short, { sessionKey: "mech-short", agent: "omp-trial", mode: "persistent", cwd }, ls);
  ln.record(await sampleStatus(normal, hn, "post-ensure"));
  ls.record(await sampleStatus(short, hs, "post-ensure"));
  const sn = { n: 1, cursor: undefined, known: new Set() };
  const ss = { n: 100, cursor: undefined, known: new Set() };

  const cases = [
    ["SCRIPT:valid:probe-canary:sentence:Hello", "probe-canary", "candidate-valid"],
    ["SCRIPT:invalid:probe-reuse", "probe-reuse", "candidate-invalid"],
    ["SCRIPT:noresult", "probe-reuse", "completed-no-result"],
    ["SCRIPT:unfinished", "probe-reuse", "delivery-uncertain"],
    ["SCRIPT:twoyields:probe-reuse:token:a:TOK-2", "probe-reuse", "candidate-invalid"],
    ["SCRIPT:forbidden:probe-reuse:token:TOK-3", "probe-reuse", "candidate-valid"],
  ];
  const retained = [];
  let prevPid;
  for (const [text, kind, row] of cases) {
    const { rec, cls } = await drive(normal, hn, ln, sn, text, kind);
    retained.push(rec);
    expect(rec.window.complete, `${text}: window incomplete`);
    expect(cls.row === row, `${text}: row ${cls.row} != ${row}`);
    const pid = ln.samples.find((s) => s.point === `prompt-started:${rec.requestId}`)?.pid;
    expect(Number.isInteger(pid), `${text}: no prompt-started pid`);
    if (prevPid !== undefined) expect(pid === prevPid, `${text}: pid changed on reuse`);
    prevPid = pid;
    if (text.includes("forbidden")) {
      const f = rec.toolFacts.find((x) => x.acpKind === "execute");
      expect(f && !f.allowedByPolicy && f.terminalStatus === "failed", "forbidden attempt not recorded as failed disallowed");
    }
    if (text.startsWith("SCRIPT:valid")) expect(rec.firstCandidate?.data?.sentence === "Hello" && rec.firstCandidate.data.extraKeyCount === 1, "candidate projection wrong");
  }
  expect(!JSON.stringify(retained).includes(CANARY), "A7: canary string reached retained records");

  const e3 = await drive(short, hs, ls, ss, "SCRIPT:valid:probe-short:sentence:River", "probe-short");
  expect(e3.cls.row === "candidate-valid", `short row ${e3.cls.row}`);
  const pre = await sampleStatus(short, hs, "pre-idle-expiry");
  ls.record(pre);
  const idle = await ls.waitExit(pre.pid, "idle-expiry", 20_000, 100);
  expect(idle === "ESRCH", `idle expiry not observed (${idle})`);
  const t0 = clock.mono();
  const cleared = await waitStatusPidCleared(short, hs, ls, 20_000, 100);
  if (process.env.MECH_DEBUG) console.log("pid-cleared", cleared, clock.mono() - t0);
  expect(cleared.cleared, `status pid not cleared after idle expiry ${JSON.stringify(cleared)}`);
  const e4 = await drive(short, hs, ls, ss, "SCRIPT:valid:probe-restore:token:X", "probe-restore");
  expect(e4.cls.row === "candidate-valid", `restore row ${e4.cls.row} ${JSON.stringify({t:e4.rec.turnResult,d:e4.rec.drain,w:e4.rec.watchError,ps:e4.rec.promptStartFailure,st:e4.rec.windowStartCursor,ev:e4.rec.window.events.length,an:e4.rec.window.anomalies,u:e4.rec.window.unknownRequestIds})}`);
  expect(e4.rec.window.rpc.sessionResume.some((r) => r.sessionId === hs.backendSessionId && r.ok), "no successful same-ID session/resume in restore window");
  expect(e4.rec.window.rpc.sessionNew === 0, "fresh session/new in restore window");
  const newPid = ls.samples.find((s) => s.point === `prompt-started:${e4.rec.requestId}`)?.pid;
  expect(Number.isInteger(newPid) && newPid !== pre.pid, "restore did not use a new pid");

  // Creation instance coverage: the ensure-time agent must have a public PID
  // sample (taken while ensureSession runs) and an observed exit.
  for (const [n, l] of [["normal", ln], ["short", ls]]) {
    const creation = l.samples.find((x) => x.point === "during-ensure" && Number.isInteger(x.pid));
    expect(creation, `${n}: no public PID sample for the ensure-time creation instance`);
  }

  // Native-negative reproducer: agent rejects same-ID resume on the first turn.
  const failing = createTrialRuntime({ cwd, argv: [...argv, "--fail-resume"], ttlMs: 7_800_000 });
  const lf = new PidLedger();
  const { handle: hf } = await ensureWithSampling(failing, { sessionKey: "mech-fail", agent: "omp-trial", mode: "persistent", cwd }, lf);
  const sf = { n: 200, cursor: undefined, known: new Set() };
  const ef = await drive(failing, hf, lf, sf, "SCRIPT:valid:probe-canary:sentence:x", "probe-canary");
  expect(ef.cls.row === "turn-not-completed", `fail-resume row ${ef.cls.row}`);
  expect(ef.rec.turnResult.errorDetailCode === "SESSION_RESUME_REQUIRED", `fail-resume detail ${ef.rec.turnResult.errorDetailCode}`);
  expect(ef.rec.window.rpc.sessionResume.some((r) => r.ok === false), "fail-resume: rejected resume not in window");
  // Public-capture limitation (mechanics-only): pinned acpx persists the
  // connecting instance's pid only after a successful resume, so an instance
  // whose same-ID resume is rejected never appears in public status.
  expect(!lf.samples.some((x) => x.point !== "during-ensure" && Number.isInteger(x.pid)), "fail-resume: unexpected public PID for the rejected-resume instance");
  const cf = await closeAndObserve({ runtime: failing, handle: hf, ledger: lf, reason: "mech", boundMs: 10_000, pollMs: 100 });
  expect(cf.closeResolved && cf.recordedClosed, `fail-resume close: ${JSON.stringify(cf)}`);
  await failing.shutdown();

  const cn = await closeAndObserve({ runtime: normal, handle: hn, ledger: ln, reason: "mech", boundMs: 10_000, pollMs: 100 });
  const cs = await closeAndObserve({ runtime: short, handle: hs, ledger: ls, reason: "mech", boundMs: 10_000, pollMs: 100 });
  for (const [n, c] of [["normal", cn], ["short", cs]]) {
    expect(c.closeResolved && c.recordedClosed && c.allPidsExited, `${n} close: ${JSON.stringify(c)}`);
  }
  await normal.shutdown();
  await short.shutdown();
} catch (error) {
  failures.push(`exception: ${error?.stack ?? error}`);
}
const real = failures.filter(Boolean);
console.log(real.length ? `MECHANICS FAIL: ${real.join(" | ")}` : "MECHANICS PASS");
process.exit(real.length ? 1 : 0);
