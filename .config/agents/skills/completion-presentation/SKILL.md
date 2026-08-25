---
name: completion-presentation
description: Render exactly one current completion-presentation-input fence as the fixed completed report after the calling specialty validates terminal completion. Use only when that complete fence already exists; never validate, dispatch, settle, create a Handoff, or present non-success input.
---

# Completion Presentation

## Activation and authority

Apply only when the same calling agent already has exactly one current fenced block whose info string is exactly `completion-presentation-input`. The current work specialty owns routing, completion validity, evidence freshness, papercut settlement, learning qualification, durable references, constraints, residual risk, and continuation authority. This skill owns only a mechanical terminal projection.

Require the caller-validated status exactly `completed`. Never infer completion from a worker result, route, plan status, partial receipt, stale evidence, or caller optimism. Never use this presenter for a block, evidence stop, `wontfix`, authority change, shipping action, learning `BLOCKED`, or any other non-success outcome; preserve that specialty's report instead.

The same agent that builds the current fence applies this skill directly and emits only the rendered report. Never expose the fence as a second user-facing artifact. On a prospective engineering route, `completion-presentation` is only the final projection marker; it is never a dispatchable owner or worker.

## Current fenced input

The current fence contains one JSON object with these eleven keys in this exact order:

```completion-presentation-input
{
  "status": "completed",
  "outcome": "one completed-result sentence",
  "changed": ["one to three openable human or canonical artifacts"],
  "verification": "named check — VERDICT (fetchable evidence locator plus immutable revision or digest)",
  "papercut": "none",
  "learning": "normalized terminal learning value",
  "residual_risk": "none",
  "resume_from": "durable openable locator plus immutable revision or digest",
  "handoff": "existing portable Handoff locator plus immutable revision or approved in-conversation fallback",
  "constraints": "shipping not authorized",
  "next": "none"
}
```

The block above defines the grammar; it is not a candidate input. For the current caller-supplied fence:

- `status` is exactly the string `completed`.
- `changed` is an array of one to three nonempty strings.
- Every other value is a nonempty string.
- Every decoded string, including each `changed` item, contains no C0/C1 control code (`U+0000`–`U+001F`, `U+007F`–`U+009F`) and no Unicode line or paragraph separator (`U+2028`, `U+2029`). Reject CR, LF, NEL, terminal escape sequences, and multiline Markdown injection before activation.
- `constraints` is one or more `; `-separated clauses and contains the exact clause `shipping not authorized` exactly once. It is never `none`.
- `next` is exactly `none` or one exact action and receiver already authorized by the current validated specialty Handoff. Local engineering completion uses `none`. A completed Product Handoff whose current receiver is `dev-ask` uses exactly `dev-ask receives the approved PRD.` Custom specialties preserve their current validated exact action and receiver. Shipping is invalid in `next`.
- Unknown, duplicate, missing, reordered, empty, placeholder, stale, prior-turn, nested, line-breaking/control-bearing, or second candidate fences are invalid.

## Filled-field boundaries

Preserve each accepted control-safe caller value byte-for-byte. Do not summarize, infer, reorder, or repair it. This includes punctuation and approved Handoff syntax: never smarten apostrophes, wrap a value or embedded digest in added backticks or code spans, change link form, or add any other Markdown.
Parse values from the fenced JSON bytes, not from host display wrapping. A resolvable `local://...@sha256:<64 hexadecimal characters>` locator can be portable, but syntax alone does not prove that the artifact exists in the current namespace. Reject an unresolved local candidate. The bound examples are valid and must render; never invent whitespace or a path conversion that rejects them.

1. `outcome` is one human sentence stating the completed result, not a workflow slogan or route history.
2. `changed` names one to three openable human or canonical artifacts, such as an ADR, canonical skill, approved PRD or iteration, changed config, durable receipt, or archived Completion Summary. It is not an implementation manifest.
3. `verification` includes a named check, terminal verdict such as `PASS`, `VERIFIED`, or `APPROVED`, and a fetchable evidence locator with an immutable revision or digest. It claims only what the caller observed.
4. `papercut` is exactly `none`, or the existing `PC-ID`, capture result, and settlement machine fields followed by ` — ` and one concise English gloss. It never invents settlement, mutation, or retry.
5. `learning` is the exact normalized terminal value. Engineering compact is `skipped — compact assurance`; product absence is `skipped — no eligible assessment invoked`; settled `NO DURABLE LEARNING —` and `CURATED —` values pass through byte-for-byte. `BLOCKED` is invalid.
6. `residual_risk` is exactly `none` or only current material uncertainty. Shipping, preservation, and do-not-reopen instructions belong in `constraints`.
7. `resume_from` is a durable repository path or supported fetchable URI plus an immutable revision or digest and optional stable section anchor. Planned engineering work prefers the archived plan Completion Summary; product work prefers the approved PRD or iteration; compact uses an already-produced durable changed artifact or receipt.
8. `handoff` is one existing portable supported fetchable Common or Product Handoff locator plus immutable revision or digest; exact `in-conversation (see Resume from)`; or `in-conversation sha256:` followed by one full SHA-256 digest and ` (see Resume from)`. A bare in-conversation SHA, unresolved `local://` candidate, or absolute host-session filesystem path is invalid. The presenter never creates a Handoff.
9. `constraints` contains caller-supplied current boundaries and the exact `shipping not authorized` clause once. With no additional boundary, the whole value is `shipping not authorized`.
10. `next` follows the current validated Handoff exactly. It never invents delivery, publication, deployment, shipping, or another continuation.

