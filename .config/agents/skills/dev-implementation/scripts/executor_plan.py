#!/usr/bin/env python3
"""Context-free structural validation for lean implementation plans."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence

SCHEMA = "executor-plan-validation/v2"
STATUSES = {"PENDING", "IN_PROGRESS", "DONE", "CLOSED"}
REQUIRED_SECTIONS = (
    "Outcome and authority",
    "Scope and effects",
    "Tasks",
    "Acceptance",
    "Recovery and stops",
)
SUMMARY_SECTION = "Completion Summary"
HEADER_FIELDS = ("Datetime", "Scope", "Summary", "Status")
TIMESTAMP_RE = re.compile(r"\d{4}-\d{2}-\d{2}-\d{4}\Z")
H1_RE = re.compile(r"# \S(?:.*\S)?\Z")
METADATA_RE = re.compile(r"\*\*([A-Za-z][A-Za-z ]*)\*\*: (\S(?:.*\S)?)\Z")
TASK_RE = re.compile(r"- \[([ xX])\] (T([1-9]\d*))\. (\S(?:.*\S)?)\Z")
TASK_FIELD_RE = re.compile(
    r"  - (Owner|Depends on|Targets|Acceptance|Receiver): (\S(?:.*\S)?)\Z"
)
TASK_ANY_FIELD_RE = re.compile(r"  - ([A-Za-z][A-Za-z ]*):")
COMPLETION_RE = re.compile(r"  completed (\S+)\Z")
TASK_ID_RE = re.compile(r"T[1-9]\d*\Z")
AC_RE = re.compile(r"- \[([ xX])\] (AC-[A-Z0-9]+(?:-[A-Z0-9]+)*)\. (\S(?:.*\S)?)\Z")
AC_ID_RE = re.compile(r"AC-[A-Z0-9]+(?:-[A-Z0-9]+)*\Z")
AC_FIELD_RE = re.compile(r"  (Behavior|Check): (\S(?:.*\S)?)\Z")
SIMPLE_FIELD_RE = re.compile(r"- ([A-Za-z][A-Za-z -]*): (\S(?:.*\S)?)\Z")
FENCE_RE = re.compile(r" {0,3}(`{3,}|~{3,})")


@dataclass(frozen=True)
class Issue:
    code: str
    message: str
    section: str

    def payload(self) -> dict[str, str]:
        return {"code": self.code, "message": self.message, "section": self.section}


@dataclass(frozen=True)
class Report:
    issues: tuple[Issue, ...]
    datetime: str | None
    lifecycle_status: str | None
    terminal_complete: bool

    @property
    def valid(self) -> bool:
        return not self.issues

    def payload(self) -> dict[str, object]:
        return {
            "schema": SCHEMA,
            "status": "valid" if self.valid else "invalid",
            "issues": [issue.payload() for issue in self.issues],
            "datetime": self.datetime,
            "lifecycle_status": self.lifecycle_status,
            "terminal_complete": self.terminal_complete,
        }


@dataclass
class Task:
    task_id: str
    number: int
    checked: bool
    completion: str | None
    fields: dict[str, str]
    field_order: list[str]


@dataclass
class Criterion:
    criterion_id: str
    checked: bool
    fields: dict[str, str]
    field_order: list[str]


def _add(issues: list[Issue], code: str, message: str, section: str) -> None:
    key = (code, section)
    if any((issue.code, issue.section) == key for issue in issues):
        return
    issues.append(Issue(code, message, section))


def _normalise(raw: bytes, issues: list[Issue]) -> list[str] | None:
    if raw.startswith(b"\xef\xbb\xbf"):
        _add(issues, "FORMAT_BOM", "UTF-8 BOM is not allowed", "Header")
    try:
        source = raw.decode("utf-8")
    except UnicodeDecodeError:
        _add(issues, "FORMAT_UTF8", "plan must be valid UTF-8", "Header")
        return None

    lines: list[str] = []
    residual_cr = False
    for physical in source.split("\n"):
        line = physical[:-1] if physical.endswith("\r") else physical
        if "\r" in line:
            residual_cr = True
        lines.append(line)
    if residual_cr:
        _add(
            issues,
            "FORMAT_CARRIAGE_RETURN",
            "bare or residual carriage returns are not allowed",
            "Header",
        )
    return lines


def _header(lines: list[str], issues: list[Issue]) -> tuple[dict[str, str], int]:
    if not lines or not H1_RE.fullmatch(lines[0]):
        _add(issues, "HEADER_H1", "first line must be one nonempty H1", "Header")

    first_h2 = next((index for index, title in _headings(lines) if title), len(lines))
    region = lines[1:first_h2]
    while region and not region[0].strip():
        region.pop(0)
    while region and not region[-1].strip():
        region.pop()

    if not region:
        _add(issues, "HEADER_MISSING", "metadata block is required", "Header")
        return {}, first_h2
    if any(not line.strip() for line in region):
        _add(issues, "HEADER_CONTIGUOUS", "metadata fields must be contiguous", "Header")

    names: list[str] = []
    fields: dict[str, str] = {}
    for line in region:
        match = METADATA_RE.fullmatch(line)
        if not match:
            _add(issues, "HEADER_FIELD_MALFORMED", "metadata field is malformed", "Header")
            continue
        name, value = match.groups()
        names.append(name)
        if name in fields:
            _add(issues, "HEADER_DUPLICATE", "metadata fields must be unique", "Header")
        else:
            fields[name] = value

    expected = list(HEADER_FIELDS)
    if "Completed At" in names:
        expected.append("Completed At")
    if names != expected:
        _add(
            issues,
            "HEADER_ORDER",
            "metadata fields must use the exact lean order",
            "Header",
        )

    for required in HEADER_FIELDS:
        if required not in fields:
            _add(issues, "HEADER_FIELD_MISSING", "required metadata field is missing", "Header")

    datetime = fields.get("Datetime")
    if datetime is not None and not TIMESTAMP_RE.fullmatch(datetime):
        _add(issues, "HEADER_DATETIME", "Datetime must use YYYY-MM-DD-HHMM", "Header")

    status = fields.get("Status")
    if status is not None and status not in STATUSES:
        _add(issues, "HEADER_STATUS", "Status is not a lean lifecycle state", "Header")

    completed_at = fields.get("Completed At")
    if completed_at is not None and not TIMESTAMP_RE.fullmatch(completed_at):
        _add(
            issues,
            "COMPLETED_AT_INVALID",
            "Completed At must use YYYY-MM-DD-HHMM",
            "Header",
        )
    if status == "DONE" and completed_at is None:
        _add(issues, "COMPLETED_AT_REQUIRED", "DONE requires Completed At", "Header")
    if status != "DONE" and completed_at is not None:
        _add(
            issues,
            "COMPLETED_AT_FORBIDDEN",
            "Completed At is allowed only for DONE",
            "Header",
        )

    return fields, first_h2


def _headings(lines: Sequence[str]) -> list[tuple[int, str]]:
    headings: list[tuple[int, str]] = []
    fence_char: str | None = None
    fence_length = 0
    for index, line in enumerate(lines):
        fence = FENCE_RE.match(line)
        if fence:
            marker = fence.group(1)
            if fence_char is None:
                fence_char, fence_length = marker[0], len(marker)
            elif marker[0] == fence_char and len(marker) >= fence_length:
                fence_char, fence_length = None, 0
            continue
        if fence_char is None and line.startswith("## "):
            headings.append((index, line[3:].strip()))
    return headings


def _sections(
    lines: list[str], headings: list[tuple[int, str]]
) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    for position, (start, title) in enumerate(headings):
        end = headings[position + 1][0] if position + 1 < len(headings) else len(lines)
        result.setdefault(title, lines[start + 1 : end])
    return result


def _validate_sections(
    lines: list[str], status: str | None, issues: list[Issue]
) -> dict[str, list[str]]:
    headings = _headings(lines)
    titles = [title for _, title in headings]
    expected = list(REQUIRED_SECTIONS)
    if status == "DONE":
        expected.append(SUMMARY_SECTION)

    for title in REQUIRED_SECTIONS:
        if titles.count(title) != 1:
            _add(issues, "SECTION_MISSING", "required lean section is missing or duplicated", title)
    if status == "DONE" and titles.count(SUMMARY_SECTION) != 1:
        _add(
            issues,
            "COMPLETION_SUMMARY_REQUIRED",
            "DONE requires one final Completion Summary",
            SUMMARY_SECTION,
        )
    if status != "DONE" and SUMMARY_SECTION in titles:
        _add(
            issues,
            "COMPLETION_SUMMARY_FORBIDDEN",
            "Completion Summary is allowed only for DONE",
            SUMMARY_SECTION,
        )

    allowed = set(REQUIRED_SECTIONS) | {SUMMARY_SECTION}
    if any(title not in allowed for title in titles):
        _add(
            issues,
            "SECTION_UNEXPECTED",
            "plan contains a section outside the lean schema",
            "Body",
        )
    if titles != expected:
        _add(issues, "SECTION_ORDER", "lean sections are missing, duplicated, or out of order", "Body")

    sections = _sections(lines, headings)
    for title in REQUIRED_SECTIONS:
        if title in sections and not any(line.strip() for line in sections[title]):
            _add(issues, "SECTION_EMPTY", "required lean section is empty", title)
    return sections


def _simple_fields(
    lines: Iterable[str], expected: tuple[str, ...], section: str, issues: list[Issue]
) -> dict[str, str]:
    fields: dict[str, str] = {}
    order: list[str] = []
    for line in lines:
        if not line.strip():
            continue
        match = SIMPLE_FIELD_RE.fullmatch(line)
        if not match:
            _add(issues, "SECTION_FIELD_SHAPE", "section field is malformed", section)
            continue
        name, value = match.groups()
        order.append(name)
        if name in fields:
            _add(issues, "SECTION_FIELD_DUPLICATE", "section fields must be unique", section)
        fields.setdefault(name, value)
    if tuple(order) != expected:
        _add(
            issues,
            "SECTION_FIELD_ORDER",
            "section fields must use the exact lean order",
            section,
        )
    for name in expected:
        if name not in fields:
            _add(issues, "SECTION_FIELD_MISSING", "required section field is missing", section)
    return fields


def _one_name(value: str) -> bool:
    return (
        bool(value.strip())
        and value.casefold() != "none"
        and not any(separator in value for separator in (",", ";", "|"))
    )


def _id_list(value: str, pattern: re.Pattern[str]) -> list[str] | None:
    items = [item.strip() for item in value.split(",")]
    if not items or any(not pattern.fullmatch(item) for item in items):
        return None
    return items


def _parse_tasks(lines: Iterable[str], issues: list[Issue]) -> list[Task]:
    tasks: list[Task] = []
    current: Task | None = None
    offset_after_task = 0

    for line in lines:
        task_match = TASK_RE.fullmatch(line)
        if task_match:
            mark, task_id, number, _description = task_match.groups()
            current = Task(task_id, int(number), mark.casefold() == "x", None, {}, [])
            tasks.append(current)
            offset_after_task = 0
            continue

        offset_after_task += 1
        if not line.strip():
            continue
        completion = COMPLETION_RE.fullmatch(line)
        if completion and current is not None:
            if offset_after_task != 1 or current.completion is not None:
                _add(
                    issues,
                    "TASK_COMPLETION_POSITION",
                    "completion record must immediately follow its task",
                    "Tasks",
                )
            current.completion = completion.group(1)
            if not TIMESTAMP_RE.fullmatch(current.completion):
                _add(
                    issues,
                    "TASK_COMPLETION_INVALID",
                    "task completion record must use YYYY-MM-DD-HHMM",
                    "Tasks",
                )
            continue

        field = TASK_FIELD_RE.fullmatch(line)
        if field and current is not None:
            name, value = field.groups()
            current.field_order.append(name)
            if name in current.fields:
                _add(issues, "TASK_FIELD_DUPLICATE", "task fields must be unique", "Tasks")
            current.fields.setdefault(name, value)
            continue

        if line.startswith("- [") or TASK_ANY_FIELD_RE.match(line):
            _add(issues, "TASK_SHAPE", "task or task field is malformed", "Tasks")
        else:
            _add(issues, "TASK_SHAPE", "Tasks contains non-lean content", "Tasks")

    if not tasks:
        _add(issues, "TASK_MISSING", "at least one task is required", "Tasks")
        return tasks

    seen_ids: set[str] = set()
    numbers: list[int] = []
    target_owners: dict[str, str] = {}
    for task in tasks:
        if task.task_id in seen_ids:
            _add(issues, "TASK_ID_DUPLICATE", "task IDs must be unique", "Tasks")
        seen_ids.add(task.task_id)
        numbers.append(task.number)

        expected_fields = ("Owner", "Depends on", "Targets", "Acceptance", "Receiver")
        if task.field_order != list(expected_fields):
            _add(issues, "TASK_FIELD_ORDER", "task fields must use the exact lean order", "Tasks")
        for name in expected_fields:
            if name not in task.fields:
                _add(issues, "TASK_FIELD_MISSING", "required task field is missing", "Tasks")

        for name in ("Owner", "Receiver"):
            value = task.fields.get(name)
            if value is not None and not _one_name(value):
                _add(issues, "TASK_SINGLE_OWNER", "task owner and receiver must each be one value", "Tasks")

        targets_value = task.fields.get("Targets")
        if targets_value is not None:
            targets = [item.strip() for item in targets_value.split(",")]
            if not targets or any(not item or item.casefold() == "none" for item in targets):
                _add(issues, "TASK_TARGETS_INVALID", "task targets must be exact nonempty values", "Tasks")
            elif len(set(targets)) != len(targets):
                _add(issues, "TARGET_OWNER_COUNT", "each exact target must have one owner", "Tasks")
            for target in targets:
                prior = target_owners.setdefault(target, task.task_id)
                if prior != task.task_id:
                    _add(issues, "TARGET_OWNER_COUNT", "each exact target must have one owner", "Tasks")

        acceptance_value = task.fields.get("Acceptance")
        if acceptance_value is not None:
            references = _id_list(acceptance_value, AC_ID_RE)
            if references is None or len(set(references)) != len(references):
                _add(issues, "TASK_ACCEPTANCE_INVALID", "task acceptance IDs are malformed or repeated", "Tasks")

        if task.checked and task.completion is None:
            _add(issues, "TASK_COMPLETION_MISSING", "checked task requires a completion record", "Tasks")
        if not task.checked and task.completion is not None:
            _add(issues, "TASK_COMPLETION_FORBIDDEN", "unchecked task cannot have a completion record", "Tasks")

    if numbers[0] != 1 or numbers != sorted(numbers) or len(set(numbers)) != len(numbers):
        _add(issues, "TASK_ORDER", "task IDs must begin at T1 and increase monotonically", "Tasks")

    known = {task.task_id for task in tasks}
    graph: dict[str, list[str]] = {}
    for task in tasks:
        value = task.fields.get("Depends on")
        if value is None:
            graph[task.task_id] = []
            continue
        if value == "none":
            dependencies: list[str] = []
        else:
            dependencies = _id_list(value, TASK_ID_RE) or []
            if not dependencies or len(set(dependencies)) != len(dependencies) or "none" in value.casefold():
                _add(issues, "TASK_DEPENDENCY_INVALID", "task dependencies are malformed or repeated", "Tasks")
        graph[task.task_id] = dependencies
        if any(dependency not in known for dependency in dependencies):
            _add(issues, "TASK_DEPENDENCY_DANGLING", "task dependency does not resolve", "Tasks")

    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(task_id: str) -> bool:
        if task_id in visiting:
            return True
        if task_id in visited:
            return False
        visiting.add(task_id)
        for dependency in graph.get(task_id, []):
            if dependency in graph and visit(dependency):
                return True
        visiting.remove(task_id)
        visited.add(task_id)
        return False

    if any(visit(task_id) for task_id in graph if task_id not in visited):
        _add(issues, "TASK_DEPENDENCY_CYCLE", "task dependency graph must be acyclic", "Tasks")

    return tasks


def _parse_acceptance(lines: Iterable[str], issues: list[Issue]) -> list[Criterion]:
    criteria: list[Criterion] = []
    current: Criterion | None = None
    offset_after_criterion = 0

    for line in lines:
        criterion_match = AC_RE.fullmatch(line)
        if criterion_match:
            mark, criterion_id, _description = criterion_match.groups()
            current = Criterion(criterion_id, mark.casefold() == "x", {}, [])
            criteria.append(current)
            offset_after_criterion = 0
            continue
        offset_after_criterion += 1
        if not line.strip():
            continue
        field = AC_FIELD_RE.fullmatch(line)
        if field and current is not None:
            name, value = field.groups()
            if offset_after_criterion != len(current.field_order) + 1:
                _add(issues, "DIRECT_CHECK_INVALID", "Behavior and Check must be adjacent", "Acceptance")
            current.field_order.append(name)
            if name in current.fields:
                _add(issues, "DIRECT_CHECK_INVALID", "Behavior and Check must appear exactly once", "Acceptance")
            current.fields.setdefault(name, value)
            continue
        _add(issues, "ACCEPTANCE_SHAPE", "acceptance item is malformed", "Acceptance")

    if not criteria:
        _add(issues, "ACCEPTANCE_MISSING", "at least one acceptance item is required", "Acceptance")
        return criteria

    seen: set[str] = set()
    for criterion in criteria:
        if criterion.criterion_id in seen:
            _add(issues, "ACCEPTANCE_ID_DUPLICATE", "acceptance IDs must be unique", "Acceptance")
        seen.add(criterion.criterion_id)
        if criterion.field_order != ["Behavior", "Check"]:
            _add(
                issues,
                "DIRECT_CHECK_INVALID",
                "acceptance requires Behavior then Check exactly once",
                "Acceptance",
            )
        check = criterion.fields.get("Check", "")
        command, separator, expected = check.rpartition("; expect ")
        if not separator or not command.strip() or not expected.strip():
            _add(
                issues,
                "DIRECT_CHECK_INVALID",
                "Check must contain a command or direct proof and exact expected result",
                "Acceptance",
            )
    return criteria


def _criterion_accounting(tasks: list[Task], criteria: list[Criterion], issues: list[Issue]) -> None:
    counts = {criterion.criterion_id: 0 for criterion in criteria}
    for task in tasks:
        value = task.fields.get("Acceptance")
        if value is None:
            continue
        references = _id_list(value, AC_ID_RE)
        if references is None:
            continue
        for criterion_id in references:
            if criterion_id not in counts:
                _add(
                    issues,
                    "TASK_ACCEPTANCE_DANGLING",
                    "task acceptance reference does not resolve",
                    "Tasks",
                )
            else:
                counts[criterion_id] += 1
    if any(count != 1 for count in counts.values()):
        _add(
            issues,
            "CRITERION_OWNER_COUNT",
            "each acceptance item must belong to exactly one task",
            "Acceptance",
        )


def _lifecycle(
    status: str | None,
    tasks: list[Task],
    criteria: list[Criterion],
    sections: dict[str, list[str]],
    issues: list[Issue],
) -> None:
    if status == "PENDING" and (
        any(task.checked or task.completion for task in tasks)
        or any(criterion.checked for criterion in criteria)
    ):
        _add(issues, "PENDING_PROGRESS", "PENDING cannot contain completed work", "Lifecycle")

    if status == "DONE":
        if any(not task.checked for task in tasks):
            _add(issues, "DONE_TASK_UNCHECKED", "DONE requires every task checked", "Lifecycle")
        if any(not criterion.checked for criterion in criteria):
            _add(
                issues,
                "DONE_ACCEPTANCE_UNCHECKED",
                "DONE requires every acceptance item checked",
                "Lifecycle",
            )
        summary = sections.get(SUMMARY_SECTION, [])
        if not any(line.strip() for line in summary):
            _add(
                issues,
                "COMPLETION_SUMMARY_REQUIRED",
                "DONE requires a nonempty Completion Summary",
                SUMMARY_SECTION,
            )


def validate_bytes(raw: bytes) -> Report:
    issues: list[Issue] = []
    lines = _normalise(raw, issues)
    if lines is None:
        return Report(tuple(issues), None, None, False)

    fields, _ = _header(lines, issues)
    status = fields.get("Status")
    sections = _validate_sections(lines, status, issues)

    outcome = _simple_fields(
        sections.get("Outcome and authority", []),
        ("Outcome", "Authority", "Assurance"),
        "Outcome and authority",
        issues,
    )
    if outcome.get("Assurance") not in {None, "compact", "standard", "high"}:
        _add(
            issues,
            "ASSURANCE_INVALID",
            "Assurance must be compact, standard, or high",
            "Outcome and authority",
        )
    _simple_fields(
        sections.get("Scope and effects", []),
        ("Scope", "Effects", "Non-goals"),
        "Scope and effects",
        issues,
    )
    _simple_fields(
        sections.get("Recovery and stops", []),
        ("Recovery", "Stops"),
        "Recovery and stops",
        issues,
    )

    tasks = _parse_tasks(sections.get("Tasks", []), issues)
    criteria = _parse_acceptance(sections.get("Acceptance", []), issues)
    _criterion_accounting(tasks, criteria, issues)
    _lifecycle(status, tasks, criteria, sections, issues)

    terminal_complete = not issues and status in {"DONE", "CLOSED"}
    return Report(tuple(issues), fields.get("Datetime"), status, terminal_complete)


def validate_text(text: str) -> Report:
    try:
        raw = text.encode("utf-8")
    except UnicodeEncodeError:
        return Report(
            (Issue("FORMAT_UTF8", "plan must be valid UTF-8", "Header"),),
            None,
            None,
            False,
        )
    return validate_bytes(raw)


def validate_file(path: Path) -> Report:
    try:
        raw = path.read_bytes()
    except OSError:
        return Report(
            (Issue("PLAN_UNAVAILABLE", "plan file could not be read", "Header"),),
            None,
            None,
            False,
        )
    return validate_bytes(raw)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate one lean implementation plan")
    commands = parser.add_subparsers(dest="command", required=True)
    validate = commands.add_parser("validate", help="validate one plan file")
    validate.add_argument("plan", type=Path)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    arguments = _parser().parse_args(argv)
    report = validate_file(arguments.plan)
    print(json.dumps(report.payload(), sort_keys=True))
    return 0 if report.valid else 2


if __name__ == "__main__":
    raise SystemExit(main())
