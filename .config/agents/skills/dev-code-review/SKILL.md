---
name: dev-code-review
description: >
  Review one exact independently verified target against repository standards,
  governing specification, and immutable assurance profile. Use after required
  verification and integration; skip unverified or moving targets, report
  findings without repair, and never combine review with shipping or substitute
  prose for observed evidence.
---

# Engineering Code Review

Own the final read-only Standards and Specification verdict for one immutable verified target under its immutable assurance profile.

## Intake

Require the exact target identity, current verification Handoff and criterion evidence, immutable assurance profile and arrangement, verifier identity, governing requirements/specification/ticket revisions, immutable applicable-project-rule manifest with canonical artifacts, exact revisions, and scope—or backend-bound `none` with its bounded check—and integration Handoff when fan-in occurred.

Return `INCONCLUSIVE` for a stale, partial, unverified, moving, or unnamed target, or an absent or contradictory project-rule manifest. A review request cannot authorize repair or shipping.

## Procedure
1. Recheck all authority, target, verification, integration, assurance, identity, and project-rule manifest evidence. If any changed, return `INCONCLUSIVE` and require renewed proof; never infer rule absence from filesystem discovery.
2. Confirm that the immutable assurance arrangement is satisfied: compact uses a separate ordered reviewer attempt after `VERIFIED` and may reuse the fresh verifier identity only when the adapter reports reuse; standard uses a reviewer identity distinct from the verifier; high-consequence uses decorrelated non-implementer identities, fresh contexts, and role-specific Context Packs/prompts. High-consequence uses different equivalent Role Profiles or model families when available, discloses any same-model residual, and stops only when the Task Contract explicitly requires model-family separation.
3. Review **Standards** independently: correctness, security, privacy, data-loss/regression risk, project rules, maintainability required by those rules, and evidence completeness.
4. Review **Specification** independently: every governing requirement, acceptance criterion, interface, migration, constraint, non-goal, approved scope boundary, and the bound Compatibility and degraded behavior block. Compare the immutable target and verification evidence with that block; never select a compatibility or degraded-behavior policy.
5. Classify each finding as blocking or advisory. Point to exact target paths, governing authority, and evidence; do not repair.
6. Emit the three axes below against the same immutable target. A failing or inconclusive axis cannot yield approval.
7. Return blocking findings to the backend for a new owner-authorized task. Advisories remain explicit residual risk unless accepted into scope by the proper authority.

## Verdict

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

`APPROVED` requires both axes `PASS`. Any axis `FAIL` yields `CHANGES REQUIRED`; any axis `INCONCLUSIVE` yields overall `INCONCLUSIVE` unless another axis already establishes a blocking failure.

## Finding policy

Blocking findings include specification nonconformance; correctness, security, privacy, data-loss, or regression risk; violated project rules; stale, unverified, incomplete, or contradictory evidence; and unauthorized scope or destructive behavior.
Observed unapproved break, removal, clean cutover, hard-failure behavior, or speculative shim, default, retry, or alternate path is a blocking finding and yields `CHANGES REQUIRED`, even when authority is also missing. Missing or contradictory compatibility/degraded-behavior authority or evidence without an established target violation yields `INCONCLUSIVE`.

Advisories are nonrequired naming, style, maintainability, or future improvements that do not threaten the contract. They cannot mask a blocker or silently expand scope.

Assurance controls verification/review separation, not topology. Compact uses one fresh non-implementer identity for two ordered semantic attempts and separate verification and review outputs; if identity reuse is unavailable, two fresh non-implementers are a disclosed stronger-separation fallback. Standard requires distinct verifier and reviewer identities. High-consequence additionally requires decorrelated attempts and capabilities under the Task Contract. Integration or ticketing alone does not choose assurance.

## Review Handoff

Use the common Handoff and add the exact target; authority and evidence identities; immutable assurance profile and selection evidence; bound project-rule manifest and its consumption; bound Compatibility and degraded behavior block plus the immutable target and verification-evidence comparison; verifier identity; reviewer identity; separation mode; the separate verification Handoff/evidence; the separate review evidence; both axis verdicts; overall verdict; blocking findings; advisories; residual risk; and next owner. Do not edit, reformat, stage, merge, ship, or declare the run complete.

## Stop and next owner

Stop for stale or insufficient proof, unavailable governing authority, an unsatisfied assurance arrangement, a changed target, or an absent or contradictory project-rule manifest. Return `CHANGES REQUIRED` findings to `dev-implementation`, `INCONCLUSIVE` proof gaps to the evidence owner, and `APPROVED` only to the backend for required curation, compact trigger screening, and completion accounting.
