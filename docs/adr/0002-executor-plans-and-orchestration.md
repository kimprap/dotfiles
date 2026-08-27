# Executor plans and orchestration

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-26
**Decision IDs:** D06, D08, D09, D21

## Scope

This decision governs the portable semantic shape of executor plans, parent-orchestrator capability binding, task/context projection, route-to-todo presentation, and implementation-worker solution discipline for the generic engineering workflow. It applies to the plan rules and transports, `dev-implementation`, `dev-handoff`, and the current workflow reference. It does not authorize a new lifecycle skill, provider purchase or fallback, execution mutation, approved-scope reduction, or a second runtime state machine.

## Context / problem

Large, approved work needs enough structure that a fresh or less-capable executor can act without rediscovering intent, acceptance, ownership, sequencing, or recovery. At the same time, a plan must remain a projection of approved authority rather than become another control plane. Full orchestration needs truthful launch-time evidence that the current parent can preserve global intent, decompose work, bind exact contracts, supervise bounded concurrency, and account completion. Skill prose cannot upgrade a model or manufacture missing provider capabilities. The human-facing todo view must expose required assurance without mirroring every route owner or pretending that implementation alone is completion. Once approved behavior is fixed, the worker also needs an explicit existing seam for choosing the simplest sufficient implementation without using simplicity to weaken the contract.

## Decisions

### D06 — Orchestrator binding

- **Scope:** Approved parser-valid implementation Executor Plans under a capable native shared-tree transport.
- **Decision:** Every approved parser-valid implementation plan launches through `assess-plan-backed` and requires `full-orchestration` with profile `downgrade` exactly `none`. The root validates, binds, schedules, dispatches, observes, controls, recovers, mechanically accepts bounded Handoffs, performs lifecycle/papercut bookkeeping, schedules the backend, and prepares settled presenter input. It performs no semantic task, repair, task smoke, worker closure, audit opinion, or semantic review.
- **Decision:** Fresh children own authored semantic work. `Max concurrency` is a ceiling. `PROMOTE-SERIAL-DEFAULT` sets runtime concurrency one by default within full orchestration and makes no general efficiency claim. It is not a sequential-child profile or fallback.
- **Decision:** Planless/direct assessment retains the existing generic `one-owner-sequential` compatibility behavior. A plan transport mismatch returns `transport-unavailable`; it never authorizes root work.
- **Why:** Exact root/child separation preserves bounded context, fresh ownership, independent assurance, and mechanical recovery without adding another orchestrator.
- **Rejected alternatives / why not:** Plan-root semantic execution, a sequential-child plan mode, or root rescue after transport failure makes topology depend on task count or capability and lets the coordinator judge its own work.
- **Consequences:** Planned compact work also dispatches child work while remaining tail-free. Native dispatch, hub control, existing Context Packs, Common Handoffs, and artifact locators remain the only orchestration substrate.
- **Reopen when:** Native transport can no longer preserve fresh child ownership, shared-tree operation, same-child control, or exact artifact identity.
### D08 — Executor plan shape

