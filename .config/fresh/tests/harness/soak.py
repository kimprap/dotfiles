"""Long isolated session in a real workspace under `ulimit -n 256` (spec §3.2 soak)."""
from __future__ import annotations

import re
import subprocess
import time
from pathlib import Path

from .session import Session

NOFILE = 256
FDS_LIMIT = 128
COUNTERS = {
    "emfile": re.compile(r"os error 24"),
    "recovery": re.compile(r"Auto-recovery-save error|Failed to end recovery session"),
    "workspace": re.compile(r"Failed to save workspace|Failed to save file state"),
    "spawn": re.compile(r"failed to spawn", re.IGNORECASE),
    "rejections": re.compile(r"Unhandled Promise rejection"),
}


def _fd_count(pid: int) -> int:
    out = subprocess.run(["lsof", "-n", "-P", "-p", str(pid)], capture_output=True, text=True,
                         timeout=30).stdout
    return max(0, len(out.splitlines()) - 1)


def run(binary: Path, profile: Path, workspace: Path, minutes: float, fixtures: Path,
        tools: dict[str, str], keep: bool,
        signatures: tuple[str, ...] = ()) -> tuple[str, bool, list[str]]:
    """Return (soak line plus its `soak-upstream:` line, ok, notes). `rejections` excludes
    catalogued upstream signatures, which the second line counts per signature."""
    s = Session("soak", binary, profile, fixtures, tools, keep, signatures)
    notes: list[str] = []
    peak = 0
    try:
        s.launch(workspace, nofile=NOFILE, cwd=workspace, ready_timeout=60)
        s.action("new")  # unnamed scratch buffer: auto-recovery target
        end = time.monotonic() + minutes * 60
        tick = 0
        while True:
            peak = max(peak, _fd_count(s.pid))
            s.type(f"soak {tick}\n")  # every 30 s: auto-recovery of the unsaved buffer
            if tick % 2 == 1:  # every 60 s: the file finder spawns `git ls-files`
                s.action("quick_open_files")
                s.sleep(2)
                s.keys("escape")
            tick += 1
            remaining = end - time.monotonic()
            if remaining <= 0:
                break
            s.sleep(min(30.0, remaining))
        peak = max(peak, _fd_count(s.pid))
        notes += s.stop(force=False, timeout=20)
    except Exception as error:  # the soak reports, never raises
        notes.append(f"{type(error).__name__}: {error}")
    finally:
        notes += s.close()
    counts = {name: 0 for name in COUNTERS}
    upstream = {sig: 0 for sig in s.signatures}
    for line in s.final_log.splitlines():
        signature = s.upstream_signature(line) if COUNTERS["rejections"].search(line) else None
        if signature is not None:
            upstream[signature] += 1
            continue
        for name, pattern in COUNTERS.items():
            if pattern.search(line):
                counts[name] += 1
    label = f"{minutes:g}"
    line = (f"soak: minutes={label} " + " ".join(f"{k}={v}" for k, v in counts.items())
            + f" fds_peak={peak}")
    line += "\nsoak-upstream: " + (" ".join(f"{sig}={n}" for sig, n in upstream.items()) or "none")
    ok = not notes and not any(counts.values()) and 0 < peak <= FDS_LIMIT
    return line, ok, notes
