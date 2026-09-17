# Transport capture and supervision technical specification

Revision: `transport-capture-supervision/spec-v4`
Status: superseded historical specification; implementation not completed
Assurance: standard
Authority: confirmed `transport-capture-supervision/proposal-v2` and `transport-capture-supervision/decision-v2`
Source baseline: public Oh My Pi tag `v18.1.21`, commit `a2501722aa05670eeab327ea1325e3fde55e51a9`
Next owner after the required same-author rethink: `dev-ticketing`
Superseded by: `.agents/artifacts/2026-09-17_stock-current-waited-transport-spec.md`, revision `stock-current-waited/spec-v2`, SHA-256 `b79bc144d4888386338169d97cbcb2348d33b9b76efbacb0d2853c342ed4b882`
Replacement plan: `.agents/plans/2026-09-17-0205_stock-current-waited-transport.md`

## Authority and approved outcome

Implement one fail-closed, owner-bound native retention and lookup extension at Oh My Pi's existing IRC delivery seam. Preserve the original `IrcMessage` before either successful routing branch, then let only the exact receiving owner in the same still-valid native invocation look it up without consuming or redelivering it. Adopt that capability coherently in the portable return contract, the OMP adapter, Reconcile, Retrace, and their affected focused evaluations and projection.

The approved outcome preserves all current semantic owners and allowances. Native retention and lookup do not admit a report, validate workflow grammar, decide phase or identity, consume an authored token, replace a required actor, or authorize replay, re-emission, restart, old-run continuation, retrospective admission, shipping, or allowance reset. Reconcile and Retrace remain the semantic owners of their own reports. Reviewers remain write-less.

Five minutes is the cadence for observing the same operation through its existing external owner. It is not a production timeout, stall detector, retry trigger, or termination rule.

Governing evidence:

- confirmed decision: `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-14T17-18-07-672Z_01a0a0ed-1738-7456-9eb3-049995d37206/local/transport-capture-supervision-decision-evidence-v2.txt`, SHA-256 `ef7f5a5b159556c9e5a5733f2f6a1948ce3ca9f2853c05d7f852809c445a9ab4`;
- confirmed proposal: `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-14T17-18-07-672Z_01a0a0ed-1738-7456-9eb3-049995d37206/local/transport-capture-supervision-proposal-v2.txt`, SHA-256 `cbe1ed7fa1dd9cf7df4075cdaf64121cbe130b8d80131cc3d2ae00da0c8b82f2`;
- qualified source facts: `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-14T17-18-07-672Z_01a0a0ed-1738-7456-9eb3-049995d37206/local/transport-capture-supervision-source-qualification.txt`;
- workflow authority: ADR-0001 D02, D11, D13, D15 and D26; ADR-0002 D08, D09 and D30; ADR-0003 D04, D22 and D28; ADR-0009 D27.

No active ADR decision changes. The portable return contract remains the executable owner for generic return semantics; the OMP adapter owns host capability facts; Reconcile and Retrace own their semantic protocols.

## Current system and revision boundary

### Source and runtime identity

The public `v18.1.21` tag resolves to commit `a2501722aa05670eeab327ea1325e3fde55e51a9`. Its `packages/coding-agent/src/irc/bus.ts` defines `IrcMessage` with `id`, `from`, `to`, `body`, `ts`, optional `replyTo`, and optional `wakeRelay`. In `IrcBus.#deliver`, a matching waiter is removed and resolved before an early return; otherwise the same object is passed to `AgentSession.deliverIrcMessage`. Successful delivery is not left in the mailbox.

No clean local source checkout at that revision was found in bounded discovery. The two available source trees are non-equivalent and already contain unrelated work:

- `/Users/kim/dev/oh-my-pi-current-completion-18.1.15`, HEAD `a33cc26824e3c91edd9fa42d681f10dceb4ac2f0`, detached and dirty;
- `/Users/kim/dev/oh-my-pi-strict-schema-2026-08-04-1949`, HEAD `a5090f1f81cf0ac072fbd1ec949eebe6bbbc23a9`, detached and dirty.

Implementation therefore uses a new isolated checkout at `/Users/kim/dev/oh-my-pi-transport-capture-18.1.21`, initially at exact commit `a2501722aa05670eeab327ea1325e3fde55e51a9`. It must not copy or rebase the unrelated changes from either existing checkout. Creating and changing that checkout belongs to the downstream host-implementation owner, not this specification task.

The currently invoked executable is `/Users/kim/.local/bin/omp`, reports `omp/18.1.21`, and had SHA-256 `e99a06d5741f13a5e161c88617cde2f5a65d422b2eec0cf1a69aecd093b2462f` during specification discovery. Version equality is not binary-to-source parity. This installed binary is not the implementation target and must not be overwritten, restarted, or treated as proof of the candidate.

