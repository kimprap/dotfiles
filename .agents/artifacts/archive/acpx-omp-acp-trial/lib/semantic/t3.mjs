// T3 execution below the entry gate (spec acpx-omp-acp-trial/spec-v9: "T3
// production scenarios", B5 rehearsal/admission, "Resource accounting and
// measured durations"). The same controller, approved inputs and ports serve
// rehearsal (tiny profile) and production (A/B profiles; S3 evaluators use A).
// Every native effect goes through the shared T1 adapter; admission uses the
// shared RequestWindow and the T2 capture/closure. Nothing here opens the
// entry gate: run.mjs checks T2 permission, authority and correction
// eligibility before calling executeT3.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { InvariantViolation, renderReconcile, runReconcile, runRetrace, validateApproval, validateScopeTable } from "../../controller.mjs";
import { hashProtected, listRuns, readJson, readJsonIfExists, writeJson } from "../evidence/io.mjs";
import { AGENT_ID, PidLedger, clock, closeAndObserve, createTrialRuntime, ensureWithSampling, runRequest, sampleStatus } from "../native/adapter.mjs";
import { cleanupLiveSessionFolders, removePrivateRoot } from "../native/env.mjs";
import { BUNDLE_DIR, PROBE, REPO_ROOT, RUNTIME, sessionDirFor } from "../native/pins.mjs";
import { closeRequest, retainRequest, withCapture } from "./capture.mjs";
import { NARROW_POOLS, PRODUCTION_LIMIT } from "./debugloop.mjs";
import { exampleFor } from "./domain.mjs";
import { loadPrompts, usageOf } from "./soak.mjs";

export const SCENARIOS = Object.freeze(["S1", "S2", "S3"]);
export const STAGES = Object.freeze(["rehearsal", "production"]);
export const T3_CRITERIA = Object.freeze(["AC-REHEARSAL", "AC-CONVERSATION", "AC-RETHINK", "AC-ARTIFACT", "AC-RETRACE", "AC-DURATIONS", "AC-CLEANUP"]);
export const REHEARSAL_LIMIT = NARROW_POOLS.rehearsal;
const S3_GRAPH = Object.freeze({ s1: [], s2: ["s1"], s3: [] });
const NATIVE_NEGATIVE = new Set(["identity-changed", "failed-disposal", "fresh-session-fallback"]);
const digest = (s) => createHash("sha256").update(s).digest("hex");
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));

// ------------------------------------------------------------------ approved inputs

/**
 * The approved-input JSON carries the human-approved scenario inputs:
 * scenarios.S1.brief (Conversation replacement, cap none), scenarios.S2.brief
 * (Artifact edits, cap 1, repo-relative harmless source) plus its validator,
 * and scenarios.S3.table (s1 independent, s2 requires s1, s3 independent).
 */
export function validateScenarioInputs(approval) {
  const problems = [];
  const sc = approval?.scenarios;
  if (!sc || typeof sc !== "object") return { ok: false, problems: ["approval carries no human-approved scenarios.S1/S2/S3 inputs"] };
  const s1 = validateApproval(sc.S1?.brief);
  if (!s1.ok) problems.push(...s1.problems.map((p) => `S1: ${p}`));
  else if (s1.mode !== "conversation" || s1.cap !== "none") problems.push("S1 must be Conversation replacement with cap none");
  const s2 = validateApproval(sc.S2?.brief);
  if (!s2.ok) problems.push(...s2.problems.map((p) => `S2: ${p}`));
  else if (s2.mode !== "artifact" || s2.cap !== 1) problems.push("S2 must be Artifact edits with cap 1");
  const src = sc.S2?.brief?.candidate?.path;
  if (typeof src === "string" && (path.isAbsolute(src) || src.split("/").includes(".."))) problems.push("S2 source must be a repository-relative path");
  const lines = sc.S2?.validator?.requiredLines;
  if (!Array.isArray(lines) || lines.length === 0 || !lines.every((l) => typeof l === "string" && l.length > 0)) problems.push("S2 validator needs a non-empty requiredLines array");
  const t = validateScopeTable(sc.S3?.table);
  if (!t.ok) problems.push(...t.problems.map((p) => `S3: ${p}`));
  else {
    const graph = Object.fromEntries(sc.S3.table.scopes.map((s) => [s.id, [...(s.requires ?? [])].sort()]));
    if (JSON.stringify(graph) !== JSON.stringify(S3_GRAPH)) problems.push("S3 table must be exactly s1 independent, s2 requires s1, s3 independent");
    if (typeof sc.S3.table.approval.at !== "string") problems.push("S3 table approval needs its approval time `at` (it binds the nested report-only reviews)");
  }
  return { ok: problems.length === 0, problems };
}

// ------------------------------------------------------------------ accounting

