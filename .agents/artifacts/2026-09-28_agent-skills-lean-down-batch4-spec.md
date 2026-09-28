# Agent-skills lean-down, batch 4: technical specification

- **Revision:** `agent-skills-lean-down-batch4/spec-v2`
- **Date:** 2026-09-28
- **Assurance:** standard
- **Baseline:** repository `HEAD` `e1877e8`, clean. Line numbers refer to that baseline; re-locate by content if lines drift.

## 1. Authority and approved outcome

**Authority.**

- The human-approved proposal [`2026-09-28_agent-skills-lean-down-proposal.md`](2026-09-28_agent-skills-lean-down-proposal.md), ranked item 7. The five plan rules (`.config/agents/rules/{plan,plan-impl-spec,plan-repo-storage,plan-omp-transport,plan-grok-transport}.md`, 3,034 words at baseline) become:
  - one portable plan rule, `plan.md`: identity, approval, lifecycle, completion, active path, repository storage and on-request archiving. It absorbs `plan-repo-storage.md`;
  - one plan grammar, `plan-impl-spec.md`, which stays consistent with the validator `.config/agents/skills/dev-implementation/scripts/executor_plan.py`;
  - OMP and Grok draft-copy and transport steps in host files under `harnesses/omp/` and `harnesses/grok/`, linked from their callers the way the OMP agent-return adapter is linked (`references/agent-return/return.md` L10);
  - archive bans, repeated in four files today, stated once;
  - `plan.md` frontmatter `paths: ["**"]` → `paths: [".agents/plans/**"]` (the human approved the narrowing).
- Human route decisions for this batch: migrate every caller, including evals, the OMP extension and its tests, Grok config and bootstrap/link scripts where they reference the rule names. `.scratch/`, `archive/` and `banks/` are not live and stay untouched. Item 15 is decided: plan-rethink stays for compact direct work; `references/plan-rethink.md` changes only its pointer line.
- Owner intent: lean and host/repo/topic-agnostic; one owner per rule with pointers elsewhere; never lose a rule.
- Reconcile/Retrace guard: no change to `skills/{reconcile,retrace,rethink,omp-update}/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`; their suites stay green.
- Precedent: batch 1–3 specs in `.agents/artifacts/` (structure, `LIVE`, guard ACs, extraction rule).

**Approved outcome.** Two plan rules remain in `rules/`. Every clause of the five baseline rules has exactly one owner in the two rules or the two host files. Every live caller names only current files. Validator, extension, copy helper and their tests are unchanged and green.

**Non-goals.** No change to plan semantics, lifecycle, grammar, validator, extension or helper behavior. No new rule, skill, field or stage. No rewrite of historical plans, archives, specs or the papercut ledger.

## 2. Current system and constraints

`LIVE` = `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md bin .config/scripts ':!.config/agents/references/impl-rethink/MAINTENANCE.md'` (batch 1, plus `bin` and `.config/scripts` for link and helper scripts).

**How each host finds rules today** (the key design input).

- **OMP** (`omp://rulebook-matching-pipeline.md`, OMP 18.3.0). It loads `~/.agents/rules/*.md`, where `~/.agents` is a symlink to `.config/agents`, and the project's `.agents/rules/*.md`. A rule's name is its filename. A rule with a `description` enters the rulebook: the model sees name + description under `<domain-rules>` and reads it on demand as `rule://<name>`. OMP parses `globs`, `alwaysApply`, `description`, `condition`, `scope`, `agents`, `interruptMode`. **It does not parse `paths`**, so `paths` is inert on OMP both before and after this batch. A file outside `rules/` has no `rule://` name and no description activation. It is reached only by an explicit pointer.
- **OMP draft copying is mechanical.** `harnesses/omp/extensions/plan-artifact-sync.js` (loaded by `harnesses/omp/config.yml` L49) calls `bin/omp-copy-plan-artifact` after each `local://*-plan.md` write or edit. Neither file names a rule; the copy happens whatever the rule text says. The rule text only tells the agent to draft at `local://<slug>-plan.md` and what the warning means.
- **Grok** (`~/.grok/docs/user-guide/12-project-rules.md`). Grok loads every `*.md` directly inside `.grok/rules/` from the repo root to cwd, in full and always in context, plus `~/.grok/rules/` and `extra_rule_dirs`. In this repo the tracked symlink `.grok/rules -> ../.config/agents/rules` exposes all rules, so all five plan rules are loaded today. `~/.grok/rules` does not exist and `~/.grok/config.toml` sets no `extra_rule_dirs`, so outside this repo Grok loads none (unchanged by this batch). Grok has no `rule://` and ignores `paths` (not documented; [INFERENCE] inert). `harnesses/grok/` holds `config.toml` and empty `personas/` and `roles/`; nothing under it is auto-loaded.
- **Cursor**: `.cursor/rules -> ../.agents/rules`, which does not contain the plan rules; unaffected.
- **Bootstrap** (`.config/scripts/bootstrap`) links `~/.agents` and `~/.grok/config.toml` only. No script names a rule file.

**Clause inventory and duplication.**

