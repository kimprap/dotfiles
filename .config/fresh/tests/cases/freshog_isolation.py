"""freshog-isolation: `bin/freshog` runs upstream Fresh with executable, profile and session state
separate from daily Fresh, including nested integrated-terminal launches, with bundled plugins
available."""

import re
import subprocess
from pathlib import Path

from harness import Unrun

CASE_ID = "freshog_isolation"
REQUIRES = ()
TIMEOUT = 120

# `bin/freshog` lives in the dotfiles checkout, not the profile. A profile copied out of the repo
# (a bump-fresh candidate) uses the default checkout, as `run.py live` does.
_CHECKOUT = Path(__file__).resolve().parents[4] / "bin" / "freshog"
FRESHOG = (
    _CHECKOUT if _CHECKOUT.is_file() else Path.home() / ".dotfiles" / "bin" / "freshog"
)
PROBE = "zz-test-probe.ts"  # the harness probe; freshog's profile links only this instrumentation
PATH_LINE = r"^\s*[^:\n]+:\s+(/.*?)\s*$"  # `Label:   /absolute/path` rows of `--cmd config paths`
DAILY_DIRS = ("home", "data", "state", "cache")


def _daily_files(s):
    """Files under the case's daily Fresh dirs, excluding harness-owned probe/log/shell artifacts."""
    found = set()
    for name in DAILY_DIRS:
        for path in (s.root / name).rglob("*"):
            rel = path.relative_to(s.root)
            if (
                rel.parts[:4] == ("home", ".config", "fresh", "plugins")
                and path.name == PROBE
            ):
                continue
            if rel.parts[:2] == ("home", ".sh_history"):
                continue
            if rel.parts[:2] == ("home", "freshog"):
                continue
            if path.is_file():
                found.add((str(rel), path.stat().st_mtime_ns))
    return found


def _config_paths(s, env):
    result = subprocess.run(
        [str(FRESHOG), "--cmd", "config", "paths"],
        env=env,
        cwd=s.work,
        capture_output=True,
        text=True,
        timeout=30,
        stdin=subprocess.DEVNULL,
    )
    s.check(
        result.returncode == 0,
        f"freshog --cmd config paths exits 0: {result.stderr.strip()[:200]}",
    )
    return [Path(p) for p in re.findall(PATH_LINE, result.stdout, re.M)]


def run(s):
    if not FRESHOG.is_file():
        raise Unrun(f"no {FRESHOG}")
    root = (
        s.root / "home" / "freshog"
    )  # FRESHOG_ROOT inside the case, never the real one
    (root / "bin").mkdir(parents=True)
    (root / "bin" / "fresh").symlink_to(s.binary)
    fresh_home = root / "home"
    plugins = fresh_home / ".config" / "fresh" / "plugins"
    plugins.mkdir(parents=True)
    (plugins / PROBE).symlink_to(s.config_dir / "plugins" / PROBE)
    s.write("a.txt", "alpha\n")

    env = dict(s.env, FRESHOG_ROOT=str(root))
    daily_before = _daily_files(s)

    # Effective paths: config, data and logs all live under FRESHOG_ROOT/home.
    paths = _config_paths(s, env)
    s.check(
        paths and all(fresh_home in p.parents for p in paths),
        f"freshog's effective Fresh paths are under FRESHOG_ROOT/home: {[str(p) for p in paths]}",
    )

    # A TUI launch: upstream profile (no daily plugins or keys), bundled plugins available.
    s.env = env
    s.binary = FRESHOG
    s.launch("a.txt")
    s.wait_text("alpha")
    status = s.wait_screen(
        lambda sc: re.search(r"Ln \d+, Col \d+", sc.lines[-1]),
        what="the upstream Ln/Col status",
    ).lines[-1]
    s.check(
        not re.search(r"\d+:\d+\|\d+", status),
        f"the daily cursor-status plugin is absent from freshog: {status.strip()!r}",
    )
    s.keys("ctrl+p")
    s.type("git log")
    s.wait_text("Git Log")  # bundled git_log plugin command

    s.keys("escape", "escape")

    # Nested: freshog launched from freshog's integrated terminal keeps the same FRESHOG_ROOT.
    s.action("open_terminal")
    s.wait_state(
        lambda st: st["buffer"]["is_terminal"], what="freshog's integrated terminal"
    )
    out = s.path("nested.txt")
    s.type(
        f"'{FRESHOG}' --cmd config paths > '{out}' 2>&1; echo \"root=$FRESHOG_ROOT\" >> '{out}'\n"
    )
    s.wait(
        lambda: out.exists() and "root=" in out.read_text(),
        what="the nested freshog run",
    )
    nested = out.read_text()
    nested_paths = [
        Path(p) for p in re.findall(PATH_LINE, nested.split("root=")[0], re.M)
    ]
    s.check(
        f"root={root}\n" in nested,
        f"the integrated terminal keeps FRESHOG_ROOT: {nested[-200:]!r}",
    )
    s.check(
        nested_paths
        and all(
            fresh_home in p.parents and not (fresh_home / "freshog") in p.parents
            for p in nested_paths
        ),
        f"a nested freshog resolves the same FRESHOG_ROOT/home: {[str(p) for p in nested_paths]}",
    )
    s.keys("ctrl+space")
    s.type("exit\n")
    s.stop()

    daily_after = _daily_files(s)
    s.check(
        daily_after == daily_before,
        f"freshog writes nothing under daily Fresh dirs: {sorted(daily_after ^ daily_before)[:5]}",
    )
    workspaces = fresh_home / "Library" / "Application Support" / "fresh" / "workspaces"
    session_state = (
        [p for p in workspaces.glob("*.json")] if workspaces.is_dir() else []
    )
    s.check(
        session_state,
        f"freshog saves its workspace session under FRESHOG_ROOT/home ({workspaces})",
    )
