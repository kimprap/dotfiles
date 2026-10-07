// Refusals before any launch: abandoned-run preflight (spec-v3 §5 Q5) and
// version pins (Q4), plus the run claim and abandoned-run disposal that
// `resume`/`dispose <runId>` perform instead of the preflight. "Nothing
// launched" is observed three ways: the scripted agent's log never appears,
// the fake `omp` is only asked for `--version`, and the controller module is
// never loaded. Process presence and start times are injected (`t.alive`;
// this process's own start time is `t.selfStart`).
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { main } from "../cli.mjs";
import { disposeRun, HAND_OFF, resumeReconcile, STOPPED_CAUSE } from "../controller.mjs";
import { CONTROLLER_ROOT } from "../lib/adapter.mjs";
import { liveCwdFolderFor } from "../lib/env.mjs";
import { findAbandonedRuns, requestIdentity, requestTarget } from "../lib/preflight.mjs";
import { ACP_SDK_VERSION, ACPX_VERSION, OMP_VERSION } from "../lib/versions.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

const TRIAL_PREFIX = "acpx-" + "trial-"; // built so no controller file names the trial bundle
const RUN_X = "reconcile-20260927T010203Z-abc123";
const RUN_Y = "retrace-20260927T020304Z-def456";
const RUN_Z = "normalize-20260927T030405Z-0a0b0c";
const OWNER = { pid: 150001, lstart: "Mon Sep 28 09:00:00 2026" };
const REVIEWER = 160001;

const REQUEST = JSON.stringify({
  goal: "Decide the layout",
  candidate: { identity: "layout v1", text: "Use two columns." },
  intent: ["The human wants a layout that works on phones."],
  context: [],
  mode: "conversation",
  cap: "none",
  approval: { text: "go", at: "2026-09-27T01:00:00Z" },
});

// REQUEST's canonical JSON without `approval`, written out by hand: keys sorted at every level, no whitespace.
const REQUEST_CANONICAL = '{"candidate":{"identity":"layout v1","text":"Use two columns."},"cap":"none","context":[],"goal":"Decide the layout","intent":["The human wants a layout that works on phones."],"mode":"conversation"}';
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const REQUEST_ID = sha256(`reconcile\0${REQUEST_CANONICAL}`);
/** REQUEST with one changed Intent word: same target, different identity. */
const CHANGED = JSON.stringify({ ...JSON.parse(REQUEST), intent: ["The human wants a layout that works on tablets."] });
const OTHER_ID = sha256("reconcile\0another request");
const RESUME = JSON.stringify({ repair: { authority: "human: fixed at 2026-09-28T10:00:00Z", step: "validation" } });
/** A run record's spend rows: A spent 300 tokens and 0.03 USD, B 200 tokens and 0.02 USD. */
const SPEND = [
  { actor: "A", model: "scripted/a", thinking: "low", tokensBase: 0, tokensLast: 300, costBase: 0, costLast: 0.03, currency: "USD" },
  { actor: "B", model: "scripted/b", thinking: "low", tokensBase: 0, tokensLast: 200, costBase: 0, costLast: 0.02, currency: "USD" },
];

const STUB_ROLES = { a: { model: "scripted/a", thinking: "low" }, b: { model: "scripted/b", thinking: "low" } };

// An `omp models --json` catalog slice: `openai/claude-opus-9-9` proves the provider scope, the
// dated `claude-opus-4-5-20251101` would outrank `claude-opus-4-5` if snapshots were not skipped.
const LEVELS = ["low", "medium", "high", "xhigh", "max"];
const entry = (provider, id, thinking = LEVELS) => ({ provider, id, selector: `${provider}/${id}`, thinking });
const CATALOG = [
  entry("anthropic", "claude-opus-4-5", ["minimal", "low", "medium", "high", "xhigh"]),
  entry("anthropic", "claude-opus-4-5-20251101"),
  entry("anthropic", "claude-opus-5-5"),
  entry("anthropic", "claude-fable-5"),
  entry("anthropic", "claude-fable-5-1"),
  entry("anthropic", "claude-3-haiku-20240307", null),
  entry("anthropic", "claude-haiku-4-5", null),
  entry("openai", "claude-opus-9-9"),
];
const LIVE = { a: { model: "anthropic/claude-opus-5-5", thinking: "medium" }, b: { model: "anthropic/claude-fable-5-1", thinking: "medium" } };
const roles = (models) => JSON.stringify({ models });

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
  // `alive`: pid -> lstart of every injected live process (null: start unreadable); everything else is ESRCH.
  // `launched`: every hand-off payload the stub worker received.
  t = { dir, sessionsRoot, tmpRoot, log, launcher, controllerLoaded: false, launched: [], alive: new Map(), processes: [], selfStart: "controller start" };
});

afterEach(() => {
  fs.rmSync(t.dir, { recursive: true, force: true });
});

const observe = (pid) => (t.alive.has(pid) ? "present" : "ESRCH");
const start = async (pid) => (t.alive.has(pid) ? t.alive.get(pid) : pid === process.pid ? t.selfStart : null);
const world = () => ({ observePid: observe, processStart: start, listProcesses: async () => t.processes });

/**
 * One CLI run with injected roots, prompts and process world. With `stubRoles: false` the real
 * readModelRoles runs, so reaching it would start the scripted agent via the fake omp.
 * `realController` loads ./controller.mjs instead of the stub, whose runners accept every
 * request for hand-off. The stub worker records its payload in `t.launched` and leaves a
 * finished run: claim, `run.json` and the record `ran` (exit 0). `body` is the `roles` stdin;
 * `live` replaces the stubbed live roles and `catalog` is the injected `omp models --json` list.
 */
async function run({ version = OMP_VERSION, controllerRoot = CONTROLLER_ROOT, stubRoles = true, argv = ["reconcile"], realController = false, request = REQUEST, body = "", live = STUB_ROLES, catalog } = {}) {
  const omp = fakeOmp(t.dir, version, t.launcher);
  const out = await main({
    argv,
    stdinText: argv[0] === "dispose" || argv[0] === "stop" ? "" : argv[0] === "roles" ? body : request,
    env: { PATH: omp.pathEnv },
    controllerRoot,
    sessionsRoot: t.sessionsRoot,
    tmpRoot: t.tmpRoot,
    ...world(),
    ...(stubRoles ? { readModelRoles: async () => ({ ok: true, roles: live }) } : {}),
    ...(catalog ? { readModelCatalog: async () => ({ ok: true, models: catalog }) } : {}),
    loadPrompts: async () => ({ ok: true, prompts: { reviewer: {}, scope: {} }, sources: {} }),
    loadController: async () => {
      t.controllerLoaded = true;
      if (realController) return import("../controller.mjs");
      return { runReconcile: async (_request, deps) => (deps.preflight ? HAND_OFF : assert.fail("the caller only hands off")), disposeRun: async () => ({ exitCode: 0, markdown: "disposed\n" }) };
    },
    launchWorker: async (payload) => {
      t.launched.push(payload);
      const { command, runId, request } = payload;
      const root = path.join(t.tmpRoot, `acp-controller-${runId}`);
      fs.mkdirSync(root, { recursive: true });
      fs.writeFileSync(path.join(root, "claim-0"), JSON.stringify({ pid: process.pid, lstart: t.selfStart }));
      const record = { runId, kind: command, phase: "active", target: requestTarget(command, request, runId), identities: [requestIdentity(command, request, runId)], pids: [], sessionIds: [], spend: [] };
      fs.writeFileSync(path.join(root, "run.json"), JSON.stringify(record));
      fs.writeFileSync(path.join(root, "record.json"), JSON.stringify({ exitCode: 0, markdown: "ran\n" }));
      return { pid: process.pid };
    },
    log: (line) => t.stderr?.push(line),
  });
  const calls = fs.existsSync(omp.calls) ? fs.readFileSync(omp.calls, "utf8").trim().split("\n") : [];
  return { ...out, calls };
}

