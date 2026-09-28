---
name: reconcile
description: >
  Converge one exact proposal or artifact through two persistent read-only
  reviewers before one controlled mutation. Use only when explicitly invoked
  to reconcile a named or latest substantive proposal before presenting it.
disable-model-invocation: true
---

# Reconcile

Direct human use runs in the root OMP session, which owns candidate inference,
the binding gate, human approval, repair authorization, and presentation. After
approval, the coded acpx controller at
`.config/agents/harnesses/omp/acp-controller/` is the sole canonical-candidate
owner, mutator, validator, semantic liveness detector, ephemeral recorder, and
renderer: it owns both reviewer sessions through public acpx and native
`omp acp`, reviewer progression, application, counting, validation, freshness,
cleanup, and the rendered record. Delegated use runs only inside a Retrace
controller run, where the scope's own logic is that controller, never the outer
Retrace parent. Together this file and
[the reviewer protocol](references/reviewer-protocol.md) are the only
Reconcile semantic owners; the controller reads every reviewer prompt from that
protocol at run start.

Only the admitted, domain-valid native `yield` candidate counts as a reply. Task, hub, Eval, any other `yield`, ordinary output, transcripts, history, agent output and generic collectors never count and are never a fallback.

### Explicit execution-recovery adoption

Reconcile explicitly adopts the sole generic
[execution-recovery policy](../dev-implementation/references/execution-recovery.md)
for its approved active-session invocation, setup, transport, collection,
capture, and task-local execution machinery. The actual controller remains
responsible for its machinery; a delegated scope remains owner of its
reviewers. This reusable skill-level adoption is known before the controller
run starts but is not retroactive authority for an existing, paused, stopped,
or historical run.

Normal use of an already-supported observation path for the same pending
operation is continuation. Correcting a failed mechanism follows the generic
policy. Reviewer re-asks, verdicts, semantic pause/continuation, and cleanup
remain owned here. Neither path authorizes another review request, child-work
replay, report re-emission, required-reviewer replacement, allowance reset,
durable workflow state, or restart.

## Preflight and approval

The inline trusted-caller allowlist is exactly `retrace`. Direct human entry
uses the inference and binding gate below, retaining both modes. The
controller CLI has no delegated `reconcile` entry: delegated entry exists only
in process inside a Retrace run, where the scope's logic builds a
`begin-reconcile` control body from Retrace's admitted `candidate-ready` freeze
with these labeled fields and controller-held locators:

- `Caller`: exactly `retrace`.
- `Parent`: the exact Retrace run parent.
- `Controller`: the exact current scope evaluator.
- `Scope`: stable approved scope ID.
- `Scope approval locator`: frozen record of the complete approved table,
  objectives, protected behavior, exclusions and approval provenance.
- `Scope contract locator`: frozen record of this scope's objective, evaluand,
  protections, exclusions, prerequisites and evidence boundary.
- `Candidate locator`: frozen admitted complete conversational report.
- `Evidence manifest locator`: frozen admitted supporting-observations record.
- `Mode`: exactly `Conversation replacement`.
- `Authorization locator`: frozen previously admitted complete
  `candidate-ready` record for this scope and candidate. Its first line
  `candidate-ready` is the kind header; do not prepend or wrap it.

Use Retrace's closed `begin-reconcile` field order. A locator is a
controller-held frozen UTF-8 record whose identity is the lowercase SHA-256 of
its exact bytes, computed by the controller. Model prompts carry the complete
record text; no model-authored digest echo is requested or accepted. Changed
bytes at a bound locator are drift, not a new baseline. Never reconstruct,
concatenate, normalize newlines, or hash tool anchors.

