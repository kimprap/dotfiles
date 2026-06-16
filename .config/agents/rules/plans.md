---
description: Generic conventions for plan files under .agents/plans/. Triggers on creation, update, or completion (CRUD) of any plan file.
condition: ".agents/plans/|plans/|plans\\\\b"
scope:
  - "tool:bash"
  - "tool:write"
  - "tool:edit"
  - "tool:delete"
interruptMode: "tool-only"
---

# Plan File Conventions

This is a generic rule for **any** plan file created, updated, or completed under the `.agents/plans/` directory. It applies regardless of how the plan was generated.

## Naming
All plan files **must** use the format:

`YYYY-MM-DD-HHMM_<slug>.md`

- The datetime prefix **must** be generated with `date +%Y-%m-%d-%H%M`.
- `<slug>` is a short, descriptive identifier for the plan's purpose (e.g. `security-audit`, `auth-refactor`, `comments-cleanup`).
- Example: `2026-06-14-1505_security-audit.md`

Avoid generic names like `plan.md` or undated files.

## Header Metadata

Plans include a metadata block immediately after the H1 title and before the first `##` section. Use this format with bold keys:

```
**Datetime**: 2026-06-14-1505
**Scope**: <bounded area of the work>
**Summary**: <one or two sentences on the plan's intent>
**Status**: PENDING
```

- Generate Datetime with `date +%Y-%m-%d-%H%M`. It should match the filename prefix.
- Start every new plan with `Status: PENDING`.
- Update Status as the work moves forward:
  - Switch to `IN_PROGRESS` once you begin the first task.
  - Switch to `DONE` after the last task is checked (with its `completed <timestamp>` line) and you append the Completion Summary.
  - Use `CLOSED` only when the user explicitly asks to close the plan without completing the tasks.
- Include the header in all plans so agents and harnesses can see the basics at a glance. Older plans without the block are legacy.

## Proportionality
Plan detail must scale with risk and scope. Required sections stay required, but supporting context should be the minimum a fresh executor needs. Prefer file:line references and short excerpts over copying large blocks. Include full command scripts, long excerpts, category-by-category audits, or extended rationale only when they materially reduce execution risk.

## Required Structure
A plan file contains the header metadata block above plus (in addition to any findings, context, or background):

## Tasks
**This is the todo checklist for the plan.** Group related items that can reasonably be executed together in focused batches (best estimate under ~100k agent tokens per batch). Order the groups and items within them by priority (highest first).

Alternate names considered (for making the "todo checklist" nature more explicit): `## Task Checklist`, `## Execution Tasks`, `## Todo Checklist`, `## Action Items`, `## Work Items`. Standardized on the short `## Tasks` (the prose + batching guidance preserve the original "combined/grouped execution" intent). The prior heading `## Combined Tasks` is now legacy.

- Tasks **must** always be created as unchecked markdown checkboxes:
  `- [ ] Task description here`
- When marking a task complete, change it to checked and immediately add the completion timestamp on the following line indented under the task:
  ```
  - [x] Task description here
    completed 2026-06-14-1505
  ```
- This section is the primary driver for execution planning. Keep batches focused and self-contained. Note any dependencies or rough token estimates where helpful.

It is recommended (for robustness, especially on non-trivial/generic plans) to also include a dedicated section immediately after Tasks:

## Verification / Done criteria
Objective, preferably machine-checkable criteria (commands + expected results, or clear observable behaviors) that must hold for the plan to be considered complete. This is distinct from the execution steps and batching in the Tasks section.

Use a checkbox list or assertion list. All criteria should pass before marking the final task in Tasks complete.

Example (recommended shape):

```
## Verification / Done criteria

- [ ] `stylua --check .config/nvim` exits 0
- [ ] `git status --porcelain` reports only in-scope paths
- The new behavior X is present and old misbehavior Y is gone (spot check or test)
```

When the **last task** in the Tasks section is marked as complete:
- Append a short **Completion Summary** section at the very end of the plan file (after all other content).
- The summary must be concise and cover: key findings, triage decisions made, what was delivered, any residual risks, and overall outcome.
- Do not delete, overwrite, or alter prior sections of the plan.

Once a plan is fully completed (every task shows as checked with its completion timestamp + the Completion Summary has been added):
- Move the plan file into `.agents/plans/archive/` using the `mv` command **only**.
- Never use copy + delete, `rm`, or any other pattern that risks data loss.
- Example: `mv .agents/plans/2026-06-14-1505_security-audit.md .agents/plans/archive/`
- Create the `.agents/plans/archive/` directory if it does not already exist.

## Location and Hygiene
- All active plans must reside directly in `.agents/plans/` at the root of the current working directory.
- Do not create plans in other locations (root `plans/`, subdirectories outside `.agents/plans/`, docs/, etc.).
- Completed plans belong exclusively in `.agents/plans/archive/` (via `mv` as described above).
- The `.agents/plans/` directory (and its archive subfolder) is reserved strictly for deliberate plan documents. It must not be used for scratch notes, temporary files, or unrelated artifacts.

When performing any creation, edit, or deletion involving paths under `.agents/plans/` (or legacy `plans/`), follow these conventions. Use a consistent plan layout that includes the header metadata block (with Status), the Tasks todo checklist, and the recommended Verification / Done criteria for new plans.
