# Manual permanent-test audit protocol

This protocol owns the explicit, read-only, A-first audit loop. Permanent-test value is defined only by `skill://dev-implementation/references/test-value.md`. Proposal rows, accounting, applicable stop results, and closure results are defined only by `skill://dev-test-audit/references/opinion-agent.md`. This protocol defines scope, turn order, agreement, routing, and audit-specific closure scheduling without copying that policy or those result shapes. Persistent opinion children read only the opinion-agent contract; they do not load this scheduling protocol.

## Bound scope

An audit starts only from an explicit manual request. Before the existing initial Route Overview approval:

1. Use the requester's explicit test scope when present; otherwise use the repository's complete permanent-test portfolio.
2. Resolve that exact scope to an ordered list of every in-scope permanent-test file.
3. Show the exact scope, complete ordered list, and every exclusion in the Route Overview. Do not launch auditor A or B.
4. Continue only after approval binds the current target, scope, and ordered file list.

Repository tests outside an explicit scope are out of scope, not implicitly audited. Temporary probes and generated test artifacts are excluded only when the repository's own permanent-test convention excludes them. If the file list cannot be completed, approval is missing or stale, the scope changes, or authority over an exclusion is contradictory, stop read-only before launching A.

Bind only the current approved target, ordered file list, stated inclusions/exclusions, installed policy and rethink paths, requester, persistent auditor identities, current proposals, and final Handoff.

## Complete proposal

Use the complete proposal, accounting, finding, incomplete-proposal, applicable stop, and closure-result definitions in `skill://dev-test-audit/references/opinion-agent.md`. Do not copy them here.

## Persistent A-first loop

Use the native persistent opinion agents named by the harness wrappers.

1. After the current Route Overview approval, start persistent auditor A with the bound scope, installed policy reference, and current request. Do not start B. Include no deferred wrapper path or scheduling recipe in that initial packet. A's first outer-loop return must be one complete proposal as defined in the opinion-agent contract.
2. After validating A's complete first return, send [`test-rethink.md`](../../../references/impl-rethink/test-rethink.md) to that same A exactly once as an explicit follow-up that asks A to read it once and return a complete revised proposal. Do not rely on an advance recipe in A's initial packet.
3. If A's revised proposal has no findings, accept it immediately. Do not create B.
4. If findings remain, start persistent auditor B with the identical bound scope, the same policy reference, A's complete revised proposal, and the current request. Include no deferred wrapper path or scheduling recipe in B's initial packet. B's first outer-loop return must be one complete applicable proposal.
5. After validating B's complete first return, send the same test rethink file to that same B exactly once as an explicit follow-up that asks B to read it once and return a complete revised proposal.
6. If the revised proposals agree, accept. Otherwise send B's revised proposal to persistent A and request a proposal revision only. Then, if needed, send A's revision to persistent B. Continue alternating the same persistent A and B with counterpart proposals only.
7. Never send the rethink prompt after an auditor's first-return rethink. Never create fresh auditors to continue the loop.

An incomplete first return stops as `persistent blockage`; do not spend the rethink prompt trying to reconstruct missing scope. After their rethink, every later return is still a complete proposal over the unchanged file list.

## Agreement and liveness

Agreement requires the same complete file set, compatible evidence, and the same disposition and destination for every file, or one auditor's explicit acceptance of the counterpart's complete proposal. Agreement on `unknown` preserves that file and authorizes no fix.

After acceptance, send the accepted proposal to the other live auditor so both persistent sessions are synchronized. A-only early success needs no B synchronization.

Stop read-only and name exactly one primary reason using the applicable stop results in `skill://dev-test-audit/references/opinion-agent.md`. Do not add a round limit, select a winner, count votes, replace an auditor, or mutate to break a tie.

## Accepted fixes and one batch

An accepted proposal with `merge` or `remove` rows is a candidate fix set, not approval to edit. Return the exact rows, destinations, evidence, and preserved behavior to `dev-ask`. `dev-ask` must provide one Route Overview that explicitly approves the exact fix batch and chooses a direct or planned implementation route. The default mutation allowance is one separately approved batch; only the human may adjust it. Audit roles never implement, run tests, stage, commit, or ship.

An all-`keep` result or a result containing only preserved `unknown` rows has no mutation batch.

## Original-A closure

Retain original A's persistent session when an approved audit fix batch is implemented. After that batch and before normal final review or verification, send original A only the accepted proposal, approved batch, applied delta, and resulting target. Do not send the rethink prompt again.

Original A performs one read-only audit-specific closure over the approved batch and returns one of the closure results defined in `skill://dev-test-audit/references/opinion-agent.md`. Closure cannot add findings, reopen portfolio scope, authorize repair, or start another batch. If original A is unavailable only at this post-batch boundary, omit audit-specific closure, report `original-A closure unavailable`, do not substitute A or claim closure, and continue through the approved route's normal assurance. Do not reopen the audit or mutation batch.

## Lean Handoff

Return one lean `dev-handoff` envelope. Put the bound file list, final complete proposal or liveness stop, sequence actually taken, accepted exact fix rows, and original-A closure state or `original-A closure unavailable` when applicable in `Outcome`. Set `Changed targets/effects` to `none; audit was read-only`. In `Checks`, state the complete-file accounting and read-only observation. Put uncertainties or a proposal-loop liveness stop in `Blocker/risk`; closure unavailability is reported without claiming closure and does not block normal assurance.

The next receiver is `dev-ask` only for accepted `merge` or `remove` fixes. Otherwise return to the explicit requester/controller. No audit result changes implementation, review, verification, completion, shipping, or plan state by itself.