local M = {}

local PACK_ROOT = vim.fn.stdpath("data") .. "/site/pack/core/opt"

local function get_plugin_dirs(names)
  if names then
    return names
  end
  local dirs = {}
  for name in vim.fs.dir(PACK_ROOT) do
    if vim.fn.isdirectory(PACK_ROOT .. "/" .. name .. "/.git") == 1 then
      table.insert(dirs, name)
    end
  end
  return dirs
end

-- Return the newest commit whose date is at least `days` old.
-- Falls back to current HEAD if nothing older is found.
local function find_old_enough_commit(dir, days)
  local cutoff = os.time() - (days * 24 * 60 * 60)
  local res = vim.system({ "git", "rev-list", "--max-age=" .. cutoff, "-1", "HEAD" }, { cwd = dir, text = true }):wait()

  if res.code == 0 and res.stdout and res.stdout:match("%S") then
    return vim.trim(res.stdout)
  end
  return nil
end

function M.update(names, opts)
  opts = opts or {}
  local force = opts.force

  vim.pack.update(names)

  if force then
    return
  end

  local rolled_back = {}
  for _, name in ipairs(get_plugin_dirs(names)) do
    local dir = PACK_ROOT .. "/" .. name
    local safe_rev = find_old_enough_commit(dir, 7)
    if safe_rev then
      local current =
        vim.trim(vim.system({ "git", "rev-parse", "HEAD" }, { cwd = dir, text = true }):wait().stdout or "")
      if current ~= safe_rev then
        vim.system({ "git", "checkout", "--quiet", safe_rev }, { cwd = dir }):wait()
        table.insert(rolled_back, name)
      end
    end
  end

  if #rolled_back > 0 then
    vim.notify(
      "PackUpdate: rolled back to commits >7 days old for: " .. table.concat(rolled_back, ", "),
      vim.log.levels.WARN
    )
  end
end

vim.api.nvim_create_user_command("PackUpdate", function(args)
  local names = #args.fargs > 0 and args.fargs or nil
  M.update(names, { force = args.bang })
end, {
  nargs = "*",
  bang = true,
  desc = "Update plugins (use ! to force absolute latest)",
})

return M
