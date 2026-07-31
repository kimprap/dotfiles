---
name: dev-specification
description: >
  Turn approved engineering requirements into a revision-bound technical
  specification covering architecture, interfaces, data, migrations, and test
  seams. Use for durable multi-context or cross-cutting work; skip for a settled
  one-context direct implementation and return product questions to their owner.
---

# Engineering Specification

Own technical decisions and the durable implementation authority for work that cannot safely use the direct lane.

## Intake

Require current approved engineering requirements or equivalent settled authority, exact governing product/request revisions when present, explicit non-goals and constraints, and owners for unresolved product or architecture decisions.

Reject stale, conflicting, or unapproved requirements. Return material product questions to external product authority. Do not answer them with technical assumptions.

## Procedure

1. Bind the specification to exact governing revisions and approvals. Record superseded revisions without treating them as current.
2. Inspect the current system and reuse its terminology, modules, interfaces, state ownership, and test conventions. Preserve unexpected work.
3. Define the smallest coherent architecture: capability boundaries, interfaces, data/state ownership, error behavior, compatibility, migration and rollback, security/privacy, reliability/performance, and operational effects that the requirements demand.
4. Identify the highest viable observable test seams before implementation. For every acceptance criterion, state the falsifiable claim, conditions/input, expected behavior or threshold, minimum proof class, target surface/environment, and whether baseline/treatment comparison is required.
5. Resolve engineering decisions inside the approved scope. Stop for product, destructive, scope, or materially different architecture choices that require human authority.
6. Draft one revision-bound Engineering Specification. Link authority instead of copying it and mark all material assumptions.
7. Obtain explicit human approval. A caveat or changed decision creates a new revision and invalidates dependent tickets.
8. Hand the approved revision to `dev-ticketing` when a durable graph is required, otherwise to `dev-ask` for implementation routing.

## Engineering Specification

```markdown
# Engineering Specification: <objective>
## Authority
- Governing artifacts, exact revisions, and approvals
## Current system
- Relevant modules, interfaces, state, constraints, and preservation boundary
## Architecture
- Chosen design, alternatives rejected, and decision owners
## Interfaces and data
- Public/internal contracts, ownership, errors, compatibility, and migrations
## Security and operations
- Security, privacy, reliability, performance, rollout, rollback, and external effects
## Test seams
- Acceptance criterion → proof class → scenario/environment → expected evidence
## Implementation boundaries
- Cohesive ownership, fixed shared contracts, allowed decomposition, and non-goals
## Open decisions
- Question → authority owner → blocking status
## Approval and revision
- Approved revision and supersession rule
## Next owner
- `dev-ticketing`, or `dev-ask` for a qualified direct implementation route
```

Do not derive runtime state, execute code, verify implementation, or create tickets inside this skill. Do not create a domain artifact unless a qualifying real term or decision receives human confirmation through `dev-domain-modeling`.

## Stop conditions

Stop for stale authority, unresolved product scope, missing architecture/destructive approval, an untestable acceptance contract, unsafe migration/rollback ambiguity, or conflicting ownership. Resume only from a current approved revision.
