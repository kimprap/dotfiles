---
name: reconcile
description: >
  Converge one exact proposal or artifact through two persistent read-only
  reviewers before one controlled mutation. Use only when explicitly invoked
  to reconcile a named or latest substantive proposal before presenting it.
disable-model-invocation: true
---

# Reconcile

Bind the exact invoking controller from native identity: direct human use binds
the real top-level Main; delegated use binds the actual scope child, never its
outer Retrace parent. Keep that controller as the sole canonical-candidate owner,
mutator, validator, liveness detector, ephemeral recorder, and presenter. Before
any reviewer dispatch, read and follow
[the reviewer protocol](references/reviewer-protocol.md) completely; together
this file and that protocol are the only executable Reconcile semantic owners.

[`references/execution-flow.md`](references/execution-flow.md) is a
non-normative human maintenance map. Maintainers may open it only while changing
or diagnosing Reconcile's controller loop. Invocation, preflight, approval, and
live execution never load, hash, send, or interpret it; a mismatch is an
edit-time documentation defect, and the two executable owners win.

Portable declared bodies, lifecycle distinctions, native-provenance
obligations, extraction boundaries, and observed-return retention live in
[agent-return](../../references/agent-return/return.md); they own no Reconcile
pass, admission, or correction budget. On OMP, load the
[OMP agent-return adapter](../../harnesses/omp/agent-return.md) with it before
transport preflight. The adapter owns native envelope, collector,
addressability, supervision, and disposal facts, not Reconcile semantics.

### Explicit execution-recovery adoption

Reconcile explicitly adopts the sole generic
[execution-recovery policy](../dev-implementation/references/execution-recovery.md)
for its approved active-session invocation, setup, transport, collection,
capture, and task-local execution machinery. The actual controller remains
responsible for its machinery; a delegated scope child remains owner of its
reviewers. This reusable skill-level adoption is known before launch but is not
retroactive authority for an existing, paused, stopped, or historical run.

Normal use of an already-supported observation path for the same pending
operation is continuation. Correcting a failed mechanism follows the generic
policy. Reviewer return correction, verdicts, semantic pause/continuation, and
cleanup remain owned here. Neither path authorizes another review request,
child-work replay, report re-emission, required-reviewer replacement, allowance
reset, durable workflow state, or restart.

## Preflight and approval

The inline trusted-caller allowlist is exactly `retrace`. Direct human entry
uses the inference and binding gate below, retaining both modes. Delegated entry
requires a plain-text `begin-reconcile` from the actual bound outer parent to the
current scope child, with these labeled fields and receiver-readable locators:

- `Caller`: exactly `retrace`.
- `Parent`: exact outer Retrace parent, verified against native task/message provenance.
- `Controller`: exact current scope-child identity invoking Reconcile.
- `Scope`: stable approved scope ID.
- `Scope approval`: `scope-approval@sha256:{digest}` and locator for the frozen
  complete approved two-column table plus human objectives, protected behavior,
  and exclusions; retain exact bytes and human approval provenance request-locally.
- `Scope contract`: `scope-contract@sha256:{digest}` and locator for the exact
  objective, evaluand, protected behavior, exclusions, prerequisite inputs, and
  evidence boundary of this scope.
- `Candidate`: `conversation@sha256:{digest}` and complete conversational report
  bytes or their receiver-readable locator.
- `Evidence manifest`: `evidence-manifest@sha256:{digest}` and locator for the
  exact observations supporting this candidate.
- `Mode`: exactly `Conversation replacement`.
- `Authorization`: `candidate-ready@sha256:{digest}` of the previously admitted
  complete `candidate-ready` body for this exact scope child and candidate.

For each content record the producing owner freezes the complete UTF-8 bytes
before first dispatch, retains them request-locally, and supplies an
identity-bound receiver-readable locator. Every receiver re-reads and hashes
those exact bytes before admission. Digests are lowercase SHA-256; never
reconstruct, implicitly concatenate, normalize newlines, or hash tool anchors.
Neither the return token nor any native message ID belongs in the
`candidate-ready` body or Authorization digest. Native parent-origin is checked
against task/message provenance, not asserted by another body field.

