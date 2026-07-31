# Rename Engineering Skills to `dev-*`

**Datetime**: 2026-07-31-0024
**Scope**: Clean-cutover rename of all 19 installed `.config/agents/skills/eng-*` skills and every live identity, discovery, invocation, cross-reference, and evaluation surface to `dev-*`.
**Summary**: Rename the complete engineering skill family from `eng-` to `dev-` without aliases or a mixed namespace. Preserve each skill's behavior and bundled assets while migrating every current caller and proving the old installed identities are gone.
**Status**: DONE

## Context

The approved naming decision is `dev-` across all 19 current `eng-*` skills. The live skill root currently contains exactly those 19 source directories; this plan is the self-contained authority for the separately approved clean cutover that the naming exercise deferred.

The intended end state is one coherent `dev-*` family: directory names and `SKILL.md` frontmatter agree, all live references and invocation/discovery surfaces use the new names, bundled content remains attached to its renamed owner, and no compatibility aliases or duplicate `eng-*` copies remain.

## Tasks

- [x] T1. Rename the 19 skill identities and directories.
  completed 2026-07-31-1022
- [x] T2. Migrate every live caller and discovery surface.
  completed 2026-07-31-1024
- [x] T3. Update evaluation fixtures and deterministic assertions.
  completed 2026-07-31-1026
- [x] T4. Verify the clean cutover and exercised invocation behavior.
  completed 2026-07-31-1037

## Approach

### T1 — Rename the installed skill family

Apply a mechanical one-to-one mapping that preserves every suffix and moves each top-level directory as one intact unit:

Immediately before moving anything, re-enumerate `.config/agents/skills/eng-*` and `.config/agents/skills/dev-*`. Continue only when the source set is exactly the 19 names below and every destination is absent; any extra, missing, or pre-existing destination path makes the approved mapping stale and stops execution before mutation.

- `eng-flow` → `dev-flow`
- `eng-requirements` → `dev-requirements`
- `eng-research` → `dev-research`
- `eng-specification` → `dev-specification`
- `eng-ticketing` → `dev-ticketing`
- `eng-implementation` → `dev-implementation`
- `eng-handoff` → `dev-handoff`
- `eng-verification` → `dev-verification`
- `eng-integration` → `dev-integration`
- `eng-code-review` → `dev-code-review`
- `eng-continual-learning` → `dev-continual-learning`
- `eng-shipping` → `dev-shipping`
- `eng-grilling` → `dev-grilling`
- `eng-domain-modeling` → `dev-domain-modeling`
- `eng-diagnosing-bugs` → `dev-diagnosing-bugs`
- `eng-prototype` → `dev-prototype`
- `eng-codebase-design` → `dev-codebase-design`
- `eng-improve-codebase-architecture` → `dev-improve-codebase-architecture`
- `eng-tdd` → `dev-tdd`

Before the moves, execute the following in one Python Eval cell. It proves the source/destination preflight and writes the exact bundle/evaluation baseline to session-local `local://rename-engineering-skills-to-dev-inventory.json` for T4:

