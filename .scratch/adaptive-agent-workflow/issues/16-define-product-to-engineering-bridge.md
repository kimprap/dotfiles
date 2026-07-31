Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 15, 17
Status: resolved

## Question

What exact boundary should the engineering workflow enforce between external product authority and build-facing engineering requirements? Decide what input `eng-flow` may accept, when a dedicated requirements gate is useful rather than redundant, which product decisions must return to a separate human or future product-development flow, what proportional authority artifact crosses into engineering specification, and how feasibility conflicts or product changes return for revision without letting engineering invent product strategy.

## Answer

Use a conditional `eng-requirements` capability between `eng-flow` and engineering specification. It is not a product-development orchestrator and does not create product strategy or a general PRD.

`eng-requirements` remains useful after a dedicated product flow exists because the two authorities differ:

- The future product flow owns opportunity discovery, customer and market validation, target market, product strategy, positioning, business model, pricing, prioritization, roadmap, launch/go-to-market, sales, success measures, growth, and the human-approved product brief or PRD.
- `eng-requirements` owns the narrower question “what observable, bounded contract must engineering satisfy?” It translates or clarifies approved intent without changing it.
- `eng-specification` then owns how the contract will be built: architecture, interfaces, data design, implementation decisions, technical seams, and test strategy.

The product flow may request bounded engineering feasibility evidence, but it does not create engineering requirements or technical design. Engineering may report a feasibility conflict, but it may not silently modify product authority.

### Entry and skip gate

`eng-flow` may begin from any of:

1. a human-approved external product brief or PRD;
2. an explicit, settled engineering request whose product authority is already clear;
3. a bounded non-product engineering objective such as a bug fix, security repair, maintenance task, migration, refactor, internal tooling change, reliability improvement, or architecture improvement.

Run `eng-requirements` only when build-facing behavior, acceptance, boundaries, or constraints are incomplete. Skip it when the approved request, ticket, decision map, or PRD already provides a sufficient executable requirements contract.

An external PRD is therefore not universally required. Requiring one for every bug, maintenance change, internal tool, or technical improvement would add product ceremony without adding authority.

### Missing product authority

If the request needs unresolved customer, market, positioning, pricing, business-model, roadmap, launch, growth, or product-scope decisions, `eng-flow` stops with:

```text
PRODUCT AUTHORITY REQUIRED
Unresolved decisions: <specific product questions>
Current safe evidence: <artifact/evidence references>
Next owner: <human product owner or future product flow>
Resume input: <approved product brief/PRD revision or explicit settled decision>
```

The router may identify the missing authority but does not conduct a provisional product interview, proceed on assumptions, or create a substitute PRD. Until the separate product flow exists, the human product owner is the authority.

### Engineering-requirements contract

`eng-requirements` may establish only:

1. expected observable behavior or engineering outcome;
2. actors, systems, and operating context already authorized by the source;
3. acceptance criteria and failure boundaries;
4. engineering scope and non-goals;
5. compatibility, migration, data-preservation, security, privacy, reliability, performance, and operational constraints when applicable;
6. evidence versus explicit assumptions;
7. unresolved engineering questions, their owners, and whether they block specification.

It may use bounded `eng-research`, `eng-grilling`, `eng-domain-modeling`, or `eng-prototype` support when their own gates are met. Those capabilities return evidence or human decisions to the requirements owner; they do not expand product scope.

It may not decide or rewrite target market, customer need, positioning, pricing, business model, roadmap priority, launch strategy, sales motion, growth strategy, product success, or go/no-go authority.

### Proportional artifact

- When the incoming approved artifact already contains sufficient requirements, bind the baton to that exact revision and do not duplicate it.
- For one-context direct work, the approved route overview plus explicit acceptance may be sufficient.
- When clarification must survive contexts or govern a later specification, publish one revision-bound Engineering Requirements Brief through the configured tracker adapter.
- Any synthesized or materially clarified requirement needs explicit human approval before engineering specification or implementation consumes it. Silence and agent inference are not approval.

The brief references an external PRD when one exists but never copies or mutates its product decisions.

### Engineering handoff and return

- `eng-specification` consumes the approved engineering-requirements authority and any governing external product artifact.
- A technical feasibility, cost, security, operational, or sequencing concern may be resolved inside engineering only when it does not change product intent.
- A material product-scope, outcome, market, launch, or priority change returns with evidence to the external product authority or future product flow.
- A revised product artifact receives new human approval and forces affected requirements, specifications, and tickets to rebind or regenerate when their contract changed.
- After requirements and specification are approved, the existing ticketing and implementation flow resumes. The product flow is not repeated unless product authority becomes incomplete or changes.
