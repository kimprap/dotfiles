# Handoff: Revise the v6 native-result amendments for the confirmed debugging decisions

## Outcome

- Verdict: **accept the new human decisions; apply the corrected B1–B6 below instead of the chat-only v6.** This file is `reconcile-retrace-native-result-revision/v7` and replaces v6 in full. Apply unchanged [v3](./2026-09-24_reconcile-retrace-native-result-revision-handoff-v3.md) + [v5 A1–A7](./2026-09-24_reconcile-retrace-native-result-revision-handoff-v5.md) + this v7, in that precedence order. No v6 file or further amendment layer is needed. V5's corrections accepted by the second reviewer remain accepted.
- This completes review and handoff revision, not the trial or its approval. Main's next authorized revision still targets decision evidence `acpx-omp-acp-trial-decisions/v5`, specification `acpx-omp-acp-trial/spec-v7`, and the existing pending plan. Those artifacts remain unchanged now; the handoff revision and specification revision are separate identities.
- Preserve the prior confirmed decisions, all unchanged pins/profiles, scope, isolation, native-result boundary, safe retention, original skill semantics except the expressly authorized C4 amendments, and observed disposal. No implementation, native/model run, upstream repair, credential inspection, installation, live cutover, or shipping is approved by this handoff.

### Confirmed answers and their scope

Quote these five recent entries verbatim in decision evidence v5, alongside the earlier decisions preserved by v3:

- `reconcile_no_result: Re-ask it (counts toward the 3)`
- `native_rerun_after_fix: Rerun anywhere within budget`
- `probe_soak_no_result: Re-ask, up to 3 (like the skills)`
- Production-fix question reply: "what else can we do to make the debugging process more efficient? one retry and stop seems not not dynamic enough."
- `production_debug_loop: All four`

Preserve the selected four-part option's content, as supplied:

1. a tiny-profile S1–S3 rehearsal before xhigh, paid from the existing production budget and capped at about USD1 / 15 min;
2. fail-fast stop with a diagnostic snapshot;
3. offline replay of saved journal events at zero model cost;
4. a fix loop: any number of distinct bugs while budget remains; each fix first adds an offline test that reproduces the bug (fails before, passes after) and passes T2's full automated checks; only affected scenarios rerun; the retained T2 owner fixes; a cause recurring after 2 fixes stops; budget exhaustion stops; the single independent review stays at the end.

The question reply records motivation; `All four` and its option content establish the new production debugging authority. **Do not retain v5's single-later-repair restriction for eligible pre-assurance production-debugging faults.** This is a trial-specific semantic-repair exception, not permission borrowed from generic execution recovery.

Keep the distinction between confirmed authority and approval-time proposals:

- Production's four-part debugging loop is confirmed.
- Extending that semantic-repair exception to faults discovered during T1/T2 remains the second reviewer's **proposal**. Retain it in the candidate because cheap native phases benefit from the same bounded debugging, but name it explicitly in fresh plan approval. The earlier permission to rerun anywhere does not itself grant additional semantic repairs. Nothing executes before that approval.
- Bind the exact rehearsal subcap at USD1.00 / 15 minutes and the existing proposed 10-second post-close observation bound in the revised approval. These are proposed operational defaults, not measurements or separately confirmed exact numbers.
- Preserve the target-owner rule when binding fixers. The selected T2-fixer wording applies to T2-owned code; v3 assigns the shared native adapter/config to T1. V6's own same-target-owner rule therefore requires its retained T1 owner for those targets, not undeclared writes by T2. Make that graph-consistent clarification explicit in approval. This does not allocate a replacement owner.

### B1. Expected results, three re-asks, size measurements, and budget ownership

This replaces v6 B1, v3's probe/soak no-re-ask prohibition, v5 A1's final no-re-ask sentence, and v5 A2 rule 4's no-re-ask wording. It does not replace the rest of A1's closure precedence or A2's native-observation distinctions.

**Expectation accounting**

