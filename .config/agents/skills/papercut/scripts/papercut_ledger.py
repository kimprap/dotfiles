#!/usr/bin/env python3
"""Store repository-owned papercut evidence behind one small safe CLI."""

from __future__ import annotations

import argparse
import contextlib
import datetime as dt
import errno
import fcntl
import hashlib
import json
import os
import re
import secrets
import stat
import sys
import tempfile
import unicodedata
from pathlib import Path
from typing import Any, Iterator

CLI_SCHEMA = "papercut-ledger-cli/v2"
LEDGER_RELATIVE = Path(".agents/papercuts.json")
AGENTS_NAME = LEDGER_RELATIVE.parent.name
LEDGER_NAME = LEDGER_RELATIVE.name
LOCK_DIRECTORY = "papercut-ledger-locks-v2"
RECORD_ID = re.compile(r"^pc-[0-9a-f]{16}$")
ERROR_CODES = {
    "not_initialized",
    "invalid_input",
    "schema_invalid",
    "unsafe_path",
    "migration_required",
    "id_collision",
    "record_missing",
    "lock_unavailable",
    "io_failed",
}
EMPTY_LEDGER = {"records": {}, "version": 2}
EMPTY_V1_LEDGER = {
    "capture_mode": "automatic",
    "records": {},
    "schema_version": 1,
}


class PapercutError(Exception):
    """A stable, non-sensitive CLI failure."""

    def __init__(self, code: str) -> None:
        if code not in ERROR_CODES:
            raise ValueError(f"unknown papercut error code: {code}")
        super().__init__(code)
        self.code = code


class StrictArgumentParser(argparse.ArgumentParser):
    """Map argparse failures into the stable CLI error vocabulary."""

    def error(self, message: str) -> None:
        del message
        raise PapercutError("invalid_input")


def _fail(code: str) -> None:
    raise PapercutError(code)


def _canonical_bytes(value: dict[str, Any]) -> bytes:
    text = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True)
    return f"{text}\n".encode()


def _sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _record_id(surface: str, summary: str) -> str:
    identity = surface.encode() + b"\0" + summary.encode()
    return f"pc-{_sha256(identity)[:16]}"


