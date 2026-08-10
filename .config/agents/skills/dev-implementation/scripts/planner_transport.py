#!/usr/bin/env python3
"""Fail-closed planner preflight and bounded native smoke adapters.

Preflight is pure static inspection of caller-bound files.  It never launches a
native process, reads credentials, contacts a provider, writes configuration, or
uses a live runtime.  Smoke is the separately gated post-login seam; its native
runner is isolated behind one function so deterministic failures can prove zero
launches.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import selectors
import signal
import stat
import subprocess
import sys
import tempfile
import time
import tomllib
from dataclasses import dataclass
from pathlib import Path
from typing import Any, BinaryIO, Callable, Iterable, Mapping, NoReturn, Sequence


PROFILE_SCHEMA = "planner-role-profile/v4"
PREFLIGHT_SCHEMA = "planner-preflight/v3"
DIAGNOSTIC_ORDER = (
    "preflight-integrity",
    "canonical-persona",
    "projection-identity",
    "agent-discovery",
    "role-binding",
    "model",
    "reasoning-effort",
    "read",
    "write",
    "execute",
    "delegation-depth",
    "subagents-enabled",
    "no-fallback",
    "state-isolation",
    "auth-isolation",
)
OMP_MODEL = "openai-codex/gpt-5.6-sol"
GROK_MODEL = "grok-4.5"
GROK_USAGE_MODEL = "grok-4.5-build"
GROK_SPAWN_TYPE = "planner"
GROK_SPAWN_DESCRIPTION = "Planner transport smoke"
OMP_DECLARED = ("read", "grep", "glob", "bash", "lsp", "write", "hub")
OMP_EFFECTIVE = OMP_DECLARED + ("yield",)
GROK_EFFECTIVE = ("read", "write", "execute")
GROK_NATIVE_TOOLS = (
    "read_file, list_dir, grep, run_terminal_command, write, search_replace"
)
FIXED_INPUT = b"planner-smoke-input\n"
FIXED_OUTPUT = b"planner-smoke-ok\n"
GROK_MAX_TURNS = 8
TERMINATION_TIMEOUT_SECONDS = 180


class CLIUsage(ValueError):
    """Raised for CLI misuse before any target path is inspected."""


class PreflightFailure(ValueError):
    """A fixed closed-key mismatch."""

    def __init__(
        self, key: str, expected: object, observed: object, source: str
    ) -> None:
        super().__init__(key)
        self.key = key
        self.expected = expected
        self.observed = observed
        self.source = source


@dataclass(frozen=True)
class NativeResult:
    returncode: int
    stdout: bytes
    stderr: bytes
    terminated: bool
    process_count: int = 1
    child_count: int = 0
    child_tool_calls: int = 0
    sha256_command_count: int = 0
    native_events: tuple[str, ...] = ()
    profile_line: str | None = None
    fallback_events: int = 0
    output_sha256: str | None = None


@dataclass(frozen=True)
class SourceParts:
    description: str
    description_lines: tuple[str, ...]
    body_bytes: bytes
    body_text: str
    sha256: str


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _short(value: object) -> str:
    text = str(value).replace("\r", "\\r").replace("\n", "\\n")
    if any(
        token in text.lower()
        for token in (
            "token",
            "secret",
            "password",
            "credential",
            "auth.json",
            "api_key",
        )
    ):
        return "<redacted>"
    return text[:200]


def _emit(payload: Mapping[str, object], stream: Any | None = None) -> None:
    if stream is None:
        stream = sys.stdout
    print(
        json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")),
        file=stream,
    )


def _diagnostic(
    key: str, expected: object, observed: object, source: str
) -> dict[str, object]:
    return {
        "capability": key,
        "expected": _short(expected),
        "observed": _short(observed),
        "schema": PREFLIGHT_SCHEMA,
        "source": _short(source),
        "status": "transport-unavailable",
    }


def _raise(key: str, expected: object, observed: object, source: str) -> NoReturn:
    raise PreflightFailure(key, expected, observed, source)


def _lstat(path: Path) -> os.stat_result | None:
    try:
        return path.lstat()
    except FileNotFoundError:
        return None


def _regular_bytes(
    path: Path, key: str, expected: object = "regular UTF-8 file"
) -> bytes:
    info = _lstat(path)
    if info is None:
        _raise(key, expected, "missing", str(path))
    if stat.S_ISLNK(info.st_mode) or not stat.S_ISREG(info.st_mode):
        _raise(key, expected, "non-regular", str(path))
    try:
        return path.read_bytes()
    except OSError as exc:
        _raise(key, expected, f"unreadable:{type(exc).__name__}", str(path))


def _profile_value(profile: Mapping[str, object], name: str, source: str) -> object:
    if name not in profile:
        _raise("preflight-integrity", f"field:{name}", "missing", source)
    return profile[name]


def _mapping(value: object, name: str, source: str) -> Mapping[str, object]:
    if not isinstance(value, Mapping):
        _raise("preflight-integrity", f"object:{name}", type(value).__name__, source)
    return value


def _strings(value: object, name: str, source: str) -> tuple[str, ...]:
    if isinstance(value, str):
        values = tuple(part.strip() for part in value.split(",") if part.strip())
    elif isinstance(value, Sequence) and not isinstance(value, (bytes, bytearray, str)):
        values = tuple(str(part) for part in value)
    else:
        _raise(
            "preflight-integrity", f"string-list:{name}", type(value).__name__, source
        )
    return values


def _profile(profile_path: Path) -> tuple[dict[str, object], bytes, str]:
    raw = _regular_bytes(profile_path, "preflight-integrity")
    digest = _sha256(raw)
    try:
        value = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        _raise(
            "preflight-integrity",
            "UTF-8 JSON Role Profile",
            type(exc).__name__,
            str(profile_path),
        )
    if not isinstance(value, dict):
        _raise(
            "preflight-integrity",
            "JSON object",
            type(value).__name__,
            str(profile_path),
        )
    if value.get("schema") != PROFILE_SCHEMA:
        _raise("preflight-integrity", PROFILE_SCHEMA, value.get("schema"), "schema")
    return value, raw, digest


def _source(path: Path) -> SourceParts:
    raw = _regular_bytes(path, "canonical-persona")
    if b"\r" in raw:
        _raise("canonical-persona", "UTF-8/LF source", "CR line ending", str(path))
    try:
        text = raw.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        _raise("canonical-persona", "valid UTF-8", type(exc).__name__, str(path))
    lines = text.splitlines(keepends=True)
    if not lines or lines[0] != "---\n":
        _raise("canonical-persona", "frontmatter opener", "invalid opener", str(path))
    close: int | None = None
    for index, line in enumerate(lines[1:], 1):
        if line == "---\n":
            close = index
            break
    if close is None:
        _raise("canonical-persona", "frontmatter closer", "missing", str(path))
    front = [line[:-1] for line in lines[1:close]]
    if len(front) < 3 or front[0] != "name: planner" or front[1] != "description: >":
        _raise(
            "canonical-persona", "name + folded description only", front[:3], str(path)
        )
    description_lines: list[str] = []
    for line in front[2:]:
        if not line.startswith("  ") or not line[2:]:
            _raise("canonical-persona", "indented description lines", line, str(path))
        description_lines.append(line[2:])
    body = "".join(lines[close + 1 :]).encode("utf-8")
    if not body or not body.endswith(b"\n") or body.endswith(b"\n\n"):
        _raise(
            "canonical-persona",
            "non-empty body with one final LF",
            "invalid body",
            str(path),
        )
    semantic = body[1:] if body.startswith(b"\n") else body
    if not semantic.strip():
        _raise("canonical-persona", "non-empty Markdown body", "empty body", str(path))
    return SourceParts(
        description=" ".join(value.strip() for value in description_lines),
        description_lines=tuple(description_lines),
        body_bytes=body,
        body_text=semantic.decode("utf-8"),
        sha256=_sha256(raw),
    )


def _expected_records(
    profile: Mapping[str, object], harness: str
) -> tuple[Mapping[str, object], ...]:
    value = profile.get("projection")
    if not isinstance(value, Sequence) or isinstance(value, (str, bytes, bytearray)):
        _raise(
            "preflight-integrity",
            "projection array",
            type(value).__name__,
            "projection",
        )
    records: list[Mapping[str, object]] = []
    for index, item in enumerate(value):
        records.append(_mapping(item, f"projection[{index}]", "projection"))
    expected_count = 1
    if len(records) != expected_count:
        _raise("projection-identity", expected_count, len(records), "projection")
    return tuple(records)


def _paths_from(value: object, name: str) -> tuple[Path, ...]:
    if not isinstance(value, Sequence) or isinstance(value, (str, bytes, bytearray)):
        _raise("preflight-integrity", f"path-array:{name}", type(value).__name__, name)
    return tuple(Path(str(item)) for item in value)


def _record_path(record: Mapping[str, object], name: str) -> Path:
    value = record.get("path")
    if not isinstance(value, str) or not value:
        _raise("preflight-integrity", f"path:{name}", value, name)
    return Path(value)


def _check_digest(path: Path, record: Mapping[str, object], key: str) -> bytes:
    raw = _regular_bytes(path, key)
    expected = record.get("sha256")
    if not isinstance(expected, str) or not re.fullmatch(r"[0-9a-f]{64}", expected):
        _raise("preflight-integrity", "sha256 hex", expected, key)
    actual = _sha256(raw)
    if actual != expected:
        _raise(key, expected, actual, str(path))
    return raw


def _provenance(raw: bytes, source_sha: str, key: str, path: Path) -> None:
    marker = f"# source-sha256: {source_sha}".encode("ascii")
    if (
        raw.count(marker) != 1
        or b"# GENERATED from personas/planner/PERSONA.md; do not edit.\n" not in raw
    ):
        _raise(key, "canonical provenance", "missing or duplicated", str(path))


def _parse_omp(raw: bytes, source: SourceParts, path: Path) -> None:
    try:
        text = raw.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        _raise("role-binding", "UTF-8/LF OMP agent", type(exc).__name__, str(path))
    if "\r" in text or not text.endswith("\n"):
        _raise("role-binding", "UTF-8/LF OMP agent", "line-ending", str(path))
    lines = text.splitlines(keepends=True)
    if not lines or lines[0] != "---\n":
        _raise("role-binding", "YAML frontmatter", "missing", str(path))
    try:
        close = next(
            index for index, line in enumerate(lines[1:], 1) if line == "---\n"
        )
    except StopIteration:
        _raise("role-binding", "YAML frontmatter closer", "missing", str(path))
    front = {
        line.split(":", 1)[0]: line.split(":", 1)[1].strip()
        for line in lines[1:close]
        if ":" in line
    }
    if front.get("name") != "planner" or front.get("model") != '"@plan"':
        _raise("role-binding", "name planner and model @plan", front, str(path))
    if front.get("thinking-level") != "max" or front.get("read-summarize") != "false":
        _raise("reasoning-effort", "max and read-summarize false", front, str(path))
    if front.get("tools") != "read, grep, glob, bash, lsp, write, hub":
        _raise("read", "exact declared OMP tools", front.get("tools"), str(path))
    if b"task:" in raw or b"spawns:" in raw or b"prewalk:" in raw:
        _raise(
            "delegation-depth", "no task/spawns/prewalk", "delegation field", str(path)
        )
    body = "".join(lines[close + 1 :]).encode("utf-8")
    if body != source.body_bytes:
        _raise("projection-identity", "canonical body bytes", "body differs", str(path))


def _toml(path: Path, raw: bytes, key: str) -> Mapping[str, object]:
    try:
        value = tomllib.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, tomllib.TOMLDecodeError) as exc:
        _raise(key, "valid UTF-8/TOML", type(exc).__name__, str(path))
    return value


def _parse_grok_agent(raw: bytes, source: SourceParts, path: Path) -> None:
    try:
        text = raw.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        _raise("role-binding", "UTF-8/LF Grok agent", type(exc).__name__, str(path))
    if "\r" in text or not text.endswith("\n"):
        _raise("role-binding", "UTF-8/LF Grok agent", "line-ending", str(path))
    lines = text.splitlines(keepends=True)
    if not lines or lines[0] != "---\n":
        _raise("role-binding", "YAML frontmatter", "missing", str(path))
    try:
        close = next(
            index for index, line in enumerate(lines[1:], 1) if line == "---\n"
        )
    except StopIteration:
        _raise("role-binding", "YAML frontmatter closer", "missing", str(path))
    front = {
        line.split(":", 1)[0]: line.split(":", 1)[1].strip()
        for line in lines[1:close]
        if ":" in line
    }
    expected = {
        "name": "planner",
        "prompt_mode": "full",
        "model": GROK_MODEL,
        "permission_mode": "default",
        "agents_md": "true",
        "tools": GROK_NATIVE_TOOLS,
    }
    observed = {key: front.get(key) for key in expected}
    if observed != expected:
        _raise("role-binding", expected, observed, str(path))
    if b"spawn_subagent" in raw or b"task:" in raw or b"spawns:" in raw:
        _raise(
            "delegation-depth",
            "no child-spawn tool or delegation field",
            "delegation surface",
            str(path),
        )
    body = "".join(lines[close + 1 :]).encode("utf-8")
    if body != source.body_bytes:
        _raise("projection-identity", "canonical body bytes", "body differs", str(path))


def _config_path(
    profile: Mapping[str, object], harness: str, native_paths: tuple[Path, ...]
) -> Path:
    config = profile.get("config")
    if isinstance(config, Mapping):
        path_value = config.get("path")
        if isinstance(path_value, str):
            return Path(path_value)
    if harness == "grok" and native_paths:
        return native_paths[0].parent.parent / "config.toml"
    if harness == "omp" and native_paths:
        return native_paths[0].parents[1] / "config.yml"
    _raise("preflight-integrity", "config path", "missing", "config")


def _read_omp_model(config_path: Path) -> tuple[str | None, bool]:
    raw = _regular_bytes(config_path, "model")
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        _raise("model", OMP_MODEL, "invalid UTF-8", str(config_path))
    match = re.search(r"(?m)^\s*plan:\s*([^#\n]+)", text)
    override = bool(
        re.search(
            r"(?m)^\s*planner:\s*",
            text[text.find("agentModelOverrides:") :]
            if "agentModelOverrides:" in text
            else "",
        )
    )
    return (match.group(1).strip().strip("\"'") if match else None), override


def _read_grok_config(config_path: Path) -> Mapping[str, object]:
    raw = _regular_bytes(config_path, "model")
    return _toml(config_path, raw, "model")


def _path_texts(
    profile: Mapping[str, object], config_path: Path, cwd: Path
) -> tuple[str, ...]:
    values: list[str] = [str(config_path), str(cwd)]
    for name in ("canonical_persona", "projection", "native", "config"):
        value = profile.get(name)
        if isinstance(value, Mapping):
            for key in ("path", "proof_root"):
                path_value = value.get(key)
                if isinstance(path_value, str):
                    values.append(path_value)
            if name == "native":
                source_paths = value.get("source_paths")
                if isinstance(source_paths, Sequence) and not isinstance(
                    source_paths, (str, bytes, bytearray)
                ):
                    values.extend(
                        str(item) for item in source_paths if isinstance(item, str)
                    )
        elif isinstance(value, Sequence) and not isinstance(
            value, (str, bytes, bytearray)
        ):
            for item in value:
                if isinstance(item, Mapping):
                    path_value = item.get("path")
                    if isinstance(path_value, str):
                        values.append(path_value)
    return tuple(values)


def _state_paths(profile: Mapping[str, object], cwd: Path, config_path: Path) -> None:
    proof_root_value = profile.get("proof_root")
    if proof_root_value is not None and not isinstance(proof_root_value, str):
        _raise("state-isolation", "proof_root path", proof_root_value, "proof_root")
    proof_root = Path(proof_root_value) if isinstance(proof_root_value, str) else None
    cwd_info = _lstat(cwd)
    if cwd_info is None or not stat.S_ISDIR(cwd_info.st_mode) or cwd.is_symlink():
        _raise("state-isolation", "regular non-symlink cwd", "invalid", str(cwd))
    if proof_root is not None:
        root_info = _lstat(proof_root)
        if (
            root_info is None
            or not stat.S_ISDIR(root_info.st_mode)
            or proof_root.is_symlink()
        ):
            _raise(
                "state-isolation",
                "private regular proof root",
                "invalid",
                str(proof_root),
            )
        try:
            cwd.absolute().relative_to(proof_root.absolute())
        except ValueError:
            _raise(
                "state-isolation",
                "cwd contained by proof root",
                str(cwd),
                str(proof_root),
            )
        current = proof_root.absolute()
        for component in cwd.absolute().relative_to(current).parts:
            current /= component
            info = _lstat(current)
            if info is not None and stat.S_ISLNK(info.st_mode):
                _raise(
                    "state-isolation", "no proof-tree symlink", "symlink", str(current)
                )
    for text in _path_texts(profile, config_path, cwd):
        if any(
            component in text
            for component in (
                ".omp/agent/agent.db",
                ".omp/agent/agent.db-wal",
                ".omp/agent/agent.db-shm",
            )
        ):
            _raise(
                "state-isolation",
                "no protected database path",
                "protected path value",
                "path",
            )
        if "\x00" in text or "\n" in text or "\r" in text:
            _raise("state-isolation", "bounded path", "control character", "path")


def _auth_isolation(profile: Mapping[str, object], harness: str) -> None:
    environment = profile.get("environment")
    if environment not in {"disposable-proof", "live"}:
        _raise(
            "preflight-integrity", "disposable-proof|live", environment, "environment"
        )
    if environment != "disposable-proof":
        return
    forbidden = (
        "credential",
        "password",
        "token",
        "api_key",
        "secret",
        "auth.json",
        "auth_path",
        "auth_token",
    )

    def walk(value: object, key: str = "") -> Iterable[str]:
        if isinstance(value, Mapping):
            for child_key, child in value.items():
                yield from walk(child, str(child_key))
        elif isinstance(value, Sequence) and not isinstance(
            value, (str, bytes, bytearray)
        ):
            for child in value:
                yield from walk(child, key)
        elif any(token in key.lower() for token in forbidden):
            yield key

    keys = tuple(walk(profile))
    if keys:
        _raise(
            "auth-isolation",
            "no auth/credential profile fields",
            keys[0],
            "role-profile",
        )
    for value in _path_texts(profile, Path("."), Path(".")):
        if "/Users/kim/.grok/config.toml" == value or value.endswith(
            "/.grok/auth.json"
        ):
            _raise("auth-isolation", "disposable auth root", value, "path")


def _preflight_checks(
    profile: Mapping[str, object],
    profile_path: Path,
    profile_sha: str,
    harness: str,
    cwd: Path,
) -> dict[str, object]:
    if profile.get("role") != "planner" or profile.get("harness") != harness:
        _raise(
            "preflight-integrity",
            {"role": "planner", "harness": harness},
            {"role": profile.get("role"), "harness": profile.get("harness")},
            "role-profile",
        )
    if profile.get("environment") not in {"disposable-proof", "live"}:
        _raise(
            "preflight-integrity",
            "valid environment",
            profile.get("environment"),
            "environment",
        )
    canonical = _mapping(
        _profile_value(profile, "canonical_persona", "canonical_persona"),
        "canonical_persona",
        "canonical_persona",
    )
    canonical_path = _record_path(canonical, "canonical_persona")
    _check_digest(canonical_path, canonical, "canonical-persona")
    source = _source(canonical_path)
    if source.sha256 != canonical.get("sha256"):
        _raise(
            "canonical-persona",
            canonical.get("sha256"),
            source.sha256,
            str(canonical_path),
        )

    projection_records = _expected_records(profile, harness)
    projection_raw = tuple(
        _check_digest(
            _record_path(record, f"projection[{index}]"), record, "projection-identity"
        )
        for index, record in enumerate(projection_records)
    )
    projection_paths = tuple(
        _record_path(record, f"projection[{index}]")
        for index, record in enumerate(projection_records)
    )
    native = _mapping(_profile_value(profile, "native", "native"), "native", "native")
    native_name = native.get("name")
    source_paths = _paths_from(native.get("source_paths"), "native.source_paths")
    if len(source_paths) != 1 or source_paths[0] != projection_paths[0]:
        _raise(
            "projection-identity",
            projection_paths,
            source_paths,
            "native.source_paths",
        )
    for raw, path in zip(projection_raw, projection_paths, strict=True):
        _provenance(raw, source.sha256, "projection-identity", path)

    expected_native_name = "planner"
    if native_name != expected_native_name:
        _raise("agent-discovery", expected_native_name, native_name, "native.name")
    collision = cwd / (
        ".omp/agents/planner.md"
        if harness == "omp"
        else f".grok/agents/{GROK_SPAWN_TYPE}.md"
    )
    if _lstat(collision) is not None:
        _raise(
            "agent-discovery",
            f"project {expected_native_name} collision absent",
            "present",
            str(collision),
        )
    expected_kind = "user-agent"
    if native.get("kind") != expected_kind:
        _raise("role-binding", expected_kind, native.get("kind"), "native.kind")
    if harness == "omp":
        _parse_omp(projection_raw[0], source, projection_paths[0])
    else:
        _parse_grok_agent(projection_raw[0], source, projection_paths[0])

    config_path = _config_path(profile, harness, source_paths)
    config_record = profile.get("config")
    if isinstance(config_record, Mapping) and isinstance(
        config_record.get("sha256"), str
    ):
        config_raw = _regular_bytes(config_path, "model")
        actual_config_sha = _sha256(config_raw)
        if actual_config_sha != config_record["sha256"]:
            _raise(
                "model", config_record["sha256"], actual_config_sha, str(config_path)
            )

    model = _mapping(_profile_value(profile, "model", "model"), "model", "model")
    expected_model = OMP_MODEL if harness == "omp" else GROK_MODEL
    if model.get("concrete") != expected_model:
        _raise(
            "model",
            expected_model,
            model.get("concrete"),
            str(model.get("source", "model")),
        )
    expected_source = "modelRoles.plan" if harness == "omp" else "agent.model"
    if model.get("source") != expected_source:
        _raise("model", expected_source, model.get("source"), "model.source")
    expected_selector = "@plan" if harness == "omp" else "planner"
    if model.get("selector") != expected_selector:
        _raise("model", expected_selector, model.get("selector"), "model.selector")
    if harness == "omp":
        observed, override = _read_omp_model(config_path)
        if observed is None or not observed.startswith(OMP_MODEL + ":") or override:
            _raise(
                "model",
                OMP_MODEL + ":max and no planner override",
                observed,
                "modelRoles.plan",
            )
    else:
        config = _read_grok_config(config_path)
        subagents = config.get("subagents")
        models = subagents.get("models") if isinstance(subagents, Mapping) else None
        observed_override = (
            models.get(GROK_SPAWN_TYPE) if isinstance(models, Mapping) else None
        )
        if observed_override is not None:
            _raise(
                "model",
                "no per-type override; generated agent owns the model",
                observed_override,
                f"subagents.models.{GROK_SPAWN_TYPE}",
            )

    effort = _mapping(
        _profile_value(profile, "reasoning_effort", "reasoning_effort"),
        "reasoning_effort",
        "reasoning_effort",
    )
    expected_effort = "max" if harness == "omp" else "high"
    if effort.get("concrete") != expected_effort:
        _raise(
            "reasoning-effort",
            expected_effort,
            effort.get("concrete"),
            str(effort.get("source", "reasoning_effort")),
        )

    capabilities = _mapping(
        _profile_value(profile, "capabilities", "capabilities"),
        "capabilities",
        "capabilities",
    )
    effective = _strings(
        capabilities.get("effective"), "capabilities.effective", "capabilities"
    )
    declared = _strings(
        capabilities.get("declared"), "capabilities.declared", "capabilities"
    )
    expected_declared = OMP_DECLARED if harness == "omp" else GROK_EFFECTIVE
    expected_effective = OMP_EFFECTIVE if harness == "omp" else GROK_EFFECTIVE
    for expected, observed, source in (
        (expected_declared, declared, "capabilities.declared"),
        (expected_effective, effective, "capabilities.effective"),
    ):
        if observed == expected:
            continue
        missing = next(
            (capability for capability in expected if capability not in observed), None
        )
        key = missing if missing in {"read", "write", "execute"} else "read"
        _raise(key, expected, observed, source)

    topology = _mapping(
        _profile_value(profile, "topology", "topology"), "topology", "topology"
    )
    if (
        topology.get("parent_depth") != 0
        or topology.get("child_depth") != 1
        or topology.get("child_can_spawn") is not False
    ):
        _raise(
            "delegation-depth",
            {"parent_depth": 0, "child_depth": 1, "child_can_spawn": False},
            topology,
            "topology",
        )

    if harness == "grok":
        config = _read_grok_config(config_path)
        subagents = _mapping(config.get("subagents"), "subagents", "Grok config")
        toggles = subagents.get("toggle")
        if (
            subagents.get("enabled") is not True
            or not isinstance(toggles, Mapping)
            or toggles.get(GROK_SPAWN_TYPE) is not True
        ):
            _raise(
                "subagents-enabled",
                f"enabled=true and {GROK_SPAWN_TYPE}=true",
                subagents,
                "subagents",
            )
        if "roles" in subagents or "personas" in subagents:
            _raise(
                "no-fallback",
                "no inline role/persona; generated agent only",
                "inline definition",
                "subagents",
            )

    if profile.get("fallback") != "none":
        _raise("no-fallback", "none", profile.get("fallback"), "fallback")
    _state_paths(profile, cwd, config_path)
    _auth_isolation(profile, harness)
    return {
        "role_profile_sha256": profile_sha,
        "schema": PREFLIGHT_SCHEMA,
        "status": "ready",
    }


def run_preflight(
    *, harness: str, environment: str, role_profile: Path, cwd: Path
) -> tuple[int, dict[str, object]]:
    if harness not in {"omp", "grok"} or environment not in {
        "disposable-proof",
        "live",
    }:
        return 69, _diagnostic(
            "preflight-integrity",
            "valid harness/environment",
            f"{harness}/{environment}",
            "arguments",
        )
    try:
        profile, _raw, profile_sha = _profile(role_profile)
        if profile.get("environment") != environment:
            _raise(
                "preflight-integrity",
                environment,
                profile.get("environment"),
                "environment",
            )
        result = _preflight_checks(profile, role_profile, profile_sha, harness, cwd)
        return 0, result
    except PreflightFailure as exc:
        return 69, _diagnostic(exc.key, exc.expected, exc.observed, exc.source)


def _profile_line(profile: Mapping[str, object], profile_sha: str) -> str:
    harness = str(profile.get("harness"))
    native = _mapping(profile.get("native"), "native", "profile")
    model = _mapping(profile.get("model"), "model", "profile")
    effort = _mapping(profile.get("reasoning_effort"), "reasoning_effort", "profile")
    caps = _mapping(profile.get("capabilities"), "capabilities", "profile")
    effective = ",".join(_strings(caps.get("effective"), "effective", "profile"))
    return (
        f"PROFILE role=planner harness={harness} native={native.get('name')} "
        f"model={model.get('concrete')} effort={effort.get('concrete')} "
        f"capabilities={effective} depth=0 fallback=none profile={profile_sha}"
    )


def _safe_evidence_path(path: Path) -> None:
    if _lstat(path) is not None:
        _raise("state-isolation", "new evidence path", "already exists", str(path))
    parent = path.parent
    info = _lstat(parent)
    if info is None or stat.S_ISLNK(info.st_mode) or not stat.S_ISDIR(info.st_mode):
        _raise("state-isolation", "regular evidence parent", "invalid", str(parent))


def _validate_smoke_proof_root(proof_root: Path) -> None:
    expected_root = (
        "absolute existing non-symlink directory owned by effective user "
        "with no group/other permissions"
    )
    if not proof_root.is_absolute():
        _raise("state-isolation", expected_root, "relative", str(proof_root))
    try:
        root_info = _lstat(proof_root)
    except OSError as exc:
        _raise(
            "state-isolation",
            expected_root,
            f"uninspectable:{type(exc).__name__}",
            str(proof_root),
        )
    if (
        root_info is None
        or stat.S_ISLNK(root_info.st_mode)
        or not stat.S_ISDIR(root_info.st_mode)
    ):
        _raise("state-isolation", expected_root, "invalid", str(proof_root))

    effective_uid = os.geteuid()
    if root_info.st_uid != effective_uid:
        _raise(
            "state-isolation",
            expected_root,
            f"owner:{root_info.st_uid}",
            str(proof_root),
        )
    root_mode = stat.S_IMODE(root_info.st_mode)
    if root_mode & 0o077:
        _raise(
            "state-isolation",
            expected_root,
            f"mode:{root_mode:04o}",
            str(proof_root),
        )

    expected_ancestor = (
        "non-symlink directory owned by root or effective user; "
        "group/other-writable only when sticky"
    )
    current = proof_root.parent
    while True:
        try:
            info = _lstat(current)
        except OSError as exc:
            _raise(
                "state-isolation",
                expected_ancestor,
                f"uninspectable:{type(exc).__name__}",
                str(current),
            )
        if info is None or stat.S_ISLNK(info.st_mode) or not stat.S_ISDIR(info.st_mode):
            _raise("state-isolation", expected_ancestor, "invalid", str(current))
        if info.st_uid not in {0, effective_uid}:
            _raise(
                "state-isolation",
                expected_ancestor,
                f"owner:{info.st_uid}",
                str(current),
            )
        mode = stat.S_IMODE(info.st_mode)
        if mode & 0o022 and not mode & stat.S_ISVTX:
            _raise(
                "state-isolation",
                expected_ancestor,
                f"mode:{mode:04o}",
                str(current),
            )
        if current == current.parent:
            break
        current = current.parent


def _claim_smoke_root(proof_root: Path) -> None:
    marker = proof_root / ".planner-smoke-consumed"
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    try:
        descriptor = os.open(marker, flags, 0o600)
    except FileExistsError:
        _raise(
            "state-isolation",
            "fresh disposable proof root",
            "already consumed",
            str(proof_root),
        )
    except OSError as exc:
        _raise(
            "state-isolation",
            "claimable disposable proof root",
            f"unclaimable:{type(exc).__name__}",
            str(proof_root),
        )
    else:
        os.close(descriptor)


def _cleanup_smoke_artifacts(proof_root: Path) -> None:
    for path in _smoke_paths(proof_root / "work"):
        info = _lstat(path)
        if info is None:
            continue
        if stat.S_ISDIR(info.st_mode):
            _raise(
                "state-isolation",
                "removable smoke artifact",
                "directory",
                str(path),
            )
        try:
            path.unlink()
        except OSError as exc:
            _raise(
                "state-isolation",
                "removed smoke artifact",
                f"cleanup:{type(exc).__name__}",
                str(path),
            )


def _normalize_omp_setup_version(
    profile: Mapping[str, object], proof_root: Path
) -> None:
    config = _mapping(profile.get("config"), "config", "role-profile")
    path_value = config.get("path")
    expected = config.get("sha256")
    if not isinstance(path_value, str) or not isinstance(expected, str):
        _raise(
            "preflight-integrity", "bound OMP config path and digest", config, "config"
        )
    path = Path(path_value)
    try:
        relative = path.absolute().relative_to(proof_root.absolute())
    except ValueError:
        _raise("state-isolation", "OMP config contained by proof root", path, "config")
    current = proof_root.absolute()
    for component in relative.parts:
        current /= component
        info = _lstat(current)
        if info is not None and stat.S_ISLNK(info.st_mode):
            _raise("state-isolation", "no proof-tree symlink", "symlink", str(current))
    path_info = _lstat(path)
    if path_info is None or not stat.S_ISREG(path_info.st_mode):
        _raise(
            "state-isolation",
            "regular private OMP config",
            "missing" if path_info is None else "non-regular",
            str(path),
        )
    raw = _regular_bytes(path, "model")
    if _sha256(raw) == expected:
        return
    setup_suffixes = (
        b"symbolPreset: unicode\ntheme: \n  dark: titanium\nsetupVersion: 1",
        b"setupVersion: 1",
    )
    setup_suffix = next(
        (suffix for suffix in setup_suffixes if raw.endswith(suffix)), None
    )
    if setup_suffix is None:
        _raise(
            "preflight-integrity",
            "exact OMP setup-owned EOF serialization",
            "different bytes",
            str(path),
        )
    candidate = raw[: -len(setup_suffix)]
    matches = list(re.finditer(rb"(?m)^modelRoles: \n", candidate))
    if len(matches) != 1:
        _raise(
            "preflight-integrity",
            "one top-level modelRoles trailing-space line",
            f"{len(matches)} eligible lines",
            str(path),
        )
    match = matches[0]
    candidate = candidate[: match.start()] + b"modelRoles:\n" + candidate[match.end() :]
    if _sha256(candidate) != expected:
        _raise(
            "preflight-integrity",
            expected,
            _sha256(candidate),
            str(path),
        )
    try:
        descriptor, temporary_name = tempfile.mkstemp(
            prefix=f".{path.name}.", dir=path.parent
        )
    except OSError as exc:
        _raise(
            "state-isolation",
            "private OMP config normalization temporary",
            type(exc).__name__,
            str(path),
        )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            descriptor = -1
            stream.write(candidate)
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, stat.S_IMODE(path.stat().st_mode))
        os.replace(temporary, path)
    except OSError as exc:
        _raise(
            "state-isolation",
            "atomic OMP config normalization",
            type(exc).__name__,
            str(path),
        )
    finally:
        if descriptor >= 0:
            os.close(descriptor)
        temporary.unlink(missing_ok=True)


def _text(value: object) -> str:
    parts: list[str] = []
    if isinstance(value, str):
        return value
    if isinstance(value, Mapping):
        for key in ("text", "data", "delta"):
            child = value.get(key)
            if isinstance(child, str):
                parts.append(child)
        content = value.get("content")
        if content is not None:
            parts.append(_text(content))
    elif isinstance(value, Sequence) and not isinstance(value, (str, bytes, bytearray)):
        parts.extend(_text(child) for child in value)
    return "".join(parts)


def _tool_name(value: Mapping[str, object]) -> str | None:
    for key in ("toolName", "tool_name", "name"):
        name = value.get(key)
        if isinstance(name, str):
            return name
    return None


def _tool_input(value: Mapping[str, object]) -> Mapping[str, object]:
    for key in ("rawInput", "arguments", "args", "input"):
        candidate = value.get(key)
        if isinstance(candidate, Mapping):
            return candidate
    return {}


def _event_capability(name: str | None) -> str | None:
    if not name:
        return None
    lowered = name.lower()
    if lowered in {"read", "read_file"}:
        return "read"
    if lowered in {
        "write",
        "write_file",
        "edit",
        "edit_file",
        "search_replace",
        "hashline_edit",
    }:
        return "write"
    if lowered in {
        "bash",
        "execute",
        "run_command",
        "run_terminal_cmd",
        "run_terminal_command",
        "shell",
    }:
        return "execute"
    return None


def _profile_from_text(text: str) -> str | None:
    return next(
        (line for line in text.splitlines() if line.startswith("PROFILE ")), None
    )


def _smoke_paths(work: Path) -> tuple[Path, Path]:
    return work / "planner-smoke-input.txt", work / "planner-smoke-output.txt"


def _write_smoke_input(work: Path) -> tuple[Path, Path]:
    input_path, output_path = _smoke_paths(work)
    if _lstat(input_path) is not None or _lstat(output_path) is not None:
        _raise(
            "state-isolation",
            "new smoke input/output paths",
            "already exists",
            str(work),
        )
    descriptor = os.open(input_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            descriptor = -1
            stream.write(FIXED_INPUT)
            stream.flush()
            os.fsync(stream.fileno())
    finally:
        if descriptor >= 0:
            os.close(descriptor)
    return input_path, output_path


def _terminate_process(process: subprocess.Popen[bytes], timeout: float = 5.0) -> bool:
    if process.poll() is not None:
        return True
    try:
        os.killpg(process.pid, signal.SIGTERM)
        process.wait(timeout=timeout)
    except (ProcessLookupError, subprocess.TimeoutExpired):
        if process.poll() is None:
            try:
                os.killpg(process.pid, signal.SIGKILL)
                process.wait(timeout=timeout)
            except (ProcessLookupError, subprocess.TimeoutExpired):
                return process.poll() is not None
    return process.poll() is not None


def _read_stderr(stream: Any) -> bytes:
    stream.seek(0)
    data = stream.read()
    return data if isinstance(data, bytes) else str(data).encode("utf-8", "replace")


def _spawn_input_ok(
    value: Mapping[str, object], *, harness: str, work: Path, task: str
) -> bool:
    if harness == "grok":
        allowed = {
            "subagent_type",
            "capability_mode",
            "description",
            "isolation",
            "background",
            "cwd",
            "prompt",
        }
        keys = set(value)
        required = {
            "subagent_type",
            "description",
            "prompt",
        }
        if not required.issubset(keys) or not keys.issubset(allowed):
            return False
        expected_defaults = {
            "capability_mode": "all",
            "isolation": "none",
            "background": False,
            "cwd": str(work),
        }
        return (
            value.get("subagent_type") == GROK_SPAWN_TYPE
            and value.get("description") == GROK_SPAWN_DESCRIPTION
            and value.get("prompt") == task
            and all(
                key not in value or value.get(key) == expected
                for key, expected in expected_defaults.items()
            )
        )
    tasks = value.get("tasks")
    if (
        set(value) != {"context", "tasks"}
        or value.get("context") != "Bounded native planner transport proof."
        or not isinstance(tasks, Sequence)
        or isinstance(tasks, (str, bytes, bytearray))
        or len(tasks) != 1
    ):
        return False
    item = tasks[0]
    return (
        isinstance(item, Mapping)
        and set(item) == {"name", "agent", "task"}
        and item.get("name") == "planner"
        and item.get("agent") == "planner"
        and item.get("task") == task
    )


def _smoke_task(profile_line: str, input_path: Path, output_path: Path) -> str:
    digest = _sha256(FIXED_INPUT)
    return (
        "Execute this exact non-semantic transport check. Do not delegate. "
        f"Use one native read tool call to read {input_path}; require exact text planner-smoke-input followed by LF. "
        f"Use one native execute tool call for /usr/bin/shasum -a 256 {input_path}; require digest {digest}. "
        f"Use one native write tool call to create {output_path} with exact bytes planner-smoke-ok followed by LF. "
        "Use no other tools. Return exactly two lines: "
        f"{profile_line}\\nSHA256 {digest}"
    )


def _parent_prompt(harness: str, work: Path, task: str) -> str:
    if harness == "grok":
        return (
            'Pass exactly description="Planner transport smoke", subagent_type="planner", '
            'capability_mode="all", isolation="none", '
            f'background=false, cwd="{work}", and this prompt: {json.dumps(task)}. '
            "Pass no role, persona, model, effort, resume ID, alternate type, or fallback. "
            "Do not call any other tool or modify a file yourself. If and only if the child succeeds, "
            "reply with exactly planner-smoke-ok and no other text."
        )
    return (
        "Use the task tool exactly once to dispatch one exact-name planner child and wait for its complete result. "
        'Call the batch form with context="Bounded native planner transport proof." and exactly one item whose '
        f'name and agent are both "planner" and whose task is {json.dumps(task)}. '
        "Supply no effort, output schema, isolation, fallback, or second task. If the task runs in the background, "
        "use only hub wait until its result arrives. Do not call any other tool or modify a file yourself. If and "
        "only if the child succeeds, reply with exactly planner-smoke-ok and no other text."
    )


def _omp_final_text(frames: Sequence[Mapping[str, object]]) -> str:
    values: list[str] = []
    for frame in frames:
        if frame.get("type") == "subagent_event":
            continue
        if frame.get("type") == "message_end":
            message = frame.get("message")
            if isinstance(message, Mapping) and message.get("role") == "assistant":
                values.append(_text(message))
        if frame.get("type") == "agent_end":
            messages = frame.get("messages")
            if isinstance(messages, Sequence):
                for message in messages:
                    if (
                        isinstance(message, Mapping)
                        and message.get("role") == "assistant"
                    ):
                        values.append(_text(message))
    return values[-1].strip() if values else ""


def _omp_available_model_identities(data: Mapping[str, object]) -> tuple[str, ...]:
    models = data.get("models")
    if not isinstance(models, Sequence) or isinstance(models, (str, bytes, bytearray)):
        _raise(
            "model",
            "get_available_models data.models array",
            type(models).__name__,
            "OMP models",
        )
    identities: list[str] = []
    for index, value in enumerate(models):
        if not isinstance(value, Mapping):
            _raise(
                "model",
                "model object with provider and id",
                type(value).__name__,
                f"OMP models[{index}]",
            )
        provider = value.get("provider")
        model_id = value.get("id")
        if not isinstance(provider, str) or not isinstance(model_id, str):
            _raise(
                "model",
                "string provider and id",
                {"provider": provider, "id": model_id},
                f"OMP models[{index}]",
            )
        identities.append(f"{provider}/{model_id}")
    result = tuple(identities)
    if OMP_MODEL not in result:
        _raise("model", OMP_MODEL, result, "OMP models")
    return result


def _validate_omp_state(state: Mapping[str, object]) -> None:
    model = state.get("model")
    observed = (
        f"{model.get('provider')}/{model.get('id')}"
        if isinstance(model, Mapping)
        else type(model).__name__
    )
    if (
        not isinstance(model, Mapping)
        or model.get("provider") != "openai-codex"
        or model.get("id") != "gpt-5.6-sol"
    ):
        _raise("model", OMP_MODEL, observed, "OMP state")
    if state.get("thinkingLevel") != "max":
        _raise(
            "reasoning-effort",
            "max",
            state.get("thinkingLevel"),
            "OMP state",
        )


def _omp_assistant_model_identity(message: Mapping[str, object]) -> str | None:
    if message.get("role") != "assistant":
        return None
    provider = message.get("provider")
    model = message.get("model")
    if isinstance(provider, str) and isinstance(model, str):
        return f"{provider}/{model}"
    return None


def _parse_omp_frames(
    frames: Sequence[Mapping[str, object]],
    subagents: object,
    *,
    profile_line: str,
    work: Path,
) -> tuple[int, int, int, tuple[str, ...], int]:
    spawn_inputs: list[Mapping[str, object]] = []
    parent_tools: list[tuple[str, Mapping[str, object]]] = []
    child_tools: list[tuple[str, Mapping[str, object]]] = []
    child_text: list[str] = []
    child_ids: set[str] = set()
    child_agents: set[str] = set()
    child_sources: set[str] = set()
    child_models: set[str] = set()
    lifecycle: dict[str, set[str]] = {}
    fallback_events = 0

    terminal_frames = [
        frame
        for frame in frames
        if frame.get("type") == "agent_end" and frame.get("isTerminal") is not False
    ]
    if len(terminal_frames) != 1:
        _raise(
            "execute",
            "one terminal OMP agent_end",
            len(terminal_frames),
            "OMP RPC",
        )

    for frame in frames:
        event_type = str(frame.get("type", ""))
        if event_type.startswith("retry_fallback") or event_type.startswith(
            "auto_retry"
        ):
            fallback_events += 1
        if event_type == "tool_execution_start":
            name = _tool_name(frame)
            arguments = _tool_input(frame)
            if name:
                parent_tools.append((name, arguments))
            if name == "task":
                spawn_inputs.append(arguments)
            continue
        if event_type not in {
            "subagent_event",
            "subagent_lifecycle",
            "subagent_progress",
        }:
            continue
        payload = frame.get("payload")
        if not isinstance(payload, Mapping):
            _raise(
                "execute",
                f"{event_type} payload object",
                type(payload).__name__,
                "OMP RPC",
            )
        identifier = payload.get("id")
        progress = payload.get("progress")
        if (
            not isinstance(identifier, str)
            and isinstance(progress, Mapping)
            and isinstance(progress.get("id"), str)
        ):
            identifier = progress.get("id")
        if not isinstance(identifier, str) or not identifier:
            _raise(
                "delegation-depth",
                "non-empty subagent id",
                identifier,
                event_type,
            )
        child_ids.add(identifier)
        agent = payload.get("agent")
        if isinstance(agent, str):
            child_agents.add(agent)
        source = payload.get("agentSource")
        if isinstance(source, str):
            child_sources.add(source)

        if event_type == "subagent_lifecycle":
            status = payload.get("status")
            if not isinstance(status, str):
                _raise(
                    "delegation-depth",
                    "subagent lifecycle status",
                    status,
                    "OMP subagent lifecycle",
                )
            lifecycle.setdefault(identifier, set()).add(status)
            continue

        if event_type == "subagent_progress":
            if not isinstance(progress, Mapping):
                _raise(
                    "execute",
                    "subagent progress object",
                    type(progress).__name__,
                    "OMP subagent progress",
                )
            progress_agent = progress.get("agent")
            if isinstance(progress_agent, str):
                child_agents.add(progress_agent)
            progress_source = progress.get("agentSource")
            if isinstance(progress_source, str):
                child_sources.add(progress_source)
            resolved = progress.get("resolvedModel")
            if isinstance(resolved, str):
                child_models.add(resolved)
            if progress.get("resolvedModelIsFallback") is True:
                fallback_events += 1
            continue

        nested = payload.get("event")
        if not isinstance(nested, Mapping):
            _raise(
                "execute",
                "subagent event payload.event object",
                type(nested).__name__,
                "OMP subagent event",
            )
        nested_type = str(nested.get("type", ""))
        if nested_type.startswith("retry_fallback") or nested_type.startswith(
            "auto_retry"
        ):
            fallback_events += 1
        if nested_type == "tool_execution_start":
            name = _tool_name(nested)
            if name:
                child_tools.append((name, _tool_input(nested)))
        message = nested.get("message")
        if isinstance(message, Mapping):
            identity = _omp_assistant_model_identity(message)
            if identity:
                child_models.add(identity)
            if nested_type == "message_end" and message.get("role") == "assistant":
                child_text.append(_text(message))

    if not isinstance(subagents, Mapping):
        _raise(
            "execute",
            "get_subagents data object",
            type(subagents).__name__,
            "OMP subagents",
        )
    snapshots = subagents.get("subagents")
    if not isinstance(snapshots, Sequence) or isinstance(
        snapshots, (str, bytes, bytearray)
    ):
        _raise(
            "execute",
            "get_subagents data.subagents array",
            type(snapshots).__name__,
            "OMP subagents",
        )
    for index, snapshot in enumerate(snapshots):
        if not isinstance(snapshot, Mapping):
            _raise(
                "execute",
                "subagent snapshot object",
                type(snapshot).__name__,
                f"OMP subagents[{index}]",
            )
        identifier = snapshot.get("id")
        if isinstance(identifier, str) and identifier:
            child_ids.add(identifier)
        agent = snapshot.get("agent")
        if isinstance(agent, str):
            child_agents.add(agent)
        source = snapshot.get("agentSource")
        if isinstance(source, str):
            child_sources.add(source)
        progress = snapshot.get("progress")
        if isinstance(progress, Mapping):
            resolved = progress.get("resolvedModel")
            if isinstance(resolved, str):
                child_models.add(resolved)
            if progress.get("resolvedModelIsFallback") is True:
                fallback_events += 1

    expected_task = _smoke_task(profile_line, *_smoke_paths(work))
    parent_names = [name for name, _ in parent_tools]
    parent_tools_ok = (
        bool(parent_tools)
        and parent_names[0] == "task"
        and all(
            name == "hub" and arguments.get("op") == "wait"
            for name, arguments in parent_tools[1:]
        )
    )
    if (
        not parent_tools_ok
        or len(spawn_inputs) != 1
        or not _spawn_input_ok(
            spawn_inputs[0],
            harness="omp",
            work=work,
            task=expected_task,
        )
    ):
        _raise(
            "role-binding",
            "one exact-name planner task dispatch plus only optional hub waits",
            {"tools": parent_names, "inputs": spawn_inputs},
            "OMP task event",
        )
    if len(child_ids) != 1:
        _raise("delegation-depth", 1, len(child_ids), "OMP subagent events")
    child_id = next(iter(child_ids))
    if lifecycle.get(child_id) != {"started", "completed"}:
        _raise(
            "delegation-depth",
            {"started", "completed"},
            lifecycle.get(child_id, set()),
            "OMP subagent lifecycle",
        )
    if child_agents != {"planner"} or child_sources != {"user"}:
        _raise(
            "agent-discovery",
            {"agent": "planner", "source": "user"},
            {"agents": sorted(child_agents), "sources": sorted(child_sources)},
            "OMP subagent metadata",
        )
    accepted_models = {OMP_MODEL, f"{OMP_MODEL}:max"}
    if not child_models or not child_models.issubset(accepted_models):
        _raise(
            "model",
            sorted(accepted_models),
            sorted(child_models),
            "OMP subagent metadata",
        )
    if any(name == "task" for name, _ in child_tools):
        _raise(
            "delegation-depth", "child without task", "nested task event", "OMP child"
        )
    observed_profile = _profile_from_text("\n".join(child_text))
    if observed_profile != profile_line:
        _raise("no-fallback", profile_line, observed_profile, "OMP child PROFILE")
    capability_tools = [
        (name, arguments, capability)
        for name, arguments in child_tools
        if (capability := _event_capability(name)) is not None
    ]
    capabilities = tuple(capability for _, _, capability in capability_tools)
    control_tools = [name for name, _ in child_tools if _event_capability(name) is None]
    controls_ok = not control_tools or (
        control_tools == ["yield"] and child_tools[-1][0] == "yield"
    )
    sha_calls = sum(
        1
        for _, arguments, capability in capability_tools
        if capability == "execute"
        and "shasum -a 256" in json.dumps(arguments, sort_keys=True)
    )
    if (
        len(capability_tools) != 3
        or capabilities != ("read", "execute", "write")
        or not controls_ok
    ):
        _raise(
            "delegation-depth",
            {
                "capabilities": ("read", "execute", "write"),
                "optional_terminal_control": "yield",
            },
            {"tools": [name for name, _ in child_tools], "capabilities": capabilities},
            "OMP child tools",
        )
    if _omp_final_text(frames) != FIXED_OUTPUT.decode().strip():
        _raise(
            "role-binding",
            FIXED_OUTPUT.decode().strip(),
            _omp_final_text(frames),
            "OMP final output",
        )
    if fallback_events:
        _raise("no-fallback", 0, fallback_events, "OMP native events")
    return (
        len(child_ids),
        len(capability_tools),
        sha_calls,
        capabilities,
        fallback_events,
    )


class _RpcLineReader:
    """Read JSONL without hiding prefetched bytes from selector readiness."""

    def __init__(self, stream: BinaryIO) -> None:
        self._stream = stream
        self._selector = selectors.DefaultSelector()
        self._selector.register(stream, selectors.EVENT_READ)
        self._buffer = bytearray()
        self._eof = False

    def close(self) -> None:
        self._selector.close()

    def readline(self, deadline: float) -> bytes:
        while True:
            newline = self._buffer.find(b"\n")
            if newline >= 0:
                end = newline + 1
                line = bytes(self._buffer[:end])
                del self._buffer[:end]
                return line
            if self._eof:
                line = bytes(self._buffer)
                self._buffer.clear()
                return line
            ready = self._selector.select(max(0.0, deadline - time.monotonic()))
            if not ready:
                return b""
            chunk = os.read(self._stream.fileno(), 64 * 1024)
            if chunk:
                self._buffer.extend(chunk)
            else:
                self._eof = True


def _rpc_request(
    process: subprocess.Popen[bytes],
    reader: _RpcLineReader,
    frames: list[Mapping[str, object]],
    request: Mapping[str, object],
    deadline: float,
) -> Mapping[str, object]:
    assert process.stdin is not None
    process.stdin.write((json.dumps(request, separators=(",", ":")) + "\n").encode())
    process.stdin.flush()
    request_id = request["id"]
    while time.monotonic() < deadline:
        line = reader.readline(deadline)
        if not line:
            break
        try:
            frame = json.loads(line)
        except (UnicodeDecodeError, json.JSONDecodeError):
            _raise("execute", "valid OMP RPC JSONL", "invalid frame", "OMP stdout")
        if not isinstance(frame, Mapping):
            _raise("execute", "OMP RPC object", type(frame).__name__, "OMP stdout")
        frames.append(frame)
        if frame.get("type") == "response" and frame.get("id") == request_id:
            if frame.get("success") is not True:
                _raise(
                    "execute",
                    f"{request.get('type')} success",
                    frame.get("error", "failed"),
                    "OMP RPC",
                )
            data = frame.get("data")
            return data if isinstance(data, Mapping) else {}
    _raise("execute", f"{request.get('type')} response", "missing", "OMP RPC")


def _run_omp(
    command: Sequence[str],
    environment: Mapping[str, str],
    work: Path,
    prompt: str,
    profile_line: str,
    output_path: Path,
) -> NativeResult:
    frames: list[Mapping[str, object]] = []
    with tempfile.TemporaryFile() as stderr_stream:
        process = subprocess.Popen(
            command,
            cwd=work,
            env=environment,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=stderr_stream,
            start_new_session=True,
        )
        deadline = time.monotonic() + TERMINATION_TIMEOUT_SECONDS
        assert process.stdout is not None
        reader = _RpcLineReader(process.stdout)
        terminated = False
        try:
            ready = _rpc_request(
                process,
                reader,
                frames,
                {"id": "models", "type": "get_available_models"},
                deadline,
            )
            _omp_available_model_identities(ready)
            _rpc_request(
                process,
                reader,
                frames,
                {
                    "id": "model",
                    "type": "set_model",
                    "provider": "openai-codex",
                    "modelId": "gpt-5.6-sol",
                },
                deadline,
            )
            _rpc_request(
                process,
                reader,
                frames,
                {"id": "effort", "type": "set_thinking_level", "level": "max"},
                deadline,
            )
            _rpc_request(
                process,
                reader,
                frames,
                {
                    "id": "subagents",
                    "type": "set_subagent_subscription",
                    "level": "events",
                },
                deadline,
            )
            state = _rpc_request(
                process,
                reader,
                frames,
                {"id": "state", "type": "get_state"},
                deadline,
            )
            _validate_omp_state(state)
            _rpc_request(
                process,
                reader,
                frames,
                {"id": "prompt", "type": "prompt", "message": prompt},
                deadline,
            )
            terminal = False
            while time.monotonic() < deadline and not terminal:
                line = reader.readline(deadline)
                if not line:
                    break
                frame = json.loads(line)
                if isinstance(frame, Mapping):
                    frames.append(frame)
                    terminal = (
                        frame.get("type") == "agent_end"
                        and frame.get("isTerminal") is not False
                    )
            if not terminal:
                _raise("execute", "terminal OMP agent_end", "missing", "OMP RPC")
            subagents = _rpc_request(
                process,
                reader,
                frames,
                {"id": "children", "type": "get_subagents"},
                deadline,
            )
            child_count, tool_count, sha_calls, events, fallback_events = (
                _parse_omp_frames(
                    frames,
                    subagents,
                    profile_line=profile_line,
                    work=work,
                )
            )
            if process.stdin is not None:
                process.stdin.close()
            process.wait(timeout=max(0.1, deadline - time.monotonic()))
            terminated = True
        except subprocess.TimeoutExpired:
            terminated = _terminate_process(process)
            return NativeResult(process.returncode or 1, b"", b"", terminated)
        finally:
            reader.close()
            if not terminated:
                terminated = _terminate_process(process)
        stderr = _read_stderr(stderr_stream)
    output = _regular_bytes(output_path, "write", "exact smoke output")
    return NativeResult(
        process.returncode or 0,
        FIXED_OUTPUT if output == FIXED_OUTPUT else b"",
        stderr,
        terminated,
        child_count=child_count,
        child_tool_calls=tool_count,
        sha256_command_count=sha_calls,
        native_events=events,
        profile_line=profile_line,
        fallback_events=fallback_events,
        output_sha256=_sha256(output),
    )


def _parse_grok_stream(
    stdout: bytes,
    *,
    profile_line: str,
    work: Path,
) -> tuple[int, int, int, tuple[str, ...], int, str]:
    frames: list[Mapping[str, object]] = []
    for line in stdout.splitlines():
        try:
            value = json.loads(line)
        except (UnicodeDecodeError, json.JSONDecodeError):
            _raise("execute", "valid Grok JSONL", "invalid frame", "Grok stdout")
        if not isinstance(value, Mapping):
            _raise("execute", "Grok JSON object", type(value).__name__, "Grok stdout")
        frames.append(value)
    if not frames:
        _raise("execute", "non-empty Grok JSONL", "empty", "Grok stdout")

    terminal_frames = [frame for frame in frames if frame.get("type") == "end"]
    if len(terminal_frames) != 1 or frames[-1] is not terminal_frames[0]:
        _raise(
            "execute",
            "one terminal Grok end frame",
            {
                "count": len(terminal_frames),
                "last": frames[-1].get("type"),
            },
            "Grok stdout",
        )
    terminal = terminal_frames[0]
    if terminal.get("stopReason") != "end_turn":
        _raise(
            "execute",
            {"stopReason": "end_turn"},
            {"stopReason": terminal.get("stopReason")},
            "Grok end",
        )

    spawn_calls: list[tuple[int, str, Mapping[str, object]]] = []
    parent_tools: list[str] = []
    child_tools: list[tuple[str, str, Mapping[str, object]]] = []
    completed_child_tools: set[str] = set()
    failed_tools: set[str] = set()
    child_text: list[str] = []
    parent_text: list[str] = []
    spawn_completion: Mapping[str, object] | None = None
    active_spawn: str | None = None
    fallback_events = 0
    model_usage: set[str] = set()

    for index, frame in enumerate(frames):
        frame_type = str(frame.get("type", ""))
        if (
            frame_type in {"retry", "fallback", "auto_retry"}
            or "fallback" in frame_type
        ):
            fallback_events += 1
        if frame_type == "end":
            usage = frame.get("modelUsage")
            if isinstance(usage, Mapping):
                model_usage.update(str(name) for name in usage)
            continue
        if frame_type == "text":
            data = frame.get("data")
            if isinstance(data, str):
                if active_spawn is not None:
                    child_text.append(data)
                elif spawn_completion is not None:
                    parent_text.append(data)
            continue
        if frame_type == "tool_call":
            call_id = frame.get("toolCallId")
            name = _tool_name(frame)
            arguments = _tool_input(frame)
            if not isinstance(call_id, str) or not call_id or not name:
                _raise(
                    "execute",
                    "named Grok tool call with string ID",
                    {"id": call_id, "name": name},
                    "Grok tool call",
                )
            if name == "spawn_subagent" and active_spawn is None:
                spawn_calls.append((index, call_id, arguments))
                parent_tools.append(name)
                active_spawn = call_id
            elif active_spawn is not None:
                child_tools.append((call_id, name, arguments))
            else:
                parent_tools.append(name)
            continue
        if frame_type != "tool_call_update":
            continue
        call_id = frame.get("toolCallId")
        status = frame.get("status")
        if not isinstance(call_id, str) or not call_id:
            _raise("execute", "string toolCallId", call_id, "Grok tool update")
        if status == "failed":
            failed_tools.add(call_id)
        if active_spawn == call_id and status == "completed":
            spawn_completion = frame
            active_spawn = None
        elif status == "completed" and any(
            child_id == call_id for child_id, _name, _arguments in child_tools
        ):
            completed_child_tools.add(call_id)

    expected_task = _smoke_task(profile_line, *_smoke_paths(work))
    spawn_inputs = [arguments for _index, _call_id, arguments in spawn_calls]
    if (
        parent_tools != ["spawn_subagent"]
        or len(spawn_calls) != 1
        or not _spawn_input_ok(
            spawn_inputs[0],
            harness="grok",
            work=work,
            task=expected_task,
        )
    ):
        _raise(
            "role-binding",
            "one exact blocking planner spawn and no other parent tool",
            {"tools": parent_tools, "inputs": spawn_inputs},
            "Grok spawn event",
        )
    if active_spawn is not None or spawn_completion is None:
        _raise(
            "execute",
            "one completed blocking Grok child",
            {"active": active_spawn, "completed": spawn_completion is not None},
            "Grok spawn event",
        )
    child_ids = [call_id for call_id, _name, _arguments in child_tools]
    if (
        len(child_ids) != len(set(child_ids))
        or set(child_ids) != completed_child_tools
        or failed_tools
    ):
        _raise(
            "execute",
            "unique completed child tool calls and no failed tool",
            {
                "child_ids": child_ids,
                "completed": sorted(completed_child_tools),
                "failed": sorted(failed_tools),
            },
            "Grok child tools",
        )
    if any(name == "spawn_subagent" for _call_id, name, _arguments in child_tools):
        _raise(
            "delegation-depth",
            "child without spawn_subagent",
            "nested spawn",
            "Grok child",
        )

    raw_completion = spawn_completion.get("rawOutput")
    if not isinstance(raw_completion, Mapping):
        _raise(
            "execute",
            "SubagentCompleted rawOutput",
            type(raw_completion).__name__,
            "Grok spawn completion",
        )
    expected_child_output = f"{profile_line}\nSHA256 {_sha256(FIXED_INPUT)}"
    observed_child_output = raw_completion.get("output")
    if (
        raw_completion.get("type") != "SubagentCompleted"
        or raw_completion.get("subagent_type") != GROK_SPAWN_TYPE
        or not isinstance(raw_completion.get("subagent_id"), str)
        or not raw_completion.get("subagent_id")
        or raw_completion.get("tool_calls") != len(child_tools)
        or observed_child_output
        not in {
            expected_child_output,
            expected_child_output + "\n",
        }
    ):
        _raise(
            "role-binding",
            {
                "type": "SubagentCompleted",
                "subagent_type": GROK_SPAWN_TYPE,
                "tool_calls": len(child_tools),
                "output": expected_child_output,
            },
            raw_completion,
            "Grok spawn completion",
        )
    observed_profile = _profile_from_text(
        "".join(child_text) + "\n" + str(observed_child_output)
    )
    if observed_profile != profile_line:
        _raise("no-fallback", profile_line, observed_profile, "Grok child PROFILE")

    events = tuple(
        value
        for value in (
            _event_capability(name) for _call_id, name, _arguments in child_tools
        )
        if value
    )
    sha_calls = sum(
        1
        for _call_id, name, arguments in child_tools
        if _event_capability(name) == "execute"
        and f"/usr/bin/shasum -a 256 {_smoke_paths(work)[0]}"
        in json.dumps(arguments, sort_keys=True)
    )
    input_path, output_path = _smoke_paths(work)
    serialized_calls = [
        (
            _event_capability(name),
            json.dumps(arguments, sort_keys=True),
        )
        for _call_id, name, arguments in child_tools
    ]
    exact_paths = (
        len(serialized_calls) == 3
        and str(input_path) in serialized_calls[0][1]
        and str(input_path) in serialized_calls[1][1]
        and str(output_path) in serialized_calls[2][1]
        and FIXED_OUTPUT.decode().strip() in serialized_calls[2][1]
    )
    if (
        len(child_tools) != 3
        or events != ("read", "execute", "write")
        or not exact_paths
    ):
        _raise(
            "delegation-depth",
            ("read", "execute", "write"),
            {
                "tools": [name for _call_id, name, _arguments in child_tools],
                "capabilities": events,
                "exact_paths": exact_paths,
            },
            "Grok child tools",
        )
    if model_usage != {GROK_USAGE_MODEL}:
        _raise("model", [GROK_USAGE_MODEL], sorted(model_usage), "Grok model usage")
    if fallback_events:
        _raise("no-fallback", 0, fallback_events, "Grok native events")
    final_text = "".join(parent_text).strip()
    if final_text != FIXED_OUTPUT.decode().strip():
        _raise(
            "role-binding",
            FIXED_OUTPUT.decode().strip(),
            final_text,
            "Grok final output",
        )
    return 1, len(child_tools), sha_calls, events, fallback_events, final_text


def _run_grok(
    command: Sequence[str],
    environment: Mapping[str, str],
    work: Path,
    profile_line: str,
    output_path: Path,
) -> NativeResult:
    with tempfile.TemporaryFile() as stderr_stream:
        process = subprocess.Popen(
            command,
            cwd=work,
            env=environment,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=stderr_stream,
            start_new_session=True,
        )
        terminated = False
        try:
            stdout, _ = process.communicate(timeout=TERMINATION_TIMEOUT_SECONDS)
            terminated = True
        except subprocess.TimeoutExpired:
            terminated = _terminate_process(process)
            stdout = b""
        stderr = _read_stderr(stderr_stream)
    if not terminated:
        return NativeResult(process.returncode or 1, b"", stderr, False)
    if process.returncode != 0:
        return NativeResult(process.returncode or 1, b"", stderr, True)
    child_count, tool_count, sha_calls, events, fallback_events, final_text = (
        _parse_grok_stream(
            stdout,
            profile_line=profile_line,
            work=work,
        )
    )
    output = _regular_bytes(output_path, "write", "exact smoke output")
    return NativeResult(
        process.returncode or 0,
        (final_text + "\n").encode(),
        stderr,
        True,
        child_count=child_count,
        child_tool_calls=tool_count,
        sha256_command_count=sha_calls,
        native_events=events,
        profile_line=profile_line,
        fallback_events=fallback_events,
        output_sha256=_sha256(output),
    )


def _install_grok_agent(profile: Mapping[str, object], proof_root: Path) -> None:
    projection = _expected_records(profile, "grok")[0]
    source_path = _record_path(projection, "projection[0]")
    source_raw = _regular_bytes(source_path, "projection-identity")
    grok_home = proof_root / "home" / ".grok"
    agents_dir = grok_home / "agents"
    for directory in (proof_root / "home", grok_home, agents_dir):
        info = _lstat(directory)
        if info is None:
            directory.mkdir(mode=0o700)
        elif stat.S_ISLNK(info.st_mode) or not stat.S_ISDIR(info.st_mode):
            _raise(
                "state-isolation",
                "regular private Grok directory",
                "invalid",
                str(directory),
            )
    target = agents_dir / "planner.md"
    target_info = _lstat(target)
    if target_info is not None:
        if (
            stat.S_ISREG(target_info.st_mode)
            and _regular_bytes(target, "agent-discovery") == source_raw
        ):
            return
        _raise(
            "agent-discovery",
            "absent or byte-identical private planner agent",
            "collision",
            str(target),
        )
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    try:
        descriptor = os.open(target, flags, 0o600)
        with os.fdopen(descriptor, "wb") as stream:
            descriptor = -1
            stream.write(source_raw)
            stream.flush()
            os.fsync(stream.fileno())
    except OSError as exc:
        _raise(
            "state-isolation",
            "private Grok agent installation",
            type(exc).__name__,
            str(target),
        )
    finally:
        if "descriptor" in locals() and descriptor >= 0:
            os.close(descriptor)


def _default_native_runner(
    harness: str, proof_root: Path, profile: Mapping[str, object], profile_sha: str
) -> NativeResult:
    if harness == "omp":
        model = _mapping(profile.get("model"), "model", "role-profile")
        selector = model.get("selector")
        if (
            not isinstance(selector, str)
            or not selector
            or selector != selector.strip()
        ):
            _raise(
                "preflight-integrity",
                "non-empty model.selector",
                selector,
                "role-profile.model",
            )
    work = proof_root / "work"
    input_path, output_path = _write_smoke_input(work)
    expected_profile = _profile_line(profile, profile_sha)
    task = _smoke_task(expected_profile, input_path, output_path)
    prompt = _parent_prompt(harness, work, task)
    environment = os.environ.copy()
    for key in tuple(environment):
        upper = key.upper()
        if (
            any(
                token in upper
                for token in (
                    "API_KEY",
                    "TOKEN",
                    "AUTH_BROKER",
                    "OIDC",
                    "PROFILE",
                    "CONFIG_DIR",
                    "CONFIG_FILES",
                )
            )
            or upper.startswith("XDG_")
            or upper == "PI_CODING_AGENT_DIR"
        ):
            environment.pop(key, None)
    environment["HOME"] = str(proof_root / "home")
    if harness == "omp":
        command = [
            "/Users/kim/.local/bin/omp",
            "--profile",
            "planner-proof",
            "--model",
            selector,
            "--mode",
            "rpc",
        ]
        return _run_omp(
            command,
            environment,
            work,
            prompt,
            expected_profile,
            output_path,
        )
    environment["GROK_HOME"] = str(proof_root / "home" / ".grok")
    _install_grok_agent(profile, proof_root)
    command = [
        "/Users/kim/.grok/bin/grok",
        "--model",
        GROK_MODEL,
        "--effort",
        "high",
        "--always-approve",
        "--cwd",
        str(work),
        "--output-format",
        "streaming-json",
        "--no-memory",
        "--disable-web-search",
        "--no-auto-update",
        "--max-turns",
        str(GROK_MAX_TURNS),
        "-p",
        prompt,
    ]
    return _run_grok(command, environment, work, expected_profile, output_path)


_NATIVE_RUNNER: Callable[[str, Path, Mapping[str, object], str], NativeResult] = (
    _default_native_runner
)


def run_smoke(
    *,
    harness: str,
    role_profile: Path,
    proof_root: Path,
    evidence: Path,
    native_runner: Callable[[str, Path, Mapping[str, object], str], NativeResult]
    | None = None,
) -> tuple[int, dict[str, object]]:
    if harness not in {"omp", "grok"}:
        return 69, _diagnostic("preflight-integrity", "omp|grok", harness, "arguments")
    try:
        profile, _raw, profile_sha = _profile(role_profile)
        if profile.get("harness") != harness:
            _raise(
                "preflight-integrity",
                harness,
                profile.get("harness"),
                "role-profile.harness",
            )
        _validate_smoke_proof_root(proof_root)
        work = proof_root / "work"
        if harness == "omp" and profile.get("environment") == "disposable-proof":
            _normalize_omp_setup_version(profile, proof_root)
        code, static = run_preflight(
            harness=harness,
            environment=str(profile.get("environment", "disposable-proof")),
            role_profile=role_profile,
            cwd=work,
        )
        if code != 0:
            return code, static
        _safe_evidence_path(evidence)
        _claim_smoke_root(proof_root)
        runner = native_runner or _NATIVE_RUNNER
        result: NativeResult | None = None
        try:
            try:
                result = runner(harness, proof_root, profile, profile_sha)
            except (OSError, UnicodeError, json.JSONDecodeError) as exc:
                _raise(
                    "execute",
                    "bounded native transport",
                    type(exc).__name__,
                    "native process",
                )
            if not isinstance(result, NativeResult):
                _raise(
                    "state-isolation",
                    "delivered NativeResult with verified process termination",
                    type(result).__name__,
                    "native process",
                )
            expected_line = _profile_line(profile, profile_sha)
            if result.terminated is not True:
                _raise(
                    "state-isolation",
                    "verified process termination",
                    "unproven",
                    "native process",
                )
            if result.returncode != 0:
                _raise("execute", 0, result.returncode, "native process")
            if result.process_count != 1:
                _raise(
                    "delegation-depth",
                    1,
                    result.process_count,
                    "native process count",
                )
            if result.child_count != 1:
                _raise("delegation-depth", 1, result.child_count, "native child count")
            if result.child_tool_calls != 3:
                _raise(
                    "delegation-depth",
                    3,
                    result.child_tool_calls,
                    "native child tools",
                )
            if result.sha256_command_count != 1:
                _raise(
                    "execute",
                    1,
                    result.sha256_command_count,
                    "native SHA-256 commands",
                )
            if result.fallback_events:
                _raise("no-fallback", 0, result.fallback_events, "native events")
            if result.profile_line != expected_line:
                _raise("no-fallback", expected_line, result.profile_line, "PROFILE")
            if result.stdout != FIXED_OUTPUT:
                _raise("role-binding", FIXED_OUTPUT, result.stdout, "native output")
            if result.output_sha256 != _sha256(FIXED_OUTPUT):
                _raise(
                    "write",
                    _sha256(FIXED_OUTPUT),
                    result.output_sha256,
                    "smoke output",
                )
            if result.native_events != ("read", "execute", "write"):
                _raise(
                    "delegation-depth",
                    ("read", "execute", "write"),
                    result.native_events,
                    "native events",
                )
        finally:
            if isinstance(result, NativeResult) and result.terminated is True:
                _cleanup_smoke_artifacts(proof_root)

        evidence_payload: dict[str, object] = {
            "cleanup": "verified-terminated-pending-owner-cleanup",
            "fallback_events": result.fallback_events,
            "harness": harness,
            "login_success": True,
            "native_events": sorted(set(result.native_events)),
            "output_sha256": _sha256(FIXED_OUTPUT),
            "profile_sha256": profile_sha,
            "process_count": result.process_count,
            "child_count": result.child_count,
            "sha256_command_count": result.sha256_command_count,
            "schema": "planner-smoke/v2",
            "status": "ready",
            "tool_call_count": result.child_tool_calls,
        }
        payload = (
            json.dumps(
                evidence_payload,
                ensure_ascii=False,
                sort_keys=True,
                separators=(",", ":"),
            )
            + "\n"
        ).encode()
        descriptor, temporary_name = tempfile.mkstemp(
            prefix=f".{evidence.name}.", dir=evidence.parent
        )
        temporary = Path(temporary_name)
        try:
            with os.fdopen(descriptor, "wb") as stream:
                descriptor = -1
                stream.write(payload)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, evidence)
        finally:
            if descriptor >= 0:
                os.close(descriptor)
            temporary.unlink(missing_ok=True)
        return 0, evidence_payload
    except PreflightFailure as exc:
        return 69, _diagnostic(exc.key, exc.expected, exc.observed, exc.source)


class _Parser(argparse.ArgumentParser):
    def error(self, message: str) -> NoReturn:
        raise CLIUsage(message)


def _parser() -> _Parser:
    parser = _Parser(prog="planner_transport.py", add_help=False)
    sub = parser.add_subparsers(dest="command", required=True)
    preflight = sub.add_parser("preflight", add_help=False)
    preflight.add_argument("--harness", choices=("omp", "grok"), required=True)
    preflight.add_argument(
        "--environment", choices=("disposable-proof", "live"), required=True
    )
    preflight.add_argument("--role-profile", type=Path, required=True)
    preflight.add_argument("--cwd", type=Path, required=True)
    smoke = sub.add_parser("smoke", add_help=False)
    smoke.add_argument("--harness", choices=("omp", "grok"), required=True)
    smoke.add_argument("--role-profile", type=Path, required=True)
    smoke.add_argument("--proof-root", type=Path, required=True)
    smoke.add_argument("--evidence", type=Path, required=True)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _parser()
    try:
        args = parser.parse_args(argv)
    except (CLIUsage, SystemExit) as exc:
        message = str(exc) or "invalid command line"
        _emit(
            _diagnostic(
                "preflight-integrity", "valid command line", message, "arguments"
            )
        )
        return 64
    if args.command == "preflight":
        code, payload = run_preflight(
            harness=args.harness,
            environment=args.environment,
            role_profile=args.role_profile,
            cwd=args.cwd,
        )
        _emit(payload)
        return code
    code, payload = run_smoke(
        harness=args.harness,
        role_profile=args.role_profile,
        proof_root=args.proof_root,
        evidence=args.evidence,
    )
    _emit(payload)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