- `plan.md` (718 words): scope; authority and sizing; ownership sentence (L18, points to "companion rules"); plan-rethink once; identity and header; approval; lifecycle; completion (L69, including an archive ban and a pointer to `plan-repo-storage.md`); stops.
- `plan-repo-storage.md` (617): identity/paths; local-draft snapshot copying; direct repository editing; on-request archiving; activation checks.
- `plan-omp-transport.md` (375): `local://` draft; `plan-artifact-sync` → `omp-copy-plan-artifact` protocol call; warning in `details.planArtifactSync`; protocol rejection and `PLAN_SYNC_PROTOCOL_MISMATCH`; one writer per slug; native plan review as sole approval; copy of all four states; archive ban; copy grants nothing.
- `plan-grok-transport.md` (240): discovery through `.grok/rules`; discovery is availability only; direct authoring at the active path for all states; archive ban; direct persistence grants nothing; host identity/model/role/tools/recovery stay in the adapter; disclose actual mechanics.
- `plan-impl-spec.md` (1,084): intro (L13 loads "repository storage and the actual harness companion"); authoring bullets (L44 names `plan-repo-storage.md` and "the applicable harness companion"); grammar from `## Header and sections` to the end, matching `executor_plan.py` `REQUIRED_SECTIONS`, `HEADER_FIELDS` and error codes.
- Archive bans appear in `plan.md` L69, `plan-repo-storage.md` L22/L27/L37, `plan-omp-transport.md` L18 and `plan-grok-transport.md` L19.
- "Validated bytes grant no approval/transition/completion" appears in storage, OMP and Grok rules.

**Live callers** (`git grep` over `LIVE` at baseline):

| File | Line | Current text |
|---|---|---|
| `references/plan-rethink.md` | L12 | "storage and the actual harness companion only when publishing a plan." |
| `skills/dev-ticketing/SKILL.md` | L19–20 | "load storage and the actual harness companion only when publishing." |
| `skills/improve/SKILL.md` | L98 | reads `rule://plan`, `rule://plan-repo-storage`, `rule://plan-impl-spec` |
| `skills/improve/references/plan-template.md` | L3 | same three rules |
| `skills/init-ask/SKILL.md` | L40 | "current plan transport/storage rules \| `plan` and its repository/harness transport rules" |
| `docs/adr/0002-executor-plans-and-orchestration.md` | L96 | Affected contracts lists the five rules |

**Checked and left unchanged** (each still true after the batch):

- `craft-rule` L62–64 and L102: generic rule-type examples; `plan.md` and `plan-impl-spec.md` still exist; "harness shim" stays a generic layer name.
- `craft-rule` L94 ("Separate universal semantic contracts, repository storage companions, and harness transport shims.") and `craft-rule/evals/evals.json` id 1 (expects "a repository-storage companion" for `.agents/plans` naming and archival): generic rule-design guidance, not a pointer to a removed file. Changing them would change what craft-rule teaches and what its eval tests, which item 7 does not authorize. Left unchanged; see O2.
- `acp-controller/test/reconcile.test.mjs` L551: a self-contained fixture string written to a temp `craft-rule/SKILL.md`; it never reads the real file. Guarded; untouched.
- `init-ask/evals/evals.json` ("current plan transport"), `craft-skill/evals/evals.json` L64, `craft-rule/evals/evals.json` id 3: generic wording.
- ADR-0002 L10 ("repository and harness transports"), D29 L75 ("OMP and other local-draft adapters"), D30 L88: still accurate.
- `plan-artifact-sync.js`, its test, `bin/omp-copy-plan-artifact`, `executor_plan.py` and its tests/fixtures: name no rule file.
- `harnesses/grok/config.toml`, `personas/`, `roles/`, `.config/scripts/bootstrap`: name no rule file.
- `.grok/rules` and `.cursor/rules` symlinks: directory links; deleting rule files needs no link change.
- Not live, not edited: `.agents/plans/**` (including the PENDING `2026-09-01-0212_progressive-local-checkpoints.md`, which cites the five rules), `.agents/artifacts/**` (earlier batch specs), `.agents/papercuts.json` (ledger data), `.scratch/`, `archive/`, `banks/`.

**Baseline suites** (run at `e1877e8`): acp-controller `npm test` `fail 0`; `cli.mjs roles` exit 0; `test_executor_plan.py` 14 OK; `test_papercut_ledger.py` 19 OK; extensions `bun test` 20 pass, 0 fail.

## 3. Architecture and ownership

```text
rules/plan.md                        portable owner (rulebook rule, description-activated)
  identity · approval · lifecycle · completion · stops
  ## Repository storage   active path, direct editing, validate, conflicts, "grants nothing", host pointers
  ## Archiving on request the single archive statement
rules/plan-impl-spec.md              grammar owner (rulebook rule); points to plan.md for publication
harnesses/omp/plan-transport.md      OMP adapter: local:// draft, sync/helper call, snapshot copy, warnings, native review
harnesses/grok/plan-transport.md     Grok note: discovery via .grok/rules; direct path per plan.md
```

**Activation after the change** (no host loses its steps):

| Host | How the plan contract loads | How transport steps load |
|---|---|---|
| OMP | `rule://plan` and `rule://plan-impl-spec` from the rulebook, as today; callers (`dev-ticketing`, `plan-rethink`, `improve`) name them | `plan.md` `## Repository storage` names `~/.agents/harnesses/omp/plan-transport.md`; `plan-impl-spec.md` intro and `dev-ticketing`/`plan-rethink` say to load the host draft adapter that `rule://plan` names when publishing. The copy itself stays automatic (extension). |
| Grok (this repo) | Both rules loaded in full through `.grok/rules`, as today | The direct path is in `plan.md` itself, which Grok always has; the Grok host file adds only the discovery note and is not needed at run time |
| Other hosts | `plan.md` + `plan-impl-spec.md` | Direct path in `plan.md` |