### Existing owners and limits

- `IrcBus` already owns process-global message delivery, waiters, mailboxes, and routing order. Retention belongs inside this owner, not in an extension callback, event logger, transcript, workflow file, or second report store.
- `HubTool` is the existing public owner-facing coordination surface. It already derives the current native caller from `ToolSession.getAgentId`, the current registry, and the attached session.
- `executeSend` exposes a current waiter result as `details.waited`. That exact object and its `body` remain the immediate path.
- Session injection and `irc_message` events are later routing/notification paths. They are not retention commit evidence. `inbox` is consuming across at least one source and is not the selected late lookup.
- `AgentRegistry` gives the current agent ID and attached `AgentSession`, but the qualified `IrcBus` source also permits a pending waiter to win when no session is currently attached. The invocation key therefore cannot be reconstructed only at delivery time: the OMP `HubTool` must pass its opaque production `ToolSession` object to `IrcBus.wait`, the waiter must retain that object, and the no-waiter branch must use the exact attached `AgentSession`. In production those are the same owner-session object. A disposed, detached, replaced, revived-as-a-new-session, unregistered, or hard-aborted object is not the same invocation.

## Architecture and ownership

### Native retention at `IrcBus.#deliver`

`IrcBus` gains one bus-owned in-memory retention collection keyed first by the opaque receiving invocation object and then by the native correlation tuple `(message.from, message.replyTo)`. The production key is the exact `ToolSession`/`AgentSession` object already owned by the receiving HubTool and registry; it is never an ID accepted from the model. The collection retains the original `IrcMessage` object passed to `#deliver`; it does not rebuild an envelope from session records or rendered text. A weak invocation-object key prevents retention from keeping an ended invocation alive.

`IrcWaiter` gains its exact owner invocation object at `IrcBus.wait` registration. `#deliver` must inspect a matching waiter without removing it, select that captured key, commit retention synchronously, and only then remove/resolve the same waiter. This handles the existing supported state in which a pending waiter wins while no session is attached. If there is no matching waiter, `#deliver` selects the current attached recipient session after the lifecycle gate and commits before `session.deliverIrcMessage`, relay notification, or a success receipt.

The resulting two successful orders are:

1. matching waiter: non-destructive match and invocation selection, retention commit, waiter removal/resolution;
2. no matching waiter: exact attached-session selection, retention commit, `deliverIrcMessage` injection/wake.

Messages rejected before either a valid matching-waiter invocation or a valid attached-session invocation exists are ordinary delivery failures and are not retained. A later live-handoff failure may continue to use the existing mailbox behavior, but its earlier successful retention commit does not turn the failed handoff into successful delivery.

Host code cannot identify a workflow report from message prose, so the bus retains every otherwise-routable direct `IrcMessage` for the active invocation. It adds no report grammar, phase table, semantic token registry, workflow ledger, TTL, or numeric production cap.

### Fail-closed ordering

Retention commit is part of routing, not an observational callback. If it throws or cannot establish the exact current owner invocation, `#deliver` returns a failed delivery receipt and performs none of the following:

- remove or resolve a matching waiter;
- call `AgentSession.deliverIrcMessage`;
- inject, steer, wake, or enqueue the message as successful delivery;
- relay it to the main UI;
- update successful-send state;
- report `injected`, `woken`, or `revived`.

The failure result exposes capture failure as a delivery failure without treating an event-handler call as commitment. Deterministic failure proof justifies one file-local retention interface and default in-memory implementation accepted through the existing `IrcBus` constructor. The collaborator has no registry, timer, public export, independent lifetime, cleanup API, or second storage location; its only operations are commit and exact lookup against the bus-owned weak collection. Tests inject a throwing implementation. Splitting it into another module or adding a production test flag/backdoor is prohibited.

A later owner-side copy failure is different: native delivery and retention already succeeded, so delivery history remains successful, but the workflow owner reports capture failure and blocks semantic admission. It must not relabel delivery as failed.

### Lifetime and isolation

A retained message is available only to the same opaque invocation object that owned the matching wait registration or current live delivery, while that object is not disposed and still belongs to the calling HubTool's exact owner. Lookup supplies the calling HubTool's own `ToolSession` object directly; the model cannot name or override it. Retention has no disk persistence and does not survive owner-session disposal, replacement, revival into a new object, unregistration, process exit, or restart.

This lifetime deliberately survives collector settlement, waiter removal, a producing turn ending, and an owner turn interruption when the receiving owner object remains current. Loss of that required owner or invocation remains a workflow stop even if other evidence exists.

