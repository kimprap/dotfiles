// T2 controller-owned domain schema (spec-v9 "Submission and tolerant domain
// validation"). One schema with variants for the soak and the Reconcile/Retrace
// exchanges. Tolerant: unambiguous syntactic variants of declared control
// keywords are accepted, irrelevant extra fields are ignored (counted, never
// exported), missing/conflicting required fields are rejected, and identifiers,
// paths, hashes and payload text are never case-folded or trimmed.

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);

/** Control keyword normalization: case, surrounding space, `_`/space vs `-`. */
export function normalizeKeyword(value) {
  if (typeof value !== "string") return undefined;
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

const VERDICTS = new Map([["valid", "VALID"], ["revise", "REVISE"], ["blocked", "BLOCKED"]]);
const DISPOSITIONS = new Set(["proposal", "no-change", "blocker"]);
const ROLES = new Set(["current", "historical"]);

// Variant -> declared fields (the closed A7 field set for that variant).
export const VARIANTS = Object.freeze({
  "soak-token": { fields: ["kind", "token"] },
  "soak-size": { fields: ["kind", "payload"] },
  "transport-result": { fields: ["kind", "payload"] },
  review: { fields: ["kind", "verdict", "rationale", "correction", "reason", "recommendations"] },
  "source-need": { fields: ["kind", "locators", "reason"] },
  "candidate-ready": { fields: ["kind", "report", "manifest", "disposition"] },
  "scope-paused": { fields: ["kind", "frontier"] },
});

/** Expected variants per controller phase; code supplies phase binding, never model echoes. */
export const PHASE_VARIANTS = Object.freeze({
  "soak-token": ["soak-token"],
  "soak-size": ["soak-size"],
  "transport-result": ["transport-result"],
  review: ["review", "source-need"],
  evaluate: ["candidate-ready", "source-need", "scope-paused"],
});

const nonEmpty = (v) => typeof v === "string" && v.length > 0 && v.trim() !== "";

function validateCorrection(c, mode, defects) {
  if (!isObj(c)) {
    defects.push("REVISE requires an object field `correction`");
    return undefined;
  }
  if (mode === "artifact") {
    if (!Array.isArray(c.edits) || c.edits.length === 0) {
      defects.push("REVISE in Artifact edits mode requires `correction.edits`, a non-empty array of {old, new}");
      return undefined;
    }
    const edits = [];
    c.edits.forEach((e, i) => {
      if (!isObj(e) || typeof e.old !== "string" || typeof e.new !== "string" || e.old.length === 0) defects.push(`correction.edits[${i}] must have a non-empty string \`old\` and a string \`new\``);
      else edits.push({ old: e.old, new: e.new });
    });
    return { edits };
  }
  if (typeof c.replacement !== "string" || c.replacement.trim() === "") {
    defects.push("REVISE in Conversation replacement mode requires a non-empty string `correction.replacement`");
    return undefined;
  }
  return { replacement: c.replacement };
}

/**
 * Validates one candidate `data` value once against the expected phase.
 * `ctx.mode` selects the Reconcile correction shape. Returns
 * { valid, variant, defects[], value } where `value` is the normalized closed
 * result (exact strings) used by the controller; nothing else is retained.
 */
export function validateResult(phase, data, ctx = {}) {
  const allowed = PHASE_VARIANTS[phase];
  if (!allowed) throw new Error(`unknown phase ${phase}`);
  const defects = [];
  if (!isObj(data)) return { valid: false, defects: [`data must be an object, got ${typeOf(data)}`] };
  if (data.kind === undefined) return { valid: false, defects: ["missing required field `kind`"] };
  const variant = normalizeKeyword(data.kind);
  if (!allowed.includes(variant)) return { valid: false, defects: [`field \`kind\` must be one of ${allowed.map((k) => `\`${k}\``).join(", ")}`] };
  const value = { kind: variant };
  switch (variant) {
    case "soak-token":
      if (!nonEmpty(data.token)) defects.push("field `token` must be a non-empty string");
      else if (ctx.expectedToken !== undefined && data.token !== ctx.expectedToken) defects.push(`field \`token\` must be exactly the supplied token \`${ctx.expectedToken}\``);
      else value.token = data.token;
      break;
    case "soak-size":
    case "transport-result":
      if (!nonEmpty(data.payload)) defects.push("field `payload` must be a non-empty string");
      else if (ctx.minPayloadBytes !== undefined && Buffer.byteLength(data.payload, "utf8") < ctx.minPayloadBytes) defects.push(`field \`payload\` must be at least ${ctx.minPayloadBytes} UTF-8 bytes; it was ${Buffer.byteLength(data.payload, "utf8")}`);
      else value.payload = data.payload;
      break;
    case "review": {
      const verdict = VERDICTS.get(normalizeKeyword(data.verdict) ?? "");
      if (!verdict) {
        defects.push("field `verdict` must be one of VALID, REVISE, BLOCKED");
        break;
      }
      value.verdict = verdict;
      if (typeof data.rationale === "string") value.rationale = data.rationale;
      if (verdict === "REVISE") {
        const c = validateCorrection(data.correction, ctx.mode, defects);
        if (c) value.correction = c;
      } else if (data.correction !== undefined && data.correction !== null) {
        defects.push(`verdict ${verdict} conflicts with a present \`correction\``);
      }
      if (verdict === "BLOCKED") {
        if (!nonEmpty(data.reason)) defects.push("BLOCKED requires a non-empty string `reason`");
        else value.reason = data.reason;
      }
      // Recommendations are never applied; only their presence is counted.
      if (data.recommendations !== undefined) value.recommendationCount = Array.isArray(data.recommendations) ? data.recommendations.length : 1;
      break;
    }
    case "source-need":
      if (!Array.isArray(data.locators) || data.locators.length === 0 || !data.locators.every(nonEmpty)) defects.push("field `locators` must be a non-empty array of non-empty strings");
      else value.locators = [...data.locators];
      if (typeof data.reason === "string") value.reason = data.reason;
      break;
    case "candidate-ready": {
      if (!nonEmpty(data.report)) defects.push("field `report` must be a non-empty string");
      else value.report = data.report;
      const disp = normalizeKeyword(data.disposition);
      if (!DISPOSITIONS.has(disp ?? "")) defects.push("field `disposition` must be one of proposal, no-change, blocker");
      else value.disposition = disp;
      if (!Array.isArray(data.manifest)) defects.push("field `manifest` must be an array of {locator, role}");
      else {
        value.manifest = [];
        data.manifest.forEach((m, i) => {
          const role = normalizeKeyword(m?.role);
          if (!isObj(m) || !nonEmpty(m.locator) || !ROLES.has(role ?? "")) defects.push(`manifest[${i}] needs a non-empty \`locator\` and role current|historical`);
          else value.manifest.push({ locator: m.locator, role });
        });
      }
      break;
    }
    case "scope-paused":
      if (!nonEmpty(data.frontier)) defects.push("field `frontier` must be a non-empty string");
      else value.frontier = data.frontier;
      break;
    default:
      defects.push("unsupported variant");
  }
  const declared = new Set(VARIANTS[variant].fields);
  value.extraKeyCount = Object.keys(data).filter((k) => !declared.has(k)).length;
  return defects.length ? { valid: false, variant, defects } : { valid: true, variant, defects, value };
}

