// Run identity, private runtime roots, sanitized child environment and
// live-store session-folder cleanup (spec-v3 §3.1, §3.3, §3.4). Never reads
// credentials or session file contents.
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const LIVE_AGENT_DIR = "/Users/kim/.omp/agent";
export const SESSIONS_ROOT = path.join(LIVE_AGENT_DIR, "sessions");
export const TMP_ROOT = "/tmp";
export const RUN_PREFIX = "acp-controller-";
export const RUN_KINDS = Object.freeze(["reconcile", "retrace", "normalize"]);
export const RUN_ID_PATTERN = /^(reconcile|retrace|normalize)-\d{8}T\d{6}Z-[0-9a-f]{6}$/;

const PASS_THROUGH = ["PATH", "LANG", "LC_ALL", "LC_CTYPE", "SSL_CERT_FILE", "SSL_CERT_DIR", "NODE_EXTRA_CA_CERTS"];

/** `<kind>-<UTC yyyymmddThhmmssZ>-<6 hex>`. */
export function newRunId(kind, now = new Date()) {
  if (!RUN_KINDS.includes(kind)) throw new Error(`unknown run kind ${kind}`);
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  return `${kind}-${stamp}-${randomBytes(3).toString("hex")}`;
}

/** Launcher `--session-dir`: a direct child of the live sessions folder (one level deeper fails to load). */
export function sessionDirFor(runId, sessionsRoot = SESSIONS_ROOT) {
  return path.join(sessionsRoot, `${RUN_PREFIX}${runId}`);
}

/**
 * Private root layout `<tmpRoot>/acp-controller-<runId>/{home,tmp,work,state.json,run.json,record.json,stop.json,claim-<n>}`:
 * `record` is `run.json` (owner-side run facts), `result` is `record.json` (the run's ending record and exit code),
 * `stop` is `stop.json` (a `stop` call's request to the run's worker).
 */
export function privateRootFor(runId, tmpRoot = TMP_ROOT) {
  const root = path.join(tmpRoot, `${RUN_PREFIX}${runId}`);
  return { root, home: path.join(root, "home"), tmp: path.join(root, "tmp"), work: path.join(root, "work"), state: path.join(root, "state.json"), record: path.join(root, "run.json"), result: path.join(root, "record.json"), stop: path.join(root, "stop.json") };
}

/** Setup folder `<tmpRoot>/.acp-controller-<runId>.init` a private root is built in before it is renamed into place. */
export function initRootFor(runId, tmpRoot = TMP_ROOT) {
  return path.join(tmpRoot, `.${RUN_PREFIX}${runId}.init`);
}

const CLAIM = /^claim-(\d+)$/;

/**
 * The run's owner: the holder in its highest-numbered `claim-<n>` file, as
 * `{ index, pid, lstart }` (fields undefined when that claim is unreadable).
 * `null` when the root or every claim is missing.
 */
export async function readOwnerClaim(root) {
  let names;
  try {
    names = await fs.readdir(root);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") return null;
    throw error;
  }
  const index = Math.max(-1, ...names.flatMap((n) => (CLAIM.test(n) ? [Number(CLAIM.exec(n)[1])] : [])));
  if (index < 0) return null;
  try {
    const holder = JSON.parse(await fs.readFile(path.join(root, `claim-${index}`), "utf8"));
    return { index, pid: holder.pid, lstart: holder.lstart };
  } catch {
    return { index, pid: undefined, lstart: undefined };
  }
}

/**
 * Publishes `claim-<index>` holding `{ pid, lstart }` whole: written to
 * `.claim-<index>.<hex>.tmp` (mode 0600), then hard-linked to its name, so no
 * reader sees a partial claim; the temp file is removed either way. `EEXIST`
 * means another claimant won.
 */
export async function writeClaim(root, index, owner) {
  const temp = path.join(root, `.claim-${index}.${randomBytes(4).toString("hex")}.tmp`);
  try {
    await fs.writeFile(temp, `${JSON.stringify({ pid: owner.pid, lstart: owner.lstart })}\n`, { flag: "wx", mode: 0o600 });
    await fs.link(temp, path.join(root, `claim-${index}`));
  } finally {
    await fs.rm(temp, { force: true });
  }
}

/** Atomic write inside the existing root: temp file plus rename (never recreates a removed root). */
async function writeAtomic(dirs, file, text) {
  const temp = path.join(dirs.root, `.${path.basename(file)}.${randomBytes(4).toString("hex")}.tmp`);
  await fs.writeFile(temp, text, { mode: 0o600 });
  await fs.rename(temp, file);
}

