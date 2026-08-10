from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


PLANNER_DIR = Path(__file__).resolve().parent
PROJECTOR = PLANNER_DIR / "project.py"
SOURCE = PLANNER_DIR / "PERSONA.md"
SOURCE_BYTES = SOURCE.read_bytes()
SOURCE_TEXT = SOURCE_BYTES.decode("utf-8")
OUTPUT_RELATIVES = (
    Path("harnesses/omp/agents/planner.md"),
    Path("harnesses/grok/agents/planner.md"),
)
OBSOLETE_RELATIVES = (
    Path("harnesses/grok/roles/planner.toml"),
    Path("harnesses/grok/personas/planner.toml"),
)

sys.path.insert(0, str(PLANNER_DIR))
import project  # noqa: E402


class ProjectorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory(prefix="planner-projector-")
        self.root = Path(self.tempdir.name)
        planner_dir = self.root / "personas" / "planner"
        planner_dir.mkdir(parents=True)
        shutil.copy2(PROJECTOR, planner_dir / "project.py")
        shutil.copy2(SOURCE, planner_dir / "PERSONA.md")
        self.projector = planner_dir / "project.py"

    def tearDown(self) -> None:
        self.tempdir.cleanup()

    def run_cli(self, *args: str) -> subprocess.CompletedProcess[str]:
        environment = os.environ.copy()
        environment["PYTHONDONTWRITEBYTECODE"] = "1"
        return subprocess.run(
            [sys.executable, str(self.projector), *args],
            cwd=self.root,
            env=environment,
            text=True,
            capture_output=True,
            check=False,
        )

    def output_paths(self) -> tuple[Path, ...]:
        return tuple(self.root / relative for relative in OUTPUT_RELATIVES)

    def test_valid_source_exposes_only_portable_meaning(self) -> None:
        persona = project.parse_persona(self.root / "personas/planner/PERSONA.md")
        self.assertEqual(persona.description, " ".join(persona.description_lines))
        self.assertEqual(persona.source_bytes, SOURCE_BYTES)
        body = persona.body_bytes.decode("utf-8")
        self.assertEqual(persona.body_text, body[1:] if body.startswith("\n") else body)
        self.assertTrue(persona.body_text.strip())
        required = (
            "`Objective`",
            "`Authority`",
            "`Governing decisions`",
            "`Scope, non-goals, and prohibited effects`",
            "`Fixed shared contracts`",
            "`Target map`",
            "`Execution policy`",
            "`Tasks`",
            "`Acceptance`",
            "`Verification / Done criteria`",
            "`Result / Handoff`",
            "`Blockers and recovery`",
            "`Critical anchors and assumptions`",
        )
        positions = [persona.body_text.index(section) for section in required]
        self.assertEqual(positions, sorted(positions))
        self.assertIn("Executor Plan v1", persona.body_text)
        self.assertIn("executor_plan.py", persona.body_text)
        self.assertIn("consumer=planner", persona.body_text)
        self.assertIn("Common Handoff", persona.body_text)
        self.assertIn("Do not implement", persona.body_text)
        self.assertIn("delegate", persona.body_text)
        self.assertNotIn("openai-", persona.body_text.lower())
        self.assertNotIn("grok-", persona.body_text.lower())

    def test_invalid_source_fixtures_fail_before_any_output(self) -> None:
        fixtures = {
            "native-field": SOURCE_TEXT.replace(
                "description: >\n", "model: '@plan'\ndescription: >\n", 1
            ),
            "unknown-field": SOURCE_TEXT.replace(
                "description: >\n", "owner: planner\ndescription: >\n", 1
            ),
            "wrong-name": SOURCE_TEXT.replace(
                "name: planner\n", "name: not-planner\n", 1
            ),
            "duplicate-name": SOURCE_TEXT.replace(
                "description: >\n", "name: planner\ndescription: >\n", 1
            ),
        }
        source_path = self.root / "personas/planner/PERSONA.md"
        for label, text in fixtures.items():
            with self.subTest(label=label):
                source_path.write_text(text, encoding="utf-8")
                result = self.run_cli("--write")
                self.assertEqual(result.returncode, 2)
                self.assertEqual(
                    tuple(path for path in self.output_paths() if path.exists()), ()
                )
                self.assertFalse((self.root / "harnesses").exists())
                source_path.write_bytes(SOURCE_BYTES)

        source_path.write_bytes(SOURCE_BYTES.replace(b"\n", b"\r\n"))
        result = self.run_cli("--write")
        self.assertEqual(result.returncode, 2)
        self.assertIn("cr", (result.stdout + result.stderr).lower())
        self.assertEqual(
            tuple(path for path in self.output_paths() if path.exists()), ()
        )

        source_path.write_bytes(b"\xff\xfe\n")
        result = self.run_cli("--write")
        self.assertEqual(result.returncode, 2)
        self.assertIn("utf-8", (result.stdout + result.stderr).lower())
        self.assertEqual(
            tuple(path for path in self.output_paths() if path.exists()), ()
        )

        source_path.write_text(
            "---\nname: planner\ndescription: >\n  valid description\n---\n\n",
            encoding="utf-8",
        )
        result = self.run_cli("--write")
        self.assertEqual(result.returncode, 2)
        self.assertIn("body", (result.stdout + result.stderr).lower())
        self.assertEqual(
            tuple(path for path in self.output_paths() if path.exists()), ()
        )

    def test_default_invocation_is_nonmutating_and_machine_readable(self) -> None:
        result = self.run_cli()
        self.assertEqual(result.returncode, 0, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report["mode"], "dry-run")
        self.assertTrue(report["ok"])
        self.assertEqual(report["obsolete"], [])
        self.assertEqual(
            SOURCE_BYTES, (self.root / "personas/planner/PERSONA.md").read_bytes()
        )
        self.assertEqual(
            tuple(path for path in self.output_paths() if path.exists()), ()
        )

    def test_render_is_byte_identical_and_native_agent_is_complete(self) -> None:
        persona = project.parse_persona(self.root / "personas/planner/PERSONA.md")
        first = project.render_outputs(persona, self.root)
        second = project.render_outputs(persona, self.root)
        self.assertEqual(first, second)
        grok = first[self.output_paths()[1]].decode("utf-8")
        self.assertIn("name: planner\n", grok)
        self.assertIn(f"model: {project.GROK_MODEL}\n", grok)
        self.assertIn("prompt_mode: full\n", grok)
        self.assertIn("permission_mode: default\n", grok)
        self.assertIn("agents_md: true\n", grok)
        self.assertIn(f"tools: {project.GROK_TOOLS}\n", grok)
        self.assertTrue(grok.encode("utf-8").endswith(persona.body_bytes))
        for data in first.values():
            text = data.decode("utf-8")
            self.assertEqual(text.count("source-sha256: " + persona.source_sha256), 1)
            self.assertTrue(data.endswith(b"\n"))
        self.assertIn("grok/agents", "\n".join(str(path) for path in first))

    def test_check_reports_two_outputs_then_passes_after_write(self) -> None:
        missing = self.run_cli("--check")
        self.assertEqual(missing.returncode, 1)
        missing_report = json.loads(missing.stdout)
        self.assertEqual(len(missing_report["outputs"]), 2)
        self.assertEqual(
            [entry["status"] for entry in missing_report["outputs"]], ["missing"] * 2
        )
        written = self.run_cli("--write")
        self.assertEqual(written.returncode, 0, written.stderr)
        self.assertEqual(
            [entry["status"] for entry in json.loads(written.stdout)["outputs"]],
            ["ok"] * 2,
        )
        checked = self.run_cli("--check")
        self.assertEqual(checked.returncode, 0, checked.stderr)
        report = json.loads(checked.stdout)
        self.assertTrue(report["ok"])
        self.assertEqual([entry["status"] for entry in report["outputs"]], ["ok"] * 2)

    def test_obsolete_projections_block_check_and_write_before_mutation(self) -> None:
        self.assertEqual(self.run_cli("--write").returncode, 0)
        output = self.output_paths()[0]
        before = output.read_bytes()
        obsolete = self.root / OBSOLETE_RELATIVES[0]
        obsolete.parent.mkdir(parents=True)
        obsolete.write_bytes(b"stale planner projection\n")
        checked = self.run_cli("--check")
        self.assertEqual(checked.returncode, 1)
        report = json.loads(checked.stdout)
        self.assertEqual(
            report["obsolete"], [{"path": str(obsolete), "status": "obsolete"}]
        )
        output.write_bytes(before + b"\ndrift\n")
        blocked = self.run_cli("--write")
        self.assertEqual(blocked.returncode, 1)
        self.assertEqual(output.read_bytes(), before + b"\ndrift\n")
        obsolete.unlink()
        self.assertEqual(self.run_cli("--write").returncode, 0)

    def test_manual_drift_in_each_output_is_detected(self) -> None:
        self.assertEqual(self.run_cli("--write").returncode, 0)
        for path in self.output_paths():
            original = path.read_bytes()
            path.write_bytes(original + b"\nmanual drift\n")
            result = self.run_cli("--check")
            self.assertEqual(result.returncode, 1, path)
            report = json.loads(result.stdout)
            statuses = {
                Path(item["path"]): item["status"] for item in report["outputs"]
            }
            self.assertEqual(statuses[path], "stale")
            self.assertEqual(sum(status == "stale" for status in statuses.values()), 1)
            self.assertEqual(self.run_cli("--write").returncode, 0)

    def test_source_body_edit_updates_both_native_agents_and_provenance(self) -> None:
        self.assertEqual(self.run_cli("--write").returncode, 0)
        before = {path: path.read_bytes() for path in self.output_paths()}
        source_path = self.root / "personas/planner/PERSONA.md"
        edited = SOURCE_TEXT.replace(
            "You are the planner for one explicitly assigned, immutable Task Contract.",
            "You are the planner for one explicitly assigned, immutable Task Contract.\n\nBody edit for projection tracer.",
            1,
        )
        source_path.write_text(edited, encoding="utf-8")
        written = self.run_cli("--write")
        self.assertEqual(written.returncode, 0, written.stderr)
        after = {path: path.read_bytes() for path in self.output_paths()}
        digest_line = re.compile(rb"# source-sha256: [0-9a-f]{64}")
        for path in self.output_paths():
            self.assertNotEqual(before[path], after[path])
            self.assertNotEqual(
                digest_line.search(before[path]).group(),
                digest_line.search(after[path]).group(),
            )
        source_path.write_bytes(SOURCE_BYTES)
        self.assertEqual(self.run_cli("--write").returncode, 0)
        self.assertEqual(self.run_cli("--check").returncode, 0)

    def test_write_refuses_output_symlink_and_does_not_follow_it(self) -> None:
        self.assertEqual(self.run_cli("--write").returncode, 0)
        output = self.output_paths()[0]
        external = self.root / "outside.txt"
        external.write_bytes(b"outside-before\n")
        saved = output.read_bytes()
        output.unlink()
        output.symlink_to(external)
        result = self.run_cli("--write")
        self.assertEqual(result.returncode, 2)
        self.assertEqual(external.read_bytes(), b"outside-before\n")
        output.unlink()
        output.write_bytes(saved)

    def test_staged_write_failure_leaves_targets_absent(self) -> None:
        persona = project.parse_persona(self.root / "personas/planner/PERSONA.md")
        rendered = project.render_outputs(persona, self.root)
        with mock.patch.object(
            project.os, "replace", side_effect=OSError("injected replace failure")
        ):
            with self.assertRaises(OSError):
                project.write_outputs(rendered)
        self.assertEqual(
            tuple(path for path in self.output_paths() if path.exists()), ()
        )
        self.assertEqual(tuple(self.root.rglob("*.tmp")), ())


if __name__ == "__main__":
    unittest.main()
