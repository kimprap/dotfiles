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
- for a dispatched cross-generation reuse candidate, the backend-resolved current acceptance set, canonical wrappers, flattened manifest bindings and generation-validation receipt; the last complete aggregate's byte-identical frozen prior acceptance set, wrappers, manifest bindings, evidence and identities; the approved target delta; and the complete typed row `criterion → old recipe ID → new recipe ID → target-delta edge or none → fresh-or-reuse` for every frozen criterion;
- for each criterion: falsifiable claim, condition/input, expected behavior or metric/threshold, minimum proof class, target surface/environment, and baseline/treatment requirement;
- bounded fixtures and exact declared dependency Handoffs;
- the backend-validated once-bound applicable-project-rule and target manifests, including canonical URI, exact SHA-256 revision and scope for every entry, plus the current pre-dispatch byte-comparison result;
- whenever the target can affect an existing observable contract or failure mode, the Task Contract's bound Compatibility and degraded behavior block;
- for every universal changed invariant, its finite current consumer/callsite map and one proof recipe per entry; and
- exactly one allowed receiver.

For every criterion, require one complete canonical `surface-proof-recipe/v1` object and exact `VR-...@sha256:...` identity. Require its exact target, scenario, inputs, proof class, evidence form, fixtures, dependencies, isolation, cleanup, comparison, and finite current consumer/callsite map when applicable. `adapter` is exactly `none` or one canonical adapter `file://.../SKILL.md` URI and exact tree digest. For a non-`none` adapter, intake also requires the current readiness doctor receipt identity; that receipt is provenance only.

Return `INCONCLUSIVE` for compact work; stale authority; a moving or unnamed target; missing criteria; invalid/confounded evidence; an omitted, rebuilt, extended, stale, mismatched, contradictory, or not backend-validated rule/target manifest; an incomplete universal-consumer map; a missing compatibility/degraded-behavior authority block when required; a same-outcome repair with added, removed, or semantically changed parent acceptance IDs or proof recipes; an incomplete backend-frozen criterion action map; an invalid current or frozen-prior generation; an invalid typed target-delta row; an invalid proposed evidence reuse or unexecutable required fresh action; or a request to repair the target. Missing authority is not proof of incompatibility. A review finding, changed path, adjacent fixture, or consumer not already represented by the frozen parent set is not a verifier-created criterion.

Proof classes are `live-behavior`, `targeted-test`, `regression-suite`, `measurement`, `build-typecheck`, `static-inspection`, `external-observation`, and `identity-check`. They describe the required evidence kind, not a universal strength ranking.

## Procedure

1. Establish independence: do not consume worker reasoning, smoke, or conclusions as authority or verifier evidence. Use only current criteria, immutable target, the backend-validated once-bound rule and target manifests, bounded context, and independently observed evidence. Reject compact intake and never infer rule or target-manifest content from filesystem discovery.
2. Recheck the declared boundary and compare current target, applicable-rule, fixture, and dependency bytes with the exact bound manifest entries before the first criterion. Natively resolve every current `file://`, `local://`, and `agent://` binding, repeat live adapter-tree validation, and call `validate_recipe_generation(...)` for the exact current acceptance set, canonical wrappers, and flattened manifest bindings.

For a dispatched reuse package, byte-compare the frozen prior acceptance set, wrappers, manifest bindings, evidence, and identities with the last complete aggregate, validate that frozen generation without I/O or live prior rereads, and never union the two generations. Then independently check every typed row against the approved target delta: its edge is `none` or the ordered `(uri, old digest, new digest)` sequence; every changed binding names an approved edge whose URI appears in both recipes; and the old/new recipes are otherwise byte-equal. An invalid current package, prior package, or dispatched map is `INCONCLUSIVE` before proof; do not repair or silently downgrade it to all-fresh.

For same-outcome repair, also recheck byte-identical-in-meaning parent acceptance and proof-recipe identities and require one backend-frozen impacted-fresh or unaffected-reuse action for every frozen criterion. Reject per-task proof requested merely because multiple tasks are sequential, a final-only request when the target will fan in unverified isolated lineages, a changed target, or any added, removed, or semantically changed parent criterion or proof recipe.

Before proof, independently recanonicalize every recipe and rehash any bound adapter. Missing fields, target drift, recipe drift, adapter drift, unsafe adapter paths, or a stale or mismatched doctor receipt returns `INCONCLUSIVE` to the named authority, backend, or adapter owner without executing stale proof. Doctor never satisfies a criterion and never becomes verifier evidence.
3. Exercise each criterion at its declared proof class and environment. Independently accept or reject every backend-frozen action. A valid rebound row always runs the new current recipe fresh exactly once and consumes no old-digest evidence. An exact-identity/no-edge row may reuse evidence only when its current target, environment, expectation, proof method, fixture, dependency, and integrity identities remain exact; otherwise reject reuse and run the current frozen recipe fresh. For repair, run every impacted entry fresh through its mapped causal path, fixture, or consumer and apply the same exact unaffected-evidence rule. Map every declared preserved caller, data, protocol, or behavior and every required degraded trigger → observable response → recovery boundary to its criterion, fixture, exact scenario, observed evidence, and verdict.

