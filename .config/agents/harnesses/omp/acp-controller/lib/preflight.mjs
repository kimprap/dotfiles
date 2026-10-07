// Run classes and request matching (spec-v3 §5 Q5; run survival §2–§3). One
// classifier gives every run folder one class (live, parked, finished,
// abandoned); a request matches runs by identity, then by target. Never
// signals (beyond signal-0 observation) or deletes.
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { observePid as defaultObservePid } from "./adapter.mjs";
import { initRootFor, privateRootFor, readOwnerClaim, readRunResult, RUN_PREFIX, sessionDirFor, SESSIONS_ROOT, TMP_ROOT } from "./env.mjs";
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

/** Canonical JSON: object keys sorted at every level, no whitespace, arrays and strings exact. */
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .filter((k) => value[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

/**
 * Request identity: lowercase sha256 of the command kind, a NUL and the
 * request's canonical JSON without `approval`; for `resume` the runId and a
 * NUL come before the canonical JSON.
 */
export function requestIdentity(kind, request, runId) {
  const { approval, ...meaning } = request;
  const prefix = kind === "resume" ? `${kind}\0${runId}\0` : `${kind}\0`;
  return createHash("sha256").update(`${prefix}${canonicalJson(meaning)}`).digest("hex");
}

/** What a run works on: `candidate.identity`, the canonical Retrace `table`, the normalize `root`, or the resumed runId. */
export function requestTarget(kind, request, runId) {
  if (kind === "reconcile") return request.candidate.identity;
  if (kind === "retrace") return canonicalJson(request.table);
  if (kind === "normalize") return request.root;
  return runId;
}

/** `run.json` facts of one run (`undefined` when missing or unreadable). */
const readRunJson = (dirs) => readJsonIfExists(dirs.record).catch(() => undefined);

/**
 * The run class of one run folder, checked in this order: `live` (the highest
 * claim's owner runs with the same start time); `parked` (phase `parked`,
 * `state.json` and a parked record with exit 1, owner gone, every recorded and
 * matched PID gone); `finished` (owner gone, phase not `parked`, a complete
 * record with exit 0 or 1, every PID gone); otherwise `abandoned`. Returns
 * `{ class, reason, owner, holder, presentPids, record, result }`: `owner` is
 * the claim holder's state and `record` the `run.json` contents.
 */
export async function classifyRun({ runId, tmpRoot = TMP_ROOT, processes = [], observePid = defaultObservePid, processStart: start = processStart }) {
  const dirs = privateRootFor(runId, tmpRoot);
  const holder = await readOwnerClaim(dirs.root);
  const owner = await ownerState(holder, { observePid, processStart: start });
  const record = await readRunJson(dirs);
  const result = await readRunResult(dirs);
  const facts = { owner, holder, record, result };
  if (owner === "live") return { class: "live", reason: "owner live", presentPids: [], ...facts };
  const recorded = Array.isArray(record?.pids) ? record.pids.filter((pid) => Number.isInteger(pid) && pid > 0) : [];
  const presentPids = [...new Set([...recorded.filter((pid) => observePid(pid) !== "ESRCH"), ...processes.map((p) => p.pid)])];
  const abandoned = (reason) => ({ class: "abandoned", reason, presentPids, ...facts });
  if (owner === "unknown") return abandoned(OWNER_UNREADABLE);
  const ownerReason = owner === "reused" ? "owner PID reused" : "owner gone";
  if (!holder || !record) return abandoned(`${ownerReason}; missing claim or \`run.json\``);
  if (result === null) return abandoned(`${ownerReason}; incomplete record`);
  if (record.phase === "parked") {
    if (!(await exists(dirs.state))) return abandoned(`${ownerReason}; no parked state`);
    if (presentPids.length) return abandoned(`${ownerReason}; live process without owner`);
    if (!result) return abandoned(`${ownerReason}; parked without a record`);
    if (result.exitCode !== 1) return abandoned(`${ownerReason}; cleanup not established`);
    return { class: "parked", reason: "parked", presentPids, ...facts };
  }
  if (!result) return abandoned(`${ownerReason}; ${holder.index > 0 ? "crashed after resume" : "no parked state"}`);
  if (presentPids.length) return abandoned(`${ownerReason}; live process without owner`);
  if (result.exitCode !== 0 && result.exitCode !== 1) return abandoned(`${ownerReason}; cleanup not established`);
  return { class: "finished", reason: "finished", presentPids, ...facts };
}

/**
 * Every controller run, classified. Residue is grouped by runId:
 * `<sessionsRoot>/acp-controller-<runId>` and `<tmpRoot>/acp-controller-<runId>`
 * folders and live processes whose command line contains ` acp ` and
 * `--session-dir <sessionsRoot>/acp-controller-<runId>`. A
 * `<tmpRoot>/.acp-controller-<runId>.init` setup leftover is its own entry: live
 * while its `claim-0` owner is live (still setting it up), otherwise abandoned
 * (`setup incomplete`, or `owner start time unreadable`).
 * Returns `[{ runId, class, reason, folders, processes, presentPids, record, result, owner, holder, dispose, setup? }]`.
 */
export async function scanRuns({ sessionsRoot = SESSIONS_ROOT, tmpRoot = TMP_ROOT, listProcesses: list = listProcesses, observePid = defaultObservePid, processStart: start = processStart } = {}) {
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
      const folders = [];
      for (const folder of [sessionDirFor(runId, sessionsRoot), privateRootFor(runId, tmpRoot).root]) if (await exists(folder)) folders.push(folder);
      runs.push({ runId, ...verdict, folders, processes: matched, dispose });
    }
    if (setupIds.has(runId)) {
      const root = initRootFor(runId, tmpRoot);
      const holder = await readOwnerClaim(root);
      const owner = await ownerState(holder, { observePid, processStart: start });
      const reason = owner === "live" ? "setting up" : owner === "unknown" ? OWNER_UNREADABLE : "setup incomplete";
      runs.push({ runId, class: owner === "live" ? "live" : "abandoned", reason, folders: [root], processes: [], presentPids: [], owner, holder, dispose, setup: true });
    }
  }
  return runs;
}

