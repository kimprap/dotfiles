# Completion presentation input

This is the canonical input schema and validation contract. Completion callers must read it before building the input they pass to `python3 skill://completion-presentation/scripts/render.py` in a tool call; the input never appears in the reply. The render script checks this format only. Reading this reference does not activate the presenter or settle completion.

## Five-field input

The input is one JSON object with exactly these five top-level keys in this order:

```json
{
  "Outcome": "one concise completed-result statement",
  "Changes": [
    "one material change"
  ],
  "Checks": [
    "one material terminal check and result",
    "Papercut: none",
    "Learning: skipped for compact"
  ],
  "Risks": [
    "none"
  ],
  "Next": "none"
}
```

The example defines the grammar; it is not candidate input.

- `Outcome` and `Next` are nonempty strings.
- `Changes`, `Checks`, and `Risks` are nonempty arrays of nonempty strings.
- Every string is single-line and contains no terminal escape or control character.
- Unknown, duplicate, missing, reordered, empty, placeholder, nested, stale, prior-turn, or additional fields are invalid. There is no compatibility reader.

The calling specialty has already checked that `Changes` accounts for the completed material delta and that `Checks` accounts for all required terminal evidence. For planned work, `Checks` contains `Plan: <active repository plan path> — DONE`; an archive path, archived-plan claim, plan digest, or archive receipt is invalid.

`Checks` also contains:

- every material papercut result in authored-task order, each beginning `Papercut: `; or exactly `Papercut: none` when there is no material result; and
- exactly one learning line: `Learning: curated`, `Learning: no durable learning`, `Learning: blocked <reason>`, or `Learning: skipped for compact`.

Do not mix `Papercut: none` with material papercut lines. `Learning: blocked <reason>` is valid only for an ordinary assessment failure that the caller also records under `Risks`. A current governing-rule conflict that makes the implementation invalid or unsafe is non-success, so the caller must not call the render script for it.

Do not require a target manifest, Handoff digest, counter, receipt, immutable hash, archive-only locator, Completion Summary locator, or archive gate. The caller may include a useful active plan or artifact path as ordinary human-readable content when it belongs in one of the five fields.
