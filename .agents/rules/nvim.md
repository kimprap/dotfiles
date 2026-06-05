---
description: Use when editing or discussing the Neovim config, UX decisions, plugin choices, or Phase 8 config split.
alwaysApply: false
globs:
  - ".config/nvim/**"
---

# Neovim context

## Goal

Lean Neovim config on Ghostty using `vim.pack`. Minimal plugins. Prioritize `mini.nvim` where possible for core UX.

## Current decisions

- Using `vim.pack` (built-in, no lazy.nvim).
- Primary explorer: `oil.nvim` (`default_file_explorer = true`).
- Secondary explorer: `mini.files` (popup via `<leader>e`).
- Project file finding: `fff.nvim`.
- Project grep: `fff` (`live_grep`).
- Global search: `fzf-lua`.
- Buffers: `mini.pick` (`<leader>,`).
- Buffer tabs: `barbar.nvim`; buffer navigation: `<Tab>` / `<S-Tab>`.
- Icons: `mini.icons` + `MiniIcons.tweak_lsp_kind()`.
- Outline: `outline.nvim` with exclude-noise filter, inline line numbers, manual sync via `<leader>o` / `<leader>O`; not restored in sessions.
- Sessions: `mini.sessions` per workspace (`.nvim/workspace` marker); strips oil + outline on save/restore.
- Copy lines: normal `copy .` / `copy .-1` with cursor restored; visual `:t '>` / `:t '<-1` + `gv=gv` (`<A-S-j>` / `<A-S-k>`).
- Search case: `ignorecase` + `smartcase`; `<leader>ui` toggles; `\c` / `\C` per-pattern in `/` and `?`.
- Key hints: `mini.clue` (not which-key); configured last so LSP buffer maps take precedence.
- Sticky scroll: `nvim-treesitter-context`; Vim syntax unchanged; parsers via `tree-sitter-cli`.
- Tooling: Mason + `mason-tool-installer` with explicit `MASON_TOOLS`; native `vim.lsp` via `lsp/*.lua`; Mason `bin` on `PATH`.
- LSP UX: `blink.cmp` (super-tab), `conform` format-on-save, fzf-lua for definitions/references/symbols, LSP foldexpr on attach / indent fallback on detach, `<leader>L*`.
- Diagnostics: `]d`/`[d` jump; `<leader>xd`/`xD` fzf-lua buffer/workspace pickers; `<leader>xl` loclist; `<leader>x` prefix.
- Git gutter: `gitsigns.nvim` signs-only; statusline + scrollbar integration.
- Git diff: `codediff.nvim` via `<leader>g*`; `q` closes CodeDiff tabs; `<C-e>` focuses explorer inside CodeDiff.
- Close editor (`<leader>q` / `<C-q>`): split-aware close pane/buffer; CodeDiff uses plugin default `q`.
- No winbar.

## Reference configs

