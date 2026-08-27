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

Require the exact parent `OUT-...` and authority revision; Task Contract revision; human Intent; selected `Methods`; owned `AC-...`; expected progress signal; current frontier; inherited two-attempt budget and run-wide post-assurance repair token; attempt, child, task, and role identities; governing and dependency revisions; exact before/current target identities; observed evidence; and exactly one eligible receiver. Repair state is `unused 1/1` or `consumed 1/1 by <repair revision>`.

When a human-authorized continuation exists, require its exact receipt identity and materially changed falsifiable hypothesis. The receipt binds the active plan and target identities, blocked task, remaining criteria, authorizer/time, cycle, and inherited repair-token state. Without that receipt, attempt exhaustion, bare continue, elapsed time, another opinion, or an unchanged hypothesis changes no state.

For plan-backed work, require the bounded existing Context Pack, unchanged Task Contract and proof recipes, exact target/effect ownership, declared dependency Handoffs, private-reference identities, attempt and repair-token state, applicable continuation receipt, bounded environment facts, and native artifact locators. Exclude transcripts, broad repository summaries, unrelated files, and another result envelope.

When authority, manifest, state, or evidence is unchanged, use one digest-bound reference per item and omit its body. Each reference names exact URI, SHA-256, semantic role, and expected immutable revision. Missing, unreadable, stale, mismatched, contradictory, or body-duplicated reference state makes the Handoff non-consumable.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`. Progress return classes are exactly `completed`, `proved`, `blocker-resolved`, `authority-change`, and `no-progress-stop`.

## Procedure

1. Recheck the Task Contract, parent outcome and authority, owned criteria, declared dependencies, target/effect boundary, applicable project-rule and target manifests, and every digest-bound reference.
2. Recheck that Intent and Methods match the parser-valid plan task unchanged, or for direct no-plan work match their exact derivation authority. A `tdd` binding names the exact `dev-tdd` revision plus red, green, and smoke identities; `none` states that no method skill loaded. A pre-ready binding failure consumes no semantic attempt.
3. Classify attempt outcome, progress class, and pre/post task state. Once output-producing reasoning, mutation, or an external effect may have begun, count the semantic attempt.
4. Compare expected and observed criterion or blocker delta. A `blocker-resolved` claim maps each stable ID to affected `AC-...`, exact target/caller/failure path, impacted proof recipe, expected result, and observed result on the repaired identity. A universal invariant also proves every entry in its finite current consumer map.
5. Record only the emitting role's target and criterion/finding delta. Deduplicate blocking criteria, authority conflicts, and review findings. Reference artifacts, receipts, logs, and screenshots by immutable locator and digest; never paste transcripts, secrets, canonical documents, or stale reasoning.
6. Record choices, assumptions, route impact, terminal advisories, residual risk, partial effects, inherited attempt/repair/review state, and any applicable continuation receipt. Name the next unmet criterion or terminal frontier and exactly one eligible receiver.
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
- Method binding: <none and no method skill | exact dev-tdd revision and red/green/smoke identities>
- Semantic attempt: <used>/<maximum for this Task Contract revision>
- Outcome class
- Progress return class: completed | proved | blocker-resolved | authority-change | no-progress-stop
- Child/task/attempt identity
- Emitting role
- Pre-task state → post-task state
- Exact before/current produced or inspected target identities
## Authority checked
- Governing and dependency revisions
- Stale, missing, or conflicting authority
## Bound references
- Role-local delta identity: <role, exact target, SHA-256>
- Unchanged authority/state/manifest/evidence: <role → URI → SHA-256 → immutable revision>
- Reference validation: current | missing | stale | mismatched | contradictory
- Proof recipes: <every owned AC → exact complete surface-proof-recipe/v1 identity and target/environment/proof/adapter/fixture/dependency/comparison/finite-consumer fields>
- Surface readiness and final surface evidence, or no adapter
## Progress
- Criteria advanced and unchanged
- Expected delta → observed delta
- Blocking criterion/conflict/finding IDs resolved or remaining
- Blocker-resolution closure and finite current consumer proof
- Same-outcome parent acceptance and proof-recipe identities, unchanged
- Criterion action map and fresh/reused verifier evidence when applicable
- Review lineage/admission, authority conflict, advisories, and residual-risk disposition
- Changed falsifiable hypothesis and evidence identity, if authorized
- Route impact: unchanged | changed
## Worker closure
- worker-closure/v1: <reference URI and SHA-256>
- Candidate-before and final target identities
- Round count: 1 | 2
- Finding IDs, corrections, and dispositions
- Final task-local smoke evidence
- Remaining closure blocker, or none
## Permanent-test value
- test-value/v1: <reference URI and SHA-256>
- Changed tests: <one row per test: path selector; unique observable contract/regression/invariant; plausible unique bug; public seam; independent oracle; keep|merge|remove; evidence>
- No changed tests: <closest existing coverage and why no uncovered contract exists | concrete no-new-contract basis>
## Result
- Observable result
- Artifacts changed, produced, or inspected with exact identities
- Behavioral, contract, and external effects
## Evidence
- Criterion → exact check/scenario → expected and observed result
- Role-local evidence and digest-bound unchanged references
## Decisions and assumptions
- Bounded implementation choices
- Assumptions confirmed or disproved
## Convergence and recovery
- Inherited semantic attempts: <used>/2; attempt 3 forbidden
- Run-wide post-assurance repair: unused 1/1 | consumed 1/1 by <repair revision>
- Initial review: not run | run; repaired-target review: not required | required | run
- Continuation receipt: none | <exact identity, changed hypothesis, cycle, inherited repair state>
- Same-plan resume: blocked | fresh-attempt-cycle-ready | authority-change-required | no-progress-stop
- Diagnostic-only, partial-effect, staleness, and preservation state
- Intent/Methods transfer and binding evidence
## Papercut accounting
- Post-Handoff soft look state: pending from this child
- Receipt order: seal this immutable Handoff before the separate compact papercut result
- Root fallback policy: permitted only when this child's post-Handoff action is unavailable
- Deterministic work-Handoff order key
## Risks and unresolved items
- Blockers, failures, residual risks, required authority changes
## Next receiver
- Next unmet criterion or terminal frontier
- Exactly one eligible role/task
- Preconditions and unchanged Intent/Methods
```

