#!/usr/bin/env node
// OMP kill-scope check for bump-omp (run survival §11). No model is called.
//
//   node kill-scope-check.mjs            prepares a new /tmp/acp-killscope-* folder
//                                        and prints one command on stdout
//   node kill-scope-check.mjs verify <dir>
//                                        prints the scripted log's starts (sessions
//                                        created) per reviewer, agent exits, the
//                                        runs seen and what is left in the run and
//                                        session roots; exit 0 only on pass
//
// The folder holds a fake `omp` (prints the pinned version, answers
// `config list --json` with scripted roles, runs the scripted ACP agent for
// `acp`), a scripted plan whose first reviewer turn takes about 20 seconds, a
// conversation request, run and session roots, and `caller.mjs`, which runs
// the CLI's `main` with those roots and the real detached worker. The printed
// command runs `reconcile` through `caller.mjs` with the request file on
// stdin; it ends with the final record (exit 0) after about 20 seconds.
// The check passes when a new OMP's `bash` kill (timeout 5) leaves the worker
// running and the same command again (timeout 0) prints that final record.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { privateRootFor, socketDirFor } from "../../lib/env.mjs";
import { OMP_VERSION } from "../../lib/versions.mjs";
import { createScriptedLauncher } from "./scripted-acp-agent.mjs";

const SELF = fileURLToPath(import.meta.url);
const CLI_URL = new URL("../../cli.mjs", import.meta.url).href;
const PREFIX = "/tmp/acp-killscope-";
const q = (s) => `'${String(s).replaceAll("'", "'\\''")}'`;

const y = (data) => `yield:${JSON.stringify(data)}`;
const VALID = y({ kind: "review", verdict: "VALID", summary: ["Accepts the proposal"], blocking_issues: [], revision: "none" });
const REVISE = y({ kind: "review", verdict: "REVISE", summary: ["Misses the stated goal"], blocking_issues: ["the proposal misses the goal"], correction: { replacement: "Use one column." }, preserve: [] });
// A initial (about 20 s), A rethink REVISE, B initial and rethink, A closure: both reviewers start once.
const PLAN = { "scripted/a": [`slow:20000:${VALID}`, REVISE, VALID], "scripted/b": [VALID, VALID] };
const ROLES = { modelRoles: { value: { second_opinion_a: "scripted/a:low", second_opinion_b: "scripted/b:low" } } };
const REQUEST = {
  goal: "Choose the page layout",
  candidate: { identity: "kill-scope check", text: "Use two columns." },
  intent: ["The human wants a layout that works on phones."],
  context: ["The page is read on phones."],
  mode: "conversation",
  cap: "none",
  approval: { text: "Approved as written.", at: "2026-10-07T00:00:00Z" },
};

const CALLER = (dir) => `// One controller call with this folder's roots and the real detached worker.
import { main } from ${JSON.stringify(CLI_URL)};
const out = await main({
  argv: process.argv.slice(2),
  env: { ...process.env, PATH: ${JSON.stringify(path.join(dir, "bin"))} + ":" + process.env.PATH },
  sessionsRoot: ${JSON.stringify(path.join(dir, "sessions"))},
  tmpRoot: ${JSON.stringify(path.join(dir, "runs"))},
});
await new Promise((resolve) => process.stdout.write(out.stdout, resolve));
process.exitCode = out.exitCode;
await out.settle?.();
`;

function prepare() {
  const dir = fs.mkdtempSync(PREFIX);
  for (const sub of ["bin", "sessions", "runs"]) fs.mkdirSync(path.join(dir, sub));
  const plan = path.join(dir, "plan.json");
  const log = path.join(dir, "scripted.log");
  fs.writeFileSync(plan, JSON.stringify(PLAN));
  const launcher = createScriptedLauncher({ dir, plan, log });
  fs.writeFileSync(
    path.join(dir, "bin", "omp"),
    `#!/bin/sh\nif [ "$1" = "--version" ]; then echo ${q(OMP_VERSION)}; exit 0; fi\nif [ "$1" = "config" ]; then echo ${q(JSON.stringify(ROLES))}; exit 0; fi\nexec ${q(launcher)} "$@"\n`,
    { mode: 0o755 },
  );
  fs.writeFileSync(path.join(dir, "request.json"), `${JSON.stringify(REQUEST, null, 2)}\n`);
  fs.writeFileSync(path.join(dir, "caller.mjs"), CALLER(dir));
  process.stdout.write(`node ${path.join(dir, "caller.mjs")} reconcile < ${path.join(dir, "request.json")}\n`);
}

function verify(dir) {
  if (!dir || !path.resolve(dir).startsWith(PREFIX) || !fs.existsSync(path.join(dir, "caller.mjs"))) {
    process.stderr.write(`usage: node kill-scope-check.mjs verify ${PREFIX}<suffix>\n`);
    return 2;
  }
  const events = fs.existsSync(path.join(dir, "scripted.log"))
    ? fs.readFileSync(path.join(dir, "scripted.log"), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l))
    : [];
  // acpx creates each reviewer's session in one process and serves it from its queue owner, so a
  // reviewer start is one `session-new`; a second start of the same reviewer would add another.
  const starts = (model) => events.filter((e) => e.event === "session-new" && e.model === model).length;
  const runs = fs.readdirSync(path.join(dir, "runs"));
  const sessions = fs.readdirSync(path.join(dir, "sessions"));
  const runIds = [...new Set(events.filter((e) => e.event === "start" && e.run?.runId).map((e) => e.run.runId))];
  const sockets = runIds.map((id) => socketDirFor(privateRootFor(id, path.join(dir, "runs")).home)).filter((s) => fs.existsSync(s));
  const exited = new Set(events.filter((e) => e.event === "exit").map((e) => e.pid));
  const running = events.filter((e) => e.event === "start" && !exited.has(e.pid)).map((e) => e.pid);
  const checks = [
    [`reviewer A starts (sessions created): ${starts("scripted/a")}`, starts("scripted/a") === 1],
    [`reviewer B starts (sessions created): ${starts("scripted/b")}`, starts("scripted/b") === 1],
    [`agent processes without an exit: ${running.length ? running.join(", ") : "none"}`, running.length === 0],
    [`runs seen by the reviewers: ${runIds.length ? runIds.join(", ") : "none"}`, runIds.length === 1],
    [`run root entries: ${runs.length ? runs.join(", ") : "none"}`, runs.length === 0],
    [`session root entries: ${sessions.length ? sessions.join(", ") : "none"}`, sessions.length === 0],
    [`acpx socket folders left: ${sockets.length ? sockets.join(", ") : "none"}`, sockets.length === 0],
  ];
  for (const [line, ok] of checks) process.stdout.write(`${ok ? "pass" : "FAIL"}: ${line}\n`);
  const pass = checks.every(([, ok]) => ok);
  process.stdout.write(`${pass ? "kill-scope check: pass" : "kill-scope check: FAIL"}\n`);
  return pass ? 0 : 1;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === SELF) {
  if (process.argv[2] === "verify") process.exitCode = verify(process.argv[3]);
  else if (process.argv.length === 2) prepare();
  else {
    process.stderr.write("usage: node kill-scope-check.mjs [verify <dir>]\n");
    process.exitCode = 2;
  }
}