1. [radleylewis/nvim-lite](https://github.com/radleylewis/nvim-lite/blob/master/init.lua)
2. [MariaSolOs/dotfiles](https://github.com/MariaSolOs/dotfiles/tree/main/.config/nvim)
3. [vossenwout/pookie-dotfiles](https://github.com/vossenwout/pookie-dotfiles/blob/main/neovim/.config/nvim/init.lua)
4. [dmtrKovalenko/dotfiles](https://github.com/dmtrKovalenko/dotfiles/blob/main/.config/nvim)
5. [linkarzu/dotfiles](https://github.com/linkarzu/dotfiles-latest/tree/main/neovim/neobean/lua/plugins)

## Principles

- Performance and low dependencies first.
- Use native Neovim + `mini.nvim` when sufficient.
- Add plugins only when built-in behavior is insufficient or too complex.
- User is new to Neovim; keep explanations practical.
- Mason for LSP/formatters/search CLIs; explicit lists, not install-everything.
- Prefer ex commands and minimal Lua over heavy custom logic when Vim builtins suffice.

## Core UX topics

- Search, motions, text objects, centering (`nzzzv`, `zz`).
- Yank/delete/paste without yanking, highlight on yank.
- Line movement (`mini.move`), improved `J`.
- Copy line up/down, normal and visual.
- Search case (`ignorecase`/`smartcase`, `<leader>ui`, `\c`/`\C`).
- Restore cursor position, `>gv` / `<gv`.
- Trailing whitespace removal + final newline on save.
- Static indent guides (`mini.indentscope` with no animation).

## Phase progress

| Phase | Focus | Status | Notes |
|---|---|---|---|
| 1 | Core Foundation | Done | Options, theme, centering helpers |
| 2 | Keymaps + Motions + QoL | Done | mini basics, yank highlight, mini.move, cursor restore, trailing whitespace, copy lines, search case toggle |
| 3 | File Explorer & Finder | Done | oil + mini.files + fff + fzf-lua |
| 4 | Tabs & Buffer Management | Done | barbar, `<Tab>`/`<S-Tab>`, mini.sessions, mini.starter, close/save keymaps, split-aware close |
| 5 | Gutter, Outline, Scrollbar, Statusline | Done | gitsigns, outline, scrollbar, mini.statusline |
| 6 | LSP + Completion | Done | blink.cmp, Mason, conform, `lsp/*.lua`, diagnostics, LSP folds, `<leader>L*` |
| 6b | Git view + diagnostics UX | Done | codediff `<leader>g*`, diagnostic `<leader>x*`, CodeDiff close via `q` |
| 7 | Polish & Treesitter | Done | context-only treesitter + sticky scroll; Vim syntax kept |
| 8 | Config Split | Pass A Done | `init.lua` is thin bootstrap; modules extracted; Lean Pass candidates pending approval |

## Phase 8 split plan

Keep `init.lua` as a thin bootstrap: netrw disable, `vim.pack.add`, leader, ordered module requires, late `mini.statusline`/`mini.clue`, final `nohlsearch()` + scrollbar refresh.

| File | Contents |
|---|---|
| `lua/map.lua` | Shared tiny `map()` wrapper for modules defining keymaps |
| `lua/workspace.lua` | Workspace labels and session path/restore predicates shared by explorer and sessions |
| `lua/options.lua` | `vim.opt`, colorscheme, colorcolumn, trailing whitespace, yank highlight, cursor restore |
| `lua/mini.lua` | mini.nvim plugins in one file: core basics/pairs/comment/surround/cursorword/indentscope/pick/move/icons/bufremove, plus late statusline and clue setup |
| `lua/explorer.lua` | oil, mini.files, fff, fzf-lua, session-aware directory handling |
| `lua/sessions.lua` | mini.sessions hooks, ephemeral cleanup, starter VimEnter, `<leader>S*` |
| `lua/git.lua` | lazy gitsigns setup/attach, codediff setup + `<leader>g*` |
| `lua/buffers.lua` | barbar, `<Tab>` nav, `close_editor`, buffer reopen, dirty-tab highlights |
| `lua/ui.lua` | scrollbar, search-scrollbar handler/keymaps, neoscroll, fold keymaps |
| `lua/keymaps.lua` | General keymaps plus keymap-driven state: custom jumplist, zoom, copy lines, save/quit, yank-path |
| `lua/outline.lua` | outline.nvim setup + inline line-number monkey patch + manual sync keymaps |
| `lua/treesitter.lua` | nvim-treesitter bootstrap, parser install guard, Homebrew PATH, treesitter-context |
| `lua/lsp.lua` | Mason PATH/tools, blink, conform + EOF hook, diagnostics, LSP attach/detach, manual LSP picker, `<leader>L*`, `<leader>x*` |
| `lsp/*.lua` | Per-server native configs |

## Plugin selection rule

Only add when built-in cannot do it or requires complex setup. Priority: fewer dependencies, then performance, then intuitiveness.