Before any reviewer prompt, delegated Reconcile validates every field: the
closed first line, order and single-line values; `Caller`; `Scope` against the
owning scope; `Mode`; each locator against this run's frozen records; the
candidate locator's bytes against the report under review; and the
authorization bytes' hash against the admitted `candidate-ready` record.
Reject missing, stale, replayed, foreign, or unsupported delegation before any
reviewer exists. A quoted caller label or request ID alone, or ordinary output,
grants no authority. Never fall back to artifact mode.

Delegation authorizes correction only of this scope's conversational report.
Reject artifact mode and changes to repository files, evidence, objective or
evaluand, protected behavior or exclusions, or another scope's report. Apply
this boundary to reviewer Corrections, application, and repair, not just intake.
Recommendations for later repository changes grant no permission to execute
them. Delegated review is report-only: its result returns to the scope's logic,
never to a human presentation. Carry the complete delegated authorization
context in reviewer requests outside, never inside or in place of, the
unchanged six-field lineage. A fully admitted delegation skips only the
redundant Reconcile brief and approval (step 4 below); its candidate is the
exact bound report, and references to approval below mean this validated scope
authority.

Direct entry completes preflight before rendering a brief, starting the
controller, reviewing, or mutating:

1. Capability preflight belongs to the controller and runs before any launch.
   It refuses with exit `2` and a `## Controller refused` record on an invalid
   request, `omp --version` or acpx other than the versions pinned in
   `.config/agents/harnesses/omp/acp-controller/lib/versions.mjs`, a missing
   or unparsable model role (`modelRoles.second_opinion_a`
   for A and `modelRoles.second_opinion_b` for B, each `<model>:<thinking>`),
   a missing or duplicated reviewer prompt marker, or an
   abandoned controller run (owner gone and not parked; live and parked runs of
   other sessions never refuse). Present a refusal verbatim and stop. After an
   abandoned-run refusal, ask the human once which listed runs to dispose and
   run `node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
   only for runs the human explicitly names; never remove folders or signal
   processes by hand and never retry the refused run automatically: after
   disposal the human re-invokes. If a `dispose` exits `3`, present that record
   verbatim and stop; the human decides. Do not patch the host,
   supply profiles, argv, models, tools, prompts, process factories or
   environment, substitute task/hub/Eval transport, emulate both roles with one
   actor, or weaken a seam.
2. Infer the candidate in this order: an explicitly named proposal or artifact;
   otherwise the latest substantive assistant decision or proposal; otherwise
   `unresolved`. A completion, blocked, or stop report is supporting evidence,
   never the proposal under review. Bind exact UTF-8 proposal bytes as
   `conversation@sha256:{exact-content-digest}` and exact artifact bytes as
   `{exact-readable-locator}@sha256:{exact-file-digest}`. Digests are lowercase
   SHA-256. Supply exact content or an absolute readable artifact locator, never
   an opaque cross-session reference.
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

When a run follows earlier work in the same session, Context lists separately:

- each decision that still binds, as its own child;
- `Reopened: {exact earlier decision}` for each decision the review may
  overturn; and
- earlier-work evidence, each item introduced as evidence and not as a
  decision: the earlier final proposal that was carried out; the
  implementation or blocked report word for word; the check results; the
  changed paths and diff, saved as `git diff` or `git show` output to a file in
  the run's temp folder and given by absolute path; and earlier-run reviewer
  summary points that bear on the question.

Quoting the earlier proposal as evidence does not make it binding; restate any
part of it that must still bind as a binding decision. Reviewers have only
`read`, `glob`, and `grep`, so anything that exists only in the conversation or
needs a command to see goes in as text or as a file given by absolute path.
The brief lists every item so the human can check completeness before
approving. Delegated Retrace review is unchanged: its `scope contract:` Context
item stays binding.

For an unresolved candidate, render the Candidate child as
`unresolved — name one proposal or artifact` and wait; approval alone cannot
start it. Plain `approve` starts the displayed binding. An unambiguous
`approve — {adjustments}` updates that binding and starts without another gate.
A correction without approval or a conflicting or ambiguous adjustment renders
one revised brief and waits. Approval is local to the displayed binding and
grants no other authority or effect.

Immediately before rendering each brief, including a revised one, run
`node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` through `bash`
from the repository root with no request body. It runs step 1's capability
preflight and launches nothing. On exit `2`, present its refusal verbatim and
stop. On exit `0`, show its one-line `Models:` stdout verbatim directly after
the brief's reply line. The line reports reviewer A's and B's model and
thinking level from live `modelRoles`; it is not a brief field, is not part of
the approval binding, and no approval changes it. An adjustment naming models
is a conflicting adjustment under the rule above.

## Controller invocation

After approval, write the approved binding as one JSON object to a
session-local scratch file; it is the controller's only input channel:

```json
{
  "goal": "{Goal}",
  "candidate": {"identity": "{exact identity}", "text": "{complete proposal}"},
  "context": ["{each Context child}"],
  "mode": "conversation",
  "cap": "none",
  "approval": {"text": "{the human's exact approval words}", "at": "{ISO-8601 time}"}
}
```

`mode` is `conversation` for Conversation replacement and `artifact` for
Artifact edits only. In Artifact edits, `candidate` is
`{"identity": "{exact identity}", "artifact": "{absolute artifact path}"}` with
no `text`, and an optional `"validate": {"argv": [..]}` names the existing
artifact-native validator. `cap` is `none` or the approved positive integer.
Then run the controller once, through `bash` with `timeout: 0` and the
repository root as working directory:

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs reconcile < {session-local scratch}/reconcile-request.json
```

