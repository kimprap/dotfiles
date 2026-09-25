# acpx + OMP ACP Trial Decision Evidence

**Revision:** `acpx-omp-acp-trial-decisions/v7`  
**Status:** Human-confirmed planning direction; three execution proposals await approval  
**Date:** 2026-09-24  
**Requesting owner:** `Main`  
**Next-owner role:** `dev-specification`

## Authority and boundary

The current human instruction authorizes Main to integrate unchanged v3, v5 A1–A7, v7 B1–B6, and the final integration corrections into this evidence, spec-v9 and the existing pending trial plan. Later named corrections control conflicts; unnamed rules are preserved without shortening their meaning. The normative implementation contract is consolidated in [spec-v9](./2026-09-24_acpx-omp-acp-trial-spec.md); the review handoffs are provenance, not additional executable rule layers after integration.

This is authority for these three document revisions only. No implementation, install, credential operation, model call, OMP/acpx execution, live configuration edit, Git, shipping, or production adoption is approved now. No v8 or other handoff file is required. The older lean-redesign specification and plan, live skills, rules and ADRs remain unchanged.

## Preserved decisions

- **D1 — coded runner.** Code runs Reconcile/Retrace mechanics. The calling LLM collects approval of the five-field Reconcile brief and the complete normalized Retrace scope table before starting the runner, then reads its report. Approval and genuine model judgment are not scripted by the runner.
- **D2 — persistent reviewers, same-session restore only.** A/B are never replaced (KR4). Process loss permits only restoration of the exact provider session through `session/resume` or `session/load`, confirmed by the same provider session ID. Restoration failure, unavailable required identity, or any need for `session/new` stops and reports the unrestored session. Each request ID is submitted exactly once; delivery-uncertain turns are never replayed.
- **D3 — existing live OAuth store.** Future OMP children set `PI_CODING_AGENT_DIR=/Users/kim/.omp/agent` and use the configured OAuth accounts. No credential snapshot, migration, new broker, provider substitution, credential retention, or forwarding provider API-key/broker environment variables. Ordinary OAuth refresh through the shared live store is a disclosed future effect, not authorized now.

Preserve the full KR1–KR16, KT1–KT5, KB1 and KS1–KS7 allocation: 29 obligations. Trial-only KB1 uses the admitted, domain-valid native yield candidate instead of categorically excluding yield. C2 keyword lines and C5 frames are not admission or fallback rules. Generic collection policy and later live-cutover authority do not change. KS8 is not an additional trial guard.

The previously confirmed selections remain:

- `Structured result tool`
- `One result boundary`
- `Complete the evaluation`
- `isolation_evidence: Runtime tool-call check`
- `disposal_evidence: Record PID, then check`
- `session_copies: Don't keep them`
- `probe_placement: Separate first task`

These replace the superseded session-text equality oracle, JSONL nonce/parent-chain mapping and retained sanitized session copies; the positive tool-inventory requirement; prose/delimiter admission; the two-task graph; and the all-capabilities-PASS prerequisite for completing an evaluation. Safe typed journal export, strict observed disposal, a separately runnable first probe, and truthful conditional negative/inconclusive evaluation remain required. No model/provider fallback, new reviewer identity, uncertain-request replay, padding/continuation, or automatic live adoption is granted.

## Recent interview record — verbatim

Five entries supplied in the current integration contract:

- `reconcile_no_result: Re-ask it (counts toward the 3)`
- `native_rerun_after_fix: Rerun anywhere within budget`
- `probe_soak_no_result: Re-ask, up to 3 (like the skills)`
- Production-fix question reply: "what else can we do to make the debugging process more efficient? one retry and stop seems not not dynamic enough."
- `production_debug_loop: All four`

`probe_soak_no_result` selected option text:

> Re-ask in the same session, naming the problem, up to 3 times per expected result. This draws from the shared USD2 and 20 minutes. '40/40' then means 40 expected results delivered after any re-asks, and '10 turns' means 10 expected results per session. The re-ask asks for the same payload, not a bigger one. Misses are reported separately. A result that started but never finished arriving is still never re-asked.

`production_debug_loop: All four` selected option text:

> Rehearsal, fail fast, offline replay and the fix loop together. Most bugs surface in the cheap rehearsal or offline, and xhigh reruns are only for bugs that appear in production. Ends on budget, or when a bug comes back after 2 fixes.

