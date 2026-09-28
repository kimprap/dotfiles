---
name: dev-implementation
description: Run an approved direct contract or lean dependency plan from the invoking controller through child-owned implementation, one same-child rethink, direct checks, bounded repair, and assurance-backed completion.
---

# Dev Implementation

Control one approved engineering outcome. The invoking agent is the `dev-implementation` controller by default, whether entry came from `dev-ask`, a prerequisite continuation, or standalone invocation. Every code-changing task belongs to a child. The controller owns intake validation, dependency scheduling, target/effect enforcement, the explicit same-child rethink, Handoff aggregation, assurance/learning dispatch, and plan lifecycle; it never implements or semantically repairs a task.

## Controller entry and identity

Activate this skill in the invoking agent. A route-owning agent normally changes from its `dev-ask` role to this controller role in place; that role change is not a dispatch and creates no Handoff to itself. Standalone invocation follows the same rule.

A separate controller is allowed only when the current approved topology explicitly binds that delegation. The delegated controller controls its own implementation children, never delegates another controller beneath itself, and returns one Handoff across the real boundary to the concrete route owner. The outer route owner neither schedules those children nor performs controller work in parallel.

Bind the concrete controller identity before any child dispatch. Reuse or resume every required controller, child, reviewer, and verifier identity; never mint a replacement under the same role name. If required-owner continuity or native transport for child ownership and same-child or same-verifier follow-up is unavailable, apply the existing stop or execution-recovery rule rather than silently changing topology.

## Intake

Require settled human intent, observable acceptance, exact writable targets and allowed effects, applicable project instructions, the concrete route owner when a delegated return boundary exists, and an approved assurance level: `compact`, `standard`, or `high`. Keep shipping, credentials, destructive/external effects, and unrelated work outside the contract unless separately authorized.

At intake, read `skill://dev-ticketing/references/task-sizing.md`. When
authoring or substantively revising a planless direct contract, resolve the
current human authority, any bound specification, and applicable canonical
project contracts before drafting, and read
`skill://dev-implementation/references/test-value.md` before selecting concrete
checks. Reuse current sources already loaded and retrieve missing or stale
sources. Keep material sizing and proof rationale in the contract's existing
prose without treating sizing as assurance.

Project an already-approved task graph and its checks exactly: a later estimate
alone never authorizes the controller to split, merge, or otherwise repartition it,
and changed behavior or check meaning returns to its authority owner before
dispatch.

Use a planless direct contract when one child can own the cohesive result. Require a repository plan only for multiple owners or dependencies, fan-in, ordered effects or migration, or likely cross-context recovery. A plan must validate with:

```text
python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN
```

Read `skill://dev-implementation/references/plan-orchestration.md` for every planned route. Read `skill://dev-implementation/references/compact-checklist.md` before compact child dispatch. For every child launch, follow-up, and collection, load the portable [agent-return contract](../../references/agent-return/return.md) and the host's return adapter; if the host cannot keep the same child, stop `transport-unavailable` and do not let the controller implement or replace the required child.

## Planless contract authoring

After producing a substantive planless direct-contract candidate, explicitly
read `~/.agents/references/plan-rethink.md` as a separate inline step and apply
it once before child dispatch. Make at most one bounded correction to
direct-contract decisions this role owns; otherwise preserve the candidate.
This is a pre-readiness planning-author pass, not the implementation
code-then-test rethink, and it never manufactures a repository plan. An exact
unchanged projection of an already approved direct contract or task graph does
not trigger another planning pass.

## Child contract

Each child receives only what it needs:

- approved human intent and owned `AC-*` IDs;
- exact owned paths/surfaces and permitted effects;
- dependency Handoffs, if any;
- applicable project instructions;
- semantic attempt number, `1` or `2`;
- exactly one concrete receiver: the bound controller identity.

Before an attempt-1 dispatch, require a caller-selected declared
response-object schema and a normal non-isolated child transport that remains
resumable after its candidate job settles. Bind the exact controller, child,
native job, task, attempt `1`, receiver, and expected `candidate` phase. Missing
explicit caller schema, a one-shot or isolated child, or an unbound identity is
a preflight failure; do not allocate the child.

