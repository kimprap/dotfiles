# Proof selection and permanent test value

This file is the sole shared proof-selection and permanent-test policy. Authoring, implementation, rethink, TDD, review, verification, and audit callers read it at their existing boundary; they must not copy or fork its criteria.

## Common proof selection

Apply these principles whenever the current owner creates or revises verification checks: permanent tests, temporary smoke checks, native end-to-end scenarios, and model-driven evaluations. This does not initiate unrelated audits or impose checks on unrelated read-only answers.

1. **Distinct obligations.** Select from observable outcomes, meaningful boundaries, and relevant failure mechanisms. Use representative inputs, not a separate execution for every requirement, variation, or combination.
2. **Cheapest adequate evidence.** Prefer focused behavioral checks through stable public seams when they reliably establish the obligation. Reserve full end-to-end journeys for integration or runtime behavior cheaper checks cannot establish. Static inspection proves structural facts, not actual agent decisions, routing, cleanup, or other runtime behavior; simulated answers and source-text assertions do not substitute for required live behavior.
3. **Compatible shared observations.** One designed execution may cover multiple criteria, each retaining its exact expected and observed result. Share setup only when safe; keep contradictory outcomes, independent starting conditions, and necessary isolation separate. A failure that prevents a later observation leaves that criterion unproved.
4. **Marginal value.** For each additional expensive scenario, briefly identify the otherwise-unproved behavior or failure mechanism and why existing or cheaper checks cannot cover it. Consider setup, nested work, generation/grading, and independent repetition, not scenario names or file counts. Keep material rationale in existing planning prose; add no universal count cap, quota, ledger, or approval stage.
5. **Authority before economy.** Optimize during specification, self-contained plan, or direct-contract authoring, before checks become binding. Projection preserves exact acceptance. Later changes to required behavior or check meaning return to the existing authority owner; this policy never permits silent substitution or dropped checks.
6. **Independent complete proof.** The implementer exercises the selected checks and the independent verifier freshly executes the complete approved set. Within one pass, a shared scenario need not run again solely for another criterion if it establishes each exact observation on the same target under compatible conditions. Command spelling alone is not equivalence; another role's result is not independent proof. Preserve required ordering, per-item accounting, the two-semantic-attempt limit, one-shot review, same-verifier closure, the complete unchanged check set after eligible code repair, and bounded non-code proof recovery.

## Permanent-only admission and retention

The requirements below apply only to permanent tests changed or proposed for the current task, unless an explicit test audit owns a frozen wider portfolio. Temporary proof does not acquire permanent placement, retention, determinism, isolation, or disposition obligations merely by consuming the common principles.

A permanent test earns its place only when all of these are true:

1. **Observable value.** Name the externally observable contract, regression, or invariant and one plausible bug the test would catch. If none exists, add no test.
2. **Uncovered behavior.** Find the closest existing test and determine whether it already defends the behavior. Extend or merge that file before creating another test file; do not duplicate or subdivide equivalent coverage.
3. **Lowest effective level.** Use the lowest-cost test level that can reliably prove the behavior through a stable public seam and an oracle independent of production logic. Escalate to broader integration or end-to-end coverage only when a lower level cannot observe the contract.
4. **Determinism and isolation.** Control time, randomness, ordering, environment, and external state. A test must run independently, leave no residue, and remain full-suite-safe without depending on another test's order or output.
5. **Behavioral evidence.** Reject implementation-detail assertions, source-restating or tautological expectations, private-call choreography, duplicate/subsumed cases, incidental snapshots, coverage-only tests, and expected values computed by the production algorithm under test.
6. **Smallest durable set.** Keep only the minimum cases needed to defend distinct behavior and meaningful boundaries. Reuse nearby fixtures and utilities; do not perform unrelated cleanup.

Settle each changed permanent test as `keep`, `merge`, or `remove`, with the defended behavior and plausible bug. When no permanent test is warranted, record the closest existing coverage or the concrete no-new-contract basis. This policy does not require reading untouched portfolio tests.