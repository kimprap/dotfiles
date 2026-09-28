// Semantic controller for Reconcile and Retrace (spec-v3 §2, §4, §5).
// Code owns approval checks, reviewer progression, the C4 re-ask budget,
// Correction application, capacity, park/resume, disposal, the Retrace
// scheduler, freshness and presentation. Actors only return domain-valid
// native `yield` candidates (lib/schema.mjs) through lib/ports.mjs.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { initRootFor, privateRootFor, readOwnerClaim, sessionDirFor } from "./lib/env.mjs";
import { exists, readJsonIfExists, sha256Text } from "./lib/io.mjs";
import { actorRecord, ask, claimRun, disposalFailure, disposeActor, finishRun, leaveRun, observeParkedPids, observeRunPids, openRun, parkRun, reopenRun, setRunPhase, startActor } from "./lib/ports.mjs";
import { listProcesses, OWNER_UNREADABLE, ownerState, processesForRun } from "./lib/preflight.mjs";
import { renderPrompt } from "./lib/prompts.mjs";
import { exampleFor, validateResult } from "./lib/schema.mjs";
import { renderSpend } from "./lib/spend.mjs";

/** Re-asks per original expectation, shared across C4 categories (KR12). */
export const C4_MAX_REASKS = 3;
/** Direct Retrace actors (scope evaluators or the normalizer) live at once (KT3). */
export const MAX_DIRECT_ACTORS = 4;
export const RETHINK_SKILL_PATH = "/Users/kim/.dotfiles/.config/agents/skills/rethink/SKILL.md";
const EXIT = Object.freeze({ final: 0, stopped: 1, refused: 2, cleanup: 3 });
const PARKABLE_STEPS = ["application", "reread", "validation"];

const identity = (text) => (typeof text === "string" ? `sha256:${sha256Text(text)}` : "unreadable");
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const nonEmpty = (v) => typeof v === "string" && v.trim() !== "";
const cell = (s) => String(s).replaceAll("|", "\\|").replaceAll("\r\n", "<br>").replaceAll("\n", "<br>");
const bullet = (text) => `- ${String(text).split("\n").join("\n  ")}`;

function renderRefusal(reason, lines) {
  const list = lines.length ? `\n${lines.map((l) => `- ${l}`).join("\n")}\n` : "";
  return `## Controller refused\n\n**Reason:** ${reason}\n${list}\nNothing was launched.\n\n${renderSpend([])}`;
}

const refused = (problems) => ({ exitCode: EXIT.refused, markdown: renderRefusal("invalid request", problems) });

async function readText(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch (error) {
    return { error: error.code ?? "error" };
  }
}

/** Runs the approved validator argv without a shell. */
function runValidator(argv, cwd) {
  return new Promise((resolve) => {
    execFile(argv[0], argv.slice(1), { cwd, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (!error) resolve({ ok: true });
      else resolve({ ok: false, error: `exit ${error.code ?? error.signal ?? "error"}${stderr ? `: ${stderr.trim().split("\n").at(-1)}` : ""}` });
    });
  });
}

/** Supplies requested sources inside `inBoundary`; the rest are named as refused or unreadable. */
async function supplySources(locators, inBoundary) {
  const status = [];
  const bodies = [];
  for (const loc of locators) {
    if (!path.isAbsolute(loc) || !inBoundary(loc)) {
      status.push(`${loc}: refused (outside the approved evidence boundary)`);
      continue;
    }
    const text = await readText(loc);
    if (typeof text !== "string") {
      status.push(`${loc}: unreadable (${text.error})`);
      continue;
    }
    status.push(`${loc}: supplied`);
    const fence = "`".repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map((m) => m[0].length + 1)));
    bodies.push(`${loc}\n${fence}text\n${text}\n${fence}`);
  }
  return { SOURCE_STATUS: status.join("; "), LOCATORS: locators.join(", "), SOURCES: bodies.join("\n\n") || "none" };
}

// ------------------------------------------------------------------ approval and corrections

/**
 * Validates the approved Reconcile brief (Q1 request). Delegated `reportOnly`
 * review is Conversation replacement only and carries no validator.
 */
export function validateApproval(request, { reportOnly = false } = {}) {
  const problems = [];
  if (!isObj(request)) return { ok: false, problems: ["request must be an object"] };
  if (!nonEmpty(request.goal)) problems.push("goal must be a non-empty string");
  const c = request.candidate;
  if (!isObj(c) || !nonEmpty(c.identity)) problems.push("candidate.identity must be a non-empty string");
  if (!Array.isArray(request.context)) problems.push("context must be an array");
  const mode = request.mode;
  if (mode !== "conversation" && mode !== "artifact") problems.push("mode must be conversation or artifact");
  if (mode === "conversation" && !nonEmpty(c?.text)) problems.push("Conversation replacement needs the complete candidate text");
  if (mode === "conversation" && c?.artifact !== undefined) problems.push("Conversation replacement takes no artifact");
  if (mode === "artifact" && !(nonEmpty(c?.artifact) && path.isAbsolute(c.artifact))) problems.push("Artifact edits needs one absolute sole-source candidate.artifact");
  if (mode === "artifact" && c?.text !== undefined) problems.push("Artifact edits must not carry conversation text");
  if (request.cap !== "none" && !(Number.isInteger(request.cap) && request.cap > 0)) problems.push("cap must be \"none\" or a positive integer");
  if (request.validate !== undefined && !(isObj(request.validate) && Array.isArray(request.validate.argv) && request.validate.argv.length > 0 && request.validate.argv.every(nonEmpty))) problems.push("validate must be {argv: [non-empty strings]}");
  if (request.validate !== undefined && mode !== "artifact") problems.push("validate applies to Artifact edits only");
  if (!isObj(request.approval) || !nonEmpty(request.approval.text) || !nonEmpty(request.approval.at)) problems.push("approval must be {text, at} from the human");
  if (reportOnly && mode !== "conversation") problems.push("delegated Reconcile is report-only: Conversation replacement of the scope report");
  return { ok: problems.length === 0, problems, mode, cap: request.cap };
}

function applyEdits(base, edits) {
  const spans = [];
  for (const e of edits) {
    const i = base.indexOf(e.old);
    if (i < 0 || base.indexOf(e.old, i + 1) >= 0) return { ok: false, defect: `edit old text must occur exactly once in the outer base: ${JSON.stringify(e.old.slice(0, 80))}` };
    spans.push({ i, j: i + e.old.length, e });
  }
  spans.sort((a, b) => a.i - b.i);
  for (let k = 1; k < spans.length; k++) if (spans[k].i < spans[k - 1].j) return { ok: false, defect: "edits overlap" };
  let out = "";
  let at = 0;
  for (const s of spans) {
    out += base.slice(at, s.i) + s.e.new;
    at = s.j;
  }
  return { ok: true, bytes: out + base.slice(at) };
}

/**
 * KR8: one complete replacement, or one complete edit set against the
 * immutable outer base (a later REVISE supersedes, never stacks). A Correction
 * that is non-applicable or leaves the current working proposal unchanged is
 * an invalid return.
 */
export function applyCorrection(mode, base, working, correction) {
  const r = mode === "artifact" ? applyEdits(base, correction.edits) : { ok: true, bytes: correction.replacement };
  if (!r.ok) return r;
  if (r.bytes === working) return { ok: false, defect: "correction does not change the current working proposal" };
  return r;
}

// ------------------------------------------------------------------ Reconcile

const MODE_LABEL = { conversation: "Conversation replacement", artifact: "Artifact edits" };
const CORRECTION_SHAPE = {
  conversation: "`correction.replacement`: the complete replacement proposal text",
  artifact: "`correction.edits`: one complete set of exact `{old, new}` edits against the unchanged outer base; each `old` occurs exactly once",
};

function verdictText(v) {
  if (v.verdict === "VALID") return v.recommendations?.length ? `VALID (not applied: ${v.recommendations.join("; ")})` : "VALID";
  if (v.verdict === "REVISE") return `REVISE: ${v.blocking_issues.join("; ")}`;
  return `BLOCKED: ${v.blocker}; resume with: ${v.resume_with}`;
}

function addRow(rs, actor, pass, ident, outcome) {
  rs.rows.push({ outer: rs.outer || "—", actor, pass, identity: ident, outcome });
}

