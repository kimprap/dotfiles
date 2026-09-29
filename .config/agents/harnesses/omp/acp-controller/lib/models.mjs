// Reviewer model roles (spec-v3 §5 Q7, decision 2): A = modelRoles.second_opinion_a,
// B = modelRoles.second_opinion_b; the scope evaluator and normalizer use A's
// pair. Not pinned in the controller. A human may change the pairs for one
// Reconcile or Retrace run only: `cli.mjs roles` resolves loose names and levels
// against the `omp models --json` catalog, and the approved request carries the
// exact `models` override. No `modelRoles` source is ever edited.
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

/**
 * The models note (a two-item list) shown after a Reconcile brief or Retrace scope table (`cli.mjs roles`).
 * With `live`, a line whose pair differs from the live pair names the live default.
 */
export function renderModels(roles, live) {
  const pair = (r) => `\`${r.model}\` · ${r.thinking}`;
  const line = (role) => {
    const r = roles[role];
    const d = live?.[role];
    if (!d || (d.model === r.model && d.thinking === r.thinking)) return pair(r);
    return d.model === r.model ? `${pair(r)} (default: ${d.thinking})` : `${pair(r)} (default: \`${d.model}\` · ${d.thinking})`;
  };
  return `Models:\n\n- A ${line("a")}\n- B ${line("b")}\n`;
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

const isStr = (v) => typeof v === "string" && v !== "";

/**
 * Runs `<ompPath> models --json` under `env` (the same child environment as
 * readModelRoles) and keeps each `models` entry's `provider`, `id`, `selector`
 * and `thinking` (supported levels, or null). Returns `{ ok: true, models }`
 * or `{ ok: false, reason }`.
 */
export async function readModelCatalog({ ompPath, env }) {
  let parsed;
  try {
    const { stdout } = await execFileP(ompPath, ["models", "--json"], { env, cwd: env.HOME, timeout: 60_000, maxBuffer: 16 << 20 });
    parsed = JSON.parse(stdout);
  } catch (error) {
    return { ok: false, reason: `\`omp models --json\` failed (${error.code ?? error.name ?? "error"})` };
  }
  if (!Array.isArray(parsed?.models)) return { ok: false, reason: "`omp models --json` has no `models` array" };
  const models = parsed.models
    .filter((m) => isStr(m?.provider) && isStr(m.id) && isStr(m.selector))
    .map((m) => ({ provider: m.provider, id: m.id, selector: m.selector, thinking: Array.isArray(m.thinking) ? m.thinking.filter(isStr) : null }));
  return { ok: true, models };
}

const DATED = /-\d{8}$/;
const NUMERIC = /^\d+$/;
const family = (id) => id.split("-").filter((t) => !NUMERIC.test(t)).join("-");
const version = (id) => id.split("-").filter((t) => NUMERIC.test(t)).map(Number);
function compareVersions(x, y) {
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return d;
  }
  return 0;
}
const providerOf = (selector) => (selector.includes("/") ? selector.slice(0, selector.indexOf("/")) : selector);
const quoted = (items) => items.map((s) => `\`${s}\``).join(", ");

/**
 * Resolves a loose model `name` for a role whose live selector is `liveModel`.
 * An exact selector, or an exact id inside the scoped provider, wins. Otherwise
 * the scoped provider's non-dated ids containing the text (case-insensitive)
 * must share one family (id without numeric tokens), and the unique newest
 * version wins. Returns `{ ok: true, entry }` or `{ ok: false, problem }`.
 */
export function resolveModel(name, liveModel, catalog) {
  const input = name.trim();
  const exact = catalog.find((m) => m.selector === input);
  if (exact) return { ok: true, entry: exact };
  const slash = input.indexOf("/");
  const provider = slash >= 0 ? input.slice(0, slash) : providerOf(liveModel);
  const text = slash >= 0 ? input.slice(slash + 1) : input;
  const scoped = catalog.filter((m) => m.provider === provider);
  const exactId = scoped.find((m) => m.id === text);
  if (exactId) return { ok: true, entry: exactId };
  const needle = text.toLowerCase();
  const candidates = scoped.filter((m) => m.id.toLowerCase().includes(needle) && !DATED.test(m.id));
  if (!candidates.length) return { ok: false, problem: `no model in provider \`${provider}\` matches` };
  const families = new Map();
  for (const m of candidates) families.set(family(m.id), [...(families.get(family(m.id)) ?? []), m]);
  const newest = [...families.values()].map((ms) => {
    const top = ms.reduce((best, m) => (compareVersions(version(m.id), version(best.id)) > 0 ? m : best));
    return ms.filter((m) => compareVersions(version(m.id), version(top.id)) === 0);
  });
  if (newest.length === 1 && newest[0].length === 1) return { ok: true, entry: newest[0][0] };
  return { ok: false, problem: `ambiguous; candidates: ${quoted(newest.flat().map((m) => m.selector))}` };
}

