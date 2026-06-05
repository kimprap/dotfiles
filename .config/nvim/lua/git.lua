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

-- Git view: codediff (VSCode-style diffs)
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
    vim.notify("Already in CodeDiff - use q to close", vim.log.levels.INFO)
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
end, { desc = "Current file history (codediff)" })
map("v", "<leader>gL", function()
  codediff_open("history", { visual = true })
end, { desc = "Line history (codediff)" })

return M
