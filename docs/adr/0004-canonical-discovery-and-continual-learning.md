# Canonical discovery and continual learning

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Decision IDs:** D07  
**Related authority:** D01, D15

## Scope

This decision governs conditional discovery of the generic engineering workflow's current contracts and ADR registry, the authority boundary among current guidance, durable decisions, and research, and Standard versus Deep continual-learning maintenance. It applies to the repository-local `.agents/AGENTS.md` pointer, `docs/adr/INDEX.md`, active workflow ADRs, `dev-continual-learning`, and the current workflow reference. It does not make ADRs runtime state, require eager loading, authorize background curation, or permit mutation of `/Users/kim/.agents/AGENTS.md`.

## Context / problem

Repository-local guidance can be injected automatically, but workflow references and ADRs are not necessarily in ordinary agent context. Loading all workflow history for every task would waste context and give rejected or superseded records an opportunity to masquerade as executable policy. At completion, narrow evidence can justify a focused rule or contract repair, but invocation counters, calendar audits, transcript mining, or broad “self-improvement” claims would create hidden state and unbounded maintenance. Discovery and learning therefore need explicit triggers, one current registry, source precedence, and a separate authority gate for any broad maintenance route.

## Adopted decision

1. **Use one conditional repository pointer.** Agents changing or diagnosing the generic engineering workflow read `.config/agents/skills/dev-ask/WORKFLOW.md` and `docs/adr/INDEX.md`. Ordinary tasks read only the applicable skill/rule and the active ADRs explicitly named by their Task Contract.
2. **Keep the index a small stable registry.** It records only ID, title, ACTIVE status, scope, path, affected authority, and supersession links. It contains no queue, attempt, route, invocation, owner, evidence-history, or runtime fields. Rejected and superseded records remain linked history but never execute.
3. **Preserve source roles and precedence.** Active skills/rules and current `WORKFLOW.md` define current executable behavior; active ADRs define durable rationale and rejected alternatives; approved requirements/specifications/direct authority govern their concerns; Atlas and external sources remain advisory research. Current executable contracts and active ADRs change atomically, and a conflict fails closed.
4. **Keep `WORKFLOW.md` concise and current.** It contains the human overview, engine reference, skill catalog, maintenance guidance, and bounded sources, including a decision-index pointer rather than copied rationale or history.
5. **Run Standard learning narrowly and terminally.** After a settled standard or high-consequence outcome, run one neutral assessment; compact work retains its qualifying-trigger screen. Inspect only affected artifacts. Update only directly impacted existing project-owned rules, skills, tests, indexes, ADR status, and current workflow guidance. Validate durable guidance against the source case and at least one independent adjacent or near-miss case. Return exactly `Updated`, `Added`, `Removed`, `Skipped`, `Validation`, and `Deep candidate`; `NO DURABLE LEARNING` is valid.
6. **Trigger Deep maintenance only from authority or settled evidence.** Deep activates on explicit human request or settled evidence of a recurring/cross-contract defect, a stale/conflicting canonical set, or a severe systemic incident. It is separately authorized unless current contradictory guidance blocks correctness of the just-completed outcome. It may audit the broader canonical set for duplication, conflict, stale paths, false triggers, missing removals, and cross-harness drift.
7. **Use least-specific sufficient verified guidance as a bounded heuristic.** Prefer the narrowest durable instruction that covers the source case and held-out near misses under approved authority. This is a curation heuristic only; it is not Bennett's formal weakness metric and makes no claim of autonomous learning, memory, reflection, or generalization.

## Rejected alternatives and reasons

- **Every-Nth-invocation counters, calendar audits, router-owned timers/state, or background transcript mining:** rejected because they create hidden scheduling state, non-causal work, privacy/context risk, and maintenance without current evidence.
- **Deep maintenance after every completion or as a default completion tax:** rejected because ordinary outcomes should finish after one narrow assessment and a deep candidate normally becomes a separate proposed route.
- **A deep candidate automatically blocking completion:** rejected because only an exact current contradictory contract that blocks correctness can make maintenance part of the current outcome.
- **Mutating `/Users/kim/.agents/AGENTS.md`, user-level memory, credentials, or other personal/global state:** rejected because continual learning is limited to authorized project-owned surfaces.
- **Automatically injecting every ADR, the entire `WORKFLOW.md`, or full workflow history into ordinary tasks:** rejected because irrelevant context increases drift and rejected/superseded records are not executable.
- **An agent-owned always-injected Field Guide, one ever-growing decision register, or copies of ADR rationale inside `WORKFLOW.md`:** rejected because each concern needs one focused owner and current guidance must remain lean.
- **Plans, memories, transcripts, Atlas topics, dirty research notes, or instance notes as normative authority:** rejected because they are proposals, recall, research, or run evidence and can be stale.
- **Automatic transcript-derived institutional memory, a new memory backend, or a SQLite learning experiment:** rejected because the approved workflow has no background-learning or new-state authority.
- **Skill proliferation, duplicated volatile facts, or a new rule for every observed task:** rejected because durable guidance must address a demonstrated recurring seam and preserve one source of truth.
- **The shortest prose, broadest possible rule, or most permissive hypothesis as the learning objective:** rejected because specificity is judged by sufficiency, authority, and held-out behavior rather than size alone.
- **Implementing Bennett's formal weakness score or claiming the paper proves continual learning, LLM self-improvement, reflection, persistent memory, forgetting, or nonstationary adaptation:** rejected because the paper studies finite symbolic hypotheses under a uniform task prior and does not establish those capabilities.
- **Treating an invocation count, elapsed time, another audit, artifact volume, or unchanged Handoff as progress:** rejected because maintenance must be triggered and terminated by observable criterion or contract evidence.
- **Automatically scheduling frequent architecture surveys or grilling every change:** rejected because those routes activate only for the user's actual refinement/survey intent and applicable evidence.

