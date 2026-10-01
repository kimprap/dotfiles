#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["pyte==0.8.2"]
# ///
"""Fresh profile test runner: test | drift | live | soak.

Run from anywhere as `uv run --script .config/fresh/tests/run.py <command>`.
Cases and the catalog come from the --profile tree when it holds FEATURES.md and
tests/cases/, else from this runner's tree. The case API is documented in
harness/__init__.py.
"""
from __future__ import annotations

import sys

sys.dont_write_bytecode = True

import argparse
import importlib.util
import json
import os
import shutil
import signal
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path

TESTS = Path(__file__).resolve().parent
sys.path.insert(0, str(TESTS))

from harness import catalog as catalog_mod  # noqa: E402
from harness import live as live_mod  # noqa: E402
from harness.bootstrap import default_bootstrap  # noqa: E402
from harness.isolation import Fingerprint, refuse_real_profile, sha256_file, tree_sha256  # noqa: E402
from harness.session import Session, Unrun  # noqa: E402

DEFAULT_TIMEOUT = 90
GLOBAL_TOOLS = ("git",)


@dataclass(frozen=True)
class Tree:
    profile_root: Path
    catalog: Path
    cases: Path
    fixtures: Path

    @classmethod
    def of(cls, profile_root: Path, catalog: Path | None = None) -> "Tree":
        root = Path(profile_root).resolve()
        tests = root / "tests"
        if not (tests / "cases").is_dir():
            tests = TESTS
        return cls(root, Path(catalog or root / "FEATURES.md").resolve(), tests / "cases", tests / "fixtures")


RUNNER_TREE = Tree.of(TESTS.parent)


def _tree_for_profile(profile: Path) -> Tree:
    if (profile / "FEATURES.md").is_file() and (profile / "tests" / "cases").is_dir():
        return Tree.of(profile)
    return RUNNER_TREE


def _drift(tree: Tree) -> tuple[list[str], int, int]:
    return catalog_mod.drift(tree.catalog, tree.cases, tree.profile_root, default_bootstrap(tree.profile_root))


def _live_lines() -> list[str]:
    repo = Path.home() / ".dotfiles"
    bootstrap = repo / ".config" / "scripts" / "bootstrap"
    if not bootstrap.is_file():
        return [f"live: skipped (no bootstrap at {bootstrap})"]
    lines, _count = live_mod.report(Path.home(), repo, bootstrap)
    return lines


def cmd_drift(args) -> int:
    tree = Tree.of(Path(args.catalog).resolve().parent, args.catalog) if args.catalog else RUNNER_TREE
    problems, rows, cases = _drift(tree)
    for line in problems:
        print(line)
    if problems:
        print(f"drift: rows={rows} cases={cases} problems={len(problems)}")
        return 1
    print(f"drift: rows={rows} cases={cases} ok")
    return 0


def cmd_live(args) -> int:
    home = Path(args.home).expanduser().resolve() if args.home else Path.home()
    repo = Path(args.repo).expanduser().resolve() if args.repo else Path.home() / ".dotfiles"
    bootstrap = repo / ".config" / "scripts" / "bootstrap"
    if not bootstrap.is_file():
        print(f"live: no bootstrap at {bootstrap}", file=sys.stderr)
        return 2
    lines, problems = live_mod.report(home, repo, bootstrap)
    print("\n".join(lines))
    return 1 if problems else 0


class CaseTimeout(Exception):
    pass


def _on_alarm(_signum, _frame):
    raise CaseTimeout("case exceeded its TIMEOUT")


