"""Read-only check of a live Fresh config dir against bootstrap's Fresh links (spec §4.3)."""
from __future__ import annotations

import filecmp
import json
import os
import re
from pathlib import Path

from .bootstrap import fresh_links


def _strip_jsonc(text: str) -> str:
    out, i, n = [], 0, len(text)
    while i < n:
        ch = text[i]
        if ch == '"':
            j = i + 1
            while j < n and text[j] != '"':
                j += 2 if text[j] == "\\" else 1
            out.append(text[i:j + 1])
            i = j + 1
        elif text.startswith("//", i):
            while i < n and text[i] != "\n":
                i += 1
        elif text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = n if end < 0 else end + 2
        else:
            out.append(ch)
            i += 1
    return re.sub(r",(\s*[}\]])", r"\1", "".join(out))


def load_jsonc(path: Path):
    return json.loads(_strip_jsonc(Path(path).read_text()))


def _flatten(value, prefix=""):
    if isinstance(value, dict) and value:
        for key, child in value.items():
            yield from _flatten(child, f"{prefix}.{key}" if prefix else key)
    else:
        yield prefix, value


def _set_by(keys: set[str], key: str) -> bool:
    """A key is shadowed when the platform layer sets it or one of its ancestors."""
    parts = key.split(".")
    return any(".".join(parts[:i]) in keys for i in range(1, len(parts) + 1))


def _same_tree(a: Path, b: Path) -> bool:
    if a.is_dir() != b.is_dir():
        return False
    if not a.is_dir():
        return filecmp.cmp(a, b, shallow=False)
    cmp = filecmp.dircmp(a, b)
    if cmp.left_only or cmp.right_only or cmp.funny_files:
        return False
    if any(not filecmp.cmp(a / f, b / f, shallow=False) for f in cmp.common_files):
        return False
    return all(_same_tree(a / d, b / d) for d in cmp.common_dirs)


def _format(value) -> str:
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return text if len(text) <= 80 else text[:77] + "..."


def check(home: Path, repo: Path, bootstrap: Path) -> tuple[list[str], list[str]]:
    """Return (LIVE problem lines, USER-LAYER information lines)."""
    live_dir = Path(home) / ".config" / "fresh"
    repo_dir = Path(repo) / ".config" / "fresh"
    links, legacy = fresh_links(bootstrap)
    problems: list[str] = []
    for link in links:
        target, source = live_dir / link.target, repo_dir / link.source
        if target.is_symlink():
            if os.path.realpath(target) != os.path.realpath(source):
                problems.append(f"LIVE {link.target}: differs from repo (symlink to {os.readlink(target)})")
        elif target.exists() and source.exists() and not _same_tree(target, source):
            problems.append(f"LIVE {link.target}: differs from repo")
        else:
            problems.append(f"LIVE {link.target}: not a symlink to {source}")
    for link in legacy:
        target, source = live_dir / link.target, repo_dir / link.source
        if target.is_symlink():
            # realpath resolves the existing prefix, so a dangling legacy link still compares.
            if os.path.realpath(target) == os.path.realpath(source):
                problems.append(f"LIVE {link.target}: legacy link still present")
    info: list[str] = []
    user = live_dir / "config.json"
    if user.is_file():
        platform = repo_dir / "config_macos.json"
        try:
            pinned = {key for key, _ in _flatten(load_jsonc(platform))} if platform.is_file() else set()
            data = load_jsonc(user)
        except (ValueError, OSError) as error:
            info.append(f"USER-LAYER unreadable: {error}")
        else:
            for key, value in _flatten(data):
                state = "shadowed" if _set_by(pinned, key) else "effective"
                info.append(f"USER-LAYER {key} = {_format(value)} ({state})")
    return problems, info


def report(home: Path, repo: Path, bootstrap: Path) -> tuple[list[str], int]:
    """Printable lines and the problem count."""
    problems, info = check(home, repo, bootstrap)
    lines = problems + info
    lines.append("live: ok" if not problems else f"live: problems={len(problems)}")
    return lines, len(problems)