### Public owner lookup

Extend the existing `hub` tool with this exact peer-messaging operation:

```text
{ op: "lookup", from: "<exact expected sender>", replyTo: "<current owner-authored token>" }
```

Rules:

- `from` and `replyTo` are required nonempty strings. `to`, `name`, `ids`, `peek`, `await`, and timeout fields are invalid for `lookup`.
- Recipient/owner ID, registry, and opaque current invocation object are derived from the calling HubTool and its `ToolSession`; no request field may claim them.
- The bus filters only the caller's current invocation retention by exact native `from` and exact native `replyTo`.
- Exactly one match returns a successful structured result. Zero or multiple matches fail closed; the host never chooses newest/oldest and never falls back to another source.
- Success details have the exact shape below. `retained` is the original `IrcMessage` value serialized through the normal tool-result bridge.

```text
{
  op: "lookup",
  from: "<calling owner id>",
  retained: {
    id: string,
    from: string,
    to: string,
    body: string,
    ts: number,
    replyTo?: string,
    wakeRelay?: boolean
  }
}
```

- A miss or ambiguity returns `isError: true`, `details.op: "lookup"`, `details.from` equal to the caller, and no `retained` field. Human-readable error wording is not contractual.
- Lookup does not remove or mutate the retained object, mailbox, session buffer, waiter collection, or workflow state. It does not enqueue, inject, wake, relay, redeliver, register a waiter, or acknowledge delivery.
- Repeating the same lookup is permitted only as a proof of non-consumption or when the workflow owner already has separate authority to observe the same operation. The operation itself grants no polling allowance.

The host lookup proves only native retention and binding. The workflow owner must still require `retained.from`, `retained.to`, `retained.replyTo`, relay disposition, current expected operation, token state, grammar, identity, phase, and authority before admission. A retired, foreign, or consumed token is rejected by the workflow owner even if host lookup can faithfully return historical traffic from the still-current invocation. Host code does not become the semantic token owner.

### Byte and metadata invariants

The retained value preserves:

- `body` exactly as it exists on the `IrcMessage` at the delivery seam; byte comparisons use direct UTF-8 encoding of that string;
- exact `id`, `from`, `to`, `replyTo`, and `ts` values;
- `wakeRelay` property presence separately from its value, including absent, explicitly `false`, and `true`;
- any erroneous report locator or semantic content unchanged.

The existing `executeSend` input trim remains outside this change. Neither retention nor callers reconstruct trimmed edges, normalize newlines, repair locators, or claim identity with bytes that the native seam did not return.

## Portable and OMP adoption

### Portable return contract

Update `.config/agents/references/agent-return/return.md` in its existing lifecycle, owner-directed-message, observed-return, and recovery sections:

- add **native retained-return lookup** as a distinct observation path available only when the loaded host adapter declares exact-owner/current-invocation, non-consuming support;
- require the caller to bind the still-pending expected sender, exact receiving owner, current authored token, and active invocation before lookup;
- require immediate mechanical transfer of either the current native return or the looked-up native return and exact body before decoding or semantic handling;
- preserve current-receipt copying as preferred and sufficient when `details.waited` exists;
- state that lookup success is observation, not delivery replay or admission, and that a miss/ambiguity leaves the expectation unresolved;
- preserve workflow-owned stale/consumed token, phase, identity, semantic admission, and consumption decisions;
- prohibit fallback to inbox reconstruction, events, JSONL, `sessionManager.getBranch()`, RPC `get_subagent_messages`, `history://`, `agent://`, rendered cards, `report_put`/`report_get`, guessed metadata, or cross-owner access.

The portable contract must stay host-neutral: it names the guarantee, not the OMP op spelling.

### OMP adapter

Update `.config/agents/harnesses/omp/agent-return.md` to bind the operation above and its availability rule:

- stock/public OMP `v18.1.21` and the currently installed `omp/18.1.21` remain explicitly unsupported for owner-bound late lookup;
- availability requires the current tool schema to advertise peer `op: "lookup"`, an exact current caller ID and attached session, and execution under the isolated candidate built from the pinned checkout; version text alone is insufficient;
- callers must not invoke or depend on `lookup` when those conditions are absent;
- `details.waited` remains the immediate path; `details.retained` from `lookup` is the only selected post-collector OMP path;
- a lookup miss/ambiguity, stale native invocation, wrong owner, unavailable op, stripped token, or incomplete envelope blocks; no inbox/transcript/backend substitution follows;
- five-minute supervision continues through the existing outside owner using process state and log cursor. It does not call lookup periodically, drain inbox, register a waiter, stop on silence, or modify the operation.

