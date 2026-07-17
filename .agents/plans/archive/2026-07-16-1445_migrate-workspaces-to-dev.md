# Migrate Desktop/ng3 workspaces to ~/dev (session-preserving)

**Datetime**: 2026-07-16-1445
**Scope**: Local filesystem and workstation state for moving `kaira`, `atlas`, and `company` from `~/Desktop/ng3` to `~/dev`; preserve dirty work, OMP/Grok sessions and memory, herdr layouts, and the Obsidian Atlas vault binding. No product or bot behavior changes.
**Summary**: Perform a same-volume, rollback-aware cutover to `~/dev/{kaira,atlas,company}`. All mutable harness state is checkpointed and backed up after a global application quiesce, remapped offline with exact path mappings, then reopened only for controlled memory-identity discovery and end-to-end verification.
**Status**: DONE

## Canonical-source contract

This file is the sole execution contract and ledger for this migration. Execute `T1` through `T10` exactly in order; do not run a later task early, use a secondary checklist, or let a generated script broaden or reorder the work.

T1 creates a temporary offline runner solely to execute the operations specified here while OMP and Grok are stopped. The runner is subordinate to this plan: record its path and SHA-256 in this file before T3, require phase-specific dry runs, and stop if its behavior differs from this plan. If the plan or runner must change after T3, do not improvise: stop before further writes, reverse any incomplete workspace move when safe, reopen the plan, revise T1, and restart at T2.

T3 through T8 run from a plain Terminal.app shell, not from OMP, Grok, herdr, or a Ghostty pane. The runner writes timestamped JSONL events and verification output under its private run directory. After OMP is reopened in T9, copy those observed completion timestamps into the task checklist before closing T10.

Post-T6 amendment: if the verified `offline-cutover` marker is complete, the runner hash is unchanged, no T7 controlled launch has occurred, and a runner/plan conflict is limited to whether empty Grok and OMP discovery shells are created before one guarded memory migration, a user-approved plan-only amendment may retain the verified T4–T6 state instead of rolling it back. Record the approval and revised T7 order in this file, reverify the offline marker and backup manifest, and continue only with the unchanged runner.

Post-T7 amendment approved by the user at `2026-07-17-1639`: the first T8 execute attempt stopped during read-only pre-mutation verification because Grok's controlled T7 launches reconciled its generated global picker index. No T8 mutation occurred: the original Kaira `.venv` remains in place, no relocated-venv backup or rebuild marker exists, and the execution log ends at the database hard stop. Retain the verified T4–T7 state instead of performing the higher-risk rollback required by the original generic runner-change rule. Revise only the runner's Grok picker-index verification and its exact hash-lineage checks, ledger the new hash before another runner invocation, and preserve all pre-amendment baselines and markers unchanged under runner SHA-256 `0dc3d33c9f1ac909f984170089b71fa57455c6ed56cbdcdc89f787d8b5f69747`. The revised runner may accept that one exact predecessor hash for existing artifacts while requiring its current hash in this plan for new invocations and markers.

## Execution intent

The migration is complete only when:

- the three source trees have become the target trees by same-volume rename, with root device/inode identity and Kaira dirty work preserved;
- every live discovery key uses the exact new cwd while historical `ig-bot`, archived plans, transcripts, logs, and frozen Atlas campaign evidence remain historical;
- Grok and OMP session IDs remain resumable from the new cwd;
- Grok memory and Mnemopi use their newly derived path identities without data loss, split stores, stale generated indexes, or old internal bank IDs;
- herdr, Obsidian, `vault://atlas`, Kaira's Python environment, and live workspace contracts resolve under `~/dev`;
- the backup and execution log remain available for rollback; and
- every verification criterion passes before this plan is marked `DONE` and atomically archived.

## Context

macOS TCC Desktop Folder denials break long-lived herdr/Ghostty shells under `~/Desktop/...`. Current trees and review-time sizes are:

| Source | Destination | Approx. size | Git/state | Harness surface |
|---|---|---:|---|---|
| `~/Desktop/ng3/kaira` | `~/dev/kaira` | 171M | Git `main`; dirty work must be preserved | Grok sessions/memory; OMP sessions/Mnemopi; herdr `kaira`; path-bound `.venv` |
| `~/Desktop/ng3/atlas` | `~/dev/atlas` | 259M | `app` is Git; `vault` is personal research state | Grok and OMP for `app`/`vault`; herdr `atlas`/`atlas-vault`; Obsidian `atlas` vault |
| `~/Desktop/ng3/company` | `~/dev/company` | 8K | no Git repo | no material harness state observed |
| `~/.dotfiles` | unchanged | — | canonical dotfiles repo | this plan and herdr session state; never move |

Leave `~/.kaira` browser profiles unchanged. Preserve historical `ig-bot` session keys and database rows under their old Desktop cwd; that tree is absent from current `ng3` and is not part of this move.

### Why exact remapping is required

| System | Identity/discovery key | State location | Required treatment |
|---|---|---|---|
| Mnemopi | cwd basename plus stable hash of absolute cwd; DB rows also carry bank IDs/cwd metadata | workspace-local `banks/<bank>/mnemopi.db` | discover new bank, move whole old bank, rewrite exact internal identity columns and cwd metadata offline |
| Grok sessions | URL-encoded absolute cwd | `~/.grok/sessions/<encoded-cwd>/` | rename target groups; update only documented structural metadata |
| Grok search | `session_docs.cwd` | `~/.grok/sessions/session_search.sqlite` | exact transactional cwd map; preserve `ig-bot` rows |
| Grok memory | `origin` identity, otherwise absolute-path hash | `~/.grok/memory/<slug>-<hash8>/` | no origins currently observed, so discover new slugs; move Markdown/session sources and rebuild generated index |
| Grok trust | exact absolute path | `~/.grok/trusted_folders.toml` | preserve the existing Kaira trust decision under its new path; add no new trust grants |
| Grok active registry | active session cwd/PID | `~/.grok/active_sessions.json` | after global quit, remove only stale entries for migrated old cwds |
| OMP sessions | home-relative cwd encoded with `/` as `-` | `~/.omp/agent/sessions/-Desktop-ng3-*` | rename groups and rewrite only `type=session` header cwd |
| OMP history | exact cwd | `~/.omp/agent/history.db` | exact transactional cwd map; preserve `ig-bot` rows |
| OMP terminal continuation | two-line cwd + session path breadcrumb | `~/.omp/agent/terminal-sessions/` | delete affected breadcrumbs after backup; TTY names are ephemeral |
| herdr | workspace `identity_cwd` and pane `cwd` | `~/.dotfiles/.config/herdr/session.json` | field-aware atomic JSON update while server is stopped |
| Obsidian/OMP vault | exact registered vault path | `~/Library/Application Support/obsidian/obsidian.json` | preserve vault ID and map the nested Atlas instance path |
| Kaira Python | activation values, executable shebangs, cached code filenames | `kaira/.venv`, `__pycache__`, `.ruff_cache` | recreate from `uv.lock`; rebuild disposable caches |

