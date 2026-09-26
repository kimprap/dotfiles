# Implementation rethink maintenance journal

This journal is append-only, non-runtime, and non-canonical. The convention is canonical; entries are provenance only. Runtime skills and prompts must not load this file.

Later corrections append a new entry with `Supersedes`; they never rewrite history. Each entry records identity/kind, superseded IDs, context, decision, applied paths, rejected alternatives, validation, and revisit condition. Source rows record exact source, access date, Use, Basis, applied path, and local treatment. Do not store raw transcripts, copied articles, provider trivia, or numeric source scores. Free-form maintenance notes are optional.

## IMPL-RETHINK-MAINT-2026-09-04

- Kind: initial source treatment
- Supersedes: none
- Context: Confirmed lean dev-* workflow design, evidence revision `dev-workflow-streamlining/v3.1`.
- Decision: Maintain one code rethink core, one test-policy wrapper, and one sequencing wrapper; keep permanent-test policy in `test-value.md`.
- Applied paths: `.config/agents/references/impl-rethink/**`, `.config/agents/skills/dev-implementation/references/test-value.md`, and the named downstream review/audit contracts.
- Rejected alternatives: numeric code/file thresholds, an ablation ceremony, duplicated test policy, repeated review, mandatory praise, nits, unrelated cleanup, and unconditional production-seam deletion.
- Validation: Source inventory and treatments match the confirmed decision evidence dated 2026-09-04.
- Revisit condition: Append only when a governing decision changes prompt substance or a source treatment; never revise this entry in place.

| Source | Accessed | Use | Basis | Applied path | Local treatment |
|---|---|---|---|---|---|
| https://x.com/mattpocockuk/status/2094500508224409852 | 2026-09-04 | adapted | primary source | `.config/agents/references/impl-rethink/code-rethink.md` | Reduce code while keeping decision paths clear; reject numeric thresholds. |
| https://x.com/_lopopolo/status/2086269569841377295 | 2026-09-04 | adapted | primary source | `.config/agents/references/impl-rethink/code-rethink.md`; `.config/agents/skills/dev-implementation/references/test-value.md` | Reject source-restating tests and then reconsider test-only production seams; reject the two-Markdown-file convention. |
| https://x.com/xuanwo/status/2095025829424333044?s=46 | 2026-09-04 | rejected | primary source | none | No ablation ceremony or runtime behavior is attributed to this source. |
| https://x.com/mattpocockuk/status/2093068185830347088?s=46 | 2026-09-04 | adapted | primary source | `.config/agents/skills/dev-implementation/references/test-value.md` | Reject tautological tests; reject a new `CODING_STANDARDS.md` owner. |
| https://x.com/cl571128/status/2095626295690588388/photo/1 | 2026-09-04 | adapted | primary source | `.config/agents/references/impl-rethink/code-rethink.md`; `.config/agents/skills/dev-implementation/references/test-value.md` | Prefer existing test files/utilities, nearby conventions, and no unrelated cleanup. |
| https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47 | 2026-09-04 | adapted | primary source | `.config/agents/skills/dev-test-audit/**` | Explicit audit scope/file coverage/evidence; reject scratchpad, two-finding cap, and coordinator machinery. |
| https://github.com/addyosmani/agent-skills/blob/main/skills/code-review-and-quality/SKILL.md | 2026-09-04 | adapted | primary source | `.config/agents/skills/dev-code-review/**`; `.config/agents/references/impl-rethink/**` | Tests first, net-health approval, required/advisory split, one author-review-fix-final-check flow; reject nits, praise mandate, line caps, and repeated review. |
| https://github.com/addyosmani/agent-skills/blob/main/agents/code-reviewer.md | 2026-09-04 | adapted | primary source | `.config/agents/skills/dev-code-review/**` | Evidence-backed correctness and architecture review under the narrower local verdict contract. |
| https://github.com/addyosmani/agent-skills/blob/main/skills/code-simplification/SKILL.md | 2026-09-04 | adapted | primary source | `.config/agents/references/impl-rethink/code-rethink.md` | Fewer lines is not the goal; preserve behavior and avoid drive-by cleanup. |
| https://github.com/addyosmani/agent-skills/blob/main/agents/test-engineer.md | 2026-09-04 | adapted | primary source | `.config/agents/skills/dev-implementation/references/test-value.md` | Behavior over implementation, appropriate test level, deterministic and independent tests. |
| `skill://rethink` | 2026-09-04 | adapted | local evidence | `.config/agents/references/impl-rethink/code-rethink.md` | Only the lifecycle-cost principle enters `code-rethink.md`. |