def _exact_object(value: Any, keys: set[str], *, code: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != keys:
        _fail(code)
    return value


def _string(value: Any, *, code: str) -> str:
    if (
        not isinstance(value, str)
        or not 1 <= len(value) <= 500
        or not value.strip()
        or any(unicodedata.category(character) in {"Cc", "Cs"} for character in value)
    ):
        _fail(code)
    return value


def _nullable_string(value: Any, *, code: str) -> str | None:
    if value is None:
        return None
    return _string(value, code=code)


def _date(value: Any, *, code: str) -> str:
    if not isinstance(value, str) or len(value) != 10:
        _fail(code)
    try:
        parsed = dt.date.fromisoformat(value)
    except ValueError:
        _fail(code)
    if parsed.isoformat() != value:
        _fail(code)
    return value


def _observation(value: Any, *, code: str) -> dict[str, Any]:
    item = _exact_object(value, {"date", "friction", "workaround"}, code=code)
    _date(item["date"], code=code)
    _string(item["friction"], code=code)
    _nullable_string(item["workaround"], code=code)
    return item


def _resolution(value: Any, *, code: str) -> dict[str, Any] | None:
    if value is None:
        return None
    item = _exact_object(
        value,
        {"kind", "resolved_on", "reference", "summary"},
        code=code,
    )
    if item["kind"] not in {"fixed", "rejected", "superseded"}:
        _fail(code)
    _date(item["resolved_on"], code=code)
    _string(item["reference"], code=code)
    _string(item["summary"], code=code)
    return item


def _record(record_id: str, value: Any) -> dict[str, Any]:
    if not isinstance(record_id, str) or not RECORD_ID.fullmatch(record_id):
        _fail("schema_invalid")
    item = _exact_object(
        value,
        {
            "first_seen",
            "last_seen",
            "observations",
            "occurrence_count",
            "resolution",
            "summary",
            "surface",
        },
        code="schema_invalid",
    )
    surface = _string(item["surface"], code="schema_invalid")
    summary = _string(item["summary"], code="schema_invalid")
    if _record_id(surface, summary) != record_id:
        _fail("schema_invalid")
    first_seen = _date(item["first_seen"], code="schema_invalid")
    last_seen = _date(item["last_seen"], code="schema_invalid")
    if first_seen > last_seen:
        _fail("schema_invalid")
    count = item["occurrence_count"]
    if type(count) is not int or count < 1:
        _fail("schema_invalid")
    observations = item["observations"]
    if not isinstance(observations, list):
        _fail("schema_invalid")
    validated = [
        _observation(observation, code="schema_invalid") for observation in observations
    ]
    serialized = {
        json.dumps(value, ensure_ascii=False, sort_keys=True) for value in validated
    }
    if len(serialized) != len(validated):
        _fail("schema_invalid")
    resolution = _resolution(item["resolution"], code="schema_invalid")
    if not validated and resolution is None:
        _fail("schema_invalid")
    if validated:
        dates = [observation["date"] for observation in validated]
        if min(dates) < first_seen or max(dates) != last_seen:
            _fail("schema_invalid")
        if resolution is None and (first_seen != min(dates) or count != len(validated)):
            _fail("schema_invalid")
    if (
        not validated
        and resolution is not None
        and resolution["resolved_on"] < last_seen
    ):
        _fail("schema_invalid")
    if (
        validated
        and resolution is not None
        and min(observation["date"] for observation in validated)
        < resolution["resolved_on"]
    ):
        _fail("schema_invalid")
    if count < len(validated):
        _fail("schema_invalid")
    return item


def _validate_v2(value: Any) -> dict[str, Any]:
    ledger = _exact_object(value, {"records", "version"}, code="schema_invalid")
    if type(ledger["version"]) is not int or ledger["version"] != 2:
        _fail("schema_invalid")
    records = ledger["records"]
    if not isinstance(records, dict):
        _fail("schema_invalid")
    for record_id, record in records.items():
        _record(record_id, record)
    return ledger


def _validate_record_input(value: Any) -> dict[str, Any]:
    item = _exact_object(
        value,
        {"surface", "summary", "observed_on", "observation"},
        code="invalid_input",
    )
    surface = _string(item["surface"], code="invalid_input")
    summary = _string(item["summary"], code="invalid_input")
    observed_on = _date(item["observed_on"], code="invalid_input")
    supplied = _exact_object(
        item["observation"],
        {"friction", "workaround"},
        code="invalid_input",
    )
    observation = {
        "date": observed_on,
        "friction": _string(supplied["friction"], code="invalid_input"),
        "workaround": _nullable_string(supplied["workaround"], code="invalid_input"),
    }
    return {
        "surface": surface,
        "summary": summary,
        "observed_on": observed_on,
        "observation": observation,
    }


def _validate_resolve_input(value: Any) -> dict[str, Any]:
    result = _resolution(value, code="invalid_input")
    if result is None:
        _fail("invalid_input")
    return result


def _path_lstat(path: Path) -> os.stat_result | None:
    try:
        return path.lstat()
    except FileNotFoundError:
        return None
    except OSError as error:
        raise PapercutError("io_failed") from error


def _stat_identity(value: os.stat_result) -> tuple[int, int, int, int]:
    return (
        value.st_dev,
        value.st_ino,
        value.st_size,
        value.st_mtime_ns,
    )


def _inode_identity(value: os.stat_result) -> tuple[int, int]:
    return (value.st_dev, value.st_ino)


def _repository_root(raw_repo: str) -> tuple[Path, os.stat_result]:
    supplied = Path(os.path.abspath(Path(raw_repo).expanduser()))
    supplied_stat = _path_lstat(supplied)
    if (
        supplied_stat is None
        or stat.S_ISLNK(supplied_stat.st_mode)
        or not stat.S_ISDIR(supplied_stat.st_mode)
    ):
        _fail("unsafe_path")
    try:
        root = supplied.resolve(strict=True)
    except OSError as error:
        raise PapercutError("unsafe_path") from error
    root_stat = _path_lstat(root)
    if (
        root_stat is None
        or stat.S_ISLNK(root_stat.st_mode)
        or not stat.S_ISDIR(root_stat.st_mode)
        or _inode_identity(root_stat) != _inode_identity(supplied_stat)
    ):
        _fail("unsafe_path")
    return root, root_stat


def _safe_file_bytes(path: Path, *, missing_code: str) -> bytes:
    file_stat = _path_lstat(path)
    if file_stat is None:
        _fail(missing_code)
    if stat.S_ISLNK(file_stat.st_mode) or not stat.S_ISREG(file_stat.st_mode):
        _fail("unsafe_path")
    flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0)
    try:
        descriptor = os.open(path, flags)
    except FileNotFoundError:
        _fail(missing_code)
    except OSError as error:
        if error.errno == errno.ELOOP:
            _fail("unsafe_path")
        raise PapercutError("io_failed") from error
    try:
        before = os.fstat(descriptor)
        with os.fdopen(descriptor, "rb", closefd=False) as handle:
            content = handle.read()
        after = os.fstat(descriptor)
    except OSError as error:
        raise PapercutError("io_failed") from error
    finally:
        os.close(descriptor)
    if _stat_identity(before) != _stat_identity(after):
        _fail("io_failed")
    return content


