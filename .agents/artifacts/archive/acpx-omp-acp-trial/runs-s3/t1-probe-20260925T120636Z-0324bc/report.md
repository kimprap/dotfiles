# T1 native probe report — t1-probe-20260925T120636Z-0324bc

Spec: acpx-omp-acp-trial/spec-v9 (7fcc011e548813b085f5e38f9e7245f5ce300418d9eac59137797ac54982a748); decisions: acpx-omp-acp-trial-decisions/v7.
Mode: probe. Branch: probe-supported.

## Verdicts (kept separate)

- implementation checks: runner-completed
- native capability (overall): supported
- production allowed: false
- T2 native entry permitted: true
- T1 evaluation complete: true
- production adoption: not authorized

## Capability observations

- launch: supported
- journal_result: supported
- reuse: supported
- restore: supported
- pid_sampling: supported
- disposal: supported
- tool_policy: supported (detect-after only)

## Expectations

| # | handle | kind | outcome | first try | submissions | invalid returns | re-asks |
|---|---|---|---|---|---|---|---|
| 1 | normal | probe-canary | delivered | true | 1 | 0 | 0 |
| 2 | normal | probe-reuse | delivered | true | 1 | 0 | 0 |
| 3 | short | probe-short | delivered | true | 1 | 0 | 0 |
| 4 | short | probe-restore | delivered | true | 1 | 0 | 0 |

## Cleanup

- status: complete
- live-store session folders removed (4 session file(s)/folder(s) by recorded ID)
- normal: close resolved, recorded closed, ESRCH for 2 recorded PID(s)
- short: close resolved, recorded closed, ESRCH for 3 recorded PID(s)

## Accounting (probe/soak pool USD2 / 20 min, cumulative)

- this execution wall ms: 17250
- reported cost: {"amount":0.031834,"currency":"USD","basis":"public status cumulative session cost (reported)"}
- prior pool wall ms: 10841

## Stops and causes

- none

## Limits (disclosed, not repaired)

- Tool policy is a trusted-process detect-after check over journaled tool events; it is not a sandbox or a complete tool inventory.
- The yield signature (kind other + declared keys) does not authenticate the tool name.
- Public pid= identifies the OMP agent child only, not the queue owner or descendants; PID reuse may cause a conservative false cleanup failure.
- A stable backendSessionId after restore does not prove complete restored context; token recall is continuation evidence only.
- Entirely unobserved tool starts/completions cannot be distinguished from no submission at this boundary.
- Live config lists extensions (including lifecycle-plugin.js); --no-extensions governs discovery only and extension loading was not independently observed.