```python
import hashlib
import json
import os
from pathlib import Path

root = Path(".config/agents/skills").resolve()
sources = [
    "eng-flow",
    "eng-requirements",
    "eng-research",
    "eng-specification",
    "eng-ticketing",
    "eng-implementation",
    "eng-handoff",
    "eng-verification",
    "eng-integration",
    "eng-code-review",
    "eng-continual-learning",
    "eng-shipping",
    "eng-grilling",
    "eng-domain-modeling",
    "eng-diagnosing-bugs",
    "eng-prototype",
    "eng-codebase-design",
    "eng-improve-codebase-architecture",
    "eng-tdd",
]
mapping = {old: old.replace("eng-", "dev-", 1) for old in sources}

for name in sources:
    frontmatter = (root / name / "SKILL.md").read_text().split("\n---\n", 1)[0]
    name_lines = [line for line in frontmatter.splitlines() if line.startswith("name:")]
    assert name_lines == [f"name: {name}"], (name, name_lines)
assert {path.name for path in root.glob("eng-*")} == set(sources)
assert all((root / name).is_dir() and not (root / name).is_symlink() for name in sources)
assert all(not os.path.lexists(root / name.replace("eng-", "dev-", 1)) for name in sources)

files = {}
license_sha256 = {}
for name in sources:
    package = root / name
    files[name] = sorted(
        path.relative_to(package).as_posix()
        for path in package.rglob("*")
        if path.is_file() or path.is_symlink()
    )
    license_file = package / "LICENSE.md"
    if license_file.is_file():
        license_sha256[name] = hashlib.sha256(license_file.read_bytes()).hexdigest()
expected_license_owners = {
    "eng-grilling",
    "eng-domain-modeling",
    "eng-diagnosing-bugs",
    "eng-prototype",
    "eng-codebase-design",
    "eng-improve-codebase-architecture",
    "eng-tdd",
}
assert set(license_sha256) == expected_license_owners, set(license_sha256)

repo = Path(".").resolve()
live_files = [path for path in root.rglob("*") if path.is_file()]
live_files.append(Path(".config/agents/rules/plan-impl-spec.md").resolve())
mapped_text_suffixes = {".md", ".json", ".sh", ".txt"}
expected_file_sha256 = {}
for source_path in live_files:
    source_bytes = source_path.read_bytes()
    expected_bytes = source_bytes
    if source_path.suffix in mapped_text_suffixes:
        for old, new in mapping.items():
            expected_bytes = expected_bytes.replace(old.encode(), new.encode())
    relative_parts = list(source_path.relative_to(repo).parts)
    if relative_parts[:3] == [".config", "agents", "skills"] and relative_parts[3] in mapping:
        relative_parts[3] = mapping[relative_parts[3]]
    destination_relative = Path(*relative_parts).as_posix()
    expected_file_sha256[destination_relative] = hashlib.sha256(expected_bytes).hexdigest()

flow_evals = json.loads((root / "eng-flow/evals/evals.json").read_text())
craft_evals = json.loads((root / "craft-skill/evals/evals.json").read_text())
git_index = Path(".git/index")
snapshot = {
    "files": files,
    "license_sha256": license_sha256,
    "expected_file_sha256": expected_file_sha256,
    "flow_eval": {
        "schema_version": flow_evals["schema_version"],
        "case_ids": [case["id"] for case in flow_evals["cases"]],
        "fixture_dirs": {case["id"]: case["fixture_dir"] for case in flow_evals["cases"]},
    },
    "craft_eval_ids": [case["id"] for case in craft_evals["evals"]],
    "git_index_sha256": (
        hashlib.sha256(git_index.read_bytes()).hexdigest()
        if git_index.is_file()
        else None
    ),
}
write(
    "local://rename-engineering-skills-to-dev-inventory.json",
    json.dumps(snapshot, indent=2) + "\n",
)
print({
    "sources": len(sources),
    "bundles": sum(len(paths) for paths in files.values()),
    "licenses": len(license_sha256),
    "flow_eval_cases": len(flow_evals["cases"]),
})
```

T4 must compare each mapped destination against this snapshot so `dev-flow/evals/**`, the seven sibling `LICENSE.md` files, domain templates, design/prototype/TDD references, `dev-diagnosing-bugs/scripts/hitl-loop.template.sh`, and `dev-improve-codebase-architecture/HTML-REPORT.md` cannot be dropped.

In the same Python Eval kernel, run the following second cell to perform plain same-filesystem directory renames without touching the Git index. Five sources (`eng-diagnosing-bugs`, `eng-prototype`, `eng-codebase-design`, `eng-improve-codebase-architecture`, `eng-tdd`) currently contain index-tracked files; the other 14 are nonignored but untracked. Never use `git mv` or copy-plus-delete.

