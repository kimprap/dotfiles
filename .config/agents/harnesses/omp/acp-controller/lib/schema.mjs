// Controller-owned domain schema for every admitted `yield` candidate
// (spec-v3 §2.3 item 4, §4). One schema with variants for Reconcile review,
// Retrace scope evaluation and normalization. Tolerant: unambiguous syntactic
// variants of declared control keywords are accepted and irrelevant extra
// fields are ignored (counted), except that a review rejects any undeclared
// list field, because every non-blocking point belongs in `notes`; missing or
// conflicting required fields are rejected. Identifiers, paths and payload
// text are never case-folded or trimmed.

import path from "node:path";

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);
const nonEmpty = (v) => typeof v === "string" && v.trim() !== "";

/** Control keyword normalization: case, surrounding space, `_`/space vs `-`. */
export function normalizeKeyword(value) {
  if (typeof value !== "string") return undefined;
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

const VERDICTS = new Map([
  ["valid", "VALID"],
  ["revise", "REVISE"],
  ["blocked", "BLOCKED"],
]);
const DISPOSITIONS = new Set(["proposal", "no-change", "blocker"]);
const ROLES = new Set(["current", "historical"]);

/** Variant -> declared fields. */
export const VARIANTS = Object.freeze({
  review: ["kind", "verdict", "summary", "blocking_issues", "revision", "correction", "preserve", "citations", "notes", "replies", "blocker", "resume_with"],
  "source-need": ["kind", "locators", "reason"],
  "candidate-ready": ["kind", "report", "manifest", "disposition"],
  "scope-paused": ["kind", "frontier"],
  "scope-proposal": ["kind", "scopes", "coverage"],
});

/** Expected variants per controller phase; code supplies the phase, never a model echo. */
export const PHASE_VARIANTS = Object.freeze({
  review: ["review", "source-need"],
  evaluate: ["candidate-ready", "source-need", "scope-paused"],
  normalize: ["scope-proposal"],
});

/** A string, or a list of strings; `none`/empty collapse to []. */
function stringList(v, field, defects, { required = false } = {}) {
  let list;
  if (v === undefined || v === null) list = [];
  else if (typeof v === "string") list = [v];
  else if (Array.isArray(v) && v.every((x) => typeof x === "string")) list = [...v];
  else {
    defects.push(`field \`${field}\` must be a string or an array of strings`);
    return undefined;
  }
  list = list.filter((x) => x.trim() !== "" && normalizeKeyword(x) !== "none");
  if (required && list.length === 0) defects.push(`field \`${field}\` needs at least one entry`);
  return list;
}

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
  if (!nonEmpty(c.replacement)) {
    defects.push("REVISE in Conversation replacement mode requires a non-empty string `correction.replacement`");
    return undefined;
  }
  return { replacement: c.replacement };
}

/** Reviewer-authored `summary`: 1–4 single-line points of 1–100 characters, validated, never trimmed. */
function validateSummary(v, defects) {
  if (!Array.isArray(v) || v.length < 1 || v.length > 4 || !v.every((x) => typeof x === "string")) {
    defects.push("field `summary` must be an array of 1 to 4 strings");
    return undefined;
  }
  if (v.some((x) => x === "" || x !== x.trim() || /[\r\n]/.test(x) || [...x].length > 100)) {
    defects.push("each `summary` point must be one non-empty line of at most 100 characters without leading or trailing whitespace");
    return undefined;
  }
  return [...v];
}

/**
 * `REVISE` citations: `[{path, line, end_line?, quote}]` with an absolute path,
 * a positive integer line, an optional integer end line not below it and a
 * quote with visible text (kept untrimmed). Returns the normalized list, or
 * undefined after recording defects.
 */
function validateCitations(v, defects) {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) {
    defects.push("field `citations` must be an array of citation objects");
    return undefined;
  }
  const out = [];
  v.forEach((c, i) => {
    const endLine = isObj(c) ? c.end_line ?? c.line : undefined;
    const ok =
      isObj(c) &&
      nonEmpty(c.path) &&
      path.isAbsolute(c.path) &&
      Number.isInteger(c.line) &&
      c.line >= 1 &&
      Number.isInteger(endLine) &&
      endLine >= c.line &&
      nonEmpty(c.quote);
    if (ok) out.push({ path: c.path, line: c.line, end_line: endLine, quote: c.quote });
    else defects.push(`citations[${i}] needs an absolute \`path\`, a positive integer \`line\`, an optional integer \`end_line\` not below \`line\`, and a non-empty \`quote\``);
  });
  return out.length === v.length ? out : undefined;
}

