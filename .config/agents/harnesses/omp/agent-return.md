# OMP agent return

Reasoning guide for applying the portable
[agent-return contract](../../references/agent-return/return.md) on OMP. Runtime
callers keep semantic admission, correction, continuation, and cleanup authority.
This adapter describes host capabilities and limits; it is not a command script,
transport implementation, recovery algorithm, scheduler, or permission to add
one.

## Evidence scope

The facts below are grounded in public OMP v18.1.21 source:

- [`task/types.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/task/types.ts)
- [`task/executor.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/task/executor.ts)
- [`tools/yield.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/tools/yield.ts)
- [`tools/hub/jobs.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/tools/hub/jobs.ts)
- [`session/async-job-delivery.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/session/async-job-delivery.ts)
- [`irc/bus.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/irc/bus.ts)
- [`tools/hub/messaging.ts`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/tools/hub/messaging.ts)
- [`eval/js/shared/prelude.txt`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/eval/js/shared/prelude.txt)

Stock OMP exposes the original current `details.waited` object from an awaited
send. This contract selects no lookup, custom capture or publication mechanism,
or report store. Static or synthetic fixture walks must be described as such,
never as native execution.

## Allocation, addressability, and turns

Task or Eval allocation can return a child handle before its launch-only turn
settles or the child is registered and addressable. Treat allocation,
launch-turn completion, current roster addressability, semantic readiness,
report admission, and disposal as separate facts. For a participant with a
readiness or operative request, first let its launch-only turn settle locally,
then establish the exact registered child ID and actual owner through the
current native roster or equivalent native registration evidence, then send a
separate request with its own fresh token. Launch output and turn completion are
not readiness; roster presence is necessary for dispatch but proves neither
semantic readiness, progress, collector survival, nor cleanup.

Keep independent-child concurrency. Operations for distinct owned children may
run concurrently subject to the owning protocol and host capacity. Completion,
a report, an echo, or a cancellation acknowledgement does not free an owned
slot; the protocol's exact disposal evidence does.

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
`data` equal to the complete response object. An incremental array `type`
continues the job and is not a completed candidate. The child neither sends
the candidate through IRC nor parks for rethink.

Collect by the exact bound job ID, never by `hub wait from=`. The two native
first-consumer surfaces are:

- an auto-delivered result's matching `details.jobs[]` row, whose structured
  envelope is `schema`; or
- the first unconsumed exact-ID `hub jobs` snapshot or job-winning `hub wait`
  result's matching `details.jobs[]` row, whose structured envelope is
  `structured`.

First consumer wins. Immediately copy the complete original native tool result
and the matching job row into current controller invocation state before
decoding, semantic work, or unrelated tool use. Do not obtain or repair this
payload through `agent://`, inbox, history, transcript or JSONL reads, rendered
cards, latest output, or reconstruction.

Before extraction, require the exact bound job and child relationship, a
successful terminal task job, and a structured envelope with `source` exactly
`caller`, `status` exactly `valid`, and object-valued `data`. Reject a missing
row or envelope, a running, failed, cancelled,
schema-invalid or unavailable job, the wrong job or child, an already-consumed
result with no structured payload, and any alternate payload source. Pass only
`schema.data` or `structured.data`, respectively, to the adjacent decoder as
`response_object`; never pass the native job row or structured envelope. Then
apply the implementation report's exact task, attempt, receiver, and
`candidate` phase checks. Candidate job settlement and admission imply neither
semantic task completion nor child disposal.

After candidate admission, send the existing implementation rethink wrapper to
that exact child with `hub send`, `await: true`, `timeoutMs: 0`, and a fresh
owner-authored correlation token. The `dev-implementation` controller's exact
collection of this same child's rethink Handoff is exempt from the external
supervision preflight below. The request tells the child to apply the wrapper,
perform its checks, and make one non-awaited `hub send` back to the controller
with the complete lean Handoff body and `replyTo` equal to that fresh token.
Retain and validate the original returned `details.waited`, then decode only its
complete `body` as `text`. A child `yield`, another ordinary completion,
delivery without `details.waited`, a stopped await target, or a replacement
child leaves the Handoff unresolved and unadmitted.

## Owner-directed message collection

