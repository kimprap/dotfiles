# Agent-skills lean-down batch 1

**Datetime**: 2026-09-28-1920
**Scope**: Agent-skills lean-down batch 1 (proposal items 1 2 3 4 12)
**Summary**: Delete dev-tdd, the stale-contract scanner, and execution-flow.md; move OMP/acpx host mechanics into the OMP return adapter; give four restated rules one owner each; and shrink dev-ask/WORKFLOW.md to the one human map.
**Status**: DONE
**Completed At**: 2026-09-28-1955

## Outcome and authority

- Outcome: The scanner, `dev-tdd`, and `execution-flow.md` and every live reference to them are gone; OMP and acpx host mechanics live only in `.config/agents/harnesses/omp/agent-return.md` behind one portable host-return pointer, with the Reconcile/Retrace exemption sentence exactly once in that adapter; compact assurance, assurance order, papercut timing, and the role-and-purpose collection exemption each have one owner and pointers elsewhere; `dev-ask/WORKFLOW.md` is one short human map pointing to `docs/adr/INDEX.md`; all deterministic suites and guard checks still pass.
- Authority: Technical specification `.agents/artifacts/2026-09-28_agent-skills-lean-down-batch1-spec.md` revision `agent-skills-lean-down-batch1/spec-v1` (SHA-256 `3f5494698bc6083389be07c4235980029b29b3e1651d19d5b4f203a599ac9c35`, including its human-approved 2026-09-28 AC-9 erratum), which owns exact edit targets, pointer meanings, invariants, and error stops in its §4; it derives from the human-approved proposal `.agents/artifacts/2026-09-28_agent-skills-lean-down-proposal.md` (SHA-256 `a1efc66c6e5546f83bb32e22d0b71e24a7d201f5655715c5b3d32cb66b0180f1`), batch 1 items 1 2 3 4 12 and its Reconcile and Retrace guard, plus the binding human decisions recorded in spec §1; governing contracts `docs/adr/INDEX.md` with ADR-0001 0002 0003 0004 0007 0009, with ADR-0004 D23 amended in place under that human authorization. Line numbers in targets refer to baseline `HEAD` `4c0d815`.
- Assurance: standard

## Scope and effects

- Scope: Live files `.config/agents/**`, `docs/adr/**`, `.agents/AGENTS.md`, and `.agents/GENERIC-AGENTS.md` as enumerated in spec §2 and §4; `.agents/plans/**`, `.agents/artifacts/**`, `.agents/papercuts.json`, tracked `.scratch/**` historical notes, `archive/`, git-ignored files, and the append-only journal `.config/agents/references/impl-rethink/MAINTENANCE.md` are not live. In acceptance checks `LIVE` means the pathspec `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md ':!.config/agents/references/impl-rethink/MAINTENANCE.md'` and `CFG` means `.config/agents ':!**/evals/**' ':!.config/agents/references/impl-rethink/MAINTENANCE.md'`, substituted literally. Tasks run serially T1 → T2 → T3 because they share `dev-implementation/SKILL.md`, `dev-ask/SKILL.md`, `dev-ask/WORKFLOW.md`, the two dev-implementation references, and the OMP adapter, and the whole batch (about 23k words of reading across about 25 files plus four large prose rewrites) is unlikely to fit one reliable fresh context, while each task is independently checkable at its own boundary. Final-state acceptance whose check spans later edits is owned by T3; earlier boundaries run shared checks without owning them: T1 runs AC-15, AC-18, and AC-19; T2 runs the AC-6 command on its first four paths only, and AC-14 through AC-19; T3 also reruns AC-7 through AC-9 because it edits `dev-implementation/SKILL.md` and the OMP adapter after T2; any of those reruns failing blocks T3's Handoff as a T3 defect, while AC-7 through AC-9 stay owned by T2 as the producer of the move.
- Effects: Repository changes only: edits and deletions of the tracked files under `.config/agents/**` and `docs/adr/**` listed in spec §4, plus local deletion of the folder `.config/agents/skills/dev-tdd/`, of `.config/agents/skills/dev-ask/references/execution-flow.md` and then the empty `.config/agents/skills/dev-ask/references/` directory, of `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`, and of the ignored `.config/agents/skills/dev-ask/evals/__pycache__/scan_stale_contracts.cpython-314.pyc`. No git staging, commits, or pushes; no network access; no omp-update live runs; no edits to `MAINTENANCE.md`, plans, `.agents/papercuts.json`, `.scratch`, or `.agents/AGENTS.md`; no new file, skill, rule, schema, eval, or test; clean cutover without aliases, stubs, or compatibility notes.
- Non-goals: Proposal items 5–11 and 13–20; the ADR `local://`, hash, and revision cleanup; the INDEX question table and current generic execution map; ADR-0002 D21's restated OMP text and acpx sentence; the `dev-ask/evals` shrink; `SOURCES.md`; `~/.agents/...` path cleanup; other skills' OMP mentions; `dev-continual-learning` text; any banned-phrase guard; any change to the acp-controller code, `cli.mjs`, `lib/versions.mjs`, `omp-update`, or Reconcile, Retrace, rethink, or packed-label text; revising the stale PENDING plan `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md`; resolving papercut `pc-cb1b8cb02f18d49b`.

