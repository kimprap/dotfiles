// Reconcile contract tests (spec-v3 §7): the public controller entry points
// drive real public acpx runtimes against the scripted ACP agent child. Traffic
// order is asserted from the scripted agent's log; rendered records are
// compared with expected text authored here.
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { main } from "../cli.mjs";
import { resumeReconcile, runReconcile, STOPPED_CAUSE } from "../controller.mjs";
import { observePid } from "../lib/adapter.mjs";
import { privateRootFor, socketDirFor, writeStopRequest } from "../lib/env.mjs";
import { disposeActor, finishRun, leaveRun, openRun, ask, startActor } from "../lib/ports.mjs";
import { validateResult } from "../lib/schema.mjs";
import { processStart } from "../lib/preflight.mjs";
import { OMP_VERSION } from "../lib/versions.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";
import { runWorker } from "../worker.mjs";

const PROMPTS = {
  reviewer: {
    initial: "Goal: {{GOAL}}\nIntent:\n{{INTENT}}\nContext:\n{{CONTEXT}}\nMode: {{MODE}}\nProposal:\n{{PROPOSAL}}\nCounterpart:\n{{COUNTERPART}}\nReturn:\n{{EXAMPLE}}",
    rethink: "Read {{RETHINK_SKILL}} once and rethink.\nProvisional:\n{{PROVISIONAL}}\nProposal:\n{{PROPOSAL}}",
    later: "Proposal:\n{{PROPOSAL}}\nCounterpart:\n{{COUNTERPART}}\n{{BLOCKED_RETRY}}\n{{DISPUTE}}",
    source: "Sources: {{SOURCE_STATUS}}\n{{SOURCES}}",
    reask: "Not accepted: {{DEFECT}}",
    dispute: "Dispute from {{AUTHOR}}:\n{{CITATIONS}}",
  },
  scope: { evaluate: "{{OBJECTIVE}}", continue: "{{CONTINUATION}}", reask: "{{DEFECT}}", normalize: "{{CONCERNS}}" },
};
const ROLES = { a: { model: "scripted/a", thinking: "low" }, b: { model: "scripted/b", thinking: "low" } };
const APPROVAL = { text: "Approved as written.", at: "2026-09-27T01:00:00Z" };

const y = (data) => `yield:${JSON.stringify(data)}`;
const VALID = y({ kind: "review", verdict: "VALID", summary: ["Accepts the proposal"], blocking_issues: [], revision: "none" });
const REVISE = (replacement, issue = "the proposal misses the goal", extra = {}) => y({ kind: "review", verdict: "REVISE", summary: ["Misses the stated goal"], blocking_issues: [issue], correction: { replacement }, preserve: [], ...extra });
const EDITS = (edits) => y({ kind: "review", verdict: "REVISE", summary: ["One word is spelled in the wrong case"], blocking_issues: ["wrong word"], correction: { edits }, preserve: [] });
const VALID_EDIT = y({ kind: "review", verdict: "VALID", summary: ["Accepts the edit", "Wording could be tighter"], blocking_issues: [], revision: "none" });
/** A finalized-shape VALID carrying `notes`. */
const VALID_NOTES = (notes, summary = ["Accepts the proposal"]) => y({ kind: "review", verdict: "VALID", summary, blocking_issues: [], revision: "none", notes });
const sha = (text) => `sha256:${createHash("sha256").update(text).digest("hex")}`;

let t;

beforeEach(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "acpctl-rec-"));
  const sessionsRoot = path.join(dir, "sessions");
  const tmpRoot = path.join(dir, "tmp");
  fs.mkdirSync(sessionsRoot);
  fs.mkdirSync(tmpRoot);
  const plan = path.join(dir, "plan.json");
  const log = path.join(dir, "scripted.log");
  t = { dir, sessionsRoot, tmpRoot, plan, log, launcher: createScriptedLauncher({ dir, plan, log }) };
});

afterEach(() => {
  for (const name of fs.readdirSync(t.tmpRoot)) fs.rmSync(socketDirFor(path.join(t.tmpRoot, name, "home")), { recursive: true, force: true });
  fs.rmSync(t.dir, { recursive: true, force: true });
});

function setPlan(plan) {
  fs.writeFileSync(t.plan, JSON.stringify(plan));
}

function deps(extra = {}) {
  return { ompPath: t.launcher, roles: ROLES, prompts: PROMPTS, sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, env: { PATH: process.env.PATH }, log: () => {}, ...extra };
}

const conversation = (text, extra = {}) => ({ goal: "Choose the page layout", candidate: { identity: "layout v1", text }, intent: ["The human wants a layout that works on phones."], context: ["The page is read on phones."], mode: "conversation", cap: "none", approval: APPROVAL, ...extra });

function artifactRequest(file, extra = {}) {
  return { goal: "Fix the word list", candidate: { identity: "words.txt v1", artifact: file }, intent: ["The human wants the word list fixed."], context: [], mode: "artifact", cap: "none", approval: APPROVAL, ...extra };
}

