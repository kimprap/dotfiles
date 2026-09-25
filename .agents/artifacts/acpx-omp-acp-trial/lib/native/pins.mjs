// Exact pins, profiles and limits bound by spec acpx-omp-acp-trial/spec-v9.
// Everything here is authority-derived constant data; nothing is discovered at runtime.
import path from "node:path";
import { fileURLToPath } from "node:url";

export const BUNDLE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const REPO_ROOT = path.resolve(BUNDLE_DIR, "..", "..", "..");

export const AUTHORITY = Object.freeze({
  spec: {
    path: ".agents/artifacts/2026-09-24_acpx-omp-acp-trial-spec.md",
    revision: "acpx-omp-acp-trial/spec-v9",
    sha256: "7fcc011e548813b085f5e38f9e7245f5ce300418d9eac59137797ac54982a748",
  },
  decisions: {
    path: ".agents/artifacts/2026-09-24_acpx-omp-acp-trial-decision-evidence.md",
    revision: "acpx-omp-acp-trial-decisions/v7",
  },
  plan: { path: ".agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md" },
});

export const OMP_PIN = Object.freeze({
  path: "/Users/kim/.local/bin/omp",
  version: "omp/18.3.0",
  bytes: 208460816,
  sha256: "d61fb411f24146bed48dd901b13b5912a297d899ee691dda69c4b5b7ab8c35dc",
});

export const ACPX_PIN = Object.freeze({
  version: "0.19.2",
  integrity: "sha512-wLeY2T3vfa63/Oa6fsrbtCXAx6PhfdWvAvw+F6mv3gO/NYWTQf6MpGAWWvmO2JYq8YAhRJ+zt48/BWKz1JiMWg==",
});
export const SDK_PIN = Object.freeze({ name: "@agentclientprotocol/sdk", version: "1.4.0" });
export const NODE_MIN = Object.freeze([22, 13, 0]);

export const LIVE_STORE = "/Users/kim/.omp/agent";
export const LIVE_CONFIG = Object.freeze({
  path: ".config/agents/harnesses/omp/config.yml",
  sha256: "9b77dcc12f71d50b047753c0f4a79a4241c64e84e425b7b3921dd408c6428c25",
  lifecyclePlugin: ".config/agents/harnesses/omp/extensions/lifecycle-plugin.js",
});

// Explicit trial launch pins (argv). Live modelRoles are provenance only.
export const PROFILES = Object.freeze({
  A: Object.freeze({ model: "anthropic/claude-opus-5-5", thinking: "medium" }),
  B: Object.freeze({ model: "xai-oauth/grok-4.7", thinking: "medium" }),
  tiny: Object.freeze({ model: "xai-oauth/grok-4.7", thinking: "low" }),
});

export const TOOL_RESTRICTION = "read,glob,grep,yield";
export const FIXED_FLAGS = Object.freeze([
  "--no-extensions",
  "--no-skills",
  "--no-rules",
  "--no-lsp",
  "--no-title",
]);

export const OVERLAY_PATH = path.join(BUNDLE_DIR, "config", "omp-overlay.yml");

/**
 * Launcher `--session-dir` for one run. OMP 18.3.0 applies `--session-dir` on
 * session/new but ignores it on load, where it searches only the cwd-derived
 * folder and `<agentDir>/sessions/<dir>/<file>.jsonl`; the run folder must therefore be a
 * direct child of the live `sessions/` (spec-v9 launch section, 2026-09-25
 * decision). Deeper nesting fails to load again.
 */
export function sessionDirFor(runId) {
  return path.join(LIVE_STORE, "sessions", `acpx-trial-${runId}`);
}

/** Registry argv array for the pinned executable; never shell-composed. */
export function buildAgentArgv(profileName, sessionDir) {
  const profile = PROFILES[profileName];
  if (!profile) throw new Error(`unknown profile ${profileName}`);
  return [
    OMP_PIN.path,
    "acp",
    "--model",
    profile.model,
    "--thinking",
    profile.thinking,
    "--tools",
    TOOL_RESTRICTION,
    ...FIXED_FLAGS,
    "--config",
    OVERLAY_PATH,
    "--session-dir",
    sessionDir,
  ];
}

export const RUNTIME = Object.freeze({
  normalTtlMs: 7_800_000,
  timeoutMs: 7_200_000,
  shortTtlMs: 1_000,
  permissionMode: "deny-all",
  nonInteractivePermissions: "deny",
});

// USD4.50 / 20 minutes shared by T1 probe and T2 soak (cumulative, never reset);
// cost cap raised from USD2 by the 2026-09-25 user grant (config/approval.json).
export const PROBE_SOAK_POOL = Object.freeze({ usd: 4.5, wallMs: 20 * 60_000 });
export const PROBE = Object.freeze({
  expectations: 4,
  maxReasks: 3,
  maxSubmissions: 16,
  postCloseObserveMs: 10_000,
  idleExpiryObserveMs: 20_000,
  pidPollMs: 100,
});