/**
 * Resolves a loose thinking `input` against a model's supported `levels`: an
 * exact member, else the unique member starting with the input (case-insensitive).
 * Returns `{ ok: true, level }` or `{ ok: false, problem }`.
 */
export function resolveThinking(input, levels) {
  if (!levels?.length) return { ok: false, problem: "the model supports no thinking level" };
  const text = input.trim().toLowerCase();
  const exact = levels.find((l) => l.toLowerCase() === text);
  if (exact) return { ok: true, level: exact };
  const prefixed = levels.filter((l) => l.toLowerCase().startsWith(text));
  if (prefixed.length === 1) return { ok: true, level: prefixed[0] };
  if (prefixed.length > 1) return { ok: false, problem: `ambiguous; candidates: ${quoted(prefixed)}` };
  return { ok: false, problem: `no match; allowed: ${quoted(levels)}` };
}

/**
 * The `roles` body: `choices` = `{ a?: { model?, thinking? }, b?: {...} }` of loose
 * values over the `live` pairs. A role or field left out keeps its live value; a
 * kept level must be supported by a changed model. Returns `{ ok: true, roles }`
 * or `{ ok: false, problems }` (one line per problem).
 */
export function resolveModelChoice(choices, live, catalog) {
  const roles = {};
  const problems = [];
  for (const role of Object.keys(ROLE_KEYS)) {
    const choice = choices?.[role];
    const current = live[role];
    const R = role.toUpperCase();
    if (!choice || (choice.model === undefined && choice.thinking === undefined)) {
      roles[role] = current;
      continue;
    }
    let entry;
    if (choice.model !== undefined) {
      const m = resolveModel(choice.model, current.model, catalog);
      if (!m.ok) {
        problems.push(`${R} model \`${choice.model}\`: ${m.problem}`);
        continue;
      }
      entry = m.entry;
    } else {
      entry = catalog.find((m) => m.selector === current.model);
      if (!entry) {
        problems.push(`${R} thinking \`${choice.thinking}\`: the live model \`${current.model}\` is not in the model catalog`);
        continue;
      }
    }
    if (choice.thinking !== undefined) {
      const l = resolveThinking(choice.thinking, entry.thinking);
      if (!l.ok) problems.push(`${R} thinking \`${choice.thinking}\` for \`${entry.selector}\`: ${l.problem}`);
      else roles[role] = { model: entry.selector, thinking: l.level };
    } else if (!entry.thinking?.includes(current.thinking)) {
      const allowed = entry.thinking?.length ? `allowed: ${quoted(entry.thinking)}` : "the model supports no thinking level";
      problems.push(`${R} model \`${choice.model}\` → \`${entry.selector}\` does not support the live level \`${current.thinking}\`; ${allowed}`);
    } else roles[role] = { model: entry.selector, thinking: current.thinking };
  }
  return problems.length ? { ok: false, problems } : { ok: true, roles };
}

/**
 * A request's exact `models` override `{ a?: "<selector>:<level>", b?: ... }` over
 * the `live` pairs: each selector must be in the catalog and its level supported.
 * No loose resolution. Returns `{ ok: true, roles }` or `{ ok: false, problems }`.
 */
export function applyModelOverride(models, live, catalog) {
  const roles = { ...live };
  const problems = [];
  for (const [role, value] of Object.entries(models)) {
    const R = role.toUpperCase();
    const pair = splitModelRole(value);
    const entry = pair && catalog.find((m) => m.selector === pair.model);
    if (!pair) problems.push(`${R} \`${value}\` is not \`<selector>:<level>\``);
    else if (!entry) problems.push(`${R} \`${value}\`: \`${pair.model}\` is not an exact selector in the model catalog`);
    else if (!entry.thinking?.includes(pair.thinking)) problems.push(`${R} \`${value}\`: level \`${pair.thinking}\` is not supported; allowed: ${entry.thinking?.length ? quoted(entry.thinking) : "none"}`);
    else roles[role] = pair;
  }
  return problems.length ? { ok: false, problems } : { ok: true, roles };
}
