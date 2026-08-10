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

- one parent `OUT-...` identity, exact owned/affected `AC-...` IDs, and inherited semantic-attempt/post-assurance repair state;
- at least two required isolated lineages, each by immutable identity with its current independent `VERIFIED` Handoff and exact proved criterion IDs;
- governing specification and integration Task Contract revisions;
- declared input completeness, ordering, and precedence;
- exact authority for semantics-preserving mechanical conflicts;
- integration acceptance criteria, integrated smoke, and post-integration proof; and
- exactly one named verification receiver.

Reject single-lineage work and missing, stale, partial, unverified, inconclusive, failed, extra, or final-only-unverified inputs. Arrival order has no precedence. Integration never consumes or restores semantic-attempt or post-assurance repair budget.

## Procedure

1. Recheck the parent outcome, governing authority, inherited budget, and every required verification target. Confirm the input set is exact, independently verified, complete, and contains at least two isolated lineages.
2. Establish a clean combination target and record its base identity before any fan-in effect.
3. Combine all named lineages in declared order. Resolve only explicitly authorized mechanical conflicts whose result preserves every input's semantics.
4. Stop on semantic, product, architecture, scope, data, migration, ownership, or interface conflict. Aggregate every available exact conflict and affected `AC-...` ID once; do not choose a winner, drop a lineage, or repair behavior.
5. Record every conflict and permitted resolution. Prove that each required input and proved criterion identity is represented in the combined result.
6. Emit a new immutable combined identity. Prior lineage verdicts do not verify this new target.
7. Run integrated smoke against the combined identity, including affected shared interfaces, ordering, migrations, startup/build, and cross-lineage paths.
8. Hand the combined target to fresh `dev-verification`. Require post-integration proof for integration acceptance and every input criterion potentially affected by the combination.

## Integration Handoff

Use the common `dev-handoff` structure and include:

```markdown
## Integration
- Parent outcome and governing integration task
- Inherited semantic-attempt and post-assurance repair state
- Target base revision
- Every required isolated lineage, VERIFIED Handoff identity, and exact proved criterion IDs
- Declared ordering and precedence
- Conflict ID → affected criterion IDs → mechanical authority → exact resolution or blocker
- Proof no required lineage or criterion was dropped
- Exact combined revision
- Integrated smoke scenario and observed evidence
- Affected criterion IDs and mandatory post-integration reruns
- Semantic risks and unresolved authority conflicts
## Next receiver
- Fresh verification of the combined revision
```

Evidence from an input may be reused only after explicit no-impact analysis. Any target change after integration invalidates the combined identity and downstream verdicts.

## Permissions

May read exact verified inputs and change only the declared combination target. Must not add missing behavior, repair a worker result, consume or restore budgets, alter canonical authority, choose semantic winners, self-verify the combined target, perform final review, ship, or declare completion.

## Stop and next owner

Stop before combination for fewer than two lineages, incomplete/stale verification, ambiguous precedence, missing mechanical-conflict authority, or unsafe final-only proof. Stop during combination for an aggregated semantic conflict set, unexpected lineage, unsafe partial effect, or changed input identity. Return exact conflict/criterion IDs to the owning lifecycle stage and return a valid combined identity only to `dev-verification`; never reset the lifecycle.
