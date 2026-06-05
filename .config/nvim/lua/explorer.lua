-- File explorer and finder setup.
-- fzf-lua setup intentionally lives here and is consumed lazily by lsp.lua pickers.

local workspace = require("workspace")

local M = {}

local function should_oil_hijack_dir()
  if workspace.will_restore_session() then
    return false
  end
  return vim.fn.argc() == 1 and vim.fn.isdirectory(vim.fn.argv(0)) == 1
end

-- oil.nvim — default dir handler (`nvim ./dir`, yazi → dir)
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

-- mini.files — popup explorer + reveal (<leader>e)
local MiniFiles = require("mini.files")

local function mini_files_anchor_path()
  local buf_name = vim.api.nvim_buf_get_name(0)
  if buf_name ~= "" and vim.fn.filereadable(buf_name) == 1 then
    return buf_name
  end
  local dir_name = vim.fn.fnamemodify(buf_name, ":p:h")
  if vim.fn.isdirectory(dir_name) == 1 then
    return dir_name
  end
  return vim.uv.cwd()
end

-- Sync pending CRUD (confirm dialog) then close; returns true/false/nil like close()
local function mini_files_close_sync()
  if MiniFiles.synchronize() == false then
    return false
  end
  return MiniFiles.close()
end

-- VSCode-style: toggle closed; when opening, reveal active file in its dir branch
local function mini_files_toggle_reveal()
  local closed = mini_files_close_sync()
  if closed ~= nil then
    return
  end
  MiniFiles.open(mini_files_anchor_path(), false)
end

MiniFiles.setup({
  options = {
    use_as_default_explorer = false,
    permanent_delete = false,
  },
  mappings = {
    go_in = "", -- custom `l` = directories only; default `L` = go_in_plus
    synchronize = "", -- use :w / :write in minifiles buffers instead of =
  },
  windows = {
    preview = true,
    width_focus = 35,
    width_preview = 50,
  },
})

vim.keymap.set("n", "<leader>e", mini_files_toggle_reveal, {
  desc = "Toggle file explorer (reveal active file)",
})

vim.keymap.set("n", "<leader>E", function()
  local buf_name = vim.api.nvim_buf_get_name(0)
  if buf_name ~= "" and vim.fn.filereadable(buf_name) == 1 then
    require("oil").open(vim.fn.fnamemodify(buf_name, ":p:h"))
  else
    require("oil").open(vim.uv.cwd())
  end
end, { desc = "Oil explorer (dir of active file, else cwd)" })

-- :w applies mini.files edits (same as former = / synchronize)
vim.api.nvim_create_autocmd("FileType", {
  pattern = "minifiles",
  callback = function(event)
    local buf_id = event.buf
    if vim.b[buf_id].minifiles_write_mapped then
      return
    end
    vim.b[buf_id].minifiles_write_mapped = true
    local sync = function()
      MiniFiles.synchronize()
    end
    vim.api.nvim_buf_create_user_command(buf_id, "Write", sync, {})
    vim.api.nvim_buf_create_user_command(buf_id, "W", sync, {})
  end,
})

vim.api.nvim_create_autocmd("User", {
  pattern = "MiniFilesBufferCreate",
  callback = function(args)
    vim.opt_local.colorcolumn = ""
    vim.keymap.set("n", "<Esc>", mini_files_close_sync, {
      buffer = args.data.buf_id,
      desc = "Apply changes and close explorer",
    })
    local buf_id = args.data.buf_id

    -- Same as mini.files `match_line_offset`: cursor belongs on filename, not icon/path id
    local function minifiles_name_col(line)
      return (line:match("^/.-/.-/()") or 1) - 1
    end

    local function minifiles_move(delta)
      local lnum = vim.api.nvim_win_get_cursor(0)[1]
      local last = vim.api.nvim_buf_line_count(buf_id)
      if last < 1 then
        return
      end
      local n = lnum + delta
      if n > last then
        n = 1
      elseif n < 1 then
        n = last
      end
      local line = vim.api.nvim_buf_get_lines(buf_id, n - 1, n, false)[1] or ""
      vim.api.nvim_win_set_cursor(0, { n, minifiles_name_col(line) })
    end

    vim.keymap.set("n", "j", function()
      minifiles_move(1)
    end, { buffer = buf_id, desc = "Next entry (wrap)" })
    vim.keymap.set("n", "k", function()
      minifiles_move(-1)
    end, { buffer = buf_id, desc = "Previous entry (wrap)" })

    vim.keymap.set("n", "l", function()
      local entry = MiniFiles.get_fs_entry()
      if entry and entry.fs_type == "directory" then
        MiniFiles.go_in()
      end
    end, { buffer = buf_id, desc = "Enter directory only" })

    vim.keymap.set("n", "<CR>", function()
      MiniFiles.go_in({ close_on_file = true })
    end, { buffer = buf_id, desc = "Open file / enter dir (close on file)" })
  end,
})

