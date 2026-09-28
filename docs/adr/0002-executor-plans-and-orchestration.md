# Lean plans and orchestration

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-09-29  
**Decision IDs:** D06, D08, D09, D21, D29, D30

## Scope

This record governs the generic engineering workflow's implementation controller, lean repository-plan grammar, planning-authoring rethink, child task scheduling, direct checks, same-child rethink, plan lifecycle, and active-path persistence. It applies to the plan rules and validator, repository and harness transports, `dev-specification`, `dev-ticketing`, `dev-implementation`, `dev-ask`, `dev-handoff`, and the human workflow projections. It creates no product, mutation, delivery, or shipping authority.

## Context / problem

Cross-owner work needs enough durable structure for dependency scheduling, exact ownership, recovery, and objective completion without turning a plan into a second runtime. A controller must preserve global intent while every code-changing task remains child-owned. Plans also need one unambiguous active location across their whole lifecycle; lifecycle state should not trigger a storage move or become a presentation gate.

## Decisions

### D06 — Implementation controller binding

- **Decision:** The invoking agent is the one `dev-implementation` controller by default. A route-owning agent activates that role in place; standalone invocation does the same. A separate controller exists only when the approved topology explicitly binds it, controls its own implementation children without recursive controller delegation or outer-agent double scheduling, and returns across the real boundary to the concrete route owner. In-place role activation creates no self-Handoff.
- **Decision:** The controller validates intake, schedules dependency-ready work, enforces exact path and effect ownership, sends the single rethink wrapper to the same child, mechanically admits each logical owner-directed report once only after portable native-provenance and declared-body validation, accepts lean Handoffs addressed to its concrete identity, dispatches independent assurance and learning, and updates plan lifecycle. For an execution-related child stop, Handoff validation confirms that the stop identifies a real shared-policy stop condition; otherwise the controller returns the specific eligibility question to the same responsible owner without redoing semantic judgment, repairing machinery, manufacturing eligibility, or repeatedly challenging a settled blocker.
- **Decision:** Every code-changing task, repair, and authored fan-in belongs to a child. The controller never implements, semantically repairs, or chooses a winner during integration. Required controller, child, and verifier identities are reused or resumed rather than replaced. Missing native capability to preserve owner, dependencies, effects, attempt, receiver, or required follow-up is `transport-unavailable`; a concrete failed invocation is assessed under execution recovery before escalation.
- **Why:** Separating control from semantic work preserves ownership and makes failure recovery explicit, while in-place activation avoids a weightless controller layer.
- **Rejected alternatives:** Controller self-Handoffs, unconditional or recursive controller spawning, outer-agent double scheduling, parent implementation, hidden rescue work, and weakened sequential substitutions collapse or duplicate controller and worker roles.
- **Consequences:** Mechanically disjoint ready tasks may run concurrently; overlap, ordered effects, exclusive resources, and fan-in serialize. `PENDING` becomes `IN_PROGRESS` immediately before the first implementation-child dispatch, not merely when the controller role activates.
- **Reopen when:** Native child transport, controller entry or identity, or controller ownership changes.

### D08 — Lean plan shape

- **Decision:** A repository plan contains the fixed header and only `Outcome and authority`, `Scope and effects`, `Tasks`, `Acceptance`, `Recovery and stops`, plus `Completion Summary` only when `DONE`.
- **Decision:** Each task has one stable monotonic `T*` ID, one child owner, dependencies, unique exact targets, acceptance IDs, and one receiver. Each acceptance item has one stable `AC-*` ID and exactly:

  ```text
  Behavior: <observable>
  Check: <command or direct static proof>; expect <exact result>
  ```