Admit only when all fields, frozen identities, approved scope/contract, native
parent/current-controller bindings, current phase, and the exact previously
admitted candidate-ready authorization match. Reject missing, stale, consumed,
replayed, foreign, or unsupported delegation before reviewer dispatch. A quoted
caller label, token alone, ordinary output, or automatic wake relay grants no
authority. Never fall back to artifact mode. Independently explicit human entry
still uses its own direct binding gate, not a rejected delegated packet.

Delegation authorizes correction only of this scope's conversational report.
Reject artifact mode and changes to repository files, evidence, objective or
evaluand, protected behavior or exclusions, or another scope's report. Apply
this boundary to reviewer Corrections, application, and repair, not just intake.
Recommendations for later repository changes grant no permission to execute
them. Return an out-of-authority needed change as the exact frontier to the
scope owner/human. Carry the complete delegated authorization context in reviewer
packets outside, never inside or in place of, the unchanged six-field lineage.

Complete all remaining preflight and execution checks below. A fully admitted
delegation skips only the redundant Reconcile brief and approval (step 4);
steps 1–3 still establish capabilities, original/candidate/context, and authority.
In step 2 delegated entry uses its exact bound report, not direct inference.
References to approval below mean this validated scope authority for delegation.
Direct entry completes preflight before rendering a brief, spawning a child,
reviewing, or mutating:

1. Establish two configured distinct enabled host-provided persistent read-only
   role bindings, logical A and B, and documented native capabilities:
   allocation distinct from launch settlement and registered addressability;
   retained child identities under this exact owner; same-child normal prompt
   follow-up and `skill://rethink` load; owner-directed reports with native
   sender, recipient, preserved authored token, relay discrimination, and
   original current native return; one-way context delivery; readable shared
   context; and exact-owned silent disposal while the controller continues.
   This is static preflight: require no preapproval spawn or actual-pair proof.
   Establish launch settlement, actual registered child bindings, and correlated
   readiness after approval, then same-child rethink, context delivery, and
   disposal at their respective operations. Semantic readiness remains separate
   from allocation, launch settlement, and addressability.
   On OMP, follow the loaded adapter for the awaited native envelope,
   `timeoutMs: 0` limits, launch-handle wait form, roster ownership/addressability,
   external supervision, and exact disposal. Before any indefinite report
   collector or counterpart parking wait, require an existing time/abort owner
   outside the blocked invocation that can observe the concrete operation,
   process state, and log cursor every five minutes and interrupt the exact
   operation when allowed; an Eval timeout alone is insufficient. Missing
   external supervision, native provenance, token-preserving delivery,
   registered addressability, or silent cleanup blocks. Do not patch the host,
   change response grammar, substitute a channel, require native request IDs,
   emulate two roles with one child, replace a lost child, or weaken a seam.
   Keep every complete original observation the controller already must obtain in
   a distinct invocation-local slot: each reviewer's launch settlement,
   pre-readiness roster binding, each readiness/review return keyed by operation
   and phase, and exact disposal. Preserve those slots across later sends through
   final assembly and cleanup; never substitute a later snapshot or equal
   identity for an earlier kind or phase. This adds no persistent state or
   transport surface.
   If an authorized proof requires export, bind this controller, the exact slot
   set, and session-local destinations in the approved run contract before
   reviewer launch. For delegated proof, root instructions, scope contract,
   reviewer launch binding, and operative requests must agree. Do not retrofit
   proof export in a review request or response, and add no default report field.
2. Infer the candidate in this order: an explicitly named proposal or artifact;
   otherwise the latest substantive assistant decision or proposal; otherwise
   `unresolved`. Bind exact UTF-8 proposal bytes as
   `conversation@sha256:{exact-content-digest}` and exact artifact bytes as
   `{exact-readable-locator}@sha256:{exact-file-digest}`. Digests are lowercase
   SHA-256. Supply bounded exact content or a child-readable locator, never an
   opaque cross-session reference.
