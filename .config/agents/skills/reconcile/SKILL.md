---
name: reconcile
description: >
  Converge one exact proposal or artifact through two persistent read-only
  reviewers before one controlled mutation. Use only when explicitly invoked
  to reconcile a named or latest substantive proposal before presenting it.
disable-model-invocation: true
---

# Reconcile

Bind the exact invoking controller from the named lifecycle consumer: direct
human use binds the real top-level Main through a standalone `reconcile` run;
delegated use binds the actual Retrace scope connection in its existing
`retrace` run, never the outer Retrace parent. Keep that controller as the sole
canonical-candidate owner, mutator, validator, semantic liveness detector,
ephemeral recorder, and presenter. Before any reviewer request, read and follow
[the reviewer protocol](references/reviewer-protocol.md) completely; together
this file and that protocol are the only executable Reconcile semantic owners.

[`references/execution-flow.md`](references/execution-flow.md) is a
non-normative human maintenance map. Maintainers may open it only while changing
or diagnosing Reconcile's controller loop. Invocation, preflight, approval, and
live execution never load, hash, send, or interpret it; a mismatch is an
edit-time documentation defect, and the two executable owners win.

Portable declared bodies, semantic admission, and generic return boundaries
live in [agent-return](../../references/agent-return/return.md); they own no
Reconcile pass, admission, or correction budget. On OMP, load the
[OMP agent-return adapter](../../harnesses/omp/agent-return.md) before lifecycle
preflight. The adapter owns the named consumer, connection-bound reply,
reply/turn separation, owner visibility, pending observation, abort, capacity,
and observed-exit disposal facts, not Reconcile semantics.

### Explicit execution-recovery adoption

Reconcile explicitly adopts the sole generic
[execution-recovery policy](../dev-implementation/references/execution-recovery.md)
for its approved active-session invocation, setup, transport, collection,
capture, and task-local execution machinery. The actual controller remains
responsible for its machinery; a delegated scope child remains owner of its
reviewers. This reusable skill-level adoption is known before `open` but is not
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
requires a plain-text `begin-reconcile` in the successor lifecycle request from
the actual bound outer parent to the current scope actor, with these labeled
fields and receiver-readable locators:

- `Caller`: exactly `retrace`.
- `Parent`: exact outer Retrace parent, verified against connection-bound
  lifecycle request provenance.
- `Controller`: exact current scope actor, verified against this connection.
- `Scope`: stable approved scope ID.
- `Scope approval locator`: exact parent-frozen locator for the complete
  approved table, objectives, protected behavior, exclusions and approval
  provenance; required record header `Kind: scope-approval`.
- `Scope contract locator`: exact parent-frozen locator for this scope's
  objective, evaluand, protections, exclusions, prerequisites and evidence
  boundary; required record header `Kind: scope-contract`.
- `Candidate locator`: admitted complete conversational report locator;
  required record header `Kind: conversation`.
- `Evidence manifest locator`: admitted supporting-observations locator;
  required record header `Kind: evidence-manifest`.
- `Mode`: exactly `Conversation replacement`.
- `Authorization locator`: readable locator of the parent's frozen, previously
  admitted complete `candidate-ready` body for this scope and candidate. Its
  first line `candidate-ready` is the kind header; do not prepend or wrap it.

Use Retrace's closed `begin-reconcile` field order and locator-hash contract.
The parent copies locators from its admitted freeze, not typed digest fields.
Re-read and hash complete UTF-8 bytes, including each record's kind header;
check its kind against the field, parent-known locators against the exact
request-local freeze, and authorization bytes against the scope's corresponding
published reply. Bind new records by their first successful locator hash; the
parent retains that publish-time hash and later reads must match it. Changed
bytes at a bound locator are drift, not a new baseline. Freeze owned filesystem
records write-once (`0444` for OMP/proofs), without imposing that permission
method on other transports or inventing a store. Never reconstruct, concatenate,
normalize newlines, or hash tool anchors. Neither request/actor correlation
tokens nor agent-composed digest echoes belong in the control body.
Parent-origin is checked against the connection-bound lifecycle request.

Admit only when all fields, frozen identities, approved scope/contract,
connection-bound parent/current-controller provenance, current phase, and the
exact previously admitted candidate-ready authorization match. Reject missing,
stale, consumed,
replayed, foreign, or unsupported delegation before reviewer dispatch. A quoted
caller label or request ID alone, ordinary output, or a status wake grants no
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
Direct entry completes preflight before rendering a brief, opening a run,
reviewing, or mutating:

1. Establish the configured named `reconcile` consumer with distinct persistent
   read-only logical A and B profiles. Direct mode must be able to `open`
   `{ mode: "standalone", controller }`; delegated mode must arrive through the
   current scope connection in the already-open Retrace run compiled for this
   exact scope. Require stable actor IDs, connection-bound owner visibility,
   same-actor successive requests, `skill://rethink` load, exact first-reply
   retention, separate turn/reuse outcome, pending observation and explicit
   abort, and owner-scoped observed-exit disposal. This is static preflight:
   require no preapproval worker launch. `open` validates the complete binding
   before effects and does not establish semantic readiness.
   After approval, dispatch role-bound readiness requests to both actors and
   admit their exact replies before outer iteration one. Distinct actor
   requests may run concurrently. Missing named-consumer capability,
   connection ownership, authoritative reply visibility, same-actor follow-up,
   or observed-exit cleanup blocks. Do not patch the host, supply graphs,
   profiles, argv, models, tools, prompts, process factories or environment,
   substitute task/hub/Eval transport, require a caller correlation token,
   emulate both roles with one actor, replace a lost actor, or weaken a seam.
   Keep complete original lifecycle result envelopes only in current
   invocation state until the semantic operations and cleanup that depend on
   them finish; do not recreate the retired launch/roster/return/disposal slot
   scheme.
   If an authorized proof requires export, bind this controller, named
   definition, expected operation kinds, actor targets and phases, and
   session-local destinations before `open` or the covered `dispatch`. For
   delegated proof, root instructions, scope contract, and operative requests
   must agree. The plugin exposes no export operation or lifecycle-call
   destination field. Record returned run/actor/request IDs from the original
   results, then mechanically copy only already-retained envelopes and
   owner-visible reply bodies to the bound destination; add no default report
   field or alternate observation path.
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
- the two persistent A/B actor identities and each actor's
  first-actual-review-completed flag;
- the current lifecycle run binding, original operation results needed for
  active semantic handling or cleanup, and each request's stable ID, actor,
  phase, first reply when present, turn and reuse outcome;
- each original pending return's expected role/pass/candidate,
  consumed/pending status, and nonresetting correction-used flag;
- the exact unresolved lifecycle frontier when an expected reply is missing,
  without backfilling it from working state, a status wake, or a later body;
- committed changed-application count, bound cap, and whether the current outer
  iteration is the one closure-only iteration;
- terminal finalized response, counterpart context-sync result, and
  identity-safe repair state when present;
- seen working-identity/reviewer pairs and unresolved frontiers; and
- a full event trace with monotonically increasing `Step` values.

Bounded lineage contains exactly these six fields: outer iteration, outer-base
identity, parent proposal identity, author reviewer, author pass, and source
finalized-response digest. At outer initialization, parent proposal identity is
the outer-base identity and author reviewer, author pass, and source response
are `none`. A changed working proposal records the prior working identity as its
parent and hashes the exact complete finalized response. Do not create or send a
separate semantic response-history ledger; retain the complete original
lifecycle results required for current assembly and cleanup.

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
locator; expected reviewer and pass; the invoking controller
identity; and the exact lifecycle target and semantic phase. It carries the
immutable run-original identity on every turn. It carries the full run-original
content or approved readable locator only on that actor's first actual
reviewing turn, or once more to correct an otherwise resolvable `BLOCKED`.
Large context may use native shared artifact transport only when the intended
actor can read it.
The controller retains the protocol locator's publish-time hash and requires
matching re-reads before subsequent dispatches. Reviewers independently hash
that same file at bootstrap and before review; they do not echo its digest.
Current working identity and all six lineage fields remain controller-computed
from frozen content and retained responses, not reviewer-authored identity
fields. Bind each response to the candidate in its current connection-owned
request; an echoed `Candidate:` field is neither required nor allowed.

## Retained reviewer lifecycle

After approval, direct mode opens one named `reconcile` run with binding
`{ mode: "standalone", controller }`; delegated mode uses the reviewer pair
already declared for the exact scope by the outer named `retrace` run. Do not
open a second delegated run. Retain the returned run and stable reviewer actor
IDs in current invocation state. `open` declares the pair but neither launches
workers nor establishes readiness.

