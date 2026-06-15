---
name: improve
description: "Improve any codebase or current changes. quick=lightweight direct (no plan); standard (default)=audit+dated plan; deep=thorough audit+plan. /improve <topic> or /improve quick/deep focus scope and effort."
---

# /improve

Use the model configured when this slash command is triggered to audit and improve code; in standard/deep, produce clear executable plans.

Works in any repository (clean or dirty tree). Respects quick (direct edits, no plan) vs plan modes.

## Invocation variants

- Bare `/improve` or `/improve standard` → balanced (default). Creates dated plan.
- `/improve quick` (anywhere) → lightweight direct work. **Never creates plan.**
- `/improve deep` (anywhere) → max coverage/depth. Creates dated plan.
- `/improve <topic>` (e.g. `security`, `comments`, `current-changes`, `architecture`) → focus audit to topic (still respects effort level).
- `/improve quick <topic>` etc. → combine.

Keywords `quick`/`standard`/`deep` anywhere affect only effort.

## Effort levels

Depth follows the level (default `standard`):

|                | quick                              | standard (default)             | deep                           |
|----------------|------------------------------------|--------------------------------|--------------------------------|
| **Behavior**   | Direct lightweight refinements. No plan. | Structured audit + dated plan. | Thorough audit + dated plan.   |
| **Scope**      | Diff if present; else targeted.    | Hotspot or user-specified.     | Broadest practical.            |
| **Plan**       | Never.                             | Yes.                           | Yes (deeper).                  |
| **Verification**| Minimal (parse + spot checks).    | Plan realism + main coverage.  | Stronger plan quality check.   |

Full audit + heavy verify in quick defeats the mode.

## Determining scope (current changes vs broader)

1. Capture current state with `git status --porcelain`, `git diff --cached`, `git diff`.
2. Quick mode primarily refines the diff when changes exist.
3. Standard/deep may expand from the diff for the requested focus (e.g. `/improve security` covers auth areas).
4. Works on clean trees or user-specified broader scope.

## Core improvement criteria

Apply in all modes (depth varies):

- Concise comments only (drop verbose/historical/obvious).
- Non-brittle implementations (no magic values, fragile assumptions, weak error handling).
- Smart prefactors only when clearly beneficial in scope.
- Avoid slim/one-off helpers unless duplication is significantly reduced.
- Real efficiency or quality wins in the touched code.
- Surgical: touch only what advances the request.

## Process by mode

**quick mode (no plan ever):**
- Capture relevant diff/state.
- Identify high-confidence low-risk improvements in focus.
- Apply refinements directly (or minimal precise proposals).
- Lightweight verify only on the work (parse + basic checks).
- Summarize and stop. Fast and contained.

**standard mode (creates dated plan):**
- Balanced audit of scope using core criteria.
- Write one dated plan named `plans/YYYY-MM-DD-HHMM_IMPROVE_<variant>.md` (use `date +%Y-%m-%d-%H%M`; <variant> is the effective mode or focus from the invocation, e.g. `IMPROVE_deep`, `IMPROVE_security`, `IMPROVE_standard`).
- Follow layout in `references/plan-template.md` (includes required **Combined Tasks** per the plans rule).
- Verify plan realism + coverage of main findings.
- Present plan location. Do not execute unless told.

**deep mode (creates dated plan):**
- Same as standard, but broader/thorough coverage and deeper analysis.
- Plan reflects the extra depth in findings and grouping.
- Use the same improve naming convention (filename will reflect the mode, e.g. `..._IMPROVE_deep`), same location, template, and "present" rules.

No mode keyword → standard.

## Guardrails

- Quick: never write plans or do heavy full-repo audit/verification.
- Standard/deep: always produce a dated plan in `plans/` using the improve naming convention (`IMPROVE_<variant>` slug) + Combined Tasks per the plans rule.
- Never destructive actions.
- Respect current changes; do not ignore the actual diff for unrelated work.
- If ambiguous (scope/mode), clarify briefly.
- Plans are for review/execution. Do not auto-apply.

Always read `references/plan-template.md` and `.config/agents/rules/plans.md` before writing any plan (standard or deep).

This skill is mode-aware: quick is fast/direct; standard/deep yield reusable structured plans.