def _read_json_input(path: str) -> dict[str, Any]:
    raw = _safe_file_bytes(Path(path).expanduser(), missing_code="invalid_input")
    try:
        value = json.loads(raw.decode())
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise PapercutError("invalid_input") from error
    if not isinstance(value, dict):
        _fail("invalid_input")
    return value


def _parse_json(raw: bytes, *, code: str) -> Any:
    try:
        return json.loads(raw.decode())
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise PapercutError(code) from error


def _read_ledger(directory: int) -> tuple[dict[str, Any], bytes]:
    raw = _read_relative_file(directory, LEDGER_NAME)
    if raw is None:
        _fail("not_initialized")
    ledger = _validate_v2(_parse_json(raw, code="schema_invalid"))
    if raw != _canonical_bytes(ledger):
        _fail("schema_invalid")
    return ledger, raw


def _lock_path(ledger: Path) -> Path:
    key = _sha256(str(ledger).encode())
    return Path(tempfile.gettempdir()) / LOCK_DIRECTORY / f"{key}.lock"


@contextlib.contextmanager
def _locked(ledger: Path) -> Iterator[None]:
    lock_path = _lock_path(ledger)
    lock_directory = lock_path.parent
    try:
        lock_directory.mkdir(mode=0o700, exist_ok=True)
        directory_stat = lock_directory.lstat()
        if stat.S_ISLNK(directory_stat.st_mode) or not stat.S_ISDIR(
            directory_stat.st_mode
        ):
            _fail("unsafe_path")
        descriptor = os.open(lock_path, os.O_RDWR | os.O_CREAT, 0o600)
    except PapercutError:
        raise
    except OSError as error:
        raise PapercutError("io_failed") from error
    try:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise PapercutError("lock_unavailable") from error
        except OSError as error:
            raise PapercutError("io_failed") from error
        yield
    finally:
        with contextlib.suppress(OSError):
            fcntl.flock(descriptor, fcntl.LOCK_UN)
        os.close(descriptor)


def _fsync_directory(directory: int) -> None:
    os.fsync(directory)


def _assert_repository_path(root: Path, descriptor: int) -> None:
    root_stat = _path_lstat(root)
    try:
        held_stat = os.fstat(descriptor)
    except OSError as error:
        raise PapercutError("io_failed") from error
    if (
        root_stat is None
        or stat.S_ISLNK(root_stat.st_mode)
        or not stat.S_ISDIR(root_stat.st_mode)
        or not stat.S_ISDIR(held_stat.st_mode)
        or _inode_identity(root_stat) != _inode_identity(held_stat)
    ):
        _fail("unsafe_path")


@contextlib.contextmanager
def _held_repository(raw_repo: str) -> Iterator[tuple[Path, int]]:
    root, expected_stat = _repository_root(raw_repo)
    flags = (
        os.O_RDONLY
        | getattr(os, "O_DIRECTORY", 0)
        | getattr(os, "O_NOFOLLOW", 0)
        | getattr(os, "O_CLOEXEC", 0)
    )
    try:
        descriptor = os.open(root, flags)
    except FileNotFoundError as error:
        raise PapercutError("unsafe_path") from error
    except OSError as error:
        if error.errno in {errno.ELOOP, errno.ENOTDIR}:
            raise PapercutError("unsafe_path") from error
        raise PapercutError("io_failed") from error
    try:
        try:
            held_stat = os.fstat(descriptor)
        except OSError as error:
            raise PapercutError("io_failed") from error
        if not stat.S_ISDIR(held_stat.st_mode) or _inode_identity(
            held_stat
        ) != _inode_identity(expected_stat):
            _fail("unsafe_path")
        _assert_repository_path(root, descriptor)
        yield root, descriptor
    finally:
        with contextlib.suppress(OSError):
            os.close(descriptor)