/** Cumulative T3 usage from earlier T3 executions in the same runs root. */
export async function priorT3Usage(runsRoot, selfId) {
  const out = { runs: [], wallMs: 0, usdKnown: 0, usdUnknownRuns: 0, tokens: 0, tokensUnknownRuns: 0, rehearsal: { wallMs: 0, usdKnown: 0, usdUnknownRuns: 0 } };
  for (const run of await listRuns(runsRoot, "t3-")) {
    if (path.basename(run) === selfId) continue;
    const acc = await readJsonIfExists(path.join(run, "accounting.json"));
    if (acc?.pool !== "production") continue;
    out.runs.push(path.basename(run));
    out.wallMs += acc.wallMs ?? 0;
    if (typeof acc.cost?.amount === "number") out.usdKnown += acc.cost.amount;
    else if (acc.modelWork) out.usdUnknownRuns++;
    if (typeof acc.tokens === "number") out.tokens += acc.tokens;
    else if (acc.modelWork) out.tokensUnknownRuns++;
    out.rehearsal.wallMs += acc.rehearsal?.wallMs ?? 0;
    if (typeof acc.rehearsal?.cost?.amount === "number") out.rehearsal.usdKnown += acc.rehearsal.cost.amount;
    else if (acc.rehearsal?.modelWork) out.rehearsal.usdUnknownRuns++;
  }
  return out;
}

class Budget {
  constructor({ prior, startMono, actors }) {
    this.prior = prior;
    this.startMono = startMono;
    this.actors = actors;
    this.stageStart = {};
    this.halted = null;
    this.limitReached = null;
  }
  spend(stage) {
    const list = this.actors.filter((a) => !stage || a.stage === stage);
    let usd = 0;
    let tokens = 0;
    let unknown = 0;
    for (const a of list) {
      const c = usageOf(a.ledger.samples, "costAmount");
      const t = usageOf(a.ledger.samples, "totalTokens");
      if (typeof c === "number") usd += c;
      else if (a.requests.length) unknown++;
      if (typeof t === "number") tokens += t;
    }
    return { usd, tokens, actorsWithUnknownCost: unknown };
  }
  deadline(stage) {
    const prod = this.startMono + PRODUCTION_LIMIT.wallMs - this.prior.wallMs;
    if (stage !== "rehearsal") return prod;
    return Math.min(prod, this.stageStart.rehearsal + REHEARSAL_LIMIT.wallMs - this.prior.rehearsal.wallMs);
  }
  /** Reason further model work in `stage` is not permitted, or null. */
  block(stage) {
    if (this.halted) return this.halted;
    const now = clock.mono();
    const all = this.spend();
    let why = null;
    if (now >= this.deadline("production")) why = "production-limit: cumulative wall reached";
    else if (this.prior.usdKnown + all.usd >= PRODUCTION_LIMIT.usd) why = "production-limit: reported cost reached";
    else if (this.prior.tokens + all.tokens >= PRODUCTION_LIMIT.tokens) why = "production-limit: reported tokens reached";
    else if (stage === "rehearsal") {
      const r = this.spend("rehearsal");
      if (now >= this.deadline("rehearsal")) why = "rehearsal-subcap: wall reached";
      else if (this.prior.rehearsal.usdKnown + r.usd >= REHEARSAL_LIMIT.usd) why = "rehearsal-subcap: reported cost reached";
    }
    if (why && !(this.limitReached?.[stage])) (this.limitReached ??= {})[stage] = { reason: why, at: clock.iso(), mono: now };
    return why;
  }
}

// ------------------------------------------------------------------ execution

/**
 * Runs the planned stages and writes the retained evidence of one T3
 * execution. `argvFor(profile, sessionDir)` is the pinned registry argv in
 * run.mjs and a scripted fixture agent only in the mechanics self-test.
 */
