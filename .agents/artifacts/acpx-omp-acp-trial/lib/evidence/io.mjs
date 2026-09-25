// Minimal evidence I/O shared by the runner and the independent checker.
// Deliberately contains no classification logic.
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

export async function sha256File(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

export const sha256Text = (text) => createHash("sha256").update(text).digest("hex");

export async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o644 });
}

export async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

export async function readJsonIfExists(file) {
  try {
    return await readJson(file);
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
}

export async function exists(file) {
  try {
    await fs.lstat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

/** Hashes each repository-relative protected file; missing files are recorded, not skipped. */
export async function hashProtected(repoRoot, files) {
  const out = {};
  for (const rel of files) {
    const abs = path.join(repoRoot, rel);
    try {
      out[rel] = await sha256File(abs);
    } catch (error) {
      out[rel] = error.code === "ENOENT" ? "missing" : `error:${error.code ?? "unknown"}`;
    }
  }
  return out;
}

/** Lists every retained run directory under `runsDir` with the given prefix. */
export async function listRuns(runsDir, prefix) {
  const dir = runsDir;
  let names = [];
  try {
    names = await fs.readdir(dir);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return names.filter((n) => n.startsWith(prefix)).sort().map((n) => path.join(dir, n));
}
