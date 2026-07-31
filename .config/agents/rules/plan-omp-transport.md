---
description: Use for materialized OMP execution plans to keep the session-local artifact authoritative while using the plan-artifact transport and explicit archive action.
---

# OMP plan artifact transport

Apply `plan.md` for plan content and lifecycle, then `plan-repo-storage.md` for its repository projection. This rule owns only OMP transport and tool selection.

| Phase | Authoritative target | Agent mechanism |
|---|---|---|
| Draft/create | `local://<slug>-plan.md`, with canonical lowercase kebab-case slug | `write` |
| Read/resume approved work | same `local://` artifact | `read` before execution |
| Track execution | plan `## Tasks` codes | `todo`, with each completed item followed by the corresponding plan `edit` |
| Incremental revision and completion record | same `local://` artifact | `edit`; verification itself uses only the plan’s named task-specific tools |
| Review/approval | approved local slug | `write` to `xd://propose` |
| Repository materialization, approved-copy reconciliation, and later sync | `.agents/plans/<Datetime>_<slug>.md` or its archived location | automatic `plan-artifact-sync`; never edit the projection directly while the local authority exists |
| Completion archival | current completed local artifact | `archive_plan_artifact({slug})` after tasks, verification criteria, `Status: DONE`, and Completion Summary are present |

## Activation checks

Expected matches:

- Creating, revising, approving, or executing a materialized OMP plan at `local://<slug>-plan.md`.
- Completing an OMP plan whose repository projection is managed by `plan-artifact-sync`.

Near misses:

- A repository-native `.agents/plans/*.md` plan without a session-local OMP authority.
- Non-plan Markdown, including handoffs, notes, and source summaries.
