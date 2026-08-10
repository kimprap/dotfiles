#!/usr/bin/env python3
"""Project the canonical planner persona into three native definition files.

This module is deliberately local and standard-library-only.  It owns strict
portable-source parsing, deterministic rendering, bounded status reporting, and
atomic regular-file replacement; it never deletes obsolete files or launches a
native harness.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import stat
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Mapping


PERSONA_NAME = "planner"
SOURCE_RELATIVE = Path("personas/planner/PERSONA.md")
OUTPUT_RELATIVES: tuple[Path, ...] = (
    Path("harnesses/omp/agents/planner.md"),
    Path("harnesses/grok/agents/planner.md"),
)
OBSOLETE_RELATIVES: tuple[Path, ...] = (
    Path("harnesses/grok/roles/planner.toml"),
    Path("harnesses/grok/personas/planner.toml"),
)
SOURCE_COMMENT_PATH = "personas/planner/PERSONA.md"
OMP_TOOLS = "read, grep, glob, bash, lsp, write, hub"
GROK_MODEL = "grok-4.5"
GROK_TOOLS = "read_file, list_dir, grep, run_terminal_command, write, search_replace"


class ProjectionError(ValueError):
    """A source, target, or bounded projection invariant failed."""


@dataclass(frozen=True)
class PortablePersona:
    source_path: Path
    source_bytes: bytes
    source_sha256: str
    description: str
    description_lines: tuple[str, ...]
    body_bytes: bytes
    body_text: str


@dataclass(frozen=True)
class OutputStatus:
    path: Path
    expected_sha256: str
    observed_sha256: str | None
    status: str


def project_root(project_file: Path | None = None) -> Path:
    """Return the canonical agents root containing ``personas/`` and ``harnesses/``."""
    current = Path(project_file or __file__).absolute()
    return current.parent.parent.parent


def source_path(root: Path | None = None) -> Path:
    return (root or project_root()) / SOURCE_RELATIVE


def output_paths(root: Path | None = None) -> tuple[Path, ...]:
    base = root or project_root()
    return tuple(base / relative for relative in OUTPUT_RELATIVES)


def obsolete_paths(root: Path | None = None) -> tuple[Path, ...]:
    base = root or project_root()
    return tuple(base / relative for relative in OBSOLETE_RELATIVES)


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _invalid(message: str) -> ProjectionError:
    return ProjectionError(message)


def _decode_source(path: Path, data: bytes) -> str:
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise _invalid(f"invalid UTF-8 source: {path}: {exc}") from exc
    if "\r" in text:
        raise _invalid("source invariant failed: LF line endings required; CR found")
    if "\x00" in text:
        raise _invalid("source invariant failed: NUL is not valid in PERSONA.md")
    for character in text:
        codepoint = ord(character)
        if codepoint < 0x20 and character not in {"\n", "\t"}:
            raise _invalid(
                "source invariant failed: unsupported control character in PERSONA.md"
            )
    if not data.endswith(b"\n"):
        raise _invalid("source invariant failed: exactly one final LF is required")
    return text


def _require_regular_source(path: Path) -> bytes:
    try:
        info = path.lstat()
    except FileNotFoundError as exc:
        raise _invalid(f"source missing: {path}") from exc
    if stat.S_ISLNK(info.st_mode):
        raise _invalid(
            f"source invariant failed: canonical source is a symlink: {path}"
        )
    if not stat.S_ISREG(info.st_mode):
        raise _invalid(
            f"source invariant failed: canonical source is not a regular file: {path}"
        )
    try:
        return path.read_bytes()
    except OSError as exc:
        raise _invalid(f"source unreadable: {path}: {exc}") from exc


def parse_persona(path: Path | None = None) -> PortablePersona:
    """Parse exactly the portable ``name``/``description`` frontmatter contract."""
    resolved = Path(path or source_path())
    data = _require_regular_source(resolved)
    text = _decode_source(resolved, data)
    lines = text.splitlines(keepends=True)
    if not lines or lines[0] != "---\n":
        raise _invalid(
            "source invariant failed: frontmatter must begin with exact '---'"
        )

    close_index: int | None = None
    for index in range(1, len(lines)):
        if lines[index] == "---\n":
            close_index = index
            break
    if close_index is None:
        raise _invalid("source invariant failed: frontmatter closing '---' is missing")

    frontmatter = [line[:-1] for line in lines[1:close_index]]
    if not frontmatter or frontmatter[0] != "name: planner":
        name_line = next(
            (line for line in frontmatter if line.startswith("name:")), None
        )
        if name_line is None:
            raise _invalid("source field 'name' is missing")
        raise _invalid("source field 'name' must equal planner")
    if len(frontmatter) < 2 or frontmatter[1] != "description: >":
        if len(frontmatter) >= 2 and frontmatter[1].startswith("description:"):
            raise _invalid(
                "source field 'description' must use the exact folded scalar '>'"
            )
        unknown = next(
            (line.split(":", 1)[0] for line in frontmatter[1:] if ":" in line),
            "description",
        )
        raise _invalid(f"source field '{unknown}' is unknown or description is missing")

    description_lines: list[str] = []
    for line in frontmatter[2:]:
        if not line.startswith("  "):
            field = line.split(":", 1)[0] if ":" in line else line
            raise _invalid(
                f"source field '{field}' is unknown or description indentation is invalid"
            )
        value = line[2:]
        if not value:
            raise _invalid("source invariant failed: description must be non-empty")
        description_lines.append(value)
    if not description_lines or not any(value.strip() for value in description_lines):
        raise _invalid("source invariant failed: description must be non-empty")

    body_bytes = "".join(lines[close_index + 1 :]).encode("utf-8")
    if not body_bytes:
        raise _invalid("source invariant failed: Markdown body must be non-empty")
    if not body_bytes.endswith(b"\n") or body_bytes.endswith(b"\n\n"):
        raise _invalid("source invariant failed: body must have exactly one final LF")
    body_text = body_bytes.decode("utf-8", errors="strict")
    semantic_body = body_text[1:] if body_text.startswith("\n") else body_text
    if not semantic_body.strip():
        raise _invalid("source invariant failed: Markdown body must be non-empty")

    description = " ".join(value.strip() for value in description_lines)
    return PortablePersona(
        source_path=resolved,
        source_bytes=data,
        source_sha256=_sha256(data),
        description=description,
        description_lines=tuple(description_lines),
        body_bytes=body_bytes,
        body_text=semantic_body,
    )


def _generated_comment(source_sha256: str) -> str:
    return (
        f"# GENERATED from {SOURCE_COMMENT_PATH}; do not edit.\n"
        f"# source-sha256: {source_sha256}\n"
    )


def _yaml_header(persona: PortablePersona) -> bytes:
    lines = [
        "---\n",
        _generated_comment(persona.source_sha256),
        "name: planner\n",
        "description: >\n",
    ]
    lines.extend(f"  {line}\n" for line in persona.description_lines)
    lines.extend(
        [
            'model: "@plan"\n',
            "thinking-level: max\n",
            f"tools: {OMP_TOOLS}\n",
            "read-summarize: false\n",
            "---\n",
        ]
    )
    return "".join(lines).encode("utf-8")


def _grok_header(persona: PortablePersona) -> bytes:
    lines = [
        "---\n",
        _generated_comment(persona.source_sha256),
        "name: planner\n",
        "description: >\n",
    ]
    lines.extend(f"  {line}\n" for line in persona.description_lines)
    lines.extend(
        [
            "prompt_mode: full\n",
            f"model: {GROK_MODEL}\n",
            "permission_mode: default\n",
            "agents_md: true\n",
            f"tools: {GROK_TOOLS}\n",
            "---\n",
        ]
    )
    return "".join(lines).encode("utf-8")


def render_outputs(
    persona: PortablePersona, root: Path | None = None
) -> Mapping[Path, bytes]:
    """Render both native planner agents in stable path order."""
    base = Path(root) if root is not None else persona.source_path.parents[2]
    omp = _yaml_header(persona) + persona.body_bytes
    grok = _grok_header(persona) + persona.body_bytes
    rendered = (omp, grok)
    outputs = output_paths(base)
    return {path: data for path, data in zip(outputs, rendered, strict=True)}


def _root_from_outputs(paths: Iterable[Path]) -> Path:
    first = Path(next(iter(paths)))
    try:
        return first.parent.parent.parent.parent
    except AttributeError as exc:  # pragma: no cover - Path always has parents
        raise _invalid(
            f"output invariant failed: cannot determine root for {first}"
        ) from exc


def _check_parent_chain(root: Path, target: Path) -> None:
    root = root.absolute()
    target = target.absolute()
    try:
        relative_parent = target.parent.relative_to(root)
    except ValueError as exc:
        raise _invalid(
            f"output invariant failed: target escapes canonical root: {target}"
        ) from exc
    try:
        root_info = root.lstat()
    except FileNotFoundError as exc:
        raise _invalid(
            f"output invariant failed: canonical root is missing: {root}"
        ) from exc
    if stat.S_ISLNK(root_info.st_mode) or not stat.S_ISDIR(root_info.st_mode):
        raise _invalid(
            f"output invariant failed: canonical root is not a directory: {root}"
        )
    current = root
    for component in relative_parent.parts:
        current /= component
        try:
            info = current.lstat()
        except FileNotFoundError:
            break
        if stat.S_ISLNK(info.st_mode):
            raise _invalid(f"output parent is a symlink; refusing to follow: {current}")
        if not stat.S_ISDIR(info.st_mode):
            raise _invalid(f"output parent is not a directory: {current}")


def _target_info(path: Path) -> os.stat_result | None:
    try:
        return path.lstat()
    except FileNotFoundError:
        return None


def _preflight_targets(
    root: Path, paths: Iterable[Path]
) -> dict[Path, os.stat_result | None]:
    result: dict[Path, os.stat_result | None] = {}
    for path in paths:
        _check_parent_chain(root, path)
        info = _target_info(path)
        if info is not None:
            if stat.S_ISLNK(info.st_mode):
                raise _invalid(
                    f"output target is a symlink; refusing to follow: {path}"
                )
            if not stat.S_ISREG(info.st_mode):
                raise _invalid(f"output target is not a regular file: {path}")
        result[path] = info
    return result


def _preflight_obsolete(root: Path) -> tuple[Path, ...]:
    present: list[Path] = []
    for path in obsolete_paths(root):
        if _target_info(path) is not None:
            present.append(path)
    return tuple(present)


def _fsync_directory(directory: Path) -> None:
    descriptor = os.open(directory, os.O_RDONLY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def _stage_file(path: Path, data: bytes, mode: int) -> Path:
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.", suffix=".tmp", dir=path.parent
    )
    temporary = Path(temporary_name)
    try:
        os.fchmod(descriptor, mode)
        with os.fdopen(descriptor, "wb") as stream:
            descriptor = -1
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        return temporary
    except BaseException:
        if descriptor >= 0:
            os.close(descriptor)
        temporary.unlink(missing_ok=True)
        raise


def write_outputs(rendered: Mapping[Path, bytes]) -> None:
    """Atomically replace regular outputs after complete preflight."""
    paths = tuple(Path(path) for path in rendered)
    if not paths:
        raise _invalid("output invariant failed: no outputs")
    root = _root_from_outputs(paths)
    obsolete = _preflight_obsolete(root)
    if obsolete:
        joined = ", ".join(str(path) for path in obsolete)
        raise _invalid(f"obsolete output present; refusing mutation: {joined}")
    infos = _preflight_targets(root, paths)
    staged: list[tuple[Path, Path]] = []
    try:
        for path in paths:
            path.parent.mkdir(parents=True, exist_ok=True)
            _check_parent_chain(root, path)
            mode = stat.S_IMODE(infos[path].st_mode) if infos[path] else 0o644
            staged.append((path, _stage_file(path, rendered[path], mode)))
        for path, temporary in staged:
            current = _target_info(path)
            if current is not None and (
                stat.S_ISLNK(current.st_mode) or not stat.S_ISREG(current.st_mode)
            ):
                raise _invalid(f"output target changed during write: {path}")
            os.replace(temporary, path)
            _fsync_directory(path.parent)
    finally:
        for _, temporary in staged:
            temporary.unlink(missing_ok=True)


def _observed_status(path: Path, expected: bytes) -> OutputStatus:
    expected_digest = _sha256(expected)
    info = _target_info(path)
    if info is None:
        return OutputStatus(path, expected_digest, None, "missing")
    if stat.S_ISLNK(info.st_mode):
        return OutputStatus(path, expected_digest, None, "symlink")
    if not stat.S_ISREG(info.st_mode):
        return OutputStatus(path, expected_digest, None, "non-regular")
    try:
        data = path.read_bytes()
    except OSError:
        return OutputStatus(path, expected_digest, None, "unreadable")
    observed = _sha256(data)
    return OutputStatus(
        path, expected_digest, observed, "ok" if data == expected else "stale"
    )


def _report(
    *,
    mode: str,
    persona: PortablePersona,
    statuses: Iterable[OutputStatus],
    ok: bool,
    obsolete: Iterable[Path] = (),
    error: str | None = None,
) -> dict[str, object]:
    result: dict[str, object] = {
        "mode": mode,
        "ok": ok,
        "source": {
            "path": str(persona.source_path),
            "sha256": persona.source_sha256,
        },
        "outputs": [
            {
                "path": str(status.path),
                "expected_sha256": status.expected_sha256,
                "observed_sha256": status.observed_sha256,
                "status": status.status,
            }
            for status in statuses
        ],
        "obsolete": [{"path": str(path), "status": "obsolete"} for path in obsolete],
    }
    if error is not None:
        result["error"] = error
    return result


def _emit(payload: object, *, stream: object = sys.stdout) -> None:
    print(
        json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")),
        file=stream,
    )


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="project.py",
        description="Project the canonical planner persona to three deterministic native outputs.",
        add_help=False,
    )
    parser.add_argument("--help", action="store_true", help="show this help and exit")
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument(
        "--check",
        action="store_true",
        help="compare every expected output without mutation",
    )
    modes.add_argument(
        "--write",
        action="store_true",
        help="atomically write the three canonical outputs",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _parser()
    try:
        args = parser.parse_args(argv)
    except SystemExit as exc:
        return int(exc.code)
    if args.help:
        parser.print_help()
        return 0

    try:
        persona = parse_persona()
        rendered = render_outputs(persona)
        root = project_root()
        obsolete = _preflight_obsolete(root)
        if obsolete:
            statuses = tuple(
                _observed_status(path, rendered[path]) for path in output_paths()
            )
            _emit(
                _report(
                    mode="write"
                    if args.write
                    else "check"
                    if args.check
                    else "dry-run",
                    persona=persona,
                    statuses=statuses,
                    obsolete=obsolete,
                    ok=False,
                    error="obsolete output must be moved to rollback before projection",
                )
            )
            return 1
        if args.write:
            write_outputs(rendered)
            statuses = tuple(
                _observed_status(path, rendered[path]) for path in output_paths()
            )
            ok = all(status.status == "ok" for status in statuses)
            _emit(_report(mode="write", persona=persona, statuses=statuses, ok=ok))
            return 0 if ok else 1
        statuses = tuple(
            _observed_status(path, rendered[path]) for path in output_paths()
        )
        if args.check:
            ok = all(status.status == "ok" for status in statuses)
            _emit(_report(mode="check", persona=persona, statuses=statuses, ok=ok))
            return 0 if ok else 1
        planned = tuple(
            OutputStatus(path, _sha256(rendered[path]), None, "planned")
            for path in output_paths()
        )
        _emit(_report(mode="dry-run", persona=persona, statuses=planned, ok=True))
        return 0
    except ProjectionError as exc:
        _emit(
            {
                "mode": "error",
                "ok": False,
                "source": str(source_path()),
                "error": str(exc),
            },
            stream=sys.stderr,
        )
        return 2
    except OSError as exc:
        _emit(
            {
                "mode": "error",
                "ok": False,
                "source": str(source_path()),
                "error": f"bounded filesystem operation failed: {exc}",
            },
            stream=sys.stderr,
        )
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