```python
moved = []
try:
    for old in sources:
        new = old.replace("eng-", "dev-", 1)
        source = root / old
        destination = root / new
        assert source.is_dir() and not source.is_symlink(), source
        assert not os.path.lexists(destination), destination
        source.rename(destination)
        moved.append((old, new))
except Exception:
    for old, new in reversed(moved):
        (root / new).rename(root / old)
    for old in sources:
        package = root / old
        restored = sorted(
            path.relative_to(package).as_posix()
            for path in package.rglob("*")
            if path.is_file() or path.is_symlink()
        )
        assert restored == snapshot["files"][old], old
    raise
print({"moved_directories": len(moved)})
```

If a move fails, this cell restores only the completed moves and verifies their preflight bundle inventories before raising. Stop after that failure; do not proceed to frontmatter or callsite edits.

Move the seven existing `LICENSE.md` files byte-for-byte with their owning roots. Their `Source path:` values identify immutable upstream material, not the local package name; do not rewrite them, add licenses to the other 12 skills, or reintroduce provenance into `dev-flow/WORKFLOW.md`.

In every moved root `SKILL.md`, change exactly `name: eng-<listed-suffix>` to `name: dev-<same-suffix>` so the required frontmatter name equals the new directory basename. Do not change descriptions or procedures in this task; T2 owns only the exact current-name references within them. Do not leave alias directories, compatibility wrappers, re-exports, deprecated identities, or duplicate copies.

### T2 — Migrate live references

Apply only the fixed 19-name mapping from T1 to current identity, routing, ownership, and invocation literals. Preserve human-readable titles such as `# Engineering Flow`, generic prose such as “engineering,” and artifact names such as “Engineering Requirements” and “Engineering Specification.” Do not use an unbounded `eng-` → `dev-` text replacement.

Within the moved family, update the current cross-skill literals in these destination files:

- `dev-code-review/SKILL.md`: `eng-implementation`.
- `dev-continual-learning/SKILL.md`: `eng-implementation`.
- `dev-diagnosing-bugs/SKILL.md`: `eng-requirements`, `eng-implementation`, `eng-improve-codebase-architecture`, `eng-handoff`.
- `dev-domain-modeling/ADR-FORMAT.md` and `dev-domain-modeling/CONTEXT-FORMAT.md`: `eng-domain-modeling`.
- `dev-flow/SKILL.md`: `eng-flow`, `eng-requirements`, `eng-diagnosing-bugs`, `eng-implementation`, `eng-grilling`, `eng-research`, `eng-improve-codebase-architecture`, `eng-codebase-design`, `eng-prototype`, `eng-specification`, `eng-ticketing`, `eng-handoff`.
- `dev-grilling/SKILL.md`: `eng-research`, `eng-flow`, `eng-requirements`, `eng-specification`.
- `dev-handoff/SKILL.md`: `eng-implementation`.
- `dev-implementation/SKILL.md`: `eng-flow`, `eng-verification`, `eng-integration`, `eng-code-review`, `eng-continual-learning`, `eng-shipping`.
- `dev-improve-codebase-architecture/SKILL.md`: `eng-flow`, `eng-codebase-design`, `eng-domain-modeling`, `eng-grilling`; `dev-improve-codebase-architecture/HTML-REPORT.md`: `eng-codebase-design`.
- `dev-integration/SKILL.md`: `eng-verification`, `eng-handoff`.
- `dev-prototype/SKILL.md`: `eng-requirements`, `eng-grilling`, `eng-specification`.
- `dev-requirements/SKILL.md`: `eng-research`, `eng-grilling`, `eng-domain-modeling`, `eng-prototype`, `eng-specification`, `eng-flow`.
- `dev-specification/SKILL.md`: `eng-ticketing`, `eng-flow`, `eng-domain-modeling`.
- `dev-ticketing/SKILL.md`: `eng-implementation`, `eng-flow`.
- `dev-verification/SKILL.md`: `eng-implementation`, `eng-integration`, `eng-handoff`.

