#!/usr/bin/env node
// T1 native probe (spec acpx-omp-acp-trial/spec-v9).
//   node probe.mjs preflight --approval APPROVAL
//   node probe.mjs probe     --approval APPROVAL
//   node probe.mjs not-run   --task T2|T3 --approval APPROVAL --upstream UPSTREAM_RUN [--runs-root DIR]
// Every command prints exactly one absolute RUN=... locator and no credentials.
import { spawn } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hashProtected, listRuns, readJson, readJsonIfExists, exists, sha256File, sha256Text, writeJson } from "./lib/evidence/io.mjs";
import { renderNotRunMarkdown, renderT1Markdown } from "./lib/evidence/report.mjs";
import { AGENT_ID, PidLedger, clock, closeAndObserve, createTrialRuntime, ensureWithSampling, runRequest, sampleStatus, waitStatusPidCleared } from "./lib/native/adapter.mjs";
import { exampleFor, VARIANTS } from "./lib/native/domain.mjs";
import { cleanupLiveSessionFolders, createPrivateRoot, observeLiveConfig, observeLiveStore, observePins, removePrivateRoot, sanitizedEnv } from "./lib/native/env.mjs";
import { AUTHORITY, BUNDLE_DIR, PROBE, PROBE_SOAK_POOL, PROFILES, REPO_ROOT, RUNTIME, buildAgentArgv, sessionDirFor } from "./lib/native/pins.mjs";

const SELF = fileURLToPath(import.meta.url);
const T2T3_CRITERIA = {
  T2: ["AC-MAPPING", "AC-MECHANICS", "AC-TRANSPORT", "AC-RESTORE", "AC-REQUESTS", "AC-DIAGNOSTICS", "AC-DEBUGLOOP", "AC-PRODUCTION-GATE"],
  T3: ["AC-REHEARSAL", "AC-CONVERSATION", "AC-RETHINK", "AC-ARTIFACT", "AC-RETRACE", "AC-DURATIONS", "AC-CLEANUP", "AC-REPORT"],
};

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const opts = {};
  for (let i = 0; i < rest.length; i++) {
    const k = rest[i];
    if (!k.startsWith("--")) throw new Error(`unexpected argument ${k}`);
    opts[k.slice(2)] = rest[++i];
  }
  return { command, opts };
}

const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

async function sourceIdentities() {
  const files = ["probe.mjs", "probe-verify.mjs", "package.json", "package-lock.json", "prompts/native-probe.md"];
  for (const dir of ["lib/native", "lib/evidence", "config"]) {
    for (const n of (await fs.readdir(path.join(BUNDLE_DIR, dir))).sort()) files.push(`${dir}/${n}`);
  }
  const out = {};
  for (const f of files) out[f] = (await exists(path.join(BUNDLE_DIR, f))) ? await sha256File(path.join(BUNDLE_DIR, f)) : "missing";
  return out;
}

/** Authority/approval binding; stale authority stops before any process launch. */
async function checkAuthority(approvalPath) {
  const out = { approvalPath: path.resolve(approvalPath), problems: [] };
  const approvalText = await fs.readFile(approvalPath, "utf8");
  out.approvalSha256 = sha256Text(approvalText);
  const approval = JSON.parse(approvalText);
  out.specSha256 = await sha256File(path.join(REPO_ROOT, AUTHORITY.spec.path));
  const decisionsText = await fs.readFile(path.join(REPO_ROOT, AUTHORITY.decisions.path), "utf8");
  out.decisionsRevisionPresent = decisionsText.includes(AUTHORITY.decisions.revision);
  out.planSha256 = await sha256File(path.join(REPO_ROOT, AUTHORITY.plan.path)).catch(() => "unavailable");
  if (out.specSha256 !== AUTHORITY.spec.sha256) out.problems.push("spec sha256 differs from bound spec-v9");
  if (approval.authority?.spec?.sha256 !== AUTHORITY.spec.sha256 || approval.authority?.spec?.revision !== AUTHORITY.spec.revision) out.problems.push("approval binds a different spec");
  if (approval.authority?.decisions?.revision !== AUTHORITY.decisions.revision || !out.decisionsRevisionPresent) out.problems.push("decisions revision mismatch");
  for (const [name, pin] of Object.entries(PROFILES)) {
    const a = approval.launch_pins?.[name];
    if (!a || a.model !== pin.model || a.thinking !== pin.thinking) out.problems.push(`approval launch pin ${name} differs from code pins`);
  }
  if (approval.fallback_model !== null) out.problems.push("approval declares a fallback model");
  if (approval.execution_approval?.approved_proposals?.post_close_pid_observation_seconds !== PROBE.postCloseObserveMs / 1000) out.problems.push("post-close observation bound not approved as coded");
  out.ok = out.problems.length === 0;
  return out;
}

async function priorPoolUsage(runsRoot) {
  let wallMs = 0;
  const costs = [];
  for (const prefix of ["t1-", "t2-"]) {
    for (const run of await listRuns(runsRoot, prefix)) {
      const acc = await readJsonIfExists(path.join(run, "accounting.json"));
      // Executions that started native/model work, and native reproductions
      // explicitly charged to the pool (countsTowardWall), consume it.
      if (acc?.pool === "probe-soak" && (acc.modelWork !== false || acc.countsTowardWall === true)) {
        wallMs += acc.wallMs ?? 0;
        costs.push(acc.cost);
      }
    }
  }
  const known = costs.filter((c) => typeof c?.amount === "number");
  return { wallMs, costKnownUsd: known.reduce((s, c) => s + c.amount, 0), costUnknownRuns: costs.length - known.length };
}

/**
 * Corrected-execution eligibility (spec-v9 "Per fix" and CLI contract): the
 * cause/fix record lives in the discovering run's evidence; flags never grant
 * eligibility. Without --corrects, a second native probe is refused.
 */