- Probe: four planned expected results in the existing two-session recipe. Soak: four concurrent sessions, ten sequential expected results per session. A re-ask is a new request for the same expectation and same available actor; it is not a fifth probe expectation, eleventh soak expectation, new actor, or replay of the prior request.
- A malformed admitted candidate or a completed/no-result return eligible under A1 can lead to at most three re-asks, shared across those categories for that original expectation. Four invalid returns stop that expectation. Count actual re-ask submissions separately from observed invalid returns; a ceiling preventing the next submission is not an extra submitted re-ask.
- Thus the proposal permits at most **16 probe submissions** or **160 soak submissions per complete execution**, not four or forty total submissions. These are upper bounds, not traffic targets. Effects must disclose the change. B4-authorized corrected executions are additional complete executions under the same cumulative resource limits.
- Intermediate failed tool calls, silence, an unfinished required yield, unresolved original outcome, actor loss, deliberate cancellation, revoked authority, and exhausted resources do not acquire retry eligibility. Do not charge multiple invalid returns for intermediate errors within one request.
- For the transport-only probe/soak, a genuinely failed or cancelled turn is not retried by this new no-result allowance. The rehearsal runs the actual skill controllers and therefore preserves the same C4 rules as production, including A1's narrow existing Retrace failed-turn eligibility. V6's blanket shorthand “no re-ask for failed turns” must not silently remove that Retrace rule.
- Rehearsal expectations are the controller's original semantic expectations, not whole S1/S2/S3 scenarios or a new arbitrary turn cap. Keep source-need, scope-paused, valid BLOCKED, first-review/rethink progression, and the absence of a negotiation cap unchanged.

**Measurements and scheduled observations**

- “40/40 delivered” means forty expected results each admitted as domain-valid, first try or after eligible re-asks. It is **not** a claim of forty first-try successes. Report planned/completed expectations, first-try compliance, re-asks actually used per expectation, invalid-candidate versus completed/no-result counts, unresolved delivery, actual submissions, and the observed native/cancellation causes separately.
- Keep ten sequential expectations per session and four overlapping native session intervals. Move the four planned restores to between expectations 5 and 6, after expectation 5 and all its re-asks settle. Keep five designated observation-recovery exercises; bind their original turn selectors to expectation indices and one designated request within each, not to a shifting global submission count. Re-asks do not multiply the planned five exercises.
- Preserve the existing rule for additional incidental idle exits: record every actual restoration and require unchanged provider identity/no fresh-session fallback and PID coverage. Four planned restore exercises do not authorize ignoring additional process activity or failing an otherwise valid run merely because an eligible re-ask crossed an idle boundary.
- Keep exactly three designated size expectations, each requesting approximately 48 KiB of substantive payload with a required observation of at least 32768 UTF-8 bytes in the designated decoded string field. An eligible format/no-result re-ask repeats the **same** size request and threshold. Never increase the requested size, concatenate attempts, pad a result, add a continuation, or add an expectation to rescue the threshold. Retain the first candidate for each request; do not select a later yield from that request.
- Delivery/domain validity and the size measurement remain separate. A domain-valid result below the size threshold leaves that measurement inconclusive; it is not a new format/no-result failure authorizing a size-only re-ask. This retains the existing undersize classification rather than inferring an additional threshold-rescue grant from `probe_soak_no_result`.
- Record the confirmed amendment to “No padding, continuation, extra turn or re-ask may inflate size”: the three permitted semantic re-asks may repeat a designated size expectation unchanged; they do not permit size-only rescue traffic. Payload bytes are measured on the admitted result, never summed across attempts. Keep first-try and eventual-size observations distinguishable.

**Resources**

- T1 probe plus T2 native soak, including their re-asks and eligible corrected executions, share **USD2 / 20 minutes** cumulatively.
- T3 rehearsal, including its re-asks and fix reruns, uses the **rehearsal subcap inside the existing production budget**, not the USD2 pool. All rehearsal and production work shares **USD20 / 2000000 reported tokens / 120 minutes**. The rehearsal's proposed USD1 / 15-minute subcap does not reset between scenarios or fixes.
- Re-establishing an invalidated T1/T2 native proof still consumes that proof layer's remaining pool, even when the defect was discovered in T3. There is no transfer from the production pool or reset of either pool. A remaining production balance does not repair an exhausted upstream proof allowance.
- Keep v3's cumulative native-execution interval accounting, mandatory cleanup after ceilings, unknown/delayed cost and overshoot disclosures. A ceiling leaves unfinished expectations unproved/inconclusive; it does not erase an already observed defect or failed cleanup. No supported verdict may be inferred from the revised “40/40” denominator.