Rewrite `dev-flow/WORKFLOW.md` as the live ownership index: change every visible family label to `dev-*`; change all 18 sibling targets from `../eng-<suffix>/SKILL.md` to `../dev-<suffix>/SKILL.md`; keep the local `SKILL.md` target for `dev-flow` unchanged. Same-directory links and bundled-file links move with their parent and must not be rewritten.

Migrate the three current non-family callers in the same cutover:

- `.config/agents/skills/wayfinder/SKILL.md`: `eng-flow`, `eng-research`, `eng-prototype`, `eng-grilling`, `eng-domain-modeling`, `eng-requirements`, and `eng-specification`.
- `.config/agents/skills/grill-with-docs/SKILL.md`: `eng-flow`, `eng-grilling`, and `eng-domain-modeling`.
- `.config/agents/skills/grill-me/SKILL.md`: `eng-flow` and `eng-grilling`.

Update the only live non-skill callsite, `.config/agents/rules/plan-impl-spec.md`, by changing exactly `eng-tdd`, `eng-diagnosing-bugs`, `eng-codebase-design`, `eng-prototype`, `eng-improve-codebase-architecture`, `eng-grilling`, and `eng-domain-modeling` to their `dev-*` mappings on the “Skill outcomes to capture” line.

No identity-specific edit belongs in `manifest`, `.config/scripts/bootstrap`, `bin/dot-add`, README, `.config/agents/AGENTS.md`, harness configs, extensions, hooks, or caches: those surfaces either bind the whole `.config/agents` root or contain no mapped literal. Keep the existing `/Users/kim/.agents` → `.config/agents` and `.grok/skills` → `../.config/agents/skills` symlinks unchanged; both consume the renamed canonical tree.

The current non-evaluation skill tree contains no historical/provenance use of these 19 literals: every match in this declared file set is live and must migrate. `craft-name`, `craft-rule`, `improve`, `mnemopi-cleanup`, and `mnemopi-retain` currently contain no matching literal and remain unchanged.

### T3 — Migrate evaluations

Keep `.config/agents/skills/dev-flow/evals/` inside the moved `dev-flow` root; do not copy it, rename case IDs, rename fixture directories, or create a second evaluator tree.

In `dev-flow/evals/evals.json`, apply the fixed 19-name mapping to string values only:

- change root metadata exactly from `"skill_name": "eng-flow"` to `"skill_name": "dev-flow"`;
- migrate every mapped literal in `inputs.request`;
- migrate mapped identities in `expected.first_owner`, `expected.owners`, `expected.route`, `expected.artifacts`, and `expected.outcome`;
- migrate mapped identity fragments in structured event/state strings, including `dispatch:eng-*` and `owner:eng-*`.

Preserve `schema_version`, all case IDs, layer names, `fixture_dir` values, capability names, event kinds, rubrics, repetition tiers, `scripted_replies`, and identity-free expectations. In particular, preserve the live fixture outputs `counter.txt: \"2\\n\"` and `message.txt: \"HELLO WORKFLOW\\n\"`.

Apply the same fixed mapping to active string values in the paired `case.json` inputs under these moved fixture directories:

- Backend: `b-authority`, `b-batch-near-miss-dependent-concurrency`, `b-completion`, `b-full`, `b-handoff`, `b-integrate`, `b-learning`, `b-review`, `b-shipping`, `b-verify`.
- Live: `l-routing`, `l-mutation`, `l-one-owner`, `l-delegation`, `l-full`.
- Router: `r-direct-near-miss`, `r-research`, `r-research-near-miss`, `r-product-authority`, `r-product-authority-near-miss`, `r-requirements`, `r-requirements-near-miss`, `r-bug`, `r-bug-near-miss`, `r-grill`, `r-grill-near-miss`, `r-wayfinder`, `r-wayfinder-near-miss`, `r-architecture`, `r-artifact-lane`, `r-explicit-stage`, `r-approval`, `r-drift`, `r-drift-near-miss`, `r-complete-near-miss`.

Do not touch identity-free fixture `case.json` files or fixture assets. Their unchanged relative `fixture_dir` paths continue resolving after the parent move.

