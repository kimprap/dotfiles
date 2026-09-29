// Retrace contract tests (spec-v3 §7): the public Retrace entry drives scope
// evaluators and their delegated Reconcile reviewers against the scripted ACP
// agent child. Concurrency and order are read from the scripted agent's log.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { main } from "../cli.mjs";
import { runReconcile, runRetrace } from "../controller.mjs";
import { observePid } from "../lib/adapter.mjs";
import { socketDirFor } from "../lib/env.mjs";
import { OMP_VERSION } from "../lib/versions.mjs";
import { createScriptedLauncher } from "./fixtures/scripted-acp-agent.mjs";

const PROMPTS = {
  reviewer: {
    initial: "Goal: {{GOAL}}\nProposal:\n{{PROPOSAL}}",
    rethink: "Read {{RETHINK_SKILL}} once and rethink.\n{{PROPOSAL}}",
    later: "{{PROPOSAL}}\n{{BLOCKED_RETRY}}\n{{DISPUTE}}",
    source: "{{SOURCE_STATUS}}\n{{SOURCES}}",
    reask: "Not accepted: {{DEFECT}}",
    dispute: "Dispute from {{AUTHOR}}:\n{{CITATIONS}}",
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

test("models override: an exact A override binds the scope evaluator and the delegated reviewer A", async () => {
  const bin = path.join(t.dir, "bin");
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "omp"), `#!/bin/sh\nif [ "$1" = "--version" ]; then echo '${OMP_VERSION}'; exit 0; fi\nexec '${t.launcher}' "$@"\n`, { mode: 0o755 });
  setPlan({ "scripted/c": scopeEntries("S1", [candidate("S1")]) });
  const out = await main({
    argv: ["retrace"],
    stdinText: JSON.stringify({ ...request([scope("S1")]), models: { a: "scripted/c:high" } }),
    env: { PATH: `${bin}:${process.env.PATH}` },
    sessionsRoot: t.sessionsRoot,
    tmpRoot: t.tmpRoot,
    readModelRoles: async () => ({ ok: true, roles: ROLES }),
    readModelCatalog: async () => ({ ok: true, models: [{ provider: "scripted", id: "c", selector: "scripted/c", thinking: ["low", "high"] }] }),
    loadPrompts: async () => ({ ok: true, prompts: PROMPTS, sources: {} }),
    log: () => {},
  });
  assert.equal(out.exitCode, 0, out.stdout);
  const starts = events().filter((e) => e.event === "start");
  assert.ok(starts.length >= 2, "evaluator and reviewer A started");
  assert.ok(starts.every((e) => e.model === "scripted/c"), `every actor on the override: ${starts.map((e) => e.model)}`);
  const spend = out.stdout.slice(out.stdout.indexOf("\n## Spend\n"));
  const rows = spend.split("\n").filter((l) => l.startsWith("| S1/"));
  assert.ok(rows.length >= 2 && rows.every((r) => r.includes(" | scripted/c | high | ")), spend);
  assertCleanedUp();
});

/** The event names on the one arrow line under scope `id`'s `**Events**` in Evidence and Limits. */
function scopeEvents(markdown, id) {
  const limits = markdown.slice(markdown.indexOf("## Evidence and Limits"));
  const m = new RegExp(`\\n### ${id} Area ${id}\\n\\n\\*\\*Events\\*\\*\\n\\n- (.*)\\n`).exec(limits);
  assert.ok(m, `scope ${id} has an Events line`);
  return m[1].split(" → ");
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
  const tail = ["candidate-ready admitted", "begin-reconcile", "reviewers disposed", "scope-result", "scope-result admitted", "evaluator disposed"];
  assert.deepEqual(scopeEvents(out.markdown, "S1"), ["evaluate", `source-need ${note}`, "continue", ...tail]);
  assert.deepEqual(scopeEvents(out.markdown, "S2"), ["evaluate", "scope-paused: which release is current?", "continue", ...tail]);
  assert.deepEqual(scopeEvents(out.markdown, "S3"), ["evaluate", ...tail]);
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
  setPlan({ "scripted/a": [...scopeEntries("S1", [bad, bad, bad, bad]), ...scopeEntries("S2", [candidate("S2")])] });
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
  assert.ok(events1.includes("scope-result admitted"));
  assert.ok(events1.some((e) => e.startsWith("reviewer disposal not established: S1/A: PID ")));
  for (const e of log.filter((x) => x.event === "start")) assert.equal(observePid(e.pid), "ESRCH", "children really exited");
});

