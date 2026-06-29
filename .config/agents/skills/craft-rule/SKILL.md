---
name: craft-rule
description: >
  Create, update, evaluate, and clean up agent rule files. Use for rule authoring,
  TTSR condition/scope tuning, always-apply versus rulebook decisions, false trigger audits,
  layered base/companion/harness-specific rule design, or rule cleanup.
compatibility: >
  Optimized for OMP Markdown rules; also useful for Markdown rule files used by
  agents, Cursor, Windsurf, Cline, and similar harnesses when unsupported OMP metadata can be ignored.
globs:
  - "**/rules/*.md"
  - ".config/agents/rules/**"
  - ".agents/rules/**"
  - ".omp/rules/**"
  - ".cursor/rules/**"
  - ".windsurf/rules/**"
  - ".clinerules/**"
alwaysApply: false
metadata:
  tags: "agent-rules,ttsr,rule-authoring,agent-harness-engineering"
---

# craft-rule

Create, refine, evaluate, and clean up rule files so agents become more predictable without turning every preference into an always-on rule.

## Frontmatter first

Default emitted frontmatter for a target rule should be the smallest shape that matches the rule type.

Minimal rulebook/default shape:

```yaml
---
description: Short durable policy statement for the targeted behavior.
---
```

Add TTSR metadata only when stream-time correction is required:

```yaml
---
description: Correct the narrow behavior.
condition: "..."
scope:
  - "tool:write"
interruptMode: "tool-only"
---
```

Field catalog for practical OMP rule authoring:

| Field | Use |
|---|---|
| `description` | Required. One durable sentence on what the rule governs and when it matters. |
| `condition` / `astCondition` | Optional. Add only for TTSR rules with a narrow observable trigger. |
| `scope` | Optional but usually required for TTSR. Use it to constrain tool/path activation before adding more regex. |
| `interruptMode` | Optional. Prefer `tool-only` for tool correction; widen only when prose interception is the actual goal. |
| `alwaysApply` | Optional. Omit unless the rule is tiny, universal, and worth paying every turn. |
| `metadata` | Optional key-value map for tags, source, or harness notes. Do not use frontmatter version numbers. |

Emit only fields with signal. A description-only rulebook rule is the default. Add trigger metadata only when a real failure mode proves you need stream-time correction.

## Choose the workflow

Infer intent from the requested rule work and the current failure mode.

- Create: no existing rule is provided, or the user asks to create/write/make a rule.
- Update/refine: an existing rule path/name is provided, or the user asks to improve triggers, scope, wording, or precedence.
- Evaluate: the user asks to test behavior, narrow false positives, inspect misses, or prove activation.
- Cleanup: the user asks to audit, dedupe, disable, merge, or delete stale rules.
- Mixed: preserve rule identity first; verify kept-copy precedence before cleanup deletion.

## Rule-type router
- Base contract rule — stable repo-wide policy like `plan.md`.
- Companion overlay — specialized body/quality rule like `plan-impl-spec.md`.
- Harness shim — OMP/local transport behavior only.
- TTSR interrupt/reminder — only when stream-time correction is useful.
- Rulebook rule — description-only guidance the model should read when relevant.
- Always-apply rule — only for tiny universal guidance.

## OMP TTSR best practices
- A rule with `condition` or `astCondition` is bucketed into TTSR before rulebook/always-apply.
- `rule://<name>` can still resolve registered TTSR rules.
- `scope` supports tool/path tokens like `tool:write(*-plan.md)` and path glob matching also checks basenames.
- The `write` matcher sees file content, not the destination path, so path-sensitive rules should use scope/path globs rather than regexing the write body.
- Prefer `interruptMode: "tool-only"` for tool-argument correction; avoid interrupting normal prose unless the rule truly belongs there.
- Broad regexes like `plans?\b` need positive and negative trigger checks because they can fire on incidental prose.

## Thin orchestrator principle for rules
- Base rules stay generic.
- Companion rules add specialized quality bars.
- Harness-specific rules/shims should only encode transport/runtime behavior.
- Do not duplicate an entire base rule inside every companion; reference the base rule and repeat only activation-critical constraints.

## What belongs in a rule
- Put only high-leverage instructions that materially change agent behavior: security boundaries, architectural decisions, testing philosophy, and git/workflow guardrails.
- Prefer repo-specific decisions and failure-mode fixes over generic vendor boilerplate.
- Encode code style only when it captures a real architectural decision or prevents agent churn; generic formatter/linter policy belongs in tooling first.

## Good rule vs bad rule heuristics
- Good rule: one purpose, narrow activation surface, explicit non-goals, and a failure mode you can reproduce.
- Good rule: tells the agent what to do at a seam where defaults fail, with at least one concrete positive and one concrete near-miss negative.
- Bad rule: giant pasted style guide, vague advice like `be careful`, duplicated base policy, or instructions better enforced by config, tests, or code review.
- Bad rule: transient task notes, migration scratchpads, or user-specific wishes that do not belong in a durable shared policy.

## Keep core context small
- Keep the always-read core file lightweight; move specialized guidance into referenced companion rules so the default footprint stays small.
- If a harness silently compacts or rebuilds context, keep only the durable universal contract in the core rule and make heavier guidance load on demand.

## Choose the enforcement surface
- Use a rulebook rule when the guidance is descriptive and only needed when the task naturally touches that domain.
- Use TTSR when you need stream-time correction on a prompt, tool call, or write target and you can define a narrow trigger.
- Use always-apply only for tiny universal invariants that must survive every turn.
- Prefer tooling, config, linters, tests, or file templates over prose rules when the behavior can be enforced deterministically.

## Create a rule

1. Start from the failure mode: what went wrong, what should have happened, and why an existing rule/tool/test did not already prevent it.
2. Choose the smallest layer that works: base contract, companion overlay, harness shim, TTSR, rulebook, or always-apply.
3. Pick the trigger surface deliberately: prose intent, tool arguments, destination path, AST shape, or file content.
4. Write the minimum instruction that fixes the failure without dragging unrelated context into every turn.
5. Verify the frontmatter matches the chosen rule type before adding extra metadata.

## Update / refine a rule

1. Preserve the current rule path and purpose unless the user explicitly requests a rename or redesign.
2. Inspect current triggers, recent false positives, recent misses, and neighboring rules before editing.
3. Tighten scope before adding more prose; the first fix for a noisy rule is usually activation, not more words.
4. Prefer cuts, narrower surfaces, and clearer examples over stacking more `always`/`never` language.

## Evaluate a rule

1. Test 2–3 positive trigger prompts/tool arguments and at least one near-miss negative.
2. Check neighboring surfaces too: wrong file path, similar wording, or adjacent tool call that should not fire.
3. For TTSR, verify that `scope` is doing most of the narrowing work; regex should refine, not carry the whole filter.
4. For core or always-apply rules, check that the content is small enough to justify being present every turn.

## Cleanup

1. Verify kept-copy/provider precedence before deleting or disabling duplicates.
2. Collapse copy-pasted overlap into a shared base-plus-companion shape when multiple harnesses need the same policy.
3. Delete stale rules whose behavior is now enforced elsewhere; dead policy adds context cost and contradiction risk.
4. Suggest cleanup before destructive edits unless the user explicitly asked you to apply them.

## Done criteria

- Frontmatter is valid and minimal for the chosen rule type.
- The selected layer is the smallest one that reliably enforces the policy.
- Trigger behavior is narrow enough for the intended surface.
- No `alwaysApply` unless the rule is tiny, universal, and worth the per-turn context cost.
- Positive and near-miss negative checks are documented.
