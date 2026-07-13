---
description: Use when storing, renaming, completing, or archiving a repository-backed execution plan under .agents/plans.
---

# Repository plan storage

Apply the base `plan.md` execution-plan contract first. This companion governs only repository location, naming, and archival for deliberate plans under `.agents/plans/`.

## Active plan storage

- Store active plans directly under `.agents/plans/` at the repository root.
- Name each active plan `YYYY-MM-DD-HHMM_<slug>.md`, using a short descriptive slug.
- Require the plan's `Datetime` metadata to match the filename's `YYYY-MM-DD-HHMM` prefix.
- Reserve `.agents/plans/` and `.agents/plans/archive/` for deliberate plan files. Do not place scratch notes, temporary artifacts, or unrelated Markdown there.

## Completion and archival

- Keep an active plan directly under `.agents/plans/` until it satisfies the base contract's completion requirements.
- Move a completed plan to `.agents/plans/archive/` with one atomic filesystem move or rename operation. Never use copy-plus-delete.
- Preserve the active-versus-completed location distinction and the plan's historical contents; archival changes location, not recorded outcomes.
- Harness- or session-local plan artifacts do not use these repository naming or archive mechanics unless the user explicitly requests materialization into the repository.

## Activation checks

Expected matches:

- Creating or renaming a repository-backed plan under `.agents/plans/`.
- Checking that repository plan metadata matches its filename.
- Archiving a repository plan after its execution lifecycle completes.

Near misses:

- Creating or revising a harness- or session-local plan that will not be materialized in the repository.
- Comparing subscription plans or explaining a database query plan.
- Reading or summarizing an archived plan without changing its storage or lifecycle.
