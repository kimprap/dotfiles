---
name: recap
description: Produce a concise, high-level recap of a user-specified topic from the current conversation, or of the immediately preceding assistant response when no topic is supplied.
disable-model-invocation: true
---

Treat text attached to the invocation as authoritative for the recap's subject, emphasis, and format.

- If it identifies a recap topic, summarize the relevant confirmed discussion and decisions about that topic, even when the immediately preceding response covers only the latest step.
- Otherwise, use the immediately preceding assistant response as the source and apply any attached emphasis or format request.

Return the shortest plain-language summary that preserves the outcome,
confirmed decisions, how the subject works, important caveats, and required
actions. Omit incidental process history and artifact identifiers unless they
are part of the answer or explicitly requested. Do not perform new analysis,
add claims, change meaning, or revive superseded decisions.

An attached format request is authoritative and bypasses the default structure
selection. Without one, identify the recap's content roles rather than counting
bullets or words:

- For one homogeneous role or theme, use the shortest readable plain-language
  shape, normally a short paragraph or plain bullet list, with no unnecessary
  heading or label.
- For multiple distinct roles or themes, read and follow
  [packed-label](../../references/packed-label.md), then use content-derived H2
  titles, field labels, field order, and `list` children.

State, behavior, decisions, caveats, boundaries, and required actions are
examples of content roles, not fixed labels. Do not impose recap-specific
fields or a mandatory heading. Every structured surface must follow the
packed-label grammar. Never render an inline pseudo-label such as
`- **Status:** ...` or `**Status:** ...`.