Update `.config/agents/skills/craft-skill/evals/evals.json` eval ID `4` only: change `runs eng-grilling` to `runs dev-grilling` and `full eng-grilling procedure` to `full dev-grilling procedure`; preserve the ID and its remaining assertions.

No current evaluation runner, schema file, snapshot, or digest artifact exists. Do not recreate the archived runner or invent digest regeneration for this identity-only migration.

### T4 — Verify the cutover

Do not start discovery or evaluation while any mixed namespace remains. After T1–T3 are complete, run the static identity, bundle, link, callsite, and evaluation checks below from `/Users/kim/.dotfiles`, then launch fresh OMP and Grok processes; sessions started before the rename hold stale discovery state and are not evidence.

The cutover passes only when both harnesses discover the `dev-*` family from the existing canonical symlinked root, `dev-flow` loads and exercises its unchanged read-only routing interface, and `eng-flow` no longer resolves. An old identity that still resolves is a collision/stale-provider failure, never permission to add an alias.

Do not stage, commit, push, archive a plan, run bootstrap, or perform any delivery action as part of this implementation.

## Critical files & anchors

- `.config/agents/skills/eng-flow/{SKILL.md,WORKFLOW.md,evals/evals.json}` — central source identity, complete live ownership-link graph, and declarative router/backend/live expectation matrix; all move under `dev-flow`.
- `.config/agents/skills/{wayfinder,grill-me,grill-with-docs}/SKILL.md` — current non-family callers whose activation and delegation literals must move in the same cutover.
- `.config/agents/rules/plan-impl-spec.md` — sole live repository callsite outside the skill root; its “Skill outcomes to capture” identities must become `dev-*`.
- `.config/agents/skills/craft-skill/evals/evals.json` — eval ID `4` independently asserts the `eng-grilling` wrapper boundary and must assert `dev-grilling`.
- `.config/scripts/bootstrap:21-37` — whole-root `.config/agents` → `~/.agents` installation seam; verify the existing link, but do not edit or execute bootstrap.

## Verification / Done criteria

Run every check from `/Users/kim/.dotfiles`.

