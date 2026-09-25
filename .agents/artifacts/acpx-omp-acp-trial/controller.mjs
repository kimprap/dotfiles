// T2 semantic controller (spec acpx-omp-acp-trial/spec-v9, "Architecture and
// guarded semantics"). One coded controller owns approvals, bindings, reviewer
// progression, scopes/dependencies, budgets, application, validation,
// freshness and admission. Every native effect goes through injected ports;
// the controller never imports acpx, reads session files or parses prose.
//
// Ports (all async):
//   reviewer(role, ownerScope) -> { id, backendSessionId }   lazy creation (KR4/KR5)
//   ask(reviewer, request)     -> A1 closure outcome { row, value?, defects?, requestId }
//   supplySource(locators)     -> { status: "supplied" | "refused", sources? }
//   artifact.read() / artifact.write(bytes)                   Artifact edits only
//   validate(bytes)            -> { ok, error? }               Artifact edits only
//   dispose(actor)             -> { observedExit: boolean, detail? }
//   now()                      -> monotonic ms (controlled clock offline)
// Offline replay injects scripted ports; native execution injects adapter ports.
import { createHash } from "node:crypto";

export const C4_MAX_REASKS = 3;
export const MAX_DIRECT_ACTORS = 4;
const digest = (s) => createHash("sha256").update(s).digest("hex");

export class InvariantViolation extends Error {
  constructor(invariant, snapshot) {
    super(`controller invariant violated: ${invariant}`);
    this.code = "INVARIANT_VIOLATION";
    this.invariant = invariant;
    this.snapshot = snapshot;
  }
}

/** B5 fail-fast: freeze the enumerated diagnostic state before any cleanup mutates it. */
export function invariant(cond, name, snapshotFn) {
  if (cond) return;
  const snap = snapshotFn ? snapshotFn() : {};
  throw new InvariantViolation(name, deepFreeze(JSON.parse(JSON.stringify({ invariant: name, ...snap }))));
}

function deepFreeze(o) {
  if (o && typeof o === "object") {
    for (const v of Object.values(o)) deepFreeze(v);
    Object.freeze(o);
  }
  return o;
}

// ------------------------------------------------------------------ approval (KR1-KR3, KR2)

const MODES = new Map([
  ["conversation replacement", "conversation"],
  ["conversation", "conversation"],
  ["artifact edits", "artifact"],
  ["artifact", "artifact"],
]);

/**
 * Validates the exact five-field brief and its human approval provenance.
 * The LLM inferred the candidate before the runner (KR1); the runner rejects
 * missing/ambiguous approval, invalid mode/cap or unreadable sole-source candidate.
 */
export function validateApproval(brief) {
  const problems = [];
  const fields = ["goal", "candidate", "context", "mode", "maxOuterIterations"];
  if (!brief || typeof brief !== "object") return { ok: false, problems: ["brief is not an object"] };
  for (const f of fields) if (brief[f] === undefined || brief[f] === null || brief[f] === "") problems.push(`missing brief field ${f}`);
  const extra = Object.keys(brief).filter((k) => !fields.includes(k) && k !== "approval");
  if (extra.length) problems.push(`brief has non-brief fields: ${extra.join(",")}`);
  const mode = MODES.get(String(brief.mode ?? "").trim().toLowerCase());
  if (!mode) problems.push("mode must be Conversation replacement or Artifact edits");
  let cap;
  if (brief.maxOuterIterations === "none") cap = "none";
  else if (Number.isInteger(brief.maxOuterIterations) && brief.maxOuterIterations > 0) cap = brief.maxOuterIterations;
  else problems.push("maximum controller-applied outer iterations must be `none` or a positive integer");
  const c = brief.candidate;
  if (c && typeof c === "object") {
    if (mode === "conversation" && typeof c.text !== "string") problems.push("Conversation replacement needs the candidate text (unresolved candidate)");
    if (mode === "artifact" && typeof c.path !== "string") problems.push("Artifact edits needs one sole-source artifact path");
    if (mode === "artifact" && typeof c.text === "string") problems.push("Artifact edits must not carry a delegated conversation fallback");
  } else if (brief.candidate !== undefined) problems.push("candidate must be an object {text} or {path}");
  const a = brief.approval;
  if (!a || a.approvedBy !== "human" || typeof a.at !== "string" || a.fiveFields !== true) problems.push("missing or ambiguous human approval of the exact five-field brief");
  return { ok: problems.length === 0, problems, mode, cap };
}

