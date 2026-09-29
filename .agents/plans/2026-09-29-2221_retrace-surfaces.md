# Retrace surfaces in the Reconcile concept

**Datetime**: 2026-09-29-2221
**Scope**: Retrace approval surface and post-execution record in the Reconcile layout (spec retrace-surfaces/spec-v2)
**Summary**: Give Retrace's pre-execution approval surface labelled Reconcile-brief context lines and its post-execution record fixed per-finding bullets, a one-line event trail and trailing verbatim reviewed reports, with the evaluator's item-5 summary rule as the only rendered-prompt change.
**Status**: DONE
**Completed At**: 2026-09-29-2258

## Outcome and authority

- Outcome: `driver.md` `## Retrace` gains the `### Approval surface` layout (A1) and `retrace/SKILL.md` gains its pointer (A2); the Retrace record renders labelled Aggregate summaries as `**Finding N**` Identity/Finding/Direction/Validation bullets with a byte-exact baseline prose fallback, per-scope events as one ` → ` line, unchanged manifest lines, and the reviewed reports verbatim under a trailing `### Reviewed reports` (R1–R8); `## Result` item 5 (C1), `## Freshness and aggregate` items 3–4 (C2, C3) and the driver stdout sentence (C4) describe the new shape; rendered prompts differ from baseline only by C1; `## Reconcile` in the driver and every guarded path stay unchanged; every suite stays green.
- Authority: Technical specification `.agents/artifacts/2026-09-29_retrace-surfaces-spec.md` revision `retrace-surfaces/spec-v2` (SHA-256 `19d41aca1f7cb93c882e0e3da69bf1ece00c1ab0d5194bc51502debb6f46dd43`), baseline `31cb615`, derived from the Reconcile-reviewed proposal (VALID `sha256:2778ee73262af52409f8021ee87b191707d9012bf420ddaef54aecca67d3b709`) and the human settlement of D1–D6 with D5 amended ("approve - drop the r1-3 runs requirements. this is not needed."), under the approved dev-ask route. The spec owns the exact texts A1, A2, C1–C4 (§4.1, §4.3), the record shape R1–R8 and worked example W1 (§4.4), invariants I1–I9 (§4.5), effects and rollback (§5), acceptance and the check scripts S1–S5 with their SHA-256 values (§6, §6.1), permanent tests (§7), and task and shared-file ownership (§8). `Sn` in a Check means: extract spec §6.1 block `Sn` under the §6 extraction rule to `/tmp/rs/Sn.py`, confirm its SHA-256 against §6.1, and run `python3 /tmp/rs/Sn.py` from the repository root.
- Assurance: standard

## Scope and effects

