---
name: dev-continual-learning
description: Run one engineering terminal learning assessment after standard or high review and verification. Adapt lean settled evidence to portable continual-learning, skip compact work, and never retry or turn ordinary learning failure into an implementation blocker.
---

# Engineering Continual Learning

## Route position

Keep `dev-continual-learning` as the sole route-visible engineering learning owner. Standard and high assurance invoke it exactly once after the one `dev-code-review` and a final `VERIFIED` result from `dev-verification`. Compact invokes neither this adapter nor portable `continual-learning` and records `Learning: skipped for compact` at completion.

A separately authorized engineering Deep request may use this adapter in portable `deep` mode. It is a new explicit maintenance route, not a second assessment of the completed implementation.

## Lean intake

For terminal `assess`, require only:

- the settled implementation outcome, completed one-shot review, and final `VERIFIED` result;
- every affected path;
- the lean Handoffs in authored-task and stage order;
- every papercut result from completed repository-work boundaries; and
- every complete Learning Candidate, with incomplete candidates identified as evidence only.

Do not require or carry target manifests, rule manifests, digests, counters, receipts, role slots, retry identities, archive locators, or a second recovery envelope. Reject a duplicate assessment for the same engineering outcome before portable invocation.

## One portable invocation

Invoke portable `continual-learning` once in `assess` mode with the lean intake. Preserve its qualification, curation, redaction, destination authority, validation, and papercut-ID boundaries. Do not prequalify candidates or fork portable policy in this adapter.

There is no semantic or transport retry, resume loop, second curator, or second portable call. A missing dependency or ordinary assessment/curation failure is returned once as `blocked <reason>`.

## Result and completion impact

Normalize the portable terminal status to exactly one completion check line:

- `Learning: curated`
- `Learning: no durable learning`
- `Learning: blocked <reason>`

`curated` and `no durable learning` permit completion. An ordinary `blocked <reason>` also permits completion and the same reason is reported as residual risk. Stop completion only when the assessment establishes a current governing-rule conflict that directly makes the settled implementation invalid or unsafe; return that conflict to the governing authority instead of constructing completion input.

After portable learning returns its one terminal status, explicitly load
`skill://dev-handoff` before composing the adapter return. Compose one lean
Handoff on the first return: one `# Handoff:` title followed by `## Outcome`,
`## Changed targets/effects`, `## Checks`, `## Blocker/risk`, and
`## Next receiver` exactly once and in that order. Put the portable assessment
evidence and exactly one matching `Learning: curated`,
`Learning: no durable learning`, or `Learning: blocked <reason>` line inside
`Checks`; do not invent implementation acceptance IDs. Name the bound concrete
lifecycle controller as the sole next receiver.

Before sending, check the unsent envelope against the loaded canonical Handoff
contract and fix that draft in place if needed. Do not invoke portable
`continual-learning` again, ask it to re-emit a report, or create a second
assessment or Handoff. Include any guidance paths changed by curation,
candidate-specific papercut dispositions, and the exact residual or governing
conflict in the canonical fields. The adapter never reads or writes the
papercut ledger, reruns review or verification, repairs implementation,
presents completion, or ships.

If curation changed repository material, that completed Handoff is itself a repository-work boundary: load `papercut` once afterward under the generic scheduling rule. That look never triggers another learning assessment.
