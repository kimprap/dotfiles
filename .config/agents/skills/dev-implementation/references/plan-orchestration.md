# Lean plan orchestration

Use this procedure only for an approved lean implementation plan. It adds no plan grammar or authority.

## Enter

1. Resolve the current active plan and run `python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN` against those bytes. Continue only on a valid `PENDING` or `IN_PROGRESS` plan.
2. Project the authored task IDs, owners, dependencies, targets, acceptance IDs, and receivers exactly. Do not add, split, merge, substitute, or hide work.
3. Confirm native child transport has the required capability to preserve every task's bound owner, dependencies, path/effect boundary, attempt number, and concrete controller receiver. Missing required capability is `transport-unavailable`; a concrete failed invocation is assessed under the shared execution-recovery policy before that blocker is escalated. The controller never substitutes itself or a newly minted actor for a required owner.
4. Immediately before the first implementation-child dispatch, change `PENDING` to `IN_PROGRESS`. Controller activation alone does not change plan state. Plan lifecycle writes record state; they grant no new behavior or effects.

## Schedule

- A task is ready only when every dependency Handoff has been accepted and its owned targets do not conflict with active work.
- Dispatch mechanically disjoint ready tasks concurrently when the runtime safely supports it. Serialize overlap, ambiguous ownership, exclusive resources, ordered migration, and fan-in.
- The controller may read, validate, schedule, enforce boundaries, request rethink, aggregate Handoffs, dispatch assurance and learning, and update plan lifecycle. It never performs code-changing task work or semantic repair.
- A child receives only approved intent and acceptance IDs, exact owned paths/surfaces, dependency Handoffs, applicable project instructions, semantic attempt number, the concrete bound controller as its one receiver, and an explicit caller-selected declared response-object schema. Bind its exact child and native job identities before collection, and use only a transport that keeps that same child resumable after candidate-job settlement.
- Undeclared path or effect mutation stops that task. Preserve completed independent work; do not reinterpret the plan to absorb drift.

If an invocation, runner, transport, environment, automation, fixture,
collection, capture, or task-local helper failure prevents planned execution
from continuing, the same execution owner assesses
`skill://dev-implementation/references/execution-recovery.md` before escalating
the blocker. Only an eligible retry receives the explicit recovery rethink that
policy requires. Preserve the failed evidence, cause, and used allowance in the
lean Handoff; do not add plan or scheduler state.

Only the `dev-implementation` controller's awaited collection of the same
bound child's implementation-rethink Handoff in either semantic attempt and
the return from an already-authorized same-child recovery operation bypass
another consent, attendance, external-supervisor, or abort-capability
preflight. This exact role-and-purpose exemption changes no authority,
allowance, deadline, observer, replay, replacement, or custom-controller
obligation.

## Close a work attempt

1. Preflight the explicit declared response-object schema, resumable same-child transport, and exact controller/child/job/task/attempt/`candidate` bindings. The child implements its task and terminal-completes a type-absent ordinary candidate before final smoke or Handoff; incremental publication and parking are not candidate return.
2. Collect only the exact completed job. Immediately retain the complete original native result and matching job record, apply the loaded adapter's terminal/status/schema/identity checks, and decode only its designated structured data before admitting the candidate. Missing, invalid, mismatched, consumed, or alternate-source output fails closed. Job settlement is neither task completion nor disposal.
3. Send `~/.agents/references/impl-rethink/impl-rethink.md` once to that same child through a fresh-token awaited owner-directed request under the exact implementation collection exemption above. The child applies code rethink, then test rethink, makes at most one correction pass, runs every owned direct check and changed-path smoke, and replies on the request's message channel with one lean Handoff to the concrete bound controller. Yield, ordinary completion, a missing awaited return, or replacement child cannot satisfy it.
4. The same child then loads `papercut` once for that completed repository-work boundary. The controller substitutes only when the child is unavailable.
5. The controller mechanically accepts only the retained owner-directed native return, declared targets/effects, complete owned check records, exact task/attempt identity, and its own bound receiver identity. If a Handoff escalates an execution-related stop without naming an actual shared-policy stop condition, return the specific eligibility question to the same responsible owner. The controller does not redo semantic judgment, repair machinery, manufacture eligibility, replace a required owner, or repeatedly challenge a settled blocker.
6. Mark the task complete, add `  completed YYYY-MM-DD-HHMM` immediately after its checked task line, and check each criterion only after its exact check reports the expected result.

Attempt 1 is the terminal candidate job and admission, same-child rethink, optional correction, smoke, and owner-directed Handoff. Do not self-rethink twice. Execution recovery is separately governed by `skill://dev-implementation/references/execution-recovery.md`; it consumes no semantic attempt only while the evaluated target and deliverable remain unchanged, and it never resets the two-attempt bound. After recovery rethink, an already-authorized same-child recovery operation's return uses the exact collection exemption above and never receives a second implementation rethink. The only attempt 2 is one later code-changing repair of a required reviewer or verifier finding. Its responsible child follows the same explicit-schema, resumable job-then-owner-directed-return sequence and the same exact implementation-rethink collection exemption. Attempts are limited to attempt 1 and an eligible attempt 2. Exhaustion stops another semantic change, not otherwise eligible machinery recovery under its existing allowance.

## Assurance and finish

- Compact ends after accepted work Handoffs and papercut accounting. It dispatches no independent review, verification, or learning.
- Standard and high dispatch one independent `dev-code-review` after the complete changed target exists, then one independent `dev-verification`, then `dev-continual-learning` once. Each returns to the concrete controller. Review runs exactly once. Verification runs every original acceptance check plus every reviewer closure check.
- A required review finding may consume attempt 2 before verification. If attempt 2 remains unused and the verifier finds a code defect, the same responsible child may consume it; the same verification owner closes the complete unchanged check set without restarting discovery. Any unresolved failure after attempt 2 stops.
- Learning receives the settled outcome, affected paths, lean Handoffs, papercut results, and complete candidates. It does not retry. Only a current governing-rule conflict that invalidates the implementation blocks completion; other learning blockers remain risks.
- When every task and acceptance item is checked, every task has its completion record, and assurance is settled, add a nonempty final `## Completion Summary`, add `Completed At`, and set the plan to `DONE`. Keep it at the active path. `CLOSED` records an explicitly stopped plan and carries neither `Completed At` nor a Completion Summary. An in-place controller then validates terminal evidence without a self-Handoff; only a controller explicitly delegated by the approved topology returns one Handoff to the concrete route owner.