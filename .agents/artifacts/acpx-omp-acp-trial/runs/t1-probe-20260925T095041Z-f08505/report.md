# T1 native probe report — t1-probe-20260925T095041Z-f08505

Spec: acpx-omp-acp-trial/spec-v9 (593a6ae6bae86975d783914a4c7feaa34d7db7f10f1447cb886e04db8bca12c2); decisions: acpx-omp-acp-trial-decisions/v7.
Mode: probe. Branch: probe-inconclusive.

## Verdicts (kept separate)

- implementation checks: runner-completed
- native capability (overall): inconclusive
- production allowed: false
- T2 native entry permitted: false
- T1 evaluation complete: false
- production adoption: not authorized

## Capability observations

- launch: not-supported-or-inconclusive
- journal_result: inconclusive
- reuse: not-run
- restore: not-run
- pid_sampling: inconclusive
- disposal: not-supported-or-unproved
- tool_policy: supported (detect-after only)

## Expectations

| # | handle | kind | outcome | first try | submissions | invalid returns | re-asks |
|---|---|---|---|---|---|---|---|
| 1 | normal | probe-canary | stopped-turn-not-completed | false | 1 | 0 | 0 |
| 2 | normal | probe-reuse | not-run | false | 0 | 0 | 0 |
| 3 | short | probe-short | not-run | false | 0 | 0 | 0 |
| 4 | short | probe-restore | not-run | false | 0 | 0 | 0 |

## Cleanup

- status: unresolved
- normal: not every recorded PID observed ESRCH ([])
- short: not every recorded PID observed ESRCH ([])

## Accounting (probe/soak pool USD2 / 20 min, cumulative)

- this execution wall ms: 3347
- reported cost: {"amount":"unknown","basis":"no reported cost in public status"}
- prior pool wall ms: 0

## Stops and causes

- expectation-1-turn-not-completed

## Limits (disclosed, not repaired)

- Tool policy is a trusted-process detect-after check over journaled tool events; it is not a sandbox or a complete tool inventory.
- The yield signature (kind other + declared keys) does not authenticate the tool name.
- Public pid= identifies the OMP agent child only, not the queue owner or descendants; PID reuse may cause a conservative false cleanup failure.
- A stable backendSessionId after restore does not prove complete restored context; token recall is continuation evidence only.
- Entirely unobserved tool starts/completions cannot be distinguished from no submission at this boundary.
- Live config lists extensions (including lifecycle-plugin.js); --no-extensions governs discovery only and extension loading was not independently observed.