export async function executeT3({ runDir, runsRoot, dirs, approval, approvalMeta, entry, corrects, plan, argvFor, scripted, authority, sources, s0, preStops = [] }) {
  const runId = path.basename(runDir);
  const startedAt = clock.iso();
  const startMono = clock.mono();
  const prompts = {
    reviewer: loadPrompts(await fs.readFile(path.join(BUNDLE_DIR, "prompts", "semantic", "reconcile-reviewer.md"), "utf8")),
    scope: loadPrompts(await fs.readFile(path.join(BUNDLE_DIR, "prompts", "semantic", "retrace-scope.md"), "utf8")),
  };
  const protectedList = (await readJson(path.join(BUNDLE_DIR, "config", "protected-sources.json"))).files;
  const s2Source = approval?.scenarios?.S2?.brief?.candidate?.path;
  const watched = typeof s2Source === "string" ? [...protectedList, s2Source] : protectedList;
  const ev = {
    schema: "acpx-omp-acp-trial.t3.v1",
    runId,
    task: "T3",
    startedAt,
    scripted: scripted === true,
    approval: approvalMeta,
    authority,
    sources,
    s0,
    entry,
    corrects: corrects ?? null,
    plan,
    readonly: { protectedBefore: await hashProtected(REPO_ROOT, watched) },
    stops: [...preStops],
  };
  const sessionDir = scripted ? null : sessionDirFor(runId);
  ev.sessionDir = sessionDir;
  const actors = [];
  const prior = await priorT3Usage(runsRoot, runId);
  ev.prior = prior;
  const budget = new Budget({ prior, startMono, actors });
  const stages = {};
  ev.processesStarted = false;

  for (const step of plan) {
    const st = { stage: step.stage, planned: step.scenarios, startedAt: clock.iso(), startedMono: clock.mono(), scenarios: {}, disposalOrder: [], runtimes: {} };
    stages[step.stage] = st;
    if (step.stage === "production" && step.requiresRehearsalClear) {
      const why = productionBlockedBy(stages.rehearsal, actors, ev);
      if (why) {
        st.entered = false;
        st.notEnteredReason = why;
        for (const s of step.scenarios) st.scenarios[s] = { scenario: s, stage: "production", status: "not-run", reason: why };
        st.endedAt = clock.iso();
        st.endedMono = clock.mono();
        ev.stops.push(`production-not-entered: ${why}`);
        continue;
      }
    }
    st.entered = true;
    budget.stageStart[step.stage] = st.startedMono;
    await runStage({ st, ev, runId, dirs, approval, prompts, actors, budget, argvFor, sessionDir });
    st.endedAt = clock.iso();
    st.endedMono = clock.mono();
  }
  ev.limitReached = budget.limitReached;
  if (budget.halted) ev.stops.push(budget.halted);

  // Live-store session folders only after every published PID reached ESRCH.
  const started = actors.filter((a) => a.ensureInvokedAt);
  if (!scripted && started.length) {
    const allEsrch = started.every((a) => a.close && !a.close.skipped && a.close.pidResults?.length > 0 && a.close.pidResults.every((r) => r.result === "ESRCH"));
    const ids = started.map((a) => a.identity?.backendSessionId).filter(Boolean);
    const realCwd = await fs.realpath(dirs.cwd);
    ev.liveStoreCleanup = allEsrch ? await cleanupLiveSessionFolders({ sessionDir, sessionIds: ids, realCwd }) : { skipped: "a published PID did not reach ESRCH or a handle had no published PID; live-store folders retained", sessionDir, sessionIds: ids, complete: false };
  } else ev.liveStoreCleanup = scripted ? { notApplicable: "scripted fixture agents use no live store", complete: true } : { notApplicable: "no native process started", complete: true };

  ev.readonly.protectedAfter = await hashProtected(REPO_ROOT, watched);
  ev.readonly.protectedUnchanged = Object.keys(ev.readonly.protectedBefore).every((f) => ev.readonly.protectedBefore[f] === ev.readonly.protectedAfter[f]);
  if (!ev.readonly.protectedUnchanged) ev.stops.push("protected-source-drift");
  ev.finishedModelWorkAt = clock.iso();
  // B4 record for this execution: causes are added only by the retained owner
  // from preserved evidence; faults below are snapshots, not causes.
  ev.debugLoop = { causes: [], blocksDone: false, note: "a trial-code cause is recorded only by its retained owner with a preserved snapshot and independent evidence" };
  ev.faults = Object.values(stages).flatMap((s) => Object.values(s.scenarios).filter((x) => x.fault).map((x) => ({ stage: s.stage, scenario: x.scenario, ...x.fault })));

  // Retention before removal.
  const retainedActors = actors.map(retainActor);
  await writeJson(path.join(runDir, "scenarios.json"), { stages, actors: retainedActors });
  await writeJson(path.join(runDir, "t3.json"), ev);
  const removal = await removePrivateRoot(dirs);
  const wallMs = clock.mono() - startMono;
  const cleanupFacts = { privateRootRemovedAfterRetention: removal.removed, acpxSocketDirExisted: removal.socketDirExisted, liveStoreComplete: ev.liveStoreCleanup.complete === true, removedAt: clock.iso(), evidenceWrittenBeforeRemoval: true };
  await writeJson(path.join(runDir, "cleanup.json"), cleanupFacts);
  const costOf = (list) => {
    const worked = list.filter((a) => a.requests.length);
    if (!worked.length) return { amount: 0, currency: "USD", basis: "no model request submitted" };
    return worked.every((a) => typeof a.cost === "number") ? { amount: worked.reduce((s, a) => s + a.cost, 0), currency: "USD", basis: "public status cumulative session cost per actor" } : { amount: "unknown", basis: "no reported cost for every actor with model work" };
  };
  const tokensOf = (list) => {
    const worked = list.filter((a) => a.requests.length);
    return worked.every((a) => typeof a.tokens === "number") ? worked.reduce((s, a) => s + a.tokens, 0) : "unknown";
  };
  const reh = retainedActors.filter((a) => a.stage === "rehearsal");
  const rehSt = stages.rehearsal;
  await writeJson(path.join(runDir, "accounting.json"), {
    pool: "production",
    task: "T3",
    startedAt,
    endedAt: clock.iso(),
    wallMs,
    modelWork: retainedActors.some((a) => a.requests.length > 0),
    cost: costOf(retainedActors),
    tokens: tokensOf(retainedActors),
    limits: { production: { usd: PRODUCTION_LIMIT.usd, tokens: PRODUCTION_LIMIT.tokens, wallMs: PRODUCTION_LIMIT.wallMs }, rehearsal: { usd: REHEARSAL_LIMIT.usd, wallMs: REHEARSAL_LIMIT.wallMs } },
    rehearsal: rehSt ? { wallMs: (rehSt.endedMono ?? clock.mono()) - rehSt.startedMono, modelWork: reh.some((a) => a.requests.length > 0), cost: costOf(reh), tokens: tokensOf(reh) } : null,
    prior,
    limitReached: budget.limitReached,
    note: "wallMs covers the whole T3 execution including cleanup; rehearsal spend also counts inside the production pool. OAuth cost may be absent or delayed; unknown is never reported as zero.",
  });
  return { ev, stages, actors: retainedActors, cleanupFacts, wallMs };
}

