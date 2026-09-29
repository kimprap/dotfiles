---
name: dev-test-audit
description: >
  Run an explicit read-only permanent-test audit with persistent A-first review,
  first-return-only rethink, B only for remaining findings, proposal exchange to
  agreement or a named liveness stop, and original-A closure when available.
---

# Engineering Test Audit

Own one explicit manual audit of permanent-test value. The audit is read-only and does not itself gate implementation or authorize cleanup. It never starts automatically, mutates the suite, runs audited tests, grants implementation authority, or substitutes for normal code review or verification.

Read `skill://dev-test-audit/references/audit-protocol.md` before starting an audit. It is the sole audit-loop contract. Both persistent opinion wrappers read only `skill://dev-test-audit/references/opinion-agent.md`. Permanent-test value itself remains owned only by `skill://dev-implementation/references/test-value.md`; do not copy its policy here.

## Intake and scope

Require an explicit manual audit request, a readable repository target, and the current initial Route Overview approval.

- If the requester names a scope, that scope wins.
- Otherwise audit the complete permanent-test portfolio.
- Before asking for that Route Overview approval, show the exact audit scope and the ordered list of every in-scope permanent-test file.
- State every exclusion. Do not imply that an explicit subset represents the whole repository.
- Do not launch auditor A or B before approval. After approval, keep the target, scope, and ordered file list unchanged.

Stop read-only if scope cannot be enumerated, the target or boundary moves, approval is missing or stale, required repository evidence is unavailable, or authority conflicts. No completed plan, implementation attempt, review result, or cleanup request is required to ask for an audit, and none is inherited as mutation authority.

## Boundaries

Keep only the bound scope, current proposals, persistent auditor identities, and final lean Handoff needed by this loop; add no compatibility layer or voting authority. Never use audit opinion count as evidence. Preserve `unknown` files and all work at a named stop. Audit output alone changes no implementation, attempt, review, verification, completion, shipping, or plan state.