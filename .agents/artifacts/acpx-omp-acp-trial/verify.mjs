#!/usr/bin/env node
// Independent T2/T3 verifier (spec acpx-omp-acp-trial/spec-v10, S3 completion follow-up).
//   node verify.mjs RUN <AC-MAPPING|AC-MECHANICS|AC-TRANSPORT|AC-RESTORE|AC-REQUESTS|AC-DIAGNOSTICS|AC-DEBUGLOOP|AC-PRODUCTION-GATE|T2|ALL>
//   node verify.mjs RUN <AC-REHEARSAL|AC-CONVERSATION|AC-RETHINK|AC-ARTIFACT|AC-RETRACE|AC-DURATIONS|AC-CLEANUP|AC-REPORT|T3|ALL>
// ALL selects the criteria of the run's actual task (t2.json or t3.json).
// Uses its own constants and comparators; runner booleans (pass, restored,
// production_allowed, ...) are never trusted. Deterministic mechanics are
// re-run and re-compared against the independently authored fixtures;
// request rows are replayed offline from retained A7-safe windows.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readWindowIndependently, replayOutcome } from "./lib/semantic/diagnostics.mjs";
import { runOffline } from "./lib/semantic/mechanics.mjs";

const BUNDLE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(BUNDLE, "..", "..", "..");
const T2_IDS = ["AC-MAPPING", "AC-MECHANICS", "AC-TRANSPORT", "AC-RESTORE", "AC-REQUESTS", "AC-DIAGNOSTICS", "AC-DEBUGLOOP", "AC-PRODUCTION-GATE"];
const GATE_INPUT_IDS = T2_IDS.slice(0, 7);
const T3_IDS = ["AC-REHEARSAL", "AC-CONVERSATION", "AC-RETHINK", "AC-ARTIFACT", "AC-RETRACE", "AC-DURATIONS", "AC-CLEANUP", "AC-REPORT"];
const T3_CRITERIA = T3_IDS.slice(0, 7);
const T3_EVIDENCE_FILES = ["launch.json", "launcher-exit.json", "t3.json", "scenarios.json", "cleanup.json", "accounting.json"];
const PROFILE_PINS = { tiny: { model: "xai-oauth/grok-4.7", thinking: "low" }, A: { model: "anthropic/claude-opus-5-5", thinking: "medium" }, B: { model: "xai-oauth/grok-4.7", thinking: "medium" } };
const REHEARSAL = { usd: 3, wallMs: 45 * 60_000 };
const PRODUCTION = { usd: 20, tokens: 8_000_000, wallMs: 240 * 60_000 };
const MAX_SLOTS = 4;
const GUARDS = ["KR1", "KR2", "KR3", "KR4", "KR5", "KR6", "KR7", "KR8", "KR9", "KR10", "KR11", "KR12", "KR13", "KR14", "KR15", "KR16", "KT1", "KT2", "KT3", "KT4", "KT5", "KB1", "KS1", "KS2", "KS3", "KS4", "KS5", "KS6", "KS7"];
const EVIDENCE_FILES = ["launch.json", "launcher-exit.json", "t2.json", "mechanics.json", "soak.json", "guards.json", "cleanup.json", "accounting.json"];
const REPORT_FILES = ["report.json", "report.md"];
const TINY = { model: "xai-oauth/grok-4.7", thinking: "low" };
const OMP = "/Users/kim/.local/bin/omp";
const SOAK = { sessions: 4, expectations: 10, maxReasks: 3, maxSubmissions: 160, minBytes: 32768, size: ["1:3", "2:3", "3:3"], rewatch: ["1:2", "1:7", "2:2", "3:2", "4:2"], restoreBefore: 6 };
const POST_CLOSE_MS = 10_000;
const POOL = { usd: 6, wallMs: 30 * 60_000 };
const SECRET = [/\bsk-[A-Za-z0-9_-]{16,}/, /Bearer\s+[A-Za-z0-9._-]{16,}/, /"(access|refresh|id)_token"\s*:/i, /api[_-]?key"\s*:\s*"/i, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /CANARY-SCRIPTED-OUTPUT-7f3a/, /CANARY-A7-SECRET/];
const LARGE = { bytes: 2_097_152, sha256: "9c9214717e58d8ceaf581255faab35c026e5d6b408a0a9df56169b7e247cfebf", ipcLimit: 10_485_760 };

const sha = (b) => createHash("sha256").update(b).digest("hex");
const PLAN_PATH = ".agents/plans/2026-09-26-0220_acpx-omp-acp-s3-completion.md";
const readJ = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
function diff(expected, observed, at = "") {
  const out = [];
  for (const [k, v] of Object.entries(expected)) {
    if (isObj(v)) out.push(...diff(v, observed?.[k], `${at}${k}.`));
    else if (JSON.stringify(v) !== JSON.stringify(observed?.[k])) out.push(`${at}${k}: expected ${JSON.stringify(v)}, got ${JSON.stringify(observed?.[k])}`);
  }
  return out;
}

class Check {
  constructor(id) {
    this.id = id;
    this.fails = [];
    this.notes = [];
  }
  need(cond, msg) {
    if (!cond) this.fails.push(msg);
    return cond;
  }
}

/**
 * Plan identity without lifecycle parts (Status value, Completed At line,
 * task/AC checkbox marks, `  completed YYYY-MM-DD-HHMM` lines, Completion
 * Summary section); every other byte stays bound. Authored independently of
 * the runner's recorder.
 */
export function planIdentityText(text) {
  let lines = text.split("\n").filter((l) => !l.startsWith("**Completed At**: ") && !/^ {2}completed \d{4}-\d{2}-\d{2}-\d{4}$/.test(l));
  const h = lines.indexOf("## Completion Summary");
  if (h >= 0) {
    let end = h + 1;
    while (end < lines.length && !lines[end].startsWith("## ")) end++;
    if (end < lines.length) lines = [...lines.slice(0, h), ...lines.slice(end)];
    else {
      // Final section: its separating blank lines go too; the final newline stays.
      let start = h;
      while (start > 0 && lines[start - 1] === "") start--;
      lines = [...lines.slice(0, start), ...(text.endsWith("\n") ? [""] : [])];
    }
  }
  return lines.map((l) => (l.startsWith("**Status**: ") ? "**Status**: <lifecycle>" : /^- \[[ x]\] /.test(l) ? `- [ ] ${l.slice(6)}` : l))
    .join("\n");
}
export const planSha = (text) => sha(planIdentityText(text));

function load(run) {
  const j = (n) => (fs.existsSync(path.join(run, n)) ? readJ(path.join(run, n)) : null);
  if (fs.existsSync(path.join(run, "t3.json"))) return { run, task: "T3", causes: [...(j("t3.json")?.debugLoop?.causes ?? []), ...(j("causes.json")?.causes ?? [])], causeRecords: j("causes.json")?.causes ?? [], t3: j("t3.json"), sc: j("scenarios.json"), cleanup: j("cleanup.json"), acc: j("accounting.json"), launch: j("launch.json"), lexit: j("launcher-exit.json"), report: j("report.json") };
  return { run, task: "T2", t2: j("t2.json"), mech: j("mechanics.json"), soak: j("soak.json"), guards: j("guards.json"), cleanup: j("cleanup.json"), acc: j("accounting.json"), launch: j("launch.json"), lexit: j("launcher-exit.json"), report: j("report.json") };
}

/** Closed retained-file set and secret/canary scan; applies to every check. */
function retention(E, c, requireReport) {
  const files = fs.readdirSync(E.run).sort();
  const allowed = new Set([...EVIDENCE_FILES, ...REPORT_FILES]);
  for (const f of files) c.need(allowed.has(f), `unexpected retained file ${f}`);
  for (const f of EVIDENCE_FILES) c.need(files.includes(f) || (f === "launcher-exit.json" && !requireReport), `missing ${f}`);
  if (requireReport) for (const f of REPORT_FILES) c.need(files.includes(f), `missing ${f}`);
  for (const f of files) {
    const text = fs.readFileSync(path.join(E.run, f), "utf8");
    for (const p of SECRET) c.need(!p.test(text), `${f} matches secret/canary pattern ${p}`);
  }
}

// ------------------------------------------------------------------ fixtures

function fixtureExpectations() {
  const sem = readJ(path.join(BUNDLE, "fixtures/mechanics/semantic-cases.json"));
  const bnd = readJ(path.join(BUNDLE, "fixtures/mechanics/boundary-cases.json"));
  const out = [];
  const add = (group, name, expect, guards = []) => out.push({ key: `${group}:${name}`, expect, guards });
  for (const c of sem.reconcile) add("reconcile", c.name, c.expect, c.guards);
  for (const c of sem.retrace) add("retrace", c.name, c.expect, c.guards);
  for (const c of sem.rootAdmission) add("root-admission", c.name, { admitted: c.admitted }, c.guards);
  for (const c of bnd.windows) add("window", c.name, c.expect, c.guards);
  for (const c of bnd.diagnostics) add("diagnostic", c.name, c.expect, c.guards);
  add("snapshot", bnd.snapshot.name, bnd.snapshot.expect, bnd.snapshot.guards);
  add("replay", bnd.replay.name, bnd.replay.expect, bnd.replay.guards);
  for (const c of bnd.debugloop) add("debugloop", c.name, { steps: c.steps.map((s) => (s.expect === undefined ? null : s.expect)) }, c.guards);
  for (const c of bnd.gate) add("gate", c.name, c.expect, c.guards);
  for (const c of bnd.restores) add("restore", c.name, c.expect, c.guards);
  add("export", "a7-safe-export", { exportEqual: true, canaryAbsent: true });
  return out;
}