def _relative_lstat(directory: int, name: str) -> os.stat_result | None:
    try:
        return os.stat(name, dir_fd=directory, follow_symlinks=False)
    except FileNotFoundError:
        return None
    except OSError as error:
        if error.errno in {errno.ELOOP, errno.ENOTDIR}:
            raise PapercutError("unsafe_path") from error
        raise PapercutError("io_failed") from error


def _assert_relative_directory(parent: int, name: str, descriptor: int) -> None:
    current = _relative_lstat(parent, name)
    try:
        held = os.fstat(descriptor)
    except OSError as error:
        raise PapercutError("io_failed") from error
    if (
        current is None
        or stat.S_ISLNK(current.st_mode)
        or not stat.S_ISDIR(current.st_mode)
        or not stat.S_ISDIR(held.st_mode)
        or _inode_identity(current) != _inode_identity(held)
    ):
        _fail("unsafe_path")


@contextlib.contextmanager
def _held_relative_directory(
    parent: int,
    name: str,
    *,
    missing_code: str,
) -> Iterator[int]:
    expected = _relative_lstat(parent, name)
    if expected is None:
        _fail(missing_code)
    if stat.S_ISLNK(expected.st_mode) or not stat.S_ISDIR(expected.st_mode):
        _fail("unsafe_path")
    flags = (
        os.O_RDONLY
        | getattr(os, "O_DIRECTORY", 0)
        | getattr(os, "O_NOFOLLOW", 0)
        | getattr(os, "O_CLOEXEC", 0)
    )
    try:
        descriptor = os.open(name, flags, dir_fd=parent)
    except FileNotFoundError:
        _fail(missing_code)
    except OSError as error:
        if error.errno in {errno.ELOOP, errno.ENOTDIR}:
            raise PapercutError("unsafe_path") from error
        raise PapercutError("io_failed") from error
    try:
        try:
            held = os.fstat(descriptor)
        except OSError as error:
            raise PapercutError("io_failed") from error
        if not stat.S_ISDIR(held.st_mode) or _inode_identity(held) != _inode_identity(
            expected
        ):
            _fail("unsafe_path")
        _assert_relative_directory(parent, name, descriptor)
        yield descriptor
    finally:
        with contextlib.suppress(OSError):
            os.close(descriptor)


def _read_relative_file(directory: int, name: str) -> bytes | None:
    flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0)
    try:
        descriptor = os.open(name, flags, dir_fd=directory)
    except FileNotFoundError:
        return None
    except OSError as error:
        if error.errno in {errno.ELOOP, errno.ENOTDIR}:
            raise PapercutError("unsafe_path") from error
        raise PapercutError("io_failed") from error
    try:
        before = os.fstat(descriptor)
        if not stat.S_ISREG(before.st_mode):
            _fail("unsafe_path")
        with os.fdopen(os.dup(descriptor), "rb") as handle:
            content = handle.read()
        after = os.fstat(descriptor)
    except PapercutError:
        raise
    except OSError as error:
        raise PapercutError("io_failed") from error
    finally:
        with contextlib.suppress(OSError):
            os.close(descriptor)
    if _stat_identity(before) != _stat_identity(after):
        _fail("io_failed")
    current = _relative_lstat(directory, name)
    if (
        current is None
        or stat.S_ISLNK(current.st_mode)
        or not stat.S_ISREG(current.st_mode)
    ):
        _fail("unsafe_path")
    if _inode_identity(current) != _inode_identity(after):
        _fail("io_failed")
    return content