Worker Handoffs require the exact child and attempt identity, before/after target identity, task outcome, `worker-closure/v1` identity and rounds, findings/corrections/dispositions, task-local smoke, permanent-test value accounting, applicable continuation receipt, and papercut-accounting state. Work attempt one, eligible attempt two, and admitted Build repair use worker closure. Verification, neutral integration, review, learning, audit controller, and audit opinion Handoffs omit the Worker closure section as inapplicable and never run closure.

For same-outcome repair, carry the unchanged parent acceptance/proof identities, repair-owner proposed complete impact map, backend-frozen action for every criterion, verifier decision for every fresh-proof or unaffected-reuse action, fresh repaired aggregate verdict, review-lineage closure, and exact repair delta. A repaired canonical projection reruns its last projection owner.

Planner Handoffs add the applicable plan revision and validator evidence. Verifier Handoffs add fresh criterion proof and aggregate verdict. Integrator Handoffs add every named verified input and neutral combined identity. Reviewer Handoffs add Standards/Specification axes, sealed lineages, test-value dispositions, and aggregate verdict. Curator Handoffs add only the portable learning result and exact receiver.

## Non-success recovery payload

For every non-success also fill failure outcome and state; inherited attempt/repair state; exact base/current/partial revisions; last criterion or blocker progress; running effects and termination certainty; deduplicated blocker/conflict/finding IDs; repair impact/reuse evidence when applicable; symptom, scenario, hypotheses, and probes; preservation and staleness; quarantined descendants and integration impact; retry eligibility and materially changed hypothesis; applicable continuation receipt or `none`; exact remaining frontier; one receiver; and required proof/review reruns.

Partial, failed, timed-out, cancelled, stale, or interrupted output remains diagnostic until a new authorized revision satisfies full proof. A repeated frontier, unchanged hypothesis, inconclusive proof, exhausted two-attempt budget, remaining blocker after the repair, or consumed run-wide repair token has no automatic retry eligibility. Only an explicit human authorization naming the active plan and a materially changed falsifiable hypothesis may create the continuation receipt and fresh attempt-one/two cycle.

## Stop and next owner

Stop on missing immutable identity, secret-bearing evidence, ambiguous external effects, unresolved or contradictory authority, unsafe partial effects, ineligible or multiple receivers, stale references, incomplete repair maps, invalid evidence reuse, or any attempt to restore consumed budget. Compact criterion-complete smoke is terminal after backend validation and receives no independent assurance tail. Plan-backed compact still runs as child-owned full orchestration and remains tail-free. Incomplete existing review lineages and directly evidenced repair-caused lineages may use the one eligible repair; disjoint outcome-relevant findings return `authority-change-required`; serious safety returns separate-authority intake; terminal advisories remain residual.

A Handoff that advances no criterion, resolves no named blocker, changes no governing authority, and adds no authorized diagnostic evidence with a materially changed falsifiable hypothesis is `no-progress-stop`. Another audit, unchanged Handoff, repeated frontier, elapsed time, artifact count, agent count, or remaining local slot is not progress.
