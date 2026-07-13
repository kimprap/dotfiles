---
description: Use whenever creating, revising, executing, or completing a durable execution plan, including repository plans and harness-managed plan artifacts.
---

# Execution plan contract

Apply this contract to any durable execution plan, regardless of where or how it is stored. This includes repository files, harness- or session-local artifacts, and handoffs intended for later execution.

Skip this contract for informal suggestions, conversational checklists, subscription or pricing plans, database query plans, and read-only summaries of archived plans.

## Transport precedence

- A harness-mandated path or filename overrides only storage and naming conventions. The metadata, task, verification, and status lifecycle below still applies.
- Do not copy a harness- or session-local plan into a repository unless the user explicitly requests materialization there.
- Keep repository location, filename, and archive mechanics in a repository storage companion rather than this portable contract.

## Required content

### Header metadata

Place these fields immediately after the H1 and before the first `##` section:

```markdown
**Datetime**: <YYYY-MM-DD-HHMM>
**Scope**: <bounded area of work>
**Summary**: <one or two sentences describing the intended outcome>
**Status**: PENDING
```

- Start every new plan at `PENDING`.
- Approval alone does not change status.
- Change status to `IN_PROGRESS` when execution of `T1` begins.
- Use `CLOSED` only when the user explicitly cancels the plan.

### Tasks and execution order

- Include a `## Tasks` checklist as the canonical execution order.
- Give every task a stable monotonic code: `T1`, `T2`, and so on.
- Create tasks as unchecked Markdown checkboxes: `- [ ] T1. Task description`.
- Keep task codes and historical outcomes stable. When a task completes, check it and add an indented `completed <YYYY-MM-DD-HHMM>` line immediately below it.
- When detailed execution sections are present, map them one-to-one to the task codes and preserve the same order.

### Verification and completion

- Include `## Verification / Done criteria` with objective checks or observable behavior.
- Leave each criterion unchecked until it has actually been observed.
- Do not complete the final task until every required verification criterion passes.
- Set `Status: DONE` only after every task is checked with a completion timestamp and a concise `## Completion Summary` has been appended at the end.
- In the Completion Summary, record material findings, decisions, delivered behavior, residual risks, and later user overrides. Append later overrides instead of rewriting historical task outcomes.

## Proportionality and decision completeness

Plans are execution contracts, not transcripts. Include only the context, anchors, sequencing, decisions, and verification a fresh executor needs. Scale detail with risk and scope, prefer concise references over copied source, and leave no material implementation choice for the executor to invent.

Use an implementation-plan companion when a later executor needs implementation-grade detail. Keep specialized body requirements outside this base.

## Activation checks

Expected matches:

- Creating a durable repository execution plan.
- Revising a harness- or session-local plan artifact.
- Executing tasks or completing the lifecycle of an existing plan.

Near misses:

- Comparing subscription or pricing plans.
- Explaining a database query plan.
- Giving informal conversational bullets with no durable artifact.
- Reading or summarizing an archived plan without revising or executing it.