function reviewerPrompt(ctx, role, kind, pass, values) {
  const { rs } = ctx;
  const all = {
    ROLE: role,
    PASS: pass,
    GOAL: rs.goal,
    CANDIDATE_REF: rs.mode === "artifact" ? `${rs.artifact} (${rs.candidateIdentity})` : rs.candidateIdentity,
    CONTEXT: rs.context.length ? rs.context.map((c) => (typeof c === "string" ? c : JSON.stringify(c))).join("\n") : "none",
    MODE: MODE_LABEL[rs.mode],
    CAP: String(rs.cap),
    ITERATION: String(rs.outer),
    PROPOSAL: values.PROPOSAL,
    OUTER_BASE: values.OUTER_BASE,
    CORRECTION_SHAPE: CORRECTION_SHAPE[rs.mode],
    EXAMPLE: exampleFor("review", { mode: rs.mode }),
    PROVISIONAL: "none",
    BLOCKED_RETRY: "",
    SOURCE_STATUS: "none",
    LOCATORS: "none",
    SOURCES: "none",
    DEFECT: "none",
    RETHINK_SKILL: RETHINK_SKILL_PATH,
    DELEGATION: rs.delegation ?? "none",
    ...values,
  };
  const header = `Phase: ${kind}\nReviewer: ${role}\nPass: ${pass}\nOwner: ${rs.ownerScope}\n\n`;
  return header + renderPrompt(ctx.deps.prompts.reviewer[kind], all);
}

/**
 * One original expectation with its shared C4 allowance: three re-asks; the
 * fourth invalid return stops. Source-need continues the same pass; every
 * other non-C4 row stops without charge. Returns `{ ok, value, derived }` or
 * `{ ok: false, stop }`.
 */
async function expectReview(ctx, reviewer, role, { kind, pass, values }, applicable) {
  const { run, rs } = ctx;
  const validate = (data) => validateResult("review", data, { mode: rs.mode });
  const sources = new Set();
  let invalid = 0;
  let requestKind = kind;
  let extra = {};
  for (;;) {
    const out = await ask(run, reviewer, reviewerPrompt(ctx, role, requestKind, pass, { ...values, ...extra }), validate);
    let defects = out.defects ?? [];
    if (out.row === "candidate-valid") {
      const v = out.value;
      if (v.kind === "source-need") {
        const key = JSON.stringify([...v.locators].sort());
        if (sources.has(key)) return { ok: false, stop: { cause: "repeated source request", detail: `${role} asked again for ${v.locators.join(", ")}`, step: `${role} ${pass}` } };
        sources.add(key);
        extra = await supplySources(v.locators, () => true);
        requestKind = "source";
        continue;
      }
      const check = applicable ? applicable(v) : { ok: true };
      if (check.ok) return { ok: true, value: v, derived: check };
      defects = [check.defect];
    } else if (!out.c4) {
      return { ok: false, stop: { cause: out.row, detail: `${role} ${pass} request closed as ${out.row}`, step: `${role} ${pass}` } };
    }
    invalid++;
    rs.invalidReturns++;
    if (invalid > C4_MAX_REASKS) return { ok: false, stop: { cause: "invalid returns exhausted", detail: `${role} ${pass}: ${invalid} invalid returns (${defects.join("; ")})`, step: `${role} ${pass}` } };
    requestKind = "reask";
    extra = { DEFECT: defects.join("; ") || out.row };
  }
}

/** Lazily creates a scope-owned reviewer; B exists only after an applicable REVISE (KR5). */
async function getReviewer(ctx, role) {
  const { rs } = ctx;
  if (!ctx.reviewers[role]) {
    ctx.reviewers[role] = await startActor(ctx.run, { name: `${ctx.prefix}${role}`, role: ctx.deps.roles[role.toLowerCase()] });
    rs.reviewers[role] = { firstActualReviewComplete: false };
  }
  return ctx.reviewers[role];
}

/** KR6: a reviewer's first review is initial → same-session rethink → post-rethink; later reviews are `later`. */
async function reviewTurn(ctx, role, values, applicable) {
  const reviewer = await getReviewer(ctx, role);
  const flags = ctx.rs.reviewers[role];
  if (!flags.firstActualReviewComplete) {
    const initial = await expectReview(ctx, reviewer, role, { kind: "initial", pass: "initial", values }, null);
    if (!initial.ok) return initial;
    // The initial response is provisional and never acted on.
    const post = await expectReview(ctx, reviewer, role, { kind: "rethink", pass: "post-rethink", values: { ...values, PROVISIONAL: JSON.stringify(initial.value, null, 2) } }, applicable);
    if (post.ok) flags.firstActualReviewComplete = true;
    return { ...post, pass: "post-rethink" };
  }
  return { ...(await expectReview(ctx, reviewer, role, { kind: "later", pass: "later", values }, applicable)), pass: "later" };
}

/**
 * KR10/KR11/KR13: applies the accepted proposal once, from `from` onwards:
 * application → reread → validation. A failure at one of these steps parks.
 */
async function applyAccepted(ctx, from = "application") {
  const { rs } = ctx;
  const p = rs.pending;
  if (rs.mode === "conversation") {
    rs.canonical = p.accepted;
    rs.applications++;
    addRow(rs, "apply", "—", identity(p.accepted), `applied (count ${rs.applications})`);
    rs.pending = null;
    return { ok: true };
  }
  const steps = PARKABLE_STEPS.slice(PARKABLE_STEPS.indexOf(from));
  if (steps.includes("application")) {
    const before = await readText(rs.artifact);
    if (before !== p.base) return { ok: false, stop: { cause: "artifact drift before application", detail: `the artifact is ${identity(before)}, not the accepted outer base ${identity(p.base)}`, step: "pre-application reread", observed: identity(before) } };
    try {
      await fs.writeFile(rs.artifact, p.accepted);
    } catch (error) {
      return { ok: false, park: { step: "application", error: `write failed: ${error.code ?? "error"}`, observed: identity(await readText(rs.artifact)) } };
    }
  }
  const after = await readText(rs.artifact);
  if (after !== p.accepted) return { ok: false, park: { step: "reread", error: `reread shows ${identity(after)}, not the applied Correction`, observed: identity(after) } };
  if (rs.validateArgv) {
    const v = await runValidator(rs.validateArgv, path.dirname(rs.artifact));
    if (!v.ok) return { ok: false, park: { step: "validation", error: `validator ${JSON.stringify(rs.validateArgv)} failed: ${v.error}`, observed: identity(after) } };
  }
  rs.canonical = p.accepted;
  rs.applications++;
  addRow(rs, "apply", "—", identity(p.accepted), `applied, reread matches (count ${rs.applications})`);
  if (rs.validateArgv) addRow(rs, "validate", "—", identity(p.accepted), "passed");
  rs.pending = null;
  return { ok: true };
}

/** Outer iterations (KR5, KR9, KR10). Returns `{ status: "final" | "stopped" | "park", ... }`. */
async function reconcileLoop(ctx) {
  const { rs } = ctx;
  for (;;) {
    rs.outer++;
    const base = rs.canonical;
    let working = base;
    const closureOnly = rs.cap !== "none" && rs.applications >= rs.cap;
    if (closureOnly) addRow(rs, "cap", "—", identity(base), `closure-only: cap ${rs.cap} reached`);
    let role = "A"; // KR5: A starts every outer iteration, including closure
    const seen = new Set();
    let blockedRetry = "";
    let accepted;
    for (;;) {
      const applicable = (v) => {
        if (v.kind !== "review") return { ok: false, defect: "expected a review verdict" };
        if (v.verdict !== "REVISE") return { ok: true };
        const r = applyCorrection(rs.mode, base, working, v.correction);
        return r.ok ? r : { ok: false, defect: `correction not applicable: ${r.defect}` };
      };
      const res = await reviewTurn(ctx, role, { PROPOSAL: working, OUTER_BASE: base, BLOCKED_RETRY: blockedRetry }, applicable);
      blockedRetry = "";
      if (!res.ok) {
        addRow(rs, "stop", "—", identity(working), res.stop.cause);
        return { status: "stopped", stop: { ...res.stop, pending: working } };
      }
      const v = res.value;
      addRow(rs, role, res.pass, identity(working), verdictText(v));
      if (v.verdict === "VALID") {
        accepted = working; // recommendations are never applied (KR7)
        rs.lastRecommendations = v.recommendations;
        rs.validBy.push({ outer: rs.outer, role });
        break;
      }
      if (v.verdict === "BLOCKED") {
        if (rs.blockedRetryUsed) {
          addRow(rs, "stop", "—", identity(working), "persistent BLOCKED");
          return { status: "stopped", stop: { cause: "persistent BLOCKED", detail: `${role}: ${v.blocker}`, step: `${role} ${res.pass}`, resumeWith: v.resume_with, pending: working } };
        }
        rs.blockedRetryUsed = true;
        blockedRetry = `Your previous verdict was BLOCKED (${v.blocker}). The approved context is complete as supplied; review once more against it.`;
        continue;
      }
      working = res.derived.bytes;
      const key = `${role}:${identity(working)}`;
      if (seen.has(key)) {
        addRow(rs, "stop", "—", identity(working), "repeated A/B cycle");
        return { status: "stopped", stop: { cause: "repeated A/B cycle", detail: "the same proposal returned to the same reviewer", step: `${role} ${res.pass}`, pending: working } };
      }
      seen.add(key);
      role = role === "A" ? "B" : "A";
    }
    if (accepted === rs.canonical) {
      addRow(rs, "closure", "—", identity(accepted), "unchanged proposal VALID");
      return { status: "final" };
    }
    if (closureOnly) {
      addRow(rs, "stop", "—", identity(accepted), `cap ${rs.cap} reached; accepted change not applied`);
      return { status: "stopped", stop: { cause: "cap reached", detail: `cap ${rs.cap} reached; the accepted change cannot be applied`, step: "closure", pending: accepted } };
    }
    rs.pending = { base, accepted };
    const applied = await applyAccepted(ctx);
    if (applied.park) return { status: "park", failure: applied.park };
    if (!applied.ok) {
      addRow(rs, "stop", "—", applied.stop.observed, applied.stop.cause);
      return { status: "stopped", stop: { ...applied.stop, pending: accepted } };
    }
  }
}

