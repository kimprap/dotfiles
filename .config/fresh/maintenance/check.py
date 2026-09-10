#!/usr/bin/env python3
"""Fresh full/focused profile checks. Never installs or activates anything."""
from __future__ import annotations

import argparse
import codecs
import hashlib
import importlib
import importlib.metadata
import json
import os
from pathlib import Path
import re
import shutil
import signal
import stat
import subprocess
import sys
import time
import uuid

sys.dont_write_bytecode = True
CHECKER_FILES = ("check.py", "cases.py", "probe.ts", "requirements.txt")
ASSETS = ("config.json", "init.ts", "themes/cursor-dark.json", "plugins/cursor-status.ts")
VENDOR = "vendor/unicode-segmenter-0.17.3"
VENDOR_FILES = ("LICENSE", "core.js", "core.d.ts", "grapheme.js", "grapheme.d.ts", "_grapheme_data.js", "_grapheme_data.d.ts")
PACKAGE_FILES = ("INSTALL_RECEIPT.json", "sbom.spdx.json", ".brew/fresh-editor.rb", ".crates2.json")
DEPENDENCIES = {"pexpect": "4.9.0", "ptyprocess": "0.7.0", "pyte": "0.8.2", "wcwidth": "0.8.3"}


class PreflightError(Exception):
    pass


def sha256(path):
    h = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def dump(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False)
        stream.write("\n")


def inventory(root, *, profile=False):
    root = Path(root)
    result = {}
    visiting = set()

    def walk(directory, prefix):
        resolved = directory.resolve(strict=True)
        if resolved in visiting:
            raise PreflightError(f"cyclic input link: {directory}")
        visiting.add(resolved)
        for path in sorted(directory.iterdir()):
            rel = (prefix / path.name).as_posix()
            if profile and rel == "maintenance":
                continue
            if path.is_symlink() and not path.exists():
                raise PreflightError(f"broken input link: {path}")
            if path.is_symlink() and rel not in (*ASSETS, VENDOR):
                raise PreflightError(f"unexpected asset link: {path}")
            if path.is_dir():
                walk(path, Path(rel))
            elif path.is_file():
                result[rel] = sha256(path)
            else:
                raise PreflightError(f"input is not a regular file: {path}")
        visiting.remove(resolved)
    walk(root, Path())
    return result


def copy_files(source, destination, expected):
    destination.mkdir(parents=True, exist_ok=False)
    for rel, digest in expected.items():
        src, dst = source / rel, destination / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst, follow_symlinks=True)
        if sha256(src) != digest or sha256(dst) != digest:
            raise PreflightError(f"input changed while copying: {src}")


def freeze(root):
    for path in sorted(root.rglob("*"), reverse=True):
        path.chmod(0o555 if path.is_dir() or path.name == "fresh" else 0o444)
    root.chmod(0o555)


def writable_copy(source, destination):
    shutil.copytree(source, destination)
    destination.chmod(0o700)
    for path in destination.rglob("*"):
        path.chmod(0o700 if path.is_dir() else 0o600)


def isolated_env(root, path):
    env = {k: v for k, v in os.environ.items() if not k.startswith(("FRESH_", "GIT_", "DYLD_"))}
    locations = {
        "HOME": root / "home", "XDG_CONFIG_HOME": root / "home/.config",
        "XDG_DATA_HOME": root / "data", "XDG_STATE_HOME": root / "state",
        "XDG_CACHE_HOME": root / "cache", "XDG_RUNTIME_DIR": root / "run", "TMPDIR": root / "tmp",
        "ZDOTDIR": root / "home",
    }
    for key, directory in locations.items():
        directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        env[key] = str(directory)
    env.update(XDG_CONFIG_DIRS=env["XDG_CONFIG_HOME"], XDG_DATA_DIRS=env["XDG_DATA_HOME"],
               ENV=str(root / "home/sh.env"), BASH_ENV=str(root / "home/sh.env"))
    env.update(PATH=path, SHELL="/bin/sh", HISTFILE=str(root / "home/history"),
               TERM="xterm-256color", COLORTERM="truecolor", LANG="en_US.UTF-8",
               LC_ALL="en_US.UTF-8", PYTHONDONTWRITEBYTECODE="1", RUST_LOG="info")
    return env


