---
name: mnemopi-cleanup
description: >
  Audit and clean local Mnemopi memory banks. Use after OMP /memory enqueue,
  old-session imports, noisy recall, stale/duplicate memories, malformed facts,
  raw transcript noise, orphan embeddings, or memory-bank quality checks.
---

# mnemopi-cleanup

Clean Mnemopi memory without erasing useful provenance. Prefer high-signal retained facts over raw transcript chunks.

## When to use

- After OMP `/memory enqueue` or old-session imports.
- When recall returns stale, duplicated, malformed, low-signal, or raw transcript memories.
- When the user asks to audit Mnemopi bank quality, embeddings, facts, or cleanup.

Do not run broad cleanup routinely. Memory is heuristic context; over-cleaning can delete useful history.

## Locate and snapshot

1. Confirm the active backend is Mnemopi when practical (`memory.backend = mnemopi`, `/memory stats`, `/memory diagnose`, or current memory context).
2. Locate the active bank from diagnostics/config/current context; do not assume a database path without evidence.
3. Snapshot counts before edits:
   - active `working_memory`
   - invalidated `working_memory`
   - `memory_embeddings`
   - active rows without embeddings
   - stale/orphan embeddings
   - `facts`
   - `episodic_memory`
4. Inspect recent writes around the suspected enqueue/import window before deleting anything.

When direct DB access is available, prefer `scripts/mnemopi-status` over ad hoc SQL:

```bash
scripts/mnemopi-status path/to/mnemopi.db
scripts/mnemopi-status --watch path/to/mnemopi.db
```

`--watch` polls every 5s and times out after 180s by default. Exit codes: `0` clean, `1` pending/timeout, `2` DB/schema error, `3` stale/orphan embeddings.

## Classify rows

Keep:
- concise durable facts, decisions, user preferences, project conventions, and resolved gotchas;
- current setup state that affects future behavior;
- historical provenance that still explains a decision.

Invalidate:
- stale but historically meaningful diagnostics;
- old decisions superseded by newer retained facts;
- duplicate memories where one row is clearer and current.

Forget:
- command stubs such as `noop`, `/memory help`, or cleanup chatter;
- raw transcript chunks from `/memory enqueue` when curated retained facts cover the content;
- malformed extracted facts (`Instruction: ...` fragments, sentence shards, parser junk);
- stale operational facts such as old update/restart notices;
- secrets or accidentally retained credentials;
- orphan embeddings and embeddings for deleted/invalidated rows.

Prefer `memory_edit invalidate` for memories returned by `recall` when history matters. Use `forget` for pure noise, stubs, malformed facts, secrets, and duplicate junk. Use direct SQLite edits only for backend tables that memory tools cannot address, such as orphan embeddings or malformed `facts` rows, and only after a snapshot.

## Cleanup workflow

1. Run targeted `recall` queries for the imported or noisy topics.
2. Compare recall results against current repo/config evidence when a memory may be stale.
3. Apply narrow `memory_edit` operations to confirmed rows:
   - `invalidate` stale-but-useful rows and point at a replacement id when available.
   - `forget` pure noise and unsafe retained content.
4. Prune stale/orphan embeddings after deleting or invalidating rows.
5. Remove malformed fact rows that are not actionable memories.
6. Re-run the count snapshot.
7. Re-run targeted recalls and confirm high-signal rows dominate the results.

Never delete broadly by timestamp alone. Recent enqueue output can contain both excellent retained facts and raw transcript noise.

## Prevention handoff

For old-session import curation, use `mnemopi-retain` first. If `/memory enqueue` is run afterward, use this cleanup workflow immediately to remove raw transcript noise, malformed facts, duplicates, and stale/orphan embeddings.

## Reporting

Keep the final response memory-focused, not task/domain-focused.

If cleanup changed rows, report:
- what was kept, invalidated, forgotten, and why;
- before/after counts;
- recall queries used for validation;
- residual risk, especially unembedded active rows or memories needing user judgment.

If no cleanup was needed, use this shape and name the checks actually run:

```text
Memory audit clean. No stale/raw transcript memories, malformed facts, duplicate junk, active unembedded rows, or stale/orphan embeddings found. Checked: <counts and recall queries>. No memory edits applied.
```

If verification was partial, say what could not be checked instead of claiming the bank is clean.

Do not retain the cleanup transcript itself. Retain only durable policy changes the user explicitly wants remembered.
