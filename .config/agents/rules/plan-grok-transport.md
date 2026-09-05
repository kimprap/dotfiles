---
description: Apply when Grok or another direct-writing harness authors an execution plan in repository-owned storage.
---

# Grok and direct-writing plan transport

Apply `plan.md`, `plan-impl-spec.md` for implementation plans, and `plan-repo-storage.md` for storage. This companion owns only discovery and direct repository authoring.

## Discovery

- Grok discovers this rule through `.grok/rules/plan-grok-transport.md`; do not invent a config key or register a duplicate.
- Discovery proves availability only. It supplies no activation, approval, validation, or runtime state.

## Direct repository path

- Author and revise the complete portable plan directly at `.agents/plans/<Datetime>_<slug>.md` using ordinary repository tools for every lifecycle state, including `DONE` and `CLOSED`.
- Run `executor_plan.py validate PLAN` against that exact active file before publication and readiness. Execution, continuation, and completion use the same current repository file.
- Other harnesses without an OMP local-draft adapter follow this same direct repository path.
- Never move a plan to an archive automatically or remove its active path because of lifecycle state. Existing historical archive identities are read-only conflict surfaces governed by `plan-repo-storage.md`.
- Direct persistence supplies no approval, runtime transition, or completion evidence.

Harness-specific identity presentation, model, role, tools, and recovery stay in the adapter and out of the portable artifact. Disclose actual mechanics without promising transport equivalence.

## Activation checks

Use this rule for Grok discovery or any harness that writes and executes a repository plan directly. Skip OMP local-draft copying and non-plan Markdown.