/** KR14: dispose every created reviewer with observed exit. */
async function disposeReviewers(ctx) {
  const failures = [];
  const done = [];
  for (const role of ["A", "B"]) {
    const r = ctx.reviewers[role];
    if (!r || r.state === "closed") continue;
    const d = await disposeActor(ctx.run, r, "reconcile terminal cleanup");
    if (d.disposed) done.push(role);
    else failures.push(disposalFailure(r));
  }
  addRow(ctx.rs, "cleanup", "—", "—", failures.length ? `disposal not established: ${failures.join("; ")}` : `${done.join(", ") || "no reviewer"} disposed (observed exit)`);
  return failures;
}

/** KR11: after cleanup, the artifact must still be the reviewed canonical identity. */
async function finalReread(ctx) {
  const { rs } = ctx;
  const now = await readText(rs.artifact);
  if (now === rs.canonical) {
    addRow(rs, "freshness", "—", identity(now), "current");
    return null;
  }
  addRow(rs, "freshness", "—", identity(now), "drift");
  return { cause: "artifact changed after review", detail: `reviewed ${identity(rs.canonical)}, observed ${identity(now)}`, step: "final reread", pending: typeof now === "string" ? now : undefined, observed: identity(now) };
}

function newReviewState(request, { ownerScope = "root", delegation } = {}) {
  return {
    goal: request.goal,
    candidateIdentity: request.candidate.identity,
    artifact: request.candidate.artifact,
    context: request.context,
    mode: request.mode,
    cap: request.cap,
    approval: request.approval,
    validateArgv: request.validate?.argv,
    ownerScope,
    delegation,
    runOriginal: null,
    canonical: null,
    applications: 0,
    outer: 0,
    rows: [],
    validBy: [],
    invalidReturns: 0,
    blockedRetryUsed: false,
    pending: null,
    reviewers: {},
  };
}

/** Terminal sequence shared by fresh and resumed runs: cleanup first, then freshness, then report. */
async function concludeReconcile(ctx, loop) {
  const { rs } = ctx;
  if (loop.status === "park") return parkReconcile(ctx, loop.failure);
  const failures = await disposeReviewers(ctx);
  let stop = loop.stop ?? null;
  if (!stop && !failures.length && rs.mode === "artifact") stop = await finalReread(ctx);
  // KR14/KS6: reviewer exit not observed blocks success, including for a delegated caller.
  if (!stop && failures.length && ctx.reportOnly) stop = { cause: "cleanup failure", detail: failures.join("; "), step: "terminal cleanup" };
  const result = { status: stop ? "stopped" : "final", stop, rs, cleanupFailures: failures };
  if (ctx.reportOnly) return result;
  const cleanup = failures.length ? { complete: false, unresolved: [...failures, `session folder \`${ctx.run.sessionDir}\` and private root \`${ctx.run.dirs.root}\` kept`] } : await finishRun(ctx.run);
  if (!cleanup.complete) {
    result.status = "stopped";
    result.stop = stop ?? { cause: "cleanup failure", detail: cleanup.unresolved.join("; "), step: "terminal cleanup" };
    result.cleanupFailures = cleanup.unresolved;
  }
  const exitCode = !cleanup.complete ? EXIT.cleanup : result.status === "final" ? EXIT.final : EXIT.stopped;
  return { exitCode, markdown: `${renderReconcile(result)}\n${ctx.run.spend.render()}` };
}

const REPAIR = {
  application: (rs) => `restore \`${rs.artifact}\` byte-for-byte to the accepted outer base, then retry the application`,
  reread: (rs) => `restore \`${rs.artifact}\` byte-for-byte to the applied Correction identity, then retry the reread`,
  validation: () => "repair the validator or its availability without changing the applied bytes, then retry validation",
};

/** KR13 park: keep both reviewer sessions resumable; persist state; stop with an exact resume frontier. */
async function parkReconcile(ctx, failure) {
  const { rs, run } = ctx;
  const actors = ["A", "B"].map((r) => ctx.reviewers[r]).filter(Boolean);
  addRow(rs, "park", "—", failure.observed, `${failure.step} failed; reviewers parked`);
  const parked = await parkRun(run, actors, { reconcile: rs, failure, roles: Object.keys(ctx.reviewers), models: ctx.deps.roles });
  const stop = {
    cause: `${failure.step} failed`,
    detail: failure.error,
    step: failure.step,
    pending: rs.pending.accepted,
    observed: failure.observed,
    resume: [
      `accepted outer base ${identity(rs.pending.base)}`,
      `Correction ${identity(rs.pending.accepted)}`,
      `observed ${failure.observed}`,
      `failed step \`${failure.step}\`: ${failure.error}`,
      `repair: ${REPAIR[failure.step](rs)}`,
      "authority: the human's authorization of that exact repair in the root session",
      `resume: \`cli.mjs resume ${run.runId}\` with {"repair": {"authority": "<human words>", "step": "${failure.step}"}}; abandon: \`cli.mjs dispose ${run.runId}\``,
    ],
  };
  const result = { status: "parked", stop, rs, cleanupFailures: parked.failures };
  if (!parked.parked) {
    stop.resume.unshift(`reviewer exit not observed: ${parked.failures.join("; ")}`);
    return { exitCode: EXIT.cleanup, markdown: `${renderReconcile(result)}\n${run.spend.render()}` };
  }
  return { exitCode: EXIT.stopped, markdown: `${renderReconcile(result)}\n${run.spend.render()}` };
}

const BEGIN_FIELDS = ["Caller", "Parent", "Controller", "Scope", "Scope approval locator", "Scope contract locator", "Candidate locator", "Evidence manifest locator", "Mode", "Authorization locator"];

/** Parses a closed LF body: exact first line, then each field once in order. */
function parseClosedBody(body, operation, fields) {
  const lines = typeof body === "string" ? body.split("\n") : [];
  if (lines[0] !== operation) return { ok: false, problems: [`first line must be \`${operation}\``] };
  if (lines.length !== fields.length + 1) return { ok: false, problems: [`${operation} needs exactly ${fields.length} fields and no blank or extra line`] };
  const values = {};
  const problems = [];
  fields.forEach((f, i) => {
    const line = lines[i + 1];
    const prefix = `${f}: `;
    if (!line.startsWith(prefix) || line.slice(prefix.length).trim() === "") problems.push(`line ${i + 2} must be \`${f}: <value>\``);
    else values[f] = line.slice(prefix.length);
  });
  return { ok: problems.length === 0, problems, values };
}

