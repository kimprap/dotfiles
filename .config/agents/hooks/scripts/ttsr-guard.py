#!/usr/bin/env python3
"""
TTSR guard for conditional markdown rule files.

The matching core is harness-agnostic: it discovers rule files, normalizes
frontmatter, matches the attempted tool call, and records once-per-session
reminders. The CLI adapter at the bottom speaks Grok's PreToolUse JSON contract.

Fail open on guard infrastructure errors. Never block a tool call because the
guard itself could not read rules, parse input, or persist state.
"""

from __future__ import annotations

import ast
import datetime as dt
import fnmatch
import glob
import hashlib
import json
import os
import re
import sys
import tempfile
from typing import Any


ALLOW_DECISION = '{"decision":"allow"}'

RULE_DIRS = (
    ".omp/rules",
    ".agents/rules",
    ".agent/rules",
    ".grok/rules",
    ".claude/rules",
    ".cursor/rules",
    ".windsurf/rules",
    ".clinerules",
)

USER_RULE_DIRS = (
    "~/.omp/agent/rules",
    "~/.agents/rules",
    "~/.agent/rules",
    "~/.grok/rules",
    "~/.claude/rules",
    "~/.cursor/rules",
    "~/.windsurf/rules",
)

PATH_INPUT_KEYS = (
    "file_path",
    "path",
    "paths",
    "target_file",
    "target",
    "cwd",
    "glob",
    "globs",
    "url",
)

META_KEY_ALIASES = {
    "condition": "condition",
    "ttsr_trigger": "condition",
    "ttsrTrigger": "condition",
    "astCondition": "astCondition",
    "ast_condition": "astCondition",
    "ast-condition": "astCondition",
    "interruptMode": "interruptMode",
    "interrupt_mode": "interruptMode",
    "interrupt-mode": "interruptMode",
    "alwaysApply": "alwaysApply",
    "always_apply": "alwaysApply",
    "always-apply": "alwaysApply",
    "globs": "globs",
    "description": "description",
    "scope": "scope",
}

LIST_META_KEYS = {"condition", "astCondition", "scope", "globs"}
REGEX_ONLY_TOKENS = ("\\", "^", "$", "(", ")", "|", "+")
STATE_VERSION = 1
_STATE_WORKSPACE_ROOT = ""


def _emit_allow() -> None:
    print(ALLOW_DECISION)


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value


def _as_str_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        text = value.strip()
        return [text] if text else []
    if isinstance(value, (list, tuple)):
        items: list[str] = []
        for item in value:
            if isinstance(item, str):
                text = item.strip()
            elif item is None:
                text = ""
            else:
                text = str(item).strip()
            if text:
                items.append(text)
        return items
    text = str(value).strip()
    return [text] if text else []


