#!/usr/bin/env node
// T2/T3 runner (spec acpx-omp-acp-trial/spec-v9).
//   node run.mjs t2 --approval config/approval.json --probe runs/<t1-probe-run>
//     deterministic mechanics, the public-route scripted checks, the A3 large
//     fixture, then the B1 native soak.
//   node run.mjs t3 --approval FILE --t2 T2_RUN [--runs-root DIR]
//     [--corrects PRIOR_RUN --cause CAUSE --stage rehearsal|production --scenarios S1[,S2,S3]]
//     entry via the independent T2 verifier, then the tiny-profile rehearsal,
//     conditional production S1/S2/S3 and the final evaluation.
// Launcher/child split as in probe.mjs: the child runs in a sanitized
// environment under a private owner-only root. Prints exactly one RUN=<abs>.
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hashProtected, listRuns, readJson, readJsonIfExists, exists, sha256File, sha256Text, writeJson } from "./lib/evidence/io.mjs";
import { clock } from "./lib/native/adapter.mjs";
import { cleanupLiveSessionFolders, createPrivateRoot, observeLiveConfig, observeLiveStore, observePins, removePrivateRoot, sanitizedEnv } from "./lib/native/env.mjs";
import { AUTHORITY, BUNDLE_DIR, PROBE, PROBE_SOAK_POOL, PROFILES, REPO_ROOT, buildAgentArgv } from "./lib/native/pins.mjs";
import { DebugLoop, NARROW_POOLS, PRODUCTION_LIMIT } from "./lib/semantic/debugloop.mjs";
import { T2_CRITERIA, deriveGate, evaluationComplete } from "./lib/semantic/gate.mjs";
import { runLargeFixture } from "./lib/semantic/large.mjs";
import { GUARD_IDS, GUARD_MAPPING } from "./lib/semantic/mapping.mjs";
import { runOffline, runPublicRoute } from "./lib/semantic/mechanics.mjs";
import { runSoak } from "./lib/semantic/soak.mjs";
import { SCENARIOS, STAGES, executeT3, finalizeT3, validateScenarioInputs } from "./lib/semantic/t3.mjs";

const SELF = fileURLToPath(import.meta.url);
const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const opts = {};
  for (let i = 0; i < rest.length; i++) {
    const k = rest[i];
    if (!k.startsWith("--")) throw new Error(`unexpected argument ${k}`);
    if (i + 1 >= rest.length || rest[i + 1].startsWith("--")) throw new Error(`missing value for ${k}`);
    opts[k.slice(2)] = rest[++i];
  }
  return { command, opts };
}

/**
 * Plan identity without its lifecycle parts: the Status value, the Completed
 * At line, task/AC checkbox marks, `  completed YYYY-MM-DD-HHMM` lines and the
 * Completion Summary section. Every other byte stays bound.
 */
export function planLifecycleNormalized(text) {
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l === "## Completion Summary") {
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith("## ")) j++;
      if (j === lines.length) {
        // Appended last section: drop its separating blank lines, keep the final newline.
        while (out.length && out.at(-1) === "") out.pop();
        if (lines.at(-1) === "") out.push("");
      }
      i = j - 1;
      continue;
    }
    if (/^\*\*Completed At\*\*: /.test(l) || /^  completed \d{4}-\d{2}-\d{2}-\d{4}$/.test(l)) continue;
    if (/^\*\*Status\*\*: /.test(l)) out.push("**Status**: <lifecycle>");
    else out.push(l.replace(/^- \[[ x]\] /, "- [ ] "));
  }
  return out.join("\n");
}

async function planIdentity() {
  try {
    return sha256Text(planLifecycleNormalized(await fs.readFile(path.join(REPO_ROOT, AUTHORITY.plan.path), "utf8")));
  } catch {
    return "unavailable";
  }
}

/** Identities of every T2 and reused T1 source; the gate binds these. */
export async function sourceIdentities() {
  const files = ["run.mjs", "controller.mjs", "verify.mjs", "probe.mjs", "probe-verify.mjs", "package.json", "package-lock.json", "prompts/transport-soak.md"];
  for (const dir of ["lib/native", "lib/evidence", "lib/semantic", "config", "fixture-agent", "prompts/semantic", "fixtures/mechanics", "fixtures/native"]) {
    for (const n of (await fs.readdir(path.join(BUNDLE_DIR, dir))).sort()) files.push(`${dir}/${n}`);
  }
  const out = {};
  for (const f of files) out[f] = (await exists(path.join(BUNDLE_DIR, f))) ? await sha256File(path.join(BUNDLE_DIR, f)) : "missing";
  out["authority:spec"] = await sha256File(path.join(REPO_ROOT, AUTHORITY.spec.path));
  out["authority:plan"] = await planIdentity();
  return out;
}

