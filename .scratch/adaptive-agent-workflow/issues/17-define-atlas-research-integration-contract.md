Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 15
Status: resolved

## Question

How should the portable research capability integrate with the user's Atlas framework at `/Users/kim/dev/atlas/app` without making Atlas, one vault, or one scheduler mandatory? Decide which layer owns research methodology, web retrieval, evidence ingestion, provenance, durable source and topic artifacts, freshness-gated lookup, refresh, and the intended future daily acquisition cadence; define capability detection and fallback while Atlas Plan A and continuous-research scheduling remain incomplete; and state the exact handoff between an adapted Matt-style research skill, Atlas-backed storage/retrieval, the product-discovery bridge, and later agent answers. Preserve logical artifact identities and human product decisions, and do not treat an advertised but unqualified Atlas operation as available.

## Answer

Adopt Atlas as optional coverage for the portable research capability, not as the primary concern or a mandatory workflow dependency:

- The adapted Matt-style research discipline owns bounded question framing, primary-source investigation, contradiction and gap handling, synthesis, and citations. It works without Atlas.
- The active host owns web search, browser/fetch, model execution, and background-job transport. Shared skill behavior names those capabilities without naming a provider or tool.
- An Atlas adapter may own durable source identity, evidence/provenance artifacts, topic routing and passes, freshness state, refresh, and current-topic lookup. Shared behavior treats Atlas artifact identifiers as opaque logical identities and never resolves `vault://atlas/…` to host paths.
- Use Atlas only when the current workspace or explicit user configuration exposes a qualified Atlas capability. Do not probe every request globally and do not require Atlas for ordinary product or implementation work.
- An answer/discussion request routed through Atlas first asks for an exact topic lookup. A `current` topic may answer with source-artifact citations. `dirty`, `refreshing`, or `blocked` halts with freshness details; refresh is a distinct explicit action, never an automatic side effect. Missing or insufficient topics may fall back to direct portable research.
- Direct research persists into Atlas only when the request is Atlas-scoped or the user explicitly opts into durable Atlas capture. Otherwise it produces the repository's normal cited research artifact. Atlas absence or failure never causes silent host-path access or a false persistence claim.
- Until Atlas Plan A proves a truthful capability surface, the portable adapter treats advertised-but-undispatched operations as unavailable. Native Atlas workflows may still be invoked explicitly inside Atlas under their own contracts; they are not evidence that the portable façade is qualified.
- The intended daily cadence belongs to Atlas or an external scheduler adapter after Atlas's agenda, acquisition, synthesis, and retrieval contracts are implemented and approved. The shared research skill does not own cron, scheduled synthesis, or automatic refresh.
- The future product flow may consume Atlas evidence, but all product selection, sufficiency, positioning, scope, and go/no-go decisions remain human-owned. The current engineering flow uses Atlas only for bounded requirements or feasibility evidence and stops when product authority is missing. Research does not become either flow's organizing spine.