-- Line numbers only on mini.files file preview pane (not directory columns)
local function minifiles_buf_path(buf_id)
  local name = vim.api.nvim_buf_get_name(buf_id)
  return name:match("^minifiles://%d+/(.+)$") or name
end

vim.api.nvim_create_autocmd("User", {
  pattern = "MiniFilesWindowUpdate",
  callback = function(args)
    local win_id = args.data.win_id
    local buf_id = args.data.buf_id
    if not win_id or not vim.api.nvim_win_is_valid(win_id) then
      return
    end
    local path = minifiles_buf_path(buf_id)
    local is_file_preview = path ~= "" and vim.fn.filereadable(path) == 1
    vim.wo[win_id].number = is_file_preview
    vim.wo[win_id].relativenumber = false
  end,
})

-- mini.files has no macOS Trash API; bridge its trash dir → ~/.Trash (Finder)
if vim.fn.has("mac") == 1 then
  local function move_to_macos_trash(path)
    local trash_dir = vim.fn.expand("~/.Trash")
    local basename = vim.fn.fnamemodify(path, ":t")
    local dest = trash_dir .. "/" .. basename
    if vim.fn.filereadable(dest) == 1 or vim.fn.isdirectory(dest) == 1 then
      basename = basename .. os.date(" %Y-%m-%dT%H-%M-%S")
      dest = trash_dir .. "/" .. basename
    end
    if vim.fn.rename(path, dest) ~= 0 then
      vim.notify("Failed to move to Trash: " .. path, vim.log.levels.ERROR)
    end
  end

  vim.api.nvim_create_autocmd("User", {
    pattern = "MiniFilesActionDelete",
    callback = function(event)
      local to = event.data.to
      if to and (vim.fn.filereadable(to) == 1 or vim.fn.isdirectory(to) == 1) then
        move_to_macos_trash(to)
      end
    end,
  })
end

-- Finders
require("fzf-lua").setup({
  keymap = {
    builtin = {
      ["<C-d>"] = "preview-page-down",
      ["<C-u>"] = "preview-page-up",
    },
  },
  winopts = {
    preview = {
      winopts = {
        number = true,
        relativenumber = false,
      },
    },
  },
})

require("fff").setup({
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

    -- === Make Ctrl+j / Ctrl+k work like in mini.pick ===
    move_up = { "<Up>", "<C-p>", "<C-k>" },
    move_down = { "<Down>", "<C-n>", "<C-j>" },
  },
})

-- Finders - Project-wise
vim.keymap.set("n", "<leader>f", function()
  require("fff").find_files()
end, { desc = "Find files in project (fff)" })

vim.keymap.set("n", "<leader>/", function()
  require("fff").live_grep()
end, { desc = "Grep in project (fzf-lua)" })

vim.keymap.set("n", "<leader>,", function()
  require("mini.pick").builtin.buffers()
end, { desc = "Find open buffers" })

-- Finders - Global
vim.keymap.set("n", "<leader>F", function()
  require("fzf-lua").files({
    cwd = vim.fn.expand("~"),
    prompt = "Global Files> ",
    winopts = { preview = { vertical = "up:45%" } },
  })
end, { desc = "Find files anywhere (global)" })

vim.keymap.set("n", "<leader>?", function()
  require("fzf-lua").live_grep({
    cwd = vim.fn.expand("~"),
    prompt = "Global Grep> ",
    winopts = { preview = { vertical = "up:45%" } },
    path_display = { "absolute" },
  })
end, { desc = "Grep anywhere (global)" })

-- Recent files; uses v:oldfiles via fzf-lua — no extra plugin
vim.keymap.set("n", "<leader>r", function()
  require("fzf-lua").oldfiles({
    prompt = "Recent> ",
    winopts = { preview = { vertical = "up:45%" } },
  })
end, { desc = "Recent files" })

return M
