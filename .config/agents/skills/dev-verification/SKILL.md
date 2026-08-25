---
name: dev-verification
description: >
  Independently verify declared acceptance criteria at an approved immutable target only
  when the selected assurance profile or topology requires independent verification.
  Produce a fresh aggregate verdict from fresh impacted proof and independently accepted
  exact unaffected evidence; never repair, reformat, merge, or trust worker conclusions.
---

# Engineering Verification

Own a truth verdict for an exact target revision. Verification is read-only, criterion-level, and separate from implementation; freshness means current target/rule identity, fresh impacted proof, and a fresh aggregate verdict, not unconditional replay of exact valid unaffected evidence.

## Intake

Require:

- one immutable target identity and target environment;
- selected assurance profile and the exact profile/topology fact that requires independent verification; compact is ineligible;
- a declared boundary: final single-lineage target, isolated lineage before neutral fan-in, integrated target after fan-in, or an explicitly approved high-consequence checkpoint;
- the parent `OUT-...` identity, owned exact `AC-...` IDs, current Task Contract or approved acceptance authority, and inherited semantic-attempt/post-assurance repair state;
- for same-outcome noncompact repair, the frozen pre-repair parent acceptance-ID and proof-recipe identities, the repair owner's complete proposed impact map, and the backend-frozen impacted-fresh or unaffected-reuse action for every pre-existing criterion;
- for each criterion: falsifiable claim, condition/input, expected behavior or metric/threshold, minimum proof class, target surface/environment, and baseline/treatment requirement;
- bounded fixtures and exact declared dependency Handoffs;
- the backend-validated once-bound applicable-project-rule and target manifests, including canonical URI, exact SHA-256 revision and scope for every entry, plus the current pre-dispatch byte-comparison result;
- whenever the target can affect an existing observable contract or failure mode, the Task Contract's bound Compatibility and degraded behavior block;
- for every universal changed invariant, its finite current consumer/callsite map and one proof recipe per entry; and
- exactly one allowed receiver.

Return `INCONCLUSIVE` for compact work; stale authority; a moving or unnamed target; missing criteria; invalid/confounded evidence; an omitted, rebuilt, extended, stale, mismatched, contradictory, or not backend-validated rule/target manifest; an incomplete universal-consumer map; a missing compatibility/degraded-behavior authority block when required; a same-outcome repair with added, removed, or semantically changed parent acceptance IDs or proof recipes; an incomplete backend-frozen criterion action map; an invalid proposed evidence reuse or unexecutable required fresh action; or a request to repair the target. Missing authority is not proof of incompatibility. A review finding, changed path, adjacent fixture, or consumer not already represented by the frozen parent set cannot become a verifier-owned `AC-...`. A manifest defect must have blocked before dispatch without consuming any semantic, repair, verification, or review count; if it reaches this skill, return it unconsumed to the named correction receiver.

Proof classes are `live-behavior`, `targeted-test`, `regression-suite`, `measurement`, `build-typecheck`, `static-inspection`, `external-observation`, and `identity-check`. They describe the required evidence kind, not a universal strength ranking.

## Procedure

1. Establish independence: do not consume worker reasoning, smoke, or conclusions as authority or verifier evidence. Use only current criteria, immutable target, the backend-validated once-bound rule and target manifests, bounded context, and independently observed evidence. Reject compact intake and never infer rule or target-manifest content from filesystem discovery.
2. Recheck the declared boundary and compare current target, applicable-rule, fixture, and dependency bytes with the exact bound manifest entries before the first criterion. For same-outcome repair, also recheck byte-identical-in-meaning parent acceptance and proof-recipe identities and require one backend-frozen impacted-fresh or unaffected-reuse action for every frozen criterion. Reject per-task proof requested merely because multiple tasks are sequential, a final-only request when the target will fan in unverified isolated lineages, a changed target, or any added, removed, or semantically changed parent criterion or proof recipe.
3. Exercise each criterion at its declared proof class and environment. On same-outcome repair, independently accept or reject every backend-frozen action. Run every impacted entry fresh through its mapped causal path, fixture, or consumer. Accept unaffected reuse only when the map proves no causal path from the repair and the criterion's target surface, environment, expectation, proof method, fixture and dependency identities, and evidence integrity remain valid; otherwise reject reuse and run the frozen proof recipe fresh. Map every declared preserved caller, data, protocol, or behavior and every required degraded trigger → observable response → recovery boundary to its criterion, fixture, exact scenario, observed evidence, and verdict. For every universal changed invariant, prove every entry in its finite current consumer/callsite map; a generic passing suite, changed fixture, worker smoke, or prose assertion cannot close an omitted entry.
4. Record exact scenario, environment, fixtures, inputs, expected and observed result, meaningful output/artifact/measurement reference, flake rerun status, and uncertainty. For repair, record every criterion's backend-frozen action, independent accept/reject decision, impacted/unaffected classification, causal path/fixture/consumer, fresh-or-reuse proof action, and each reused evidence identity and validity basis.
5. Recompare current target, applicable-rule, fixture, dependency, and reused-evidence identities with the once-bound manifest and evidence entries after collection. Any target change invalidates the entire verdict until its causal impact and required reruns are established. Observed behavior that contradicts a bound preservation, degraded path, approved removal, or field-level `none` criterion is `NOT VERIFIED`; an invalid or unexecuted criterion action is `INCONCLUSIVE`.
6. Complete one pass across every criterion and backend-frozen action in the unchanged parent set before return. Aggregate each blocking `AC-...` ID exactly once with its verdict and evidence; absence, invalidity, incomplete coverage, rejected reuse without fresh proof, or an unproved consumer-map entry remains `INCONCLUSIVE`, never success. Do not promote a review finding, changed path, adjacent fixture, or consumer into a new criterion. Do not repair, reformat, stage, merge, mutate, or redirect to planning or diagnosis unless evidence establishes an actual authority gap owned by that stage.
7. Emit every frozen-parent criterion verdict, every independent action decision, and one fresh repaired-target aggregate verdict over exactly that unchanged set. Return the verification Handoff only to `dev-implementation`, or to `dev-integration` for a named isolated lineage that is `VERIFIED`.

