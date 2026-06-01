--- Markdown LSP — outline sidebar, diagnostics, completion (Phase 6).
--- Phase 7 treesitter adds markdown syntax/highlighting only; keep this server.
---@type vim.lsp.Config
return {
  cmd = { "marksman", "server" },
  filetypes = { "markdown", "markdown.mdx" },
  root_markers = { ".marksman.toml", ".git" },
}
