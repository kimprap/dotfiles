local M = {}

function M.setup_core()
  require("mini.basics").setup({
    options = { basic = true },
    mappings = { basic = true },
    autocommands = { basic = true },
  })

  require("mini.pairs").setup() -- auto close brackets/quotes
  require("mini.comment").setup() -- gc to comment
  require("mini.surround").setup({ n_lines = 0, search_method = "cover_or_next", silent = true }) -- ys, ds, cs for surrounding

  local ai = require("mini.ai")
  ai.setup({
    n_lines = 50,
    search_method = "cover_or_next",
    silent = true,

    mappings = {
      around_next = "",
      inside_next = "",
      around_last = "",
      inside_last = "",
    },

    custom_textobjects = {
      ["="] = {
        "(%S.-)%s*=%s*().-()%s*[,;}\n]",
        "=%s*().-()%s*[,;}\n]",
      },
      [","] = ai.gen_spec.argument({ brackets = { "%b()", "%b[]", "%b{}" } }),
      [":"] = false,
    },
  })

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

  -- Cmdline completion is handled by blink.cmp (see lsp.lua).
  -- Keep mini.cmdline inert (if it was ever set up earlier in this process)
  -- and prevent the built-in wildmenu from stealing <Tab>.
  pcall(vim.api.nvim_del_augroup_by_name, "MiniCmdline")
  vim.opt.wildchar = 26 -- <Tab> no longer triggers native wild; blink owns it

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

  local hipatterns = require("mini.hipatterns")
  hipatterns.setup({
    highlighters = {
      fixme = { pattern = "%f[%w]()FIXME()%f[%W]", group = "MiniHipatternsFixme" },
      bug = { pattern = "%f[%w]()BUG()%f[%W]", group = "MiniHipatternsFixme" },
      hack = { pattern = "%f[%w]()HACK()%f[%W]", group = "MiniHipatternsHack" },
      todo = { pattern = "%f[%w]()TODO()%f[%W]", group = "MiniHipatternsTodo" },
      note = { pattern = "%f[%w]()NOTE()%f[%W]", group = "MiniHipatternsNote" },
      debug = { pattern = "%f[%w]()DEBUG()%f[%W]", group = "MiniHipatternsHack" },
      xxx = { pattern = "%f[%w]()XXX()%f[%W]", group = "MiniHipatternsFixme" },
      hex_color = hipatterns.gen_highlighter.hex_color(),
    },
  })

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

  local function buffer_flags_statusline()
    -- Use custom groups carrying path_bg so +/lock sit on the dark filename section (not light devinfo bg).
    local modified = vim.bo.modified and "%#StatuslineModified#[+]" or ""
    local readonly = vim.bo.readonly and "%#StatuslineReadOnly#" or ""
    if modified ~= "" and readonly ~= "" then
      return modified .. " " .. readonly
    end
    return modified .. readonly
  end

  local DIAGNOSTIC_STATUS = {
    { vim.diagnostic.severity.ERROR, "DiagnosticError", "" },
    { vim.diagnostic.severity.WARN, "DiagnosticWarn", "󰀪" },
    { vim.diagnostic.severity.INFO, "DiagnosticInfo", "󰋽" },
    { vim.diagnostic.severity.HINT, "DiagnosticHint", "󰌶" },
  }

  local function diagnostic_statusline()
    local counts
    if vim.diagnostic.count then
      counts = vim.diagnostic.count(0)
    else
      counts = {}
      for _, diagnostic in ipairs(vim.diagnostic.get(0)) do
        counts[diagnostic.severity] = (counts[diagnostic.severity] or 0) + 1
      end
    end

    local parts = {}
    local first = true
    for _, item in ipairs(DIAGNOSTIC_STATUS) do
      local count = counts[item[1]] or 0
      if count > 0 then
        -- Single-space prefix only on first glyph (inside its %#...#) for subtle right-side padding after %=.
        local prefix = first and " " or ""
        first = false
        parts[#parts + 1] = "%#" .. item[2] .. "#" .. prefix .. item[3] .. " " .. count
      end
    end
    return table.concat(parts, " ")
  end

  -- Git diff counts (share the devinfo/branch background).
  -- Prefixes: [+] added, [~] changed, [·] removed. Full token colored via GitStatus*.
  local function git_diff_statusline()
    local d = vim.b.gitsigns_status_dict
    if not d then
      return ""
    end
    local parts = {}
    if (d.added or 0) > 0 then
      parts[#parts + 1] = "%#GitStatusAdd#[+]" .. d.added
    end
    if (d.changed or 0) > 0 then
      parts[#parts + 1] = "%#GitStatusChange#[~]" .. d.changed
    end
    if (d.removed or 0) > 0 then
      parts[#parts + 1] = "%#GitStatusRemove#[·]" .. d.removed
    end
    return table.concat(parts, " ")
  end

  local function to_hex(c)
    if not c then
      return nil
    end
    if type(c) == "string" then
      return c
    end
    return string.format("#%06x", c)
  end

  local function darken(c, factor)
    local hex = to_hex(c)
    if not hex or hex:find("NONE") then
      return nil
    end
    local r = tonumber(hex:sub(2, 3), 16) or 0
    local g = tonumber(hex:sub(4, 5), 16) or 0
    local b = tonumber(hex:sub(6, 7), 16) or 0
    r = math.max(0, math.floor(r * (1 - factor)))
    g = math.max(0, math.floor(g * (1 - factor)))
    b = math.max(0, math.floor(b * (1 - factor)))
    return string.format("#%02x%02x%02x", r, g, b)
  end

  local function lighten(c, factor)
    local hex = to_hex(c)
    if not hex or hex:find("NONE") then
      return nil
    end
    local r = tonumber(hex:sub(2, 3), 16) or 0
    local g = tonumber(hex:sub(4, 5), 16) or 0
    local b = tonumber(hex:sub(6, 7), 16) or 0
    r = math.min(255, math.floor(r + (255 - r) * factor))
    g = math.min(255, math.floor(g + (255 - g) * factor))
    b = math.min(255, math.floor(b + (255 - b) * factor))
    return string.format("#%02x%02x%02x", r, g, b)
  end

  local function setup_statusline_hls()
    -- Branch+diff match fileinfo bg; path gets a darker tone. NC uses path+italic.
    -- Derived from theme bgs; runs after mini setup + on ColorScheme.
    local devinfo = vim.api.nvim_get_hl(0, { name = "MiniStatuslineDevinfo", link = false })
    local fileinfo = vim.api.nvim_get_hl(0, { name = "MiniStatuslineFileinfo", link = false })
    local filename = vim.api.nvim_get_hl(0, { name = "MiniStatuslineFilename", link = false })
    local status = vim.api.nvim_get_hl(0, { name = "StatusLine", link = false })

    local base_bg = (filename and filename.bg) or (status and status.bg) or (devinfo and devinfo.bg)

    local dev_fg = devinfo and devinfo.fg
    local fname_fg = filename and filename.fg

    local PATH_DARK = 0.20 -- darker for filename area

    local branch_bg = fileinfo and fileinfo.bg
    local path_bg
    if base_bg then
      path_bg = darken(base_bg, PATH_DARK)
    end
    if not branch_bg and base_bg then
      branch_bg = base_bg
    end

    if branch_bg then
      vim.api.nvim_set_hl(0, "MiniStatuslineDevinfo", {
        bg = branch_bg,
        fg = dev_fg,
      })
      vim.api.nvim_set_hl(0, "MiniStatuslineDiff", {
        bg = branch_bg,
        fg = dev_fg,
      })
      vim.api.nvim_set_hl(0, "MiniStatuslineFilename", {
        bg = path_bg,
        fg = fname_fg,
      })
      vim.api.nvim_set_hl(0, "MiniStatuslineFilenameNC", {
        bg = path_bg,
        fg = fname_fg,
        italic = true,
      })

      -- Theme-agnostic vivid fgs for the git counts; share the fileinfo/branch bg.
      vim.api.nvim_set_hl(0, "GitStatusAdd", { fg = "#a3e635", bg = branch_bg })
      vim.api.nvim_set_hl(0, "GitStatusChange", { fg = "#67e8f9", bg = branch_bg })
      vim.api.nvim_set_hl(0, "GitStatusRemove", { fg = "#f87171", bg = branch_bg })

      -- Give StatuslineModified/ReadOnly explicit path_bg + vivid fg so +/lock stay on dark filename bg.
      local mod_hl = vim.api.nvim_get_hl(0, { name = "DiagnosticWarn", link = false })
      local ro_hl = vim.api.nvim_get_hl(0, { name = "DiagnosticError", link = false })
      vim.api.nvim_set_hl(0, "StatuslineModified", {
        fg = mod_hl and mod_hl.fg or nil,
        bg = path_bg,
      })
      vim.api.nvim_set_hl(0, "StatuslineReadOnly", {
        fg = ro_hl and ro_hl.fg or nil,
        bg = path_bg,
      })
    else
      vim.api.nvim_set_hl(0, "MiniStatuslineDevinfo", { link = "MiniStatuslineDevinfo" })
      vim.api.nvim_set_hl(0, "MiniStatuslineDiff", { link = "MiniStatuslineDevinfo" })
      vim.api.nvim_set_hl(0, "MiniStatuslineFilename", { link = "MiniStatuslineFilename" })
      vim.api.nvim_set_hl(0, "MiniStatuslineFilenameNC", { link = "MiniStatuslineFilename", italic = true })
      vim.api.nvim_set_hl(0, "GitStatusAdd", { fg = "#a3e635" })
      vim.api.nvim_set_hl(0, "GitStatusChange", { fg = "#67e8f9" })
      vim.api.nvim_set_hl(0, "GitStatusRemove", { fg = "#f87171" })
      vim.api.nvim_set_hl(0, "StatuslineModified", { link = "DiagnosticWarn" })
      vim.api.nvim_set_hl(0, "StatuslineReadOnly", { link = "DiagnosticError" })
    end
  end
  vim.api.nvim_create_autocmd("ColorScheme", {
    group = vim.api.nvim_create_augroup("user.statusline_hl", { clear = true }),
    callback = setup_statusline_hls,
  })

  local function filename_hl()
    local path = vim.api.nvim_buf_get_name(0)
    if path == "" then
      return "MiniStatuslineFilename"
    end
    local rel = vim.fn.fnamemodify(path, ":~:.")
    local outside = rel:match("^%.%./") or rel:match("^/") or rel:match("^~")
    return outside and "MiniStatuslineFilenameNC" or "MiniStatuslineFilename"
  end

  local filetype_icon_cache = {}

  MiniStatusline.setup({
    use_icons = true,
    set_vim_settings = true,
    content = {
      active = function()
        local mode, mode_hl = MiniStatusline.section_mode({ trunc_width = 9999 })
        local git = vim.trim(MiniStatusline.section_git({ trunc_width = 40 }) or "")
        local diff = git_diff_statusline()
        local filetype = vim.bo.filetype
        if filetype ~= "" and MiniIcons then
          local display = filetype_icon_cache[filetype]
          if not display then
            local icon = select(1, MiniIcons.get("filetype", filetype))
            display = (icon or "") .. (icon and " " or "") .. filetype
            filetype_icon_cache[filetype] = display
          end
          filetype = display
        end
        local location = "%l|%L"

        local diags = diagnostic_statusline()

        local groups = {
          { hl = mode_hl, strings = { mode } },
        }
        if vim.t.is_zoomed then
          table.insert(groups, { hl = "DiagnosticWarn", strings = { " ZOOM " } })
        end
        vim.list_extend(groups, {
          { hl = "MiniStatuslineDevinfo", strings = { git } },
        })
        if diff ~= "" then
          -- Shares devinfo (branch) bg; no separate changes shade.
          groups[#groups + 1] = { hl = "MiniStatuslineDiff", strings = { diff } }
        end
        vim.list_extend(groups, {
          "%<",
          { hl = filename_hl(), strings = { filename() } },
          buffer_flags_statusline(),
          "%=",
          diags,
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

  -- Call after mini has set up its base groups so the custom increasing-darkness shades (and NC italic) stick.
  setup_statusline_hls()
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
      { mode = "n", keys = "<Leader>e", desc = "Explorer (nvim-tree)" },
      { mode = "n", keys = "<Leader>E", desc = "Explorer (oil)" },
      { mode = "n", keys = "<Leader>f", desc = "Find files (fff)" },
      { mode = "n", keys = "<Leader>/", desc = "Grep project (fff)" },
      { mode = "n", keys = "<Leader>F", desc = "Find files anywhere (global)" },
      { mode = "n", keys = "<Leader>?", desc = "Grep anywhere (global)" },
      { mode = "n", keys = "<Leader>sr", desc = "Search + replace (grug-far, --hidden --follow)" },
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
      { mode = "n", keys = "<Leader>m1", desc = "Toggle markdown H1 folds" },
      { mode = "n", keys = "<Leader>m2", desc = "Toggle markdown H2 folds" },
      { mode = "n", keys = "<Leader>m3", desc = "Toggle markdown H3 folds" },
      { mode = "n", keys = "<Leader>m4", desc = "Toggle markdown H4 folds" },
      { mode = "n", keys = "<Leader>m5", desc = "Toggle markdown H5 folds" },
      { mode = "n", keys = "<Leader>m6", desc = "Toggle markdown H6 folds" },
      { mode = "n", keys = "<Leader>T", desc = "Reopen last closed buffer" },
      { mode = "n", keys = "]d", desc = "Next diagnostic" },
      { mode = "n", keys = "[d", desc = "Prev diagnostic" },
      { mode = "n", keys = "<C-]>", desc = "Next git hunk (editor)" },
      { mode = "n", keys = "<C-[>", desc = "Prev git hunk (editor)" },
    },
    window = { delay = 300 },
  })

  require("lsp").on_attach(function(args)
    MiniClue.ensure_buf_triggers(args.buf)
  end)
end

return M
