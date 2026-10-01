#!/usr/bin/env python3
"""`bump-fresh` swap: a failed or refused swap leaves the live install byte-identical
(spec AC-8 c-e), and a candidate test FAIL is tolerated only at the candidate catalog's
`### Known intermittent failures` (case listed, message starting with its prefix).

Run: python3 .config/fresh/tests/test_fresh_bump.py

Each test builds a sandbox under a new temp dir: a copy of the installed Fresh
as the live binary, a `git clone` of this repository at HEAD as the repo, a
home whose `.config/fresh` holds bootstrap's Fresh links into that clone, a
candidate profile with one changed plugin byte and a catalog listing one known
failure, and a pass result JSON whose hashes match the candidate. The real
install is only read (copied).
Needs git, uv and an installed Fresh at ~/.local/bin/fresh; skips otherwise.
"""
from __future__ import annotations

import sys

sys.dont_write_bytecode = True

import hashlib  # noqa: E402
import importlib  # noqa: E402
import json  # noqa: E402
import os  # noqa: E402
import shutil  # noqa: E402
import signal  # noqa: E402
import subprocess  # noqa: E402
import tempfile  # noqa: E402
import types  # noqa: E402
import unittest  # noqa: E402
from pathlib import Path  # noqa: E402

TESTS = Path(__file__).resolve().parent
REPO_ROOT = TESTS.parents[2]
SCRIPT = REPO_ROOT / ".config" / "agents" / "skills" / "bump-fresh" / "scripts" / "fresh_bump.py"

# The harness package __init__ needs pyte; register the package without running it.
if "harness" not in sys.modules:
    _package = types.ModuleType("harness")
    _package.__path__ = [str(TESTS / "harness")]
    sys.modules["harness"] = _package
isolation = importlib.import_module("harness.isolation")
bootstrap = importlib.import_module("harness.bootstrap")

INSTALLED = isolation.real_home() / ".local" / "bin" / "fresh"
KNOWN_PREFIX = "timed out after 5s waiting for first match yellow, second grey"


def file_hashes(*roots: Path) -> dict[str, str]:
    """sha256 of every regular file under the roots (as `find -type f | xargs shasum`)."""
    result = {}
    for root in roots:
        for directory, _dirs, files in os.walk(root):
            for name in files:
                path = Path(directory) / name
                if path.is_file() and not path.is_symlink():
                    result[str(path)] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


@unittest.skipUnless(INSTALLED.is_file() and shutil.which("git") and shutil.which("uv"),
                     "needs git, uv and an installed Fresh")
