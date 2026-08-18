---
name: dev-code-review
description: >
  Run one final read-only Standards and Specification pass on an exact
  independently verified single-lineage or post-integration target. Skip
  unverified or moving targets, aggregate blockers without repair, and never let
  advisories reopen work or combine review with shipping.
---

# Engineering Code Review

Own one read-only Standards and Specification verdict for one immutable verified target and one backend-selected review slot when the assurance profile requires review. Compact is ineligible. The backend consumes the original initial review while it is `not run`, then the original rerun while it is `unused`. Only after both original slots were already consumed may one current D03 human-grant identity admit exactly one grant-scoped post-`VERIFIED` pass for that cycle.

## Intake

Require the exact target identity; current `VERIFIED` Handoff and criterion evidence; target kind `final single-lineage | integrated with post-integration VERIFIED`; parent `OUT-...` and exact `AC-...` identities; inherited two-attempt/post-assurance repair state; original initial-review/rerun state; backend-selected review slot `original-initial | original-rerun | grant-scoped` and, for the last kind, one current D03 grant identity from the newest exhaustion record on the executing plan's same authoritative file; immutable standard or high-consequence profile and arrangement; verifier identity; governing requirements/specification/ticket revisions; the backend-validated complete applicable-project-rule manifest with canonical source identity, every exact rule revision/scope, and the pre-dispatch comparison result; every finite current consumer/callsite map required by a universal changed invariant; and the integration Handoff when fan-in occurred.

Return `INCONCLUSIVE` for compact; a stale, partial, unverified, pre-integration-only, moving, or unnamed target; an omitted, stale, contradictory, or not backend-validated project-rule manifest; an incomplete finite-consumer proof; a review slot selected out of original-initial/original-rerun/grant-scoped order; a grant-scoped request before both original slots were consumed; a missing, stale, pending, opinion-incomplete, reused, or target-mismatched newest plan record or grant identity; a duplicate same-target opinion/pass; or any other ineligible extra pass. A manifest or grant-record defect must block before dispatch and consume no semantic attempt, repair token, original review slot, or grant-scoped pass. A review request cannot authorize repair, another review loop, or shipping.

When contradictory current governing authority makes expected behavior indeterminate, return INCONCLUSIVE to the authority owner without classifying a blocker or advisory, authorizing repair, or completing.

## Procedure
1. Recheck all authority, target, verification, integration, assurance, identity, budget, prior-review, selected-slot, newest persisted exhaustion record and current grant when applicable, finite-consumer, and complete project-rule-manifest evidence. Require original-initial before original-rerun and both original slots consumed before a grant-scoped pass; the grant must be the current record's `continue` or completed `same-route` Second opinion for the exact inspected target. If any load-bearing input changed outside the explicit impacted-proof and D03 grant contract, return `INCONCLUSIVE`; never infer rule absence or grant state from filesystem discovery beyond the bound authoritative plan.
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
5. Finish one pass across the whole declared scope. Classify every observation as an eligible same-outcome blocker, terminal advisory, authority conflict, or separate-authority intake and assign an exact stable ID. A same-outcome blocking finding requires direct behavioral or direct static evidence that an existing parent AC-... or an observable changed-contract consumer is broken. Map it to affected existing parent `AC-...` IDs, or to `affected AC: none` plus the exact fixed contract and observable changed-contract consumer. Point to exact target paths and evidence; do not repair. Every evidence-backed simplicity finding also has exactly one primary complexity tag and one concrete contract-preserving replacement.
6. Deduplicate and aggregate every eligible blocking finding ID once before return. Emit the three axes below against the same immutable target. A failing or inconclusive axis cannot yield approval; when both axes pass, Overall is `APPROVED` even when terminal advisories remain.
7. Return the complete eligible blocker set to the backend for its possible one consolidated owner repair, and return an indeterminate authority conflict to its authority owner. A wording-only advisory is terminal residual risk: it does not fail the parent or restart verification, review, or learning, and the parent performs its one already-required terminal Standard assessment before completion. Send approved advisory-only results to the backend's already-scheduled tail. An independently serious safety issue returns a separate authority stop or intake and never silently enters the same repair set. Review never schedules repair, maintenance, learning, or shipping.

