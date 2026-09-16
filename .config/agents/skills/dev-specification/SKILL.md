---
name: dev-specification
description: Turn approved engineering requirements into a revision-bound technical specification with architecture, interfaces, effects, migration, and directly checkable acceptance.
---

# Dev Specification

Produce technical implementation authority from settled product/engineering requirements. Do not implement, reopen product strategy, invent shipping authority, or encode orchestration machinery.

## Intake

Require approved outcome, observable acceptance, scope and non-goals, constraints, allowed effects, current repository facts, and any human-owned architecture or destructive decision. Return unresolved product or material architecture choices to their owner rather than guessing.

Use `canonical-project-contracts` when a durable repository contract governs the design. Research only facts that current evidence cannot establish.

Before drafting, resolve the current approved requirements and applicable
canonical project contracts. Read
`skill://dev-ticketing/references/task-sizing.md` when selecting new
implementation boundaries and
`skill://dev-implementation/references/test-value.md` when selecting new proof.
Reuse current material already loaded and retrieve missing or stale sources;
never substitute remembered summaries.

## Procedure

1. Inspect the current owners, interfaces, callers, state, persistence, tests, and migration constraints relevant to the approved outcome.
2. Define the smallest architecture that fits existing module ownership and local conventions. State component responsibilities, dependency direction, data flow, error behavior, security/privacy boundaries, and observability only where the outcome needs them.
3. Specify public interfaces, data shapes, invariants, state transitions, compatibility, migration/cutover, rollback, and permitted non-repository effects. Prefer a clean cutover; do not preserve aliases or obsolete paths unless authority requires compatibility.
4. Apply the already-resolved task-sizing guidance to each new implementation boundary. One cohesive child stays a direct contract; multiple owners/dependencies, fan-in, ordered effects/migration, or likely cross-context recovery require a lean plan. Record the material sizing choice in the specification's existing ownership discussion rather than adding metadata.
5. Apply the already-resolved common proof-selection principles before selecting concrete checks. Keep material selection rationale in the existing acceptance/test-seam discussion. Assign stable `AC-*` labels. Every criterion must be observable and use exactly:

   ```text
   Behavior: <observable>
   Check: <command or direct static proof>; expect <exact result>
   ```

   Commands name the real surface and exact expected result. Static proof is allowed only when behavior is inherently structural; this direct check is the sole acceptance-check shape.
6. Define test seams that let implementation exercise each behavior without exposing private production machinery. Apply the referenced policy's permanent-only requirements when proposing retained tests; do not copy that policy.
7. Record material assumptions, known risks, explicit stops, and recovery boundaries. Continue through engineering details inside authority; request human confirmation for changed product behavior, destructive/external effects, materially different architecture, or shipping.
8. After producing a substantive specification candidate, apply
   `~/.agents/references/plan-rethink.md` once before final submission or
   Handoff. An inline author explicitly reads it as a separate post-candidate
   step. A delegated author first returns the candidate, then applies the
   caller's explicit follow-up in that same author. Make at most one bounded
   correction to author-owned technical decisions; otherwise preserve the
   candidate. An exact unchanged projection does not trigger another pass.

## Specification shape

Keep the artifact concise and revision-bound:

- Authority and approved outcome
- Current system and constraints
- Architecture and ownership
- Interfaces, data, invariants, and errors
- Effects, migration, rollback, and compatibility
- Acceptance with stable IDs and direct checks
- Test seams
- Implementation boundaries and dependencies
- Risks, assumptions, stops, and open decisions
- Revision and next owner

Link governing authority rather than duplicating it. Name exact paths/surfaces where known, but leave scheduling and lifecycle to `dev-ticketing` and `dev-implementation`.

## Completion

A complete specification accounts for every requirement and effect, leaves no unresolved implementation placeholder, and gives each acceptance item one executable or direct static check with an exact expected result. Return one lean `dev-handoff` to the concrete bound route owner with next-owner role `dev-ticketing` or `dev-implementation` for the approved direct lane. Reaching `dev-implementation` activates that bound owner's controller role in place unless the approved topology already names a separate controller. Add `Route impact` only because this role owns that lifecycle decision.