function events() {
  return fs.existsSync(t.log) ? fs.readFileSync(t.log, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : [];
}

const prompts = (log = events()) => log.filter((e) => e.event === "prompt").map((e) => `${e.model.slice(-1)}:${e.passMarker}`);

/**
 * Every process the scripted agent started has exited, no session folder or socket folder is
 * left, and a run folder is left only holding a finished record (exit 0 or 1, not parked) that
 * waits for its print.
 */
function assertCleanedUp() {
  for (const e of events().filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH", `pid ${e.pid} exited`);
  assert.deepEqual(fs.readdirSync(t.sessionsRoot), []);
  for (const name of fs.readdirSync(t.tmpRoot)) {
    const root = path.join(t.tmpRoot, name);
    assert.ok([0, 1].includes(JSON.parse(fs.readFileSync(path.join(root, "record.json"), "utf8")).exitCode), `${name} holds a finished record`);
    assert.notEqual(JSON.parse(fs.readFileSync(path.join(root, "run.json"), "utf8")).phase, "parked");
    assert.equal(fs.existsSync(socketDirFor(path.join(root, "home"))), false, `${name} socket folder removed`);
  }
}

/** The rendered record without its trailing `## Spend` section. */
function recordOf(markdown) {
  const i = markdown.indexOf("\n## Spend\n");
  assert.ok(i > 0, "record ends with the Spend section");
  return markdown.slice(0, i);
}

/** Writes the fake `omp` (`--version` answers the pin, anything else runs the scripted agent); returns its PATH. */
function fakeOmpPath() {
  const bin = path.join(t.dir, "bin");
  fs.mkdirSync(bin, { recursive: true });
  fs.writeFileSync(path.join(bin, "omp"), `#!/bin/sh\nif [ "$1" = "--version" ]; then echo '${OMP_VERSION}'; exit 0; fi\nexec '${t.launcher}' "$@"\n`, { mode: 0o755 });
  return `${bin}:${process.env.PATH}`;
}

/** `main` options of one CLI call in this suite; `extra` overrides them. */
const cliOptions = (catalog, extra) => ({
  argv: ["reconcile"],
  env: { PATH: fakeOmpPath() },
  sessionsRoot: t.sessionsRoot,
  tmpRoot: t.tmpRoot,
  readModelRoles: async () => ({ ok: true, roles: ROLES }),
  readModelCatalog: async () => ({ ok: true, models: catalog.map(([selector, thinking]) => ({ provider: "scripted", id: selector.slice("scripted/".length), selector, thinking })) }),
  loadPrompts: async () => ({ ok: true, prompts: PROMPTS, sources: {} }),
  log: () => {},
  launchWorker: inProcessWorker,
  ...extra,
});

/**
 * One `reconcile` through the CLI entry: a fake `omp` on PATH answers `--version` and otherwise
 * runs the scripted agent; live roles are ROLES and the model catalog lists `catalog` selectors.
 * The worker runs in this process on the JSON hand-off payload with the injected process world,
 * and its call returns once the record is written. Like the CLI process, it settles the printed
 * run (removing a finished run's folder) after the print.
 */
async function viaCli(request, catalog = [], extra = {}) {
  const out = await main(cliOptions(catalog, { stdinText: JSON.stringify(request), ...extra }));
  await out.settle?.();
  return out;
}

/** The detached worker, run here to its end: this process's PID, which the caller observes as gone. */
async function inProcessWorker(payload, injected) {
  await runWorker(JSON.parse(JSON.stringify(payload)), injected);
  return { pid: process.pid };
}

let callCount = 0;
/**
 * One CLI call as its own process: this PID with a start time of its own, so the claim of an
 * earlier call reads as a gone owner whose PID was reused. `body` is the request object (none: empty stdin).
 */
function command(argv, body, extra = {}) {
  const me = `call ${++callCount}`;
  return viaCli(undefined, [], { argv, stdinText: body === undefined ? "" : JSON.stringify(body), processStart: async (pid) => (pid === process.pid ? me : processStart(pid)), ...extra });
}

const rootOf = (runId) => path.join(t.tmpRoot, `acp-controller-${runId}`);
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hex = (text) => createHash("sha256").update(text).digest("hex");
/** Every path under `dir`, relative and sorted. */
const tree = (dir) => fs.readdirSync(dir, { recursive: true }).map(String).sort();

test("C4: three invalid returns (invalid data, prose-only, failed yield) each get one re-ask; the fourth stops", async () => {
  setPlan({ "scripted/a": ['invalid:{"kind":"review","verdict":"MAYBE"}', "prose", "failed-yield", 'invalid:{"kind":"review","verdict":"REVISE"}'] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:reask", "a:reask", "a:reask"]);
  const text = "Use two columns.";
  assert.equal(
    recordOf(out.markdown),
    [
      "## Review rounds",
      "",
      "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |",
      "|---|---|---|---|---|---|",
      `| 1 | 1 | stop | — | ${sha(text)} | invalid returns exhausted |`,
      "| 2 | 1 | cleanup | — | — | A disposed (observed exit) |",
      "",
      "## Reconcile stopped",
      "",
      "**Candidate**",
      "",
      `- ${sha(text)}`,
      "",
      "**Blocker**",
      "",
      "- invalid returns exhausted: A initial: 4 invalid returns (field `summary` must be an array of 1 to 4 strings; field `blocking_issues` needs at least one entry; REVISE requires an object field `correction`) (step: A initial)",
      "",
      "**Resume from**",
      "",
      "- a new approved Reconcile run from the canonical identity above",
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("C4: an unfinished yield stops without charge or re-ask", async () => {
  setPlan({ "scripted/a": ["unfinished-yield", VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial"]);
  assert.match(out.markdown, /- delivery-uncertain: A initial request closed as delivery-uncertain \(step: A initial\)/);
  assert.doesNotMatch(out.markdown, /## Final proposal/);
  assertCleanedUp();
});

test("C4: an invalid first return is charged and re-asked, never replaced by the later valid reply", async () => {
  setPlan({ "scripted/a": ['invalid:{"kind":"review","verdict":"VALID","correction":{"replacement":"x"}}', VALID, VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0);
  // The invalid candidate's request is closed as invalid; the valid reply only arrives on the re-ask.
  assert.deepEqual(prompts(), ["a:initial", "a:reask", "a:rethink"]);
  assert.match(out.markdown, /## Final proposal\n\n\*\*Proposal\*\*\n\n- Use two columns\.\n/);
});

test("KR5: A starts every outer iteration including closure; B is prompted only after an applicable REVISE", async () => {
  setPlan({ "scripted/a": [VALID, REVISE("Use one column."), VALID], "scripted/b": [VALID, VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later"]);
  const log = events();
  const firstB = log.findIndex((e) => e.model === "scripted/b");
  const revise = log.findIndex((e) => e.event === "prompt" && e.response.includes("REVISE"));
  assert.ok(firstB > revise, "B is created only after A's applicable REVISE");
  assert.match(out.markdown, /\| cleanup \| — \| — \| A, B disposed \(observed exit\) \|\n\n## Final proposal\n\n\*\*Proposal\*\*\n\n- Use one column\.\n/);
  assertCleanedUp();
});

test("models override: an exact request `models` value launches that reviewer on it; an unset role keeps its live pair", async () => {
  setPlan({ "scripted/c": [VALID, REVISE("Use one column."), VALID], "scripted/b": [VALID, VALID] });
  const out = await viaCli(conversation("Use two columns.", { models: { a: "scripted/c:high" } }), [["scripted/c", ["low", "high"]], ["scripted/b", ["low"]]]);
  assert.equal(out.exitCode, 0, out.stdout);
  assert.deepEqual([...new Set(events().filter((e) => e.event === "start").map((e) => e.model))].sort(), ["scripted/b", "scripted/c"]);
  assert.ok(out.stdout.includes("| A | scripted/c | high |"), out.stdout);
  assert.ok(out.stdout.includes("| B | scripted/b | low |"), out.stdout);
  assertCleanedUp();
});

test("KR6: initial → rethink → post-rethink in one session; later reviews skip rethink; source-need continues the pass", async () => {
  const src = path.join(t.dir, "layout-notes.md");
  fs.writeFileSync(src, "phones first\n");
  const need = y({ kind: "source-need", locators: [src], reason: "notes" });
  setPlan({ "scripted/a": [VALID, REVISE("Use one column."), need, VALID], "scripted/b": [VALID, VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "a:source"]);
  const log = events();
  for (const model of ["scripted/a", "scripted/b"]) {
    assert.equal(log.filter((e) => e.event === "session-new" && e.model === model).length, 1, `${model}: one session`);
    assert.equal(new Set(log.filter((e) => e.event === "prompt" && e.model === model).map((e) => e.sessionId)).size, 1, `${model}: every prompt in that session`);
  }
  assertCleanedUp();
});

test("KR8: an edit set applies against the outer base, a later REVISE supersedes, unchanged or non-applicable Corrections are invalid returns", async () => {
  const file = path.join(t.dir, "words.txt");
  fs.writeFileSync(file, "alpha\nbeta\ngamma\n");
  setPlan({
    "scripted/a": [VALID, EDITS([{ old: "beta", new: "BETA" }]), VALID_EDIT, EDITS([{ old: "alpha", new: "alpha" }]), EDITS([{ old: "zeta", new: "ZETA" }]), VALID],
    "scripted/b": [VALID, EDITS([{ old: "gamma", new: "GAMMA" }])],
  });
  const out = await runReconcile(artifactRequest(file), deps());
  assert.equal(out.exitCode, 0);
  // B's edit set replaces A's (never stacked on it); both unusable Corrections were re-asked.
  assert.equal(fs.readFileSync(file, "utf8"), "alpha\nbeta\nGAMMA\n");
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "a:later", "a:reask", "a:reask"]);
  assert.match(out.markdown, /\*\*Current identity\*\*\n\n- sha256:[0-9a-f]{64}\n/);
  assert.ok(out.markdown.includes(`- ${sha("alpha\nbeta\nGAMMA\n")}`));
  // The accepting VALID shows only its summary, never in the Change summary.
  assert.match(out.markdown, /\| VALID<br>• Accepts the edit<br>• Wording could be tighter \|/);
  assertCleanedUp();
});

test("KR9: a VALID without notes ends negotiation; BLOCKED gets one approved-context retry", async () => {
  const blocked = y({ kind: "review", verdict: "BLOCKED", summary: ["Cannot judge column count", "Needs the approved page grid"], blocker: "missing layout spec", resume_with: "the layout spec", revision: "none" });
  setPlan({ "scripted/a": [VALID, blocked, VALID_EDIT] });
  const text = "Use two columns.";
  const out = await runReconcile(conversation(text), deps());
  assert.equal(out.exitCode, 0);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "a:later"]);
  assert.equal(events().some((e) => e.model === "scripted/b"), false, "B never starts");
  assert.equal(
    recordOf(out.markdown),
    [
      "## Review rounds",
      "",
      "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |",
      "|---|---|---|---|---|---|",
      `| 1 | 1 | A | post-rethink | ${sha(text)} | BLOCKED<br>• Cannot judge column count<br>• Needs the approved page grid |`,
      `| 2 | 1 | A | later | ${sha(text)} | VALID<br>• Accepts the edit<br>• Wording could be tighter |`,
      `| 3 | 1 | closure | — | ${sha(text)} | unchanged proposal VALID |`,
      "| 4 | 1 | cleanup | — | — | A disposed (observed exit) |",
      "",
      "## Final proposal",
      "",
      "**Proposal**",
      "",
      "- Use two columns.",
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("KR9: a second BLOCKED stops", async () => {
  const blocked = y({ kind: "review", verdict: "BLOCKED", summary: ["Cannot judge column count", "Needs the approved page grid"], blocker: "missing layout spec", resume_with: "the layout spec" });
  setPlan({ "scripted/a": [VALID, blocked, blocked] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "a:later"]);
  assert.match(out.markdown, /\*\*Blocker\*\*\n\n- persistent BLOCKED: A: Cannot judge column count; Needs the approved page grid \(step: A later\)\n\n\*\*Resume from\*\*\n\n- a new approved Reconcile run from the canonical identity above\n/);
  for (const full of ["missing layout spec", "the layout spec"]) assert.ok(!out.markdown.includes(full), `reviewer text "${full}" is absent`);
  assertCleanedUp();
});

test("review summary: 1–4 single-line points of at most 100 characters, validated for every verdict and never trimmed", () => {
  const bases = {
    VALID: { kind: "review", verdict: "VALID" },
    REVISE: { kind: "review", verdict: "REVISE", blocking_issues: ["why"], correction: { replacement: "new text" } },
    BLOCKED: { kind: "review", verdict: "BLOCKED", blocker: "gap", resume_with: "input" },
  };
  const invalid = { missing: undefined, "empty list": [], "five entries": ["a", "b", "c", "d", "e"], "101 characters": ["x".repeat(101)], "line break": ["one\ntwo"], "empty entry": ["ok", ""], "leading space": [" point"], "trailing space": ["point "] };
  for (const [verdict, base] of Object.entries(bases)) {
    for (const [name, summary] of Object.entries(invalid)) {
      const res = validateResult("review", { ...base, summary }, { mode: "conversation" });
      assert.equal(res.valid, false, `${verdict} ${name} is rejected`);
      assert.ok(res.defects.some((d) => d.includes("`summary`")), `${verdict} ${name} names the summary defect`);
    }
    const summary = ["x".repeat(100), "😀".repeat(100), "c", "d"];
    const res = validateResult("review", { ...base, summary }, { mode: "conversation" });
    assert.equal(res.valid, true, `${verdict} valid summary is admitted: ${res.defects}`);
    assert.deepEqual(res.value.summary, summary);
  }
});

test("KR10: one application per outer iteration is reread, counted and validated; with cap 1 the next iteration is closure-only", async () => {
  const file = path.join(t.dir, "words.txt");
  const runs = path.join(t.dir, "validator-runs");
  fs.writeFileSync(file, "alpha\nbeta\n");
  setPlan({
    "scripted/a": [VALID, EDITS([{ old: "beta", new: "BETA" }]), EDITS([{ old: "alpha", new: "ALPHA" }])],
    "scripted/b": [VALID, VALID, VALID],
  });
  const validate = { argv: [process.execPath, "-e", `require("fs").appendFileSync(${JSON.stringify(runs)}, "run\\n")`] };
  const out = await runReconcile(artifactRequest(file, { cap: 1, validate }), deps());
  assert.equal(out.exitCode, 1);
  assert.equal(fs.readFileSync(file, "utf8"), "alpha\nBETA\n", "only the first accepted change was applied");
  assert.equal(fs.readFileSync(runs, "utf8"), "run\n", "the validator ran once");
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later"]);
  const [base, applied, refused] = [sha("alpha\nbeta\n"), sha("alpha\nBETA\n"), sha("ALPHA\nBETA\n")];
  assert.equal(
    recordOf(out.markdown),
    [
      "## Review rounds",
      "",
      "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |",
      "|---|---|---|---|---|---|",
      `| 1 | 1 | A | post-rethink | ${base} | REVISE<br>• One word is spelled in the wrong case |`,
      `| 2 | 1 | B | post-rethink | ${applied} | VALID<br>• Accepts the proposal |`,
      `| 3 | 1 | apply | — | ${applied} | applied, reread matches (count 1) |`,
      `| 4 | 1 | validate | — | ${applied} | passed |`,
      `| 5 | 2 | cap | — | ${applied} | closure-only: cap 1 reached |`,
      `| 6 | 2 | A | later | ${applied} | REVISE<br>• One word is spelled in the wrong case |`,
      `| 7 | 2 | B | later | ${refused} | VALID<br>• Accepts the proposal |`,
      `| 8 | 2 | stop | — | ${refused} | cap 1 reached; accepted change not applied |`,
      "| 9 | 2 | cleanup | — | — | A, B disposed (observed exit) |",
      "",
      "## Reconcile stopped",
      "",
      "**Candidate**",
      "",
      `- ${applied}`,
      `- ${refused}`,
      "",
      "**Blocker**",
      "",
      "- cap reached: cap 1 reached; the accepted change cannot be applied (step: closure)",
      "",
      "**Resume from**",
      "",
      "- a new approved Reconcile run from the canonical identity above",
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("KR11: an artifact changed between closure VALID and the report stops with both identities after reviewer disposal", async () => {
  const file = path.join(t.dir, "words.txt");
  fs.writeFileSync(file, "alpha\n");
  setPlan({ "scripted/a": [VALID, VALID] });
  let touched = false;
  const touchingObserver = (pid) => {
    if (!touched) {
      touched = true;
      fs.writeFileSync(file, "alpha changed\n");
    }
    return observePid(pid);
  };
  const out = await runReconcile(artifactRequest(file), deps({ observePid: touchingObserver }));
  assert.equal(out.exitCode, 1);
  const [reviewed, observed] = [sha("alpha\n"), sha("alpha changed\n")];
  assert.equal(
    recordOf(out.markdown),
    [
      "## Review rounds",
      "",
      "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |",
      "|---|---|---|---|---|---|",
      `| 1 | 1 | A | post-rethink | ${reviewed} | VALID<br>• Accepts the proposal |`,
      `| 2 | 1 | closure | — | ${reviewed} | unchanged proposal VALID |`,
      "| 3 | 1 | cleanup | — | — | A disposed (observed exit) |",
      `| 4 | 1 | freshness | — | ${observed} | drift |`,
      "",
      "## Reconcile stopped",
      "",
      "**Candidate**",
      "",
      `- ${reviewed}`,
      `- ${observed}`,
      "",
      "**Blocker**",
      "",
      `- artifact changed after review: reviewed ${reviewed}, observed ${observed} (step: final reread)`,
      "",
      "**Resume from**",
      "",
      "- a new approved Reconcile run from the canonical identity above",
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

function parkedScenario(flag) {
  const file = path.join(t.dir, "words.txt");
  fs.writeFileSync(file, "alpha\nbeta\n");
  setPlan({ "scripted/a": [VALID, EDITS([{ old: "beta", new: "BETA" }]), VALID], "scripted/b": [VALID, VALID] });
  const validate = { argv: [process.execPath, "-e", `process.exit(require("fs").existsSync(${JSON.stringify(flag)}) ? 0 : 1)`] };
  return { file, request: artifactRequest(file, { validate }) };
}

/** The parking controller as a claim holder whose process is gone (its PID now runs another start time). */
const EXITED_OWNER = { pid: process.pid, lstart: "Thu Jan  1 00:00:00 1970" };

async function park(flag) {
  const { file, request } = parkedScenario(flag);
  const out = await runReconcile(request, deps({ owner: EXITED_OWNER }));
  assert.equal(out.exitCode, 1);
  assert.match(out.markdown, /## Reconcile stopped/);
  assert.doesNotMatch(out.markdown, /## Final proposal/);
  assert.ok(out.markdown.includes("- failed step `validation`: validator"));
  assert.ok(out.markdown.includes(`- accepted outer base ${sha("alpha\nbeta\n")}`));
  assert.ok(out.markdown.includes(`- Correction ${sha("alpha\nBETA\n")}`));
  const runId = /cli\.mjs resume ([\w-]+)/.exec(out.markdown)[1];
  // Parked: every process exited, the session folder and private root are kept.
  for (const e of events().filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH");
  assert.deepEqual(fs.readdirSync(t.sessionsRoot), [`acp-controller-${runId}`]);
  const root = path.join(t.tmpRoot, `acp-controller-${runId}`);
  assert.ok(fs.existsSync(path.join(root, "state.json")));
  const sessions = Object.fromEntries(events().filter((e) => e.event === "session-new").map((e) => [e.model, e.sessionId]));
  // The run record names its owner, target, accepted identity, spend so far and every reviewer PID and session a crash would leave behind.
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "claim-0"), "utf8")), EXITED_OWNER);
  const record = JSON.parse(fs.readFileSync(path.join(root, "run.json"), "utf8"));
  assert.match(record.identities?.[0] ?? "", /^[0-9a-f]{64}$/);
  assert.deepEqual({ ...record, identities: record.identities.length, spend: record.spend.map((r) => r.actor).sort(), pids: new Set(record.pids), sessionIds: new Set(record.sessionIds) }, {
    runId,
    kind: "reconcile",
    phase: "parked",
    target: "words.txt v1",
    identities: 1,
    spend: ["A", "B"],
    pids: new Set(events().filter((e) => e.event === "start").map((e) => e.pid)),
    sessionIds: new Set(Object.values(sessions)),
  });
  // The parked record waits in the folder word for word, with exit 1.
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "record.json"), "utf8")), { exitCode: 1, markdown: out.markdown });
  return { file, runId, sessions, parkedAt: events().length };
}

test("KR13: a failed validator parks; resume restores the same sessions, retries only validation and reaches Final proposal", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { file, runId, sessions, parkedAt } = await park(flag);
  fs.writeFileSync(flag, "");
  const out = await resumeReconcile(runId, { repair: { authority: "human: validator fixed", step: "validation" } }, deps());
  assert.equal(out.exitCode, 0);
  assert.match(out.markdown, /## Final proposal\n\n\*\*Change summary\*\*/);
  assert.equal(fs.readFileSync(file, "utf8"), "alpha\nBETA\n");
  const after = events().slice(parkedAt);
  assert.equal(after.filter((e) => e.event === "session-new").length, 0, "no fresh session");
  const resumed = after.filter((e) => e.event === "session-resume" && e.ok);
  assert.deepEqual(new Set(resumed.map((e) => e.sessionId)), new Set([sessions["scripted/a"], sessions["scripted/b"]]));
  assert.deepEqual(prompts(after), ["a:later"]);
  assert.ok(out.markdown.includes(`| resume | — | ${sha("alpha\nBETA\n")} | repair authorized (human: validator fixed); retry \`validation\` |`));
  assert.ok(out.markdown.includes(`| validate | — | ${sha("alpha\nBETA\n")} | passed |`));
  assertCleanedUp();
});

test("KR13: resume keeps the parked models when live model roles changed", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { parkedAt, runId } = await park(flag);
  fs.writeFileSync(flag, "");
  const live = { a: { model: "other/a", thinking: "high" }, b: { model: "other/b", thinking: "high" } };
  const out = await resumeReconcile(runId, { repair: { authority: "human: validator fixed", step: "validation" } }, deps({ roles: live }));
  assert.equal(out.exitCode, 0);
  const after = events().slice(parkedAt);
  assert.ok(after.length > 0);
  assert.ok(after.every((e) => e.model === undefined || e.model.startsWith("scripted/")), "no actor starts on the live roles");
  assert.ok(out.markdown.includes("| A | scripted/a | low |"));
  assertCleanedUp();
});

test("KR13: a parked run without recorded models stops instead of restoring on live roles", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { parkedAt, runId } = await park(flag);
  const stateFile = path.join(t.tmpRoot, `acp-controller-${runId}`, "state.json");
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  delete state.models;
  fs.writeFileSync(stateFile, JSON.stringify(state));
  fs.writeFileSync(flag, "");
  const out = await resumeReconcile(runId, { repair: { authority: "human: validator fixed", step: "validation" } }, deps());
  assert.equal(out.exitCode, 1);
  assert.match(out.markdown, /- reviewer identity lost: the parked run records no reviewer models/);
  const after = events().slice(parkedAt);
  assert.equal(after.filter((e) => e.event === "session-new" || e.event === "session-resume" || e.event === "prompt").length, 0);
  assertCleanedUp();
});

test("KR13: when same-session restore fails, resume stops and asks without creating a new session", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { runId, parkedAt } = await park(flag);
  createScriptedLauncher({ dir: t.dir, plan: t.plan, log: t.log, failResume: true });
  const out = await resumeReconcile(runId, { repair: { authority: "human: validator fixed", step: "validation" } }, deps());
  assert.equal(out.exitCode, 1);
  assert.match(out.markdown, /## Reconcile stopped/);
  assert.match(out.markdown, /- reviewer identity lost: reviewer A session `[0-9a-f-]+` could not be restored/);
  const after = events().slice(parkedAt);
  assert.equal(after.filter((e) => e.event === "session-new").length, 0, "no fresh session");
  assert.equal(after.filter((e) => e.event === "prompt").length, 0);
  assertCleanedUp();
});

test("KR13: resume with a recorded or matched PID still present exits 3, keeps run.json and restores no reviewer", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { runId, parkedAt } = await park(flag);
  fs.writeFileSync(flag, "");
  const recordFile = path.join(t.tmpRoot, `acp-controller-${runId}`, "run.json");
  const before = fs.readFileSync(recordFile, "utf8");
  const recorded = JSON.parse(before).pids[0];
  const matched = { pid: 4_000_001, command: `/opt/tools/bin/omp acp --model m --session-dir ${path.join(t.sessionsRoot, `acp-controller-${runId}`)}` };
  const repair = { repair: { authority: "human: validator fixed", step: "validation" } };
  const cases = [
    { extra: { observePid: (pid) => (pid === recorded ? "EPERM" : observePid(pid)) }, line: `- PID ${recorded} EPERM\n` },
    { extra: { listProcesses: async () => [matched], observePid: (pid) => (pid === matched.pid ? "present" : observePid(pid)) }, line: `- PID ${matched.pid} present: \`${matched.command}\`\n` },
  ];
  for (const { extra, line } of cases) {
    const out = await resumeReconcile(runId, repair, deps({ owner: EXITED_OWNER, ...extra }));
    assert.equal(out.exitCode, 3);
    assert.ok(out.markdown.includes(line), out.markdown);
    assert.equal(fs.readFileSync(recordFile, "utf8"), before, "run.json unchanged");
    assert.deepEqual(events().slice(parkedAt), [], "no reviewer restored");
  }
  const out = await resumeReconcile(runId, repair, deps());
  assert.equal(out.exitCode, 0, "the refused attempts left the run resumable");
  assertCleanedUp();
});

/** A parked run through the CLI: the validator fails until `flag` exists. */
async function parkViaCli(flag) {
  const { file, request } = parkedScenario(flag);
  const parked = await command(["reconcile"], request);
  assert.equal(parked.exitCode, 1, parked.stdout);
  const runId = /cli\.mjs resume ([\w-]+)/.exec(parked.stdout)[1];
  const sessions = new Set(events().filter((e) => e.event === "session-new").map((e) => e.sessionId));
  return { file, request, parked, runId, sessions };
}

const repairAt = (at) => ({ repair: { authority: `human: validator fixed at ${at}`, step: "validation" } });

test("RS3 identity: run.json holds the target and the accepted identity before any actor starts; a resume adds its runId-prefixed identity", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { file, request, runId } = await parkViaCli(flag);
  // The request's canonical JSON without `approval`, written out by hand.
  const canonical = `{"candidate":{"artifact":${JSON.stringify(file)},"identity":"words.txt v1"},"cap":"none","context":[],"goal":"Fix the word list","intent":["The human wants the word list fixed."],"mode":"artifact","validate":{"argv":${JSON.stringify(request.validate.argv)}}}`;
  const first = hex(`reconcile\0${canonical}`);
  const starts = events().filter((e) => e.event === "start");
  assert.ok(starts.length > 0);
  for (const s of starts) assert.deepEqual([s.run?.target, s.run?.identities], ["words.txt v1", [first]], "seen by the actor as it starts");
  fs.writeFileSync(flag, "");
  const at = events().length;
  const resumed = await command(["resume", runId], repairAt("2026-10-07T05:00:00Z"));
  assert.equal(resumed.exitCode, 0, resumed.stdout);
  const second = hex(`resume\0${runId}\0{"repair":{"authority":"human: validator fixed at 2026-10-07T05:00:00Z","step":"validation"}}`);
  const restarts = events().slice(at).filter((e) => e.event === "start");
  assert.ok(restarts.length > 0);
  for (const s of restarts) assert.deepEqual(s.run?.identities, [first, second], "the resume identity is accepted before any actor starts");
});

test("RS6: cleanup not established writes an exit 3 record the call prints; the folder stays, other runs and roles refuse, the same command starts nothing, dispose works", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const request = conversation("Use two columns.");
  const failed = await command(["reconcile"], request, { observePid: () => "present" });
  assert.equal(failed.exitCode, 3, failed.stdout);
  const runId = fs.readdirSync(t.tmpRoot)[0].replace("acp-controller-", "");
  assert.ok(failed.stdout.includes(`dispose it only on the human's explicit instruction: \`cli.mjs dispose ${runId}\``), failed.stdout);
  assert.deepEqual(readJson(path.join(rootOf(runId), "record.json")), { exitCode: 3, markdown: failed.stdout });
  const started = events().length;
  const other = await command(["reconcile"], conversation("Use one column.", { candidate: { identity: "layout v2", text: "Use one column." } }));
  const roles = await command(["roles"]);
  const same = await command(["reconcile"], request);
  for (const out of [other, roles, same]) {
    assert.equal(out.exitCode, 2, out.stdout);
    assert.ok(out.stdout.includes(`**Reason:** abandoned controller run\n\n- run \`${runId}\`\n`), out.stdout);
    assert.ok(out.stdout.includes(`\`cli.mjs dispose ${runId}\``), out.stdout);
  }
  assert.equal(events().length, started, "no second run started");
  const disposed = await command(["dispose", runId]);
  assert.equal(disposed.exitCode, 0, disposed.stdout);
  assert.match(disposed.stdout, /^## Run disposed\n/);
  assert.deepEqual([fs.readdirSync(t.tmpRoot), fs.readdirSync(t.sessionsRoot)], [[], []]);
});

test("RS7 spend: run.json holds each actor's spend so far after every reviewer turn and every disposal", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  const tokens = (rows, actor) => rows.filter((r) => r.actor === actor).map((r) => r.tokensBase + r.tokensLast);
  // Each prompt event carries run.json as the actor saw it: the turns before it are counted.
  const seen = events().filter((e) => e.event === "prompt").map((e) => tokens(e.run.spend, "A"));
  assert.deepEqual(seen, [[], [100]]);
  const runId = fs.readdirSync(t.tmpRoot)[0].replace("acp-controller-", "");
  const record = readJson(path.join(rootOf(runId), "run.json"));
  assert.deepEqual(tokens(record.spend, "A"), [200], "after disposal");
  assert.ok(out.markdown.endsWith("| Total | | | 200 | 0.02 USD |\n"), "the record's Spend stays the account");
  assertCleanedUp();
});

test("RS9: a parked record prints with exit 1 and stays; rerunning the original command prints the same parked record and starts nothing", async () => {
  const { request, parked, runId } = await parkViaCli(path.join(t.dir, "validator-ready"));
  const root = rootOf(runId);
  assert.deepEqual(readJson(path.join(root, "record.json")), { exitCode: 1, markdown: parked.stdout });
  assert.ok(fs.existsSync(path.join(root, "state.json")));
  const at = events().length;
  const again = await command(["reconcile"], request);
  assert.equal(again.exitCode, 1);
  assert.equal(again.stdout, parked.stdout);
  assert.equal(events().length, at, "nothing started");
  assert.ok(fs.existsSync(path.join(root, "record.json")) && fs.existsSync(path.join(root, "state.json")));
});

test("RS9: resume continues with the same reviewers; after a re-park the same resume prints the new parked record and resumes nothing, while a new repair resumes it", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { parked, runId, sessions } = await parkViaCli(flag);
  const resumedSessions = (from) => events().slice(from).filter((e) => e.event === "session-resume" && e.ok).map((e) => e.sessionId);
  const first = repairAt("2026-10-07T05:00:00Z");
  const at1 = events().length;
  const reparked = await command(["resume", runId], first);
  assert.equal(reparked.exitCode, 1, reparked.stdout);
  assert.notEqual(reparked.stdout, parked.stdout);
  assert.deepEqual(new Set(resumedSessions(at1)), sessions, "the same reviewers");
  assert.deepEqual(readJson(path.join(rootOf(runId), "record.json")), { exitCode: 1, markdown: reparked.stdout });
  const at2 = events().length;
  const again = await command(["resume", runId], first);
  assert.equal(again.exitCode, 1);
  assert.equal(again.stdout, reparked.stdout);
  assert.equal(events().length, at2, "never resumes twice");
  fs.writeFileSync(flag, "");
  const done = await command(["resume", runId], repairAt("2026-10-07T06:00:00Z"));
  assert.equal(done.exitCode, 0, done.stdout);
  assert.match(done.stdout, /## Final proposal/);
  assert.deepEqual(new Set(resumedSessions(at2)), sessions);
  assertCleanedUp();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), [], "the printed finished run's folder is removed");
});

test("RS9: the caller's resume checks refuse a step mismatch, a present PID and a run that is not parked, changing nothing", async () => {
  const { runId } = await parkViaCli(path.join(t.dir, "validator-ready"));
  const root = rootOf(runId);
  const recordFile = path.join(root, "run.json");
  const recorded = readJson(recordFile).pids[0];
  const present = { observePid: (pid) => (pid === recorded ? "present" : observePid(pid)) };
  const at = events().length;
  const unchanged = () => [tree(root), fs.readFileSync(recordFile, "utf8"), fs.readFileSync(path.join(root, "record.json"), "utf8")];
  let before = unchanged();

  const mismatch = await command(["resume", runId], { repair: { authority: "human: retry the review at 2026-10-07T05:00:00Z", step: "A later" } });
  assert.equal(mismatch.exitCode, 1, mismatch.stdout);
  assert.ok(mismatch.stdout.includes("the parked failed step is `validation`, not `A later`"), mismatch.stdout);
  assert.ok(mismatch.stdout.includes(`run \`${runId}\` stays parked`), mismatch.stdout);
  assert.deepEqual(unchanged(), before, "no claim, no identity, nothing removed");

  const pid = await command(["resume", runId], repairAt("2026-10-07T05:00:00Z"), present);
  assert.equal(pid.exitCode, 3, pid.stdout);
  assert.ok(pid.stdout.includes(`- PID ${recorded} present\n`) && pid.stdout.includes("resume again only after these PIDs exit"), pid.stdout);
  assert.deepEqual(unchanged(), before, "the phase stays `parked`");

  fs.writeFileSync(recordFile, JSON.stringify({ ...readJson(recordFile), phase: "active" }));
  before = unchanged();
  const notParked = await command(["resume", runId], repairAt("2026-10-07T05:00:00Z"), present);
  assert.equal(notParked.exitCode, 2, notParked.stdout);
  assert.ok(notParked.stdout.includes(`- run \`${runId}\` is not parked (phase \`active\`)\n- dispose it only on the human's explicit instruction: \`cli.mjs dispose ${runId}\`\n`), notParked.stdout);
  assert.deepEqual(unchanged(), before, "no exit 2 record; the class is unchanged");
  assert.equal(events().length, at, "nothing launched");
});

test("RS9: a resume of a finished run exits 2 naming both ways to print its record, launches nothing and does not dispose it", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  const runId = fs.readdirSync(t.tmpRoot)[0].replace("acp-controller-", "");
  const at = events().length;
  const refused = await command(["resume", runId], repairAt("2026-10-07T05:00:00Z"));
  assert.equal(refused.exitCode, 2, refused.stdout);
  assert.ok(refused.stdout.includes(`- run \`${runId}\` has finished; its record waits in its folder\n- print its record: rerun the original request, or \`cli.mjs stop ${runId}\`\n`), refused.stdout);
  assert.equal(events().length, at);
  assert.deepEqual(readJson(path.join(rootOf(runId), "record.json")), { exitCode: 0, markdown: out.markdown });
});

test("RS9: a rerun of an accepted resume whose run is abandoned exits 2 naming dispose without an exit 3 record; a new repair while a resume is live exits 2 naming the run", async () => {
  const { runId } = await parkViaCli(path.join(t.dir, "validator-ready"));
  const accepted = repairAt("2026-10-07T05:00:00Z");
  assert.equal((await command(["resume", runId], accepted)).exitCode, 1, "re-parked");
  const root = rootOf(runId);
  const recorded = readJson(path.join(root, "run.json")).pids[0];
  const at = events().length;
  const abandoned = await command(["resume", runId], accepted, { observePid: (pid) => (pid === recorded ? "present" : observePid(pid)) });
  assert.equal(abandoned.exitCode, 2, abandoned.stdout);
  assert.ok(abandoned.stdout.includes(`\`cli.mjs dispose ${runId}\``), abandoned.stdout);
  assert.doesNotMatch(abandoned.stdout, /resume again only after/);
  // The last resume's worker is still running: its claim names a live PID other than this caller.
  const last = fs.readdirSync(root).filter((n) => /^claim-\d+$/.test(n)).sort((a, b) => Number(a.slice(6)) - Number(b.slice(6))).at(-1);
  const worker = { pid: 4_000_003, lstart: "resume worker start" };
  fs.writeFileSync(path.join(root, last), JSON.stringify(worker));
  const live = await command(["resume", runId], repairAt("2026-10-07T06:00:00Z"), {
    observePid: (pid) => (pid === worker.pid ? "present" : observePid(pid)),
    processStart: async (pid) => (pid === worker.pid ? worker.lstart : processStart(pid)),
  });
  assert.equal(live.exitCode, 2, live.stdout);
  assert.ok(live.stdout.includes(`- run \`${runId}\` is owned by a live controller (PID ${worker.pid})\n`), live.stdout);
  assert.equal(events().length, at, "nothing launched");
});

test("RS10 parked/resume: a resume with a new identity and the parked failed step resumes the parked run", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { runId, sessions } = await parkViaCli(flag);
  fs.writeFileSync(flag, "");
  const at = events().length;
  const out = await command(["resume", runId], repairAt("2026-10-07T05:00:00Z"));
  assert.equal(out.exitCode, 0, out.stdout);
  assert.match(out.stdout, /## Final proposal/);
  assert.deepEqual(new Set(events().slice(at).filter((e) => e.event === "session-resume" && e.ok).map((e) => e.sessionId)), sessions);
  assert.deepEqual(prompts(events().slice(at)), ["a:later"]);
  assertCleanedUp();
});

// ------------------------------------------------------------ run survival: real caller and worker processes

const CLI_URL = new URL("../cli.mjs", import.meta.url).href;
const CLI_PATH = fileURLToPath(CLI_URL);
const WORKER_PATH = fileURLToPath(new URL("../worker.mjs", import.meta.url));
/**
 * One CLI call as its own process: `main` with this suite's roots, roles and prompts and the real
 * detached worker; `c.hold`, when set, is carried across the hand-off as the payload's test-only hold.
 */
const CALLER = [
  "const c = JSON.parse(process.env.CALLER_CONFIG);",
  "const { main } = await import(c.cli);",
  "const w = await import(c.worker);",
  "const launchWorker = (payload) => w.launchWorker(c.hold ? { ...payload, hold: c.hold } : payload);",
  "const out = await main({ argv: c.argv, env: { PATH: c.path }, sessionsRoot: c.sessionsRoot, tmpRoot: c.tmpRoot, readModelRoles: async () => ({ ok: true, roles: c.roles }), loadPrompts: async () => ({ ok: true, prompts: c.prompts, sources: {} }), launchWorker });",
  "await new Promise((resolve) => process.stdout.write(out.stdout, resolve));",
  "process.exitCode = out.exitCode;",
  "await out.settle?.();",
].join("\n");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls `probe` until it returns a truthy value, which it returns; the cap only keeps a broken run from hanging the suite. */
async function until(probe, what, ms = 60_000) {
  const end = Date.now() + ms;
  for (;;) {
    const value = await probe();
    if (value) return value;
    if (Date.now() > end) throw new Error(`timed out waiting for ${what}`);
    await sleep(20);
  }
}

const exited = (pid) => until(() => observePid(pid) === "ESRCH", `PID ${pid} to exit`);
const starts = (log = events()) => log.filter((e) => e.event === "start");

/**
 * One CLI call as a real process in its own process group, the way OMP's bash runs a command;
 * `body` is its stdin. `call.exit` resolves `{ code, signal }` once its output is read.
 */
function spawnCaller(argv, body, hold) {
  const config = { cli: CLI_URL, worker: new URL("../worker.mjs", import.meta.url).href, argv, path: fakeOmpPath(), sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, roles: ROLES, prompts: PROMPTS, hold };
  const child = spawn(process.execPath, ["--input-type=module", "-e", CALLER], { detached: true, stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, CALLER_CONFIG: JSON.stringify(config) } });
  const call = { child, stdout: "", stderr: "" };
  child.stdout.setEncoding("utf8").on("data", (chunk) => {
    call.stdout += chunk;
  });
  child.stderr.setEncoding("utf8").on("data", (chunk) => {
    call.stderr += chunk;
  });
  call.exit = new Promise((resolve) => child.on("close", (code, signal) => resolve({ code, signal })));
  child.stdin.end(JSON.stringify(body));
  return call;
}

/** The runId and worker PID from the call's hand-off notice. */
async function noticeOf(call) {
  const m = await until(() => /acp-controller: run (\S+) runs in worker PID (\d+);/.exec(call.stderr), "the hand-off notice");
  return { runId: m[1], worker: Number(m[2]) };
}

/** The process table: `{ pid, ppid, command }`. */
function processTable() {
  return execFileSync("ps", ["-ww", "-A", "-o", "pid=,ppid=,command="], { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((line) => /^\s*(\d+)\s+(\d+)\s(.*)$/.exec(line))
    .map((m) => ({ pid: Number(m[1]), ppid: Number(m[2]), command: m[3] }));
}

/** Every process below `root`, found by a ppid walk. */
function descendants(root) {
  const table = processTable();
  const found = [];
  for (let queue = [root]; queue.length; ) {
    const parent = queue.shift();
    for (const p of table) if (p.ppid === parent) found.push(p) && queue.push(p.pid);
  }
  return found;
}

/**
 * Kills `call` the way OMP kills a bash call: SIGTERM, SIGKILL after 75 ms and SIGKILL again
 * after 150 ms, each to the call's process group and to every descendant a ppid walk finds then.
 * Returns every descendant PID it signalled.
 */
async function ompKill(call) {
  const signalled = new Set();
  const send = (target, signal) => {
    try {
      process.kill(target, signal);
    } catch {}
  };
  const wave = (signal) => {
    const below = descendants(call.child.pid);
    send(-call.child.pid, signal);
    for (const p of below) {
      send(p.pid, signal);
      signalled.add(p.pid);
    }
  };
  wave("SIGTERM");
  await sleep(75);
  wave("SIGKILL");
  await sleep(150);
  wave("SIGKILL");
  return [...signalled];
}

/** One CLI call through `main` that launches no worker and is not yet settled: the test settles it after every print. */
function unsettled(argv, stdinText, lines) {
  const me = `call ${++callCount}`;
  return main(cliOptions([], { argv, stdinText, processStart: async (pid) => (pid === process.pid ? me : processStart(pid)), log: (line) => lines.push(line), launchWorker: () => assert.fail("this call launches no worker") }));
}

/** The three notice lines for a run in `worker` on target `layout v1` (run survival §4). */
const noticeLines = (runId, worker, target = "layout v1") => [
  `acp-controller: run ${runId} runs in worker PID ${worker}; target: ${target}`,
  "acp-controller: If this call ends without a record, run this same command again; it attaches to this run and starts nothing.",
  `acp-controller: Stop it only on the human's instruction: \`node ${CLI_PATH} stop ${runId}\`.`,
];

test("RS1: a caller killed the way OMP kills a call leaves its worker running; the same command again prints the identical record once, and one run with one set of actors existed", async () => {
  setPlan({ "scripted/a": [`slow:1500:${VALID}`, VALID] });
  const request = conversation("Use two columns.");
  const first = spawnCaller(["reconcile"], request);
  const { runId, worker } = await noticeOf(first);
  await until(() => prompts().length === 1, "the first reviewer turn");
  const signalled = await ompKill(first);
  assert.notEqual((await first.exit).signal, null, "the call was killed");
  for (const pid of signalled) await exited(pid);
  assert.equal(observePid(worker), "present", "the kill never reached the worker");
  const recordFile = path.join(rootOf(runId), "record.json");
  await until(() => fs.existsSync(recordFile), "the worker's record");
  await exited(worker);
  const record = readJson(recordFile);
  assert.equal(record.exitCode, 0, record.markdown);
  const again = spawnCaller(["reconcile"], request);
  assert.equal((await again.exit).code, record.exitCode);
  assert.equal(again.stdout, record.markdown, "the identical record, printed once");
  assert.deepEqual(fs.readdirSync(t.tmpRoot), [], "the printed finished run's folder is removed");
  assert.ok(starts().length > 0 && starts().every((s) => s.run?.runId === runId), "every actor belongs to the one run");
  assert.equal(events().filter((e) => e.event === "session-new").length, new Set(starts().map((s) => s.model)).size, "one session per actor: no second set");
  assert.equal(prompts().length, 2, "no turn ran twice");
  for (const s of starts()) await exited(s.pid);
  assertCleanedUp();
});

/** A test-only hand-off hold at `at` (worker.mjs `hold`); `release` lets a held worker go on. */
function handOffHold(at) {
  const hold = { at, ready: path.join(t.dir, `hold-${at}-ready`), release: path.join(t.dir, `hold-${at}-release`) };
  return { hold, reached: () => until(() => fs.existsSync(hold.ready), `the ${at} hold`), release: () => fs.writeFileSync(hold.release, "") };
}

test("RS2: a kill while the helper still parents its worker ends the worker before it publishes anything; no folder, claim or identity is left and the next launch runs", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const request = conversation("Use two columns.");
  const { hold, reached } = handOffHold("helper");
  const first = spawnCaller(["reconcile"], request, hold);
  await reached();
  const below = descendants(first.child.pid);
  const signalled = await ompKill(first);
  await first.exit;
  for (const pid of signalled) await exited(pid);
  assert.deepEqual(below.map((p) => p.command.slice(p.command.indexOf(WORKER_PATH) + WORKER_PATH.length + 1).split(" ")[0]).sort(), ["helper", "worker"], "the walk found the helper and its worker, both now exited");
  assert.deepEqual([fs.readdirSync(t.tmpRoot), fs.readdirSync(t.sessionsRoot)], [[], []], "no folder, setup folder, claim or identity");
  assert.deepEqual(events(), [], "no actor started");
  const next = await command(["reconcile"], request);
  assert.equal(next.exitCode, 0, next.stdout);
  assert.equal(new Set(starts().map((s) => s.run?.runId)).size, 1, "one run");
  for (const s of starts()) await exited(s.pid);
  assertCleanedUp();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), [], "no abandoned run is left");
});

test("RS2: a kill after the helper exited leaves the waiting worker running; it publishes one identity and a rerun attaches; no abandoned or second run", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const request = conversation("Use two columns.");
  const { hold, reached, release } = handOffHold("worker");
  const first = spawnCaller(["reconcile"], request, hold);
  const { runId, worker } = await noticeOf(first);
  await reached();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), [], "nothing is published before the kill");
  for (const pid of await ompKill(first)) await exited(pid);
  assert.equal(observePid(worker), "present", "the kill never reached the worker");
  release();
  const runFile = path.join(rootOf(runId), "run.json");
  await until(() => fs.existsSync(runFile), "the worker's run");
  assert.equal(readJson(runFile).identities.length, 1);
  const lines = [];
  const again = await command(["reconcile"], request, { log: (line) => lines.push(line), launchWorker: () => assert.fail("an attaching call launches no worker") });
  assert.equal(again.exitCode, 0, again.stdout);
  assert.deepEqual(lines, noticeLines(runId, worker));
  await exited(worker);
  assert.ok(starts().every((s) => s.run?.runId === runId), "one run");
  for (const s of starts()) await exited(s.pid);
  assertCleanedUp();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), [], "no abandoned run is left");
});

test("RS3 live: the same command and a reordered, reformatted copy with a new approval time attach to the live run, wait and print its record; nothing else starts", async () => {
  setPlan({ "scripted/a": [`slow:2000:${VALID}`, VALID] });
  const request = conversation("Use two columns.");
  const first = spawnCaller(["reconcile"], request);
  const { runId, worker } = await noticeOf(first);
  await until(() => prompts().length === 1, "the first reviewer turn");
  for (const pid of await ompKill(first)) await exited(pid);
  const { approval, candidate, ...rest } = request;
  const copy = `{\n  "approval": {"at": "2026-10-07T09:00:00Z", "text": "approved again"},\n${Object.entries(rest).reverse().map(([k, v]) => `  ${JSON.stringify(k)} :  ${JSON.stringify(v)}`).join(",\n")},\n  "candidate": {"text": ${JSON.stringify(candidate.text)}, "identity": ${JSON.stringify(candidate.identity)}}\n}\n`;
  const lines = [[], []];
  const [same, reordered] = await Promise.all([unsettled(["reconcile"], JSON.stringify(request), lines[0]), unsettled(["reconcile"], copy, lines[1])]);
  const record = readJson(path.join(rootOf(runId), "record.json"));
  for (const out of [same, reordered]) assert.deepEqual({ exitCode: out.exitCode, markdown: out.stdout }, record);
  for (const notice of lines) assert.deepEqual(notice, noticeLines(runId, worker));
  await Promise.all([same.settle(), reordered.settle()]);
  assert.ok(starts().every((s) => s.run?.runId === runId && s.run.target === "layout v1" && s.run.identities.length === 1), "one run; its identity and target were in the folder before each actor started");
  assert.equal(prompts().length, 2);
  await exited(worker);
  for (const s of starts()) await exited(s.pid);
  assertCleanedUp();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), []);
});

test("RS7 kill: SIGKILL of the worker mid-run makes the waiting call exit 3 naming the abandoned run and its spend; the same command exits 2 naming dispose and starts nothing; dispose works as today and reports the spend recorded before the kill", async () => {
  setPlan({ "scripted/a": [VALID, `slow:60000:${VALID}`] });
  const request = conversation("Use two columns.");
  const call = spawnCaller(["reconcile"], request);
  const { runId, worker } = await noticeOf(call);
  await until(() => prompts().length === 2, "the second reviewer turn");
  const spend = readJson(path.join(rootOf(runId), "run.json")).spend;
  assert.deepEqual(spend.map((r) => r.tokensBase + r.tokensLast), [100], "the first turn's spend is recorded");
  process.kill(worker, "SIGKILL");
  assert.equal((await call.exit).code, 3, call.stdout);
  assert.match(call.stdout, /^## Controller run abandoned\n/);
  for (const line of [`run \`${runId}\``, "spend so far: 100 tokens, 0.01 USD", `\`cli.mjs dispose ${runId}\``]) assert.ok(call.stdout.includes(line), call.stdout);
  const at = events().length;
  const again = await command(["reconcile"], request);
  assert.equal(again.exitCode, 2, again.stdout);
  assert.ok(again.stdout.includes(`\`cli.mjs dispose ${runId}\``), again.stdout);
  assert.equal(events().length, at, "no second run started");
  // The actors outlive their worker under their acpx queue owners (no idle expiry): dispose finds them present and removes nothing, as today.
  const actors = starts().map((s) => s.pid).filter((pid) => observePid(pid) === "present");
  assert.ok(actors.length > 0);
  const blocked = await command(["dispose", runId]);
  assert.equal(blocked.exitCode, 3, blocked.stdout);
  for (const pid of actors) assert.ok(blocked.stdout.includes(`PID ${pid}`), blocked.stdout);
  // This test started those queue owners (through its call's worker), so it ends them; each actor then exits.
  const owners = processTable().filter((p) => actors.includes(p.pid)).map((p) => processTable().find((q) => q.pid === p.ppid && q.command.includes("__queue-owner"))?.pid);
  for (const pid of owners) if (pid) process.kill(pid, "SIGTERM");
  for (const pid of [...actors, ...owners.filter(Boolean)]) await exited(pid);
  const disposed = await command(["dispose", runId]);
  assert.equal(disposed.exitCode, 0, disposed.stdout);
  assert.ok(disposed.stdout.endsWith("| Total | | | 100 | 0.01 USD |\n"), disposed.stdout);
  assert.deepEqual([fs.readdirSync(t.tmpRoot), fs.readdirSync(t.sessionsRoot)], [[], []]);
});

test("RS8: stop <runId> during a pending reviewer turn cancels it without its reply and resends nothing; it prints the stopped record (exit 1) after every actor's observed exit and the folder goes after the print", async () => {
  setPlan({ "scripted/a": [`slow:60000:${VALID}`, VALID] });
  const first = spawnCaller(["reconcile"], conversation("Use two columns."));
  const { runId, worker } = await noticeOf(first);
  await until(() => prompts().length === 1, "the pending reviewer turn");
  for (const pid of await ompKill(first)) await exited(pid);
  const began = Date.now();
  const out = await unsettled(["stop", runId], "", []);
  assert.ok(Date.now() - began < 30_000, "the pending reply was not awaited");
  assert.equal(out.exitCode, 1, out.stdout);
  assert.ok(out.stdout.includes(STOPPED_CAUSE), out.stdout);
  assert.deepEqual(readJson(path.join(rootOf(runId), "record.json")), { exitCode: 1, markdown: out.stdout }, "nothing is removed before the print");
  for (const s of starts()) assert.equal(observePid(s.pid), "ESRCH", `actor ${s.pid} exited before the record`);
  assert.deepEqual(events().filter((e) => e.event === "cancel").length, 1);
  assert.deepEqual(events().filter((e) => e.event === "prompt-end").map((e) => e.stopReason), ["cancelled"]);
  assert.equal(prompts().length, 1, "nothing resent");
  await out.settle();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), [], "the folder is removed after the print");
  await exited(worker);
  assertCleanedUp();
});

test("RS8: the request form `stop reconcile` with a rebuilt request that changed one word stops the run of its target", async () => {
  setPlan({ "scripted/a": [`slow:60000:${VALID}`, VALID] });
  const first = spawnCaller(["reconcile"], conversation("Use two columns."));
  const { runId, worker } = await noticeOf(first);
  await until(() => prompts().length === 1, "the pending reviewer turn");
  for (const pid of await ompKill(first)) await exited(pid);
  const rebuilt = conversation("Use two columns.", { intent: ["The human wants a layout that works on tablets."] });
  const out = await unsettled(["stop", "reconcile"], JSON.stringify(rebuilt), []);
  assert.equal(out.exitCode, 1, out.stdout);
  assert.deepEqual(readJson(path.join(rootOf(runId), "record.json")), { exitCode: 1, markdown: out.stdout });
  assert.ok(out.stdout.includes(STOPPED_CAUSE), out.stdout);
  await out.settle();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), []);
  await exited(worker);
  assertCleanedUp();
});

test("RS8: a stop sent during the validation step takes effect only after that step ends and does not park", async () => {
  const [started, ended] = ["validator-started", "validator-ended"].map((n) => path.join(t.dir, n));
  const file = path.join(t.dir, "words.txt");
  fs.writeFileSync(file, "alpha\nbeta\n");
  setPlan({ "scripted/a": [VALID, EDITS([{ old: "beta", new: "BETA" }]), VALID], "scripted/b": [VALID, VALID] });
  // A failing validator: without the stop this run parks.
  const script = `const fs = require("fs"); fs.writeFileSync(${JSON.stringify(started)}, ""); setTimeout(() => { fs.writeFileSync(${JSON.stringify(ended)}, ""); process.exit(1); }, 1000);`;
  const running = runReconcile(artifactRequest(file, { validate: { argv: [process.execPath, "-e", script] } }), deps());
  await until(() => fs.existsSync(started), "the validation step");
  const [folder] = fs.readdirSync(t.tmpRoot);
  assert.equal(await writeStopRequest(privateRootFor(folder.slice("acp-controller-".length), t.tmpRoot), new Date()), "written");
  const out = await running;
  assert.ok(fs.existsSync(ended), "the step ran to its end");
  assert.equal(out.exitCode, 1, out.markdown);
  assert.ok(out.markdown.includes(STOPPED_CAUSE), out.markdown);
  assert.doesNotMatch(out.markdown, /cli\.mjs resume/);
  const root = path.join(t.tmpRoot, folder);
  assert.equal(fs.existsSync(path.join(root, "state.json")), false, "not parked");
  assert.notEqual(readJson(path.join(root, "run.json")).phase, "parked");
  assertCleanedUp();
});

test("RS9 worker: resume runs in a worker on the same reviewers; the original request and the same resume, run while it is live, wait and print the resumed run's record", async () => {
  const flag = path.join(t.dir, "validator-ready");
  const { request, runId, sessions } = await parkViaCli(flag);
  setPlan({ "scripted/a": [VALID, EDITS([{ old: "beta", new: "BETA" }]), `slow:1500:${VALID}`], "scripted/b": [VALID, VALID] });
  fs.writeFileSync(flag, "");
  const repair = repairAt("2026-10-07T05:00:00Z");
  const at = events().length;
  const resume = spawnCaller(["resume", runId], repair);
  const { worker } = await noticeOf(resume);
  await until(() => prompts(events().slice(at)).length === 1, "the resumed reviewer turn");
  for (const pid of await ompKill(resume)) await exited(pid);
  const lines = [[], []];
  const [original, again] = await Promise.all([unsettled(["reconcile"], JSON.stringify(request), lines[0]), unsettled(["resume", runId], JSON.stringify(repair), lines[1])]);
  const record = readJson(path.join(rootOf(runId), "record.json"));
  assert.equal(record.exitCode, 0, record.markdown);
  assert.match(record.markdown, /## Final proposal/);
  for (const out of [original, again]) assert.deepEqual({ exitCode: out.exitCode, markdown: out.stdout }, record);
  for (const notice of lines) assert.deepEqual(notice, noticeLines(runId, worker, "words.txt v1"));
  await Promise.all([original.settle(), again.settle()]);
  const after = events().slice(at);
  assert.deepEqual(new Set(after.filter((e) => e.event === "session-resume" && e.ok).map((e) => e.sessionId)), sessions, "the same reviewers");
  assert.equal(after.filter((e) => e.event === "session-new").length, 0);
  assert.deepEqual(prompts(after), ["a:later"], "resumed once");
  await exited(worker);
  for (const s of starts()) await exited(s.pid);
  assertCleanedUp();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), []);
});

test("RS9 worker: a new repair whose worker started and then finds another identity's resume holding the run live exits 2, names the run and never prints that resume's record", async () => {
  const { runId } = await parkViaCli(path.join(t.dir, "validator-ready"));
  const root = rootOf(runId);
  const other = { pid: 4_000_004, lstart: "other resume worker" };
  const at = events().length;
  const me = `call ${++callCount}`;
  const out = await viaCli(undefined, [], {
    argv: ["resume", runId],
    stdinText: JSON.stringify(repairAt("2026-10-07T06:00:00Z")),
    observePid: (pid) => (pid === other.pid ? "present" : observePid(pid)),
    processStart: async (pid) => (pid === process.pid ? me : pid === other.pid ? other.lstart : processStart(pid)),
    // Once this worker has started, another resume takes claim n+1, accepts its identity and writes its record.
    launchWorker: async (payload, injected) => {
      const next = fs.readdirSync(root).filter((n) => /^claim-\d+$/.test(n)).length;
      fs.writeFileSync(path.join(root, `claim-${next}`), JSON.stringify(other));
      const record = readJson(path.join(root, "run.json"));
      fs.writeFileSync(path.join(root, "run.json"), JSON.stringify({ ...record, identities: [...record.identities, hex("another resume")] }));
      fs.writeFileSync(path.join(root, "record.json"), JSON.stringify({ exitCode: 0, markdown: "## Final proposal\n\nthe other resume\n" }));
      return inProcessWorker(payload, injected);
    },
  });
  assert.equal(out.exitCode, 2, out.stdout);
  assert.ok(out.stdout.includes(`- run \`${runId}\` is owned by a live controller (PID ${other.pid})\n`), out.stdout);
  assert.doesNotMatch(out.stdout, /the other resume/);
  assert.equal(events().length, at, "no actor started");
});

test("RS11: right after the hand-off stderr holds the three-line notice while the run works; stdout holds only the record", async () => {
  setPlan({ "scripted/a": [`slow:1000:${VALID}`, VALID] });
  const call = spawnCaller(["reconcile"], conversation("Use two columns."));
  const { runId, worker } = await noticeOf(call);
  await until(() => call.stderr.split("\n").length > 3, "the whole notice");
  assert.equal(fs.existsSync(path.join(rootOf(runId), "record.json")), false, "the run is still working");
  assert.equal(call.stderr, `${noticeLines(runId, worker).join("\n")}\n`);
  assert.equal(call.stdout, "");
  assert.equal((await call.exit).code, 0, call.stdout);
  assert.match(call.stdout, /^## Review rounds\n[\s\S]*\n## Spend\n[\s\S]*\| Total \| \| \| 200 \| 0\.02 USD \|\n$/);
  assert.equal(call.stderr, `${noticeLines(runId, worker).join("\n")}\n`, "nothing else on stderr");
  await exited(worker);
  for (const s of starts()) await exited(s.pid);
  assertCleanedUp();
  assert.deepEqual(fs.readdirSync(t.tmpRoot), []);
});

test("KR14: an observer reporting a reviewer PID present blocks Final proposal with a cleanup failure", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const text = "Use two columns.";
  const failed = await runReconcile(conversation(text), deps({ observePid: () => "present" }));
  assert.equal(failed.exitCode, 3);
  const pids = events().filter((e) => e.event === "start").map((e) => e.pid);
  const unexited = `A: PID ${pids.map((p) => `${p} present`).join(", ")}`;
  for (const pid of pids) assert.equal(observePid(pid), "ESRCH", "the children really exited; only the observation was withheld");
  const runId = fs.readdirSync(t.sessionsRoot)[0].replace("acp-controller-", "");
  assert.equal(
    recordOf(failed.markdown),
    [
      "## Review rounds",
      "",
      "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |",
      "|---|---|---|---|---|---|",
      `| 1 | 1 | A | post-rethink | ${sha(text)} | VALID<br>• Accepts the proposal |`,
      `| 2 | 1 | closure | — | ${sha(text)} | unchanged proposal VALID |`,
      `| 3 | 1 | cleanup | — | — | disposal not established: ${unexited} |`,
      "",
      "## Reconcile stopped",
      "",
      "**Candidate**",
      "",
      `- ${sha(text)}`,
      "",
      "**Blocker**",
      "",
      `- cleanup failure: ${unexited}; session folder \`${path.join(t.sessionsRoot, `acp-controller-${runId}`)}\` and private root \`${path.join(t.tmpRoot, `acp-controller-${runId}`)}\` kept (step: terminal cleanup)`,
      "",
      "**Resume from**",
      "",
      "- a new approved Reconcile run from the canonical identity above",
      "",
      "## Dispose",
      "",
      `- cleanup was not established, so run \`${runId}\` keeps its folder and stays abandoned; dispose it only on the human's explicit instruction: \`cli.mjs dispose ${runId}\``,
      "",
    ].join("\n"),
  );
});

test("KS4: disposal counts only on observed ESRCH, never on a resolved close with a closed record alone", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  let observer = observePid;
  const run = await openRun("reconcile", deps({ observePid: (pid) => observer(pid) }), conversation("probe"));
  try {
    const validate = () => ({ valid: true, defects: [], value: {} });
    const real = await startActor(run, { name: "A", role: ROLES.a });
    await ask(run, real, "Phase: initial\n\nprobe", validate);
    const exited = await disposeActor(run, real, "test");
    assert.equal(exited.closeResolved, true);
    assert.equal(exited.recordedClosed, true);
    assert.ok(exited.pidResults.length > 0 && exited.pidResults.every((p) => p.result === "ESRCH"));
    assert.equal(exited.disposed, true);

    for (const result of ["present", "EPERM"]) {
      const other = await startActor(run, { name: `B-${result}`, role: ROLES.a });
      observer = () => result;
      const d = await disposeActor(run, other, "test");
      observer = observePid;
      assert.equal(d.closeResolved, true);
      assert.equal(d.recordedClosed, true);
      assert.equal(d.disposed, false, `${result} is not disposal`);
    }
  } finally {
    await finishRun(run);
    leaveRun(run);
  }
  for (const e of events().filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH");
});

const BULLETS = {
  103: "Separate universal semantic contracts, repository storage companions, and harness transport shims. Never hide a cross-transport content contract behind a path guard.",
  104: "Use always-apply only for tiny universal invariants that must survive every turn.",
  105: "Prefer tooling, config, linters, tests, or templates when behavior can be enforced deterministically.",
};
const CITED = (replacement, citations) => y({ kind: "review", verdict: "REVISE", summary: ["Misses the stated goal"], blocking_issues: ["the proposal misses the goal"], correction: { replacement }, preserve: [], citations });

/**
 * The incident: a repository whose `craft-rule/SKILL.md` holds the three
 * enforcement-surface bullets on lines 103–105, and proposals citing them.
 */
function incident() {
  const repo = path.join(t.dir, "repo");
  const file = path.join(repo, "craft-rule", "SKILL.md");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const filler = Array.from({ length: 102 }, (_, i) => `filler line ${i + 1}`);
  fs.writeFileSync(file, `${[...filler, `- ${BULLETS[103]}`, `- ${BULLETS[104]}`, `- ${BULLETS[105]}`].join("\n")}\n`);
  const cite = (line, quote = BULLETS[line]) => ({ path: file, line, quote });
  return {
    repo,
    file,
    cite,
    P0: `Add an always-apply rule citing ${file}:103 and ${file}:104.`,
    P1: `Add a scoped rule citing ${file}:103 and ${file}:104.`,
    P2: `Add a scoped rule citing ${file}:105 and ${file}:106.`,
    P3: `Add a scoped rule citing ${file}:103 only.`,
    // The counterpart's dispute request as the test PROMPTS render it.
    disputeFrom: (author, cites) => `Dispute from ${author}:\n${cites.map((c) => `${c.path}:${c.line}\n\`\`\`text\n${c.quote}\n\`\`\``).join("\n\n")}`,
  };
}

const rows = (lines) => ["## Review rounds", "", "| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |", "|---|---|---|---|---|---|", ...lines.map((l, i) => `| ${i + 1} | ${l} |`), ""];
const stopped = (candidates, blocker) => ["## Reconcile stopped", "", "**Candidate**", "", ...candidates.map((c) => `- ${sha(c)}`), "", "**Blocker**", "", blocker, "", "**Resume from**", "", "- a new approved Reconcile run from the canonical identity above", ""];
const REVISED = "REVISE<br>• Misses the stated goal";
const ACCEPTED = "VALID<br>• Accepts the proposal";

test("citations: REVISE-only, with an absolute path, a positive line range and an exact non-empty quote", () => {
  const ctx = { mode: "conversation" };
  const revise = { kind: "review", verdict: "REVISE", summary: ["Misses the goal"], blocking_issues: ["why"], correction: { replacement: "new text" } };
  const good = { path: "/r/a.md", line: 3, quote: "  exact  " };
  const ok = validateResult("review", { ...revise, citations: [good, { path: "/r/b.md", line: 2, end_line: 4, quote: "x" }] }, ctx);
  assert.equal(ok.valid, true, ok.defects.join("; "));
  assert.deepEqual(ok.value.citations, [{ ...good, end_line: 3 }, { path: "/r/b.md", line: 2, end_line: 4, quote: "x" }], "end_line defaults to line; the quote is never trimmed");
  assert.deepEqual(validateResult("review", { ...revise, citations: null }, ctx).value.citations, []);

  const shape = "citations[1] needs an absolute `path`, a positive integer `line`, an optional integer `end_line` not below `line`, and a non-empty `quote`";
  const invalid = {
    "relative path": { ...good, path: "r/a.md" },
    "line 0": { ...good, line: 0 },
    "numeric-string line": { ...good, line: "3" },
    "end_line below line": { ...good, end_line: 2 },
    "fractional end_line": { ...good, end_line: 3.5 },
    "blank quote": { ...good, quote: " \n" },
    "string entry": "/r/a.md:3",
  };
  for (const [name, bad] of Object.entries(invalid)) {
    const res = validateResult("review", { ...revise, citations: [good, bad] }, ctx);
    assert.deepEqual(res.defects, [shape], name);
  }
  assert.deepEqual(validateResult("review", { ...revise, citations: "/r/a.md:3" }, ctx).defects, ["field `citations` must be an array of citation objects"]);

  const others = {
    VALID: { kind: "review", verdict: "VALID", summary: ["Accepts"] },
    BLOCKED: { kind: "review", verdict: "BLOCKED", summary: ["Needs the spec"], blocker: "gap", resume_with: "input" },
  };
  for (const [verdict, base] of Object.entries(others)) {
    assert.deepEqual(validateResult("review", { ...base, citations: [good] }, ctx).defects, [`verdict ${verdict} carries no citations`]);
    const empty = validateResult("review", { ...base, citations: [] }, ctx);
    assert.equal(empty.valid, true, `${verdict} with an empty list is accepted`);
    assert.equal(empty.value.citations, undefined, `${verdict} carries no citations`);
  }
});

test("citations: a mismatched quote in a checkable file is re-asked by name and never becomes a working version; an outside citation is unchecked", async () => {
  const { repo, file, cite, P0, P1 } = incident();
  const outside = path.join(t.dir, "outside.md");
  fs.writeFileSync(outside, "unrelated\n");
  // Reply order: the outside citation first, so a defect naming it would precede the others and miss `when`.
  const wrong = [{ path: outside, line: 1, quote: "not in the file" }, cite(103, BULLETS[104]), { path: file, line: 104, end_line: 200, quote: BULLETS[104] }];
  const defect = `Not accepted: citation mismatch: ${file}:103: quote not found in the cited line(s); citation mismatch: ${file}:104-200: the file has 105 line(s)`;
  setPlan({ "scripted/a": [VALID, CITED(P1, wrong), { when: defect, then: VALID }] });
  const out = await runReconcile(conversation(P0), deps({ repoRoot: repo }));
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "a:reask"]);
  assert.ok(out.markdown.includes(`## Final proposal\n\n**Proposal**\n\n- ${P0}\n`));
  assert.ok(!out.markdown.includes(sha(P1)), "the mismatched Correction's identity appears nowhere");
  assertCleanedUp();
});

