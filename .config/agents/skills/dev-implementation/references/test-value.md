# Test value v1

`test-value/v1` is identified by the SHA-256 digest of this file. It is the shared permanent-test decision policy for implementation, explicit TDD, final review, and read-only test audit. It adds no lifecycle stage, test schema, coverage target, or authority to mutate tests outside the current Task Contract.

## Decision order

Apply these steps in order to every proposed or changed permanent test:

1. Name the new observable contract, regression, or invariant. If none exists, do not add a permanent test.
2. Find the closest existing test and prove the new contract is not already covered. Extend or merge before adding another test.
3. Use the narrowest stable public seam and an oracle independent from the implementation under test.
4. Name one plausible bug that the test fails on while correct behavior passes.
5. Reject or consolidate implementation-detail assertions, tautologies, duplicate or subsumed cases, incidental snapshots, coverage-only cases, and tests whose oracle repeats production logic.
6. Keep the smallest permanent set preserving each unique contract. Comparison artifacts and audit investigation data are not permanent tests.

A unique path, branch, line, implementation helper, mock interaction, snapshot difference, or increase in coverage is not by itself an observable contract. “The implementation returns what the implementation returns” is not an independent oracle. Preserve boundary, invariant, transition, precedence, and real-error cases when each defends a distinct observable contract.

## Worker accounting

Reuse current tests first. For each changed permanent test, the work Common Handoff records:

- path and selector;
- the unique observable contract, regression, or invariant;
- one plausible bug uniquely caught;
- the stable public seam;
- the independent oracle;
- `keep`, `merge`, or `remove` disposition; and
- exact evidence supporting that disposition.

When permanent tests do not change, record the closest existing coverage and why the implementation adds no uncovered observable contract, or record the concrete no-new-contract basis. Do not add a test solely to create evidence for worker closure, a scanner, a comparison, or a coverage number.

Explicit TDD retains its required red and green evidence while developing the behavior, then merges or removes redundant tracer tests before Handoff. The final permanent set still follows the six-step order; test-first authority does not make every intermediate test permanent.

Final review applies the same value questions to tests changed by the outcome. A read-only audit may recommend `keep`, `merge`, `remove`, or `unknown` under its own bounded protocol, but it does not mutate the suite and never treats `unknown` as deletion authority.