def _write_relative_temporary(directory: int, content: bytes) -> str:
    flags = (
        os.O_WRONLY
        | os.O_CREAT
        | os.O_EXCL
        | getattr(os, "O_NOFOLLOW", 0)
        | getattr(os, "O_CLOEXEC", 0)
    )
    descriptor = -1
    temporary_name: str | None = None
    for _ in range(32):
        candidate = f".papercuts-{secrets.token_hex(8)}.tmp"
        try:
            descriptor = os.open(candidate, flags, 0o600, dir_fd=directory)
            temporary_name = candidate
            break
        except FileExistsError:
            continue
        except OSError as error:
            raise PapercutError("io_failed") from error
    if temporary_name is None:
        _fail("io_failed")
    try:
        os.fchmod(descriptor, 0o644)
        handle = os.fdopen(descriptor, "wb")
        descriptor = -1
        with handle:
            written = handle.write(content)
            if written != len(content):
                raise OSError("short write")
            handle.flush()
            os.fsync(handle.fileno())
        return temporary_name
    except OSError as error:
        with contextlib.suppress(OSError):
            os.unlink(temporary_name, dir_fd=directory)
        raise PapercutError("io_failed") from error
    finally:
        if descriptor >= 0:
            with contextlib.suppress(OSError):
                os.close(descriptor)


def _restore_original(directory: int, name: str, content: bytes | None) -> None:
    if content is None:
        os.unlink(name, dir_fd=directory)
    else:
        temporary_name = _write_relative_temporary(directory, content)
        try:
            os.replace(
                temporary_name,
                name,
                src_dir_fd=directory,
                dst_dir_fd=directory,
            )
            temporary_name = ""
        finally:
            if temporary_name:
                with contextlib.suppress(OSError):
                    os.unlink(temporary_name, dir_fd=directory)
    os.fsync(directory)


def _assert_storage_chain(
    root: Path,
    root_directory: int,
    agents_directory: int,
) -> None:
    _assert_repository_path(root, root_directory)
    _assert_relative_directory(root_directory, AGENTS_NAME, agents_directory)


def _atomic_write(
    root: Path,
    root_directory: int,
    agents_directory: int,
    content: bytes,
    *,
    expected: bytes | None,
) -> None:
    _assert_storage_chain(root, root_directory, agents_directory)
    original = _read_relative_file(agents_directory, LEDGER_NAME)
    if original != expected:
        _fail("io_failed")
    temporary_name = _write_relative_temporary(agents_directory, content)
    try:
        _assert_storage_chain(root, root_directory, agents_directory)
        os.replace(
            temporary_name,
            LEDGER_NAME,
            src_dir_fd=agents_directory,
            dst_dir_fd=agents_directory,
        )
        temporary_name = ""
        try:
            os.fsync(agents_directory)
            _assert_storage_chain(root, root_directory, agents_directory)
        except (OSError, PapercutError) as error:
            try:
                _restore_original(agents_directory, LEDGER_NAME, original)
            except (OSError, PapercutError) as restore_error:
                raise PapercutError("io_failed") from restore_error
            if isinstance(error, PapercutError):
                raise
            raise PapercutError("io_failed") from error
    except PapercutError:
        raise
    except OSError as error:
        raise PapercutError("io_failed") from error
    finally:
        if temporary_name:
            with contextlib.suppress(OSError):
                os.unlink(temporary_name, dir_fd=agents_directory)


def _payload(operation: str, status: str, **extra: Any) -> dict[str, Any]:
    return {"schema": CLI_SCHEMA, "operation": operation, "status": status, **extra}


