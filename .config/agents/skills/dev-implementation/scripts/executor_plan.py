#!/usr/bin/env python3
"""Provider-neutral structural validation for portable Executor Plan v1 Markdown."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Mapping, Sequence

SCHEMA = "executor-plan-validation/v1"
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
    "Intent",
    "Methods",
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
ASSURANCE_PROFILES = ("compact", "standard", "high-consequence")
PROFILE_TAIL_OWNERS = (
    "dev-verification",
    "dev-code-review",
    "dev-continual-learning",
)
NON_WORK_LIFECYCLE_OWNERS = frozenset(
    (*PROFILE_TAIL_OWNERS, "dev-integration", "dev-implementation backend")
)
COMPACT_FINAL_RECEIVER = "dev-implementation backend"
FINAL_RECEIVERS = {"dev-verification", "dev-implementation backend"}
METHOD_TOKENS = {"tdd"}
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

HEADER_FIELDS = (
    "Datetime",
    "Mode",
    "Scope",
    "Summary",
    "Status",
    "Completed At",
)
HEADER_REQUIRED_FIELDS = ("Datetime", "Scope", "Summary", "Status")
HEADER_STATUSES = ("PENDING", "IN_PROGRESS", "DONE", "CLOSED")
_CANONICAL_METADATA = re.compile(r"^\*\*([^*\r\n]+)\*\*: (.*)$")
_H1 = re.compile(r"^#\s+\S.*$")
_H2 = re.compile(r"^##(?:\s|$)")
_TASK_CHECKBOX = re.compile(r"- \[([ xX])\] (T[1-9]\d*)\.\s+(.+)")
_VERIFICATION_CHECKBOX = re.compile(
    r"- \[([ xX])\] (VR-[A-Z0-9][A-Z0-9-]*)\.\s+(.+)"
)
_COMPLETION_RECORD = re.compile(
    r"^  (?:- )?completed (\d{4}-\d{2}-\d{2}-\d{4})$"
)
_COMPLETION_RECORD_PREFIX = re.compile(r"^  (?:- )?completed(?:\s|$)")
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
    plan_sha256: str
    datetime: str | None
    lifecycle_status: str | None
    terminal_complete: bool
    issues: tuple[Issue, ...]

    @property
    def valid(self) -> bool:
        return not self.issues

    def payload(self) -> dict[str, object]:
        return {
            "schema": SCHEMA,
            "status": "valid" if self.valid else "invalid",
            "issues": [issue.payload() for issue in self.issues],
            "plan_sha256": self.plan_sha256,
            "datetime": self.datetime,
            "lifecycle_status": self.lifecycle_status,
            "terminal_complete": self.terminal_complete,
        }


def _issue(
    issues: list[Issue], code: str, message: str, section: str | None = None
) -> None:
    if (
        code != "UTF8"
        and not code.startswith("HEADER_")
        and not code.startswith("LIFECYCLE_")
    ):
        message = f"portable plan violates {code.lower().replace('_', ' ')}"
    issues.append(Issue(code, message, section))


@dataclass(frozen=True)
class HeaderInspection:
    source: str
    lines: tuple[str, ...]
    first_h2: int | None
    fields: Mapping[str, str | None]
    issues: tuple[Issue, ...]


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


def _valid_timestamp(value: str | None) -> bool:
    if value is None or not re.fullmatch(r"\d{4}-\d{2}-\d{2}-\d{4}", value):
        return False
    try:
        datetime.strptime(value, "%Y-%m-%d-%H%M")
    except ValueError:
        return False
    return True


def _empty_header_fields() -> dict[str, None]:
    return {field: None for field in HEADER_FIELDS}


def _inspect_header_bytes(data: bytes) -> HeaderInspection:
    """Parse the canonical byte-preserving header without exposing content."""
    issues: list[Issue] = []
    empty_fields = _empty_header_fields()
    if not data:
        _header_issue(issues, "HEADER_H1", line_number=1)
        return HeaderInspection("", (), None, empty_fields, tuple(issues))
    if data.startswith(b"\xef\xbb\xbf"):
        _header_issue(issues, "HEADER_BOM", line_number=1)
        return HeaderInspection("", (), None, empty_fields, tuple(issues))
    try:
        source = data.decode("utf-8")
    except UnicodeDecodeError:
        _issue(issues, "UTF8", "plan must be strict UTF-8")
        return HeaderInspection("", (), None, empty_fields, tuple(issues))

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
        return HeaderInspection(source, lines, None, empty_fields, tuple(issues))

    region = list(enumerate(lines[1:first_h2], start=2))
    nonblank = [index for index, (_line_number, line) in enumerate(region) if line]
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
            _header_issue(issues, code, canonical_name or "metadata", line_number)
        else:
            _header_issue(issues, "HEADER_METADATA_BLOCK", "metadata", line_number)

    for field in HEADER_REQUIRED_FIELDS:
        count = len(values[field])
        if count == 0:
            _header_issue(issues, "HEADER_FIELD_MISSING", field)
        elif count > 1:
            _header_issue(issues, "HEADER_FIELD_DUPLICATE", field)
    for field in ("Mode", "Completed At"):
        if len(values[field]) > 1:
            _header_issue(issues, "HEADER_FIELD_DUPLICATE", field)

    order = {field: index for index, field in enumerate(HEADER_FIELDS)}
    if exact_names != sorted(exact_names, key=order.__getitem__):
        _header_issue(issues, "HEADER_FIELD_ORDER")

    if values["Datetime"] and not _valid_timestamp(values["Datetime"][0]):
        _header_issue(issues, "HEADER_FIELD_VALUE", "Datetime")
    for field in ("Mode", "Scope", "Summary"):
        if values[field] and values[field][0] == "":
            _header_issue(issues, "HEADER_FIELD_VALUE", field)
    if values["Status"] and values["Status"][0] not in HEADER_STATUSES:
        _header_issue(issues, "HEADER_FIELD_VALUE", "Status")

    fields = {
        field: values[field][0] if values[field] else None
        for field in HEADER_FIELDS
    }
    return HeaderInspection(source, lines, first_h2, fields, tuple(issues))


def _lifecycle_issue(
    issues: list[Issue], code: str, message: str, section: str
) -> None:
    _issue(issues, code, message, section)


def _validate_lifecycle(
    header: HeaderInspection,
    lines: Sequence[str],
    headings: Sequence[tuple[str, int]],
    issues: list[Issue],
) -> bool:
    status_value = header.fields.get("Status")
    status = status_value if status_value in HEADER_STATUSES else None
    consumed_records: set[int] = set()

    for index, line in enumerate(lines):
        task = _TASK_CHECKBOX.fullmatch(line)
        if task is None:
            continue
        checked = task.group(1).lower() == "x"
        task_id = task.group(2)
        records: list[tuple[int, str]] = []
        record_index = index + 1
        while (
            record_index < len(lines)
            and _COMPLETION_RECORD_PREFIX.match(lines[record_index])
        ):
            records.append((record_index, lines[record_index]))
            consumed_records.add(record_index)
            record_index += 1

        if checked and not records:
            _lifecycle_issue(
                issues,
                "LIFECYCLE_TASK_COMPLETION_MISSING",
                f"{task_id} is checked without an immediate completion record",
                "Tasks",
            )
        if not checked and (status == "DONE" or records):
            _lifecycle_issue(
                issues,
                "LIFECYCLE_TASK_UNCHECKED",
                f"{task_id} is not a valid completed task",
                "Tasks",
            )
        if len(records) > 1:
            _lifecycle_issue(
                issues,
                "LIFECYCLE_TASK_COMPLETION_DUPLICATE",
                f"{task_id} has multiple immediate completion records",
                "Tasks",
            )
        if records and any(
            (match := _COMPLETION_RECORD.fullmatch(record)) is None
            or not _valid_timestamp(match.group(1))
            for _record_index, record in records
        ):
            _lifecycle_issue(
                issues,
                "LIFECYCLE_TASK_COMPLETION_INVALID",
                f"{task_id} has an invalid immediate completion record",
                "Tasks",
            )

    for index, line in enumerate(lines):
        if (
            index not in consumed_records
            and _COMPLETION_RECORD_PREFIX.match(line)
        ):
            _lifecycle_issue(
                issues,
                "LIFECYCLE_TASK_COMPLETION_INVALID",
                f"completion record at line {index + 1} is not immediately below a task",
                "Tasks",
            )

    if status == "DONE":
        for line in lines:
            recipe = _VERIFICATION_CHECKBOX.fullmatch(line)
            if recipe is not None and recipe.group(1).lower() != "x":
                recipe_id = recipe.group(2)
                _lifecycle_issue(
                    issues,
                    "LIFECYCLE_CRITERION_UNCHECKED",
                    f"{recipe_id} is not checked",
                    "Verification / Done criteria",
                )

    completed_at = header.fields.get("Completed At")
    if status == "DONE":
        if not _valid_timestamp(completed_at):
            _lifecycle_issue(
                issues,
                "LIFECYCLE_COMPLETED_AT_INVALID",
                "DONE requires one valid Completed At timestamp",
                "header",
            )
    elif completed_at is not None:
        _lifecycle_issue(
            issues,
            "LIFECYCLE_COMPLETED_AT_INVALID",
            f"{status or 'invalid status'} forbids Completed At",
            "header",
        )

    summary_indexes = [
        index for name, index in headings if name == "Completion Summary"
    ]
    summary_valid = False
    if len(summary_indexes) == 1:
        start = summary_indexes[0] + 1
        end = next(
            (
                index
                for _name, index in headings
                if index > summary_indexes[0]
            ),
            len(lines),
        )
        summary_valid = any(line.strip() for line in lines[start:end])
    if status == "DONE" and not summary_valid:
        _lifecycle_issue(
            issues,
            "LIFECYCLE_COMPLETION_SUMMARY_INVALID",
            "DONE requires one nonempty final Completion Summary",
            "Completion Summary",
        )
    elif summary_indexes and (len(summary_indexes) != 1 or not summary_valid):
        _lifecycle_issue(
            issues,
            "LIFECYCLE_COMPLETION_SUMMARY_INVALID",
            "Completion Summary must be unique and nonempty",
            "Completion Summary",
        )

    return status in {"DONE", "CLOSED"}


def _report(
    raw: bytes,
    header: HeaderInspection,
    terminal_status: bool,
    issues: Sequence[Issue],
) -> Report:
    datetime_value = header.fields.get("Datetime")
    parsed_datetime = datetime_value if _valid_timestamp(datetime_value) else None
    status_value = header.fields.get("Status")
    lifecycle_status = status_value if status_value in HEADER_STATUSES else None
    return Report(
        hashlib.sha256(raw).hexdigest(),
        parsed_datetime,
        lifecycle_status,
        terminal_status and not issues,
        tuple(issues),
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


def _valid_methods(value: str) -> bool:
    if value == "none":
        return True
    tokens = [token.strip() for token in value.split(",")]
    return (
        bool(tokens)
        and all(tokens)
        and len(tokens) == len(set(tokens))
        and "none" not in tokens
        and set(tokens) <= METHOD_TOKENS
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
        field = re.fullmatch(r"  - ([^:]+):\s*(.*)", line)
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
        missing = [field for field in TASK_FIELDS if not task.get(field, "").strip()]
        if missing:
            _issue(
                issues,
                "TASK_FIELD_MISSING",
                f"{task_id} missing or empty fields: {', '.join(missing)}",
                "Tasks",
            )
        if "Methods" in task and not _valid_methods(task["Methods"]):
            _issue(
                issues,
                "TASK_METHODS_INVALID",
                f"{task_id} Methods must be none or unique closed method tokens",
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


def _validate_task_shape(
    tasks: Mapping[str, Mapping[str, str]],
    graph: Mapping[str, tuple[str, ...]],
    assurance: str,
    issues: list[Issue],
) -> None:
    if assurance and assurance not in ASSURANCE_PROFILES:
        _issue(
            issues,
            "ASSURANCE_PROFILE_INVALID",
            "Assurance must be compact, standard, or high-consequence",
            "Execution policy",
        )
        return
    if assurance not in ASSURANCE_PROFILES or not tasks:
        return

    task_ids = tuple(tasks)
    owners = tuple(tasks[task_id].get("Owner", "") for task_id in task_ids)
    if assurance == "compact":
        if any(owner in NON_WORK_LIFECYCLE_OWNERS for owner in owners):
            _issue(
                issues,
                "TASK_TAIL_INVALID",
                "compact plans cannot contain non-work lifecycle owners",
                "Tasks",
            )
        elif tasks[task_ids[-1]].get("Receiver") != COMPACT_FINAL_RECEIVER:
            _issue(
                issues,
                "TASK_TAIL_INVALID",
                "the final compact task has an invalid receiver",
                "Tasks",
            )
        return

    exact_suffix = (
        len(task_ids) >= len(PROFILE_TAIL_OWNERS)
        and owners[-len(PROFILE_TAIL_OWNERS) :] == PROFILE_TAIL_OWNERS
    )
    attempted_suffix = exact_suffix or any(
        owner in PROFILE_TAIL_OWNERS[1:] for owner in owners
    )
    if not attempted_suffix:
        if tasks[task_ids[-1]].get("Receiver") not in FINAL_RECEIVERS:
            _issue(
                issues,
                "TASK_TAIL_INVALID",
                "the final non-tail task has an invalid receiver",
                "Tasks",
            )
        return
    if not exact_suffix:
        _issue(
            issues,
            "TASK_TAIL_INVALID",
            "an attempted profile tail must be the exact final owner sequence",
            "Tasks",
        )
        return

    tail_ids = task_ids[-len(PROFILE_TAIL_OWNERS) :]
    non_tail_ids = task_ids[: -len(PROFILE_TAIL_OWNERS)]
    valid = bool(non_tail_ids) and any(
        tasks[task_id].get("Owner") not in PROFILE_TAIL_OWNERS
        for task_id in non_tail_ids
    )
    valid = valid and not any(
        tasks[task_id].get("Owner") in PROFILE_TAIL_OWNERS[1:]
        for task_id in non_tail_ids
    )
    if non_tail_ids:
        predecessor = non_tail_ids[-1]
        valid = valid and tasks[predecessor].get("Receiver") == tail_ids[0]
        expected_numbers = tuple(
            range(int(predecessor[1:]) + 1, int(predecessor[1:]) + 4)
        )
        valid = valid and tuple(int(task_id[1:]) for task_id in tail_ids) == (
            expected_numbers
        )
        previous_ids = (predecessor, tail_ids[0], tail_ids[1])
        valid = valid and all(
            graph.get(task_id) == (previous_id,)
            for task_id, previous_id in zip(tail_ids, previous_ids)
        )
    valid = valid and all(
        tasks[task_id].get("Methods") == "none" for task_id in tail_ids
    )
    expected_receivers = (tail_ids[1], tail_ids[2], "dev-implementation backend")
    valid = valid and all(
        tasks[task_id].get("Receiver") == receiver
        for task_id, receiver in zip(tail_ids, expected_receivers)
    )
    if not valid:
        _issue(
            issues,
            "TASK_TAIL_INVALID",
            "the final profile tail is incomplete or internally inconsistent",
            "Tasks",
        )


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


def validate_text(text: str) -> Report:
    issues: list[Issue] = []
    raw = text.encode("utf-8")
    header = _inspect_header_bytes(raw)
    issues.extend(header.issues)
    lines = list(header.lines)
    headings = _headings(lines)
    terminal_status = _validate_lifecycle(header, lines, headings, issues)
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
        return _report(raw, header, terminal_status, issues)

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
    _validate_task_shape(tasks, graph, execution.get("Assurance", ""), issues)
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

    return _report(raw, header, terminal_status, issues)


def validate_file(path: Path) -> Report:
    data = Path(path).read_bytes()
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        issue = Issue("UTF8", "plan must be strict UTF-8")
        return Report(
            hashlib.sha256(data).hexdigest(),
            None,
            None,
            False,
            (issue,),
        )
    report = validate_text(text)
    if report.plan_sha256 != hashlib.sha256(data).hexdigest():
        raise RuntimeError("validation digest does not match the file snapshot")
    return report



def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate portable Executor Plan v1")
    commands = parser.add_subparsers(dest="command", required=True)
    validate = commands.add_parser("validate", help="validate one plan file")
    validate.add_argument("plan", type=Path)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    try:
        report = validate_file(args.plan)
    except OSError:
        payload = {
            "schema": SCHEMA,
            "status": "unavailable",
            "issues": [
                {
                    "code": "FILE_UNAVAILABLE",
                    "message": "plan file is unavailable",
                }
            ],
            "plan_sha256": None,
            "datetime": None,
            "lifecycle_status": None,
            "terminal_complete": False,
        }
        print(json.dumps(payload, separators=(",", ":")))
        return 66
    print(json.dumps(report.payload(), separators=(",", ":")))
    return 0 if report.valid else 2


if __name__ == "__main__":
    raise SystemExit(main())