test("dispute: incident replay, counterpart accepts the cited revert and the run ends with it", async () => {
  const { repo, cite, P0, P1, P2, disputeFrom } = incident();
  const cites = [cite(103), cite(104)];
  setPlan({
    "scripted/a": [VALID, REVISE(P1), CITED(P1, cites), VALID],
    "scripted/b": [REVISE(P2), REVISE(P2), { when: disputeFrom("A", cites), then: VALID }],
  });
  const out = await runReconcile(conversation(P0), deps({ repoRoot: repo }));
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later", "a:later"]);
  assert.equal(
    recordOf(out.markdown),
    [
      ...rows([
        `1 | A | post-rethink | ${sha(P0)} | ${REVISED}`,
        `1 | B | post-rethink | ${sha(P1)} | ${REVISED}`,
        `1 | A | later | ${sha(P2)} | ${REVISED}`,
        `1 | dispute | — | ${sha(P1)} | A restored a replaced proposal with 2 checked citation(s); B reviews it once`,
        `1 | B | later | ${sha(P1)} | ${ACCEPTED}`,
        `1 | apply | — | ${sha(P1)} | applied (count 1)`,
        `2 | A | later | ${sha(P1)} | ${ACCEPTED}`,
        `2 | closure | — | ${sha(P1)} | unchanged proposal VALID`,
        "2 | cleanup | — | — | A, B disposed (observed exit)",
      ]),
      "## Final proposal",
      "",
      "**Proposal**",
      "",
      `- ${P1}`,
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("dispute: incident replay, counterpart reapplies its edit and the run stops after the one dispute", async () => {
  const { repo, cite, P0, P1, P2, disputeFrom } = incident();
  const cites = [cite(103), cite(104)];
  setPlan({
    "scripted/a": [VALID, REVISE(P1), CITED(P1, cites)],
    "scripted/b": [REVISE(P2), REVISE(P2), { when: disputeFrom("A", cites), then: REVISE(P2) }],
  });
  const out = await runReconcile(conversation(P0), deps({ repoRoot: repo }));
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later"]);
  assert.equal(
    recordOf(out.markdown),
    [
      ...rows([
        `1 | A | post-rethink | ${sha(P0)} | ${REVISED}`,
        `1 | B | post-rethink | ${sha(P1)} | ${REVISED}`,
        `1 | A | later | ${sha(P2)} | ${REVISED}`,
        `1 | dispute | — | ${sha(P1)} | A restored a replaced proposal with 2 checked citation(s); B reviews it once`,
        `1 | B | later | ${sha(P1)} | ${REVISED}`,
        `1 | stop | — | ${sha(P2)} | repeated A/B cycle`,
        "1 | cleanup | — | — | A, B disposed (observed exit)",
      ]),
      ...stopped([P0, P2], "- repeated A/B cycle: after its one dispute, B restored the proposal A replaced (step: B later)"),
    ].join("\n"),
  );
  assertCleanedUp();
});

test("dispute: a revert without a passing citation stops as a repeated A/B cycle with no counterpart turn", async () => {
  const { repo, P0, P1, P2 } = incident();
  // The quote matches, but the file lies outside the repository root, so it is unchecked and never passes.
  const outside = path.join(t.dir, "outside.md");
  fs.writeFileSync(outside, `- ${BULLETS[103]}\n`);
  setPlan({
    "scripted/a": [VALID, REVISE(P1), CITED(P1, [{ path: outside, line: 1, quote: BULLETS[103] }])],
    "scripted/b": [REVISE(P2), REVISE(P2), VALID],
  });
  const out = await runReconcile(conversation(P0), deps({ repoRoot: repo }));
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later"]);
  assert.equal(
    recordOf(out.markdown),
    [
      ...rows([
        `1 | A | post-rethink | ${sha(P0)} | ${REVISED}`,
        `1 | B | post-rethink | ${sha(P1)} | ${REVISED}`,
        `1 | A | later | ${sha(P2)} | ${REVISED}`,
        `1 | stop | — | ${sha(P1)} | repeated A/B cycle`,
        "1 | cleanup | — | — | A, B disposed (observed exit)",
      ]),
      ...stopped([P0, P1], "- repeated A/B cycle: the same proposal returned to the same reviewer (step: A later)"),
    ].join("\n"),
  );
  assertCleanedUp();
});

test("dispute: one dispute per proposal pair in an outer iteration; a new pair gets its own, a repeated pair stops", async () => {
  const { repo, cite, P0, P1, P2, P3, disputeFrom } = incident();
  const cites = [cite(103), cite(104)];
  setPlan({
    "scripted/a": [VALID, REVISE(P1), CITED(P1, cites), CITED(P1, cites)],
    "scripted/b": [REVISE(P2), REVISE(P2), { when: disputeFrom("A", cites), then: REVISE(P3) }, { when: disputeFrom("A", cites), then: CITED(P2, [cite(105)]) }],
  });
  const out = await runReconcile(conversation(P0), deps({ repoRoot: repo }));
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later", "a:later", "b:later"]);
  const disputeRow = `1 | dispute | — | ${sha(P1)} | A restored a replaced proposal with 2 checked citation(s); B reviews it once`;
  assert.equal(
    recordOf(out.markdown),
    [
      ...rows([
        `1 | A | post-rethink | ${sha(P0)} | ${REVISED}`,
        `1 | B | post-rethink | ${sha(P1)} | ${REVISED}`,
        `1 | A | later | ${sha(P2)} | ${REVISED}`,
        disputeRow,
        `1 | B | later | ${sha(P1)} | ${REVISED}`,
        `1 | A | later | ${sha(P3)} | ${REVISED}`,
        disputeRow,
        `1 | B | later | ${sha(P1)} | ${REVISED}`,
        `1 | stop | — | ${sha(P2)} | repeated A/B cycle`,
        "1 | cleanup | — | — | A, B disposed (observed exit)",
      ]),
      ...stopped([P0, P2], "- repeated A/B cycle: the same proposal pair repeated after its one dispute (step: B later)"),
    ].join("\n"),
  );
  assertCleanedUp();
});

/** Every prompt text the scripted `model` received, in order. */
const promptTexts = (model) => events().filter((e) => e.event === "prompt" && e.model === model).map((e) => e.text);
/** The COUNTERPART slot of a test `initial` or `later` prompt, through the end of the prompt. */
const counterpartOf = (text) => text.slice(text.indexOf("\nCounterpart:\n") + "\nCounterpart:\n".length);
const count = (text, part) => text.split(part).length - 1;

test("INTENT1: the reviewer receives Intent and Context as separate blocks, each multi-line item intact", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  const intent = ["Fit phones first.\nKeep the print layout.", "Exclude the header."];
  const context = ["Interview record:\n- human: \"phones first\"\n\n- human: \"print matters\"", "Earlier diff: /tmp/run/earlier.diff"];
  const out = await runReconcile(conversation("Use two columns.", { intent, context }), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  const [initial] = promptTexts("scripted/a");
  const blocks = [
    "Intent:",
    "- Fit phones first.",
    "  Keep the print layout.",
    "- Exclude the header.",
    "Context:",
    "- Interview record:",
    '  - human: "phones first"',
    "  ",
    '  - human: "print matters"',
    "- Earlier diff: /tmp/run/earlier.diff",
    "Mode: ",
  ].join("\n");
  assert.ok(initial.includes(`\n${blocks}`), initial);
  assertCleanedUp();
});

test("NOTES1: notes and replies are optional text lists on VALID and REVISE; `recommendations` and BLOCKED notes are invalid returns", () => {
  const ctx = { mode: "conversation" };
  const bases = {
    VALID: { kind: "review", verdict: "VALID", summary: ["Accepts"] },
    REVISE: { kind: "review", verdict: "REVISE", summary: ["Misses the goal"], blocking_issues: ["why"], correction: { replacement: "new text" } },
  };
  const notes = ["Mention the phone width.", "  Keep it short\nand plain.  "];
  const replies = ["adopted: keep the header", "declined: drop the footer — the footer holds the legal text"];
  for (const [verdict, base] of Object.entries(bases)) {
    const ok = validateResult("review", { ...base, notes, replies }, ctx);
    assert.equal(ok.valid, true, `${verdict}: ${ok.defects}`);
    assert.deepEqual([ok.value.notes, ok.value.replies], [notes, replies], `${verdict} keeps notes and replies byte-for-byte`);
    const none = validateResult("review", base, ctx);
    assert.deepEqual([none.value.notes, none.value.replies], [[], []], `${verdict} without notes or replies has none`);
    for (const field of ["notes", "replies"]) {
      for (const bad of ["one note", [""], [" \n"], [3]]) {
        assert.deepEqual(validateResult("review", { ...base, [field]: bad }, ctx).defects, [`field \`${field}\` must be an array of non-empty strings`], `${verdict} ${field} ${JSON.stringify(bad)}`);
      }
    }
    for (const recommendations of [[], ["editorial: tighten wording"]]) {
      const res = validateResult("review", { ...base, recommendations }, ctx);
      assert.deepEqual(res.defects, ["field `recommendations` is not a review field; put every non-blocking point in `notes`"], `${verdict} recommendations ${JSON.stringify(recommendations)}`);
    }
  }
  const blocked = { kind: "review", verdict: "BLOCKED", summary: ["Needs the spec"], blocker: "gap", resume_with: "input" };
  for (const field of ["notes", "replies"]) {
    assert.deepEqual(validateResult("review", { ...blocked, [field]: ["a point"] }, ctx).defects, [`verdict BLOCKED carries no \`${field}\``]);
  }
  assert.deepEqual(validateResult("review", { ...blocked, recommendations: ["semantic: x"] }, ctx).defects, ["field `recommendations` is not a review field; put every non-blocking point in `notes`"]);
});

test("NOTES2: B's first request carries A's finalized REVISE with its note; A's first carries none; A's next carries B's note once", async () => {
  const X = "Use one column.";
  const Y = "Use one column with a fixed header.";
  setPlan({
    "scripted/a": [VALID, REVISE(X, "the page needs one column on phones", { notes: ["Mention the phone width."] }), VALID, VALID],
    "scripted/b": [VALID, REVISE(Y, "the header scrolls away", { notes: ["Keep the header fixed."] })],
  });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "a:later"]);
  const [aInitial, , aLater] = promptTexts("scripted/a");
  const [bInitial, bRethink] = promptTexts("scripted/b");
  assert.ok(counterpartOf(aInitial).startsWith("none\n"), "A's first request has nothing to carry");
  const fromA = counterpartOf(bInitial);
  assert.ok(fromA.startsWith(`Reviewer A · REVISE · outer iteration 1 · reviewed ${sha("Use two columns.")}\n`), fromA);
  for (const part of ["the page needs one column on phones", "Mention the phone width."]) assert.equal(count(fromA, part), 1, part);
  assert.ok(!fromA.includes(X), "the Correction is not forwarded");
  assert.ok(!bRethink.includes("Mention the phone width."), "rethink carries no counterpart responses");
  const fromB = counterpartOf(aLater);
  assert.ok(fromB.startsWith(`Reviewer B · REVISE · outer iteration 1 · reviewed ${sha(X)}\n`), fromB);
  assert.equal(count(aLater, "Keep the header fixed."), 1);
  assert.equal(count(aLater, "Mention the phone width."), 0, "A is never sent its own note");
  assertCleanedUp();
});

test("NOTES3: the three-round example — VALIDs with notes travel between reviewers and only the forwarded answer ends round 1", async () => {
  const T0 = "Use two columns.";
  const X = "Use one column.";
  const Y = "Use one wide column.";
  setPlan({
    "scripted/a": [VALID, REVISE(X, "the page needs one column", { notes: ["a1: name the breakpoint"] }), VALID_NOTES(["a2: shorten the title"]), VALID_NOTES(["a3: widen the margin"]), VALID_NOTES(["a4: make it wide"]), VALID, VALID],
    "scripted/b": [VALID, VALID_NOTES(["b1: keep the header"]), VALID_NOTES(["b2: check the footer"]), REVISE(Y, "the column is too narrow", { replies: ["adopted: a4: make it wide", "declined: a3: widen the margin — the margin is fixed"] })],
  });
  const out = await runReconcile(conversation(T0), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later", "a:later", "a:later", "b:later", "a:later", "a:later"]);
  const a = promptTexts("scripted/a").map(counterpartOf);
  const b = promptTexts("scripted/b").map(counterpartOf);
  // Round 1: each VALID with notes goes to the counterpart; B's second VALID is forwarded once.
  assert.ok(b[0].startsWith(`Reviewer A · REVISE · outer iteration 1 · reviewed ${sha(T0)}\n`) && b[0].includes("a1: name the breakpoint"), b[0]);
  assert.ok(a[2].startsWith(`Reviewer B · VALID · outer iteration 1 · reviewed ${sha(X)}\n`) && a[2].includes("b1: keep the header"), a[2]);
  assert.ok(b[2].startsWith(`Reviewer A · VALID · outer iteration 1 · reviewed ${sha(X)}\n`) && b[2].includes("a2: shorten the title"), b[2]);
  assert.ok(a[3].startsWith(`Reviewer B · VALID · outer iteration 1 · reviewed ${sha(X)}\n`) && a[3].includes("b2: check the footer"), a[3]);
  // Round 2: A's first request has nothing unsent; B receives A's unsent round-1 answer, then the new VALID.
  assert.ok(a[4].startsWith("none\n"), a[4]);
  const r1 = b[3].indexOf(`Reviewer A · VALID · outer iteration 1 · reviewed ${sha(X)}\n`);
  const r2 = b[3].indexOf(`Reviewer A · VALID · outer iteration 2 · reviewed ${sha(X)}\n`);
  assert.ok(r1 >= 0 && r2 > r1 && b[3].indexOf("a3: widen the margin") > r1 && b[3].indexOf("a4: make it wide") > r2, b[3]);
  assert.ok(a[5].startsWith(`Reviewer B · REVISE · outer iteration 2 · reviewed ${sha(X)}\n`) && a[5].includes("declined: a3: widen the margin — the margin is fixed"), a[5]);
  assert.ok(a[6].startsWith("none\n"), a[6]);
  assert.equal(
    recordOf(out.markdown),
    [
      ...rows([
        `1 | A | post-rethink | ${sha(T0)} | ${REVISED}`,
        `1 | B | post-rethink | ${sha(X)} | ${ACCEPTED}`,
        `1 | A | later | ${sha(X)} | ${ACCEPTED}`,
        `1 | B | later | ${sha(X)} | ${ACCEPTED}`,
        `1 | A | later | ${sha(X)} | ${ACCEPTED}`,
        `1 | apply | — | ${sha(X)} | applied (count 1)`,
        `2 | A | later | ${sha(X)} | ${ACCEPTED}`,
        `2 | B | later | ${sha(X)} | ${REVISED}`,
        `2 | A | later | ${sha(Y)} | ${ACCEPTED}`,
        `2 | apply | — | ${sha(Y)} | applied (count 2)`,
        `3 | A | later | ${sha(Y)} | ${ACCEPTED}`,
        `3 | closure | — | ${sha(Y)} | unchanged proposal VALID`,
        "3 | cleanup | — | — | A, B disposed (observed exit)",
      ]),
      "## Final proposal",
      "",
      "**Proposal**",
      "",
      `- ${Y}`,
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("NOTES4: a note the other reviewer was never sent ends the Final proposal as an open note, byte-for-byte", async () => {
  const text = "Use two columns.";
  setPlan({
    "scripted/a": [VALID, VALID_NOTES(["Shorten the title."]), VALID_NOTES(["Shorten the title."])],
    "scripted/b": [VALID, VALID_NOTES(["Check the footer."]), VALID_NOTES(["Line one of the note.\nLine two of the note."])],
  });
  const out = await runReconcile(conversation(text), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later"]);
  assert.ok(
    recordOf(out.markdown).endsWith(
      [
        `| 4 | 1 | B | later | ${sha(text)} | ${ACCEPTED} |`,
        `| 5 | 1 | closure | — | ${sha(text)} | unchanged proposal VALID |`,
        "| 6 | 1 | cleanup | — | — | A, B disposed (observed exit) |",
        "",
        "## Final proposal",
        "",
        "**Proposal**",
        "",
        `- ${text}`,
        "",
        "**Open notes**",
        "",
        "- B: Line one of the note.",
        "  Line two of the note.",
        "",
      ].join("\n"),
    ),
    out.markdown,
  );
  assertCleanedUp();
});

test("NOTES4: a stop lists the unsent note after Resume from", async () => {
  const [P0, P1, P2] = ["Use two columns.", "Use one column.", "Use three columns."];
  setPlan({
    "scripted/a": [VALID, REVISE(P1), REVISE(P1, "the page needs one column", { notes: ["Phones are narrow."] })],
    "scripted/b": [REVISE(P2), REVISE(P2, "the page needs three columns", { notes: ["Desktop matters too."] })],
  });
  const out = await runReconcile(conversation(P0), deps());
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later"]);
  assert.ok(
    recordOf(out.markdown).endsWith(
      [
        ...stopped([P0, P1], "- repeated A/B cycle: the same proposal returned to the same reviewer (step: A later)"),
        "**Open notes**",
        "",
        "- A: Phones are narrow.",
        "",
      ].join("\n"),
    ),
    out.markdown,
  );
  assertCleanedUp();
});

test("NOTES4: a run whose notes all reached the other reviewer has no open notes", async () => {
  setPlan({
    "scripted/a": [VALID, REVISE("Use one column.", "the page needs one column", { notes: ["Phones are narrow."] }), VALID],
    "scripted/b": [VALID, VALID],
  });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.ok(recordOf(out.markdown).endsWith("## Final proposal\n\n**Proposal**\n\n- Use one column.\n"), out.markdown);
  assertCleanedUp();
});

test("NOTES5: a VALID without notes ends the round even after VALIDs with notes", async () => {
  setPlan({
    "scripted/a": [VALID, VALID_NOTES(["Shorten the title."]), VALID],
    "scripted/b": [VALID, VALID_NOTES(["Check the footer."])],
  });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later"]);
  assert.match(out.markdown, /\| 3 \| 1 \| A \| later \| sha256:[0-9a-f]{64} \| VALID<br>• Accepts the proposal \|\n\| 4 \| 1 \| closure \|/);
  assertCleanedUp();
});

test("NOTES5: a REVISE answering a forwarded second VALID continues as a normal change", async () => {
  const [T0, Y] = ["Use two columns.", "Use one column."];
  setPlan({
    "scripted/a": [VALID, VALID_NOTES(["Shorten the title."]), VALID_NOTES(["Use one column."]), VALID, VALID],
    "scripted/b": [VALID, VALID_NOTES(["Check the footer."]), REVISE(Y, "the page needs one column", { replies: ["adopted: Use one column."] })],
  });
  const out = await runReconcile(conversation(T0), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "b:later", "a:later", "a:later"]);
  assert.equal(
    recordOf(out.markdown),
    [
      ...rows([
        `1 | A | post-rethink | ${sha(T0)} | ${ACCEPTED}`,
        `1 | B | post-rethink | ${sha(T0)} | ${ACCEPTED}`,
        `1 | A | later | ${sha(T0)} | ${ACCEPTED}`,
        `1 | B | later | ${sha(T0)} | ${REVISED}`,
        `1 | A | later | ${sha(Y)} | ${ACCEPTED}`,
        `1 | apply | — | ${sha(Y)} | applied (count 1)`,
        `2 | A | later | ${sha(Y)} | ${ACCEPTED}`,
        `2 | closure | — | ${sha(Y)} | unchanged proposal VALID`,
        "2 | cleanup | — | — | A, B disposed (observed exit)",
      ]),
      "## Final proposal",
      "",
      "**Proposal**",
      "",
      `- ${Y}`,
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("NOTES5: A's VALID without notes never creates B", async () => {
  setPlan({ "scripted/a": [VALID_NOTES(["Provisional notes are never forwarded."]), VALID] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink"]);
  assert.equal(events().some((e) => e.model === "scripted/b"), false, "B never starts");
  assert.ok(!out.markdown.includes("**Open notes**"), "a provisional response's notes are never open notes");
  assertCleanedUp();
});
