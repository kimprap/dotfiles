// S0 environment: exact pins, private runtime roots, sanitized launch env and
// nonsecret provenance. Never reads credentials or the live store's contents.
import { execFile } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { sha256File, readJson } from "../evidence/io.mjs";
import {
  ACPX_PIN, BUNDLE_DIR, LIVE_CONFIG, LIVE_STORE, NODE_MIN, OMP_PIN, OVERLAY_PATH, REPO_ROOT, SDK_PIN,
} from "./pins.mjs";

const execFileP = promisify(execFile);

const PASS_THROUGH = ["LANG", "LC_ALL", "LC_CTYPE", "SSL_CERT_FILE", "SSL_CERT_DIR", "NODE_EXTRA_CA_CERTS"];

/** Creates the private runtime root outside the retained bundle (owner-only). */
export async function createPrivateRoot(label) {
  const root = path.join("/tmp", `acpx-${label}-${randomUUID()}`);
  await fs.mkdir(root, { mode: 0o700 });
  const dirs = { root, home: path.join(root, "home"), tmp: path.join(root, "tmp"), sessions: path.join(root, "sessions"), cwd: path.join(root, "cwd") };
  for (const d of [dirs.home, dirs.tmp, dirs.sessions, dirs.cwd]) await fs.mkdir(d, { mode: 0o700 });
  return dirs;
}

/** Launch environment: PATH, locale/TLS, private HOME/TMPDIR and the live store selector only. */
export function sanitizedEnv(dirs, source = process.env) {
  const env = {
    PATH: `${path.dirname(process.execPath)}:/usr/bin:/bin`,
    HOME: dirs.home,
    TMPDIR: dirs.tmp,
    PI_CODING_AGENT_DIR: LIVE_STORE,
  };
  for (const k of PASS_THROUGH) if (typeof source[k] === "string") env[k] = source[k];
  return env;
}

export function nodeVersionOk(version = process.versions.node) {
  const parts = version.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (parts[i] > NODE_MIN[i]) return true;
    if (parts[i] < NODE_MIN[i]) return false;
  }
  return true;
}

/** Exact toolchain pin observations. Any mismatch is pin drift (stop before model launch). */
export async function observePins(env) {
  const obs = { node: { version: process.versions.node, execPath: process.execPath, ok: nodeVersionOk() } };
  try {
    const st = await fs.stat(OMP_PIN.path);
    obs.omp = { path: OMP_PIN.path, bytes: st.size, sha256: await sha256File(OMP_PIN.path) };
    const { stdout } = await execFileP(OMP_PIN.path, ["--version"], { env, timeout: 30_000 });
    obs.omp.version = stdout.trim();
  } catch (error) {
    obs.omp = { path: OMP_PIN.path, error: error.code ?? "unavailable" };
  }
  obs.omp.ok = obs.omp.bytes === OMP_PIN.bytes && obs.omp.sha256 === OMP_PIN.sha256 && obs.omp.version === OMP_PIN.version;
  const lock = await readJson(path.join(BUNDLE_DIR, "package-lock.json"));
  const acpxPkg = await readJson(path.join(BUNDLE_DIR, "node_modules", "acpx", "package.json"));
  const sdkPkg = await readJson(path.join(BUNDLE_DIR, "node_modules", "@agentclientprotocol", "sdk", "package.json"));
  const sdkLocks = Object.entries(lock.packages).filter(([k]) => k.endsWith("node_modules/@agentclientprotocol/sdk")).map(([k, v]) => ({ at: k, version: v.version }));
  obs.acpx = {
    installed: acpxPkg.version,
    locked: lock.packages["node_modules/acpx"]?.version,
    lockedIntegrity: lock.packages["node_modules/acpx"]?.integrity,
  };
  obs.acpx.ok = obs.acpx.installed === ACPX_PIN.version && obs.acpx.locked === ACPX_PIN.version && obs.acpx.lockedIntegrity === ACPX_PIN.integrity;
  obs.sdk = { installed: sdkPkg.version, locks: sdkLocks };
  obs.sdk.ok = sdkPkg.version === SDK_PIN.version && sdkLocks.length === 1 && sdkLocks[0].version === SDK_PIN.version;
  obs.overlay = { path: path.relative(REPO_ROOT, OVERLAY_PATH), sha256: await sha256File(OVERLAY_PATH) };
  obs.ok = obs.node.ok && obs.omp.ok && obs.acpx.ok && obs.sdk.ok;
  return obs;
}