// ------------------------------------------------------------------ corrections (KR8)

function applyEdits(base, edits) {
  let out = base;
  // Complete exact edit set against the unchanged outer base: each `old`
  // occurs exactly once in the base and edits do not overlap.
  const spans = [];
  for (const e of edits) {
    const i = base.indexOf(e.old);
    if (i < 0 || base.indexOf(e.old, i + 1) >= 0) return { ok: false, defect: `edit old text must occur exactly once in the outer base: ${JSON.stringify(e.old.slice(0, 60))}` };
    spans.push({ i, j: i + e.old.length, e });
  }
  spans.sort((a, b) => a.i - b.i);
  for (let k = 1; k < spans.length; k++) if (spans[k].i < spans[k - 1].j) return { ok: false, defect: "edits overlap" };
  out = "";
  let at = 0;
  for (const s of spans) {
    out += base.slice(at, s.i) + s.e.new;
    at = s.j;
  }
  out += base.slice(at);
  return { ok: true, bytes: out };
}

/** Correction applicability: complete, applicable, and actually changes the working proposal. */
export function applyCorrection(mode, base, working, correction) {
  const r = mode === "artifact" ? applyEdits(base, correction.edits) : { ok: true, bytes: correction.replacement };
  if (!r.ok) return r;
  if (r.bytes === working) return { ok: false, defect: "correction does not change the current proposal" };
  return r;
}

// ------------------------------------------------------------------ expectations (C4, A1)

const C4_ROWS = new Set(["candidate-invalid", "completed-no-result"]);

/**
 * One original expectation with its shared C4 allowance (KR12). New request
 * IDs, category changes and source-supply continuations never reset it.
 * Returns { ok: true, value } or { ok: false, stop }.
 */
async function expectResult(ctl, reviewer, request, applicable) {
  const exp = { id: `${reviewer.role}:${request.phase}:${ctl.seq++}`, invalidReturns: 0, reasks: 0, sourceRequests: [] };
  ctl.expectations.push(exp);
  let req = { ...request, expectationId: exp.id };
  for (;;) {
    const out = await ctl.ports.ask(reviewer, req);
    ctl.log({ type: "reply", role: reviewer.role, owner: reviewer.ownerScope, phase: req.phase, basePhase: request.phase, expectationId: exp.id, requestId: out.requestId, row: out.row, kind: out.value?.kind, verdict: out.value?.verdict });
    if (out.row === "candidate-valid") {
      const v = out.value;
      if (v.kind === "source-need") {
        const key = JSON.stringify([...v.locators].sort());
        if (exp.sourceRequests.includes(key)) return { ok: false, stop: { cause: "repeated-source-request", expectationId: exp.id } };
        exp.sourceRequests.push(key);
        const supplied = await ctl.ports.supplySource(v.locators);
        ctl.log({ type: "source", expectationId: exp.id, status: supplied.status, locators: v.locators });
        // Source-need continues the same pass; it cannot trigger another rethink.
        req = { ...request, expectationId: exp.id, continuation: "source", supplied };
        continue;
      }
      const check = applicable ? applicable(v) : { ok: true };
      if (check.ok) return { ok: true, value: v, requestId: out.requestId, derived: check };
      out.defects = [check.defect];
    } else if (!C4_ROWS.has(out.row)) {
      // No C4 charge: delivery uncertainty, controller stop, failed/cancelled
      // turn, unavailable window/session, evidence fault.
      return { ok: false, stop: { cause: out.row, expectationId: exp.id, requestId: out.requestId } };
    }
    exp.invalidReturns++;
    if (exp.invalidReturns > C4_MAX_REASKS) return { ok: false, stop: { cause: "c4-exhausted", expectationId: exp.id, invalidReturns: exp.invalidReturns } };
    exp.reasks++;
    req = { ...request, expectationId: exp.id, reask: { defects: out.defects ?? [] } };
  }
}

