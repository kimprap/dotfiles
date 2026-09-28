// Retrace contract tests (spec-v3 §7): the public Retrace entry drives scope
// evaluators and their delegated Reconcile reviewers against the scripted ACP
// agent child. Concurrency and order are read from the scripted agent's log.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { runReconcile, runRetrace } from "../controller.mjs";
import { observePid } from "../lib/adapter.mjs";
import { socketDirFor } from "../lib/env.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";

const PROMPTS = {
  reviewer: {
    initial: "Goal: {{GOAL}}\nProposal:\n{{PROPOSAL}}",
    rethink: "Read {{RETHINK_SKILL}} once and rethink.\n{{PROPOSAL}}",
    later: "{{PROPOSAL}}\n{{BLOCKED_RETRY}}",
    source: "{{SOURCE_STATUS}}\n{{SOURCES}}",
    reask: "Not accepted: {{DEFECT}}",
  },
  scope: {
    evaluate: "Evaluate {{SCOPE_NAME}}: {{OBJECTIVE}}\nPrerequisites:\n{{PREREQUISITES}}\nReturn:\n{{EXAMPLE}}",
    continue: "{{CONTINUATION}}",
    reask: "Not accepted: {{DEFECT}}",
    normalize: "{{CONCERNS}}",
  },
};
const ROLES = { a: { model: "scripted/a", thinking: "low" }, b: { model: "scripted/b", thinking: "low" } };
const APPROVAL = { text: "Approved scope table.", at: "2026-09-27T01:00:00Z" };
const y = (data) => `yield:${JSON.stringify(data)}`;
const VALID = y({ kind: "review", verdict: "VALID", summary: ["Accepts the report"], blocking_issues: [], revision: "none", recommendations: [] });

let t;

beforeEach(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "acpctl-ret-"));
  const root = path.join(dir, "root");
  const sessionsRoot = path.join(dir, "sessions");
  const tmpRoot = path.join(dir, "tmp");
  for (const d of [root, sessionsRoot, tmpRoot]) fs.mkdirSync(d);
  const plan = path.join(dir, "plan.json");
  const log = path.join(dir, "scripted.log");
  t = { dir, root, sessionsRoot, tmpRoot, plan, log, launcher: createScriptedLauncher({ dir, plan, log }) };
});

afterEach(() => {
  for (const name of fs.readdirSync(t.tmpRoot)) fs.rmSync(socketDirFor(path.join(t.tmpRoot, name, "home")), { recursive: true, force: true });
  fs.rmSync(t.dir, { recursive: true, force: true });
});

const deps = () => ({ ompPath: t.launcher, roles: ROLES, prompts: PROMPTS, sessionsRoot: t.sessionsRoot, tmpRoot: t.tmpRoot, env: { PATH: process.env.PATH }, log: () => {} });
const scope = (id, requires = []) => ({ id, name: `Area ${id}`, objective: `Judge area ${id}`, evaluand: `${id}.md`, requires, sharedEvidence: [], potentialConflict: [] });
const request = (scopes) => ({ root: t.root, table: { scopes }, approval: APPROVAL, evidence: [], objectives: ["find defects"], constraints: [], exclusions: [] });

/** An evidence file under the root and a resolving candidate for scope `id`. */
function candidate(id, report = `Kind: conversation\n\n**Aggregate summary**\n\n- ${id} holds`) {
  const file = path.join(t.root, `${id}.md`);
  fs.writeFileSync(file, `notes for ${id}\n`);
  return y({ kind: "candidate-ready", report, manifest: [{ locator: file, role: "current" }], disposition: "proposal" });
}

/** Plan entries: the scope evaluator answers `evaluator` in order; both review passes of reviewer A return VALID. */
function scopeEntries(id, evaluator) {
  return [
    ...evaluator.map((then, i) => ({ when: i === 0 ? `Phase: evaluate\nScope: ${id}\n` : `Scope: ${id}\n`, then })),
    { when: `Owner: ${id}\n`, then: VALID },
    { when: `Owner: ${id}\n`, then: VALID },
  ];
}

function setPlan(plan) {
  fs.writeFileSync(t.plan, JSON.stringify(plan));
}

function events() {
  return fs.existsSync(t.log) ? fs.readFileSync(t.log, "utf8").trim().split("\n").map((l) => JSON.parse(l)) : [];
}

