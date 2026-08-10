from __future__ import annotations

import contextlib
import io
import json
import re
import tempfile
import unittest
from pathlib import Path

import executor_plan


SCRIPT_DIR = Path(__file__).resolve().parent
FIXTURE = SCRIPT_DIR / "fixtures/executor_plan/complete.md"
COMPLETE = FIXTURE.read_text(encoding="utf-8")


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

    def test_complete_fixture_is_identical_for_omp_and_grok_consumers(self) -> None:
        reports = [
            executor_plan.validate_text(COMPLETE, context=context, consumer=consumer)
            for context in executor_plan.CONTEXTS
            for consumer in executor_plan.CONSUMERS
        ]
        self.assertTrue(all(report.valid for report in reports), reports)
        self.assertEqual(
            {report.plan_sha256 for report in reports}, {reports[0].plan_sha256}
        )
        self.assertEqual({report.issues for report in reports}, {()})
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
                    [str(plan), "--context", "grok", "--consumer", "backend"]
                )
            payload = json.loads(stream.getvalue())
            self.assertEqual(code, 2)
            self.assertEqual(payload["status"], "invalid")
            self.assertEqual(sentinel.read_bytes(), b"unchanged\n")
            self.assertEqual(plan.read_text(encoding="utf-8"), invalid)


if __name__ == "__main__":
    unittest.main()
