#!/usr/bin/env node
// T3 verifier fixtures: one passing and one failing evidence set per T3
// criterion (the failing set is a single targeted defect injected into a copy
// of a passing scripted run), plus the plan-identity lifecycle cases for both
// the runner's recorder and the verifier's comparator.
//   node fixtures/mechanics/t3-cases.mjs --run <passing scripted T3 run> --scratch /tmp/<private-dir>
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, BUNDLE_DIR } from "../../lib/native/pins.mjs";
import { planLifecycleNormalized } from "../../run.mjs";
import { planIdentityText } from "../../verify.mjs";

const argv = process.argv.slice(2);
const opt = (k) => argv[argv.indexOf(`--${k}`) + 1];
const RUN = path.resolve(opt("run"));
const SCRATCH = path.resolve(opt("scratch"));
if (!SCRATCH.startsWith("/tmp/")) throw new Error("--scratch must be under /tmp");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const results = [];
const record = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? "ok  " : "BAD "} ${name}${detail ? ` — ${detail}` : ""}`);
};

// ------------------------------------------------------------ verifier cases

const verify = (run, id) => {
  const r = spawnSync(process.execPath, [path.join(BUNDLE_DIR, "verify.mjs"), run, id], { encoding: "utf8" });
  return { code: r.status, last: r.stdout.trim().split("\n").at(-1), fails: r.stdout.split("\n").filter((l) => l.trim().startsWith(`FAIL ${id}:`)).map((l) => l.trim()) };
};

function mutate(name, fn) {
  const dir = path.join(SCRATCH, name);
  fs.cpSync(RUN, dir, { recursive: true });
  const J = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const W = (f, v) => fs.writeFileSync(path.join(dir, f), `${JSON.stringify(v, null, 2)}\n`);
  fn({ J, W, dir });
  return dir;
}
const prodActor = (sc, pred) => sc.actors.find((a) => a.stage === "production" && pred(a));

const CASES = {
  "AC-REHEARSAL": ({ J, W }) => {
    const sc = J("scenarios.json");
    sc.actors.find((a) => a.stage === "rehearsal").profile = "A"; // rehearsal off the tiny profile
    W("scenarios.json", sc);
  },
  "AC-CONVERSATION": ({ J, W }) => {
    const sc = J("scenarios.json");
    sc.stages.production.scenarios.S1.result.rounds[0].turns[0].requestId = "fabricated-request"; // turn without a retained row
    W("scenarios.json", sc);
  },
  "AC-RETHINK": ({ J, W }) => {
    const sc = J("scenarios.json");
    const a = prodActor(sc, (x) => x.scenario === "S1" && x.role === "A");
    for (const q of a.requests) if (q.phase === "rethink") q.phase = "later"; // first review skipped its rethink
    W("scenarios.json", sc);
  },
  "AC-ARTIFACT": ({ J, W }) => {
    const sc = J("scenarios.json");
    const art = sc.stages.production.scenarios.S2.artifact;
    art.writes.push({ ...art.writes[0], sha256: "0".repeat(64) }); // second write beyond cap 1
    W("scenarios.json", sc);
  },
  "AC-RETRACE": ({ J, W }) => {
    const sc = J("scenarios.json");
    const R = sc.stages.production.scenarios.S3.retrace;
    const len = R.intervals.s3.end - R.intervals.s3.start;
    R.intervals.s3 = { start: R.intervals.s1.end + 1, end: R.intervals.s1.end + 1 + len }; // s1/s3 serialized
    W("scenarios.json", sc);
  },
  "AC-DURATIONS": ({ J, W }) => {
    const r = J("report.json");
    r.durations.thriceMaxMs = r.durations.maxCompletedMs * 3 + 1; // wrong 3x arithmetic
    W("report.json", r);
  },
  "AC-CLEANUP": ({ J, W }) => {
    const sc = J("scenarios.json");
    prodActor(sc, (x) => x.scenario === "S3").close.pidResults[0].result = "EPERM"; // exit not observed
    W("scenarios.json", sc);
  },
  "AC-REPORT": ({ J, W }) => {
    const r = J("report.json");
    r.capability.scenarios.S2.result = "not-supported"; // relabelled outcome
    W("report.json", r);
  },
};

fs.mkdirSync(SCRATCH, { recursive: true });
for (const [id, fn] of Object.entries(CASES)) {
  const pass = verify(RUN, id);
  record(`${id} passing set`, pass.code === 0 && pass.last === `PASS ${id}`, pass.last);
  const bad = verify(mutate(id, fn), id);
  record(`${id} failing set`, bad.code === 1 && bad.last === `FAIL ${id}`, bad.fails[0] ?? bad.last);
}
const all = verify(RUN, "T3");
record("T3 selector on passing set", all.code === 0 && all.last === "PASS T3", all.last);
const cross = verify(RUN, "AC-MAPPING");
record("T2 criterion refused on a T3 run", cross.code === 1 && cross.fails.some((f) => f.includes("is not a T3 criterion")), cross.fails[0]);

// ------------------------------------------------------------ plan identity

const planText = fs.readFileSync(path.join(REPO_ROOT, ".agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md"), "utf8");
const R = (t) => sha(planLifecycleNormalized(t));
const V = (t) => sha(planIdentityText(t));
const base = { r: R(planText), v: V(planText) };
record("plan: recorder and comparator agree on the current plan", base.r === base.v);
const lines = planText.split("\n");
const t3 = lines.findIndex((l) => l.startsWith("- [ ] T3."));
const acOpen = lines.findIndex((l) => /^- \[ \] AC-/.test(l));
const status = lines.findIndex((l) => l.startsWith("**Status**: "));
const edit = (fn) => {
  const c = [...lines];
  fn(c);
  return c.join("\n");
};
const KEEP = {
  "task checkbox flip": edit((c) => (c[t3] = c[t3].replace("- [ ] ", "- [x] "))),
  "full completion lifecycle": (() => {
    const c = [...lines];
    c[status] = "**Status**: COMPLETED";
    c.splice(status + 1, 0, "**Completed At**: 2026-09-26-1015");
    const i = c.findIndex((l) => l.startsWith("- [ ] T3."));
    c[i] = c[i].replace("- [ ] ", "- [x] ");
    c.splice(i + 1, 0, "  completed 2026-09-26-1015");
    return `${c.map((l) => (/^- \[ \] AC-/.test(l) ? l.replace("- [ ] ", "- [x] ") : l)).join("\n")}\n## Completion Summary\n\n- Outcome: scripted.\n`;
  })(),
  // Regression: a lifecycle line between blank lines just before an appended summary.
  "completed line before an appended summary": `${planText}\n  completed 2026-09-26-1015\n\n## Completion Summary\n\n- Outcome: scripted.\n`,
};
for (const [name, text] of Object.entries(KEEP)) record(`plan: ${name} keeps the identity`, R(text) === base.r && V(text) === base.v && text !== planText);
const word = lines.findIndex((l, i) => i > t3 && /\bexecution\b/.test(l));
const CHANGE = {
  "one word edited in a task body": edit((c) => (c[word] = c[word].replace(/\bexecution\b/, "executions"))),
  "checkbox-looking text inside a line edited": edit((c) => (c[t3] = `${c[t3]} x`)),
  "non-lifecycle line added": edit((c) => c.splice(t3 + 1, 0, "  note 2026-09-26-1015")),
  "heading renamed": edit((c) => {
    const h = c.findIndex((l) => l === "## Recovery and stops");
    c[h] = "## Recovery and stop";
  }),
  "section after an interior Completion Summary edited": (() => {
    const c = [...lines];
    const h = c.findIndex((l) => l === "## Recovery and stops");
    c.splice(h, 0, "## Completion Summary", "", "- x", "");
    c[h + 5] = `${c[h + 5]} changed`;
    return c.join("\n");
  })(),
};
for (const [name, text] of Object.entries(CHANGE)) record(`plan: ${name} changes the identity`, R(text) !== base.r && V(text) !== base.v && R(text) === V(text));
const interior = (() => {
  const c = [...lines];
  const h = c.findIndex((l) => l === "## Recovery and stops");
  c.splice(h, 0, "## Completion Summary", "", "- interior summary", "");
  return c.join("\n");
})();
record("plan: interior Completion Summary removed identically", R(interior) === base.r && V(interior) === base.v);

const bad = results.filter((r) => !r.ok);
console.log(bad.length ? `FAIL t3-cases (${bad.length}/${results.length})` : `PASS t3-cases (${results.length})`);
process.exitCode = bad.length ? 1 : 0;