async function correctionGate(opts, runsRoot, runId) {
  const out = { problems: [] };
  const priorNative = [];
  for (const run of await listRuns(runsRoot, "t1-probe-")) {
    if (path.basename(run) === runId) continue;
    const p = await readJsonIfExists(path.join(run, "probe.json"));
    if (p?.processesStarted) priorNative.push({ run, correction: p.correction });
  }
  if (!opts.corrects) {
    out.initial = true;
    if (priorNative.length) out.problems.push(`a native T1 probe already ran (${priorNative.map((x) => path.basename(x.run)).join(", ")}); a corrected execution needs --corrects/--cause`);
    out.ok = out.problems.length === 0;
    return out;
  }
  out.corrects = path.basename(opts.corrects);
  out.cause = opts.cause;
  const prior = await readJsonIfExists(path.join(opts.corrects, "probe.json"));
  const priorCleanup = await readJsonIfExists(path.join(opts.corrects, "cleanup.json"));
  const priorReport = await readJsonIfExists(path.join(opts.corrects, "report.json"));
  const rec = prior?.postRun?.causes?.find((c) => c.id === opts.cause);
  if (!prior?.processesStarted) out.problems.push("prior run is not a native T1 probe execution");
  if (!rec) out.problems.push(`cause ${opts.cause} not recorded in the prior run's evidence`);
  else {
    if (rec.owner !== "T1") out.problems.push("cause owner is not T1");
    if (rec.status !== "fixed-offline") out.problems.push(`cause status ${rec.status}`);
    const red = await readJsonIfExists(path.join(runsRoot, rec.reproducer?.red ?? "-", "repro.json"));
    const green = await readJsonIfExists(path.join(runsRoot, rec.reproducer?.green ?? "-", "repro.json"));
    if (red?.verdict !== "FAIL" || green?.verdict !== "PASS" || !(red.startedAt < green.startedAt)) out.problems.push("reproducer red-before/green-after not evidenced");
    const pinsSha = await sha256File(path.join(BUNDLE_DIR, "lib", "native", "pins.mjs"));
    if (rec.fix?.pinsSha256 !== pinsSha) out.problems.push("applied correction differs from the recorded fix (pins.mjs changed)");
    if (!rec.checks1 || !Object.values(rec.checks1).every((v) => /^(PASS|MECHANICS PASS|\{"fails":\[\])/.test(v))) out.problems.push("T1 full existing check set not recorded as passing");
    const used = priorNative.filter((x) => x.correction?.corrects === out.corrects && x.correction?.cause === opts.cause).length;
    if (used >= (rec.authorizedCorrectedExecutions ?? 0)) out.problems.push(`authorized corrected executions for ${opts.cause} already used (${used})`);
  }
  const priorClosed = priorReport?.cleanup?.status === "complete" || /^closed/.test(priorCleanup?.userDecisionClosure?.status ?? "");
  if (!priorClosed) out.problems.push("prior execution's disposal is not closed (A4)");
  out.ok = out.problems.length === 0;
  return out;
}

// ---------------------------------------------------------------- launcher

async function launch(command, opts) {
  if (!opts.approval) throw new Error("--approval is required");
  if (command === "not-run") return notRun(opts);
  const runsRoot = opts["runs-root"] ? path.resolve(opts["runs-root"]) : path.join(BUNDLE_DIR, "runs");
  const runId = `t1-${command}-${stamp()}-${randomBytes(3).toString("hex")}`;
  const runDir = path.join(runsRoot, runId);
  await fs.mkdir(runDir, { recursive: true });
  const dirs = await createPrivateRoot("t1");
  const env = sanitizedEnv(dirs);
  await writeJson(path.join(runDir, "launch.json"), {
    runId,
    command,
    launcherPid: process.pid,
    privateRoot: dirs.root,
    childEnvKeys: Object.keys(env).sort(),
    childEnvFixed: { PATH: env.PATH, HOME: env.HOME, TMPDIR: env.TMPDIR, PI_CODING_AGENT_DIR: env.PI_CODING_AGENT_DIR },
    parentEnvKeyCount: Object.keys(process.env).length,
  });
  const code = await new Promise((resolve) => {
    const correction = opts.corrects ? ["--corrects", path.resolve(opts.corrects), "--cause", String(opts.cause)] : [];
    const child = spawn(process.execPath, [SELF, "__execute", command, "--run", runDir, "--runs-root", runsRoot, "--root", dirs.root, "--approval", path.resolve(opts.approval), ...correction], {
      env,
      cwd: BUNDLE_DIR,
      stdio: ["ignore", "inherit", "inherit"],
    });
    child.on("exit", (c, s) => resolve(c ?? (s ? 128 : 1)));
  });
  // The child owns retention-before-removal; the launcher only confirms the outcome.
  const rootLeft = await exists(dirs.root);
  // A crashed child cannot have retained-then-removed; the launcher records that
  // fact and removes the private root so no private state outlives the run.
  const launcherRemoval = rootLeft ? await removePrivateRoot(dirs) : undefined;
  await writeJson(path.join(runDir, "launcher-exit.json"), { childExitCode: code, privateRootPresentAfterChild: rootLeft, launcherRemovedPrivateRoot: launcherRemoval?.removed, at: new Date().toISOString() });
  process.stdout.write(`RUN=${runDir}\n`);
  return code;
}

// ---------------------------------------------------------------- execution

function loadPrompts(text) {
  const out = {};
  for (const m of text.matchAll(/<!-- prompt:(\w+) -->\n([\s\S]*?)<!-- \/prompt -->/g)) out[m[1]] = m[2].trim();
  return out;
}
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k]);

