// Abandoned-run preflight (spec-v3 §5 Q5). Groups controller residue per run
// and refuses only on abandoned runs; live-owner and parked runs of other
// sessions are ignored. Never signals (beyond signal-0 observation) or deletes.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { observePid as defaultObservePid } from "./adapter.mjs";
import { initRootFor, privateRootFor, readOwnerClaim, RUN_PREFIX, sessionDirFor, SESSIONS_ROOT, TMP_ROOT } from "./env.mjs";
import { exists, readJsonIfExists } from "./io.mjs";

const execFileP = promisify(execFile);

/** Every process as `{ pid, command }` (`ps -A -ww -o pid=,command=`). */
export async function listProcesses() {
  const { stdout } = await execFileP("/bin/ps", ["-A", "-ww", "-o", "pid=,command="], { maxBuffer: 64 << 20, timeout: 30_000 });
  return stdout.split("\n").flatMap((line) => {
    const m = /^\s*(\d+)\s+(.*)$/.exec(line);
    return m ? [{ pid: Number(m[1]), command: m[2] }] : [];
  });
}

/** Environment of every start-time read: one format for every caller, whatever its own `TZ` or locale. */
const START_ENV = Object.freeze({ LC_ALL: "C", TZ: "UTC" });

/** A process's start time (`ps -o lstart= -p <pid>` under `LC_ALL=C TZ=UTC`); `null` when it cannot be read. */
export async function processStart(pid) {
  try {
    const { stdout } = await execFileP("/bin/ps", ["-o", "lstart=", "-p", String(pid)], { env: START_ENV, timeout: 30_000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

/** This process as a claim holder `{ pid, lstart }` (`lstart` null when unreadable; such a holder is never written). */
export async function selfOwner(start = processStart) {
  return { pid: process.pid, lstart: await start(process.pid) };
}

/** Preflight reason and refusal title for an owner whose PID is present but whose start time cannot be compared. */
export const OWNER_UNREADABLE = "owner start time unreadable";

/** Refusal title when this process's own start time cannot be read, so it may write no claim. */
export const OWN_START_UNREADABLE = "own start time unreadable";

/** Refusal line for `OWN_START_UNREADABLE`. */
export const ownStartReason = (pid) => `this controller's start time (PID ${pid}) cannot be read, so it writes no run claim; nothing was created or changed`;

/**
 * Owner state of a claim holder, in this order: `gone` (no holder, no valid
 * PID, or ESRCH, whatever the recorded start); `unknown` (PID present but its
 * current or recorded start time is empty or unreadable); `live` (starts
 * equal) or `reused` (starts differ).
 */
export async function ownerState(holder, { observePid = defaultObservePid, processStart: start = processStart } = {}) {
  if (!holder || !Number.isInteger(holder.pid) || holder.pid <= 0) return "gone";
  if (observePid(holder.pid) === "ESRCH") return "gone";
  if (typeof holder.lstart !== "string" || holder.lstart === "") return "unknown";
  const current = await start(holder.pid);
  if (!current) return "unknown";
  return current === holder.lstart ? "live" : "reused";
}

/** The runId of a live ` acp ` process whose `--session-dir` is a controller folder, else `undefined`. */
function processRunId(command, sessionsRoot) {
  if (!command.includes(" acp ")) return undefined;
  const marker = `--session-dir ${path.join(sessionsRoot, RUN_PREFIX)}`;
  const at = command.indexOf(marker);
  if (at < 0) return undefined;
  return /^\S+/.exec(command.slice(at + marker.length))?.[0];
}

/** Live ` acp ` processes whose `--session-dir` is exactly this run's folder. */
export function processesForRun(processes, runId, sessionsRoot = SESSIONS_ROOT) {
  return processes.filter((p) => p.pid !== process.pid && processRunId(p.command, sessionsRoot) === runId).map((p) => ({ pid: p.pid, command: p.command }));
}

async function dirNames(root) {
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

const runIdsOf = (names) => names.filter((n) => n.startsWith(RUN_PREFIX)).map((n) => n.slice(RUN_PREFIX.length));
const SETUP_DIR = new RegExp(`^\\.${RUN_PREFIX}(.+)\\.init$`);

/**
 * Classifies one run from its highest claim, `run.json`, `state.json`, recorded
 * PIDs and matched processes. Returns `{ class: "live" | "parked" | "abandoned", reason, presentPids }`.
 */
async function classifyRun({ runId, tmpRoot = TMP_ROOT, processes = [], observePid = defaultObservePid, processStart: start = processStart }) {
  const dirs = privateRootFor(runId, tmpRoot);
  const claim = await readOwnerClaim(dirs.root);
  const owner = await ownerState(claim, { observePid, processStart: start });
  if (owner === "live") return { class: "live", reason: "owner live", presentPids: [] };
  const record = await readJsonIfExists(dirs.record).catch(() => undefined);
  const recorded = Array.isArray(record?.pids) ? record.pids.filter((pid) => Number.isInteger(pid) && pid > 0) : [];
  const presentPids = [...new Set([...recorded.filter((pid) => observePid(pid) !== "ESRCH"), ...processes.map((p) => p.pid)])];
  if (owner === "unknown") return { class: "abandoned", reason: OWNER_UNREADABLE, presentPids };
  const ownerReason = owner === "reused" ? "owner PID reused" : "owner gone";
  if (!claim || !record) return { class: "abandoned", reason: `${ownerReason}; missing claim or \`run.json\``, presentPids };
  if (record.phase === "parked") {
    if (!(await exists(dirs.state))) return { class: "abandoned", reason: `${ownerReason}; no parked state`, presentPids };
    if (presentPids.length) return { class: "abandoned", reason: `${ownerReason}; live process without owner`, presentPids };
    return { class: "parked", reason: "parked", presentPids };
  }
  return { class: "abandoned", reason: `${ownerReason}; ${claim.index > 0 ? "crashed after resume" : "no parked state"}`, presentPids };
}

/**
 * Abandoned controller runs for a new run's preflight. Residue is grouped by
 * runId: `<sessionsRoot>/acp-controller-<runId>` and `<tmpRoot>/acp-controller-<runId>`
 * folders and live processes whose command line contains ` acp ` and
 * `--session-dir <sessionsRoot>/acp-controller-<runId>`. Live-owner and parked
 * runs are not listed. A `<tmpRoot>/.acp-controller-<runId>.init` setup
 * leftover is listed on its own (`setup incomplete`, or `owner start time
 * unreadable`) unless its `claim-0` owner is live, i.e. still setting it up.
 * Returns `{ refuse, runs: [{ runId, reason, folders, processes, presentPids, dispose }] }`.
 */
export async function findAbandonedRuns({ sessionsRoot = SESSIONS_ROOT, tmpRoot = TMP_ROOT, listProcesses: list = listProcesses, observePid = defaultObservePid, processStart: start = processStart } = {}) {
  const processes = await list();
  const tmpNames = await dirNames(tmpRoot);
  const ids = new Set([...runIdsOf(await dirNames(sessionsRoot)), ...runIdsOf(tmpNames)]);
  for (const p of processes) {
    const id = p.pid !== process.pid ? processRunId(p.command, sessionsRoot) : undefined;
    if (id) ids.add(id);
  }
  const setupIds = new Set(tmpNames.flatMap((n) => SETUP_DIR.exec(n)?.slice(1, 2) ?? []));
  const runs = [];
  for (const runId of [...new Set([...ids, ...setupIds])].sort()) {
    const dispose = `cli.mjs dispose ${runId}`;
    if (ids.has(runId)) {
      const matched = processesForRun(processes, runId, sessionsRoot);
      const verdict = await classifyRun({ runId, tmpRoot, processes: matched, observePid, processStart: start });
      if (verdict.class === "abandoned") {
        const folders = [];
        for (const folder of [sessionDirFor(runId, sessionsRoot), privateRootFor(runId, tmpRoot).root]) if (await exists(folder)) folders.push(folder);
        runs.push({ runId, reason: verdict.reason, folders, processes: matched, presentPids: verdict.presentPids, dispose });
      }
    }
    if (setupIds.has(runId)) {
      const root = initRootFor(runId, tmpRoot);
      const owner = await ownerState(await readOwnerClaim(root), { observePid, processStart: start });
      if (owner !== "live") runs.push({ runId, reason: owner === "unknown" ? OWNER_UNREADABLE : "setup incomplete", folders: [root], processes: [], presentPids: [], dispose });
    }
  }
  return { refuse: runs.length > 0, runs };
}

/** Refusal lines grouped per abandoned run (rendered as a nested bullet list). */
export function abandonedRunLines(runs) {
  return runs.map((r) => {
    const commands = new Map(r.processes.map((p) => [p.pid, p.command]));
    const rows = [
      `reason: ${r.reason}`,
      ...r.folders.map((f) => `folder \`${f}\``),
      ...r.presentPids.map((pid) => (commands.has(pid) ? `present PID ${pid}: \`${commands.get(pid)}\`` : `present PID ${pid}`)),
      `dispose (only on the human's explicit instruction): \`${r.dispose}\``,
    ];
    return `run \`${r.runId}\`\n${rows.map((row) => `  - ${row}`).join("\n")}`;
  });
}
