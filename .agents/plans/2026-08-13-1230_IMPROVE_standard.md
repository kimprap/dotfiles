# Improvement Plan: Finish the lean plan-rule cutover

**Datetime**: 2026-08-13-1230
**Authority kind**: direct-repository
**Mode**: standard
**Scope**: Second-pass refinement of the five shared global plan rules changed in the current worktree
**Summary**: Restore a few precision clauses lost during compression, correct one inaccurate storage-helper claim, and remove generic preflight duplication from the harness shims without changing ADR-0002 semantics or executable behavior.
**Status**: PENDING

## Findings

- `.config/agents/rules/plan.md:30-33` — the lean header contract preserves strict UTF-8 and byte-significant revisions but no longer states the validator's accepted CRLF/mixed-line-ending behavior, bare-CR rejection, or misplaced-marker rejection → restore these as one concise clause. `.config/agents/skills/dev-implementation/scripts/test_executor_plan.py:129-275` proves all three boundaries.
- `.config/agents/rules/plan-impl-spec.md:30-35,78-86` — `Project authority` is ambiguous, explicit no-effect backing and capability-mismatch stopping were compressed away, and the parser command lost its repository-relative executable path → correct the wording and restore only those execution-critical constraints.
- `.config/agents/rules/plan-repo-storage.md:36-44` — `Use the repository's existing helper/adapter implementation` incorrectly implies a direct-authority writer exists. `bin/omp-copy-plan-artifact:444-477` accepts only `local-authority` sources → name the existing helper only for local projections and keep the shared protocol mandatory for direct writers.
- The generic `executor-plan-validation/v1`, `executor-plan-preflight/v1`, `eligible`, digest, and native-approved-revision rules are repeated across the base, implementation, OMP, and Grok files. The implementation companion should own shared parser semantics; transport shims should retain only context and locator mapping.
- `.config/agents/rules/plan-omp-transport.md:2,37-39` declares a session-local-only activation surface, while lines 21, 23, and 30 also prescribe direct-repository behavior → remove that contradiction and leave repository-native authority to `plan.md` plus `plan-repo-storage.md`. Grok intentionally retains both session- and repository-backed mappings.

## Scope

**In scope**:
- `.config/agents/rules/plan.md` at SHA-256 `575530f751b075f8fe9ad53245cb4f07373f238875444a52353ef1c959089910`
- `.config/agents/rules/plan-impl-spec.md` at SHA-256 `daed06360c0b10591ff55592a47acaa0d3fcf8eb744040ad00ddc16955db56e1`
- `.config/agents/rules/plan-repo-storage.md` at SHA-256 `addf929eb42d68db2d8d5546a9ea79e9b4e4850475da21f2c0e530ea29c7a570`
- `.config/agents/rules/plan-grok-transport.md` at SHA-256 `e0d98044b57b74099263b04a4b458c87fc9d7c62079e2a02f6c8d1406caba074`
- `.config/agents/rules/plan-omp-transport.md` at SHA-256 `d55bb95250124558641a4c29430bb2acb323ec8355e827a4747da6fe56a47605`

**Out of scope**:
- `.config/agents/skills/dev-implementation/scripts/executor_plan.py`, `bin/omp-copy-plan-artifact`, and their tests — enforcement evidence only; no behavior change is required.
- `.config/agents/skills/improve/`, `.config/agents/skills/dev-ask/`, and other skills — no rule-authoring contract change.
- `docs/adr/0002-executor-plans-and-orchestration.md` and `WORKFLOW.md` — current authority remains unchanged; revise only if execution discovers a semantic change rather than a prose correction.
- All unrelated staged, unstaged, and untracked user work.

## Tasks

- [ ] T1. Restore precision in the shared base and companions
  - Keep every rule description-only; add no `alwaysApply`, TTSR condition, scope, or interrupt metadata.
  - Add one concise header-compatibility sentence to `plan.md`; do not restore parser implementation prose elsewhere.
  - In `plan-impl-spec.md`, clarify that plans project authority, require an explicit authority-backed `none` effect, make capability mismatch fail closed absent the approved downgrade, and use the exact repository-relative parser path.
  - In `plan-repo-storage.md`, distinguish the existing local projection helper from a protocol-conforming direct writer; preserve the five-step generation protocol unchanged.
- [ ] T2. Reduce OMP and Grok transports to adapter-only policy
  - Reference the shared parser contract instead of repeating schema, digest, eligibility, and generic approval rules.
  - Retain each harness's exact `context`, presented-path, local-counterpart, and unavailable-mapping behavior.
  - Keep Grok's session/direct authority mapping and direct-writer boundary.
  - Keep OMP native review, `local://` lifecycle, automatic projection sync/archive, warning/effect handling, and orchestration attestation; remove repository-native instructions that contradict its local-only activation surface.
- [ ] T3. Verify preservation, activation, and net reduction
  - Re-run targeted parser and projection tests, fresh-session rule discovery, and positive/near-miss activation checks.
  - Confirm all five frontmatter blocks contain only `description`, every load-bearing contract fragment remains, generic preflight duplication decreases, and combined bytes do not increase from 24,852.
  - Review only the five-rule diff; preserve unrelated work and update no ADR unless a semantic decision actually changes.

## Verification / Done criteria

- [ ] `python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py` exits 0 with 16 tests passing.
- [ ] `bun test ./.config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js` exits 0 with 48 tests passing.
- [ ] A fresh `omp -p --no-session --tools=read` session resolves all five `rule://` names and sees the revised headings/contracts.
- [ ] A durable OMP implementation-plan scenario selects `plan`, `plan-impl-spec`, `plan-omp-transport`, and `plan-repo-storage`; a SaaS subscription-plan comparison selects none.
- [ ] Frontmatter validation reports exactly one nonempty `description` field per rule and no TTSR or always-apply metadata.
- [ ] The combined five-rule size is at most 24,852 bytes and generic preflight semantics have one portable owner plus only adapter-specific bindings.
- [ ] `git diff --check -- .config/agents/rules/plan.md .config/agents/rules/plan-impl-spec.md .config/agents/rules/plan-repo-storage.md .config/agents/rules/plan-grok-transport.md .config/agents/rules/plan-omp-transport.md` exits 0.
- [ ] The final scoped diff changes only the five named rule files and preserves ADR-0002's portable-plan, authority, lifecycle, storage, OMP, and Grok decisions.

## STOP conditions

- Any in-scope file no longer matches its recorded SHA-256 before execution; re-audit instead of applying stale edits.
- A proposed cut removes unique authority, lifecycle, locator, generation, sync/archive, warning/effect, or capability semantics rather than duplicated explanation.
- Evidence shows OMP's local transport currently owns repository-native direct-authority execution; resolve that contract before removing its direct-path clauses.
- Correctness requires changing executable helpers, skills, workflow authority, or ADR-0002; stop and route that broader change separately.