let rerunCache;
async function rerunOffline() {
  rerunCache ??= await runOffline();
  return rerunCache;
}

/** Compares observed mechanics (retained and freshly re-run) with fixture expectations. */
async function mechanicsAgainstFixtures(E, c, groups) {
  const fx = fixtureExpectations().filter((x) => !groups || groups.includes(x.key.split(":")[0]));
  const retained = new Map((E.mech?.offline ?? []).map((x) => [`${x.group}:${x.name}`, x]));
  const fresh = new Map((await rerunOffline()).map((x) => [`${x.group}:${x.name}`, x]));
  for (const f of fx) {
    const r = retained.get(f.key);
    const n = fresh.get(f.key);
    if (!c.need(r && n, `${f.key}: missing observation`)) continue;
    const d1 = diff(f.expect, r.observed);
    const d2 = diff(f.expect, n.observed);
    c.need(d1.length === 0, `${f.key} retained: ${d1.join("; ")}`);
    c.need(d2.length === 0, `${f.key} re-run: ${d2.join("; ")}`);
  }
  return fx.length;
}

// ------------------------------------------------------------------ checks

async function checkMapping(E) {
  const c = new Check("AC-MAPPING");
  retention(E, c, false);
  const m = E.guards?.mapping ?? [];
  const ids = m.map((g) => g.id);
  c.need(JSON.stringify(ids) === JSON.stringify(GUARDS), `mapping ids differ from the 29 baseline obligations: ${ids.join(",")}`);
  c.need(JSON.stringify(E.guards?.ids) === JSON.stringify(GUARDS), "guards.ids differs");
  const fx = new Map(fixtureExpectations().map((x) => [x.key, x]));
  const pub = new Set(Object.keys(readJ(path.join(BUNDLE, "fixtures/mechanics/public-route-expected.json")).cases));
  for (const g of m) {
    c.need(["coded", "llm", "coded+llm"].includes(g.responsibility), `${g.id}: responsibility ${g.responsibility}`);
    c.need(Array.isArray(g.enforcement) && g.enforcement.length > 0, `${g.id}: no enforcement locator`);
    for (const loc of g.enforcement ?? []) {
      const [file, sym] = loc.split("#");
      const abs = path.join(BUNDLE, file);
      if (!c.need(fs.existsSync(abs), `${g.id}: enforcement file ${file} missing`)) continue;
      if (sym) {
        const text = fs.readFileSync(abs, "utf8");
        const found = file.endsWith(".md") ? text.includes(`<!-- prompt:${sym} -->`) : new RegExp(`(function\\*?|class|const|let)\\s+${sym}\\b|\\b${sym}\\s*\\(`).test(text);
        c.need(found, `${g.id}: symbol ${sym} not found in ${file}`);
      }
    }
    if (g.responsibility.includes("llm")) c.need(g.enforcement.some((l) => l.startsWith("prompts/semantic/")), `${g.id}: LLM responsibility without a fixed prompt locator`);
    c.need(Array.isArray(g.proof) && g.proof.length > 0, `${g.id}: no proof locator`);
    for (const p of g.proof ?? []) {
      if (p.startsWith("public:")) c.need(pub.has(p.slice(7)), `${g.id}: public case ${p} unknown`);
      else if (p.startsWith("evidence:")) c.need(p === "evidence:/safety/protectedUnchanged" && E.t2?.readonly?.protectedUnchanged === true, `${g.id}: evidence ${p} not satisfied`);
      else {
        const f = fx.get(p);
        if (c.need(f, `${g.id}: proof case ${p} is not a fixture case`)) c.need(f.guards.includes(g.id), `${g.id}: fixture case ${p} does not list ${g.id} in guards`);
      }
    }
  }
  for (const g of GUARDS) {
    const tagged = [...fx.values()].filter((x) => x.guards.includes(g)).length;
    c.need(tagged > 0, `${g}: no fixture case is tagged with it`);
  }
  const text = JSON.stringify(E.guards);
  c.need(!/"id":"C[25]"/.test(text), "C2/C5 appear as mapped obligations");
  return c;
}

async function checkMechanics(E) {
  const c = new Check("AC-MECHANICS");
  retention(E, c, false);
  const n = await mechanicsAgainstFixtures(E, c, null);
  c.need((E.mech?.offline ?? []).length === n, `retained offline case count ${(E.mech?.offline ?? []).length} != fixture count ${n}`);
  c.notes.push(`${n} fixture cases compared (retained and re-run)`);
  // Public-route scripted mechanics against independent expectations.
  const pexp = readJ(path.join(BUNDLE, "fixtures/mechanics/public-route-expected.json"));
  const pr = E.mech?.publicRoute ?? {};
  c.need(pr.childExit === 0 && pr.privateRootRemoved === true && (pr.errors ?? []).length === 0, `public route child exit ${pr.childExit}, root removed ${pr.privateRootRemoved}, errors ${JSON.stringify(pr.errors)}`);
  for (const [name, exp] of Object.entries(pexp.cases)) {
    const d = diff(exp, pr.cases?.[name]);
    c.need(d.length === 0, `public ${name}: ${d.join("; ")}`);
  }
  // A3 large fixture.
  const L = E.mech?.large ?? {};
  c.need(L.childExit === 0 && L.privateRoot?.removed === true, "large fixture child/root");
  c.need(L.row === "candidate-valid" && L.windowComplete === true && L.turnResult?.status === "completed", `large row ${L.row}`);
  c.need(L.payload?.bytes === LARGE.bytes && L.payload?.sha256 === LARGE.sha256, `large payload ${JSON.stringify(L.payload)?.slice(0, 200)}`);
  const maxLine = Array.isArray(L.journal) ? Math.max(...L.journal.map((j) => j.maxLineBytesInclLf)) : undefined;
  c.need(typeof maxLine === "number" && maxLine > LARGE.bytes && maxLine < LARGE.ipcLimit, `large journal max line ${maxLine}`);
  c.need(L.rpc?.prompt === 1 && L.rpc?.sessionNew === 0, `large rpc ${JSON.stringify(L.rpc)}`);
  c.need(L.envNpmPackageKeys === 0, "large child saw npm_package_* keys");
  return c;
}

function soakFacts(E, c) {
  const S = E.soak;
  if (!c.need(S && Array.isArray(S.sessions), "soak not run")) return null;
  c.need(S.sessions.length === SOAK.sessions, `sessions ${S.sessions.length}`);
  return S;
}

function expectedArgv(sessionDir) {
  return [OMP, "acp", "--model", TINY.model, "--thinking", TINY.thinking, "--tools", "read,glob,grep,yield", "--no-extensions", "--no-skills", "--no-rules", "--no-lsp", "--no-title", "--config", path.join(BUNDLE, "config", "omp-overlay.yml"), "--session-dir", sessionDir];
}

