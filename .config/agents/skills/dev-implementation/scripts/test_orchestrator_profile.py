from __future__ import annotations

import contextlib
import copy
import io
import json
import tempfile
import unittest
from pathlib import Path

import orchestrator_profile as profile_contract


TASK_DIGEST = "1" * 64
PLAN_DIGEST = "2" * 64


def profile(*, downgrade: bool = False) -> dict[str, object]:
    value: dict[str, object] = {
        "schema": profile_contract.PROFILE_SCHEMA,
        "task_contract_sha256": TASK_DIGEST,
        "executor_plan_sha256": PLAN_DIGEST,
        "authority_revision": "authority-revision-7",
        "runtime": {
            "identity": "root-parent",
            "harness_adapter": "native-task-adapter",
            "model_selector": "approved-parent",
            "model_selector_source": "launch-profile",
            "model_resolved": "capable-parent-model",
            "reasoning_level": "high",
            "fallback": "none",
        },
        "capabilities": {
            capability: "native" for capability in profile_contract.CAPABILITIES
        },
        "limits": {
            "max_child_depth": 1,
            "max_concurrency": 4,
            "isolation": "shared-workspace",
            "fan_in": "neutral-when-required",
            "effects": "repository-only",
        },
        "evidence": {path: "live-attested" for path in profile_contract.BOUND_PATHS},
        "downgrade": "none",
    }
    if downgrade:
        value["downgrade"] = {
            "mode": "one-owner-sequential",
            "approved": True,
            "executor_plan_sha256": PLAN_DIGEST,
            "owner": "qualified-owner",
            "preserves": list(profile_contract.PRESERVES),
        }
    return value


def attestation(expected: dict[str, object]) -> dict[str, object]:
    observed = copy.deepcopy(expected)
    observed["schema"] = profile_contract.ATTESTATION_SCHEMA
    observed.pop("downgrade")
    return observed


