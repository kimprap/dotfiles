---
name: dev-handoff
description: >
  Package revision-bound task results, evidence, blockers, and recovery state for
  transfer to a named next owner. Use when ownership or context changes, recovery
  must survive a context boundary, or any attempt ends; skip ambient status notes
  and never duplicate canonical authority or expand the receiver's permissions.
---

# Engineering Handoff

Own the one Common Handoff emitted by every semantic attempt, including non-success. Extend this envelope for role-specific evidence; never create a second result or recovery envelope. Link canonical authority rather than copying it.

## Intake

Require the exact parent `OUT-...` ID and authority revision, Task Contract revision, owned `AC-...` IDs, expected progress signal, current frontier, inherited two-attempt semantic budget and run-wide post-assurance repair token, attempt number, role, governing and dependency revisions, exact produced or inspected target identity, observed evidence, and exactly one eligible receiver. The repair field is exact: `unused 1/1` or `consumed 1/1` plus the consuming repair revision when consumed. For a standard/high-consequence human checkpoint, also require the executing plan's authoritative URI and unchanged Datetime/slug, the newest persisted exhaustion record identity, target and remaining criteria/receiver, exact grant/opinion/disposition state, and original initial-review/rerun counters. A derivative revision inherits attempts, repair state, counters, and any current grant identity. A stale or missing revision or record makes the attempt non-consumable.

For a same-outcome repair, carry the unchanged parent acceptance and proof-recipe identities, the complete criterion impact map, every fresh impacted result, every reused unaffected evidence identity and validity basis, and the repaired aggregate verdict. Also require every criterion's impacted/unaffected classification, causal path/fixture/consumer, fresh/reuse action, each eligible blocker mapping to affected parent `AC-...` IDs or `affected AC: none` plus its fixed contract/consumer, any exact authority conflict, and terminal advisories.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`. Progress return classes are exactly `completed`, `proved`, `blocker-resolved`, `authority-change`, and `no-progress-stop`; they do not replace the attempt outcome.

## Procedure

1. Recheck the Task Contract, parent outcome/revision, governing authority, owned criteria, and declared dependency revisions. Record stale, missing, or conflicting authority instead of hiding it.
2. Classify the attempt outcome, progress return class, and pre/post task state. Once output-producing reasoning, mutation, or an external effect may have begun, count the semantic attempt.
3. Compare the Task Contract's expected signal with the observed criterion or blocker delta. Name criteria advanced and unchanged, each exact blocker resolved or remaining, and any falsifiable hypothesis changed by authorized diagnostic evidence. For same-outcome repair, compare the unchanged parent acceptance/proof identities, require a complete impacted/unaffected map with causal path/fixture/consumer and fresh/reuse action, and carry the repaired aggregate verdict. A `blocker-resolved` claim is consumable only when it maps the stable blocker/finding ID to the affected parent `AC-...` IDs or `affected AC: none` plus the exact fixed contract/consumer, exact target/caller/failure path, impacted proof recipe, expected result, and observed result on the repaired identity. A universal changed invariant also binds its finite current consumer/callsite map and proves every entry.
4. Record only exact target and criterion/finding-level evidence. Deduplicate every available blocking criterion, authority conflict, and review finding ID within its role payload; link artifacts, logs, measurements, or screenshots without pasting transcripts, secrets, canonical documents, or stale reasoning. Never promote a finding, path, fixture, or consumer into a parent criterion.
5. State bounded choices, assumptions confirmed or disproved, route impact, terminal advisories and residual risk, partial effects, inherited attempt/repair and original-review state, and whether output is diagnostic-only or stale. When a checkpoint exists, reference only its authoritative plan URI, newest record identity, exact grant/opinion/disposition state, and same-plan resume condition; project non-success evidence into that plan record rather than duplicating its eight lines or creating another recovery envelope.
6. Name the next unmet criterion or terminal frontier and exactly one Task-Contract-eligible receiver with required preconditions. Route eligible blockers to the backend, exact authority conflicts to their authority owner, and advisory-only approval to the already-scheduled backend tail. A Handoff cannot grant authority or permissions absent from its Task Contract.
7. Emit one compact Common Handoff. The backend consumes it; siblings gain no ambient semantic state.

