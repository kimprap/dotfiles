#!/usr/bin/env python3
"""Fail-closed provider-neutral Orchestrator Role Profile assessment."""

from __future__ import annotations

import argparse
import json
import os
import re
import stat
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

PROFILE_SCHEMA = "orchestrator-role-profile/v1"
ATTESTATION_SCHEMA = "orchestrator-attestation/v1"
ASSESSMENT_SCHEMA = "orchestrator-profile-assessment/v1"
CAPABILITIES = (
    "read",
    "write",
    "schedule",
    "delegate",
    "observe",
    "control",
    "handoff",
    "identity",
    "recovery",
)
CORE_CAPABILITIES = ("read", "write", "schedule", "handoff", "identity", "recovery")
CAPABILITY_STATES = {"native", "contract-equivalent", "unavailable"}
RUNTIME_FIELDS = (
    "identity",
    "harness_adapter",
    "model_selector",
    "model_selector_source",
    "model_resolved",
    "reasoning_level",
    "fallback",
)
LIMIT_FIELDS = (
    "max_child_depth",
    "max_concurrency",
    "isolation",
    "fan_in",
    "effects",
)
PRESERVES = (
    "acceptance",
    "assurance",
    "authority",
    "effects",
    "handoff-boundaries",
    "recovery",
    "task-contracts",
)
IDENTITY_PATHS = (
    "task_contract_sha256",
    "executor_plan_sha256",
    "authority_revision",
    *(f"runtime.{field}" for field in RUNTIME_FIELDS),
    "limits.isolation",
    "limits.fan_in",
    "limits.effects",
)
BOUND_PATHS = (
    "task_contract_sha256",
    "executor_plan_sha256",
    "authority_revision",
    *(f"runtime.{field}" for field in RUNTIME_FIELDS),
    *(f"capabilities.{field}" for field in CAPABILITIES),
    *(f"limits.{field}" for field in LIMIT_FIELDS),
)
HEX = re.compile(r"[0-9a-f]{64}")


class ProfileError(ValueError):
    pass


@dataclass(frozen=True)
class Assessment:
    decision: str
    mismatches: tuple[str, ...]
    profile_plan_sha256: str | None

    def payload(self) -> dict[str, object]:
        return {
            "decision": self.decision,
            "mismatches": list(self.mismatches),
            "profile_plan_sha256": self.profile_plan_sha256,
            "schema": ASSESSMENT_SCHEMA,
        }


def _mapping(value: object, field: str) -> Mapping[str, object]:
    if not isinstance(value, Mapping):
        raise ProfileError(f"{field} must be an object")
    return value


def _exact_keys(value: Mapping[str, object], expected: set[str], field: str) -> None:
    observed = set(value)
    if observed != expected:
        missing = sorted(expected - observed)
        unknown = sorted(observed - expected)
        raise ProfileError(
            f"{field} keys mismatch; missing={missing!r}; unknown={unknown!r}"
        )