class OrchestratorProfileTests(unittest.TestCase):
    def test_exact_live_profile_allows_full_orchestration(self) -> None:
        expected = profile()
        result = profile_contract.assess(expected, attestation(expected))
        self.assertEqual(result.decision, "full-orchestration")
        self.assertEqual(result.mismatches, ())
        self.assertEqual(result.profile_plan_sha256, PLAN_DIGEST)
        self.assertEqual(
            profile_contract.PROFILE_SCHEMA, "orchestrator-role-profile/v1"
        )
        self.assertEqual(
            profile_contract.ATTESTATION_SCHEMA, "orchestrator-attestation/v1"
        )
        self.assertEqual(
            profile_contract.ASSESSMENT_SCHEMA,
            "orchestrator-profile-assessment/v1",
        )

    def test_plan_backed_exact_live_profile_requires_no_downgrade(self) -> None:
        expected = profile()
        observed = attestation(expected)
        result = profile_contract.assess_plan_backed(expected, observed)
        self.assertEqual(result.decision, "full-orchestration")
        self.assertEqual(result.mismatches, ())
        self.assertEqual(result.profile_plan_sha256, PLAN_DIGEST)
        self.assertEqual(
            result.payload()["schema"], "orchestrator-profile-assessment/v1"
        )

    def test_plan_backed_prohibits_an_approved_generic_downgrade(self) -> None:
        expected = profile(downgrade=True)
        observed = attestation(expected)
        self.assertEqual(
            profile_contract.assess(expected, observed).decision,
            "full-orchestration",
        )
        result = profile_contract.assess_plan_backed(expected, observed)
        self.assertEqual(result.decision, "transport-unavailable")
        self.assertEqual(result.profile_plan_sha256, PLAN_DIGEST)
        self.assertTrue(
            any("profile.downgrade" in mismatch for mismatch in result.mismatches)
        )

    def test_plan_backed_rejects_a_non_full_assessment(self) -> None:
        expected = profile()
        observed = attestation(expected)
        observed["capabilities"]["delegate"] = "unavailable"  # type: ignore[index]
        generic = profile_contract.assess(expected, observed)
        self.assertEqual(generic.decision, "transport-unavailable")
        result = profile_contract.assess_plan_backed(expected, observed)
        self.assertEqual(result.decision, "transport-unavailable")
        self.assertEqual(result.profile_plan_sha256, PLAN_DIGEST)
        self.assertTrue(
            any("assessment.decision" in mismatch for mismatch in result.mismatches)
        )


    def test_parent_identity_model_authority_and_plan_mismatches_fail_closed(
        self,
    ) -> None:
        mutations = {
            "task-contract": ("task_contract_sha256", "3" * 64),
            "executor-plan": ("executor_plan_sha256", "4" * 64),
            "authority": ("authority_revision", "other-authority"),
            "runtime-identity": ("runtime.identity", "other-parent"),
            "adapter": ("runtime.harness_adapter", "other-adapter"),
            "model-selector": ("runtime.model_selector", "other-selector"),
            "model-selector-source": ("runtime.model_selector_source", "other-source"),
            "model": ("runtime.model_resolved", "other-model"),
            "reasoning": ("runtime.reasoning_level", "low"),
            "isolation": ("limits.isolation", "unisolated"),
            "fan-in": ("limits.fan_in", "semantic-merge"),
            "effects": ("limits.effects", "external-effects"),
        }
        for label, (path, value) in mutations.items():
            with self.subTest(case=label):
                expected = profile(downgrade=True)
                observed = attestation(expected)
                parent: dict[str, object] = observed
                parts = path.split(".")
                for part in parts[:-1]:
                    parent = parent[part]  # type: ignore[assignment]
                parent[parts[-1]] = value
                result = profile_contract.assess(expected, observed)
                self.assertEqual(result.decision, "transport-unavailable")
                self.assertTrue(result.mismatches)

    def test_no_fallback_is_hard_even_with_approved_downgrade(self) -> None:
        expected = profile(downgrade=True)
        observed = attestation(expected)
        observed["runtime"]["fallback"] = "alternate-model"  # type: ignore[index]
        result = profile_contract.assess(expected, observed)
        self.assertEqual(result.decision, "transport-unavailable")
        self.assertTrue(any("fallback" in mismatch for mismatch in result.mismatches))

    def test_capability_mismatch_without_approved_projection_fails_closed(self) -> None:
        expected = profile()
        observed = attestation(expected)
        observed["capabilities"]["delegate"] = "unavailable"  # type: ignore[index]
        observed["limits"]["max_concurrency"] = 1  # type: ignore[index]
        result = profile_contract.assess(expected, observed)
        self.assertEqual(result.decision, "transport-unavailable")
        self.assertNotEqual(result.decision, "full-orchestration")

    def test_exact_approved_one_owner_projection_is_an_explicit_safe_downgrade(
        self,
    ) -> None:
        expected = profile(downgrade=True)
        observed = attestation(expected)
        observed["capabilities"]["delegate"] = "unavailable"  # type: ignore[index]
        observed["capabilities"]["observe"] = "unavailable"  # type: ignore[index]
        observed["capabilities"]["control"] = "unavailable"  # type: ignore[index]
        observed["limits"]["max_child_depth"] = 0  # type: ignore[index]
        observed["limits"]["max_concurrency"] = 1  # type: ignore[index]
        result = profile_contract.assess(expected, observed)
        self.assertEqual(result.decision, "one-owner-sequential")
        self.assertTrue(result.mismatches)
        self.assertNotEqual(result.decision, "full-orchestration")

    def test_inferred_full_only_field_cannot_begin_full_orchestration(self) -> None:
        expected = profile(downgrade=True)
        observed = attestation(expected)
        observed["evidence"]["capabilities.delegate"] = "documentation-inferred"  # type: ignore[index]
        result = profile_contract.assess(expected, observed)
        self.assertEqual(result.decision, "one-owner-sequential")
        self.assertTrue(
            any("capabilities.delegate" in item for item in result.mismatches)
        )

    def test_inferred_core_field_cannot_use_the_downgrade(self) -> None:
        expected = profile(downgrade=True)
        observed = attestation(expected)
        observed["evidence"]["capabilities.identity"] = "documentation-inferred"  # type: ignore[index]
        result = profile_contract.assess(expected, observed)
        self.assertEqual(result.decision, "transport-unavailable")

    def test_cli_emits_explicit_downgrade_and_never_mutates_inputs(self) -> None:
        expected = profile(downgrade=True)
        observed = attestation(expected)
        observed["capabilities"]["delegate"] = "unavailable"  # type: ignore[index]
        with tempfile.TemporaryDirectory(prefix="orchestrator-profile-") as temporary:
            root = Path(temporary)
            expected_path = root / "profile.json"
            observed_path = root / "attestation.json"
            expected_bytes = json.dumps(expected, sort_keys=True).encode("utf-8")
            observed_bytes = json.dumps(observed, sort_keys=True).encode("utf-8")
            expected_path.write_bytes(expected_bytes)
            observed_path.write_bytes(observed_bytes)
            stream = io.StringIO()
            with contextlib.redirect_stdout(stream):
                code = profile_contract.main(
                    [
                        "assess",
                        "--profile",
                        str(expected_path),
                        "--attestation",
                        str(observed_path),
                    ]
                )
            payload = json.loads(stream.getvalue())
            self.assertEqual(code, 0)
            self.assertEqual(payload["decision"], "one-owner-sequential")
            self.assertEqual(expected_path.read_bytes(), expected_bytes)
            self.assertEqual(observed_path.read_bytes(), observed_bytes)

    def test_plan_backed_cli_exits_zero_only_for_full_without_downgrade(
        self,
    ) -> None:
        full_profile = profile()
        full_attestation = attestation(full_profile)
        downgrade_profile = profile(downgrade=True)
        downgrade_attestation = attestation(downgrade_profile)
        downgrade_attestation["capabilities"]["delegate"] = "unavailable"  # type: ignore[index]
        downgrade_attestation["capabilities"]["observe"] = "unavailable"  # type: ignore[index]
        downgrade_attestation["capabilities"]["control"] = "unavailable"  # type: ignore[index]
        downgrade_attestation["limits"]["max_child_depth"] = 0  # type: ignore[index]
        downgrade_attestation["limits"]["max_concurrency"] = 1  # type: ignore[index]
        self.assertEqual(
            profile_contract.assess(
                downgrade_profile, downgrade_attestation
            ).decision,
            "one-owner-sequential",
        )
        non_full_profile = profile()
        non_full_attestation = attestation(non_full_profile)
        non_full_attestation["capabilities"]["delegate"] = "unavailable"  # type: ignore[index]
        cases = (
            ("full", full_profile, full_attestation, 0, "full-orchestration"),
            (
                "prohibited-downgrade",
                downgrade_profile,
                downgrade_attestation,
                69,
                "transport-unavailable",
            ),
            (
                "non-full",
                non_full_profile,
                non_full_attestation,
                69,
                "transport-unavailable",
            ),
        )
        with tempfile.TemporaryDirectory(prefix="plan-backed-profile-") as temporary:
            root = Path(temporary)
            for label, expected, observed, expected_code, expected_decision in cases:
                with self.subTest(case=label):
                    expected_path = root / f"{label}-profile.json"
                    observed_path = root / f"{label}-attestation.json"
                    expected_path.write_text(
                        json.dumps(expected, sort_keys=True), encoding="utf-8"
                    )
                    observed_path.write_text(
                        json.dumps(observed, sort_keys=True), encoding="utf-8"
                    )
                    stream = io.StringIO()
                    with contextlib.redirect_stdout(stream):
                        code = profile_contract.main(
                            [
                                "assess-plan-backed",
                                "--profile",
                                str(expected_path),
                                "--attestation",
                                str(observed_path),
                            ]
                        )
                    payload = json.loads(stream.getvalue())
                    self.assertEqual(code, expected_code)
                    self.assertEqual(payload["decision"], expected_decision)
                    self.assertEqual(
                        payload["schema"], "orchestrator-profile-assessment/v1"
                    )


if __name__ == "__main__":
    unittest.main()
