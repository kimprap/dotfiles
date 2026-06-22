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

local function setup_treesitter()
  env.prepend_existing_path("/usr/local/bin")
  env.prepend_existing_path("/opt/homebrew/bin")

  local ts = require("nvim-treesitter")
  ts.setup({ install_dir = vim.fn.stdpath("data") .. "/site" })

  if type(ts.install) ~= "function" then
    vim.notify_once(
      "nvim-treesitter: stale install at site/pack/core/opt/nvim-treesitter — remove dir and restart",
      vim.log.levels.ERROR
    )
    return
  end

  if vim.fn.executable("tree-sitter") ~= 1 then
    vim.notify_once(
      "nvim-treesitter: run `brew install tree-sitter-cli` for sticky-context parsers",
      vim.log.levels.WARN
    )
    return
  end

  local ts_parsers = require("nvim-treesitter.parsers")

  vim.api.nvim_create_autocmd("FileType", {
    desc = "Warn when treesitter parser is missing",
    group = vim.api.nvim_create_augroup("user.treesitter_install", { clear = true }),
    callback = function(args)
      if vim.bo[args.buf].buftype ~= "" then
        return
      end
      local lang = vim.treesitter.language.get_lang(vim.bo[args.buf].filetype)
      if not lang or not TS_PARSERS[lang] or not ts_parsers[lang] then
        return
      end
      local ok = vim.treesitter.language.add(lang)
      if not ok then
        vim.notify_once(
          "nvim-treesitter: missing parser for " .. lang .. "; install manually with :TSInstall " .. lang,
          vim.log.levels.WARN
        )
      end
    end,
  })
end

setup_treesitter()

require("treesitter-context").setup({
  enable = true,
  max_lines = 0,
  line_numbers = true,
  multiline_threshold = 20,
  mode = "cursor",
})

-- Reserve the rightmost column for nvim-scrollbar (right_align extmarks) under
-- sticky context. The context float is full-width with no upstream option, so we
-- post-shrink it by 1 column after each render.open.
local CONTEXT_MARKER = "treesitter_context"
local RESERVE_COLS = 1

local render = require("treesitter-context.render")
local orig_open = render.open
render.open = function(winid, ctx_ranges, ctx_lines, force_hl_update)
  orig_open(winid, ctx_ranges, ctx_lines, force_hl_update)
  vim.schedule(function()
    if not vim.api.nvim_win_is_valid(winid) then return end
    local gutter = vim.fn.getwininfo(winid)[1].textoff or 0
    local target = math.max(1, vim.api.nvim_win_get_width(winid) - gutter - RESERVE_COLS)
    for _, w in ipairs(vim.api.nvim_list_wins()) do
      if vim.api.nvim_win_is_valid(w) then
        local ok, is_ctx = pcall(function()
          return vim.w[w][CONTEXT_MARKER]
        end)
        if ok and is_ctx then
          local cfg = vim.api.nvim_win_get_config(w)
          if cfg.relative == "win" and cfg.win == winid
              and (cfg.width or 0) > 1 and cfg.width ~= target then
            cfg.width = target
            pcall(vim.api.nvim_win_set_config, w, cfg)
          end
        end
      end
    end
  end)
end

return M
