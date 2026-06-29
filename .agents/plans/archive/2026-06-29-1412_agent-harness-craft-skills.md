# Agent Harness Craft Skills and Engineering Imports

**Datetime**: 2026-06-29-1412
**Scope**: Local agent-harness skill and rule architecture under `.config/agents/{rules,skills}/`
**Summary**: Add a reusable implementation-plan companion rule, import Matt Pocock's core engineering skills under `eng-` names, rename `skill-craft` to `craft-skill`, and create `craft-rule` as the dedicated rule-authoring entrypoint.
**Status**: DONE

## Context

The requested change is to evolve the local agent-harness architecture, not to change application code. The end state is: `plan.md` remains the generic durable plan contract; a new `plan-impl-spec.md` companion rule defines when a plan must become implementation-grade; Matt Pocock's core engineering skills are imported with `eng-` prefixes; OMP's built-in handoff remains the only handoff path; `skill-craft` is renamed/refined into `craft-skill`; and a new `craft-rule` skill becomes the dynamic entrypoint for rule creation, update, optimization, and cleanup.

## Tasks

- [x] T1. Create `.config/agents/rules/plan-impl-spec.md` as the implementation-grade companion to `plan.md`.
  completed 2026-06-29-1459
- [x] T2. Import Matt Pocock's five core engineering skills into `.config/agents/skills/eng-*`, preserving bundled references/scripts and rewriting local names/references.
  completed 2026-06-29-1459
- [x] T3. Add explicit local agent-harness adaptation guidance to `eng-codebase-design` and `eng-improve-codebase-architecture`.
  completed 2026-06-29-1459
- [x] T4. Rename `.config/agents/skills/skill-craft/` to `.config/agents/skills/craft-skill/`, add thin-orchestrator guidance, and update its evals.
  completed 2026-06-29-1459
- [x] T5. Create `.config/agents/skills/craft-rule/` as the dedicated dynamic entrypoint for rule authoring, evaluation, cleanup, and TTSR/rulebook design.
  completed 2026-06-29-1459
- [x] T6. Verify inventory, frontmatter, local cross-references, and stale-name cleanup while leaving OMP's built-in handoff unchanged.
  completed 2026-06-29-1459

## Approach

### T1. Create `plan-impl-spec.md` as a rulebook companion, not a noisy TTSR interrupt

Create `.config/agents/rules/plan-impl-spec.md` with description-only frontmatter so OMP lists it in the rulebook and the model reads it when the task fits, instead of interrupting every engineering-skill tool stream.

Use this frontmatter exactly:

```yaml
---
description: Implementation-grade companion to plan.md. Use when creating or refining a durable plan for code, agent-harness, architecture, debugging, TDD, prototype-to-production, or other execution work where a fresh executor must make zero material decisions.
---
```

Use this exact section layout and opening line in the body:

```md
# Implementation Plan Companion

Read .config/agents/rules/plan.md first; this rule only adds implementation-grade body requirements.

## When to apply this rule
- Apply it when an engineering skill is producing or reshaping a durable implementation plan.
- Do not apply it just because an engineering skill is invoked for direct execution. Examples: direct `eng-tdd` work that writes tests now, direct `eng-diagnosing-bugs` repro construction, or an exploratory `eng-prototype` can skip it unless the result is being converted into a plan.
- Apply it for handoff-critical plans, architecture refactor plans, TDD feature plans, debugging fix plans, prototype-to-production plans, and agent-harness changes involving skills/rules/agents/vaults where a fresh executor should not invent decisions.

## Execution intent
State the exact end state and what must be true when the work is done.

## Ordered implementation
Map the implementation steps directly onto the `T1`, `T2`, ... task codes in the plan file. Each step must be specific enough that a fresh executor does not invent sequencing or behavior.

## Critical anchors
List the files, symbols, rule names, skill names, vault paths, or external docs that disambiguate the work.

## Skill outcomes to capture
Record the decisions/results produced by `eng-tdd`, `eng-diagnosing-bugs`, `eng-codebase-design`, `eng-prototype`, `eng-improve-codebase-architecture`, `grilling`, or `domain-modeling`. Do not restate those skills' full procedures.

## Verification
Give at least one check that exercises the new behavior, not just metadata parsing.

## Assumptions and fallbacks
Record pre-decided fallbacks only. Leave no open choices for the implementer.
```

