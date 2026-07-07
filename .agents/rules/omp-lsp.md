---
description: Use when editing or discussing OMP LSP config, server selection, or language-specific override strategy in the dotfiles workspace.
condition: "omp.*lsp|lsp\\.(json|ya?ml)|basedpyright|pyright|pylsp|ruff|typescript-language-server|denols|biome|eslint|clangd|lua-language-server"
scope:
  - "tool:read(.config/agents/harnesses/omp/lsp*)"
  - "tool:write(.config/agents/harnesses/omp/lsp*)"
  - "tool:edit(.config/agents/harnesses/omp/lsp*)"
  - "tool:bash"
interruptMode: "tool-only"
---

# OMP LSP configuration

This rule governs the global OMP LSP setup stored in the dotfiles workspace.

Active global config target:

- `.config/agents/harnesses/omp/lsp.json`

Use this rule when:

- choosing or replacing OMP language servers
- tuning global OMP LSP behavior
- deciding whether a language override belongs in the global config or only in a project-local `.omp/lsp.json`
- checking/installing language-server binaries that support the chosen OMP LSP policy

Do **not** apply this rule to unrelated editor/LSP discussions or repo-local toolchain tuning unless the task is specifically about OMP's own LSP configuration.

## Global policy

Keep the global OMP LSP config **small and opinionated only where there is a clear winner**.

Prefer global overrides only when at least one is true:

1. there is a clear semantic-server winner over another default
2. there is a clear semantic-server + fast-linter hybrid worth enforcing globally
3. the default server set creates predictable duplicate/noisy diagnostics that are worth suppressing everywhere

If a language ecosystem varies substantially by project, prefer a project-local `.omp/lsp.json` over a new global override.

## Python baseline

Current global Python stance:

- `basedpyright` = semantic Python LSP
- `ruff` = preferred lint/fix/format layer
- `pyright` disabled as an active LSP server
- `pylsp` disabled
- `idleTimeoutMs = 300000`

Rationale:

- keep full semantic LSP capabilities via `basedpyright`
- prefer Ruff wherever Ruff is applicable
- avoid promoting Ruff to a user-global requirement when a repo-local binary exists

Project-local binaries are preferred when available. Do not change the global policy merely to force a user-global Ruff.

### Workspace diagnostics edge

OMP's current workspace-level Python diagnostics path may still rely on the `pyright` CLI.

Therefore:

- it is acceptable to keep `pyright` installed on the machine for compatibility
- it should still remain **disabled** as the active Python LSP server unless there is an explicit reason to switch back

## Other languages

Leave OMP built-in defaults alone unless there is a strong reason to override them globally.

Current defaults are already good enough for:

- `clangd`
- `lua-language-server`
- most single-choice ecosystems like Rust (`rust-analyzer`) and Go (`gopls`)

Do not add global overrides for a language merely because an alternative exists. Require a clear performance, capability, or noise-reduction win.

## TypeScript / JavaScript / Deno policy

TS/JS ecosystem choices vary by repo. Prefer **project-local** overrides over global ones.

### Biome repo template

Use when the repo is Biome-native:

```yaml
servers:
  typescript-language-server:
    disabled: false
  biome:
    disabled: false
  eslint:
    disabled: true
```

### ESLint repo template

Use when the repo is ESLint-native:

```yaml
servers:
  typescript-language-server:
    disabled: false
  biome:
    disabled: true
  eslint:
    disabled: false
```

### Deno repo template

Use when the repo is Deno-first:

```yaml
servers:
  denols:
    disabled: false
  typescript-language-server:
    disabled: true
  biome:
    disabled: true
  eslint:
    disabled: true
```

## Editing discipline

- Keep the active `lsp.json` machine-readable and production-safe.
- Do not stuff commentary or pseudo-comment keys into `lsp.json`.
- Durable explanation belongs in this rule, not in the active JSON.
- If example snippets are needed during a session, derive them from this rule or create a project-local override file that OMP is expected to load.

## Decision heuristic

When asked whether to add a new global language override, answer in this order:

1. Is there a clear global winner?
2. Is this really a repo-local ecosystem choice instead?
3. Does the override preserve semantic LSP while improving lint/diagnostic performance?
4. Does it reduce duplication/noise rather than add more of it?

Only if those answers line up should the global OMP LSP config change.
