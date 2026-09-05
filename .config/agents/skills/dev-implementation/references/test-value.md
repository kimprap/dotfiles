# Permanent test value

This file is the sole permanent-test policy for implementation, rethink, TDD, review, verification, and audit callers. Other contracts may point here; they must not copy or fork its criteria.

Apply it only to permanent tests changed or proposed for the current task unless an explicit test audit owns a frozen wider portfolio.

A permanent test earns its place only when all of these are true:

1. **Observable value.** Name the externally observable contract, regression, or invariant and one plausible bug the test would catch. If none exists, add no test.
2. **Uncovered behavior.** Find the closest existing test and determine whether it already defends the behavior. Extend or merge that file before creating another test file; do not duplicate or subdivide equivalent coverage.
3. **Lowest effective level.** Use the lowest-cost test level that can reliably prove the behavior through a stable public seam and an oracle independent of production logic. Escalate to broader integration or end-to-end coverage only when a lower level cannot observe the contract.
4. **Determinism and isolation.** Control time, randomness, ordering, environment, and external state. A test must run independently, leave no residue, and remain full-suite-safe without depending on another test's order or output.
5. **Behavioral evidence.** Reject implementation-detail assertions, source-restating or tautological expectations, private-call choreography, duplicate/subsumed cases, incidental snapshots, coverage-only tests, and expected values computed by the production algorithm under test.
6. **Smallest durable set.** Keep only the minimum cases needed to defend distinct behavior and meaningful boundaries. Reuse nearby fixtures and utilities; do not perform unrelated cleanup.

Settle each changed permanent test as `keep`, `merge`, or `remove`, with the defended behavior and plausible bug. When no permanent test is warranted, record the closest existing coverage or the concrete no-new-contract basis. This policy does not require reading untouched portfolio tests.