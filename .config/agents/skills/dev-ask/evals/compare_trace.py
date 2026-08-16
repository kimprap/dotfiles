#!/usr/bin/env python3
"""Compare receipt-backed workflow observations with the eval registry."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import stat
import subprocess
import tempfile
from pathlib import Path, PurePosixPath
from typing import Any


OBSERVATION_SCHEMA = "lean-eval-observation/v1"
RAW_RESULT_SCHEMA = "lean-eval-raw-result/v1"
INTERACTION_SCHEMA = "lean-eval-interaction/v1"
RUNTIME_SCHEMA = "lean-eval-runtime/v1"
RECEIPT_SCHEMA = "lean-eval-receipt/v1"
RESULT_SCHEMA = "lean-eval-trace/v1"
SHA256_LENGTH = 64
RECEIPT_KEYS = {
    "schema",
    "case_id",
    "producer",
    "attempt_id",
    "skill_sha256",
    "fixture_sha256",
    "request_sha256",
    "scripted_replies_sha256",
    "additional_files_manifest_sha256",
    "target_digest",
    "raw_result_sha256",
    "observation_sha256",
    "interaction_evidence_sha256",
    "runtime_evidence_sha256",
}
BASE_OBSERVATION_KEYS = {
    "schema",
    "case_id",
    "fixture_sha256",
    "target_digest",
    "artifacts",
    "first_owner",
    "gates",
    "mode",
    "outcome",
    "owners",
    "route",
    "events",
}
OPTIONAL_EXPECTED_KEYS = {
    "assurance_profile",
    "todo_phases",
    "material_reapproval_triggers",
    "state_trace",
}
REWRITE_IDS = {
    "R-REQUIREMENTS-NEAR-MISS",
    "R-BUG-NEAR-MISS",
    "R-APPROACH-REFINEMENT-NEAR-MISS-DIRECT",
    "R-WAYFINDER-NEAR-MISS",
    "R-ARCHITECTURE-NEAR-MISS",
    "R-ARTIFACT-LANE-NEAR-MISS",
    "R-DRIFT-NEAR-MISS",
    "R-COMPLETE-COMPACT-NO-LEARNING",
    "B-RETRY",
    "B-VERIFY",
    "B-REVIEW",
    "B-COMPACT",
    "B-COMPACT-CURATION-TRIGGER",
    "L-MUTATION",
    "R-OUTCOME-CONTINUATION",
    "B-T4-REPAIR-CONSOLIDATED",
    "B-T4-REPAIR-REMAINING-BLOCKER",
    "B-T4-CURATION-COMPACT-NOT-TRIGGERED",
    "R-T5-ORDINARY-DIRECT-NO-EAGER-HISTORY",
    "R-TRIAGE-NEAR-MISS-PROJECT-TICKET",
    "R-ROUTE-PRESENTATION-NEAR-MISS-INLINE",
    "R-ROUTE-CANDIDATES",
    "R-ROUTE-GATING-QUESTION-NEAR-MISS",
}
ADDED_IDS = {
    "R-ORDINARY-COMPACT-DIRECT",
    "R-ORDINARY-COMPACT-NEAR-MISS-DISQUALIFIER",
    "R-ORDINARY-SIZE-ONLY",
    "R-ORDINARY-FACTUAL-GAP-PREPENDS-RESEARCH",
    "B-ORDINARY-COMPACT-SMOKE-PASS",
    "B-ORDINARY-COMPACT-CROSS-CONTEXT",
    "B-ORDINARY-COMPACT-SMOKE-FAIL",
    "B-RETRY-STANDARD",
    "B-RETRY-HIGH-CONSEQUENCE",
    "B-COMPACT-DEFERRED-LEARNING-CANDIDATE",
    "B-ASSURANCE-RULE-MANIFEST-OMISSION",
}


class CompareError(RuntimeError):
    pass


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def compact_json(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise CompareError(f"malformed JSON {path}: {error}") from error


def write_json(path: Path, value: Any) -> None:
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def case_map(registry: Any) -> dict[str, dict[str, Any]]:
    if not isinstance(registry, dict) or not isinstance(registry.get("cases"), list):
        raise CompareError("registry must contain a cases list")
    mapped: dict[str, dict[str, Any]] = {}
    for case in registry["cases"]:
        if not isinstance(case, dict) or not isinstance(case.get("id"), str):
            raise CompareError("registry contains a malformed case")
        if case["id"] in mapped:
            raise CompareError(f"duplicate registry case id: {case['id']}")
        mapped[case["id"]] = case
    return mapped


def safe_additional_path(raw: Any) -> PurePosixPath:
    if not isinstance(raw, str) or not raw or "\\" in raw:
        raise CompareError(f"unsafe additional path: {raw!r}")
    path = PurePosixPath(raw)
    if path.is_absolute() or raw != path.as_posix():
        raise CompareError(f"unsafe additional path: {raw!r}")
    if any(part in ("", ".", "..") for part in path.parts):
        raise CompareError(f"unsafe additional path: {raw!r}")
    return path


def require_regular(path: Path, label: str) -> None:
    try:
        info = path.lstat()
    except OSError as error:
        raise CompareError(f"{label} unavailable: {path}: {error}") from error
    if stat.S_ISLNK(info.st_mode) or not stat.S_ISREG(info.st_mode):
        raise CompareError(f"{label} must be a non-symlink regular file: {path}")


def repository_root_for_registry(registry: Path) -> Path:
    suffix = Path(".config/agents/skills/dev-ask/evals/evals.json").parts
    parts = registry.parts
    if tuple(parts[-len(suffix) :]) != suffix:
        raise CompareError(
            "registry must be the canonical .config/agents/skills/dev-ask/evals/evals.json"
        )
    root = Path(*parts[: -len(suffix)])
    if not root.is_absolute():
        root = Path("/") / root
    return root.resolve(strict=True)


def expected_skill_path(repository_root: Path, layer: Any) -> Path:
    if layer == "router":
        relative = ".config/agents/skills/dev-ask/SKILL.md"
    elif layer in ("backend", "live"):
        relative = ".config/agents/skills/dev-implementation/SKILL.md"
    else:
        raise CompareError(f"unsupported registry layer: {layer!r}")
    candidate = repository_root / relative
    require_regular(candidate, "skill")
    return candidate.resolve(strict=True)


def runtime_directories(declared_files: set[str]) -> set[str]:
    directories: set[str] = set()
    for name in declared_files:
        parent = PurePosixPath(name).parent
        while parent != PurePosixPath("."):
            directories.add(parent.as_posix())
            parent = parent.parent
    return directories


def enumerate_runtime(runtime_root: Path, declared_files: set[str]) -> dict[str, str]:
    try:
        info = runtime_root.lstat()
    except OSError as error:
        raise CompareError(f"runtime root unavailable: {error}") from error
    if stat.S_ISLNK(info.st_mode) or not stat.S_ISDIR(info.st_mode):
        raise CompareError("runtime root must be a non-symlink directory")
    allowed_directories = runtime_directories(declared_files)
    result: dict[str, str] = {}
    stack = [runtime_root]
    while stack:
        directory = stack.pop()
        with os.scandir(directory) as entries:
            for entry in entries:
                path = Path(entry.path)
                relative = path.relative_to(runtime_root).as_posix()
                if entry.is_symlink():
                    raise CompareError(f"runtime path is a symlink: {relative}")
                if entry.is_dir(follow_symlinks=False):
                    if relative not in allowed_directories:
                        raise CompareError(
                            f"runtime directory was not declared: {relative}"
                        )
                    stack.append(path)
                elif entry.is_file(follow_symlinks=False):
                    result[relative] = sha256_file(path)
                else:
                    raise CompareError(f"runtime path is unsafe: {relative}")
    return dict(sorted(result.items()))


def fixture_sources(
    fixture_path: Path, fixture: Any
) -> tuple[str, list[str], dict[str, str]]:
    if not isinstance(fixture, dict):
        raise CompareError("fixture must be a JSON object")
    inputs = fixture.get("inputs")
    if not isinstance(inputs, dict) or not isinstance(inputs.get("request"), str):
        raise CompareError("fixture inputs.request must be a string")
    replies = fixture.get("scripted_replies", [])
    if not isinstance(replies, list) or any(
        not isinstance(reply, str) for reply in replies
    ):
        raise CompareError("fixture scripted_replies must be a string list")
    additional = fixture.get("additional_files", [])
    if not isinstance(additional, list):
        raise CompareError("fixture additional_files must be a list")
    paths = [safe_additional_path(value) for value in additional]
    names = [path.as_posix() for path in paths]
    if len(names) != len(set(names)):
        raise CompareError("fixture additional_files contains a duplicate")
    manifest: dict[str, str] = {}
    root = fixture_path.parent.resolve(strict=True)
    for relative in paths:
        current = root
        for part in relative.parts:
            current = current / part
            try:
                info = current.lstat()
            except OSError as error:
                raise CompareError(
                    f"fixture source unavailable: {relative}: {error}"
                ) from error
            if stat.S_ISLNK(info.st_mode):
                raise CompareError(f"fixture source contains a symlink: {relative}")
        require_regular(current, "fixture source")
        resolved = current.resolve(strict=True)
        try:
            resolved.relative_to(root)
        except ValueError as error:
            raise CompareError(
                f"fixture source escapes fixture directory: {relative}"
            ) from error
        manifest[relative.as_posix()] = sha256_file(resolved)
    request_sha256 = sha256_bytes(inputs["request"].encode("utf-8"))
    reply_hashes = [sha256_bytes(reply.encode("utf-8")) for reply in replies]
    return request_sha256, reply_hashes, dict(sorted(manifest.items()))


def ordered_subsequence(required: list[str], observed: list[str]) -> bool:
    cursor = 0
    for event in observed:
        if cursor < len(required) and event == required[cursor]:
            cursor += 1
    return cursor == len(required)


def append_once(mismatches: list[str], message: str) -> None:
    if message not in mismatches:
        mismatches.append(message)


def validate_observation_shape(
    observation: Any, expected: dict[str, Any], mismatches: list[str]
) -> None:
    if not isinstance(observation, dict):
        append_once(mismatches, "observation must be a JSON object")
        return
    expected_optional = OPTIONAL_EXPECTED_KEYS & expected.keys()
    allowed = BASE_OBSERVATION_KEYS | expected_optional
    missing = sorted(BASE_OBSERVATION_KEYS - observation.keys())
    extra = sorted(observation.keys() - allowed)
    missing_optional = sorted(expected_optional - observation.keys())
    if missing:
        append_once(mismatches, f"observation missing keys: {missing}")
    if missing_optional:
        append_once(
            mismatches,
            f"observation missing expected optional keys: {missing_optional}",
        )
    if extra:
        append_once(mismatches, f"observation has undeclared keys: {extra}")
    if observation.get("schema") != OBSERVATION_SCHEMA:
        append_once(mismatches, "observation schema mismatch")
    events = observation.get("events")
    if not isinstance(events, list) or any(
        not isinstance(item, str) for item in events
    ):
        append_once(mismatches, "observation events must be a string list")


def validate_raw_result(
    raw_result: Any,
    observation: dict[str, Any],
    case_id: str,
    mismatches: list[str],
) -> None:
    if not isinstance(raw_result, dict) or set(raw_result) != {
        "schema",
        "case_id",
        "observation",
    }:
        append_once(
            mismatches,
            "raw result must contain only schema, case_id, and observation",
        )
        return
    if raw_result.get("schema") != RAW_RESULT_SCHEMA:
        append_once(mismatches, "raw result schema mismatch")
    if raw_result.get("case_id") != case_id:
        append_once(mismatches, "raw result case id mismatch")
    if raw_result.get("observation") != observation:
        append_once(mismatches, "raw result contradicts observation")


def valid_digest(value: Any) -> bool:
    return (
        isinstance(value, str)
        and len(value) == SHA256_LENGTH
        and all(character in "0123456789abcdef" for character in value)
    )


def validate_receipt(
    receipt: Any,
    case_id: str,
    fixture_path: Path,
    skill_path: Path,
    request_sha256: str,
    reply_hashes: list[str],
    source_manifest: dict[str, str],
    target_digest: str,
    raw_path: Path,
    observed_path: Path,
    interaction_path: Path,
    runtime_evidence_path: Path,
    mismatches: list[str],
) -> None:
    if not isinstance(receipt, dict):
        append_once(mismatches, "receipt must be a JSON object")
        return
    if set(receipt) != RECEIPT_KEYS:
        append_once(mismatches, "receipt keys mismatch")
    if receipt.get("schema") != RECEIPT_SCHEMA:
        append_once(mismatches, "receipt schema mismatch")
    if receipt.get("case_id") != case_id:
        append_once(mismatches, "receipt case id mismatch")
    for key in ("producer", "attempt_id"):
        value = receipt.get(key)
        if (
            not isinstance(value, str)
            or not value
            or value.strip() != value
            or any(character in value for character in "\r\n")
        ):
            append_once(mismatches, f"receipt {key} is malformed")
    digest_fields = {
        "skill_sha256": receipt.get("skill_sha256"),
        "fixture_sha256": receipt.get("fixture_sha256"),
        "request_sha256": receipt.get("request_sha256"),
        "additional_files_manifest_sha256": receipt.get(
            "additional_files_manifest_sha256"
        ),
        "target_digest": receipt.get("target_digest"),
        "raw_result_sha256": receipt.get("raw_result_sha256"),
        "observation_sha256": receipt.get("observation_sha256"),
        "interaction_evidence_sha256": receipt.get("interaction_evidence_sha256"),
        "runtime_evidence_sha256": receipt.get("runtime_evidence_sha256"),
    }
    for key, value in digest_fields.items():
        if not valid_digest(value):
            append_once(mismatches, f"receipt {key} is malformed")
    expected_digests = {
        "skill_sha256": sha256_file(skill_path),
        "fixture_sha256": sha256_file(fixture_path),
        "request_sha256": request_sha256,
        "additional_files_manifest_sha256": sha256_bytes(compact_json(source_manifest)),
        "target_digest": target_digest,
        "raw_result_sha256": sha256_file(raw_path),
        "observation_sha256": sha256_file(observed_path),
        "interaction_evidence_sha256": sha256_file(interaction_path),
        "runtime_evidence_sha256": sha256_file(runtime_evidence_path),
    }
    for key, expected in expected_digests.items():
        if receipt.get(key) != expected:
            append_once(mismatches, f"receipt {key} mismatch")
    if receipt.get("scripted_replies_sha256") != reply_hashes:
        append_once(mismatches, "receipt scripted reply hashes mismatch")


def evidence_bundle_paths(
    observed_path: Path,
    interaction_path: Path,
    runtime_evidence_path: Path,
    runtime_root: Path,
) -> tuple[Path, Path]:
    require_regular(observed_path, "observation")
    evidence_root = observed_path.parent.resolve(strict=True)
    expected_files = {
        "observation": (observed_path, evidence_root / "observation.json"),
        "interaction evidence": (
            interaction_path,
            evidence_root / "interaction-evidence.json",
        ),
        "runtime evidence": (
            runtime_evidence_path,
            evidence_root / "runtime-evidence.json",
        ),
    }
    for label, (provided, expected) in expected_files.items():
        require_regular(provided, label)
        if provided.resolve(strict=True) != expected:
            raise CompareError(f"{label} is outside the sealed evidence bundle")
    raw_path = evidence_root / "raw-result.txt"
    receipt_path = evidence_root / "receipt.json"
    require_regular(raw_path, "raw result")
    require_regular(receipt_path, "receipt")
    try:
        runtime_info = runtime_root.lstat()
    except OSError as error:
        raise CompareError(f"runtime root unavailable: {error}") from error
    if (
        stat.S_ISLNK(runtime_info.st_mode)
        or not stat.S_ISDIR(runtime_info.st_mode)
        or runtime_root.resolve(strict=True) != evidence_root / "runtime"
    ):
        raise CompareError("runtime root is outside the sealed evidence bundle")
    return raw_path, receipt_path


def compare_case(
    registry_path: Path,
    case_id: str,
    observed_path: Path,
    interaction_path: Path,
    runtime_evidence_path: Path,
    runtime_root: Path,
    target_digest: str,
) -> dict[str, Any]:
    mismatches: list[str] = []
    try:
        raw_path, receipt_path = evidence_bundle_paths(
            observed_path,
            interaction_path,
            runtime_evidence_path,
            runtime_root,
        )
    except CompareError as error:
        return result(case_id, [str(error)])
    try:
        registry = load_json(registry_path)
        cases = case_map(registry)
    except CompareError as error:
        return result(case_id, [str(error)])
    if case_id not in cases:
        return result(case_id, [f"unknown case id: {case_id}"])
    case = cases[case_id]
    expected = case.get("expected")
    if not isinstance(expected, dict):
        return result(case_id, ["registry expected must be an object"])
    fixture_path = registry_path.parent / case.get("fixture_dir", "") / "case.json"
    try:
        repository_root = repository_root_for_registry(
            registry_path.resolve(strict=True)
        )
        skill_path = expected_skill_path(repository_root, case.get("layer"))
        require_regular(fixture_path, "fixture")
        fixture = load_json(fixture_path)
        request_sha256, reply_hashes, source_manifest = fixture_sources(
            fixture_path, fixture
        )
        observation = load_json(observed_path)
        raw_result = load_json(raw_path)
        receipt = load_json(receipt_path)
    except CompareError as error:
        return result(case_id, [str(error)])
    validate_observation_shape(observation, expected, mismatches)
    if not isinstance(observation, dict):
        return result(case_id, mismatches)
    validate_raw_result(raw_result, observation, case_id, mismatches)
    validate_receipt(
        receipt,
        case_id,
        fixture_path,
        skill_path,
        request_sha256,
        reply_hashes,
        source_manifest,
        target_digest,
        raw_path,
        observed_path,
        interaction_path,
        runtime_evidence_path,
        mismatches,
    )
    if observation.get("case_id") != case_id:
        append_once(mismatches, "observation case id mismatch")
    if observation.get("fixture_sha256") != sha256_file(fixture_path):
        append_once(mismatches, "fixture digest mismatch")
    if observation.get("target_digest") != target_digest:
        append_once(mismatches, "target digest mismatch")
    for key, expected_value in expected.items():
        if observation.get(key) != expected_value:
            append_once(mismatches, f"field {key} mismatch")
    events = observation.get("events")
    if isinstance(events, list) and all(isinstance(item, str) for item in events):
        required = case.get("required_events", [])
        forbidden = case.get("forbidden_events", [])
        if not isinstance(required, list) or any(
            not isinstance(item, str) for item in required
        ):
            append_once(mismatches, "registry required_events is malformed")
        elif not ordered_subsequence(required, events):
            append_once(mismatches, "required events are missing or out of order")
        if not isinstance(forbidden, list) or any(
            not isinstance(item, str) for item in forbidden
        ):
            append_once(mismatches, "registry forbidden_events is malformed")
        else:
            for needle in forbidden:
                if any(needle in event for event in events):
                    append_once(mismatches, f"forbidden event present: {needle}")
    try:
        interaction = load_json(interaction_path)
        if (
            not isinstance(interaction, dict)
            or interaction.get("schema") != INTERACTION_SCHEMA
        ):
            append_once(mismatches, "interaction schema mismatch")
        else:
            if interaction.get("case_id") != case_id:
                append_once(mismatches, "interaction case id mismatch")
            consumed = interaction.get("consumed_replies")
            if not isinstance(consumed, list):
                append_once(mismatches, "consumed_replies must be a list")
            else:
                hashes: list[Any] = []
                indexes: list[Any] = []
                malformed = False
                for item in consumed:
                    if not isinstance(item, dict) or set(item) != {
                        "sha256",
                        "event_index",
                    }:
                        malformed = True
                        break
                    hashes.append(item["sha256"])
                    indexes.append(item["event_index"])
                if malformed:
                    append_once(mismatches, "consumed reply entry is malformed")
                else:
                    if hashes != reply_hashes:
                        append_once(mismatches, "scripted reply hashes mismatch")
                    if (
                        any(not isinstance(index, int) for index in indexes)
                        or indexes != sorted(set(indexes))
                        or not isinstance(events, list)
                        or any(index < 0 or index >= len(events) for index in indexes)
                    ):
                        append_once(mismatches, "scripted reply event order mismatch")
    except CompareError as error:
        append_once(mismatches, str(error))
    try:
        runtime_evidence = load_json(runtime_evidence_path)
        actual_manifest = enumerate_runtime(runtime_root, set(source_manifest))
        if (
            not isinstance(runtime_evidence, dict)
            or runtime_evidence.get("schema") != RUNTIME_SCHEMA
        ):
            append_once(mismatches, "runtime evidence schema mismatch")
        else:
            if runtime_evidence.get("case_id") != case_id:
                append_once(mismatches, "runtime evidence case id mismatch")
            try:
                evidence_root = Path(runtime_evidence.get("runtime_root", "")).resolve(
                    strict=True
                )
                actual_root = runtime_root.resolve(strict=True)
                if evidence_root != actual_root:
                    append_once(mismatches, "runtime-root identity mismatch")
            except (OSError, TypeError):
                append_once(mismatches, "runtime-root identity mismatch")
            before = runtime_evidence.get("before_sha256")
            after = runtime_evidence.get("after_sha256")
            changed = runtime_evidence.get("changed_paths")
            if runtime_evidence.get("source_manifest") != source_manifest:
                append_once(mismatches, "source fixture manifest mismatch")
            if before != source_manifest:
                append_once(mismatches, "runtime before manifest mismatch")
            if after != actual_manifest:
                append_once(mismatches, "runtime after manifest mismatch")
            if set(actual_manifest) != set(source_manifest):
                append_once(mismatches, "runtime contains missing or undeclared paths")
            if isinstance(before, dict) and isinstance(after, dict):
                calculated_changed = sorted(
                    name
                    for name in set(before) | set(after)
                    if before.get(name) != after.get(name)
                )
                if changed != calculated_changed:
                    append_once(mismatches, "runtime changed_paths mismatch")
            else:
                append_once(mismatches, "runtime manifests must be objects")
            expected_runtime = case.get("expected_runtime_files", {})
            if not isinstance(expected_runtime, dict) or any(
                not isinstance(name, str) or not isinstance(value, str)
                for name, value in expected_runtime.items()
            ):
                append_once(mismatches, "expected_runtime_files is malformed")
            else:
                for name, value in expected_runtime.items():
                    try:
                        safe_name = safe_additional_path(name).as_posix()
                    except CompareError:
                        append_once(mismatches, f"unsafe expected runtime path: {name}")
                        continue
                    if safe_name not in source_manifest:
                        append_once(
                            mismatches,
                            f"expected runtime path was not declared: {name}",
                        )
                        continue
                    path = runtime_root / Path(safe_name)
                    try:
                        require_regular(path, "expected runtime file")
                        if path.read_bytes() != value.encode("utf-8"):
                            append_once(mismatches, f"runtime bytes mismatch: {name}")
                    except (CompareError, OSError) as error:
                        append_once(mismatches, str(error))
                for name, digest in source_manifest.items():
                    if (
                        name not in expected_runtime
                        and actual_manifest.get(name) != digest
                    ):
                        append_once(mismatches, f"undeclared runtime mutation: {name}")
    except CompareError as error:
        append_once(mismatches, str(error))
    return result(case_id, mismatches)


def result(case_id: str, mismatches: list[str]) -> dict[str, Any]:
    return {
        "schema": RESULT_SCHEMA,
        "status": "pass" if not mismatches else "fail",
        "case_id": case_id,
        "mismatches": mismatches,
    }


def git_bytes(repo_root: Path, *arguments: str) -> bytes:
    completed = subprocess.run(
        ["git", "-C", str(repo_root), *arguments],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if completed.returncode != 0:
        message = completed.stderr.decode("utf-8", errors="replace").strip()
        raise CompareError(f"git {' '.join(arguments)} failed: {message}")
    return completed.stdout


def keep_check(args: argparse.Namespace) -> dict[str, Any]:
    mismatches: list[str] = []
    repo_root = Path(args.repo_root).expanduser().resolve(strict=True)
    if args.baseline_blob.upper() == "HEAD" or args.baseline_commit.upper() == "HEAD":
        return result("--keep-check", ["HEAD is not a valid pinned baseline identity"])
    try:
        baseline_bytes = git_bytes(repo_root, "cat-file", "blob", args.baseline_blob)
        if sha256_bytes(baseline_bytes) != args.baseline_sha256:
            mismatches.append("baseline blob SHA-256 mismatch")
        committed_bytes = git_bytes(
            repo_root,
            "show",
            f"{args.baseline_commit}:.config/agents/skills/dev-ask/evals/evals.json",
        )
        if committed_bytes != baseline_bytes:
            mismatches.append("baseline commit does not bind the pinned blob bytes")
        baseline = json.loads(baseline_bytes.decode("utf-8"))
        current_path = Path(args.current)
        if not current_path.is_absolute():
            current_path = repo_root / current_path
        current = load_json(current_path)
        baseline_cases = case_map(baseline)
        current_cases = case_map(current)
        expected_current_ids = set(baseline_cases) | ADDED_IDS
        if set(current_cases) != expected_current_ids:
            missing = sorted(expected_current_ids - set(current_cases))
            extra = sorted(set(current_cases) - expected_current_ids)
            mismatches.append(
                f"current case inventory mismatch: missing={missing} extra={extra}"
            )
        for case_id in sorted(set(baseline_cases) - REWRITE_IDS):
            if current_cases.get(case_id) != baseline_cases[case_id]:
                mismatches.append(f"keep case object changed: {case_id}")
                continue
            fixture_dir = baseline_cases[case_id].get("fixture_dir")
            if not isinstance(fixture_dir, str):
                mismatches.append(f"keep case fixture_dir malformed: {case_id}")
                continue
            relative = f".config/agents/skills/dev-ask/evals/{fixture_dir}/case.json"
            baseline_fixture = git_bytes(
                repo_root, "show", f"{args.baseline_commit}:{relative}"
            )
            current_fixture_path = repo_root / relative
            try:
                require_regular(current_fixture_path, "current keep fixture")
                if current_fixture_path.read_bytes() != baseline_fixture:
                    mismatches.append(f"keep fixture changed: {case_id}")
            except (CompareError, OSError) as error:
                mismatches.append(str(error))
    except (CompareError, UnicodeError, json.JSONDecodeError) as error:
        mismatches.append(str(error))
    output = result("--keep-check", mismatches)
    output["baseline_commit"] = args.baseline_commit
    output["baseline_blob"] = args.baseline_blob
    output["keep_count"] = (
        max(0, len(case_map(baseline).keys() - REWRITE_IDS))
        if "baseline" in locals()
        else 0
    )
    return output


def selftest_base(root: Path) -> dict[str, Path]:
    repository_root = root / "repository"
    eval_dir = repository_root / ".config/agents/skills/dev-ask/evals"
    fixture_dir = eval_dir / "fixtures/case"
    runtime = root / "runtime"
    router_skill = repository_root / ".config/agents/skills/dev-ask/SKILL.md"
    backend_skill = (
        repository_root / ".config/agents/skills/dev-implementation/SKILL.md"
    )
    fixture_dir.mkdir(parents=True)
    backend_skill.parent.mkdir(parents=True)
    runtime.mkdir()
    router_skill.write_text("router self-test skill\n", encoding="utf-8")
    backend_skill.write_text("backend self-test skill\n", encoding="utf-8")
    (fixture_dir / "source.txt").write_text("1\n", encoding="utf-8")
    fixture = fixture_dir / "case.json"
    write_json(
        fixture,
        {
            "additional_files": ["source.txt"],
            "inputs": {"request": "self-test"},
            "scripted_replies": ["approve", "continue"],
        },
    )
    expected = {
        "artifacts": ["artifact"],
        "first_owner": "owner-a",
        "gates": ["gate"],
        "mode": "one owner",
        "outcome": "complete",
        "owners": ["owner-a", "owner-b"],
        "route": "owner-a → owner-b",
        "state_trace": ["accepted", "complete"],
    }
    registry = eval_dir / "evals.json"
    write_json(
        registry,
        {
            "cases": [
                {
                    "expected": expected,
                    "expected_runtime_files": {"source.txt": "2\n"},
                    "fixture_dir": "fixtures/case",
                    "forbidden_events": ["forbidden"],
                    "id": "CASE",
                    "layer": "backend",
                    "required_events": ["start", "finish"],
                }
            ]
        },
    )
    events = ["start", "reply:approve", "reply:continue", "finish"]
    observation = root / "observation.json"
    write_json(
        observation,
        {
            "schema": OBSERVATION_SCHEMA,
            "case_id": "CASE",
            "fixture_sha256": sha256_file(fixture),
            "target_digest": "b" * 64,
            **expected,
            "events": events,
        },
    )
    raw_result = root / "raw-result.txt"
    write_json(
        raw_result,
        {
            "schema": RAW_RESULT_SCHEMA,
            "case_id": "CASE",
            "observation": load_json(observation),
        },
    )
    request_sha256, replies, source_manifest = fixture_sources(
        fixture, load_json(fixture)
    )
    interaction = root / "interaction-evidence.json"
    write_json(
        interaction,
        {
            "schema": INTERACTION_SCHEMA,
            "case_id": "CASE",
            "consumed_replies": [
                {"sha256": replies[0], "event_index": 1},
                {"sha256": replies[1], "event_index": 2},
            ],
        },
    )
    (runtime / "source.txt").write_text("2\n", encoding="utf-8")
    after = {"source.txt": sha256_file(runtime / "source.txt")}
    runtime_evidence = root / "runtime-evidence.json"
    write_json(
        runtime_evidence,
        {
            "schema": RUNTIME_SCHEMA,
            "case_id": "CASE",
            "runtime_root": str(runtime.resolve()),
            "source_manifest": source_manifest,
            "before_sha256": source_manifest,
            "after_sha256": after,
            "changed_paths": ["source.txt"],
        },
    )
    receipt = root / "receipt.json"
    write_json(
        receipt,
        {
            "schema": RECEIPT_SCHEMA,
            "case_id": "CASE",
            "producer": "selftest",
            "attempt_id": "selftest-attempt",
            "skill_sha256": sha256_file(backend_skill),
            "fixture_sha256": sha256_file(fixture),
            "request_sha256": request_sha256,
            "scripted_replies_sha256": replies,
            "additional_files_manifest_sha256": sha256_bytes(
                compact_json(source_manifest)
            ),
            "target_digest": "b" * SHA256_LENGTH,
            "raw_result_sha256": sha256_file(raw_result),
            "observation_sha256": sha256_file(observation),
            "interaction_evidence_sha256": sha256_file(interaction),
            "runtime_evidence_sha256": sha256_file(runtime_evidence),
        },
    )
    return {
        "registry": registry,
        "router_skill": router_skill,
        "backend_skill": backend_skill,
        "fixture": fixture,
        "source": fixture_dir / "source.txt",
        "observation": observation,
        "interaction": interaction,
        "runtime_evidence": runtime_evidence,
        "runtime": runtime,
        "raw_result": raw_result,
        "receipt": receipt,
    }


def apply_selftest_mutation(name: str, paths: dict[str, Path]) -> str:
    case_id = "CASE"
    if name == "pass-observation":
        return case_id
    if name == "router-skill-binding":
        registry = load_json(paths["registry"])
        registry["cases"][0]["layer"] = "router"
        receipt = load_json(paths["receipt"])
        receipt["skill_sha256"] = sha256_file(paths["router_skill"])
        write_json(paths["registry"], registry)
        write_json(paths["receipt"], receipt)
        return case_id
    if name == "live-skill-binding":
        registry = load_json(paths["registry"])
        registry["cases"][0]["layer"] = "live"
        write_json(paths["registry"], registry)
        return case_id
    if name == "skill-digest-mismatch":
        receipt = load_json(paths["receipt"])
        replacement = "0" * SHA256_LENGTH
        if receipt["skill_sha256"] == replacement:
            replacement = "1" * SHA256_LENGTH
        receipt["skill_sha256"] = replacement
        write_json(paths["receipt"], receipt)
        return case_id
    if name == "unsupported-layer":
        registry = load_json(paths["registry"])
        registry["cases"][0]["layer"] = "other"
        write_json(paths["registry"], registry)
        return case_id
    if name == "malformed-input":
        paths["observation"].write_text("{not-json", encoding="utf-8")
        return case_id
    if name == "unknown-case":
        return "UNKNOWN"
    observation = load_json(paths["observation"])
    if name == "raw-result-contradiction":
        raw_result = load_json(paths["raw_result"])
        raw_result["observation"]["route"] = "contradictory"
        write_json(paths["raw_result"], raw_result)
        receipt = load_json(paths["receipt"])
        receipt["raw_result_sha256"] = sha256_file(paths["raw_result"])
        write_json(paths["receipt"], receipt)
        return case_id
    if name == "route-mismatch":
        observation["route"] = "wrong"
    elif name == "owners-mismatch":
        observation["owners"] = ["owner-a"]
    elif name == "first-owner-mismatch":
        observation["first_owner"] = "owner-b"
    elif name == "missing-required-event":
        observation["events"].remove("finish")
    elif name == "forbidden-event":
        observation["events"].append("forbidden")
    elif name == "wrong-event-order":
        observation["events"] = ["finish", "reply:approve", "reply:continue", "start"]
    elif name == "wrong-state-trace":
        observation["state_trace"] = ["accepted", "failed"]
    elif name in ("missing-scripted-reply", "wrong-scripted-reply-order"):
        interaction = load_json(paths["interaction"])
        if name == "missing-scripted-reply":
            interaction["consumed_replies"] = interaction["consumed_replies"][:1]
        else:
            interaction["consumed_replies"] = list(
                reversed(interaction["consumed_replies"])
            )
            interaction["consumed_replies"][0]["event_index"] = 1
            interaction["consumed_replies"][1]["event_index"] = 2
        write_json(paths["interaction"], interaction)
    elif name == "runtime-mismatch":
        (paths["runtime"] / "source.txt").write_text("3\n", encoding="utf-8")
    elif name == "undeclared-runtime-mutation":
        (paths["runtime"] / "rogue").mkdir()
    elif name == "source-fixture-mismatch":
        paths["source"].write_text("9\n", encoding="utf-8")
    else:
        raise CompareError(f"unknown self-test mutation: {name}")
    if name not in (
        "missing-scripted-reply",
        "wrong-scripted-reply-order",
        "runtime-mismatch",
        "undeclared-runtime-mutation",
        "source-fixture-mismatch",
    ):
        write_json(paths["observation"], observation)
    return case_id


def run_selftest(path: Path) -> dict[str, Any]:
    definition = load_json(path)
    if (
        not isinstance(definition, dict)
        or definition.get("schema") != "lean-eval-trace-selftest/v1"
    ):
        raise CompareError("invalid comparator self-test schema")
    checks = definition.get("checks")
    if not isinstance(checks, list):
        raise CompareError("self-test checks must be a list")
    expected_names = [
        "pass-observation",
        "router-skill-binding",
        "live-skill-binding",
        "skill-digest-mismatch",
        "unsupported-layer",
        "raw-result-contradiction",
        "route-mismatch",
        "owners-mismatch",
        "first-owner-mismatch",
        "missing-required-event",
        "forbidden-event",
        "wrong-event-order",
        "wrong-state-trace",
        "missing-scripted-reply",
        "wrong-scripted-reply-order",
        "runtime-mismatch",
        "undeclared-runtime-mutation",
        "source-fixture-mismatch",
        "malformed-input",
        "unknown-case",
    ]
    names = [item.get("name") if isinstance(item, dict) else None for item in checks]
    if names != expected_names:
        raise CompareError("self-test must contain the exact ordered canned checks")
    results: list[dict[str, str]] = []
    with tempfile.TemporaryDirectory(prefix="compare-trace-selftest-") as temporary:
        base = Path(temporary)
        for index, check in enumerate(checks):
            if set(check) != {"name", "expected_status"}:
                raise CompareError(f"malformed self-test check: {check}")
            root = base / str(index)
            root.mkdir()
            paths = selftest_base(root)
            case_id = apply_selftest_mutation(check["name"], paths)
            observed = compare_case(
                paths["registry"],
                case_id,
                paths["observation"],
                paths["interaction"],
                paths["runtime_evidence"],
                paths["runtime"],
                "b" * 64,
            )
            actual = observed["status"]
            if actual != check["expected_status"]:
                raise CompareError(
                    f"self-test {check['name']} expected {check['expected_status']} got {actual}"
                )
            results.append({"name": check["name"], "status": actual})
    return {
        "schema": "lean-eval-trace-selftest-result/v1",
        "status": "pass",
        "checks": results,
    }


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser()
    root.add_argument("--registry")
    root.add_argument("--case-id")
    root.add_argument("--observed")
    root.add_argument("--interaction")
    root.add_argument("--runtime-evidence")
    root.add_argument("--runtime-root")
    root.add_argument("--target-digest")
    root.add_argument("--self-test", action="store_true")
    root.add_argument("--self-test-file")
    root.add_argument("--keep-check", action="store_true")
    root.add_argument("--baseline-blob")
    root.add_argument("--baseline-commit")
    root.add_argument("--baseline-sha256")
    root.add_argument("--current")
    root.add_argument("--repo-root")
    return root


def require_arguments(args: argparse.Namespace, names: list[str]) -> None:
    missing = [name for name in names if getattr(args, name.replace("-", "_")) is None]
    if missing:
        raise CompareError(f"missing required arguments: {missing}")


def main() -> int:
    args = parser().parse_args()
    try:
        if args.self_test:
            require_arguments(args, ["self-test-file"])
            output = run_selftest(Path(args.self_test_file))
        elif args.keep_check:
            require_arguments(
                args,
                [
                    "baseline-blob",
                    "baseline-commit",
                    "baseline-sha256",
                    "current",
                    "repo-root",
                ],
            )
            output = keep_check(args)
        else:
            require_arguments(
                args,
                [
                    "registry",
                    "case-id",
                    "observed",
                    "interaction",
                    "runtime-evidence",
                    "runtime-root",
                    "target-digest",
                ],
            )
            output = compare_case(
                Path(args.registry),
                args.case_id,
                Path(args.observed),
                Path(args.interaction),
                Path(args.runtime_evidence),
                Path(args.runtime_root),
                args.target_digest,
            )
        print(json.dumps(output, sort_keys=True))
        return 0 if output.get("status") == "pass" else 1
    except CompareError as error:
        output = result(args.case_id or "unknown", [str(error)])
        print(json.dumps(output, sort_keys=True))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
