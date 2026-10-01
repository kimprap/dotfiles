#!/usr/bin/env python3
"""bump-fresh helper: check | swap | rollback | proposal-check.

Stdlib only. The procedure that calls these subcommands is ../SKILL.md.

Exit codes: 0 ok; 1 failure (check query failed, proposal problems);
2 invalid invocation; 3 refused (a swap precondition or a rollback conflict),
nothing changed; 4 swap failed and was rolled back automatically; 5 the
automatic rollback itself failed (restore by hand from the record);
10 `check` found a newer release.

The profile tree digest, the bootstrap link list and the catalog parser come
from the Fresh test harness in this checkout (`.config/fresh/tests/harness`),
the same code `run.py test --json` uses.
"""
from __future__ import annotations

import sys

sys.dont_write_bytecode = True

import argparse  # noqa: E402
import hashlib  # noqa: E402
import importlib  # noqa: E402
import json  # noqa: E402
import os  # noqa: E402
import re  # noqa: E402
import shutil  # noqa: E402
import stat  # noqa: E402
import subprocess  # noqa: E402
import tempfile  # noqa: E402
import types  # noqa: E402
from datetime import datetime, timezone  # noqa: E402
from pathlib import Path  # noqa: E402

SCRIPT = Path(__file__).resolve()
# .config/agents/skills/bump-fresh/scripts/fresh_bump.py -> .config/fresh/tests
TESTS = SCRIPT.parents[4] / "fresh" / "tests"
REPO_PROFILE = Path(".config") / "fresh"
BOOTSTRAP = Path(".config") / "scripts" / "bootstrap"
SESSION_DATA = Path("Library") / "Application Support" / "fresh"
RELEASE_REPO = "sinelaw/fresh"
TREE_ALGORITHM = "harness.isolation.tree_sha256"

EXIT_FAIL, EXIT_USAGE, EXIT_REFUSED, EXIT_ROLLED_BACK, EXIT_ROLLBACK_FAILED = 1, 2, 3, 4, 5
EXIT_NEWER = 10

_VERSION = re.compile(r"(\d+)\.(\d+)\.(\d+)")
_CHILD_ROW = re.compile(r"^- `?([A-Za-z0-9_-]+)`?:\s*(.*)$")
_URL = re.compile(r"https?://\S+")
PROPOSAL_H2 = "## Fresh bump proposal"
PROPOSAL_FIELDS = ("Versions", "Retire", "Adapt", "Keep", "Blocked", "New defaults",
                   "Upstream limitations", "Config drift", "Candidate plan", "Approval")
CLASSIFICATION = ("Retire", "Adapt", "Keep")
REQUIRED_FIELDS = ("Versions", "Approval")


class Usage(Exception):
    """Invalid invocation (exit 2)."""


def harness():
    """The harness modules that need no third-party package.

    `harness/__init__.py` imports the PTY session (and with it pyte), so the
    package is registered without running it.
    """
    if not (TESTS / "harness" / "isolation.py").is_file():
        raise Usage(f"Fresh test harness not found at {TESTS / 'harness'}")
    if "harness" not in sys.modules:
        package = types.ModuleType("harness")
        package.__path__ = [str(TESTS / "harness")]
        sys.modules["harness"] = package
    return types.SimpleNamespace(
        isolation=importlib.import_module("harness.isolation"),
        bootstrap=importlib.import_module("harness.bootstrap"),
        catalog=importlib.import_module("harness.catalog"),
    )


def version_of(text: str) -> tuple[str, tuple[int, int, int]] | None:
    match = _VERSION.search(text or "")
    if not match:
        return None
    return match.group(0), tuple(int(part) for part in match.groups())


def run(argv, env=None, timeout=30) -> subprocess.CompletedProcess:
    return subprocess.run([str(a) for a in argv], capture_output=True, text=True, env=env,
                          timeout=timeout, stdin=subprocess.DEVNULL)


def isolated_env(root: Path) -> dict[str, str]:
    """A private HOME/runtime/tmp so a `--version` call touches nothing real."""
    for name in ("home", "run", "tmp"):
        (root / name).mkdir(mode=0o700, exist_ok=True)
    return {"PATH": os.environ.get("PATH", "/usr/bin:/bin"), "HOME": str(root / "home"),
            "XDG_RUNTIME_DIR": str(root / "run"), "TMPDIR": str(root / "tmp")}


