local git = require("git")
local map = require("map")
local workspace = require("workspace")

local sessions_augroup = vim.api.nvim_create_augroup("user.sessions", { clear = true })

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

local function close_and_delete_buffer(buf)
  for _, win in ipairs(vim.fn.win_findbuf(buf)) do
    if vim.api.nvim_win_is_valid(win) then
      pcall(vim.api.nvim_win_close, win, true)
    end
  end
  pcall(vim.api.nvim_buf_delete, buf, { force = true })
end

local function strip_buffers(predicate)
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if predicate(buf) then
      close_and_delete_buffer(buf)
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
  local outline = require("outline")
  outline.close_if_loaded()
end

local function sessions_strip_outline_buffers()
  strip_buffers(is_outline_buffer)
end

local function is_starter_buffer(buf)
  if not vim.api.nvim_buf_is_valid(buf) then
    return false
  end
  if vim.bo[buf].filetype == "ministarter" then
    return true
  end
  return vim.api.nvim_buf_get_name(buf):match("^ministarter://") ~= nil
end

local function sessions_strip_starter_buffers()
  strip_buffers(is_starter_buffer)
end

-- CodeDiff (from <leader>g*): special tabs with .codediff_restore on the side-by-side
-- original/modified windows + scratch "CodeDiff N" buffers. Must not persist across
-- <leader>Q / restarts (would restore as broken diff layouts instead of real buffers).
local function is_codediff_buffer(buf)
  if not vim.api.nvim_buf_is_valid(buf) then
    return false
  end
  local name = vim.api.nvim_buf_get_name(buf)
  if name:match("^CodeDiff ") or name:match("codediff://") then
    return true
  end
  for _, win in ipairs(vim.fn.win_findbuf(buf)) do
    if vim.api.nvim_win_is_valid(win) and vim.w[win] and vim.w[win].codediff_restore then
      return true
    end
  end
  return false
end

local function sessions_strip_codediff_buffers()
  strip_buffers(is_codediff_buffer)
end

local function sessions_close_codediff()
  -- Collect first (tab list can shift on close).
  local to_close = {}
  for _, tab in ipairs(vim.api.nvim_list_tabpages()) do
    for _, win in ipairs(vim.api.nvim_tabpage_list_wins(tab)) do
      if vim.api.nvim_win_is_valid(win) and vim.w[win] and vim.w[win].codediff_restore then
        table.insert(to_close, tab)
        break
      end
    end
  end
  for _, tab in ipairs(to_close) do
    if vim.api.nvim_tabpage_is_valid(tab) then
      if vim.api.nvim_get_current_tabpage() ~= tab then
        pcall(vim.api.nvim_set_current_tabpage, tab)
      end
      pcall(vim.cmd, "tabclose")
    end
  end
end

-- Strip dir/oil args so sessions don't restore ghost explorers.
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
  strip_buffers(is_oil_or_dir_buffer)
end

local function sessions_cleanup_ephemeral()
  -- Plugin UI is ephemeral; strip it before save and after restore.
  sessions_close_codediff()
  sessions_strip_codediff_buffers()
  sessions_cleanup_explorers()
  sessions_close_outline()
  sessions_strip_outline_buffers()
  sessions_strip_starter_buffers()
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
  pcall(MiniSessions.write, workspace.session_slug(), { force = true, verbose = false })
  workspace_session_refresh_detected()
end

local function workspace_session_delete(dir)
  local slug = workspace.session_slug(dir)
  local path = workspace.session_path(dir)
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
    local cwd_slug = workspace.session_slug()

    for name, session in pairs(MiniSessions.detected) do
      if session.type == "global" and workspace.is_session_file(name) and vim.fn.filereadable(session.path) == 1 then
        local is_here = name == cwd_slug
        items[#items + 1] = {
          name = workspace.session_slug_label(name) .. (is_here and " (resume here)" or ""),
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
  git.attach_loaded_buffers()
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
  file = "", -- global slug files only (see workspace.session_slug)
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
  group = sessions_augroup,
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
    vim.keymap.set("n", "q", function()
      MiniStarter.close(buf)
    end, vim.tbl_extend("force", opts, { desc = "Close welcome screen" }))
  end,
})

local function should_open_starter()
  if workspace.will_restore_session() then
    return false
  end
  -- Explicit file/dir targets open directly; bare nvim without a session opens starter.
  if vim.fn.argc() >= 1 then
    return false
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
  group = sessions_augroup,
  desc = "Restore session or open starter for bare nvim",
  once = true,
  callback = function()
    if workspace.will_restore_session() then
      local ok, err = pcall(MiniSessions.read, workspace.session_slug(), { force = true, verbose = false })
      if not ok then
        vim.notify("Session restore failed: " .. tostring(err), vim.log.levels.ERROR)
      end
    elseif should_open_starter() then
      sessions_close_codediff()
      sessions_cleanup_explorers()
      -- Reuse startup empty buffer (avoids a 2nd buffer when picking "Edit new buffer")
      MiniStarter.open(vim.api.nvim_get_current_buf())
      git.setup()
    else
      -- Explicit targets and other non-session startups.
      git.attach_loaded_buffers()
    end
  end,
})

vim.api.nvim_create_autocmd("VimLeavePre", {
  group = sessions_augroup,
  desc = "Close ephemeral UIs (outline, codediff) before mini.sessions autowrite on quit",
  callback = function()
    if workspace.has_session() then
      sessions_close_outline()
      sessions_close_codediff()
    end
  end,
})

map("n", "<leader>Sw", function()
  workspace_session_write()
  vim.notify("Session saved: " .. workspace.path_label(), vim.log.levels.INFO)
end, { desc = "Save workspace session for cwd" })

local function open_manual_starter()
  workspace_session_refresh_detected()
  sessions_close_codediff()
  sessions_cleanup_explorers()
  sessions_strip_starter_buffers()
  local buf = vim.api.nvim_create_buf(false, true)
  MiniStarter.open(buf)
end

map("n", "<leader>SS", open_manual_starter, { desc = "Open welcome / session picker" })

map("n", "<leader>Sd", function()
  workspace_session_delete()
  vim.v.this_session = ""
  workspace_session_refresh_detected()
  vim.notify("Session deleted: " .. workspace.path_label(), vim.log.levels.INFO)
end, { desc = "Delete workspace session for cwd" })

return {}
