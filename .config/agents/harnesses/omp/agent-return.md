# OMP agent return

Reasoning guide for applying the portable
[agent-return contract](../../references/agent-return/return.md) on OMP. Runtime
callers keep semantic admission, correction, continuation, and cleanup authority.
This adapter describes host capabilities and limits; it is not a command script,
transport implementation, recovery algorithm, scheduler, or permission to add
one.

## Evidence scope

The
generic implementation-return facts are grounded in OMP v18.4.9 stock source;
the version pin records evidence and does not enforce the runtime:

- [`task/executor.ts`](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/task/executor.ts)
- [`task/index.ts`](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/task/index.ts)
- [`async/job-manager.ts`](https://github.com/can1357/oh-my-pi/blob/v18.4.9/packages/coding-agent/src/async/job-manager.ts)
- [`internal-urls/agent-protocol.ts`](https://github.com/can1357/oh-my-pi/blob/v18.5.0/packages/coding-agent/src/internal-urls/agent-protocol.ts)

Stock OMP exposes original structured completion jobs through the native surfaces
listed below. This contract selects no lookup, custom capture or publication
mechanism, or report store. Static or synthetic fixture walks must be described
as such, never as native execution.

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

The generic allocation and addressability facts in this section apply to callers
that still use task/Eval children. Reconcile and Retrace run under their acpx
controller (`harnesses/omp/acp-controller/`), which owns their reviewer and
scope sessions, first replies, pending observation, capacity and observed-exit
disposal.

Each controller run executes in a detached worker that outlives the calling
tool call. Controller calls run only through `bash`, with the request file named
by absolute path in the command, never through Eval or a path held in a shell
variable, with `timeout: 0` as the normal path; a call that ends without a
record is followed by the same command again, and a live run ends only with
`stop` on the human's instruction, as the controller's `driver.md` says. The
Eval and timeout rules under "Child foreground execution" stay as written for
child commands; they are not the controller contract, and a backgrounded
controller call is waited for, never cancelled and rerun through Eval.

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

## Same-cell structured return collection

OMP cuts a child's visible task result to a `<preview …>` above
`FULL_OUTPUT_THRESHOLD`, a hard-coded 5,000 characters in OMP v18.4.9
(`result-summary.ts`). The complete reply stays in the `structured` object of
the settled job row that native `wait` returns. Review, verification, learning,
test-audit auditor A and B, and implementation returns, at launch and on
follow-up, are all collected this one way. The visible `resultText`, whether
`<output>` or `<preview …>`, is never the reply, whatever its size.

At `taskDepth` 0 one Eval cell does the whole collection. It launches the child
through `tool.task` with the caller `outputSchema` shown in
[Implementation candidate job collection](#implementation-candidate-job-collection),
or, for a follow-up, sends `write agent://<child>` and first reads
`details.message.receipts[].outcome` under the receipt rules in
[Implementation follow-up wake jobs](#implementation-follow-up-wake-jobs). The
same cell then loops `tool.wait` until the bound job's row settles. The bound
job is the exact allocated launch job, or for a follow-up the row selected by
the child/request-order binding.

The cell sets `timeout: 0`. That only keeps the cell alive until collection
ends; it is not an abort bound. `tool.wait` is an ordinary bridge call that
counts against the Eval budget (only `agent()` and `completion()` handle waits
pause the watchdog), so the 30 s default kills the loop, and the finite maximum,
3600 s, can end a long review before its row settles.

Native `wait` returns the first settled job or peer message and consumes what it
returns; a dequeued message is otherwise unrecoverable. Every result that is
not the bound row, such as a peer message, another job or a `wakeRelay`, is
kept in kernel state and printed in full in that cell, and the loop continues.
A `wait` call with an owned running job is bounded by `WAIT_MAX_MS` (30 min)
and then returns a still-running snapshot. In OMP v18.8.5 `wait` first returns
a message already queued. With no owned running job, no finished owned job
still undelivered and no live owned service, it then throws the tool error
`Nothing to wait for: no background job or service you started is running.
Other agents' results and messages arrive on their own.` A running peer does
not prevent that throw
([`wait`](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/tools/wait.ts)).
The Eval bridge passes the thrown message through unchanged, so
`await tool.wait({})` in a Python cell raises a `RuntimeError` whose text is
exactly that message
([host bridge](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/eval/js/tool-bridge.ts),
[Python bridge](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/eval/py/tool-bridge.ts),
[prelude](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/eval/py/prelude.py)).
The cell catches that error and prints it raw. After an eligible follow-up
receipt it is the no-job wait stop below. During launch collection, with no
eligible follow-up receipt, it is not that stop: the cell prints it raw, does
not loop, and the return is not observed. The cell keeps every other result
and the loop waits again. It prints every return that is not the settled bound
row raw as it arrives, including a still-running snapshot and any return
marked `useless`, never only a parsed field, which can be empty. After each
return it also prints the last three lines of every launch log the child's
request names (the output file of a process launched under
[Child foreground execution](#child-foreground-execution)).
OMP's startup watchdog follows each `Still starting … phase:` line with a log
hint, so the last line alone can hide the phase. A stalled launch then shows
within minutes. Printing only observes: it never stops, signals, resends or
changes an allowance. The controller never ends its turn to wait for the row.

Rows carry `id`, `type`, `status`, `agentUrlId`, `resultText` and
`structured {source, mode, status, data}`. The kernel retains the complete
bound row at once and admits it only when it settled successfully,
`structured.source` is exactly `caller`, `structured.status` is exactly
`valid`, and `structured.data.response` is a string. Only `structured.data`
goes to the existing decoder as `response_object`; the role rules below then
apply.

The kernel then prints the reply complete: first its total length, line count,
sha256 and piece count N, then each piece as `piece i/N len=… sha=…` followed by
its text. A piece is at most 8,000 bytes. A display line is at most 700 bytes,
under OMP's 768-byte per-line cap (`tools.outputMaxColumns`); a longer source
line is split into marked continuation lines, where `| ` starts a source line
and `+ ` continues it. Pieces are printed across as many cells as needed, each
well inside the 50 KiB output window (a probe showed about 16 KB per cell in
full); later cells print from the same retained kernel value. The reply counts
as shown complete only when pieces 1..N all appear in full with no truncation
notice and no `artifact://` spill notice.

A return is not collected or not shown complete when the collection cell dies
or is interrupted before admission, the bound row fails the checks above, the
no-job wait stop ends the follow-up, or the kernel value is lost before every
piece is shown. Such a return is not observed. A result auto-delivered after
the cell ended is display-only and unrecoverable. Do not fall back to its cut
text, `agent://`, history, inbox, transcript or rendered-card reads, a copied
payload or rebuilding, and do not request a shorter rewrite.

## Implementation candidate job collection

Before creating any implementation child, require the OMP collector's
`taskDepth` to be 0. At `taskDepth > 0`, stop `transport-unavailable` before
allocation. This is adapter policy: OMP v18.4.9 exposes native `wait` to
subagents when async, IRC or launch is enabled
([native gate](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/tools/index.ts)).
Do not substitute or spawn a delegated controller to bypass this gate.
Depth 0 still requires every schema, identity and collection capability below.
This host restriction does not change capable other-host topology.

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
events, so OMP does not count it as an accepted yield
([yield acceptance](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/task/executor.ts)).
It is not a candidate; its effect on wake jobs is under
[Implementation follow-up wake jobs](#implementation-follow-up-wake-jobs). An
incremental array `type` continues the job and is not a completed candidate.
The child neither sends the candidate through IRC nor parks for rethink.

Every controller request to an implementation child, launch or follow-up,
states each of these request rules:

- the direct native `yield` rule above;
- the lean-return rule in
  [Assurance and audit return collection](#assurance-and-audit-return-collection);
- the [Child foreground execution](#child-foreground-execution) rule.

For attempt 1 collect the exact allocated launch job. For follow-ups use the
child/request-order binding below, never launch-job ID equality. Both collect
through
[Same-cell structured return collection](#same-cell-structured-return-collection).
The row that native `wait` returns in that cell (envelope `structured`) is the
only accepted surface; an auto-delivered `details.jobs[]` row is not one.
Ordinary wait-message traffic does not finish collection; the cell keeps it and
continues waiting.

First consumer wins. Immediately copy the complete original native tool result
and matching job row into the collection cell's kernel state before decoding,
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
Pass only `structured.data` to the existing
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
same-cell collection. No resend, replacement or allowance reset.
Allow one outstanding request per child; send the next only after retaining
the preceding wake job or after the preceding request ended at the no-job wait
stop below, which does not prove that turn ended. This adds no polling rule.

The child ends the woken turn with one terminal type-absent `yield`, made as
one direct native tool call under the rule above, whose `data` is exactly
`{"response":"<complete report>"}`. Each follow-up request states every request
rule listed in
[Implementation candidate job collection](#implementation-candidate-job-collection).
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

A follow-up woken by the parent's own message, here the controller's request,
opens its wake job at turn start when the job manager accepts it
([wake monitor](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/task/executor.ts)).
It does not register when the manager is shut down or its running limit is
reached, or when there is no owner or manager. A held ID is not a failure; the
job takes the next suffix
([register](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/async/job-manager.ts)).
A failed start leaves the job unset, so a later accepted yield in that turn
tries the same registration again. A turn woken only by peers registers its
job only when its `yield` is accepted.

A registered job settles whatever the turn does. An accepted structured
`yield` resolves it with the yield result, and a failure after that yield
rejects it; a rejecting job remains unadmitted even with structured data. A
registered job whose turn has no accepted structured `yield` settles with no
caller payload: text only on a clean end, rejected on failure. That row is not
admitted, and the request stops as a missing reply. A bridged yield is not an
accepted yield. On a parent-woken turn it does not cancel the job opened at
start, which settles with no caller payload and is not admitted. On a
peer-woken turn it registers no job.

The relay skips the job owner only when the job registered; other wakers may
still receive relays. If registration failed, the parent can receive a
`wakeRelay`. A relay is never a reply: no admission, resend, replacement or
allowance reset. Absence of a row alone is not proof that a turn failed or
ended.

The no-job wait stop is the thrown `Nothing to wait for: …` error described in
[Same-cell structured return collection](#same-cell-structured-return-collection).
It is not proof that the turn ended or that the child failed. After an
eligible receipt, `tool.wait` can throw it while the child is still running if
its wake job is not registered yet, and a running peer does not prevent the
throw. The cell catches that error, prints it raw, and does not loop or poll.
Only that error text is the stop; any other thrown error is not. A message
already queued, including a `wakeRelay`, is returned before the throw, printed
raw, and does not end collection; the loop waits again. The stop ends that
request as a missing reply, with no admission, further wait, resend,
replacement or allowance reset, and is assessed under the shared
execution-recovery policy. A job that registers only after this stop is not
collected. Do not fall back to relay text, history, inbox or a cut result. An
owned running service or an undelivered owned job still prevents the throw,
and collection then stays bounded only by the native wait limit. This adds no
polling rule.

Issue that `wait` only after reading the receipt, never in parallel with or
before the send. In OMP v18.8.5 the session queues the wake turn's start on
its pooled-yield transition before `deliver` returns `woken`
([deliver](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/session/irc-bridge.ts),
[wake turn](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/session/agent-session.ts)).
When no such transition is pending, that start runs the wake monitor, which
registers the parent-woken job, before the send path
([send](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/irc/bus.ts))
resumes from its `await`, so the job exists before the receipt returns. The
ordering is not guaranteed when a pooled-yield transition is still pending or
the wake is deferred behind another turn. An early throw can then stop a
follow-up that might still produce a valid reply. That stop is not proof the
child failed: it stays a missing reply assessed under the shared
execution-recovery policy, and a job that registers only after the stop is
still not collected.

After candidate admission send the one implementation rethink as a separate
request to that same child. It applies code rethink then test rethink, at most
one correction, and the owned checks, then terminal-yields its lean Handoff by
direct native `yield` in the same response object. These collections use the
`dev-implementation` owner-directed return-preflight exemption unchanged.

OMP does not select a token/message, send-and-wait, or exact-body restatement
branch for implementation returns. Its `agent://` send has no native reply
correlation field. No text, agent-output, history, transcript, relay or message
fallback is admissible.

## Assurance and audit return collection

Review and verification dispatches pass the same caller `outputSchema` shown in
[Implementation candidate job collection](#implementation-candidate-job-collection);
an agent or session schema does not satisfy it.

Every review, verification, learning and implementation-child request, and
every test-audit auditor request including follow-ups, states this
lean-return rule: keep the Handoff or auditor result short, and reference
bulky evidence such as logs, diffs, repeated hashes or restated conditions by
path or command instead of pasting it, to save context. Never drop a required
Handoff field or a fresh `Observed` result. The rule is advice only: length is
never an admission condition.

Admit a review or verification return only through
[Same-cell structured return collection](#same-cell-structured-return-collection):
decode its `data.response` as the complete Handoff with the existing decoder,
then apply that role's Handoff contract. The implementation-only task, attempt,
candidate-phase, `yield`, wake-job and `taskDepth` rules do not apply here, nor
to the learning and auditor dispatches below; the depth-0 Eval requirement of
that section still does.

A return not collected or not shown complete is not observed. Use none of the
fallbacks that section bans, and do not request a shorter rewrite: review's
one clarification covers only missing fields or format omission
(`dev-code-review` "One clarification, never a rerun"), and restatement is
byte-for-byte only under the
[agent-return contract](../../references/agent-return/return.md) restatement
rule. The return stops under the role's existing recovery policy.

The single contract verdict stays inside the Handoff. The caller schema is what
excludes an agent default such as `{overall_correctness, confidence,
explanation}`; add no `verdict`, `kind` or `phase` field.

A `dev-continual-learning` dispatch passes the same caller `outputSchema`.
Admit its return only through
[Same-cell structured return collection](#same-cell-structured-return-collection),
with `data.response` the complete learning Handoff, then apply that Handoff's
rules. A return not collected or not shown complete is not observed: use no cut
text, request no shorter rewrite and do not retry. Before dispatch the
controller saves repository status plus a content hash of every modified and
untracked path. After a return not collected or not shown complete it compares
that saved state with the current one.
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
receive the same caller `outputSchema` on every request. Admit a return only
through
[Same-cell structured return collection](#same-cell-structured-return-collection),
with `data.response` exactly one auditor result: one complete proposal, one
named liveness stop, one closure result (`CLOSED`, `NOT CLOSED` or
`INCONCLUSIVE`), or one acknowledgment of the exact accepted proposal. Do not
decode it as a Handoff. Every per-file row of a proposal is required. A return
not collected or not shown complete is not observed: use no cut text, request
no shorter proposal and do not narrow the file list within this audit. It is
not any auditor stop, does not reuse the `transport-unavailable` gate and gets
no audit Handoff. The controller
records `auditor return not observed` as its own adapter record and stops the
audit read-only, preserving every unresolved file. A narrower scope is a new
audit, only when the requester names it.

## Child foreground execution

- A task child may have native `wait`
  ([native gate](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/tools/index.ts));
  the rules below still apply. A run that never yields first has its pending
  background jobs settled and is prompted again to yield. A budget stop, a
  terminal model error, or an exhausted reminder ladder with no pending work
  skips the quiescence barrier, so teardown cancels any background job it left
  running and the turn ends without a return
  ([teardown](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/task/executor.ts)).
  A yield while jobs are pending is only parked until they settle, then a fresh
  yield is required
  ([parked yield](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/task/executor.ts));
  do not rely on that.
- Before its terminal return, a child starts no background work: no bash
  `async: true` and no launched service.
- Bash auto-backgrounds a command still running after
  `bash.autoBackground.thresholdMs` (default 60 s), even with a longer `timeout`
  or `timeout: 0`
  ([enabled](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/exec/settings.ts),
  [threshold](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/exec/settings.ts),
  [wait budget](https://github.com/can1357/oh-my-pi/blob/v18.3.0/packages/coding-agent/src/async/auto-background.ts),
  [`timeout: 0`](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/tools/bash.ts)).
  A child runs any command that may exceed that threshold through Eval with an
  explicit `timeout` (Eval auto-background is off by default:
  [setting](https://github.com/can1357/oh-my-pi/blob/v18.4.9/packages/coding-agent/src/eval/settings.ts),
  [foreground path](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/tools/eval.ts)),
  and gives every Eval cell that may exceed the 30 s default an explicit
  `timeout`
  ([default](https://github.com/can1357/oh-my-pi/blob/v18.4.9/packages/coding-agent/src/tools/tool-timeouts.ts)).
- A job backgrounded anyway is cancelled with `write proc://<id>/kill` and rerun
  once in the foreground through Eval before the return.
- Every subprocess a child launches from Eval runs with a closed stdin. The
  Eval runner's stdin is the host's control channel and never closes: a process
  that reads stdin that is not a terminal, such as print-mode `omp -p` even with
  the prompt as an argument, waits forever for EOF
  ([piped stdin](https://github.com/can1357/oh-my-pi/blob/v18.8.7/packages/coding-agent/src/main.ts)),
  and a process that reads it can take the host's control frames
  ([runner stdin](https://github.com/can1357/oh-my-pi/blob/v18.8.5/packages/coding-agent/src/eval/py/runner.py)).
  Prefer the runner's own shell forms, a `%%bash` cell or a `!cmd` line, which
  already run with stdin on `/dev/null` and show output as it arrives. Use raw
  `subprocess` only when those cannot do the job, with
  `stdin=subprocess.DEVNULL`, and write its output to a file instead of holding
  it with `capture_output`, so its diagnostics are readable while it runs.
  Commands run through the bash tool already get a null stdin
  ([bash stdin](https://github.com/can1357/oh-my-pi/blob/v18.8.7/crates/pi-shell/src/shell.rs)).
- Every process a child launches from Eval also gets its own time limit of
  about ten times its expected run time: `subprocess.run(timeout=…)` in Python,
  or `/opt/homebrew/bin/timeout` in a shell form, never a bare `timeout`
  (macOS has no `/usr/bin/timeout`). The limit ends only the direct child; tools
  that child had already started can keep running and are reported, never
  signalled by hand. A hit limit is reported in the return as an execution
  failure and the process is not rerun; a paid session is repeated only on the
  human's decision. The limit leaves the cell `timeout` rules above unchanged,
  including `timeout: 0`, and does not apply to controller calls, which run
  through `bash` with `timeout: 0`.
- Every request that states the lean-return rule also states these child
  foreground rules, naming the closed stdin and the process time limit.

## Inbox is not return recovery

Inbox, rendered messages, JSONL, branch/session accessors, RPC message reads,
`history://`, `agent://` output reads, rendered cards, local echoes and report
stores cannot recover or replace an original structured completion-job result.
Sending a request with `write agent://<child>` does not make reading its output
an admitted return surface.

## Supervise indefinite operations externally

Except for the collections that `dev-implementation` exempts in its
owner-directed return preflight and same-cell collection of review,
verification, learning,
test-audit auditor A and B, and implementation launch returns under
[Same-cell structured return collection](#same-cell-structured-return-collection),
before using a settings-driven unbounded awaited report
collector or reviewer parking wait, bind an existing time/abort owner that
remains outside the blocked invocation, can inspect concrete progress, and can
interrupt that exact operation under the current protocol. Do not invent
another supervisor or place an unbounded wait inside an unbounded Eval cell. If
no such external capability exists, report that execution limitation and do
not begin the unsafe wait. That ban does not cover the exempt same-cell
collections, which run in a `timeout: 0` cell as that section requires; each
native `wait` call there is
bounded by `WAIT_MAX_MS` (30 min) and then returns a still-running snapshot, so
the loop waits again.

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

Retrace and Reconcile explicitly adopt the sole generic
[execution-recovery policy](../../skills/dev-implementation/references/execution-recovery.md)
for their authorized active-session execution machinery. This adapter grants no
adoption by itself and copies none of that policy's algorithm or allowances.
Normal supported observation of the same operation, an execution-machinery
retry, and a semantic return correction remain distinct.