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
3. Define the smallest coherent architecture: capability boundaries, interfaces, data/state ownership, error behavior, compatibility, migration and rollback, security/privacy, reliability/performance, operational effects, and degraded-operation design that implement the approved requirements. Do not choose new observable fallback, default, retry, alternate-path, or hard-failure behavior. Missing observable policy returns to `dev-requirements`; settled policy with unsafe or ambiguous technical design stops in `dev-specification`.
4. Identify the highest viable observable test seams before implementation. For every acceptance criterion, state the falsifiable claim, conditions/input, expected behavior or threshold, minimum proof class, target surface/environment, and whether baseline/treatment comparison is required.
5. Resolve engineering decisions inside the approved scope. Stop for product, destructive, scope, or materially different architecture choices that require human authority.
6. Draft one revision-bound Engineering Specification. Link authority instead of copying it and mark all material assumptions.
7. Continue automatically when the specification only derives technical detail inside current approved requirements and architecture. If it exposes a new human-owned product, architecture, destructive/external-effect, or shipping choice, request confirmation of that one decision; a caveat or changed decision creates a new revision and invalidates dependent tickets.
8. Hand the current revision to the one next owner in the approved route: `dev-ticketing` when a durable graph is required, otherwise `dev-implementation`. Return to `dev-ask` only when route impact changed.

## Engineering Specification

```markdown
# Engineering Specification: <objective>
## Authority
- Governing artifacts, exact revisions, and approvals
## Current system
- Relevant modules, interfaces, state, constraints, observed baseline, and preservation boundary
## Architecture
- Chosen design, alternatives rejected, and decision owners
## Interfaces and data
- Public/internal contracts, ownership, errors, compatibility, migrations, and approved cutover or removal
## Security and operations
- Security, privacy, reliability, performance, rollout, rollback, external effects, and required degraded trigger → response → recovery design
## Test seams
- Acceptance criterion → proof class → scenario/environment → expected evidence
## Implementation boundaries
- Cohesive ownership, fixed shared contracts, allowed decomposition, and non-goals
## Open decisions
- Question → authority owner → blocking status
## Revision and governing authority
- Current revision, governing approval, and supersession rule
## Next owner
- One exact approved continuation owner: `dev-ticketing` or `dev-implementation`
```

Do not derive runtime state, execute code, verify implementation, or create tickets inside this skill. Do not create a domain artifact unless a qualifying real term or decision receives human confirmation through `dev-domain-modeling`.

## Handoff and continuation

Every exit emits one common Handoff with the exact specification/authority identity, `route-impact: unchanged|changed`, unresolved blocker if any, and exactly one receiver. `unchanged` continues automatically to the next owner already named by the approved route when the specification is a faithful derivation and any newly exposed human-owned decision is confirmed; it does not add a specification-completion or router approval. `changed` returns to `dev-ask` with the changed facts for recomputation. A stop names the exact requirements, product, architecture, or destructive-effect authority owner. This stage never authorizes ticketing or implementation by itself.

## Stop conditions

Stop for stale authority, unresolved product scope, missing architecture/destructive approval, an untestable acceptance contract, unsafe migration/rollback ambiguity, or conflicting ownership. Resume only from a current approved revision.
