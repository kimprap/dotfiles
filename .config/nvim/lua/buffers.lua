local map = require("map")

local M = {}

local function normal_windows()
  return vim.tbl_filter(function(win)
    return vim.api.nvim_win_is_valid(win) and vim.api.nvim_win_get_config(win).relative == ""
  end, vim.api.nvim_tabpage_list_wins(0))
end

local function primary_window()
  local wins = normal_windows()
  table.sort(wins, function(a, b)
    local apos = vim.api.nvim_win_get_position(a)
    local bpos = vim.api.nvim_win_get_position(b)
    if apos[1] == bpos[1] then
      return apos[2] < bpos[2]
    end
    return apos[1] < bpos[1]
  end)
  return wins[1]
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

function M.close_editor(force)
  local winid = vim.api.nvim_get_current_win()
  local bufnr = vim.api.nvim_get_current_buf()
  local buftype = vim.bo[bufnr].buftype
  if buftype ~= "" and buftype ~= "acwrite" then
    if #normal_windows() > 1 then
      vim.api.nvim_win_close(winid, true)
    else
      pcall(vim.cmd, "bdelete!")
    end
    return
  end

  local shown_in = vim.fn.win_findbuf(bufnr)
  local splits = #normal_windows() > 1

  if splits and #shown_in > 1 then
    vim.api.nvim_win_close(winid, true)
    return
  end

  if splits and (vim.bo[bufnr].modified or vim.api.nvim_buf_get_name(bufnr) == "") then
    require("mini.bufremove").delete(bufnr, force)
    return
  end

  if splits and primary_window() == winid then
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
    -- minifiles is a floating window (row below tabline) - do not offset tabs
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
  M.close_editor(false)
end, { desc = "Close editor (split-aware)" })
map("n", "<C-Q>", function()
  M.close_editor(true)
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

return M