### B2. One independent re-watch, with bounded and accurate classification

Accept v6's bounded diagnostic instead of an open-ended obligation to rule out every capture fault. This replaces v6 B2 and narrows v5 A2 rule 1's diagnostic prerequisite. Keep all A2 prerequisites and exclusions: the required missing completion must be in an otherwise completed, uncancelled, observable request, with no retained valid first result that already satisfied delivery. Missing updates after intentional cancellation, resource stops, or an unknown owner outcome are not converted into unexplained native loss.

1. Perform **one** fresh passive `watchSession` replay of the exact original request window, using the retained cursor before its `turn_started`. For an initial window with no predecessor cursor, use the public no-cursor replay only if it actually includes that request's start and end. Never fabricate/decode a cursor, substitute another request, or read native session files as a second result channel.
2. The diagnostic reader checks request/session/tool-call association and start-to-result completeness independently of the controller's state machine. Stop at the matching `turn_result` and close/abort only that observer. Watch follows an open session indefinitely unless stopped, so bind a finite remaining observation deadline within the applicable native-evaluation allowance. One watch invocation is not itself a time bound.
3. If the relevant terminal update is present inside that complete window, **it was journaled**. Compare that fact with the controller's retained observation. This alone does not prove a trial-code bug: ordinary observer recovery, an observation-path discrepancy, or an evidenced controller/reader fault must remain distinguishable. An original captured result can be recovered at most once under v3 §6, using its own binding and normal domain validation; this authorizes neither resubmission nor reopening an already terminal protocol outcome.
4. B4 repair is available only after the required independent evidence and offline reproduction establish a fault in the evaluated trial code. A replay that the unchanged controller already handles correctly is not proof of such a code fault. Report an unresolved observation discrepancy without manufacturing repair eligibility.
5. If a complete, correctly bound independent window really lacks the required update, and A2's uncancelled/completed/observable prerequisites hold, record **not-supported for this approval's required observable path** under A2 rule 1. Do not claim that this proves a particular OMP race or excludes every possible trial-side cause. No further investigation gates that classification.
6. An unavailable or incomplete window, expired/corrupt/foreign/future cursor, deadline expiry, uncertain owner outcome, or ambiguous binding cannot prove absence. Report the exact unproved observation under A2 rule 2. A demonstrated trial-generated cursor/binding defect remains a trial-code fault; do not attribute it to native capability merely from the error code.

This is one runtime diagnostic path, not a new independent assurance pass or a requirement to dispatch the final verifier early. T1 must already provide the independent minimal reader/checker needed for an early probe result; it cannot depend on T2 code that does not exist yet. Later code reuses that boundary. Additional re-watches after a corrected execution belong to a new eligible execution, not unlimited attempts to change the original classification.

Read and safely project the necessary window before deleting private journal storage. Keep the observer passive: attaching/closing it does not cancel or replay the actor. The diagnostic has no permission to retain a raw journal dump. Preserve failed observations and subsequent recovered evidence separately.

### B3. Establish PID capture early; never substitute a sampling strategy for actual coverage

Accept v6's early feasibility check and retain all of v5 A4.

- In the four-expectation T1 recipe, exercise candidate public sampling points during work, at settlement, before deliberate idle expiry/close, and after same-session restoration. Include every process instance used by the normal-TTL and short-TTL/restored handles. The public `promptStarted` point is a concrete during-turn candidate to try; it is not a guarantee of continued process liveness.
- Correct v3's implication that PID publication occurs only at prompt cleanup. Pinned acpx applies the lifecycle snapshot during connect; `runtime.ts` also awaits a live checkpoint **before** `runPromptWithRetries`, and requests checkpoints on session updates. This supports testing earlier public samples. It does not establish that all checkpoint writes succeed or prove public PID availability in the actual pinned binary/runtime. The probe decides what was observed.
- Record which public points actually produced PID coverage, then sample those points in T2/T3 for every known process start/restoration, including short-TTL instances before deliberate expiry. A few successful probe samples are a strategy, not proof that later instances were covered. Check actual coverage every time. Keep the handle-local PID set and existing operation evidence; add no generation registry, process-tree supervisor, private lease access, or signal-based termination by the observer.
- If the authorized probe establishes that the required public capture method cannot supply coverage for a needed instance type, report not-supported for that disposal-proof method and do not enter dependent native work. If resource/provider/observation failure prevented the test, report the precise inconclusive gap instead of an established method limitation. A demonstrated sampling/parser defect in trial code follows B4 within its approved scope.
- **A negative capability result does not discharge cleanup.** If an actor may have run without PID/exit coverage, cleanup and evaluation completion remain unproved. Require close to resolve, separately observed recorded-closed status, and ESRCH for every covered PID; preserve earlier observed exits. Only positive evidence that no actor started permits a not-applicable PID check. No automatic close retry, missing-PID waiver, or inference from no completed turn is introduced.