Except for a successful `roles` call, stdout carries only the rendered record
followed by `## Spend`; stderr carries diagnostics. Exit `0` is `## Final proposal`; `1` is a stop or a parked repair
pause with `## Reconcile stopped`; `2` is a refusal before any launch; `3`
means cleanup was not established and the record names the unresolved actor,
PID, or folder. Run one controller call per approved binding. Never rerun it to
retry a stopped run; continue a parked run only under Liveness, failure, and
repair.

## Ephemeral state and identities

The controller keeps only the following fresh run state, and persists it only
in the private run folder while a run is parked for repair; never persist a
counter, ledger, reviewer state object, or hidden protocol state elsewhere:

- immutable run original content and identity;
- current canonical candidate content or artifact identity;
- outer-iteration index;
- immutable outer base content and identity for the current iteration;
- complete working proposal, exact identity, and origin (`outer-base` or one
  finalized reviewer Correction);
- the two persistent A/B reviewer sessions and each reviewer's
  first-actual-review-completed flag;
- each request's owner, phase, admitted first reply when present, turn result,
  and reuse state;
- each original expectation's re-ask count and whether the one approved-context
  retry for `BLOCKED` is spent;
- committed changed-application count, bound cap, and whether the current outer
  iteration is the one closure-only iteration;
- the pending accepted proposal and identity-safe repair state when present;
- seen working-identity/reviewer pairs, the current outer iteration's disputed
  proposal pairs and pending dispute, and unresolved frontiers; and
- a full event trace with monotonically increasing `Step` values.

Bounded lineage contains exactly these six fields: outer iteration, outer-base
identity, parent proposal identity, author reviewer, author pass, and source
finalized-response digest. At outer initialization, parent proposal identity is
the outer-base identity and author reviewer, author pass, and source response
are `none`. A changed working proposal records the prior working identity as its
parent and hashes the exact complete finalized response. Lineage is
controller-derived; do not create a separate semantic response-history ledger.

A conversation working identity is the lowercase SHA-256 of its exact complete
UTF-8 replacement. An unchanged artifact working identity is the canonical
artifact identity. A changed artifact working identity binds the immutable
outer-base identity and the exact complete bounded edit set with a lowercase
SHA-256. Identity equality, not paraphrase or intent, governs freshness.

