# 2026-06-11 Code-as-API MCP + Progressive Tool Discovery

## Objective
Stop treating every operation as a direct tool call with full definitions and results in context. Instead, expose useful capabilities as code APIs (via MCP) that the agent can import and call programmatically, combined with loading only the tool definitions needed for the current task.

## Why High-Signal
Strongly highlighted in X discussions referencing Anthropic's engineering work on efficient agents:
- "Code-as-API Approach: Instead of direct tool calls, present MCP servers as code APIs... reducing the example workflow from 150k to 2k tokens (98.7% savings)"
- Progressive tool discovery (load only what is needed)
- In-environment data processing before results hit the model
- Better control flow using native code constructs

This is one of the highest-leverage architectural changes for tool-heavy agents.

## Grok Harness Mechanisms
- Custom MCP servers (can be written in any language the agent can call)
- Skills that document the "code API" usage patterns
- AGENTS.md instructions to prefer the code API style
- Subagents (can own long-running code-based workflows)

## Step-by-Step Implementation

1. Identify the highest-volume or most token-expensive tool categories in your work (terminal execution, file search, data processing, external service calls, etc.).

2. Create an MCP server that exposes those capabilities as importable functions/modules.

3. The MCP should support:
   - Progressive discovery (a `list_available_apis` or search tool)
   - In-process filtering/aggregation
   - State persistence to files (so intermediate results don't bloat context)

4. Update AGENTS.md and create a skill that teaches the agent the new pattern.

5. Gradually deprecate or discourage raw low-level tool use for those categories.

## High-Level MCP Design Sketch

Example capabilities to expose:
- `run_project_command(command, filter_output=true)` — runs with built-in sensible filtering
- `search_code(query, max_results=20, semantic=false)` — targeted instead of raw grep + read
- `process_data_in_place(path, transformation)` — filter/transform large data without returning it all
- `get_api_surface_for(path)` — for understanding code without dumping files

The agent writes small scripts or calls the MCP functions directly when the MCP presents itself as a library.

## Validation
- Reproduce a multi-tool workflow that previously consumed very large context.
- Re-implement using the code-as-API style.
- Compare token counts and number of turns.

## Risks / Gotchas
- Requires writing and maintaining an MCP server (initial cost).
- The agent needs good examples and instructions to actually use the new style.
- Debugging the MCP itself can be meta-work.

## Related Plans
- `2026-06-11_05_compression-filtering-layers.md`
- `2026-06-11_08_targeted-search-skills.md`
- `2026-06-11_11_acp-custom-harness-wrapper.md` (ACP clients can also orchestrate code-style workflows)

## Next Actions
- [ ] Identify the 2-3 tool categories that hurt token usage the most in your typical work
- [ ] Sketch the API surface for a first "efficiency-mcp" server
- [ ] Implement a minimal viable MCP (even a thin wrapper around existing tools + filtering is valuable)
- [ ] Create a skill + AGENTS.md section teaching the code-as-API pattern
- [ ] Run a side-by-side comparison on a real task