### Target layout

```text
~/dev/kaira
~/dev/atlas/app
~/dev/atlas/vault
~/dev/atlas/vault/instances/atlas
~/dev/company
~/.dotfiles
```

Drop the `ng3` parent. A verified same-volume rename preserves filesystem objects and dirty files; it does not make path-bound virtualenv scripts or cwd-derived memory identities portable.

### Exact path map

| Old | New |
|---|---|
| `/Users/kim/Desktop/ng3/kaira` | `/Users/kim/dev/kaira` |
| `/Users/kim/Desktop/ng3/atlas` | `/Users/kim/dev/atlas` |
| `/Users/kim/Desktop/ng3/atlas/app` | `/Users/kim/dev/atlas/app` |
| `/Users/kim/Desktop/ng3/atlas/vault` | `/Users/kim/dev/atlas/vault` |
| `/Users/kim/Desktop/ng3/atlas/vault/instances/atlas` | `/Users/kim/dev/atlas/vault/instances/atlas` |
| `/Users/kim/Desktop/ng3/company` | `/Users/kim/dev/company` |

Database cwd updates use only these live leaf cwds:

- `/Users/kim/Desktop/ng3/kaira` → `/Users/kim/dev/kaira`
- `/Users/kim/Desktop/ng3/atlas/app` → `/Users/kim/dev/atlas/app`
- `/Users/kim/Desktop/ng3/atlas/vault` → `/Users/kim/dev/atlas/vault`
- `/Users/kim/Desktop/ng3/company` → `/Users/kim/dev/company` only if an exact row is observed at T2

Never use a broad `LIKE '/Users/kim/Desktop/ng3/%'` update; it would incorrectly remap historical `ig-bot` rows.

### Known review-time identities

Treat these as anchors to verify at T2, not immutable counts:

- Grok memory: `kaira-a42bc3b4`, `app-230b9161`, `vault-28345770`
- Mnemopi: `kaira-3fp0k0qoqg7wk`, `app-3mfad1k3bh97x`, `vault-k9lbn7180ezo`
- Kaira Mnemopi review state: 33 working rows tagged with the old Kaira cwd and old bank ID
- Atlas app Mnemopi review state: 29 working rows tagged with the old app cwd and old bank ID
- Atlas vault Mnemopi bank: structurally empty at review time
- Grok review-time directory counts: Kaira 11, Atlas app 163, Atlas vault 1
- Grok review-time `session_docs` counts: Kaira 11, Atlas app 36, Atlas vault 1
- OMP review-time session files: Kaira 17, Atlas app 16, Atlas vault group empty
- OMP terminal breadcrumbs with migrated old paths: 11

All authoritative counts and ID sets are recaptured after quiescence in T4.

## Tasks

- [x] T1. Activate the canonical plan and prepare the offline runner
- [x] T2. Capture the read-only baseline and prove preconditions
- [x] T3. Globally quiesce applications and hand off to a plain shell
- [x] T4. Checkpoint and back up every mutable migration surface
- [x] T5. Move all workspace trees with rollback protection
- [x] T6. Remap sessions, databases, herdr, trust, and Obsidian offline
- [x] T7. Discover and migrate Grok and Mnemopi path identities
- [x] T8. Rebuild path-sensitive state and update live path contracts
- [x] T9. Reopen applications and verify the migration end to end
- [x] T10. Classify residuals, close the ledger, and archive atomically

## Critical anchors

| Anchor | Role |
|---|---|
| This file | sole execution order, decision source, and completion ledger |
| `~/Desktop/ng3/{kaira,atlas,company}` | source trees |
| `~/dev/{kaira,atlas,company}` | destination trees |
| `~/.grok/sessions/` | path-keyed Grok session groups |
| `~/.grok/sessions/session_search.sqlite` | `session_docs.cwd` and picker search index |
| `~/.grok/memory/` | Grok Markdown/session memory sources plus generated indexes |
| `~/.grok/trusted_folders.toml` | existing Kaira trust decision |
| `~/.grok/active_sessions.json` | active/stale Grok cwd/PID registry |
| `~/.grok/worktrees.db` | guard-only audit for path-pinned worktrees; no matching rows observed during review |
| `~/.omp/agent/sessions/` | OMP cwd-scoped sessions and artifact directories |
| `~/.omp/agent/history.db` | global prompt history cwd |
| `~/.omp/agent/terminal-sessions/` | terminal continuation breadcrumbs |
| `~/.omp/agent/config.yml` | active `mnemopi.scoping: per-project-tagged` configuration |
| `~/dev/*/banks/<bank>/mnemopi.db` | path-derived Mnemopi project banks after the move |
| `~/.dotfiles/.config/herdr/session.json` | herdr workspace/pane layout state |
| `~/Library/Application Support/obsidian/obsidian.json` | registered Atlas vault ID/path |
| `~/dev/atlas/vault/instances/atlas` | actual Obsidian and `vault://atlas` instance root |
| `~/.grok/docs/user-guide/13-memory.md` | Grok memory identity, Markdown source-of-truth, and watcher behavior |
| `omp://mnemosyne-memory-backend.md` | Mnemopi absolute-path bank derivation |
| `omp://session.md` and `omp://session-switching-and-recent-listing.md` | OMP session group/header and terminal breadcrumb behavior |

## Ordered implementation

### T1. Activate the canonical plan and prepare the offline runner

1. Confirm this file is at `.agents/plans/2026-07-16-1445_migrate-workspaces-to-dev.md`, its filename timestamp matches `Datetime`, and `Status` is `PENDING`.
2. Change `Status` to `IN_PROGRESS`. Do not create or synchronize a second plan copy.
3. Create a private run directory before any backup or mutation:

   ```text
   RUN_ROOT=~/.local/share/workspace-migrate-<YYYYMMDD-HHMMSS>
   mode: 0700
   contents: runner/, baseline/, backup/, logs/, markers/
   ```

   Set `umask 077` for every command that writes under it.
4. Create `RUN_ROOT/runner/migrate.py`. It must use only the exact path map and operations in this plan and expose these phases:
   - `preflight --dry-run` — T2, read-only;
   - `offline-cutover --dry-run|--execute` — T4 through T6, with internal phase markers and rollback before state remaps;
   - `migrate-memory --dry-run|--execute` — T7, after controlled identity discovery;
   - `rebuild --dry-run|--execute` — T8.