def process_table():
    result = subprocess.run(["/bin/ps", "-axo", "pid=,ppid=,pgid=,lstart="], check=True,
                            capture_output=True, text=True, timeout=5)
    table = {}
    for line in result.stdout.splitlines():
        fields = line.split(None, 3)
        if len(fields) == 4:
            table[int(fields[0])] = (int(fields[1]), int(fields[2]), fields[3])
    return table

def validate_state(state):
    required = {"bufferId", "path", "name", "language", "view_mode", "length",
                "is_terminal", "is_virtual", "text", "primary", "all", "selected",
                "cursorCount", "mode", "search", "panes", "splits", "buffers"}
    if not isinstance(state, dict) or not required <= state.keys():
        raise RuntimeError("missing native snapshot fields")
    count = state["cursorCount"]
    if (type(count) is not int or count < 1 or not isinstance(state["all"], list) or
            len(state["all"]) != count or not isinstance(state["selected"], list) or
            len(state["selected"]) != count or not isinstance(state["primary"], dict) or
            type(state["primary"].get("position")) is not int):
        raise RuntimeError("missing/inconsistent cursor observations")
    if state["text"] is None:
        if not state["is_virtual"]:
            raise RuntimeError("unreadable real file buffer")
    elif not isinstance(state["text"], str):
        raise RuntimeError("invalid buffer text observation")
    if not all(isinstance(state[key], list) for key in ("panes", "splits", "buffers")):
        raise RuntimeError("missing native workspace observations")