/** KR6: first real review in a reviewer session is initial -> same-session rethink -> post-rethink. */
async function reviewTurn(ctl, reviewer, proposal, extra, applicable) {
  if (!reviewer.firstActualReviewComplete) {
    const initial = await expectResult(ctl, reviewer, { phase: "initial", proposal, ...extra }, null);
    if (!initial.ok) return initial;
    // The initial response is provisional and never acted on.
    const post = await expectResult(ctl, reviewer, { phase: "rethink", proposal, provisional: initial.value, ...extra }, applicable);
    if (post.ok) reviewer.firstActualReviewComplete = true;
    return post;
  }
  return expectResult(ctl, reviewer, { phase: "later", proposal, ...extra }, applicable);
}

// ------------------------------------------------------------------ Reconcile (KR1-KR16)

/**
 * Runs one Reconcile review. `reportOnly` (scope-delegated) may replace only
 * the report (KR16). Returns a result with status final|stopped|rejected.
 */
export async function runReconcile({ brief, ports, reportOnly = false, ownerScope = "root", reviewers: shared, log = () => {} }) {
  const approval = validateApproval(brief);
  const events = [];
  const ctl = { ports, seq: 0, expectations: [], log: (e) => { const x = { at: ports.now(), owner: ownerScope, ...e }; events.push(x); log(x); } };
  if (!approval.ok) return { status: "rejected", problems: approval.problems, events };
  const mode = approval.mode;
  if (reportOnly && mode !== "conversation") return { status: "rejected", problems: ["scope-delegated Reconcile is report-only (Conversation replacement of its report)"], events };
  const cap = approval.cap;
  let canonical;
  if (mode === "artifact") {
    const r = await ports.artifact.read();
    if (typeof r !== "string") return { status: "rejected", problems: ["unreadable sole-source artifact"], events };
    canonical = r;
  } else canonical = brief.candidate.text;
  const runOriginal = canonical;
  const reviewers = shared ?? {};
  const getReviewer = async (role) => {
    if (!reviewers[role]) {
      const h = await ports.reviewer(role, ownerScope);
      reviewers[role] = { role, ownerScope, id: h.id, backendSessionId: h.backendSessionId, firstActualReviewComplete: false, state: "active" };
      ctl.log({ type: "reviewer-created", role });
    }
    return reviewers[role];
  };
  const review = { runOriginal, canonical, applications: 0, cap, closureOnly: false, blockedRetryUsed: false, seenFrontiers: new Set(), rounds: [] };
  let stop;
  let outer = 0;
  outerLoop: for (;;) {
    outer++;
    const base = review.canonical; // immutable outer base
    let working = base;
    const lineage = [];
    review.closureOnly = cap !== "none" && review.applications >= cap;
    const round = { iteration: outer, closureOnly: review.closureOnly, turns: [], outcome: undefined };
    review.rounds.push(round);
    ctl.log({ type: "outer-start", iteration: outer, closureOnly: review.closureOnly, baseDigest: digest(base) });
    let role = "A"; // KR5: A starts every outer iteration, including closure
    const cycle = new Set();
    const pairs = new Set();
    let accepted;
    let blockedContext;
    for (;;) {
      const reviewer = await getReviewer(role);
      invariant(reviewer.ownerScope === ownerScope, "reviewer-owner-binding", () => ({ role, reviewerOwner: reviewer.ownerScope, ownerScope }));
      const applicable = (v) => {
        if (v.kind !== "review") return { ok: false, defect: "expected a review verdict" };
        if (v.verdict !== "REVISE") return { ok: true };
        const r = applyCorrection(mode, base, working, v.correction);
        return r.ok ? { ok: true, bytes: r.bytes } : { ok: false, defect: `correction not applicable: ${r.defect}` };
      };
      const res = await reviewTurn(ctl, reviewer, working, { role, iteration: outer, base, mode, runOriginal, ...(blockedContext ? { blockedRetry: blockedContext } : {}) }, applicable);
      blockedContext = undefined;
      if (!res.ok) {
        stop = res.stop;
        break outerLoop;
      }
      const v = res.value;
      round.turns.push({ role, verdict: v.verdict, rationale: v.rationale ?? null, requestId: res.requestId, recommendationsIgnored: v.recommendationCount ?? 0 });
      // A reviewer repeating the same REVISE label on the same proposal adds no evidence.
      const pairKey = `${role}:${v.verdict}:${digest(working)}`;
      if (v.verdict === "REVISE" && pairs.has(pairKey)) {
        stop = { cause: "label-reviewer-pair-without-new-evidence", role, verdict: v.verdict };
        break outerLoop;
      }
      pairs.add(pairKey);
      if (v.verdict === "VALID") {
        accepted = working; // exact current proposal; recommendations never applied (KR7)
        break;
      }
      if (v.verdict === "BLOCKED") {
        // KR9: one approved-context retry, then persistent BLOCKED stops.
        if (review.blockedRetryUsed) {
          stop = { cause: "persistent-blocked", role, reason: v.reason };
          break outerLoop;
        }
        review.blockedRetryUsed = true;
        blockedContext = { reason: v.reason, approvedContext: brief.context };
        ctl.log({ type: "blocked-retry", role });
        continue;
      }
      // REVISE: update only the ephemeral working proposal (KR7/KR8).
      working = res.derived.bytes;
      lineage.push({ role, digest: digest(working) });
      const counterpart = role === "A" ? "B" : "A";
      const cycleKey = `${counterpart}:${digest(working)}`;
      if (cycle.has(cycleKey)) {
        stop = { cause: "repeated-ab-cycle" };
        break outerLoop;
      }
      cycle.add(cycleKey);
      role = counterpart; // B only on applicable finalized REVISE needing counterpart
    }
    round.acceptedDigest = digest(accepted);
    if (accepted === review.canonical) {
      round.outcome = "closure";
      if (mode === "artifact") {
        // KR11: the file must still be the accepted canonical bytes before the final report.
        const now = await ports.artifact.read();
        if (now !== review.canonical) stop = { cause: "terminal-drift", step: "final-reread", expected: digest(review.canonical), observed: now === undefined ? "unreadable" : digest(now) };
      }
      break; // first VALID of an unchanged proposal: final
    }
    if (review.closureOnly) {
      round.outcome = "cap";
      stop = { cause: "cap", iteration: outer };
      break;
    }
    // KR10: at most one application per outer iteration, then reread/count/validate.
    if (mode === "artifact") {
      const before = await ports.artifact.read();
      if (before !== review.canonical) {
        stop = { cause: "terminal-drift", step: "pre-application-reread", acceptedBase: digest(review.canonical), observed: before === undefined ? "unreadable" : digest(before) };
        break;
      }
      try {
        await ports.artifact.write(accepted);
      } catch (error) {
        stop = { cause: "failed-application", step: "write", acceptedBase: digest(review.canonical), correction: digest(accepted), error: error?.code ?? "error", repairAuthority: "identity-preserving repair of the exact failed step" };
        break;
      }
      const after = await ports.artifact.read(); // KR11 immediate terminal reread
      if (after !== accepted) {
        stop = { cause: "terminal-drift", step: "post-application-reread", expected: digest(accepted), observed: after === undefined ? "unreadable" : digest(after), repairAuthority: "identity-preserving repair of the exact failed step" };
        break;
      }
      const val = await ports.validate(after);
      if (!val.ok) {
        stop = { cause: "failed-validation", step: "validate", observed: digest(after), error: val.error ?? "invalid", repairAuthority: "identity-preserving repair of the exact failed step" };
        break;
      }
    }
    review.canonical = accepted;
    review.applications++;
    round.outcome = "applied";
    ctl.log({ type: "application", iteration: outer, count: review.applications, digest: digest(accepted) });
  }
  // KR14: close/dispose both actual reviewers; failed disposal prevents final success.
  const disposal = {};
  if (!shared) {
    for (const r of Object.values(reviewers)) {
      const d = await ports.dispose(r);
      r.state = d.observedExit ? "closed" : "closing";
      disposal[r.role] = d.observedExit;
      ctl.log({ type: "reviewer-disposed", role: r.role, observedExit: d.observedExit });
    }
  }
  const disposalOk = Object.values(disposal).every(Boolean);
  const status = stop ? "stopped" : disposalOk ? "final" : "stopped";
  if (!stop && !disposalOk) stop = { cause: "failed-disposal" };
  return {
    status,
    stop: stop ?? null,
    mode,
    cap,
    canonical: review.canonical,
    runOriginal,
    applications: review.applications,
    rounds: review.rounds,
    reviewersCreated: Object.keys(reviewers).sort(),
    reviewerFlags: Object.fromEntries(Object.values(reviewers).map((r) => [r.role, r.firstActualReviewComplete])),
    expectations: ctl.expectations,
    disposal,
    events,
  };
}

