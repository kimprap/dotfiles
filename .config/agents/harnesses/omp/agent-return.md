# OMP agent return

Reasoning guide for applying the portable
[agent-return contract](../../references/agent-return/return.md) on OMP. Runtime
callers keep semantic admission, correction, continuation, and cleanup authority.
This adapter describes host capabilities and limits; it is not a command script,
transport implementation, recovery algorithm, scheduler, or permission to add
one.

## Evidence scope

The named lifecycle consumer facts below are grounded in the installed
[`lifecycle-plugin.js`](extensions/lifecycle-plugin.js),
[`lifecycle-supervisor.js`](extensions/lifecycle-supervisor.js), and
[`lifecycle-consumers.js`](extensions/lifecycle-consumers.js). The remaining
generic implementation-return facts are grounded in OMP v18.3.0 stock source;
the version pin records evidence and does not enforce the runtime:

- [`task/executor.ts`](https://github.com/can1357/oh-my-pi/blob/v18.3.0/packages/coding-agent/src/task/executor.ts)
- [`task/index.ts`](https://github.com/can1357/oh-my-pi/blob/v18.3.0/packages/coding-agent/src/task/index.ts)
- [`async/job-manager.ts`](https://github.com/can1357/oh-my-pi/blob/v18.3.0/packages/coding-agent/src/async/job-manager.ts)
- [`internal-urls/agent-protocol.ts`](https://github.com/can1357/oh-my-pi/blob/v18.3.0/packages/coding-agent/src/internal-urls/agent-protocol.ts)

Stock OMP exposes original structured completion jobs through the native surfaces
listed below. This contract selects no lookup, custom capture or publication
mechanism, or report store. Static or synthetic fixture walks must be described
as such, never as native execution.

## Named lifecycle consumer adapter

Retrace and Reconcile use the registered `lifecycle` tool with schema
`omp-lifecycle-call/v1`. Root controllers call `open`, `dispatch`, `observe`,
`dispose`, `abort`, and `close`; a delegated Retrace scope uses the injected
connection-bound `lifecycle_channel` for `request`, `reply`, and owned-child
`dispose`. Skills supply only the named definition, its semantic binding,
target, phase, and exact body. They never supply graphs, profiles, argv, models,
tools, prompts, process factories, or environment overrides.

`open` uses definition `reconcile` with binding
`{ mode: "standalone", controller }` or
`{ mode: "delegated", controller, scope }`, or definition `retrace` with
`{ controller, normalizer?, scopes, maxDirectActors: 4 }`. A Retrace run
already compiles each scope's delegated Reconcile reviewers; a scope must use
that connection-bound pair rather than opening another run. Preserve the
returned `runId` and stable actor IDs for the current invocation only.

`dispatch` returns immediately with one stable request row per call. A
`pending` row is not a reply; `start-failed` and `delivery-unknown` affect only
that row and never authorize resend, replay, or actor replacement. Use
`observe` for root-owned replies and current state. The first accepted
connection-bound reply body is authoritative and immediately owner-visible.
Keep its `turn` and `reuse` fields separate: later success, failure, abort, or
process exit cannot overwrite the reply, and a reply does not make an actor
reusable until its turn succeeds.

The supervisor owns pending observation and emits compact ID/status-only wakes
at its fixed interval. A wake is observation-only and never a reply. Elapsed
silence remains pending until an authoritative reply, concrete terminal
failure, or explicit owner/user abort; consuming skills do not create polling,
`hub wait`, Eval, timer, or external-supervision choreography. The owner may
inspect or abort the exact run/request and must never infer or fabricate a body.

Standalone Reconcile root owns A/B. In delegated Reconcile, the actual scope
connection owns A/B; the outer Retrace root sees only redacted nested state and
cannot admit reviewer bodies. Distinct actors may run concurrently. Retrace has
at most four live direct normalizer/scope actors; nested reviewers do not
consume that capacity. Partial startup preserves successful siblings and every
original handle.

A delegated scope calls `lifecycle_channel.dispose` for its exact reviewers and
requires `data.state === "disposed"` before publishing `scope-result` through
`lifecycle_channel.reply`. Root then calls `dispose` for that exact scope.
Successful disposal and `close` require the supervisor's retained process-exit
observation. These calls can return a success envelope whose `data.state` is
`failed-cleanup`; callers inspect the state rather than `ok` alone.
`failed-cleanup` preserves the unresolved actor/PID and capacity and is a
blocker, not permission to signal unrelated processes, replay work, or replace
an actor.

Keep each complete original lifecycle result envelope until the semantic
operation and cleanup that depend on it finish. This is ordinary
invocation-local retention, not the former launch/roster/return/disposal slot
scheme. The plugin exposes no proof-export operation or lifecycle-call
destination field. If an authorized proof requires copying plugin-owned
results, its prebound contract names the observing owner, definition, expected
operation kinds, actor targets and phases, and session-local destination before
`open` or covered `dispatch`. Record the returned run/actor/request IDs from
each original result, then mechanically copy only already-retained envelopes
and owner-visible authoritative bodies to that destination. This adds no
default field, report store, lookup, replay, or alternate observation path.

## Allocation, addressability, and turns

Task or Eval allocation can return a child handle before its launch-only turn
settles or the child is registered and addressable. Treat allocation,
launch-turn completion, current roster addressability, semantic readiness,
report admission, and disposal as separate facts. For a participant with a
readiness or operative request, first let its launch-only turn settle locally,
then establish the exact registered child ID and actual owner through the
current native roster or equivalent native registration evidence, then send a
separate request bound to its operation and phase. Launch output and turn completion are
not readiness; roster presence is necessary for dispatch but proves neither
semantic readiness, progress, collector survival, nor cleanup.

The generic allocation and addressability facts in this section apply to
callers that still use task/Eval children. Retrace and Reconcile instead use
the named lifecycle adapter above; they do not collect launch-settlement or
roster-binding observations.

Keep independent-child concurrency. Operations for distinct owned children may
run concurrently subject to the owning protocol and host capacity. Completion,
a report, an echo, or a cancellation acknowledgement does not free an owned
scheduler or capacity slot; the protocol's exact disposal evidence does.

## Ordinary completion extraction

For an OMP producer ordinary completion, preserve the complete child `yield`
`toolResult.details` object as the native envelope. Its declared payload is
`details.data` only when all of these hold:

- `status` is exactly `success`;
- `type` is absent;
- `useLastTurn` and `schemaOverridden` are absent or false; and
- `data` is one object.

Pass only `details.data` to the adjacent decoder as `response_object`. Do not
pass the details envelope or retry as `text`. A present `type`, incremental array
`type`, scalar no-data completion, missing or non-object `data`, or ordinary raw
output is not this payload.

## Implementation candidate job collection

Before creating any implementation child, require the OMP collector's
`taskDepth` to be 0. At `taskDepth > 0`, stop `transport-unavailable` before
allocation: OMP v18.3.0 does not expose native `wait` to subagents
([native gate](https://github.com/can1357/oh-my-pi/blob/v18.3.0/packages/coding-agent/src/tools/index.ts#L711-L714)).
Do not substitute or spawn a delegated controller to bypass this gate.
Depth 0 still requires every schema, identity and collection capability below.
This host restriction does not change capable other-host topology or named
lifecycle-consumer semantics.

This is a separate consumer-side adapter surface from the producer `yield`
extraction above. Before an implementation-child dispatch, require the caller
to supply this exact response-object `outputSchema`; an agent or session schema
does not satisfy the preflight:

```json
{
  "type": "object",
  "properties": { "response": { "type": "string" } },
  "required": ["response"],
  "additionalProperties": false
}
```

Use a normal non-isolated task child, so OMP's default keep-alive lifecycle
leaves that same identity resumable after its launch job settles. Reject
`isolated: true`, a one-shot child, a missing caller `outputSchema`, or an
unbound controller, child, job, task, attempt, receiver, or expected
`candidate` phase before dispatch. A selected schema whose `source` is not
`caller` does not repair the missing caller schema; when `source` is `none`,
OMP supplies no structured job payload.

The child returns the candidate through one terminal type-absent `yield` with
`data` equal to the complete response object. That `yield` is one direct native
tool call in the child's assistant turn, never invoked through eval,
`tool.yield`, `getattr(tool, 'yield')`, a prelude helper or any other tool
bridge: a bridged yield reports `Result submitted.` but emits no tool-execution
events, so OMP registers no launch or wake job. Every controller request to an
implementation child, launch or follow-up, states this direct native `yield`
rule. An incremental array `type` continues the job and is not a completed
candidate. The child neither sends the candidate through IRC nor parks for
rethink.
Every implementation-child request, launch or follow-up, also states the
lean-return rule in
[Assurance and audit return collection](#assurance-and-audit-return-collection).

For attempt 1 collect the exact allocated launch job. For follow-ups use the
child/request-order binding below, never launch-job ID equality. The original
accepted surfaces are the auto-delivered `details.jobs[]` row (envelope
`schema`) and a row returned by native wait (envelope `structured`).
Keep native `wait` active in the same controller turn from the launch receipt
or an eligible follow-up receipt until the selected original result and
matching row are retained, or until the no-job wait stop below ends that
follow-up. Do not end that turn before either. Ordinary wait-message traffic
does not finish collection; continue native wait in the same turn.
Auto-delivery is admissible only with its original structured object retained;
display-only delivery is not a reply and cannot be repaired later.
A result that renders as `<preview …>` is display-only and is not a reply.


First consumer wins. Immediately copy the complete original native tool result
and matching job row into current controller invocation state before decoding,
semantic work, or unrelated tool use. This is the ordinary candidate-job
admission record, not a named lifecycle observation slot or proof-export
obligation. Do not obtain or repair this payload through `agent://`, inbox,
history, transcript or JSONL reads, rendered cards, latest output, copied
payload, a later job snapshot, or reconstruction.

Before extraction, require the bound task job and child relationship, successful
resolution, and a structured envelope with `source` exactly `caller`, `status`
exactly `valid`, and object-valued `data`. A text-only resolve, running,
failed/rejected, cancelled, invalid, unavailable, foreign or already-consumed
result is unadmitted; structured data in a rejecting job does not make it a reply.
Pass only `schema.data` or `structured.data`, respectively, to the existing
decoder as `response_object`. Then require exact task, attempt, owner, receiver
and phase. Job settlement and admission imply neither semantic task completion
nor child disposal.

## Implementation follow-up wake jobs

The authorized attempt-2 candidate, implementation-rethink Handoff in either
attempt, and already-authorized same-child recovery return use the retained
child's wake jobs. They do not allocate another child. Before each request bind
the concrete controller/receiver, child registry ID, task, attempt, operation,
logical report identity, phase and the explicitly declared launch response
schema in the current invocation.

Send through `write agent://<child>` and inspect the original
`details.message.receipts[].outcome`, never rendered delivery text. These are
delivery facts, not replies. `failed` and `injected` stop that request
immediately, without waiting for a new wake row: injection is only an aside in
the busy child's existing turn. A `revived` receipt with changed registry ID
also stops. Only `woken` or `revived` with the same bound registry ID enters
same-turn native wait collection. No resend, replacement or allowance reset.
Allow one outstanding request per child; send the next only after retaining
the preceding wake job or observing that turn end with no registered job
through the no-job wait stop below. This adds no polling rule.

The child ends the woken turn with one terminal type-absent `yield`, made as
one direct native tool call under the rule above, whose `data` is exactly
`{"response":"<complete report>"}`. Each follow-up request states that rule.
The wake monitor inherits the launch `outputSchema`, mode and caller source; no
second envelope or decoder is needed. Candidates do not publish incrementally
or park.

Retain and consider only the FIRST task-job row for that child arriving after
the request receipt, with every earlier job for that child already retained.
The row's native `agentUrlId` (job `agentId`) must equal the bound registry ID.
Immediately retain the complete original native result and matching row before
decoding, semantic work or unrelated calls. Apply the successful-resolution,
caller-schema and exact report checks above and admit the logical report once.
The already-retained launch candidate cannot satisfy a follow-up.

Never bind follow-ups by job-ID equality or novelty. Launch and wake jobs both
request `id=childId`; a held collision becomes `childId-2`, `-3`, and so on.
The plain ID may be reused after eviction. Holds last about 30 seconds after
consumption or five minutes if unconsumed. Do not wait for holds to expire just
to avoid collisions. Old, duplicate or foreign rows cannot satisfy the next
request, even when their job IDs look suitable.

Failure before accepted yield registers no wake job and may relay `wakeRelay`
to the parent. Such a notice is nonauthoritative: no admission, resend,
replacement or allowance reset. Accepted yield followed by failure registers
a rejecting job, which remains unadmitted even with structured data. Parent
relay is skipped only when that parent owns the registered wake job; other
wakers may receive relays. Registration may fail because the manager is shut
down or its running limit is reached, not because the desired ID is held.
No-job registration failure stops. Absence of a row alone is not proof that a
turn failed or ended.

The no-job wait stop is the positive native observation of such a turn end.
After the controller has read an eligible receipt, a later native `wait` result
whose `details.jobs` is empty and whose text is
`No running background jobs to wait for.` means no owner job, running peer or
live owned service remained: the woken turn ended without a registered job, for
example after a bridged yield. Stop that request as a missing reply, with no
admission, further wait, resend, replacement or allowance reset, and assess it
under the shared execution-recovery policy. Issue that `wait` only after reading
the receipt, never in parallel with or before the send: the woken turn claims
running state in microtasks queued before the receipt returns, so only an
earlier `wait` could observe the pre-start state. A `wakeRelay` or other
ordinary message remains nonauthoritative and does not end collection. While an
unrelated peer or owned service runs this result cannot occur, and collection
stays bounded only by native wait limits. This adds no polling rule.

After candidate admission send the one implementation rethink as a separate
request to that same child. It applies code rethink then test rethink, at most
one correction, and the owned checks, then terminal-yields its lean Handoff by
direct native `yield` in the same response object. The three implementation
collection purposes above retain their exact role-and-purpose preflight
exemption; they add no recovery, replay, observer, deadline or
unattended-completion authority.

OMP does not select a token/message, send-and-wait, or exact-body restatement
branch for implementation returns. Its `agent://` send has no native reply
correlation field. No text, agent-output, history, transcript, relay or message
fallback is admissible. Named lifecycle consumers remain governed above.

## Assurance and audit return collection

Review and verification dispatches pass the same caller `outputSchema` shown in
[Implementation candidate job collection](#implementation-candidate-job-collection);
an agent or session schema does not satisfy it.

Every review, verification, learning and implementation-child request, and
every test-audit auditor request including follow-ups, states this
lean-return rule: keep the complete Handoff or auditor result well under OMP's
inline task-result limit, `fullOutputThreshold`, currently 5000 characters of
rendered body
including JSON escaping, and reference bulky evidence such as logs, diffs,
repeated hashes or restated conditions by path or command instead of pasting
it. Never drop a required Handoff field or a fresh `Observed` result; a Handoff
that cannot fit is still returned complete.

Admit a review or verification return only when its model-visible result
renders as `<output>`, not `<preview …>`, and its visible body is the
caller-schema object `{"response": "<complete Handoff>"}`. Decode that with the
existing decoder, then apply that role's Handoff contract. The
implementation-only task, attempt, candidate-phase, `yield`, wake-job and
`taskDepth` rules do not apply here, nor to the learning and auditor
dispatches below.

A `<preview …>` result is not observed. Do not fall back to its cut text,
`details`, `agent://` or Eval, and do not request a shorter rewrite: review's
one clarification covers only missing fields or format omission
(`dev-code-review` "One clarification, never a rerun"), and restatement is
byte-for-byte only under the
[agent-return contract](../../references/agent-return/return.md) restatement
rule. The return stops under the role's existing recovery policy.

The single contract verdict stays inside the Handoff. The caller schema is what
excludes an agent default such as `{overall_correctness, confidence,
explanation}`; add no `verdict`, `kind` or `phase` field.

A `dev-continual-learning` dispatch passes the same caller `outputSchema`.
Admit only an `<output>` result whose `response` is the complete learning
Handoff, then apply that Handoff's rules. A cut-off `<preview …>` result is not
observed: use no cut text, request no shorter rewrite and do not retry. Before
dispatch the controller saves repository status plus a content hash of every
modified and untracked path. After a cut-off result it compares that saved
state with the current one.
Same paths and hashes: record `Learning: blocked return not observed` under
Risks; this records an unseen return, not a learning-step result, and does not
by itself stop completion. Any new path or changed hash: stop and build no
completion report, with no blocked line, no `curated` and no guessed papercut.
The unseen Handoff owed those paths and a papercut look
([`dev-continual-learning`](../../skills/dev-continual-learning/SKILL.md)
curation and papercut rule), and completion must account for every change
([completion input](../../references/completion-presentation-input.md) Changes
rule). A conflict present only in the unseen Handoff, with no files written, is
not established and does not stop completion.

Test-audit auditors A and B (`test-audit-opinion-a`, `test-audit-opinion-b`)
receive the same caller `outputSchema` on every request. Admit only an
`<output>` result whose `response` is exactly one auditor result: one complete
proposal, one named liveness stop, one closure result (`CLOSED`, `NOT CLOSED`
or `INCONCLUSIVE`), or one acknowledgment of the exact accepted proposal. Do not
decode it as a Handoff. A proposal cannot be shortened to meet the limit named
above; every per-file row is required. A cut-off `<preview …>` result is not
observed: use no cut text, request no shorter proposal and do not narrow the
file list within this audit. It is not any auditor stop, does not reuse the
`transport-unavailable` gate and gets no audit Handoff. The controller
records `auditor return not observed` as its own adapter record and stops the
audit read-only, preserving every unresolved file. A narrower scope is a new
audit, only when the requester names it.

## Retrace and Reconcile optional proof export

For Retrace and Reconcile, use only the named lifecycle adapter's prebound
proof-export seam above. Generic OMP message observations and task lifecycle
facts do not become lifecycle-plugin proof slots or an alternate export source.
No other adapter consumer gains a proof-export obligation.

## Inbox is not return recovery

Inbox, rendered messages, JSONL, branch/session accessors, RPC message reads,
`history://`, `agent://` output reads, rendered cards, local echoes and report
stores cannot recover or replace an original structured completion-job result.
Sending a request with `write agent://<child>` does not make reading its output
an admitted return surface.

## Supervise indefinite operations externally

Named lifecycle-consumer operations governed by this adapter do not use the
generic external-supervision requirement because the plugin owns their pending
observation.

Except for the three exact `dev-implementation` controller collection purposes
defined above, before using a settings-driven unbounded awaited report
collector or reviewer parking wait, bind an existing time/abort owner that
remains outside the blocked invocation, can inspect concrete progress, and can
interrupt that exact operation under the current protocol. Do not invent
another supervisor or place an unbounded wait inside an unbounded Eval cell. If
no such external capability exists, report that execution limitation and do
not begin the unsafe wait.

A finite Eval cell timeout is not sufficient protection for an Eval agent or
completion handle wait: OMP pauses the cell watchdog while handle waits run and
defers external abort until that wait unwinds. A finite existing outer Eval
guard around disposable proof cleanup is neither a new rethink deadline nor a
supervisor binding. In JavaScript the supported form is
`handle.wait({ timeout: seconds })` (and `wait(handles, { timeout })`), not
`handle.wait(seconds)`; Python uses `handle.wait(timeout=seconds)`. The
configured `task.maxRuntimeMs` default is `0`, which disables the task wall
clock. These are independent bounds and none guarantees eventual report
collection.

The same existing external owner observes the same collector, operation,
process state, and log cursor every five minutes. It never drains inbox, reads
messages, registers or replaces a waiter, signals or stops on silence, nudges,
retries, redispatches, replaces an actor, or changes an allowance. Activity,
protocol progress, suspected stall, demonstrated machinery failure, and a human
cap remain distinct; silence or one repeated unchanged observation at or after
five minutes proves none of them and authorizes no action.

Preserve the bound operation/request identity, delivery facts, exact owner/child identities, used
or unknown semantic and recovery allowances, original native returns already
observed, and unresolved frontier before unrelated handling. Do not replay a
successfully delivered request.


On actual Retrace or Reconcile termination, use the named lifecycle adapter:
the delegated scope disposes its reviewers before its reply, the root disposes
each exact completed scope, and the root closes remaining descendants before
ancestors. Require `disposed` or `closed`; preserve `failed-cleanup` and its
unresolved actor/PID as a blocker. Generic `hub cancel`, Eval handle
cancellation, roster removal, a request receipt, report, or turn completion is
not lifecycle-plugin disposal evidence.

Retrace and Reconcile explicitly adopt the sole generic
[execution-recovery policy](../../skills/dev-implementation/references/execution-recovery.md)
for their authorized active-session execution machinery. This adapter grants no
adoption by itself and copies none of that policy's algorithm or allowances.
Normal supported observation of the same operation, an execution-machinery
retry, and a semantic return correction remain distinct.