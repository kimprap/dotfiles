# Rename the Development Workflow Interface Skill

**Datetime**: 2026-07-31-1231
**Scope**: Select and cleanly cut over the single public interface skill for the `dev-*` end-to-end workflow, currently `dev-flow`, to the new `<workflow>-<interface>` convention.
**Summary**: Run a dedicated interactive naming task with `dev-ask` as the leading pattern, then rename only the selected development-workflow interface identity and every live caller, route, evaluation, discovery, and invocation surface. Preserve the workflow behavior, the other 18 `dev-*` skill identities, and all bundled assets without aliases or mixed identities.
**Status**: DONE

## Context

The user wants one consistently named interface skill per future end-to-end workflow, such as a development interface and later a marketing interface, with a shared suffix convention exemplified by `dev-ask` and `marketing-ask`. The current development interface is `.config/agents/skills/dev-flow`; the intended end state is one user-selected replacement identity, no live `dev-flow` compatibility surface, and unchanged routing behavior behind that renamed interface.

## Tasks

- [x] T1. Interactively select the interface naming convention.
  completed 2026-07-31-1259
  selected_interface_name: dev-ask
  selected_interface_suffix: ask
- [x] T2. Preflight and rename the selected interface package.
  completed 2026-07-31-1302
- [x] T3. Migrate every live caller and route identity.
  completed 2026-07-31-1303
- [x] T4. Migrate evaluation identities without structural churn.
  completed 2026-07-31-1305
- [x] T5. Verify the clean cutover in static and fresh harness surfaces.
  completed 2026-07-31-1309

## Approach

### T1 — Select the workflow-interface convention

Run `craft-name` as a dedicated human-gated naming task before any repository mutation. The naming target is the shared suffix in `<workflow>-<interface-suffix>`: the selected suffix must read coherently in both `dev-<suffix>` and a future sibling such as `marketing-<suffix>`, identify the one public request/entry seam rather than an internal stage, and remain lowercase kebab-case with no leading, trailing, or consecutive hyphen.

Present this exact first-pass shortlist with `dev-ask` as the recommendation and one concise tradeoff per candidate:

- `dev-ask` / `marketing-ask` — recommended; names the user-facing request seam without implying that approval or execution is automatic.
- `dev-request` / `marketing-request` — literal and portable, but reads more like an input artifact than the interface receiving it.
- `dev-route` / `marketing-route` — precise for classification and first dispatch, but understates completion presentation.
- `dev-entry` / `marketing-entry` — accurately names the external seam, but is less natural as a slash-command phrase.
- `dev-intake` / `marketing-intake` — clearly approval-safe and domain-neutral, but emphasizes the beginning more than the return path.
- `dev-guide` / `marketing-guide` — approachable and reusable, but can sound advisory rather than authoritative routing.
- `dev-portal` / `marketing-portal` — strong shared-entry metaphor, but sounds more like a UI or service surface than a skill.
- `dev-frontdoor` / `marketing-frontdoor` — explicit seam metaphor, but less minimal and more idiomatic than the other candidates.

Ask the user to choose a candidate, select two or three finalists for a narrower pass, or request one named direction such as shorter, more literal, or more symbolic. If the user requests a narrower pass, retain the stated direction and present 3–5 candidates; repeat only while the user is refining a real naming dimension. End with one explicit final full development identity and derived suffix.

Before accepting the choice, verify that the full development identity matches `^dev-[a-z0-9]+(?:-[a-z0-9]+)*$`, is at most 64 characters, and has no corresponding `.config/agents/skills/<selected-name>` path or installed `SKILL.md` declaration. Validate the sibling example by composing `marketing-<selected_interface_suffix>` and applying the same kebab-case/64-character contract. A user-proposed name outside the shortlist is valid if it passes this contract and preserves the shared suffix convention. A collision or invalid spelling returns the exact conflict to the user and leaves T1 incomplete; do not alter the name or choose a fallback. After explicit selection, update the T1 checklist entry in this plan with the normal completion timestamp followed by indented lines `selected_interface_name: <exact-name>` and `selected_interface_suffix: <exact-suffix>`. T2–T5 read those fixed values and cannot begin before both lines exist.

### T2 — Preflight and rename the selected interface package

Run from `/Users/kim/.dotfiles` after T1 records `selected_interface_name`. Before mutation, assert all of the following in one Python Eval cell:

- `.config/agents/skills/dev-flow` is a real directory, not a symlink; its `SKILL.md` frontmatter contains exactly one `name:` line and it is `name: dev-flow`.
- `.config/agents/skills/<selected_interface_name>` does not exist even as a broken symlink (`os.path.lexists`).
- The exact selected identity has zero pre-existing matches in the same declared live text scope used below; any match is a collision and returns to T1 for a different explicit choice before mutation.
- Deduplicate manifests by resolved path and require the selected name to be absent across the current OMP provider roots `/Users/kim/.omp/agent/skills`, `/Users/kim/.agents/skills`, repository `.omp/skills`, `.agents/skills`, `.agent/skills`, user/repository `.claude/skills`, `.codex/skills`, `.gemini/skills`, repository `.github/skills`, user/repository OpenCode skill roots, and `/Users/kim/.omp/plugins/node_modules`; also require `grok --no-auto-update inspect --json` to contain no selected-name skill. A provider collision returns to T1 and never becomes an alias or precedence workaround.
- The source package contains exactly the current 64 file-or-symlink relative paths: `SKILL.md`, `WORKFLOW.md`, `evals/evals.json`, 54 `evals/fixtures/*/case.json` files, and the seven existing live fixture assets under `l-routing`, `l-mutation`, `l-one-owner`, `l-delegation`, and `l-full`.
- Exact `dev-flow` identity lookup over the live scopes `.config/agents/skills`, `.config/agents/rules`, `.config/agents/harnesses`, `.config/agents/hooks`, `.config/scripts`, `bin`, `README.md`, and `manifest`, limited to `.md`, `.json`, `.sh`, and `.txt` plus the extensionless `manifest`, is captured before mutation. The observed baseline is 117 occurrences in 29 files; if new matches exist in these same live scopes, include them in the transform snapshot. Exclude `.agents/plans/**`, `.scratch/**`, `archive/**`, and every other historical or cached surface.

Write the preflight to session-local `local://rename-dev-flow-interface-inventory.json` with these exact top-level keys: `selected_interface_name`; `selected_interface_suffix`; `skill_identities` (directory basename → frontmatter name for every installed skill); `package_files` (sorted 64-path list); `package_sha256` (source-package relative path → raw digest); `fixture_asset_sha256`; `live_match_files` (repository-relative source path → exact old-identity occurrence count); `expected_file_sha256` (final repository-relative path → digest after the exact identity transform, covering all 64 destination-package files and every external matched file); `flow_eval` with `schema_version`, ordered `case_ids`, `fixture_dirs`, `additional_files`, `inputs`, `scripted_replies`, and `identity_occurrences`; and `git_index_sha256` (digest or `null`). This snapshot is the sole identity-transform baseline for T2–T5.

In one Python Eval transaction, save the original `SKILL.md` bytes, move the entire source root with same-filesystem `Path.rename` to `.config/agents/skills/<selected_interface_name>`, and change only the frontmatter line `name: dev-flow` to `name: <selected_interface_name>`. Keep a `moved` flag; on any exception, restore the original `SKILL.md` bytes at whichever root currently owns them, rename the destination back to `dev-flow` when moved, compare the restored 64-path inventory and package digests with the snapshot, and then re-raise. Never use `git mv`, copy-plus-delete, an alias, a wrapper, or a second root. Preserve the description, `# Engineering Flow` heading, generic “engineering flow” terminology, procedure, file layout, fixture directories, and fixture assets.

Before T3, verify that the old directory is absent, the selected directory exists as a real directory, its 64 relative paths match the snapshot, the selected frontmatter name equals the directory basename, and all seven fixture assets retain their preflight digests. Do not start harness discovery while old identity literals remain in the moved package or callers.

### T3 — Migrate live callers and route identities

Apply only the exact literal mapping `dev-flow` → `<selected_interface_name>` to current identity, ownership, dispatch, return-route, and invocation strings. Do not replace generic `flow`, rename the human-readable `Engineering Flow` title, alter the other 18 `dev-*` identities, or change route semantics.

Inside the moved package, update the four remaining exact self-references in `SKILL.md` after T2’s frontmatter edit and the four exact labels in `WORKFLOW.md`; retain same-directory links such as `(SKILL.md)` and every sibling link to `../dev-*/SKILL.md` unchanged. Migrate all 14 current external occurrences in these nine callers:

- `.config/agents/skills/dev-grilling/SKILL.md`
- `.config/agents/skills/dev-implementation/SKILL.md`
- `.config/agents/skills/dev-improve-codebase-architecture/SKILL.md`
- `.config/agents/skills/dev-requirements/SKILL.md`
- `.config/agents/skills/dev-specification/SKILL.md`
- `.config/agents/skills/dev-ticketing/SKILL.md`
- `.config/agents/skills/grill-me/SKILL.md`
- `.config/agents/skills/grill-with-docs/SKILL.md`
- `.config/agents/skills/wayfinder/SKILL.md`

The exact execution-time lookup is the preflight live-scope scan from T2; any additional exact `dev-flow` match discovered there joins this fixed mapping, while a match outside those scopes remains untouched as historical/cache evidence. After editing, require zero `dev-flow` matches in the non-evaluation live text and compare every changed non-evaluation file against its expected transformed SHA-256 from the snapshot before T4.

### T4 — Migrate evaluation identities without structural churn

Keep `evals/` inside the moved interface root. Parse `evals/evals.json` and all 54 paired `case.json` files, first asserting that no JSON key contains `dev-flow` and that every occurrence is inside a string value; then apply the exact UTF-8 byte replacement without JSON reserialization so whitespace, ordering, and all unrelated bytes remain stable. In the manifest, require root metadata to change from `"skill_name": "dev-flow"` to `"skill_name": "<selected_interface_name>"`. The current 75 manifest occurrences are in `skill_name`, `expected.owners`, `expected.route`, `expected.outcome`, `expected.artifacts`, `required_events`, and `inputs.request`: one root token, 25 owner tokens, 25 route tokens, three outcome tokens, one artifact token, one required-event token, and 19 request tokens. They occur across 27 ordered cases: `R-DIRECT-NEAR-MISS`, `R-RESEARCH`, `R-PRODUCT-AUTHORITY`, `R-PRODUCT-AUTHORITY-NEAR-MISS`, `R-REQUIREMENTS`, `R-REQUIREMENTS-NEAR-MISS`, `R-BUG`, `R-BUG-NEAR-MISS`, `R-GRILL`, `R-GRILL-NEAR-MISS`, `R-WAYFINDER`, `R-WAYFINDER-NEAR-MISS`, `R-PROTOTYPE-NEAR-MISS`, `R-ARCHITECTURE`, `R-ARCHITECTURE-NEAR-MISS`, `R-ARTIFACT-LANE`, `R-ARTIFACT-LANE-NEAR-MISS`, `R-EXPLICIT-STAGE`, `R-APPROVAL`, `R-DRIFT-NEAR-MISS`, `R-COMPLETE-NEAR-MISS`, `B-COMPLETION`, `L-ROUTING`, `L-MUTATION`, `L-ONE-OWNER`, `L-DELEGATION`, and `L-FULL`.

Apply the exact mapping to active string values in the paired `case.json` inputs for these 17 fixture directories: `r-direct-near-miss`, `r-research`, `r-product-authority`, `r-product-authority-near-miss`, `r-requirements`, `r-requirements-near-miss`, `r-bug`, `r-grill`, `r-wayfinder`, `r-architecture`, `r-artifact-lane`, `r-complete-near-miss`, `l-routing`, `l-mutation`, `l-one-owner`, `l-delegation`, and `l-full`. Do not edit identity-free fixture files or any fixture asset.

Preserve `schema_version: 1`, all case IDs, layer names, `fixture_dir` values, fixture `additional_files`, capability names, event kinds, rubrics, repetition tiers, expected routes other than their interface identity, `scripted_replies`, and fixture outputs. No evaluation runner, schema program, snapshot, or digest artifact exists under the current evaluator root; do not invent one. Before T5, require the selected-identity occurrence count in evaluation content to equal `flow_eval.identity_occurrences` (currently 94: 75 in `evals.json` and 19 in the 17 enumerated fixtures), zero `dev-flow` matches in the entire live scope, exact expected transformed hashes for every affected evaluation file, identical ordered case IDs and fixture maps, matrix-to-fixture equality for `inputs` and `scripted_replies`, fixture `additional_files` equality with the snapshot, and successful resolution of every declared asset within its fixture directory.

### T5 — Verify the static and fresh-harness cutover

Run the static snapshot contract first. Continue to harness discovery only when the selected root/frontmatter, all expected transformed hashes, route links, evaluation pairings, fixture assets, sibling identities, zero-old-name scan, and unchanged Git-index digest pass together.

