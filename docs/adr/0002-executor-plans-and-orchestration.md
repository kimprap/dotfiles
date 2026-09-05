# Lean plans and orchestration

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-09-06  
**Decision IDs:** D06, D08, D09, D21, D29

## Scope

This record governs the generic engineering workflow's implementation controller, lean repository-plan grammar, child task scheduling, direct checks, same-child rethink, plan lifecycle, and active-path persistence. It applies to the plan rules and validator, repository and harness transports, `dev-implementation`, `dev-handoff`, and the human workflow projections. It creates no product, mutation, delivery, or shipping authority.

## Context / problem

Cross-owner work needs enough durable structure for dependency scheduling, exact ownership, recovery, and objective completion without turning a plan into a second runtime. A controller must preserve global intent while every code-changing task remains child-owned. Plans also need one unambiguous active location across their whole lifecycle; lifecycle state should not trigger a storage move or become a presentation gate.

## Decisions

### D06 — Implementation controller binding

- **Decision:** One `dev-implementation` parent controls an approved outcome. It validates intake, schedules dependency-ready work, enforces exact path and effect ownership, sends the single rethink wrapper to the same child, mechanically accepts lean Handoffs, dispatches assurance and learning, and updates plan lifecycle.
- **Decision:** Every code-changing task, repair, and authored fan-in belongs to a child. The parent never implements, semantically repairs, or chooses a winner during integration. If native child transport cannot preserve owner, dependencies, effects, attempt, and receiver, stop `transport-unavailable`.
- **Why:** Separating control from semantic work preserves ownership and makes failure recovery explicit.
- **Rejected alternatives:** Parent implementation, hidden rescue work, and weakened sequential substitutions collapse the controller and worker roles.
- **Consequences:** Mechanically disjoint ready tasks may run concurrently; overlap, ordered effects, exclusive resources, and fan-in serialize.
- **Reopen when:** Native child transport or controller ownership changes.

### D08 — Lean plan shape

- **Decision:** A repository plan contains the fixed header and only `Outcome and authority`, `Scope and effects`, `Tasks`, `Acceptance`, `Recovery and stops`, plus `Completion Summary` only when `DONE`.
- **Decision:** Each task has one stable monotonic `T*` ID, one child owner, dependencies, unique exact targets, acceptance IDs, and one receiver. Each acceptance item has one stable `AC-*` ID and exactly:

  ```text
  Behavior: <observable>
  Check: <command or direct static proof>; expect <exact result>
  ```

- **Decision:** The validator checks lifecycle, ordered sections, unique IDs, dependency acyclicity, target and criterion ownership, direct-check grammar, terminal checkboxes and completion records, and a nonempty terminal summary. It derives transient parse state and returns no plan digest.
- **Decision:** Authors of new plans consult `.config/agents/skills/dev-ticketing/references/task-sizing.md` and record a material boundary rationale only in existing prose. Sizing adds no field, section, status, or validator rule.
- **Why:** These are the durable facts a fresh executor needs; everything else belongs to runtime.
- **Rejected alternatives:** Target identity tables, generated task or sizing metadata, assurance-tail tasks, and transport receipts duplicate controller state and obscure the human outcome.
- **Consequences:** The active validator accepts only the lean format. Existing archived plans remain historical data and are not compatibility input.
- **Reopen when:** A fresh executor cannot act safely from this grammar or the ownership model changes.

### D09 — Mechanical task projection

- **Decision:** Project authored task IDs, owners, dependencies, targets, acceptance IDs, and receivers exactly. Do not add, split, merge, substitute, or hide work.
- **Decision:** New task graphs apply the shared sizing policy at real ownership and dependency seams. The implementation controller projects an approved graph unchanged; a later estimate alone does not authorize splitting, merging, or substituting tasks, while a material change follows existing authority and reapproval rules.
- **Decision:** A task becomes ready only when all dependencies have accepted Handoffs and its target/effect boundary does not conflict with active work. Undeclared mutation stops the task while completed independent work remains preserved.
- **Decision:** Check a task and add its immutable completion record only after its same-child rethink, direct checks, lean Handoff, and papercut accounting complete. Check an acceptance item only after its exact expected result is observed.
- **Decision:** Review, verification, learning, manual audit, shipping, and presentation are lifecycle owners, not authored implementation tasks.
- **Why:** One authoritative task graph plus derived scheduler state is enough.
- **Rejected alternatives:** Hidden tails, invented repair tasks, and controller-authored semantic changes expand authority during execution.
- **Consequences:** Recovery can resume from the active plan and accepted Handoffs without a second plan or state ledger.
- **Reopen when:** Readiness, completion accounting, or task projection changes.

