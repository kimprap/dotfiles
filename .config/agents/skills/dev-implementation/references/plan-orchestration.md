# Lean plan orchestration

Use this procedure only for an approved lean implementation plan. It adds no plan grammar or authority.

## Enter

1. Resolve the current active plan and run `python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN` against those bytes. Continue only on a valid `PENDING` or `IN_PROGRESS` plan.
2. Project the authored task IDs, owners, dependencies, targets, acceptance IDs, and receivers exactly. Do not add, split, merge, substitute, or hide work.
3. Confirm native child transport has the required capability to preserve every task's bound owner, dependencies, path/effect boundary, attempt number, and concrete controller receiver. Missing required capability is `transport-unavailable`; a concrete failed invocation is assessed under the shared execution-recovery policy before that blocker is escalated. The controller never substitutes itself or a newly minted actor for a required owner.
   On OMP, `taskDepth > 0` stops `transport-unavailable` before any child
   allocation; only depth 0 with all other required capabilities may proceed.
   Do not substitute a delegated controller. Other capable hosts and named
   lifecycle consumers retain their own topology and semantics.
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

Only the `dev-implementation` controller's owner-directed collection begun by
a host-selected request to the same bound child for an authorized attempt-2 repair
candidate, implementation-rethink Handoff in either semantic attempt, or return
from an already-authorized same-child recovery operation bypasses another
consent, attendance, external-supervisor, or abort-capability preflight. This
exact role-and-purpose exemption changes no authority, allowance, deadline,
observer, replay, replacement, restatement authority, or custom-controller
obligation.

## Close a work attempt

For every OMP return below, the child's terminal return is one direct native
`yield` tool call, never through eval, `tool.yield`, `getattr(tool, 'yield')`, a
prelude helper or another tool bridge: a bridged yield reports
`Result submitted.` but registers no launch or wake job. Every controller
request to the child states this rule. Keep native wait active in the same
controller turn from the launch or eligible follow-up receipt until the original
matching result and row are retained; ordinary wait messages, including
`wakeRelay` notices, do not finish collection and the controller must not end
that turn. Display-only auto-delivery is not a reply. For follow-ups read
`details.message.receipts[].outcome`: `failed` and `injected` stop immediately
without waiting for a new row; changed-identity `revived` also stops. Only
`woken` or same-identity `revived` enters collection. After reading that
receipt, a later native `wait` result with empty `details.jobs` and text
`No running background jobs to wait for.` is the adapter's no-job wait stop:
stop that request as a missing reply without admission or further wait and
assess it under the shared execution-recovery policy. Absence of a row alone
proves nothing. No resend, replacement, reset, polling rule or alternate-source
recovery.

For attempt 1:

1. Preflight the explicit declared response-object schema, normal non-isolated resumable child transport, and exact controller/child/job/task/attempt-1/receiver/`candidate` bindings. The child implements its task and terminal-completes a type-absent ordinary candidate by direct native `yield` before final smoke or Handoff; incremental publication and parking are not candidate return.
2. Collect only the exact completed job. Immediately retain the complete original native result and matching job record, apply the loaded adapter's terminal/status/schema/identity checks, and decode only its designated structured data before admitting the candidate. Missing, invalid, mismatched, consumed, or alternate-source output fails closed. Job settlement is neither task completion nor disposal.

For an authorized attempt-2 repair:

