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
- A child receives only approved intent and acceptance IDs, exact owned paths/surfaces, dependency Handoffs, applicable project instructions, semantic attempt number, the concrete bound controller as its one receiver, and an explicit caller-selected declared response-object schema. Attempt 1 binds its exact child and launch job. Attempt 2 resumes that retained child through the host-selected repair-candidate seam; it never allocates another child or launch job.
- Undeclared path or effect mutation stops that task. Preserve completed independent work; do not reinterpret the plan to absorb drift.

If an invocation, runner, transport, environment, automation, fixture,
collection, capture, or task-local helper failure prevents planned execution
from continuing, the same execution owner assesses
`skill://dev-implementation/references/execution-recovery.md` before escalating
the blocker. Only an eligible retry receives the explicit recovery rethink that
policy requires. Preserve the failed evidence, cause, and used allowance in the
lean Handoff; do not add plan or scheduler state.

Same-child collections follow the `dev-implementation` owner-directed
return-preflight exemption, which defines their exact purposes and limits;
custom controllers keep their own obligations.

## Close a work attempt

For attempt 1:

1. Preflight the explicit declared response-object schema, normal non-isolated resumable child transport, and exact controller/child/job/task/attempt-1/receiver/`candidate` bindings. The child implements its task and returns its candidate by terminal ordinary completion before final smoke or Handoff; incremental publication and parking are not candidate return.
2. Collect only the exact completed job. Immediately retain the complete original native result and matching job record, apply the loaded adapter's terminal/status/schema/identity checks, and decode only its designated structured data before admitting the candidate. Missing, invalid, mismatched, consumed, or alternate-source output fails closed. Job settlement is neither task completion nor disposal.

For an authorized attempt-2 repair:

1. Resume the same responsible child; allocate no new child or launch job. Bind controller/child/task/attempt-2/receiver/`candidate` phase, declared response schema, active invocation and logical report identity.
2. Use the portable return contract and loaded adapter.
3. Collect through the loaded host adapter's collection rules, then admit exact task/attempt/owner/receiver/phase once. Hosts with native reply correlation use the portable token/message path and its recovery-authorized exact-copy rule. Job settlement is neither task completion nor disposal.

After either candidate is admitted:

1. Bind child/controller/task/attempt/operation/logical-Handoff/phase/schema/invocation and send `~/.agents/references/impl-rethink/impl-rethink.md` once through the selected host seam under the `dev-implementation` owner-directed return-preflight exemption. The child applies code rethink then test rethink, at most one correction, all owned checks and changed-path smoke, and returns one lean Handoff. Send it only after retaining the candidate job. Delivery and job settlement are not task completion or disposal. Hosts with native reply correlation use the portable token path.
2. Papercut accounting follows the papercut scheduling rule.
3. The controller mechanically accepts only the admitted logical report with its retained original structured provenance object or objects, declared targets/effects, complete owned check records, exact task/attempt identity, and its own bound receiver identity. If a Handoff escalates an execution-related stop without naming an actual shared-policy stop condition, return the specific eligibility question to the same responsible owner. The controller does not redo semantic judgment, repair machinery, manufacture eligibility, replace a required owner, or repeatedly challenge a settled blocker.
4. Mark the task complete, add `  completed YYYY-MM-DD-HHMM` immediately after its checked task line, and check each criterion only after its exact check reports the expected result.

Attempt 1 uses the exact launch candidate job; attempt 2 uses the retained same
child through the selected host seam. Both use one separate same-child
implementation-rethink request after candidate admission.
Do not self-rethink twice. Execution recovery is separately governed by
`skill://dev-implementation/references/execution-recovery.md`; it consumes no
semantic attempt only while the evaluated target and deliverable remain
unchanged, and it never resets the two-attempt bound. After recovery rethink,
an already-authorized same-child recovery operation's return uses the
`dev-implementation` owner-directed return-preflight exemption.
Attempts are limited to attempt 1 and an eligible attempt 2. Exhaustion stops
another semantic repair; ordinary native observation of a still-pending report
does not consume an attempt.

## Assurance and finish

- Run assurance per `dev-implementation` Assurance for the approved level; each role returns to the concrete controller.
- When every task and acceptance item is checked, every task has its completion record, and assurance is settled, add a nonempty final `## Completion Summary`, add `Completed At`, and set the plan to `DONE`. Keep it at the active path. `CLOSED` records an explicitly stopped plan and carries neither `Completed At` nor a Completion Summary. An in-place controller then validates terminal evidence without a self-Handoff; only a controller explicitly delegated by the approved topology returns one Handoff to the concrete route owner.