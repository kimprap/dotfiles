# Agent-skills lean-down batch 4

**Datetime**: 2026-09-29-0111
**Scope**: Agent-skills lean-down batch 4 (proposal item 7: merge the five plan rules)
**Summary**: Merge the five plan rules into one portable plan rule (absorbing repository storage and a single on-request archiving statement) plus the unchanged-grammar `plan-impl-spec.md`, move OMP and Grok draft/transport steps into host files under `harnesses/omp/` and `harnesses/grok/`, and migrate every live caller to the current names.
**Status**: DONE
**Completed At**: 2026-09-29-0138

## Outcome and authority

- Outcome: Only `.config/agents/rules/plan.md` and `.config/agents/rules/plan-impl-spec.md` remain as plan rules (and the only plan rules Grok sees through `.grok/rules`); `plan.md` has frontmatter `description` plus `paths: [".agents/plans/**"]`, keeps its existing sections, and gains `## Repository storage` and `## Archiving on request` (the single archive statement among plan rules and host plan files); `plan-impl-spec.md` points to `plan.md` and the host draft adapter it names while its grammar stays byte-identical; new host files `.config/agents/harnesses/omp/plan-transport.md` and `.config/agents/harnesses/grok/plan-transport.md` hold the OMP and Grok transport facts and link back to `rules/plan.md`; every baseline clause has exactly one owner per spec §3; `plan-rethink`, `dev-ticketing`, `improve` (SKILL and template), `init-ask` and ADR-0002 name only current files; the validator, plan-sync extension, copy helper and all guard suites are unchanged and green.
- Authority: Technical specification `.agents/artifacts/2026-09-28_agent-skills-lean-down-batch4-spec.md` revision `agent-skills-lean-down-batch4/spec-v2` (SHA-256 `702c18eaf1148794f87e5b752c55fdffcc5ce3a2f2215dc56f84849baa0ef5af`), which owns the clause-to-owner table (§3), file interfaces and invariants I1–I4 (§4), effects, caller edits and commit boundary (§5), acceptance and check scripts S1–S8 with their SHA-256 values (§6, §6.1), task boundaries (§8) and stops (§9); it derives from the human-approved proposal `.agents/artifacts/2026-09-28_agent-skills-lean-down-proposal.md` (SHA-256 `a1efc66c6e5546f83bb32e22d0b71e24a7d201f5655715c5b3d32cb66b0180f1`) ranked item 7, the human route decisions recorded in spec §1 (migrate every live caller; `.scratch/`, `archive/` and `banks/` untouched; item 15 decided so `references/plan-rethink.md` changes only its pointer line; `paths` narrowing approved), the binding owner intent (lean, host/repo/topic-agnostic, one owner per rule, never lose a rule) and the Reconcile/Retrace guard recorded in spec §1.
- Assurance: standard

## Scope and effects

