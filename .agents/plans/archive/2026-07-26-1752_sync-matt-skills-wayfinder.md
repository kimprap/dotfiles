# Sync Matt Pocock Skills and Add Wayfinder

**Datetime**: 2026-07-26-1752
**Scope**: `.config/agents/skills` entries sourced from `mattpocock/skills`, plus the upstream `wayfinder` skill
**Summary**: Semantically synchronize only locally installed Matt Pocock skills with material runtime updates, promote the announced round-based grilling behavior, and install a harness-agnostic `wayfinder` with a source-grounded usage handoff.
**Status**: DONE

## Context

The local Matt-derived skills were imported on 2026-06-29 and deliberately preserve local names while sharing behavior across agent harnesses, so synchronization must merge later runtime behavior rather than overwrite local naming or claim literal directory equality. At pinned upstream commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`, stable `grill-me` and `grill-with-docs` wrappers delegate to `grilling`, while the announced round-based protocol exists as `skills/in-progress/batch-grill-me`; the supplied announcement establishes that protocol as the requested behavior despite its not-yet-released v1.2 status. `wayfinder` is stable under `skills/engineering/wayfinder` and maps work too large or unclear for one session into persistent decision tickets. The final shared skill bodies specify capability-level behavior—parallel read-only research when supported, direct fallback otherwise—without naming OMP, Grok CLI, Cursor, or provider-specific executor tools.

## Tasks

- [x] T1. Synchronize changed installed upstream skills
  - completed 2026-07-26-1830
- [x] T2. Install and adapt the upstream wayfinder skill
  - completed 2026-07-26-1832
- [x] T3. Verify skill contents and invocation behavior
  - completed 2026-07-26-1848
- [x] T4. Remove harness-specific orchestration wording
  - completed 2026-07-26-1912

## Approach

### T1. Synchronize changed installed upstream skills

Use upstream commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d` as the immutable comparison point. Update only installed skills with material runtime changes, preserving each local directory/name and expressing shared behavior independently of any harness's tool names or invocation syntax:

1. `.config/agents/skills/grilling/SKILL.md`: keep `name: grilling`, keep the skill model-invoked, and set the description exactly to `Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.` Replace the serial-question body with the frontier-round protocol from `skills/in-progress/batch-grill-me/SKILL.md`. Define a round as every decision whose prerequisites are settled; number all frontier questions, give a recommendation for each, defer questions that depend on another open question, recompute after each answer set, and stop only when the frontier is empty and the user confirms shared understanding. Facts remain agent work: delegate independent lookups to independent read-only research workers and run them concurrently when the host supports it; otherwise perform them directly. Keep unrelated frontier questions moving and wait only when an outstanding lookup is the sole blocker.
2. `.config/agents/skills/eng-improve-codebase-architecture/`: merge upstream YAGNI commit `45afd8074a8b7de5fe073845d080fa9dd6c429fa` before the existing glossary/ADR reads and adopt upstream’s `decision tree` terminology from commit `3bb587fa5c6950f948f84b940d4bbd4d3b2bfca9`. Scope before scanning: honor a user-named module/subsystem/pain point; otherwise inspect a meaningful stretch of commit history for repeatedly changed hot spots, widening only when no hot spot exists. Preserve the local `eng-codebase-design` references and agent-harness review scope. Explore with available read-only codebase capabilities, delegating independent areas in parallel when supported and falling back to direct exploration. Keep `HTML-REPORT.md` behavior unchanged apart from transport-neutral cross-skill references.
3. `.config/agents/skills/eng-prototype/`: merge the current upstream primary-source lifecycle. In `SKILL.md`, retain `name: eng-prototype`, adopt the current discovery description, remove `disable-model-invocation: true`, and replace delete-or-absorb behavior with exact rule 6 semantics: fold the validated decision into real code, capture the prototype on a throwaway branch outside main, and leave a context pointer plus the settled question/verdict on the implementation issue. Update `LOGIC.md` section 7 and `UI.md` section 6 to apply that same capture policy; keep all unaffected branch mechanics unchanged.
4. `.config/agents/skills/eng-tdd/`: replace `SKILL.md` with the current reference-only red → green contract while retaining `name: eng-tdd`; require pre-agreed public seams, add the tautological-test anti-pattern, keep vertical tracer-bullet slices, and move refactoring out of the TDD loop. Omit the upstream `code-review` skill reference because that skill is not installed locally. Append the upstream tautological-test examples to `tests.md`, leave byte-identical `mocking.md` untouched, and delete obsolete `refactoring.md`, which upstream removed when it dropped the refactor stage.

