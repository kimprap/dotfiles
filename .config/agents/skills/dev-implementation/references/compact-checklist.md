# Compact assurance checklist

Read and apply every gate in order when the bound assurance profile is `compact`, before the first ready transition.

1. Bind a minimal revision-bound Task Contract in conversation or backend state. Do not require an Executor Plan, plan preflight, or filesystem Task Contract, Context Pack, or Handoff file.
2. Same-context compact binds that Task Contract directly. Cross-context dispatch adds one Context Pack.
3. Bind solution discipline on the Task Contract. Copy it into a Context Pack only when a pack exists.
4. Map every owned acceptance criterion to one deterministic smoke scenario against the exact final target and environment.
5. Run every scenario and record expected and observed results. Missing, partial, stale, or failed smoke blocks completion.
6. Any criterion that requires an independent proof class disqualifies compact and returns to the router.
7. Attempt 2 only from attempt-1 criterion progress, exact blocker resolution, or an authorized changed hypothesis. A blocker-resolution claim is consumable only with the stable-ID/AC/target-or-caller/proof/expected/observed map on the repaired identity; a universal invariant also proves every entry in its finite current consumer map. Reject generic passing suites and unchanged-hypothesis retries before they run. Attempt 3 is forbidden. Derivative revisions inherit the count. The repair Task Contract also has at most two attempts. Two transport retries remain.
8. Do not dispatch verification, review, or continual learning. Defer a mutating Learning Candidate.
9. Advance `accepted` to `ready` to `running` to `handed-off` to `complete`. Omit `verifying`, `verified`, `reviewing`, and `reviewed`. Emit one in-conversation Common Handoff.