3. Preserve the immutable run-original content and identity. Establish readable
   candidate bytes and essential review authority, scope, targets, mode and
   mutation capability. Classify missing inputs by their role, not merely by
   whether a locator appears in the candidate: unreadable candidate bytes or
   missing sole-source review authority block. Missing future implementation or
   proof assets whose requirements are independently specified are review
   findings or later proof blockers, not preflight blockers. Optional historical
   provenance is unavailable context. Do not recursively require future proof
   assets, invent missing bytes, or weaken implementation acceptance.
   The optional application cap is exactly `none` by default or a positive
   integer; zero, a negative number, another scalar, and an ambiguous value are
   invalid.
4. Render exactly one binding gate. Read and follow
   [packed-label](../../references/packed-label.md). This skill owns only the
   field map below.

```markdown
## Reconcile brief

**Goal**

- {one-sentence review job}

**Candidate**

- {exact identity}

**Context**

- {approved intent, constraints, exclusions, and decision-bearing references}

**Mode**

- {Conversation replacement | Artifact edits only}

**Maximum controller-applied outer iterations**

- {none | positive integer}

Reply **approve** to start, or **approve — {adjustments}**.
```

Goal is the review job only and must not restate Context. Candidate is the exact
identity; an optional short name may be a second child. Context holds intent,
constraints, exclusions, and decision-bearing references as separate children
and must not restate Goal. Mode is exactly `Conversation replacement` or
`Artifact edits only` and must not repeat Candidate. The maximum field binds
committed changed canonical applications, not reviewer turns.

For an unresolved candidate, render the Candidate child as
`unresolved — name one proposal or artifact` and wait; approval alone cannot
dispatch it. Plain `approve` starts the displayed binding. An unambiguous
`approve — {adjustments}` updates that binding and starts without another gate.
A correction without approval or a conflicting or ambiguous adjustment renders
one revised brief and waits. Approval is local to the displayed binding and
grants no other authority or effect.

## Ephemeral state and identities

Keep only the following fresh run state; never persist a counter, ledger,
reviewer state object, or hidden protocol state:

- immutable run original content and identity;
- current canonical candidate content or artifact identity;
- outer-iteration index;
- immutable outer base content and identity for the current iteration;
- complete working proposal, exact identity, and origin (`outer-base` or one
  finalized reviewer Correction);
- bounded lineage for the working proposal;
- the two persistent A/B child identities and each child's
  first-actual-review-completed flag;
- distinct original native observation slots for each child's launch settlement,
  pre-readiness roster binding, every readiness/review return keyed by operation
  and phase, and exact disposal evidence;
- each original pending return's bound child/controller, expected role/pass/
  candidate, current controller-authored correlation token, consumed/pending status,
  and nonresetting correction-used flag;
- the exact unresolved transport frontier when an expected observation is
  missing, without backfilling it from working state or a later object;
- committed changed-application count, bound cap, and whether the current outer
  iteration is the one closure-only iteration;
- terminal finalized response, counterpart context-sync delivery receipt, and
  identity-safe repair state when present;
- seen working-identity/reviewer pairs and unresolved frontiers; and
- a full event trace with monotonically increasing `Step` values.

Bounded lineage contains exactly these six fields: outer iteration, outer-base
identity, parent proposal identity, author reviewer, author pass, and source
finalized-response digest. At outer initialization, parent proposal identity is
the outer-base identity and author reviewer, author pass, and source response
are `none`. A changed working proposal records the prior working identity as its
parent and hashes the exact complete finalized response. Do not create or send a
separate semantic response-history ledger; the required complete original native
observation slots remain intact through assembly and cleanup.

A conversation working identity is the lowercase SHA-256 of its exact complete
UTF-8 replacement. An unchanged artifact working identity is the canonical
artifact identity. A changed artifact working identity binds the immutable
outer-base identity and the exact complete bounded edit set with a lowercase
SHA-256; retain the exact serialization used for that digest until the outer
iteration ends. Identity equality, not paraphrase or intent, governs freshness.