The adapter becomes authoritative for this capability only on the qualified isolated candidate. Updating documentation does not activate the operation on the current global executable.

### Affected callers and projections

Cleanly update these active consumers:

1. `.config/agents/skills/reconcile/SKILL.md`
   - preflight requires the adapter's owner-bound lookup capability before starting a report operation that requires interruption-safe retention;
   - preserve immediate copying of `details.waited`;
   - replace the one post-interruption inbox-admission path with one owner-bound lookup of the existing pending `(child, controller, token)` expectation;
   - lookup return is retained before grammar handling, then goes through all existing native, duplicate, current-token, role/pass/candidate, allowance, and semantic checks;
   - a miss leaves the exact frontier unresolved and grants no redispatch, re-emission, new collector, nudge, or allowance;
   - preserve external five-minute observation and exact owner cleanup.
2. `.config/agents/skills/reconcile/references/execution-flow.md`
   - project the same capability gate, current-receipt-first order, owner-bound lookup, failure split, and unchanged supervision without making the map runtime authority.
3. `.config/agents/skills/reconcile/references/reviewer-protocol.md`
   - state only the receiver-side guarantee and unchanged producer obligation. Reviewers still send exactly one complete IRC report plus the existing ignored local echo and remain write-less.
4. `.config/agents/skills/retrace/SKILL.md`
   - apply the same capability gate and current-receipt-first/lookup-second sequence to parent-scope and scope-reviewer returns;
   - bind every lookup to the actual current nested owner, never the outer parent;
   - retain all current semantic identity, freshness, correction, and cleanup rules.
5. `.config/agents/harnesses/omp/agents/second-opinion-a.md` and `second-opinion-b.md`
   - keep tools, role, isolation, and write-less behavior unchanged. At most clarify that receiver-side native retention requires no reviewer write or second send; do not teach reviewers to call lookup.
6. `.config/agents/skills/reconcile/evals/evals.json`
   - revise the existing `REC-IRC-REPORT-TRANSPORT` and `REC-RETAINED-CURRENT-REPORT` cases rather than add overlapping cases. Cover capability unavailable, current waiter receipt, post-interruption lookup, owner/invocation mismatch, stale/consumed token, capture-failure split, non-consuming observation, and unchanged five-minute supervision.
7. `.config/agents/skills/retrace/evals/evals.json`
   - revise `RETRACE-DELEGATED-REVIEW` to cover nested-owner lookup and outer-parent rejection while preserving all current semantic and lifecycle assertions.

No generic router, ADR, Reconcile response grammar, Retrace return-body grammar, reviewer tool list, decoder, inbox implementation, IRC event surface, JSONL/RPC API, report store, or global bootstrap/install target changes.

## Effects, migration, compatibility, and rollback

### Permitted effects

- create the isolated host checkout at `/Users/kim/dev/oh-my-pi-transport-capture-18.1.21` pinned to the stated commit;
- change only the named host source/tests in that checkout;
- build an isolated candidate executable inside that checkout for later authorized proof;
- update only the named dotfiles portable contract, OMP adapter, caller/projection, reviewer-adapter clarification if needed, and existing focused eval registries;
- create bounded session-local proof inputs/evidence after the separate native-run gate.

### Host target set

Expected host implementation targets are:

- `packages/coding-agent/src/irc/bus.ts` — retention owner, ordering, lookup, lifetime, deterministic failure seam;
- `packages/coding-agent/src/tools/hub/index.ts` — public schema, dispatch, capability exposure, argument rejection;
- `packages/coding-agent/src/tools/hub/messaging.ts` — owner-derived lookup result;
- `packages/coding-agent/src/tools/hub/types.ts` — `HubOp` and exact result details;
- `packages/coding-agent/src/prompts/tools/hub.md` — model-facing operation semantics and prohibitions;
- `packages/coding-agent/test/tools/irc.test.ts` — extend the closest stable public-seam test file.

`session/irc-bridge.ts` is an inspected dependency, not an expected write: pre-routing retention makes its reconstructed inbox metadata irrelevant to lookup. A newly demonstrated need to mutate it is a material target change and returns to specification/route authority.

### Cutover order

1. Host implementation lands and passes focused host behavior checks in the isolated checkout.
2. Portable contract, OMP adapter, callers, projections, and existing focused evals adopt the exact interface. Until this complete dependent cutover lands, the host surface is not workflow authority.
3. The assembled host plus dependent contracts remains conditional and unavailable on the current global executable. Only the pinned isolated build may enter the separately approved native proof.
4. After the native proof and standard review/verification settle, any global installation, restart, upstream contribution, commit, push, or release remains separately authorized and out of scope.