async function checkTransport(E) {
  const c = new Check("AC-TRANSPORT");
  retention(E, c, false);
  const S = soakFacts(E, c);
  if (!S) return c;
  const runId = path.basename(E.run);
  c.need(S.sessionDir === `/Users/kim/.omp/agent/sessions/acpx-trial-${runId}`, `session dir ${S.sessionDir}`);
  c.need(JSON.stringify(S.registryArgv) === JSON.stringify(expectedArgv(S.sessionDir)), "registry argv differs from the pinned tiny profile");
  let subs = 0;
  let firstTry = 0;
  for (const s of S.sessions) {
    c.need(s.expectations.length === SOAK.expectations, `s${s.index}: ${s.expectations.length} expectations`);
    const want = S.registryArgv.join(" ");
    const observed = [...(s.creationLaunchArgv ?? []), ...s.requests.flatMap((q) => q.launchArgv ?? [])];
    c.need(observed.length > 0, `s${s.index}: no observed launch argv`);
    for (const o of observed) c.need(o.command === want, `s${s.index}: observed launch argv differs (pid ${o.pid})`);
    for (const e of s.expectations) {
      const pos = `${s.index}:${e.index}`;
      c.need(e.kind === (SOAK.size.includes(pos) ? "soak-size" : "soak-token"), `${pos} kind ${e.kind}`);
      const reqs = s.requests.filter((q) => q.expectation === e.index);
      subs += reqs.length;
      c.need(reqs.length >= 1 && reqs.length <= SOAK.maxReasks + 1, `${pos}: ${reqs.length} submissions`);
      c.need(reqs.every((q, i) => q.attempt === i + 1), `${pos}: attempts not sequential`);
      c.need(reqs.slice(0, -1).every((q) => ["candidate-invalid", "completed-no-result"].includes(q.classification.row)), `${pos}: a re-ask followed a non-C4 row`);
      const last = reqs.at(-1);
      if (!c.need(last?.classification?.row === "candidate-valid", `${pos}: not eventually valid (${last?.classification?.row ?? "no request"})`)) continue;
      if (reqs.length === 1) firstTry++;
      const p = last.candidate?.projection ?? {};
      c.need(p.kind === e.kind, `${pos}: admitted kind ${p.kind}`);
      if (e.kind === "soak-token") c.need(p.token === e.token, `${pos}: token mismatch`);
      else c.need(typeof p.payload === "string" && Buffer.byteLength(p.payload, "utf8") >= SOAK.minBytes, `${pos}: payload ${typeof p.payload === "string" ? Buffer.byteLength(p.payload, "utf8") : "missing"} bytes`);
    }
  }
  c.need(subs === S.submissions && subs <= SOAK.maxSubmissions, `submissions ${subs} (recorded ${S.submissions})`);
  const ids = S.sessions.flatMap((s) => s.requests.map((q) => q.requestId));
  c.need(new Set(ids).size === ids.length, "a request id was submitted twice (replay)");
  c.need(S.sessions.flatMap((s) => s.requests).every((q) => q.window?.rpc?.sessionNew === 0 && q.window?.rpc?.prompt === 1), "a request window shows session/new fallback or not exactly one prompt");
  // Overlap: one instant at which all four sessions were active.
  const from = Math.max(...S.sessions.map((s) => Date.parse(s.activeFrom)));
  const until = Math.min(...S.sessions.map((s) => Date.parse(s.activeUntil)));
  c.need(from < until, `sessions did not all overlap (${S.sessions.map((s) => `${s.activeFrom}..${s.activeUntil}`).join(", ")})`);
  // Observed closes and shutdown order.
  for (const s of S.sessions) {
    const cl = s.close ?? {};
    c.need(cl.closeResolved === true && cl.recordedClosed === true, `s${s.index}: close not resolved/recorded`);
    c.need(Array.isArray(cl.pidResults) && cl.pidResults.length > 0 && cl.pidResults.every((r) => r.result === "ESRCH"), `s${s.index}: PID results ${JSON.stringify(cl.pidResults)}`);
    const pids = new Set((s.ledger?.pids ?? []).map((x) => x.pid ?? x));
    c.need(pids.size > 0, `s${s.index}: no published PIDs`);
  }
  const order = S.disposalOrder ?? [];
  c.need(order.indexOf("shutdown:short") > order.lastIndexOf("close:s4") && order.indexOf("close:s1") === 0, `disposal order ${order.join(",")}`);
  c.notes.push(`first-try valid ${firstTry}/40; submissions ${subs}; re-asks ${subs - 40}`);
  return c;
}

async function checkRestore(E) {
  const c = new Check("AC-RESTORE");
  retention(E, c, false);
  const S = soakFacts(E, c);
  if (!S) return c;
  for (const s of S.sessions) {
    c.need(s.restores?.length === 1, `s${s.index}: ${s.restores?.length} planned restores`);
    const r = s.restores?.[0];
    if (!r) continue;
    c.need(r.beforeExpectation === SOAK.restoreBefore, `s${s.index}: restore before ${r.beforeExpectation}`);
    c.need(r.idleExit === "ESRCH", `s${s.index}: idle exit ${r.idleExit}`);
    c.need(r.statusPidCleared?.cleared === true, `s${s.index}: status PID not cleared`);
    c.need(r.attachedIdentity?.backendSessionId === s.identity.backendSessionId && r.attachedIdentity?.acpxRecordId === s.identity.acpxRecordId, `s${s.index}: attached identity differs`);
    const first = s.requests.find((q) => q.expectation === SOAK.restoreBefore && q.attempt === 1);
    if (!c.need(first, `s${s.index}: no first post-restore request`)) continue;
    c.need(first.runtime === "normal", `s${s.index}: post-restore request on ${first.runtime}`);
    const res = first.window.rpc.sessionResume;
    c.need(res.length === 1 && res[0].sessionId === s.identity.backendSessionId && res[0].ok === true, `s${s.index}: resume ${JSON.stringify(res)}`);
    c.need(first.window.rpc.sessionNew === 0, `s${s.index}: session/new on restore`);
    // The expired owner's PID must be in the ledger with an ESRCH observation.
    c.need(Number.isInteger(r.observedPid), `s${s.index}: no observed pre-expiry PID`);
    // Every resume anywhere is same-ID and accepted (incidental restores included).
    for (const q of s.requests) for (const x of q.window.rpc.sessionResume) c.need(x.sessionId === s.identity.backendSessionId && x.ok === true, `s${s.index}: ${q.requestId} resume ${JSON.stringify(x)}`);
  }
  // Restore mechanics (same-ID, changed-ID, unknown outcome, rejection, fallback), retained and re-run.
  await mechanicsAgainstFixtures(E, c, ["restore"]);
  const pexp = readJ(path.join(BUNDLE, "fixtures/mechanics/public-route-expected.json")).cases;
  for (const name of ["same-id-restore", "restore-failure-no-fallback"]) {
    const d = diff(pexp[name], E.mech?.publicRoute?.cases?.[name]);
    c.need(d.length === 0, `public ${name}: ${d.join("; ")}`);
  }
  // Restored-context integrity: never inferred from a stable ID.
  let maxChars = 0;
  for (const s of S.sessions) for (const q of s.requests) for (const v of Object.values(q.candidate?.projection ?? {})) if (typeof v === "string") maxChars = Math.max(maxChars, v.length);
  const ci = S.contextIntegrity ?? {};
  c.need(ci.status === "unproved" && ci.maxAdmittedStringChars === maxChars && ci.limitChars === 500_000 && ci.exposed === maxChars >= 500_000, `context integrity ${JSON.stringify(ci)} (independent max ${maxChars})`);
  // First-review flags: the soak owns no reviewer, so none can be reset here.
  // The report is written after the runner's own criteria pass (C1): the
  // statement is required whenever report.json exists.
  if (E.report) c.need((E.report.limits ?? []).some((l) => /first-review flags/.test(l)), "report does not state first-review flag coverage");
  const inc = S.sessions.reduce((a, s) => a + (s.incidental?.length ?? 0), 0);
  c.notes.push(`incidental same-ID restores ${inc}; restored-context integrity ${ci.status}, max admitted string ${maxChars} chars`);
  return c;
}

async function checkRequests(E) {
  const c = new Check("AC-REQUESTS");
  retention(E, c, false);
  const S = soakFacts(E, c);
  if (!S) return c;
  let n = 0;
  for (const s of S.sessions) {
    for (const q of s.requests) {
      n++;
      const e = s.expectations.find((x) => x.index === q.expectation);
      const ctx = e.kind === "soak-size" ? { minPayloadBytes: SOAK.minBytes } : { expectedToken: e.token };
      const w = readWindowIndependently(q.window.events, q.requestId);
      c.need(w.opened && w.complete, `${q.requestId}: window incomplete by independent reader`);
      c.need(w.association.foreignInside === 0, `${q.requestId}: foreign traffic inside window`);
      c.need(q.window.unknownRequestIds.length === 0 || Object.keys(q.window.unknownRequestIds).length === 0, `${q.requestId}: unknown request ids`);
      const projections = q.candidate ? { [q.candidate.cursor]: q.candidate.projection } : {};
      const r = replayOutcome({ requestId: q.requestId, events: q.window.events, projections, control: q.control, phase: e.kind, ctx });
      c.need(r.row === q.classification.row, `${q.requestId}: replayed row ${r.row} != retained ${q.classification.row}`);
    }
  }
  // Designated re-watches: detached after turn_started, recovered from the same original request, never resubmitted.
  const rw = S.sessions.flatMap((s) => (s.rewatches ?? []).map((r) => ({ ...r, s: s.index })));
  const got = rw.map((r) => `${r.s}:${r.expectation}`).sort();
  c.need(JSON.stringify(got) === JSON.stringify([...SOAK.rewatch].sort()), `re-watch positions ${got.join(",")}`);
  for (const r of rw) {
    c.need(r.detached === true && r.recovered === true, `re-watch ${r.requestId}: detached ${r.detached} recovered ${r.recovered}`);
    const q = S.sessions[r.s - 1].requests.find((x) => x.requestId === r.requestId);
    c.need(q?.attempt === 1 && q.watchError === "TRIAL_OBSERVER_DETACHED" && q.window.rpc.prompt === 1, `re-watch ${r.requestId}: not the original single submission`);
    const next = S.sessions[r.s - 1].requests.filter((x) => x.expectation === r.expectation);
    c.need(next[0]?.requestId === r.requestId, `re-watch ${r.requestId}: another submission preceded it`);
  }
  c.need((S.detachLog ?? []).length === SOAK.rewatch.length, `detach log ${(S.detachLog ?? []).length}`);
  c.notes.push(`${n} request windows replayed offline`);
  return c;
}

