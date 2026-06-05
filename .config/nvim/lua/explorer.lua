-- File explorer and finder setup.
-- fzf-lua setup intentionally lives here and is consumed lazily by lsp.lua pickers.

local workspace = require("workspace")

local M = {}

local function should_oil_hijack_dir()
  if workspace.will_restore_session() then
    return false
  end
  return vim.fn.argc() == 1 and vim.fn.isdirectory(vim.fn.argv(0)) == 1
end

-- oil.nvim — default dir handler (`nvim ./dir`, yazi → dir)
require("oil").setup({
  default_file_explorer = should_oil_hijack_dir(),
  delete_to_trash = true,
  view_options = {
    show_hidden = true,
    case_insensitive = true,
  },
  columns = {
    "icon",
    "size",
    "mtime",
  },
  lsp_file_methods = {
    autosave_changes = true,
  },
  keymaps = {
    ["<Esc>"] = "actions.close",
    q = "actions.close",
  },
})

-- nvim-tree — floating tree explorer (<leader>e)
local function nvim_tree_float_config()
  local width = 40
  local height = math.min(vim.o.lines - 6, 35)

  return {
    relative = "editor",
    border = "rounded",
    width = width,
    height = height,
    row = 1,
    col = 0,
  }
end

require("nvim-tree").setup({
  disable_netrw = false,
  hijack_netrw = false,
  hijack_directories = {
    enable = false,
  },
  view = {
    width = 30,
    signcolumn = "no",
    float = {
      enable = true,
      quit_on_focus_loss = true,
      open_win_config = nvim_tree_float_config,
    },
  },
  renderer = {
    group_empty = true,
  },
})

vim.keymap.set("n", "<leader>e", function()
  require("nvim-tree.api").tree.toggle({
    find_file = true,
    focus = true,
  })
end, { desc = "Toggle file explorer (nvim-tree)" })

vim.keymap.set("n", "<leader>E", function()
  local buf_name = vim.api.nvim_buf_get_name(0)
  if buf_name ~= "" and vim.fn.filereadable(buf_name) == 1 then
    require("oil").open(vim.fn.fnamemodify(buf_name, ":p:h"))
  else
    require("oil").open(vim.uv.cwd())
  end
end, { desc = "Oil explorer (dir of active file, else cwd)" })

-- Finders
require("fzf-lua").setup({
  keymap = {
    builtin = {
      ["<C-d>"] = "preview-page-down",
      ["<C-u>"] = "preview-page-up",
    },
  },
  winopts = {
    preview = {
      winopts = {
        number = true,
        relativenumber = false,
      },
    },
  },
})

require("fff").setup({
  prompt = "Files> ",
  max_results = 30,
  preview = {
    enabled = true,
    line_numbers = true,
  },
  keymaps = {
    close = "<Esc>",
    select = "<CR>",
    select_split = "<C-s>",
    select_vsplit = "<C-v>",
    -- select_tab = '<C-t>',

    -- === Make Ctrl+j / Ctrl+k work like in mini.pick ===
    move_up = { "<Up>", "<C-p>", "<C-k>" },
    move_down = { "<Down>", "<C-n>", "<C-j>" },
  },
})

-- Finders - Project-wise
vim.keymap.set("n", "<leader>f", function()
  require("fff").find_files()
end, { desc = "Find files in project (fff)" })

vim.keymap.set("n", "<leader>/", function()
  require("fff").live_grep()
end, { desc = "Grep in project (fzf-lua)" })

vim.keymap.set("n", "<leader>,", function()
  require("mini.pick").builtin.buffers()
end, { desc = "Find open buffers" })

-- Finders - Global
vim.keymap.set("n", "<leader>F", function()
  require("fzf-lua").files({
    cwd = vim.fn.expand("~"),
    prompt = "Global Files> ",
    winopts = { preview = { vertical = "up:45%" } },
  })
end, { desc = "Find files anywhere (global)" })

vim.keymap.set("n", "<leader>?", function()
  require("fzf-lua").live_grep({
    cwd = vim.fn.expand("~"),
    prompt = "Global Grep> ",
    winopts = { preview = { vertical = "up:45%" } },
    path_display = { "absolute" },
  })
end, { desc = "Grep anywhere (global)" })

-- Recent files; uses v:oldfiles via fzf-lua — no extra plugin
vim.keymap.set("n", "<leader>r", function()
  require("fzf-lua").oldfiles({
    prompt = "Recent> ",
    winopts = { preview = { vertical = "up:45%" } },
  })
end, { desc = "Recent files" })

return M
