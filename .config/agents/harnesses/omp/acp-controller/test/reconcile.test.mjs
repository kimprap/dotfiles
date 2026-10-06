// Reconcile contract tests (spec-v3 §7): the public controller entry points
// drive real public acpx runtimes against the scripted ACP agent child. Traffic
// order is asserted from the scripted agent's log; rendered records are
// compared with expected text authored here.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { main } from "../cli.mjs";
import { resumeReconcile, runReconcile } from "../controller.mjs";
import { observePid } from "../lib/adapter.mjs";
import { socketDirFor } from "../lib/env.mjs";
import { disposeActor, finishRun, leaveRun, openRun, ask, startActor } from "../lib/ports.mjs";
import { validateResult } from "../lib/schema.mjs";
import { OMP_VERSION } from "../lib/versions.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";

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

/** Every process the scripted agent started has exited, and the run left no folder behind. */
function assertCleanedUp() {
  for (const e of events().filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH", `pid ${e.pid} exited`);
  assert.deepEqual(fs.readdirSync(t.sessionsRoot), []);
  assert.deepEqual(fs.readdirSync(t.tmpRoot), []);
}

/** The rendered record without its trailing `## Spend` section. */
function recordOf(markdown) {
  const i = markdown.indexOf("\n## Spend\n");
  assert.ok(i > 0, "record ends with the Spend section");
  return markdown.slice(0, i);
}

/**
 * One `reconcile` through the CLI entry: a fake `omp` on PATH answers `--version` and otherwise
 * runs the scripted agent; live roles are ROLES and the model catalog lists `catalog` selectors.
 */
async function viaCli(request, catalog) {
  const bin = path.join(t.dir, "bin");
  fs.mkdirSync(bin, { recursive: true });
  fs.writeFileSync(path.join(bin, "omp"), `#!/bin/sh\nif [ "$1" = "--version" ]; then echo '${OMP_VERSION}'; exit 0; fi\nexec '${t.launcher}' "$@"\n`, { mode: 0o755 });
  return main({
    argv: ["reconcile"],
    stdinText: JSON.stringify(request),
    env: { PATH: `${bin}:${process.env.PATH}` },
    sessionsRoot: t.sessionsRoot,
    tmpRoot: t.tmpRoot,
    readModelRoles: async () => ({ ok: true, roles: ROLES }),
    readModelCatalog: async () => ({ ok: true, models: catalog.map(([selector, thinking]) => ({ provider: "scripted", id: selector.slice("scripted/".length), selector, thinking })) }),
    loadPrompts: async () => ({ ok: true, prompts: PROMPTS, sources: {} }),
    log: () => {},
  });
}

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
  // The run record names its owner and every reviewer PID and session a crash would leave behind.
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "claim-0"), "utf8")), EXITED_OWNER);
  const record = JSON.parse(fs.readFileSync(path.join(root, "run.json"), "utf8"));
  assert.deepEqual({ ...record, pids: new Set(record.pids), sessionIds: new Set(record.sessionIds) }, {
    runId,
    kind: "reconcile",
    phase: "parked",
    pids: new Set(events().filter((e) => e.event === "start").map((e) => e.pid)),
    sessionIds: new Set(Object.values(sessions)),
  });
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
    ].join("\n"),
  );
});

test("KS4: disposal counts only on observed ESRCH, never on a resolved close with a closed record alone", async () => {
  setPlan({ "scripted/a": [VALID, VALID] });
  let observer = observePid;
  const run = await openRun("reconcile", deps({ observePid: (pid) => observer(pid) }));
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