function assertNothingLaunched(out) {
  assert.equal(out.exitCode, 2);
  assert.match(out.stdout, /^## Controller refused/);
  assert.equal(fs.existsSync(t.log), false, "scripted agent must never start");
  assert.equal(t.controllerLoaded, false, "controller must never be loaded");
  assert.deepEqual(t.launched, [], "no worker launched");
  assert.ok(out.calls.every((c) => c === "--version"), `omp was only asked for its version: ${out.calls}`);
}

const controllerProcess = (pid, runId) => ({
  pid,
  command: ["/opt/tools/bin/omp", "acp", "--model", "m", "--session-dir", path.join(t.sessionsRoot, `acp-controller-${runId}`)].join(" "),
});

/**
 * One controller run's residue: private root with `claim-<i>` per `claims`
 * entry, optional `run.json` and `state.json`, an optional waiting record
 * `record.json` (`result`), and (unless `session` is false) its session folder
 * with `sessionFiles` (a trailing `/` makes a folder).
 */
function fixtureRun(runId, { claims = [OWNER], record = { phase: "active", pids: [], sessionIds: [] }, state = false, result, session = true, sessionFiles = [] } = {}) {
  const root = path.join(t.tmpRoot, `acp-controller-${runId}`);
  for (const d of ["home", "tmp", "work"]) fs.mkdirSync(path.join(root, d), { recursive: true });
  claims.forEach((c, i) => fs.writeFileSync(path.join(root, `claim-${i}`), JSON.stringify(c)));
  const kind = runId.split("-")[0];
  if (record) fs.writeFileSync(path.join(root, "run.json"), JSON.stringify({ runId, kind, ...record }));
  if (state) fs.writeFileSync(path.join(root, "state.json"), JSON.stringify({ kind, runId, sessionIds: record?.sessionIds ?? [], spend: [], actors: [] }));
  if (result) fs.writeFileSync(path.join(root, "record.json"), JSON.stringify(result));
  const sessionDir = path.join(t.sessionsRoot, `acp-controller-${runId}`);
  if (!session) return { root, sessionDir };
  fs.mkdirSync(sessionDir);
  for (const f of sessionFiles) {
    if (f.endsWith("/")) fs.mkdirSync(path.join(sessionDir, f));
    else fs.writeFileSync(path.join(sessionDir, f), "");
  }
  return { root, sessionDir };
}

/** A record waiting in its folder. */
const PARKED_RECORD = { exitCode: 1, markdown: "## Reconcile parked\n\n**Blocker**\n\n- failed step `validation`\n\n## Spend\n\n| Total | | | 500 | 0.05 USD |\n" };
const FINISHED_RECORD = { exitCode: 0, markdown: "## Final proposal\n\n- Use two columns.\n\n## Spend\n\n| Total | | | 500 | 0.05 USD |\n" };

/** A parked reconcile run whose owner and reviewers exited: phase `parked`, `state.json` and its exit 1 record. */
const parkedRun = (runId, identities = [REQUEST_ID], extra = {}) =>
  fixtureRun(runId, { record: { phase: "parked", target: "layout v1", identities, pids: [REVIEWER], sessionIds: ["s1"], spend: SPEND }, state: true, result: PARKED_RECORD, sessionFiles: ["2026_s1.jsonl"], ...extra });
/** A finished reconcile run whose record waits for its print: cleanup done, so no session folder. */
const finishedRun = (runId, identities = [REQUEST_ID], result = FINISHED_RECORD, target = "layout v1") =>
  fixtureRun(runId, { record: { phase: "active", target, identities, pids: [REVIEWER], sessionIds: [], spend: SPEND }, result, session: false });
/** An active reconcile run (live while its owner is). */
const activeRun = (runId, identities = [REQUEST_ID]) => fixtureRun(runId, { record: { phase: "active", target: "layout v1", identities, pids: [REVIEWER], sessionIds: ["s1"], spend: SPEND }, sessionFiles: ["2026_s1.jsonl"] });

/** Exit 2 without the scripted agent ever starting (the controller may be loaded, as `resume` and `dispose` load it). */
function assertRefusedUnlaunched(out) {
  assert.equal(out.exitCode, 2, out.stdout);
  assert.equal(fs.existsSync(t.log), false, "scripted agent must never start");
  assert.ok(out.calls.every((c) => c === "--version"), `omp was only asked for its version: ${out.calls}`);
}

/** Every path under `dir`, relative and sorted. */
function tree(dir) {
  return fs.readdirSync(dir, { recursive: true }).map(String).sort();
}

/** A crashed setup leftover `<tmpRoot>/.acp-controller-<runId>.init` with `claim-0` holding `claim` (none when null). */
function fixtureSetup(runId, claim = OWNER) {
  const root = path.join(t.tmpRoot, `.acp-controller-${runId}.init`);
  for (const d of ["home", "tmp", "work"]) fs.mkdirSync(path.join(root, d), { recursive: true });
  if (claim) fs.writeFileSync(path.join(root, "claim-0"), JSON.stringify(claim));
  return root;
}

const controllerDeps = (extra = {}) => ({ sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, env: { PATH: process.env.PATH }, owner: { pid: 170001, lstart: "claimant start" }, ...world(), ...extra });

// ------------------------------------------------------------ new-run preflight

test("preflight: another session's run with a live owner and live reviewer does not refuse", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart).set(REVIEWER, "reviewer start");
  fixtureRun(RUN_X, { record: { phase: "active", pids: [REVIEWER], sessionIds: ["s1"] }, sessionFiles: ["2026_s1.jsonl"] });
  t.processes = [controllerProcess(REVIEWER, RUN_X)];
  const out = await run();
  assert.equal(out.exitCode, 0);
  assert.equal(t.launched.length, 1, "one worker launched");
});

test("preflight: an abandoned run refuses with exit 2, grouped per run with reason, folders, present PIDs and its dispose command", async () => {
  t.alive.set(REVIEWER, "reviewer start");
  const x = fixtureRun(RUN_X, { record: { phase: "active", pids: [REVIEWER, 160002], sessionIds: [] } });
  t.processes = [controllerProcess(REVIEWER, RUN_X)];
  const y = fixtureRun(RUN_Y, { claims: [OWNER, { pid: 150002, lstart: "resumer start" }] });
  const out = await run();
  assertNothingLaunched(out);
  const refusal = [
    "**Reason:** abandoned controller run",
    "",
    `- run \`${RUN_X}\``,
    "  - reason: owner gone; no parked state",
    `  - folder \`${x.sessionDir}\``,
    `  - folder \`${x.root}\``,
    `  - present PID ${REVIEWER}: \`${controllerProcess(REVIEWER, RUN_X).command}\``,
    `  - dispose (only on the human's explicit instruction): \`cli.mjs dispose ${RUN_X}\``,
    `- run \`${RUN_Y}\``,
    "  - reason: owner gone; crashed after resume",
    `  - folder \`${y.sessionDir}\``,
    `  - folder \`${y.root}\``,
    `  - dispose (only on the human's explicit instruction): \`cli.mjs dispose ${RUN_Y}\``,
    "",
    "Nothing was launched.",
  ].join("\n");
  assert.ok(out.stdout.includes(refusal), out.stdout);
});