/** Delegated entry (spec-v3 §2.3 item 7): every begin-reconcile field is checked before any reviewer prompt. */
function validateBeginReconcile(request, { beginReconcile, records, ownerScope, authorizationSha256 }) {
  const parsed = parseClosedBody(beginReconcile, "begin-reconcile", BEGIN_FIELDS);
  if (!parsed.ok) return parsed.problems;
  const v = parsed.values;
  const problems = [];
  if (v.Caller !== "retrace") problems.push("Caller must be exactly `retrace`");
  if (v.Scope !== ownerScope) problems.push(`Scope must be the owning scope \`${ownerScope}\``);
  if (v.Mode !== "Conversation replacement") problems.push("Mode must be `Conversation replacement` (delegated Reconcile is report-only)");
  for (const f of ["Scope approval locator", "Scope contract locator", "Candidate locator", "Evidence manifest locator", "Authorization locator"]) if (!records.has(v[f])) problems.push(`${f} \`${v[f]}\` is not a frozen record`);
  if (!problems.length) {
    if (records.get(v["Candidate locator"]) !== request.candidate.text) problems.push("Candidate locator bytes differ from the candidate under review");
    if (sha256Text(records.get(v["Authorization locator"])) !== authorizationSha256) problems.push("Authorization locator bytes differ from the admitted candidate-ready body");
  }
  return problems;
}

/**
 * Reconcile entry (KR1–KR16). Top-level: returns `{ exitCode, markdown }`.
 * Delegated (`options.reportOnly`, from runScope): Conversation replacement of
 * the scope report with a scope-owned reviewer pair inside the caller's run;
 * returns the review result and never cleans up the run.
 */
export async function runReconcile(request, deps, options = {}) {
  const reportOnly = options.reportOnly === true;
  const approval = validateApproval(request, { reportOnly });
  const problems = [...approval.problems];
  if (reportOnly && approval.ok) problems.push(...validateBeginReconcile(request, options));
  if (problems.length) return reportOnly ? { status: "rejected", problems } : refused(problems);
  const rs = newReviewState(request, { ownerScope: reportOnly ? options.ownerScope : "root", delegation: reportOnly ? options.beginReconcile : undefined });
  if (rs.mode === "artifact") {
    const text = await readText(rs.artifact);
    if (typeof text !== "string") return refused([`artifact \`${rs.artifact}\` is unreadable (${text.error})`]);
    rs.canonical = text;
  } else rs.canonical = request.candidate.text;
  rs.runOriginal = rs.canonical;
  const run = reportOnly ? options.run : await openRun("reconcile", deps);
  const ctx = { run, deps, rs, reviewers: {}, reportOnly, prefix: reportOnly ? `${options.ownerScope}/` : "" };
  try {
    const loop = await reconcileLoop(ctx);
    return await concludeReconcile(ctx, loop);
  } finally {
    if (!reportOnly) leaveRun(run);
  }
}

/** Claim, `run.json`, `state.json`, matched processes and every PID to observe for one named run. */
async function runFacts(runId, deps) {
  const dirs = privateRootFor(runId, deps.tmpRoot);
  const sessionDir = sessionDirFor(runId, deps.sessionsRoot);
  const record = await readJsonIfExists(dirs.record).catch(() => undefined);
  const state = await readJsonIfExists(dirs.state).catch(() => undefined);
  const processes = processesForRun(await (deps.listProcesses ?? listProcesses)(), runId, deps.sessionsRoot);
  const ledgerPids = (state?.actors ?? []).flatMap((a) => (a.ledger?.pids ?? []).map((p) => p.pid));
  const pids = [...new Set([...(record?.pids ?? []), ...ledgerPids, ...processes.map((p) => p.pid)])].filter((pid) => Number.isInteger(pid) && pid > 0);
  return { dirs, sessionDir, record, state, processes, pids };
}

const presentLines = (present, processes) => {
  const commands = new Map(processes.map((p) => [p.pid, p.command]));
  return present.map((p) => `PID ${p.pid} ${p.result}${commands.has(p.pid) ? `: \`${commands.get(p.pid)}\`` : ""}`);
};

const NO_CLI_PATH = "there is no further CLI path for the kept paths: the run stays abandoned and keeps refusing new runs until the human deals with exactly these paths; the agent never removes them";

/**
 * KR13 resume: claims the run exclusively, requires phase `parked`, and
 * observes exit of every recorded or matched PID before `run.json` becomes
 * `active`. Then same private HOME and session folder, same-session restore of
 * each parked reviewer (`resumeSessionId`, no fresh-session fallback), then
 * only the exact failed step is retried before review continues.
 */
export async function resumeReconcile(runId, request, deps) {
  const claim = await claimRun(runId, deps);
  if (!claim.claimed && !claim.missingRoot) return { exitCode: EXIT.refused, markdown: renderRefusal(claim.refusal, [claim.reason]) };
  const facts = await runFacts(runId, deps);
  if (!facts.state && !facts.record) return { exitCode: EXIT.stopped, markdown: `## Reconcile stopped\n\n**Blocker**\n\n- no parked state for run \`${runId}\`\n\n${renderSpend([])}` };
  if (facts.record?.phase !== "parked" || !facts.state) {
    const why = !facts.record ? "no `run.json`" : !facts.state ? "no parked state" : `phase \`${facts.record.phase}\``;
    return { exitCode: EXIT.refused, markdown: renderRefusal("abandoned run cannot be resumed", [`run \`${runId}\` is not parked (${why})`, `dispose it only on the human's explicit instruction: \`cli.mjs dispose ${runId}\``]) };
  }
  const present = await observeRunPids(deps, facts.pids);
  if (present.length) {
    const lines = [...presentLines(present, facts.processes), `run \`${runId}\` unchanged: no reviewer restored and no process signalled; resume again only after these PIDs exit`];
    return { exitCode: EXIT.cleanup, markdown: `## Reconcile stopped\n\n**Blocker**\n\n${lines.map((l) => `- ${l}`).join("\n")}\n\n${renderSpend([])}` };
  }
  const { state } = facts;
  const run = reopenRun(runId, deps, facts);
  try {
    const rs = state.reconcile;
    // A resumed run keeps the models bound at its first call, never live modelRoles.
    const ctx = { run, deps: { ...deps, roles: state.models }, rs, reviewers: {}, reportOnly: false, prefix: "" };
    const failure = state.failure;
    if (request.repair.step !== failure.step) {
      const stop = { cause: "repair step mismatch", detail: `the parked failed step is \`${failure.step}\`, not \`${request.repair.step}\``, step: failure.step, pending: rs.pending.accepted, resume: [`run \`${runId}\` stays parked; resume with step \`${failure.step}\` or dispose it`] };
      return { exitCode: EXIT.stopped, markdown: `${renderReconcile({ status: "parked", stop, rs })}\n${run.spend.render()}` };
    }
    await setRunPhase(run, "active");
    addRow(rs, "resume", "—", identity(rs.pending.accepted), `repair authorized (${request.repair.authority}); retry \`${failure.step}\``);
    if (!state.models?.a || !state.models?.b) {
      addRow(rs, "stop", "—", identity(rs.pending.accepted), "parked models missing");
      return await concludeReconcile(ctx, { status: "stopped", stop: { cause: "reviewer identity lost", detail: "the parked run records no reviewer models; no reviewer is restored and nothing is rolled back", step: "resume", pending: rs.pending.accepted, resumeWith: "the human decides how to proceed; the applied bytes stay as observed" } });
    }
    let lost;
    for (const rec of state.actors) {
      const role = rec.name.slice(-1);
      try {
        ctx.reviewers[role] = await startActor(run, { name: rec.name, role: ctx.deps.roles[role.toLowerCase()], restore: rec });
      } catch (error) {
        lost = { role, error: error.code ?? error.message };
        break;
      }
    }
    if (lost) {
      addRow(rs, "stop", "—", identity(rs.pending.accepted), `reviewer ${lost.role} same-session restore failed`);
      return await concludeReconcile(ctx, { status: "stopped", stop: { cause: "reviewer identity lost", detail: `reviewer ${lost.role} session \`${state.actors.find((a) => a.name.endsWith(lost.role)).backendSessionId}\` could not be restored (${lost.error}); no fresh reviewer is created and nothing is rolled back`, step: "resume", pending: rs.pending.accepted, resumeWith: "the human decides how to proceed; the applied bytes stay as observed" } });
    }
    const retried = await applyAccepted(ctx, failure.step);
    if (retried.park) return await concludeReconcile(ctx, { status: "park", failure: retried.park });
    if (!retried.ok) return await concludeReconcile(ctx, { status: "stopped", stop: { ...retried.stop, pending: rs.pending?.accepted } });
    return await concludeReconcile(ctx, await reconcileLoop(ctx));
  } finally {
    leaveRun(run);
  }
}

const disposeRecord = (title, lines, spend = renderSpend([])) => `## ${title}\n\n**Run**\n\n${lines.map((l) => `- ${l}`).join("\n")}\n\n${spend}`;

