// T2 deterministic mechanics runner (mechanics-only; never a model judgment).
// Offline groups drive the real controller/closure/diagnostic/debug-loop/gate
// code through scripted ports and synthesized A7-shaped events; the
// public-route group drives T1's scripted ACP agent through the public acpx
// runtime. Expected outcomes live in fixtures/mechanics/*.json and are
// compared here and again, independently, by verify.mjs.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { admitAtRoot, renderReconcile, runReconcile, runRetrace } from "../../controller.mjs";
import { exportEvent } from "../evidence/export.mjs";
import { PidLedger, clock, closeAndObserve, createTrialRuntime, ensureWithSampling, runRequest, sampleStatus, waitStatusPidCleared } from "../native/adapter.mjs";
import { createPrivateRoot, removePrivateRoot, sanitizedEnv } from "../native/env.mjs";
import { BUNDLE_DIR } from "../native/pins.mjs";
import { RequestWindow } from "../native/window.mjs";
import { closeRequest, recoverObservation, withCapture } from "./capture.mjs";
import { DebugLoop } from "./debugloop.mjs";
import { appendCleanup, classifyDiagnostic, controlledClock, freezeSnapshot, isolated, replayOutcome } from "./diagnostics.mjs";
import { projectResultData, validateResult } from "./domain.mjs";
import { deriveGate, evaluationComplete, T2_CRITERIA } from "./gate.mjs";
import { classifyRestore } from "./soak.mjs";

const SELF = fileURLToPath(import.meta.url);
const FIX = path.join(BUNDLE_DIR, "fixtures", "mechanics");
const NATIVE_FIX = path.join(BUNDLE_DIR, "fixtures", "native");
const SCRIPTED_AGENT = path.join(NATIVE_FIX, "scripted-agent.mjs");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const tick = () => new Promise((r) => setImmediate(r));

// ------------------------------------------------------------------ comparison

function sub(expected, observed, at = "") {
  const out = [];
  for (const [k, v] of Object.entries(expected)) {
    const o = observed?.[k];
    if (v !== null && typeof v === "object" && !Array.isArray(v)) out.push(...sub(v, o, `${at}${k}.`));
    else if (JSON.stringify(v) !== JSON.stringify(o)) out.push(`${at}${k}: expected ${JSON.stringify(v)}, observed ${JSON.stringify(o)}`);
  }
  return out;
}

// ------------------------------------------------------------------ synthesized events

const REVIEW_PHASES = new Set(["initial", "rethink", "later"]);

function payloadOf(data) {
  const d = { ...data };
  if (d.payloadBytes !== undefined) {
    d.payload = d.payloadUnicode ? "é".repeat(d.payloadBytes / 2) : "x".repeat(d.payloadBytes);
    delete d.payloadBytes;
    delete d.payloadUnicode;
  }
  return d;
}

