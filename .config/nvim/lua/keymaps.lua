local buffers = require("buffers")
local git = require("git")
local map = require("map")

map("n", "<leader>ui", function()
  vim.o.ignorecase = not vim.o.ignorecase
  if vim.o.ignorecase then
    vim.o.smartcase = true
  else
    vim.o.smartcase = false
  end
  vim.notify(vim.o.ignorecase and "Search: ignore case" or "Search: match case", vim.log.levels.INFO)
end, { desc = "Toggle search case sensitivity" })

-- Insert-mode shell-like deletes (respect 'iskeyword' with the - append).
map("i", "<C-d>", "<Del>", { desc = "Delete char forward (shell C-d)" })
map("i", "<M-BS>", "<C-w>", { desc = "Delete word backward (Alt/Option+Backspace like shell)" })
map("i", "<M-d>", "<C-o>dw", { desc = "Delete word forward (Option+D like shell kill-word)" })
map("i", "<C-S-d>", "<C-o>dw", { desc = "Delete word forward (C-S-d like right-side Alt+Backspace)" })

-- Grug-far (find & replace across the project, VSCode-style).
-- <leader>sr pre-fills the current word + --hidden --follow (important for dotfiles).
-- The loader is defensive: the plugin is only fetched on first use via :PackUpdate.
local grug_far

local function load_grug_far()
  if grug_far then
    return grug_far
  end
  local ok
  ok, grug_far = pcall(require, "grug-far")
  if not ok then
    -- Try activating the opt pack (in case :PackUpdate ran in this session).
    pcall(vim.cmd, "packadd! grug-far.nvim")
    ok, grug_far = pcall(require, "grug-far")
  end
  if not ok or not grug_far then
    vim.notify("grug-far.nvim not installed yet.\nRun :PackUpdate (then restart if needed).", vim.log.levels.WARN)
    grug_far = nil
    return nil
  end
  grug_far.setup()
  return grug_far
end

map({ "n", "v" }, "<leader>sr", function()
  local g = load_grug_far()
  if g then
    g.open({
      prefills = {
        search = vim.fn.expand("<cword>"),
        flags = "--hidden --follow",
      },
    })
  end
end, { desc = "Search + replace (grug-far)" })

-- Safe wrappers for the native commands (they become fully featured once the real plugin loads).
vim.api.nvim_create_user_command("GrugFar", function()
  local g = load_grug_far()
  if g then
    g.open()
  end
end, { desc = "Open grug-far (search/replace)" })

vim.api.nvim_create_user_command("GrugFarWithin", function(opts)
  local g = load_grug_far()
  if g then
    g.open({ visualSelectionUsage = "operate-within-range" })
  end
end, { range = "%", desc = "grug-far within visual range or buffer" })

-- Window navigation (splits: <C-\> right, <C-w>s below; resize: <C-arrows>, equalize <C-S-=>)
map("n", "<C-h>", "<C-w>h", { desc = "Go to left window" })
map("n", "<C-j>", "<C-w>j", { desc = "Go to lower window" })
map("n", "<C-k>", "<C-w>k", { desc = "Go to upper window" })
map("n", "<C-l>", "<C-w>l", { desc = "Go to right window" })
map("n", "<C-\\>", function()
  local ft = vim.bo.filetype
  if ft == "NvimTree" or ft == "Outline" then
    return -- disabled in explorer/outline (no split from these panes)
  end
  vim.cmd("wincmd v")
end, { desc = "Split right" })
map("n", "<C-S-Left>", "<C-w><", { desc = "Narrower window" })
map("n", "<C-S-Right>", "<C-w>>", { desc = "Wider window" })
map("n", "<C-S-Up>", "<C-w>+", { desc = "Taller window" })
map("n", "<C-S-Down>", "<C-w>-", { desc = "Shorter window" })
map("n", "<C-S-=>", "<C-w>=", { desc = "Equalize window sizes" })

-- Toggle zoom current split to full tab area; toggle again restores sizes
local zoom_state = {}
local zoom_augroup = vim.api.nvim_create_augroup("user.zoom", { clear = true })

local function normal_windows(tab)
  return vim.tbl_filter(function(win)
    return vim.api.nvim_win_is_valid(win) and vim.api.nvim_win_get_config(win).relative == ""
  end, vim.api.nvim_tabpage_list_wins(tab))
end

local function clear_zoom(tab)
  local key = tostring(tab)
  if zoom_state[key] == nil and vim.t.is_zoomed == nil then
    return
  end
  zoom_state[key] = nil
  if tab == vim.api.nvim_get_current_tabpage() then
    vim.t.is_zoomed = nil
    vim.cmd.redrawstatus()
  end
end

local function zoom_state_is_stale(tab, state)
  if not state or not vim.api.nvim_win_is_valid(state.win) then
    return true
  end
  return #normal_windows(tab) <= 1