**Why the host files are not rules.** OMP: a rule's `description` activation for the OMP adapter is replaced by an explicit pointer inside `plan.md`, which is always read before plan work; the extension enforces the copy regardless. Grok: its rule was always loaded in full, but its only unique content is the discovery note; the direct path moves into `plan.md`. Keeping either as a rule would recreate a per-host rule the proposal removes.

**Pointer form.** `plan.md` is loaded from `~/.agents/rules` in any repo, so it names host files as `~/.agents/harnesses/<host>/plan-transport.md`, the form it already uses for `~/.agents/references/plan-rethink.md`. Host files link back with a relative Markdown link `../../rules/plan.md`, like `harnesses/omp/agent-return.md`.

**Clause → new owner.** Every baseline clause has one row. "Once" means the duplicate copies are removed and this is the single statement.

| Baseline clause (file:line) | New owner |
|---|---|
| plan.md L8 scope | plan.md, unchanged; plus the storage skip note (not for other meanings of "plan" or read-only archive review) from storage L41–46 |
| plan.md L10–16, L20–25, L31–67, L71–74 | plan.md, byte-identical lines |
| plan.md L18 ownership | plan.md, rewritten: this rule owns identity, lifecycle, storage and archiving; grammar → `plan-impl-spec`; a host adapter owns only its copy mechanics |
| plan.md L29 file name | plan.md, rewritten to also state identity `<Datetime>_<slug>` with a lowercase kebab-case slug (storage L7) |
| plan.md L69 completion | plan.md: first sentences kept; archive ban and storage pointer → `## Archiving on request` |
| storage L7–10 identity, active and archive paths, active file is sole source | plan.md `## Repository storage` / `## Archiving on request` |
| storage L12 two identity paths, conflicts, reserved dirs | plan.md `## Repository storage` |
| storage L16–22 snapshot copy (regular non-symlink, validate, atomic same-dir replace, recheck, visible failure, one copied success) | OMP host file (the only local-draft adapter) |
| storage L22/L27/L37, OMP L18, Grok L19 archive bans | plan.md `## Archiving on request`, once |
| storage L24–28 direct editing, validate, grants nothing, visible error | plan.md `## Repository storage` |
| storage L30–37 on-request archiving (request, eligibility, authority chain, `git mv`, links, read-only) | plan.md `## Archiving on request` |
| storage L39–46 activation checks | plan.md description + scope line |
| OMP L7 apply-with pointer | dropped: the host file is reached from plan.md and links back |
| OMP L9–16 draft, sync call, warning, protocol, one writer, native review | OMP host file |
| OMP L17 copies four states; execution reads active file | OMP host file (copy); plan.md (active file is sole source) |
| OMP L19–20 validate before readiness; no alternate ready transition; copy grants nothing | plan.md `## Repository storage` (validate, grants nothing) |
| OMP L22–27 activation checks | plan.md storage bullet names the adapter; `plan-impl-spec` says load it when publishing |
| Grok L7 apply-with pointer | dropped (as OMP L7) |
| Grok L9–12 discovery, availability only | Grok host file |
| Grok L14–17 direct authoring for all states, validate, other hosts same path | plan.md `## Repository storage` |
| Grok L20–21 grants nothing; host identity/model/role/tools/recovery in adapter; disclose mechanics | plan.md `## Repository storage` |
| Grok L23–28 activation checks | dropped: Grok loads every rule in full; the host file is a note |
| impl-spec L13, L44–46 publication pointers | impl-spec, rewritten to point to plan.md and the host adapter it names; "no parser fields, workflow stage, or runtime state" kept |
| impl-spec all other lines, grammar from `## Header and sections` on | impl-spec, byte-identical |

If an implementer finds a baseline clause the table does not place, stop (§9).

## 4. Interfaces, data, invariants and errors

**`rules/plan.md` frontmatter** — exactly two keys:

```yaml
description: <one line naming identity, approval, lifecycle, completion, repository storage and host draft adapters under .agents/plans, and on-request archiving>
paths: [".agents/plans/**"]
```

`paths` is kept as approved and is inert on OMP and Grok (§2). OMP activation stays description-driven.

**`rules/plan.md` body.** Existing headings stay (`# Plan`, `## Identity and header`, `## Approval`, `## Lifecycle`, `## Completion`, `## Stops`). Two sections are added after `## Completion` and before `## Stops`:

- `## Repository storage`: active path `.agents/plans/<Datetime>_<slug>.md` as sole source; direct authoring for all four states on hosts without a local-draft adapter; the host pointers `~/.agents/harnesses/omp/plan-transport.md` and `~/.agents/harnesses/grok/plan-transport.md`; `executor_plan.py validate PLAN` before publication and readiness; identity-path conflicts; persistence grants nothing; host specifics stay in the host adapter.
- `## Archiving on request`: archive paths `.agents/plans/archive/<Datetime>_<slug>.md` and `.agents/artifacts/archive/<name>`; explicit request after `DONE`/`CLOSED`; eligibility; authority chain; `git mv`; live-link updates; read-only bytes; the single ban on automatic archiving, active-path removal, archive receipts and archive completion gates, covering direct edits and host adapters.

