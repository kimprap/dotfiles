#!/usr/bin/env node
// Independent T1 checker (spec acpx-omp-acp-trial/spec-v9).
//   node probe-verify.mjs RUN <AC-ENV|AC-READONLY|AC-PROBE|T1|T2|T3|ALL|<T2/T3 AC-ID>>
// Recomputes classifications from retained projected evidence with its own
// constants and rules; runner booleans are cross-checked, never trusted.
// T2/T3 criteria are checked here only on the approved upstream-blocked branch.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BUNDLE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(BUNDLE, "..", "..", "..");

// ---- independent constants (authority copies; not imported from runner code)
const SPEC = { rev: "acpx-omp-acp-trial/spec-v9", sha: "7fcc011e548813b085f5e38f9e7245f5ce300418d9eac59137797ac54982a748" };
const DECISIONS_REV = "acpx-omp-acp-trial-decisions/v7";
const OMP = { path: "/Users/kim/.local/bin/omp", version: "omp/18.3.0", bytes: 208460816, sha: "d61fb411f24146bed48dd901b13b5912a297d899ee691dda69c4b5b7ab8c35dc" };
const ACPX = { version: "0.19.2", integrity: "sha512-wLeY2T3vfa63/Oa6fsrbtCXAx6PhfdWvAvw+F6mv3gO/NYWTQf6MpGAWWvmO2JYq8YAhRJ+zt48/BWKz1JiMWg==" };
const SDK_VERSION = "1.4.0";
const LIVE_STORE = "/Users/kim/.omp/agent";
const TINY = { model: "xai-oauth/grok-4.7", thinking: "low" };
const TOOLS = "read,glob,grep,yield";
const NO_FLAGS = ["--no-extensions", "--no-skills", "--no-rules", "--no-lsp", "--no-title"];
const OVERLAY_REL = ".agents/artifacts/acpx-omp-acp-trial/config/omp-overlay.yml";
const ENV_ALLOWED = new Set(["PATH", "HOME", "TMPDIR", "PI_CODING_AGENT_DIR", "LANG", "LC_ALL", "LC_CTYPE", "SSL_CERT_FILE", "SSL_CERT_DIR", "NODE_EXTRA_CA_CERTS", "__CF_USER_TEXT_ENCODING"]);
const RECIPE = [
  { index: 1, handle: "normal", kind: "probe-canary", field: "sentence" },
  { index: 2, handle: "normal", kind: "probe-reuse", field: "token" },
  { index: 3, handle: "short", kind: "probe-short", field: "sentence" },
  { index: 4, handle: "short", kind: "probe-restore", field: "token" },
];
const TTL = { normal: 7_800_000, short: 1_000 };
const POST_CLOSE_BOUND_MS = 10_000;
const POOL = { usd: 2, wallMs: 20 * 60_000 };
const T1_FILES = new Set(["launch.json", "probe.json", "cleanup.json", "accounting.json", "report.json", "report.md", "launcher-exit.json"]);
const T2_IDS = ["AC-MAPPING", "AC-MECHANICS", "AC-TRANSPORT", "AC-RESTORE", "AC-REQUESTS", "AC-DIAGNOSTICS", "AC-DEBUGLOOP", "AC-PRODUCTION-GATE"];
const T3_IDS = ["AC-REHEARSAL", "AC-CONVERSATION", "AC-RETHINK", "AC-ARTIFACT", "AC-RETRACE", "AC-DURATIONS", "AC-CLEANUP", "AC-REPORT"];
const SECRET_PATTERNS = [/\bsk-[A-Za-z0-9_-]{16,}/, /Bearer\s+[A-Za-z0-9._-]{16,}/, /"(access|refresh|id)_token"\s*:/i, /api[_-]?key"\s*:\s*"/i, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];

// ---- helpers
const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const shaFile = (f) => sha(fs.readFileSync(f));
const readJ = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
function canonical(v) {
  if (Array.isArray(v)) return v.map(canonical);
  if (isObj(v)) return Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonical(v[k])]));
  return v;
}
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

class Check {
  constructor(id) {
    this.id = id;
    this.fails = [];
    this.notes = [];
  }
  req(cond, msg) {
    if (!cond) this.fails.push(msg);
    return !!cond;
  }
  note(msg) {
    this.notes.push(msg);
  }
}

// ---- independent A1 re-classification over retained projected events
const normKind = (v) => (typeof v === "string" ? v.trim().toLowerCase().replace(/[\s_]+/g, "-") : undefined);
function validData(kind, field, d) {
  if (!isObj(d) || d.dataType !== "object") return false;
  return normKind(d.kind) === kind && typeof d[field] === "string" && d[field].trim() !== "";
}
function reclassify(events, requestId, control, kind, field) {
  const out = { windowComplete: false, foreign: [], invocations: new Map(), first: null, turn: null, rpc: { initialize: 0, sessionNew: 0, sessionLoad: 0, resume: [] } };
  let open = false;
  for (const e of events) {
    if (e.requestId !== requestId) {
      out.foreign.push(e.requestId);
      continue;
    }
    if (e.type === "turn_started") {
      open = true;
      continue;
    }
    if (!open) continue;
    if (e.type === "turn_result") {
      out.windowComplete = true;
      out.turn = e.result;
      break;
    }
    const m = e.message ?? {};
    if (m.method === "initialize") out.rpc.initialize++;
    if (m.method === "session/new") out.rpc.sessionNew++;
    if (m.method === "session/load") out.rpc.sessionLoad++;
    if (m.method === "session/resume") out.rpc.resume.push({ id: m.id, sessionId: m.sessionId, ok: undefined });
    if (m.rpc === "response") for (const r of out.rpc.resume) if (r.id === m.id && r.ok === undefined) r.ok = !m.error;
    const t = m.update?.tool;
    if (!t?.toolCallId) continue;
    let inv = out.invocations.get(t.toolCallId);
    if (!inv) out.invocations.set(t.toolCallId, (inv = { kind: undefined, input: undefined, started: false, terminal: undefined }));
    if (m.update.kind === "tool_call") inv.started = true;
    inv.kind ??= t.acpKind;
    inv.input ??= t.input;
    if ((t.status === "completed" || t.status === "failed") && !inv.terminal) {
      inv.terminal = t.status;
      const sig = inv.kind === "other" && inv.input && inv.input.undeclaredKeyCount === 0 && inv.input.declaredYieldKeys.every((k) => ["type", "data", "error"].includes(k));
      const admissible = sig && t.status === "completed" && t.output?.detailsStatus === "success" && t.output?.hasData === true && !inv.input.typeIsArray && !inv.input.useLastTurn;
      if (admissible && !out.first) out.first = { toolCallId: t.toolCallId, cursor: e.cursor, data: m.update.candidateData };
    }
  }
  const isSig = (inv) => inv.kind === "other" && inv.input && inv.input.undeclaredKeyCount === 0 && inv.input.declaredYieldKeys.every((k) => ["type", "data", "error"].includes(k));
  let row;
  if (!out.windowComplete) row = "window-unavailable";
  else if (out.first) row = validData(kind, field, out.first.data) ? "candidate-valid" : "candidate-invalid";
  else if (control?.cancelled || control?.ceiling || control?.revoked) row = "controller-stop";
  else if ([...out.invocations.values()].some((i) => isSig(i) && !i.terminal)) row = "delivery-uncertain";
  else if (out.turn?.status !== "completed") row = "turn-not-completed";
  else row = "completed-no-result";
  out.row = row;
  out.c4 = row === "candidate-invalid" || row === "completed-no-result";
  out.tools = [...out.invocations.entries()].map(([id, i]) => ({ id, kind: i.kind ?? "unknown", allowed: ["read", "search"].includes(i.kind) || isSig(i), started: i.started, terminal: i.terminal ?? "unfinished" }));
  return out;
}