class FreshSession:
    """Own one private PTY, its correlated observer, and its descendant processes."""

    def __init__(self, bundle, case_id, tools, path, run_id, prepare, register=None):
        import pexpect
        import pyte
        self.pexpect = pexpect
        self.bundle, self.case_id, self.run_id = bundle, case_id, run_id
        self.root = bundle / "runtime" / case_id
        self.root.mkdir(parents=True, mode=0o700)
        self.fixture = self.root / "fixture"
        self.env = isolated_env(self.root, path)
        self.tools = tools
        self.evidence = []
        self.seq = 0
        self.pending = None
        self.closed = False
        self.owned = {}
        self.child = None
        self.last_state = None
        self.received = b""
        self.query_tail = b""
        self.decoder = codecs.getincrementaldecoder("utf-8")("replace")
        self.screen = pyte.Screen(130, 42)
        self.stream = pyte.Stream(self.screen)
        self.trace = bundle / "evidence" / case_id
        self.trace.mkdir(parents=True)
        self.sent = self.trace / "sent.jsonl"
        self.sent.touch(exist_ok=False)
        if register is not None:
            register(self)
        profile = Path(self.env["XDG_CONFIG_HOME"]) / "fresh"
        writable_copy(bundle / "inputs/fresh", profile)
        probe = (bundle / "checker/probe.ts").read_text()
        for token, value in (("__FRESH_COMPAT_ROOT__", str(self.root)), ("__FRESH_COMPAT_RUN_ID__", run_id)):
            if probe.count(token) != 1:
                raise RuntimeError(f"probe template token not unique: {token}")
            probe = probe.replace(token, json.dumps(value))
        (profile / "plugins/fresh-compat-probe.ts").write_text(probe)
        prepare(self)
        try:
            self.child = pexpect.spawn(str(bundle / "inputs/bin/fresh"),
                ["--no-restore", "--no-upgrade-check", "--log-file", str(self.root / "fresh.log"),
                 str(self.fixture / "ordinary.txt")], cwd=str(self.fixture), env=self.env,
                dimensions=(42, 130), encoding=None)
            self.track_processes()
            self._reply(0, "ready", 45.0)
            print("FRESH_COMPAT_READY", case_id, flush=True)
        except BaseException:
            self.close()
            raise

    def track_processes(self):
        if self.child is None:
            return
        table = process_table()
        root = self.child.pid
        if root in table and root not in self.owned:
            self.owned[root] = table[root][2]
        changed = True
        while changed:
            changed = False
            for pid, (parent, _group, started) in table.items():
                if parent in self.owned and parent in table and table[parent][2] == self.owned[parent] and pid not in self.owned:
                    self.owned[pid] = started
                    changed = True

    def pump(self, timeout=0.04):
        try:
            chunk = self.child.read_nonblocking(65536, timeout=timeout)
        except self.pexpect.TIMEOUT:
            return
        except self.pexpect.EOF as error:
            raise RuntimeError("Fresh exited before the check completed") from error
        self.stream.feed(self.decoder.decode(chunk))
        with (self.root / "pty.log").open("ab") as stream:
            stream.write(chunk)
        pending = self.query_tail + chunk
        replies = {b"\x1b[c": b"\x1b[?1;2c", b"\x1b[0c": b"\x1b[?1;2c",
                   b"\x1b[>c": b"\x1b[>0;95;0c", b"\x1b[>0c": b"\x1b[>0;95;0c",
                   b"\x1b[?u": b"\x1b[?1u", b"\x1b[6n": b"\x1b[1;1R"}
        for match in re.finditer(rb"\x1b\[(?:0?c|>0?c|\?u|6n)", pending):
            self.child.send(replies[match.group()])
        # Retain only an incomplete query prefix, so a split escape is answered once.
        self.query_tail = b""
        for size in range(1, min(len(pending), 5) + 1):
            suffix = pending[-size:]
            if any(query.startswith(suffix) and query != suffix for query in replies):
                self.query_tail = suffix
        self.track_processes()
        if not getattr(self, "trust_handled", False) and "keep restricted" in "\n".join(self.screen.display).lower():
            # In a fresh home the native startup dialog selects Restricted (index 1).
            # Enter accepts that explicit safe choice; Escape would leave the modal open.
            self.trust_handled = True
            self.keys(b"\r")

    def _reply(self, seq, status, timeout):
        deadline = time.monotonic() + timeout
        response = self.root / "response.json"
        while time.monotonic() < deadline:
            self.pump()
            if response.exists():
                raw = response.read_bytes()
                if raw and raw != self.received:
                    try:
                        message = json.loads(raw)
                    except json.JSONDecodeError as error:
                        raise RuntimeError("malformed atomic probe reply") from error
                    if message.get("run_id") != self.run_id or message.get("seq") != seq:
                        raise RuntimeError(f"stale/mismatched probe reply: expected {self.run_id}/{seq}, got {message.get('run_id')}/{message.get('seq')}")
                    if message.get("status") != status:
                        raise RuntimeError(f"probe {message.get('status')}: {message.get('error')}")
                    state = message.get("state")
                    validate_state(state)
                    self.received, self.last_state = raw, state
                    self.pending = None
                    return state
        raise TimeoutError(f"probe {status} timed out: {self.case_id}/{seq}")

    def request(self, op: str, args: dict | None = None) -> dict:
        return self._request(op, args, 10.0)

    def _request(self, op, args, timeout):
        if self.pending is not None:
            # A predicate deadline can expire while its last snapshot is in flight.
            # Consume that same reply before publishing another request; never replay it.
            deadline = time.monotonic() + timeout
            self._reply(self.pending, "ok", timeout)
            timeout = deadline - time.monotonic()
            if timeout <= 0:
                raise TimeoutError("request deadline expired while settling the prior reply")
        args = args or {}
        if op == "open-path":
            target = Path(args["path"]).resolve(strict=True)
            if not target.is_relative_to(self.fixture.resolve()) or target.is_symlink():
                raise ValueError("open-path escaped fixture")
        self.seq += 1
        message = {"run_id": self.run_id, "seq": self.seq, "op": op, "args": args}
        temp = self.root / "request.next"
        temp.write_text(json.dumps(message))
        temp.replace(self.root / "request.json")
        self.pending = self.seq
        with (self.trace / "requests.jsonl").open("a") as stream:
            stream.write(json.dumps(message) + "\n")
        return self._reply(self.seq, "ok", timeout)

    def keys(self, *payloads: bytes) -> None:
        for payload in payloads:
            if not isinstance(payload, bytes):
                raise TypeError("key payload must be bytes")
            with self.sent.open("a") as stream:
                stream.write(json.dumps({"run_id": self.run_id, "after_seq": self.seq, "hex": payload.hex()}) + "\n")
            self.child.send(payload)
            self.pump(0.05)

    def snapshot(self) -> dict:
        return self.request("snapshot")

    def screen_result(self):
        rows = []
        for y in range(self.screen.lines):
            runs = []
            for x in range(self.screen.columns):
                cell = self.screen.buffer[y][x]
                attrs = {"fg": cell.fg, "bg": cell.bg, "bold": cell.bold,
                         "italics": cell.italics, "underscore": cell.underscore,
                         "reverse": cell.reverse, "strikethrough": cell.strikethrough}
                if runs and runs[-1]["attrs"] == attrs:
                    runs[-1]["text"] += cell.data
                    runs[-1]["width"] += 1
                else:
                    runs.append({"x": x, "width": 1, "text": cell.data, "attrs": attrs})
            rows.append(runs)
        return {"text": "\n".join(self.screen.display), "rows": rows,
                "cursor": {"x": self.screen.cursor.x, "y": self.screen.cursor.y}}

    def wait_state(self, predicate, timeout: float = 10.0) -> dict:
        deadline = time.monotonic() + timeout
        last = None
        while time.monotonic() < deadline:
            try:
                last = self._request("snapshot", None, max(0.0, min(10.0, deadline - time.monotonic())))
            except TimeoutError as error:
                observed = {key: last[key] for key in ("text", "primary", "cursorCount", "selected")} if last else None
                raise TimeoutError(f"native state predicate timed out ({self.case_id}); last observation={observed}; {error}") from error
            if predicate(last):
                return last
            self.pump()
        raise TimeoutError(f"native state predicate timed out ({self.case_id}): {last}")

    def wait_screen(self, predicate, timeout: float = 10.0) -> dict:
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            self.pump()
            screen = self.screen_result()
            if predicate(screen):
                return screen
        raise TimeoutError(f"screen predicate timed out ({self.case_id}):\n{self.screen_result()['text']}")

    def capture(self, name, details=None):
        state = self.snapshot()
        self.pump()
        screen = self.screen_result()
        payload = {"run_id": self.run_id, "case_id": self.case_id, "seq": self.seq,
                   "state": state, "screen": screen}
        if details is not None:
            payload["details"] = details
        path = self.trace / (name + ".json")
        dump(path, payload)
        path.chmod(0o444)
        self.evidence.append({"path": path.relative_to(self.bundle).as_posix(), "sha256": sha256(path)})
        return payload

    def close(self) -> None:
        if self.closed:
            return
        if self.child is not None:
            self.track_processes()
            if self.child.isalive():
                try:
                    self.request("stop")
                except (RuntimeError, TimeoutError, OSError):
                    pass
                deadline = time.monotonic() + 5
                while self.child.isalive() and time.monotonic() < deadline:
                    try:
                        self.pump()
                    except RuntimeError:
                        break
            self.track_processes()
            for sig in (signal.SIGTERM, signal.SIGKILL):
                table = process_table()
                for pid, started in reversed(list(self.owned.items())):
                    if pid in table and table[pid][2] == started:
                        try:
                            os.kill(pid, sig)
                        except ProcessLookupError:
                            pass
                deadline = time.monotonic() + 3
                while time.monotonic() < deadline:
                    self.child.isalive()  # Reap the directly owned PTY child.
                    table = process_table()
                    if not any(pid in table and table[pid][2] == started for pid, started in self.owned.items()):
                        break
                    time.sleep(0.05)
            self.child.close(force=True)
            table = process_table()
            leaked = [pid for pid, started in self.owned.items() if pid in table and table[pid][2] == started]
            dump(self.trace / "shutdown.json", {"run_id": self.run_id, "owned": self.owned, "remaining": leaked})
            if leaked:
                raise RuntimeError(f"owned processes survived shutdown: {leaked}")
        self.closed = True


