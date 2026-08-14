---
description: Apply to Grok materialized execution plans that bind repository or session storage to the portable plan contract and shared validator.
---

# Grok plan transport

Apply `plan.md`, `plan-impl-spec.md` for implementation plans, and `plan-repo-storage.md` for repository materialization. This companion owns only Grok discovery and transport binding.

## Discovery and authority

- Grok discovers this shared rule through `.grok/rules/plan-grok-transport.md`; do not invent a config key or register a duplicate. Discovery proves availability only—not activation, approval, identity, validation, or capability.
- A session-backed authority declares `Authority kind: local-authority`; an authority stored directly at its exact repository active/archive path declares `direct-repository`.
- Actual verified storage selects the marker. `context=grok`, provider name, equality, path presence, and history never infer or change authority.

## Validation and backend preflight

Planner publication invokes the shared parser contract from `plan-impl-spec.md` with `--context grok --consumer planner` and no locators.

Before readiness, the Grok adapter binds the current canonical repository root, actual session/local root, exact same-identity session counterpart, stable slug, and presented authority path, then runs:

```text
executor_plan.py PLAN --context grok --consumer backend \
  --slug SLUG \
  --repository-root ABS_REPOSITORY_ROOT \
  --local-root ABS_LOCAL_ROOT \
  --local-plan ABS_LOCAL_PLAN
```

`PLAN` is the exact session path for local authority or exact active/archive path for direct authority. Always supply the exact session counterpart, including when safely absent. If the adapter cannot name this mapping, stop with `PLAN_PREFLIGHT_UNAVAILABLE`.

Apply the shared backend result contract from `plan-impl-spec.md`. Missing mapping, marker/location mismatch, direct/local conflict, or exact-path ambiguity keeps every task non-ready. The adapter supplies no approval, role, authority outcome, or expected-state assertion.

## Adapter boundary

- Grok storage, identity, tools, model, and recovery may differ from OMP. Disclose actual mechanics; never promise transport equivalence.
- A direct repository writer must use the shared generation protocol in `plan-repo-storage.md` or fail without mutation. Do not use the OMP projection helper for direct authoring.
- Do not reinterpret portable sections, add a semantic sidecar/parser, infer approval from storage, or put provider, model, role, tool, credential, fallback, or runtime state in the portable plan.
- Full orchestration requires a fresh provider-neutral parent-profile assessment. Rule/config discovery cannot attest capability. On mismatch, stop `transport-unavailable` unless the plan already approves a contract-preserving one-qualified-owner sequential projection.

## Activation checks

Use this rule for creation, revision, validation, or execution of a materialized Grok plan backed by session or repository storage. Skip OMP-local transport and non-plan Markdown.
