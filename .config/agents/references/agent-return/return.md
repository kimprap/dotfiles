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
- **Report observation and admission** first obtains one original native return,
  then validates its provenance, declared body, identity, phase, and authority.
  Delivery or outer-call success alone is not admission.
- **Native return retention** immediately preserves the complete original current
  native return and its exact returned body when observed. No later or
  reconstructed source can replace that current return.
- **Exact disposal** releases the exact owned child through the host lifecycle
  and requires the workflow owner's prescribed disposal evidence. A message,
  report, turn completion, retention record, cancellation request, or echo is
  not disposal.

An owner-directed message and an ordinary completion are distinct publication
acts. Neither automatically satisfies the other or ends the logical operation.
A local echo may aid inspection only when a workflow requires it; it never gains
report authority.

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

### Owner-directed messages

The owner authors a unique correlation token and binds it to the exact
operation, child, receiving owner, expected return, current semantic phase, and
active native invocation. The child copies that token unchanged into the host's
native reply-correlation field; the token is not a host message ID and does not
belong in the response body.

Before dispatch, bind the exact child, receiving owner, fresh authored token,
expected return, current semantic phase, and current native invocation. The host
collector must exist before the owner-authored request is delivered.

When that operation returns, inspect the complete native result before accessing
a body. Check operation errors, the requested recipient's delivery receipt,
details and returned-message presence, exact native sender and recipient, the
current authored token, and any native relay discriminator required by the host
adapter. A successful outer call or delivery receipt proves no reply.

When the original current native result contains the expected returned message,
immediately transfer that complete object and its exact returned body
mechanically into current owner-held invocation state before decoding, semantic
handling, or unrelated work. If the returned message is absent, leave the
expectation unresolved and unadmitted. Preserve its token, identities, phase,
delivery facts, and used or unknown allowances; do not access a body,
reconstruct, salvage, poll, replay, resend, request re-emission, create a
replacement collector, replace an actor, or reset an allowance.

After the current native object is copied, apply the full native provenance
checks and decode only its complete body string using encoding `text`, then
apply the workflow owner's grammar, identity, phase, allowance, and authority checks.
Consume an admitted token once. A duplicate, foreign sender or recipient, stale
or consumed token, automatic relay, rendered notification, transcript, local
echo, ordinary output, latest-child output, or host completion field is not an
alternative payload source.

## Preserve an observed native return

Immediately after the original current native return is available, and before
body decoding, semantic handling, or unrelated work, the receiving owner retains
the complete native object and the exact returned body it actually observed. If
owner-side copying fails after native delivery, preserve that successful
delivery history but block workflow admission; never relabel it as failed native
delivery.

When the workflow already uses immutable content identities, hash the exact
body bytes directly with lowercase SHA-256 and publish any writable snapshot
atomically without overwrite. Never hash reconstructed prose, normalized
newlines, rendered labels, or guessed whitespace.

The copied original native return remains the provenance record. A frozen body,
digest, locator, rendered card, transcript, backend record, or external capture
alone cannot reconstruct or satisfy sender, recipient, correlation, relay,
grammar, identity, phase, or authority checks. Write-less producers continue
returning over their authorized native channel; receiver-side copying does not
change their tools, identity, send count, or semantic ownership.

## Authority and recovery boundary

The workflow owner chooses a host-supported collector and owns admission,
continuation, corrections, terminal decisions, and cleanup. An absent original
current native returned message fails closed at the exact unresolved frontier.
Neither this reference nor a loaded adapter grants lookup, dispatch, retry,
reattachment, replay, re-emission, replacement, polling, correction, timeout, or
disposal allowance.

Never reconstruct or admit a return through an inbox, event, JSONL or transcript
record, branch/session accessor, RPC message API, history or agent output,
rendered card, report store, guessed metadata, or cross-owner access. A host may
name its own mechanics only in its adapter; this portable contract selects only
the original current native return.

Custom controllers that explicitly adopt the sole generic
[execution-recovery policy](../../skills/dev-implementation/references/execution-recovery.md)
still keep all semantic authority in their own contracts. Supported observation
of the same pending operation is continuation; correcting failed machinery
follows that policy; asking a child to act again is not collection recovery.
Active-session transport state is not a durable workflow ledger or restart
authority.
