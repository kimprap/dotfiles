#!/usr/bin/env python3
"""
TTSR guard (omp-style hard rule enforcement for Grok).

This is a PreToolUse hook. It loads rule files that have `condition`
frontmatter (from .grok/rules/ which symlinks to .config/agents/rules,
plus cursor compat), checks scope + condition against the current
tool call, and hard-denies when matched.

On match it emits a deny with a formatted reason that includes the
full rule body — mimicking "TTSR matched rule" + injection.

Fail-open on any error (never block the session if the guard itself breaks).
"""

import json
import os
import re
import sys
import glob
from typing import Any, Dict, List, Tuple

# Map the scope values used in your rule frontmatter to actual Grok tool names
# (see hooks doc for the alias table).
SCOPE_TO_TOOL = {
    "tool:bash": "run_terminal_command",
    "tool:shell": "run_terminal_command",
    "tool:write": "search_replace",
    "tool:edit": "search_replace",
    "tool:read": "read_file",
    "tool:list": "list_dir",
    "tool:glob": "list_dir",
    "tool:grep": "grep",
}

def parse_frontmatter(raw: str) -> Tuple[Dict[str, Any], str]:
    """Lightweight frontmatter parser (no external deps).

    Handles the style used in .config/agents/rules/*.md :
      ---
      description: ...
      condition: "regex here"
      scope:
        - "tool:bash"
        - "tool:write"
      interruptMode: "tool-only"
      ---
    """
    if not raw.lstrip().startswith("---"):
        return {}, raw

    # Capture everything between the first two '---' fences
    m = re.match(r'^\s*---\s*\n(.*?)\n^\s*---\s*(\n|$)', raw, re.MULTILINE | re.DOTALL)
    if not m:
        return {}, raw

    fm = m.group(1)
    body = raw[m.end():]

    meta: Dict[str, Any] = {}
    lines = fm.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line or line.lstrip().startswith("#"):
            i += 1
            continue
        if ":" not in line:
            i += 1
            continue

        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()

        if val == "" or val == "[]":
            # YAML list on following lines
            lst = []
            i += 1
            while i < len(lines) and lines[i].lstrip().startswith("-"):
                item = lines[i].lstrip()[1:].strip().strip("\"'")
                if item:
                    lst.append(item)
                i += 1
            meta[key] = lst
            continue
        else:
            # scalar (strip quotes)
            meta[key] = val.strip("\"'")
        i += 1

    return meta, body


def load_conditional_rules(workspace_root: str) -> List[Dict[str, Any]]:
    """Load *.md files that declare a `condition`.

    We deliberately only look under .grok/rules/ (symlinked to your
    .config/agents/rules/). These are the ones written with explicit
    interception intent (the "TTSR" rules).

    .cursor/rules/ etc. are treated as soft context only.
    """
    rules: List[Dict[str, Any]] = []
    for path in glob.glob(os.path.join(workspace_root, ".grok/rules/*.md")):
        try:
            with open(path, encoding="utf-8") as f:
                raw = f.read()
            meta, body = parse_frontmatter(raw)
            if meta.get("condition"):
                name = os.path.splitext(os.path.basename(path))[0]
                rules.append(
                    {
                        "name": name,
                        "path": path,
                        "meta": meta,
                        "body": body.strip(),
                    }
                )
        except Exception:
            continue
    return rules


def scope_matches(tool_name: str, scopes: List[str]) -> bool:
    if not scopes:
        return True
    for s in scopes:
        mapped = SCOPE_TO_TOOL.get(s, s)
        if mapped == tool_name or s == tool_name:
            return True
    return False


def haystack_for_tool(tool_name: str, tool_input: Dict[str, Any]) -> str:
    """Build a string we can run the rule's condition regex against."""
    if tool_name == "run_terminal_command":
        cmd = tool_input.get("command") or tool_input.get("cmd") or ""
        return str(cmd)

    # Most file-oriented tools use one of these
    for key in ("file_path", "path", "target_file", "glob", "pattern", "query", "url"):
        val = tool_input.get(key)
        if isinstance(val, str) and val:
            return val

    # Fallback: the whole input (for exotic tools)
    try:
        return json.dumps(tool_input, ensure_ascii=False)
    except Exception:
        return str(tool_input)


def build_reason(rule: Dict[str, Any], tool_name: str, tool_input: Dict[str, Any]) -> str:
    name = rule["name"]
    body = rule["body"]

    # Try to produce a nice one-line target for the box
    target = ""
    if tool_name == "run_terminal_command":
        cmd = str(tool_input.get("command", ""))[:70]
        target = cmd + ("…" if len(cmd) == 70 else "")
    else:
        for k in ("file_path", "path", "target_file"):
            if k in tool_input:
                target = str(tool_input[k])
                break

    header = f"Error: TTSR matched rule: {name}"

    box_line = f"Tool execution was aborted: TTSR matched rule: {name}"
    if target:
        box_line = f"Tool execution was aborted: TTSR matched rule: {name}  ({target})"

    # Keep the visual flavor of the omp example while staying terminal-friendly.
    reason = f"""{header}

┌─── {tool_name} : {target or '·'} ─────────────────────────────────────────────────
│   {box_line}
└───────────────────────────────────────────────────────────────────────────────────

  Injecting rule: {name}

{body}
"""
    return reason


def main() -> None:
    try:
        event = json.load(sys.stdin)
    except Exception:
        # Malformed event → allow
        print('{"decision": "allow"}')
        return

    tool_name = (
        event.get("toolName")
        or event.get("tool_name")
        or event.get("name")
        or ""
    )
    tool_input = (
        event.get("toolInput")
        or event.get("tool_input")
        or event.get("input")
        or {}
    )
    if not isinstance(tool_input, dict):
        tool_input = {}

    workspace = (
        os.environ.get("GROK_WORKSPACE_ROOT")
        or os.environ.get("CLAUDE_PROJECT_DIR")
        or os.getcwd()
    )

    rules = load_conditional_rules(workspace)

    hay = haystack_for_tool(tool_name, tool_input)

    for rule in rules:
        meta = rule["meta"]
        cond = meta.get("condition") or ""
        scopes = meta.get("scope") or []
        interrupt = meta.get("interruptMode", "tool-only")

        if not cond:
            continue
        if interrupt and interrupt != "tool-only":
            continue
        if not scope_matches(tool_name, scopes):
            continue

        # Many rule files store regexes inside YAML "..." strings.
        # This produces doubled backslashes on disk (\\b, \\s, etc.).
        # Normalize so re sees a real regex.
        if isinstance(cond, str):
            cond = cond.replace("\\\\", "\\")

        try:
            if re.search(cond, hay, re.IGNORECASE | re.MULTILINE):
                reason = build_reason(rule, tool_name, tool_input)
                print(json.dumps({"decision": "deny", "reason": reason}, ensure_ascii=False))
                sys.exit(2)
        except re.error:
            # Bad regex in a rule file — skip this rule, don't break the hook
            continue

    # No rule matched → allow the tool
    print('{"decision": "allow"}')


if __name__ == "__main__":
    main()
