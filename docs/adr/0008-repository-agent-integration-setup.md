# Repository agent integration setup

**Status:** ACTIVE  
**Date:** 2026-08-12  
**Updated:** 2026-08-25
**Decision IDs:** D25  
**Related authority:** ADR-0001 D02, D12, D15; ADR-0005 P07; ADR-0007 D24

## Scope

This decision governs one repository-scoped setup interface for supported durable agent integrations. It applies to the portable `init-ask` skill and its evals. It coordinates existing artifact owners but does not own their semantic content, create a setup registry, change bootstrap behavior, or authorize user-level, product, domain, tracker, memory, delivery, or external effects.

## Context / problem

The agent framework supports repository guidance, execution-plan storage, ADR discovery, papercut evidence, product artifacts, domain artifacts, repository rules/skills, and tracker-specific integration. These capabilities are intentionally lazy and owned by separate skills. A user who wants to prepare a repository currently has to discover each seam and its approval boundary independently. Generating every possible file up front would create empty authority, while silently initializing repositories would bypass preservation and human approval.

## Decision

### D25 — One approval-gated repository integration setup

- **Scope:** repository inspection, supported-integration inventory, exact proposal, one approval gate, post-approval recheck, owner-preserving application, and concise result.
- **Decision:** Provide one portable `init-ask` skill with one invocation and two conversational phases. First, inspect the current repository and report the fixed catalog with status `integrated | proposed | on-demand | blocked | planned`, plus every exact proposed path and effect. Write nothing. After the human replies `approve`, recheck the repository and target bytes, preserve current conventions, invoke only existing artifact owners, apply only the unchanged proposed effects, and return concise changed/unchanged/blocked results. Changed effects require a new proposal and approval.
- **Decision:** The fixed catalog is repository guidance, dev plan storage, ADR registry, papercuts, domain context and ADRs, product artifacts, repository rules and skills, tracker mapping, and agent memory. `on-demand` means a supported owner exists but no real content justifies materialization. `planned` means no approved generic implementation exists; agent memory remains planned until separately approved.
- **Decision:** Surface verification does not add a tenth catalog row. Within the existing `repository rules and skills` row, inventory only already-existing exact manual `surface-verification-adapter`, `create-surface-verification-adapter`, `maintain-surface-verification-adapter`, and repository-owned generated adapters. Do not invoke, create, maintain, propose, or auto-enable them during setup; absence remains on-demand rather than a setup effect.
- **Decision:** `init-ask` has no helper script, persistent setup registry, plan, queue, or owner layer. It may invoke `papercut init` only when that exact repository opt-in is proposed and approved. It may add or merge repository guidance only when the proposal contains concrete repository-specific content and preserves existing guidance. It leaves semantic artifacts absent until their owner has real content and, where applicable, its own exact human approval.
- **Decision:** Never create empty `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, `docs/product/`, `.agents/plans/`, repository rules/skills, tracker mappings, or memory directories. Never edit user-level guidance, credentials, memory, trackers, staging, commits, pushes, releases, deployments, bootstrap configuration, or external systems. Existing product P07, domain durable-write gates, plan transport, repository guidance, tracker owners, and shipping authority remain unchanged.
- **Why:** One thin interface reduces discovery work while keeping every durable artifact behind its current owner and exact approval boundary. A current inventory plus one bounded proposal gives the user a useful setup view without creating a second workflow or persistent state. Lazy materialization avoids empty files that falsely imply authority.
- **Rejected alternatives / why not:** A bootstrap hook or automatic first-run initializer writes before repository intent is known. A full skeleton creates empty guidance, ADR, product, plan, tracker, and memory artifacts. A setup registry duplicates observable repository state and becomes stale. One helper per artifact exposes shallow mechanics instead of reusing owners. User-level defaults or cross-repository memory integration exceed repository authority. Treating setup approval as product, domain, destructive, delivery, or shipping approval bypasses existing gates.
- **Consequences:** OMP `/skill:init-ask` and Grok `/init-ask` use one body. Empty repositories receive a concise proposal without pre-approval writes. Partial repositories propose only missing safe opt-ins. Fully integrated repositories return unchanged; conflicts name the exact owner and resume condition. The interface can grow only when a real supported integration has a current owner and observable setup seam.
- **Reopen when:** the supported catalog changes; a second host needs different semantics rather than invocation syntax; setup requires persistent state; a safe integration cannot be expressed through an existing owner; agent memory receives a separately approved generic contract; or pre-approval/external/destructive effects are proposed.

## Affected contracts

- `.config/agents/skills/init-ask/SKILL.md` owns inspection, catalog/status projection, proposal/approval/recheck, owner dispatch, safety, and output.
- `.config/agents/skills/init-ask/evals/evals.json` owns empty, partial, integrated/conflicting, approval, and non-effect behavior examples.
- Existing repository guidance, plan, domain, product, papercut, tracker, memory, bootstrap, and shipping owners remain authoritative for their own effects.
- `docs/adr/INDEX.md` provides discovery for D25; this ADR is decision authority, not setup state.

## Evidence / source revisions

- Governing specification: `local://papercut-automation-init-ask-spec.md`, revision `PAPERCUT-AUTOMATION-SPEC-20260812-r1`, SHA-256 `83252a629a21a87281d84a780c687672b8e0112233d0a4b5cc093a439231bd16`.
- Current repository evidence: `.agents/AGENTS.md`, `.agents/plans/`, `docs/adr/INDEX.md`, `.agents/papercuts.json`, installed artifact-owner skills, manifest, and bootstrap mapping.

## Human authority

The human owner approved the one-interface repository setup design, fixed catalog, lazy materialization, exact approval/recheck boundary, papercut opt-in seam, exclusions, and high-consequence implementation route on 2026-08-12.