### B4. Trial-specific native-debugging loop, not generic machinery recovery

This replaces v5 A5 “Trigger and scope” bullets 2–3 and v6 B4. It also removes the superseded v5 **two corrected native executions per cause** proposal wherever it survives: the confirmed new limit is **two fixes per cause**, and one fix may require several affected complete proof units. Keep A5 bullet 1's evaluated-code distinction, bullet 4's non-triggers, its smallest-complete-proof rules, and its identity/artifact/budget rules, subject to the explicit amendments here.

**Eligibility and ownership**

- For evidenced trial-code faults found by native execution **before final independent assurance starts**, the confirmed production debug loop permits distinct causes while the applicable resources remain, with at most two fixes per cause. This replaces the ordinary single-later-repair limit for those faults only. The proposed same-rule extension to T1/T2 must be explicit in fresh approval before use.
- Native capability limitations, unexplained delivery uncertainty, model behavior, legitimate BLOCKED/C4/dependency stops, desired different outcomes, and a wish to reach an unvisited branch are not code-fix triggers. A controller fault falsely producing such a stop needs its own independent evidence and reproducer.
- The fixer is the retained implementation owner of the exact faulty target. Under v3, the T1 owner owns the shared native adapter/config; the T2 owner owns the semantic controller and experiment verifier. “Found during T3” changes neither ownership nor write authority. Bind/retain the needed owners through native debugging and final repair; unavailable required ownership stops rather than authorizing a replacement.
- Distinguish **experiment-verifier code** from **final independent verification**. A native-evidenced defect in the evaluated experiment checker/reader before assurance is a trial-code fault, not excluded merely because its filename or component says verifier. Findings from final review/verification use the ordinary later-repair rule below. A verifier's disposable observation machinery remains in generic recovery's actual narrow scope.
- Completed task records remain historical and are not rewritten. Record each later fix, its owner, cause, source change, deterministic result, affected proof, and native execution outcome in the discovering task's existing run evidence. Mark affected proof stale until it is re-established; old checked boxes or a successful historical run are not current proof. Introduce no separate retry ledger.

**Per fix, in this order**

1. Preserve the fail-fast snapshot/observations and establish one evidenced cause, with the smallest authorized correction and its affected scope.
2. The target's retained owner first adds an isolated offline regression check/replay that runs the faulty evaluated code and reproduces the consumer-visible invariant/transition failure. Observe it fail before changing that code. A test of source wording, a copied status, a mock echo, or a fixture that merely asserts the recorded failure label is not a reproducer.
3. Apply the correction; observe that check pass and run the full applicable deterministic check set. During T3, **T2's full automated checks must pass**, even when the correction belongs to T1; also run the owning task's full checks. For the proposed early T1 extension, T2 does not yet exist: require T1's full existing check set, then require the complete T2 set before any T3 admission. Do not claim unbuilt T2 checks passed or build the full controller merely to permit cheap T1 diagnosis.
4. Regenerate only the complete proof units actually invalidated. The unit remains the complete probe, entire 4×10 soak, or whole S1/S2/S3 execution as applicable. A shared boundary correction may invalidate several layers/scenarios; a controller change may affect all three scenarios. Do not rerun a single failed reviewer/turn or combine incompatible partial executions into a pass. A verifier/export-only correction can instead re-assess complete compatible retained evidence without model traffic.

Rehearsal uses the same affected-scope rule. Each eligible corrected execution starts fresh initial scenario actors under the same approved immutable inputs; no reviewer is replaced inside an execution and no uncertain request is replayed. Preserve failed copies/results. For an Artifact rerun, create a separate scenario copy from the original approved input, never reset the failed copy or disguise rollback.

