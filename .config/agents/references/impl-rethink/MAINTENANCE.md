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