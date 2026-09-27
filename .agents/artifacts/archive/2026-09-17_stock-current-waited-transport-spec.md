# Stock current-waited transport cutover technical specification

Revision: `stock-current-waited/spec-v2`
Status: final technical specification; one same-author planning rethink applied
Assurance: standard
Authority: human-approved `stock-current-waited/proposal-v1`, SHA-256 `591f907e92e050d236e6bdcf425fb8f61166455032fb9498954f77dcb9d19f02`
Next owner after the required same-author rethink: `dev-ticketing`

## Authority and approved outcome

Cut the active portable return contract, OMP adapter, Reconcile, Retrace, their reviewer projections, and their focused evaluations over to the original stock OMP `details.waited` return only. The receiving owner installs one native waiter before one owner-authored request, uses `timeoutMs: 0`, and immediately transfers the complete current native object and its exact returned `body` into current-invocation state before decoding or semantic work. Absence of `waited` fails closed at the exact unresolved frontier.

This is a conditional admission guarantee, not eventual delivery or post-consume recovery. It adds no lookup, replay, report store, publication API, supervisor, timer protocol, keepalive, idle-TTL override, fixed operation deadline, or second report channel. It does not revive an old run or replenish any semantic or execution-recovery allowance.

Governing evidence and durable constraints:

- approved decision evidence: `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-16T03-39-18-990Z_01a0a84c-2a4e-76e0-b622-e3dfcd92d744/local/stock-current-waited-proposal-v1.txt`, revision `stock-current-waited/proposal-v1`, SHA-256 above;
- supplemental review context: sibling `local/stock-current-waited-handoff-v1.txt`;
- generic workflow authority: ADR-0001 D02, D11, D13, D15, D16, D20, and D26; ADR-0002 D06, D08, D09, D21, D29, and D30; ADR-0003 D03, D04, D22, and D28; ADR-0009 D27;
- executable proof-selection policy: `skill://dev-implementation/references/test-value.md`;
- sole execution-machinery recovery policy: `skill://dev-implementation/references/execution-recovery.md`.

No active ADR changes. The portable return reference owns host-neutral return semantics; the OMP adapter owns stock mechanics; Reconcile and Retrace retain their semantic protocols and allowances. Their explicit adoption of the generic recovery policy remains unchanged.

## Current system and constraints

Public OMP `v18.1.21` source establishes the selected native seam:

- `IrcBus.wait` registers a future waiter; `timeoutMs === 0` creates no timer. A matching direct message is removed from the waiter set and returned without entering mailbox or session injection. Abort, target terminal/unregistration, and hard-abort paths can still settle the waiter.
- `executeSend` constructs the waiter before calling `IrcBus.send`, uses `drainPending: false`, and returns delivery `receipts` separately from optional `details.waited`. It trims recipient and outgoing message strings before dispatch.
- successful delivery is not a reply. A send may have successful receipts and no `waited`.
- JavaScript `AgentHandle.wait` accepts an options object and delegates as `wait([handle], { timeout })`; positional `handle.wait(seconds)` is not the supported interface.
- RPC `set_subagent_subscription` at level `events` emits each child session's raw `AgentSessionEvent` inside `SubagentEventPayload { id, event }`, including `tool_execution_end`; the child ID and event order make an actual owner's tool-result insertion observable without reading a transcript or asking the model to echo it.

These facts are grounded in `can1357/oh-my-pi` tag `v18.1.21`, `packages/coding-agent/src/irc/bus.ts`, `packages/coding-agent/src/tools/hub/messaging.ts`, `packages/coding-agent/src/eval/js/shared/prelude.txt`, `packages/coding-agent/src/cli/flag-tables.ts`, `packages/coding-agent/src/modes/rpc/rpc-client.ts`, `packages/coding-agent/src/modes/rpc/rpc-types.ts`, and `packages/coding-agent/src/task/types.ts`. Source evidence selects and explains the seam; it is not native proof.

The current ten-file overlay instead requires a custom exact-owner lookup after interruption. That direction is active in prose and focused evals but unavailable on the stock executable. The decoder and generic recovery algorithm are not implicated. The historical specification and plan remain readable evidence, not current authority for new execution:

- `.agents/artifacts/2026-09-15_transport-capture-supervision-spec.md`, `transport-capture-supervision/spec-v4`;
- `.agents/plans/2026-09-16-0009_transport-capture-supervision.md`, `IN_PROGRESS`, T1 checked and T2 unchecked.

The isolated patched checkout `/Users/kim/dev/oh-my-pi-transport-capture-18.1.21` is unused historical evidence. It is not an implementation input, library import, executable, or deletion target. The dirty checkouts `/Users/kim/dev/oh-my-pi-current-completion-18.1.15` and `/Users/kim/dev/oh-my-pi-strict-schema-2026-08-04-1949` are untouched.

## Architecture and ownership

### Portable return contract

`.config/agents/references/agent-return/return.md` keeps its declared-body decoder boundary, lifecycle distinctions, native provenance requirements, current-return retention, owner-held immutable snapshot guidance, and semantic-owner boundary. Change only the lookup-dependent clauses:

1. an owner-directed report operation binds the exact child, receiving owner, fresh authored token, semantic phase, and current native invocation before dispatch;
2. the host collector must exist before the owner-authored request is delivered;
3. the receiving owner inspects operation error, requested-recipient receipt, `details`, and `waited` presence before body access;
4. when `details.waited` exists, the owner mechanically transfers that complete native object and its exact returned body into current-invocation state before decode, semantic handling, or unrelated work;
5. the owner then applies every existing sender, recipient, token, relay, declared-body, grammar, identity, phase, freshness, authority, allowance, and one-time consumption check;
6. when `waited` is absent, the current expectation remains unresolved and unadmitted. Preserve its token, identities, phase, delivery facts, and used or unknown allowances; do not reconstruct, salvage, poll, replay, resend, request re-emission, create a replacement collector, replace an actor, or reset an allowance.

The portable reference remains host-neutral. It names an original current native return, not OMP operation spelling. It makes no post-consume or interrupted-owner recovery claim.

### OMP adapter

`.config/agents/harnesses/omp/agent-return.md` becomes the sole concrete description of the stock path:

- `hub send` with `await: true` installs its waiter before delivery; every requested report uses exact `timeoutMs: 0` and at most one outstanding request per exact `(owner, child)` pair;
- distinct children may be awaited concurrently;
- inspect `isError`, error details, exact recipient receipt, `details`, and `details.waited` presence in that order;
- transfer the complete `details.waited` object and exact native `body` immediately, then decode only that body as `text`;
- preserve the stock send-side trim boundary: equality begins at the returned native body. Never restore leading/trailing bytes removed by `executeSend`, normalize newlines, or claim equality with pre-trim input;
- zero disables only the waiter timer. Terminal child events, unregistration, hard abort, or caller/tool abort may settle the operation without `waited`;
- `hub inbox`, `irc_message`, JSONL, `sessionManager.getBranch()`, RPC message reads, `history://`, `agent://`, ordinary completion, rendered cards, local echo, and any report store are not return-admission or missing-`waited` recovery paths;
- JavaScript launch-handle waits use `handle.wait({ timeout: seconds })` or `wait(handles, { timeout: seconds })`, never a positional numeric argument;
- an existing time/abort owner outside the blocked invocation must be bound before an indefinite awaited report or parking wait. It observes the same operation, process state, and log cursor every five minutes. If absent, preflight stops. Observation never polls transport or authorizes a stop, signal, retry, redispatch, replacement, or allowance change.

The adapter deletes the conditional lookup capability and every isolated-candidate availability clause. It does not add configuration or claim that stock waiters survive every terminal boundary.

### Launch, addressability, readiness, and concurrency

Keep these facts separate and enforce this order for every launched controller or reviewer that has a readiness step:

1. allocate the exact child under its actual owner;
2. let that child's launch-only turn settle locally, using the supported handle wait form when a handle is used;
3. establish the exact registered child ID and actual owner from the current native roster;
4. send a separate readiness request with its own fresh token through the waiter-before-send path;
5. admit readiness only from present `details.waited` after the full native and readiness grammar checks.

Launch output, launch ordinary completion, roster presence, and readiness are distinct. A producer handles the one operative request it actually receives; it does not acknowledge and wait for a duplicate copy. Reconcile may allocate A and B together, await their launch-turn settlements concurrently, confirm both exact owned roster entries, and issue their distinct readiness requests concurrently. It still keeps only one outstanding request per owner-child pair. Retrace preserves concurrent ready scopes; each scope child's launch turn settles before roster-bound operative dispatch. Retrace adds no new scope return-body grammar merely to acknowledge launch.

