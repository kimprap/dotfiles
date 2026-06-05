-- Symbol outline — https://github.com/hedyhli/outline.nvim
-- LSP documentSymbol backend (marksman for markdown, language servers for code).
-- Phase 7 treesitter-context for sticky scroll; outline stays LSP documentSymbol-based.
-- Custom (intentional): exclude-noise filter, inline line numbers, manual sync keymaps.

local map = require("map")

local function load_outline_plugin()
  for _, path in ipairs(vim.api.nvim_get_runtime_file("lua/outline/init.lua", true)) do
    local chunk, err = loadfile(path)
    if not chunk then
      error(err)
    end
    return chunk()
  end
  error("outline.nvim plugin module not found")
end

-- Monkey patch target: outline.highlight.linenos and Sidebar:build_outline.
-- Why: render compact inline line numbers while keeping manual symbol sync behavior.
-- Ordering: must run before outline starts using Sidebar:build_outline.
-- Removal: drop when outline.nvim supports equivalent inline line numbers upstream.
-- Smoke test: <leader>o opens synced outline with one-space inline line numbers.
local outline_hl = require("outline.highlight")
local Sidebar = require("outline.sidebar")
local orig_build = Sidebar.build_outline

function outline_hl.linenos(bufnr, linenos, _)
  for index, lineno in ipairs(linenos) do
    local num = lineno:match("%S+$") or lineno
    vim.api.nvim_buf_set_extmark(bufnr, outline_hl.ns.vt, index - 1, -1, {
      virt_text = { { " " .. num, "OutlineLineno" } },
      virt_text_pos = "eol",
      hl_mode = "combine",
    })
  end
end

function Sidebar:build_outline(find_node)
  local cursor = orig_build(self, find_node)
  if self.view.buf and self.flats then
    local linenos = {}
    for _, node in ipairs(self.flats) do
      linenos[#linenos + 1] = tostring(node.range_start + 1)
    end
    outline_hl.linenos(self.view.buf, linenos)
  end
  return cursor
end

local outline = load_outline_plugin()

outline.setup({
  outline_window = {
    focus_on_open = true,
    width = 15,
  },
  outline_items = {
    show_symbol_details = false,
    show_symbol_lineno = false,
    highlight_hovered_item = true,
    auto_set_cursor = false,
    auto_update_events = {
      follow = false,
      items = { "LspAttach", "BufEnter", "BufWinEnter", "BufWritePost" },
    },
  },
  symbol_folding = {
    auto_unfold = { hovered = false, only = false },
  },
  -- Exclude literal/local noise; keep functions, modules, classes, namespaces, etc.
  -- Note: LSP documentSymbol only lists definitions (functions, modules, …),
  -- not bare statements like require("x").setup({}) or vim.api.nvim_create_autocmd(...).
  symbols = {
    filter = {
      default = {
        -- Show structural navigation targets; hide values, literals, params,
        -- object fields/properties, and config/data keys.
        "File",
        "Module",
        "Namespace",
        "Package",
        "Class",
        "Constructor",
        "Enum",
        "Interface",
        "Function",
        "Method",
        "Struct",
        "TypeAlias",
        "StaticMethod",
        "Macro",
        "Component",
        "Fragment",
      },
    },
  },
})

local function outline_unfold_ancestors(items, target)
  local function walk(nodes, path)
    for _, node in ipairs(nodes or {}) do
      if node == target then
        for _, parent in ipairs(path) do
          parent.folded = false
        end
        return true
      end
      if node.children then
        local next_path = { unpack(path) }
        next_path[#next_path + 1] = node
        if walk(node.children, next_path) then
          return true
        end
      end
    end
    return false
  end
  walk(items, {})
end

local function outline_deepest_symbol(items, lnum0)
  local best
  local function walk(nodes)
    for _, node in ipairs(nodes or {}) do
      if lnum0 >= node.range_start and lnum0 <= node.range_end then
        if not best or node.depth > best.depth then
          best = node
        end
        walk(node.children)
      end
    end
  end
  walk(items)
  return best
end

--- Sync outline cursor/highlight to editor position (manual only).
local function outline_sync_to_code(focus_outline, code_win)
  local sidebar = outline._get_sidebar(false)
  if not sidebar or not sidebar.view:is_open() then
    return false
  end

  code_win = code_win or sidebar.code.win
  if not code_win or not vim.api.nvim_win_is_valid(code_win) then
    return false
  end

  sidebar.code.win = code_win
  sidebar.code.buf = vim.api.nvim_win_get_buf(code_win)
  local lnum0 = vim.api.nvim_win_get_cursor(code_win)[1] - 1
  local target = outline_deepest_symbol(sidebar.items, lnum0)
  if target then
    outline_unfold_ancestors(sidebar.items, target)
  end

  sidebar:_update_lines(true, target)

  if focus_outline then
    sidebar:focus()
  end
  return true
end

local function outline_when_open(fn, attempt)
  attempt = attempt or 0
  if outline.is_open() then
    fn()
  elseif attempt < 40 then
    vim.defer_fn(function()
      outline_when_open(fn, attempt + 1)
    end, 50)
  end
end

local function outline_open_and_sync(focus_outline)
  local code_win = vim.api.nvim_get_current_win()

  if outline.is_open() then
    outline_sync_to_code(focus_outline, code_win)
    return
  end

  outline.open({ focus_outline = false })
  outline_when_open(function()
    outline_sync_to_code(focus_outline, code_win)
  end)
end

map("n", "<leader>o", function()
  if outline.is_open() then
    vim.cmd.OutlineClose()
    return
  end
  outline_open_and_sync(true)
end, { desc = "Toggle outline (sync to symbol)", nowait = true })

map("n", "<leader>O", function()
  outline_open_and_sync(true)
end, { desc = "Focus outline at symbol", nowait = true })

return outline
