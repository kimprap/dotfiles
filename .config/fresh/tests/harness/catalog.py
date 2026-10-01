"""FEATURES.md parser and the catalog/case/profile drift check."""
from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

from .bootstrap import fresh_links
from .isolation import IGNORED_NAMES

STATUSES = ("native", "workaround", "upstream-limitation")
LIMITATIONS_HEADING = "## Upstream limitations"
SIGNATURES_HEADING = "### Log-guard signatures"
KNOWN_FAILURES_HEADING = "### Known intermittent failures"
_SIGNATURE = re.compile(r"^- `([^`]+)`:")
_KNOWN_FAILURE = re.compile(r"^- `([^`]+)`: `([^`]+)` — `?([A-Za-z0-9_-]+)`?$")
_ROW = re.compile(r"^\| `([^`]+)` \|")
_BULLET = re.compile(r"^- `?([A-Za-z0-9_-]+)`?:")
_CODE = re.compile(r"^`([^`]+)`$")
# Profile entries that are not runtime files: the catalog and the test tree.
NON_RUNTIME = ("FEATURES.md", "tests")


@dataclass(frozen=True)
class Row:
    id: str
    behavior: str
    implementation: str
    case: str
    status: str
    line: int


def _cells(line: str) -> list[str]:
    body = line.strip()
    body = body[1:] if body.startswith("|") else body
    body = body[:-1] if body.endswith("|") else body
    return [cell.strip().replace("\\|", "|") for cell in re.split(r"(?<!\\)\|", body)]


def parse(catalog: Path) -> tuple[list[Row], set[str]]:
    """Return the catalog rows and the row IDs listed under `## Upstream limitations`."""
    rows: list[Row] = []
    limited: set[str] = set()
    in_limits = in_subsection = False
    for number, line in enumerate(Path(catalog).read_text().splitlines(), 1):
        if line.startswith("## "):
            in_limits, in_subsection = line.strip() == LIMITATIONS_HEADING, False
            continue
        if in_limits and line.startswith("### "):
            in_subsection = True
            continue
        if in_subsection:  # signatures and known failures are not rows or limitation IDs
            continue
        if in_limits:
            match = _BULLET.match(line)
            if match:
                limited.add(match.group(1))
            continue
        if _ROW.match(line):
            cells = _cells(line)
            cells += [""] * (5 - len(cells))
            case = _CODE.match(cells[3])
            status = _CODE.match(cells[4])
            rows.append(Row(_CODE.match(cells[0]).group(1), cells[1], cells[2],
                            case.group(1) if case else cells[3],
                            status.group(1) if status else cells[4], number))
    return rows, limited


def _subsection(catalog: Path, heading: str):
    """Yield (line number, line) under `## Upstream limitations` → `heading`."""
    in_limits = inside = False
    for number, line in enumerate(Path(catalog).read_text().splitlines(), 1):
        if line.startswith("## "):
            in_limits, inside = line.strip() == LIMITATIONS_HEADING, False
        elif in_limits and line.startswith("### "):
            inside = line.strip() == heading
        elif inside:
            yield number, line


def signatures(catalog: Path) -> tuple[str, ...]:
    """Exact message substrings listed under `## Upstream limitations` → `### Log-guard signatures`."""
    found: list[str] = []
    for _number, line in _subsection(catalog, SIGNATURES_HEADING):
        match = _SIGNATURE.match(line)
        if match and match.group(1) not in found:
            found.append(match.group(1))
    return tuple(found)


@dataclass(frozen=True)
class KnownFailure:
    case: str
    prefix: str  # exact start of the case's first failure message
    row: str  # the limitation row that explains it
    line: int


def known_failures(catalog: Path) -> tuple[list[KnownFailure], list[str]]:
    """Entries under `### Known intermittent failures`, and DRIFT lines for malformed ones."""
    entries, malformed = [], []
    for number, line in _subsection(catalog, KNOWN_FAILURES_HEADING):
        if not line.startswith("- "):
            continue
        match = _KNOWN_FAILURE.match(line)
        if match:
            entries.append(KnownFailure(*match.groups(), number))
        else:
            malformed.append(f"DRIFT known failure line {number}: not `- `<case>`: `<message prefix>` — <row>`")
    return entries, malformed


