# Cut Reconcile and Retrace over to the acpx + native omp acp controller

**Datetime**: 2026-09-27-0134
**Scope**: Checkpoint and lean-plan close, acp-controller with offline suite, skill/prompt/eval/reference rewrites, plugin removal, bounded test audit with one fix batch, three live runs
**Summary**: Replace the lifecycle plugin with one coded acpx 0.19.2 + native `omp acp` controller for Reconcile and Retrace, keeping all 29 guards, audit the production tests once, and prove the result with three live runs from a fresh OMP session.
**Status**: DONE
**Completed At**: 2026-09-27-1356

## Outcome and authority

- Outcome: Live Reconcile and Retrace run through `.config/agents/harnesses/omp/acp-controller/` (acpx 0.19.2, `@agentclientprotocol/sdk` 1.4.0, native `omp acp` 18.3.0) invoked once per run from the skill's root session, the lifecycle plugin and its references are removed, every KR1–KR16, KT1–KT5, KB1 and KS1–KS7 guard maps to a live location (KS8 not adopted), the production tests have received one completed `dev-test-audit` and at most one fix batch, and three live runs (Conversation, Artifact, Retrace) started from a fresh OMP session pass A7 with spend reported. Every acceptance item below is satisfied.
- Authority: [spec-v3](../artifacts/2026-09-27_reconcile-retrace-acp-production-spec.md) `reconcile-retrace-acp-production/spec-v3`, SHA-256 `2c1628c741a2870b584268527dd33fcf26e2483edb53c9d7cf77e3f80692e958`, whose §8 acceptance (A1–A13) is projected below unchanged and whose §9 seams set the task order; [requirements brief v2](../artifacts/2026-09-27_reconcile-retrace-acp-production-requirements.md) `reconcile-retrace-acp-production-requirements/v2`, SHA-256 `3998f332934c18f5b4479e205fb53d969d1e6bf34bee9086a051878a826651b8`; the approved route handoff with decisions 1–6 (spec-v3 §1.1, SHA-256 `c52f2222947be1ea7b01141b7020fe88810d31f7af48dec857f316a33ac2afd6`). The second approval approves spec-v2 (SHA-256 `0766ee3ba00ca403d6631f6b08262f96eba3467b97638594efe9bf0b2a1fcbda`) and this plan by SHA-256, the T1 checkpoint path list and the lean-plan close; after it, execution runs to DONE with no further go-ahead except the audit's own two Route Overview approvals (T8 file list, T9 fix batch).
- Assurance: standard

## Scope and effects

