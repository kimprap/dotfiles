---
name: dev-implementation
description: Execute an approved direct contract or lean dependency plan through child-owned implementation, one same-child rethink, direct checks, bounded repair, and assurance-backed completion.
---

# Dev Implementation

Control one approved engineering outcome. Every code-changing task belongs to a child. The parent owns intake validation, dependency scheduling, target/effect enforcement, the explicit same-child rethink, Handoff aggregation, assurance/learning dispatch, and plan lifecycle; it never implements or semantically repairs a task.

## Intake

Require settled human intent, observable acceptance, exact writable targets and allowed effects, applicable project instructions, one receiver, and an approved assurance level: `compact`, `standard`, or `high`. Keep shipping, credentials, destructive/external effects, and unrelated work outside the contract unless separately authorized.

Use a planless direct contract when one child can own the cohesive result. Require a repository plan only for multiple owners or dependencies, fan-in, ordered effects or migration, or likely cross-context recovery. A plan must validate with:

```text
python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN
```

Read `skill://dev-implementation/references/plan-orchestration.md` for every planned route. Read `skill://dev-implementation/references/compact-checklist.md` before compact dispatch. Native child transport must preserve ownership and same-child follow-up; if it cannot, stop `transport-unavailable` and do not let the parent implement.

## Child contract

Each child receives only what it needs:

- approved human intent and owned `AC-*` IDs;
- exact owned paths/surfaces and permitted effects;
- dependency Handoffs, if any;
- applicable project instructions;
- semantic attempt number, `1` or `2`;
- exactly one receiver.

The child rechecks its targets and callers, follows existing local conventions, changes only owned surfaces, and preserves unrelated user work. An authored fan-in or integration task is child-owned like any other code-changing task; the parent does not merge semantically. If TDD was explicitly requested, bind `dev-tdd` without adding scope or acceptance.

## Direct checks

Every acceptance item has one stable ID and exactly:

```text
Behavior: <observable>
Check: <command or direct static proof>; expect <exact result>
```

Run the changed behavior, not merely a test file. Use existing changed-contract tests; add or alter permanent tests only through `skill://dev-implementation/references/test-value.md`, the sole permanent-test policy. An executable check may not be replaced by prose, a broad passing suite, or a model score.

## Attempt 1: implement, rethink, smoke

1. Dispatch the child to implement the contract and return a candidate before final smoke or Handoff.
2. Send `~/.agents/references/impl-rethink/impl-rethink.md` explicitly to that same child. The child applies code rethink, then test rethink, makes at most one correction pass, runs every owned direct check plus the changed path, and returns one lean `dev-handoff` envelope.
3. Accept the Handoff only when task/attempt/receiver and declared targets/effects match and every owned check records its expected result. The parent does not reinterpret or rerun the child's semantic work.
4. After the completed repository-work Handoff, have the same child load `papercut` once. Parent fallback is allowed only when that child is unavailable.

Attempt 1 includes implementation, the single same-child rethink, its optional correction, and smoke. There is no second self-rethink.

## Attempt 2 and stops

Attempt 2 is one later code-changing repair of a required reviewer or verifier finding. Dispatch one responsible implementation child with the unchanged intent, owned acceptance, affected targets, finding evidence, and direct closure check. After its candidate, send the same rethink wrapper once; the child gets one correction pass, runs original impacted checks plus closure checks, returns one lean Handoff, and performs papercut accounting.

A proof, tool, or transport correction consumes no semantic attempt unless product/code bytes change. Attempts are limited to attempt 1 and an eligible attempt 2. Stop on undeclared mutation, failed child transport, unchanged repeated failure, exhausted attempt 2, or unresolved code failure after attempt 2. Preserve accepted independent work and report the exact blocker and receiver.

## Assurance

Compact ends after attempt-1 rethink, direct smoke, Handoff, and papercut. It dispatches no independent review, verification, learning, or audit.

Standard and high operate on the complete changed target in this order:

1. one independent `dev-code-review` discovery pass;
2. one independent `dev-verification` over every original acceptance check and every reviewer closure check;
3. one `dev-continual-learning` assessment.

Review runs exactly once. A required review finding may consume attempt 2 before verification. If attempt 2 is still unused and the verifier identifies a code defect, its responsible implementation repair may consume it and the same verification owner closes the repaired delta. An unresolved failure after attempt 2 stops. Learning receives the settled outcome, affected paths, lean Handoffs, all papercut results, and complete candidates; it does not retry. Only a current governing-rule conflict that invalidates the implementation blocks completion. Report other learning blockers as risk.

Manual permanent-test audit is a separate explicitly approved route and never follows normal completion automatically.

## Completion

For a plan, check tasks and criteria only from successful direct-check records, add each task's completion record, write a nonempty final Completion Summary, add `Completed At`, and set `DONE`. Keep the completed plan at its active path. Use `CLOSED` without `Completed At` or Completion Summary only for an explicitly stopped plan.

For direct work, retain the lean Handoffs in authored-task order. Return the settled outcome, changed targets/effects, checks, blockers/risks, papercut and learning results, and next receiver to the route owner. Do not create another result envelope, stage/commit, ship, deploy, or reopen completion.