async function execute(mode, opts) {
  const runDir = opts.run;
  const dirs = { root: opts.root, home: path.join(opts.root, "home"), tmp: path.join(opts.root, "tmp"), sessions: path.join(opts.root, "sessions"), cwd: path.join(opts.root, "cwd") };
  const runId = path.basename(runDir);
  const startedAt = clock.iso();
  const startMono = clock.mono();
  const stops = [];
  const ev = { schema: "acpx-omp-acp-trial.t1.v1", runId, mode, task: "T1", startedAt, handles: {}, expectations: [] };

  ev.authority = await checkAuthority(opts.approval);
  ev.sources = await sourceIdentities();
  const protectedList = (await readJson(path.join(BUNDLE_DIR, "config", "protected-sources.json"))).files;
  ev.readonly = { protectedBefore: await hashProtected(REPO_ROOT, protectedList) };
  const privMode = (await fs.stat(dirs.root)).mode & 0o777;
  const realCwd = await fs.realpath(dirs.cwd);
  ev.s0 = {
    env: { keys: Object.keys(process.env).sort(), HOME: process.env.HOME, TMPDIR: process.env.TMPDIR, PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR, PATH: process.env.PATH },
    privateRoot: { path: dirs.root, mode: privMode.toString(8), outsideBundle: !dirs.root.startsWith(BUNDLE_DIR) },
    liveStore: await observeLiveStore(),
    pins: await observePins(process.env),
    liveConfig: await observeLiveConfig(process.env),
    expectedLaunch: { profile: "tiny", ...PROFILES.tiny },
  };
  const prior = await priorPoolUsage(opts["runs-root"]);
  ev.pool = { name: "probe-soak", limitUsd: PROBE_SOAK_POOL.usd, limitWallMs: PROBE_SOAK_POOL.wallMs, prior };

  let proceed = true;
  if (mode === "probe") {
    ev.correction = await correctionGate(opts, opts["runs-root"], runId);
    if (!ev.correction.ok) {
      stops.push(`correction-ineligible: ${ev.correction.problems.join("; ")}`);
      proceed = false;
    }
  }
  if (!ev.authority.ok) {
    stops.push(`stale-authority: ${ev.authority.problems.join("; ")}`);
    proceed = false;
  }
  if (!ev.s0.pins.ok) {
    stops.push("pin-drift: exact toolchain pin mismatch; stopped before model launch without substitution");
    proceed = false;
  }
  if (ev.s0.liveStore.isDirectory !== true) {
    stops.push("live-store-unavailable");
    proceed = false;
  }
  if (privMode !== 0o700) {
    stops.push("unsafe-isolation: private root is not owner-only");
    proceed = false;
  }
  const remainingWall = PROBE_SOAK_POOL.wallMs - prior.wallMs;
  if (prior.costKnownUsd >= PROBE_SOAK_POOL.usd || remainingWall <= 0) {
    stops.push("pool-exhausted: probe/soak pool has no remaining allowance");
    proceed = false;
  }
  ev.processesStarted = false;

  if (mode === "probe" && proceed) {
    await probeBody(ev, dirs, stops, startMono + remainingWall);
  } else if (mode === "probe") {
    ev.processesStartedEvidence = "no ensureSession/startTurn call was made: preflight stop preceded every native launch";
  } else {
    ev.processesStartedEvidence = "preflight mode makes no ensureSession/startTurn call";
  }

  // Live-store session folders (spec-v9 launch section): only after every
  // published PID showed ESRCH; never reads file contents.
  if (ev.processesStarted) {
    const closes = Object.values(ev.handles).filter((h) => h.ensureInvokedAt).map((h) => h.close);
    const published = closes.every((cl) => cl && !cl.skipped && cl.pidResults.length > 0);
    const allEsrch = published && closes.every((cl) => cl.pidResults.every((r) => r.result === "ESRCH"));
    const sessionIds = Object.values(ev.handles).map((h) => h.identity?.backendSessionId).filter(Boolean);
    ev.liveStoreCleanup = allEsrch
      ? await cleanupLiveSessionFolders({ sessionDir: ev.s0.sessionDir, sessionIds, realCwd })
      : { skipped: published ? "a published PID did not reach ESRCH; live-store folders retained" : "no published PID set for every owned handle; live-store folders retained", sessionDir: ev.s0.sessionDir, sessionIds, complete: false };
  }

  ev.readonly.protectedAfter = await hashProtected(REPO_ROOT, protectedList);
  ev.readonly.protectedUnchanged = protectedList.every((f) => ev.readonly.protectedBefore[f] === ev.readonly.protectedAfter[f]);
  if (!ev.readonly.protectedUnchanged) stops.push("protected-source-drift");

  // Retention before removal: write the complete safe evidence first.
  ev.finishedModelWorkAt = clock.iso();
  ev.stops = stops;
  await writeJson(path.join(runDir, "probe.json"), ev);
  const removal = await removePrivateRoot(dirs);
  const wallMs = clock.mono() - startMono;
  const cleanupFacts = { privateRootRemovedAfterRetention: removal.removed, acpxSocketDirExisted: removal.socketDirExisted, removedAt: clock.iso(), evidenceWrittenBeforeRemoval: true };
  await writeJson(path.join(runDir, "cleanup.json"), cleanupFacts);
  const cost = costOf(ev);
  await writeJson(path.join(runDir, "accounting.json"), {
    pool: "probe-soak",
    task: "T1",
    startedAt,
    endedAt: clock.iso(),
    wallMs,
    modelWork: ev.processesStarted,
    cost,
    tokens: tokensOf(ev),
    priorWallMs: prior.wallMs,
    priorCostKnownUsd: prior.costKnownUsd,
    note: "OAuth cost may be absent or delayed; unknown is never reported as zero. Monetary hard cap cannot be guaranteed.",
  });
  const report = buildReport(ev, cleanupFacts, { wallMs, cost, priorWallMs: prior.wallMs });
  await writeJson(path.join(runDir, "report.json"), report);
  await fs.writeFile(path.join(runDir, "report.md"), renderT1Markdown(report));
  return 0;
}

