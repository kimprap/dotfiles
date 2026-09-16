# Lean plans and orchestration

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-09-16  
**Decision IDs:** D06, D08, D09, D21, D29, D30

## Scope

This record governs the generic engineering workflow's implementation controller, lean repository-plan grammar, planning-authoring rethink, child task scheduling, direct checks, same-child rethink, plan lifecycle, and active-path persistence. It applies to the plan rules and validator, repository and harness transports, `dev-specification`, `dev-ticketing`, `dev-implementation`, `dev-ask`, `dev-handoff`, and the human workflow projections. It creates no product, mutation, delivery, or shipping authority.

## Context / problem

Cross-owner work needs enough durable structure for dependency scheduling, exact ownership, recovery, and objective completion without turning a plan into a second runtime. A controller must preserve global intent while every code-changing task remains child-owned. Plans also need one unambiguous active location across their whole lifecycle; lifecycle state should not trigger a storage move or become a presentation gate.

## Decisions

### D06 — Implementation controller binding

- **Decision:** The invoking agent is the one `dev-implementation` controller by default. A route-owning agent activates that role in place; standalone invocation does the same. A separate controller exists only when the approved topology explicitly binds it, controls its own implementation children without recursive controller delegation or outer-agent double scheduling, and returns across the real boundary to the concrete route owner. In-place role activation creates no self-Handoff.
- **Decision:** The controller validates intake, schedules dependency-ready work, enforces exact path and effect ownership, sends the single rethink wrapper to the same child, mechanically accepts lean Handoffs addressed to its concrete identity, dispatches independent assurance and learning, and updates plan lifecycle. For an execution-related child stop, Handoff validation confirms that the stop identifies a real shared-policy stop condition; otherwise the controller returns the specific eligibility question to the same responsible owner without redoing semantic judgment, repairing machinery, manufacturing eligibility, or repeatedly challenging a settled blocker.
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

- **Decision:** After an implementation candidate, the parent explicitly sends `.config/agents/references/impl-rethink/impl-rethink.md` to the same child. The wrapper applies code rethink, then test rethink. The child may make one correction, runs all owned direct checks and the changed path, and emits one lean Handoff. There is no second self-rethink.
- **Decision:** That single implementation candidate rethink is separate from execution recovery. A concrete execution-mechanism failure is assessed by the current owner before it is escalated; only an eligible corrected or unchanged retry triggers that same owner to apply `.config/agents/references/impl-rethink/recovery-rethink.md` once before execution. The recovery rethink may correct the proposal once and is not an independent opinion, recursive rethink, second implementation rethink, or assurance stage. `dev-implementation/references/execution-recovery.md` alone owns executable eligibility, recurrence, transient fallback, evidence, required-versus-disposable resource handling, explicit caps, continuation, and stops without adding plan or scheduler state.
- **Decision:** The code rethink preserves approved behavior and safety, traces edge, error, and state paths, reuses existing owners and local patterns, and chooses the lowest total lifecycle cost among eligible solutions. It never treats fewer files or lines as improvement when decisions or indirection increase.
- **Decision:** `dev-implementation/references/test-value.md` owns common proof selection and remains the sole permanent-test policy. Test rethink consumes the common principles for current proposed checks without redefining approved acceptance, and applies the permanent-only requirements to retained tests. Reuse the closest existing test file, test at the lowest effective level, and keep permanent tests deterministic and isolated. If a production seam existed only for tests that the policy now rejects, remove it unless runtime behavior or architecture still justifies it.
- **Why:** One bounded same-owner challenge catches omissions without adding another repair role or duplicating test policy.
- **Rejected alternatives:** Repeated self-review, separate closure rounds, copied test policy, source-restating tests, and an ablation ceremony create more process without stronger behavioral evidence.
- **Consequences:** Attempt 1 includes candidate, rethink, optional correction, direct checks, and Handoff. Assurance and audit roles never perform this rethink. A premature execution-related blocked return does not end the approved outcome when the shared policy still permits same-owner recovery; exhausted semantic repair still prohibits another deliverable change.
- **Reopen when:** Rethink ownership, order, correction bound, execution-recovery activation, controller Handoff validation, or permanent-test policy ownership changes.

### D29 — Active plan lifecycle and persistence