// ---- retained-evidence safety (A7 closed schema + secret scan)
const EVENT_KEYS = new Set(["cursor", "type", "requestId", "message", "result"]);
const MSG_KEYS = new Set(["rpc", "method", "id", "sessionId", "update", "permissionToolCallId", "error", "stopReason", "newSessionId", "resumeAdvertised"]);
const UPDATE_KEYS = new Set(["kind", "tool", "usage", "candidateData"]);
const TOOL_KEYS = new Set(["toolCallId", "status", "acpKind", "input", "output"]);
const INPUT_KEYS = new Set(["keyCount", "declaredYieldKeys", "undeclaredKeyCount", "typeIsArray", "useLastTurn", "hasData", "path", "nonObject"]);
const OUTPUT_KEYS = new Set(["detailsStatus", "hasData"]);
const CAND_KEYS = new Set(["dataType", "kind", "sentence", "token", "kindType", "sentenceType", "tokenType", "extraKeyCount"]);
const RESULT_KEYS = new Set(["status", "stopReason", "errorCode", "errorDetailCode", "retryable"]);
function closedSchemaViolations(e) {
  const bad = [];
  const chk = (obj, allowed, where) => {
    if (!isObj(obj)) return;
    for (const k of Object.keys(obj)) if (!allowed.has(k)) bad.push(`${where}.${k}`);
  };
  chk(e, EVENT_KEYS, "event");
  chk(e.message, MSG_KEYS, "message");
  chk(e.message?.update, UPDATE_KEYS, "update");
  chk(e.message?.update?.tool, TOOL_KEYS, "tool");
  chk(e.message?.update?.tool?.input, INPUT_KEYS, "input");
  chk(e.message?.update?.tool?.output, OUTPUT_KEYS, "output");
  chk(e.message?.update?.candidateData, CAND_KEYS, "candidate");
  chk(e.result, RESULT_KEYS, "result");
  return bad;
}

// ---- load T1 run
function loadT1(run) {
  const f = (n) => path.join(run, n);
  const r = { run, files: fs.readdirSync(run).sort() };
  for (const n of ["report.json", "probe.json", "cleanup.json", "accounting.json", "launch.json", "launcher-exit.json"]) {
    r[n.replace(".json", "").replace("-", "_")] = fs.existsSync(f(n)) ? readJ(f(n)) : undefined;
  }
  return r;
}

function commonSafety(c, t1) {
  c.req(t1.probe && t1.report && t1.cleanup && t1.accounting && t1.launch && t1.launcher_exit, "missing required retained T1 evidence file");
  for (const n of t1.files) c.req(T1_FILES.has(n), `unexpected retained file ${n} (possible native copy/raw journal)`);
  for (const n of t1.files) {
    const text = fs.readFileSync(path.join(t1.run, n), "utf8");
    for (const p of SECRET_PATTERNS) c.req(!p.test(text), `secret-like pattern ${p} in ${n}`);
  }
  for (const h of Object.values(t1.probe?.handles ?? {})) {
    for (const rq of h.requests ?? []) {
      for (const e of rq.window?.events ?? []) {
        const bad = closedSchemaViolations(e);
        c.req(bad.length === 0, `A7 closed-schema violation in ${rq.requestId}: ${bad.join(",")}`);
      }
    }
  }
}

const liveRunFolder = (runId) => path.join(LIVE_STORE, "sessions", `acpx-trial-${runId}`);
const liveCwdFolder = (privRoot) => path.join(LIVE_STORE, "sessions", `--${path.join(fs.realpathSync("/tmp"), path.relative("/tmp", privRoot), "cwd").slice(1).replace(/\//g, "-")}--`);

function expectedArgv(sessionsDir) {
  return [OMP.path, "acp", "--model", TINY.model, "--thinking", TINY.thinking, "--tools", TOOLS, ...NO_FLAGS, "--config", path.join(REPO, OVERLAY_REL), "--session-dir", sessionsDir];
}

