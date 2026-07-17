-- File explorer and finder setup.
-- Finder setup helpers are lazy; lsp.lua calls the fzf helper before picker use.

local map = require("map")
local workspace = require("workspace")

local M = {}
local explorer_augroup = vim.api.nvim_create_augroup("user.explorer", { clear = true })

-- Copy helpers for yp/yP/yd/yD (nvim-tree nodes + current buffer).
local function notify_copied(label, p)
  local display = p
  if p:sub(1, 1) == "/" then
    display = vim.fn.fnamemodify(p, ":~")
  end
  vim.notify(string.format("Copied %s: %s", label, display), vim.log.levels.INFO)
end

local function copy_path(full_path, kind)
  if not full_path or full_path == "" then
    vim.notify("No file or folder", vim.log.levels.WARN)
    return
  end
  local path = vim.fn.fnamemodify(full_path, ":p")
  local is_rel = (kind == "rel_file" or kind == "rel_folder")
  local is_folder = (kind == "rel_folder" or kind == "abs_folder")
  local label = is_rel and (is_folder and "relative folder" or "relative file")
    or (is_folder and "absolute folder" or "absolute file")
  if is_folder and vim.fn.isdirectory(path) ~= 1 then
    path = vim.fn.fnamemodify(path, ":h")
  end
  local modifier = is_rel and ":." or ":p"
  local p = vim.fn.fnamemodify(path, modifier)
  vim.fn.setreg("+", p)
  notify_copied(label, p)
end

M.copy_current_buffer_path = function(kind)
  local bufname = vim.api.nvim_buf_get_name(0)
  local oil = bufname:match("^oil://(.+)")
  if oil then
    bufname = oil
  end
  local bt = vim.bo.buftype
  if bufname == "" or (not oil and bt ~= "" and bt ~= "acwrite") then
    vim.notify("Not a file on disk", vim.log.levels.WARN)
    return
  end
  copy_path(bufname, kind)
end

-- Single source for dim level. fzf-lua uses directly as `backdrop`.
-- Manual (nvim-tree/fff) use FzfLuaBackdrop (bg=Black) + winblend offset for parity.
-- Higher = darker. Valid 0-99.
local BACKDROP_BLEND = 60

local nvim_tree_backdrop_buf = nil
local nvim_tree_backdrop_win = nil

local fff_backdrop_buf = nil
local fff_backdrop_win = nil
local fff_picker_ui = nil
-- Assigned later with fzf helpers; FFF keymaps call it on open.
local fff_bridge_to_fzf_files

local nvim_tree_did_setup = false
local fff_did_setup = false
local nvim_tree_cleanup_pending = false
local FFF_CONFIG = {
  prompt = "Files> ",
  max_results = 30,
  preview = {
    enabled = true,
    line_numbers = true,
  },
  keymaps = {
    close = "<Esc>",
    select = "<CR>",
    select_split = "<C-s>",
    select_vsplit = "<C-v>",
    -- select_tab = '<C-t>',

    -- Bottom-prompt FFF renders results above the prompt, so C-j/C-k should
    -- follow visual down/up movement in the picker input.
    move_up = { "<Up>", "<C-p>", "<C-k>" },
    move_down = { "<Down>", "<C-n>", "<C-j>" },
  },
  -- fff float colors (own windows); monkey below adds the editor-wide dim (no native backdrop).
  hl = {
    normal = "Normal",
    border = "FloatBorder",
    winhl = "Normal:NormalFloat,FloatBorder:FloatBorder,FloatTitle:Title",
  },
}

vim.g.fff = vim.tbl_deep_extend("force", vim.g.fff or {}, FFF_CONFIG)

local function apply_fff_config()
  vim.g.fff = vim.tbl_deep_extend("force", vim.g.fff or {}, FFF_CONFIG)

  local ok, conf = pcall(require, "fff.conf")
  if not ok then
    return
  end

  local config = conf.get()
  config.prompt = FFF_CONFIG.prompt
  config.max_results = FFF_CONFIG.max_results
  config.preview = vim.tbl_deep_extend("force", config.preview or {}, FFF_CONFIG.preview)
  config.keymaps = vim.tbl_deep_extend("force", config.keymaps or {}, FFF_CONFIG.keymaps)
  config.hl = vim.tbl_deep_extend("force", config.hl or {}, FFF_CONFIG.hl)