## Verdict

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

`APPROVED` requires both axes `PASS`, including when terminal advisories remain. Any axis `FAIL` yields `CHANGES REQUIRED`; any axis `INCONCLUSIVE` yields overall `INCONCLUSIVE` unless another axis already establishes a blocking failure.

## Finding policy

Same-outcome blocking findings include specification nonconformance; correctness, security, privacy, data-loss, or regression risk; violated project rules; stale, unverified, incomplete, or contradictory evidence; and unauthorized scope or destructive behavior only when direct behavioral or direct static evidence proves that an existing parent criterion or observable changed-contract consumer is broken. Each blocker maps to affected parent `AC-...` IDs, or to `affected AC: none` plus its exact fixed contract and observable consumer.
Observed unapproved break, removal, clean cutover, hard-failure behavior, or speculative shim, default, retry, or alternate path is blocking only when it meets that outcome-relevance boundary. Contradictory current governing authority that makes expected behavior indeterminate yields `INCONCLUSIVE` to the authority owner rather than a guessed blocker or advisory.

No-effect proof binds the declared causal pre/post boundary, included targets, and explicitly excluded mutable files. Later changes to excluded mutable files do not invalidate the proof. Unrelated pre-existing defects, unrelated dirty bytes, mutable sidecar drift, and unsupported suspicion are advisory or deferred; a separately serious safety issue returns separate authority intake.

Changed paths, prose, metadata, frontmatter, scanner-string equality, stale adjacent explanation, and self-referential consistency assertions alone are advisory.

Advisories are terminal nonrequired naming, style, maintainability, future-improvement, or unrelated observations that do not threaten the approved outcome. They cannot mask a blocker, silently expand scope, consume the repair token, reopen work, or schedule maintenance.

Assurance controls verification/review separation, not topology. Compact has no review dispatch. Standard requires distinct verifier and reviewer identities. High-consequence additionally requires decorrelated attempts and capabilities under the Task Contract. Integration or ticketing alone does not choose assurance.

## Review Handoff

Use the common Handoff and add the parent outcome and exact criterion IDs; exact target and `final single-lineage | post-integration verified` kind; authority and evidence identities; immutable standard/high-consequence profile and selection evidence; inherited semantic-attempt/post-assurance repair state; selected review slot; original initial-review/rerun state before and after; current grant identity and its one-pass consumption when grant-scoped; backend-validated complete project-rule manifest and source comparison; bound Compatibility and degraded behavior block plus immutable target and verification comparison; every finite current consumer/callsite map and proof entry; verifier and reviewer identities; separation mode; both axis verdicts; overall verdict; deduplicated eligible blocking finding IDs mapped to affected criterion IDs; causal no-effect boundaries; advisories; residual risk; and exactly one next owner. Do not edit, reformat, merge, stage, commit, push, ship, or repair.

In the existing blocking-finding, authority-conflict, and advisory entries, carry each stable ID, current classification, exact path, governing authority, affected existing parent `AC-...` IDs or `affected AC: none` plus the exact fixed contract and observable changed-contract consumer, direct evidence, causal boundary when claiming no effect, one primary complexity tag when applicable, and concrete contract-preserving replacement. Carry terminal advisories as residual risk and carry an authority conflict with its exact owner. This detail remains inside the one Review Handoff and changes no verdict, repair authority, metric, or delivery boundary.

## Stop and next owner

Stop for compact intake, stale or insufficient proof, unavailable governing authority, an unsatisfied assurance arrangement, a changed target, an omitted/stale/contradictory project-rule manifest, an incomplete finite-consumer proof, an out-of-order original slot, a missing or ineligible grant identity, a duplicate same-target pass, or any other ineligible extra pass. Return `CHANGES REQUIRED` with every eligible blocking finding ID to `dev-implementation`, an authority-conflict `INCONCLUSIVE` to the named authority owner, other `INCONCLUSIVE` proof gaps to the evidence owner, and advisory-only `APPROVED` to the backend's already-scheduled noncompact tail. Advisories remain terminal; review never schedules or performs repair, maintenance, learning, or shipping.
