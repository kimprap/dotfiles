---
name: dev-handoff
description: >
  Package revision-bound task results, evidence, blockers, and recovery state for
  transfer to a named next owner. Use when ownership or context changes, recovery
  must survive a context boundary, or any attempt ends; skip ambient status notes
  and never duplicate canonical authority or expand the receiver's permissions.
---

# Engineering Handoff

Own the one Common Handoff emitted by every semantic attempt, including non-success. Extend this envelope for role-specific evidence; never create a second result or recovery envelope. Carry only the emitting role's local delta. Reference unchanged canonical authority, manifests, state, and evidence by exact URI and SHA-256 rather than copying their bodies.

## Intake

Require the exact parent `OUT-...` ID and authority revision, Task Contract revision, owned `AC-...` IDs, expected progress signal, current frontier, inherited two-attempt semantic budget and run-wide post-assurance repair token, attempt number, role, governing and dependency revisions, exact produced or inspected target identity, observed evidence, and exactly one eligible receiver. The repair field is exact: `unused 1/1` or `consumed 1/1` plus the consuming repair revision when consumed. For an eligible standard/high-consequence next-loop checkpoint, also require all stable remaining IDs, their relation to the parent outcome, affirmative goal-satisfaction evidence, the materially changed falsifiable hypothesis or `none`, one allowed recommendation, the selected human action, Close eligibility/disposition, exact target/reused evidence/residual risk, and original initial-review/rerun counters. D03 additionally requires the executing plan's authoritative URI and unchanged Datetime/slug plus the newest persisted exhaustion record identity and exact grant/opinion/disposition state. An otherwise-eligible post-2/2 ask requires an explicit no-record boundary and carries its one selected action only here and into the resulting same-plan authority revision. A derivative revision inherits attempts, repair state, counters, and any current grant identity. Stale, missing, contradictory, unsafe, or inconclusive input makes the Handoff non-consumable and emits no checkpoint frame.

When the Task Contract, once-bound target or applicable-rule manifest, prior receipt, or prior evidence identity is unchanged, require one digest-bound reference per unchanged item and omit its body. Each reference names the exact URI, SHA-256, semantic role, and expected immutable revision. The backend or cold-start receiver must fetch and compare every reference before consumption. Missing, unreadable, stale, mismatched, contradictory, or body-duplicated reference state makes the Handoff non-consumable; narrow the reference set rather than adding a store, cache, ledger, or second envelope.

For a same-outcome repair, carry the unchanged parent acceptance and proof-recipe identities, repair-owner proposed map, backend-frozen action for every criterion, every verifier-accepted fresh impacted result or unaffected evidence identity and validity basis, and the fresh repaired aggregate verdict. Also require every criterion's impacted/unaffected classification, causal path/fixture/consumer, fresh/reuse action and independent accept/reject result; each review lineage identity and closure state; exact repair delta and accepted review impact map; affected and unchanged surfaces; unchanged-surface review reuse identities; each admission disposition; every eligible blocker mapping to affected parent `AC-...` IDs or `affected AC: none` plus its fixed contract/consumer; any exact authority conflict; and terminal advisories.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`. Progress return classes are exactly `completed`, `proved`, `blocker-resolved`, `authority-change`, and `no-progress-stop`; they do not replace the attempt outcome.

Also require the Task Contract's human `Intent`, selected `Methods`, and method-binding evidence. Plan-backed values must match the parser-valid plan task unchanged; direct no-plan values must name the current authority from which Intent was derived and whether explicit test-first authority selected `tdd` or explicit `none`. A successful `none` binding states that no method skill loaded. A successful `tdd` binding names the exact `dev-tdd` revision and red, green, and smoke evidence identities. A binding failure names the expected binding, observed unavailable or mismatched binding, and unchanged pre-attempt count. Authored verification, review, and continual-learning tail Handoffs require `Methods: none`.

## Procedure

