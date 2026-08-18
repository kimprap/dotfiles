# Executor plans and orchestration

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-17  
**Decision IDs:** D06, D08, D09, D21

## Scope

This decision governs the portable semantic shape of executor plans, parent-orchestrator capability binding, task/context projection, route-to-todo presentation, and implementation-worker solution discipline for the generic engineering workflow. It applies to the plan rules and transports, `dev-implementation`, `dev-handoff`, and the current workflow reference. It does not authorize a new lifecycle skill, provider purchase or fallback, execution mutation, approved-scope reduction, or a second runtime state machine.

## Context / problem

Large, approved work needs enough structure that a fresh or less-capable executor can act without rediscovering intent, acceptance, ownership, sequencing, or recovery. At the same time, a plan must remain a projection of approved authority rather than become another control plane. Full orchestration needs truthful launch-time evidence that the current parent can preserve global intent, decompose work, bind exact contracts, supervise bounded concurrency, and account completion. Skill prose cannot upgrade a model or manufacture missing provider capabilities. The human-facing todo view must expose required assurance without mirroring every route owner or pretending that implementation alone is completion. Once approved behavior is fixed, the worker also needs an explicit existing seam for choosing the simplest sufficient implementation without using simplicity to weaken the contract.

## Decisions

### D06 — Orchestrator binding

- **Scope:** Parent capability, orchestration launch, execution topology, and eligible downgrade.
- **Decision:** Use a provider-neutral Orchestrator Role Profile for the capable parent's required behavior and require live launch-time attestation before full orchestration starts. Missing or mismatched capability fails closed or uses an already approved, contract-preserving sequential or one-qualified-owner projection; stop for a revised route if that downgrade would weaken isolation, independence, recovery, authority, or acceptance. Preserve one owner as the default: the capable parent owns global intent, contract binding, dispatch, dependency/frontier accounting, and completion accounting without delegating its top-level semantic responsibility or creating a recursive planner tree. Workers receive narrow exact contracts and independent assurance roles remain distinct.
- **Why:** Capability truth belongs at launch, and one parent must retain the global contract so bounded concurrency does not fragment ownership or silently weaken the route.
- **Rejected alternatives / why not:** A dedicated nested orchestrator lifecycle skill or recursive subplanner tree cannot grant parent capability and adds a stage. Hundreds-agent defaults, ordinary isolated cloud trees, custom VCS, a SQLite workflow experiment, or planner-publication-owned completion create disproportionate state and coordination complexity. Best-effort or unverified capability/model selection and a skill claiming it can upgrade its model make topology assertions untruthful. Automatic model purchasing, account switching, credentials, or provider fallback are unauthorized external effects. A silent fallback can erase required isolation, independence, or recovery.
- **Consequences:** The profile remains provider-neutral and concrete evidence remains an adapter launch concern. Full orchestration cannot start on assertion alone; the eligible downgrade preserves the same contracts and acceptance or does not run. Cohesive work defaults to one owner, while concurrency follows the real dependency graph.
- **Reopen when:** The parent profile, launch attestation, provider neutrality, one-owner default, eligible downgrade, ownership boundary, or topology/assurance independence changes.

### D08 — Executor plan shape

- **Scope:** Portable Executor Plan semantics, authority projection, validation, lifecycle identity, and OMP/Grok transports.
- **Decision:** Use one layered portable Executor Plan contract when a durable implementation graph, recovery boundary, multiple owners, or neutral fan-in requires one. The contract carries the objective and stable outcome, exact authority and bindings, target and shared-contract maps, acceptance criteria, dependency graph and waves, boundaries and effects, per-task Task Contracts and applicable Context Packs, proof mapping, outputs and receivers, recovery, and terminal Handoff expectations. Stable IDs close references among targets, tasks, dependencies, criteria, evidence, and receivers. Settled same-context compact work binds its minimal Task Contract directly and does not require an Executor Plan or plan preflight. Requirements, specifications, and direct approved authority decide product and architecture semantics; plans, task graphs, todos, Context Packs, and Handoffs only project them. Keep plan identity and lifecycle separate from backend task/run state, and use one structural validator to check completeness and reference closure before mutation without judging product semantics. OMP and Grok consume the same portable semantic contract while adapters own identity, storage, archive, provider, model, and tool mechanics. OMP retains native review, session-local authority, byte-exact repository projection, and automatic archival only of a terminal-complete projection; its adapter never invents unexposed approval metadata. Grok requires contract-equivalent binding, not identical storage behavior. Portable plans contain no provider, model, or tool selection policy.
- **Why:** Work that crosses owners or recovery boundaries needs complete, reference-closed semantic structure. Same-context compact work already has one informed owner and a direct Task Contract, so forcing durable graph machinery would add a second control surface without improving proof.
- **Rejected alternatives / why not:** Requiring an Executor Plan for every implementation adds storage, preflight, and transfer work to bounded tasks. One huge duplicated plan creates drift, context growth, and competing copies. A thin checklist for graph-bound work transfers intent, ownership, dependencies, and acceptance discovery to the least-informed context. A second plan-side runtime state machine, sidecar, or duplicated OMP/Grok parser competes with backend state and the shared contract. Provider/model/tool names in portable semantics break portability. Adapter-invented approved revisions or a transport-wide tool gate cannot recover native immutable approval identity. A new planner-owned execution ledger duplicates existing owners.
- **Consequences:** Executors receive exact plan structure when graph, recovery, ownership, or fan-in needs it; same-context compact skips the entire plan seam. For applicable plans, structural omissions, duplicate or dangling IDs, cycles, missing criterion/proof ownership, placeholders, or missing effect/output/recovery fields fail before mutation. Plan lifecycle (`PENDING → IN_PROGRESS → DONE/CLOSED`) remains distinct from backend task state. OMP may archive the byte-identical terminal repository projection, but the session-local authority is neither moved nor treated as approved by that storage effect. The current parent or session owner publishes an applicable plan through the shared parser; a dedicated planner user-agent is not part of this contract. Native harness planning modes remain adapter-owned. Contract changes synchronize active skills, rules, `WORKFLOW.md`, and active ADRs atomically or fail closed.