async function checkDiagnostics(E) {
  const c = new Check("AC-DIAGNOSTICS");
  retention(E, c, false);
  await mechanicsAgainstFixtures(E, c, ["diagnostic", "snapshot", "replay", "export"]);
  const diags = (E.soak?.sessions ?? []).flatMap((s) => s.diagnostics ?? []);
  const du = (E.soak?.sessions ?? []).flatMap((s) => s.requests).filter((q) => q.classification.row === "delivery-uncertain");
  c.need(diags.length === du.length, `delivery-uncertain rows ${du.length} but diagnostics ${diags.length}`);
  for (const d of diags) c.need(d.codeFault === false && ["unproved", "journaled", "not-supported-required-observable-path", "not-applicable"].includes(d.result), `diagnostic ${d.requestId}: ${d.result}`);
  c.notes.push(`native delivery-uncertain diagnostics: ${diags.length}`);
  return c;
}

async function checkDebugLoop(E) {
  const c = new Check("AC-DEBUGLOOP");
  retention(E, c, false);
  await mechanicsAgainstFixtures(E, c, ["debugloop"]);
  const dl = E.t2?.debugLoop;
  if (!c.need(dl, "no debug-loop record")) return c;
  c.need(dl.extensionApproved === true, "debug-loop extension not bound to approval");
  const open = (dl.causes ?? []).filter((x) => x.status !== "fixed-offline");
  c.need(dl.blocksDone === open.length > 0, "blocksDone inconsistent with causes");
  const faults = (E.t2?.stops ?? []).filter((s) => s.startsWith("trial-code-or-runtime-fault"));
  c.need(faults.length === 0 || (dl.causes ?? []).length > 0, `trial-code fault without a recorded cause: ${faults.join(",")}`);
  for (const cause of dl.causes ?? []) c.need((cause.fixes?.length ?? 0) <= 2, `${cause.id}: more than 2 fixes`);
  return c;
}

async function checkGate(E) {
  const c = new Check("AC-PRODUCTION-GATE");
  retention(E, c, true);
  const reasons = [];
  // T1 dependency, re-read and re-verified here.
  const t1Run = path.join(path.dirname(E.run), E.t2?.t1?.run ?? "-");
  const t1 = fs.existsSync(path.join(t1Run, "report.json")) ? readJ(path.join(t1Run, "report.json")) : null;
  if (t1?.capability?.overall !== "supported" || t1?.t2_entry_permitted !== true || t1?.cleanup?.status !== "complete") reasons.push("T1 not supported/entry/cleanup");
  const pv = spawnSync(process.execPath, [path.join(BUNDLE, "probe-verify.mjs"), t1Run, "T1"], { encoding: "utf8" });
  if (pv.status !== 0) reasons.push("T1 independent check failed");
  // The seven criteria, evaluated here.
  const results = {};
  for (const id of GATE_INPUT_IDS) {
    const r = await CHECKS[id](E);
    results[id] = r.fails.length ? "FAIL" : "PASS";
    if (r.fails.length) reasons.push(`${id} FAIL`);
  }
  // Identities: every recorded source hash still matches.
  const changed = [];
  for (const [f, h] of Object.entries(E.report.identities ?? {})) {
    let cur;
    if (f === "authority:spec") cur = sha(fs.readFileSync(path.join(REPO, ".agents/artifacts/2026-09-24_acpx-omp-acp-trial-spec.md")));
    else if (f === "authority:plan") cur = planSha(fs.readFileSync(path.join(REPO, PLAN_PATH), "utf8"));
    else cur = fs.existsSync(path.join(BUNDLE, f)) ? sha(fs.readFileSync(path.join(BUNDLE, f))) : "missing";
    if (cur !== h) changed.push(f);
  }
  // Verifier-only B4 correction recorded in this run's evidence: accepted only
  // when verify.mjs is the sole changed identity, one fixed-offline cause binds
  // its exact before/after hashes, and criteria differ only where it names.
  const differing = GATE_INPUT_IDS.filter((id) => results[id] !== E.report.criteria?.[id]);
  const currentVerify = sha(fs.readFileSync(path.join(BUNDLE, "verify.mjs")));
  const verifierFixes = (E.t2?.debugLoop?.causes ?? []).filter((x) => x.status === "fixed-offline" && x.target?.file === "verify.mjs" && x.fixes?.some((f) => f.verifySha256Before === E.report.identities?.["verify.mjs"] && f.verifySha256After === currentVerify));
  const fix = verifierFixes.length === 1 ? verifierFixes[0].fixes.findLast((f) => f.verifySha256After === currentVerify) : null;
  const verifierCorrection = changed.length === 1 && changed[0] === "verify.mjs" && fix !== null && differing.every((id) => fix.affectedCriteria?.includes(id));
  // Verifier-only correction discovered by exactly one T3 run of this T2 run:
  // its owner-appended causes.json binds one before/after verify.mjs pair and
  // names every recomputed T2 criterion difference. Only verify.mjs is exempt.
  let t3Correction = null;
  if (!verifierCorrection && changed.length === 1 && changed[0] === "verify.mjs") {
    const parent = path.dirname(E.run);
    const t3Runs = fs.readdirSync(parent).filter((n) => {
      const f = path.join(parent, n, "t3.json");
      try {
        return fs.existsSync(f) && path.basename(readJ(f).entry?.t2Run ?? "") === path.basename(E.run);
      } catch {
        return false;
      }
    });
    if (t3Runs.length === 1) {
      const cf = path.join(parent, t3Runs[0], "causes.json");
      const recs = fs.existsSync(cf) ? readJ(cf).causes ?? [] : [];
      const fixes = recs.flatMap((x) => x.fixes ?? []);
      const befores = new Set(fixes.map((f) => f.verifySha256Before));
      const afters = new Set(fixes.map((f) => f.verifySha256After));
      const ok = recs.length > 0 && recs.every((x) => x.status === "fixed-offline" && x.target?.file === "verify.mjs" && (x.fixes?.length ?? 0) >= 1) && befores.size === 1 && befores.has(E.report.identities?.["verify.mjs"]) && afters.size === 1 && afters.has(currentVerify) && differing.every((id) => fixes.some((f) => f.affectedCriteria?.includes(id)));
      if (ok) t3Correction = { run: t3Runs[0], causes: recs.map((x) => x.id) };
    }
  }
  const verifierOnly = verifierCorrection || t3Correction !== null;
  for (const f of changed) if (!(verifierOnly && f === "verify.mjs")) reasons.push(`identity changed: ${f}`);
  if (verifierCorrection) c.notes.push(`verifier-only correction ${verifierFixes[0].id} accepted; recomputed criteria differ from the report only for ${differing.join(",") || "none"}`);
  if (t3Correction) c.notes.push(`verifier-only correction ${t3Correction.causes.join(",")} from ${t3Correction.run} accepted; recomputed criteria differ from the report only for ${differing.join(",") || "none"}`);
  if (!verifierOnly) c.need(JSON.stringify(results) === JSON.stringify(E.report.criteria), `report criteria ${JSON.stringify(E.report.criteria)} != verified ${JSON.stringify(results)}`);
  if (E.report.identities?.["authority:spec"] !== "d38f487721c78df7b53d41c31d4b5f37a3c31a699f0d196ee88192c1e0c956ba") reasons.push("spec identity not spec-v10");
  if (E.t2?.authority?.ok !== true) reasons.push("authority not ok");
  // Cleanup and safety.
  if (E.cleanup?.privateRootRemovedAfterRetention !== true || E.lexit?.privateRootPresentAfterChild !== false) reasons.push("private root not removed by the child");
  if (E.t2?.liveStoreCleanup?.complete !== true) reasons.push("live-store cleanup not complete");
  const pb = E.t2?.readonly?.protectedBefore ?? {};
  const pa = E.t2?.readonly?.protectedAfter ?? {};
  if (!Object.keys(pb).length || Object.keys(pb).some((k) => pb[k] !== pa[k])) reasons.push("protected sources changed or unobserved");
  // Soak supported per B1.
  const S = E.soak;
  const exps = S?.sessions?.flatMap((s) => s.expectations) ?? [];
  if (exps.filter((e) => e.outcome === "delivered").length !== 40) reasons.push("soak not 40/40 eventually valid");
  if ((E.t2?.stops ?? []).length) reasons.push(`stops: ${E.t2.stops.join("; ")}`);
  // Pool: the recorded run limits must be this verifier's own allowance.
  if (E.t2?.pool?.limitUsd !== POOL.usd || E.t2?.pool?.limitWallMs !== POOL.wallMs) reasons.push(`probe/soak pool limit recorded ${E.t2?.pool?.limitUsd} USD/${E.t2?.pool?.limitWallMs} ms != approved ${POOL.usd} USD/${POOL.wallMs} ms`);
  // Pool: within the shared probe/soak allowance.
  const wall = (E.acc?.priorWallMs ?? 0) + (E.acc?.wallMs ?? Infinity);
  if (wall > POOL.wallMs) reasons.push("probe/soak wall exceeded");
  const cost = E.acc?.cost?.amount;
  if (typeof cost === "number" && cost + (E.acc?.priorCostKnownUsd ?? 0) > POOL.usd) reasons.push("probe/soak cost exceeded");
  if ((E.t2?.debugLoop?.causes ?? []).some((x) => x.status !== "fixed-offline")) reasons.push("unfixed trial-code cause");
  const allowed = reasons.length === 0;
  if (!verifierCorrection) c.need(E.report.production_allowed === allowed, `report production_allowed ${E.report.production_allowed} but derived ${allowed} (${reasons.join("; ")})`);
  c.need(E.report.t3_executed === false, "T3 executed in T2");
  c.notes.push(`derived production_allowed=${allowed}${reasons.length ? ` (${reasons.join("; ")})` : ""}`);
  return c;
}

