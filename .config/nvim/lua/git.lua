local map = require("map")

local M = {}

local gitsigns_signs = {
  add = { text = "▎" },
  change = { text = "▎" },
  delete = { text = "▁" },
  topdelete = { text = "▁" },
  changedelete = { text = "▎" },
  untracked = { text = "▎" },
}

local gitsigns_did_setup = false

function M.setup()
  if gitsigns_did_setup then
    return
  end
  require("gitsigns").setup({
    signs = gitsigns_signs,
    signs_staged = gitsigns_signs,
    attach_to_untracked = true,
    watch_gitdir = { enable = true },
    preview_config = {
      border = "rounded",
    },
  })
  gitsigns_did_setup = true
end

function M.attach_loaded_buffers()
  M.setup()
  local gitsigns = require("gitsigns")
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_is_loaded(buf) and vim.bo[buf].buftype == "" and vim.api.nvim_buf_get_name(buf) ~= "" then
      gitsigns.attach({ bufnr = buf })
    end
  end
end

--- Refresh gitsigns (signs + scrollbar marks) after external git changes.
--- Safe wrapper; ensures setup.
function M.refresh()
  if not gitsigns_did_setup then
    M.setup()
  end
  pcall(function()
    require("gitsigns").refresh()
  end)
end

-- Hunk navigation in normal buffers (CodeDiff tab uses buffer-local <C-]>/<C-[> instead)
map("n", "<C-]>", function()
  require("gitsigns").nav_hunk("next", { wrap = false })
end, { desc = "Next git hunk" })
map("n", "<C-[>", function()
  require("gitsigns").nav_hunk("prev", { wrap = false })
end, { desc = "Prev git hunk" })

-- Git diff views.
local codediff_did_setup = false
local codediff_focus_panel

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

--- Get the codediff explorer panel win (if present in the tab).
local function get_codediff_explorer_win(tabpage)
  tabpage = tabpage or vim.api.nvim_get_current_tabpage()
  local ok, lifecycle = pcall(require, "codediff.ui.lifecycle")
  if not ok then
    return nil
  end
  local panel = lifecycle.get_explorer(tabpage)
  if panel and panel.split and panel.split.winid and vim.api.nvim_win_is_valid(panel.split.winid) then
    return panel.split.winid
  end
  return nil
end

--- Pin explorer pane viewport (topline=1) so "Changes (...)" etc. stay at the top row.
--- Uses winrestview to change only scroll, leaving the plugin's selection cursor intact.
local function pin_codediff_explorer_view(tabpage)
  local ewin = get_codediff_explorer_win(tabpage)
  if not ewin then
    return
  end
  pcall(vim.api.nvim_win_call, ewin, function()
    local v = vim.fn.winsaveview()
    if v.topline ~= 1 then
      v.topline = 1
      vim.fn.winrestview(v)
    end
  end)
end

--- Re-apply sticky per-pane options (e.g. user-chosen wrap) on codediff diff panes.
--- Does not touch cursor or scroll position. Safe for repeated runtime calls.
local function enforce_codediff_diff_options(tabpage)
  tabpage = tabpage or vim.api.nvim_get_current_tabpage()
  for _, win in ipairs(vim.api.nvim_tabpage_list_wins(tabpage)) do
    if vim.api.nvim_win_is_valid(win) and vim.w[win] and vim.w[win].codediff_restore then
      if vim.w[win].codediff_wrap == nil then
        vim.w[win].codediff_wrap = vim.wo[win].wrap
      end
      local desired = vim.w[win].codediff_wrap
      if desired ~= nil and vim.wo[win].wrap ~= desired then
        pcall(vim.api.nvim_win_set_option, win, "wrap", desired)
      end
    end
  end
end

M.enforce_codediff_diff_options = enforce_codediff_diff_options

local function schedule_enforce(tabpage)
  vim.schedule(function()
    enforce_codediff_diff_options(tabpage)
  end)
end