Do not modify `.config/agents/skills/domain-modeling`, `.config/agents/skills/eng-codebase-design`, or `.config/agents/skills/eng-diagnosing-bugs`: their upstream runtime bodies are unchanged since import or their current differences are intentional local adaptations. The stable `grill-me` and `grill-with-docs` wrappers keep their thin behavior but refer to sibling skills by name rather than host-specific slash syntax. The deliberately excluded source-tree delta is Codex `agents/openai.yaml` adapter metadata from upstream commit `697d4ce9742da558fd1ba6697c8e9775e2e302dd`; shared skill behavior does not depend on it.

### T2. Install and adapt the upstream wayfinder skill

Create `.config/agents/skills/wayfinder/SKILL.md` from `skills/engineering/wayfinder/SKILL.md` at commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`. Keep `name: wayfinder`, its description, and `disable-model-invocation: true`. Also create `.config/agents/skills/wayfinder/references/issue-tracker-local.md` from the `## Wayfinding operations` section of upstream `skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md` at the same commit, so the source-defined fallback is usable without installing the setup skill. Do not copy `agents/openai.yaml`; it is optional provider UI metadata and no local shared skill uses an `agents/` adapter convention.

Apply only the compatibility edits needed by the installed skill inventory:

- Refer to `eng-prototype`, `grilling`, and `domain-modeling` as sibling skills by name; host-specific slash syntax is an invocation transport, not part of the shared process.
- Replace both `/research` instructions with a capability-level research batch: one independent read-only research worker per new research ticket, concurrent when supported and sequentially isolated otherwise. After the map and blockers are written, wait for all launched research work; the coordinating agent records each result's source-linked findings directly as the remote resolution comment or local `## Answer`, resolves only those research tickets, and updates the map pointers. Do not require a research branch, but link any durable artifact a worker produces. Research remains the sole exception to one-ticket-per-session.
- Replace the unavailable `/setup-matt-pocock-skills` instruction with: read `docs/agents/issue-tracker.md` when present; otherwise read `[references/issue-tracker-local.md](references/issue-tracker-local.md)`. The bundled fallback must retain the exact upstream paths and operations: map `.scratch/<effort>/map.md`; child tickets `.scratch/<effort>/issues/NN-<slug>.md`; `Type: research|prototype|grilling|task`; `Status: claimed|resolved`; `Blocked by: NN, NN`; first open, unblocked, unclaimed ticket by number is the frontier choice; claim before work; resolve by appending `## Answer`, setting `Status: resolved`, and appending a gist/link pointer to `## Decisions so far`. Do not add setup, tracker, triage, or other Matt skills.
- In the Grilling ticket description, replace upstream’s stale “one question at a time” wording with “one dependency-safe frontier round at a time” so `wayfinder` agrees with the requested batching behavior; keep HITL ownership and never let the agent answer the human’s decisions.

Preserve the upstream map contract exactly: a `wayfinder:map` issue is the index; named child issues are decision tickets; ticket labels are `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`; native blocking defines the unblocked/unclaimed frontier; the map body contains `## Destination`, `## Notes`, `## Decisions so far`, `## Not yet specified`, and `## Out of scope`. Charting creates the map/tickets, wires blockers, resolves any parallel research batch as described above, then stops without resolving a non-research ticket. Working mode claims and resolves one decision ticket, records its resolution, updates the Decisions-so-far pointer, and then advances newly visible fog.

### T3. Verify skill contents and invocation behavior

