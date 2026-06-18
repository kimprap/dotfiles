---
name: improve
description: "Improve current changes or a codebase. quick=lightweight direct edits; direct/no-plan=standard-depth direct edits; standard(default)=compact dated plan; deep=broader dated plan. Use for quality/security/perf/tests/refactor/tooling audits."
---

# /improve

Use the configured model to improve current changes or audit a scope. Quick and direct/no-plan modes edit directly; standard/deep produce executable plans.

Works in any repository, clean or dirty. Respects direct execution vs plan modes.

## Invocation variants

- Bare `/improve` or `/improve standard` → balanced compact plan (default).
- `/improve quick` (anywhere) → lightweight direct work. **Never creates a plan.**
- `/improve direct` or `/improve no-plan` → standard-depth direct work. **Never creates a plan.**
- `/improve deep` (anywhere) → broader coverage/depth. Creates dated plan.
- `/improve <topic>` (e.g. `security`, `comments`, `current-changes`, `architecture`) → focus audit to topic while keeping the selected effort/output mode.
- `/improve direct <topic>` etc. → combine.

Keywords `quick`/`standard`/`deep` affect depth. `direct`/`no-plan` switches standard-depth work from planning to direct execution.

## Effort levels

Depth follows the level (default `standard`):

|                | quick                              | direct / no-plan                     | standard (default)             | deep                           |
|----------------|------------------------------------|--------------------------------------|--------------------------------|--------------------------------|
| **Behavior**   | Direct lightweight refinements.    | Direct standard-depth refinements.   | Focused audit + compact dated plan. | Broader audit + dated plan.    |
| **Scope**      | Diff if present; else targeted.    | Diff + adjacent context/callsites when relevant. | Hotspot or user-specified.     | Broadest practical.            |
| **Plan**       | Never.                             | Never.                               | Yes, proportional.             | Yes, deeper.                   |
| **Verification**| Minimal parse/spot checks.        | Targeted checks for affected behavior. | Plan realism + main coverage.  | Stronger plan quality check.   |

Full audit + heavy verify in quick defeats the mode; direct/no-plan is the deliberate direct mode for that extra scrutiny.

## Determining scope (current changes vs broader)

1. Capture current state with `git status --porcelain`, `git diff --cached`, `git diff`.
2. Quick mode primarily refines the diff when changes exist.
3. Direct/no-plan reviews the diff plus adjacent context, references, callsites, tests, and docs when relevant, then edits directly.
4. Standard/deep may expand from the diff for the requested focus (e.g. `/improve security` covers auth areas).
5. Works on clean trees or user-specified broader scope.

## Core improvement criteria

Apply in all modes (depth varies):

- Concise comments only (drop verbose/historical/obvious).
- Non-brittle implementations (no magic values, fragile assumptions, weak error handling).
- Smart prefactors only when clearly beneficial in scope.
- Avoid slim/one-off helpers unless duplication is significantly reduced.
- Real efficiency or quality wins in the touched code.
- Evidence-backed findings: cite files, lines, observed diffs, or command output; no vibes-only suggestions.
- Surgical: touch only what advances the request.

## Process by mode

**quick mode (no plan ever):**
- Capture relevant diff/state.
- Identify high-confidence low-risk improvements in focus.
- Apply refinements directly (or minimal precise proposals).
- Lightweight verify only on the work (parse + basic checks).
- Summarize and stop. Fast and contained.

**direct/no-plan mode (standard-depth direct work, no plan ever):**
- Capture current diff/state and inspect adjacent context needed to avoid shallow fixes.
- Check references/callsites/tests/docs when relevant to the requested scope.
- Apply targeted refinements directly; keep changes surgical and in scope.
- Run targeted verification for affected behavior.
- Summarize changed files, checks run, and residual risk.

**standard mode (creates dated plan):**
- Balanced audit of scope using core criteria.
- Write one dated plan in `.agents/plans/YYYY-MM-DD-HHMM_IMPROVE_<variant>.md` (use `date +%Y-%m-%d-%H%M`; `<variant>` is the effective mode or focus, e.g. `IMPROVE_deep`, `IMPROVE_security`, `IMPROVE_standard`).
- Follow `references/plan-template.md`: compact by default, expanded only when risk or scope earns it.
- Verify plan realism + coverage of main findings.
- Present plan location. Do not execute unless told.

**deep mode (creates dated plan):**
- Same as standard, but broader/thorough coverage and deeper analysis.
- Plan reflects the extra depth in findings and grouping.
- Use the same improve naming convention (filename will reflect the mode, e.g. `..._IMPROVE_deep`), same location, template, and "present" rules.

No mode keyword → standard plan. `direct` or `no-plan` suppresses plan creation and uses standard-depth direct work.

## Guardrails

- Quick and direct/no-plan: never write plans; quick stays shallow, direct/no-plan uses standard-depth review before editing.
- Standard/deep: always produce a dated plan in `.agents/plans/` using the improve naming convention (`IMPROVE_<variant>` slug) + the header metadata block + Tasks checklist per the plans rule.
- Never destructive actions.
- Respect current changes; do not ignore the actual diff for unrelated work.
- If scope or mode remains ambiguous after parsing keywords, clarify briefly.
- Plans are for review/execution. Do not auto-apply them.
- If `direct`/`no-plan` conflicts with `deep`, ask once before doing broad direct edits.

Always read `references/plan-template.md` and `.config/agents/rules/plans.md` before writing any plan (standard or deep).

This skill is mode-aware: quick is fast/direct; direct/no-plan is standard-depth direct; standard/deep yield proportional structured plans.

