---
description: Use with the generic Git conventions when changing state in this dotfiles repository.
---

# Dotfiles Git workflow

This repository adds one staging interface to the generic Git conventions.

- Treat `~/.dotfiles` as the source of truth. Do not edit live targets under `~/.config`.
- In an interactive shell, `dot` means `git -C "$HOME/.dotfiles"` and `dot-add` runs the repository staging helper.
- In agent or other non-interactive shells, use `git -C ~/.dotfiles` or `git -C .` from the repository root.
- Stage only with `~/.dotfiles/bin/dot-add <name>...` or `./bin/dot-add <name>...`. Never use raw `git add`, `git commit -a`, or another staging bypass.
- Short names map to `.config/<name>`. Directly allowed paths include `.agents`, `bin`, `manifest`, `README.md`, `archive`, and explicit `.config/...` paths.
- If `dot-add` rejects a path that belongs in the repository, update `manifest` first. Do not bypass its allow-list.
- Inspect repository status and diffs with the `git -C` form, including the final staged diff before committing.

Examples:

```text
./bin/dot-add nvim
./bin/dot-add .agents .config/agents
git -C . diff --staged
```