/** A7-shaped exported events plus cursor -> closed projection map. */
export function buildWindow(ops, rid = "R") {
  const events = [];
  const projections = {};
  let n = 0;
  const cur = () => `c${++n}`;
  const msg = (update) => ({ rpc: "notification", method: "session/update", update });
  const toolStart = (id, kind = "other", keys = ["data"], requestId = rid) => {
    const yk = keys.filter((k) => ["type", "data", "error"].includes(k)).sort();
    const input = { keyCount: keys.length, declaredYieldKeys: yk, undeclaredKeyCount: keys.length - yk.length };
    if (keys.includes("data")) input.hasData = true;
    return { cursor: cur(), type: "message", requestId, message: msg({ kind: "tool_call", tool: { toolCallId: id, status: "in_progress", acpKind: kind, input } }) };
  };
  const toolUpd = (o, requestId = rid) => {
    const e = { cursor: cur(), type: "message", requestId, message: msg({ kind: "tool_call_update", tool: { toolCallId: o.id, status: o.status, output: { detailsStatus: o.detailsStatus, ...(o.data !== undefined ? { hasData: true } : {}) } } }) };
    if (o.data !== undefined && o.status === "completed" && o.detailsStatus === "success") projections[e.cursor] = projectResultData(payloadOf(o.data));
    return e;
  };
  for (const o of ops) {
    if (o.op === "start") events.push({ cursor: cur(), type: "turn_started", requestId: rid });
    else if (o.op === "end") events.push({ cursor: cur(), type: "turn_result", requestId: rid, result: { status: o.status } });
    else if (o.op === "null") events.push({ cursor: cur(), type: "message", requestId: null, message: msg({ kind: "agent_message_chunk" }) });
    else if (o.op === "text") events.push({ cursor: cur(), type: "message", requestId: rid, message: msg({ kind: "agent_message_chunk", textBytes: Buffer.byteLength(o.text) }) });
    else if (o.op === "dup") events.push(structuredClone(events.at(-1)));
    else if (o.op === "tool") events.push(toolStart(o.id, o.kind, o.keys));
    else if (o.op === "lifecycle") events.push({ cursor: cur(), type: "message", requestId: rid, message: msg({ kind: "tool_call_update", tool: { toolCallId: o.id, status: "in_progress", output: {} } }) });
    else if (o.op === "upd") events.push(toolUpd(o));
    else if (o.op === "foreign-yield") {
      events.push(toolStart(o.id, "other", ["data"], o.rid));
      events.push(toolUpd({ id: o.id, status: "completed", detailsStatus: "success", data: o.data }, o.rid));
    }
  }
  return { events, projections };
}

function runWindowCase(c) {
  const { events, projections } = buildWindow(c.ops);
  const win = new RequestWindow({ requestId: "R", knownRequestIds: new Set() });
  for (const e of events) win.accept(e);
  const projection = win.firstCandidate && !c.dropProjection ? projections[win.firstCandidate.cursor] : undefined;
  const cls = closeRequest({ win, control: { cancelled: false, ceiling: false, revoked: false, ...(c.control ?? {}) }, projection, phase: c.phase, ctx: c.ctx });
  const obs = { row: cls.row, c4: cls.c4, c4Charges: cls.c4 ? 1 : 0, duplicateCursorCount: win.duplicateCursorCount, unknownRequestIds: [...win.unknownRequestIds], unfinishedYield: cls.unfinishedYield, candidateToolCallId: win.firstCandidate?.toolCallId ?? null };
  obs.anomaliesInclude = (c.expect.anomaliesInclude ?? []).filter((a) => win.anomalies.includes(a));
  if (cls.value?.token !== undefined) obs.token = cls.value.token;
  if (cls.value?.payload !== undefined) {
    const original = payloadOf(c.ops.find((o) => o.op === "upd" && o.data)?.data ?? {}).payload;
    obs.payloadBytes = Buffer.byteLength(cls.value.payload, "utf8");
    obs.payloadExact = cls.value.payload === original;
  }
  return obs;
}

// ------------------------------------------------------------------ Reconcile ports

