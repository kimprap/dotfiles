-- LSP, completion, diagnostics, and format-on-save setup.
-- fzf-lua setup intentionally lives in explorer.lua; picker use sites stay lazy here.

local env = require("env")
local map = require("map")

local M = {}
local lsp_augroup = vim.api.nvim_create_augroup("user.lsp", { clear = true })
local lsp_attach_callbacks = {}

function M.on_attach(callback)
  lsp_attach_callbacks[#lsp_attach_callbacks + 1] = callback
end

-- Mason-managed CLI tools (explicit list — add packages when lsp/*.lua or formatters grow)
local MASON_TOOLS = {
  "lua-language-server",
  "stylua",
  "ty",
  "vtsls",
  "json-lsp",
  "bash-language-server",
  "ruff",
  "prettier",
  "taplo",
  "yaml-language-server",
  "yamlfmt",
  "rust-analyzer",
  "zls",
  "marksman",
  "dockerfile-language-server",
  "html-lsp",
  "css-lsp",
  "tailwindcss-language-server",
}

require("mason").setup({
  ui = {
    border = "rounded",
  },
})

-- Prefer Mason binaries for LSP/formatters/search without system installs.
env.prepend_path(vim.fn.stdpath("data") .. "/mason/bin")

require("mason-tool-installer").setup({
  ensure_installed = MASON_TOOLS,
  auto_update = false,
  run_on_start = true,
  start_delay = 3000,
  debounce_hours = 24,
})

local function save_buffer_views(bufnr)
  local views = {}
  for _, win in ipairs(vim.fn.win_findbuf(bufnr)) do
    if vim.api.nvim_win_is_valid(win) then
      views[win] = vim.api.nvim_win_call(win, vim.fn.winsaveview)
    end
  end
  return function()
    for win, view in pairs(views) do
      if vim.api.nvim_win_is_valid(win) and vim.api.nvim_win_get_buf(win) == bufnr then
        pcall(vim.api.nvim_win_call, win, function()
          vim.fn.winrestview(view)
        end)
      end
    end
  end
end

require("conform").setup({
  formatters_by_ft = {
    lua = { "stylua" },
    python = { "ruff_format" },
    javascript = { "prettier" },
    javascriptreact = { "prettier" },
    typescript = { "prettier" },
    typescriptreact = { "prettier" },
    json = { "prettier" },
    jsonc = { "prettier" },
    toml = { "taplo" },
    yaml = { "yamlfmt" },
    html = { "prettier" },
    css = { "prettier" },
    scss = { "prettier" },
  },
  format_on_save = function(bufnr)
    if vim.bo[bufnr].filetype == "" then
      return nil
    end
    local restore_views = save_buffer_views(bufnr)
    return { timeout_ms = 500, lsp_format = "fallback", undojoin = true }, function()
      restore_views()
    end
  end,
})

-- After conform/stylua (registered later = runs after format): visible EOF blank line.
vim.api.nvim_create_autocmd("BufWritePre", {
  group = lsp_augroup,
  desc = "EOF blank line after format on save",
  pattern = "*",
  callback = function()
    if not vim.bo.modifiable or vim.bo.buftype ~= "" then
      return
    end
    if vim.fn.getline("$") == "" then
      return
    end
    local view = vim.fn.winsaveview()
    pcall(vim.cmd.undojoin)
    vim.fn.append(vim.fn.line("$"), { "" })
    vim.fn.winrestview(view)
  end,
})

vim.diagnostic.config({
  virtual_text = {
    prefix = "",
    spacing = 2,
    source = false,
    format = function(diagnostic)
      return diagnostic.message
    end,
  },
  signs = true,
  update_in_insert = false,
  severity_sort = true,
  float = {
    border = "rounded",
    source = "if_many",
  },
})

require("blink.cmp").setup({
  keymap = { preset = "super-tab" },
  completion = {
    menu = { auto_show = true },
  },
  signature = { enabled = true },
})

vim.lsp.config("*", {
  capabilities = require("blink.cmp").get_lsp_capabilities(),
})

local function enable_lsp_servers()
  local servers = vim
    .iter(vim.api.nvim_get_runtime_file("lsp/*.lua", true))
    :map(function(f)
      return vim.fn.fnamemodify(f, ":t:r")
    end)
    :totable()
  if #servers > 0 then
    vim.lsp.enable(servers)
  end
end

local function fzf_lua()
  require("explorer").setup_fzf()
  return require("fzf-lua")
end

local function enforce_manual_lsp(args)
  local bufnr = args.buf
  local manual = vim.b[bufnr].lsp_manual
  if manual == nil then
    return
  end
  local client = vim.lsp.get_client_by_id(args.data.client_id)
  if not client then
    return
  end
  if manual == false or client.name ~= manual then
    vim.schedule(function()
      pcall(vim.lsp.buf_detach_client, bufnr, client.id)
    end)
  end
end

local LSP_FT_LABEL = {
  bash = "Bash",
  sh = "Shell",
  markdown = "Markdown",
  ["markdown.mdx"] = "Markdown MDX",
  javascript = "JavaScript",
  javascriptreact = "JavaScript React",
  typescript = "TypeScript",
  typescriptreact = "TypeScript React",
  python = "Python",
  lua = "Lua",
  rust = "Rust",
  yaml = "YAML",
  ["yaml.docker-compose"] = "YAML (Docker Compose)",
  ["yaml.gitlab"] = "YAML (GitLab CI)",
  ["yaml.helm-values"] = "YAML (Helm values)",
  toml = "TOML",
  json = "JSON",
  jsonc = "JSON with Comments",
  dockerfile = "Dockerfile",
  html = "HTML",
  css = "CSS",
  scss = "SCSS",
  less = "LESS",
  zig = "Zig",
  zir = "Zig IR",
}

local function lsp_ft_label(ft)
  if LSP_FT_LABEL[ft] then
    return LSP_FT_LABEL[ft]
  end
  return (ft:gsub("[_.]", " "):gsub("(%a)([%w_%.]*)", function(a, rest)
    return a:upper() .. rest
  end))
end

local function lsp_detach_buffer(bufnr)
  for _, client in ipairs(vim.lsp.get_clients({ bufnr = bufnr })) do
    pcall(vim.lsp.buf_detach_client, bufnr, client.id)
  end
end

local function lsp_set_filetype(bufnr, ft)
  if ft == "" then
    return
  end
  -- Mirror manual pick: indexed buffer set (fires FileType) so statusline/icons refresh
  vim.bo[bufnr].filetype = ft
  vim.bo[bufnr].syntax = ft
end

local function lsp_root_dir(bufnr, server)
  local markers = { ".git" }
  local cfg = vim.lsp.config[server]
  if type(cfg) == "table" and cfg.root_markers then
    markers = cfg.root_markers
  end
  local root = vim.fs.root(bufnr, markers)
  if root then
    return root
  end
  local path = vim.api.nvim_buf_get_name(bufnr)
  if path ~= "" then
    return vim.fs.dirname(path)
  end
  return vim.fn.getcwd()
end

local function lsp_start_server(bufnr, server)
  return vim.lsp.start({
    name = server,
    root_dir = lsp_root_dir(bufnr, server),
  }, { bufnr = bufnr })
end

local function lsp_attach_for_filetype(bufnr, ft)
  local filter = ft ~= "" and { filetype = ft } or { enabled = true }
  for _, cfg in ipairs(vim.lsp.get_configs(filter)) do
    if vim.lsp.is_enabled(cfg.name) then
      lsp_start_server(bufnr, cfg.name)
    end
  end
end

local function lsp_refresh_ui(bufnr, ft)
  vim.schedule(function()
    if not vim.api.nvim_buf_is_valid(bufnr) then
      return
    end
    if ft and ft ~= "" then
      lsp_set_filetype(bufnr, ft)
      vim.api.nvim_exec_autocmds("FileType", { buffer = bufnr, modeline = false })
    end
    vim.cmd.redrawstatus()
  end)
end

local function detect_filetype(bufnr, reset)
  if not reset and vim.bo[bufnr].filetype ~= "" then
    return vim.bo[bufnr].filetype
  end

  vim.api.nvim_buf_call(bufnr, function()
    if reset then
      vim.bo.filetype = ""
    end
    pcall(vim.cmd, "filetype", "detect")
  end)

  local ft = vim.bo[bufnr].filetype
  if ft == "" then
    local path = vim.api.nvim_buf_get_name(bufnr)
    if path ~= "" then
      ft = vim.filetype.match({ buf = bufnr, filename = path }) or ""
    end
  end
  if ft ~= "" then
    lsp_set_filetype(bufnr, ft)
  end
  return ft
end

local function lsp_restore_automatic(bufnr)
  vim.b[bufnr].lsp_manual = nil
  local ft = detect_filetype(bufnr, true)
  lsp_detach_buffer(bufnr)
  lsp_attach_for_filetype(bufnr, ft)
  lsp_refresh_ui(bufnr, ft)
  return ft
end

local function lsp_pick_apply(bufnr, pick_map, line)
  local fzf_utils = require("fzf-lua.utils")
  line = fzf_utils.strip_ansi_coloring(line or "")
  if line == "" then
    return
  end

  local pick = pick_map[line]
  if pick and pick.auto then
    local ft = lsp_restore_automatic(bufnr)
    local msg = ft ~= "" and ("LSP: auto (%s)"):format(ft) or "LSP: auto (no filetype)"
    vim.notify(msg, vim.log.levels.INFO)
    return
  end

  if pick and pick.none then
    vim.b[bufnr].lsp_manual = false
    lsp_detach_buffer(bufnr)
    lsp_refresh_ui(bufnr)
    local ft = vim.bo[bufnr].filetype
    local msg = ft ~= "" and ("LSP: none (keeps %s, no server)"):format(ft) or "LSP: none (no server)"
    vim.notify(msg, vim.log.levels.INFO)
    return
  end

  if not pick then
    vim.notify("LSP: unknown picker entry", vim.log.levels.ERROR)
    return
  end

  vim.b[bufnr].lsp_manual = pick.server
  lsp_set_filetype(bufnr, pick.ft)
  lsp_detach_buffer(bufnr)

  local id = lsp_start_server(bufnr, pick.server)
  if not id then
    vim.notify(("LSP: could not start %s (%s)"):format(lsp_ft_label(pick.ft), pick.server), vim.log.levels.ERROR)
    return
  end

  lsp_refresh_ui(bufnr, pick.ft)
  vim.notify(("LSP: %s (%s)"):format(lsp_ft_label(pick.ft), pick.server), vim.log.levels.INFO)
end

local function lsp_pick_marker(active)
  return active and "●" or "○"
end

local function lsp_pick_language_active(bufnr, pick, attached)
  local manual = vim.b[bufnr].lsp_manual
  if manual == false or vim.bo[bufnr].filetype ~= pick.ft then
    return false
  end
  if type(manual) == "string" then
    return manual == pick.server
  end
  return attached[pick.server]
end

local function lsp_pick_server()
  local bufnr = vim.api.nvim_get_current_buf()
  local ft = detect_filetype(bufnr, false)
  local attached = {}
  for _, client in ipairs(vim.lsp.get_clients({ bufnr = bufnr })) do
    attached[client.name] = true
  end

  local entries = {}
  local pick_map = {}
  local manual = vim.b[bufnr].lsp_manual

  local auto_line = string.format("%s Auto (detect filetype & LSP)", lsp_pick_marker(manual == nil))
  entries[#entries + 1] = auto_line
  pick_map[auto_line] = { auto = true }

  local none_line = string.format("%s None (no LSP)", lsp_pick_marker(manual == false))
  entries[#entries + 1] = none_line
  pick_map[none_line] = { none = true }

  local seen = {}
  local picks = {}
  for _, cfg in ipairs(vim.lsp.get_configs({ enabled = true })) do
    local server = cfg.name
    if not server then
      goto continue
    end
    for _, cfg_ft in ipairs(cfg.filetypes or {}) do
      local key = server .. "\0" .. cfg_ft
      if seen[key] then
        goto continue_ft
      end
      seen[key] = true
      picks[#picks + 1] = {
        priority = cfg_ft == ft and 0 or 1,
        label = string.format("%s (%s)", lsp_ft_label(cfg_ft), cfg_ft),
        server = server,
        ft = cfg_ft,
      }
      ::continue_ft::
    end
    ::continue::
  end

  table.sort(picks, function(a, b)
    if a.priority ~= b.priority then
      return a.priority < b.priority
    end
    return a.label < b.label
  end)

  for _, pick in ipairs(picks) do
    local line = string.format("%s %s", lsp_pick_marker(lsp_pick_language_active(bufnr, pick, attached)), pick.label)
    entries[#entries + 1] = line
    pick_map[line] = { server = pick.server, ft = pick.ft }
  end

  if #picks == 0 then
    vim.notify("No enabled LSP configs found", vim.log.levels.WARN)
    return
  end

  fzf_lua().fzf_exec(entries, {
    prompt = ("LSP (%s)> "):format(ft ~= "" and ft or "no filetype"),
    actions = {
      ["default"] = function(selected)
        if not selected or not selected[1] then
          return
        end
        vim.schedule(function()
          lsp_pick_apply(bufnr, pick_map, selected[1])
        end)
      end,
    },
  })
end

map("n", "<leader>Ll", lsp_pick_server, { desc = "Pick LSP server for buffer" })

map("n", "]d", function()
  vim.diagnostic.jump({ count = 1 })
end, { desc = "Next diagnostic" })
map("n", "[d", function()
  vim.diagnostic.jump({ count = -1 })
end, { desc = "Previous diagnostic" })

local function diagnostic_scrollbar_hide()
  require("scrollbar.config").get().show = false
  local scrollbar = require("scrollbar")
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    if vim.api.nvim_win_is_valid(win) then
      vim.api.nvim_win_call(win, scrollbar.clear)
    end
  end
end

local function diagnostic_scrollbar_show()
  require("scrollbar.config").get().show = true
  local scrollbar = require("scrollbar")
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    if vim.api.nvim_win_is_valid(win) and vim.api.nvim_win_get_config(win).relative == "" then
      vim.api.nvim_win_call(win, scrollbar.render)
    end
  end
end

local function diagnostics_picker_opts()
  return {
    winopts = {
      on_create = diagnostic_scrollbar_hide,
      on_close = diagnostic_scrollbar_show,
      preview = {
        -- Keep fzf-lua's single border scrollbar for diagnostics.
        -- The global editor scrollbar is hidden while this picker is open.
        scrollbar = "border",
      },
    },
    fzf_opts = {
      -- Avoid fzf's native terminal scrollbar competing with fzf-lua's overlay.
      ["--no-scrollbar"] = true,
    },
  }
end

map("n", "<leader>xd", function()
  fzf_lua().diagnostics_document(diagnostics_picker_opts())
end, { desc = "Diagnostics buffer (fzf)" })
map("n", "<leader>xD", function()
  fzf_lua().diagnostics_workspace(diagnostics_picker_opts())
end, { desc = "Diagnostics workspace (fzf)" })
map("n", "<leader>xl", function()
  vim.diagnostic.setloclist({ open = true })
end, { desc = "Diagnostics loclist" })

-- Close hover / other LSP floats with Esc
map("n", "<Esc>", function()
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    if vim.api.nvim_win_get_config(win).relative ~= "" then
      vim.api.nvim_win_close(win, true)
      return
    end
  end
end, { desc = "Close floating window" })

local function configure_lsp_buffer(args)
  local bufnr = args.buf
  local client = vim.lsp.get_client_by_id(args.data.client_id)
  if not client then
    return
  end

  if client:supports_method("textDocument/foldingRange") then
    vim.api.nvim_buf_call(bufnr, function()
      vim.wo.foldmethod = "expr"
      vim.wo.foldexpr = "v:lua.vim.lsp.foldexpr()"
    end)
    vim.schedule(function()
      if not vim.api.nvim_buf_is_valid(bufnr) then
        return
      end
      vim.api.nvim_buf_call(bufnr, function()
        vim.cmd("normal! zx")
      end)
    end)
  end

  local function nmap(lhs, rhs, desc)
    vim.keymap.set("n", lhs, rhs, { buffer = bufnr, desc = desc })
  end

  nmap("K", function()
    vim.lsp.buf.hover({ border = "rounded" })
  end, "Hover")
  nmap("gd", function()
    fzf_lua().lsp_definitions({ jump1 = true })
  end, "Go to definition")
  nmap("gD", function()
    fzf_lua().lsp_definitions({ jump1 = false })
  end, "Peek definition")
  nmap("gr", function()
    fzf_lua().lsp_references()
  end, "References")
  nmap("<leader>Ls", function()
    fzf_lua().lsp_document_symbols()
  end, "Document symbols (picker)")
  nmap("<leader>La", vim.lsp.buf.code_action, "Code action")
  nmap("<leader>Lf", function()
    require("conform").format({ bufnr = bufnr, async = true })
  end, "Format buffer")
  nmap("<leader>Lr", vim.lsp.buf.rename, "Rename")
  nmap("<leader>Lh", function()
    if not client:supports_method("textDocument/inlayHint") then
      vim.notify("Inlay hints not supported for this buffer", vim.log.levels.WARN)
      return
    end
    local enable = not vim.lsp.inlay_hint.is_enabled({ bufnr = bufnr })
    vim.lsp.inlay_hint.enable(enable, { bufnr = bufnr })
    vim.notify(enable and "Inlay hints on" or "Inlay hints off", vim.log.levels.INFO)
  end, "Toggle inlay hints")
  nmap("<leader>Lm", "<cmd>Mason<CR>", "Mason installer")
  nmap("<leader>Ll", lsp_pick_server, "Pick LSP server")
end

vim.api.nvim_create_autocmd("LspAttach", {
  group = lsp_augroup,
  callback = function(args)
    enforce_manual_lsp(args)
    configure_lsp_buffer(args)
    for _, callback in ipairs(lsp_attach_callbacks) do
      callback(args)
    end
  end,
})

vim.api.nvim_create_autocmd("LspDetach", {
  group = lsp_augroup,
  callback = function(args)
    local bufnr = args.buf
    vim.schedule(function()
      if not vim.api.nvim_buf_is_valid(bufnr) then
        return
      end
      if #vim.lsp.get_clients({ bufnr = bufnr, method = "textDocument/foldingRange" }) > 0 then
        return
      end
      vim.api.nvim_buf_call(bufnr, function()
        vim.wo.foldmethod = "indent"
        vim.wo.foldexpr = "0"
      end)
    end)
  end,
})

enable_lsp_servers()

return M

