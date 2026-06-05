local M = {}

function M.setup_core()
  require("mini.basics").setup({
    options = { basic = true },
    mappings = { basic = true },
    autocommands = { basic = true },
  })

  require("mini.pairs").setup() -- auto close brackets/quotes
  require("mini.comment").setup() -- gc to comment
  require("mini.surround").setup() -- ys, ds, cs for surrounding
  require("mini.cursorword").setup() -- highlight word under cursor

  require("mini.indentscope").setup({
    symbol = "│",
    options = {
      try_as_border = true,
    },
    draw = {
      delay = 0,
      animation = require("mini.indentscope").gen_animation.none(),
    },
  })

  require("mini.pick").setup({
    mappings = {
      move_down = "<C-j>",
      move_up = "<C-k>",
    },
  })

  require("mini.move").setup({
    mappings = {
      left = "<M-h>",
      right = "<M-l>",
      down = "<M-j>",
      up = "<M-k>",
    },
  })

  require("mini.icons").setup()
  MiniIcons.tweak_lsp_kind()

  require("mini.bufremove").setup()
end

function M.setup_statusline()
  local MiniStatusline = require("mini.statusline")

  local function filename()
    if vim.bo.buftype == "terminal" then
      return "%t"
    end
    local path = vim.api.nvim_buf_get_name(0)
    if path == "" then
      return "[No Name]"
    end
    return vim.fn.fnamemodify(path, ":~:.")
  end

  MiniStatusline.setup({
    use_icons = true,
    set_vim_settings = true,
    content = {
      active = function()
        -- trunc_width huge -> always use short mode letter (N/I/V/...)
        local mode, mode_hl = MiniStatusline.section_mode({ trunc_width = 9999 })
        local git = MiniStatusline.section_git({ trunc_width = 40 })
        local diff = vim.b.gitsigns_status or ""
        local diagnostics = MiniStatusline.section_diagnostics({
          trunc_width = 75,
          signs = { E = "E", W = "W", I = "I", H = "H" },
        })
        local filetype = vim.bo.filetype
        if filetype ~= "" and MiniIcons then
          local icon = select(1, MiniIcons.get("filetype", filetype))
          filetype = (icon or "") .. (icon and " " or "") .. filetype
        end
        local location = "%l|%L"

        local groups = {
          { hl = mode_hl, strings = { mode } },
        }
        if vim.t.is_zoomed then
          table.insert(groups, { hl = "DiagnosticWarn", strings = { " ZOOM " } })
        end
        vim.list_extend(groups, {
          { hl = "MiniStatuslineDevinfo", strings = { git, diff, diagnostics } },
          "%<",
          { hl = "MiniStatuslineFilename", strings = { filename() } },
          "%=",
          { hl = "MiniStatuslineFileinfo", strings = { filetype } },
          { hl = mode_hl, strings = { location } },
        })
        return MiniStatusline.combine_groups(groups)
      end,
      inactive = function()
        return "%#MiniStatuslineInactive#" .. filename() .. "%="
      end,
    },
  })
end

function M.setup_clue()
  local MiniClue = require("mini.clue")

  MiniClue.setup({
    triggers = {
      { mode = "n", keys = "<Leader>" },
      { mode = "v", keys = "<Leader>" },
      { mode = "x", keys = "<Leader>" },
      { mode = "n", keys = "[" },
      { mode = "n", keys = "]" },
      { mode = "n", keys = "g" },
      { mode = "x", keys = "g" },
      { mode = "n", keys = "<C-w>" },
    },
    clues = {
      MiniClue.gen_clues.g(),
      MiniClue.gen_clues.z(),
      MiniClue.gen_clues.windows(),
      MiniClue.gen_clues.square_brackets(),
      { mode = "n", keys = "<Leader>e", desc = "Explorer (mini.files)" },
      { mode = "n", keys = "<Leader>E", desc = "Explorer (oil)" },
      { mode = "n", keys = "<Leader>f", desc = "Find files (fff)" },
      { mode = "n", keys = "<Leader>/", desc = "Grep project (fzf-lua)" },
      { mode = "n", keys = "<Leader>F", desc = "Find files anywhere (global)" },
      { mode = "n", keys = "<Leader>?", desc = "Grep anywhere (global)" },
      { mode = "n", keys = "<Leader>r", desc = "Recent files" },
      { mode = "n", keys = "<Leader>L", desc = "+LSP" },
      { mode = "n", keys = "<Leader>Ll", desc = "Pick LSP server" },
      { mode = "n", keys = "<Leader>o", desc = "Outline toggle (sync)" },
      { mode = "n", keys = "<Leader>O", desc = "Outline focus at symbol" },
      { mode = "n", keys = "<Leader>S", desc = "+Session" },
      { mode = "n", keys = "<Leader>X", desc = "Delete (no yank) + motion" },
      { mode = "n", keys = "<Leader>x", desc = "+Diagnostics" },
      { mode = "v", keys = "<Leader>x", desc = "Delete selection (no yank)" },
      { mode = "v", keys = "<Leader>p", desc = "Paste over (keep clipboard)" },
      { mode = "n", keys = "<Leader>g", desc = "+Git view" },
      { mode = "v", keys = "<Leader>g", desc = "+Git view" },
      { mode = "n", keys = "<Leader>y", desc = "+Yank path" },
      { mode = "n", keys = "<Leader>z", desc = "+Folds" },
      { mode = "n", keys = "<Leader>T", desc = "Find color" },
      { mode = "n", keys = "]d", desc = "Next diagnostic" },
      { mode = "n", keys = "[d", desc = "Prev diagnostic" },
      { mode = "n", keys = "<C-]>", desc = "Next git hunk (editor)" },
      { mode = "n", keys = "<C-[>", desc = "Prev git hunk (editor)" },
    },
    window = { delay = 300 },
  })

  vim.api.nvim_create_autocmd("LspAttach", {
    callback = function(args)
      MiniClue.ensure_buf_triggers(args.buf)
    end,
  })
end

return M
