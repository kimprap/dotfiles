# Improvement Plan: Condense the generic assistant baseline

**Datetime**: 2026-07-30-1356
**Mode**: standard
**Scope**: The copy-paste-ready, non-coding `AGENTS.md` drafted in the current conversation
**Summary**: Replace the verbose draft with a smaller universal contract that preserves user authority, precise communication, sound judgment, evidence discipline, safety, and completion without encoding a provider, domain, or rigid response template.
**Status**: DONE

## Findings

- Current conversation draft — seven sections repeat communication, actionability, judgment, and completion obligations, increasing always-loaded context without changing behavior → merge overlapping rules and remove explanatory prose.
- `.config/agents/AGENTS.md:1-3` — the coding baseline correctly limits foundational context to durable, specialty-neutral policy → preserve that layering principle while removing engineering identity and workflow language.
- `.config/agents/AGENTS.md:11-39` — answer-first, precise, actionable reporting is reusable, but fixed heading examples, decision-reporting ceremony, and multi-turn detail are excessive for a generic core → retain outcomes, not the full reporting protocol.
- `.config/agents/AGENTS.md:41-66` — proportional planning, assumption handling, controlled scope, safe defaults, options, and verification are high-signal → generalize them beyond files, tests, and code changes.
- `skill://craft-rule` — always-read rules should be universal, compact, non-duplicative, and limited to behavior defaults cannot reliably supply → require every retained instruction to affect multiple task domains.

## Scope

**In scope**:
- One standalone Markdown replacement for the user-owned generic `AGENTS.md`.
- General-purpose behavior for research, writing, analysis, planning, and tool-assisted tasks.
- Concise rules for role, responses, operating judgment, evidence, safety, and completion.

**Out of scope**:
- `.config/agents/AGENTS.md` — reference only; do not modify the coding-agent baseline.
- Coding, repository, test, command, or language-specific policy.
- Provider-specific tools, citation components, hidden-reasoning syntax, or harness metadata.
- A companion-rule system for the external generic file.

## Execution intent and critical anchors

The final response must contain one copy-paste-ready `AGENTS.md` whose core is materially shorter than the current conversation draft. Use `.config/agents/AGENTS.md:1-66` for tone and instruction quality, and `skill://craft-rule` for the small-core rulebook principle.

Retain these outcomes exactly once:

- The assistant follows user intent within higher-priority, safety, privacy, and legal constraints; specific task instructions override generic defaults only in scope.
- Responses lead with the answer, use simple precise language, match requested depth, and omit repetition and filler.
- The assistant uses available context and tools, resolves low-risk assumptions, asks only when a consequential unresolved choice remains, and recommends a default when trade-offs matter.
- Work stays within scope, addresses the real goal, prefers the simplest reliable approach, and challenges unsafe or premise-breaking methods.
- Current, uncertain, disputed, or high-stakes claims are verified when tools permit; facts, inferences, assumptions, and limitations are not blurred or fabricated.
- Low-risk reversible work proceeds without ceremony; irreversible, externally visible, privacy-sensitive, or materially consequential actions require approval.
- Deliverables are complete, observable outcomes are checked where possible, and residual uncertainty is stated precisely.

Remove fixed bolding, mandatory probabilities, private chain-of-thought requests, fixed section templates, arbitrary list limits, provider names, coding rules, repeated completion language, and meta-commentary that does not change behavior.

## Tasks

- [x] T1. Rewrite the generic baseline as a lean rulebook
  - completed 2026-07-30-1404
  - Return one standalone Markdown document, not a commentary-heavy comparison.
  - Use short declarative paragraphs or bullets and only the headings needed for scanning.
  - Consolidate overlapping communication, judgment, evidence, safety, and completion rules according to the execution intent above.
  - Keep the tone direct and durable; avoid examples and enumerations unless omission would create a safety ambiguity.
- [x] T2. Audit the replacement for portability and instruction value
  - completed 2026-07-30-1415
  - Remove any rule that merely restates normal helpfulness or duplicates another rule.
  - Confirm every instruction applies across multiple non-coding domains and does not assume a specific model, tool API, citation renderer, or filesystem.
  - Present the final replacement to the user without modifying `.config/agents/AGENTS.md` or unrelated repository work.

## Verification / Done criteria

- [x] The delivered Markdown is standalone and copy-paste ready.
- [x] Each retained instruction has one clear purpose and appears once.
- [x] No coding, repository, test-runner, language, provider, or harness-specific policy remains.
- [x] The document preserves user authority, response quality, proportional judgment, evidence discipline, safety boundaries, and completion behavior.
- [x] `git diff -- .config/agents/AGENTS.md` shows no change to the coding-agent reference.
- [x] The final response identifies no unverified action as completed.

## Assumptions and fallbacks

- The generic `AGENTS.md` is external to this repository because the user supplied its contents conversationally and named `.config/agents/AGENTS.md` only as a reference. Therefore execution returns replacement text rather than writing an inferred path.
- If a later instruction supplies an explicit destination, write only that destination; otherwise keep the repository unchanged except for this plan artifact.

## STOP conditions

- A newer user instruction identifies `.config/agents/AGENTS.md` as the target rather than the reference.
- The rewrite requires provider-specific syntax or a domain-specific operating procedure to remain complete.
- A brevity cut would remove one of the retained outcomes listed under execution intent; preserve the outcome instead of optimizing for a fixed length.

## Completion Summary

- Delivered `.agents/GENERIC-AGENTS.md` as a 36-line, 381-word universal baseline at SHA-256 `3ce780b05a9dbcd62aae05c3c4fbde39b8c7e05d72f074b2c4eaa51a92c6093c`.
- Smoke scenarios produced a direct one-word answer, a bounded recommendation with rationale, and a confirmation request before an externally visible action.
- Independent verification returned target-level `VERIFIED`; every target-observable criterion and all seven required outcomes passed.
- Final review returned Standards `PASS`, Specification `PASS`, and Overall `APPROVED`, with no blocking findings or advisories.
- Terminal curation returned `NO DURABLE LEARNING`; duplicating the new baseline into other guidance was rejected.
- The user-supplied `.agents/GENERIC-AGENTS.md` destination activated the plan's explicit-path fallback. `.config/agents/AGENTS.md` remained reference-only and unchanged.
- Residual risk: instruction adherence remains dependent on the consuming host and model.
