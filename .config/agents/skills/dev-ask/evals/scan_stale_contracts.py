#!/usr/bin/env python3
"""Detect stale generic-engineering workflow contracts and preservation drift."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any


SCHEMA = "lean-stale-scan/v1"
STALE_NEEDLES = [
    "standard is the fallback",
    "three semantic attempts",
    "three attempt task budget",
    "three semantic attempt ceiling",
    "no fourth attempt",
    "compact uses dev-implementation then dev-verification",
    "compact uses an ordered separate reviewer",
    "compact uses a separate ordered reviewer attempt after verified",
    "compact binds two ordered semantic attempts",
    "compact uses one fresh non-implementer identity for two ordered semantic attempts",
    "after compact review, the backend screens",
    "compact work reaches this skill only when",
    "compact dispatches learning only after",
    "through bounded work, smoke, independent verification, neutral fan in, review,",
    "lineage, integration, final, or high consequence boundary using fresh read only",
]
REQUIRED_NEEDLES = [
    "compact is the default",
    "two semantic attempts",
    "compact never dispatches",
    "dev-implementation then dev-ask completion presentation",
]
EXPECTED_DESCRIPTIONS = {
    ".config/agents/skills/dev-implementation/SKILL.md": (
        "Execute an approved direct contract or dependency-wired implementation tickets "
        "through bounded work, smoke, and evidence-backed completion. Profile-required "
        "independent verification, neutral fan-in, final review, and curation run only "
        "when the selected assurance profile or topology requires them. Defer compact "
        "Learning Candidates and own read-only backend lifecycle or terminal-evidence "
        "traces. Reject stale contracts; default cohesive work to one owner."
    ),
    ".config/agents/skills/dev-verification/SKILL.md": (
        "Independently verify declared acceptance criteria at an approved immutable target "
        "only when the selected assurance profile or topology requires independent "
        "verification. Use fresh read-only evidence; never repair, reformat, merge, or "
        "trust the implementer's conclusion."
    ),
}
CORE_SCAN_PATHS = [
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-handoff/SKILL.md",
    ".config/agents/skills/dev-verification/SKILL.md",
    ".config/agents/skills/dev-code-review/SKILL.md",
    ".config/agents/skills/dev-continual-learning/SKILL.md",
    "docs/adr/0001-dev-workflow-authority-and-routing.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/0003-bounded-assurance-and-repair.md",
    "docs/adr/0004-canonical-discovery-and-continual-learning.md",
    "docs/adr/INDEX.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-ask/evals/evals.json",
    ".config/agents/personas/planner/PERSONA.md",
]
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
PLANNER_SHA256 = "c22e40fa8f6f92572552c7666ae454e1f721589cd387a929df52374ae326c563"
PRESERVED = {
    ".agents/plans/2026-08-13-0119_dev-workflow-mechanical-convergence.md": "24f9059f6880b146aacabd3a4ae70e2a95a1937c7bcca1fdadde044c15170b4d",
    "/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-12T13-57-29-688Z_019ff643-8bd8-7000-bce5-45f639634afd/local/dev-workflow-mechanical-convergence-plan.md": "24f9059f6880b146aacabd3a4ae70e2a95a1937c7bcca1fdadde044c15170b4d",
    "docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md": "052806a41a605c81461edb5e38e1d504a3b59cc6029f697e4b1d9ad747e13246",
    ".config/agents/skills/dev-ask/evals/fixtures/l-mutation/counter.txt": "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
    ".agents/papercuts.json": "69aa97070cc5b1dca8b7487f301b1ba505d2cb29995c1bece4a73a3d807b8070",
    "/Users/kim/.agents/AGENTS.md": "1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9",
    ".agents/AGENTS.md": "840c44a316e5266ab38b9fe9784f6d32bad8b904dda82f2fdbc898e72b38ebe4",
    ".agents/GENERIC-AGENTS.md": "3ce780b05a9dbcd62aae05c3c4fbde39b8c7e05d72f074b2c4eaa51a92c6093c",
    "docs/adr/0005-product-development-workflow-and-prd-authority.md": "5c4978ccb225ea04a65dde02742c1b39c2366ef27ca848d73ee1a70a1624a9ff",
    "docs/adr/0008-repository-agent-integration-setup.md": "e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3",
    ".config/agents/skills/product-ask/WORKFLOW.md": "4c030c4641c50274c81a6b6bf6e5ca7c95d1fb4c3a78c054987ce9b643da6530",
    ".config/agents/skills/product-ask/SKILL.md": "8b29f210590abe1a91eba01c9faefedca9a6d27f4d04d75c3183865c672888c4",
    ".config/agents/skills/dev-shipping/SKILL.md": "0b472f2c25a0313e8efde1323f18e9b9e0a64a7b7f9e5e7f94d660e29fdb7966",
    ".config/agents/rules/papercut.md": "272b302f560178c560ccb014b31d860fc2d3386e71d9c504671ec7140f89dd4a",
    ".config/agents/skills/papercut/SKILL.md": "864385d73605107cc0a37b71d4639537c4d41e177874726d0ef3bb6c1bb9e311",
    ".config/agents/skills/papercut/scripts/papercut_ledger.py": "2c1d15522362d2aebcb1de58635dc8fa61454ebe6567d61f820f2b552f97e431",
    ".config/agents/skills/papercut/WORKFLOW.md": "e7123d22ab5e96c3d124f823524b49323c8fc8f00eb4935c67dcc2cf92009626",
    ".config/agents/skills/papercut/evals/evals.json": "46367562a028441fb207580c5e81043f35374d06d10744fe4f7b3cd508c37774",
}


class ScanError(RuntimeError):
    pass


def normalize(value: str) -> str:
    normalized = value.casefold().replace("`", "")
    for arrow in ("->", "→", "⇒"):
        normalized = normalized.replace(arrow, " then ")
    for separator in ("-", "–", "—", "_"):
        normalized = normalized.replace(separator, " ")
    return " ".join(normalized.split())


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repository_root() -> Path:
    return Path(__file__).resolve().parents[5]


def load_registry(root: Path) -> dict[str, dict[str, Any]]:
    path = root / ".config/agents/skills/dev-ask/evals/evals.json"
    try:
        registry = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ScanError(f"cannot parse registry: {error}") from error
    cases = registry.get("cases") if isinstance(registry, dict) else None
    if not isinstance(cases, list):
        raise ScanError("registry cases must be a list")
    result: dict[str, dict[str, Any]] = {}
    for case in cases:
        if not isinstance(case, dict) or not isinstance(case.get("id"), str):
            raise ScanError("registry contains a malformed case")
        if case["id"] in result:
            raise ScanError(f"duplicate case id: {case['id']}")
        result[case["id"]] = case
    return result


def scan_paths(root: Path) -> list[str]:
    cases = load_registry(root)
    expected_changed = REWRITE_IDS | ADDED_IDS
    missing = sorted(expected_changed - cases.keys())
    if missing:
        raise ScanError(f"changed fixture ids missing from registry: {missing}")
    fixture_paths: list[str] = []
    for case_id in sorted(expected_changed):
        fixture_dir = cases[case_id].get("fixture_dir")
        if not isinstance(fixture_dir, str):
            raise ScanError(f"fixture_dir missing for {case_id}")
        fixture_paths.append(
            f".config/agents/skills/dev-ask/evals/{fixture_dir}/case.json"
        )
    return CORE_SCAN_PATHS + fixture_paths


def heading(line: str) -> tuple[int, str] | None:
    match = re.match(r"^(#{1,6})\s+(.*?)\s*$", line)
    if not match:
        return None
    return len(match.group(1)), match.group(2)


def active_normalized_lines(lines: list[str]) -> list[tuple[int, str, str]]:
    active: list[tuple[int, str, str]] = []
    skipped_level: int | None = None
    for line_number, line in enumerate(lines, 1):
        parsed = heading(line)
        if parsed:
            level, text = parsed
            if skipped_level is not None and level <= skipped_level:
                skipped_level = None
            folded_heading = normalize(text)
            if (
                folded_heading == normalize("Rejected alternatives / why not")
                or folded_heading.startswith("historical")
            ):
                skipped_level = level
                continue
        if skipped_level is not None:
            continue
        folded = normalize(line)
        if "rejected alternative" in folded or "superseded by" in folded:
            continue
        active.append((line_number, folded, line))
    return active


def scan_text(path: str, text: str) -> tuple[list[dict[str, Any]], set[str]]:
    hits: list[dict[str, Any]] = []
    seen_required: set[str] = set()
    for line_number, folded, source in active_normalized_lines(text.splitlines()):
        for needle in STALE_NEEDLES:
            if normalize(needle) in folded:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": needle,
                        "text": source,
                    }
                )
        for needle in REQUIRED_NEEDLES:
            if normalize(needle) in folded:
                seen_required.add(needle)
    return hits, seen_required


def frontmatter_description(text: str) -> str | None:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    end = next((index for index in range(1, len(lines)) if lines[index].strip() == "---"), None)
    if end is None:
        return None
    for index in range(1, end):
        match = re.match(r"^description:\s*(.*)$", lines[index])
        if not match:
            continue
        value = match.group(1).strip()
        if value in (">", "|", ">-", "|-", ">+", "|+"):
            parts: list[str] = []
            for following in lines[index + 1 : end]:
                if following and not following[0].isspace():
                    break
                parts.append(following.strip())
            return " ".join(parts)
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            value = value[1:-1]
        return value
    return None


def scan_repository(root: Path) -> dict[str, Any]:
    hits: list[dict[str, Any]] = []
    required_seen: set[str] = set()
    paths = scan_paths(root)
    for relative in paths:
        path = root / relative
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            hits.append(
                {
                    "path": relative,
                    "line": 0,
                    "needle": "readable scanned path",
                    "text": str(error),
                }
            )
            continue
        path_hits, path_required = scan_text(relative, text)
        hits.extend(path_hits)
        required_seen.update(path_required)
        if relative in EXPECTED_DESCRIPTIONS:
            actual = frontmatter_description(text)
            if actual is None or normalize(actual) != normalize(EXPECTED_DESCRIPTIONS[relative]):
                hits.append(
                    {
                        "path": relative,
                        "line": 1,
                        "needle": "exact profile-aware frontmatter description",
                        "text": actual or "<missing>",
                    }
                )
    planner = root / ".config/agents/personas/planner/PERSONA.md"
    if planner.exists() and sha256_file(planner) != PLANNER_SHA256:
        hits.append(
            {
                "path": ".config/agents/personas/planner/PERSONA.md",
                "line": 0,
                "needle": f"sha256:{PLANNER_SHA256}",
                "text": f"sha256:{sha256_file(planner)}",
            }
        )
    missing_required = sorted(set(REQUIRED_NEEDLES) - required_seen)
    return {
        "schema": SCHEMA,
        "status": "pass" if not hits and not missing_required else "fail",
        "hits": hits,
        "missing_required": missing_required,
        "scanned": paths,
    }


def preserve_check(root: Path) -> dict[str, Any]:
    hits: list[dict[str, Any]] = []
    scanned: list[str] = []
    for raw, expected in PRESERVED.items():
        path = Path(raw) if Path(raw).is_absolute() else root / raw
        scanned.append(raw)
        try:
            actual = sha256_file(path)
        except OSError as error:
            hits.append(
                {"path": raw, "line": 0, "needle": expected, "text": str(error)}
            )
            continue
        if actual != expected:
            hits.append(
                {
                    "path": raw,
                    "line": 0,
                    "needle": expected,
                    "text": actual,
                }
            )
    return {
        "schema": SCHEMA,
        "status": "pass" if not hits else "fail",
        "hits": hits,
        "missing_required": [],
        "scanned": scanned,
    }


def description_matches(path: str, value: str) -> bool:
    expected = EXPECTED_DESCRIPTIONS[path]
    return normalize(value) == normalize(expected)


def run_selftest(root: Path) -> dict[str, Any]:
    checks: list[str] = []
    current_router = (root / ".config/agents/skills/dev-ask/SKILL.md").read_text(
        encoding="utf-8"
    )
    compact_line = next(
        (
            line
            for line in current_router.splitlines()
            if "Compact uses `dev-implementation` then `dev-ask completion presentation`" in line
        ),
        None,
    )
    if compact_line is None:
        raise ScanError("current compact arrow-form source sentence is unavailable")
    for needle in STALE_NEEDLES:
        source = needle
        if needle == "compact uses dev-implementation then dev-verification":
            source = compact_line.replace(
                "`dev-ask completion presentation`", "`dev-verification`"
            )
        hits, _ = scan_text("selftest", source)
        if len(hits) != 1 or hits[0]["needle"] != needle:
            raise ScanError(f"stale-needle self-test failed: {needle}")
        checks.append(f"stale:{needle}")
    all_required = "\n".join(REQUIRED_NEEDLES)
    hits, seen = scan_text("selftest", all_required)
    if hits or seen != set(REQUIRED_NEEDLES):
        raise ScanError("required-needle positive self-test failed")
    for omitted in REQUIRED_NEEDLES:
        source = "\n".join(item for item in REQUIRED_NEEDLES if item != omitted)
        hits, seen = scan_text("selftest", source)
        if hits or omitted in seen or seen != set(REQUIRED_NEEDLES) - {omitted}:
            raise ScanError(f"required-needle omission self-test failed: {omitted}")
        checks.append(f"required:{omitted}")
    old_implementation = (
        "Execute an approved direct contract or dependency-wired implementation tickets "
        "through bounded work, smoke, independent verification, neutral fan-in, review, "
        "curation, and evidence-backed completion."
    )
    old_verification = (
        "Independently verify declared acceptance criteria at an approved immutable lineage, "
        "integration, final, or high-consequence boundary using fresh read-only evidence."
    )
    for path, old in (
        (".config/agents/skills/dev-implementation/SKILL.md", old_implementation),
        (".config/agents/skills/dev-verification/SKILL.md", old_verification),
    ):
        other = next(value for key, value in EXPECTED_DESCRIPTIONS.items() if key != path)
        if description_matches(path, old):
            raise ScanError(f"unqualified description unexpectedly passed: {path}")
        if description_matches(path, other):
            raise ScanError(f"cross-bound description unexpectedly passed: {path}")
        if not description_matches(path, EXPECTED_DESCRIPTIONS[path]):
            raise ScanError(f"exact description unexpectedly failed: {path}")
        checks.append(f"description:{path}")
    exclusions = {
        "rejected-heading": "## Rejected alternatives / why not\nstandard is the fallback",
        "historical-heading": "### Historical context\nstandard is the fallback",
        "line-rejected-alternative": "Rejected alternative: standard is the fallback",
        "line-superseded-by": "standard is the fallback; superseded by D26",
    }
    for name, source in exclusions.items():
        hits, _ = scan_text("selftest", source)
        if hits:
            raise ScanError(f"exclusion self-test failed: {name}")
        checks.append(f"exclusion:{name}")
    return {
        "schema": "lean-stale-scan-selftest/v1",
        "status": "pass",
        "checks": checks,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--preserve", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    try:
        root = repository_root()
        if args.self_test:
            output = run_selftest(root)
        elif args.preserve:
            output = preserve_check(root)
        else:
            output = scan_repository(root)
        print(json.dumps(output, sort_keys=True))
        return 0 if output.get("status") == "pass" else 1
    except (ScanError, OSError, UnicodeError, json.JSONDecodeError) as error:
        output = {
            "schema": SCHEMA,
            "status": "fail",
            "hits": [
                {
                    "path": "<scanner>",
                    "line": 0,
                    "needle": "valid scanner execution",
                    "text": str(error),
                }
            ],
            "missing_required": [],
            "scanned": [],
        }
        print(json.dumps(output, sort_keys=True))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
