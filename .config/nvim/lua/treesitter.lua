-- Treesitter parsers for sticky context only; Vim syntax/highlighting stays native.
-- Requires `tree-sitter` on PATH.

local env = require("env")

local M = {}

local TS_PARSERS = {
  lua = true,
  python = true,
  rust = true,
  zig = true,
  bash = true,
  yaml = true,
  toml = true,
  json = true,
  markdown = true,
  dockerfile = true,
  typescript = true,
  javascript = true,
  css = true,
  html = true,
}

local treesitter_did_setup = false
local context_did_setup = false
local context_render_did_patch = false
local ts_parsers = nil
local context_windows_by_source = {}

local CONTEXT_MARKER = "treesitter_context"
local RESERVE_COLS = 1

local function setup_treesitter_once()
  if treesitter_did_setup then
    return ts_parsers ~= nil
  end
  treesitter_did_setup = true

  env.prepend_existing_path("/usr/local/bin")
  env.prepend_existing_path("/opt/homebrew/bin")

  local ts = require("nvim-treesitter")
  ts.setup({ install_dir = vim.fn.stdpath("data") .. "/site" })

  if type(ts.install) ~= "function" then
    vim.notify_once(
      "nvim-treesitter: stale install at site/pack/core/opt/nvim-treesitter — remove dir and restart",
      vim.log.levels.ERROR
    )
    return false
  end

  if vim.fn.executable("tree-sitter") ~= 1 then
    vim.notify_once(
      "nvim-treesitter: run `brew install tree-sitter-cli` for sticky-context parsers",
      vim.log.levels.WARN
    )
    return false
  end

  ts_parsers = require("nvim-treesitter.parsers")
  return true
end

local function resize_context_window(winid, ctx_win)
  if not (vim.api.nvim_win_is_valid(winid) and vim.api.nvim_win_is_valid(ctx_win)) then
    return false
  end
  local cfg = vim.api.nvim_win_get_config(ctx_win)
  if cfg.relative ~= "win" or cfg.win ~= winid then
    return false
  end
  local wininfo = vim.fn.getwininfo(winid)[1]
  local gutter = (wininfo and wininfo.textoff) or 0
  local target = math.max(1, vim.api.nvim_win_get_width(winid) - gutter - RESERVE_COLS)
  if (cfg.width or 0) > 1 and cfg.width ~= target then
    cfg.width = target
    pcall(vim.api.nvim_win_set_config, ctx_win, cfg)
  end
  return true
end

local function patch_context_render_once()
  if context_render_did_patch then
    return
  end
  context_render_did_patch = true

  local render = require("treesitter-context.render")
  if render.__dotfiles_scrollbar_reserve_patched then
    return
  end
  local orig_open = render.open
  render.open = function(winid, ctx_ranges, ctx_lines, force_hl_update)
    orig_open(winid, ctx_ranges, ctx_lines, force_hl_update)
    vim.schedule(function()
      if not vim.api.nvim_win_is_valid(winid) then
        return
      end

      local cached = context_windows_by_source[winid]
      if cached and resize_context_window(winid, cached) then
        return
      end

      for _, w in ipairs(vim.api.nvim_list_wins()) do
        if vim.api.nvim_win_is_valid(w) then
          local ok, is_ctx = pcall(function()
            return vim.w[w][CONTEXT_MARKER]
          end)
          if ok and is_ctx and resize_context_window(winid, w) then
            context_windows_by_source[winid] = w
            return
          end
        end
      end
    end)
  end
  render.__dotfiles_scrollbar_reserve_patched = true
end

local function setup_context_once()
  if context_did_setup then
    return
  end
  patch_context_render_once()
  require("treesitter-context").setup({
    enable = true,
    max_lines = 0,
    line_numbers = true,
    multiline_threshold = 20,
    mode = "cursor",
  })
  context_did_setup = true
end

local function ensure_treesitter_for_buffer(bufnr)
  bufnr = bufnr or vim.api.nvim_get_current_buf()
  if not vim.api.nvim_buf_is_valid(bufnr) or vim.bo[bufnr].buftype ~= "" then
    return
  end

  local filetype = vim.bo[bufnr].filetype
  if filetype == "" then
    return
  end

  local lang = vim.treesitter.language.get_lang(filetype)
  if not lang or not TS_PARSERS[lang] then
    return
  end

  if not setup_treesitter_once() or not ts_parsers or not ts_parsers[lang] then
    return
  end

  setup_context_once()

  local ok = vim.treesitter.language.add(lang)
  if not ok then
    vim.notify_once(
      "nvim-treesitter: missing parser for " .. lang .. "; install manually with :TSInstall " .. lang,
      vim.log.levels.WARN
    )
  end
end

vim.api.nvim_create_autocmd("FileType", {
  desc = "Enable sticky context for supported treesitter parsers",
  group = vim.api.nvim_create_augroup("user.treesitter_install", { clear = true }),
  callback = function(args)
    ensure_treesitter_for_buffer(args.buf)
  end,
})

vim.schedule(function()
  ensure_treesitter_for_buffer(0)
end)

M.ensure_for_buffer = ensure_treesitter_for_buffer

return M
