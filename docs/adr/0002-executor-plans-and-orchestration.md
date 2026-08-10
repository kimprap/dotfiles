# Executor plans and orchestration

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Decision IDs:** D06, D08, D09

## Scope

This decision governs the portable semantic shape of executor plans, parent-orchestrator capability binding, task/context projection, and route-to-todo presentation for the generic engineering workflow. It applies to the plan rules and transports, canonical planner persona/projector, `dev-implementation`, `dev-handoff`, and the current workflow reference. It does not authorize a new lifecycle skill, provider purchase or fallback, execution mutation, or a second runtime state machine.

## Context / problem

Large, approved work needs enough structure that a fresh or less-capable executor can act without rediscovering intent, acceptance, ownership, sequencing, or recovery. At the same time, a plan must remain a projection of approved authority rather than become another control plane. Full orchestration also needs truthful launch-time evidence that the current parent can preserve global intent, decompose work, bind exact contracts, supervise bounded concurrency, and account completion. Skill prose cannot upgrade a model or manufacture missing provider capabilities. The human-facing todo view must expose required assurance without mirroring every route owner or pretending that implementation alone is completion.

## Adopted decision

1. **Use one layered portable Executor Plan contract.** Executor Plan v1 carries the objective and stable outcome, exact authority and bindings, target and shared-contract maps, acceptance criteria, dependency graph and waves, boundaries and effects, per-task Task Contracts and Context Packs, proof mapping, outputs and receivers, recovery, and terminal Handoff expectations. Stable IDs close references among targets, tasks, dependencies, criteria, evidence, and receivers.
2. **Keep semantic plans derivative.** Requirements, specifications, and direct approved authority decide product and architecture semantics. Plans, task graphs, todos, Context Packs, and Handoffs project that authority. Plan identity and lifecycle remain separate from backend task/run state, and one structural validator checks completeness and reference closure before mutation without judging product semantics.
3. **Keep transports thin and truthful.** OMP and Grok consume the same portable semantic plan contract while adapters own concrete identity, storage, archive, provider, model, and tool mechanics. OMP retains native plan review, local authority, and byte-exact repository projection; its adapter observes successful local mutations and automatically archives only a terminal-complete projection. It does not invent approval metadata that OMP does not expose. Grok needs contract-equivalent binding, not identical storage behavior. Portable plans contain no provider, model, or tool selection policy.
4. **Bind full orchestration at launch.** A provider-neutral Orchestrator Role Profile defines the capable parent's required behavior. Full orchestration starts only after live launch-time attestation. Missing or mismatched capability fails closed or uses an already approved, contract-preserving sequential/one-qualified-owner projection. If the downgrade would weaken isolation, independence, recovery, authority, or acceptance, execution stops for a revised route.
5. **Preserve one-owner default and bounded topology.** The capable parent owns global intent, contract binding, dispatch, dependency/frontier accounting, and completion accounting. It does not create a recursive planner tree or delegate its top-level semantic responsibility. Workers receive narrow exact contracts; independent assurance roles remain distinct.
6. **Project todos deterministically.** Render only applicable `Authority / Design`, `Build`, `Assurance`, and `Completion` phases. Bind visible work to stable criterion IDs, omit skipped stages, and always show required assurance separately from completion. Todos display work; they do not authorize it or mirror Handoffs, routers, or every route owner as ceremonial steps.

## Rejected alternatives and reasons

