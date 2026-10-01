"""Read bootstrap's Fresh link lists (SYMLINKS and LEGACY_SYMLINKS)."""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from .isolation import real_home

FRESH_PREFIX = ".config/fresh/"
_ENTRY = re.compile(r'^\s*"([^"|]+)\|([^"|]+)"\s*$')


@dataclass(frozen=True)
class Link:
    source: str  # path relative to the repo's .config/fresh
    target: str  # path relative to $HOME/.config/fresh


def default_bootstrap(profile_root: Path) -> Path:
    """The bootstrap beside the profile's repo, else the one in ~/.dotfiles."""
    beside = Path(profile_root).resolve().parent / "scripts" / "bootstrap"
    if beside.is_file():
        return beside
    return real_home() / ".dotfiles" / ".config" / "scripts" / "bootstrap"


def _fresh_rel(value: str, anchor: str) -> str | None:
    marker = anchor + FRESH_PREFIX
    if marker not in value:
        return None
    return value.split(marker, 1)[1].rstrip("/")


def fresh_links(bootstrap: Path) -> tuple[list[Link], list[Link]]:
    """Return (links, legacy_links) whose source is under the repo's .config/fresh."""
    lists: dict[str, list[Link]] = {"SYMLINKS": [], "LEGACY_SYMLINKS": []}
    current = None
    for line in Path(bootstrap).read_text().splitlines():
        stripped = line.strip()
        if current is None:
            for name in lists:
                if stripped == f"{name}=(":
                    current = name
            continue
        if stripped == ")":
            current = None
            continue
        match = _ENTRY.match(line)
        if not match:
            continue
        source = _fresh_rel(match.group(1), "$HOME/.dotfiles/")
        target = _fresh_rel(match.group(2), "$HOME/")
        if source is not None and target is not None:
            lists[current].append(Link(source, target))
    return lists["SYMLINKS"], lists["LEGACY_SYMLINKS"]