Wording is the implementer's, under the no-lost-clause rule. Only the tokens S2 lists are pinned.

**`rules/plan-impl-spec.md`.** Frontmatter unchanged (description only). L13 and L44–46 are rewritten to point at `plan.md` and the host draft adapter it names. Every other line stays byte-identical, and the grammar (from `## Header and sections` to the end) is byte-identical, so the validator contract (`REQUIRED_SECTIONS`, `HEADER_FIELDS`, error codes) is unchanged.

**`harnesses/omp/plan-transport.md`.** New. No frontmatter; starts with an H1; first paragraph links `../../rules/plan.md`. Holds the OMP rows of §3, including the exact call `omp-copy-plan-artifact copy --protocol plan-artifact-copy/v1 --slug SLUG --content-file FILE`, the `plan-artifact-sync:` warning in `details.planArtifactSync`, `PLAN_SYNC_PROTOCOL_MISMATCH`, one writer per slug, the snapshot-copy rules and native plan review as the sole OMP approval. It mentions no archive: plan.md's single statement covers adapters. Identity conflicts refer to the plan rule.

**`harnesses/grok/plan-transport.md`.** New. No frontmatter; starts with an H1; links `../../rules/plan.md`. States: Grok loads the rules through the tracked `.grok/rules` → `.config/agents/rules` symlink; invent no config key or duplicate registration; discovery is availability only; Grok has no local-draft adapter and uses the direct path in plan.md. No archive text.

**Deleted.** `rules/plan-repo-storage.md`, `rules/plan-omp-transport.md`, `rules/plan-grok-transport.md`.

**Invariants.**

- I1 One owner per clause (§3 table). Archive text appears only in `rules/plan.md` among plan rules and host plan files.
- I2 The grammar and validator stay in step: grammar text byte-identical; validator untouched.
- I3 No live file names a removed rule, `rule://plan-repo-storage`, "harness companion", "storage companion" or "transport/storage rules".
- I4 Every `~/.agents/...` path in `plan.md` and every relative link in the host files resolves.

**Errors.** None at runtime; this is text. Implementation-time failures are stops (§9).

## 5. Effects, migration, rollback and compatibility

**Files changed** (the union allowlist of S8):

- T1: `rules/plan.md`, `rules/plan-impl-spec.md`; delete `rules/plan-repo-storage.md`, `rules/plan-omp-transport.md`, `rules/plan-grok-transport.md`; create `harnesses/omp/plan-transport.md`, `harnesses/grok/plan-transport.md`.
- T2 caller migration:
  - `references/plan-rethink.md` L12 → load the host draft adapter that `rule://plan` names, only when publishing a plan. L10 unchanged.
  - `skills/dev-ticketing/SKILL.md` L19–20 → same pointer.
  - `skills/improve/SKILL.md` L98 and `skills/improve/references/plan-template.md` L3 → `rule://plan` and `rule://plan-impl-spec` only (`improve` writes directly to `.agents/plans/`, the direct path now in `plan.md`).
  - `skills/init-ask/SKILL.md` L40 → name `plan` and the host plan adapters it names; row meaning unchanged.
  - `docs/adr/0002-executor-plans-and-orchestration.md` L96 → the two rules and the two host files by full path; `**Updated:**` set to the implementation date if it differs from 2026-09-28. No other ADR line.
- Paths are relative to `.config/agents/` except the ADR.

**Commit boundary.** Between T1 and T2 the callers still name the deleted rules. That tree is never committed: T1 and T2 land together in one commit after T2, and no T1 AC reads a caller file.

**Migration.** None for data. Existing plans validate unchanged (grammar and validator untouched). `.grok/rules` loses three files automatically through the directory symlink.

**Rollback.** Revert the implementation commit(s). No generated or external state.

**Compatibility.** `rule://plan-repo-storage`, `rule://plan-omp-transport` and `rule://plan-grok-transport` stop resolving; no live caller uses them after T2. Historical documents that name them stay as history. The `paths` change has no effect on OMP or Grok.

## 6. Acceptance

Run every command from the repository root. `Sn` means: extract §6.1 block `Sn` to `/tmp/b4/Sn.py` and run `python3 /tmp/b4/Sn.py`. Extraction rule: a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````. No block contains such a line; backticks inside a block are single characters, never a fence. §6.1 lists each extracted file's SHA-256 so extraction can be checked with `shasum -a 256 /tmp/b4/*.py`. `LIVE` is the §2 pathspec; substitute it literally. A task runs every AC it owns at its boundary. Every AC stays true after later tasks, so the verifier runs the complete set once on the final target.

**AC-1** — T1
Behavior: `plan.md` frontmatter has exactly `description` and `paths: [".agents/plans/**"]`, and the description names identity, approval, lifecycle, completion, `.agents/plans`, drafts and archiving; `plan-impl-spec.md` keeps a description-only frontmatter.
Check: `S1`; expect `ok`.

**AC-2** — T1
Behavior: Each distinctive baseline fact is present at its new owner (active and archive paths, `git mv`, validate command, slug form, lifecycle states, rule and host pointers in `plan.md`; the OMP draft, call, warning, protocol error, snapshot and native-review facts in the OMP file; the `.grok/rules` discovery in the Grok file), and neither remaining rule names a removed companion.
Check: `S2`; expect `ok`.