- **One huge duplicated plan:** rejected because repeating authority at every layer creates drift, context growth, and competing copies rather than reliable references.
- **A checklist that makes executors rediscover intent, ownership, dependencies, or acceptance:** rejected because it transfers the hardest planning decisions to the least-informed context.
- **A second plan-side runtime state machine, sidecar, or duplicated OMP/Grok semantic parser:** rejected because plans are authority projections, while the backend owns run state and one shared contract must define semantics.
- **A dedicated nested orchestrator lifecycle skill or recursive subplanner tree by default:** rejected because orchestration is a launch-bound parent capability, not a skill that can grant itself capability or a new lifecycle stage.
- **Hundreds-agent defaults, ordinary isolated cloud trees, custom VCS, a SQLite workflow experiment, or “unfinished until the planner stops publishing” control:** rejected because those mechanisms address extreme-scale coordination at disproportionate complexity and would create new state authorities for ordinary work.
- **Best-effort, unverified capability/model selection or a skill claiming it can upgrade its own model:** rejected because capability truth belongs to launch attestation and silent mismatch weakens the approved topology.
- **Automatic model purchasing, account switching, credential changes, or provider fallback:** rejected because those are external effects outside workflow authority.
- **Provider, model, or tool names in the portable semantic contract:** rejected because adapters own concrete bindings and provider-specific policy would break portability.
- **Adapter-invented approved revisions or a transport-wide tool gate:** rejected because prompt prose and current bytes cannot recover the immutable revision reviewed by a native harness.
- **A silent fallback from full orchestration:** rejected because it can erase required isolation, independent assurance, or recovery guarantees. Only the approved contract-preserving downgrade is eligible.
- **Route owners mirrored one-for-one as todos, Handoff/router ceremony todos, or a dependency graph with no visible assurance:** rejected because activity labels are not outcome progress and can hide missing proof.
- **`Implementation → Completion` while proof is still required:** rejected because completion cannot imply unobserved assurance.
- **A new lifecycle skill, issue tracker, workflow service, or planner-owned execution ledger to implement this decision:** rejected because the existing router, backend, Handoff, plan lifecycle, and adapters already own those seams.

## Consequences / invariants

- An executor receives enough exact semantic structure to act without re-deciding approved product or architecture intent.
- Structural omissions, duplicate IDs, dangling references, cycles, missing criterion/proof ownership, placeholders, or missing effect/output/recovery fields fail before mutation.
- The orchestrator profile is provider-neutral; concrete capability evidence remains an adapter launch concern.
- Full orchestration cannot start on assertion alone. A downgrade preserves the same contracts and acceptance or does not run.
- One owner remains the default for cohesive work; concurrency follows the real dependency graph and does not justify nested planning.
- Todo shape is a deterministic view of route facts. Assurance is visible and orthogonal to lifecycle depth and topology.
- Plan lifecycle (`PENDING → IN_PROGRESS → DONE/CLOSED`) is not backend task state, and plans/todos never become runtime authority.
- OMP lifecycle completion may automatically archive the byte-identical repository projection; the session-local authority is never moved, rewritten, or treated as approved by that storage effect.
- Active skills, rules, `WORKFLOW.md`, and active ADRs must be updated atomically when this contract changes; conflict fails closed.

## Affected contracts

