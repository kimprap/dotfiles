# Manual permanent-test audit protocol

This protocol owns the explicit, read-only, A-first audit loop. Permanent-test value is defined only by `skill://dev-implementation/references/test-value.md`; this protocol defines scope, proposal shape, turn order, agreement, liveness, routing, and audit-specific closure without copying that policy.

## Bound scope

An audit starts only from an explicit manual request. Before the existing initial Route Overview approval:

1. Use the requester's explicit test scope when present; otherwise use the repository's complete permanent-test portfolio.
2. Resolve that exact scope to an ordered list of every in-scope permanent-test file.
3. Show the exact scope, complete ordered list, and every exclusion in the Route Overview. Do not launch auditor A or B.
4. Continue only after approval binds the current target, scope, and ordered file list.

Repository tests outside an explicit scope are out of scope, not implicitly audited. Temporary probes and generated test artifacts are excluded only when the repository's own permanent-test convention excludes them. If the file list cannot be completed, approval is missing or stale, the scope changes, or authority over an exclusion is contradictory, stop read-only before launching A.

Bind only the current approved target, ordered file list, stated inclusions/exclusions, installed policy and rethink paths, requester, persistent auditor identities, current proposals, and final Handoff.

## Complete proposal

Every auditor proposal repeats the same ordered file set and contains exactly one compact row per file:

```text
File: <path>
Accounting: reviewed | skipped: <reason>
Disposition: keep | merge | remove | unknown
```

For a `merge`, `remove`, or `unknown` finding, append:

```text
Evidence: <direct source or behavior evidence>
Closest coverage: <file/test and comparison, or none found>
Stable seam: <public seam exercised, or absent/unknown>
Independent oracle: <oracle, or absent/unknown>
Plausible bug/absence: <bug uniquely caught, or concrete absence evidence>
Uncertainty: <none or exact unresolved fact>
Destination: <required for merge; retained coverage for remove; otherwise none>
```

Interpret these fields only through `skill://dev-implementation/references/test-value.md`. Inspect enough of every file and its closest coverage to mark it `reviewed`; a file that cannot be assessed from available evidence is `skipped: <reason>`, must be `unknown`, receives the detailed fields, and remains preserved. A reviewed `keep` row carries no detailed evidence. A proposal is incomplete if a scoped file is omitted or duplicated, accounting or disposition is invalid, required finding/unknown detail is absent, keep detail is added, or an out-of-scope file appears.

A **finding** is any `merge`, `remove`, or `unknown` row. “No findings” means every file is `reviewed` and `keep`. Recommendations are not mutation authority.

## Persistent A-first loop

Use the native persistent opinion agents named by the harness wrappers.

1. After the current Route Overview approval, start persistent auditor A with the bound scope and installed policy reference. Do not start B. A's first outer-loop return must be one complete proposal and must not have received the rethink prompt.
2. After validating A's complete first return, send `~/.agents/references/impl-rethink/test-rethink.md` to that same A exactly once. A returns a complete revised proposal.
3. If A's revised proposal has no findings, accept it immediately. Do not create B.
4. If findings remain, start persistent auditor B with the identical bound scope, the same policy reference, and A's complete revised proposal. B's first outer-loop return must be complete and must not have received the rethink prompt.
5. After validating B's complete first return, send the same test rethink file to that same B exactly once. B returns a complete revised proposal.
6. If the revised proposals agree, accept. Otherwise send B's revised proposal to persistent A and request a proposal revision only. Then, if needed, send A's revision to persistent B. Continue alternating the same persistent A and B with counterpart proposals only.
7. Never send the rethink prompt after an auditor's first-return rethink. Never create fresh auditors to continue the loop.

An incomplete first return stops as `persistent blockage`; do not spend the rethink prompt trying to reconstruct missing scope. After their rethink, every later return is still a complete proposal over the unchanged file list.

## Agreement and liveness

Agreement requires the same complete file set, compatible evidence, and the same disposition and destination for every file, or one auditor's explicit acceptance of the counterpart's complete proposal. Agreement on `unknown` preserves that file and authorizes no fix.

After acceptance, send the accepted proposal to the other live auditor so both persistent sessions are synchronized. A-only early success needs no B synchronization.

Stop read-only and name exactly one primary reason when:

- **unchanged/repeated proposals** — the next proposal repeats that auditor's prior proposal or another already-seen proposal without accepting it;
- **non-applicable revision** — a response does not revise against the supplied counterpart, changes the bound file set, or proposes work outside permanent-test value;
- **persistent blockage** — an auditor cannot return a complete applicable proposal from available repository evidence;
- **lost reviewer** — a persistent A or B session required during proposal exchange becomes unavailable; or
- **authority conflict** — scope, policy, target, or requester authority conflicts and cannot be resolved inside the read-only audit.

Do not add a round limit, select a winner, count votes, replace an auditor, or mutate to break a tie.

## Accepted fixes and one batch

An accepted proposal with `merge` or `remove` rows is a candidate fix set, not approval to edit. Return the exact rows, destinations, evidence, and preserved behavior to `dev-ask`. `dev-ask` must provide one Route Overview that explicitly approves the exact fix batch and chooses a direct or planned implementation route. The default mutation allowance is one separately approved batch; only the human may adjust it. Audit roles never implement, run tests, stage, commit, or ship.

An all-`keep` result or a result containing only preserved `unknown` rows has no mutation batch.

## Original-A closure

Retain original A's persistent session when an approved audit fix batch is implemented. After that batch and before normal final review or verification, send original A only the accepted proposal, approved batch, applied delta, and resulting target. Do not send the rethink prompt again.

Original A performs one read-only audit-specific closure over the approved batch and returns:

- `CLOSED` — every approved fix is applied as approved and its named observable value is preserved;
- `NOT CLOSED` — direct evidence shows an approved fix is missing, exceeded, or lost named observable value; or
- `INCONCLUSIVE` — the applied target or required evidence is unavailable or contradictory.

Closure cannot add findings, reopen portfolio scope, authorize repair, or start another batch. If original A is unavailable only at this post-batch boundary, omit audit-specific closure, report `original-A closure unavailable`, do not substitute A or claim closure, and continue through the approved route's normal assurance. Do not reopen the audit or mutation batch.

## Lean Handoff

Return one lean `dev-handoff` envelope. Put the bound file list, final complete proposal or liveness stop, sequence actually taken, accepted exact fix rows, and original-A closure state or `original-A closure unavailable` when applicable in `Outcome`. Set `Changed targets/effects` to `none; audit was read-only`. In `Checks`, state the complete-file accounting and read-only observation. Put uncertainties or a proposal-loop liveness stop in `Blocker/risk`; closure unavailability is reported without claiming closure and does not block normal assurance.

The next receiver is `dev-ask` only for accepted `merge` or `remove` fixes. Otherwise return to the explicit requester/controller. No audit result changes implementation, review, verification, completion, shipping, or plan state by itself.