Every review-turn packet carries the approved goal, intent, constraints and
exclusions; exact mode; complete current working proposal or exact readable
artifact base plus complete current edit set; current working identity and the
six lineage fields; decision-bearing readable context; this protocol's exact
locator and digest; expected reviewer and pass; the invoking controller identity; and
the authoritative IRC-send seam and a controller-authored correlation token to copy
unchanged into `replyTo`. It carries the immutable run-original identity
on every turn. It carries the full run-original content or approved readable
locator only on that child's first actual reviewing turn, or once more to
correct an otherwise resolvable `BLOCKED`. Large context may use native shared
artifact transport only when the intended child can read it.

## Retained reviewer lifecycle

After approval, allocate A and B as one retained pair before outer iteration
one. The launch packet binds only logical role, protocol locator/digest, and this
controller identity; it requests no readiness report or review. Include no
supplemental-skill loading recipe or path. Allocation does not establish launch
settlement or addressability. Let both launch-only turns settle locally,
concurrently where supported, using the host's supported handle-wait form, and
copy each complete original native settlement observation into that reviewer's
distinct launch-settlement slot before advancing. Then observe both exact child
IDs registered under this controller through the current native roster or
equivalent addressability evidence and copy each complete original observation
into its separate pre-readiness roster-binding slot before any readiness send.
If either original launch settlement or exact binding is unavailable, leave that
slot unresolved and stop without dispatch, reconstruction, later-snapshot
substitution, or replacement. Send each child its separate bootstrap readiness
request with a fresh controller-authored correlation token; distinct owner-child
requests may run concurrently. Launch output and completion supply no readiness
authority, and roster addressability supplies no semantic readiness. Admit both
role-bound readiness reports through the return seam below before outer one.
Bootstrap adds no review or rethink. Both children remain read-only, persistent,
and required for the run; never replace a lost child.

On each child's first actual reviewing turn, even if it occurs in a later outer
iteration:

1. Send that child the full run original or approved readable locator and the
   current review-turn packet with pass `initial`. Include no supplemental-skill
   loading recipe or path.
2. Collect its complete provisional response through the current request's
   owner-directed IRC report, using the correlation and text admission below.
   The expired bootstrap job is irrelevant. Trace the admitted response as
   provisional and superseded by its eventual finalized response.
   It cannot change working state or terminate negotiation.
3. After admitting that complete initial result, send the same child one
   follow-up that explicitly instructs it to load `skill://rethink` once,
   reassess its immediately preceding complete provisional response from first
   principles, and return one complete caller-owned finalized outer response
   with pass `post-rethink` for the same candidate identity. The follow-up
   states that the outer Reconcile contract supersedes `rethink`'s standalone
   wrapper and `reject`, `reuse`, `extend`, `test`, and `proceed` vocabulary.
   Do not infer this invocation from the pass label, a later request, a
   correction, or context-only synchronization. Collect that response only
   through the authoritative IRC send.
   The protocol requires one exact final local echo for inspectability; the controller
   ignores it completely and never awaits, parses, compares, records, or gates
   on it. No Submit Result is required.
4. Mark that child's first actual review complete only after admitting the
   finalized response.

Every later actual review uses pass `later`, sends no run-original bytes, and
never loads `rethink`. It returns one complete finalized response through IRC,
then one ignored exact local echo. A response-contract correction returns to the
same child and inherits the corrected response's pass, authority, and transport:
corrected `initial` uses correlated IRC and stays provisional; corrected
`post-rethink` or `later` uses correlated IRC and stays finalized. All have one
ignored exact local echo. Neither switches reviewer nor adds a rethink.
A `BLOCKED` response may receive already-approved readable original context
once through the same child; persistent `BLOCKED` stops.

For readiness and every review or correction, apply
[agent-return](../../references/agent-return/return.md) and the loaded OMP
adapter at the owner-directed message seam. Before sending, author a fresh
unique token (for example UUIDv4) and bind it to the exact child, this
controller, expected role/pass/candidate, and original return expectation.
Include `Reply token: {token}` in the request packet, never in the response
grammar. Never reuse a token, including for a correction or approved-context
resend.

