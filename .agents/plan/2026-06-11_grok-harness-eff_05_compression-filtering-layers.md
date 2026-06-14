# 2026-06-11 Compression and Filtering Layers via Hooks/MCP

## Objective
Intercept noisy or high-volume tool outputs (terminal commands, file reads, logs, grep results) and compress/summarize/filter them *before* they consume large amounts of context tokens.

## Why High-Signal
Community on X repeatedly recommends tools like:
- headroom (compress tool outputs, logs, RAG chunks)
- rtk (CLI proxy that filters command output)
- context-mode (keeps raw tool data out of the context window — dramatic reductions reported)

These patterns can be replicated inside the Grok harness using hooks and/or MCP servers without needing external proxies for every session.

## Grok Harness Mechanisms
- `PreToolUse` and `PostToolUse` hooks (most direct)
- Custom MCP servers that wrap noisy tools
- Skills that provide "summarize this output" helpers
- Agent profiles that prefer concise tool variants

## Step-by-Step Implementation

1. Create a hooks directory and a filtering hook.

2. Start with the noisiest tool: `run_terminal_command` (especially long builds, tests, logs).

3. Implement a simple summarizer script (Python, jq + awk, or llm-based summarizer if you have one available locally).

4. For reads: On large files, the hook or MCP can return "summary + relevant excerpts" instead of full content (or force the agent to use a "read_with_summary" style tool).

5. Extend to other high-volume operations (grep results, web search, etc.).

6. Make the compression configurable per project or per task type.

## Example Hook: Filter Terminal Output

Create `.grok/hooks/post-tool-use-terminal.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "run_terminal_command",
        "hooks": [
          {
            "type": "command",
            "command": ".grok/hooks/scripts/summarize-terminal-output.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Example script `.grok/hooks/scripts/summarize-terminal-output.sh` (make executable):

```bash
#!/bin/bash
# Reads the full tool result on stdin, outputs a compressed version

INPUT=$(cat)

# Example strategies (choose or combine):
# 1. Head/tail for logs
# 2. Extract errors + summary
# 3. Count lines + key patterns
# 4. Call a local summarizer if available

echo "$INPUT" | head -n 50
echo "..."
echo "$INPUT" | tail -n 30
echo ""
echo "[COMPRESSED: original output was $(echo "$INPUT" | wc -l) lines. Key errors/warnings above if any.]"
```

For more sophisticated compression, pipe through a small Python script or a local model.

## Advanced: MCP Compression Server
Create a small MCP server that exposes:
- `run_filtered_command`
- `read_file_summarized`
- `grep_targeted`

The agent is encouraged (via AGENTS.md + persona) to prefer these over the raw tools for most cases.

## Validation
- Run the same command that previously produced 10k+ tokens of output.
- Measure context added by the tool result.
- Target: 70-95% reduction in tokens from that tool while retaining necessary information.

## Risks / Gotchas
- Over-compression can hide important details (the hook/script must be tunable).
- Adds a small amount of latency.
- The agent may need explicit permission/instruction to trust the summarized form.

## Related Plans
- `2026-06-11_04_external-state-micro-step-loops.md` (concise feedback is essential for micro-steps)
- `2026-06-11_06_pretooluse-guards-routing.md`
- `2026-06-11_07_code-as-api-mcp-progressive-discovery.md`

## Next Actions
- [ ] Create the hooks directory and a basic PostToolUse filter for terminal commands
- [ ] Test on a noisy command (e.g., `npm test`, `cargo build`, long log tail)
- [ ] Iterate the summarizer until the trade-off between size and information feels good
- [ ] Document the preferred "concise" tools in AGENTS.md
- [ ] Consider building a dedicated MCP compression server for heavier use