async function checkAuthority(approvalPath) {
  const out = { approvalPath: path.resolve(approvalPath), problems: [] };
  const approvalText = await fs.readFile(approvalPath, "utf8");
  out.approvalSha256 = sha256Text(approvalText);
  const approval = JSON.parse(approvalText);
  out.specSha256 = await sha256File(path.join(REPO_ROOT, AUTHORITY.spec.path));
  const decisionsText = await fs.readFile(path.join(REPO_ROOT, AUTHORITY.decisions.path), "utf8");
  out.decisionsRevisionPresent = decisionsText.includes(AUTHORITY.decisions.revision);
  out.planSha256 = await planIdentity();
  if (out.specSha256 !== AUTHORITY.spec.sha256) out.problems.push("spec sha256 differs from bound spec-v9");
  if (approval.authority?.spec?.sha256 !== AUTHORITY.spec.sha256 || approval.authority?.spec?.revision !== AUTHORITY.spec.revision) out.problems.push("approval binds a different spec");
  if (approval.authority?.decisions?.revision !== AUTHORITY.decisions.revision || !out.decisionsRevisionPresent) out.problems.push("decisions revision mismatch");
  for (const [name, pin] of Object.entries(PROFILES)) {
    const a = approval.launch_pins?.[name];
    if (!a || a.model !== pin.model || a.thinking !== pin.thinking) out.problems.push(`approval launch pin ${name} differs from code pins`);
  }
  if (approval.fallback_model !== null) out.problems.push("approval declares a fallback model");
  const ap = approval.execution_approval?.approved_proposals ?? {};
  if (ap.post_close_pid_observation_seconds !== PROBE.postCloseObserveMs / 1000) out.problems.push("post-close observation bound not approved as coded");
  if (ap.t1_t2_debug_loop_extension !== true) out.problems.push("T1/T2 debug-loop extension not approved");
  out.ok = out.problems.length === 0;
  return out;
}

/** T1 dependency: supported, entry-permitted, cleanup-complete, independently re-verified. */
function checkT1(probeRun) {
  const out = { run: path.basename(probeRun) };
  const verify = spawnSync(process.execPath, [path.join(BUNDLE_DIR, "probe-verify.mjs"), probeRun, "T1"], { encoding: "utf8", cwd: BUNDLE_DIR });
  out.verifyExit = verify.status;
  out.verifyLast = verify.stdout.trim().split("\n").at(-1);
  return out;
}

async function priorPoolUsage(runsRoot, selfId) {
  let wallMs = 0;
  const costs = [];
  for (const prefix of ["t1-", "t2-"]) {
    for (const run of await listRuns(runsRoot, prefix)) {
      if (path.basename(run) === selfId) continue;
      const acc = await readJsonIfExists(path.join(run, "accounting.json"));
      if (acc?.pool === "probe-soak" && (acc.modelWork !== false || acc.countsTowardWall === true)) {
        wallMs += acc.wallMs ?? 0;
        costs.push(acc.cost);
      }
    }
  }
  const known = costs.filter((c) => typeof c?.amount === "number");
  return { wallMs, costKnownUsd: known.reduce((s, c) => s + c.amount, 0), costUnknownRuns: costs.length - known.length };
}

// ---------------------------------------------------------------- launcher

async function launch(command, opts) {
  if (command === "t3") return launchT3(opts);
  if (command !== "t2") throw new Error("usage: run.mjs t2 --approval FILE --probe T1_RUN | run.mjs t3 --approval FILE --t2 T2_RUN");
  if (!opts.approval || !opts.probe) throw new Error("--approval and --probe are required");
  const runsRoot = opts["runs-root"] ? path.resolve(opts["runs-root"]) : path.join(BUNDLE_DIR, "runs");
  const runId = `t2-soak-${stamp()}-${randomBytes(3).toString("hex")}`;
  const runDir = path.join(runsRoot, runId);
  await fs.mkdir(runDir, { recursive: true });
  const dirs = await createPrivateRoot("t2");
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
    const child = spawn(process.execPath, [SELF, "__execute", "--run", runDir, "--runs-root", runsRoot, "--root", dirs.root, "--approval", path.resolve(opts.approval), "--probe", path.resolve(opts.probe)], { env, cwd: BUNDLE_DIR, stdio: ["ignore", "inherit", "inherit"] });
    child.on("exit", (c, s) => resolve(c ?? (s ? 128 : 1)));
  });
  const rootLeft = await exists(dirs.root);
  const launcherRemoval = rootLeft ? await removePrivateRoot(dirs) : undefined;
  await writeJson(path.join(runDir, "launcher-exit.json"), { childExitCode: code, privateRootPresentAfterChild: rootLeft, launcherRemovedPrivateRoot: launcherRemoval?.removed, at: new Date().toISOString() });
  process.stdout.write(`RUN=${runDir}\n`);
  return code;
}

