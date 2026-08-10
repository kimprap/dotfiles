---
description: Use whenever creating, revising, executing, or completing a durable execution plan, including repository plans and harness-managed plan artifacts.
---

# Execution plan contract

Apply this contract to any durable execution plan, regardless of where or how it is stored. This includes repository files, harness- or session-local artifacts, and handoffs intended for later execution.

Skip this contract for informal suggestions, conversational checklists, subscription or pricing plans, database query plans, and read-only summaries of archived plans.

## Transport precedence

- A harness-assigned artifact path or filename overrides only storage and naming conventions. The metadata, task, verification, and status lifecycle below still applies.
- Harness copies and forks preserve the complete header metadata block. Execution and later overrides update that authoritative harness artifact; its repository projection never becomes authority.
- Keep repository identity, location, byte-exact projection, and archive mechanics in a repository storage companion rather than this portable contract.

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
- `Datetime` is immutable plan-identity metadata after creation, including in harness copies and forks.
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
- In the Completion Summary, record material findings, decisions, delivered behavior, residual risks, and later user overrides. Append later overrides without changing identity or rewriting historical task outcomes.

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

## Native execution authority and transport separation

At every new or resumed approved start, native harness review binds the exact authoritative identity and URI, the complete authoritative bytes and SHA-256 revision, the current lifecycle status, and the human's explicit approval of that exact presentation. Only an exact match permits execution. Missing approval, another identity or revision, changed bytes, and `DONE` or `CLOSED` status stop before plan-authorized work; a later resumed start requires a fresh review of the then-current bytes.

A plan records authority but cannot approve itself, and a projection or synchronization receipt never supplies approval. A new or revised executable plan must not contain the obsolete `## Execution gate` section. Historical immutable plans remain untouched; an active old-contract plan must be explicitly revised under its own authority, with no compatibility alias.

Native approval grants only plan-execution authority. Repository, shared-configuration, delivery, profile, vault, instance, source-observation, shipping, and other effects still require their own exact authority.

Portable structural validation remains separate from transport. Executor Plans use the shared `executor_plan.py` validator before publication and backend mutation; ordinary durable plans use their applicable lifecycle and stage contracts. Storage adapters do not add another semantic parser or gate.

An adapter may observe native approval metadata only when the harness exposes it through a documented runtime API. It must not infer approval from prompt prose, current-byte hashing, a projection, or a synchronization result. When approval metadata is not exposed, native OMP itself owns the stop; an adapter does not manufacture approval or denial.

Synchronization and archival are storage effects only. They do not approve a plan, clear blockers, authorize execution, or replace current-authority checks.
