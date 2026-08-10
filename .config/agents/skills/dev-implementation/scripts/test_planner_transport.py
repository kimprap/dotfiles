from __future__ import annotations

import contextlib
import hashlib
import io
import json
from dataclasses import replace
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from unittest import mock
from pathlib import Path
from typing import Any

import planner_transport as transport
import orchestrator_profile as orchestrator
from test_orchestrator_profile import (
    attestation as orchestrator_attestation,
    profile as orchestrator_profile,
)


SCRIPT_DIR = Path(__file__).resolve().parent
AGENTS_ROOT = SCRIPT_DIR.parents[2]
SOURCE = AGENTS_ROOT / "personas/planner/PERSONA.md"
OMP_PROJECTION = AGENTS_ROOT / "harnesses/omp/agents/planner.md"
GROK_AGENT = AGENTS_ROOT / "harnesses/grok/agents/planner.md"
TASK_AUTHORITY = "443d7a0f6d86cf069ad603cfdd7438e8dc0c45b9c03b54e31c430280dba126df"

CLOSED_DIAGNOSTIC_FIXTURES = tuple(
    (key, f"first mismatch fixture for {key}") for key in transport.DIAGNOSTIC_ORDER
)


class TransportTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory(prefix="planner-transport-")
        self.root = Path(self.tempdir.name).resolve()
        self.proof_root = self.root / "proof"
        (self.proof_root / "work").mkdir(parents=True)
        self.proof_root.chmod(0o700)
        self.canonical = self.root / "canonical"
        self.omp_files = self.canonical / "omp"
        self.grok_files = self.canonical / "grok"
        self.omp_files.mkdir(parents=True)
        self.grok_files.mkdir(parents=True)
        self.source = self.canonical / "PERSONA.md"
        self.source.write_bytes(SOURCE.read_bytes())
        self.omp_projection = self.omp_files / "planner.md"
        self.omp_projection.write_bytes(OMP_PROJECTION.read_bytes())
        self.grok_agent = self.grok_files / "planner.md"
        self.grok_agent.write_bytes(GROK_AGENT.read_bytes())
        self.omp_config = self.root / "omp-config.yml"
        self.omp_config.write_text(
            "modelRoles:\n  plan: openai-codex/gpt-5.6-sol:max\n", encoding="utf-8"
        )
        self.grok_config = self.root / "grok-config.toml"
        self.grok_config.write_text(
            "[subagents]\nenabled = true\n\n[subagents.toggle]\nplanner = true\n",
            encoding="utf-8",
        )

    def tearDown(self) -> None:
        self.tempdir.cleanup()

    def profile(self, harness: str) -> tuple[Path, dict[str, Any]]:
        if harness == "omp":
            projections = [(self.omp_projection, self.omp_projection.read_bytes())]
            native = {
                "kind": "user-agent",
                "name": "planner",
                "source_paths": [str(self.omp_projection)],
            }
            model = {
                "selector": "@plan",
                "source": "modelRoles.plan",
                "concrete": "openai-codex/gpt-5.6-sol",
            }
            effort = {"source": "agent.thinking-level", "concrete": "max"}
            capabilities = {
                "declared": list(transport.OMP_DECLARED),
                "effective": list(transport.OMP_EFFECTIVE),
            }
            config = self.omp_config
        else:
            projections = [(self.grok_agent, self.grok_agent.read_bytes())]
            native = {
                "kind": "user-agent",
                "name": "planner",
                "source_paths": [str(self.grok_agent)],
            }
            model = {
                "selector": "planner",
                "source": "agent.model",
                "concrete": "grok-4.5",
            }
            effort = {"source": "parent.command", "concrete": "high"}
            capabilities = {
                "declared": list(transport.GROK_EFFECTIVE),
                "effective": list(transport.GROK_EFFECTIVE),
            }
            config = self.grok_config
        profile: dict[str, Any] = {
            "schema": transport.PROFILE_SCHEMA,
            "attempt_authority_sha256": TASK_AUTHORITY,
            "role": "planner",
            "harness": harness,
            "environment": "disposable-proof",
            "canonical_persona": {
                "path": str(self.source),
                "sha256": hashlib.sha256(self.source.read_bytes()).hexdigest(),
            },
            "projection": [
                {"path": str(path), "sha256": hashlib.sha256(data).hexdigest()}
                for path, data in projections
            ],
            "native": native,
            "model": model,
            "reasoning_effort": effort,
            "capabilities": capabilities,
            "topology": {"parent_depth": 0, "child_depth": 1, "child_can_spawn": False},
            "fallback": "none",
            "config": {
                "path": str(config),
                "sha256": hashlib.sha256(config.read_bytes()).hexdigest(),
            },
            "proof_root": str(self.proof_root),
        }
        profile_path = self.root / f"{harness}-profile.json"
        profile_path.write_text(
            json.dumps(profile, sort_keys=True, separators=(",", ":")) + "\n",
            encoding="utf-8",
        )
        return profile_path, profile

    def smoke_task(self, profile_line: str) -> str:
        return transport._smoke_task(
            profile_line, *transport._smoke_paths(self.proof_root / "work")
        )

    def omp_wire_fixture(
        self, profile_line: str
    ) -> tuple[list[dict[str, Any]], dict[str, Any]]:
        task = self.smoke_task(profile_line)
        task_args = {
            "context": "Bounded native planner transport proof.",
            "tasks": [{"name": "planner", "agent": "planner", "task": task}],
        }
        child_id = "planner-child"
        progress = {
            "index": 0,
            "id": child_id,
            "agent": "planner",
            "agentSource": "user",
            "status": "running",
            "task": task,
            "recentTools": [],
            "toolCount": 0,
            "requests": 0,
            "tokens": 0,
            "cost": 0,
            "durationMs": 1,
            "resolvedModel": f"{transport.OMP_MODEL}:max",
            "resolvedModelIsFallback": False,
        }
        metadata = {
            "id": child_id,
            "agent": "planner",
            "agentSource": "user",
            "index": 0,
        }
        frames: list[dict[str, Any]] = [
            {"type": "tool_execution_start", "toolName": "task", "args": task_args},
            {
                "type": "subagent_lifecycle",
                "payload": {**metadata, "status": "started"},
            },
            {
                "type": "subagent_progress",
                "payload": {
                    "index": 0,
                    "agent": "planner",
                    "agentSource": "user",
                    "task": task,
                    "progress": progress,
                },
            },
        ]
        for name, arguments in (
            ("read", {"path": "input"}),
            ("bash", {"command": "/usr/bin/shasum -a 256 input"}),
            ("write", {"path": "output", "content": "planner-smoke-ok\n"}),
        ):
            frames.append(
                {
                    "type": "subagent_event",
                    "payload": {
                        "id": child_id,
                        "event": {
                            "type": "tool_execution_start",
                            "toolName": name,
                            "args": arguments,
                        },
                    },
                }
            )
        frames.append(
            {
                "type": "subagent_event",
                "payload": {
                    "id": child_id,
                    "event": {
                        "type": "tool_execution_start",
                        "toolName": "yield",
                        "args": {"result": "planner-smoke-ok"},
                    },
                },
            }
        )
        frames.extend(
            [
                {
                    "type": "subagent_event",
                    "payload": {
                        "id": child_id,
                        "event": {
                            "type": "message_end",
                            "message": {
                                "role": "assistant",
                                "provider": "openai-codex",
                                "model": "gpt-5.6-sol",
                                "content": [{"type": "text", "text": profile_line}],
                            },
                        },
                    },
                },
                {
                    "type": "subagent_lifecycle",
                    "payload": {**metadata, "status": "completed"},
                },
                {
                    "type": "message_end",
                    "message": {
                        "role": "assistant",
                        "provider": "openai-codex",
                        "model": "gpt-5.6-sol",
                        "content": [{"type": "text", "text": "planner-smoke-ok"}],
                    },
                },
                {
                    "type": "agent_end",
                    "isTerminal": True,
                    "messages": [
                        {
                            "role": "assistant",
                            "provider": "openai-codex",
                            "model": "gpt-5.6-sol",
                            "content": [{"type": "text", "text": "planner-smoke-ok"}],
                        }
                    ],
                },
            ]
        )
        return frames, {"subagents": []}

    def grok_wire_fixture(self, profile_line: str) -> list[dict[str, Any]]:
        task = self.smoke_task(profile_line)
        digest = hashlib.sha256(transport.FIXED_INPUT).hexdigest()
        child_output = f"{profile_line}\nSHA256 {digest}"
        input_path, output_path = transport._smoke_paths(self.proof_root / "work")
        spawn = {
            "subagent_type": "planner",
            "description": transport.GROK_SPAWN_DESCRIPTION,
            "capability_mode": "all",
            "isolation": "none",
            "background": False,
            "cwd": str(self.proof_root / "work"),
            "prompt": task,
        }
        spawn_id = "spawn-1"
        child_calls = (
            (
                "read-1",
                "read_file",
                {"target_file": str(input_path)},
            ),
            (
                "execute-1",
                "run_terminal_command",
                {"command": f"/usr/bin/shasum -a 256 {input_path}"},
            ),
            (
                "write-1",
                "write",
                {
                    "file_path": str(output_path),
                    "content": transport.FIXED_OUTPUT.decode(),
                },
            ),
        )
        frames: list[dict[str, Any]] = [
            {"type": "available_commands", "commands": [], "tools": []},
            {"type": "text", "data": "Starting planner transport."},
            {
                "type": "tool_call",
                "toolCallId": spawn_id,
                "title": "spawn_subagent",
                "kind": "task",
                "status": "pending",
                "toolName": "spawn_subagent",
                "rawInput": spawn,
            },
            {
                "type": "tool_call_update",
                "toolCallId": spawn_id,
                "status": None,
                "content": [],
                "rawOutput": None,
            },
        ]
        for call_id, name, arguments in child_calls:
            frames.extend(
                [
                    {
                        "type": "tool_call",
                        "toolCallId": call_id,
                        "title": name,
                        "kind": transport._event_capability(name),
                        "status": "pending",
                        "toolName": name,
                        "rawInput": arguments,
                    },
                    {
                        "type": "tool_call_update",
                        "toolCallId": call_id,
                        "status": "completed",
                        "content": [],
                        "rawOutput": {"type": "fixture"},
                    },
                ]
            )
        frames.extend(
            [
                {"type": "text", "data": child_output},
                {
                    "type": "tool_call_update",
                    "toolCallId": spawn_id,
                    "status": "completed",
                    "content": [
                        {
                            "type": "content",
                            "content": {"type": "text", "text": child_output},
                        }
                    ],
                    "rawOutput": {
                        "type": "SubagentCompleted",
                        "output": child_output,
                        "subagent_id": "planner-child",
                        "subagent_type": "planner",
                        "tool_calls": 3,
                        "turns": 1,
                    },
                },
                {"type": "text", "data": "planner-smoke-ok"},
                {
                    "type": "end",
                    "stopReason": "end_turn",
                    "modelUsage": {transport.GROK_USAGE_MODEL: {"modelCalls": 3}},
                },
            ]
        )
        return frames

    def test_passing_omp_and_grok_static_preflights(self) -> None:
        for harness in ("omp", "grok"):
            with self.subTest(harness=harness):
                path, _profile = self.profile(harness)
                code, payload = transport.run_preflight(
                    harness=harness,
                    environment="disposable-proof",
                    role_profile=path,
                    cwd=self.proof_root / "work",
                )
                self.assertEqual(code, 0, payload)
                self.assertEqual(payload["schema"], transport.PREFLIGHT_SCHEMA)
                self.assertEqual(payload["status"], "ready")
                self.assertEqual(
                    set(payload), {"role_profile_sha256", "schema", "status"}
                )

    def test_capability_profiles_require_exact_ordered_tuples_before_dispatch(
        self,
    ) -> None:
        for harness in ("omp", "grok"):
            profile_path, profile = self.profile(harness)
            if harness == "omp":
                smoke_config = self.proof_root / "capability-omp-config.yml"
                smoke_config.write_bytes(self.omp_config.read_bytes())
                smoke_config.chmod(0o600)
                profile["config"] = {
                    "path": str(smoke_config),
                    "sha256": hashlib.sha256(smoke_config.read_bytes()).hexdigest(),
                }
            for field in ("declared", "effective"):
                expected = tuple(profile["capabilities"][field])
                variants = (
                    ("appended", expected + ("unexpected",)),
                    ("duplicate", expected + (expected[-1],)),
                    ("omitted", expected[:-1]),
                    ("reordered", (expected[1], expected[0], *expected[2:])),
                )
                for variant, observed in variants:
                    with self.subTest(harness=harness, field=field, variant=variant):
                        candidate = json.loads(json.dumps(profile))
                        candidate["capabilities"][field] = list(observed)
                        profile_path.write_text(
                            json.dumps(candidate, sort_keys=True, separators=(",", ":"))
                            + "\n",
                            encoding="utf-8",
                        )
                        calls: list[str] = []

                        def runner(
                            *_args: object, **_kwargs: object
                        ) -> transport.NativeResult:
                            calls.append("native")
                            raise AssertionError("native runner must not be called")

                        evidence = (
                            self.root
                            / f"{harness}-{field}-{variant}-capability-evidence.json"
                        )
                        code, payload = transport.run_smoke(
                            harness=harness,
                            role_profile=profile_path,
                            proof_root=self.proof_root,
                            evidence=evidence,
                            native_runner=runner,
                        )
                        self.assertEqual(code, 69, payload)
                        self.assertIn(payload["capability"], transport.DIAGNOSTIC_ORDER)
                        self.assertEqual(
                            payload["source"], f"capabilities.{field}", payload
                        )
                        self.assertEqual(calls, [])
                        self.assertFalse(evidence.exists())
                        self.assertFalse(
                            (self.proof_root / ".planner-smoke-consumed").exists()
                        )
                        self.assertLessEqual(
                            len(
                                json.dumps(
                                    payload, sort_keys=True, separators=(",", ":")
                                ).encode()
                            ),
                            1024,
                        )

    def test_parent_orchestrator_profile_pass_mismatch_no_fallback_and_safe_downgrade(
        self,
    ) -> None:
        expected = orchestrator_profile()
        result = orchestrator.assess(expected, orchestrator_attestation(expected))
        self.assertEqual(result.decision, "full-orchestration")
        self.assertEqual(result.mismatches, ())

        for label, field, value in (
            ("mismatch", "model_resolved", "other-model"),
            ("no-fallback", "fallback", "alternate-model"),
        ):
            with self.subTest(case=label):
                expected = orchestrator_profile(downgrade=True)
                observed = orchestrator_attestation(expected)
                observed["runtime"][field] = value
                result = orchestrator.assess(expected, observed)
                self.assertEqual(result.decision, "transport-unavailable")
                self.assertNotEqual(result.decision, "full-orchestration")

        expected = orchestrator_profile(downgrade=True)
        observed = orchestrator_attestation(expected)
        observed["capabilities"]["delegate"] = "unavailable"
        observed["capabilities"]["observe"] = "unavailable"
        observed["capabilities"]["control"] = "unavailable"
        observed["limits"]["max_child_depth"] = 0
        observed["limits"]["max_concurrency"] = 1
        result = orchestrator.assess(expected, observed)
        self.assertEqual(result.decision, "one-owner-sequential")
        self.assertTrue(result.mismatches)
        self.assertNotEqual(result.decision, "full-orchestration")

    def test_each_closed_key_is_table_driven_bounded_and_preflight_only(self) -> None:
        original_config = self.grok_config.read_bytes()
        other_root = self.root / "other-proof"
        other_root.mkdir()
        for index, (key, _description) in enumerate(CLOSED_DIAGNOSTIC_FIXTURES):
            with self.subTest(key=key):
                self.grok_config.write_bytes(original_config)
                path, profile = self.profile("grok")
                if key == "preflight-integrity":
                    profile["schema"] = "wrong"
                elif key == "canonical-persona":
                    profile["canonical_persona"]["sha256"] = "0" * 64
                elif key == "projection-identity":
                    profile["projection"][0]["sha256"] = "0" * 64
                elif key == "agent-discovery":
                    profile["native"]["name"] = "wrong"
                    profile["native"]["kind"] = "wrong"
                    self.grok_config.write_bytes(original_config + b"# model drift\n")
                elif key == "role-binding":
                    profile["native"]["kind"] = "wrong"
                elif key == "model":
                    profile["model"]["concrete"] = "grok-build"
                elif key == "reasoning-effort":
                    profile["reasoning_effort"]["concrete"] = "low"
                elif key in {"read", "write", "execute"}:
                    profile["capabilities"]["declared"].remove(key)
                    profile["capabilities"]["effective"].remove(key)
                elif key == "delegation-depth":
                    profile["topology"]["child_depth"] = 2
                elif key == "subagents-enabled":
                    self.grok_config.write_bytes(
                        original_config.replace(b"enabled = true", b"enabled = false")
                    )
                    profile["config"]["sha256"] = hashlib.sha256(
                        self.grok_config.read_bytes()
                    ).hexdigest()
                elif key == "no-fallback":
                    profile["fallback"] = "builtin"
                elif key == "state-isolation":
                    profile["proof_root"] = str(other_root)
                elif key == "auth-isolation":
                    profile["auth_token"] = "fixture"
                path.write_text(
                    json.dumps(profile, sort_keys=True, separators=(",", ":")) + "\n",
                    encoding="utf-8",
                )
                calls: list[str] = []

                def runner(*_args: object, **_kwargs: object) -> transport.NativeResult:
                    calls.append("native")
                    return transport.NativeResult(0, transport.FIXED_OUTPUT, b"", True)

                evidence = self.root / f"closed-{index}.json"
                code, payload = transport.run_smoke(
                    harness="grok",
                    role_profile=path,
                    proof_root=self.proof_root,
                    evidence=evidence,
                    native_runner=runner,
                )
                self.assertEqual(code, 69, payload)
                self.assertEqual(payload["capability"], key, payload)
                self.assertEqual(calls, [])
                self.assertFalse(evidence.exists())
                encoded = json.dumps(payload, sort_keys=True, separators=(",", ":"))
                self.assertNotIn("\n", encoded)
                self.assertLessEqual(len(encoded), 1024)
        self.grok_config.write_bytes(original_config)

    def test_cli_misuse_is_integrity_and_exit_64(self) -> None:
        stream = io.StringIO()
        with contextlib.redirect_stdout(stream):
            code = transport.main(["preflight", "--harness", "omp"])
        self.assertEqual(code, 64)
        payload = json.loads(stream.getvalue())
        self.assertEqual(payload["capability"], "preflight-integrity")
        self.assertEqual(payload["status"], "transport-unavailable")

    def test_proof_tree_symlink_is_state_isolation_failure(self) -> None:
        path, _profile = self.profile("omp")
        real_work = self.proof_root / "work"
        real_work.rmdir()
        real_work.symlink_to(self.root)
        code, payload = transport.run_preflight(
            harness="omp",
            environment="disposable-proof",
            role_profile=path,
            cwd=real_work,
        )
        self.assertEqual(code, 69)
        self.assertEqual(payload["capability"], "state-isolation")

    def test_smoke_proof_root_preflight_rejects_unsafe_paths_without_dispatch(
        self,
    ) -> None:
        public_root = self.root / "public-proof"
        (public_root / "work").mkdir(parents=True)
        public_root.chmod(0o755)

        unsafe_parent = self.root / "unsafe-ancestor"
        unsafe_root = unsafe_parent / "proof"
        (unsafe_root / "work").mkdir(parents=True)
        unsafe_parent.chmod(0o777)
        unsafe_root.chmod(0o700)

        real_parent = self.root / "real-ancestor"
        real_root = real_parent / "proof"
        (real_root / "work").mkdir(parents=True)
        real_root.chmod(0o700)
        linked_parent = self.root / "linked-ancestor"
        linked_parent.symlink_to(real_parent, target_is_directory=True)
        linked_root = linked_parent / "proof"

        root_link = self.root / "proof-link"
        root_link.symlink_to(self.proof_root, target_is_directory=True)
        cases = (
            ("relative", Path("relative-proof"), None),
            ("missing", self.root / "missing-proof", None),
            ("root-symlink", root_link, None),
            ("public", public_root, None),
            ("writable-ancestor", unsafe_root, None),
            ("lexical-symlink-ancestor", linked_root, None),
            ("wrong-owner", self.proof_root, transport.os.geteuid() + 1),
        )
        calls: list[str] = []

        def runner(*_args: object, **_kwargs: object) -> transport.NativeResult:
            calls.append("native")
            raise AssertionError("native runner must not be called")

        for name, proof_root, effective_uid in cases:
            with self.subTest(name=name):
                profile_path, profile = self.profile("grok")
                profile["proof_root"] = str(proof_root)
                profile_path.write_text(
                    json.dumps(profile, sort_keys=True, separators=(",", ":")) + "\n",
                    encoding="utf-8",
                )
                evidence = self.root / f"{name}-root-evidence.json"
                uid_patch = (
                    mock.patch.object(
                        transport.os, "geteuid", return_value=effective_uid
                    )
                    if effective_uid is not None
                    else contextlib.nullcontext()
                )
                with uid_patch:
                    code, payload = transport.run_smoke(
                        harness="grok",
                        role_profile=profile_path,
                        proof_root=proof_root,
                        evidence=evidence,
                        native_runner=runner,
                    )
                self.assertEqual(code, 69, payload)
                self.assertEqual(payload["capability"], "state-isolation", payload)
                self.assertFalse(evidence.exists())
        self.assertEqual(calls, [])
        self.assertFalse((self.proof_root / ".planner-smoke-consumed").exists())

    def test_omp_setup_version_accepts_only_exact_native_serialization(self) -> None:
        config = (
            self.proof_root
            / "home"
            / ".omp"
            / "profiles"
            / "planner-proof"
            / "agent"
            / "config.yml"
        )
        config.parent.mkdir(parents=True)
        first = b"task:\n  showResolvedModelBadge: true\n"
        second = b"modelRoles:\n  plan: openai-codex/gpt-5.6-sol:max\n"
        expected = first + second
        observed_setup_only = (
            first
            + second.replace(b"modelRoles:\n", b"modelRoles: \n", 1)
            + b"setupVersion: 1"
        )
        observed_selected_setup = (
            first
            + second.replace(b"modelRoles:\n", b"modelRoles: \n", 1)
            + b"symbolPreset: unicode\n"
            + b"theme: \n"
            + b"  dark: titanium\n"
            + b"setupVersion: 1"
        )
        profile = {
            "config": {
                "path": str(config),
                "sha256": hashlib.sha256(expected).hexdigest(),
            }
        }
        for raw in (expected, observed_setup_only, observed_selected_setup):
            with self.subTest(raw=raw):
                config.write_bytes(raw)
                config.chmod(0o600)
                transport._normalize_omp_setup_version(profile, self.proof_root)
                self.assertEqual(config.read_bytes(), expected)
                self.assertEqual(config.stat().st_mode & 0o777, 0o600)

    def test_omp_setup_version_rejects_every_other_drift(self) -> None:
        config = self.proof_root / "config.yml"
        expected = b"modelRoles:\n  plan: openai-codex/gpt-5.6-sol:max\n"
        observed = (
            expected.replace(b"modelRoles:\n", b"modelRoles: \n", 1)
            + b"setupVersion: 1"
        )
        observed_selected_setup = (
            expected.replace(b"modelRoles:\n", b"modelRoles: \n", 1)
            + b"symbolPreset: unicode\n"
            + b"theme: \n"
            + b"  dark: titanium\n"
            + b"setupVersion: 1"
        )
        profile = {
            "config": {
                "path": str(config),
                "sha256": hashlib.sha256(expected).hexdigest(),
            }
        }
        invalid = (
            b"setupVersion: 1\n" + expected,
            b"modelRoles:\nsetupVersion: 1\n  plan: openai-codex/gpt-5.6-sol:max\n",
            expected + b"setupVersion: 1\n",
            expected + b"setupVersion: 1",
            expected.replace(b"modelRoles:\n", b"modelRoles:  \n", 1)
            + b"setupVersion: 1",
            expected.replace(b"modelRoles:\n", b"modelRoles:\t\n", 1)
            + b"setupVersion: 1",
            observed + b"\n",
            observed.replace(b"\n", b"\r\n"),
            observed.replace(b"setupVersion: 1", b"setupVersion: 2"),
            observed + b"\nsetupVersion: 1",
            observed.replace(b"setupVersion: 1", b"setupVersion: 1 # unexpected"),
            observed.replace(
                b"  plan: openai-codex/gpt-5.6-sol:max\n",
                b"  plan: openai-codex/gpt-5.6-sol:max \n",
            ),
            b"modelRoles: \n" + observed,
            observed.replace(b"modelRoles: \n", b"  modelRoles: \n", 1),
            observed.replace(
                b"  plan: openai-codex/gpt-5.6-sol:max\n",
                b"  plan: openai-codex/gpt-5.6-sol:max\n# unrelated\n",
            ),
            expected.replace(b"modelRoles:\n", b"modelRoles: \n", 1),
            observed_selected_setup.replace(
                b"symbolPreset: unicode", b"symbolPreset: ascii"
            ),
            observed_selected_setup.replace(b"dark: titanium", b"dark: light"),
            observed_selected_setup.replace(b"theme: \n", b"theme:\n"),
            observed_selected_setup + b"\n",
        )
        for raw in invalid:
            with self.subTest(raw=raw):
                config.write_bytes(raw)
                with self.assertRaises(transport.PreflightFailure) as caught:
                    transport._normalize_omp_setup_version(profile, self.proof_root)
                self.assertEqual(caught.exception.key, "preflight-integrity")
                self.assertEqual(config.read_bytes(), raw)

        outside = self.root / "outside-config.yml"
        outside.write_bytes(observed)
        profile["config"]["path"] = str(outside)
        with self.assertRaises(transport.PreflightFailure) as caught:
            transport._normalize_omp_setup_version(profile, self.proof_root)
        self.assertEqual(caught.exception.key, "state-isolation")

        target = self.root / "symlink-target.yml"
        target.write_bytes(observed)
        linked = self.proof_root / "linked-config.yml"
        linked.symlink_to(target)
        profile["config"]["path"] = str(linked)
        with self.assertRaises(transport.PreflightFailure) as caught:
            transport._normalize_omp_setup_version(profile, self.proof_root)
        self.assertEqual(caught.exception.key, "state-isolation")

        directory = self.proof_root / "config-directory"
        directory.mkdir()
        profile["config"]["path"] = str(directory)
        with self.assertRaises(transport.PreflightFailure) as caught:
            transport._normalize_omp_setup_version(profile, self.proof_root)
        self.assertEqual(caught.exception.key, "state-isolation")

    def test_omp_setup_version_atomic_failure_preserves_observed_bytes(self) -> None:
        config = self.proof_root / "config.yml"
        expected = b"modelRoles:\n  plan: openai-codex/gpt-5.6-sol:max\n"
        observed = (
            expected.replace(b"modelRoles:\n", b"modelRoles: \n", 1)
            + b"setupVersion: 1"
        )
        config.write_bytes(observed)
        profile = {
            "config": {
                "path": str(config),
                "sha256": hashlib.sha256(expected).hexdigest(),
            }
        }
        with mock.patch.object(
            transport.os, "replace", side_effect=OSError("injected")
        ):
            with self.assertRaises(transport.PreflightFailure) as caught:
                transport._normalize_omp_setup_version(profile, self.proof_root)
        self.assertEqual(caught.exception.key, "state-isolation")
        self.assertEqual(config.read_bytes(), observed)
        self.assertEqual(list(config.parent.glob(".config.yml.*")), [])

    def test_omp_setup_failure_precedes_every_dispatch_effect(self) -> None:
        config = self.proof_root / "home/.omp/config.yml"
        config.parent.mkdir(parents=True)
        expected = b"modelRoles:\n  plan: openai-codex/gpt-5.6-sol:max\n"
        invalid = expected + b"setupVersion: 1"
        config.write_bytes(invalid)
        profile_path, profile = self.profile("omp")
        profile["config"] = {
            "path": str(config),
            "sha256": hashlib.sha256(expected).hexdigest(),
        }
        profile_path.write_text(
            json.dumps(profile, sort_keys=True, separators=(",", ":")) + "\n",
            encoding="utf-8",
        )
        called = False

        def runner(*_args: object, **_kwargs: object) -> transport.NativeResult:
            nonlocal called
            called = True
            raise AssertionError("native runner must not be called")

        evidence = self.root / "evidence.json"
        with mock.patch.object(transport, "run_preflight") as preflight:
            code, payload = transport.run_smoke(
                harness="omp",
                role_profile=profile_path,
                proof_root=self.proof_root,
                evidence=evidence,
                native_runner=runner,
            )
        self.assertEqual(code, 69)
        self.assertEqual(payload["capability"], "preflight-integrity")
        preflight.assert_not_called()
        self.assertFalse(called)
        self.assertFalse(evidence.exists())
        self.assertFalse((self.proof_root / ".planner-smoke-consumed").exists())
        self.assertEqual(config.read_bytes(), invalid)

    def test_omp_model_wire_requires_provider_and_id_before_spawn(self) -> None:
        valid = {
            "models": [
                {"provider": "openai-codex", "id": "gpt-5.6-sol"},
                {"provider": "xai", "id": "grok-4.5"},
            ]
        }
        self.assertEqual(
            transport._omp_available_model_identities(valid),
            ("openai-codex/gpt-5.6-sol", "xai/grok-4.5"),
        )
        invalid = (
            {"models": []},
            {"models": "openai-codex/gpt-5.6-sol"},
            {"models": [{"provider": "openai-codex"}]},
            {
                "models": [
                    {
                        "provider": "openai-codex",
                        "id": "openai-codex/gpt-5.6-sol",
                    }
                ]
            },
        )
        for data in invalid:
            with self.subTest(data=data):
                with self.assertRaises(transport.PreflightFailure) as caught:
                    transport._omp_available_model_identities(data)
                self.assertEqual(caught.exception.key, "model")

    def test_omp_runtime_state_binds_model_and_effort_separately(self) -> None:
        valid = {
            "model": {"provider": "openai-codex", "id": "gpt-5.6-sol"},
            "thinkingLevel": "max",
        }
        transport._validate_omp_state(valid)
        for state, key in (
            (
                {
                    "model": {"provider": "openai-codex", "id": "gpt-5.6-codex"},
                    "thinkingLevel": "max",
                },
                "model",
            ),
            (
                {
                    "model": {"provider": "openai-codex", "id": "gpt-5.6-sol"},
                    "thinkingLevel": "high",
                },
                "reasoning-effort",
            ),
        ):
            with self.subTest(key=key):
                with self.assertRaises(transport.PreflightFailure) as caught:
                    transport._validate_omp_state(state)
                self.assertEqual(caught.exception.key, key)

    def test_default_omp_runner_binds_profile_model_before_rpc(self) -> None:
        _path, profile = self.profile("omp")
        captured: list[str] = []

        def capture(command: list[str], *_args: object) -> object:
            captured.extend(command)
            return mock.sentinel.result

        with mock.patch.object(transport, "_run_omp", side_effect=capture):
            result = transport._default_native_runner(
                "omp", self.proof_root, profile, "0" * 64
            )

        self.assertIs(result, mock.sentinel.result)
        self.assertEqual(
            captured,
            [
                "/Users/kim/.local/bin/omp",
                "--profile",
                "planner-proof",
                "--model",
                "@plan",
                "--mode",
                "rpc",
            ],
        )

    def test_default_grok_runner_installs_agent_and_approves_bounded_tools(
        self,
    ) -> None:
        _path, profile = self.profile("grok")
        captured: dict[str, object] = {}

        def capture(
            command: list[str],
            environment: dict[str, str],
            work: Path,
            profile_line: str,
            output_path: Path,
        ) -> object:
            captured.update(
                command=command,
                environment=environment,
                work=work,
                profile_line=profile_line,
                output_path=output_path,
            )
            return mock.sentinel.result

        with mock.patch.object(transport, "_run_grok", side_effect=capture):
            result = transport._default_native_runner(
                "grok", self.proof_root, profile, "0" * 64
            )

        self.assertIs(result, mock.sentinel.result)
        command = captured["command"]
        assert isinstance(command, list)
        self.assertEqual(
            command[:-1],
            [
                "/Users/kim/.grok/bin/grok",
                "--model",
                "grok-4.5",
                "--effort",
                "high",
                "--always-approve",
                "--cwd",
                str(self.proof_root / "work"),
                "--output-format",
                "streaming-json",
                "--no-memory",
                "--disable-web-search",
                "--no-auto-update",
                "--max-turns",
                "8",
                "-p",
            ],
        )
        self.assertIn('subagent_type="planner"', command[-1])
        environment = captured["environment"]
        assert isinstance(environment, dict)
        self.assertEqual(
            environment["GROK_HOME"], str(self.proof_root / "home" / ".grok")
        )
        installed = self.proof_root / "home" / ".grok" / "agents" / "planner.md"
        self.assertEqual(installed.read_bytes(), self.grok_agent.read_bytes())

    def test_default_omp_runner_rejects_invalid_model_selector(self) -> None:
        cases = (
            ("missing", False, None),
            ("null", True, None),
            ("empty", True, ""),
            ("whitespace", True, " @plan"),
            ("non-string", True, 7),
        )
        for name, present, selector in cases:
            with self.subTest(name=name):
                _path, profile = self.profile("omp")
                model = profile["model"]
                assert isinstance(model, dict)
                if present:
                    model["selector"] = selector
                else:
                    model.pop("selector")
                with mock.patch.object(transport, "_run_omp") as run:
                    with self.assertRaises(transport.PreflightFailure) as caught:
                        transport._default_native_runner(
                            "omp", self.proof_root, profile, "0" * 64
                        )
                self.assertEqual(caught.exception.key, "preflight-integrity")
                run.assert_not_called()

    def test_omp_rpc_reader_consumes_response_buffered_after_event(self) -> None:
        child = r"""
import json, os, sys
for raw in sys.stdin.buffer:
    request = json.loads(raw)
    response = json.dumps({"type":"response","id":request["id"],"command":request["type"],"success":True}, separators=(",", ":")).encode() + b"\n"
    if request["type"] == "set_thinking_level":
        event = b'{"type":"thinking_level_changed","thinkingLevel":"max"}\n'
        os.write(sys.stdout.fileno(), event + response)
    else:
        os.write(sys.stdout.fileno(), response)
"""
        process = subprocess.Popen(
            [sys.executable, "-u", "-c", child],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        assert process.stdout is not None
        reader = transport._RpcLineReader(process.stdout)
        frames: list[dict[str, Any]] = []
        try:
            transport._rpc_request(
                process,
                reader,
                frames,
                {"id": "model", "type": "set_model"},
                time.monotonic() + 0.25,
            )
            result = transport._rpc_request(
                process,
                reader,
                frames,
                {"id": "effort", "type": "set_thinking_level", "level": "max"},
                time.monotonic() + 0.25,
            )
            self.assertEqual(result, {})
            self.assertEqual(
                [(frame["type"], frame.get("id")) for frame in frames],
                [
                    ("response", "model"),
                    ("thinking_level_changed", None),
                    ("response", "effort"),
                ],
            )
        finally:
            reader.close()
            if process.stdin is not None:
                process.stdin.close()
            process.terminate()
            process.wait(timeout=1)
            process.stdout.close()
            if process.stderr is not None:
                process.stderr.close()

    def test_successful_native_result_requires_complete_runtime_evidence(self) -> None:
        path, profile = self.profile("grok")
        profile_sha = hashlib.sha256(path.read_bytes()).hexdigest()

        def runner(*_args: object, **_kwargs: object) -> transport.NativeResult:
            return transport.NativeResult(
                0,
                transport.FIXED_OUTPUT,
                b"",
                True,
                child_count=1,
                child_tool_calls=3,
                sha256_command_count=1,
                native_events=("read", "execute", "write"),
                profile_line=transport._profile_line(profile, profile_sha),
                output_sha256=hashlib.sha256(transport.FIXED_OUTPUT).hexdigest(),
            )

        evidence = self.root / "native-evidence.json"
        code, payload = transport.run_smoke(
            harness="grok",
            role_profile=path,
            proof_root=self.proof_root,
            evidence=evidence,
            native_runner=runner,
        )

        self.assertEqual(code, 0, payload)
        self.assertEqual(payload["child_count"], 1)
        self.assertEqual(payload["sha256_command_count"], 1)
        self.assertEqual(json.loads(evidence.read_text()), payload)

    def test_omp_rpc_wire_proves_exact_child_and_tools(self) -> None:
        path, profile = self.profile("omp")
        profile_line = transport._profile_line(
            profile, hashlib.sha256(path.read_bytes()).hexdigest()
        )
        frames, subagents = self.omp_wire_fixture(profile_line)

        result = transport._parse_omp_frames(
            frames,
            subagents,
            profile_line=profile_line,
            work=self.proof_root / "work",
        )

        self.assertEqual(result, (1, 3, 1, ("read", "execute", "write"), 0))

    def test_omp_rpc_wire_rejects_every_prohibited_shape(self) -> None:
        path, profile = self.profile("omp")
        profile_line = transport._profile_line(
            profile, hashlib.sha256(path.read_bytes()).hexdigest()
        )
        base, subagents = self.omp_wire_fixture(profile_line)

        def clone() -> list[dict[str, Any]]:
            return json.loads(json.dumps(base))

        missing_terminal = clone()[:-1]
        extra_child = clone()
        extra_child[-2:-2] = [
            {
                "type": "subagent_lifecycle",
                "payload": {
                    "id": "planner-child-2",
                    "agent": "planner",
                    "agentSource": "user",
                    "index": 1,
                    "status": status,
                },
            }
            for status in ("started", "completed")
        ]
        wrong_source = clone()
        for frame in wrong_source:
            payload = frame.get("payload")
            if isinstance(payload, dict) and "agentSource" in payload:
                payload["agentSource"] = "project"
            progress = payload.get("progress") if isinstance(payload, dict) else None
            if isinstance(progress, dict):
                progress["agentSource"] = "project"
        wrong_model = clone()
        wrong_model[2]["payload"]["progress"]["resolvedModel"] = "openai-codex/gpt-5.5"
        nested_task = clone()
        nested_task[3]["payload"]["event"]["toolName"] = "task"
        extra_tool = clone()
        extra_tool.insert(6, json.loads(json.dumps(extra_tool[3])))
        unknown_control = clone()
        unknown_control[6]["payload"]["event"]["toolName"] = "park"
        nonterminal_yield = clone()
        nonterminal_yield[5], nonterminal_yield[6] = (
            nonterminal_yield[6],
            nonterminal_yield[5],
        )
        fallback = clone()
        fallback[2]["payload"]["progress"]["resolvedModelIsFallback"] = True
        missing_lifecycle = [
            frame
            for frame in clone()
            if not (
                frame.get("type") == "subagent_lifecycle"
                and frame["payload"].get("status") == "started"
            )
        ]
        bad_parent_tool = clone()
        bad_parent_tool.insert(
            1,
            {
                "type": "tool_execution_start",
                "toolName": "hub",
                "args": {"op": "send", "to": "planner-child"},
            },
        )
        cases = (
            ("missing-terminal", missing_terminal, subagents, "execute"),
            ("extra-child", extra_child, subagents, "delegation-depth"),
            ("wrong-source", wrong_source, subagents, "agent-discovery"),
            ("wrong-model", wrong_model, subagents, "model"),
            ("nested-task", nested_task, subagents, "delegation-depth"),
            ("extra-tool", extra_tool, subagents, "delegation-depth"),
            ("unknown-control", unknown_control, subagents, "delegation-depth"),
            ("nonterminal-yield", nonterminal_yield, subagents, "delegation-depth"),
            ("fallback", fallback, subagents, "no-fallback"),
            ("missing-lifecycle", missing_lifecycle, subagents, "delegation-depth"),
            ("bad-parent-tool", bad_parent_tool, subagents, "role-binding"),
            ("malformed-snapshot", clone(), {"results": []}, "execute"),
        )
        for name, frames, snapshots, key in cases:
            with self.subTest(name=name):
                with self.assertRaises(transport.PreflightFailure) as caught:
                    transport._parse_omp_frames(
                        frames,
                        snapshots,
                        profile_line=profile_line,
                        work=self.proof_root / "work",
                    )
                self.assertEqual(caught.exception.key, key)

    def test_grok_stream_proves_role_spawn_and_nested_tools(self) -> None:
        path, profile = self.profile("grok")
        profile_line = transport._profile_line(
            profile, hashlib.sha256(path.read_bytes()).hexdigest()
        )
        for omit_defaults in (False, True):
            with self.subTest(omit_defaults=omit_defaults):
                frames = self.grok_wire_fixture(profile_line)
                if omit_defaults:
                    spawn = next(
                        frame
                        for frame in frames
                        if frame.get("type") == "tool_call"
                        and frame.get("toolName") == "spawn_subagent"
                    )
                    for key in ("capability_mode", "isolation", "background", "cwd"):
                        spawn["rawInput"].pop(key)
                stdout = b"".join(
                    (json.dumps(frame, separators=(",", ":")) + "\n").encode()
                    for frame in frames
                )

                result = transport._parse_grok_stream(
                    stdout,
                    profile_line=profile_line,
                    work=self.proof_root / "work",
                )

                self.assertEqual(
                    result,
                    (1, 3, 1, ("read", "execute", "write"), 0, "planner-smoke-ok"),
                )

    def test_grok_stream_rejects_every_prohibited_shape(self) -> None:
        path, profile = self.profile("grok")
        profile_line = transport._profile_line(
            profile, hashlib.sha256(path.read_bytes()).hexdigest()
        )
        base = self.grok_wire_fixture(profile_line)

        def clone() -> list[dict[str, Any]]:
            return json.loads(json.dumps(base))

        def spawn_call(frames: list[dict[str, Any]]) -> dict[str, Any]:
            return next(
                frame
                for frame in frames
                if frame.get("type") == "tool_call"
                and frame.get("toolName") == "spawn_subagent"
            )

        def spawn_completion(frames: list[dict[str, Any]]) -> dict[str, Any]:
            return next(
                frame
                for frame in frames
                if frame.get("type") == "tool_call_update"
                and frame.get("toolCallId") == "spawn-1"
                and frame.get("status") == "completed"
            )

        def child_text_index(frames: list[dict[str, Any]]) -> int:
            return next(
                index
                for index, frame in enumerate(frames)
                if frame.get("type") == "text"
                and str(frame.get("data", "")).startswith("PROFILE ")
            )

        extra_child = clone()
        second_spawn = json.loads(json.dumps(spawn_call(extra_child)))
        second_spawn["toolCallId"] = "spawn-2"
        extra_child.insert(-1, second_spawn)

        wrong_model = clone()
        wrong_model[-1]["modelUsage"] = {"grok-4.4": {"modelCalls": 3}}

        nested_spawn = clone()
        nested_index = child_text_index(nested_spawn)
        nested_spawn[nested_index:nested_index] = [
            {
                "type": "tool_call",
                "toolCallId": "nested",
                "toolName": "spawn_subagent",
                "rawInput": {},
            },
            {
                "type": "tool_call_update",
                "toolCallId": "nested",
                "status": "completed",
            },
        ]
        spawn_completion(nested_spawn)["rawOutput"]["tool_calls"] = 4

        extra_tool = clone()
        extra_index = child_text_index(extra_tool)
        extra_tool[extra_index:extra_index] = [
            {
                "type": "tool_call",
                "toolCallId": "extra",
                "toolName": "read_file",
                "rawInput": {"target_file": "second"},
            },
            {
                "type": "tool_call_update",
                "toolCallId": "extra",
                "status": "completed",
            },
        ]
        spawn_completion(extra_tool)["rawOutput"]["tool_calls"] = 4

        fallback = clone()
        fallback.insert(-1, {"type": "fallback", "reason": "fixture"})

        terminal_error = clone()
        terminal_error[-1]["stopReason"] = "error"

        duplicate_terminal = clone()
        duplicate_terminal.insert(-1, json.loads(json.dumps(duplicate_terminal[-1])))

        wrong_type = clone()
        spawn_call(wrong_type)["rawInput"]["subagent_type"] = "plan"

        unexpected_role = clone()
        spawn_call(unexpected_role)["rawInput"]["role"] = "planner"

        unexpected_persona = clone()
        spawn_call(unexpected_persona)["rawInput"]["persona"] = "planner"

        missing_type = clone()
        spawn_call(missing_type)["rawInput"].pop("subagent_type")

        wrong_description = clone()
        spawn_call(wrong_description)["rawInput"]["description"] = "Different label"

        missing_description = clone()
        spawn_call(missing_description)["rawInput"].pop("description")

        wrong_background = clone()
        spawn_call(wrong_background)["rawInput"]["background"] = True

        wrong_cwd = clone()
        spawn_call(wrong_cwd)["rawInput"]["cwd"] = "/tmp"

        unknown_spawn_arg = clone()
        spawn_call(unknown_spawn_arg)["rawInput"]["model"] = "grok-4.5"

        missing_prompt = clone()
        spawn_call(missing_prompt)["rawInput"].pop("prompt")

        extra_parent_tool = clone()
        extra_parent_tool.insert(
            extra_parent_tool.index(spawn_call(extra_parent_tool)),
            {
                "type": "tool_call",
                "toolCallId": "parent-read",
                "toolName": "read_file",
                "rawInput": {"target_file": "input"},
            },
        )

        missing_child_completion = clone()
        next(
            frame
            for frame in missing_child_completion
            if frame.get("type") == "tool_call_update"
            and frame.get("toolCallId") == "read-1"
            and frame.get("status") == "completed"
        )["status"] = None

        failed_spawn = clone()
        spawn_completion(failed_spawn)["status"] = "failed"

        wrong_child_record = clone()
        spawn_completion(wrong_child_record)["rawOutput"]["subagent_type"] = "plan"

        wrong_child_output = clone()
        spawn_completion(wrong_child_output)["rawOutput"]["output"] = "wrong"

        wrong_parent_output = clone()
        wrong_parent_output[-2]["data"] = "wrong"

        wrong_write_path = clone()
        next(
            frame
            for frame in wrong_write_path
            if frame.get("type") == "tool_call" and frame.get("toolCallId") == "write-1"
        )["rawInput"]["file_path"] = "/tmp/wrong"

        cases = (
            ("missing-terminal", clone()[:-1], "execute"),
            ("extra-child", extra_child, "role-binding"),
            ("wrong-model", wrong_model, "model"),
            ("nested-spawn", nested_spawn, "delegation-depth"),
            ("extra-tool", extra_tool, "delegation-depth"),
            ("fallback", fallback, "no-fallback"),
            ("terminal-error", terminal_error, "execute"),
            ("duplicate-terminal", duplicate_terminal, "execute"),
            ("wrong-type", wrong_type, "role-binding"),
            ("unexpected-role", unexpected_role, "role-binding"),
            ("unexpected-persona", unexpected_persona, "role-binding"),
            ("missing-type", missing_type, "role-binding"),
            ("wrong-description", wrong_description, "role-binding"),
            ("missing-description", missing_description, "role-binding"),
            ("wrong-background", wrong_background, "role-binding"),
            ("wrong-cwd", wrong_cwd, "role-binding"),
            ("unknown-spawn-arg", unknown_spawn_arg, "role-binding"),
            ("missing-prompt", missing_prompt, "role-binding"),
            ("extra-parent-tool", extra_parent_tool, "role-binding"),
            ("missing-child-completion", missing_child_completion, "execute"),
            ("failed-spawn", failed_spawn, "execute"),
            ("wrong-child-record", wrong_child_record, "role-binding"),
            ("wrong-child-output", wrong_child_output, "role-binding"),
            ("wrong-parent-output", wrong_parent_output, "role-binding"),
            ("wrong-write-path", wrong_write_path, "delegation-depth"),
        )
        for name, frames, key in cases:
            with self.subTest(name=name):
                stdout = b"".join(
                    (json.dumps(frame, separators=(",", ":")) + "\n").encode()
                    for frame in frames
                )
                with self.assertRaises(transport.PreflightFailure) as caught:
                    transport._parse_grok_stream(
                        stdout,
                        profile_line=profile_line,
                        work=self.proof_root / "work",
                    )
                self.assertEqual(caught.exception.key, key)
        with self.assertRaises(transport.PreflightFailure) as caught:
            transport._parse_grok_stream(
                b'{"type":"available_commands"}\n{"type":',
                profile_line=profile_line,
                work=self.proof_root / "work",
            )
        self.assertEqual(caught.exception.key, "execute")

    def test_smoke_failure_matrix_cleans_only_terminated_results(self) -> None:
        _path, template = self.profile("grok")
        changes = (
            ("timeout", {"terminated": False}),
            ("nonzero", {"returncode": 1}),
            ("extra-process", {"process_count": 2}),
            ("missing-child", {"child_count": 0}),
            ("extra-child", {"child_count": 2}),
            ("missing-tool", {"child_tool_calls": 2}),
            ("extra-tool", {"child_tool_calls": 4}),
            ("missing-sha", {"sha256_command_count": 0}),
            ("extra-sha", {"sha256_command_count": 2}),
            ("fallback", {"fallback_events": 1}),
            ("wrong-profile", {"profile_line": "wrong"}),
            ("wrong-stdout", {"stdout": b"wrong\n"}),
            ("wrong-output-hash", {"output_sha256": "0" * 64}),
            ("wrong-order", {"native_events": ("execute", "read", "write")}),
            ("unknown-event", {"native_events": ("read", "execute", "unknown")}),
        )
        for index, (name, fields) in enumerate(changes):
            with self.subTest(name=name):
                proof_root = self.root / f"failure-{index}"
                (proof_root / "work").mkdir(parents=True)
                proof_root.chmod(0o700)
                profile = json.loads(json.dumps(template))
                profile["proof_root"] = str(proof_root)
                profile_path = self.root / f"failure-{index}-profile.json"
                profile_path.write_text(
                    json.dumps(profile, sort_keys=True, separators=(",", ":")) + "\n"
                )
                profile_sha = hashlib.sha256(profile_path.read_bytes()).hexdigest()
                valid = transport.NativeResult(
                    0,
                    transport.FIXED_OUTPUT,
                    b"",
                    True,
                    child_count=1,
                    child_tool_calls=3,
                    sha256_command_count=1,
                    native_events=("read", "execute", "write"),
                    profile_line=transport._profile_line(profile, profile_sha),
                    output_sha256=hashlib.sha256(transport.FIXED_OUTPUT).hexdigest(),
                )
                candidate = replace(valid, **fields)

                def runner(
                    *_args: object,
                    candidate: transport.NativeResult = candidate,
                    proof_root: Path = proof_root,
                    **_kwargs: object,
                ) -> transport.NativeResult:
                    _input_path, output_path = transport._write_smoke_input(
                        proof_root / "work"
                    )
                    output_path.write_bytes(transport.FIXED_OUTPUT)
                    return candidate

                evidence = self.root / f"failure-{index}-evidence.json"
                code, payload = transport.run_smoke(
                    harness="grok",
                    role_profile=profile_path,
                    proof_root=proof_root,
                    evidence=evidence,
                    native_runner=runner,
                )
                self.assertEqual(code, 69, payload)
                self.assertFalse(evidence.exists())
                for artifact in transport._smoke_paths(proof_root / "work"):
                    if candidate.terminated:
                        self.assertFalse(artifact.exists())
                    else:
                        self.assertTrue(artifact.exists())
                if not candidate.terminated:
                    input_path, output_path = transport._smoke_paths(
                        proof_root / "work"
                    )
                    self.assertEqual(input_path.read_bytes(), transport.FIXED_INPUT)
                    self.assertEqual(output_path.read_bytes(), transport.FIXED_OUTPUT)
                self.assertTrue((proof_root / ".planner-smoke-consumed").exists())

                called = False

                def reused(*_args: object, **_kwargs: object) -> transport.NativeResult:
                    nonlocal called
                    called = True
                    return valid

                code, payload = transport.run_smoke(
                    harness="grok",
                    role_profile=profile_path,
                    proof_root=proof_root,
                    evidence=evidence,
                    native_runner=reused,
                )
                self.assertEqual(code, 69, payload)
                self.assertEqual(payload["capability"], "state-isolation")
                self.assertFalse(called)

    def test_smoke_preserves_recovery_artifacts_when_result_is_not_delivered(
        self,
    ) -> None:
        proof_root = self.root / "unproven-result"
        (proof_root / "work").mkdir(parents=True)
        proof_root.chmod(0o700)
        profile_path, profile = self.profile("grok")
        profile["proof_root"] = str(proof_root)
        profile_path.write_text(
            json.dumps(profile, sort_keys=True, separators=(",", ":")) + "\n",
            encoding="utf-8",
        )
        calls: list[str] = []

        def runner(*_args: object, **_kwargs: object) -> transport.NativeResult:
            calls.append("native")
            _input_path, output_path = transport._write_smoke_input(proof_root / "work")
            output_path.write_bytes(transport.FIXED_OUTPUT)
            raise OSError("result delivery failed")

        evidence = self.root / "unproven-result-evidence.json"
        code, payload = transport.run_smoke(
            harness="grok",
            role_profile=profile_path,
            proof_root=proof_root,
            evidence=evidence,
            native_runner=runner,
        )
        self.assertEqual(code, 69, payload)
        self.assertEqual(payload["capability"], "execute", payload)
        self.assertEqual(calls, ["native"])
        self.assertFalse(evidence.exists())
        self.assertTrue((proof_root / ".planner-smoke-consumed").exists())
        input_path, output_path = transport._smoke_paths(proof_root / "work")
        self.assertEqual(input_path.read_bytes(), transport.FIXED_INPUT)
        self.assertEqual(output_path.read_bytes(), transport.FIXED_OUTPUT)

    def test_diagnostics_are_stable_bounded_and_secret_redacted(self) -> None:
        first = transport._diagnostic(
            "execute",
            "token=super-secret",
            "password=hunter2",
            "credential source",
        )
        second = transport._diagnostic(
            "execute",
            "token=super-secret",
            "password=hunter2",
            "credential source",
        )
        self.assertEqual(first, second)
        self.assertEqual(
            {
                "capability",
                "expected",
                "observed",
                "schema",
                "source",
                "status",
            },
            set(first),
        )
        encoded = json.dumps(first, sort_keys=True)
        self.assertNotIn("super-secret", encoded)
        self.assertNotIn("hunter2", encoded)
        self.assertLessEqual(len(encoded.encode()), 1024)

    def test_controlled_copy_restore_and_cleanup_state_are_deterministic(self) -> None:
        before = self.root / "before.txt"
        treatment = self.root / "treatment.txt"
        before.write_bytes(b"before\n")
        shutil.copy2(before, treatment)
        treatment.write_bytes(b"treatment\n")
        shutil.copy2(before, treatment)
        self.assertEqual(treatment.read_bytes(), before.read_bytes())
        evidence = self.root / "new-evidence.json"
        transport._safe_evidence_path(evidence)
        self.assertFalse(evidence.exists())


if __name__ == "__main__":
    unittest.main()
