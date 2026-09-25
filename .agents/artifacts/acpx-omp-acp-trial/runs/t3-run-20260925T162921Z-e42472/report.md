# T3 run t3-run-20260925T162921Z-e42472

- T2 dependency: t2-soak-20260925T162401Z-bf0035
- Corrects: none
- AC-REHEARSAL: PASS
- AC-CONVERSATION: PASS
- AC-RETHINK: PASS
- AC-ARTIFACT: PASS
- AC-RETRACE: FAIL
- AC-DURATIONS: PASS
- AC-CLEANUP: PASS
- Capability: inconclusive (S1 supported; S2 supported; S3 inconclusive: controller-stop)
- Production entered: true
- evaluation_complete: false
- Longest completed production turn: 571763 ms; 2x 1143526; 3x 1715289; censored max unavailable; missing/incomplete 0
- Wall: 2256904 ms; cost: {"amount":3.878528,"currency":"USD","basis":"public status cumulative session cost per actor"}; tokens: 2028749
- Stops: none

## Unproved

- restored-context integrity after same-session restoration: unproved (no required context depends on it)

## Limits

- Rehearsal is diagnostic tiny-profile evidence and never production evidence.
- OAuth cost may be absent or delayed; a monetary hard cap cannot be guaranteed and unknown cost is never zero.
- Measured durations are inputs for the medium production profiles only; no timeout is selected and 30-60 minutes for xhigh remains an unverified inference.
- Tool policy is a trusted-process detect-after check, not a sandbox.