/** Abandoned runs only: they refuse every new run and `roles`. Returns `{ refuse, runs }`. */
export async function findAbandonedRuns(options = {}) {
  const runs = (await scanRuns(options)).filter((r) => r.class === "abandoned");
  return { refuse: runs.length > 0, runs };
}

/**
 * Matches a new-run request to scanned runs: by identity first, then by target
 * (same kind and target). Setup leftovers never match. Returns
 * `{ by: "identity" | "target" | null, runs }`; more than one run in `runs` is ambiguous.
 */
export function matchRequest(runs, { kind, identity, target }) {
  const candidates = runs.filter((r) => !r.setup && r.record);
  const byIdentity = candidates.filter((r) => Array.isArray(r.record.identities) && r.record.identities.includes(identity));
  if (byIdentity.length) return { by: "identity", runs: byIdentity };
  const byTarget = candidates.filter((r) => r.record.kind === kind && r.record.target !== undefined && r.record.target === target);
  return byTarget.length ? { by: "target", runs: byTarget } : { by: null, runs: [] };
}

/** The two ways to print a finished run's waiting record. */
export const printWays = (runId) => [`print its record: rerun the original request, or \`cli.mjs stop ${runId}\``];

const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });

/**
 * Spend so far as one line from `run.json` spend rows (Spend#toJSON shape),
 * with the `## Spend` totals rule: an unknown member makes a total `≥ <known sum> (unknown members)`.
 */
export function spendSoFar(rows) {
  const tokens = rows.map((r) => (r.tokensLast === null ? null : r.tokensBase + r.tokensLast));
  const costs = rows.map((r) => (r.costLast === null || !r.currency ? null : { amount: Number((r.costBase + r.costLast).toFixed(6)), currency: r.currency }));
  const total = (values, format) => {
    const known = values.filter((v) => v !== null);
    return known.length === values.length ? format(known) : `≥ ${format(known)} (unknown members)`;
  };
  const costText = (known) => {
    const by = new Map();
    for (const c of known) by.set(c.currency, Number(((by.get(c.currency) ?? 0) + c.amount).toFixed(6)));
    return by.size ? [...by].map(([cur, amount]) => `${grouped.format(amount)} ${cur}`).join(" + ") : "0";
  };
  return `${total(tokens, (k) => grouped.format(k.reduce((s, n) => s + n, 0)))} tokens, ${total(costs, costText)}`;
}

/** Refusal lines grouped per abandoned run (rendered as a nested bullet list). */
export function abandonedRunLines(runs) {
  return runs.map((r) => {
    const commands = new Map(r.processes.map((p) => [p.pid, p.command]));
    const spend = Array.isArray(r.record?.spend) ? [`spend so far: ${spendSoFar(r.record.spend)}`] : [];
    const rows = [
      `reason: ${r.reason}`,
      ...r.folders.map((f) => `folder \`${f}\``),
      ...r.presentPids.map((pid) => (commands.has(pid) ? `present PID ${pid}: \`${commands.get(pid)}\`` : `present PID ${pid}`)),
      ...spend,
      `dispose (only on the human's explicit instruction): \`${r.dispose}\``,
    ];
    return `run \`${r.runId}\`\n${rows.map((row) => `  - ${row}`).join("\n")}`;
  });
}

/** A run's start time from its runId stamp (`<kind>-<yyyymmddThhmmssZ>-<hex>`), ISO-8601. */
export function runStartedAt(runId) {
  const m = /-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z-/.exec(runId);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : "unknown";
}

/**
 * The `roles` run list (run survival §8): every live, parked or finished run
 * with its runId, kind, class, target, start time, worker PID while live and
 * spend so far. Empty when there is no such run. Reads only scanned facts.
 */
export function renderRunList(runs) {
  const shown = runs.filter((r) => !r.setup && ["live", "parked", "finished"].includes(r.class));
  if (!shown.length) return "";
  const line = (r) => {
    const fields = [
      r.record?.kind ?? r.runId.split("-")[0],
      r.class,
      `target \`${r.record?.target ?? "unknown"}\``,
      `started ${runStartedAt(r.runId)}`,
      ...(r.class === "live" ? [`worker PID ${r.holder.pid}`] : []),
      `spend so far: ${Array.isArray(r.record?.spend) ? spendSoFar(r.record.spend) : "unknown"}`,
    ];
    return `- \`${r.runId}\` · ${fields.join(" · ")}`;
  };
  return `\nController runs:\n\n${shown.map(line).join("\n")}\n`;
}