- **Decision:** The validator checks lifecycle, ordered sections, unique IDs, dependency acyclicity, target and criterion ownership, direct-check grammar, terminal checkboxes and completion records, and a nonempty terminal summary. It derives transient parse state and returns no plan digest.
- **Decision:** Authors of new plans consult `.config/agents/skills/dev-ticketing/references/task-sizing.md` and record a material boundary rationale only in existing prose. Sizing adds no field, section, status, or validator rule.
- **Decision:** Before concrete acceptance becomes binding, specification, self-contained plan, and direct-contract authors apply the common proof-selection policy in `dev-implementation/references/test-value.md`. Material selection rationale stays in existing prose; no field, section, count cap, or stage is added.
- **Why:** These are the durable facts a fresh executor needs; everything else belongs to runtime.
- **Rejected alternatives:** Target identity tables, generated task or sizing metadata, assurance-tail tasks, and transport receipts duplicate controller state and obscure the human outcome.
- **Consequences:** The active validator accepts only the lean format. Existing archived plans remain historical data and are not compatibility input.
- **Reopen when:** A fresh executor cannot act safely from this grammar or the ownership model changes.

### D09 — Mechanical task projection

- **Decision:** Project authored task IDs, owners, dependencies, targets, acceptance IDs, and receivers exactly. Do not add, split, merge, substitute, or hide work.
- **Decision:** New task graphs apply the shared sizing policy at real ownership and dependency seams. The implementation controller projects an approved graph unchanged; a later estimate alone does not authorize splitting, merging, or substituting tasks, while a material change follows existing authority and reapproval rules.
- **Decision:** Project specification acceptance IDs and exact Behavior/Check text, including shared scenarios and per-item expected observations, unchanged. Shared execution does not merge criterion ownership; later changes to behavior or check meaning return to the existing authority owner.
- **Decision:** A task becomes ready only when all dependencies have accepted Handoffs and its target/effect boundary does not conflict with active work. Undeclared mutation stops the task while completed independent work remains preserved.
- **Decision:** Check a task and add its immutable completion record only after its same-child rethink, direct checks, lean Handoff, and papercut accounting complete. Check an acceptance item only after its exact expected result is observed.
- **Decision:** Review, verification, learning, manual audit, shipping, and presentation are lifecycle owners, not authored implementation tasks.
- **Why:** One authoritative task graph plus derived scheduler state is enough.
- **Rejected alternatives:** Hidden tails, invented repair tasks, and controller-authored semantic changes expand authority during execution.
- **Consequences:** Recovery can resume from the active plan and accepted Handoffs without a second plan or state ledger.
- **Reopen when:** Readiness, completion accounting, or task projection changes.

### D21 — Same-child rethink and test value