end

map("n", "<C-S-CR>", function()
  local tab = vim.api.nvim_get_current_tabpage()
  local key = tostring(tab)
  local cur = vim.api.nvim_get_current_win()

  if zoom_state[key] then
    if zoom_state_is_stale(tab, zoom_state[key]) then
      clear_zoom(tab)
      return
    end
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

  local wins = normal_windows(tab)
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

vim.api.nvim_create_autocmd({ "TabClosed", "WinClosed" }, {
  group = zoom_augroup,
  callback = function(ev)
    if ev.event == "TabClosed" then
      zoom_state[tostring(ev.match)] = nil
      return
    end
    vim.schedule(function()
      local tab = vim.api.nvim_get_current_tabpage()
      if zoom_state_is_stale(tab, zoom_state[tostring(tab)]) then
        clear_zoom(tab)
      end
    end)
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

-- Quote textobjects are provided by mini.ai (a"/i" etc.).
-- next/last variants (an/in/al/il) are disabled globally in mini.ai.

-- Indent and keep visual selection
map("v", ">", ">gv", { desc = "Indent right and keep selection" })
map("v", "<", "<gv", { desc = "Indent left and keep selection" })

-- Centering - never truly at top/bottom of screen
map("n", "G", "Gzz", { desc = "Go to bottom + center" })
map("n", "gg", "ggzz", { desc = "Go to top + center" })
map("n", "n", "nzz", { desc = "Next search result (centered)" })
map("n", "N", "Nzz", { desc = "Previous search result (centered)" })

-- Line scroll keeps the cursor in place; native <C-y>/<C-e> remain available.
local function scroll_view(keys)
  vim.cmd("normal! " .. vim.api.nvim_replace_termcodes(keys, true, false, true))
end
map({ "n", "v" }, "<C-S-d>", function()
  scroll_view("<C-e>")
end, { desc = "Scroll view down one line" })
map({ "n", "v" }, "<C-S-D>", function()
  scroll_view("<C-e>")
end, { desc = "Scroll view down one line" })
map({ "n", "v" }, "<C-S-u>", function()
  scroll_view("<C-y>")
end, { desc = "Scroll view up one line" })
map({ "n", "v" }, "<C-S-U>", function()
  scroll_view("<C-y>")
end, { desc = "Scroll view up one line" })

-- Paste / Delete without yanking (black hole register)
-- Normal: <leader>X - <leader>x reserved for diagnostics prefix (see LSP section)
map("n", "<leader>X", '"_d', { desc = "Delete without yanking" })
map("v", "<leader>X", '"_d', { desc = "Delete without yanking" })
map("v", "<leader>x", '"_d', { desc = "Delete without yanking" })
map("v", "<leader>p", '"_dP', { desc = "Paste over without yanking" })

map("n", "J", "mzJ`z", { desc = "Join lines and keep cursor position" })
map("v", "J", "Jgv", { desc = "Join selected lines and reselect" })

-- Copy line or selection without moving it.
local function copy_line(dir)
  local pos = vim.fn.getcurpos()
  vim.cmd(dir == "down" and "copy ." or "copy .-1")
  vim.fn.cursor(dir == "up" and pos[2] + 1 or pos[2], pos[3])
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

local function quit_all_force()
  local modified = {}
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_is_loaded(buf) and vim.bo[buf].modified then
      modified[#modified + 1] = buffers.buffer_display_name(buf)
    end
  end

  if #modified > 0 then
    table.sort(modified)
    local summary = table.concat(modified, "\n")
    if not buffers.confirm_discard_unsaved(#modified, summary) then
      return
    end
  end

  vim.cmd("qa!")
end

map("n", "<leader>w", ":w<CR>", { desc = "Save file" })
map("n", "<leader>W", ":wqa<CR>", { desc = "Save all and quit Neovim" })
map("n", "<leader>q", function()
  buffers.close_editor(false)
end, { desc = "Close editor (split-aware)" })
map("n", "<leader>Q", quit_all_force, { desc = "Quit Neovim without saving" })
map("n", "<leader>n", function()
  local buf = vim.api.nvim_create_buf(true, false)
  vim.api.nvim_win_set_buf(0, buf)
  vim.bo[buf].buflisted = true
  vim.schedule(function()
    pcall(require("barbar.ui.render").update)
  end)
end, { desc = "New empty buffer" })
map("n", "<A-z>", function()
  vim.wo.wrap = not vim.wo.wrap
  local win = vim.api.nvim_get_current_win()
  if vim.w[win] and vim.w[win].codediff_restore then
    vim.w[win].codediff_wrap = vim.wo[win].wrap
    vim.schedule(git.enforce_codediff_diff_options)
  end
end, { desc = "Toggle word wrap" })

-- Copy paths from the active buffer.
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

return {}
