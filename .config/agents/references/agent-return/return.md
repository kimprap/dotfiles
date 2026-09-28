# Agent return

Portable declared-body, lifecycle, provenance, extraction, and observed-return
retention rules only. Load this file before the first requested return and apply
it for every requested return. It is not a skill stage, broker, transport
implementation, lifecycle controller, or recovery policy.

Installed root: `~/.agents/references/agent-return/return.md`. The decoder is
`decode.py` beside this file. A runtime caller also loads its host adapter at the
return seam; on OMP use the [OMP agent-return adapter](../../harnesses/omp/agent-return.md).
Workflow owners keep semantic readiness, pass selection, admission state,
correction budgets, terminal decisions, and disposal authority.

## Declared bodies

Choose one encoding before delivery. Do not try another encoding if the first
does not validate.

1. Text body: the complete response is one string.
2. Exactly one string `response` field:
   `{"response": "<complete unchanged text>"}`.

Preserve exact body text, including legitimate newlines, Unicode, and quotes.
Do not recursively unwrap, concatenate transcripts, select among competing
payload fields, or repair semantic content.

## Distinct lifecycle facts

Keep these facts separate; none implies a later one.

- **Allocation** supplies a prospective child identity or handle.
- **Roster addressability** establishes that the exact child is currently
  registered under its actual owner and can receive the next authorized
  operation. It is not semantic readiness.
- **Launch-turn or later turn completion** ends one local turn. It does not
  prove addressability, report publication, report observation, admission, or
  disposal.
- **Report observation and admission** obtains an original native return through
  a host-supported surface, immediately retains that native object and declared
  payload, then validates the host-selected provenance predicate, declared body,
  identity, phase, authority, and once-only logical-report state. Delivery,
  outer-call success, or one collector's lifetime alone is not admission.
- **Native return retention** immediately preserves every complete original
  native object considered for the pending report and its exact body. No later
  or reconstructed source can replace that observation.
- **Exact disposal** releases the exact owned child through the host lifecycle
  and requires the workflow owner's prescribed disposal evidence. A message,
  report, turn completion, retention record, cancellation request, or echo is
  not disposal.

## Retrace and Reconcile

Reconcile and Retrace run under their acpx controller
(`harnesses/omp/acp-controller/`), which owns their reviewer and scope sessions,
first replies, pending observation, capacity and observed-exit disposal.

## Portable extraction

Decode host serialization only at the seam documented by the loaded host
adapter, then decode the predeclared body. Never heuristically try encodings.

### Producer ordinary completion

The host adapter identifies the complete native producer envelope and its one
documented payload field. Admit the envelope only after all adapter metadata
checks pass. Pass only the designated payload to `decode.py` as encoding
`response_object`; never pass the envelope and never fall back to `text` after
failure. Incremental, overridden, scalar, missing, or otherwise unsupported
completion shapes are not this payload. Ordinary completion remains separate
from owner-directed report authority unless the owning workflow selected it.

### Host-selected implementation follow-ups

Select the loaded host's supported return seam before requesting an
implementation follow-up. OMP uses durable child-bound completion jobs for the
authorized attempt-2 candidate, implementation-rethink Handoff, and
already-authorized same-child recovery return. The attempt-1 candidate remains
the exact allocated launch job. Bind child, controller/receiver, task, attempt,
operation/report identity, phase and declared response schema before sending.
Apply the host adapter's capability gate before allocation and its receipt
dispatch before collection. On OMP, keep native wait active in the same
controller turn from each eligible receipt until the original matching result
and row are retained or the adapter's no-job wait stop ends that request; do
not end that turn. Ordinary wait messages, including `wakeRelay` notices, do
not finish collection. Display-only auto-delivery without the retained original
structured object is not a reply, and grants no alternate-source recovery.
Keep one outstanding request per child and retain all earlier jobs before the
next request. Admit only the first task-job row for that child after its request
receipt, with native child identity, successful resolution and caller-schema
validity, never job-ID equality or novelty. Immediately retain the original
result and row before decoding only the designated data as `response_object`.
The child terminal-yields exactly `{"response":"<complete report>"}` without
`type` through one direct native `yield` tool call, never through eval or any
other tool bridge: a bridged yield reports `Result submitted.` but registers no
launch or wake job. Every launch and follow-up request states this and every
other request rule the loaded host adapter lists. The launch schema is
inherited. A text-only resolve, rejected job (even with structured
data), old/foreign/duplicate row or relay is not a reply.
Absence of a row alone proves nothing; only the adapter's positive native no-job
`wait` observation after an eligible receipt stops that request as a missing
reply, without admission, resend, replacement or reset. The host adapter owns
delivery outcomes, registration failures, that stop and job-ID reuse.
Job settlement is neither task completion nor disposal.

