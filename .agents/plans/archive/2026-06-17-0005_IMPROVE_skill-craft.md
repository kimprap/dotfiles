# Improvement Plan: Tighten skill-craft trigger coverage and done criteria

**Datetime**: 2026-06-17-0005
**Mode**: standard
**Scope**: `.config/agents/skills/skill-craft/` after initial implementation.
**Summary**: `skill-craft` is compact and functional, but two small refinements will make it less brittle: align done criteria with the full create/update/evaluate/cleanup scope, and make trigger/eval coverage explicitly include one-word "cleanup" plus `references` candidate review.

## Why this matters

The skill's body already follows the intended single-skill structure, but its final done criteria currently says "created or updated" while the skill also evaluates and cleans up skills. That mismatch can make future agents stop too early on evaluation or cleanup work. The frontmatter description and smoke evals also cover cleanup/scripts, but not the one-word `cleanup` trigger or `references` candidate path as explicitly as current usage expects.

## Current state

- Files and 1-line roles:
  - `.config/agents/skills/skill-craft/SKILL.md` — main skill instructions and cross-harness frontmatter catalog.
  - `.config/agents/skills/skill-craft/evals/evals.json` — compact smoke prompts for create, scripts review, and cleanup.
- Repository state before audit: `git status --porcelain`, `git diff --cached`, and `git diff -- .config/agents/skills/skill-craft .agents/plans` produced no output.
- Current frontmatter trigger excerpt:
  - `.config/agents/skills/skill-craft/SKILL.md:3-6`
    ```yaml
    description: >
      Create, update, evaluate, and clean up agent skills. Use when authoring SKILL.md files,
      refining skill frontmatter or descriptions, adding evals/scripts/references, auditing
      duplicate or stale skills, or deciding whether to merge, delete, or keep existing skills.
    ```
- Current routing and modifier behavior:
  - `.config/agents/skills/skill-craft/SKILL.md:61-71`
    ```markdown
    ## Choose the workflow

    Infer intent from the invocation and current conversation.

    - Create: no existing skill is provided, or the user asks to create/write/make a skill.
    - Update/refine: an existing skill path/name is provided, or the user asks to improve frontmatter, description, body, scripts, references, or evals.
    - Evaluate: the user asks to test/evaluate/benchmark/optimize triggering, or a change needs proof.
    - Cleanup: the user asks to audit, dedupe, remove, disable, compact, or find stale skills.
    - Mixed: preserve existing skill identity first; analyze cleanup candidates before deletion; ask only when a destructive choice cannot be inferred safely.

    Modifiers like `scripts` or `references` narrow review scope. They do not force creation.
    ```
- Current update/refine behavior already uses session evidence and can deny candidates:
  - `.config/agents/skills/skill-craft/SKILL.md:86-94`
    ```markdown
    ## Update/refine an existing skill

    1. Preserve the existing directory name and `name` unless the user explicitly asks for a rename.
    2. Read the current skill and relevant bundled files before editing.
    3. Use current-session evidence: repeated chained tool calls suggest a candidate `scripts/` helper; repeated pasted context or long inline explanations suggest a candidate `references/` file.
    4. Review candidates before writing them. Deny `scripts/` or `references/` creation when the pattern is one-off, too environment-specific, cheaper inline, or not durable.
    5. Make targeted edits: tighten descriptions, remove unused instructions, add missing gotchas, move bulky conditional detail to references, or bundle repeated deterministic work as a script.
    6. Prefer cuts and clarifications over more rules. Exact sequences belong only where order is fragile.
    7. If improving quality, compare against the old behavior or prior version when practical.
    ```
- Current evaluation guidance:
  - `.config/agents/skills/skill-craft/SKILL.md:96-107`
    ```markdown
    ## Evaluate a skill

    Start small, then scale only if useful.

    1. Create 2-3 realistic prompts first, with at least one edge case or near miss.
    2. For a new skill, compare with no skill when practical. For an existing skill, compare with the previous version or snapshot.
    3. Add objective assertions after seeing outputs; do not invent brittle wording checks.
    4. Grade with evidence from files, outputs, or transcripts.
    5. Read traces for wasted steps, ignored guidance, false triggers, and repeated work.
    6. Iterate by generalizing from failures, not by overfitting to the prompt text.
    ```