test("KT5: labelled summaries render as fixed finding bullets, other summaries as authored prose, reviewed reports last", async () => {
  const reports = {
    // Two labelled findings; the second authors no Identity and uses both bold label forms.
    S1: [
      "Kind: conversation",
      "",
      "## Refinement Direction, No Change, or Blocker",
      "",
      "See the report body.",
      "",
      "**Aggregate summary**",
      "",
      "- Identity: lock coverage · preflight owner · missing lock comparison · S1.md",
      "- Finding: `S1.md` compares the installed version only, so a lock drift passes.",
      "- Direction: compare the locked version in `S1.md`.",
      "- Validation: npm test with a drifted lock refuses with exit 2.   ",
      "",
      "- **Finding:** `S1.md` never reads the SDK version.",
      "- **Direction**: add the SDK comparison to `S1.md`.",
      "- Validation: npm test with a drifted SDK refuses with exit 2.",
      "",
      "## Canonical Impact and Transfer",
      "",
      "- none",
    ].join("\n"),
    // The inline form scopes author live, with a nested item.
    S2: [
      "Kind: conversation",
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
    ].join("\n"),
    // Labelled lines without Direction: not the fixed form, so rendered as authored.
    S3: ["Kind: conversation", "", "**Aggregate summary**", "", "- Identity: none", "- Finding: no-change: `S3.md` holds; frontier: none.", "- Validation: none"].join("\n"),
    // No summary; a fenced block forces a longer reviewed-report fence.
    S4: ["Kind: conversation", "", "The evidence reads:", "", "```text", "notes for S4", "```"].join("\n"),
  };
  const ids = ["S1", "S2", "S3", "S4"];
  setPlan({ "scripted/a": ids.flatMap((id) => scopeEntries(id, [candidate(id, reports[id])])) });
  const out = await runRetrace(request(ids.map((id) => scope(id))), deps());
  assert.equal(out.exitCode, 0, out.markdown);
  const section = (from, to) => out.markdown.slice(out.markdown.indexOf(from), out.markdown.indexOf(to));
  assert.equal(
    section("## Findings and Directions", "## Evidence and Limits"),
    [
      "## Findings and Directions",
      "",
      "### S1 Area S1",
      "",
      "**Finding 1**",
      "",
      "- Identity: lock coverage · preflight owner · missing lock comparison · S1.md",
      "- Finding: `S1.md` compares the installed version only, so a lock drift passes.",
      "- Direction: compare the locked version in `S1.md`.",
      "- Validation: npm test with a drifted lock refuses with exit 2.",
      "",
      "**Finding 2**",
      "",
      "- Finding: `S1.md` never reads the SDK version.",
      "- Direction: add the SDK comparison to `S1.md`.",
      "- Validation: npm test with a drifted SDK refuses with exit 2.",
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
      "### S3 Area S3",
      "",
      "**Finding and direction**",
      "",
      "- Identity: none",
      "- Finding: no-change: `S3.md` holds; frontier: none.",
      "- Validation: none",
      "",
      "### S4 Area S4",
      "",
      "**Finding and direction**",
      "",
      "- the reviewed report carries no scope-authored Aggregate summary; its complete text is under Evidence and Limits",
      "",
      "",
    ].join("\n"),
  );
  const limits = section("## Evidence and Limits", "\n## Spend\n");
  const s1 = limits.slice(limits.indexOf("### S1 Area S1\n"), limits.indexOf("\n\n**Provisional-to-final**"));
  const sha = crypto.createHash("sha256").update("notes for S1\n").digest("hex");
  assert.equal(
    s1,
    [
      "### S1 Area S1",
      "",
      "**Events**",
      "",
      "- evaluate → candidate-ready admitted → begin-reconcile → reviewers disposed → scope-result → scope-result admitted → evaluator disposed",
      "",
      "**Manifest**",
      "",
      `- ${path.join(t.root, "S1.md")} (current) sha256:${sha}`,
    ].join("\n"),
  );
  const reviewed = limits.slice(limits.indexOf("### Reviewed reports\n"));
  assert.equal(limits.lastIndexOf("\n### "), limits.indexOf("\n### Reviewed reports\n"), "Reviewed reports is the last H3");
  assert.equal(
    reviewed,
    [
      "### Reviewed reports",
      ...ids.flatMap((id) => {
        const fence = id === "S4" ? "````" : "```";
        return ["", `**${id} Area ${id}**`, "", `${fence}text`, reports[id], fence];
      }),
      "",
    ].join("\n"),
  );
  assertCleanedUp();
});