/**
 * Disposal of a setup leftover (only `<tmpRoot>/.acp-controller-<runId>.init`
 * exists for the run). Claims nothing: removes only that folder once its
 * `claim-0` owner is gone or reused (or the claim is unreadable) and no
 * process matches the run. No reviewer can exist, because runtimes are created
 * only after the root is renamed into place. Never signals.
 */
async function disposeSetupLeftover(runId, initRoot, deps) {
  const holder = await readOwnerClaim(initRoot);
  const owner = await ownerState(holder, { observePid: deps.observePid, processStart: deps.processStart });
  if (owner === "live") return { exitCode: EXIT.refused, markdown: renderRefusal("run claimed by another controller", [`run \`${runId}\` is still being set up by a live controller (PID ${holder.pid})`]) };
  if (owner === "unknown") {
    return { exitCode: EXIT.refused, markdown: renderRefusal(OWNER_UNREADABLE, [`run \`${runId}\` setup owner PID ${holder.pid} is present but its start time cannot be compared, so it cannot be proven gone; nothing was changed`]) };
  }
  const processes = processesForRun(await (deps.listProcesses ?? listProcesses)(), runId, deps.sessionsRoot);
  if (processes.length) {
    const lines = [...processes.map((p) => `process ${p.pid}: \`${p.command}\``), `nothing was removed and no process was signalled; setup leftover \`${initRoot}\` stays as it is`];
    return { exitCode: EXIT.cleanup, markdown: disposeRecord("Dispose incomplete", lines) };
  }
  await fs.rm(initRoot, { recursive: true, force: true });
  return { exitCode: EXIT.final, markdown: disposeRecord("Run disposed", [`setup leftover \`${initRoot}\` removed: setup never finished and its owner is ${owner === "reused" ? "a reused PID" : "gone"}; nothing was claimed`]) };
}

/**
 * KR13 abandonment and abandoned-run disposal, only on the human's explicit
 * instruction: claims the run exclusively, observes exit of every recorded or
 * matched PID, then A4 cleanup. Never signals. A run without `run.json` is
 * named and kept. A run with only its `.init` setup leftover goes to
 * `disposeSetupLeftover`.
 */
export async function disposeRun(runId, deps) {
  const initRoot = initRootFor(runId, deps.tmpRoot);
  if ((await exists(initRoot)) && !(await exists(privateRootFor(runId, deps.tmpRoot).root)) && !(await exists(sessionDirFor(runId, deps.sessionsRoot)))) {
    return disposeSetupLeftover(runId, initRoot, deps);
  }
  const claim = await claimRun(runId, deps);
  if (!claim.claimed && !claim.missingRoot) return { exitCode: EXIT.refused, markdown: renderRefusal(claim.refusal, [claim.reason]) };
  const facts = await runFacts(runId, deps);
  if (!facts.record) {
    const folders = [];
    for (const f of [facts.sessionDir, facts.dirs.root]) if (await exists(f)) folders.push(f);
    if (!folders.length && !facts.processes.length) return { exitCode: EXIT.stopped, markdown: `## Dispose stopped\n\n**Blocker**\n\n- no run \`${runId}\`: no folder, \`run.json\` or process\n\n${renderSpend([])}` };
    const lines = [
      `run \`${runId}\` has no \`run.json\`: no session file can be attributed, so nothing was removed and no process was signalled`,
      ...folders.map((f) => `kept folder \`${f}\``),
      ...facts.processes.map((p) => `process ${p.pid}: \`${p.command}\``),
      NO_CLI_PATH,
    ];
    return { exitCode: EXIT.cleanup, markdown: disposeRecord("Dispose incomplete", lines) };
  }
  const present = await observeRunPids(deps, facts.pids);
  if (present.length) {
    return { exitCode: EXIT.cleanup, markdown: disposeRecord("Dispose incomplete", [...presentLines(present, facts.processes), `nothing was removed and no process was signalled; run \`${runId}\` stays as it is`]) };
  }
  const run = reopenRun(runId, deps, facts);
  try {
    const cleanup = await finishRun(run);
    const lines = cleanup.complete ? [`run \`${runId}\` disposed: every recorded PID exited, session folder and private root removed`] : [...cleanup.unresolved, ...(cleanup.keptRecord ? [NO_CLI_PATH] : [])];
    return { exitCode: cleanup.complete ? EXIT.final : EXIT.cleanup, markdown: disposeRecord(cleanup.complete ? "Run disposed" : "Dispose incomplete", lines, run.spend.render()) };
  } finally {
    leaveRun(run);
  }
}

/** KR15: `## Review rounds` plus `## Final proposal` or `## Reconcile stopped` (packed-label grammar). */
export function renderReconcile(result) {
  const { rs } = result;
  const out = ["## Review rounds", "", "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |", "|---|---|---|---|---|---|"];
  rs.rows.forEach((r, i) => out.push(`| ${i + 1} | ${r.outer} | ${cell(r.actor)} | ${r.pass} | ${r.identity} | ${cell(r.outcome)} |`));
  out.push("");
  if (result.status === "final") {
    out.push("## Final proposal", "");
    if (rs.mode === "conversation") out.push("**Proposal**", "", bullet(rs.canonical));
    else {
      const recs = rs.lastRecommendations ?? [];
      out.push("**Change summary**", "", `- ${rs.applications} applied change(s): ${identity(rs.runOriginal)} → ${identity(rs.canonical)}`, ...recs.map((r) => `- not applied: ${r}`), "");
      out.push("**Artifact**", "", `- ${rs.artifact}`, "", "**Current identity**", "", `- ${identity(rs.canonical)}`);
    }
    return `${out.join("\n")}\n`;
  }
  const s = result.stop;
  out.push("## Reconcile stopped", "", "**Candidate**", "", `- ${identity(rs.canonical)}`);
  const pendingId = s.observed ?? (s.pending !== undefined ? identity(s.pending) : undefined);
  if (pendingId && pendingId !== identity(rs.canonical)) out.push(`- ${pendingId}`);
  out.push("", "**Blocker**", "", `- ${s.cause}: ${s.detail} (step: ${s.step})`);
  const resume = s.resume ?? [s.resumeWith ? `resume with: ${s.resumeWith}` : "a new approved Reconcile run from the canonical identity above"];
  out.push("", "**Resume from**", "", ...resume.map((r) => `- ${r}`));
  return `${out.join("\n")}\n`;
}

// ------------------------------------------------------------------ Retrace

/** KT1/KT2: validates the approved scope table and its `requires` DAG; returns depths. */
export function validateScopeTable(table) {
  const problems = [];
  if (!isObj(table) || !Array.isArray(table.scopes) || table.scopes.length === 0) return { ok: false, problems: ["table.scopes must be a non-empty array"] };
  const ids = new Set();
  for (const s of table.scopes) {
    if (!isObj(s) || !nonEmpty(s.id) || ids.has(s.id)) problems.push(`duplicate or invalid scope id \`${s?.id}\``);
    else ids.add(s.id);
    if (!nonEmpty(s?.name)) problems.push(`scope \`${s?.id}\` lacks a name`);
    if (!nonEmpty(s?.objective)) problems.push(`scope \`${s?.id}\` lacks an authored objective`);
  }
  for (const s of table.scopes) {
    for (const link of ["requires", "sharedEvidence", "potentialConflict"]) {
      const l = s?.[link] ?? [];
      if (!Array.isArray(l)) problems.push(`scope \`${s?.id}\` ${link} must be an array`);
      else for (const r of l) if (!ids.has(r) || r === s.id) problems.push(`scope \`${s.id}\` ${link} names unknown or self scope \`${r}\``);
    }
  }
  const byId = new Map(table.scopes.map((s) => [s?.id, s]));
  const depth = new Map();
  const visiting = new Set();
  const dfs = (id) => {
    if (depth.has(id)) return depth.get(id);
    if (visiting.has(id)) throw new Error("cycle");
    visiting.add(id);
    const reqs = (Array.isArray(byId.get(id)?.requires) ? byId.get(id).requires : []).filter((r) => byId.has(r) && r !== id);
    const d = reqs.length ? 1 + Math.max(...reqs.map(dfs)) : 0;
    visiting.delete(id);
    depth.set(id, d);
    return d;
  };
  if (!problems.length) {
    try {
      for (const s of table.scopes) dfs(s.id);
    } catch {
      problems.push("`requires` graph has a cycle");
    }
  }
  return { ok: problems.length === 0, problems, depth };
}

const RESOLVED = (sc) => sc.review === "complete" && sc.freshness === "current" && (sc.disposition === "proposal" || sc.disposition === "no-change");
const SCOPE_RESULT_FIELDS = ["Parent", "Controller", "Scope", "Scope approval locator", "Scope contract locator", "Original candidate locator", "Final report locator", "Evidence manifest locator", "Review status", "Evidence freshness", "Evaluation disposition", "Result payload locator"];