### D09 — Todo projection

- **Scope:** Human-visible route-to-task and todo projection.
- **Decision:** Render only applicable `Authority / Design`, `Build`, `Assurance`, and `Completion` phases. Bind visible work to stable criterion IDs, omit skipped stages, and always show required assurance separately from completion. Todos display work; they do not authorize it or mirror Handoffs, routers, or every route owner as ceremonial steps.
- **Why:** A deterministic projection should expose outcome progress and required proof without turning lifecycle owners or transfer machinery into activity theatre.
- **Rejected alternatives / why not:** Mirroring route owners one-for-one, adding Handoff/router ceremony todos, or showing a dependency graph with no Assurance hides outcome state behind activity labels. `Implementation → Completion` while proof remains required implies assurance that has not occurred.
- **Consequences:** Equivalent route facts produce the same applicable phases, tasks, and criterion bindings. Assurance remains visible and orthogonal to lifecycle depth and topology; plans and todos never become runtime authority.
- **Reopen when:** Todo phase names, applicability rules, criterion binding, Assurance visibility, or the display-versus-authority boundary changes.

### D21 — Worker solution discipline

- **Scope:** `dev-implementation` Task Contracts and applicable Context Packs
- **Decision:** After approved behavior is fixed and the real flow is read, every implementation worker chooses the first sufficient rung: reuse current code; standard library; native platform; already-installed dependency; minimum new code. Bind this through the revision-bound Task Contract. Same-context compact binds that Task Contract directly; only an existing ownership/context-change or durable-recovery crossing predicate adds exactly one Context Pack carrying the same Task Contract and solution discipline. Other dispatched worker attempts keep their required Context Pack. The discipline may simplify implementation, never approved behavior, compatibility, safety, accessibility, or required proof. Add no new skill or global mode.
- **Why:** This makes the useful Ponytail heuristic enforceable at the existing worker seam without forcing a transfer artifact when ownership and context do not change.
- **Rejected alternatives / why not:** A global Ponytail mode duplicates foundational guidance; literal YAGNI can silently shrink approved scope; a one-check rule can weaken assurance; implicit principles alone are easy to skip. Requiring a Context Pack in the same compact context duplicates the Task Contract without transferring information.
- **Consequences:** Worker contracts and Handoff evidence identify the selected sufficient rung. Same-context compact has no Context Pack ceremony; a qualifying context crossing carries one complete pack without adding a lifecycle owner or relaxing acceptance.
- **Reopen when:** Worker or Context Pack ownership changes, the context-crossing predicate changes, or a separately approved global policy supersedes it.

## Affected contracts