def _init(repo: str, dry_run: bool) -> dict[str, Any]:
    with _held_repository(repo) as (root, root_directory):
        ledger_path = root / LEDGER_RELATIVE
        with _locked(ledger_path):
            _assert_repository_path(root, root_directory)
            agents_stat = _relative_lstat(root_directory, AGENTS_NAME)
            if agents_stat is None and dry_run:
                return _payload("init", "dry-run", result="created")
            created_agents = False
            try:
                if agents_stat is None:
                    os.mkdir(AGENTS_NAME, mode=0o755, dir_fd=root_directory)
                    created_agents = True
                    _fsync_directory(root_directory)
                with _held_relative_directory(
                    root_directory,
                    AGENTS_NAME,
                    missing_code="io_failed",
                ) as agents_directory:
                    raw = _read_relative_file(agents_directory, LEDGER_NAME)
                    if raw is None:
                        if dry_run:
                            _assert_storage_chain(
                                root,
                                root_directory,
                                agents_directory,
                            )
                            return _payload("init", "dry-run", result="created")
                        _atomic_write(
                            root,
                            root_directory,
                            agents_directory,
                            _canonical_bytes(EMPTY_LEDGER),
                            expected=None,
                        )
                        return _payload("init", "created")
                    parsed = _parse_json(raw, code="schema_invalid")
                    if parsed == EMPTY_V1_LEDGER:
                        if raw != _canonical_bytes(EMPTY_V1_LEDGER):
                            _fail("schema_invalid")
                        if dry_run:
                            _assert_storage_chain(
                                root,
                                root_directory,
                                agents_directory,
                            )
                            return _payload("init", "dry-run", result="migrated")
                        _atomic_write(
                            root,
                            root_directory,
                            agents_directory,
                            _canonical_bytes(EMPTY_LEDGER),
                            expected=raw,
                        )
                        return _payload("init", "migrated")
                    valid_v1_shape = (
                        isinstance(parsed, dict)
                        and set(parsed) == {"capture_mode", "records", "schema_version"}
                        and parsed["schema_version"] == 1
                        and parsed["capture_mode"] == "automatic"
                        and isinstance(parsed["records"], dict)
                        and bool(parsed["records"])
                    )
                    if valid_v1_shape:
                        _fail("migration_required")
                    ledger = _validate_v2(parsed)
                    if raw != _canonical_bytes(ledger):
                        _fail("schema_invalid")
                    _assert_storage_chain(root, root_directory, agents_directory)
                    if dry_run:
                        return _payload("init", "dry-run", result="unchanged")
                    return _payload("init", "unchanged")
            except (OSError, PapercutError) as error:
                if created_agents:
                    with contextlib.suppress(OSError):
                        os.rmdir(AGENTS_NAME, dir_fd=root_directory)
                        _fsync_directory(root_directory)
                if isinstance(error, PapercutError):
                    raise
                raise PapercutError("io_failed") from error


def _list(repo: str, record_id: str | None) -> dict[str, Any]:
    with _held_repository(repo) as (root, root_directory):
        with _held_relative_directory(
            root_directory,
            AGENTS_NAME,
            missing_code="not_initialized",
        ) as agents_directory:
            ledger, _ = _read_ledger(agents_directory)
            _assert_storage_chain(root, root_directory, agents_directory)
            if record_id is not None:
                if not RECORD_ID.fullmatch(record_id):
                    _fail("invalid_input")
                record = ledger["records"].get(record_id)
                if record is None:
                    _fail("record_missing")
                return _payload(
                    "list",
                    "listed",
                    record_id=record_id,
                    record=record,
                )
            records = []
            for current_id in sorted(ledger["records"]):
                record = ledger["records"][current_id]
                records.append(
                    {
                        "id": current_id,
                        "first_seen": record["first_seen"],
                        "last_seen": record["last_seen"],
                        "occurrence_count": record["occurrence_count"],
                        "resolution": record["resolution"],
                        "summary": record["summary"],
                        "surface": record["surface"],
                    }
                )
            return _payload("list", "listed", records=records)


def _record_command(
    repo: str,
    input_path: str,
    dry_run: bool,
) -> dict[str, Any]:
    supplied = _validate_record_input(_read_json_input(input_path))
    with _held_repository(repo) as (root, root_directory):
        ledger_path = root / LEDGER_RELATIVE
        with _locked(ledger_path):
            _assert_repository_path(root, root_directory)
            with _held_relative_directory(
                root_directory,
                AGENTS_NAME,
                missing_code="not_initialized",
            ) as agents_directory:
                ledger, raw = _read_ledger(agents_directory)
                record_id = _record_id(supplied["surface"], supplied["summary"])
                observation = supplied["observation"]
                record = ledger["records"].get(record_id)
                if record is None:
                    ledger["records"][record_id] = {
                        "first_seen": supplied["observed_on"],
                        "last_seen": supplied["observed_on"],
                        "observations": [observation],
                        "occurrence_count": 1,
                        "resolution": None,
                        "summary": supplied["summary"],
                        "surface": supplied["surface"],
                    }
                    result = "recorded"
                else:
                    if (
                        record["surface"] != supplied["surface"]
                        or record["summary"] != supplied["summary"]
                    ):
                        _fail("id_collision")
                    if observation in record["observations"]:
                        result = "unchanged"
                    else:
                        if supplied["observed_on"] < record["last_seen"]:
                            _fail("invalid_input")
                        if (
                            record["resolution"] is not None
                            and supplied["observed_on"]
                            < record["resolution"]["resolved_on"]
                        ):
                            _fail("invalid_input")
                        record["observations"].append(observation)
                        record["occurrence_count"] += 1
                        record["last_seen"] = supplied["observed_on"]
                        result = (
                            "reopened"
                            if record["resolution"] is not None
                            else "updated"
                        )
                content = _canonical_bytes(_validate_v2(ledger))
                if not dry_run and result != "unchanged":
                    _atomic_write(
                        root,
                        root_directory,
                        agents_directory,
                        content,
                        expected=raw,
                    )
                else:
                    _assert_storage_chain(root, root_directory, agents_directory)
    if dry_run:
        return _payload("record", "dry-run", result=result, record_id=record_id)
    return _payload("record", result, record_id=record_id)


