---
name: dev-test-audit
description: >
  Run an explicit read-only permanent-test audit with persistent A-first review,
  first-return-only rethink, B only for remaining findings, proposal exchange to
  agreement or a named liveness stop, and original-A closure when available.
---

# Engineering Test Audit

Own one explicit manual audit of permanent-test value. The audit is read-only and does not itself gate implementation or authorize cleanup. It never starts automatically, mutates the suite, runs audited tests, grants implementation authority, or substitutes for normal code review or verification.

Read `skill://dev-test-audit/references/audit-protocol.md` before starting an audit. It is the sole audit-loop contract. Both persistent opinion wrappers read `skill://dev-test-audit/references/opinion-agent.md`. Permanent-test value itself remains owned only by `skill://dev-implementation/references/test-value.md`; do not copy its policy here.

## Intake and scope

Require an explicit manual audit request, a readable repository target, and the current initial Route Overview approval.

- If the requester names a scope, that scope wins.
- Otherwise audit the complete permanent-test portfolio.
- Before asking for that Route Overview approval, show the exact audit scope and the ordered list of every in-scope permanent-test file.
- State every exclusion. Do not imply that an explicit subset represents the whole repository.
- Do not launch auditor A or B before approval. After approval, keep the target, scope, and ordered file list unchanged.

Stop read-only if scope cannot be enumerated, the target or boundary moves, approval is missing or stale, required repository evidence is unavailable, or authority conflicts. No completed plan, implementation attempt, review result, or cleanup request is required to ask for an audit, and none is inherited as mutation authority.

## A-first orchestration

Use the protocol's exact sequence:

1. After the Route Overview is approved, start persistent `test-audit-opinion-a` alone on the complete bound file list.
2. After A's first complete outer-loop return, send `~/.agents/references/impl-rethink/test-rethink.md` to the same A exactly once.
3. If A's revised proposal has no findings, accept and stop without B.
4. Otherwise start persistent `test-audit-opinion-b` with the same boundary and A's revised proposal.
5. After B's first complete outer-loop return, send `~/.agents/references/impl-rethink/test-rethink.md` to the same B exactly once.
6. If they do not yet agree, alternate proposal revisions between the same persistent A and B. Later turns contain proposals only; never send rethink again.
7. Agreement accepts. Synchronize the other live auditor with the accepted proposal.

Every proposal accounts for every scoped file in order with `reviewed` or `skipped: <reason>` and a `keep | merge | remove | unknown` disposition. Detailed evidence, closest coverage, stable seam, independent oracle, plausible bug or concrete absence, uncertainty, and destination appear only for findings or unknown-value tests. A skipped file is `unknown` and remains preserved. These are output fields interpreted by reference to `skill://dev-implementation/references/test-value.md`, not a second policy.

During proposal exchange, stop on exactly the named liveness conditions: unchanged/repeated proposals, non-applicable revision, persistent blockage, lost reviewer, or authority conflict. Do not pick a winner, add a round cap, replace a lost auditor, or mutate to resolve disagreement. Post-batch original-A unavailability follows the nonblocking closure rule below instead.

## Read-only result and later fixes

Return the accepted complete proposal or named liveness stop in one lean `dev-handoff` envelope. Audit roles make no repository or external-state changes.

Accepted `merge` or `remove` fixes return to `dev-ask`. One Route Overview must approve the exact fix batch and choose the direct or planned implementation route. The default is one separately approved mutation batch and only the human may adjust that allowance. Prior audit agreement does not itself permit the batch.

After an approved batch, original A performs one read-only audit-specific closure before normal final review or verification. Original A checks only the accepted fixes and preserved value, returns `CLOSED | NOT CLOSED | INCONCLUSIVE`, and cannot add findings or authorize repair. If original A is unavailable only at this closure boundary, omit audit-specific closure, report `original-A closure unavailable`, do not substitute or claim closure, and continue the approved route's normal assurance. Never open a second batch.

## Boundaries

Keep only the bound scope, current proposals, persistent auditor identities, and final lean Handoff needed by this loop; add no compatibility layer or voting authority. Never use audit opinion count as evidence. Preserve `unknown` files and all work at a named stop. Audit output alone changes no implementation, attempt, review, verification, completion, shipping, or plan state.