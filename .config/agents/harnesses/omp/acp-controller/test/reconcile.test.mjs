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
import { resumeReconcile, runReconcile } from "../controller.mjs";
import { observePid } from "../lib/adapter.mjs";
import { socketDirFor } from "../lib/env.mjs";
import { disposeActor, finishRun, leaveRun, openRun, ask, startActor } from "../lib/ports.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";

const PROMPTS = {
  reviewer: {
    initial: "Goal: {{GOAL}}\nMode: {{MODE}}\nProposal:\n{{PROPOSAL}}\nReturn:\n{{EXAMPLE}}",
    rethink: "Read {{RETHINK_SKILL}} once and rethink.\nProvisional:\n{{PROVISIONAL}}\nProposal:\n{{PROPOSAL}}",
    later: "Proposal:\n{{PROPOSAL}}\n{{BLOCKED_RETRY}}",
    source: "Sources: {{SOURCE_STATUS}}\n{{SOURCES}}",
    reask: "Not accepted: {{DEFECT}}",
  },
  scope: { evaluate: "{{OBJECTIVE}}", continue: "{{CONTINUATION}}", reask: "{{DEFECT}}", normalize: "{{CONCERNS}}" },
};
const ROLES = { a: { model: "scripted/a", thinking: "low" }, b: { model: "scripted/b", thinking: "low" } };
const APPROVAL = { text: "Approved as written.", at: "2026-09-27T01:00:00Z" };

const y = (data) => `yield:${JSON.stringify(data)}`;
const VALID = y({ kind: "review", verdict: "VALID", blocking_issues: [], revision: "none", recommendations: [] });
const REVISE = (replacement, issue = "the proposal misses the goal") => y({ kind: "review", verdict: "REVISE", blocking_issues: [issue], correction: { replacement }, preserve: [] });
const EDITS = (edits) => y({ kind: "review", verdict: "REVISE", blocking_issues: ["wrong word"], correction: { edits }, preserve: [] });
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

const conversation = (text, extra = {}) => ({ goal: "Choose the page layout", candidate: { identity: "layout v1", text }, context: ["The page is read on phones."], mode: "conversation", cap: "none", approval: APPROVAL, ...extra });

function artifactRequest(file, extra = {}) {
  return { goal: "Fix the word list", candidate: { identity: "words.txt v1", artifact: file }, context: [], mode: "artifact", cap: "none", approval: APPROVAL, ...extra };
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
      "- invalid returns exhausted: A initial: 4 invalid returns (field `blocking_issues` needs at least one entry; REVISE requires an object field `correction`) (step: A initial)",
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
    "scripted/a": [VALID, EDITS([{ old: "beta", new: "BETA" }]), VALID, EDITS([{ old: "alpha", new: "alpha" }]), EDITS([{ old: "zeta", new: "ZETA" }]), VALID],
    "scripted/b": [VALID, EDITS([{ old: "gamma", new: "GAMMA" }])],
  });
  const out = await runReconcile(artifactRequest(file), deps());
  assert.equal(out.exitCode, 0);
  // B's edit set replaces A's (never stacked on it); both unusable Corrections were re-asked.
  assert.equal(fs.readFileSync(file, "utf8"), "alpha\nbeta\nGAMMA\n");
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "b:initial", "b:rethink", "a:later", "a:later", "a:reask", "a:reask"]);
  assert.match(out.markdown, /\*\*Current identity\*\*\n\n- sha256:[0-9a-f]{64}\n/);
  assert.ok(out.markdown.includes(`- ${sha("alpha\nbeta\nGAMMA\n")}`));
  assertCleanedUp();
});

test("KR9: first VALID ends negotiation; BLOCKED gets one approved-context retry; VALID recommendations change nothing", async () => {
  const blocked = y({ kind: "review", verdict: "BLOCKED", blocker: "missing layout spec", resume_with: "the layout spec", revision: "none" });
  const validRec = y({ kind: "review", verdict: "VALID", blocking_issues: [], revision: "none", recommendations: ["editorial: tighten wording"] });
  setPlan({ "scripted/a": [VALID, blocked, validRec] });
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
      `| 1 | 1 | A | post-rethink | ${sha(text)} | BLOCKED: missing layout spec; resume with: the layout spec |`,
      `| 2 | 1 | A | later | ${sha(text)} | VALID (not applied: editorial: tighten wording) |`,
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
  const blocked = y({ kind: "review", verdict: "BLOCKED", blocker: "missing layout spec", resume_with: "the layout spec" });
  setPlan({ "scripted/a": [VALID, blocked, blocked] });
  const out = await runReconcile(conversation("Use two columns."), deps());
  assert.equal(out.exitCode, 1);
  assert.deepEqual(prompts(), ["a:initial", "a:rethink", "a:later"]);
  assert.match(out.markdown, /\*\*Blocker\*\*\n\n- persistent BLOCKED: A: missing layout spec \(step: A later\)\n\n\*\*Resume from\*\*\n\n- resume with: the layout spec\n/);
  assertCleanedUp();
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
      `| 1 | 1 | A | post-rethink | ${base} | REVISE: wrong word |`,
      `| 2 | 1 | B | post-rethink | ${applied} | VALID |`,
      `| 3 | 1 | apply | — | ${applied} | applied, reread matches (count 1) |`,
      `| 4 | 1 | validate | — | ${applied} | passed |`,
      `| 5 | 2 | cap | — | ${applied} | closure-only: cap 1 reached |`,
      `| 6 | 2 | A | later | ${applied} | REVISE: wrong word |`,
      `| 7 | 2 | B | later | ${refused} | VALID |`,
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
      `| 1 | 1 | A | post-rethink | ${reviewed} | VALID |`,
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

async function park(flag) {
  const { file, request } = parkedScenario(flag);
  const out = await runReconcile(request, deps());
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
  assert.ok(fs.existsSync(path.join(t.tmpRoot, `acp-controller-${runId}`, "state.json")));
  const sessions = Object.fromEntries(events().filter((e) => e.event === "session-new").map((e) => [e.model, e.sessionId]));
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
      `| 1 | 1 | A | post-rethink | ${sha(text)} | VALID |`,
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