- **Decision:** Before child allocation, a collector without every schema, identity and collection capability its host requires stops `transport-unavailable`; no delegated-controller substitution. Native return collection, including its capability gates, wait and delivery observation, launch and follow-up binding, and their stops, follows the host's return adapter; on OMP that is [the OMP return adapter](../../.config/agents/harnesses/omp/agent-return.md). No resend, replacement, reset, polling rule or alternate-source recovery. Capable other-host topology remains unchanged.
- **Decision:** Attempt 1 preflights an explicit caller-selected response-object schema and normal non-isolated resumable child. Its terminal type-absent candidate is admitted once, only from the exact allocated launch after immediate original-result retention, adapter validation and exact task/attempt/owner/receiver/phase checks. An eligible attempt 2 resumes the same child, never another child or launch. Before follow-up bind controller/child/task/attempt/receiver/phase, operation/report identity, invocation and schema. Failed jobs, relays and alternate sources are unadmitted. After either candidate admission separately send the same child the implementation rethink: code then test rethink, at most one correction, all owned direct checks and changed-path smoke, then one lean Handoff through that same host-selected seam. Job settlement is neither task completion nor disposal. There is no second self-rethink.
- **Decision:** That single implementation candidate rethink is separate from execution recovery. A concrete execution-mechanism failure is assessed by the current owner before it is escalated; only an eligible corrected or unchanged retry triggers that same owner to apply `.config/agents/references/impl-rethink/recovery-rethink.md` once before execution. The recovery rethink may correct the proposal once and is not an independent opinion, recursive rethink, second implementation rethink, or assurance stage. `dev-implementation/references/execution-recovery.md` alone owns executable eligibility, recurrence, transient fallback, evidence, required-versus-disposable resource handling, explicit caps, continuation, and stops without adding plan or scheduler state.
- **Decision:** Only the approved `dev-implementation` controller's host-selected collection from its same bound child for an authorized attempt-2 candidate, implementation-rethink Handoff in either attempt, or already-authorized recovery return bypasses another consent, attendance, external-supervisor or abort-capability preflight. Already-authorized recovery returns use the same seam and exemption without a second implementation rethink. Assurance and audit roles never perform this rethink. This adds no observer, service, ledger, deadline or unattended-completion promise. Custom controllers keep their own session lifecycle and count rules (ADR-0010 D31).
- **Decision:** The portable token/message path, wrong-token preservation and one explicitly recovery-authorized byte-exact restatement remain for hosts that actually supply native reply correlation; hosts with durable completion jobs use their adapter's job path instead. A host with neither native correlation nor durable completion jobs stops `transport-unavailable`, never inventing an alternate-source fallback. Restatement where supported creates no semantic work, attempt, replacement, allowance reset or second admission and does not override narrower custom-controller budgets.
- **Decision:** The code rethink preserves approved behavior and safety, traces edge, error, and state paths, reuses existing owners and local patterns, and chooses the lowest total lifecycle cost among eligible solutions. It never treats fewer files or lines as improvement when decisions or indirection increase.
- **Decision:** `dev-implementation/references/test-value.md` owns common proof selection and remains the sole permanent-test policy. Test rethink consumes the common principles for current proposed checks without redefining approved acceptance, and applies the permanent-only requirements to retained tests. Reuse the closest existing test file, test at the lowest effective level, and keep permanent tests deterministic and isolated. If a production seam existed only for tests that the policy now rejects, remove it unless runtime behavior or architecture still justifies it.
- **Why:** One bounded same-owner challenge catches omissions without adding another repair role or duplicating test policy. Provenance-bound logical-report admission survives a finite native window without weakening identity, count, custom supervision, or native ending facts.
- **Rejected alternatives:** Repeated self-review, separate closure rounds, copied test policy, source-restating tests, an ablation ceremony, one-call-only admission, inbox/history reconstruction, mandatory disabled timers, new observers or services, and blanket recovery or restatement exemptions create more process or weaker authority boundaries without stronger behavioral evidence.
- **Reopen when:** Rethink ownership, order, correction bound, host-selected return admission, execution-recovery activation, controller Handoff validation, or permanent-test policy ownership changes.

### D29 — Active plan lifecycle and persistence

- **Decision:** Use exactly `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED`. Set `IN_PROGRESS` before the first implementation dispatch. `DONE` requires every task and acceptance item checked, every task completion record present, assurance settled, `Completed At`, and a nonempty final Completion Summary. `CLOSED` requires explicit stop authority and has neither `Completed At` nor Completion Summary.
- **Decision:** `.agents/plans/<Datetime>_<slug>.md` is the sole execution, update, continuation, and completion source for every lifecycle state. OMP and other local-draft adapters validate and copy exact bytes atomically to that active path for all four states.
- **Decision:** Completion leaves the plan `DONE` at the active path and cites that path. Automatic or lifecycle-triggered archive creation, active-path removal as part of completion, and archive completion gates are absent. Existing identity-matching archives are read-only conflict surfaces; storage preserves them and stops rather than overwriting.
- **Decision:** A `DONE` or `CLOSED` plan that validates, is committed without local edits, and has no same-name archive may be archived only on explicit human request, any time after the plan reaches `DONE` or `CLOSED`, including right after the completion report. The plan and the authority chain it names move with `git mv` to `.agents/plans/archive/` and `.agents/artifacts/archive/` with exact bytes; a document still cited by a non-archived plan stays in place, and an uncited standalone artifact may be archived on request. Live links in ADRs, skills, rules, and docs follow the move; archived bytes are never edited.
- **Why:** One stable locator simplifies execution and recovery while keeping storage separate from semantic completion.
- **Rejected alternatives:** Lifecycle-triggered moves and archive-only recovery split the authoritative path and make storage a completion gate.
- **Consequences:** Presentation cites the current active `DONE` plan; a later on-request archive does not change the completion report. Historical archives remain untouched and readable but never become current execution input.
- **Reopen when:** Repository-plan identity, lifecycle, exact-byte storage, or active-path ownership changes.

### D30 — Same-author planning rethink

