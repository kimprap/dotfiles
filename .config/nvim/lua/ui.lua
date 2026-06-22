local map = require("map")

local M = {}

local search_line_cache = {}

local function search_cache_key(bufnr)
  return table.concat({
    bufnr,
    vim.b[bufnr].changedtick or 0,
    vim.fn.getreg("/"),
    vim.o.ignorecase and "1" or "0",
    vim.o.smartcase and "1" or "0",
    vim.o.magic and "1" or "0",
  }, "\n")
end

local function get_search_line_positions(bufnr)
  bufnr = bufnr or vim.api.nvim_get_current_buf()
  local pattern = vim.fn.getreg("/")
  if pattern == "" then
    return {}
  end

  local key = search_cache_key(bufnr)
  local cached = search_line_cache[bufnr]
  if cached and cached.key == key then
    return cached.positions
  end

  local positions = {}
  local seen_lines = {}
  local lines = vim.api.nvim_buf_get_lines(bufnr, 0, -1, false)
  for lnum, line in ipairs(lines) do
    local start = 0
    while true do
      local match = vim.fn.matchstrpos(line, pattern, start)
      if not match or match[2] < 0 then
        break
      end
      if not seen_lines[lnum] then
        seen_lines[lnum] = true
        positions[#positions + 1] = lnum
      end
      start = match[3]
      if start <= match[2] then
        start = match[2] + 1
      end
    end
  end

  search_line_cache[bufnr] = { key = key, positions = positions }
  return positions
end

local function mark_text(config, mark_type, level)
  local text = config.marks[mark_type].text
  if type(text) == "table" then
    return text[level or 1] or text[1]
  end
  return text
end

function M.refresh_search_scrollbar()
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

local function search_word_stay(backward, partial)
  local pos = vim.fn.getpos(".")
  local cmd = (partial and (backward and "g#" or "g*") or (backward and "#" or "*"))
  vim.cmd("keepjumps normal! " .. cmd)
  vim.fn.setpos(".", pos)
  M.refresh_search_scrollbar()
end

map("n", "*", function()
  search_word_stay(false, false)
end, { desc = "Search word (stay in place)" })
map("n", "#", function()
  search_word_stay(true, false)
end, { desc = "Search word backward (stay in place)" })
map("n", "g*", function()
  search_word_stay(false, true)
end, { desc = "Search partial word (stay in place)" })
map("n", "g#", function()
  search_word_stay(true, true)
end, { desc = "Search partial word backward (stay in place)" })

map("n", "<leader>c", function()
  vim.cmd.nohlsearch()
  M.refresh_search_scrollbar()
end, { desc = "Clear search highlight" })

-- Fold keymaps in addition to native za/zR/zM. Indent folds often start on the
-- first child line, so retry there while keeping the cursor on the parent.
map("n", "<leader>zf", function()
  local lnum = vim.fn.line(".")
  if vim.fn.foldclosed(lnum) ~= -1 then
    vim.cmd("silent! normal! zo")
    return
  end

  vim.cmd("silent! normal! za")
  if vim.fn.foldclosed(lnum) == -1 and lnum < vim.fn.line("$") then
    local cursor = vim.api.nvim_win_get_cursor(0)
    vim.api.nvim_win_set_cursor(0, { lnum + 1, 0 })
    vim.cmd("silent! normal! za")
    vim.api.nvim_win_set_cursor(0, cursor)
  end
end, { desc = "Toggle fold" })
map("n", "<leader>zo", "zR", { desc = "Open all folds" })
map("n", "<leader>zc", "zM", { desc = "Close all folds" })

local scrollbar = require("scrollbar")
local scrollbar_render = scrollbar.render
local scrollbar_clear = scrollbar.clear

local function current_win_is_float()
  return vim.api.nvim_win_get_config(0).relative ~= ""
end

-- nvim-scrollbar has filetype/buftype excludes but no window-kind exclude.
-- fzf-lua's builtin previewer already draws its own preview scrollbar; rendering
-- the global editor scrollbar inside that floating preview creates overlapping
-- handles, especially after <C-d>/<C-u> preview scrolls.
function scrollbar.render()
  if current_win_is_float() then
    scrollbar_clear()
    return
  end
  scrollbar_render()
end

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
  if vim.bo[bufnr].buftype ~= "" then
    return {}
  end
  local config = require("scrollbar.config").get()
  local marks = {}
  for _, lnum in ipairs(get_search_line_positions(bufnr)) do
    marks[#marks + 1] = {
      line = lnum - 1,
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
    M.refresh_search_scrollbar()
  end,
})

vim.api.nvim_create_autocmd({ "BufWipeout", "BufDelete" }, {
  group = vim.api.nvim_create_augroup("user.scrollbar_search_cache", { clear = true }),
  callback = function(args)
    search_line_cache[args.buf] = nil
  end,
})

return M