- [x] **Static namespace, bundle, link, and evaluation contract.** Reset the Python Eval kernel after T1–T3, then execute the following in one cell. Expected: it prints the final summary without assertion failure.

  ```python
  import hashlib
  import json
  import re
  from pathlib import Path

  mapping = {
      "eng-flow": "dev-flow",
      "eng-requirements": "dev-requirements",
      "eng-research": "dev-research",
      "eng-specification": "dev-specification",
      "eng-ticketing": "dev-ticketing",
      "eng-implementation": "dev-implementation",
      "eng-handoff": "dev-handoff",
      "eng-verification": "dev-verification",
      "eng-integration": "dev-integration",
      "eng-code-review": "dev-code-review",
      "eng-continual-learning": "dev-continual-learning",
      "eng-shipping": "dev-shipping",
      "eng-grilling": "dev-grilling",
      "eng-domain-modeling": "dev-domain-modeling",
      "eng-diagnosing-bugs": "dev-diagnosing-bugs",
      "eng-prototype": "dev-prototype",
      "eng-codebase-design": "dev-codebase-design",
      "eng-improve-codebase-architecture": "dev-improve-codebase-architecture",
      "eng-tdd": "dev-tdd",
  }
  root = Path(".config/agents/skills").resolve()
  repo = Path(".").resolve()
  snapshot = json.loads(read("local://rename-engineering-skills-to-dev-inventory.json"))
  git_index = Path(".git/index")
  current_index_sha256 = (
      hashlib.sha256(git_index.read_bytes()).hexdigest()
      if git_index.is_file()
      else None
  )
  assert current_index_sha256 == snapshot["git_index_sha256"]
  found_old = {path.name for path in root.glob("eng-*")}
  found_new = {path.name for path in root.glob("dev-*")}
  assert not found_old, found_old
  assert found_new == set(mapping.values()), found_new ^ set(mapping.values())

  for old, new in mapping.items():
      package = root / new
      actual_files = sorted(
          path.relative_to(package).as_posix()
          for path in package.rglob("*")
          if path.is_file() or path.is_symlink()
      )
      assert actual_files == snapshot["files"][old], (old, actual_files, snapshot["files"][old])
      frontmatter = (package / "SKILL.md").read_text().split("\n---\n", 1)[0]
      assert re.search(rf"(?m)^name:\s*{re.escape(new)}\s*$", frontmatter), new
      if old in snapshot["license_sha256"]:
          license_digest = hashlib.sha256((package / "LICENSE.md").read_bytes()).hexdigest()
          assert license_digest == snapshot["license_sha256"][old], old

  live_text = [
      path for path in root.rglob("*")
      if path.is_file() and path.suffix in {".md", ".json", ".sh", ".txt"}
  ]
  live_text.append(Path(".config/agents/rules/plan-impl-spec.md"))
  stale = {
      str(path): [old for old in mapping if old in path.read_text()]
      for path in live_text
      if any(old in path.read_text() for old in mapping)
  }
  assert not stale, stale

  actual_live_file_paths = {
      path.relative_to(repo).as_posix()
      for path in root.rglob("*")
      if path.is_file()
  }
  actual_live_file_paths.add(
      Path(".config/agents/rules/plan-impl-spec.md").resolve().relative_to(repo).as_posix()
  )
  assert actual_live_file_paths == set(snapshot["expected_file_sha256"]), (
      actual_live_file_paths ^ set(snapshot["expected_file_sha256"])
  )

  for relative_path, expected_digest in snapshot["expected_file_sha256"].items():
      transformed_path = Path(relative_path)
      assert transformed_path.is_file(), transformed_path
      actual_digest = hashlib.sha256(transformed_path.read_bytes()).hexdigest()
      assert actual_digest == expected_digest, relative_path

  workflow = root / "dev-flow" / "WORKFLOW.md"
  links = re.findall(r"\[[^\]]+\]\(([^)]+)\)", workflow.read_text())
  local_links = [
      link.split("#", 1)[0]
      for link in links
      if "://" not in link and not link.startswith("#")
  ]
  targets = {(workflow.parent / link).resolve() for link in local_links}
  expected_workflow_targets = {
      (root / name / "SKILL.md").resolve() for name in mapping.values()
  }
  assert targets == expected_workflow_targets, targets ^ expected_workflow_targets
  assert links and all(target.is_file() for target in targets), targets
  assert all(target.is_relative_to(root) for target in targets), targets

  eval_root = root / "dev-flow" / "evals"
  matrix = json.loads((eval_root / "evals.json").read_text())
  assert matrix["schema_version"] == snapshot["flow_eval"]["schema_version"] == 1
  assert matrix["skill_name"] == "dev-flow"
  assert [case["id"] for case in matrix["cases"]] == snapshot["flow_eval"]["case_ids"]
  assert {
      case["id"]: case["fixture_dir"] for case in matrix["cases"]
  } == snapshot["flow_eval"]["fixture_dirs"]
  for case in matrix["cases"]:
      fixture = json.loads((eval_root / case["fixture_dir"] / "case.json").read_text())
      assert fixture["inputs"] == case["inputs"], case["id"]
      assert fixture.get("scripted_replies", []) == case.get("scripted_replies", []), case["id"]

  craft_evals = json.loads(Path(".config/agents/skills/craft-skill/evals/evals.json").read_text())
  craft_case = next(case for case in craft_evals["evals"] if case["id"] == 4)
  assert [case["id"] for case in craft_evals["evals"]] == snapshot["craft_eval_ids"]
  craft_case_text = json.dumps(craft_case)
  assert "dev-grilling" in craft_case_text and "eng-grilling" not in craft_case_text
  print({
      "dev_directories": len(found_new),
      "old_directories": 0,
      "resolved_workflow_links": len(local_links),
      "eval_cases": len(matrix["cases"]),
      "stale_live_identities": 0,
  })
  ```

