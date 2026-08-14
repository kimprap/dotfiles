---
description: Use for Git workflows that change repository state or author commit messages; read-only inspection does not need this rule.
---

# Git conventions

Read-only commands such as `git status`, `git diff`, `git log`, `git show`, and `git rev-parse` do not require this workflow.

## Commit messages

Use Conventional Commits:

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

- `type`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`.
- `scope`: an affected subsystem in parentheses when useful; omit it when broad or noisy.
- `description`: imperative, lowercase after the colon, no trailing period, and fewer than 72 characters.
- Add a short body only when the reason or effect is not clear; do not use it as a file list.
- Use `!`, a `BREAKING CHANGE: <description>` footer, or both only for a real breaking change.
- Add issue trailers such as `Refs: #456` or `Closes: #123` only when applicable.

Determine the message from the actual staged diff. Before committing, validate the literal first line against this format.

## Safe Git workflow

1. Inspect status and the relevant diff before staging. If files are already staged, inspect that staged diff first.
2. Stage only the intended paths through the repository's documented helper when one exists. Never broad-stage unrelated work.
3. Keep one logical change per commit unless the user requests a batch commit.
4. Run the targeted verification required by the repository or change. Do not suppress failures.
5. Inspect the final staged diff for unrelated files, secrets, credentials, and machine-local or private configuration.
6. Validate the final message, then commit.

Do not change Git configuration, bypass hooks with `--no-verify`, or use destructive history operations without explicit user authorization. Do not stash, amend, rebase, reset, force-push, delete branches, or push unless explicitly requested. Never force-push a protected or default branch.

If a hook rejects a commit, fix the cause and run a new commit command. Do not bypass the hook or amend unrelated history.
