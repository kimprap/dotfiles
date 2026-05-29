-- ============================================
-- Plugins
-- ============================================
-- oil + mini.files replace netrw; avoid ghost dir buffers on `nvim .`
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

vim.pack.add({
  -- Theme (uncomment when ready)
  { src = "https://github.com/sainnhe/sonokai.git" },

  -- Core
  { src = "https://github.com/echasnovski/mini.nvim",      version = "stable" },

  -- File Explorer
  { src = "https://github.com/stevearc/oil.nvim" },

  -- Finders
  { src = "https://github.com/ibhagwan/fzf-lua" },
  { src = "https://github.com/dmtrKovalenko/fff.nvim" },

  -- Tabs + Git + UI decorations
  { src = "https://github.com/nvim-tree/nvim-web-devicons" },
  { src = "https://github.com/romgrk/barbar.nvim" },
  { src = "https://github.com/lewis6991/gitsigns.nvim" },
  { src = "https://github.com/hedyhli/outline.nvim" },
  { src = "https://github.com/petertriho/nvim-scrollbar" },

  -- LSP + completion
  { src = "https://github.com/saghen/blink.cmp",           version = "v1" },
  { src = "https://github.com/stevearc/conform.nvim" },
  { src = "https://github.com/mason-org/mason.nvim" },
})


-- ============================================
-- Section 1: Core Foundation
-- ============================================
vim.g.sonokai_style = "maia" -- "andromeda", "atlantis", "espresso", "maia", "shusia"
vim.g.sonokai_enable_italic = 1
vim.cmd.colorscheme("sonokai")

vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Core options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.cursorline = true
vim.opt.cursorlineopt = "line"
-- Width for statuscolumn %%C (markers drawn in stc, not a separate foldcolumn gutter)
vim.opt.foldcolumn = "auto:1"
vim.opt.foldmethod = "expr"
vim.opt.foldexpr = "v:lua.vim.lsp.foldexpr()"
vim.opt.foldlevel = 99
vim.opt.foldminlines = 1
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

-- Line numbers, signs, fold +/- (%C = fold column in statuscolumn; not %S)
vim.opt.signcolumn = "yes:1"
vim.opt.statuscolumn = "%=%l %s "
vim.opt.list = true
vim.opt.listchars = vim.opt.listchars + "space:·"
vim.opt.completeopt = "menu,menuone,noselect"
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
vim.opt.iskeyword:append("-") -- Treat dash as part of a word (very useful for kebab-case, CSS, etc.)
vim.opt.path:append("**")     -- Search in subdirectories with :find and gf
vim.opt.encoding = "utf-8"
vim.opt.endofline = true
vim.opt.fixendofline = true

-- Find and replace optimized
vim.opt.inccommand = "split"