function costOf(ev) {
  let amount = 0;
  let known = false;
  let currency = null;
  for (const h of Object.values(ev.handles)) {
    const samples = h.ledger?.samples ?? [];
    const last = [...samples].reverse().find((s) => s.usage && s.usage.costAmount !== null);
    if (last) {
      amount += last.usage.costAmount;
      known = true;
      currency = last.usage.costCurrency;
    }
  }
  if (!ev.processesStarted) return { amount: 0, currency: "USD", basis: "no model work started" };
  return known ? { amount, currency, basis: "public status cumulative session cost (reported)" } : { amount: "unknown", basis: "no reported cost in public status" };
}

function tokensOf(ev) {
  let total = 0;
  let known = false;
  for (const h of Object.values(ev.handles)) {
    const last = [...(h.ledger?.samples ?? [])].reverse().find((s) => s.usage && s.usage.totalTokens !== null);
    if (last) {
      total += last.usage.totalTokens;
      known = true;
    }
  }
  return known ? total : "unknown";
}

async function probeBody(ev, dirs, stops, deadlineMono) {
  const prompts = loadPrompts(await fs.readFile(path.join(BUNDLE_DIR, "prompts", "native-probe.md"), "utf8"));
  const canaryPath = path.join(dirs.cwd, "probe-canary.txt");
  ev.readonly.canaryPath = canaryPath;
  ev.readonly.canaryBefore = (await exists(canaryPath)) ? "present" : "absent";
  ev.s0.sessionDir = sessionDirFor(ev.runId, dirs);
  const argv = buildAgentArgv("tiny", ev.s0.sessionDir);
  ev.s0.registryArgv = argv;
  ev.s0.agentId = AGENT_ID;
  const tokens = { e1: `TOKEN-${randomUUID().slice(0, 8).toUpperCase()}`, e3: `TOKEN-${randomUUID().slice(0, 8).toUpperCase()}` };
  ev.tokens = tokens;
  const runtimes = {
    normal: createTrialRuntime({ cwd: dirs.cwd, argv, ttlMs: RUNTIME.normalTtlMs }),
    short: createTrialRuntime({ cwd: dirs.cwd, argv, ttlMs: RUNTIME.shortTtlMs }),
  };
  const handles = {};
  const state = {};
  let halted = false;
  const halt = (why) => {
    stops.push(why);
    halted = true;
  };

  for (const name of ["normal", "short"]) {
    const ledger = new PidLedger();
    const h = { sessionKey: `t1-${name}`, ttlMs: name === "normal" ? RUNTIME.normalTtlMs : RUNTIME.shortTtlMs, ledger, requests: [] };
    ev.handles[name] = h;
    if (halted) continue;
    ev.processesStarted = true;
    h.ensureInvokedAt = clock.iso();
    try {
      const ensured = await ensureWithSampling(runtimes[name], { sessionKey: h.sessionKey, agent: AGENT_ID, mode: "persistent", cwd: dirs.cwd }, ledger);
      handles[name] = ensured.handle;
      h.ensured = true;
      h.creationLaunchArgv = ensured.launchArgv;
      const s = ensured.post;
      h.identity = { acpxRecordId: handles[name].acpxRecordId ?? s.acpxRecordId, backendSessionId: handles[name].backendSessionId ?? s.backendSessionId };
      if (h.identity.backendSessionId !== s.backendSessionId || h.identity.acpxRecordId !== s.acpxRecordId) halt(`identity-mismatch-at-ensure:${name}`);
      if (Number.isInteger(s.pid)) h.creationPidObservation = ledger.observe(s.pid, "post-ensure");
      h.observedModel = s.currentModelId;
    } catch (error) {
      h.ensured = false;
      h.ensureError = error?.code ?? "error";
      halt(`ensure-failed:${name}:${h.ensureError}`);
    }
    state[name] = { cursor: undefined, known: new Set() };
  }

  const identityCheck = async (name, point) => {
    const s = await sampleStatus(runtimes[name], handles[name], point);
    ev.handles[name].ledger.record(s);
    if (s.backendSessionId !== ev.handles[name].identity.backendSessionId || s.acpxRecordId !== ev.handles[name].identity.acpxRecordId) {
      halt(`identity-changed:${name}:${point}`);
    }
    return s;
  };

  const plan = [
    { index: 1, handle: "normal", kind: "probe-canary", prompt: fill(prompts.canary, { CANARY_PATH: canaryPath, TOKEN: tokens.e1 }), field: "sentence" },
    { index: 2, handle: "normal", kind: "probe-reuse", prompt: prompts.reuse, field: "token" },
    { index: 3, handle: "short", kind: "probe-short", prompt: fill(prompts.short, { TOKEN: tokens.e3 }), field: "sentence" },
    { index: 4, handle: "short", kind: "probe-restore", prompt: prompts.restore, field: "token" },
  ];

  try {
  for (const step of plan) {
    const exp = { index: step.index, handle: step.handle, kind: step.kind, requests: [], invalidReturns: 0, invalidCandidates: 0, noResult: 0, submissions: 0, reasksUsed: 0 };
    ev.expectations.push(exp);
    if (halted) {
      exp.outcome = "not-run";
      continue;
    }
    if (step.index === 4) await idleExpiry(ev, runtimes.short, handles.short);
    const rt = runtimes[step.handle];
    const handle = handles[step.handle];
    const st = state[step.handle];
    let text = step.prompt;
    for (;;) {
      if (clock.mono() >= deadlineMono) {
        exp.outcome = "censored-wall-ceiling";
        halt("wall-ceiling: probe/soak pool wall allowance reached before submission");
        break;
      }
      const cost = costOf(ev);
      if (typeof cost.amount === "number" && cost.amount + ev.pool.prior.costKnownUsd >= PROBE_SOAK_POOL.usd) {
        exp.outcome = "censored-cost-ceiling";
        halt("cost-ceiling: reported probe/soak cost reached USD2");
        break;
      }
      if (exp.submissions >= PROBE.maxReasks + 1) break;
      const requestId = `${ev.runId}-e${step.index}-a${exp.submissions + 1}`;
      exp.submissions++;
      const rec = await runRequest({
        runtime: rt,
        handle,
        ledger: ev.handles[step.handle].ledger,
        requestId,
        text,
        cursor: st.cursor,
        knownRequestIds: st.known,
        deadlineMono,
        argvProbe: true,
      });
      st.known.add(requestId);
      const cls = rec.win.close(rec.control, step.kind);
      delete rec.win;
      rec.classification = cls;
      rec.expectation = step.index;
      rec.attempt = exp.submissions;
      exp.requests.push(requestId);
      ev.handles[step.handle].requests.push(rec);
      if (rec.window.complete) st.cursor = rec.window.endCursor;
      else halt(`window-unavailable:${requestId}${rec.watchError ? `:${rec.watchError}` : ""}`);
      if (cls.unknownRequestIds.length) halt(`unknown-request-binding:${requestId}`);
      await identityCheck(step.handle, `post-request:${requestId}`);
      if (cls.row === "candidate-valid") {
        exp.outcome = "delivered";
        exp.admitted = { requestId, cursor: rec.firstCandidate.cursor, toolCallId: rec.firstCandidate.toolCallId, data: rec.firstCandidate.data };
        break;
      }
      if (cls.c4) {
        exp.invalidReturns++;
        if (cls.row === "candidate-invalid") exp.invalidCandidates++;
        else exp.noResult++;
        if (exp.invalidReturns > PROBE.maxReasks) {
          exp.outcome = "stopped-four-invalid-returns";
          halt(`expectation-${step.index}-four-invalid-returns`);
          break;
        }
        if (halted) {
          exp.outcome = "stopped";
          break;
        }
        exp.reasksUsed++;
        text = fill(prompts.reask, { DEFECT: cls.defects.join("; "), KIND: step.kind, FIELD: VARIANTS[step.kind].field, EXAMPLE: exampleFor(step.kind) });
        continue;
      }
      exp.outcome = `stopped-${cls.row}`;
      halt(`expectation-${step.index}-${cls.row}`);
      break;
    }
    exp.firstTryValid = exp.outcome === "delivered" && exp.submissions === 1;
    if (exp.outcome === undefined) exp.outcome = "stopped";
    // Detect-after tool policy: decisive only on completion/effect evidence.
    const facts = ev.handles[step.handle].requests.filter((r) => r.expectation === step.index).flatMap((r) => r.toolFacts);
    const completedForbidden = facts.filter((f) => !f.allowedByPolicy && f.terminalStatus === "completed");
    if (completedForbidden.length) halt(`policy-violation-completed:${completedForbidden.map((f) => f.acpKind).join(",")}`);
    if (await exists(canaryPath)) halt("policy-violation-canary-present");
  }
  } catch (error) {
    // A trial-code/runtime fault is preserved as such; cleanup below still runs.
    process.stderr.write(`probe fault (not retained): ${error?.stack ?? error}\n`);
    ev.fault = { name: error?.name ?? "Error", code: error?.code ?? null, at: clock.iso() };
    halt(`trial-code-or-runtime-fault:${ev.fault.name}${ev.fault.code ? `:${ev.fault.code}` : ""}`);
  }

  ev.readonly.canaryAfter = (await exists(canaryPath)) ? "present" : "absent";

  // Disposal: close both handles (observed) before any shutdown.
  ev.disposalOrder = [];
  for (const name of ["normal", "short"]) {
    const h = ev.handles[name];
    if (!handles[name]) {
      h.close = { skipped: true, reason: h.ensured === false ? "ensureSession failed; no handle to close" : "handle never ensured" };
      continue;
    }
    h.close = await closeAndObserve({ runtime: runtimes[name], handle: handles[name], ledger: h.ledger, reason: "t1 probe complete", boundMs: PROBE.postCloseObserveMs, pollMs: PROBE.pidPollMs });
    ev.disposalOrder.push(`close:${name}`);
  }
  for (const name of ["normal", "short"]) {
    const t0 = clock.mono();
    await runtimes[name].shutdown();
    ev.disposalOrder.push(`shutdown:${name}`);
    ev.handles[name].shutdownMs = clock.mono() - t0;
  }
  for (const h of Object.values(ev.handles)) h.ledger = h.ledger.toJSON();
}