- Scope: Exactly the thirteen paths in the spec §6.1 S8 allowlist, changed as spec §3–§5 direct: T1 rewrites `.config/agents/rules/plan.md` and `.config/agents/rules/plan-impl-spec.md`, deletes `.config/agents/rules/plan-repo-storage.md`, `.config/agents/rules/plan-omp-transport.md` and `.config/agents/rules/plan-grok-transport.md`, and creates `.config/agents/harnesses/omp/plan-transport.md` and `.config/agents/harnesses/grok/plan-transport.md`; T2 edits the pointer lines in `.config/agents/references/plan-rethink.md` (L12 only), `.config/agents/skills/dev-ticketing/SKILL.md`, `.config/agents/skills/improve/SKILL.md`, `.config/agents/skills/improve/references/plan-template.md`, `.config/agents/skills/init-ask/SKILL.md` and `docs/adr/0002-executor-plans-and-orchestration.md` (L96 bullet and, only if the implementation date differs from 2026-09-28, its `**Updated:**` line). Baseline is `HEAD` `e1877e8` and spec line numbers refer to it (re-locate by content if lines drift). In acceptance checks `Sn` means: extract the spec §6.1 block `Sn` to `/tmp/b4/Sn.py` (creating `/tmp/b4/`) and run `python3 /tmp/b4/Sn.py` from the repository root; a block is every line after the ` ```python ` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ` ``` `; each file holds the block's lines joined with newlines plus one final newline, and `shasum -a 256 /tmp/b4/*.py` must match the §6.1 table (S1 `aeef1aaf6ae1bfd27d81065bf25205069a1fe9ca4de69ee13d627b1ff48678f8`, S2 `94314e90cc918711f6563508120bb8b2998bd05f573670f9d71c8459283591f3`, S3 `cbb94ead6eadc5ab8dbd2bcaba287c4b67b1db19cb98c0ad52856f36ba807c04`, S4 `f0291174c19fecbba257a1ad99f48ed3c053f0597e3697ee728ebc410dc21b43`, S5 `38ea1795125e8ce52374f85e47c27a66b8b2c8e60baa8510b77461603dcb198f`, S6 `901116071c94c0c53cb993e8089d5737bf179a5b6c6d832eed0369f060235356`, S7 `0ffdaba1350d9c0250b44eb98540e051a3d836f274b634e80f66e055d2b31210`, S8 `2ab4e117f2fff38529cffa678889ecfa98af30b07ce7e74df18c646e88450cbe`) before any `Sn` result counts. `LIVE` in AC-11 is the spec §2 pathspec `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md bin .config/scripts ':!.config/agents/references/impl-rethink/MAINTENANCE.md'`, substituted literally. At baseline S1, S2, S4, S5, S6 and S7 fail as expected and S3 and S8 print `ok`. Two serial tasks per spec §8: T1 keeps the rule merge and both host files together because placing every §3 clause needs all five baseline rules in one context (about 3,000 words plus the validator names) and splitting would put the same clauses in two tasks; T2 is six pointer edits that depend on T1 because they name the files and sections T1 creates, and a reviewer can check them without re-reading the clause mapping. An acceptance item the spec lists under both tasks is owned by T2, the last listed task; items the spec lists under one task keep that owner; every earlier listed boundary remains gating: T1 must also observe AC-10, AC-12, AC-13, AC-15 and AC-16 before its Handoff. A failing gating rerun blocks that task's Handoff like an owned check. No T1 check reads a caller file. AC-14 (`npm test`), AC-17 and AC-18 run once, at T2.
- Effects: Repository changes only, cumulative per task and limited to the S8 allowlist: T1 edits two rule files, deletes the three removed rule files from the working tree (authorized deletion; no `git rm`) and creates the two host files; T2 edits the six caller files; writing the throwaway check scripts under `/tmp/b4/`. Between T1 and T2 the callers still name the deleted rules; that intermediate tree is never committed, and T1 and T2 land together in one later commit that is the route's shipping step, not a task effect. No git staging, commits or pushes; no network access; no live OMP or Grok runs; after T1 deletes the three rules, the controller's checkbox and lifecycle updates to this plan follow the current `plan.md` and OMP host file and never consult a deleted rule, even if a running session's rulebook still lists its name; no edits to the validator, its tests or fixtures, `.config/agents/harnesses/omp/extensions/`, `bin/omp-copy-plan-artifact`, `.config/agents/harnesses/omp/config.yml`, `.config/agents/harnesses/grok/config.toml`, bootstrap/link scripts, the `.grok/rules` or `.cursor/rules` symlinks, or `.config/agents/harnesses/omp/agent-return.md`; clean cutover without "formerly" notes, aliases or compatibility text.
- Non-goals: Every other proposal item; any change to plan semantics, lifecycle, grammar, validator, extension or helper behavior; any new rule, skill, field, stage, test or eval case; rewriting historical plans (including the PENDING `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md`), `.agents/artifacts/**`, `.agents/papercuts.json`, `.scratch/`, `archive/` or `banks/`; `craft-rule` (L62–64, L94, L102) and its eval id 1 (spec O2); the `paths` versus path-guard question (spec O1, kept as approved); ADR-0002 lines other than the L96 bullet and `**Updated:**`; any change to `skills/reconcile/`, `skills/retrace/`, `skills/rethink/`, `skills/omp-update/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`; any word or line target for the merged files.

