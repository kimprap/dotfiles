# Plan Rule and Craft Skills Activation Refinement

**Datetime**: 2026-07-13-1504
**Scope**: Portable execution-plan rule layering and the activation/evaluation guidance in `craft-rule` and `craft-skill`
**Summary**: Convert the plan content contract from TTSR-only interception into a portable relevance-loaded base, isolate repository storage lifecycle in a companion, and teach both craft skills to evaluate activation timing, transport, discoverability, and execution as separate layers.
**Status**: DONE

## Tasks

- [x] T1. Convert `plan.md` into the portable description-only execution-plan base.
  completed 2026-07-13-1624
- [x] T2. Add `plan-repo-storage.md` and remove machine-specific coupling from `plan-impl-spec.md`.
  completed 2026-07-13-1624
- [x] T3. Refine `craft-rule` activation-timing guidance and evals.
  completed 2026-07-13-1624
- [x] T4. Refine `craft-skill` discovery/transport guidance and evals.
  completed 2026-07-13-1624
- [x] T5. Run static and fresh-session behavioral verification.
  completed 2026-07-13-1624

## Verification / Done criteria

- [x] Both craft-skill evaluation JSON files parse successfully.
- [x] `plan.md`, `plan-repo-storage.md`, and `plan-impl-spec.md` have description-only frontmatter.
- [x] Portable plan semantics, repository storage, and implementation-detail ownership are separated.
- [x] Fresh repository implementation-plan behavior composes the base, storage, and implementation rules.
- [x] Fresh harness-local plan behavior preserves the mandated transport and excludes repository storage mechanics.
- [x] Subscription and database query-plan near misses do not activate execution-plan scaffolding.
- [x] Fresh rule/skill diagnoses distinguish classification, injection, matcher/transport, and post-load execution.
- [x] Final scope and context-growth review found no duplicated portable process or materially expanded craft-skill body.

## Context

Create one durable, repository-backed implementation plan at `/Users/kim/.dotfiles/.agents/plans/2026-07-13-1502_plan-rule-skill-activation.md`; do not implement the rule or skill changes in this execution. The plan must preserve the failure context: a harness-managed `local://…-plan.md` was initially drafted without the custom `plan.md` metadata/tasks because `plan.md` was classified as TTSR and scoped in its body to `.agents/plans/`, while the portable content contract needed to shape reasoning before any write and across transports. The durable plan must fix that layering and refine `craft-rule` and `craft-skill` so future audits distinguish pre-reasoning injection, tool-time interruption, storage transport, filesystem presence, discoverability, and actual execution without adding brittle harness-specific policy to portable cores.

## Approach

### 1. Create the repository plan with exact lifecycle metadata

Create `/Users/kim/.dotfiles/.agents/plans/2026-07-13-1502_plan-rule-skill-activation.md` with this header:

```markdown
# Plan Rule and Craft Skills Activation Refinement

**Datetime**: 2026-07-13-1504
**Scope**: Portable execution-plan rule layering and the activation/evaluation guidance in `craft-rule` and `craft-skill`
**Summary**: Convert the plan content contract from TTSR-only interception into a portable relevance-loaded base, isolate repository storage lifecycle in a companion, and teach both craft skills to evaluate activation timing, transport, discoverability, and execution as separate layers.
**Status**: PENDING
```

The file remains active and unchecked; the user will continue execution from it. Do not edit `plan.md`, either craft skill, or any eval during this materialization task.

### 2. Give the repository plan these stable tasks

Add `## Tasks` immediately after a short context section, with exactly these unchecked task identities and ordering:

- `T1` — Convert `plan.md` into the portable description-only execution-plan base.
- `T2` — Add `plan-repo-storage.md` and remove machine-specific coupling from `plan-impl-spec.md`.
- `T3` — Refine `craft-rule` activation-timing guidance and evals.
- `T4` — Refine `craft-skill` discovery/transport guidance and evals.
- `T5` — Run static and fresh-session behavioral verification.

The detailed approach must use the same `T1`–`T5` codes so checklist order and implementation order cannot diverge.

### 3. Record the issue context and root cause without overclaiming provider internals

The repository plan's `## Context` must establish these observed facts from the current files and session:

- `.config/agents/rules/plan.md` currently has `condition`, `scope`, and `interruptMode`, so by the documented rule classifier it is a TTSR rule rather than an ordinary relevance-loaded rulebook rule.
- Its body says it applies to plans under `.agents/plans/`, while the harness required the canonical plan at `local://agentic-harness-topic-bootstrap-plan.md`.
- Its condition mixes `.agents/plans/`, `plan\.md`, and broad `plans?\b`; `craft-rule` already documents that write matching sees content rather than destination paths and that broad `plans?\b` requires positive/negative checks.
- The first local plan write omitted the custom header metadata and `## Tasks`; those conventions were added only after the user explicitly requested `plan.md` compliance.
- The exact reason the local write interceptor did not fire is unverified; the implementation must fix the architectural mismatch rather than add regex guesses for one harness URI.

