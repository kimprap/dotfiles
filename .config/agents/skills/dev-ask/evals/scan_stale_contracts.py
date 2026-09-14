#!/usr/bin/env python3
"""Scan current lean workflow surfaces for replaced active contracts."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

SCHEMA = "lean-stale-scan/v2"
SELFTEST_SCHEMA = "lean-stale-scan-selftest/v2"
PRESERVE_SCHEMA = "lean-stale-preserve/v2"

ACTIVE_PATHS = (
    ".agents/AGENTS.md",
    ".config/agents/rules/canonical-project-contracts.md",
    ".config/agents/rules/papercut.md",
    ".config/agents/rules/plan.md",
    ".config/agents/rules/plan-impl-spec.md",
    ".config/agents/rules/plan-repo-storage.md",
    ".config/agents/rules/plan-omp-transport.md",
    ".config/agents/rules/plan-grok-transport.md",
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-ask/references/execution-flow.md",
    ".config/agents/skills/dev-ask/evals/evals.json",
    ".config/agents/references/impl-rethink/recovery-rethink.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/plan-orchestration.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-implementation/references/test-value.md",
    ".config/agents/skills/dev-implementation/references/execution-recovery.md",
    ".config/agents/skills/dev-implementation/scripts/executor_plan.py",
    ".config/agents/skills/dev-handoff/SKILL.md",
    ".config/agents/skills/dev-code-review/SKILL.md",
    ".config/agents/skills/dev-code-review/references/review-rethink.md",
    ".config/agents/skills/dev-verification/SKILL.md",
    ".config/agents/skills/dev-verification/evals/evals.json",
    ".config/agents/skills/dev-integration/SKILL.md",
    ".config/agents/skills/dev-test-audit/SKILL.md",
    ".config/agents/skills/dev-test-audit/references/audit-protocol.md",
    ".config/agents/skills/dev-test-audit/references/opinion-agent.md",
    ".config/agents/skills/papercut/SKILL.md",
    ".config/agents/skills/papercut/WORKFLOW.md",
    ".config/agents/skills/papercut/evals/evals.json",
    ".config/agents/skills/dev-continual-learning/SKILL.md",
    ".config/agents/skills/continual-learning/SKILL.md",
    ".config/agents/skills/continual-learning/WORKFLOW.md",
    ".config/agents/skills/continual-learning/evals/evals.json",
    ".config/agents/skills/completion-presentation/SKILL.md",
    ".config/agents/skills/completion-presentation/evals/evals.json",
    ".config/agents/skills/product-ask/SKILL.md",
    ".config/agents/skills/product-ask/WORKFLOW.md",
    ".config/agents/skills/product-ask/evals/evals.json",
    ".config/agents/skills/init-ask/SKILL.md",
    ".config/agents/skills/init-ask/evals/evals.json",
    ".config/agents/skills/craft-skill/SKILL.md",
    ".config/agents/skills/craft-skill/evals/evals.json",
    ".config/agents/harnesses/omp/extensions/plan-artifact-sync.js",
    "bin/omp-copy-plan-artifact",
    "docs/adr/0001-dev-workflow-authority-and-routing.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/0003-bounded-assurance-and-repair.md",
    "docs/adr/0004-canonical-discovery-and-continual-learning.md",
    "docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md",
    "docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md",
    "docs/adr/INDEX.md",
)

PROTECTED_PATHS = (
    ".config/agents/references/impl-rethink/MAINTENANCE.md",
    ".config/agents/harnesses/omp/config.yml",
    ".config/agents/skills/reconcile/SKILL.md",
    "docs/adr/0008-repository-agent-integration-setup.md",
)

STALE_NEEDLES = (
    "surface verification adapter",
    "create surface verification adapter",
    "maintain surface verification adapter",
    "surface proof recipe",
    "proof recipe",
    "worker closure",
    "generation map",
    "proof generation",
    "repair token",
    "continuation receipt",
    "review rerun",
    "post repair review",
    "review repeats",
    "common handoff",
    "role profile",
    "profile tail",
    "key artifacts",
    "twelve field completion",
    "twelve key completion",
    "automatic plan archival",
    "automatically archive",
    "archive postcondition",
    "archive receipt",
    "archive only transport",
    "model grader",
    "model scored proof",
    "dev verification then dev code review",
)

RETIRED_FIELD_PATTERNS = (
    (
        "change scope",
        re.compile(
            r"^(?:\*\*|__|`|[\"'])?change[\s_-]+scope"
            r"(?:\*\*|__|`|[\"'])?\s*(?::|$)",
            re.IGNORECASE,
        ),
    ),
    (
        "resume from",
        re.compile(
            r"^(?:\*\*|__|`|[\"'])?resume[\s_-]+from"
            r"(?:\*\*|__|`|[\"'])?\s*(?::|$)",
            re.IGNORECASE,
        ),
    ),
)

NEGATIVE_TREATMENT = re.compile(
    r"\b(?:remove|removed|removes|reject|rejected|forbid|forbidden|"
    r"prohibit|prohibited|obsolete|absent|historical|superseded|"
    r"replaced|replaces|ineligible|invalid)\b"
)
NEGATING_ACTION = re.compile(
    r"\b(?:never|do not|does not|must not|cannot)\b.*"
    r"\b(?:use|require|create|load|invoke|retain|accept|interpret|emit|"
    r"carry|include|store|produce|depend|trust|run|dispatch|read|write)\b"
)
SOURCE_TREATMENT = re.compile(
    r"\buse\s*:\s*(?:adopted|adapted|caution|rejected|superseded)\b"
)


def allowed_negative_context(normalized: str, needle: str) -> bool:
    before, separator, after = normalized.partition(needle)
    if not separator:
        return False
    if NEGATIVE_TREATMENT.search(before) or NEGATIVE_TREATMENT.search(after):
        return True
    if re.search(r"\b(?:no|without)\b", before):
        return True
    return bool(NEGATING_ACTION.search(before))


def retired_field_match(raw: str, pattern: re.Pattern[str]) -> bool:
    candidate = re.sub(r"^\s*(?:#{1,6}|[-+*])\s+", "", raw, count=1)
    return bool(pattern.match(candidate.strip()))


@dataclass(frozen=True)
class Requirement:
    name: str
    path: str
    alternatives: tuple[str, ...]


REQUIRED_PROJECTIONS = (
    Requirement(
        "child-owned-code",
        ".config/agents/skills/dev-implementation/SKILL.md",
        ("every code changing task belongs to a child",),
    ),
    Requirement(
        "same-child-rethink",
        ".config/agents/skills/dev-implementation/SKILL.md",
        ("send ~/.agents/references/impl rethink/impl rethink.md explicitly to that same child",),
    ),
    Requirement(
        "code-then-test-rethink",
        ".config/agents/skills/dev-implementation/SKILL.md",
        ("the child applies code rethink, then test rethink",),
    ),
    Requirement(
        "standard-owner-order",
        ".config/agents/skills/dev-ask/SKILL.md",
        ("dev implementation then dev code review then dev verification then dev continual learning then completion presentation",),
    ),
    Requirement(
        "review-before-verification",
        ".config/agents/skills/dev-code-review/SKILL.md",
        ("the review must precede verification",),
    ),
    Requirement(
        "same-verifier-closure",
        ".config/agents/skills/dev-verification/SKILL.md",
        ("the same verifier receives the repaired target",),
    ),
    Requirement(
        "audit-a-first",
        ".config/agents/skills/dev-test-audit/SKILL.md",
        ("a first orchestration",),
    ),
    Requirement(
        "audit-first-return-rethink",
        ".config/agents/skills/dev-test-audit/SKILL.md",
        ("first return only rethink",),
    ),
    Requirement(
        "papercut-all-results",
        ".config/agents/skills/papercut/SKILL.md",
        ("return every qualifying result",),
    ),
    Requirement(
        "papercut-stable-order",
        ".config/agents/skills/papercut/SKILL.md",
        ("for each distinct qualifying root cause",),
    ),
    Requirement(
        "learning-once-after-assurance",
        ".config/agents/skills/dev-continual-learning/SKILL.md",
        ("exactly once after the one dev code review and a final verified result",),
    ),
    Requirement(
        "learning-blocker-threshold",
        ".config/agents/skills/dev-continual-learning/SKILL.md",
        ("stop completion only when the assessment establishes a current governing rule conflict",),
    ),
    Requirement(
        "five-field-presenter",
        ".config/agents/skills/completion-presentation/SKILL.md",
        ("exactly these five top level keys in this order",),
    ),
    Requirement(
        "active-done-plan",
        ".config/agents/skills/dev-ask/SKILL.md",
        ("require the current active repository plan to be done",),
    ),
    Requirement(
        "product-five-field-caller",
        ".config/agents/skills/product-ask/SKILL.md",
        (
            "exactly these five top level keys in this order",
            "with these five top level keys in this exact order",
        ),
    ),
    Requirement(
        "journal-convention-owner",
        ".config/agents/skills/craft-skill/SKILL.md",
        ("craft skill alone owns the optional hybrid maintenance.md convention",),
    ),
    Requirement(
        "d23-map-and-journal",
        "docs/adr/0004-canonical-discovery-and-continual-learning.md",
        ("d23 human map and maintenance provenance",),
    ),
    Requirement(
        "journal-nonruntime-rule",
        ".config/agents/rules/canonical-project-contracts.md",
        ("maintenance journals are provenance",),
    ),
)


def normalize(value: str) -> str:
    value = value.casefold().replace("`", "")
    value = value.replace("→", " then ").replace("->", " then ").replace("⇒", " then ")
    value = re.sub(r"[-–—_]", " ", value)
    return " ".join(value.split())


def repository_root() -> Path:
    return Path(__file__).resolve().parents[5]


def relative(root: Path, path: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def exclusion_reason(path: str) -> str | None:
    folded = path.casefold()
    if "/reconcile/" in f"/{folded}":
        return "custom-controller"
    if folded.startswith(".agents/plans/archive/") or "/archive/" in folded:
        return "historical-archive"
    if folded.endswith("/maintenance.md"):
        return "maintenance-provenance"
    if folded.endswith("docs/adr/0006-generic-papercut-evidence.md"):
        return "superseded-adr"
    if folded.endswith("docs/adr/0008-repository-agent-integration-setup.md"):
        return "protected-adr"
    if folded.endswith("scan_stale_contracts.py"):
        return "scanner-source"
    return None


def referenced_fixture_paths(root: Path) -> tuple[list[Path], list[str]]:
    registry_path = root / ".config/agents/skills/dev-ask/evals/evals.json"
    missing: list[str] = []
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        return [], [f"eval-registry: {error}"]
    cases = registry.get("cases")
    if not isinstance(cases, list):
        return [], ["eval-registry: cases must be a list"]
    paths: list[Path] = []
    for index, case in enumerate(cases):
        if not isinstance(case, dict) or not isinstance(case.get("fixture_dir"), str):
            missing.append(f"eval-registry: malformed fixture_dir at case {index}")
            continue
        fixture = registry_path.parent / case["fixture_dir"] / "case.json"
        paths.append(fixture)
    return paths, missing


def scan_paths(root: Path) -> tuple[list[Path], list[str]]:
    paths = [root / item for item in ACTIVE_PATHS]
    fixtures, missing = referenced_fixture_paths(root)
    paths.extend(fixtures)
    unique: dict[str, Path] = {}
    for path in paths:
        try:
            key = relative(root, path)
        except (OSError, ValueError):
            missing.append(f"unsafe-path: {path}")
            continue
        if exclusion_reason(key) is None:
            unique[key] = path
    return [unique[key] for key in sorted(unique)], missing


def scan_text(path: str, text: str) -> list[dict[str, object]]:
    hits: list[dict[str, object]] = []
    negative_section = False
    for line_number, raw in enumerate(text.splitlines(), start=1):
        normalized = normalize(raw)
        if raw.lstrip().startswith("#"):
            negative_section = any(
                heading in normalized
                for heading in (
                    "rejected alternatives",
                    "historical context",
                    "source treatment",
                )
            )
        for needle in STALE_NEEDLES:
            if (
                needle in normalized
                and not negative_section
                and not SOURCE_TREATMENT.search(normalized)
                and not allowed_negative_context(normalized, needle)
            ):
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": needle,
                        "text": raw.strip(),
                    }
                )
        for needle, pattern in RETIRED_FIELD_PATTERNS:
            if (
                retired_field_match(raw, pattern)
                and not negative_section
                and not SOURCE_TREATMENT.search(normalized)
                and not allowed_negative_context(normalized, needle)
            ):
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": needle,
                        "text": raw.strip(),
                    }
                )
    return hits


def required_missing(texts: dict[str, str]) -> list[str]:
    missing: list[str] = []
    for requirement in REQUIRED_PROJECTIONS:
        text = texts.get(requirement.path)
        if text is None:
            missing.append(f"{requirement.name}: missing path {requirement.path}")
            continue
        normalized = normalize(text)
        if not any(normalize(needle) in normalized for needle in requirement.alternatives):
            missing.append(f"{requirement.name}: {requirement.path}")
    return missing


def scan_repository(root: Path) -> dict[str, object]:
    paths, missing = scan_paths(root)
    texts: dict[str, str] = {}
    hits: list[dict[str, object]] = []
    scanned: list[str] = []
    for path in paths:
        rel = relative(root, path)
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            missing.append(f"unreadable: {rel}: {error}")
            continue
        texts[rel] = text
        scanned.append(rel)
        hits.extend(scan_text(rel, text))
    missing.extend(required_missing(texts))
    return {
        "schema": SCHEMA,
        "status": "pass" if not hits and not missing else "fail",
        "hits": hits,
        "missing_required": missing,
        "scanned": scanned,
        "excluded": [
            "Reconcile custom-controller files",
            "historical plan archives",
            "superseded ADR-0006",
            "protected ADR-0008",
            "append-only MAINTENANCE.md provenance",
            "scanner source",
        ],
    }


def synthetic_required_texts() -> dict[str, str]:
    texts: dict[str, str] = {}
    for requirement in REQUIRED_PROJECTIONS:
        texts.setdefault(requirement.path, "")
        texts[requirement.path] += requirement.alternatives[0] + "\n"
    return texts


def run_selftest() -> dict[str, object]:
    failures: list[str] = []
    for needle in STALE_NEEDLES:
        if not scan_text("active.md", f"Current runtime uses {needle}."):
            failures.append(f"stale needle not detected: {needle}")
        if scan_text("active.md", f"The removed {needle} is never runtime authority."):
            failures.append(f"negative context not excluded: {needle}")
    if not scan_text("active.md", "Do not omit the repair token."):
        failures.append("negative wording hid an active stale requirement")
    if scan_text("active.md", "Do not use the repair token."):
        failures.append("direct stale prohibition was not excluded")
    if scan_text(
        "active.md",
        "## Rejected alternatives\n\n- A proof recipe duplicates direct checks.\n",
    ):
        failures.append("rejected-alternatives section was not excluded")
    if scan_text(
        "active.md",
        "Source | Use: caution | Treatment: proof recipe rejected locally",
    ):
        failures.append("source-treatment row was not excluded")
    near_miss_cases = {
        "change-scope prose": (
            "Do not reload rethink, change scope, create a side protocol, "
            "or repeat an already returned proposal."
        ),
        "resume-from prose": (
            "Recovery can resume from the active plan and accepted Handoffs."
        ),
    }
    for name, sample in near_miss_cases.items():
        if scan_text("active.md", sample):
            failures.append(f"ordinary prose was treated as a retired field: {name}")
    retired_field_cases = {
        "change scope": "**Change scope:** repository paths",
        "resume from": "### Resume from",
    }
    for needle, sample in retired_field_cases.items():
        if not any(
            hit["needle"] == needle for hit in scan_text("active.md", sample)
        ):
            failures.append(f"retired field was not detected: {needle}")
    exclusion_samples = {
        ".config/agents/skills/reconcile/SKILL.md": "custom-controller",
        ".agents/plans/archive/history.md": "historical-archive",
        ".config/agents/references/impl-rethink/MAINTENANCE.md": "maintenance-provenance",
        "docs/adr/0006-generic-papercut-evidence.md": "superseded-adr",
        "docs/adr/0008-repository-agent-integration-setup.md": "protected-adr",
        ".config/agents/skills/dev-ask/evals/scan_stale_contracts.py": "scanner-source",
    }
    for path, expected in exclusion_samples.items():
        if exclusion_reason(path) != expected:
            failures.append(f"exclusion mismatch: {path}")
    texts = synthetic_required_texts()
    if required_missing(texts):
        failures.append("synthetic required projection set did not pass")
    product = next(
        requirement
        for requirement in REQUIRED_PROJECTIONS
        if requirement.name == "product-five-field-caller"
    )
    product_texts = synthetic_required_texts()
    product_texts[product.path] = (
        "Construct exactly one current fenced completion-presentation-input JSON "
        "object with these five top-level keys in this exact order."
    )
    if any(
        item.startswith(product.name) for item in required_missing(product_texts)
    ):
        failures.append("current product five-field projection was not accepted")
    first = REQUIRED_PROJECTIONS[0]
    texts[first.path] = texts[first.path].replace(first.alternatives[0], "", 1)
    if not any(item.startswith(first.name) for item in required_missing(texts)):
        failures.append("missing required projection was not detected")
    return {
        "schema": SELFTEST_SCHEMA,
        "status": "pass" if not failures else "fail",
        "failures": failures,
        "stale_cases": len(STALE_NEEDLES) + len(RETIRED_FIELD_PATTERNS),
        "required_cases": len(REQUIRED_PROJECTIONS),
        "exclusion_cases": len(exclusion_samples),
    }


def preserve_report(root: Path) -> dict[str, object]:
    missing = [path for path in PROTECTED_PATHS if not (root / path).exists()]
    active_plans = sorted(
        path.relative_to(root).as_posix()
        for path in (root / ".agents/plans").glob("*.md")
        if path.is_file()
    )
    return {
        "schema": PRESERVE_SCHEMA,
        "status": "pass" if not missing else "fail",
        "protected": list(PROTECTED_PATHS),
        "active_plans": active_plans,
        "missing": missing,
        "note": "Protection is enforced by scan exclusion and the final changed-path comparison; no frozen digest ledger is embedded.",
    }


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    result.add_argument("--preserve", action="store_true")
    result.add_argument("--self-test", action="store_true")
    return result


def main() -> int:
    args = parser().parse_args()
    if args.self_test and args.preserve:
        output: dict[str, object] = {
            "schema": SELFTEST_SCHEMA,
            "status": "fail",
            "failures": ["choose only one mode"],
        }
    elif args.self_test:
        output = run_selftest()
    elif args.preserve:
        output = preserve_report(repository_root())
    else:
        output = scan_repository(repository_root())
    print(json.dumps(output, ensure_ascii=False, sort_keys=True))
    return 0 if output.get("status") == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