def _load_case(path: Path):
    spec = importlib.util.spec_from_file_location(f"fresh_case_{path.stem}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    if getattr(module, "CASE_ID", None) != path.stem or not callable(getattr(module, "run", None)):
        raise ValueError(f"case {path.name} must define CASE_ID = {path.stem!r} and run(s)")
    return module


def _one_line(text: str, limit: int = 400) -> str:
    text = " ".join(str(text).split())
    return text if len(text) <= limit else text[:limit - 3] + "..."


def _run_case(case_id: str, tree: Tree, binary: Path, profile: Path, tools: dict[str, str],
              keep: bool, signatures: tuple[str, ...] = (),
              notes: list[str] | None = None) -> tuple[str, str, float, str | None]:
    """Return (status PASS|FAIL|UNRUN, detail, seconds, last screen text); catalogued upstream
    signatures the case's log carried are appended to `notes`."""
    started = time.monotonic()
    try:
        module = _load_case(tree.cases / f"{case_id}.py")
    except Exception as error:
        return "FAIL", _one_line(f"case load: {type(error).__name__}: {error}"), 0.0, None
    requires = tuple(getattr(module, "REQUIRES", ()))
    resolved = dict(tools)
    missing = []
    for tool in requires:
        found = shutil.which(tool)
        if found:
            resolved[tool] = found
        else:
            missing.append(tool)
    if missing:
        return "UNRUN", f"missing prerequisite: {', '.join(missing)}", 0.0, None
    session = Session(case_id, binary, profile, tree.fixtures, resolved, keep, signatures)
    status, detail, screen = "PASS", "", None
    previous = signal.signal(signal.SIGALRM, _on_alarm)
    signal.alarm(int(getattr(module, "TIMEOUT", DEFAULT_TIMEOUT)))
    try:
        module.run(session)
    except Unrun as error:
        status, detail = "UNRUN", _one_line(error)
    except AssertionError as error:
        status, detail = "FAIL", _one_line(str(error) or "assertion failed")
    except Exception as error:
        status, detail = "FAIL", _one_line(f"{type(error).__name__}: {error}")
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, previous)
    if session._screen is not None:
        screen = session.screen().text if session.fd is not None else "\n".join(session._screen.display)
    teardown = session.close()
    if notes is not None:
        notes.extend(session.log_notes)
    if status == "PASS" and teardown:
        status, detail = "FAIL", _one_line("teardown: " + "; ".join(teardown))
    if status == "PASS" and session.log_hits:
        status, detail = "FAIL", _one_line("log guard: " + session.log_hits[0])
    if keep:
        detail = (detail + f" [kept {session.root}]").strip()
    return status, detail, time.monotonic() - started, screen


def _unrun_all(selected, rows_by_case, reason) -> int:
    for case_id in selected:
        row = rows_by_case.get(case_id)
        print(f"UNRUN {row.id if row else '-'} {case_id} {reason}")
    print(f"summary: pass=0 fail=0 unrun={len(selected)} limit=0 lifted=0 drift=0 isolation=ok")
    return 2


def _check_inputs(args) -> tuple[Path, Path] | int:
    binary = Path(args.binary).expanduser().absolute()
    profile = Path(args.profile).expanduser().resolve()
    if not (binary.is_file() and os.access(binary, os.X_OK)):
        print(f"invalid --binary {binary}: not an executable file", file=sys.stderr)
        return 2
    if not profile.is_dir():
        print(f"invalid --profile {profile}: not a directory", file=sys.stderr)
        return 2
    reason = refuse_real_profile(profile)
    if reason:
        print(f"refused: {reason}", file=sys.stderr)
        return 2
    return binary, profile


def _global_tools() -> tuple[dict[str, str], str | None]:
    tools, missing = {}, []
    for tool in GLOBAL_TOOLS:
        found = shutil.which(tool)
        if found:
            tools[tool] = found
        else:
            missing.append(tool)
    try:
        import pyte  # noqa: F401
    except ImportError:
        missing.append("python package pyte (run through `uv run --script`)")
    return tools, (f"missing prerequisite: {', '.join(missing)}" if missing else None)