/**
 * Closed A7 projection of a candidate `data` object for retention and offline
 * replay: only declared fields of the declared variants, exact strings, and
 * type facts for everything else. Unknown extras are counted, never exported.
 */
export function projectResultData(data) {
  if (!isObj(data)) return { dataType: typeOf(data) };
  const out = { dataType: "object" };
  const put = (k, v) => {
    if (typeof v === "string") out[k] = v;
    else if (v !== undefined) out[`${k}Type`] = typeOf(v);
  };
  for (const k of ["kind", "token", "payload", "verdict", "rationale", "reason", "report", "disposition", "frontier"]) put(k, data[k]);
  if (isObj(data.correction)) {
    const c = {};
    if (typeof data.correction.replacement === "string") c.replacement = data.correction.replacement;
    if (Array.isArray(data.correction.edits)) c.edits = data.correction.edits.map((e) => (isObj(e) ? { old: typeof e.old === "string" ? e.old : undefined, new: typeof e.new === "string" ? e.new : undefined } : { invalid: typeOf(e) }));
    out.correction = c;
  } else if (data.correction !== undefined) out.correctionType = typeOf(data.correction);
  if (Array.isArray(data.locators)) out.locators = data.locators.map((l) => (typeof l === "string" ? l : { invalid: typeOf(l) }));
  else if (data.locators !== undefined) out.locatorsType = typeOf(data.locators);
  if (Array.isArray(data.manifest)) out.manifest = data.manifest.map((m) => (isObj(m) ? { locator: typeof m.locator === "string" ? m.locator : undefined, role: typeof m.role === "string" ? m.role : undefined } : { invalid: typeOf(m) }));
  else if (data.manifest !== undefined) out.manifestType = typeOf(data.manifest);
  if (data.recommendations !== undefined) out.recommendationCount = Array.isArray(data.recommendations) ? data.recommendations.length : 1;
  const declared = new Set(["kind", "token", "payload", "verdict", "rationale", "reason", "report", "disposition", "frontier", "correction", "locators", "manifest", "recommendations"]);
  out.extraKeyCount = Object.keys(data).filter((k) => !declared.has(k)).length;
  return JSON.parse(JSON.stringify(out));
}

