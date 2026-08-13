---
name: init-ask
description: >
  Inspect and initialize supported repository-scoped agent integrations through one exact approval
  gate. Use only when invoked by exact skill name or when the user explicitly asks to set up the
  repository's agent integrations; never use for ordinary repository work.
---

# Repository Integration Setup

Provide one portable, repository-scoped setup interface. Own inspection, the fixed inventory, one exact proposal, approval/recheck, owner-preserving application, and the result. Do not own the integrated artifacts or create a setup workflow, plan, registry, helper, queue, or background process.

## Invocation contract

One invocation has two conversational phases:

1. **Inspect and propose.** Inspect the current repository read-only. Return the complete fixed catalog, exact evidence, and every proposed path and effect. Write nothing.
2. **Recheck and apply.** Continue only after the human replies exactly `approve` to that proposal. Recheck every proposed path and baseline before any write, apply only the unchanged approved effects through their existing owners, then return `changed | unchanged | blocked` for each effect.

The proposal lives only in the current conversation. Any different response, requested edit, expired context, unavailable baseline, affected-path drift, or changed effect returns to phase 1. Unrelated repository changes do not invalidate an exact unaffected baseline. Never infer approval from intent, prior approvals, route approval, or a broad affirmative.

## Read boundary

Resolve one repository root and inspect only evidence needed for the catalog:

- repository-owned guidance and declared conventions;
- installed artifact-owner skill interfaces;
- current plan, ADR, papercut, domain, product, repository rule/skill, tracker-mapping, and memory seams;
- repository manifest and bootstrap mapping as read-only preservation evidence.

Prefer paths declared by repository guidance. Otherwise use the conventional paths named below only as discovery candidates; do not materialize them. Inspect repository memory configuration or path presence only, never memory contents. A path escape, symlink where a regular repository-owned path is required, non-regular file, unreadable target, conflicting owner, malformed integration, or unclear write authority is `blocked`, not a reason to guess.

## Fixed catalog

Report all nine rows in this order. Use only `integrated | proposed | on-demand | blocked | planned`.

| Integration | Conventional seam | Current owner | Status rule |
|---|---|---|---|
| Repository guidance | repository-declared guidance, otherwise `.agents/AGENTS.md` | human repository owner and current guidance convention | `integrated` when usable guidance exists; `proposed` only for concrete repository-specific bytes that can be created or merged without replacing current guidance; otherwise `on-demand` or `blocked` |
| Dev plan storage | `.agents/plans/` plus current plan transport/storage rules | `plan` and its repository/harness transport rules | `integrated` when declared and usable; otherwise `on-demand`; never create an empty directory |
| ADR registry | `docs/adr/INDEX.md` | `dev-domain-modeling` | `integrated` when a current registry exists; otherwise `on-demand`; malformed or conflicting authority is `blocked` |
| Papercuts | `.agents/papercuts.json` plus installed `papercut` skill | `papercut` | `integrated` when current validation succeeds; `proposed` when absent and exact repository opt-in can call `papercut init`; invalid or unsafe storage is `blocked` |
| Domain context and ADRs | repository-declared context, otherwise `CONTEXT.md`, `CONTEXT-MAP.md`, and `docs/adr/` | `dev-domain-modeling` | `integrated` when current semantic artifacts exist; otherwise `on-demand`; never invent domain content |
| Product artifacts | repository-declared product path, otherwise `docs/product/` | `product-ask` and `product-prd` | `integrated` when current product authority exists; otherwise `on-demand`; setup grants no product authority |
| Repository rules and skills | repository-declared rule/skill paths | `craft-rule` and `craft-skill` | `integrated` when current repository-owned modules exist; otherwise `on-demand`; never create empty modules |
| Tracker mapping | repository-declared tracker integration | declared tracker owner, such as `dev-triage` | `integrated` when a current repository mapping exists; otherwise `on-demand`; missing/conflicting ownership is `blocked` only when setup is presently required |
| Agent memory | repository-declared generic agent-memory seam | separately approved future owner | always `planned` until an approved generic implementation exists; existing Mnemopi or user memory is not this integration |

`integrated` means the current repository already has a usable exact seam. `proposed` means one concrete, safe repository-local setup effect is missing and ready for this approval. `on-demand` means its owner exists but no real content currently justifies materialization. `blocked` names the exact conflict, owner, and resume condition. `planned` is reserved for agent memory under the current contract.

## Phase 1 output

Return exactly these sections:

```markdown
## Repository integration inventory
| Integration | Status | Evidence | Owner / resume condition |
|---|---|---|---|
| ...all nine fixed rows... |

## Proposed effects
- E1 — <owner>
  - Path: <exact repository-relative path>
  - Baseline: absent | SHA-256 <64 lowercase hex>
  - Effect: <exact bytes or exact owner operation and resulting format>
  - Preserves: <named existing bytes and authority boundaries>

## Approval
Reply exactly `approve` to apply only E1, ... after an affected-path recheck.
```

When there is no safe missing opt-in, write `None — repository setup is unchanged.` under `Proposed effects` and omit the approval request. Never hide a proposed write behind `on-demand` or propose an effect without its exact path, baseline, resulting behavior, and owner.

## Proposal rules

- Propose `papercut init` only when the ledger is absent, the installed current skill supports it, and repository write authority is available. The effect is exactly one empty current-format ledger at `.agents/papercuts.json`; it does not capture a record.
- Propose repository guidance only when concrete repository facts and exact destination bytes are available. For an existing file, present a minimal merge against its SHA-256 baseline and preserve all current content not explicitly changed. Never replace or normalize it wholesale.
- Leave plan, domain, ADR, product, rule/skill, tracker, and memory artifacts lazy unless real current content and their existing owner independently authorize materialization. Setup approval does not replace product, domain, plan, tracker, destructive-effect, delivery, or shipping approval.
- A fully integrated repository is unchanged. A partial repository proposes only its missing safe opt-ins. A conflict is blocked at its exact owner; never repair it inside setup.

## Phase 2 procedure

1. Confirm the reply is exactly `approve` and still refers to the complete current proposal.
2. Re-resolve the repository root. Re-read or hash every proposed target and every named preservation precondition. Validate all effects before the first mutation.
3. If an affected baseline or effect changed, write nothing. Return the drifted path, old and current identities, `blocked`, and the need for a new proposal. Do not retry or partially apply the old proposal.
4. Apply each unchanged effect once through its named owner. For papercuts, resolve `scripts/papercut_ledger.py` relative to the installed `papercut` skill and call only `init --repo <exact-root>`. Treat its one JSON success object or stable error as mechanics, not semantic authority.
5. Re-read every changed target and verify the proposed result. Preserve every non-target byte and every existing authority boundary.
6. Return exactly one concise result table with `Effect | Result | Evidence`. Use only `changed | unchanged | blocked`. Name report-only failures; never claim a write that was not observed.

An owner-reported idempotent result is `unchanged`. A helper, permission, lock, validation, or owner failure is `blocked`; disclose it without fallback or broader writes.

## Prohibited effects

Never create empty `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, `docs/product/`, `.agents/plans/`, repository rules/skills, tracker mappings, or memory directories. Never edit or initialize user-level guidance, credentials, memory, trackers, bootstrap configuration, manifest entries, staging, commits, pushes, releases, deployments, rollout state, or external systems. Never inspect transcripts, histories, secrets, or memory contents. Never create a persistent setup record.

## Portability

OMP `/skill:init-ask` and Grok `/init-ask` use this same body. Invocation syntax changes no catalog, status, approval, owner, or effect semantics.