def cmd_test(args) -> int:
    checked = _check_inputs(args)
    if isinstance(checked, int):
        return checked
    binary, profile = checked
    tree = _tree_for_profile(profile)
    rows, _limited = catalog_mod.parse(tree.catalog)
    signatures = catalog_mod.signatures(tree.catalog)
    rows_by_case = {row.case: row for row in rows}
    available = catalog_mod.case_ids(tree.cases)
    selected = list(dict.fromkeys(args.case)) if args.case else available
    unknown = [c for c in selected if c not in available]
    if unknown:
        print(f"invalid --case: no case file for {', '.join(unknown)} in {tree.cases}", file=sys.stderr)
        return 2
    tools, missing = _global_tools()
    if missing:
        return _unrun_all(selected, rows_by_case, missing)

    fingerprint = Fingerprint(binary)
    problems, _nrows, _ncases = _drift(tree)
    for line in problems:
        print(line)
    counts = {"pass": 0, "fail": 0, "unrun": 0, "limit": 0, "lifted": 0}
    results = []
    for case_id in selected:
        row = rows_by_case.get(case_id)
        row_id = row.id if row else "-"
        notes: list[str] = []
        status, detail, secs, screen = _run_case(case_id, tree, binary, profile, tools, args.keep,
                                                 signatures, notes)
        limited = row is not None and row.status == "upstream-limitation"
        if limited and status == "PASS":
            status, detail = "LIFTED", "desired behavior now passes"
        elif limited and status == "FAIL":
            status, detail = "LIMIT", f"still blocked ({detail})"
        if status == "PASS":
            print(f"PASS {row_id} {case_id} {secs:.1f}s", flush=True)
        else:
            print(f"{status} {row_id} {case_id} {detail}", flush=True)
            if args.verbose and screen:
                print("\n".join("    | " + line.rstrip() for line in screen.splitlines()))
        for signature in notes:
            print(f"NOTE {row_id} {case_id} upstream rejection: {signature}", flush=True)
        counts[status.lower()] += 1
        results.append({"row": row_id, "case": case_id, "status": status, "detail": detail,
                        "secs": round(secs, 2), "upstream_notes": notes})
    print("live:")
    for line in _live_lines():
        print(f"  {line}")
    isolation = fingerprint.differences()
    for line in isolation:
        print(f"isolation: FAIL {line}")
    ok = not counts["fail"] and not counts["unrun"] and not problems and not isolation
    summary = dict(counts, drift=len(problems), isolation="FAIL" if isolation else "ok")
    exit_code = 0 if ok else 1
    if args.json:
        version = subprocess.run([str(binary), "--version"], capture_output=True, text=True,
                                 timeout=15).stdout.strip()
        payload = {
            "ok": ok, "exit": exit_code, "summary": summary, "all_cases": not args.case,
            "binary": {"path": str(binary), "sha256": fingerprint.binary_sha256, "version": version},
            "profile": {"path": str(profile), "sha256": tree_sha256(profile),
                        "algorithm": "harness.isolation.tree_sha256"},
            "drift": problems, "isolation": isolation, "cases": results,
        }
        Path(args.json).write_text(json.dumps(payload, indent=2) + "\n")
    print("summary: " + " ".join(f"{k}={v}" for k, v in summary.items()))
    return exit_code


def cmd_soak(args) -> int:
    from harness import soak as soak_mod
    checked = _check_inputs(args)
    if isinstance(checked, int):
        return checked
    binary, profile = checked
    workspace = Path(args.workspace).expanduser().resolve()
    if not workspace.is_dir():
        print(f"invalid --workspace {workspace}", file=sys.stderr)
        return 2
    tools, missing = _global_tools()
    lsof = shutil.which("lsof")
    if missing or not lsof:
        print(f"soak: unrun ({missing or 'missing prerequisite: lsof'})")
        return 2
    tools["lsof"] = lsof
    fingerprint = Fingerprint(binary)
    tree = _tree_for_profile(profile)
    line, ok, notes = soak_mod.run(binary, profile, workspace, args.minutes, RUNNER_TREE.fixtures,
                                   tools, args.keep, catalog_mod.signatures(tree.catalog))
    for note in notes:
        print(f"soak note: {note}")
    isolation = fingerprint.differences()
    for problem in isolation:
        print(f"isolation: FAIL {problem}")
    print(line)
    return 0 if ok and not isolation else 1


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = parser.add_subparsers(dest="command", required=True)
    test = sub.add_parser("test", help="drift, then cases, then the live report")
    test.add_argument("--binary", required=True)
    test.add_argument("--profile", required=True)
    test.add_argument("--case", action="append", default=[], help="case id (file stem); repeatable")
    test.add_argument("--json", help="write the result JSON here")
    test.add_argument("--keep", action="store_true", help="keep per-case roots")
    test.add_argument("--verbose", action="store_true", help="print the last screen of non-passing cases")
    drift = sub.add_parser("drift", help="catalog <-> cases <-> bootstrap links")
    drift.add_argument("--catalog")
    live = sub.add_parser("live", help="read-only live Fresh link and user-layer report")
    live.add_argument("--home")
    live.add_argument("--repo")
    soak = sub.add_parser("soak", help="long session in a real workspace under ulimit -n 256")
    soak.add_argument("--binary", required=True)
    soak.add_argument("--profile", required=True)
    soak.add_argument("--workspace", required=True)
    soak.add_argument("--minutes", type=float, required=True)
    soak.add_argument("--keep", action="store_true")
    args = parser.parse_args(argv)
    handler = {"test": cmd_test, "drift": cmd_drift, "live": cmd_live, "soak": cmd_soak}[args.command]
    return handler(args)


if __name__ == "__main__":
    raise SystemExit(main())
