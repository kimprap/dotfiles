#!/usr/bin/env node
// Reconcile/Retrace ACP controller entry point (spec-v3 §5 Q1):
//   node cli.mjs reconcile|retrace|normalize < request.json
//   node cli.mjs resume <runId> < request.json
//   node cli.mjs dispose <runId>
//   node cli.mjs stop <runId>
//   node cli.mjs stop reconcile|retrace|normalize < request.json
//   node cli.mjs stop resume <runId> < request.json
//   node cli.mjs roles [< {"models": {"a"?: {"model"?, "thinking"?}, "b"?: {...}}}]
// stdout: the rendered Markdown record only, except that a successful `roles`
// prints only the models note and the run list; stderr: diagnostics and the
// hand-off notice.
// Exit: 0 final/complete, 1 stopped/partial/blocked/parked, 2 refused before
// any launch, 3 cleanup failure or abandoned run.
//
// Refusals run in this order before anything is launched: request shape,
// checkVersions, readModelRoles, then (only for a `roles` body or a
// `reconcile`/`retrace` request with `models`) readModelCatalog and the model
// choice/override, loadPrompts, then the run classes (new runs and `roles`
// only; `resume`/`dispose <runId>` judge their named run themselves and are
// never blocked by other runs): a new run's request is matched to a run by
// identity, then by target, and that run's class decides (attach to it, print
// its waiting record, or refuse naming it); without a match any abandoned run
// refuses. Then this process's own start time, and the controller's own
// checks (the runner called with `preflight`). `roles` runs the same checks
// except request shape and matching, then prints the models note and the
// run list without importing the controller.
// `roles` reads stdin only when it is not a TTY; its optional body holds loose
// per-run model choices that are resolved against `omp models --json`.
//
// Run survival: the run itself executes in a detached worker (worker.mjs).
// This process hands it off, writes the notice to stderr, waits with no
// deadline for the record in the run folder and prints it. `dispose`, `stop`
// and `roles` stay in this process and launch no worker; `stop` asks a live
// run's worker to stop through its run folder and never signals.
// A run's ending record waits in its run folder until printed; after the print
// the caller removes the folder of a finished run only (`settle`).
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONTROLLER_ROOT, observePid as defaultObservePid, OVERLAY_PATH } from "./lib/adapter.mjs";
import { childEnv, newRunId, privateRootFor, readOwnerClaim, readRunResult, removePrivateRoot, RUN_ID_PATTERN, RUN_KINDS, SESSIONS_ROOT, TMP_ROOT, writeStopRequest } from "./lib/env.mjs";
import { exists, readJsonIfExists } from "./lib/io.mjs";
import { applyModelOverride, readModelCatalog as defaultReadModelCatalog, readModelRoles as defaultReadModelRoles, renderModels, resolveModelChoice } from "./lib/models.mjs";
import { abandonedRunLines, classifyRun, listProcesses as defaultListProcesses, matchRequest, OWN_START_UNREADABLE, ownerState, ownStartReason, printWays, processesForRun, processStart as defaultProcessStart, renderRunList, requestIdentity, requestTarget, scanRuns } from "./lib/preflight.mjs";
import { loadPrompts as defaultLoadPrompts, PROMPT_SOURCES } from "./lib/prompts.mjs";
import { renderSpend } from "./lib/spend.mjs";
import { checkVersions } from "./lib/versions.mjs";
import { launchWorker as defaultLaunchWorker, RUNNERS } from "./worker.mjs";

export const EXIT = Object.freeze({ final: 0, stopped: 1, refused: 2, cleanup: 3 });

const CLI_PATH = fileURLToPath(import.meta.url);
const COMMANDS = Object.freeze([...Object.keys(RUNNERS), "dispose", "stop", "roles"]);
const USAGE = "usage: cli.mjs reconcile|retrace|normalize | resume <runId> | dispose <runId> | stop <runId> | stop reconcile|retrace|normalize | stop resume <runId> | roles";
/** Poll interval of a waiting call; time passing never ends a wait. */
const WAIT_POLL_MS = 100;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isStr = (v) => typeof v === "string" && v.trim() !== "";

/** Refusal record (exit 2) with its empty Spend section. `lines` are rendered as a bullet list. */
export function renderRefusal(reason, lines = []) {
  const list = lines.length ? `\n${lines.map((l) => `- ${l}`).join("\n")}\n` : "";
  return `## Controller refused\n\n**Reason:** ${reason}\n${list}\nNothing was launched.\n\n${renderSpend([])}`;
}

