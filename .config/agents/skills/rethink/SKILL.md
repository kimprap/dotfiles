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

Map every proposed responsibility to current coverage. Compare, in order: no
change, reuse, the smallest extension, a bounded test, then a new mechanism.
New machinery earns `proceed` only when an observed required gap survives the
first three options. If value is plausible but unobserved, lead with `test`,
not `reject`; commit to no mechanism and state the bounded measurement that
would decide it. Count ongoing ownership, state, integration, migration,
conflict, review, and operating cost. Ignore sunk cost; do not preserve a
weaker proposal merely to justify prior work.

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

Lead with exactly one corrected verdict in the form
`rethink: **<verdict>**`, where `<verdict>` is `reject`, `reuse`, `extend`,
`test`, or `proceed`.

Then render `## Findings` with these concise entries:

- **Existing coverage:** current owners and capabilities;
- **Residual gap:** the observed requirement still unmet;
- **Total-cost reason:** ownership, state, integration, migration, conflict,
  review, and operating cost;
- **Smallest sufficient path:** the selected no-change, reuse, extension, test,
  or new mechanism; and
- **Evidence that would change the verdict:** the concrete contrary evidence.

Follow with `## Final proposal`, a `**Status**` value, and `**Proposal**` in
the structure appropriate to the content. Restate the complete current proposal
or decision set semantically, not merely its delta: preserve every operative
decision, constraint, exclusion, and required action; incorporate accepted
corrections; and omit superseded alternatives and process narration. Choose
the accurate status from `Unchanged`, `Revised`, `Replacement`, `Bounded test`,
or `No-change decision`. When the candidate survives unchanged, use
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