## Tasks

- [x] T1. Merge the plan rules into plan.md and plan-impl-spec.md and move OMP and Grok transport into host files
  completed 2026-09-29-0118
  - Owner: lean-plan-rules-merge-child
  - Depends on: none
  - Targets: .config/agents/rules/plan.md, .config/agents/rules/plan-impl-spec.md, .config/agents/rules/plan-repo-storage.md, .config/agents/rules/plan-omp-transport.md, .config/agents/rules/plan-grok-transport.md, .config/agents/harnesses/omp/plan-transport.md, .config/agents/harnesses/grok/plan-transport.md
  - Acceptance: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
  - Receiver: route-agent dev-implementation controller

- [x] T2. Migrate every live caller to the merged plan rule and host adapters
  completed 2026-09-29-0129
  - Owner: lean-plan-callers-child
  - Depends on: T1
  - Targets: .config/agents/references/plan-rethink.md, .config/agents/skills/dev-ticketing/SKILL.md, .config/agents/skills/improve/SKILL.md, .config/agents/skills/improve/references/plan-template.md, .config/agents/skills/init-ask/SKILL.md, docs/adr/0002-executor-plans-and-orchestration.md
  - Acceptance: AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AC-17, AC-18
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. plan.md frontmatter scoped and descriptive
  Behavior: `plan.md` frontmatter has exactly `description` and `paths: [".agents/plans/**"]`, and the description names identity, approval, lifecycle, completion, `.agents/plans`, drafts and archiving; `plan-impl-spec.md` keeps a description-only frontmatter.
  Check: `S1`; expect `ok`.

- [x] AC-2. Distinctive facts at their new owners
  Behavior: Each distinctive baseline fact is present at its new owner (active and archive paths, `git mv`, validate command, slug form, lifecycle states, rule and host pointers in `plan.md`; the OMP draft, call, warning, protocol error, snapshot and native-review facts in the OMP file; the `.grok/rules` discovery in the Grok file), and neither remaining rule names a removed companion.
  Check: `S2`; expect `ok`.

- [x] AC-3. Kept lines and grammar tail survive
  Behavior: Every non-blank baseline line of `plan.md` and `plan-impl-spec.md` outside the rewritten lines (plan.md L2, L3, L18, L29, L69; impl-spec L13, L44–46) survives, and the grammar from `## Header and sections` to the end is byte-identical.
  Check: `S3`; expect `ok`.

- [x] AC-4. Host files resolve and link back
  Behavior: Both host files exist outside `rules/`, have no frontmatter, link back to `rules/plan.md`, and all their relative links and every `~/.agents/...` path in `plan.md` resolve.
  Check: `S4`; expect `ok`.

- [x] AC-5. Only two plan rules remain
  Behavior: Only the plan rule and the grammar remain as plan rules, and Grok sees exactly those through `.grok/rules`.
  Check: `ls .config/agents/rules/plan*.md .grok/rules/plan*.md`; expect exactly `.config/agents/rules/plan-impl-spec.md`, `.config/agents/rules/plan.md`, `.grok/rules/plan-impl-spec.md`, `.grok/rules/plan.md`.

