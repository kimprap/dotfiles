Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 01, 02, 16
Status: resolved

## Question

What exact lifecycle stages and transitions must the adaptive workflow recognize from initial request through durable decision capture, specification, executable tickets, implementation, debugging, verification, integration, review, and completion, and which existing or new portable skill owns each transition? Include the distinct paths for bugs, architecture improvement, stateless grilling, codebase grilling, foggy multi-session work, and optional prototyping without making every request traverse every stage.

## Answer

Use one thin user-facing router over an adaptive lifecycle. The user invokes it once; it performs only read-only classification, presents a short route overview, and waits for explicit approval before any execution or durable mutation.

### Initial route overview and approval

The overview contains:

1. interpreted goal and current lifecycle state;
2. proposed lane and ordered stage owners;
3. why each nontrivial stage is included or skipped;
4. durable artifacts expected;
5. known human approval/destructive gates;
6. initial execution mode, defaulting to one agent;
7. the first concrete action.

After approval, stages pass a structured baton automatically. The user does not manually invoke every underlying skill. Pause again only for a product, architecture, destructive, or scope decision; a broken shared assumption; an unavailable required capability; or a materially changed route. A changed route receives a new short overview and approval.

Each baton identifies the outcome, authoritative artifact references/revisions, settled and open decisions, observed blockers/evidence, and next eligible owner. The later handoff-contract ticket fixes its exact portable shape.

### Gate precedence

Evaluate gates in this order:

1. **Safety and requested action:** distinguish advice/read-only investigation from state-changing work and surface any destructive or credential gate.
2. **Fog:** if the destination or decision route cannot fit one reliable context, enter Wayfinder before deep product or engineering work.
3. **Product authority and engineering requirements:** when market or product strategy is unresolved, stop with `PRODUCT AUTHORITY REQUIRED` for the human product owner or future product flow. When product authority is sufficient but build-facing behavior, acceptance, scope, or constraints are incomplete, enter `eng-requirements`.
4. **Expected behavior:** diagnose a bug only after expected behavior is settled; a missing engineering expectation enters `eng-requirements`, while a true product decision stops for product authority.
5. **Remaining one-context decisions:** use the appropriate grilling wrapper only when intent, terminology, or architecture decisions remain.
6. **Artifact-depth lane:** choose direct implementation, specification/tickets, or Wayfinder from the settled size/coordination state.
7. **Execution mode:** let the separate implementation backend choose one agent, a small independent batch, or full orchestration under its later contract.

### Non-build routes

- A straightforward question is answered directly when current evidence is sufficient.
- A bounded factual investigation uses the portable research discipline only when real lookup/synthesis is needed. Atlas is optional coverage under its resolved integration contract. Research returns evidence to the requesting stage; it does not become the main lifecycle.
- Stateless plans or decisions with unresolved intent use `grill-me`. Codebase work with unresolved intent, domain language, or architecture decisions uses `grill-with-docs`. Skip both when the supplied contract is already decision-complete.

### Engineering-requirements and fog routes

- Conditional `eng-requirements` owns build-facing behavior, acceptance, engineering scope, constraints, and owned open engineering questions. It preserves an external product brief or PRD when one governs and never performs market or product strategy.
- Wayfinder is a cross-cutting pre-implementation route for work whose decision path is too foggy for one context. It resolves a decision map, never implementation. On completion, re-evaluate authority: unresolved market/product intent stops with `PRODUCT AUTHORITY REQUIRED`; sufficient authority with incomplete build requirements enters `eng-requirements`; complete requirements proceed to the direct or specification lane. Never feed a Wayfinder map directly to implementation.
- A prototype is a temporary decision detour from requirements, grilling, or specification when runnable logic or a visible artifact is required. Use a fresh-context handoff into and out of the prototype. Return the observed decision/evidence to the owning stage; prototype code is not the implementation artifact.

### Engineering and architecture routes

- `eng-improve-codebase-architecture` surveys for deepening opportunities. Selecting one produces a change idea and returns to the engineering-requirements/intent gates; it does not silently start refactoring.
- `eng-codebase-design` remains a model-invoked design discipline used by grilling, specification, diagnosis, and implementation rather than a mandatory user-facing stage.
- `eng-diagnosing-bugs` owns hard bugs and performance regressions after expected behavior is clear. It establishes a tight red-capable feedback loop, reproduces and minimises, tests hypotheses, and returns either a bounded fix contract, an evidence-backed blocker, or an architecture finding. A fix enters the selected implementation lane; a missing seam returns through architecture design/improvement before implementation.

### Artifact-depth lanes

**Direct lane:** use a bounded direct implementation contract when all are true:

- external product authority when applicable, engineering requirements, and architecture decisions are settled;
- one cohesive owner can complete it in one fresh context;
- no multi-session recovery or independent task graph is required;
- shared interfaces and migration/destructive effects are absent or already explicitly approved;
- scope, observable acceptance, and verification are concrete.

The direct contract is the approved route overview plus the settled acceptance/verification context. It does not require a separate PRD, engineering-specification artifact, or ticket set.

**Specification-and-ticket lane:** use a durable engineering specification followed by blocked tracer-bullet tickets when the route is visible but any of these apply:

- work requires multiple implementation contexts or owners;
- independent slices or integration ordering must be coordinated;
- shared interfaces, migrations, cross-cutting behavior, or durable recovery require a stable authority;
- acceptance/testing seams need durable confirmation across sessions.

The engineering-specification skill consumes approved engineering requirements and any governing external product brief or PRD. It explores the codebase, proposes the highest viable testing seams, returns unresolved product questions to external product authority and architecture questions to their owner, and publishes a human-approved engineering authority. The ticketing skill then derives vertical, demoable slices with explicit blockers and receives human approval before publication.

**Wayfinder lane:** use Wayfinder when the route itself is not yet specifiable. Once its frontier is empty, re-enter the product-authority and engineering-requirements gates and collapse the map into coherent authority before deriving tickets.

### Implementation-to-completion spine

After a direct contract or an approved ticket becomes executable:

1. **Implementation backend:** select execution mode and dispatch bounded implementation ownership; one agent is the default.
2. **Implementation:** build against the approved contract, using TDD only at agreed public seams and diagnosis when an unexpected failure lacks a known cause.
3. **Implementer smoke proof:** exercise the changed behavior and record observed evidence before independent verification.
4. **Independent verification:** evaluate acceptance without repairing the target.
5. **Neutral integration:** when isolated branches/slices exist, integrate them as a named task under an explicit conflict policy, then verify the integrated result.
6. **Final review:** review the resulting change separately against repository standards and the governing product/engineering authority; review findings return to their owning stage for correction.
7. **Continual learning:** after the outcome is settled and before final handoff/session stop, run the project-scoped learning gate under its later contract. Never modify user-level `AGENTS.md`.
8. **Completion:** report changed artifacts, observed verification, unresolved real risk, and authoritative artifact/ticket status. No stage declares completion from a handoff, green typecheck alone, or unintegrated branch.

The verification, integration, failure/retry, role, and continual-learning tickets may deepen these stages but may not reorder ownership silently.

### Cross-cutting handoff

Handoff is not a mandatory linear stage. Use it when a context approaches its reliable limit, a prototype/research branch needs a fresh session, or a host requires durable recovery. It references canonical PRD/spec/ticket/decision artifacts rather than duplicating them and returns control to the current lifecycle owner.
