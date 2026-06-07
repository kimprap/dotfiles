-- Markdown prose/list display and native formatting.
-- Native 'breakindentopt=list:2' indents soft-wrapped bullet continuations.

vim.opt_local.wrap = true
vim.opt_local.linebreak = true
vim.opt_local.breakindent = true
vim.opt_local.breakindentopt = "list:2"
vim.opt_local.foldmethod = "expr"
vim.opt_local.foldexpr = "v:lua.vim.treesitter.foldexpr()"
vim.opt_local.autoindent = true
vim.opt_local.formatoptions:append("n")
vim.opt_local.comments = {
  "b:-",
  "b:*",
  "b:+",
  "n:>",
}
vim.opt_local.formatlistpat = [[^\s*\d\+[\]:.)}\t ]\s\+\|^\s*[-*+]\s\+\|^\s*>\s*[-*+]\s\+]]
local function toggle_heading_level(level)
  local folded_level = math.max(level - 1, 0)
  vim.wo.foldlevel = vim.wo.foldlevel == folded_level and 99 or folded_level
end

local function jump_heading(flags)
  vim.fn.search([[^\s*#\+ ]], flags)
end

vim.keymap.set("n", "<C-S-]>", function()
  jump_heading("W")
end, { buffer = true, desc = "Next markdown heading" })
vim.keymap.set("n", "<C-S-[>", function()
  jump_heading("bW")
end, { buffer = true, desc = "Previous markdown heading" })

for level = 1, 6 do
  vim.keymap.set("n", "<leader>m" .. level, function()
    toggle_heading_level(level)
  end, { buffer = true, desc = "Toggle markdown H" .. level .. " folds" })
end