Dispatch separate bootstrap requests to A and B with phase `readiness`; distinct
actors may start concurrently. Each body binds only logical role, protocol
locator, and controller identity and requests the reviewer protocol's
exact readiness line. Admit readiness only from the first owner-visible reply
for that exact actor/request/phase after validating `Ready: reviewer A` or
`Ready: reviewer B`. Keep reply, turn, and reuse separate. Startup or delivery
failure affects only that request; preserve the successful sibling and every
stable handle. Do not resend, replay, reconstruct, or replace either required
actor.

On each actor's first actual reviewing turn, even if it occurs in a later outer
iteration:

1. Dispatch the full run original or approved readable locator and the current
   review-turn packet to that actor with phase `initial`. Include no
   supplemental-skill loading recipe or path.
2. Admit its exact first reply as the complete provisional response. Trace it
   as provisional and superseded by its eventual finalized response. It cannot
   change working state or terminate negotiation.
3. After admitting that provisional response, dispatch one successor request
   to the same actor. Explicitly instruct it to load `skill://rethink` once,
   reassess its immediately preceding complete provisional response from first
   principles, and reply with one complete finalized response with pass
   `post-rethink` for the same candidate identity. The request states that the
   outer Reconcile contract supersedes `rethink`'s standalone wrapper and
   `reject`, `reuse`, `extend`, `test`, and `proceed` vocabulary. Do not infer
   this invocation from the pass label, a later request, a correction, or
   context-only synchronization.
4. Mark that actor's first actual review complete only after admitting the
   finalized response.

Every later actual review uses pass and phase `later`, sends no run-original
bytes, and never loads `rethink`. A response-contract correction returns to the
same actor and inherits the corrected response's pass and authority:
corrected `initial` stays provisional; corrected `post-rethink` or `later`
stays finalized. Neither switches reviewer nor adds a rethink. A `BLOCKED`
response may receive already-approved readable original context once through
the same actor; persistent `BLOCKED` stops.

For every readiness, review, correction, approved-context, or synchronization
request, bind the exact actor, expected role/pass/candidate, semantic operation
and phase before dispatch. Direct mode uses public `dispatch` and owner
`observe`; delegated mode uses connection-bound `lifecycle_channel.request`.
The request ID and physical connection establish correlation and ownership.
Do not add a reply token to the body or use task, hub, Eval, yield, ordinary
completion, transcript, history, agent output, local echo, or another channel
as response authority.

Public `dispatch` returns one stable row immediately. Preserve `pending`,
`start-failed`, or `delivery-unknown` exactly and account every batched sibling.
For a pending direct request, use `observe` only on an authorized controller
turn, including a plugin status wake; create no polling loop, timer, waiter, or
external supervisor. A delegated connection call returns the owned request
views when their first replies or terminal failures settle. Elapsed silence
stays pending until an authoritative reply, concrete terminal failure, or
explicit owner/user abort. A periodic ID/status-only wake is observation-only
and never a response.

Admit only an owner-visible `RequestView.reply.body` from the exact request,
actor and phase. Retain the complete original lifecycle result before decoding
the body as text and applying exact expected role, pass, candidate identity,
workflow grammar, authority, semantic, correction budget, and once-only
request checks. The first accepted reply remains authoritative through later
turn failure, process exit, or abort. `turn: succeeded` plus `reuse: ready` is
required before ordinary later reuse; a reserved successor may wait for that
same actor. `NO_REPLY`, `WORKER_FAILED`, `ACTOR_TERMINAL`,
`DELIVERY_UNKNOWN`, or another concrete lifecycle failure never supplies or
reconstructs a body.

When no authoritative reply exists, preserve the exact request, actor,
controller, phase, candidate, failure/pending state, used or unknown
allowances, and all earlier admitted responses. Do not substitute a working
draft, copied payload, assistant output, later reply from another request, or
status wake; do not redispatch, replay, re-emit, replace an actor, nudge for
silence, or reset an allowance. Explicit abort terminates only the named
request/actor/run and creates no replacement or semantic continuation.