**AC-3** — T1
Behavior: Every non-blank baseline line of `plan.md` and `plan-impl-spec.md` outside the rewritten lines (plan.md L2, L3, L18, L29, L69; impl-spec L13, L44–46) survives, and the grammar from `## Header and sections` to the end is byte-identical.
Check: `S3`; expect `ok`.

**AC-4** — T1
Behavior: Both host files exist outside `rules/`, have no frontmatter, link back to `rules/plan.md`, and all their relative links and every `~/.agents/...` path in `plan.md` resolve.
Check: `S4`; expect `ok`.

**AC-5** — T1
Behavior: Only the plan rule and the grammar remain as plan rules, and Grok sees exactly those through `.grok/rules`.
Check: `ls .config/agents/rules/plan*.md .grok/rules/plan*.md`; expect exactly `.config/agents/rules/plan-impl-spec.md`, `.config/agents/rules/plan.md`, `.grok/rules/plan-impl-spec.md`, `.grok/rules/plan.md`.

**AC-6** — T1
Behavior: The validator still accepts its fixtures and the copy helper and extension code are unchanged, so grammar and transport behavior did not move.
Check: `P=".config/agents/skills/dev-implementation/scripts .config/agents/harnesses/omp/extensions bin/omp-copy-plan-artifact .config/agents/harnesses/omp/config.yml .config/agents/harnesses/grok :!.config/agents/harnesses/grok/plan-transport.md"; git status --porcelain -- $P; git diff --name-only e1877e8 -- $P`; expect empty output.

**AC-7** — T1
Behavior: Among the plan rules and host plan files, only `rules/plan.md` mentions archives (the archive rule is stated once).
Check: `S5`; expect `ok`.

**AC-8** — T2
Behavior: `dev-ticketing`, `plan-rethink`, `improve` (SKILL and template) and `init-ask` point only at current plan rules and host adapters and name no removed companion.
Check: `S6`; expect `ok`.

**AC-9** — T2
Behavior: ADR-0002 changes only its `Updated` line and the plan-rules affected-contract bullet, which names the two rules and two host files, all existing.
Check: `S7`; expect `ok`.

**AC-10** — T1, T2
Behavior: Only batch-4 files differ from the baseline (union allowlist; deleted-uncommitted paths count as allowed changes, and untracked files are listed).
Check: `S8`; expect `ok`.

**AC-11** — T2
Behavior: No live file names a removed rule.
Check: `git grep --untracked -n -I -E 'plan-(repo-storage|omp-transport|grok-transport)' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

**AC-12** — guard; T1, T2
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-13** — guard; T1, T2
Behavior: The guarded paths and the agent-return adapter (the link pattern this batch copies) are unchanged against the baseline and the working tree.
Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; git status --porcelain -- $P; git diff --name-only e1877e8 -- $P`; expect empty output.

**AC-14** — guard; T2
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

**AC-15** — guard; T1, T2
Behavior: The real protocol and Retrace prompt files still load offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-16** — T1, T2
Behavior: The plan validator suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

**AC-17** — T2
Behavior: The plan-sync extension suite still passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-18** — T2
Behavior: The papercut ledger suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

**Baseline results** (all run at `e1877e8`). Expected to fail before T1: AC-1 (missing `paths` value and description terms), AC-2 (facts not yet at new owners), AC-4 (host files missing), AC-5 (five rules), AC-7 (four files mention archives). Expected to fail before T2: AC-8 (five caller hits), AC-9 (bullet unchanged), AC-11 (hits in the three rules, `plan.md`, `plan-impl-spec.md`, `improve` ×2 and ADR-0002). Already true: AC-3, AC-6, AC-10, AC-12…18 (npm `fail 0`; roles 0; 14 OK; 20 pass/0 fail; 19 OK).

**Target simulation.** A non-git copy of `.config/agents` and `docs/adr` was edited to a candidate target (the §3 table applied; callers edited as §5) and S1–S7 run there with `GIT_DIR` pointing at this repository: all `ok`. The `grep` form of AC-11 found no hit and `ls` found only the two rules. Negative probes each turned one check red: `git mv` removed (S2), archive word in the OMP file (S5), a grammar heading renamed or a kept lifecycle line changed (S3), `paths` reverted (S1), Grok backlink removed (S4), an extra ADR line (S7). The simulated target measured about 2,500 words across the four files; this is not a target and no check pins it.

**Why each AC sits where it does.**

- AC-1…7 concern files only T1 edits; T2 does not touch them, so they stay true.
- AC-8, AC-9 and AC-11 concern callers, which only T2 edits; between T1 and T2 the callers are stale, so these cannot hold at T1. No T1 AC reads a caller file, so T1 can meet all its ACs from what exists at its boundary.
- AC-10 uses the union allowlist so it holds at T1, at T2 and on the final target.
- AC-16 runs at T1 as well because T1 edits the grammar text the validator mirrors. AC-14, AC-17 and AC-18 run once, at T2: no task edits a file those suites load. AC-12, AC-13 and AC-15 give cheap per-task guard evidence.

### 6.1 Check scripts

Copy each block verbatim under the §6 extraction rule. Each file holds the block's lines joined with newlines, plus one final newline. The `local:/{2}` pattern avoids the literal scheme string, which some harnesses expand in commands. Expected `shasum -a 256` of the extracted files:

| File | SHA-256 |
|---|---|
| `S1.py` | `aeef1aaf6ae1bfd27d81065bf25205069a1fe9ca4de69ee13d627b1ff48678f8` |
| `S2.py` | `94314e90cc918711f6563508120bb8b2998bd05f573670f9d71c8459283591f3` |
| `S3.py` | `cbb94ead6eadc5ab8dbd2bcaba287c4b67b1db19cb98c0ad52856f36ba807c04` |
| `S4.py` | `f0291174c19fecbba257a1ad99f48ed3c053f0597e3697ee728ebc410dc21b43` |
| `S5.py` | `38ea1795125e8ce52374f85e47c27a66b8b2c8e60baa8510b77461603dcb198f` |
| `S6.py` | `901116071c94c0c53cb993e8089d5737bf179a5b6c6d832eed0369f060235356` |
| `S7.py` | `0ffdaba1350d9c0250b44eb98540e051a3d836f274b634e80f66e055d2b31210` |
| `S8.py` | `2ab4e117f2fff38529cffa678889ecfa98af30b07ce7e74df18c646e88450cbe` |

S1
```python
# S1 (AC-1): plan.md is a description-only rulebook rule scoped to .agents/plans; plan-impl-spec stays description-only
import re
R='.config/agents/rules/'
def fm(f):
    m=re.match(r'---\n(.*?)\n---\n',open(R+f,encoding='utf-8').read(),re.S)
    return m[1].split('\n') if m else []
def keys(l):return sorted(x.split(':',1)[0] for x in l if re.match(r'[\w-]+:',x))
p,i=fm('plan.md'),fm('plan-impl-spec.md');bad=[]
if keys(p)!=['description','paths']:bad.append(('plan keys',keys(p)))
if keys(i)!=['description']:bad.append(('impl keys',keys(i)))
if 'paths: [".agents/plans/**"]' not in p:bad.append('paths')
d=next((x for x in p if x.startswith('description:')),'').lower()
bad+=[t for t in ['identity','approval','lifecycle','completion','.agents/plans','draft','archiv'] if t not in d]
print(bad or 'ok')
```

S2
```python
# S2 (AC-2): every distinctive baseline fact has its new owner; the two rules name no removed companion
import re
R='.config/agents/';P=R+'rules/plan.md';I=R+'rules/plan-impl-spec.md';O=R+'harnesses/omp/plan-transport.md';G=R+'harnesses/grok/plan-transport.md'
T={P:[r'\.agents/plans/<Datetime>_<slug>\.md',r'\.agents/plans/archive/<Datetime>_<slug>\.md',r'\.agents/artifacts/archive/<name>',r'`git mv`',r'executor_plan\.py validate PLAN',r'lowercase kebab-case',r'rule://plan-impl-spec',r'~/\.agents/references/plan-rethink\.md',r'skill://dev-implementation/references/execution-recovery\.md',r'~/\.agents/harnesses/omp/plan-transport\.md',r'~/\.agents/harnesses/grok/plan-transport\.md',r'`PENDING`',r'`IN_PROGRESS`',r'`DONE`',r'`CLOSED`',r'Completed At',r'Completion Summary'],
 O:[r'local:/{2}<slug>-plan\.md',r'plan-artifact-sync:',r'omp-copy-plan-artifact copy --protocol plan-artifact-copy/v1 --slug SLUG --content-file FILE',r'details\.planArtifactSync',r'PLAN_SYNC_PROTOCOL_MISMATCH',r'non-symlink',r'atomic',r'native plan review'],
 G:[r'\.grok/rules',r'\.config/agents/rules'],
 I:[r'`plan\.md`',r'executor_plan\.py validate PLAN',r'no parser\s+fields,\s+workflow\s+stage,\s+or\s+runtime\s+state']}
F=re.compile(r'plan-(?:repo-storage|omp-transport|grok-transport)|harness\s+companion|storage\s+companion|companion\s+rules')
bad=[]
for f,ts in T.items():
    try:t=open(f,encoding='utf-8').read()
    except OSError:bad.append((f,'missing'));continue
    bad+=[(f.split('/')[-1],x) for x in ts if not re.search(x,t)]
    if f in (P,I) and F.search(t):bad.append((f.split('/')[-1],F.search(t)[0]))
print(bad or 'ok')
```

S3
```python
# S3 (AC-3): kept plan.md and plan-impl-spec.md lines survive; the grammar tail is byte-identical
import subprocess
B='e1877e8';R='.config/agents/rules/'
def base(f):return subprocess.run(['git','show',B+':'+R+f],capture_output=True,text=True,check=True).stdout
bad=[]
for f,skip in (('plan.md',{2,3,18,29,69}),('plan-impl-spec.md',{13,44,45,46})):
    now=set(open(R+f,encoding='utf-8').read().splitlines())
    bad+=[(f,n) for n,l in enumerate(base(f).splitlines(),1) if l.strip() and n not in skip and l not in now]
b=base('plan-impl-spec.md');now=open(R+'plan-impl-spec.md',encoding='utf-8').read()
if not now.endswith(b[b.index('## Header and sections'):]) or now.count('## Header and sections')!=1:bad.append('grammar tail')
print(bad or 'ok')
```