Every review request carries the approved goal, candidate, context, exact mode
and cap; the current outer iteration; the complete unchanged outer base; the
complete current working proposal; the Correction shape for the mode; the
delegated authorization record or `none`; and a worked return example. A
controller header names the phase, expected reviewer, pass, and owner. In outer
iteration one the outer base is the run original, so each reviewer's first
actual review carries the full run-original content. Current working identity
and all six lineage fields remain controller-computed from frozen content and
admitted responses, not reviewer-authored identity fields. The current request
binds each response to its candidate; an echoed `Candidate:` field is neither
required nor allowed.

## Reviewer progression

The controller creates reviewer A for the first review and reviewer B only
when an applicable `REVISE` first needs the counterpart. Each is one
persistent read-only native session for the whole run, launched with the tools
`read`, `glob`, `grep`, and `yield`, every permission request denied, and an
empty private working directory. A fresh session is created only for the first
creation of a previously unstarted role; restoration is same-session only.
Never replace, resend to, or emulate a reviewer.

On each reviewer's first actual reviewing turn:

1. Send the `initial` request with the full current review packet. Include no
   supplemental-skill loading recipe or path.
2. Admit its exact first reply as the complete provisional response. Trace it
   as provisional and superseded by its eventual finalized response. It cannot
   change working state or terminate negotiation.
3. After admitting that provisional response, send one `rethink` request to the
   same session. It instructs the reviewer to `read` the absolute path
   `/Users/kim/.dotfiles/.config/agents/skills/rethink/SKILL.md` once, reassess
   its immediately preceding complete provisional response from first
   principles, and reply with one complete finalized response with pass
   `post-rethink` for the same candidate. The request states that the outer
   Reconcile contract supersedes `rethink`'s standalone wrapper and `reject`,
   `reuse`, `extend`, `test`, and `proceed` vocabulary. Do not infer this
   invocation from the pass label, a later request, or a re-ask.
4. Mark that reviewer's first actual review complete only after admitting the
   finalized response.

Every later actual review uses pass and phase `later` and never loads
`rethink`. A `source-need` return continues the same pass: the controller
supplies each requested readable absolute source in a `source` request, and a
repeated request for the same sources stops. A re-ask returns to the same
reviewer and inherits the invalid return's pass and authority: a corrected
`initial` stays provisional; a corrected `post-rethink` or `later` stays
finalized. Neither switches reviewer nor adds a rethink. A finalized `BLOCKED`
receives the one approved-context retry through the same reviewer; persistent
`BLOCKED` stops.

Admit, per request, only the first completed, non-error, terminal native
`yield` with explicit `data` and native success inside that request's journal
window, excluding incremental `yield` sections. Validate it once against the
controller schema for the expected phase, then apply the applicability checks
for the current working proposal. Native success is not a `VALID` verdict. The
first admitted reply stays authoritative through a later turn failure, process
exit, or abort; the turn result governs reuse and cleanup, not reply
authority. A request stays pending until an admitted reply, a concrete terminal
failure, or an explicit controller abort; no turn timeout applies. After
observer loss or uncertain delivery the controller re-watches from the last
consumed cursor for the same request, admits an already captured reply at most
once, and never resubmits the prompt.

Each original expected review return shares one re-ask budget across data
format and applicability: three re-asks in total, and the fourth invalid
return stops. An invalid return is a turn that completes without a `yield`,
`yield` data that fails the review schema, a `REVISE` Correction that is
non-applicable to the outer base or leaves the current working proposal
unchanged, or a finalized `REVISE`
citation whose quote does not match its checkable file. A re-ask restates the
concrete defect and the prescribed complete response shape in one new `reask`
request to the same reviewer, pass, and candidate, and revalidates the complete
reply. A changed error category, duplicate, or repeated invalid response never
resets the count. Never switch reviewer, add a review or rethink, unwrap,
normalize, deduplicate, or select a last block.