function scriptedReconcilePorts(c, ownerScope = "root") {
  const queues = Object.fromEntries(Object.entries(c.script ?? {}).map(([k, v]) => [k, [...v]]));
  const rec = { phases: [], reviewerPortCalls: {}, supplyCalls: 0, artifactReads: 0, artifactWrites: 0, validations: 0, disposed: [], owners: [] };
  const art = c.artifact ? { bytes: c.artifact.initial } : null;
  const t = controlledClock();
  let n = 0;
  const ports = {
    now: () => t.advance(1),
    reviewer: async (role, owner) => {
      rec.reviewerPortCalls[role] = (rec.reviewerPortCalls[role] ?? 0) + 1;
      rec.owners.push(owner);
      return { id: `${owner}-${role}`, backendSessionId: `sess-${owner}-${role}` };
    },
    ask: async (reviewer, req) => {
      await tick();
      const tag = [req.continuation === "source" ? "source" : null, req.reask ? "reask" : null, req.blockedRetry ? "blocked-retry" : null].filter(Boolean).join("+");
      rec.phases.push(`${reviewer.role}:${req.phase}${tag ? `+${tag}` : ""}`);
      const step = queues[reviewer.role]?.shift();
      const requestId = `${reviewer.role}-${++n}`;
      if (!step) return { row: "controller-stop", requestId };
      if (step.row) return { row: step.row, requestId, defects: ["scripted"] };
      const vphase = REVIEW_PHASES.has(req.phase) ? "review" : req.phase;
      const v = validateResult(vphase, step.data, { mode: req.mode });
      return v.valid ? { row: "candidate-valid", value: v.value, requestId } : { row: "candidate-invalid", defects: v.defects, requestId };
    },
    supplySource: async () => {
      rec.supplyCalls++;
      return { status: "supplied" };
    },
    artifact: {
      read: async () => {
        rec.artifactReads++;
        const w = c.artifact?.externalWriteOnRead;
        if (w && rec.artifactReads === w.read) art.bytes = w.bytes;
        return art?.bytes;
      },
      write: async (bytes) => {
        if (c.artifact?.writeFails) throw Object.assign(new Error("EACCES"), { code: "EACCES" });
        rec.artifactWrites++;
        art.bytes = bytes;
      },
    },
    validate: async () => {
      rec.validations++;
      return c.artifact?.validateFails ? { ok: false, error: "validator rejected" } : { ok: true };
    },
    dispose: async (r) => {
      const ok = !(c.disposeFails ?? []).includes(r.role);
      if (ok) rec.disposed.push(r.role);
      return { observedExit: ok };
    },
  };
  return { ports, rec, art };
}

async function runReconcileCase(c) {
  const { ports, rec, art } = scriptedReconcilePorts(c);
  const r = await runReconcile({ brief: c.brief, ports, reportOnly: c.reportOnly === true });
  const obs = {
    status: r.status,
    stopCause: r.stop?.cause,
    canonical: r.canonical,
    applications: r.applications,
    rounds: r.rounds?.length,
    closureOnlyRounds: r.rounds?.map((x) => x.closureOnly),
    phases: rec.phases,
    reviewerPortCalls: rec.reviewerPortCalls,
    disposed: rec.disposed,
    firstReviewFlags: r.reviewerFlags,
    supplyCalls: rec.supplyCalls,
    reasks: (r.expectations ?? []).reduce((s, e) => s + e.reasks, 0),
    invalidReturns: (r.expectations ?? []).reduce((s, e) => s + e.invalidReturns, 0),
    recommendationsIgnored: (r.rounds ?? []).flatMap((x) => x.turns).reduce((s, t) => s + t.recommendationsIgnored, 0),
    artifactWrites: rec.artifactWrites,
    validations: rec.validations,
    artifactFinal: art?.bytes,
    repairAuthority: typeof r.stop?.repairAuthority === "string",
  };
  if (c.expect.renderHas) {
    const md = r.status === "rejected" ? "" : renderReconcile(r);
    obs.renderHas = c.expect.renderHas.filter((s) => md.includes(s));
  }
  return obs;
}

// ------------------------------------------------------------------ Retrace ports