/** B5: production only when rehearsal left no code fault, unsafe stop or open disposal. */
function productionBlockedBy(reh, actors, ev) {
  if (!reh) return null;
  const faults = Object.values(reh.scenarios).filter((x) => x.fault);
  if (faults.length) return `rehearsal code fault ${faults.map((f) => `${f.scenario}:${f.fault.invariant ?? f.fault.name}`).join(",")} is unresolved`;
  const open = actors.filter((a) => a.stage === "rehearsal" && a.ensureInvokedAt && !(a.close?.closeResolved && a.close?.recordedClosed && a.close?.allPidsExited));
  if (open.length) return `rehearsal disposal not observed for ${open.map((a) => a.key).join(",")}`;
  const unsafe = ev.stops.filter((s) => /^(identity-changed|protected-source-drift|unsafe)/.test(s));
  if (unsafe.length) return `rehearsal safety stop: ${unsafe.join("; ")}`;
  return null;
}

async function runStage({ st, ev, runId, dirs, approval, prompts, actors, budget, argvFor, sessionDir }) {
  const stage = st.stage;
  const caps = {};
  const capFor = (profile) => {
    if (!caps[profile]) {
      const argv = argvFor(profile, sessionDir);
      const rt = createTrialRuntime({ cwd: dirs.cwd, argv, ttlMs: RUNTIME.normalTtlMs });
      caps[profile] = { cap: withCapture(rt), rt, argv };
      st.runtimes[profile] = { registryArgv: argv, ttlMs: RUNTIME.normalTtlMs, agentId: AGENT_ID };
    }
    return caps[profile];
  };
  const profileOf = (role) => (stage === "rehearsal" ? "tiny" : role === "B" ? "B" : "A");
  const byKey = new Map();

  const newActor = async (scenario, owner, role) => {
    const key = `${stage}-${scenario}-${owner}-${role}`;
    const profile = profileOf(role);
    const { cap, argv } = capFor(profile);
    const a = { key, stage, scenario, owner, role, profile, registryArgv: argv, sessionKey: `${runId}-${key}`, ledger: new PidLedger(), requests: [], censored: [], n: 0, bootstrapped: false, cap };
    actors.push(a);
    byKey.set(key, a);
    ev.processesStarted = true;
    a.ensureInvokedAt = clock.iso();
    try {
      const ensured = await ensureWithSampling(cap.runtime, { sessionKey: a.sessionKey, agent: AGENT_ID, mode: "persistent", cwd: dirs.cwd }, a.ledger);
      a.handle = ensured.handle;
      a.identity = { acpxRecordId: ensured.handle.acpxRecordId ?? ensured.post.acpxRecordId, backendSessionId: ensured.handle.backendSessionId ?? ensured.post.backendSessionId };
      a.creationLaunchArgv = ensured.launchArgv;
      a.observedModel = ensured.post.currentModelId;
    } catch (error) {
      a.ensureError = error?.code ?? "error";
      throw Object.assign(new Error(`ensureSession failed for ${key}`), { code: "NATIVE_ENSURE_FAILED" });
    }
    return a;
  };

  /** One submission of one request; returns an A1 closure outcome for the controller. */
  const submit = async (a, req, text, phase, ctx) => {
    const blocked = budget.block(stage);
    if (blocked) {
      a.censored.push({ phase: req.phase, reason: blocked, at: clock.iso() });
      return { row: "controller-stop", censored: blocked };
    }
    const requestId = `${a.sessionKey}-r${++a.n}`;
    const rec = await runRequest({ runtime: a.cap.runtime, handle: a.handle, ledger: a.ledger, requestId, text, cursor: a.cursor, knownRequestIds: a.known ??= new Set(), deadlineMono: budget.deadline(stage), argvProbe: true });
    a.known.add(requestId);
    const projection = rec.win.firstCandidate ? a.cap.captured.get(rec.win.firstCandidate.cursor) : undefined;
    const cls = closeRequest({ win: rec.win, control: rec.control, projection, phase, ctx });
    if (rec.win.state === "closed") a.cursor = rec.win.endCursor;
    const post = await sampleStatus(a.cap.runtime, a.handle, `post-request:${requestId}`);
    a.ledger.record(post);
    let row = cls.row;
    if (post.backendSessionId !== a.identity.backendSessionId || post.acpxRecordId !== a.identity.acpxRecordId) {
      row = "identity-changed";
      ev.stops.push(`identity-changed:${a.key}:${requestId}`);
      budget.halted ??= `identity-changed:${a.key}`;
    }
    if (cls.unknownRequestIds?.length) {
      row = "evidence-fault";
      ev.stops.push(`unknown-request-binding:${requestId}`);
      budget.halted ??= `unknown-request-binding:${a.key}`;
    }
    if (rec.win.rpc.sessionNew > 0) {
      row = "fresh-session-fallback";
      ev.stops.push(`fresh-session-fallback:${requestId}`);
      budget.halted ??= `fresh-session-fallback:${a.key}`;
    }
    const kept = retainRequest(rec, cls, projection);
    kept.phase = req.phase;
    kept.validatePhase = phase;
    kept.ctx = ctx;
    kept.expectationId = req.expectationId;
    kept.reask = Boolean(req.reask);
    kept.continuation = req.continuation ?? null;
    kept.controllerRow = row;
    a.requests.push(kept);
    return { row, value: cls.value, defects: cls.defects, requestId };
  };

  const supplyFrom = (root) => async (locators) => {
    if (!root) return { status: "refused", reason: "no approved source root for this scenario", sources: [] };
    const sources = [];
    for (const loc of locators) {
      if (typeof loc !== "string" || !loc.startsWith(`${root}/`)) return { status: "refused", reason: `locator outside the approved root: ${loc}`, sources: [] };
      try {
        const text = await fs.readFile(loc, "utf8");
        sources.push({ locator: loc, sha256: digest(text), text: text.slice(0, 100_000) });
      } catch (error) {
        return { status: "refused", reason: `unreadable ${loc}: ${error.code ?? "error"}`, sources: [] };
      }
    }
    return { status: "supplied", sources };
  };
  const sourceText = (supplied) => `${supplied.status}${supplied.reason ? `: ${supplied.reason}` : ""}`;
  const suppliedBodies = (supplied) => (supplied.sources ?? []).map((s) => `Source ${s.locator} (sha256 ${s.sha256}):\n\n\`\`\`\`text\n${s.text}\n\`\`\`\``).join("\n\n");

  const dispose = async (a) => {
    if (a.close) return { observedExit: observedExit(a.close) };
    if (!a.handle) {
      a.close = { skipped: true, reason: "ensureSession failed; no handle to close" };
      return { observedExit: false };
    }
    a.close = await closeAndObserve({ runtime: a.cap.runtime, handle: a.handle, ledger: a.ledger, reason: `t3 ${stage} ${a.scenario} ${a.owner} ${a.role} done`, boundMs: PROBE.postCloseObserveMs, pollMs: PROBE.pidPollMs });
    a.closedMono = clock.mono();
    st.disposalOrder.push({ step: `close:${a.key}`, mono: a.closedMono, at: clock.iso() });
    return { observedExit: observedExit(a.close) };
  };

  const reconcilePorts = ({ scenario, owner, brief, candidateRef, sourceRoot, artifact, validate }) => {
    const mode = validateApproval(brief).mode;
    const P = prompts.reviewer;
    return {
      now: () => clock.mono(),
      reviewer: async (role) => {
        const a = await newActor(scenario, owner, role);
        return { id: a.key, backendSessionId: a.identity.backendSessionId };
      },
      ask: async (reviewer, req) => {
        const a = byKey.get(reviewer.id);
        const EXAMPLE = exampleFor("review", { mode });
        const parts = [];
        if (!a.bootstrapped) {
          parts.push(fill(P.bootstrap, { ROLE: reviewer.role, GOAL: brief.goal, CANDIDATE_REF: candidateRef, CONTEXT: brief.context, MODE: brief.mode, CAP: String(brief.maxOuterIterations), CORRECTION_SHAPE: mode === "artifact" ? "`correction.edits`: a non-empty array of `{old, new}` exact edits, each `old` occurring exactly once in the outer base" : "`correction.replacement`: the complete corrected proposal text" }));
          a.bootstrapped = true;
        }
        if (req.reask) parts.push(fill(P.reask, { DEFECT: (req.reask.defects ?? []).join("; "), EXAMPLE }));
        else if (req.continuation === "source") parts.push(fill(P.source, { SOURCE_STATUS: sourceText(req.supplied), LOCATORS: (req.supplied.sources ?? []).map((s) => s.locator).join(", ") || "none" }), suppliedBodies(req.supplied));
        else if (req.phase === "initial") parts.push(fill(P.initial, { ITERATION: req.iteration, PROPOSAL: req.proposal, EXAMPLE }));
        else if (req.phase === "rethink") {
          const { kind, verdict, rationale, correction, reason } = req.provisional ?? {};
          parts.push(fill(P.rethink, { PROVISIONAL: JSON.stringify({ kind, verdict, rationale, correction, reason }, null, 2), EXAMPLE }));
        } else parts.push(fill(P.later, { ITERATION: req.iteration, BLOCKED_RETRY: req.blockedRetry ? `Your previous verdict was BLOCKED (${req.blockedRetry.reason}). The approved context is: ${req.blockedRetry.approvedContext}. Judge again with it.` : "", PROPOSAL: req.proposal, EXAMPLE }));
        return submit(a, req, parts.filter(Boolean).join("\n\n"), "review", { mode });
      },
      supplySource: supplyFrom(sourceRoot),
      artifact,
      validate,
      dispose: (r) => dispose(byKey.get(r.id)),
    };
  };

  const wrapScenario = async (name, fn) => {
    const rec = { scenario: name, stage, startedAt: clock.iso(), startedMono: clock.mono() };
    st.scenarios[name] = rec;
    const blocked = budget.block(stage);
    if (blocked) {
      rec.status = "censored";
      rec.reason = blocked;
    } else {
      try {
        await fn(rec);
        rec.status = rec.status ?? "executed";
      } catch (error) {
        if (error instanceof InvariantViolation) {
          rec.status = "fault";
          rec.fault = { invariant: error.invariant, snapshot: error.snapshot, at: clock.iso() };
          budget.halted ??= `fail-fast: controller invariant ${error.invariant} in ${stage} ${name}`;
        } else if (error?.code === "NATIVE_ENSURE_FAILED") {
          rec.status = "stopped";
          rec.reason = `native-ensure-failed: ${error.message}`;
        } else {
          rec.status = "fault";
          rec.fault = { name: error?.name ?? "Error", code: error?.code ?? null, at: clock.iso() };
          process.stderr.write(`t3 ${stage} ${name} fault (not retained): ${error?.stack ?? error}\n`);
          budget.halted ??= `trial-code-or-runtime-fault:${stage}:${name}`;
        }
      }
    }
    // Cleanup of any actor of this scenario the controller did not dispose.
    for (const a of actors.filter((x) => x.stage === stage && x.scenario === name && !x.close)) await dispose(a);
    rec.actors = actors.filter((x) => x.stage === stage && x.scenario === name).map((x) => x.key);
    rec.endedAt = clock.iso();
    rec.endedMono = clock.mono();
  };

  for (const name of st.planned) {
    if (name === "S1") {
      await wrapScenario("S1", async (rec) => {
        const brief = approval.scenarios.S1.brief;
        rec.briefDigest = digest(JSON.stringify(brief));
        const r = await runReconcile({ brief, ports: reconcilePorts({ scenario: "S1", owner: "root", brief, candidateRef: "the proposal text shown in each review request", sourceRoot: null }) });
        rec.result = r;
        rec.render = r.status === "rejected" ? null : renderReconcile(r);
      });
    } else if (name === "S2") {
      await wrapScenario("S2", async (rec) => {
        const brief = approval.scenarios.S2.brief;
        rec.briefDigest = digest(JSON.stringify(brief));
        const srcAbs = path.join(REPO_ROOT, brief.candidate.path);
        const original = await fs.readFile(srcAbs, "utf8");
        const dir = path.join(dirs.cwd, `${stage}-S2`);
        await fs.mkdir(dir, { recursive: true, mode: 0o700 });
        const copy = path.join(dir, path.basename(brief.candidate.path));
        await fs.writeFile(copy, original);
        const writes = [];
        const reads = [];
        const art = {
          read: async () => {
            try {
              const b = await fs.readFile(copy, "utf8");
              reads.push({ at: clock.iso(), mono: clock.mono(), sha256: digest(b) });
              return b;
            } catch {
              reads.push({ at: clock.iso(), mono: clock.mono(), sha256: "unreadable" });
              return undefined;
            }
          },
          write: async (bytes) => {
            await fs.writeFile(copy, bytes);
            writes.push({ at: clock.iso(), mono: clock.mono(), sha256: digest(bytes) });
          },
        };
        const required = approval.scenarios.S2.validator.requiredLines;
        const validations = [];
        const validate = async (bytes) => {
          const lines = new Set(bytes.split("\n"));
          const missing = required.filter((l) => !lines.has(l));
          validations.push({ at: clock.iso(), sha256: digest(bytes), ok: missing.length === 0, missing });
          return missing.length ? { ok: false, error: `missing required lines: ${missing.join(" | ")}` } : { ok: true };
        };
        rec.artifact = { source: brief.candidate.path, sourceSha256: digest(original), copyPath: copy, copyInitialSha256: digest(original), originalText: original, reads, writes, validations };
        const r = await runReconcile({ brief, ports: reconcilePorts({ scenario: "S2", owner: "root", brief, candidateRef: copy, sourceRoot: dir, artifact: art, validate }) });
        rec.result = r;
        rec.render = r.status === "rejected" ? null : renderReconcile(r);
        const finalText = await fs.readFile(copy, "utf8").catch(() => null);
        rec.artifact.finalText = finalText;
        rec.artifact.finalSha256 = finalText === null ? "unreadable" : digest(finalText);
        rec.artifact.sourceSha256After = digest(await fs.readFile(srcAbs, "utf8"));
      });
    } else if (name === "S3") {
      await wrapScenario("S3", async (rec) => {
        const table = approval.scenarios.S3.table;
        rec.tableDigest = digest(JSON.stringify(table));
        const P = prompts.scope;
        const admittedReports = new Map();
        const nested = {};
        const evalPorts = {
          now: () => clock.mono(),
          startScope: async (scope) => {
            const a = await newActor("S3", scope.id, "evaluator");
            return { id: a.key };
          },
          ask: async (actor, req) => {
            const a = byKey.get(actor.id);
            const EXAMPLE = exampleFor("candidate-ready");
            let text;
            if (req.reask) text = fill(P.reask, { DEFECT: (req.reask.defects ?? []).join("; "), EXAMPLE });
            else if (req.continuation === "source") text = `${fill(P.continue, { CONTINUATION: `The parent supplied the sources you asked for (${sourceText(req.supplied)}).` })}\n\n${suppliedBodies(req.supplied)}`;
            else if (req.continuation === "scope-paused") text = fill(P.continue, { CONTINUATION: `You paused on this frontier: ${req.frontier}. The parent has no further input on it; resolve what you can from the evidence under the root, or pause on a different frontier.` });
            else {
              const pre = (req.prerequisites ?? []).map((p) => `- ${p.scope}: admitted report sha256 ${p.reportDigest}\n\n\`\`\`\`text\n${admittedReports.get(p.scope)?.report ?? ""}\n\`\`\`\``).join("\n\n") || "none";
              const scope = table.scopes.find((s) => s.id === a.owner);
              text = fill(P.evaluate, { ROOT: table.root, SCOPE_ID: scope.id, OBJECTIVE: scope.objective, PREREQUISITES: pre, EXAMPLE });
            }
            return submit(a, req, text, "evaluate", {});
          },
          supplySource: supplyFrom(table.root),
          admissibleLocator: (loc) => typeof loc === "string" && loc.startsWith(`${table.root}/`),
          readSource: async (loc) => {
            try {
              return digest(await fs.readFile(loc));
            } catch (error) {
              return error.code === "ENOENT" ? "absent" : "unreadable";
            }
          },
          reconcile: async (scope, candidate) => {
            const brief = { goal: scope.objective, candidate: { text: candidate.report }, context: `Approved Retrace scope table (root ${table.root}); this review may replace only the scope report.`, mode: "Conversation replacement", maxOuterIterations: "none", approval: { approvedBy: table.approval.approvedBy, at: table.approval.at, fiveFields: true, derivedFrom: "approved Retrace scope table" } };
            const r = await runReconcile({ brief, ports: reconcilePorts({ scenario: "S3", owner: scope.id, brief, candidateRef: "the scope report shown in each review request", sourceRoot: table.root }), reportOnly: true, ownerScope: scope.id });
            const disposed = Object.values(r.disposal ?? {});
            nested[scope.id] = { status: r.status, stop: r.stop ?? null, problems: r.problems ?? null, rounds: r.rounds ?? [], reviewersCreated: r.reviewersCreated ?? [], reviewerFlags: r.reviewerFlags ?? {}, disposal: r.disposal ?? {}, applications: r.applications ?? 0, events: r.events, reportDigest: r.canonical === undefined ? null : digest(r.canonical) };
            if (r.status === "final") admittedReports.set(scope.id, { report: r.canonical });
            return { status: r.status, report: r.canonical, stop: r.stop, rounds: r.rounds, reviewersDisposed: disposed.every(Boolean) };
          },
          dispose: (actor) => dispose(byKey.get(actor.id)),
        };
        const r = await runRetrace({ table, ports: evalPorts });
        rec.retrace = r;
        rec.nested = nested;
        rec.admittedReports = Object.fromEntries([...admittedReports].map(([k, v]) => [k, { report: v.report, sha256: digest(v.report) }]));
      });
    }
  }
  // Every created handle is closed before its runtime shuts down.
  for (const a of actors.filter((x) => x.stage === stage && !x.close)) await dispose(a);
  for (const [profile, c] of Object.entries(caps)) {
    const t0 = clock.mono();
    await c.rt.shutdown();
    st.disposalOrder.push({ step: `shutdown:${profile}`, mono: clock.mono(), at: clock.iso(), ms: clock.mono() - t0 });
  }
}