## Common Handoff

```markdown
# Handoff: <task name>
## Outcome
- Parent outcome and authority revision
- Owned acceptance criteria
- Task revision
- Semantic attempt: <used>/<maximum for this Task Contract revision>
- Outcome class
- Progress return class: completed | proved | blocker-resolved | authority-change | no-progress-stop
- Emitting role
- Pre-task state → post-task state
- Exact produced/inspected target identity
## Authority checked
- Governing/dependency revisions used
- Stale, missing, or conflicting authority
## Progress
- Criteria advanced
- Criteria unchanged
- Expected delta → observed delta
- Exact blocking criterion/conflict/finding IDs resolved or remaining, deduplicated
- Blocker-resolution closure: stable ID → affected `AC-...` → exact target/caller/failure path → impacted proof recipe → expected result → observed result on repaired identity
- Universal changed invariant → finite current consumer/callsite map → proof for every entry
- Same-outcome parent acceptance IDs and proof-recipe identities, unchanged
- Criterion impact map: every criterion → impacted | unaffected → causal path/fixture/consumer → fresh proof | validated evidence reuse
- Fresh impacted results; reused unaffected evidence identities and target-surface/environment/expectation/proof-method/fixture/dependency/evidence-integrity validity basis; repaired aggregate verdict
- Review finding eligibility: stable ID → affected parent `AC-...` IDs | `affected AC: none` plus fixed contract/observable consumer → direct evidence
- Exact authority conflict and owner, or none
- Terminal advisories and residual-risk disposition
- Changed falsifiable hypothesis and evidence identity, if authorized
- Route impact: unchanged | changed
## Result
- Observable result
- Artifacts changed, produced, or inspected with exact identities
- Behavioral, contract, and external effects
## Evidence
- Criterion → exact check/scenario → observed result
- Evidence/log/artifact references
## Decisions and assumptions
- Bounded implementation choices
- Assumptions confirmed or disproved
## Convergence and recovery
- Inherited semantic attempts: <used>/2; attempt 3 forbidden on this outcome revision and derivatives inherit consumption
- Run-wide post-assurance repair: unused 1/1 | consumed 1/1 by <repair revision>
- Initial eligible review: not run | run once; review rerun: unused | consumed
- Newest same-plan exhaustion record: none | <authoritative plan URI and persisted record identity>; target/remaining: <exact identity and AC IDs / receiver>; grant: <pending | continue timestamp | second-opinion timestamp>; opinion/disposition: <absent | exact persisted line>
- Same-plan resume: <blocked-pending | blocked-opinion | same-owner-ready-after-gates | authority-change-required | no-progress-stop>
- Impacted smoke/verification/review reruns required or observed
- Diagnostic-only, partial-effect, staleness, and preservation state
## Risks and unresolved items
- Blockers, failures, residual risks, required authority changes
## Next receiver
- Next unmet criterion or terminal frontier
- Exactly one eligible role/task
- Preconditions still required
```

A Handoff that advances no criterion, resolves no named blocker, changes no governing authority, and adds no authorized diagnostic evidence with a materially changed falsifiable hypothesis is `no-progress-stop`. It cannot authorize another semantic attempt or wave. Another audit, unchanged Handoff, inconclusive proof, repeated frontier, elapsed time, artifact/agent count, calendar/invocation count, or remaining local slot is not progress.

