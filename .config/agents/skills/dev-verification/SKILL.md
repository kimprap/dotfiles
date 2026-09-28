---
name: dev-verification
description: >
  Independently execute every original acceptance check and required review
  closure check after the one review. Produce a fresh aggregate verdict, never
  repair, and let the same verifier alone close one eligible repaired delta.
---

# Engineering Verification

Own the final independent truth verdict for one exact standard- or high-assurance target after its single review. Verification is read-only. It executes the fixed check set itself, records fresh observations, and never trusts reviewer or implementation conclusions as results.

## Intake

Require:

- the exact target revision or working-tree snapshot and environment;
- the complete governing acceptance set, with every original item expressed as:

  ```text
  Behavior: <observable>
  Check: <command or direct static proof>; expect <exact result>
  ```

- the completed one-shot review with `APPROVED` or `REPAIR REQUIRED`, complete changed-file accounting, and every required finding's exact closure check;
- when review required repair, the repaired target and implementation Handoff showing attempt 2 and same-worker rethink completed; otherwise the reviewed target unchanged;
- the responsible implementation owner, semantic attempt state, and exactly one receiver; and
- the permissions, fixtures, dependencies, and environment needed to execute every check.

Do not start after an `INCONCLUSIVE` review or with a partial, changed, contradictory, or unexecutable check set. Missing proof is `INCONCLUSIVE`, not success. Do not add acceptance criteria from incidental observations.

## Fixed check set

The verifier owns one ordered union:

1. every original acceptance check, in governing order; then
2. every required review closure check, in review finding order.

Account for every item exactly once. Advisories add no checks. The verifier may perform setup needed by an exact check but may not replace a behavioral check with source inspection, a build, or worker evidence unless that is the declared check.

Read `skill://dev-implementation/references/test-value.md` for common proof accounting, not permission to reselect the fixed set. In one fresh pass, an approved shared scenario may establish several items on the same target under compatible conditions without repetition solely for each reference. Execute it at its first required occurrence and account for every item in the ordered union with its own exact observation. Identical command text does not merge incompatible conditions or independent starting states. If execution fails before another required observation, that item remains unproved; continue its required execution when safe, never fill it from worker evidence. Eligible code repair still requires a new complete unchanged pass by this same verifier.

## Independent procedure

1. Bind the exact target, environment, attempt state, original acceptance checks, and review closure checks. Confirm that review preceded this verifier and that a review repair, if any, used attempt 2.
2. Execute the entire fixed check set against the exact target. Observe the real behavior or direct static fact named by each check. Do not use an implementation smoke result, reviewer statement, or prior verifier result as the observation.
3. For every check record its ID, exact `Behavior` and `Check` lines, target/environment, actual observation, and `pass | fail | inconclusive`. Continue through the complete set when safe so the aggregate accounts for every item.
4. Confirm the target did not change during collection. A changed target, unavailable dependency, unsafe continuation, confounded result, or unexecuted item is `INCONCLUSIVE` for that item.
5. Produce one fresh aggregate over the complete fixed set. Do not repair, edit, format, merge, stage, delegate review, or widen the contract.

## Verdict

Use only:

- `VERIFIED` — every original acceptance and required review closure check passes on the exact target;
- `NOT VERIFIED` — at least one executed check directly contradicts its expected behavior; or
- `INCONCLUSIVE` — at least one required check is missing, unexecuted, stale, unavailable, unsafe, or confounded and no complete truth verdict is possible.

A passing subset never yields `VERIFIED`. The aggregate must be newly issued from this verifier's complete observations for the current target.

## Execution recovery

When an execution failure blocks a required observation, assess and recover under `skill://dev-implementation/references/execution-recovery.md` before escalating. The same verifier owns recovery and stays read-only toward the target; any target, behavior, check-meaning, expected-result, ownership, or effect change returns to its authority.

## One eligible implementation repair

If review repair already consumed attempt 2, verification is final for semantic repair. After assessing execution recovery, an eligible machinery correction may still proceed under its unchanged allowance, but any resulting `NOT VERIFIED` or `INCONCLUSIVE` code outcome stops with the current evidence; no further product repair, reviewer rerun, second verifier, or extra semantic attempt is allowed.

If attempt 2 remains and verification produces `NOT VERIFIED` from a directly evidenced code defect, return the exact failing check, reproduction, expected and observed behavior, and affected target to the responsible implementation owner. That owner may perform the one code-changing attempt 2 and its same-worker rethink. Environment, fixture, authority, transport, or other execution-machinery failures do not qualify as code defects and do not authorize semantic repair; they follow the shared execution-recovery policy only when eligible.

Keep the original verifier persistent. After the eligible repair, the same verifier receives the repaired target and implementation Handoff, then independently executes the complete unchanged fixed check set again and emits a fresh aggregate. This is verifier-owned closure of the repaired delta. It is final for semantic repair: unresolved code failure stops, review never reopens, and execution recovery may address only otherwise eligible machinery. Loss of the required original verifier is an ownership blocker; do not substitute another verifier or let the parent repair or aggregate in its place.

## Handoff and next owner

Return one lean `dev-handoff` envelope:

- `Outcome` names the exact target, attempt state, and aggregate verdict.
- `Changed targets/effects` is `none; read-only verification`.
- `Checks` includes every original acceptance item and review closure item with its exact `Behavior` and `Check` lines plus the fresh `Observed` result.
- `Blocker/risk` names every failing or inconclusive item, or `none`.
- `Next receiver` is the responsible implementation owner only for the one eligible code repair; otherwise it is the declared lifecycle receiver for `VERIFIED`, or the controller for a final stop.

Never repair the target, rerun review, silently drop a check, or claim closure from another role's conclusion.