/** Live-store boundary: directory metadata only (never contents or credentials). */
export async function observeLiveStore() {
  try {
    const st = await fs.stat(LIVE_STORE);
    return { path: LIVE_STORE, isDirectory: st.isDirectory(), mode: (st.mode & 0o777).toString(8) };
  } catch (error) {
    return { path: LIVE_STORE, error: error.code ?? "unavailable" };
  }
}

/** Nonsecret live config provenance; runtime modelRoles are provenance only. */
export async function observeLiveConfig(env) {
  const out = {
    configPath: LIVE_CONFIG.path,
    configSha256: await sha256File(path.join(REPO_ROOT, LIVE_CONFIG.path)).catch(() => "unavailable"),
    expectedConfigSha256: LIVE_CONFIG.sha256,
    lifecyclePlugin: { path: LIVE_CONFIG.lifecyclePlugin, sha256: await sha256File(path.join(REPO_ROOT, LIVE_CONFIG.lifecyclePlugin)).catch(() => "unavailable") },
  };
  try {
    const { stdout } = await execFileP(OMP_PIN.path, ["config", "list", "--json"], { env, timeout: 30_000, maxBuffer: 8 << 20 });
    const parsed = JSON.parse(stdout);
    const roles = parsed?.modelRoles?.value;
    // Only the modelRoles map is extracted; the rest of the output is discarded unread.
    out.modelRoles = roles && typeof roles === "object" ? Object.fromEntries(Object.entries(roles).filter(([, v]) => typeof v === "string")) : "unavailable";
  } catch (error) {
    out.modelRoles = `unavailable:${error.code ?? "error"}`;
  }
  return out;
}

/**
 * acpx places queue sockets in /tmp/acpx-<sha256(HOME)[0..10]> (outside TMPDIR).
 * That directory is derived from the private HOME, so it is private runtime
 * storage owned by this run and is removed with the private root.
 */
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

export async function removePrivateRoot(dirs) {
  await fs.rm(dirs.root, { recursive: true, force: true });
  const socketDir = socketDirFor(dirs.home);
  const socketDirExisted = !(await gone(socketDir));
  await fs.rm(socketDir, { recursive: true, force: true });
  return { removed: (await gone(dirs.root)) && (await gone(socketDir)), socketDir, socketDirExisted };
}

/** OMP's cwd-derived live-store session folder name for a real (symlink-resolved) cwd. */
export function liveCwdFolderFor(realCwd) {
  return path.join(LIVE_STORE, "sessions", `--${realCwd.replace(/^\//, "").replace(/\//g, "-")}--`);
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
 * Live-store cleanup for trial-created session folders (spec-v9 launch section,
 * 2026-09-25 decision). Runs only after every published PID showed ESRCH and
 * never reads file contents: (1) delete `<ts>_<id>.jsonl` per recorded session
 * ID and its exact lock `.<ts>_<id>.jsonl.lock.os` when an empty regular file, (2) recursively delete only its same-name `<ts>_<id>/` folder, (3) rmdir
 * the run folder and then the run's cwd-named folder, (4) keep and report
 * anything else. `sessionDir` null means the run used a private session dir
 * (rule 5): only the cwd-named folder is considered.
 */
export async function cleanupLiveSessionFolders({ sessionDir, sessionIds, realCwd }) {
  const out = { sessionDir, sessionIds: [...sessionIds], deleted: [], kept: [], folders: [] };
  const liveSessions = path.join(LIVE_STORE, "sessions");
  if (sessionDir !== null) {
    if (path.dirname(sessionDir) !== liveSessions || !path.basename(sessionDir).startsWith("acpx-trial-")) throw new Error(`refusing live cleanup outside sessions/acpx-trial-*: ${sessionDir}`);
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
        // Exact OMP lock for a recorded session: only an empty regular file.
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
  }
  if (realCwd) out.folders.push(await rmdirIfPresent(liveCwdFolderFor(realCwd)));
  out.complete = out.kept.length === 0 && out.folders.every((f) => f.result === "removed" || f.result === "absent");
  return out;
}
