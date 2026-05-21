-- ============================================
-- Plugins
-- ============================================
vim.pack.add({
  -- Theme (uncomment when ready)
  { src = "https://github.com/sainnhe/sonokai.git" },

  -- Core
  { src = "https://github.com/echasnovski/mini.nvim", version = "stable" },

  -- File Explorer
  { src = "https://github.com/stevearc/oil.nvim" },

  -- Finders
  { src = "https://github.com/ibhagwan/fzf-lua" },
  { src = "https://github.com/dmtrKovalenko/fff.nvim" },
})


-- ============================================
-- Section 1: Core Foundation
-- ============================================
-- vim.cmd.colorscheme("cyberdream")
vim.g.sonokai_style = "maia"          -- "andromeda", "atlantis", "espresso", "maia", "shusia"
vim.g.sonokai_enable_italic = 1
vim.cmd.colorscheme("sonokai")

vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Core options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.cursorline = true
vim.opt.wrap = false
vim.opt.scrolloff = 8
vim.opt.sidescrolloff = 8

vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.autoindent = true

vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.hlsearch = true
vim.opt.incsearch = true

vim.opt.signcolumn = "yes"
vim.opt.list = true
vim.opt.listchars = vim.opt.listchars + "space:·"
vim.opt.completeopt = "menuone,noinsert,noselect"
vim.opt.backspace = "indent,eol,start"
vim.opt.termguicolors = true
vim.opt.splitbelow = true
vim.opt.splitright = true
vim.opt.undofile = true
vim.opt.swapfile = false
vim.opt.backup = false
vim.opt.updatetime = 300
vim.opt.timeoutlen = 500
vim.opt.clipboard = "unnamedplus"
vim.opt.mouse = "a"
vim.opt.fillchars = { eob = " " }
vim.opt.iskeyword:append("-")  -- Treat dash as part of a word (very useful for kebab-case, CSS, etc.)
vim.opt.path:append("**")  -- Search in subdirectories with :find and gf
vim.opt.encoding = "utf-8"
vim.opt.endofline = true
vim.opt.fixendofline = true

-- Find and replace optimized
vim.opt.inccommand = "split"
vim.keymap.set("n", "*", "*<C-o>", { desc = "Search word under cursor (stay in place)" })
vim.keymap.set("n", "#", "#<C-o>", { desc = "Search word under cursor backward (stay in place)" })
vim.keymap.set("n", "g*", "g*<C-o>", { desc = "Search partial word (stay in place)" })
vim.keymap.set("n", "g#", "g#<C-o>", { desc = "Search word under cursor backward (stay in place)" })

-- ruler only in normal code files, hidden otherwise
vim.api.nvim_create_autocmd({ "BufWinEnter", "FileType" }, {
  callback = function()
    local bt = vim.bo.buftype
    local ft = vim.bo.filetype

    if bt == "" and ft ~= "" and ft ~= "fzf" then
      vim.opt_local.colorcolumn = "120"
    else
      vim.opt_local.colorcolumn = ""
    end
  end,
})