/** Observes one manifest locator: exact-bytes sha256, `absent`, or `unreadable`. */
async function observe(locator) {
  try {
    return `sha256:${sha256Text(await fs.readFile(locator, "utf8"))}`;
  } catch (error) {
    return error.code === "ENOENT" ? "absent" : `unreadable (${error.code ?? "error"})`;
  }
}

function scopePrompt(ctx, sc, kind, values) {
  const r = ctx.request;
  const s = sc.scope;
  const all = {
    ROOT: r.root,
    SCOPE_ID: s.id,
    SCOPE_NAME: s.name,
    OBJECTIVE: s.objective,
    EVALUAND: s.evaluand ?? "",
    PROTECTED: JSON.stringify(s.protected ?? []),
    EXCLUSIONS: JSON.stringify([...(Array.isArray(r.exclusions) ? r.exclusions : [r.exclusions]), ...(s.exclusions ?? [])]),
    OBJECTIVES: JSON.stringify(r.objectives),
    CONSTRAINTS: JSON.stringify(r.constraints),
    EVIDENCE: r.evidence.map((e) => `${e.locator} (${e.role})`).join("\n") || "none",
    PREREQUISITES: sc.prerequisites || "none",
    EXAMPLE: exampleFor("candidate-ready"),
    CONTINUATION: "",
    DEFECT: "none",
    ...values,
  };
  return `Phase: ${kind}\nScope: ${s.id}\n\n${renderPrompt(ctx.deps.prompts.scope[kind], all)}`;
}

function inBoundary(ctx, locator) {
  const rel = path.relative(ctx.request.root, locator);
  return (rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel)) || ctx.request.evidence.some((e) => e.locator === locator);
}

/** Checks an admitted candidate-ready value against the scope's approved boundary. */
function candidateProblems(ctx, v) {
  const problems = [];
  if (v.report.split("\n")[0] !== "Kind: conversation") problems.push("report must start with the exact line `Kind: conversation`");
  for (const m of v.manifest) if (!path.isAbsolute(m.locator) || !inBoundary(ctx, m.locator)) problems.push(`manifest locator \`${m.locator}\` is outside the approved evidence boundary`);
  return problems;
}

/**
 * One scope expectation (evaluate) with C4 accounting. `source-need` and
 * `scope-paused` return to the same step; a repeated frontier stops.
 */
async function expectCandidate(ctx, sc, actor) {
  const validate = (data) => validateResult("evaluate", data);
  const frontiers = new Set();
  let invalid = 0;
  let kind = "evaluate";
  let extra = {};
  for (;;) {
    sc.events.push(kind === "evaluate" ? "evaluate" : kind);
    const out = await ask(ctx.run, actor, scopePrompt(ctx, sc, kind, extra), validate);
    let defects = out.defects ?? [];
    if (out.row === "candidate-valid") {
      const v = out.value;
      if (v.kind === "source-need" || v.kind === "scope-paused") {
        const key = v.kind === "source-need" ? `source:${JSON.stringify([...v.locators].sort())}` : `paused:${v.frontier}`;
        if (frontiers.has(key)) return { ok: false, stop: { review: v.kind === "scope-paused" ? "paused" : "stopped", frontier: v.kind === "scope-paused" ? v.frontier : `repeated source request ${v.locators.join(", ")}` } };
        frontiers.add(key);
        if (v.kind === "source-need") {
          const s = await supplySources(v.locators, (loc) => inBoundary(ctx, loc));
          sc.events.push(`source-need ${v.locators.join(", ")}`);
          extra = { CONTINUATION: `The parent answered your source request: ${s.SOURCE_STATUS}.\n\n${s.SOURCES}` };
        } else {
          sc.events.push(`scope-paused: ${v.frontier}`);
          extra = { CONTINUATION: `The parent recorded your frontier: ${v.frontier}\nNo further human input exists in this run. Finish the evaluation from the approved evidence, stating that frontier as a limit or blocker.` };
        }
        kind = "continue";
        continue;
      }
      defects = candidateProblems(ctx, v);
      if (!defects.length) return { ok: true, value: v };
    } else if (!out.c4) {
      return { ok: false, stop: { review: "stopped", frontier: `evaluation request closed as ${out.row}` } };
    }
    invalid++;
    if (invalid > C4_MAX_REASKS) return { ok: false, stop: { review: "stopped", frontier: `${invalid} invalid returns (${defects.join("; ") || out.row})` } };
    kind = "reask";
    extra = { DEFECT: defects.join("; ") || out.row };
  }
}

/** Freezes UTF-8 record bytes under a controller-held locator. */
function freeze(ctx, sc, name, text) {
  const locator = `frozen:${ctx.run.runId}/${sc.scope.id}/${name}`;
  ctx.records.set(locator, text);
  return locator;
}

/**
 * KS1: the root admits only the first scope-result per scope, after checking
 * the closed body, its bindings and every referenced record identity.
 */
export function admitAtRoot(root, scopeId, body) {
  if (root.admitted.has(scopeId)) return { admitted: false, problems: [`scope \`${scopeId}\` already has an admitted result; the first is kept`] };
  const parsed = parseClosedBody(body, "scope-result", SCOPE_RESULT_FIELDS);
  if (!parsed.ok) return { admitted: false, problems: parsed.problems };
  const v = parsed.values;
  const problems = [];
  if (v.Scope !== scopeId) problems.push(`Scope \`${v.Scope}\` is not \`${scopeId}\``);
  if (v.Parent !== root.parent) problems.push("Parent is not this root");
  for (const f of ["Scope approval locator", "Scope contract locator", "Original candidate locator", "Evidence manifest locator", "Result payload locator"]) if (!root.records.has(v[f])) problems.push(`${f} is not a readable frozen record`);
  if (v["Final report locator"] !== "none" && !root.records.has(v["Final report locator"])) problems.push("Final report locator is not a readable frozen record");
  if (!["provisional", "paused", "stopped", "complete"].includes(v["Review status"])) problems.push("invalid Review status");
  if (!["current", "stale", "unreadable"].includes(v["Evidence freshness"])) problems.push("invalid Evidence freshness");
  if (!["proposal", "no-change", "blocker"].includes(v["Evaluation disposition"])) problems.push("invalid Evaluation disposition");
  if (!problems.length) {
    const payload = JSON.parse(root.records.get(v["Result payload locator"]));
    if (payload.reviewStatus !== v["Review status"] || payload.freshness !== v["Evidence freshness"] || payload.disposition !== v["Evaluation disposition"] || payload.finalReport !== v["Final report locator"]) problems.push("duplicated statuses or locators differ from the result payload");
  }
  if (problems.length) return { admitted: false, problems };
  root.admitted.set(scopeId, v);
  return { admitted: true, values: v };
}

/**
 * KT4/KS6: evaluate → candidate-ready → freeze → begin-reconcile → delegated
 * report-only Reconcile (scope-owned A/B, disposed) → scope-result → root
 * admission → evaluator disposal. Resolves only after the evaluator's disposal
 * attempt; `permitFree` is true only on observed exit.
 */
