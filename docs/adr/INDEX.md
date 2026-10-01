# Architecture Decision Record index

This index is the canonical discovery surface for durable repository decisions. Open it only when work changes or questions architecture, workflow semantics, product authority, papercut behavior, repository setup, canonical domain language, or another listed scope. Then read only the applicable ACTIVE record and any explicitly named dependency. Executable skills and rules own runtime behavior; ADRs own durable decisions; human maps and maintenance journals are non-runtime projections or provenance.

## Current records

| ADR | Status | Current scope | Decision IDs |
|---|---|---|---|
| [ADR-0001 — Development workflow authority and routing](0001-dev-workflow-authority-and-routing.md) | ACTIVE | Thin role-scoped engineering router; in-place controller entry; child implementation authority; sized direct/planned classification; clean cutover; five-field completion; separation from product, custom workflows, and shipping | D01, D02, D05, D10–D20, D26 |
| [ADR-0002 — Lean plans and orchestration](0002-executor-plans-and-orchestration.md) | ACTIVE | In-place controller default with approved delegated exception; child-owned execution; shared task-sizing projection; lean plan grammar; exact explicit-schema candidate and Handoff admission through the host return adapter; exact generic collection exemption with custom lifecycle/count rules preserved; same-author planning rethink; mechanical scheduling; controller validation of execution stops; distinct implementation and execution-recovery rethinks; active-path lifecycle with on-request archiving only | D06, D08, D09, D21, D29, D30 |
| [ADR-0003 — Bounded assurance and repair](0003-bounded-assurance-and-repair.md) | ACTIVE | Two semantic attempts; pre-escalation execution recovery with required/disposable identity and explicit-cap boundaries; explicit invocation-local or named-skill custom adoption without automatic inheritance; compact versus standard/high assurance; one tests-first review; fresh shared-proof accounting and verifier-owned closure; common proof selection, permanent-test value, and A-first manual audit | D03, D04, D22, D28 |
| [ADR-0004 — Canonical discovery and continual learning](0004-canonical-discovery-and-continual-learning.md) | ACTIVE | Conditional discovery; one terminal engineering learning assessment and one canonical first-return Handoff; non-runtime human map; optional noncanonical maintenance-journal relationship | D07, D23 |
| [ADR-0005 — Product development workflow and PRD authority](0005-product-development-workflow-and-prd-authority.md) | ACTIVE | Product routing, human product authority, product grilling, PRD identity and approval, iteration artifacts, engineering handoff | P01–P09 |
| [ADR-0006 — Generic papercut evidence](0006-generic-papercut-evidence.md) | SUPERSEDED by ADR-0007 | Historical capture/storage design; not current lifecycle authority | D24 (historical) |
| [ADR-0007 — Deterministic papercut observation](0007-automated-papercut-lifecycle-and-lean-evidence.md) | ACTIVE | One look after every completed repository-work boundary; complete stable-order root-cause accounting; strict exclusions; opt-in persistence | D24 |
| [ADR-0008 — Repository agent integration setup](0008-repository-agent-integration-setup.md) | ACTIVE | Approval-gated inspection and initialization of supported repository integrations | D25 |
| [ADR-0009 — Terminal envelope and lean completion protocol](0009-session-lifecycle-envelope-and-portable-learning.md) | ACTIVE | Stateless session transport; real-boundary Handoffs with concrete receivers; in-place role continuity; exact Outcome/Changes/Checks/Risks/Next completion; same-agent rendering | D27 |
| [ADR-0010 — acpx controller for Retrace and Reconcile](0010-replacement-lifecycle-plugin.md) | ACTIVE | One Node controller over public acpx and native omp acp owns Retrace/Reconcile sessions, yield-only admission, capacity and observed-exit disposal | D31 |

## Authority and precedence

1. Current human decisions and approved artifacts govern their stated scope.
2. Injected system and repository rules govern execution.
3. ACTIVE focused ADRs govern durable repository decisions.
4. Executable owner skills govern runtime behavior within that authority.
5. Human workflow maps summarize current flow but do not run it or win conflicts.
6. Optional `MAINTENANCE.md` journals record append-only provenance but never approve, execute, or supersede behavior.
7. Superseded ADRs and historical plan archives explain history only.

If two current surfaces disagree, stop at the conflict, preserve the narrower/higher authority, and send correction to the owning record or skill. Do not maintain compatibility language in active runtime prose merely because a superseded record remains readable.

## Supersession discipline

- A new durable decision must name every decision ID and record it supersedes.
- Update this index in the same change.
- Preserve superseded records and historical plan archives; do not rewrite them to resemble current runtime.
- Remove stale executable branches, callers, fixtures, and human projections in a clean cutover unless a human explicitly approves compatibility.
- A correction to optional maintenance provenance appends `Supersedes`; it never rewrites journal history.

