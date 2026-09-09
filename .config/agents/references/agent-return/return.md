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

### Controller ordinary completion

The invoking controller's `hub wait` and `hub send` (await) receipts are not
the producer envelope. Recorded ordinary-completion receipts carry native job
identity and status (`jobs[].id`, `jobs[].status`, `jobs[].type`,
`jobs[].resolvedModel`) plus a rendered `resultText` or `waited.body` string.
Those rendered strings are host `<task-result>` wrappers with extra prose, not
a predeclared payload field. Do not scrape `<output>` blocks, JSON slices,
last fences, concatenated transcripts, last-turn assistant text, or arbitrary
nested keys from them.

After that wait admits the exact owned child (`jobs[].id` equals the retained
child and `jobs[].status` is `completed`), read `agent://<that-id>` once
before any further dispatch to that child. That native read returns the
structured completed-result object without the display wrapper. Pass that
object to `decode.py` as encoding `response_object`. It is the same payload as
producer `details.data`.

`agent://<id>` is the latest ordinary result for that exact child. A later
yield replaces it. Binding is the wait-then-read before further dispatch, not
a later mutable guess, `?q=` extraction, or nested path. If wait does not
admit that child, do not read `agent://` for this expectation. There is no
separate historical per-request payload store.

### Owner-directed messages

After IRC provenance (`from`, `to`, and message id), the native message body
is the complete `waited.body` string. Use encoding `text`. This file does not
map those acts onto workflow passes.

No child-wide output schema. Each expected return is checked call-locally by
the owning controller against native provenance, then this declared body,
then workflow identity, format, and authority.