5. Runner requirements:
   - refuse mutation unless source/destination state matches the current phase;
   - refuse mutation while any OMP, Grok, herdr server, Ghostty, or Obsidian process is live;
   - use atomic temp-write + `fsync` + rename for JSON/text metadata;
   - use parameterized SQLite transactions and exact equality predicates;
   - log every planned/applied operation, before/after count, path rename, checksum, rollback action, and phase timestamp to `RUN_ROOT/logs/execution.jsonl`;
   - never launch an application, invent a memory hash, merge non-empty memory stores, rewrite transcript bodies, delete backups, stage Git files, or commit/push;
   - create a phase marker only after that phase's checks pass;
   - be restart-safe: completed markers make repeated execution verify/no-op; ambiguous partial state is a hard stop.
6. Run `python3 -m py_compile` and `preflight --dry-run`. Review its complete action list against this plan.
7. Record `RUN_ROOT`, the runner SHA-256, and the dry-run timestamp in an indented execution note under T1. Any later runner edit invalidates that hash and returns execution to T1.

   - completed 2026-07-17-1130
   - `RUN_ROOT=/Users/kim/.local/share/workspace-migrate-20260717-110858`
   - runner SHA-256: `0dc3d33c9f1ac909f984170089b71fa57455c6ed56cbdcdc89f787d8b5f69747`
   - successful T1 preflight dry run: `2026-07-17T04:30:23Z`
   - review note: exact source/destination maps, guarded rename/rollback, backup coverage, structural-only rewrites, exact-equality database updates, T7 discovery-only identity migration, rebuild scope, quiescence gates, and restart markers match this plan. An initial dry run hard-stopped because `~/dev` was absent; while still in T1, the runner was revised to probe the home volume without creating `~/dev`, recompiled, rehashed, and rerun successfully.
   - approved T8 amendment runner SHA-256: `63695a87c7802cae7b6bb14960b59632069275bcc2201646101917485a064739` at `2026-07-17-1639`; this revision accepts only the exact predecessor hash above for existing T1–T7 artifacts and applies the exact generated-index reconciliation recorded under T8.

### T2. Capture the read-only baseline and prove preconditions

Run while applications may still be open; make no backups and no mutations except creating `~/dev` and writing baseline files under `RUN_ROOT`.
Live SQLite reads are provisional: use read-only access, falling back to `mode=ro&immutable=1` when a live writer prevents a normal read. Never write or checkpoint in T2; T4's post-quiesce snapshot is authoritative.

1. Confirm the three sources exist and all three destinations are absent. Create `~/dev` if missing.
2. Prove source and destination parent are on the same device. Record `st_dev` and `st_ino` for each source root and `st_dev` for `~/dev`; a device mismatch is a hard stop.
3. Record free disk space and measured sizes for the three workspaces, affected Grok/OMP session groups, Grok memory directories, and Mnemopi banks. Require sufficient space for full workspace and affected-state backups plus working headroom.
4. Capture Kaira and Atlas app repository state without modifying it:
   - branch/HEAD;
   - `git status --porcelain=v2 --branch` as bytes;
   - tracked diff as a binary patch;
   - untracked path list and SHA-256 manifest;
   - linked-worktree, submodule, and absolute-symlink inventory. No linked worktrees, submodules, or old-path symlink targets were observed during review; a new finding is a hard stop for plan revision.
5. Capture session baselines as ID sets and counts, separately:
   - Grok session directories for Kaira, Atlas app, and Atlas vault;
   - Grok `session_docs` IDs/counts grouped by exact cwd;
   - OMP top-level `*.jsonl` IDs/counts for the three old session groups;
   - OMP/Grok historical `ig-bot` row counts and exact cwd values;
   - OMP terminal breadcrumb files containing migrated old paths.
6. Capture memory baselines:
   - SHA-256 and file list for each Grok `MEMORY.md` and `sessions/` tree;
   - old Grok memory slugs and Git `origin` state; no origin is expected for Kaira or Atlas app;
   - Mnemopi table row counts, old bank slug, `working_memory` cwd distribution, identity-column counts, and orphan-embedding count;
   - one stable Kaira and one stable Atlas app durable memory ID/content selected directly from the read-only SQLite baseline; use targeted recall queries for those records only after the move;
   - Atlas vault's expected empty-bank counts.
7. Capture integration state:
   - herdr workspace IDs, labels, `identity_cwd`, and pane `cwd` values;
   - Obsidian vault ID and exact path `/Users/kim/Desktop/ng3/atlas/vault/instances/atlas`;
   - current `vault://atlas/ARCHITECTURE.md` first-line/frontmatter checksum;
   - Grok trusted-folder entry for Kaira;
   - Grok active-session entries for all cwds;
   - exact old-path occurrences in live workspace contracts and active `.agents/plans/*.md` files, excluding archives and the frozen Atlas campaign tree.
8. Run cache-free pre-move behavior baselines and save output/exit status:
   - Kaira tests with `PYTHONDONTWRITEBYTECODE=1 uv run python -m unittest discover -s tests -t . -v`;
   - Kaira lint with `uv run ruff --no-cache check .` and `uv run ruff --no-cache format --check .`;
   - Atlas app with `PYTHONDONTWRITEBYTECODE=1 python3 scripts/atlas-instance.py check`.
   These commands must not change tracked files, memory, or harness state. Pre-existing failures do not authorize fixes during migration; post-move behavior must match or improve solely through path repair.
9. Run `preflight --dry-run` again. It must report no collision, no cross-device move, and no unclassified state surface.

   - completed 2026-07-17-1132
   - baseline: `RUN_ROOT/baseline/preflight-20260717T043146Z.json` (`30742d57cfd4962e3a2ce97912c63b6b44cb894cd05b2e3d82758d173c5d6e3a`)
   - all source roots and target absence passed; source and `~/dev` devices are `16777231`; required backup estimate is `938865571` bytes with `47144271872` bytes free.
   - no linked worktrees, submodules, old-path absolute symlinks, path-pinned Grok worktrees, company DB rows, or unclassified live contracts were found.
   - behavior baseline: Kaira tests passed; Atlas instance check passed; the plan-specified Ruff command lines returned 2 because this installed Ruff requires `ruff check --no-cache` / `ruff format --no-cache`.

### T3. Globally quiesce applications and hand off to a plain shell

No later task may begin inside an agent or Ghostty/herdr pane.