-- Remove trailing whitespace on save (VSCode-like behavior)
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = "*",
  callback = function()
    -- Save cursor position
    local cursor_pos = vim.api.nvim_win_get_cursor(0)

    -- Remove trailing whitespace
    vim.cmd([[silent! %s/\s\+$//e]])

    -- Add final newline only if missing (safe method)
    if vim.fn.getline("$") ~= "" then
      vim.fn.append("$", "")
    end

    -- Restore cursor position
    vim.api.nvim_win_set_cursor(0, cursor_pos)
  end,
})


-- ============================================
-- mini.nvim
-- ============================================
require("mini.basics").setup({
  options = { basic = true },
  mappings = { basic = true },
  autocommands = { basic = true },
})

require("mini.pairs").setup()           -- auto close brackets/quotes
require("mini.comment").setup()         -- gc to comment
require("mini.surround").setup()        -- ys, ds, cs for surrounding
require("mini.cursorword").setup()      -- highlight word under cursor

require("mini.indentscope").setup({
  symbol = "│",
  options = {
    try_as_border = true,
  },
  draw = {
    delay = 0,
    animation = require("mini.indentscope").gen_animation.none(),
  },
})

require("mini.pick").setup({
  mappings = {
    move_down = "<C-j>",
    move_up   = "<C-k>",
  },
})

require("mini.move").setup({
  mappings = {
    left = "<M-h>",
    right = "<M-l>",
    down = "<M-j>",
    up = "<M-k>",
    line_left = "<M-h>",
    line_right = "<M-l>",
    line_down = "<M-j>",
    line_up = "<M-k>",
  },
})

require("mini.icons").setup()
MiniIcons.tweak_lsp_kind()

-- ============================================
-- Section 2: Basic Keymaps + Motions + QOL
-- ============================================
local map = vim.keymap.set

-- Clear search highlight
map("n", "<leader>c", ":noh<CR>", { desc = "Clear search highlight" })

-- Better window navigation
map("n", "<C-h>", "<C-w>h", { desc = "Go to left window" })
map("n", "<C-j>", "<C-w>j", { desc = "Go to lower window" })
map("n", "<C-k>", "<C-w>k", { desc = "Go to upper window" })
map("n", "<C-l>", "<C-w>l", { desc = "Go to right window" })

-- Indent and keep visual selection
map("v", ">", ">gv", { desc = "Indent right and keep selection" })
map("v", "<", "<gv", { desc = "Indent left and keep selection" })

-- Centering - never truly at top/bottom of screen
map("n", "G", "Gzz", { desc = "Go to bottom + center" })
map("n", "gg", "ggzz", { desc = "Go to top + center" })
map("n", "n", "nzzzv", { desc = "Next search result (centered)" })
map("n", "N", "Nzzzv", { desc = "Previous search result (centered)" })
map("n", "<C-d>", "<C-d>zz", { desc = "Half page down (centered)" })
map("n", "<C-u>", "<C-u>zz", { desc = "Half page up (centered)" })

-- Paste / Delete without yanking (black hole register)
map({ "n", "v" }, "<leader>x", '"_d', { desc = "Delete without yanking" })
map("x", "<leader>p", '"_dP', { desc = "Paste without yanking" })

-- Highlight yanked text
vim.api.nvim_create_autocmd("TextYankPost", {
  desc = "Highlight yanked text",
  callback = function()
    vim.highlight.on_yank({ timeout = 200 })
  end,
})


-- ─────────────────────────────────────────────
-- Restore cursor position when reopening a file
-- ─────────────────────────────────────────────
vim.api.nvim_create_autocmd("BufReadPost", {
  desc = "Restore cursor position",
  callback = function()
    local mark = vim.api.nvim_buf_get_mark(0, '"')
    local lcount = vim.api.nvim_buf_line_count(0)
    if mark[1] > 0 and mark[1] <= lcount then
      vim.api.nvim_win_set_cursor(0, mark)
    end
  end,
})


-- ─────────────────────────────────────────────
-- Improved join lines (keeps cursor position)
-- ─────────────────────────────────────────────
map("n", "J", "mzJ`z", { desc = "Join lines and keep cursor position" })
map("v", "J", "Jgv", { desc = "Join selected lines and reselect" })


-- ─────────────────────────────────────────────
-- Quick save
-- ─────────────────────────────────────────────
map("n", "<leader>w", ":w<CR>", { desc = "Save file" })
map("n", "<leader>q", ":q<CR>", { desc = "Quit" })


-- ============================================
-- Section 3: File Explorer + Finder
-- ============================================
-- Primary File Explorer: oil.nvim
require("oil").setup({
  default_file_explorer = true,
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
  }
})

vim.keymap.set("n", "<leader>E", function()
  require("oil").open()
end, { desc = "Open file explorer (full screen)" })

-- Secondary: mini.files (popup style)
local MiniFiles = require("mini.files")
MiniFiles.setup({
  windows = {
    preview = true,
    width_focus = 35,
    width_preview = 50,
  },
})

