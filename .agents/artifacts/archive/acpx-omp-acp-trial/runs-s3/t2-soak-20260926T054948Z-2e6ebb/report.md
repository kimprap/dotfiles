# T2 run t2-soak-20260926T054948Z-2e6ebb

- T1 dependency: t1-probe-20260925T120636Z-0324bc
- Soak: supported
- Soak facts: {"eventuallyValid":40,"firstTryValid":40,"submissions":40,"reasks":0,"restores":4,"rewatches":5,"sizePayloads":3,"observedCloses":4,"fallbacks":0,"replays":0}
- AC-MAPPING: PASS
- AC-MECHANICS: PASS
- AC-TRANSPORT: PASS
- AC-RESTORE: PASS
- AC-REQUESTS: PASS
- AC-DIAGNOSTICS: PASS
- AC-DEBUGLOOP: PASS
- production_allowed: true
- Wall: 227886 ms; cost: {"amount":0.89033,"currency":"USD","basis":"public status cumulative session cost (reported, summed across per-process counters)"}
- Stops: none
- T3 executed: false

## Limits

- T2 wraps the public watchSession (Proxy around the public runtime) to capture T2 closed projections by cursor, because the T1 reader's closed projection knows only kind/sentence/token; admission still uses the shared RequestWindow.
- Restored-context integrity is unproved: a stable backend ID after restore does not prove prior context; the soak re-supplies every token (see soak.contextIntegrity).
- The soak owns no reviewers, so first-review flags are not exercised natively in T2; the controller has no restore/reset path for them and native preservation is observed in T3 (AC-RETHINK).
- Tool policy is a trusted-process detect-after check, not a sandbox.
- OAuth cost may be absent or delayed; a monetary hard cap cannot be guaranteed.