async function runRetraceCase(c) {
  const sources = { ...(c.sources ?? {}) };
  const dispatchOrder = [];
  const evaluatePhases = {};
  const nestedOwners = {};
  const queues = {};
  const spec = (id) => c.scopes?.[id] ?? c.defaultScope;
  for (const s of c.table.scopes) queues[s.id] = [...(spec(s.id)?.evaluate ?? [])];
  const t = controlledClock();
  const ports = {
    now: () => t.advance(1),
    startScope: async (scope) => {
      await tick();
      return { id: `actor-${scope.id}` };
    },
    ask: async (actor, req) => {
      await tick();
      const id = actor.ownerScope;
      (evaluatePhases[id] ??= []).push(`${req.phase}${req.continuation ? `+${req.continuation}` : ""}${req.reask ? "+reask" : ""}`);
      const step = queues[id].shift();
      if (!step) return { row: "controller-stop" };
      if (step.row) return { row: step.row };
      const v = validateResult("evaluate", step.data, {});
      return v.valid ? { row: "candidate-valid", value: v.value } : { row: "candidate-invalid", defects: v.defects };
    },
    supplySource: async () => ({ status: "supplied" }),
    admissibleLocator: (loc) => loc.startsWith(`${c.table.root}/`),
    readSource: async (loc) => (sources[loc] === undefined ? "absent" : sha(sources[loc])),
    reconcile: async (scope, candidate) => {
      await tick();
      const sp = spec(scope.id);
      if (sp.reconcile === "stopped") return { status: "stopped", stop: { cause: "persistent-blocked" }, reviewersDisposed: true, rounds: [] };
      if (sp.reconcile === "final-undisposed") return { status: "final", report: candidate.report, reviewersDisposed: false, rounds: [] };
      if (sp.reconcile === "nested") {
        const brief = { goal: scope.objective, candidate: { text: candidate.report }, context: "approved scope table", mode: "Conversation replacement", maxOuterIterations: "none", approval: { approvedBy: "human", at: "scope-table", fiveFields: true } };
        const { ports: np, rec } = scriptedReconcilePorts({ script: sp.nestedScript });
        const r = await runReconcile({ brief, ports: np, reportOnly: true, ownerScope: scope.id });
        nestedOwners[scope.id] = [...new Set(rec.owners)];
        return { status: r.status, report: r.canonical, stop: r.stop, rounds: r.rounds, reviewersDisposed: Object.values(r.disposal).every(Boolean) };
      }
      return { status: "final", report: candidate.report, reviewersDisposed: true, rounds: [{ iteration: 1, turns: [{ role: "A", verdict: "VALID" }], outcome: "closure" }] };
    },
    dispose: async (actor) => ({ observedExit: !spec(actor.id.slice("actor-".length))?.disposeFails }),
  };
  const log = (e) => {
    if (e.type === "scope-dispatched") dispatchOrder.push(e.scope);
    const m = c.mutate?.afterEvent;
    if (m && e.type === m.type && e.scope === m.scope) Object.assign(sources, c.mutate.set);
  };
  let r;
  try {
    r = await runRetrace({ table: c.table, ports, log });
  } catch (error) {
    return { throws: error.code, invariant: error.invariant, snapshotFrozen: Object.isFrozen(error.snapshot) };
  }
  if (r.status === "rejected") return { status: r.status, problemsInclude: (c.expect.problemsInclude ?? []).filter((p) => r.problems.includes(p)) };
  const byId = Object.fromEntries(r.scopes.map((s) => [s.id, s]));
  const flowOf = (id) => r.events.filter((e) => e.scope === id && ["scope-dispatched", "candidate-ready", "begin-reconcile", "reconcile-result", "scope-result", "scope-disposed"].includes(e.type)).map((e) => e.type);
  const obs = {
    status: r.status,
    peakActive: r.peakActive,
    dispatchOrder,
    states: Object.fromEntries(r.scopes.map((s) => [s.id, s.state])),
    stopCauses: Object.fromEntries(r.scopes.filter((s) => s.stop).map((s) => [s.id, s.stop.cause])),
    pausedEvents: r.events.filter((e) => e.type === "scope-paused" && e.terminal === false).length,
    evaluatePhases: evaluatePhases[c.table.scopes[0].id],
    scopeReasks: Object.fromEntries(Object.entries(evaluatePhases).map(([k, v]) => [k, v.filter((p) => p.includes("+reask")).length])),
    flow: Object.fromEntries(c.table.scopes.map((s) => [s.id, flowOf(s.id)])),
    nestedReviewerOwners: nestedOwners,
    rows: Object.fromEntries(r.rows.map((x) => [x.scope, { outerRounds: x.outerRounds, reportUpdates: x.reportUpdates }])),
  };
  if (c.expect.overlap) {
    const [a, b] = c.expect.overlap;
    const iv = r.intervals;
    obs.overlap = iv[a] && iv[b] && iv[a].start < iv[b].end && iv[b].start < iv[a].end ? [a, b] : [];
  }
  if (c.expect.prerequisites) {
    obs.prerequisites = {};
    for (const [id, exp] of Object.entries(c.expect.prerequisites)) {
      const d = r.events.find((e) => e.type === "scope-dispatched" && e.scope === id);
      // Map admitted digests back to the expected literal only when they match exactly.
      obs.prerequisites[id] = (d?.prerequisites ?? []).map((p) => ({ scope: p.scope, report: exp.find((x) => x.scope === p.scope && sha(x.report) === p.reportDigest)?.report ?? `digest:${p.reportDigest}` }));
    }
  }
  if (c.expect.admittedReport) {
    obs.admittedReport = {};
    for (const id of Object.keys(c.expect.admittedReport)) obs.admittedReport[id] = byId[id]?.admitted?.reportDigest === sha(c.expect.admittedReport[id]) ? c.expect.admittedReport[id] : byId[id]?.admitted?.reportDigest ?? null;
  }
  return obs;
}

