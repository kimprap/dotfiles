local M = {}

local SEP = vim.fn.has("win32") == 1 and ";" or ":"

local function path_contains(dir)
  for entry in vim.gsplit(vim.env.PATH or "", SEP, { plain = true }) do
    if entry == dir then
      return true
    end
  end
  return false
end

function M.prepend_path(dir)
  if dir == nil or dir == "" or path_contains(dir) then
    return
  end
  vim.env.PATH = dir .. SEP .. (vim.env.PATH or "")
end

function M.prepend_existing_path(dir)
  if vim.fn.isdirectory(dir) == 1 then
    M.prepend_path(dir)
  end
end

return M
