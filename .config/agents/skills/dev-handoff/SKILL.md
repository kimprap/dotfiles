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

Require the exact parent `OUT-...` ID and authority revision, Task Contract revision, owned `AC-...` IDs, expected progress signal, current frontier, inherited semantic-attempt budget and run-wide post-assurance repair token, attempt number, role, governing and dependency revisions, exact produced or inspected target identity, observed evidence, and exactly one eligible receiver. The repair field is exact: `unused 1/1` or `consumed 1/1` plus the consuming repair revision when consumed. A derivative revision inherits that state and cannot restore the token. A stale or missing revision makes the attempt non-consumable.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`. Progress return classes are exactly `completed`, `proved`, `blocker-resolved`, `authority-change`, and `no-progress-stop`; they do not replace the attempt outcome.

## Procedure

1. Recheck the Task Contract, parent outcome/revision, governing authority, owned criteria, and declared dependency revisions. Record stale, missing, or conflicting authority instead of hiding it.
2. Classify the attempt outcome, progress return class, and pre/post task state. Once output-producing reasoning, mutation, or an external effect may have begun, count the semantic attempt.
3. Compare the Task Contract's expected signal with the observed criterion or blocker delta. Name criteria advanced and unchanged, each exact blocker resolved or remaining, and any falsifiable hypothesis changed by authorized diagnostic evidence.
4. Record only exact target and criterion/finding-level evidence. Deduplicate every available blocking criterion, conflict, and review finding ID within its role payload; link artifacts, logs, measurements, or screenshots without pasting transcripts, secrets, canonical documents, or stale reasoning.
5. State bounded choices, assumptions confirmed or disproved, route impact, residual risk, partial effects, inherited attempt/repair state, whether output is diagnostic-only or stale, and whether an initial eligible review already ran.
6. Name the next unmet criterion and exactly one Task-Contract-eligible receiver with required preconditions. A Handoff cannot grant authority or permissions absent from its Task Contract.
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
- Inherited semantic attempts: <used>/<maximum>; no fourth attempt on this revision
- Run-wide post-assurance repair: unused 1/1 | consumed 1/1 by <repair revision>
- Initial eligible review: not run | run once; review rerun: unused | consumed
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

Planner/subplanner Handoffs add Executor Plan or child-graph revision, structural-validator evidence, acceptance accounting, dependency rationale, and gates. Worker Handoffs add changed artifacts, effects, exact-revision implementer smoke for every attempt, choices, risks, and any split request. Verifier Handoffs add exact boundary/target, criterion evidence, fixtures, reproduction, aggregate verdict, and deduplicated blocking `AC-...` IDs. Integrator Handoffs add the parent `OUT-...`, affected `AC-...` IDs, inherited budget, every exact independently verified isolated input, conflict IDs, permitted resolutions, combined revision, and integrated smoke. Reviewer Handoffs add the exact verified final target, initial-pass or rerun identity, `APPROVED | CHANGES REQUIRED | INCONCLUSIVE` verdict, deduplicated blocking finding IDs, and terminal advisories. Curator Handoffs add the exact reviewed target and `CURATED | NO DURABLE LEARNING | BLOCKED` outcome with the narrow guidance destination or exact current-contract blocker.

## Non-success recovery payload

For every non-success, additionally fill the Common Handoff with:

- failure outcome/class and pre/post task state;
- inherited semantic attempt count/maximum, run-wide post-assurance repair state and consuming revision, and any pre-semantic retry count;
- exact base/current/partial revisions, last criterion or blocker progress, running effects, and termination certainty;
- exact deduplicated blocking criterion/conflict/finding IDs;
- symptom, feedback scenario, reproduction rate, hypotheses, and probes;
- idempotence, diagnostic-only status, preservation, and staleness;
- quarantined or continuing descendants and integration impact;
- retry eligibility, materially changed hypothesis/approach, freshness needs, and capability rationale; and
- required owner action, impacted smoke/proof/review scope, initial review/rerun state, next unmet criterion, one eligible receiver, and the exact resume condition.

Partial, failed, timed-out, cancelled, stale, or interrupted output is diagnostic only until a new authorized revision is fully verified. `no-progress-stop`, a repeated frontier, an unchanged hypothesis, inconclusive proof, exhausted local attempts, a remaining blocker after repair, or a consumed run-wide repair token has no retry eligibility and cannot reset the lifecycle.

## Stop and next owner

Stop on missing immutable identity, secret-bearing evidence, ambiguous external effects, unresolved authority, an ineligible or multiple receiver, or any attempt to restore consumed budget. `CURATED`, `NO DURABLE LEARNING`, and compact `curation not triggered` are terminal. Curator `BLOCKED` names the exact current-contract conflict or missing authority and cannot begin an audit loop. Return the Common Handoff to `dev-implementation` or the current lifecycle owner; never dispatch, retry, integrate, review, curate, or complete work inside this skill.