def protected_fingerprint(profile, ghostty, binary, checker):
    result = {"profile": inventory(profile, profile=True), "ghostty": inventory(ghostty),
              "checker": {name: sha256(checker / name) for name in CHECKER_FILES},
              "binary": sha256(binary), "links": {}, "original_sources": {}}
    paths = [binary, profile, ghostty]
    paths.extend(profile / name for name in (*ASSETS, VENDOR))
    # The selected inputs may be a candidate or a replay. Original production
    # contents are a separate closure rooted at the unchanged live source links.
    live = Path.home() / ".config"
    original_profile = (live / "fresh/config.json").resolve(strict=True).parent
    for name in (*ASSETS, VENDOR):
        path = live / "fresh" / name
        if not path.is_symlink() or path.resolve(strict=True) != (original_profile / name).resolve(strict=True):
            raise PreflightError(f"live Fresh source link diverged: {path}")
        paths.append(path)
    live_ghostty = live / "ghostty"
    original_ghostty = original_profile.parent / "ghostty"
    if not live_ghostty.is_symlink() or live_ghostty.resolve(strict=True) != original_ghostty.resolve(strict=True):
        raise PreflightError(f"live Ghostty source link diverged: {live_ghostty}")
    paths.append(live_ghostty)
    for root, is_profile in ((original_profile, True), (original_ghostty, False)):
        for name, digest in inventory(root, profile=is_profile).items():
            result["original_sources"][str(root / name)] = digest
    originals = [original_profile.parent / "scripts/bootstrap",
                 live / "fresh/config.json.bak.20260909-182957",
                 Path("/opt/homebrew/bin/fresh")]
    for path in originals:
        if not path.is_file():
            raise PreflightError(f"missing protected original: {path}")
        result["original_sources"][str(path)] = sha256(path)
        paths.append(path)
    for path in paths:
        if path.is_symlink():
            result["links"][str(path)] = os.readlink(path)
    return result


