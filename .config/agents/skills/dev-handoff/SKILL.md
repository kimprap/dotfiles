---
name: dev-handoff
description: >
  Package revision-bound task results, evidence, blockers, and recovery state for
  transfer to a named next owner. Use when ownership or context changes, recovery
  must survive a context boundary, or any attempt ends; skip ambient status notes
  and never duplicate canonical authority or expand the receiver's permissions.
---

# Engineering Handoff

Own the one structured transfer emitted by every semantic attempt, including non-success. Link canonical authority; do not rewrite it.

## Intake

Require the exact Task Contract revision, attempt number, role, governing and dependency revisions, produced or inspected target identity, observed evidence, and named eligible receiver. A stale or missing revision makes the attempt non-consumable.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`.

## Procedure

1. Recheck the Task Contract, governing authority, and declared dependency revisions. Record stale, missing, or conflicting authority instead of hiding it.
2. Classify the attempt outcome and pre/post task state. Once output-producing reasoning, mutation, or an external effect may have begun, count the semantic attempt.
3. Record only observable results and criterion-level evidence. Link artifacts, logs, measurements, or screenshots; do not paste transcripts, secrets, or canonical documents.
4. State bounded implementation decisions, assumptions confirmed or disproved, residual risk, partial effects, and whether any output is diagnostic-only or stale.
5. Name one allowed next receiver and every precondition still required. A Handoff cannot grant authority absent from the Task Contract.
6. Emit one compact Handoff. The backend consumes it; sibling roles do not gain ambient semantic state.

## Common Handoff

```markdown
# Handoff: <task name>
## Outcome
- Task revision
- Attempt
- Outcome class
- Emitting role
- Pre-task state → post-task state
- Exact produced/inspected revision
## Authority checked
- Governing/dependency revisions used
- Stale, missing, or conflicting authority
## Result
- Observable result
- Artifacts changed, produced, or inspected
- Behavioral/contract effects
## Evidence
- Criterion → exact check/scenario → observed result
- Evidence/log/artifact references
## Decisions and assumptions
- Bounded implementation choices
- Assumptions confirmed or disproved
## Risks and unresolved items
- Blockers, failures, residual risks, required authority changes
## Next receiver
- Role/task allowed to consume this handoff
- Preconditions still required
```

Planner/subplanner Handoffs add graph or child revisions, acceptance accounting, dependency rationale, and gates. Worker Handoffs add changed artifacts, effect, implementer smoke, choices, risks, and any split request. Verifier Handoffs add exact target, criterion evidence, fixtures, reproduction, and verdict. Integrator Handoffs add every input, conflict, permitted resolution, combined revision, and integrated smoke. Reviewer Handoffs add the exact reviewed target and `APPROVED | CHANGES REQUIRED | INCONCLUSIVE` verdict with findings. Curator Handoffs add the exact reviewed target and `CURATED | NO DURABLE LEARNING | BLOCKED` outcome with the narrow guidance destination or blocker.

## Non-success recovery payload

For every non-success, additionally record:

- failure outcome/class and pre/post task state;
- semantic attempt count/maximum and any pre-semantic retry count;
- exact base/current/partial revisions, last progress, running effects, and termination certainty;
- symptom, feedback scenario, reproduction rate, hypotheses, and probes;
- idempotence, diagnostic-only status, preservation, and staleness;
- quarantined or continuing descendants and integration impact;
- retry eligibility, changed hypothesis/approach, freshness needs, and capability rationale; and
- required owner action plus the exact resume condition.

Partial, failed, timed-out, cancelled, stale, or interrupted output is diagnostic only until a new authorized revision is fully verified.

## Stop and next owner

Stop on missing immutable identity, secret-bearing evidence, ambiguous external effects, unresolved authority, or an ineligible receiver. Return the Handoff to `dev-implementation` or the current lifecycle owner; never dispatch, retry, integrate, review, or complete work inside this skill.
