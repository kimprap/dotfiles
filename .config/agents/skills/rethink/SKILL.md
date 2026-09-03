---
name: rethink
description: >
  Re-evaluate a consequential proposal from first principles. Use only when
  explicitly invoked to challenge the immediately preceding or named idea,
  plan, design, workflow, policy, or mechanism before committing to it.
  Skip ordinary implementation, grilling interviews, and requests that only
  restate values or ask to think harder with no named candidate.
disable-model-invocation: true
---

Treat the candidate—including your own prior answer—as a hypothesis. Separate
the desired outcome from the proposed mechanism. A candidate is that named
idea or prior answer, not a mood, slogan, or transcript dump. Adjectives and
philosophy keywords are desired-outcome flavor, not extra constraints.

Inspect only decision-bearing context. Find relevant existing capabilities,
owners, contracts, prior decisions, and observed failures yourself; do not ask
the user for discoverable facts.

Bind the candidate's desired outcome and every confirmed constraint before
comparing mechanisms. An option is ineligible if it weakens a required
outcome or constraint. When a mechanism is rejected, preserve that outcome
and choose among remaining eligible paths.

Compare only viable, evidence-backed paths across no change, reuse,
extension, bounded test, and new mechanism; do not invent a rung. Treat the
order as a presumption: a later path displaces an earlier eligible path only
when its total lifecycle cost is strictly lower. Choose the eligible path
that covers the residual gap at lowest total lifecycle cost, not fewest
files. For both chosen and displaced paths, count ownership, state,
integration, migration, conflict, review, operating cost, indirection, and
independently editable copies of the same invariant.

New active machinery is a new responsibility, owner, runtime, state, or
invocation surface; it earns `proceed` only when an established required gap
survives every cheaper eligible path. A read-only artifact loaded by existing
owners is an extension when it creates none of those boundaries, but its
loading, integration, and indirection costs still count. Identical
copies that must not diverge may justify one read-only source of truth; do
not centralize merely similar guidance. If value is plausible but unobserved,
use `test`. Do not require a runtime failure for an inspectable constraint
violation. Ignore sunk cost.

Challenge the user's premise and your own equally. Ask only about a remaining
human-owned trade-off.

## Presentation ownership

Perform the reassessment once, then obey exactly one output owner.

- When an already-loaded caller supplies an outer response contract or requires
  only a complete corrected proposal, that caller owns rendering. Use
  `rethink` internally and return only the caller-owned response. Do not emit
  the standalone `rethink:` verdict, `## Findings`, or `## Final proposal`
  wrapper.
- Otherwise use the standalone response below. Subject, scope, and evaluation
  instructions do not change its shape. Only an explicit presentation request
  such as `verdict only`, `delta only`, or `do not restate` may replace it.

## Standalone response

Before rendering, read and follow
[packed-label](../../references/packed-label.md). The mandatory verdict line is
the sole preface outside the packed-label surface.

Lead with exactly one corrected verdict in the form
`rethink: **<verdict>**`, where `<verdict>` is `reject`, `reuse`, `extend`,
`test`, or `proceed`.

Then render exactly these packed-label sections and fields:

- `## Findings`, with required `list` fields in this order: `Existing
  coverage`, `Residual gap`, `Total-cost reason`, `Smallest sufficient path`,
  and `Evidence that would change the verdict`. Each field has exactly one
  concise child.

`Total-cost reason` compares the applicable listed costs on both the chosen
path and displaced alternatives. `Smallest sufficient path` means the
eligible path that covers the residual gap at lowest total lifecycle cost.

- `## Final proposal`, with required `list` fields in this order: `Status` and
  `Proposal`. `Status` has exactly one child selected from `Unchanged`,
  `Revised`, `Replacement`, `Bounded test`, or `No-change decision`. `Proposal`
  has one or more consecutive children, one per operative proposal item.

Restate the complete current proposal or decision set semantically, not merely
its delta: preserve every operative decision, constraint, exclusion, and
required action; incorporate accepted corrections; and omit superseded
alternatives and process narration. When the candidate survives unchanged, use
`Unchanged` and still restate it in full. Use these verdict-specific final
positions:

- `reject`: the complete no-change or alternative decision, without presenting
  the rejected mechanism as operative;
- `reuse`: the complete proposal using existing capabilities;
- `extend`: the complete smallest corrected proposal;
- `test`: the complete bounded test, measurement, decision threshold, and an
  explicit statement that no mechanism is approved yet; or
- `proceed`: the complete candidate, normally marked `Unchanged`.

Do not implement the candidate.
