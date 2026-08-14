---
description: Apply when materializing, synchronizing, renaming, or archiving an execution plan under .agents/plans.
---

# Repository plan storage

Apply `plan.md` first. This companion owns repository identity, location, byte-exact materialization, synchronization, and archival under `.agents/plans/`; it does not own plan content, lifecycle, or approval.

## Identity and paths

- A materialized plan's sole identity is `<Datetime>_<slug>`, using its immutable header datetime and canonical slug.
- Active path: `.agents/plans/<Datetime>_<slug>.md`.
- Archive path: `.agents/plans/archive/<Datetime>_<slug>.md`.
- Inspect only those exact paths. Never choose by slug, newest mtime, directory scan, history, equality, or projection presence.
- Both paths existing is `ambiguous`; fail without changing either. Reserve both directories for deliberate plan files, not notes or temporary artifacts.
- Direct plans and adapter projections preserve the authority's complete bytes; adapters never rewrite metadata.

## Authority resolution

- A harness/session authority and its sole projection both declare `local-authority`. Edit the local authority, never its projection, while it exists.
- A repository plan is direct authority only when its exact active-or-archive bytes declare `direct-repository`, the other repository path is absent, and the exact same-identity local counterpart is safely observed absent.
- Missing or unreadable local bytes do not promote a projection. A later same-identity local artifact conflicts with direct authority and requires human resolution.
- Unmarked bytes are `unclassified`; malformed, wrong-identity, unreadable, unsafe, or ambiguous state is invalid. Fail closed on both. Marker migration is a separate, human-approved per-identity effect, never a bulk or resumption side effect.

## Synchronization and archival

- The local synchronization helper accepts only valid `local-authority` source bytes and freshly classifies the exact target while holding the identity generation.
- It may publish to absence, replace an active same-identity local projection, update an archived local projection in place, or archive a terminal active local projection. It never overwrites direct, unclassified, invalid, unsafe, or ambiguous state. Byte equality bypasses nothing.
- Synchronize after every authoritative local mutation. Keep incomplete projections active. Atomically archive only the projection when one synchronized snapshot has every task and verification criterion complete, `Status: DONE`, and a nonempty final Completion Summary. Never move or archive the local authority.
- If only a valid archived local projection exists, later local overrides update it in place; never recreate an active duplicate.
- Direct repository authority is outside the local sync adapter. Archive it only through an explicit repository-authority action after the same complete lifecycle, preserving every byte.
- Approval text, session end, or task completion alone never triggers archival. Synchronization and archival grant no approval, execution authority, or plan effect.

## Shared generation protocol

Use the existing repository helper only for `local-authority` projections. A `direct-repository` writer must implement the same protocol below; it must not call the local projection helper or fall back to an ordinary write or rename. Every writer that creates, replaces, or archives a plan must honor this protocol or stop without mutation:

1. Canonicalize repository root and plan identity; key the generation by `sha256(<canonical-root> + NUL + <plan-id>)` at `${TMPDIR}/omp-plan-artifact-locks/<digest>.lock`.
2. Claim the lock directory and `owner.json` without overwrite using one `pid`, ISO `createdAt`, and unguessable token. Only that generation may observe or mutate the identity; hold it through observation, staging, transition, and postcondition, then remove only the still-owned generation.
3. Require safe regular-file/no-symlink paths. Snapshot complete source and descriptor-bound targets; stage and fsync complete bytes in the destination directory; recheck source, target kind/identity/bytes/classification, and generation immediately before publication.
4. Publish to absence and create archives with no-overwrite hard links. Replace only an observed same-identity local projection while the generation remains owned. Archive by linking the exact published generation, rechecking the active inode, then unlinking only that inode.
5. On contention, drift, raced destination, unsafe state, or unverifiable ownership, preserve every observed object and fail. Report `effect=none` before publication or `effect=possible-complete` after a possibly completed publication; never retry, roll back, force-write, adopt, promote, or infer success from equality.

Success also requires final source/target rereads and the helper's exact acknowledgement. Diagnostics expose stable class, identity, repository-relative state, and effect only—never plan content or durable telemetry. Do not add aliases, sidecars, alternate authority, role arguments, migration, or promotion mechanisms.

## Activation checks

Use this rule when materializing or synchronizing a repository projection, resolving active/archive ambiguity, or archiving a completed repository-backed plan. Skip plan-body/lifecycle edits, unrelated meanings of “plan,” and read-only archive review.
