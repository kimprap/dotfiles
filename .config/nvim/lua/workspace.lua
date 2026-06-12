local M = {}

M.session_dir = vim.fn.stdpath("data") .. "/session"

function M.path_label(path)
  path = path or vim.fn.getcwd()
  local norm = vim.fs.normalize(path)
  local home = vim.fs.normalize(vim.env.HOME)
  if norm:sub(1, #home) == home then
    return "~" .. norm:sub(#home + 1)
  end
  return norm
end

function M.session_slug(dir)
  return M.path_label(dir):gsub("/", "__"):gsub(":", "_") .. ".vim"
end

function M.session_slug_label(slug_name)
  return slug_name:gsub("%.vim$", ""):gsub("__", "/")
end

function M.session_path(dir)
  return M.session_dir .. "/" .. M.session_slug(dir)
end

function M.has_session(dir)
  return vim.fn.filereadable(M.session_path(dir)) == 1
end

function M.is_session_file(name)
  return type(name) == "string" and name:match("%.vim$") ~= nil
end

function M.will_restore_session()
  if not M.has_session() then
    return false
  end
  -- Auto-restore only for bare nvim; explicit file/dir targets open directly.
  if vim.fn.argc() ~= 0 then
    return false
  end
  return true
end

return M