end

local function reinforce_fff_navigation_keymaps()
  if not (fff_picker_ui and fff_picker_ui.state) then
    return
  end

  local function set_nav(buf, mode, lhs, rhs, desc)
    if not (buf and vim.api.nvim_buf_is_valid(buf)) then
      return
    end
    vim.keymap.set(mode, lhs, rhs, {
      buffer = buf,
      noremap = true,
      silent = true,
      desc = desc,
    })
  end

  local function invoke_list_motion(lhs)
    local list_buf = fff_picker_ui.state.list_buf
    if not (list_buf and vim.api.nvim_buf_is_valid(list_buf)) then
      return
    end

    vim.api.nvim_buf_call(list_buf, function()
      local map = vim.fn.maparg(lhs, "n", false, true)
      if type(map) == "table" and type(map.callback) == "function" then
        map.callback()
      end
    end)
  end

  local next_item = function()
    if fff_picker_ui and fff_picker_ui.state and fff_picker_ui.state.active then
      invoke_list_motion("k")
    end
  end
  local prev_item = function()
    if fff_picker_ui and fff_picker_ui.state and fff_picker_ui.state.active then
      invoke_list_motion("j")
    end
  end

  set_nav(fff_picker_ui.state.input_buf, { "i", "n" }, "<C-j>", next_item, "FFF next item")
  set_nav(fff_picker_ui.state.input_buf, { "i", "n" }, "<C-k>", prev_item, "FFF previous item")
  set_nav(fff_picker_ui.state.list_buf, "n", "<C-j>", next_item, "FFF next item")
  set_nav(fff_picker_ui.state.list_buf, "n", "<C-k>", prev_item, "FFF previous item")
  set_nav(fff_picker_ui.state.preview_buf, "n", "<C-j>", next_item, "FFF next item")
  set_nav(fff_picker_ui.state.preview_buf, "n", "<C-k>", prev_item, "FFF previous item")

  -- FFF never indexes gitignored paths; Alt-i/h hand off to fzf-lua (query kept).
  -- Prefer Alt over Ctrl: Ctrl-I is Tab and Ctrl-H is Backspace in terminal Nvim.
  for _, buf in ipairs({
    fff_picker_ui.state.input_buf,
    fff_picker_ui.state.list_buf,
    fff_picker_ui.state.preview_buf,
  }) do
    set_nav(buf, { "i", "n" }, "<M-i>", function()
      fff_bridge_to_fzf_files({ no_ignore = true })
    end, "FFF → fzf (include gitignored)")
    set_nav(buf, { "i", "n" }, "<M-h>", function()
      fff_bridge_to_fzf_files({ hidden = true })
    end, "FFF → fzf (include hidden)")
  end
end

-- Shared setup for manual backdrops (Black + offset blend to match fzf-lua darkness).
local function setup_backdrop_win(win)
  vim.w[win].is_backdrop = true
  local winblend = math.max(0, math.min(99, BACKDROP_BLEND - 15))
  vim.api.nvim_set_option_value("winblend", winblend, { win = win })
  vim.api.nvim_set_option_value("winhighlight", "Normal:FzfLuaBackdrop,EndOfBuffer:FzfLuaBackdrop", { win = win })
  vim.api.nvim_set_option_value("number", false, { win = win })
  vim.api.nvim_set_option_value("relativenumber", false, { win = win })
  vim.api.nvim_set_option_value("signcolumn", "no", { win = win })
  vim.api.nvim_set_option_value("foldcolumn", "0", { win = win })
end

local function apply_nvim_tree_winhighlight(win)
  vim.api.nvim_set_option_value(
    "winhighlight",
    "Normal:NvimTreeNormal,NormalNC:NvimTreeNormalNC,FloatBorder:NvimTreeFloatBorder,FloatTitle:Title",
    { win = win }
  )
end
local function apply_nvim_tree_window_options(win)
  apply_nvim_tree_winhighlight(win)
  vim.api.nvim_set_option_value("statuscolumn", "", { win = win })
  vim.api.nvim_set_option_value("number", false, { win = win })
  vim.api.nvim_set_option_value("relativenumber", false, { win = win })
  vim.api.nvim_set_option_value("signcolumn", "no", { win = win })
  vim.api.nvim_set_option_value("foldcolumn", "0", { win = win })