1. Recheck the Task Contract, parent outcome/revision, governing authority, owned criteria, declared dependency revisions, and every digest-bound unchanged-state/evidence reference. Fetch and compare exact referenced bytes before consumption; record stale, missing, mismatched, or conflicting authority/reference state instead of hiding or restating it.
   Recheck that Intent and Methods match their plan task unchanged, or for direct no-plan work match their exact derivation authority, and that the selected method was bound before `ready`.
2. Classify the attempt outcome, progress return class, and pre/post task state. Once output-producing reasoning, mutation, or an external effect may have begun, count the semantic attempt.
3. Compare the Task Contract's expected signal with the observed criterion or blocker delta. Name criteria advanced and unchanged, each exact blocker resolved or remaining, and any falsifiable hypothesis changed by authorized diagnostic evidence. For same-outcome repair, compare the unchanged parent acceptance/proof identities; require the repair-owner proposal, backend-frozen complete criterion action map, and verifier decision for every impacted-fresh or unaffected-reuse action; and carry the fresh repaired aggregate verdict. A `blocker-resolved` claim is consumable only when it maps the stable blocker/finding ID to the affected parent `AC-...` IDs or `affected AC: none` plus the exact fixed contract/consumer, exact target/caller/failure path, impacted proof recipe, expected result, and observed result on the repaired identity. A universal changed invariant also binds its finite current consumer/callsite map and proves every entry.
4. Record only the emitting role's exact target and criterion/finding-level delta. Deduplicate every available blocking criterion, authority conflict, and review finding ID within its role payload; reference unchanged artifacts, logs, measurements, receipts, manifests, or screenshots by exact URI and SHA-256 without pasting their bodies, transcripts, secrets, canonical documents, or stale reasoning. Never promote a finding, path, fixture, or consumer into a parent criterion.
5. State bounded choices, assumptions confirmed or disproved, route impact, terminal advisories and residual risk, partial effects, inherited attempt/repair and original-review state, and whether output is diagnostic-only or stale. For an eligible next-loop Handoff, add the exact five-line worth group and action/Close group below; ordinary Handoffs omit both groups. When a D03 checkpoint exists, reference only its authoritative plan URI, newest record identity, exact grant/opinion/disposition state, and same-plan resume condition; project non-success evidence into that plan record rather than duplicating its eight lines or creating another recovery envelope. A post-2/2 ask states `record: none` and carries its selected action once without synthesizing another record.
6. Name the next unmet criterion or terminal frontier and exactly one Task-Contract-eligible receiver with required preconditions. Route incomplete existing review lineages and directly evidenced repair-caused lineages to the backend when same-outcome repair remains eligible; route a disjoint outcome-relevant non-safety lineage as `authority-change-required` to the outcome authority without repair, verification restart, learning, approval, or completion; route serious safety to separate-authority intake; route exact authority conflicts to their authority owner; route proof-ceremony worth advice to at most one fresh read-only worker when the human selected Second opinion; and route eligible Close to backend terminal accounting. Advisory-only approval remains on the already-scheduled backend tail. A Handoff cannot grant authority or permissions absent from its Task Contract.
7. Emit one compact Common Handoff. The backend consumes it; siblings gain no ambient semantic state.

## Common Handoff

