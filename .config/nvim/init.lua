-- ============================================
-- Plugins
-- ============================================
-- oil + mini.files replace netrw; avoid ghost dir buffers on `nvim .`
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

vim.pack.add({
  -- Theme
  { src = "https://github.com/sainnhe/sonokai.git" },

  -- Core
  { src = "https://github.com/echasnovski/mini.nvim", version = "stable" },

  -- File Explorer
  { src = "https://github.com/stevearc/oil.nvim" },

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

  -- Treesitter parsers + sticky context (Phase 7; needs `brew install tree-sitter-cli`)
  { src = "https://github.com/nvim-treesitter/nvim-treesitter" },
  { src = "https://github.com/nvim-treesitter/nvim-treesitter-context" },

  -- LSP + completion
  { src = "https://github.com/saghen/blink.cmp", version = "v1" },
  { src = "https://github.com/stevearc/conform.nvim" },
  { src = "https://github.com/mason-org/mason.nvim" },
  { src = "https://github.com/WhoIsSethDaniel/mason-tool-installer.nvim" },
})

-- ============================================
-- Phase 1: Core Foundation
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
vim.opt.foldmethod = "indent"
vim.opt.foldexpr = "0"
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

-- ignorecase + smartcase: lowercase `/pattern` is case-insensitive; any uppercase letter
-- forces case-sensitive (e.g. `/Foo`). Toggle with <leader>ui; `\c`/`\C` in pattern override per-search.
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

local gitsigns_signs = {
  add = { text = "▎" },
  change = { text = "▎" },
  delete = { text = "▁" },
  topdelete = { text = "▁" },
  changedelete = { text = "▎" },
  untracked = { text = "▎" },
}

local gitsigns_did_setup = false

local function gitsigns_setup()
  if gitsigns_did_setup then
    return
  end
  require("gitsigns").setup({
    signs = gitsigns_signs,
    signs_staged = gitsigns_signs,
    preview_config = {
      border = "rounded",
    },
  })
  gitsigns_did_setup = true
end

local function gitsigns_attach_loaded_buffers()
  gitsigns_setup()
  local gitsigns = require("gitsigns")
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_is_loaded(buf) and vim.bo[buf].buftype == "" and vim.api.nvim_buf_get_name(buf) ~= "" then
      gitsigns.attach({ bufnr = buf })
    end
  end
end

vim.opt.iskeyword:append("-") -- Treat dash as part of a word (very useful for kebab-case, CSS, etc.)
vim.opt.path:append("**") -- Search in subdirectories with :find and gf
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

vim.keymap.set("n", "*", function()
  search_word_stay(false, false)
end, { desc = "Search word (stay in place)" })
vim.keymap.set("n", "#", function()
  search_word_stay(true, false)
end, { desc = "Search word backward (stay in place)" })
vim.keymap.set("n", "g*", function()
  search_word_stay(false, true)
end, { desc = "Search partial word (stay in place)" })
vim.keymap.set("n", "g#", function()
  search_word_stay(true, true)
end, { desc = "Search partial word backward (stay in place)" })

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