/** The scope id of each evaluator process, keyed by pid (its first prompt is `Phase: evaluate`). */
function evaluatorPids(log) {
  const map = new Map();
  for (const e of log) if (e.event === "prompt" && e.passMarker === "evaluate") map.set(e.pid, e);
  return map;
}

function assertCleanedUp() {
  for (const e of events().filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH", `pid ${e.pid} exited`);
  assert.deepEqual(fs.readdirSync(t.sessionsRoot), []);
  assert.deepEqual(fs.readdirSync(t.tmpRoot), []);
}

test("KT3: at most four scope evaluators are live at once; a fifth starts only after an observed evaluator exit", async () => {
  const ids = ["S1", "S2", "S3", "S4", "S5", "S6"];
  const scopes = ids.map((id) => scope(id, id === "S6" ? ["S1"] : []));
  setPlan({ "scripted/a": ids.flatMap((id) => scopeEntries(id, [candidate(id)])) });
  const out = await runRetrace(request(scopes), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.match(out.markdown, /^## Result\n\n\*\*Aggregate\*\*\n\n- complete\n- resolved scopes: 6 of 6\n/);

  const log = events();
  const evaluators = evaluatorPids(log);
  assert.equal(evaluators.size, 6);
  let live = 0;
  let max = 0;
  for (const e of log) {
    if (!evaluators.has(e.pid) || (e.event !== "start" && e.event !== "exit")) continue;
    live += e.event === "start" ? 1 : -1;
    max = Math.max(max, live);
  }
  assert.equal(live, 0, "every evaluator exit was logged");
  assert.equal(max, 4);
  const scopeOf = new Map([...evaluators].map(([pid, e]) => [pid, /- (S\d) holds/.exec(e.response)[1]]));
  const at = (event, id) => log.findIndex((e) => e.event === event && scopeOf.get(e.pid) === id);
  const starts = ids.map((id) => at("start", id)).sort((a, b) => a - b);
  const firstExit = Math.min(...ids.map((id) => at("exit", id)));
  assert.ok(starts[4] > firstExit, "the fifth evaluator starts after an evaluator exit");
  assert.ok(at("start", "S6") > at("exit", "S1"), "S6 starts after its prerequisite's evaluator exited");
  assertCleanedUp();
});

/** The `**Events**` list of scope `id` under Evidence and Limits. */
function scopeEvents(markdown, id) {
  const limits = markdown.slice(markdown.indexOf("## Evidence and Limits"));
  const block = limits.slice(limits.indexOf(`### ${id} Area ${id}\n\n**Events**\n\n`));
  return block.split("\n\n")[2].split("\n");
}

test("KT4: depth then authored order; source-need and scope-paused return to the same evaluation step in one session", async () => {
  const note = path.join(t.root, "extra-note.md");
  fs.writeFileSync(note, "more\n");
  const scopes = [scope("S3", ["S1", "S2"]), scope("S1"), scope("S2")];
  setPlan({
    "scripted/a": [
      ...scopeEntries("S1", [y({ kind: "source-need", locators: [note], reason: "need the note" }), candidate("S1")]),
      ...scopeEntries("S2", [y({ kind: "scope-paused", frontier: "which release is current?" }), candidate("S2")]),
      ...scopeEntries("S3", [candidate("S3")]),
    ],
  });
  const out = await runRetrace(request(scopes), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  // Execution and reporting order: depth 0 in authored order (S1, S2), then S3.
  const rows = out.markdown.split("\n").filter((l) => /^\| S\d Area/.test(l)).map((l) => l.slice(2, 4));
  assert.deepEqual(rows.slice(0, 3), ["S1", "S2", "S3"]);
  const log = events();
  const pidOf = (id) => log.find((e) => e.event === "prompt" && e.response.includes(`- ${id} holds`)).pid;
  const exitOf = (id) => log.findIndex((e) => e.event === "exit" && e.pid === pidOf(id));
  const startOf = (id) => log.findIndex((e) => e.event === "start" && e.pid === pidOf(id));
  assert.ok(startOf("S3") > Math.max(exitOf("S1"), exitOf("S2")), "S3 starts after its prerequisites resolved");
  // S3 runs alone: its reviewers are every process started after its evaluator; all exit before the evaluator does.
  const e3 = pidOf("S3");
  const reviewers = log.slice(startOf("S3")).filter((e) => e.event === "start" && e.pid !== e3).map((e) => e.pid);
  assert.ok(reviewers.length > 0);
  const candidateTurn = log.findIndex((e) => e.event === "prompt" && e.pid === e3);
  const reviewerTurns = log.map((e, i) => [e, i]).filter(([e]) => e.event === "prompt" && reviewers.includes(e.pid)).map(([, i]) => i);
  assert.deepEqual(reviewerTurns.map((i) => log[i].passMarker), ["initial", "rethink"]);
  assert.ok(reviewerTurns[0] > candidateTurn, "review follows the candidate");
  for (const pid of reviewers) assert.ok(log.findIndex((e) => e.event === "exit" && e.pid === pid) < exitOf("S3"), "reviewers exit before the evaluator");
  for (const id of ["S1", "S2"]) {
    const turns = log.filter((e) => e.event === "prompt" && e.pid === pidOf(id));
    assert.deepEqual(turns.map((e) => e.passMarker), ["evaluate", "continue"]);
    assert.equal(new Set(turns.map((e) => e.sessionId)).size, 1);
  }
  const tail = ["candidate-ready admitted", "begin-reconcile", "reviewers disposed", "scope-result", "scope-result admitted", "evaluator disposed"].map((e) => `- ${e}`);
  assert.deepEqual(scopeEvents(out.markdown, "S1"), ["- evaluate", `- source-need ${note}`, "- continue", ...tail]);
  assert.deepEqual(scopeEvents(out.markdown, "S2"), ["- evaluate", "- scope-paused: which release is current?", "- continue", ...tail]);
  assert.deepEqual(scopeEvents(out.markdown, "S3"), ["- evaluate", ...tail]);
  assertCleanedUp();
});

test("KT4: a delegated review in Artifact mode is rejected before any actor starts", async () => {
  const file = path.join(t.root, "S1.md");
  fs.writeFileSync(file, "notes\n");
  const begin = ["begin-reconcile", "Caller: retrace", "Parent: retrace:x", "Controller: S1/evaluator", "Scope: S1", "Scope approval locator: frozen:x/S1/approval", "Scope contract locator: frozen:x/S1/contract", "Candidate locator: frozen:x/S1/candidate", "Evidence manifest locator: frozen:x/S1/manifest", "Mode: Artifact edits", "Authorization locator: frozen:x/S1/authorization"].join("\n");
  const out = await runReconcile(
    { goal: "Retrace scope S1", candidate: { identity: "frozen:x/S1/candidate", artifact: file }, context: [], mode: "artifact", cap: "none", approval: APPROVAL },
    deps(),
    { reportOnly: true, ownerScope: "S1", beginReconcile: begin, records: new Map(), authorizationSha256: "0".repeat(64) },
  );
  assert.equal(out.status, "rejected");
  assert.ok(out.problems.some((p) => /conversation/i.test(p)), out.problems.join("; "));
  assert.deepEqual(events(), [], "no process was started");
  assert.equal(fs.readFileSync(file, "utf8"), "notes\n");
});

test("KS5: a scope that exhausts its invalid returns stops alone; its sibling resolves and the aggregate is partial", async () => {
  const bad = 'invalid:{"kind":"candidate-ready","report":"no kind line","manifest":[],"disposition":"proposal"}';
  // S2's report carries its Aggregate summary in the inline form scopes author live.
  const report = [
    "Kind: conversation",
    "",
    "## Refinement Direction, No Change, or Blocker",
    "",
    "Total cost of the chosen direction: none.",
    "",
    "**Aggregate summary:** Scope S2 is `proposal`.",
    "",
    "- `S2.md` needs one constant renamed.",
    "- The frontier:",
    "   - Whether callers outside the root use it.",
    "",
    "## Canonical Impact and Transfer",
    "",
    "- none",
  ].join("\n");
  setPlan({ "scripted/a": [...scopeEntries("S1", [bad, bad, bad, bad]), ...scopeEntries("S2", [candidate("S2", report)])] });
  const out = await runRetrace(request([scope("S1"), scope("S2")]), deps());
  assert.equal(out.exitCode, 1);
  const log = events();
  const failed = log.filter((e) => e.event === "prompt" && e.response === bad);
  assert.deepEqual(failed.map((e) => e.passMarker), ["evaluate", "reask", "reask", "reask"]);
  const result = out.markdown.slice(0, out.markdown.indexOf("\n### "));
  assert.equal(
    result,
    [
      "## Result",
      "",
      "**Aggregate**",
      "",
      "- partial",
      "- resolved scopes: 1 of 2",
      "- dispositions: proposal 1, no-change 0, blocker 0",
      "- frontier S1: 4 invalid returns (field `manifest` must be a non-empty array of {locator, role})",
      "- evaluation only: no implementation was performed",
      "",
      "## Scope Results",
      "",
      "| Scope | Disposition | Outer rounds | Report updates | VALID by round |",
      "|---|---|---|---|---|",
      "| S1 Area S1 | none | 0 | 0 | none |",
      "| S2 Area S2 | proposal | 1 | 0 | 1: A |",
      "",
    ].join("\n"),
  );
  const findings = out.markdown.slice(out.markdown.indexOf("## Findings and Directions"), out.markdown.indexOf("## Evidence and Limits"));
  assert.equal(
    findings,
    [
      "## Findings and Directions",
      "",
      "### S2 Area S2",
      "",
      "**Finding and direction**",
      "",
      "- Scope S2 is `proposal`.",
      "- `S2.md` needs one constant renamed.",
      "- The frontier:",
      "   - Whether callers outside the root use it.",
      "",
      "",
    ].join("\n"),
  );
  assert.match(out.markdown, /### S1 Area S1\n\n\*\*Review status\*\*\n\n- stopped\n/);
  assert.match(out.markdown, /### S2 Area S2\n\n\*\*Review status\*\*\n\n- complete\n\n\*\*Evidence freshness\*\*\n\n- current\n/);
  assertCleanedUp();
});

test("KS6: a delegated reviewer whose exit is not observed stops its scope, blocks dependents and exits 3", async () => {
  setPlan({ "scripted/a": [...scopeEntries("S1", [candidate("S1")]), ...scopeEntries("S2", [candidate("S2")])] });
  // Every scripted process except the S1 evaluator is S1's reviewer (S2 must never start); report those present.
  const reviewerPids = () => {
    const log = events();
    const evaluators = evaluatorPids(log);
    return new Set(log.filter((e) => e.event === "start" && !evaluators.has(e.pid)).map((e) => e.pid));
  };
  const out = await runRetrace(request([scope("S1"), scope("S2", ["S1"])]), { ...deps(), observePid: (pid) => (reviewerPids().has(pid) ? "present" : observePid(pid)) });
  assert.equal(out.exitCode, 3);
  const log = events();
  const evaluators = evaluatorPids(log);
  assert.equal(evaluators.size, 1, "only S1's evaluator ever started");
  assert.match(out.markdown, /^## Result\n\n\*\*Aggregate\*\*\n\n- blocked\n- resolved scopes: 0 of 2\n/);
  const reviewerPid = log.find((e) => e.event === "prompt" && e.passMarker === "initial").pid;
  const s1 = out.markdown.slice(out.markdown.indexOf("### S1 Area S1\n\n**Review status**"));
  assert.match(s1, /^### S1 Area S1\n\n\*\*Review status\*\*\n\n- stopped\n\n\*\*Evidence freshness\*\*\n\n- current\n\n\*\*Frontier\*\*\n\n- cleanup failure: /);
  const frontier = /\*\*Frontier\*\*\n\n- (.*)\n/.exec(s1)[1];
  assert.ok(frontier.startsWith("cleanup failure: S1/A: PID ") && frontier.includes(`${reviewerPid} present`), frontier);
  assert.match(out.markdown, /### S2 Area S2\n\n\*\*Review status\*\*\n\n- stopped\n\n\*\*Evidence freshness\*\*\n\n- unreadable\n\n\*\*Frontier\*\*\n\n- prerequisite S1 has no current resolved result\n/);
  // The admitted scope-result carried `Review status: stopped` (admission requires it to equal the rendered status).
  const events1 = scopeEvents(out.markdown, "S1");
  assert.ok(events1.includes("- scope-result admitted"));
  assert.ok(events1.some((e) => e.startsWith("- reviewer disposal not established: S1/A: PID ")));
  for (const e of log.filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH", "children really exited");
});