def package_inputs(binary):
    real = binary.resolve()
    # Replayed bundles carry their exact original metadata, not the host's current package.
    if real.parent.name == "bin" and real.parent.parent.name == "inputs":
        package = real.parent.parent / "package"
        if not package.is_dir():
            raise PreflightError("replay bundle is missing inputs/package")
        return package, inventory(package), "bundle"
    prefix = real.parent.parent
    if (prefix / "INSTALL_RECEIPT.json").is_file():
        for name in PACKAGE_FILES:
            if not (prefix / name).is_file():
                raise PreflightError(f"missing Homebrew package metadata: {name}")
        return prefix, {name: sha256(prefix / name) for name in PACKAGE_FILES}, "homebrew"
    return None, {}, "standalone-no-package-metadata"


def preflight(args):
    out = Path(args.out).expanduser().absolute()
    if os.path.lexists(out):
        raise PreflightError(f"output already exists (never overwritten): {out}")
    binary = Path(args.binary).expanduser().absolute()
    profile, ghostty = Path(args.profile).resolve(), Path(args.ghostty).resolve()
    checker = Path(__file__).resolve().parent
    for root in (profile, ghostty, checker):
        if out.resolve().is_relative_to(root):
            raise PreflightError(f"output is inside an input tree: {root}")
    if not binary.is_file() or not os.access(binary, os.R_OK | os.X_OK):
        raise PreflightError(f"binary is not readable/executable: {binary}")
    if not args.upstream_ref.strip():
        raise PreflightError("upstream reference must not be empty")
    for name in (*ASSETS, *(VENDOR + "/" + n for n in VENDOR_FILES)):
        if not (profile / name).is_file():
            raise PreflightError(f"missing profile asset: {name}")
    for name in CHECKER_FILES:
        if not (checker / name).is_file():
            raise PreflightError(f"missing checker input: {name}")
    if not (ghostty / "config").is_file():
        raise PreflightError("missing Ghostty config")
    versions = {}
    for module, expected in DEPENDENCIES.items():
        try:
            importlib.import_module(module)
            versions[module] = importlib.metadata.version(module)
        except (ImportError, importlib.metadata.PackageNotFoundError) as error:
            raise PreflightError(f"missing Python dependency: {module}=={expected}") from error
        if versions[module] != expected:
            raise PreflightError(f"dependency version mismatch: {module} requires {expected}, found {versions[module]}")
    tools = {}
    for name in ("node", "prettier", "basedpyright", "basedpyright-langserver", "git"):
        path = shutil.which(name)
        if path is None:
            raise PreflightError(f"missing required executable on PATH: {name}")
        tools[name] = str(Path(path).absolute())
    if not Path("/bin/ps").is_file() or not Path("/bin/sh").is_file():
        raise PreflightError("requires /bin/ps and /bin/sh for owned-process isolation")
    tools["python"] = sys.executable
    package, metadata, provenance = package_inputs(binary)
    protected = protected_fingerprint(profile, ghostty, binary, checker)
    return out, binary, profile, ghostty, checker, tools, versions, package, metadata, provenance, protected


