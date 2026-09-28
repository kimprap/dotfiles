// Prompt templates read at run start from their one editable copy (spec-v3 §5 Q3):
// reviewer prompts from reconcile/references/reviewer-protocol.md and scope,
// continuation, re-ask and normalizer prompts from retrace/SKILL.md.
//
// Template syntax:
//   <!-- prompt:NAME -->   starts a section; it ends at the next prompt marker
//                          or Markdown heading outside a code fence (or end of
//                          file). Surrounding blank lines are trimmed.
//   {{SECTION:Heading}}    replaced at load with that file's section headed
//                          exactly `Heading` (heading line through the line
//                          before the next heading of the same or higher level).
//   {{NAME}}               a slot filled per request by renderPrompt().
import fs from "node:fs/promises";
import path from "node:path";
import { CONTROLLER_ROOT } from "./adapter.mjs";
import { sha256Text } from "./io.mjs";

const AGENTS_ROOT = path.resolve(CONTROLLER_ROOT, "..", "..", "..");
export const PROMPT_SOURCES = Object.freeze({
  reviewerProtocolPath: path.join(AGENTS_ROOT, "skills", "reconcile", "references", "reviewer-protocol.md"),
  retraceSkillPath: path.join(AGENTS_ROOT, "skills", "retrace", "SKILL.md"),
});
export const REQUIRED_MARKERS = Object.freeze({
  reviewer: Object.freeze(["initial", "rethink", "later", "source", "reask", "dispute"]),
  scope: Object.freeze(["evaluate", "continue", "reask", "normalize"]),
});

const MARKER = /^\s*<!--\s*prompt:([\w-]+)\s*-->\s*$/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE = /^\s*(```|~~~)/;
const SECTION_SLOT = /\{\{SECTION:([^}]+)\}\}/g;
const SLOT = /\{\{([A-Z][A-Z0-9_]*)\}\}/g;

/** Lines annotated with fence state and heading level (outside fences only). */
function scan(text) {
  let fence = false;
  return text.split("\n").map((line) => {
    const isFence = FENCE.test(line);
    const inFence = fence || isFence;
    if (isFence) fence = !fence;
    const h = inFence ? null : HEADING.exec(line);
    return { line, inFence, heading: h ? { level: h[1].length, text: h[2] } : null };
  });
}

function trimBlank(lines) {
  let a = 0;
  let b = lines.length;
  while (a < b && lines[a].trim() === "") a++;
  while (b > a && lines[b - 1].trim() === "") b--;
  return lines.slice(a, b).join("\n");
}

/** Extracts `{ name: text }` for every marker in one file; records duplicates. */
function extractMarkers(rows) {
  const found = new Map();
  const duplicates = [];
  for (let i = 0; i < rows.length; i++) {
    const m = rows[i].inFence ? null : MARKER.exec(rows[i].line);
    if (!m) continue;
    const body = [];
    for (let j = i + 1; j < rows.length; j++) {
      const r = rows[j];
      if (!r.inFence && (MARKER.test(r.line) || r.heading)) break;
      body.push(r.line);
    }
    if (found.has(m[1])) duplicates.push(m[1]);
    else found.set(m[1], trimBlank(body));
  }
  return { found, duplicates };
}

/** Section headed exactly `title`, or an error string. */
function headingSection(rows, title) {
  const starts = rows.map((r, i) => (r.heading?.text === title ? i : -1)).filter((i) => i >= 0);
  if (starts.length !== 1) return { error: starts.length ? `heading \`${title}\` is duplicated` : `heading \`${title}\` is missing` };
  const level = rows[starts[0]].heading.level;
  const body = [];
  for (let j = starts[0]; j < rows.length; j++) {
    if (j > starts[0] && rows[j].heading && rows[j].heading.level <= level) break;
    body.push(rows[j].line);
  }
  return { text: trimBlank(body) };
}

async function loadFile(file, required, problems) {
  let text;
  try {
    text = await fs.readFile(file, "utf8");
  } catch (error) {
    problems.push(`${file}: unreadable (${error.code ?? "error"})`);
    return undefined;
  }
  const rows = scan(text);
  const { found, duplicates } = extractMarkers(rows);
  for (const name of duplicates) problems.push(`${file}: marker \`prompt:${name}\` is duplicated`);
  const out = {};
  for (const name of required) {
    if (!found.has(name)) {
      problems.push(`${file}: marker \`prompt:${name}\` is missing`);
      continue;
    }
    out[name] = found.get(name).replace(SECTION_SLOT, (_, title) => {
      const s = headingSection(rows, title.trim());
      if (s.error) problems.push(`${file}: prompt:${name} {{SECTION:${title}}}: ${s.error}`);
      return s.text ?? "";
    });
  }
  return { templates: out, sha256: sha256Text(text) };
}

/**
 * Reads both prompt files at run start. Returns
 * `{ ok: true, prompts: { reviewer: {initial, rethink, later, source, reask, dispute},
 *   scope: {evaluate, continue, reask, normalize} }, sources }` or
 * `{ ok: false, problems }` when a required marker is missing or duplicated,
 * a file is unreadable, or a `{{SECTION:…}}` heading is missing or ambiguous.
 */
export async function loadPrompts({ reviewerProtocolPath = PROMPT_SOURCES.reviewerProtocolPath, retraceSkillPath = PROMPT_SOURCES.retraceSkillPath } = {}) {
  const problems = [];
  const reviewer = await loadFile(reviewerProtocolPath, REQUIRED_MARKERS.reviewer, problems);
  const scope = await loadFile(retraceSkillPath, REQUIRED_MARKERS.scope, problems);
  if (problems.length) return { ok: false, problems };
  return {
    ok: true,
    prompts: { reviewer: reviewer.templates, scope: scope.templates },
    sources: { reviewerProtocol: { path: reviewerProtocolPath, sha256: reviewer.sha256 }, retraceSkill: { path: retraceSkillPath, sha256: scope.sha256 } },
  };
}

/** Fills every `{{NAME}}` slot; a slot without a string value throws. */
export function renderPrompt(template, values) {
  const missing = new Set();
  const text = template.replace(SLOT, (all, name) => {
    const v = values[name];
    if (typeof v !== "string") {
      missing.add(name);
      return all;
    }
    return v;
  });
  if (missing.size) throw new Error(`prompt slots without a value: ${[...missing].join(", ")}`);
  return text;
}
