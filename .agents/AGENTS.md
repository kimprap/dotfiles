---
description: Dotfiles repository operating guide for agents working in ~/.dotfiles.
alwaysApply: true
---

# Dotfiles repository guide

## Project overview

Personal macOS dotfiles live in `~/.dotfiles`. Live app configs are symlinked from `~/.config` and app-specific locations into this repo by `.config/scripts/bootstrap`.

Primary areas: Neovim, Zsh, Starship, Ghostty, Yazi, Cursor, helper scripts, and bootstrap automation.

## Source of truth

- Edit files in `~/.dotfiles`, not live symlink targets under `~/.config`.
- `.config/scripts/bootstrap` owns machine setup: symlinks, Homebrew packages, Ghostty install, SourceCodePro Nerd Font, and minimal `~/.zshrc` sourcing `.config/zsh/zshrc`.
- Preserve backup-before-overwrite behavior in bootstrap/setup scripts.
- Target macOS on Apple Silicon; prefer Homebrew paths under `/opt/homebrew`.

## Key directories

- `.config/nvim/` — Neovim config using built-in `vim.pack`, native `vim.lsp`, and modules under `lua/`; detailed Neovim context lives in `rule://nvim`.
- `.config/zsh/` — Zsh entrypoint, Antidote plugin list, and native modules for history, completion, keybindings, options, appearance, and terminal support.
- `.config/scripts/` — bootstrap/setup scripts.
- `.config/cursor/` — shared Cursor settings, keybindings, extension list, and installer.
- `.config/ghostty/` — Ghostty terminal config.
- `.config/yazi/` — Yazi config, keymaps, and Lua plugin setup.
- `bin/` — repo helper scripts, especially `dot-add`.
- `archive/` — reference-only snapshots; not live-loaded.

## Dotfiles git workflow

Interactive shells define:

| Alias | Definition |
|---|---|
| `dot` | `git -C $HOME/.dotfiles` |
| `dot-add` | `$HOME/.dotfiles/bin/dot-add` |

Staging rules (all contexts):

- Stage only via the `dot-add` script; never raw `git add .`, `git add -A`, `dot add .config`, or other broad staging.
- The script (or its direct equivalent) only stages paths listed in `manifest`.
- When aliases are available, use `dot-add <name> [name...]`.
- Otherwise (non-interactive shells, agents, automation), use the expanded forms:
  - `git -C ~/.dotfiles` (or `git -C .` when cwd is the repo root)
  - `~/.dotfiles/bin/dot-add <name>` (or `./bin/dot-add <name>` when cwd is the repo root)
- Short names map to `.config/<name>`; other directly allowed paths include `bin`, `manifest`, `README.md`, `archive`, and explicit `.config/...`.
- If the adder rejects a path, update `manifest` first. Do not bypass the allow-list.
- Push only when explicitly requested.

## Code conventions

- Prefer small, boring config changes. Avoid new plugins unless native APIs or `mini.nvim` would be too complex.
- Lua uses 2-space indentation per `.stylua.toml`; modules usually use `local M = {}` and `return M` when exporting behavior.
- Neovim keymaps usually go through `local map = require("map")` or `vim.keymap.set` with `desc` fields.
- Add LSP servers as `.config/nvim/lsp/*.lua` and add matching Mason tools to the explicit tool list.
- Formatting is via `conform.nvim` on save: Stylua for Lua, Ruff for Python, Prettier for JS/TS/JSON/HTML/CSS, Taplo for TOML, yamlfmt for YAML.
- Save hooks trim trailing whitespace and ensure a final blank line for normal modifiable buffers.
- Zsh helper scripts use `set -euo pipefail`; `.config/zsh/zshrc` keeps Homebrew PATH initialization before prompt/tool setup.
- Cursor JSON files use comments and 2-space indentation in practice; root `.prettierrc` uses 4 spaces for Prettier-managed files.
- Yazi Lua follows local upstream/plugin-style tab indentation; preserve local style unless intentionally formatting the whole file.

## Verification

There is no project-level package manager, build script, Makefile, or test runner.

Use targeted checks:

```bash
stylua ~/.dotfiles/.config/nvim
prettier --write ~/.dotfiles/.config/cursor/settings.json ~/.dotfiles/.config/cursor/keybindings.json
nvim --headless +"checkhealth vim.lsp" +qa
```

- For Neovim changes, run the smallest relevant headless check, e.g. `nvim --headless +"lua require('workspace').session_slug('~/x')" +qa`.
- For shell/bootstrap changes, run syntax checks on touched scripts (`bash -n`, `zsh -n`) and inspect side effects before executing bootstrap.
- For app configs without automated tests, verify the specific app feature when possible and keep changes narrow.