- Scope: Repository root `/Users/kim/.dotfiles`, HEAD `de06da2`. In acceptance checks `$C` = `.config/agents/harnesses/omp/acp-controller` and `$CKPT` = the T1 checkpoint commit SHA; spec-v3 §2–§7 own every behavior, file layout, interface and test named here. T1 (seam 0): checkpoint commit and lean-plan close commit. T2 (seam 1a): controller package, config overlay, native/CLI-shell modules, `cli.mjs`, scripted ACP agent fixture and `test/preflight.test.mjs`. T3 (seam 1b): `controller.mjs`, `lib/schema.mjs`, `lib/ports.mjs`, `test/reconcile.test.mjs`, `test/retrace.test.mjs`. T4 (seam 2a): the two SKILL files and `reviewer-protocol.md` rewritten with prompt markers; `reconcile/references/execution-flow.md` deleted. T5 and T6 (seam 2b): reconcile then retrace evals re-derived, `REC-SYNC-REPAIR-RESUME` renamed `REC-REPAIR-RESUME`. T7 (seam 2c): ADR-0010/INDEX/ADR-0004/ADR-0002, the spec-v3 §5 Q8 carve-out sites, extension and reviewer-agent removals, bootstrap L28–29, the two user-level agent symlinks, `config.yml` plugin line, extensions `package.json`/`bun.lock`. T8 (seam 3): `dev-test-audit` over the decision-6 scope (A6 ordered list), read-only. T9 (seam 4): "Apply the accepted test-audit fix batch". T10 (seam 5): three live runs. Interface T2→T3: T2 owns all of `cli.mjs` (argv/stdin, refusal order `checkVersions` → `readModelRoles` → `loadPrompts` → `findUndisposedRuns`, exit codes, stdout/stderr) and, only after every refusal passes, imports `./controller.mjs` and awaits `runReconcile(request, deps)`, `runRetrace(request, deps)`, `runNormalize(request, deps)`, `resumeReconcile(runId, request, deps)` or `disposeRun(runId, deps)`, each resolving `{ exitCode, markdown }` whose markdown already ends with the `## Spend` section from `lib/spend.mjs`; T3 implements those exports and never edits `cli.mjs` (a needed change returns to Main for T2's owner). Interface T3→T4: T4 uses the spec-v3 §5 Q3 markers and the §2.3 item 4 `data` fields exactly as T3's `lib/prompts.mjs` consumer and `lib/schema.mjs` expect. T9's surface is the A6 ordered files already written by T2, T3, T5 and T6; it edits them only after those owners are complete (sequential by dependency, never concurrent). Sizing (task-sizing.md): seams 1 and 2 are split as spec-v3 §9 states (≈2,000 adapted lines plus fixture and tests; ≈380 KB of skill/reference inputs); seam 2b is split per skill now because re-deriving the 166 KB reconcile and 78 KB retrace eval files plus reading the rewritten skills is unlikely to fit one reliable attempt, with retrace after reconcile because the shared eval-count check is owned by T6; T7 stays whole (targeted range edits, removals and the whole-tree A5 scan belong together) and depends on T6 so its scan sees rewritten evals; T1 stays whole because the close commit must follow the checkpoint. T10 live-run inputs, recorded with SHA-256 before launch: R1 Conversation, goal "Make this explanation of git stash accurate and concise", candidate text "`git stash` saves your uncommitted changes and resets the working tree to HEAD so you can switch tasks; `git stash pop` reapplies the most recent stash and removes it from the stash list.", no context, cap none; R2 Artifact, a fresh `/tmp/acp-live-artifact-<UTC>/notes.md` containing exactly the two lines "# git stash notes" and "`git stash pop` reapplies the most recent stash and keeps it in the stash list.", goal "Make these notes factually correct", cap 1, no validator; R3 Retrace, root objective "Assess whether `$C/lib/versions.mjs` and `$C/cli.mjs` implement spec-v3 §5 Q4 version refusal", scopes s1 "`lib/versions.mjs` matches Q4 constants and `checkVersions` behavior" and s2 "`cli.mjs` calls `checkVersions` before `readModelRoles` and any runtime" with s2 `requires` s1, evidence = those two files and spec-v3 (read-only).
- Effects: Repository changes only in the task targets. Git (staging only through `./bin/dot-add`, never raw `git add` of any form): exactly two local commits in T1: the checkpoint staged with `./bin/dot-add .config/agents docs/adr .agents/papercuts.json`, subject `chore(agents): checkpoint lifecycle-plugin state before acp cutover`, body "Checkpoint only. It separates current dirty bytes from cutover edits. No verification is claimed. It includes the working-tree modelRoles rewrite and other in-flight edits named in the handoff.", then the lean-plan close commit staged with `./bin/dot-add .agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md .agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md`, adding only the unchanged lean spec and the lean plan with only `**Status**: CLOSED`; at the second approval Main shows the user the exact path list from the non-mutating `git -C . status --porcelain=v1 -uall -- .config/agents docs/adr .agents/papercuts.json`, and T1 commits only if the index was empty before staging and `git -C . diff --staged --name-only` equals that approved list exactly; the only other Git effect is, only if the second approval grants it, one index-only `./bin/dot-add .config/agents/harnesses/omp/acp-controller/package-lock.json` in T2 for AC-A12-3 (no commit). No push, reset, stash, amend or other Git state change. Network: `npm ci`/`npm install` in `$C` (T2) and `bun install` in `harnesses/omp/extensions` (T7). Outside the repository: T7 removes `~/.omp/agent/agents/second-opinion-{a,b}.md` only when `readlink` prints the matching repo path, and does not run bootstrap; the `config.yml` edit takes effect for newly started OMP sessions because `~/.omp/agent/config.yml` symlinks to it; offline tests use temp roots removed afterwards; T10 launches fresh non-interactive OMP root sessions from bash (`omp -p --session-dir /Users/kim/.omp/agent/sessions/omp-live-proof-<run> …`, follow-ups with `--continue` on the same directory, cwd repository root, normal live config, no overlay or skill/rule suppression), which create ordinary kept session storage there, and the controller they invoke creates and removes its own private roots and `acp-controller-*` session folders, performs model requests on `modelRoles.second_opinion_a`/`second_opinion_b` with no token or USD cap (spend reported), and performs ordinary OAuth refresh bookkeeping in `/Users/kim/.omp/agent`; T10 answers each run's approval question with `approve` only under the live-run approval relay described in Stops.
- Non-goals: Editing spec-v3, brief v2, the lean spec, or anything under `.agents/artifacts/acpx-omp-acp-trial/` (frozen; never imported); following or revising the lean-redesign plan beyond its Status line; `references/agent-return/test_decode.py`; `.config/cursor`, `.config/karabiner`, and untracked plans/artifacts in the checkpoint; running bootstrap; `key-remaps.js` dependencies; adopting KS8; a controller-pinned model pair; token/USD caps, pools, rehearsal, the trial debug loop or binary SHA pins; exercising KR13 live; a second test-audit fix batch or widening the batch beyond the decision-6 scope; permanent tests for prompt-marker wiring, overlay content, env lists, spend formatting or argv assembly; reading live OMP session JSONL; touching PID 56135 or `/Users/kim/.omp/profiles/acpx-trial-inspect`; shipping or push; code review, verification, learning and presentation, which the runtime schedules after T10.

## Tasks

- [x] T1. Make the checkpoint commit of the shown path list, then the lean-plan close commit
  completed 2026-09-27-0150
  - Owner: ProdCheckpoint
  - Depends on: none
  - Targets: Git local commits (checkpoint and lean-plan close), .agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md, .agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md
  - Acceptance: AC-A1-1, AC-A1-2, AC-A1-3, AC-A2-1, AC-A2-2, AC-A2-3, AC-A2-4, AC-A2-5
  - Receiver: Main
- [x] T2. Build the controller package, native layer and CLI shell with version and undisposed-run refusals
  completed 2026-09-27-0213
  - Owner: ProdNativeLayer
  - Depends on: T1
  - Targets: .config/agents/harnesses/omp/acp-controller/package.json, .config/agents/harnesses/omp/acp-controller/package-lock.json, .config/agents/harnesses/omp/acp-controller/config/omp-overlay.yml, .config/agents/harnesses/omp/acp-controller/cli.mjs, .config/agents/harnesses/omp/acp-controller/lib/adapter.mjs, .config/agents/harnesses/omp/acp-controller/lib/window.mjs, .config/agents/harnesses/omp/acp-controller/lib/capture.mjs, .config/agents/harnesses/omp/acp-controller/lib/export.mjs, .config/agents/harnesses/omp/acp-controller/lib/io.mjs, .config/agents/harnesses/omp/acp-controller/lib/env.mjs, .config/agents/harnesses/omp/acp-controller/lib/versions.mjs, .config/agents/harnesses/omp/acp-controller/lib/preflight.mjs, .config/agents/harnesses/omp/acp-controller/lib/models.mjs, .config/agents/harnesses/omp/acp-controller/lib/prompts.mjs, .config/agents/harnesses/omp/acp-controller/lib/spend.mjs, .config/agents/harnesses/omp/acp-controller/test/fixtures/scripted-acp-agent.mjs, .config/agents/harnesses/omp/acp-controller/test/preflight.test.mjs
  - Acceptance: AC-A9-1, AC-A9-2, AC-A10-5, AC-A11-2, AC-A11-4, AC-A12-1, AC-A12-2, AC-A12-3
  - Receiver: Main
- [x] T3. Build the semantic controller and its offline Reconcile and Retrace suites
  completed 2026-09-27-0244
  - Owner: ProdSemanticController
  - Depends on: T2
  - Targets: .config/agents/harnesses/omp/acp-controller/controller.mjs, .config/agents/harnesses/omp/acp-controller/lib/schema.mjs, .config/agents/harnesses/omp/acp-controller/lib/ports.mjs, .config/agents/harnesses/omp/acp-controller/test/reconcile.test.mjs, .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs
  - Acceptance: AC-A3-1, AC-A3-2, AC-A5-D, AC-A11-1, AC-A11-3
  - Receiver: Main
- [x] T4. Rewrite both skills and the reviewer protocol to call the controller and own its prompts
  completed 2026-09-27-0304
  - Owner: ProdSkillsPrompts
  - Depends on: T3
  - Targets: .config/agents/skills/reconcile/SKILL.md, .config/agents/skills/reconcile/references/reviewer-protocol.md, .config/agents/skills/retrace/SKILL.md, .config/agents/skills/reconcile/references/execution-flow.md
  - Acceptance: AC-A5-KB1, AC-A10-4, AC-A13-12
  - Receiver: Main
- [x] T5. Re-derive the Reconcile evals from the rewritten skill and rename the repair eval
  completed 2026-09-27-0312
  - Owner: ProdReconcileEvals
  - Depends on: T4
  - Targets: .config/agents/skills/reconcile/evals/evals.json
  - Acceptance: AC-A13-10, AC-A13-11
  - Receiver: Main
- [x] T6. Re-derive the Retrace evals from the rewritten skill
  completed 2026-09-27-0318
  - Owner: ProdRetraceEvals
  - Depends on: T5
  - Targets: .config/agents/skills/retrace/evals/evals.json
  - Acceptance: AC-A13-9
  - Receiver: Main
- [x] T7. Rewrite ADR and carve-out references, remove the plugin, reviewer agents and plugin dependency
  completed 2026-09-27-1200
  - Owner: ProdReferences
  - Depends on: T4, T6
  - Targets: docs/adr/0010-replacement-lifecycle-plugin.md, docs/adr/INDEX.md, docs/adr/0004-canonical-discovery-and-continual-learning.md, docs/adr/0002-executor-plans-and-orchestration.md, .config/agents/skills/dev-implementation/SKILL.md, .config/agents/skills/dev-implementation/references/plan-orchestration.md, .config/agents/skills/dev-ask/SKILL.md, .config/agents/skills/dev-ask/WORKFLOW.md, .config/agents/skills/dev-ask/references/execution-flow.md, .config/agents/skills/dev-ask/evals/evals.json, .config/agents/references/agent-return/return.md, .config/agents/harnesses/omp/agent-return.md, .config/agents/harnesses/omp/extensions/lifecycle-plugin.js, .config/agents/harnesses/omp/extensions/lifecycle-supervisor.js, .config/agents/harnesses/omp/extensions/lifecycle-consumers.js, .config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js, .config/agents/harnesses/omp/extensions/lifecycle-read-verbatim.yml, .config/agents/harnesses/omp/extensions/fixtures/lifecycle-rpc-worker.js, .config/agents/harnesses/omp/extensions/package.json, .config/agents/harnesses/omp/extensions/bun.lock, .config/agents/harnesses/omp/agents/second-opinion-a.md, .config/agents/harnesses/omp/agents/second-opinion-b.md, .config/scripts/bootstrap, ~/.omp/agent/agents/second-opinion-a.md, ~/.omp/agent/agents/second-opinion-b.md, .config/agents/harnesses/omp/config.yml
  - Acceptance: AC-A4-1, AC-A4-2, AC-A5-A, AC-A5-B, AC-A5-C, AC-A5-E, AC-A10-1, AC-A10-2, AC-A10-3, AC-A13-1, AC-A13-2, AC-A13-3, AC-A13-4, AC-A13-5, AC-A13-6, AC-A13-7, AC-A13-8
  - Receiver: Main
- [x] T8. Run dev-test-audit over the decision-6 scope after its own Route Overview approval
  completed 2026-09-27-1201
  - Owner: ProdTestAudit
  - Depends on: T3, T6
  - Targets: read-only dev-test-audit Handoff over the A6 ordered file list
  - Acceptance: AC-A6-1
  - Receiver: Main
- [x] T9. Apply the accepted test-audit fix batch
  completed 2026-09-27-1206
  - Owner: ProdAuditFixBatch
  - Depends on: T8
  - Targets: accepted test-audit fix batch over the A6 ordered file list and its named test-only seams
  - Acceptance: AC-A6-2, AC-A6-3, AC-A6-4
  - Receiver: Main
- [x] T10. Run the three live runs from a fresh OMP session through the skills
  completed 2026-09-27-1254
  - Owner: ProdLiveRuns
  - Depends on: T7, T9
  - Targets: live-run inputs and Artifact temp copy under /tmp/acp-live-*, fresh OMP root sessions under /Users/kim/.omp/agent/sessions/omp-live-proof-*, live-run evidence Handoff
  - Acceptance: AC-A7-1, AC-A7-2, AC-A7-3, AC-A7-4, AC-A7-5, AC-A7-6, AC-A7-7, AC-A7-8, AC-A8-1
  - Receiver: Main

## Acceptance

- [x] AC-A1-1. Checkpoint commit content (A1)
  Behavior: The checkpoint commit has the approved subject and contains only paths under `.config/agents/`, `docs/adr/` and `.agents/papercuts.json`.
  Check: `git show --name-only --format=%s HEAD` immediately after the checkpoint commit; expect line 1 `chore(agents): checkpoint lifecycle-plugin state before acp cutover` and every following non-empty line starting with `.config/agents/`, `docs/adr/`, or equal to `.agents/papercuts.json`.
- [x] AC-A1-2. Checkpoint leaves no dirty target path (A1)
  Behavior: After the checkpoint no modified or untracked path remains under the three checkpoint targets.
  Check: `git status --short -- .config/agents docs/adr .agents/papercuts.json`; expect no output.
- [x] AC-A1-3. Staged path list shown before committing (A1)
  Behavior: The user saw the exact staged path list before the checkpoint commit.
  Check: Direct static proof: the approval record; expect it shows the exact staged path list before the commit.
- [x] AC-A2-1. Lean-plan close commit content (A2)
  Behavior: The close commit adds exactly the lean spec and the lean plan.
  Check: `git show --name-only --format= HEAD` after the close commit; expect exactly `.agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md` and `.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md`.
- [x] AC-A2-2. Lean spec committed unchanged (A2)
  Behavior: The committed lean spec keeps its approved bytes.
  Check: `shasum -a 256 .agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md`; expect `376fd634f0c6c772252fe6929547a2d1bc0a5ba161477935a9cdaa7e1635fe51`.
- [x] AC-A2-3. Lean plan valid and CLOSED (A2)
  Behavior: The committed lean plan is a valid CLOSED plan.
  Check: `python3 .config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md`; expect output containing `"status": "valid"` and `"lifecycle_status": "CLOSED"`.
- [x] AC-A2-4. Only the lean plan Status line changed (A2)
  Behavior: Replacing the single CLOSED status with PENDING restores the lean plan's baseline bytes.
  Check: `git show HEAD:.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md | python3 -c "import sys,hashlib;t=sys.stdin.buffer.read();assert t.count(b'**Status**: CLOSED')==1;print(hashlib.sha256(t.replace(b'**Status**: CLOSED',b'**Status**: PENDING')).hexdigest())"`; expect `b4a1008606bad986b02202217366290842f512693809c6d7ad040ba19113b4de`.
- [x] AC-A2-5. No push (A2)
  Behavior: Neither commit is pushed.
  Check: Direct static proof: the task record; expect no `git push` in the task record.
- [x] AC-A3-1. Offline suite passes with every named contract test (A3)
  Behavior: The permanent offline suite runs through public acpx against the scripted ACP agent and passes, covering C4, KR5, KR6, KR8, KR9, KR10, KR11, KR14, KS4, KT3, KT4, KS5, preflight, KR13 and A9.
  Check: `cd $C && npm ci && node --test --test-reporter=spec "test/*.test.mjs"` (`npm ci` needs the npm registry once; the tests themselves are offline); expect exit 0, `ℹ fail 0`, and test names beginning with each of `C4`, `KR5`, `KR6`, `KR8`, `KR9`, `KR10`, `KR11`, `KR14`, `KS4`, `KT3`, `KT4`, `KS5`, `preflight` (13), plus `KR13`, `A9`.
- [x] AC-A3-2. Offline suite launches no native OMP (A3)
  Behavior: No permanent test references a native `omp acp` launch.
  Check: `grep -rn "omp acp\|/Users/kim/.local/bin/omp" $C/test`; expect it prints nothing (no native launch).
- [x] AC-A4-1. Every guard maps to a live location (A4)
  Behavior: Each of the 29 guards has at least one live skill line or controller location carrying its anchor.
  Check: for each row of spec-v3 §6, `grep -F -- "<Anchor>" <Location>` (with `$C/` prefixed for controller paths, `.config/agents/` for `skills/` paths, and `docs/` paths used as written); expect ≥1 match for all 29 rows, 0 misses.
- [x] AC-A4-2. Guard table is exactly the 29 kept guards (A4)
  Behavior: The allocation covers KR1–KR16, KT1–KT5, KB1, KS1–KS7 and no KS8.
  Check: Direct static proof: spec-v3 §6; expect exactly 29 rows, IDs KR1–KR16, KT1–KT5, KB1, KS1–KS7, and no KS8 row.
- [x] AC-A5-A. No live lifecycle-plugin protocol text (A5a)
  Behavior: No live `lifecycle_channel`, `lifecycle-plugin`, lifecycle-consumer, `tool.lifecycle`, `xd://lifecycle`, `Ready: reviewer` or `Synchronized` text remains under `.config/agents` or `docs/adr` outside the H-S2 exemptions.
  Check: run the spec-v3 §8 A5(a) scan (its fenced `python` block, verbatim) with `python3 - <<'EOF'` … `EOF` from the repository root; expect last line `violations: 0` and exit 0.
- [x] AC-A5-B. Map and reviewer agent files absent (A5b)
  Behavior: The Reconcile execution-flow map and both reviewer agent files no longer exist.
  Check: `for f in .config/agents/skills/reconcile/references/execution-flow.md .config/agents/harnesses/omp/agents/second-opinion-a.md .config/agents/harnesses/omp/agents/second-opinion-b.md; do test -e "$f" && echo "$f"; done`; expect no output.
- [x] AC-A5-C. Live config loads no lifecycle plugin (A5c)
  Behavior: The OMP config no longer names any lifecycle file.
  Check: `grep -n lifecycle .config/agents/harnesses/omp/config.yml`; expect no output (exit 1).
- [x] AC-A5-D. Controller files parse (A5d)
  Behavior: Every controller module is syntactically valid Node.
  Check: `find $C -name '*.mjs' -not -path '*/node_modules/*' -exec node --check {} \; -print`; expect every controller file printed and no error output, exit 0.
- [x] AC-A5-E. Remaining extension tests pass (A5e)
  Behavior: Only `plan-artifact-sync.test.js` remains under the extensions and it passes (H-S3).
  Check: `cd .config/agents/harnesses/omp/extensions && find . -name '*.test.js' -not -path './node_modules/*' && bun test`; expect `./plan-artifact-sync.test.js` as the only file listed and `0 fail` (H-S3).
- [x] AC-A5-KB1. Decision-1 reply sentence in both skills (A5 KB1)
  Behavior: Each skill states that only the admitted domain-valid native `yield` candidate counts and nothing else is a fallback.
  Check: `grep -c "never count and are never a fallback" .config/agents/skills/reconcile/SKILL.md .config/agents/skills/retrace/SKILL.md`; expect `1` for each file.
- [x] AC-A6-1. Test audit Handoff (A6)
  Behavior: One completed `dev-test-audit` over the human-approved decision-6 file list ends with an accepted proposal or a named stop.
  Check: Direct static proof: the `dev-test-audit` Handoff; expect it records the human-approved ordered file list (`$C/test/preflight.test.mjs`, `$C/test/reconcile.test.mjs`, `$C/test/retrace.test.mjs`, `$C/test/fixtures/scripted-acp-agent.mjs`, `.config/agents/skills/reconcile/evals/evals.json`, `.config/agents/skills/retrace/evals/evals.json`) and either the accepted proposal or a named stop.
- [x] AC-A6-2. Fix batch and original-A closure recorded (A6)
  Behavior: The fix-batch task records what it applied, or that nothing was accepted, and original A's closure result.
  Check: Direct static proof: the fix-batch Handoff; expect it records the applied batch or `no accepted findings`, and original A's closure result verbatim (including `NOT CLOSED` or `original-A closure unavailable`).
- [x] AC-A6-3. Offline suite passes after the batch (A6)
  Behavior: The offline suite still passes after the fix batch.
  Check: A3 command after the batch; expect exit 0, `ℹ fail 0`.
- [x] AC-A6-4. Never a second fix batch (A6)
  Behavior: The plan has exactly one fix-batch task.
  Check: Direct static proof: this plan; expect no second fix-batch task exists in the plan.
- [x] AC-A7-1. Protected sources unchanged across each live run (A7)
  Behavior: Every source a live run treats as read-only evidence, the frozen trial bundle and live `config.yml` keep their bytes; the Artifact temp copy is the only allowed write (H-S4).
  Check: before each run record `shasum -a 256` of the Reconcile/Retrace skill files, `reviewer-protocol.md`, `skills/rethink/SKILL.md`, both evals files, `harnesses/omp/config.yml`, every evidence/context locator the run reads, and the trial-bundle aggregate command of spec-v3 §1.1, then after each run the same commands; expect identical digests (trial aggregate `5c2563410027f0fe961cf679e8d8451ae5f506dc6245153fffdaff19c4cd2b99`); in Artifact mode the temp copy is the only changed file.
- [x] AC-A7-2. Every live-run actor process exited (A7)
  Behavior: No `omp acp` process printed in any run record survives the run.
  Check: `ps -o pid= -p <each PID printed in the run record>`; expect no output.
- [x] AC-A7-3. Live-run session folders and private roots removed (A7)
  Behavior: Each run removes its controller session folder and private root.
  Check: `ls -d /Users/kim/.omp/agent/sessions/acp-controller-* /tmp/acp-controller-* 2>/dev/null`; expect no output.
- [x] AC-A7-4. Spend reported for each run (A7)
  Behavior: Each run's record reports spend with a total.
  Check: the stdout record of each run; expect it contains `## Spend` with a Total row.
- [x] AC-A7-5. Conversation run reaches a first VALID (A7)
  Behavior: The Conversation-mode live run ends with a final proposal after a first admitted VALID.
  Check: the Conversation run's exit code and stdout record; expect exit 0; `## Review rounds` shows a first admitted VALID; `## Final proposal` with **Proposal**.
- [x] AC-A7-6. Artifact run applies once and rereads (A7)
  Behavior: The Artifact-mode live run on a harmless temp copy under `/tmp` makes one committed application and reports the KR11 reread identity.
  Check: the Artifact run's exit code, stdout record and `shasum -a 256` of the temp copy taken after the run; expect exit 0; one committed application (Review rounds shows one `applied` outcome); **Current identity** equals `shasum -a 256` of the temp copy taken after the run (KR11 reread).
- [x] AC-A7-7. Retrace run with dependency and delegated Reconcile (A7)
  Behavior: The Retrace live run evaluates at least two scopes with one `requires` link and one delegated Reconcile and renders the aggregate.
  Check: the Retrace run's exit code and stdout record; expect ≥2 scopes, one `requires` link, one delegated Reconcile, exit 0 or 1, all four aggregate H2 sections present in order.
- [x] AC-A7-8. Runs start from a new real OMP session through the skills (A7)
  Behavior: Each run starts from a new real OMP session started after the plugin-line removal, through the skill, not a trial runner.
  Check: Direct static proof: the live-run record; expect each run starts from a new real OMP session (started after task 2c so `config.yml` no longer loads the plugin) through the skill, not a trial runner.
- [x] AC-A8-1. Live runs follow approval, audit and fix batch (A8)
  Behavior: Live runs happen only after the second approval, the audit and the fix batch.
  Check: Direct static proof: this plan and the Handoffs; expect the plan's live-run task depends on the audit and fix-batch tasks; the live-run Handoff timestamps are later than the second approval, the audit Handoff and the fix-batch Handoff.
- [x] AC-A9-1. Version-pin refusal test passes (A9)
  Behavior: A wrong `omp` or acpx version refuses before any launch.
  Check: `cd $C && npm ci && node --test --test-reporter=spec "test/*.test.mjs"`; expect the A3 `A9` test passes.
- [x] AC-A9-2. Version pins and refusal order in code (A9)
  Behavior: The controller pins `omp/18.3.0` and acpx `0.19.2` and checks them before reading model roles or creating a runtime.
  Check: Direct static proof: `$C/lib/versions.mjs` and `$C/cli.mjs`; expect `$C/lib/versions.mjs` holds `OMP_VERSION = "omp/18.3.0"` and `ACPX_VERSION = "0.19.2"`, and `cli.mjs` calls `checkVersions` before `readModelRoles` and before creating any runtime.
- [x] AC-A10-1. Plugin extension files removed (A10)
  Behavior: Every lifecycle-plugin extension file and its fixture are gone.
  Check: `for f in lifecycle-plugin.js lifecycle-supervisor.js lifecycle-consumers.js lifecycle-plugin.test.js lifecycle-read-verbatim.yml fixtures/lifecycle-rpc-worker.js; do test -e .config/agents/harnesses/omp/extensions/$f && echo $f; done`; expect no output.
- [x] AC-A10-2. Bootstrap no longer links reviewer agents (A10)
  Behavior: Bootstrap has no second-opinion lines.
  Check: `grep -c second-opinion .config/scripts/bootstrap`; expect `0`.
- [x] AC-A10-3. User-level reviewer agent links removed (A10)
  Behavior: No second-opinion agent file remains in the live OMP agents directory.
  Check: `ls ~/.omp/agent/agents/ | grep -c second-opinion`; expect `0`.
- [x] AC-A10-4. One editable copy of each prompt (A10)
  Behavior: Prompt markers exist only in the reviewer protocol and the Retrace skill.
  Check: `grep -rln -e 'prompt:initial' -e 'prompt:evaluate' .config/agents --exclude-dir=node_modules`; expect exactly `.config/agents/skills/reconcile/references/reviewer-protocol.md` and `.config/agents/skills/retrace/SKILL.md`.
- [x] AC-A10-5. No prompts directory in the controller (A10)
  Behavior: The controller holds no prompt copies.
  Check: `find $C -type d -path '*prompts*' -not -path '*/node_modules/*'`; expect no output.
- [x] AC-A11-1. No trial identifiers in the controller (A11)
  Behavior: The controller never references the trial bundle, agent ID or session prefix.
  Check: `grep -rn "acpx-omp-acp-trial\|omp-trial\|acpx-trial-" $C --exclude-dir=node_modules`; expect no output.
- [x] AC-A11-2. Trial bundle unchanged (A11)
  Behavior: The frozen trial bundle keeps its aggregate identity.
  Check: the spec-v3 §1.1 aggregate command; expect `5c2563410027f0fe961cf679e8d8451ae5f506dc6245153fffdaff19c4cd2b99`.
- [x] AC-A11-3. No excluded trial files copied (A11)
  Behavior: None of the trial-only runners, pins, debug loop or mechanics fixtures exist in the controller.
  Check: `find $C -not -path '*/node_modules/*' \( -name pins.mjs -o -name run.mjs -o -name t3.mjs -o -name debugloop.mjs -o -name approval-drift.json -o -path '*/fixtures/mechanics*' \)`; expect no output.
- [x] AC-A11-4. Production agent ID (A11)
  Behavior: The adapter identifies itself as the production controller.
  Check: `grep -n 'AGENT_ID = ' $C/lib/adapter.mjs`; expect `AGENT_ID = "omp-acp-controller"`.
- [x] AC-A12-1. Exact acpx and SDK versions installed (A12)
  Behavior: The controller package resolves acpx 0.19.2 and the ACP SDK 1.4.0.
  Check: `cd $C && npm ls acpx @agentclientprotocol/sdk --json`; expect `acpx` `0.19.2` and `@agentclientprotocol/sdk` `1.4.0`.
- [x] AC-A12-2. Node engine and module type (A12)
  Behavior: The package declares Node ≥22.13 and ES modules.
  Check: `node -e 'const p=require("./package.json");console.log(p.engines.node,p.type)'` in `$C`; expect `>=22.13.0 module`.
- [x] AC-A12-3. Lockfile tracked (A12)
  Behavior: The controller lockfile is tracked by Git.
  Check: `git ls-files $C/package-lock.json`; expect the path (committed at delivery).
- [x] AC-A13-1. ADR-0010 retitled (A13)
  Behavior: ADR-0010 describes the acpx controller.
  Check: `head -1 docs/adr/0010-replacement-lifecycle-plugin.md`; expect `# ADR-0010 — acpx controller for Retrace and Reconcile`.
- [x] AC-A13-2. D31 clause 9 verbatim (A13)
  Behavior: ADR-0010 keeps clause 9 word for word.
  Check: `grep -cF "The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged. Their exact implementation-child exemptions do not replace or weaken these named custom-controller lifecycle contracts." docs/adr/0010-replacement-lifecycle-plugin.md`; expect `1`.
- [x] AC-A13-3. Proof export dropped from ADR-0010 (A13)
  Behavior: ADR-0010 no longer describes proof export outside history sections.
  Check: `grep -c "proof export" docs/adr/0010-replacement-lifecycle-plugin.md`; expect `0` outside the exempt sections (A5 scan covers plugin text).
- [x] AC-A13-4. ADR index rows updated (A13)
  Behavior: The ADR index lists ADR-0010 as the acpx controller and points D31 at the controller.
  Check: `sed -n 18p docs/adr/INDEX.md` and `sed -n 26p docs/adr/INDEX.md`; expect line 18 contains `acpx controller` and line 26 contains `acp-controller`.
- [x] AC-A13-5. ADR-0004 map sentences removed (A13)
  Behavior: ADR-0004 no longer protects the deleted Reconcile map.
  Check: `grep -c "Reconcile's current map remains untouched\|Existing Reconcile files remain separate and unchanged" docs/adr/0004-canonical-discovery-and-continual-learning.md`; expect `0`.
- [x] AC-A13-6. ADR-0004 otherwise unchanged (A13)
  Behavior: Only those two removals change ADR-0004.
  Check: `git diff $CKPT -- docs/adr/0004-canonical-discovery-and-continual-learning.md`; expect it shows only those two removals (L62 untouched).
- [x] AC-A13-7. Agent-return decoder test untouched (A13)
  Behavior: `test_decode.py` keeps its checkpoint bytes.
  Check: `git diff --quiet $CKPT -- .config/agents/references/agent-return/test_decode.py`; expect exit 0.
- [x] AC-A13-8. Carve-out edits confined to listed lines (A13)
  Behavior: Each spec-v3 §5 Q8 carve-out file changes only at its listed sites.
  Check: `git diff -U0 $CKPT -- <each §5 Q8 carve-out file>`; expect hunks only at the listed lines.
- [x] AC-A13-9. Eval counts preserved (A13)
  Behavior: The Reconcile and Retrace eval files keep 12 and 21 entries.
  Check: `python3 -c "import json;[print(len(json.load(open(f'.config/agents/skills/{s}/evals/evals.json'))['evals'])) for s in ('reconcile','retrace')]"`; expect `12` then `21`.
- [x] AC-A13-10. Old sync-repair eval ID gone (A13)
  Behavior: No Reconcile eval keeps the synchronization-repair ID.
  Check: `grep -c REC-SYNC-REPAIR-RESUME .config/agents/skills/reconcile/evals/evals.json`; expect `0`.
- [x] AC-A13-11. Renamed repair eval present once (A13)
  Behavior: The renamed repair eval exists exactly once.
  Check: `grep -c '"REC-REPAIR-RESUME"' .config/agents/skills/reconcile/evals/evals.json`; expect `1`.
- [x] AC-A13-12. KT5 Retrace sections byte-identical (A13)
  Behavior: The Retrace skill's Evidence boundary through Stops text is unchanged and the new prompts section follows it.
  Check: `python3 -c "import hashlib;t=open('.config/agents/skills/retrace/SKILL.md','rb').read();i=t.index(b'\n## Evidence boundary\n')+1;j=t.index(b'\n## Scope evaluator prompts\n');print(hashlib.sha256(t[i:j]).hexdigest())"`; expect `dfc6e82139bcc499703da8e4c73a861afb364d3b7e1550a3f559478ab881c037` (baseline hash of the text from `## Evidence boundary` to end of file, which the new prompts section must follow).

## Recovery and stops

- Recovery: Completed tasks, commits and Handoffs are preserved; a failed task resumes with its same owner within the standard `dev-implementation` semantic attempt limit, and eligible machinery failures follow `skill://dev-implementation/references/execution-recovery.md` without changing authority, effects or consumed attempts. No token or USD cap ends any task or live run; spend is reported. A later-discovered defect in an earlier task's target returns to that target's owner (T9 excepted, which edits only its accepted batch). T1 time-bound checks (AC-A1-*, AC-A2-*) are observed right after their commits and re-evaluated later against `$CKPT` and the close commit, not against a moved HEAD. T8 follows the `dev-test-audit` skill's own A-first loop (one rethink to A and, if needed, to B), unshortened and read-only. T9: accepted fixes return to `dev-ask`; one Route Overview approves the exact batch and T9 is its route; "no accepted findings" completes T9 when A accepts with none; after the batch original A performs its one closure check, recorded verbatim; `NOT CLOSED` or `original-A closure unavailable` is a residual risk, not a DONE blocker. T10: a failed run expectation (for example no REVISE in R2) may be rerun with the same recorded inputs as a new attempt of the same owner within the attempt limit; each rerun repeats every A7 before/after check. A parked KR13 run is disposed with `dispose <runId>` before any rerun. If the non-interactive root session cannot proceed (a tool-approval prompt blocks, `--continue` does not resume the run's session, or the skill needs an interactive surface), T10 stops and Main asks the human to perform the run in a freshly started interactive `omp` from a terminal with the same recorded inputs while T10's owner performs every before/after check.
- Stops: No execution before the second approval. T1 stops and reports without committing if `dot-add` rejects a path, the index was not empty before staging, or the staged list differs from the list shown at the second approval. No T2+ edit before both T1 commits exist. T8 starts only after Main presents its Route Overview with the exact ordered A6 file list and the human approves; T9's batch starts only after its own Route Overview approval; an accepted proposal naming a file outside the decision-6 scope stops and asks, never widens the batch; there is never a second batch. A version-pin mismatch (`omp/18.3.0`, acpx `0.19.2`) stops T10 (a new version first needs the offline suite and live runs to pass on it). An undisposed prior `acp-controller-*` run or process stops until it is disposed. A KR13 same-session resume that cannot keep the reviewer identities stops and asks; no fresh reviewer is created. Live-run approval relay: T10 answers the root session's KR1 brief or KT2 table approval question with `approve` only when every drafted field matches the recorded R1–R3 inputs in Scope; any divergence, extra decision or question stops and asks Main. A protected-source digest change, surviving PID, EPERM or leftover session folder fails A7 and stops further runs until resolved. Any need to change spec-v3 behavior, acceptance, ownership, dependencies or effects stops and returns to Main for a revised authority.