/** KR15: Review rounds + Final proposal or Reconcile stopped; reviewer text byte-for-byte. */
export function renderReconcile(result) {
  const out = ["## Review rounds", ""];
  for (const r of result.rounds ?? []) {
    out.push(`### Round ${r.iteration}${r.closureOnly ? " (closure-only)" : ""}`, "");
    for (const t of r.turns) {
      out.push(`- Reviewer ${t.role}: ${t.verdict}`);
      if (t.rationale !== null) out.push("", "```text", t.rationale, "```", "");
    }
  }
  if (result.status === "final") out.push("", "## Final proposal", "", "```text", result.canonical, "```");
  else out.push("", "## Reconcile stopped", "", `- cause: ${result.stop?.cause ?? result.status}`, `- applications: ${result.applications ?? 0}`);
  return `${out.join("\n")}\n`;
}

// ------------------------------------------------------------------ Retrace (KT1-KT5, KS1-KS7)

/** KT1/KT2: validates the human-approved scope table and its DAG. */
export function validateScopeTable(table) {
  const problems = [];
  if (!table || !Array.isArray(table.scopes) || table.scopes.length === 0) return { ok: false, problems: ["no scopes"] };
  if (typeof table.root !== "string" || !table.root.startsWith("/")) problems.push("bound repository root must be an absolute path");
  if (!table.approval || table.approval.approvedBy !== "human" || table.approval.fullTable !== true) problems.push("the complete scope table lacks human approval");
  const ids = new Set();
  for (const s of table.scopes) {
    if (typeof s.id !== "string" || ids.has(s.id)) problems.push(`duplicate or invalid scope id ${s.id}`);
    ids.add(s.id);
    if (typeof s.objective !== "string" || s.objective.trim() === "") problems.push(`scope ${s.id} lacks an authored objective`);
  }
  for (const s of table.scopes) {
    for (const link of ["requires", "sharedEvidence", "potentialConflict"]) {
      for (const r of s[link] ?? []) if (!ids.has(r) || r === s.id) problems.push(`scope ${s.id} ${link} unknown or self link ${r}`);
    }
  }
  const depth = new Map();
  const visiting = new Set();
  const byId = new Map(table.scopes.map((s) => [s.id, s]));
  const dfs = (id) => {
    if (depth.has(id)) return depth.get(id);
    if (visiting.has(id)) throw new Error("cycle");
    visiting.add(id);
    const reqs = (byId.get(id)?.requires ?? []).filter((r) => byId.has(r));
    const d = reqs.length ? 1 + Math.max(...reqs.map(dfs)) : 0;
    visiting.delete(id);
    depth.set(id, d);
    return d;
  };
  try {
    for (const s of table.scopes) dfs(s.id);
  } catch {
    problems.push("requires graph has a cycle");
  }
  return { ok: problems.length === 0, problems, depth };
}

