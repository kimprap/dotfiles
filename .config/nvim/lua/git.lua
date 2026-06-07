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

-- Hunk navigation in normal buffers (CodeDiff tab uses buffer-local <C-]>/<C-[> instead)
map("n", "<C-]>", function()
  require("gitsigns").nav_hunk("next")
end, { desc = "Next git hunk" })
map("n", "<C-[>", function()
  require("gitsigns").nav_hunk("prev")
end, { desc = "Prev git hunk" })

-- Git diff views.
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

local codediff_did_setup = false
local codediff_focus_panel

local function codediff_open_current_file_in_previous_tab(tabpage, original_bufnr, modified_bufnr)
  local lifecycle = require("codediff.ui.lifecycle")
  local session = lifecycle.get_session(tabpage)
  if not session then
    return
  end

  local current_buf = vim.api.nvim_get_current_buf()
  local side
  if current_buf == original_bufnr then
    side = "original"
  elseif current_buf == modified_bufnr then
    side = "modified"
  else
    return
  end

  local original_path, modified_path = lifecycle.get_paths(tabpage)
  local rel_path = side == "original" and original_path or modified_path
  local target_file
  if rel_path and rel_path ~= "" and session.git_root then
    target_file = session.git_root .. "/" .. rel_path
  else
    target_file = vim.api.nvim_buf_get_name(current_buf)
  end
  if not target_file or target_file == "" then
    vim.notify("Buffer has no associated file path", vim.log.levels.WARN)
    return
  end

  local cursor = vim.api.nvim_win_get_cursor(0)
  local current_tab = vim.api.nvim_get_current_tabpage()
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

  local ok, err = pcall(vim.cmd, "edit " .. vim.fn.fnameescape(target_file))
  if not ok then
    vim.notify("Failed to open file: " .. err, vim.log.levels.ERROR)
    return
  end
  pcall(vim.api.nvim_win_set_cursor, vim.api.nvim_get_current_win(), cursor)

  if vim.api.nvim_tabpage_is_valid(current_tab) then
    vim.api.nvim_set_current_tabpage(current_tab)
    vim.cmd("tabclose")
  end
end

local function setup_codediff_once()
  if codediff_did_setup then
    return
  end

  -- Upstream only binds focus_explorer for explorer mode; bind it for history too.
  local lifecycle = require("codediff.ui.lifecycle")
  local view_keymaps = require("codediff.ui.view.keymaps")
  local setup_all_keymaps_orig = view_keymaps._dotfiles_setup_all_keymaps_orig or view_keymaps.setup_all_keymaps

  view_keymaps._dotfiles_setup_all_keymaps_orig = setup_all_keymaps_orig
  view_keymaps.setup_all_keymaps = function(tabpage, original_bufnr, modified_bufnr, is_explorer_mode)
    setup_all_keymaps_orig(tabpage, original_bufnr, modified_bufnr, is_explorer_mode)
    local session = lifecycle.get_session(tabpage)
    if not session or (session.mode ~= "explorer" and session.mode ~= "history") then
      return
    end
    lifecycle.set_tab_keymap(tabpage, "n", "<C-e>", function()
      codediff_focus_panel(tabpage)
    end, { desc = "Focus explorer/history panel" })
    lifecycle.set_tab_keymap(tabpage, "n", "gf", function()
      codediff_open_current_file_in_previous_tab(tabpage, original_bufnr, modified_bufnr)
    end, { desc = "Open file in previous tab" })
  end

  require("codediff").setup({
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
