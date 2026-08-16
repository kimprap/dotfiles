---
name: dev-verification
description: >
  Independently verify declared acceptance criteria at an approved immutable target only
  when the selected assurance profile or topology requires independent verification. Use
  fresh read-only evidence; never repair, reformat, merge, or trust the implementer's
  conclusion.
---

# Engineering Verification

Own a truth verdict for an exact target revision. Verification is fresh, read-only, criterion-level, and separate from implementation.

## Intake

Require:

- one immutable target identity and target environment;
- selected assurance profile and the exact profile/topology fact that requires independent verification; compact is ineligible;
- a declared boundary: final single-lineage target, isolated lineage before neutral fan-in, integrated target after fan-in, or an explicitly approved high-consequence checkpoint;
- the parent `OUT-...` identity, owned exact `AC-...` IDs, current Task Contract or approved acceptance authority, and inherited semantic-attempt/post-assurance repair state;
- for each criterion: falsifiable claim, condition/input, expected behavior or metric/threshold, minimum proof class, target surface/environment, and baseline/treatment requirement;
- bounded fixtures and exact declared dependency Handoffs;
- the backend-validated complete applicable-project-rule manifest, including canonical source identity, every exact rule revision and scope, and the backend comparison result;
- whenever the target can affect an existing observable contract or failure mode, the Task Contract's bound Compatibility and degraded behavior block;
- for every universal changed invariant, its finite current consumer/callsite map and one proof recipe per entry; and
- exactly one allowed receiver.

Return `INCONCLUSIVE` for compact work; stale authority; a moving or unnamed target; missing criteria; invalid/confounded evidence; an omitted, stale, contradictory, or not backend-validated project-rule manifest; an incomplete universal-consumer map; a missing compatibility/degraded-behavior authority block when required; or a request to repair the target. Missing authority is not proof of incompatibility. A manifest defect must have blocked before dispatch without consuming any semantic, repair, verification, or review count; if it reaches this skill, return it unconsumed to the named correction receiver.

Proof classes are `live-behavior`, `targeted-test`, `regression-suite`, `measurement`, `build-typecheck`, `static-inspection`, `external-observation`, and `identity-check`. They describe the required evidence kind, not a universal strength ranking.

## Procedure

1. Establish independence: do not consume worker reasoning or conclusions as authority. Use only current criteria, immutable target, the backend-validated complete project-rule manifest, bounded context, and observable evidence. Reject compact intake and never infer rule absence from filesystem discovery.
2. Recheck the target identity and declared boundary before the first criterion. Reject per-task proof requested merely because multiple tasks are sequential. Reject a final-only request when the target will fan in unverified isolated lineages. If the target changed, reject the run as stale.
3. Exercise each criterion at its declared proof class and environment. Map every declared preserved caller, data, protocol, or behavior and every required degraded trigger → observable response → recovery boundary to its criterion, fixture, exact scenario, observed evidence, and verdict. For every universal changed invariant, prove every entry in its finite current consumer/callsite map; a generic passing suite, changed fixture, or prose assertion cannot close an omitted entry. Reproduce the original red-capable scenario for bugs; compare like-for-like baseline/treatment for performance; exercise the user-visible surface when available.
4. Record exact scenario, environment, fixtures, inputs, expected and observed result, meaningful output/artifact/measurement reference, flake rerun status, and uncertainty.
5. Recheck target, fixture, and applicable-rule source identities after evidence collection. Any target change invalidates the entire verdict until impact and required reruns are established. Observed behavior that contradicts a bound preservation, degraded path, approved removal, or field-level `none` criterion is `NOT VERIFIED`.
6. Complete one pass across every available declared criterion before return. Aggregate each blocking `AC-...` ID exactly once with its verdict and evidence; absence, invalidity, or an unproved consumer-map entry remains `INCONCLUSIVE`, never success. Do not repair, reformat, stage, merge, mutate, or redirect to planning or diagnosis unless evidence establishes an actual authority gap owned by that stage.
7. Emit every criterion verdict and one aggregate verdict. Return the verification Handoff only to `dev-implementation`, or to `dev-integration` for a named isolated lineage that is `VERIFIED`.

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
- Blocking criterion IDs, deduplicated and complete for this pass
- Universal changed invariant → finite current consumer/callsite entry → proof recipe → expected/observed → verdict
- Bound compatibility/degraded behavior: preserved caller/data/protocol/behavior or required trigger → response → recovery boundary → criterion → fixture → exact scenario → observed evidence → verdict, including applicability evidence for each field-level `none`
- Fixture identities and pre/post target identities
- Backend-validated complete project-rule manifest, canonical source identity, exact revisions/scopes, and pre-dispatch comparison result
- Reproduction and flake-rerun status
- Aggregate verdict: VERIFIED | NOT VERIFIED | INCONCLUSIVE
- Invalidated or reusable prior evidence with explicit impact analysis
- Inherited semantic attempts and post-assurance repair state, unchanged by this read-only role
```

## Required and skippable coverage

The backend schedules fresh independent verification only when the selected profile or topology requires it: for standard/high-consequence final single-lineage targets; every exact isolated lineage before neutral fan-in; the exact integrated target after fan-in; and explicit approved high-consequence checkpoints. Compact uses criterion-complete worker smoke and never reaches this skill. Sequential task count alone never creates independent proof. Multiple unverified isolated lineages cannot defer all proof until after fan-in.

At each declared boundary, cover every applicable changed observable behavior; finite consumer/callsite entry for a universal changed invariant; regression; API, schema, shared or compatibility contract; security, privacy, permission, or auth concern; data, storage, migration, destructive or external effect; concurrency, recovery, reliability, performance, or resource property; uncertain/flaky/disputed smoke; integration effect; and explicit governing requirement.

Skip a noncompact boundary only when authority shows it is not required, or when the target is demonstrably nonbehavioral prose/comments, formatting-only change, or exact generated refresh with deterministic identity proof. Record the reason, target revision, and identity evidence.

## Stop and next owner

Stop with `INCONCLUSIVE` when the selected profile does not permit dispatch or when the required target, boundary, environment, permission, fixture, proof, independent context, complete backend-validated project-rule manifest, finite consumer map, or authority is unavailable or contradictory. Return aggregated `NOT VERIFIED`/`INCONCLUSIVE` criterion IDs and exact omitted entries to the backend for its one possible consolidated owner repair; do not repair or diagnose here. Return `VERIFIED` only to the named backend or integration receiver. A repeated blocker frontier or inconclusive proof cannot reset the lifecycle or create another verifier pass.