end

-- Cached nvim-tree modules (one-time pcall, resilient).
local nvim_tree_api, nvim_tree_core

local function get_nvim_tree_api()
  if not nvim_tree_api then
    local ok, mod = pcall(require, "nvim-tree.api")
    if ok and mod then
      nvim_tree_api = mod
    end
  end
  return nvim_tree_api
end

local function get_nvim_tree_core()
  if not nvim_tree_core then
    local ok, mod = pcall(require, "nvim-tree.core")
    if ok and mod then
      nvim_tree_core = mod
    end
  end
  return nvim_tree_core
end

-- Double schedule yields to nvim-tree (and similar) so its open/close + draw settle
-- before we inspect has_window() or touch its windows/backdrop.
local function schedule_2x(fn)
  vim.schedule(function()
    vim.schedule(fn)
  end)
end

-- nvim-tree editor dim (z=49, below the float at ~50).
local function create_nvim_tree_backdrop()
  if nvim_tree_backdrop_win and not vim.api.nvim_win_is_valid(nvim_tree_backdrop_win) then
    nvim_tree_backdrop_win = nil
  end
  if nvim_tree_backdrop_win then
    return
  end
  if not nvim_tree_backdrop_buf or not vim.api.nvim_buf_is_valid(nvim_tree_backdrop_buf) then
    nvim_tree_backdrop_buf = vim.api.nvim_create_buf(false, true)
    vim.api.nvim_set_option_value("bufhidden", "wipe", { buf = nvim_tree_backdrop_buf })
  end

  -- z=49 so nvim-tree float sits above the dim.
  local ok, win = pcall(vim.api.nvim_open_win, nvim_tree_backdrop_buf, false, {
    relative = "editor",
    width = vim.o.columns,
    height = vim.o.lines,
    row = 0,
    col = 0,
    style = "minimal",
    focusable = false,
    zindex = 49,
    border = "none",
  })
  if not ok or not win then
    return
  end

  nvim_tree_backdrop_win = win
  setup_backdrop_win(win)
end

local function destroy_nvim_tree_backdrop()
  if nvim_tree_backdrop_win and vim.api.nvim_win_is_valid(nvim_tree_backdrop_win) then
    pcall(vim.api.nvim_win_close, nvim_tree_backdrop_win, true)
  end
  nvim_tree_backdrop_win = nil
end

-- nvim-tree visibility (fast api path; buf+win scan fallback when api not ready).
local function has_nvim_tree_window()
  if not nvim_tree_did_setup then
    return false
  end
  local api = get_nvim_tree_api()
  if api and api.tree and api.tree.is_visible then
    return api.tree.is_visible()
  end
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_is_valid(buf) and vim.bo[buf].filetype == "NvimTree" then
      if #vim.fn.win_findbuf(buf) > 0 then
        return true
      end
    end
  end
  return false
end

