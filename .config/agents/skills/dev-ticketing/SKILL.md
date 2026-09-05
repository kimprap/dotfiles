---
name: dev-ticketing
description: Derive an acyclic graph of vertical implementation tickets with exact ownership, dependencies, direct checks, and one receiver per ticket.
---

# Dev Ticketing

Turn a current approved engineering specification into executable implementation ownership. Do not redesign the specification, implement code, add assurance-tail tickets, or create orchestration artifacts beyond the lean graph.

## Intake

Require the current specification revision, stable `AC-*` items with exact direct checks, affected paths/surfaces, dependency and migration constraints, allowed effects, assurance level, and next implementation owner. Stop for stale authority, unresolved product/architecture decisions, or acceptance that cannot be assigned without changing scope.

Use this skill only when work genuinely needs multiple owners, dependencies, fan-in, ordered effects/migration, or durable cross-context recovery. If one child can own the cohesive result, return that direct-contract recommendation instead of manufacturing tickets.

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

   Preserve the direct check unchanged; do not substitute indirect or model-scored evidence.
6. State permitted effects and recovery/stop conditions where they constrain an owner. Preserve project instructions and explicit TDD authority, but do not create method, review, verification, learning, audit, shipping, or presentation tickets; runtime schedules those boundaries.

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

Return one lean `dev-handoff` to the implementation controller with the graph, direct-contract alternative if applicable, exact local delta, blockers/risks, and one receiver. Add `Route impact` because ticket topology is lifecycle-owned here.