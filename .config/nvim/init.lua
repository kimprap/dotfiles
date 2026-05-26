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

local function search_word_stay(backward, partial)
  local pos = vim.fn.getpos(".")
  local cmd = (partial and (backward and "g#" or "g*") or (backward and "#" or "*"))
  vim.cmd("keepjumps normal! " .. cmd)
  vim.fn.setpos(".", pos)
end

vim.keymap.set("n", "*", function() search_word_stay(false, false) end, { desc = "Search word (stay in place)" })
vim.keymap.set("n", "#", function() search_word_stay(true, false) end, { desc = "Search word backward (stay in place)" })
vim.keymap.set("n", "g*", function() search_word_stay(false, true) end, { desc = "Search partial word (stay in place)" })
vim.keymap.set("n", "g#", function() search_word_stay(true, true) end, { desc = "Search partial word backward (stay in place)" })

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
map("n", "<leader>W", ":wq<CR>", { desc = "Save and quit" })
map("n", "<leader>q", ":q<CR>", { desc = "Quit window" })
map("n", "<leader>Q", ":q!<CR>", { desc = "Quit without saving" })

-- Copy paths from the active buffer (no explorer needed; like VSCode "Copy Path")
map("n", "<leader>yp", function()
  local path = vim.api.nvim_buf_get_name(0)
  if path == "" then
    vim.notify("Not a file on disk", vim.log.levels.WARN)
    return
  end
  path = vim.fn.fnamemodify(path, ":p")
  vim.fn.setreg("+", path)
  vim.notify("Copied: " .. vim.fn.fnamemodify(path, ":~"), vim.log.levels.INFO)
end, { desc = "Copy absolute path of current file" })

map("n", "<leader>yd", function()
  local path = vim.api.nvim_buf_get_name(0)
  if path == "" then
    vim.notify("Not a file on disk", vim.log.levels.WARN)
    return
  end
  path = vim.fn.fnamemodify(path, ":p:h")
  vim.fn.setreg("+", path)
  vim.notify("Copied: " .. vim.fn.fnamemodify(path, ":~"), vim.log.levels.INFO)
end, { desc = "Copy directory of current file" })


-- ============================================
-- Section 3: File Explorer + Finder
-- ============================================
local function will_restore_session()
  local session_path = vim.fn.getcwd() .. "/Session.vim"
  if vim.fn.filereadable(session_path) ~= 1 then
    return false
  end
  if vim.fn.argc() == 0 then
    return true
  end
  if vim.fn.argc() == 1 and vim.fn.isdirectory(vim.fn.argv(0)) == 1 then
    return true
  end
  return false
end