--- Force codediff diff panes (wins with codediff_restore) to line 1 + zt on initial open.
--- (Prevents plugin auto-jump to first hunk.) Also enforces sticky options.
local function pin_codediff_diff_views(tabpage)
  tabpage = tabpage or vim.api.nvim_get_current_tabpage()
  for _, win in ipairs(vim.api.nvim_tabpage_list_wins(tabpage)) do
    if vim.api.nvim_win_is_valid(win) and vim.w[win] and vim.w[win].codediff_restore then
      pcall(vim.api.nvim_win_set_cursor, win, { 1, 0 })
      pcall(vim.api.nvim_win_call, win, function()
        vim.cmd("silent! normal! zt")
      end)
    end
  end
  enforce_codediff_diff_options(tabpage)
end

--- Pin diff panes to top (initial open only) + explorer header.
local function pin_codediff_views(tabpage)
  pin_codediff_diff_views(tabpage)
  vim.schedule(function()
    pin_codediff_explorer_view(tabpage)
  end)
end

--- Execute `fn(target_win)` after switching to the tab before `codediff_tabpage`
--- (creating a new tab at the start if this is the first tab). After `fn` returns,
--- switch back and close the codediff tab. This centralizes the tab dance used
--- by custom openers like our gf handler.
local function with_codediff_prev_tab(codediff_tabpage, fn)
  -- Snapshot the reference tab (prefer the explicit codediff one when valid).
  local current_tab = (codediff_tabpage and vim.api.nvim_tabpage_is_valid(codediff_tabpage)) and codediff_tabpage
    or vim.api.nvim_get_current_tabpage()

  local tabs = vim.api.nvim_list_tabpages()
  local current_index
  for i, tab in ipairs(tabs) do
    if tab == current_tab then
      current_index = i
      break
    end
  end

  local target_tab
  if current_index and current_index > 1 then
    target_tab = tabs[current_index - 1]
  else
    vim.cmd("tabnew")
    target_tab = vim.api.nvim_get_current_tabpage()
    vim.cmd("tabmove 0")
  end
  if vim.api.nvim_get_current_tabpage() ~= target_tab then
    vim.api.nvim_set_current_tabpage(target_tab)
  end

  local target_win = vim.api.nvim_get_current_win()
  fn(target_win)

  if vim.api.nvim_tabpage_is_valid(current_tab) then
    vim.api.nvim_set_current_tabpage(current_tab)
    vim.cmd("tabclose")
  end
end