Then edit `.config/agents/rules/plan.md` line 56 wording so it says: `apply .config/agents/rules/plan-impl-spec.md in addition to this base rule`.

### T2. Import the core Matt Pocock engineering skills under `eng-*`

Do not run the interactive `npx skills@latest add mattpocock/skills` installer because it will not apply the requested `eng-` local names. Instead, copy the upstream files directly from GitHub raw/API sources into `.config/agents/skills/`, preserving each skill's bundled reference/script files.

Use raw source URLs under this prefix: `https://raw.githubusercontent.com/mattpocock/skills/main/`. For example, upstream `skills/engineering/tdd/SKILL.md` is copied from `https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/tdd/SKILL.md`.

Create these directories and copy exactly these upstream files:

| Local directory | Upstream directory | Files to copy |
|---|---|---|
| `.config/agents/skills/eng-tdd/` | `skills/engineering/tdd/` | `SKILL.md`, `tests.md`, `mocking.md`, `refactoring.md` |
| `.config/agents/skills/eng-diagnosing-bugs/` | `skills/engineering/diagnosing-bugs/` | `SKILL.md`, `scripts/hitl-loop.template.sh` |
| `.config/agents/skills/eng-codebase-design/` | `skills/engineering/codebase-design/` | `SKILL.md`, `DEEPENING.md`, `DESIGN-IT-TWICE.md` |
| `.config/agents/skills/eng-prototype/` | `skills/engineering/prototype/` | `SKILL.md`, `LOGIC.md`, `UI.md` |
| `.config/agents/skills/eng-improve-codebase-architecture/` | `skills/engineering/improve-codebase-architecture/` | `SKILL.md`, `HTML-REPORT.md` |

For each imported `SKILL.md`, change only the local identity and local cross-skill references:

- `name: tdd` → `name: eng-tdd`
- `name: diagnosing-bugs` → `name: eng-diagnosing-bugs`
- `name: codebase-design` → `name: eng-codebase-design`
- `name: prototype` → `name: eng-prototype`
- `name: improve-codebase-architecture` → `name: eng-improve-codebase-architecture`
- Replace slash-skill references:
  - `/codebase-design` → `/eng-codebase-design`
  - `/improve-codebase-architecture` → `/eng-improve-codebase-architecture`
  - Keep `/grilling` and `/domain-modeling` unchanged because those skills already exist locally under those names.

Preserve upstream `disable-model-invocation: true` where present (`prototype`, `improve-codebase-architecture`). Preserve relative references (`tests.md`, `mocking.md`, `DEEPENING.md`, `DESIGN-IT-TWICE.md`, `LOGIC.md`, `UI.md`, `HTML-REPORT.md`) after copying the referenced files into the same local directories.

### T3. Add local agent-harness applicability notes to the architecture skills

After importing `eng-codebase-design`, add a short `## Local agent-harness adaptation` section near the top, after the opening purpose paragraph. Use this exact policy text:

- Agent harness artifacts count as modules when they have an interface and implementation: agent personas, skills, rules, hooks/extensions, memory backends, vault layouts, and research-agent framework components.
- For these artifacts, the interface is the activation surface and contract: frontmatter, description triggers, rule conditions/scopes, command names, vault paths, expected outputs, and user-facing workflow.
- The implementation is the body/procedure/scripts/files behind that interface.
- Use the same deep-module vocabulary for harness design: a skill/rule/vault layout is good when a small, predictable interface hides enough behavior to create leverage and locality.

After importing `eng-improve-codebase-architecture`, add a matching `## Local agent-harness adaptation` section after the opening paragraph. Use this exact policy text:

- This skill may review agent-harness architecture, not only traditional app code.
- For harness reviews, candidate areas include skill directories, rule layering, OMP extensions/hooks, vault organization, memory-bank placement, agent persona boundaries, and research framework file layout.
- When reviewing vault design, evaluate whether the structure exposes a small, stable navigation contract for agents and humans, avoids scattered duplicated concepts, and makes related research artifacts easy to find.
- Continue using `eng-codebase-design` vocabulary; use `domain-modeling` when the issue is terminology/context modeling, and use `craft-skill` or `craft-rule` when the chosen fix edits skills or rules.