/** Rebuilds the validator input from the closed projection (exact strings, type stand-ins). */
export function fromProjection(p) {
  if (!p || p.dataType !== "object") {
    const t = p?.dataType;
    return t === "null" ? null : t === "array" ? [] : t === "string" ? "" : t === "number" ? 0 : undefined;
  }
  const standIn = (t) => (t === "number" ? 0 : t === "null" ? null : t === "array" ? [] : t === "boolean" ? false : {});
  const out = {};
  for (const [k, v] of Object.entries(p)) {
    if (k === "dataType" || k === "extraKeyCount" || k === "recommendationCount") continue;
    if (k.endsWith("Type")) out[k.slice(0, -4)] = standIn(v);
    else out[k] = v;
  }
  if (p.recommendationCount !== undefined) out.recommendations = Array.from({ length: p.recommendationCount }, () => "");
  return out;
}

/** Worked example for a variant (prompt material only; never an admission rule). */
export function exampleFor(variant, ctx = {}) {
  const ex = {
    "soak-token": { kind: "soak-token", token: "S0-E0-EXAMPLE" },
    "soak-size": { kind: "soak-size", payload: "Line 1: ...\nLine 2: ..." },
    review: ctx.mode === "artifact"
      ? { kind: "review", verdict: "REVISE", rationale: "Why the change is needed.", correction: { edits: [{ old: "exact old text", new: "exact new text" }] } }
      : { kind: "review", verdict: "REVISE", rationale: "Why the change is needed.", correction: { replacement: "The complete corrected proposal text." } },
    "source-need": { kind: "source-need", locators: ["/abs/path/file.md"], reason: "Why it is needed." },
    "candidate-ready": { kind: "candidate-ready", report: "Kind: conversation\n\n## Bound Intake and Scope Model\n...", manifest: [{ locator: "/abs/path/file.md", role: "current" }], disposition: "proposal" },
    "scope-paused": { kind: "scope-paused", frontier: "The exact unresolved question." },
  }[variant];
  return JSON.stringify({ data: ex });
}