const onlyKeys = (o, keys) => Object.keys(o).every((k) => keys.includes(k));

/** Top-level request shape checks (Q1); domain validation belongs to the controller. */
export function requestProblems(command, request) {
  const p = [];
  if (command === "dispose") return request === undefined ? p : [`${command} takes no request body`];
  if (command === "roles") {
    if (request === undefined) return p;
    const m = isObj(request) && onlyKeys(request, ["models"]) ? request.models : undefined;
    const choice = (c) => isObj(c) && onlyKeys(c, ["model", "thinking"]) && ["model", "thinking"].every((k) => c[k] === undefined || isStr(c[k]));
    const ok = isObj(m) && onlyKeys(m, ["a", "b"]) && Object.values(m).every(choice);
    return ok ? p : ['roles body must be {"models": {"a"?: {"model"?, "thinking"?}, "b"?: {...}}} with non-empty strings'];
  }
  if (!isObj(request)) return ["request must be one JSON object on stdin"];
  const models = () => {
    if (request.models !== undefined && !(isObj(request.models) && onlyKeys(request.models, ["a", "b"]) && Object.values(request.models).every(isStr))) {
      p.push('models must be {"a"?: "<selector>:<level>", "b"?: "<selector>:<level>"}');
    }
  };
  const approval = () => {
    if (!isObj(request.approval) || !isStr(request.approval.text) || !isStr(request.approval.at)) p.push("approval must be {text, at}");
  };
  if (command === "reconcile") {
    if (!isStr(request.goal)) p.push("goal must be a non-empty string");
    if (!isObj(request.candidate) || !isStr(request.candidate.identity)) p.push("candidate.identity must be a non-empty string");
    if (!Array.isArray(request.intent) || !request.intent.every(isStr)) p.push("intent must be an array of non-empty strings");
    if (!Array.isArray(request.context)) p.push("context must be an array");
    if (request.mode !== "conversation" && request.mode !== "artifact") p.push("mode must be conversation or artifact");
    if (request.mode === "artifact" && !(isStr(request.candidate?.artifact) && path.isAbsolute(request.candidate.artifact))) p.push("artifact mode needs an absolute candidate.artifact");
    if (request.cap !== "none" && !(Number.isInteger(request.cap) && request.cap > 0)) p.push("cap must be \"none\" or a positive integer");
    if (request.validate !== undefined && !(isObj(request.validate) && Array.isArray(request.validate.argv) && request.validate.argv.length > 0 && request.validate.argv.every(isStr))) p.push("validate must be {argv: [non-empty strings]}");
    approval();
    models();
  } else if (command === "retrace") {
    if (!isStr(request.root)) p.push("root must be a non-empty string");
    for (const k of ["objectives", "constraints", "exclusions"]) if (request[k] === undefined) p.push(`${k} is required`);
    if (!Array.isArray(request.evidence) || !request.evidence.every((e) => isObj(e) && isStr(e.locator) && isStr(e.role))) p.push("evidence must be [{locator, role}]");
    if (!isObj(request.table) || !Array.isArray(request.table.scopes) || request.table.scopes.length === 0) p.push("table.scopes must be a non-empty array");
    approval();
    models();
  } else if (command === "normalize") {
    if (!isStr(request.root)) p.push("root must be a non-empty string");
    for (const k of ["concerns", "input"]) if (request[k] === undefined) p.push(`${k} is required`);
    if (request.models !== undefined) p.push("normalize takes no models; it uses the live model roles");
  } else if (command === "resume") {
    if (!isObj(request.repair) || !isStr(request.repair.authority) || !isStr(request.repair.step)) p.push("repair must be {authority, step}");
  }
  return p;
}

async function readStdin(stream) {
  let text = "";
  for await (const chunk of stream) text += chunk;
  return text;
}