```markdown
# Handoff: <task name>
## Outcome
- Parent outcome and authority revision
- Owned acceptance criteria
- Task revision
- Intent: <short human sentence preserved unchanged>
- Methods: none | tdd
- Method binding: `none` and no method skill loaded | `tdd` → exact `dev-tdd` revision plus red, green, and smoke identities
- Pre-attempt method-binding failure: none | <expected binding → observed unavailable/mismatch; semantic attempt unchanged>
- Semantic attempt: <used>/<maximum for this Task Contract revision>
- Outcome class
- Progress return class: completed | proved | blocker-resolved | authority-change | no-progress-stop
- Emitting role
- Pre-task state → post-task state
- Exact produced/inspected target identity
## Authority checked
- Governing/dependency revisions used
- Stale, missing, or conflicting authority
## Bound references
- Role-local delta identity: <emitting role, exact target, and SHA-256>
- Unchanged authority/state/manifest/evidence: <semantic role → exact URI → SHA-256 → expected immutable revision>
- Reference validation: current | missing | stale | mismatched | contradictory; a non-current result blocks cold-start consumption
## Progress
- Criteria advanced
- Criteria unchanged
- Expected delta → observed delta
- Exact blocking criterion/conflict/finding IDs resolved or remaining, deduplicated
- Blocker-resolution closure: stable ID → affected `AC-...` → exact target/caller/failure path → impacted proof recipe → expected result → observed result on repaired identity
- Universal changed invariant → finite current consumer/callsite map → proof for every entry
- Same-outcome parent acceptance IDs and proof-recipe identities, unchanged
- Criterion action map: every criterion → impacted | unaffected → causal path/fixture/consumer → repair-owner proposal → backend-frozen fresh proof | exact evidence reuse → verifier accept | reject
- Fresh impacted or rejected-reuse results; accepted unaffected evidence identities and target-surface/environment/expectation/proof-method/fixture/dependency/evidence-integrity validity basis; fresh repaired aggregate verdict
- Review finding eligibility: stable ID → affected parent `AC-...` IDs | `affected AC: none` plus fixed contract/observable consumer → direct evidence
- Review lineage and admission: stable ID → violated contract/invariant → trigger and expected/observed predicate → observable consumer or affected parent `AC-...` → causal boundary → finite current consumers when applicable → originating target/evidence → existing incomplete | repair-caused with direct causal chain | disjoint non-outcome advisory | separate safety intake | disjoint outcome-relevant authority change
- Exact authority conflict and owner, or none
- Terminal advisories and residual-risk disposition
- Changed falsifiable hypothesis and evidence identity, if authorized
- Remaining stable IDs: <all stable IDs>
- Relation to OUT-...: outcome-blocking | proof-ceremony
- What already satisfies the goal: <affirmative exact-target evidence>
- Changed falsifiable hypothesis: <materially changed approach> | none
- Recommendation: continue-differently | independent check | close with residual
- Route impact: unchanged | changed
## Result
- Observable result
- Artifacts changed, produced, or inspected with exact identities
- Behavioral, contract, and external effects
- Human checkpoint action: none | Continue | Second opinion | Close
- Close disposition: not-selected | rejected | completed-with-residual | proof-reuse-reaccounted; exact target/evidence: <identity and references>
## Evidence
- Criterion → exact check/scenario → observed result
- Method evidence: selected value → exact authority/binding → none or red/green/smoke identities
- Role-local evidence delta and digest-bound unchanged evidence/log/artifact/receipt references
## Decisions and assumptions
- Bounded implementation choices
- Assumptions confirmed or disproved
- Next-loop eligibility/classification basis and selected-action authority, when applicable
## Convergence and recovery
- Inherited semantic attempts: <used>/2; attempt 3 forbidden on this outcome revision and derivatives inherit consumption
- Run-wide post-assurance repair: unused 1/1 | consumed 1/1 by <repair revision>
- Initial eligible review: not run | run once; review rerun: unused | consumed
- Newest same-plan exhaustion record: none | <authoritative plan URI and persisted record identity>; target/remaining: <exact identity and AC IDs / receiver>; grant: <pending | continue timestamp | second-opinion timestamp>; opinion/disposition: <absent | exact persisted line>
- Same-plan resume: <blocked-pending | blocked-opinion | same-owner-ready-after-gates | authority-change-required | no-progress-stop>
- Impacted smoke/verification and later-slot closure/impact review reruns required or observed; exact unaffected proof/review reuse identities
- Diagnostic-only, partial-effect, staleness, and preservation state
- Intent/Methods transfer: unchanged plan values | exact direct derivation authority; selected value and binding evidence preserved for the receiver
## Risks and unresolved items
- Blockers, failures, residual risks, required authority changes
- Close rejection reason or accepted residual risk with exact target/evidence, when applicable
## Next receiver
- Next unmet criterion or terminal frontier
- Exactly one eligible role/task
- Preconditions still required
- Method preconditions still required, or none; receiver must preserve Intent and Methods unchanged
- Selected-action receiver and eligibility preconditions, when applicable
```