// ------------------------------------------------------------------ B2/B4/B5/gate

function runDiagnosticCase(c) {
  const replay = c.replayError ? { error: c.replayError } : { events: buildWindow(c.replayOps).events };
  const r = classifyDiagnostic(c.observation, replay, "R");
  return { result: r.result, codeFault: r.codeFault };
}

function runSnapshotCase(c) {
  const snap = freezeSnapshot(c.input);
  let mutationRejected = false;
  try {
    snap.state = "mutated";
  } catch {
    mutationRejected = true;
  }
  let record = { snapshot: snap };
  for (const f of c.cleanup) record = appendCleanup(record, f);
  const fields = Object.keys(record.snapshot).filter((k) => k !== "frozenAt").sort();
  return { fields, excluded: c.expect.excluded.filter((k) => !(k in record.snapshot) && !JSON.stringify(record).includes(String(c.input[k]))), mutationRejected: mutationRejected && record.snapshot.state === c.input.state, cleanupEntries: record.cleanup.length };
}

async function runReplayCase(c) {
  const { events, projections } = buildWindow(c.ops);
  // Retained A7 evidence only: serialize/parse to drop any in-memory state.
  const retained = JSON.parse(JSON.stringify({ events, projections }));
  const runs = [];
  const iso = await isolated(async () => {
    for (let i = 0; i < 2; i++) runs.push(JSON.stringify(replayOutcome({ requestId: "R", events: retained.events, projections: retained.projections, phase: c.phase, ctx: c.ctx })));
    const net = await import("node:net");
    const cp = await import("node:child_process");
    for (const attempt of [() => globalThis.fetch("https://example.invalid"), () => cp.default.spawn("true"), () => net.default.connect(1)]) {
      try {
        await attempt();
      } catch {}
    }
  });
  return { row: JSON.parse(runs[0]).row, identicalRuns: runs.every((x) => x === runs[0]) ? runs.length : 0, blockedEffects: [...new Set(iso.blocked)] };
}

function runDebugLoopCase(c) {
  const loop = new DebugLoop({ owners: c.owners, extensionApproved: c.extensionApproved });
  const observed = [];
  for (const s of c.steps) {
    let v;
    if (s.do === "recordCause") v = { accepted: loop.recordCause(s.args).accepted };
    else if (s.do === "applyFix") {
      const r = loop.applyFix(s.cause, s.fix);
      v = r.eligible ? { eligible: true, fixNumber: r.fixNumber } : { eligible: false };
    } else if (s.do === "entryOpen") v = loop.entryOpen(s.args);
    else if (s.do === "recordProofUnit") loop.recordProofUnit(s.cause, s.unit);
    else if (s.do === "recordRecurrence") v = loop.recordRecurrence(s.cause);
    else if (s.do === "charge") loop.charge(s.pool, s.amount);
    else if (s.do === "nativeWorkAllowed") v = loop.nativeWorkAllowed(s.args);
    else if (s.do === "startFinalAssurance") loop.startFinalAssurance();
    else if (s.do === "productionRerunAllowed") v = loop.productionRerunAllowed(s.cause);
    else if (s.do === "blocksDone") v = loop.blocksDone();
    observed.push(v === undefined ? null : v);
  }
  const fixesCounted = Object.fromEntries([...loop.causes.values()].map((x) => [x.id, x.fixes.length]));
  return { steps: observed, fixesCounted, proofUnits: loop.proofUnits.length };
}

