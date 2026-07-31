---
name: dev-integration
description: >
  Neutrally combine every named verified lineage into one new immutable target
  under declared ordering and mechanical-conflict authority. Use only for fan-in
  after independent verification; skip single-lineage work and stop rather than
  dropping an input, repairing behavior, or choosing a semantic winner.
---

# Engineering Integration

Own neutral fan-in. Integration combines exact verified inputs; it does not supply missing behavior or decide product, architecture, scope, or interface semantics.

## Intake

Require:

- every required lineage by immutable identity with current `VERIFIED` Handoff;
- governing specification and integration Task Contract revisions;
- declared input completeness, ordering, and precedence;
- exact authority for semantics-preserving mechanical conflicts;
- integration acceptance criteria, integrated smoke, and post-integration proof; and
- a named verification receiver.

Reject missing, stale, partial, unverified, inconclusive, failed, or extra lineages. Arrival order has no precedence.

## Procedure

1. Recheck governing authority and every required verification target. Confirm the input set is exact and complete.
2. Establish a clean combination target and record its base identity before any fan-in effect.
3. Combine all named lineages in declared order. Resolve only explicitly authorized mechanical conflicts whose result preserves every input's semantics.
4. Stop on semantic, product, architecture, scope, data, migration, ownership, or interface conflict. Return the exact conflict and competing authorities; do not choose a winner or drop a lineage.
5. Record every conflict and permitted resolution. Prove that each required input is represented in the combined result.
6. Emit a new immutable combined identity. Prior lineage verdicts do not verify this new target.
7. Run integrated smoke against the combined identity, including affected shared interfaces, ordering, migrations, startup/build, and cross-lineage paths.
8. Hand the combined target to fresh `dev-verification`. Require post-integration proof for integration acceptance and every input criterion potentially affected by the combination.

## Integration Handoff

Use the common `dev-handoff` structure and include:

```markdown
## Integration
- Governing integration task and target base revision
- Every required lineage and VERIFIED Handoff identity
- Declared ordering and precedence
- Conflicts → mechanical authority → exact resolution
- Proof no required lineage was dropped
- Exact combined revision
- Integrated smoke scenario and observed evidence
- Affected criteria and mandatory post-integration reruns
- Semantic risks and unresolved authority conflicts
## Next receiver
- Fresh verification of the combined revision
```

Evidence from an input may be reused only after explicit no-impact analysis. Any target change after integration invalidates the combined identity and downstream verdicts.

## Permissions

May read exact verified inputs and change only the declared combination target. Must not add missing behavior, repair a worker result, alter canonical authority, choose semantic winners, self-verify the combined target, perform final review, ship, or declare completion.

## Stop and next owner

Stop before combination for incomplete/stale verification, ambiguous precedence, or missing mechanical-conflict authority. Stop during combination for a semantic conflict, unexpected lineage, unsafe partial effect, or changed input identity. Return authority conflicts to the owning lifecycle stage and return a valid combined identity only to `dev-verification`.