## Verdict

Use only:

- `VERIFIED` — every criterion meets its declared proof on the valid target/environment with no contradiction;
- `NOT VERIFIED` — observed evidence contradicts at least one criterion; or
- `INCONCLUSIVE` — required proof is missing, invalid, unavailable, stale, or confounded.

Missing proof is never success. A passing build or typecheck cannot substitute for a stronger declared behavioral proof.

## Verification Handoff

Use the common `dev-handoff` structure and include:

```markdown
## Verification
- Parent outcome, declared boundary, exact target revision, and environment
- Criterion ID → proof class → scenario → expected/observed → evidence reference → verdict
- Frozen pre-repair parent acceptance IDs and proof-recipe identities, with semantic-identity recheck; repair-owner proposal and backend-frozen complete criterion action map
- Complete criterion action map: criterion → impacted | unaffected → causal path/fixture/consumer → frozen fresh proof | proposed exact reuse → verifier accept | reject
- Fresh impacted or rejected-reuse results and every accepted unaffected evidence identity plus target-surface, environment, expectation, proof-method, fixture, dependency, and evidence-integrity validity basis
- Fresh repaired-target aggregate verdict over exactly the unchanged parent set; no promoted review-finding, path, fixture, or consumer criterion
- Blocking criterion IDs, deduplicated and complete for this pass
- Universal changed invariant → finite current consumer/callsite entry → proof recipe → expected/observed → verdict
- Bound compatibility/degraded behavior: preserved caller/data/protocol/behavior or required trigger → response → recovery boundary → criterion → fixture → exact scenario → observed evidence → verdict, including applicability evidence for each field-level `none`
- Fixture identities and pre/post target identities
- Backend-validated once-bound project-rule and target manifests, canonical URIs, exact revisions/scopes, and current pre/post comparison results
- Reproduction and flake-rerun status
- Aggregate verdict: VERIFIED | NOT VERIFIED | INCONCLUSIVE
- Invalidated or reusable prior evidence with explicit impact analysis
- Inherited semantic attempts and post-assurance repair state, unchanged by this read-only role
```

## Required and skippable coverage

The backend schedules fresh independent verification only when the selected profile or topology requires it: for standard/high-consequence final single-lineage targets; every exact isolated lineage before neutral fan-in; the exact integrated target after fan-in; and explicit approved high-consequence checkpoints. Compact uses criterion-complete worker smoke and never reaches this skill. Sequential task count alone never creates independent proof. Multiple unverified isolated lineages cannot defer all proof until after fan-in.

For same-outcome noncompact repair, required coverage is the complete frozen parent acceptance/proof set and every backend-frozen criterion action. Impacted entries run fresh; the verifier independently accepts unaffected reuse only after every required identity remains valid and otherwise runs the frozen recipe fresh. The verifier always emits a fresh aggregate verdict. The boundary cannot be skipped or expanded into a newly synthesized criterion.

At each declared boundary, cover every applicable changed observable behavior; finite consumer/callsite entry for a universal changed invariant; regression; API, schema, shared or compatibility contract; security, privacy, permission, or auth concern; data, storage, migration, destructive or external effect; concurrency, recovery, reliability, performance, or resource property; uncertain/flaky/disputed smoke; integration effect; and explicit governing requirement.

Skip a noncompact boundary only when authority shows it is not required, or when the target is demonstrably nonbehavioral prose/comments, formatting-only change, or exact generated refresh with deterministic identity proof. Record the reason, target revision, and identity evidence.

## Stop and next owner

Stop with `INCONCLUSIVE` when the selected profile does not permit dispatch or when the required target, boundary, environment, permission, fixture, proof, independent context, once-bound rule/target manifests and current comparisons, finite consumer map, authority, frozen parent identity, complete backend-frozen action map, or action/reuse validity is unavailable or contradictory. Return aggregated `NOT VERIFIED`/`INCONCLUSIVE` criterion IDs and exact omitted or rejected actions to the backend for its one possible consolidated owner repair; do not repair, widen acceptance, rebuild a manifest, dispatch another role, or consume a review slot.