On OMP, every expected readiness, review, correction, or approved-context
response uses its original owner-directed awaited send with exact `await: true`
and `timeoutMs: 0`. Keep at most one outstanding collector per owner/child;
distinct A and B operations may collect concurrently, so this rule does not
globally serialize independent children. Never reuse an outer scope-return token
for nested reviewer traffic or use standalone `hub wait` to collect a future
Reconcile report. Use the external supervision established at preflight. Zero
disables only the timer: terminal child events, unregistration, hard abort, or
caller cancellation may still settle and remove the collector. Neither finite
nor zero timeout guarantees eventual report observation.

Inspect the complete current native result for operation error,
requested-recipient delivery, `details` and `details.waited` presence, exact
owned-child sender, this actual receiving controller, current authored token,
and forbidden relay before body access. Delivery or outer success proves no
report. When `details.waited` exists, mechanically copy that complete original
object and its exact returned body into a new distinct slot keyed to the child,
request operation, semantic phase, and current token in the receiving
controller's invocation state before decoding or semantic work. Preserve that
slot and all earlier launch, roster, and return slots across later requests.

When `details.waited` is absent, the request slot remains unresolved and
unadmitted. Preserve its exact token, child/controller identities, phase,
candidate, delivery facts, used or unknown allowances, and all earlier filled
slots. Do not access a body, substitute a working draft or copied payload,
redispatch, replay, re-emit, create a new collector, inspect inbox, events,
JSONL, branch/session state, RPC messages, history or agent output, use a local
echo, external capture, ordinary completion used as an alternate report, later
snapshot or later native object, replace an actor, nudge for absence, or reset an
allowance. Terminal, unregistration, hard-abort, or caller-abort settlement
does not change this frontier. Matching child IDs or content hashes do not prove
the missing observation kind or phase.

After the current native object is copied, decode only its complete returned
body as `text`, then apply exact expected role, pass, candidate identity,
workflow grammar, authority, semantic, nudge-budget, and one-time
token-consumption checks. Any writable immutable snapshot hashes the exact
returned bytes directly and cannot replace native provenance. A correction
retires the rejected token and uses a fresh one without changing the original
expectation or resetting its spent allowance. Bootstrap-job expiry does not
affect a current request; do not recover mutable latest-agent output. Late
traffic on a retired or consumed token and further malformed,
changed-category, wrong-role/pass/candidate, duplicate, or wrong-channel
attempts do not satisfy the request and earn no additional nudge.

An unsolicited, foreign, stale-request or already-consumed report cannot satisfy
the current expectation. Leave an unrelated message pending outside admission;
do not nudge a foreign sender or redispatch the legitimate request. A malformed
report from the owned child claiming the current expectation (including wrong
role/pass/candidate) follows the one-nudge rule below. If an owned child sends a
misbound reply as its observed attempted current return, reject it and use only
that same allowance; never silently relabel a stale response. Missing required
native sender/recipient evidence, host rejection/stripping of the token, or an
actually unavailable channel stops for the transport blocker, not a content
nudge to recreate host facts or a fallback response field.

An ignored echo, automatic wake relay, ordinary task output, absent
`details.waited`, or absence of a report is not an observed invalid current
report: preserve the unresolved request without redispatch or nudge. No
completion metadata is a gate. A fully valid correlated current report is
admitted even if its producing turn subsequently fails or is cancelled; it
proves the report, not terminal turn success. Loss of the retained child still
triggers the independent lifecycle stop.