Verify file scope against the pinned upstream commit and explicit local adaptations, statically reject provider/tool names from shared skill bodies, and exercise the changed grilling, prototype, and wayfinder behaviors in OMP as one concrete host. Confirm Grok CLI discovers the same skills and attempt read-only Grok and Cursor runtime checks when credentials permit. Invocation syntax remains a host transport: OMP uses `/skill:wayfinder ...`, Grok CLI uses `/wayfinder ...`, and Cursor exposes the same skill through its own skill UI/invocation mechanism.

### T4. Remove harness-specific orchestration wording

Apply the user's portability override across the synchronized skill family:

- Replace OMP `task`, `agent: "scout"`, job-id, and `hub.wait` instructions with capability-level rules: independent read-only workers, concurrent execution when supported, direct or sequential fallback when not, and coordination based on dependency readiness.
- Replace slash-form sibling-skill calls with references by skill name in `grilling`, `grill-me`, `grill-with-docs`, `eng-improve-codebase-architecture`, its HTML report reference, `wayfinder`, and the local tracker reference.
- Keep harness-specific invocation examples only in verification/reporting, where they validate transport rather than define behavior.

## Critical files & anchors

- `https://github.com/mattpocock/skills/blob/ed37663cc5fbef691ddfecd080dff42f7e7e350d/skills/in-progress/batch-grill-me/SKILL.md` — exact unreleased frontier-round protocol requested by the supplied announcement.
- `https://github.com/mattpocock/skills/blob/ed37663cc5fbef691ddfecd080dff42f7e7e350d/skills/engineering/wayfinder/SKILL.md` — stable map, decision-ticket, fog, charting, and working-session contract.
- `https://github.com/mattpocock/skills/blob/ed37663cc5fbef691ddfecd080dff42f7e7e350d/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md` — exact standalone fallback operations to bundle with wayfinder.
- `.config/agents/skills/eng-improve-codebase-architecture/SKILL.md` — local harness adaptations that must survive the upstream YAGNI scope merge.
- `.config/agents/skills/eng-tdd/refactoring.md` — obsolete local stage file removed by the upstream reference-only red → green cutover.

## Verification / Done criteria

- [x] The skill Edit/Write result set contains only: `.config/agents/skills/{grilling,grill-me,grill-with-docs}`; `.config/agents/skills/eng-improve-codebase-architecture/{SKILL.md,HTML-REPORT.md}`; `.config/agents/skills/eng-prototype/{SKILL.md,LOGIC.md,UI.md}`; `.config/agents/skills/eng-tdd/{SKILL.md,tests.md,refactoring.md}` with `refactoring.md` removed; and `.config/agents/skills/wayfinder/{SKILL.md,references/issue-tracker-local.md}` newly created. No unrelated skill is touched.
- [x] From `/Users/kim/.dotfiles`, use `glob` with `.config/agents/skills/grilling/**/*;.config/agents/skills/eng-improve-codebase-architecture/**/*;.config/agents/skills/eng-prototype/**/*;.config/agents/skills/eng-tdd/**/*;.config/agents/skills/wayfinder/**/*`. Expected: no `agents/openai.yaml`, no `eng-tdd/refactoring.md`, and the new wayfinder manifest is exactly `SKILL.md` plus `references/issue-tracker-local.md`.
- [x] Use `grep` across `grilling`, `grill-me`, `grill-with-docs`, `eng-improve-codebase-architecture`, and `wayfinder` with `OMP|agent: "scout"|hub\\.wait|`task` tool|`task` batch|/skill:|/eng-prototype|/eng-codebase-design|/grilling|/domain-modeling`; expect no match. Then verify capability-level fallbacks mention concurrent read-only workers when supported and direct or sequential execution otherwise.
- [x] Run from `/Users/kim/.dotfiles`: `omp -p --no-session --tools=read --skills=grill-me,grilling --max-time=5m "/skill:grill-me Emit only the first interview round. Storage backend and access policy are independent decisions; rotation cadence depends on the backend; audit retention depends on the access policy."`. Expected: exactly two numbered questions—backend and access policy—with a recommendation for each; dependent questions remain deferred.
- [x] Run from `/Users/kim/.dotfiles`: `omp -p --no-session --tools=read --skills=eng-prototype --max-time=5m "I want to sanity-check three radically different UI layouts for an existing settings page. Describe the prototype workflow and what survives after a winner is chosen."`. Expected: `eng-prototype` activates without an explicit slash invocation, uses switchable structural variants, folds the winner into real code, and keeps the full prototype only as a primary source on a throwaway branch with an issue/context pointer.
- [x] Create an isolated tracker fixture with `mktemp -d` and `git init`, without `docs/agents/issue-tracker.md`, to exercise the bundled local-Markdown reference.
- [x] In OMP with tools enabled, explicitly invoke Wayfinder to chart `secret-store-migration` with two grilling tickets, where ticket 02 is blocked by ticket 01. Read the map and tickets. Expected: the five required map headings; numbered children with `Type: grilling`; ticket 02 has `Blocked by: 01`; neither ticket is resolved.
- [x] Resume Wayfinder in a fresh OMP session with the human decision `use macOS Keychain`. Expected: ticket 01 contains `Status: resolved` and `## Answer`; ticket 02 remains unresolved and becomes frontier-eligible; `## Decisions so far` gains exactly one named link/gist.
- [x] Run the OMP near miss with `--tools=read` and the manual `wayfinder` skill available but not invoked. Expected: no Wayfinder map headings or decision-ticket workflow, confirming explicit-only behavior in OMP.
- [x] Explicitly invoke Wayfinder in OMP and ask only how it handles three independent research tickets. Expected: one read-only worker per ticket in parallel when supported, sequential isolation otherwise, and identical tracker-resolution semantics in both paths.
- [x] Run `grok inspect`; expect `grilling`, both wrappers, architecture, prototype, TDD, and Wayfinder in the discovered project inventory. Attempt live Grok and Cursor checks. Observed limitation: Grok returned HTTP 402 because its usage balance is exhausted; Cursor required authentication. Record these as unverified runtimes, not skill failures.
- [x] Completion reporting explains that shared skill bodies are harness-agnostic while invocation syntax and concrete executor/tool names belong to each host's transport layer.

