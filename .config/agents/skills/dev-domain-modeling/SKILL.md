---
name: dev-domain-modeling
description: Build or sharpen canonical domain terminology and qualifying architectural decisions when a human asks for durable domain modeling or an owner skill explicitly needs it. Skip passive glossary reading, ordinary documentation, implementation design, and unconfirmed writes.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* `CONTEXT.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily and only through the durable-write gate below. A first approved glossary write may create `CONTEXT.md`; create `CONTEXT-MAP.md` only when multiple bounded contexts require separate glossaries; a first approved ADR may create its `docs/adr/` directory.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Gate every durable domain write

First qualify the artifact: a resolved canonical term may update or create the relevant `CONTEXT.md`; `CONTEXT-MAP.md` requires multiple real bounded contexts; an ADR must satisfy all three criteria below. Then bind exact durable-write authority. Normally, show the exact proposed content and destination and obtain explicit human confirmation for that exact write. An exact current human-approved plan or decision artifact that already names the content and destination is itself the durable-write authority for only that exact materialization; record its immutable identity and do not ask for duplicate confirmation. Any synthesis, omission, changed wording, changed destination, or expanded decision beyond that approved content still requires fresh exact confirmation. Silence, conversational resolution, approval of an unrelated artifact, or a caller's assumption is not confirmation. Apply this gate identically for direct calls and for `dev-requirements`, `dev-grilling`, `grill-with-docs`, Wayfinder, or architecture-survey callers. Use [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) or [ADR-FORMAT.md](./ADR-FORMAT.md) only after the gate.

`CONTEXT.md` must contain no implementation detail. It is a glossary, not a specification, scratch pad, or repository for implementation decisions.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

## Result, stop, and receiver

Return only the qualified glossary/context-map/ADR delta or an exact no-write/blocker result, its authority revision, destination and before/after identity, changed terms or decisions, rejected alternatives when applicable, and `route-impact: unchanged|changed` in one Common Handoff. Name exactly one receiver: the requesting lifecycle owner when its route remains current, or `dev-ask` when the confirmed domain decision materially changes route facts.

Stop without writing for missing or stale authority, an artifact that does not qualify, unresolved terminology or architecture authority, a concurrent destination change that cannot be safely rebound, or any content/destination delta not covered by exact human approval. This discipline never chooses product scope, implementation architecture outside a qualifying confirmed ADR, a route, or a downstream stage.