### Reconcile and reviewers

Change only transport-dependent lines in:

- `.config/agents/skills/reconcile/SKILL.md`;
- `.config/agents/skills/reconcile/references/reviewer-protocol.md`;
- `.config/agents/skills/reconcile/references/execution-flow.md`;
- `.config/agents/harnesses/omp/agents/second-opinion-a.md`;
- `.config/agents/harnesses/omp/agents/second-opinion-b.md`.

Reconcile removes lookup capability from preflight and replaces its allocation/launch wording with the ordered sequence above. Every readiness, initial, post-rethink, later, correction, and approved-context return keeps its own original awaited send, fresh token, `await: true`, and `timeoutMs: 0`. Missing `waited` stops that request without a semantic nudge: no report was admitted, and a nudge cannot recreate native provenance. Current malformed reports keep the existing one total correction allowance across delivery, format, and identity; missing `waited` neither consumes nor replenishes that allowance unless existing native facts independently establish an eligible current attempted return under the unchanged semantic rule.

Reviewer body grammar, pass semantics, same-child rethink, local echo, tools (`read`, `grep`, `glob`), persistence, isolation, synchronization, correction budget, and cleanup ownership remain unchanged. Each reviewer still sends one complete IRC report with the request token copied exactly into `replyTo`, then one exact non-authoritative local echo. Reviewers never retry, replay, or emit a second report to compensate for missing `waited`.

The non-runtime execution map projects the same launch/roster/readiness order, current-only return, missing-`waited` stop, external observation, and disposal behavior. It remains non-authoritative.

### Retrace

`.config/agents/skills/retrace/SKILL.md` keeps the approved table, graph, scope, evidence, closed-body grammar, semantic correction, nested Reconcile ownership, freshness, aggregation, and cleanup rules. Change only transport-dependent lines:

- wait for each normalization or scope child's launch-only turn to settle before current-roster binding and operative dispatch;
- use one original awaited send per outer return with a fresh token and `timeoutMs: 0`;
- immediately copy a present complete `details.waited` object and exact body into the actual receiving owner's state before decoding;
- missing `waited` preserves the exact request frontier and used or unknown allowances and stops without lookup, inbox, replay, re-emission, replacement, or reset;
- nested reviewer traffic remains owned and received by the actual scope controller, never the outer Retrace parent;
- the outer parent continues independent ready work where safe, but it does not take over a blocked scope child's collection or Reconcile.

The same scope child still owns actual report-only Reconcile, both reviewers, and reviewer disposal. After the scope's terminal return, the outer parent alone disposes that exact scope child.

### Focused evals

Revise, do not duplicate, the closest permanent semantic cases:

- keep `REC-IRC-REPORT-TRANSPORT`, replacing lookup branches with launch settlement, roster, current `waited`, missing-`waited`, five-minute observation, and unchanged semantic-correction boundaries;
- rename `REC-RETAINED-CURRENT-REPORT` to `REC-CURRENT-WAITED-REPORT` and replace retained-lookup branches with current exact-copy, trim-aware body provenance, receipt-without-waited failure, terminal/abort settlement, no-salvage, and unchanged allowances;
- keep `RETRACE-DELEGATED-REVIEW`, replacing nested lookup/outer-owner branches with actual nested-owner waiter-before-send, current exact-copy, missing-`waited` stop, and reviewer-then-scope disposal.

These cases earn permanent retention because they defend distinct semantic failure boundaries that static prose cannot reliably protect: current payload versus delivery-only success, nested actual-owner provenance, and missing payload versus malformed current return. They remain synthetic/model-driven and cannot prove native routing. No new eval entry or permanent test file is selected. The decoder and its tests stay byte-identical.

## Interfaces, data, invariants, and errors

The selected OMP request is the existing operation:

```text
hub send
  to: <exact current registered child ID>
  message: <one complete owner-authored request>
  await: true
  timeoutMs: 0
```

The successful observation is the existing native result shape with a present `details.waited` `IrcMessage`:

```text
{
  isError?: boolean,
  details: {
    op: "send",
    from: string,
    to: string,
    receipts: Array<{ to: string, outcome: string, error?: string }>,
    waited: {
      id: string,
      from: string,
      to: string,
      body: string,
      ts: number,
      replyTo?: string,
      wakeRelay?: boolean
    }
  }
}
```

Required invariants:

- waiter registration precedes request delivery;
- exactly one outstanding awaited request exists per owner-child pair; independent pairs may overlap;
- the native waiter matches sender, while workflow admission additionally requires exact recipient and authored `replyTo` token;
- successful receipt and present `waited` are separate facts;
- exact-copy scope is the complete returned native object and returned body, not reconstructed pre-trim input;
- copy precedes body decode and all semantic work;
- an admitted token is consumed once;
- missing `waited` remains unresolved, even if a report may have been produced;
- a local echo, ordinary completion, immutable body snapshot, digest, or source transcript never becomes native provenance;
- generic recovery may correct eligible unchanged machinery only; it cannot invent a missing native payload, ask for child work again, alter semantic authority, or reset any allowance.

## Effects, migration, rollback, and compatibility

### Permitted implementation effects

One cohesive implementation child may:

- change the ten active transport/eval files and only the supersession metadata header of `.agents/artifacts/2026-09-15_transport-capture-supervision-spec.md`;
- create the bounded proof driver and proof evidence named below;
- leave old-plan closure and new-plan creation/update to their separately assigned route owners;
- after replacement verification only, delete the old and replacement proof drivers through the same retained implementation child.

No extension, runtime configuration, host source, host checkout, decoder, generic recovery file, provider configuration, global installation, restart, commit, push, shipping, or checkout deletion is permitted.

### Coherent cutover

All ten active transport/eval targets plus the old specification's metadata-only supersession update change in one child-owned boundary. No active caller may retain lookup as an available, preferred, fallback, interruption, or recovery mechanism. Negative text may name lookup only as prohibited or historical. Preserve unrelated policy work, especially declared bodies, native provenance, semantic owners, current correction budgets, external observation, execution-recovery adoption, and exact disposal.

There is no compatibility alias or fallback. Failure or inconclusive proof preserves the candidate and evidence for the approved repair/stop path; it does not restore lookup authority, activate a partial cutover, or resume old T2.

### Historical supersession and plan lifecycle

This revision supersedes `transport-capture-supervision/spec-v4` as current implementation authority. In the cohesive implementation boundary, change only the old specification's header metadata to `Status: superseded historical specification; implementation not completed`, then add `Superseded by:` with this specification's final path, revision, and post-rethink SHA-256 and `Replacement plan:` with the exact new active plan path. Preserve the old revision, authority, governing evidence, and every body section unchanged; the metadata linkage records history and grants no execution authority.

Before new implementation dispatch, the route controller must change `.agents/plans/2026-09-16-0009_transport-capture-supervision.md` from `IN_PROGRESS` to `CLOSED` under the current explicit stop authority. Preserve T1's checked box and immutable completion record, every checked T1 acceptance item, T2's unchecked box, and every unfinished checkbox. Add no `Completed At` or Completion Summary and never mark it `DONE`.

`dev-ticketing` authors one new active lean plan that binds this specification's exact path, revision, and post-rethink SHA-256. Its authority/scope prose explicitly states that it supersedes the old plan's lookup direction, depends on no old T1 host output, never revives the old T2 child, and leaves the isolated checkout unused. Ticketing selects exact task IDs and child names; it must preserve this specification's single cohesive implementation boundary and must not add host, supervisor, proof-only scaffolding, assurance, or learning implementation tickets.

### Proof-driver cleanup

The obsolete driver is:

`/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-14T17-18-07-672Z_01a0a0ed-1738-7456-9eb3-049995d37206/local/transport-capture-supervision-native-proof.ts`

Transfer its cleanup ownership to the new cohesive implementation child. That child must not delete it during implementation, review, or independent verification. After the verifier fixes its successful final aggregate, Main resumes the same child only for non-repository proof-scaffolding cleanup. The child deletes the obsolete driver and the byte-identical replacement driver, preserves both old failed evidence and new proof captures, and returns direct file-absence evidence. This cleanup mutates no reviewed repository candidate, triggers no second review or verification, and must finish before learning, plan `DONE`, or presentation. Neither reviewer, verifier, Main, nor an old T2 child performs deletion.