## IMPL-RETHINK-MAINT-2026-09-26

- Kind: source treatment extension
- Supersedes: none
- Context: User-approved refinement of the permanent-test judgment used by impl-rethink, review-rethink, and dev-test-audit, after extracting high-value concepts from two external sources; decision evidence confirmed in session on 2026-09-26 after two independent second-agent reviews.
- Decision: Keep `test-value.md` the sole permanent-test policy. Add failure-mode-derived cases, one owning public seam per contract, gap-only regression tests with practical fail-before observation, no test-only production seams, the behavior-preserving-refactor and intended-reason assertion tests, and a contract-guard paragraph that admits static checks only when the checked artifact is itself the contract. Add one two-direction challenge sentence to `test-rethink.md`. Allow audit opinion agents read-only Git history of in-scope files, cited in the existing `Evidence` or `Uncertainty` fields; on OMP this grants `bash`, limited only by the opinion-agent prompt.
- Applied paths: `.config/agents/skills/dev-implementation/references/test-value.md`, `.config/agents/references/impl-rethink/test-rethink.md`, `.config/agents/skills/dev-test-audit/references/opinion-agent.md`, `.config/agents/harnesses/omp/agents/test-audit-opinion-a.md`, `.config/agents/harnesses/omp/agents/test-audit-opinion-b.md`.
- Rejected alternatives: E2E as the primary test type, "never write tests after the code", an E2E artifact requirement, the openclaw junk-pattern catalog, openclaw modes and campaigns, auditing only a few high-confidence candidates, a net-negative line target, openclaw validation and PR flow, a new history proposal field, a controller-fetched history turn, an untranslated "strongest boundary", a closed contract-type definition, and a baseline-failure investigation or repair duty.
- Validation: 2026-09-26 rethink-phase checks: scoped `git diff` of the six paths shows only the approved hunks, and this journal diff is a pure append; `scan_stale_contracts.py` returned `hits: []` and only the pre-existing baseline `same-child-rethink` missing_required entry (exit 1, unchanged from baseline); the new policy sentences appear only in `test-value.md` and `test-rethink.md`; one OMP `test-audit-opinion-a` smoke on `agent-return/test_decode.py` ran six successful read-only `git log`/`git blame`/`git show` bash calls, no other bash command, and returned `keep`.
- Revisit condition: Append only when the OMP harness source-text ban is reconciled with the contract-guard exception, OMP gains a narrower command permission than `bash`, Grok read-only mode is found to block Git history, or a governing decision changes this prompt substance.

| Source | Accessed | Use | Basis | Applied path | Local treatment |
|---|---|---|---|---|---|
| https://github.com/openclaw/openclaw/blob/main/.agents/skills/test-audit/SKILL.md | 2026-09-26 | adapted | primary source | `.config/agents/skills/dev-implementation/references/test-value.md`; `.config/agents/references/impl-rethink/test-rethink.md`; `.config/agents/skills/dev-test-audit/references/opinion-agent.md` | Adopt the refactor test, intended-reason failures, one owner per contract, no test-only seams, regression fail-before, the contract-guard retention bar, and history before removal; reject the junk-pattern catalog, modes and campaigns, high-confidence-only candidates, net-negative line target, and repository-specific validation and PR flow. |
| https://x.com/hassanazharkhan/status/2103167552147128690 | 2026-09-26 | adapted | primary source | `.config/agents/skills/dev-implementation/references/test-value.md` | Adopt failure-mode-derived cases, rejection of tautological and change-detector tests, and regression tests only for real gaps; reject E2E as the primary test type, "never write tests after the code", and an E2E artifact requirement. |
