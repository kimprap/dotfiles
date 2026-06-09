-- Markdown prose/list display and native formatting.
-- Native 'breakindentopt=list:2' indents soft-wrapped bullet continuations.
-- Heading folds and <leader>m1/m2/… live in lua/markdown.lua.

vim.opt_local.expandtab = true
vim.opt_local.tabstop = 2
vim.opt_local.shiftwidth = 2
vim.opt_local.softtabstop = 2
vim.opt_local.wrap = true
vim.opt_local.linebreak = true
vim.opt_local.breakindent = true
vim.opt_local.breakindentopt = "list:2"
vim.opt_local.autoindent = true
vim.opt_local.formatoptions:append("n")
vim.opt_local.comments = {
  "b:-",
  "b:*",
  "b:+",
  "n:>",
}
vim.opt_local.formatlistpat = [[^\s*\d\+[\]:.)}\t ]\s\+\|^\s*[-*+]\s\+\|^\s*>\s*[-*+]\s\+]]