A Handoff that advances no criterion, resolves no named blocker, changes no governing authority, and adds no authorized diagnostic evidence with a materially changed falsifiable hypothesis is `no-progress-stop`. It cannot authorize another semantic attempt or wave. Another audit, unchanged Handoff, inconclusive proof, repeated frontier, elapsed time, artifact/agent count, calendar/invocation count, or remaining local slot is not progress.

Planner/subplanner Handoffs add an applicable Executor Plan or child-graph revision, structural-validator evidence, acceptance accounting, dependency rationale, and gates. Worker Handoffs add changed artifacts, effects, exact-revision frozen-acceptance smoke for every attempt, choices, risks, and any split request; compact worker Handoffs map every owned criterion to deterministic exact-target smoke with expected/observed evidence and one completion receiver. Verifier Handoffs add exact boundary/target, backend-frozen action decisions, criterion evidence, fixtures, reproduction, fresh aggregate verdict, deduplicated blocking `AC-...` IDs, and every proved entry in any finite current consumer/callsite map. Integrator Handoffs add the parent `OUT-...`, affected `AC-...` IDs, inherited budget, every exact independently verified isolated input, conflict IDs, permitted resolutions, combined revision, and integrated smoke. Original-initial reviewer Handoffs add the exact verified final target, whole-scope verdict, and sealed predicate-bound lineages. Original-rerun and grant-scoped reviewer Handoffs add the prior receipt, remaining lineages, exact repair delta, accepted review impact map, affected/unchanged surfaces, finite consumers, exact unchanged-surface reuse identities, closure/impact verdict, and admission dispositions. Each blocking review finding maps to exact authority or `AC-...`, a changed surface or required existing consumer, and direct evidence. Curator Handoffs add `Methods: none`, the exact portable mode and result identity, exact reviewed standard/high-consequence target, `CURATED | NO DURABLE LEARNING | BLOCKED` outcome and seven-field payload, narrow guidance destination or exact current-contract blocker, exactly one receiver, and digest-bound current target and applicable-project-rule manifests, selected role slot, inherited counters, reached terminal stages, and artifact or receipt identities for cold-start, pause, or compaction recovery.

Worker Handoffs also state the human Intent, selected Methods, exact binding authority, and binding result. For `none`, state that no method skill loaded. For `tdd`, bind the exact `dev-tdd` revision and its red, green, and smoke identities for the same worker attempt. A method-binding failure is a pre-attempt blocked Handoff with no `ready`/`running` transition and no semantic attempt consumed. Verifier, reviewer, and curator Handoffs for an authored profile tail state `Methods: none` and no method skill loaded. Every receiver preserves Intent, Methods, and binding evidence unchanged; method selection never changes the Handoff receiver or adds another envelope.

For same-outcome repair, worker Handoffs add the frozen parent snapshot and repair-proposed complete impact map; the backend freezes one action for every parent criterion; verifier Handoffs add each independent action decision, every fresh impacted or rejected-reuse result, accepted unaffected reuse identity/basis, and fresh aggregate verdict over exactly the unchanged set. Reviewer Handoffs preserve sealed lineage identities, map each incomplete existing or directly evidenced repair-caused blocker to affected parent `AC-...` IDs or `affected AC: none` plus its fixed contract/consumer, and carry exact authority conflicts, disjoint outcome-relevant authority returns, separate safety intake, and terminal advisories. Consumer-only findings remain repair-smoke and later closure/impact-review obligations rather than new criteria.