export function supportedGateInputs() {
  return {
    t1: { capability: "supported", t2EntryPermitted: true, cleanup: "complete", verifyOk: true },
    criteria: Object.fromEntries(T2_CRITERIA.map((id) => [id, "PASS"])),
    soakCapability: "supported",
    identities: { current: { controller: "h1", spec: "h2" }, recorded: { controller: "h1", spec: "h2" } },
    cleanup: { complete: true },
    safety: { protectedUnchanged: true, unsafeRetention: false },
    unfixedCodeBug: false,
  };
}

function runGateCase(c) {
  const inputs = supportedGateInputs();
  for (const [k, v] of Object.entries(c.inputs === "ok" ? {} : c.inputs.patch)) {
    const parts = k.split(".");
    let o = inputs;
    for (const p of parts.slice(0, -1)) o = o[p];
    if (v === null) delete o[parts.at(-1)];
    else o[parts.at(-1)] = v;
  }
  const g = deriveGate(inputs);
  const obs = { production_allowed: g.production_allowed };
  if (c.evaluation) obs.evaluationComplete = evaluationComplete(c.evaluation);
  return obs;
}

// ------------------------------------------------------------------ safe export (A7)

async function runExportCase() {
  const raw = JSON.parse(await fs.readFile(path.join(NATIVE_FIX, "a7-raw-events.json"), "utf8"));
  const exp = JSON.parse(await fs.readFile(path.join(NATIVE_FIX, "a7-expected.json"), "utf8"));
  const got = raw.events.map(exportEvent);
  const text = JSON.stringify(got);
  // T2 projection of the same raw candidate events: declared strings only.
  const t2 = raw.events.map((e) => {
    const u = e?.message?.params?.update;
    const d = u?.rawOutput?.details;
    return u?.sessionUpdate === "tool_call_update" && d?.status === "success" && d.data !== undefined ? projectResultData(d.data) : null;
  }).filter(Boolean);
  return { exportEqual: JSON.stringify(got) === JSON.stringify(exp.events), canaryAbsent: !text.includes(raw.canary) && !JSON.stringify(t2).includes(raw.canary), t2Projections: t2.length };
}

// ------------------------------------------------------------------ offline entry

export async function runOffline() {
  const sem = JSON.parse(await fs.readFile(path.join(FIX, "semantic-cases.json"), "utf8"));
  const bnd = JSON.parse(await fs.readFile(path.join(FIX, "boundary-cases.json"), "utf8"));
  const cases = [];
  const add = (group, c, observed, expected = c.expect) => {
    const mismatches = sub(expected, observed);
    cases.push({ group, name: c.name, guards: c.guards ?? [], observed, pass: mismatches.length === 0, mismatches });
  };
  for (const c of sem.reconcile) add("reconcile", c, await runReconcileCase(c));
  for (const c of sem.retrace) add("retrace", c, await runRetraceCase(c));
  for (const c of sem.rootAdmission) add("root-admission", c, { admitted: admitAtRoot(c.message).admitted }, { admitted: c.admitted });
  for (const c of bnd.windows) add("window", c, runWindowCase(c));
  for (const c of bnd.diagnostics) add("diagnostic", c, runDiagnosticCase(c));
  add("snapshot", bnd.snapshot, runSnapshotCase(bnd.snapshot));
  add("replay", bnd.replay, await runReplayCase(bnd.replay));
  for (const c of bnd.debugloop) add("debugloop", c, runDebugLoopCase(c), { steps: c.steps.map((s) => (s.expect === undefined ? null : s.expect)) });
  for (const c of bnd.gate) add("gate", c, runGateCase(c));
  for (const c of bnd.restores) add("restore", c, { outcome: classifyRestore(c.input) });
  add("export", { name: "a7-safe-export" }, await runExportCase(), { exportEqual: true, canaryAbsent: true });
  return cases;
}

