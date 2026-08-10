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
- A harness projection is synchronized after each authoritative mutation. When one synchronized snapshot satisfies the complete base lifecycle—including every task and verification criterion, `Status: DONE`, and a nonempty final Completion Summary—the same identity-locked operation atomically archives only that projection. This storage transition requires no separate approval and never changes the harness artifact.
- An incomplete or malformed lifecycle remains at the active projection path. Session-end events, approval text, and task completion alone do not trigger archival.
- A direct repository authority is not handled by the local synchronization adapter. Its terminal archival remains an explicit repository-authority action after the complete lifecycle is present.
- A harness or session-local artifact remains authoritative while it exists. Agents edit that artifact rather than its repository projection; an adapter performs repository materialization, synchronization, and projection-only archival.

## Activation checks

Expected matches:

- Materializing a harness- or session-local plan into `.agents/plans/`.
- Checking identity, active/archive ambiguity, or byte-exact synchronization for a repository plan projection.
- Automatically archiving a completed harness projection without moving its authority.

Near misses:

- Revising a harness- or session-local plan's lifecycle or body content.
- Comparing subscription plans or explaining a database query plan.
- Reading or summarizing an archived plan without changing its storage or lifecycle.

## Authority precedence and projection safety

Storage resolves one exact plan identity from its immutable `<Datetime>_<slug>` pair and the two exact paths only. It never infers authority from a slug, newest timestamp, directory scan, or a projection's presence. If both active and archive paths exist, the state is `ambiguous` and mutation fails closed without changing either path.

For a harness/session-local authority, the local artifact always has precedence and its sole active-or-archived repository file is only a byte-exact projection. A missing or unreadable local artifact never promotes projection bytes to authority. A direct repository plan is allowed only when no same-identity harness/session-local authority exists and its URI is the exact active-or-archived path; a later same-identity local artifact creates an authority conflict requiring human resolution rather than automatic precedence.

Exact identity, regular-file and no-symlink rules, complete UTF-8 bytes, identity-locked mutation, target reread, and final source reread remain prerequisites for an acknowledged synchronization or archival result. A changed source or missing acknowledgement leaves the local authority current and the projection unreconciled until exact current state is classified.

These storage effects are not approval, execution authority, plan effects, or instance effects. These rules add no legacy alias, central identity ledger, fallback, semantic retry, force-write, or alternate authority.