- **Scope:** Durable repository Executor Plans plus runtime scheduling and transfer in the live shared tree.
- **Decision:** Preserve Executor Plan v1 and its parser-valid task graph, compact work-only plans, optional profile tail, isolated lineages, generic fan-in, `complete.md`, and `fan_in.md`. `plan.md` remains workflow-agnostic; implementation-specific admission belongs to `plan-impl-spec.md`.
- **Decision:** Any approved parser-valid implementation plan enters plan orchestration regardless of assurance profile or task count. `Topology`, `Lineages`, `Isolation`, and `Fan-in` describe authored proof boundaries and never grant the root semantic task ownership.
- **Decision:** Runtime admission uses exact declared target/effect ownership. Mechanically disjoint ready tasks may overlap; declared overlap, unknown overlap, or exclusive resources serialize. Undeclared mutation stops the child. A portable fan-in plan remains structurally valid; if live transport cannot preserve declared isolation or neutral integration, stop `transport-unavailable` instead of weakening the graph. Direct `dev-integration` remains unchanged.
- **Decision:** Project the unchanged Task Contract, owned criteria/proof recipes, exact authority/private-reference identities, dependency Handoffs, target/effect boundary, attempt/repair state, applicable continuation receipt, bounded environment facts, and native locators through the existing Context Pack. Do not create another context/result envelope or transcript projection.
- **Why:** Portable semantics and runtime admission solve different problems. Keeping them separate preserves reusable plans while safely operating in one shared tree.
- **Rejected alternatives / why not:** Banning fan-in or isolation from the grammar weakens portability. Treating grammar validity as permission to overlap unknown writes weakens safety. A second context schema duplicates the existing transfer contract.
- **Consequences:** Plan validation stays stable. Scheduler timing changes cannot change task contracts or proof boundaries.
- **Reopen when:** Executor Plan grammar versioning, runtime isolation, target/effect ownership, or the existing transfer surface changes.
### D09 — Todo projection

- **Scope:** Projection of an approved Executor Plan into scheduler state, attempts, proof accounting, assurance, and completion.
- **Decision:** The root projects only authored task IDs and declared backend boundaries. It computes dependency readiness, shared-tree admission, attempts, blockers, and receiver transitions mechanically; it never invents, splits, merges, substitutes, or semantically repairs a task.
- **Decision:** Todo state is subordinate runtime bookkeeping, not a second plan. A task completes only after its owned criteria and smoke pass, target identity is stable, one Common Handoff is mechanically accepted, and its post-Handoff papercut look is accounted. Non-success preserves completed Handoffs and the exact remaining frontier.
- **Decision:** When the numbered graph omits an optional assurance tail, the backend schedules fresh current-target `dev-verification`, then one current-target `dev-code-review`, then terminal `dev-continual-learning`. If the plan authors the optional tail, those same semantic boundaries run exactly once through the task graph.
- **Decision:** A completed plan may be followed by the separately routed read-only audit; audit availability or findings do not change task state, assurance, repair, or `DONE`.
- **Why:** One authoritative plan plus derived mechanical state is enough for scheduling and recovery.
- **Rejected alternatives / why not:** A generated hidden tail, invented repair task, second runtime plan, or audit task changes authored authority. Letting the root judge semantic sufficiency collapses ownership and assurance.
- **Consequences:** Completion and recovery can be audited against plan IDs, Handoffs, target identities, and proof receipts without inspecting child transcripts.
- **Reopen when:** Runtime projection, optional-tail semantics, backend scheduling, or post-plan audit status changes.
### D21 — Worker solution discipline

- **Scope:** Work attempts, admitted Build repair, progressive implementation instructions, and permanent-test decisions.
- **Decision:** Resolve the task against its unchanged Task Contract using the smallest coherent implementation. Check current patterns before editing; prefer direct use, local helper, existing boundary extension, then only a justified deep module. Delete obsolete paths in the same cutover.
- **Decision:** Work attempt one, eligible fresh-child attempt two, and admitted Build repair use `worker-closure/v1` in the same child. Round one is mandatory. Round two runs only after round one causes a contract-relevant correction and checks only corrected findings and repair-caused regressions. Repair every concrete finding, run task-local smoke, and emit one Common Handoff. There is no third round. Verification, review, learning, audit controller, and audit opinions never use worker closure.
- **Decision:** Permanent tests use `test-value/v1`: name an uncovered observable contract, regression, or invariant; reuse or extend current coverage first; use a stable public seam and independent oracle; name a plausible unique bug; reject duplicate, subsumed, tautological, incidental-snapshot, implementation-detail, coverage-only, and production-logic-oracle tests; keep the smallest unique set. Explicit TDD retains red/green evidence and consolidates redundant tracer tests before Handoff.
- **Why:** Mandatory challenge at the semantic worker catches omissions without making the mechanical root or independent assurance roles repair work. Value-gated testing prevents permanent suite growth without unique protection.
- **Rejected alternatives / why not:** Root-conducted challenge violates the control-plane boundary. Unbounded review rounds prevent terminality. Coverage-only test creation and duplicated tracer cases add maintenance cost without a distinct contract.
- **Consequences:** Each work Handoff identifies closure rounds/findings/corrections/smoke and changed-test rows or a concrete no-new-contract decision.
- **Reopen when:** Closure ownership, round bound, solution discipline, or shared permanent-test policy changes.
## Affected contracts