test("preflight: dead owner, reused owner PID, unreadable owner start, missing run.json, crash after resume and unowned live process each refuse", async () => {
  const cases = [
    { name: "dead owner", setup: () => fixtureRun(RUN_X), reason: "owner gone; no parked state" },
    { name: "reused PID", setup: () => (t.alive.set(OWNER.pid, "a later process"), fixtureRun(RUN_X)), reason: "owner PID reused; no parked state" },
    { name: "no run.json", setup: () => fixtureRun(RUN_X, { record: null }), reason: "owner gone; missing claim or `run.json`" },
    { name: "unreadable owner start", setup: () => (t.alive.set(OWNER.pid, null), fixtureRun(RUN_X)), reason: "owner start time unreadable" },
    { name: "empty recorded start, owner present", setup: () => (t.alive.set(OWNER.pid, OWNER.lstart), fixtureRun(RUN_X, { claims: [{ pid: OWNER.pid, lstart: null }] })), reason: "owner start time unreadable" },
    { name: "empty recorded start, owner exited", setup: () => fixtureRun(RUN_X, { claims: [{ pid: OWNER.pid, lstart: null }] }), reason: "owner gone; no parked state" },
    { name: "crash after resume", setup: () => fixtureRun(RUN_X, { claims: [OWNER, { pid: 150002, lstart: "resumer" }] }), reason: "owner gone; crashed after resume" },
    {
      name: "live process without owner",
      setup: () => {
        fixtureRun(RUN_X, { record: { phase: "parked", pids: [], sessionIds: [] }, state: true });
        t.alive.set(REVIEWER, "r");
        t.processes = [controllerProcess(REVIEWER, RUN_X)];
      },
      reason: "owner gone; live process without owner",
    },
  ];
  for (const c of cases) {
    fs.rmSync(t.tmpRoot, { recursive: true });
    fs.rmSync(t.sessionsRoot, { recursive: true });
    fs.mkdirSync(t.tmpRoot);
    fs.mkdirSync(t.sessionsRoot);
    t.alive.clear();
    t.processes = [];
    c.setup();
    for (const argv of [["reconcile"], ["roles"]]) {
      const out = await run({ argv });
      assertNothingLaunched(out);
      assert.ok(out.stdout.includes(`**Reason:** abandoned controller run\n\n- run \`${RUN_X}\`\n  - reason: ${c.reason}\n`), `${c.name} (${argv[0]}): ${out.stdout}`);
    }
  }
});

test("preflight: trial-shaped folders and processes do not refuse", async () => {
  fs.mkdirSync(path.join(t.sessionsRoot, `${TRIAL_PREFIX}20260926-x`));
  fs.mkdirSync(path.join(t.tmpRoot, `${TRIAL_PREFIX}root`));
  t.processes = [{ pid: 56135, command: ["/opt/tools/bin/omp", "acp", "--session-dir", path.join(t.sessionsRoot, `${TRIAL_PREFIX}20260926-x`)].join(" ") }];
  t.alive.set(56135, "trial");
  const result = await findAbandonedRuns({ sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, ...world() });
  assert.deepEqual(result, { refuse: false, runs: [] });
  const out = await run();
  assert.equal(out.exitCode, 0);
  assert.equal(t.launched.length, 1, "one worker launched");
});

test("preflight: a controller-prefixed session dir without ` acp ` is not a live run", async () => {
  t.processes = [{ pid: 7, command: `/usr/bin/tail -f --session-dir ${path.join(t.sessionsRoot, `acp-controller-${RUN_X}`)}` }];
  t.alive.set(7, "tail");
  const result = await findAbandonedRuns({ sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, ...world() });
  assert.equal(result.refuse, false);
});

test("preflight: a setup leftover refuses as `setup incomplete` unless its owner is live; an unreadable owner start refuses as such", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart).set(150003, null);
  fixtureSetup(RUN_X);
  const y = fixtureSetup(RUN_Y, { pid: 150002, lstart: "setup start" });
  const z = fixtureSetup(RUN_Z, { pid: 150003, lstart: "setup start" });
  const out = await run();
  assertNothingLaunched(out);
  const block = (runId, reason, folder) => `- run \`${runId}\`\n  - reason: ${reason}\n  - folder \`${folder}\`\n  - dispose (only on the human's explicit instruction): \`cli.mjs dispose ${runId}\`\n`;
  assert.ok(out.stdout.includes(`**Reason:** abandoned controller run\n\n${block(RUN_Z, "owner start time unreadable", z)}${block(RUN_Y, "setup incomplete", y)}\nNothing was launched.`), out.stdout);
  assert.doesNotMatch(out.stdout, new RegExp(RUN_X));
});

test("processStart: one process reads as the same start time whatever the caller's TZ and locale", () => {
  const preflight = new URL("../lib/preflight.mjs", import.meta.url).href;
  const script = `const { processStart } = await import(${JSON.stringify(preflight)}); process.stdout.write(String(await processStart(${process.pid})));`;
  const read = (env) => execFileSync(process.execPath, ["--input-type=module", "-e", script], { env, encoding: "utf8" });
  const tokyo = read({ TZ: "Asia/Tokyo", LC_ALL: "fr_FR.UTF-8" });
  assert.notEqual(tokyo, "null");
  assert.equal(read({ TZ: "America/New_York", LC_ALL: "C" }), tokyo);
});

test("roles: prints only the models note and never loads the controller", async () => {
  const out = await run({ argv: ["roles"] });
  assert.equal(out.exitCode, 0);
  assert.equal(out.stdout, "Models:\n\n- A `scripted/a` · low\n- B `scripted/b` · low\n");
  assert.equal(fs.existsSync(t.log), false, "scripted agent must never start");
  assert.equal(t.controllerLoaded, false, "controller must never be loaded");
});

test("roles: a body resolves loose names and levels in the live provider and marks changed lines with the live default", async () => {
  const out = await run({ argv: ["roles"], live: LIVE, catalog: CATALOG, body: roles({ a: { thinking: "hi" }, b: { model: "opus", thinking: "xh" } }) });
  assert.equal(out.exitCode, 0, out.stdout);
  assert.equal(out.stdout, "Models:\n\n- A `anthropic/claude-opus-5-5` · high (default: medium)\n- B `anthropic/claude-opus-5-5` · xhigh (default: `anthropic/claude-fable-5-1` · medium)\n");

  // A choice equal to the live pair has no suffix; a model-only change keeps the live level; snapshots are skipped.
  const kept = await run({ argv: ["roles"], live: LIVE, catalog: CATALOG, body: roles({ a: { model: "opus", thinking: "medium" }, b: { model: "opus-4-5" } }) });
  assert.equal(kept.exitCode, 0, kept.stdout);
  assert.equal(kept.stdout, "Models:\n\n- A `anthropic/claude-opus-5-5` · medium\n- B `anthropic/claude-opus-4-5` · medium (default: `anthropic/claude-fable-5-1` · medium)\n");

  // A provider prefix overrides the live provider's scope.
  const scoped = await run({ argv: ["roles"], live: LIVE, catalog: CATALOG, body: roles({ a: { model: "openai/opus" } }) });
  assert.equal(scoped.stdout, "Models:\n\n- A `openai/claude-opus-9-9` · medium (default: `anthropic/claude-opus-5-5` · medium)\n- B `anthropic/claude-fable-5-1` · medium\n");
  assert.equal(t.controllerLoaded, false, "controller must never be loaded");
});

