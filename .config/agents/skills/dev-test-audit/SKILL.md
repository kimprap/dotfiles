---
name: dev-test-audit
description: >
  Run one explicit read-only, two-opinion value audit of an exact permanent-test
  portfolio. Accept a complete repository or named-subsystem suite at a frozen
  working-tree manifest or commit; preserve unknown tests and stop without
  cleanup or mutation when intake, policy, or exact transport is ineligible.
---

# Engineering Test Audit

Own one non-gating read-only audit requested explicitly by a user or external scheduler. The audit evaluates a complete repository or named-subsystem permanent-test portfolio under `test-value/v1`; it never changes the suite, changes engineering completion state, consumes implementation repair, or authorizes cleanup. This skill creates no scheduler.

## Intake

Require:

- evidence that the request came explicitly from a user or external scheduler; both origins use the same protocol and differ only as provenance;
- one exact repository target, either a content-addressed working-tree manifest locator/digest or a commit identity;
- one complete permanent-suite manifest with a native artifact locator, digest, discovery boundary, one stable selector and content identity per test, covering either the repository or one named subsystem;
- for a subsystem, its stable name and boundary, with every permanent test inside that boundary enumerated and repository tests outside it explicitly out of scope;
- `.config/agents/skills/dev-implementation/references/test-value.md` at its exact `test-value/v1` digest;
- the exact `test-audit/v1` protocol identity;
- the exact role-table identity below plus current native binding attestations for two fresh, distinct opinion children; and
- exactly one Common Handoff receiver.

A completed plan or parent outcome is optional provenance only. If supplied, bind its identity without inheriting task, attempt, repair, assurance, review, completion, opinion, cleanup, or mutation authority.

Read [`references/audit-protocol.md`](references/audit-protocol.md) for every eligible audit. It owns the frozen tuple, opinion receipt, bounded candidate index, deterministic aggregation, repository-partial subsystem label, and Common Handoff projection. [`references/opinion-agent.md`](references/opinion-agent.md) is the sole shared portable opinion prompt; dispatch it by reference and digest with the controller-supplied role-table identity and binding attestation, never by copying or paraphrasing it into a child task.

Return a precise non-mutating `blocked` outcome before either opinion dispatch when the target or suite boundary is changed-tests-only, incomplete, stale, moving, contradictory, or not content-addressed. Do not publish a partial-portfolio claim. Audit availability and outcome affect only this explicit audit.

## Exact opinion pair

Dispatch exactly these two independent roles with no fallback:

| Opinion | OMP agent and role | OMP selector | Grok role | Grok model / reasoning |
|---|---|---|---|---|
| A | `test-audit-opinion-a` / `@test_audit_opinion_a` | `openai-codex/gpt-5.6-sol:xhigh` | `test-audit-opinion-a` | `gpt-5.6-sol` / `xhigh` |
| B | `test-audit-opinion-b` / `@test_audit_opinion_b` | `xai-oauth/grok-4.6:xhigh` | `test-audit-opinion-b` | `grok-4.6` / `xhigh` |

Each role must attest its exact agent name, fresh child identity, requested and resolved model, reasoning, read-only capability/tool boundary, fallback `none`, target, suite, policy, protocol, and this table identity. OMP frontmatter declares exactly the data-access tools `read`, `grep`, and `glob`; native `yield` may be injected solely as result transport, while `task`, write, edit, and shell tools remain unavailable. Grok opinions use `read-only` capability with isolation `none`. Any role, identity, model, reasoning, capability, isolation, fallback, target, suite, policy, protocol, or table mismatch is `transport-unavailable`. Do not dispatch a substitute or accept one opinion as two.

## Procedure

1. Validate the explicit request and bind the exact target kind/identity and complete repository or named-subsystem suite boundary. Rehash a working-tree target and every manifest identity before dispatch. A changed-tests-only, incomplete, stale, or moving boundary stops with dispatch count zero.
2. Freeze `test-value/v1`, `test-audit/v1`, the portable opinion-prompt digest, this exact role-table digest, and both current native binding attestations. Preflight both read-only boundaries; a binding mismatch stops only this explicit audit as `transport-unavailable`.
3. Dispatch two fresh children independently only when both preflights pass. Give each the same frozen tuple, role-table identity, its own binding attestation, and shared-prompt identity; do not give either the other opinion's output.
4. Require each child to cover every manifest selector exactly once. Keep its complete ledger behind a native child artifact locator and admit only its attestation, coverage proof, ledger digest, and bounded candidate index into controller context.
5. Validate both receipts and distinct child identities. Union every non-`keep` selector from both indexes, then fetch only the exact counterpart ledger rows required for that union.
6. Apply the protocol's deterministic evidence rules. Preserve unsupported, disputed, and `unknown` cases; recommendation count or model identity is never evidence.
7. Rehash the target, suite, and policy after collection. Drift invalidates aggregation and yields a read-only blocked result rather than stale candidates.
8. Emit one existing Common Handoff with request provenance; frozen target and suite identities; scope stated as repository-complete or, for a named subsystem, explicitly repository-partial; both receipt locators; aggregate candidates and unknowns; deterministic evidence; and no-mutation evidence. Stop. Do not invoke worker closure, verification, review, learning, implementation, shipping, or cleanup.

## Boundaries

Never edit, delete, merge, reformat, stage, or run the audited tests. Never inspect child transcripts, share one child's ledger with the other, materialize a full ledger in controller context, infer missing coverage, downgrade a role, retry through another model, treat `unknown` as deletion authority, or use a subsystem result as a repository-wide claim.

Any later explicit cleanup request returns fresh to `dev-ask`. Bounded, cohesive, settled, one-context cleanup may enter planless implementation; broad, dependency-ordered, fan-in, or recovery-sensitive cleanup requires a new Executor Plan. The audit Handoff retains `Cleanup authority: none`, and no prior opinion or lifecycle state grants mutation.

