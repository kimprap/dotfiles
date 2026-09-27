#!/usr/bin/env node
// Reconcile/Retrace ACP controller entry point (spec-v3 §5 Q1):
//   node cli.mjs reconcile|retrace|normalize < request.json
//   node cli.mjs resume <runId> < request.json
//   node cli.mjs dispose <runId>
//   node cli.mjs roles
// stdout: the rendered Markdown record only, except that a successful `roles`
// prints only the one-line models note; stderr: diagnostics.
// Exit: 0 final/complete, 1 stopped/partial/blocked/parked, 2 refused before
// any launch, 3 cleanup failure.
//
// Refusals run in this order before anything is launched: request shape,
// checkVersions, readModelRoles, loadPrompts, findUndisposedRuns. Only then is
// ./controller.mjs imported and called. `roles` runs the same checks except
// request shape, then prints the models note without importing the controller.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONTROLLER_ROOT, OVERLAY_PATH } from "./lib/adapter.mjs";
import { childEnv, RUN_ID_PATTERN, SESSIONS_ROOT, TMP_ROOT } from "./lib/env.mjs";
import { readModelRoles as defaultReadModelRoles, renderModels } from "./lib/models.mjs";
import { findUndisposedRuns, listProcesses as defaultListProcesses } from "./lib/preflight.mjs";
import { loadPrompts as defaultLoadPrompts, PROMPT_SOURCES } from "./lib/prompts.mjs";
import { renderSpend } from "./lib/spend.mjs";
import { checkVersions } from "./lib/versions.mjs";

export const EXIT = Object.freeze({ final: 0, stopped: 1, refused: 2, cleanup: 3 });

const RUNNERS = Object.freeze({
  reconcile: (c, req, deps) => c.runReconcile(req, deps),
  retrace: (c, req, deps) => c.runRetrace(req, deps),
  normalize: (c, req, deps) => c.runNormalize(req, deps),
  resume: (c, req, deps, runId) => c.resumeReconcile(runId, req, deps),
  dispose: (c, _req, deps, runId) => c.disposeRun(runId, deps),
});

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isStr = (v) => typeof v === "string" && v.trim() !== "";

/** Refusal record (exit 2) with its empty Spend section. `lines` are rendered as a bullet list. */
export function renderRefusal(reason, lines = []) {
  const list = lines.length ? `\n${lines.map((l) => `- ${l}`).join("\n")}\n` : "";
  return `## Controller refused\n\n**Reason:** ${reason}\n${list}\nNothing was launched.\n\n${renderSpend([])}`;
}