- [x] **External live callsite cutover.** Use the repository `grep` tool with pattern `eng-[a-z0-9-]+` over `.config/agents/skills;.config/agents/rules;.config/agents/harnesses;.config/agents/hooks;.config/scripts;bin;README.md;manifest`. Expected: zero matches. Deliberately exclude `.agents/plans/**`, `.scratch/**`, and `archive/**`; those are planning or historical evidence, not live discovery surfaces.
- [x] **Installed-root identity.** Run `realpath "$HOME/.agents"` and `realpath .grok/skills`. Expected outputs are `/Users/kim/.dotfiles/.config/agents` and `/Users/kim/.dotfiles/.config/agents/skills`, respectively. A mismatch blocks verification; do not run bootstrap to repair it within this task.
- [x] **Fresh Grok inventory.** Execute the following in a new JavaScript Eval cell. `--no-auto-update` is required even though this installed version omits the hidden flag from `--help`; the official headless CLI contract and the local parser both support it. Expected: the cell prints `{ newProjectSkills: 19, oldSkills: 0 }`.

  ```js
  const expectedGrokOld = new Set([
    "eng-flow", "eng-requirements", "eng-research", "eng-specification",
    "eng-ticketing", "eng-implementation", "eng-handoff", "eng-verification",
    "eng-integration", "eng-code-review", "eng-continual-learning",
    "eng-shipping", "eng-grilling", "eng-domain-modeling",
    "eng-diagnosing-bugs", "eng-prototype", "eng-codebase-design",
    "eng-improve-codebase-architecture", "eng-tdd",
  ]);
  const expectedGrokNew = new Set(
    [...expectedGrokOld].map((name) => name.replace("eng-", "dev-")),
  );
  const grokInspection = Bun.spawn(
    ["grok", "--no-auto-update", "inspect", "--json"],
    {
      cwd: "/Users/kim/.dotfiles",
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const [grokStdout, grokStderr, grokExitCode] = await Promise.all([
    new Response(grokInspection.stdout).text(),
    new Response(grokInspection.stderr).text(),
    grokInspection.exited,
  ]);
  if (grokExitCode !== 0) throw new Error(grokStderr);
  const grokInventory = JSON.parse(grokStdout);
  const newProjectSkills = new Set(
    grokInventory.skills
      .filter((skill) => expectedGrokNew.has(skill.name) && skill.source?.type === "project")
      .map((skill) => skill.name),
  );
  const oldSkills = grokInventory.skills
    .filter((skill) => expectedGrokOld.has(skill.name))
    .map((skill) => `${skill.name}:${skill.source?.type}`);
  if (
    newProjectSkills.size !== expectedGrokNew.size
    || [...expectedGrokNew].some((name) => !newProjectSkills.has(name))
  ) {
    throw new Error(`missing/colliding dev skills: ${[...newProjectSkills]}`);
  }
  if (oldSkills.length) throw new Error(`old skills still resolve: ${oldSkills}`);
  console.log({ newProjectSkills: newProjectSkills.size, oldSkills: 0 });
  ```
- [x] **Fresh OMP session invocation smoke.** Run:

  ```sh
  omp -p --no-session --tools=read --skills=dev-flow --max-time=5m \
    "/skill:dev-flow Route this bounded read-only request: identify the H1 heading in README.md. Emit only the seven-field Route Overview and request approval; do not answer or mutate."
  ```

  Expected: the command loads `dev-flow` and returns exactly the router fields `Goal`, `Route`, `Why`, `Artifacts`, `Gates`, `Execution`, and `First action`, with an approval request and no working-tree mutation. This user-authorized 2026-07-31 replacement for the non-session `omp read` loop uses the static namespace/hash contract and fresh Grok all-19 inventory for family-wide identity proof.