/**
 * `notes` / `replies` on `VALID` and `REVISE`: an optional list of strings with
 * visible text, copied byte-for-byte (never trimmed or prefixed). Absent,
 * `null` or `[]` is no entries. Returns the list, or undefined after a defect.
 */
function textList(v, field, defects) {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || !v.every(nonEmpty)) {
    defects.push(`field \`${field}\` must be an array of non-empty strings`);
    return undefined;
  }
  return [...v];
}

function validateReview(data, ctx, value, defects) {
  const verdict = VERDICTS.get(normalizeKeyword(data.verdict) ?? "");
  if (!verdict) {
    defects.push("field `verdict` must be one of VALID, REVISE, BLOCKED");
    return;
  }
  value.verdict = verdict;
  const summary = validateSummary(data.summary, defects);
  if (summary) value.summary = summary;
  const issues = stringList(data.blocking_issues, "blocking_issues", defects, { required: verdict === "REVISE" });
  // Every non-blocking point goes in `notes`; a list under any other field would be silently lost.
  for (const field of Object.keys(data)) if (!VARIANTS.review.includes(field) && Array.isArray(data[field])) defects.push(`field \`${field}\` is not a review field; put every non-blocking point in \`notes\``);
  const preserve = stringList(data.preserve, "preserve", defects);
  if (verdict === "REVISE") {
    value.blocking_issues = issues;
    value.preserve = preserve ?? [];
    const c = validateCorrection(data.correction, ctx.mode, defects);
    if (c) value.correction = c;
    const citations = validateCitations(data.citations, defects);
    if (citations) value.citations = citations;
  } else {
    if (data.correction !== undefined && data.correction !== null) defects.push(`verdict ${verdict} conflicts with a present \`correction\``);
    if (issues?.length) defects.push(`verdict ${verdict} conflicts with non-empty \`blocking_issues\``);
    if (data.revision !== undefined && data.revision !== null && normalizeKeyword(String(data.revision)) !== "none") defects.push(`verdict ${verdict} requires \`revision\` none`);
    if (data.citations !== undefined && data.citations !== null && !(Array.isArray(data.citations) && data.citations.length === 0)) defects.push(`verdict ${verdict} carries no citations`);
  }
  if (verdict === "BLOCKED") {
    for (const field of ["notes", "replies"]) if (data[field] !== undefined && data[field] !== null && !(Array.isArray(data[field]) && data[field].length === 0)) defects.push(`verdict BLOCKED carries no \`${field}\``);
    if (!nonEmpty(data.blocker)) defects.push("BLOCKED requires a non-empty string `blocker`");
    else value.blocker = data.blocker;
    if (!nonEmpty(data.resume_with)) defects.push("BLOCKED requires a non-empty string `resume_with`");
    else value.resume_with = data.resume_with;
  } else {
    // Notes and replies go to the other reviewer and are never applied.
    const notes = textList(data.notes, "notes", defects);
    if (notes) value.notes = notes;
    const replies = textList(data.replies, "replies", defects);
    if (replies) value.replies = replies;
  }
}

function validateScopeProposal(data, value, defects) {
  if (!Array.isArray(data.scopes) || data.scopes.length === 0) {
    defects.push("field `scopes` must be a non-empty array of scope objects");
    return;
  }
  value.scopes = [];
  data.scopes.forEach((s, i) => {
    if (!isObj(s) || !nonEmpty(s.id) || !nonEmpty(s.name) || !nonEmpty(s.objective)) {
      defects.push(`scopes[${i}] needs non-empty string \`id\`, \`name\` and \`objective\``);
      return;
    }
    const scope = { id: s.id, name: s.name, objective: s.objective, evaluand: typeof s.evaluand === "string" ? s.evaluand : "" };
    for (const link of ["requires", "sharedEvidence", "potentialConflict"]) {
      const l = stringList(s[link], `scopes[${i}].${link}`, defects);
      if (l) scope[link] = l;
    }
    value.scopes.push(scope);
  });
  if (!Array.isArray(data.coverage)) defects.push("field `coverage` must be an array of {concern, scopes}");
  else {
    value.coverage = [];
    data.coverage.forEach((c, i) => {
      const scopes = isObj(c) ? stringList(c.scopes, `coverage[${i}].scopes`, defects, { required: true }) : undefined;
      if (!isObj(c) || !nonEmpty(c.concern) || !scopes) defects.push(`coverage[${i}] needs a non-empty \`concern\` and its \`scopes\``);
      else value.coverage.push({ concern: c.concern, scopes });
    });
  }
}