// ---------------------------------------------------------------- execution

async function execute(opts) {
  const runDir = opts.run;
  const dirs = { root: opts.root, home: path.join(opts.root, "home"), tmp: path.join(opts.root, "tmp"), sessions: path.join(opts.root, "sessions"), cwd: path.join(opts.root, "cwd") };
  const runId = path.basename(runDir);
  const startedAt = clock.iso();
  const startMono = clock.mono();
  const stops = [];
  const halt = (why) => stops.push(why);
  const ev = { schema: "acpx-omp-acp-trial.t2.v1", runId, task: "T2", attempt: 1, startedAt };

  ev.authority = await checkAuthority(opts.approval);
  ev.sources = await sourceIdentities();
  const protectedList = (await readJson(path.join(BUNDLE_DIR, "config", "protected-sources.json"))).files;
  ev.readonly = { protectedBefore: await hashProtected(REPO_ROOT, protectedList) };
  const privMode = (await fs.stat(dirs.root)).mode & 0o777;
  ev.s0 = {
    env: { keys: Object.keys(process.env).sort(), HOME: process.env.HOME, TMPDIR: process.env.TMPDIR, PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR },
    privateRoot: { path: dirs.root, mode: privMode.toString(8), outsideBundle: !dirs.root.startsWith(BUNDLE_DIR) },
    liveStore: await observeLiveStore(),
    pins: await observePins(process.env),
    liveConfig: await observeLiveConfig(process.env),
    expectedLaunch: { profile: "tiny", ...PROFILES.tiny },
  };
  const t1Report = await readJsonIfExists(path.join(opts.probe, "report.json"));
  ev.t1 = {
    run: path.basename(opts.probe),
    capability: t1Report?.capability?.overall ?? null,
    t2EntryPermitted: t1Report?.t2_entry_permitted === true,
    cleanup: t1Report?.cleanup?.status ?? null,
    ...checkT1(opts.probe),
  };
  ev.t1.verifyOk = ev.t1.verifyExit === 0 && ev.t1.verifyLast === "PASS T1";
  const prior = await priorPoolUsage(opts["runs-root"], runId);
  ev.pool = { name: "probe-soak", limitUsd: PROBE_SOAK_POOL.usd, limitWallMs: PROBE_SOAK_POOL.wallMs, prior };

  // Deterministic mechanics first: no model, no live store, no pool spend.
  const offline = await runOffline();
  const publicRoute = await runPublicRoute();
  const large = await runLargeFixture();
  const mechanics = { offline, publicRoute, large };
  const offlineFails = offline.filter((c) => !c.pass).map((c) => `${c.group}:${c.name}`);
  ev.mechanicsSummary = { offlineCases: offline.length, offlineFails, publicRouteChildExit: publicRoute.childExit, largeRow: large.row ?? large.classification?.row ?? null };

  let proceed = true;
  const pre = (cond, why) => {
    if (!cond) {
      stops.push(why);
      proceed = false;
    }
  };
  pre(ev.authority.ok, `stale-authority: ${ev.authority.problems.join("; ")}`);
  pre(ev.t1.capability === "supported" && ev.t1.t2EntryPermitted && ev.t1.cleanup === "complete" && ev.t1.verifyOk, "t1-dependency-not-accepted");
  pre(ev.s0.pins.ok, "pin-drift: exact toolchain pin mismatch; stopped before model launch without substitution");
  pre(ev.s0.liveStore.isDirectory === true, "live-store-unavailable");
  pre(privMode === 0o700, "unsafe-isolation: private root is not owner-only");
  pre(offlineFails.length === 0 && publicRoute.childExit === 0 && !publicRoute.error, "mechanics-failed: native soak not started (B4 code-owned cause)");
  const remainingWall = PROBE_SOAK_POOL.wallMs - prior.wallMs - (clock.mono() - startMono);
  pre(prior.costKnownUsd < PROBE_SOAK_POOL.usd && remainingWall > 0, "pool-exhausted: probe/soak pool has no remaining allowance");
  ev.processesStarted = false;

  if (proceed) {
    await runSoak({ ev, dirs, deadlineMono: clock.mono() + remainingWall, priorCostKnownUsd: prior.costKnownUsd, halt });
  } else ev.processesStartedEvidence = "preflight stop preceded every native launch";

  if (ev.processesStarted && ev.soak) {
    const closes = ev.soak.sessions.filter((s) => s.ensureInvokedAt).map((s) => s.close);
    const published = closes.every((cl) => cl && !cl.skipped && cl.pidResults.length > 0);
    const allEsrch = published && closes.every((cl) => cl.pidResults.every((r) => r.result === "ESRCH"));
    const sessionIds = ev.soak.sessions.map((s) => s.identity?.backendSessionId).filter(Boolean);
    const realCwd = await fs.realpath(dirs.cwd);
    ev.liveStoreCleanup = allEsrch
      ? await cleanupLiveSessionFolders({ sessionDir: ev.soak.sessionDir, sessionIds, realCwd })
      : { skipped: published ? "a published PID did not reach ESRCH; live-store folders retained" : "no published PID set for every owned handle; live-store folders retained", sessionDir: ev.soak.sessionDir, sessionIds, complete: false };
  }

  ev.readonly.protectedAfter = await hashProtected(REPO_ROOT, protectedList);
  ev.readonly.protectedUnchanged = protectedList.every((f) => ev.readonly.protectedBefore[f] === ev.readonly.protectedAfter[f]);
  if (!ev.readonly.protectedUnchanged) stops.push("protected-source-drift");
  ev.stops = stops;
  ev.finishedModelWorkAt = clock.iso();

  // B4 debug loop for this attempt: causes are recorded only from evidence.
  const loop = new DebugLoop({ owners: {}, extensionApproved: ev.authority.ok });
  ev.debugLoop = { extensionApproved: loop.extensionApproved, causes: [...loop.causes.values()], blocksDone: loop.blocksDone(), entryOpen: loop.entryOpen("t2-soak"), note: "a trial-code cause is recorded only with a preserved snapshot and independent evidence; none is recorded unless listed" };

  // Retention before removal.
  await writeJson(path.join(runDir, "mechanics.json"), mechanics);
  const { soak, ...rest } = ev;
  await writeJson(path.join(runDir, "soak.json"), soak ?? { notRun: true, reason: ev.processesStartedEvidence });
  await writeJson(path.join(runDir, "guards.json"), { ids: GUARD_IDS, mapping: GUARD_MAPPING });
  await writeJson(path.join(runDir, "t2.json"), rest);
  const removal = await removePrivateRoot(dirs);
  const wallMs = clock.mono() - startMono;
  const cleanupFacts = { privateRootRemovedAfterRetention: removal.removed, acpxSocketDirExisted: removal.socketDirExisted, liveStoreComplete: ev.liveStoreCleanup?.complete ?? !ev.processesStarted, removedAt: clock.iso(), evidenceWrittenBeforeRemoval: true };
  await writeJson(path.join(runDir, "cleanup.json"), cleanupFacts);
  const costKnown = soak?.sessions?.every((s) => typeof s.cost === "number");
  const cost = !ev.processesStarted ? { amount: 0, currency: "USD", basis: "no model work started" } : costKnown ? { amount: soak.sessions.reduce((a, s) => a + s.cost, 0), currency: "USD", basis: "public status cumulative session cost (reported, summed across per-process counters)" } : { amount: "unknown", basis: "no reported cost for every soak session" };
  const tokensKnown = soak?.sessions?.every((s) => typeof s.tokens === "number");
  await writeJson(path.join(runDir, "accounting.json"), {
    pool: "probe-soak",
    task: "T2",
    startedAt,
    endedAt: clock.iso(),
    wallMs,
    modelWork: ev.processesStarted,
    cost,
    tokens: tokensKnown ? soak.sessions.reduce((a, s) => a + s.tokens, 0) : ev.processesStarted ? "unknown" : 0,
    priorWallMs: prior.wallMs,
    priorCostKnownUsd: prior.costKnownUsd,
    priorCostUnknownRuns: prior.costUnknownRuns,
    note: "wallMs covers the whole T2 execution including scripted mechanics. OAuth cost may be absent or delayed; unknown is never reported as zero.",
  });

  // Criteria come from the independent verifier, never from runner booleans.
  const criteria = {};
  for (const id of T2_CRITERIA) {
    const r = spawnSync(process.execPath, [path.join(BUNDLE_DIR, "verify.mjs"), runDir, id], { encoding: "utf8", cwd: BUNDLE_DIR });
    criteria[id] = r.status === 0 ? "PASS" : "FAIL";
  }
  const soakCapability = soakCapabilityOf(soak, stops);
  const gate = deriveGate({
    t1: { capability: ev.t1.capability, t2EntryPermitted: ev.t1.t2EntryPermitted, cleanup: ev.t1.cleanup, verifyOk: ev.t1.verifyOk },
    criteria,
    soakCapability: soakCapability.result,
    identities: { current: await sourceIdentities(), recorded: ev.sources },
    cleanup: { complete: cleanupFacts.privateRootRemovedAfterRetention === true && cleanupFacts.liveStoreComplete === true },
    safety: { protectedUnchanged: ev.readonly.protectedUnchanged, unsafeRetention: false },
    unfixedCodeBug: ev.debugLoop.blocksDone,
  });
  const report = {
    schema: "acpx-omp-acp-trial.t2-report.v1",
    run_id: runId,
    task: "T2",
    attempt: 1,
    branch: "entered",
    t1_run: ev.t1.run,
    soak: soakCapability,
    criteria,
    production_allowed: gate.production_allowed,
    gate_reasons: gate.reasons,
    evaluation_complete: evaluationComplete({ codeChecksPassed: T2_CRITERIA.every((id) => criteria[id] === "PASS"), evidenceComplete: true, cleanupComplete: cleanupFacts.liveStoreComplete === true && removal.removed === true, unfixedCodeBug: ev.debugLoop.blocksDone, authorityOk: ev.authority.ok }),
    identities: ev.sources,
    accounting: { wallMs, cost, priorWallMs: prior.wallMs, priorCostKnownUsd: prior.costKnownUsd },
    stops,
    t3_executed: false,
    limits: [
      "T2 wraps the public watchSession (Proxy around the public runtime) to capture T2 closed projections by cursor, because the T1 reader's closed projection knows only kind/sentence/token; admission still uses the shared RequestWindow.",
      "Restored-context integrity is unproved: a stable backend ID after restore does not prove prior context; the soak re-supplies every token (see soak.contextIntegrity).",
      "The soak owns no reviewers, so first-review flags are not exercised natively in T2; the controller has no restore/reset path for them and native preservation is observed in T3 (AC-RETHINK).",
      "Tool policy is a trusted-process detect-after check, not a sandbox.",
      "OAuth cost may be absent or delayed; a monetary hard cap cannot be guaranteed.",
    ],
  };
  await writeJson(path.join(runDir, "report.json"), report);
  await fs.writeFile(path.join(runDir, "report.md"), renderMarkdown(report));
  return 0;
}