local function get_nvim_tree_display_root()
  -- If the tree is visible, trust its live root (post update_root/find_file or user cd/u inside it).
  -- This preserves stable re-open while the explorer is showing a particular workspace.
  if has_nvim_tree_window() then
    local core = get_nvim_tree_core()
    if core and core.get_cwd then
      local c = core.get_cwd()
      if type(c) == "string" and #c > 0 then
        return c
      end
    end
  end

  -- Derive a contextual root when nvim-tree is hidden or opening for the first time.
  -- Prefer the active file/dir (including oil://), then promote to a project root.
  local start
  local buf = vim.api.nvim_buf_get_name(0)
  local oil_path = buf:match("^oil://(.+)")
  if oil_path then
    if vim.fn.isdirectory(oil_path) == 1 then
      start = vim.fn.fnamemodify(oil_path, ":p")
    else
      start = vim.fn.fnamemodify(oil_path, ":p:h")
    end
  elseif buf ~= "" and vim.fn.filereadable(buf) == 1 then
    start = vim.fn.fnamemodify(buf, ":p:h")
  elseif buf ~= "" and vim.fn.isdirectory(buf) == 1 then
    start = vim.fn.fnamemodify(buf, ":p")
  elseif vim.fn.argc() > 0 then
    local a0 = vim.fn.argv(0)
    if type(a0) == "string" and a0 ~= "" then
      if vim.fn.isdirectory(a0) == 1 then
        start = vim.fn.fnamemodify(a0, ":p")
      elseif vim.fn.filereadable(a0) == 1 then
        start = vim.fn.fnamemodify(a0, ":p:h")
      end
    end
  end
  if not start or start == "" then
    start = vim.uv.cwd() or vim.fn.getcwd()
  end

  local markers = { ".git", ".jj", "package.json", "Cargo.toml", "pyproject.toml", "go.mod", "Makefile" }
  return vim.fs.root(start, markers) or start
end

local function nvim_tree_title(root)
  return " " .. workspace.path_label(root) .. " "
end

local function refresh_nvim_tree_title()
  if not has_nvim_tree_window() then
    return
  end
  local root = get_nvim_tree_display_root()
  local title = nvim_tree_title(root)
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_is_valid(buf) and vim.bo[buf].filetype == "NvimTree" then
      for _, win in ipairs(vim.fn.win_findbuf(buf)) do
        if vim.api.nvim_win_is_valid(win) then
          apply_nvim_tree_window_options(win)
          pcall(vim.api.nvim_win_set_config, win, { title = title, title_pos = "left" })
        end
      end
      break -- at most one NvimTree buffer
    end
  end
end

local function schedule_nvim_tree_backdrop_cleanup()
  if
    nvim_tree_cleanup_pending or not (nvim_tree_backdrop_win and vim.api.nvim_win_is_valid(nvim_tree_backdrop_win))
  then
    return
  end
  nvim_tree_cleanup_pending = true
  schedule_2x(function()
    nvim_tree_cleanup_pending = false
    if nvim_tree_backdrop_win and vim.api.nvim_win_is_valid(nvim_tree_backdrop_win) and not has_nvim_tree_window() then
      destroy_nvim_tree_backdrop()
    end
  end)
end

-- fff editor dim (no native backdrop; matches fzf-lua darkness via same hl+blend).
local function create_fff_backdrop()
  if fff_backdrop_win and not vim.api.nvim_win_is_valid(fff_backdrop_win) then
    fff_backdrop_win = nil
  end
  if fff_backdrop_win then
    return
  end
  if not fff_backdrop_buf or not vim.api.nvim_buf_is_valid(fff_backdrop_buf) then
    fff_backdrop_buf = vim.api.nvim_create_buf(false, true)
    vim.api.nvim_set_option_value("bufhidden", "wipe", { buf = fff_backdrop_buf })
  end

  local ok, win = pcall(vim.api.nvim_open_win, fff_backdrop_buf, false, {
    relative = "editor",
    width = vim.o.columns,
    height = vim.o.lines,
    row = 0,
    col = 0,
    style = "minimal",
    focusable = false,
    zindex = 50, -- below fff's list(52)/input(53)/preview(51)
    border = "none",
  })
  if not ok or not win then
    return
  end

  fff_backdrop_win = win
  setup_backdrop_win(win)
end

local function destroy_fff_backdrop()
  if fff_backdrop_win and vim.api.nvim_win_is_valid(fff_backdrop_win) then
    pcall(vim.api.nvim_win_close, fff_backdrop_win, true)
  end
  fff_backdrop_win = nil
end

local function sync_nvim_tree_background()
  local normal_bg = vim.api.nvim_get_hl(0, { name = "Normal" }).bg
  local normal_float = vim.api.nvim_get_hl(0, { name = "NormalFloat" })
  local border = vim.api.nvim_get_hl(0, { name = "FloatBorder" })

  vim.api.nvim_set_hl(0, "NvimTreeNormal", { link = "Normal" })
  vim.api.nvim_set_hl(0, "NvimTreeNormalNC", { link = "Normal" })
  vim.api.nvim_set_hl(0, "NvimTreeNormalFloat", { link = "Normal" })
  vim.api.nvim_set_hl(0, "NvimTreeEndOfBuffer", { fg = normal_bg, bg = normal_bg })
  vim.api.nvim_set_hl(0, "NvimTreeSignColumn", { link = "Normal" })
  vim.api.nvim_set_hl(0, "NvimTreeWinSeparator", { link = "WinSeparator" })
  vim.api.nvim_set_hl(0, "NvimTreeCursorLine", { link = "CursorLine" })
  vim.api.nvim_set_hl(0, "NvimTreeFloatBorder", {
    fg = border.fg or normal_float.fg,
    bg = normal_bg,
  })

  -- Force clean FloatBorder bg so borders on floats (tree/fzf/fff/lsp) don't get grey bleed.
  vim.api.nvim_set_hl(0, "FloatBorder", { fg = border.fg or normal_float.fg, bg = normal_bg })

  -- Backdrop hl (Black + winblend) used by manual layers so they match fzf-lua darkness at same N.
  vim.api.nvim_set_hl(0, "FzfLuaBackdrop", { bg = "Black", default = true })
end

vim.api.nvim_create_autocmd("ColorScheme", {
  group = explorer_augroup,
  desc = "Match nvim-tree background to editor",
  callback = sync_nvim_tree_background,
})
sync_nvim_tree_background()

local function should_oil_hijack_dir()
  if workspace.will_restore_session() then
    return false
  end
  return vim.fn.argc() == 1 and vim.fn.isdirectory(vim.fn.argv(0)) == 1
end

-- oil.nvim — default dir handler for `nvim ./dir` (and yazi handoff). Bare nvim in a workspace
-- with saved session skips hijack (session restore takes precedence and opens real files).
require("oil").setup({
  default_file_explorer = should_oil_hijack_dir(),
  delete_to_trash = true,
  view_options = {
    show_hidden = true,
    case_insensitive = true,
  },
  columns = {
    "icon",
    "size",
    "mtime",
  },
  lsp_file_methods = {
    autosave_changes = true,
  },
  keymaps = {
    ["<Esc>"] = "actions.close",
    q = "actions.close",
  },
})

-- nvim-tree — floating tree explorer (<leader>e)
local function nvim_tree_float_config()
  local width = 40
  local height = math.min(vim.o.lines - 6, 35)
  local root = get_nvim_tree_display_root()
  local title = nvim_tree_title(root)
  -- Only valid nvim_open_win keys here (title/title_pos ok; win* options must be set post-create).
  return {
    relative = "editor",
    border = "rounded",
    width = width,
    height = height,
    row = 1,
    col = 0,
    title = title,
    title_pos = "left",
  }
end

local function setup_nvim_tree_once()
  if nvim_tree_did_setup then
    return
  end
  require("nvim-tree").setup({
    disable_netrw = false,
    hijack_netrw = false,
    hijack_directories = {
      enable = false,
    },
    view = {
      width = 30,
      signcolumn = "no",
      float = {
        enable = true,
        quit_on_focus_loss = true,
        open_win_config = nvim_tree_float_config,
      },
    },
    renderer = {
      group_empty = true,
      root_folder_label = false,
      indent_width = 1.5,
      indent_markers = {
        enable = false,
        inline_arrows = false,
      },
    },
    actions = {
      open_file = {
        -- Always close the (float) tree after opening a file via <CR>/o etc.
        -- Prevents dim overlay lingering when the target file was already open in the editor.
        quit_on_open = true,
      },
    },
    on_attach = function(bufnr)
      local api = require("nvim-tree.api")
      api.config.mappings.default_on_attach(bufnr)

      local tree_opts = function(desc)
        return { buffer = bufnr, desc = "nvim-tree: " .. desc, silent = true }
      end

      -- Default `y`/`Y` use nowait and would steal `yp`/`yd`; keep default `d`/`D` intact.
      pcall(vim.keymap.del, "n", "y", { buffer = bufnr })
      pcall(vim.keymap.del, "n", "Y", { buffer = bufnr })

      local function copy_node_path(kind)
        return function()
          local node = api.tree.get_node_under_cursor()
          if not node or node.name == ".." then
            vim.notify("No file or folder under cursor", vim.log.levels.WARN)
            return
          end
          copy_path(node.absolute_path, kind)
        end
      end

      vim.keymap.set("n", "yp", copy_node_path("rel_file"), tree_opts("Copy relative file path"))
      vim.keymap.set("n", "yP", copy_node_path("abs_file"), tree_opts("Copy absolute file path"))
      vim.keymap.set("n", "yd", copy_node_path("rel_folder"), tree_opts("Copy relative folder path"))
      vim.keymap.set("n", "yD", copy_node_path("abs_folder"), tree_opts("Copy absolute folder path"))

      -- q can race with TreeClose/WinClosed for dim cleanup; force it explicitly.
      vim.keymap.set("n", "q", function()
        api.tree.close()
        schedule_nvim_tree_backdrop_cleanup()
      end, tree_opts("Close"))

      local function open_then_close()
        api.node.open.edit()
        vim.schedule(function()
          pcall(api.tree.close)
          schedule_nvim_tree_backdrop_cleanup()
        end)
      end
      vim.keymap.set("n", "<CR>", open_then_close, tree_opts("Open file (close tree + dim)"))
      vim.keymap.set("n", "o", open_then_close, tree_opts("Open file (close tree + dim)"))

      vim.keymap.set("n", "gf", function()
        local node = api.tree.get_node_under_cursor()
        if not node or node.name == ".." then
          vim.notify("No file or folder under cursor", vim.log.levels.WARN)
          return
        end
        local path = node.absolute_path
        if vim.fn.isdirectory(path) == 1 then
          vim.ui.open(path)
          return
        end
        local job = vim.fn.jobstart({ "open", "-R", path }, { detach = true })
        if job <= 0 then
          vim.notify("Failed to reveal in Finder: " .. path, vim.log.levels.WARN)
        end
      end, tree_opts("Reveal in Finder"))

      vim.keymap.set("n", "go", "<Nop>", tree_opts("Disabled in tree"))
    end,
  })
  nvim_tree_did_setup = true

  local ok, events = pcall(require, "nvim-tree.events")
  if ok and events and events.Event then
    if events.Event.TreeClose then
      events.subscribe(events.Event.TreeClose, schedule_nvim_tree_backdrop_cleanup)
    end
    if events.Event.TreeOpen then
      -- Buf reuse on re-toggle skips FileType; use TreeOpen to (re)apply title + winhighlight.
      events.subscribe(events.Event.TreeOpen, function()
        vim.schedule(refresh_nvim_tree_title)
      end)
    end
  end
end

-- First NvimTree buf creation: style the float, create dim, and arm a per-win close hook.
vim.api.nvim_create_autocmd("FileType", {
  group = explorer_augroup,
  pattern = "NvimTree",
  callback = function(args)
    vim.schedule(function()
      for _, win in ipairs(vim.fn.win_findbuf(args.buf)) do
        if vim.api.nvim_win_is_valid(win) then
          create_nvim_tree_backdrop()
          refresh_nvim_tree_title()
          vim.api.nvim_create_autocmd("WinClosed", {
            group = explorer_augroup,
            pattern = tostring(win),
            once = true,
            callback = schedule_nvim_tree_backdrop_cleanup,
          })
        end
      end
    end)
  end,
})

-- Global safety net for dim cleanup when no NvimTree window remains.
vim.api.nvim_create_autocmd({ "WinClosed", "BufWinLeave" }, {
  group = explorer_augroup,
  callback = schedule_nvim_tree_backdrop_cleanup,
})

-- Resize active manual backdrops with the editor.
vim.api.nvim_create_autocmd("VimResized", {
  group = explorer_augroup,
  callback = function()
    -- Keep nvim-tree backdrop sized while open.
    if has_nvim_tree_window() and nvim_tree_backdrop_win and vim.api.nvim_win_is_valid(nvim_tree_backdrop_win) then
      pcall(vim.api.nvim_win_set_config, nvim_tree_backdrop_win, {
        relative = "editor",
        width = vim.o.columns,
        height = vim.o.lines,
        row = 0,
        col = 0,
      })
    end

    -- fff: resize or recreate on demand (F2 etc).
    if fff_picker_ui and fff_picker_ui.state and fff_picker_ui.state.active then
      if fff_backdrop_win and vim.api.nvim_win_is_valid(fff_backdrop_win) then
        pcall(vim.api.nvim_win_set_config, fff_backdrop_win, {
          relative = "editor",
          width = vim.o.columns,
          height = vim.o.lines,
          row = 0,
          col = 0,
        })
      else
        create_fff_backdrop()
      end
    end
  end,
})

local function cleanup_hidden_fzf_buffers()
  local function cleanup()
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      if
        vim.api.nvim_buf_is_valid(buf)
        and #vim.fn.win_findbuf(buf) == 0
        and (vim.bo[buf].filetype == "fzf" or vim.api.nvim_buf_get_name(buf):match("term://.*fzf"))
      then
        pcall(vim.api.nvim_buf_delete, buf, { force = true })
      end
    end
  end
  for _, delay in ipairs({ 250, 1000, 3000 }) do
    vim.defer_fn(cleanup, delay)
  end
end

local function fzf_file_edit_and_cleanup(selected, opts)
  require("fzf-lua.actions").file_edit_or_qf(selected, opts)
  cleanup_hidden_fzf_buffers()
end

-- Re-declare file actions (setup overrides the defaults table). Keep alt-i/h
-- toggles; ctrl-i/h only work when the terminal does not map them to Tab/BS.
local function fzf_file_actions()
  local actions = require("fzf-lua.actions")
  return {
    ["enter"] = fzf_file_edit_and_cleanup,
    ["ctrl-s"] = actions.file_split,
    ["ctrl-v"] = actions.file_vsplit,
    ["ctrl-t"] = actions.file_tabedit,
    ["alt-i"] = { fn = actions.toggle_ignore, reuse = true, header = false },
    ["alt-h"] = { fn = actions.toggle_hidden, reuse = true, header = false },
    ["ctrl-i"] = { fn = actions.toggle_ignore, reuse = true, header = false },
    ["ctrl-h"] = { fn = actions.toggle_hidden, reuse = true, header = false },
  }
end

local function fzf_winopts(preview_opts)
  return vim.tbl_deep_extend("force", {
    border = "rounded",
    backdrop = BACKDROP_BLEND,
    preview = { vertical = "up:45%" },
  }, preview_opts or {})
end

--- Capture typed FFF query before close (state first, then input buffer).
local function fff_current_query()
  if not (fff_picker_ui and fff_picker_ui.state) then
    return ""
  end
  local state = fff_picker_ui.state
  local query = state.query
  if type(query) == "string" and query ~= "" then
    return query
  end
  local buf = state.input_buf
  if not (buf and vim.api.nvim_buf_is_valid(buf)) then
    return type(query) == "string" and query or ""
  end
  local line = vim.api.nvim_buf_get_lines(buf, 0, 1, false)[1] or ""
  local prompt = ""
  local conf_ok, conf = pcall(require, "fff.conf")
  if conf_ok then
    prompt = conf.get().prompt or ""
  end
  if prompt ~= "" and line:sub(1, #prompt) == prompt then
    return line:sub(#prompt + 1)
  end
  return line
end

--- Project files via fzf-lua (walk-based; supports no_ignore / hidden).
---@param opts? { no_ignore?: boolean, hidden?: boolean, query?: string, cwd?: string }
local function open_project_files_fzf(opts)
  opts = opts or {}
  M.setup_fzf()
  local flags = {}
  if opts.no_ignore then
    table.insert(flags, "no-ignore")
  end
  if opts.hidden then
    table.insert(flags, "hidden")
  end
  local prompt = "Project Files> "
  if #flags > 0 then
    prompt = prompt .. "[" .. table.concat(flags, " ") .. "] "
  end
  local fzf_opts = {
    cwd = opts.cwd or vim.uv.cwd(),
    prompt = prompt,
    query = opts.query or "",
    actions = fzf_file_actions(),
    winopts = fzf_winopts(),
  }
  -- Only set toggles when true so fzf-lua keeps its defaults otherwise
  -- (files default hidden=true; no_ignore off).
  if opts.no_ignore then
    fzf_opts.no_ignore = true
  end
  if opts.hidden then
    fzf_opts.hidden = true
  end
  require("fzf-lua").files(fzf_opts)
end

--- Close FFF and open fzf-lua with the same query + index root as cwd.
---@param flags { no_ignore?: boolean, hidden?: boolean }
fff_bridge_to_fzf_files = function(flags)
  local query = fff_current_query()
  local cwd = vim.uv.cwd()
  if fff_picker_ui and fff_picker_ui.state then
    local conf_ok, conf = pcall(require, "fff.conf")
    if conf_ok then
      local base = conf.get().base_path
      if type(base) == "string" and base ~= "" then
        cwd = base
      end
    end
    if fff_picker_ui.state.active then
      pcall(fff_picker_ui.close)
    end
  end
  -- Defer so FFF close + backdrop teardown settle first.
  vim.schedule(function()
    open_project_files_fzf({
      cwd = cwd,
      query = query,
      no_ignore = flags.no_ignore,
      hidden = flags.hidden,
    })
  end)
end

M.setup_fzf = function()
  if M.fzf_did_setup then
    return
  end
  require("fzf-lua").setup({
    keymap = {
      builtin = {
        ["<C-d>"] = "preview-page-down",
        ["<C-u>"] = "preview-page-up",
        ["<M-Esc>"] = false,
      },
    },
    actions = {
      files = fzf_file_actions(),
    },
    winopts = {
      on_close = cleanup_hidden_fzf_buffers,
      border = "rounded",
      backdrop = BACKDROP_BLEND,
      preview = {
        winopts = {
          number = true,
          relativenumber = false,
        },
      },
    },
  })
  M.fzf_did_setup = true
end

map("n", "<leader>e", function()
  setup_nvim_tree_once()
  local root = get_nvim_tree_display_root()
  local api = require("nvim-tree.api")
  -- Explicit path keeps oil:// and argv directory startups rooted in the target workspace.
  api.tree.toggle({ path = root, find_file = true, focus = true, update_root = true })

  -- Reconcile dim + title (and destroy on close) after the toggle settles.
  schedule_2x(function()
    if has_nvim_tree_window() then
      create_nvim_tree_backdrop()
      refresh_nvim_tree_title()
    else
      destroy_nvim_tree_backdrop()
    end
  end)
end, { desc = "Toggle file explorer (nvim-tree)" })

map("n", "<leader>E", function()
  local buf_name = vim.api.nvim_buf_get_name(0)
  if buf_name ~= "" and vim.fn.filereadable(buf_name) == 1 then
    require("oil").open(vim.fn.fnamemodify(buf_name, ":p:h"))
  else
    require("oil").open(vim.uv.cwd())
  end
end, { desc = "Oil explorer (dir of active file, else cwd)" })

local function setup_fff_once()
  if fff_did_setup then
    return
  end

  apply_fff_config()

  -- Minimal fff dim monkey: wrap open/close for editor backdrop (no native support).
  -- Schedule guard handles F2 toggles etc.
  local ok_fff, pu = pcall(require, "fff.picker_ui")
  if ok_fff and pu then
    fff_picker_ui = pu
    if not fff_picker_ui.__dotfiles_backdrop_patched then
      local orig_open = fff_picker_ui.open
      local orig_close = fff_picker_ui.close

      fff_picker_ui.open = function(opts)
        create_fff_backdrop()
        local ret = orig_open(opts)
        reinforce_fff_navigation_keymaps()
        return ret
      end

      fff_picker_ui.close = function()
        local ret = orig_close()
        vim.schedule(function()
          if not (fff_picker_ui.state and fff_picker_ui.state.active) then
            destroy_fff_backdrop()
          end
        end)
        return ret
      end

      fff_picker_ui.__dotfiles_backdrop_patched = true
    end
  end

  fff_did_setup = true
end

-- Project finders
map("n", "<leader>f", function()
  setup_fff_once()
  require("fff").find_files()
end, { desc = "Find files in project (fff; Alt-i → fzf +gitignored)" })

map("n", "<leader>/", function()
  setup_fff_once()
  require("fff").live_grep({
    prompt = "Grep> ",
  })
end, { desc = "Grep in project (fff)" })

map("n", "<leader>,", function()
  require("mini.pick").builtin.buffers()
end, { desc = "Find open buffers" })

-- Global finders (fzf-lua for native backdrop + border treatment)
map("n", "<leader>F", function()
  M.setup_fzf()
  require("fzf-lua").files({
    cwd = vim.fn.expand("~"),
    prompt = "Global Files> ",
    actions = fzf_file_actions(),
    winopts = fzf_winopts(),
  })
end, { desc = "Find files anywhere (global)" })

map("n", "<leader>?", function()
  M.setup_fzf()
  require("fzf-lua").live_grep({
    cwd = vim.fn.expand("~"),
    prompt = "Global Grep> ",
    winopts = fzf_winopts(),
    path_display = { "absolute" },
  })
end, { desc = "Grep anywhere (global)" })

-- Recent files from v:oldfiles.
map("n", "<leader>r", function()
  M.setup_fzf()
  require("fzf-lua").oldfiles({
    prompt = "Recent> ",
    winopts = fzf_winopts(),
  })
end, { desc = "Recent files" })

return M