// ---------------------------------------------------------------- AC-ENV
function checkEnv(t1) {
  const c = new Check("AC-ENV");
  commonSafety(c, t1);
  const p = t1.probe;
  const rep = t1.report;
  if (!p || !rep) return c;
  const pins = p.s0.pins;
  const exactPins =
    pins.omp?.bytes === OMP.bytes && pins.omp?.sha256 === OMP.sha && pins.omp?.version === OMP.version && pins.omp?.path === OMP.path &&
    pins.acpx?.installed === ACPX.version && pins.acpx?.locked === ACPX.version && pins.acpx?.lockedIntegrity === ACPX.integrity &&
    pins.sdk?.installed === SDK_VERSION && pins.sdk?.locks?.length === 1 && pins.sdk.locks[0].version === SDK_VERSION;
  const nodeParts = String(pins.node?.version ?? "0").split(".").map(Number);
  const nodeOk = nodeParts[0] > 22 || (nodeParts[0] === 22 && (nodeParts[1] > 13 || (nodeParts[1] === 13 && nodeParts[2] >= 0)));
  c.req(pins.ok === (exactPins && nodeOk), "runner pin verdict disagrees with independent pin comparison");
  const specOk = p.authority.specSha256 === SPEC.sha && rep.bindings.spec_revision === SPEC.rev && rep.bindings.decisions_revision === DECISIONS_REV;
  c.req(specOk || !p.authority.ok, "authority recorded ok but spec/decision binding differs");
  // current lock state still matches the recorded pins
  const lock = readJ(path.join(BUNDLE, "package-lock.json"));
  c.req(lock.packages["node_modules/acpx"]?.integrity === ACPX.integrity && lock.packages["node_modules/acpx"]?.version === ACPX.version, "current lock acpx pin drifted");
  // environment / isolation
  const env = p.s0.env;
  for (const k of env.keys) c.req(ENV_ALLOWED.has(k), `launch environment carries non-allowed variable ${k}`);
  const priv = p.s0.privateRoot;
  c.req(priv.path.startsWith("/tmp/") && priv.mode === "700" && priv.outsideBundle === true, "private root not owner-only under /tmp outside bundle");
  c.req(env.HOME === path.join(priv.path, "home") && env.TMPDIR === path.join(priv.path, "tmp"), "HOME/TMPDIR not private");
  c.req(env.PI_CODING_AGENT_DIR === LIVE_STORE, "live store not selected via PI_CODING_AGENT_DIR");
  c.req(p.s0.liveStore.path === LIVE_STORE && typeof p.s0.liveStore.isDirectory === "boolean", "live-store metadata observation missing");
  c.req(!JSON.stringify(p.s0.liveStore).match(/auth|token|credential/i), "live-store observation exposes content");
  c.req(typeof p.s0.liveConfig.configSha256 === "string" && typeof p.s0.liveConfig.lifecyclePlugin?.sha256 === "string", "live config provenance missing");
  c.note(`modelRoles provenance only: ${JSON.stringify(p.s0.liveConfig.modelRoles)}`);
  const s0ok = exactPins && nodeOk && p.authority.ok;
  if (!s0ok) {
    // Evidenced negative preflight branch: stop before any launch, readiness false.
    c.req(p.processesStarted === false, "preflight stop but native processes were started");
    c.req(Object.values(p.handles ?? {}).every((h) => !h.ensureInvokedAt), "ensureSession invoked after preflight stop");
    c.req(p.stops.some((s) => /^(pin-drift|stale-authority)/.test(s)), "negative branch lacks its evidenced stop cause");
    c.req(rep.capability.overall !== "supported" && rep.t2_entry_permitted === false && rep.production_allowed === false, "negative branch claims readiness");
    c.note(`negative preflight branch: ${p.stops.join("; ")}`);
    return c;
  }
  if (p.mode === "preflight") {
    c.req(p.processesStarted === false, "preflight mode started processes");
    c.req(rep.t2_entry_permitted === false, "preflight-only run permits T2");
    return c;
  }
  // Launched branch: exact registry argv and actually observed OS argv for every instance.
  // spec-v9 launch section (2026-09-25): direct child of the live sessions/ folder.
  const want = expectedArgv(liveRunFolder(p.runId));
  c.req(same(p.s0.registryArgv, want), `registry argv differs from explicit trial pins: ${JSON.stringify(p.s0.registryArgv)}`);
  const launched = Object.values(p.handles).flatMap((h) => [...(h.creationLaunchArgv ?? []), ...(h.requests ?? []).map((r) => r.launchArgv)]).filter(Boolean);
  const wantCmd = want.join(" ");
  const observed = launched.filter((l) => typeof l.command === "string");
  c.req(observed.length > 0, "no actual launched argv observed");
  for (const l of observed) c.req(l.command === wantCmd, `launched argv differs (profile drift): ${l.command}`);
  const byPid = new Map(observed.map((l) => [l.pid, l.command]));
  c.note(`observed launched instances: ${byPid.size}`);
  // Authentication: live store usable iff at least one turn completed.
  const completed = Object.values(p.handles).flatMap((h) => h.requests ?? []).filter((r) => r.turnResult?.status === "completed").length;
  if (completed === 0) c.req(rep.capability.launch !== "supported", "launch claimed supported without any completed turn (authentication unproved)");
  else c.note(`authentication evidenced by ${completed} completed turn(s) via PI_CODING_AGENT_DIR`);
  const launchSupported = observed.length > 0 && observed.every((l) => l.command === wantCmd) && RECIPE.some((x) => p.expectations[x.index - 1]?.outcome === "delivered");
  c.req((rep.capability.launch === "supported") === launchSupported, `launch verdict ${rep.capability.launch} disagrees with independent ${launchSupported}`);
  return c;
}