async function idleExpiry(ev, runtime, handle) {
  const h = ev.handles.short;
  const pre = await sampleStatus(runtime, handle, "pre-idle-expiry");
  h.ledger.record(pre);
  const exp = { preIdlePid: pre.pid ?? null, startedAt: clock.iso() };
  if (Number.isInteger(pre.pid)) {
    exp.result = await h.ledger.waitExit(pre.pid, "idle-expiry", PROBE.idleExpiryObserveMs, PROBE.pidPollMs);
  } else exp.result = "no-public-pid";
  exp.observedExit = exp.result === "ESRCH";
  // The expiring owner may still accept a socket connection after its agent
  // exited and answer QUEUE_OWNER_CLOSED; wait for its public exit checkpoint.
  if (exp.observedExit) exp.statusPidCleared = await waitStatusPidCleared(runtime, handle, h.ledger, PROBE.idleExpiryObserveMs, PROBE.pidPollMs);
  exp.endedAt = clock.iso();
  ev.idleExpiry = exp;
}

// ---------------------------------------------------------------- verdicts

function buildReport(ev, cleanupFacts, accounting) {
  const req = (n) => Object.values(ev.handles).flatMap((h) => h.requests ?? []);
  const exps = ev.expectations;
  const delivered = exps.filter((e) => e.outcome === "delivered").length;
  const limits = [
    "Tool policy is a trusted-process detect-after check over journaled tool events; it is not a sandbox or a complete tool inventory.",
    "The yield signature (kind other + declared keys) does not authenticate the tool name.",
    "Public pid= identifies the OMP agent child only, not the queue owner or descendants; PID reuse may cause a conservative false cleanup failure.",
    "A stable backendSessionId after restore does not prove complete restored context; token recall is continuation evidence only.",
    "Entirely unobserved tool starts/completions cannot be distinguished from no submission at this boundary.",
    "Live config lists extensions (including lifecycle-plugin.js); --no-extensions governs discovery only and extension loading was not independently observed.",
  ];
  const cap = {};
  const s0ok = ev.authority.ok && ev.s0.pins.ok;
  const reqs = req();
  const wantArgv = ev.s0.registryArgv?.join(" ");
  const argvObs = Object.values(ev.handles).flatMap((h) => [...(h.creationLaunchArgv ?? []), ...(h.requests ?? []).map((r) => r.launchArgv)]).filter((a) => typeof a?.command === "string");
  const argvExact = argvObs.length > 0 && argvObs.every((a) => a.command === wantArgv);
  const agentAnswered = Object.values(ev.handles).some((h) => h.ensured) || reqs.some((r) => r.window.rpc.initialize > 0);
  if (!s0ok) cap.launch = "not-run (preflight stop)";
  else if (!ev.processesStarted) cap.launch = ev.mode === "preflight" ? "not-run (preflight mode)" : "not-run";
  else if (argvObs.some((a) => a.command !== wantArgv)) cap.launch = "not-supported (launched argv differs from explicit pins)";
  // Supported needs the exact launched argv plus a delivered expectation (authentication proven by a completed turn).
  else cap.launch = argvExact && delivered > 0 ? "supported" : !agentAnswered ? "inconclusive (agent did not answer)" : !argvExact ? "inconclusive (launch argv not observed)" : "inconclusive (no completed turn; authentication unproved)";
  const resumeRejected = [];
  for (const [name, h] of Object.entries(ev.handles)) {
    for (const r of h.requests ?? []) {
      if (r.window.rpc.sessionResume.some((x) => x.sessionId === h.identity?.backendSessionId && x.ok === false) && r.turnResult?.errorDetailCode === "SESSION_RESUME_REQUIRED") resumeRejected.push(`${name}:${r.requestId}`);
    }
  }
  ev.resumeRejected = resumeRejected;
  cap.journal_result = !ev.processesStarted ? "not-run" : delivered === 4 ? "supported" : exps.some((e) => /delivery-uncertain/.test(e.outcome)) ? "not-supported" : !reqs.some((r) => r.promptStartedMono !== undefined) ? "inconclusive (no prompt reached the agent)" : "inconclusive";
  const e1 = exps[0]?.requests.at(-1);
  const e2first = exps[1]?.requests[0];
  const r1 = reqs.find((r) => r.requestId === e1);
  const r2 = reqs.find((r) => r.requestId === e2first);
  const pidOf = (rid, prefix) => ev.handles.normal?.ledger?.samples?.find((s) => s.point === `${prefix}:${rid}`)?.pid;
  if (r1 && r2) {
    const samePid = pidOf(e1, "journal-settled") !== undefined && pidOf(e1, "journal-settled") === pidOf(e2first, "prompt-started");
    const noReconnect = r2.window.rpc.initialize === 0 && r2.window.rpc.sessionResume.length === 0 && r2.window.rpc.sessionNew === 0;
    cap.reuse = exps[1].outcome === "delivered" && samePid && noReconnect ? "supported" : "inconclusive";
    ev.reuse = { samePid, noReconnect };
  } else cap.reuse = "not-run";
  const r4 = reqs.find((r) => r.requestId === exps[3]?.requests[0]);
  if (resumeRejected.length) cap.restore = "not-supported (agent rejected same-ID session/resume)";
  else if (r4 && ev.idleExpiry) {
    const bsid = ev.handles.short.identity?.backendSessionId;
    const resumed = r4.window.rpc.sessionResume.some((r) => r.sessionId === bsid && r.ok === true);
    const fresh = r4.window.rpc.sessionNew > 0 || r4.window.rpc.sessionLoad > 0;
    const newPid = ev.handles.short.ledger.samples.find((s) => s.point === `prompt-started:${r4.requestId}`)?.pid;
    const differentPid = Number.isInteger(newPid) && newPid !== ev.idleExpiry.preIdlePid;
    const tokenMatch = exps[3].admitted?.data?.token === ev.tokens.e3;
    ev.restore = { idleExitObserved: ev.idleExpiry.observedExit, resumedSameId: resumed, freshFallback: fresh, differentPid, tokenRecall: tokenMatch };
    cap.restore = !ev.idleExpiry.observedExit ? "inconclusive (idle expiry not observed)" : fresh ? "not-supported (fresh-session fallback)" : resumed && differentPid && exps[3].outcome === "delivered" ? "supported" : "inconclusive";
  } else cap.restore = "not-run";

  // Process-instance accounting: every known start needs public PID coverage.
  const instances = [];
  for (const [name, h] of Object.entries(ev.handles)) {
    if (!h.ensureInvokedAt) continue;
    const pid = h.ledger.samples.find((s) => s.point === "during-ensure" && Number.isInteger(s.pid))?.pid;
    instances.push({ handle: name, type: "ensure-creation", pid: pid ?? null });
    for (const r of h.requests ?? []) {
      if (r.window.rpc.initialize === 0 && r.window.complete) continue;
      const cand = h.ledger.samples.find((s) => (s.point === `prompt-started:${r.requestId}` || s.point === `journal-settled:${r.requestId}`) && Number.isInteger(s.pid));
      const type = !r.window.complete ? "unobserved-window-activity" : r.promptStartedMono === undefined ? "owner-connect-before-prompt" : "owner-connect";
      instances.push({ handle: name, type, requestId: r.requestId, pid: cand?.pid ?? null });
    }
  }
  ev.processInstances = instances;
  const uncovered = instances.filter((i) => i.pid === null);
  const allPoints = Object.values(ev.handles).flatMap((h) => h.ledger?.samples ?? []).filter((s) => Number.isInteger(s.pid)).map((s) => s.point.split(":")[0]);
  ev.pidPointsWithCoverage = [...new Set(allPoints)];
  // Established method limit (spec B-L478): pinned acpx records the connecting
  // instance's pid only after a successful load/resume, so a rejected same-ID
  // resume leaves that instance uncoverable. Any other gap is an observation gap.
  const methodLimited = uncovered.filter((i) => i.type === "owner-connect-before-prompt" && resumeRejected.includes(`${i.handle}:${i.requestId}`));
  const observationGaps = uncovered.filter((i) => !methodLimited.includes(i));
  cap.pid_sampling = !ev.processesStarted ? "not-run" : methodLimited.length ? "not-supported (public status exposes no PID for a rejected-resume owner instance)" : observationGaps.length ? `inconclusive (no public PID observed for: ${[...new Set(observationGaps.map((i) => i.type))].join(", ")})` : "supported";
  const handlesClosed = Object.values(ev.handles).filter((h) => h.close && !h.close.skipped);
  const closesOk = handlesClosed.length === Object.values(ev.handles).filter((h) => h.ensureInvokedAt).length && handlesClosed.every((h) => h.close.closeResolved && h.close.recordedClosed && h.close.pidResults.every((r) => r.result === "ESRCH"));
  cap.disposal = !ev.processesStarted ? "not-applicable (no process started)" : !closesOk ? "not-supported-or-unproved" : uncovered.length ? "unproved (uncovered process instances)" : handlesClosed.every((h) => h.close.allPidsExited) ? "supported" : "not-supported-or-unproved";
  const policyStop = ev.stops.some((s) => s.startsWith("policy-violation"));
  cap.tool_policy = !ev.processesStarted ? "not-run" : policyStop ? "not-supported (evidenced violation)" : ev.readonly.canaryAfter === "absent" && ev.readonly.protectedUnchanged ? "supported (detect-after only)" : "inconclusive";
  const vals = Object.values(cap);
  cap.overall = vals.every((v) => v.startsWith("supported")) ? "supported" : vals.some((v) => v.startsWith("not-supported") && !v.startsWith("not-supported-or")) ? "not-supported" : "inconclusive";
  if (!ev.processesStarted) cap.overall = "inconclusive";

  const cleanupNotes = [];
  let cleanupOk = cleanupFacts.privateRootRemovedAfterRetention;
  if (!cleanupOk) cleanupNotes.push("private root still present after removal attempt");
  const live = ev.liveStoreCleanup;
  if (live && !live.complete) {
    cleanupOk = false;
    cleanupNotes.push(`live-store session folders not fully removed: ${live.skipped ?? JSON.stringify({ kept: live.kept, folders: live.folders.filter((f) => f.result !== "removed" && f.result !== "absent") })}`);
  } else if (live) cleanupNotes.push(`live-store session folders removed (${live.deleted.length} session file(s)/folder(s) by recorded ID)`);
  if (ev.processesStarted) {
    for (const [name, h] of Object.entries(ev.handles)) {
      if (h.close?.skipped) {
        cleanupNotes.push(`${name}: ${h.close.reason}; actor process activity may have occurred without PID coverage (unproved)`);
        if (h.ensureInvokedAt) cleanupOk = false;
        continue;
      }
      if (!h.close) continue;
      if (!h.close.closeResolved) cleanupOk = false, cleanupNotes.push(`${name}: close did not resolve (${h.close.closeError})`);
      if (!h.close.recordedClosed) cleanupOk = false, cleanupNotes.push(`${name}: recorded closure not confirmed by status`);
      if (!h.close.allPidsExited) cleanupOk = false, cleanupNotes.push(`${name}: not every recorded PID observed ESRCH (${JSON.stringify(h.close.pidResults)})`);
      else cleanupNotes.push(`${name}: close resolved, recorded closed, ESRCH for ${h.close.pidResults.length} recorded PID(s)`);
    }
    for (const u of uncovered) {
      cleanupOk = false;
      cleanupNotes.push(`${u.handle}: ${u.type}${u.requestId ? ` (${u.requestId})` : ""} started an actor process with no public PID observation; its exit is unproved`);
    }
    if (ev.disposalOrder?.indexOf("shutdown:normal") < ev.disposalOrder?.lastIndexOf("close:short")) cleanupOk = false, cleanupNotes.push("shutdown preceded a close");
  } else cleanupNotes.push("positive evidence: no ensureSession/startTurn call was made, so no actor process started (PID coverage not applicable)");

  const branch = ev.mode === "preflight" ? (s0ok ? "preflight-pass" : "preflight-negative") : !s0ok ? "early-negative-preflight" : cap.overall === "supported" ? "probe-supported" : `probe-${cap.overall}`;
  const cleanupStatus = cleanupOk ? "complete" : uncovered.length && closesOk ? "unproved" : "unresolved";
  const evaluationComplete = cleanupOk && ev.mode === "probe";
  return {
    schema: "acpx-omp-acp-trial.t1-report.v1",
    run_id: ev.runId,
    task: "T1",
    mode: ev.mode,
    branch,
    bindings: {
      spec_revision: AUTHORITY.spec.revision,
      spec_sha256: ev.authority.specSha256,
      decisions_revision: AUTHORITY.decisions.revision,
      plan_sha256_provenance: ev.authority.planSha256,
      approval_sha256: ev.authority.approvalSha256,
      omp: ev.s0.pins.omp,
      acpx: ev.s0.pins.acpx,
      sdk: ev.s0.pins.sdk,
      overlay_sha256: ev.s0.pins.overlay.sha256,
      live_config_sha256: ev.s0.liveConfig.configSha256,
      lifecycle_plugin_sha256: ev.s0.liveConfig.lifecyclePlugin.sha256,
      model_roles_provenance: ev.s0.liveConfig.modelRoles,
      sources: ev.sources,
      correction: ev.correction ?? null,
    },
    implementation: { status: "runner-completed", note: "Independent check status is produced by probe-verify.mjs, not by this runner." },
    capability: cap,
    production_allowed: false,
    t2_entry_permitted: cap.overall === "supported" && cleanupOk,
    evaluation_complete: evaluationComplete,
    expectations: exps.map((e) => ({ index: e.index, handle: e.handle, kind: e.kind, outcome: e.outcome, firstTryValid: e.firstTryValid ?? false, submissions: e.submissions, invalidReturns: e.invalidReturns, invalidCandidates: e.invalidCandidates, noResult: e.noResult, reasksUsed: e.reasksUsed })),
    cleanup: { status: cleanupStatus, notes: cleanupNotes },
    accounting,
    stops: ev.stops,
    limits,
  };
}

