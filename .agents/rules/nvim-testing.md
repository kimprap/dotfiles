---
description: Headless Neovim verification patterns for folds, syntax, foldtext (UserFoldText), and related UI-sensitive Lua behavior.
alwaysApply: false
globs:
  - ".config/nvim/**"
condition: "nvim.*--headless|--clean.*-u NONE|UserFoldText|foldtext|heading_foldexpr|vim\\.wo\\.fold|foldmethod.*=.*(indent|expr)|dofile.*\\.config/nvim/lua|headless.*lua|qa!.*nvim"
scope:
  - "tool:bash"
  - "tool:write"
  - "tool:edit"
interruptMode: "tool-only"
---

# Headless Neovim testing

Command-line `+lua 'multi; statements'` (and chains of `+"lua ..."` args) after `--clean -u NONE` are fragile. They commonly produce E5107 parse errors because of shell quoting interacting with nvim's single-line Ex `lua` command handling. Never rely on them for non-trivial checks.

## Real window requirement

`vim.wo` options, manual fold creation (`:N,Mfold`), `synID`, treesitter position queries, and custom `foldtext` implementations that read highlighting only behave correctly when the buffer is displayed in an actual window.

- `nvim_create_buf(false, true)` followed by `set_current_buf` alone does not provide this context in headless mode.
- Immediately follow with a window-creating command such as `vim.cmd('split')` (or `enew | buffer <nr>`).
- Address the specific window when setting options: `vim.wo[win].foldmethod = 'indent'`, `vim.wo[win].foldtext = ...`, etc.
- Without a real window, fold commands raise E350.

## Testing custom foldtext directly

The goal for most verification of `UserFoldText` (in `options.lua`) or the markdown chunk-returning foldtext (in `markdown.lua`) is to exercise the return value (plain string or chunk table), not to exercise the full fold creation machinery.

- Populate a buffer with representative content and make it the current buffer inside a real window (when `synID` or treesitter captures are involved).
- Set `vim.v.foldstart` and `vim.v.foldend` to the logical fold range.
- Call the function: `_G.UserFoldText()` or `vim.fn.foldtext()` (after ensuring `&foldtext` points at the lua expression).
- Creating the fold object itself with `vim.cmd` is unnecessary for renderer testing and is the most common source of headless failures.

## Managing side effects and ensuring exit

Requiring high-level modules (`require('options')`, `require('lsp')`, etc.) registers autocmds, runs ColorScheme callbacks, and can launch background work (timers, LSP, Mason).

- In test scripts, require only what is strictly needed for the behavior under test.
- After any buffer mutation + option changes (filetype, syntax, foldexpr, etc.), run `vim.cmd('redraw')` or `normal! zx` to drive computation.
- Every headless script must hard-terminate: `vim.cmd('qa!')`. Using plain `qa` can wait for input or leave the process running.
- For anything that attaches asynchronously, a bounded `vim.wait(..., cond, 10)` is acceptable; always have a final hard `qa!` after the wait.

## Reliable invocation template

Use a sourced file rather than inline `+lua`:

```bash
nvim --headless --clean -u NONE -i NONE --noplugin \
  --cmd 'set rtp+=/absolute/path/to/.config/nvim' \
  -S /tmp/headless_foo.lua 2>&1 | cat
```

The script should contain the setup, any assertions via `print`, and end with `vim.cmd('qa!')`.

This pattern is independent of the calling shell or harness.

## When to apply this rule

Surface these patterns whenever the agent is about to execute a `nvim --headless` command (or equivalent) while the working set includes `.config/nvim/lua/options.lua`, `markdown.lua`, `lsp.lua`, or other code that touches `fold*`, syntax, or window-local settings. The recommended flow is: write (or update) a small test script, run it, examine output, then edit the implementation.

Keep the test script minimal and checked in temporarily if it helps future verification of the same area.
