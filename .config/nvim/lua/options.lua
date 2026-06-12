vim.g.sonokai_style = "maia" -- "andromeda", "atlantis", "espresso", "maia", "shusia"
vim.g.sonokai_enable_italic = 1
vim.cmd.colorscheme("sonokai")

local options_augroup = vim.api.nvim_create_augroup("user.options", { clear = true })

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

return {}