local function get_search_line_positions(bufnr)
  bufnr = bufnr or vim.api.nvim_get_current_buf()
  local pattern = vim.fn.getreg("/")
  if pattern == "" then
    return {}
  end
  local positions = {}
  local seen_lines = {}
  for lnum = 1, vim.api.nvim_buf_line_count(bufnr) do
    local line = (vim.api.nvim_buf_get_lines(bufnr, lnum - 1, lnum, false)[1] or "")
    local start = 0
    while true do
      local match = vim.fn.matchstrpos(line, pattern, start)
      if not match or match[2] < 0 then
        break
      end
      if not seen_lines[lnum] then
        seen_lines[lnum] = true
        positions[#positions + 1] = { lnum }
      end
      start = match[3]
    end
  end
  return positions
end

local function mark_text(config, mark_type, level)
  local text = config.marks[mark_type].text
  if type(text) == "table" then
    return text[level or 1] or text[1]
  end
  return text
end

local function refresh_search_scrollbar()
  if vim.bo.buftype ~= "" or not vim.api.nvim_buf_is_valid(0) then
    return
  end
  local render = require("scrollbar").throttled_render
  if vim.v.hlsearch ~= 1 or vim.fn.getreg("/") == "" then
    require("scrollbar.handlers").hide()
    pcall(render)
    return
  end
  vim.schedule(function()
    if not vim.api.nvim_buf_is_valid(0) or vim.bo.buftype ~= "" then
      return
    end
    require("scrollbar.handlers").show()
    pcall(render)
  end)
end

local function barbar_buffer_index(bufnr)
  return require("barbar.utils.list").index_of(require("barbar.state").buffers, bufnr)
end

local function barbar_move_buffer_to_index(bufnr, target_index)
  if not target_index then
    return
  end
  require("barbar.ui.render").update()
  local idx = barbar_buffer_index(bufnr)
  if not idx then
    return
  end
  local steps = target_index - idx
  if steps ~= 0 then
    require("barbar.api").move_buffer(bufnr, steps)
  end
end

local function search_word_stay(backward, partial)
  local pos = vim.fn.getpos(".")
  local cmd = (partial and (backward and "g#" or "g*") or (backward and "#" or "*"))
  vim.cmd("keepjumps normal! " .. cmd)
  vim.fn.setpos(".", pos)
  refresh_search_scrollbar()
end

vim.keymap.set("n", "*", function() search_word_stay(false, false) end, { desc = "Search word (stay in place)" })
vim.keymap.set("n", "#", function() search_word_stay(true, false) end, { desc = "Search word backward (stay in place)" })
vim.keymap.set("n", "g*", function() search_word_stay(false, true) end, { desc = "Search partial word (stay in place)" })
vim.keymap.set("n", "g#", function() search_word_stay(true, true) end,
  { desc = "Search partial word backward (stay in place)" })

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
    local undolevels = vim.bo.undolevels
    vim.bo.undolevels = -1
    local view = vim.fn.winsaveview()

    vim.cmd([[silent! keepjumps %s/\s\+$//e]])

    if vim.fn.getline("$") ~= "" then
      vim.fn.append(vim.fn.line("$"), "")
    end

    vim.fn.winrestview(view)
    vim.bo.undolevels = undolevels
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

require("mini.pairs").setup()      -- auto close brackets/quotes
require("mini.comment").setup()    -- gc to comment
require("mini.surround").setup()   -- ys, ds, cs for surrounding
require("mini.cursorword").setup() -- highlight word under cursor

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
  },
})

require("mini.icons").setup()
MiniIcons.tweak_lsp_kind()

-- ============================================
-- Section 2: Basic Keymaps + Motions + QOL
-- ============================================
local map = vim.keymap.set

-- Clear search highlight
map("n", "<leader>c", function()
  vim.cmd.nohlsearch()
  refresh_search_scrollbar()
end, { desc = "Clear search highlight" })

-- Window navigation (splits: <C-\> right, <C-w>s below; resize: <C-arrows>, equalize <C-S-=>)
map("n", "<C-h>", "<C-w>h", { desc = "Go to left window" })
map("n", "<C-j>", "<C-w>j", { desc = "Go to lower window" })
map("n", "<C-k>", "<C-w>k", { desc = "Go to upper window" })
map("n", "<C-l>", "<C-w>l", { desc = "Go to right window" })
map("n", "<C-\\>", "<C-w>v", { desc = "Split right" })
map("n", "<C-S-Left>", "<C-w><", { desc = "Narrower window" })
map("n", "<C-S-Right>", "<C-w>>", { desc = "Wider window" })
map("n", "<C-S-Up>", "<C-w>+", { desc = "Taller window" })
map("n", "<C-S-Down>", "<C-w>-", { desc = "Shorter window" })
map("n", "<C-S-=>", "<C-w>=", { desc = "Equalize window sizes" })

-- Quote "around" without trailing whitespace (Vim's a" includes it by design; 2i" does not)
for _, q in ipairs({ '"', "'", "`" }) do
  map({ "o", "x" }, "a" .. q, "2i" .. q, { remap = true, desc = "Around " .. q .. " (no trailing space)" })
end

-- Indent and keep visual selection
map("v", ">", ">gv", { desc = "Indent right and keep selection" })
map("v", "<", "<gv", { desc = "Indent left and keep selection" })

-- Centering - never truly at top/bottom of screen
map("n", "G", "Gzz", { desc = "Go to bottom + center" })
map("n", "gg", "ggzz", { desc = "Go to top + center" })
map("n", "n", "nzz", { desc = "Next search result (centered)" })
map("n", "N", "Nzz", { desc = "Previous search result (centered)" })
map("n", "<C-d>", "<C-d>zz", { desc = "Half page down (centered)" })
map("n", "<C-u>", "<C-u>zz", { desc = "Half page up (centered)" })

-- Paste / Delete without yanking (black hole register)
map({ "n", "v" }, "<leader>x", '"_d', { desc = "Delete without yanking" })
map("x", "<leader>p", '"_dP', { desc = "Paste without yanking" })

-- Highlight yanked text
vim.api.nvim_create_autocmd("TextYankPost", {
  desc = "Highlight yanked text",
  callback = function()
    vim.hl.on_yank({ timeout = 200 })
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
-- Quick save / buffers
-- ─────────────────────────────────────────────
require("mini.bufremove").setup()

-- Close editor: drop buffer from tabs; close orphan split panes; keep layout when buffer is duplicated
local function close_editor(force)
  local bufnr = vim.api.nvim_get_current_buf()
  local buftype = vim.bo[bufnr].buftype
  if buftype ~= "" and buftype ~= "acwrite" then
    if #vim.api.nvim_tabpage_list_wins(0) > 1 then
      vim.api.nvim_win_close(0, true)
    else
      pcall(vim.cmd, "bdelete!")
    end
    return
  end

  local tab_wins = vim.api.nvim_tabpage_list_wins(0)
  local buf_wins = vim.fn.win_findbuf(bufnr)

  -- Same buffer in multiple panes: remove buffer everywhere, keep all panes (swap to alt)
  if #buf_wins > 1 then
    require("mini.bufremove").delete(bufnr, force)
    return
  end

  -- Buffer only in this pane while other panes exist: close pane, then drop buffer
  if #tab_wins > 1 then
    vim.api.nvim_win_close(0, true)
    if vim.api.nvim_buf_is_valid(bufnr) then
      require("mini.bufremove").delete(bufnr, force)
    end
    return
  end

  require("mini.bufremove").delete(bufnr, force)
end

map("n", "<leader>w", ":w<CR>", { desc = "Save file" })
map("n", "<leader>W", ":wq<CR>", { desc = "Save and quit" })
map("n", "<leader>q", function() close_editor(false) end, { desc = "Close editor (split + buffer)" })
map("n", "<leader>Q", ":q!<CR>", { desc = "Quit without saving" })
map("n", "<leader>n", ":enew<CR>", { desc = "New empty buffer" })
map("n", "<A-z>", function()
  vim.wo.wrap = not vim.wo.wrap
end, { desc = "Toggle word wrap" })

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
-- Workspace helpers (shared with sessions below)
local WORKSPACE_MARKER = ".nvim/workspace"
local SESSION_FILE = ".nvim/Session.vim"

local function workspace_marker_path(dir)
  return (dir or vim.fn.getcwd()) .. "/" .. WORKSPACE_MARKER
end

local function session_file_path(dir)
  return (dir or vim.fn.getcwd()) .. "/" .. SESSION_FILE
end

local function local_session_name()
  return vim.fn.fnamemodify(SESSION_FILE, ":t")
end

local function is_workspace_dir(dir)
  return vim.fn.filereadable(workspace_marker_path(dir)) == 1
end

local function will_restore_session()
  if not is_workspace_dir() then
    return false
  end
  if vim.fn.filereadable(session_file_path()) ~= 1 then
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

local function should_oil_hijack_dir()
  if not is_workspace_dir() or will_restore_session() then
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

-- Sync pending CRUD (confirm dialog) then close; returns true/false/nil like close()
local function mini_files_close_sync()
  if MiniFiles.synchronize() == false then
    return false
  end
  return MiniFiles.close()
end

-- VSCode-style: toggle closed; when opening, reveal active file in its dir branch
local function mini_files_toggle_reveal()
  local closed = mini_files_close_sync()
  if closed ~= nil then
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
    go_in = "",       -- custom `l` = directories only; default `L` = go_in_plus
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
    vim.keymap.set("n", "<Esc>", mini_files_close_sync, {
      buffer = args.data.buf_id,
      desc = "Apply changes and close explorer",
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

-- Line numbers only on mini.files file preview pane (not directory columns)
local function minifiles_buf_path(buf_id)
  local name = vim.api.nvim_buf_get_name(buf_id)
  return name:match("^minifiles://%d+/(.+)$") or name
end

vim.api.nvim_create_autocmd("User", {
  pattern = "MiniFilesWindowUpdate",
  callback = function(args)
    local win_id = args.data.win_id
    local buf_id = args.data.buf_id
    if not win_id or not vim.api.nvim_win_is_valid(win_id) then
      return
    end
    local path = minifiles_buf_path(buf_id)
    local is_file_preview = path ~= "" and vim.fn.filereadable(path) == 1
    vim.wo[win_id].number = is_file_preview
    vim.wo[win_id].relativenumber = false
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
    close         = '<Esc>',
    select        = '<CR>',
    select_split  = '<C-s>',
    select_vsplit = '<C-v>',
    -- select_tab = '<C-t>',

    -- === Make Ctrl+j / Ctrl+k work like in mini.pick ===
    move_up       = { '<Up>', '<C-p>', '<C-k>' },
    move_down     = { '<Down>', '<C-n>', '<C-j>' },
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


-- ============================================================
-- Phase 4: Sessions, Starter, Tabs & Buffer Management
-- ============================================================
vim.o.sessionoptions = "buffers,curdir,tabpages,winsize,globals,blank"

local function is_oil_or_dir_buffer(buf)
  if not vim.api.nvim_buf_is_valid(buf) then
    return false
  end
  if vim.bo[buf].filetype == "oil" or vim.bo[buf].filetype == "netrw" then
    return true
  end
  if vim.bo[buf].buftype ~= "" then
    return false
  end
  local name = vim.api.nvim_buf_get_name(buf)
  if name == "" then
    return false
  end
  if name:match("^oil://") then
    return true
  end
  return vim.fn.isdirectory(vim.fn.fnamemodify(name, ":p")) == 1
end

local function sessions_strip_explorer_buffers()
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if is_oil_or_dir_buffer(buf) then
      pcall(vim.api.nvim_buf_delete, buf, { force = true })
    end
  end
end

-- `nvim .` / oil leave dirs on the arglist; mksession persists them → ghost explorer on restore
local function sessions_strip_dir_args()
  for i = vim.fn.argc() - 1, 0, -1 do
    local arg = vim.fn.argv(i)
    if arg:match("^oil://") or vim.fn.isdirectory(vim.fn.fnamemodify(arg, ":p")) == 1 then
      vim.cmd("silent " .. (i + 1) .. "argdelete")
    end
  end
end

local function sessions_cleanup_explorers()
  sessions_strip_dir_args()
  sessions_strip_explorer_buffers()
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
  sessions_cleanup_explorers()
  -- oil SessionLoadPost can finish loading after mini.sessions post hook
  vim.schedule(function()
    sessions_cleanup_explorers()
    vim.cmd("syntax enable")
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      sessions_refresh_buffer_syntax(buf)
    end
  end)
end

require("mini.sessions").setup({
  autoread = false, -- custom VimEnter below (handles `nvim .` too)
  autowrite = true,
  file = SESSION_FILE,
  hooks = {
    pre = {
      write = function()
        sessions_cleanup_explorers()
        vim.api.nvim_exec_autocmds("User", { pattern = "SessionSavePre" })
      end,
    },
    post = {
      read = sessions_post_read,
    },
  },
})

-- Welcome screen (mini.starter) when no session to restore
local MiniStarter = require("mini.starter")
MiniStarter.setup({
  autoopen = false, -- hybrid VimEnter below
  items = {
    MiniStarter.sections.sessions(5, true),
    MiniStarter.sections.builtin_actions(),
  },
})

local function should_open_starter()
  if will_restore_session() then
    return false
  end
  -- `nvim file.ts` — skip starter
  if vim.fn.argc() == 1 and vim.fn.filereadable(vim.fn.argv(0)) == 1 then
    return false
  end
  if vim.fn.argc() > 1 then
    return false
  end
  -- bare `nvim` or `nvim <dir>` without workspace restore
  if vim.fn.argc() == 1 and vim.fn.isdirectory(vim.fn.argv(0)) == 1 then
    return true
  end
  local listed = vim.tbl_filter(function(buf)
    return vim.fn.buflisted(buf) == 1
  end, vim.api.nvim_list_bufs())
  if #listed > 1 then
    return false
  end
  if vim.bo.filetype ~= "" then
    return false
  end
  local n_lines = vim.api.nvim_buf_line_count(0)
  if n_lines > 1 then
    return false
  end
  local first_line = vim.api.nvim_buf_get_lines(0, 0, 1, true)[1] or ""
  return #first_line == 0
end

vim.api.nvim_create_autocmd("VimEnter", {
  desc = "Restore Session.vim or open starter on bare nvim",
  once = true,
  callback = function()
    if will_restore_session() then
      local ok, err = pcall(MiniSessions.read, local_session_name(), { force = true, verbose = false })
      if not ok then
        vim.notify("Session restore failed: " .. tostring(err), vim.log.levels.ERROR)
      end
      return
    end
    if should_open_starter() then
      -- `nvim .` without workspace leaves a dir buffer on the arglist before starter
      sessions_cleanup_explorers()
      -- Reuse startup empty buffer (avoids a 2nd buffer when picking "Edit new buffer")
      MiniStarter.open(vim.api.nvim_get_current_buf())
    end
  end,
})

vim.api.nvim_create_autocmd("VimLeavePre", {
  desc = "Save workspace session on quit when marker exists",
  callback = function()
    if MiniSessions.config.file == "" or not is_workspace_dir() then
      return
    end
    -- Explicit save for marked workspaces; autowrite also saves when v:this_session is set
    pcall(MiniSessions.write, MiniSessions.config.file, { force = true, verbose = false })
  end,
})

map("n", "<leader>Sw", function()
  local dir = vim.fn.getcwd()
  vim.fn.mkdir(dir .. "/.nvim", "p")
  local marker = workspace_marker_path(dir)
  if vim.fn.filereadable(marker) ~= 1 then
    vim.fn.writefile({ "" }, marker)
  end
  pcall(MiniSessions.write, MiniSessions.config.file, { force = true, verbose = true })
  vim.notify("Workspace enabled: " .. vim.fn.fnamemodify(dir, ":~"), vim.log.levels.INFO)
end, { desc = "Enable workspace session for cwd" })

map("n", "<leader>Sd", function()
  local dir = vim.fn.getcwd()
  local marker = workspace_marker_path(dir)
  if vim.fn.filereadable(marker) == 1 then
    vim.fn.delete(marker)
  end
  local session = session_file_path(dir)
  if vim.fn.filereadable(session) == 1 then
    vim.fn.delete(session)
  end
  vim.v.this_session = ""
  vim.notify("Workspace disabled: " .. vim.fn.fnamemodify(dir, ":~"), vim.log.levels.INFO)
end, { desc = "Disable workspace session for cwd" })

-- Buffer tabline (barbar.nvim): reorderable tabs, pin with <A-p>
vim.g.barbar_auto_setup = false
require("nvim-web-devicons").setup({ default = true })

require("barbar").setup({
  animation = false,
  auto_hide = false,
  tabpages = false,
  clickable = true,
  highlight_alternate = false,
  highlight_visible = true,
  insert_at_end = false,
  maximum_padding = 1,
  minimum_padding = 1,
  maximum_length = 30,
  icons = {
    buffer_index = false,
    buffer_number = false,
    button = "",
    modified = { button = "●" },
    pinned = { button = "󰐃", filename = true },
    preset = "default",
    separator_at_end = false,
    filetype = {
      enabled = true,
      custom_colors = false,
    },
    diagnostics = {
      [vim.diagnostic.severity.ERROR] = { enabled = false },
      [vim.diagnostic.severity.WARN] = { enabled = false },
      [vim.diagnostic.severity.INFO] = { enabled = false },
      [vim.diagnostic.severity.HINT] = { enabled = false },
    },
    gitsigns = {
      added = { enabled = false },
      changed = { enabled = false },
      deleted = { enabled = false },
    },
  },
  sidebar_filetypes = {
    minifiles = { event = "BufWinLeave", text = "", align = "left" },
    oil = { event = "BufWinLeave", text = "", align = "left" },
    Outline = { event = "BufWinLeave", text = "", align = "right" },
  },
})

-- Dirty tabs: override BufferDefault*Mod (barbar resets these; link+fg does not stick)
local function setup_barbar_tab_hl()
  local tab_sel = vim.api.nvim_get_hl(0, { name = "TabLineSel", link = false })
  local tab = vim.api.nvim_get_hl(0, { name = "TabLine", link = false })
  local mod_fg = "#e5c07b"
  local function bg_from(hl)
    return hl.bg and string.format("#%06x", hl.bg) or nil
  end

  -- Active/visible/inactive clean: default barbar look (no extra bold/underline)
  vim.api.nvim_set_hl(0, "BufferCurrent", { link = "TabLineSel" })
  vim.api.nvim_set_hl(0, "BufferVisible", { link = "TabLine" })
  vim.api.nvim_set_hl(0, "BufferInactive", { link = "TabLine" })

  -- Active dirty: same look as clean (● suffix only); inactive/visible dirty: warm + italic
  vim.api.nvim_set_hl(0, "BufferCurrentMod", { link = "TabLineSel" })
  vim.api.nvim_set_hl(0, "BufferCurrentModBtn", { link = "TabLineSel" })
  vim.api.nvim_set_hl(0, "BufferVisibleMod", { fg = mod_fg, bg = bg_from(tab), italic = true })
  vim.api.nvim_set_hl(0, "BufferVisibleModBtn", { fg = mod_fg, bg = bg_from(tab), italic = true })
  vim.api.nvim_set_hl(0, "BufferInactiveMod", { fg = mod_fg, bg = bg_from(tab), italic = true })
  vim.api.nvim_set_hl(0, "BufferInactiveModBtn", { fg = mod_fg, bg = bg_from(tab), italic = true })

  vim.api.nvim_set_hl(0, "BufferDefaultCurrentMod", { link = "TabLineSel" })
  vim.api.nvim_set_hl(0, "BufferDefaultCurrentModBtn", { link = "TabLineSel" })
  for _, suffix in ipairs({ "Visible", "Inactive" }) do
    local bg = bg_from(tab)
    vim.api.nvim_set_hl(0, "BufferDefault" .. suffix .. "Mod", { fg = mod_fg, bg = bg, italic = true })
    vim.api.nvim_set_hl(0, "BufferDefault" .. suffix .. "ModBtn", { fg = mod_fg, bg = bg, italic = true })
  end
end

setup_barbar_tab_hl()
vim.api.nvim_create_autocmd("ColorScheme", {
  desc = "Re-apply barbar dirty-tab colors after theme load",
  callback = setup_barbar_tab_hl,
})

-- Buffer navigation with <Tab> / <S-Tab>
vim.keymap.set("n", "<Tab>", "<Cmd>BufferNext<CR>", { desc = "Next buffer" })
vim.keymap.set("n", "<S-Tab>", "<Cmd>BufferPrevious<CR>", { desc = "Previous buffer" })
-- VSCode-style reorder: Cmd+Ctrl+Shift+[ / ]
vim.keymap.set("n", "<D-C-S-[>", "<Cmd>BufferMovePrevious<CR>", { desc = "Move buffer tab left" })
vim.keymap.set("n", "<D-C-S-]>", "<Cmd>BufferMoveNext<CR>", { desc = "Move buffer tab right" })
-- Pin / unpin current buffer (BufferPin toggles)
vim.keymap.set("n", "<A-p>", "<Cmd>BufferPin<CR>", { desc = "Pin / unpin buffer" })
-- Space + backtick: explicit leader char avoids "<leader>`" parse issues in some terminals
vim.keymap.set("n", "<Space>`", "<C-^>", { desc = "Toggle last buffer" })

map("n", "<C-q>", function() close_editor(false) end, { desc = "Close editor (split + buffer)" })
map("n", "<C-Q>", function() close_editor(true) end, { desc = "Force close editor" })

-- Reopen last closed buffer (like Ctrl+Shift+T in VSCode / browsers)
local closed_buffers = {}

vim.api.nvim_create_autocmd("BufDelete", {
  desc = "Remember recently closed buffers so we can reopen them",
  callback = function(args)
    local name = vim.api.nvim_buf_get_name(args.buf)
    if name ~= "" and vim.fn.filereadable(name) == 1 then
      local cursor
      for _, win in ipairs(vim.api.nvim_list_wins()) do
        if vim.api.nvim_win_get_buf(win) == args.buf then
          cursor = vim.api.nvim_win_get_cursor(win)
          break
        end
      end
      table.insert(closed_buffers, 1, {
        path = name,
        cursor = cursor,
        tab_index = barbar_buffer_index(args.buf),
      })
      if #closed_buffers > 8 then
        table.remove(closed_buffers)
      end
    end
  end,
})

vim.keymap.set("n", "<leader>T", function()
  if #closed_buffers == 0 then
    vim.notify("No recently closed buffers to reopen", vim.log.levels.WARN)
    return
  end
  local entry = closed_buffers[1]
  table.remove(closed_buffers, 1)
  vim.cmd.edit(entry.path)
  vim.schedule(function()
    local bufnr = vim.api.nvim_get_current_buf()
    barbar_move_buffer_to_index(bufnr, entry.tab_index)
    if entry.cursor then
      local lcount = vim.api.nvim_buf_line_count(bufnr)
      if entry.cursor[1] > 0 and entry.cursor[1] <= lcount then
        vim.api.nvim_win_set_cursor(0, entry.cursor)
      end
    end
  end)
end, { desc = "Reopen last closed buffer" })


-- ============================================================
-- Phase 5: Gutter, Outline, Scrollbar
-- ============================================================

local gitsigns_signs = {
  add          = { text = "▎" },
  change       = { text = "▎" },
  delete       = { text = "▁" },
  topdelete    = { text = "▁" },
  changedelete = { text = "▎" },
  untracked    = { text = "▎" },
}

require("gitsigns").setup({
  signs = gitsigns_signs,
  signs_staged = gitsigns_signs,
  preview_config = {
    border = "rounded",
  },
  on_attach = function(bufnr)
    local gs = package.loaded.gitsigns
    local function nmap(lhs, rhs, desc)
      vim.keymap.set("n", lhs, rhs, { buffer = bufnr, desc = desc })
    end
    nmap("]h", function() gs.nav_hunk("next") end, "Next git hunk")
    nmap("[h", function() gs.nav_hunk("prev") end, "Previous git hunk")
    nmap("<leader>hs", gs.stage_hunk, "Stage hunk")
    nmap("<leader>hr", gs.reset_hunk, "Reset hunk")
    nmap("<leader>hp", gs.preview_hunk, "Preview hunk")
  end,
})

-- Right-side symbol outline
require("outline").setup({
  outline_window = {
    position = "right",
    relative_width = false,
    width = 36,
    focus_on_open = false,
    auto_close = false,
    show_numbers = false,
    show_cursorline = true,
  },
  outline_items = {
    show_symbol_details = false,
    show_symbol_lineno = false,
    highlight_hovered_item = true,
    auto_set_cursor = true,
    auto_update_events = {
      follow = { "CursorMoved" },
      items = { "LspAttach" },
    },
  },
  preview_window = {
    auto_preview = false,
  },
  symbol_folding = {
    autofold_depth = 1,
    auto_unfold = { hovered = false, only = false },
  },
  -- init.lua etc.: skip Variable/Object noise; show functions/methods only
  symbols = {
    filter = {
      lua = { "Function", "Method", "Module", "Class", "Constructor" },
    },
  },
  keymaps = {
    close = { "<Esc>", "q" },
    goto_location = "<CR>",
    fold_toggle = "<Tab>",
  },
})

map("n", "<leader>o", function()
  require("outline").toggle({ focus_outline = false })
  vim.schedule(function()
    local sidebar = require("outline")._get_sidebar()
    if sidebar and sidebar.view:is_open() and #(sidebar.items or {}) == 0 then
      sidebar:_refresh()
    end
  end)
end, { desc = "Toggle symbol outline" })
map("n", "<leader>of", function()
  require("outline").focus_outline()
end, { desc = "Focus outline" })
map("n", "<leader>oc", function()
  require("outline").focus_code()
end, { desc = "Focus editor" })

-- Folding (LSP-driven); VSCode-ish keymaps in addition to native za/zR/zM
map("n", "<leader>zf", "za", { desc = "Toggle fold" })
map("n", "<leader>zo", "zR", { desc = "Open all folds" })
map("n", "<leader>zc", "zM", { desc = "Close all folds" })

require("scrollbar").setup({
  show = true,
  handle = {
    text = " ",
    color = "#9aa3b2",
    blend = 50,
    highlight = "CursorColumn",
  },
  handlers = {
    cursor = false,
    diagnostic = true,
    gitsigns = true,
    search = false,
  },
  marks = {
    Search = { text = { "▮" }, color = "#ffeb3b", priority = 1 },
    Error = { text = { "◆" }, color = "#ff3b3b", priority = 2 },
    Warn = { text = { "◆" }, color = "#ff9e3d", priority = 3 },
    Info = { text = { "▪" }, color = "#61afef", priority = 4 },
    Hint = { text = { "▪" }, color = "#d0b8ff", priority = 5 },
    GitAdd = { text = "┆", highlight = "GitSignsAdd", priority = 7 },
    GitChange = { text = "┆", highlight = "GitSignsChange", priority = 7 },
    GitDelete = { text = "▁", highlight = "GitSignsDelete", priority = 7 },
  },
})
require("scrollbar.handlers.gitsigns").setup()
require("scrollbar.handlers").register("search", function(bufnr)
  if vim.v.hlsearch ~= 1 or vim.fn.getreg("/") == "" then
    return {}
  end
  if bufnr ~= vim.api.nvim_get_current_buf() then
    return {}
  end
  local config = require("scrollbar.config").get()
  local marks = {}
  for _, result in ipairs(get_search_line_positions(bufnr)) do
    marks[#marks + 1] = {
      line = result[1] - 1,
      text = mark_text(config, "Search"),
      type = "Search",
      level = 1,
    }
  end
  return marks
end)

vim.api.nvim_create_autocmd({ "CmdlineLeave", "SearchWrapped" }, {
  group = vim.api.nvim_create_augroup("user.scrollbar_search", { clear = true }),
  callback = function()
    if vim.v.vim_did_enter ~= 1 then
      return
    end
    refresh_search_scrollbar()
  end,
})


-- ============================================================
-- Phase 5b: Statusline
-- ============================================================

require("mini.statusline").setup({
  use_icons = true,
  set_vim_settings = true,
  content = {
    active = function()
      -- trunc_width huge → always use short mode letter (N/I/V/…)
      local mode, mode_hl = MiniStatusline.section_mode({ trunc_width = 9999 })
      local git = MiniStatusline.section_git({ trunc_width = 40 })
      local diff = vim.b.gitsigns_status or ""
      local diagnostics = MiniStatusline.section_diagnostics({
        trunc_width = 75,
        signs = { E = "E", W = "W", I = "I", H = "H" },
      })
      local filetype = vim.bo.filetype
      if filetype ~= "" and MiniIcons then
        local icon = select(1, MiniIcons.get("filetype", filetype))
        filetype = (icon or "") .. (icon and " " or "") .. filetype
      end
      local filename = (function()
        if vim.bo.buftype == "terminal" then
          return "%t"
        end
        local path = vim.api.nvim_buf_get_name(0)
        if path == "" then
          return "[No Name]"
        end
        return vim.fn.fnamemodify(path, ":.")
      end)()
      local location = "%l|%L"

      return MiniStatusline.combine_groups({
        { hl = mode_hl,                 strings = { mode } },
        { hl = "MiniStatuslineDevinfo", strings = { git, diff, diagnostics } },
        "%<",
        { hl = "MiniStatuslineFilename", strings = { filename } },
        "%=",
        { hl = "MiniStatuslineFileinfo", strings = { filetype } },
        { hl = mode_hl,                  strings = { location } },
      })
    end,
  },
})


-- ============================================================
-- Phase 6: LSP + Completion
-- ============================================================

vim.diagnostic.config({
  virtual_text = {
    prefix = "",
    spacing = 2,
    source = false,
    format = function(diagnostic)
      return diagnostic.message
    end,
  },
  signs = true,
  update_in_insert = false,
  severity_sort = true,
  float = {
    border = "rounded",
    source = "if_many",
  },
})

require("blink.cmp").setup({
  keymap = { preset = "super-tab" },
  completion = {
    menu = { auto_show = true },
  },
})

require("mason").setup({
  ui = {
    border = "rounded",
  },
})

require("conform").setup({
  formatters_by_ft = {
    lua = { "stylua" },
  },
  format_on_save = function(bufnr)
    if vim.bo[bufnr].filetype == "" then
      return nil
    end
    return { timeout_ms = 500, lsp_format = "fallback" }
  end,
})

vim.lsp.config("*", {
  capabilities = require("blink.cmp").get_lsp_capabilities(),
})

local function enable_lsp_servers()
  local servers = vim.iter(vim.api.nvim_get_runtime_file("lsp/*.lua", true))
      :map(function(f)
        return vim.fn.fnamemodify(f, ":t:r")
      end)
      :totable()
  if #servers > 0 then
    vim.lsp.enable(servers)
  end
end

enable_lsp_servers()

-- Close hover / other LSP floats with Esc
map("n", "<Esc>", function()
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    if vim.api.nvim_win_get_config(win).relative ~= "" then
      vim.api.nvim_win_close(win, true)
      return
    end
  end
end, { desc = "Close floating window" })

vim.api.nvim_create_autocmd("LspAttach", {
  group = vim.api.nvim_create_augroup("user.lsp", { clear = true }),
  callback = function(args)
    local bufnr = args.buf
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if not client then
      return
    end

    if client:supports_method("textDocument/foldingRange") then
      vim.schedule(function()
        if not vim.api.nvim_buf_is_valid(bufnr) then
          return
        end
        vim.api.nvim_buf_call(bufnr, function()
          if vim.wo.foldmethod == "expr" and vim.wo.foldexpr ~= "" then
            vim.cmd("normal! zx")
          end
        end)
      end)
    end

    local function nmap(lhs, rhs, desc)
      vim.keymap.set("n", lhs, rhs, { buffer = bufnr, desc = desc })
    end

    nmap("K", function()
      vim.lsp.buf.hover({ border = "rounded" })
    end, "Hover")
    nmap("gd", function()
      require("fzf-lua").lsp_definitions({ jump1 = true })
    end, "Go to definition")
    nmap("gD", function()
      require("fzf-lua").lsp_definitions({ jump1 = false })
    end, "Peek definition")
    nmap("gr", function()
      require("fzf-lua").lsp_references()
    end, "References")
    nmap("<leader>Ls", function()
      require("fzf-lua").lsp_document_symbols()
    end, "Document symbols (picker)")
    nmap("<leader>La", vim.lsp.buf.code_action, "Code action")
    nmap("<leader>Lr", vim.lsp.buf.rename, "Rename")
    nmap("<leader>Lm", "<cmd>Mason<CR>", "Mason installer")
  end,
})

-- Sourcing $MYVIMRC re-enables hlsearch; @/ keeps the last pattern → highlights return.
-- Clear visuals after load (pattern stays for n/N/cgn). <leader>c does the same on demand.
vim.cmd.nohlsearch()
refresh_search_scrollbar()