// ------------------------------------------------------------------ T3

/** Closed T3 retained-file set and secret/canary scan. */
function retentionT3(E, c, requireReport) {
  const files = fs.readdirSync(E.run).sort();
  const allowed = new Set([...T3_EVIDENCE_FILES, ...REPORT_FILES, "causes.json"]);
  for (const f of files) c.need(allowed.has(f), `unexpected retained file ${f}`);
  for (const f of T3_EVIDENCE_FILES) c.need(files.includes(f) || (f === "launcher-exit.json" && !requireReport), `missing ${f}`);
  if (requireReport) for (const f of REPORT_FILES) c.need(files.includes(f), `missing ${f}`);
  for (const f of files) {
    const text = fs.readFileSync(path.join(E.run, f), "utf8");
    for (const p of SECRET) c.need(!p.test(text), `${f} matches secret/canary pattern ${p}`);
  }
}

const t3Actors = (E, stage) => (E.sc?.actors ?? []).filter((a) => !stage || a.stage === stage);
const scen = (E, stage, s) => E.sc?.stages?.[stage]?.scenarios?.[s];
const plannedStages = (E) => (E.t3?.plan ?? []).map((p) => p.stage);
const PROD_PROFILE = (role) => (role === "B" ? "B" : "A");

/** Launch pins: a native actor's registry argv must carry exactly its profile's model/thinking. */
function argvProfileOk(a, profile, scripted) {
  if (scripted) return a.profile === profile;
  const argv = a.registryArgv ?? [];
  const at = (flag) => argv[argv.indexOf(flag) + 1];
  return a.profile === profile && argv[0] === OMP && at("--model") === PROFILE_PINS[profile].model && at("--thinking") === PROFILE_PINS[profile].thinking && !argv.includes("xhigh");
}

/** T3 entry evidence: all eight T2 checks PASS and derived production_allowed=true (or a scripted self-test). */
function entryOk(E) {
  const en = E.launch?.entry ?? E.t3?.entry;
  if (E.t3?.scripted === true) return en?.scripted === true;
  return en?.ok === true && en.verifyExit === 0 && en.verifyLast === "PASS T2" && en.productionAllowed === true && T2_IDS.every((id) => en.results?.[id] === "PASS") && en.derivedLine === "note AC-PRODUCTION-GATE: derived production_allowed=true";
}

/** A scenario record on a non-executed branch must name its reason; returns true when executed. */
function branch(c, rec, label) {
  if (!rec) {
    c.notes.push(`${label}: not planned in this execution`);
    return false;
  }
  if (rec.status === "executed") return true;
  c.need(typeof rec.reason === "string" || rec.fault, `${label}: ${rec.status} branch without a recorded reason`);
  c.notes.push(`${label}: ${rec.status} (${rec.reason ?? rec.fault?.invariant ?? rec.fault?.name})`);
  return false;
}

/** Retained request rows of the named actors, keyed by request id. */
function requestIndex(actors) {
  const m = new Map();
  for (const a of actors) for (const q of a.requests ?? []) m.set(q.requestId, { a, q });
  return m;
}

function checkRehearsal(E) {
  const c = new Check("AC-REHEARSAL");
  retentionT3(E, c, false);
  c.need(entryOk(E), "T3 entry evidence does not show all eight T2 checks PASS with derived production_allowed=true");
  const L = E.acc?.limits;
  c.need(L?.rehearsal?.usd === REHEARSAL.usd && L?.rehearsal?.wallMs === REHEARSAL.wallMs, `rehearsal subcap recorded ${JSON.stringify(L?.rehearsal)}`);
  c.need(L?.production?.usd === PRODUCTION.usd && L?.production?.tokens === PRODUCTION.tokens && L?.production?.wallMs === PRODUCTION.wallMs, `production limit recorded ${JSON.stringify(L?.production)}`);
  c.need(E.acc?.pool === "production", "T3 spend is not charged to the production pool");
  const stages = plannedStages(E);
  if (!stages.length) {
    c.need((E.t3?.stops ?? []).some((s) => s.startsWith("preflight:")), "empty plan without a recorded preflight stop");
    c.need(t3Actors(E).length === 0 && E.t3?.processesStarted === false, "empty plan but actors/processes exist");
    c.notes.push(`not-run branch: ${(E.t3?.stops ?? []).join("; ")}`);
    return c;
  }
  const corrected = E.t3?.corrects;
  if (!corrected) c.need(JSON.stringify(E.t3.plan) === JSON.stringify([{ stage: "rehearsal", scenarios: ["S1", "S2", "S3"] }, { stage: "production", scenarios: ["S1", "S2", "S3"], requiresRehearsalClear: true }]), `planned execution is not rehearsal S1/S2/S3 then production S1/S2/S3: ${JSON.stringify(E.t3.plan)}`);
  else {
    c.need(E.t3.plan.length === 1 && E.t3.plan[0].stage === corrected.stage && JSON.stringify(E.t3.plan[0].scenarios) === JSON.stringify(corrected.scenarios), "corrected execution plans more than its authorized stage/scenarios");
    c.need(corrected.ok === true, "corrected execution without recorded eligibility");
  }
  if (stages.includes("rehearsal")) {
    const reh = t3Actors(E, "rehearsal");
    for (const a of reh) c.need(argvProfileOk(a, "tiny", E.t3.scripted), `${a.key}: rehearsal actor not on the tiny profile`);
    for (const s of E.t3.plan.find((p) => p.stage === "rehearsal").scenarios) {
      const rec = scen(E, "rehearsal", s);
      c.need(Boolean(rec), `rehearsal ${s} has no record`);
      if (rec?.status === "censored") c.need(/^(rehearsal-subcap|production-limit)/.test(rec.reason ?? ""), `rehearsal ${s} censored without a cap reason`);
      if (rec) c.notes.push(`rehearsal ${s}: ${rec.status}${rec.result ? ` ${rec.result.status}${rec.result.stop ? `/${rec.result.stop.cause}` : ""}` : rec.retrace ? ` ${rec.retrace.status}` : ""}`);
    }
    // Model work stops at the subcap: no rehearsal submission after it was reached.
    const hit = E.acc?.limitReached?.rehearsal?.mono;
    if (typeof hit === "number") for (const a of reh) for (const q of a.requests ?? []) c.need(q.submittedMono < hit, `${q.requestId} submitted after the rehearsal subcap was reached`);
    const prod = E.sc?.stages?.production;
    if (prod?.entered) {
      const faults = Object.values(E.sc.stages.rehearsal.scenarios).filter((x) => x.fault);
      c.need(faults.length === 0, "production entered with an unresolved rehearsal code fault");
      for (const a of reh.filter((x) => x.ensureInvokedAt)) c.need(a.close?.closeResolved && a.close?.recordedClosed && a.close?.allPidsExited, `production entered before ${a.key} disposal was observed`);
      const lastReh = Math.max(0, ...reh.map((a) => a.closedMono ?? 0));
      for (const a of t3Actors(E, "production")) c.need((a.requests?.[0]?.submittedMono ?? Infinity) > lastReh, `${a.key} submitted before rehearsal disposal completed`);
    } else if (prod) c.need(typeof prod.notEnteredReason === "string", "production not entered without a recorded reason");
  } else c.need(corrected?.stage === "production", "production without rehearsal outside an authorized production-origin correction");
  c.notes.push("rehearsal is diagnostic tiny-profile evidence and never production evidence");
  return c;
}

/** Reconcile branch checks shared by S1/S2: bindings, turns backed by retained valid rows, rendering. */
function reconcileTruth(c, E, rec, label, mode, cap) {
  const r = rec.result;
  c.need(r && ["final", "stopped"].includes(r.status), `${label}: controller status ${r?.status}`);
  if (!r) return;
  c.need(r.mode === mode && JSON.stringify(r.cap) === JSON.stringify(cap), `${label}: mode/cap ${r.mode}/${r.cap}`);
  const actors = t3Actors(E, "production").filter((a) => a.scenario === rec.scenario && a.owner === "root");
  const idx = requestIndex(actors);
  for (const a of actors) c.need(argvProfileOk(a, PROD_PROFILE(a.role), E.t3.scripted), `${a.key}: not on production profile ${PROD_PROFILE(a.role)}`);
  c.need(JSON.stringify([...new Set(actors.map((a) => a.role))].sort()) === JSON.stringify([...(r.reviewersCreated ?? [])].sort()) && actors.length === (r.reviewersCreated ?? []).length, `${label}: created reviewers ${r.reviewersCreated} != actors ${actors.map((a) => a.role)}`);
  for (const round of r.rounds ?? []) {
    for (const t of round.turns ?? []) {
      const hit = idx.get(t.requestId);
      c.need(hit && hit.q.controllerRow === "candidate-valid" && hit.q.classification?.row === "candidate-valid", `${label}: turn ${t.role} ${t.verdict} not backed by a retained candidate-valid row (${t.requestId})`);
      c.need(["VALID", "REVISE", "BLOCKED"].includes(t.verdict), `${label}: turn verdict ${t.verdict}`);
    }
  }
  // Re-asks happen only after a C4 row and never exceed three per expectation.
  const perExp = new Map();
  for (const a of actors) for (const q of a.requests ?? []) if (q.reask) perExp.set(q.expectationId, (perExp.get(q.expectationId) ?? 0) + 1);
  for (const [id, n] of perExp) c.need(n <= 3, `${label}: ${n} re-asks for ${id}`);
  if (r.status === "stopped") c.need(r.stop && typeof r.stop.cause === "string", `${label}: stopped without a cause`);
  c.need(typeof rec.render === "string" && rec.render.length > 0, `${label}: no complete rendering`);
  const reasks = [...perExp.values()].reduce((x, y) => x + y, 0);
  c.notes.push(`${label}: ${r.status}${r.stop ? `/${r.stop.cause}` : ""}; rounds ${(r.rounds ?? []).length}; reviewers ${(r.reviewersCreated ?? []).join(",")}; re-asks ${reasks}`);
}

