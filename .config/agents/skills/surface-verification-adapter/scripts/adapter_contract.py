#!/usr/bin/env python3
"""Canonical contracts for manual surface-verification adapters."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import sys
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

TREE_SCHEMA = "surface-verification-adapter-tree/v1"
ADAPTER_SCHEMA = "surface-verification-adapter/v1"
RECIPE_SCHEMA = "surface-proof-recipe/v1"
DOCTOR_SCHEMA = "surface-verification-doctor/v1"
ERROR_SCHEMA = "surface-verification-adapter-error/v1"
SHA256_RE = re.compile(r"(?:sha256:)?([0-9a-f]{64})\Z")
ACCEPTANCE_ID_RE = re.compile(r"AC-([A-Z0-9]+(?:-[A-Z0-9]+)*)\Z")
REQUIRED_SECTIONS = (
    "Binding",
    "Launch and readiness",
    "Doctor",
    "Stable paths",
    "Drive",
    "Evidence",
    "Isolation",
    "Cleanup",
)
RECIPE_KEYS = {
    "schema",
    "acceptance",
    "proof_class",
    "target",
    "scenario",
    "inputs",
    "evidence_form",
    "adapter",
    "fixtures",
    "dependencies",
    "isolation",
    "cleanup",
    "comparison",
}
DOCTOR_KEYS = {
    "schema",
    "recipe_id",
    "adapter",
    "target_environment",
    "action",
    "expected",
    "observed",
    "status",
    "disposable_resources",
    "continuing_instance",
    "cleanup",
    "evidence",
    "product_observation",
}


class ContractError(ValueError):
    """One stable validation failure."""

    def __init__(self, code: str) -> None:
        super().__init__(code)
        self.code = code


def _compact(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
    ).encode("utf-8")


def _digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _require_object(value: Any, keys: set[str], code: str) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != keys:
        raise ContractError(code)
    return value


def _require_text(value: Any, code: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ContractError(code)
    return value


def _require_sha256(value: Any, code: str) -> str:
    if not isinstance(value, str):
        raise ContractError(code)
    match = SHA256_RE.fullmatch(value)
    if match is None:
        raise ContractError(code)
    return f"sha256:{match.group(1)}"


def _load_json(text: str) -> Any:
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError) as exc:
        raise ContractError("invalid_json") from exc


def _frontmatter(text: str) -> tuple[dict[str, str], str]:
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        raise ContractError("missing_frontmatter")
    try:
        end = lines.index("---", 1)
    except ValueError as exc:
        raise ContractError("missing_frontmatter") from exc

    metadata: dict[str, str] = {}
    index = 1
    while index < end:
        line = lines[index]
        if not line or line[0].isspace() or ":" not in line:
            raise ContractError("invalid_frontmatter")
        key, raw_value = line.split(":", 1)
        value = raw_value.strip()
        if value in {">", "|"}:
            index += 1
            folded: list[str] = []
            while index < end and (not lines[index] or lines[index][0].isspace()):
                folded.append(lines[index].strip())
                index += 1
            value = " ".join(part for part in folded if part)
            metadata[key] = value
            continue
        metadata[key] = value
        index += 1
    return metadata, "\n".join(lines[end + 1 :])


def _validate_skill(root: Path, skill_bytes: bytes) -> str:
    try:
        text = skill_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise ContractError("skill_not_utf8") from exc
    metadata, body = _frontmatter(text)
    name = metadata.get("name")
    if name != root.name:
        raise ContractError("name_directory_mismatch")
    if not metadata.get("description"):
        raise ContractError("missing_description")
    if metadata.get("disable-model-invocation") != "true":
        raise ContractError("manual_invocation_required")
    headings = {line[3:] for line in body.splitlines() if line.startswith("## ")}
    if not set(REQUIRED_SECTIONS).issubset(headings):
        raise ContractError("missing_required_section")
    stable = body.split("## Stable paths", 1)[1]
    stable = stable.split("\n## ", 1)[0]
    real_paths = [
        line.strip()[2:].strip("`")
        for line in stable.splitlines()
        if line.strip().startswith("- ")
    ]
    if not any(
        "/" in path and "<" not in path and ">" not in path for path in real_paths
    ):
        raise ContractError("missing_stable_path")
    return root.name


def _raise_walk_error(error: OSError) -> None:
    raise ContractError("adapter_tree_unavailable") from error


def adapter_identity(root_value: str | os.PathLike[str]) -> dict[str, Any]:
    root = Path(root_value)
    try:
        root_lstat = root.lstat()
    except OSError as exc:
        raise ContractError("adapter_root_unavailable") from exc
    if stat.S_ISLNK(root_lstat.st_mode) or not stat.S_ISDIR(root_lstat.st_mode):
        raise ContractError("adapter_root_not_directory")
    root = root.resolve(strict=True)

    files: list[dict[str, str]] = []
    seen: set[str] = set()
    skill_bytes: bytes | None = None
    for current, directory_names, file_names in os.walk(
        root, onerror=_raise_walk_error, followlinks=False
    ):
        current_path = Path(current)
        for name in sorted(directory_names):
            child = current_path / name
            mode = child.lstat().st_mode
            if stat.S_ISLNK(mode) or not stat.S_ISDIR(mode):
                raise ContractError("adapter_tree_unsafe_entry")
            try:
                child.resolve(strict=True).relative_to(root)
            except (OSError, ValueError) as exc:
                raise ContractError("adapter_path_escape") from exc
        for name in sorted(file_names):
            child = current_path / name
            mode = child.lstat().st_mode
            if stat.S_ISLNK(mode) or not stat.S_ISREG(mode):
                raise ContractError("adapter_tree_unsafe_entry")
            try:
                resolved = child.resolve(strict=True)
                relative = resolved.relative_to(root).as_posix()
            except (OSError, ValueError) as exc:
                raise ContractError("adapter_path_escape") from exc
            if relative in seen:
                raise ContractError("adapter_duplicate_path")
            seen.add(relative)
            data = child.read_bytes()
            files.append({"path": relative, "sha256": _digest(data)})
            if relative == "SKILL.md":
                skill_bytes = data
    if skill_bytes is None:
        raise ContractError("missing_skill_file")
    name = _validate_skill(root, skill_bytes)
    files.sort(key=lambda item: item["path"])
    tree = {"schema": TREE_SCHEMA, "files": files}
    return {
        "schema": ADAPTER_SCHEMA,
        "uri": (root / "SKILL.md").as_uri(),
        "digest": f"sha256:{_digest(_compact(tree))}",
        "name": name,
        "tree": tree,
    }


def _canonical_binding(
    binding: Any, code: str, *, verify_adapter: bool
) -> dict[str, str]:
    binding = _require_object(binding, {"uri", "digest"}, code)
    uri = _require_text(binding["uri"], code)
    parsed = urlparse(uri)
    if (
        parsed.scheme != "file"
        or parsed.netloc not in {"", "localhost"}
        or not parsed.path.endswith("/SKILL.md")
        or parsed.params
        or parsed.query
        or parsed.fragment
    ):
        raise ContractError(code)
    digest = _require_sha256(binding["digest"], code)
    if verify_adapter:
        skill_path = Path(unquote(parsed.path))
        identity = adapter_identity(skill_path.parent)
        if identity["uri"] != uri or identity["digest"] != digest:
            raise ContractError("stale_adapter_binding")
    return {"uri": uri, "digest": digest}


def _canonical_manifest(value: Any, code: str) -> list[dict[str, str]]:
    if not isinstance(value, list):
        raise ContractError(code)
    result: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in value:
        item = _require_object(item, {"uri", "digest"}, code)
        uri = _require_text(item["uri"], code)
        digest = _require_sha256(item["digest"], code)
        if uri in seen:
            raise ContractError(code)
        seen.add(uri)
        result.append({"uri": uri, "digest": digest})
    return sorted(result, key=lambda item: (item["uri"], item["digest"]))


def _canonical_recipe(value: Any, *, verify_adapter: bool) -> dict[str, Any]:
    value = _require_object(value, RECIPE_KEYS, "recipe_fields_invalid")
    if value["schema"] != RECIPE_SCHEMA:
        raise ContractError("recipe_schema_invalid")
    acceptance = _require_object(
        value["acceptance"], {"id", "claim", "expected"}, "acceptance_invalid"
    )
    acceptance_id = _require_text(acceptance["id"], "acceptance_invalid")
    match = ACCEPTANCE_ID_RE.fullmatch(acceptance_id)
    if match is None:
        raise ContractError("acceptance_invalid")
    acceptance = {
        "id": acceptance_id,
        "claim": _require_text(acceptance["claim"], "acceptance_invalid"),
        "expected": _require_text(acceptance["expected"], "acceptance_invalid"),
    }
    target = _require_object(
        value["target"], {"surface", "environment"}, "target_invalid"
    )
    target = {
        "surface": _require_text(target["surface"], "target_invalid"),
        "environment": _require_text(target["environment"], "target_invalid"),
    }
    adapter: str | dict[str, str]
    if value["adapter"] == "none":
        adapter = "none"
    else:
        adapter = _canonical_binding(
            value["adapter"],
            "adapter_binding_invalid",
            verify_adapter=verify_adapter,
        )
    comparison: str | dict[str, Any]
    if value["comparison"] == "none":
        comparison = "none"
    else:
        comparison = _require_object(
            value["comparison"], {"baseline", "treatment"}, "comparison_invalid"
        )
        if comparison["baseline"] is None or comparison["treatment"] is None:
            raise ContractError("comparison_invalid")
    canonical = {
        "schema": RECIPE_SCHEMA,
        "acceptance": acceptance,
        "proof_class": _require_text(value["proof_class"], "proof_class_invalid"),
        "target": target,
        "scenario": value["scenario"],
        "inputs": value["inputs"],
        "evidence_form": value["evidence_form"],
        "adapter": adapter,
        "fixtures": _canonical_manifest(value["fixtures"], "fixtures_invalid"),
        "dependencies": _canonical_manifest(
            value["dependencies"], "dependencies_invalid"
        ),
        "isolation": value["isolation"],
        "cleanup": value["cleanup"],
        "comparison": comparison,
    }
    for key in ("scenario", "inputs", "evidence_form", "isolation", "cleanup"):
        if canonical[key] in (None, "", [], {}):
            raise ContractError(f"{key}_invalid")
    recipe_digest = _digest(_compact(canonical))
    return {
        "schema": RECIPE_SCHEMA,
        "identity": f"VR-{match.group(1)}@sha256:{recipe_digest}",
        "digest": f"sha256:{recipe_digest}",
        "recipe": canonical,
    }


def canonical_recipe(value: Any) -> dict[str, Any]:
    return _canonical_recipe(value, verify_adapter=True)


def _record_generation_binding(
    digests_by_uri: dict[str, str], binding: dict[str, str]
) -> None:
    uri = binding["uri"]
    digest = binding["digest"]
    existing = digests_by_uri.get(uri)
    if existing is not None and existing != digest:
        raise ContractError("recipe_generation_binding_conflict")
    digests_by_uri[uri] = digest


def validate_recipe_generation(
    acceptance_ids: list[str],
    recipes: list[dict[str, Any]],
    manifest_bindings: list[dict[str, str]],
) -> None:
    if not isinstance(acceptance_ids, list):
        raise ContractError("recipe_generation_acceptance_invalid")
    expected_acceptance: set[str] = set()
    for acceptance_id in acceptance_ids:
        if (
            not isinstance(acceptance_id, str)
            or ACCEPTANCE_ID_RE.fullmatch(acceptance_id) is None
            or acceptance_id in expected_acceptance
        ):
            raise ContractError("recipe_generation_acceptance_invalid")
        expected_acceptance.add(acceptance_id)

    if not isinstance(recipes, list):
        raise ContractError("recipe_generation_recipe_invalid")
    canonical_recipes: list[dict[str, Any]] = []
    actual_acceptance: list[str] = []
    for wrapper in recipes:
        try:
            wrapper = _require_object(
                wrapper,
                {"schema", "identity", "digest", "recipe"},
                "recipe_generation_recipe_invalid",
            )
            if wrapper["schema"] != RECIPE_SCHEMA:
                raise ContractError("recipe_generation_recipe_invalid")
            canonical = _canonical_recipe(wrapper["recipe"], verify_adapter=False)
            if wrapper != canonical:
                raise ContractError("recipe_generation_recipe_invalid")
        except (ContractError, TypeError, ValueError, OverflowError):
            raise ContractError("recipe_generation_recipe_invalid") from None
        canonical_recipes.append(canonical)
        actual_acceptance.append(canonical["recipe"]["acceptance"]["id"])

    if (
        len(actual_acceptance) != len(set(actual_acceptance))
        or set(actual_acceptance) != expected_acceptance
    ):
        raise ContractError("recipe_generation_coverage_invalid")

    digests_by_uri: dict[str, str] = {}
    for wrapper in canonical_recipes:
        recipe = wrapper["recipe"]
        if recipe["adapter"] != "none":
            _record_generation_binding(digests_by_uri, recipe["adapter"])
        for key in ("fixtures", "dependencies"):
            for binding in recipe[key]:
                _record_generation_binding(digests_by_uri, binding)

    if not isinstance(manifest_bindings, list):
        raise ContractError("recipe_generation_binding_invalid")
    for binding in manifest_bindings:
        try:
            binding = _require_object(
                binding,
                {"uri", "digest"},
                "recipe_generation_binding_invalid",
            )
            canonical_binding = {
                "uri": _require_text(
                    binding["uri"], "recipe_generation_binding_invalid"
                ),
                "digest": _require_sha256(
                    binding["digest"], "recipe_generation_binding_invalid"
                ),
            }
        except (ContractError, TypeError, ValueError):
            raise ContractError("recipe_generation_binding_invalid") from None
        _record_generation_binding(digests_by_uri, canonical_binding)


def canonical_doctor(value: Any) -> dict[str, Any]:
    value = _require_object(value, DOCTOR_KEYS, "doctor_fields_invalid")
    if value["schema"] != DOCTOR_SCHEMA:
        raise ContractError("doctor_schema_invalid")
    recipe_id = _require_text(value["recipe_id"], "doctor_recipe_invalid")
    if not re.fullmatch(r"VR-[A-Z0-9-]+@sha256:[0-9a-f]{64}", recipe_id):
        raise ContractError("doctor_recipe_invalid")
    adapter = _canonical_binding(
        value["adapter"], "doctor_adapter_invalid", verify_adapter=True
    )
    if value["status"] not in {"ready", "blocked"}:
        raise ContractError("doctor_status_invalid")
    receipt = dict(value)
    receipt["recipe_id"] = recipe_id
    receipt["adapter"] = adapter
    for key in DOCTOR_KEYS - {"schema", "recipe_id", "adapter", "status"}:
        if receipt[key] is None:
            raise ContractError(f"doctor_{key}_invalid")
    return receipt


def _self_test() -> dict[str, Any]:
    sample = {
        "schema": RECIPE_SCHEMA,
        "acceptance": {"id": "AC-SELF-01", "claim": "canonical", "expected": "stable"},
        "proof_class": "identity-check",
        "target": {"surface": "self-test", "environment": "process"},
        "scenario": "canonicalize twice",
        "inputs": "fixed",
        "evidence_form": "identity equality",
        "adapter": "none",
        "fixtures": [],
        "dependencies": [],
        "isolation": "process",
        "cleanup": "none",
        "comparison": "none",
    }
    first = canonical_recipe(sample)
    second = canonical_recipe(json.loads(json.dumps(sample)))
    if first != second:
        raise ContractError("self_test_unstable")
    return {
        "schema": "surface-verification-adapter-self-test/v1",
        "status": "pass",
        "checks": ["canonical-json", "recipe-identity", "no-mutation"],
    }


def _emit(value: Any) -> None:
    print(_compact(value).decode("utf-8"))


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate manual surface-verification adapter contracts."
    )
    parser.add_argument("--self-test", action="store_true")
    subparsers = parser.add_subparsers(dest="command")
    adapter_parser = subparsers.add_parser("adapter")
    adapter_parser.add_argument("--root", required=True)
    recipe_parser = subparsers.add_parser("recipe")
    recipe_parser.add_argument("--input", required=True)
    doctor_parser = subparsers.add_parser("doctor")
    doctor_parser.add_argument("--input", required=True)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    try:
        if args.self_test:
            if args.command is not None:
                raise ContractError("command_conflict")
            result = _self_test()
        elif args.command == "adapter":
            result = adapter_identity(args.root)
        elif args.command == "recipe":
            result = canonical_recipe(_load_json(args.input))
        elif args.command == "doctor":
            result = canonical_doctor(_load_json(args.input))
        else:
            raise ContractError("command_required")
    except ContractError as exc:
        _emit({"schema": ERROR_SCHEMA, "status": "error", "code": exc.code})
        return 2
    except (OSError, UnicodeError):
        _emit({"schema": ERROR_SCHEMA, "status": "error", "code": "io_error"})
        return 2
    _emit(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