- [x] **Read-only Grok invocation smoke.** Run:

  ```sh
  grok --no-auto-update --cwd /Users/kim/.dotfiles --no-plan --no-memory \
    --no-subagents --disable-web-search --permission-mode dontAsk \
    --tools 'read_file,grep,list_dir' --deny 'Bash' --deny 'Edit' \
    --deny 'Write' --deny 'MCPTool' --deny 'WebFetch' --deny 'WebSearch' \
    --max-turns 1 --single \
    "/dev-flow Route this bounded read-only request: identify the H1 heading in README.md. Emit only the seven-field Route Overview and request approval; do not answer or mutate."
  ```

  Expected: the command loads the project `dev-flow` skill and returns the same seven Route Overview fields with no working-tree mutation.
- [x] **Scope preservation.** Reset and re-run the static Python verification cell after both harness smokes. Require the same passing output, unchanged Git-index digest, exact expected hashes for every file under `.config/agents/skills` plus `plan-impl-spec.md`, byte-identical licenses, unchanged evaluator structure, no old directory/compatibility surface, and no staging or shipping.

Do not run the archived full semantic matrix: its runner/schema material is absent, and the rename adds no behavioral contract beyond identity, discovery, and invocation.

## Assumptions & contingencies

- The approved surface is exactly all 19 mapped skills. Immediately re-run the source/destination/frontmatter preflight and the live-scope old-name search before mutation. A changed directory/frontmatter identity makes the plan stale and stops execution; a newly added live callsite containing one of the same 19 old literals uses the fixed mapping and joins T2/T3 without a new naming decision.
- `dev-*` changes the installed namespace, not the domain language. Preserve “Engineering” headings, generic engineering prose, contract names, case IDs, behavior, and descriptions except where a description contains an exact migrated skill identity.
- Planning and historical evidence under `.agents/plans/**`, `.scratch/**`, and `archive/**` intentionally retains pre-cutover names. Do not mechanically rewrite or use those matches as aliases; only the governing plan’s normal status/task/completion lifecycle may update its own artifact.
- The current installation links are `/Users/kim/.agents` → `/Users/kim/.dotfiles/.config/agents` and `.grok/skills` → `../.config/agents/skills`. If either link no longer resolves to the canonical source at verification time, stop with the observed mismatch; running bootstrap or modifying system links is separate authority.
- If a fresh harness still discovers an old name or reports a `dev-*` collision, identify the higher-priority or stale provider from fresh discovery output and stop. Do not mutate user/provider locations outside this repository, change precedence, or add an alias.
- The two live invocation smokes require the already configured OMP and Grok authentication. If either provider is unavailable, complete all deterministic checks but leave T4 blocked with the exact authentication/capability prerequisite; static discovery is not equivalent to exercised invocation.
- A normal Grok `--single` smoke writes a session record under `~/.grok/sessions`; v0.2.114 has no `--no-session` control. This harness-owned verification artifact is accepted, while `--no-auto-update`, `--no-memory`, `--no-subagents`, the read-only tool allowlist, and explicit denies prevent update, memory, delegated, web/MCP, command, or working-tree mutation. Do not delete the session artifact as cleanup.
- This plan authorizes working-tree renames and content edits only. It does not authorize staging, commit, push, plan archival, release, deployment, or any other shipping action.

## Completion Summary

- Delivered: Renamed all 19 installed `eng-*` skills to `dev-*`; migrated live callers, workflow links, and evaluations without aliases or duplicate roots.
- Verification: Static bundle/hash contract passed twice; live old-identity grep returned no matches; both installed roots resolve to the canonical tree; Grok discovered all 19 project `dev-*` skills and no `eng-*`; OMP and Grok `dev-flow` read-only invocation smokes returned the required Route Overview and approval request.
- User override (2026-07-31): Replaced the non-session OMP `read` all-identity loop, which returned `Available: none`, with the session-native OMP smoke plus static family-wide proof and Grok’s all-19 inventory.
- Residual risk: OMP has no observed deterministic non-session skill-inventory path; its family-wide identity proof is static plus Grok inventory, while OMP runtime coverage exercised `dev-flow`.