- `.config/agents/rules/plan.md`, `.config/agents/rules/plan-impl-spec.md`, `.config/agents/rules/plan-omp-transport.md`, `.config/agents/rules/plan-grok-transport.md`, and `.config/agents/rules/plan-repo-storage.md`.
- `.config/agents/skills/dev-implementation/SKILL.md`; `.config/agents/skills/dev-implementation/scripts/executor_plan.py` as the one OMP/Grok planner/backend structural parser; its fixtures/tests; and `.config/agents/skills/dev-implementation/references/orchestrator-role-profile.md` plus its assessor/tests.
- `.config/agents/skills/dev-handoff/SKILL.md` for Task Contract, Context Pack, progress, recovery, and one-receiver fields.
- `.config/agents/rules/plan-omp-transport.md` for OMP native approval, local-authority/projection/synchronization/automatic projection-only archival binding and `.config/agents/rules/plan-grok-transport.md` for Grok project-rule auto-discovery plus repository-or-session body/revision binding; storage, identity, model, role, and tool mechanics remain adapter-specific.
- `.config/agents/skills/dev-ask/WORKFLOW.md`, `.config/agents/skills/dev-ask/evals/evals.json`, and targeted todo, validator, semantic-context, transport, worker-discipline, and parent-profile fixture directories.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains semantic decision authority rather than a planner, transport, or runtime ledger.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions** D06, D08, and D09; **Fixed shared contracts**; **Target map and critical anchors**; **Canonical discovery and continual learning**; **Material approval boundary**; and T3's task contract. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- D21 durable-write authority: `local://dev-workflow-routing-simplicity-decisions.md`, SHA-256 `ef2ac3ddd04239e1c055f25439d81f58f8ec503777c4fa691a3443abe83823be`, explicitly confirmed by the user.
- D21 research evidence: official [`DietrichGebert/ponytail` commit `2ed6c52c9d7e5e56942508591085fd45dea277d3`](https://github.com/DietrichGebert/ponytail/commit/2ed6c52c9d7e5e56942508591085fd45dea277d3), especially pinned [`skills/ponytail/SKILL.md`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/skills/ponytail/SKILL.md); the reuse/stdlib/native/already-installed-dependency ladder is consumed only at the existing worker seam, while upstream scope-reduction and proof-ceiling semantics are rejected.
- Current transport correction authority: user-approved Route Overview on 2026-08-10 for defect `DEF-3d1e57d746cea524b96d0e8f9cfd7216fac44c5b34528292aaf3edd0d0bbde27`, requiring native OMP approval, byte-exact local lifecycle mirroring, and automatic projection-only archival without separate approval.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: capable-parent intent retention, narrow worker context, explicit ownership, and outcome grading inform the plan; hundreds-agent defaults, recursive trees, custom VCS, an agent-owned always-injected Field Guide, unlimited stacked reviews, and model-specific policy are rejected.
- Cursor, [official plugins and curated skills](https://github.com/cursor/plugins), including `orchestrate`, accessed 2026-08-09: explicit roles and structured returns inform orchestration; recursive subplanners, ordinary isolated cloud trees, and planner-publication-owned completion do not.
- Anthropic, [How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration) and [code-migration kit](https://github.com/anthropics/code-migration-kit-with-claude-code), accessed 2026-08-09: deterministic dependency maps and cheap early feedback inform executor structure; provider settings are not portable semantic policy.
- PostHog, [Writing skills](https://posthog.com/handbook/engineering/ai/writing-skills) and [What nobody tells you about writing agent skills](https://newsletter.posthog.com/p/what-nobody-tells-you-about-writing), accessed 2026-08-09: progressive disclosure and one source of truth support layered plans; skill proliferation and duplicated volatile facts are rejected.
- Atlas references named by the governing plan are advisory evidence only and are not copied into the portable contract.
- Executable lineage revisions: completed T3 final Handoff `agent://ExecutorOrchestration`; T5 adapter, fixture, workflow, and affected-contract synchronization under `AUTH-PLAN`, with exact final identity returned to T6.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan, plus the exact confirmed D21 evidence artifact above, are the authority for this record. The parent execution dispatch authorizes only this D06/D08/D09/D21 materialization. It does not authorize executable plan/backend or worker-contract changes, model or credential effects, new lifecycle skills, topology escalation, approved-scope reduction, weakened assurance, or shipping.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. Adapter-specific mechanical storage, formatting, generated projection, and a contract-preserving sequential downgrade do not supersede any decision.

## Verification expectations

- **AC05:** Equivalent route facts produce identical applicable phase/task projections, criterion bindings, and explicit Assurance; Completion never substitutes for required proof.
- **AC06:** One complete semantic fixture validates in OMP and Grok contexts, while missing authority, target, shared contract, dependency, criterion/proof, effect, output/receiver, recovery, duplicate/dangling reference, cycle, or placeholder fails before mutation.
- **AC07:** Full orchestration starts only under a live matching Orchestrator Role Profile; mismatch either uses the approved contract-preserving one-owner projection or stops `transport-unavailable`.
- **AC08:** Task Contracts and Handoffs expose stable outcome/criterion IDs, expected and observed progress, exact target, inherited attempt/repair state, route impact, next frontier, and one receiver.
- **AC14:** Plan transports, validator, and parent-profile bindings pass their targeted checks without provider-specific semantics leaking into the portable contract. A dedicated planner user-agent, persona, or role-profile attestation is not required for publication.
- A future executable revision must prove D21 is bound at the worker Task Contract/Context Pack seam without reducing approved behavior, compatibility, safety, accessibility, or required proof, and must prove active skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
