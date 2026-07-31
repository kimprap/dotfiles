---
name: dev-ticketing
description: >
  Derive a human-approved, acyclic graph of vertical implementation tickets from
  an approved engineering specification. Use when multiple owners, dependency
  fan-in, recovery, or durable acceptance require tickets; skip for cohesive
  direct work and never implement or redesign the specification.
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
5. Give each ticket one observable objective, behavioral/state ownership, fixed shared contracts, explicit non-goals, criterion-level acceptance, verification scenarios/evidence, decomposition permission, isolation/integration needs, decision gates, and expected receiver.
6. Ensure at least one early vertical tracer bullet can exercise the real seam without creating a horizontal scaffold or placeholder.
7. Account for every specification criterion exactly once as owned work or explicit shared verification. Do not invent retries, runtime mechanisms, adapter bindings, or shipping.
8. Present the dependency-wired graph for explicit human approval before publication. A caveat or changed interface creates a new ticket-set revision.
9. Hand approved tickets to `dev-implementation` through `dev-ask`.

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
- Observable criterion per bullet
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

## Next owner

Return the approved ticket-set revision to `dev-ask` for `dev-implementation` routing.

## Graph checks and stops

Before approval, prove stable unique names, no dependency cycle, no missing blocker, no unowned criterion, no overlapping behavioral/state authority, no dependent tasks marked independent, and no ticket that changes the governing contract. Stop and return defects to requirements, specification, or human authority rather than repairing them in place.
