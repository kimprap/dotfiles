---
name: dev-verification
description: >
  Independently verify declared acceptance criteria against one immutable target
  using fresh read-only evidence. Use after observable or consequential changes
  and after integration; skip only deterministic nonbehavioral identity refreshes,
  and never repair, reformat, merge, or trust the implementer's conclusion.
---

# Engineering Verification

Own a truth verdict for an exact target revision. Verification is fresh, read-only, criterion-level, and separate from implementation.

## Intake

Require:

- one immutable target identity and target environment;
- the current Task Contract or approved acceptance authority;
- for each criterion: falsifiable claim, condition/input, expected behavior or metric/threshold, minimum proof class, target surface/environment, and baseline/treatment requirement;
- bounded fixtures and declared dependency Handoffs; and
- an allowed receiver.

Reject stale authority, a moving or unnamed target, missing criteria, invalid/confounded evidence, or a request to repair the target.

Proof classes are `live-behavior`, `targeted-test`, `regression-suite`, `measurement`, `build-typecheck`, `static-inspection`, `external-observation`, and `identity-check`. They describe the required evidence kind, not a universal strength ranking.

## Procedure

1. Establish independence: do not consume worker reasoning or conclusions as authority. Use only current criteria, immutable target, bounded context, and observable evidence.
2. Recheck the target identity before the first criterion. If it changed, reject the run as stale.
3. Exercise each criterion at its declared proof class and environment. Reproduce the original red-capable scenario for bugs; compare like-for-like baseline/treatment for performance; exercise the user-visible surface for UI, API, CLI, or system behavior when available.
4. Record exact scenario, environment, fixtures, inputs, expected and observed result, meaningful output/artifact/measurement reference, flake rerun status, and uncertainty.
5. Recheck target and fixture identities after evidence collection. Any target change invalidates the entire verdict until impact and required reruns are established.
6. Emit a criterion verdict and one aggregate verdict. Do not repair, reformat, stage, merge, or mutate the target.
7. Return the verification Handoff to `dev-implementation`, or to `dev-integration` for a named verified lineage.

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
- Exact target revision and environment
- Criterion → proof class → scenario → expected/observed → evidence reference → verdict
- Fixture identities and pre/post target identities
- Reproduction and flake-rerun status
- Aggregate verdict: VERIFIED | NOT VERIFIED | INCONCLUSIVE
- Invalidated or reusable prior evidence with explicit impact analysis
```

## Required and skippable coverage

Fresh independent verification is mandatory for changed observable behavior; regressions; APIs, schemas, shared or compatibility contracts; security, privacy, permissions, and auth; data, storage, migrations, destructive or external effects; concurrency, recovery, reliability, performance, or resources; uncertain/flaky/disputed smoke; integrated output; and explicit governing requirements.

Skip only demonstrably nonbehavioral prose/comments, formatting-only changes, or exact generated refreshes with deterministic identity proof. Record the reason, target revision, and identity evidence.

## Stop and next owner

Stop with `INCONCLUSIVE` when the required target, environment, permission, fixture, proof, or independent context is unavailable. Return `NOT VERIFIED` evidence to the backend for a new authorized repair task; do not repair it here. Return `VERIFIED` only to the named backend or integration receiver.
