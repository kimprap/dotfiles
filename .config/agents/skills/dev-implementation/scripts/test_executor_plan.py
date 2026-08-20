from __future__ import annotations

import contextlib
import io
import hashlib
import json
import os
import re
import tempfile
import unittest
from unittest import mock
from pathlib import Path

import executor_plan


SCRIPT_DIR = Path(__file__).resolve().parent
FIXTURE = SCRIPT_DIR / "fixtures/executor_plan/complete.md"
FAN_IN_FIXTURE = SCRIPT_DIR / "fixtures/executor_plan/fan_in.md"
COMPLETE = FIXTURE.read_text(encoding="utf-8")
FAN_IN = FAN_IN_FIXTURE.read_text(encoding="utf-8")

def replace_once(text: str, old: str, new: str) -> str:
    if text.count(old) != 1:
        raise AssertionError(f"fixture anchor must occur once: {old!r}")
    return text.replace(old, new, 1)


def remove_section(text: str, heading: str) -> str:
    pattern = re.compile(rf"(?ms)^## {re.escape(heading)}\n.*?(?=^## |\Z)")
    changed, count = pattern.subn("", text, count=1)
    if count != 1:
        raise AssertionError(f"missing section fixture anchor: {heading}")
    return changed


def remove_recipe(text: str, recipe_id: str) -> str:
    pattern = re.compile(
        rf"(?ms)^- \[ \] {re.escape(recipe_id)}\..*?(?=^- \[ \] VR-|^## |\Z)"
    )
    changed, count = pattern.subn("", text, count=1)
    if count != 1:
        raise AssertionError(f"missing recipe fixture anchor: {recipe_id}")
    return changed


def remove_task(text: str, task_id: str) -> str:
    pattern = re.compile(
        rf"(?ms)^- \[ \] {re.escape(task_id)}\..*?(?=^- \[ \] T[1-9]\d*\.|^## )"
    )
    changed, count = pattern.subn("", text, count=1)
    if count != 1:
        raise AssertionError(f"missing task fixture anchor: {task_id}")
    return changed


def remove_table_row(text: str, identifier: str) -> str:
    pattern = re.compile(rf"(?m)^\| {re.escape(identifier)} \|.*\n")
    changed, count = pattern.subn("", text, count=1)
    if count != 1:
        raise AssertionError(f"missing table row fixture anchor: {identifier}")
    return changed


def without_profile_tail(
    text: str, *, receiver: str, assurance: str = "standard"
) -> str:
    changed = text
    for task_id in ("T3", "T4", "T5"):
        changed = remove_task(changed, task_id)
    for recipe_id in ("VR-AC08", "VR-AC09", "VR-AC10"):
        changed = remove_recipe(changed, recipe_id)
    for identifier in (
        "CONTRACT-VERIFY",
        "CONTRACT-REVIEW",
        "CONTRACT-LEARN",
        "TGT-VERIFY",
        "TGT-REVIEW",
        "TGT-LEARN",
        "AC08",
        "AC09",
        "AC10",
        "OUTP-T3",
        "OUTP-T4",
        "OUTP-T5",
    ):
        changed = remove_table_row(changed, identifier)
    changed = replace_once(changed, "- Assurance: standard", f"- Assurance: {assurance}")
    changed = replace_once(changed, "  - Receiver: T3", f"  - Receiver: {receiver}")
    changed = replace_once(
        changed,
        "| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | T3 | Common Handoff from dev-handoff |",
        f"| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | {receiver} | Common Handoff from dev-handoff |",
    )
    return changed


def without_fan_in_profile_tail(text: str) -> str:
    changed = text
    for task_id in ("T6", "T7", "T8"):
        changed = remove_task(changed, task_id)
    for recipe_id in ("VR-AC06", "VR-AC07", "VR-AC08"):
        changed = remove_recipe(changed, recipe_id)
    for identifier in (
        "CONTRACT-PROFILE-VERIFY",
        "CONTRACT-PROFILE-REVIEW",
        "CONTRACT-PROFILE-LEARN",
        "TGT-PROFILE-VERIFY",
        "TGT-PROFILE-REVIEW",
        "TGT-PROFILE-LEARN",
        "AC06",
        "AC07",
        "AC08",
        "OUTP-T6",
        "OUTP-T7",
        "OUTP-T8",
    ):
        changed = remove_table_row(changed, identifier)
    changed = replace_once(
        changed,
        "  - Output: OUTP-T5\n  - Receiver: T6",
        "  - Output: OUTP-T5\n  - Receiver: dev-implementation backend",
    )
    changed = replace_once(
        changed,
        "| OUTP-T5 | T5 | TGT-INTEGRATE exact revision | completed, blocked | T6 | Common Handoff from dev-handoff |",
        "| OUTP-T5 | T5 | TGT-INTEGRATE exact revision | completed, blocked | dev-implementation backend | Common Handoff from dev-handoff |",
    )
    return changed


def with_first_task_methods(text: str, value: str) -> str:
    before = (
        "  - Owner: rule-worker\n"
        "  - Intent: Make the portable contract explicit.\n"
        "  - Methods: none"
    )
    after = (
        "  - Owner: rule-worker\n"
        "  - Intent: Make the portable contract explicit.\n"
        f"  - Methods:{f' {value}' if value else ''}"
    )
    return replace_once(text, before, after)


