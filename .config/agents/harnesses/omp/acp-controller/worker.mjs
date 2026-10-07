#!/usr/bin/env node
// Detached run worker (run survival §1). `cli.mjs` runs every preflight in
// the calling process, then hands the run to one worker process:
//   node worker.mjs helper           reads the payload on stdin, starts the worker
//                                    detached (own session and process group),
//                                    passes the payload on, prints its PID, exits
//   node worker.mjs worker <helper>  reads the payload on stdin, waits until its
//                                    parent is no longer the helper (it was
//                                    reparented), then runs the command
// The worker creates nothing before that parent change: its first action is
// the run folder with claim, identity and target (`openRun`), or for `resume`
// the recheck and claim n+1 (`resumeReconcile`). It writes the run's record
// into the run folder and exits; it never writes to the caller.
//
// The payload is JSON: `{ command, runId, request, deps, hold? }`. `deps` holds only
// data (models, prompts, roots, environment); process observers are the
// defaults in a real worker and are injected only in-process (`runWorker`).
// `hold` exists only when a test injects it: `{ at: "helper" | "worker", ready,
// release }` holds the hand-off at that point (the helper with its worker
// started, or the worker after its parent changed) by writing the `ready` file
// and waiting for the `release` file. It never changes the order above.
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SELF = fileURLToPath(import.meta.url);
const HANDOFF_POLL_MS = 10;

/** The run commands; each runs the controller body for one request. */
export const RUNNERS = Object.freeze({
  reconcile: (c, req, deps) => c.runReconcile(req, deps),
  retrace: (c, req, deps) => c.runRetrace(req, deps),
  normalize: (c, req, deps) => c.runNormalize(req, deps),
  resume: (c, req, deps, runId) => c.resumeReconcile(runId, req, deps),
});

/**
 * Runs one handed-off command in this process. `injected` carries
 * `observePid`, `processStart`, `listProcesses` and `log` when they cannot
 * cross the hand-off as data (the offline suite's in-process worker).
 * Returns the runner's result; the record that counts is the one in the run folder.
 */
export async function runWorker({ command, runId, request, deps }, injected = {}) {
  const controller = await import("./controller.mjs");
  return RUNNERS[command](controller, request, { log: () => {}, ...deps, ...injected, runId }, runId);
}

/**
 * Starts the worker through a helper that exits at once. Resolves `{ pid }`
 * (the worker's PID, reported by the helper before it exits); rejects when the
 * helper ends without one.
 */
export function launchWorker(payload) {
  return new Promise((resolve, reject) => {
    const helper = spawn(process.execPath, [SELF, "helper"], { stdio: ["pipe", "pipe", "inherit"] });
    let out = "";
    helper.stdout.setEncoding("utf8").on("data", (chunk) => {
      out += chunk;
    });
    helper.on("error", reject);
    helper.stdin.on("error", () => {});
    helper.on("close", (code, signal) => {
      const pid = Number(out.trim());
      if (Number.isInteger(pid) && pid > 0) resolve({ pid });
      else reject(new Error(`worker helper ended (${signal ?? `exit ${code}`}) without a worker PID`));
    });
    helper.stdin.end(JSON.stringify(payload));
  });
}

async function readAll(stream) {
  let text = "";
  for await (const chunk of stream) text += chunk;
  return text;
}

/** Test-only hold (see `hold` above): a no-op unless the payload's hold names this point. */
async function holdAt(point, hold) {
  if (hold?.at !== point) return;
  await fs.writeFile(hold.ready, "");
  for (;;) {
    try {
      await fs.access(hold.release);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, HANDOFF_POLL_MS));
    }
  }
}

async function helper() {
  const text = await readAll(process.stdin);
  const worker = spawn(process.execPath, [SELF, "worker", String(process.pid)], { detached: true, stdio: ["pipe", "ignore", "ignore"] });
  worker.unref();
  await new Promise((resolve, reject) => worker.stdin.end(text, (error) => (error ? reject(error) : resolve())));
  await holdAt("helper", JSON.parse(text).hold);
  process.stdout.write(`${worker.pid}\n`, () => process.exit(0));
}

async function worker(helperPid) {
  const payload = JSON.parse(await readAll(process.stdin));
  // The hand-off is confirmed when the parent is no longer the helper; nothing is created before.
  while (process.ppid === helperPid) await new Promise((resolve) => setTimeout(resolve, HANDOFF_POLL_MS));
  await holdAt("worker", payload.hold);
  await runWorker(payload);
}

if (process.argv[1] && (await fs.realpath(process.argv[1])) === SELF) {
  const [mode, helperPid] = process.argv.slice(2);
  try {
    if (mode === "helper") await helper();
    else if (mode === "worker") await worker(Number(helperPid));
  } catch {
    process.exitCode = 1;
  }
  // The worker owns no other work: it ends once its record is written (or it wrote nothing).
  if (mode === "worker") process.exit();
}
