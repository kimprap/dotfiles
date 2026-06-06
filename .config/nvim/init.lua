-- Disable netrw before explorer plugins load.
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

vim.pack.add({
  -- Theme
  { src = "https://github.com/sainnhe/sonokai.git" },

  -- Core
  { src = "https://github.com/echasnovski/mini.nvim", version = "stable" },

  -- File Explorer
  { src = "https://github.com/stevearc/oil.nvim" },
  { src = "https://github.com/nvim-tree/nvim-tree.lua" },

  -- Finders
  { src = "https://github.com/ibhagwan/fzf-lua" },
  { src = "https://github.com/dmtrKovalenko/fff.nvim" },

  -- Tabs + Git + UI decorations
  { src = "https://github.com/nvim-tree/nvim-web-devicons" },
  { src = "https://github.com/romgrk/barbar.nvim" },
  { src = "https://github.com/lewis6991/gitsigns.nvim" },
  { src = "https://github.com/esmuellert/codediff.nvim" },
  { src = "https://github.com/hedyhli/outline.nvim" },
  { src = "https://github.com/petertriho/nvim-scrollbar" },
  { src = "https://github.com/karb94/neoscroll.nvim" },

  -- Treesitter parsers + sticky context.
  { src = "https://github.com/nvim-treesitter/nvim-treesitter" },
  { src = "https://github.com/nvim-treesitter/nvim-treesitter-context" },

  -- LSP + completion
  { src = "https://github.com/saghen/blink.cmp", version = "v1" },
  { src = "https://github.com/stevearc/conform.nvim" },
  { src = "https://github.com/mason-org/mason.nvim" },
  { src = "https://github.com/WhoIsSethDaniel/mason-tool-installer.nvim" },
})

vim.g.mapleader = " "
vim.g.maplocalleader = " "

require("map")
require("workspace")
local mini = require("mini")

require("options")
mini.setup_core()

require("explorer")
require("git")
require("sessions")
require("buffers")
require("ui")
require("keymaps")

require("outline")

require("treesitter")

require("lsp")
mini.setup_statusline()

-- Configure key hints last so buffer-local LSP maps are included.
mini.setup_clue()

-- Sourcing $MYVIMRC re-enables hlsearch; @/ keeps the last pattern → highlights return.
-- Clear visuals after load (pattern stays for n/N/cgn). <leader>c does the same on demand.
vim.cmd.nohlsearch()
require("ui").refresh_search_scrollbar()
