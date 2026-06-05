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

- `type`: `feat`, `fix`, `refactor`, `style`, `chore`, or `docs`.
- `scope`: affected area when useful, e.g. `nvim`, `zsh`, `starship`, `cursor`, `ghostty`, `yazi`, `scripts`.
- `subject`: imperative, lowercase after the colon, no trailing period, <=72 chars.
- Add a short body only when the why/impact is not obvious; do not use the body as a file list.
- Mark breaking changes with `type(scope)!: subject` only when truly breaking.

Examples:

```text
feat(nvim): add codediff git view and diagnostic pickers
fix(zsh): init brew PATH before starship
chore(nvim): ignore nvim-pack-lock churn
```

## Safe git workflow

- Inspect status and diffs before staging or committing.
- Stage only intended paths; never broad-stage unrelated user work.
- Do not amend, rebase, reset, force-push, or delete branches unless explicitly requested.
- Do not push unless the user explicitly asks.
- Do not commit secrets or machine-local/private config.
