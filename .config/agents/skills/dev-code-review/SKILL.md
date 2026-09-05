---
name: dev-code-review
description: >
  Run one independent tests-first review of an exact standard- or high-assurance
  candidate before verification. Account for every changed file, require direct
  material evidence and executable closure checks, and never rerun after repair.
---

# Engineering Code Review

Own one read-only review of one exact candidate before its independent verifier. Review runs once for standard or high assurance; compact work is ineligible. It never repairs, mutates, executes acceptance checks, ships, or reruns after a repair.

## Intake

Require:

- the exact candidate revision or working-tree snapshot and environment;
- the governing requirements, acceptance, constraints, non-goals, and applicable project rules;
- the complete changed-file list for that candidate, including changed tests, generated files, and deletions;
- the semantic attempt number and whether attempt 2 remains available;
- the responsible implementation owner; and
- the intended independent verifier.

The review must precede verification. Missing or contradictory authority, an unstable target, an incomplete changed-file boundary, or unavailable evidence needed to decide correctness produces `INCONCLUSIVE`; it does not authorize inference or repair.

At the start, read and follow [`references/review-rethink.md`](references/review-rethink.md). It is the read-only wrapper for the installed code and test rethink cores. Do not copy their policy into this skill.

## One review pass

Inspect the entire changed-file boundary once, in this fixed order:

1. **Tests.** Read changed tests first. Identify the observable behavior they claim to protect, gaps that can hide a changed behavior, and assertions that could pass while the product is wrong.
2. **Contract and correctness.** Trace the approved success, boundary, error, and state-transition behavior through changed code and callers. Check every requirement, invariant, constraint, scope boundary, and preserved behavior affected by the change.
3. **Changed-test value.** Apply the sole permanent-test policy referenced by the test rethink core to every changed permanent test. Record `keep | merge | remove` and its required policy basis. A changed test requires repair only when direct evidence shows that it creates material false confidence in the permanent suite.
4. **Readability, ownership, reuse, and architecture.** Apply the code rethink core. Prefer the existing owner and local pattern, and flag structure only when evidence ties it to a governing rule, invariant, or observable failure. Otherwise omit it or make it advisory.
5. **Security and performance, when relevant.** Inspect these only where the changed behavior, data, trust boundary, resource use, governing authority, or direct evidence makes them relevant. Security, privacy, data-loss, or contract-bound performance risk may require repair; speculation does not.

Account for every changed file exactly once in a table with:

```text
path | role in the change | axes inspected or not applicable | required finding IDs, advisory IDs, or clear
```

A deleted file is still a row. `Not applicable` must name why the axis cannot affect that file. An omitted, duplicate, or unexplained file makes the review `INCONCLUSIVE`.

## Finding bar

A finding is **required** only for direct evidence of at least one of:

- an observable behavior or invariant failure;
- a security, privacy, or data-loss risk;
- a violation of governing scope, requirements, or project rules; or
- a changed permanent test that creates material false confidence.

Taste, nits, optional architecture, file or line counts, mandatory praise, and unrelated cleanup are advisory or omitted. Performance is required only when direct evidence establishes a violated requirement or observable invariant. Do not turn a preference, unsupported suspicion, or possible future issue into repair work.

Every required finding uses a stable ID and all of these fields:

```text
ID: CR-<number>
Location: <exact path and line, symbol, or deleted surface>
Violated requirement/rule/invariant: <exact authority>
Direct evidence: <observed or static causal evidence>
Smallest safe correction: <bounded change that closes only this finding>
Behavior: <observable closure condition>
Check: <command or direct static proof>; expect <exact result>
```

The final two lines are the direct closure check and must use that grammar exactly. The reviewer does not run it. Advisories are labeled `Advisory`, cite evidence, and carry no repair or closure obligation.

## Verdict

Emit exactly one overall verdict:

- `APPROVED` — the target and authority are sufficient, every changed file is accounted for, and there are no required findings;
- `REPAIR REQUIRED` — at least one complete required finding meets the materiality bar; or
- `INCONCLUSIVE` — the review cannot reach a reliable material verdict from the fixed boundary and available evidence.

Do not emit another verdict vocabulary or combine `INCONCLUSIVE` with approval. Advisories never change `APPROVED` to `REPAIR REQUIRED`.

## One clarification, never a rerun

The controller may ask the same reviewer once to complete missing fields or direct evidence from the reviewer's existing discovery. The clarification may complete an already named finding, advisory, or changed-file row and may resolve an output-format omission. It cannot inspect a new target, add a finding, change the scope, restart discovery, or perform a second review.

A second incomplete response, a lost reviewer, or an unchanged `INCONCLUSIVE` stops the route. A repaired target goes directly to the verifier; the reviewer never sees it. A false-positive required finding may therefore consume attempt 2 and is prevented by the materiality and evidence bar, not by another review loop.

## Handoff and next owner

Return one lean `dev-handoff` envelope. In `Outcome`, include the verdict, complete changed-file accounting, required findings, and advisories. `Changed targets/effects` is `none; read-only review`. In `Checks`, reproduce every required finding's closure check and record `Observed: not run by reviewer; assigned to verifier`. Name uncertainty or the exact stop in `Blocker/risk`.

- `APPROVED` goes to the independent verifier with every original acceptance check.
- `REPAIR REQUIRED` goes to the responsible implementation owner only when attempt 2 remains. After that owner's same-worker rethink and repair, the target goes directly to the same intended verifier with the original acceptance checks and every review closure check.
- `REPAIR REQUIRED` without attempt 2, or a terminal `INCONCLUSIVE`, stops with completed work preserved.

Never route a repaired target back to review.