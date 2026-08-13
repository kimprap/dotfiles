#!/usr/bin/env python3
"""Provider-neutral structural validation for portable Executor Plan v1 Markdown."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat as stat_module
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Mapping, Sequence

SCHEMA = "executor-plan-validation/v1"
PREFLIGHT_SCHEMA = "executor-plan-preflight/v1"
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
CONTEXTS = ("omp", "grok")
CONSUMERS = ("planner", "backend")
REQUIRED_SECTIONS = (
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
)
TABLES = {
    "Authority": ("Authority ID", "Kind", "URI", "Revision", "Approval"),
    "Governing decisions": ("Decision ID", "Revision", "Execution effect"),
    "Scope, non-goals, and prohibited effects": (
        "Effect ID",
        "Kind",
        "Authority",
        "Limit / reversibility",
    ),
    "Fixed shared contracts": (
        "Contract ID",
        "Surface",
        "Owner task",
        "Revision",
        "Consumers",
    ),
    "Target map": (
        "Target ID",
        "Path / surface",
        "Owner task",
        "Base identity",
        "Callers / fixtures",
        "Criteria",
    ),
    "Acceptance": (
        "Criterion ID",
        "Condition / input",
        "Expected observable / threshold",
        "Surface",
        "Owning task",
    ),
    "Result / Handoff": (
        "Output ID",
        "Producing task",
        "Artifact / identity",
        "Allowed outcomes",
        "Receiver",
        "Handoff contract",
    ),
    "Blockers and recovery": (
        "Blocker ID",
        "Owner",
        "Recovery evidence",
        "Affected tasks",
        "Revision / approval boundary",
        "Ready condition",
    ),
    "Critical anchors and assumptions": (
        "Anchor ID",
        "Kind",
        "Exact reference",
        "Execution role",
    ),
}
TASK_FIELDS = (
    "Owner",
    "Wave",
    "Depends on",
    "Targets",
    "Contracts",
    "Criteria",
    "Effects",
    "Output",
    "Receiver",
    "Verification",
    "Lineage",
)
VERIFICATION_FIELDS = (
    "Criterion",
    "Proof class",
    "Scenario / environment / fixture",
    "Evidence form",
    "Target recheck",
    "Receiver",
)
EXECUTION_FIELDS = (
    "Assurance",
    "Topology",
    "Max concurrency",
    "Isolation",
    "Lineages",
    "Fan-in task",
    "Fan-in inputs",
    "Contention policy",
    "Decomposition",
    "Effect limit",
    "Orchestrator profile",
)
OUTCOME_CLASSES = {
    "completed",
    "blocked",
    "failed",
    "timed-out",
    "cancelled",
    "transport-unavailable",
    "authority-change-required",
}
PLACEHOLDER = re.compile(
    r"(?:\b(?:TODO|TBD|TBC|FIXME|XXX)\b|<[^>\n]+>|\?{3,}|\{\{[^}\n]+\}\})"
)

HEADER_FIELDS = ("Datetime", "Authority kind", "Mode", "Scope", "Summary", "Status")
HEADER_REQUIRED_FIELDS = ("Datetime", "Authority kind", "Scope", "Summary", "Status")
HEADER_AUTHORITY_KINDS = ("local-authority", "direct-repository")
HEADER_STATUSES = ("PENDING", "IN_PROGRESS", "DONE", "CLOSED")
_CANONICAL_METADATA = re.compile(r"^\*\*([^*\r\n]+)\*\*: (.*)$")
_AUTHORITY_MARKER_LINE = re.compile(r"^\*\*authority kind\*\*: .*$", re.IGNORECASE)
_H1 = re.compile(r"^#\s+\S.*$")
_H2 = re.compile(r"^##(?:\s|$)")
ID_PATTERNS = {
    "outcome": re.compile(r"OUT-[A-Z0-9][A-Z0-9-]*"),
    "authority": re.compile(r"AUTH-[A-Z0-9][A-Z0-9-]*"),
    "decision": re.compile(r"(?:ADR-\d{4}|DEC-[A-Z0-9][A-Z0-9-]*)"),
    "effect": re.compile(r"EFF-[A-Z0-9][A-Z0-9-]*"),
    "contract": re.compile(r"CONTRACT-[A-Z0-9][A-Z0-9-]*"),
    "target": re.compile(r"TGT-[A-Z0-9][A-Z0-9-]*"),
    "criterion": re.compile(r"AC(?:-?[A-Z0-9]+(?:-[A-Z0-9]+)*)"),
    "verification": re.compile(r"VR-[A-Z0-9][A-Z0-9-]*"),
    "output": re.compile(r"OUTP-[A-Z0-9][A-Z0-9-]*"),
    "blocker": re.compile(r"BLK-[A-Z0-9][A-Z0-9-]*"),
    "anchor": re.compile(r"ANC-[A-Z0-9][A-Z0-9-]*"),
    "assumption": re.compile(r"ASM-[A-Z0-9][A-Z0-9-]*"),
    "task": re.compile(r"T[1-9]\d*"),
    "lineage": re.compile(r"LIN-[A-Z0-9][A-Z0-9-]*"),
}


@dataclass(frozen=True)
class Issue:
    code: str
    message: str
    section: str | None = None

    def payload(self) -> dict[str, str]:
        result = {"code": self.code, "message": self.message}
        if self.section is not None:
            result["section"] = self.section
        return result


@dataclass(frozen=True)
class Report:
    context: str
    consumer: str
    plan_sha256: str
    issues: tuple[Issue, ...]

    @property
    def valid(self) -> bool:
        return not self.issues

    def payload(self) -> dict[str, object]:
        return {
            "consumer": self.consumer,
            "context": self.context,
            "issues": [issue.payload() for issue in self.issues],
            "plan_sha256": self.plan_sha256,
            "schema": SCHEMA,
            "status": "valid" if self.valid else "invalid",
        }


def _issue(
    issues: list[Issue], code: str, message: str, section: str | None = None
) -> None:
    if code != "UTF8" and not code.startswith("HEADER_"):
        message = f"portable plan violates {code.lower().replace('_', ' ')}"
    issues.append(Issue(code, message, section))


@dataclass(frozen=True)
class HeaderInspection:
    source: str
    lines: tuple[str, ...]
    first_h2: int | None
    fields: Mapping[str, str | None]
    issues: tuple[Issue, ...]
    marker_missing_only: bool


def _header_issue(
    issues: list[Issue],
    code: str,
    field: str = "metadata",
    line_number: int | None = None,
) -> None:
    location = f" at line {line_number}" if line_number is not None else ""
    _issue(issues, code, f"canonical header violation for {field}{location}")


def _safe_header_field(raw_name: str | None) -> str:
    if raw_name is None:
        return "metadata"
    return next(
        (field for field in HEADER_FIELDS if field.casefold() == raw_name.casefold()),
        "metadata",
    )


def _inspect_header_bytes(data: bytes) -> HeaderInspection:
    """Parse the one canonical byte-preserving header without exposing content."""
    issues: list[Issue] = []
    if not data:
        _header_issue(issues, "HEADER_H1", line_number=1)
        return HeaderInspection("", (), None, {}, tuple(issues), False)
    if data.startswith(b"\xef\xbb\xbf"):
        _header_issue(issues, "HEADER_BOM", line_number=1)
        return HeaderInspection("", (), None, {}, tuple(issues), False)
    try:
        source = data.decode("utf-8")
    except UnicodeDecodeError:
        _issue(issues, "UTF8", "plan must be strict UTF-8")
        return HeaderInspection("", (), None, {}, tuple(issues), False)

    lines = tuple(
        line[:-1] if line.endswith("\r") else line for line in source.split("\n")
    )
    if not lines or "\r" in lines[0] or not _H1.fullmatch(lines[0]):
        _header_issue(issues, "HEADER_H1", line_number=1)

    first_h2 = next(
        (index for index, line in enumerate(lines[1:], start=1) if _H2.match(line)),
        None,
    )
    if first_h2 is None:
        _header_issue(issues, "HEADER_METADATA_BLOCK")
        return HeaderInspection(
            source, lines, None, {}, tuple(issues), False
        )

    region = list(enumerate(lines[1:first_h2], start=2))
    nonblank = [index for index, (_line_number, line) in enumerate(region) if line != ""]
    if not nonblank:
        _header_issue(issues, "HEADER_METADATA_BLOCK")
        block: list[tuple[int, str]] = []
    else:
        first, last = nonblank[0], nonblank[-1]
        if any(line == "" for _line_number, line in region[first : last + 1]):
            _header_issue(issues, "HEADER_METADATA_BLOCK")
        block = region[first : last + 1]

    exact_names: list[str] = []
    values: dict[str, list[str]] = defaultdict(list)
    for line_number, line in block:
        bold_match = re.match(r"^\s*\*\*([^*\n]+)\*\*", line)
        raw_name = bold_match.group(1) if bold_match else None
        safe_field = _safe_header_field(raw_name)
        if "\r" in line:
            _header_issue(
                issues, "HEADER_FIELD_MALFORMED", safe_field, line_number
            )
            continue
        match = _CANONICAL_METADATA.fullmatch(line)
        if match:
            name, value = match.groups()
            canonical_name = next(
                (field for field in HEADER_FIELDS if field.casefold() == name.casefold()),
                None,
            )
            if canonical_name is not None and canonical_name != name:
                _header_issue(
                    issues, "HEADER_FIELD_CASE", canonical_name, line_number
                )
                continue
            if canonical_name is None:
                _header_issue(
                    issues, "HEADER_FIELD_UNKNOWN", "metadata", line_number
                )
                continue
            if value != value.strip() or "\t" in value:
                _header_issue(
                    issues, "HEADER_FIELD_MALFORMED", canonical_name, line_number
                )
                continue
            exact_names.append(name)
            values[name].append(value)
            continue

        if raw_name is not None:
            canonical_name = next(
                (
                    field
                    for field in HEADER_FIELDS
                    if field.casefold() == raw_name.casefold()
                ),
                None,
            )
            code = (
                "HEADER_FIELD_CASE"
                if canonical_name is not None and canonical_name != raw_name
                else "HEADER_FIELD_MALFORMED"
            )
            _header_issue(
                issues, code, canonical_name or "metadata", line_number
            )
        else:
            _header_issue(
                issues, "HEADER_METADATA_BLOCK", "metadata", line_number
            )

    for field in HEADER_REQUIRED_FIELDS:
        count = len(values[field])
        if count == 0:
            _header_issue(issues, "HEADER_FIELD_MISSING", field)
        elif count > 1:
            _header_issue(issues, "HEADER_FIELD_DUPLICATE", field)
    if len(values["Mode"]) > 1:
        _header_issue(issues, "HEADER_FIELD_DUPLICATE", "Mode")

    order = {field: index for index, field in enumerate(HEADER_FIELDS)}
    if exact_names != sorted(exact_names, key=order.__getitem__):
        _header_issue(issues, "HEADER_FIELD_ORDER")

    datetime_values = values["Datetime"]
    if datetime_values:
        value = datetime_values[0]
        try:
            valid_datetime = bool(
                re.fullmatch(r"\d{4}-\d{2}-\d{2}-\d{4}", value)
            )
            if valid_datetime:
                datetime.strptime(value, "%Y-%m-%d-%H%M")
        except ValueError:
            valid_datetime = False
        if not valid_datetime:
            _header_issue(issues, "HEADER_FIELD_VALUE", "Datetime")

    authority_values = values["Authority kind"]
    if authority_values:
        value = authority_values[0]
        if value not in HEADER_AUTHORITY_KINDS:
            code = (
                "HEADER_FIELD_CASE"
                if value.casefold()
                in {kind.casefold() for kind in HEADER_AUTHORITY_KINDS}
                else "HEADER_FIELD_VALUE"
            )
            _header_issue(issues, code, "Authority kind")

    for field in ("Mode", "Scope", "Summary"):
        if values[field] and values[field][0] == "":
            _header_issue(issues, "HEADER_FIELD_VALUE", field)
    if values["Status"] and values["Status"][0] not in HEADER_STATUSES:
        _header_issue(issues, "HEADER_FIELD_VALUE", "Status")

    for index, line in enumerate(lines[first_h2:], start=first_h2 + 1):
        if _AUTHORITY_MARKER_LINE.fullmatch(line):
            _header_issue(
                issues, "HEADER_FIELD_MISPLACED", "Authority kind", index
            )

    marker_missing_only = (
        len(issues) == 1
        and issues[0].code == "HEADER_FIELD_MISSING"
        and "Authority kind" in issues[0].message
    )
    fields = {
        field: values[field][0] if values[field] else None
        for field in HEADER_FIELDS
    }
    return HeaderInspection(
        source,
        lines,
        first_h2,
        fields,
        tuple(issues),
        marker_missing_only,
    )


def _headings(lines: Sequence[str]) -> list[tuple[str, int]]:
    result: list[tuple[str, int]] = []
    fence: str | None = None
    for index, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith(("```", "~~~")):
            marker = stripped[:3]
            fence = None if fence == marker else marker if fence is None else fence
            continue
        if fence is None:
            match = re.fullmatch(r"## ([^#].*?)\s*", line)
            if match:
                result.append((match.group(1), index))
    return result


def _sections(
    lines: Sequence[str], headings: Sequence[tuple[str, int]]
) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    for position, (name, start) in enumerate(headings):
        end = headings[position + 1][1] if position + 1 < len(headings) else len(lines)
        if name not in result:
            result[name] = list(lines[start + 1 : end])
    return result


def _cells(line: str) -> list[str]:
    stripped = line.strip()
    if not stripped.startswith("|") or not stripped.endswith("|"):
        return []
    return [cell.strip() for cell in stripped[1:-1].split("|")]


def _table(
    section: str,
    lines: Sequence[str],
    headers: Sequence[str],
    issues: list[Issue],
) -> list[dict[str, str]]:
    matches: list[int] = []
    expected = list(headers)
    for index, line in enumerate(lines):
        if _cells(line) == expected:
            matches.append(index)
    if len(matches) != 1:
        _issue(
            issues,
            "TABLE_SHAPE",
            f"expected exactly one table with headers {expected!r}; observed {len(matches)}",
            section,
        )
        return []
    start = matches[0]
    if start + 1 >= len(lines):
        _issue(issues, "TABLE_SHAPE", "table separator is missing", section)
        return []
    separator = _cells(lines[start + 1])
    if len(separator) != len(expected) or not all(
        re.fullmatch(r":?-{3,}:?", cell) for cell in separator
    ):
        _issue(issues, "TABLE_SHAPE", "table separator is malformed", section)
        return []
    rows: list[dict[str, str]] = []
    for line in lines[start + 2 :]:
        cells = _cells(line)
        if not cells:
            break
        if len(cells) != len(expected):
            _issue(
                issues, "TABLE_SHAPE", "table row has the wrong column count", section
            )
            continue
        if any(not cell for cell in cells):
            _issue(issues, "EMPTY_FIELD", "table row contains an empty field", section)
        rows.append(dict(zip(expected, cells, strict=True)))
    if not rows:
        _issue(issues, "TABLE_EMPTY", "required table has no rows", section)
    return rows


def _defined_ids(
    rows: Sequence[Mapping[str, str]],
    column: str,
    kind: str,
    section: str,
    issues: list[Issue],
) -> dict[str, Mapping[str, str]]:
    result: dict[str, Mapping[str, str]] = {}
    pattern = ID_PATTERNS[kind]
    for row in rows:
        value = row.get(column, "")
        if not pattern.fullmatch(value):
            _issue(issues, "UNSTABLE_ID", f"invalid {kind} ID: {value!r}", section)
            continue
        if value in result:
            _issue(issues, "DUPLICATE_ID", f"duplicate definition: {value}", section)
        else:
            result[value] = row
    return result


def _refs(value: str, kind: str) -> tuple[str, ...]:
    return tuple(ID_PATTERNS[kind].findall(value))


def _only_one(value: str) -> bool:
    return bool(value.strip()) and not re.search(
        r"[,;|]|\s(?:and|or)\s", value, re.IGNORECASE
    )


def _labels(lines: Sequence[str]) -> dict[str, str]:
    result: dict[str, str] = {}
    for line in lines:
        match = re.fullmatch(r"- ([^:]+):\s*(.+)", line.strip())
        if match and match.group(1) not in result:
            result[match.group(1)] = match.group(2).strip()
    return result


def _parse_tasks(
    lines: Sequence[str], issues: list[Issue]
) -> dict[str, dict[str, str]]:
    tasks: dict[str, dict[str, str]] = {}
    current: str | None = None
    malformed = False
    for line in lines:
        if line.startswith("- [") or re.match(r"- T[1-9]\d*\.", line):
            match = re.fullmatch(r"- \[([ xX])\] (T[1-9]\d*)\.\s+(.+)", line)
            if not match:
                malformed = True
                current = None
                continue
            task_id = match.group(2)
            if task_id in tasks:
                _issue(
                    issues, "DUPLICATE_ID", f"duplicate definition: {task_id}", "Tasks"
                )
            else:
                tasks[task_id] = {
                    "Description": match.group(3),
                    "Checkbox": match.group(1),
                }
            current = task_id
            continue
        field = re.fullmatch(r"  - ([^:]+):\s*(.+)", line)
        if field and current is not None:
            name, value = field.groups()
            if name in tasks[current]:
                _issue(
                    issues,
                    "DUPLICATE_FIELD",
                    f"{current} duplicates field {name}",
                    "Tasks",
                )
            else:
                tasks[current][name] = value.strip()
    if malformed:
        _issue(
            issues,
            "CHECKBOX_SHAPE",
            "task checkbox must be '- [ ] Tn. description'",
            "Tasks",
        )
    if not tasks:
        _issue(issues, "TASKS_EMPTY", "no task checkboxes found", "Tasks")
        return tasks
    numbers = [int(task_id[1:]) for task_id in tasks]
    if numbers[0] != 1:
        _issue(issues, "TASK_START", "task IDs must begin at T1", "Tasks")
    if numbers != sorted(numbers) or len(numbers) != len(set(numbers)):
        _issue(issues, "TASK_ORDER", "task IDs are not strictly monotonic", "Tasks")
    for task_id, task in tasks.items():
        missing = [field for field in TASK_FIELDS if field not in task]
        if missing:
            _issue(
                issues,
                "TASK_FIELD_MISSING",
                f"{task_id} missing fields: {', '.join(missing)}",
                "Tasks",
            )
        if "Owner" in task and not _only_one(task["Owner"]):
            _issue(
                issues, "OWNER_COUNT", f"{task_id} must have exactly one owner", "Tasks"
            )
        if "Receiver" in task and not _only_one(task["Receiver"]):
            _issue(
                issues,
                "RECEIVER_COUNT",
                f"{task_id} must have exactly one receiver",
                "Tasks",
            )
        if "Lineage" in task:
            lineage_refs = _refs(task["Lineage"], "lineage")
            if task["Lineage"] != "shared" and len(lineage_refs) != 1:
                _issue(
                    issues,
                    "LINEAGE_SHAPE",
                    f"{task_id} Lineage must be shared or one stable LIN-... ID",
                    "Tasks",
                )
    return tasks


def _parse_verifications(
    lines: Sequence[str], issues: list[Issue]
) -> dict[str, dict[str, str]]:
    recipes: dict[str, dict[str, str]] = {}
    current: str | None = None
    malformed = False
    for line in lines:
        if line.startswith("- [") or re.match(r"- VR-[A-Z0-9][A-Z0-9-]*\.", line):
            match = re.fullmatch(
                r"- \[([ xX])\] (VR-[A-Z0-9][A-Z0-9-]*)\.\s+(.+)", line
            )
            if not match:
                malformed = True
                current = None
                continue
            recipe_id = match.group(2)
            if recipe_id in recipes:
                _issue(
                    issues,
                    "DUPLICATE_ID",
                    f"duplicate definition: {recipe_id}",
                    "Verification / Done criteria",
                )
            else:
                recipes[recipe_id] = {
                    "Description": match.group(3),
                    "Checkbox": match.group(1),
                }
            current = recipe_id
            continue
        field = re.fullmatch(r"  - ([^:]+):\s*(.+)", line)
        if field and current is not None:
            name, value = field.groups()
            if name in recipes[current]:
                _issue(
                    issues,
                    "DUPLICATE_FIELD",
                    f"{current} duplicates field {name}",
                    "Verification / Done criteria",
                )
            else:
                recipes[current][name] = value.strip()
    if malformed:
        _issue(
            issues,
            "CHECKBOX_SHAPE",
            "verification checkbox must be '- [ ] VR-.... description'",
            "Verification / Done criteria",
        )
    if not recipes:
        _issue(
            issues,
            "VERIFICATION_EMPTY",
            "no verification checkboxes found",
            "Verification / Done criteria",
        )
        return recipes
    for recipe_id, recipe in recipes.items():
        missing = [field for field in VERIFICATION_FIELDS if field not in recipe]
        if missing:
            _issue(
                issues,
                "VERIFICATION_FIELD_MISSING",
                f"{recipe_id} missing fields: {', '.join(missing)}",
                "Verification / Done criteria",
            )
        if "Receiver" in recipe and not _only_one(recipe["Receiver"]):
            _issue(
                issues,
                "RECEIVER_COUNT",
                f"{recipe_id} must have exactly one receiver",
                "Verification / Done criteria",
            )
    return recipes


def _check_refs(
    owner: str,
    values: Iterable[str],
    definitions: Mapping[str, object],
    kind: str,
    section: str,
    issues: list[Issue],
) -> None:
    for value in values:
        if value not in definitions:
            _issue(
                issues,
                "DANGLING_REFERENCE",
                f"{owner} references unknown {kind} {value}",
                section,
            )


def _graph(
    tasks: Mapping[str, Mapping[str, str]], issues: list[Issue]
) -> dict[str, tuple[str, ...]]:
    graph: dict[str, tuple[str, ...]] = {}
    waves: dict[str, int] = {}
    for task_id, task in tasks.items():
        wave = task.get("Wave", "")
        match = re.fullmatch(r"W(\d+)", wave)
        if not match:
            _issue(
                issues, "WAVE_SHAPE", f"{task_id} has invalid wave {wave!r}", "Tasks"
            )
        else:
            waves[task_id] = int(match.group(1))
        dependency_text = task.get("Depends on", "")
        if dependency_text.lower() == "none":
            graph[task_id] = ()
        else:
            dependencies = _refs(dependency_text, "task")
            graph[task_id] = dependencies
            if not dependencies:
                _issue(
                    issues,
                    "DEPENDENCY_SHAPE",
                    f"{task_id} dependencies are not task IDs",
                    "Tasks",
                )
            _check_refs(task_id, dependencies, tasks, "task", "Tasks", issues)
    for task_id, dependencies in graph.items():
        for dependency in dependencies:
            if (
                dependency in waves
                and task_id in waves
                and waves[dependency] >= waves[task_id]
            ):
                _issue(
                    issues,
                    "WAVE_DEPENDENCY",
                    f"{task_id} in W{waves[task_id]} depends on {dependency} in W{waves[dependency]}",
                    "Tasks",
                )
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(task_id: str) -> bool:
        if task_id in visiting:
            return True
        if task_id in visited:
            return False
        visiting.add(task_id)
        cyclic = any(
            dependency in graph and visit(dependency)
            for dependency in graph.get(task_id, ())
        )
        visiting.remove(task_id)
        visited.add(task_id)
        return cyclic

    if any(visit(task_id) for task_id in graph):
        _issue(
            issues,
            "CYCLIC_DEPENDENCY",
            "task dependency graph contains a cycle",
            "Tasks",
        )
    return graph


def _require_exact_refs(
    owner: str,
    text: str,
    kind: str,
    definitions: Mapping[str, object],
    section: str,
    issues: list[Issue],
    *,
    allow_none: bool = False,
    exactly_one: bool = False,
) -> tuple[str, ...]:
    if allow_none and text.lower() == "none":
        return ()
    values = _refs(text, kind)
    if not values:
        _issue(issues, "REFERENCE_MISSING", f"{owner} has no {kind} reference", section)
    if exactly_one and len(values) != 1:
        _issue(
            issues,
            "REFERENCE_COUNT",
            f"{owner} must reference exactly one {kind}",
            section,
        )
    _check_refs(owner, values, definitions, kind, section, issues)
    return values


def validate_text(text: str, *, context: str, consumer: str) -> Report:
    if context not in CONTEXTS:
        raise ValueError(f"unsupported context: {context}")
    if consumer not in CONSUMERS:
        raise ValueError(f"unsupported consumer: {consumer}")
    issues: list[Issue] = []
    raw = text.encode("utf-8")
    header = _inspect_header_bytes(raw)
    issues.extend(header.issues)
    lines = list(header.lines)
    headings = _headings(lines)
    heading_names = [name for name, _line in headings]
    counts = Counter(heading_names)
    for name in REQUIRED_SECTIONS:
        if counts[name] == 0:
            _issue(
                issues, "SECTION_MISSING", f"required section is missing: {name}", name
            )
        elif counts[name] > 1:
            _issue(
                issues,
                "SECTION_DUPLICATE",
                f"required section appears {counts[name]} times",
                name,
            )
    present_order = [name for name in heading_names if name in REQUIRED_SECTIONS]
    if present_order != list(REQUIRED_SECTIONS):
        _issue(
            issues, "SECTION_ORDER", "portable sections are not in the required order"
        )
    if PLACEHOLDER.search(text):
        _issue(
            issues, "UNRESOLVED_PLACEHOLDER", "plan contains an unresolved placeholder"
        )
    sections = _sections(lines, headings)
    if any(name not in sections for name in REQUIRED_SECTIONS):
        return Report(context, consumer, hashlib.sha256(raw).hexdigest(), tuple(issues))

    objective = _labels(sections["Objective"])
    for label in ("Outcome", "Observable end state", "Progress signal"):
        if label not in objective:
            _issue(
                issues,
                "OBJECTIVE_FIELD_MISSING",
                f"missing Objective field: {label}",
                "Objective",
            )
    if "Outcome" in objective and not ID_PATTERNS["outcome"].fullmatch(
        objective["Outcome"]
    ):
        _issue(
            issues,
            "UNSTABLE_ID",
            "Objective Outcome must be one stable OUT-... ID",
            "Objective",
        )

    parsed_tables = {
        section: _table(section, sections[section], headers, issues)
        for section, headers in TABLES.items()
    }
    authorities = _defined_ids(
        parsed_tables["Authority"], "Authority ID", "authority", "Authority", issues
    )
    decisions = _defined_ids(
        parsed_tables["Governing decisions"],
        "Decision ID",
        "decision",
        "Governing decisions",
        issues,
    )
    effects = _defined_ids(
        parsed_tables["Scope, non-goals, and prohibited effects"],
        "Effect ID",
        "effect",
        "Scope, non-goals, and prohibited effects",
        issues,
    )
    contracts = _defined_ids(
        parsed_tables["Fixed shared contracts"],
        "Contract ID",
        "contract",
        "Fixed shared contracts",
        issues,
    )
    targets = _defined_ids(
        parsed_tables["Target map"], "Target ID", "target", "Target map", issues
    )
    criteria = _defined_ids(
        parsed_tables["Acceptance"], "Criterion ID", "criterion", "Acceptance", issues
    )
    outputs = _defined_ids(
        parsed_tables["Result / Handoff"],
        "Output ID",
        "output",
        "Result / Handoff",
        issues,
    )
    blockers = _defined_ids(
        parsed_tables["Blockers and recovery"],
        "Blocker ID",
        "blocker",
        "Blockers and recovery",
        issues,
    )
    anchors = _defined_ids(
        parsed_tables["Critical anchors and assumptions"],
        "Anchor ID",
        "anchor",
        "Critical anchors and assumptions",
        issues,
    )
    del decisions, blockers, anchors
    scope_labels = _labels(sections["Scope, non-goals, and prohibited effects"])
    for label in (
        "Read surfaces",
        "Change surfaces",
        "Non-goals",
        "Prohibited effects",
    ):
        if label not in scope_labels:
            _issue(
                issues,
                "SCOPE_FIELD_MISSING",
                f"missing scope field: {label}",
                "Scope, non-goals, and prohibited effects",
            )

    execution = _labels(sections["Execution policy"])
    for field in EXECUTION_FIELDS:
        if field not in execution:
            _issue(
                issues,
                "TOPOLOGY_FIELD_MISSING",
                f"missing execution field: {field}",
                "Execution policy",
            )
    if "Max concurrency" in execution:
        try:
            if int(execution["Max concurrency"]) < 1:
                raise ValueError
        except ValueError:
            _issue(
                issues,
                "TOPOLOGY_FIELD_INVALID",
                "Max concurrency must be a positive integer",
                "Execution policy",
            )

    tasks = _parse_tasks(sections["Tasks"], issues)
    graph = _graph(tasks, issues)
    recipes = _parse_verifications(sections["Verification / Done criteria"], issues)

    task_target_refs: defaultdict[str, list[str]] = defaultdict(list)
    task_contract_refs: defaultdict[str, list[str]] = defaultdict(list)
    task_criterion_refs: defaultdict[str, list[str]] = defaultdict(list)
    task_effect_refs: defaultdict[str, list[str]] = defaultdict(list)
    task_output_refs: defaultdict[str, list[str]] = defaultdict(list)
    task_recipe_refs: defaultdict[str, list[str]] = defaultdict(list)
    for task_id, task in tasks.items():
        task_target_refs[task_id].extend(
            _require_exact_refs(
                task_id, task.get("Targets", ""), "target", targets, "Tasks", issues
            )
        )
        task_contract_refs[task_id].extend(
            _require_exact_refs(
                task_id,
                task.get("Contracts", ""),
                "contract",
                contracts,
                "Tasks",
                issues,
            )
        )
        task_criterion_refs[task_id].extend(
            _require_exact_refs(
                task_id,
                task.get("Criteria", ""),
                "criterion",
                criteria,
                "Tasks",
                issues,
            )
        )
        task_effect_refs[task_id].extend(
            _require_exact_refs(
                task_id,
                task.get("Effects", ""),
                "effect",
                effects,
                "Tasks",
                issues,
                allow_none=True,
            )
        )
        task_output_refs[task_id].extend(
            _require_exact_refs(
                task_id,
                task.get("Output", ""),
                "output",
                outputs,
                "Tasks",
                issues,
                exactly_one=True,
            )
        )
        task_recipe_refs[task_id].extend(
            _require_exact_refs(
                task_id,
                task.get("Verification", ""),
                "verification",
                recipes,
                "Tasks",
                issues,
            )
        )

    for contract_id, row in contracts.items():
        owner = row["Owner task"]
        if owner not in tasks:
            _issue(
                issues,
                "DANGLING_REFERENCE",
                f"{contract_id} owner is unknown task {owner}",
                "Fixed shared contracts",
            )
        elif contract_id not in task_contract_refs[owner]:
            _issue(
                issues,
                "OWNERSHIP_MISMATCH",
                f"{contract_id} owner {owner} does not reference it",
                "Fixed shared contracts",
            )
        consumers = _refs(row["Consumers"], "task")
        if row["Consumers"].lower() != "none" and not consumers:
            _issue(
                issues,
                "REFERENCE_MISSING",
                f"{contract_id} has no valid consumer task",
                "Fixed shared contracts",
            )
        _check_refs(
            contract_id, consumers, tasks, "task", "Fixed shared contracts", issues
        )
        for consumer_task in consumers:
            if (
                consumer_task in tasks
                and contract_id not in task_contract_refs[consumer_task]
            ):
                _issue(
                    issues,
                    "CONTRACT_CONSUMER_MISMATCH",
                    f"{contract_id} consumer {consumer_task} does not reference it",
                    "Fixed shared contracts",
                )
        if not any(contract_id in values for values in task_contract_refs.values()):
            _issue(
                issues,
                "ORPHAN_CONTRACT",
                f"{contract_id} is not referenced by a task",
                "Fixed shared contracts",
            )

    criterion_target_owners: defaultdict[str, set[str]] = defaultdict(set)
    for target_id, row in targets.items():
        owner = row["Owner task"]
        if owner not in tasks:
            _issue(
                issues,
                "DANGLING_REFERENCE",
                f"{target_id} owner is unknown task {owner}",
                "Target map",
            )
        elif target_id not in task_target_refs[owner]:
            _issue(
                issues,
                "OWNERSHIP_MISMATCH",
                f"{target_id} owner {owner} does not reference it",
                "Target map",
            )
        target_criteria = _refs(row["Criteria"], "criterion")
        if not target_criteria:
            _issue(
                issues,
                "REFERENCE_MISSING",
                f"{target_id} has no criterion reference",
                "Target map",
            )
        _check_refs(
            target_id, target_criteria, criteria, "criterion", "Target map", issues
        )
        for criterion in target_criteria:
            criterion_target_owners[criterion].add(target_id)
        if not any(target_id in values for values in task_target_refs.values()):
            _issue(
                issues,
                "ORPHAN_TARGET",
                f"{target_id} is not referenced by a task",
                "Target map",
            )

    criterion_implementers: defaultdict[str, list[str]] = defaultdict(list)
    for task_id, values in task_criterion_refs.items():
        for criterion in values:
            criterion_implementers[criterion].append(task_id)
    for criterion_id, row in criteria.items():
        owners = criterion_implementers[criterion_id]
        if len(owners) != 1:
            _issue(
                issues,
                "CRITERION_OWNER_COUNT",
                f"{criterion_id} has {len(owners)} implementation owners",
                "Acceptance",
            )
        if row["Owning task"] not in tasks:
            _issue(
                issues,
                "DANGLING_REFERENCE",
                f"{criterion_id} owner is unknown task {row['Owning task']}",
                "Acceptance",
            )
        elif owners != [row["Owning task"]]:
            _issue(
                issues,
                "OWNERSHIP_MISMATCH",
                f"{criterion_id} owner table and task references disagree",
                "Acceptance",
            )
        surface_targets = _refs(row["Surface"], "target")
        if not surface_targets:
            _issue(
                issues,
                "REFERENCE_MISSING",
                f"{criterion_id} Surface has no target",
                "Acceptance",
            )
        _check_refs(
            criterion_id, surface_targets, targets, "target", "Acceptance", issues
        )
        if not criterion_target_owners[criterion_id]:
            _issue(
                issues,
                "CRITERION_TARGET_MISSING",
                f"{criterion_id} is absent from the Target map",
                "Acceptance",
            )
        mapped_targets = criterion_target_owners[criterion_id]
        if set(surface_targets) != mapped_targets:
            _issue(
                issues,
                "CRITERION_TARGET_MISMATCH",
                f"{criterion_id} Acceptance surface and Target map criteria disagree",
                "Acceptance",
            )
        for target_id in set(surface_targets) | mapped_targets:
            if (
                target_id in targets
                and targets[target_id]["Owner task"] != row["Owning task"]
            ):
                _issue(
                    issues,
                    "CRITERION_TARGET_OWNER_MISMATCH",
                    f"{criterion_id} owner and target {target_id} owner disagree",
                    "Acceptance",
                )

    criterion_recipes: defaultdict[str, list[str]] = defaultdict(list)
    for recipe_id, recipe in recipes.items():
        recipe_criteria = _refs(recipe.get("Criterion", ""), "criterion")
        if len(recipe_criteria) != 1:
            _issue(
                issues,
                "PROOF_CRITERION_COUNT",
                f"{recipe_id} must prove exactly one criterion",
                "Verification / Done criteria",
            )
        _check_refs(
            recipe_id,
            recipe_criteria,
            criteria,
            "criterion",
            "Verification / Done criteria",
            issues,
        )
        for criterion in recipe_criteria:
            criterion_recipes[criterion].append(recipe_id)
        target_refs = _refs(recipe.get("Target recheck", ""), "target")
        if not target_refs:
            _issue(
                issues,
                "REFERENCE_MISSING",
                f"{recipe_id} has no target recheck",
                "Verification / Done criteria",
            )
        _check_refs(
            recipe_id,
            target_refs,
            targets,
            "target",
            "Verification / Done criteria",
            issues,
        )
        if len(recipe_criteria) == 1 and recipe_criteria[0] in criteria:
            expected_targets = set(
                _refs(criteria[recipe_criteria[0]]["Surface"], "target")
            )
            if set(target_refs) != expected_targets:
                _issue(
                    issues,
                    "PROOF_TARGET_MISMATCH",
                    f"{recipe_id} target recheck does not match {recipe_criteria[0]} targets",
                    "Verification / Done criteria",
                )
    for criterion_id in criteria:
        if len(criterion_recipes[criterion_id]) != 1:
            _issue(
                issues,
                "CRITERION_PROOF_COUNT",
                f"{criterion_id} has {len(criterion_recipes[criterion_id])} proof recipes",
                "Verification / Done criteria",
            )
    for task_id, recipe_ids in task_recipe_refs.items():
        expected = {
            recipe
            for criterion in task_criterion_refs[task_id]
            for recipe in criterion_recipes[criterion]
        }
        if set(recipe_ids) != expected:
            _issue(
                issues,
                "TASK_PROOF_MISMATCH",
                f"{task_id} verification references do not match owned criteria",
                "Tasks",
            )

    for output_id, row in outputs.items():
        producer = row["Producing task"]
        if producer not in tasks:
            _issue(
                issues,
                "DANGLING_REFERENCE",
                f"{output_id} producer is unknown task {producer}",
                "Result / Handoff",
            )
        elif task_output_refs[producer] != [output_id]:
            _issue(
                issues,
                "OUTPUT_MISMATCH",
                f"{output_id} producer and task output disagree",
                "Result / Handoff",
            )
        if producer in tasks and row["Receiver"] != tasks[producer].get("Receiver"):
            _issue(
                issues,
                "RECEIVER_MISMATCH",
                f"{output_id} receiver and task receiver disagree",
                "Result / Handoff",
            )
        if not _only_one(row["Receiver"]):
            _issue(
                issues,
                "RECEIVER_COUNT",
                f"{output_id} must name exactly one receiver",
                "Result / Handoff",
            )
        if "Common Handoff" not in row["Handoff contract"]:
            _issue(
                issues,
                "HANDOFF_CONTRACT",
                f"{output_id} must use the Common Handoff",
                "Result / Handoff",
            )
        allowed = {
            value.strip()
            for value in row["Allowed outcomes"].split(",")
            if value.strip()
        }
        if not allowed or not allowed <= OUTCOME_CLASSES:
            _issue(
                issues,
                "OUTCOME_CLASS",
                f"{output_id} contains an unknown allowed outcome",
                "Result / Handoff",
            )
    for task_id, output_refs in task_output_refs.items():
        if len(output_refs) != 1:
            _issue(
                issues,
                "TASK_OUTPUT_COUNT",
                f"{task_id} must have exactly one output",
                "Tasks",
            )

    for effect_id, row in effects.items():
        authority_refs = _refs(row["Authority"], "authority")
        if not authority_refs:
            _issue(
                issues,
                "REFERENCE_MISSING",
                f"{effect_id} has no authority reference",
                "Scope, non-goals, and prohibited effects",
            )
        _check_refs(
            effect_id,
            authority_refs,
            authorities,
            "authority",
            "Scope, non-goals, and prohibited effects",
            issues,
        )

    effect_users = {effect for values in task_effect_refs.values() for effect in values}
    effect_limit = execution.get("Effect limit", "")
    contains_none = bool(
        re.search(
            r"(?<![A-Za-z0-9-])none(?![A-Za-z0-9-])",
            effect_limit,
            re.IGNORECASE,
        )
    )
    if contains_none and effect_limit.lower() != "none":
        _issue(
            issues,
            "EFFECT_LIMIT_SHAPE",
            "Effect limit cannot combine none with effect IDs",
            "Execution policy",
        )
    if effect_limit.lower() == "none":
        allowed_effects: set[str] = set()
    else:
        effect_limit_refs = _refs(effect_limit, "effect")
        allowed_effects = set(effect_limit_refs)
        if not effect_limit_refs:
            _issue(
                issues,
                "EFFECT_LIMIT_SHAPE",
                "Effect limit must name effect IDs or none",
                "Execution policy",
            )
        if len(effect_limit_refs) != len(allowed_effects):
            _issue(
                issues,
                "DUPLICATE_ID",
                "Effect limit duplicates an effect ID",
                "Execution policy",
            )
        _check_refs(
            "Effect limit",
            effect_limit_refs,
            effects,
            "effect",
            "Execution policy",
            issues,
        )
    if not effect_users <= allowed_effects:
        exceeded = ", ".join(sorted(effect_users - allowed_effects))
        _issue(
            issues,
            "EFFECT_LIMIT_EXCEEDED",
            f"task effects exceed the declared Effect limit: {exceeded}",
            "Execution policy",
        )
    for effect_id in effects:
        if effect_id not in effect_users:
            _issue(
                issues,
                "ORPHAN_EFFECT",
                f"{effect_id} is not referenced by a task",
                "Scope, non-goals, and prohibited effects",
            )

    topology = execution.get("Topology", "")
    declared_lineages = _refs(execution.get("Lineages", ""), "lineage")
    if len(declared_lineages) != len(set(declared_lineages)):
        _issue(
            issues,
            "DUPLICATE_ID",
            "Execution policy duplicates a lineage ID",
            "Execution policy",
        )
    task_lineages = {
        value
        for task in tasks.values()
        for value in _refs(task.get("Lineage", ""), "lineage")
    }
    isolated = topology == "isolated-lineages" or len(task_lineages) > 1
    if isolated:
        if topology != "isolated-lineages":
            _issue(
                issues,
                "TOPOLOGY_MISMATCH",
                "multiple lineages require Topology: isolated-lineages",
                "Execution policy",
            )
        if len(task_lineages) < 2 or set(declared_lineages) != task_lineages:
            _issue(
                issues,
                "LINEAGE_MISMATCH",
                "declared and task isolated lineages must match and number at least two",
                "Execution policy",
            )
        fan_in = _refs(execution.get("Fan-in task", ""), "task")
        fan_in_inputs = _refs(execution.get("Fan-in inputs", ""), "task")
        if len(fan_in) != 1 or fan_in[0] not in tasks:
            _issue(
                issues,
                "FAN_IN_MISSING",
                "isolated lineages require one valid fan-in task",
                "Execution policy",
            )
        elif not fan_in_inputs or not set(fan_in_inputs) <= set(
            graph.get(fan_in[0], ())
        ):
            _issue(
                issues,
                "FAN_IN_INPUTS",
                "fan-in inputs must be declared dependencies of the fan-in task",
                "Execution policy",
            )
        input_lineages = {
            lineage
            for task_id in fan_in_inputs
            for lineage in _refs(tasks.get(task_id, {}).get("Lineage", ""), "lineage")
        }
        if input_lineages != task_lineages:
            _issue(
                issues,
                "FAN_IN_CLOSURE",
                "fan-in inputs must cover every isolated lineage",
                "Execution policy",
            )
    else:
        if execution.get("Lineages", "") != "shared" or task_lineages:
            _issue(
                issues,
                "LINEAGE_MISMATCH",
                "non-isolated topology must use the shared lineage",
                "Execution policy",
            )
        if (
            execution.get("Fan-in task", "").lower() != "none"
            or execution.get("Fan-in inputs", "").lower() != "none"
        ):
            _issue(
                issues,
                "FAN_IN_UNEXPECTED",
                "non-isolated topology must declare fan-in task and inputs as none",
                "Execution policy",
            )

    for row in parsed_tables["Blockers and recovery"]:
        affected = row["Affected tasks"]
        task_refs = _refs(affected, "task")
        if affected.lower() != "all" and not task_refs:
            _issue(
                issues,
                "RECOVERY_TASKS",
                f"{row['Blocker ID']} has no affected task",
                "Blockers and recovery",
            )
        _check_refs(
            row["Blocker ID"], task_refs, tasks, "task", "Blockers and recovery", issues
        )
        if not _only_one(row["Owner"]):
            _issue(
                issues,
                "OWNER_COUNT",
                f"{row['Blocker ID']} must have exactly one owner",
                "Blockers and recovery",
            )

    assumption_lines = [
        line.strip()
        for line in sections["Critical anchors and assumptions"]
        if line.strip().startswith("- ")
    ]
    assumption_ids = [
        match.group(0)
        for line in assumption_lines
        for match in [ID_PATTERNS["assumption"].search(line)]
        if match
    ]
    assumptions_none = any(line == "- Assumptions: none" for line in assumption_lines)
    if not assumption_ids and not assumptions_none:
        _issue(
            issues,
            "ASSUMPTION_SHAPE",
            "declare stable ASM-... assumptions or exactly 'Assumptions: none'",
            "Critical anchors and assumptions",
        )
    if len(assumption_ids) != len(set(assumption_ids)):
        _issue(
            issues,
            "DUPLICATE_ID",
            "duplicate assumption ID",
            "Critical anchors and assumptions",
        )
    if assumption_ids and assumptions_none:
        _issue(
            issues,
            "ASSUMPTION_SHAPE",
            "cannot combine assumptions with 'Assumptions: none'",
            "Critical anchors and assumptions",
        )

    return Report(context, consumer, hashlib.sha256(raw).hexdigest(), tuple(issues))


def validate_file(path: Path, *, context: str, consumer: str) -> Report:
    data = path.read_bytes()
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        issue = Issue("UTF8", "plan must be strict UTF-8")
        return Report(context, consumer, hashlib.sha256(data).hexdigest(), (issue,))
    return validate_text(text, context=context, consumer=consumer)


@dataclass(frozen=True)
class PreflightIssue:
    code: str
    subject: str

    def payload(self) -> dict[str, str]:
        messages = {
            "PLAN_PREFLIGHT_UNAVAILABLE": "required locator state is unavailable",
            "PLAN_AUTHORITY_MISSING": "required authority path is missing",
            "PLAN_AUTHORITY_UNREADABLE": "required authority bytes are unreadable",
            "PLAN_AUTHORITY_UNCLASSIFIED": "authority marker is unclassified",
            "PLAN_AUTHORITY_CONTEXT": "authority marker conflicts with its path",
            "PLAN_AUTHORITY_CONFLICT": "local and direct authority claims conflict",
            "PLAN_IDENTITY_MISMATCH": "plan identity does not match its bound path",
            "PLAN_PROJECTION_MISSING": "required local projection is missing",
            "PLAN_PROJECTION_DRIFT": "local authority and projection differ",
            "PLAN_PROJECTION_AMBIGUOUS": "active and archive paths both exist",
            "PLAN_FILE_KIND_UNSAFE": "required path kind is unsafe",
            "PLAN_STATE_STALE": "required path state changed during observation",
            "PLAN_STATUS_NONEXECUTABLE": "plan status is not executable",
        }
        return {
            "code": self.code,
            "message": messages[self.code],
            "subject": self.subject,
        }


@dataclass(frozen=True)
class PathObservation:
    path: Path
    display_path: str
    state: str
    signature: tuple[int, ...] | None = None
    data: bytes | None = None
    sha256: str | None = None
    header: HeaderInspection | None = None

    def payload(self, state: str | None = None) -> dict[str, object]:
        authority_kind = (
            self.header.fields.get("Authority kind") if self.header is not None else None
        )
        return {
            "authority_kind": authority_kind
            if authority_kind in HEADER_AUTHORITY_KINDS
            else None,
            "path": self.display_path,
            "sha256": self.sha256,
            "state": state or self.state,
        }


@dataclass(frozen=True)
class PreflightReport:
    context: str
    status: str
    authority_location: str | None
    authority_outcome: str
    issues: tuple[PreflightIssue, ...]
    paths: Mapping[str, object]
    plan_id: str | None
    plan_sha256: str | None
    structural: Mapping[str, object] | None

    def payload(self) -> dict[str, object]:
        return {
            "authority_location": self.authority_location,
            "authority_outcome": self.authority_outcome,
            "consumer": "backend",
            "context": self.context,
            "issues": [issue.payload() for issue in self.issues],
            "paths": dict(self.paths),
            "plan_id": self.plan_id,
            "plan_sha256": self.plan_sha256,
            "schema": PREFLIGHT_SCHEMA,
            "status": self.status,
            "structural": dict(self.structural) if self.structural is not None else None,
        }


def _empty_preflight_paths() -> dict[str, object]:
    empty = {
        "authority_kind": None,
        "path": None,
        "sha256": None,
        "state": "missing",
    }
    return {
        "active": dict(empty),
        "archive": dict(empty),
        "local": dict(empty),
        "presented": None,
    }


def _unavailable_preflight(context: str) -> PreflightReport:
    return PreflightReport(
        context=context,
        status="unavailable",
        authority_location=None,
        authority_outcome="invalid",
        issues=(PreflightIssue("PLAN_PREFLIGHT_UNAVAILABLE", "locator"),),
        paths=_empty_preflight_paths(),
        plan_id=None,
        plan_sha256=None,
        structural=None,
    )


def _is_canonical_root(path: Path) -> bool:
    if not path.is_absolute() or ".." in path.parts:
        return False
    try:
        info = path.lstat()
        return (
            stat_module.S_ISDIR(info.st_mode)
            and not stat_module.S_ISLNK(info.st_mode)
            and path.resolve(strict=True) == path
        )
    except OSError:
        return False


def _relative_to(path: Path, root: Path) -> Path | None:
    try:
        return path.relative_to(root)
    except ValueError:
        return None


def _safe_parent_chain(root: Path, path: Path) -> bool:
    relative_path = _relative_to(path, root)
    if relative_path is None or not relative_path.parts or ".." in relative_path.parts:
        return False
    current = root
    for part in relative_path.parts[:-1]:
        current = current / part
        try:
            info = current.lstat()
        except OSError:
            return False
        if not stat_module.S_ISDIR(info.st_mode) or stat_module.S_ISLNK(info.st_mode):
            return False
    return True


def _observe_path(root: Path, path: Path, display_path: str) -> PathObservation:
    relative_path = _relative_to(path, root)
    if (
        relative_path is None
        or not relative_path.parts
        or ".." in relative_path.parts
    ):
        return PathObservation(path, display_path, "unsafe")

    directory_flags = (
        os.O_RDONLY
        | getattr(os, "O_DIRECTORY", 0)
        | getattr(os, "O_NOFOLLOW", 0)
        | getattr(os, "O_CLOEXEC", 0)
    )
    file_flags = (
        os.O_RDONLY
        | getattr(os, "O_NOFOLLOW", 0)
        | getattr(os, "O_CLOEXEC", 0)
    )
    root_descriptor: int | None = None
    parent_descriptor: int | None = None
    try:
        try:
            root_descriptor = os.open(root, directory_flags)
        except OSError:
            return PathObservation(path, display_path, "unsafe")
        parent_descriptor = root_descriptor
        for part in relative_path.parts[:-1]:
            try:
                next_descriptor = os.open(
                    part, directory_flags, dir_fd=parent_descriptor
                )
            except OSError:
                return PathObservation(path, display_path, "unsafe")
            if parent_descriptor != root_descriptor:
                os.close(parent_descriptor)
            parent_descriptor = next_descriptor

        leaf = relative_path.parts[-1]
        try:
            before = os.stat(
                leaf, dir_fd=parent_descriptor, follow_symlinks=False
            )
        except FileNotFoundError:
            return PathObservation(path, display_path, "missing")
        except OSError:
            return PathObservation(path, display_path, "unreadable")
        if (
            not stat_module.S_ISREG(before.st_mode)
            or stat_module.S_ISLNK(before.st_mode)
        ):
            return PathObservation(path, display_path, "unsafe")
        if before.st_mode & (
            stat_module.S_IRUSR | stat_module.S_IRGRP | stat_module.S_IROTH
        ) == 0:
            return PathObservation(path, display_path, "unreadable")

        try:
            descriptor = os.open(leaf, file_flags, dir_fd=parent_descriptor)
            try:
                current = os.fstat(descriptor)
                if (
                    not stat_module.S_ISREG(current.st_mode)
                    or current.st_dev != before.st_dev
                    or current.st_ino != before.st_ino
                ):
                    return PathObservation(path, display_path, "stale")
                with os.fdopen(descriptor, "rb", closefd=False) as handle:
                    data = handle.read()
                after = os.fstat(descriptor)
                if (
                    not stat_module.S_ISREG(after.st_mode)
                    or (
                        current.st_dev,
                        current.st_ino,
                        current.st_mode,
                        current.st_size,
                        current.st_mtime_ns,
                        current.st_ctime_ns,
                    )
                    != (
                        after.st_dev,
                        after.st_ino,
                        after.st_mode,
                        after.st_size,
                        after.st_mtime_ns,
                        after.st_ctime_ns,
                    )
                    or len(data) != after.st_size
                ):
                    return PathObservation(path, display_path, "stale")
            finally:
                os.close(descriptor)
        except OSError:
            return PathObservation(path, display_path, "unreadable")
    finally:
        if parent_descriptor is not None and parent_descriptor != root_descriptor:
            os.close(parent_descriptor)
        if root_descriptor is not None:
            os.close(root_descriptor)

    signature = (
        after.st_dev,
        after.st_ino,
        after.st_mode,
        after.st_size,
        after.st_mtime_ns,
        after.st_ctime_ns,
    )
    digest = hashlib.sha256(data).hexdigest()
    return PathObservation(
        path,
        display_path,
        "regular",
        signature,
        data,
        digest,
        _inspect_header_bytes(data),
    )


def _same_path_observation(left: PathObservation, right: PathObservation) -> bool:
    if (
        left.path != right.path
        or left.state != right.state
        or left.signature != right.signature
        or left.data != right.data
        or left.sha256 != right.sha256
    ):
        return False
    left_header = left.header
    right_header = right.header
    if left_header is None or right_header is None:
        return left_header is right_header
    return (
        left_header.fields == right_header.fields
        and left_header.marker_missing_only == right_header.marker_missing_only
        and tuple(issue.payload() for issue in left_header.issues)
        == tuple(issue.payload() for issue in right_header.issues)
    )


def _regular_header_valid(
    observation: PathObservation,
    *,
    datetime_value: str | None = None,
    authority_kind: str | None = None,
) -> bool:
    if (
        observation.state != "regular"
        or observation.header is None
        or observation.header.issues
    ):
        return False
    if (
        datetime_value is not None
        and observation.header.fields.get("Datetime") != datetime_value
    ):
        return False
    if (
        authority_kind is not None
        and observation.header.fields.get("Authority kind") != authority_kind
    ):
        return False
    return True


def preflight_file(
    path: Path,
    *,
    context: str,
    slug: str,
    repository_root: Path,
    local_root: Path,
    local_plan: Path,
) -> PreflightReport:
    """Prove current authority location and structure for one backend decision."""
    path = Path(path)
    repository_root = Path(repository_root)
    local_root = Path(local_root)
    local_plan = Path(local_plan)
    if (
        context not in CONTEXTS
        or not SLUG.fullmatch(slug)
        or not _is_canonical_root(repository_root)
        or not _is_canonical_root(local_root)
        or repository_root == local_root
        or not path.is_absolute()
        or not local_plan.is_absolute()
        or ".." in path.parts
        or ".." in local_plan.parts
        or _relative_to(local_plan, local_root) is None
        or not _safe_parent_chain(local_root, local_plan)
    ):
        return _unavailable_preflight(context)

    repository_plan_root = repository_root / ".agents" / "plans"
    if _relative_to(local_plan, repository_plan_root) is not None:
        return _unavailable_preflight(context)

    presented_root = (
        local_root
        if path == local_plan
        else repository_root
        if _relative_to(path, repository_root) is not None
        else None
    )
    if presented_root is None or not _safe_parent_chain(presented_root, path):
        return _unavailable_preflight(context)
    presented_display = (
        _relative_to(path, presented_root).as_posix()
        if _relative_to(path, presented_root) is not None
        else ""
    )
    initial = _observe_path(presented_root, path, presented_display)
    if initial.state in {"unreadable", "missing"}:
        code = (
            "PLAN_AUTHORITY_MISSING"
            if initial.state == "missing"
            else "PLAN_AUTHORITY_UNREADABLE"
        )
        paths = _empty_preflight_paths()
        paths["presented"] = "local" if path == local_plan else None
        return PreflightReport(
            context,
            "unavailable",
            None,
            "invalid",
            (PreflightIssue(code, "presented"),),
            paths,
            None,
            None,
            None,
        )
    if initial.state in {"unsafe", "stale"}:
        code = (
            "PLAN_FILE_KIND_UNSAFE"
            if initial.state == "unsafe"
            else "PLAN_STATE_STALE"
        )
        return PreflightReport(
            context,
            "blocked" if initial.state == "unsafe" else "unavailable",
            None,
            "invalid",
            (PreflightIssue(code, "presented"),),
            _empty_preflight_paths(),
            None,
            None,
            None,
        )

    assert initial.header is not None
    if initial.header.issues:
        marker_missing_only = initial.header.marker_missing_only
        return PreflightReport(
            context,
            "blocked",
            None,
            "unclassified" if marker_missing_only else "invalid",
            (
                PreflightIssue(
                    "PLAN_AUTHORITY_UNCLASSIFIED"
                    if marker_missing_only
                    else "PLAN_IDENTITY_MISMATCH",
                    "header",
                ),
            ),
            _empty_preflight_paths(),
            None,
            initial.sha256,
            None,
        )
    datetime_value = initial.header.fields.get("Datetime")
    if not isinstance(datetime_value, str):
        return PreflightReport(
            context,
            "blocked",
            None,
            "invalid",
            (PreflightIssue("PLAN_IDENTITY_MISMATCH", "presented"),),
            _empty_preflight_paths(),
            None,
            initial.sha256,
            None,
        )

    plan_id = f"{datetime_value}_{slug}"
    active = repository_plan_root / f"{plan_id}.md"
    archive = repository_plan_root / "archive" / f"{plan_id}.md"
    if local_plan in {active, archive}:
        return _unavailable_preflight(context)
    if path == local_plan:
        presented = "local"
        authority_location = "local"
    elif path == active:
        presented = "active"
        authority_location = "repository-active"
    elif path == archive:
        presented = "archive"
        authority_location = "repository-archive"
    else:
        paths = _empty_preflight_paths()
        paths["active"]["path"] = _relative_to(active, repository_root).as_posix()
        paths["archive"]["path"] = _relative_to(archive, repository_root).as_posix()
        paths["local"]["path"] = _relative_to(local_plan, local_root).as_posix()
        return PreflightReport(
            context,
            "unavailable",
            None,
            "unclassified",
            (PreflightIssue("PLAN_IDENTITY_MISMATCH", "presented"),),
            paths,
            plan_id,
            initial.sha256,
            None,
        )

    logical_paths = (
        ("presented", path, presented_root, presented_display),
        (
            "local",
            local_plan,
            local_root,
            _relative_to(local_plan, local_root).as_posix(),
        ),
        (
            "active",
            active,
            repository_root,
            _relative_to(active, repository_root).as_posix(),
        ),
        (
            "archive",
            archive,
            repository_root,
            _relative_to(archive, repository_root).as_posix(),
        ),
    )
    first: dict[Path, PathObservation] = {}
    second: dict[Path, PathObservation] = {}
    for _label, candidate, root, display_path in logical_paths:
        if candidate not in first:
            first[candidate] = _observe_path(root, candidate, display_path)
    for _label, candidate, root, display_path in logical_paths:
        if candidate not in second:
            second[candidate] = _observe_path(root, candidate, display_path)

    changed = {
        candidate
        for candidate, observation in first.items()
        if not _same_path_observation(observation, second[candidate])
    }
    current = second
    path_records = {
        "active": current[active].payload("stale" if active in changed else None),
        "archive": current[archive].payload("stale" if archive in changed else None),
        "local": current[local_plan].payload(
            "stale" if local_plan in changed else None
        ),
        "presented": presented,
    }
    if changed or any(
        observation.state == "stale" for observation in current.values()
    ):
        return PreflightReport(
            context,
            "unavailable",
            authority_location,
            "invalid",
            (PreflightIssue("PLAN_STATE_STALE", "presented"),),
            path_records,
            plan_id,
            current[path].sha256,
            None,
        )

    candidate = current[path]
    local = current[local_plan]
    active_observation = current[active]
    archive_observation = current[archive]

    unsafe_roles = tuple(
        role
        for role, observation in (
            ("active", active_observation),
            ("archive", archive_observation),
        )
        if observation.state == "unsafe"
    )
    if unsafe_roles:
        return PreflightReport(
            context,
            "unavailable",
            None,
            "invalid",
            (
                PreflightIssue(
                    "PLAN_FILE_KIND_UNSAFE",
                    "active/archive" if len(unsafe_roles) == 2 else unsafe_roles[0],
                ),
            ),
            path_records,
            plan_id,
            candidate.sha256,
            None,
        )

    unreadable_roles = tuple(
        role
        for role, observation in (
            ("active", active_observation),
            ("archive", archive_observation),
        )
        if observation.state == "unreadable"
    )
    if unreadable_roles:
        return PreflightReport(
            context,
            "unavailable",
            None,
            "invalid",
            (
                PreflightIssue(
                    "PLAN_AUTHORITY_UNREADABLE",
                    "active/archive"
                    if len(unreadable_roles) == 2
                    else unreadable_roles[0],
                ),
            ),
            path_records,
            plan_id,
            candidate.sha256,
            None,
        )

    if (
        active_observation.state == "regular"
        and archive_observation.state == "regular"
    ):
        return PreflightReport(
            context,
            "blocked",
            None,
            "ambiguous",
            (PreflightIssue("PLAN_PROJECTION_AMBIGUOUS", "active/archive"),),
            path_records,
            plan_id,
            candidate.sha256,
            None,
        )


    assert candidate.header is not None
    marker = candidate.header.fields.get("Authority kind")
    issue: PreflightIssue | None = None
    additional_issue: PreflightIssue | None = None
    outcome = "invalid"
    status = "blocked"

    if presented == "local":
        if marker != "local-authority":
            issue = PreflightIssue("PLAN_AUTHORITY_CONTEXT", "presented")
        else:
            projection = (
                archive_observation
                if archive_observation.state != "missing"
                else active_observation
            )
            if projection.state == "missing":
                issue = PreflightIssue("PLAN_PROJECTION_MISSING", "active/archive")
            elif projection.state == "unsafe":
                issue = PreflightIssue("PLAN_FILE_KIND_UNSAFE", "active/archive")
                status = "unavailable"
            elif projection.state == "unreadable":
                issue = PreflightIssue("PLAN_AUTHORITY_UNREADABLE", "active/archive")
                status = "unavailable"
            elif _regular_header_valid(
                projection,
                datetime_value=datetime_value,
                authority_kind="direct-repository",
            ):
                issue = PreflightIssue("PLAN_AUTHORITY_CONFLICT", "active/archive")
                outcome = "ambiguous"
            elif not _regular_header_valid(
                projection,
                datetime_value=datetime_value,
                authority_kind="local-authority",
            ) or projection.data != candidate.data:
                issue = PreflightIssue("PLAN_PROJECTION_DRIFT", "active/archive")
            else:
                outcome = "local"
                status = "eligible"
    else:
        if marker != "direct-repository":
            issue = PreflightIssue("PLAN_AUTHORITY_CONTEXT", "presented")
            if local.state == "unsafe":
                status = "unavailable"
                additional_issue = PreflightIssue("PLAN_FILE_KIND_UNSAFE", "local")
            elif local.state == "unreadable":
                status = "unavailable"
                additional_issue = PreflightIssue("PLAN_AUTHORITY_UNREADABLE", "local")
        elif local.state == "unsafe":
            issue = PreflightIssue("PLAN_FILE_KIND_UNSAFE", "local")
            status = "unavailable"
        elif local.state == "unreadable":
            issue = PreflightIssue("PLAN_AUTHORITY_UNREADABLE", "local")
            status = "unavailable"
        elif local.state != "missing":
            if _regular_header_valid(
                local,
                datetime_value=datetime_value,
                authority_kind="local-authority",
            ):
                issue = PreflightIssue("PLAN_AUTHORITY_CONFLICT", "local")
                outcome = "ambiguous"
            else:
                issue = PreflightIssue("PLAN_PROJECTION_DRIFT", "local")
        else:
            outcome = "direct"
            status = "eligible"

    if issue is not None:
        return PreflightReport(
            context,
            status,
            authority_location if outcome in {"local", "direct"} else None,
            outcome,
            tuple(
                candidate_issue
                for candidate_issue in (issue, additional_issue)
                if candidate_issue is not None
            ),
            path_records,
            plan_id,
            candidate.sha256,
            None,
        )

    plan_status = candidate.header.fields.get("Status")
    if plan_status in {"DONE", "CLOSED"}:
        return PreflightReport(
            context,
            "blocked",
            authority_location,
            outcome,
            (PreflightIssue("PLAN_STATUS_NONEXECUTABLE", "status"),),
            path_records,
            plan_id,
            candidate.sha256,
            None,
        )

    assert candidate.data is not None
    structural_report = validate_text(
        candidate.data.decode("utf-8"), context=context, consumer="backend"
    )
    structural = structural_report.payload()
    if (
        structural_report.plan_sha256 != candidate.sha256
        or structural["schema"] != SCHEMA
    ):
        return PreflightReport(
            context,
            "unavailable",
            authority_location,
            "invalid",
            (PreflightIssue("PLAN_STATE_STALE", "structure"),),
            path_records,
            plan_id,
            candidate.sha256,
            structural,
        )
    return PreflightReport(
        context,
        "eligible" if structural_report.valid else "blocked",
        authority_location,
        outcome,
        (),
        path_records,
        plan_id,
        candidate.sha256,
        structural,
    )


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate or preflight portable Executor Plan v1"
    )
    parser.add_argument("plan", type=Path)
    parser.add_argument("--context", choices=CONTEXTS, required=True)
    parser.add_argument("--consumer", choices=CONSUMERS, required=True)
    parser.add_argument("--slug")
    parser.add_argument("--repository-root", type=Path)
    parser.add_argument("--local-root", type=Path)
    parser.add_argument("--local-plan", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    arguments = list(argv) if argv is not None else os.sys.argv[1:]
    parser = _parser()
    locator_options = (
        "--slug",
        "--repository-root",
        "--local-root",
        "--local-plan",
    )
    for option in ("--context", "--consumer", *locator_options):
        if arguments.count(option) > 1:
            parser.error(f"{option} may be provided only once")
    args = parser.parse_args(arguments)

    locator_values = (
        args.slug,
        args.repository_root,
        args.local_root,
        args.local_plan,
    )
    if args.consumer == "planner":
        if any(value is not None for value in locator_values):
            parser.error("locator options are valid only with --consumer backend")
        try:
            report = validate_file(
                args.plan, context=args.context, consumer=args.consumer
            )
        except OSError:
            payload = {
                "consumer": args.consumer,
                "context": args.context,
                "error": "unreadable plan",
                "schema": SCHEMA,
                "status": "unavailable",
            }
            print(json.dumps(payload, sort_keys=True, separators=(",", ":")))
            return 66
        print(json.dumps(report.payload(), sort_keys=True, separators=(",", ":")))
        return 0 if report.valid else 2

    if any(value is None for value in locator_values):
        preflight = _unavailable_preflight(args.context)
    else:
        preflight = preflight_file(
            args.plan,
            context=args.context,
            slug=args.slug,
            repository_root=args.repository_root,
            local_root=args.local_root,
            local_plan=args.local_plan,
        )
    print(json.dumps(preflight.payload(), sort_keys=True, separators=(",", ":")))
    return {"eligible": 0, "blocked": 2, "unavailable": 66}[preflight.status]


if __name__ == "__main__":
    raise SystemExit(main())
