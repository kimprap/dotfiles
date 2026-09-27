// Refusals before any launch: undisposed-run preflight (spec-v3 §5 Q5) and
// version pins (Q4). "Nothing launched" is observed three ways: the scripted
// agent's log never appears, the fake `omp` is only asked for `--version`,
// and the controller module is never loaded.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { main } from "../cli.mjs";
import { CONTROLLER_ROOT } from "../lib/adapter.mjs";
import { findUndisposedRuns } from "../lib/preflight.mjs";
import { ACP_SDK_VERSION, ACPX_VERSION, OMP_VERSION } from "../lib/versions.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

const TRIAL_PREFIX = "acpx-" + "trial-"; // built so no controller file names the trial bundle
const RUN_X = "reconcile-20260927T010203Z-abc123";
const RUN_Y = "retrace-20260927T020304Z-def456";

const REQUEST = JSON.stringify({
  goal: "Decide the layout",
  candidate: { identity: "layout v1", text: "Use two columns." },
  context: [],
  mode: "conversation",
  cap: "none",
  approval: { text: "go", at: "2026-09-27T01:00:00Z" },
});

let t; // per-test fixture

/** Fake `omp`: prints `version` for `--version`, invocations logged; anything else execs the scripted agent. */
function fakeOmp(dir, version, launcher) {
  const bin = path.join(dir, "bin");
  fs.mkdirSync(bin, { recursive: true });
  const calls = path.join(dir, "omp-calls.log");
  fs.writeFileSync(
    path.join(bin, "omp"),
    `#!/bin/sh\necho "$*" >> '${calls}'\nif [ "$1" = "--version" ]; then echo '${version}'; exit 0; fi\nexec '${launcher}' "$@"\n`,
    { mode: 0o755 },
  );
  return { pathEnv: `${bin}:/usr/bin:/bin`, calls };
}

beforeEach(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "acpctl-test-"));
  const sessionsRoot = path.join(dir, "sessions");
  const tmpRoot = path.join(dir, "tmp");
  fs.mkdirSync(sessionsRoot);
  fs.mkdirSync(tmpRoot);
  const plan = path.join(dir, "plan.json");
  fs.writeFileSync(plan, "{}");
  const log = path.join(dir, "scripted.log");
  const launcher = createScriptedLauncher({ dir, plan, log });
  t = { dir, sessionsRoot, tmpRoot, log, launcher, controllerLoaded: false };
});

afterEach(() => {
  fs.rmSync(t.dir, { recursive: true, force: true });
});

/**
 * One CLI run with injected roots and prompts. With `stubRoles: false` the real
 * readModelRoles runs, so reaching it would start the scripted agent via the fake omp.
 */
async function run({ version = OMP_VERSION, controllerRoot = CONTROLLER_ROOT, processes = [], stubRoles = true, argv = ["reconcile"] } = {}) {
  const omp = fakeOmp(t.dir, version, t.launcher);
  const out = await main({
    argv,
    stdinText: argv[0] === "dispose" || argv[0] === "roles" ? "" : REQUEST,
    env: { PATH: omp.pathEnv },
    controllerRoot,
    sessionsRoot: t.sessionsRoot,
    tmpRoot: t.tmpRoot,
    listProcesses: async () => processes,
    ...(stubRoles ? { readModelRoles: async () => ({ ok: true, roles: { a: { model: "scripted/a", thinking: "low" }, b: { model: "scripted/b", thinking: "low" } } }) } : {}),
    loadPrompts: async () => ({ ok: true, prompts: { reviewer: {}, scope: {} }, sources: {} }),
    loadController: async () => {
      t.controllerLoaded = true;
      return { runReconcile: async () => ({ exitCode: 0, markdown: "ran\n" }), disposeRun: async () => ({ exitCode: 0, markdown: "disposed\n" }) };
    },
    log: () => {},
  });
  const calls = fs.existsSync(omp.calls) ? fs.readFileSync(omp.calls, "utf8").trim().split("\n") : [];
  return { ...out, calls };
}

function assertNothingLaunched(out) {
  assert.equal(out.exitCode, 2);
  assert.match(out.stdout, /^## Controller refused/);
  assert.equal(fs.existsSync(t.log), false, "scripted agent must never start");
  assert.equal(t.controllerLoaded, false, "controller must never be loaded");
  assert.ok(out.calls.every((c) => c === "--version"), `omp was only asked for its version: ${out.calls}`);
}

const controllerProcess = (pid, sessionsRoot, runId) => ({
  pid,
  command: ["/opt/tools/bin/omp", "acp", "--model", "m", "--session-dir", path.join(sessionsRoot, `acp-controller-${runId}`)].join(" "),
});

test("preflight: an acp-controller session folder refuses with exit 2 and launches nothing", async () => {
  const folder = path.join(t.sessionsRoot, `acp-controller-${RUN_X}`);
  fs.mkdirSync(folder);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes(folder), "refusal names the folder");
  assert.match(out.stdout, /dispose/);
});

test("preflight: an acp-controller private root refuses with exit 2", async () => {
  const root = path.join(t.tmpRoot, `acp-controller-${RUN_X}`);
  fs.mkdirSync(root);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes(root));
});