/** Atomic `run.json` rewrite `{runId, kind, phase, target, identities, pids, sessionIds, spend}`. */
export async function writeRunRecord(dirs, record) {
  await writeAtomic(dirs, dirs.record, `${JSON.stringify(record, null, 2)}\n`);
}

/** Atomic `record.json` write: the run's ending record and its exit code together. */
export async function writeRunResult(dirs, { exitCode, markdown }) {
  await writeAtomic(dirs, dirs.result, `${JSON.stringify({ exitCode, markdown })}\n`);
}

/**
 * The run's ending record `{ exitCode, markdown }`; `undefined` when there is
 * none and `null` when it exists but is not a complete record.
 */
export async function readRunResult(dirs) {
  let text;
  try {
    text = await fs.readFile(dirs.result, "utf8");
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") return undefined;
    return null;
  }
  try {
    const r = JSON.parse(text);
    return Number.isInteger(r?.exitCode) && typeof r.markdown === "string" ? { exitCode: r.exitCode, markdown: r.markdown } : null;
  } catch {
    return null;
  }
}

/** Removes the run's ending record (a resume that starts takes the run out of its parked record). */
export async function removeRunResult(dirs) {
  await fs.rm(dirs.result, { force: true });
}

/**
 * Writes the stop request into an existing run folder; never creates the folder.
 * Returns `written`, `exists` (already requested) or `missing` (no run folder).
 */
export async function writeStopRequest(dirs, at = new Date()) {
  try {
    await fs.writeFile(dirs.stop, `${JSON.stringify({ at: at.toISOString() })}\n`, { flag: "wx", mode: 0o600 });
    return "written";
  } catch (error) {
    if (error.code === "EEXIST") return "exists";
    if (error.code === "ENOENT" || error.code === "ENOTDIR") return "missing";
    throw error;
  }
}

/** Whether a stop request waits in the run folder. */
export async function hasStopRequest(dirs) {
  return !(await gone(dirs.stop));
}

/** Removes a stop request aimed at an earlier worker of the run (a resume that starts). */
export async function removeStopRequest(dirs) {
  await fs.rm(dirs.stop, { force: true });
}

/**
 * Creates a fresh owner-only private root. It is built as
 * `<tmpRoot>/.acp-controller-<runId>.init/` with `claim-0` (the owner, written
 * first) and `run.json` (`phase: "active"`, the request's target and identity
 * and an empty spend so far), then renamed into place, so no preflight sees a
 * root without an owner, target or identity. An existing root is an error.
 */
export async function createPrivateRoot(runId, tmpRoot = TMP_ROOT, { kind, owner, target, identity }) {
  const dirs = privateRootFor(runId, tmpRoot);
  const initRoot = initRootFor(runId, tmpRoot);
  const init = { root: initRoot, record: path.join(initRoot, "run.json") };
  await fs.mkdir(initRoot, { mode: 0o700 });
  await writeClaim(initRoot, 0, owner);
  for (const d of ["home", "tmp", "work"]) await fs.mkdir(path.join(initRoot, d), { mode: 0o700 });
  await writeRunRecord(init, { runId, kind, phase: "active", target, identities: [identity], pids: [], sessionIds: [], spend: [] });
  if (!(await gone(dirs.root))) throw Object.assign(new Error(`private root ${dirs.root} already exists`), { code: "EEXIST" });
  await fs.rename(initRoot, dirs.root);
  return dirs;
}

/** Child environment: PATH, locale/TLS, private HOME/TMPDIR and the live agent dir only. */
export function childEnv(dirs, source = process.env, agentDir = LIVE_AGENT_DIR) {
  const env = {
    PATH: `${path.dirname(process.execPath)}:/usr/bin:/bin`,
    HOME: dirs.home,
    TMPDIR: dirs.tmp,
    PI_CODING_AGENT_DIR: agentDir,
  };
  for (const k of PASS_THROUGH) if (typeof source[k] === "string") env[k] = source[k];
  return env;
}

/**
 * acpx spawns its queue owner and agents with this process's environment and
 * derives its store and sockets from `os.homedir()`, so the controller process
 * itself must run under the child environment before creating any runtime.
 * Replaces `process.env` in place; returns a function restoring the previous one.
 */
export function enterChildEnv(env) {
  const previous = { ...process.env };
  const replace = (next) => {
    for (const k of Object.keys(process.env)) if (!Object.hasOwn(next, k)) delete process.env[k];
    Object.assign(process.env, next);
  };
  replace(env);
  return () => replace(previous);
}

