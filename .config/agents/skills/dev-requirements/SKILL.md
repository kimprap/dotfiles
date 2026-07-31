---
name: dev-requirements
description: >
  Establish a bounded, observable engineering requirements contract when product
  authority is sufficient but behavior, acceptance, scope, or constraints are
  incomplete. Skip when the build contract is already complete, and stop rather
  than deciding product strategy or implementation architecture.
---

# Engineering Requirements

Own the build-facing contract between approved product authority or a bounded engineering request and downstream engineering specification or direct implementation.

## Authority boundary

Accept one of:

- an approved external product brief or PRD with its revision;
- a settled engineering request with clear product authority; or
- a bounded non-product objective such as a bug, security repair, migration, maintenance, refactor, reliability, architecture, or internal-tooling change.

Own only observable behavior and outcomes, already-authorized actors and context, acceptance and failure boundaries, engineering scope and non-goals, applicable constraints, evidence, explicit assumptions, and engineering questions with owners.
For every change that can affect existing observable behavior, bind evidenced current callers, data, protocols, normal behavior, and failure/degraded behavior that remain in contract. Changing that contract through a compatibility break, removal, clean cutover, new hard-failure path, or new fallback requires explicit approved authority. Missing evidence or authority is a blocking engineering question; it authorizes neither a breaking change nor a graceful fallback. Do not authorize speculative compatibility layers, defaults, retries, or alternate paths; preserve only evidenced existing or explicitly required behavior.

Do not decide customers, market, positioning, pricing, business model, roadmap, launch, growth, product scope, product success, architecture, interfaces, or implementation. When any product decision is unresolved, return exactly:

```text
PRODUCT AUTHORITY REQUIRED
Unresolved decisions: <specific product questions>
Current safe evidence: <artifact/evidence references>
Next owner: <human product owner or future product flow>
Resume input: <approved product brief/PRD revision or explicit settled decision>
```

Do not interview around that stop or create a substitute PRD.

## Procedure

1. Bind every governing artifact and explicit decision to an immutable revision or digest. Reject stale, conflicting, or unapproved authority.
2. Determine whether the observable engineering contract is already complete. If it is, return the bound authority and recommend skipping this stage.
3. Resolve only missing engineering-facing behavior, acceptance, scope, constraints, and owned questions. Use bounded `dev-research`, `dev-grilling`, `dev-domain-modeling`, or a disposable `dev-prototype` only when that evidence is necessary; none may expand product scope.
4. Separate established evidence from assumptions. Assign every unresolved question an owner and blocking status.
5. Draft one revision-bound Engineering Requirements Brief when durable coordination needs it. For one-context direct work, the approved Route Overview plus explicit acceptance may remain the contract.
6. Obtain explicit human approval for every synthesized or materially clarified requirement. A caveat or change creates a new revision; silence is not approval.
7. Hand the approved revision to `dev-specification`, or to `dev-ask` for a qualified direct-implementation route.

## Engineering Requirements Brief

```markdown
# Engineering Requirements Brief: <objective>
## Authority
- Governing product/request artifacts and exact revisions
- Required approvals
## Observable behavior
- Actor/context/input → expected outcome
- Failure and boundary behavior
## Acceptance
- Falsifiable criterion, conditions, threshold, and target surface per bullet
## Scope
- Included engineering work
- Non-goals
## Constraints
- Compatibility, migration, preservation, security, privacy, reliability, performance, and operational limits that apply
## Evidence and assumptions
- Established evidence with sources
- Explicit assumptions
## Open engineering questions
- Question → owner → blocking status
## Next owner
- Direct implementation or engineering specification
```
For compatibility and degraded behavior, `Observable behavior` names actor/context/input, normal behavior, and each failure/degraded trigger → observable response → recovery boundary. `Constraints` names preserved callers, data, protocols, and behavior plus every approved break, removal, clean-cutover, or hard-failure condition. `Evidence and assumptions` identifies the observed baseline. Preservation may be `none` only with baseline evidence that no existing observable contract is affected; required degraded behavior may be `none` only when approved failure-boundary authority says no degraded path is required; approved breaks, removals, clean cutovers, and hard failures may be `none` only when authority approves no such change.

Do not create `CONTEXT.md`, `CONTEXT-MAP.md`, or an ADR. A real domain term or qualifying architectural decision may be written only after human confirmation through `dev-domain-modeling`.

## Stop conditions

Stop for missing product authority, stale/conflicting authority, a material product change, unowned blocking questions, or missing required human approval. A revised product artifact invalidates affected requirements and all downstream bindings until they are rebound and reapproved.
