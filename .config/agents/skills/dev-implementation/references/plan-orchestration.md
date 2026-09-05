# Lean plan orchestration

Use this procedure only for an approved lean implementation plan. It adds no plan grammar or authority.

## Enter

1. Resolve the current active plan and run `python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN` against those bytes. Continue only on a valid `PENDING` or `IN_PROGRESS` plan.
2. Project the authored task IDs, owners, dependencies, targets, acceptance IDs, and receivers exactly. Do not add, split, merge, substitute, or hide work.
3. Confirm native child transport can preserve every task's owner, dependencies, path/effect boundary, attempt number, and one receiver. If not, stop `transport-unavailable` and do not let the parent implement.
4. Before the first dispatch, change `PENDING` to `IN_PROGRESS`. Plan lifecycle writes record state; they grant no new behavior or effects.

## Schedule

- A task is ready only when every dependency Handoff has been accepted and its owned targets do not conflict with active work.
- Dispatch mechanically disjoint ready tasks concurrently when the runtime safely supports it. Serialize overlap, ambiguous ownership, exclusive resources, ordered migration, and fan-in.
- The parent may read, validate, schedule, enforce boundaries, request rethink, aggregate Handoffs, dispatch assurance and learning, and update plan lifecycle. It never performs code-changing task work or semantic repair.
- A child receives only approved intent and acceptance IDs, exact owned paths/surfaces, dependency Handoffs, applicable project instructions, semantic attempt number, and one receiver.
- Undeclared path or effect mutation stops that task. Preserve completed independent work; do not reinterpret the plan to absorb drift.

## Close a work attempt

1. The child implements its task and reports a candidate before final smoke or Handoff.
2. The parent sends `~/.agents/references/impl-rethink/impl-rethink.md` once to that same child. The child applies code rethink, then test rethink, makes at most one correction pass, runs every owned direct check and changed-path smoke, and returns one lean Handoff.
3. The same child then loads `papercut` once for that completed repository-work boundary. The parent substitutes only when the child is unavailable.
4. The parent mechanically accepts only declared targets/effects, complete owned check records, exact task/attempt identity, and the authored receiver. It does not redo the child's semantic judgment.
5. Mark the task complete, add `  completed YYYY-MM-DD-HHMM` immediately after its checked task line, and check each criterion only after its exact check reports the expected result.

Attempt 1 is implementation plus the same-child rethink, optional correction, and smoke. Do not self-rethink twice. A proof, tool, or transport correction that changes no product/code bytes consumes no semantic attempt. The only attempt 2 is one later code-changing repair of a required reviewer or verifier finding. Its responsible child follows the same candidate → parent rethink → one correction → smoke → Handoff sequence. Attempts are limited to attempt 1 and an eligible attempt 2. An unchanged repeated failure, a failed attempt-2 code result, or a blocker with no authorized correction stops descendants and remains visible.

## Assurance and finish

- Compact ends after accepted work Handoffs and papercut accounting. It dispatches no independent review, verification, or learning.
- Standard and high dispatch one independent `dev-code-review` after the complete changed target exists, then one independent `dev-verification`, then `dev-continual-learning` once. Review runs exactly once. Verification runs every original acceptance check plus every reviewer closure check.
- A required review finding may consume attempt 2 before verification. If attempt 2 remains unused and the verifier finds a code defect, the responsible child may consume it; the same verification owner closes the repaired delta without restarting discovery. Any unresolved failure after attempt 2 stops.
- Learning receives the settled outcome, affected paths, lean Handoffs, papercut results, and complete candidates. It does not retry. Only a current governing-rule conflict that invalidates the implementation blocks completion; other learning blockers remain risks.
- When every task and acceptance item is checked, every task has its completion record, and assurance is settled, add a nonempty final `## Completion Summary`, add `Completed At`, and set the plan to `DONE`. Keep it at the active path. `CLOSED` records an explicitly stopped plan and carries neither `Completed At` nor a Completion Summary.