State the intended end state: portable plan semantics load before drafting on any durable plan transport; repository naming/archive rules load only for repository-backed plans; implementation detail remains in `plan-impl-spec.md`; optional tool-time enforcement stays outside the portable base.

### 4. Specify T1: refactor `plan.md` into the portable semantic base

The repository plan must direct the future executor to edit `.config/agents/rules/plan.md` as follows:

- Replace its frontmatter with exactly:

  ```yaml
  ---
  description: Use whenever creating, revising, executing, or completing a durable execution plan, including repository plans and harness-managed plan artifacts.
  ---
  ```

- Remove `condition`, `scope`, and `interruptMode`; do not add `alwaysApply`. The base must be a relevance-loaded rulebook rule because it must shape reasoning before the first plan write.
- Retitle it `# Execution plan contract` and make applicability transport-neutral:
  - apply to repository files, harness/session-local artifacts, and later-execution handoffs;
  - skip informal suggestions, conversational checklists, subscription/pricing plans, database query plans, and read-only summaries of archived plans.
- Add transport precedence: a harness-mandated path/name overrides only storage/naming; metadata, tasks, verification, and status lifecycle always apply. Do not copy a session-local plan into the repo unless explicitly requested.
- Keep the universal content contract:
  - metadata fields `Datetime`, `Scope`, `Summary`, `Status` immediately after H1;
  - new plan status `PENDING`; approval alone does not change status; `IN_PROGRESS` begins with T1 execution;
  - stable unchecked `T1`, `T2`, … checklist in `## Tasks` as canonical order;
  - detailed execution sections map one-to-one to task codes when present;
  - `## Verification / Done criteria` remains unchecked until observed;
  - final task cannot complete before all required verification passes;
  - `DONE` requires checked tasks with completion timestamps and an appended Completion Summary;
  - `CLOSED` only on explicit user cancellation;
  - later user overrides are appended to the Completion Summary rather than rewriting historical task outcomes.
- Remove `.agents/plans` filename/location/archive mechanics from this base; T2 owns them.
- Add concise activation checks: three positives (repository plan creation, harness-local plan revision, plan completion) and at least three near misses (subscription plan, query plan, informal bullets/read-only summary).
- Preserve proportionality and decision-completeness, but cut repeated examples or prose that only restates the new companion.

No validator or TTSR shim is added in this pass: the observed failure is classification/layering, and no evidence yet justifies another enforcement surface.

### 5. Specify T2: isolate repository storage and keep the implementation companion portable

The repository plan must direct the future executor to create `.config/agents/rules/plan-repo-storage.md` with description-only frontmatter:

```yaml
---
description: Use when storing, renaming, completing, or archiving a repository-backed execution plan under .agents/plans.
---
```

Its body must:

- apply the base `plan.md` contract first;
- require active plans directly under `.agents/plans/` with `YYYY-MM-DD-HHMM_<slug>.md` names;
- require `Datetime` to match the filename prefix;
- reserve `.agents/plans/` and `archive/` for deliberate plan files only;
- move completed plans to `.agents/plans/archive/` with one atomic move/rename operation; never copy-plus-delete;
- preserve active versus completed location and historical contents;
- state that harness/session-local artifacts do not use repository naming/archive mechanics unless explicitly materialized into the repository;
- document positive and near-miss activation checks.

Edit `.config/agents/rules/plan-impl-spec.md` only to remove machine-specific coupling and reinforce layering:

- replace `Read .config/agents/rules/plan.md first` with `Apply the base \`plan.md\` execution-plan contract first`;
- keep it description-only and implementation-specific;
- do not duplicate base metadata, task lifecycle, or repository storage rules.

### 6. Specify T3: teach `craft-rule` to evaluate activation timing before trigger syntax

The repository plan must direct the future executor to edit `.config/agents/skills/craft-rule/SKILL.md` surgically, preserving its identity and existing useful OMP field catalog:

- Extend `## Choose the enforcement surface` with the portable distinction:
  - use a rulebook rule when guidance must shape reasoning or drafting before a tool call;
  - use TTSR only when prompt/tool arguments contain enough evidence, late interruption is safe, and stream-time correction is the actual requirement;
  - adding `condition`/`astCondition` changes classification, so evaluate bucket and injection timing before tuning regex;
  - separate universal semantic contracts from repository storage companions and harness transport shims; never hide a cross-transport content contract behind a path guard.
- Update `## Evaluate a rule` to test three layers independently:
  1. expected availability/injection time (before reasoning versus tool time);
  2. trigger/matcher behavior on the actual observable surface (intent, content, destination path, AST, tool args);
  3. resulting behavior after activation.
