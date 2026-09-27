# T1 native probe report — t1-preflight-20260925T094907Z-6044e9

Spec: acpx-omp-acp-trial/spec-v9 (593a6ae6bae86975d783914a4c7feaa34d7db7f10f1447cb886e04db8bca12c2); decisions: acpx-omp-acp-trial-decisions/v7.
Mode: preflight. Branch: preflight-pass.

## Verdicts (kept separate)

- implementation checks: runner-completed
- native capability (overall): inconclusive
- production allowed: false
- T2 native entry permitted: false
- T1 evaluation complete: false
- production adoption: not authorized

## Capability observations

- launch: not-run (preflight mode)
- journal_result: not-run
- reuse: not-run
- restore: not-run
- pid_sampling: not-run
- disposal: not-applicable (no process started)
- tool_policy: not-run

## Expectations

| # | handle | kind | outcome | first try | submissions | invalid returns | re-asks |
|---|---|---|---|---|---|---|---|

## Cleanup

- status: complete
- positive evidence: no ensureSession/startTurn call was made, so no actor process started (PID coverage not applicable)

## Accounting (probe/soak pool USD2 / 20 min, cumulative)

- this execution wall ms: 1866
- reported cost: {"amount":0,"currency":"USD","basis":"no model work started"}
- prior pool wall ms: 0

## Stops and causes

- none

## Limits (disclosed, not repaired)

- Tool policy is a trusted-process detect-after check over journaled tool events; it is not a sandbox or a complete tool inventory.
- The yield signature (kind other + declared keys) does not authenticate the tool name.
- Public pid= identifies the OMP agent child only, not the queue owner or descendants; PID reuse may cause a conservative false cleanup failure.
- A stable backendSessionId after restore does not prove complete restored context; token recall is continuation evidence only.
- Entirely unobserved tool starts/completions cannot be distinguished from no submission at this boundary.
- Live config lists extensions (including lifecycle-plugin.js); --no-extensions governs discovery only and extension loading was not independently observed.