S4
```python
# S4 (AC-4): both host files exist outside rules/, carry no frontmatter and link back to the plan rule; every ~/.agents path in plan.md resolves
import os,re
R='.config/agents/';bad=[]
for h in ('omp','grok'):
    f=R+'harnesses/%s/plan-transport.md'%h;d=os.path.dirname(f)
    if not os.path.isfile(f):bad.append((h,'missing'));continue
    t=open(f,encoding='utf-8').read();ls=re.findall(r'\]\(([^)#\s]+)',t)
    if not t.startswith('# '):bad.append((h,'head'))
    if not any(os.path.normpath(os.path.join(d,l))==R+'rules/plan.md' for l in ls):bad.append((h,'backlink'))
    bad+=[(h,l) for l in ls if not l.startswith(('http:','https:')) and not os.path.exists(os.path.join(d,l))]
t=open(R+'rules/plan.md',encoding='utf-8').read()
bad+=[p for p in re.findall(r'~/\.agents/[\w./-]*\w',t) if not os.path.exists(R+p[10:])]
print(bad or 'ok')
```

S5
```python
# S5 (AC-7): among the plan rules and host plan files, only rules/plan.md mentions archives
import glob,re
fs=sorted(glob.glob('.config/agents/rules/plan*.md')+glob.glob('.config/agents/harnesses/*/plan-transport.md'))
hit=[f for f in fs if re.search(r'(?i)archiv',open(f,encoding='utf-8').read())]
print('ok' if hit==['.config/agents/rules/plan.md'] else hit)
```

S6
```python
# S6 (AC-8): callers point at the merged rule and host adapters and name no removed companion
import re
S='.config/agents/'
F=re.compile(r'plan-(?:repo-storage|omp-transport|grok-transport)|harness\s+companion|storage\s+companion|transport/storage\s+rules|harness\s+transport\s+rules')
need={'skills/dev-ticketing/SKILL.md':['rule://plan`','rule://plan-impl-spec'],'references/plan-rethink.md':['rule://plan ','rule://plan-impl-spec'],'skills/improve/SKILL.md':['rule://plan`','rule://plan-impl-spec'],'skills/improve/references/plan-template.md':['rule://plan`','rule://plan-impl-spec'],'skills/init-ask/SKILL.md':['`plan`']}
bad=[]
for f,ts in need.items():
    t=open(S+f,encoding='utf-8').read();m=F.search(t)
    bad+=([(f,m[0])] if m else [])+[(f,x) for x in ts if x not in t]
print(bad or 'ok')
```

S7
```python
# S7 (AC-9): ADR-0002 changes only its Updated line and the plan-rules affected-contract bullet, which names four existing files
import os,subprocess
f='docs/adr/0002-executor-plans-and-orchestration.md'
b=subprocess.run(['git','show','e1877e8:'+f],capture_output=True,text=True,check=True).stdout.splitlines()
n=open(f,encoding='utf-8').read().splitlines()
old=[l for l in b if l not in n];new=[l for l in n if l not in b]
bad=[l[:60] for l in old if not (l.startswith('**Updated:**') or 'plan-repo-storage.md' in l)]
bad+=[l[:60] for l in new if not (l.startswith('**Updated:**') or l.startswith('- '))]
C='.config/agents/';blt=' '.join(l for l in new if l.startswith('- '))
bad+=[p for p in [C+'rules/plan.md',C+'rules/plan-impl-spec.md',C+'harnesses/omp/plan-transport.md',C+'harnesses/grok/plan-transport.md'] if p not in blt or not os.path.isfile(p)]
if not any('plan-repo-storage.md' in l for l in old):bad.append('bullet unchanged')
print(bad or 'ok')
```

S8
```python
# S8 (AC-10): only batch-4 files differ from the baseline
import subprocess
C='.config/agents/'
ok={C+x for x in ['rules/plan.md','rules/plan-impl-spec.md','rules/plan-repo-storage.md','rules/plan-omp-transport.md','rules/plan-grok-transport.md','harnesses/omp/plan-transport.md','harnesses/grok/plan-transport.md','skills/dev-ticketing/SKILL.md','references/plan-rethink.md','skills/improve/SKILL.md','skills/improve/references/plan-template.md','skills/init-ask/SKILL.md']}|{'docs/adr/0002-executor-plans-and-orchestration.md'}
g=lambda *a:subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n')
P=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts','.grok','.cursor']
ch={l for l in g('diff','--name-only','e1877e8','--',*P)+g('ls-files','--others','--exclude-standard','--',*P) if l}
print(sorted(ch-ok) or 'ok')
```

## 7. Test seams

- This batch changes Markdown only. The behavior is structural: one owner per clause, pointers resolving, removed names gone, grammar text byte-stable. The checks are static scripts plus existing suites at the seams that could notice: the validator (grammar), the plan-sync extension (OMP transport), the acp-controller suites and roles loader (guard), the papercut ledger.
- S2 pins distinctive facts (paths, commands, error codes, pointers), not wording. Prose may be rephrased freely; a fact dropped turns S2 red.
- S3 pins kept lines verbatim so the "no lost rule" duty is mechanical for the parts not being moved; the rewritten lines are named in AC-3.
- Permanent tests: none added or changed. There is no new consumer-visible contract; the validator and extension suites already cover the behavior the text describes.
- [INFERENCE] OMP agents still draft at `local://` and publish correctly because `plan.md` (always read for plan work) names the adapter and the extension copies automatically. No live run proves it; none is in scope.

## 8. Implementation boundaries and dependencies