1. Open a plain Terminal.app shell at `$HOME`; print and retain `RUN_ROOT` and the runner SHA-256 there.
2. Exit every OMP and Grok session globally, including sessions under `~/.dotfiles`. Do not limit this to the moved workspaces; their history/index stores are global.
3. Close all herdr clients, quit Ghostty completely, stop the herdr server, and quit Obsidian completely.
4. From Terminal.app, prove:
   - no OMP or Grok process remains;
   - no herdr server/client process remains;
   - no Ghostty or Obsidian process remains;
   - `lsof +D "$HOME/Desktop/ng3"` reports no holder;
   - the shell cwd is outside `~/Desktop/ng3`;
   - the runner SHA-256 still matches the T1 note.
5. If any process or tree holder remains, stop without force-killing it. Close it cleanly and repeat all checks.
6. Do not reopen OMP, Grok, Ghostty, herdr, or Obsidian until the specific controlled launch in T7 or the final reopen in T9.

   - completed 2026-07-17-1605
   - `offline-cutover --dry-run` recorded global quiescence and completed at `2026-07-17T09:05:02Z`.

### T4. Checkpoint and back up every mutable migration surface

Run `offline-cutover --dry-run`, then start `offline-cutover --execute`. The runner performs T4, T5, and T6 sequentially and must stop at each internal phase boundary if verification fails.

1. Recheck all T3 quiescence predicates. Capture a final authoritative baseline; if session IDs/counts changed since T2 due to activity before T3, preserve both records and use the post-quiesce baseline for done criteria.
2. For `~/.omp/agent/history.db` and all three Mnemopi databases:
   - checkpoint WAL with `TRUNCATE`;
   - run `PRAGMA integrity_check`;
   - record table counts;
   - create a consistent SQLite backup via `sqlite3.Connection.backup`.
3. Run integrity checks and SQLite backups for:
   - `~/.grok/sessions/session_search.sqlite`;
   - `~/.grok/worktrees.db` if readable and present, even though no target rows were observed;
   - any other SQLite file the dry-run proves will be modified.
4. Using `/usr/bin/ditto --rsrc --extattr --acl` into fresh destinations under `RUN_ROOT/backup`, create complete private backups of:
   - all three workspace trees, including dirty/untracked files, banks, xattrs, and symlinks;
   - the three affected Grok session groups;
   - the three affected OMP session groups and sibling artifact directories;
   - the three Grok memory project directories;
   - `~/.omp/agent/terminal-sessions/`;
   - `~/.grok/active_sessions.json`;
   - `~/.grok/trusted_folders.toml`;
   - `~/.dotfiles/.config/herdr/session.json`;
   - `~/Library/Application Support/obsidian/obsidian.json`.
5. Record a manifest with path, type, size, permissions, and SHA-256 for every backup file. Open each SQLite backup read-only and repeat its integrity/count checks.
6. Do not begin T5 unless every expected backup and manifest entry verifies. Keep `RUN_ROOT` until the user explicitly confirms deletion in a later session.

   - completed 2026-07-17-1610
   - `t4_backup_verified` was recorded at `2026-07-17T09:10:17Z`; the original manifest SHA-256 was `d0122e20fe823032c9fa86e5b362711b52500ca09c5cf1d5cecb80ac4cc2ec5c`.

### T5. Move all workspace trees with rollback protection

1. Recheck destination absence and source/destination device equality immediately before the first rename.
2. Rename in this exact order:
   1. `~/Desktop/ng3/kaira` → `~/dev/kaira`
   2. `~/Desktop/ng3/atlas` → `~/dev/atlas`
   3. `~/Desktop/ng3/company` → `~/dev/company`
3. Each rename is one same-volume filesystem move. Do not substitute copy-then-delete.
4. If any rename fails, reverse every already completed rename in reverse order, verify the original source layout and root inodes, write the rollback result, and stop before T6.
5. After all three succeed, verify:
   - all destination roots exist and corresponding source roots do not;
   - each destination root has the exact pre-move `st_dev:st_ino`;
   - Kaira `.git`, Atlas app `.git`, all three bank directories, Atlas vault instance, and company content exist;
   - Kaira repository status bytes, dirty diff, and untracked manifest match the baseline;
   - no harness/home state has yet been remapped by this phase.
6. Leave the now-empty `~/Desktop/ng3` parent for T10.

   - completed 2026-07-17-1612
   - `t5_workspace_moves_verified` was recorded at `2026-07-17T09:12:29Z`; all three root device/inode identities were preserved.

### T6. Remap sessions, databases, herdr, trust, and Obsidian offline

The runner performs only structural/discovery-key updates. Historical conversation bodies, commands, logs, memory content, and archive files remain unchanged.

#### Grok sessions and global state

1. Rename only these session groups, requiring source present and destination absent:
   - `%2FUsers%2Fkim%2FDesktop%2Fng3%2Fkaira` → `%2FUsers%2Fkim%2Fdev%2Fkaira`
   - `%2FUsers%2Fkim%2FDesktop%2Fng3%2Fatlas%2Fapp` → `%2FUsers%2Fkim%2Fdev%2Fatlas%2Fapp`
   - `%2FUsers%2Fkim%2FDesktop%2Fng3%2Fatlas%2Fvault` → `%2FUsers%2Fkim%2Fdev%2Fatlas%2Fvault`
2. In each session's `summary.json`, parse JSON and update only exact structural path fields such as `session.cwd` and `git_root_dir`. Do not rewrite `updates.jsonl`, `chat_history.jsonl`, terminal logs, frozen prompt context, hunk history, recap payloads, or arbitrary string values.
3. Update `session_docs.cwd` in one transaction using an exact `CASE cwd` over the observed live leaf cwds. Record before/after counts, run `PRAGMA integrity_check`, and assert historical `ig-bot` rows/counts are byte-for-byte unchanged.
4. In `trusted_folders.toml`, rename only the existing Kaira table header to `/Users/kim/dev/kaira`, preserving `trusted` and `decided_at`. Do not pre-trust Atlas or company.
5. After confirming every removed entry's PID is absent, delete only `active_sessions.json` entries whose cwd exactly equals a migrated old leaf cwd. Preserve unrelated entries.
6. Audit `worktrees.db`; if a target old path appears despite the T2 baseline, stop for plan revision rather than rewriting an unplanned worktree.

#### OMP sessions and global state