Confirm the existing installation seams still resolve `/Users/kim/.agents` to `/Users/kim/.dotfiles/.config/agents` and `.grok/skills` to `/Users/kim/.dotfiles/.config/agents/skills`; a mismatch blocks verification and does not authorize bootstrap or symlink repair.

Start fresh OMP and Grok processes because sessions created before the rename retain stale discovery state. Prove the selected identity appears without a collision, the old `dev-flow` identity is absent from fresh inventory, and the selected interface returns the unchanged seven-field Route Overview plus an approval request for a bounded read-only prompt. Do not stage, commit, push, archive a plan, run bootstrap, or perform any delivery action.

## Critical files & anchors

- `.config/agents/skills/dev-flow/SKILL.md` — current external interface identity and seven-field routing contract.
- `.config/agents/skills/dev-flow/WORKFLOW.md` — ownership index and public seam documentation that moves with the selected interface root.
- `.config/agents/skills/dev-flow/evals/evals.json` — current 54-case router/backend/live contract matrix.
- `.config/agents/skills/dev-implementation/SKILL.md` — highest-density external caller: escalation, terminal-evidence return, and completion-presentation re-entry all name the interface.
- `.config/scripts/bootstrap` — identity-neutral parent installation seam; verify its existing symlink result but do not edit or execute it.

## Verification

Run every check from `/Users/kim/.dotfiles`, substituting the exact T1 value for `<selected_interface_name>`.

1. Reset the Python Eval kernel and run one static verification cell:

   ```python
   import hashlib
   import json
   import os
   import re
   from pathlib import Path

   repo = Path(".").resolve()
   skills = repo / ".config/agents/skills"
   snapshot = json.loads(read("local://rename-dev-flow-interface-inventory.json"))
   selected = snapshot["selected_interface_name"]
   package = skills / selected

   assert not os.path.lexists(skills / "dev-flow")
   assert package.is_dir() and not package.is_symlink()

   def frontmatter_name(skill_dir):
       frontmatter = (skill_dir / "SKILL.md").read_text().split("\n---\n", 1)[0]
       names = [line.split(":", 1)[1].strip() for line in frontmatter.splitlines() if line.startswith("name:")]
       assert len(names) == 1, (skill_dir, names)
       return names[0]

   actual_identities = {
       path.name: frontmatter_name(path)
       for path in skills.iterdir()
       if path.is_dir() and (path / "SKILL.md").is_file()
   }
   expected_identities = dict(snapshot["skill_identities"])
   assert expected_identities.pop("dev-flow") == "dev-flow"
   expected_identities[selected] = selected
   assert actual_identities == expected_identities

   actual_package_files = sorted(
       path.relative_to(package).as_posix()
       for path in package.rglob("*")
       if path.is_file() or path.is_symlink()
   )
   assert actual_package_files == snapshot["package_files"]
   for relative_path, expected_digest in snapshot["expected_file_sha256"].items():
       path = repo / relative_path
       assert path.is_file(), path
       assert hashlib.sha256(path.read_bytes()).hexdigest() == expected_digest, relative_path
   for relative_path, expected_digest in snapshot["fixture_asset_sha256"].items():
       assert hashlib.sha256((package / relative_path).read_bytes()).hexdigest() == expected_digest

   git_index = repo / ".git/index"
   current_index_digest = hashlib.sha256(git_index.read_bytes()).hexdigest() if git_index.is_file() else None
   assert current_index_digest == snapshot["git_index_sha256"]

   roots = [
       skills,
       repo / ".config/agents/rules",
       repo / ".config/agents/harnesses",
       repo / ".config/agents/hooks",
       repo / ".config/scripts",
       repo / "bin",
   ]
   live_text = [
       path
       for root in roots
       if root.exists()
       for path in root.rglob("*")
       if path.is_file() and path.suffix in {".md", ".json", ".sh", ".txt"}
   ]
   live_text.extend(path for path in [repo / "README.md", repo / "manifest"] if path.is_file())
   stale = [path for path in live_text if "dev-flow" in path.read_text()]
   assert not stale, stale
   selected_occurrences = sum(path.read_text().count(selected) for path in live_text)
   assert selected_occurrences == sum(snapshot["live_match_files"].values())

   workflow = package / "WORKFLOW.md"
   links = re.findall(r"\[[^\]]+\]\(([^)]+)\)", workflow.read_text())
   local_links = [
       link.split("#", 1)[0]
       for link in links
       if "://" not in link and not link.startswith("#")
   ]
   targets = {(workflow.parent / link).resolve() for link in local_links}
   family_names = {name for name in expected_identities if name.startswith("dev-")}
   expected_targets = {(skills / name / "SKILL.md").resolve() for name in family_names}
   assert targets == expected_targets
   assert all(target.is_file() for target in targets)

   eval_root = package / "evals"
   matrix = json.loads((eval_root / "evals.json").read_text())
   baseline = snapshot["flow_eval"]
   assert matrix["schema_version"] == baseline["schema_version"] == 1
   assert matrix["skill_name"] == selected
   assert [case["id"] for case in matrix["cases"]] == baseline["case_ids"]
   assert {case["id"]: case["fixture_dir"] for case in matrix["cases"]} == baseline["fixture_dirs"]
   for case in matrix["cases"]:
       case_id = case["id"]
       fixture_dir = eval_root / case["fixture_dir"]
       fixture = json.loads((fixture_dir / "case.json").read_text())
       assert fixture["inputs"] == case["inputs"]
       assert fixture.get("scripted_replies", []) == case.get("scripted_replies", [])
       assert fixture.get("additional_files", []) == baseline["additional_files"][case_id]
       assert all((fixture_dir / asset).is_file() for asset in fixture.get("additional_files", []))
   eval_identity_occurrences = sum(
       path.read_text().count(selected)
       for path in eval_root.rglob("*.json")
   )
   assert eval_identity_occurrences == baseline["identity_occurrences"]

   print({
       "selected_identity": selected,
       "installed_skills": len(actual_identities),
       "package_files": len(actual_package_files),
       "workflow_targets": len(targets),
       "eval_cases": len(matrix["cases"]),
       "stale_dev_flow": 0,
       "git_index_unchanged": True,
   })
   ```

   Expected current-shape values are 28 installed skills, 64 package files, 19 resolved workflow targets, 54 evaluation cases, zero stale `dev-flow`, and an unchanged Git index.