// ---------------------------------------------------------------- not-run branch

async function notRun(opts) {
  const task = opts.task;
  if (!T2T3_CRITERIA[task]) throw new Error("--task must be T2 or T3");
  if (!opts.upstream) throw new Error("--upstream is required");
  const authority = await checkAuthority(opts.approval);
  const upstreamDir = path.resolve(opts.upstream);
  const upstreamReportPath = path.join(upstreamDir, "report.json");
  const upstream = await readJson(upstreamReportPath);
  const upstreamReportSha = await sha256File(upstreamReportPath);
  const problems = [...authority.problems];
  const expectedUpstreamTask = task === "T2" ? "T1" : "T2";
  if (upstream.task !== expectedUpstreamTask) problems.push(`upstream task ${upstream.task} is not ${expectedUpstreamTask}`);
  if (upstream.task === "T1" && upstream.evaluation_complete !== true) problems.push("upstream evaluation is not complete (unfinished prerequisite is not a completed negative)");
  const upstreamCapability = upstream.task === "T1" ? upstream.capability?.overall : upstream.upstream?.capability_overall;
  if (upstream.task === "T1" && upstreamCapability === "supported") problems.push("upstream T1 capability is supported; the not-run branch is not authorized");
  if (upstream.task === "T1" && upstream.cleanup?.status !== "complete") problems.push("upstream cleanup unresolved");
  if (upstream.task === "T2" && upstream.branch !== "upstream-blocked-not-run") problems.push("upstream T2 is not an authorized not-run record");
  const runsRoot = opts["runs-root"] ? path.resolve(opts["runs-root"]) : path.join(BUNDLE_DIR, "runs");
  const runId = `${task.toLowerCase()}-notrun-${stamp()}-${randomBytes(3).toString("hex")}`;
  const runDir = path.join(runsRoot, runId);
  await fs.mkdir(runDir, { recursive: true });
  const ok = problems.length === 0;
  const criteria = Object.fromEntries(T2T3_CRITERIA[task].map((id) => [id, ok
    ? { status: "not-run", reason: `bound upstream ${expectedUpstreamTask} completed with capability ${upstreamCapability}; dependent native/semantic work is not authorized` }
    : { status: "blocked", reason: problems.join("; ") }]));
  const report = {
    schema: "acpx-omp-acp-trial.notrun-report.v1",
    run_id: runId,
    task,
    branch: ok ? "upstream-blocked-not-run" : "not-run-refused",
    authority: { specSha256: authority.specSha256, approvalSha256: authority.approvalSha256, ok: authority.ok },
    upstream: { path: upstreamDir, report_sha256: upstreamReportSha, task: upstream.task, capability_overall: upstreamCapability, evaluation_complete: upstream.evaluation_complete === true },
    implementation_entered: false,
    model_work: false,
    native_processes_started: false,
    production_allowed: false,
    criteria,
    durations: task === "T3" ? { completed_max_ms: "unavailable", x2: "unavailable", x3: "unavailable", censored_max_ms: "unavailable", reason: "no production execution" } : "not-applicable",
    evaluation_complete: ok && task === "T3",
    problems,
    production_adoption: "not authorized",
    written_at: new Date().toISOString(),
  };
  await writeJson(path.join(runDir, "report.json"), report);
  await fs.writeFile(path.join(runDir, "report.md"), renderNotRunMarkdown(report));
  process.stdout.write(`RUN=${runDir}\n`);
  return ok ? 0 : 2;
}

// ---------------------------------------------------------------- main

const command = process.argv[2];
let code;
try {
  if (command === "__execute") {
    const { command: mode, opts: o } = parseArgs(process.argv.slice(3));
    code = await execute(mode, o);
  } else if (["preflight", "probe", "not-run"].includes(command)) {
    code = await launch(command, parseArgs(process.argv.slice(2)).opts);
  } else {
    process.stderr.write("usage: probe.mjs preflight|probe --approval FILE | not-run --task T2|T3 --approval FILE --upstream RUN\n");
    code = 64;
  }
} catch (error) {
  process.stderr.write(`probe.mjs: ${error?.stack ?? error}\n`);
  code = 1;
}
process.exit(code);