A finalized `REVISE` may list citations, each an absolute path, a line or
inclusive line range, and an exact quote. The controller checks only citations
of checkable files: for direct review, files strictly inside its working
directory (the repository root) and the Artifact-edits artifact; for delegated
review, files strictly inside the bound Retrace root and the approved Retrace
evidence locators; in each case only when the file is readable. Lines are the
file's bytes split at LF; a citation passes when its quote occurs as one
contiguous byte sequence within the cited lines, with no trimming, case
folding, normalization, or line-ending translation. A citation past the file's
last line or whose quote is not found is a mismatch: the re-ask names every
failing citation, and no working proposal is created. Uncheckable citations and
uncited claims are not checked, and neither passes. Provisional `initial`
responses are never checked.

An unfinished `yield`, uncertain delivery, an incomplete turn, a tool outside
the reviewer's four tools, an evidence fault, or a controller stop is not an
invalid return and earns no re-ask: it stops the run at that exact request.
When no admitted reply exists, preserve the exact request, reviewer, phase,
candidate, failure state, spent re-asks, and all earlier admitted responses.
Do not substitute a working draft, copied payload, assistant output, or a later
reply from another request; do not redispatch, replay, re-emit, replace a
reviewer, or reset an allowance.

The re-ask budget governs invalid expected returns only. Valid `REVISE` and
`BLOCKED` keep their own handling, including the one approved-context retry;
separately authorized repairs remain outside this guard. None consumes or
replenishes a re-ask.

The re-ask is distinct from adopted generic machinery recovery. If an
already-authorized controller call, result capture, or validator invocation
fails for an eligible execution cause, the responsible owner may correct only
that mechanism under the generic policy without issuing another semantic
request, changing the review pass, refunding a re-ask, replaying child work, or
resetting an allowance. Supported observation of the same pending request is
continuation. A valid `REVISE`, `BLOCKED`, semantic stop, missing required
owner, or exhausted budget cannot be relabeled as machinery failure.

Accept only the protocol's exact complete response for the expected reviewer,
pass, and current working identity. A malformed, stale, mismatched, or
non-applicable response is not a verdict and authorizes no edit. The
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
  state, records its bounded lineage, and goes to the counterpart.
- Artifact `REVISE` must provide one complete set of exact bounded edits against
  the immutable outer base. A changed, directly applicable set completely
  supersedes every earlier unapplied Correction; it is never layered on another
  unapplied patch. The canonical artifact remains unchanged until acceptance
  and application.
- `BLOCKED` authorizes no mutation. Apply only the one approved-context retry
  above; if it does not resolve the blocker, stop.

After each changed applicable finalized `REVISE`, add the prior working identity
as the lineage parent, replace the complete working proposal and origin, record
the new working identity/reviewer pair, and request the counterpart. Alternate
the same A and B sessions for as many genuinely progressive turns as needed.
There is no numeric inner-turn cap and no mutation during negotiation.

A revert is a finalized `REVISE` whose new working identity repeats a pair its
reviewer already recorded in this outer iteration. A revert with at least one
passing citation, whose unordered proposal pair (the replaced and the restored
identity) has had no dispute in this outer iteration, earns one dispute: the
controller records a `dispute` milestone and requests the counterpart once,
with the passing citations attached to its `later` request. The dispute ends at
the counterpart's next finalized `VALID` or `REVISE`; its approved-context
`BLOCKED` retry carries the same citations. If that `REVISE` restores the
proposal the revert replaced, the run stops. Every other revert stops as a
repeated A/B cycle. A different proposal pair earns its own dispute. Disputes
consume and refund no re-ask and add no turn cap or reviewer replacement.

## Application and capacity

At either terminal branch below (unchanged success or capacity), perform terminal
cleanup first. Then, in artifact mode only, immediately before reporting, freshly
read and identify the canonical artifact bytes and compare them with the reviewed
outer-base identity. The pending Correction identity is not a disk identity.
Unreadable bytes block reporting; drift stops with both reviewed and observed
identities, without mutation, adoption, or a new review loop. Do not present stale
success or label the reviewed identity as current. This terminal freshness guard
does not add disk checks to conversation mode.