test("preflight: a live ` acp ` process on a controller session dir refuses and names its PID", async () => {
  const out = await run({ processes: [controllerProcess(424242, t.sessionsRoot, RUN_X)] });
  assertNothingLaunched(out);
  assert.match(out.stdout, /process 424242:/);
});

test("preflight: trial-shaped folders and processes do not refuse", async () => {
  fs.mkdirSync(path.join(t.sessionsRoot, `${TRIAL_PREFIX}20260926-x`));
  fs.mkdirSync(path.join(t.tmpRoot, `${TRIAL_PREFIX}root`));
  const trialProcess = {
    pid: 56135,
    command: ["/opt/tools/bin/omp", "acp", "--session-dir", path.join(t.sessionsRoot, `${TRIAL_PREFIX}20260926-x`)].join(" "),
  };
  const result = await findUndisposedRuns({ sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, listProcesses: async () => [trialProcess] });
  assert.deepEqual(result, { refuse: false, folders: [], processes: [] });
  const out = await run({ processes: [trialProcess] });
  assert.equal(out.exitCode, 0);
  assert.equal(t.controllerLoaded, true);
});

test("preflight: a controller-prefixed session dir without ` acp ` is not a live run", async () => {
  const other = { pid: 7, command: `/usr/bin/tail -f --session-dir ${path.join(t.sessionsRoot, `acp-controller-${RUN_X}`)}` };
  const result = await findUndisposedRuns({ sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, listProcesses: async () => [other] });
  assert.equal(result.refuse, false);
});

test("preflight: exceptRunId exempts only its own run's folders", async () => {
  for (const root of [t.sessionsRoot, t.tmpRoot]) for (const id of [RUN_X, RUN_Y]) fs.mkdirSync(path.join(root, `acp-controller-${id}`));
  const both = await findUndisposedRuns({ sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, listProcesses: async () => [], exceptRunId: RUN_X });
  assert.equal(both.refuse, true);
  assert.deepEqual(both.folders, [path.join(t.sessionsRoot, `acp-controller-${RUN_Y}`), path.join(t.tmpRoot, `acp-controller-${RUN_Y}`)]);

  for (const root of [t.sessionsRoot, t.tmpRoot]) fs.rmdirSync(path.join(root, `acp-controller-${RUN_Y}`));
  const own = await run({ argv: ["dispose", RUN_X] });
  assert.equal(own.exitCode, 0, "its own parked folders do not block dispose");
  assert.equal(t.controllerLoaded, true);
});

test("preflight: exceptRunId does not exempt a live process of that run", async () => {
  fs.mkdirSync(path.join(t.sessionsRoot, `acp-controller-${RUN_X}`));
  const out = await run({ argv: ["dispose", RUN_X], processes: [controllerProcess(515151, t.sessionsRoot, RUN_X)] });
  assertNothingLaunched(out);
  assert.match(out.stdout, /process 515151:/);
  assert.ok(!out.stdout.includes("folder `"), "its own folder is not listed");
});

test("roles: prints only the models note and never loads the controller", async () => {
  const out = await run({ argv: ["roles"] });
  assert.equal(out.exitCode, 0);
  assert.equal(out.stdout, "Models: A `scripted/a` · low, B `scripted/b` · low\n");
  assert.equal(fs.existsSync(t.log), false, "scripted agent must never start");
  assert.equal(t.controllerLoaded, false, "controller must never be loaded");
});

test("roles: an undisposed run refuses before any brief is shown", async () => {
  fs.mkdirSync(path.join(t.sessionsRoot, `acp-controller-${RUN_X}`));
  const out = await run({ argv: ["roles"] });
  assertNothingLaunched(out);
  assert.match(out.stdout, /undisposed controller run/);
});

test("A9: a PATH omp reporting omp/18.2.0 refuses before any launch", async () => {
  const out = await run({ version: "omp/18.2.0", stubRoles: false });
  assertNothingLaunched(out);
  assert.match(out.stdout, new RegExp(`omp --version: observed \`omp/18\\.2\\.0\`, expected \`${escapeRegExp(OMP_VERSION)}\``));
  assert.deepEqual(out.calls, ["--version"]);
});

test("A9: a controller root with acpx 0.19.1 refuses before any launch", async () => {
  const root = path.join(t.dir, "root");
  const pkg = (name, version) => {
    fs.mkdirSync(path.join(root, "node_modules", name), { recursive: true });
    fs.writeFileSync(path.join(root, "node_modules", name, "package.json"), JSON.stringify({ name, version }));
  };
  pkg("acpx", "0.19.1");
  pkg("@agentclientprotocol/sdk", ACP_SDK_VERSION);
  fs.writeFileSync(
    path.join(root, "package-lock.json"),
    JSON.stringify({ packages: { "node_modules/acpx": { version: "0.19.1" }, "node_modules/@agentclientprotocol/sdk": { version: ACP_SDK_VERSION } } }),
  );
  const out = await run({ controllerRoot: root, stubRoles: false });
  assertNothingLaunched(out);
  assert.match(out.stdout, new RegExp(`acpx installed: observed \`0\\.19\\.1\`, expected \`${escapeRegExp(ACPX_VERSION)}\``));
  assert.match(out.stdout, new RegExp(`acpx locked: observed \`0\\.19\\.1\`, expected \`${escapeRegExp(ACPX_VERSION)}\``));
  assert.doesNotMatch(out.stdout, /agentclientprotocol/);
});