For other hosts that actually expose native reply correlation, use the
token/message path below, including its narrowly authorized restatement.
Neither that path nor restatement is an OMP fallback. A host with neither
native reply correlation nor durable completion jobs stops
`transport-unavailable`; never invent a message or alternate-source return.

### Owner-directed messages

The owner authors a unique correlation token and binds it before dispatch to
the exact sender, native receiving owner, operation, logical report identity,
expected return, current semantic phase, declared body grammar, and active
native invocation. The child copies that token unchanged into the host's native
reply-correlation field; the token is not a host message ID and does not belong
in the response body. The loaded host adapter names the supported observation
surfaces and maps their structured fields to this predicate.

An owner-directed message is admissible only when its complete original native
object establishes the exact sender, native receiving-owner binding, one
currently authorized token for the bound logical report, operation/report
identity and phase, declared body grammar, and non-relay status when the host
carries a relay discriminator. Immediately retain that native object and its
exact body in existing owner-held invocation state before decoding, semantic
handling, or unrelated work. A successful outer call, delivery receipt, elapsed
window, rendered notification, or job snapshot proves no report.

After retention, apply every provenance check and decode only the complete body
string using encoding `text`, then apply the workflow owner's grammar,
identity, phase, allowance, and authority checks. Consume the logical report
once, across all tokens mapped to it. Duplicate delivery, foreign sender,
wrong receiving owner, stale or wrong token, automatic relay, malformed body,
or unavailable structured evidence is unadmitted and cannot corrupt the
pending operation. Same-sender wrong-token traffic remains ordinary traffic:
retain the observed object, preserve it for ordinary handling, and do not
silently discard or admit it.

A workflow may authorize at most one same-child restatement for one pending
logical report only through its existing recovery policy. Before requesting it,
record one fresh restatement token beside the original token in the existing
invocation state and bind both to the same sender, receiver, operation, report
identity, phase, and grammar. The child may only copy the already-produced,
retained original body byte-for-byte. If those bytes are unavailable, it stops;
it does not regenerate the report, edit, check, rethink, start semantic work,
create another attempt, replace an actor, or reset any allowance. Original and
restatement arrival order is immaterial: admit the logical report exactly once,
and treat the other valid arrival as a duplicate.

## Preserve an observed native return

Immediately after a complete original native message is available through a
host-supported surface, and before body decoding, semantic handling, or
unrelated work, the receiving owner retains the complete native object and the
exact body it actually observed. If owner-side copying fails after native
delivery, preserve that successful delivery history but block admission of that
observation; never relabel it as failed native delivery.

When the workflow already uses immutable content identities, hash the exact
body bytes directly with lowercase SHA-256 and publish any writable snapshot
atomically without overwrite. Never hash reconstructed prose, normalized
newlines, rendered labels, or guessed whitespace.

Each copied original native object remains its provenance record. A frozen
body, digest, locator, rendered card, transcript, backend record, or external
capture alone cannot reconstruct or satisfy sender, receiving owner,
correlation, relay, grammar, identity, phase, or authority checks. Write-less
producers continue returning over their authorized native channel;
receiver-side copying does not change their tools, identity, logical report
count, or semantic ownership.

## Authority and recovery boundary

The workflow owner chooses a host-supported observation surface and owns
admission, continuation, corrections, terminal decisions, and cleanup. A
finite observation window ending without an admissible message leaves the
logical report pending; it is not a missing Handoff or worker failure. Native
terminal facts and the existing recovery policy still govern actual stops.
Neither this reference nor a loaded adapter grants lookup, dispatch, retry,
reattachment, replay, replacement, polling, correction, timeout, or disposal
allowance, and it grants no restatement unless the workflow and recovery policy
explicitly authorize the single exact-copy continuation above.

Never reconstruct or admit a return through an inbox, JSONL or transcript
record, branch/session accessor, RPC message lookup, history or agent output,
rendered card, report store, guessed metadata, or cross-owner access. A host
may name only its original structured observation surfaces and mechanics in its
adapter; rendered text and reconstructed records never satisfy provenance.

Custom controllers that explicitly adopt the sole generic
[execution-recovery policy](../../skills/dev-implementation/references/execution-recovery.md)
still keep all semantic authority in their own contracts. Supported observation
of the same pending operation is continuation; correcting failed machinery
follows that policy; asking a child to act again is not collection recovery.
Active-session transport state is not a durable workflow ledger or restart
authority.