## Assumptions & contingencies

- Use upstream commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`, not a moving `main`, for reproducible execution. A later upstream release is a separate synchronization pass.
- Adopt `batch-grill-me` now even though upstream package version `1.1.0` still classifies it as in-progress and has no v1.2 tag: the supplied announcement explicitly requests the round-based direction. Keep the stable thin `grill-me` and `grill-with-docs` wrappers; both inherit batching through local `grilling`.
- Preserve local `eng-*` names, model-invocation choices except the upstream prototype change, agent-harness review scope, and installed cross-skill names. Merge behavior rather than replacing whole local directories blindly.
- Shared skill bodies stay free of provider-specific executor and invocation syntax. Optional frontmatter or UI metadata may remain host extensions when it carries real transport behavior, but the operational contract must not depend on it. OMP runtime and Grok discovery are verified; Grok and Cursor runtime parity remains unverified because of external account state.
- Wayfinder is planning-only unless a map’s `## Notes` explicitly opts into execution. When a target repo lacks `docs/agents/issue-tracker.md`, use the bundled upstream local-Markdown operations rather than asking the executor to invent tracker behavior.

## Completion Summary

- Synchronized the four installed skills with material upstream runtime changes and added Wayfinder plus its local-Markdown fallback at pinned commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`.
- Adopted the announced dependency-safe grilling rounds before upstream v1.2, preserved local skill names, removed obsolete TDD refactoring guidance, and retained prototype experiments as off-main primary sources.
- Verified the grilling wrappers, prototype discovery, explicit-only Wayfinder behavior, local map chart/resume flow, and research-batch semantics in OMP. `grok inspect` confirms the shared skills are discovered by Grok CLI.
- Later user override, 2026-07-26-1912: removed OMP-specific `task`, `scout`, job-id, `hub.wait`, and slash-form sibling-skill wording. Shared bodies now describe capability-level parallel research with direct/sequential fallback, so OMP, Grok CLI, Cursor, and similar Agent Skills hosts can map the same behavior to native tools.
- Residual risk: live Grok verification is blocked by exhausted usage balance (HTTP 402), and live Cursor verification is blocked by missing authentication. The pre-v1.2 grilling source may also require reconciliation when upstream releases v1.2.