- **Decision:** Existing authors of substantive technical specifications, planless direct contracts, ticket graphs, and standalone execution plans resolve the applicable current sources before drafting. Sources remain with their existing owners; reuse current already-loaded material and retrieve missing or stale material.
- **Decision:** After the candidate, the same author explicitly loads and applies `.config/agents/references/plan-rethink.md` once, with at most one bounded correction before final submission for approval or execution readiness. Inline authors perform this as a separate post-candidate step; delegated callers send the explicit follow-up to that same author after the candidate returns. Initial draft persistence may precede the pass; existing approval and publication mechanics remain unchanged.
- **Decision:** Reconsider only decisions the author owns. Preserve inherited acceptance, approved graph boundaries, effects, assurance and routing, including planless execution. A graph that newly selects ownership or dependencies is substantive even when its acceptance is projected unchanged. Exact unchanged projections, storage copies, lifecycle or checkbox updates, and unchanged approved contracts do not trigger another pass.
- **Decision:** Planning rethink is distinct from implementation and execution-recovery rethink. It creates no planning skill, lifecycle owner, stage, state, field, ledger, independent opinion or recursive pass; sizing, proof selection, plan semantics and harness transport retain their existing authority.
- **Why:** Make source exposure and candidate challenge explicit at existing authoring boundaries without consolidating distinct policy owners.
- **Rejected alternatives:** A separate planning skill or stage, caller-authored corrections, a universal pre-persistence gate and repeated passes introduce ownership or ceremony without a new author-owned decision.
- **Consequences:** Immediate installation is an explicit human choice, without the preliminary comparison. Normal checks must establish invocation and authority preservation; comparative planning-quality or efficiency benefit remains unproved.
- **Reopen when:** Authoring ownership, candidate timing, source ownership or the correction bound changes.

## Affected contracts

- `.config/agents/rules/plan.md`, `.config/agents/rules/plan-impl-spec.md`, `.config/agents/harnesses/omp/plan-transport.md`, and `.config/agents/harnesses/grok/plan-transport.md`.
- `.config/agents/skills/dev-ticketing/references/task-sizing.md`; `.config/agents/skills/dev-implementation/SKILL.md`, `references/plan-orchestration.md`, `references/test-value.md`, and `scripts/executor_plan.py` with its existing tests and fixtures.
- `.config/agents/references/impl-rethink/**`, `dev-handoff`, the plan copy helper and OMP extension, and human workflow projections.

- `.config/agents/references/plan-rethink.md` and the existing specification, direct-contract, ticketing and standalone-plan author/caller contracts.

## Evidence / source revisions

- Approved by the owner on 2026-09-04, 2026-09-06, 2026-09-11, 2026-09-13, 2026-09-14 and 2026-09-27; history in git.
- The prompt-bundle `MAINTENANCE.md` is provenance only; executable prompt files own rethink behavior.

## Human authority

The human-approved lean workflow, ticket graph and planning-rethink installation decision authorize this projection. They do not authorize shipping, destructive or external effects, a compatibility reader, or changes to historical archive bytes.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index. D29's current active-path decision replaces its former terminal archival behavior without creating a new decision ID; its on-request archive decision was later added in place the same way.

D30 adds planning-authoring behavior and supersedes no existing ADR decision.

## Verification expectations

- Lean valid plans pass; proof-heavy bodies, duplicate or unowned targets, missing direct checks, cycles, and incomplete terminal states fail.
- New plan tasks follow the shared sizing policy without changing lean grammar; implementation projects approved task ownership and dependencies exactly.
- Substantive planning authors load applicable current sources before drafting and perform one same-author post-candidate rethink before submission or readiness; mechanical operations remain excluded.
- Concrete-check authoring selects representative adequate proof before approval; linked acceptance remains exact, including compatible shared observations and necessary separate outcomes.
- Every code-changing task is child-owned and receives one same-child code-then-test rethink before direct checks and Handoff.
- `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED` persist exact bytes at the active identity path without archive creation or active-path removal; only an explicit human request archives an eligible `DONE` or `CLOSED` plan with exact-byte `git mv`.
- The human map, active skills, rules, focused evals, and callers agree with D06, D08, D09, D21, D29, and D30.