**Limits and stops**

- Two fixes per evidenced cause across the approved trial outcome, not per task, profile, run, actor, or wording. Record applied corrections and their validation outcomes honestly; unsuccessful correction does not reset history. A recurrence after the second fix stops. Additional native proof units required by one fix do not each count as a new code fix, but all spend/time still counts.
- Identify recurrence by the evidenced causal defect and failed invariant; code/check locations support that identity. Moving code, renaming a check, changing error text, or a temporary pass does not mint a new cause. Conversely, distinct independently evidenced bugs are not automatically the same cause just because they fail the same aggregate check.
- No offline reproduction, exhausted relevant budget/allowance, unknown history/effects, required owner unavailable, unresolved A4 disposal, or a correction requiring changed approved behavior/acceptance/effects stops the affected work. Obtain a human decision for changed authority; never make an acceptance change look like a code fix.
- A timing-dependent fault may be reproduced using an evidenced controlled schedule in the offline harness. An invented schedule that only forces an error is not proof of the diagnosed native cause. If an adequate reproduction cannot be built, stop; do not weaken the selected red-before/green-after requirement.
- Global pool accounting and any rehearsal subcap remain cumulative. Close all failed execution actors under A4 before corrected native work. An upstream proof invalidated during T3 must be regenerated within its own remaining pool before the production gate can reopen. If it cannot, report that exact unproved prerequisite.

**One final assurance boundary**

- Finish eligible native debugging and settle the candidate/evidence before the single independent code/test review. Final independent verification follows under the existing standard-assurance contract. There is no independent review per fix.
- Once that final review starts, the open-ended distinct-cause debug loop is over. Findings from that review or final verification—including code faults exposed by native checks there—use dev-implementation's remaining attempt-2 authority with the same responsible owner. Do not relabel a post-review finding as a new pre-review native bug to reopen this loop.
- An authorized final repair can invalidate native evidence. Regenerate its affected complete units within remaining budgets and re-run the fixed verification/closure checks with the retained verifier. This rerun permission grants no further semantic repair if attempt 2 is exhausted. Review is not repeated.
- The pending plan's Recovery field references this spec-owned trial-specific loop and generic execution recovery **only for machinery that does not change the evaluated deliverable**. Bind the trial-specific repair operation explicitly in owner contracts; do not reset or falsely label generic attempt counters. No generic skill/rule or unrelated controller receives this exception.

### B5. Rehearsal, pre-cleanup diagnostics, and effect-free offline replay

This replaces v6 B5. All four selected components remain.

**Rehearsal and production admission**

- T3 begins rehearsal only when the current production permission is actually open: required T1/T2 capability proof supported, applicable code checks passed, identities/config/pins current, and required safety/cleanup settled. A checker successfully validating a **closed** gate is not permission to spend. Use the same controller, approved inputs, scenario semantics, and configuration as production, changing the scenario actors' model/thinking selection to `xai-oauth/grok-4.6:low`.
- Plan one execution each of S1, S2, and S3 before xhigh, subject to the shared proposed USD1.00 / 15-minute rehearsal subcap. Eligible fix reruns share it. Rehearsal tokens/time/cost also count inside USD20 / 2000000 tokens / 120 minutes; no separate production balance starts afterward. Low thinking is not evidence of cheaper per-token pricing.
- Rehearsal is diagnostic, never substitute production-profile evidence. Genuine tiny-model semantic BLOCKED/C4 stops are not code faults and do not require a passing rehearsal before xhigh. Record unvisited or cap-censored scenarios rather than manufacturing coverage or retrying to obtain a preferred verdict.
- When the subcap is spent, stop further rehearsal submissions, settle/cancel under the existing rules, retain evidence, and complete A4 cleanup. **Proceed to xhigh only if the production prerequisites still hold and sufficient relevant budget/authority remains.** Cap expiry cannot bypass an unresolved code fault, a newly invalidated native capability proof, unsafe evidence, or failed cleanup.
- Do not add a new requirement that every rehearsal scenario pass. A corrected code fault with its reproducer/full checks passed and all required upstream proof current can leave a rehearsal scenario unproved when its subcap is exhausted; production can then provide the remaining native observation. Preserve that gap and fix history. An unfixed fault is different and closes affected production entry.