test("roles: ambiguous, unmatched or unsupported choices refuse as model choice and name the candidates", async () => {
  const tied = await run({ argv: ["roles"], live: LIVE, catalog: CATALOG, body: roles({ a: { model: "claude" }, b: { thinking: "m" } }) });
  assertNothingLaunched(tied);
  assert.ok(tied.stdout.includes("**Reason:** model choice\n"), tied.stdout);
  const a = tied.stdout.split("\n").find((l) => l.startsWith("- A model `claude`: ambiguous"));
  for (const c of ["anthropic/claude-opus-5-5", "anthropic/claude-fable-5-1", "anthropic/claude-haiku-4-5"]) assert.ok(a?.includes(`\`${c}\``), `${c} named: ${a}`);
  assert.ok(!a.includes("openai/") && !a.includes("2025"), `no other provider or snapshot: ${a}`);
  assert.ok(tied.stdout.includes("- B thinking `m` for `anthropic/claude-fable-5-1`: ambiguous; candidates: `medium`, `max`\n"), tied.stdout);

  const none = await run({ argv: ["roles"], live: LIVE, catalog: CATALOG, body: roles({ a: { model: "haiku" }, b: { model: "gpt" } }) });
  assertNothingLaunched(none);
  assert.ok(none.stdout.includes("**Reason:** model choice\n"), none.stdout);
  assert.ok(none.stdout.includes("- A model `haiku` → `anthropic/claude-haiku-4-5` does not support the live level `medium`; the model supports no thinking level\n"), none.stdout);
  assert.ok(none.stdout.includes("- B model `gpt`: no model in provider `anthropic` matches\n"), none.stdout);
});

test("roles: a malformed body is an invalid request", async () => {
  for (const body of ["[]", roles({ c: { model: "opus" } }), roles({ a: { model: "" } }), JSON.stringify({ models: {}, extra: 1 })]) {
    const out = await run({ argv: ["roles"], live: LIVE, catalog: CATALOG, body });
    assertNothingLaunched(out);
    assert.ok(out.stdout.includes("**Reason:** invalid request\n"), `${body}: ${out.stdout}`);
  }
});

test("models override: an inexact or unsupported request value refuses as model override, and normalize refuses models", async () => {
  const request = (models) => JSON.stringify({ ...JSON.parse(REQUEST), models });
  const out = await run({ live: LIVE, catalog: CATALOG, request: request({ a: "opus:high", b: "anthropic/claude-fable-5-1:minimal" }) });
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes("**Reason:** model override\n"), out.stdout);
  assert.ok(out.stdout.includes("- A `opus:high`: `opus` is not an exact selector in the model catalog\n"), out.stdout);
  assert.ok(out.stdout.includes("- B `anthropic/claude-fable-5-1:minimal`: level `minimal` is not supported; allowed: `low`, `medium`, `high`, `xhigh`, `max`\n"), out.stdout);

  const normalize = await run({ argv: ["normalize"], live: LIVE, catalog: CATALOG, request: JSON.stringify({ root: "/tmp", concerns: [], input: "x", models: { a: "anthropic/claude-opus-5-5:high" } }) });
  assertNothingLaunched(normalize);
  assert.ok(normalize.stdout.includes("**Reason:** invalid request\n\n- normalize takes no models; it uses the live model roles\n"), normalize.stdout);
});

test("request: a reconcile request without an `intent` array of strings refuses before any launch; with one it passes", async () => {
  const { intent, ...rest } = JSON.parse(REQUEST);
  for (const bad of [rest, { ...rest, intent: "phones first" }, { ...rest, intent: ["phones first", ""] }]) {
    const out = await run({ request: JSON.stringify(bad) });
    assertNothingLaunched(out);
    assert.ok(out.stdout.includes("**Reason:** invalid request\n\n- intent must be an array of non-empty strings\n"), out.stdout);
  }
  const ok = await run({ request: JSON.stringify({ ...rest, intent }) });
  assert.equal(ok.exitCode, 0, ok.stdout);
  assert.equal(t.launched.length, 1, "one worker launched");
});

// ------------------------------------------------------------ run identity and classes

test("RS3 identity: a reordered, reformatted copy with a new approval time matches the run by identity; one changed word does not", async () => {
  finishedRun(RUN_X);
  const { approval, candidate, ...rest } = JSON.parse(REQUEST);
  const copy = `{\n  "approval": {"at": "2026-10-01T08:00:00Z", "text": "approved again"},\n${Object.entries(rest).reverse().map(([k, v]) => `  ${JSON.stringify(k)} :  ${JSON.stringify(v)}`).join(",\n")},\n  "candidate": {"text": "Use two columns.", "identity": "layout v1"}\n}\n`;
  const same = await run({ request: copy });
  assert.equal(same.exitCode, 0, same.stdout);
  assert.equal(same.stdout, FINISHED_RECORD.markdown);
  assert.equal(t.controllerLoaded, false, "matching a waiting record starts nothing");
  const changed = await run({ request: CHANGED });
  assertNothingLaunched(changed);
  assert.ok(changed.stdout.includes(`**Reason:** run for the same target\n\n- run \`${RUN_X}\` (finished) works on this target with a different request\n`), changed.stdout);
});

test("RS3 identity: the Retrace target is the canonical JSON of its table and the normalize target is its root", async () => {
  const root = path.join(t.dir, "repo");
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, "S1.md"), "S1\n");
  // The table below, canonical: keys sorted at every level, no whitespace.
  const tableCanonical = '{"scopes":[{"evaluand":"S1.md","id":"S1","name":"Area S1","objective":"Judge area S1","potentialConflict":[],"requires":[],"sharedEvidence":[]}]}';
  finishedRun(RUN_Y, [OTHER_ID], FINISHED_RECORD, tableCanonical);
  finishedRun(RUN_Z, [OTHER_ID], FINISHED_RECORD, root);
  const table = { scopes: [{ requires: [], name: "Area S1", id: "S1", sharedEvidence: [], potentialConflict: [], objective: "Judge area S1", evaluand: "S1.md" }] };
  const retrace = await run({ argv: ["retrace"], request: JSON.stringify({ root, table, approval: { text: "go", at: "2026-09-27T01:00:00Z" }, evidence: [], objectives: ["find defects"], constraints: [], exclusions: [] }) });
  assertNothingLaunched(retrace);
  assert.ok(retrace.stdout.includes(`- run \`${RUN_Y}\` (finished) works on this target with a different request\n`), retrace.stdout);
  const normalize = await run({ argv: ["normalize"], request: JSON.stringify({ root, concerns: [], input: "x" }) });
  assertNothingLaunched(normalize);
  assert.ok(normalize.stdout.includes(`- run \`${RUN_Z}\` (finished) works on this target with a different request\n`), normalize.stdout);
});