## Completion Summary

- Outcome: live Reconcile and Retrace now run on acpx 0.19.2 and native `omp acp` 18.3.0 through the coded controller `.config/agents/harnesses/omp/acp-controller/`, which replaces the lifecycle plugin. All 29 guards are kept (KR1–KR16, KT1–KT5, KB1, KS1–KS7); KS8 is not adopted. Authority: spec-v3 (`2c1628c7…e958`, amended from spec-v2 `0766ee3b…bcbda` by user-approved errata).
- Commits: T1 checkpoint `818de3c` and lean close `5986700`. Everything from T2–T7 is uncommitted in the working tree; `$C/package-lock.json` is staged index-only. Nothing pushed.
- Tasks: T2 native layer and offline suite; T3 semantic controller (plus the post-live `aggregateSummary` fix and the CR-1 repair); T4 skills and reviewer protocol; T5/T6 evals (12 and 21 entries); T7 ADR-0010/INDEX/ADR-0004/ADR-0002, carve-outs, and removal of the plugin, the `second-opinion-a/b` agents and their user-level symlinks; T8 test audit A-only, all 6 files `keep`; T9 no accepted findings.
- Live runs (T10): R1 Conversation `omp-live-proof-r1-a3` exit 0, Final proposal after A's first admitted VALID; R2 Artifact `omp-live-proof-r2-a2` exit 0, one applied change, Current identity equals the temp copy's shasum; R3 Retrace `omp-live-proof-r3` exit 0, two scopes with one `requires` link. Two briefs were abandoned for Goal drift before any controller ran. Controller spend 1,837,407 tokens / 4.032340 USD.
- Assurance: one standard review, REPAIR REQUIRED with CR-1 (a delegated reviewer disposal failure did not stop the scope); T3 attempt 2 fixed it with a new KS6 test (fail-before/pass-after; suite 28/28). The first verification was NOT VERIFIED only on a CR-1 check clause that contradicted retrace/SKILL.md L422; the user amended that expected result, and the same verifier returned VERIFIED (55/55 ACs plus CR-1). Learning: no durable learning.
- Residual risks: the live runs predate the aggregate-summary and CR-1 fixes; AC-A7-2 had no PIDs to check (the ps scan was clean); the KS6 output lists S1's cleanup lines twice; KR13 is proven offline only; restored-context integrity is unproven; cancelled test runs can orphan acpx queue owners; ADR-0010 and header comments still cite spec-v2.
