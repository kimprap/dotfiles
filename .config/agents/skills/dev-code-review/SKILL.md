---
name: dev-code-review
description: >
  Review one exact independently verified target against repository standards and
  its governing specification. Use after required verification and integration;
  skip unverified or moving targets, report findings without repair, and never
  combine review with shipping or substitute prose for observed evidence.
---

# Engineering Code Review

Own the final read-only Standards and Specification verdict for one immutable verified target.

## Intake

Require the exact target identity, current verification Handoff and criterion evidence, governing requirements/specification/ticket revisions, applicable project rules, and integration Handoff when fan-in occurred.

Reject stale, partial, unverified, moving, or unnamed targets. A review request cannot authorize repair or shipping.

## Procedure

1. Recheck all authority, target, verification, and integration identities. If any changed, return `INCONCLUSIVE` and require renewed proof.
2. Review **Standards** independently: correctness, security, privacy, data-loss/regression risk, project rules, maintainability required by those rules, and evidence completeness.
3. Review **Specification** independently: every governing requirement, acceptance criterion, interface, migration, constraint, non-goal, and approved scope boundary.
4. Classify each finding as blocking or advisory. Point to exact target paths, governing authority, and evidence; do not repair.
5. Emit the three axes below against the same immutable target. A failing or inconclusive axis cannot yield approval.
6. Return blocking findings to the backend for a new owner-authorized task. Advisories remain explicit residual risk unless accepted into scope by the proper authority.

## Verdict

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

`APPROVED` requires both axes `PASS`. Any axis `FAIL` yields `CHANGES REQUIRED`; any axis `INCONCLUSIVE` yields overall `INCONCLUSIVE` unless another axis already establishes a blocking failure.

## Finding policy

Blocking findings include specification nonconformance; correctness, security, privacy, data-loss, or regression risk; violated project rules; stale, unverified, incomplete, or contradictory evidence; and unauthorized scope or destructive behavior.

Advisories are nonrequired naming, style, maintainability, or future improvements that do not threaten the contract. They cannot mask a blocker or silently expand scope.

One fresh non-implementer may verify and review low-risk single-lineage work only with separate evidence and review outputs. High-consequence, integrated, broad, ambiguous, previously failed, bias-prone, or explicitly required work uses separate decorrelated attempts.

## Review Handoff

Use the common Handoff and add the exact target, authority and evidence identities, both axis verdicts, overall verdict, blocking findings, advisories, residual risk, and next owner. Do not edit, reformat, stage, merge, ship, or declare the run complete.

## Stop and next owner

Stop for stale or insufficient proof, unavailable governing authority, or a changed target. Return `CHANGES REQUIRED` findings to `dev-implementation`, `INCONCLUSIVE` proof gaps to the evidence owner, and `APPROVED` only to the backend for terminal curation and completion accounting.