For each original expected bootstrap or review return, allow at most one
corrective nudge total across delivery, format, and identity failures evidenced
by an attempted current return. The corrected return remains part of that
original expectation: a changed error category, duplicate, or repeated invalid
response cannot reset the allowance. Missing `details.waited` or missing host
capability is not eligible. An observed wrong-channel attempt may receive the
operation-specific nudge only when native delivery evidence binds that attempt
to this expectation; absence of an IRC report or ignored local echo alone is
not such evidence. Recoverability depends on the approved run binding, retained
child, and required delivery channel remaining intact. A revoked or conflicting
approved binding, lost child, or actually unavailable required seam stops
immediately. Failure of a present returned message to satisfy its required
channel or response contract does not itself establish loss of that authority
or capability. With those prerequisites intact, correct the invalid return
under this allowance without admitting its payload. Establish a return failure
only from observed delivery facts for that expectation, never from its ignored
local echo.

For a correctable invalid return with its nudge unused, restate the concrete
violated requirement and prescribed operation or complete response shape. Ask
the same child, pass, and candidate where applicable for one complete compliant
return, not a fragment or silently relabeled stale output. Every correction
inherits the original expected pass's response transport from the protocol,
not the rejected return's channel. Author and send a fresh correction token,
retiring the old token without resetting the original allowance. Revalidate
delivery and the full contract, including reviewer, pass, and candidate identity.
A valid correction continues with its inherited authority; any further invalid return for that
expectation stops and cleans up, even if it fails a different requirement.
Never switch the bound child or required transport, add a review or rethink, unwrap, normalize,
deduplicate, or select a last block.

This allowance governs invalid expected returns only. Valid `REVISE` and
`BLOCKED` keep their existing handling, including the once-approved-context
correction; ignored echoes, context-only synchronization, and separately
authorized repairs remain outside this guard. None consumes a return-contract
nudge or replenishes one already spent for the same original expectation.

The return-contract nudge is distinct from the adopted generic machinery policy.
If the outer invocation of an already-authorized request, correction,
collection, synchronization, or validator fails for an eligible execution
cause, the responsible owner may correct that mechanism under the generic
policy without issuing another semantic request, changing the authored token or
review pass, refunding a nudge, or resetting either allowance. Supported
observation of the same pending operation is continuation. A valid `REVISE`,
`BLOCKED`, semantic stop, missing required owner/provenance, or exhausted nudge
cannot be relabeled as machinery failure to reopen the protocol.

Accept only the protocol's exact complete response for the expected reviewer,
pass, and current working identity. A duplicate, malformed, stale, mismatched,
or non-applicable response is not a verdict and authorizes no edit. The controller never
normalizes reviewer prose or invents a semantic correction.

## Outer iterations and negotiation

Start every outer iteration, including the closure-only iteration, with these
conceptual assignments in this order:

```text
outer base := canonical candidate
working proposal := outer base
working origin := outer-base
parent proposal identity := outer-base identity
author reviewer := none
author pass := none
source finalized-response digest := none
next reviewer := A
```

The outer base remains immutable throughout the iteration. In artifact mode the
initial working proposal is the unchanged artifact, never an empty or synthetic
patch. Every outer iteration starts with the already-live A, accepting the
documented A-first framing bias.

Process admitted finalized responses without changing the canonical candidate:

- `VALID` is pure acceptance of the exact current working identity. The first
  admitted finalized `VALID` from either reviewer ends inner negotiation.
  Ignore every `VALID` recommendation; neither editorial nor semantic advice is
  an edit. A change requires a new `REVISE` identity.
- Conversation `REVISE` must provide one complete replacement. A changed,
  directly applicable replacement completely supersedes ephemeral working
  state, records its bounded lineage, and goes to the existing counterpart.
- Artifact `REVISE` must provide one complete set of exact bounded edits against
  the immutable outer base. A changed, directly applicable set completely
  supersedes every earlier unapplied Correction; it is never layered on another
  unapplied patch. The canonical artifact remains unchanged until acceptance,
  synchronization, and application.
- `BLOCKED` authorizes no mutation. Apply only the one approved-context
  correction above; if it does not resolve the blocker, stop.

After each changed applicable finalized `REVISE`, add the prior working identity
as the lineage parent, replace the complete working proposal and origin, record
the new working identity/reviewer pair, and request the existing counterpart.
Alternate the same A and B children for as many genuinely progressive turns as
needed. There is no numeric inner-turn cap and no mutation during negotiation.