## Non-success recovery payload

For every non-success, additionally fill the Common Handoff with:

- failure outcome/class and pre/post task state;
- inherited semantic attempt count out of two, run-wide post-assurance repair state and consuming revision, and any pre-semantic retry count;
- human Intent, selected Methods, exact binding authority, and `none` evidence or the unavailable/mismatched binding that blocked before `ready` with no semantic attempt consumed;
- exact base/current/partial revisions, last criterion or blocker progress, running effects, and termination certainty;
- exact deduplicated blocking criterion/conflict/finding IDs;
- frozen parent acceptance/proof identities, complete criterion impact map, fresh impacted results, reused unaffected evidence identities and validity bases, and repaired aggregate verdict when applicable;
- eligible blocker mapping, exact authority conflict, and terminal advisories with their one receiver;
- symptom, feedback scenario, reproduction rate, hypotheses, and probes;
- idempotence, diagnostic-only status, preservation, and staleness;
- quarantined or continuing descendants and integration impact;
- retry eligibility, materially changed hypothesis/approach, freshness needs, and capability rationale; and
- required owner action, impacted smoke/proof/review scope, original initial-review/rerun state, newest authoritative-plan exhaustion record reference and current grant/opinion state if any, or explicit post-2/2 `record: none`; the five worth-frame fields, selected human action, Close disposition, exact target/evidence/residual risk, next unmet criterion, one eligible receiver, and the exact same-plan resume condition when a next-loop ask is eligible.

Partial, failed, timed-out, cancelled, stale, or interrupted output is diagnostic only until a new authorized revision satisfies its full required proof. `no-progress-stop`, a repeated frontier, an unchanged hypothesis, inconclusive proof, exhausted two-attempt budget, a remaining outcome-blocking ID after repair, or a consumed run-wide repair token has no automatic retry eligibility and cannot reset the lifecycle. For standard/high-consequence D03 only, the newest eligible record on the executing plan's same authoritative file is the sole continuation input: `pending`, a stale target, and `second-opinion` with absent opinion block; `continue` or a current `same-route` opinion may return the same owner to ordinary readiness gates; `authority-change` and `no-progress` remain terminal for that grant. Close does not mutate the record and becomes terminal only through matching exact-target goal-satisfaction/residual accounting. An otherwise-eligible post-2/2 ask uses no record and may carry only its current selected action into one same-plan revision. The Common Handoff references the record or explicit no-record boundary and one receiver; it never supplies a grant, rewrites history, or creates a second recovery contract.

## Stop and next owner

Stop on missing immutable identity, secret-bearing evidence, ambiguous external effects, unresolved authority, stale/unsafe/contradictory/inconclusive worth input, an ineligible or multiple receiver, a missing/stale/mismatched digest-bound reference, an incomplete same-outcome parent snapshot or backend-frozen impact action map, invalid evidence reuse, or any attempt to restore consumed budget. Compact criterion-complete smoke is terminal after the backend validates its in-conversation Common Handoff; compact never receives a worth frame, opinion, Close, review, or curation, and a mutating Learning Candidate is deferred. Outcome-blocking Close and Continue with no changed hypothesis are rejected without mutation. Incomplete existing lineages and directly evidenced repair-caused lineages return to `dev-implementation` when eligible; a disjoint outcome-relevant non-safety lineage returns `authority-change-required` to outcome authority; serious safety returns separate-authority intake; an exact authority conflict returns to its owner; advisory-only approval returns to the already-scheduled backend tail without assurance replay or maintenance dispatch; eligible proof-ceremony Close returns to backend completion accounting. `CURATED` and `NO DURABLE LEARNING` are terminal for eligible standard/high-consequence assessment. Curator `BLOCKED` names the exact current-contract conflict or missing authority and cannot begin an audit loop. Return the Common Handoff to `dev-implementation` or the current lifecycle owner; never dispatch, retry, integrate, review, curate, maintain, or complete work inside this skill.