/** acpx queue sockets live in /tmp/acpx-<sha256(HOME)[0..10]>, outside TMPDIR. */
export function socketDirFor(home) {
  return path.join("/tmp", `acpx-${createHash("sha256").update(home).digest("hex").slice(0, 10)}`);
}

const gone = async (p) => {
  try {
    await fs.lstat(p);
    return false;
  } catch (error) {
    return error.code === "ENOENT";
  }
};

/** Removes the run's HOME-derived acpx socket folder. */
export async function removeSocketDir(dirs) {
  const socketDir = socketDirFor(dirs.home);
  await fs.rm(socketDir, { recursive: true, force: true });
  return { removed: await gone(socketDir), socketDir };
}

/** Removes the private root and its HOME-derived acpx socket folder. */
export async function removePrivateRoot(dirs) {
  if (!path.basename(dirs.root).startsWith(RUN_PREFIX)) throw new Error(`refusing to remove non-controller root ${dirs.root}`);
  await fs.rm(dirs.root, { recursive: true, force: true });
  const socket = await removeSocketDir(dirs);
  return { removed: (await gone(dirs.root)) && socket.removed, root: dirs.root, socketDir: socket.socketDir };
}

/** OMP's cwd-derived session folder name for a real (symlink-resolved) cwd. */
export function liveCwdFolderFor(realCwd, sessionsRoot = SESSIONS_ROOT) {
  return path.join(sessionsRoot, `--${realCwd.replace(/^\//, "").replace(/\//g, "-")}--`);
}

/** rmdir only; a missing folder is fine, a non-empty one is kept and reported. */
async function rmdirIfPresent(dir) {
  try {
    await fs.rmdir(dir);
    return { path: dir, result: "removed" };
  } catch (error) {
    if (error.code === "ENOENT") return { path: dir, result: "absent" };
    const entries = await fs.readdir(dir).catch(() => []);
    return { path: dir, result: `kept:${error.code}`, entries };
  }
}

/** OMP's empty per-session lock markers: the publish lock and the ownership lease. */
const SESSION_LOCK_SUFFIXES = Object.freeze([".jsonl.lock.os", ".jsonl.owner.lock"]);

/**
 * Runs only after every published PID showed ESRCH and never reads file
 * contents: (1) delete `<ts>_<id>.jsonl` per recorded session ID and its exact
 * locks `.<ts>_<id>.jsonl.lock.os` and `.<ts>_<id>.jsonl.owner.lock` only when
 * each is an empty regular file, (2) recursively delete only its same-name
 * `<ts>_<id>/` folder, (3) rmdir the run folder and then the run's cwd-named
 * folder, (4) keep and report anything else. `complete` is true only when
 * nothing was kept.
 */
export async function cleanupLiveSessionFolders({ sessionDir, sessionIds, realCwd, sessionsRoot = SESSIONS_ROOT }) {
  const out = { sessionDir, sessionIds: [...sessionIds], deleted: [], kept: [], folders: [] };
  if (path.dirname(sessionDir) !== sessionsRoot || !path.basename(sessionDir).startsWith(RUN_PREFIX)) {
    throw new Error(`refusing live cleanup outside ${sessionsRoot}/${RUN_PREFIX}*: ${sessionDir}`);
  }
  const names = await fs.readdir(sessionDir).catch((error) => (error.code === "ENOENT" ? [] : Promise.reject(error)));
  for (const name of names) {
    const full = path.join(sessionDir, name);
    const lock = name.startsWith(".") && SESSION_LOCK_SUFFIXES.find((suffix) => name.endsWith(suffix));
    const id = sessionIds.find((sid) => name.endsWith(`_${sid}.jsonl`) || name.endsWith(`_${sid}`) || (lock && name.endsWith(`_${sid}${lock}`)));
    if (!id) {
      out.kept.push(name);
      continue;
    }
    const st = await fs.lstat(full);
    if (lock) {
      if (!(st.isFile() && st.size === 0)) {
        out.kept.push(name);
        continue;
      }
      await fs.unlink(full);
    } else if (name.endsWith(".jsonl") && st.isFile()) await fs.unlink(full);
    else if (!name.endsWith(".jsonl") && st.isDirectory()) await fs.rm(full, { recursive: true });
    else {
      out.kept.push(name);
      continue;
    }
    out.deleted.push(name);
  }
  out.folders.push(await rmdirIfPresent(sessionDir));
  if (realCwd) out.folders.push(await rmdirIfPresent(liveCwdFolderFor(realCwd, sessionsRoot)));
  out.complete = out.kept.length === 0 && out.folders.every((f) => f.result === "removed" || f.result === "absent");
  return out;
}