**Ask-record question text**, not the selected option description:

> (1) REHEARSAL: before the expensive xhigh runs, run S1–S3 once on the cheap grok-4.6:low profile to catch controller bugs, paid from the existing production budget and capped at about USD1 / 15 min. (2) FAIL FAST: on the first internal consistency failure, the controller stops and saves a diagnostic snapshot (state, journal position, the failed check), so one run is enough to diagnose. (3) OFFLINE REPLAY: saved journal events can be fed back into the controller offline at zero model cost, so debugging does not need native reruns. (4) FIX LOOP: any number of different bugs may be fixed while budget remains. Each fix must first add an offline test that reproduces the bug (fails before the fix, passes after) and pass T2's full automated checks. Then only the affected scenarios rerun. The retained T2 owner makes the fixes. A bug that comes back after 2 fixes stops the loop, and so does running out of budget. The single independent review stays at the end.

Provenance: the human supplied these strings in the final integration contract, identifying the question as the second reviewer's copy of the reviewer-session ask record. This revision preserves that supplied text; it does not claim an independent re-read of the original ask record. The free-form production-fix reply records motivation, not an unbounded grant independent of the selected option.

**Reviewer ownership clarification, not user quotation:** “The retained T2 owner makes the fixes” does not transfer the shared adapter or configuration. T1 still owns those targets under v3; repairs return to the retained owner of the actual faulty target. The derived plan binds that ownership explicitly.

## Model-pin decisions — verbatim

> let's change a bit. tiny=grok4.7:low, opinionb=grok4.7:medium

> make a use "openai-codex/gpt-5.6-sol:medium", to lower cost all around.

Interpretation, not user text: the Grok IDs take their provider prefix and hyphen from the live config IDs. Soak and rehearsal follow tiny because they were the cheap low profile. Medium is a cost choice, not a measured price, and does not enlarge any grid, pool or rerun allowance.

These decisions replace the model names in the two preserved production-loop quotations above, including `grok-4.6:low`; no trial launch uses `xhigh`.

Later model-pin decision, 2026-09-25, verbatim:

> the pinned models have been changed. let's go with the current omp config, as well as the other models not listed as example below, i.e. the following:
> ```
>   second_opinion_a: anthropic/claude-opus-5-5:medium
>   second_opinion_b: xai-oauth/grok-4.7:medium
> ```

Interpretation, not user text: reviewer A's profile (second opinion A, including S3 scope evaluators) becomes `anthropic/claude-opus-5-5` at medium; reviewer B stays `xai-oauth/grok-4.7` at medium; tiny, soak and rehearsal follow the current live `tiny` role, `xai-oauth/grok-4.7:low`. This replaces only the earlier `openai-codex/gpt-5.6-sol:medium` choice for profile A. It changes no grid, pool, rerun allowance or other approved decision, and no trial launch uses `xhigh`. The existing execution approval covers this change.

## Integrated decision meaning

- KB1 is amended only for this trial. A native submission is a candidate, not yet a reply; domain-invalid candidates consume C4. Ordinary output and every excluded generic surface remain excluded, never fallback. The current spec owns the sole complete admission rule.
- No-result/invalid-candidate re-asks share three per original expectation. Four planned probe expectations and forty soak expectations are not four/forty total submissions. The unchanged size request may be repeated by an eligible semantic re-ask; no bigger payload, padding, continuation, summed attempts or size-only rescue is authorized. Started-but-unfinished delivery remains non-retryable uncertainty. Rehearsal uses the production budget, not the probe/soak pool named by the probe option.
- The confirmed four-part production loop is a trial-specific semantic-repair allowance, not generic machinery recovery. It uses the offline failing-before/passing-after reproducer and full required checks, target-owner fixes, actual affected complete proof units, and the global loop-end rule in spec-v9. Two **fixes** per cause replace v5's two corrected **native executions** per cause; multiple necessary proof units do not each count as a fix. Extra production executions are only for evidenced bugs that appeared in production, not for a desired semantic result or rehearsal-only discovery.
- The production USD20 / 2000000 reported-token / 120-minute limit, or recurrence of one evidenced cause after its second fix, ends the debug loop for every cause. The narrower rehearsal and probe/soak pools stop only work charged to them. The selected production limit is not replenished by tasks, causes, profiles, resources or executions.
- An unfixed bug blocks the affected production entry until the authorized B4 correction passes its reproducer and full checks; entry being closed by that bug is not a circular prohibition on fixing it. Rehearsal-cap exhaustion does not by itself end fixing. Independent final review, verification and reporting still run after the loop ends, but no exhausted two-fix cause can be repaired by those roles. A known unfixed trial-code bug blocks DONE and requires a human decision for CLOSED or new authority. A truthful native not-supported result must not be relabelled as an unfixed code bug.
- Exhausting the production limit without a known unfixed code bug does not by itself block DONE: the other exact lifecycle, evidence, branch, assurance and cleanup conditions still apply. No further model work is allowed at that limit; required cleanup, review, verification and reporting remain required.
- Each S1/S2/S3 scenario has one planned production execution. Rehearsal and authorized corrected executions are additional complete executions, never stitched from partial runs. The scripted 2097152-byte fixture is to traverse the public acpx route bound and byte-counted offline in spec-v9; its runtime mechanics evidence remains unrun and is not native OMP/model-size proof.