## Tasks

- [x] T1. Delete the scanner, dev-tdd, and execution-flow map with every live link and ADR/INDEX reference
  completed 2026-09-28-1926
  - Owner: lean-deletions-child
  - Depends on: none
  - Targets: .config/agents/skills/dev-tdd/, .config/agents/skills/dev-ask/references/execution-flow.md, .config/agents/skills/dev-ask/references/, .config/agents/skills/dev-ask/evals/scan_stale_contracts.py, .config/agents/skills/dev-ask/evals/__pycache__/scan_stale_contracts.cpython-314.pyc, .config/agents/skills/dev-implementation/SKILL.md (L90 dev-tdd sentence), .config/agents/skills/dev-ask/SKILL.md (L129 TDD phrase and L270 execution-flow line), .config/agents/skills/dev-ask/WORKFLOW.md (L62 and L199 execution-map sentences), .config/agents/skills/dev-ticketing/SKILL.md (L39 TDD clause), .config/agents/skills/dev-implementation/references/test-value.md (L3 TDD caller), docs/adr/0001-dev-workflow-authority-and-routing.md, docs/adr/0002-executor-plans-and-orchestration.md, docs/adr/0003-bounded-assurance-and-repair.md, docs/adr/0004-canonical-discovery-and-continual-learning.md, docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md, docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md, docs/adr/INDEX.md
  - Acceptance: AC-1, AC-2, AC-3, AC-4, AC-5
  - Receiver: route-agent dev-implementation controller

- [x] T2. Move OMP and acpx host mechanics into the OMP return adapter behind one portable host-return pointer
  completed 2026-09-28-1937
  - Owner: lean-host-move-child
  - Depends on: T1
  - Targets: .config/agents/skills/dev-implementation/SKILL.md (OMP/acpx host mechanics and Intake host-return pointer), .config/agents/skills/dev-implementation/references/compact-checklist.md (OMP/acpx host mechanics), .config/agents/skills/dev-implementation/references/plan-orchestration.md (OMP/acpx host mechanics), .config/agents/skills/dev-ask/SKILL.md (L67–70 acpx sentence), .config/agents/references/agent-return/return.md, .config/agents/harnesses/omp/agent-return.md (duplicate acpx sentences and L444–445 blank line)
  - Acceptance: AC-7, AC-8
  - Receiver: route-agent dev-implementation controller

- [x] T3. Replace restated rules with single-owner pointers and rewrite dev-ask/WORKFLOW.md as the one short human map
  completed 2026-09-28-1947
  - Owner: lean-pointers-child
  - Depends on: T2
  - Targets: .config/agents/skills/dev-implementation/SKILL.md (L167 and L201–202 papercut pointers), .config/agents/skills/dev-implementation/references/compact-checklist.md (items 4/5/7/8 pointers), .config/agents/skills/dev-implementation/references/plan-orchestration.md (L35–42/L81/L92–93/L100–103 pointers), .config/agents/skills/dev-ask/SKILL.md (L58–66/L76/L253 pointers), .config/agents/harnesses/omp/agent-return.md (L278–281 and L405 exemption pointers), .config/agents/skills/papercut/SKILL.md, .config/agents/skills/papercut/WORKFLOW.md, .config/agents/skills/dev-ask/WORKFLOW.md (full rewrite)
  - Acceptance: AC-6, AC-9, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AC-17, AC-18, AC-19, AC-20
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. Scanner removed
  Behavior: The stale-contract scanner and every live reference to it are gone.
  Check: `test ! -e .config/agents/skills/dev-ask/evals/scan_stale_contracts.py && git grep --untracked -n -I -P 'scan_stale_contracts|stale-contract' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

- [x] AC-2. dev-tdd removed
  Behavior: `dev-tdd` is deleted and no live file mentions it or TDD.
  Check: `test ! -e .config/agents/skills/dev-tdd && git grep --untracked -n -I -P 'dev-tdd|TDD' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