## Approval-gated proof design

### Real entrypoints and driver surface

The repository has declarative `evals/evals.json` registries but no repository-wide eval runner. The real model entrypoints are OMP's installed `/skill:reconcile` and `/skill:retrace` commands; the real native integration entrypoint is stock OMP RPC mode. Do not claim registry parsing or source inspection ran a semantic eval.

The implementation child creates exactly one disposable Bun TypeScript driver at:

`/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-16T03-39-18-990Z_01a0a84c-2a4e-76e0-b622-e3dfcd92d744/local/stock-current-waited-native-proof-v1.ts`

It imports no file from any host checkout and registers no RPC host tool. It implements only the bounded stock JSONL v2 framing needed for ready/protocol negotiation, available-command inspection, `set_subagent_subscription: events`, prompt/follow-up, `get_state`, `get_subagents`, one controlled abort stimulus, and process stop. It launches only `/Users/kim/.local/bin/omp`. Every process uses `--mode rpc`, `--no-session`, `--no-title`, `--no-extensions`, `--no-lsp`, `--no-rules`, `--auto-approve`, and `--cwd /Users/kim/.dotfiles`; `--no-session` establishes a fresh root process but is never treated as child launch settlement. The first two synthetic cases add `--skills reconcile --tools read,grep,glob` and explicitly invoke `/skill:reconcile`; the third adds `--skills retrace,reconcile,rethink --tools read,grep,glob` and explicitly invokes `/skill:retrace`. The native process uses `--skills retrace,reconcile,rethink`, verifies `skill:retrace`, `skill:reconcile`, and `skill:rethink` through `get_available_commands`, then explicitly invokes `/skill:retrace`. The driver splits each approved `PROVIDER/MODEL` root selector into stock `--provider` and `--model` arguments and compares scope/reviewer identities from native progress/lifecycle data. No process uses `--max-time`, a custom host tool, a report registry, a transcript/message read, or a checkout import.

The driver's only command is:

```text
bun stock-current-waited-native-proof-v1.ts run --portfolio implementation|verification --omp /Users/kim/.local/bin/omp --omp-sha256 SHA256 --driver-sha256 SHA256 --root-model PROVIDER/MODEL --scope-model PROVIDER/MODEL --reviewer-a-model PROVIDER/MODEL --reviewer-b-model PROVIDER/MODEL --evidence ABSOLUTE_JSONL_PATH
```

`SHA256`, model identities, portfolio, and evidence path above name required CLI fields, not defaults. Main replaces every one with a literal measured or resolved value in the exact command presented for later human approval. The implementation evidence path is sibling `local/stock-current-waited-proof-implementation-v1.jsonl`; the verification evidence path is sibling `local/stock-current-waited-proof-verification-v1.jsonl`. The driver rejects a nonliteral/mismatched digest or observed model identity, an existing evidence path, a wrong portfolio path, extra process/actor, or unknown CLI field. It writes one new append-free capture. The capture is assurance evidence only and is never report admission, owner retention, or recovery.

### Later human effect gate

No driver invocation is authorized now. After candidate bytes and the driver are fixed, Main presents the fully rendered implementation and verification commands plus the exact billing/account profile that each resolved provider/model will charge. One later human decision must approve or reject those literal executable and driver digests, the root/scope/A/B provider-model identities, the account effect, and exactly two portfolios total: one implementation run and one fresh independent-verifier repeat. It also binds four fresh stock OMP root processes per portfolio, one deliberate abort stimulus per portfolio, the two exact evidence paths, disposable fixture/session-root creation and removal, and no other native/model effect. The approval remains conversational authority; do not create an approval file, schema, ledger, registry, or runtime configuration.

Any executable, driver, provider, model, account, scenario count, role resolution, effect, command, or digest drift invalidates the gate before execution. The cap permits no rerun; another native/model execution requires a new exact human gate even if generic machinery recovery would otherwise be eligible.

### Portfolio contents and decision thresholds

Each portfolio runs, in order and against identical candidate bytes:

1. the exact updated `REC-IRC-REPORT-TRANSPORT` prompt through explicit `/skill:reconcile` in one fresh restricted-tool process;
2. the exact renamed `REC-CURRENT-WAITED-REPORT` prompt through explicit `/skill:reconcile` in one fresh restricted-tool process;
3. the exact updated `RETRACE-DELEGATED-REVIEW` prompt through explicit `/skill:retrace` in one fresh restricted-tool process;
4. one fresh native process with exactly one clear parent-normalized Retrace scope, one scope controller, its exact A/B Reconcile reviewers, and one root-owned `TransportProbe` child. No normalizer or replacement actor is permitted.

The native driver supplies the frozen one-scope fixture and human-owned priorities, waits for the complete one-row Retrace table, then sends its one frozen approval with RPC `follow_up`. It does not pre-approve a table that has not been observed. The same scope child must then run the complete nested Reconcile path and return `scope-result`.

The native scenario must observe from root and owner-ID-scoped subagent events, not model claims:

- each child's launch-only `agent_end` before exact roster binding; reviewer A/B then receive separate readiness requests, while the scope child receives its separate operative request;
- exact actual owner/child IDs, one outstanding awaited owner request per pair, and overlap only across distinct pairs;
- every owner-to-child request that expects a readiness, review, candidate-ready, scope-result, or probe return uses `hub send` with `await: true` and `timeoutMs: 0`; each producer-to-owner reviewer, scope, or probe report is one separate non-awaited `hub send` with exact `replyTo`, followed only by the already-required non-authoritative local echo where that reviewer protocol requires it;
- a complete actual Retrace-owned Reconcile path through A/B readiness, A's initial response, same-A rethink, finalized response, scope-result admission, A/B disposal by the scope child, and scope disposal by the outer parent;
- for every admitted return, the actual receiving owner's own `tool_execution_end` event contains the complete raw `details.waited` object and returned body. That stock owner-scoped tool-result insertion is the mechanical owner-held current-invocation copy oracle: it must precede every later same-owner assistant message or tool action that decodes or reasons about the report. The driver compares the raw object and body directly with later admitted identities; an external copy, local echo, transcript read, digest alone, or model statement cannot satisfy this predicate;
- after the nested path, the already-settled root-owned `TransportProbe` handles one awaited request by sending one non-awaited exact body with deliberate outer spaces plus internal newline, Unicode, and quotes. The owner's returned body must equal the stock-trimmed string exactly. Only after that operation settles may the same probe handle the negative request;
- the probe's second request installs its waiter before send and remains pending. The external driver records the same operation, root process state, exact probe roster state, and current event/log cursor, makes no transport or process mutation for at least `300000` monotonic milliseconds, then records the same fields again. Unchanged observation causes no action;
- after the second observation, the separately approved single RPC abort is applied as experimental stimulus, not an elapsed deadline or inference from silence. The original owner request settles with its delivery facts and no `details.waited`, or the portfolio is inconclusive. The aborted turn admits no body and performs no salvage. A later cleanup-only follow-up may dispose the exact probe but may not inspect RPC messages/transcripts, issue another request, recover the report, resume semantic work, replace an actor, or alter an allowance;
- every owned child and stock process reaches its specified terminal cleanup state. Cleanup failure is portfolio failure, never success with residue.

Each synthetic case has zero child allocations. Per native root there are exactly four child allocations total: one scope controller, its A and B reviewers, and one probe; live ownership never exceeds those actors. A focused case passes only when every registry assertion is directly supported and none is contradicted. The native scenario passes only when every machine-observable predicate above is present. Missing or conflicting events, a model-only assertion, wrong owner, body mismatch, premature action, unapproved extra process/actor, cleanup residue, or gate drift yields `FAIL` or `INCONCLUSIVE`, never inferred success. The verifier independently repeats the complete fixed portfolio; another role's capture cannot fill its missing observation.

## Acceptance

The common proof-selection policy chooses the three closest permanent semantic cases plus one shared native journey. Static checks prove file shape and unchanged owners; they do not substitute for model decisions or stock runtime behavior. The shared native journey is warranted because waiter timing, nested ownership, real call-boundary payloads, five-minute non-cutoff observation, and exact disposal are not established by source or synthetic fixtures. Contradictory missing-payload behavior is a separate phase in the same native process with an explicit independent starting frontier.

### AC-CUTOVER