async function runScope(ctx, sc) {
  const s = sc.scope;
  let evaluator;
  try {
    evaluator = await startActor(ctx.run, { name: `${s.id}/evaluator`, role: ctx.deps.roles.a });
    const cand = await expectCandidate(ctx, sc, evaluator);
    if (!cand.ok) {
      sc.review = cand.stop.review;
      sc.frontier = cand.stop.frontier;
    } else {
      const v = cand.value;
      sc.disposition = v.disposition;
      const originalLocator = freeze(ctx, sc, "candidate", v.report);
      sc.manifest = [];
      for (const m of v.manifest) sc.manifest.push({ ...m, observed: await observe(m.locator) });
      const manifestLocator = freeze(ctx, sc, "manifest", JSON.stringify(sc.manifest, null, 2));
      const approvalLocator = freeze(ctx, sc, "approval", JSON.stringify(ctx.request.approval));
      const contractLocator = freeze(ctx, sc, "contract", JSON.stringify(s, null, 2));
      const readyBody = ["candidate-ready", `Parent: ${ctx.parent}`, `Controller: ${s.id}/evaluator`, `Scope: ${s.id}`, `Scope approval locator: ${approvalLocator}`, `Scope contract locator: ${contractLocator}`, `Candidate locator: ${originalLocator}`, `Evidence manifest locator: ${manifestLocator}`].join("\n");
      const authLocator = freeze(ctx, sc, "authorization", readyBody);
      sc.events.push("candidate-ready admitted");
      const begin = ["begin-reconcile", "Caller: retrace", `Parent: ${ctx.parent}`, `Controller: ${s.id}/evaluator`, `Scope: ${s.id}`, `Scope approval locator: ${approvalLocator}`, `Scope contract locator: ${contractLocator}`, `Candidate locator: ${originalLocator}`, `Evidence manifest locator: ${manifestLocator}`, "Mode: Conversation replacement", `Authorization locator: ${authLocator}`].join("\n");
      sc.events.push("begin-reconcile");
      const review = await runReconcile(
        { goal: `Retrace scope ${s.id} (${s.name}): ${s.objective}`, candidate: { identity: originalLocator, text: v.report }, context: [`scope contract: ${JSON.stringify(s)}`, `evidence manifest: ${JSON.stringify(v.manifest)}`], mode: "conversation", cap: "none", approval: ctx.request.approval },
        ctx.deps,
        { reportOnly: true, ownerScope: s.id, run: ctx.run, beginReconcile: begin, records: ctx.records, authorizationSha256: sha256Text(readyBody) },
      );
      if (review.status === "rejected") {
        sc.review = "stopped";
        sc.frontier = `delegated Reconcile rejected: ${review.problems.join("; ")}`;
      } else {
        const rs = review.rs;
        sc.outerRounds = rs.outer;
        sc.reportUpdates = rs.applications;
        sc.validBy = rs.validBy;
        sc.reviewRows = rs.rows;
        sc.original = v.report;
        if (review.cleanupFailures.length) sc.cleanup.push(...review.cleanupFailures);
        sc.events.push(review.cleanupFailures.length ? `reviewer disposal not established: ${review.cleanupFailures.join("; ")}` : "reviewers disposed");
        if (review.status === "final") {
          sc.review = "complete";
          sc.report = rs.canonical;
        } else {
          sc.review = "stopped";
          sc.frontier = `${review.stop.cause}: ${review.stop.detail}`;
        }
      }
      // Freshness before acceptance.
      sc.freshness = await freshness(sc);
      const finalLocator = sc.report !== undefined ? freeze(ctx, sc, "final-report", sc.report) : "none";
      const payload = { originalCandidate: originalLocator, events: [...sc.events], finalReport: finalLocator, stop: sc.frontier ?? null, manifest: manifestLocator, changes: sc.report !== undefined && sc.report !== v.report ? `report replaced: ${identity(v.report)} → ${identity(sc.report)}` : "unchanged", reviewStatus: sc.review, freshness: sc.freshness, disposition: sc.disposition, blocker: sc.frontier ?? null };
      const payloadLocator = freeze(ctx, sc, "payload", JSON.stringify(payload, null, 2));
      const body = ["scope-result", ...SCOPE_RESULT_FIELDS.map((f) => `${f}: ${{ Parent: ctx.parent, Controller: `${s.id}/evaluator`, Scope: s.id, "Scope approval locator": approvalLocator, "Scope contract locator": contractLocator, "Original candidate locator": originalLocator, "Final report locator": finalLocator, "Evidence manifest locator": manifestLocator, "Review status": sc.review, "Evidence freshness": sc.freshness, "Evaluation disposition": sc.disposition, "Result payload locator": payloadLocator }[f]}`)].join("\n");
      sc.events.push("scope-result");
      const admitted = admitAtRoot(ctx.root, s.id, body);
      if (admitted.admitted) sc.events.push("scope-result admitted");
      else {
        sc.review = "stopped";
        sc.frontier = `scope-result not admitted: ${admitted.problems.join("; ")}`;
      }
    }
  } catch (error) {
    sc.review = "stopped";
    sc.frontier = `scope actor failure: ${error.code ?? error.message}`;
  }
  if (!evaluator) {
    // Creation failed: only observed exit of every recorded PID frees the permit.
    const created = ctx.run.actors.get(`${s.id}/evaluator`);
    const present = created ? await observeParkedPids(ctx.run, [actorRecord(created)]) : [];
    sc.cleanup.push(...present);
    return { permitFree: present.length === 0 };
  }
  const d = await disposeActor(ctx.run, evaluator, "scope complete");
  if (!d.disposed) {
    sc.cleanup.push(disposalFailure(evaluator));
    sc.events.push("evaluator disposal not established");
    return { permitFree: false };
  }
  sc.events.push("evaluator disposed");
  return { permitFree: true };
}

async function freshness(sc) {
  if (!sc.manifest) return "unreadable";
  let state = "current";
  for (const m of sc.manifest) {
    const now = await observe(m.locator);
    if (now !== m.observed) state = now.startsWith("unreadable") && !m.observed.startsWith("unreadable") ? "unreadable" : "stale";
  }
  return state;
}

/**
 * Retrace scheduler (KT2–KT5, KS5–KS7): ascending `requires` depth then
 * authored order; at most MAX_DIRECT_ACTORS direct actors; a permit frees only
 * after the scope evaluator's observed exit. Failed scopes keep siblings.
 */
export async function runRetrace(request, deps) {
  const table = validateScopeTable(request.table);
  const problems = [...table.problems];
  if (!nonEmpty(request.root) || !path.isAbsolute(request.root)) problems.push("root must be an absolute path");
  else {
    const st = await fs.stat(request.root).catch(() => null);
    if (!st?.isDirectory()) problems.push(`root \`${request.root}\` is not a readable directory`);
  }
  if (!isObj(request.approval) || !nonEmpty(request.approval.text) || !nonEmpty(request.approval.at)) problems.push("approval must be {text, at} from the human");
  if (problems.length) return refused(problems);
  const order = request.table.scopes.map((s, i) => ({ s, i })).sort((a, b) => table.depth.get(a.s.id) - table.depth.get(b.s.id) || a.i - b.i).map((x) => x.s);
  const run = await openRun("retrace", deps);
  const records = new Map();
  const ctx = { run, deps, request, records, parent: `retrace:${run.runId}`, root: null };
  ctx.root = { parent: ctx.parent, records, admitted: new Map() };
  const scopes = new Map(order.map((s) => [s.id, { scope: s, depth: table.depth.get(s.id), state: "pending", events: [], cleanup: [], validBy: [], outerRounds: 0, reportUpdates: 0 }]));
  try {
    let active = 0;
    const running = new Map();
    for (;;) {
      for (const sc of scopes.values()) {
        if (sc.state !== "pending") continue;
        const reqs = sc.scope.requires ?? [];
        const failed = reqs.filter((r) => scopes.get(r).state === "done" && !RESOLVED(scopes.get(r)));
        if (failed.length) {
          sc.state = "done";
          sc.review = "stopped";
          sc.frontier = `prerequisite ${failed.join(", ")} has no current resolved result`;
        }
      }
      const ready = [...scopes.values()].filter((sc) => sc.state === "pending" && (sc.scope.requires ?? []).every((r) => RESOLVED(scopes.get(r)) && scopes.get(r).state === "done"));
      for (const sc of ready) {
        if (active >= MAX_DIRECT_ACTORS) break;
        active++;
        sc.state = "running";
        sc.prerequisites = (sc.scope.requires ?? []).map((r) => `${r}: ${identity(scopes.get(r).report)}\n${scopes.get(r).report}`).join("\n\n");
        running.set(sc.scope.id, runScope(ctx, sc).then((r) => ({ sc, ...r })));
      }
      if (!running.size) break;
      const { sc, permitFree } = await Promise.race(running.values());
      running.delete(sc.scope.id);
      sc.state = "done";
      if (permitFree) active--;
    }
    for (const sc of scopes.values()) if (sc.state === "pending") Object.assign(sc, { state: "done", review: "stopped", frontier: sc.frontier ?? "no direct capacity: undisposed scope actors hold every permit" });
    // Freshness again immediately before the aggregate; drift propagates through `requires` only.
    for (const sc of scopes.values()) if (sc.review === "complete") sc.freshness = await freshness(sc);
    let changed = true;
    while (changed) {
      changed = false;
      for (const sc of scopes.values()) {
        if (sc.freshness !== "current" || sc.review !== "complete") continue;
        const bad = (sc.scope.requires ?? []).filter((r) => scopes.get(r).freshness !== "current");
        if (bad.length) {
          sc.freshness = "stale";
          sc.frontier = `prerequisite ${bad.join(", ")} is no longer current`;
          changed = true;
        }
      }
    }
    const cleanup = await finishRun(run);
    const cleanupFailures = [...[...scopes.values()].flatMap((sc) => sc.cleanup), ...(cleanup.complete ? [] : cleanup.unresolved)];
    const resolved = [...scopes.values()].filter(RESOLVED).length;
    const aggregate = resolved === scopes.size && !cleanupFailures.length ? "complete" : resolved > 0 ? "partial" : "blocked";
    const markdown = `${renderRetrace({ request, scopes: [...scopes.values()], aggregate, cleanupFailures })}\n${run.spend.render()}`;
    return { exitCode: cleanupFailures.length ? EXIT.cleanup : aggregate === "complete" ? EXIT.final : EXIT.stopped, markdown };
  } finally {
    leaveRun(run);
  }
}