- `.config/agents/rules/plan.md`, `.config/agents/rules/plan-impl-spec.md`, `.config/agents/rules/plan-omp-transport.md`, `.config/agents/rules/plan-grok-transport.md`, and `.config/agents/rules/plan-repo-storage.md`.
- `.config/agents/skills/dev-implementation/SKILL.md`; `.config/agents/skills/dev-implementation/scripts/executor_plan.py` as the one OMP/Grok planner/backend structural parser; its fixtures/tests; and `.config/agents/skills/dev-implementation/references/orchestrator-role-profile.md` plus its assessor/tests.
- `.config/agents/skills/dev-handoff/SKILL.md` for Task Contract, Context Pack, progress, recovery, and one-receiver fields.
- `.config/agents/personas/planner/PERSONA.md`, `.config/agents/personas/planner/project.py`, `.config/agents/personas/planner/test_project.py`, and generated `.config/agents/harnesses/omp/agents/planner.md` and `.config/agents/harnesses/grok/agents/planner.md` through the projector only.
- `.config/agents/rules/plan-omp-transport.md` for OMP native approval, local-authority/projection/synchronization/automatic projection-only archival binding and `.config/agents/rules/plan-grok-transport.md` for Grok project-rule auto-discovery plus repository-or-session body/revision binding; storage, identity, model, role, and tool mechanics remain adapter-specific.
- `.config/agents/skills/dev-ask/WORKFLOW.md`, `.config/agents/skills/dev-ask/evals/evals.json`, and targeted todo, validator, semantic-context, transport, and parent-profile fixture directories.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains semantic decision authority rather than a planner, transport, or runtime ledger.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions** D06, D08, and D09; **Fixed shared contracts**; **Target map and critical anchors**; **Canonical discovery and continual learning**; **Material approval boundary**; and T3's task contract. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- Current transport correction authority: user-approved Route Overview on 2026-08-10 for defect `DEF-3d1e57d746cea524b96d0e8f9cfd7216fac44c5b34528292aaf3edd0d0bbde27`, requiring native OMP approval, byte-exact local lifecycle mirroring, and automatic projection-only archival without separate approval.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: capable-parent intent retention, narrow worker context, explicit ownership, and outcome grading inform the plan; hundreds-agent defaults, recursive trees, custom VCS, an agent-owned always-injected Field Guide, unlimited stacked reviews, and model-specific policy are rejected.
- Cursor, [official plugins and curated skills](https://github.com/cursor/plugins), including `orchestrate`, accessed 2026-08-09: explicit roles and structured returns inform orchestration; recursive subplanners, ordinary isolated cloud trees, and planner-publication-owned completion do not.
- Anthropic, [How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration) and [code-migration kit](https://github.com/anthropics/code-migration-kit-with-claude-code), accessed 2026-08-09: deterministic dependency maps and cheap early feedback inform executor structure; provider settings are not portable semantic policy.
- PostHog, [Writing skills](https://posthog.com/handbook/engineering/ai/writing-skills) and [What nobody tells you about writing agent skills](https://newsletter.posthog.com/p/what-nobody-tells-you-about-writing), accessed 2026-08-09: progressive disclosure and one source of truth support layered plans; skill proliferation and duplicated volatile facts are rejected.
- Atlas references named by the governing plan are advisory evidence only and are not copied into the portable contract.
- Executable lineage revisions: completed T3 final Handoff `agent://ExecutorOrchestration`; T5 adapter, fixture, workflow, and affected-contract synchronization under `AUTH-PLAN`, with exact final identity returned to T6.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan are the authority for adopting this record. The parent execution dispatch authorizes only this exact D06/D08/D09 materialization. It does not authorize executable plan/backend/persona changes, model or credential effects, new lifecycle skills, topology escalation, weakened assurance, or shipping.

## Supersession / reopen conditions

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. Reopen or seek reapproval if Executor Plan semantics, its derivative-authority boundary, the single-validator design, parent profile, attestation requirement, provider neutrality, one-owner default, eligible downgrade, lifecycle/runtime separation, or todo phases change; if a new orchestrator skill/state authority is proposed; or if topology or assurance independence would weaken. Adapter-specific mechanical storage, formatting, generated projection, and a contract-preserving sequential downgrade do not reopen it.

## Verification expectations

- **AC05:** Equivalent route facts produce identical applicable phase/task projections, criterion bindings, and explicit Assurance; Completion never substitutes for required proof.
- **AC06:** One complete semantic fixture validates in OMP and Grok contexts, while missing authority, target, shared contract, dependency, criterion/proof, effect, output/receiver, recovery, duplicate/dangling reference, cycle, or placeholder fails before mutation.
- **AC07:** Full orchestration starts only under a live matching Orchestrator Role Profile; mismatch either uses the approved contract-preserving one-owner projection or stops `transport-unavailable`.
- **AC08:** Task Contracts and Handoffs expose stable outcome/criterion IDs, expected and observed progress, exact target, inherited attempt/repair state, route impact, next frontier, and one receiver.
- **AC14:** Canonical planner source, generated projections, plan transports, validator, and profile bindings pass their targeted checks without provider-specific semantics leaking into the portable contract.
- A future executable revision must prove active skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
