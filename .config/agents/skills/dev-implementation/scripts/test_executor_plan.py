from __future__ import annotations

import contextlib
import io
import hashlib
import json
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
        report = executor_plan.validate_text(text)
        self.assertFalse(report.valid)
        self.assertIn(code, {issue.code for issue in report.issues})

    def assert_valid_matrix(self, cases: dict[str, str]) -> dict[str, str]:
        digests: dict[str, str] = {}
        for label, text in cases.items():
            with self.subTest(case=label):
                expected_digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
                digests[label] = expected_digest
                report = executor_plan.validate_text(text)
                self.assertTrue(report.valid, report)
                self.assertEqual(report.plan_sha256, expected_digest)
                self.assertEqual(report.issues, ())
        return digests

    def test_complete_fixture_report_and_digest_contract(self) -> None:
        report = executor_plan.validate_text(COMPLETE)
        payload = report.payload()
        self.assertTrue(report.valid, report)
        self.assertEqual(
            list(payload),
            [
                "schema",
                "status",
                "issues",
                "plan_sha256",
                "datetime",
                "lifecycle_status",
                "terminal_complete",
            ],
        )
        self.assertEqual(payload["schema"], "executor-plan-validation/v1")
        self.assertEqual(payload["status"], "valid")
        self.assertEqual(payload["issues"], [])
        self.assertEqual(payload["datetime"], "2026-08-09-1700")
        self.assertEqual(payload["lifecycle_status"], "PENDING")
        self.assertFalse(payload["terminal_complete"])
        self.assertEqual(
            report.plan_sha256,
            hashlib.sha256(COMPLETE.encode("utf-8")).hexdigest(),
        )
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

    def test_task_shape_positive_matrix(self) -> None:
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

        unsupported = replace_once(
            COMPLETE, "- Assurance: standard", "- Assurance: maximal"
        )
        self.assert_issue(unsupported, "ASSURANCE_PROFILE_INVALID")

    def test_header_mode_line_endings_and_issue_matrix(self) -> None:
        with_mode = replace_once(
            COMPLETE,
            "**Datetime**: 2026-08-09-1700\n**Scope**",
            "**Datetime**: 2026-08-09-1700\n**Mode**: standard\n**Scope**",
        )
        self.assertTrue(executor_plan.validate_text(with_mode).valid)

        crlf = COMPLETE.replace("\n", "\r\n")
        mixed = "".join(
            line + ("\r\n" if index % 2 else "\n")
            for index, line in enumerate(COMPLETE.splitlines())
        )
        for label, text in (("crlf", crlf), ("mixed", mixed)):
            with self.subTest(line_endings=label):
                report = executor_plan.validate_text(text)
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
            "h1": (
                replace_once(
                    COMPLETE,
                    "# Portable executor fixture",
                    "Portable executor fixture",
                ),
                "HEADER_H1",
            ),
            "split-block": (
                replace_once(
                    COMPLETE,
                    "**Datetime**: 2026-08-09-1700\n**Scope**",
                    "**Datetime**: 2026-08-09-1700\n\n**Scope**",
                ),
                "HEADER_METADATA_BLOCK",
            ),
            "missing": (
                COMPLETE.replace(
                    "**Scope**: Portable plan validation fixture\n", "", 1
                ),
                "HEADER_FIELD_MISSING",
            ),
            "duplicate": (
                replace_once(
                    COMPLETE,
                    "**Scope**: Portable plan validation fixture",
                    "**Scope**: Portable plan validation fixture\n"
                    "**Scope**: Portable plan validation fixture",
                ),
                "HEADER_FIELD_DUPLICATE",
            ),
            "unknown": (
                replace_once(
                    COMPLETE,
                    "**Scope**: Portable plan validation fixture",
                    "**Provenance**: repository",
                ),
                "HEADER_FIELD_UNKNOWN",
            ),
            "field-case": (
                replace_once(
                    COMPLETE,
                    "**Scope**: Portable plan validation fixture",
                    "**scope**: Portable plan validation fixture",
                ),
                "HEADER_FIELD_CASE",
            ),
            "malformed": (
                replace_once(
                    COMPLETE,
                    "**Scope**: Portable plan validation fixture",
                    "**Scope**:\tPortable plan validation fixture",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "wrong-order": (
                replace_once(
                    COMPLETE,
                    "**Datetime**: 2026-08-09-1700\n"
                    "**Scope**: Portable plan validation fixture",
                    "**Scope**: Portable plan validation fixture\n"
                    "**Datetime**: 2026-08-09-1700",
                ),
                "HEADER_FIELD_ORDER",
            ),
            "value": (
                replace_once(
                    COMPLETE,
                    "**Datetime**: 2026-08-09-1700",
                    "**Datetime**: 2026-13-09-1700",
                ),
                "HEADER_FIELD_VALUE",
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
                    "**Scope**: Portable plan validation fixture",
                    "**Sco\rpe**: Portable plan validation fixture",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "bare-cr-delimiter": (
                replace_once(
                    COMPLETE,
                    "**Scope**: Portable plan validation fixture",
                    "**Scope**\r: Portable plan validation fixture",
                ),
                "HEADER_FIELD_MALFORMED",
            ),
            "bare-cr-value": (
                replace_once(
                    COMPLETE,
                    "**Scope**: Portable plan validation fixture",
                    "**Scope**: Portable\r plan validation fixture",
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
            "**Scope**: Portable plan validation fixture",
            f"**Scope**:{secret}",
        )
        report = executor_plan.validate_text(secret_text)
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
        report = executor_plan.validate_text(secret_body)
        self.assertFalse(report.valid)
        self.assertIn("WAVE_SHAPE", {issue.code for issue in report.issues})
        self.assertNotIn(body_secret, json.dumps(report.payload(), sort_keys=True))

    def test_lowercase_todo_is_domain_prose_and_uppercase_placeholder_fails(
        self,
    ) -> None:
        legitimate = replace_once(
            COMPLETE,
            "- Observable end state: The rule and validator expose one closed portable execution contract.",
            "- Observable end state: The todo projection remains a derivative presentation.",
        )
        report = executor_plan.validate_text(legitimate)
        self.assertTrue(report.valid, report)

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
            "| TGT-RULE | rules/plan-impl-spec.md | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | plan author and complete fixture | AC06 |",
            "| TGT-RULE | rules/plan-impl-spec.md | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | plan author and complete fixture | AC07 |",
        ).replace(
            "| TGT-SCRIPT | scripts/executor_plan.py | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | helper and backend readiness | AC07 |",
            "| TGT-SCRIPT | scripts/executor_plan.py | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | helper and backend readiness | AC06 |",
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
                        code = executor_plan.main(["validate", str(plan)])
                    payload = json.loads(stream.getvalue())
                    self.assertEqual(code, 2)
                    self.assertEqual(payload["status"], "invalid")
                    self.assertIn(
                        expected_code,
                        {issue["code"] for issue in payload["issues"]},
                    )
                    self.assertEqual(plan.read_bytes(), before)
                    self.assertEqual(sentinel.read_bytes(), b"unchanged\n")

    def test_invalid_plan_fails_validation_without_mutation(self) -> None:
        invalid = remove_section(COMPLETE, "Target map")
        with tempfile.TemporaryDirectory(prefix="executor-plan-") as temporary:
            root = Path(temporary)
            plan = root / "plan.md"
            sentinel = root / "mutation-sentinel"
            plan.write_text(invalid, encoding="utf-8")
            sentinel.write_bytes(b"unchanged\n")
            stream = io.StringIO()
            with contextlib.redirect_stdout(stream):
                code = executor_plan.main(["validate", str(plan)])
            payload = json.loads(stream.getvalue())
            self.assertEqual(code, 2)
            self.assertEqual(payload["status"], "invalid")
            self.assertEqual(sentinel.read_bytes(), b"unchanged\n")
            self.assertEqual(plan.read_text(encoding="utf-8"), invalid)


class ExecutorPlanLifecycleTests(unittest.TestCase):
    TASK_IDS = ("T1", "T2", "T3", "T4", "T5")
    COMPLETED = "2026-08-09-1800"

    def terminal_plan(self, *, bulleted: bool = False) -> str:
        record = (
            f"  - completed {self.COMPLETED}"
            if bulleted
            else f"  completed {self.COMPLETED}"
        )
        text = COMPLETE
        for task_id in self.TASK_IDS:
            pattern = re.compile(rf"(?m)^- \[ \] ({task_id}\..+)$")
            text, count = pattern.subn(
                lambda match: f"- [x] {match.group(1)}\n{record}",
                text,
                count=1,
            )
            self.assertEqual(count, 1, task_id)
        text, verification_count = re.subn(
            r"(?m)^- \[ \] (VR-[A-Z0-9][A-Z0-9-]*\..+)$",
            r"- [x] \1",
            text,
        )
        self.assertEqual(verification_count, 5)
        text = replace_once(
            text,
            "**Status**: PENDING",
            f"**Status**: DONE\n**Completed At**: {self.COMPLETED}",
        )
        return (
            text.rstrip("\n")
            + "\n\n## Completion Summary\n\n"
            + "- Fixture completed with no residual risk.\n"
        )

    def assert_issue(self, text: str, code: str, named: str | None = None) -> None:
        report = executor_plan.validate_text(text)
        self.assertFalse(report.valid)
        self.assertFalse(report.terminal_complete)
        matches = [issue for issue in report.issues if issue.code == code]
        self.assertTrue(matches, report)
        if named is not None:
            self.assertIn(named, matches[0].message)

    def test_both_completion_record_spellings_have_identical_terminal_meaning(
        self,
    ) -> None:
        reports = [
            executor_plan.validate_text(self.terminal_plan(bulleted=bulleted))
            for bulleted in (False, True)
        ]
        for report in reports:
            self.assertTrue(report.valid, report)
            self.assertEqual(report.datetime, "2026-08-09-1700")
            self.assertEqual(report.lifecycle_status, "DONE")
            self.assertTrue(report.terminal_complete)
        self.assertNotEqual(reports[0].plan_sha256, reports[1].plan_sha256)
        self.assertEqual(
            [
                (
                    report.payload()["status"],
                    report.lifecycle_status,
                    report.terminal_complete,
                )
                for report in reports
            ],
            [("valid", "DONE", True), ("valid", "DONE", True)],
        )

    def test_in_progress_checked_task_requires_an_immediate_record(self) -> None:
        task_line = "- [ ] T1. Define the portable section contract"
        checked = replace_once(
            COMPLETE,
            task_line,
            "- [x] T1. Define the portable section contract\n"
            f"  completed {self.COMPLETED}",
        )
        checked = replace_once(
            checked,
            "**Status**: PENDING",
            "**Status**: IN_PROGRESS",
        )
        report = executor_plan.validate_text(checked)
        self.assertTrue(report.valid, report)
        self.assertEqual(report.lifecycle_status, "IN_PROGRESS")
        self.assertFalse(report.terminal_complete)

        missing = replace_once(COMPLETE, task_line, task_line.replace("[ ]", "[x]"))
        self.assert_issue(
            missing,
            "LIFECYCLE_TASK_COMPLETION_MISSING",
            "T1",
        )
        misplaced = replace_once(
            missing,
            "  - Owner: rule-worker",
            "  - Owner: rule-worker\n"
            f"  completed {self.COMPLETED}",
        )
        self.assert_issue(
            misplaced,
            "LIFECYCLE_TASK_COMPLETION_INVALID",
        )

    def test_done_terminal_defect_matrix(self) -> None:
        valid = self.terminal_plan()
        first_record = f"  completed {self.COMPLETED}"
        cases = {
            "unchecked-task": (
                replace_once(valid, "- [x] T1.", "- [ ] T1."),
                "LIFECYCLE_TASK_UNCHECKED",
                "T1",
            ),
            "missing-record": (
                valid.replace(first_record + "\n", "", 1),
                "LIFECYCLE_TASK_COMPLETION_MISSING",
                "T1",
            ),
            "invalid-record": (
                valid.replace(
                    first_record,
                    "  completed 2026-13-09-1800",
                    1,
                ),
                "LIFECYCLE_TASK_COMPLETION_INVALID",
                "T1",
            ),
            "duplicate-record": (
                valid.replace(
                    first_record,
                    first_record + "\n" + first_record,
                    1,
                ),
                "LIFECYCLE_TASK_COMPLETION_DUPLICATE",
                "T1",
            ),
            "unchecked-criterion": (
                replace_once(valid, "- [x] VR-AC06.", "- [ ] VR-AC06."),
                "LIFECYCLE_CRITERION_UNCHECKED",
                "VR-AC06",
            ),
            "missing-completed-at": (
                valid.replace(f"**Completed At**: {self.COMPLETED}\n", "", 1),
                "LIFECYCLE_COMPLETED_AT_INVALID",
                None,
            ),
            "invalid-completed-at": (
                replace_once(
                    valid,
                    f"**Completed At**: {self.COMPLETED}",
                    "**Completed At**: 2026-13-09-1800",
                ),
                "LIFECYCLE_COMPLETED_AT_INVALID",
                None,
            ),
            "missing-summary": (
                remove_section(valid, "Completion Summary"),
                "LIFECYCLE_COMPLETION_SUMMARY_INVALID",
                None,
            ),
            "empty-summary": (
                replace_once(
                    valid,
                    "- Fixture completed with no residual risk.",
                    "",
                ),
                "LIFECYCLE_COMPLETION_SUMMARY_INVALID",
                None,
            ),
        }
        for label, (text, code, named) in cases.items():
            with self.subTest(case=label):
                self.assert_issue(text, code, named)

    def test_closed_is_terminal_without_finished_work_or_summary(self) -> None:
        closed = replace_once(
            COMPLETE,
            "**Status**: PENDING",
            "**Status**: CLOSED",
        )
        report = executor_plan.validate_text(closed)
        self.assertTrue(report.valid, report)
        self.assertEqual(report.lifecycle_status, "CLOSED")
        self.assertTrue(report.terminal_complete)

        with_completed_at = replace_once(
            closed,
            "**Status**: CLOSED",
            f"**Status**: CLOSED\n**Completed At**: {self.COMPLETED}",
        )
        self.assert_issue(
            with_completed_at,
            "LIFECYCLE_COMPLETED_AT_INVALID",
        )

    def test_nonterminal_completed_at_is_invalid(self) -> None:
        pending = replace_once(
            COMPLETE,
            "**Status**: PENDING",
            f"**Status**: PENDING\n**Completed At**: {self.COMPLETED}",
        )
        self.assert_issue(pending, "LIFECYCLE_COMPLETED_AT_INVALID")

    def test_validate_file_reads_one_snapshot_and_preserves_current_bytes(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory(prefix="executor-plan-current-") as temporary:
            plan = Path(temporary) / "plan.md"
            plan.write_text(COMPLETE, encoding="utf-8")
            before = plan.read_bytes()
            original_read_bytes = Path.read_bytes
            reads: list[Path] = []

            def counted_read_bytes(path: Path) -> bytes:
                reads.append(path)
                return original_read_bytes(path)

            with mock.patch.object(Path, "read_bytes", counted_read_bytes):
                report = executor_plan.validate_file(plan)

            self.assertTrue(report.valid, report)
            self.assertEqual(reads, [plan])
            self.assertEqual(plan.read_bytes(), before)
            self.assertEqual(
                report.plan_sha256,
                hashlib.sha256(before).hexdigest(),
            )

    def test_cli_validate_contract_unavailable_file_and_misuse(self) -> None:
        with tempfile.TemporaryDirectory(prefix="executor-plan-cli-") as temporary:
            root = Path(temporary)
            plan = root / "plan.md"
            plan.write_text(COMPLETE, encoding="utf-8")
            before = plan.read_bytes()

            stream = io.StringIO()
            with contextlib.redirect_stdout(stream):
                code = executor_plan.main(["validate", str(plan)])
            payload = json.loads(stream.getvalue())
            self.assertEqual(code, 0)
            self.assertEqual(
                list(payload),
                [
                    "schema",
                    "status",
                    "issues",
                    "plan_sha256",
                    "datetime",
                    "lifecycle_status",
                    "terminal_complete",
                ],
            )

            missing_stream = io.StringIO()
            with contextlib.redirect_stdout(missing_stream):
                missing_code = executor_plan.main(
                    ["validate", str(root / "missing.md")]
                )
            missing_payload = json.loads(missing_stream.getvalue())
            self.assertEqual(missing_code, 66)
            self.assertEqual(missing_payload["status"], "unavailable")
            self.assertEqual(
                missing_payload["issues"][0]["code"],
                "FILE_UNAVAILABLE",
            )

            misuse = (
                [],
                [str(plan)],
                ["validate"],
                ["validate", str(plan), "-" * 2 + "context", "omp"],
                ["unknown", str(plan)],
            )
            for arguments in misuse:
                with self.subTest(arguments=arguments):
                    with contextlib.redirect_stderr(io.StringIO()):
                        with self.assertRaises(SystemExit) as caught:
                            executor_plan.main(arguments)
                    self.assertEqual(caught.exception.code, 2)
            self.assertEqual(plan.read_bytes(), before)

if __name__ == "__main__":
    unittest.main()