**Fail-fast ordering**

- Check the controller's approved invariants at state transitions. On the first violation, stop new affected submissions and freeze the permitted diagnostic state **before cleanup mutates it**: exact invariant, controller state needed for that invariant, owning request/window/cursor/toolCallId, and relevant A7-projected events.
- Freeze does not mean dumping arbitrary controller objects, whole prompts, native error prose, or raw journals. Enumerate the additional closed diagnostic fields under A7. Keep required result data exact and apply the existing unsafe-retention stop.
- Perform B2's one bounded read when applicable while its private journal is available; then complete cancellation/closure and A4 disposal as required. Append cleanup observations without overwriting the fault snapshot. Delete private storage only after required safe evidence and observed cleanup. Necessary cleanup is never suppressed merely because a diagnostic is unavailable.
- Preserve proven independent work. “Affected” follows the actual failed invariant/component: a fault in shared scheduling, binding, budget, or lifecycle code can affect multiple active actors. Pause new work relying on that component until safety is established; do not assume only the actor exposing the fault is affected.
- Resume through an eligible owner-directed B4 correction or ordinary permitted observation recovery, never automatically merely because a snapshot was written. A fail-fast condition and its cleanup failure stay visible in final evidence.

**Offline replay**

- The fixture harness feeds retained **A7-safe exports**, not raw saved journals or native session copies, into the actual controller logic with a controlled clock/event ordering and isolated scripted effect ports. There are zero provider/model calls and no dispatch to the native runtime. Native/network fall-through must fail closed; filesystem application is confined to disposable scenario fixtures. Do not load credentials or mutate live/failed-run artifacts to replay.
- Include only explicitly needed replay fields in the closed schema: kinds/statuses, machine-owned associations, required exact result data, event order/relative timing, approved nonsecret inputs, and observed lifecycle/effect outcomes needed by the diagnosed path. Deterministic replay cannot be promised from timing order alone if a required clock/input/effect observation is missing.
- If safe retained evidence is insufficient, build a small independent scripted reproducer from established permitted facts where possible. Do not fill gaps with invented “observations,” broaden raw retention, or declare a replay adequate solely because it consumes every exported event. No adequate offline reproduction means no B4 fix for that cause.
- Replay checks controller behavior and the correction's observable outcome. It does not prove native transport delivery, process disposal, restoration, or model semantics and cannot replace native evidence in an acceptance criterion.

### B6. Conditional tasks and honest DONE, without waiving entered work

Accept v6's explicit plan branches; this section replaces its unconditional “tasks always execute” shorthand. It amends v5 A6 and carries v3 §10's distinctions into the actual acceptance contract before approval.

- Every task has a runnable approved branch **when its dependencies have completed**. A correctly completed T1 negative/inconclusive evaluation can satisfy T2's dependency while prohibiting its implementation/native branch; T2 then performs its explicit not-run/report branch. T3 similarly finalizes the evaluation without production. An unfinished prerequisite caused by broken required code or unresolved cleanup is not a completed negative and does not authorize bypassing the dependency.
- T1 owns a complete minimal report/finalization and independent branch-checking path before native work. It must work without T2's controller/verifier or a T3 production run. Bind exact early-branch commands and nonoverlapping target ownership in the revised spec/plan. T2/T3 use that available code to produce their own not-run records; they do not need to build otherwise skipped implementation merely to render a report.
- Each AC's **Behavior and Check** must explicitly cover its approved taken/not-run branches, with exact expected results and a checker available at that point. Spec-v7 owns those texts; project them exactly into the plan. Do not leave an unconditional “40/40 passed” or “production ran” Behavior and add only a not-run exception in prose elsewhere.
- A branch check can pass because the native capability was correctly measured as not-supported/inconclusive and its dependent work was correctly skipped. Keep separate fields/results for implementation/check correctness, capability verdict and observed thresholds, production permission, and evaluation completion. A passing evaluation/guard check never means an unmet native threshold was met or the spending gate is open. Check not-run evidence against its bound prerequisite and absence of forbidden downstream activity, not merely a runner's own boolean.
- For any entered implementation phase, its required code/mechanics checks still have to pass. A known unfixed code defect, missing/contradictory required evidence, unauthorized effect, invalid approval, or unresolved disposal cannot be hidden as a successful negative branch. If the finalization/checker path itself is broken or unavailable, report a real implementation blocker; do not claim a complete evaluation.
- Keep independent final review/verification over the actually produced target and complete approved conditional check set. Native acceptance checks validate current retained native observations independently; they do not create an extra paid execution merely because the checker is rerun. Regeneration is required when relevant proof is invalidated or missing, under the existing execution authority and budgets. Do not turn verification into runner self-attestation.
- `DONE` is available only when every task/AC is checked on its actual authorized branch, immutable task completion records exist, current assurance is settled, required cleanup/evidence are complete, and the final summary/Completed At requirements are met. A clean negative capability verdict can meet that contract. Unresolved code/cleanup/authority cannot. Budget exhaustion stops spending, not automatically the plan; `CLOSED` still needs explicit authority.
- T3 targets include rehearsal and final evaluation evidence under `runs/t3-*/**`. Preserve A6's complete gate/task/command/flag/directory/verifier migration and no-compatibility-shim rule. The concise plan Recovery references the spec's B4 semantic exception and the generic policy's separate machinery scope; Effects disclose the re-asks, rehearsal, proposed early-phase loop extension, and corrected native executions with their actual budget pools.

