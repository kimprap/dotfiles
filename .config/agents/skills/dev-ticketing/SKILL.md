---
name: dev-ticketing
description: Derive an acyclic graph of vertical implementation tickets with exact ownership, dependencies, direct checks, and one receiver per ticket.
---

# Dev Ticketing

Turn a current approved engineering specification into executable implementation ownership. Do not redesign the specification, implement code, add assurance-tail tickets, or create orchestration artifacts beyond the lean graph.

## Intake

Require the current specification revision, stable `AC-*` items with exact direct checks, affected paths/surfaces, dependency and migration constraints, allowed effects, assurance level, and next implementation owner. Stop for stale authority, unresolved product/architecture decisions, or acceptance that cannot be assigned without changing scope.

Use this skill only when work genuinely needs multiple owners, dependencies, fan-in, ordered effects/migration, or durable cross-context recovery. If one child can own the cohesive result, return that direct-contract recommendation instead of manufacturing tickets.

Before drafting a new graph, resolve the current bound specification and read
`skill://dev-ticketing/references/task-sizing.md`, the single owner of the
sizing heuristic. If the graph is authored as an execution plan, also read
`rule://plan` and `rule://plan-impl-spec`; load storage and the actual harness
companion only when publishing. Reuse current sources already loaded and
retrieve missing or stale sources. Apply sizing to each proposed task and
explain any material boundary choice in existing surrounding plan prose; never
add sizing fields or manufacture a graph for one cohesive direct task.

## Derive the graph

1. Slice vertically by observable behavior. Each ticket should deliver a usable contract slice rather than a horizontal layer or scaffold.
2. Give each ticket one stable `T*` ID, one concrete owner, exact owned paths/surfaces, one or more specification acceptance IDs, and exactly one receiver.
3. Assign every changed target and acceptance ID to exactly one ticket. Split an interface boundary only when ownership remains explicit; never let sibling tickets mutate the same target.
4. Add only true producer-to-consumer dependencies. Keep independent work independent and verify that the graph is acyclic. A fan-in or migration step is an authored child-owned ticket, not parent implementation work.
5. Copy every owned acceptance item unchanged:

   ```text
   Behavior: <observable>
   Check: <command or direct static proof>; expect <exact result>
   ```

   Preserve the direct check unchanged, including any authored shared scenario and each criterion's exact expected observation; shared execution is not merged acceptance or ownership. Do not substitute indirect or model-scored evidence or optimize checks during projection. A changed check meaning returns to the specification owner.
6. State permitted effects and recovery/stop conditions where they constrain an owner. Preserve project instructions, but do not create method, review, verification, learning, audit, shipping, or presentation tickets; runtime schedules those boundaries.
7. After producing a substantive graph candidate, including a graph that newly
   selects ownership or dependencies while projecting acceptance unchanged,
   apply `~/.agents/references/plan-rethink.md` once before final submission for
   approval, execution readiness, or Handoff. An inline author explicitly reads
   it as a separate post-candidate step. A delegated author first returns the
   candidate, then applies the caller's explicit follow-up in that same author.
   Make at most one bounded
   correction to graph decisions this role owns; return out-of-authority
   changes to their owner. An exact unchanged projection of an already approved
   graph does not trigger another pass.

## Ticket shape

```text
T<n>. <vertical intent>
Owner: <one child>
Depends on: none | <T IDs>
Targets: <exact comma-separated paths/surfaces>
Acceptance: <owned AC IDs>
Receiver: <one owner>
```

List each owned acceptance item under the ticket with its exact Behavior and Check lines. Keep shared outcome, authority, global scope/effects, and recovery in the surrounding lean plan rather than copying them into every ticket.

## Validate and hand off

Before publication, confirm unique task and acceptance IDs, one owner per target and criterion, no dangling or cyclic dependency, no empty ticket, and a receiver for every edge and terminal result. Preserve specification wording; a changed interface, material ownership/topology change, destructive/external effect, or new acceptance requires a revised authority/specification rather than a ticketing guess.

Return one lean `dev-handoff` with the graph, direct-contract alternative if applicable, exact local delta, blockers/risks, next-owner role `dev-implementation`, and the concrete bound controller receiver. The route-owning agent activates that controller role in place unless the approved topology already names a separate controller. Add `Route impact` because ticket topology is lifecycle-owned here.