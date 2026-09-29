# Agent-skills lean-down batch 5a

**Datetime**: 2026-09-29-0214
**Scope**: Agent-skills lean-down batch 5a (proposal items 10, 13, 17, 18, 20 and follow-ups A–C)
**Summary**: Delete the `grill-me`, `grill-with-docs` and `dev-integration` skills and migrate every live caller, replace machine paths with relative links, move host syntax, ADR numbers, Atlas text and naming taste out of portable skills (into two new description-only rules), trim `dev-test-audit/SKILL.md` to intake/scope/boundaries, and apply the small item-20 fixes and three follow-ups.
**Status**: DONE
**Completed At**: 2026-09-29-0312

## Outcome and authority

- Outcome: The three wrapper/stage skills are gone and every live caller routes to `dev-grilling` or ordinary child-owned fan-in; `dev-test-audit/SKILL.md` keeps intake, scope and boundaries while the loop lives only in `references/audit-protocol.md`; portable skills, rules and references carry no machine path, host invocation syntax, one-user taste or ADR numbers, with each moved clause at its spec §3 owner (including new `rules/atlas-research.md` and `rules/naming-taste.md`); the item-20 fixes and follow-ups A–C are applied; guarded paths are unchanged and every suite stays green.
- Authority: Technical specification `.agents/artifacts/2026-09-29_agent-skills-lean-down-batch5a-spec.md` revision `agent-skills-lean-down-batch5a/spec-v2` (SHA-256 `31e8aeaf97094bcfba1e49f47f8c7bdb995713a717461014a9be2333d8a63276`), baseline `edf59e0`, which owns the clause-to-owner tables (§3), normative per-task text edits, invariants and errors (§4), effects, migration and rollback (§5), acceptance and the check scripts S1–S17 with their SHA-256 values (§6, §6.1), task boundaries and sizing rationale (§8), and stops and settled destinations D1–D3 (§9); it derives from the human-approved proposal `.agents/artifacts/2026-09-28_agent-skills-lean-down-proposal.md` ranked items 10, 13, 17, 18 and 20 plus the owner decisions and follow-ups A–C recorded in spec §1. `Sn` in a Check means: extract spec §6.1 block `Sn` to `/tmp/b5a/Sn.py` and run `python3 /tmp/b5a/Sn.py` from the repository root, where a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````, written as those lines joined with newlines plus one final newline; each extracted file's `shasum -a 256` must equal its spec §6.1 value before it counts as evidence. `LIVE` is the spec §2 pathspec.
- Assurance: standard

## Scope and effects