// ------------------------------------------------------------------ public-route scripted mechanics

const PUBLIC_CASES = ["observer-loss-recovered", "same-id-restore", "restore-failure-no-fallback", "unfinished-yield", "two-yields", "no-result", "observed-closes"];

export async function runPublicRoute() {
  const dirs = await createPrivateRoot("t2mech");
  let stdout = "";
  const code = await new Promise((resolve) => {
    const c = spawn(process.execPath, [SELF, "--public-child", dirs.root], { env: sanitizedEnv(dirs), cwd: dirs.cwd, stdio: ["ignore", "pipe", "inherit"] });
    c.stdout.on("data", (d) => (stdout += d));
    c.on("exit", (x) => resolve(x ?? 1));
  });
  const removal = await removePrivateRoot(dirs);
  let out;
  try {
    out = JSON.parse(stdout.trim().split("\n").at(-1));
  } catch {
    out = { error: "public-route child produced no result" };
  }
  return { ...out, childExit: code, privateRootRemoved: removal.removed };
}

async function drive(cap, handle, ledger, st, text, phase, ctx, { detach = false } = {}) {
  const requestId = `t2mech-${st.n++}`;
  if (detach) cap.detachAfterStart(requestId);
  const rec = await runRequest({ runtime: cap.runtime, handle, ledger, requestId, text, cursor: st.cursor, knownRequestIds: st.known, deadlineMono: clock.mono() + 60_000 });
  let recovery;
  if (detach) recovery = await recoverObservation({ cap, handle, rec, ledger, boundMs: 15_000 });
  st.known.add(requestId);
  const projection = rec.win.firstCandidate ? cap.captured.get(rec.win.firstCandidate.cursor) : undefined;
  const cls = closeRequest({ win: rec.win, control: rec.control, projection, phase, ctx });
  if (rec.win.state === "closed") st.cursor = rec.win.endCursor;
  return { rec, cls, recovery };
}