test("RS4: one changed Intent word for a live, parked or finished run's candidate exits 2, names that run and launches nothing", async () => {
  const setups = {
    live: () => (t.alive.set(OWNER.pid, OWNER.lstart), activeRun(RUN_X)),
    parked: () => parkedRun(RUN_X),
    finished: () => finishedRun(RUN_X),
  };
  for (const [cls, setup] of Object.entries(setups)) {
    for (const root of [t.tmpRoot, t.sessionsRoot]) fs.rmSync(root, { recursive: true }), fs.mkdirSync(root);
    t.alive.clear();
    setup();
    const out = await run({ request: CHANGED });
    assertNothingLaunched(out);
    assert.ok(out.stdout.includes(`**Reason:** run for the same target\n\n- run \`${RUN_X}\``), `${cls}: ${out.stdout}`);
  }
});

test("RS4: a request for another target starts its own run beside a live, a parked and a finished run", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  activeRun(RUN_X, [OTHER_ID]);
  parkedRun(RUN_Y, [OTHER_ID]);
  finishedRun(RUN_Z, [OTHER_ID]);
  for (const runId of [RUN_X, RUN_Y, RUN_Z]) {
    const file = path.join(t.tmpRoot, `acp-controller-${runId}`, "run.json");
    fs.writeFileSync(file, JSON.stringify({ ...JSON.parse(fs.readFileSync(file, "utf8")), target: "another candidate" }));
  }
  const out = await run();
  assert.equal(out.exitCode, 0, out.stdout);
  assert.equal(out.stdout, "ran\n");
  assert.equal(t.launched.length, 1, "one worker launched");
});

test("RS4: more than one matching run exits 2, lists them and launches nothing", async () => {
  finishedRun(RUN_X, [OTHER_ID]);
  const y = "reconcile-20260927T020304Z-def456";
  parkedRun(y, [OTHER_ID]);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes("**Reason:** several matching runs\n"), out.stdout);
  for (const line of [`- run \`${RUN_X}\` (finished) matches this request by target`, `- run \`${y}\` (parked) matches this request by target`]) assert.ok(out.stdout.includes(line), out.stdout);
});

test("RS5: while a finished record waits, another target and roles are not refused; the same command prints it word for word, then removes the folder", async () => {
  const record = { exitCode: 1, markdown: "## Reconcile stopped\n\n**Blocker**\n\n- persistent BLOCKED\n\n## Spend\n\n| Total | | | 500 | 0.05 USD |\n" };
  const x = finishedRun(RUN_X, [REQUEST_ID], record);
  const roles = await run({ argv: ["roles"] });
  assert.equal(roles.exitCode, 0, roles.stdout);
  const other = await run({ request: JSON.stringify({ ...JSON.parse(REQUEST), candidate: { identity: "layout v2", text: "Use one column." } }) });
  assert.equal(other.exitCode, 0, other.stdout);
  assert.equal(other.stdout, "ran\n");
  await other.settle();
  t.controllerLoaded = false;
  t.launched = [];
  const same = await run();
  assert.equal(same.exitCode, 1);
  assert.equal(same.stdout, record.markdown);
  assert.equal(t.controllerLoaded, false);
  assert.ok(fs.existsSync(path.join(x.root, "record.json")), "nothing is removed before the print");
  await same.settle();
  assert.equal(fs.existsSync(x.root), false, "the printed finished run's folder is removed");
});

test("RS7 spend: the abandoned-run refusal and dispose report the spend so far of a run that ended without a record", async () => {
  const x = fixtureRun(RUN_X, { record: { phase: "active", pids: [], sessionIds: [], spend: SPEND }, session: false });
  const refused = await run();
  assertNothingLaunched(refused);
  assert.ok(refused.stdout.includes(`  - reason: owner gone; no parked state\n  - folder \`${x.root}\`\n  - spend so far: 500 tokens, 0.05 USD\n`), refused.stdout);
  const disposed = await run({ argv: ["dispose", RUN_X], realController: true });
  assert.equal(disposed.exitCode, 0, disposed.stdout);
  assert.ok(disposed.stdout.endsWith("| A | scripted/a | low | 300 | 0.03 USD |\n| B | scripted/b | low | 200 | 0.02 USD |\n| Total | | | 500 | 0.05 USD |\n"), disposed.stdout);
});

test("RS10 live/other: a different request for a live run's target exits 2, names the run and launches nothing", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  activeRun(RUN_X, [OTHER_ID]);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes(`**Reason:** run for the same target\n\n- run \`${RUN_X}\` is live (owner PID ${OWNER.pid}) and works on this target with a different request\n`), out.stdout);
});

test("RS10 live/resume: a resume of a live run exits 2, names the run, never `dispose`, and launches nothing", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  const x = parkedRun(RUN_X);
  const before = tree(x.root);
  const out = await run({ argv: ["resume", RUN_X], request: RESUME, realController: true });
  assertRefusedUnlaunched(out);
  assert.ok(out.stdout.includes(`- run \`${RUN_X}\` is owned by a live controller (PID ${OWNER.pid})\n`), out.stdout);
  assert.doesNotMatch(out.stdout, /dispose/);
  assert.deepEqual(tree(x.root), before);
});

test("RS10 live/dispose: dispose of a live run exits 2 because a live owner holds it", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  const x = activeRun(RUN_X);
  const before = [tree(x.root), tree(x.sessionDir)];
  const out = await run({ argv: ["dispose", RUN_X], realController: true });
  assertRefusedUnlaunched(out);
  assert.ok(out.stdout.includes(`**Reason:** run claimed by another controller\n\n- run \`${RUN_X}\` is owned by a live controller (PID ${OWNER.pid})\n`), out.stdout);
  assert.deepEqual([tree(x.root), tree(x.sessionDir)], before);
});

test("RS10 parked/same: the same request again prints the parked record (exit 1); folder, record and state.json stay", async () => {
  const x = parkedRun(RUN_X);
  const before = [tree(x.root), tree(x.sessionDir)];
  const out = await run();
  assert.equal(out.exitCode, 1);
  assert.equal(out.stdout, PARKED_RECORD.markdown);
  assert.equal(t.controllerLoaded, false);
  await out.settle();
  assert.deepEqual([tree(x.root), tree(x.sessionDir)], before);
});

test("RS10 parked/other: a different request for a parked run's target exits 2 naming the run, `resume` and `dispose`", async () => {
  parkedRun(RUN_X, [OTHER_ID]);
  const out = await run();
  assertNothingLaunched(out);
  for (const line of [`- run \`${RUN_X}\` (parked) works on this target with a different request`, `- resume it: \`cli.mjs resume ${RUN_X}\``, `- or dispose it only on the human's explicit instruction: \`cli.mjs dispose ${RUN_X}\``]) {
    assert.ok(out.stdout.includes(line), out.stdout);
  }
});

test("RS10 parked/dispose: dispose of a parked run disposes it as today", async () => {
  const x = parkedRun(RUN_X);
  const out = await run({ argv: ["dispose", RUN_X], realController: true });
  assert.equal(out.exitCode, 0, out.stdout);
  assert.match(out.stdout, /^## Run disposed\n/);
  for (const gone of [x.root, x.sessionDir]) assert.equal(fs.existsSync(gone), false, `${gone} removed`);
});

test("RS10 finished/other: a different request for a finished run's target exits 2 naming the run and both ways to print its record", async () => {
  const x = finishedRun(RUN_X, [OTHER_ID]);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes(`- run \`${RUN_X}\` (finished) works on this target with a different request\n- print its record: rerun the original request, or \`cli.mjs stop ${RUN_X}\`\n`), out.stdout);
  assert.ok(fs.existsSync(path.join(x.root, "record.json")));
});

