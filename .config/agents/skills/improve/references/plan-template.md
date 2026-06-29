# Improvement Plan

Read `.config/agents/rules/plan.md` first. It owns plan filenames, active/archive locations, the core header metadata block (`Datetime`/`Scope`/`Summary`/`Status`), `## Tasks` checkbox rules, stable task reference codes, completion timestamps, Completion Summary, and archive moves. This template adds `/improve`-specific `Mode` plus proportional standard/deep plan shapes.

When used by `/improve`, the `<slug>` must follow `IMPROVE_<mode-or-params>` (e.g. `2026-06-14-1530_IMPROVE_deep.md`, `..._IMPROVE_security.md`, `..._IMPROVE_standard`). Use `date +%Y-%m-%d-%H%M` for the prefix.

## Proportionality

Plans target a fresh executor with zero session context, but they are not transcripts. Include the minimum evidence needed to execute safely.

- **standard**: compact executable plan by default. Use focused findings, exact in/out scope, tasks, verification, and STOP conditions. Add longer context only when it reduces risk.
- **deep** or high-risk/multi-subsystem work: expanded plan. Include more current-state context, phased findings, command details, and maintenance notes.
- Quote code only when exact shape matters. Prefer `file:line` references and 1-3 line excerpts over copied blocks.
- Omit empty audit categories. Collapse related findings.
- Do not paste full validation scripts unless the exact script is non-obvious or intended for reuse.

## Standard compact plan

Use this shape for default `/improve` unless the audit finds broad or risky work:

```markdown
# Improvement Plan: <imperative title of what will be true>

**Datetime**: <YYYY-MM-DD-HHMM>
**Mode**: standard
**Scope**: <bounded area of work>
**Summary**: <1-2 sentences on the main opportunity and outcome>
**Status**: PENDING

## Findings

- `path/to/file.ext:line` — <problem> → <planned fix>. <Short evidence; include a tiny excerpt only if needed.>
- `path/to/other.ext:line` — <problem> → <planned fix>.

## Scope

**In scope**:
- `exact/path`

**Out of scope**:
- `adjacent/path` — reason

## Tasks

- [ ] T1. <focused execution batch>
- [ ] T2. <verification/review batch if separate>

## Verification / Done criteria

- [ ] `<targeted command>` exits 0
- [ ] <observable behavior or diff invariant holds>
- [ ] `git status --porcelain <in-scope paths>` shows only expected paths

## STOP conditions

- Current file contents no longer match the cited findings.
- A task requires an out-of-scope file.
- A verification command fails after one reasonable fix attempt.
```

## Expanded plan additions

Use these sections for `/improve deep`, larger refactors, migrations, security work, or plans with multiple dependent batches. Include only sections that earn their place.

```markdown
## Why this matters

2-4 sentences. Concrete problem, cost, and expected improvement.

## Current state

- Files and roles:
  - `path/to/foo.lua` — primary logic for Y; relevant lines 120-145
- Evidence:
  - `path/to/foo.lua:123-126` — short excerpt or summarized pattern.
- Applicable conventions:
  - <local pattern or rule to preserve>

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Parse | `<real command>` | exit 0 |
| Verify | `<real command>` | expected result |

## Scope

**In scope**:
- `exact/path1`
- `exact/path2`

**Out of scope**:
- `other/path` — reason

## Audit Findings

### <category or subsystem>
- `file:line` — finding → planned fix.

## Execution notes
- Re-capture state before editing if the tree is dirty or the plan is old.
- Keep edits surgical and inside scope.

## Maintenance notes
- Future interaction or reviewer focus.
- Deferred items and why.

## Open Questions / Assumptions
- <assumption and impact>
```

## Quality bar before emitting a plan

- A model that never saw the audit can execute using only the plan plus the repo.
- Every task has enough file/path detail to act without re-discovering the whole problem.
- Verification is concrete and targeted.
- STOP conditions are plan-specific risks, not boilerplate.
- The plan follows `plan.md` for header metadata, stable task reference codes, `## Tasks`, completion timestamps, Completion Summary, and archive lifecycle.
- The plan is proportional: small standard plans stay short; deep plans carry enough detail to avoid unsafe guessing.
- No secret material.