async function publicChild(root) {
  const cwd = path.join(root, "cwd");
  const argv = [process.execPath, SCRIPTED_AGENT];
  const res = {};
  const fail = [];
  try {
    // Observer loss + re-watch of the same original request; single submission.
    const normal = createTrialRuntime({ cwd, argv, ttlMs: 7_800_000 });
    const capN = withCapture(normal);
    const ln = new PidLedger();
    const { handle: hn } = await ensureWithSampling(normal, { sessionKey: "t2mech-normal", agent: "omp-trial", mode: "persistent", cwd }, ln);
    const stN = { n: 1, cursor: undefined, known: new Set() };
    const lost = await drive(capN, hn, ln, stN, "SCRIPT:valid:soak-token:token:TOK-LOSS", "soak-token", { expectedToken: "TOK-LOSS" }, { detach: true });
    res["observer-loss-recovered"] = { watchError: lost.rec.watchError ?? null, recovered: lost.recovery.recovered, row: lost.cls.row, promptSubmissions: lost.rec.win.rpc.prompt, detachLogged: capN.detachLog.length, duplicateCursorsOnRewatch: lost.recovery.duplicateCursors };
    const un = await drive(capN, hn, ln, stN, "SCRIPT:unfinished", "soak-token", {});
    res["unfinished-yield"] = { row: un.cls.row, c4: un.cls.c4 };
    const two = await drive(capN, hn, ln, stN, "SCRIPT:twoyields:soak-token:token:first:TOK-2", "soak-token", { expectedToken: "TOK-2" });
    res["two-yields"] = { row: two.cls.row, c4: two.cls.c4 };
    const nr = await drive(capN, hn, ln, stN, "SCRIPT:noresult", "soak-token", {});
    res["no-result"] = { row: nr.cls.row, c4: nr.cls.c4 };

    // Between-settled-expectation idle expiry, then a normal-TTL client restores the same ID.
    const short = createTrialRuntime({ cwd, argv, ttlMs: 1_000 });
    const capS = withCapture(short);
    const ls = new PidLedger();
    const { handle: hs } = await ensureWithSampling(short, { sessionKey: "t2mech-restore", agent: "omp-trial", mode: "persistent", cwd }, ls);
    const stS = { n: 1, cursor: undefined, known: new Set() };
    const first = await drive(capS, hs, ls, stS, "SCRIPT:valid:soak-token:token:TOK-A", "soak-token", { expectedToken: "TOK-A" });
    const pre = await sampleStatus(short, hs, "pre-idle");
    ls.record(pre);
    const idle = Number.isInteger(pre.pid) ? await ls.waitExit(pre.pid, "idle-expiry", 20_000, 100) : "no-pid";
    const cleared = await waitStatusPidCleared(short, hs, ls, 5_000, 100);
    const attach = createTrialRuntime({ cwd, argv, ttlMs: 7_800_000 });
    const capA = withCapture(attach);
    const { handle: ha } = await ensureWithSampling(attach, { sessionKey: "t2mech-restore", agent: "omp-trial", mode: "persistent", cwd }, ls);
    const second = await drive(capA, ha, ls, stS, "SCRIPT:valid:soak-token:token:TOK-B", "soak-token", { expectedToken: "TOK-B" });
    const resumes = second.rec.win.rpc.sessionResume;
    res["same-id-restore"] = {
      firstRow: first.cls.row,
      idleExit: idle,
      statusPidCleared: cleared.cleared === true,
      sameBackendId: ha.backendSessionId === hs.backendSessionId,
      sameRecordId: ha.acpxRecordId === hs.acpxRecordId,
      resumeSameId: resumes.length === 1 && resumes[0].sessionId === hs.backendSessionId && resumes[0].ok === true,
      sessionNew: second.rec.win.rpc.sessionNew,
      secondRow: second.cls.row,
    };

    // Restore failure: the agent rejects same-ID resume; no fresh-session fallback.
    const failing = createTrialRuntime({ cwd, argv: [...argv, "--fail-resume"], ttlMs: 1_000 });
    const capF = withCapture(failing);
    const lf = new PidLedger();
    const { handle: hf } = await ensureWithSampling(failing, { sessionKey: "t2mech-fail", agent: "omp-trial", mode: "persistent", cwd }, lf);
    const stF = { n: 1, cursor: undefined, known: new Set() };
    const pf = await sampleStatus(failing, hf, "pre-idle");
    lf.record(pf);
    if (Number.isInteger(pf.pid)) await lf.waitExit(pf.pid, "idle-expiry", 20_000, 100);
    const ef = await drive(capF, hf, lf, stF, "SCRIPT:valid:soak-token:token:TOK-F", "soak-token", { expectedToken: "TOK-F" });
    res["restore-failure-no-fallback"] = { row: ef.cls.row, errorDetailCode: ef.rec.turnResult.errorDetailCode ?? null, sessionNew: ef.rec.win.rpc.sessionNew, resumeRejected: ef.rec.win.rpc.sessionResume.some((r) => r.ok === false), c4: ef.cls.c4 };

    const closes = [];
    for (const [rt, h, l] of [[normal, hn, ln], [attach, ha, ls], [failing, hf, lf]]) closes.push(await closeAndObserve({ runtime: rt, handle: h, ledger: l, reason: "t2 mechanics complete", boundMs: 10_000, pollMs: 100 }));
    await short.shutdown?.();
    for (const rt of [normal, attach, failing]) await rt.shutdown?.();
    res["observed-closes"] = { closes: closes.length, allResolved: closes.every((x) => x.closeResolved && x.recordedClosed), allPidsExited: closes.every((x) => x.allPidsExited), coverage: closes.every((x) => x.pidCoverageNonEmpty) };
  } catch (error) {
    fail.push(`${error?.code ?? error?.name}: ${String(error?.message ?? "").slice(0, 200)}`);
  }
  process.stdout.write(`${JSON.stringify({ cases: res, errors: fail, expectedCases: PUBLIC_CASES })}\n`);
}

if (process.argv[2] === "--public-child") await publicChild(process.argv[3]);
