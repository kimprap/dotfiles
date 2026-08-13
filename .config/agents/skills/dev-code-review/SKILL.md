---
name: dev-code-review
description: >
  Run one final read-only Standards and Specification pass on an exact
  independently verified single-lineage or post-integration target. Skip
  unverified or moving targets, aggregate blockers without repair, and never let
  advisories reopen work or combine review with shipping.
---

# Engineering Code Review

Own one final read-only Standards and Specification verdict for one immutable verified target under its immutable assurance profile. One initial eligible pass is allowed; after the run-wide consolidated owner repair, the backend may request one impacted rerun only when that initial pass already occurred.

## Intake

Require the exact target identity; current `VERIFIED` Handoff and criterion evidence; target kind `final single-lineage | integrated with post-integration VERIFIED`; parent `OUT-...` and exact `AC-...` identities; inherited semantic-attempt/post-assurance repair state; immutable assurance profile and arrangement; verifier identity; governing requirements/specification/ticket revisions; immutable applicable-project-rule manifest with canonical artifacts, exact revisions, and scope—or backend-bound `none` with its bounded check—and the integration Handoff when fan-in occurred.

Return `INCONCLUSIVE` for a stale, partial, unverified, pre-integration-only, moving, or unnamed target, an absent or contradictory project-rule manifest, or an ineligible second initial pass. A review request cannot authorize repair, another review loop, or shipping.

## Procedure
1. Recheck all authority, target, verification, integration, assurance, identity, budget, prior-review, and project-rule manifest evidence. If any changed without the explicit one-repair rerun contract, return `INCONCLUSIVE` and require renewed impacted proof; never infer rule absence from filesystem discovery.
2. Confirm that the immutable assurance arrangement is satisfied: compact uses a separate ordered reviewer attempt after `VERIFIED` and may reuse the fresh verifier identity only when the adapter reports reuse; standard uses a reviewer identity distinct from the verifier; high-consequence uses decorrelated non-implementer identities, fresh contexts, and role-specific Context Packs/prompts. High-consequence uses different equivalent Role Profiles or model families when available, discloses any same-model residual, and stops only when the Task Contract explicitly requires model-family separation.
3. Review **Standards** independently: correctness, security, privacy, data-loss/regression risk, project rules, maintainability required by those rules, evidence completeness, and the complexity lens below. Apply the lens inside this sole final pass, never as another stage or pass:

   | Primary tag | Evidence-backed replacement |
   |---|---|
   | `delete` | remove unnecessary code/artifact while preserving the full contract |
   | `reuse` | use an existing local helper/pattern |
   | `stdlib` | use an applicable standard-library facility |
   | `native` | use a native platform facility |
   | `yagni` | remove speculative behavior/generality absent from authority |
   | `shrink` | use a smaller direct implementation when no more specific tag applies |
4. Review **Specification** independently: every governing requirement, acceptance criterion, interface, migration, constraint, non-goal, approved scope boundary, and the bound Compatibility and degraded behavior block. Compare the immutable target and verification evidence with that block; never select a compatibility or degraded-behavior policy.
5. Finish one pass across the whole declared scope. Classify every finding as blocking or advisory and assign an exact stable finding ID. Point to exact target paths, governing authority, criterion IDs, and evidence; do not repair. Every evidence-backed simplicity finding also has exactly one primary complexity tag and one concrete contract-preserving replacement.
6. Deduplicate and aggregate every available blocking finding ID once before return. Emit the three axes below against the same immutable target. A failing or inconclusive axis cannot yield approval.
7. Return the complete blocker set to the backend for its possible one consolidated owner repair. Advisories are terminal residual risk: they never authorize repair, another attempt, another review, or scope expansion.

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

Advisories are nonrequired naming, style, maintainability, or future improvements that do not threaten the contract. They cannot mask a blocker, silently expand scope, consume the repair token, or reopen work.

Complexity tags never determine severity. Do not report required compatibility, failure, safety, security, privacy, accessibility, project-rule, or proof complexity as a simplicity finding. Unsupported suspicion is not a finding; insufficient evidence uses the existing `INCONCLUSIVE` verdict. On the sole authorized repair rerun, reuse the stable ID for the same semantic finding and assign a new ID only to a new semantic finding.

Assurance controls verification/review separation, not topology. Compact uses one fresh non-implementer identity for two ordered semantic attempts and separate verification and review outputs; if identity reuse is unavailable, two fresh non-implementers are a disclosed stronger-separation fallback. Standard requires distinct verifier and reviewer identities. High-consequence additionally requires decorrelated attempts and capabilities under the Task Contract. Integration or ticketing alone does not choose assurance.

## Review Handoff

Use the common Handoff and add the parent outcome and exact criterion IDs; exact target and `final single-lineage | post-integration verified` kind; authority and evidence identities; immutable assurance profile and selection evidence; inherited semantic-attempt/post-assurance repair state; initial-pass or authorized-rerun identity; bound project-rule manifest and its consumption; bound Compatibility and degraded behavior block plus the immutable target and verification-evidence comparison; verifier and reviewer identities; separation mode; separate verification and review evidence; both axis verdicts; overall verdict; deduplicated blocking finding IDs mapped to affected criterion IDs; advisories; residual risk; and exactly one next owner. Do not edit, reformat, stage, merge, ship, or declare the run complete.

In the existing blocking-finding and advisory entries, carry each tagged finding's stable ID, current blocking/advisory severity, exact path, governing authority and affected `AC-...` IDs, evidence, one primary tag, and concrete contract-preserving replacement. This detail remains inside the one Review Handoff and changes no common-Handoff field, verdict, repair authority, metric, or delivery boundary.

## Stop and next owner

Stop for stale or insufficient proof, unavailable governing authority, an unsatisfied assurance arrangement, a changed target, an absent or contradictory project-rule manifest, or an ineligible extra pass. Return `CHANGES REQUIRED` with every available blocking finding ID to `dev-implementation`, `INCONCLUSIVE` proof gaps to the evidence owner, and `APPROVED` only to the backend for required curation, compact trigger screening, and completion accounting. Advisories remain terminal; review never schedules or performs repair.
