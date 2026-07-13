---
name: craft-skill
description: >
  Create, update, evaluate, and clean up agent skills. Use for skill authoring,
  frontmatter or description refinement, scripts/references/evals, discovery or invocation
  failures, harness transports, duplicate/stale audits, or merge/delete decisions.
compatibility: >
  Uses the Agent Skills standard and runs in OMP, Grok CLI, Claude Code, Codex,
  and similar hosts. Provider-specific transports and invocation metadata are optional adapters.
metadata:
  tags: "agent-skills,skill-authoring,skill-evals,skill-cleanup"
  sources: "Agent Skills spec; OMP docs; Grok CLI docs; Codex docs; Anthropic skill-creator"
---

# craft-skill

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

Portable fields follow the Agent Skills standard; invocation and path hints are provider extensions. Confirm target-harness support before emitting an extension.

| Field | Use |
|---|---|
| `name` | Required. Kebab-case, <=64 chars, no leading/trailing/consecutive hyphens, and match the directory. Preserve on update. |
| `description` | Required. <=1024 chars. Primary discovery signal: state what the skill does, when to use it, and one trigger per distinct branch. |
| `license` | Optional. Add only when the repo/user provides a real license or bundled license file. |
| `compatibility` | Optional. Add only for real product, tool, OS, package, network, or permission requirements. |
| `metadata` | Optional key-value map for owner, tags, source, or namespaced harness notes. Avoid frontmatter version numbers. |
| `allowed-tools` | Optional and security-sensitive. Add only with narrow justification; support varies between harnesses. |
| `globs` | Provider extension describing related paths. Useful for routing where supported, but not proof of activation. |
| `alwaysApply` | Provider extension. Omit unless the guidance is tiny, universal, and worth loading every turn. |
| `hide` | Provider extension controlling prompt-list visibility where supported; it does not by itself disable model invocation. |
| `disableModelInvocation` / `disable-model-invocation` | Provider spellings that prevent automatic/model invocation. Use only when a user, command, parent skill, or wrapper loads the skill explicitly. |

Emit only fields with signal, and never assume extension spellings are equivalent across harnesses. A simple portable skill usually needs only `name`, `description`, and a short body.

## Choose the workflow

Infer intent from the invocation and current conversation.

- Create: no existing skill is provided, or the user asks to create/write/make a skill.
- Update/refine: an existing skill path/name is provided, or the user asks to improve frontmatter, description, body, scripts, references, or evals.
- Evaluate: the user asks to test/evaluate/benchmark/optimize triggering, or a change needs proof.
- Cleanup: the user asks to audit, dedupe, remove, disable, compact, or find stale skills.
- Mixed: preserve existing skill identity first; analyze cleanup candidates before deletion; ask only when a destructive choice cannot be inferred safely.

Modifiers like `scripts` or `references` narrow review scope. They do not force creation.

## Thin orchestrator principle

- A user-invoked skill that mostly runs another skill with context should be a thin orchestrator.
- A model-invoked skill should hold reusable discipline, vocabulary, or process.
- Do not duplicate the same operational procedure across sibling skills; extract the reusable discipline once and have wrappers point to it.
- If a requested skill mostly says “do X, but with Y context”, prefer a short wrapper over copying X.
- If the requested artifact is a rule file under `.config/agents/rules/`, `.agents/rules/`, `.omp/rules/`, `.cursor/rules/`, `.windsurf/rules/`, or `.clinerules`, use `craft-rule` instead of applying skill frontmatter guidance.

## Activation and transport

- Keep the portable process in the skill body. Slash commands, wrappers, globs, and harness metadata are discovery or invocation transports.
- Prefer each host's native skill invocation over a new wrapper; verify syntax from live inventory. Current verified forms are OMP `/skill:<name>` and Grok CLI `/<name>`; other hosts adapt only this seam.
- If natural-language work must be shaped before action, keep the skill model-discoverable or have an already-loaded parent explicitly load it.
- Keep genuinely manual skills manual; do not compensate with `alwaysApply` or a duplicated body.

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
7. If improving quality, compare against the old behavior or a prior snapshot when practical.

## Evaluate a skill

Start small, then scale only when evidence warrants it.

1. Verify the live inventory and provider precedence; filesystem presence is fallback context, not proof that a skill loaded.
2. Test discoverability and invocation timing for each supported transport, such as natural-language matching, explicit user/slash invocation, or a parent wrapper.
3. Verify execution behavior and output after loading separately from discovery.
4. Include at least one positive and one near-miss transport case.
5. Compare a new skill with no skill, or an updated skill with a saved baseline, when practical.
6. Grade objective behavior from files, outputs, or traces; avoid exact-prose assertions.
7. Generalize from failures rather than overfitting descriptions or bodies to eval wording.

For description tuning, keep the best description by observed discovery behavior, not filesystem presence or train-set fit.

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
