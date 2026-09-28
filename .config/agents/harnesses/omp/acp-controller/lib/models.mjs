// Reviewer model roles (spec-v3 §5 Q7, decision 2): A = modelRoles.second_opinion_a,
// B = modelRoles.second_opinion_b; the scope evaluator and normalizer use A's
// pair. Not pinned in the controller.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

export const ROLE_KEYS = Object.freeze({ a: "second_opinion_a", b: "second_opinion_b" });

/** Splits `<model id>:<thinking>` at its last `:`; undefined when a part is missing or empty. */
export function splitModelRole(value) {
  if (typeof value !== "string") return undefined;
  const i = value.lastIndexOf(":");
  if (i <= 0 || i === value.length - 1) return undefined;
  const model = value.slice(0, i).trim();
  const thinking = value.slice(i + 1).trim();
  return model && thinking ? { model, thinking } : undefined;
}

/** The models note (a two-item list) shown after a Reconcile brief or Retrace scope table (`cli.mjs roles`). */
export function renderModels(roles) {
  const pair = (r) => `\`${r.model}\` · ${r.thinking}`;
  return `Models:\n\n- A ${pair(roles.a)}\n- B ${pair(roles.b)}\n`;
}

/**
 * Runs `<ompPath> config list --json` under `env` (the §3.3 child environment;
 * `PI_CODING_AGENT_DIR` selects the live agent dir) with cwd `env.HOME`, and
 * reads only `modelRoles.value.second_opinion_a` and `.second_opinion_b`.
 * Returns `{ ok: true, roles: { a: { model, thinking }, b: { model, thinking } } }`
 * or `{ ok: false, reason }`.
 */
export async function readModelRoles({ ompPath, env }) {
  let parsed;
  try {
    const { stdout } = await execFileP(ompPath, ["config", "list", "--json"], { env, cwd: env.HOME, timeout: 60_000, maxBuffer: 16 << 20 });
    parsed = JSON.parse(stdout);
  } catch (error) {
    return { ok: false, reason: `\`omp config list --json\` failed (${error.code ?? error.name ?? "error"})` };
  }
  const values = parsed?.modelRoles?.value;
  const roles = {};
  const problems = [];
  for (const [role, key] of Object.entries(ROLE_KEYS)) {
    const value = values && typeof values === "object" ? values[key] : undefined;
    if (value === undefined) problems.push(`modelRoles.${key} is missing`);
    else {
      const pair = splitModelRole(value);
      if (!pair) problems.push(`modelRoles.${key} \`${String(value)}\` is not \`<model>:<thinking>\``);
      else roles[role] = pair;
    }
  }
  return problems.length ? { ok: false, reason: problems.join("; ") } : { ok: true, roles };
}