// ---------------------------------------------------------------- AC-READONLY
function checkReadonly(t1) {
  const c = new Check("AC-READONLY");
  commonSafety(c, t1);
  const p = t1.probe;
  const rep = t1.report;
  if (!p || !rep) return c;
  const ro = p.readonly;
  const list = readJ(path.join(BUNDLE, "config", "protected-sources.json")).files;
  c.req(list.every((f) => typeof ro.protectedBefore[f] === "string" && ro.protectedBefore[f] !== "missing"), "protected-source before-hash missing");
  c.req(list.every((f) => ro.protectedBefore[f] === ro.protectedAfter[f]), "protected sources changed during run");
  const nowChanged = list.filter((f) => fs.existsSync(path.join(REPO, f)) && shaFile(path.join(REPO, f)) !== ro.protectedAfter[f]);
  if (nowChanged.length) c.note(`protected sources changed after the run (outside run scope): ${nowChanged.join(", ")}`);
  c.req(rep.limits.some((l) => /not a sandbox/.test(l)), "report does not disclose detect-after/not-sandbox limit");
  if (!p.processesStarted) {
    c.req(ro.canaryPath === undefined || ro.canaryBefore === "absent", "canary pre-state wrong");
    c.note("no native process started; tool observations not applicable; protected sources unchanged");
    return c;
  }
  const argv = p.s0.registryArgv;
  const ti = argv.indexOf("--tools");
  c.req(ti > 0 && argv[ti + 1] === TOOLS, "launch tool restriction not exact");
  for (const f of NO_FLAGS) c.req(argv.includes(f), `launch lacks ${f}`);
  c.req(ro.canaryBefore === "absent", "canary not absent before");
  c.req(ro.canaryAfter === "absent" || ro.canaryAfter === "present", "canary after observation missing");
  let violations = 0;
  let disallowedAttempts = 0;
  const kindsSeen = new Set();
  for (const [name, h] of Object.entries(p.handles)) {
    for (const rq of h.requests ?? []) {
      const step = RECIPE[rq.expectation - 1];
      const re = reclassify(rq.window.events, rq.requestId, rq.control, step.kind, step.field);
      const mine = re.tools.map((t) => ({ id: t.id, kind: t.kind, allowed: t.allowed, terminal: t.terminal }));
      const theirs = (rq.toolFacts ?? []).map((t) => ({ id: t.toolCallId, kind: t.acpKind, allowed: t.allowedByPolicy, terminal: t.terminalStatus }));
      c.req(same(mine, theirs), `${name}/${rq.requestId}: runner tool facts disagree with retained window`);
      for (const t of re.tools) {
        kindsSeen.add(`${t.kind}:${t.terminal}`);
        if (!t.allowed) {
          disallowedAttempts++;
          if (t.terminal === "completed") violations++;
        }
      }
    }
  }
  c.note(`tool facts (kind:terminal): ${[...kindsSeen].sort().join(", ") || "none"}; disallowed attempts ${disallowedAttempts}; completed disallowed ${violations}`);
  const expected = violations > 0 || ro.canaryAfter === "present" ? "not-supported" : ro.canaryAfter === "absent" && list.every((f) => ro.protectedBefore[f] === ro.protectedAfter[f]) ? "supported" : "inconclusive";
  c.req(rep.capability.tool_policy.startsWith(expected), `tool_policy ${rep.capability.tool_policy} disagrees with independent ${expected}`);
  return c;
}

// ---------------------------------------------------------------- AC-PROBE
function checkProbe(t1, { selfTest = true } = {}) {
  const c = new Check("AC-PROBE");
  commonSafety(c, t1);
  const p = t1.probe;
  const rep = t1.report;
  if (!p || !rep) return c;
  c.req(!p.fault, `trial code/runtime fault recorded: ${JSON.stringify(p.fault)}`);
  c.req(rep.production_allowed === false, "production gate open");
  c.req(p.mode === "probe", "run is not a probe execution");
  c.req(t1.launcher_exit?.childExitCode === 0, "probe child did not exit cleanly");
  c.req(t1.launcher_exit?.privateRootPresentAfterChild === false && t1.cleanup?.privateRootRemovedAfterRetention === true, "private root not removed");
  c.req(t1.cleanup?.evidenceWrittenBeforeRemoval === true, "retention-before-removal not recorded");
  if (p?.processesStarted) {
    // Live-store session folders: removed after ESRCH, by recorded ID only.
    const live = p.liveStoreCleanup;
    const ids = Object.values(p.handles).map((h) => h.identity?.backendSessionId).filter(Boolean);
    c.req(live?.complete === true, `live-store session folder cleanup incomplete: ${JSON.stringify(live?.skipped ?? live?.kept ?? null)}`);
    c.req((live?.deleted ?? []).every((n) => ids.some((id) => n.endsWith(`_${id}.jsonl`) || n.endsWith(`_${id}`) || (n.startsWith(".") && n.endsWith(`_${id}.jsonl.lock.os`)))), "live-store deletion outside recorded session IDs");
    c.req(!fs.existsSync(liveRunFolder(p.runId)), "live-store acpx-trial run folder still exists");
    c.req(!fs.existsSync(liveCwdFolder(p.s0.privateRoot.path)), "live-store cwd-named folder for this run still exists");
  }
  const privHome = p?.s0?.env?.HOME;
  if (privHome) {
    c.req(!fs.existsSync(p.s0.privateRoot.path), "private root still exists");
    c.req(!fs.existsSync(path.join("/tmp", `acpx-${sha(privHome).slice(0, 10)}`)), "acpx queue-socket dir derived from private HOME still exists");
  }
  const acc = t1.accounting;
  c.req(acc?.pool === "probe-soak" && (typeof acc.cost?.amount === "number" || acc.cost?.amount === "unknown"), "accounting missing or cost not number/unknown");
  if (acc?.modelWork && acc.cost?.amount === 0 && !/no model work/.test(acc.cost.basis)) c.fails.push("model work recorded with zero cost");
  const s0ok = p.authority.ok && p.s0.pins.ok;

  if (!s0ok || !p.processesStarted) {
    c.req(!s0ok || p.stops.length > 0, "no launch without evidenced stop");
    c.req(p.expectations.length === 0 || p.expectations.every((e) => e.submissions === 0), "submissions recorded on a no-launch branch");
    c.req(rep.capability.overall !== "supported" && rep.t2_entry_permitted === false, "no-launch branch claims support");
    c.req(rep.evaluation_complete === true && rep.cleanup.status === "complete", "early-negative branch not completed");
    c.req(/no ensureSession\/startTurn/.test(p.processesStartedEvidence ?? ""), "no positive evidence that no actor process started");
  } else {
    probeLaunched(c, p, rep, acc);
  }
  if (selfTest) selfTests(c);
  return c;
}