--- Unlist any of the given buffers that look like ephemeral codediff side-buffers
--- (scratch "CodeDiff N" or codediff:// virtual buffers). Real file buffers that
--- the plugin may have reused for the "modified" pane are left listed.
local function unlist_ephemeral_codediff_buffers(bufs)
  for _, b in ipairs(bufs or {}) do
    if vim.api.nvim_buf_is_valid(b) then
      local nm = vim.api.nvim_buf_get_name(b)
      local bt = vim.bo[b].buftype
      if bt == "nofile" or nm:match("^CodeDiff ") or nm:match("codediff://") then
        vim.bo[b].buflisted = false
      end
    end
  end
end

local function codediff_open_current_file_in_previous_tab(tabpage, original_bufnr, modified_bufnr)
  local lifecycle = require("codediff.ui.lifecycle")
  local session = lifecycle.get_session(tabpage)
  if not session then
    return
  end

  local current_buf = vim.api.nvim_get_current_buf()
  if current_buf ~= original_bufnr and current_buf ~= modified_bufnr then
    return
  end

  local original_path, modified_path = lifecycle.get_paths(tabpage)
  -- Prefer modified_path (the "current"/on-disk side) so `gf` is consistent
  -- whether invoked from the left or right pane of the codediff tab.
  local file_ref = (modified_path and modified_path ~= "") and modified_path or original_path
  if not file_ref or file_ref == "" then
    vim.notify("Buffer has no associated file path", vim.log.levels.WARN)
    return
  end

  local git_root = session.git_root
  local target_file = file_ref
  if git_root and git_root ~= "" and not (file_ref:match("^/") or file_ref:match("^%a:")) then
    local root = git_root:gsub("[/\\]$", "")
    local rel = file_ref:gsub("^[/\\]", "")
    target_file = root .. "/" .. rel
  end
  target_file = vim.fn.fnamemodify(target_file, ":p")

  local cursor = vim.api.nvim_win_get_cursor(0)

  with_codediff_prev_tab(tabpage, function(target_win)
    local ok, err = pcall(vim.cmd, "edit " .. vim.fn.fnameescape(target_file))
    if not ok then
      vim.notify("Failed to open file in previous tab: " .. tostring(err), vim.log.levels.ERROR)
      return
    end

    local buf = vim.api.nvim_win_get_buf(target_win)
    local lcount = vim.api.nvim_buf_line_count(buf)
    local lnum = math.min(math.max(cursor[1], 1), lcount)
    pcall(vim.api.nvim_win_set_cursor, target_win, { lnum, cursor[2] })
  end)

  unlist_ephemeral_codediff_buffers({ original_bufnr, modified_bufnr })

  vim.schedule(function()
    local cur = vim.api.nvim_get_current_buf()
    if vim.api.nvim_buf_is_valid(cur) then
      vim.bo[cur].buflisted = true
      pcall(function()
        require("barbar.ui.render").update()
      end)
    end
  end)
end

local function setup_codediff_once()
  if codediff_did_setup then
    return
  end

  -- Wrap to inject <C-e> (for history) + our gf handler using the plugin's set_tab_keymap
  -- (handles re-apply on tab switch and keymap cleanup).
  local lifecycle = require("codediff.ui.lifecycle")
  local view_keymaps = require("codediff.ui.view.keymaps")
  local setup_all_keymaps_orig = view_keymaps._dotfiles_setup_all_keymaps_orig or view_keymaps.setup_all_keymaps

  view_keymaps._dotfiles_setup_all_keymaps_orig = setup_all_keymaps_orig
  view_keymaps.setup_all_keymaps = function(tabpage, original_bufnr, modified_bufnr, is_explorer_mode)
    setup_all_keymaps_orig(tabpage, original_bufnr, modified_bufnr, is_explorer_mode)
    local session = lifecycle.get_session(tabpage)
    if session and (session.mode == "explorer" or session.mode == "history") then
      lifecycle.set_tab_keymap(tabpage, "n", "<C-e>", function()
        codediff_focus_panel(tabpage)
      end, { desc = "Focus explorer/history panel" })
    end
    if original_bufnr and modified_bufnr then
      lifecycle.set_tab_keymap(tabpage, "n", "gf", function()
        codediff_open_current_file_in_previous_tab(tabpage, original_bufnr, modified_bufnr)
      end, { desc = "Open file in previous tab" })
    end
    -- After the plugin has wired everything (keymaps, renders, sessions), force stable initial views:
    -- diff panes at line 1 (no auto first-hunk), explorer pane header pinned at top (no reveal offsets).
    vim.schedule(function()
      pin_codediff_views(tabpage)
    end)
  end

  require("codediff").setup({
    diff = {
      cycle_next_hunk = false,
      jump_to_first_change = false, -- do not auto-focus first hunk; we force line 1 explicitly for stability
    },
    explorer = {
      width = 28,
      view_mode = "tree",
      flatten_dirs = true,
      indent_markers = true,
      initial_focus = "explorer",
      focus_on_select = false,
    },
    history = {
      position = "left",
      width = 28,
      view_mode = "tree",
    },
    keymaps = {
      view = {
        focus_explorer = false,
        close_on_open_in_prev_tab = true,
        next_hunk = "<C-]>",
        prev_hunk = "<C-[>",
        stage_hunk = false,
        unstage_hunk = false,
        discard_hunk = false,
        hunk_textobject = false,
      },
    },
  })

  codediff_did_setup = true

  local stability_group = vim.api.nvim_create_augroup("user.codediff_stability", { clear = true })

  -- Protect explorer header and re-apply wrap on diff-pane activity (counters plugin reveal/scroll).
  vim.api.nvim_create_autocmd("WinScrolled", {
    group = stability_group,
    desc = "Protect explorer header + re-apply wrap on codediff diff activity",
    callback = function(ev)
      local winid = tonumber(ev.match)
      if not winid or not vim.api.nvim_win_is_valid(winid) then
        return
      end
      if not (vim.w[winid] and vim.w[winid].codediff_restore) then
        return
      end
      local tab = vim.api.nvim_win_get_tabpage(winid)
      if not codediff_in_tab(tab) then
        return
      end
      vim.schedule(function()
        enforce_codediff_diff_options(tab)
        pin_codediff_explorer_view(tab)
      end)
    end,
  })

  -- Re-assert stored wrap on OptionSet (plugin side-by-side sync resets after toggles or activity).
  vim.api.nvim_create_autocmd("OptionSet", {
    group = stability_group,
    pattern = "wrap",
    desc = "Re-assert stored wrap on codediff diff panes after sets/resets",
    callback = function()
      local win = vim.api.nvim_get_current_win()
      if vim.w[win] and vim.w[win].codediff_restore then
        schedule_enforce()
        vim.defer_fn(function()
          enforce_codediff_diff_options()
        end, 10)
      end
    end,
  })

  -- Re-apply per-pane wrap after FocusGained (app switch return; plugin may re-sync).
  vim.api.nvim_create_autocmd("FocusGained", {
    group = stability_group,
    desc = "Re-apply codediff wrap after external focus return",
    callback = function()
      local tab = vim.api.nvim_get_current_tabpage()
      if not codediff_in_tab(tab) then
        return
      end
      vim.schedule(function()
        enforce_codediff_diff_options(tab)
        pin_codediff_explorer_view(tab)
        vim.defer_fn(function()
          enforce_codediff_diff_options(tab)
        end, 15)
      end)
    end,
  })

  -- Re-assert per-pane wrap on WinEnter (cross-pane focus triggers plugin re-sync of scrollbound pair).
  vim.api.nvim_create_autocmd("WinEnter", {
    group = stability_group,
    desc = "Re-apply per-pane wrap when entering a codediff diff pane",
    callback = function()
      local win = vim.api.nvim_get_current_win()
      if vim.w[win] and vim.w[win].codediff_restore then
        schedule_enforce()
        vim.defer_fn(function()
          enforce_codediff_diff_options()
        end, 5)
      end
    end,
  })
end

vim.api.nvim_create_autocmd("VimEnter", {
  group = vim.api.nvim_create_augroup("user.codediff_lazy", { clear = true }),
  once = true,
  desc = "Load CodeDiff config on first command use",
  callback = function()
    local command = vim.api.nvim_get_commands({})["CodeDiff"]
    if not command or type(command.callback) ~= "function" then
      return
    end
    local original_callback = command.callback
    vim.api.nvim_create_user_command("CodeDiff", function(opts)
      setup_codediff_once()
      original_callback(opts)
    end, {
      nargs = "*",
      bang = true,
      range = true,
      complete = command.complete,
      desc = command.definition,
    })
  end,
})

local function codediff_open(args, opts)
  opts = opts or {}
  if codediff_in_tab() then
    vim.notify("Already in CodeDiff - use q to close", vim.log.levels.INFO)
    return
  end
  setup_codediff_once()
  if opts.visual then
    vim.cmd("'<,'>CodeDiff " .. args)
  elseif args == "" then
    vim.cmd("CodeDiff")
  else
    vim.cmd("CodeDiff " .. args)
  end
  -- Ensure stable views (line 1 in diffs, pinned header in explorer) after the tab + panels settle.
  vim.schedule(function()
    local tab = vim.api.nvim_get_current_tabpage()
    pin_codediff_views(tab)
  end)
end

--- Focus explorer sidebar or history panel from any CodeDiff buffer.
codediff_focus_panel = function(tabpage)
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
map("n", "<leader>gl", function()
  codediff_open("history %")
end, { desc = "Current file history (codediff)" })
map("v", "<leader>gl", function()
  codediff_open("history", { visual = true })
end, { desc = "Line history (codediff)" })
map("n", "<leader>gL", function()
  codediff_open("history")
end, { desc = "Project history (codediff)" })

return M