7. Rename the Kaira and Atlas app session groups to `-dev-kaira` and `-dev-atlas-app`. Rename the Atlas vault group to `-dev-atlas-vault` only if the source group exists; preserving an empty group is acceptable.
8. Parse each top-level OMP JSONL file line by line. Update only the exact `cwd` in the single `type=session` header. Preserve every other entry and sibling artifact directory.
9. Update `history.cwd` in one transaction using the same exact `CASE cwd` map. Record counts, run integrity checks, and assert all historical `ig-bot` rows remain unchanged.
10. Backups already exist; now delete each terminal breadcrumb file whose first-line cwd exactly equals a migrated old leaf cwd. Do not remap TTY breadcrumbs or delete unrelated ones.

#### herdr and Obsidian

11. Parse herdr `session.json`, recursively walking only keys named `identity_cwd` or `cwd`. Replace exact migrated prefixes in those fields, atomically write the file, and verify workspace IDs, labels, pane IDs, and layout-tree structure are otherwise unchanged.
12. Parse Obsidian `obsidian.json`. For the existing Atlas vault ID, replace only:

    ```text
    /Users/kim/Desktop/ng3/atlas/vault/instances/atlas
    → /Users/kim/dev/atlas/vault/instances/atlas
    ```

    Preserve the vault ID, timestamp, `open` flag, other vault entries, and top-level settings; atomically write the file.
13. Run JSON parsing, SQLite integrity, exact count, and path-key checks for all T6 outputs. There must be no old target discovery key in the remapped groups/files, while the old `ig-bot` group and rows remain.
14. Complete the `offline-cutover` phase marker. Do not reopen normal applications yet.

   - completed 2026-07-17-1612
   - `offline_cutover_verified`, the phase marker, and `phase_completed` were recorded at `2026-07-17T09:12:31Z`.

### T7. Discover and migrate Grok and Mnemopi path identities

Path hashes are observed, never guessed. Controlled launches create empty target identities; no prompt or agent turn may be submitted.

Execution amendment approved by the user at `2026-07-17-1613`: T4–T6 completed and verified with runner SHA-256 `0dc3d33c9f1ac909f984170089b71fa57455c6ed56cbdcdc89f787d8b5f69747`; backup manifest SHA-256 is `d0122e20fe823032c9fa86e5b362711b52500ca09c5cf1d5cecb80ac4cc2ec5c`; no T7 application had been launched. The unchanged runner validates both sets of empty discovery shells in one dry run and migrates Grok durable sources before Mnemopi banks. The following revised order supersedes the original staged discovery order and avoids a higher-risk rollback of already verified T4–T6 state.

Second T7 amendment approved by the user at `2026-07-17-1618`: the first controlled idle launches created all three empty Mnemopi banks but no Grok workspace-memory directory. Grok `0.2.102` enables memory in config but materializes workspace storage only when memory is initialized for the session. For each Grok cwd, use the documented session-only `/memory off` followed by `/memory on`, which reinitializes storage without an agent turn or durable memory content, then quit. Any non-empty target store remains a hard stop.

Third T7 amendment approved by the user at `2026-07-17-1624`: Grok `0.2.102` initialized each target with only `index.sqlite` and an exact three-line `MEMORY.md` boilerplate containing the new cwd plus `> Auto-populated by dream consolidation. Edit freely.`; no `sessions/` entry or user memory exists. After byte-for-byte verification across all three shells, delete only those generated boilerplate files, fsync their directories, leave the generated indexes for runner validation, and rerun the guarded dry run. Any differing content remains a hard stop.

Fourth T7 amendment approved by the user at `2026-07-17-1627`: the empty Kaira Mnemopi shell uses the current fresh-database column order for `working_memory.embed_text` and lacks `sqlite_stat1`/`sqlite_stat4`, while the authoritative Kaira bank has the same columns with `embed_text` appended by an earlier migration and has been analyzed. Atlas app and vault shells match exactly. After proving the Kaira shell has no durable rows and that these are the only schema-signature differences, normalize only that disposable shell by recreating its empty `working_memory` table from the exact T4 SQL and running `ANALYZE`; require an exact full schema match, integrity `ok`, and continued empty user tables. The authoritative old bank remains untouched and will still be moved whole.

The first normalization attempt recreated `working_memory` and the stat tables but, as SQLite specifies, dropping the table also removed its dependent indexes and FTS maintenance triggers. The shell remained empty and integral. Restore only the exact missing T4 index/trigger DDL, then repeat the full exact-schema, integrity, and emptiness checks.

1. Reverify the `offline-cutover` marker, backup manifest, runner hash, and application quiescence.
2. From Terminal.app, launch Grok once from each new cwd in this order: Kaira, Atlas app, Atlas vault. At the first idle prompt, submit only `/memory off` followed by `/memory on`, wait for memory storage to reinitialize, and quit immediately without an agent turn.
3. From Terminal.app, launch OMP once from each new cwd in this order: Kaira, Atlas app, Atlas vault. Submit no user prompt or tool request; exit immediately after startup initializes the bank.
4. Prove all Grok and OMP processes have exited. Run `migrate-memory --dry-run` once and identify exactly one newly created Grok memory slug and one newly created Mnemopi bank per cwd.
5. Recheck Git origins. If an origin appeared or either identity does not have one unambiguous old directory and one empty new directory, stop without merging.
6. Require each new Grok memory directory to have an absent/blank `MEMORY.md` and no files under `sessions/`, applying only the exact generated-boilerplate exception recorded above. Require each new Mnemopi bank to be a structurally empty initialization shell. Any real content is a hard stop; never merge stores automatically.
7. Run `migrate-memory --execute`. For each Grok project, the runner:
   - removes only the verified empty shell's generated `index.sqlite*` and runtime lock;
   - moves the old `MEMORY.md` and complete `sessions/` source tree into the new slug;
   - does not migrate `index.sqlite*`, `.dream-lock`, or another generated/runtime file;
   - removes the old project directory only after its durable source files match the backup and exist under the new slug.
8. For each Mnemopi project, after rechecking/checkpointing the old bank and its backup, the runner:
   - removes the verified empty new shell;
   - renames the complete old bank directory to the newly observed bank slug;
   - retains the DB, embeddings, graph tables, IDs, and all durable data.
9. In one transaction per non-empty bank, replace the exact old bank slug with the new slug only in identity columns that exist and matched the T4 baseline:
    - `working_memory.session_id`, `working_memory.channel_id`;
    - `episodic_memory.session_id`, `episodic_memory.channel_id`;
    - `facts.session_id`;
    - `consolidation_log.session_id`;
    - `memoria_facts.session_id`, `memoria_timelines.session_id`, `memoria_instructions.session_id`, `memoria_preferences.session_id`, `memoria_kg.session_id`.