def _dedupe(items: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def _parse_inline_list(value: str) -> list[str] | None:
    if not (value.startswith("[") and value.endswith("]")):
        return None
    try:
        parsed = ast.literal_eval(value)
    except (SyntaxError, ValueError):
        inner = value[1:-1].strip()
        if not inner:
            return []
        return [_strip_quotes(part.strip()) for part in inner.split(",") if part.strip()]
    if not isinstance(parsed, list):
        return None
    return _as_str_list(parsed)


def _parse_frontmatter_value(value: str) -> Any:
    value = value.strip()
    inline = _parse_inline_list(value)
    if inline is not None:
        return inline
    lowered = value.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    return _strip_quotes(value)


def _normalize_meta_key(key: str) -> str:
    return META_KEY_ALIASES.get(key.strip(), key.strip())


def parse_frontmatter(raw: str) -> tuple[dict[str, Any], str]:
    """Parse the supported subset of markdown frontmatter."""
    if raw.startswith("---\r\n"):
        body_start = 5
    elif raw.startswith("---\n"):
        body_start = 4
    else:
        return {}, raw.strip()

    closing = re.search(r"(?m)^---[ \t]*\r?$", raw[body_start:])
    if not closing:
        return {}, raw.strip()

    fm = raw[body_start : body_start + closing.start()]
    body = raw[body_start + closing.end() :].strip()
    meta: dict[str, Any] = {}
    lines = fm.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or ":" not in line:
            i += 1
            continue

        key, _, raw_value = line.partition(":")
        key = _normalize_meta_key(key)
        value = raw_value.strip()
        if value:
            meta[key] = _parse_frontmatter_value(value)
            i += 1
            continue

        items: list[str] = []
        i += 1
        while i < len(lines):
            item_line = lines[i]
            item = item_line.lstrip()
            if not item:
                i += 1
                continue
            if not item.startswith("-"):
                break
            item_value = item[1:].strip()
            if item_value:
                parsed = _parse_frontmatter_value(item_value)
                items.extend(_as_str_list(parsed))
            i += 1
        meta[key] = items

    for key in LIST_META_KEYS:
        if key in meta:
            meta[key] = _as_str_list(meta[key])
    if "condition" in meta:
        meta["condition"] = [condition.replace("\\\\", "\\") for condition in meta["condition"]]
    return meta, body


def _is_rule_file(path: str) -> bool:
    name = os.path.basename(path)
    return name == ".clinerules" or name.endswith((".md", ".mdc"))


def _rule_files_in_dir(directory: str) -> list[str]:
    try:
        entries = sorted(os.scandir(directory), key=lambda entry: entry.name)
    except OSError:
        return []
    files: list[str] = []
    for entry in entries:
        try:
            if entry.is_file(follow_symlinks=True) and _is_rule_file(entry.path):
                files.append(entry.path)
        except OSError:
            continue
    return files


def _rule_files_from_source(source: str) -> list[str]:
    expanded = os.path.expandvars(os.path.expanduser(source))
    if os.path.isdir(expanded):
        return _rule_files_in_dir(expanded)

    files: list[str] = []
    for path in sorted(glob.glob(expanded), key=lambda item: (os.path.dirname(item), os.path.basename(item))):
        if os.path.isdir(path):
            files.extend(_rule_files_in_dir(path))
        elif os.path.isfile(path) and _is_rule_file(path):
            files.append(path)
    return files


def _project_rule_levels(workspace_root: str, cwd: str) -> list[str]:
    root = os.path.abspath(os.path.expandvars(os.path.expanduser(workspace_root)))
    current = os.path.abspath(os.path.expandvars(os.path.expanduser(cwd or root)))
    try:
        inside_workspace = os.path.commonpath([root, current]) == root
    except ValueError:
        inside_workspace = False
    if not inside_workspace:
        return [root]

    rel = os.path.relpath(current, root)
    if rel == ".":
        return [root]

    levels = [root]
    path = root
    for part in rel.split(os.sep):
        path = os.path.join(path, part)
        levels.append(path)
    return levels


def _add_discovered_file(files: list[str], seen_paths: set[str], path: str) -> None:
    try:
        real_path = os.path.realpath(path)
    except OSError:
        return
    if real_path in seen_paths:
        return
    seen_paths.add(real_path)
    files.append(real_path)


def discover_rule_files(workspace_root: str, cwd: str) -> list[str]:
    """Discover markdown rule files in deterministic first-wins order."""
    try:
        files: list[str] = []
        seen_paths: set[str] = set()

        env_sources = os.environ.get("TTSR_RULE_DIRS", "")
        for source in (item for item in env_sources.split(os.pathsep) if item):
            for path in _rule_files_from_source(source):
                _add_discovered_file(files, seen_paths, path)

        for level in _project_rule_levels(workspace_root, cwd):
            for dirname in RULE_DIRS:
                source = os.path.join(level, dirname)
                if dirname == ".clinerules" and os.path.isfile(source):
                    _add_discovered_file(files, seen_paths, source)
                    continue
                if os.path.isdir(source):
                    for path in _rule_files_in_dir(source):
                        _add_discovered_file(files, seen_paths, path)

        for source in USER_RULE_DIRS:
            for path in _rule_files_from_source(source):
                _add_discovered_file(files, seen_paths, path)

        return files
    except Exception:
        return []


def _rule_name_for_path(path: str) -> str:
    name = os.path.basename(path)
    if name == ".clinerules":
        return "clinerules"
    return os.path.splitext(name)[0]


def _is_glob_shorthand(condition: str) -> bool:
    has_glob_token = any(token in condition for token in ("*", "?", "["))
    has_path_hint = "/" in condition or "." in condition
    has_regex_token = any(token in condition for token in REGEX_ONLY_TOKENS)
    return has_glob_token and has_path_hint and not has_regex_token


def _prepare_conditions(conditions: list[str], scopes: list[str]) -> tuple[list[str], list[str]]:
    prepared: list[str] = []
    expanded_scopes = list(scopes)
    for condition in conditions:
        if not condition:
            continue
        if _is_glob_shorthand(condition):
            expanded_scopes.append(f"tool:edit({condition})")
            expanded_scopes.append(f"tool:write({condition})")
            prepared.append(".*")
            continue
        try:
            re.compile(condition, re.IGNORECASE | re.MULTILINE)
        except re.error:
            continue
        prepared.append(condition)
    return _dedupe(prepared), _dedupe(expanded_scopes)


def load_ttsr_rules(workspace_root: str, cwd: str) -> list[dict[str, Any]]:
    """Load normalized TTSR rules from discovered rule files."""
    try:
        files = discover_rule_files(workspace_root, cwd)
    except Exception:
        return []

    rules: list[dict[str, Any]] = []
    seen_names: set[str] = set()
    for path in files:
        try:
            with open(path, encoding="utf-8") as handle:
                raw = handle.read()
            meta, body = parse_frontmatter(raw)
        except Exception:
            continue

        name = _rule_name_for_path(path)
        if name in seen_names:
            continue
        seen_names.add(name)

        conditions = _as_str_list(meta.get("condition"))
        ast_conditions = _as_str_list(meta.get("astCondition"))
        if not conditions and not ast_conditions:
            continue

        scopes = _as_str_list(meta.get("scope"))
        prepared_conditions, scopes = _prepare_conditions(conditions, scopes)
        if conditions and not prepared_conditions:
            continue

        rule = dict(meta)
        rule.update(
            {
                "name": name,
                "path": os.path.realpath(path),
                "body": body.strip(),
                "condition": prepared_conditions,
                "astCondition": ast_conditions,
                "scope": scopes,
                "globs": _as_str_list(meta.get("globs")),
                "alwaysApply": bool(meta.get("alwaysApply", False)),
                "description": str(meta.get("description", "")),
                "interruptMode": str(meta.get("interruptMode", "") or ""),
            }
        )
        rules.append(rule)
    return rules


def tool_aliases(tool_name: str) -> set[str]:
    raw = str(tool_name or "")
    lower = raw.lower()
    normalized = lower.replace("-", "_")
    compact = normalized.replace("_", "")
    aliases = {raw, lower, normalized, f"tool:{normalized}"}

    if normalized in {"run_terminal_command", "run_terminal_cmd", "bash", "shell"}:
        aliases.update({"tool:bash", "tool:shell"})
    if normalized in {"search_replace", "edit", "write", "multi_edit", "write_file"} or compact == "multiedit":
        aliases.update({"tool:edit", "tool:write"})
    if normalized in {"read_file", "read"}:
        aliases.add("tool:read")
    if normalized in {"list_dir", "glob", "find"} or compact == "listdir":
        aliases.update({"tool:list", "tool:glob"})
    if normalized in {"grep", "search", "ripgrep"}:
        aliases.update({"tool:grep", "tool:search"})
    if normalized in {"web_search", "websearch"} or compact == "websearch":
        aliases.add("tool:web_search")
    if normalized in {"spawn_subagent", "task", "agent"} or compact == "spawnsubagent":
        aliases.add("tool:task")

    return {alias for alias in aliases if alias}


def _looks_like_url(value: str) -> bool:
    return bool(re.match(r"^[A-Za-z][A-Za-z0-9+.-]*://", value))


def _add_candidate_path(candidates: list[str], seen: set[str], value: str, workspace_root: str) -> None:
    text = value.strip()
    if not text:
        return
    for candidate in (text, text.replace(os.sep, "/")):
        if candidate and candidate not in seen:
            seen.add(candidate)
            candidates.append(candidate)

    if _looks_like_url(text):
        return

    expanded = os.path.expandvars(os.path.expanduser(text))
    if expanded != text and expanded not in seen:
        seen.add(expanded)
        candidates.append(expanded)

    root = os.path.abspath(os.path.expandvars(os.path.expanduser(workspace_root)))
    absolute = expanded if os.path.isabs(expanded) else os.path.join(root, expanded)
    absolute = os.path.normpath(absolute)
    try:
        if os.path.commonpath([root, absolute]) != root:
            return
        relative = os.path.relpath(absolute, root)
    except (OSError, ValueError):
        return
    if relative not in seen:
        seen.add(relative)
        candidates.append(relative)


def extract_candidate_paths(tool_input: dict[str, Any], workspace_root: str) -> list[str]:
    candidates: list[str] = []
    seen: set[str] = set()
    for key in PATH_INPUT_KEYS:
        value = tool_input.get(key)
        if isinstance(value, str):
            _add_candidate_path(candidates, seen, value, workspace_root)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    _add_candidate_path(candidates, seen, item, workspace_root)
    return candidates


def _path_matches(pattern: str, paths: list[str]) -> bool:
    pattern = pattern.strip()
    if not pattern:
        return False
    for path in paths:
        variants = _dedupe([path, path.replace(os.sep, "/")])
        for variant in variants:
            if fnmatch.fnmatch(variant, pattern):
                return True
    return False


def scope_matches(tool_name: str, scopes: list[str], paths: list[str], workspace_root: str) -> bool:
    del workspace_root
    if not scopes:
        return True

    aliases = tool_aliases(tool_name)
    lower_aliases = {alias.lower() for alias in aliases}
    for scope in scopes:
        value = str(scope).strip()
        if not value:
            continue
        if value in aliases or value.lower() in lower_aliases:
            return True

        match = re.match(r"^(tool:[^(]+)\((.*)\)$", value)
        if not match:
            continue
        base_scope, path_glob = match.groups()
        if base_scope not in aliases and base_scope.lower() not in lower_aliases:
            continue
        if paths and _path_matches(path_glob, paths):
            return True
    return False


def globs_match(globs: list[str], paths: list[str], workspace_root: str) -> bool:
    del workspace_root
    if not globs:
        return True
    if not paths:
        return False
    return any(_path_matches(glob_pattern, paths) for glob_pattern in globs)


def _append_haystack_value(parts: list[str], value: Any) -> None:
    if isinstance(value, str) and value:
        parts.append(value)
    elif isinstance(value, list):
        parts.extend(item for item in value if isinstance(item, str) and item)


def haystack_for_tool(tool_name: str, tool_input: dict[str, Any]) -> str:
    workspace_root = str(tool_input.get("_ttsr_workspace_root") or tool_input.get("workspaceRoot") or os.getcwd())
    parts: list[str] = [str(tool_name or "")]
    for key in ("command", "cmd"):
        _append_haystack_value(parts, tool_input.get(key))
    parts.extend(extract_candidate_paths(tool_input, workspace_root))
    for key in ("query", "pattern", "url", "old_string", "new_string", "replacement", "content"):
        _append_haystack_value(parts, tool_input.get(key))
    try:
        public_input = {key: value for key, value in tool_input.items() if not str(key).startswith("_ttsr_")}
        parts.append(json.dumps(public_input, sort_keys=True, ensure_ascii=False, separators=(",", ":")))
    except Exception:
        parts.append(str(tool_input))
    return "\n".join(parts)


def _interrupt_allows_tool(interrupt_mode: Any) -> bool:
    mode = str(interrupt_mode or "").strip()
    return mode in {"", "tool-only", "always"}


def rule_matches(rule: dict[str, Any], tool_name: str, tool_input: dict[str, Any], workspace_root: str) -> bool:
    if not _interrupt_allows_tool(rule.get("interruptMode")):
        return False

    paths = extract_candidate_paths(tool_input, workspace_root)
    scopes = _as_str_list(rule.get("scope"))
    if not scope_matches(tool_name, scopes, paths, workspace_root):
        return False
    if not globs_match(_as_str_list(rule.get("globs")), paths, workspace_root):
        return False

    conditions = _as_str_list(rule.get("condition"))
    if not conditions:
        return False

    haystack_input = dict(tool_input)
    haystack_input["_ttsr_workspace_root"] = workspace_root
    haystack = haystack_for_tool(tool_name, haystack_input)
    for condition in conditions:
        try:
            if re.search(condition, haystack, re.IGNORECASE | re.MULTILINE):
                return True
        except re.error:
            continue
    return False


def session_key(event: dict[str, Any], workspace_root: str) -> str:
    global _STATE_WORKSPACE_ROOT
    _STATE_WORKSPACE_ROOT = os.path.abspath(os.path.expandvars(os.path.expanduser(workspace_root)))
    values = (
        os.environ.get("TTSR_SESSION_ID"),
        event.get("sessionId"),
        event.get("session_id"),
        os.environ.get("GROK_SESSION_ID"),
        os.environ.get("CLAUDE_SESSION_ID"),
    )
    for value in values:
        if isinstance(value, str) and value.strip():
            return value.strip()
    digest = hashlib.sha256(_STATE_WORKSPACE_ROOT.encode("utf-8", "surrogatepass")).hexdigest()[:16]
    return f"workspace:{digest}"


def state_file_for_session(key: str) -> str:
    state_root = os.environ.get("TTSR_STATE_DIR")
    if not state_root:
        cache_root = os.environ.get("XDG_CACHE_HOME") or "~/.cache"
        state_root = os.path.join(cache_root, "ttsr-guard")
    state_root = os.path.abspath(os.path.expandvars(os.path.expanduser(state_root)))
    workspace_root = _STATE_WORKSPACE_ROOT or os.getcwd()
    digest = hashlib.sha256((key + "\0" + workspace_root).encode("utf-8", "surrogatepass")).hexdigest()
    return os.path.join(state_root, f"{digest}.json")


def load_state(path: str) -> dict[str, Any]:
    try:
        with open(path, encoding="utf-8") as handle:
            state = json.load(handle)
    except Exception:
        return {"version": STATE_VERSION, "injected": {}}
    if not isinstance(state, dict):
        return {"version": STATE_VERSION, "injected": {}}
    injected = state.get("injected")
    if not isinstance(injected, dict):
        state["injected"] = {}
    state["version"] = STATE_VERSION
    return state


def save_state(path: str, state: dict[str, Any]) -> bool:
    state_dir = os.path.dirname(path)
    temp_path = ""
    try:
        os.makedirs(state_dir, exist_ok=True)
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=state_dir, delete=False) as temp:
            temp_path = temp.name
            json.dump(state, temp, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
            temp.write("\n")
            temp.flush()
            os.fsync(temp.fileno())
        os.replace(temp_path, path)
        return True
    except Exception:
        if temp_path:
            try:
                os.unlink(temp_path)
            except OSError:
                pass
        return False


def already_injected(state: dict[str, Any], rule_name: str) -> bool:
    injected = state.get("injected")
    return isinstance(injected, dict) and rule_name in injected


def mark_injected(state: dict[str, Any], rules: list[dict[str, Any]]) -> None:
    injected = state.setdefault("injected", {})
    if not isinstance(injected, dict):
        injected = {}
        state["injected"] = injected
    timestamp = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    for rule in rules:
        injected[str(rule.get("name", ""))] = {
            "path": str(rule.get("path", "")),
            "timestamp": timestamp,
        }
    state["version"] = STATE_VERSION


def _xml_attr_escape(value: Any) -> str:
    text = str(value)
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def build_reason(rules: list[dict[str, Any]], tool_name: str, tool_input: dict[str, Any]) -> str:
    del tool_name, tool_input
    names = [str(rule.get("name", "")) for rule in rules]
    if len(names) == 1:
        header = f"TTSR matched rule: {names[0]}"
    else:
        header = f"TTSR matched rules: {', '.join(names)}"

    blocks = [header]
    for rule in rules:
        name = _xml_attr_escape(rule.get("name", ""))
        path = _xml_attr_escape(rule.get("path", ""))
        body = str(rule.get("body", "")).strip()
        blocks.append(
            f"""<system-interrupt reason="rule_violation" rule="{name}" path="{path}">
The attempted tool call matched this rule. Read and apply it, then continue the same turn with the corrected next action. Do not end the turn solely because this reminder fired.

{body}
</system-interrupt>"""
        )
    return "\n\n".join(blocks)


def _first_string(*values: Any) -> str:
    for value in values:
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def _normalize_dir(path: str) -> str:
    return os.path.abspath(os.path.expandvars(os.path.expanduser(path)))


def main() -> None:
    try:
        event = json.load(sys.stdin)
    except Exception:
        _emit_allow()
        return
    if not isinstance(event, dict):
        _emit_allow()
        return

    try:
        tool_name = _first_string(event.get("toolName"), event.get("tool_name"), event.get("name"))
        tool_input = event.get("toolInput")
        if tool_input is None:
            tool_input = event.get("tool_input")
        if tool_input is None:
            tool_input = event.get("input", {})
        if tool_input is None:
            tool_input = {}
        if not isinstance(tool_input, dict):
            _emit_allow()
            return

        workspace_root = _first_string(
            event.get("workspaceRoot"),
            event.get("workspace_root"),
            os.environ.get("GROK_WORKSPACE_ROOT"),
            os.environ.get("CLAUDE_PROJECT_DIR"),
            os.getcwd(),
        )
        workspace_root = _normalize_dir(workspace_root or os.getcwd())
        cwd = _first_string(event.get("cwd"), workspace_root)
        cwd = _normalize_dir(cwd or workspace_root)

        rules = load_ttsr_rules(workspace_root, cwd)
        if not rules:
            _emit_allow()
            return

        matching_rules = [rule for rule in rules if rule_matches(rule, tool_name, tool_input, workspace_root)]
        if not matching_rules:
            _emit_allow()
            return

        repeat_mode = os.environ.get("TTSR_REPEAT_MODE", "").strip().lower()
        if repeat_mode == "always":
            new_rules = matching_rules
        else:
            key = session_key(event, workspace_root)
            state_path = state_file_for_session(key)
            state = load_state(state_path)
            new_rules = [
                rule for rule in matching_rules if not already_injected(state, str(rule.get("name", "")))
            ]
            if not new_rules:
                _emit_allow()
                return
            mark_injected(state, new_rules)
            if not save_state(state_path, state):
                _emit_allow()
                return

        reason = build_reason(new_rules, tool_name, tool_input)
        print(json.dumps({"decision": "deny", "reason": reason}, ensure_ascii=False))
    except Exception:
        _emit_allow()


if __name__ == "__main__":
    main()