Behavior: All ten active transport/eval targets select original current `details.waited` only; the old specification has metadata-only supersession linkage; lookup/publication/store authority is removed; the portable contract stays host-neutral; reviewer tools and one non-awaited send-plus-echo grammar stay unchanged; and the decoder and generic recovery algorithm remain byte-identical.
Check: Directly inspect the ten active targets plus `.agents/artifacts/2026-09-15_transport-capture-supervision-spec.md` and compare pre/post SHA-256 for `.config/agents/references/agent-return/decode.py`, `.config/agents/references/agent-return/test_decode.py`, and `.config/agents/skills/dev-implementation/references/execution-recovery.md`; expect one coherent current-waited contract, exact old-spec supersession metadata with its prior body unchanged, no active lookup or alternate report-admission branch, unchanged reviewer tools/grammar, and identical protected-file hashes.

### AC-EVAL-REGISTRIES

Behavior: The closest existing focused evals defend current payload, missing payload, nested actual-owner transport, supervision, and disposal without duplicate cases or source-text-only assertions.
Check: Run `python3 -B -c 'import json; paths=[".config/agents/skills/reconcile/evals/evals.json",".config/agents/skills/retrace/evals/evals.json"]; data=[json.load(open(p,encoding="utf-8")) for p in paths]; ids=[[e["id"] for e in d["evals"]] for d in data]; assert all(len(x)==len(set(x)) for x in ids); assert "REC-IRC-REPORT-TRANSPORT" in ids[0] and "REC-CURRENT-WAITED-REPORT" in ids[0] and "REC-RETAINED-CURRENT-REPORT" not in ids[0] and "RETRACE-DELEGATED-REVIEW" in ids[1]'`; expect exit zero, valid JSON, unique IDs, the clean rename, and no added overlapping transport case.

### AC-LAUNCH-READINESS

Behavior: Each launched participant settles its launch-only turn before exact owner/roster binding and separate readiness or operative dispatch; A and B may proceed concurrently while each owner-child pair has only one outstanding request.
Check: Run the approval-gated fixed portfolio through the exact driver surface; expect ordered native events for allocation, launch settlement, exact roster ownership, and separate readiness for A and B, scope launch settlement before operative dispatch, no launch output admitted as readiness, and no overlapping requests for the same owner-child pair.

### AC-CURRENT-COPY

Behavior: A present current native return is mechanically inserted into the actual receiving owner's current invocation as the complete original `details.waited` object and exact stock-returned body before decode, then receives every existing provenance and semantic check without reconstructing trimmed edges.
Check: Run the approval-gated fixed portfolio; expect the actual owner-ID-scoped `tool_execution_end` event to contain the full waited object before any later same-owner semantic event, exact `from`, `to`, `replyTo`, relay disposition and body equality, successful admission only after full existing checks, the probe's first returned body equal to its stock-trimmed value with internal newline/Unicode/quotes unchanged, and no external copy, model echo, transcript read, lookup, or alternate source accepted as the oracle.

### AC-MISSING-WAITED

Behavior: Delivery receipts without `details.waited`, including terminal/abort settlement of a timer-disabled collector, preserve the exact unresolved frontier and used or unknown allowances and stop without salvage, replay, replacement, or semantic correction.
Check: Run the approval-gated fixed portfolio; expect the controlled negative to retain original delivery facts with absent `waited`, zero body access/admission, zero inbox/lookup/transcript/history/RPC-message/agent-output recovery, zero resend/re-emission/new collector/replacement/reset, unchanged semantic correction accounting, and exact probe disposal.

### AC-NESTED-RETRACE-RECONCILE

Behavior: One actual Retrace scope child owns and completes its delegated Reconcile with the exact nested A/B pair, while the outer parent admits only scope traffic and never receives reviewer reports or disposes grandchildren.
Check: Run the approval-gated fixed portfolio; expect one approved scope, one exact scope controller, two exact reviewers owned by that controller, admitted readiness/initial/post-rethink/final/scope-result events on their correct owners and tokens, no outer-parent reviewer admission, reviewer disposal by the scope child, then scope disposal by the outer parent.

### AC-SUPERVISION

