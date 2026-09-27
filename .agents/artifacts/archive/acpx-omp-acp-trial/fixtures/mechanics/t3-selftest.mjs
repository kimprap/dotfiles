#!/usr/bin/env node
// Scripted T3 self-test: the real T3 execution/evaluation path (executeT3 ->
// finalizeT3 -> spawned verify.mjs) against the scripted fixture agent, under
// a private /tmp runs root. Mechanics evidence only, never production
// evidence; no model, no live store, no bundle run directory.
//   node fixtures/mechanics/t3-selftest.mjs --base /tmp/<private-dir> [--plan JSON] [--prestop REASON]
// The launcher writes a test approval (the checked-in approval plus scripted
// scenario inputs), a fixture evidence root, then runs the child under the
// sanitized private environment exactly like run.mjs does.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, writeJson } from "../../lib/evidence/io.mjs";
import { createPrivateRoot, removePrivateRoot, sanitizedEnv } from "../../lib/native/env.mjs";
import { BUNDLE_DIR } from "../../lib/native/pins.mjs";
import { executeT3, finalizeT3 } from "../../lib/semantic/t3.mjs";
import { checkT3Authority, sourceIdentities } from "../../run.mjs";

const SELF = fileURLToPath(import.meta.url);
const AGENT = path.join(BUNDLE_DIR, "fixture-agent", "t3.mjs");
const S2_SOURCE = ".agents/artifacts/acpx-omp-acp-trial/fixtures/mechanics/t3-s2-source.md";
const AT = "2026-09-25T00:00:00Z";

function args(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) o[argv[i].replace(/^--/, "")] = argv[i + 1];
  return o;
}

export function scriptedScenarios(root) {
  return {
    S1: {
      brief: {
        goal: "Decide whether the scripted proposal is correct.",
        candidate: { text: "Proposal: ship the change. Status: FLAW" },
        context: "Scripted prior discussion: the proposal was drafted quickly.",
        mode: "Conversation replacement",
        maxOuterIterations: "none",
        approval: { approvedBy: "human", at: AT, fiveFields: true },
      },
    },
    S2: {
      brief: {
        goal: "Remove the flaw marker from the scripted artifact.",
        candidate: { path: S2_SOURCE },
        context: "Scripted harmless artifact; only the private copy changes.",
        mode: "Artifact edits",
        maxOuterIterations: 1,
        approval: { approvedBy: "human", at: AT, fiveFields: true },
      },
      validator: { requiredLines: ["Required: keep this line.", "Required: keep this line too."] },
    },
    S3: {
      table: {
        root,
        scopes: [
          { id: "s1", objective: "Evaluate evidence s1.", requires: [] },
          { id: "s2", objective: "Evaluate evidence s2 using s1.", requires: ["s1"] },
          { id: "s3", objective: "Evaluate evidence s3.", requires: [] },
        ],
        approval: { approvedBy: "human", fullTable: true, at: AT },
      },
    },
  };
}

async function launcher(o) {
  const base = path.resolve(o.base);
  if (!base.startsWith("/tmp/")) throw new Error("--base must be a private directory under /tmp");
  const runsRoot = path.join(base, "runs");
  const evRoot = path.join(base, "evidence-root");
  await fs.mkdir(runsRoot, { recursive: true, mode: 0o700 });
  await fs.mkdir(evRoot, { recursive: true, mode: 0o700 });
  for (const s of ["s1", "s2", "s3"]) await fs.writeFile(path.join(evRoot, `evidence-${s}.md`), `Scripted evidence for ${s}.\n`);
  const approval = { ...(await readJson(path.join(BUNDLE_DIR, "config", "approval.json"))), scenarios: scriptedScenarios(await fs.realpath(evRoot)) };
  const approvalPath = path.join(base, "approval.json");
  await writeJson(approvalPath, approval);
  const runId = `t3-run-${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}-${randomBytes(3).toString("hex")}`;
  const runDir = path.join(runsRoot, runId);
  await fs.mkdir(runDir);
  const dirs = await createPrivateRoot("t3self");
  const plan = o.plan ? JSON.parse(o.plan) : [{ stage: "rehearsal", scenarios: ["S1", "S2", "S3"] }, { stage: "production", scenarios: ["S1", "S2", "S3"], requiresRehearsalClear: true }];
  await writeJson(path.join(runDir, "launch.json"), { runId, command: "t3-selftest", launcherPid: process.pid, privateRoot: dirs.root, entry: { scripted: true, note: "scripted self-test: T2 entry not applicable" }, corrects: null, plan });
  const code = await new Promise((resolve) => {
    const c = spawn(process.execPath, [SELF, "--t3-child", "1", "--run", runDir, "--runs-root", runsRoot, "--root", dirs.root, "--approval", approvalPath, ...(o.prestop ? ["--prestop", o.prestop] : [])], { env: sanitizedEnv(dirs), cwd: BUNDLE_DIR, stdio: ["ignore", "inherit", "inherit"] });
    c.on("exit", (x, sig) => resolve(x ?? (sig ? 128 : 1)));
  });
  const left = await fs.stat(dirs.root).then(() => true, () => false);
  const removal = left ? await removePrivateRoot(dirs) : undefined;
  await writeJson(path.join(runDir, "launcher-exit.json"), { childExitCode: code, privateRootPresentAfterChild: left, launcherRemovedPrivateRoot: removal?.removed, at: new Date().toISOString() });
  process.stdout.write(`RUN=${runDir}\n`);
  return code;
}

async function child(o) {
  const dirs = { root: o.root, home: path.join(o.root, "home"), tmp: path.join(o.root, "tmp"), sessions: path.join(o.root, "sessions"), cwd: path.join(o.root, "cwd") };
  const launch = await readJson(path.join(o.run, "launch.json"));
  const approval = await readJson(o.approval);
  const authority = await checkT3Authority(o.approval);
  const out = await executeT3({
    runDir: o.run,
    runsRoot: o["runs-root"],
    dirs,
    approval,
    approvalMeta: { path: authority.approvalPath, sha256: authority.approvalSha256 },
    entry: launch.entry,
    corrects: null,
    plan: launch.plan,
    argvFor: () => [process.execPath, AGENT],
    scripted: true,
    authority,
    sources: await sourceIdentities(),
    s0: { scripted: true, env: { HOME: process.env.HOME, TMPDIR: process.env.TMPDIR } },
    preStops: o.prestop ? [`preflight: ${o.prestop}`] : [],
  });
  await finalizeT3({ runDir: o.run, out, t2Run: "scripted-self-test" });
  return 0;
}

const o = args(process.argv.slice(2));
process.exitCode = o["t3-child"] ? await child(o) : await launcher(o);
