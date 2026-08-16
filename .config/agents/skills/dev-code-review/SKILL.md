---
name: dev-code-review
description: >
  Run one final read-only Standards and Specification pass on an exact
  independently verified single-lineage or post-integration target. Skip
  unverified or moving targets, aggregate blockers without repair, and never let
  advisories reopen work or combine review with shipping.
---

# Engineering Code Review

Own one final read-only Standards and Specification verdict for one immutable verified target when the selected assurance profile requires review. Compact is ineligible. One initial eligible pass is allowed; after the run-wide consolidated owner repair, the backend may request one impacted rerun only when that initial pass already occurred.

## Intake

Require the exact target identity; current `VERIFIED` Handoff and criterion evidence; target kind `final single-lineage | integrated with post-integration VERIFIED`; parent `OUT-...` and exact `AC-...` identities; inherited two-attempt/post-assurance repair state; immutable standard or high-consequence profile and arrangement; verifier identity; governing requirements/specification/ticket revisions; the backend-validated complete applicable-project-rule manifest with canonical source identity, every exact rule revision/scope, and the pre-dispatch comparison result; every finite current consumer/callsite map required by a universal changed invariant; and the integration Handoff when fan-in occurred.

Return `INCONCLUSIVE` for compact; a stale, partial, unverified, pre-integration-only, moving, or unnamed target; an omitted, stale, contradictory, or not backend-validated project-rule manifest; an incomplete finite-consumer proof; or an ineligible second initial pass. A manifest defect must block before dispatch and consume no semantic attempt, repair token, initial review, or rerun. A review request cannot authorize repair, another review loop, or shipping.

## Procedure
1. Recheck all authority, target, verification, integration, assurance, identity, budget, prior-review, finite-consumer, and complete project-rule-manifest evidence. If any changed without the explicit one-repair rerun contract, return `INCONCLUSIVE` and require renewed impacted proof; never infer rule absence from filesystem discovery.
2. Confirm that the immutable assurance arrangement requires review. Reject compact. Standard uses a reviewer identity distinct from the verifier; high-consequence uses decorrelated non-implementer identities, fresh contexts, and role-specific Context Packs/prompts. High-consequence uses different equivalent Role Profiles or model families when available, discloses any same-model residual, and stops only when the Task Contract explicitly requires model-family separation.
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
5. Finish one pass across the whole declared scope. Classify every finding as blocking, advisory, or separate-authority intake and assign an exact stable finding ID. A same-outcome blocking finding must cite an exact governing authority or `AC-...`, a changed surface or existing consumer required to migrate by the changed contract, and direct behavioral or static evidence. Point to exact target paths and evidence; do not repair. Every evidence-backed simplicity finding also has exactly one primary complexity tag and one concrete contract-preserving replacement.
6. Deduplicate and aggregate every eligible blocking finding ID once before return. Emit the three axes below against the same immutable target. A failing or inconclusive axis cannot yield approval.
7. Return the complete eligible blocker set to the backend for its possible one consolidated owner repair. Advisories are terminal residual risk. An independently serious safety issue returns a separate authority stop or intake and never silently enters the same repair set.

## Verdict

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

`APPROVED` requires both axes `PASS`. Any axis `FAIL` yields `CHANGES REQUIRED`; any axis `INCONCLUSIVE` yields overall `INCONCLUSIVE` unless another axis already establishes a blocking failure.

## Finding policy

Blocking findings include same-outcome specification nonconformance; correctness, security, privacy, data-loss, or regression risk; violated project rules; stale, unverified, incomplete, or contradictory evidence; and unauthorized scope or destructive behavior, only when the finding cites exact authority or `AC-...`, the changed surface or required existing consumer, and direct behavioral or static evidence.
Observed unapproved break, removal, clean cutover, hard-failure behavior, or speculative shim, default, retry, or alternate path is blocking when it meets that relevance boundary. Missing or contradictory compatibility/degraded-behavior authority or evidence without an established target violation yields `INCONCLUSIVE`.

No-effect proof binds the declared causal pre/post boundary, included targets, and explicitly excluded mutable files. Later changes to excluded mutable files do not invalidate the proof. Unrelated pre-existing defects, unrelated dirty bytes, mutable sidecar drift, and unsupported suspicion are advisory or deferred; a separately serious safety issue returns separate authority intake.

Advisories are nonrequired naming, style, maintainability, future improvements, or unrelated observations that do not threaten the approved outcome. They cannot mask a blocker, silently expand scope, consume the repair token, or reopen work.

Assurance controls verification/review separation, not topology. Compact has no review dispatch. Standard requires distinct verifier and reviewer identities. High-consequence additionally requires decorrelated attempts and capabilities under the Task Contract. Integration or ticketing alone does not choose assurance.

## Review Handoff

Use the common Handoff and add the parent outcome and exact criterion IDs; exact target and `final single-lineage | post-integration verified` kind; authority and evidence identities; immutable standard/high-consequence profile and selection evidence; inherited semantic-attempt/post-assurance repair state; initial-pass or authorized-rerun identity; backend-validated complete project-rule manifest and source comparison; bound Compatibility and degraded behavior block plus immutable target and verification comparison; every finite current consumer/callsite map and proof entry; verifier and reviewer identities; separation mode; both axis verdicts; overall verdict; deduplicated eligible blocking finding IDs mapped to affected criterion IDs; causal no-effect boundaries; advisories; residual risk; and exactly one next owner. Do not edit, reformat, merge, stage, commit, push, ship, or repair.

In the existing blocking-finding and advisory entries, carry each finding's stable ID, current severity, exact path, governing authority and affected `AC-...` IDs, changed surface or required consumer, direct evidence, causal boundary when claiming no effect, one primary complexity tag when applicable, and concrete contract-preserving replacement. This detail remains inside the one Review Handoff and changes no verdict, repair authority, metric, or delivery boundary.

## Stop and next owner

Stop for compact intake, stale or insufficient proof, unavailable governing authority, an unsatisfied assurance arrangement, a changed target, an omitted/stale/contradictory project-rule manifest, an incomplete finite-consumer proof, or an ineligible extra pass. Return `CHANGES REQUIRED` with every eligible blocking finding ID to `dev-implementation`, `INCONCLUSIVE` proof gaps to the evidence owner, and `APPROVED` only to the backend for required noncompact curation and completion accounting. Advisories remain terminal; review never schedules or performs repair.