def _resolve(
    repo: str,
    record_id: str,
    input_path: str,
    dry_run: bool,
) -> dict[str, Any]:
    if not RECORD_ID.fullmatch(record_id):
        _fail("invalid_input")
    resolution = _validate_resolve_input(_read_json_input(input_path))
    with _held_repository(repo) as (root, root_directory):
        ledger_path = root / LEDGER_RELATIVE
        with _locked(ledger_path):
            _assert_repository_path(root, root_directory)
            with _held_relative_directory(
                root_directory,
                AGENTS_NAME,
                missing_code="not_initialized",
            ) as agents_directory:
                ledger, raw = _read_ledger(agents_directory)
                record = ledger["records"].get(record_id)
                if record is None:
                    _fail("record_missing")
                if resolution["resolved_on"] < record["last_seen"]:
                    _fail("invalid_input")
                if not record["observations"]:
                    if record["resolution"] == resolution:
                        result = "unchanged"
                    else:
                        _fail("id_collision")
                else:
                    record["observations"] = []
                    record["resolution"] = resolution
                    result = "resolved"
                content = _canonical_bytes(_validate_v2(ledger))
                if not dry_run and result != "unchanged":
                    _atomic_write(
                        root,
                        root_directory,
                        agents_directory,
                        content,
                        expected=raw,
                    )
                else:
                    _assert_storage_chain(root, root_directory, agents_directory)
    if dry_run:
        return _payload("resolve", "dry-run", result=result, record_id=record_id)
    return _payload("resolve", result, record_id=record_id)


def _parser() -> StrictArgumentParser:
    parser = StrictArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(
        dest="operation", required=True, parser_class=StrictArgumentParser
    )
    init = subparsers.add_parser("init")
    init.add_argument("--repo", required=True)
    init.add_argument("--dry-run", action="store_true")
    list_command = subparsers.add_parser("list")
    list_command.add_argument("--repo", required=True)
    list_command.add_argument("--id", dest="record_id")
    record = subparsers.add_parser("record")
    record.add_argument("--repo", required=True)
    record.add_argument("--input", required=True)
    record.add_argument("--dry-run", action="store_true")
    resolve = subparsers.add_parser("resolve")
    resolve.add_argument("--repo", required=True)
    resolve.add_argument("--id", dest="record_id", required=True)
    resolve.add_argument("--input", required=True)
    resolve.add_argument("--dry-run", action="store_true")
    return parser


def _operation_hint(arguments: list[str]) -> str:
    return next(
        (
            value
            for value in arguments
            if value in {"init", "list", "record", "resolve"}
        ),
        "unknown",
    )


def main(argv: list[str] | None = None) -> int:
    arguments = list(argv) if argv is not None else sys.argv[1:]
    operation = _operation_hint(arguments)
    try:
        args = _parser().parse_args(arguments)
        operation = args.operation
        if operation == "init":
            result = _init(args.repo, args.dry_run)
        elif operation == "list":
            result = _list(args.repo, args.record_id)
        elif operation == "record":
            result = _record_command(args.repo, args.input, args.dry_run)
        else:
            result = _resolve(
                args.repo,
                args.record_id,
                args.input,
                args.dry_run,
            )
    except PapercutError as error:
        print(
            json.dumps(
                {
                    "schema": CLI_SCHEMA,
                    "operation": operation,
                    "status": "error",
                    "code": error.code,
                },
                separators=(",", ":"),
                sort_keys=True,
            ),
            file=sys.stderr,
        )
        return 2
    except OSError:
        print(
            json.dumps(
                {
                    "schema": CLI_SCHEMA,
                    "operation": operation,
                    "status": "error",
                    "code": "io_failed",
                },
                separators=(",", ":"),
                sort_keys=True,
            ),
            file=sys.stderr,
        )
        return 2
    print(json.dumps(result, separators=(",", ":"), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