- Current done criteria mismatch:
  - `.config/agents/skills/skill-craft/SKILL.md:135-143`
    ```markdown
    ## Done criteria

    For created or updated skills:

    - Frontmatter is valid and minimal for the target harnesses.
    - `name` matches the directory and the description triggers the intended use without broad false positives.
    - Body is concise, imperative, and conditional-section-free unless the section earns its place.
    - References/scripts/assets/evals exist only when they reduce future work or errors.
    - Verification matches the change: frontmatter checks for metadata edits, realistic prompts for behavior, trigger queries for descriptions, and cleanup proof before deletion.
    ```
- Current eval coverage for candidate review is script-only:
  - `.config/agents/skills/skill-craft/evals/evals.json:16-24`
    ```json
    {
      "id": 2,
      "prompt": "Update the csv-report skill, scripts. In this session the agent has repeatedly run the same three commands to normalize CSV headers, validate row counts, and emit a JSON summary.",
      "expected_output": "A review of the existing skill that treats scripts as a scoped review, then creates or proposes a script only if the repeated command chain is durable and worth maintaining.",
      "files": [],
      "assertions": [
        "The response treats scripts as a candidate review rather than an automatic requirement",
    ```
- Applicable conventions:
  - Dotfiles guide: edit files in `~/.dotfiles`, keep config changes small and boring, verify targeted changes.
  - Plan rule: active plans belong directly in `.agents/plans/` and must use `## Tasks` checkboxes.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Validate skill metadata and body | `python3 - <<'PY' ... PY` custom stdlib check shown below | prints `skill-craft validation ok` and exits 0 |
| Parse eval JSON | included in the same Python check | exits 0 and confirms three evals |
| Optional Agent Skills validation | `skills-ref validate .config/agents/skills/skill-craft` | exits 0 if installed; otherwise note unavailable |
| Scope check | `git status --porcelain .config/agents/skills/skill-craft .agents/plans/2026-06-17-0005_IMPROVE_skill-craft.md` | only in-scope paths appear |

Suggested validation command:

```bash
python3 - <<'PY'
from pathlib import Path
import json

skill = Path('.config/agents/skills/skill-craft/SKILL.md')
text = skill.read_text()
assert text.startswith('---\n')
end = text.find('\n---\n', 4)
assert end != -1
fm = text[4:end]
body = text[end + 5:]
assert 'name: skill-craft' in fm
assert 'description: >' in fm
assert 'cleanup' in fm.lower()
assert 'allowed-tools:' not in fm
assert 'license:' not in fm
for heading in [
    '## Frontmatter first', '## Choose the workflow', '## Create a skill',
    '## Update/refine an existing skill', '## Evaluate a skill',
    '## Clean up skills', '## Authoring rules', '## Scripts policy',
    '## Done criteria',
]:
    assert heading in body, heading
assert 'created, updated, evaluated, or cleaned' in body
assert 'references' in body and 'scripts' in body
data = json.loads(Path('.config/agents/skills/skill-craft/evals/evals.json').read_text())
assert data['skill_name'] == 'skill-craft'
assert len(data['evals']) == 3
assert any('references' in e['prompt'].lower() or 'references' in e.get('expected_output', '').lower() for e in data['evals'])
print('skill-craft validation ok')
PY
```

## Scope

**In scope** (the only files to modify):
- `.config/agents/skills/skill-craft/SKILL.md`
- `.config/agents/skills/skill-craft/evals/evals.json`
- `.agents/plans/2026-06-17-0005_IMPROVE_skill-craft.md` while executing this plan

**Out of scope**:
- `.config/agents/skills/improve/**` — separate existing skill.
- Creating `scripts/` or `references/` for `skill-craft` — current evidence does not justify them.
- Changing archived plans or previous commits.
- Renaming `skill-craft`.

## Audit Findings

### Concise Comments & Readability
- `SKILL.md` is already compact at 143 lines and needs no new section. Keep changes to existing frontmatter, eval text, and `## Done criteria`.
- The `## Done criteria` body at `SKILL.md:137` says "For created or updated skills" even though the skill handles evaluation and cleanup. Replace the lead-in and bullets, rather than adding a second checklist section.

### Non-brittle Implementation & Robustness
- `SKILL.md:71` and `SKILL.md:90-91` correctly treat `scripts` and `references` as evidence-based review scopes, not mandates. Preserve this; do not add a brittle dispatch table.
- Add the one-word `cleanup` trigger to the description because users commonly say "skill cleanup" rather than "clean up". This is a trigger precision improvement, not a behavior expansion.