For `hub send` with `await: true`, OMP installs a waiter before dispatch and sets
`drainPending: false`. Every owner request expecting a return uses exact
`timeoutMs: 0`. The waiter matches only the sender and consumes the oldest
matching waiter; it does not match `replyTo`. Keep at most one outstanding
awaited request for each exact `(owner, child)` pair. Distinct children may be
collected concurrently. Always validate the owner-authored token after native
receipt, along with exact `from`, `to`, and absence of `wakeRelay: true`.

The same preflight exemption applies when that exact controller collects a
return from the same bound implementation child for an already-authorized
execution-recovery operation. It applies only to these two
`dev-implementation` collection purposes under the current approved route.
It does not exempt Reconcile, Retrace, another custom controller, another
recovery caller, or any unrelated indefinite collection. It adds no timer,
observer, service, retry, resend, replacement, replay, or completion guarantee.

The native result keeps delivery `receipts` separate from optional `waited`.
Inspect `isError`, error details, the requested recipient's receipt, `details`,
and `details.waited` presence in that order before extracting anything.
Successful delivery with no `waited` or an interrupted outer call is not a
report. When `details.waited` is present, mechanically copy that complete
original object and its exact `body` into current owner-held invocation state
before decoding or semantic work. Then apply exact `from`, `to`, authored token,
relay, workflow grammar, identity, phase, semantic, allowance, and consumption
checks; decode only the complete `body` as declared `text`.

`executeSend` trims the outgoing recipient and message strings. It cannot
preserve arbitrary leading or trailing body whitespace. Never reconstruct
trimmed edges, guess whitespace, normalize newlines, or claim byte identity for
bytes the native seam did not return. Protocol bodies that require exact edge
whitespace must stop for an unsupported transport capability rather than repair
content heuristically.

Explicit `timeoutMs: 0` disables only the positive timeout timer. Once this
native `hub send` await is active, TUI steering and Alt+C do not interrupt it.
The awaited collector can still settle and unregister on the awaited child's
terminal `agent_end`, target unregistration or hard abort, or the caller/tool
abort signal. The messaging operation may then retain successful delivery
receipts while omitting `waited`. Zero timeout therefore does not guarantee
that the waiter survives until a report arrives, and it authorizes no resend,
re-emission, replacement, replay, reattachment, or allowance reset. A child
that neither replies nor reaches one of those native endings can block its
parent indefinitely; the generic implementation workflow explicitly accepts
that residual for its two exempt collection purposes.

## Inbox is not return recovery

`hub inbox` exposes current mailbox and live-session-buffer data and can consume
at least one source even with `peek: true`. Successfully injected messages do
not remain in the bus mailbox; only a failed live handoff is buffered there.
Inbox is therefore not a selected report-observation, reconstruction, or
post-interruption admission path.

Do not substitute inbox, `irc_message` events, JSONL, `sessionManager.getBranch()`,
RPC message reads, `history://`, `agent://`, rendered cards, local echoes,
ordinary completion, or any report store for `details.waited`. Those surfaces
may aid independent observation only where another contract permits it; they
never supply or recover the authoritative native return.

## Supervise indefinite operations externally

Except for the two exact `dev-implementation` controller collection purposes
defined above, before using an awaited report collector or reviewer parking
wait with `timeoutMs: 0`, bind an existing time/abort owner that remains outside
the blocked invocation, can inspect concrete progress, and can interrupt that
exact operation under the current protocol. Do not invent another supervisor
or place an unbounded wait inside an unbounded Eval cell. If no such external
capability exists, report that execution limitation and do not begin the unsafe
wait.

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

Preserve the operation token, delivery facts, exact owner/child identities, used
or unknown semantic and recovery allowances, original native returns already
observed, and unresolved frontier before unrelated handling. Do not replay a
successfully delivered request.


On actual Reconcile termination, the bound OMP controller uses parent-owned
native `hub cancel` for the exact registered reviewer IDs, including retained
reviewers whose original jobs settled; Eval `AgentHandle.cancel` is job-scoped
and is not a substitute. Observe the protocol-required terminal non-running or
removal result. This cleanup seam neither changes reviewer ownership nor makes a
report, receipt, or turn completion disposal evidence.

Retrace and Reconcile explicitly adopt the sole generic
[execution-recovery policy](../../skills/dev-implementation/references/execution-recovery.md)
for their authorized active-session execution machinery. This adapter grants no
adoption by itself and copies none of that policy's algorithm or allowances.
Normal supported observation of the same operation, an execution-machinery
retry, and a semantic return correction remain distinct.