function probeLaunched(c, p, rep, acc) {
  c.req(same(Object.keys(p.handles).sort(), ["normal", "short"]), "not exactly two handles");
  for (const [n, h] of Object.entries(p.handles)) c.req(h.ttlMs === TTL[n], `${n} TTL ${h.ttlMs} != ${TTL[n]}`);
  c.req(p.expectations.length === 4 && p.expectations.every((e, i) => e.index === RECIPE[i].index && e.handle === RECIPE[i].handle && e.kind === RECIPE[i].kind), "expectation recipe not exact");
  const allReqs = Object.values(p.handles).flatMap((h) => h.requests ?? []);
  c.req(allReqs.length <= 16, "more than 16 submissions");
  c.req(new Set(allReqs.map((r) => r.requestId)).size === allReqs.length, "request submitted twice (duplicate requestId)");
  // Recompute every request row and expectation outcome.
  let stopped = false;
  const recomputedOutcome = [];
  for (const [i, exp] of p.expectations.entries()) {
    const step = RECIPE[i];
    const reqs = allReqs.filter((r) => r.expectation === step.index).sort((a, b) => a.attempt - b.attempt);
    c.req(reqs.length === exp.submissions && reqs.every((r) => p.handles[step.handle].requests.includes(r)), `expectation ${step.index}: submission bookkeeping`);
    if (stopped) {
      c.req(reqs.length === 0, `expectation ${step.index} ran after a decisive stop`);
      recomputedOutcome.push("not-run");
      continue;
    }
    c.req(reqs.length <= 4, `expectation ${step.index}: more than three re-asks`);
    let outcome = "stopped";
    let invalid = 0;
    for (const [k, r] of reqs.entries()) {
      const re = reclassify(r.window.events, r.requestId, r.control, step.kind, step.field);
      c.req(re.row === r.classification.row, `${r.requestId}: runner row ${r.classification.row} != independent ${re.row}`);
      c.req(re.foreign.length === 0, `${r.requestId}: foreign traffic retained inside owner window`);
      const ev = r.window.events;
      if (re.row !== "window-unavailable") c.req(ev[0]?.type === "turn_started" && ev.at(-1)?.type === "turn_result", `${r.requestId}: window not bounded by its own markers`);
      if (re.row === "candidate-valid") {
        outcome = "delivered";
        c.req(k === reqs.length - 1, `${r.requestId}: submission after a valid result`);
        c.req(same(exp.admitted?.data, re.first.data) && exp.admitted.toolCallId === re.first.toolCallId, `${r.requestId}: admitted result is not the first window candidate`);
      } else if (re.c4) {
        invalid++;
        if (k === reqs.length - 1) outcome = invalid > 3 ? "stopped-four-invalid-returns" : "stopped";
      } else {
        c.req(k === reqs.length - 1, `${r.requestId}: re-ask after non-C4 row ${re.row}`);
        outcome = `stopped-${re.row}`;
      }
    }
    if (reqs.length === 0) outcome = "stopped";
    recomputedOutcome.push(outcome);
    if (outcome !== "delivered") stopped = true;
    if (outcome === "delivered" || outcome.startsWith("stopped-")) c.req(exp.outcome === outcome || (outcome === "stopped" && /^(stopped|censored)/.test(exp.outcome)), `expectation ${step.index}: outcome ${exp.outcome} != independent ${outcome}`);
    c.req(exp.invalidReturns === invalid, `expectation ${step.index}: invalid-return count`);
    c.req(exp.firstTryValid === (outcome === "delivered" && reqs.length === 1), `expectation ${step.index}: first-try flag`);
    const repExp = rep.expectations[i];
    c.req(repExp.firstTryValid === exp.firstTryValid && repExp.submissions === reqs.length && repExp.reasksUsed === Math.max(0, reqs.length - 1), `expectation ${step.index}: report counts`);
  }
  const delivered = recomputedOutcome.filter((o) => o === "delivered").length;
  c.note(`expectations: ${recomputedOutcome.join(", ")}; first-try ${p.expectations.filter((e) => e.firstTryValid).length}/4; submissions ${allReqs.length}`);

  // PID sampling and coverage.
  const pidsOf = (h) => new Set(h.ledger.samples.filter((s) => Number.isInteger(s.pid) && s.pid > 0).map((s) => s.pid));
  for (const [n, h] of Object.entries(p.handles)) {
    const fromSamples = pidsOf(h);
    const ledgerPids = new Set(h.ledger.pids.map((x) => x.pid));
    c.req(same([...fromSamples].sort(), [...ledgerPids].sort()), `${n}: ledger PID set differs from sampled PIDs`);
    if (h.ensureInvokedAt) c.req(h.ledger.samples.some((s) => s.point === "during-ensure" && Number.isInteger(s.pid)), `${n}: ensure-time creation instance has no public PID coverage`);
    for (const r of h.requests ?? []) {
      const ps = h.ledger.samples.find((s) => s.point === `prompt-started:${r.requestId}`);
      const js = h.ledger.samples.find((s) => s.point === `journal-settled:${r.requestId}`);
      if (r.classification.row !== "window-unavailable") c.req(Number.isInteger(ps?.pid) && Number.isInteger(js?.pid), `${n}/${r.requestId}: no public PID coverage during/at settlement`);
    }
  }
  const cov = new Set(Object.values(p.handles).flatMap((h) => h.ledger.samples.filter((s) => Number.isInteger(s.pid)).map((s) => s.point.split(":")[0])));
  c.note(`public PID coverage points: ${[...cov].sort().join(", ")}`);

  // Reuse (independent).
  let reuse = "not-run";
  const e1 = allReqs.filter((r) => r.expectation === 1).at(-1);
  const e2 = allReqs.find((r) => r.expectation === 2 && r.attempt === 1);
  if (e1 && e2) {
    const n = p.handles.normal.ledger.samples;
    const pid1 = n.find((s) => s.point === `journal-settled:${e1.requestId}`)?.pid;
    const pid2 = n.find((s) => s.point === `prompt-started:${e2.requestId}`)?.pid;
    const re2 = reclassify(e2.window.events, e2.requestId, e2.control, "probe-reuse", "token");
    const noReconnect = re2.rpc.initialize === 0 && re2.rpc.sessionNew === 0 && re2.rpc.resume.length === 0;
    reuse = recomputedOutcome[1] === "delivered" && Number.isInteger(pid1) && pid1 === pid2 && noReconnect ? "supported" : "inconclusive";
    c.note(`reuse: pid ${pid1}->${pid2}, reconnect-free ${noReconnect}, token recall ${p.expectations[1].admitted?.data?.token === p.tokens?.e1}`);
  }
  c.req(rep.capability.reuse === reuse, `reuse verdict ${rep.capability.reuse} != independent ${reuse}`);

  // Same-ID restore (independent).
  let restore = "not-run";
  const e4 = allReqs.find((r) => r.expectation === 4 && r.attempt === 1);
  const rejected = Object.values(p.handles).some((h) => (h.requests ?? []).some((r) => {
    const rr = reclassify(r.window.events, r.requestId, r.control, "probe-rpc", "token");
    return rr.rpc.resume.some((x) => x.sessionId === h.identity?.backendSessionId && x.ok === false) && r.turnResult?.errorDetailCode === "SESSION_RESUME_REQUIRED";
  }));
  if (rejected) {
    restore = "not-supported";
    c.note("restore: agent rejected a same-ID session/resume (SESSION_RESUME_REQUIRED)");
  } else if (e4 && p.idleExpiry) {
    const s = p.handles.short;
    const bsid = s.identity.backendSessionId;
    const prePid = p.idleExpiry.preIdlePid;
    const esrch = s.ledger.pids.find((x) => x.pid === prePid)?.observations.some((o) => o.point === "idle-expiry" && o.result === "ESRCH");
    const re4 = reclassify(e4.window.events, e4.requestId, e4.control, "probe-restore", "token");
    const resumed = re4.rpc.resume.some((r) => r.sessionId === bsid && r.ok === true);
    const fresh = re4.rpc.sessionNew > 0 || re4.rpc.sessionLoad > 0;
    const newPid = s.ledger.samples.find((x) => x.point === `prompt-started:${e4.requestId}`)?.pid;
    const identityStable = s.ledger.samples.filter((x) => x.backendSessionId).every((x) => x.backendSessionId === bsid);
    c.req(identityStable, "short handle backendSessionId changed");
    restore = !esrch ? "inconclusive" : fresh ? "not-supported" : resumed && Number.isInteger(newPid) && newPid !== prePid && recomputedOutcome[3] === "delivered" ? "supported" : "inconclusive";
    c.note(`restore: idle ESRCH ${!!esrch}, same-ID resume ${resumed}, fresh ${fresh}, pid ${prePid}->${newPid}, token recall ${p.expectations[3].admitted?.data?.token === p.tokens?.e3} (continuation evidence only)`);
  }
  c.req(rep.capability.restore.split(" ")[0] === restore, `restore verdict ${rep.capability.restore} != independent ${restore}`);
  const identityNormal = p.handles.normal.ledger.samples.filter((x) => x.backendSessionId).every((x) => x.backendSessionId === p.handles.normal.identity?.backendSessionId);
  c.req(identityNormal, "normal handle backendSessionId changed");

  // Disposal (A4) — every recorded PID must reach ESRCH; close + recorded-closed separately.
  let disposalOk = true;
  for (const [n, h] of Object.entries(p.handles)) {
    if (!h.ensureInvokedAt) continue;
    const cl = h.close;
    if (!cl || cl.skipped) {
      disposalOk = false;
      c.fails.push(`${n}: owned handle without observed close`);
      continue;
    }
    if (!cl.closeResolved || !cl.recordedClosed) disposalOk = false;
    c.req(cl.closeResolved === true, `${n}: close did not resolve`);
    c.req(cl.recordedClosed === true, `${n}: status did not confirm recorded closure`);
    if (h.ledger.pids.length === 0) disposalOk = false;
    c.req(h.ledger.pids.length > 0, `${n}: empty PID set is not exit proof`);
    for (const x of h.ledger.pids) {
      const esr = x.observations.find((o) => o.result === "ESRCH");
      if (!esr) disposalOk = false;
      c.req(!!esr, `${n}: PID ${x.pid} never observed ESRCH`);
      const post = cl.pidResults.find((r) => r.pid === x.pid);
      if (post && !post.earlier) c.req(post.observedMsAfterReturn <= POST_CLOSE_BOUND_MS + 1_000, `${n}: PID ${x.pid} exit observed beyond the 10 s bound`);
    }
  }
  const order = p.disposalOrder ?? [];
  const lastClose = Math.max(...order.map((x, i) => (x.startsWith("close:") ? i : -1)));
  const firstShutdown = order.findIndex((x) => x.startsWith("shutdown:"));
  c.req(firstShutdown === -1 || lastClose < firstShutdown, "shutdown preceded a close");
  c.req(rep.cleanup.status === "complete", `cleanup ${rep.cleanup.status}`);
  // Known process instances without public PID coverage leave exit unproved.
  const uncovered = Object.values(p.handles).some((h) => h.ensureInvokedAt && (!h.ledger.samples.some((s) => s.point === "during-ensure" && Number.isInteger(s.pid)) || (h.requests ?? []).some((r) => (r.window.rpc.initialize > 0 || !r.window.complete) && !h.ledger.samples.some((s) => (s.point === `prompt-started:${r.requestId}` || s.point === `journal-settled:${r.requestId}`) && Number.isInteger(s.pid)))));
  const closesOk = Object.values(p.handles).every((h) => !h.ensureInvokedAt || (h.close && !h.close.skipped && h.close.closeResolved && h.close.recordedClosed && h.close.pidResults.every((r) => r.result === "ESRCH")));
  const disposal = !closesOk ? "not-supported-or-unproved" : uncovered ? "unproved" : disposalOk ? "supported" : "not-supported-or-unproved";
  c.req(rep.capability.disposal.split(" ")[0] === disposal, `disposal verdict ${rep.capability.disposal} != independent ${disposal}`);

  // Journal result and overall.
  const journal = delivered === 4 ? "supported" : recomputedOutcome.some((o) => o === "stopped-delivery-uncertain") ? "not-supported" : "inconclusive";
  c.req(rep.capability.journal_result.split(" ")[0] === journal, `journal_result ${rep.capability.journal_result} != independent ${journal}`);
  const subs = Object.entries(rep.capability).filter(([k]) => k !== "overall").map(([, v]) => v);
  const overall = subs.every((v) => v.startsWith("supported")) ? "supported" : subs.some((v) => v.startsWith("not-supported") && !v.startsWith("not-supported-or")) ? "not-supported" : "inconclusive";
  c.req(rep.capability.overall === overall, `overall ${rep.capability.overall} != independent ${overall}`);
  c.req(rep.t2_entry_permitted === (overall === "supported" && rep.cleanup.status === "complete"), "T2 entry flag inconsistent");
  c.req(rep.evaluation_complete === (rep.cleanup.status === "complete"), "evaluation_complete inconsistent with cleanup");
  // Pool.
  const priorWall = acc.priorWallMs ?? 0;
  c.req(priorWall + acc.wallMs <= POOL.wallMs + 60_000 || p.stops.some((s) => /wall-ceiling/.test(s)), "wall pool exceeded without a ceiling stop");
  if (typeof acc.cost.amount === "number") c.req(acc.cost.amount + (acc.priorCostKnownUsd ?? 0) <= POOL.usd || p.stops.some((s) => /cost-ceiling/.test(s)), "cost pool exceeded without stop");
  c.note(`capability: ${JSON.stringify(rep.capability)}; wall ${acc.wallMs} ms; cost ${JSON.stringify(acc.cost)}; tokens ${acc.tokens}`);
}

