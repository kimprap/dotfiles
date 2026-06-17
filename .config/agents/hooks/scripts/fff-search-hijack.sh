#!/bin/bash
# fff-search-hijack.sh
# PreToolUse hook: hijack built-in file search/grep/list tools (and common bash fallbacks)
# in favor of the fff MCP (fffind / ffgrep).
# Deny + reason steers the agent to the correct MCP path without static instructions.

set -euo pipefail

INPUT=$(cat)

# Support both Grok and legacy/Cursor names
TOOL=$(echo "$INPUT" | jq -r '.toolName // .tool_name // .name // empty' 2>/dev/null || echo "")
TOOL_INPUT=$(echo "$INPUT" | jq -c '.toolInput // .tool_input // .input // {}' 2>/dev/null || echo '{}')

is_search_tool() {
  case "$1" in
    grep|Grep|list_dir|ListDir|glob|Glob) return 0 ;;
    *) return 1 ;;
  esac
}

is_search_bash() {
  local cmd
  cmd=$(echo "$TOOL_INPUT" | jq -r '.command // .cmd // empty' 2>/dev/null | tr '[:upper:]' '[:lower:]' || echo "")
  # Common local file search patterns that fff replaces
  if echo "$cmd" | grep -qE '\b(rg|ripgrep|grep|ag|ack)\b'; then return 0; fi
  if echo "$cmd" | grep -qE '\b(find|fd |fdfind)\s+.*-'; then return 0; fi
  if echo "$cmd" | grep -qE '\bls\b.*(-R|--recursive|tree)'; then return 0; fi
  if echo "$cmd" | grep -qE '\btree\b'; then return 0; fi
  return 1
}

if is_search_tool "$TOOL"; then
  cat <<'DENY'
{"decision":"deny","reason":"Built-in file search/grep/list is hijacked for this workspace. Use fff instead: first call the built-in search_tool (with query like \"fff\" or \"file search\"), then call use_tool with name \"fff__find_files\" (for fffind / paths and names) or \"fff__grep\" / \"fff__multi_grep\" (for ffgrep content search)."}
DENY
  exit 2
fi

if [[ "$TOOL" == "run_terminal_command" || "$TOOL" == "Bash" || "$TOOL" == "bash" ]]; then
  if is_search_bash; then
    cat <<'DENY'
{"decision":"deny","reason":"Shell search (rg/grep/find/ls/tree etc.) hijacked. Use fff instead: search_tool then use_tool \"fff__find_files\" or \"fff__grep\"."}
DENY
    exit 2
  fi
fi

# Allow other calls (targeted reads after fff results are fine)
echo '{"decision":"allow"}'
exit 0
