---
name: completion-presentation
description: Render exactly one current completion-presentation-input fence as a five-field completed report after the calling specialty settles success. Use only when that complete fence already exists; never dispatch, repair, verify, create a Handoff, archive, or present non-success input.
---

# Completion Presentation

## Authority and activation

Apply only when the same calling agent already has exactly one current fenced block whose info string is `completion-presentation-input`. The calling specialty owns completion validity, evidence freshness, papercut and learning accounting, residual risks, plan state, and continuation authority. This skill validates only the fixed input grammar and renders it mechanically.

The caller creates a fence only for a settled successful outcome. Preserve the caller's own stop or non-success report when work is blocked, failed, inconclusive, stale, incomplete, unsafe, or in conflict with current authority. The presenter never turns such a result into completion.

Apply the skill directly in the same agent that built the fence. `completion-presentation` is a terminal route marker, never a dispatched owner.

## Five-field input

The fence contains one JSON object with exactly these five top-level keys in this order:

```completion-presentation-input
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

Do not mix `Papercut: none` with material papercut lines. `Learning: blocked <reason>` is valid only for an ordinary assessment failure that the caller also records under `Risks`. A current governing-rule conflict that makes the implementation invalid or unsafe is non-success, so the caller must not build a completion fence for it.

Do not require a target manifest, Handoff digest, counter, receipt, immutable hash, archive-only locator, Completion Summary locator, or archive gate. The caller may include a useful active plan or artifact path as ordinary human-readable content when it belongs in one of the five fields.

## Mechanical rendering

For valid input, emit only these five H2 sections in order. Preserve every caller string byte-for-byte after its fixed prefix. Render array items in input order on consecutive `- ` lines. Render `Outcome` and `Next` as one `- ` line each.

```markdown
## Outcome

- one concise completed-result statement

## Changes

- one material change

## Checks

- one material terminal check and result
- Papercut: none
- Learning: skipped for compact

## Risks

- none

## Next

- none
```

The sample text identifies bindings; do not emit it literally. Emit no preface, epilogue, code fence, status, State, Evidence, Continuation, Route, approval request, manifest, digest, archive section, raw learning payload, or extra heading.

## Stops

If the current fence is absent, duplicated, malformed, reordered, non-success, or violates any value, papercut, learning, or planned-work rule above, emit no generic completed report. Do not repair, normalize, infer, trim, reorder, or supplement caller values. Return control to the calling specialty's existing report.

The presenter never validates or reruns evidence; discovers or settles papercuts; invokes learning; opens a plan; creates a Handoff; dispatches a task or child; changes lifecycle state; archives; stages; commits; ships; or decides what happens next. It renders one already-settled success input and stops.
