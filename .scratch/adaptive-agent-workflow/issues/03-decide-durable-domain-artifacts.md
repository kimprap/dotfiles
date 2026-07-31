Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Status: resolved

## Question

Because this repository has no `CONTEXT.md`, `CONTEXT-MAP.md`, or ADR directory, should the eventual workflow implementation create any of them, and under exactly what trigger and ownership policy? A `CONTEXT.md` glossary preserves resolved ubiquitous language without implementation detail; an ADR preserves a hard-to-reverse, surprising decision reached through a real trade-off. Decide whether either benefit justifies the durable context and maintenance cost, without creating the artifacts during Wayfinding.

## Answer

Adopt a lazy glossary plus rare ADRs:

- Create a root `CONTEXT.md` only when the first canonical domain term is resolved. Keep it strictly to ubiquitous language and relationships; exclude implementation detail, specifications, and workflow state.
- Create `CONTEXT-MAP.md` only when multiple bounded contexts actually require separate glossaries. A large repository alone is not sufficient.
- Create `docs/adr/` only when the first confirmed decision is simultaneously hard to reverse, surprising without its rationale, and the result of a real trade-off. Ordinary implementation choices remain in specifications, plans, or tickets.
- The session that resolves the term or qualifying decision owns the write immediately after human confirmation. The router and implementation backend may route to `domain-modeling`, but they do not duplicate its artifact rules.
- Do not create any canonical artifact merely to scaffold the workflow. This policy decision introduces no new domain term and is reversible, so it does not itself trigger a glossary or ADR.