- [x] AC-6. Validator, helper and extension unchanged
  Behavior: The validator still accepts its fixtures and the copy helper and extension code are unchanged, so grammar and transport behavior did not move.
  Check: `P=".config/agents/skills/dev-implementation/scripts .config/agents/harnesses/omp/extensions bin/omp-copy-plan-artifact .config/agents/harnesses/omp/config.yml .config/agents/harnesses/grok :!.config/agents/harnesses/grok/plan-transport.md"; git status --porcelain -- $P; git diff --name-only e1877e8 -- $P`; expect empty output.

- [x] AC-7. Archive rule stated once
  Behavior: Among the plan rules and host plan files, only `rules/plan.md` mentions archives (the archive rule is stated once).
  Check: `S5`; expect `ok`.

- [x] AC-8. Skill callers name current plan files
  Behavior: `dev-ticketing`, `plan-rethink`, `improve` (SKILL and template) and `init-ask` point only at current plan rules and host adapters and name no removed companion.
  Check: `S6`; expect `ok`.

- [x] AC-9. ADR-0002 bullet updated only
  Behavior: ADR-0002 changes only its `Updated` line and the plan-rules affected-contract bullet, which names the two rules and two host files, all existing.
  Check: `S7`; expect `ok`.

- [x] AC-10. Only batch-4 files differ
  Behavior: Only batch-4 files differ from the baseline (union allowlist; deleted-uncommitted paths count as allowed changes, and untracked files are listed).
  Check: `S8`; expect `ok`.

- [x] AC-11. No live file names a removed rule
  Behavior: No live file names a removed rule.
  Check: `git grep --untracked -n -I -E 'plan-(repo-storage|omp-transport|grok-transport)' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

- [x] AC-12. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-13. Guarded paths and agent-return adapter unchanged
  Behavior: The guarded paths and the agent-return adapter (the link pattern this batch copies) are unchanged against the baseline and the working tree.
  Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; git status --porcelain -- $P; git diff --name-only e1877e8 -- $P`; expect empty output.

- [x] AC-14. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

- [x] AC-15. Prompt files load offline
  Behavior: The real protocol and Retrace prompt files still load offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-16. Plan validator suite passes
  Behavior: The plan validator suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

- [x] AC-17. Plan-sync suite passes
  Behavior: The plan-sync extension suite still passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-18. Papercut ledger suite passes
  Behavior: The papercut ledger suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff; resume at the first incomplete task in T1 → T2 order within this plan's authority. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`; rollback of listed paths (including restoring the three deleted rules) is the owner's call through git against baseline `e1877e8`, and implementation performs none.
- Stops: Any guard check (AC-12 through AC-18) fails at any boundary where it runs; any owned check or gating boundary rerun named in Scope fails after permitted repair; an extracted `Sn` script's SHA-256 differs from spec §6.1; a baseline clause has no owner in spec §3, or its owner file would not hold it; keeping the grammar byte-identical conflicts with a needed pointer edit; any change would touch a path outside the S8 allowlist, the validator, extension or helper, a guarded path, `agent-return.md`, or git state, or need an undeclared effect; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: five plan rules reduced to `rules/plan.md` (identity, lifecycle, completion, repository storage, archiving on request; `paths: [".agents/plans/**"]`) and `rules/plan-impl-spec.md` (grammar); OMP draft-copy and Grok discovery steps moved to `harnesses/omp/plan-transport.md` and `harnesses/grok/plan-transport.md`, named from `plan.md`; archive bans stated once; every live caller migrated; ADR-0002's affected-contracts bullet updated.
- Tasks: T1 attempt 2 (review CR-1 restored the exact-byte active-result recheck); T2 attempt 1.
- Authority: spec-v2 erratum narrowed AC-6's pathspec to exclude the new Grok host file; behavior unchanged. Item 15 kept by owner decision.
- Assurance: review CHANGES_REQUIRED (CR-1) then repaired; verification VERIFIED, AC-1..AC-18 and CR-1 closure pass; `Learning: no durable learning` (E1 recurring boundary-unsatisfiable AC deferred as evidence).
- Commits: none. Nothing pushed.
