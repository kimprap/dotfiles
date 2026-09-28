---
name: completion-presentation
description: Render one settled five-field completion input as the completed report by passing it to the render script in a tool call and replying with the script output exactly. Use only after the calling specialty settles success; never write the input in the reply, dispatch, repair, verify, create a Handoff, archive, or present non-success input.
---

# Completion Presentation

## Authority and activation

Apply only when the same calling agent has settled a successful outcome and holds its one current five-field input. The calling specialty owns completion validity, evidence freshness, papercut and learning accounting, residual risks, plan state, and continuation authority. The render script checks only the fixed input format and renders it mechanically.

The caller calls the render script only for a settled successful outcome. Preserve the caller's own stop or non-success report when work is blocked, failed, inconclusive, stale, incomplete, unsafe, or in conflict with current authority. The presenter never turns such a result into completion.

Apply the skill directly in the same agent that settled success. `completion-presentation` is a terminal route marker, never a dispatched owner.

## Input contract

Read [the canonical input contract](../../references/completion-presentation-input.md). That reference owns the schema and validation rules; callers read it before building the input without activating this skill.

Pass the input as JSON on standard input to `python3 skill://completion-presentation/scripts/render.py` in one tool call (`bash` or `eval`), for example with a quoted heredoc. Never write the input in the reply, before or after the report.

## Mechanical rendering

On exit 0 the script prints only these five H2 sections in order. It preserves every caller string byte-for-byte after its fixed prefix, renders array items in input order on consecutive `- ` lines, and renders `Outcome` and `Next` as one `- ` line each.

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

The sample text identifies bindings; it is not output. The final reply is the script's standard output copied exactly. Emit no preface, epilogue, code fence, status, State, Evidence, Continuation, Route, approval request, manifest, digest, archive section, raw learning payload, input, or extra heading.

## Stops

A non-zero exit, like an absent or non-success input, means no completion report: the script prints nothing, and the caller's own stop report stands. Do not repair, normalize, infer, trim, reorder, or supplement caller values, and do not retry with altered input.

The presenter never validates or reruns evidence; discovers or settles papercuts; invokes learning; opens a plan; creates a Handoff; dispatches a task or child; changes lifecycle state; archives; stages; commits; ships; or decides what happens next. It renders one already-settled success input and stops.