/** Environment for `omp config list --json` and `omp models --json`: the §3.3 child env over a throwaway HOME/TMPDIR. */
async function withRolesEnv(env, fn) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "acp-roles-"));
  try {
    return await fn(childEnv({ home: dir, tmp: dir }, env));
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

/**
 * Runs one CLI invocation and returns `{ exitCode, stdout, settle? }`. When
 * `stdout` is a run's record, `settle()` must be awaited only after `stdout`
 * was written: it removes that run's folder when the run is finished.
 * Every option is injectable for offline tests:
 *   argv            [subcommand, runId?] or [`stop`, runId | kind, runId?]
 *   stdinText       request JSON text (default: read `stdin`)
 *   env             source environment (PATH resolves `omp`)
 *   controllerRoot  package root holding node_modules and package-lock.json
 *   sessionsRoot, tmpRoot, listProcesses, observePid, processStart   preflight and run-claim inputs (Q5)
 *   readModelRoles({ ompPath, env }), readModelCatalog({ ompPath, env }), loadPrompts(PROMPT_SOURCES)
 *   loadController  () => controller module (default: import("./controller.mjs"))
 *   launchWorker    (payload, injected) => { pid }: starts the run's worker
 *                   (default: worker.mjs's detached two-stage spawn, which
 *                   ignores `injected`); `injected` holds listProcesses,
 *                   observePid, processStart and log for an in-process worker
 *   log             diagnostics and notice line sink (default: stderr)
 */
export async function main({
  argv = process.argv.slice(2),
  stdin = process.stdin,
  stdinText,
  env = process.env,
  controllerRoot = CONTROLLER_ROOT,
  sessionsRoot = SESSIONS_ROOT,
  tmpRoot = TMP_ROOT,
  listProcesses = defaultListProcesses,
  observePid = defaultObservePid,
  processStart = defaultProcessStart,
  readModelRoles = defaultReadModelRoles,
  readModelCatalog = defaultReadModelCatalog,
  loadPrompts = defaultLoadPrompts,
  loadController = () => import("./controller.mjs"),
  launchWorker = defaultLaunchWorker,
  log = (line) => process.stderr.write(`${line}\n`),
} = {}) {
  const refuse = (reason, lines) => ({ exitCode: EXIT.refused, stdout: renderRefusal(reason, lines) });
  // This process never owns a run; a run whose body ran in this process (an
  // in-process worker) counts this process as its gone owner.
  const observe = (pid) => (pid === process.pid ? "ESRCH" : observePid(pid));
  const classify = async (runId) => classifyRun({ runId, tmpRoot, processes: processesForRun(await listProcesses(), runId, sessionsRoot), observePid: observe, processStart });
  // After the print: remove the run folder only when the run is finished. A
  // worker that wrote its record is waited for until it has exited.
  const settleFor = (printed) => async () => {
    try {
      for (;;) {
        const verdict = await classify(printed);
        if (verdict.class === "live" && verdict.result) {
          await sleep(WAIT_POLL_MS);
          continue;
        }
        if (verdict.class === "finished") await removePrivateRoot(privateRootFor(printed, tmpRoot));
        return;
      }
    } catch (error) {
      log(`run folder of \`${printed}\` kept: ${error?.message ?? error}`);
    }
  };
  // A run's record, word for word with its exit code (run survival §6).
  const printResult = (runId, result) => ({ exitCode: result.exitCode, stdout: result.markdown, settle: settleFor(runId) });
  const printRecord = (run) => printResult(run.runId, run.result);
  // §4: three stderr lines after the hand-off and on every attach to a live run.
  const notice = (runId, pid, target) => {
    log(`acp-controller: run ${runId} runs in worker PID ${pid}; target: ${String(target).replaceAll("\n", " ")}`);
    log("acp-controller: If this call ends without a record, run this same command again; it attaches to this run and starts nothing.");
    log(`acp-controller: Stop it only on the human's instruction: \`node ${CLI_PATH} stop ${runId}\`.`);
  };

  /**
   * §5: waits with no deadline, observing only the run folder and the worker
   * PID (signal 0), until the record appears (`{ result }`), the run folder is
   * gone (`{ removed }`: never created, or removed after another call printed
   * it) or the worker is observed gone without a record (`{ gone }`). A higher
   * claim whose owner is live (a resume took the run) is followed. With
   * `identity` (a resume's own wait), a record counts only once `run.json`
   * accepted that identity, and no other claim is followed: a resume worker
   * removes the parked record before it adds its identity, and another
   * identity's resume is never waited on (section 1 recheck item 2).
   */
  const waitOn = async (runId, pid, { seen = false, identity } = {}) => {
    const dirs = privateRootFor(runId, tmpRoot);
    let worker = pid;
    let open = identity === undefined;
    const record = async () => {
      open ||= ((await readJsonIfExists(dirs.record).catch(() => undefined))?.identities ?? []).includes(identity);
      return open ? readRunResult(dirs) : undefined;
    };
    for (;;) {
      const result = await record();
      if (result) return { result };
      const present = await exists(dirs.root);
      if (!present && seen) return { removed: true };
      seen ||= present;
      if (observe(worker) === "ESRCH") {
        const again = await record();
        if (again) return { result: again };
        if (!(await exists(dirs.root))) return { removed: true };
        const holder = await readOwnerClaim(dirs.root);
        if (identity === undefined && holder && holder.pid !== worker && (await ownerState(holder, { observePid: observe, processStart })) === "live") {
          worker = holder.pid;
          continue;
        }
        return { gone: true, holder };
      }
      await sleep(WAIT_POLL_MS);
    }
  };
  const printedElsewhere = (runId) => ({ exitCode: EXIT.stopped, stdout: `## Controller run printed elsewhere\n\n**Run**\n\n- run \`${runId}\` ended and its record was already printed by another call, which removed its folder; nothing was started\n\n${renderSpend([])}` });
  // §10: the worker is gone without a record after it published its claim or identity.
  const abandonedRecord = async (runId, why) => {
    const entry = (await scanRuns({ sessionsRoot, tmpRoot, listProcesses, observePid: observe, processStart })).find((r) => r.runId === runId && !r.setup);
    const lines = entry ? abandonedRunLines([entry]) : [`run \`${runId}\``];
    return { exitCode: EXIT.cleanup, stdout: `## Controller run abandoned\n\n**Reason:** ${why}\n\n${lines.map((l) => `- ${l}`).join("\n")}\n\nThe run stays abandoned and refuses new runs until it is disposed.\n\n${renderSpend([])}` };
  };

  const [command, ...args] = argv;
  if (!COMMANDS.includes(command)) return refuse("unknown subcommand", [`${USAGE}; got \`${command ?? ""}\``]);
  // `kind`: the request's command (shape, identity, target); `runId`: the named run.
  let kind = command;
  let runId;
  if (command === "stop") {
    const [first, second, ...rest] = args;
    if (!rest.length && second === undefined && RUN_ID_PATTERN.test(first ?? "")) kind = undefined;
    else if (!rest.length && second === undefined && RUN_KINDS.includes(first)) kind = first;
    else if (!rest.length && first === "resume" && RUN_ID_PATTERN.test(second ?? "")) kind = "resume";
    else return refuse("invalid arguments", [`\`stop\` takes one runId matching ${RUN_ID_PATTERN}, one of ${RUN_KINDS.join("|")}, or \`resume <runId>\``]);
    runId = kind === undefined ? first : second;
  } else {
    const needsRunId = command === "resume" || command === "dispose";
    if (args.length > 1 || (needsRunId ? !RUN_ID_PATTERN.test(args[0] ?? "") : args.length > 0)) {
      return refuse("invalid arguments", [needsRunId ? `\`${command}\` needs one runId matching ${RUN_ID_PATTERN}` : `\`${command}\` takes no positional arguments`]);
    }
    runId = args[0];
  }

  const readBody = command === "roles" ? !stdin.isTTY : command !== "dispose" && kind !== undefined;
  const text = stdinText ?? (readBody ? await readStdin(stdin) : "");
  let request;
  if (text.trim() !== "") {
    try {
      request = JSON.parse(text);
    } catch (error) {
      return refuse("invalid request", [`stdin is not JSON: ${error.message}`]);
    }
  }
  const problems = kind === undefined ? (request === undefined ? [] : ["`stop <runId>` takes no request body"]) : requestProblems(kind, request);
  if (problems.length) return refuse("invalid request", problems);

  // §9: `stop` judges only its own run, launches nothing and never signals.
  if (command === "stop") {
    let target = runId;
    if (kind !== "resume" && kind !== undefined) {
      const runs = await scanRuns({ sessionsRoot, tmpRoot, listProcesses, observePid: observe, processStart });
      const match = matchRequest(runs, { kind, identity: requestIdentity(kind, request), target: requestTarget(kind, request) });
      if (match.runs.length > 1) return refuse("several matching runs", [...match.runs.map((r) => `run \`${r.runId}\` (${r.class}) matches this request by ${match.by}`), "nothing was stopped; the human decides which run to stop"]);
      if (!match.runs.length) return refuse("no run to stop", ["no live, parked, finished or abandoned run matches this request by identity or target"]);
      target = match.runs[0].runId;
    }
    return stopRun(target);
  }

  /** `stop` on one run, by its class (run survival §3 `stop` column). */
  async function stopRun(id) {
    const dirs = privateRootFor(id, tmpRoot);
    for (;;) {
      if (!(await exists(dirs.root))) return refuse("no run to stop", [`there is no run \`${id}\``]);
      const verdict = await classify(id);
      if (verdict.class === "parked" || verdict.class === "finished") return printRecord({ runId: id, result: verdict.result });
      if (verdict.class === "abandoned") {
        if (verdict.result?.exitCode === EXIT.cleanup) return { exitCode: EXIT.cleanup, stdout: verdict.result.markdown };
        return abandonedRecord(id, `run \`${id}\` is abandoned (${verdict.reason}); nothing was stopped and nothing was removed`);
      }
      if ((await writeStopRequest(dirs)) === "missing") continue;
      log(`acp-controller: asked run ${id} (worker PID ${verdict.holder.pid}) to stop; waiting for its stopped record`);
      const waited = await waitOn(id, verdict.holder.pid, { seen: true });
      if (waited.result) return printResult(id, waited.result);
      if (waited.removed) return printedElsewhere(id);
      // The worker is gone: act on the run's class without waiting again.
    }
  }

  const versions = await checkVersions({ controllerRoot, pathEnv: env.PATH });
  if (!versions.ok) {
    return refuse("version pin", [
      ...versions.mismatches.map((m) => `${m.name}: observed \`${m.observed}\`, expected \`${m.expected}\``),
      "procedure: .config/agents/skills/bump-omp/SKILL.md",
    ]);
  }
  const ompPath = versions.ompPath;

  // The catalog is read only when a per-run model change is asked for.
  const choosing = command === "roles" ? request !== undefined : (command === "reconcile" || command === "retrace") && request.models !== undefined;
  const read = await withRolesEnv(env, async (rolesEnv) => {
    const roles = await readModelRoles({ ompPath, env: rolesEnv });
    return { roles, catalog: roles.ok && choosing ? await readModelCatalog({ ompPath, env: rolesEnv }) : undefined };
  });
  const { roles } = read;
  if (!roles.ok) return refuse("model role", [roles.reason]);
  let models = roles.roles;
  if (choosing) {
    const reason = command === "roles" ? "model choice" : "model override";
    if (!read.catalog.ok) return refuse(reason, [read.catalog.reason]);
    const chosen = command === "roles" ? resolveModelChoice(request.models, roles.roles, read.catalog.models) : applyModelOverride(request.models, roles.roles, read.catalog.models);
    if (!chosen.ok) return refuse(reason, chosen.problems);
    models = chosen.roles;
  }

  const loaded = await loadPrompts(PROMPT_SOURCES);
  if (!loaded.ok) return refuse("missing prompt marker", loaded.problems);

  let runs = [];
  if (runId === undefined) {
    runs = await scanRuns({ sessionsRoot, tmpRoot, listProcesses, observePid: observe, processStart });
    const abandoned = runs.filter((r) => r.class === "abandoned");
    if (command !== "roles") {
      const match = matchRequest(runs, { kind: command, identity: requestIdentity(command, request), target: requestTarget(command, request) });
      if (match.runs.length > 1) return refuse("several matching runs", [...match.runs.map((r) => `run \`${r.runId}\` (${r.class}) matches this request by ${match.by}`), "nothing was launched; the human decides which run to keep"]);
      const [matched] = match.runs;
      if (matched?.class === "live") {
        if (match.by === "target") return refuse("run for the same target", [`run \`${matched.runId}\` is live (owner PID ${matched.holder.pid}) and works on this target with a different request`]);
        // The same request again attaches to the live run and starts nothing.
        notice(matched.runId, matched.holder.pid, matched.record.target);
        return finishWait(matched.runId, matched.holder.pid, { seen: true });
      }
      if (matched?.class === "parked" || matched?.class === "finished") {
        if (match.by === "identity") return printRecord(matched);
        const ways =
          matched.class === "parked"
            ? [`resume it: \`cli.mjs resume ${matched.runId}\` with {"repair": {"authority": "<human words>", "step": "<parked failed step>"}}`, `or dispose it only on the human's explicit instruction: \`cli.mjs dispose ${matched.runId}\``]
            : printWays(matched.runId);
        return refuse("run for the same target", [`run \`${matched.runId}\` (${matched.class}) works on this target with a different request`, ...ways]);
      }
    }
    if (abandoned.length) return refuse("abandoned controller run", abandonedRunLines(abandoned));
  }

  if (command === "roles") return { exitCode: EXIT.final, stdout: `${renderModels(models, roles.roles)}${renderRunList(runs)}` };
  if (!(await processStart(process.pid))) return refuse(OWN_START_UNREADABLE, [ownStartReason(process.pid)]);

  const controller = await loadController();
  // Data only: this crosses the hand-off to the worker as JSON (run survival §1).
  const data = { ompPath, roles: models, prompts: loaded.prompts, promptSources: loaded.sources, controllerRoot, repoRoot: process.cwd(), overlayPath: OVERLAY_PATH, sessionsRoot, tmpRoot, env };
  if (command === "dispose") {
    const out = await controller.disposeRun(runId, { ...data, listProcesses, observePid, processStart, log });
    return { exitCode: out.exitCode, stdout: out.markdown };
  }

  // The controller's own checks run here; a preflight call creates and claims nothing.
  const callerDeps = { ...data, listProcesses, observePid: observe, processStart, log, preflight: true };
  const preflight = (id) => RUNNERS[command](controller, request, callerDeps, id);
  const startRunId = runId ?? newRunId(command);
  const pre = await preflight(startRunId);
  if (pre.attach) {
    notice(pre.attach.runId, pre.attach.pid, pre.attach.target);
    return finishWait(pre.attach.runId, pre.attach.pid, { seen: true });
  }
  if (!pre.handOff) return { exitCode: pre.exitCode, stdout: pre.markdown, ...(pre.printedRun ? { settle: settleFor(pre.printedRun) } : {}) };

  // A resume's own claim is the first claim above the one it found.
  const before = command === "resume" ? await readOwnerClaim(privateRootFor(startRunId, tmpRoot).root) : undefined;
  const { pid } = await launchWorker({ command, runId: startRunId, request, deps: data }, { listProcesses, observePid, processStart, log });
  const workerStart = await processStart(pid);
  notice(startRunId, pid, requestTarget(command, request, startRunId));
  return finishWait(startRunId, pid, { seen: command === "resume", resume: command === "resume" ? { before, pid, workerStart, identity: requestIdentity(command, request, startRunId) } : undefined });

  /** The waiting call's outcome (run survival §5, §10). */
  async function finishWait(id, workerPid, { seen, resume } = {}) {
    for (;;) {
      const waited = await waitOn(id, workerPid, { seen, identity: resume?.identity });
      if (waited.result) return printResult(id, waited.result);
      if (waited.removed) {
        if (seen) return printedElsewhere(id);
        return refuse("worker ended before the run started", [`the worker (PID ${workerPid}) for run \`${id}\` ended before it created the run folder; nothing was launched`]);
      }
      const h = waited.holder;
      const claimedByWorker = !resume || (h && h.index > (resume.before?.index ?? -1) && h.pid === resume.pid && (!resume.workerStart || h.lstart === resume.workerStart));
      if (claimedByWorker) return abandonedRecord(id, `the worker (PID ${workerPid}) of run \`${id}\` ended without a record`);
      // A resume worker that wrote no claim leaves the run unchanged: recheck as §1 does.
      const again = await preflight(id);
      if (again.attach) {
        workerPid = again.attach.pid;
        resume = undefined;
        continue;
      }
      if (again.handOff) return refuse("resume did not start", [`the resume worker (PID ${workerPid}) of run \`${id}\` ended without taking the run; run \`${id}\` is unchanged`]);
      return { exitCode: again.exitCode, stdout: again.markdown, ...(again.printedRun ? { settle: settleFor(again.printedRun) } : {}) };
    }
  }
}

if (process.argv[1] && (await fs.realpath(process.argv[1])) === fileURLToPath(import.meta.url)) {
  try {
    const out = await main();
    await new Promise((resolve, reject) => process.stdout.write(out.stdout, (error) => (error ? reject(error) : resolve())));
    process.exitCode = out.exitCode;
    await out.settle?.();
  } catch (error) {
    // An unexpected throw cannot establish disposal, so it is a cleanup failure.
    process.stderr.write(`controller failure: ${error?.stack ?? error}\n`);
    process.stdout.write(`## Controller failed\n\n**Reason:** ${error?.message ?? String(error)}\n\nDisposal was not established; run preflight again before a new run.\n`);
    process.exitCode = EXIT.cleanup;
  }
}