- `.config/agents/rules/plan.md`, `.config/agents/rules/plan-impl-spec.md`, `.config/agents/rules/plan-repo-storage.md`, `.config/agents/rules/plan-omp-transport.md`, and `.config/agents/rules/plan-grok-transport.md` for portable grammar, repository storage, and thin authoring adapters.
- `.config/agents/skills/dev-implementation/SKILL.md`; `.config/agents/skills/dev-implementation/scripts/executor_plan.py` as the one context-free repository-plan parser; its fixtures/tests; and unchanged `.config/agents/skills/dev-implementation/references/orchestrator-role-profile.md` plus its assessor/tests.
- `.config/agents/skills/dev-handoff/SKILL.md` for Task Contract, Context Pack, progress, recovery, and one-receiver fields.
- `.config/agents/rules/plan-omp-transport.md` for OMP native approval and per-mutation local-draft copying; `.config/agents/rules/plan-grok-transport.md` for Grok discovery and direct repository authoring; and `.config/agents/rules/plan-repo-storage.md` for exact-byte, conflict-preserving, non-gating terminal storage.
- `.config/agents/skills/dev-ask/WORKFLOW.md`, `.config/agents/skills/dev-ask/evals/evals.json`, and targeted todo, validator, transport, worker-discipline, and parent-profile fixture directories.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains semantic decision authority rather than a planner, transport, or runtime ledger.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions** D06, D08, and D09; **Fixed shared contracts**; **Target map and critical anchors**; **Canonical discovery and continual learning**; **Material approval boundary**; and T3's task contract. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- D21 durable-write authority: `local://dev-workflow-routing-simplicity-decisions.md`, SHA-256 `ef2ac3ddd04239e1c055f25439d81f58f8ec503777c4fa691a3443abe83823be`, explicitly confirmed by the user.
- D21 research evidence: official [`DietrichGebert/ponytail` commit `2ed6c52c9d7e5e56942508591085fd45dea277d3`](https://github.com/DietrichGebert/ponytail/commit/2ed6c52c9d7e5e56942508591085fd45dea277d3), especially pinned [`skills/ponytail/SKILL.md`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/skills/ponytail/SKILL.md); the reuse/stdlib/native/already-installed-dependency ladder is consumed only at the existing worker seam, while upstream scope-reduction and proof-ceiling semantics are rejected.
- Superseded transport-correction evidence, retained as historical evidence and not current authority: user-approved Route Overview on 2026-08-10 for defect `DEF-3d1e57d746cea524b96d0e8f9cfd7216fac44c5b34528292aaf3edd0d0bbde27`, which required native OMP approval, byte-exact local lifecycle mirroring, and automatic projection-only archival without separate approval. Current repository-execution correction authority is `AUTH-RCP-REVISION-20260824` in `.agents/plans/2026-08-22-1603_repository-canonical-plans.md`, approved at SHA-256 `8f10f0797f45a4dd5493cb062ea2dd2db2cce5ad8fcba3cf2271b5b5cb00354e`.
- D08 live-runtime hardening authority: the user's explicit 2026-08-25 approval of a strict current-only versioned helper protocol, persistent synchronization-failure evidence, a live-version-skew regression, and distinct-slug concurrency with one writer per slug.
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
