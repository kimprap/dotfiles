#!/usr/bin/env python3
from __future__ import annotations

from collections.abc import Callable, Iterator
import json
import os
import subprocess
import sys
import tempfile
import unittest
from unittest import mock
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import adapter_contract as contract  # noqa: E402  # pyright: ignore[reportImplicitRelativeImport]


ADAPTER_BODY = """---
name: surface-verification-demo
description: Manual demo surface verification adapter; load only by exact invocation or recipe.
disable-model-invocation: true
---

# Demo

## Binding
Bind the exact target.

## Launch and readiness
Run the assigned instance.

## Doctor
Check readiness only.

## Stable paths
- `/form/submit`

## Drive
Submit one value.

## Evidence
Store evidence outside this package.

## Isolation
Use an assigned data root.

## Cleanup
Remove only owned state and preserve evidence.
"""


class AdapterContractTests(unittest.TestCase):
    temp: tempfile.TemporaryDirectory[str]  # pyright: ignore[reportUninitializedInstanceVariable]
    root: Path  # pyright: ignore[reportUninitializedInstanceVariable]

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "surface-verification-demo"
        self.root.mkdir()
        (self.root / "SKILL.md").write_text(ADAPTER_BODY, encoding="utf-8")
        (self.root / "notes.txt").write_text("stable\n", encoding="utf-8")

    def tearDown(self) -> None:
        self.temp.cleanup()

    def recipe(
        self, adapter: object = "none", acceptance_id: str = "AC-DEMO-01"
    ) -> dict[str, object]:
        return {
            "schema": contract.RECIPE_SCHEMA,
            "acceptance": {
                "id": acceptance_id,
                "claim": "submission persists",
                "expected": "state contains the submitted value",
            },
            "proof_class": "live-behavior",
            "target": {"surface": "demo form", "environment": "temporary service"},
            "scenario": "submit and read state",
            "inputs": {"value": "alpha"},
            "evidence_form": "response and state JSON",
            "adapter": adapter,
            "fixtures": [
                {"uri": "file:///tmp/z", "digest": "2" * 64},
                {"uri": "file:///tmp/a", "digest": "1" * 64},
            ],
            "dependencies": [],
            "isolation": "assigned data root",
            "cleanup": "remove owned process and scratch",
            "comparison": "none",
        }

    def test_adapter_identity_is_stable_and_sorted(self) -> None:
        first = contract.adapter_identity(self.root)
        second = contract.adapter_identity(self.root)
        self.assertEqual(first, second)
        self.assertEqual(first["schema"], contract.ADAPTER_SCHEMA)
        self.assertEqual(
            [item["path"] for item in first["tree"]["files"]],
            ["SKILL.md", "notes.txt"],
        )
        self.assertEqual(first["uri"], (self.root.resolve() / "SKILL.md").as_uri())

    def test_adapter_rejects_unavailable_subtree(self) -> None:
        def fail_walk(
            _root: object,
            *,
            onerror: Callable[[OSError], None],
            followlinks: bool,
        ) -> Iterator[tuple[str, list[str], list[str]]]:
            self.assertFalse(followlinks)
            onerror(PermissionError("denied"))
            return iter(())

        with (
            mock.patch("adapter_contract.os.walk", side_effect=fail_walk),
            self.assertRaisesRegex(contract.ContractError, "adapter_tree_unavailable"),
        ):
            contract.adapter_identity(self.root)

    def test_adapter_rejects_symlink_and_frontmatter_errors(self) -> None:
        os.symlink(self.root / "notes.txt", self.root / "linked.txt")
        with self.assertRaisesRegex(
            contract.ContractError, "adapter_tree_unsafe_entry"
        ):
            contract.adapter_identity(self.root)
        (self.root / "linked.txt").unlink()
        (self.root / "SKILL.md").write_text(
            ADAPTER_BODY.replace("disable-model-invocation: true\n", ""),
            encoding="utf-8",
        )
        with self.assertRaisesRegex(
            contract.ContractError, "manual_invocation_required"
        ):
            contract.adapter_identity(self.root)

    def test_recipe_is_canonical_and_rejects_missing_field(self) -> None:
        value = self.recipe()
        first = contract.canonical_recipe(value)
        second = contract.canonical_recipe(json.loads(json.dumps(value)))
        self.assertEqual(first, second)
        self.assertEqual(
            first["identity"],
            "VR-DEMO-01@sha256:78016dfe8ee2c9f1b4c19dc45b522afacff676b5a657b3d595939af85ee75bce",
        )
        self.assertEqual(
            [item["uri"] for item in first["recipe"]["fixtures"]],
            ["file:///tmp/a", "file:///tmp/z"],
        )
        del value["cleanup"]
        with self.assertRaisesRegex(contract.ContractError, "recipe_fields_invalid"):
            contract.canonical_recipe(value)

    def test_recipe_rehashes_exact_adapter_binding(self) -> None:
        identity = contract.adapter_identity(self.root)
        binding = {"uri": identity["uri"], "digest": identity["digest"]}
        result = contract.canonical_recipe(self.recipe(binding))
        self.assertEqual(result["recipe"]["adapter"], binding)
        (self.root / "notes.txt").write_text("drift\n", encoding="utf-8")
        with self.assertRaisesRegex(contract.ContractError, "stale_adapter_binding"):
            contract.canonical_recipe(self.recipe(binding))
        contract.validate_recipe_generation(["AC-DEMO-01"], [result], [])

    def test_generation_requires_exact_unique_acceptance_coverage(self) -> None:
        first = contract.canonical_recipe(self.recipe())
        second = contract.canonical_recipe(
            self.recipe(acceptance_id="AC-DEMO-02")
        )
        self.assertIsNone(
            contract.validate_recipe_generation(
                ["AC-DEMO-01", "AC-DEMO-02"], [first, second], []
            )
        )

        for label, acceptance_ids in (
            ("malformed", ["DEMO-01"]),
            ("duplicate", ["AC-DEMO-01", "AC-DEMO-01"]),
        ):
            with self.subTest(acceptance_list=label):
                with self.assertRaises(contract.ContractError) as raised:
                    contract.validate_recipe_generation(
                        acceptance_ids, [first], []
                    )
                self.assertEqual(
                    raised.exception.code,
                    "recipe_generation_acceptance_invalid",
                )

        for label, acceptance_ids, recipes in (
            ("missing", ["AC-DEMO-01", "AC-DEMO-02"], [first]),
            ("extra", ["AC-DEMO-01"], [first, second]),
            (
                "duplicate",
                ["AC-DEMO-01", "AC-DEMO-02"],
                [first, first, second],
            ),
        ):
            with self.subTest(coverage=label):
                with self.assertRaises(contract.ContractError) as raised:
                    contract.validate_recipe_generation(
                        acceptance_ids, recipes, []
                    )
                self.assertEqual(
                    raised.exception.code,
                    "recipe_generation_coverage_invalid",
                )

    def test_generation_rejects_malformed_or_mismatched_wrappers(self) -> None:
        valid = contract.canonical_recipe(self.recipe())
        wrong_identity = json.loads(json.dumps(valid))
        wrong_identity["identity"] = f"VR-DEMO-01@sha256:{'0' * 64}"
        noncanonical_recipe = json.loads(json.dumps(valid))
        noncanonical_recipe["recipe"]["fixtures"].reverse()

        for label, wrapper in (
            ("malformed", {}),
            ("identity", wrong_identity),
            ("nested-recanonicalization", noncanonical_recipe),
        ):
            with self.subTest(wrapper=label):
                with self.assertRaises(contract.ContractError) as raised:
                    contract.validate_recipe_generation(
                        ["AC-DEMO-01"], [wrapper], []
                    )
                self.assertEqual(
                    raised.exception.code,
                    "recipe_generation_recipe_invalid",
                )

    def test_generation_enforces_one_digest_per_uri(self) -> None:
        first = contract.canonical_recipe(self.recipe())
        second = contract.canonical_recipe(
            self.recipe(acceptance_id="AC-DEMO-02")
        )
        repeated = {"uri": "file:///tmp/a", "digest": "1" * 64}
        self.assertIsNone(
            contract.validate_recipe_generation(
                ["AC-DEMO-01", "AC-DEMO-02"],
                [first, second],
                [repeated, repeated],
            )
        )

        conflicting_recipe = self.recipe(acceptance_id="AC-DEMO-02")
        conflicting_recipe["dependencies"] = [
            {"uri": "file:///tmp/a", "digest": "3" * 64}
        ]
        conflict_wrapper = contract.canonical_recipe(conflicting_recipe)
        for label, recipes, manifest in (
            (
                "recipe-arrays",
                [first, conflict_wrapper],
                [],
            ),
            (
                "flattened-manifest",
                [first],
                [{"uri": "file:///tmp/a", "digest": "3" * 64}],
            ),
        ):
            with self.subTest(conflict=label):
                with self.assertRaises(contract.ContractError) as raised:
                    contract.validate_recipe_generation(
                        [item["recipe"]["acceptance"]["id"] for item in recipes],
                        recipes,
                        manifest,
                    )
                self.assertEqual(
                    raised.exception.code,
                    "recipe_generation_binding_conflict",
                )

        with self.assertRaises(contract.ContractError) as raised:
            contract.validate_recipe_generation(
                ["AC-DEMO-01"], [first], [{"uri": "file:///tmp/a"}]
            )
        self.assertEqual(
            raised.exception.code,
            "recipe_generation_binding_invalid",
        )

    def test_generation_validates_old_and_current_bindings_separately(self) -> None:
        uri = "file:///tmp/target.py"
        old_value = self.recipe()
        old_value["fixtures"] = [{"uri": uri, "digest": "1" * 64}]
        current_value = self.recipe()
        current_value["fixtures"] = [{"uri": uri, "digest": "2" * 64}]
        old = contract.canonical_recipe(old_value)
        current = contract.canonical_recipe(current_value)

        self.assertIsNone(
            contract.validate_recipe_generation(
                ["AC-DEMO-01"],
                [old],
                [{"uri": uri, "digest": "1" * 64}],
            )
        )
        self.assertIsNone(
            contract.validate_recipe_generation(
                ["AC-DEMO-01"],
                [current],
                [{"uri": uri, "digest": "2" * 64}],
            )
        )
        self.assertNotEqual(old["identity"], current["identity"])

    def test_doctor_is_readiness_only_and_requires_current_binding(self) -> None:
        identity = contract.adapter_identity(self.root)
        recipe = contract.canonical_recipe(
            self.recipe({"uri": identity["uri"], "digest": identity["digest"]})
        )
        receipt = {
            "schema": contract.DOCTOR_SCHEMA,
            "recipe_id": recipe["identity"],
            "adapter": {"uri": identity["uri"], "digest": identity["digest"]},
            "target_environment": "temporary service",
            "action": "probe assigned port",
            "expected": "ready",
            "observed": "ready",
            "status": "ready",
            "disposable_resources": ["probe socket"],
            "continuing_instance": "none",
            "cleanup": {"removed": ["probe socket"], "remaining": []},
            "evidence": {"uri": "file:///tmp/doctor.json", "digest": "3" * 64},
            "product_observation": "none",
        }
        self.assertEqual(contract.canonical_doctor(receipt), receipt)
        receipt["verdict"] = "VERIFIED"
        with self.assertRaisesRegex(contract.ContractError, "doctor_fields_invalid"):
            contract.canonical_doctor(receipt)

    def test_cli_emits_one_json_object_and_no_target_files(self) -> None:
        before = sorted(
            path.relative_to(self.root).as_posix() for path in self.root.rglob("*")
        )
        completed = subprocess.run(
            [sys.executable, str(SCRIPT_DIR / "adapter_contract.py"), "--self-test"],
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertEqual(json.loads(completed.stdout)["status"], "pass")
        self.assertEqual(completed.stderr, "")
        after = sorted(
            path.relative_to(self.root).as_posix() for path in self.root.rglob("*")
        )
        self.assertEqual(before, after)

    def test_cli_failure_is_stable(self) -> None:
        command = [
            sys.executable,
            str(SCRIPT_DIR / "adapter_contract.py"),
            "recipe",
            "--input",
            "{}",
        ]
        first = subprocess.run(command, check=False, capture_output=True, text=True)
        second = subprocess.run(command, check=False, capture_output=True, text=True)
        self.assertEqual(first.returncode, 2)
        self.assertEqual(first.stdout, second.stdout)
        self.assertEqual(
            json.loads(first.stdout),
            {
                "schema": contract.ERROR_SCHEMA,
                "status": "error",
                "code": "recipe_fields_invalid",
            },
        )


if __name__ == "__main__":
    unittest.main()