def binary_version(binary: Path) -> str:
    """`<binary> --version` stdout in a throwaway HOME; raises OSError/RuntimeError."""
    with tempfile.TemporaryDirectory(prefix="fresh-bump-version.") as scratch:
        done = run([binary, "--version"], env=isolated_env(Path(scratch)), timeout=30)
    if done.returncode != 0:
        raise RuntimeError(f"{binary} --version exited {done.returncode}: {done.stderr.strip()}")
    return done.stdout.strip()


# --------------------------------------------------------------------------- check


def cmd_check(args) -> int:
    live = Path(args.live_bin).expanduser()
    try:
        done = run([live, "--version"], timeout=30)
    except (OSError, subprocess.TimeoutExpired) as error:
        print(f"check: cannot run {live} --version: {error}", file=sys.stderr)
        return EXIT_FAIL
    installed = version_of(done.stdout)
    if done.returncode != 0 or installed is None:
        print(f"check: {live} --version gave no version (exit {done.returncode}): "
              f"{(done.stdout + done.stderr).strip()}", file=sys.stderr)
        return EXIT_FAIL
    query = ["gh", "release", "view", "--repo", RELEASE_REPO, "--json", "tagName,publishedAt,url"]
    try:
        done = run(query, timeout=60)
    except (OSError, subprocess.TimeoutExpired) as error:
        print(f"check: release query failed: {error}", file=sys.stderr)
        return EXIT_FAIL
    if done.returncode != 0:
        print(f"check: release query exited {done.returncode}: {done.stderr.strip()}", file=sys.stderr)
        return EXIT_FAIL
    try:
        tag = json.loads(done.stdout)["tagName"]
    except (ValueError, KeyError, TypeError) as error:
        print(f"check: unreadable release query output ({error}): {done.stdout.strip()[:200]}",
              file=sys.stderr)
        return EXIT_FAIL
    latest = version_of(str(tag))
    if latest is None:
        print(f"check: release tag {tag!r} holds no version", file=sys.stderr)
        return EXIT_FAIL
    if latest[1] > installed[1]:
        print(f"Fresh update available v{installed[0]} -> v{latest[0]}")
        return EXIT_NEWER
    print(f"Fresh up to date (v{installed[0]})")
    return 0


# --------------------------------------------------------------------------- proposal-check


def cmd_proposal_check(args) -> int:
    h = harness()
    rows, _limited = h.catalog.parse(Path(args.catalog))
    row_ids = [row.id for row in rows]
    lines = Path(args.proposal).read_text().splitlines()
    problems: list[str] = []
    try:
        start = next(i for i, line in enumerate(lines) if line.strip() == PROPOSAL_H2)
    except StopIteration:
        problems.append(f"PROPOSAL heading {PROPOSAL_H2!r} missing")
        start = len(lines)
    fields: dict[str, list[str]] = {}
    order: list[str] = []
    current = None
    for line in lines[start + 1:]:
        stripped = line.strip()
        if stripped.startswith("## "):
            break
        label = re.fullmatch(r"\*\*(.+)\*\*", stripped)
        if label:
            current = label.group(1)
            if current in fields:
                problems.append(f"PROPOSAL field {current}: repeated")
            elif current not in PROPOSAL_FIELDS:
                problems.append(f"PROPOSAL field {current}: unknown")
            order.append(current)
            fields.setdefault(current, [])
        elif current and stripped:
            fields[current].append(stripped)
    known = [name for name in order if name in PROPOSAL_FIELDS]
    if known != sorted(set(known), key=PROPOSAL_FIELDS.index):
        problems.append("PROPOSAL fields out of order: expected " + ", ".join(PROPOSAL_FIELDS))
    for name in fields:
        if not fields[name]:
            problems.append(f"PROPOSAL field {name}: empty (omit empty fields)")
    for name in REQUIRED_FIELDS:
        if start < len(lines) and name not in fields:
            problems.append(f"PROPOSAL field {name}: missing")

    seen: dict[str, list[tuple[str, bool]]] = {}
    for name in CLASSIFICATION:
        for child in fields.get(name, []):
            match = _CHILD_ROW.match(child)
            if not match:
                problems.append(f"PROPOSAL {name} child not `- <row-id>: <reason> (<link>)`: {child}")
                continue
            row_id, reason = match.groups()
            if row_id not in row_ids:
                problems.append(f"PROPOSAL {row_id}: not a catalog row ({name})")
                continue
            seen.setdefault(row_id, []).append((name, bool(_URL.search(reason))))
    classified = evidence = 0
    for row_id in row_ids:
        places = seen.get(row_id, [])
        if not places:
            problems.append(f"PROPOSAL {row_id}: not classified")
        elif len(places) > 1:
            problems.append(f"PROPOSAL {row_id}: classified {len(places)} times ("
                            + ", ".join(name for name, _ in places) + ")")
        else:
            classified += 1
            if places[0][1]:
                evidence += 1
            else:
                problems.append(f"PROPOSAL {row_id}: no evidence link")
    for line in problems:
        print(line)
    print(f"proposal: rows={len(row_ids)} classified={classified} evidence={evidence}")
    return EXIT_FAIL if problems else 0


