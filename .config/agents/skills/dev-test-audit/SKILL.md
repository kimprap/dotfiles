---
name: dev-test-audit
description: >
  Run one read-only, two-opinion value audit of an exact permanent test suite
  after dev-ask routes a completed engineering target. Require exact model and
  effort attestations, preserve unknown tests, and stop without cleanup or
  mutation when the target, suite, policy, or transport is not exact.
---

# Engineering Test Audit

Own one non-gating read-only audit of a completed immutable repository target. The audit evaluates permanent-test value under `test-value/v1`; it never changes the suite, reopens completed work, consumes implementation repair, or authorizes cleanup.

## Intake

Require:

- the completed parent outcome and immutable repository target identity;
- one complete permanent-suite manifest with a native artifact locator, digest, discovery boundary, and one stable selector per test;
- `.config/agents/skills/dev-implementation/references/test-value.md` at its exact `test-value/v1` digest;
- the exact `test-audit/v1` protocol identity;
- current native transport evidence for two fresh, distinct opinion children; and
- exactly one Common Handoff receiver.

Read [`references/audit-protocol.md`](references/audit-protocol.md) for every eligible audit. It owns the opinion receipt, bounded candidate index, deterministic aggregation, and Common Handoff projection. [`references/opinion-agent.md`](references/opinion-agent.md) is the sole shared opinion prompt; dispatch it by reference and digest, never by copying or paraphrasing it into a child task.

Return a precise non-mutating stop when the target, suite, policy, or dependency identity is missing, stale, moving, or contradictory. Audit availability and outcome do not affect the completed plan or its assurance receipts.

## Exact opinion pair

Dispatch exactly these two independent roles with no fallback:

| Opinion | OMP agent and role | OMP selector | Grok role | Grok model / reasoning |
|---|---|---|---|---|
| A | `test-audit-opinion-a` / `@test_audit_opinion_a` | `openai-codex/gpt-5.6-sol:xhigh` | `test-audit-opinion-a` | `gpt-5.6-sol` / `xhigh` |
| B | `test-audit-opinion-b` / `@test_audit_opinion_b` | `xai-oauth/grok-4.6:xhigh` | `test-audit-opinion-b` | `grok-4.6` / `xhigh` |

Each role must attest its exact agent name, fresh child identity, requested and resolved model, reasoning, read-only capability/tool boundary, fallback `none`, repository target, suite identity, and policy identity. OMP frontmatter declares exactly the data-access tools `read`, `grep`, and `glob`; native `yield` may be injected solely as result transport, while `task`, write, edit, and shell tools remain unavailable. Grok opinions use `read-only` capability with isolation `none`. Any role, identity, model, reasoning, capability, isolation, fallback, target, suite, or policy mismatch is `transport-unavailable`. Do not dispatch a substitute or accept one opinion as two.

## Procedure

1. Rehash the repository target, suite manifest, and `test-value/v1`; freeze their exact identities before dispatch. A stale or incomplete manifest stops before an opinion runs.
2. Preflight both exact role bindings and their read-only boundaries. Dispatch two fresh children independently only when both preflights pass; give each the same target, suite, policy, protocol, and shared-prompt identities.
3. Require each child to cover every manifest selector exactly once. Keep its complete ledger behind a native child artifact locator and admit only its attestation, coverage proof, ledger digest, and bounded candidate index into controller context.
4. Validate both receipts and distinct child identities. Union every non-`keep` selector from both indexes, then fetch only the exact counterpart ledger rows required for that union.
5. Apply the protocol's deterministic evidence rules. Preserve unsupported, disputed, and `unknown` cases; recommendation count or model identity is never evidence.
6. Rehash the target, suite, and policy after collection. Drift invalidates aggregation and yields a read-only stop rather than a partial result.
7. Emit one existing Common Handoff with both receipt locators, aggregate candidates, unknowns, identities, and no-mutation evidence. Stop. Do not invoke worker closure, verification, review, learning, implementation, shipping, or a cleanup task.

## Boundaries

Never edit, delete, merge, reformat, stage, or run the audited tests. Never inspect child transcripts, share one child's ledger with the other, materialize a full ledger in controller context, infer missing coverage, downgrade a role, retry through another model, or treat `unknown` as deletion authority. Any later test cleanup requires separate approved authority and a new implementation plan.