2. Use the repository `grep` tool with pattern `dev-flow` over `.config/agents/skills;.config/agents/rules;.config/agents/harnesses;.config/agents/hooks;.config/scripts;bin;README.md;manifest`. Expected: zero matches. Deliberately exclude `.agents/plans/**`, `.scratch/**`, and `archive/**`.

3. Verify the unchanged canonical exposure roots:

   ```sh
   realpath "$HOME/.agents" .grok/skills
   ```

   Expected, in order:

   ```text
   /Users/kim/.dotfiles/.config/agents
   /Users/kim/.dotfiles/.config/agents/skills
   ```

4. Run this fresh JavaScript Eval cell after substituting the exact selected identity:

   ```js
   const selected = "<selected_interface_name>";
   const siblings = new Set([
     "dev-code-review", "dev-codebase-design", "dev-continual-learning",
     "dev-diagnosing-bugs", "dev-domain-modeling", "dev-grilling",
     "dev-handoff", "dev-implementation", "dev-improve-codebase-architecture",
     "dev-integration", "dev-prototype", "dev-requirements", "dev-research",
     "dev-shipping", "dev-specification", "dev-tdd", "dev-ticketing",
     "dev-verification",
   ]);
   const expected = new Set([selected, ...siblings]);
   const process = Bun.spawn(
     ["grok", "--no-auto-update", "inspect", "--json"],
     {
       cwd: "/Users/kim/.dotfiles",
       stdout: "pipe",
       stderr: "pipe",
     },
   );
   const [stdout, stderr, exitCode] = await Promise.all([
     new Response(process.stdout).text(),
     new Response(process.stderr).text(),
     process.exited,
   ]);
   if (exitCode !== 0) throw new Error(stderr);
   const inventory = JSON.parse(stdout);
   const projectDev = new Set(
     inventory.skills
       .filter((skill) => skill.name.startsWith("dev-") && skill.source?.type === "project")
       .map((skill) => skill.name),
   );
   const old = inventory.skills
     .filter((skill) => skill.name === "dev-flow")
     .map((skill) => `${skill.name}:${skill.source?.type}`);
   if (
     projectDev.size !== expected.size
     || [...expected].some((name) => !projectDev.has(name))
   ) {
     throw new Error(`unexpected project dev inventory: ${[...projectDev]}`);
   }
   if (old.length) throw new Error(`old identity still resolves: ${old}`);
   console.log({
     selectedProjectSkill: selected,
     developmentSkills: projectDev.size,
     oldSkills: 0,
   });
   ```

   Expected summary: `{ selectedProjectSkill: "<selected_interface_name>", developmentSkills: 19, oldSkills: 0 }`.