def _text(value: object, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ProfileError(f"{field} must be a nonempty string")
    return value


def _at(document: Mapping[str, object], path: str) -> object:
    value: object = document
    for part in path.split("."):
        if not isinstance(value, Mapping) or part not in value:
            raise ProfileError(f"missing bound field {path}")
        value = value[part]
    return value


def _validate_common(
    document: Mapping[str, object], schema: str, *, profile: bool
) -> None:
    required = {
        "schema",
        "task_contract_sha256",
        "executor_plan_sha256",
        "authority_revision",
        "runtime",
        "capabilities",
        "limits",
        "evidence",
    }
    if profile:
        required.add("downgrade")
    _exact_keys(document, required, "document")
    if document["schema"] != schema:
        raise ProfileError(f"schema must be {schema}")
    for field in ("task_contract_sha256", "executor_plan_sha256"):
        value = _text(document[field], field)
        if not HEX.fullmatch(value):
            raise ProfileError(f"{field} must be 64 lowercase hexadecimal characters")
    _text(document["authority_revision"], "authority_revision")

    runtime = _mapping(document["runtime"], "runtime")
    _exact_keys(runtime, set(RUNTIME_FIELDS), "runtime")
    for field in RUNTIME_FIELDS:
        _text(runtime[field], f"runtime.{field}")
    if profile and runtime["fallback"] != "none":
        raise ProfileError("profile runtime.fallback must be none")

    capabilities = _mapping(document["capabilities"], "capabilities")
    _exact_keys(capabilities, set(CAPABILITIES), "capabilities")
    for field in CAPABILITIES:
        if capabilities[field] not in CAPABILITY_STATES:
            raise ProfileError(f"capabilities.{field} has an invalid state")
    if profile and any(capabilities[field] == "unavailable" for field in CAPABILITIES):
        raise ProfileError(
            "full-orchestration profile cannot declare an unavailable capability"
        )

    limits = _mapping(document["limits"], "limits")
    _exact_keys(limits, set(LIMIT_FIELDS), "limits")
    depth = limits["max_child_depth"]
    concurrency = limits["max_concurrency"]
    if not isinstance(depth, int) or isinstance(depth, bool) or depth < 0:
        raise ProfileError("limits.max_child_depth must be a nonnegative integer")
    if (
        not isinstance(concurrency, int)
        or isinstance(concurrency, bool)
        or concurrency < 1
    ):
        raise ProfileError("limits.max_concurrency must be a positive integer")
    if profile and (depth < 1 or concurrency < 2):
        raise ProfileError(
            "full-orchestration profile requires child depth at least 1 and concurrency at least 2"
        )
    for field in ("isolation", "fan_in", "effects"):
        _text(limits[field], f"limits.{field}")

    evidence = _mapping(document["evidence"], "evidence")
    _exact_keys(evidence, set(BOUND_PATHS), "evidence")
    for path in BOUND_PATHS:
        if evidence[path] not in {"live-attested", "documentation-inferred"}:
            raise ProfileError(f"evidence.{path} has an invalid source state")

    if profile:
        _validate_downgrade(document)


def _validate_downgrade(profile: Mapping[str, object]) -> None:
    value = profile["downgrade"]
    if value == "none":
        return
    downgrade = _mapping(value, "downgrade")
    _exact_keys(
        downgrade,
        {"mode", "approved", "executor_plan_sha256", "owner", "preserves"},
        "downgrade",
    )
    if downgrade["mode"] != "one-owner-sequential" or downgrade["approved"] is not True:
        raise ProfileError(
            "downgrade must be an approved one-owner-sequential projection"
        )
    if downgrade["executor_plan_sha256"] != profile["executor_plan_sha256"]:
        raise ProfileError("downgrade plan digest must match the bound Executor Plan")
    _text(downgrade["owner"], "downgrade.owner")
    preserves = downgrade["preserves"]
    if not isinstance(preserves, list) or tuple(preserves) != PRESERVES:
        raise ProfileError(
            "downgrade.preserves must equal the closed sorted preservation set"
        )


def _mismatches(
    profile: Mapping[str, object], attestation: Mapping[str, object]
) -> tuple[str, ...]:
    result: list[str] = []
    for path in BOUND_PATHS:
        expected = _at(profile, path)
        observed = _at(attestation, path)
        if expected != observed:
            result.append(f"{path}: expected {expected!r}, observed {observed!r}")
        profile_evidence = _mapping(profile["evidence"], "evidence")[path]
        observed_evidence = _mapping(attestation["evidence"], "evidence")[path]
        if profile_evidence != observed_evidence:
            result.append(
                f"evidence.{path}: expected {profile_evidence!r}, observed {observed_evidence!r}"
            )
        if profile_evidence != "live-attested" or observed_evidence != "live-attested":
            result.append(f"evidence.{path}: full orchestration requires live-attested")
    return tuple(dict.fromkeys(result))


def _approved_downgrade(profile: Mapping[str, object]) -> bool:
    return isinstance(profile["downgrade"], Mapping)


def _safe_downgrade(
    profile: Mapping[str, object], attestation: Mapping[str, object]
) -> bool:
    if not _approved_downgrade(profile):
        return False
    for path in IDENTITY_PATHS:
        if _at(profile, path) != _at(attestation, path):
            return False
        if _mapping(profile["evidence"], "evidence")[path] != "live-attested":
            return False
        if _mapping(attestation["evidence"], "evidence")[path] != "live-attested":
            return False
    for capability in CORE_CAPABILITIES:
        path = f"capabilities.{capability}"
        if (
            _at(profile, path) != _at(attestation, path)
            or _at(attestation, path) == "unavailable"
        ):
            return False
        if _mapping(profile["evidence"], "evidence")[path] != "live-attested":
            return False
        if _mapping(attestation["evidence"], "evidence")[path] != "live-attested":
            return False
    if _at(attestation, "runtime.fallback") != "none":
        return False
    return True


def assess(
    profile: Mapping[str, object], attestation: Mapping[str, object]
) -> Assessment:
    try:
        _validate_common(profile, PROFILE_SCHEMA, profile=True)
        _validate_common(attestation, ATTESTATION_SCHEMA, profile=False)
        mismatches = _mismatches(profile, attestation)
        capabilities = _mapping(attestation["capabilities"], "capabilities")
        if attestation["runtime"]["fallback"] != "none":
            mismatches = tuple(
                dict.fromkeys((*mismatches, "runtime.fallback: observed fallback"))
            )
        if any(capabilities[name] == "unavailable" for name in CAPABILITIES):
            mismatches = tuple(
                dict.fromkeys(
                    (
                        *mismatches,
                        *(
                            f"capabilities.{name}: unavailable"
                            for name in CAPABILITIES
                            if capabilities[name] == "unavailable"
                        ),
                    )
                )
            )
        if not mismatches:
            return Assessment(
                "full-orchestration", (), str(profile["executor_plan_sha256"])
            )
        if _safe_downgrade(profile, attestation):
            return Assessment(
                "one-owner-sequential", mismatches, str(profile["executor_plan_sha256"])
            )
        return Assessment(
            "transport-unavailable", mismatches, str(profile["executor_plan_sha256"])
        )
    except (KeyError, ProfileError, TypeError) as exc:
        plan_digest = profile.get("executor_plan_sha256")
        return Assessment(
            "transport-unavailable",
            (f"profile-integrity: {exc}",),
            plan_digest if isinstance(plan_digest, str) else None,
        )


def _read_document(path: Path) -> Mapping[str, object]:
    info = os.lstat(path)
    if stat.S_ISLNK(info.st_mode) or not stat.S_ISREG(info.st_mode):
        raise ProfileError(f"not a regular non-symlink file: {path}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ProfileError(f"unreadable JSON {path}: {exc}") from exc
    return _mapping(value, str(path))


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Assess an Orchestrator Role Profile")
    subparsers = parser.add_subparsers(dest="command", required=True)
    assess_parser = subparsers.add_parser("assess")
    assess_parser.add_argument("--profile", type=Path, required=True)
    assess_parser.add_argument("--attestation", type=Path, required=True)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    try:
        profile = _read_document(args.profile)
        attestation = _read_document(args.attestation)
        result = assess(profile, attestation)
    except (OSError, ProfileError) as exc:
        result = Assessment(
            "transport-unavailable", (f"profile-integrity: {exc}",), None
        )
    print(json.dumps(result.payload(), sort_keys=True, separators=(",", ":")))
    return (
        0 if result.decision in {"full-orchestration", "one-owner-sequential"} else 69
    )


if __name__ == "__main__":
    raise SystemExit(main())