10. Update `working_memory.metadata_json.$.cwd` only where it exactly equals that project's old cwd. Do not replace old path/bank text inside memory content, `embed_text`, FTS content, historical session summaries, or provenance.
11. Verify per bank:
    - all T4 table row counts and durable memory IDs are unchanged;
    - old slug count is zero in the listed identity columns;
    - new slug counts equal the old baseline counts;
    - old cwd count is zero and new cwd count equals the baseline in `working_memory.metadata_json`;
    - orphan embeddings do not increase;
    - `PRAGMA integrity_check` returns `ok`.
12. Verify the Atlas vault bank remains structurally empty except for schema/index initialization.
13. Complete the memory phase marker and keep Grok/OMP stopped until T9. Grok's documented watcher will rebuild generated search indexes during T9.

   - completed 2026-07-17-1631
   - `migrate-memory --execute` completed at `2026-07-17T09:31:21Z` under runner SHA-256 `0dc3d33c9f1ac909f984170089b71fa57455c6ed56cbdcdc89f787d8b5f69747`.

### T8. Rebuild path-sensitive state and update live path contracts

Run `rebuild --dry-run`, then `rebuild --execute` from Terminal.app.

T8 verification amendment approved by the user at `2026-07-17-1639`: `session_search.sqlite` is a generated Grok picker index after the controlled T7 launches, so global logical row-count equality with T4 is no longer valid. The observed reconciliation is T4 `90` rows to current `85`: the index added controlled Kaira session `019f6f62-139c-7c92-b85d-1ecb16b4f835` and Atlas app session `019f6f63-2cd4-7eb2-aac1-0a57c638944d`, and removed seven stale `.dotfiles` picker IDs (`019ecfe6-fca8-7610-909b-ac3b076e327b`, `019ed120-6c8f-7db3-96b6-9ce81afbd291`, `019ed462-dd03-7450-8a85-5398f518ed0b`, `019ed489-cb6b-7b53-8c69-4c859b26af23`, `019ed48a-6fb8-7792-a4d2-7a4b5c6409fe`, `019ed48f-cb3f-7ed1-a340-87072fe9dcd7`, and `019ed4c8-97fe-7bb0-8232-7e12ed27dfa8`); six have no durable session directory and one has only an empty directory. Both current and T4 databases pass integrity checks, all 83 shared rows are byte-identical after applying only the intended cwd map, all 48 migrated T4 picker rows are preserved under the new cwds, the two additions are backed by their controlled session directories, `ig-bot` is unchanged, old target cwds are zero, and FTS/document counts match.

The revised dry run and execute precheck must prove that exact observed reconciliation against the preserved T4 SQLite backup rather than weaken the invariant generally. OMP `history.db` remains strict and count-identical to T4. Any additional/missing ID, changed shared row, missing migrated baseline row, unbacked controlled addition, non-stale removal, schema/integrity failure, FTS mismatch, changed `ig-bot` row, or old target cwd is a hard stop.

1. Kaira Python environment:
   - atomically move the relocated old `.venv` to `RUN_ROOT/backup/kaira-venv-relocated`; the independently copied workspace backup remains the second recovery copy;
   - delete only generated `__pycache__`, `*.pyc`, and `.ruff_cache` entries under Kaira after the full workspace backup is verified;
   - run `uv sync --locked` from `~/dev/kaira` to create a fresh `.venv`;
   - assert no activation file or executable shebang under the new `.venv` contains `Desktop/ng3`.
2. Remove generated Python caches under Atlas app after its full backup; do not create a virtualenv because the project does not define one.
3. Update old paths only in live operational workspace artifacts:
   - `~/dev/atlas/vault/.agents/AGENTS.md`;
   - active files directly under `~/dev/kaira/.agents/plans/` and `~/dev/atlas/app/.agents/plans/` when an old path is used by a future command or live host-path example;
   - any executable config/script or active non-archived contract identified in T2.
   - record the exact migration-owned file list and diff; no other tracked workspace file may change.
4. Do not rewrite:
   - `.agents/plans/archive/`;
   - OMP/Grok transcript bodies, logs, memtrace, prompt history, or memory prose;
   - this migration plan's old-side path map and historical evidence;
   - Atlas vault `instances/atlas/tmp/todos-source-summaries-2026-07-15/` frozen prompts/reports. Those artifacts are immutable pass-1 provenance and must never be re-executed; future worker prompts must be regenerated under `~/dev`.
5. Re-scan symlink targets outside `.git`, banks, generated environments, caches, archives, and frozen campaign state. Any live absolute symlink to `Desktop/ng3` is a hard stop; none was observed during review.
6. If `zoxide` is installed, remove the three old workspace paths and add the new paths. Shell history remains historical.
7. Re-run static checks without opening normal applications:
   - destination layout and root inode checks;
   - Kaira status/diff/untracked comparison, accounting only for explicitly migration-owned generated-state changes;
   - Atlas live-contract path scan;
   - JSON parsing and SQLite integrity;
   - zero old target identity in all must-migrate state;
   - runner phase/checksum/log validation.
8. Complete the rebuild marker. T9 is the first normal reopen.

   - completed 2026-07-17-1647
   - the amended `rebuild --execute` completed at `2026-07-17T09:47:34Z` under runner SHA-256 `63695a87c7802cae7b6bb14960b59632069275bcc2201646101917485a064739`; the extended backup manifest has 19,300 entries and SHA-256 `b9cc6ab7f71be6fac89c2d8c3917debb5947fd2c28173cf4afd5280bed6206a0`.

### T9. Reopen applications and verify the migration end to end

1. Open Obsidian first. Verify the existing Atlas vault ID opens `/Users/kim/dev/atlas/vault/instances/atlas` with existing workspace/content intact; do not create a second vault entry.
2. Open Ghostty and start herdr. Verify workspaces `kaira`, `atlas`, and `atlas-vault` preserve their IDs/labels/layouts and every pane `pwd` is under the correct `~/dev` path. Exercise `pwd` and directory reads; no Desktop TCC denial may occur.
3. Open Grok from Kaira, Atlas app, and Atlas vault:
   - verify all pre-move session IDs are present/resumable from the new group;
   - distinguish preserved session-directory counts from `session_docs` picker counts; pre-move IDs must be a subset, while controlled T7 discovery sessions may add new IDs;
   - search workspace memory and confirm pre-move `MEMORY.md` and session-memory content appears;
   - verify each new Grok index contains no chunk path under an old memory slug and the old project memory directories are absent.
4. Open OMP from Kaira, Atlas app, and Atlas vault:
   - verify all pre-move session IDs are present/resumable under `-dev-*`;
   - run `/memory stats` or equivalent bank diagnostics;
   - repeat the T2 Kaira and Atlas recall queries and confirm the same durable IDs/content surface from the new bank;
   - confirm Atlas vault remains an intentionally empty project bank;
   - verify no new divergent empty bank appears.
