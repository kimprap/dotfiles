# Terminal envelope and lean completion protocol

**Status:** ACTIVE  
**Date:** 2026-08-21  
**Updated:** 2026-09-16  
**Decision ID:** D27  
**Related authority:** ADR-0001 D02, D17; ADR-0002 D29; ADR-0004 D07; ADR-0007 D24

## Scope

This record governs stateless workflow-session envelopes, lean internal Handoffs, the exact generic completion payload, and same-agent rendering. It applies to `dev-ask`, `product-ask`, `dev-handoff`, `completion-presentation`, the implementation terminal path, caller projections, and focused evals. It does not create persistence, resume, background jobs, product authority, implementation authority, delivery, or shipping.

## Context / problem

Specialty workflows need enough typed transport to preserve ownership and recovery within one active conversation, but process receipts and multi-report terminal formats had become larger than the work they described. Completion should tell a human what happened, what changed, what was checked, what remains, and what to do next—without a digest, manifest, archive ceremony, or model-scored proof layer. The workflow also must remain portable across hosts that cannot resume a hidden process.

## Decision

### D27 — Stateless envelope and five-field completion

- **Decision:** Treat one active conversation as one workflow session. Bind a `Session Envelope` with session ID, route, mode, current phase, active artifact ID or path when one exists, current owner, last accepted Handoff, next owner, last completed transition, and pending gates. This envelope is typed transport, not durable state. A route-owning agent may change from router to controller role in place without changing physical identity or creating a self-Handoff.
- **Decision:** Use the current workflow sequence `intake → classify → work specialty → Handoff at a real ownership or context boundary → papercut → assurance and learning when eligible → present`. A boundary-crossing completed stage emits one lean Handoff containing outcome, affected paths and revisions, checks and exact results, blockers or risks, remaining work, and one concrete bound receiver. Semantic next-owner roles such as `dev-implementation` and `dev-ask` remain distinct from that physical receiver identity. An in-place controller consumes child and assurance returns, controller conclusions, and current plan evidence without a Handoff to itself; an approved delegated controller returns one Handoff to the concrete route owner.
- **Decision:** Missing or malformed required transport stops the next transition. Required owner identities are reused or resumed rather than replaced. A fresh or resumed session re-reads current repository artifacts and governing contracts; it does not trust hidden process state or a continuation receipt.
- **Decision:** A successful generic terminal payload has exactly these five top-level fields in this order:

  ```text
  Outcome
  Changes
  Checks
  Risks
  Next
  ```

- **Decision:** `Checks` contains executed checks with exact outcomes, all papercut result lines in boundary and authored-task order or `Papercut: none`, and the normalized learning line. Compact uses `Learning: skipped for compact`. Standard/high uses `Learning: curated`, `Learning: no durable learning`, or `Learning: blocked <reason>`.
- **Decision:** For implementation completion, `Changes` or `Checks` identifies the current active `DONE` plan path when a plan existed. Completion does not require, create, move to, or cite an archive. It carries no plan digest, result manifest, generation map, receipt, repair grant, or model grade.
- **Decision:** Ordinary learning failure remains a `Risk` and still permits presentation. A current governing-rule conflict that directly invalidates or makes the settled implementation unsafe blocks successful completion. Other incomplete required stages use the owning workflow's typed blocked or stopped report rather than the success payload.
- **Decision:** The same agent that validated terminal success invokes `completion-presentation` only as a deterministic renderer of the already-complete five-field payload. The renderer checks only the input format and performs no success validation, routing, state transition, Handoff, artifact publication, delivery, or shipping.
- **Decision:** The schema and input validation rules live only in [the canonical completion input contract](../../.config/agents/references/completion-presentation-input.md). Callers read it before building the input, then pass the input to the render script in a tool call, never in the reply; the reply is the script output. Reading the contract does not activate presentation.
- **Decision:** Generic and product callers share the five-field shape but keep their own authority. `product-ask` reports Product Handoff, approved PRD or iteration, human decision, papercut, learning, risks, and next product owner without implying engineering implementation or shipping.

## Why

A small stable envelope preserves intra-session control while repository artifacts remain the source of truth. Five human-centered fields provide enough terminal evidence without a second protocol stack. Same-agent rendering prevents presentation from becoming another workflow stage.

## Rejected alternatives

- **Durable session ledgers or continuation receipts:** duplicate plans and Handoffs and do not port reliably across hosts.
- **Twelve-field completion:** overfits internal machinery and exposes process rather than outcome.
- **Digests, manifests, proof recipes, generation maps, or model grading:** add parallel evidence systems without improving direct checks.
- **Archive-gated presentation:** couples semantic completion to a storage move.
- **Presenter-owned validation or transition:** lets formatting reopen settled workflow state.
- **Shipping recommendations in `Next`:** conflate local completion with separately authorized delivery.

## Consequences

- Hosts may transport the envelope in memory, task context, or an equivalent native structure; no common background-job substrate is required.
- Handoffs stay lean and revision-aware enough for one concrete bound receiver to continue; in-place role changes create no ceremonial self-Handoff.
- Successful output is always recognizable by its exact five top-level fields.
- Papercut and Learning are visible under `Checks`, and ordinary learning failure remains visible under `Risks`.
- Planned completion references the active `DONE` plan and leaves historical archives untouched.
- The renderer is optional presentation machinery, not a new owner or gate.

## Affected contracts

- `.config/agents/skills/dev-ask/SKILL.md`, `WORKFLOW.md`, `references/execution-flow.md`, and focused evals.
- `.config/agents/skills/product-ask/SKILL.md`, `WORKFLOW.md`, and focused evals.
- `.config/agents/skills/dev-handoff/SKILL.md`, `completion-presentation/SKILL.md`, implementation terminal behavior, plan lifecycle, papercut, and learning.
- Stale-contract scans and ADR discovery.

## Evidence / source revisions

- Current governing authority: `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`, and `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`.
- Earlier completion and session records remain historical support only where consistent with this clean cutover.

## Human authority

The human-approved lean workflow authorizes this session and terminal projection. It does not authorize implementation, product approval, external effects, publication, delivery, deployment, or shipping.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes D27 and updates the index. The five-field payload cleanly replaces the prior expanded completion shape.

## Verification expectations

- Generic and product fixtures require exactly `Outcome`, `Changes`, `Checks`, `Risks`, and `Next` in order.
- Checks include papercut and learning dispositions; compact and standard/high behavior differ exactly as specified.
- Planned completion cites the current active `DONE` path and does not create or require an archive.
- Same-agent presenter calls check only the input format, render only a complete success payload, and never route, validate success or evidence, dispatch, publish, deliver, or ship.
- Blocked and stopped workflows do not emit a misleading success payload.
