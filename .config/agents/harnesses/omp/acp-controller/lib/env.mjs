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

/** Private root layout `<tmpRoot>/acp-controller-<runId>/{home,tmp,work,state.json}`. */
export function privateRootFor(runId, tmpRoot = TMP_ROOT) {
  const root = path.join(tmpRoot, `${RUN_PREFIX}${runId}`);
  return { root, home: path.join(root, "home"), tmp: path.join(root, "tmp"), work: path.join(root, "work"), state: path.join(root, "state.json") };
}

/** Creates a fresh owner-only private root; an existing root is an error. */
export async function createPrivateRoot(runId, tmpRoot = TMP_ROOT) {
  const dirs = privateRootFor(runId, tmpRoot);
  await fs.mkdir(dirs.root, { mode: 0o700 });
  for (const d of [dirs.home, dirs.tmp, dirs.work]) await fs.mkdir(d, { mode: 0o700 });
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

/** Removes the private root and its HOME-derived acpx socket folder. */
export async function removePrivateRoot(dirs) {
  if (!path.basename(dirs.root).startsWith(RUN_PREFIX)) throw new Error(`refusing to remove non-controller root ${dirs.root}`);
  await fs.rm(dirs.root, { recursive: true, force: true });
  const socketDir = socketDirFor(dirs.home);
  await fs.rm(socketDir, { recursive: true, force: true });
  return { removed: (await gone(dirs.root)) && (await gone(socketDir)), root: dirs.root, socketDir };
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

/**
 * Runs only after every published PID showed ESRCH and never reads file
 * contents: (1) delete `<ts>_<id>.jsonl` per recorded session ID and its exact
 * lock `.<ts>_<id>.jsonl.lock.os` only when that is an empty regular file,
 * (2) recursively delete only its same-name `<ts>_<id>/` folder, (3) rmdir the
 * run folder and then the run's cwd-named folder, (4) keep and report anything
 * else. `complete` is true only when nothing was kept.
 */
export async function cleanupLiveSessionFolders({ sessionDir, sessionIds, realCwd, sessionsRoot = SESSIONS_ROOT }) {
  const out = { sessionDir, sessionIds: [...sessionIds], deleted: [], kept: [], folders: [] };
  if (path.dirname(sessionDir) !== sessionsRoot || !path.basename(sessionDir).startsWith(RUN_PREFIX)) {
    throw new Error(`refusing live cleanup outside ${sessionsRoot}/${RUN_PREFIX}*: ${sessionDir}`);
  }
  const names = await fs.readdir(sessionDir).catch((error) => (error.code === "ENOENT" ? [] : Promise.reject(error)));
  for (const name of names) {
    const full = path.join(sessionDir, name);
    const id = sessionIds.find((sid) => name.endsWith(`_${sid}.jsonl`) || name.endsWith(`_${sid}`) || (name.startsWith(".") && name.endsWith(`_${sid}.jsonl.lock.os`)));
    if (!id) {
      out.kept.push(name);
      continue;
    }
    const st = await fs.lstat(full);
    if (name.endsWith(".jsonl.lock.os")) {
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