// Applies only to a scenario this run actually recorded in production; an
// unrecorded scenario keeps branch()'s not-planned skip.
function correctionScoped(c, E, s) {
  if (E.t3?.corrects && scen(E, "production", s)) c.need(E.t3.corrects.stage === "production" && E.t3.corrects.scenarios.includes(s) && E.t3.corrects.ok === true, `${s} extra execution without production-origin correction provenance`);
}

function checkConversation(E) {
  const c = new Check("AC-CONVERSATION");
  retentionT3(E, c, false);
  const rec = scen(E, "production", "S1");
  correctionScoped(c, E, "S1");
  if (!branch(c, rec, "production S1")) return c;
  reconcileTruth(c, E, rec, "production S1", "conversation", "none");
  const r = rec.result;
  if (r?.status === "final") c.need(typeof r.canonical === "string" && r.canonical.length > 0, "production S1 final without a canonical proposal");
  c.need(!rec.artifact, "Conversation replacement touched an artifact");
  return c;
}

function checkRethink(E) {
  const c = new Check("AC-RETHINK");
  retentionT3(E, c, false);
  const reviewers = t3Actors(E, "production").filter((a) => a.role === "A" || a.role === "B");
  if (!reviewers.length) {
    c.need(!E.sc?.stages?.production?.entered || Object.values(E.sc.stages.production.scenarios).every((x) => x.status !== "executed"), "production executed without any reviewer");
    c.notes.push("no production reviewer created; first-review progression unobserved");
    return c;
  }
  const seen = new Set();
  for (const a of reviewers) {
    const k = `${a.scenario}/${a.owner}/${a.role}`;
    c.need(!seen.has(k), `${k}: reviewer replaced`);
    seen.add(k);
    // Base phases in submission order, one per expectation (re-ask/source keep the phase).
    const phases = [];
    let lastExp;
    for (const q of a.requests ?? []) {
      if (q.expectationId !== lastExp) phases.push(q.phase);
      else c.need(q.phase === phases.at(-1), `${a.key}: phase changed within ${q.expectationId}`);
      lastExp = q.expectationId;
    }
    const identity = new Set((a.ledger?.samples ?? []).map((x) => x.backendSessionId).filter(Boolean));
    c.need(identity.size <= 1, `${a.key}: backend session changed (${[...identity].join(",")})`);
    if (!phases.length) {
      c.notes.push(`${a.key}: no request submitted`);
      continue;
    }
    c.need(phases[0] === "initial", `${a.key}: first request phase ${phases[0]}`);
    const validInitial = (a.requests ?? []).some((q) => q.phase === "initial" && q.controllerRow === "candidate-valid" && q.classification?.variant === "review");
    if (phases.length > 1) {
      c.need(phases[1] === "rethink" && validInitial, `${a.key}: second phase ${phases[1]} without an admitted provisional initial review`);
      c.need(phases.slice(2).every((p) => p === "later"), `${a.key}: phases after rethink ${phases.slice(2).join(",")}`);
    } else c.notes.push(`${a.key}: stopped after initial (${(a.requests ?? []).at(-1)?.controllerRow}); first review incomplete`);
    // No provisional verdict admitted as final.
    const rec = a.scenario === "S3" ? E.sc.stages.production.scenarios.S3?.nested?.[a.owner] : scen(E, "production", a.scenario)?.result;
    const initialIds = new Set((a.requests ?? []).filter((q) => q.phase === "initial").map((q) => q.requestId));
    for (const round of rec?.rounds ?? []) for (const t of round.turns ?? []) c.need(!initialIds.has(t.requestId), `${a.key}: provisional initial ${t.requestId} admitted as a final verdict`);
    c.notes.push(`${a.key}: ${phases.join(">")}`);
  }
  c.notes.push("restored-context integrity after same-session restoration: unproved");
  return c;
}

function checkArtifact(E) {
  const c = new Check("AC-ARTIFACT");
  retentionT3(E, c, false);
  const pb = E.t3?.readonly?.protectedBefore ?? {};
  const pa = E.t3?.readonly?.protectedAfter ?? {};
  c.need(Object.keys(pb).length > 0 && Object.keys(pb).every((k) => pb[k] === pa[k]), "protected sources changed or unobserved");
  const rec = scen(E, "production", "S2");
  correctionScoped(c, E, "S2");
  if (!branch(c, rec, "production S2")) return c;
  reconcileTruth(c, E, rec, "production S2", "artifact", 1);
  const r = rec.result;
  const art = rec.artifact;
  if (!c.need(art && r, "production S2 without artifact evidence")) return c;
  c.need(typeof art.copyPath === "string" && !art.copyPath.startsWith(REPO) && art.copyPath.startsWith("/tmp/"), `S2 copy ${art.copyPath} is not an isolated private copy`);
  c.need(art.sourceSha256 === art.sourceSha256After && art.sourceSha256 === sha(art.originalText ?? ""), "S2 approved source changed or its original is not the copy's input");
  c.need(art.copyInitialSha256 === art.sourceSha256, "S2 copy not derived from the original input");
  const apps = (r.events ?? []).filter((e) => e.type === "application");
  c.need(r.applications <= 1 && apps.length === r.applications && art.writes.length === r.applications, `S2 applications ${r.applications}, events ${apps.length}, writes ${art.writes.length} (cap 1, controller-only)`);
  for (const w of art.writes) c.need(art.validations.some((v) => v.sha256 === w.sha256), `S2 write ${w.sha256} not validated`);
  // No closure mutation: nothing written after a closure-only round began.
  const evs = r.events ?? [];
  const closureIdx = evs.findIndex((e) => e.type === "outer-start" && e.closureOnly);
  if (closureIdx >= 0) {
    c.need(evs.every((e, i) => e.type !== "application" || i < closureIdx), "S2 application recorded during closure-only review");
    for (const w of art.writes) c.need(w.mono <= evs[closureIdx].at, "S2 artifact written during closure-only review");
  }
  const expectFinal = art.writes.length ? art.writes.at(-1).sha256 : art.copyInitialSha256;
  c.need(art.finalSha256 === expectFinal, `S2 terminal reread ${art.finalSha256} != last controller write ${expectFinal}`);
  if (r.status === "final" && art.finalText !== null) c.need(r.canonical === art.finalText, "S2 final canonical differs from the terminal artifact bytes");
  if (!apps.length) c.notes.push("S2 application/validation branch not entered naturally (mechanics proved in T2)");
  if (!(r.rounds ?? []).some((x) => x.closureOnly)) c.notes.push("S2 closure-only branch not entered naturally (mechanics proved in T2)");
  return c;
}