An unsolicited, stale-phase, already-consumed, malformed, wrong-role,
wrong-pass, wrong-candidate, or non-applicable body cannot satisfy the current
expectation. A malformed first reply from the exact actor/request follows the
one-correction rule below. A missing reply, status-only wake, startup failure,
delivery uncertainty, terminal failure without a reply, or unavailable
lifecycle capability is not an invalid body and earns no content correction.
A valid reply remains admitted if its producing turn later fails; that later
outcome controls reuse and cleanup, not reply authority.

For each original expected readiness or review return, allow at most one
corrective request total across body format, identity, and applicability
failures evidenced by that exact request's first reply. The corrected return
remains part of the original expectation: a changed error category, duplicate,
or repeated invalid response cannot reset the allowance. Recoverability
requires the approved run binding, same actor, approved candidate, and
necessary state to remain intact. A revoked/conflicting binding, terminal or
lost actor, or unavailable lifecycle seam stops immediately.

For an eligible invalid return with its correction unused, restate the concrete
violated requirement and prescribed complete response shape in one new request
to the same actor, pass, and candidate. Revalidate the complete reply contract.
A valid correction continues with inherited authority; any further invalid
return for that expectation stops and cleans up. Never switch actor, add a
review or rethink, unwrap, normalize, deduplicate, or select a last block.

This allowance governs invalid expected returns only. Valid `REVISE` and
`BLOCKED` keep their existing handling, including the once-approved-context
correction; context-only synchronization and separately authorized repairs
remain outside this guard. None consumes a return-contract correction or
replenishes one already spent for the same original expectation.

The return-contract correction is distinct from adopted generic machinery
recovery. If an already-authorized lifecycle call, result capture,
synchronization, or validator invocation fails for an eligible execution
cause, the responsible owner may correct only that mechanism under the generic
policy without issuing another semantic request, changing the review pass,
refunding a correction, replaying child work, or resetting an allowance.
Supported observation of the same pending request is continuation. A valid
`REVISE`, `BLOCKED`, semantic stop, missing required owner/provenance, or
exhausted correction cannot be relabeled as machinery failure.

Accept only the protocol's exact complete response for the expected reviewer,
pass, and current working identity. A duplicate, malformed, stale, mismatched,
or non-applicable response is not a verdict and authorizes no edit. The
controller never normalizes reviewer prose or invents a semantic correction.

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

Before mutation, unchanged success presentation, or a capacity stop, dispatch
the already-live reviewer who did not issue terminal `VALID` one context-only
request under the protocol. It carries the complete terminal working proposal
or exact readable artifact base plus complete bounded edit set, its six-field
provenance, the complete terminal response, and the intended disposition. The
complete terminal response is copied verbatim from the admitted request;
neither it nor the synchronization packet carries an added `Candidate:` or
other dedicated current-identity field. The connection-owned request, supplied
complete proposal/artifact inputs and unchanged six-field provenance bind the
terminal candidate. Preserve every required provenance role identity. Admit
only the exact `Synchronized` acknowledgment
from that actor/request. It is receipt evidence, not a review, verdict,
rethink, mutation, or semantic acceptance. A failed or missing acknowledgment
stops before every mutation or terminal presentation; do not replay or replace
the reviewer.

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
identity-preserving repair pause. Context synchronization is not a request to
terminate the run.

At actual run termination—unchanged success, `CAP_REACHED`, terminal artifact
drift, any other non-resumable stop, or abandonment of a repair pause—dispose
both exact run-owned reviewer actors before completion. A delegated scope uses
connection-bound `lifecycle_channel.dispose` for each reviewer and waits for
`disposed` before publishing `scope-result`. A standalone controller uses
public owner-scoped `dispose` for each reviewer, then `close` for any remaining
run-owned state. Do not send a shutdown prompt, request an acknowledgment,
abort unrelated actors, or terminate the controller.

Successful cleanup requires the supervisor's retained process-exit observation
and exact `disposed`/`closed` result. Preserve `failed-cleanup`, the exact
unresolved actor/PID and retained state. A request receipt, report, turn
completion, status wake, later observation, or host teardown cannot replace
that result.

Missing or failed cleanup blocks success: preserve the pending disposition and
exact unresolved reviewer actors and report the cleanup failure rather than
`Final proposal` or a falsely completed capacity stop. Do not replace a
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
- an invalid expected return after its one corrective request, or an
  uncorrectable malformed or stale response;
- lost persistent actor, same-actor follow-up, connection-bound reply, or
  required lifecycle seam;
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
Exclude provisional initial responses and observation-only status wakes.

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