- **Decision:** Use exactly `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED`. Set `IN_PROGRESS` before the first implementation dispatch. `DONE` requires every task and acceptance item checked, every task completion record present, assurance settled, `Completed At`, and a nonempty final Completion Summary. `CLOSED` requires explicit stop authority and has neither `Completed At` nor Completion Summary.
- **Decision:** `.agents/plans/<Datetime>_<slug>.md` is the sole execution, update, continuation, and completion source for every lifecycle state. OMP and other local-draft adapters validate and copy exact bytes atomically to that active path for all four states.
- **Decision:** Completion leaves the plan `DONE` at the active path. Automatic archive creation, active-path removal, archive receipts, and archive postconditions are absent. Existing identity-matching archives are read-only conflict surfaces; storage preserves them and stops rather than overwriting.
- **Why:** One stable locator simplifies execution and recovery while keeping storage separate from semantic completion.
- **Rejected alternatives:** Lifecycle-triggered moves and archive-only recovery split the authoritative path and make storage a completion gate.
- **Consequences:** Presentation cites the current active `DONE` plan. Historical archives remain untouched and readable but never become current execution input.
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

- `.config/agents/rules/plan.md`, `plan-impl-spec.md`, `plan-repo-storage.md`, `plan-omp-transport.md`, and `plan-grok-transport.md`.
- `.config/agents/skills/dev-ticketing/references/task-sizing.md`; `.config/agents/skills/dev-implementation/SKILL.md`, `references/plan-orchestration.md`, `references/test-value.md`, and `scripts/executor_plan.py` with its existing tests and fixtures.
- `.config/agents/references/impl-rethink/**`, `dev-handoff`, the plan copy helper and OMP extension, and human workflow projections.

- `.config/agents/references/plan-rethink.md` and the existing specification, direct-contract, ticketing and standalone-plan author/caller contracts.

## Evidence / source revisions

- Current governing authority: `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`; `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`; and the human-approved `local://task-sizing-direct-contract.md`, confirmed 2026-09-06.
- Confirmed `verification-proof-design/v1` and separately approved `verification-policy-implementation/v1`, 2026-09-11, extend proof selection at existing authoring and rethink seams without altering plan lifecycle, storage, transport, or task sizing.
- Confirmed `execution-recovery-policy/v1`, SHA-256 `1b46e0f4c09e800223e49f2dde437510fc7ab4ceb89c369e96ad45815c288256`, and its separately approved implementation route, 2026-09-13, distinguish same-owner pre-retry recovery rethink from the single implementation candidate rethink without changing plan lifecycle or controller ownership.
- Confirmed `planning-authoring-rethink/v1`, SHA-256 `cd1aaef359290a93f271039a272cd865210c41f052ac0ffc0cdf838267a7616b`, plus the later human-approved immediate-installation decision, 2026-09-14, authorize this planning extension; the earlier evaluation-before-installation restriction is superseded, not the approved core or authoring boundaries.
- Earlier plan and transport records remain historical support where consistent with this clean cutover.
- The prompt-bundle `MAINTENANCE.md` is provenance only; executable prompt files own rethink behavior.

## Human authority

The human-approved lean workflow, ticket graph and planning-rethink installation decision authorize this projection. They do not authorize shipping, destructive or external effects, a compatibility reader, or changes to historical archive bytes.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index. D29's current active-path decision replaces its former terminal archival behavior without creating a new decision ID.

D30 adds planning-authoring behavior and supersedes no existing ADR decision.

## Verification expectations

- Lean valid plans pass; proof-heavy bodies, duplicate or unowned targets, missing direct checks, cycles, and incomplete terminal states fail.
- New plan tasks follow the shared sizing policy without changing lean grammar; implementation projects approved task ownership and dependencies exactly.
- Substantive planning authors load applicable current sources before drafting and perform one same-author post-candidate rethink before submission or readiness; mechanical operations remain excluded.
- Concrete-check authoring selects representative adequate proof before approval; linked acceptance remains exact, including compatible shared observations and necessary separate outcomes.
- Every code-changing task is child-owned and receives one same-child code-then-test rethink before direct checks and Handoff.
- `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED` persist exact bytes at the active identity path without archive creation or active-path removal.
- Human maps, active skills, rules, focused evals, and callers agree with D06, D08, D09, D21, D29, and D30.
