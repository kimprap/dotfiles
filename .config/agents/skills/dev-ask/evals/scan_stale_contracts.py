#!/usr/bin/env python3
"""Detect stale generic-engineering workflow contracts and preservation drift."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
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
    "planner-role-profile/v4",
    "canonical planner persona/projector",
    "When dispatching the canonical planner, also read",
    "wording mismatch is a same-outcome blocker",
    "rerun every parent criterion after repair",
    "advisory repair restarts verification",
    "review finding becomes a parent criterion",
    "Do not create a curation task, Handoff, trigger screen",
    "Every task has one implementation owner, output, receiver, target, acceptance criterion, and proof recipe",
    "Standard and high-consequence plans require a numbered profile tail",
    "A compact plan may include a profile tail",
    "Task Intent is optional",
    "Methods accepts ponytail",
    "Papercut capture schedules continual learning",
]
REQUIRED_NEEDLES = [
    "compact is the default",
    "two semantic attempts",
    "compact never dispatches",
    "dev-implementation then dev-ask completion presentation",
    "observable changed-contract consumer",
    "complete causal impact map",
    "terminal residual risk",
    "new maintenance outcome",
    "one in-conversation worker Common Handoff",
    "curation Handoff",
    "one short human Intent sentence",
    "Methods: none | tdd",
    "may omit the numbered profile tail or append one exact final suffix",
    "compact work may use a direct Task Contract without an Executor Plan",
    "Methods: tdd is explicit test-first authority",
    "After every work-task Common Handoff is emitted, apply this rule exactly once as a soft look",
    "No candidate means no skill or ledger access and no papercut output",
    "dispatches no learning",
    "Papercut is never a task, Methods token",
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
    ".config/agents/rules/plan.md",
    ".config/agents/rules/plan-impl-spec.md",
    ".config/agents/rules/papercut.md",
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-handoff/SKILL.md",
    ".config/agents/skills/dev-tdd/SKILL.md",
    ".config/agents/skills/dev-verification/SKILL.md",
    ".config/agents/skills/dev-code-review/SKILL.md",
    ".config/agents/skills/dev-continual-learning/SKILL.md",
    ".config/agents/skills/papercut/SKILL.md",
    ".config/agents/skills/papercut/WORKFLOW.md",
    ".config/agents/skills/papercut/evals/evals.json",
    "docs/adr/0001-dev-workflow-authority-and-routing.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/0003-bounded-assurance-and-repair.md",
    "docs/adr/0004-canonical-discovery-and-continual-learning.md",
    "docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md",
    "docs/adr/INDEX.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-ask/evals/evals.json",
]
REWRITE_IDS = {
    "B-COMPACT",
    "B-COMPACT-CURATION-TRIGGER",
    "B-T4-REPAIR-REMAINING-BLOCKER",
    "R-COMPLETE-COMPACT-NO-LEARNING",
}
ADDED_IDS = {
    "B-COMPACT-PLAN-NO-TAIL",
    "B-PLAN-TAIL-OMITTED",
    "B-PLAN-TAIL-PROFILE",
    "B-T4-CHECKPOINT-PROOF-CLOSE",
    "B-T4-COMPACT-WORTH-NOT-TRIGGERED",
    "B-T4-REVISION-WORTH-OPINION",
    "B-TASK-METHOD-TDD",
    "R-COMPACT-PLAN-WITH-TAIL",
}
CHECKPOINT_CASE_IDS = (
    "B-T4-REPAIR-REMAINING-BLOCKER",
    "B-T4-CHECKPOINT-PROOF-CLOSE",
    "B-T4-REVISION-WORTH-OPINION",
    "B-T4-COMPACT-WORTH-NOT-TRIGGERED",
)
CHECKPOINT_RECORD_PREFIXES = (
    "- exhausted ",
    "  - trying: ",
    "  - found: ",
    "  - tried: ",
    "  - target: ",
    "  - remaining: ",
    "  - grant: ",
    "  - opinion: ",
)
CHECKPOINT_SCOPE_HEADINGS = (
    (
        "docs/adr/0003-bounded-assurance-and-repair.md",
        "### D03 — Post-assurance repair",
        "### D04 — Assurance boundaries",
    ),
    (
        ".config/agents/skills/dev-implementation/SKILL.md",
        "## Consolidated post-assurance repair",
        None,
    ),
    (
        ".config/agents/skills/dev-ask/WORKFLOW.md",
        "## Engine reference",
        "## Skill catalog",
    ),
    (
        ".config/agents/skills/dev-handoff/SKILL.md",
        "## Intake",
        None,
    ),
)
CHECKPOINT_FORBIDDEN_NEEDLES = (
    "--model",
    "model selector:",
    "reasoning level:",
    "reasoning_effort",
    "provider=openai",
    "provider=anthropic",
    "provider=xai",
    "omp run",
    "grok run",
)
PRESERVED = {
    ".config/agents/skills/dev-ask/evals/fixtures/l-mutation/counter.txt": "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
    ".agents/papercuts.json": "c7a2b0741028aeb5692656b98f08908de828e9881379ecf7744bbf6879cfad44",
    "/Users/kim/.agents/AGENTS.md": "1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9",
    ".config/agents/AGENTS.md": "1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9",
    ".agents/AGENTS.md": "840c44a316e5266ab38b9fe9784f6d32bad8b904dda82f2fdbc898e72b38ebe4",
    ".agents/GENERIC-AGENTS.md": "3ce780b05a9dbcd62aae05c3c4fbde39b8c7e05d72f074b2c4eaa51a92c6093c",
    ".config/agents/skills/dev-ask/SKILL.md": "ea9917411c115241b91edea9ce5821da3177a01390b897d79ac8ebd06062ef0c",
    ".config/agents/skills/papercut/scripts/papercut_ledger.py": "2c1d15522362d2aebcb1de58635dc8fa61454ebe6567d61f820f2b552f97e431",
    ".config/agents/skills/dev-continual-learning/SKILL.md": "6a6ccfae27da7ac20412029757ed05d16b9ba63d43bd50e6f4331565cb54d105",
    "docs/adr/0005-product-development-workflow-and-prd-authority.md": "5c4978ccb225ea04a65dde02742c1b39c2366ef27ca848d73ee1a70a1624a9ff",
    "docs/adr/0008-repository-agent-integration-setup.md": "e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3",
    ".config/agents/skills/product-ask/WORKFLOW.md": "4c030c4641c50274c81a6b6bf6e5ca7c95d1fb4c3a78c054987ce9b643da6530",
    ".config/agents/skills/product-ask/SKILL.md": "8b29f210590abe1a91eba01c9faefedca9a6d27f4d04d75c3183865c672888c4",
    ".config/agents/skills/dev-shipping/SKILL.md": "0b472f2c25a0313e8efde1323f18e9b9e0a64a7b7f9e5e7f94d660e29fdb7966",
    ".agents/plans/archive/2026-06-16-1608_skill-craft.md": "877a604d6e26d7a810e343a35c2ce1f160daef64666456795b33c24d684fddde",
    ".agents/plans/archive/2026-06-17-0005_IMPROVE_skill-craft.md": "97ee26d4bfb564e60ca7c9d948374640bab85853e8fa2de71813a3af63c4753a",
    ".agents/plans/archive/2026-06-29-1412_agent-harness-craft-skills.md": "20699baa5b51122b276e30f802bbe771a6568d8f3d715286e0a922d1e783ff62",
    ".agents/plans/archive/2026-07-09-1503_atlas-umbrella-scaffold.md": "27072beb3718b99f94ee69a3a60a07168c08fd2ddd248e4f81661b1f28b50574",
    ".agents/plans/archive/2026-07-13-1504_plan-rule-skill-refinement.md": "4ce06bb710f632dc4419822b07a57fa0eb68d8ae725dd3132101202e80097869",
    ".agents/plans/archive/2026-07-15-1018_directory-access-probe.md": "1e441982448ca643b1914e5337ec25f746464900d1254cb38ec573f339046fe2",
    ".agents/plans/archive/2026-07-16-1445_migrate-workspaces-to-dev.md": "cbc3de411f0094ce4b16c5c0adf1c7c47ed078c2b89b77d972690eb08f081d73",
    ".agents/plans/archive/2026-07-26-1752_sync-matt-skills-wayfinder.md": "5f99c251266782bf9bde632a00633ae116c1e700107e7cd7af5ad4b783852ebb",
    ".agents/plans/archive/2026-07-28-0033_chart-agent-workflow-map.md": "611474f8a4dc5669b38bdb591a9cd09a6de768ca78caf2997fe231a8b86a8d34",
    ".agents/plans/archive/2026-07-28-2309_eng-flow-implementation.md": "9c62737b95cc90a1deefa668c26901a0d90cc144dfb90cb5dfa0fdfd3d2ff90e",
    ".agents/plans/archive/2026-07-30-1356_IMPROVE_standard.md": "2ba0fa24e556225eef1ac7e0caade2b669eefa98b028765dd410710ae1887309",
    ".agents/plans/archive/2026-07-30-2344_refine-workflow-prefix-naming.md": "224743e0c4099934273f4c599f44c5109e68545f43dca8fe101f6590f3da9021",
    ".agents/plans/archive/2026-07-31-0024_rename-engineering-skills-to-dev.md": "320e545a6513dfa68f6f3fec51fbad99366b7611a7c4b5d50dc9e31684372b2f",
    ".agents/plans/archive/2026-07-31-1231_rename-dev-flow-interface.md": "db7c0269c1e2913cdae5cc0ad71bfa9b4749efcd4bcdd49056270c4c0e30ec78",
    ".agents/plans/archive/2026-07-31-1523_proportional-dev-workflow.md": "19eda4f15d386b806e7f3be699f0d41c8e8484f7f02c0fcc7a399ebd8fd4f7f8",
    ".agents/plans/archive/2026-08-09-1616_dev-workflow-convergence-refinement.md": "7056607c7c486772a7ad98de75655d028f1552b8d88bb2989ea1eb442fde56b8",
    ".agents/plans/archive/2026-08-12-0107_self-improving-evaluation-papercuts.md": "ed39b611624835aab4e8a82d580ed6cbbc5571e8bc96e74cbdde6e6fd7093677",
    ".agents/plans/archive/2026-08-12-2202_automated-papercut-lifecycle-init-ask.md": "79c00f11b8cbaf48db42337d2d0119b159dce8125aec17caa19883a0ab82aadb",
    ".agents/plans/archive/2026-08-13-0119_dev-workflow-mechanical-convergence.md": "b665889323a832cb01be64537567a36e08f741da9fbb3015daa3b77338f99470",
    ".agents/plans/archive/2026-08-13-1230_IMPROVE_standard.md": "740d596b09db3a7bd93dc9dbb4ede7753e3ed9edb01647b7c6cc014da23c9373",
    ".agents/plans/archive/2026-08-13-1603_dev-workflow-lean-ordinary-path.md": "da59251da8ac829554890bf701b718078187d63196627159195f831be3f525b7",
    ".agents/plans/archive/2026-08-15-1744_receipt-skill-digest-binding.md": "c6b775d9df918f7c369b4ef972c734aa0f0834a576688a7d3b4ffd152e848ce1",
    ".agents/plans/archive/2026-08-16-1459_restore-pre-prep-lean-tree.md": "e16601cc982feb2363d4ec3e9b37365e5d03406e42317b81760566926e244072",
    ".agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md": "512b29347572a2aef557a905f8a768e61675fec4127feeced34488bcb44fb375",
    ".agents/plans/archive/2026-08-17-1428_assurance-relevance-and-proof-scope.md": "1f5601782b72e3757c49161be3ccf0b3ab4a25694cf4c46e11df44eb2ba25eee",
    ".agents/plans/archive/2026-08-17-2347_rethink-skill.md": "c6331688fa99878987726cd9316b66577ad5d5061b5a83b51638af9f811534e2",
    ".agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md": "bdf7a7432ecec22f5bb51e5e7b66ef2d39461b0086e116b621cc25d9fd057755",
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


def checkpoint_contract_hits(
    root: Path, cases: dict[str, dict[str, Any]]
) -> list[dict[str, Any]]:
    hits: list[dict[str, Any]] = []
    frame_prefixes = (
        "remaining stable IDs:",
        "relation to OUT-",
        "what already satisfies the goal:",
        "changed falsifiable hypothesis:",
        "recommendation:",
    )
    actions = ("Continue", "Second opinion", "Close")
    expected_frames = {
        "B-T4-REPAIR-REMAINING-BLOCKER": (2, "outcome-blocking"),
        "B-T4-CHECKPOINT-PROOF-CLOSE": (1, "proof-ceremony"),
        "B-T4-REVISION-WORTH-OPINION": (1, "proof-ceremony"),
        "B-T4-COMPACT-WORTH-NOT-TRIGGERED": (0, None),
    }
    record_cases = {
        "B-T4-REPAIR-REMAINING-BLOCKER",
        "B-T4-CHECKPOINT-PROOF-CLOSE",
    }

    for case_id in CHECKPOINT_CASE_IDS:
        case = cases.get(case_id)
        if case is None:
            hits.append(
                {
                    "path": "evals.json",
                    "line": 0,
                    "needle": "checkpoint case present",
                    "text": case_id,
                }
            )
            continue
        fixture_dir = case.get("fixture_dir")
        request = case.get("inputs", {}).get("request")
        events = case.get("required_events")
        if (
            not isinstance(fixture_dir, str)
            or not isinstance(request, str)
            or not isinstance(events, list)
            or any(not isinstance(event, str) for event in events)
        ):
            hits.append(
                {
                    "path": case_id,
                    "line": 0,
                    "needle": "well-formed checkpoint case",
                    "text": "missing fixture, request, or required events",
                }
            )
            continue

        fixture_path = (
            root / ".config/agents/skills/dev-ask/evals" / fixture_dir / "case.json"
        )
        try:
            fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
            fixture_request = fixture.get("inputs", {}).get("request")
        except (OSError, UnicodeError, json.JSONDecodeError) as error:
            hits.append(
                {
                    "path": str(fixture_path.relative_to(root)),
                    "line": 0,
                    "needle": "checkpoint request byte parity",
                    "text": str(error),
                }
            )
            fixture_request = None
        if not isinstance(fixture_request, str) or request.encode(
            "utf-8"
        ) != fixture_request.encode("utf-8"):
            hits.append(
                {
                    "path": case_id,
                    "line": 0,
                    "needle": "checkpoint request byte parity",
                    "text": "registry and fixture request differ",
                }
            )

        event_lines = [
            line
            for event in events
            for line in event.split("|output:", 1)[-1].splitlines()
        ]
        frames = 0
        for index, line in enumerate(event_lines):
            if not line.startswith(frame_prefixes[0]):
                continue
            frames += 1
            block = event_lines[index : index + 8]
            valid_prefixes = len(block) == 8 and all(
                block[offset].startswith(prefix)
                for offset, prefix in enumerate(frame_prefixes)
            )
            valid_actions = len(block) == 8 and tuple(block[5:8]) == actions
            relation = (
                block[1].rsplit(": ", 1)[-1]
                if len(block) > 1 and ": " in block[1]
                else ""
            )
            recommendation = (
                block[4].removeprefix(frame_prefixes[4]).strip()
                if len(block) > 4
                else ""
            )
            if (
                not valid_prefixes
                or not valid_actions
                or relation not in {"outcome-blocking", "proof-ceremony"}
                or recommendation
                not in {
                    "continue-differently",
                    "independent check",
                    "close with residual",
                }
            ):
                hits.append(
                    {
                        "path": case_id,
                        "line": 0,
                        "needle": "five-line worth frame",
                        "text": "\\n".join(block),
                    }
                )
            if index + 8 < len(event_lines) and event_lines[index + 8] in actions:
                hits.append(
                    {
                        "path": case_id,
                        "line": 0,
                        "needle": "exactly three checkpoint actions",
                        "text": event_lines[index + 8],
                    }
                )
        expected_count, expected_relation = expected_frames[case_id]
        if frames != expected_count:
            hits.append(
                {
                    "path": case_id,
                    "line": 0,
                    "needle": "five-line worth frame",
                    "text": f"expected {expected_count}, observed {frames}",
                }
            )
        for action in actions:
            if event_lines.count(action) != expected_count:
                hits.append(
                    {
                        "path": case_id,
                        "line": 0,
                        "needle": "exactly three checkpoint actions",
                        "text": (
                            f"{action}: expected {expected_count}, "
                            f"observed {event_lines.count(action)}"
                        ),
                    }
                )
        if expected_relation is not None:
            observed_relations = {
                line.rsplit(": ", 1)[-1]
                for line in event_lines
                if line.startswith(frame_prefixes[1]) and ": " in line
            }
            if observed_relations != {expected_relation}:
                hits.append(
                    {
                        "path": case_id,
                        "line": 0,
                        "needle": "checkpoint worth classification",
                        "text": repr(sorted(observed_relations)),
                    }
                )

        record_lines = (request + "\n" + "\n".join(events)).splitlines()
        records = 0
        for index, line in enumerate(record_lines):
            if not line.startswith(CHECKPOINT_RECORD_PREFIXES[0]):
                continue
            records += 1
            block = record_lines[index : index + len(CHECKPOINT_RECORD_PREFIXES)]
            valid = len(block) == len(CHECKPOINT_RECORD_PREFIXES) and all(
                block[offset].startswith(prefix)
                for offset, prefix in enumerate(CHECKPOINT_RECORD_PREFIXES)
            )
            ninth_field = index + len(CHECKPOINT_RECORD_PREFIXES) < len(
                record_lines
            ) and record_lines[index + len(CHECKPOINT_RECORD_PREFIXES)].startswith(
                "  - "
            )
            grant = (
                block[6].removeprefix(CHECKPOINT_RECORD_PREFIXES[6])
                if len(block) > 6
                else ""
            )
            valid_grant = grant == "pending" or bool(
                re.fullmatch(
                    r"(?:continue|second-opinion) \d{4}-\d{2}-\d{2}-\d{4}",
                    grant,
                )
            )
            if not valid or ninth_field or not valid_grant:
                hits.append(
                    {
                        "path": case_id,
                        "line": 0,
                        "needle": "exact eight-line checkpoint record",
                        "text": "\\n".join(
                            record_lines[
                                index : index + len(CHECKPOINT_RECORD_PREFIXES) + 1
                            ]
                        ),
                    }
                )
        if case_id in record_cases and records == 0:
            hits.append(
                {
                    "path": case_id,
                    "line": 0,
                    "needle": "exact eight-line checkpoint record",
                    "text": "record absent",
                }
            )
        if case_id not in record_cases and records:
            hits.append(
                {
                    "path": case_id,
                    "line": 0,
                    "needle": "no second checkpoint record",
                    "text": f"observed {records}",
                }
            )

        if case_id == "B-T4-COMPACT-WORTH-NOT-TRIGGERED":
            compact_forbidden = (
                "owner:dev-verification",
                "owner:dev-code-review",
                "owner:dev-continual-learning",
                "state:verifying",
                "state:verified",
                "state:reviewing",
                "state:complete",
            )
            compact_hits = [
                needle
                for needle in compact_forbidden
                if any(needle in event for event in events)
            ]
            if compact_hits:
                hits.append(
                    {
                        "path": case_id,
                        "line": 0,
                        "needle": "compact checkpoint exclusion",
                        "text": repr(compact_hits),
                    }
                )

    scope_texts: list[tuple[str, str]] = []
    for relative, start_heading, end_heading in CHECKPOINT_SCOPE_HEADINGS:
        try:
            text = (root / relative).read_text(encoding="utf-8")
            start = text.index(start_heading)
            end = text.index(end_heading, start) if end_heading else len(text)
        except (OSError, UnicodeError, ValueError) as error:
            hits.append(
                {
                    "path": relative,
                    "line": 0,
                    "needle": "checkpoint source projection",
                    "text": str(error),
                }
            )
            continue
        scope_texts.append((relative, text[start:end]))

    combined_scope = "\n".join(text for _, text in scope_texts)
    required_projection = (
        "remaining stable IDs",
        "relation to OUT-...",
        "what already satisfies the goal",
        "changed falsifiable hypothesis",
        "recommendation",
        "outcome-blocking",
        "proof-ceremony",
        "Continue",
        "Second opinion",
        "Close",
        "post-2/2",
        "completed-with-residual",
        "proof-reuse-reaccounted",
        "accepted Close",
        "rejected Close",
        "continuation-only gates",
        "Proof-ceremony may frame hypothesis",
    )
    for needle in required_projection:
        if normalize(needle) not in normalize(combined_scope):
            hits.append(
                {
                    "path": "<checkpoint scopes>",
                    "line": 0,
                    "needle": "checkpoint source projection",
                    "text": needle,
                }
            )

    portable_case_scope = "\n".join(
        str(cases[case_id].get("inputs", {}).get("request", ""))
        + "\n"
        + "\n".join(cases[case_id].get("required_events", []))
        for case_id in CHECKPOINT_CASE_IDS
        if case_id in cases
    )
    provider_scope = combined_scope + "\n" + portable_case_scope
    for needle in CHECKPOINT_FORBIDDEN_NEEDLES:
        if needle.casefold() in provider_scope.casefold():
            hits.append(
                {
                    "path": "<checkpoint scopes>",
                    "line": 0,
                    "needle": "provider-neutral checkpoint contract",
                    "text": needle,
                }
            )
    return hits


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
            if folded_heading == normalize(
                "Rejected alternatives / why not"
            ) or folded_heading.startswith("historical"):
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
    end = next(
        (index for index in range(1, len(lines)) if lines[index].strip() == "---"), None
    )
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
            if actual is None or normalize(actual) != normalize(
                EXPECTED_DESCRIPTIONS[relative]
            ):
                hits.append(
                    {
                        "path": relative,
                        "line": 1,
                        "needle": "exact profile-aware frontmatter description",
                        "text": actual or "<missing>",
                    }
                )
    hits.extend(checkpoint_contract_hits(root, load_registry(root)))
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
            if "Compact uses `dev-implementation` then `dev-ask completion presentation`"
            in line
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
        other = next(
            value for key, value in EXPECTED_DESCRIPTIONS.items() if key != path
        )
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
    cases = load_registry(root)
    baseline_checkpoint_hits = checkpoint_contract_hits(root, cases)
    if baseline_checkpoint_hits:
        raise ScanError(
            f"checkpoint baseline self-test failed: {baseline_checkpoint_hits}"
        )
    checks.append("checkpoint:baseline")

    missing_frame = copy.deepcopy(cases)
    missing_events = missing_frame["B-T4-REVISION-WORTH-OPINION"]["required_events"]
    frame_event_index = next(
        index
        for index, event in enumerate(missing_events)
        if "remaining stable IDs:" in event
    )
    frame_lines = missing_events[frame_event_index].splitlines()
    del frame_lines[
        next(
            index
            for index, line in enumerate(frame_lines)
            if line.startswith("what already satisfies the goal:")
        )
    ]
    missing_events[frame_event_index] = "\n".join(frame_lines)
    if not any(
        hit["needle"] == "five-line worth frame"
        for hit in checkpoint_contract_hits(root, missing_frame)
    ):
        raise ScanError("checkpoint missing-frame self-test failed")
    checks.append("checkpoint:missing-frame")

    ninth_field = copy.deepcopy(cases)
    close_events = ninth_field["B-T4-CHECKPOINT-PROOF-CLOSE"]["required_events"]
    record_event_index = next(
        index for index, event in enumerate(close_events) if "- exhausted " in event
    )
    close_events[record_event_index] = close_events[record_event_index].replace(
        "  - opinion: absent\n",
        "  - opinion: absent\n  - ninth: forbidden\n",
        1,
    )
    if not any(
        hit["needle"] == "exact eight-line checkpoint record"
        for hit in checkpoint_contract_hits(root, ninth_field)
    ):
        raise ScanError("checkpoint ninth-field self-test failed")
    checks.append("checkpoint:ninth-field")

    parity_drift = copy.deepcopy(cases)
    parity_drift["B-T4-CHECKPOINT-PROOF-CLOSE"]["inputs"]["request"] += " parity drift"
    if not any(
        hit["needle"] == "checkpoint request byte parity"
        for hit in checkpoint_contract_hits(root, parity_drift)
    ):
        raise ScanError("checkpoint parity-drift self-test failed")
    checks.append("checkpoint:parity-drift")

    forbidden_binding = copy.deepcopy(cases)
    forbidden_binding["B-T4-REVISION-WORTH-OPINION"]["required_events"].append(
        "state:blocked|owner:backend|output:portable policy requires --model vendor-x"
    )
    if not any(
        hit["needle"] == "provider-neutral checkpoint contract"
        for hit in checkpoint_contract_hits(root, forbidden_binding)
    ):
        raise ScanError("checkpoint forbidden-binding self-test failed")
    checks.append("checkpoint:forbidden-binding")

    compact_case = cases["B-T4-COMPACT-WORTH-NOT-TRIGGERED"]
    if (
        "Close" not in compact_case["inputs"]["request"]
        or "Close" not in compact_case["forbidden_events"]
    ):
        raise ScanError("checkpoint compact false-positive control is incomplete")
    if any(
        hit["path"] == "B-T4-COMPACT-WORTH-NOT-TRIGGERED"
        for hit in baseline_checkpoint_hits
    ):
        raise ScanError("checkpoint compact false-positive self-test failed")
    checks.append("checkpoint:compact-false-positive")
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