Attempt 2 does not allocate another child or launch job. It requires the same
retained child and pre-binds controller, child, task, attempt `2`, receiver,
`candidate` phase, declared response-object schema, operation/report identity
and active invocation before the host-selected follow-up request.

The child rechecks its targets and callers, follows existing local conventions, changes only owned surfaces, and preserves unrelated user work. An authored fan-in or integration task is child-owned like any other code-changing task; the controller does not merge semantically.
Semantic next-owner roles in prerequisite artifacts remain `dev-implementation` or `dev-ask`; they do not authorize a new actor. An unchanged prerequisite return to `dev-implementation` reaches this same bound controller, while a return to `dev-ask` reaches the same route owner for router recomputation.

## Direct checks

Every acceptance item has one stable ID and exactly:

```text
Behavior: <observable>
Check: <command or direct static proof>; expect <exact result>
```

Run the changed behavior, not merely a test file. Read `skill://dev-implementation/references/test-value.md` for common proof selection and its separate permanent-test requirements; use existing changed-contract tests and admit retained changes only through that policy. An executable check may not be replaced by prose, a broad passing suite, or a model score. For approved shared scenarios, preserve every item's exact expected and actual observation within the child pass; sharing never drops a check or supplies an unobserved result.

## Execution recovery

When a concrete execution-mechanism failure prevents approved work from
continuing or would otherwise be escalated as an execution-related blocker,
first read and assess
`skill://dev-implementation/references/execution-recovery.md`. That reference
alone owns eligibility, same-cause accounting, finite transient fallback, and
stops. Assessment grants no retry authority. For an eligible retry, the same
owner forms the proposal and explicitly applies
`~/.agents/references/impl-rethink/recovery-rethink.md` once before execution.
Preserve its cause, allowance, effects, and observation evidence through the
existing Handoff rather than router or scheduler state. This recovery rethink
is separate from the one implementation code-then-test rethink and adds no
semantic attempt or mutation authority.

## Owner-directed return preflight

The controller's owner-directed collections begun by host-selected requests to
the same bound implementation child are exempt from another consent, attendance,
external-supervisor, or abort-capability preflight only for these three
purposes:

1. the authorized attempt-2 repair candidate;
2. the implementation-rethink Handoff after an admitted candidate in attempt 1
   or 2; and
3. a return from an already-authorized same-child execution-recovery operation.

This is an exact role-and-purpose exemption under the current approved route,
not a blanket recovery or collection exemption. It adds no deadline, observer,
service, ledger, replay, replacement, unattended-completion promise, or
authority. Recovery still applies the separate recovery rethink before every
eligible retry and never receives a second implementation rethink.

## Attempt 1: implement, rethink, smoke

1. Preflight the explicit declared response-object schema, resumable same-child transport, and exact controller/child/job/task/attempt/`candidate` bindings, then dispatch. For a planned route, set `IN_PROGRESS` before this first implementation-child dispatch; controller activation alone does not change plan state.
2. The child implements the contract and returns a candidate report by terminal type-absent ordinary completion before final smoke or Handoff. It does not publish the candidate incrementally or park for rethink.
3. Collect only that exact completed job. Immediately retain the complete original native result and matching job record before decoding or unrelated work. Apply the loaded adapter's successful-terminal, structured-valid, schema-data, and exact-identity checks; decode only its designated data as the declared response object, then require exact task, attempt, receiver, and `candidate` phase. A missing, invalid, mismatched, consumed, or alternate-source payload is unadmitted. Job settlement is not semantic task completion or child disposal.
4. After candidate admission, bind the exact child, receiving controller, task, attempt, operation, logical Handoff identity, phase, declared response schema and active invocation, then send `~/.agents/references/impl-rethink/impl-rethink.md` through the host-selected request seam. This exact collection uses the role-and-purpose exemption above. The child applies code rethink, then test rethink, makes at most one correction pass, runs every owned direct check plus the changed path, and returns one logical lean `dev-handoff` report to the controller.
5. Collect each follow-up through the loaded host adapter's collection rules, then admit exact task/attempt/owner/receiver/phase once. Job settlement implies neither task completion nor disposal.
6. Hosts with native reply correlation use the token/message path and recovery-authorized byte-exact restatement in the portable return contract.
7. Accept the Handoff only when task/attempt/receiver and declared targets/effects match and every owned check records its expected result. For an execution-related stop, confirm it identifies an actual shared-policy stop; otherwise return the specific eligibility question to the same responsible owner. The controller does not reinterpret or rerun semantic work, repair machinery, manufacture eligibility, replace a required owner, or repeatedly challenge a settled blocker.
8. Papercut accounting follows the papercut scheduling rule.

