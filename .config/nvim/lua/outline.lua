-- Symbol outline backed by LSP document symbols.
-- Keeps the sidebar concise with filtered symbols, inline line numbers, and manual sync.

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

local M = {}
local outline
local outline_did_setup = false

local function setup_outline_once()
  if outline_did_setup then
    return outline
  end

  local outline_hl = require("outline.highlight")
  local Sidebar = require("outline.sidebar")
  local orig_build = Sidebar.build_outline

  -- Col 0 so the item's fold marker / first symbol is at the left edge.
  function Sidebar:update_cursor_pos(current)
    if not current or not self.view.win or not vim.api.nvim_win_is_valid(self.view.win) then
      return
    end
    vim.api.nvim_win_set_cursor(self.view.win, { current.line_in_outline, 0 })
  end

  -- Right-side line numbers via eol virt_text (no left gutter).
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
    -- Keep only the deepest node highlighted; re-apply hovers + line numbers.
    if cursor and self.hovered and #self.hovered > 1 then
      for _, node in ipairs(self.flats or {}) do
        node.hovered = node == cursor
      end
      self.hovered = { cursor }
    end
    if self.view.buf and self.flats then
      outline_hl.clear_hovers(self.view.buf)
      outline_hl.hovers(self.view.buf, self.flats)

      local linenos = {}
      for _, node in ipairs(self.flats) do
        linenos[#linenos + 1] = tostring(node.range_start + 1)
      end
      outline_hl.linenos(self.view.buf, linenos)
    end
    return cursor
  end

  outline = load_outline_plugin()

  outline.setup({
    outline_window = {
      focus_on_open = false,
      width = 32,
      auto_width = {
        enabled = false,
        max_width = 32,
        include_symbol_details = false,
      },
      relative_width = false,
      show_cursorline = true,
      hide_cursor = false,
    },
    outline_items = {
      show_symbol_details = false,
      show_symbol_lineno = false,
      highlight_hovered_item = true,
      auto_set_cursor = false,
      auto_update_events = {
        follow = { "CursorMoved", "WinScrolled" },
        items = { "BufEnter", "BufWinEnter", "BufWritePost" },
      },
    },
    symbol_folding = {
      autofold_depth = 2,
      auto_unfold = { hovered = false, only = false },
    },
    providers = {
      lsp = {
        blacklist_clients = { "marksman" },
      },
    },
    symbols = {
      filter = {
        default = {
          "File",
          "Module",
          "Namespace",
          "Package",
          "Class",
          "Constructor",
          "Enum",
          "Interface",
          "Property",
          "Field",
          "Variable",
          "Boolean",
          "Array",
          "Function",
          "Method",
          "Struct",
          "TypeAlias",
          "StaticMethod",
          "Macro",
          "Component",
          "Fragment",
        },
        markdown = { "String" },
      },
      icons = {
        Function = { icon = "ƒ", hl = "Function" },
        Method = { icon = "ƒ", hl = "Function" },
        StaticMethod = { icon = "ƒ", hl = "Function" },
        Constructor = { icon = "ƒ", hl = "Special" },
        Variable = { icon = "𝓥", hl = "Constant" },
        Boolean = { icon = "𝓑", hl = "Boolean" },
        Array = { icon = "[]", hl = "Identifier" },
      },
    },
  })

  outline_did_setup = true
  return outline
end

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
        if
            not best
            or node.depth > best.depth
            or (node.depth == best.depth and node.range_start > best.range_start)
        then
          best = node
        end
        walk(node.children)
      end
    end
  end
  walk(items)
  return best
end

local function outline_sync_to_code(focus_outline, code_win)
  local outline_api = setup_outline_once()
  local sidebar = outline_api._get_sidebar(false)
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

local function equalize_windows_soon()
  vim.defer_fn(function()
    pcall(vim.cmd, "wincmd =")
  end, 80)
end

local function outline_when_open(fn, attempt)
  attempt = attempt or 0
  if outline and outline.is_open() then
    fn()
  elseif attempt < 40 then
    vim.defer_fn(function()
      outline_when_open(fn, attempt + 1)
    end, 50)
  end
end

local function outline_open_and_sync(focus_outline)
  local outline_api = setup_outline_once()
  local code_win = vim.api.nvim_get_current_win()

  if outline_api.is_open() then
    outline_sync_to_code(focus_outline, code_win)
    return
  end

  outline_api.open({ focus_outline = false })
  outline_when_open(function()
    outline_sync_to_code(focus_outline, code_win)
  end)
end

function M.is_open()
  return outline ~= nil and outline.is_open()
end

function M.close_if_loaded()
  if M.is_open() then
    pcall(vim.cmd, "OutlineClose")
    equalize_windows_soon()
  end
end

map("n", "<leader>o", function()
  if M.is_open() then
    M.close_if_loaded()
    return
  end
  outline_open_and_sync(false)
end, { desc = "Toggle outline (sync to symbol)", nowait = true })

map("n", "<leader>O", function()
  outline_open_and_sync(true)
end, { desc = "Focus outline at symbol", nowait = true })

vim.api.nvim_create_autocmd("FileType", {
  pattern = "Outline",
  group = vim.api.nvim_create_augroup("user.outline-keys", { clear = true }),
  callback = function(args)
    vim.b.miniindentscope_disable = true
    vim.b.minicursorword_disable = true

    -- Remove gutter so first-level icons sit tight to the border.
    local function kill_outline_gutter()
      local w = vim.fn.bufwinid(args.buf)
      if w ~= -1 then
        vim.api.nvim_win_call(w, function()
          vim.opt_local.statuscolumn = ""
          vim.opt_local.signcolumn = "no"
          vim.opt_local.foldcolumn = "0"
          vim.opt_local.number = false
          vim.opt_local.relativenumber = false
        end)
        vim.schedule(function()
          local win = vim.fn.bufwinid(args.buf)
          if win ~= -1 then
            vim.wo[win].winfixwidth = false
          end
        end)
      end
    end
    kill_outline_gutter()
    vim.api.nvim_create_autocmd("BufWinEnter", {
      buffer = args.buf,
      callback = kill_outline_gutter,
    })

    vim.keymap.set("n", "o", function()
      outline_sync_to_code(false)
    end, { buffer = args.buf, desc = "Sync outline to current code location" })

    local function get_sb()
      local api = setup_outline_once()
      return api and api._get_sidebar and api._get_sidebar(false)
    end

    vim.keymap.set("n", "<LeftMouse>", function()
      vim.cmd("normal! <LeftMouse>")
      vim.schedule(function()
        local sb = get_sb()
        if sb and sb.__goto_location then
          sb:__goto_location(true)
        end
      end)
    end, { buffer = args.buf, desc = "Go to symbol (m1)" })

    vim.keymap.set("n", "<RightMouse>", function()
      vim.cmd("normal! <LeftMouse>")
      vim.schedule(function()
        local sb = get_sb()
        if sb and sb.__goto_location then
          sb:__goto_location(false)
        end
      end)
    end, { buffer = args.buf, desc = "Peek symbol (m2)" })
    -- j/k always land at col 0 (outline list nav invariant).
    vim.keymap.set("n", "j", function()
      vim.cmd("normal! j")
      local r = vim.api.nvim_win_get_cursor(0)[1]
      vim.api.nvim_win_set_cursor(0, { r, 0 })
    end, { buffer = args.buf, desc = "Next line (col 0)" })
    vim.keymap.set("n", "k", function()
      vim.cmd("normal! k")
      local r = vim.api.nvim_win_get_cursor(0)[1]
      vim.api.nvim_win_set_cursor(0, { r, 0 })
    end, { buffer = args.buf, desc = "Prev line (col 0)" })
    -- col 0 except while search is active (allows / + n/N to land on matches).
    vim.api.nvim_create_autocmd({ "CursorMoved", "WinEnter" }, {
      buffer = args.buf,
      callback = function()
        local win = vim.fn.bufwinid(args.buf)
        if win == -1 or vim.api.nvim_get_current_win() ~= win then
          return
        end
        local row = vim.api.nvim_win_get_cursor(0)[1]
        vim.api.nvim_win_call(win, function()
          local col = vim.api.nvim_win_get_cursor(0)[2]
          local searching = vim.v.hlsearch == 1 and vim.fn.getreg("/") ~= ""
          if col ~= 0 and not searching then
            vim.api.nvim_win_set_cursor(0, { row, 0 })
          end
        end)
      end,
    })
  end,
})

return M
