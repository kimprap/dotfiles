"""Isolation guards: real-HOME fingerprint, binary hash and profile tree digest."""
from __future__ import annotations

import hashlib
import os
import pwd
import stat
from pathlib import Path

# Never part of a profile tree digest or a runtime profile copy.
IGNORED_NAMES = frozenset({"__pycache__", ".DS_Store"})


def real_home() -> Path:
    """The account's home from the password database, independent of $HOME."""
    return Path(pwd.getpwuid(os.getuid()).pw_dir)


def real_fresh_config() -> Path:
    return real_home() / ".config" / "fresh"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tree_entries(root: Path):
    """Yield (relative posix path, Path) for files and symlinks under root, sorted, links not followed."""
    root = Path(root)
    found = []
    for directory, dirnames, filenames in os.walk(root, followlinks=False):
        dirnames[:] = sorted(d for d in dirnames if d not in IGNORED_NAMES)
        base = Path(directory)
        for name in list(dirnames):
            path = base / name
            if path.is_symlink():
                found.append(path)
        for name in filenames:
            if name not in IGNORED_NAMES:
                found.append(base / name)
    for path in sorted(found, key=lambda p: p.relative_to(root).as_posix()):
        yield path.relative_to(root).as_posix(), path


def tree_sha256(root: Path) -> str:
    """Digest of a profile tree, reproducible with stdlib only.

    Manifest: one line `<hex>  <relpath>\\n` per regular file or symlink under
    root (links not followed; `__pycache__` dirs and `.DS_Store` skipped), sorted
    by relpath, where <hex> is the file's sha256 or, for a symlink, the sha256 of
    `symlink:<readlink target>`. The digest is the sha256 of the manifest bytes.
    """
    lines = []
    for rel, path in tree_entries(root):
        if path.is_symlink():
            value = hashlib.sha256(("symlink:" + os.readlink(path)).encode()).hexdigest()
        else:
            value = sha256_file(path)
        lines.append(f"{value}  {rel}\n")
    return hashlib.sha256("".join(lines).encode()).hexdigest()


def lstat_map(root: Path) -> dict[str, tuple]:
    """lstat fingerprint of every entry under root, links not followed.

    The contents of a top-level `logs/` directory are skipped, because a running
    daily Fresh appends there; the directory entry itself is still recorded.
    """
    root = Path(root)
    result: dict[str, tuple] = {}
    if not os.path.lexists(root):
        return result
    for directory, dirnames, filenames in os.walk(root, followlinks=False):
        base = Path(directory)
        for name in sorted(dirnames + filenames):
            path = base / name
            rel = path.relative_to(root).as_posix()
            info = path.lstat()
            target = os.readlink(path) if stat.S_ISLNK(info.st_mode) else None
            result[rel] = (info.st_mode, info.st_size, info.st_mtime_ns, target)
        if base == root:
            dirnames[:] = [d for d in dirnames if d != "logs"]
    return result


class Fingerprint:
    """Snapshot of the real install that a run must leave untouched."""

    def __init__(self, binary: Path):
        self.binary = Path(binary)
        self.binary_sha256 = sha256_file(self.binary)
        self.config = lstat_map(real_fresh_config())

    def differences(self) -> list[str]:
        problems = []
        if sha256_file(self.binary) != self.binary_sha256:
            problems.append(f"binary {self.binary} changed")
        after = lstat_map(real_fresh_config())
        for rel in sorted(set(self.config) | set(after)):
            if self.config.get(rel) != after.get(rel):
                problems.append(f"real Fresh config entry changed: {rel}")
        return problems


def refuse_real_profile(profile: Path) -> str | None:
    """Return a reason when `profile` is (inside) the real ~/.config/fresh."""
    real = real_fresh_config().resolve()
    candidate = Path(profile).resolve()
    if candidate == real or real in candidate.parents:
        return f"--profile {profile} is inside the real Fresh config {real}"
    return None
