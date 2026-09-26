# Engineering Flow

## Human overview

This is the concise, non-runtime map of the current generic engineering flow. Executable skills and rules remain authoritative; on disagreement, stop and repair this projection rather than treating it as an alternate workflow.

A request takes the smallest route that can settle its outcome. Cohesive one-owner work uses a planless direct contract. Multiple owners or dependencies, fan-in, ordered effects or migration, or likely cross-context recovery require a lean repository plan. When implementation is reached, the route-owning agent activates `dev-implementation` in place by default; standalone entry likewise uses the invoking agent as controller. Every code-changing task belongs to a distinct child. The controller validates, schedules, enforces ownership, requests the one same-child rethink, aggregates lean Handoffs, and controls assurance and plan lifecycle without implementing or semantically repairing. Ordinary planned fan-in is itself an authored child-owned implementation task and finishes before the assembled target's one final review and verification.

Generic invocation and proof recovery stay with the current execution owner
under `dev-implementation/references/execution-recovery.md`. Owners assess that
policy before escalating an execution-related blocker; recovery rethink applies
only before an eligible retry and remains separate from the single
implementation candidate rethink and semantic repair. Custom controllers inherit
nothing automatically. They may adopt the same sole policy only when either the
named invocation contract or a current named-skill contract explicitly binds it
before the affected operation; reusable skill adoption is not retroactive and
does not widen another custom controller.

The generic implementation controller has one narrower collection rule: after
current route approval, its collection begun by a host-selected request to the
same child needs no additional consent, attendance, external-supervisor or
abort-capability preflight for the authorized attempt-2 candidate,
implementation-rethink Handoff in either attempt, or already-authorized
recovery return. Native admission follows the portable seam and host adapter:
OMP uses child-bound wake jobs with original-result retention, successful
resolution, valid caller schema and once-only task/attempt/receiver/phase checks;
other hosts with native correlation retain token/message admission. Neither
capability means `transport-unavailable`. This adds no deadline, observer, replay, replacement, recovery
or restatement allowance, or unattended-completion promise. Reconcile and
Retrace instead keep their named lifecycle-consumer ownership, first-reply,
pending observation and abort, capacity, and observed-exit disposal contracts.

Specification, planless direct-contract, ticket-graph, and standalone-plan
authors resolve applicable current sources before drafting and apply the shared
planning rethink once after a substantive candidate and before final submission
or execution readiness. Inline authors explicitly load it as a separate step;
for delegated authoring, the caller sends one explicit follow-up to that same
author. At most one author-owned correction follows. Newly selected graph
ownership or dependencies are substantive even when acceptance is projected
unchanged; exact projections, storage copies, lifecycle-only updates, and
unchanged approved contracts do not trigger another pass. This planning pass is
separate from implementation and recovery rethink and adds no owner, stage,
state, or approval gate.

Common routes are:

- sufficient current evidence → direct answer;
- one bounded factual gap → approved `dev-research` → `dev-ask`;
- explicit raw issue or pull-request intake → `dev-triage`;
- incomplete observable behavior, acceptance, scope, or constraints → `dev-requirements`;
- explicit candidate plan, hypothesis, or design refinement → `grill-with-docs` when repository evidence matters, otherwise `grill-me`;
- a hard unexplained reproducible defect or performance regression → `dev-diagnosing-bugs`;
- settled authority, a known fix, or an approved implementation graph → `dev-implementation`;
- missing durable technical authority → `dev-specification`; when technical authority is complete but dependency ownership or recovery still needs a graph → `dev-ticketing`;
- genuine multi-session decision fog → `wayfinder`;
- an explicit permanent-test value audit → the separate read-only `dev-test-audit` route; and
- separately authorized delivery → `dev-shipping`.

Initial Route Overview approval authorizes the named prospective route, including bounded research before its dispatch. It starts exactly one first owner: delegated specialties are dispatched, while `dev-implementation` is activated in the route-owning agent by default. Reapprove only for a material change in authority, route, scope, acceptance, topology or independence, effects, shipping, a shared assumption, or equivalent capability. Stage returns, derivative artifacts, Handoffs with unchanged route impact, review, verification, learning, and presentation do not create approval gates.

Durable workflow rationale and supersession links live in [`docs/adr/INDEX.md`](../../../../docs/adr/INDEX.md). The human execution diagram is [`references/execution-flow.md`](references/execution-flow.md). Neither file runs the workflow.

