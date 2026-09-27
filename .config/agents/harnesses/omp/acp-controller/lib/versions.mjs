// Exact toolchain pins (spec-v3 §5 Q4, decision 3). A new version first needs
// the offline suite and the live runs to pass on it.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

export const OMP_VERSION = "omp/18.3.0";
export const ACPX_VERSION = "0.19.2";
export const ACP_SDK_VERSION = "1.4.0";

/** Resolves `omp` through a PATH string to an absolute executable path, or null. */
export async function resolveOnPath(name, pathEnv) {
  for (const dir of (pathEnv ?? "").split(path.delimiter)) {
    if (!path.isAbsolute(dir)) continue;
    const candidate = path.join(dir, name);
    try {
      const st = await fs.stat(candidate);
      if (!st.isFile()) continue;
      await fs.access(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      // Not here; keep searching PATH order.
    }
  }
  return null;
}

async function readVersion(file, pick) {
  try {
    const value = pick(JSON.parse(await fs.readFile(file, "utf8")));
    return typeof value === "string" ? value : "missing";
  } catch (error) {
    return `unreadable (${error.code ?? error.name ?? "error"})`;
  }
}

/**
 * Checks every pin before any launch. Returns
 * `{ ok: true, ompPath, observed }` or `{ ok: false, ompPath, observed, mismatches }`
 * where each mismatch is `{ name, expected, observed }`.
 */
export async function checkVersions({ controllerRoot, pathEnv }) {
  const observed = {};
  const mismatches = [];
  const expect = (name, expected, value) => {
    observed[name] = value;
    if (value !== expected) mismatches.push({ name, expected, observed: value });
  };

  const ompPath = await resolveOnPath("omp", pathEnv);
  if (!ompPath) expect("omp --version", OMP_VERSION, "omp not found on PATH");
  else {
    let version;
    try {
      const { stdout } = await execFileP(ompPath, ["--version"], { env: { PATH: pathEnv }, timeout: 30_000 });
      version = stdout.trim();
    } catch (error) {
      version = `failed (${error.code ?? error.name ?? "error"})`;
    }
    expect("omp --version", OMP_VERSION, version);
  }

  const lockFile = path.join(controllerRoot, "package-lock.json");
  for (const [name, expected] of [["acpx", ACPX_VERSION], ["@agentclientprotocol/sdk", ACP_SDK_VERSION]]) {
    expect(`${name} installed`, expected, await readVersion(path.join(controllerRoot, "node_modules", name, "package.json"), (p) => p.version));
    expect(`${name} locked`, expected, await readVersion(lockFile, (l) => l.packages?.[`node_modules/${name}`]?.version));
  }

  return mismatches.length ? { ok: false, ompPath, observed, mismatches } : { ok: true, ompPath, observed };
}