// ---- offline self-tests: A7 fixture, A1 window fixture, runnable early-negative path
async function importRunner(rel) {
  return import(path.join(BUNDLE, rel));
}
let selfTestResult;
function selfTests(c) {
  selfTestResult ??= runSelfTests();
  for (const f of selfTestResult.fails) c.fails.push(`self-test: ${f}`);
  for (const n of selfTestResult.notes) c.note(`self-test: ${n}`);
}
function runSelfTests() {
  // Run in a child so module loading stays out of this process's classification.
  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--self-test"], { encoding: "utf8", timeout: 180_000, cwd: BUNDLE });
  try {
    return JSON.parse(r.stdout.trim().split("\n").at(-1));
  } catch {
    return { fails: [`self-test crashed: ${r.stderr.slice(0, 400)}`], notes: [] };
  }
}
async function selfTestMain() {
  const fails = [];
  const notes = [];
  const { exportEvent } = await importRunner("lib/evidence/export.mjs");
  const raw = readJ(path.join(BUNDLE, "fixtures/native/a7-raw-events.json"));
  const exp = readJ(path.join(BUNDLE, "fixtures/native/a7-expected.json"));
  const got = raw.events.map(exportEvent);
  if (JSON.stringify(got).includes(raw.canary)) fails.push("A7 canary reached export");
  got.forEach((g, i) => same(g, exp.events[i]) || fails.push(`A7 event ${exp.events[i].cursor} differs: ${JSON.stringify(g)}`));
  notes.push(`A7 fixture: ${got.length} events compared`);
  const { RequestWindow } = await importRunner("lib/native/window.mjs");
  const cases = readJ(path.join(BUNDLE, "fixtures/native/window-cases.json")).cases;
  const field = { "probe-canary": "sentence", "probe-reuse": "token", "probe-short": "sentence", "probe-restore": "token" };
  for (const cs of cases) {
    const evs = buildEvents(cs.ops);
    const w = new RequestWindow({ requestId: "R", knownRequestIds: new Set() });
    for (const e of evs) w.accept(e);
    const res = w.close({ cancelled: false, ceiling: false, revoked: false, ...cs.control }, cs.kind);
    if (res.row !== cs.expect.row || res.c4 !== cs.expect.c4) fails.push(`window '${cs.name}': runner ${res.row}/${res.c4}`);
    if (cs.expect.duplicateCursorCount !== undefined && w.duplicateCursorCount !== cs.expect.duplicateCursorCount) fails.push(`window '${cs.name}': duplicates ${w.duplicateCursorCount}`);
    if (cs.expect.unknownRequestIds && !same(res.unknownRequestIds, cs.expect.unknownRequestIds)) fails.push(`window '${cs.name}': unknown ids`);
    const dedup = evs.filter((e, i) => evs.findIndex((x) => x.cursor === e.cursor) === i);
    const ind = reclassify(dedup, "R", cs.control, cs.kind, field[cs.kind]);
    if (ind.row !== cs.expect.row) fails.push(`window '${cs.name}': independent ${ind.row}`);
  }
  notes.push(`A1 window fixture: ${cases.length} cases`);
  // Runnable early-negative path: drifted approval -> preflight stop -> T2 not-run -> T3 not-run, all independently checked.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "acpx-t1-neg-"));
  try {
    const run1 = runProbe(["probe", "--approval", path.join(BUNDLE, "fixtures/native/approval-drift.json"), "--runs-root", tmp]);
    if (!run1) fails.push("early-negative probe printed no RUN");
    else {
      const t1 = loadT1(run1);
      for (const ck of [checkEnv(t1), checkReadonly(t1), checkProbe(t1, { selfTest: false })]) for (const f of ck.fails) fails.push(`early-negative ${ck.id}: ${f}`);
      if (t1.report?.capability?.overall === "supported") fails.push("early-negative run claims support");
      const run2 = runProbe(["not-run", "--task", "T2", "--approval", path.join(BUNDLE, "config/approval.json"), "--upstream", run1, "--runs-root", tmp]);
      const run3 = run2 && runProbe(["not-run", "--task", "T3", "--approval", path.join(BUNDLE, "config/approval.json"), "--upstream", run2, "--runs-root", tmp]);
      if (!run2 || !run3) fails.push("not-run chain printed no RUN");
      else {
        for (const id of [...T2_IDS, "T2"]) for (const f of checkNotRun(run2, id).fails) fails.push(`not-run T2 ${id}: ${f}`);
        for (const id of [...T3_IDS, "T3", "ALL"]) for (const f of checkNotRun(run3, id).fails) fails.push(`not-run T3 ${id}: ${f}`);
        notes.push("early-negative preflight -> T2 not-run -> T3 not-run chain checked");
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  process.stdout.write(`${JSON.stringify({ fails, notes })}\n`);
}
function runProbe(args) {
  const r = spawnSync(process.execPath, [path.join(BUNDLE, "probe.mjs"), ...args], { encoding: "utf8", timeout: 120_000, cwd: BUNDLE });
  return /^RUN=(.+)$/m.exec(r.stdout)?.[1];
}
function buildEvents(ops) {
  const out = [];
  let n = 0;
  const invs = {};
  for (const o of ops) {
    const cur = () => `k${++n}`;
    const msg = (update) => ({ rpc: "notification", method: "session/update", update });
    if (o.op === "start") out.push({ cursor: cur(), type: "turn_started", requestId: "R" });
    else if (o.op === "end") out.push({ cursor: cur(), type: "turn_result", requestId: "R", result: { status: o.status } });
    else if (o.op === "null") out.push({ cursor: cur(), type: "message", requestId: null, message: msg({ kind: "agent_message_chunk" }) });
    else if (o.op === "foreign") out.push({ cursor: cur(), type: "message", requestId: o.rid, message: msg({ kind: "agent_message_chunk" }) });
    else if (o.op === "dup") out.push(structuredClone(out.at(-1)));
    else if (o.op === "tool") {
      const keys = o.input ? Object.keys(o.input) : o.keys ?? ["data"];
      const yk = keys.filter((k) => ["type", "data", "error"].includes(k)).sort();
      const input = { keyCount: keys.length, declaredYieldKeys: yk, undeclaredKeyCount: keys.length - yk.length };
      if (o.typeIsArray) input.typeIsArray = true;
      if (keys.includes("data")) input.hasData = true;
      if (o.input?.path) input.path = o.input.path;
      invs[o.id] = true;
      out.push({ cursor: cur(), type: "message", requestId: "R", message: msg({ kind: "tool_call", tool: { toolCallId: o.id, status: "in_progress", acpKind: o.kind, input } }) });
    } else if (o.op === "upd") {
      const output = { detailsStatus: o.detailsStatus };
      if (o.data !== undefined) output.hasData = true;
      const update = { kind: "tool_call_update", tool: { toolCallId: o.id, status: o.status, output } };
      if (o.data !== undefined) {
        const d = { dataType: "object", extraKeyCount: 0 };
        for (const [k, v] of Object.entries(o.data)) if (["kind", "sentence", "token"].includes(k)) d[k] = v;
        update.candidateData = d;
      }
      out.push({ cursor: cur(), type: "message", requestId: "R", message: msg(update) });
    }
  }
  return out;
}

// ---------------------------------------------------------------- not-run branch (T2/T3)
function checkNotRun(run, id) {
  const c = new Check(id);
  const rep = readJ(path.join(run, "report.json"));
  const task = T2_IDS.includes(id) || id === "T2" ? "T2" : "T3";
  if (id !== "ALL") c.req(rep.task === task, `run is ${rep.task}, not ${task}`);
  c.req(rep.schema === "acpx-omp-acp-trial.notrun-report.v1" && rep.branch === "upstream-blocked-not-run", "not an approved upstream-blocked record");
  c.req(rep.implementation_entered === false && rep.model_work === false && rep.native_processes_started === false && rep.production_allowed === false, "not-run record claims work or permission");
  c.req(rep.authority?.specSha256 === SPEC.sha && rep.authority?.ok === true, "not-run authority binding");
  const ids = rep.task === "T2" ? T2_IDS : T3_IDS;
  const wanted = id === "ALL" || id === rep.task ? ids : [id];
  for (const x of wanted) c.req(rep.criteria?.[x]?.status === "not-run", `${x} is not an explicit not-run`);
  c.req(fs.existsSync(path.join(rep.upstream.path, "report.json")) && shaFile(path.join(rep.upstream.path, "report.json")) === rep.upstream.report_sha256, "upstream report binding stale or missing");
  const up = readJ(path.join(rep.upstream.path, "report.json"));
  if (rep.task === "T2") {
    c.req(up.task === "T1" && up.evaluation_complete === true && up.capability?.overall !== "supported" && up.cleanup?.status === "complete", "upstream T1 is not a completed negative/inconclusive result");
    const t1 = loadT1(rep.upstream.path);
    for (const ck of [checkEnv(t1), checkReadonly(t1), checkProbe(t1, { selfTest: false })]) for (const f of ck.fails) c.fails.push(`upstream T1 ${ck.id}: ${f}`);
  } else {
    for (const x of T2_IDS) for (const f of checkNotRun(rep.upstream.path, x).fails) c.fails.push(`upstream T2 ${x}: ${f}`);
    if (wanted.includes("AC-DURATIONS")) c.req(isObj(rep.durations) && rep.durations.completed_max_ms === "unavailable" && rep.durations.x2 === "unavailable" && rep.durations.x3 === "unavailable", "durations not explicitly unavailable");
    if (wanted.includes("AC-REPORT")) {
      c.req(rep.evaluation_complete === true, "final not-run evaluation not complete");
      c.req(fs.existsSync(path.join(run, "report.md")), "rendered report missing");
    }
  }
  return c;
}

// ---------------------------------------------------------------- main
async function main() {
  if (process.argv[2] === "--self-test") return selfTestMain();
  const [runArg, id] = process.argv.slice(2);
  if (!runArg || !id) {
    console.error("usage: probe-verify.mjs RUN <AC-ENV|AC-READONLY|AC-PROBE|T1|T2|T3|ALL|AC-ID>");
    process.exit(64);
  }
  const run = path.resolve(runArg);
  const rep = readJ(path.join(run, "report.json"));
  let checks;
  if (rep.task === "T1") {
    const t1 = loadT1(run);
    const map = { "AC-ENV": () => [checkEnv(t1)], "AC-READONLY": () => [checkReadonly(t1)], "AC-PROBE": () => [checkProbe(t1)] };
    if (map[id]) checks = map[id]();
    else if (id === "T1" || id === "ALL") checks = [checkEnv(t1), checkReadonly(t1), checkProbe(t1)];
    else {
      const c = new Check(id);
      c.fails.push(`${id} is not checkable on a T1 run`);
      checks = [c];
    }
  } else checks = [checkNotRun(run, id)];
  let ok = true;
  for (const c of checks) {
    for (const n of c.notes) console.log(`  note ${c.id}: ${n}`);
    for (const f of c.fails) console.log(`  FAIL ${c.id}: ${f}`);
    if (c.fails.length) ok = false;
  }
  console.log(ok ? `PASS ${id}` : `FAIL ${id}`);
  process.exit(ok ? 0 : 1);
}
await main();