- Scope: Exactly the spec §6.1 S17 union allowlist plus T4's two empty Grok directories, changed as spec §4 directs and partitioned by task with no shared file: T1 deletes the three skill directories and migrates `dev-ask` (SKILL, WORKFLOW, evals, two fixtures), `dev-grilling`, `dev-domain-modeling`, ADR-0001 and ADR-0003; T2 rewrites the T2 machine-path pointers as relative links, rewords `improve` L12 and `mermaid.md` L7, drops the `return.md` self-path and removes `paths` from `rules/plan.md`; T3 trims `dev-test-audit/SKILL.md`, removes host syntax and ADR numbers from `papercut`, `init-ask`, `craft-skill` and `continual-learning`, genericizes `dev-research` and `craft-name`, and creates `rules/atlas-research.md` (D1) and `rules/naming-taste.md` (D2); T4 applies the Grok D3 `prompt_file`, removes the two empty Grok directories, folds `human-facing-language.md` into `AGENTS.md` and deletes it, fixes `.agents/AGENTS.md` L20, strips `#L` anchors from `harnesses/omp/agent-return.md`, retargets the plan-sync tests to codes and fields, and updates `craft-rule` L64/L94 and its eval id 1. The four tasks are independent and run concurrently, one child per task; each child edits only its own Targets and reads no sibling's in-flight state. Each task runs every AC it owns at its boundary. The whole-tree guard ACs AC-17, AC-18, AC-19 and AC-21 are owned by T4 (with the long suites AC-20 and AC-23) and are also gating reruns at the T1, T2 and T3 boundaries: each of those children reruns the four exact Checks before its Handoff, and a failing rerun blocks that Handoff. Because the tasks land concurrently in any order, the controller also reruns those four exact Checks once on the final tree after all four Handoffs and before review; a failure there is a stop. The long suites AC-20 and AC-23, and the task-local suites AC-22 and AC-24, run only at their owner's boundary and are not gating reruns elsewhere: no task edits a file the acp-controller suites load, and each other suite reads only its owner's files. No sibling AC reads T4's `.config/agents/AGENTS.md` or `.agents/AGENTS.md` except AC-1's `LIVE` grep for the removed skill names, which T4's spec §4 text never contains; neither file is a symlink to the other. Every AC reads only its owner's files (S17's allowlist is the task-independent union), so each holds at its owner's boundary whichever siblings have landed.
- Effects: Repository working-tree changes only, limited to the Scope paths: authorized working-tree deletion (no `git rm`) of `.config/agents/skills/grill-me/`, `.config/agents/skills/grill-with-docs/`, `.config/agents/skills/dev-integration/` (T1) and `.config/agents/rules/human-facing-language.md` (T4); `rmdir` of the untracked empty `.config/agents/harnesses/grok/personas` and `.config/agents/harnesses/grok/roles` (T4; `rmdir` fails safely if not empty); creation of the two new rules (T3); writing throwaway check scripts under `/tmp/b5a/`. The tree is never committed between tasks; it is committed once after all four tasks land, as the route's later shipping step, not a task effect. No git staging, commits or pushes; no network access; no live OMP or Grok runs; no home-directory change.
- Non-goals: Proposal item 9 (dev-ask eval shrink; batch 5b) and every other proposal item; any new skill, stage, field, test or eval case; any change to grilling, audit, papercut, research, naming or plan semantics beyond the named moves; any dev-ask eval change other than the spec §4 T1 name repairs; `/skill:` eval prompts and eval fixtures naming `/Users/kim/.agents/AGENTS.md`; `skills/{reconcile,retrace,rethink,omp-update}/`, `references/packed-label.md`, `harnesses/omp/acp-controller/`, `bin/` (including `bin/omp-copy-plan-artifact`), `harnesses/omp/extensions/plan-artifact-sync.js`, `harnesses/omp/config.yml`, both `plan-transport.md` files, `opinion-agent.md`, the OMP agent wrappers and `docs/adr/INDEX.md`; `craft-rule` and `mnemopi-*` OMP-specific subject text, `return.md` L10's OMP adapter link, `harnesses/*` host adapters other than the named edits, `hooks/scripts/ttsr-guard.py`, `completion-presentation/scripts/render.py`; `bootstrap` (including `LEGACY_SYMLINKS`); historical `.agents/plans/**` and `.agents/artifacts/**`, `.scratch/`, `archive/`; ADR-0001 L61 and L147.

## Tasks

- [x] T1. Delete the grill wrappers and dev-integration and migrate every caller to dev-grilling or ordinary fan-in
  completed 2026-09-29-0225
  - Owner: lean-5a-wrappers-child
  - Depends on: none
  - Targets: .config/agents/skills/grill-me/, .config/agents/skills/grill-with-docs/, .config/agents/skills/dev-integration/, .config/agents/skills/dev-ask/SKILL.md, .config/agents/skills/dev-ask/WORKFLOW.md, .config/agents/skills/dev-ask/evals/evals.json, .config/agents/skills/dev-ask/evals/fixtures/r-grill/case.json, .config/agents/skills/dev-ask/evals/fixtures/r-prototype-near-miss/case.json, .config/agents/skills/dev-grilling/SKILL.md, .config/agents/skills/dev-domain-modeling/SKILL.md, docs/adr/0001-dev-workflow-authority-and-routing.md, docs/adr/0003-bounded-assurance-and-repair.md
  - Acceptance: AC-1, AC-2, AC-3, AC-4
  - Receiver: route-agent dev-implementation controller

- [x] T2. Replace machine paths with relative links and make plan.md frontmatter description-only
  completed 2026-09-29-0225
  - Owner: lean-5a-links-child
  - Depends on: none
  - Targets: .config/agents/rules/plan.md, .config/agents/rules/mermaid.md, .config/agents/skills/dev-code-review/references/review-rethink.md, .config/agents/skills/dev-implementation/SKILL.md, .config/agents/skills/dev-implementation/references/compact-checklist.md, .config/agents/skills/dev-implementation/references/execution-recovery.md, .config/agents/skills/dev-implementation/references/plan-orchestration.md, .config/agents/skills/dev-specification/SKILL.md, .config/agents/skills/dev-ticketing/SKILL.md, .config/agents/skills/dev-test-audit/references/audit-protocol.md, .config/agents/skills/improve/SKILL.md, .config/agents/references/impl-rethink/impl-rethink.md, .config/agents/references/agent-return/return.md
  - Acceptance: AC-5, AC-6, AC-22
  - Receiver: route-agent dev-implementation controller

- [x] T3. Move host syntax, ADR numbers, Atlas text and naming taste to their owners and trim the audit skill
  completed 2026-09-29-0225
  - Owner: lean-5a-moves-child
  - Depends on: none
  - Targets: .config/agents/skills/dev-test-audit/SKILL.md, .config/agents/skills/papercut/SKILL.md, .config/agents/skills/papercut/WORKFLOW.md, .config/agents/skills/init-ask/SKILL.md, .config/agents/skills/craft-skill/SKILL.md, .config/agents/skills/continual-learning/SKILL.md, .config/agents/skills/dev-research/SKILL.md, .config/agents/skills/craft-name/SKILL.md, .config/agents/rules/atlas-research.md, .config/agents/rules/naming-taste.md
  - Acceptance: AC-7, AC-8, AC-9, AC-10, AC-24
  - Receiver: route-agent dev-implementation controller

- [x] T4. Apply the small fixes and follow-ups and own the whole-tree guards and long suites
  completed 2026-09-29-0225
  - Owner: lean-5a-fixes-child
  - Depends on: none
  - Targets: .config/agents/harnesses/grok/config.toml, .config/agents/harnesses/grok/personas/, .config/agents/harnesses/grok/roles/, .config/agents/AGENTS.md, .config/agents/rules/human-facing-language.md, .agents/AGENTS.md, .config/agents/harnesses/omp/agent-return.md, .config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js, .config/agents/skills/craft-rule/SKILL.md, .config/agents/skills/craft-rule/evals/evals.json
  - Acceptance: AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AC-17, AC-18, AC-19, AC-20, AC-21, AC-23
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. Removed skills gone and unnamed
  Behavior: `grill-me`, `grill-with-docs` and `dev-integration` no longer exist, and no live file names them.
  Check: `S1`; expect `ok`.

- [x] AC-2. Callers route to dev-grilling
  Behavior: `dev-ask` routes a candidate approach to `dev-grilling` with the owner's repository-evidence phrase and has no integrate trigger or machine path; its map routes to `dev-grilling`; `dev-grilling` limits repository reading to decision-bearing evidence and names no wrappers; `dev-domain-modeling` lists `dev-grilling` without `grill-with-docs`; `dev-ask` links `plan-rethink.md` relatively.
  Check: `S2`; expect `ok`.

- [x] AC-3. dev-ask evals repaired only by name
  Behavior: The dev-ask evals stay valid and in their dump format. Exactly the §4 T1 eval edits happen: the four grilling cases require and first-dispatch `dev-grilling`, both near misses forbid `dispatch:dev-grilling` once, `R-ARTIFACT-LANE` no longer lists `dispatch:dev-integration`, free text that named a removed skill names none (and names `dev-grilling` where it named a grill skill). Every other value in every case is unchanged. The two fixtures carry their case's new `inputs` and nothing else changes.
  Check: `S3`; expect `ok`.

- [x] AC-4. ADR fan-in lines amended in place
  Behavior: ADR-0003 changes only L5, L10, L40, L44 and L84, and ADR-0001 only L5 and L59, with no line added or removed. ADR-0003 D04 still opens with the ordinary-fan-in decision and ends with the audit sentence. Scope and reopen lines say fan-in without "neutral". ADR-0001 D11 still rejects pre-fan-in lineage verification.
  Check: `S4`; expect `ok`.

- [x] AC-5. T2 files use relative links
  Behavior: The T2 files carry no machine path. Every former `~/.agents/<p>` pointer (other than `return.md`'s self-path) is a relative link to the same file. Every relative link in those files resolves. `mermaid.md` still names `mermaid-check`.
  Check: `S5`; expect `ok`.

- [x] AC-6. plan.md frontmatter description-only
  Behavior: `plan.md` frontmatter holds only its baseline `description` line, and every other non-blank baseline line survives except the rewritten L21–22 and L76.
  Check: `S6`; expect `ok`.

- [x] AC-7. dev-test-audit skill trimmed to intake and boundaries
  Behavior: `dev-test-audit/SKILL.md` has only its title, `Intake and scope` and `Boundaries` headings, no numbered loop and no machine path. It still points to `audit-protocol.md` as the sole loop contract. Every non-blank baseline line in L1–25 and L51–53 survives.
  Check: `S7`; expect `ok`.

- [x] AC-8. No host syntax or ADR numbers in portable skills
  Behavior: `papercut` (skill and map), `init-ask`, `craft-skill` and `continual-learning` name no host or `/skill:` syntax. They keep their host-neutral statements. The papercut map names no ADR or decision number and points to the ADR index. Every other non-blank baseline line survives.
  Check: `S8`; expect `ok`.

- [x] AC-9. Atlas text moved to atlas-research rule
  Behavior: `dev-research` names no Atlas and keeps generic stored-evidence rules (qualified capability, no stale evidence, fallback, opt-in persistence, freshness section). Every non-rewritten line survives. `rules/atlas-research.md` is a description-only rule that holds the Atlas states, the no-stale rule, the responsibilities line and the `dev-research` stop, with no machine path.
  Check: `S9`; expect `ok`.

- [x] AC-10. Naming taste moved to naming-taste rule
  Behavior: `craft-name` holds no one-user taste or names and points to known user naming preferences; every non-moved line survives. `rules/naming-taste.md` is a description-only rule holding every moved bias, evidence and example line verbatim.
  Check: `S10`; expect `ok`.

- [x] AC-11. Grok roles use the D3 absolute prompt file
  Behavior: Both Grok roles use the absolute `prompt_file` `/Users/kim/.agents/skills/dev-test-audit/references/opinion-agent.md` (D3), which resolves to the opinion contract. The rest of `config.toml` is unchanged. `personas/` and `roles/` are gone.
  Check: `S11`; expect `ok`.

- [x] AC-12. human-facing-language folded into AGENTS.md
  Behavior: `human-facing-language.md` is gone. AGENTS.md `## Reporting` holds both of its clauses. Every other AGENTS.md line survives, and no live file names the rule.
  Check: `S12`; expect `ok`.

- [x] AC-13. Repository AGENTS.md ADR pointer current
  Behavior: `.agents/AGENTS.md` drops the ADR count and envelope detail and still points to the workflow map, `docs/adr/INDEX.md` and the Task Contract rule. Every other line survives.
  Check: `S13`; expect `ok`.

- [x] AC-14. agent-return.md line anchors removed
  Behavior: `agent-return.md` equals its baseline with only the oh-my-pi `#L` anchors removed (file URLs and `v18.3.0` kept).
  Check: `S14`; expect `ok`.

- [x] AC-15. Plan-sync tests assert codes not prose
  Behavior: The plan-sync tests no longer read `config.yml` or assert helper prose. Every baseline `PLAN_*` code is still asserted, and every baseline test survives except the renamed wiring test.
  Check: `S15`; expect `ok`.

- [x] AC-16. craft-rule teaches current storage and transport layout
  Behavior: `craft-rule` teaches one portable rule per contract that owns its storage, with host transport in host adapter files, and never mentions a storage companion. Every other non-blank line survives. Its evals stay valid and in their dump format, and only eval id 1's `expected_output` and `assertions[1]` change.
  Check: `S16`; expect `ok`.

- [x] AC-17. Only batch-5a files differ
  Behavior: Only batch-5a files differ from the baseline (union allowlist; deleted-uncommitted paths count as allowed changes, and untracked files are listed).
  Check: `S17`; expect `ok`.

- [x] AC-18. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-19. Guarded paths unchanged
  Behavior: The guarded paths, copy helper, extension code, OMP config and wrappers, both host plan files, the opinion contract and the ADR index are unchanged against the baseline and the working tree.
  Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller bin .config/agents/harnesses/omp/extensions/plan-artifact-sync.js .config/agents/harnesses/omp/config.yml .config/agents/harnesses/omp/plan-transport.md .config/agents/harnesses/omp/agents .config/agents/harnesses/grok/plan-transport.md .config/agents/skills/dev-test-audit/references/opinion-agent.md docs/adr/INDEX.md"; git status --porcelain -- $P; git diff --name-only edf59e0 -- $P`; expect empty output.

- [x] AC-20. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

- [x] AC-21. Prompt files load offline
  Behavior: The real protocol and Retrace prompt files still load offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-22. Plan validator suite passes
  Behavior: The plan validator suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

- [x] AC-23. Plan-sync suite passes
  Behavior: The plan-sync extension suite passes with the changed assertions.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-24. Papercut ledger suite passes
  Behavior: The papercut ledger suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff; the tasks are independent, so resume any incomplete task alone within this plan's authority without touching a sibling's Targets. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`; rollback of listed paths (`git checkout edf59e0 -- <S17 allowlist paths>`, deleting the two new rules, recreating the two empty Grok directories) is the owner's call per spec §5, and implementation performs none.
- Stops: Any guard check (AC-18 through AC-21) fails at any boundary where it runs; any owned check or gating boundary rerun named in Scope fails after permitted repair; an extracted `Sn` script's SHA-256 differs from spec §6.1; `git show edf59e0:<path>` fails (missing baseline object); a baseline clause has no owner in spec §3, or its owner file would not hold it; a change would touch a path outside the S17 allowlist and the two Grok directories, a sibling task's Targets, the extension, the helper, `config.yml`, a guarded path, or git state, or need an undeclared effect; the route owner reverses D1, D2 or D3; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: `grill-me`, `grill-with-docs` and `dev-integration` deleted with every live caller migrated to `dev-grilling` or ordinary fan-in (dev-ask row/trigger/WORKFLOW map, dev-grilling step 1, dev-domain-modeling gate, ADR-0001 D11, ADR-0003 D04, dev-ask evals and two fixtures by the §4 name mapping); `~/.agents` and machine paths in 13 portable files replaced by relative links and `rules/plan.md` frontmatter made description-only; dev-test-audit trimmed to intake/scope/boundaries with the loop owned by `references/audit-protocol.md`; host invocation forms, papercut ADR numbers, Atlas text and naming taste moved out of portable skills into `rules/atlas-research.md`, `rules/naming-taste.md` and the ADR index; Grok `prompt_file` absolute and empty `personas/`/`roles/` removed; `human-facing-language.md` folded into `AGENTS.md` Reporting; `.agents/AGENTS.md` L20 current; `agent-return.md` line anchors dropped (file URLs and v18.3.0 kept); plan-sync tests assert codes; craft-rule L64/L94 and eval id 1 teach the current storage/transport layout.
- Tasks: T1–T4 ran concurrently on disjoint targets; all attempt 1, no correction passes.
- Authority: spec-v2 recorded owner decisions D1 (atlas-research rule), D2 (naming-taste rule), D3 (absolute Grok prompt_file); a stale pre-v2 `/tmp/b5a/S11.py` was re-extracted by T4 before AC-11 ran.
- Assurance: review APPROVED (ADV-1 mermaid-check location implicit in foreign repos, ADV-2 Grok loads new rules in full in-repo, ADV-3 obsolete-operation case matches `/^ERROR: /`); verification VERIFIED AC-1..AC-24 plus closure (validator valid, 28 ticks, 41 tracked changes + 4 untracked within the S17 allowlist); `Learning: no durable learning`.
- Commits: none. Nothing pushed.