5. From OMP, read `vault://atlas/ARCHITECTURE.md` and compare its T2 checksum/frontmatter. It must resolve from `~/dev/atlas/vault/instances/atlas`.
6. Run post-move project checks and compare with T2:
   - Kaira: `make test`, `make lint`, and `git status --porcelain=v2 --branch`;
   - Atlas app: `python3 scripts/atlas-instance.py check` and repository status.
   Any new failure is blocking. A pre-existing failure is acceptable only when the saved failure is reproduced unchanged and migration-specific smoke checks pass.
7. Re-run database verification:
   - Grok `session_docs` exact new cwd counts and old-session ID preservation;
   - OMP `history` exact new cwd counts;
   - historical `ig-bot` cwd/counts unchanged in both databases;
   - all SQLite integrity checks return `ok`;
   - Mnemopi identity, cwd, row-count, and orphan checks still pass after live startup.
8. Re-run the must-migrate residual scan. Keep applications idle while reading; if any live discovery key was rewritten back to Desktop, stop applications, restore/fix from the backup, and repeat T9.
9. Read `RUN_ROOT/logs/execution.jsonl`, then check T3 through T8 in this plan with their observed completion timestamps. Check T9 only after all criteria above pass.

   - completed 2026-07-17-1739
   - Obsidian, herdr/Ghostty, Grok, OMP, `vault://atlas`, project checks, database continuity, memory identity, repository invariants, and must-migrate residual checks all passed.

### T10. Classify residuals, close the ledger, and archive atomically

1. Classify every remaining `Desktop/ng3` occurrence:
   - **must be zero**: destination collisions, old live workspace roots, Grok/OMP session group keys and structural cwd headers, Grok/OMP database cwd rows for migrated projects, Mnemopi identity/cwd fields, herdr cwd fields, Obsidian registry, trusted Kaira path, affected terminal breadcrumbs, new `.venv`, live contracts/scripts, zoxide target entries;
   - **allowed historical**: this plan's old-side map, `ig-bot` archives/rows, archived plans, transcript/chat/tool bodies, shell/prompt history, Grok logs/memtrace, memory prose, backup copies, and frozen Atlas pass-1 campaign evidence.
2. Remove `~/Desktop/ng3/.DS_Store` and the parent only when no material entry remains. If unexpected material exists, retain it, record the exact listing in the completion summary, and still require the three source workspace paths to be absent.
3. Confirm old Grok memory and Mnemopi bank directories are absent from active locations and preserved only in `RUN_ROOT/backup`.
4. Retain `RUN_ROOT` unchanged. Record its path, runner hash, backup manifest hash, and restoration notes in the completion summary; deletion requires later explicit user confirmation.
5. Check every T1–T10 task with an indented `completed <YYYY-MM-DD-HHMM>` line. Append `## Completion Summary` containing:
   - source/destination inode results;
   - repository dirty-state preservation;
   - session ID/count remaps;
   - exact DB update counts and unchanged `ig-bot` counts;
   - old/new Grok and Mnemopi identities and memory verification;
   - herdr, Obsidian, `vault://atlas`, venv, and project-check outcomes;
   - classified residuals, fallbacks used, backup path, and remaining risk.
6. Set `Status` to `DONE` only after every verification criterion below is checked.
7. Atomically move this completed file from `.agents/plans/` to `.agents/plans/archive/` without copying/deleting or changing its filename. Do not stage, commit, or push.

   - completed 2026-07-17-1740
   - remaining old-path text was classified as historical plans/transcripts/logs/memory, frozen Atlas campaign evidence, or retained backup evidence; all must-migrate surfaces were clean. The metadata-only `~/Desktop/ng3` parent was removed.

## Decisions and fallbacks

1. **Canonical order**: this file wins over the offline runner, chat instructions, or an ad hoc shell command. A conflict stops execution.
2. **Same-volume only**: a device mismatch or rename failure stops the move. Never replace it with copy-then-delete without a newly approved plan revision.
3. **Destination collision**: any pre-existing target path is a hard stop; never merge workspace trees or session groups.
4. **Partial move**: reverse completed workspace renames before any harness-state remap. If rollback cannot restore exact root inodes, stop and preserve both layouts.
5. **Global quiescence**: all OMP/Grok processes must exit because global databases are rewritten; a dotfiles-cwd agent is not exempt.
6. **Backups**: no mutable-state write occurs before post-quiesce verified backups. Backups are private and retained after completion.
7. **Dirty work**: preserve Kaira exactly; do not commit, stash, reset, clean, or format product code.
8. **Historical `ig-bot`**: preserve its directory keys, database cwds, and transcripts exactly. All database writes use exact equality maps.
9. **Transcript bodies**: never bulk-rewrite Grok/OMP conversation, tool, log, hunk, prompt-history, or recap content.
10. **Grok trust**: preserve only the existing Kaira trust grant under its new path. Do not broaden trust to Atlas or company.
11. **Grok memory**: Markdown and session files are durable; indexes and locks are regenerated. A non-empty new slug stops migration; never merge automatically.
12. **Mnemopi**: move whole banks and rewrite exact internal identity columns/cwd metadata. A schema mismatch, non-empty new bank, count mismatch, new orphan, or failed recall stops migration; never re-import from transcripts.
13. **herdr fallback**: if the field-aware rewrite fails schema/runtime validation, restore the backup for evidence, then recreate the three workspaces at new paths with supported herdr commands. Do not mutate the invalid JSON further; document lost pane-layout history.
14. **Obsidian fallback**: if the registry edit fails, restore its backup and use Obsidian's supported “Open folder as vault” flow on the new nested instance. Do not create two active Atlas entries; document any vault-ID change.
15. **Pre-existing test failure**: only an exact baseline-equivalent failure may remain. Do not fix product code during this migration.
16. **Frozen Atlas campaign**: old absolute paths inside the completed pass-1 staging evidence remain provenance. Those prompts must not be re-executed; regenerate future control prompts after the move.
17. **Backup retention**: T10 does not delete `RUN_ROOT`; later deletion is a separate explicit user action.
18. **No Full Disk Access dependency**: normal work under `~/dev` must not require Desktop Folder permission.

## Verification / Done criteria