There is no compatibility alias. Active callers use current native receipt first and the single new lookup when eligible; they do not preserve the old inbox-as-late-report path.

### Rollback

Before any global activation, rollback is local and clean: stop using and remove the isolated candidate checkout/build and revert the dotfiles candidate delta together. Do not leave caller prose that requires an unavailable lookup, and do not leave the host op presented as authoritative without its callers.

If native proof fails or is inconclusive, preserve evidence, keep the installed executable unchanged, and return the exact failed invariant to the implementation/specification authority. Do not activate a partial surface, weaken admission, add a fallback store, or resume an old run.

## Acceptance

The focused host tests are permanent because they defend externally observable routing, isolation, and fail-closed behavior against plausible regressions in one existing test file. Existing `irc.test.ts` is the closest coverage and is extended rather than creating another file. Caller semantic cases stay in their existing eval entries. Structural inspection proves only contract shape and ownership; the native scenario is reserved for actual built-runtime integration and is not replaced by source assertions or simulated model output.

### AC-HOST-ORDER

Behavior: Every otherwise-routable direct message commits to the receiving invocation's bus-owned retention before either a matching waiter resolves or `deliverIrcMessage` begins, and each branch still delivers exactly once.
Check: In `/Users/kim/dev/oh-my-pi-transport-capture-18.1.21`, run `bun test packages/coding-agent/test/tools/irc.test.ts`; expect the extended waiter and live-session cases to observe retention before their route callback, one waiter result or one session delivery respectively, and no mailbox or duplicate delivery.

### AC-HOST-FAIL-CLOSED

Behavior: A pre-routing retention failure yields failed delivery and no success side effect in either delivery branch, while a later owner-copy failure preserves successful native delivery history and blocks only workflow admission.
Check: Run `bun test packages/coding-agent/test/tools/irc.test.ts`; expect deterministic retention-failure cases for waiter and session branches to report failed receipt with waiter unresolved until test cleanup, zero session delivery, zero UI relay, and no successful-send update, while the focused caller evaluation's owner-copy branch reports successful native delivery plus blocked admission without relabeling it.

### AC-NATIVE-FIDELITY

Behavior: Lookup returns the original retained body bytes and native `id`, `from`, `to`, `replyTo`, `ts`, and exact `wakeRelay` presence/value without reconstruction.
Check: Run `bun test packages/coding-agent/test/tools/irc.test.ts`; expect direct UTF-8 byte equality for a representative Unicode/newline/quote body, exact scalar metadata, and distinct passing assertions for absent, explicitly false, and true `wakeRelay`.

### AC-OWNER-ISOLATION

Behavior: Only the exact receiving owner in the same attached native invocation can access a retained message; nested owners do not leak to parents or siblings, and a replaced invocation with the same agent ID cannot access the prior invocation's retention.
Check: Run `bun test packages/coding-agent/test/tools/irc.test.ts`; expect same-owner lookup found, outer-parent and sibling lookup rejected, same-ID replacement-session lookup rejected, and no retained envelope in any rejected result.

### AC-LOOKUP-NONCONSUMING

Behavior: Exact `(current owner invocation, from, replyTo)` lookup is non-consuming and does not alter delivery, mailbox, waiter, session, or semantic state; zero or multiple matches fail closed.
Check: Run `bun test packages/coding-agent/test/tools/irc.test.ts`; expect two consecutive valid lookups to return the same message ID and body, unchanged delivery counts and bus queues, a miss with no `retained`, and duplicate-token ambiguity with no selected envelope.

### AC-PUBLIC-SHAPE

Behavior: `hub op:"lookup"` exposes only owner-derived exact-invocation lookup with required `from` and `replyTo`, returns the specified structured details, and rejects incompatible arguments.
Check: Run `bun test packages/coding-agent/test/tools/irc.test.ts`; expect a found result exactly under `details.retained`, `details.op === "lookup"`, `details.from` equal to the calling owner, no caller-supplied owner field, and error results for missing filters, incompatible fields, unavailable messaging identity, miss, and ambiguity.

### AC-CURRENT-RECEIPT

Behavior: A present `details.waited` remains the immediate authoritative native observation and is mechanically retained with its exact body before decoding; lookup is not redundantly required and delivery alone remains insufficient.
Check: Directly inspect `.config/agents/references/agent-return/return.md`, `.config/agents/harnesses/omp/agent-return.md`, Reconcile `SKILL.md`, and Retrace `SKILL.md`, then run the revised `REC-RETAINED-CURRENT-REPORT` focused evaluation; expect current-receipt-first ordering, exact object/body transfer, no lookup when `waited` is present, and no admission from receipt-only success.

### AC-POST-INTERRUPTION