## Synchronization, application, and capacity

Before mutation, unchanged success presentation, or a capacity stop, send the
already-live reviewer who did not issue terminal `VALID` one context-only
packet under the protocol. It carries the complete terminal working proposal
or exact readable artifact base plus complete bounded edit set, its six-field
provenance, the complete terminal response, and the intended disposition. The
complete terminal response's existing `Candidate:` field is the packet's sole
dedicated current-candidate identity field. Copy it verbatim from the admitted
response; do not add another `Candidate:` or current-identity field, or
concatenate, correct, or supersede its value. Preserve every required
provenance role identity. On OMP, instruct the receiver that its sole next action
is the adapter's immediate no-prose controller-bound parking wait with
`timeoutMs: 0`. Use the existing external time/abort owner established at
preflight; do not place it in an unbounded enclosing Eval invocation. The
controller uses only the host's one-way delivery receipt and does not await or
consume the wait result. Delivery proves neither waiter survival nor disposal;
a terminal or abort settlement preserves an unresolved synchronization frontier
and authorizes no replay. Do not request or consume a review, verdict, rethink,
IRC response, local echo, mutation, dispatch, or other channel use. A failed
delivery receipt stops before every mutation or terminal presentation.

After successful synchronization:

At either terminal branch below (unchanged success or capacity), perform terminal
cleanup first. Then, in artifact mode only, immediately before reporting, freshly
read and identify the canonical artifact bytes and compare them with the reviewed
outer-base identity. The pending Correction identity is not a disk identity.
Unreadable bytes block reporting; drift stops with both reviewed and observed
identities, without mutation, adoption, or a new review loop. Do not present stale
success or label the reviewed identity as current. This terminal freshness guard
does not add disk checks to conversation mode.

1. If accepted working identity equals the outer-base identity, finish with
   unchanged success only after the terminal cleanup below. This also closes a
   closure-only iteration.
2. If accepted working state differs and the iteration is closure-only, finish
   `CAP_REACHED` before mutation and only after terminal cleanup. Preserve and
   report the freshly confirmed canonical and pending working identities.
3. If accepted working state differs and the cap is `none` or committed
   changed-application count is below it, the controller applies the complete accepted
   working proposal exactly once. Conversation mode replaces the canonical
   proposal. Artifact mode applies only the complete current Correction against
   the verified unchanged outer base. Supporting context stays read-only.
4. Re-read and re-identify the result. If and only if the observed bytes equal
   the accepted changed working state, record one committed changed canonical
   application and increment the application count exactly once. A later native
   validation failure does not erase that committed application or its count.
5. Run an existing artifact-native validator when available. A failed validator
   stops on the unchanged applied identity; an authorized retry of that exact
   validator cannot increment the application count again.
6. After validation succeeds, start a new A-led outer iteration from the exact
   applied canonical identity. When the committed-application increment reaches
   a numeric cap, mark this one new iteration as closure-only. It may negotiate
   read-only, but it may not apply another accepted change.

Reviewer turns, provisional responses, rethink, Corrections, synchronization,
unchanged closure, failed or partial application, validation itself, and
identity-preserving repair never add a capacity count. The controller performs at most one
canonical application before starting a new outer iteration.

## Terminal cleanup

Keep the same pair live between outer iterations and during an eligible
identity-preserving repair pause. A counterpart's context wait is synchronization,
not a request to terminate the run.

At actual run termination—unchanged success, `CAP_REACHED`, terminal artifact
drift, any other non-resumable stop, or abandonment of a repair pause—silently
stop/release both exact run-owned reviewer IDs before completion. On OMP use the
loaded adapter's parent-owned native exact-ID disposal seam, including retained
reviewers whose original jobs have settled; do not substitute job-scoped Eval
handle cancellation. Do not send a shutdown prompt, request an acknowledgement,
await another reviewer message, weaken the no-prose context wait, cancel
unrelated agents, or terminate the controller. The bound controller observes
disposal and copies each complete original native terminal non-running or
removal observation into that exact reviewer's distinct disposal-evidence slot
before final assembly; never route grandchild cleanup through the outer Retrace
parent. Preserve launch, roster, and all return slots until both cleanup and
result assembly finish. A cancellation request or receipt, report, turn
completion, retained snapshot, later roster view, matching child ID/hash, or
host teardown cannot fill or replace disposal evidence.