Also adapt the upstream `improve-codebase-architecture` instruction that says to use the “Agent tool with `subagent_type=Explore`”: in this OMP repo, say to use the `task` tool with `agent: "explore"` and focused assignments.

### T4. Rename and refine `skill-craft` into `craft-skill`

Move `.config/agents/skills/skill-craft/` to `.config/agents/skills/craft-skill/`, preserving `SKILL.md` and `evals/evals.json`.

Update `.config/agents/skills/craft-skill/SKILL.md`:

- frontmatter `name: skill-craft` → `name: craft-skill`
- title `# skill-craft` → `# craft-skill`
- keep the description focused on creating/updating/evaluating/cleaning up skills, but add thin-orchestrator and reusable-discipline guidance in the body, not necessarily in frontmatter
- add a `## Thin orchestrator principle` section after `## Choose the workflow` with these exact bullets:
  - A user-invoked skill that mostly runs another skill with context should be a thin orchestrator.
  - A model-invoked skill should hold reusable discipline, vocabulary, or process.
  - Do not duplicate the same operational procedure across sibling skills; extract the reusable discipline once and have wrappers point to it.
  - If a requested skill mostly says “do X, but with Y context”, prefer a short wrapper over copying X.
  - If the requested artifact is a rule file under `.config/agents/rules/`, `.agents/rules/`, `.omp/rules/`, `.cursor/rules/`, `.windsurf/rules/`, or `.clinerules`, use `craft-rule` instead of applying skill frontmatter guidance.
- change every self-reference from `skill-craft` to `craft-skill`

Update `.config/agents/skills/craft-skill/evals/evals.json`:

- `skill_name` becomes `craft-skill`
- add or update one eval assertion so a prompt asking for a wrapper skill expects the thin-orchestrator principle instead of copied boilerplate

### T5. Create `craft-rule` as the dedicated dynamic rule-authoring entrypoint

Create `.config/agents/skills/craft-rule/SKILL.md` with this exact frontmatter:

```yaml
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
  version: "0.1.0"
  tags: "agent-rules,ttsr,rule-authoring,agent-harness-engineering"
---
```

Use this exact body outline:

```md
# craft-rule

Create, refine, evaluate, and clean up rule files without turning every preference into an always-on rule.

## Choose the workflow
- Create
- Update / refine
- Evaluate
- Cleanup

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

## Create a rule
- Choose rule type, target harness/provider, trigger surface, and false-positive boundary before writing.

## Update / refine a rule
- Preserve the rule name unless the user explicitly requests a rename.
- Inspect current triggers and actual recent failures before editing.

## Evaluate a rule
- Test 2–3 positive trigger prompts/tool arguments and at least one near-miss negative.

## Cleanup
- Verify kept-copy/provider precedence before deleting or disabling duplicates.

## Done criteria
- frontmatter parses
- trigger behavior is narrow enough
- no always-apply unless tiny and universal
- positive/negative trigger checks are documented
```

Create `.config/agents/skills/craft-rule/evals/evals.json` with `skill_name: "craft-rule"` and three smoke evals:

1. Create a TTSR rule for `local://*-plan.md` writes; expected output chooses scope/path matching over content regex.
2. Refine an over-broad rule that triggers on `plans?\b`; expected output narrows condition/scope and requires a negative case.
3. Clean up duplicate `plan` rules across providers; expected output verifies provider precedence / kept copy before deletion.

### T6. Verify inventory, frontmatter, cross-references, and handoff scope

Do not import Matt's `handoff` skill and do not create a wrapper for it in this pass. Keep using OMP's built-in handoff.

Run these checks from `~/.dotfiles` after implementation.

1. Skill/rule inventory check with a JS eval cell:

```js
const fs = await import("node:fs/promises");
const path = await import("node:path");
const root = "/Users/kim/.dotfiles";
const required = [
  ".config/agents/rules/plan-impl-spec.md",
  ".config/agents/skills/craft-skill/SKILL.md",
  ".config/agents/skills/craft-skill/evals/evals.json",
  ".config/agents/skills/craft-rule/SKILL.md",
  ".config/agents/skills/craft-rule/evals/evals.json",
  ".config/agents/skills/eng-tdd/SKILL.md",
  ".config/agents/skills/eng-tdd/tests.md",
  ".config/agents/skills/eng-tdd/mocking.md",
  ".config/agents/skills/eng-tdd/refactoring.md",
  ".config/agents/skills/eng-diagnosing-bugs/SKILL.md",
  ".config/agents/skills/eng-diagnosing-bugs/scripts/hitl-loop.template.sh",
  ".config/agents/skills/eng-codebase-design/SKILL.md",
  ".config/agents/skills/eng-codebase-design/DEEPENING.md",
  ".config/agents/skills/eng-codebase-design/DESIGN-IT-TWICE.md",
  ".config/agents/skills/eng-prototype/SKILL.md",
  ".config/agents/skills/eng-prototype/LOGIC.md",
  ".config/agents/skills/eng-prototype/UI.md",
  ".config/agents/skills/eng-improve-codebase-architecture/SKILL.md",
  ".config/agents/skills/eng-improve-codebase-architecture/HTML-REPORT.md",
];
for (const rel of required) await fs.access(path.join(root, rel));
await fs.access(path.join(root, ".config/agents/skills/skill-craft/SKILL.md")).then(
  () => { throw new Error("old skill-craft directory still exists"); },
  () => {}
);
display("inventory ok");
```

2. Frontmatter/name check with a JS eval cell:

```js
const fs = await import("node:fs/promises");
const path = await import("node:path");
const root = "/Users/kim/.dotfiles/.config/agents/skills";
const dirs = ["craft-skill", "craft-rule", "eng-tdd", "eng-diagnosing-bugs", "eng-codebase-design", "eng-prototype", "eng-improve-codebase-architecture"];
for (const dir of dirs) {
  const text = await fs.readFile(path.join(root, dir, "SKILL.md"), "utf8");
  if (!text.startsWith("---\n")) throw new Error(`${dir}: missing frontmatter`);
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) throw new Error(`${dir}: unclosed frontmatter`);
  const fm = text.slice(4, end);
  if (!new RegExp(`^name:\\s*${dir}$`, "m").test(fm)) throw new Error(`${dir}: name mismatch`);
}
display("frontmatter names ok");
```

3. Content behavior spot checks with a JS eval cell:

```js
const fs = await import("node:fs/promises");
const root = "/Users/kim/.dotfiles";
const read = rel => fs.readFile(`${root}/${rel}`, "utf8");
const craftSkill = await read(".config/agents/skills/craft-skill/SKILL.md");
if (!craftSkill.includes("Thin orchestrator")) throw new Error("craft-skill missing thin orchestrator guidance");
if (!craftSkill.includes("craft-rule")) throw new Error("craft-skill does not route rule artifacts to craft-rule");
const craftRule = await read(".config/agents/skills/craft-rule/SKILL.md");
for (const needle of ["TTSR", "condition", "scope", "interruptMode", "write", "Base contract rule", "Companion overlay"]) {
  if (!craftRule.includes(needle)) throw new Error(`craft-rule missing ${needle}`);
}
const impl = await read(".config/agents/rules/plan-impl-spec.md");
if (!impl.includes("Read .config/agents/rules/plan.md first")) throw new Error("plan-impl-spec does not point to plan.md");
const design = await read(".config/agents/skills/eng-codebase-design/SKILL.md");
if (!design.includes("Agent harness artifacts count as modules")) throw new Error("eng-codebase-design missing harness adaptation");
const arch = await read(".config/agents/skills/eng-improve-codebase-architecture/SKILL.md");
if (!arch.includes("task") || !arch.includes("explore")) throw new Error("architecture skill not adapted to OMP explore subagents");
display("content checks ok");
```

4. Stale reference check:

Use the built-in `grep` tool, not shell grep, with pattern `skill-craft|/codebase-design|/improve-codebase-architecture` over `.config/agents/skills`. Expected remaining matches:

- no matches under `.config/agents/skills/craft-skill` for `skill-craft`
- no imported engineering skill references to `/codebase-design` or `/improve-codebase-architecture`
- archived `.agents/plans/archive/**` may still mention historical `skill-craft` and should not be edited