- Require transport variants when the contract is portable: repository path, harness/session-local artifact, and a neighboring non-plan/non-target surface.
- Preserve the existing rule that filesystem/provider presence is not proof that a rule was loaded or won precedence.
- Add only concise bullets; do not copy the `plan.md` incident or make local URI handling a universal rule-authoring requirement.

Update `.config/agents/skills/craft-rule/evals/evals.json`:

- Replace eval 1, which currently assumes a TTSR rule for `local://*-plan.md`, with a scenario where one semantic plan contract must shape both repository and harness-local drafting while repository archival applies only to `.agents/plans/`. Assertions must require a description-only base plus a storage companion, and reject putting the portable contract behind TTSR.
- Refine eval 2 so the expected response first decides whether TTSR is appropriate before narrowing `plans?\b`; retain positive and near-miss validation.
- Keep duplicate-provider cleanup eval 3.
- Add eval 4 for a rule with `condition` that must shape pre-draft reasoning; assertions require diagnosing the TTSR bucket/timing mismatch rather than adding regex.

### 7. Specify T4: teach `craft-skill` to separate presence, discovery, transport, and behavior

The repository plan must direct the future executor to edit `.config/agents/skills/craft-skill/SKILL.md` surgically:

- Correct the frontmatter field catalog:
  - `hide` controls prompt-list visibility where supported;
  - `disableModelInvocation` / `disable-model-invocation` prevents automatic/model invocation and is appropriate only when a user, command, parent skill, or wrapper loads the skill explicitly;
  - `globs` describe related paths but are not proof of activation.
- Add a concise activation/transport principle near `## Thin orchestrator principle`:
  - portable process belongs in the skill body;
  - slash commands, wrappers, globs, and harness metadata are discovery/invocation transports;
  - if natural-language work must be shaped before action, the skill must remain discoverable/model-invoked or an already-loaded parent must explicitly load it;
  - keep manual-only skills manual rather than compensating with `alwaysApply` or duplicated bodies.
- Update `## Evaluate a skill` to evaluate separately:
  1. live inventory/provider precedence;
  2. discoverability and invocation timing for each supported transport;
  3. execution behavior and output after loading.
- Require a near-miss transport case and distinguish filesystem presence from loaded/live activation proof.
- Keep the additions generic; do not mention `plan.md` or OMP `local://` as universal skill policy.

Update `.config/agents/skills/craft-skill/evals/evals.json`:

- Preserve evals 1–4.
- Add eval 5: a skill exists with a good description but has `disableModelInvocation: true`; natural-language requests do not load it, while a slash-command wrapper does. Assertions must distinguish existence, discoverability, wrapper transport, and execution, and must reject `alwaysApply` as the automatic fix.
- Add eval 6: one portable process is exposed through two harness transports. Assertions must keep one reusable skill body and use thin transport adapters rather than duplicate the process.

### 8. Specify T5: verification and completion criteria for the future implementation

The repository plan must include exact checks:

- `python3 -m json.tool .config/agents/skills/craft-rule/evals/evals.json >/dev/null` exits 0.
- `python3 -m json.tool .config/agents/skills/craft-skill/evals/evals.json >/dev/null` exits 0.
- Read the three rule frontmatters and confirm `plan.md`, `plan-repo-storage.md`, and `plan-impl-spec.md` are description-only with no `condition`, `scope`, `interruptMode`, or `alwaysApply`.
- Search active rule/skill files and confirm:
  - the portable base contains no unconditional `.agents/plans` location/archive requirement;
  - only `plan-repo-storage.md` owns `YYYY-MM-DD-HHMM_<slug>.md` and `.agents/plans/archive/`;
  - `plan-impl-spec.md` does not contain the machine-specific `.config/agents/rules/plan.md` path;
  - craft-rule no longer recommends TTSR by default for a cross-transport plan contract;
  - craft-skill does not conflate `hide` with disabled model invocation.
- Run four fresh-session behavioral smoke cases:
  1. durable repository implementation-plan request → base + storage + implementation companion behavior;
  2. durable harness-local plan request → base + implementation companion behavior, harness path preserved;
  3. subscription/query-plan near miss → no execution-plan scaffolding;
  4. rule/skill activation diagnosis prompts from the new evals → responses distinguish classification/injection/transport/execution.
- For smoke cases, verify observable output shape and rule/skill decisions; do not assert exact prose.
- Inspect the final diff for scope and context growth. Prefer replacement/cuts over net-new duplication; if either craft skill grows materially, consolidate neighboring bullets before completing.
- Mark tasks complete with timestamps, set `Status: DONE`, append Completion Summary, and atomically move the durable plan to `.agents/plans/archive/` only after all checks pass.