def verify_frozen(out, manifest, manifest_hash):
    if sha256(out / "manifest.json") != manifest_hash:
        raise RuntimeError("manifest changed during run")
    for key, root in (("profile_files", "inputs/fresh"), ("ghostty_files", "inputs/ghostty"),
                      ("checker_files", "checker"), ("package_files", "inputs/package")):
        if inventory(out / root) != manifest[key]:
            raise RuntimeError(f"frozen {key} changed during run")
    if sha256(out / "inputs/bin/fresh") != manifest["binary"]["sha256"]:
        raise RuntimeError("frozen binary changed during run")


def aggregate(out, run_id, records, case_ids, scope="full", selected_cases=None):
    selected = tuple(case_ids if selected_cases is None else selected_cases)
    if scope not in ("full", "focused") or not selected:
        raise RuntimeError("invalid or empty run scope")
    if tuple(case_id for case_id in case_ids if case_id in selected) != selected:
        raise RuntimeError("invalid, duplicate or noncanonical selected cases")
    if scope == "full" and selected != tuple(case_ids):
        raise RuntimeError("incomplete full-scope selection")
    if not isinstance(records, list) or any(not isinstance(record, dict) for record in records):
        raise RuntimeError("invalid case records")
    if [record.get("id") for record in records] != list(case_ids):
        raise RuntimeError("missing, duplicate, reordered or unexpected case records")
    failures = []
    for record in records:
        if record["id"] not in selected:
            if record["status"] != "unrun" or record["evidence"] or record["error"] is not None:
                raise RuntimeError(f"unselected case contains results: {record['id']}")
            continue
        if record["status"] != "pass":
            failures.append(f"{record['id']}={record['status']}")
            continue
        if not record["evidence"]:
            raise RuntimeError(f"missing evidence: {record['id']}")
        paths = set()
        for item in record["evidence"]:
            path = out / item["path"]
            if path in paths or not path.resolve().is_relative_to(out / "evidence" / record["id"]) or path.is_symlink():
                raise RuntimeError(f"non-fresh/duplicate evidence: {path}")
            paths.add(path)
            if not path.is_file() or sha256(path) != item["sha256"]:
                raise RuntimeError(f"missing or changed evidence: {path}")
            data = json.loads(path.read_text())
            if data.get("run_id") != run_id or data.get("case_id") != record["id"] or not isinstance(data.get("seq"), int) or data["seq"] <= 0:
                raise RuntimeError(f"stale evidence identity: {path}")
            validate_state(data.get("state"))
            screen = data.get("screen")
            if (not isinstance(screen, dict) or not isinstance(screen.get("text"), str) or
                    not screen["text"] or not isinstance(screen.get("rows"), list) or not screen["rows"]):
                raise RuntimeError(f"missing screen/state evidence: {path}")
        shutdown = json.loads((out / "evidence" / record["id"] / "shutdown.json").read_text())
        if shutdown.get("run_id") != run_id or shutdown.get("remaining") != []:
            raise RuntimeError(f"missing process shutdown proof: {record['id']}")
    if failures:
        raise RuntimeError("required case failures: " + ", ".join(failures))
    return "pass" if scope == "full" else "partial"