5. Optional external validator:

If `skills-ref` is installed, run `skills-ref validate` separately on `.config/agents/skills/craft-skill`, `.config/agents/skills/craft-rule`, and each `.config/agents/skills/eng-*` directory. If unavailable, record that it was skipped; the JS frontmatter checks above remain required.

## Critical files & anchors

- `.config/agents/rules/plan.md:52-57` — current generic completeness bar and the line that should name `plan-impl-spec.md` once the companion exists.
- `.config/agents/skills/skill-craft/SKILL.md:1-29,61-71,118-145` — current skill identity, workflow router, authoring rules, and done criteria to preserve while renaming/refining into `craft-skill`.
- `.config/agents/skills/skill-craft/evals/evals.json:1-38` — current eval file whose `skill_name` and wrapper-skill coverage must be updated after the directory rename.
- Matt skills README plus upstream directories under `skills/engineering/{tdd,diagnosing-bugs,codebase-design,prototype,improve-codebase-architecture}/` — source of the imported bodies and bundled reference/script files.
- `omp://rulebook-matching-pipeline.md`, `omp://ttsr-injection-lifecycle.md`, `src/export/ttsr.ts:129-152,166-286`, and `src/tools/write.ts:299-302` — rule/TTSR facts to encode in `craft-rule`.

## Verification / Done criteria

- [x] `plan-impl-spec.md` exists, points to `.config/agents/rules/plan.md`, and follows the exact section outline above.
- [x] The five `eng-*` skill directories exist with the listed bundled reference/script files copied from upstream.
- [x] Every `SKILL.md` under `craft-skill`, `craft-rule`, and the imported `eng-*` directories has `name:` matching the local directory.
- [x] `craft-skill` contains the thin-orchestrator section and routes rule-file requests to `craft-rule`.
- [x] `craft-rule` contains the TTSR/rulebook guidance, rule-type router, and the three smoke evals.
- [x] `eng-codebase-design` and `eng-improve-codebase-architecture` contain the explicit agent-harness adaptation sections.
- [x] No active local skill file still self-identifies as `skill-craft`, and no imported engineering skill still references `/codebase-design` or `/improve-codebase-architecture`.
- [x] OMP built-in handoff remains untouched; no Matt `handoff` skill is imported in this pass.

## Assumptions & contingencies

- Import exactly five new `eng-*` skills in this pass: `eng-tdd`, `eng-diagnosing-bugs`, `eng-codebase-design`, `eng-prototype`, and `eng-improve-codebase-architecture`. Do not import `handoff`, `to-prd`, `to-issues`, `triage`, `ask-matt`, or misc skills in this change.
- Keep existing local `grilling` and `domain-modeling` names. Do not create `eng-grilling` or `eng-domain-modeling` aliases in this pass because those skills already exist locally and are already referenced by active harness instructions.
- Use `plan-impl-spec.md` as a rulebook companion without `condition`, `scope`, or `interruptMode` initially. If later usage shows agents fail to read it when needed, add a separate TTSR rule after observing concrete misses.
- Preserve upstream engineering skill behavior except for the requested `eng-` names, cross-skill reference rewrites, OMP explore-subagent wording, and the explicit local agent-harness adaptation notes for the two architecture skills.
- Do not touch historical archived plans that mention `skill-craft`; they are provenance, not active configuration.

## Completion Summary

- T1-T3 delivered the new implementation-grade plan companion, explicit `plan.md` companion-rule callout, five imported `eng-*` skills, and the requested local harness adaptations for the two architecture skills.
- T4-T5 renamed `skill-craft` to `craft-skill`, added the thin-orchestrator guidance plus wrapper-skill eval coverage, and added `craft-rule` with rule-type routing, OMP TTSR guidance, and three smoke evals.
- T6 verified inventory, frontmatter/name alignment, content spot checks, and stale-reference cleanup with JS eval cells plus `grep`; OMP built-in handoff stayed untouched and no Matt `handoff` skill was imported.
- Residual risk: `skills-ref` is not installed here, so external validator coverage was unavailable; local JS and grep checks passed.
- Outcome: requested local agent-harness skill/rule architecture changes are complete and archived-ready.