1. Resume the same responsible child; allocate no new child or launch job. Bind controller/child/task/attempt-2/receiver/`candidate` phase, declared response schema, active invocation and logical report identity.
2. Use the portable return contract and loaded adapter. On OMP send `write agent://<child>` with one outstanding request that states the direct native `yield` rule; the child terminal-yields type-absent `data` exactly `{"response":"<complete candidate report>"}` by one direct native `yield` tool call. The inherited caller schema remains authoritative.
3. With earlier child jobs retained, consider only the first task-job row for that child after its request receipt, requiring native `agentUrlId` equal to the registry ID, successful resolution, valid caller schema and exact report identity. Retain the complete original native result and row before decoding designated data as `response_object`. Admit once by child/request order, never job-ID equality or novelty: held IDs gain suffixes and evicted IDs may be reused. Old/foreign/duplicate rows, text-only or rejected jobs (even structured), relays and alternate sources are unadmitted. Failed delivery, changed revived identity, observed no-job registration failure or the no-job wait stop ends that request without resend or replacement. No OMP token or restatement branch exists. Other hosts with native reply correlation retain the portable token/message and recovery-authorized exact-copy rules; neither capability means `transport-unavailable`.

After either candidate is admitted:

1. Bind child/controller/task/attempt/operation/logical-Handoff/phase/schema/invocation and send `~/.agents/references/impl-rethink/impl-rethink.md` once through the selected host seam under the exact exemption above. The child applies code rethink then test rethink, at most one correction, all owned checks and changed-path smoke, and returns one lean Handoff. On OMP this is a separate wake request, stating the direct native `yield` rule, and terminal response-object yield under the same child/request-order retention, no-job wait stop and admission rules. Send it only after retaining the candidate job; a busy send is an aside, not another wake. Delivery and job settlement are not task completion or disposal. Other hosts retain their supported token path.
2. The same child then loads `papercut` once for that completed repository-work boundary. The controller substitutes only when the child is unavailable.
3. The controller mechanically accepts only the admitted logical report with its retained original structured provenance object or objects, declared targets/effects, complete owned check records, exact task/attempt identity, and its own bound receiver identity. If a Handoff escalates an execution-related stop without naming an actual shared-policy stop condition, return the specific eligibility question to the same responsible owner. The controller does not redo semantic judgment, repair machinery, manufacture eligibility, replace a required owner, or repeatedly challenge a settled blocker.
4. Mark the task complete, add `  completed YYYY-MM-DD-HHMM` immediately after its checked task line, and check each criterion only after its exact check reports the expected result.

Attempt 1 uses the exact launch candidate job; attempt 2 uses the retained same
child through the selected host seam. Both use one separate same-child
implementation-rethink request after candidate admission.
Do not self-rethink twice. Execution recovery is separately governed by
`skill://dev-implementation/references/execution-recovery.md`; it consumes no
semantic attempt only while the evaluated target and deliverable remain
unchanged, and it never resets the two-attempt bound. After recovery rethink,
an already-authorized same-child recovery operation's return uses the exact
collection exemption above and never receives a second implementation rethink.
Attempts are limited to attempt 1 and an eligible attempt 2. Exhaustion stops
another semantic repair; ordinary native observation of a still-pending report
does not consume an attempt.

## Assurance and finish

- Compact ends after accepted work Handoffs and papercut accounting. It dispatches no independent review, verification, or learning.
- Standard and high dispatch one independent `dev-code-review` after the complete changed target exists, then one independent `dev-verification`, then `dev-continual-learning` once. Each returns to the concrete controller. Review runs exactly once. Verification runs every original acceptance check plus every reviewer closure check.
- A required review finding may consume attempt 2 before verification. If attempt 2 remains unused and the verifier finds a code defect, the same responsible child may consume it; the same verification owner closes the complete unchanged check set without restarting discovery. Any unresolved failure after attempt 2 stops.
- Learning receives the settled outcome, affected paths, lean Handoffs, papercut results, and complete candidates. It does not retry. Only a current governing-rule conflict that invalidates the implementation blocks completion; other learning blockers remain risks.
- When every task and acceptance item is checked, every task has its completion record, and assurance is settled, add a nonempty final `## Completion Summary`, add `Completed At`, and set the plan to `DONE`. Keep it at the active path. `CLOSED` records an explicitly stopped plan and carries neither `Completed At` nor a Completion Summary. An in-place controller then validates terminal evidence without a self-Handoff; only a controller explicitly delegated by the approved topology returns one Handoff to the concrete route owner.