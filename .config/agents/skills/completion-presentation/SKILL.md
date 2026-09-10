---
name: completion-presentation
description: Render exactly one current completion-presentation-input fence as a five-field completed report after the calling specialty settles success. Use only when that complete fence already exists; never dispatch, repair, verify, create a Handoff, archive, or present non-success input.
---

# Completion Presentation

## Authority and activation

Apply only when the same calling agent already has exactly one current fenced block whose info string is `completion-presentation-input`. The calling specialty owns completion validity, evidence freshness, papercut and learning accounting, residual risks, plan state, and continuation authority. This skill validates only the fixed input grammar and renders it mechanically.

The caller creates a fence only for a settled successful outcome. Preserve the caller's own stop or non-success report when work is blocked, failed, inconclusive, stale, incomplete, unsafe, or in conflict with current authority. The presenter never turns such a result into completion.

Apply the skill directly in the same agent that built the fence. `completion-presentation` is a terminal route marker, never a dispatched owner.

## Input contract

Read [the canonical input contract](../../references/completion-presentation-input.md) and validate the current fence against it. That reference owns the schema and validation rules; callers read it before construction without activating this skill.

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

If the current fence is absent, non-success, or invalid under the canonical input contract, emit no generic completed report. Do not repair, normalize, infer, trim, reorder, or supplement caller values. Return control to the calling specialty's existing report.

The presenter never validates or reruns evidence; discovers or settles papercuts; invokes learning; opens a plan; creates a Handoff; dispatches a task or child; changes lifecycle state; archives; stages; commits; ships; or decides what happens next. It renders one already-settled success input and stops.
