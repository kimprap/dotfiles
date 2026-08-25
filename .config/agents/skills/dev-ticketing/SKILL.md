---
name: dev-ticketing
description: >
  Derive an acyclic graph of vertical implementation tickets from a current
  engineering specification. Use when multiple owners, dependency fan-in,
  recovery, or durable acceptance require tickets; skip for cohesive direct work
  and never implement or redesign the specification.
---

# Engineering Ticketing

Own derivative execution tickets. The approved specification remains authority; tickets project it without redesign.

## Intake

Require an approved Engineering Specification revision, every governing requirements/product revision it binds, fixed shared interfaces and ownership, observable acceptance and verification recipes, and explicit approval for migrations or destructive effects.

Reject stale or conflicting authority, unresolved product/architecture/scope decisions, missing test seams, ambiguous ownership, or a cyclic/unnamed blocker.

## Procedure

1. Bind the ticket set to exact governing revisions and approvals.
2. Identify the minimum vertical tracer bullets that each produce a demonstrable behavior. Keep coupled files, interfaces, state, and reasoning under one owner; path separation alone is not independence.
3. Declare every dependency by stable ticket name and exact upstream artifact or Handoff. Dependencies carry explicit context, never ambient sibling state.
4. Order tickets into an acyclic graph. Fan-out consumers bind the same upstream revision; fan-in names every required lineage and gives arrival order no precedence.
5. Give each ticket one observable objective, behavioral/state ownership, fixed shared contracts, explicit non-goals, stable acceptance-criterion IDs, verification scenarios/evidence, decomposition permission, isolation/integration needs, decision gates, and expected receiver. When affected, project the governing specification's compatibility/degraded-behavior decision into those existing fields without reinterpreting it.
6. Ensure at least one early vertical tracer bullet can exercise the real seam without creating a horizontal scaffold or placeholder.
7. Account for every specification criterion exactly once as owned work or explicit shared verification. Do not invent retries, runtime mechanisms, adapter bindings, todos, or shipping.

Copy each specification-owned `surface-proof-recipe/v1` object and `VR-...@sha256:...` identity unchanged into the owning vertical ticket. Never split one criterion across recipes, invent an adapter binding, or recanonicalize different bytes as an equivalent recipe. If a direct-authority ticket has no specification, the implementation backend owns complete recipe derivation before readiness.

Ticket dependencies include every recipe fixture and dependency identity, plus every finite current consumer/callsite entry carried in recipe `inputs`. Adapter presence changes no graph edge, proof class, assurance profile, lifecycle depth, topology, owner, or receiver.
8. Validate the graph before publication. A faithful acyclic projection continues automatically under the approved route. If the graph exposes a changed interface, material ownership/topology change, destructive/external effect, shipping action, or another human-owned decision, stop for confirmation and create a new ticket-set revision after it is settled.
9. Return an `unchanged` Handoff directly to `dev-implementation` when that is the already-approved next owner. Return to `dev-ask` only when route impact changed.

## Ticket shape

```markdown
# <stable ticket name>
## Authority
- Governing specification and requirements revisions
- Required human approvals
## Objective
- One observable vertical outcome
## Ownership
- May read
- May change or produce
- Must not change
- Fixed shared interfaces or state
## Dependencies
- Blocking ticket names
- Exact upstream handoffs or artifact revisions
## Acceptance
- Stable acceptance-criterion ID → observable criterion
## Verification
- Scenario, environment, proof class, and evidence per criterion
## Execution policy
- Decomposition permission
- Isolation and integration needs
- Material decision gates
## Completion output
- Required artifacts and next receiver
```

The backend later projects this shape into Task Contracts and runtime state. Do not create implementation artifacts, runtime mechanisms, verification verdicts, integration results, or shipping effects here.

## Handoff and next owner

Emit one common Handoff with the exact ticket-set/specification identity, `route-impact: unchanged|changed`, graph/criterion accounting, unresolved blocker if any, and exactly one receiver. `unchanged` names `dev-implementation` and continues the already-approved route without an artifact-completion or intermediate router approval. `changed` names `dev-ask` for recomputation. A blocked graph names its exact requirements, specification, architecture, or human authority owner. The derivative Handoff does not authorize implementation by itself.

## Graph checks and stops

Before publication and continuation, prove stable unique names, no dependency cycle, no missing blocker, no unowned criterion, no overlapping behavioral/state authority, no dependent tasks marked independent, and no ticket that changes the governing contract. Stop with one Handoff to the exact owner of any requirements, specification, architecture, or human-authority defect rather than repairing it in place.
