---
name: skill-craft
description: >
  Create, update, evaluate, and clean up agent skills. Use for skill authoring,
  cleanup, refining skill frontmatter or descriptions, adding evals/scripts/references,
  auditing duplicates or stale skills, or deciding whether to merge, delete, or keep existing skills.
compatibility: >
  Agent Skills compatible; optimized for OMP, Claude Code, Codex/OpenClaw-style skill roots,
  VS Code/GitHub Copilot Agent Skills, and similar Markdown-skill harnesses.
globs:
  - "**/SKILL.md"
  - "**/skills/**"
  - ".agents/skills/**"
  - ".agent/skills/**"
  - ".omp/skills/**"
  - ".config/agents/skills/**"
alwaysApply: false
hide: false
disableModelInvocation: false
disable-model-invocation: false
metadata:
  version: "0.1.0"
  tags: "agent-skills,skill-authoring,skill-evals,skill-cleanup"
  sources: "OMP docs; Agent Skills spec/docs; Anthropic skill-creator; Warp update-skill; steipete skill-cleaner"
---

# skill-craft

Create, refine, evaluate, and clean up agent skills without turning simple skills into boilerplate.

## Frontmatter first

Default emitted frontmatter for a target skill should be minimal:

```yaml
---
name: skill-name
description: >
  Do the concrete job. Use when the user asks for the relevant task, files,
  tools, domain terms, or adjacent workflow where this skill should help.
---
```

Field catalog for cross-harness compatibility:

| Field | Use |
|---|---|
| `name` | Required. Kebab-case, <=64 chars, no leading/trailing/consecutive hyphens, and match the directory. Preserve on update. |
| `description` | Required for model-invoked skills. <=1024 chars. Primary trigger: state what it does and one trigger per distinct branch; collapse synonyms for the same branch. |
| `license` | Optional. Add only when the repo/user provides a real license or bundled license file. |
| `compatibility` | Optional. Add only for real product, tool, OS, package, network, or permission requirements. |
| `metadata` | Optional key-value map for version, owner, tags, source, or harness-specific metadata. |
| `allowed-tools` | Optional and security-sensitive. Add only with narrow justification; unsupported elsewhere does not make broad grants safe. |
| `globs` | Optional OMP metadata for related paths; useful but not required for activation. |
| `alwaysApply` | Usually omit or `false`; use `true` only for tiny universal guidance. |
| `hide` | Optional OMP metadata; hides from prompt lists while keeping manual access. |
| `disableModelInvocation` / `disable-model-invocation` | Optional hide-equivalent compatibility spellings. Use for user-invoked skills that should not spend context load unless explicitly called. |

Emit only fields with signal. Keep model invocation only when the agent or another skill should discover the skill; otherwise prefer user-invoked to avoid context load. A simple CLI-use skill may need only `name`, `description`, and a short body.

## Choose the workflow

Infer intent from the invocation and current conversation.

- Create: no existing skill is provided, or the user asks to create/write/make a skill.
- Update/refine: an existing skill path/name is provided, or the user asks to improve frontmatter, description, body, scripts, references, or evals.
- Evaluate: the user asks to test/evaluate/benchmark/optimize triggering, or a change needs proof.
- Cleanup: the user asks to audit, dedupe, remove, disable, compact, or find stale skills.
- Mixed: preserve existing skill identity first; analyze cleanup candidates before deletion; ask only when a destructive choice cannot be inferred safely.

Modifiers like `scripts` or `references` narrow review scope. They do not force creation.

## Create a skill

1. Extract intent from the conversation before asking questions: task, trigger conditions, expected output, required tools, constraints, and examples.
2. Ground the skill in real material: existing docs, prior successful steps, user corrections, project conventions, failure cases, and input/output formats.
3. Pick the smallest structure that works:
   - `SKILL.md` only for concise guidance.
   - `references/` for optional details the agent should read only under clear conditions.
   - `scripts/` for repeated deterministic work that is cheaper and safer as code.
   - `assets/` for templates or static resources.
   - `evals/` for reusable prompts and assertions.