- [x] The plan was executed T1→T10 without an out-of-order task or unrecorded runner change.
- [x] Post-quiesce backups, SQLite integrity checks, manifests, runner hash, and execution log exist under a private retained `RUN_ROOT`.
- [x] `~/dev/kaira`, `~/dev/atlas/{app,vault}`, `~/dev/atlas/vault/instances/atlas`, and `~/dev/company` exist; the three source workspace paths do not.
- [x] Each destination root has the pre-move device/inode identity; no copy-delete fallback occurred.
- [x] Kaira tracked diff, dirty state, and untracked checksums preserve the T4 baseline except explicitly recorded generated-state rebuilds.
- [x] Every pre-move Grok session ID is preserved/resumable under the new cwd group, and migrated `session_docs` rows use only exact new cwds.
- [x] Every pre-move OMP session ID is preserved/resumable under `-dev-*`, and migrated `history` rows use only exact new cwds.
- [x] Historical `ig-bot` session group names and Grok/OMP database cwd row counts/values are unchanged.
- [x] Affected OMP terminal breadcrumbs and stale Grok active-session entries no longer reference migrated old cwds.
- [x] Grok workspace `MEMORY.md`/session sources match baseline checksums under the new slugs; generated indexes contain no old memory-directory paths; old active slugs are absent.
- [x] Kaira and Atlas app Mnemopi banks use the newly observed slugs, preserve baseline rows/IDs, contain no old slug in identity columns or old cwd metadata, add no orphan embeddings, pass integrity checks, and return baseline durable recalls.
- [x] Atlas vault Mnemopi remains the expected empty bank under its new slug without a duplicate bank.
- [x] herdr workspaces preserve IDs/labels/layouts or use the documented fallback; every pane cwd is under `~/dev` and no Desktop TCC error occurs.
- [x] Obsidian preserves one Atlas vault binding at `/Users/kim/dev/atlas/vault/instances/atlas`, and `vault://atlas/ARCHITECTURE.md` resolves with its baseline checksum/frontmatter.
- [x] Kaira has a freshly created `.venv` with no old-path shebang/activation value; Kaira and Atlas project checks match or improve their baselines.
- [x] Live contracts, active plan commands, executable configs, symlink targets, trust, and zoxide state contain no migrated old path; only classified historical residuals remain.
- [x] `~/.dotfiles` remains the unchanged project root except for this plan lifecycle and the intentional herdr session-path update.
- [x] `~/Desktop/ng3` is removed when empty/metadata-only, or unexpected retained material is explicitly recorded; none of the three workspace sources remains there.
- [x] All tasks have completion timestamps, `Status` is `DONE`, the completion summary is appended, and the plan is atomically archived.

## Risks / residuals

- Historical transcript/tool text may display old paths; it is intentionally not executable state.
- Frozen Atlas pass-1 campaign prompts retain old absolute paths as provenance and must not be re-run.
- Controlled T7 launches may create additional empty session records; preserved pre-move ID sets, not raw count equality, are the continuity invariant.
- Backup copies remain on the same physical volume and protect migration mistakes, not disk failure.
- A future OMP/Grok schema change before execution can invalidate the reviewed identity-column or metadata assumptions; T2/T4 schema assertions must stop rather than generalize.

## Out of scope

- Product/bot code behavior, releases, or browser automation logic
- Moving `~/.dotfiles`, `~/.kaira`, browser profiles, or historical `ig-bot`
- Rewriting archived plans, chat/transcript bodies, logs, shell history, memory prose, or frozen campaign evidence
- Adding Git origins, changing repository identity, creating/removing linked worktrees, or migrating submodules
- Expanding Grok trust grants
- Git staging, commits, pushes, stashes, resets, cleans, rebases, or branch operations
- Deleting the retained migration backup

## Completion Summary

- Same-volume renames preserved device `16777231` and root inodes: Kaira `242277534`, Atlas `242461163`, and company `240795228`. No copy/delete fallback or rollback was used.
- Kaira HEAD, tracked/staged diffs, status bytes, and six untracked file checksums remain byte-identical to T4. Atlas HEAD and all non-migration-owned state remain identical; only the three T8-ledgered active-plan path rewrites changed.
- All baseline session IDs remain. T9 live use produced expected additions: Grok directories Kaira `11→12`, Atlas app `163→164`, Atlas vault `1→2`; `session_docs` `11→12`, `36→37`, `1→2`; OMP files `17→17`, `16→17`, `0→0`; OMP history `111→116`, `73→78`, `1→3`. Old migrated cwd rows are zero.
- Historical `ig-bot` state is unchanged: one Grok picker row and 376 OMP history rows. All checked SQLite databases return integrity `ok`.
- Grok memory identities moved `kaira-a42bc3b4→kaira-874acab4`, `app-230b9161→app-1298f45b`, and `vault-28345770→vault-1fe28e4e`; durable sources match, indexes contain no stale chunk paths, and old roots are absent.
- Mnemopi identities moved `kaira-3fp0k0qoqg7wk→kaira-ao4n9b5qky3t`, `app-3mfad1k3bh97x→app-trg6c9lrzaql`, and `vault-k9lbn7180ezo→vault-uh0xgc4lsms6`. Baseline IDs and exact recall anchors remain; the vault bank is empty and unique. Pre-existing orphan counts remain exactly Kaira `4`, Atlas app `36`, vault `0`; live startup added none.
- herdr workspaces `w2`/`w3`/`w5`, pane layouts, and labels survived under `~/dev` without Desktop TCC errors. Obsidian vault ID `e29dffe128957381` remains singular. `vault://atlas/ARCHITECTURE.md` resolves under `~/dev` with file SHA-256 `54ec374cbcb76a28c248479242eb0a30fe4b4f6bd7352fe0fb9c7be451b4d245` and frontmatter SHA-256 `0ec3debeb752d3ee3399c25f44fb195365813ab6d4f5171382a8c1616c581cf2`.
- The new Kaira `.venv` has no old-path activation value or shebang. Kaira passed 208 tests plus Ruff check/format; Atlas instance check passed.
- Must-migrate residuals are zero. Remaining old-path text is limited to allowed historical archives, transcripts/logs/memory, the frozen Atlas pass-1 campaign, this ledger, and retained backup evidence. The metadata-only `~/Desktop/ng3` parent was removed.
- Retained recovery state: `/Users/kim/.local/share/workspace-migrate-20260717-110858`; runner SHA-256 `63695a87c7802cae7b6bb14960b59632069275bcc2201646101917485a064739`; final backup manifest SHA-256 `b9cc6ab7f71be6fac89c2d8c3917debb5947fd2c28173cf4afd5280bed6206a0` with 19,300 entries. Restoration uses the preserved whole-tree/state copies, SQLite backups, relocated old Kaira venv, markers, and execution log; no restoration was needed.
- Remaining risk: the retained backup is on the same physical volume, and historical/frozen old-path commands remain intentionally non-executable provenance.
