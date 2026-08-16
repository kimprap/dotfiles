#!/usr/bin/env python3
"""Bind and seal receipt-backed engineering workflow eval observations."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import stat
import sys
import tempfile
from pathlib import Path, PurePosixPath
from typing import Any


INPUT_SCHEMA = "lean-eval-input/v1"
RAW_RESULT_SCHEMA = "lean-eval-raw-result/v1"
INTERACTION_SCHEMA = "lean-eval-interaction/v1"
RUNTIME_SCHEMA = "lean-eval-runtime/v1"
RECEIPT_SCHEMA = "lean-eval-receipt/v1"
SHA256_LENGTH = 64


class ObservationError(RuntimeError):
    pass


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def compact_json(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ObservationError(f"cannot read JSON {path}: {error}") from error


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def directory_identity(info: os.stat_result) -> tuple[int, int]:
    return info.st_dev, info.st_ino


def open_directory_fd(path: Path, label: str) -> int:
    try:
        before = path.lstat()
        if stat.S_ISLNK(before.st_mode) or not stat.S_ISDIR(before.st_mode):
            raise ObservationError(f"{label} must be a non-symlink directory")
        descriptor = os.open(
            path,
            os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW | os.O_CLOEXEC,
        )
        opened = os.fstat(descriptor)
        after = path.lstat()
    except OSError as error:
        raise ObservationError(f"cannot open {label}: {path}: {error}") from error
    if (
        not stat.S_ISDIR(opened.st_mode)
        or directory_identity(before) != directory_identity(opened)
        or directory_identity(after) != directory_identity(opened)
    ):
        os.close(descriptor)
        raise ObservationError(f"{label} identity changed while opening")
    return descriptor


def require_directory_fd_identity(path: Path, descriptor: int, label: str) -> None:
    try:
        current = path.lstat()
        opened = os.fstat(descriptor)
    except OSError as error:
        raise ObservationError(f"cannot recheck {label}: {path}: {error}") from error
    if (
        stat.S_ISLNK(current.st_mode)
        or not stat.S_ISDIR(current.st_mode)
        or directory_identity(current) != directory_identity(opened)
    ):
        raise ObservationError(f"{label} identity changed before sealing")


def write_new_json(directory: Path, descriptor: int, name: str, value: Any) -> str:
    require_directory_fd_identity(directory, descriptor, "out-dir")
    payload = (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    ).encode("utf-8")
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW | os.O_CLOEXEC
    try:
        file_descriptor = os.open(name, flags, 0o600, dir_fd=descriptor)
        with os.fdopen(file_descriptor, "wb") as handle:
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
    except OSError as error:
        raise ObservationError(
            f"cannot exclusively create sealed evidence {name}: {error}"
        ) from error
    return sha256_bytes(payload)


def require_regular(path: Path, label: str) -> None:
    try:
        info = path.lstat()
    except OSError as error:
        raise ObservationError(f"{label} is unavailable: {path}: {error}") from error
    if stat.S_ISLNK(info.st_mode) or not stat.S_ISREG(info.st_mode):
        raise ObservationError(f"{label} must be a non-symlink regular file: {path}")


def canonical_existing_file(path: str | Path, label: str) -> Path:
    candidate = Path(path).expanduser()
    require_regular(candidate, label)
    return candidate.resolve(strict=True)


def canonical_new_directory(path: str | Path) -> Path:
    candidate = Path(path).expanduser()
    if candidate.exists() or candidate.is_symlink():
        raise ObservationError(f"out-dir already exists: {candidate}")
    parent = candidate.parent.resolve(strict=True)
    return parent / candidate.name


def is_relative_to(path: Path, parent: Path) -> bool:
    try:
        path.relative_to(parent)
    except ValueError:
        return False
    return True


def repository_root_for_registry(registry: Path) -> Path:
    suffix = Path(".config/agents/skills/dev-ask/evals/evals.json").parts
    parts = registry.parts
    if tuple(parts[-len(suffix) :]) != suffix:
        raise ObservationError(
            "registry must be the canonical .config/agents/skills/dev-ask/evals/evals.json"
        )
    root = Path(*parts[: -len(suffix)])
    if not root.is_absolute():
        root = Path("/") / root
    return root.resolve(strict=True)


def validate_digest(value: str, label: str) -> None:
    if len(value) != SHA256_LENGTH or any(ch not in "0123456789abcdef" for ch in value):
        raise ObservationError(f"{label} must be a lowercase SHA-256 digest")


def validate_token(value: str, label: str) -> None:
    if not value or value.strip() != value or any(ch in value for ch in "\r\n"):
        raise ObservationError(f"{label} must be a nonempty single-line token")


def safe_additional_path(raw: Any) -> PurePosixPath:
    if not isinstance(raw, str) or not raw:
        raise ObservationError("additional_files entries must be nonempty strings")
    if "\\" in raw:
        raise ObservationError(f"additional path must use POSIX separators: {raw!r}")
    path = PurePosixPath(raw)
    if path.is_absolute() or raw != path.as_posix():
        raise ObservationError(f"additional path is not normalized: {raw!r}")
    if any(part in ("", ".", "..") for part in path.parts):
        raise ObservationError(
            f"additional path escapes its fixture directory: {raw!r}"
        )
    return path


def registry_case(registry: dict[str, Any], case_id: str) -> dict[str, Any]:
    cases = registry.get("cases")
    if not isinstance(cases, list):
        raise ObservationError("registry cases must be a list")
    matches = [
        case for case in cases if isinstance(case, dict) and case.get("id") == case_id
    ]
    if len(matches) != 1:
        raise ObservationError(f"registry case id must resolve exactly once: {case_id}")
    return matches[0]


def fixture_contract(
    fixture: dict[str, Any],
) -> tuple[str, list[str], list[PurePosixPath]]:
    inputs = fixture.get("inputs")
    if not isinstance(inputs, dict) or not isinstance(inputs.get("request"), str):
        raise ObservationError("fixture inputs.request must be a string")
    replies = fixture.get("scripted_replies", [])
    if not isinstance(replies, list) or any(
        not isinstance(reply, str) for reply in replies
    ):
        raise ObservationError("fixture scripted_replies must be a string list")
    additional = fixture.get("additional_files", [])
    if not isinstance(additional, list):
        raise ObservationError("fixture additional_files must be a list")
    paths = [safe_additional_path(item) for item in additional]
    names = [path.as_posix() for path in paths]
    if len(names) != len(set(names)):
        raise ObservationError("fixture additional_files contains a duplicate")
    return inputs["request"], replies, paths


def safe_source_file(fixture_dir: Path, relative: PurePosixPath) -> Path:
    current = fixture_dir
    for part in relative.parts:
        current = current / part
        try:
            info = current.lstat()
        except OSError as error:
            raise ObservationError(
                f"additional source is unavailable: {relative}: {error}"
            ) from error
        if stat.S_ISLNK(info.st_mode):
            raise ObservationError(f"additional source contains a symlink: {relative}")
    require_regular(current, "additional source")
    resolved = current.resolve(strict=True)
    if not is_relative_to(resolved, fixture_dir):
        raise ObservationError(
            f"additional source escapes fixture directory: {relative}"
        )
    return resolved


def source_manifest(
    fixture_path: Path, paths: list[PurePosixPath]
) -> tuple[dict[str, str], dict[str, Path]]:
    manifest: dict[str, str] = {}
    sources: dict[str, Path] = {}
    fixture_dir = fixture_path.parent.resolve(strict=True)
    for relative in paths:
        name = relative.as_posix()
        source = safe_source_file(fixture_dir, relative)
        manifest[name] = sha256_file(source)
        sources[name] = source
    return dict(sorted(manifest.items())), sources


def expected_skill_path(repository_root: Path, layer: Any) -> Path:
    if layer == "router":
        relative = ".config/agents/skills/dev-ask/SKILL.md"
    elif layer in ("backend", "live"):
        relative = ".config/agents/skills/dev-implementation/SKILL.md"
    else:
        raise ObservationError(f"unsupported registry layer: {layer!r}")
    return (repository_root / relative).resolve(strict=True)


def runtime_directories(declared_files: set[str]) -> set[str]:
    directories: set[str] = set()
    for name in declared_files:
        parent = PurePosixPath(name).parent
        while parent != PurePosixPath("."):
            directories.add(parent.as_posix())
            parent = parent.parent
    return directories


def enumerate_runtime(runtime_root: Path, declared_files: set[str]) -> dict[str, str]:
    if runtime_root.is_symlink() or not runtime_root.is_dir():
        raise ObservationError("runtime root must be a non-symlink directory")
    allowed_directories = runtime_directories(declared_files)
    manifest: dict[str, str] = {}
    stack = [runtime_root]
    while stack:
        directory = stack.pop()
        with os.scandir(directory) as entries:
            for entry in entries:
                entry_path = Path(entry.path)
                relative = entry_path.relative_to(runtime_root).as_posix()
                if entry.is_symlink():
                    raise ObservationError(f"runtime path is a symlink: {relative}")
                if entry.is_dir(follow_symlinks=False):
                    if relative not in allowed_directories:
                        raise ObservationError(
                            f"runtime directory was not declared: {relative}"
                        )
                    stack.append(entry_path)
                    continue
                if not entry.is_file(follow_symlinks=False):
                    raise ObservationError(
                        f"runtime path is not a regular file: {relative}"
                    )
                manifest[relative] = sha256_file(entry_path)
    return dict(sorted(manifest.items()))


def canonical_binding_paths(
    registry_arg: str,
    case_id: str,
    skill_arg: str,
    fixture_arg: str,
    out_dir_arg: str,
) -> tuple[Path, Path, Path, Path, Path, dict[str, Any], dict[str, Any]]:
    registry_path = canonical_existing_file(registry_arg, "registry")
    repository_root = repository_root_for_registry(registry_path)
    skill_path = canonical_existing_file(skill_arg, "skill")
    fixture_path = canonical_existing_file(fixture_arg, "fixture")
    registry = load_json(registry_path)
    if not isinstance(registry, dict):
        raise ObservationError("registry must be a JSON object")
    case = registry_case(registry, case_id)
    expected_fixture = (
        registry_path.parent / case.get("fixture_dir", "") / "case.json"
    ).resolve(strict=True)
    if fixture_path != expected_fixture:
        raise ObservationError(f"fixture does not match registry case: {fixture_path}")
    if skill_path != expected_skill_path(repository_root, case.get("layer")):
        raise ObservationError(f"skill does not match registry layer: {skill_path}")
    out_dir = canonical_new_directory(out_dir_arg)
    if is_relative_to(out_dir, repository_root):
        raise ObservationError("out-dir must be outside the canonical repository root")
    runtime_root = out_dir / "runtime"
    if is_relative_to(runtime_root, repository_root):
        raise ObservationError(
            "runtime root must be outside the canonical repository root"
        )
    fixture = load_json(fixture_path)
    if not isinstance(fixture, dict):
        raise ObservationError("fixture must be a JSON object")
    return (
        registry_path,
        repository_root,
        skill_path,
        fixture_path,
        out_dir,
        case,
        fixture,
    )


def bind_case(args: argparse.Namespace) -> dict[str, Any]:
    validate_digest(args.target_digest, "target-digest")
    validate_token(args.producer, "producer")
    validate_token(args.attempt_id, "attempt-id")
    (
        registry_path,
        repository_root,
        skill_path,
        fixture_path,
        out_dir,
        case,
        fixture,
    ) = canonical_binding_paths(
        args.registry,
        args.case_id,
        args.skill,
        args.fixture,
        args.out_dir,
    )
    request, replies, additional = fixture_contract(fixture)
    manifest, sources = source_manifest(fixture_path, additional)
    out_dir.mkdir(mode=0o700)
    runtime_root = out_dir / "runtime"
    runtime_root.mkdir(mode=0o700)
    for name, source in sources.items():
        destination = runtime_root / Path(name)
        destination.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
        shutil.copyfile(source, destination, follow_symlinks=False)
    before_manifest = enumerate_runtime(runtime_root, set(manifest))
    if before_manifest != manifest:
        raise ObservationError("runtime copy differs from the bound source manifest")
    after_copy_manifest, _ = source_manifest(fixture_path, additional)
    if after_copy_manifest != manifest:
        raise ObservationError("repository source changed while binding")
    binding = {
        "schema": INPUT_SCHEMA,
        "case_id": args.case_id,
        "registry_path": str(registry_path),
        "registry_sha256": sha256_file(registry_path),
        "repository_root": str(repository_root),
        "skill_path": str(skill_path),
        "skill_sha256": sha256_file(skill_path),
        "fixture_path": str(fixture_path),
        "fixture_sha256": sha256_file(fixture_path),
        "request_sha256": sha256_bytes(request.encode("utf-8")),
        "scripted_replies_sha256": [
            sha256_bytes(reply.encode("utf-8")) for reply in replies
        ],
        "additional_files": [path.as_posix() for path in additional],
        "additional_files_manifest": manifest,
        "additional_files_manifest_sha256": sha256_bytes(compact_json(manifest)),
        "before_manifest": before_manifest,
        "target_digest": args.target_digest,
        "producer": args.producer,
        "attempt_id": args.attempt_id,
        "out_dir": str(out_dir),
        "runtime_root": str(runtime_root),
    }
    write_json(out_dir / "input-binding.json", binding)
    return binding


def require_binding(binding: Any, out_dir: Path) -> dict[str, Any]:
    if not isinstance(binding, dict) or binding.get("schema") != INPUT_SCHEMA:
        raise ObservationError("invalid input binding schema")
    required = {
        "case_id",
        "registry_path",
        "registry_sha256",
        "repository_root",
        "skill_path",
        "skill_sha256",
        "fixture_path",
        "fixture_sha256",
        "request_sha256",
        "scripted_replies_sha256",
        "additional_files",
        "additional_files_manifest",
        "additional_files_manifest_sha256",
        "before_manifest",
        "target_digest",
        "producer",
        "attempt_id",
        "out_dir",
        "runtime_root",
    }
    missing = sorted(required - binding.keys())
    if missing:
        raise ObservationError(f"input binding missing keys: {missing}")
    if Path(binding["out_dir"]).resolve(strict=True) != out_dir:
        raise ObservationError("bound out-dir identity changed")
    runtime_root = Path(binding["runtime_root"])
    if (
        runtime_root != out_dir / "runtime"
        or runtime_root.resolve(strict=True) != runtime_root
    ):
        raise ObservationError("bound runtime-root identity changed")
    return binding


def validate_interaction(
    interaction: Any, case_id: str, expected_hashes: list[str], event_count: int
) -> None:
    if (
        not isinstance(interaction, dict)
        or interaction.get("schema") != INTERACTION_SCHEMA
    ):
        raise ObservationError("invalid interaction evidence schema")
    if interaction.get("case_id") != case_id:
        raise ObservationError("interaction case id mismatch")
    consumed = interaction.get("consumed_replies")
    if not isinstance(consumed, list):
        raise ObservationError("consumed_replies must be a list")
    hashes: list[str] = []
    indexes: list[int] = []
    for item in consumed:
        if not isinstance(item, dict) or set(item) != {"sha256", "event_index"}:
            raise ObservationError("consumed reply entry is malformed")
        if not isinstance(item["sha256"], str) or not isinstance(
            item["event_index"], int
        ):
            raise ObservationError("consumed reply entry has invalid types")
        hashes.append(item["sha256"])
        indexes.append(item["event_index"])
    if hashes != expected_hashes:
        raise ObservationError(
            "scripted replies are missing, duplicated, or out of order"
        )
    if indexes != sorted(set(indexes)):
        raise ObservationError(
            "scripted reply event indexes are duplicated or out of order"
        )
    if any(index < 0 or index >= event_count for index in indexes):
        raise ObservationError("scripted reply event index is outside the observation")


def validate_raw_result(
    raw_bytes: bytes, observation: dict[str, Any], case_id: str
) -> None:
    try:
        raw_result = json.loads(raw_bytes.decode("utf-8"))
    except (UnicodeError, json.JSONDecodeError) as error:
        raise ObservationError(f"raw result must be canonical JSON: {error}") from error
    if not isinstance(raw_result, dict) or set(raw_result) != {
        "schema",
        "case_id",
        "observation",
    }:
        raise ObservationError(
            "raw result must contain only schema, case_id, and observation"
        )
    if raw_result["schema"] != RAW_RESULT_SCHEMA:
        raise ObservationError("raw result schema mismatch")
    if raw_result["case_id"] != case_id:
        raise ObservationError("raw result case id mismatch")
    if raw_result["observation"] != observation:
        raise ObservationError("raw result contradicts observation")


def revalidate_binding(
    binding: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    registry_path = canonical_existing_file(binding["registry_path"], "registry")
    repository_root = repository_root_for_registry(registry_path)
    if str(repository_root) != binding["repository_root"]:
        raise ObservationError("repository-root identity changed")
    skill_path = canonical_existing_file(binding["skill_path"], "skill")
    fixture_path = canonical_existing_file(binding["fixture_path"], "fixture")
    if sha256_file(registry_path) != binding["registry_sha256"]:
        raise ObservationError("registry changed after bind")
    if sha256_file(skill_path) != binding["skill_sha256"]:
        raise ObservationError("skill changed after bind")
    if sha256_file(fixture_path) != binding["fixture_sha256"]:
        raise ObservationError("fixture changed after bind")
    registry = load_json(registry_path)
    case = registry_case(registry, binding["case_id"])
    if skill_path != expected_skill_path(repository_root, case.get("layer")):
        raise ObservationError("bound skill no longer matches the registry layer")
    fixture = load_json(fixture_path)
    request, replies, additional = fixture_contract(fixture)
    if sha256_bytes(request.encode("utf-8")) != binding["request_sha256"]:
        raise ObservationError("request bytes changed after bind")
    reply_hashes = [sha256_bytes(reply.encode("utf-8")) for reply in replies]
    if reply_hashes != binding["scripted_replies_sha256"]:
        raise ObservationError("scripted replies changed after bind")
    names = [path.as_posix() for path in additional]
    if names != binding["additional_files"]:
        raise ObservationError("additional file declarations changed after bind")
    manifest, _ = source_manifest(fixture_path, additional)
    if manifest != binding["additional_files_manifest"]:
        raise ObservationError("repository additional-file source changed after bind")
    if (
        sha256_bytes(compact_json(manifest))
        != binding["additional_files_manifest_sha256"]
    ):
        raise ObservationError("additional-file manifest digest mismatch")
    return case, fixture


def seal_case(out_dir_arg: str) -> dict[str, Any]:
    out_dir_input = Path(out_dir_arg).expanduser()
    try:
        out_dir_info = out_dir_input.lstat()
    except OSError as error:
        raise ObservationError(f"out-dir is unavailable: {error}") from error
    if stat.S_ISLNK(out_dir_info.st_mode) or not stat.S_ISDIR(out_dir_info.st_mode):
        raise ObservationError("out-dir must be a non-symlink directory")
    out_dir = out_dir_input.resolve(strict=True)
    binding_path = out_dir / "input-binding.json"
    require_regular(binding_path, "input binding")
    binding = require_binding(load_json(binding_path), out_dir)
    repository_root = Path(binding["repository_root"])
    if is_relative_to(out_dir, repository_root):
        raise ObservationError("out-dir is under the canonical repository root")
    case, _ = revalidate_binding(binding)
    raw_path = out_dir / "raw-result.txt"
    observation_path = out_dir / "observation.json"
    interaction_path = out_dir / "interaction-evidence.json"
    for path, label in (
        (raw_path, "raw result"),
        (observation_path, "observation"),
        (interaction_path, "interaction evidence"),
    ):
        require_regular(path, label)
        if path.stat().st_size == 0:
            raise ObservationError(f"{label} must be nonempty")
    try:
        raw_bytes = raw_path.read_bytes()
    except OSError as error:
        raise ObservationError(f"cannot read raw result: {error}") from error
    observation = load_json(observation_path)
    if not isinstance(observation, dict):
        raise ObservationError("observation must be a JSON object")
    events = observation.get("events")
    if not isinstance(events, list) or any(
        not isinstance(event, str) for event in events
    ):
        raise ObservationError("observation events must be a string list")
    validate_raw_result(raw_bytes, observation, binding["case_id"])
    interaction = load_json(interaction_path)
    validate_interaction(
        interaction,
        binding["case_id"],
        binding["scripted_replies_sha256"],
        len(events),
    )
    runtime_root = Path(binding["runtime_root"])
    after_manifest = enumerate_runtime(runtime_root, set(binding["before_manifest"]))
    before_manifest = binding["before_manifest"]
    if set(after_manifest) != set(before_manifest):
        missing = sorted(set(before_manifest) - set(after_manifest))
        added = sorted(set(after_manifest) - set(before_manifest))
        raise ObservationError(
            f"runtime paths changed: missing={missing} added={added}"
        )
    if before_manifest != binding["additional_files_manifest"]:
        raise ObservationError("bound before manifest differs from source manifest")
    revalidate_binding(binding)
    changed_paths = sorted(
        name
        for name in before_manifest
        if before_manifest[name] != after_manifest[name]
    )
    runtime_evidence = {
        "schema": RUNTIME_SCHEMA,
        "case_id": binding["case_id"],
        "runtime_root": str(runtime_root),
        "source_manifest": binding["additional_files_manifest"],
        "before_sha256": before_manifest,
        "after_sha256": after_manifest,
        "changed_paths": changed_paths,
    }
    runtime_path = out_dir / "runtime-evidence.json"
    raw_result_sha256 = sha256_bytes(raw_bytes)
    expected_digest = sha256_bytes(compact_json(case.get("expected")))
    if raw_result_sha256 == expected_digest:
        raise ObservationError("raw result is a copy of the registry expected object")
    receipt = {
        "schema": RECEIPT_SCHEMA,
        "case_id": binding["case_id"],
        "producer": binding["producer"],
        "attempt_id": binding["attempt_id"],
        "skill_sha256": binding["skill_sha256"],
        "fixture_sha256": binding["fixture_sha256"],
        "request_sha256": binding["request_sha256"],
        "scripted_replies_sha256": binding["scripted_replies_sha256"],
        "additional_files_manifest_sha256": binding["additional_files_manifest_sha256"],
        "target_digest": binding["target_digest"],
        "raw_result_sha256": raw_result_sha256,
        "observation_sha256": sha256_file(observation_path),
        "interaction_evidence_sha256": sha256_file(interaction_path),
    }
    out_dir_descriptor = open_directory_fd(out_dir, "out-dir")
    try:
        receipt["runtime_evidence_sha256"] = write_new_json(
            out_dir, out_dir_descriptor, runtime_path.name, runtime_evidence
        )
        write_new_json(out_dir, out_dir_descriptor, "receipt.json", receipt)
        require_directory_fd_identity(out_dir, out_dir_descriptor, "out-dir")
    finally:
        os.close(out_dir_descriptor)
    return receipt


def selftest_registry(repo: Path) -> tuple[Path, Path, Path]:
    eval_dir = repo / ".config/agents/skills/dev-ask/evals"
    fixture_dir = eval_dir / "fixtures/selftest"
    fixture_dir.mkdir(parents=True)
    implementation_dir = repo / ".config/agents/skills/dev-implementation"
    implementation_dir.mkdir(parents=True)
    skill = implementation_dir / "SKILL.md"
    skill.write_text("---\nname: selftest\n---\n", encoding="utf-8")
    fixture = fixture_dir / "case.json"
    (fixture_dir / "counter.txt").write_text("1\n", encoding="utf-8")
    fixture.write_text(
        json.dumps(
            {
                "additional_files": ["counter.txt"],
                "inputs": {"request": "self-test request"},
                "scripted_replies": ["first", "second"],
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    registry = eval_dir / "evals.json"
    registry.write_text(
        json.dumps(
            {
                "cases": [
                    {
                        "expected": {"route": "selftest"},
                        "fixture_dir": "fixtures/selftest",
                        "id": "SELFTEST",
                        "layer": "backend",
                    }
                ]
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    return registry, skill, fixture


def test_args(
    registry: Path, skill: Path, fixture: Path, out_dir: Path, target: str
) -> argparse.Namespace:
    return argparse.Namespace(
        registry=str(registry),
        case_id="SELFTEST",
        skill=str(skill),
        fixture=str(fixture),
        target_digest=target,
        producer="selftest-producer",
        attempt_id=out_dir.name,
        out_dir=str(out_dir),
    )


def write_selftest_producer_files(
    out_dir: Path, reply_order: list[int] | None = None
) -> None:
    events = ["accepted", "first-consumed", "second-consumed", "complete"]
    observation = {
        "schema": "lean-eval-observation/v1",
        "case_id": "SELFTEST",
        "events": events,
    }
    write_json(out_dir / "observation.json", observation)
    write_json(
        out_dir / "raw-result.txt",
        {
            "schema": RAW_RESULT_SCHEMA,
            "case_id": "SELFTEST",
            "observation": observation,
        },
    )
    binding = load_json(out_dir / "input-binding.json")
    order = [0, 1] if reply_order is None else reply_order
    consumed = [
        {
            "sha256": binding["scripted_replies_sha256"][index],
            "event_index": index + 1,
        }
        for index in order
    ]
    write_json(
        out_dir / "interaction-evidence.json",
        {
            "schema": INTERACTION_SCHEMA,
            "case_id": "SELFTEST",
            "consumed_replies": consumed,
        },
    )


def expect_failure(action: Any, label: str) -> None:
    try:
        action()
    except ObservationError:
        return
    raise AssertionError(f"self-test unexpectedly passed: {label}")


def run_selftest() -> dict[str, Any]:
    checks: list[str] = []
    target = "a" * SHA256_LENGTH
    with tempfile.TemporaryDirectory(prefix="observe-case-selftest-") as temporary:
        root = Path(temporary)
        repo = root / "repo"
        repo.mkdir()
        registry, skill, fixture = selftest_registry(repo)
        source = fixture.parent / "counter.txt"
        frozen_source = sha256_file(source)

        passing = root / "pass"
        bind_case(test_args(registry, skill, fixture, passing, target))
        write_selftest_producer_files(passing)
        seal_case(str(passing))
        assert sha256_file(source) == frozen_source
        checks.extend(["ordered-replies", "safe-additional-copy-and-seal"])

        for label, reply_order in (
            ("missing-reply", [0]),
            ("duplicate-reply", [0, 0]),
            ("out-of-order-reply", [1, 0]),
        ):
            out_dir = root / label
            bind_case(test_args(registry, skill, fixture, out_dir, target))
            write_selftest_producer_files(out_dir, reply_order)
            expect_failure(lambda path=out_dir: seal_case(str(path)), label)
            assert sha256_file(source) == frozen_source
            checks.append(label)
        for label, sealed_name in (
            ("runtime-evidence-symlink", "runtime-evidence.json"),
            ("receipt-symlink", "receipt.json"),
        ):
            out_dir = root / label
            bind_case(test_args(registry, skill, fixture, out_dir, target))
            write_selftest_producer_files(out_dir)
            protected = root / f"{label}-protected"
            protected.write_text("unchanged\n", encoding="utf-8")
            (out_dir / sealed_name).symlink_to(protected)
            expect_failure(lambda path=out_dir: seal_case(str(path)), label)
            assert protected.read_text(encoding="utf-8") == "unchanged\n"
            assert sha256_file(source) == frozen_source
            checks.append(label)

        invalid_values: list[tuple[str, list[str]]] = [
            ("absolute-path", ["/counter.txt"]),
            ("escaping-path", ["../counter.txt"]),
            ("duplicate-path", ["counter.txt", "counter.txt"]),
        ]
        original_fixture = fixture.read_text(encoding="utf-8")
        for label, values in invalid_values:
            fixture.write_text(
                json.dumps(
                    {
                        "additional_files": values,
                        "inputs": {"request": "self-test request"},
                        "scripted_replies": ["first", "second"],
                    },
                    indent=2,
                    sort_keys=True,
                )
                + "\n",
                encoding="utf-8",
            )
            expect_failure(
                lambda name=label: bind_case(
                    test_args(registry, skill, fixture, root / name, target)
                ),
                label,
            )
            fixture.write_text(original_fixture, encoding="utf-8")
            assert sha256_file(source) == frozen_source
            checks.append(label)

        symlink = fixture.parent / "linked.txt"
        symlink.symlink_to(source.name)
        fixture_payload = json.loads(original_fixture)
        fixture_payload["additional_files"] = ["linked.txt"]
        fixture.write_text(
            json.dumps(fixture_payload, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        expect_failure(
            lambda: bind_case(
                test_args(registry, skill, fixture, root / "symlink-path", target)
            ),
            "symlink-path",
        )
        fixture.write_text(original_fixture, encoding="utf-8")
        checks.append("symlink-path")

        special = fixture.parent / "special"
        os.mkfifo(special)
        fixture_payload["additional_files"] = ["special"]
        fixture.write_text(
            json.dumps(fixture_payload, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        expect_failure(
            lambda: bind_case(
                test_args(registry, skill, fixture, root / "special-path", target)
            ),
            "special-path",
        )
        fixture.write_text(original_fixture, encoding="utf-8")
        checks.append("special-path")

        source_mutation = root / "source-mutation"
        bind_case(test_args(registry, skill, fixture, source_mutation, target))
        write_selftest_producer_files(source_mutation)
        source.write_text("changed\n", encoding="utf-8")
        expect_failure(lambda: seal_case(str(source_mutation)), "source-mutation")
        source.write_text("1\n", encoding="utf-8")
        assert sha256_file(source) == frozen_source
        checks.append("source-mutation")

        for label, mutate in (
            ("runtime-addition", "add"),
            ("runtime-removal", "remove"),
            ("runtime-empty-directory", "directory"),
        ):
            out_dir = root / label
            bind_case(test_args(registry, skill, fixture, out_dir, target))
            write_selftest_producer_files(out_dir)
            if mutate == "add":
                (out_dir / "runtime/rogue.txt").write_text("rogue\n", encoding="utf-8")
            elif mutate == "remove":
                (out_dir / "runtime/counter.txt").unlink()
            else:
                (out_dir / "runtime/rogue").mkdir()
            expect_failure(lambda path=out_dir: seal_case(str(path)), label)
            assert sha256_file(source) == frozen_source
            checks.append(label)

    return {
        "schema": "lean-eval-observer-selftest/v1",
        "status": "pass",
        "checks": checks,
    }


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser()
    subparsers = root.add_subparsers(dest="command", required=True)
    bind = subparsers.add_parser("bind")
    bind.add_argument("--registry", required=True)
    bind.add_argument("--case-id", required=True)
    bind.add_argument("--skill", required=True)
    bind.add_argument("--fixture", required=True)
    bind.add_argument("--target-digest", required=True)
    bind.add_argument("--producer", required=True)
    bind.add_argument("--attempt-id", required=True)
    bind.add_argument("--out-dir", required=True)
    seal = subparsers.add_parser("seal")
    seal.add_argument("--out-dir", required=True)
    return root


def main() -> int:
    try:
        if sys.argv[1:] == ["--self-test"]:
            print(json.dumps(run_selftest(), sort_keys=True))
            return 0
        args = parser().parse_args()
        if args.command == "bind":
            result = bind_case(args)
        else:
            result = seal_case(args.out_dir)
        print(json.dumps(result, sort_keys=True))
        return 0
    except (ObservationError, AssertionError) as error:
        print(json.dumps({"status": "fail", "error": str(error)}, sort_keys=True))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