4. Write procedures, defaults, gotchas, examples, or templates only when they prevent likely errors.
5. Verify frontmatter, name-directory match, description length, and at least one realistic use path.

## Update/refine an existing skill

1. Preserve the existing directory name and `name` unless the user explicitly asks for a rename.
2. Read the current skill and relevant bundled files before editing.
3. Use current-session evidence: repeated chained tool calls suggest a candidate `scripts/` helper; repeated pasted context or long inline explanations suggest a candidate `references/` file.
4. Review candidates before writing them. Deny `scripts/` or `references/` creation when the pattern is one-off, too environment-specific, cheaper inline, or not durable.
5. Make targeted edits: tighten descriptions, remove unused instructions, add missing gotchas, move bulky conditional detail to references, or bundle repeated deterministic work as a script.
6. Prefer cuts and clarifications over more rules. Exact sequences belong only where order is fragile.
7. If improving quality, compare against the old behavior or prior version when practical.

## Evaluate a skill

Start small, then scale only if useful.

1. Create 2-3 realistic prompts first, with at least one edge case or near miss.
2. For a new skill, compare with no skill when practical. For an existing skill, compare with the previous version or snapshot.
3. Add objective assertions after seeing outputs; do not invent brittle wording checks.
4. Grade with evidence from files, outputs, or transcripts.
5. Read traces for wasted steps, ignored guidance, false triggers, and repeated work.
6. Iterate by generalizing from failures, not by overfitting to the prompt text.

For description-only tuning, use positive and near-miss negative trigger prompts. Keep the best description by validation behavior, not by train-set overfit.

## Clean up skills

1. Audit the loaded/live inventory first when the harness exposes it; filesystem scans are fallback context, not proof of activation.
2. Look for duplicate names, near-identical descriptions/bodies, stale skills, disabled roots, long descriptions, and skills that encode no unique knowledge.
3. Before deleting or disabling, verify the kept copy exists and is loaded.
4. Preserve trigger nouns when compacting descriptions.
5. Suggest cleanup before applying it unless the user explicitly asked for edits.
6. Do not delete ignored, untracked, or private skill dirs without a named destination or confirmation that they are disposable.

## Authoring rules

- Optimize for predictable process, not identical output.
- Add what the model lacks: project conventions, non-obvious APIs, edge cases, exact commands, gotchas, output templates, validation loops.
- Omit what the model already knows: generic concepts, motivational text, exhaustive alternatives, and empty section templates.
- Prefer one default. Mention alternatives only as escape hatches.
- Explain why fragile constraints exist; this is less brittle than long `always/never` lists.
- Keep activation-critical gotchas inline in `SKILL.md`; put bulky conditional details in one-level references.
- Each ordered step should end with a checkable completion criterion.
- Link every reference directly from `SKILL.md` and state exactly when to read it; pointer wording decides whether the reference gets used.

## Scripts policy

Bundle scripts only when repeated deterministic work is worth maintaining.

A good skill script is noninteractive, idempotent when possible, has `--help`, uses structured stdout, sends diagnostics to stderr, gives actionable errors, supports dry-run for destructive/stateful operations, has safe defaults, and keeps output size predictable.

Do not create a script for a one-off command, unstable environment detail, or logic the agent can perform more clearly inline.

## Done criteria

For created, updated, evaluated, or cleaned skills:

- Frontmatter is valid and minimal for the target harnesses.
- `name` matches the directory and the description triggers the intended use without broad false positives.
- Body is concise, imperative, and conditional-section-free unless the section earns its place.
- References/scripts/assets/evals exist only when they reduce future work or errors.
- Verification matches the workflow: frontmatter checks for metadata edits, realistic prompts for behavior, trigger queries for descriptions, and loaded/kept-copy proof before cleanup deletion.