-- Save cleanup: trim before format; EOF blank line after conform (see below).
vim.api.nvim_create_autocmd("BufWritePre", {
  desc = "Trim trailing whitespace before save",
  pattern = "*",
  callback = function()
    if vim.bo.modifiable and vim.fn.search([[\s\+$]], "n") > 0 then
      local view = vim.fn.winsaveview()
      pcall(vim.cmd.undojoin)
      vim.cmd([[silent! keepjumps %s/\s\+$//e]])
      vim.fn.winrestview(view)
    end
  end,
})

-- ============================================
-- Phase 2: mini.nvim + Keymaps + QoL
-- ============================================
require("mini.basics").setup({
  options = { basic = true },
  mappings = { basic = true },
  autocommands = { basic = true },
})

require("mini.pairs").setup() -- auto close brackets/quotes
require("mini.comment").setup() -- gc to comment
require("mini.surround").setup() -- ys, ds, cs for surrounding
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
    move_up = "<C-k>",
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

-- Phase 2 (continued): keymaps + motions
local map = vim.keymap.set

-- Clear search highlight
map("n", "<leader>c", function()
  vim.cmd.nohlsearch()
  refresh_search_scrollbar()
end, { desc = "Clear search highlight" })

map("n", "<leader>ui", function()
  vim.o.ignorecase = not vim.o.ignorecase
  if vim.o.ignorecase then
    vim.o.smartcase = true
  else
    vim.o.smartcase = false
  end
  vim.notify(vim.o.ignorecase and "Search: ignore case" or "Search: match case", vim.log.levels.INFO)
end, { desc = "Toggle search case sensitivity" })

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

-- Toggle zoom current split to full tab area; toggle again restores sizes
local zoom_state = {}
map("n", "<C-S-CR>", function()
  local tab = vim.api.nvim_get_current_tabpage()
  local key = tostring(tab)
  local cur = vim.api.nvim_get_current_win()

  if zoom_state[key] then
    local saved = zoom_state[key]
    for win, dim in pairs(saved.sizes) do
      if vim.api.nvim_win_is_valid(win) then
        pcall(vim.api.nvim_win_set_width, win, dim.width)
        pcall(vim.api.nvim_win_set_height, win, dim.height)
      end
    end
    if vim.api.nvim_win_is_valid(saved.win) then
      vim.api.nvim_set_current_win(saved.win)
    end
    zoom_state[key] = nil
    vim.t.is_zoomed = nil
    vim.cmd.redrawstatus()
    return
  end

  local wins = vim.api.nvim_tabpage_list_wins(tab)
  if #wins <= 1 then
    return
  end

  local sizes = {}
  for _, win in ipairs(wins) do
    sizes[win] = {
      width = vim.api.nvim_win_get_width(win),
      height = vim.api.nvim_win_get_height(win),
    }
  end

  vim.api.nvim_set_current_win(cur)
  vim.cmd("wincmd _")
  vim.cmd("wincmd |")
  zoom_state[key] = { win = cur, sizes = sizes }
  vim.t.is_zoomed = true
  vim.cmd.redrawstatus()
end, { desc = "Toggle zoom current window" })

vim.api.nvim_create_autocmd("TabClosed", {
  callback = function(ev)
    zoom_state[tostring(ev.match)] = nil
  end,
})

-- Jump list: C-o/C-i stay in the active buffer (native jumps cross buffers).
-- Native jumplist is snapshotted per window; keepjumps cursor() truncates it, so
-- we track position + redo ourselves (vim.w cannot hold mutated tables).
local jump_state = setmetatable({}, { __mode = "k" })

local function jump_win_state(win)
  local state = jump_state[win]
  if not state then
    state = { buf = nil, entries = {}, pos = nil, redo = {}, last_jump = nil }
    jump_state[win] = state
  end
  return state
end

local function jump_buf_entries(buf)
  local entries = {}
  for _, entry in ipairs(vim.fn.getjumplist()[1] or {}) do
    if entry.bufnr == buf then
      entries[#entries + 1] = { entry.lnum, entry.col + 1 }
    end
  end
  return entries
end

local function jump_here()
  local pos = vim.fn.getpos(".")
  return pos[2], pos[3]
end

local function jump_at(lnum, col, entry)
  return entry[1] == lnum and entry[2] == col
end

local function jump_find_pos(entries, lnum, col)
  for i = #entries, 1, -1 do
    if jump_at(lnum, col, entries[i]) then
      return i
    end
  end
  return #entries + 1
end

local function jump_reset(state, buf)
  state.buf = buf
  state.entries = jump_buf_entries(buf)
  state.pos = nil
  state.redo = {}
  state.last_jump = nil
end

local function jump_resync(state, buf)
  state.entries = jump_buf_entries(buf)
  local lnum, col = jump_here()
  state.pos = jump_find_pos(state.entries, lnum, col)
end

local function jump_to(state, lnum, col)
  state.last_jump = { lnum, col }
  vim.w._jump_nav = true
  vim.cmd(string.format("keepjumps call cursor(%d, %d)", lnum, col))
  vim.schedule(function()
    vim.w._jump_nav = false
  end)
end

local function jump_in_buffer(forward)
  local win = vim.api.nvim_get_current_win()
  local buf = vim.api.nvim_get_current_buf()
  local state = jump_win_state(win)

  if state.buf ~= buf then
    jump_reset(state, buf)
  end
  if #state.entries == 0 then
    return
  end

  local lnum, col = jump_here()
  local buf_pos = state.pos or jump_find_pos(state.entries, lnum, col)
  local remaining = vim.v.count1

  if forward then
    while remaining > 0 do
      if #state.redo > 0 then
        local target = table.remove(state.redo)
        jump_to(state, target[1], target[2])
        state.pos = jump_find_pos(state.entries, target[1], target[2])
        remaining = remaining - 1
      elseif buf_pos < #state.entries then
        buf_pos = buf_pos + 1
        local target = state.entries[buf_pos]
        jump_to(state, target[1], target[2])
        state.pos = buf_pos
        remaining = remaining - 1
      else
        return
      end
    end
    return
  end

  while remaining > 0 do
    lnum, col = jump_here()
    local target_idx = buf_pos > #state.entries and #state.entries or (buf_pos - 1)
    if target_idx < 1 then
      return
    end
    local target = state.entries[target_idx]
    state.redo[#state.redo + 1] = { lnum, col }
    jump_to(state, target[1], target[2])
    state.pos = target_idx
    buf_pos = target_idx
    remaining = remaining - 1
  end
end

map("n", "<C-o>", function()
  jump_in_buffer(false)
end, { desc = "Jump back (this buffer)" })
map("n", "<C-i>", function()
  jump_in_buffer(true)
end, { desc = "Jump forward (this buffer)" })

vim.api.nvim_create_autocmd("CursorMoved", {
  group = vim.api.nvim_create_augroup("user.jumplist", { clear = true }),
  callback = function()
    if vim.w._jump_nav then
      return
    end
    local win = vim.api.nvim_get_current_win()
    local state = jump_state[win]
    if not state then
      return
    end
    local buf = vim.api.nvim_get_current_buf()
    local lnum, col = jump_here()
    local lj = state.last_jump
    if lj and lj[1] == lnum and lj[2] == col then
      state.last_jump = nil
      state.pos = jump_find_pos(state.entries, lnum, col)
      return
    end
    state.last_jump = nil
    state.redo = {}
    if state.buf ~= buf then
      jump_reset(state, buf)
    else
      jump_resync(state, buf)
    end
  end,
})

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

-- Smooth page scroll (pookie-style). C-y/C-e and zt/zz/zb stay native Vim.

-- Line scroll (viewport only; cursor stays). Letter d/u — not <C-S-Down>/<C-S-Up> (window resize).
map({ "n", "v" }, "<C-S-d>", "<C-e>", { remap = true, desc = "Scroll view down one line" })
map({ "n", "v" }, "<C-S-u>", "<C-y>", { remap = true, desc = "Scroll view up one line" })

-- Paste / Delete without yanking (black hole register)
-- Normal: <leader>X — <leader>x reserved for diagnostics prefix (see LSP section)
map("n", "<leader>X", '"_d', { desc = "Delete without yanking" })
map("v", "<leader>x", '"_d', { desc = "Delete without yanking" })
map("v", "<leader>p", '"_dP', { desc = "Paste over without yanking" })

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

-- Copy line(s) down/up (VSCode: Alt+Shift+Down/Up). Alt+Shift+j/k is free:
-- mini.move uses Alt+j/k (move, not copy); J is join, not Alt+Shift+j.
local function copy_line(dir)
  local pos = vim.fn.getcurpos()
  vim.cmd(dir == "down" and "copy ." or "copy .-1")
  vim.fn.cursor(pos[2], pos[3])
end

map("n", "<A-S-j>", function()
  copy_line("down")
end, { desc = "Copy line down" })
map("n", "<A-S-k>", function()
  copy_line("up")
end, { desc = "Copy line up" })
map("n", "<A-S-Down>", function()
  copy_line("down")
end, { desc = "Copy line down" })
map("n", "<A-S-Up>", function()
  copy_line("up")
end, { desc = "Copy line up" })

map("v", "<A-S-j>", ":t '><CR>gv=gv", { desc = "Copy selection down" })
map("v", "<A-S-k>", ":t '<-1<CR>gv=gv", { desc = "Copy selection up" })
map("v", "<A-S-Down>", ":t '><CR>gv=gv", { desc = "Copy selection down" })
map("v", "<A-S-Up>", ":t '<-1<CR>gv=gv", { desc = "Copy selection up" })

-- ─────────────────────────────────────────────
-- Quick save / buffers
-- ─────────────────────────────────────────────
require("mini.bufremove").setup()

-- Close editor (split-aware):
--   duplicate buffer in splits → close focused pane only
--   modified/unnamed in one pane → delete buffer, keep layout (mini.bufremove)
--   otherwise in splits → close pane, delete buffer if nowhere else shown
--   single window → mini.bufremove.delete
local function close_editor(force)
  local winid = vim.api.nvim_get_current_win()
  local bufnr = vim.api.nvim_get_current_buf()
  local buftype = vim.bo[bufnr].buftype
  if buftype ~= "" and buftype ~= "acwrite" then
    if #vim.api.nvim_tabpage_list_wins(0) > 1 then
      vim.api.nvim_win_close(winid, true)
    else
      pcall(vim.cmd, "bdelete!")
    end
    return
  end

  local shown_in = vim.fn.win_findbuf(bufnr)
  local splits = #vim.api.nvim_tabpage_list_wins(0) > 1

  if splits and #shown_in > 1 then
    vim.api.nvim_win_close(winid, true)
    return
  end

  if splits and (vim.bo[bufnr].modified or vim.api.nvim_buf_get_name(bufnr) == "") then
    require("mini.bufremove").delete(bufnr, force)
    return
  end

  if splits then
    vim.api.nvim_win_close(winid, true)
    if vim.api.nvim_buf_is_valid(bufnr) and #vim.fn.win_findbuf(bufnr) == 0 then
      require("mini.bufremove").delete(bufnr, force)
    end
    return
  end

  require("mini.bufremove").delete(bufnr, force)
end

local function quit_all_force()
  local modified = {}
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_is_loaded(buf) and vim.bo[buf].modified then
      local name = vim.api.nvim_buf_get_name(buf)
      modified[#modified + 1] = name ~= "" and vim.fn.fnamemodify(name, ":~:.") or "[No Name]"
    end
  end

  if #modified > 0 then
    table.sort(modified)
    local summary = table.concat(modified, ", ")
    if #summary > 100 then
      summary = summary:sub(1, 97) .. "..."
    end
    local choice = vim.fn.confirm(
      string.format("Quit without saving %d buffer(s)?\n%s", #modified, summary),
      "&Quit\n&Cancel",
      2
    )
    if choice ~= 1 then
      return
    end
  end

  vim.cmd("qa!")
end

map("n", "<leader>w", ":w<CR>", { desc = "Save file" })
map("n", "<leader>W", ":wq<CR>", { desc = "Save and quit" })
map("n", "<leader>q", function()
  close_editor(false)
end, { desc = "Close editor (split-aware)" })
map("n", "<leader>Q", quit_all_force, { desc = "Quit Neovim without saving" })
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
-- Phase 3: File Explorer + Finder
-- ============================================
-- Workspace sessions: global only (~/.local/share/nvim/session/<slug>.vim)
local SESSION_DIR = vim.fn.stdpath("data") .. "/session"

local function workspace_path_label(path)
  path = path or vim.fn.getcwd()
  local norm = vim.fs.normalize(path)
  local home = vim.fs.normalize(vim.env.HOME)
  if norm:sub(1, #home) == home then
    return "~" .. norm:sub(#home + 1)
  end
  return norm
end

local function workspace_session_slug(dir)
  return workspace_path_label(dir):gsub("/", "__"):gsub(":", "_") .. ".vim"
end

local function workspace_session_slug_label(slug_name)
  return slug_name:gsub("%.vim$", ""):gsub("__", "/")
end

local function workspace_session_path(dir)
  return SESSION_DIR .. "/" .. workspace_session_slug(dir)
end

local function has_workspace_session(dir)
  return vim.fn.filereadable(workspace_session_path(dir)) == 1
end

local function is_workspace_session_file(name)
  return type(name) == "string" and name:match("%.vim$") ~= nil
end

local function will_restore_session()
  if not has_workspace_session() then
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
  if will_restore_session() then
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
    vim.keymap.set("n", "<Esc>", mini_files_close_sync, {
      buffer = args.data.buf_id,
      desc = "Apply changes and close explorer",
    })
    local buf_id = args.data.buf_id

    -- Same as mini.files `match_line_offset`: cursor belongs on filename, not icon/path id
    local function minifiles_name_col(line)
      return (line:match("^/.-/.-/()") or 1) - 1
    end

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
      local line = vim.api.nvim_buf_get_lines(buf_id, n - 1, n, false)[1] or ""
      vim.api.nvim_win_set_cursor(0, { n, minifiles_name_col(line) })
    end

    vim.keymap.set("n", "j", function()
      minifiles_move(1)
    end, { buffer = buf_id, desc = "Next entry (wrap)" })
    vim.keymap.set("n", "k", function()
      minifiles_move(-1)
    end, { buffer = buf_id, desc = "Previous entry (wrap)" })

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
    if vim.w[win_id].minifiles_numbers == is_file_preview then
      return
    end
    vim.w[win_id].minifiles_numbers = is_file_preview
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

local function is_outline_buffer(buf)
  if not vim.api.nvim_buf_is_valid(buf) then
    return false
  end
  if vim.bo[buf].filetype == "Outline" then
    return true
  end
  return vim.api.nvim_buf_get_name(buf):match("^OUTLINE_") ~= nil
end

local function sessions_close_outline()
  local ok, outline = pcall(require, "outline")
  if ok and outline.is_open() then
    pcall(vim.cmd, "OutlineClose")
  end
end

local function sessions_strip_outline_buffers()
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if is_outline_buffer(buf) then
      for _, win in ipairs(vim.fn.win_findbuf(buf)) do
        if vim.api.nvim_win_is_valid(win) then
          pcall(vim.api.nvim_win_close, win, true)
        end
      end
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

local function sessions_cleanup_ephemeral()
  -- Plugin UI (oil dirs, outline sidebar) — not workspace state; strip before save/after restore
  sessions_cleanup_explorers()
  sessions_close_outline()
  sessions_strip_outline_buffers()
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

local function workspace_session_refresh_detected()
  if MiniSessions and MiniSessions.get_latest then
    MiniSessions.get_latest()
  end
end

local function workspace_session_write()
  sessions_cleanup_ephemeral()
  pcall(MiniSessions.write, workspace_session_slug(), { force = true, verbose = false })
  workspace_session_refresh_detected()
end

local function workspace_session_delete(dir)
  local slug = workspace_session_slug(dir)
  local path = workspace_session_path(dir)
  if vim.fn.filereadable(path) == 1 then
    vim.fn.delete(path)
  end
  if MiniSessions.detected[slug] then
    MiniSessions.detected[slug] = nil
  end
end

local function starter_workspace_sessions(n)
  n = n or 5
  return function()
    if _G.MiniSessions == nil then
      return { { name = [[mini.sessions is not set up]], action = "", section = "Sessions" } }
    end
    workspace_session_refresh_detected()

    local items = {}
    local cwd_slug = workspace_session_slug()

    for name, session in pairs(MiniSessions.detected) do
      if
        session.type == "global"
        and is_workspace_session_file(name)
        and vim.fn.filereadable(session.path) == 1
      then
        local is_here = name == cwd_slug
        items[#items + 1] = {
          name = workspace_session_slug_label(name) .. (is_here and " (resume here)" or ""),
          action = string.format([[lua MiniSessions.read(%q, { force = true })]], name),
          section = "Sessions",
          _mtime = session.modify_time,
          _prio = is_here and 2 or 0,
        }
      end
    end

    table.sort(items, function(a, b)
      if a._prio ~= b._prio then
        return a._prio > b._prio
      end
      return a._mtime > b._mtime
    end)

    if #items == 0 then
      return {
        { name = "No saved workspace sessions", action = "", section = "Sessions" },
        { name = "Save session here: <leader>Sw", action = "", section = "Sessions" },
      }
    end

    return vim.tbl_map(function(x)
      x._mtime = nil
      x._prio = nil
      return x
    end, vim.list_slice(items, 1, n))
  end
end

local function sessions_post_read()
  sessions_cleanup_ephemeral()
  gitsigns_attach_loaded_buffers()
  -- oil SessionLoadPost can finish loading after mini.sessions post hook
  vim.schedule(function()
    sessions_cleanup_ephemeral()
    vim.cmd("syntax enable")
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      sessions_refresh_buffer_syntax(buf)
    end
  end)
end

require("mini.sessions").setup({
  autoread = false, -- custom VimEnter below (handles `nvim .` too)
  autowrite = true,
  file = "", -- global slug files only (see workspace_session_slug)
  hooks = {
    pre = {
      write = function()
        sessions_cleanup_ephemeral()
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
    starter_workspace_sessions(8),
    MiniStarter.sections.builtin_actions(),
  },
  -- Avoid `.` as query key (macOS junk like .DS_Store in session dir used to match)
  query_updaters = "abcdefghijklmnopqrstuvwxyz0123456789_-",
  footer = table.concat({
    "Type to filter  |  <C-j>/<C-k> move  |  <CR> open  |  <Esc> clear filter",
  }, "\n"),
})

vim.api.nvim_create_autocmd("User", {
  pattern = "MiniStarterOpened",
  desc = "Starter: C-j/k to move (overrides global window maps)",
  callback = function()
    local buf = vim.api.nvim_get_current_buf()
    if vim.bo[buf].filetype ~= "ministarter" then
      return
    end
    local opts = { buffer = buf, nowait = true, silent = true }
    vim.keymap.set("n", "<C-j>", function()
      MiniStarter.update_current_item("next")
    end, vim.tbl_extend("force", opts, { desc = "Starter next item" }))
    vim.keymap.set("n", "<C-k>", function()
      MiniStarter.update_current_item("prev")
    end, vim.tbl_extend("force", opts, { desc = "Starter previous item" }))
  end,
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
  desc = "Restore workspace session or open starter on bare nvim",
  once = true,
  callback = function()
    if will_restore_session() then
      local ok, err = pcall(MiniSessions.read, workspace_session_slug(), { force = true, verbose = false })
      if not ok then
        vim.notify("Session restore failed: " .. tostring(err), vim.log.levels.ERROR)
      end
    elseif should_open_starter() then
      -- `nvim .` without workspace leaves a dir buffer on the arglist before starter
      sessions_cleanup_explorers()
      -- Reuse startup empty buffer (avoids a 2nd buffer when picking "Edit new buffer")
      MiniStarter.open(vim.api.nvim_get_current_buf())
      gitsigns_setup()
    else
      -- `nvim path/to/file` and other non-session startups
      gitsigns_attach_loaded_buffers()
    end
  end,
})

vim.api.nvim_create_autocmd("VimLeavePre", {
  desc = "Close outline before mini.sessions autowrite on quit",
  callback = function()
    if has_workspace_session() then
      sessions_close_outline()
    end
  end,
})

map("n", "<leader>Sw", function()
  workspace_session_write()
  vim.notify("Session saved: " .. workspace_path_label(), vim.log.levels.INFO)
end, { desc = "Save workspace session for cwd" })

map("n", "<leader>SS", function()
  workspace_session_refresh_detected()
  sessions_cleanup_explorers()
  MiniStarter.open(vim.api.nvim_get_current_buf())
end, { desc = "Open welcome / session picker" })

map("n", "<leader>Sd", function()
  workspace_session_delete()
  vim.v.this_session = ""
  workspace_session_refresh_detected()
  vim.notify("Session deleted: " .. workspace_path_label(), vim.log.levels.INFO)
end, { desc = "Delete workspace session for cwd" })

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
    -- minifiles is a floating window (row below tabline) — do not offset tabs
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

map("n", "<C-q>", function()
  close_editor(false)
end, { desc = "Close editor (split-aware)" })
map("n", "<C-Q>", function()
  close_editor(true)
end, { desc = "Force close editor" })

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
-- Phase 5: Gutter, Outline, Scrollbar, Statusline
-- ============================================================

-- Hunk navigation in normal buffers (CodeDiff tab uses buffer-local <C-]>/<C-[> instead)
map("n", "<C-]>", function()
  require("gitsigns").nav_hunk("next")
end, { desc = "Next git hunk" })
map("n", "<C-[>", function()
  require("gitsigns").nav_hunk("prev")
end, { desc = "Prev git hunk" })

-- Git view — codediff (VSCode-style diffs)
local function codediff_in_tab(tab)
  tab = tab or vim.api.nvim_get_current_tabpage()
  local ok, session_mod = pcall(require, "codediff.ui.lifecycle.session")
  if ok and session_mod.get_active_diffs()[tab] then
    return true
  end
  for _, win in ipairs(vim.api.nvim_tabpage_list_wins(tab)) do
    if vim.w[win].codediff_restore then
      return true
    end
  end
  return false
end

local function codediff_open(args, opts)
  opts = opts or {}
  if codediff_in_tab() then
    vim.notify("Already in CodeDiff — use q to close", vim.log.levels.INFO)
    return
  end
  if opts.visual then
    vim.cmd("'<,'>CodeDiff " .. args)
  elseif args == "" then
    vim.cmd("CodeDiff")
  else
    vim.cmd("CodeDiff " .. args)
  end
end

--- Focus explorer sidebar or history panel from any CodeDiff buffer.
local function codediff_focus_panel(tabpage)
  tabpage = tabpage or vim.api.nvim_get_current_tabpage()
  local ok, lifecycle = pcall(require, "codediff.ui.lifecycle")
  if not ok then
    return
  end
  local panel = lifecycle.get_explorer(tabpage)
  if not panel then
    return
  end
  local split = panel.split
  if not split or not split.winid or not vim.api.nvim_win_is_valid(split.winid) then
    local session = require("codediff.ui.lifecycle.session").get_active_diffs()[tabpage]
    if session and session.mode == "explorer" then
      require("codediff.ui.explorer").toggle_visibility(panel)
    end
  end
  split = panel.split
  if split and split.winid and vim.api.nvim_win_is_valid(split.winid) then
    vim.api.nvim_set_current_win(split.winid)
  end
end

-- Patch before codediff.setup(): setup loads side_by_side, which caches setup_all_keymaps.
do
  local lifecycle = require("codediff.ui.lifecycle")
  local view_keymaps = require("codediff.ui.view.keymaps")
  local setup_all_keymaps_orig = view_keymaps.setup_all_keymaps

  function view_keymaps.setup_all_keymaps(tabpage, original_bufnr, modified_bufnr, is_explorer_mode)
    setup_all_keymaps_orig(tabpage, original_bufnr, modified_bufnr, is_explorer_mode)
    local session = lifecycle.get_session(tabpage)
    if not session or (session.mode ~= "explorer" and session.mode ~= "history") then
      return
    end
    lifecycle.set_tab_keymap(tabpage, "n", "<C-e>", function()
      codediff_focus_panel(tabpage)
    end, { desc = "Focus explorer/history panel" })
  end
end

-- <leader>gv branch vs main (all files) | gp file vs HEAD | gm file vs main
-- <leader>gu uncommitted | gL file/line history | <C-e> focus panel | q close CodeDiff tab
require("codediff").setup({
  explorer = {
    width = 25, -- default 40
  },
  history = {
    height = 5, -- default 15
  },
  keymaps = {
    view = {
      focus_explorer = false, -- bound in setup_all_keymaps hook (explorer + history)
      next_hunk = "<C-]>",
      prev_hunk = "<C-[>",
      stage_hunk = false,
      unstage_hunk = false,
      discard_hunk = false,
      hunk_textobject = false,
    },
  },
})

map("n", "<leader>gv", function()
  codediff_open("main...")
end, { desc = "Diff branch vs main (explorer)" })
map("n", "<leader>gp", function()
  codediff_open("file HEAD")
end, { desc = "Diff file vs HEAD (uncommitted)" })
map("n", "<leader>gm", function()
  codediff_open("file main...")
end, { desc = "Diff file vs main" })
map("n", "<leader>gu", function()
  codediff_open("")
end, { desc = "Diff uncommitted (explorer)" })
map("n", "<leader>gL", function()
  codediff_open("history %")
end, { desc = "File history (codediff)" })
map("v", "<leader>gL", function()
  codediff_open("history", { visual = true })
end, { desc = "Line history (codediff)" })

-- Symbol outline — https://github.com/hedyhli/outline.nvim
-- LSP documentSymbol backend (marksman for markdown, language servers for code).
-- Phase 7 treesitter-context for sticky scroll; outline stays LSP documentSymbol-based.
-- Custom (intentional): exclude-noise filter, inline line numbers, manual sync keymaps
--   <leader>o — toggle; when opening: sync to editor symbol + focus outline pane
--   <leader>O — sync to editor symbol + focus outline (outline stays open if already open)
require("outline").setup({
  outline_window = {
    focus_on_open = true,
    width = 15,
  },
  outline_items = {
    show_symbol_details = false,
    show_symbol_lineno = false,
    highlight_hovered_item = true,
    auto_set_cursor = false,
    auto_update_events = {
      follow = false,
      items = { "LspAttach", "BufWritePost" },
    },
  },
  symbol_folding = {
    auto_unfold = { hovered = false, only = false },
  },
  -- Exclude literal/local noise; keep functions, modules, classes, namespaces, etc.
  -- Note: LSP documentSymbol only lists definitions (functions, modules, …),
  -- not bare statements like require("x").setup({}) or vim.api.nvim_create_autocmd(...).
  symbols = {
    filter = {
      default = {
        "String",
        "Number",
        "Boolean",
        "Array",
        "Object",
        "Null",
        "Variable",
        "Field",
        "Property",
        "Constant",
        "EnumMember",
        "Key",
        exclude = true,
      },
    },
  },
})

-- Inline line numbers (one space after symbol name); manual sync keymaps above
do
  local outline_hl = require("outline.highlight")
  local Sidebar = require("outline.sidebar")
  local orig_build = Sidebar.build_outline

  function outline_hl.linenos(bufnr, linenos, _)
    for index, lineno in ipairs(linenos) do
      local num = lineno:match("%S+$") or lineno
      vim.api.nvim_buf_set_extmark(bufnr, outline_hl.ns.vt, index - 1, -1, {
        virt_text = { { " " .. num, "OutlineLineno" } },
        virt_text_pos = "eol",
        hl_mode = "combine",
      })
    end
  end

  function Sidebar:build_outline(find_node)
    local cursor = orig_build(self, find_node)
    if self.view.buf and self.flats then
      local linenos = {}
      for _, node in ipairs(self.flats) do
        linenos[#linenos + 1] = tostring(node.range_start + 1)
      end
      outline_hl.linenos(self.view.buf, linenos)
    end
    return cursor
  end

  local outline = require("outline")

  local function outline_unfold_ancestors(items, target)
    local function walk(nodes, path)
      for _, node in ipairs(nodes or {}) do
        if node == target then
          for _, parent in ipairs(path) do
            parent.folded = false
          end
          return true
        end
        if node.children then
          local next_path = { unpack(path) }
          next_path[#next_path + 1] = node
          if walk(node.children, next_path) then
            return true
          end
        end
      end
      return false
    end
    walk(items, {})
  end

  local function outline_deepest_symbol(items, lnum0)
    local best
    local function walk(nodes)
      for _, node in ipairs(nodes or {}) do
        if lnum0 >= node.range_start and lnum0 <= node.range_end then
          if not best or node.depth > best.depth then
            best = node
          end
          walk(node.children)
        end
      end
    end
    walk(items)
    return best
  end

  --- Sync outline cursor/highlight to editor position (manual only).
  local function outline_sync_to_code(focus_outline, code_win)
    local sidebar = outline._get_sidebar(false)
    if not sidebar or not sidebar.view:is_open() then
      return false
    end

    code_win = code_win or sidebar.code.win
    if not code_win or not vim.api.nvim_win_is_valid(code_win) then
      return false
    end

    sidebar.code.win = code_win
    sidebar.code.buf = vim.api.nvim_win_get_buf(code_win)
    local lnum0 = vim.api.nvim_win_get_cursor(code_win)[1] - 1
    local target = outline_deepest_symbol(sidebar.items, lnum0)
    if target then
      outline_unfold_ancestors(sidebar.items, target)
    end

    sidebar:_update_lines(true, target)

    if focus_outline then
      sidebar:focus()
    end
    return true
  end

  local function outline_when_open(fn, attempt)
    attempt = attempt or 0
    if outline.is_open() then
      fn()
    elseif attempt < 40 then
      vim.defer_fn(function()
        outline_when_open(fn, attempt + 1)
      end, 50)
    end
  end

  local function outline_open_and_sync(focus_outline)
    local code_win = vim.api.nvim_get_current_win()

    if outline.is_open() then
      outline_sync_to_code(focus_outline, code_win)
      return
    end

    outline.open({ focus_outline = false })
    outline_when_open(function()
      outline_sync_to_code(focus_outline, code_win)
    end)
  end

  map("n", "<leader>o", function()
    if outline.is_open() then
      vim.cmd.OutlineClose()
      return
    end
    outline_open_and_sync(true)
  end, { desc = "Toggle outline (sync to symbol)", nowait = true })

  map("n", "<leader>O", function()
    outline_open_and_sync(true)
  end, { desc = "Focus outline at symbol", nowait = true })
end

-- Folding (LSP-driven); VSCode-ish keymaps in addition to native za/zR/zM
map("n", "<leader>zf", "za", { desc = "Toggle fold" })
map("n", "<leader>zo", "zR", { desc = "Open all folds" })
map("n", "<leader>zc", "zM", { desc = "Close all folds" })

local scrollbar = require("scrollbar")

scrollbar.setup({
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
    Search = { text = { "▮" }, color = "#fff700", priority = 1 },
    Error = { text = { "◆" }, color = "#ff3b3b", priority = 2 },
    Warn = { text = { "◆" }, color = "#ff9e3d", priority = 3 },
    Info = { text = { "▪" }, color = "#61afef", priority = 4 },
    Hint = { text = { "▪" }, color = "#d0b8ff", priority = 5 },
    GitAdd = { text = "┆", highlight = "GitSignsAdd", priority = 7 },
    GitChange = { text = "┆", highlight = "GitSignsChange", priority = 7 },
    GitDelete = { text = "┆", highlight = "GitSignsDelete", priority = 7 },
  },
})
require("scrollbar.handlers.gitsigns").setup()

require("neoscroll").setup({
  mappings = { "<C-u>", "<C-d>", "<C-b>", "<C-f>" },
  hide_cursor = false,
  stop_eof = true,
  easing = "quadratic",
  duration_multiplier = 0.30,
  pre_hook = function()
    require("scrollbar.utils").hide()
  end,
  post_hook = function()
    require("scrollbar.utils").show()
    scrollbar.throttled_render()
  end,
})

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

      local groups = {
        { hl = mode_hl, strings = { mode } },
      }
      if vim.t.is_zoomed then
        table.insert(groups, { hl = "DiagnosticWarn", strings = { " ZOOM " } })
      end
      vim.list_extend(groups, {
        { hl = "MiniStatuslineDevinfo", strings = { git, diff, diagnostics } },
        "%<",
        { hl = "MiniStatuslineFilename", strings = { filename } },
        "%=",
        { hl = "MiniStatuslineFileinfo", strings = { filetype } },
        { hl = mode_hl, strings = { location } },
      })
      return MiniStatusline.combine_groups(groups)
    end,
  },
})

-- ============================================================
-- Phase 7: Treesitter (parsers) + sticky context
-- ============================================================
-- Vim syntax unchanged; parsers feed treesitter-context only (no TS highlight/indent/folds).
-- Prereq: brew install tree-sitter-cli
-- Maint: :TSContext toggle | :checkhealth nvim-treesitter | :TSUpdate

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

  local clone = vim.system({
    "git",
    "clone",
    "--depth",
    "1",
    "--branch",
    "main",
    NVIM_TS_REPO,
    dir,
  }, { text = true }):wait()

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

  vim.api.nvim_create_autocmd("FileType", {
    desc = "Install treesitter parser on demand when missing",
    group = vim.api.nvim_create_augroup("user.treesitter_install", { clear = true }),
    callback = function(args)
      local lang = vim.treesitter.language.get_lang(vim.bo[args.buf].filetype)
      if lang then
        ts.install({ lang })
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

-- ============================================================
-- Phase 6: LSP + Completion
-- ============================================================
-- LSP keymaps (buffer-local on attach): K hover, gd/gD/gr, <leader>L*
-- Global: ]d/[d diagnostics, <Esc> close floats

-- Mason-managed CLI tools (explicit list — add packages when lsp/*.lua or formatters grow)
local MASON_TOOLS = {
  "lua-language-server",
  "stylua",
  "ty",
  "vtsls",
  "json-lsp",
  "bash-language-server",
  "ruff",
  "prettier",
  "taplo",
  "yaml-language-server",
  "yamlfmt",
  "rust-analyzer",
  "zls",
  "marksman",
  "dockerfile-language-server",
  "html-lsp",
  "css-lsp",
  "tailwindcss-language-server",
}

require("mason").setup({
  ui = {
    border = "rounded",
  },
})

-- Prefer Mason binaries for LSP/formatters/search without system installs
vim.env.PATH = table.concat({
  vim.fn.stdpath("data") .. "/mason/bin",
  vim.env.PATH,
}, vim.fn.has("win32") == 1 and ";" or ":")

require("mason-tool-installer").setup({
  ensure_installed = MASON_TOOLS,
  auto_update = false,
  run_on_start = true,
})

require("conform").setup({
  formatters_by_ft = {
    lua = { "stylua" },
    python = { "ruff_format" },
    javascript = { "prettier" },
    javascriptreact = { "prettier" },
    typescript = { "prettier" },
    typescriptreact = { "prettier" },
    json = { "prettier" },
    jsonc = { "prettier" },
    toml = { "taplo" },
    yaml = { "yamlfmt" },
    html = { "prettier" },
    css = { "prettier" },
    scss = { "prettier" },
  },
  format_on_save = function(bufnr)
    if vim.bo[bufnr].filetype == "" then
      return nil
    end
    return { timeout_ms = 500, lsp_format = "fallback", undojoin = true }
  end,
})

-- After conform/stylua (registered later = runs after format): visible EOF blank line.
vim.api.nvim_create_autocmd("BufWritePre", {
  desc = "EOF blank line after format on save",
  pattern = "*",
  callback = function()
    if not vim.bo.modifiable or vim.bo.buftype ~= "" then
      return
    end
    if vim.fn.getline("$") == "" then
      return
    end
    local view = vim.fn.winsaveview()
    pcall(vim.cmd.undojoin)
    vim.fn.append(vim.fn.line("$"), { "" })
    vim.fn.winrestview(view)
  end,
})

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
  signature = { enabled = true },
})

vim.lsp.config("*", {
  capabilities = require("blink.cmp").get_lsp_capabilities(),
})

local function enable_lsp_servers()
  local servers = vim
    .iter(vim.api.nvim_get_runtime_file("lsp/*.lua", true))
    :map(function(f)
      return vim.fn.fnamemodify(f, ":t:r")
    end)
    :totable()
  if #servers > 0 then
    vim.lsp.enable(servers)
  end
end

enable_lsp_servers()

-- Manual LSP per buffer (vim.b.lsp_manual: nil=auto, false=off, string=server name)
vim.api.nvim_create_autocmd("LspAttach", {
  group = vim.api.nvim_create_augroup("user.lsp.manual", { clear = true }),
  callback = function(args)
    local bufnr = args.buf
    local manual = vim.b[bufnr].lsp_manual
    if manual == nil then
      return
    end
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if not client then
      return
    end
    if manual == false or client.name ~= manual then
      vim.schedule(function()
        pcall(vim.lsp.buf_detach_client, bufnr, client.id)
      end)
    end
  end,
})

local LSP_FT_LABEL = {
  bash = "Bash",
  sh = "Shell",
  markdown = "Markdown",
  ["markdown.mdx"] = "Markdown MDX",
  javascript = "JavaScript",
  javascriptreact = "JavaScript React",
  typescript = "TypeScript",
  typescriptreact = "TypeScript React",
  python = "Python",
  lua = "Lua",
  rust = "Rust",
  yaml = "YAML",
  ["yaml.docker-compose"] = "YAML (Docker Compose)",
  ["yaml.gitlab"] = "YAML (GitLab CI)",
  ["yaml.helm-values"] = "YAML (Helm values)",
  toml = "TOML",
  json = "JSON",
  jsonc = "JSON with Comments",
  dockerfile = "Dockerfile",
  html = "HTML",
  css = "CSS",
  scss = "SCSS",
  less = "LESS",
  zig = "Zig",
  zir = "Zig IR",
}

local function lsp_ft_label(ft)
  if LSP_FT_LABEL[ft] then
    return LSP_FT_LABEL[ft]
  end
  return (ft:gsub("[_.]", " "):gsub("(%a)([%w_%.]*)", function(a, rest)
    return a:upper() .. rest
  end))
end

local function lsp_detach_buffer(bufnr)
  for _, client in ipairs(vim.lsp.get_clients({ bufnr = bufnr })) do
    pcall(vim.lsp.buf_detach_client, bufnr, client.id)
  end
end

local function lsp_set_filetype(bufnr, ft)
  if ft == "" then
    return
  end
  -- Mirror manual pick: indexed buffer set (fires FileType) so statusline/icons refresh
  vim.bo[bufnr].filetype = ft
  vim.bo[bufnr].syntax = ft
end

local function lsp_root_dir(bufnr, server)
  local markers = { ".git" }
  local cfg = vim.lsp.config[server]
  if type(cfg) == "table" and cfg.root_markers then
    markers = cfg.root_markers
  end
  local root = vim.fs.root(bufnr, markers)
  if root then
    return root
  end
  local path = vim.api.nvim_buf_get_name(bufnr)
  if path ~= "" then
    return vim.fs.dirname(path)
  end
  return vim.fn.getcwd()
end

local function lsp_start_server(bufnr, server)
  return vim.lsp.start({
    name = server,
    root_dir = lsp_root_dir(bufnr, server),
  }, { bufnr = bufnr })
end

local function lsp_attach_for_filetype(bufnr, ft)
  local filter = ft ~= "" and { filetype = ft } or { enabled = true }
  for _, cfg in ipairs(vim.lsp.get_configs(filter)) do
    if vim.lsp.is_enabled(cfg.name) then
      lsp_start_server(bufnr, cfg.name)
    end
  end
end

local function lsp_refresh_ui(bufnr, ft)
  vim.schedule(function()
    if not vim.api.nvim_buf_is_valid(bufnr) then
      return
    end
    if ft and ft ~= "" then
      lsp_set_filetype(bufnr, ft)
      vim.api.nvim_exec_autocmds("FileType", { buffer = bufnr, modeline = false })
    end
    vim.cmd.redrawstatus()
  end)
end

-- Soft detect: only when filetype empty (picker open). Does not clear an existing filetype.
local function lsp_soft_detect_filetype(bufnr)
  if vim.bo[bufnr].filetype ~= "" then
    return vim.bo[bufnr].filetype
  end
  vim.api.nvim_buf_call(bufnr, function()
    pcall(vim.cmd, "filetype", "detect")
  end)
  local ft = vim.bo[bufnr].filetype
  if ft == "" then
    local path = vim.api.nvim_buf_get_name(bufnr)
    if path ~= "" then
      ft = vim.filetype.match({ buf = bufnr, filename = path }) or ""
    end
  end
  if ft ~= "" then
    lsp_set_filetype(bufnr, ft)
  end
  return ft
end

-- Hard detect: reset then detect (Auto restore).
local function lsp_detect_filetype(bufnr)
  vim.api.nvim_buf_call(bufnr, function()
    vim.bo.filetype = ""
    pcall(vim.cmd, "filetype", "detect")
  end)
  local ft = vim.bo[bufnr].filetype
  if ft == "" then
    local path = vim.api.nvim_buf_get_name(bufnr)
    if path ~= "" then
      ft = vim.filetype.match({ buf = bufnr, filename = path }) or ""
    end
  end
  if ft ~= "" then
    lsp_set_filetype(bufnr, ft)
  end
  return ft
end

local function lsp_restore_automatic(bufnr)
  vim.b[bufnr].lsp_manual = nil
  local ft = lsp_detect_filetype(bufnr)
  lsp_detach_buffer(bufnr)
  lsp_attach_for_filetype(bufnr, ft)
  lsp_refresh_ui(bufnr, ft)
  return ft
end

local function lsp_pick_apply(bufnr, pick_map, line)
  local fzf_utils = require("fzf-lua.utils")
  line = fzf_utils.strip_ansi_coloring(line or "")
  if line == "" then
    return
  end

  local pick = pick_map[line]
  if pick and pick.auto then
    local ft = lsp_restore_automatic(bufnr)
    local msg = ft ~= "" and ("LSP: auto (%s)"):format(ft) or "LSP: auto (no filetype)"
    vim.notify(msg, vim.log.levels.INFO)
    return
  end

  if pick and pick.none then
    vim.b[bufnr].lsp_manual = false
    lsp_detach_buffer(bufnr)
    lsp_refresh_ui(bufnr)
    local ft = vim.bo[bufnr].filetype
    local msg = ft ~= "" and ("LSP: none (keeps %s, no server)"):format(ft) or "LSP: none (no server)"
    vim.notify(msg, vim.log.levels.INFO)
    return
  end

  if not pick then
    vim.notify("LSP: unknown picker entry", vim.log.levels.ERROR)
    return
  end

  vim.b[bufnr].lsp_manual = pick.server
  lsp_set_filetype(bufnr, pick.ft)
  lsp_detach_buffer(bufnr)

  local id = lsp_start_server(bufnr, pick.server)
  if not id then
    vim.notify(
      ("LSP: could not start %s (%s)"):format(lsp_ft_label(pick.ft), pick.server),
      vim.log.levels.ERROR
    )
    return
  end

  lsp_refresh_ui(bufnr, pick.ft)
  vim.notify(("LSP: %s (%s)"):format(lsp_ft_label(pick.ft), pick.server), vim.log.levels.INFO)
end

local function lsp_pick_marker(active)
  return active and "●" or "○"
end

local function lsp_pick_language_active(bufnr, pick, attached)
  local manual = vim.b[bufnr].lsp_manual
  if manual == false or vim.bo[bufnr].filetype ~= pick.ft then
    return false
  end
  if type(manual) == "string" then
    return manual == pick.server
  end
  return attached[pick.server]
end

local function lsp_pick_server()
  local bufnr = vim.api.nvim_get_current_buf()
  local ft = lsp_soft_detect_filetype(bufnr)
  local attached = {}
  for _, client in ipairs(vim.lsp.get_clients({ bufnr = bufnr })) do
    attached[client.name] = true
  end

  local entries = {}
  local pick_map = {}
  local manual = vim.b[bufnr].lsp_manual

  local auto_line = string.format("%s Auto (detect filetype & LSP)", lsp_pick_marker(manual == nil))
  entries[#entries + 1] = auto_line
  pick_map[auto_line] = { auto = true }

  local none_line = string.format("%s None (no LSP)", lsp_pick_marker(manual == false))
  entries[#entries + 1] = none_line
  pick_map[none_line] = { none = true }

  local seen = {}
  local picks = {}
  for _, cfg in ipairs(vim.lsp.get_configs({ enabled = true })) do
    local server = cfg.name
    if not server then
      goto continue
    end
    for _, cfg_ft in ipairs(cfg.filetypes or {}) do
      local key = server .. "\0" .. cfg_ft
      if seen[key] then
        goto continue_ft
      end
      seen[key] = true
      picks[#picks + 1] = {
        priority = cfg_ft == ft and 0 or 1,
        label = string.format("%s (%s)", lsp_ft_label(cfg_ft), cfg_ft),
        server = server,
        ft = cfg_ft,
      }
      ::continue_ft::
    end
    ::continue::
  end

  table.sort(picks, function(a, b)
    if a.priority ~= b.priority then
      return a.priority < b.priority
    end
    return a.label < b.label
  end)

  for _, pick in ipairs(picks) do
    local line = string.format("%s %s", lsp_pick_marker(lsp_pick_language_active(bufnr, pick, attached)), pick.label)
    entries[#entries + 1] = line
    pick_map[line] = { server = pick.server, ft = pick.ft }
  end

  if #picks == 0 then
    vim.notify("No enabled LSP configs found", vim.log.levels.WARN)
    return
  end

  require("fzf-lua").fzf_exec(entries, {
    prompt = ("LSP (%s)> "):format(ft ~= "" and ft or "no filetype"),
    actions = {
      ["default"] = function(selected)
        if not selected or not selected[1] then
          return
        end
        vim.schedule(function()
          lsp_pick_apply(bufnr, pick_map, selected[1])
        end)
      end,
    },
  })
end

map("n", "<leader>Ll", lsp_pick_server, { desc = "Pick LSP server for buffer" })

map("n", "]d", function()
  vim.diagnostic.jump({ count = 1 })
end, { desc = "Next diagnostic" })
map("n", "[d", function()
  vim.diagnostic.jump({ count = -1 })
end, { desc = "Previous diagnostic" })

map("n", "<leader>xd", function()
  require("fzf-lua").diagnostics_document()
end, { desc = "Diagnostics buffer (fzf)" })
map("n", "<leader>xD", function()
  require("fzf-lua").diagnostics_workspace()
end, { desc = "Diagnostics workspace (fzf)" })
map("n", "<leader>xl", function()
  vim.diagnostic.setloclist({ open = true })
end, { desc = "Diagnostics loclist" })

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
      vim.api.nvim_buf_call(bufnr, function()
        vim.wo.foldmethod = "expr"
        vim.wo.foldexpr = "v:lua.vim.lsp.foldexpr()"
      end)
      vim.schedule(function()
        if not vim.api.nvim_buf_is_valid(bufnr) then
          return
        end
        vim.api.nvim_buf_call(bufnr, function()
          vim.cmd("normal! zx")
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
    nmap("<leader>Lf", function()
      require("conform").format({ bufnr = bufnr, async = true })
    end, "Format buffer")
    nmap("<leader>Lr", vim.lsp.buf.rename, "Rename")
    nmap("<leader>Lh", function()
      if not client:supports_method("textDocument/inlayHint") then
        vim.notify("Inlay hints not supported for this buffer", vim.log.levels.WARN)
        return
      end
      local enable = not vim.lsp.inlay_hint.is_enabled({ bufnr = bufnr })
      vim.lsp.inlay_hint.enable(enable, { bufnr = bufnr })
      vim.notify(enable and "Inlay hints on" or "Inlay hints off", vim.log.levels.INFO)
    end, "Toggle inlay hints")
    nmap("<leader>Lm", "<cmd>Mason<CR>", "Mason installer")
    nmap("<leader>Ll", lsp_pick_server, "Pick LSP server")
  end,
})

vim.api.nvim_create_autocmd("LspDetach", {
  group = vim.api.nvim_create_augroup("user.lsp", { clear = false }),
  callback = function(args)
    local bufnr = args.buf
    if not vim.api.nvim_buf_is_valid(bufnr) then
      return
    end
    if #vim.lsp.get_clients({ bufnr = bufnr, method = "textDocument/foldingRange" }) > 0 then
      return
    end
    vim.api.nvim_buf_call(bufnr, function()
      vim.wo.foldmethod = "indent"
      vim.wo.foldexpr = "0"
    end)
  end,
})

-- Key hints (mini.clue — which-key alternative; setup last so LSP buffer maps take precedence)
local MiniClue = require("mini.clue")
MiniClue.setup({
  triggers = {
    { mode = "n", keys = "<Leader>" },
    { mode = "v", keys = "<Leader>" },
    { mode = "x", keys = "<Leader>" },
    { mode = "n", keys = "[" },
    { mode = "n", keys = "]" },
    { mode = "n", keys = "g" },
    { mode = "x", keys = "g" },
    { mode = "n", keys = "<C-w>" },
  },
  clues = {
    MiniClue.gen_clues.g(),
    MiniClue.gen_clues.z(),
    MiniClue.gen_clues.windows(),
    MiniClue.gen_clues.square_brackets(),
    { mode = "n", keys = "<Leader>e", desc = "Explorer (mini.files)" },
    { mode = "n", keys = "<Leader>E", desc = "Explorer (oil)" },
    { mode = "n", keys = "<Leader>f", desc = "Find files (fff)" },
    { mode = "n", keys = "<Leader>/", desc = "Grep project (fzf-lua)" },
    { mode = "n", keys = "<Leader>F", desc = "Find files anywhere (global)" },
    { mode = "n", keys = "<Leader>?", desc = "Grep anywhere (global)" },
    { mode = "n", keys = "<Leader>r", desc = "Recent files" },
    { mode = "n", keys = "<Leader>L", desc = "+LSP" },
    { mode = "n", keys = "<Leader>Ll", desc = "Pick LSP server" },
    { mode = "n", keys = "<Leader>o", desc = "Outline toggle (sync)" },
    { mode = "n", keys = "<Leader>O", desc = "Outline focus at symbol" },
    { mode = "n", keys = "<Leader>S", desc = "+Session" },
    { mode = "n", keys = "<Leader>X", desc = "Delete (no yank) + motion" },
    { mode = "n", keys = "<Leader>x", desc = "+Diagnostics" },
    { mode = "v", keys = "<Leader>x", desc = "Delete selection (no yank)" },
    { mode = "v", keys = "<Leader>p", desc = "Paste over (keep clipboard)" },
    { mode = "n", keys = "<Leader>g", desc = "+Git view" },
    { mode = "v", keys = "<Leader>g", desc = "+Git view" },
    { mode = "n", keys = "<Leader>y", desc = "+Yank path" },
    { mode = "n", keys = "<Leader>z", desc = "+Folds" },
    { mode = "n", keys = "<Leader>T", desc = "Find color" },
    { mode = "n", keys = "]d", desc = "Next diagnostic" },
    { mode = "n", keys = "[d", desc = "Prev diagnostic" },
    { mode = "n", keys = "<C-]>", desc = "Next git hunk (editor)" },
    { mode = "n", keys = "<C-[>", desc = "Prev git hunk (editor)" },
  },
  window = { delay = 300 },
})

vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(args)
    MiniClue.ensure_buf_triggers(args.buf)
  end,
})

-- Sourcing $MYVIMRC re-enables hlsearch; @/ keeps the last pattern → highlights return.
-- Clear visuals after load (pattern stays for n/N/cgn). <leader>c does the same on demand.
vim.cmd.nohlsearch()
refresh_search_scrollbar()