// ---------------------------------------------------------------- T3

const T2_GATE_IDS = ["AC-MAPPING", "AC-MECHANICS", "AC-TRANSPORT", "AC-RESTORE", "AC-REQUESTS", "AC-DIAGNOSTICS", "AC-DEBUGLOOP", "AC-PRODUCTION-GATE"];

/** T3 entry: the independent T2 verifier must pass all eight checks and derive production_allowed=true. */
export function checkT2Entry(t2Run) {
  const r = spawnSync(process.execPath, [path.join(BUNDLE_DIR, "verify.mjs"), t2Run, "T2"], { encoding: "utf8", cwd: BUNDLE_DIR });
  const lines = r.stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  const results = Object.fromEntries(T2_GATE_IDS.map((id) => [id, lines.includes(`PASS ${id}`) ? "PASS" : lines.includes(`FAIL ${id}`) ? "FAIL" : "missing"]));
  const derived = lines.find((l) => l.startsWith("note AC-PRODUCTION-GATE: derived production_allowed="));
  const productionAllowed = /^note AC-PRODUCTION-GATE: derived production_allowed=true$/.test(derived ?? "");
  const out = { t2Run: path.resolve(t2Run), verifyExit: r.status, verifyLast: lines.at(-1) ?? null, results, derivedLine: derived ?? null, productionAllowed, verifyOutput: lines };
  out.ok = r.status === 0 && out.verifyLast === "PASS T2" && T2_GATE_IDS.every((id) => results[id] === "PASS") && productionAllowed;
  return out;
}