Planner/subplanner Handoffs add an applicable Executor Plan or child-graph revision, structural-validator evidence, acceptance accounting, dependency rationale, and gates. Worker Handoffs add changed artifacts, effects, exact-revision implementer smoke for every attempt, choices, risks, and any split request; compact worker Handoffs map every owned criterion to deterministic exact-target smoke with expected/observed evidence and one completion receiver. Verifier Handoffs add exact boundary/target, criterion evidence, fixtures, reproduction, aggregate verdict, deduplicated blocking `AC-...` IDs, and every proved entry in any finite current consumer/callsite map. Integrator Handoffs add the parent `OUT-...`, affected `AC-...` IDs, inherited budget, every exact independently verified isolated input, conflict IDs, permitted resolutions, combined revision, and integrated smoke. Reviewer Handoffs add the exact verified final target, initial-pass or rerun identity, `APPROVED | CHANGES REQUIRED | INCONCLUSIVE` verdict, deduplicated eligible blocking finding IDs, causal no-effect boundary, and terminal advisories. Each blocking review finding maps to exact authority or `AC-...`, a changed surface or required existing consumer, and direct evidence. Curator Handoffs add the exact reviewed standard/high-consequence target and `CURATED | NO DURABLE LEARNING | BLOCKED` outcome with the narrow guidance destination or exact current-contract blocker.

For same-outcome repair, worker Handoffs add the frozen parent snapshot and complete impact map; verifier Handoffs add every fresh impacted result, validated unaffected reuse identity/basis, and aggregate verdict over exactly the unchanged set; reviewer Handoffs map each eligible blocker to affected parent `AC-...` IDs or `affected AC: none` plus its fixed contract/consumer, and carry exact authority conflicts and terminal advisories. Consumer-only findings remain repair-smoke and fresh-review obligations rather than new criteria.

## Non-success recovery payload

For every non-success, additionally fill the Common Handoff with:

- failure outcome/class and pre/post task state;
- inherited semantic attempt count out of two, run-wide post-assurance repair state and consuming revision, and any pre-semantic retry count;
- exact base/current/partial revisions, last criterion or blocker progress, running effects, and termination certainty;
- exact deduplicated blocking criterion/conflict/finding IDs;
- frozen parent acceptance/proof identities, complete criterion impact map, fresh impacted results, reused unaffected evidence identities and validity bases, and repaired aggregate verdict when applicable;
- eligible blocker mapping, exact authority conflict, and terminal advisories with their one receiver;
- symptom, feedback scenario, reproduction rate, hypotheses, and probes;
- idempotence, diagnostic-only status, preservation, and staleness;
- quarantined or continuing descendants and integration impact;
- retry eligibility, materially changed hypothesis/approach, freshness needs, and capability rationale; and
- required owner action, impacted smoke/proof/review scope, original initial-review/rerun state, newest authoritative-plan exhaustion record reference and current grant/opinion state if any, next unmet criterion, one eligible receiver, and the exact same-plan resume condition.

Partial, failed, timed-out, cancelled, stale, or interrupted output is diagnostic only until a new authorized revision satisfies its full required proof. `no-progress-stop`, a repeated frontier, an unchanged hypothesis, inconclusive proof, exhausted two-attempt budget, a remaining blocker after repair, or a consumed run-wide repair token has no automatic retry eligibility and cannot reset the lifecycle. For standard/high-consequence work only, the newest eligible record on the executing plan's same authoritative file is the sole continuation input: `pending`, a stale target, and `second-opinion` with absent opinion block; `continue` or a current `same-route` opinion may return the same owner to ordinary readiness gates; `authority-change` and `no-progress` remain terminal for that grant. The Common Handoff references the record and one receiver; it never supplies a grant, rewrites history, or creates a second recovery contract.

## Stop and next owner

Stop on missing immutable identity, secret-bearing evidence, ambiguous external effects, unresolved authority, an ineligible or multiple receiver, an incomplete same-outcome parent snapshot or impact map, invalid evidence reuse, or any attempt to restore consumed budget. Compact criterion-complete smoke is terminal after the backend validates its in-conversation Common Handoff; compact never dispatches review or curation, and a mutating Learning Candidate is deferred. Eligible blockers return to `dev-implementation`; an exact authority conflict returns to its authority owner; advisory-only approval returns to the already-scheduled backend tail without assurance replay or maintenance dispatch. `CURATED` and `NO DURABLE LEARNING` are terminal for eligible standard/high-consequence assessment. Curator `BLOCKED` names the exact current-contract conflict or missing authority and cannot begin an audit loop. Return the Common Handoff to `dev-implementation` or the current lifecycle owner; never dispatch, retry, integrate, review, curate, maintain, or complete work inside this skill.
