# Architecture Decision Record index

This index is the canonical discovery surface for durable repository decisions. Open it only when work changes or questions architecture, workflow semantics, product authority, papercut behavior, repository setup, canonical domain language, or another listed scope. Then read only the applicable ACTIVE record and any explicitly named dependency. Executable skills and rules own runtime behavior; ADRs own durable decisions; human maps and maintenance journals are non-runtime projections or provenance.

## Current records

| ADR | Status | Current scope | Decision IDs |
|---|---|---|---|
| [ADR-0001 — Development workflow authority and routing](0001-dev-workflow-authority-and-routing.md) | ACTIVE | Thin generic engineering router; child implementation authority; direct/planned classification; clean cutover; five-field completion; separation from product, custom workflows, and shipping | D01, D02, D05, D10–D20, D26 |
| [ADR-0002 — Lean plans and orchestration](0002-executor-plans-and-orchestration.md) | ACTIVE | Child-owned controller execution; lean plan grammar; mechanical scheduling; same-child code-then-test rethink; active-path lifecycle with no automatic archive | D06, D08, D09, D21, D29 |
| [ADR-0003 — Bounded assurance and repair](0003-bounded-assurance-and-repair.md) | ACTIVE | Two semantic attempts; compact versus standard/high assurance; one tests-first review; verifier-owned closure; permanent-test value and A-first manual audit | D03, D04, D22, D28 |
| [ADR-0004 — Canonical discovery and continual learning](0004-canonical-discovery-and-continual-learning.md) | ACTIVE | Conditional discovery; one terminal engineering learning assessment; human execution map; optional noncanonical maintenance-journal relationship | D07, D23 |
| [ADR-0005 — Product development workflow and PRD authority](0005-product-development-workflow-and-prd-authority.md) | ACTIVE | Product routing, human product authority, product grilling, PRD identity and approval, iteration artifacts, engineering handoff | P01–P09 |
| [ADR-0006 — Generic papercut evidence](0006-generic-papercut-evidence.md) | SUPERSEDED by ADR-0007 | Historical capture/storage design; not current lifecycle authority | D24 (historical) |
| [ADR-0007 — Deterministic papercut observation](0007-automated-papercut-lifecycle-and-lean-evidence.md) | ACTIVE | One look after every completed repository-work boundary; complete stable-order root-cause accounting; strict exclusions; opt-in persistence | D24 |
| [ADR-0008 — Repository agent integration setup](0008-repository-agent-integration-setup.md) | ACTIVE | Approval-gated inspection and initialization of supported repository integrations | D25 |
| [ADR-0009 — Terminal envelope and lean completion protocol](0009-session-lifecycle-envelope-and-portable-learning.md) | ACTIVE | Stateless session transport; lean Handoffs; exact Outcome/Changes/Checks/Risks/Next completion; same-agent rendering | D27 |

## Decision discovery

| Question | Read first | Then read only if needed |
|---|---|---|
| Is this generic engineering work, product work, a custom controller, direct work, or shipping? | ADR-0001 D01, D02, D10, D11, D12, D18 | ADR-0005 for product authority; custom controller contracts for custom work |
| Who may change code and how many semantic attempts exist? | ADR-0001 D02; ADR-0003 D03 | ADR-0002 D06, D21 for controller and rethink details |
| Does this require a plan and what does the plan contain? | ADR-0001 D11; ADR-0002 D08, D09 | ADR-0002 D29 for lifecycle and storage |
| Where does a plan remain after completion or stop? | ADR-0002 D29 | Plan storage and host transport rules for mechanics |
| What assurance profile and ordering apply? | ADR-0001 D16, D20; ADR-0003 D04 | ADR-0003 D22 for review and D28 for test portfolio audit |
| Who owns review closure after repair? | ADR-0003 D04, D22 | `dev-verification` for executable check handling |
| When does permanent-test audit run? | ADR-0003 D28 | `dev-test-audit` and its protocol for exact transport |
| When does papercut observation occur? | ADR-0007 D24 | Portable `papercut` for qualification and storage approval |
| When does engineering learning run and can failure block completion? | ADR-0004 D07 | `dev-continual-learning` and portable `continual-learning` for executable behavior |
| Where is the human execution map, and can it override runtime? | ADR-0004 D23 | `dev-ask/WORKFLOW.md` and `references/execution-flow.md`; maps never override runtime |
| Who owns an optional skill or prompt maintenance journal, and what authority does it have? | ADR-0004 D23 | `craft-skill` for the append-only convention; the journal is provenance only |
| What exactly is successful completion? | ADR-0009 D27 | `completion-presentation` for rendering only |
| What is the current completion plan locator? | ADR-0002 D29; ADR-0009 D27 | The current active `DONE` path; no archive lookup is part of completion |
| How are product decisions approved and handed to engineering? | ADR-0005 P01–P09 | Product skills and the approved PRD or iteration artifact |
| How may repository integrations be initialized? | ADR-0008 D25 | `init-ask` for the current catalog and approval gate |

## Authority and precedence

1. Current human decisions and approved artifacts govern their stated scope.
2. Injected system and repository rules govern execution.
3. ACTIVE focused ADRs govern durable repository decisions.
4. Executable owner skills govern runtime behavior within that authority.
5. Human workflow maps summarize current flow but do not run it or win conflicts.
6. Optional `MAINTENANCE.md` journals record append-only provenance but never approve, execute, or supersede behavior.
7. Superseded ADRs and historical plan archives explain history only.

If two current surfaces disagree, stop at the conflict, preserve the narrower/higher authority, and send correction to the owning record or skill. Do not maintain compatibility language in active runtime prose merely because a superseded record remains readable.

## Current generic execution map

The generic engineering path is:

```text
intake and classify
  → direct child work or active lean plan
  → candidate
  → same-child code rethink then test rethink
  → optional correction
  → direct checks and lean Handoff
  → one papercut look per completed repository-work boundary
  → compact completion
     or one review → one verifier → one learning assessment
  → active DONE plan when planned
  → exact five-field presentation
```

Manual permanent-test audit is an explicit separate read-only workflow. Shipping remains separately authorized. Reconcile and other qualifying custom controllers keep their own approved behavior and are not generic aliases.

## Supersession discipline

- A new durable decision must name every decision ID and record it supersedes.
- Update this index in the same change.
- Preserve superseded records and historical plan archives; do not rewrite them to resemble current runtime.
- Remove stale executable branches, callers, fixtures, and human projections in a clean cutover unless a human explicitly approves compatibility.
- A correction to optional maintenance provenance appends `Supersedes`; it never rewrites journal history.

## Current evidence baseline

The 2026-09-05 lean projection is authorized by:

- `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`;
- `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`;
- the approved ticket graph for the same specification; and
- the installed executable runtime contracts projected by ADRs 0001–0004, 0007, and 0009.

The source inventory in `.config/agents/references/impl-rethink/MAINTENANCE.md` remains append-only non-runtime provenance and does not expand this authority.
