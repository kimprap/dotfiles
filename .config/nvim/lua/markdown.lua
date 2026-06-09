-- Markdown rendering and local viewing helpers.

local map = require("map")

local M = {}
local markdown_augroup = vim.api.nvim_create_augroup("user.markdown", { clear = true })

-- ATX-only foldexpr for <leader>m1/m2. Headers report >N (fold start);
-- content lines inherit the nearest preceding header level. Paired with
-- custom foldtext (below) so collapsed headers keep their RenderMarkdownH*
-- color while Folded styles any trailing dots.
function M.heading_foldexpr(lnum)
  local line = vim.fn.getline(lnum)
  local hashes = line:match("^%s*(#+)%s")
  if hashes then
    return ">" .. #hashes
  end
  for i = lnum - 1, 1, -1 do
    local h = vim.fn.getline(i):match("^%s*(#+)%s")
    if h then
      return #h
    end
  end
  return 0
end

vim.t.markdown_heading_foldexpr = M.heading_foldexpr

local function apply_markdown_folds()
  vim.t.markdown_heading_foldexpr = M.heading_foldexpr
  vim.wo.foldmethod = "expr"
  vim.wo.foldexpr = "v:lua.vim.t.markdown_heading_foldexpr(v:lnum)"
  vim.wo.foldenable = true

  -- foldtext returns a chunk so the header keeps its RenderMarkdownH* color;
  -- trailing dots/fill use the Folded group (grey).
  vim.t.markdown_foldtext = function()
    local header = vim.fn.getline(vim.v.foldstart)
    local level = vim.v.foldlevel
    local hl = "RenderMarkdownH" .. math.min(level, 6)
    return { { header, hl } }
  end
  vim.wo.foldtext = "v:lua.vim.t.markdown_foldtext()"
end

function M.toggle_heading_level(level)
  vim.api.nvim_buf_call(0, function()
    apply_markdown_folds()
    -- m1 (target 0) collapses everything under H1 (headers stay visible+colored);
    -- m2 shows H1+H2 headers (colored) but collapses their content.
    local target = math.max(level - 1, 0)
    if vim.wo.foldlevel == target then
      vim.wo.foldlevel = 99
      vim.cmd("normal! zR")
    else
      vim.wo.foldlevel = target
      vim.cmd("normal! zX")
      vim.wo.foldenable = true
    end
  end)
end

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

vim.api.nvim_create_autocmd("FileType", {
  group = markdown_augroup,
  pattern = { "markdown", "markdown.mdx" },
  callback = function(args)
    vim.api.nvim_buf_call(args.buf, apply_markdown_folds)
    for h = 1, 6 do
      vim.keymap.set("n", "<leader>m" .. h, function()
        M.toggle_heading_level(h)
      end, { buffer = args.buf, nowait = true, desc = "Toggle markdown H" .. h .. " folds" })
    end

    -- Buf-local search cycle (wins over gitsigns <C-[/]>; no tag/identifier errors).
    local function goto_md_header(forward)
      local pat = [[^\s*#\+\s]]
      local flags = (forward and "" or "b") .. "W"
      vim.fn.search(pat, flags)
    end
    vim.keymap.set("n", "<C-S-]>", function()
      goto_md_header(true)
    end, { buffer = args.buf, desc = "Next markdown header" })
    vim.keymap.set("n", "<C-S-[>", function()
      goto_md_header(false)
    end, { buffer = args.buf, desc = "Previous markdown header" })
  end,
})

vim.api.nvim_create_autocmd("LspAttach", {
  group = markdown_augroup,
  callback = function(args)
    local ft = vim.bo[args.buf].filetype
    if ft == "markdown" or ft == "markdown.mdx" then
      vim.api.nvim_buf_call(args.buf, apply_markdown_folds)
    end
  end,
})

-- Global maps (so mini.clue shows them and they work even without buffer-local).
for heading = 1, 6 do
  map("n", "<leader>m" .. heading, function()
    local ft = vim.bo.filetype
    if ft ~= "markdown" and ft ~= "markdown.mdx" then
      return
    end
    M.toggle_heading_level(heading)
  end, { nowait = true, desc = "Toggle markdown H" .. heading .. " folds" })
end

map("n", "<leader>mt", "<cmd>RenderMarkdown buf_toggle<CR>", { desc = "Toggle markdown render" })
map("n", "<leader>mT", "<cmd>RenderMarkdown toggle<CR>", { desc = "Toggle markdown render globally" })
map("n", "<leader>mp", "<cmd>RenderMarkdown preview<CR>", { desc = "Preview rendered markdown" })
map("n", "<leader>me", "<cmd>RenderMarkdown expand<CR>", { desc = "Expand markdown raw margin" })
map("n", "<leader>mc", "<cmd>RenderMarkdown contract<CR>", { desc = "Contract markdown raw margin" })

return M