const observedExit = (cl) => cl?.closeResolved === true && cl?.recordedClosed === true && cl?.allPidsExited === true;

function retainActor(a) {
  const { cap: _c, handle: _h, known: _k, ledger, ...rest } = a;
  const samples = ledger.samples;
  return { ...rest, ledger: ledger.toJSON(), cost: usageOf(samples, "costAmount"), tokens: usageOf(samples, "totalTokens") };
}

// ------------------------------------------------------------------ evaluation

/** Production duration inputs (never a selected timeout). */
export function productionDurations(actors) {
  const reqs = actors.filter((a) => a.stage === "production").flatMap((a) => a.requests.map((q) => ({ a, q })));
  const completed = [];
  const censored = [];
  let missing = 0;
  for (const { q } of reqs) {
    const cens = q.control?.ceiling === true || q.control?.cancelled === true || q.window?.complete !== true;
    if (typeof q.submitToTerminalMs !== "number") missing++;
    else if (cens || q.turnResult?.status !== "completed") censored.push(q.submitToTerminalMs);
    else completed.push(q.submitToTerminalMs);
  }
  const max = completed.length ? Math.max(...completed) : null;
  return {
    basis: "submit-to-terminal per layer-(c) production request; prompt-to-terminal retained per request",
    requests: reqs.length,
    completed: completed.length,
    missingOrIncomplete: missing + censored.length,
    maxCompletedMs: max ?? "unavailable",
    twiceMaxMs: max === null ? "unavailable" : 2 * max,
    thriceMaxMs: max === null ? "unavailable" : 3 * max,
    maxCensoredMs: censored.length ? Math.max(...censored) : "unavailable",
    note: "inputs to a later timeout design for the medium production profiles only; never a default, and not for xhigh roles",
  };
}

