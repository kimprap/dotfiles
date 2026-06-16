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

## Required Structure
Every plan file **must** contain (in addition to any findings, context, or background):

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

When performing any creation, edit, or deletion involving paths under `.agents/plans/` (or legacy `plans/`), these conventions must be followed. A standard plan layout (including the required Tasks section and recommended Verification / Done criteria) should be used for new plans.