const RESOLVED = (s) => s.review === "complete" && s.freshness === "current" && (s.disposition === "proposal" || s.disposition === "no-change");

/**
 * Runs the Retrace scheduler over an approved table. Scope ports:
 *   startScope(scope, prerequisites) -> actor { id, role: "evaluator", ownerScope }
 *   ask(actor, request)               -> A1 closure outcome (evaluate phase)
 *   reconcile(scope, candidate)       -> Reconcile result (report-only, scope-owned reviewers)
 *   readSource(locator)               -> sha256 | "absent" | "unreadable"
 *   admissibleLocator(locator)        -> boolean (evidence-locator closure)
 *   dispose(actor) / supplySource / now
 */
export async function runRetrace({ table, ports, log = () => {} }) {
  const v = validateScopeTable(table);
  const events = [];
  const emit = (e) => {
    const x = { at: ports.now(), ...e };
    events.push(x);
    log(x);
  };
  if (!v.ok) return { status: "rejected", problems: v.problems, events };
  const order = [...table.scopes].map((s, i) => ({ s, i })).sort((a, b) => v.depth.get(a.s.id) - v.depth.get(b.s.id) || a.i - b.i).map((x) => x.s);
  const state = new Map(table.scopes.map((s) => [s.id, { id: s.id, contract: s, requires: s.requires ?? [], state: "pending", review: null, freshness: null, disposition: null, admitted: null, manifest: null, childHandles: [], disposal: null }]));
  let active = 0;
  let peak = 0;
  const running = new Set();
  const intervals = {};
  const settle = async () => {
    for (;;) {
      let progressed = false;
      for (const s of order) {
        const st = state.get(s.id);
        if (st.state !== "pending") continue;
        const reqs = st.requires.map((r) => state.get(r));
        if (reqs.some((r) => ["stopped", "blocked-dependency", "unresolved", "stale"].includes(r.state) || (r.state === "resolved" && !RESOLVED(r)))) {
          st.state = "blocked-dependency";
          emit({ type: "scope-blocked-dependency", scope: s.id, requires: st.requires });
          progressed = true;
          continue;
        }
        if (!reqs.every((r) => r.state === "resolved" && RESOLVED(r))) continue; // only requires controls readiness
        if (active >= MAX_DIRECT_ACTORS) break; // KT3 slot limit
        active++;
        peak = Math.max(peak, active);
        st.state = "running";
        const p = runScope(st, reqs).finally(() => running.delete(p));
        running.add(p);
        progressed = true;
      }
      if (running.size === 0 && !progressed) return;
      if (running.size > 0 && !progressed) await Promise.race(running);
    }
  };
  const runScope = async (st, reqs) => {
    const prerequisites = reqs.map((r) => ({ scope: r.id, reportDigest: r.admitted.reportDigest }));
    intervals[st.id] = { start: ports.now() };
    emit({ type: "scope-dispatched", scope: st.id, prerequisites });
    let actor;
    try {
      actor = await ports.startScope(st.contract, prerequisites);
      st.childHandles.push(actor.id);
      const ctl = { ports, seq: 0, expectations: [], log: (e) => emit({ scope: st.id, ...e }) };
      const frontiers = new Set();
      let candidate;
      let req = { phase: "evaluate", prerequisites };
      for (;;) {
        const res = await expectResult(ctl, { ...actor, role: "evaluator", ownerScope: st.id }, req, (val) => {
          if (val.kind === "scope-paused") return { ok: true };
          const bad = val.manifest.filter((m) => !ports.admissibleLocator(m.locator));
          return bad.length ? { ok: false, defect: `manifest locator outside the evidence closure: ${bad.map((b) => b.locator).join(", ")}` } : { ok: true };
        });
        if (!res.ok) {
          st.state = "stopped";
          st.stop = res.stop;
          break;
        }
        if (res.value.kind === "scope-paused") {
          // terminal:false; the same frontier continues. Repeating it stops.
          if (frontiers.has(res.value.frontier)) {
            st.state = "stopped";
            st.stop = { cause: "repeated-unresolved-frontier" };
            break;
          }
          frontiers.add(res.value.frontier);
          emit({ type: "scope-paused", scope: st.id, terminal: false });
          req = { phase: "evaluate", prerequisites, continuation: "scope-paused", frontier: res.value.frontier };
          continue;
        }
        candidate = res.value;
        break;
      }
      if (candidate) {
        // candidate-ready -> parent accept -> begin-reconcile (report-only, scope-owned reviewers)
        st.manifest = [];
        for (const m of candidate.manifest) st.manifest.push({ ...m, sha256: await ports.readSource(m.locator) });
        emit({ type: "candidate-ready", scope: st.id, reportDigest: digest(candidate.report), disposition: candidate.disposition });
        emit({ type: "begin-reconcile", scope: st.id });
        const rec = await ports.reconcile(st.contract, candidate);
        emit({ type: "reconcile-result", scope: st.id, status: rec.status, reviewersDisposed: rec.reviewersDisposed });
        invariant(rec.reviewersDisposed === true || rec.status !== "final", "children-disposed-before-scope-result", () => ({ scope: st.id, status: rec.status }));
        if (rec.status === "final") {
          st.review = "complete";
          st.disposition = candidate.disposition;
          st.report = rec.report;
          // Recheck actual supporting sources before acceptance.
          st.freshness = (await manifestCurrent(st, ports)) ? "current" : "stale";
          st.rounds = rec.rounds;
          st.state = RESOLVED(st) ? "resolved" : st.freshness === "stale" ? "stale" : "unresolved";
          st.admitted = { reportDigest: digest(rec.report) };
          emit({ type: "scope-result", scope: st.id, review: st.review, freshness: st.freshness, disposition: st.disposition, reportDigest: st.admitted.reportDigest });
        } else {
          st.state = "stopped";
          st.stop = rec.stop ?? { cause: rec.status };
        }
      }
    } catch (error) {
      if (error instanceof InvariantViolation) throw error;
      st.state = "stopped";
      st.stop = { cause: "scope-failure", code: error?.code ?? "error" };
    } finally {
      if (actor) {
        const d = await ports.dispose(actor);
        st.disposal = d.observedExit;
        emit({ type: "scope-disposed", scope: st.id, observedExit: d.observedExit });
        if (d.observedExit) active--; // KT3: slot frees on observed disposal only
        else st.cleanupFrontier = true;
      } else active--;
      intervals[st.id].end = ports.now();
    }
  };
  await settle();
  // Final freshness recheck before aggregate; drift invalidates actual
  // consumers and transitive requires dependents, not shared-evidence neighbors.
  const stale = new Set();
  for (const st of state.values()) if (st.state === "resolved" && !(await manifestCurrent(st, ports))) stale.add(st.id);
  let grew = true;
  while (grew) {
    grew = false;
    for (const st of state.values()) if (!stale.has(st.id) && st.state === "resolved" && st.requires.some((r) => stale.has(r))) {
      stale.add(st.id);
      grew = true;
    }
  }
  for (const id of stale) {
    const st = state.get(id);
    st.freshness = "stale";
    st.state = "stale";
    emit({ type: "freshness-invalidated", scope: id });
  }
  const scopes = order.map((s) => state.get(s.id));
  const resolved = scopes.filter((s) => s.state === "resolved").length;
  const cleanupOpen = scopes.some((s) => s.cleanupFrontier);
  const status = resolved === scopes.length && !cleanupOpen ? "complete" : resolved > 0 ? "partial" : "blocked";
  return { status, peakActive: peak, intervals, scopes: scopes.map(scopeView), rows: aggregateRows(scopes), events };
}