function checkRetrace(E) {
  const c = new Check("AC-RETRACE");
  retentionT3(E, c, false);
  const rec = scen(E, "production", "S3");
  correctionScoped(c, E, "S3");
  if (!branch(c, rec, "production S3")) return c;
  const R = rec.retrace;
  if (!c.need(R && R.status !== "rejected", `S3 retrace ${R?.status}`)) return c;
  c.need(R.peakActive <= MAX_SLOTS, `peak active ${R.peakActive} > ${MAX_SLOTS}`);
  const ev = R.events ?? [];
  const at = (type, scope) => ev.find((e) => e.type === type && e.scope === scope);
  const byId = Object.fromEntries(R.scopes.map((s) => [s.id, s]));
  // s2 starts only after admitted resolved/current s1, with its exact identity.
  const s1r = at("scope-result", "s1");
  const s2d = at("scope-dispatched", "s2");
  if (byId.s1?.state === "resolved") {
    c.need(s2d && s1r && ev.indexOf(s2d) > ev.indexOf(s1r), "s2 dispatched before s1's admitted result");
    c.need(JSON.stringify(s2d?.prerequisites) === JSON.stringify([{ scope: "s1", reportDigest: byId.s1.admitted.reportDigest }]), "s2 prerequisite identity differs from s1's admitted report");
    c.need(byId.s1.admitted.reportDigest === sha(rec.admittedReports?.s1?.report ?? ""), "s1 admitted report bytes do not match its identity");
  } else c.need(!s2d && byId.s2?.state === "blocked-dependency", "s2 ran without a resolved/current s1");
  c.need(!at("scope-dispatched", "s1")?.prerequisites?.length && !at("scope-dispatched", "s3")?.prerequisites?.length, "independent scope received prerequisites");
  // Observed s1/s3 overlap for a completed S3.
  const i1 = R.intervals?.s1;
  const i3 = R.intervals?.s3;
  const overlap = i1 && i3 && i1.start < i3.end && i3.start < i1.end;
  if (R.status === "complete") c.need(overlap, "completed S3 without observed s1/s3 evaluation overlap");
  else c.notes.push(`S3 ${R.status}: concurrency proof ${overlap ? "observed" : "not claimed"}`);
  // Scope-owned report-only review; child-before-parent disposal and slot release.
  for (const s of R.scopes) {
    const n = rec.nested?.[s.id];
    const rr = at("reconcile-result", s.id);
    const sd = at("scope-disposed", s.id);
    if (rr) {
      // Report-only review may replace the scope report: each application's
      // digest is the next outer base, and the last is the admitted report.
      const nev = n?.events ?? [];
      const apps = nev.filter((e) => e.type === "application");
      if (c.need(n && (n.applications ?? 0) === apps.length, `${s.id}: nested applications ${n?.applications} != application events ${apps.length}`) && apps.length) {
        for (const ap of apps) {
          const next = nev.slice(nev.indexOf(ap) + 1).find((e) => e.type === "outer-start");
          c.need(next && next.baseDigest === ap.digest, `${s.id}: application ${ap.digest} is not the next outer base`);
        }
        const last = apps.at(-1).digest;
        c.need(last === s.admitted?.reportDigest && last === sha(rec.admittedReports?.[s.id]?.report ?? ""), `${s.id}: last nested application ${last} is not the admitted report`);
      }
      c.need(Object.values(n?.disposal ?? {}).every(Boolean) && Object.keys(n?.disposal ?? {}).length === (n?.reviewersCreated ?? []).length, `${s.id}: nested reviewers not observed disposed`);
      c.need(sd && ev.indexOf(sd) > ev.indexOf(rr), `${s.id}: scope disposed before its nested review`);
      const nestedActors = t3Actors(E, "production").filter((a) => a.scenario === "S3" && a.owner === s.id && a.role !== "evaluator");
      const evaluator = t3Actors(E, "production").find((a) => a.scenario === "S3" && a.owner === s.id && a.role === "evaluator");
      for (const a of nestedActors) c.need((a.closedMono ?? Infinity) <= (evaluator?.closedMono ?? -Infinity), `${a.key} closed after its parent evaluator`);
      if (s.state === "resolved") c.need(n.reportDigest === s.admitted.reportDigest, `${s.id}: admitted report is not the nested final report`);
    }
    if (s.disposal !== undefined && s.disposal !== null) c.need(s.disposal === true || s.cleanupFrontier === true, `${s.id}: slot freed without observed disposal`);
    for (const a of t3Actors(E, "production").filter((x) => x.scenario === "S3" && x.owner === s.id)) c.need(argvProfileOk(a, PROD_PROFILE(a.role), E.t3.scripted), `${a.key}: S3 actor not on profile ${PROD_PROFILE(a.role)}`);
  }
  // Truthful aggregation.
  const resolved = R.scopes.filter((s) => s.state === "resolved").length;
  const expect = resolved === R.scopes.length && !R.scopes.some((s) => s.cleanupFrontier) ? "complete" : resolved > 0 ? "partial" : "blocked";
  c.need(R.status === expect, `aggregate ${R.status} != derived ${expect}`);
  c.notes.push(`S3 ${R.status}; ${R.scopes.map((s) => `${s.id} ${s.state}`).join(", ")}; overlap ${overlap ? `${Math.round(Math.min(i1.end, i3.end) - Math.max(i1.start, i3.start))} ms` : "none"}`);
  return c;
}

/** Independent duration inputs from retained production rows. */
function durationsOf(E) {
  const completed = [];
  const censored = [];
  let missing = 0;
  let n = 0;
  for (const a of t3Actors(E, "production")) {
    for (const q of a.requests ?? []) {
      n++;
      const cens = q.control?.ceiling === true || q.control?.cancelled === true || q.window?.complete !== true;
      if (typeof q.submitToTerminalMs !== "number") missing++;
      else if (cens || q.turnResult?.status !== "completed") censored.push(q.submitToTerminalMs);
      else completed.push(q.submitToTerminalMs);
    }
  }
  const max = completed.length ? Math.max(...completed) : null;
  return { requests: n, completed: completed.length, missingOrIncomplete: missing + censored.length, maxCompletedMs: max ?? "unavailable", twiceMaxMs: max === null ? "unavailable" : max * 2, thriceMaxMs: max === null ? "unavailable" : max * 3, maxCensoredMs: censored.length ? Math.max(...censored) : "unavailable" };
}

function checkDurations(E) {
  const c = new Check("AC-DURATIONS");
  retentionT3(E, c, false);
  for (const a of t3Actors(E)) {
    for (const q of a.requests ?? []) {
      c.need(typeof q.submittedAt === "string" && typeof q.submittedMono === "number", `${q.requestId}: no submit timestamp`);
      c.need(q.turnResult === null || typeof q.turnResult?.status === "string" || q.control?.ceiling === true, `${q.requestId}: no terminal status or censoring`);
      if (typeof q.submitToTerminalMs === "number") c.need(q.submitToTerminalMs >= 0 && (q.promptToTerminalMs === null || q.promptToTerminalMs === undefined || q.promptToTerminalMs <= q.submitToTerminalMs), `${q.requestId}: inconsistent durations`);
    }
  }
  const d = durationsOf(E);
  if (E.report) {
    const r = E.report.durations ?? {};
    for (const k of ["requests", "completed", "missingOrIncomplete", "maxCompletedMs", "twiceMaxMs", "thriceMaxMs", "maxCensoredMs"]) c.need(JSON.stringify(r[k]) === JSON.stringify(d[k]), `report durations.${k} ${JSON.stringify(r[k])} != derived ${JSON.stringify(d[k])}`);
  }
  if (d.completed === 0) c.notes.push("no completed production turn: duration values unavailable (not zero, no default)");
  // Accounting: cumulative, unknown never zero, no model work past a limit.
  const A = E.acc;
  if (!c.need(A, "no accounting")) return c;
  const worked = t3Actors(E).filter((a) => (a.requests ?? []).length);
  const allKnown = worked.every((a) => typeof a.cost === "number");
  if (!worked.length) c.need(A.cost?.amount === 0 && A.modelWork === false, "no model work but cost/modelWork not zero/false");
  else if (allKnown) c.need(Math.abs(A.cost?.amount - worked.reduce((s, a) => s + a.cost, 0)) < 1e-9, `cost ${A.cost?.amount} != per-actor sum`);
  else c.need(A.cost?.amount === "unknown", `cost ${JSON.stringify(A.cost)} with an actor lacking reported cost`);
  const rehWorked = worked.filter((a) => a.stage === "rehearsal");
  if (A.rehearsal) {
    c.need(A.rehearsal.wallMs <= A.wallMs, "rehearsal wall not inside the T3 wall");
    if (rehWorked.length && !rehWorked.every((a) => typeof a.cost === "number")) c.need(A.rehearsal.cost?.amount === "unknown", "rehearsal cost reported although an actor lacks reported cost");
  }
  c.need(typeof A.prior?.wallMs === "number", "prior T3 production-pool usage not recorded");
  const hit = A.limitReached?.production?.mono;
  if (typeof hit === "number") for (const a of worked) for (const q of a.requests) c.need(q.submittedMono < hit, `${q.requestId} submitted after the production limit`);
  const usd = (A.prior?.usdKnown ?? 0) + (typeof A.cost?.amount === "number" ? A.cost.amount : 0);
  if (usd > PRODUCTION.usd) c.notes.push(`reported cost overshoot: ${usd} > ${PRODUCTION.usd} (disclosed)`);
  c.notes.push(`production durations: completed ${d.completed}/${d.requests}; max ${d.maxCompletedMs}; 2x ${d.twiceMaxMs}; 3x ${d.thriceMaxMs}; censored max ${d.maxCensoredMs}`);
  return c;
}