function scenarioCapability(rec) {
  if (!rec || rec.status === "not-run") return { result: "not-run", cause: rec?.reason ?? "not planned" };
  if (rec.status === "censored") return { result: "inconclusive", cause: rec.reason };
  if (rec.status === "fault") return { result: "inconclusive", cause: `trial-code fault ${rec.fault?.invariant ?? rec.fault?.name}` };
  if (rec.status === "stopped") return { result: "inconclusive", cause: rec.reason };
  const stops = rec.retrace ? rec.retrace.scopes.filter((s) => s.stop).map((s) => s.stop.cause) : rec.result?.stop ? [rec.result.stop.cause] : [];
  const neg = stops.find((c) => NATIVE_NEGATIVE.has(c));
  if (neg) return { result: "not-supported", cause: neg };
  const native = stops.find((c) => ["window-unavailable", "delivery-uncertain", "turn-not-completed", "evidence-fault", "controller-stop", "scope-failure"].includes(c));
  if (native) return { result: "inconclusive", cause: native };
  return { result: "supported", cause: null, semanticStops: stops };
}

/** Criteria from the independent verifier, then the final report (C1: after criteria). */
export async function finalizeT3({ runDir, out, t2Run }) {
  const { ev, stages, actors, cleanupFacts, wallMs } = out;
  const criteria = {};
  for (const id of T3_CRITERIA) {
    const r = spawnSync(process.execPath, [path.join(BUNDLE_DIR, "verify.mjs"), runDir, id], { encoding: "utf8", cwd: BUNDLE_DIR });
    criteria[id] = r.status === 0 ? "PASS" : "FAIL";
  }
  const prod = stages.production;
  const capability = Object.fromEntries(SCENARIOS.map((s) => [s, scenarioCapability(prod?.scenarios?.[s])]));
  const results = Object.values(capability).map((c) => c.result);
  const overall = results.every((r) => r === "supported") ? "supported" : results.includes("not-supported") ? "not-supported" : results.every((r) => r === "not-run") ? "not-run" : "inconclusive";
  const acc = await readJson(path.join(runDir, "accounting.json"));
  const unproved = [];
  for (const [stage, st] of Object.entries(stages)) {
    for (const s of SCENARIOS) {
      const rec = st.scenarios[s];
      if (!rec) continue;
      if (rec.status !== "executed") unproved.push(`${stage} ${s}: ${rec.status}${rec.reason ? ` (${rec.reason})` : ""}`);
    }
  }
  const s2 = prod?.scenarios?.S2?.result;
  if (s2 && s2.applications === 0) unproved.push("production S2 application/validation branch not entered naturally (mechanics proved in T2)");
  if (s2 && !(s2.rounds ?? []).some((r) => r.closureOnly)) unproved.push("production S2 closure-only branch not entered naturally (mechanics proved in T2)");
  const s1 = prod?.scenarios?.S1?.result;
  if (s1 && !(s1.reviewersCreated ?? []).includes("B")) unproved.push("production S1 reviewer B not created (A returned VALID); B progression unobserved");
  unproved.push("restored-context integrity after same-session restoration: unproved (no required context depends on it)");
  const faults = ev.faults ?? [];
  const cleanupComplete = cleanupFacts.privateRootRemovedAfterRetention === true && cleanupFacts.liveStoreComplete === true;
  const report = {
    schema: "acpx-omp-acp-trial.t3-report.v1",
    run_id: ev.runId,
    task: "T3",
    branch: "entered",
    scripted: ev.scripted,
    t2_run: t2Run,
    corrects: ev.corrects,
    implementation: { criteria, faults: faults.map((f) => `${f.stage} ${f.scenario}: ${f.invariant ?? f.name}`) },
    capability: { scenarios: capability, overall },
    production: { entered: prod?.entered === true, reason: prod?.entered ? null : prod?.notEnteredReason ?? "not planned in this execution" },
    evaluation_complete: T3_CRITERIA.every((id) => criteria[id] === "PASS") && cleanupComplete && faults.length === 0 && ev.debugLoop.causes.every((c) => c.status === "fixed-offline") && ev.authority?.ok === true,
    durations: productionDurations(actors),
    accounting: { wallMs, cost: acc.cost, tokens: acc.tokens, rehearsal: acc.rehearsal, prior: acc.prior, limitReached: acc.limitReached, limits: acc.limits },
    stops: ev.stops,
    causes: ev.debugLoop.causes,
    unproved,
    identities: ev.sources,
    limits: [
      "Rehearsal is diagnostic tiny-profile evidence and never production evidence.",
      "OAuth cost may be absent or delayed; a monetary hard cap cannot be guaranteed and unknown cost is never zero.",
      "Measured durations are inputs for the medium production profiles only; no timeout is selected and 30-60 minutes for xhigh remains an unverified inference.",
      "Tool policy is a trusted-process detect-after check, not a sandbox.",
    ],
  };
  await writeJson(path.join(runDir, "report.json"), report);
  await fs.writeFile(path.join(runDir, "report.md"), renderT3Markdown(report));
  return report;
}