### D21 — Same-child rethink and test value

- **Decision:** After an implementation candidate, the parent explicitly sends `.config/agents/references/impl-rethink/impl-rethink.md` to the same child. The wrapper applies code rethink, then test rethink. The child may make one correction, runs all owned direct checks and the changed path, and emits one lean Handoff. There is no second self-rethink.
- **Decision:** The code rethink preserves approved behavior and safety, traces edge, error, and state paths, reuses existing owners and local patterns, and chooses the lowest total lifecycle cost among eligible solutions. It never treats fewer files or lines as improvement when decisions or indirection increase.
- **Decision:** `dev-implementation/references/test-value.md` remains the sole permanent-test policy. Reuse the closest existing test file, test at the lowest effective level, and keep tests deterministic and isolated. If a production seam existed only for tests that the policy now rejects, remove it unless runtime behavior or architecture still justifies it.
- **Why:** One bounded same-owner challenge catches omissions without adding another repair role or duplicating test policy.
- **Rejected alternatives:** Repeated self-review, separate closure rounds, copied test policy, source-restating tests, and an ablation ceremony create more process without stronger behavioral evidence.
- **Consequences:** Attempt 1 includes candidate, rethink, optional correction, direct checks, and Handoff. Assurance and audit roles never perform this rethink.
- **Reopen when:** Rethink ownership, order, correction bound, or permanent-test policy ownership changes.

### D29 — Active plan lifecycle and persistence

- **Decision:** Use exactly `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED`. Set `IN_PROGRESS` before the first implementation dispatch. `DONE` requires every task and acceptance item checked, every task completion record present, assurance settled, `Completed At`, and a nonempty final Completion Summary. `CLOSED` requires explicit stop authority and has neither `Completed At` nor Completion Summary.
- **Decision:** `.agents/plans/<Datetime>_<slug>.md` is the sole execution, update, continuation, and completion source for every lifecycle state. OMP and other local-draft adapters validate and copy exact bytes atomically to that active path for all four states.
- **Decision:** Completion leaves the plan `DONE` at the active path. Automatic archive creation, active-path removal, archive receipts, and archive postconditions are absent. Existing identity-matching archives are read-only conflict surfaces; storage preserves them and stops rather than overwriting.
- **Why:** One stable locator simplifies execution and recovery while keeping storage separate from semantic completion.
- **Rejected alternatives:** Lifecycle-triggered moves and archive-only recovery split the authoritative path and make storage a completion gate.
- **Consequences:** Presentation cites the current active `DONE` plan. Historical archives remain untouched and readable but never become current execution input.
- **Reopen when:** Repository-plan identity, lifecycle, exact-byte storage, or active-path ownership changes.

## Affected contracts

- `.config/agents/rules/plan.md`, `plan-impl-spec.md`, `plan-repo-storage.md`, `plan-omp-transport.md`, and `plan-grok-transport.md`.
- `.config/agents/skills/dev-ticketing/references/task-sizing.md`; `.config/agents/skills/dev-implementation/SKILL.md`, `references/plan-orchestration.md`, `references/test-value.md`, and `scripts/executor_plan.py` with its existing tests and fixtures.
- `.config/agents/references/impl-rethink/**`, `dev-handoff`, the plan copy helper and OMP extension, and human workflow projections.

## Evidence / source revisions

- Current governing authority: `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`; `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`; and the human-approved `local://task-sizing-direct-contract.md`, confirmed 2026-09-06.
- Earlier plan and transport records remain historical support where consistent with this clean cutover.
- The prompt-bundle `MAINTENANCE.md` is provenance only; executable prompt files own rethink behavior.

## Human authority

The human-approved lean workflow and ticket graph authorize this projection. They do not authorize shipping, destructive or external effects, a compatibility reader, or changes to historical archive bytes.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index. D29's current active-path decision replaces its former terminal archival behavior without creating a new decision ID.

## Verification expectations

- Lean valid plans pass; proof-heavy bodies, duplicate or unowned targets, missing direct checks, cycles, and incomplete terminal states fail.
- New plan tasks follow the shared sizing policy without changing lean grammar; implementation projects approved task ownership and dependencies exactly.
- Every code-changing task is child-owned and receives one same-child code-then-test rethink before direct checks and Handoff.
- `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED` persist exact bytes at the active identity path without archive creation or active-path removal.
- Human maps, active skills, rules, focused evals, and callers agree with D06, D08, D09, D21, and D29.