function checkCleanupT3(E) {
  const c = new Check("AC-CLEANUP");
  retentionT3(E, c, false);
  const started = t3Actors(E).filter((a) => a.ensureInvokedAt);
  if (!started.length) {
    c.need(E.t3?.processesStarted === false || t3Actors(E).length === 0, "actors recorded without ensure evidence");
    c.notes.push("no process started: PID coverage not applicable");
  }
  for (const a of started) {
    const cl = a.close;
    if (!c.need(cl && !cl.skipped, `${a.key}: no close observation${cl?.reason ? ` (${cl.reason})` : ""}`)) continue;
    c.need(cl.closeResolved === true && cl.recordedClosed === true, `${a.key}: close unresolved or not recorded closed`);
    c.need(cl.pidCoverageNonEmpty === true && cl.pidResults?.length > 0 && cl.pidResults.every((r) => r.result === "ESRCH"), `${a.key}: PID coverage ${JSON.stringify(cl.pidResults?.map((r) => r.result))}`);
    c.need(typeof cl.closeDurationMs === "number", `${a.key}: no close timing`);
  }
  for (const [stage, st] of Object.entries(E.sc?.stages ?? {})) {
    const order = st.disposalOrder ?? [];
    const lastClose = Math.max(-Infinity, ...order.filter((x) => x.step.startsWith("close:")).map((x) => x.mono));
    const firstShutdown = Math.min(Infinity, ...order.filter((x) => x.step.startsWith("shutdown:")).map((x) => x.mono));
    c.need(lastClose <= firstShutdown, `${stage}: a handle closed after runtime shutdown`);
    for (const a of t3Actors(E, stage).filter((x) => x.ensureInvokedAt && x.close && !x.close.skipped)) c.need(order.some((x) => x.step === `close:${a.key}`), `${stage}: close of ${a.key} not in the disposal order`);
  }
  c.need(E.cleanup?.evidenceWrittenBeforeRemoval === true && E.cleanup?.privateRootRemovedAfterRetention === true, "private root not removed after retention");
  c.need(E.lexit ? E.lexit.privateRootPresentAfterChild === false : !E.report, "private root still present after the child");
  c.need(E.t3?.liveStoreCleanup?.complete === true && E.cleanup?.liveStoreComplete === true, `live-store cleanup incomplete: ${JSON.stringify(E.t3?.liveStoreCleanup)}`);
  // No native-session copies or raw journals retained.
  const text = fs.readFileSync(path.join(E.run, "scenarios.json"), "utf8");
  c.need(!/"type"\s*:\s*"(session_header|message_start|message_end)"/.test(text) && !text.includes(".jsonl\""), "native-session copy or raw journal retained");
  return c;
}

/** Final report consistency: independent recomputation, never the runner's booleans. */
async function checkReportT3(E) {
  const c = new Check("AC-REPORT");
  retentionT3(E, c, true);
  const R = E.report;
  if (!c.need(R, "no report.json")) return c;
  const results = {};
  for (const id of T3_CRITERIA) {
    const r = await CHECKS[id](E);
    results[id] = r.fails.length ? "FAIL" : "PASS";
    c.need(!r.fails.length, `${id} FAIL`);
  }
  // The historical report may differ only by FAIL->PASS on criteria named by
  // verifier-only fixes in this run's causes.json that bind the report's
  // verify.mjs identity to the current one; otherwise exact equality.
  const reported = R.implementation?.criteria ?? {};
  const differing = T3_CRITERIA.filter((id) => results[id] !== reported[id]);
  const recs = E.causeRecords;
  const fixes = recs.flatMap((x) => x.fixes ?? []);
  const currentVerify = sha(fs.readFileSync(path.join(BUNDLE, "verify.mjs")));
  const correction = differing.length > 0 && recs.length > 0 && recs.every((x) => x.status === "fixed-offline" && x.target?.file === "verify.mjs" && (x.fixes?.length ?? 0) >= 1) && fixes.every((f) => f.verifySha256Before === R.identities?.["verify.mjs"] && f.verifySha256After === currentVerify) && differing.every((id) => reported[id] === "FAIL" && results[id] === "PASS" && fixes.some((f) => f.affectedCriteria?.includes(id)));
  if (correction) c.notes.push(`verifier-only correction ${recs.map((x) => x.id).join(",")} accepted; report criteria differ FAIL->PASS only for ${differing.join(",")}`);
  else c.need(JSON.stringify(results) === JSON.stringify(reported), `report criteria ${JSON.stringify(reported)} != verified ${JSON.stringify(results)}`);
  c.need(entryOk(E), "entry evidence not permitted");
  const causes = E.causes;
  c.need(causes.every((x) => x.status === "fixed-offline"), "known unfixed trial-code cause");
  c.need((E.t3?.faults ?? []).length === 0, `trial-code faults: ${(E.t3?.faults ?? []).map((f) => `${f.stage} ${f.scenario}`).join(",")}`);
  // Capability outcome per production scenario, independently derived.
  const nativeNeg = new Set(["identity-changed", "failed-disposal", "fresh-session-fallback"]);
  const inconc = new Set(["window-unavailable", "delivery-uncertain", "turn-not-completed", "evidence-fault", "controller-stop", "scope-failure"]);
  for (const s of ["S1", "S2", "S3"]) {
    const rec = scen(E, "production", s);
    let want;
    if (!rec || rec.status === "not-run") want = "not-run";
    else if (rec.status !== "executed") want = "inconclusive";
    else {
      const stops = rec.retrace ? rec.retrace.scopes.filter((x) => x.stop).map((x) => x.stop.cause) : rec.result?.stop ? [rec.result.stop.cause] : [];
      want = stops.some((x) => nativeNeg.has(x)) ? "not-supported" : stops.some((x) => inconc.has(x)) ? "inconclusive" : "supported";
    }
    c.need(R.capability?.scenarios?.[s]?.result === want, `capability ${s} reported ${R.capability?.scenarios?.[s]?.result}, derived ${want}`);
  }
  const cleanupComplete = E.cleanup?.privateRootRemovedAfterRetention === true && E.cleanup?.liveStoreComplete === true;
  const rest = cleanupComplete && (E.t3?.faults ?? []).length === 0 && causes.every((x) => x.status === "fixed-offline") && E.t3?.authority?.ok === true;
  const complete = Object.values(results).every((v) => v === "PASS") && rest;
  // Under an accepted correction the report's false may stand only when its own criteria are the sole reason.
  const staleOnlyByCriteria = correction && R.evaluation_complete === false && complete === true && rest && !T3_CRITERIA.every((id) => reported[id] === "PASS");
  if (staleOnlyByCriteria) c.notes.push("report evaluation_complete=false stands only because of the corrected criteria");
  else c.need(R.evaluation_complete === complete, `report evaluation_complete ${R.evaluation_complete} != derived ${complete}`);
  c.need(R.production?.entered === (E.sc?.stages?.production?.entered === true), "report production.entered differs from evidence");
  c.need(JSON.stringify(R.stops) === JSON.stringify(E.t3?.stops), "report stops differ from evidence");
  c.need(Array.isArray(R.unproved) && R.unproved.some((u) => u.startsWith("restored-context integrity")), "unproved obligations not reported");
  if (E.t3?.scripted) c.notes.push("scripted fixture-agent execution: mechanics evidence only, never production evidence");
  c.notes.push(`derived evaluation_complete=${complete}; capability ${["S1", "S2", "S3"].map((s) => `${s} ${R.capability?.scenarios?.[s]?.result}`).join(", ")}`);
  return c;
}

const CHECKS = {
  "AC-REHEARSAL": checkRehearsal,
  "AC-CONVERSATION": checkConversation,
  "AC-RETHINK": checkRethink,
  "AC-ARTIFACT": checkArtifact,
  "AC-RETRACE": checkRetrace,
  "AC-DURATIONS": checkDurations,
  "AC-CLEANUP": checkCleanupT3,
  "AC-REPORT": checkReportT3,
  "AC-MAPPING": checkMapping,
  "AC-MECHANICS": checkMechanics,
  "AC-TRANSPORT": checkTransport,
  "AC-RESTORE": checkRestore,
  "AC-REQUESTS": checkRequests,
  "AC-DIAGNOSTICS": checkDiagnostics,
  "AC-DEBUGLOOP": checkDebugLoop,
  "AC-PRODUCTION-GATE": checkGate,
};

async function main() {
  const [runArg, id] = process.argv.slice(2);
  if (!runArg || !id) {
    console.error(`usage: verify.mjs RUN <${T2_IDS.join("|")}|T2|${T3_IDS.join("|")}|T3|ALL>`);
    process.exit(64);
  }
  const E = load(path.resolve(runArg));
  const own = E.task === "T3" ? T3_IDS : T2_IDS;
  const ids = id === "ALL" ? own : id === "T2" ? T2_IDS : id === "T3" ? T3_IDS : [id];
  const checks = [];
  for (const x of ids) {
    if (!CHECKS[x] || !own.includes(x)) {
      const c = new Check(x);
      c.fails.push(CHECKS[x] ? `${x} is not a ${E.task} criterion (run ${E.task === "T3" ? "has t3.json" : "has no t3.json"})` : `${x} is not a known criterion`);
      checks.push(c);
    } else checks.push(await CHECKS[x](E));
  }
  let ok = true;
  for (const c of checks) {
    for (const n of c.notes) console.log(`  note ${c.id}: ${n}`);
    for (const f of c.fails.slice(0, 40)) console.log(`  FAIL ${c.id}: ${f}`);
    if (c.fails.length > 40) console.log(`  FAIL ${c.id}: ... ${c.fails.length - 40} more`);
    console.log(c.fails.length ? `FAIL ${c.id}` : `PASS ${c.id}`);
    if (c.fails.length) ok = false;
  }
  if (ids.length > 1) console.log(ok ? `PASS ${id}` : `FAIL ${id}`);
  process.exit(ok ? 0 : 1);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
