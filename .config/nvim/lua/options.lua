vim.g.sonokai_style = "maia" -- "andromeda", "atlantis", "espresso", "maia", "shusia"
vim.g.sonokai_enable_italic = 1
vim.cmd.colorscheme("sonokai")

local options_augroup = vim.api.nvim_create_augroup("user.options", { clear = true })
vim.filetype.add({
  pattern = {
    [".*/%.config/cursor/.*%.json"] = "jsonc",
  },
})

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

-- Foldtext for indent/LSP folds. Keep the source line's indentation and highlighting,
-- then append the folded-line count with the Folded group. Markdown overrides this.
local function line_hl_at(lnum, col)
  local ok, captures = pcall(vim.treesitter.get_captures_at_pos, 0, lnum - 1, col - 1)
  if ok and captures and #captures > 0 then
    local capture = captures[#captures].capture
    if capture and capture ~= "" then
      return "@" .. capture
    end
  end

  local id = vim.fn.synID(lnum, col, 1)
  local name = vim.fn.synIDattr(vim.fn.synIDtrans(id), "name")
  if name and name ~= "" then
    return name
  end

  return "Normal"
end

local function build_hl_chunks(text, lnum)
  local len = #text
  if len == 0 then
    return {}
  end

  local chunks = {}
  local current_hl = line_hl_at(lnum, 1)
  local current_start = 1

  for col = 2, len do
    local hl = line_hl_at(lnum, col)
    if hl ~= current_hl then
      table.insert(chunks, { text:sub(current_start, col - 1), current_hl })
      current_hl = hl
      current_start = col
    end
  end

  table.insert(chunks, { text:sub(current_start), current_hl })
  return chunks
end

_G.UserFoldText = function()
  local lnum = vim.v.foldstart or 0
  local endlnum = vim.v.foldend or lnum
  local count = math.max(1, endlnum - lnum + 1)

  if lnum < 1 then
    lnum = 1
  end

  local line_count = vim.api.nvim_buf_line_count(0)
  if line_count > 0 and lnum > line_count then
    lnum = line_count
  end

  local ok, chunks = pcall(build_hl_chunks, vim.fn.getline(lnum), lnum)
  if not ok or type(chunks) ~= "table" then
    chunks = { { vim.fn.getline(lnum), "Normal" } }
  end

  table.insert(chunks, { "  +-- " .. count .. " lines", "Folded" })
  return chunks
end

vim.opt.foldtext = "v:lua.UserFoldText()"
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
vim.opt.autoread = true
vim.opt.updatetime = 300
vim.opt.timeoutlen = 500
vim.opt.clipboard = "unnamedplus"
vim.opt.mouse = "a"
vim.opt.fillchars = { eob = " " }

vim.opt.iskeyword:append("-") -- Treat dash as part of a word (very useful for kebab-case, CSS, etc.)
vim.opt.path:append("**") -- Search in subdirectories with :find and gf
vim.opt.encoding = "utf-8"
vim.opt.endofline = true
vim.opt.fixendofline = true

-- Find and replace optimized
vim.opt.inccommand = "split"

-- ruler only in normal code files, hidden otherwise
vim.api.nvim_create_autocmd({ "BufWinEnter", "FileType" }, {
  group = options_augroup,
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

-- Save cleanup: trim before format; EOF blank line after conform (see lsp.lua).
vim.api.nvim_create_autocmd("BufWritePre", {
  group = options_augroup,
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

vim.api.nvim_create_autocmd("TextYankPost", {
  group = options_augroup,
  desc = "Highlight yanked text",
  callback = function()
    vim.hl.on_yank({ timeout = 200 })
  end,
})

vim.api.nvim_create_autocmd("BufReadPost", {
  group = options_augroup,
  desc = "Restore cursor position",
  callback = function()
    local mark = vim.api.nvim_buf_get_mark(0, '"')
    local lcount = vim.api.nvim_buf_line_count(0)
    if mark[1] > 0 and mark[1] <= lcount then
      vim.api.nvim_win_set_cursor(0, mark)
    end
  end,
})

-- Autoread + checktime on focus/term events: reload buffer content on external changes
-- (edits, git restore, etc.). Lazygit on_close adds explicit gitsigns refresh for signs.
vim.api.nvim_create_autocmd({ "FocusGained", "BufEnter", "CursorHold", "CursorHoldI", "TermClose" }, {
  group = options_augroup,
  desc = "External file change detection (with autoread)",
  callback = function()
    vim.cmd("checktime")
  end,
})

-- Theme-agnostic CursorLine/Visual (greyish-blue) + Search (bright fg). Derives live from Normal.bg on ColorScheme + init.
local function to_hex(c)
  if not c then
    return nil
  end
  if type(c) == "string" then
    return c
  end
  return string.format("#%06x", c)
end

local function lighten(c, factor)
  local hex = to_hex(c)
  if not hex or hex:find("NONE") then
    return nil
  end
  local r = tonumber(hex:sub(2, 3), 16) or 0
  local g = tonumber(hex:sub(4, 5), 16) or 0
  local b = tonumber(hex:sub(6, 7), 16) or 0
  r = math.min(255, math.floor(r + (255 - r) * factor))
  g = math.min(255, math.floor(g + (255 - g) * factor))
  b = math.min(255, math.floor(b + (255 - b) * factor))
  return string.format("#%02x%02x%02x", r, g, b)
end

-- Cursor row (more subtle) vs visual select highlight factors (tweak to taste).
local CURSOR_ROW_LIGHT_FACTOR = 0.10
local VISUAL_SELECT_LIGHT_FACTOR = 0.26

local function setup_lighter_grey_highlights()
  local normal = vim.api.nvim_get_hl(0, { name = "Normal", link = false })
  local base = normal and normal.bg
  if not base then
    return
  end

  local function to_lighter_cool_grey(base, factor)
    -- Lighten theme's Normal (keeps cool cast) + mild desat + blue bias → greyish-blue row/select.
    local lit = lighten(base, factor)
    if not lit then
      return nil
    end
    local r = tonumber(lit:sub(2, 3), 16) or 0
    local g = tonumber(lit:sub(4, 5), 16) or 0
    local b = tonumber(lit:sub(6, 7), 16) or 0
    local avg = math.floor((r + g + b) / 3 + 0.5)
    local pull = 0.30 -- mild desat; keeps some source tone
    r = math.floor(r + (avg - r) * pull)
    g = math.floor(g + (avg - g) * pull)
    b = math.floor(b + (avg - b) * pull)
    b = math.min(255, b + 4) -- blue bias (greyish-blue, not warm)
    r = math.max(0, r - 1)
    return string.format("#%02x%02x%02x", r, g, b)
  end

  -- Active row (CursorLine): greyish-blue. Factor tuned for subtlety (see CURSOR_ROW_LIGHT_FACTOR).
  local row = to_lighter_cool_grey(base, CURSOR_ROW_LIGHT_FACTOR)
  if row then
    vim.api.nvim_set_hl(0, "CursorLine", { bg = row })
  end

  -- Visual selection: even lighter greyish-blue, more pronounced (VISUAL_SELECT_LIGHT_FACTOR kept as-is).
  local sel = to_lighter_cool_grey(base, VISUAL_SELECT_LIGHT_FACTOR)
  if sel then
    vim.api.nvim_set_hl(0, "Visual", { bg = sel })
    vim.api.nvim_set_hl(0, "VisualNOS", { bg = sel })
  end

  -- Search text: force near-white fg for higher contrast on match highlights.
  local bright = "#f8fafc"
  local function whiten_search(name)
    local s = vim.api.nvim_get_hl(0, { name = name, link = false })
    if not s then
      return
    end
    local hl = { fg = bright }
    if s.bg then
      hl.bg = s.bg
    end
    vim.api.nvim_set_hl(0, name, hl)
  end
  whiten_search("Search")
  whiten_search("IncSearch")
  whiten_search("CurSearch")
end

vim.api.nvim_create_autocmd("ColorScheme", {
  group = options_augroup,
  desc = "Re-apply lighter greyish-blue CursorLine/Visual + Search highlights after theme",
  callback = setup_lighter_grey_highlights,
})
setup_lighter_grey_highlights()

return {}