function fenced(text) {
  const fence = "`".repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map((m) => m[0].length + 1)));
  return [`${fence}text`, text, fence];
}

/**
 * The scope-authored **Aggregate summary** of a report as Markdown list lines,
 * or null. The Retrace skill fixes only the bold label, so both
 * `**Aggregate summary**` and `**Aggregate summary:** <text>` open it; text on
 * the label line is its first entry. It ends at the next heading or bold label.
 */
function aggregateSummary(report) {
  const lines = report.split("\n");
  const label = /^\*\*Aggregate summary(?::\*\*|\*\*:?)\s*(.*)$/;
  const i = lines.findIndex((l) => label.test(l.trim()));
  if (i < 0) return null;
  const inline = label.exec(lines[i].trim())[1];
  const out = inline ? [`- ${inline}`] : [];
  for (const l of lines.slice(i + 1)) {
    if (/^#{1,6} /.test(l) || /^\*\*[^*]+\*\*$/.test(l.trim())) break;
    if (l.trim() === "") continue;
    // Keep nested list items nested; every other line becomes a top-level item.
    out.push(/^\s+- /.test(l) ? l.trimEnd() : `- ${l.trim().replace(/^- /, "")}`);
  }
  return out.length ? out : null;
}

/** KT5: the four aggregate sections in order. */
function renderRetrace({ request, scopes, aggregate, cleanupFailures }) {
  const resolved = scopes.filter(RESOLVED);
  const counts = ["proposal", "no-change", "blocker"].map((d) => `${d} ${scopes.filter((s) => s.disposition === d).length}`).join(", ");
  const blockers = scopes.filter((s) => s.frontier).map((s) => `${s.scope.id}: ${s.frontier}`);
  const out = ["## Result", "", "**Aggregate**", "", `- ${aggregate}`, `- resolved scopes: ${resolved.length} of ${scopes.length}`, `- dispositions: ${counts}`];
  for (const b of blockers) out.push(`- frontier ${b}`);
  for (const c of cleanupFailures) out.push(`- cleanup not established: ${c}`);
  out.push("- evaluation only: no implementation was performed", "");
  out.push("## Scope Results", "", "| Scope | Disposition | Outer rounds | Report updates | VALID by round |", "|---|---|---|---|---|");
  for (const sc of scopes) {
    const valid = sc.validBy.map((v) => `${v.outer}: ${v.role}`);
    if (sc.review === "stopped" && sc.outerRounds > sc.validBy.length) valid.push(`${sc.outerRounds}: none`);
    out.push(`| ${sc.scope.id} ${cell(sc.scope.name)} | ${sc.disposition ?? "none"} | ${sc.outerRounds} | ${sc.reportUpdates} | ${valid.join("; ") || "none"} |`);
  }
  for (const sc of scopes) {
    out.push("", `### ${sc.scope.id} ${sc.scope.name}`, "", "**Review status**", "", `- ${sc.review ?? "stopped"}`, "", "**Evidence freshness**", "", `- ${sc.freshness ?? "unreadable"}`);
    if (sc.frontier) out.push("", "**Frontier**", "", `- ${sc.frontier}`);
  }
  out.push("", "## Findings and Directions");
  for (const sc of scopes) {
    if (sc.report === undefined) continue;
    const summary = aggregateSummary(sc.report);
    out.push("", `### ${sc.scope.id} ${sc.scope.name}`, "", "**Finding and direction**", "", ...(summary ?? ["- the reviewed report carries no scope-authored Aggregate summary; its complete text is under Evidence and Limits"]));
  }
  if (!scopes.some((sc) => sc.report !== undefined)) out.push("", "**Findings**", "", "- no reviewed report exists");
  out.push("", "## Evidence and Limits", "", "**Approved table**", "", "| Scope | Evaluate |", "|---|---|");
  for (const s of request.table.scopes) out.push(`| ${s.id} ${cell(s.name)} | ${cell(s.objective)} |`);
  out.push("", "**Approval**", "", `- ${request.approval.text} (${request.approval.at})`);
  for (const sc of scopes) {
    out.push("", `### ${sc.scope.id} ${sc.scope.name}`, "", "**Events**", "", ...sc.events.map((e) => `- ${e}`));
    if (sc.manifest) out.push("", "**Manifest**", "", ...sc.manifest.map((m) => `- ${m.locator} (${m.role}) ${m.observed}`));
    if (sc.original !== undefined) out.push("", "**Provisional-to-final**", "", `- ${sc.report !== undefined && sc.report !== sc.original ? `report replaced: ${identity(sc.original)} → ${identity(sc.report)}` : `unchanged ${identity(sc.original)}`}`);
    if (sc.report !== undefined) out.push("", "**Reviewed report**", "", ...fenced(sc.report));
  }
  return `${out.join("\n")}\n`;
}

// ------------------------------------------------------------------ normalizer

/** KT1 optional normalizer: one `scope-proposal` for human approval. */
export async function runNormalize(request, deps) {
  if (!nonEmpty(request.root) || !path.isAbsolute(request.root)) return refused(["root must be an absolute path"]);
  const run = await openRun("normalize", deps);
  try {
    let result;
    let stop;
    try {
      const actor = await startActor(run, { name: "normalizer", role: deps.roles.a });
      const validate = (data) => {
        const v = validateResult("normalize", data);
        if (!v.valid) return v;
        const t = validateScopeTable({ scopes: v.value.scopes });
        return t.ok ? v : { valid: false, variant: v.variant, defects: t.problems };
      };
      let invalid = 0;
      let kind = "normalize";
      let extra = {};
      for (;;) {
        const values = { ROOT: request.root, CONCERNS: JSON.stringify(request.concerns, null, 2), INPUT: typeof request.input === "string" ? request.input : JSON.stringify(request.input, null, 2), EXAMPLE: exampleFor("scope-proposal"), DEFECT: "none", ...extra };
        const out = await ask(run, actor, `Phase: ${kind}\n\n${renderPrompt(deps.prompts.scope[kind], values)}`, validate);
        if (out.row === "candidate-valid") {
          result = out.value;
          break;
        }
        if (!out.c4) {
          stop = `normalization request closed as ${out.row}`;
          break;
        }
        invalid++;
        if (invalid > C4_MAX_REASKS) {
          stop = `${invalid} invalid returns (${(out.defects ?? []).join("; ")})`;
          break;
        }
        kind = "reask";
        extra = { DEFECT: (out.defects ?? []).join("; ") || out.row };
      }
    } catch (error) {
      stop = `normalizer failure: ${error.code ?? error.message}`;
    }
    const cleanup = await finishRun(run);
    const out = [];
    if (result && !stop) {
      out.push("## Scope proposal", "", "| Scope | Evaluate |", "|---|---|", ...result.scopes.map((s) => `| ${s.id} ${cell(s.name)} | ${cell(s.objective)} |`), "", "**Graph**", "");
      const edges = result.scopes.flatMap((s) => [...(s.requires ?? []).map((r) => `- ${s.id} requires ${r}`), ...(s.sharedEvidence ?? []).map((r) => `- ${s.id} shares evidence with ${r}`), ...(s.potentialConflict ?? []).map((r) => `- ${s.id} may conflict with ${r}`)]);
      out.push(...(edges.length ? edges : ["- no edges"]), "", "**Coverage**", "", ...result.coverage.map((c) => `- ${c.concern} → ${c.scopes.join(", ")}`));
    } else out.push("## Normalization stopped", "", "**Blocker**", "", `- ${stop}`);
    if (!cleanup.complete) out.push("", "**Cleanup**", "", ...cleanup.unresolved.map((u) => `- ${u}`));
    return { exitCode: !cleanup.complete ? EXIT.cleanup : result && !stop ? EXIT.final : EXIT.stopped, markdown: `${out.join("\n")}\n\n${run.spend.render()}` };
  } finally {
    leaveRun(run);
  }
}
