-- Treesitter parsers for sticky context only; Vim syntax/highlighting stays native.
-- Requires `tree-sitter` on PATH.

local M = {}

local NVIM_TS_REPO = "https://github.com/nvim-treesitter/nvim-treesitter"

local TS_PARSERS = {
  "lua",
  "python",
  "rust",
  "zig",
  "bash",
  "yaml",
  "toml",
  "json",
  "markdown",
  "dockerfile",
  "typescript",
  "javascript",
  "css",
  "html",
}

--- vim.pack clones legacy master; re-clone main when the plugin dir is missing or corrupt.
local function ensure_nvim_treesitter_plugin()
  local dir = vim.fn.stdpath("data") .. "/site/pack/core/opt/nvim-treesitter"
  local init_lua = dir .. "/lua/nvim-treesitter/init.lua"

  if vim.fn.filereadable(init_lua) == 1 then
    return true
  end

  if vim.fn.isdirectory(dir) == 1 then
    vim.fn.delete(dir, "rf")
  end

  local clone = vim
    .system({
      "git",
      "clone",
      "--depth",
      "1",
      "--branch",
      "main",
      NVIM_TS_REPO,
      dir,
    }, { text = true })
    :wait()

  if clone.code ~= 0 or vim.fn.filereadable(init_lua) ~= 1 then
    vim.notify(
      "nvim-treesitter: failed to install plugin — " .. (clone.stderr or clone.stdout or "unknown error"),
      vim.log.levels.ERROR
    )
    return false
  end

  package.loaded["nvim-treesitter"] = nil
  vim.cmd("packadd nvim-treesitter")
  return true
end

local function setup_treesitter()
  for _, brew_bin in ipairs({ "/opt/homebrew/bin", "/usr/local/bin" }) do
    if vim.fn.isdirectory(brew_bin) == 1 and not vim.env.PATH:find(brew_bin, 1, true) then
      vim.env.PATH = brew_bin .. ":" .. vim.env.PATH
    end
  end

  if not ensure_nvim_treesitter_plugin() then
    return
  end

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

  ts.install(TS_PARSERS)

  local ts_parsers = require("nvim-treesitter.parsers")

  vim.api.nvim_create_autocmd("FileType", {
    desc = "Install treesitter parser on demand when missing",
    group = vim.api.nvim_create_augroup("user.treesitter_install", { clear = true }),
    callback = function(args)
      if vim.bo[args.buf].buftype ~= "" then
        return
      end
      local lang = vim.treesitter.language.get_lang(vim.bo[args.buf].filetype)
      if not lang or not ts_parsers[lang] then
        return
      end
      ts.install({ lang })
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

return M