## Consequences / invariants

- Fresh workflow maintainers can find current behavior and the focused decision registry from one small repository-local pointer.
- Ordinary tasks do not eagerly load unrelated workflow references or ADR history; their Task Contract names any active ADR they need.
- The index remains stable, human-readable, and non-executable. Status and supersession links distinguish active authority from history.
- Active executable guidance and active ADRs cannot disagree silently. Superseded/rejected records and Atlas never execute.
- Standard learning is one narrow terminal assessment; `NO DURABLE LEARNING` and compact `curation not triggered` are valid terminal outcomes.
- Deep maintenance is explicit/event-driven and separately authorized by default; count, time, and background activity never activate it.
- Durable guidance must prove the source case and an adjacent/near-miss case and use the least-specific sufficient project-owned surface.
- No curation action touches user-level AGENTS, runs in the background, creates a memory/state service, or implies shipping.

## Affected contracts

- Repository-local `.agents/AGENTS.md` for the single conditional discovery pointer.
- `docs/adr/INDEX.md` and the four focused ACTIVE workflow ADRs for registry status, affected authority, and supersession links.
- `.config/agents/skills/dev-ask/WORKFLOW.md` for the concise five-section current reference and exact decision-index sentence.
- `.config/agents/skills/dev-continual-learning/SKILL.md` for Standard/Deep activation, scope, validation, output, stop, and receiver.
- `.config/agents/skills/dev-domain-modeling/SKILL.md`, `.config/agents/skills/dev-codebase-design/SKILL.md`, `.config/agents/skills/dev-tdd/SKILL.md`, and `.config/agents/skills/dev-shipping/SKILL.md` for bounded support, durable-write, method, and delivery seams aligned by the current synchronization.
- `.config/agents/skills/dev-ask/evals/evals.json` and fresh discovery, rejected/superseded non-execution, Standard/Deep trigger, count/calendar/background/user-level, and completion fixtures.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR and index remain non-runtime discovery and decision authority.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions** D07 and related D01/D15; **Canonical discovery and continual learning**; **Fixed shared contracts**; **Target map and critical anchors**; **Material approval boundary**; and T1/T4/T5 task contracts. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: shared decision context and outcome grading inform discovery; agent-owned always-injected Field Guides and activity-scale proxies do not.
- Matt Pocock, [Skills for Real Engineers](https://github.com/mattpocock/skills), accessed 2026-08-09: small composable skills and feedback loops inform narrow maintenance; grilling every change and frequent architecture surveys as blanket policy are rejected.
- PostHog, [Writing skills](https://posthog.com/handbook/engineering/ai/writing-skills), [What nobody tells you about writing agent skills](https://newsletter.posthog.com/p/what-nobody-tells-you-about-writing), and the requested [PostHog status](https://x.com/posthog/status/2084345938089316582), accessed 2026-08-09: progressive disclosure, one source of truth, and skill/near-miss validation inform the contract; skill proliferation, volatile duplication, and transcript-derived memory do not. The status could not be read automatically; the official handbook/newsletter supply substantive evidence.
- Michael Timothy Bennett, [The Optimal Choice of Hypothesis Is the Weakest, Not the Shortest](https://arxiv.org/abs/2301.12987v4), arXiv:2301.12987v4, 2024-04-11: finite-formalism extension informs only the least-specific sufficient verified-guidance heuristic; no formal score or LLM learning claim is adopted.
- Atlas: `vault://atlas/ARCHITECTURE.md`, `vault://atlas/summaries/research/agent-systems/harness/topics/lean-self-improving-agent-harness/INDEX.md`, and bounded workflow/harness topics named by the governing plan, subject to their freshness contract and advisory-only status.
- Executable lineage revisions: completed T4 Common Handoff `agent://BoundedConvergence`; T5 current workflow, activation, adapter, fixture, and affected-contract synchronization under `AUTH-PLAN`.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan are the authority for adopting this record. The parent execution dispatch authorizes this exact D07 materialization and the D01/D15 discovery projection. It does not authorize executable learning behavior, broad maintenance, a user-level edit, background mutation, a new memory service, product/architecture decisions, or shipping.

## Supersession / reopen conditions

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. Reopen or seek reapproval if the conditional loading rule, index fields, source precedence, atomic-synchronization/fail-closed rule, Standard or Deep trigger/scope/output, separate deep-route boundary, user-level exclusion, or Bennett evidence limit changes; if background/count/calendar maintenance or a new memory/state authority is proposed; or if the ADR destination changes. Mechanical link wording or status synchronization after an already approved superseding ADR does not reopen it.

## Verification expectations

- **AC01:** A fresh read-only agent given only repository guidance finds `WORKFLOW.md` and `docs/adr/INDEX.md` from one conditional pointer, identifies all four ACTIVE ADRs, distinguishes rejected/superseded history from executable authority, and does not load all ADRs for unrelated work.
- **AC02:** The registry resolves every focused active decision record and its supersession relation without runtime, queue, attempt, route-history, counter, or Atlas-copy fields.
- **AC12:** Standard learning stays one narrow terminal assessment; Deep activates only on explicit request or settled recurring/cross-contract/stale-conflict/severe-incident evidence; count, calendar, router state, transcript, and user-level mutation cases remain near misses.
- **AC13:** `WORKFLOW.md` has the five concise current sections and decision-index link without ADR rationale, evidence history, or runtime status.
- Learning fixtures must show source-case plus independent adjacent/near-miss validation, `NO DURABLE LEARNING` as valid, deep candidates as separate routes by default, and no formal weakness score or background learning.
- A future executable revision must prove active skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
