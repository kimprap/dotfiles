# Engineering execution flow

This is a human-only overview. It does not run work or define transitions. `dev-ask`, `dev-implementation`, and the executable stage skills are authoritative.

```mermaid
flowchart TD
    A[Approved direct work or lean plan] --> B[Implementation child]
    B --> C[Same child rethinks code, then tests]
    C --> D{Direct checks pass?}
    D -- No --> HB[Blocked Handoff, then papercut once]
    HB --> X[Stop with the exact blocker]
    D -- Yes --> H[Lean Handoff, then papercut once]
    H --> P{Assurance}
    P -- Compact --> Z[Five-field completion]
    P -- Standard or high --> R[One code review]
    R -- Clear --> V[One verification]
    R -- Required repair --> I2[Attempt 2 by implementation child]
    I2 --> V
    R -- Cannot close --> X
    V -- Verified --> L[One learning assessment]
    V -- Eligible code repair --> I2V[Attempt 2 by implementation child]
    I2V --> VC[Same verifier closes the full check set]
    VC -- Verified --> L
    VC -- Not verified --> X
    V -- Final failure --> X
    L -- Curated or no durable learning --> Z
    L -- Ordinary blocked assessment --> Z
    L -- Governing-rule conflict --> X
    M[Explicit manual test audit] --> MS[Show exact scope and ordered test files]
    MS --> MG{Initial Route Overview approved?}
    MG -- No --> Y[Audit ends separately; A not launched]
    MG -- Yes --> AA[Persistent A alone: first complete proposal]
    AA --> AR[Same A receives one rethink after first return]
    AR --> AF{A revised proposal has findings?}
    AF -- No --> AN[Accept and stop without B]
    AN --> Y
    AF -- Yes --> BA[Persistent B receives same boundary and A revised proposal]
    BA --> BF[B first complete proposal]
    BF --> BR[Same B receives one rethink after first return]
    BR --> REC[Proposal-only alternating reconciliation if needed]
    REC --> AO{Audit result}
    AO -- Agreement --> AP[Accept and synchronize the other live auditor]
    AO -- Unchanged or repeated proposal --> Y
    AO -- Non-applicable revision --> Y
    AO -- Persistent blockage --> Y
    AO -- Lost proposal reviewer --> Y
    AO -- Authority conflict --> Y
    AP --> FX{Accepted merge or remove fixes?}
    FX -- No --> Y
    FX -- Yes --> GA[Fresh Route approval for the exact fix batch]
    GA --> MB[One mutation batch; only the human may adjust]
    MB --> OA{Original A available?}
    OA -- No --> LU[Omit closure; report unavailable and do not substitute]
    LU --> P
    OA -- Yes --> OC[Original A audit-specific closure]
    OC -- CLOSED --> P
    OC -- NOT CLOSED or INCONCLUSIVE --> Y
```

## Entry and implementation

For a new boundary, apply the shared
[task-sizing guidance](../../dev-ticketing/references/task-sizing.md) before
choosing direct or planned entry. Record only a brief rationale in existing
prose. The sizing heuristic neither adds a stage nor changes assurance, and an
approved graph is projected without automatic repartitioning.

Before drafting, specification, planless direct-contract, ticket-graph, and
standalone-plan authors resolve the applicable current authority and shared
sizing, proof, plan, and canonical sources for decisions they own. Storage and
the actual harness companion are resolved only when publishing. After a
substantive candidate, the same author applies the shared planning
rethink once before final submission or execution readiness and may make at
most one bounded correction. A delegated caller sends it as an explicit
follow-up to that same author; an inline author loads it as a separate step. A
new ownership/dependency graph is substantive even with exact projected
acceptance. Exact projections, storage copies, lifecycle-only updates, and
unchanged approved contracts bypass this authoring pass. This adds no route
owner, stage, state, or approval gate.

Before checks bind, specification, self-contained plan, and direct-contract
authors use the shared `dev-implementation/references/test-value.md` policy.
Projection preserves exact acceptance; later meaning changes return to
authority.

| From | Condition | Next |
|---|---|---|
| Approved direct work | One child can own and check the cohesive result in one reliable fresh context | Implementation child without a repository plan |
| Approved lean plan | Necessary multiple-owner or dependency ownership, fan-in, ordered effects or migration, or recovery uses known safe task seams | Implementation controller schedules dependency-ready child tasks; any ordinary fan-in is an authored child-owned task completed before final review and verification |
| Candidate | Child has finished its first implementation pass | Same child receives the single implementation code-then-test rethink |
| Rethink | Direct checks pass | Child emits one lean Handoff, then loads papercut once |
| Current execution | A concrete execution-mechanism failure has unchanged authority, acceptance, ownership, target, and effects | Same owner follows `skill://dev-implementation/references/execution-recovery.md`, explicitly applies recovery rethink before every retry, and retains cause and allowance evidence in the existing Handoff |
| Rethink | A required direct check still fails and the shared execution-recovery policy permits no further execution | Child emits a blocked lean Handoff, loads papercut once, then stops with the failed check and preserved work |