test("RS10 finished/resume: a resume of a finished run exits 2 naming both ways to print its record and does not dispose it", async () => {
  const x = finishedRun(RUN_X);
  const before = tree(x.root);
  const out = await run({ argv: ["resume", RUN_X], request: RESUME, realController: true });
  assertRefusedUnlaunched(out);
  assert.ok(out.stdout.includes(`**Reason:** finished run cannot be resumed\n\n- run \`${RUN_X}\` has finished; its record waits in its folder\n- print its record: rerun the original request, or \`cli.mjs stop ${RUN_X}\`\n`), out.stdout);
  assert.deepEqual(tree(x.root), before);
});

test("RS10 finished/dispose: dispose of a finished run disposes it; the unprinted record goes with the folder", async () => {
  const x = finishedRun(RUN_X);
  const out = await run({ argv: ["dispose", RUN_X], realController: true });
  assert.equal(out.exitCode, 0, out.stdout);
  assert.match(out.stdout, /^## Run disposed\n/);
  assert.equal(fs.existsSync(x.root), false);
});

test("RS10 abandoned/same: the same request again exits 2 with the abandoned-run refusal naming `dispose`", async () => {
  activeRun(RUN_X);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes(`**Reason:** abandoned controller run\n\n- run \`${RUN_X}\`\n  - reason: owner gone; no parked state\n`), out.stdout);
  assert.ok(out.stdout.includes(`  - dispose (only on the human's explicit instruction): \`cli.mjs dispose ${RUN_X}\`\n`), out.stdout);
});

test("RS10 abandoned/other: a different request for an abandoned run's target exits 2 with the abandoned-run refusal", async () => {
  activeRun(RUN_X, [OTHER_ID]);
  const out = await run();
  assertNothingLaunched(out);
  assert.ok(out.stdout.includes(`**Reason:** abandoned controller run\n\n- run \`${RUN_X}\`\n`), out.stdout);
  assert.doesNotMatch(out.stdout, /same target/);
});

test("RS10 abandoned/resume: not parked names `dispose`; an unreadable owner start names the run only; parked with a PID present exits 3", async () => {
  const cases = [
    { name: "not parked", setup: () => activeRun(RUN_X), exitCode: 2, line: `- run \`${RUN_X}\` is not parked (no parked state)\n- dispose it only on the human's explicit instruction: \`cli.mjs dispose ${RUN_X}\`\n` },
    { name: "owner start unreadable", setup: () => (t.alive.set(OWNER.pid, null), parkedRun(RUN_X)), exitCode: 2, line: `**Reason:** owner start time unreadable\n\n- run \`${RUN_X}\` owner PID ${OWNER.pid} is present` },
    { name: "parked, PID present", setup: () => (t.alive.set(REVIEWER, "reviewer start"), parkedRun(RUN_X)), exitCode: 3, line: `- PID ${REVIEWER} present\n` },
  ];
  for (const c of cases) {
    for (const root of [t.tmpRoot, t.sessionsRoot]) fs.rmSync(root, { recursive: true }), fs.mkdirSync(root);
    t.alive.clear();
    const x = c.setup();
    const before = tree(x.root);
    const out = await run({ argv: ["resume", RUN_X], request: RESUME, realController: true });
    assert.equal(out.exitCode, c.exitCode, `${c.name}: ${out.stdout}`);
    assert.ok(out.stdout.includes(c.line), `${c.name}: ${out.stdout}`);
    if (c.exitCode === 2 && c.name !== "not parked") assert.doesNotMatch(out.stdout, /dispose/, c.name);
    assert.equal(fs.existsSync(t.log), false, c.name);
    assert.deepEqual(tree(x.root), before, `${c.name}: the run is unchanged`);
  }
});

test("RS10 abandoned/dispose: dispose of an abandoned run disposes it as today", async () => {
  const x = activeRun(RUN_X);
  const out = await run({ argv: ["dispose", RUN_X], realController: true });
  assert.equal(out.exitCode, 0, out.stdout);
  assert.match(out.stdout, /^## Run disposed\n/);
  for (const gone of [x.root, x.sessionDir]) assert.equal(fs.existsSync(gone), false, `${gone} removed`);
});

/** Waits until `probe()` holds; the cap only keeps a broken wait from hanging the suite. */
async function poll(probe, what) {
  for (let end = Date.now() + 30_000; !probe(); await new Promise((resolve) => setTimeout(resolve, 10))) {
    if (Date.now() > end) assert.fail(`timed out waiting for ${what}`);
  }
}

test("RS10 live/same: the same request attaches to the live run: the notice, no launch, a wait, then the run's record once it ends", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  const x = activeRun(RUN_X);
  t.stderr = [];
  const pending = run();
  await poll(() => t.stderr.length === 3, "the attach notice");
  assert.equal(t.stderr[0], `acp-controller: run ${RUN_X} runs in worker PID ${OWNER.pid}; target: layout v1`);
  fs.writeFileSync(path.join(x.root, "record.json"), JSON.stringify(FINISHED_RECORD));
  t.alive.delete(OWNER.pid);
  const out = await pending;
  assert.deepEqual({ exitCode: out.exitCode, stdout: out.stdout }, { exitCode: 0, stdout: FINISHED_RECORD.markdown });
  assert.deepEqual(t.launched, [], "no worker launched");
  assert.equal(t.stderr.length, 3, "nothing else on stderr");
  await out.settle();
  assert.equal(fs.existsSync(x.root), false, "the printed finished run's folder is removed");
});

test("RS10 live/stop: stop asks the live run's worker to stop, waits and prints its stopped record (exit 1); the folder goes after the print", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  const x = activeRun(RUN_X);
  t.stderr = [];
  const pending = run({ argv: ["stop", RUN_X] });
  await poll(() => fs.existsSync(path.join(x.root, "stop.json")), "the stop request");
  assert.deepEqual(t.stderr, [`acp-controller: asked run ${RUN_X} (worker PID ${OWNER.pid}) to stop; waiting for its stopped record`]);
  const stopped = { exitCode: 1, markdown: `## Reconcile stopped\n\n**Blocker**\n\n- ${STOPPED_CAUSE}\n` };
  fs.writeFileSync(path.join(x.root, "record.json"), JSON.stringify(stopped));
  t.alive.delete(OWNER.pid);
  const out = await pending;
  assert.deepEqual({ exitCode: out.exitCode, stdout: out.stdout }, { exitCode: 1, stdout: stopped.markdown });
  assert.deepEqual(t.launched, []);
  assert.ok(fs.existsSync(path.join(x.root, "record.json")), "nothing is removed before the print");
  await out.settle();
  assert.equal(fs.existsSync(x.root), false);
});

test("RS10 parked/stop: stop prints the parked record (exit 1) and leaves the run parked", async () => {
  const x = parkedRun(RUN_X);
  const before = [tree(x.root), tree(x.sessionDir)];
  const out = await run({ argv: ["stop", RUN_X] });
  assert.deepEqual({ exitCode: out.exitCode, stdout: out.stdout }, { exitCode: 1, stdout: PARKED_RECORD.markdown });
  await out.settle();
  assert.deepEqual([tree(x.root), tree(x.sessionDir)], before, "no stop request, nothing removed");
  assert.deepEqual(t.launched, []);
});

