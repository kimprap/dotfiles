---
name: dev-code-review
description: >
  Run one final read-only Standards and Specification pass on an exact
  independently verified single-lineage or post-integration target. Skip
  unverified or moving targets, aggregate blockers without repair, and never let
  advisories reopen work or combine review with shipping.
---

# Engineering Code Review

Own one final read-only Standards and Specification verdict for one immutable verified target when the assurance profile requires review. Compact is ineligible. Review never repairs, runs `worker-closure/v1`, performs audit work, dispatches learning, or ships.

## Intake

Require the exact target identity; current `VERIFIED` Handoff and criterion evidence; target kind `final single-lineage | integrated with post-integration VERIFIED`; parent `OUT-...` and exact `AC-...` identities; inherited two-attempt and run-wide post-assurance repair state; current review identity and any prior review receipt for a repaired target; immutable standard or high-consequence profile and arrangement; verifier identity; governing requirements, specification, ticket, Task Contract, and Common Handoff revisions; backend-validated once-bound applicable-project-rule and target manifests; and every finite current consumer/callsite map.

Require the verifier's exact canonical `surface-proof-recipe/v1` identities, each recipe's target and adapter binding, current adapter-tree identities when present, and doctor receipts as readiness provenance only. Require [`../dev-implementation/references/test-value.md`](../dev-implementation/references/test-value.md) and its exact `test-value/v1` digest for every permanent test changed by the outcome.

Return `INCONCLUSIVE` for compact; a stale, partial, unverified, moving, or unnamed target; omitted, rebuilt, extended, stale, mismatched, contradictory, or unvalidated manifests; incomplete finite-consumer proof; missing prior review or repair-impact evidence for a repaired target; duplicate review on the same immutable target; or any other ineligible input. Contradictory governing authority that makes expected behavior indeterminate returns `INCONCLUSIVE` to the authority owner without blocker/advisory classification, repair authority, or completion.

Review consumes verified evidence and executes zero criterion proof recipes. It never turns a doctor receipt, worker smoke, or verifier conclusion into either review axis.

## Procedure

1. Recheck every authority, target, verification, integration, assurance, identity, repair, prior-review, finite-consumer, recipe, adapter, and once-bound manifest entry against current bytes. A changed load-bearing input outside an accepted repair impact map returns `INCONCLUSIVE`. Never rebuild a manifest or infer authority, lineage, or evidence reuse from filesystem discovery.
2. Confirm that the immutable assurance arrangement requires review. Standard uses a reviewer identity distinct from the verifier. High-consequence uses decorrelated non-implementer identities, fresh contexts, and role-specific Context Packs; use different equivalent Role Profiles or model families when available and disclose any same-model residual.
3. Review **Standards** independently: correctness, security, privacy, data-loss/regression risk, project rules, maintainability required by those rules, evidence completeness, and this in-pass complexity lens:

   | Primary tag | Evidence-backed replacement |
   |---|---|
   | `delete` | remove unnecessary code or artifact while preserving the full contract |
   | `reuse` | use an existing local helper or pattern |
   | `stdlib` | use an applicable standard-library facility |
   | `native` | use a native platform facility |
   | `yagni` | remove speculative behavior or generality absent from authority |
   | `shrink` | use a smaller direct implementation when no more specific tag applies |

4. Review **Specification** independently: every governing requirement, acceptance criterion, interface, migration, constraint, non-goal, approved scope boundary, and compatibility/degraded-behavior contract.
5. The original-initial is the one whole-scope discovery pass. Seal every finding lineage by violated contract or invariant; trigger and expected/observed predicate; observable consumer or affected parent `AC-...`; causal boundary; finite current consumers when applicable; and originating target/evidence identity. Paths are evidence, not identity.
6. On a repaired immutable target, review closure of every remaining sealed lineage and every surface reached by the accepted repair impact map. Reuse prior review evidence only for byte-, authority-, contract-, and dependency-identical unaffected surfaces. A repair-caused regression requires the exact repaired revision, changed bytes or contract delta, accepted impact-map edge, observable failure path, and fresh affected proof.
7. Apply `test-value/v1` to every changed permanent test. Require a unique observable contract, regression, or invariant; closest-existing-test comparison; stable public seam; independent oracle; one plausible unique bug; and `keep | merge | remove` disposition. Reject duplicate, subsumed, tautological, incidental-snapshot, implementation-detail, coverage-only, and production-logic-oracle tests.
8. Deduplicate every stable lineage and finding ID. Aggregate `APPROVED` requires both axes `PASS`, every prior lineage closed, no repair-caused blocker, no disjoint outcome-relevant blocker, and valid unchanged-surface reuse.

## Verdict

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

`APPROVED` requires both axes `PASS`. Any axis `FAIL` yields `CHANGES REQUIRED`; any axis `INCONCLUSIVE` yields overall `INCONCLUSIVE` unless another axis already establishes a blocking failure. Verifier receipts are inputs, never the review verdict, and cannot substitute for either axis.

## Finding policy

A same-outcome blocker requires direct behavioral or direct static evidence that an existing parent `AC-...` or observable changed-contract consumer is broken. Map it to affected parent criteria, or to `affected AC: none` plus its exact fixed contract and consumer. Incomplete closure of a sealed lineage and directly proved repair-caused regressions may enter the single eligible consolidated repair. A changed hypothesis alone is not causal evidence.

Disjoint non-outcome observations are terminal advisories. Independently serious safety returns separate-authority intake. A disjoint outcome-relevant non-safety defect stays blocking and returns `authority-change-required` to the outcome authority; it never silently expands the parent repair. Changed paths, prose, metadata, frontmatter, scanner-string equality, stale adjacent explanation, self-referential consistency assertions, mutable sidecar drift, and unsupported suspicion alone are advisory.

## Review Handoff

Use the Common Handoff and add the parent outcome and exact criteria; immutable target and target kind; authority and evidence identities; assurance profile; repair state; current and prior review identities; validated manifests and recipe/adapters; finite-consumer proof; verifier/reviewer identities and separation; both axis verdicts and aggregate verdict; every stable lineage and finding with classification, causal evidence, affected criteria or fixed consumer, and current disposition; `test-value/v1` identity and each changed-test disposition; terminal advisories and residual risk; exact next receiver.

`CHANGES REQUIRED` for incomplete existing or directly evidenced repair-caused lineages returns to `dev-implementation` only while the run-wide repair token remains eligible. A disjoint outcome-relevant finding returns `authority-change-required`; serious safety returns separate-authority intake; authority conflict returns to its owner. `APPROVED` returns to the backend's existing learning boundary. Emit exactly one Handoff.

## Stop and next owner

Stop for compact intake, stale or insufficient proof, unavailable governing authority, changed target, invalid manifest or adapter identity, incomplete finite-consumer proof, missing repaired-target lineage/impact/reuse evidence, duplicate same-target review, or any attempt to repair, run worker closure, or mutate tests. Review one current immutable target exactly once. A repaired identity receives fresh impacted proof and one fresh review; it is not another review of the old target.
