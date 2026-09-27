# Engineering execution flow

This is a human-only overview. It does not run work or define transitions. `dev-ask`, `dev-implementation`, and the executable stage skills are authoritative.

```mermaid
flowchart TD
    A[Approved direct work or lean plan] --> K[Route owner activates controller in place]
    K --> B[Distinct resumable implementation child with explicit response schema]
    B --> J[Attempt 1 terminal ordinary candidate job]
    J --> N[Retain exact native job result and admit candidate]
    N --> C[Same child receives rethink, checks, then publishes one logical Handoff]
    C --> D{Logical Handoff state?}
    D -- Pending --> O[Continue permitted native observation]
    O --> D
    D -- Actual stop --> HB[Blocked Handoff, then papercut once]
    HB --> X[Stop with the exact blocker]
    D -- Admitted once --> H[Lean Handoff, then papercut once]
    H --> P{Assurance}
    P -- Compact --> Z[Five-field completion]
    P -- Standard or high --> R[One code review]
    R -- Clear --> V[One verification]
    R -- Required repair --> I2[Same child receives host-selected attempt-2 repair request]
    I2 --> I2A[Retain original native return and admit logical candidate once]
    I2A --> I2R[Separate rethink, checks, and logical Handoff collection]
    I2R --> V
    R -- Cannot close --> X
    V -- Verified --> L[One learning assessment]
    V -- Eligible code repair --> I2V[Same child receives host-selected attempt-2 repair request]
    I2V --> I2VA[Retain original native return and admit logical candidate once]
    I2VA --> I2VR[Separate rethink, checks, and logical Handoff collection]
    I2VR --> VC[Same verifier closes the full check set]
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

The semantic route names `dev-implementation`, while the invoking route agent normally performs that controller role in place. Standalone entry uses its invoking agent the same way. Only a topology already approved by the human may insert a separate controller; that controller owns its children and returns across the real boundary without recursive controller delegation or outer-agent double scheduling.

OMP collectors at `taskDepth > 0` stop `transport-unavailable` before creating
any child; do not substitute a delegated controller. Only depth 0 with the
remaining required capabilities may proceed. This host gate does not alter
capable other-host topology or the Reconcile/Retrace acpx controller.

For the `dev-implementation` controller only, collection begun by a
host-selected request to the same bound child for an authorized attempt-2
candidate, implementation-rethink Handoff in either attempt, or
already-authorized recovery return needs no second consent, attendance,
external-supervisor or abort-capability preflight. Load the portable return seam
and host adapter. OMP uses `write agent://<child>` and child-bound wake jobs:
one outstanding request, all earlier jobs retained, then the first task-job row
for that child after its eligible receipt. Retain the original result and row
before decoding. Keep native wait active in the same controller turn from launch
or eligible follow-up receipt through original-result/row retention. Ordinary
wait messages, including `wakeRelay` notices, do not finish collection; do not
end that turn. Display-only auto-delivery is not a reply. Read follow-up
`details.message.receipts[].outcome`: `failed` and `injected` stop without
waiting for a new row; changed-identity `revived` stops. Only `woken` or
same-identity `revived` enters collection. After reading that receipt, a later
native `wait` result with empty `details.jobs` and text
`No running background jobs to wait for.` is the adapter's no-job wait stop:
stop that request as a missing reply without admission or further wait and
assess it under the shared execution-recovery policy. No resend, replacement,
reset, polling rule or alternate-source recovery. Require matching native
`agentUrlId`, successful resolution, valid inherited caller schema and exact
task/attempt/owner/receiver/phase once. Job IDs may be suffixed or reused;
equality or novelty never binds a follow-up. The child terminal-yields
type-absent data with exactly one string `response` field through one direct
native `yield` tool call, never through eval or another tool bridge: a bridged
yield reports `Result submitted.` but registers no launch or wake job, and every
launch and follow-up request states this. Reject old, duplicate, foreign,
text-only, failed/rejected and relay-only results. Delivery is not a reply;
failed delivery, changed revived identity, observed no-job registration failure
or the no-job wait stop ends that request without resend or replacement. OMP has
no token or restatement fallback. Other hosts with native reply correlation
retain the portable token/message and narrowly recovery-authorized exact-copy
rules; a host with neither capability stops `transport-unavailable`. Native OMP
mechanics and active settings live only in its adapter. Reconcile and Retrace
run under their acpx controller (`harnesses/omp/acp-controller/`), which owns
their reviewer and scope sessions, first replies, pending observation, capacity
and observed-exit disposal.


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
| Approved direct work | One child can own and check the cohesive result in one reliable fresh context | Route-owning agent activates `dev-implementation` in place and dispatches the distinct child without a controller self-Handoff |
| Approved lean plan | Necessary multiple-owner or dependency ownership, fan-in, ordered effects or migration, or recovery uses known safe task seams | In-place controller schedules dependency-ready child tasks; any ordinary fan-in is an authored child-owned task completed before final review and verification |
| Prerequisite Handoff | Next-owner role is `dev-implementation` and route impact is unchanged | Concrete route owner activates its controller role in place unless the approved topology already bound a separate controller; no extra approval or router hop |
| Prerequisite Handoff | Next-owner role is `dev-ask` | Concrete route owner resumes router recomputation before continuing |
| Attempt-1 candidate job | Explicit-schema resumable child terminal-completed its type-absent ordinary candidate | Collect only the exact job, immediately retain the original native result and job record, validate and decode only the adapter-designated structured data, then admit exact task/attempt/receiver/phase; job settlement is not task completion or disposal |
| Authorized attempt-2 repair | A required review finding or eligible verifier defect is bound and the same child is retained | Bind controller/child/task/attempt-2/receiver/candidate, schema, invocation and logical report; request and admit through the selected host seam above, never another child or launch job |
| Pending generic logical report | No admissible original native return has arrived | Continue only the selected host observation; no OMP token/restatement or alternate-source fallback. Silence or a missing row alone is not a failed turn; only the OMP adapter's positive native no-job wait observation after an eligible receipt stops that request as a missing reply |
| Admitted implementation candidate | Exact launch-job or host-selected attempt-2 candidate admission succeeded | Send the same child one separate implementation rethink under the exact exemption; admit its Handoff through the same host-selected seam after checks, with original-result retention and once-only identity/schema validation; job settlement is not task completion or disposal |
| Current execution | A concrete execution-mechanism failure prevents continuation or would otherwise be escalated | Same owner first assesses `skill://dev-implementation/references/execution-recovery.md`; an eligible proposal receives recovery rethink before execution, while an ineligible failure preserves evidence and names the exact stop |
| Authorized implementation recovery | The same child has applied recovery rethink for an eligible, already-authorized recovery operation | Collect that operation's logical report under the same exact role-and-purpose and provenance rules; do not send another implementation rethink or add a deadline, supervisor, replay, replacement, restatement authority, allowance, or second admission |
| Child Handoff | An execution-related stop names no actual shared-policy stop condition | Controller returns the specific eligibility question to the same responsible owner without repair, replacement, or repeated challenge |
| Rethink | A required direct check still fails and the shared execution-recovery policy permits no further execution | Child emits a blocked lean Handoff to the concrete controller, loads papercut once, then stops with the failed check and preserved work |

