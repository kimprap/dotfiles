# Agent return

Shared declared-body and native-payload rules only. Load this file before
the first return and apply it for every requested return. It is not a skill
stage, broker, envelope, or lifecycle controller.

Installed root: `~/.agents/references/agent-return/return.md`. The decoder is
`decode.py` beside this file. Workflow owners keep pass selection, admission
state, correction budgets, and channel mapping.

## Declared bodies

Choose one encoding before delivery. Do not try another encoding if the first
does not validate.

1. Text body: the complete response is one string.
2. Exactly one string `response` field: `{"response": "<complete unchanged text>"}`.

Preserve exact body text, including legitimate newlines, Unicode, and quotes.
Do not recursively unwrap, concatenate transcripts, select among competing
payload fields, or repair semantic content.

## Four distinct acts

These are four different acts. None implies another.

- Owner-directed message: delivers one message to the bound owner. It does
  not complete a turn and does not dispose a child.
- Ordinary turn completion: produces one ordinary completed result. It does
  not dispose a child.
- Echo-only local end: after an authoritative owner message, repeat the exact
  same text once as the final in-conversation message, then stop. The echo is
  not authority and is not an ordinary completion.
- Owner disposal: the owner releases the exact owned child. Not implied by
  send, ordinary completion, or echo.

## Native payload extraction

Decode host serialization only at this documented seam, then the predeclared
body. Never heuristically try encodings.

### Producer ordinary completion

The child yield `toolResult.details` object is the producer envelope. Admit
it only when every one of these holds:

- `status` is exactly `success`
- `type` is absent
- `useLastTurn` and `schemaOverridden` are absent or false
- `data` is one object

After that metadata admission, the documented payload is only `details.data`.
Pass only that field to `decode.py` as encoding `response_object`. Do not pass
the details envelope. Do not try encoding `text` if `response_object` fails.
A present `type`, incremental array `type`, scalar no-data completion,
missing/non-object `data`, or the details envelope itself is not this payload.

### Owner-directed messages

For an owner-directed IRC request, the owner authors a unique correlation
token and includes it in the request packet. The child replies with `hub send`
to the bound owner and `replyTo` equal to that supplied token, copied unchanged.
The token is not a native message ID. The response grammar remains entirely in
`message`, with no added correlation field or header.

Collect the native `waited` message on awaited send or `hub wait`, or each
native `inbox[]` message on queued collection. Check `from` against the exact
owned child, `to` against this owner, and `replyTo` against the current authored
token. Reject `wakeRelay: true`; it is not an explicit child report. Consume a
valid token once; no duplicate can be admitted again. Decode only that message's
complete `body` string using encoding `text`. Native
renderings may expose the message ID, sender and reply tag with the body;
the enclosing owner-bound receipt supplies the recipient. Do not parse those
transport labels as response text or choose among competing payloads.

A correlated message proves delivery of that report, not successful terminal
completion of its producing turn. No native send-receipt ID, incoming native
message ID, host completion field, bootstrap-job lookup, latest-child `agent://`
output, local echo, or transcript is required or an alternative payload source.
Workflow owners keep token issuance, pass authority and invalid-return handling;
this file does not map acts to passes.

No child-wide output schema. Each expected return is checked call-locally by
the owning controller against native provenance, then this declared body,
then workflow identity, format, and authority.