/** T3 argument rules: correction flags only together; CLI flags never grant eligibility. */
export function parseT3Plan(opts) {
  const corr = ["corrects", "cause", "stage", "scenarios"].filter((k) => opts[k] !== undefined);
  if (corr.length && corr.length !== 4) throw new Error("--stage/--scenarios apply only together with --corrects PRIOR_RUN --cause CAUSE (all four are required for a corrected execution)");
  if (!corr.length) return { corrected: false, plan: [{ stage: "rehearsal", scenarios: [...SCENARIOS] }, { stage: "production", scenarios: [...SCENARIOS], requiresRehearsalClear: true }] };
  if (!STAGES.includes(opts.stage)) throw new Error("--stage must be rehearsal or production");
  const list = String(opts.scenarios).split(",");
  if (!list.length || new Set(list).size !== list.length || !list.every((x) => SCENARIOS.includes(x))) throw new Error("--scenarios must be a non-empty unique subset of S1,S2,S3");
  return { corrected: true, plan: [{ stage: opts.stage, scenarios: SCENARIOS.filter((x) => list.includes(x)) }] };
}

/**
 * B4 corrected-execution eligibility from the discovering execution's own
 * evidence: owner-fixed cause, unchanged approval, completed prior disposal,
 * stage/scenario provenance. Budget limits are enforced again before each submission.
 */