def require_accepted_bundle(root, case_ids):
    result = json.loads((root / "result.json").read_text())
    manifest = json.loads((root / "manifest.json").read_text())
    if not isinstance(result, dict) or not isinstance(manifest, dict) or manifest.get("schema") != 1:
        raise RuntimeError("invalid input bundle records")
    if result.get("scope") != "full" or result.get("status") != "pass" or result.get("protected_unchanged") is not True:
        raise RuntimeError("input bundle is not an accepted successful full-scope baseline")
    if result.get("selected_cases") != list(case_ids) or result.get("run_id") != manifest.get("run_id"):
        raise RuntimeError("accepted baseline has incomplete selection or mismatched run identity")
    verify_frozen(root, manifest, result["manifest_sha256"])
    aggregate(root, result["run_id"], result["cases"], case_ids, "full", result["selected_cases"])

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("binary", "profile", "ghostty", "upstream-ref", "out"):
        parser.add_argument("--" + name, required=True)
    parser.add_argument("--case", action="append", metavar="CASE_ID",
                        help="check a group for development; repeat to select more (success is partial, never accepted)")
    args = parser.parse_args(argv)
    try:
        from cases import CASE_IDS, prepare, run_all
        if args.case is not None:
            unknown = sorted(set(args.case) - set(CASE_IDS))
            if unknown:
                raise PreflightError("unknown case IDs: " + ", ".join(unknown))
            if len(args.case) != len(set(args.case)):
                raise PreflightError("duplicate --case request")
        scope = "full" if args.case is None else "focused"
        selected_cases = [case_id for case_id in CASE_IDS if args.case is None or case_id in args.case]
        (out, binary, profile, ghostty, checker, tools, versions, package,
         metadata, provenance, protected) = preflight(args)
        real = binary.resolve()
        if scope == "full" and real.parent.name == "bin" and real.parent.parent.name == "inputs":
            source_bundle = real.parent.parent.parent
            if profile == source_bundle / "inputs/fresh" and ghostty == source_bundle / "inputs/ghostty":
                try:
                    require_accepted_bundle(source_bundle, CASE_IDS)
                except (OSError, ValueError, KeyError, RuntimeError) as failure:
                    raise PreflightError(f"ineligible replay baseline: {failure}") from failure
    except (PreflightError, OSError, ImportError) as error:
        print(f"preflight: {error}", file=sys.stderr)
        return 2
    run_id = str(uuid.uuid4())
    manifest_hash = None
    records = [{"id": name, "status": "unrun", "evidence": [], "error": None} for name in CASE_IDS]
    sessions = []
    status, error, unchanged = "fail", None, False
    exit_code = 1
    cleanup_safe = True
    try:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.mkdir(mode=0o700)
    except OSError as failure:
        print(f"preflight: cannot create fresh output: {failure}", file=sys.stderr)
        return 2
    try:
        (out / "inputs/bin").mkdir(parents=True)
        shutil.copyfile(binary, out / "inputs/bin/fresh")
        (out / "inputs/bin/fresh").chmod(0o500)
        if sha256(out / "inputs/bin/fresh") != protected["binary"]:
            raise PreflightError("binary changed while copying")
        copy_files(profile, out / "inputs/fresh", protected["profile"])
        copy_files(ghostty, out / "inputs/ghostty", protected["ghostty"])
        copy_files(checker, out / "checker", protected["checker"])
        if package is not None:
            copy_files(package, out / "inputs/package", metadata)
        else:
            (out / "inputs/package").mkdir()
        if protected_fingerprint(profile, ghostty, binary, checker) != protected:
            raise PreflightError("protected inputs changed during capture")
        env = isolated_env(out / "runtime/version", os.environ.get("PATH", os.defpath))
        version = subprocess.run([str(out / "inputs/bin/fresh"), "--version"], cwd=env["HOME"], env=env,
                                 check=True, capture_output=True, text=True, timeout=15).stdout.strip()
        if not version.startswith("fresh "):
            raise PreflightError(f"unexpected copied binary version: {version!r}")
        manifest = {"schema": 1, "run_id": run_id, "upstream_ref": args.upstream_ref,
                    "binary": {"version": version, "sha256": protected["binary"]}, "local_patches": [],
                    "profile_files": protected["profile"], "ghostty_files": protected["ghostty"],
                    "checker_files": protected["checker"], "package_files": metadata,
                    "tools": tools, "package_versions": versions, "package_provenance": provenance}
        dump(out / "manifest.json", manifest)
        (out / "manifest.json").chmod(0o444)
        manifest_hash = sha256(out / "manifest.json")
        dump(out / "evidence/protected-before.json", protected)
        freeze(out / "inputs")
        freeze(out / "checker")
        verify_frozen(out, manifest, manifest_hash)

        def check_boundary():
            verify_frozen(out, manifest, manifest_hash)
            if protected_fingerprint(profile, ghostty, binary, checker) != protected:
                raise RuntimeError("protected source paths changed")

        def make_session(case_id):
            if case_id not in CASE_IDS or any(s.case_id == case_id for s in sessions):
                raise RuntimeError(f"duplicate/unknown session: {case_id}")
            return FreshSession(out, case_id, tools, os.environ.get("PATH", os.defpath), run_id, prepare,
                                register=sessions.append)

        records = run_all(make_session, selected_cases, check_boundary)
        aggregate_status = aggregate(out, run_id, records, CASE_IDS, scope, selected_cases)
        verify_frozen(out, manifest, manifest_hash)
        unchanged = protected_fingerprint(profile, ghostty, binary, checker) == protected
        if not unchanged:
            raise RuntimeError("protected source paths changed")
        status, exit_code = aggregate_status, 0
    except (Exception, KeyboardInterrupt) as failure:
        error = f"{type(failure).__name__}: {failure}"
        exit_code = 2 if isinstance(failure, PreflightError) else 1
        print(error, file=sys.stderr, flush=True)
    finally:
        for session in sessions:
            try:
                session.close()
            except Exception as failure:
                cleanup_safe = False
                status, exit_code, error = "fail", 1, f"shutdown: {failure}"
        try:
            unchanged = protected_fingerprint(profile, ghostty, binary, checker) == protected
            if not unchanged:
                status, exit_code, error = "fail", 1, "protected source paths changed"
            if manifest_hash is not None:
                verify_frozen(out, manifest, manifest_hash)
        except Exception as failure:
            status, exit_code, error = "fail", 1, f"final preservation: {failure}"
        if status == "fail":
            failed_ids = {record["id"] for record in records if record["status"] != "pass"}
            for session in sessions:
                if session.case_id not in failed_ids:
                    continue
                for name in ("fresh.log", "pty.log"):
                    src = session.root / name
                    if src.is_file():
                        # Keep a bounded failure tail, not every repeated PTY redraw.
                        with src.open("rb") as stream:
                            stream.seek(max(0, src.stat().st_size - 131072))
                            (session.trace / (name + ".tail")).write_bytes(stream.read(131072))
        # Runtime homes, Git fixtures, PTYs, plugin observers, and caches are never rollback assets.
        if cleanup_safe and (out / "runtime").exists():
            shutil.rmtree(out / "runtime")
        dump(out / "result.json", {"run_id": run_id, "manifest_sha256": manifest_hash,
             "scope": scope, "selected_cases": selected_cases,
             "status": status, "protected_unchanged": unchanged, "cases": records, "error": error})
        freeze(out / "evidence") if (out / "evidence").exists() else None
        (out / "result.json").chmod(0o444)
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
