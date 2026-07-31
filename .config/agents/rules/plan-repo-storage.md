---
description: Use when storing, renaming, completing, or archiving a repository-backed execution plan under .agents/plans.
---

# Repository plan storage

Apply the base `plan.md` execution-plan contract first. This companion owns repository identity, materialization, location, and archival under `.agents/plans/`; it does not own plan lifecycle or content metadata.

## Identity and active storage

- A materialized plan has the sole identity `<Datetime>_<slug>`, where `Datetime` is the immutable header value and `slug` is the canonical plan slug.
- Its active path is `.agents/plans/<Datetime>_<slug>.md`; its archive path is `.agents/plans/archive/<Datetime>_<slug>.md`.
- Direct repository plans and adapter-created projections are byte-exact records of their authoritative plan content. Adapters never rewrite metadata.
- Writers inspect only those exact active and archive paths. They never select a target by slug plus newest mtime, directory scans, or another inferred identity.
- Reserve `.agents/plans/` and `.agents/plans/archive/` for deliberate plan files. Do not place scratch notes, temporary artifacts, or unrelated Markdown there.

## Synchronization and archival

- Every writer serializes the complete active/archive decision and mutation per plan identity.
- If both exact paths exist, fail closed without changing either. If only the archived path exists, later authoritative overrides update that archived file in place and never recreate an active duplicate.
- Explicit archival is permitted only after the base contract is complete, including `Status: DONE`; it atomically moves the active identity into `archive/`. Do not infer archival from completion metadata or session lifecycle events.
- A harness or session-local artifact remains authoritative while it exists. Agents edit that artifact rather than its repository projection; an adapter performs repository materialization and later synchronization.

## Activation checks

Expected matches:

- Materializing a harness- or session-local plan into `.agents/plans/`.
- Checking identity, active/archive ambiguity, or byte-exact synchronization for a repository plan projection.
- Explicitly archiving a completed repository plan identity.

Near misses:

- Revising a harness- or session-local plan's lifecycle or body content.
- Comparing subscription plans or explaining a database query plan.
- Reading or summarizing an archived plan without changing its storage or lifecycle.