vim.keymap.set("n", "<leader>e", function()
  MiniFiles.open(vim.api.nvim_buf_get_name(0), true)
end, { desc = "File Explorer (mini.files)" })

vim.api.nvim_create_autocmd("User", {
  pattern = "MiniFilesBufferCreate",
  callback = function(args)
    local buf_id = args.data.buf_id
    vim.opt_local.colorcolumn = ""

    -- Close with <Esc> (in addition to q)
    vim.keymap.set("n", "<Esc>", MiniFiles.close, { buffer = buf_id, desc = "Close explorer" })

    -- CRUD (wrapped for reliability)
    vim.keymap.set("n", "a", function() MiniFiles.create() end,        { buffer = buf_id, desc = "Create file/folder" })
    vim.keymap.set("n", "r", function() MiniFiles.rename() end,       { buffer = buf_id, desc = "Rename" })
    vim.keymap.set("n", "d", function() MiniFiles.delete() end,       { buffer = buf_id, desc = "Delete (with confirm)" })

    -- Navigation
    vim.keymap.set("n", "h", function() MiniFiles.go_out() end,       { buffer = buf_id, desc = "Go to parent dir" })

    vim.keymap.set("n", "l", function()
      MiniFiles.go_in({ close_on_file = true })
    end, { buffer = buf_id, desc = "Go in / Open file (close explorer)" })

    vim.keymap.set("n", "<CR>", function()
      MiniFiles.go_in({ close_on_file = true })
    end, { buffer = buf_id, desc = "Go in / Open file (close explorer)" })
  end,
})

-- Finders
require("fzf-lua").setup()

require("fff").setup({
  prompt = "Files> ",
  max_results = 30,
  preview = {
    enabled = true,
  },
  keymaps = {
    close = '<Esc>',
    select = '<CR>',
    select_split = '<C-s>',
    select_vsplit = '<C-v>',
    -- select_tab = '<C-t>',

    -- === Make Ctrl+j / Ctrl+k work like in mini.pick ===
    move_up   = { '<Up>', '<C-p>', '<C-k>' },
    move_down = { '<Down>', '<C-n>', '<C-j>' },
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


-- ============================================================
-- Phase 4: Tabs & Buffer Management
-- ============================================================

-- Clean buffer tabline (shows open buffers like VSCode tabs)
require('mini.tabline').setup()

-- Buffer navigation with <Tab> / <S-Tab> (as planned)
vim.keymap.set('n', '<Tab>', '<cmd>bnext<CR>', { desc = 'Next buffer' })
vim.keymap.set('n', '<S-Tab>', '<cmd>bprevious<CR>', { desc = 'Previous buffer' })
vim.keymap.set("n", "<leader>`", "<C-^>", { desc = "Toggle last buffer" })

-- Better buffer closing (keeps your window layout)
require('mini.bufremove').setup()

vim.keymap.set('n', '<leader>q', function()
  require('mini.bufremove').delete(0, false)
end, { desc = 'Delete buffer (keep layout)' })

vim.keymap.set('n', '<leader>Q', function()
  require('mini.bufremove').delete(0, true)
end, { desc = 'Force delete buffer' })

-- Reopen last closed buffer (like Ctrl+Shift+T in VSCode / browsers)
local closed_buffers = {}

vim.api.nvim_create_autocmd("BufDelete", {
  desc = "Remember recently closed buffers so we can reopen them",
  callback = function(args)
    local name = vim.api.nvim_buf_get_name(args.buf)
    if name ~= "" and vim.fn.filereadable(name) == 1 then
      table.insert(closed_buffers, 1, name)
      if #closed_buffers > 8 then
        table.remove(closed_buffers)
      end
    end
  end,
})

vim.keymap.set('n', '<leader>T', function()
  if #closed_buffers == 0 then
    vim.notify("No recently closed buffers to reopen", vim.log.levels.WARN)
    return
  end
  vim.cmd.edit(closed_buffers[1])
  table.remove(closed_buffers, 1)
end, { desc = 'Reopen last closed buffer' })