Missing or failed cleanup blocks success: preserve the pending disposition and
exact unresolved reviewer IDs and report the cleanup capability failure rather
than `Final proposal` or a falsely completed capacity stop. Do not replace a
reviewer to recover cleanup. An eligible repair pause is not completion and
retains the pair; label it as a paused frontier.

## Liveness, failure, and repair

Progress is one named approved issue or blocker resolved with changed evidence.
Another opinion, repeated wording, elapsed time, an unchanged proposal, or more
machinery is not progress. Stop without claiming validity or unauthorized
mutation on any of these frontiers:

- unchanged or non-applicable finalized `REVISE`;
- a repeated working-identity/reviewer pair without new evidence or authority,
  an A/B cycle, or a repeated unresolved frontier;
- persistent `BLOCKED` or required context still unreadable after the one
  allowed approved-context correction;
- an invalid expected return after its one corrective nudge, or an
  uncorrectable malformed or stale response;
- lost persistent child, same-child follow-up, IRC channel, or required delivery
  seam;
- failed context synchronization;
- approved-authority conflict;
- `CAP_REACHED`; or
- failed or partial application or native validation.

On application or validation failure, stop on exact observed bytes. Present the
accepted outer-base and Correction identities, observed identity, exact failed
step and error, one exact proposed repair, and an explicit repair-authority
request. Never auto-rollback.

An admitted `VALID` survives only explicit identity-preserving repair: restore a
partial write byte-for-byte to the accepted outer base, or repair permission,
transport, or validator availability without changing the outer base,
Correction, intended final content, target, mode, scope, authority, child
bindings, or lineage. Verify those identities, then retry only the exact failed
synchronization, application, or validator step. Application repair does not
add a capacity count until one changed canonical application commits;
validation repair on the unchanged applied identity does not add a second
count.

Within explicitly authorized repair, any changed outer base, Correction, or
intended final content invalidates `VALID`.
If target, mode, scope, authority, both persistent children, and lineage
remain current, bind the observed canonical content and begin a fresh A-led
outer iteration. A changed target, mode, scope, authority, child binding, or
lineage requires a revised Reconcile binding. A lost child is never replaced,
and a different committed canonical identity is never exempted from the cap.
This repair path does not authorize automatic adoption or re-review after the
terminal artifact freshness guard detects drift.

## Presentation

Read and follow [packed-label](../../references/packed-label.md) for every
user-facing section. Project the full trace into `## Review rounds` using child
kind `table`. Include each authoritative finalized verdict exactly once, plus
context-sync, apply, validate, freshness, cleanup, cap, and stop milestones.
Exclude provisional initial responses and ignored local echoes.

```markdown
## Review rounds

| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |
|---|---|---|---|---|---|
```

On success, follow it with `## Final proposal` and no other label.

Conversation mode:

```markdown
## Final proposal

**Proposal**

- {complete final proposal}
```

Artifact mode does not duplicate the full artifact. Change summary is the
committed candidate delta plus leftover nonblocking recommendations, if any; it
must not recap round verdicts.

```markdown
## Final proposal

**Change summary**

- {committed candidate delta}

**Artifact**

- {exact readable locator}

**Current identity**

- {exact identity}
```

On any stop, follow the rounds section with `## Reconcile stopped`. Do not
render `## Final proposal` or claim validity. Report the exact canonical and
pending identities when they differ; for a repairable failure include the exact
proposed repair and authority needed.

```markdown
## Reconcile stopped

**Candidate**

- {exact canonical identity}
- {exact pending or observed identity, when different}

**Blocker**

- {exact blocker and failed step}

**Resume from**

- {exact resumable frontier, proposed repair, and required authority}
```
