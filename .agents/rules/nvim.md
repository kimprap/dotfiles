---
description: Use when editing or discussing the Neovim config, UX decisions, or plugin choices.
alwaysApply: false
globs:
  - ".config/nvim/**"
---

# Neovim context

## Overview

Lean Neovim config using built-in `vim.pack` (no lazy.nvim). Strong preference for `mini.nvim`. Custom code is minimal and targeted.

Important layout notes:
- `init.lua` is a thin bootstrap (vim.pack + specific require order: core → options → ui modules → outline/markdown → lsp → `mini.setup_clue()` last).
- Most logic lives in `lua/`. `ftplugin/` is intentionally thin (simple opts + delegation comments only).
- `lua/options.lua` sets global defaults (e.g. `foldmethod=indent`, statuscolumn with signs) that frequently need local overrides.
- Non-trivial custom behavior is concentrated in `lua/outline.lua` and `lua/markdown.lua`.

Key files with custom logic:
- `lua/outline.lua`: targeted monkey-patches (cursor col 0, transparent style, gutter kill, single-hover sanitize).
- `lua/markdown.lua`: custom ATX foldexpr + chunk foldtext (preserves heading colors on collapse).
- `ftplugin/markdown.lua`: delegation only.

## Current decisions

- Using `vim.pack` (built-in, no lazy.nvim).
- Primary explorer: `oil.nvim` (`default_file_explorer = true`).
- Secondary explorer: `nvim-tree` floating tree (`<leader>e`).
- Project file finding: `fff.nvim`.
- Project grep: `fff` (`live_grep`).
- Global search: `fzf-lua`.
- Buffers: `mini.pick` (`<leader>,`).
- Buffer tabs: `barbar.nvim`; buffer navigation: `<Tab>` / `<S-Tab>`.
- Icons: `mini.icons` + `MiniIcons.tweak_lsp_kind()`.
- Outline: `outline.nvim` (marksman blacklisted). Uses targeted monkey-patches on `Sidebar` (col 0 cursor, transparent hor1+blend style, single deepest hover sanitize, eol linenos) + FileType autocmd for gutter kill, transparent cursor + original restore, direct mouse handling, and col-0 enforcement. Key config: `hide_cursor=true`, `auto_set_cursor=false`, `highlight_hovered_item=true` + WinScrolled follow. Stripped from sessions. Cursor must never obscure the item symbol.
- Markdown: `render-markdown.nvim` with custom heading colors. All heading fold logic lives in `lua/markdown.lua`: custom ATX `foldexpr` (headers >N, content inherits level) + `foldtext` chunk table so collapsed headers stay visible and keep `RenderMarkdownH*` color. `toggle_heading_level` uses `target = level-1` so m1 collapses content under visible H1, m2 shows H1+H2 headers (content collapsed). `ftplugin/markdown.lua` is minimal + delegates. Buf-local + global `<leader>mN` maps; buf-local silent `<C-S-[/]>` cycle via `vim.fn.search`.
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

## Reference configs (style examples only)

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

## Implementation patterns & invariants (critical for edits)

- **ftplugin convention**: Keep `ftplugin/*.lua` minimal (local `wo.` opts + 1-line delegation comment). All complex logic lives in `lua/*.lua`.
- **Folding**: Global `foldmethod=indent` + `foldexpr=0` (plus statuscolumn with signs) in `lua/options.lua`. Override per-window only. Markdown uses custom ATX `heading_foldexpr` (headers emit >N; content inherits nearest header level) + `foldtext` returning a chunk table so collapsed headers remain visible and keep their `RenderMarkdownH*` color (Folded group only styles trailing dots). Treesitter foldexpr is deliberately avoided for markdown headings.
- **Outline sidebar discipline**: Cursor is forced to col 0 of each item (never obscures the leading fold marker or symbol); transparent guicursor (hor1 + blend=100) while the Outline buffer is focused; original guicursor is captured early and restored on BufLeave. All gutter columns are killed on FileType + BufWinEnter. Only minimal targeted monkey-patches are used.
- **Keymap layering**: Buf-local maps for filetype-specific behavior (markdown folds/cycle, outline mouse/"o"). Globals are also registered for `mini.clue` visibility. Buf-local maps win (e.g. over gitsigns or mini square brackets). Header cycling uses plain `vim.fn.search` to avoid tag/LSP identifier errors.
- **Monkey-patches & comments**: Targeted post-load overrides (after `require("outline")` etc.) are acceptable when the plugin's public surface is insufficient. Keep them narrow. In `lua/outline.lua` and `lua/markdown.lua`, all comments must be generic and concise — no historical explanations, no "fixed X", no "as requested".
- **Provider & session hygiene**: Noisy providers are blacklisted per-context (marksman for outline symbols). `mini.sessions` explicitly strips outline (and oil) buffers. `.marksman.toml` is intentionally absent.
- **Globals before mangling**: Always capture originals (e.g. `guicursor`, fold settings) at module load time before any overrides.
- **Edit philosophy**: Small, targeted, boring changes preferred. Preserve the concrete UX invariants (header text stays visible + colored under m1/m2; outline cursor position never hides the item symbol). When in doubt, favor the simplest change that maintains current behavior over "improvements". Reference configs in this file only for style, not as targets to match.

## Plugin selection rule

Only add when built-in cannot do it or requires complex setup. Priority: fewer dependencies, then performance, then intuitiveness.