## Review and verification

| From | Condition | Next |
|---|---|---|
| Completed standard/high implementation | Handoffs and papercut results are complete | One independent code reviewer returns to the concrete controller |
| Review | No required finding | One independent verifier returns to the concrete controller |
| Review | Required finding and attempt 2 is available | Same responsible implementation child performs attempt 2, rethink, checks, Handoff, and papercut; then go directly to the verifier without rerunning review |
| Review | Inconclusive or repair cannot close | Stop; do not rerun review |
| Verification | Every original and review-closure check passes | Learning |
| Verification | A concrete execution-mechanism failure prevents a required observation or would otherwise be escalated | Same verifier assesses the shared execution-recovery policy; only an eligible retry receives recovery rethink and the smallest complete valid affected-check execution |
| Verification recovery | Successful eligible machinery correction preserves the same target and compatible evidence | Same verifier preserves failed history, continues the remaining fixed set, and issues a fresh complete aggregate |
| Verification recovery | A required verifier is lost, an explicit applicable cap is exhausted, prior effects are uncertain, allowance history is unknown, or another shared-policy stop applies | Preserve the failed or inconclusive evidence; do not retry, substitute, repair from the parent, or infer a reset |
| Verification recovery | Semantic repair is exhausted but an otherwise eligible machinery correction remains | Permit only the machinery correction under its existing allowance; refuse any further deliverable mutation |
| Verification recovery | Required behavior, check meaning, expected result, target, ownership, or effects would change | Return to the owning authority |
| Verification | Direct code defect and attempt 2 is still available | Same responsible implementation child repairs; the same verifier reruns the complete unchanged check set |
| Verification | Attempt 2 is unavailable for a needed deliverable change, code closure fails, or nonrecoverable evidence is inconclusive | Stop |

A fresh approved shared scenario may support several exact item observations
under compatible conditions on one target, with no repetition solely per reference.
Ordered accounting remains complete; blocked observations and incompatible states
cannot be filled by command matching or another role's evidence. Code repair still
requires the same verifier's complete unchanged check set.

## Terminal hooks

| Hook | When | Result |
|---|---|---|
| Papercut | After every completed repository-work Handoff; for direct non-workflow work, after verification and before completion | One look owned by the child or direct owner; controller fallback only if the child is unavailable; all distinct qualifying root causes retained in authored-task order |
| Compact | After rethink, direct checks, child Handoff, and papercut | In-place controller validates and renders completion without a self-Handoff; an approved delegated controller alone returns to its concrete route owner |
| Learning | Once after review and verification for standard/high | Adapter invokes portable assessment once, loads canonical `dev-handoff`, and first-returns one checked canonical Handoff with assessment evidence plus exactly one Learning line in `Checks`, no invented AC IDs, and the concrete controller receiver |
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