async function manifestCurrent(st, ports) {
  for (const m of st.manifest ?? []) if ((await ports.readSource(m.locator)) !== m.sha256) return false;
  return true;
}

function scopeView(st) {
  return { id: st.id, state: st.state, review: st.review, freshness: st.freshness, disposition: st.disposition, admitted: st.admitted, stop: st.stop ?? null, disposal: st.disposal, cleanupFrontier: Boolean(st.cleanupFrontier) };
}

/** KT5 aggregate columns derived from ordered admitted events, not a second ledger. */
function aggregateRows(scopes) {
  return scopes.map((st) => {
    const rounds = st.rounds ?? [];
    return {
      scope: st.id,
      disposition: st.state === "resolved" ? st.disposition : st.state,
      outerRounds: rounds.length,
      reportUpdates: rounds.filter((r) => r.outcome === "applied").length,
      validByRound: rounds.map((r) => (r.turns.at(-1)?.verdict === "VALID" ? r.turns.at(-1).role : "none")),
    };
  });
}

/** KS1: root admits only scope results owned by their scope, never nested review results. */
export function admitAtRoot(message) {
  if (message?.type !== "scope-result" || typeof message.scope !== "string" || message.owner !== message.scope) return { admitted: false, reason: "root admits only a scope-owned scope-result" };
  return { admitted: true };
}