Attempt 1 includes the terminal candidate job, its admission, the single
same-child rethink, its optional correction, direct checks, and one logical
owner-directed Handoff admission. There is no second self-rethink.

## Attempt 2 and stops

Attempt 2 is one later code-changing repair of required review findings or one
directly evidenced verifier code defect. Resume the same responsible child;
allocate neither another owner nor another launch job. Pre-bind the exact
controller/child/task/attempt-2/receiver/`candidate` identity, declared schema,
active invocation and logical report identity, then send one host-selected
repair-candidate request with unchanged intent, owned acceptance, affected
targets, finding evidence and direct closure checks.

Collect the candidate through the loaded host adapter's collection rules and
admit it once; it is not incremental publication or a Handoff. Hosts with
native reply correlation use the portable return contract's token/message
candidate path and its recovery-authorized byte-exact restatement.

Only after candidate admission send a separate implementation-rethink request
to that same child through the same selected host seam. The child applies code
rethink, then test rethink, may make at most one correction pass, runs original
impacted checks plus closure checks and the changed path, and returns one lean
Handoff under that seam's retention and once-only admission rules. Papercut
accounting follows the papercut scheduling rule.

A task-local proof, tool, transport, environment, automation, fixture, collection, or capture failure follows `skill://dev-implementation/references/execution-recovery.md` before escalation. It consumes no semantic attempt only while the evaluated target, deliverable, acceptance, ownership, and authorized effects remain unchanged; role, not change size or temporary location, determines eligibility. A failed transport invocation is assessed, while transport that cannot preserve required ownership or same-child follow-up remains a stop. Required owners cannot be replaced by disposable resources. After the separate recovery rethink, an already-authorized recovery operation's same-child return uses the exact role-and-purpose collection exemption above; it receives no second implementation rethink. Attempts remain limited to attempt 1 and an eligible attempt 2, but exhausted semantic repair prohibits only another deliverable change, not otherwise eligible machinery recovery under its existing allowance.

## Assurance

Compact ends after attempt-1 rethink, direct smoke, Handoff, and papercut. It dispatches no independent review, verification, learning, or audit. The in-place controller proceeds directly to terminal validation without a self-Handoff.

Standard and high operate on the complete changed target in this order:

1. one independent `dev-code-review` discovery pass;
2. one independent `dev-verification` over every original acceptance check and every reviewer closure check;
3. one `dev-continual-learning` assessment.

These remain real independent actors and return to the concrete controller; in-place control does not absorb or impersonate them. Review runs exactly once. A required review finding may consume attempt 2 before verification. If attempt 2 is still unused and the verifier identifies a code defect, the same responsible implementation child may consume it and the same verification owner closes the repaired delta over the complete unchanged check set. An unresolved failure after attempt 2 stops. Learning receives the settled outcome, affected paths, lean Handoffs, all papercut results, and complete candidates; it does not retry. Only a current governing-rule conflict that invalidates the implementation blocks completion. Report other learning blockers as risk.

Manual permanent-test audit is a separate explicitly approved route and never follows normal completion automatically.

## Completion

For a plan, check tasks and criteria only from successful direct-check records, add each task's completion record, write a nonempty final Completion Summary, add `Completed At`, and set `DONE`. Keep the completed plan at its active path. Use `CLOSED` without `Completed At` or Completion Summary only for an explicitly stopped plan.

For direct work, retain the lean Handoffs in authored-task order. An in-place controller consumes accepted child and assurance returns, its own conclusions, and current evidence directly and performs terminal validation without a self-Handoff or a return merely to `dev-ask`. Only a genuinely delegated controller returns one lean Handoff with the settled outcome, changed targets/effects, checks, blockers/risks, papercut and learning results, and the concrete route owner as receiver. Do not create another result envelope, stage/commit, ship, deploy, or reopen completion.