### 9. Give the repository plan critical anchors and pre-decided contingencies

The repository plan must list no more than these five critical anchors:

1. `.config/agents/rules/plan.md` — current TTSR classification and mixed content/storage contract.
2. `.config/agents/rules/plan-impl-spec.md` — description-only implementation companion to preserve.
3. `.config/agents/skills/craft-rule/{SKILL.md,evals/evals.json}` — enforcement-surface guidance and the flawed local-plan TTSR eval.
4. `.config/agents/skills/craft-skill/{SKILL.md,evals/evals.json}` — invocation metadata and evaluation model.
5. `.agents/plans/archive/2026-06-29-1412_agent-harness-craft-skills.md` — historical origin of the current layering; read-only evidence, never revise.

Its assumptions/contingencies must decide:

- `plan.md` remains the public base rule name so `plan-impl-spec.md` and existing references keep a stable anchor.
- `plan-repo-storage.md` is the new companion name; do not create a harness-specific shim without a reproduced post-refactor miss.
- If the rule provider does not relevance-load description-only `plan.md` in a fresh-session smoke, stop and capture provider inventory/trace evidence before choosing another enforcement mechanism; do not fall back to broad regex or `alwaysApply`.
- If `hide` and disabled invocation semantics differ by harness, state the portable semantic distinction and retain harness-specific field notes only where verified; do not claim unsupported equivalence.
- Archived plans remain unchanged.

## Critical files & anchors

- `/Users/kim/.dotfiles/.config/agents/rules/plan.md` — current base mixes TTSR classification, portable content, and repo storage.
- `/Users/kim/.dotfiles/.config/agents/rules/plan-impl-spec.md` — current description-only companion shows the desired layering pattern.
- `/Users/kim/.dotfiles/.config/agents/skills/craft-rule/{SKILL.md,evals/evals.json}` — current guidance already documents matcher mechanics but lacks pre-reasoning timing evaluation; eval 1 encodes the flawed TTSR assumption.
- `/Users/kim/.dotfiles/.config/agents/skills/craft-skill/{SKILL.md,evals/evals.json}` — current field catalog conflates visibility and disabled invocation; evals do not test transport/discovery failure.
- `/Users/kim/.dotfiles/.agents/plans/archive/2026-06-29-1412_agent-harness-craft-skills.md` — historical rationale for the existing plan/craft layering.

## Verification

After execution, without modifying rule or skill implementation files:

1. `/Users/kim/.dotfiles/.agents/plans/2026-07-13-1502_plan-rule-skill-activation.md` exists directly under the active plan directory.
2. Its H1 metadata block uses the exact datetime, scope, summary, and `Status: PENDING` above.
3. It contains unchecked `T1`–`T5`, a detailed one-to-one approach, `## Verification / Done criteria`, five or fewer critical anchors, and pre-decided contingencies.
4. It contains the observed local-plan miss context and marks the exact interceptor cause as unverified rather than guessed.
5. `git -C /Users/kim/.dotfiles status --porcelain` reports only the new plan file plus any pre-existing user changes; do not stage or commit.

## Assumptions & contingencies

- This execution materializes a durable plan only. It does not edit `plan.md`, create `plan-repo-storage.md`, or modify either craft skill/eval.
- The user explicitly requested the durable path under `/Users/kim/.dotfiles/.agents/plans/`; the session-local plan exists only because the active harness requires `local://` planning transport.
- The fixed filename timestamp is `2026-07-13-1502`, generated during planning. If that exact destination exists at execution time, stop and report it rather than overwrite or choose a new name.
- Existing archived plans are evidence only and remain unchanged.

## Completion Summary

- T1–T2: Replaced the mixed TTSR plan rule with a portable description-only base, added the repository storage companion, and removed the machine-specific implementation-companion path.
- T3–T4: Made both craft skills Agent Skills-compatible across OMP, Grok CLI, and similar hosts; separated portable semantics from provider adapters and added transport/timing eval coverage.
- T5: JSON, static ownership, repository/local/near-miss, and activation-layer smoke checks all passed in fresh sessions.
- Scope stayed compact: the tracked diff is 143 insertions and 150 deletions across six files; the new storage companion is 35 lines; both craft skill bodies decreased from 153 to 149 lines.
- User override: direct requests to execute T1–T5 superseded the original materialization-only instruction. The uncreated `2026-07-13-1502_plan-rule-skill-activation.md` target was not fabricated retroactively; this matching-timestamp `2026-07-13-1504` plan is the execution record.
- Residual risk: invocation metadata and slash syntax remain provider adapters. Live OMP and Grok CLI discovery/invocation were verified; other hosts must verify their own inventory and native invocation seam.
- Outcome: all requested rule, skill, evaluation, and verification work is complete; archive this record with one atomic move.