export async function checkCorrection({ prior, cause, stage, scenarios, approvalSha256 }) {
  const problems = [];
  const t3 = await readJsonIfExists(path.join(prior, "t3.json"));
  if (!path.basename(prior).startsWith("t3-") || !t3) return { ok: false, problems: ["--corrects is not a retained T3 execution"] };
  // Causes are appended by their retained owner beside the original evidence (causes.json), never by rewriting it.
  const causes = [...(t3.debugLoop?.causes ?? []), ...((await readJsonIfExists(path.join(prior, "causes.json")))?.causes ?? [])];
  const c = causes.find((x) => x.id === cause);
  if (!c) problems.push(`cause ${cause} is not recorded in the prior execution's evidence`);
  else {
    if (c.status !== "fixed-offline") problems.push(`cause ${cause} status ${c.status} is not fixed-offline`);
    if (!(c.fixes?.length >= 1 && c.fixes.length <= 2)) problems.push(`cause ${cause} has ${c.fixes?.length ?? 0} fixes`);
    if (c.discoveredIn !== stage) problems.push(`cause ${cause} was discovered in ${c.discoveredIn}; a ${stage} rerun needs a ${stage}-origin cause`);
    const affected = c.affectedScenarios ?? [];
    if (!scenarios.every((s) => affected.includes(s))) problems.push(`scenarios ${scenarios.join(",")} are not all invalidated by ${cause} (${affected.join(",") || "none"})`);
  }
  if (t3.approval?.sha256 !== approvalSha256) problems.push("approved input changed since the prior execution");
  const cl = await readJsonIfExists(path.join(prior, "cleanup.json"));
  if (cl?.privateRootRemovedAfterRetention !== true || cl?.liveStoreComplete !== true) problems.push("prior execution disposal/cleanup not complete");
  return { ok: problems.length === 0, problems, run: path.basename(prior), cause, stage, scenarios };
}

