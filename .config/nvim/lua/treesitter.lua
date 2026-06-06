-- Treesitter parsers for sticky context only; Vim syntax/highlighting stays native.
-- Requires `tree-sitter` on PATH.

local env = require("env")

local M = {}

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