-- oil.nvim — default dir handler (`nvim ./dir`, yazi → dir)
require("oil").setup({
  -- skip hijack when Session.vim will restore (otherwise oil wins over session)
  default_file_explorer = not will_restore_session(),
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

-- mini.files — popup explorer + reveal (<leader>e)
local MiniFiles = require("mini.files")

local function mini_files_anchor_path()
  local buf_name = vim.api.nvim_buf_get_name(0)
  if buf_name ~= "" and vim.fn.filereadable(buf_name) == 1 then
    return buf_name
  end
  local dir_name = vim.fn.fnamemodify(buf_name, ":p:h")
  if vim.fn.isdirectory(dir_name) == 1 then
    return dir_name
  end
  return vim.uv.cwd()
end

-- VSCode-style: toggle closed; when opening, reveal active file in its dir branch
local function mini_files_toggle_reveal()
  if MiniFiles.close() then
    return
  end
  MiniFiles.open(mini_files_anchor_path(), false)
end

MiniFiles.setup({
  options = {
    use_as_default_explorer = false,
    permanent_delete = false,
  },
  mappings = {
    go_in = "", -- custom `l` = directories only; default `L` = go_in_plus
    synchronize = "", -- use :w / :write in minifiles buffers instead of =
  },
  windows = {
    preview = true,
    width_focus = 35,
    width_preview = 50,
  },
})

vim.keymap.set("n", "<leader>e", mini_files_toggle_reveal, {
  desc = "Toggle file explorer (reveal active file)",
})

vim.keymap.set("n", "<leader>E", function()
  local buf_name = vim.api.nvim_buf_get_name(0)
  if buf_name ~= "" and vim.fn.filereadable(buf_name) == 1 then
    require("oil").open(vim.fn.fnamemodify(buf_name, ":p:h"))
  else
    require("oil").open(vim.uv.cwd())
  end
end, { desc = "Oil explorer (dir of active file, else cwd)" })

-- :w applies mini.files edits (same as former = / synchronize)
vim.api.nvim_create_autocmd("FileType", {
  pattern = "minifiles",
  callback = function(event)
    local buf_id = event.buf
    if vim.b[buf_id].minifiles_write_mapped then
      return
    end
    vim.b[buf_id].minifiles_write_mapped = true
    local sync = function()
      MiniFiles.synchronize()
    end
    vim.api.nvim_buf_create_user_command(buf_id, "Write", sync, {})
    vim.api.nvim_buf_create_user_command(buf_id, "W", sync, {})
  end,
})

vim.api.nvim_create_autocmd("User", {
  pattern = "MiniFilesBufferCreate",
  callback = function(args)
    vim.opt_local.colorcolumn = ""
    vim.keymap.set("n", "<Esc>", MiniFiles.close, {
      buffer = args.data.buf_id,
      desc = "Close explorer",
    })
    local buf_id = args.data.buf_id
    local function minifiles_move(delta)
      local lnum = vim.api.nvim_win_get_cursor(0)[1]
      local last = vim.api.nvim_buf_line_count(buf_id)
      if last < 1 then
        return
      end
      local n = lnum + delta
      if n > last then
        n = 1
      elseif n < 1 then
        n = last
      end
      vim.api.nvim_win_set_cursor(0, { n, 0 })
    end

    vim.keymap.set("n", "j", function() minifiles_move(1) end, { buffer = buf_id, desc = "Next entry (wrap)" })
    vim.keymap.set("n", "k", function() minifiles_move(-1) end, { buffer = buf_id, desc = "Previous entry (wrap)" })

    vim.keymap.set("n", "l", function()
      local entry = MiniFiles.get_fs_entry()
      if entry and entry.fs_type == "directory" then
        MiniFiles.go_in()
      end
    end, { buffer = buf_id, desc = "Enter directory only" })

    vim.keymap.set("n", "<CR>", function()
      MiniFiles.go_in({ close_on_file = true })
    end, { buffer = buf_id, desc = "Open file / enter dir (close on file)" })
  end,
})

-- mini.files has no macOS Trash API; bridge its trash dir → ~/.Trash (Finder)
if vim.fn.has("mac") == 1 then
  local function move_to_macos_trash(path)
    local trash_dir = vim.fn.expand("~/.Trash")
    local basename = vim.fn.fnamemodify(path, ":t")
    local dest = trash_dir .. "/" .. basename
    if vim.fn.filereadable(dest) == 1 or vim.fn.isdirectory(dest) == 1 then
      basename = basename .. os.date(" %Y-%m-%dT%H-%M-%S")
      dest = trash_dir .. "/" .. basename
    end
    if vim.fn.rename(path, dest) ~= 0 then
      vim.notify("Failed to move to Trash: " .. path, vim.log.levels.ERROR)
    end
  end

  vim.api.nvim_create_autocmd("User", {
    pattern = "MiniFilesActionDelete",
    callback = function(event)
      local to = event.data.to
      if to and (vim.fn.filereadable(to) == 1 or vim.fn.isdirectory(to) == 1) then
        move_to_macos_trash(to)
      end
    end,
  })
end

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

-- Restore open buffers per project (VSCode-like; bare `nvim` in project dir)
vim.o.sessionoptions = "buffers,curdir,tabpages,winsize,globals,blank"

local function is_oil_or_dir_buffer(buf)
  if not vim.api.nvim_buf_is_valid(buf) then
    return false
  end
  if vim.bo[buf].filetype == "oil" then
    return true
  end
  if vim.bo[buf].buftype ~= "" then
    return false
  end
  local name = vim.api.nvim_buf_get_name(buf)
  return name ~= "" and vim.fn.isdirectory(vim.fn.fnamemodify(name, ":p")) == 1
end

local function sessions_strip_oil_buffers()
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if is_oil_or_dir_buffer(buf) then
      pcall(vim.api.nvim_buf_delete, buf, { force = true })
    end
  end
end

-- `nvim .` puts the dir on the arglist; mksession persists it as $argadd → oil on restore
local function sessions_strip_dir_args()
  for i = vim.fn.argc() - 1, 0, -1 do
    if vim.fn.isdirectory(vim.fn.fnamemodify(vim.fn.argv(i), ":p")) == 1 then
      vim.cmd("silent " .. (i + 1) .. "argdelete")
    end
  end
end

local function sessions_refresh_buffer_syntax(buf)
  if not vim.api.nvim_buf_is_valid(buf) or not vim.api.nvim_buf_is_loaded(buf) then
    return
  end
  if vim.bo[buf].buftype ~= "" or vim.api.nvim_buf_get_name(buf) == "" then
    return
  end
  if vim.bo[buf].filetype == "" then
    vim.api.nvim_buf_call(buf, function()
      vim.cmd("filetype detect")
    end)
  end
  if vim.bo[buf].filetype ~= "" and vim.bo[buf].syntax == "" then
    vim.bo[buf].syntax = vim.bo[buf].filetype
  end
end

local function sessions_post_read()
  sessions_strip_oil_buffers()
  -- mksession restores the active buffer but often leaves syntax unset
  vim.schedule(function()
    vim.cmd("syntax enable")
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      sessions_refresh_buffer_syntax(buf)
    end
  end)
end

require("mini.sessions").setup({
  autoread = false, -- custom VimEnter below (handles `nvim .` too)
  autowrite = true,
  file = "Session.vim", -- project root; add "Session.vim" to .gitignore
  hooks = {
    pre = {
      write = function()
        sessions_strip_oil_buffers()
        sessions_strip_dir_args()
      end,
    },
    post = {
      read = sessions_post_read,
    },
  },
})

vim.api.nvim_create_autocmd("VimEnter", {
  desc = "Restore Session.vim when opening bare nvim or nvim <dir>",
  once = true,
  callback = function()
    if not will_restore_session() then
      return
    end
    pcall(MiniSessions.read, MiniSessions.config.file, { force = true, verbose = false })
  end,
})

vim.api.nvim_create_autocmd("VimLeavePre", {
  desc = "Always update project Session.vim on quit",
  callback = function()
    if MiniSessions.config.file == "" then
      return
    end
    pcall(MiniSessions.write, MiniSessions.config.file, { force = true, verbose = false })
  end,
})

-- Clean buffer tabline (shows open buffers like VSCode tabs)
require("mini.tabline").setup()

-- Buffer navigation with <Tab> / <S-Tab> (as planned)
vim.keymap.set('n', '<Tab>', '<cmd>bnext<CR>', { desc = 'Next buffer' })
vim.keymap.set('n', '<S-Tab>', '<cmd>bprevious<CR>', { desc = 'Previous buffer' })
vim.keymap.set("n", "<leader>`", "<C-^>", { desc = "Toggle last buffer" })

-- Better buffer closing (keeps your window layout)
require('mini.bufremove').setup()

vim.keymap.set("n", "<C-q>", function()
  require("mini.bufremove").delete(0, false)
end, { desc = "Delete buffer (keep layout)" })

vim.keymap.set("n", "<C-Q>", function()
  require("mini.bufremove").delete(0, true)
end, { desc = "Force delete buffer" })

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