Execute the recipe's documented normal example, boundary case, and failure case where declared, including every finite current consumer/callsite entry. Record observed behavior from the real target surface, not source strings or worker conclusions. If the adapter modifies itself under separate authority, reject all pre-change evidence, require the final tree digest and every affected final recipe identity, and prove only the rebound target.
4. Record exact scenario, environment, fixtures, inputs, expected and observed result, meaningful output/artifact/measurement reference, flake rerun status, and uncertainty. Record every criterion's backend-frozen typed or repair action, independent accept/reject decision, causal path/fixture/consumer, fresh-or-reuse proof action, and each reused evidence identity and validity basis.
5. Recompare current target, applicable-rule, fixture, dependency, and reused-evidence identities with the once-bound manifest and evidence entries after collection. Any target change invalidates the entire verdict until its causal impact and required reruns are established. Observed behavior that contradicts a bound preservation, degraded path, approved removal, or field-level `none` criterion is `NOT VERIFIED`; an invalid or unexecuted criterion action is `INCONCLUSIVE`.
6. Complete one pass across every current criterion and backend-frozen action before return. Aggregate each blocking `AC-...` ID exactly once with its verdict and evidence. Absence, invalidity, incomplete coverage, rejected reuse without fresh proof, an unproved consumer-map entry, mixed-target evidence, or old-digest evidence remains `INCONCLUSIVE`, never success. Do not promote a review finding, changed path, adjacent fixture, or consumer into a new criterion. Do not repair, reformat, stage, merge, mutate, or redirect to planning or diagnosis unless evidence establishes an actual authority gap owned by that stage.
7. Emit every current criterion verdict, every independent action decision, and one fresh complete current-target aggregate over exactly that set. Return the verification Handoff only to `dev-implementation`, or to `dev-integration` for a named isolated lineage that is `VERIFIED`.

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
- Current and, when dispatched, frozen-prior generation identities, native current-resolution result, live adapter-tree recheck, separate `validate_recipe_generation(...)` receipts, and exact last-complete-aggregate snapshot comparison
- Complete typed reuse map: criterion → old recipe ID → new recipe ID → ordered target-delta edge or none → frozen fresh-or-reuse proposal → verifier accept or reject
- Frozen pre-repair parent acceptance IDs and proof-recipe identities, with semantic-identity recheck; repair-owner proposal and backend-frozen complete criterion action map
- Complete criterion action map: criterion → impacted | unaffected → causal path/fixture/consumer → frozen fresh proof | proposed exact reuse → verifier accept | reject
- Fresh impacted or rejected-reuse results and every accepted unaffected evidence identity plus target-surface, environment, expectation, proof-method, fixture, dependency, and evidence-integrity validity basis
- One fresh complete current-target aggregate over every current criterion; no missing, duplicate, mixed-target, worker-evidence, old-digest, promoted review-finding, path, fixture, or consumer row
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

For a valid dispatched cross-generation map, required coverage is every current criterion and typed action. Rebound and rejected-reuse entries run their current recipes fresh; an exact no-edge entry may reuse only independently accepted exact current-target unaffected evidence. Missing or inexact prior state and ambiguous edges select backend all-fresh with no reuse action; an approved semantic change selects all-fresh under the current contract; an unapproved non-digest change returns backend `authority-change-required` and does not reach proof. Any invalid current/prior package or map that was dispatched remains `INCONCLUSIVE` before proof rather than being silently downgraded. One fresh aggregate always covers the complete current set.

At each declared boundary, cover every applicable changed observable behavior; finite consumer/callsite entry for a universal changed invariant; regression; API, schema, shared or compatibility contract; security, privacy, permission, or auth concern; data, storage, migration, destructive or external effect; concurrency, recovery, reliability, performance, or resource property; uncertain/flaky/disputed smoke; integration effect; and explicit governing requirement.

Skip a noncompact boundary only when authority shows it is not required, or when the target is demonstrably nonbehavioral prose/comments, formatting-only change, or exact generated refresh with deterministic identity proof. Record the reason, target revision, and identity evidence.

## Stop and next owner

Stop with `INCONCLUSIVE` when the selected profile does not permit dispatch or when the required target, boundary, environment, permission, fixture, proof, independent context, once-bound rule/target manifests and current comparisons, finite consumer map, authority, current or frozen-prior generation, complete backend-frozen action map, target delta, or action/reuse validity is unavailable or contradictory. Return aggregated `NOT VERIFIED`/`INCONCLUSIVE` criterion IDs and exact omitted or rejected actions to the backend for its one possible consolidated owner repair; do not repair, silently downgrade dispatched invalid intake, widen acceptance, rebuild a manifest, dispatch another role, or consume a review slot.