If compact completion has no already-produced durable changed artifact or receipt for `resume_from`, preserve the specialty completion evidence and stop. Never manufacture a plan or filesystem Handoff.

## Mechanical rendering

For valid input, emit exactly the following shape. Replace each lowercase binding with its corresponding fence value. Render `changed` as a nested list under its label, with one nested bullet per item in input order. Use the same nested-list shape for one item. No other current field is an artifact-valued array; keep the scalar locator fields inline.

```markdown
## Completed
- Outcome: the outcome value
- Changed:
  - the first changed value
  - the next changed value, when present

## Evidence
- Verification: the verification value
- Papercut: the papercut value
- Learning: the learning value
- Residual risk: the residual_risk value

## Continuation
- State: complete; no open frontier.
- Resume from: the resume_from value
- Handoff: the handoff value
- Constraints: the constraints value
- Next: the next value
```

The words `the outcome value` and similar phrases identify bindings, not literal output. The only H2 headings are `Completed`, `Evidence`, and `Continuation`, in that order. Emit no preface, epilogue, code fence, Route, approval request, fourth heading, task totals, counters, manifests, gates, raw curation payload, or internal lifecycle mechanics.

## Bound examples

Compact:

```markdown
## Completed
- Outcome: Ghostty's Cmd-K binding clears the terminal as intended.
- Changed:
  - `.config/ghostty/config`

## Evidence
- Verification: Ghostty config load and Cmd-K smoke — PASS (`.config/ghostty/config@sha256:6ef1f5a019a2021af780e7bbc77d180b841ae2dbacf23808002ad0eceb98f1b4`)
- Papercut: none
- Learning: skipped — compact assurance
- Residual risk: none

## Continuation
- State: complete; no open frontier.
- Resume from: `.config/ghostty/config@sha256:6ef1f5a019a2021af780e7bbc77d180b841ae2dbacf23808002ad0eceb98f1b4`
- Handoff: in-conversation (see Resume from)
- Constraints: shipping not authorized; preserve unrelated user-owned work.
- Next: none
```

Standard or high-consequence:

```markdown
## Completed
- Outcome: Portable session envelope, continual-learning, and generic completion presentation are live; the archived plan is DONE.
- Changed:
  - `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md#d27--session-lifecycle-envelope-and-portable-workflow-owners`
  - `.config/agents/skills/continual-learning/SKILL.md` + `.config/agents/skills/completion-presentation/SKILL.md`
  - `.agents/plans/archive/2026-08-20-2012_session-lifecycle-envelope.md#completion-summary`

## Evidence
- Verification: all three T3 criteria — VERIFIED; final Standards and Specification review — APPROVED (`.agents/plans/archive/2026-08-20-2012_session-lifecycle-envelope.md@sha256:a06c625ece27cb6b725620a62049d46668ad2f11e7344f27e1746798df448dee#completion-summary`)
- Papercut: none
- Learning: NO DURABLE LEARNING — no impacted durable rule or guidance needed an update
- Residual risk: possible same-model or model-family assurance dependence; unrelated dirty hunks remain user-owned

## Continuation
- State: complete; no open frontier.
- Resume from: `.agents/plans/archive/2026-08-20-2012_session-lifecycle-envelope.md@sha256:a06c625ece27cb6b725620a62049d46668ad2f11e7344f27e1746798df448dee#completion-summary`
- Handoff: in-conversation sha256:165de40892bdec9d5d330e913e7ec61bcbe977d3eac43a0b706e957b194cd049 (see Resume from)
- Constraints: do not reopen completed stages; shipping not authorized; preserve unrelated user-owned work.
- Next: none
```

## Stops and lifecycle boundaries

Emit no generic completed report when the current fence is absent, stale or prior-turn, duplicated, malformed, reordered, nested, or contains an unknown, duplicate, missing, empty, placeholder, line-breaking, or C0/C1-control-bearing value; when `changed` has zero or more than three items; when `resume_from` is missing, mutable, non-durable, or not openable; when `handoff` is a bare SHA, an unresolved `local://` candidate, an absolute host-session path, missing its immutable identity, or otherwise unsupported; when `constraints` is `none`, omits `shipping not authorized`, or contains that clause more than once; when `next` is unauthorized or shipping-bearing; when status is not `completed`; or when learning is `BLOCKED`.

The presenter never decides or reopens completion; validates or reruns evidence; settles papercuts; invokes learning; inspects manifests, counters, receipts, Context Packs, or backend attempts; infers approval or shipping; creates a task, dispatch, child, state, transition, approval, route completion, adapter, workflow, plan, or Handoff; or receives a Task Contract, Context Pack, backend attempt, or Handoff.

Run from this same body for engineering, product, custom, and direct specialties. Do not load repository ADRs or workflow documents or require a host adapter. Host invocation syntax may differ; activation, input, stops, and output grammar do not.