# --------------------------------------------------------------------------- shared file helpers


def entry_digest(path: Path) -> str | None:
    """Content digest as in harness.isolation.tree_sha256; None when absent."""
    if path.is_symlink():
        return hashlib.sha256(("symlink:" + os.readlink(path)).encode()).hexdigest()
    if not path.exists():
        return None
    digest = hashlib.sha256()
    with open(path, "rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def install(source: Path, dest: Path) -> None:
    """Write `source` beside `dest`, then rename it into place (bytes, mode or link)."""
    temp = dest.parent / f".{dest.name}.fresh-bump-new"
    try:
        if temp.is_symlink() or temp.exists():
            temp.unlink()
        if source.is_symlink():
            os.symlink(os.readlink(source), temp)
        else:
            shutil.copyfile(source, temp)
            shutil.copymode(source, temp)
        os.replace(temp, dest)
    finally:
        if temp.is_symlink() or temp.exists():
            temp.unlink()


def copy_entry(source: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if source.is_symlink():
        os.symlink(os.readlink(source), dest)
    else:
        shutil.copy2(source, dest)


def skip_special(directory: str, names: list[str]) -> list[str]:
    """copytree ignore: sockets, FIFOs and devices cannot be copied."""
    skipped = []
    for name in names:
        mode = os.lstat(os.path.join(directory, name)).st_mode
        if not (stat.S_ISREG(mode) or stat.S_ISDIR(mode) or stat.S_ISLNK(mode)):
            skipped.append(name)
    return skipped


def link_map(home: Path) -> dict[str, str]:
    live_dir = home / REPO_PROFILE
    result: dict[str, str] = {}
    if not live_dir.is_dir():
        return result
    for directory, dirnames, filenames in os.walk(live_dir):
        for name in sorted(dirnames + filenames):
            path = Path(directory) / name
            rel = path.relative_to(live_dir).as_posix()
            if path.is_symlink():
                result[rel] = "symlink:" + os.readlink(path)
            elif path.is_file():
                result[rel] = "file:" + (entry_digest(path) or "")
    return dict(sorted(result.items()))


def now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def write_record(record: Path, data: dict) -> None:
    temp = record / ".record.json.new"
    temp.write_text(json.dumps(data, indent=2) + "\n")
    os.replace(temp, record / "record.json")


# --------------------------------------------------------------------------- swap


def running_pids(live: Path) -> list[str]:
    """Processes executing the live binary: argv[0]/argv[1] naming it, or holding it open."""
    names = {str(live), os.path.realpath(live)}
    found: set[str] = set()
    listing = run(["ps", "-axww", "-o", "pid=,args="], timeout=30)
    for line in listing.stdout.splitlines():
        pid, _, argv = line.strip().partition(" ")
        if pid.isdigit() and int(pid) != os.getpid() and names & set(argv.split()[:2]):
            found.add(pid)
    if live.exists():
        opened = run(["lsof", "-t", "--", live], timeout=60)
        found.update(p for p in opened.stdout.split() if p.isdigit() and int(p) != os.getpid())
    return sorted(found, key=int)


def runtime_dir() -> Path:
    """Fresh's daemon socket dir: $XDG_RUNTIME_DIR/fresh, else /tmp/fresh-<uid>."""
    xdg = os.environ.get("XDG_RUNTIME_DIR")
    return Path(xdg) / "fresh" if xdg else Path(f"/tmp/fresh-{os.getuid()}")


def daemon_sockets(runtime: Path) -> list[str]:
    """Unix sockets under the runtime dir that a process holds open (read-only lsof).

    Not `fresh --cmd daemon list`: that prunes stale socket files as it lists.
    """
    prefixes = tuple({str(runtime) + "/", os.path.realpath(runtime) + "/"})
    listing = run(["lsof", "-U", "-F", "pn"], timeout=60)
    found, pid = set(), ""
    for line in listing.stdout.splitlines():
        if line.startswith("p"):
            pid = line[1:]
        elif line.startswith("n") and line[1:].startswith(prefixes):
            found.add(f"{line[1:]} (pid {pid})")
    return sorted(found)



def result_problems(result_path: Path, candidate_bin: Path, candidate_profile: Path,
                    h) -> tuple[list[str], list[dict]]:
    """(problems, tolerated failures). A pass allows FAILs only at the candidate catalog's
    `### Known intermittent failures`: the case listed and its message starting with the prefix."""
    try:
        result = json.loads(result_path.read_text())
    except (OSError, ValueError) as error:
        return [f"test result {result_path}: unreadable ({error})"], []
    problems, tolerated = [], []
    summary = result.get("summary") or {}
    counts = " ".join(f"{k}={summary.get(k)}" for k in ("fail", "unrun", "drift", "isolation"))
    fails = [c for c in result.get("cases") or [] if c.get("status") == "FAIL"]
    catalog = candidate_profile / "FEATURES.md"
    known = {}
    if fails and catalog.is_file():
        known = {e.case: e for e in h.catalog.known_failures(catalog)[0]}
    untolerated = []
    for case in fails:
        entry, detail = known.get(case.get("case")), str(case.get("detail", ""))
        if entry and detail.startswith(entry.prefix):
            tolerated.append({"case": entry.case, "row": entry.row, "message": detail})
        else:
            untolerated.append(f"{case.get('case')}: {detail}")
    passed = (summary.get("fail") == len(fails) and summary.get("unrun") == 0
              and summary.get("drift") == 0 and summary.get("isolation") == "ok" and not untolerated)
    if not passed:
        problems.append(f"test result {result_path}: not a pass ({counts})"
                        + "".join(f"; FAIL not tolerated {line}" for line in untolerated))
    if result.get("all_cases") is not True:
        problems.append(f"test result {result_path}: not a full run (--case was used)")
    binary = result.get("binary") or {}
    if binary.get("sha256") != entry_digest(candidate_bin):
        problems.append(f"test result binary sha256 {binary.get('sha256')} != candidate {candidate_bin}")
    profile = result.get("profile") or {}
    if profile.get("algorithm") != TREE_ALGORITHM:
        problems.append(f"test result profile digest algorithm {profile.get('algorithm')!r} != {TREE_ALGORITHM}")
    elif profile.get("sha256") != h.isolation.tree_sha256(candidate_profile):
        problems.append(f"test result profile sha256 {profile.get('sha256')} != candidate {candidate_profile}")
    return problems, tolerated


def live_check(home: Path, repo: Path) -> tuple[int, str]:
    runner = TESTS / "run.py"
    try:
        done = run(["uv", "run", "--script", runner, "live", "--home", home, "--repo", repo], timeout=300)
    except (OSError, subprocess.TimeoutExpired) as error:
        return EXIT_FAIL, f"cannot run {runner} live: {error}"
    return done.returncode, (done.stdout + done.stderr).strip()


def plan_changes(repo_dir: Path, candidate: Path, h) -> dict[str, list[str]]:
    repo_entries = dict(h.isolation.tree_entries(repo_dir))
    cand_entries = dict(h.isolation.tree_entries(candidate))
    return {
        "changed": sorted(rel for rel, path in cand_entries.items()
                          if rel in repo_entries and entry_digest(path) != entry_digest(repo_entries[rel])),
        "added": sorted(rel for rel in cand_entries if rel not in repo_entries),
        "removed": sorted(rel for rel in repo_entries if rel not in cand_entries),
    }


def link_list_problems(repo: Path, candidate: Path, plan: dict, h) -> list[str]:
    """The candidate must fit the fixed bootstrap link set; it cannot edit bootstrap itself."""
    links, _legacy = h.bootstrap.fresh_links(repo / BOOTSTRAP)
    sources = [link.source for link in links]
    problems = []
    for source in sources:
        if (repo / REPO_PROFILE / source).exists() and not (candidate / source).exists():
            problems.append(f"candidate removes bootstrap-linked {source}")
    for rel in plan["added"]:
        if rel.split("/")[0] in h.catalog.NON_RUNTIME:
            continue
        if not any(rel == s or rel.startswith(s + "/") for s in sources):
            problems.append(f"candidate adds {rel}, which no bootstrap Fresh link covers")
    return [p + "; bootstrap's Fresh link list must change and the user must rerun bootstrap first"
            for p in problems]


def cmd_swap(args) -> int:
    h = harness()
    record = Path(args.record).expanduser().absolute()
    candidate_bin = Path(args.candidate_bin).expanduser().absolute()
    candidate = Path(args.candidate_profile).expanduser().resolve()
    repo = Path(args.repo).expanduser().resolve()
    live = Path(args.live_bin).expanduser().absolute()
    home = Path(args.home).expanduser().resolve()
    result_path = Path(args.result).expanduser().absolute() if args.result else candidate.parent / "result.json"
    repo_dir = repo / REPO_PROFILE
    if record.exists() and (not record.is_dir() or any(record.iterdir())):
        raise Usage(f"--record {record} must be a new or empty directory")
    for label, path, ok in (("--candidate-bin", candidate_bin, candidate_bin.is_file()),
                            ("--candidate-profile", candidate, candidate.is_dir()),
                            ("--repo", repo, (repo_dir).is_dir() and (repo / BOOTSTRAP).is_file()),
                            ("--live-bin", live, live.is_file()),
                            ("--home", home, home.is_dir())):
        if not ok:
            raise Usage(f"invalid {label} {path}")

    # 1. Preconditions: refuse with exit 3 and change nothing.
    problems: list[str] = []
    pids = running_pids(live)
    if pids:
        problems.append(f"live binary {live} is running (pid {', '.join(pids)}); quit Fresh first")
    sockets = daemon_sockets(runtime_dir())
    if sockets:
        problems.append("live Fresh daemon listening: " + ", ".join(sockets) + "; quit Fresh first")
    result_issues, tolerated = result_problems(result_path, candidate_bin, candidate, h)
    problems += result_issues
    for item in tolerated:
        print(f"TOLERATED {item['case']}: {item['message']}")
    status = run(["git", "-C", repo, "status", "--porcelain", "--untracked-files=all", "--", REPO_PROFILE])
    if status.returncode != 0:
        problems.append(f"git status failed in {repo}: {status.stderr.strip()}")
    elif status.stdout.strip():
        problems.append(f"repo Fresh paths have uncommitted changes: {' '.join(status.stdout.split())}")
    code, output = live_check(home, repo)
    if code != 0:
        problems.append(f"run.py live exited {code}: {' | '.join(output.splitlines())}")
    plan = plan_changes(repo_dir, candidate, h)
    problems += link_list_problems(repo, candidate, plan, h)
    if problems:
        for line in problems:
            print(f"REFUSED {line}")
        print("swap: refused; nothing changed")
        return EXIT_REFUSED

    # 2. Rollback pair.
    record.mkdir(mode=0o700, parents=True, exist_ok=True)
    result = json.loads(result_path.read_text())
    try:
        old_version = binary_version(live)
    except (OSError, RuntimeError, subprocess.TimeoutExpired) as error:
        old_version = f"unknown ({error})"
    copy_entry(live, record / "bin" / "fresh")
    for rel in plan["changed"] + plan["removed"]:
        copy_entry(repo_dir / rel, record / "repo" / rel)
    session = home / SESSION_DATA
    if session.is_dir():
        shutil.copytree(session, record / "session-data", symlinks=True, ignore=skip_special)
    revision = run(["git", "-C", repo, "rev-parse", "HEAD"]).stdout.strip()
    data = {
        "format": 1, "created": now_utc(), "status": "recorded",
        "repo": str(repo), "dotfiles_revision": revision, "home": str(home), "live_bin": str(live),
        "candidate_bin": str(candidate_bin), "candidate_profile": str(candidate), "result": str(result_path),
        "binary": {"old_sha256": entry_digest(live), "old_version": old_version,
                   "new_sha256": entry_digest(candidate_bin), "new_version": result["binary"].get("version")},
        "profile": {
            "pre_sha256": h.isolation.tree_sha256(repo_dir),
            "candidate_sha256": h.isolation.tree_sha256(candidate),
            "changed": [{"path": rel, "pre": entry_digest(repo_dir / rel), "post": entry_digest(candidate / rel)}
                        for rel in plan["changed"]],
            "added": [{"path": rel, "post": entry_digest(candidate / rel)} for rel in plan["added"]],
            "removed": [{"path": rel, "pre": entry_digest(repo_dir / rel)} for rel in plan["removed"]],
            "created_dirs": [], "removed_dirs": [],
        },
        "tolerated_failures": tolerated,
        "session_data": {"path": str(session), "copied": session.is_dir()},
        "links": link_map(home),
    }
    write_record(record, data)
    print(f"record: {record}")

    # 3. Apply, then 4. identity check; any failure rolls back.
    failure = None
    try:
        data["status"] = "applying"
        write_record(record, data)
        for rel in plan["changed"] + plan["added"]:
            dest = repo_dir / rel
            missing = []
            parent = dest.parent
            while not parent.exists():
                missing.append(parent)
                parent = parent.parent
            for directory in reversed(missing):
                directory.mkdir()
                data["profile"]["created_dirs"].append(directory.relative_to(repo_dir).as_posix())
            install(candidate / rel, dest)
        for rel in plan["removed"]:
            (repo_dir / rel).unlink()
            parent = (repo_dir / rel).parent
            while parent != repo_dir and not any(parent.iterdir()):
                parent.rmdir()
                data["profile"]["removed_dirs"].append(parent.relative_to(repo_dir).as_posix())
                parent = parent.parent
        install(candidate_bin, live)
        failure = identity_problems(live, candidate_bin, candidate, repo_dir, home, repo, result, h)
    except Exception as error:  # any failure in apply or identity check must roll back
        failure = [f"apply failed: {error}"]
    finally:
        write_record(record, data)
    if failure:
        for line in failure:
            print(f"FAILED {line}")
        print("swap: rolling back")
        code = rollback(record, with_session_data=False)
        if code != 0:
            print(f"swap: automatic rollback failed; restore by hand from {record}")
            return EXIT_ROLLBACK_FAILED
        print(f"swap: rolled back; live install unchanged; record {record}")
        return EXIT_ROLLED_BACK
    data["status"] = "activated"
    data["activated"] = now_utc()
    write_record(record, data)
    for key in ("changed", "added", "removed"):
        for rel in plan[key]:
            print(f"{key} {REPO_PROFILE / rel}")
    print(f"swap: activated {data['binary']['old_version']} -> {data['binary']['new_version']}; record {record}")
    print(f"rollback: python3 {SCRIPT} rollback --record {record}")
    uncommitted = run(["git", "-C", repo, "status", "--porcelain", "--untracked-files=all", "--", REPO_PROFILE])
    for line in uncommitted.stdout.splitlines():
        print(f"uncommitted {line.strip()}")
    return 0


def identity_problems(live, candidate_bin, candidate, repo_dir, home, repo, result, h) -> list[str]:
    problems = []
    if entry_digest(live) != entry_digest(candidate_bin):
        problems.append("live binary sha256 differs from the candidate's")
    want = (result.get("binary") or {}).get("version")
    try:
        got = binary_version(live)
        if got != want:
            problems.append(f"live --version reports {got!r}, expected {want!r}")
    except (OSError, RuntimeError, subprocess.TimeoutExpired) as error:
        problems.append(f"live --version failed: {error}")
    if h.isolation.tree_sha256(repo_dir) != h.isolation.tree_sha256(candidate):
        problems.append("repo Fresh profile bytes differ from the candidate's")
    code, output = live_check(home, repo)
    if code != 0:
        problems.append(f"run.py live exited {code}: {' | '.join(output.splitlines())}")
    return problems


# --------------------------------------------------------------------------- rollback


def rollback(record: Path, with_session_data: bool) -> int:
    data = json.loads((record / "record.json").read_text())
    repo_dir = Path(data["repo"]) / REPO_PROFILE
    live = Path(data["live_bin"])
    binary, profile = data["binary"], data["profile"]
    steps: list[tuple[str, Path, Path | None]] = []  # (verb, target, source or None to delete)
    conflicts: list[str] = []

    current = entry_digest(live)
    if current == binary["new_sha256"] and current != binary["old_sha256"]:
        steps.append(("restored", live, record / "bin" / "fresh"))
    elif current != binary["old_sha256"]:
        conflicts.append(f"{live}: sha256 {current} is neither the swapped-in nor the recorded binary")
    for item in profile["changed"]:
        target, current = repo_dir / item["path"], entry_digest(repo_dir / item["path"])
        if current == item["post"]:
            steps.append(("restored", target, record / "repo" / item["path"]))
        elif current != item["pre"]:
            conflicts.append(f"{target}: changed since the swap")
    for item in profile["added"]:
        target, current = repo_dir / item["path"], entry_digest(repo_dir / item["path"])
        if current == item["post"]:
            steps.append(("removed", target, None))
        elif current is not None:
            conflicts.append(f"{target}: changed since the swap")
    for item in profile["removed"]:
        target, current = repo_dir / item["path"], entry_digest(repo_dir / item["path"])
        if current is None:
            steps.append(("restored", target, record / "repo" / item["path"]))
        elif current != item["pre"]:
            conflicts.append(f"{target}: recreated since the swap")
    if conflicts:
        for line in conflicts:
            print(f"CONFLICT {line}")
        print("rollback: refused; newer work would be overwritten; nothing changed")
        return EXIT_REFUSED

    for verb, target, source in steps:
        if source is None:
            target.unlink()
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            install(source, target)
        print(f"{verb} {target}")
    for rel in reversed(profile.get("created_dirs", [])):
        directory = repo_dir / rel
        if directory.is_dir() and not any(directory.iterdir()):
            directory.rmdir()
            print(f"removed {directory}/")
    if with_session_data:
        session = Path(data["session_data"]["path"])
        if not data["session_data"]["copied"]:
            print(f"session data: none recorded for {session}")
        else:
            if session.exists():
                aside = record / f"session-data.replaced-{now_utc()}"
                shutil.move(str(session), str(aside))
                print(f"moved current session data to {aside}")
            shutil.copytree(record / "session-data", session, symlinks=True)
            print(f"restored {session}")
    data["status"] = "rolled back"
    data["rolled_back"] = now_utc()
    write_record(record, data)
    print(f"rollback: ok; record {record}")
    return 0


def cmd_rollback(args) -> int:
    record = Path(args.record).expanduser().absolute()
    if not (record / "record.json").is_file():
        raise Usage(f"--record {record} holds no record.json")
    return rollback(record, args.with_session_data)


# --------------------------------------------------------------------------- CLI


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = parser.add_subparsers(dest="command", required=True)
    check = sub.add_parser("check", help="compare the installed Fresh with the latest release")
    check.add_argument("--live-bin", default=str(Path.home() / ".local" / "bin" / "fresh"))
    swap = sub.add_parser("swap", help="install a passing candidate binary + profile with a rollback record")
    swap.add_argument("--record", required=True, help="new private directory for the rollback record")
    swap.add_argument("--candidate-bin", required=True)
    swap.add_argument("--candidate-profile", required=True, help="the candidate copy of .config/fresh")
    swap.add_argument("--result", help="run.py test --json output (default: <candidate-profile>/../result.json)")
    swap.add_argument("--repo", default=str(Path.home() / ".dotfiles"))
    swap.add_argument("--live-bin", default=str(Path.home() / ".local" / "bin" / "fresh"))
    swap.add_argument("--home", default=str(Path.home()))
    back = sub.add_parser("rollback", help="restore the pre-swap binary and repo Fresh paths")
    back.add_argument("--record", required=True)
    back.add_argument("--with-session-data", action="store_true",
                      help="also restore the recorded session data (the current copy is moved aside)")
    proposal = sub.add_parser("proposal-check", help="every catalog row classified once with evidence")
    proposal.add_argument("--catalog", required=True)
    proposal.add_argument("proposal")
    args = parser.parse_args(argv)
    handler = {"check": cmd_check, "swap": cmd_swap, "rollback": cmd_rollback,
               "proposal-check": cmd_proposal_check}[args.command]
    try:
        return handler(args)
    except Usage as error:
        print(f"{args.command}: {error}", file=sys.stderr)
        return EXIT_USAGE


if __name__ == "__main__":
    raise SystemExit(main())
