---
description: Use before running git-related commands, staging changes, committing, pushing, or writing commit messages.
condition: "\\b(?:git\\s|dot-add\\b|dot\\s+(?:status|diff|add|commit|push|log|show|stash|branch))"
scope:
  - "tool:bash"
interruptMode: "tool-only"
---

# Git conventions

## Commit messages

Use Conventional Commits:

```text
type(scope): subject
```

- `type`: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, or `chore`; use `build`, `ci`, or `perf` only when exact.
- `scope`: affected subsystem when useful; omit when the change is broad or the scope would be noise.
- `subject`: imperative, lowercase after the colon, no trailing period, <=72 chars.
- Add a short body only when the why/impact is not obvious; do not use the body as a file list.
- Mark breaking changes with `type(scope)!: subject` only when truly breaking.

Examples:

```text
feat(nvim): add codediff git view and diagnostic pickers
fix(zsh): init brew PATH before starship
chore(nvim): ignore nvim-pack-lock churn
```

Before committing, explicitly check the first commit-message line against the format above. If using `-m`, validate the literal message before running `git commit`.

## Safe git workflow

- Inspect status and relevant diffs before staging or committing.
- Stage only intended paths; prefer documented staging helpers, never broad-stage unrelated work.
- Keep commits scoped to one logical change unless the user asks for a batch commit.
- Before committing, inspect the staged diff and ensure it contains no secrets or machine-local/private config.
- Run targeted verification when repo conventions or the change require it; do not suppress failures.
- Do not stash, amend, rebase, reset, force-push, delete branches, or push unless explicitly requested.
