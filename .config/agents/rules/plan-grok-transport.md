---
description: Apply when Grok or another direct-writing harness authors an execution plan in repository-owned storage.
---

# Grok and direct-writing plan transport

Apply `plan.md`, `plan-impl-spec.md` for implementation plans, and `plan-repo-storage.md` for storage. This companion owns only discovery and direct repository authoring.

## Discovery

- Grok discovers this rule through `.grok/rules/plan-grok-transport.md`; do not invent a config key or register a duplicate.
- Discovery proves availability only. It supplies no activation, approval, validation, runtime state, or orchestration capability.

## Direct repository path

- Author and revise the complete portable plan directly at `.agents/plans/<Datetime>_<slug>.md` using ordinary repository tools.
- Run `executor_plan.py validate PLAN` against that exact active file before publication and readiness. Execution and continuation use the same current repository file.
- Other harnesses without an OMP local-draft adapter follow this same direct repository path.
- Use `plan-repo-storage.md` for exact identity, conflicts, safe terminal movement, and storage-failure behavior. Storage success supplies no approval or completion evidence.

Harness-specific identity presentation, model, role, tools, and recovery stay in the adapter and out of the portable artifact. Disclose actual mechanics without promising transport equivalence. For every approved parser-valid implementation plan, bind a current provider-neutral Orchestrator Role Profile and fresh attestation and use `assess-plan-backed`; continue only on `full-orchestration` with `downgrade: none`. Rule discovery cannot attest capability, authorize root work, or supply a fallback topology. Under `PROMOTE-SERIAL-DEFAULT`, native child dispatch uses full orchestration with runtime concurrency one by default, not a sequential-child mode, and makes no general efficiency claim.

## Activation checks

Use this rule for Grok discovery or any harness that writes and executes a repository plan directly. Skip OMP local-draft copying and non-plan Markdown.