### Application and conflict removal

Main revises these three existing artifacts together:

1. `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-decision-evidence.md` to decisions/v5, including the verbatim answers and option content above, and distinguishing proposed early-phase scope/defaults from confirmed decisions.
2. `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-spec.md` to spec-v7, integrating v3 + v5 + this replacement B1–B6 into one authoritative body rather than leaving additive contradictory clauses.
3. `.agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md`, refreshing the exact spec binding, graph/owner/reentry contracts, conditional AC projection, Effects and Recovery/Stops; keep it `PENDING` for fresh execution approval.

In addition to A6's migration list, remove conflicting absolute no-re-ask/no-rerun clauses; the old four/forty total-submission implication; rehearsal charges against USD2; unconditional xhigh continuation after rehearsal cap; automatic trial-fault attribution from a successful re-watch; PID-publication-only-at-cleanup wording; blanket T2 adapter ownership; the old per-cause two-native-execution ceiling; the single semantic-repair limit where the new approved pre-assurance exception applies; and all-PASS-only completion language. Keep the ordinary final-assurance repair boundary explicit. Do not change generic skills, rules, ADRs, older lean artifacts, live code or the pinned binary to make this local proposal fit.

## Changed targets/effects

- Added only `.agents/artifacts/2026-09-24_reconcile-retrace-native-result-revision-handoff-v7.md`, the reviewed complete replacement for chat v6 B1–B6. Preserved v3, v5, the bound evidence/spec/plan, older artifacts, live implementation and contracts.
- Read repository authority and selected pinned acpx source over HTTPS. Calculated the maximum prompt submissions in memory. No native OMP/acpx run, model experiment, binary measurement, install, credential/live-session inspection, Git operation, upstream repair, or shipping.

## Checks

- V7-HUMAN-AUTHORITY
  Behavior: Preserve all supplied recent answers and all four selected debugging components while identifying the proposed T1/T2 extension honestly.
  Check: Compare the five entries and four-part option against the supplied v6; trace the confirmed production exception through B1/B4/B5 and the approval-only extension through B4/B6; expect no return to v5's single-repair restriction for eligible pre-assurance production faults.
  Observed: PASS for direct contract review. No new human answer is inferred from a retry policy or the production-fix question alone.
- V7-EXPECTATIONS-AND-RESOURCES
  Behavior: Count expected results separately from submissions and charge every phase to its correct cumulative budget.
  Check: Calculate four and forty expectations times initial request plus three re-asks; trace size-only, cancellation, uncertainty, and rehearsal-cap branches through B1/B5; expect maxima 16 and 160 per execution, unchanged size-only inconclusive handling, no replay, and rehearsal inside production rather than the USD2 pool.
  Observed: PASS for arithmetic and direct contract review. No probe/soak/rehearsal was run.
