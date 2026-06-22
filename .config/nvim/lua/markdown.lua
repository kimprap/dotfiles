-- Markdown rendering and local viewing helpers.

local map = require("map")

local M = {}
local markdown_augroup = vim.api.nvim_create_augroup("user.markdown", { clear = true })

local fold_cache = {}

local function parse_fence(line)
  local ws, fence, rest = line:match("^(%s?%s?%s?)([`~]+)(.*)$")
  if not ws or #fence < 3 then
    return nil
  end
  local char = fence:sub(1, 1)
  if (char == "`" and fence:find("[^`]")) or (char == "~" and fence:find("[^~]")) then
    return nil
  end
  return char, #fence, rest
end

-- ATX-only foldexpr for <leader>m1/m2. Real headings outside fenced code
-- blocks start folds; content inherits the nearest heading level.
function M.heading_foldexpr(lnum)
  local bufnr = vim.api.nvim_get_current_buf()
  if lnum < 1 then
    return 0
  end
  local tick = vim.b[bufnr].changedtick or 0
  local cache = fold_cache[bufnr]
  if not cache or cache.tick ~= tick then
    cache = {
      tick = tick,
      computed_until = 0,
      last_level = 0,
      in_fence = false,
      fence_char = nil,
      fence_len = 0,
      levels = {},
    }
    fold_cache[bufnr] = cache
  end

  if cache.levels[lnum] ~= nil then
    return cache.levels[lnum]
  end

  if lnum > cache.computed_until then
    local start = cache.computed_until + 1
    local buf_lines = vim.api.nvim_buf_get_lines(bufnr, start - 1, lnum, false)
    local last_level = cache.last_level
    local in_fence = cache.in_fence
    local fence_char = cache.fence_char
    local fence_len = cache.fence_len
    for i, line in ipairs(buf_lines) do
      local cur = start + i - 1
      local hashes = nil
      if not in_fence then
        local ws, h = line:match("^(%s?%s?%s?)(#+)%s")
        if ws and h then
          hashes = h
        end
      end
      if hashes then
        local lev = #hashes
        cache.levels[cur] = ">" .. lev
        last_level = lev
      else
        cache.levels[cur] = last_level
      end
      local char, len, rest = parse_fence(line)
      if char then
        if not in_fence then
          in_fence = true
          fence_char = char
          fence_len = len
        elseif char == fence_char and len >= fence_len and rest:match("^%s*$") then
          in_fence = false
          fence_char = nil
          fence_len = 0
        end
      end
    end
    cache.last_level = last_level
    cache.in_fence = in_fence
    cache.fence_char = fence_char
    cache.fence_len = fence_len
    cache.computed_until = lnum
  end
  return cache.levels[lnum] or 0
end

vim.t.markdown_heading_foldexpr = M.heading_foldexpr

function M.markdown_foldtext()
  local header = vim.fn.getline(vim.v.foldstart)
  local level = vim.v.foldlevel
  local hl = "RenderMarkdownH" .. math.min(level, 6)
  return { { header, hl } }
end

vim.t.markdown_foldtext = M.markdown_foldtext

local function apply_markdown_folds()
  vim.t.markdown_heading_foldexpr = M.heading_foldexpr
  vim.t.markdown_foldtext = M.markdown_foldtext

  local desired_expr = "v:lua.vim.t.markdown_heading_foldexpr(v:lnum)"
  local desired_text = "v:lua.vim.t.markdown_foldtext()"
  if
    vim.wo.foldmethod ~= "expr"
    or vim.wo.foldexpr ~= desired_expr
    or vim.wo.foldenable ~= true
    or vim.wo.foldtext ~= desired_text
  then
    vim.wo.foldmethod = "expr"
    vim.wo.foldexpr = desired_expr
    vim.wo.foldenable = true
    vim.wo.foldtext = desired_text
  end
end
function M.toggle_heading_level(level)
  vim.api.nvim_buf_call(0, function()
    apply_markdown_folds()
    -- m1: target foldlevel 0 (H1+ visible); m2: target 1 (H1+H2 visible)
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
vim.api.nvim_create_autocmd({ "BufWipeout", "BufDelete" }, {
  group = markdown_augroup,
  callback = function(args)
    fold_cache[args.buf] = nil
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