test("RS10 finished/stop: stop prints the finished record word for word, then removes the folder", async () => {
  const x = finishedRun(RUN_X);
  const out = await run({ argv: ["stop", RUN_X] });
  assert.deepEqual({ exitCode: out.exitCode, stdout: out.stdout }, { exitCode: 0, stdout: FINISHED_RECORD.markdown });
  assert.ok(fs.existsSync(path.join(x.root, "record.json")), "nothing is removed before the print");
  await out.settle();
  assert.equal(fs.existsSync(x.root), false);
});

test("RS10 abandoned/stop: stop on a run whose worker is gone acts on its class at once: exit 3 naming the abandoned run and its spend, no stop request, nothing removed", async () => {
  const x = activeRun(RUN_X);
  const before = [tree(x.root), tree(x.sessionDir)];
  t.stderr = [];
  const out = await run({ argv: ["stop", RUN_X] });
  assert.equal(out.exitCode, 3, out.stdout);
  assert.match(out.stdout, /^## Controller run abandoned\n/);
  for (const line of [`**Reason:** run \`${RUN_X}\` is abandoned (owner gone; no parked state); nothing was stopped and nothing was removed`, "  - spend so far: 500 tokens, 0.05 USD", `\`cli.mjs dispose ${RUN_X}\``]) assert.ok(out.stdout.includes(line), out.stdout);
  assert.deepEqual(t.stderr, [], "it never waited on a worker");
  assert.deepEqual([tree(x.root), tree(x.sessionDir)], before);
});

test("RS11: `roles` adds a Controller runs list naming a live and a finished run with kind, class, target, start, the live worker's PID and spend so far", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  activeRun(RUN_X);
  // A finished run whose own worker (not the live run's) has exited.
  fixtureRun(RUN_Y, { claims: [{ pid: 150002, lstart: "finished worker" }], record: { phase: "active", target: "scope table", identities: [OTHER_ID], pids: [], sessionIds: [], spend: SPEND }, result: FINISHED_RECORD, session: false });
  const out = await run({ argv: ["roles"] });
  assert.equal(out.exitCode, 0, out.stdout);
  const list = out.stdout.slice(out.stdout.indexOf("\nController runs:\n\n"));
  assert.deepEqual(list.split("\n").filter((l) => l.startsWith("- ")).sort(), [
    `- \`${RUN_X}\` · reconcile · live · target \`layout v1\` · started 2026-09-27T01:02:03Z · worker PID ${OWNER.pid} · spend so far: 500 tokens, 0.05 USD`,
    `- \`${RUN_Y}\` · retrace · finished · target \`scope table\` · started 2026-09-27T02:03:04Z · spend so far: 500 tokens, 0.05 USD`,
  ]);
  assert.ok(list.endsWith("USD\n"), "the list ends the output");
  assert.ok(fs.existsSync(path.join(t.tmpRoot, `acp-controller-${RUN_Y}`, "record.json")), "roles prints no record and removes nothing");
  assert.deepEqual(t.launched, []);
});

// ------------------------------------------------------------ run claim

test("claim: resume and dispose of a run with a live owner refuse and change nothing", async () => {
  t.alive.set(OWNER.pid, OWNER.lstart);
  const x = fixtureRun(RUN_X, { record: { phase: "parked", pids: [], sessionIds: [] }, state: true });
  const before = [tree(x.root), tree(t.sessionsRoot)];
  for (const out of [await disposeRun(RUN_X, controllerDeps()), await resumeReconcile(RUN_X, { repair: { authority: "human", step: "validation" } }, controllerDeps())]) {
    assert.equal(out.exitCode, 2);
    assert.ok(out.markdown.includes(`- run \`${RUN_X}\` is owned by a live controller (PID ${OWNER.pid})`), out.markdown);
  }
  assert.deepEqual([tree(x.root), tree(t.sessionsRoot)], before);
});

test("claim: resume and dispose of a run whose present owner's start time is unreadable refuse and change nothing", async () => {
  t.alive.set(OWNER.pid, null);
  const x = fixtureRun(RUN_X, { record: { phase: "parked", pids: [], sessionIds: [] }, state: true, sessionFiles: ["2026_s1.jsonl"] });
  const before = [tree(t.tmpRoot), tree(t.sessionsRoot)];
  for (const out of [await disposeRun(RUN_X, controllerDeps()), await resumeReconcile(RUN_X, { repair: { authority: "human", step: "validation" } }, controllerDeps())]) {
    assert.equal(out.exitCode, 2);
    assert.ok(out.markdown.includes(`**Reason:** owner start time unreadable\n\n- run \`${RUN_X}\` owner PID ${OWNER.pid} is present`), out.markdown);
  }
  assert.deepEqual([tree(t.tmpRoot), tree(t.sessionsRoot)], before);
  assert.equal(fs.readFileSync(path.join(x.root, "claim-0"), "utf8"), JSON.stringify(OWNER));
});

test("claim: without its own start time a new run, resume and dispose refuse before creating any folder or claim", async () => {
  t.selfStart = null;
  fixtureRun(RUN_X, { record: { phase: "parked", pids: [], sessionIds: [] }, state: true, result: PARKED_RECORD });
  const before = [tree(t.tmpRoot), tree(t.sessionsRoot)];
  for (const argv of [["reconcile"], ["resume", RUN_X], ["dispose", RUN_X]]) {
    const out = await run({ argv, request: argv[0] === "resume" ? JSON.stringify({ repair: { authority: "human", step: "validation" } }) : REQUEST });
    assertNothingLaunched(out);
    assert.ok(out.stdout.includes(`**Reason:** own start time unreadable\n`), `${argv[0]}: ${out.stdout}`);
  }
  assert.deepEqual([tree(t.tmpRoot), tree(t.sessionsRoot)], before);
});

test("claim: a claimant that loses the exclusive claim refuses and removes nothing; a leftover claim temp file never counts as the owner", async () => {
  const x = fixtureRun(RUN_X, { sessionFiles: ["2026_s1.jsonl"] });
  // A stale temp claim naming a live process: were it read as `claim-9`, the claimant would see a live owner instead of racing.
  t.alive.set(190001, "stale start");
  fs.writeFileSync(path.join(x.root, ".claim-9.0badc0de.tmp"), JSON.stringify({ pid: 190001, lstart: "stale start" }));
  const before = tree(x.root);
  const winner = { pid: 180001, lstart: "winner" };
  // Another claimant creates claim-1 between this claimant's read of claim-0 and its own create.
  const racing = (pid) => {
    if (pid === OWNER.pid && !fs.existsSync(path.join(x.root, "claim-1"))) fs.writeFileSync(path.join(x.root, "claim-1"), JSON.stringify(winner));
    return observe(pid);
  };
  const out = await disposeRun(RUN_X, controllerDeps({ observePid: racing }));
  assert.equal(out.exitCode, 2);
  assert.ok(out.markdown.includes(`- another controller claimed run \`${RUN_X}\` first`), out.markdown);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(x.root, "claim-1"), "utf8")), winner);
  assert.ok(fs.existsSync(path.join(x.sessionDir, "2026_s1.jsonl")));
  assert.deepEqual(tree(x.root), [...before, "claim-1"].sort(), "the loser left no temp file");
});

