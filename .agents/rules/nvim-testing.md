---
description: Reliable headless Neovim verification patterns for repo-local Lua modules and UI-sensitive behavior.
alwaysApply: false
condition: "nvim.*--headless|bin/nvim-headless|UserFoldText|foldtext|heading_foldexpr|vim\\.wo\\.fold|foldmethod.*=.*(indent|expr)|dofile.*\\.config/nvim/lua|headless.*lua|qa!.*nvim"
scope:
  - "tool:bash"
  - "tool:write(.config/nvim/**)"
  - "tool:edit(.config/nvim/**)"
interruptMode: "tool-only"
---

# Headless Neovim testing

Use two lanes:

1. **Config smoke test** — load the real config and exit:
   ```bash
   nvim --headless +qa
   ```
   Use this only for “does the config boot?” checks. No assertions, temp files, waits, or buffer mutations.
2. **Targeted module verification** — run a small Lua script through the repo helper:
   ```bash
   ./bin/nvim-headless /tmp/test.lua
   ./bin/nvim-headless --lua 'print("ok")'
   ```
   Switch to this lane as soon as the check needs assertions, writes, temp files, mappings, `vim.wait(...)`, or buffer/window state.

## Never do these

- `nvim --headless -c 'lua <<EOF ... EOF'`
- complex `+"lua ..."` / `-c "lua ..."` multi-statement checks
- targeted assertions crammed into a shell-quoted one-liner
- `vim.cmd("set buftype=terminal")`
- `vim.cmd("qa")` without `!` after mutating buffers

Observed failures:

- `E5107: Lua: [string ":lua"]:1: unexpected symbol near '<'`
- `E474: Invalid argument: buftype=terminal`
- `E37` / `E162` on quit after a scripted buffer change
- harness-level timeouts when a headless one-liner never reaches a clean exit

Root causes:

- Neovim's Ex `:lua` entrypoint is a poor transport for multi-line scripts.
- `qa` is not robust once the script has modified buffers.
- `buftype=terminal` is not a user-settable simulation flag; terminal buffers are created internally.

## Helper contract

`bin/nvim-headless` is the preferred targeted-test entrypoint.

Prefer it even for small checks once the script does more than print a value. It owns the Lua transport, failure propagation, and quit path.

It supports two modes:

- default: loads this repo's Neovim config, so plugin-backed modules still work
- `--clean`: starts `nvim --headless --clean -u NONE -i NONE --noplugin` and appends this repo's `.config/nvim` to `runtimepath`

Both modes:

- run Lua from a file, stdin (`-`), or `--lua`
- hard-exit with `qa!` after the script returns
- turn script failures into a non-zero exit

## Window-local and UI-sensitive behavior

`vim.wo[...]`, folds, `foldtext`, `synID`, and many treesitter position checks require a displayed buffer in a real window.

- `nvim_create_buf()` + `set_current_buf()` alone is not enough.
- Create or reuse a real window before setting window-local options:
  - `vim.cmd("split")`
  - `vim.cmd("sbuffer " .. buf)`
- Set options against the target window: `vim.wo[win].foldmethod = "expr"`, etc.
- After changing filetype/options/content, force recomputation with `vim.cmd("redraw")` or `vim.cmd("normal! zx")`.

## Non-file and terminal cases

When the code path only needs “not a normal file buffer”, prefer:

- unnamed buffers
- `nofile` buffers

Do **not** fake terminal state with `set buftype=terminal`.

If the behavior truly depends on terminal buffers, create a real terminal buffer with `vim.fn.termopen(...)` or `:terminal`, then use a bounded `vim.wait(...)` inside the script before asserting.

## Keep targeted scripts minimal

- Require only the module under test.
- Avoid loading high-level modules like `options` or `lsp` unless the test is specifically about their side effects.
- Keep throwaway scripts untracked unless they are likely to be reused.

## Recommended flow

1. Pick the smallest meaningful check.
2. For a smoke test, run plain `nvim --headless +qa`.
3. If the check asserts anything or mutates editor state, write a tiny Lua script and run it through `./bin/nvim-headless`.
4. Use `./bin/nvim-headless --clean ...` only when you explicitly want an isolated runtime.
5. Read the output, then edit the implementation.