- [x] AC-3. Execution-flow map removed
  Behavior: `execution-flow.md` and every live link to it are gone.
  Check: `test ! -e .config/agents/skills/dev-ask/references && git grep --untracked -n -I -P 'execution-flow' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

- [x] AC-4. Single human map in ADRs
  Behavior: ADR-0004 D23 names `dev-ask/WORKFLOW.md` as the single human map, and ADR-0002/0003 use the singular.
  Check: `python3 -c "a=open('docs/adr/0004-canonical-discovery-and-continual-learning.md').read();d=a.split('### D23',1)[1].split('\n## ',1)[0];o=[open(f).read().lower() for f in ['docs/adr/0002-executor-plans-and-orchestration.md','docs/adr/0003-bounded-assurance-and-repair.md']];c=['dev-ask/WORKFLOW.md' in d,'human maps' not in d]+['human maps' not in x for x in o];print('ok' if all(c) else c)"`; expect `ok`.

- [x] AC-5. Journal untouched
  Behavior: The append-only journal is untouched.
  Check: `git diff --quiet HEAD -- .config/agents/references/impl-rethink/MAINTENANCE.md; echo $?`; expect `0`.

- [x] AC-6. Portable skills free of OMP mechanics
  Behavior: The portable skills carry no OMP or acpx mechanics.
  Check: `git grep --untracked -n -I -P 'taskDepth|wakeRelay|receipts\[|agentUrlId|Result submitted|acp-controller|acpx|harnesses/omp|write agent://|tool\.yield|No running background jobs|\bOMP\b' -- .config/agents/skills/dev-implementation/SKILL.md .config/agents/skills/dev-implementation/references/compact-checklist.md .config/agents/skills/dev-implementation/references/plan-orchestration.md .config/agents/skills/dev-ask/SKILL.md .config/agents/skills/dev-ask/WORKFLOW.md; echo "exit=$?"`; expect only `exit=1`.

- [x] AC-7. Portable return contract host-neutral
  Behavior: The portable return contract carries no OMP mechanics beyond its single adapter-link line, and `dev-implementation` keeps its link to the portable return contract and the `transport-unavailable` stop.
  Check: `python3 -c "r=open('.config/agents/references/agent-return/return.md').read();d=open('.config/agents/skills/dev-implementation/SKILL.md').read();import re;c=[not re.search(r'taskDepth|wakeRelay|receipts\\[|agentUrlId|Result submitted|acp-controller|acpx|write agent://|No running background jobs',r),sum('OMP' in l for l in r.splitlines())==1,'references/agent-return/return.md' in d,'transport-unavailable' in d];print('ok' if all(c) else c)"`; expect `ok`.

- [x] AC-8. OMP adapter preserves host rules
  Behavior: The OMP adapter still holds every host rule removed from the portable files, and every pinned-source URL it cited at the baseline.
  Check: `python3 -c "import re,subprocess;f='.config/agents/harnesses/omp/agent-return.md';t=open(f).read();b=subprocess.run(['git','show','4c0d815:'+f],capture_output=True,text=True).stdout;u=lambda s:set(re.findall(r'https://github\.com/\S*?/blob/v18\.3\.0/[^)\s]+',s));k=['taskDepth\` 0','taskDepth > 0','transport-unavailable','Result submitted.','details.message.receipts[].outcome','No running background jobs to wait for.','agentUrlId','wakeRelay','write agent://<child>','injected','revived','outputSchema','isolated: true'];m=[x for x in k if x not in t]+sorted(u(b)-u(t));print(m or 'ok')"`; expect `ok`.

- [x] AC-9. Single Reconcile/Retrace exemption sentence
  Behavior: The Reconcile/Retrace exemption sentence appears exactly once in `.config/agents`, in the OMP adapter.
  Check: `python3 -c "import os,re,subprocess;fs=[f for f in subprocess.run(['git','ls-files','--cached','--others','--exclude-standard','.config/agents'],capture_output=True,text=True).stdout.split() if f.endswith('.md') and os.path.exists(f)];print([(f,n) for f in fs for n in [re.sub(r'\s+',' ',open(f,encoding='utf-8').read()).count('run under their acpx controller')] if n])"`; expect `[('.config/agents/harnesses/omp/agent-return.md', 1)]`.

- [x] AC-10. Assurance rules single owner
  Behavior: Compact assurance and the review → verification → learning order are stated only in `dev-implementation`.
  Check: `git grep --untracked -l -I -P '(?i)dispatches no independent|no independent review|then one independent .dev-verification|review before the one verifier|one learning assessment in that order' -- CFG`; expect exactly `.config/agents/skills/dev-implementation/SKILL.md`.

- [x] AC-11. Papercut timing single owner
  Behavior: Papercut timing and ownership are stated only in the papercut rule.
  Check: `git grep --untracked -l -I -P '(?i)(parent|controller) (falls back|fallback|substitutes)|child is unavailable|unavailable-child|child unavailability|after verification and before completion' -- CFG`; expect exactly `.config/agents/rules/papercut.md`.

- [x] AC-12. Collection exemption single owner
  Behavior: The role-and-purpose collection exemption is stated only in `dev-implementation`.
  Check: `git grep --untracked -l -I -P 'abort-capability|role-and-purpose' -- CFG`; expect exactly `.config/agents/skills/dev-implementation/SKILL.md`.

- [x] AC-13. Short human map
  Behavior: `WORKFLOW.md` is one short map that names each stage owner, points to the ADR index, and contains no ADR decision map.
  Check: `python3 -c "import re;t=open('.config/agents/skills/dev-ask/WORKFLOW.md').read();p=[len(t.split())<=800,'docs/adr/INDEX.md' in t,not re.search(r'ADR-\d{4}|\bD\d{2}\b',t)]+[s in t for s in ['dev-implementation','dev-code-review','dev-verification','dev-continual-learning','completion-presentation','dev-test-audit','dev-shipping','papercut']];print('ok' if all(p) else p)"`; expect `ok`.

- [x] AC-14. Guard markers intact
  Behavior: Every marker and heading the guard names appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-15. Guarded files unchanged
  Behavior: The Reconcile, Retrace, rethink, omp-update and packed-label files and the controller are unchanged.
  Check: `git status --porcelain -- .config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller`; expect empty output.

- [x] AC-16. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, run in the foreground with a timeout ≥ 300 s; expect `fail 0` and exit 0.

- [x] AC-17. Prompt files load offline
  Behavior: The real protocol and Retrace prompt files still load offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-18. Plan validator suite passes
  Behavior: The plan validator suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

- [x] AC-19. Plan-sync suite passes
  Behavior: The plan-sync extension suite still passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-20. Papercut ledger suite passes
  Behavior: The papercut ledger suite still passes after the papercut-family edits.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff; resume at the first incomplete task in T1 → T2 → T3 order within this plan's authority. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`; rollback of listed paths is the owner's call through git against baseline `4c0d815`, and implementation performs none.