function renderT3Markdown(r) {
  const d = r.durations;
  return [
    `# T3 run ${r.run_id}`,
    "",
    `- T2 dependency: ${r.t2_run}${r.scripted ? " (scripted mechanics run; not production evidence)" : ""}`,
    `- Corrects: ${r.corrects ? `${r.corrects.run} cause ${r.corrects.cause}` : "none"}`,
    ...Object.entries(r.implementation.criteria).map(([k, v]) => `- ${k}: ${v}`),
    `- Capability: ${r.capability.overall} (${Object.entries(r.capability.scenarios).map(([k, v]) => `${k} ${v.result}${v.cause ? `: ${v.cause}` : ""}`).join("; ")})`,
    `- Production entered: ${r.production.entered}${r.production.reason ? ` (${r.production.reason})` : ""}`,
    `- evaluation_complete: ${r.evaluation_complete}`,
    `- Longest completed production turn: ${d.maxCompletedMs} ms; 2x ${d.twiceMaxMs}; 3x ${d.thriceMaxMs}; censored max ${d.maxCensoredMs}; missing/incomplete ${d.missingOrIncomplete}`,
    `- Wall: ${r.accounting.wallMs} ms; cost: ${JSON.stringify(r.accounting.cost)}; tokens: ${r.accounting.tokens}`,
    `- Stops: ${r.stops.length ? r.stops.join("; ") : "none"}`,
    "",
    "## Unproved",
    "",
    ...r.unproved.map((u) => `- ${u}`),
    "",
    "## Limits",
    "",
    ...r.limits.map((l) => `- ${l}`),
    "",
  ].join("\n");
}