test("claim: resume of a run that crashed after an earlier resume refuses, names dispose and keeps the run as found", async () => {
  const x = fixtureRun(RUN_X, { claims: [OWNER, { pid: 150002, lstart: "resumer" }], state: true });
  const recordBefore = fs.readFileSync(path.join(x.root, "run.json"), "utf8");
  const out = await resumeReconcile(RUN_X, { repair: { authority: "human", step: "validation" } }, controllerDeps());
  assert.equal(out.exitCode, 2);
  assert.ok(out.markdown.includes(`- run \`${RUN_X}\` is not parked (phase \`active\`)\n- dispose it only on the human's explicit instruction: \`cli.mjs dispose ${RUN_X}\``), out.markdown);
  assert.equal(fs.readFileSync(path.join(x.root, "run.json"), "utf8"), recordBefore);
});

// ------------------------------------------------------------ abandoned-run dispose

test("dispose: one abandoned run is disposed through the CLI while another abandoned run exists; only its folders go", async () => {
  const cwdFolderOf = (root) => liveCwdFolderFor(fs.realpathSync(path.join(root, "work")), t.sessionsRoot);
  const x = fixtureRun(RUN_X, { record: { phase: "active", pids: [REVIEWER], sessionIds: ["s1"] }, sessionFiles: ["2026_s1.jsonl", ".2026_s1.jsonl.lock.os", ".2026_s1.jsonl.owner.lock", "2026_s1/"] });
  const xCwd = cwdFolderOf(x.root);
  fs.mkdirSync(xCwd);
  const y = fixtureRun(RUN_Y, { record: { phase: "active", pids: [], sessionIds: ["s2"] }, sessionFiles: ["2026_s2.jsonl"] });
  fs.mkdirSync(cwdFolderOf(y.root));
  const yBefore = [tree(y.root), tree(y.sessionDir)];
  const out = await run({ argv: ["dispose", RUN_X], realController: true });
  assert.equal(out.exitCode, 0, out.stdout);
  assert.match(out.stdout, /^## Run disposed\n/);
  for (const gone of [x.root, x.sessionDir, xCwd]) assert.equal(fs.existsSync(gone), false, `${gone} removed`);
  assert.deepEqual(fs.readdirSync(t.sessionsRoot).sort(), [path.basename(cwdFolderOf(y.root)), `acp-controller-${RUN_Y}`].sort());
  assert.deepEqual([tree(y.root), tree(y.sessionDir)], yBefore, "the other run is untouched");
});

test("dispose: an abandoned run with a still-present PID exits 3 and removes nothing", async () => {
  t.alive.set(REVIEWER, "reviewer start");
  const x = fixtureRun(RUN_X, { record: { phase: "active", pids: [REVIEWER], sessionIds: ["s1"] }, sessionFiles: ["2026_s1.jsonl"] });
  const before = [tree(x.root), tree(t.sessionsRoot)];
  const out = await disposeRun(RUN_X, controllerDeps());
  assert.equal(out.exitCode, 3);
  assert.ok(out.markdown.includes(`- PID ${REVIEWER} present\n`), out.markdown);
  assert.deepEqual([tree(x.root).filter((p) => p !== "claim-1"), tree(t.sessionsRoot)], before);
});

test("dispose: a kept session file keeps the private root and run.json, exits 3 and names the kept paths", async () => {
  const x = fixtureRun(RUN_X, { record: { phase: "active", pids: [REVIEWER], sessionIds: ["s1"] }, sessionFiles: ["2026_s1.jsonl", "stray.txt"] });
  const recordBefore = fs.readFileSync(path.join(x.root, "run.json"), "utf8");
  const deps = controllerDeps();
  const out = await disposeRun(RUN_X, deps);
  assert.equal(out.exitCode, 3);
  assert.ok(out.markdown.includes(`- session folder cleanup kept: \`${path.join(x.sessionDir, "stray.txt")}\`, \`${x.sessionDir}\`\n- private root \`${x.root}\` and its \`run.json\` kept\n- there is no further CLI path`), out.markdown);
  assert.deepEqual(fs.readdirSync(x.sessionDir), ["stray.txt"], "only the attributed session file was removed");
  assert.equal(fs.readFileSync(path.join(x.root, "run.json"), "utf8"), recordBefore);
  // The claimant superseded the dead holder of claim-0.
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(x.root, "claim-1"), "utf8")), deps.owner);
  assert.equal(fs.statSync(path.join(x.root, "claim-1")).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(x.root).filter((n) => n.startsWith(".claim-")), [], "the winner left no temp file");
});

test("dispose: a run without run.json exits 3, removes nothing and names its folders and processes", async () => {
  t.alive.set(REVIEWER, "reviewer start");
  t.processes = [controllerProcess(REVIEWER, RUN_X)];
  const x = fixtureRun(RUN_X, { record: null, sessionFiles: ["2026_s1.jsonl"] });
  const before = tree(t.sessionsRoot);
  const out = await disposeRun(RUN_X, controllerDeps());
  assert.equal(out.exitCode, 3);
  for (const line of [`- kept folder \`${x.sessionDir}\``, `- kept folder \`${x.root}\``, `- process ${REVIEWER}: \`${controllerProcess(REVIEWER, RUN_X).command}\``]) assert.ok(out.markdown.includes(line), out.markdown);
  assert.match(out.markdown, /no further CLI path/);
  assert.deepEqual(tree(t.sessionsRoot), before);
  assert.ok(fs.existsSync(path.join(x.root, "claim-0")));
});

test("dispose: a setup leftover is removed alone when its owner is gone; a live or unreadable owner refuses and a matched process exits 3, removing nothing", async () => {
  const cases = [
    { name: "owner gone", exitCode: 0, removed: true, line: "- setup leftover `INIT` removed: setup never finished and its owner is gone; nothing was claimed" },
    { name: "owner live", setup: () => t.alive.set(OWNER.pid, OWNER.lstart), exitCode: 2, line: `**Reason:** run claimed by another controller\n\n- run \`${RUN_X}\` is still being set up by a live controller (PID ${OWNER.pid})` },
    { name: "owner start unreadable", setup: () => t.alive.set(OWNER.pid, null), exitCode: 2, line: `**Reason:** owner start time unreadable\n\n- run \`${RUN_X}\` setup owner PID ${OWNER.pid} is present` },
    { name: "matched process", setup: () => (t.processes = [controllerProcess(REVIEWER, RUN_X)]), exitCode: 3, line: `- process ${REVIEWER}: \`${controllerProcess(REVIEWER, RUN_X).command}\`` },
  ];
  for (const c of cases) {
    fs.rmSync(t.tmpRoot, { recursive: true });
    fs.rmSync(t.sessionsRoot, { recursive: true });
    fs.mkdirSync(t.tmpRoot);
    fs.mkdirSync(t.sessionsRoot);
    t.alive.clear();
    t.processes = [];
    const init = fixtureSetup(RUN_X);
    const other = fixtureRun(RUN_Y);
    const otherSetup = fixtureSetup(RUN_Z);
    c.setup?.();
    const before = [tree(t.tmpRoot), tree(t.sessionsRoot)];
    const out = await disposeRun(RUN_X, controllerDeps());
    assert.equal(out.exitCode, c.exitCode, `${c.name}: ${out.markdown}`);
    assert.ok(out.markdown.includes(c.line.replace("INIT", init)), `${c.name}: ${out.markdown}`);
    const expected = c.removed ? before[0].filter((p) => !p.startsWith(path.basename(init))) : before[0];
    assert.deepEqual([tree(t.tmpRoot), tree(t.sessionsRoot)], [expected, before[1]], c.name);
    assert.ok(fs.existsSync(other.root) && fs.existsSync(otherSetup), c.name);
  }
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
