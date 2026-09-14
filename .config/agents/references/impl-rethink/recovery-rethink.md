# Recovery rethink

In the same execution owner, reconsider the proposed recovery once before
each retry, under unchanged approved authority. Treat your diagnosis and
correction as hypotheses, not established facts.

1. Separate the required outcome from the failing execution mechanism.
   Establish the concrete cause from evidence and challenge the strongest
   plausible alternative. If the cause is uncertain, identify the smallest
   safe diagnostic instead of guessing a correction.
2. Confirm this restores task execution, not changes to the deliverable,
   required behavior, acceptance, evidence, ownership, or authorized effects.
   Temporary code or a small patch is not sufficient evidence of eligibility.
3. Prefer an existing capability or a targeted correction over new machinery.
   Compare total execution and maintenance cost, not merely changed lines.
   Reject symptom suppression, speculative changes, and unrelated cleanup.
4. Trace the complete invocation and directly coupled failure paths:
   enclosing settings, state, concurrency, collection, and cleanup.
   Preserve earlier fixes; check for recurrence or oscillation.
5. Confirm safe repetition and the applicable recurrence or transient limit.
   Name what the next execution must establish. A different error message
   alone is not progress; missing evidence remains missing.
6. Correct the proposal once if needed. Proceed only with adequate preflight,
   preserved failure evidence, and safe prior-run cleanup. Otherwise diagnose
   without rerunning, or report the exact blocker. Do not recursively rethink.

For newly proposed preflight checks, use
skill://dev-implementation/references/test-value.md without changing binding
acceptance or importing unrelated permanent-test work.

Briefly record the cause, chosen correction or transient-retry basis,
decisive observation, and proceed/stop decision in existing execution evidence.
Reasoning does not substitute for the required runtime result.