1. If accepted working identity equals the outer-base identity, finish with
   unchanged success only after terminal cleanup. This also closes a
   closure-only iteration.
2. If accepted working state differs and the iteration is closure-only, finish
   `CAP_REACHED` before mutation and only after terminal cleanup. Preserve and
   report the freshly confirmed canonical and pending working identities.
3. If accepted working state differs and the cap is `none` or committed
   changed-application count is below it, the controller applies the complete
   accepted working proposal exactly once. Conversation mode replaces the
   canonical proposal. Artifact mode first re-reads the artifact and stops
   without writing if it no longer equals the accepted outer base; otherwise it
   writes only the complete current Correction applied to that verified outer
   base. Supporting context stays read-only.
4. Re-read and re-identify the result. If and only if the observed bytes equal
   the accepted changed working state, record one committed changed canonical
   application and increment the application count exactly once. A later native
   validation failure does not erase that committed application or its count.
5. Run the approved existing artifact-native validator when the request names
   one; the controller runs its `argv` without a shell in the artifact's
   directory. A failed validator stops on the unchanged applied identity; an
   authorized retry of that exact validator cannot increment the application
   count again.
6. After validation succeeds, start a new A-led outer iteration from the exact
   applied canonical identity. When the committed-application increment reaches
   a numeric cap, mark this one new iteration as closure-only. It may negotiate
   read-only, but it may not apply another accepted change.

Reviewer turns, provisional responses, rethink, Corrections, unchanged
closure, failed or partial application, validation itself, and
identity-preserving repair never add a capacity count. The controller performs
at most one canonical application before starting a new outer iteration.

## Terminal cleanup

Keep the same pair live between outer iterations, and keep the same pair's
sessions parked and resumable, never disposed or replaced, during an eligible
repair pause.

At actual run termination—unchanged success, `CAP_REACHED`, terminal artifact
drift, any other non-resumable stop, or abandonment of a repair pause—the
controller disposes both exact run-owned reviewer sessions before completion.
Disposal closes each session and then observes every recorded process ID with
signal 0 under a fixed finite bound; only `ESRCH` for every recorded PID proves
exit, and an empty PID set proves nothing. The controller never sends a
termination signal, a shutdown prompt, or an acknowledgment request. After
observed exit it removes only the run's own session files and private run
folder. A delegated scope disposes its own two reviewers the same way before
its scope result is formed.

Successful cleanup requires that observed exit. A resolved close, a closed
session record, a report, turn completion, or host teardown cannot replace it.
Missing or failed cleanup blocks success: the controller exits `3`, keeps the
pending disposition, names the exact unresolved reviewer, PID, or folder, and
renders no `Final proposal` or falsely completed capacity stop. Do not replace
a reviewer to recover cleanup. An eligible repair pause is not completion and
retains the pair; it is labeled as a paused frontier.

## Liveness, failure, and repair

Progress is one named approved issue or blocker resolved with changed evidence.
Another opinion, repeated wording, elapsed time, an unchanged proposal, or more
machinery is not progress. Stop without claiming validity or unauthorized
mutation on any of these frontiers:

- unchanged or non-applicable finalized `REVISE`;
- a repeated A/B cycle: a revert without a passing citation; a counterpart
  that restores the replaced proposal after its one dispute; or a proposal
  pair repeating after its one dispute in the same outer iteration; or a
  repeated unresolved frontier;
- persistent `BLOCKED` or required context still unreadable after the one
  approved-context retry;
- a fourth invalid return for one original expectation;
- a repeated source request;
- an unfinished `yield`, uncertain delivery, incomplete turn, forbidden tool,
  lost reviewer session, or failed same-session restore;
