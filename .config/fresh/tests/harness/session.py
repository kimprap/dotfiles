"""One isolated Fresh session under a PTY: environment, probe, screen, teardown."""
from __future__ import annotations

import codecs
import fcntl
import json
import os
import re
import resource
import select
import shutil
import signal
import socket
import stat
import struct
import subprocess
import tempfile
import termios
import time
from pathlib import Path

from . import keys as keymod
from .catalog import NON_RUNTIME
from .isolation import IGNORED_NAMES

COLS, ROWS = 120, 40
PROBE_TEMPLATE = Path(__file__).with_name("probe.ts")
PROBE_FILE = "zz-test-probe.ts"
LOG_GUARD = re.compile(r"Unhandled Promise rejection|os error 24|ERROR.*Plugin:")
DEFAULT_WAIT = 5.0
# Terminal queries Fresh sends at startup, with the replies a terminal would give.
_QUERIES = {b"\x1b[c": b"\x1b[?1;2c", b"\x1b[0c": b"\x1b[?1;2c", b"\x1b[>c": b"\x1b[>0;95;0c",
            b"\x1b[>0c": b"\x1b[>0;95;0c", b"\x1b[?u": b"\x1b[?1u", b"\x1b[6n": b"\x1b[1;1R"}
_QUERY_RE = re.compile(rb"\x1b\[(?:0?c|>0?c|\?u|6n)")
# DECSCUSR (`CSI <n> SP q`): pyte drops it, so pump records the last parameter itself.
_DECSCUSR_RE = re.compile(rb"\x1b\[(\d*) q")
# The case env starts empty apart from these, so FRESH_*, GIT_* and DYLD_* never leak in.
_KEPT = ("USER", "LOGNAME", "LANG", "LC_ALL", "LC_CTYPE")


class Unrun(Exception):
    """Raise from a case when its behavior cannot be observed here; the row reports UNRUN."""


class ProbeError(RuntimeError):
    """A probe timeout, PTY EOF or unparsable response (spec §4.2)."""


def _color(value: str) -> str:
    return "#" + value.upper() if re.fullmatch(r"[0-9a-fA-F]{6}", value or "") else value


class Cell:
    __slots__ = ("char", "fg", "bg", "bold", "reverse")

    def __init__(self, char, fg, bg, bold, reverse):
        self.char, self.fg, self.bg, self.bold, self.reverse = char, fg, bg, bold, reverse

    def __repr__(self):
        return f"Cell({self.char!r}, fg={self.fg}, bg={self.bg})"


class Screen:
    """Immutable copy of the pyte grid. Colors are `#RRGGBB`, a pyte name, or `default`."""

    def __init__(self, pyte_screen):
        self.lines: list[str] = list(pyte_screen.display)
        self.cursor = (pyte_screen.cursor.x, pyte_screen.cursor.y)
        self._cells = [[pyte_screen.buffer[y][x] for x in range(pyte_screen.columns)]
                       for y in range(pyte_screen.lines)]

    @property
    def text(self) -> str:
        return "\n".join(self.lines)

    def cell(self, x: int, y: int) -> Cell:
        raw = self._cells[y][x]
        return Cell(raw.data, _color(raw.fg), _color(raw.bg), raw.bold, raw.reverse)

    def find(self, needle: str) -> tuple[int, int] | None:
        """(x, y) of the first occurrence of needle, scanning rows top to bottom."""
        for y, line in enumerate(self.lines):
            x = line.find(needle)
            if x >= 0:
                return x, y
        return None

    def find_all(self, needle: str) -> list[tuple[int, int]]:
        return [(m.start(), y) for y, line in enumerate(self.lines)
                for m in re.finditer(re.escape(needle), line)]

    def __contains__(self, needle: str) -> bool:
        return self.find(needle) is not None


def _process_table() -> dict[int, tuple[int, int, str]]:
    out = subprocess.run(["/bin/ps", "-axo", "pid=,ppid=,pgid=,lstart="], capture_output=True,
                         text=True, timeout=10).stdout
    table = {}
    for line in out.splitlines():
        fields = line.split(None, 3)
        if len(fields) == 4:
            table[int(fields[0])] = (int(fields[1]), int(fields[2]), fields[3].strip())
    return table