## Review and verification

| From | Condition | Next |
|---|---|---|
| Completed standard/high implementation | Handoffs and papercut results are complete | One independent code review |
| Review | No required finding | One independent verifier |
| Review | Required finding and attempt 2 is available | Implementation child performs attempt 2, rethink, checks, Handoff, and papercut; then go directly to the verifier |
| Review | Inconclusive or repair cannot close | Stop; do not rerun review |
| Verification | Every original and review-closure check passes | Learning |
| Verification | A concrete execution-mechanism failure is eligible under unchanged target, required behavior, check meaning, expected result, ownership, and effects | Same verifier follows the shared execution-recovery policy, applies recovery rethink before every retry, and reruns the smallest complete valid affected-check scenario without consuming a semantic attempt |
| Verification recovery | The shared per-cause or transient policy requires a stop, prior effects are uncertain, or allowance history is unknown | Preserve the failed or inconclusive evidence; do not retry, substitute, or infer a reset |
| Verification recovery | Required behavior, check meaning, expected result, target, ownership, or effects would change | Return to the owning authority |
| Verification | Direct code defect and attempt 2 is still available | Implementation child repairs; the same verifier reruns the complete unchanged check set |
| Verification | Attempt 2 is unavailable, code closure fails, or nonrecoverable evidence is inconclusive | Stop |

A fresh approved shared scenario may support several exact item observations
under compatible conditions on one target, with no repetition solely per reference.
Ordered accounting remains complete; blocked observations and incompatible states
cannot be filled by command matching or another role's evidence. Code repair still
requires the same verifier's complete unchanged check set.

## Terminal hooks

| Hook | When | Result |
|---|---|---|
| Papercut | After every completed repository-work Handoff; for direct non-workflow work, after verification and before completion | One look owned by the child or direct owner; parent fallback only if the child is unavailable; all distinct qualifying root causes retained in authored-task order |
| Compact | After rethink, direct checks, Handoff, and papercut | Five-field completion with `Learning: skipped for compact` |
| Learning | Once after review and verification for standard/high | `curated`, `no durable learning`, or `blocked <reason>` |
| Ordinary learning block | Assessment cannot finish for a non-governing reason | Continue to completion and report the reason as risk |
| Governing-rule conflict | A current rule makes the implementation invalid or unsafe | Stop without completion presentation |
| Completion | Successful terminal evidence is settled | Render only Outcome, Changes, Checks, Risks, and Next |

## Manual audit and stops

| Event | Transition |
|---|---|
| Explicit permanent-test audit | Before the initial Route Overview approval, show the exact requested or complete-suite scope and ordered list of every scoped test file; do not launch A or B |
| Route Overview approved for that target and boundary | Start persistent A alone; include no deferred wrapper path in that initial packet |
| A's first complete return | Send installed `test-rethink.md` to the same A exactly once as an explicit follow-up |
| A's revised proposal has no findings | Accept and end the audit without starting B |
| A's revised proposal retains findings | Start persistent B with the identical boundary and A's revised proposal; include no deferred wrapper path in B's initial packet |
| B's first complete return | Send installed `test-rethink.md` to the same B exactly once as an explicit follow-up |
| B's revised proposal does not establish agreement | Alternate complete proposal revisions between the same persistent A and B; later turns contain proposals only and never resend rethink |
| Every proposal | Use the opinion-agent complete-proposal contract; a skipped file is unknown and remains preserved |
| Agreement | Accept the complete proposal and synchronize the other live auditor |
| Unchanged/repeated proposals, non-applicable revision, persistent blockage, lost reviewer during proposal exchange, or authority conflict | Stop read-only, preserve every test and completed result, and do not pick a winner, add a round cap, or replace an auditor |
| Accepted proposal has no `merge` or `remove` fix | End the audit without changing implementation state |
| Accepted proposal has `merge` or `remove` fixes | Return to `dev-ask` for a fresh Route Overview approving the exact fix batch and direct or planned route |
| Exact fix batch is approved | Execute one separately approved mutation batch by default; only the human may adjust that allowance |
| Approved batch completes and original A is available | Original A performs one audit-specific closure over only the accepted fixes and preserved value before normal review or verification |
| Original A is unavailable only for closure | Omit audit-specific closure, report it unavailable, do not substitute or claim closure, and continue normal assurance without reopening the batch |
| Original A returns `CLOSED` | Continue through the approved route's normal assurance, review, and verification sequence |
| Original A returns `NOT CLOSED` or `INCONCLUSIVE` | Stop without new findings, repair authority, a substitute auditor, or another mutation batch |
| Missing authority, failed direct check, terminal review/verification failure, unsafe partial effect, or governing-rule conflict | Stop, preserve completed work, and name the exact receiver or recovery condition |

A completed plan remains `DONE` at its active repository path. Completion does not require an archive, manifest, digest, receipt, model grader, second reviewer, or review rerun.