/**
 * Validates one candidate `data` value once against the expected phase.
 * `ctx.mode` selects the Reconcile Correction shape. Returns
 * `{ valid, variant, defects, value }`; `value` is the normalized closed result.
 */
export function validateResult(phase, data, ctx = {}) {
  const allowed = PHASE_VARIANTS[phase];
  if (!allowed) throw new Error(`unknown phase ${phase}`);
  if (!isObj(data)) return { valid: false, defects: [`data must be an object, got ${typeOf(data)}`] };
  if (data.kind === undefined) return { valid: false, defects: ["missing required field `kind`"] };
  const variant = normalizeKeyword(data.kind);
  if (!allowed.includes(variant)) return { valid: false, defects: [`field \`kind\` must be one of ${allowed.map((k) => `\`${k}\``).join(", ")}`] };
  const defects = [];
  const value = { kind: variant };
  switch (variant) {
    case "review":
      validateReview(data, ctx, value, defects);
      break;
    case "source-need": {
      const l = stringList(data.locators, "locators", defects, { required: true });
      if (l) value.locators = l;
      if (typeof data.reason === "string") value.reason = data.reason;
      break;
    }
    case "candidate-ready": {
      if (!nonEmpty(data.report)) defects.push("field `report` must be a non-empty string");
      else value.report = data.report;
      const disp = normalizeKeyword(data.disposition);
      if (!DISPOSITIONS.has(disp ?? "")) defects.push("field `disposition` must be one of proposal, no-change, blocker");
      else value.disposition = disp;
      if (!Array.isArray(data.manifest) || data.manifest.length === 0) defects.push("field `manifest` must be a non-empty array of {locator, role}");
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
    case "scope-proposal":
      validateScopeProposal(data, value, defects);
      break;
    default:
      defects.push("unsupported variant");
  }
  const declared = new Set(VARIANTS[variant]);
  value.extraKeyCount = Object.keys(data).filter((k) => !declared.has(k)).length;
  return defects.length ? { valid: false, variant, defects } : { valid: true, variant, defects, value };
}

/** Worked example for a variant (prompt material only; never an admission rule). */
export function exampleFor(variant, ctx = {}) {
  const ex = {
    review:
      ctx.mode === "artifact"
        ? { kind: "review", verdict: "REVISE", summary: ["Plain statement of what is wrong"], blocking_issues: ["Why the change is needed."], correction: { edits: [{ old: "exact old text", new: "exact new text" }] }, preserve: [], citations: [{ path: "/abs/path/file.md", line: 12, quote: "Exact text on line 12." }], notes: ["Optional non-blocking point for the other reviewer."], replies: ["adopted: the other reviewer's note this Correction takes up"] }
        : { kind: "review", verdict: "REVISE", summary: ["Plain statement of what is wrong"], blocking_issues: ["Why the change is needed."], correction: { replacement: "The complete corrected proposal text." }, preserve: [], citations: [{ path: "/abs/path/file.md", line: 12, quote: "Exact text on line 12." }], notes: ["Optional non-blocking point for the other reviewer."], replies: ["adopted: the other reviewer's note this Correction takes up"] },
    "source-need": { kind: "source-need", locators: ["/abs/path/file.md"], reason: "Why it is needed." },
    "candidate-ready": { kind: "candidate-ready", report: "Kind: conversation\n\n## Bound Intake and Scope Model\n...", manifest: [{ locator: "/abs/path/file.md", role: "current" }], disposition: "proposal" },
    "scope-paused": { kind: "scope-paused", frontier: "The exact unresolved question." },
    "scope-proposal": { kind: "scope-proposal", scopes: [{ id: "S1", name: "Name", objective: "One observable objective.", evaluand: "path/or/surface", requires: [], sharedEvidence: [], potentialConflict: [] }], coverage: [{ concern: "Raw concern text", scopes: ["S1"] }] },
  }[variant];
  if (!ex) throw new Error(`no example for ${variant}`);
  return JSON.stringify({ data: ex }, null, 2);
}