- Scope: Exactly the spec §5 four-path allowlist, changed as spec §4 and §7 direct. T1 inserts A1 into `.config/agents/harnesses/omp/acp-controller/driver.md` (after the `## Retrace` heading's blank line, before `### Invoke the controller`) and A2 into `.config/agents/skills/retrace/SKILL.md` (before the baseline L45 "After approval, invoke the controller…" line). T2 edits only `.config/agents/harnesses/omp/acp-controller/controller.mjs` inside the renderer region (from the `aggregateSummary` doc comment to the normalizer divider, exclusive) and `.config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs`. T3 applies C1–C3 to `.config/agents/skills/retrace/SKILL.md` and C4 to the `### Invoke the controller` stdout lines of `driver.md`. T1 and T2 run in parallel (disjoint files); T3 starts after both Handoffs because it shares `driver.md` `## Retrace` and `retrace/SKILL.md` with T1 and the record shape with T2. Driver bytes before `\n## Retrace\n\n` belong to no task; ownership of the two shared files is by the spec §8 byte ranges, not by path.
- Effects: Repository working-tree edits to the four Scope paths only; throwaway check scripts and scratch output under `/tmp/rs/` and other `/tmp` scratch (nothing throwaway is committed); running the listed checks and suites. No new repository file, no destructive deletion, no git staging, commit, checkout or other git state change, no push, no omp-update live run (D5 as amended), no home-directory or `node_modules` change. A commit needs a separate explicit shipping request.
- Non-goals: Reconcile presentation and record; `driver.md` `## Reconcile`; `.config/agents/skills/reconcile/` including `references/reviewer-protocol.md`; `retrace/evals/` content; `.config/agents/skills/rethink/`; `.config/agents/skills/omp-update/` including the `controller-exit` probe line; `.config/agents/references/packed-label.md`; `.config/agents/harnesses/omp/agent-return.md`; every other `acp-controller` file; step 4 of `## Normalize and approve` and every other pulled section except `## Result` item 5; shrinking the reviewed reports; B2; any permanent test beyond spec §7; ADRs.

## Tasks

- [x] T1. Add the Retrace approval-surface layout to the driver and its pointer to the skill
  completed 2026-09-29-2247
  - Owner: retrace-surfaces-t1-child
  - Depends on: none
  - Targets: .config/agents/harnesses/omp/acp-controller/driver.md (## Retrace A1 insertion only), .config/agents/skills/retrace/SKILL.md (## Invocation contract A2 paragraph only)
  - Acceptance: AC-2
  - Receiver: route-agent dev-implementation controller

- [x] T2. Render the Retrace record with fixed finding bullets, an arrow event line and trailing reviewed reports, with rewritten tests
  completed 2026-09-29-2247
  - Owner: retrace-surfaces-t2-child
  - Depends on: none
  - Targets: .config/agents/harnesses/omp/acp-controller/controller.mjs (Retrace record renderer region only), .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs
  - Acceptance: AC-5, AC-6, AC-9
  - Receiver: route-agent dev-implementation controller

- [x] T3. Apply the item-5 summary rule, the record prose and the driver stdout sentence, and own the whole-tree guards
  completed 2026-09-29-2256
  - Owner: retrace-surfaces-t3-child
  - Depends on: T1, T2
  - Targets: .config/agents/skills/retrace/SKILL.md (## Result item 5 and ## Freshness and aggregate items 3–4 only), .config/agents/harnesses/omp/acp-controller/driver.md (### Invoke the controller stdout lines C4 only)
  - Acceptance: AC-1, AC-3, AC-4, AC-7, AC-8, AC-10, AC-11, AC-12, AC-13, AC-14
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. Only the item-5 prompt rule differs
  Behavior: The real loader renders every reviewer and scope template from the working tree equal to the baseline templates, except `scope.evaluate`, which equals the baseline with the C1 old text replaced by the C1 new text.
  Check: `S1 item5`; expect `ok`.

- [x] AC-2. Part A texts applied exactly
  Behavior: `driver.md` and `retrace/SKILL.md` equal the baseline with exactly A1 and A2 applied (C1–C4 may also be present); `driver.md` `## Reconcile` is byte-identical.
  Check: `S2 t1`; expect `ok`.

- [x] AC-3. All pinned texts applied exactly
  Behavior: `driver.md` and `retrace/SKILL.md` equal the baseline with exactly A1, A2 and C1–C4 applied; nothing else is added, lost, reordered or reworded; `## Reconcile` is byte-identical.
  Check: `S2 all`; expect `ok`.

- [x] AC-4. Only this change's paths differ
  Behavior: Only this change's four paths differ from the baseline (union allowlist), nothing is deleted and nothing untracked is added.
  Check: `S3`; expect `ok`.

- [x] AC-5. Controller changed only in the renderer region
  Behavior: `controller.mjs` differs from the baseline only inside the renderer region (from the `aggregateSummary` doc comment to the normalizer divider).
  Check: `S4`; expect `ok`.

- [x] AC-6. Offline R3-like render equals W1
  Behavior: An offline render of the R3-like request through the real controller, prompts and scripted agent equals W1 byte for byte: labelled findings, `no-change`/`blocker` cases, prose fallback, arrow events, unchanged manifest, trailing reviewed reports.
  Check: `S5`; expect `ok` (a unified diff otherwise).

- [x] AC-7. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-8. Guarded paths unchanged
  Behavior: All of `skills/reconcile/`, `retrace/evals/`, `rethink/`, `omp-update/`, `packed-label.md`, `agent-return.md` and every `acp-controller` file other than `controller.mjs`, `test/retrace.test.mjs` and `driver.md` are unchanged against the baseline and in the working tree.
  Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace/evals .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; X1=':(exclude).config/agents/harnesses/omp/acp-controller/controller.mjs'; X2=':(exclude).config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs'; X3=':(exclude).config/agents/harnesses/omp/acp-controller/driver.md'; git status --porcelain -- $P "$X1" "$X2" "$X3"; git diff --name-only 31cb615 -- $P "$X1" "$X2" "$X3"`; expect empty output.

- [x] AC-9. acp-controller suites pass
  Behavior: The acp-controller suites pass, including the rewritten Retrace renderer tests and KT5 (§7).
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, foreground, timeout ≥ 300 s; expect `pass 52` (the baseline 51 plus KT5), `fail 0`, exit 0.

- [x] AC-10. Prompt files load offline
  Behavior: The real protocol and Retrace skill still load through the CLI offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-11. Plan validator suite passes
  Behavior: The plan validator suite passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` (14 tests), exit 0.

- [x] AC-12. Plan-sync suite passes
  Behavior: The plan-sync extension suite passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `20 pass`, `0 fail`, exit 0.

- [x] AC-13. Papercut ledger suite passes
  Behavior: The papercut ledger suite passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` (19 tests), exit 0.

- [x] AC-14. Retrace evals not contradicted
  Behavior: `retrace/evals` pass as far as they can offline: content unchanged (AC-8) and no assertion contradicted by A1, A2, C1–C4 or R1–R8.
  Check: review each `evals.json` assertion naming the approval table, `Findings and Directions`, `Evidence and Limits`, reviewed reports, four-part identity or H3 displays against the final texts and W1; expect no contradiction beyond the §9 items, recorded in T3's Handoff. [INFERENCE: no mechanical runner exists (§2.6).]

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff. An incomplete T1 or T2 resumes alone within this plan's authority without touching the other's Targets; T3 starts only after both Handoffs report their owned ACs and the spec §8 boundary gates passing (T1: `S1 none`, S3, AC-7, AC-8, AC-10; T2: S3, AC-8, AC-10). Because T1 and T2 run in parallel, a T1 or T2 boundary gate that fails only because of the sibling's in-flight Targets (for example AC-10 while `controller.mjs` is mid-edit) is reported in the Handoff with that cause and rerun by the controller after the sibling's Handoff; it is never repaired in the sibling's Targets. A T3 failure never rewrites T1's A1/A2 bytes or T2's files; T3 repairs only its C1–C4 bytes. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`. Rollback, for the owner only: `git checkout 31cb615 -- .config/agents/harnesses/omp/acp-controller/driver.md .config/agents/skills/retrace/SKILL.md .config/agents/harnesses/omp/acp-controller/controller.mjs .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs`.
- Stops: An extracted `Sn` script's SHA-256 differs from spec §6.1; a spec §4 anchor is missing or not unique at baseline; any owned check or boundary gate fails after permitted repair; a change would touch a byte outside the task's spec §8 range, a sibling task's range, `driver.md` `## Reconcile`, a guarded path, a new repository file or git state, or need an undeclared effect; S5 differs from W1 in a way spec §4.4 does not explain (needs a spec revision); the route owner reverses D1–D6; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: `driver.md` `## Retrace` gained `### Approval surface` (A1) and the C4 stdout sentence; `retrace/SKILL.md` gained the A2 pointer and C1–C3; `controller.mjs` renders labelled Aggregate summaries as `**Finding N**` Identity/Finding/Direction/Validation bullets (byte-exact prose fallback), one ` → ` Events line and a trailing verbatim `### Reviewed reports`; `test/retrace.test.mjs` rewrote KT4, KS5, KS6 and added KT5. Diff vs `31cb615`: 259+/66− across the four allowlisted paths. Rendered prompts differ only by C1; `## Reconcile` and every guarded path unchanged.
- Tasks: T1 and T2 in parallel, then T3; all attempt 1, no correction passes. T1/T2 rethink Handoffs were lost to a controller collection-cell failure and recovered by one same-child recovery return each (corrected execution 1 of 2, send and collect in one cell).
- Authority: spec-v2 after a Reconcile review (VALID on `2778ee73…b709`) with D1–D6 settled and D5 amended (no live R1–R3 runs).
- Assurance: review APPROVED, no required findings (advisories: ADV-1 stale `KT5` doc-comment name at `controller.mjs` L1218; ADV-2 event text assumed free of ` → ` and newlines); verification VERIFIED AC-1…AC-14 (`npm test` pass 52 fail 0, bun 20 pass, validator 14 OK, ledger 19 OK); `Learning: no durable learning`.
- Residuals (spec §9): evaluator compliance with C1 and the root-session approval layout are unproven live; eval readings RETRACE-SCOPE-APPROVAL "only approval presentation" (settled by D6), RETRACE-SYNTHESIS readiness/owner gap (pre-existing), non-scope H3 `### Reviewed reports`. Rollback `git checkout 31cb615 -- .config/agents/harnesses/omp/acp-controller/driver.md .config/agents/skills/retrace/SKILL.md .config/agents/harnesses/omp/acp-controller/controller.mjs .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs`.
- Commits: none. Nothing pushed.