async function launchT3(opts) {
  if (!opts.approval || !opts.t2) throw new Error("usage: run.mjs t3 --approval FILE --t2 T2_RUN [--runs-root DIR] [--corrects PRIOR_RUN --cause CAUSE --stage rehearsal|production --scenarios S1[,S2,S3]]");
  const { plan } = parseT3Plan(opts);
  const runsRoot = opts["runs-root"] ? path.resolve(opts["runs-root"]) : path.join(BUNDLE_DIR, "runs");
  // Every refusal below precedes run creation and any model work.
  const refuse = (why) => {
    process.stderr.write(`REFUSED t3: ${why}\n`);
    return 2;
  };
  const entry = checkT2Entry(opts.t2);
  if (!entry.ok) return refuse(`T2 entry not permitted (${entry.verifyLast}; ${Object.entries(entry.results).filter(([, v]) => v !== "PASS").map(([k, v]) => `${k} ${v}`).join(", ") || "all eight PASS"}; ${entry.derivedLine ?? "no derived production_allowed"})`);
  const authority = await checkT3Authority(opts.approval);
  if (!authority.ok) return refuse(`authority: ${authority.problems.join("; ")}`);
  const approval = JSON.parse(await fs.readFile(opts.approval, "utf8"));
  const inputs = validateScenarioInputs(approval);
  if (!inputs.ok) return refuse(`scenario inputs: ${inputs.problems.join("; ")}`);
  let corrects = null;
  if (opts.corrects) {
    corrects = await checkCorrection({ prior: path.resolve(opts.corrects), cause: opts.cause, stage: plan[0].stage, scenarios: plan[0].scenarios, approvalSha256: authority.approvalSha256 });
    if (!corrects.ok) return refuse(`correction not eligible: ${corrects.problems.join("; ")}`);
  }
  const runId = `t3-run-${stamp()}-${randomBytes(3).toString("hex")}`;
  const runDir = path.join(runsRoot, runId);
  await fs.mkdir(runDir, { recursive: true });
  const dirs = await createPrivateRoot("t3");
  const env = sanitizedEnv(dirs);
  await writeJson(path.join(runDir, "launch.json"), {
    runId,
    command: "t3",
    launcherPid: process.pid,
    privateRoot: dirs.root,
    childEnvKeys: Object.keys(env).sort(),
    childEnvFixed: { PATH: env.PATH, HOME: env.HOME, TMPDIR: env.TMPDIR, PI_CODING_AGENT_DIR: env.PI_CODING_AGENT_DIR },
    parentEnvKeyCount: Object.keys(process.env).length,
    entry,
    corrects,
    plan,
  });
  const args = [SELF, "__execute3", "--run", runDir, "--runs-root", runsRoot, "--root", dirs.root, "--approval", path.resolve(opts.approval), "--t2", path.resolve(opts.t2)];
  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, args, { env, cwd: BUNDLE_DIR, stdio: ["ignore", "inherit", "inherit"] });
    child.on("exit", (c, sig) => resolve(c ?? (sig ? 128 : 1)));
  });
  const rootLeft = await exists(dirs.root);
  const launcherRemoval = rootLeft ? await removePrivateRoot(dirs) : undefined;
  await writeJson(path.join(runDir, "launcher-exit.json"), { childExitCode: code, privateRootPresentAfterChild: rootLeft, launcherRemovedPrivateRoot: launcherRemoval?.removed, at: new Date().toISOString() });
  process.stdout.write(`RUN=${runDir}\n`);
  return code;
}

/** T2 authority plus the approved rehearsal subcap and production pool as coded. */
export async function checkT3Authority(approvalPath) {
  const out = await checkAuthority(approvalPath);
  const approval = JSON.parse(await fs.readFile(approvalPath, "utf8"));
  const sub = approval.execution_approval?.approved_proposals?.rehearsal_subcap;
  if (sub?.usd !== NARROW_POOLS.rehearsal.usd || sub?.wall_minutes * 60_000 !== NARROW_POOLS.rehearsal.wallMs) out.problems.push("rehearsal subcap not approved as coded");
  const p = approval.pools?.production;
  if (p?.usd !== PRODUCTION_LIMIT.usd || p?.reported_tokens !== PRODUCTION_LIMIT.tokens || p?.wall_minutes * 60_000 !== PRODUCTION_LIMIT.wallMs) out.problems.push("production pool not approved as coded");
  out.ok = out.problems.length === 0;
  return out;
}