class SwapSafety(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix="fbt."))
        self.addCleanup(shutil.rmtree, self.root, ignore_errors=True)
        self.repo = self.root / "repo"
        subprocess.run(["git", "clone", "--quiet", str(REPO_ROOT), str(self.repo)], check=True)
        profile = self.repo / ".config" / "fresh"

        self.live = self.root / "live" / "fresh"
        self.live.parent.mkdir()
        shutil.copy2(INSTALLED, self.live)

        self.home = self.root / "home"
        links, _legacy = bootstrap.fresh_links(self.repo / ".config" / "scripts" / "bootstrap")
        for link in links:
            target = self.home / ".config" / "fresh" / link.target
            target.parent.mkdir(parents=True, exist_ok=True)
            target.symlink_to(profile / link.source)

        self.candidate = self.root / "candidate"
        self.candidate_profile = self.candidate / "profile"
        shutil.copytree(profile, self.candidate_profile, symlinks=True)
        plugin = sorted((self.candidate_profile / "plugins").glob("*.ts"))[0]
        data = bytearray(plugin.read_bytes())
        data[-1] = ord(" ") if data[-1] != ord(" ") else ord("\n")
        plugin.write_bytes(bytes(data))
        (self.candidate_profile / "FEATURES.md").write_text(
            "## Upstream limitations\n\n- search-selection: draw order\n\n"
            "### Known intermittent failures\n\n"
            f"- `search_selection`: `{KNOWN_PREFIX}` — search-selection\n")
        self.candidate_bin = self.candidate / "bin" / "fresh"
        self.candidate_bin.parent.mkdir()
        shutil.copy2(INSTALLED, self.candidate_bin)
        version = subprocess.run([str(INSTALLED), "--version"], capture_output=True, text=True,
                                 env={"PATH": "/usr/bin:/bin", "HOME": str(self.root / "vhome")},
                                 check=True).stdout.strip()
        self.result = self.candidate / "result.json"
        self.write_result(version=version)

        self.env = dict(os.environ, XDG_RUNTIME_DIR=str(self.root / "run"))
        self.watched = (self.root / "live", profile)

    def write_result(self, fails=(), unrun: int = 0, version: str | None = None):
        """fails: (case, first failure message) pairs reported as FAIL."""
        if version is None:
            version = json.loads(self.result.read_text())["binary"]["version"]
        clean = not fails and not unrun
        self.result.write_text(json.dumps({
            "ok": clean, "exit": 0 if clean else 1, "all_cases": True,
            "summary": {"pass": 23 - len(fails) - unrun, "fail": len(fails), "unrun": unrun, "limit": 2,
                        "lifted": 0, "drift": 0, "isolation": "ok"},
            "binary": {"path": str(self.candidate_bin), "version": version,
                       "sha256": hashlib.sha256(self.candidate_bin.read_bytes()).hexdigest()},
            "profile": {"path": str(self.candidate_profile), "algorithm": "harness.isolation.tree_sha256",
                        "sha256": isolation.tree_sha256(self.candidate_profile)},
            "cases": [{"row": case.replace("_", "-"), "case": case, "status": "FAIL", "detail": detail,
                       "secs": 1.0} for case, detail in fails],
        }))

    def swap(self) -> subprocess.CompletedProcess:
        return subprocess.run(
            [sys.executable, str(SCRIPT), "swap", "--record", str(self.root / "record"),
             "--candidate-bin", str(self.candidate_bin), "--candidate-profile", str(self.candidate_profile),
             "--result", str(self.result), "--repo", str(self.repo), "--live-bin", str(self.live),
             "--home", str(self.home)],
            capture_output=True, text=True, env=self.env, timeout=600)

    def assert_swap_leaves_unchanged(self, exit_code: int, reason: str):
        before = file_hashes(*self.watched)
        done = self.swap()
        self.assertEqual(done.returncode, exit_code, done.stdout + done.stderr)
        self.assertIn(reason, done.stdout)
        self.assertEqual(file_hashes(*self.watched), before)

    def test_unrunnable_candidate_binary_is_rolled_back(self):
        self.candidate_bin.chmod(0o644)
        self.assert_swap_leaves_unchanged(4, "live --version failed")

    def test_running_live_binary_refuses(self):
        self.live.write_text("#!/bin/sh\nsleep 60\n")
        self.live.chmod(0o755)
        running = subprocess.Popen([str(self.live)], start_new_session=True)
        self.addCleanup(running.wait)
        self.addCleanup(os.killpg, running.pid, signal.SIGKILL)
        self.assert_swap_leaves_unchanged(3, "is running")

    def test_failed_test_result_refuses(self):
        # fail=1 at a case the catalog does not list
        self.write_result(fails=[("file_chords", "timed out after 5s waiting for Cmd+R m language picker")])
        self.assert_swap_leaves_unchanged(3, "not a pass")

    def test_catalogued_case_failing_elsewhere_refuses(self):
        self.write_result(fails=[("search_selection", "timed out after 5s waiting for empty Search: prompt")])
        self.assert_swap_leaves_unchanged(3, "not a pass")

    def test_unrun_case_refuses_despite_tolerated_failure(self):
        self.write_result(fails=[("search_selection", KNOWN_PREFIX + " (run 2)")], unrun=1)
        self.assert_swap_leaves_unchanged(3, "not a pass")

    def test_only_catalogued_failures_swap_and_are_recorded(self):
        message = KNOWN_PREFIX + " (run 2)"
        self.write_result(fails=[("search_selection", message)])
        done = self.swap()
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertIn(f"TOLERATED search_selection: {message}", done.stdout.splitlines())
        record = json.loads((self.root / "record" / "record.json").read_text())
        self.assertEqual([(t["case"], t["message"]) for t in record["tolerated_failures"]],
                         [("search_selection", message)])


if __name__ == "__main__":
    unittest.main()