### Prefactors & Structure (only where clearly beneficial in scope)
- No new references or scripts. The current body has enough room and the improvement is text-level.
- Do not split `skill-craft` into multiple skills; the single lifecycle skill remains the right structure.

### Efficiencies
- Updating the existing smoke eval #2 to include `references` avoids adding a fourth eval while covering the repeated-context candidate path.
- Keep the eval file at three prompts to preserve the original compact smoke-test intent.

### Helper / Abstraction Restraint
- Reject creating a helper script or reference file for this improvement. The work is declarative skill text, and adding supporting files would create maintenance cost without reducing future tool-call work.

### Other Quality / Correctness
- Align evaluation wording with bundled evals: prompts can include expected outputs/review criteria up front, but objective assertions should be refined after observing actual outputs during a run.
- Ensure final checks prove: no default `license` or `allowed-tools` in emitted frontmatter, description <=1024 chars, references/scripts candidate review remains non-mandatory, and evals parse.

## Tasks

- [x] Tighten trigger and candidate-review coverage in `SKILL.md`: add `cleanup` to the description, clarify assertion timing if needed, and broaden `## Done criteria` to created/updated/evaluated/cleaned outcomes without adding new sections.
  completed 2026-06-17-0057
- [x] Update `evals/evals.json` smoke eval #2 to cover both `scripts` and `references` as scoped candidate reviews while keeping exactly three evals.
  completed 2026-06-17-0057
- [x] Run validation commands and review the diff for concision, trigger precision, and no new unsupported-risky frontmatter.
  completed 2026-06-17-0057

## Verification / Done criteria

- [x] Custom Python validation prints `skill-craft validation ok` and exits 0.
  completed 2026-06-17-0057
- [x] `skills-ref validate .config/agents/skills/skill-craft` exits 0 if installed, or unavailability is noted.
  completed 2026-06-17-0057
- [x] `SKILL.md` frontmatter still omits default `license` and `allowed-tools`.
  completed 2026-06-17-0057
- [x] `SKILL.md` description includes both `clean up` or equivalent cleanup context and the one-word `cleanup` trigger, remains <=1024 chars, and still mentions create/update/evaluate.
  completed 2026-06-17-0057
- [x] `## Done criteria` covers created, updated, evaluated, and cleaned skill outcomes.
  completed 2026-06-17-0057
- [x] `evals/evals.json` remains valid JSON with exactly three evals, and one eval covers `references` candidate review.
  completed 2026-06-17-0057
- [x] Only in-scope files appear in `git status --porcelain`.
  completed 2026-06-17-0057

## STOP conditions

Stop and report before editing further if:
- The current `SKILL.md` no longer matches the cited excerpts above.
- Adding `cleanup` or reference-eval coverage pushes the description toward vague over-triggering.
- A requested validation requires installing new tools or dependencies.
- The change appears to require creating a `scripts/` or `references/` directory for `skill-craft`.
- Any out-of-scope file is required to complete the improvement.

## Execution notes

- Make the smallest text edits possible.
- Keep `SKILL.md` under 150 lines unless a clearer wording needs one or two extra lines.
- Preserve the non-brittle philosophy: modifiers guide review scope, but evidence decides whether to create artifacts.
- Re-run the custom validation after edits.

## Maintenance notes

- If future real usage shows agents still miss `references` candidate review, add one concise example under update/refine rather than a new section.
- If trigger false positives appear after adding `cleanup`, tune the description with near-miss negative queries rather than adding a rule list.

## Open Questions / Assumptions

- Assumption: The user wants a standard `/improve` plan, not immediate edits, because no `quick` keyword was provided.
- Assumption: Keeping exactly three eval prompts is preferable to adding a fourth, preserving the compact smoke-test intent.

## Completion Summary

Tightened `skill-craft` without changing its structure: the description now includes the one-word `cleanup` trigger, done criteria now cover created, updated, evaluated, and cleaned outcomes, and smoke eval #2 now covers both `scripts` and `references` candidate review. No scripts or references were added because the improvement was text-only. Validation passed with the custom Python check; `skills-ref` was unavailable and skipped. Residual risk is limited to future real-use trigger tuning if `cleanup` causes false positives.