def _accepts(path: Path) -> bool:
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as client:
        client.settimeout(0.5)
        try:
            client.connect(str(path))
        except OSError:
            return False
        return True


class Session:
    """See the harness package docstring for the case-facing API."""

    def __init__(self, case_id: str, binary: Path, profile: Path, fixtures: Path,
                 tools: dict[str, str], keep: bool = False, signatures: tuple[str, ...] = ()):
        self.case_id = case_id
        # Catalogued upstream log-guard signatures (FEATURES.md `### Log-guard signatures`).
        self.signatures = tuple(signatures)
        self.binary = Path(binary).absolute()
        self.fixtures = Path(fixtures)
        self.tools = dict(tools)
        self.keep = keep
        # A short root: Fresh's control socket path must fit sockaddr_un (104 bytes on macOS).
        self.root = Path(tempfile.mkdtemp(prefix="frt.", dir="/tmp")).resolve()
        dirs = {"HOME": "home", "XDG_CONFIG_HOME": "home/.config", "XDG_DATA_HOME": "data",
                "XDG_STATE_HOME": "state", "XDG_CACHE_HOME": "cache", "XDG_RUNTIME_DIR": "run",
                "TMPDIR": "tmp"}
        env = {k: os.environ[k] for k in _KEPT if k in os.environ}
        for key, rel in dirs.items():
            path = self.root / rel
            path.mkdir(parents=True, exist_ok=True, mode=0o700)
            env[key] = str(path)
        path_dirs = [str(Path(p).parent) for p in self.tools.values()]
        path_dirs += ["/usr/bin", "/bin", "/usr/sbin", "/sbin"]
        env.update(PATH=":".join(dict.fromkeys(path_dirs)), SHELL="/bin/sh", TERM="xterm-256color",
                   COLORTERM="truecolor", GIT_CONFIG_GLOBAL="/dev/null", GIT_CONFIG_NOSYSTEM="1",
                   HISTFILE=str(self.root / "home/.sh_history"), ENV=str(self.root / "home/.shrc"))
        env.setdefault("LANG", "en_US.UTF-8")
        self.env = env
        self.home = self.root / "home"
        self.config_dir = self.home / ".config" / "fresh"
        self.work = self.root / "work"
        self.work.mkdir(mode=0o700)
        self._copy_profile(Path(profile))
        # Repo plugin file names: a catalogued signature on a line naming one is not upstream (R6).
        self._repo_plugins = {p.name for p in self.config_dir.rglob("*.ts")
                              if "types" not in p.relative_to(self.config_dir).parts}
        self.pid: int | None = None
        self.fd: int | None = None
        self.exit_status: int | None = None
        self._launches = 0
        self._logs: list[Path] = []
        self._owned: dict[int, str] = {}
        self._last_track = 0.0
        self._seq = 0
        self._probe_dir: Path | None = None
        self._screen = None
        self._stream = None
        self._decoder = None
        self._query_tail = b""
        self._decscusr: int | None = None
        self._decscusr_tail = b""
        self._trust_answered = False
        self.last_state: dict | None = None
        self.log_hits: list[str] = []
        self.log_notes: list[str] = []  # catalogued upstream signatures seen, first-seen order
        self.final_log = ""
        self.git("init", "-q", "-b", "main")
        self.git("config", "user.name", "Fresh Test")
        self.git("config", "user.email", "fresh-test@example.invalid")
        self.git("config", "commit.gpgsign", "false")

    # ---- setup -----------------------------------------------------------------
    def _copy_profile(self, profile: Path) -> None:
        def ignore(directory, names):
            top = Path(directory).resolve() == profile.resolve()
            return {n for n in names if n in IGNORED_NAMES or (top and n in NON_RUNTIME)}
        shutil.copytree(profile, self.config_dir, ignore=ignore, symlinks=False)
        for path in [self.config_dir, *self.config_dir.rglob("*")]:
            path.chmod(path.stat().st_mode | stat.S_IWUSR)

    def path(self, rel: str | Path) -> Path:
        """Absolute path of a workspace-relative path (absolute paths pass through)."""
        rel = Path(rel)
        return rel if rel.is_absolute() else self.work / rel

    def write(self, rel: str | Path, content: str | bytes) -> Path:
        target = self.path(rel)
        target.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, str):
            content = content.encode()
        target.write_bytes(content)
        return target

    def fixture(self, name: str | None = None) -> Path:
        """Copy tests/fixtures/<name or case id>/ into the workspace root."""
        source = self.fixtures / (name or self.case_id)
        shutil.copytree(source, self.work, dirs_exist_ok=True)
        return self.work

    def git(self, *args: str) -> str:
        git = self.tools.get("git") or "git"
        result = subprocess.run([git, *args], cwd=self.work, env=self.env, capture_output=True,
                                text=True, timeout=30)
        if result.returncode:
            raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
        return result.stdout

    def commit(self, message: str = "fixture") -> None:
        self.git("add", "-A")
        self.git("commit", "-q", "--allow-empty", "-m", message)

    def read_bytes(self, rel: str | Path) -> bytes:
        return self.path(rel).read_bytes()

    # ---- process ---------------------------------------------------------------
    def launch(self, *files: str | Path, nofile: int | None = None, args: tuple[str, ...] = (),
               cwd: str | Path | None = None, ready_timeout: float = 30.0) -> dict:
        """Start Fresh on `files` (default: the workspace dir) and wait for the probe."""
        import pyte
        if self.pid is not None:
            raise RuntimeError("Fresh is already running in this session")
        self._launches += 1
        self._seq = 0
        self._probe_dir = self.root / f"probe{self._launches}"
        self._probe_dir.mkdir(mode=0o700)
        template = PROBE_TEMPLATE.read_text()
        (self.config_dir / "plugins").mkdir(exist_ok=True)
        (self.config_dir / "plugins" / PROBE_FILE).write_text(
            template.replace("__PROBE_DIR__", json.dumps(str(self._probe_dir)), 1))
        log = self.root / f"fresh-{self._launches}.log"
        self._logs.append(log)
        targets = [str(self.path(f)) for f in files] or [str(self.work)]
        argv = [str(self.binary), "--no-upgrade-check", "--log-file", str(log), *args, *targets]
        self._screen = pyte.Screen(COLS, ROWS)
        self._stream = pyte.Stream(self._screen)
        self._decoder = codecs.getincrementaldecoder("utf-8")("replace")
        self._query_tail = b""
        self._decscusr, self._decscusr_tail = None, b""
        self._trust_answered = False
        master, slave = os.openpty()
        fcntl.ioctl(slave, termios.TIOCSWINSZ, struct.pack("HHHH", ROWS, COLS, 0, 0))
        workdir = str(self.path(cwd)) if cwd else str(self.work)
        pid = os.fork()
        if pid == 0:  # child
            try:
                os.setsid()
                fcntl.ioctl(slave, termios.TIOCSCTTY, 0)
                for fd in (0, 1, 2):
                    os.dup2(slave, fd)
                os.closerange(3, 65536)
                os.chdir(workdir)
                if nofile:
                    _soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
                    resource.setrlimit(resource.RLIMIT_NOFILE, (nofile, hard))
                os.execve(argv[0], argv, self.env)
            finally:
                os._exit(127)
        os.close(slave)
        os.set_blocking(master, False)
        self.pid, self.fd, self.exit_status = pid, master, None
        self._owned = {}
        self._track(force=True)
        return self.request("snapshot", timeout=ready_timeout)

    def alive(self) -> bool:
        if self.pid is None:
            return False
        if self.exit_status is None:
            done, status = os.waitpid(self.pid, os.WNOHANG)
            if done:
                self.exit_status = status
        return self.exit_status is None

    def _track(self, force: bool = False) -> None:
        """Record the Fresh process and its descendants (pid -> start time)."""
        now = time.monotonic()
        if self.pid is None or (not force and now - self._last_track < 0.5):
            return
        self._last_track = now
        table = _process_table()
        if self.pid in table and self.pid not in self._owned:
            self._owned[self.pid] = table[self.pid][2]
        changed = True
        while changed:
            changed = False
            for pid, (parent, _group, started) in table.items():
                if pid not in self._owned and parent in self._owned and table[parent][2] == self._owned[parent]:
                    self._owned[pid] = started
                    changed = True

    def _live_owned(self) -> list[int]:
        """Owned pids still in the process table with their recorded start time (reaps Fresh first)."""
        self.alive()
        table = _process_table()
        return [pid for pid, started in self._owned.items() if pid in table and table[pid][2] == started]

    def pump(self, timeout: float = 0.02) -> None:
        """Feed pending PTY output to the screen and answer terminal queries."""
        if self.fd is None:
            time.sleep(timeout)
            return
        deadline = time.monotonic() + timeout
        while True:
            remaining = max(0.0, deadline - time.monotonic())
            ready, _, _ = select.select([self.fd], [], [], remaining)
            if not ready:
                break
            try:
                chunk = os.read(self.fd, 65536)
            except BlockingIOError:
                continue
            except OSError:
                chunk = b""
            if not chunk:
                self._close_fd()
                break
            self._stream.feed(self._decoder.decode(chunk))
            styled = self._decscusr_tail + chunk
            for match in _DECSCUSR_RE.finditer(styled):
                self._decscusr = int(match.group(1) or 0)
            self._decscusr_tail = styled[-8:]
            pending = self._query_tail + chunk
            for match in _QUERY_RE.finditer(pending):
                try:
                    self._send(_QUERIES[match.group()])
                except OSError:
                    pass
            self._query_tail = b""
            for size in range(1, min(len(pending), 4) + 1):
                suffix = pending[-size:]
                if any(q.startswith(suffix) and q != suffix for q in _QUERIES):
                    self._query_tail = suffix
            if time.monotonic() >= deadline:
                break
        if not self._trust_answered and "keep restricted" in "\n".join(self._screen.display).lower():
            # A new HOME shows the workspace-trust dialog with Restricted selected; accept it.
            self._trust_answered = True
            try:
                self._send(b"\r")
            except OSError:
                pass
        self._track()

    def _close_fd(self) -> None:
        if self.fd is not None:
            os.close(self.fd)
            self.fd = None

    def _send(self, data: bytes) -> None:
        if self.fd is None:
            raise ProbeError("PTY closed: Fresh exited")
        view = memoryview(data)
        while view:
            try:
                written = os.write(self.fd, view)
            except BlockingIOError:
                select.select([], [self.fd], [], 0.5)
                continue
            view = view[written:]

    # ---- input -----------------------------------------------------------------
    def keys(self, *strokes, delay: float = 0.05) -> None:
        """Send keystrokes: specs like `super+shift+t`, raw bytes, or lists of either (chords)."""
        for stroke in strokes:
            if isinstance(stroke, (list, tuple)):
                self.keys(*stroke, delay=delay)
                continue
            self._send(stroke if isinstance(stroke, bytes) else keymod.encode(stroke))
            self.pump(delay)

    def type(self, text: str, delay: float = 0.05) -> None:
        """Type text as plain key input (newline sends Enter)."""
        self._send(text.replace("\n", "\r").encode())
        self.pump(delay)

    def paste(self, text: str, delay: float = 0.05) -> None:
        self._send(keymod.paste(text))
        self.pump(delay)

    def mouse(self, kind: str, col: int, row: int, button: str = "left", mods: tuple[str, ...] = (),
              delay: float = 0.05) -> None:
        """SGR mouse event at 0-based screen cell (col, row); kind is click|release|drag."""
        self._send(keymod.mouse(kind, col, row, button, mods))
        self.pump(delay)

    def click(self, col: int, row: int, button: str = "left") -> None:
        self.mouse("click", col, row, button)
        self.mouse("release", col, row, button)

    def sleep(self, seconds: float) -> None:
        """Fixed pause; only for key-release timing. Keeps the screen fed."""
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            self.pump(min(0.05, max(0.0, deadline - time.monotonic())))

    # ---- probe -----------------------------------------------------------------
    def request(self, op: str, timeout: float = 10.0, **args) -> dict:
        """Send one probe request; return its reply `{ok, result, error, state}`."""
        if self._probe_dir is None:
            raise RuntimeError("launch() first")
        self._seq += 1
        seq = self._seq
        temp = self._probe_dir / f".req-{seq}.tmp"
        temp.write_text(json.dumps({"op": op, "args": args}))
        os.replace(temp, self._probe_dir / f"req-{seq}.json")
        done = self._probe_dir / f"resp-{seq}.done"
        deadline = time.monotonic() + timeout
        while not done.exists():
            if time.monotonic() > deadline:
                raise ProbeError(f"probe timeout after {timeout:g}s waiting for {op} #{seq}")
            if self.fd is None and not self.alive():
                raise ProbeError(f"PTY EOF: Fresh exited before answering {op} #{seq}")
            self.pump(0.03)
        raw = (self._probe_dir / f"resp-{seq}.json").read_text()
        try:
            reply = json.loads(raw)
        except json.JSONDecodeError as error:
            raise ProbeError(f"unparsable probe response #{seq}: {error}") from error
        if not reply.get("ok"):
            raise ProbeError(f"probe {op} failed: {reply.get('error')}")
        if reply.get("state") is not None:
            self.last_state = reply["state"]
        return reply

    def state(self) -> dict:
        """Probe snapshot: buffer, text, primary, cursors, selected, mode, search, viewport, panes, splits, buffers."""
        return self.request("snapshot")["state"]

    def open(self, path: str | Path, line: int | None = None, column: int | None = None) -> dict:
        """Setup helper: open a file through the plugin API (not a user gesture)."""
        return self.request("open", path=str(self.path(path)), line=line, column=column)["state"]

    def set_cursor(self, position: int) -> dict:
        return self.request("cursor", position=position)["state"]

    def action(self, name: str) -> bool:
        """Setup helper: run a native action by name; returns executeAction's result."""
        return bool(self.request("action", name=name)["result"])

    # ---- observation -----------------------------------------------------------
    def screen(self) -> Screen:
        self.pump()
        return Screen(self._screen)

    def cell(self, x: int, y: int) -> Cell:
        return self.screen().cell(x, y)

    def wait(self, predicate, timeout: float = DEFAULT_WAIT, what: str = "condition"):
        """Bounded poll: return predicate()'s first truthy value, else fail with `what`."""
        deadline = time.monotonic() + timeout
        while True:
            value = predicate()
            if value:
                return value
            if time.monotonic() > deadline:
                raise AssertionError(f"timed out after {timeout:g}s waiting for {what}")
            self.pump(0.05)

    def wait_screen(self, predicate, timeout: float = DEFAULT_WAIT, what: str = "screen condition") -> Screen:
        def probe():
            screen = self.screen()
            return screen if predicate(screen) else None
        return self.wait(probe, timeout, what)

    def wait_text(self, needle: str, timeout: float = DEFAULT_WAIT) -> tuple[int, int]:
        return self.wait(lambda: self.screen().find(needle), timeout, f"{needle!r} on screen")

    def wait_state(self, predicate, timeout: float = DEFAULT_WAIT, what: str = "probe state") -> dict:
        def probe():
            state = self.state()
            return state if predicate(state) else None
        return self.wait(probe, timeout, what)

    def check(self, condition, message: str) -> None:
        """Assert; the message becomes the FAIL reason when this is the first failure."""
        if not condition:
            raise AssertionError(message)

    def log_text(self) -> str:
        return "".join(p.read_text(errors="replace") for p in self._logs if p.exists())

    def cursor_style(self) -> int | None:
        """Parameter of the last DECSCUSR Fresh sent this launch (5 = blinking bar); None if none."""
        self.pump()
        return self._decscusr

    def upstream_signature(self, line: str) -> str | None:
        """The catalogued upstream signature `line` carries, unless it also names a repo plugin file
        (spec R6: then it is not classified and stays a guard hit)."""
        found = next((sig for sig in self.signatures if sig in line), None)
        if found is None or any(name in line for name in self._repo_plugins):
            return None
        return found

    def _classify(self, text: str) -> tuple[list[str], list[str]]:
        """(guard hits, catalogued signatures seen) for log text."""
        hits, notes = [], []
        for line in text.splitlines():
            if not LOG_GUARD.search(line):
                continue
            signature = self.upstream_signature(line)
            if signature is None:
                if any(sig in line for sig in self.signatures):
                    line = "catalogued signature from a repo plugin file: " + line
                hits.append(line)
            elif signature not in notes:
                notes.append(signature)
        return hits, notes

    def log_problems(self) -> list[str]:
        """Log lines matching the guard (unhandled rejection, EMFILE, plugin ERROR), excluding
        rejections that carry a catalogued upstream signature."""
        return self._classify(self.log_text())[0]

    # ---- teardown ----------------------------------------------------------------
    def stop(self, force: bool = True, timeout: float = 5.0) -> list[str]:
        """Quit Fresh (via the probe, then signals); return teardown problems."""
        problems: list[str] = []
        if self.pid is None:
            return problems
        self._track(force=True)
        if self.alive() and self.fd is not None:
            try:
                self.request("quit", timeout=3.0, force=force)
            except (ProbeError, OSError):
                pass
            deadline = time.monotonic() + timeout
            while self.alive() and time.monotonic() < deadline:
                self.pump(0.05)
        if self.alive():
            problems.append("Fresh did not exit after quit; signalled")
            self._track(force=True)
        for sig in (signal.SIGTERM, signal.SIGKILL):
            live = self._live_owned()
            if not live:
                break
            if self.alive():  # unreaped, so the group id cannot have been reused
                try:
                    os.killpg(self.pid, sig)  # setsid made Fresh a group leader; reaches its helpers
                except OSError:
                    pass  # owned pids are signalled individually below
            for pid in live:
                try:
                    os.kill(pid, sig)
                except ProcessLookupError:
                    pass
            end = time.monotonic() + 2
            while self._live_owned() and time.monotonic() < end:
                self.pump(0.05)  # keep draining: an exiting process blocks until its tty output drains
        end = time.monotonic() + 10
        while self.alive() and time.monotonic() < end:
            self.pump(0.05)
        if self.alive():
            problems.append(f"Fresh pid {self.pid} survived SIGKILL")
        self._close_fd()
        leaked = self._live_owned()
        if leaked:
            problems.append(f"processes survived teardown: {leaked}")
        self.pid = None
        return problems

    def close(self) -> list[str]:
        """Full teardown: stop, `--cmd daemon kill --all` in the case env, leftover checks."""
        problems = self.stop()
        try:
            subprocess.run([str(self.binary), "--cmd", "daemon", "kill", "--all"], cwd=self.work,
                           env=self.env, capture_output=True, timeout=15, stdin=subprocess.DEVNULL)
        except (subprocess.TimeoutExpired, OSError) as error:
            problems.append(f"daemon kill failed: {error}")
        runtime = Path(self.env["XDG_RUNTIME_DIR"])
        # Fresh 0.5.1 leaves its socket files behind after a clean exit; only a socket that
        # still accepts connections means a listener survived.
        listening = [p for p in runtime.rglob("*") if p.is_socket() and _accepts(p)]
        if listening:
            problems.append("live sockets left in case runtime dir: " + ", ".join(p.name for p in listening))
        self.final_log = self.log_text()
        self.log_hits, self.log_notes = self._classify(self.final_log)
        if not self.keep:
            shutil.rmtree(self.root, ignore_errors=True)
        return problems
