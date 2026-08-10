---
description: Use for Grok materialized execution plans to bind repository or session storage to the same portable Executor Plan body, revision, and structural validator.
---

# Grok plan transport

Apply `plan.md` and, for implementation plans, `plan-impl-spec.md`. This companion changes only transport. Current Grok project discovery loads `.grok/rules/plan-grok-transport.md`; in this repository `.grok/rules` resolves to the shared `.config/agents/rules` source, so no invented config key or duplicate rule registration is required. Discovery proves availability only, not invocation, approval, plan identity, validator success, or parent capability.

A Grok repository- or session-backed plan binds the exact portable body bytes and approved revision. Planner preflight invokes `.config/agents/skills/dev-implementation/scripts/executor_plan.py <plan> --context grok --consumer planner` before publication; backend preflight invokes that same file and parser with `--consumer backend` before mutation. Both bind the returned plan digest and complete validator result. Missing exact body/revision binding, a non-valid result, parser disagreement, or an unavailable validator fails closed.

Grok storage, identity presentation, model, role, tool, and recovery mechanics may differ from OMP's session-local authority, byte-exact repository projection, synchronization extension, and automatic projection-only archival. The adapter must disclose its actual mechanics and must not reinterpret portable sections, create a semantic sidecar or second parser, infer approval from storage, promise identical transport, or place provider, model, role, tool, credential, fallback, or runtime state inside the portable plan. Full orchestration separately requires the provider-neutral parent profile's exact live no-fallback assessment; config or rule discovery cannot supply attestation. The only eligible downgrade is the exact plan-approved one-qualified-owner sequential projection, and it is not a transport equivalence claim.
