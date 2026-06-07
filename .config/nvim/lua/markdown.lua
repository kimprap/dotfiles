-- Markdown rendering and local viewing helpers.

local map = require("map")

local M = {}
local markdown_augroup = vim.api.nvim_create_augroup("user.markdown", { clear = true })

local heading_colors = {
  "#f7768e",
  "#e0af68",
  "#9ece6a",
  "#7dcfff",
  "#7aa2f7",
  "#b39df3",
}

local function sync_render_markdown_highlights()
  local cursorline = vim.api.nvim_get_hl(0, { name = "CursorLine" })
  local normal = vim.api.nvim_get_hl(0, { name = "Normal" })
  local bg = cursorline.bg or normal.bg

  for level, fg in ipairs(heading_colors) do
    vim.api.nvim_set_hl(0, "RenderMarkdownH" .. level, {
      fg = fg,
      bold = true,
    })
    vim.api.nvim_set_hl(0, "RenderMarkdownH" .. level .. "Bg", {
      bg = bg,
      fg = fg,
      bold = true,
    })
  end
end

vim.api.nvim_create_autocmd("ColorScheme", {
  group = markdown_augroup,
  desc = "Use subtle markdown heading backgrounds",
  callback = sync_render_markdown_highlights,
})
sync_render_markdown_highlights()


require("render-markdown").setup({
  completions = { lsp = { enabled = true } },
  code = {
    width = "block",
    right_pad = 1,
  },
  dash = {
    width = function(ctx)
      return math.max(ctx.width - 2, 0)
    end,
  },
})

map("n", "<leader>mt", "<cmd>RenderMarkdown buf_toggle<CR>", { desc = "Toggle markdown render" })
map("n", "<leader>mT", "<cmd>RenderMarkdown toggle<CR>", { desc = "Toggle markdown render globally" })
map("n", "<leader>mp", "<cmd>RenderMarkdown preview<CR>", { desc = "Preview rendered markdown" })
map("n", "<leader>me", "<cmd>RenderMarkdown expand<CR>", { desc = "Expand markdown raw margin" })
map("n", "<leader>mc", "<cmd>RenderMarkdown contract<CR>", { desc = "Contract markdown raw margin" })

return M