- V7-WATCH-BOUNDARY
  Behavior: Bound observation without attributing a cause from insufficient evidence or reopening an original request.
  Check: Read pinned [watch documentation](https://github.com/openclaw/acpx/blob/v0.19.2/docs/session-watch.md) and compare its follow/cursor/settlement contract with B2; expect one passive bounded complete-window replay, present-versus-absent-versus-unavailable distinctions, and no automatic repair grant from a recovered update.
  Observed: PASS for source/contract review. Actual observation loss or native delivery behavior remains UNRUN.
- V7-PID-PUBLICATION
  Behavior: Test early public PID capture without claiming runtime coverage from source or permitting missing-evidence disposal.
  Check: Read pinned [connectAndLoadSession](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/reconnect.ts#L416-L424) and [runtime checkpoint setup/calls](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/execution/runtime.ts#L829-L843), including its pre-prompt checkpoint near L1113; compare B3 with v5 A4 and v3 §7.
  Observed: PASS for the source correction: snapshot application and a pre-prompt checkpoint are present. Public PID availability, checkpoint success and observed disposal in native runs are UNRUN.
- V7-OWNERSHIP-AND-ASSURANCE
  Behavior: Preserve target ownership, the confirmed trial-specific debugging allowance, and the one final independent assurance boundary.
  Check: Compare v3 §9's T1 adapter/T2 controller allocation, [dev-implementation attempt 2 and assurance](../../.config/agents/skills/dev-implementation/SKILL.md#attempt-2-and-stops), and [execution recovery](../../.config/agents/skills/dev-implementation/references/execution-recovery.md) with B4; expect target-owner repair, explicit local exception, full required checks, no cause reset through renaming, and no post-review loop reopening.
  Observed: PASS for contract review; fixes, regression tests, independent code review and implementation verification have not been executed.
- V7-CONDITIONAL-COMPLETION
  Behavior: A truthful completed negative evaluation can reach DONE, while code/evidence/cleanup failures cannot be passed as not-run.
  Check: Compare B6's dependency, conditional Behavior/Check and gate rules with v3 §10, v5 A6, `rule://plan` Lifecycle/Stops and `rule://plan-impl-spec` Acceptance; expect exact direct conditional checks, actual current proof, settled assurance and no automatic CLOSED.
  Observed: PASS for contract review. The pending plan has not yet been revised or validated against these new clauses.
- V7-HANDOFF-STRUCTURE
  Behavior: Deliver one complete successor, not a partial amendment requiring the chat v6.
  Check: Check this authored text for the five required Handoff headings in order, B1–B6 exactly once, all five verbatim entries, one receiver, and no placeholder lines before writing it.
  Observed: PASS. The write creates only this handoff.
- RUNTIME-PROOF
  Behavior: Do not claim native reliability, isolation, size delivery, restoration, disposal, budget enforcement or production readiness from this review.
  Check: Execute the revised approved contract only after Main's coherent artifact revision and fresh approval.
  Observed: UNRUN. This review is not trial evidence or passed implementation acceptance.

## Blocker/risk

- Review/handoff blocker: none. Execution still requires the revised coherent spec/plan and fresh approval, including explicit disposition of the proposed T1/T2 semantic-repair extension, target-owner clarification and operational defaults.
- Three re-asks can substantially increase model traffic: 40/40 eventual delivery is less informative about first-try compliance. Reports must retain both measurements; limits and cleanup still win.
- A successful re-watch does not by itself identify which code or observation layer caused a discrepancy. One complete bounded read limits classification work, not causal uncertainty.
- PID coverage can remain impossible or missed in native operation. Early discovery limits wasted work but cannot turn unproved cleanup into a completed evaluation.
- Offline reproduction may be unavailable for a timing/evidence gap. The selected policy stops that fault; it does not guarantee every production bug can be repaired within the trial.
- Rehearsal can miss production branches, and fixes can invalidate expensive upstream proof. Exhausted relevant budgets, unknown cost or unsafe/unretainable evidence remain visible limits, not permission to continue or silently transfer funds.

## Next receiver

- **Main**, the bound specification and plan author: use unchanged v3 + v5 A1–A7 + this v7 (not chat v6) for the next authorized three-artifact revision. Quote the answers and selected option exactly, resolve the explicitly proposed scope/defaults in fresh approval, keep the plan PENDING, and present the coherent execution contract. Do not implement or execute from this handoff.
