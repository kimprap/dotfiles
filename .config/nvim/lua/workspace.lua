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

--- Workspace directory encoded in a global session file name.
function M.dir_from_session_name(name)
  if not M.is_session_file(name) then
    return nil
  end
  local label = M.session_slug_label(name)
  if label == "" then
    return nil
  end
  return vim.fs.normalize(vim.fn.expand(label))
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

--- Normalize a path that may be a plain dir or an oil:// URI.
local function as_directory(path)
  if type(path) ~= "string" or path == "" then
    return nil
  end
  if path:match("^oil://") then
    path = path:gsub("^oil://", "")
  end
  local dir = vim.fs.normalize(vim.fn.fnamemodify(path, ":p"))
  if vim.fn.isdirectory(dir) == 1 then
    return dir
  end
  return nil
end

--- Directory whose workspace session should auto-restore, or nil.
--- Bare `nvim` uses cwd. Single directory targets (`nvim .`, `nvim path/`) use that dir.
function M.restore_dir()
  local argc = vim.fn.argc()
  if argc == 0 then
    local dir = vim.fs.normalize(vim.fn.getcwd())
    if M.has_session(dir) then
      return dir
    end
    return nil
  end
  if argc == 1 then
    local dir = as_directory(vim.fn.argv(0))
    if dir and M.has_session(dir) then
      return dir
    end
    return nil
  end
  return nil
end

function M.will_restore_session()
  return M.restore_dir() ~= nil
end

--- Rewrite the session file's `cd` line so relative buffer paths resolve under `dir`.
--- Returns true when the file was modified.
function M.ensure_session_file_cd(session_path, dir)
  if type(session_path) ~= "string" or session_path == "" then
    return false
  end
  if vim.fn.filereadable(session_path) ~= 1 then
    return false
  end
  dir = vim.fs.normalize(dir or "")
  if dir == "" or vim.fn.isdirectory(dir) ~= 1 then
    return false
  end

  local cd_line = "cd " .. M.path_label(dir)
  local lines = vim.fn.readfile(session_path)
  for i, line in ipairs(lines) do
    if line == "cd" or line:match("^cd%s") then
      if line == cd_line then
        return false
      end
      lines[i] = cd_line
      vim.fn.writefile(lines, session_path)
      return true
    end
  end
  return false
end

return M
