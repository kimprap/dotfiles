# 2026-06-11 PreToolUse Guards and Smart Tool Routing

## Objective
Use `PreToolUse` hooks to inspect, approve/deny, rewrite, or reroute tool calls before they execute. This prevents expensive, dangerous, or low-value tool invocations and steers the agent toward more efficient alternatives.

## Why High-Signal
- `PreToolUse` is the only blocking hook in the Grok harness.
- Directly prevents token waste and bad paths (one of the highest-leverage hooks).
- Enables many of the compression, safety, and efficiency ideas discussed on X without changing the core agent.

## Grok Harness Mechanisms
- `PreToolUse` hook with `matcher` (especially powerful on `run_terminal_command`, `read_file`, `grep`, etc.)
- Decision: `allow` or `deny` with reason (the reason is shown to the agent)
- Environment variables and full tool input available to the hook script

## Step-by-Step Implementation

1. Create a `PreToolUse` hook file.

2. Start with high-impact guards:
   - Block or rewrite dangerous / very noisy terminal commands
   - Prevent reading extremely large files without explicit "I really need the whole thing"
   - Force use of project-preferred tools when available (e.g., "use the smart grep MCP instead of raw grep")

3. Return a clear reason when denying so the agent can adapt.

4. Log what was intercepted for later analysis (add to lessons).

## Example PreToolUse Hook

`.grok/hooks/pre-tool-use-guards.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "run_terminal_command",
        "hooks": [
          {
            "type": "command",
            "command": ".grok/hooks/scripts/pre-tool-guard.sh",
            "timeout": 10
          }
        ]
      },
      {
        "matcher": "read_file",
        "hooks": [
          {
            "type": "command",
            "command": ".grok/hooks/scripts/pre-read-guard.sh"
          }
        ]
      }
    ]
  }
}
```

Example guard script (pre-tool-guard.sh):

```bash
#!/bin/bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.toolInput.command // empty')

# Example rules
if echo "$CMD" | grep -qE '(rm -rf /|find .* -type f | cat .* | head -c)'; then
  echo '{"decision": "deny", "reason": "Command looks like it will produce excessive or dangerous output. Use a more targeted approach or the project smart-run skill first."}'
  exit 2
fi

# For long-running or noisy commands, suggest alternatives
if echo "$CMD" | grep -qE '(npm test|jest|pytest|go test)'; then
  echo '{"decision": "allow"}'  # or rewrite to a filtered version
  exit 0
fi

echo '{"decision": "allow"}'
```

## Smart Routing Example
In the hook, you can deny the raw tool and tell the agent:
"Use the `smart_grep` tool from the efficiency MCP instead for better token usage."

## Validation
- Intentionally trigger a noisy command and confirm the hook intervenes.
- Measure reduction in wasted tool turns over a week.
- Review hook logs/annotations in scrollback.

## Risks / Gotchas
- Too many denials can frustrate the agent and lead to workarounds.
- Hooks are fail-open on errors (except explicit deny) — test thoroughly.
- Keep guards focused and well-commented.

## Related Plans
- `2026-06-11_05_compression-filtering-layers.md` (guards + compression are a powerful combination)
- `2026-06-11_09_failure-hooks-retries-verification.md`

## Next Actions
- [ ] Create the PreToolUse hooks directory and at least one guard for terminal commands
- [ ] Add 2-3 high-value rules based on recent painful tool usage
- [ ] Test the guard on both good and bad commands
- [ ] Update AGENTS.md to tell the agent to respect and learn from hook denials
- [ ] Add intercepted events to the lessons process
