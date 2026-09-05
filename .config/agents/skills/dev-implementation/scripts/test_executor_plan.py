#!/usr/bin/env python3
"""Focused contract tests for the lean implementation-plan validator."""

from __future__ import annotations

import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path

import executor_plan

SCRIPT_DIR = Path(__file__).resolve().parent
COMPLETE_PATH = SCRIPT_DIR / "fixtures/executor_plan/complete.md"
FAN_IN_PATH = SCRIPT_DIR / "fixtures/executor_plan/fan_in.md"
COMPLETE = COMPLETE_PATH.read_text(encoding="utf-8")
FAN_IN = FAN_IN_PATH.read_text(encoding="utf-8")


def replace_once(text: str, old: str, new: str) -> str:
    if text.count(old) != 1:
        raise AssertionError(f"expected one replacement anchor: {old!r}")
    return text.replace(old, new, 1)


class LeanPlanTests(unittest.TestCase):
    def assert_issue(self, text: str, code: str) -> executor_plan.Report:
        report = executor_plan.validate_text(text)
        self.assertFalse(report.valid)
        self.assertIn(code, {issue.code for issue in report.issues})
        self.assertFalse(report.terminal_complete)
        return report

    def test_lean_fixtures_and_report_contract(self) -> None:
        complete = executor_plan.validate_text(COMPLETE)
        fan_in = executor_plan.validate_text(FAN_IN)
        self.assertTrue(complete.valid, complete)
        self.assertTrue(fan_in.valid, fan_in)
        self.assertTrue(complete.terminal_complete)
        self.assertEqual(complete.lifecycle_status, "DONE")
        self.assertFalse(fan_in.terminal_complete)
        self.assertEqual(fan_in.lifecycle_status, "PENDING")
        self.assertEqual(
            set(complete.payload()),
            {
                "schema",
                "status",
                "issues",
                "datetime",
                "lifecycle_status",
                "terminal_complete",
            },
        )
        self.assertEqual(complete.payload()["schema"], "executor-plan-validation/v2")
        self.assertNotIn("plan_sha256", complete.payload())

    def test_old_detailed_section_is_rejected(self) -> None:
        old = replace_once(
            FAN_IN,
            "\n## Tasks\n",
            "\n## Proof Recipes\n\n| AC | Recipe |\n|---|---|\n| AC-A | legacy |\n\n## Tasks\n",
        )
        self.assert_issue(old, "SECTION_UNEXPECTED")

    def test_task_ownership_fields_are_required(self) -> None:
        cases = {
            "owner": replace_once(FAN_IN, "  - Owner: alpha-child\n", ""),
            "targets": replace_once(FAN_IN, "  - Targets: fixture/alpha.txt\n", ""),
            "receiver": replace_once(
                FAN_IN,
                "  - Acceptance: AC-A\n  - Receiver: join-child\n",
                "  - Acceptance: AC-A\n",
            ),
        }
        for label, text in cases.items():
            with self.subTest(label=label):
                self.assert_issue(text, "TASK_FIELD_MISSING")

    def test_direct_check_requires_behavior_and_exact_expectation(self) -> None:
        cases = {
            "behavior-missing": replace_once(
                FAN_IN,
                "  Behavior: The alpha producer creates the approved alpha value.\n",
                "",
            ),
            "check-missing": replace_once(
                FAN_IN, "  Check: read fixture/alpha.txt; expect alpha\n", ""
            ),
            "expectation-missing": replace_once(
                FAN_IN,
                "  Check: read fixture/alpha.txt; expect alpha",
                "  Check: read fixture/alpha.txt",
            ),
            "blank-between": replace_once(
                FAN_IN,
                "  Behavior: The alpha producer creates the approved alpha value.\n"
                "  Check: read fixture/alpha.txt; expect alpha",
                "  Behavior: The alpha producer creates the approved alpha value.\n\n"
                "  Check: read fixture/alpha.txt; expect alpha",
            ),
        }
        for label, text in cases.items():
            with self.subTest(label=label):
                self.assert_issue(text, "DIRECT_CHECK_INVALID")

    def test_exact_target_and_criterion_ownership(self) -> None:
        duplicate_target = replace_once(
            FAN_IN, "  - Targets: fixture/beta.txt", "  - Targets: fixture/alpha.txt"
        )
        duplicate_criterion = replace_once(
            FAN_IN, "  - Acceptance: AC-B", "  - Acceptance: AC-A"
        )
        reordered_fields = replace_once(
            FAN_IN,
            "  - Owner: alpha-child\n  - Depends on: none",
            "  - Depends on: none\n  - Owner: alpha-child",
        )
        self.assert_issue(duplicate_target, "TARGET_OWNER_COUNT")
        self.assert_issue(duplicate_criterion, "CRITERION_OWNER_COUNT")
        self.assert_issue(reordered_fields, "TASK_FIELD_ORDER")

    def test_dependencies_must_resolve_and_be_acyclic(self) -> None:
        cycle = replace_once(
            FAN_IN,
            "- [ ] T1. Produce alpha\n"
            "  - Owner: alpha-child\n"
            "  - Depends on: none",
            "- [ ] T1. Produce alpha\n"
            "  - Owner: alpha-child\n"
            "  - Depends on: T3",
        )
        dangling = replace_once(FAN_IN, "  - Depends on: T1, T2", "  - Depends on: T1, T9")
        self.assert_issue(cycle, "TASK_DEPENDENCY_CYCLE")
        self.assert_issue(dangling, "TASK_DEPENDENCY_DANGLING")

    def test_task_ids_begin_at_t1_and_increase(self) -> None:
        text = replace_once(FAN_IN, "- [ ] T1. Produce alpha", "- [ ] T9. Produce alpha")
        self.assert_issue(text, "TASK_ORDER")

    def test_in_progress_accepts_recorded_partial_progress(self) -> None:
        text = replace_once(FAN_IN, "**Status**: PENDING", "**Status**: IN_PROGRESS")
        text = replace_once(
            text,
            "- [ ] T1. Produce alpha",
            "- [x] T1. Produce alpha\n  completed 2026-09-04-1310",
        )
        text = replace_once(text, "- [ ] AC-A. Alpha output", "- [x] AC-A. Alpha output")
        report = executor_plan.validate_text(text)
        self.assertTrue(report.valid, report)
        self.assertEqual(report.lifecycle_status, "IN_PROGRESS")
        self.assertFalse(report.terminal_complete)

    def test_pending_rejects_completed_progress(self) -> None:
        text = replace_once(
            FAN_IN,
            "- [ ] T1. Produce alpha",
            "- [x] T1. Produce alpha\n  completed 2026-09-04-1310",
        )
        text = replace_once(text, "- [ ] AC-A. Alpha output", "- [x] AC-A. Alpha output")
        self.assert_issue(text, "PENDING_PROGRESS")

    def test_done_requires_header_checkboxes_records_and_summary(self) -> None:
        cases = {
            "completed-at": replace_once(
                COMPLETE, "**Completed At**: 2026-09-04-1230\n", ""
            ),
            "task": replace_once(
                COMPLETE,
                "- [x] T1. Validate the completed lean contract",
                "- [ ] T1. Validate the completed lean contract",
            ),
            "record": replace_once(COMPLETE, "  completed 2026-09-04-1225\n", ""),
            "record-position": replace_once(
                COMPLETE,
                "- [x] T1. Validate the completed lean contract\n"
                "  completed 2026-09-04-1225",
                "- [x] T1. Validate the completed lean contract\n\n"
                "  completed 2026-09-04-1225",
            ),
            "acceptance": replace_once(
                COMPLETE, "- [x] AC-1. Accept the lean body", "- [ ] AC-1. Accept the lean body"
            ),
            "summary": COMPLETE.split("## Completion Summary", 1)[0]
            + "## Completion Summary\n",
        }
        expected = {
            "completed-at": "COMPLETED_AT_REQUIRED",
            "task": "DONE_TASK_UNCHECKED",
            "record": "TASK_COMPLETION_MISSING",
            "record-position": "TASK_COMPLETION_POSITION",
            "acceptance": "DONE_ACCEPTANCE_UNCHECKED",
            "summary": "COMPLETION_SUMMARY_REQUIRED",
        }
        for label, text in cases.items():
            with self.subTest(label=label):
                self.assert_issue(text, expected[label])

    def test_non_done_summary_and_completed_at_are_rejected(self) -> None:
        text = replace_once(COMPLETE, "**Status**: DONE", "**Status**: IN_PROGRESS")
        self.assert_issue(text, "COMPLETED_AT_FORBIDDEN")
        text = replace_once(text, "**Completed At**: 2026-09-04-1230\n", "")
        self.assert_issue(text, "COMPLETION_SUMMARY_FORBIDDEN")

    def test_closed_is_terminal_without_claiming_completion(self) -> None:
        closed = replace_once(FAN_IN, "**Status**: PENDING", "**Status**: CLOSED")
        report = executor_plan.validate_text(closed)
        self.assertTrue(report.valid, report)
        self.assertTrue(report.terminal_complete)
        self.assertEqual(report.lifecycle_status, "CLOSED")

    def test_header_encoding_and_line_endings(self) -> None:
        self.assertTrue(executor_plan.validate_text(COMPLETE.replace("\n", "\r\n")).valid)
        self.assert_issue("\ufeff" + COMPLETE, "FORMAT_BOM")

    def test_cli_emits_the_lean_report_without_a_digest(self) -> None:
        with tempfile.TemporaryDirectory(prefix="lean-plan-") as temporary:
            plan = Path(temporary) / "plan.md"
            plan.write_text(COMPLETE, encoding="utf-8")
            stream = io.StringIO()
            with contextlib.redirect_stdout(stream):
                exit_code = executor_plan.main(["validate", str(plan)])
        payload = json.loads(stream.getvalue())
        self.assertEqual(exit_code, 0)
        self.assertEqual(payload["status"], "valid")
        self.assertNotIn("plan_sha256", payload)


if __name__ == "__main__":
    unittest.main()