async function executeT3Child(opts) {
  const runDir = opts.run;
  const dirs = { root: opts.root, home: path.join(opts.root, "home"), tmp: path.join(opts.root, "tmp"), sessions: path.join(opts.root, "sessions"), cwd: path.join(opts.root, "cwd") };
  const launchRec = await readJson(path.join(runDir, "launch.json"));
  const authority = await checkT3Authority(opts.approval);
  const approval = JSON.parse(await fs.readFile(opts.approval, "utf8"));
  const privMode = (await fs.stat(dirs.root)).mode & 0o777;
  const s0 = {
    env: { keys: Object.keys(process.env).sort(), HOME: process.env.HOME, TMPDIR: process.env.TMPDIR, PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR },
    privateRoot: { path: dirs.root, mode: privMode.toString(8), outsideBundle: !dirs.root.startsWith(BUNDLE_DIR) },
    liveStore: await observeLiveStore(),
    pins: await observePins(process.env),
    liveConfig: await observeLiveConfig(process.env),
  };
  // Re-check the entry-time conditions that may have drifted; any failure plans no stage.
  const problems = [...authority.problems];
  if (!validateScenarioInputs(approval).ok) problems.push("scenario inputs invalid");
  if (!s0.pins.ok) problems.push("pin-drift: exact toolchain pin mismatch");
  if (s0.liveStore.isDirectory !== true) problems.push("live-store-unavailable");
  if (privMode !== 0o700) problems.push("unsafe-isolation: private root is not owner-only");
  const plan = problems.length ? [] : launchRec.plan;
  const out = await executeT3({
    runDir,
    runsRoot: opts["runs-root"],
    dirs,
    approval,
    approvalMeta: { path: authority.approvalPath, sha256: authority.approvalSha256 },
    entry: launchRec.entry,
    corrects: launchRec.corrects,
    plan,
    argvFor: (profile, sessionDir) => buildAgentArgv(profile, sessionDir),
    scripted: false,
    authority,
    sources: await sourceIdentities(),
    s0,
    preStops: problems.map((p) => `preflight: ${p}`),
  });
  await finalizeT3({ runDir, out, t2Run: path.basename(opts.t2) });
  return 0;
}

export function soakCapabilityOf(soak, stops) {
  if (!soak) return { result: "not-run", cause: stops[0] ?? "not started" };
  const exps = soak.sessions.flatMap((s) => s.expectations);
  const f = {
    eventuallyValid: exps.filter((e) => e.outcome === "delivered").length,
    firstTryValid: exps.filter((e) => e.firstTryValid).length,
    submissions: soak.submissions,
    reasks: exps.reduce((a, e) => a + e.reasks, 0),
    restores: soak.sessions.flatMap((s) => s.restores).filter((r) => r.restored).length,
    rewatches: soak.sessions.flatMap((s) => s.rewatches).filter((r) => r.detached && r.recovered).length,
    sizePayloads: exps.filter((e) => e.kind === "soak-size" && e.admitted?.payloadBytes >= 32768).length,
    observedCloses: soak.sessions.filter((s) => s.close?.closeResolved && s.close?.recordedClosed && s.close?.allPidsExited).length,
    fallbacks: soak.sessions.flatMap((s) => s.requests).filter((q) => q.window?.rpc?.sessionNew > 0).length,
    replays: 0,
  };
  const need = { eventuallyValid: 40, restores: 4, rewatches: 5, sizePayloads: 3, observedCloses: 4 };
  const short = Object.entries(need).filter(([k, v]) => f[k] < v).map(([k, v]) => `${k} ${f[k]}/${v}`);
  if (f.fallbacks) short.push(`fallbacks ${f.fallbacks}`);
  const result = short.length === 0 && stops.length === 0 ? "supported" : stops.some((s) => /ceiling|pool/.test(s)) ? "inconclusive" : "not-supported";
  return { result, facts: f, shortfalls: short, cause: result === "supported" ? null : stops[0] ?? short[0] };
}

function renderMarkdown(r) {
  return [
    `# T2 run ${r.run_id}`,
    "",
    `- T1 dependency: ${r.t1_run}`,
    `- Soak: ${r.soak.result}${r.soak.cause ? ` (${r.soak.cause})` : ""}`,
    `- Soak facts: ${JSON.stringify(r.soak.facts ?? {})}`,
    ...Object.entries(r.criteria).map(([k, v]) => `- ${k}: ${v}`),
    `- production_allowed: ${r.production_allowed}${r.gate_reasons.length ? ` (${r.gate_reasons.join("; ")})` : ""}`,
    `- Wall: ${r.accounting.wallMs} ms; cost: ${JSON.stringify(r.accounting.cost)}`,
    `- Stops: ${r.stops.length ? r.stops.join("; ") : "none"}`,
    `- T3 executed: ${r.t3_executed}`,
    "",
    "## Limits",
    "",
    ...r.limits.map((l) => `- ${l}`),
    "",
  ].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === SELF) {
  let code;
  try {
    const { command, opts } = parseArgs(process.argv.slice(2));
    code = command === "__execute" ? await execute(opts) : command === "__execute3" ? await executeT3Child(opts) : await launch(command, opts);
  } catch (error) {
    process.stderr.write(`${error?.stack ?? error}\n`);
    code = 1;
  }
  process.exitCode = code;
}
