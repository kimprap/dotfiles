---
name: recap
description: Produce a concise, high-level recap of a user-specified topic from the current conversation, or of the immediately preceding assistant response when no topic is supplied.
disable-model-invocation: true
---

Treat text attached to the invocation as authoritative for the recap's subject, emphasis, and format.

- If it identifies a recap topic, summarize the relevant confirmed discussion and decisions about that topic, even when the immediately preceding response covers only the latest step.
- Otherwise, use the immediately preceding assistant response as the source and apply any attached emphasis or format request.

Return the shortest plain-language summary that preserves the outcome, confirmed decisions, how the subject works, important caveats, and required actions. Use a short bullet list unless the invocation requests another format. Omit incidental process history and artifact identifiers unless they are part of the answer or explicitly requested. Do not perform new analysis, add claims, change meaning, or revive superseded decisions.