Behavior: After collector or owner-turn interruption but before semantic handling, the same still-current receiving owner can recover one retained native return by exact sender/token lookup and then applies every existing provenance and semantic check.
Check: Run the revised Reconcile `REC-RETAINED-CURRENT-REPORT` and Retrace `RETRACE-DELEGATED-REVIEW` focused evaluations; expect Main and nested-owner success only for their own current invocation and token, with grammar/identity/phase admission after retention, while outer-parent, foreign, stale, consumed-token, automatic-relay, miss, and ambiguity branches remain unadmitted.

### AC-CAPABILITY-CUTOVER

Behavior: Portable guidance is host-neutral, OMP advertises the exact conditional capability, all affected callers fail closed when it is unavailable, reviewers remain write-less, and no excluded retrieval path becomes authoritative.
Check: Directly inspect the complete changed dotfiles target set and parse both changed eval registries with `python3 -B -c 'import json,sys; [json.load(open(p, encoding="utf-8")) for p in sys.argv[1:]]' .config/agents/skills/reconcile/evals/evals.json .config/agents/skills/retrace/evals/evals.json`; expect one coherent `lookup` contract, stock/current v18.1.21 marked unsupported, conditional caller preflight, unchanged reviewer tools/one-send behavior, and no admission through inbox, events, JSONL, getBranch, RPC messages, history, agent output, rendered cards, report_put/report_get, guessed metadata, or cross-owner access.

### AC-SUPERVISION

Behavior: The existing external owner observes the same collector, operation, process state, and log cursor every five minutes without touching inbox, lookup, waiters, actors, or process state; silence and repeated unchanged observations do not prove progress or authorize termination.
Check: After the native gate below, the owning `PortableReturnCutoverAndProofAssembly` child runs the revised `REC-IRC-REPORT-TRANSPORT` focused evaluation and the first approved native portfolio before its Handoff; after the one review, the independent verifier repeats the same fixed check in the second approved portfolio; expect each execution to distinguish activity, protocol progress, suspected stall, demonstrated machinery failure, and human cap, with one unchanged observation at or after five minutes causing no stop, signal, retry, redispatch, replacement, lookup poll, inbox drain, or allowance change.

### AC-NATIVE-ASSEMBLED

Behavior: The isolated assembled candidate performs waiter capture and late injection capture through the actual compiled OMP hub/bus/session path, survives collector interruption before semantic handling, preserves the native data assigned to the end-to-end fixture, enforces owner/invocation isolation, and supports non-consuming lookup without double delivery.
Check: After explicit human approval of the exact candidate, driver, provider/model effects, and native bounds below, the owning `PortableReturnCutoverAndProofAssembly` child runs `OMP_CAPTURE_BIN=/Users/kim/dev/oh-my-pi-transport-capture-18.1.21/packages/coding-agent/dist/omp OMP_CAPTURE_PROVIDER='<approved-provider>' OMP_CAPTURE_MODEL='<approved-model>' bun /Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-14T17-18-07-672Z_01a0a0ed-1738-7456-9eb3-049995d37206/local/transport-capture-supervision-native-proof.ts --observation-min-ms 300000` once in a fresh proof root before its Handoff, with the placeholders replaced by the approved exact pair; after the one review, the independent verifier repeats that same command once in another fresh proof root against the byte-identical candidate and driver; expect each portfolio to emit one complete machine-readable observation record satisfying every stated bound and invariant, exit zero after scenario completion, and leave `/Users/kim/.local/bin/omp` identity unchanged. Missing, contradictory, setup-only, too-early observation, process-exit evidence, or identity drift is inconclusive, never a pass.

## Native proof gate and exact proposed bounds

No native scenario is authorized by this specification. After both implementation boundaries have fixed the candidate and the `PortableReturnCutoverAndProofAssembly` child has created the proof driver, but before that child executes its first native check or returns an accepted Handoff, Main must obtain explicit human approval binding the candidate digest, proof-driver digest, one exact provider/model pair, its account/effect context, and these two fresh native portfolios:

- portfolio 1 is owned and executed by the `PortableReturnCutoverAndProofAssembly` child before its Handoff; portfolio 2 is the independent verifier's repeat of the same fixed checks after the one review;
- each portfolio uses one primary fresh session root driven through the same candidate's supported RPC mode, plus one second fresh candidate process used only for the stale-invocation negative check; neither process uses, replaces, or restarts `/Users/kim/.local/bin/omp`;
- each portfolio performs exactly one waiter-matched report publication and one no-waiter live-session report publication in the primary process, using distinct current authored tokens and a body with representative internal newline, Unicode, and quotes;
- each portfolio performs exactly one controlled collector/owner-turn interruption after the no-waiter delivery and before semantic handling, two same-owner lookups of that retained message, and one wrong-owner lookup;
- in each portfolio, after its first operation is terminal and its primary process has exited, exactly one lookup for its retired token runs from that portfolio's second fresh process under the logical `Main` owner. This negative fixture may prove process/invocation isolation only: it must not replace an actor, continue or admit the old report, resume the old operation, or receive another report;
- each portfolio records native end-to-end observations for the metadata expressible through its two real publications; focused host tests remain the direct proof for all three `wakeRelay` presence/value states and exact UTF-8/metadata fidelity;
- each portfolio records process state and log cursor once when the same primary operation is pending and once at the first scheduled observation whose monotonic elapsed time is at least 300,000 ms. Scheduler delay is recorded, not failed; there is no exact-millisecond assertion or production/proof wall-clock ceiling;
- neither portfolio drains inbox, replaces a waiter after dispatch, polls lookup, uses JSONL/getBranch/RPC-message/history/agent-output for admission, replays, redispatches, requests re-emission, replaces an actor, changes model/configuration limits, continues an old run, installs globally, or restarts globally;
- two native portfolios total are authorized: the implementation child's first execution and the verifier's independent repeat. Any additional portfolio, changed publication/lookup count, changed provider/model/account effect, different executable or driver identity, or execution-recovery rerun requires renewed human approval. Focused deterministic host tests and write-less driver review are not native portfolios.

The proof driver is created before the first native portfolio at the exact absolute path named in AC-NATIVE-ASSEMBLED. The native approval binds its SHA-256 and the candidate digest. The owning `PortableReturnCutoverAndProofAssembly` child retains that driver byte-identically through its Handoff, the one review, and independent verification; the implementation and verifier observations must both record the same digest. The driver imports the pinned checkout's `RpcClient`, constructs it with `command: [OMP_CAPTURE_BIN]`, and thereby uses the client's supported `--mode rpc` launch of the compiled binary. The exact public build mechanism is `bun --cwd=packages/coding-agent run build`, which produces `packages/coding-agent/dist/omp`. The driver may use RPC prompt, steering/abort, lifecycle, and raw message/tool-result frames to operate and externally observe the candidate, but neither production workflow nor proof admission may use `get_subagent_messages`, `getBranch`, or reconstructed transcript content. Native `hub` results inside the candidate remain the report observation/admission input; RPC frames are the independent proof observer only. After verification has recorded its result and driver digest, the original `PortableReturnCutoverAndProofAssembly` child alone removes the session-local driver and returns direct cleanup evidence to the implementation controller; Main schedules that return but does not delete the file, and neither reviewer nor verifier mutates it. Events may establish timing and process activity but cannot establish retention commitment or semantic admission.

## Test seams

- Extend the existing `packages/coding-agent/test/tools/irc.test.ts`; do not create another permanent host test file. It already constructs `IrcBus`, fake/real sessions, waiters, HubTool, interruption, inbox, relay, and lifecycle cases.
- Keep a file-local, bus-lifetime retention interface only because deterministic pre-routing failure must be executable. Inject it through the existing `IrcBus` constructor; production receives the default weak-key implementation. Do not create another source file, global registry, timer, public storage API, test flag, or independent cleanup path.
- Test through `IrcBus.send`/lookup and `HubTool.execute`, not private-field text or source wording. The independent oracle is captured callback order, exact input bytes/metadata, queue/delivery counts, and current registry/session identity.
- Merge new assertions into the closest current tests for waiter consumption, live delivery, interruption, and HubTool round-trip. Keep separate cases only for incompatible starting conditions: waiter vs live-session fail-closed failure, and current vs replaced invocation.
- Existing focused workflow evals are revised, not duplicated. They prove instruction/contract decisions only and cannot substitute for native host behavior.

## Implementation boundaries and dependencies

A lean dependency plan is required because the work crosses an external host checkout and repository-owned portable/caller contracts, has an ordered conditional cutover, needs an assembled proof boundary, and must preserve recovery across contexts. Keep coupled host source and its stable test in one task; splitting bus storage, waiter invocation binding, hub API, and host test would create an unusable partial surface. Keep the portable contract, adapter, all caller projections, reviewer clarifications, focused eval changes, proof-driver assembly, and first approved native portfolio in one dependent task so no active contract selects a half-cut-over authority. A third proof-only implementation ticket would be assurance scaffolding and is prohibited.

Ticketing should project these two boundaries without adding assurance tasks and should assign every acceptance item exactly once:

1. **HostTransportCapture** — create/pin the isolated checkout; implement bus-owned retention, waiter-bound invocation identity, fail-closed ordering, exact hub lookup, prompt/type/schema updates, focused host tests, and the scoped candidate build. Own `AC-HOST-ORDER`, `AC-NATIVE-FIDELITY`, `AC-OWNER-ISOLATION`, `AC-LOOKUP-NONCONSUMING`, and `AC-PUBLIC-SHAPE`. Targets are the six named host files. Receiver: `dev-implementation` controller.
2. **PortableReturnCutoverAndProofAssembly** — depends on HostTransportCapture's exact interface Handoff; update the portable contract, OMP adapter, Reconcile, Retrace, reviewer protocol/adapters only where affected, execution-flow projection, and the two existing eval registries; create the exact session-local RPC proof driver and record its SHA-256; obtain the separate human native approval through Main; execute the first fixed native portfolio; and retain the driver byte-identically. Own `AC-HOST-FAIL-CLOSED`, `AC-CURRENT-RECEIPT`, `AC-POST-INTERRUPTION`, `AC-CAPABILITY-CUTOVER`, `AC-SUPERVISION`, and `AC-NATIVE-ASSEMBLED`. Its cross-surface fail-closed check runs only after T1's host Handoff and this task's caller projection both exist. Receiver: `dev-implementation` controller, which accepts the Handoff only after every owned check records its expected result and then hands the complete changed target to the route's one `dev-code-review`.

Final standard assurance operates on the completely assembled target: one review over every changed file plus the retained proof driver, then one independent verifier repeats the complete fixed acceptance set, including the second native portfolio already covered by the same exact approval, then one learning assessment. Reviewers do not run native proof or write repairs. `dev-verification` is the receiver after review; `dev-continual-learning` is the receiver after successful verification; Main receives the terminal result. After verifier evidence is fixed, Main revives the original `PortableReturnCutoverAndProofAssembly` child only to perform its already-owned driver cleanup and return direct cleanup evidence. Any candidate or driver change after the gate invalidates the bound native approval and stops before another native execution until refreshed explicit approval; it never silently consumes a third portfolio. Scheduling, plan lifecycle, task IDs, checkboxes, and completion state remain `dev-ticketing`/`dev-implementation` concerns.

## Risks, assumptions, stops, and open decisions

### Material risks

- Invocation identity uses the exact production `ToolSession`/`AgentSession` object: the matching-waiter branch captures it at wait registration because the qualified bus can resolve a waiter without an attached session, while the no-waiter branch uses the exact attached session. A dispose/revive boundary rejects old retention rather than guessing continuity.
- Retaining every routable direct message for an invocation increases live-process memory. No numeric cap or TTL is invented because silent eviction would violate the confirmed guarantee; weak invocation ownership bounds retention to session lifetime.
- Public tag source and installed binary may differ. Only the isolated pinned checkout is an implementation lineage, and only native proof can establish its assembled behavior.
- A successful host lookup can return a semantically stale token from the same current invocation. That is expected faithful transport; the workflow owner must reject it before admission.

### Stops

Stop and preserve completed independent work if any of these occurs:

- the pinned commit cannot be obtained or the isolated checkout is not exact;
- the bus cannot bind a matching waiter to its exact registration-time owner invocation or derive an exact attached invocation for the no-waiter branch;
- lookup requires caller-claimed owner/invocation identity or cross-owner access;
- fail-closed commit cannot be tested through the file-local bus-owned retention interface without adding a production backdoor, separate registry, or alternate store;
- a required production change reaches `session/irc-bridge.ts`, inbox/RPC/history/JSONL, global install/restart, reviewer write tools, report grammar, semantic allowances, or another undeclared target/effect;
- portable and OMP callers cannot cut over coherently to the exact host interface;
- native-run approval is absent, changed, or exhausted;
- proof is inconclusive, the exact required owner is lost, or the candidate source/runtime identity drifts.

### Candidate blockers and gates

There is no unresolved prerequisite to specification or ticketing. Absence of a current clean local v18.1.21 checkout is resolved as an explicit downstream isolated-checkout effect, not by substituting either dirty older tree.

One human gate remains before the implementation child's first native execution: explicit approval of both fixed candidate and proof-driver digests, exact provider/model/account-effect context, and the two bounded portfolios and prohibitions in **Native proof gate and exact proposed bounds**. That same approval covers only the implementation child's first portfolio and the independent verifier's byte-identical repeat. No native proof, global activation, installation, restart, shipping, or old-run continuation is authorized before or by this specification.

No technical product/architecture decision remains open inside the confirmed mechanism. Revision `spec-v4` preserves the single same-author planning rethink and human-authorized lifecycle correction, and normalizes only the two direct-check delimiters required for exact ticket projection. It is final for handoff to `dev-ticketing`.
