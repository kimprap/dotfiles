# 2026-06-11 Per-Project Config Scoping and Bloat Elimination

## Objective
Dramatically reduce baseline token consumption by ensuring only the MCP servers, plugins, and skills actually needed for the current project are loaded. Eliminate the "48k tax" (and similar overhead) from globally enabled but irrelevant extensions.

## Why High-Signal
Direct recommendation from @grok on X in response to token efficiency questions:
- "Per-project .grok/config.toml to scope only needed MCP servers + disable unused plugins/skills (kills the 48k tax)"

This is the single highest-ROI change with near-zero downside. It applies immediately to every session in the project.

## Grok Harness Mechanisms
- `.grok/config.toml` (project-scoped takes precedence for many settings)
- Plugin enable/disable lists
- MCP server scoping
- Skills paths + ignore/disable
- `grok inspect` for auditing loaded components

## Step-by-Step Implementation

1. Create the project `.grok/` directory if it doesn't exist:
   ```bash
   mkdir -p .grok
   ```

2. Create `.grok/config.toml` with aggressive scoping.

3. Audit current loaded items using `grok inspect` (run in the project root).

4. Disable everything not required for the current work.

5. Add comments explaining why each item is (or isn't) enabled.

6. Re-run `grok inspect` after changes and compare token/context impact on a typical task.

7. Commit `.grok/config.toml` (and consider gitignoring personal overrides if needed).

## Example .grok/config.toml

```toml
# .grok/config.toml - Project-scoped efficiency configuration

[plugins]
# Only load plugins we actually use in this repo
enabled = ["local/efficiency-tools", "team/review-skills"]
disabled = ["*"]  # Start strict — explicitly enable what you need

[skills]
paths = [".grok/skills"]           # Project skills only
ignore = ["**/experimental/**"]

# Disable vendor skill scanning unless needed
[compat.cursor]
skills = false
rules = true   # We still want Cursor-style rules sometimes

[compat.claude]
skills = false
rules = true

[mcp]
# Only the MCP servers this project actually depends on
# Example: disable everything global and list only required ones
# (exact keys depend on your installed MCPs — inspect first)
```

## Recommended Project-Level Additions
- Create `.grok/mcp.json` or project MCP definitions only for tools you want here.
- Use project `.grok/skills/` for any custom efficiency skills.

## Validation
- Run `grok inspect` before/after and note the reduction in loaded plugins/skills/MCPs.
- Start a fresh session (`/new` or new terminal) and perform a representative task (e.g., "review recent changes" or "implement X").
- Compare rough token usage or context pressure.
- Goal: Noticeable reduction in startup context and fewer irrelevant tool suggestions.

## Risks / Gotchas
- Over-disabling can break useful capabilities (e.g., web search, specific integrations). Re-enable incrementally.
- Global `~/.grok/config.toml` still applies for some settings — project file wins for many but not all.
- Some plugins/MCPs may be loaded via environment or other mechanisms.

## Related Plans
- See `2026-06-11_12_plugins-multi-model-personas.md` for how to package scoped sets.
- Complements every other plan — lower baseline makes all other savings more visible.

## Next Actions
- [ ] Run `grok inspect` in this repo and save output
- [ ] Create initial `.grok/config.toml`
- [ ] Test with a 10-minute focused task and note difference
- [ ] Add to project README or AGENTS.md: "This project uses strict per-project scoping for token efficiency"
