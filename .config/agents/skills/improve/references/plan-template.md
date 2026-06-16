# Improvement Plan

Read `.config/agents/rules/plans.md` first. It owns naming (`YYYY-MM-DD-HHMM_<slug>.md`), the precise `## Tasks` (todo checklist) checkbox + `completed <ts>` format, the recommended `## Verification / Done criteria`, Completion Summary append on last task, and archive mv. This template supplies only the structure for self-contained, executable plans (no rule duplication).

When used by the /improve skill, the `<slug>` must follow the skill's convention: `IMPROVE_<mode-or-params>` (e.g. `2026-06-14-1530_IMPROVE_deep.md`, `..._IMPROVE_security.md`, `..._IMPROVE_standard`). Use `date +%Y-%m-%d-%H%M` for the prefix.

Plans target a fresh executor (zero session context). Key properties (adapted from shadcn/improve): self-contained facts + excerpts, verification gates (command + expected result), hard in/out scope boundaries, and explicit STOP conditions.

```markdown
# Improvement Plan: <imperative title of what will be true>

**Datetime**: <YYYY-MM-DD-HHMM>  (use `date +%Y-%m-%d-%H%M`)
**Mode**: standard | deep
**Scope**: <e.g. "current git diff", ".config/nvim/lua/* diagnostics", "security in yazi + nvim", "repo-wide after feature X">
**Summary**: 1-2 sentences on the main opportunities and intent.

## Why this matters

2-4 sentences. Concrete problem (with evidence), its cost, and the improvement when complete. Tie to the invocation focus.

## Current state

- Files and 1-line roles (include all that will be read or touched):
  - `path/to/foo.lua` — primary logic for Y; diff hotspot at 120-145
- Exact excerpts (your direct reads; for diff work include relevant unified diff hunks with file:line markers).
- Applicable repo conventions + exemplar file:
  "Early returns + explicit errors. See `bar.lua:30-50` for the local pattern to match."

## Commands you will need

| Purpose   | Command                          | Expected on success |
|-----------|----------------------------------|---------------------|
| Parse     | `stylua --check <paths>`         | exit 0              |
| Verify    | `nvim --headless -c 'checkhealth'` | (project-appropriate) |

(Real commands from the tree: package scripts, make, just, or `git grep` for test/lint.)

## Scope

**In scope** (the *only* files to modify or create):
- `exact/path1`
- `exact/path2`

**Out of scope** (do not touch, even if adjacent or tempting):
- `other/path` — reason (e.g. deprecated, different owner, risk of drift)

## Audit Findings

### Concise Comments & Readability
- ...

### Non-brittle Implementation & Robustness
- ...

### Prefactors & Structure (only where clearly beneficial in scope)
- ...

### Efficiencies
- ...

### Helper / Abstraction Restraint
- (call out any tempting slim helper you rejected)

### Other Quality / Correctness
- ...

## Tasks

**This is the todo checklist.** Group related work that can execute together (target practical batches, e.g. <~100k tokens). Order groups and items inside by priority (highest first). Use the exact checkbox format and `completed <ts>` rule from `plans.md`. This section is the execution order.

- [ ] ...

## Verification / Done criteria

Machine-checkable items (commands + expected). All must pass:
- [ ] `stylua --check ...` exits 0
- [ ] relevant tests / greps / health pass
- [ ] only in-scope files changed (`git status --porcelain`)
- [ ] behavior X still holds (spot check or command)

## STOP conditions

Stop and report (do not improvise) if:
- Live code at "Current state" excerpts no longer matches (drift since plan).
- A verification command fails after one reasonable retry.
- Task would require an out-of-scope file.
- Discovered that assumption "<X>" is false.

## Execution notes
- Re-capture `git diff` / state before and after each batch.
- Surgical edits only; stay inside the original scope and findings.

## Maintenance notes
- Future changes that will interact with this work.
- What a reviewer should scrutinize.
- Items explicitly deferred and why.

## Open Questions / Assumptions
- ...
```

## Quality bar (before emitting plan)
- A model that never saw the audit can execute using only this file + the repo.
- Every non-trivial step or criteria has a concrete command + expected result.
- STOP conditions are plan-specific risks, not boilerplate.
- All findings cite `file:line`; excerpts are fresh direct reads.
- Follows plans.md for Tasks (todo checklist), recommended Verification / Done criteria, and file lifecycle.
- No secret material.
```
