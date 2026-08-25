# Compact assurance checklist

Read and apply every gate in order when the bound assurance profile is `compact`, before the first ready transition.

1. Bind a minimal revision-bound Task Contract in conversation or backend state. Do not require an Executor Plan, parser-valid repository-plan readiness, or filesystem Task Contract, Context Pack, or Handoff file.
   If a compact work-only Executor Plan is present, copy its parser-validated Intent and Methods unchanged into each Task Contract and run `scripts/executor_plan.py validate PLAN` once against the active repository plan before `ready`; never require a plan merely to execute compact work. Without a plan, derive one short human Intent from current approved authority and select `tdd` only when the current user or approved authority explicitly selects test-first work, otherwise select explicit `none`.
   Before `ready`, bind `tdd` to the current `dev-tdd` skill and its approved criterion, observable seam, owner, and test-first authority; bind `none` without loading a method skill. An unavailable or mismatched binding blocks before semantic attempt consumption and never falls back to `none`. The method changes only worker procedure and creates no task, stage, criterion, effect, assurance, or receiver.
2. Same-context compact binds that Task Contract directly. Cross-context dispatch adds one Context Pack.
3. Bind solution discipline on the Task Contract. Copy it into a Context Pack only when a pack exists.

   Before `ready`, derive or copy one complete `surface-proof-recipe/v1` object for every owned `AC-...`, canonicalize it with the shared adapter-contract helper, and bind its exact `VR-...@sha256:...` identity. A direct compact Task Contract may project settled authority directly, but it may not omit recipe fields or invent unresolved target, environment, fixture, dependency, isolation, cleanup, comparison, or finite-consumer facts.

   Use `adapter: none` unless current authority already names one exact canonical adapter URI and digest. When an adapter is named, rehash its symlink-safe tree and run its doctor once for readiness. Doctor is readiness evidence only; it cannot satisfy criterion smoke. A missing, stale, unsafe, or mismatched recipe, adapter, or doctor receipt keeps compact non-ready.

   The binding adds no independent verification, review, or curation. Adapter presence does not disqualify compact or change the selected profile. If the adapter changes during the task, re-drive the exact changed surface and bind the final adapter digest and final canonical recipe before criterion-complete smoke can be consumed.
4. Map every owned acceptance criterion to one deterministic smoke scenario against the exact final target and environment.
5. Run every scenario and record expected and observed results. Missing, partial, stale, or failed smoke blocks completion.
6. Any criterion that requires an independent proof class disqualifies compact and returns to the router.
7. Attempt 2 only from attempt-1 criterion progress, exact blocker resolution, or an authorized changed hypothesis. A blocker-resolution claim is consumable only with the stable-ID/AC/target-or-caller/proof/expected/observed map on the repaired identity; a universal invariant also proves every entry in its finite current consumer map. Reject generic passing suites and unchanged-hypothesis retries before they run. Attempt 3 is forbidden. Derivative revisions inherit the count. The repair Task Contract also has at most two attempts. Two transport retries remain.
8. Do not dispatch verification, review, or continual learning. Defer a mutating Learning Candidate.
9. Advance `accepted` to `ready` to `running` to `handed-off` to `complete`. Omit `verifying`, `verified`, `reviewing`, and `reviewed`. Emit one in-conversation Common Handoff.

The standard/high-consequence post-assurance human checkpoint does not change items 7–9: compact keeps its two-attempt bound, smoke-only terminal proof, and prohibition on verifier, reviewer, or opinion dispatch.
   A compact Executor Plan contains work tasks only. Direct and planned compact work remain tail-free regardless of Methods; `tdd` preserves explicit test-first authority without adding independent assurance, review, curation, or another receiver.