Custom boundary (non-runtime): [ADR-0001 D15](../../../../docs/adr/0001-dev-workflow-authority-and-routing.md#d15--semantic-ownership-and-source-roles) identifies explicit-only Retrace as read-only repository-harness evaluation. Its human-approved scopes delegate report-only conversational Reconcile to the same scope child, which owns its reviewers. Retrace and Reconcile now explicitly adopt the sole generic execution-recovery policy for their authorized active-session invocation, setup, transport, collection, capture, and task-local machinery. That reusable named-skill adoption is known before launch, remains with the responsible execution owner, and cannot override admission, approval, reviewer identity, evidence, return budgets, semantic continuation/stops, or cleanup. All other custom controllers remain opted out absent an explicit current invocation or skill contract; historical invocation grants remain local. This is not a generic route, reusable launch template, implementation or assurance stage, completion tail, repository/evidence mutation grant, durable ledger, restart authority, or permission to resume an old run.

New implementation boundaries consult the shared
[task-sizing guidance](../dev-ticketing/references/task-sizing.md). It considers
complete worker-attempt effort separately from reliable fresh-context fit,
prefers cohesive independently checkable slices at real seams, and preserves
justified coupling. The guidance is read-only: it adds no stage or sizing
metadata and does not determine assurance.

## Decision authority

| Concern | Canonical decision |
|---|---|
| Routing, approval, semantic ownership, clean cutover, planless direct work, presentation, and shipping separation | ADR-0001: D01, D02, D05, D10–D20, D26 |
| Lean plans, planning-authoring rethink, child scheduling, lifecycle, active-path persistence, and same-child implementation rethink | ADR-0002: D06, D08, D09, D21, D29, D30 |
| New task sizing and approved-graph projection | ADR-0001: D11; ADR-0002: D08, D09 |
| Two attempts, one-shot review, verifier closure, and permanent-test value | ADR-0003: D03, D04, D22, D28 |
| Same-owner pre-escalation execution recovery, required versus disposable resources, recurrence, explicit caps, transient fallback, and explicit invocation-local or named-skill custom adoption | ADR-0003 D03, D04; ADR-0002 D06, D21 |
| Learning and the human-map/journal authority relationship | ADR-0004: D07, D23 |
| Every-boundary papercut accounting | ADR-0007: D24 |
| Portable session envelope and five-field completion | ADR-0009: D27 |

## Implementation contract

### Direct or planned entry

`dev-implementation` receives settled human intent, observable acceptance, exact writable paths and effects, applicable instructions, the concrete route owner for any delegated return boundary, and the selected assurance. Its controller is the invoking agent by default. A separate controller exists only when the approved topology explicitly binds one; it owns its children without recursive controller delegation or outer-agent double scheduling.
Prerequisite artifacts keep their semantic next-owner roles. A return to `dev-implementation` reaches the same route agent's in-place controller unless an approved delegated controller was already bound; a return to `dev-ask` reaches the same route agent for recomputation. Neither unchanged continuation adds approval, a router hop, or a self-Handoff. Required controller, child, reviewer, and verifier identities are reused or resumed rather than replaced.

Use a planless direct contract when one child can own and check the cohesive result in one reliable fresh context. Use a lean plan only when dependency ownership, fan-in, ordered effects or migration, or recovery requires it; known safe seams can divide an overall atomic cutover into dependency-ordered tasks. A lean plan contains only:

1. Outcome and authority;
2. Scope and effects;
3. Tasks;
4. Acceptance;
5. Recovery and stops; and
6. Completion Summary only when `DONE`.

Tasks bind stable `T*` IDs, one owner, dependencies, exact targets, acceptance IDs, and one receiver. Each acceptance item has exactly:

```text
Behavior: <observable>
Check: <command or direct static proof>; expect <exact result>
```

Concrete-check authors in specification, self-contained plans, and direct contracts read `dev-implementation/references/test-value.md` before acceptance binds. Its common principles select sufficient representative proof and compatible shared observations; permanent-only requirements remain scoped to retained tests. Ticketing projects exact acceptance, and later meaning changes return to authority rather than being optimized during execution.

The active repository path remains the sole execution and continuation source through `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED`. Storage copies exact bytes to that path for every valid state. Completion leaves a plan `DONE` there; cancellation leaves an explicitly authorized plan `CLOSED` there. Automatic archival, active-path removal, or an archive completion gate is not part of the workflow. Historical archives remain read-only history.

### Child work and attempts

Each implementation child receives approved intent and acceptance IDs, exact owned paths/effects, dependency Handoffs, project instructions, semantic attempt `1` or `2`, its concrete controller as receiver and an explicit caller-selected response-object schema. Attempt 1 binds the exact launch job and a normal non-isolated child that remains resumable after settlement.

Before allocation, OMP collectors with `taskDepth > 0` stop
`transport-unavailable`; no delegated-controller substitution. Depth 0 still
requires all other capabilities and bindings. Capable other-host topology and
named lifecycle consumers remain unchanged.

Attempt 1 terminal-completes its type-absent candidate before final checks. On OMP every terminal child return is one direct native `yield` tool call, never through eval or another tool bridge: a bridged yield reports `Result submitted.` but registers no launch or wake job, so every launch and follow-up request states this. The controller retains the exact original launch result and row, validates and decodes designated data, then separately requests the same child's code-then-test rethink. At most one correction, every owned check and changed-path smoke precede its lean Handoff. An eligible attempt 2 resumes the same child for a repair candidate without another child or launch job, then separately requests rethink only after candidate admission.

On OMP those follow-ups use `write agent://<child>` and one outstanding request. Earlier jobs must already be retained; consider only the first task-job row for that child after the receipt with native `agentUrlId` equal to its registry ID. Retain the original native result and row before decoding designated `response_object` data; require successful resolution, valid inherited caller schema and exact task/attempt/owner/receiver/phase once. The child terminal-yields type-absent data exactly `{"response":"<complete report>"}` by direct native `yield`. Bind by child/request order, never job-ID equality or novelty: held IDs gain suffixes and evicted IDs may be reused; do not wait out holds. Launch output, old/duplicate/foreign rows, text-only or rejecting jobs even with structured data, and relays are unadmitted. Delivery is not a reply; failed delivery, changed revived identity, observed no-job registration failure or the no-job wait stop ends that request without resend/replacement. No OMP token, send-and-wait or restatement branch exists. Job settlement is neither task completion nor disposal.

Keep OMP native wait active in the same controller turn from launch or eligible
follow-up receipt until the original matching result and row are retained.
Ordinary wait messages, including `wakeRelay` notices, do not finish collection;
do not end that turn. Display-only auto-delivery without the original structured
object is not a reply. Dispatch on `details.message.receipts[].outcome`:
`failed` and `injected` stop without waiting for a new wake row, as does
changed-identity `revived`. Only `woken` or same-identity `revived` enters
collection. After reading that receipt, a later native `wait` result with empty
`details.jobs` and text `No running background jobs to wait for.` is the
adapter's no-job wait stop: stop that request as a missing reply without
admission or further wait and assess it under the shared execution-recovery
policy; absence of a row alone proves nothing. No resend, replacement, reset,
polling rule or alternate-source recovery is added.

Other hosts that supply native reply correlation retain the shared token/message path and its only explicitly recovery-authorized byte-exact restatement; it adds no semantic work, allowance, replacement or second admission. A host with neither native correlation nor durable completion jobs stops `transport-unavailable`, without an invented fallback.

Every completed repository-work Handoff is followed by exactly one papercut
look from the same child; only child unavailability permits controller fallback.

### Assurance

Compact ends after attempt-1 rethink, direct smoke, lean Handoff, and papercut accounting. It dispatches no independent review, verifier, learning, or audit. The in-place controller proceeds without a self-Handoff.

Standard and high operate on the completely assembled target and use exactly:

1. one independent tests-first `dev-code-review` over every changed file;
2. one independent `dev-verification` over all original acceptance checks and every required review closure check; and
3. one `dev-continual-learning` assessment.

These remain independent actors and return to the concrete controller; controller activation does not absorb or impersonate them. Review never reruns. Verifier repair reuses the same responsible implementation child and the same verifier over the complete unchanged check set.

Review runs once and never returns after repair. It reports `APPROVED`, `REPAIR REQUIRED`, or `INCONCLUSIVE`; required findings need direct material evidence, the smallest safe correction, and the exact acceptance-check grammar. A repair required by review goes directly to verification.

The verifier returns a fresh aggregate over the complete fixed check set. Its invocation, runner, transport, environment, automation, fixture, collection, and capture failures are assessed under the shared execution-recovery policy before escalation while the same verifier remains read-only toward the evaluated target and acceptance. A lower-level non-success label alone does not prove recovery exhausted. Replaceable machinery differs from the required verifier; loss of that verifier remains a stop. An initial execution allocation is not an implicit recovery cap, but an explicit total cap remains binding. After eligible recovery, the same verifier may issue a fresh complete aggregate from compatible valid observations and continues the fixed set. If attempt 2 remains and a check directly proves a code defect, one implementation child may repair it; the same verifier then reruns the complete unchanged check set. The verifier never repairs product or code, drops checks, reopens review, delegates its conclusion, or overrides custom-protocol decisions.

Within a fresh pass, approved shared scenarios may establish multiple criteria without repeating execution solely per reference. Each item keeps its exact observation and ordered accounting on the same target under compatible conditions; command spelling and another role's result prove nothing missing. Blocked later observations remain unproved, and incompatible conditions require separate execution. Required closure-check selection uses the same shared policy without reviewer execution.

## Manual permanent-test audit

`dev-test-audit` is explicit, separate, and read-only. The requested scope wins; otherwise the whole permanent-test portfolio is in scope. Before the initial Route Overview approval, show the exact scope and ordered list of every scoped test file; do not launch auditor A or B. After approval, apply `skill://dev-implementation/references/test-value.md` as the sole permanent-test policy.

1. Start persistent auditor A alone with the approved complete boundary. Include no deferred wrapper path in that initial packet.
2. After A's first complete proposal, send `~/.agents/references/impl-rethink/test-rethink.md` to that same A once as an explicit follow-up.
3. If A then has no findings, accept and stop without B.
4. Otherwise start persistent B with the identical boundary and A's revised proposal. Include no deferred wrapper path in B's initial packet.
5. After B's first complete proposal, send the same installed test rethink to that same B once as an explicit follow-up.
6. Later turns alternate complete proposals only; never resend rethink.
7. Accept agreement or stop on unchanged/repeated proposals, non-applicable revision, persistent blockage, lost reviewer during proposal exchange, or authority conflict.

Every proposal uses the complete proposal contract in `skill://dev-test-audit/references/opinion-agent.md`. A skipped file is `unknown` and remains preserved.

Accepted fixes return to `dev-ask` for one separately approved direct or planned mutation batch; only the human may adjust that default. Original A performs the one audit-specific closure after the batch and before normal review or verification. If original A is unavailable only for closure, omit and report `original-A closure unavailable`; never substitute or claim closure, but continue normal assurance without opening another batch.

## Terminal hooks and completion

### Papercut

After every completed repository-work boundary, load `papercut` once even when no candidate is expected. The skill—not the caller—owns discovery, qualification, redaction, consolidation, and opt-in persistence. Return every distinct qualifying repository-owned root cause in authored-task order. Strict exclusions remain in force, and a no-result look returns `Papercut: none` without ledger access. Direct non-workflow implementation performs the same look after verification and before completion.

### Learning

Standard and high invoke `dev-continual-learning` once after review and verification. Intake is the settled outcome, affected paths, lean Handoffs, all papercut results, and complete Learning Candidates. There is no retry. After portable assessment returns, the engineering adapter loads canonical `dev-handoff`, composes its first return with the title and five headings once in canonical order, puts assessment evidence and exactly one normalized Learning line inside `Checks` without invented implementation acceptance IDs, and names the concrete controller as receiver. It checks the unsent envelope and fixes only that draft in place; it never invokes portable assessment again. `curated` and `no durable learning` permit completion. An ordinary blocked assessment is reported as a residual risk. Only a current governing-rule conflict that makes the implementation invalid or unsafe blocks completion. Compact records `Learning: skipped for compact`.

### Five-field presentation

After terminal success, the specialty reads [the canonical completion input contract](../../references/completion-presentation-input.md) before constructing its current fence. The reference owns the schema and validation rules; presenter activation remains after construction.

`Checks` includes the terminal checks, every material papercut line in authored-task order or `Papercut: none`, and exactly one normalized Learning line. Planned completion also names the current active plan and `DONE` state. The in-place controller consumes accepted child and assurance returns, its own conclusions, and current plan evidence directly before terminal validation; it emits no Handoff to itself or merely to `dev-ask`. A genuinely delegated controller returns once across its real boundary to the concrete route owner. The same agent that validates success applies `completion-presentation` directly and emits only the five corresponding H2 sections. The presenter is not dispatched and does not verify, repair, settle, archive, create a Handoff, or ship.

No target manifest, proof digest, receipt, archive locator, or model score is completion evidence. Non-success, stale, malformed, reordered, or incomplete input preserves the specialty's stop instead of producing a completed report.

## Source roles and maintenance

Executable skill and rule prose owns live behavior. Approved product, requirements, specification, direct authority, and plans own their respective decisions and scope. Lean Handoffs transfer current results; they do not create authority. Active ADRs own durable rationale. This file and the human execution map are synchronized projections only.

A skill-local `MAINTENANCE.md` may use the optional append-only convention owned by `craft-skill`. Such journals are non-runtime, noncanonical provenance and never override executable prose, an approved artifact, or an active ADR. Later corrections append with `Supersedes`; history is not rewritten.

## Maintenance guidance

When this workflow changes, update executable owners, generic callers, focused evals, this map, active ADRs, and the index in one clean cutover. Preserve Reconcile and historical archives unless separately authorized. Removed proof machinery, compatibility schemas, repeated-review loops, and automatic plan archival may be named only as prohibited or historical behavior; they are not active alternatives.