class ExecutorPlanTests(unittest.TestCase):
    def assert_issue(self, text: str, code: str) -> None:
        for context in executor_plan.CONTEXTS:
            for consumer in executor_plan.CONSUMERS:
                with self.subTest(context=context, consumer=consumer, code=code):
                    report = executor_plan.validate_text(
                        text, context=context, consumer=consumer
                    )
                    self.assertFalse(report.valid)
                    self.assertIn(code, {issue.code for issue in report.issues})

    def assert_valid_matrix(self, cases: dict[str, str]) -> dict[str, str]:
        digests: dict[str, str] = {}
        for label, text in cases.items():
            expected_digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
            digests[label] = expected_digest
            for context in executor_plan.CONTEXTS:
                for consumer in executor_plan.CONSUMERS:
                    with self.subTest(
                        case=label, context=context, consumer=consumer
                    ):
                        report = executor_plan.validate_text(
                            text, context=context, consumer=consumer
                        )
                        self.assertTrue(report.valid, report)
                        self.assertEqual(report.plan_sha256, expected_digest)
                        self.assertEqual(report.issues, ())
        return digests

    def assert_backend_blocked(self, text: str, code: str) -> None:
        for context in executor_plan.CONTEXTS:
            with self.subTest(context=context, preflight_code=code):
                with tempfile.TemporaryDirectory(
                    prefix="executor-plan-task-shape-"
                ) as temporary:
                    root = Path(temporary).resolve()
                    repository_root = root / "repository"
                    local_root = root / "local"
                    active = (
                        repository_root
                        / ".agents"
                        / "plans"
                        / "2026-08-09-1700_demo.md"
                    )
                    local_plan = local_root / "demo-plan.md"
                    active.parent.mkdir(parents=True)
                    (active.parent / "archive").mkdir()
                    local_root.mkdir()
                    active.write_text(text, encoding="utf-8")
                    report = executor_plan.preflight_file(
                        active,
                        context=context,
                        slug="demo",
                        repository_root=repository_root,
                        local_root=local_root,
                        local_plan=local_plan,
                    )
                    self.assertEqual(report.status, "blocked", report.payload())
                    self.assertEqual(
                        report.payload()["schema"], "executor-plan-preflight/v1"
                    )
                    self.assertEqual(
                        report.payload()["structural"]["schema"],
                        "executor-plan-validation/v1",
                    )
                    self.assertEqual(
                        report.payload()["structural"]["status"], "invalid"
                    )
                    self.assertIn(
                        code,
                        {
                            issue["code"]
                            for issue in report.payload()["structural"]["issues"]
                        },
                    )

    def test_complete_fixture_roles_contexts_report_and_digest_contract(self) -> None:
        local = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            "**Authority kind**: local-authority",
        )
        direct_reports = []
        local_reports = []
        for context in executor_plan.CONTEXTS:
            for consumer in executor_plan.CONSUMERS:
                with self.subTest(context=context, consumer=consumer):
                    direct_report = executor_plan.validate_text(
                        COMPLETE, context=context, consumer=consumer
                    )
                    local_report = executor_plan.validate_text(
                        local, context=context, consumer=consumer
                    )
                    self.assertTrue(direct_report.valid, direct_report)
                    self.assertTrue(local_report.valid, local_report)
                    self.assertEqual(
                        set(direct_report.payload()),
                        {
                            "consumer",
                            "context",
                            "issues",
                            "plan_sha256",
                            "schema",
                            "status",
                        },
                    )
                    self.assertEqual(
                        direct_report.payload()["schema"],
                        "executor-plan-validation/v1",
                    )
                    self.assertEqual(direct_report.payload()["status"], "valid")
                    self.assertEqual(direct_report.consumer, consumer)
                    self.assertEqual(direct_report.context, context)
                    direct_reports.append(direct_report)
                    local_reports.append(local_report)

        self.assertEqual(
            {report.plan_sha256 for report in direct_reports},
            {hashlib.sha256(COMPLETE.encode("utf-8")).hexdigest()},
        )
        self.assertEqual(
            {report.plan_sha256 for report in local_reports},
            {hashlib.sha256(local.encode("utf-8")).hexdigest()},
        )
        self.assertNotEqual(
            direct_reports[0].plan_sha256,
            local_reports[0].plan_sha256,
        )
        self.assertEqual({report.issues for report in direct_reports + local_reports}, {()})
        self.assertEqual(
            executor_plan.REQUIRED_SECTIONS,
            (
                "Objective",
                "Authority",
                "Governing decisions",
                "Scope, non-goals, and prohibited effects",
                "Fixed shared contracts",
                "Target map",
                "Execution policy",
                "Tasks",
                "Acceptance",
                "Verification / Done criteria",
                "Result / Handoff",
                "Blockers and recovery",
                "Critical anchors and assumptions",
            ),
        )

    def test_task_shape_positive_matrix_across_contexts_and_consumers(self) -> None:
        numbered_high = replace_once(
            COMPLETE, "- Assurance: standard", "- Assurance: high-consequence"
        )
        omitted_standard_verification = without_profile_tail(
            COMPLETE, receiver="dev-verification"
        )
        omitted_high_backend = without_profile_tail(
            COMPLETE,
            receiver="dev-implementation backend",
            assurance="high-consequence",
        )
        compact = without_profile_tail(
            COMPLETE,
            receiver="dev-implementation backend",
            assurance="compact",
        )
        compact_arbitrary_work_owner = replace_once(
            compact,
            "  - Owner: rule-worker",
            "  - Owner: repository-specialist",
        )
        omitted_fan_in = without_fan_in_profile_tail(FAN_IN)
        digests = self.assert_valid_matrix(
            {
                "numbered-standard": COMPLETE,
                "numbered-high-consequence": numbered_high,
                "omitted-standard-verification": omitted_standard_verification,
                "omitted-high-consequence-backend": omitted_high_backend,
                "fan-in-numbered-standard": FAN_IN,
                "fan-in-omitted-standard": omitted_fan_in,
                "compact-work-only": compact,
                "compact-arbitrary-work-owner": compact_arbitrary_work_owner,
            }
        )
        self.assertEqual(len(digests), 8)
        self.assertEqual(
            digests["numbered-standard"], hashlib.sha256(FIXTURE.read_bytes()).hexdigest()
        )
        self.assertEqual(
            digests["fan-in-numbered-standard"],
            hashlib.sha256(FAN_IN_FIXTURE.read_bytes()).hexdigest(),
        )

    def test_intent_methods_and_extra_field_matrix(self) -> None:
        valid_tdd = with_first_task_methods(COMPLETE, "tdd")
        valid_extra = with_first_task_methods(
            COMPLETE, "none\n  - Notes: unrelated extra fields remain tolerated"
        )
        self.assert_valid_matrix(
            {
                "methods-none": COMPLETE,
                "methods-tdd": valid_tdd,
                "unrelated-extra": valid_extra,
            }
        )

        missing_intent = COMPLETE.replace(
            "  - Intent: Make the portable contract explicit.\n", "", 1
        )
        empty_intent = replace_once(
            COMPLETE,
            "  - Intent: Make the portable contract explicit.",
            "  - Intent:",
        )
        missing_methods = replace_once(
            COMPLETE,
            "  - Intent: Make the portable contract explicit.\n  - Methods: none",
            "  - Intent: Make the portable contract explicit.",
        )
        empty_methods = with_first_task_methods(COMPLETE, "")
        field_cases = (
            (missing_intent, "TASK_FIELD_MISSING"),
            (empty_intent, "TASK_FIELD_MISSING"),
            (missing_methods, "TASK_FIELD_MISSING"),
            (empty_methods, "TASK_FIELD_MISSING"),
        )
        for text, code in field_cases:
            self.assert_issue(text, code)
            self.assert_backend_blocked(text, code)
        self.assert_issue(empty_methods, "TASK_METHODS_INVALID")

        invalid_methods = {
            "empty": empty_methods,
            "ponytail": with_first_task_methods(COMPLETE, "ponytail"),
            "unknown": with_first_task_methods(COMPLETE, "benchmark"),
            "duplicate": with_first_task_methods(COMPLETE, "tdd, tdd"),
            "mixed-none": with_first_task_methods(COMPLETE, "none, tdd"),
            "case-variant": with_first_task_methods(COMPLETE, "TDD"),
            "none-case-variant": with_first_task_methods(COMPLETE, "None"),
        }
        for label, text in invalid_methods.items():
            with self.subTest(methods=label):
                self.assert_issue(text, "TASK_METHODS_INVALID")
                self.assert_backend_blocked(text, "TASK_METHODS_INVALID")

    def test_assurance_and_profile_tail_negative_matrix(self) -> None:
        omitted_backend = without_profile_tail(
            COMPLETE, receiver="dev-implementation backend"
        )
        partial_verification_only = remove_task(
            remove_task(COMPLETE, "T5"), "T4"
        )
        wrong_order = replace_once(
            replace_once(
                replace_once(
                    COMPLETE,
                    "  - Owner: dev-verification",
                    "  - Owner: temporary-tail-owner",
                ),
                "  - Owner: dev-code-review",
                "  - Owner: dev-verification",
            ),
            "  - Owner: temporary-tail-owner",
            "  - Owner: dev-code-review",
        )
        wrong_internal_receiver = replace_once(
            COMPLETE,
            "  - Output: OUTP-T3\n  - Receiver: T4",
            "  - Output: OUTP-T3\n  - Receiver: T5",
        )
        invented_receiver = replace_once(
            replace_once(
                omitted_backend,
                "  - Output: OUTP-T2\n  - Receiver: dev-implementation backend",
                "  - Output: OUTP-T2\n  - Receiver: T99",
            ),
            "| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | dev-implementation backend | Common Handoff from dev-handoff |",
            "| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | T99 | Common Handoff from dev-handoff |",
        )
        broken_predecessor_receiver = replace_once(
            replace_once(
                COMPLETE,
                "  - Output: OUTP-T2\n  - Receiver: T3",
                "  - Output: OUTP-T2\n  - Receiver: T4",
            ),
            "| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | T3 | Common Handoff from dev-handoff |",
            "| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | T4 | Common Handoff from dev-handoff |",
        )
        broken_final_receiver = replace_once(
            replace_once(
                COMPLETE,
                "  - Output: OUTP-T5\n  - Receiver: dev-implementation backend",
                "  - Output: OUTP-T5\n  - Receiver: terminal-worker",
            ),
            "| OUTP-T5 | T5 | TGT-LEARN exact revision | completed, blocked, transport-unavailable | dev-implementation backend | Common Handoff from dev-handoff |",
            "| OUTP-T5 | T5 | TGT-LEARN exact revision | completed, blocked, transport-unavailable | terminal-worker | Common Handoff from dev-handoff |",
        )
        no_work = remove_task(remove_task(COMPLETE, "T1"), "T2")
        compact_work_only = without_profile_tail(
            COMPLETE,
            receiver="dev-implementation backend",
            assurance="compact",
        )
        compact_with_one_tail_owner = replace_once(
            compact_work_only,
            "  - Owner: validator-worker",
            "  - Owner: dev-verification",
        )
        compact_with_verification_receiver = without_profile_tail(
            COMPLETE,
            receiver="dev-verification",
            assurance="compact",
        )
        compact_with_integration_owner = replace_once(
            compact_work_only,
            "  - Owner: rule-worker",
            "  - Owner: dev-integration",
        )
        compact_with_backend_owner = replace_once(
            compact_work_only,
            "  - Owner: rule-worker",
            "  - Owner: dev-implementation backend",
        )
        tail_cases = {
            "partial-two-rows": remove_task(COMPLETE, "T5"),
            "partial-verification-only": partial_verification_only,
            "missing-number": replace_once(
                COMPLETE, "- [ ] T3. Verify", "- [ ] T6. Verify"
            ),
            "wrong-order": wrong_order,
            "wrong-owner": replace_once(
                COMPLETE,
                "  - Owner: dev-code-review",
                "  - Owner: review-worker",
            ),
            "non-none-tail-method": replace_once(
                COMPLETE,
                "  - Owner: dev-code-review\n  - Intent: Identify any outcome-relevant defect in the verified result.\n  - Methods: none",
                "  - Owner: dev-code-review\n  - Intent: Identify any outcome-relevant defect in the verified result.\n  - Methods: tdd",
            ),
            "broken-dependency": replace_once(
                COMPLETE, "  - Depends on: T3", "  - Depends on: T2"
            ),
            "broken-internal-receiver": wrong_internal_receiver,
            "invented-final-receiver": invented_receiver,
            "no-work-task": no_work,
            "broken-predecessor-receiver": broken_predecessor_receiver,
            "broken-final-receiver": broken_final_receiver,
            "compact-final-triple": replace_once(
                COMPLETE, "- Assurance: standard", "- Assurance: compact"
            ),
            "compact-any-tail-owner": compact_with_one_tail_owner,
            "compact-verification-receiver": compact_with_verification_receiver,
            "compact-integration-owner": compact_with_integration_owner,
            "compact-backend-owner": compact_with_backend_owner,
        }
        for label, text in tail_cases.items():
            with self.subTest(tail=label):
                self.assert_issue(text, "TASK_TAIL_INVALID")
                self.assert_backend_blocked(text, "TASK_TAIL_INVALID")

        unsupported = replace_once(
            COMPLETE, "- Assurance: standard", "- Assurance: maximal"
        )
        self.assert_issue(unsupported, "ASSURANCE_PROFILE_INVALID")
        self.assert_backend_blocked(unsupported, "ASSURANCE_PROFILE_INVALID")

    def test_header_mode_line_endings_and_complete_issue_matrix(self) -> None:
        with_mode = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            "**Authority kind**: direct-repository\n**Mode**: standard",
        )
        self.assertTrue(
            executor_plan.validate_text(
                with_mode, context="omp", consumer="planner"
            ).valid
        )

        crlf = COMPLETE.replace("\n", "\r\n")
        mixed = "".join(
            line + ("\r\n" if index % 2 else "\n")
            for index, line in enumerate(COMPLETE.splitlines())
        )
        for label, text in (("crlf", crlf), ("mixed", mixed)):
            with self.subTest(line_endings=label):
                report = executor_plan.validate_text(
                    text, context="grok", consumer="backend"
                )
                self.assertTrue(report.valid, report)
                self.assertEqual(
                    report.plan_sha256,
                    hashlib.sha256(text.encode("utf-8")).hexdigest(),
                )
                self.assertNotEqual(
                    report.plan_sha256,
                    hashlib.sha256(COMPLETE.encode("utf-8")).hexdigest(),
                )

        cases = {
            "bom": ("\ufeff" + COMPLETE, "HEADER_BOM"),
            "h1": (replace_once(COMPLETE, "# Portable executor fixture", "Portable executor fixture"), "HEADER_H1"),
            "split-block": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository\n**Scope**",
                    "**Authority kind**: direct-repository\n\n**Scope**",
                ),
                "HEADER_METADATA_BLOCK",
            ),
            "missing": (
                COMPLETE.replace("**Authority kind**: direct-repository\n", "", 1),
                "HEADER_FIELD_MISSING",
            ),
            "duplicate": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority kind**: direct-repository\n**Authority kind**: direct-repository",
                ),
                "HEADER_FIELD_DUPLICATE",
            ),
            "unknown": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority provenance**: direct-repository",
                ),
                "HEADER_FIELD_UNKNOWN",
            ),
            "field-case": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**authority kind**: direct-repository",
                ),
                "HEADER_FIELD_CASE",
            ),
            "value-case": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority kind**: Direct-Repository",
                ),
                "HEADER_FIELD_CASE",
            ),
            "malformed": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority kind**:\tdirect-repository",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "wrong-order": (
                replace_once(
                    COMPLETE,
                    "**Datetime**: 2026-08-09-1700\n**Authority kind**: direct-repository",
                    "**Authority kind**: direct-repository\n**Datetime**: 2026-08-09-1700",
                ),
                "HEADER_FIELD_ORDER",
            ),
            "value": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority kind**: repository",
                ),
                "HEADER_FIELD_VALUE",
            ),
            "misplaced": (
                replace_once(
                    COMPLETE,
                    "## Objective\n",
                    "## Objective\n\n**Authority kind**: direct-repository\n",
                ),
                "HEADER_FIELD_MISPLACED",
            ),
            "bare-cr-h1": (
                replace_once(
                    COMPLETE,
                    "# Portable executor fixture",
                    "# Portable\r executor fixture",
                ),
                "HEADER_H1",
            ),
            "bare-cr-name": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority\r kind**: direct-repository",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "bare-cr-delimiter": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority kind**\r: direct-repository",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "bare-cr-value": (
                replace_once(
                    COMPLETE,
                    "**Authority kind**: direct-repository",
                    "**Authority kind**: direct-\rrepository",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
        }
        for label, (text, code) in cases.items():
            with self.subTest(case=label):
                self.assert_issue(text, code)
        secret = "AMR_SECRET_SENTINEL_7e26"
        secret_text = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            f"**Authority kind**:{secret}",
        )
        for context in executor_plan.CONTEXTS:
            for consumer in executor_plan.CONSUMERS:
                report = executor_plan.validate_text(
                    secret_text, context=context, consumer=consumer
                )
                self.assertFalse(report.valid)
                self.assertIn(
                    "HEADER_FIELD_MALFORMED",
                    {issue.code for issue in report.issues},
                )
                self.assertNotIn(secret, json.dumps(report.payload(), sort_keys=True))

        body_secret = "AMR_BODY_SECRET_SENTINEL_91b4_/private/var/tmp/plan.md"
        secret_body = replace_once(
            COMPLETE,
            "  - Wave: W0",
            f"  - Wave: {body_secret}",
        )
        for context in executor_plan.CONTEXTS:
            for consumer in executor_plan.CONSUMERS:
                report = executor_plan.validate_text(
                    secret_body, context=context, consumer=consumer
                )
                self.assertFalse(report.valid)
                self.assertIn("WAVE_SHAPE", {issue.code for issue in report.issues})
                self.assertNotIn(
                    body_secret, json.dumps(report.payload(), sort_keys=True)
                )

    def test_completed_at_is_omitted_until_done(self) -> None:
        done = replace_once(COMPLETE, "**Status**: PENDING", "**Status**: DONE")
        done_with_stamp = replace_once(
            done,
            "**Status**: DONE",
            "**Status**: DONE\n**Completed At**: 2026-08-09-1800",
        )
        self.assertTrue(
            executor_plan.validate_text(
                done_with_stamp, context="grok", consumer="planner"
            ).valid
        )
        closed_with_stamp = replace_once(
            COMPLETE,
            "**Status**: PENDING",
            "**Status**: CLOSED\n**Completed At**: 2026-08-09-1800",
        )
        cases = {
            "pending-present": (
                replace_once(
                    COMPLETE,
                    "**Status**: PENDING",
                    "**Status**: PENDING\n**Completed At**: 2026-08-09-1800",
                ),
                "HEADER_FIELD_VALUE",
            ),
            "done-missing": (done, "HEADER_FIELD_MISSING"),
            "done-empty": (
                replace_once(
                    done,
                    "**Status**: DONE",
                    "**Status**: DONE\n**Completed At**: ",
                ),
                "HEADER_FIELD_VALUE",
            ),
            "done-malformed": (
                replace_once(
                    done,
                    "**Status**: DONE",
                    "**Status**: DONE\n**Completed At**:",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "done-invalid-calendar": (
                replace_once(
                    done,
                    "**Status**: DONE",
                    "**Status**: DONE\n**Completed At**: 2026-13-09-1800",
                ),
                "HEADER_FIELD_VALUE",
            ),
            "closed-present": (closed_with_stamp, "HEADER_FIELD_VALUE"),
        }
        for label, (text, code) in cases.items():
            with self.subTest(case=label):
                self.assert_issue(text, code)

    def test_lowercase_todo_is_domain_prose_uppercase_placeholder_fails_and_consumer_is_preserved(
        self,
    ) -> None:
        legitimate = replace_once(
            COMPLETE,
            "- Observable end state: The rule and validator expose one closed portable execution contract.",
            "- Observable end state: The todo projection remains a derivative presentation.",
        )
        for context in executor_plan.CONTEXTS:
            for requested_consumer in executor_plan.CONSUMERS:
                with self.subTest(context=context, consumer=requested_consumer):
                    report = executor_plan.validate_text(
                        legitimate,
                        context=context,
                        consumer=requested_consumer,
                    )
                    self.assertTrue(report.valid, report)
                    self.assertEqual(report.consumer, requested_consumer)
                    self.assertEqual(report.payload()["consumer"], requested_consumer)

        unresolved = replace_once(
            COMPLETE,
            "- Observable end state: The rule and validator expose one closed portable execution contract.",
            "- Observable end state: TODO replace this sentinel.",
        )
        self.assert_issue(unresolved, "UNRESOLVED_PLACEHOLDER")

    def test_missing_duplicate_dangling_cyclic_effect_output_recovery_topology_and_placeholder_cases(
        self,
    ) -> None:
        duplicate_authority = "| AUTH-PLAN | direct | authority://executor-plan | sha256:1111111111111111111111111111111111111111111111111111111111111111 | approved |"
        cases = {
            "missing-section": (
                remove_section(COMPLETE, "Authority"),
                "SECTION_MISSING",
            ),
            "duplicate-section": (
                replace_once(
                    COMPLETE,
                    "## Authority\n",
                    "## Objective\n\n- duplicate\n\n## Authority\n",
                ),
                "SECTION_DUPLICATE",
            ),
            "duplicate-id": (
                replace_once(
                    COMPLETE,
                    duplicate_authority,
                    duplicate_authority + "\n" + duplicate_authority,
                ),
                "DUPLICATE_ID",
            ),
            "dangling-target": (
                replace_once(
                    COMPLETE, "  - Targets: TGT-SCRIPT", "  - Targets: TGT-MISSING"
                ),
                "DANGLING_REFERENCE",
            ),
            "cyclic-dependency": (
                replace_once(COMPLETE, "  - Depends on: none", "  - Depends on: T2"),
                "CYCLIC_DEPENDENCY",
            ),
            "task-start": (
                replace_once(COMPLETE, "- [ ] T1. Define", "- [ ] T9. Define"),
                "TASK_START",
            ),
            "missing-effect": (
                COMPLETE.replace("  - Effects: EFF-LOCAL\n", "", 1),
                "TASK_FIELD_MISSING",
            ),
            "missing-output": (
                replace_once(
                    COMPLETE, "  - Output: OUTP-T2", "  - Output: OUTP-MISSING"
                ),
                "DANGLING_REFERENCE",
            ),
            "missing-recovery": (
                remove_section(COMPLETE, "Blockers and recovery"),
                "SECTION_MISSING",
            ),
            "missing-topology-field": (
                replace_once(COMPLETE, "- Fan-in task: none\n", ""),
                "TOPOLOGY_FIELD_MISSING",
            ),
            "isolated-topology-without-fan-in": (
                COMPLETE.replace(
                    "- Topology: one-owner", "- Topology: isolated-lineages"
                )
                .replace("- Lineages: shared", "- Lineages: LIN-A, LIN-B")
                .replace("  - Lineage: shared", "  - Lineage: LIN-A", 1)
                .replace("  - Lineage: shared", "  - Lineage: LIN-B", 1),
                "FAN_IN_MISSING",
            ),
            "placeholder": (
                replace_once(
                    COMPLETE,
                    "- Observable end state: The rule and validator expose one closed portable execution contract.",
                    "- Observable end state: <TBD>",
                ),
                "UNRESOLVED_PLACEHOLDER",
            ),
        }
        for label, (text, code) in cases.items():
            with self.subTest(case=label):
                self.assert_issue(text, code)

    def test_reference_owner_proof_checkbox_wave_receiver_and_orphan_closure(
        self,
    ) -> None:
        swapped_target_criteria = COMPLETE.replace(
            "| TGT-RULE | rules/plan-impl-spec.md | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | planner persona and complete fixture | AC06 |",
            "| TGT-RULE | rules/plan-impl-spec.md | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | planner persona and complete fixture | AC07 |",
        ).replace(
            "| TGT-SCRIPT | scripts/executor_plan.py | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | planner and backend preflight | AC07 |",
            "| TGT-SCRIPT | scripts/executor_plan.py | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | planner and backend preflight | AC06 |",
        )
        cases = {
            "unowned-contract": (
                replace_once(
                    COMPLETE,
                    "| CONTRACT-VALIDATOR | Structural result schema | T2 |",
                    "| CONTRACT-VALIDATOR | Structural result schema | T9 |",
                ),
                "DANGLING_REFERENCE",
            ),
            "criterion-owner": (
                replace_once(COMPLETE, "  - Criteria: AC07", "  - Criteria: AC06"),
                "CRITERION_OWNER_COUNT",
            ),
            "criterion-target-closure": (
                swapped_target_criteria,
                "CRITERION_TARGET_MISMATCH",
            ),
            "proof-target-closure": (
                replace_once(
                    COMPLETE,
                    "  - Target recheck: TGT-RULE",
                    "  - Target recheck: TGT-SCRIPT",
                ),
                "PROOF_TARGET_MISMATCH",
            ),
            "effect-limit": (
                replace_once(
                    COMPLETE, "- Effect limit: EFF-LOCAL only", "- Effect limit: none"
                ),
                "EFFECT_LIMIT_EXCEEDED",
            ),
            "mixed-none-effect-limit": (
                replace_once(
                    COMPLETE,
                    "- Effect limit: EFF-LOCAL only",
                    "- Effect limit: none, EFF-LOCAL",
                ),
                "EFFECT_LIMIT_SHAPE",
            ),
            "proof-recipe": (
                remove_recipe(COMPLETE, "VR-AC07"),
                "CRITERION_PROOF_COUNT",
            ),
            "checkbox": (
                replace_once(COMPLETE, "- [ ] T1. Define", "- T1. Define"),
                "CHECKBOX_SHAPE",
            ),
            "wave": (
                replace_once(COMPLETE, "  - Wave: W1", "  - Wave: W0"),
                "WAVE_DEPENDENCY",
            ),
            "receiver": (
                replace_once(COMPLETE, "  - Receiver: T4", "  - Receiver: T5"),
                "RECEIVER_MISMATCH",
            ),
            "orphan-target": (
                replace_once(
                    COMPLETE, "  - Targets: TGT-SCRIPT", "  - Targets: TGT-RULE"
                ),
                "ORPHAN_TARGET",
            ),
            "orphan-effect": (
                COMPLETE.replace("  - Effects: EFF-LOCAL", "  - Effects: none"),
                "ORPHAN_EFFECT",
            ),
            "effect-authority": (
                replace_once(
                    COMPLETE,
                    "| EFF-LOCAL | repository-write | AUTH-PLAN |",
                    "| EFF-LOCAL | repository-write | AUTH-MISSING |",
                ),
                "DANGLING_REFERENCE",
            ),
            "handoff-envelope": (
                COMPLETE.replace(
                    "Common Handoff from dev-handoff", "custom result envelope", 1
                ),
                "HANDOFF_CONTRACT",
            ),
        }
        for label, (text, code) in cases.items():
            with self.subTest(case=label):
                self.assert_issue(text, code)

    def test_invalid_utf8_and_bom_fail_cli_without_mutation(self) -> None:
        cases = (
            (b"\xff", "UTF8"),
            (b"\xef\xbb\xbf" + COMPLETE.encode("utf-8"), "HEADER_BOM"),
        )
        with tempfile.TemporaryDirectory(prefix="executor-plan-header-") as temporary:
            root = Path(temporary)
            sentinel = root / "sentinel"
            sentinel.write_bytes(b"unchanged\n")
            for index, (data, expected_code) in enumerate(cases):
                with self.subTest(expected_code=expected_code):
                    plan = root / f"plan-{index}.md"
                    plan.write_bytes(data)
                    before = plan.read_bytes()
                    stream = io.StringIO()
                    with contextlib.redirect_stdout(stream):
                        code = executor_plan.main(
                            [str(plan), "--context", "omp", "--consumer", "planner"]
                        )
                    payload = json.loads(stream.getvalue())
                    self.assertEqual(code, 2)
                    self.assertEqual(payload["status"], "invalid")
                    self.assertIn(
                        expected_code,
                        {issue["code"] for issue in payload["issues"]},
                    )
                    self.assertEqual(plan.read_bytes(), before)
                    self.assertEqual(sentinel.read_bytes(), b"unchanged\n")

    def test_invalid_plan_fails_preflight_without_mutation(self) -> None:
        invalid = remove_section(COMPLETE, "Target map")
        with tempfile.TemporaryDirectory(prefix="executor-plan-") as temporary:
            root = Path(temporary)
            plan = root / "plan.md"
            sentinel = root / "mutation-sentinel"
            plan.write_text(invalid, encoding="utf-8")
            sentinel.write_bytes(b"unchanged\n")
            stream = io.StringIO()
            with contextlib.redirect_stdout(stream):
                code = executor_plan.main(
                    [str(plan), "--context", "grok", "--consumer", "planner"]
                )
            payload = json.loads(stream.getvalue())
            self.assertEqual(code, 2)
            self.assertEqual(payload["status"], "invalid")
            self.assertEqual(sentinel.read_bytes(), b"unchanged\n")
            self.assertEqual(plan.read_text(encoding="utf-8"), invalid)


class ExecutorPlanPreflightTests(unittest.TestCase):
    PLAN_ID = "2026-08-09-1700_demo"

    def layout(self) -> tuple[Path, Path, Path, Path, Path, Path]:
        temporary = tempfile.TemporaryDirectory(prefix="executor-plan-preflight-")
        self.addCleanup(temporary.cleanup)
        base = Path(temporary.name).resolve()
        repository_root = base / "repository"
        local_root = base / "local"
        active = repository_root / ".agents" / "plans" / f"{self.PLAN_ID}.md"
        archive = (
            repository_root
            / ".agents"
            / "plans"
            / "archive"
            / f"{self.PLAN_ID}.md"
        )
        local_plan = local_root / "demo-plan.md"
        active.parent.mkdir(parents=True)
        archive.parent.mkdir(parents=True)
        local_root.mkdir()
        return repository_root, local_root, local_plan, active, archive, base

    def preflight(
        self,
        plan: Path,
        repository_root: Path,
        local_root: Path,
        local_plan: Path,
        context: str = "omp",
    ) -> executor_plan.PreflightReport:
        report = executor_plan.preflight_file(
            plan,
            context=context,
            slug="demo",
            repository_root=repository_root,
            local_root=local_root,
            local_plan=local_plan,
        )
        serialized = json.dumps(report.payload(), sort_keys=True)
        forbidden = {
            plan,
            plan.resolve(strict=False),
            repository_root,
            repository_root.resolve(strict=False),
            local_root,
            local_root.resolve(strict=False),
            local_plan,
            local_plan.resolve(strict=False),
            repository_root.parent,
        }
        for path in forbidden:
            self.assertNotIn(str(path), serialized)
        return report

    def test_real_local_and_direct_active_archive_are_eligible_in_both_contexts(
        self,
    ) -> None:
        local_bytes = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            "**Authority kind**: local-authority",
        ).encode()
        direct_bytes = COMPLETE.encode()
        for context in executor_plan.CONTEXTS:
            for authority, location in (
                ("local", "active"),
                ("local", "archive"),
                ("direct", "active"),
                ("direct", "archive"),
            ):
                with self.subTest(
                    context=context, authority=authority, location=location
                ):
                    repository_root, local_root, local_plan, active, archive, _ = (
                        self.layout()
                    )
                    repository_path = active if location == "active" else archive
                    if authority == "local":
                        local_plan.write_bytes(local_bytes)
                        repository_path.write_bytes(local_bytes)
                        presented = local_plan
                    else:
                        repository_path.write_bytes(direct_bytes)
                        presented = repository_path
                    report = self.preflight(
                        presented,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    )
                    payload = report.payload()
                    self.assertEqual(report.status, "eligible", payload)
                    self.assertEqual(report.authority_outcome, authority)
                    self.assertEqual(
                        report.authority_location,
                        "local"
                        if authority == "local"
                        else f"repository-{location}",
                    )
                    self.assertEqual(
                        set(payload),
                        {
                            "authority_location",
                            "authority_outcome",
                            "consumer",
                            "context",
                            "issues",
                            "paths",
                            "plan_id",
                            "plan_sha256",
                            "schema",
                            "status",
                            "structural",
                        },
                    )
                    self.assertEqual(payload["schema"], "executor-plan-preflight/v1")
                    self.assertEqual(payload["issues"], [])
                    self.assertEqual(payload["plan_id"], self.PLAN_ID)
                    self.assertEqual(
                        payload["plan_sha256"],
                        hashlib.sha256(
                            local_bytes if authority == "local" else direct_bytes
                        ).hexdigest(),
                    )
                    self.assertEqual(
                        payload["structural"]["plan_sha256"],
                        payload["plan_sha256"],
                    )
                    self.assertEqual(payload["structural"]["status"], "valid")
                    self.assertEqual(
                        set(payload["paths"]["active"]),
                        {"authority_kind", "path", "sha256", "state"},
                    )
                    serialized = json.dumps(payload, sort_keys=True)
                    self.assertNotIn(str(repository_root), serialized)
                    self.assertNotIn(str(local_root), serialized)

    def test_backend_cli_is_mandatory_and_planner_shape_is_unchanged(self) -> None:
        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_bytes(COMPLETE.encode())
        planner_stream = io.StringIO()
        with contextlib.redirect_stdout(planner_stream):
            planner_code = executor_plan.main(
                [str(active), "--context", "omp", "--consumer", "planner"]
            )
        planner_payload = json.loads(planner_stream.getvalue())
        self.assertEqual(planner_code, 0)
        self.assertEqual(planner_payload["schema"], "executor-plan-validation/v1")
        self.assertEqual(
            set(planner_payload),
            {"consumer", "context", "issues", "plan_sha256", "schema", "status"},
        )

        backend_stream = io.StringIO()
        with contextlib.redirect_stdout(backend_stream):
            backend_code = executor_plan.main(
                [str(active), "--context", "omp", "--consumer", "backend"]
            )
        backend_payload = json.loads(backend_stream.getvalue())
        self.assertEqual(backend_code, 66)
        self.assertEqual(backend_payload["schema"], "executor-plan-preflight/v1")
        self.assertEqual(backend_payload["status"], "unavailable")
        self.assertEqual(
            [issue["code"] for issue in backend_payload["issues"]],
            ["PLAN_PREFLIGHT_UNAVAILABLE"],
        )

        complete_stream = io.StringIO()
        with contextlib.redirect_stdout(complete_stream):
            complete_code = executor_plan.main(
                [
                    str(active),
                    "--context",
                    "grok",
                    "--consumer",
                    "backend",
                    "--slug",
                    "demo",
                    "--repository-root",
                    str(repository_root),
                    "--local-root",
                    str(local_root),
                    "--local-plan",
                    str(local_plan),
                ]
            )
        self.assertEqual(complete_code, 0)
        self.assertEqual(json.loads(complete_stream.getvalue())["status"], "eligible")

        misuse_cases = (
            [
                str(active),
                "--context",
                "omp",
                "--consumer",
                "planner",
                "--slug",
                "demo",
            ],
            [
                str(active),
                "--context",
                "omp",
                "--consumer",
                "backend",
                "--slug",
                "demo",
                "--slug",
                "other",
            ],
            [
                str(active),
                "--context",
                "omp",
                "--consumer",
                "backend",
                "--approval",
                "approved",
            ],
        )
        for arguments in misuse_cases:
            with self.subTest(arguments=arguments):
                with contextlib.redirect_stderr(io.StringIO()):
                    with self.assertRaises(SystemExit) as caught:
                        executor_plan.main(arguments)
                self.assertEqual(caught.exception.code, 2)

    def test_projection_context_counterpart_and_unclassified_fail_closed(self) -> None:
        local_bytes = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            "**Authority kind**: local-authority",
        ).encode()
        unmarked = COMPLETE.replace(
            "**Authority kind**: direct-repository\n", "", 1
        ).encode()

        for context in executor_plan.CONTEXTS:
            cases = []

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            active.write_bytes(local_bytes)
            cases.append(
                (
                    "orphan-local-projection",
                    self.preflight(
                        active,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_AUTHORITY_CONTEXT",
                )
            )

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            local_plan.write_bytes(local_bytes)
            cases.append(
                (
                    "missing-projection",
                    self.preflight(
                        local_plan,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_PROJECTION_MISSING",
                )
            )

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            local_plan.write_bytes(COMPLETE.encode())
            cases.append(
                (
                    "local-declares-direct",
                    self.preflight(
                        local_plan,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_AUTHORITY_CONTEXT",
                )
            )

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            active.write_bytes(COMPLETE.encode())
            local_plan.write_bytes(local_bytes)
            cases.append(
                (
                    "direct-local-conflict",
                    self.preflight(
                        active,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_AUTHORITY_CONFLICT",
                )
            )

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            active.write_bytes(unmarked)
            cases.append(
                (
                    "unmarked",
                    self.preflight(
                        active,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_AUTHORITY_UNCLASSIFIED",
                )
            )

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            local_plan.write_bytes(local_bytes)
            active.write_bytes(
                replace_once(
                    local_bytes.decode(),
                    "**Summary**: Change one rule and its shared validator without provider-specific semantics.",
                    "**Summary**: Projection drift.",
                ).encode()
            )
            cases.append(
                (
                    "projection-drift",
                    self.preflight(
                        local_plan,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_PROJECTION_DRIFT",
                )
            )

            repository_root, local_root, local_plan, active, _, _ = self.layout()
            active.write_bytes(local_bytes)
            local_plan.write_bytes(local_bytes)
            local_plan.chmod(0)
            self.addCleanup(
                lambda path=local_plan: path.chmod(0o600) if path.exists() else None
            )
            cases.append(
                (
                    "projection-with-unreadable-local",
                    self.preflight(
                        active,
                        repository_root,
                        local_root,
                        local_plan,
                        context,
                    ),
                    "PLAN_AUTHORITY_UNREADABLE",
                )
            )

            for label, report, expected_code in cases:
                with self.subTest(context=context, case=label):
                    self.assertNotEqual(report.status, "eligible", report.payload())
                    self.assertIn(
                        expected_code, {issue.code for issue in report.issues}
                    )

    def test_unreadable_unsafe_ambiguous_status_body_and_wrong_mapping_fail(self) -> None:
        local_bytes = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            "**Authority kind**: local-authority",
        ).encode()

        repository_root, local_root, local_plan, active, archive, _ = self.layout()
        active.write_bytes(COMPLETE.encode())
        archive.write_bytes(COMPLETE.encode())
        ambiguous = self.preflight(
            active, repository_root, local_root, local_plan
        )
        self.assertEqual(ambiguous.authority_outcome, "ambiguous")
        self.assertEqual(
            [issue.code for issue in ambiguous.issues],
            ["PLAN_PROJECTION_AMBIGUOUS"],
        )

        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_bytes(COMPLETE.encode())
        local_plan.write_bytes(local_bytes)
        local_plan.chmod(0)
        self.addCleanup(
            lambda path=local_plan: path.chmod(0o600) if path.exists() else None
        )
        unreadable = self.preflight(
            active, repository_root, local_root, local_plan
        )
        self.assertEqual(unreadable.status, "unavailable")
        self.assertIn(
            "PLAN_AUTHORITY_UNREADABLE",
            {issue.code for issue in unreadable.issues},
        )

        repository_root, local_root, local_plan, active, _, base = self.layout()
        active.write_bytes(COMPLETE.encode())
        outside = base / "outside-plan.md"
        outside.write_bytes(local_bytes)
        outside_mapping = self.preflight(
            active, repository_root, local_root, outside
        )
        self.assertEqual(outside_mapping.status, "unavailable")
        self.assertEqual(
            [issue.code for issue in outside_mapping.issues],
            ["PLAN_PREFLIGHT_UNAVAILABLE"],
        )

        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_bytes(COMPLETE.encode())
        local_plan.symlink_to(active)
        unsafe = self.preflight(active, repository_root, local_root, local_plan)
        self.assertEqual(unsafe.status, "unavailable")
        self.assertIn(
            "PLAN_FILE_KIND_UNSAFE", {issue.code for issue in unsafe.issues}
        )
        repository_root, local_root, local_plan, active, _, _ = self.layout()
        os.mkfifo(active)
        special = self.preflight(active, repository_root, local_root, local_plan)
        self.assertEqual(special.status, "blocked")
        self.assertEqual(
            [issue.code for issue in special.issues], ["PLAN_FILE_KIND_UNSAFE"]
        )

        repository_root, local_root, local_plan, active, _, _ = self.layout()
        wrong = active.with_name("2026-08-09-1700_wrong.md")
        wrong.write_bytes(COMPLETE.encode())
        wrong_candidate = self.preflight(
            wrong, repository_root, local_root, local_plan
        )
        self.assertEqual(wrong_candidate.status, "unavailable")
        self.assertEqual(
            [issue.code for issue in wrong_candidate.issues],
            ["PLAN_IDENTITY_MISMATCH"],
        )

        repository_root, local_root, local_plan, active, _, base = self.layout()
        active.write_bytes(COMPLETE.encode())
        repository_alias = base / "repository-alias"
        repository_alias.symlink_to(repository_root, target_is_directory=True)
        alias_result = self.preflight(
            active, repository_alias, local_root, local_plan
        )
        self.assertEqual(alias_result.status, "unavailable")
        self.assertEqual(
            [issue.code for issue in alias_result.issues],
            ["PLAN_PREFLIGHT_UNAVAILABLE"],
        )


        terminal_text = replace_once(
            COMPLETE,
            "**Status**: PENDING",
            "**Status**: DONE\n**Completed At**: 2026-08-09-1800",
        )
        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_text(terminal_text)
        terminal = self.preflight(active, repository_root, local_root, local_plan)
        self.assertEqual(terminal.status, "blocked")
        self.assertEqual(
            [issue.code for issue in terminal.issues],
            ["PLAN_STATUS_NONEXECUTABLE"],
        )

        invalid_body = remove_section(COMPLETE, "Target map")
        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_text(invalid_body)
        body = self.preflight(active, repository_root, local_root, local_plan)
        self.assertEqual(body.status, "blocked")
        self.assertEqual(body.issues, ())
        self.assertEqual(body.structural["status"], "invalid")
        self.assertIn(
            "SECTION_MISSING",
            {issue["code"] for issue in body.structural["issues"]},
        )

    def test_two_observation_state_change_is_unavailable_without_retry(self) -> None:
        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_bytes(COMPLETE.encode())
        original = executor_plan._observe_path
        calls: dict[Path, int] = {}

        def changing(root: Path, path: Path, display_path: str):
            observation = original(root, path, display_path)
            calls[path] = calls.get(path, 0) + 1
            if path == active and calls[path] == 2:
                active.write_bytes(
                    replace_once(
                        COMPLETE,
                        "**Summary**: Change one rule and its shared validator without provider-specific semantics.",
                        "**Summary**: Changed during the bounded observation.",
                    ).encode()
                )
            return observation

        with mock.patch.object(executor_plan, "_observe_path", side_effect=changing):
            report = self.preflight(
                active, repository_root, local_root, local_plan
            )
        self.assertEqual(report.status, "unavailable")
        self.assertEqual(report.authority_outcome, "invalid")
        self.assertEqual(
            [issue.code for issue in report.issues], ["PLAN_STATE_STALE"]
        )
        self.assertEqual(report.paths["active"]["state"], "stale")


    def test_mismatched_nested_digest_is_never_eligible(self) -> None:
        repository_root, local_root, local_plan, active, _, _ = self.layout()
        active.write_bytes(COMPLETE.encode())
        forged = executor_plan.Report(
            context="omp",
            consumer="backend",
            plan_sha256="0" * 64,
            issues=(),
        )
        with mock.patch.object(executor_plan, "validate_text", return_value=forged):
            report = self.preflight(
                active, repository_root, local_root, local_plan
            )
        self.assertEqual(report.status, "unavailable")
        self.assertEqual(report.authority_outcome, "invalid")
        self.assertEqual(
            [issue.code for issue in report.issues], ["PLAN_STATE_STALE"]
        )

    def test_header_rejection_precedes_identity_and_redacts_malformed_datetime(
        self,
    ) -> None:
        repository_root, local_root, local_plan, _, _, base = self.layout()
        secret = f"{base}/SECRET-DATETIME"
        malformed = replace_once(
            COMPLETE,
            "**Datetime**: 2026-08-09-1700",
            f"**Datetime**: {secret}",
        )
        local_plan.write_text(malformed)

        report = self.preflight(
            local_plan, repository_root, local_root, local_plan
        )
        payload = report.payload()
        serialized = json.dumps(payload, sort_keys=True)
        self.assertEqual(report.status, "blocked")
        self.assertEqual(report.authority_outcome, "invalid")
        self.assertIsNone(report.plan_id)
        self.assertEqual(
            [(issue.code, issue.subject) for issue in report.issues],
            [("PLAN_IDENTITY_MISMATCH", "header")],
        )
        self.assertIsNone(payload["paths"]["active"]["path"])
        self.assertIsNone(payload["paths"]["archive"]["path"])
        self.assertNotIn(secret, serialized)
        self.assertNotIn("SECRET-DATETIME", serialized)

        stdout = io.StringIO()
        stderr = io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            code = executor_plan.main(
                [
                    str(local_plan),
                    "--context",
                    "omp",
                    "--consumer",
                    "backend",
                    "--slug",
                    "demo",
                    "--repository-root",
                    str(repository_root),
                    "--local-root",
                    str(local_root),
                    "--local-plan",
                    str(local_plan),
                ]
            )
        self.assertEqual(code, 2)
        self.assertNotIn(secret, stdout.getvalue())
        self.assertNotIn("SECRET-DATETIME", stdout.getvalue())
        self.assertEqual(stderr.getvalue(), "")

    def test_descriptor_observation_rejects_path_swaps_and_midread_drift(
        self,
    ) -> None:
        repository_root, _, _, active, _, base = self.layout()
        active.write_bytes(COMPLETE.encode())
        original_open = executor_plan.os.open

        saved = base / "saved-active.md"
        outside = base / "outside-secret.md"
        outside.write_text("outside-secret")
        swapped = False

        def symlink_swap(file, flags, *args, **kwargs):
            nonlocal swapped
            if file == active.name and kwargs.get("dir_fd") is not None and not swapped:
                swapped = True
                active.rename(saved)
                active.symlink_to(outside)
                try:
                    return original_open(file, flags, *args, **kwargs)
                finally:
                    active.unlink()
                    saved.rename(active)
            return original_open(file, flags, *args, **kwargs)

        with mock.patch.object(executor_plan.os, "open", side_effect=symlink_swap):
            observation = executor_plan._observe_path(
                repository_root,
                active,
                ".agents/plans/2026-08-09-1700_demo.md",
            )
        self.assertEqual(observation.state, "unreadable")
        self.assertEqual(outside.read_text(), "outside-secret")
        self.assertEqual(active.read_bytes(), COMPLETE.encode())

        replacement = base / "replacement-active.md"
        replacement.write_bytes(
            replace_once(
                COMPLETE,
                "**Summary**: Change one rule and its shared validator without provider-specific semantics.",
                "**Summary**: Replacement inode.",
            ).encode()
        )
        restored = base / "restored-active.md"
        swapped = False

        def inode_swap_and_restore(file, flags, *args, **kwargs):
            nonlocal swapped
            if file == active.name and kwargs.get("dir_fd") is not None and not swapped:
                swapped = True
                active.rename(restored)
                replacement.rename(active)
                descriptor = original_open(file, flags, *args, **kwargs)
                active.rename(replacement)
                restored.rename(active)
                return descriptor
            return original_open(file, flags, *args, **kwargs)

        with mock.patch.object(
            executor_plan.os, "open", side_effect=inode_swap_and_restore
        ):
            observation = executor_plan._observe_path(
                repository_root,
                active,
                ".agents/plans/2026-08-09-1700_demo.md",
            )
        self.assertEqual(observation.state, "stale")
        self.assertEqual(active.read_bytes(), COMPLETE.encode())

        changed = replace_once(
            COMPLETE,
            "**Summary**: Change one rule and its shared validator without provider-specific semantics.",
            "**Summary**: Midread mutation.",
        ).encode()
        original_fdopen = executor_plan.os.fdopen

        class MutatingReader:
            def __init__(self, reader):
                self.reader = reader

            def __enter__(self):
                self.reader.__enter__()
                return self

            def read(self):
                data = self.reader.read()
                active.write_bytes(changed)
                return data

            def __exit__(self, *args):
                return self.reader.__exit__(*args)

        def mutating_fdopen(*args, **kwargs):
            return MutatingReader(original_fdopen(*args, **kwargs))

        active.write_bytes(COMPLETE.encode())
        with mock.patch.object(
            executor_plan.os, "fdopen", side_effect=mutating_fdopen
        ):
            observation = executor_plan._observe_path(
                repository_root,
                active,
                ".agents/plans/2026-08-09-1700_demo.md",
            )
        self.assertEqual(observation.state, "stale")

    def test_unsafe_and_unreadable_repository_states_precede_ambiguity(
        self,
    ) -> None:
        local_bytes = replace_once(
            COMPLETE,
            "**Authority kind**: direct-repository",
            "**Authority kind**: local-authority",
        ).encode()

        def state_case(
            active_state: str, archive_state: str
        ) -> executor_plan.PreflightReport:
            repository_root, local_root, local_plan, active, archive, base = (
                self.layout()
            )
            local_plan.write_bytes(local_bytes)
            outside = base / "outside.md"
            outside.write_bytes(local_bytes)
            for path, state in ((active, active_state), (archive, archive_state)):
                if state == "regular":
                    path.write_bytes(local_bytes)
                elif state == "unsafe":
                    path.symlink_to(outside)
                elif state == "unreadable":
                    path.write_bytes(local_bytes)
                    path.chmod(0)
                    self.addCleanup(
                        lambda target=path: target.chmod(0o600)
                        if target.exists() and not target.is_symlink()
                        else None
                    )
                elif state != "missing":
                    raise AssertionError(state)
            return self.preflight(
                local_plan, repository_root, local_root, local_plan
            )

        for active_state, archive_state, expected in (
            ("unsafe", "regular", "PLAN_FILE_KIND_UNSAFE"),
            ("regular", "unreadable", "PLAN_AUTHORITY_UNREADABLE"),
            ("unsafe", "unsafe", "PLAN_FILE_KIND_UNSAFE"),
            ("unreadable", "unreadable", "PLAN_AUTHORITY_UNREADABLE"),
        ):
            with self.subTest(active=active_state, archive=archive_state):
                report = state_case(active_state, archive_state)
                self.assertEqual(report.status, "unavailable")
                self.assertEqual(report.authority_outcome, "invalid")
                self.assertEqual([issue.code for issue in report.issues], [expected])
                self.assertNotIn(
                    "PLAN_PROJECTION_AMBIGUOUS",
                    {issue.code for issue in report.issues},
                )

        safe_missing = state_case("missing", "regular")
        self.assertEqual(safe_missing.status, "eligible")
        self.assertEqual(safe_missing.authority_outcome, "local")

if __name__ == "__main__":
    unittest.main()