5. Start a fresh default-profile OMP process:

   ```sh
   env -u OMP_PROFILE -u PI_PROFILE omp --no-session --tools=read --skills=<selected_interface_name>,dev-flow
   ```

   At the prompt, type `/skill:` without submitting and confirm autocomplete contains `/skill:<selected_interface_name>` and not `/skill:dev-flow`; OMP constructs this autocomplete list from the fresh process’s discovered-skill registry. Do not use standalone `omp read`, which has no fresh session discovery registry.

   Invoke:

   ```text
   /skill:<selected_interface_name> Route this bounded read-only request: identify the H1 heading in README.md. Emit only the seven-field Route Overview and request approval; do not answer or mutate.
   ```

   Expected: exactly `Goal`, `Route`, `Why`, `Artifacts`, `Gates`, `Execution`, and `First action`, followed by an approval request.

6. Exercise the same interface through a fresh read-only Grok process:

   ```sh
   grok --no-auto-update --cwd /Users/kim/.dotfiles --no-plan --no-memory \
     --no-subagents --disable-web-search --permission-mode dontAsk \
     --tools 'read_file,grep,list_dir' --deny 'Bash' --deny 'Edit' \
     --deny 'Write' --deny 'MCPTool' --deny 'WebFetch' --deny 'WebSearch' \
     --max-turns 1 --single \
     "/<selected_interface_name> Route this bounded read-only request: identify the H1 heading in README.md. Emit only the seven-field Route Overview and request approval; do not answer or mutate."
   ```

   Expected: the same seven fields and approval request, with no working-tree mutation. Grok may create its normal user-level session record; do not delete it as task cleanup.

7. Reset and rerun the static Python cell after both harness checks. Require the identical passing summary, unchanged fixture and Git-index digests, no old directory or alias, and no staging or delivery action.

## Assumptions & contingencies

- `dev-ask` is the recommended pattern, not a preselected identity. T1 is the only naming decision gate; absent an explicit valid user choice, execution stops before filesystem mutation.
- The selected development identity always retains the `dev-` workflow prefix, and its suffix becomes the convention for future sibling interfaces such as `marketing-<suffix>`. This task records that convention through the chosen skill name but does not create or modify a marketing workflow.
- All eight first-pass candidates and their `marketing-*` examples have no current repository directory or installed frontmatter collision. OMP’s built-in `ask` tool does not collide with the exact skill name `dev-ask`. T1/T2 still recheck every active provider because discovery is first-wins.
- The current source shape is 28 installed skill roots, 19 `dev-*` identities, a 64-file `dev-flow` package, 54 evaluation cases, 117 exact live identity occurrences in 29 files, and no live non-skill callsite. A missing source, mismatched frontmatter, changed package inventory, or changed sibling identity set makes this revision stale and stops before mutation. New exact `dev-flow` literals in the already declared live scopes join the fixed transform and snapshot automatically; historical or cached matches remain excluded.
- Existing OMP/Grok exposure roots are canonical symlinks to the repository source. If either `realpath` result changes, stop with the observed mismatch; do not run bootstrap or repair links under this authority.
- Fresh process startup is required after the move. The user has already confirmed that a fresh pre-change OMP session discovers the current `dev-*` family; long-lived sessions and standalone `omp read` are not evidence for the renamed identity.
- If OMP or Grok authentication/provider capability prevents an invocation smoke, complete every deterministic check but leave T5 incomplete with the exact unavailable prerequisite. Do not substitute filesystem presence for exercised invocation.

## Completion Summary

- Decision: selected `dev-ask`; the durable shared interface suffix is `ask`, yielding future siblings such as `marketing-ask`.
- Delivered: moved the single package to `.config/agents/skills/dev-ask`, migrated every live caller and evaluation identity, and left no `dev-flow` compatibility surface.
- Verified: static snapshot, identity scan, canonical exposure roots, fresh Grok inventory, fresh OMP autocomplete/invocation, and fresh Grok invocation all passed.
- Residual risk: none observed; no staging, commit, push, bootstrap, or symlink repair was performed.