Behavior: An existing owner outside the blocked invocation observes the same pending collector, operation, process state, and event/log cursor after at least five minutes without treating silence or unchanged state as progress, failure, or authority to act.
Check: Run the approval-gated fixed portfolio; expect two observations of the same operation with the second at monotonic elapsed time `>= 300000` ms, zero intervening inbox/lookup/waiter/actor/process/allowance mutation, and the later single abort identified only as the separately approved experimental stimulus rather than an observation-triggered deadline.

### AC-DISPOSAL

Behavior: Every terminal path disposes exact owned reviewer IDs before the scope child and disposes the exact scope child before outer completion; report, echo, turn completion, cancellation request, or job-handle settlement is never disposal evidence.
Check: Run the approval-gated fixed portfolio; expect exact native non-running/removal evidence for A and B under the scope controller, then exact scope-child removal under the outer parent, exact probe removal, no substitute `AgentHandle.cancel`, no replacement actor, and no owned actor or OMP process left running.

### AC-LIFECYCLE

Behavior: Before implementation, the incompatible old plan is closed without falsifying history and the new plan alone drives the cohesive stock cutover; during implementation the old specification receives metadata-only supersession linkage, while both proof drivers remain present through independent verification and unrelated checkouts remain preserved.
Check: During independent verification, directly inspect the old plan, new plan, old/new specification linkage, both proof-driver paths, proof captures, and named checkouts; expect old plan `CLOSED` with T1 history intact and T2/unfinished checks unchecked, new plan bound to this final revision and still nonterminal, exact old-spec metadata with its historical body preserved, both drivers present at their bound digests, the implementation and verification captures present, the isolated checkout present and unused, and both unrelated dirty checkouts untouched.

## Test seams and implementation boundary

No new production seam or permanent test file is warranted. Stock bus/messaging source is not changed; the permanent value lies in the three existing semantic eval entries. The disposable RPC driver observes public hub/RPC/lifecycle events and is retained byte-identically for one review and one independent verification, then removed. It must not become a repository utility or runtime dependency.

Use one cohesive implementation child. The ten active transport/eval files plus old-spec metadata encode one coupled cutover; splitting them would create mixed authority. The same child can reliably read, edit, rethink, run the safe checks, prepare the later gate request, and execute its one approved portfolio. Ordered old-plan closure, new-plan lifecycle, the later exact effect gate, standard assurance, and post-verification driver cleanup justify a lean plan, but not a second implementation boundary. `dev-ticketing` owns the exact graph, task ID, owner name, dependencies, and receivers.

Final assurance operates on one immutable repository candidate and byte-identical retained driver: one tests-first review accounts for the ten active transport/eval files, the old specification metadata, both plan lifecycle files in the route target manifest, and the driver; one independent verifier runs the complete fixed acceptance set and its one approved verification portfolio. After a successful verifier aggregate, the same implementation child performs only the specified non-repository driver cleanup and direct absence check; this is completion bookkeeping, not candidate repair, and creates no second assurance cycle. Learning follows cleanup, then the new plan may become `DONE` and presentation may proceed.

## Risks, assumptions, stops, and open decision

Material risks:

- Stock waiter consumption has no post-consume reread. An abort after consumption but before the caller receives `details.waited` can leave a produced report unadmitted; this is accepted and must not be hidden by reconstruction.
- Model compliance cannot prove native mechanics. Native event capture is required for sequencing, waited presence/body, ownership, five-minute observation, and disposal.
- `executeSend` trims outer message whitespace. Protocols must judge the returned native body and cannot require removed edges.
- A fully correct producer can still yield missing `waited` after terminal/abort settlement. Absence proves no admissible return, not that no report was produced.

Stop rather than weaken the design if exact stock executable or driver identity drifts; required role/provider/model/account resolution is not approved; an external observer cannot see the same blocked operation; native events cannot establish launch settlement, exact owner/roster binding, or call-boundary payload; the nested scope child cannot own Reconcile and disposal; a check requires lookup, inbox admission, a report store, a new host tool, configuration mutation, checkout use, global restart, actor replacement, old-run continuation, or allowance reset; proof residue cannot be cleaned by the original child; or any owned actor/process remains live.

The sole remaining human-authority issue is the later native/model effect gate with exact executable and driver digests, all resolved provider/model/account identities, and the fixed two-portfolio bounds. It is not permission to run now and is not an unresolved technical design choice.