def case_ids(cases_dir: Path) -> list[str]:
    return sorted(p.stem for p in Path(cases_dir).glob("*.py") if not p.name.startswith("_"))


def _runtime_files(profile_root: Path) -> list[str]:
    root = Path(profile_root)
    files = []
    for path in root.rglob("*"):
        rel = path.relative_to(root)
        if rel.parts[0] in NON_RUNTIME or any(part in IGNORED_NAMES for part in rel.parts):
            continue
        if path.is_file() or path.is_symlink():
            files.append(rel.as_posix())
    return sorted(files)


def _covered(rel: str, sources: list[str]) -> bool:
    return any(rel == s or rel.startswith(s + "/") for s in sources)


def _uncovered_top(rel: str, sources: list[str]) -> str:
    """The highest ancestor of rel that holds no link source, else rel itself."""
    parts = rel.split("/")
    for depth in range(1, len(parts)):
        prefix = "/".join(parts[:depth])
        if not any(s == prefix or s.startswith(prefix + "/") for s in sources):
            return prefix + "/"
    return rel


def _feature_imports(profile_root: Path) -> list[str]:
    features = Path(profile_root) / "features"
    if not features.is_dir():
        return []
    entry = Path(profile_root) / "plugins" / "features.ts"
    text = entry.read_text() if entry.is_file() else ""
    problems = []
    for module in sorted(features.glob("*.ts")):
        pattern = rf"""['"]\.\./features/{re.escape(module.stem)}(\.ts)?['"]"""
        if not re.search(pattern, text):
            problems.append(f"DRIFT module features/{module.name}: not imported by plugins/features.ts")
    return problems


def drift(catalog: Path, cases_dir: Path, profile_root: Path, bootstrap: Path) -> tuple[list[str], int, int]:
    """Return (problem lines, row count, case count)."""
    problems: list[str] = []
    rows, limited = parse(catalog)
    cases = case_ids(cases_dir)
    if not rows:
        problems.append(f"DRIFT catalog {catalog}: no rows")
    for row_id, count in sorted(Counter(r.id for r in rows).items()):
        if count > 1:
            problems.append(f"DRIFT row {row_id}: duplicate id ({count} rows)")
    for row in rows:
        if row.status not in STATUSES:
            problems.append(f"DRIFT row {row.id}: status '{row.status}' is not one of {'|'.join(STATUSES)}")
        if row.case not in cases:
            problems.append(f"DRIFT row {row.id}: case {row.case} missing")
        if row.status == "upstream-limitation" and row.id not in limited:
            problems.append(f"DRIFT row {row.id}: upstream-limitation not listed under {LIMITATIONS_HEADING}")
    known, malformed = known_failures(catalog)
    problems.extend(malformed)
    row_ids = {r.id for r in rows}
    for entry in known:
        if entry.case not in cases:
            problems.append(f"DRIFT known failure {entry.case}: case missing")
        if entry.row not in row_ids:
            problems.append(f"DRIFT known failure {entry.case}: row {entry.row} missing")
    for case, count in sorted(Counter(e.case for e in known).items()):
        if count > 1:
            problems.append(f"DRIFT known failure {case}: {count} entries")
    per_case = Counter(r.case for r in rows)
    for case in cases:
        if per_case[case] == 0:
            problems.append(f"DRIFT case {case}: no row")
        elif per_case[case] > 1:
            problems.append(f"DRIFT case {case}: {per_case[case]} rows")
    if not Path(bootstrap).is_file():
        problems.append(f"DRIFT bootstrap {bootstrap}: missing")
    else:
        links, _legacy = fresh_links(bootstrap)
        sources = [link.source for link in links]
        for source in sources:
            if not (Path(profile_root) / source).exists():
                problems.append(f"DRIFT link {source}: source missing")
        reported = set()
        for rel in _runtime_files(profile_root):
            if not _covered(rel, sources):
                top = _uncovered_top(rel, sources)
                if top not in reported:
                    reported.add(top)
                    problems.append(f"DRIFT file {top}: not covered by a bootstrap Fresh link")
    problems.extend(_feature_imports(profile_root))
    return problems, len(rows), len(cases)