test("citations and dispute: delegated review resolves a cited revert against the Retrace boundary", async () => {
  const evidence = path.join(t.root, "S1.md");
  fs.writeFileSync(evidence, "notes for S1\nS1 keeps the constant NAME.\nS1 has one caller.\n");
  const outside = path.join(t.dir, "outside.md");
  fs.writeFileSync(outside, "unrelated\n");
  const report = (point) => `Kind: conversation\n\n**Aggregate summary**\n\n- ${point}`;
  const revise = (point, citations) => y({ kind: "review", verdict: "REVISE", summary: ["The report misstates S1"], blocking_issues: ["wrong claim"], correction: { replacement: report(point) }, preserve: [], ...(citations && { citations }) });
  const cited = { path: evidence, line: 2, quote: "S1 keeps the constant NAME." };
  // Reply order: the outside citation first, so a defect naming it would precede the root one and miss `when`.
  const mismatch = [{ path: outside, line: 1, quote: "not in the file" }, { ...cited, quote: "S1 has one caller." }];
  setPlan({
    "scripted/a": [
      { when: "Phase: evaluate\nScope: S1\n", then: y({ kind: "candidate-ready", report: report("S1 holds"), manifest: [{ locator: evidence, role: "current" }], disposition: "proposal" }) },
      { when: "Owner: S1\n", then: VALID },
      { when: "Owner: S1\n", then: revise("S1 keeps the constant NAME.", mismatch) },
      { when: `Owner: S1\n\nNot accepted: citation mismatch: ${evidence}:2: quote not found in the cited line(s)`, then: revise("S1 keeps the constant NAME.") },
      { when: "Owner: S1\n", then: revise("S1 keeps the constant NAME.", [cited]) },
      { when: "Owner: S1\n", then: VALID },
    ],
    "scripted/b": [revise("S1 renames the constant."), revise("S1 renames the constant."), { when: `Dispute from A:\n${evidence}:2\n\`\`\`text\nS1 keeps the constant NAME.\n\`\`\``, then: VALID }],
  });
  const out = await runRetrace({ ...request([scope("S1")]), evidence: [{ locator: evidence, role: "current" }] }, deps());
  assert.equal(out.exitCode, 0, out.markdown);
  assert.match(out.markdown, /^## Result\n\n\*\*Aggregate\*\*\n\n- complete\n- resolved scopes: 1 of 1\n/);
  assert.ok(out.markdown.includes("\n| S1 Area S1 | proposal | 2 | 1 | 1: B; 2: A |\n"), out.markdown);
  assert.doesNotMatch(out.markdown, /\*\*Frontier\*\*/);
  const passes = (model) => events().filter((e) => e.event === "prompt" && e.model === model && e.passMarker !== "evaluate").map((e) => e.passMarker);
  assert.deepEqual(passes("scripted/a"), ["initial", "rethink", "reask", "later", "later"]);
  assert.deepEqual(passes("scripted/b"), ["initial", "rethink", "later"]);
  assertCleanedUp();
});
