---@type vim.lsp.Config
return {
  cmd = { "tailwindcss-language-server", "--stdio" },
  filetypes = {
    "html",
    "css",
    "scss",
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "svelte",
    "heex",
    "mdx",
  },
  root_markers = {
    "tailwind.config.js",
    "tailwind.config.cjs",
    "tailwind.config.mjs",
    "tailwind.config.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "postcss.config.ts",
  },
  settings = {
    tailwindCSS = {
      validate = true,
      includeLanguages = {
        heex = "phoenix-heex",
      },
    },
  },
}