/** Top-level request shape checks (Q1); domain validation belongs to the controller. */
export function requestProblems(command, request) {
  const p = [];
  if (command === "dispose" || command === "roles") return request === undefined ? p : [`${command} takes no request body`];
  if (!isObj(request)) return ["request must be one JSON object on stdin"];
  const approval = () => {
    if (!isObj(request.approval) || !isStr(request.approval.text) || !isStr(request.approval.at)) p.push("approval must be {text, at}");
  };
  if (command === "reconcile") {
    if (!isStr(request.goal)) p.push("goal must be a non-empty string");
    if (!isObj(request.candidate) || !isStr(request.candidate.identity)) p.push("candidate.identity must be a non-empty string");
    if (!Array.isArray(request.context)) p.push("context must be an array");
    if (request.mode !== "conversation" && request.mode !== "artifact") p.push("mode must be conversation or artifact");
    if (request.mode === "artifact" && !(isStr(request.candidate?.artifact) && path.isAbsolute(request.candidate.artifact))) p.push("artifact mode needs an absolute candidate.artifact");
    if (request.cap !== "none" && !(Number.isInteger(request.cap) && request.cap > 0)) p.push("cap must be \"none\" or a positive integer");
    if (request.validate !== undefined && !(isObj(request.validate) && Array.isArray(request.validate.argv) && request.validate.argv.length > 0 && request.validate.argv.every(isStr))) p.push("validate must be {argv: [non-empty strings]}");
    approval();
  } else if (command === "retrace") {
    if (!isStr(request.root)) p.push("root must be a non-empty string");
    for (const k of ["objectives", "constraints", "exclusions"]) if (request[k] === undefined) p.push(`${k} is required`);
    if (!Array.isArray(request.evidence) || !request.evidence.every((e) => isObj(e) && isStr(e.locator) && isStr(e.role))) p.push("evidence must be [{locator, role}]");
    if (!isObj(request.table) || !Array.isArray(request.table.scopes) || request.table.scopes.length === 0) p.push("table.scopes must be a non-empty array");
    approval();
  } else if (command === "normalize") {
    if (!isStr(request.root)) p.push("root must be a non-empty string");
    for (const k of ["concerns", "input"]) if (request[k] === undefined) p.push(`${k} is required`);
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

/** Environment for `omp config list --json`: the §3.3 child env over a throwaway HOME/TMPDIR. */
async function withRolesEnv(env, fn) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "acp-roles-"));
  try {
    return await fn(childEnv({ home: dir, tmp: dir }, env));
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

/**
 * Runs one CLI invocation and returns `{ exitCode, stdout }`.
 * Every option is injectable for offline tests:
 *   argv            [subcommand, runId?]
 *   stdinText       request JSON text (default: read `stdin`)
 *   env             source environment (PATH resolves `omp`)
 *   controllerRoot  package root holding node_modules and package-lock.json
 *   sessionsRoot, tmpRoot, listProcesses   preflight inputs (Q5)
 *   readModelRoles({ ompPath, env }), loadPrompts(PROMPT_SOURCES)
 *   loadController  () => controller module (default: import("./controller.mjs"))
 *   log             diagnostics line sink (default: stderr)
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
  readModelRoles = defaultReadModelRoles,
  loadPrompts = defaultLoadPrompts,
  loadController = () => import("./controller.mjs"),
  log = (line) => process.stderr.write(`${line}\n`),
} = {}) {
  const refuse = (reason, lines) => ({ exitCode: EXIT.refused, stdout: renderRefusal(reason, lines) });

  const [command, runId, ...extra] = argv;
  if (command !== "roles" && !Object.hasOwn(RUNNERS, command)) return refuse("unknown subcommand", [`usage: cli.mjs reconcile|retrace|normalize | resume <runId> | dispose <runId> | roles; got \`${command ?? ""}\``]);
  const needsRunId = command === "resume" || command === "dispose";
  if (extra.length || (needsRunId ? !RUN_ID_PATTERN.test(runId ?? "") : runId !== undefined)) {
    return refuse("invalid arguments", [needsRunId ? `\`${command}\` needs one runId matching ${RUN_ID_PATTERN}` : `\`${command}\` takes no positional arguments`]);
  }

  const text = stdinText ?? (command === "dispose" || command === "roles" ? "" : await readStdin(stdin));
  let request;
  if (text.trim() !== "") {
    try {
      request = JSON.parse(text);
    } catch (error) {
      return refuse("invalid request", [`stdin is not JSON: ${error.message}`]);
    }
  }
  const problems = requestProblems(command, request);
  if (problems.length) return refuse("invalid request", problems);

  const versions = await checkVersions({ controllerRoot, pathEnv: env.PATH });
  if (!versions.ok) {
    return refuse("version pin", [
      ...versions.mismatches.map((m) => `${m.name}: observed \`${m.observed}\`, expected \`${m.expected}\``),
      "procedure: .config/agents/skills/omp-update/SKILL.md",
    ]);
  }
  const ompPath = versions.ompPath;

  const roles = await withRolesEnv(env, (rolesEnv) => readModelRoles({ ompPath, env: rolesEnv }));
  if (!roles.ok) return refuse("model role", [roles.reason]);

  const loaded = await loadPrompts(PROMPT_SOURCES);
  if (!loaded.ok) return refuse("missing prompt marker", loaded.problems);

  const undisposed = await findUndisposedRuns({ sessionsRoot, tmpRoot, listProcesses, exceptRunId: needsRunId ? runId : undefined });
  if (undisposed.refuse) {
    return refuse("undisposed controller run", [
      ...undisposed.folders.map((f) => `folder \`${f}\``),
      ...undisposed.processes.map((p) => `process ${p.pid}: \`${p.command}\``),
      "dispose that run first (`cli.mjs dispose <runId>` or its existing disposal authority)",
    ]);
  }

  if (command === "roles") return { exitCode: EXIT.final, stdout: renderModels(roles.roles) };

  const controller = await loadController();
  const deps = {
    ompPath,
    roles: roles.roles,
    prompts: loaded.prompts,
    promptSources: loaded.sources,
    controllerRoot,
    overlayPath: OVERLAY_PATH,
    sessionsRoot,
    tmpRoot,
    env,
    listProcesses,
    log,
  };
  const out = await RUNNERS[command](controller, request, deps, runId);
  return { exitCode: out.exitCode, stdout: out.markdown };
}

if (process.argv[1] && (await fs.realpath(process.argv[1])) === fileURLToPath(import.meta.url)) {
  try {
    const out = await main();
    process.stdout.write(out.stdout);
    process.exitCode = out.exitCode;
  } catch (error) {
    // An unexpected throw cannot establish disposal, so it is a cleanup failure.
    process.stderr.write(`controller failure: ${error?.stack ?? error}\n`);
    process.stdout.write(`## Controller failed\n\n**Reason:** ${error?.message ?? String(error)}\n\nDisposal was not established; run preflight again before a new run.\n`);
    process.exitCode = EXIT.cleanup;
  }
}