A lean plan with two serial tasks:

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — Merge rules and create host files** | `rules/plan.md`, `rules/plan-impl-spec.md`; delete the three rules; create `harnesses/omp/plan-transport.md`, `harnesses/grok/plan-transport.md` | — | AC-1…7, AC-10, AC-12, AC-13, AC-15, AC-16 |
| **T2 — Migrate callers** | `references/plan-rethink.md`, `skills/dev-ticketing/SKILL.md`, `skills/improve/SKILL.md`, `skills/improve/references/plan-template.md`, `skills/init-ask/SKILL.md`, `docs/adr/0002-executor-plans-and-orchestration.md` | T1 (callers must name the files and sections T1 creates) | AC-8…18 |

**Sizing rationale.**

- T1 needs all five baseline rules in context at once to place every clause (§3). That is about 3,000 words of source plus the validator names; it fits one fresh context. Splitting the merge from the host files would put the same clauses in two tasks.
- T2 is six one- or two-line pointer edits. It is separate because its checks need T1's final file names and sections, and because a reviewer can check it without re-reading the clause mapping.
- Serial order follows that dependency.

## 9. Risks, assumptions, stops and open decisions

**Assumptions.**

- *Host file names.* `harnesses/<host>/plan-transport.md` mirrors the removed rule titles and the existing `harnesses/omp/agent-return.md` pattern.
- *Snapshot copy belongs to OMP.* `plan-repo-storage.md`'s "local draft copying" section describes the only local-draft adapter that exists (OMP's helper). If another host gains one, it gets its own host file.
- *Grok needs no run-time host file.* Grok's baseline transport is the direct path, which now lives in `plan.md`; its host file keeps the discovery note so that fact still has an owner.
- *craft-rule is not a caller to edit.* Its only plan-file mentions (L62–63) stay true. Its L94 guidance and eval id 1 are general design advice; see O2.
- *The PENDING plan `2026-09-01-0212_progressive-local-checkpoints.md` is left.* `.agents/plans/` is not `LIVE`; rewriting a plan's approved content changes its identity (`plan.md` L46). Its stale rule names are history.
- *ADR-0002 `Updated`.* Changed only if the implementation date differs; S7 allows either.

**Risks.**

- *A clause is dropped in the merge.* The main risk. §3 places every clause; S2 and S3 check anchors and kept lines; review checks the rest against the table.
- *OMP agents stop drafting locally.* Only if `plan.md` fails to name the adapter; AC-2 and AC-4 check the pointer and that it resolves.
- *npm test takes about 3 minutes.* Run it in the foreground with an explicit timeout.

**Stops.**

- Any guard check fails (AC-12…18).
- A baseline clause has no owner in §3, or its owner file would not hold it.
- A change would touch a path outside the S8 allowlist, the validator, extension or helper, or git state (the implementation commit is the route's later shipping step, not a task effect).
- Keeping the grammar byte-identical conflicts with a needed pointer edit.

**Open decisions for the owner.** None blocks this batch.

- *O1 — `paths` versus a path guard.* Kept as approved: `paths: [".agents/plans/**"]`. Evidence for a later review:
  - OMP parses `globs`, `alwaysApply`, `description`, `condition`, `scope`, `agents`, `interruptMode`, not `paths` (`omp://rulebook-matching-pipeline.md`); OMP activation of `plan.md` stays description-driven.
  - Grok loads every `.grok/rules/*.md` in full; its rules guide documents no `paths` field (`~/.grok/docs/user-guide/12-project-rules.md`).
  - No `.claude/` rules link exists in this repo or `~/.claude`, so no current host honors `paths` here.
  - `craft-rule` L91 ("In OMP, keep that portable base description-only") and L94 ("Never hide a cross-transport content contract behind a path guard"), and its eval id 1 assertion ("description-only relevance-loaded base"), point the other way. If a host that honors `paths` (for example Claude Code rules) is wired to `~/.agents/rules`, the plan contract would load only under `.agents/plans/`, and plan drafting elsewhere (host-local drafts) would lose it.
  - Owner choices for later: keep `paths` as documentation, drop it, or rename it for a specific host.
- *O2 — craft-rule storage-companion advice.* After the merge, this repo's plan rules no longer follow craft-rule L94's "separate … repository storage companions", and eval id 1 still expects a repository-storage companion. Editing either changes what craft-rule teaches and tests, which item 7 does not authorize, so this batch leaves both unchanged. The owner may later align craft-rule with the merged design (evidence: the rethink found the edit would change eval id 1's expected answer, not repair a stale link).

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch4/spec-v2`. Erratum to spec-v1: AC-6's pathspec covered all of `.config/agents/harnesses/grok`, where T1 must create `plan-transport.md`, so `git status --porcelain` always listed that new file and the check could not pass. The Check now excludes exactly that file; its Behavior and intent are unchanged. No other AC's pathspec covers a directory where a task creates a file. Nothing else changed.
- spec-v1 was produced after one plan-rethink pass. That pass made one bounded correction:
  - craft-rule L94 and its eval id 1 are removed from scope (they would change what the eval tests); they are recorded as O2. S6 and S8 drop them.
  - §5 states that the tree between T1 and T2 is never committed; §6 states that no T1 AC reads a caller file.
  - O1 now lists its evidence.

  Boundaries, effects, assurance and inherited acceptance are otherwise unchanged.
- Next owner: `dev-ticketing`, to project T1 → T2 into a lean plan. After that: `dev-implementation`, then review, verification and learning, at standard assurance. No live runs.
- Route impact: unchanged.
