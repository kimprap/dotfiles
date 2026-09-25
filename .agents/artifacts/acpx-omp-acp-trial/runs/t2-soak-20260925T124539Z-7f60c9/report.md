# T2 run t2-soak-20260925T124539Z-7f60c9

- T1 dependency: t1-probe-20260925T120636Z-0324bc
- Soak: supported
- Soak facts: {"eventuallyValid":40,"firstTryValid":39,"submissions":41,"reasks":1,"restores":4,"rewatches":5,"sizePayloads":3,"observedCloses":4,"fallbacks":0,"replays":0}
- AC-MAPPING: PASS
- AC-MECHANICS: PASS
- AC-TRANSPORT: PASS
- AC-RESTORE: PASS
- AC-REQUESTS: PASS
- AC-DIAGNOSTICS: PASS
- AC-DEBUGLOOP: PASS
- production_allowed: true
- Wall: 223574 ms; cost: {"amount":0.873614,"currency":"USD","basis":"public status cumulative session cost (reported, summed across per-process counters)"}
- Stops: none
- T3 executed: false

## Limits

- T2 wraps the public watchSession (Proxy around the public runtime) to capture T2 closed projections by cursor, because the T1 reader's closed projection knows only kind/sentence/token; admission still uses the shared RequestWindow.
- Tool policy is a trusted-process detect-after check, not a sandbox.
- OAuth cost may be absent or delayed; a monetary hard cap cannot be guaranteed.
