// Undisposed-run preflight (spec-v3 §5 Q5). Never signals, reads file
// contents, or deletes anything.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { RUN_PREFIX, SESSIONS_ROOT, TMP_ROOT } from "./env.mjs";

const execFileP = promisify(execFile);

/** Every process as `{ pid, command }` (`ps -A -ww -o pid=,command=`). */
export async function listProcesses() {
  const { stdout } = await execFileP("/bin/ps", ["-A", "-ww", "-o", "pid=,command="], { maxBuffer: 64 << 20, timeout: 30_000 });
  return stdout.split("\n").flatMap((line) => {
    const m = /^\s*(\d+)\s+(.*)$/.exec(line);
    return m ? [{ pid: Number(m[1]), command: m[2] }] : [];
  });
}

async function controllerDirs(root, except) {
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return entries
    .filter((e) => e.isDirectory() && e.name.startsWith(RUN_PREFIX) && e.name !== except)
    .map((e) => path.join(root, e.name))
    .sort();
}

/**
 * Lists undisposed controller runs: `<sessionsRoot>/acp-controller-*` and
 * `<tmpRoot>/acp-controller-*` directories and live processes whose command
 * line contains ` acp ` and `--session-dir <sessionsRoot>/acp-controller-`.
 * `exceptRunId` exempts exactly that run's two folders; a matching live
 * process still counts. Returns `{ refuse, folders, processes }`.
 */
export async function findUndisposedRuns({ sessionsRoot = SESSIONS_ROOT, tmpRoot = TMP_ROOT, listProcesses: list = listProcesses, exceptRunId } = {}) {
  const except = exceptRunId ? `${RUN_PREFIX}${exceptRunId}` : undefined;
  const folders = [...(await controllerDirs(sessionsRoot, except)), ...(await controllerDirs(tmpRoot, except))];
  const marker = `--session-dir ${path.join(sessionsRoot, RUN_PREFIX)}`;
  const processes = (await list())
    .filter((p) => p.pid !== process.pid && p.command.includes(" acp ") && p.command.includes(marker))
    .map((p) => ({ pid: p.pid, command: p.command }));
  return { refuse: folders.length > 0 || processes.length > 0, folders, processes };
}
