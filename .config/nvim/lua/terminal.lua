local M = {}

function M.setup()
  local ok, toggleterm = pcall(require, "toggleterm")
  if not ok then
    return
  end

  toggleterm.setup({
    open_mapping = false,
    direction = "float",
    start_in_insert = true,
    persist_size = true,
    persist_mode = true,
    float_opts = {
      border = "curved",
      width = function()
        return math.floor(vim.o.columns * 0.82)
      end,
      height = function()
        return math.floor(vim.o.lines * 0.82)
      end,
    },
    on_open = function(term)
      vim.cmd("startinsert!")
      vim.keymap.set("t", "<esc><esc>", [[<C-\><C-n>]], { buffer = term.buf, desc = "Exit terminal mode" })

      vim.keymap.set("t", "<C-h>", [[<C-\><C-n><C-w>h]], { buffer = term.buf, desc = "Go left" })
      vim.keymap.set("t", "<C-j>", [[<C-\><C-n><C-w>j]], { buffer = term.buf, desc = "Go down" })
      vim.keymap.set("t", "<C-k>", [[<C-\><C-n><C-w>k]], { buffer = term.buf, desc = "Go up" })
      vim.keymap.set("t", "<C-l>", [[<C-\><C-n><C-w>l]], { buffer = term.buf, desc = "Go right" })
    end,
  })

  -- TermOpen autocmd ensures terminals opened from the TermSelect list (or any path) still auto-focus into insert mode.
  vim.api.nvim_create_autocmd("TermOpen", {
    group = vim.api.nvim_create_augroup("user_term_focus", { clear = true }),
    callback = function()
      if vim.bo.buftype == "terminal" then
        vim.defer_fn(function()
          vim.cmd("startinsert")
        end, 30)
      end
    end,
  })

  local map = require("map")
  local Terminal = require("toggleterm.terminal").Terminal

  local lazygit = Terminal:new({
    cmd = "lazygit",
    direction = "float",
    hidden = true,
    on_open = function(term)
      vim.cmd("startinsert")
      vim.defer_fn(function()
        if vim.api.nvim_win_is_valid(term.window) then
          local w = vim.api.nvim_win_get_width(term.window)
          vim.api.nvim_win_set_width(term.window, w + 1)
          vim.api.nvim_win_set_width(term.window, w)
        end
      end, 120)
    end,
  })

  map("n", "<leader>gg", function()
    lazygit:toggle()
  end, { desc = "Lazygit" })

  map("n", "<leader>tt", function()
    require("toggleterm").toggle()
    vim.defer_fn(function()
      vim.cmd("startinsert")
    end, 50)
  end, { desc = "Toggle terminal" })

  map("n", "<leader>tf", function()
    require("toggleterm").toggle(0, nil, nil, "float")
    vim.defer_fn(function()
      vim.cmd("startinsert")
    end, 50)
  end, { desc = "Floating terminal" })

  map("n", "<leader>tv", function()
    require("toggleterm").toggle(0, math.floor(vim.o.columns * 0.38), nil, "vertical")
    vim.defer_fn(function()
      vim.cmd("startinsert")
    end, 50)
  end, { desc = "Vertical terminal" })

  map("n", "<leader>th", function()
    require("toggleterm").toggle(0, nil, nil, "horizontal")
    vim.defer_fn(function()
      vim.cmd("startinsert")
    end, 50)
  end, { desc = "Horizontal terminal" })

  map("n", "<leader>tn", function()
    local terminals = require("toggleterm.terminal").get_all() or {}
    local max_id = 0
    for _, t in ipairs(terminals) do
      if t.id and t.id > max_id then
        max_id = t.id
      end
    end
    local new_id = max_id + 1
    require("toggleterm").toggle(new_id)
    vim.defer_fn(function()
      vim.cmd("startinsert")
    end, 50)
  end, { desc = "New terminal" })

  for i = 1, 9 do
    map("n", "<leader>t" .. i, function()
      local existing = require("toggleterm.terminal").get(i)
      if existing then
        require("toggleterm").toggle(i)
        vim.defer_fn(function()
          vim.cmd("startinsert")
        end, 50)
      else
        vim.notify(
          "Terminal " .. i .. " does not exist yet. Open one first (e.g. <leader>tt or <leader>tf).",
          vim.log.levels.WARN
        )
      end
    end, { desc = "Terminal " .. i })
  end

  map("n", "<leader>tl", function()
    vim.cmd("TermSelect")
    vim.defer_fn(function()
      local win = vim.api.nvim_get_current_win()
      if vim.api.nvim_win_is_valid(win) then
        -- Dark grey for the TermSelect list itself (matches explorer/outline)
        vim.wo[win].winhighlight = "Normal:Normal"
      end

      -- Focus when a terminal is chosen from the list
      if vim.bo.buftype == "terminal" then
        vim.defer_fn(function()
          vim.cmd("startinsert")
        end, 30)
      end
    end, 20)
  end, { desc = "Select / list terminals" })
end

M.setup()

return M