- Stops: Any guard check (AC-14 through AC-17) fails at a T2 or T3 boundary; moving or pointing a rule would require text its owner lacks (report it and never copy it back into a portable file); any change would touch the acp-controller, `cli.mjs`, `lib/versions.mjs`, `omp-update`, or Reconcile, Retrace, or rethink text; any git state change or undeclared path or effect would be required; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: the stale-contract scanner, `dev-tdd` and `dev-ask/references/execution-flow.md` are deleted with every live reference; OMP/acpx host mechanics live only in `harnesses/omp/agent-return.md` behind one host-return pointer, with the Reconcile/Retrace sentence once; compact assurance, assurance order and the collection exemption are owned by `dev-implementation`, papercut timing by `rules/papercut.md`; `dev-ask/WORKFLOW.md` is a 312-word human map pointing to `docs/adr/INDEX.md`.
- Tasks: T1 deletions and ADR/INDEX links; T2 host move; T3 single-owner pointers and map rewrite. All attempt 1; attempt 2 unused.
- Authority change: human-approved AC-9 erratum (ownership T2 → T3; check skips deleted paths).
- Assurance: review APPROVED (advisories ADV-1 residual OMP wording in plan-orchestration, ADV-2 cosmetic reflow); verification VERIFIED, AC-1..AC-20 pass; `Learning: no durable learning`.
- Commits: none. Nothing pushed.