- approved-authority conflict;
- `CAP_REACHED`; or
- failed or partial application or native validation.

On an Artifact-mode application, reread, or validation failure, stop on exact
observed bytes. The controller parks the run instead of disposing the pair: it
persists the review state, identities, failed step, and both reviewers'
session identities in the private run folder, closes both sessions with
observed exit while keeping them resumable, and exits `1`. Its
`## Reconcile stopped` record presents the accepted outer-base and Correction
identities, observed identity, exact failed step and error, one exact proposed
repair, the required authority, and the resume and abandon commands. Never
auto-rollback. If observed exit is not established, it exits `3` as a cleanup
failure.

An admitted `VALID` survives only explicit identity-preserving repair: restore a
partial write byte-for-byte to the accepted outer base, or repair permission,
transport, or validator availability without changing the outer base,
Correction, intended final content, target, mode, scope, authority, reviewer
sessions, or lineage. The human authorizes that exact repair in the root
session; the root performs it and then resumes the parked run through `bash`
with `timeout: 0` from the repository root:

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs resume {runId} < {session-local scratch}/resume-request.json
```

with the request `{"repair": {"authority": "{the human's authorization words}",
"step": "{exact failed step}"}}`. Resume restores both reviewer sessions under
their parked session identities with no fresh-session fallback, and keeps the
models and thinking levels bound at the run's first call rather than live
`modelRoles`; a parked run without recorded models stops as a lost identity.
It then retries
only the exact failed application, reread, or validator step. A different step
keeps the run parked. Application repair does not add a capacity count until
one changed canonical application commits; validation repair on the unchanged
applied identity does not add a second count. If either reviewer's same-session
restore fails, resume stops and asks: it disposes both sessions, names the lost
identity, and exits `1`; nothing rolls back and no fresh A or B is created.
Resume claims the run exclusively, refuses while another live controller owns
it, and restores no reviewer until every recorded or matched reviewer PID shows
observed exit; a still-present PID exits `3` with the run unchanged, and the
root presents that record verbatim and stops. A parked run never blocks other
sessions' runs; a resumed run whose controller then dies is abandoned and can
only be disposed. Abandon a parked run with
`node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
and no request body, only on the human's explicit instruction.

Within explicitly authorized repair, any changed outer base, Correction, or
intended final content invalidates `VALID`.
If target, mode, scope, authority, both persistent reviewers, and lineage
remain current, bind the observed canonical content and begin a fresh A-led
outer iteration. A changed target, mode, scope, authority, reviewer binding, or
lineage requires a revised Reconcile binding. A lost reviewer is never
replaced, and a different committed canonical identity is never exempted from
the cap. This repair path does not authorize automatic adoption or re-review
after the terminal artifact freshness guard detects drift.

## Presentation

Present the controller's stdout verbatim; it follows
[packed-label](../../references/packed-label.md) for every user-facing section
and ends with the `## Spend` table of per-reviewer tokens and cost. Do not
rewrite, summarize, or reorder it. The controller projects the full trace into
`## Review rounds` using child kind `table`. It includes each authoritative
finalized verdict exactly once, plus apply, validate, freshness, cleanup, cap,
park, resume, dispute, and stop milestones, and excludes provisional initial
responses.
Each finalized verdict's Outcome shows only the verdict word followed by the
reviewer-authored `summary` points (return contract in
[reviewer protocol](references/reviewer-protocol.md)), one `• ` point per line,
copied byte-for-byte from the admitted `data` strings. Full reviewer text
(blocking issues, recommendations, blocker, resume input) appears nowhere in
the output.

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
committed candidate delta only; it lists no reviewer recommendations and must
not recap round verdicts.

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

- {exact blocker and failed step; a persistent `BLOCKED` shows the reviewer role and its summary points}

**Resume from**

- {exact resumable frontier, proposed repair, and required authority; a persistent `BLOCKED` resumes from a new approved Reconcile run}
```