## Approval-time proposals — exactly three

1. Extend the confirmed production semantic-repair loop to native-evidenced T1/T2 faults. The earlier “Rerun anywhere within budget” permits locations of eligible executions, not this additional repair authority by itself.
2. Bind the rehearsal subcap at exactly **USD1.00 / 15 minutes** inside the unchanged production pool. The selected question said “about USD1 / 15 min.”
3. Bind the finite PID exit-observation ceiling at **10 seconds after close returns**, not from close invocation and not a timeout on close itself.

These are included transparently in the candidate contract for fresh plan approval, not reported as already approved. No other new approval-time proposal is introduced.

## Preserved pins, scope and later authority

Keep acpx 0.19.2 and its existing npm integrity, Node >=22.13.0, and `/Users/kim/.local/bin/omp`, `omp/18.3.0`, 208460816 bytes, SHA-256 `d61fb411f24146bed48dd901b13b5912a297d899ee691dda69c4b5b7ab8c35dc`. The human adopted the prior measurement; there is no planning-time remeasurement, backup inspection, binary swap or downgrade. The explicit trial launch pins are:

| Actor | Pin |
|---|---|
| Production reviewer A and every actor using A's exact profile, including S3 scope evaluators | `anthropic/claude-opus-5-5:medium` |
| Production reviewer B | `xai-oauth/grok-4.7:medium` |
| Tiny: canary, layer (b), soak, rehearsal | `xai-oauth/grok-4.7:low` |

Preserve live OAuth-store selection without credential copying/inspection, 120-minute turn timeout, 130-minute normal idle TTL and 1-second deliberate idle-expiry TTL. Low thinking is not evidence of cheaper per-token pricing.

Retained trial code and safe evidence remain under `.agents/artifacts/acpx-omp-acp-trial/`. Native OMP sessions and raw journals stay private temporary material, never retained copies. Rehearsal, fail-fast snapshots, offline replay, typed export, fix-loop accounting and PID sampling remain trial-proof mechanics; they do not become live skill text, ADR clauses or generic workflow rules. The later live-cutover paragraph of v3 still governs any separately authorized live adoption.

Return actual supported/not-supported/inconclusive causes and justified options, without mandatory old-plan routing, automatic reruns or adoption. The sole active derived plan remains `.agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md`, PENDING with execution unapproved.

## Evidence and next owner

- Current human final integration contract, supplied in this conversation, controls the explicitly named corrections.
- [v3](./2026-09-24_reconcile-retrace-native-result-revision-handoff-v3.md), [v5](./2026-09-24_reconcile-retrace-native-result-revision-handoff-v5.md), and [v7](./2026-09-24_reconcile-retrace-native-result-revision-handoff-v7.md) preserve reviewed provenance and remain unchanged.
- [Semantic guard baseline](./2026-09-23_reconcile-retrace-lean-redesign-spec.md#keep-unchanged-the-only-hard-guard), [OMP ACP](https://omp.sh/docs/acp), [OMP authentication](https://omp.sh/docs/secrets), and [pinned acpx shared runtime](https://github.com/openclaw/acpx/blob/v0.19.2/docs/shared-sessions.md).

Main consolidates the current technical authority in spec-v9 and projects its exact acceptance and recovery into the existing pending plan, then presents the combined contract for approval. No implementation or execution is approved by this document.
