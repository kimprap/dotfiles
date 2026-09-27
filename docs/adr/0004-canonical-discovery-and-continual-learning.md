# Canonical discovery and continual learning

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-09-17  
**Decision IDs:** D07, D23  
**Related authority:** ADR-0001 D01, D15

## Scope

This record governs conditional discovery of current workflow contracts, the single terminal engineering learning assessment, the human execution map, and the authority relationship of append-only maintenance journals. It applies to `.agents/AGENTS.md`, `docs/adr/INDEX.md`, active workflow ADRs, `dev-continual-learning`, portable `continual-learning`, `dev-ask/WORKFLOW.md`, `dev-ask/references/execution-flow.md`, and the `craft-skill` journal convention. It creates no runtime state, background learning, product authority, memory record, or permission to mutate user-level guidance.

## Context / problem

Repository-local rules can be injected automatically, while ADRs and human reference maps normally are not. Loading all history for ordinary work wastes context and risks treating obsolete evidence as executable policy. Terminal learning has the same risk: broad intake, retries, counters, or transcript mining would turn a focused assessment into hidden maintenance state. Human maps and source journals are useful only when their non-runtime role and precedence remain explicit.

## Decisions

### D07 — One terminal engineering learning assessment

- **Decision:** Standard and high assurance invoke route-visible `dev-continual-learning` exactly once after the one code review and final verification. Compact invokes neither the adapter nor portable learning and records `Learning: skipped for compact`.
- **Decision:** Terminal assessment intake contains only the settled outcome, affected paths, lean Handoffs in authored-task and stage order, all papercut results, and complete Learning Candidates with incomplete candidates identified as evidence only.
- **Decision:** The adapter calls portable `continual-learning` once. Portable learning alone owns qualification, curation, redaction, destination authority, validation, and candidate-specific papercut dispositions. There is no semantic or transport retry, second curator, or second portable call.
- **Decision:** Normalize the result to `Learning: curated`, `Learning: no durable learning`, or `Learning: blocked <reason>`. Curated and no-durable-learning results permit completion. An ordinary blocked result is reported once as residual risk and still permits completion. Only a current governing-rule conflict that directly makes the settled implementation invalid or unsafe blocks completion and returns to the rule owner.
- **Decision:** After the one portable terminal result, the engineering adapter explicitly loads canonical `dev-handoff` and first-returns one lean Handoff with the title and five headings once in order. `Checks` contains portable assessment evidence plus exactly one normalized Learning line and no fabricated implementation acceptance IDs; `Next receiver` names the concrete lifecycle controller. The adapter checks the unsent envelope and fixes only that draft in place, without reinvoking portable assessment or asking it to re-emit.
- **Decision:** If curation changes repository material, its completed lean Handoff creates one ordinary repository-work boundary and therefore one papercut look. That look never triggers another learning assessment.
- **Why:** One settled assessment can improve durable guidance without turning every task or failure into a maintenance loop.
- **Rejected alternatives:** Per-task learning, retries, counters, calendar triggers, transcript mining, broad repository scans, model scoring, and learning-owned implementation repair create hidden state or duplicate authority.
- **Consequences:** Standard/high order remains review → verification → learning → one canonical learning Handoff → presentation. Ordinary learning failure is visible but not an implementation blocker. Portable learning stays one-shot and Handoff-free; human completion retains its five fields and one Learning line.
- **Reopen when:** Assessment eligibility, intake, invocation count, blocking threshold, curation authority, or result vocabulary changes.

### D23 — Human map and maintenance provenance

- **Decision:** Keep `dev-ask/WORKFLOW.md` as the concise current human projection and `dev-ask/references/execution-flow.md` as the human-only Mermaid and transition-table map. Executable `dev-ask`, `dev-implementation`, and stage skills remain authoritative. Neither projection runs work, stores state, or wins a conflict.
- **Decision:** Keep focused durable choices in the narrowest active ADR and expose their IDs, scope, status, and supersession through `docs/adr/INDEX.md`. Superseded history stays in ADRs and archives, not executable skills or the human maps.
- **Decision:** `craft-skill` alone owns the optional hybrid append-only `MAINTENANCE.md` convention for skills and prompt bundles. The convention is durable, but each journal is non-runtime, noncanonical provenance. Runtime never loads a journal and no entry or source row can approve work, define behavior, or supersede human authority, executable prose, an approved artifact, or an ADR.
- **Decision:** Every structured journal entry records identity and kind, superseded IDs, context, decision, applied paths, rejected alternatives, validation, and revisit condition. Every source row records exact URL or stable local URI, access date, `Use: adopted | adapted | caution | rejected | superseded`, `Basis: local evidence | primary source | secondary source | unverified`, applied path, and concise local treatment.
- **Decision:** Corrections append a later entry with `Supersedes`; they never rewrite history. Optional free-form notes may coexist with structured entries. Raw transcripts, copied articles, provider trivia, and numeric source scores are excluded.
- **Decision:** A qualifying custom controller may keep its existing skill-local human map under its approved authority.
- **Why:** Human navigation and source provenance help maintenance only when they cannot compete with executable and canonical owners.
- **Rejected alternatives:** Runtime-loading maps or journals, making source notes canonical, copying articles, rewriting corrections in place, or keeping one global workflow ledger creates duplicated or misleading authority.
- **Consequences:** A map mismatch is an edit-time defect. Journal maintenance is optional and append-only. The prompt-bundle journal records provenance while `code-rethink.md` and `test-value.md` own runtime behavior.
- **Reopen when:** Human-map location or form, ADR discovery, journal ownership or fields, append-only behavior, or authority precedence changes.

## Affected contracts

- Repository-local `.agents/AGENTS.md` for the conditional generic-workflow pointer.
- `docs/adr/INDEX.md` and active focused workflow ADRs for decision discovery.
- `.config/agents/skills/dev-ask/WORKFLOW.md` and `references/execution-flow.md` for non-runtime human projection.
- `.config/agents/skills/dev-continual-learning/SKILL.md`, portable `continual-learning`, their focused evals, and the implementation assurance order.
- `.config/agents/skills/craft-skill/SKILL.md`, its focused evals, and `.config/agents/rules/canonical-project-contracts.md` for the optional maintenance-journal convention and provenance boundary.

## Evidence / source revisions

- Current governing authority: `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`, and `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`.
- `.config/agents/references/impl-rethink/MAINTENANCE.md` contains the confirmed 2026-09-04 source inventory and local treatments. It is provenance, not runtime authority.
- Earlier discovery, learning, and custom-controller records remain historical support where they do not conflict with this revision.

## Human authority

The human-approved lean workflow authorizes the one-shot learning adapter and D23's human-map and journal relationship. It does not authorize user-level edits, background maintenance, product decisions, changes to Reconcile, or shipping.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index.

## Verification expectations

- A fresh maintainer follows the single repository pointer to the current human map and index, then opens only applicable active ADRs.
- Standard/high invokes learning once after review and verification with lean intake and no retry; compact skips it.
- Ordinary learning failure is a completion risk; only an invalidating or unsafe current governing-rule conflict blocks.
- D23 is the discoverable owner of both the generic human map and the noncanonical journal relationship.
- The prompt-bundle journal retains all confirmed source rows dated 2026-09-04 with Use, Basis, applied path, and local treatment, while runtime policy remains in executable files.
