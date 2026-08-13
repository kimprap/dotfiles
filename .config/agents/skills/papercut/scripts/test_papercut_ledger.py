from __future__ import annotations

import contextlib
import fcntl
import hashlib
import importlib.util
import io
import json
import os
import subprocess
import stat
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

SCRIPT = Path(__file__).with_name("papercut_ledger.py")
SPEC = importlib.util.spec_from_file_location("papercut_ledger", SCRIPT)
assert SPEC and SPEC.loader
ledger_module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ledger_module)


def canonical(value: dict[str, object]) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    ).encode()


def record_id(surface: str, summary: str) -> str:
    digest = hashlib.sha256(surface.encode() + b"\0" + summary.encode()).hexdigest()
    return f"pc-{digest[:16]}"


class PapercutLedgerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp.name) / "repo"
        self.repo.mkdir()
        self.ledger = self.repo / ".agents" / "papercuts.json"
        self.inputs = Path(self.temp.name) / "inputs"
        self.inputs.mkdir()

    def tearDown(self) -> None:
        self.temp.cleanup()

    def run_cli(
        self,
        *arguments: str,
        expected_code: int = 0,
    ) -> tuple[dict[str, object], subprocess.CompletedProcess[str]]:
        result = subprocess.run(
            [sys.executable, str(SCRIPT), *arguments],
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(
            result.returncode, expected_code, result.stderr or result.stdout
        )
        stream = result.stdout if expected_code == 0 else result.stderr
        self.assertEqual(result.stderr, "" if expected_code == 0 else stream)
        self.assertEqual(result.stdout, stream if expected_code == 0 else "")
        payload = json.loads(stream)
        self.assertEqual(payload["schema"], "papercut-ledger-cli/v2")
        return payload, result

    def write_json(self, name: str, value: object) -> Path:
        path = self.inputs / name
        path.write_bytes(
            canonical(value) if isinstance(value, dict) else json.dumps(value).encode()
        )
        return path

    def init(self) -> dict[str, object]:
        payload, _ = self.run_cli("init", "--repo", str(self.repo))
        return payload

    def record_input(
        self,
        *,
        date: str = "2026-08-12",
        friction: str = "Agents repeat one repository-owned workaround",
        workaround: str | None = "Use the repository-owned helper",
    ) -> tuple[Path, str]:
        surface = "repository agent guidance"
        summary = "Agents repeat one repository-owned workaround"
        value = {
            "surface": surface,
            "summary": summary,
            "observed_on": date,
            "observation": {
                "friction": friction,
                "workaround": workaround,
            },
        }
        return self.write_json(
            f"record-{date}-{len(list(self.inputs.iterdir()))}.json", value
        ), record_id(surface, summary)

    def resolve_input(
        self,
        *,
        kind: str = "fixed",
        date: str = "2026-08-14",
        reference: str = "docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md#D24",
        summary: str = "The reusable workflow correction is durable",
    ) -> Path:
        return self.write_json(
            f"resolve-{kind}-{len(list(self.inputs.iterdir()))}.json",
            {
                "kind": kind,
                "resolved_on": date,
                "reference": reference,
                "summary": summary,
            },
        )

    def read_ledger(self) -> dict[str, object]:
        return json.loads(self.ledger.read_text())

    def assert_canonical(self) -> None:
        value = self.read_ledger()
        self.assertEqual(self.ledger.read_bytes(), canonical(value))

    def test_init_creates_migrates_and_is_idempotent(self) -> None:
        created = self.init()
        self.assertEqual(created["status"], "created")
        self.assertEqual(self.read_ledger(), {"records": {}, "version": 2})
        self.assert_canonical()

        unchanged = self.init()
        self.assertEqual(unchanged["status"], "unchanged")

        self.ledger.write_bytes(canonical(ledger_module.EMPTY_V1_LEDGER))
        migrated = self.init()
        self.assertEqual(migrated["status"], "migrated")
        self.assertEqual(self.read_ledger(), {"records": {}, "version": 2})

    def test_dry_run_never_mutates_and_reports_prospective_result(self) -> None:
        prospective, _ = self.run_cli(
            "init",
            "--repo",
            str(self.repo),
            "--dry-run",
        )
        self.assertEqual(
            (prospective["status"], prospective["result"]),
            ("dry-run", "created"),
        )
        self.assertFalse(self.ledger.exists())

        self.init()
        source, expected_id = self.record_input()
        before = self.ledger.read_bytes()
        record, _ = self.run_cli(
            "record",
            "--repo",
            str(self.repo),
            "--input",
            str(source),
            "--dry-run",
        )
        self.assertEqual(
            (record["status"], record["result"], record["record_id"]),
            ("dry-run", "recorded", expected_id),
        )
        self.assertEqual(self.ledger.read_bytes(), before)

        self.run_cli(
            "record",
            "--repo",
            str(self.repo),
            "--input",
            str(source),
        )
        resolution = self.resolve_input()
        before = self.ledger.read_bytes()
        resolve, _ = self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
            "--input",
            str(resolution),
            "--dry-run",
        )
        self.assertEqual(
            (resolve["status"], resolve["result"]),
            ("dry-run", "resolved"),
        )
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_init_rejects_nonempty_v1_and_malformed_bytes(self) -> None:
        self.ledger.parent.mkdir()
        nonempty = {
            "capture_mode": "automatic",
            "records": {"pc-0123456789abcdef": {}},
            "schema_version": 1,
        }
        self.ledger.write_bytes(canonical(nonempty))
        before = self.ledger.read_bytes()
        payload, _ = self.run_cli("init", "--repo", str(self.repo), expected_code=2)
        self.assertEqual(payload["code"], "migration_required")
        self.assertEqual(self.ledger.read_bytes(), before)

        self.ledger.write_text("not json\n")
        before = self.ledger.read_bytes()
        payload, _ = self.run_cli("init", "--repo", str(self.repo), expected_code=2)
        self.assertEqual(payload["code"], "schema_invalid")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_list_record_deduplicate_and_update(self) -> None:
        self.init()
        empty, _ = self.run_cli("list", "--repo", str(self.repo))
        self.assertEqual(empty["records"], [])

        source, expected_id = self.record_input()
        recorded, _ = self.run_cli(
            "record", "--repo", str(self.repo), "--input", str(source)
        )
        self.assertEqual(
            (recorded["status"], recorded["record_id"]), ("recorded", expected_id)
        )

        unchanged, _ = self.run_cli(
            "record", "--repo", str(self.repo), "--input", str(source)
        )
        self.assertEqual(unchanged["status"], "unchanged")
        record = self.read_ledger()["records"][expected_id]
        self.assertEqual(record["occurrence_count"], 1)

        second, _ = self.record_input(
            date="2026-08-13", friction="A second task repeats the workaround"
        )
        updated, _ = self.run_cli(
            "record", "--repo", str(self.repo), "--input", str(second)
        )
        self.assertEqual(updated["status"], "updated")
        record = self.read_ledger()["records"][expected_id]
        self.assertEqual(record["occurrence_count"], 2)
        self.assertEqual(record["last_seen"], "2026-08-13")
        self.assertEqual(len(record["observations"]), 2)
        self.assert_canonical()

        listed, _ = self.run_cli("list", "--repo", str(self.repo))
        self.assertEqual(listed["records"][0]["id"], expected_id)
        self.assertNotIn("observations", listed["records"][0])
        selected, _ = self.run_cli(
            "list",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
        )
        self.assertEqual(selected["record_id"], expected_id)
        self.assertEqual(len(selected["record"]["observations"]), 2)

    def test_resolve_compacts_recurrence_reopens_and_resolves_again(self) -> None:
        self.init()
        source, expected_id = self.record_input()
        self.run_cli("record", "--repo", str(self.repo), "--input", str(source))
        resolution = self.resolve_input()
        resolved, _ = self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
            "--input",
            str(resolution),
        )
        self.assertEqual(resolved["status"], "resolved")
        compact = self.read_ledger()["records"][expected_id]
        self.assertEqual(compact["observations"], [])
        self.assertEqual(compact["occurrence_count"], 1)
        self.assertEqual(compact["resolution"]["kind"], "fixed")

        unchanged, _ = self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
            "--input",
            str(resolution),
        )
        self.assertEqual(unchanged["status"], "unchanged")

        recurrence, _ = self.record_input(
            date="2026-08-14", friction="The workaround recurred after correction"
        )
        reopened, _ = self.run_cli(
            "record", "--repo", str(self.repo), "--input", str(recurrence)
        )
        self.assertEqual(reopened["status"], "reopened")
        current = self.read_ledger()["records"][expected_id]
        self.assertEqual(current["occurrence_count"], 2)
        self.assertEqual(len(current["observations"]), 1)
        self.assertEqual(current["resolution"]["kind"], "fixed")

        rejected = self.resolve_input(
            kind="rejected",
            date="2026-08-16",
            summary="Frozen evaluation rejected the candidate",
        )
        second, _ = self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
            "--input",
            str(rejected),
        )
        self.assertEqual(second["status"], "resolved")
        final = self.read_ledger()["records"][expected_id]
        self.assertEqual(final["observations"], [])
        self.assertEqual(final["resolution"]["kind"], "rejected")

    def test_conflicting_resolution_and_backdated_recurrence_fail_closed(self) -> None:
        self.init()
        source, expected_id = self.record_input()
        self.run_cli("record", "--repo", str(self.repo), "--input", str(source))
        fixed = self.resolve_input()
        self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
            "--input",
            str(fixed),
        )
        before = self.ledger.read_bytes()

        conflicting = self.resolve_input(kind="rejected")
        payload, _ = self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            expected_id,
            "--input",
            str(conflicting),
            expected_code=2,
        )
        self.assertEqual(payload["code"], "id_collision")
        self.assertEqual(self.ledger.read_bytes(), before)

        old, _ = self.record_input(
            date="2026-08-13",
            friction="The observation predates the retained resolution",
        )
        payload, _ = self.run_cli(
            "record", "--repo", str(self.repo), "--input", str(old), expected_code=2
        )
        self.assertEqual(payload["code"], "invalid_input")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_missing_and_invalid_inputs_are_stable_and_nonmutating(self) -> None:
        missing, _ = self.run_cli("list", "--repo", str(self.repo), expected_code=2)
        self.assertEqual(missing["code"], "not_initialized")
        self.init()
        before = self.ledger.read_bytes()

        invalid_cli, _ = self.run_cli(
            "validate", "--repo", str(self.repo), expected_code=2
        )
        self.assertEqual(
            (invalid_cli["operation"], invalid_cli["code"]),
            ("unknown", "invalid_input"),
        )

        invalid = self.write_json(
            "invalid.json",
            {
                "surface": "repository agent guidance",
                "summary": "Agents repeat one repository-owned workaround",
                "observed_on": "2026-08-12",
                "observation": {"friction": "Contains\ncontrol", "workaround": None},
            },
        )
        payload, _ = self.run_cli(
            "record", "--repo", str(self.repo), "--input", str(invalid), expected_code=2
        )
        self.assertEqual(payload["code"], "invalid_input")
        self.assertEqual(self.ledger.read_bytes(), before)
        missing_id = "pc-0123456789abcdef"
        resolution = self.resolve_input()
        payload, _ = self.run_cli(
            "resolve",
            "--repo",
            str(self.repo),
            "--id",
            missing_id,
            "--input",
            str(resolution),
            expected_code=2,
        )
        self.assertEqual(payload["code"], "record_missing")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_unicode_c1_controls_are_rejected_without_mutation(self) -> None:
        self.init()
        before = self.ledger.read_bytes()
        invalid = self.write_json(
            "invalid-c1.json",
            {
                "surface": "repository agent guidance",
                "summary": "Agents repeat one repository-owned workaround",
                "observed_on": "2026-08-12",
                "observation": {
                    "friction": "Contains\u0085control",
                    "workaround": None,
                },
            },
        )
        payload, _ = self.run_cli(
            "record",
            "--repo",
            str(self.repo),
            "--input",
            str(invalid),
            expected_code=2,
        )
        self.assertEqual(payload["code"], "invalid_input")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_unicode_surrogates_are_rejected_without_mutation(self) -> None:
        self.init()
        before = self.ledger.read_bytes()
        invalid = self.inputs / "invalid-surrogate.json"
        invalid.write_bytes(
            b'{"observation":{"friction":"friction","workaround":null},'
            b'"observed_on":"2026-08-12","summary":"Contains\\ud800surrogate",'
            b'"surface":"repository agent guidance"}'
        )
        payload, _ = self.run_cli(
            "record",
            "--repo",
            str(self.repo),
            "--input",
            str(invalid),
            expected_code=2,
        )
        self.assertEqual(payload["code"], "invalid_input")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_unknown_keys_and_noncanonical_ledger_fail_closed(self) -> None:
        self.init()
        value = self.read_ledger()
        value["extra"] = True
        self.ledger.write_bytes(canonical(value))
        before = self.ledger.read_bytes()
        payload, _ = self.run_cli("list", "--repo", str(self.repo), expected_code=2)
        self.assertEqual(payload["code"], "schema_invalid")
        self.assertEqual(self.ledger.read_bytes(), before)

        self.ledger.write_text('{"records":{},"version":2}\n')
        before = self.ledger.read_bytes()
        payload, _ = self.run_cli("list", "--repo", str(self.repo), expected_code=2)
        self.assertEqual(payload["code"], "schema_invalid")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_symlink_paths_are_rejected(self) -> None:
        target = Path(self.temp.name) / "target"
        target.mkdir()
        linked = Path(self.temp.name) / "linked"
        linked.symlink_to(target, target_is_directory=True)
        payload, _ = self.run_cli("init", "--repo", str(linked), expected_code=2)
        self.assertEqual(payload["code"], "unsafe_path")

        self.repo.joinpath(".agents").symlink_to(target, target_is_directory=True)
        payload, _ = self.run_cli("init", "--repo", str(self.repo), expected_code=2)
        self.assertEqual(payload["code"], "unsafe_path")

    def test_directory_swap_to_symlink_is_rejected_before_write(self) -> None:
        self.init()
        source, _ = self.record_input()
        original_directory = self.ledger.parent.resolve()
        held_directory = original_directory.parent / ".agents-held"
        external_directory = Path(self.temp.name) / "external"
        external_directory.mkdir()
        before = self.ledger.read_bytes()
        real_open = ledger_module.os.open
        swapped = False

        def swap_before_directory_open(
            path: object,
            flags: int,
            mode: int = 0o777,
            *,
            dir_fd: int | None = None,
        ) -> int:
            nonlocal swapped
            if not swapped and dir_fd is not None and path == ledger_module.AGENTS_NAME:
                original_directory.rename(held_directory)
                original_directory.symlink_to(
                    external_directory,
                    target_is_directory=True,
                )
                swapped = True
            if dir_fd is None:
                return real_open(path, flags, mode)
            return real_open(path, flags, mode, dir_fd=dir_fd)

        output = io.StringIO()
        errors = io.StringIO()
        with (
            mock.patch.object(
                ledger_module.os,
                "open",
                side_effect=swap_before_directory_open,
            ),
            contextlib.redirect_stdout(output),
            contextlib.redirect_stderr(errors),
        ):
            code = ledger_module.main(
                ["record", "--repo", str(self.repo), "--input", str(source)]
            )
        self.assertTrue(swapped)
        self.assertEqual(code, 2)
        self.assertEqual(json.loads(errors.getvalue())["code"], "unsafe_path")
        self.assertEqual(
            held_directory.joinpath("papercuts.json").read_bytes(),
            before,
        )
        self.assertEqual(list(external_directory.iterdir()), [])

    def test_repository_root_swap_cannot_redirect_write(self) -> None:
        self.init()
        source, _ = self.record_input()
        original_root = self.repo.resolve()
        held_root = original_root.parent / "repo-held"
        external_root = Path(self.temp.name) / "external-root"
        external_agents = external_root / ".agents"
        external_agents.mkdir(parents=True)
        before = self.ledger.read_bytes()
        external_ledger = external_agents / "papercuts.json"
        external_ledger.write_bytes(before)
        real_open = ledger_module.os.open
        swapped = False

        def swap_before_agents_open(
            path: object,
            flags: int,
            mode: int = 0o777,
            *,
            dir_fd: int | None = None,
        ) -> int:
            nonlocal swapped
            if not swapped and dir_fd is not None and path == ledger_module.AGENTS_NAME:
                original_root.rename(held_root)
                original_root.symlink_to(
                    external_root,
                    target_is_directory=True,
                )
                swapped = True
            if dir_fd is None:
                return real_open(path, flags, mode)
            return real_open(path, flags, mode, dir_fd=dir_fd)

        output = io.StringIO()
        errors = io.StringIO()
        with (
            mock.patch.object(
                ledger_module.os,
                "open",
                side_effect=swap_before_agents_open,
            ),
            contextlib.redirect_stdout(output),
            contextlib.redirect_stderr(errors),
        ):
            code = ledger_module.main(
                ["record", "--repo", str(self.repo), "--input", str(source)]
            )
        self.assertTrue(swapped)
        self.assertEqual(code, 2)
        self.assertEqual(json.loads(errors.getvalue())["code"], "unsafe_path")
        self.assertEqual(
            held_root.joinpath(".agents/papercuts.json").read_bytes(),
            before,
        )
        self.assertEqual(external_ledger.read_bytes(), before)
        self.assertEqual(list(external_agents.glob(".papercuts-*.tmp")), [])

    def test_lock_contention_is_bounded_and_preserves_bytes(self) -> None:
        self.init()
        source, _ = self.record_input()
        before = self.ledger.read_bytes()
        lock_path = ledger_module._lock_path(
            self.repo.resolve() / ".agents" / "papercuts.json"
        )
        lock_path.parent.mkdir(mode=0o700, exist_ok=True)
        descriptor = os.open(lock_path, os.O_RDWR | os.O_CREAT, 0o600)
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
            payload, _ = self.run_cli(
                "record",
                "--repo",
                str(self.repo),
                "--input",
                str(source),
                expected_code=2,
            )
        finally:
            fcntl.flock(descriptor, fcntl.LOCK_UN)
            os.close(descriptor)
        self.assertEqual(payload["code"], "lock_unavailable")
        self.assertEqual(self.ledger.read_bytes(), before)

    def test_atomic_write_failure_cleans_temporary_and_preserves_ledger(self) -> None:
        self.init()
        source, _ = self.record_input()
        before = self.ledger.read_bytes()
        output = io.StringIO()
        errors = io.StringIO()
        with (
            mock.patch.object(
                ledger_module.os, "replace", side_effect=OSError("replace failed")
            ),
            contextlib.redirect_stdout(output),
            contextlib.redirect_stderr(errors),
        ):
            code = ledger_module.main(
                ["record", "--repo", str(self.repo), "--input", str(source)]
            )
        self.assertEqual(code, 2)
        self.assertEqual(json.loads(errors.getvalue())["code"], "io_failed")
        self.assertEqual(self.ledger.read_bytes(), before)
        self.assertEqual(list(self.ledger.parent.glob(".papercuts-*.tmp")), [])

    def test_directory_fsync_failure_restores_original_bytes(self) -> None:
        self.init()
        source, _ = self.record_input()
        before = self.ledger.read_bytes()
        output = io.StringIO()
        errors = io.StringIO()
        real_fsync = ledger_module.os.fsync
        failed = False

        def fail_first_directory_fsync(descriptor: int) -> None:
            nonlocal failed
            if not failed and stat.S_ISDIR(os.fstat(descriptor).st_mode):
                failed = True
                raise OSError("directory fsync failed")
            real_fsync(descriptor)

        with (
            mock.patch.object(
                ledger_module.os,
                "fsync",
                side_effect=fail_first_directory_fsync,
            ),
            contextlib.redirect_stdout(output),
            contextlib.redirect_stderr(errors),
        ):
            code = ledger_module.main(
                ["record", "--repo", str(self.repo), "--input", str(source)]
            )
        self.assertTrue(failed)
        self.assertEqual(code, 2)
        self.assertEqual(json.loads(errors.getvalue())["code"], "io_failed")
        self.assertEqual(self.ledger.read_bytes(), before)
        self.assertEqual(list(self.ledger.parent.glob(".papercuts-*.tmp")), [])

    def test_init_directory_fsync_failure_removes_created_agents(self) -> None:
        output = io.StringIO()
        errors = io.StringIO()
        with (
            mock.patch.object(
                ledger_module,
                "_fsync_directory",
                side_effect=OSError("directory fsync failed"),
            ),
            contextlib.redirect_stdout(output),
            contextlib.redirect_stderr(errors),
        ):
            code = ledger_module.main(["init", "--repo", str(self.repo)])
        self.assertEqual(code, 2)
        self.assertEqual(json.loads(errors.getvalue())["code"], "io_failed")
        self.assertFalse(self.repo.joinpath(".agents").exists())

    def test_init_commit_fsync_failure_removes_ledger_and_agents(self) -> None:
        output = io.StringIO()
        errors = io.StringIO()
        real_fsync = ledger_module.os.fsync
        directory_fsyncs = 0

        def fail_second_directory_fsync(descriptor: int) -> None:
            nonlocal directory_fsyncs
            if stat.S_ISDIR(os.fstat(descriptor).st_mode):
                directory_fsyncs += 1
                if directory_fsyncs == 2:
                    raise OSError("commit fsync failed")
            real_fsync(descriptor)

        with (
            mock.patch.object(
                ledger_module.os,
                "fsync",
                side_effect=fail_second_directory_fsync,
            ),
            contextlib.redirect_stdout(output),
            contextlib.redirect_stderr(errors),
        ):
            code = ledger_module.main(["init", "--repo", str(self.repo)])
        self.assertEqual(code, 2)
        self.assertEqual(json.loads(errors.getvalue())["code"], "io_failed")
        self.assertGreaterEqual(directory_fsyncs, 3)
        self.assertFalse(self.repo.joinpath(".agents").exists())

    def test_successful_write_flushes_file_replaces_and_fsyncs_directory(self) -> None:
        self.init()
        source, _ = self.record_input()
        replace = ledger_module.os.replace
        fsync_calls: list[int] = []
        replace_calls: list[tuple[object, object]] = []

        def observed_replace(
            *arguments: object,
            **keywords: object,
        ) -> None:
            replace_calls.append((arguments, keywords))
            replace(*arguments, **keywords)

        with (
            mock.patch.object(
                ledger_module.os, "replace", side_effect=observed_replace
            ),
            mock.patch.object(
                ledger_module.os, "fsync", side_effect=lambda fd: fsync_calls.append(fd)
            ),
        ):
            self.assertEqual(
                ledger_module.main(
                    ["record", "--repo", str(self.repo), "--input", str(source)]
                ),
                0,
            )
        self.assertEqual(len(replace_calls), 1)
        self.assertGreaterEqual(len(fsync_calls), 2)
        self.assert_canonical()


if __name__ == "__main__":
    unittest.main()
