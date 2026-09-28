# Agent-skills lean-down batch 2

**Datetime**: 2026-09-28-2245
**Scope**: Agent-skills lean-down batch 2 (proposal items 5 14 16 19 and batch-1 advisory ADV-1)
**Summary**: State dev-ask's route classification once as a trigger → owner table with implementation internals pointed to dev-implementation; define Route impact once in dev-handoff and the plan-rethink trigger once in plan-rethink.md; replace restated handoff, recovery, and papercut-settlement text with pointers; and make plan-orchestration.md host-neutral.
**Status**: DONE
**Completed At**: 2026-09-28-2313

## Outcome and authority

- Outcome: `dev-ask/SKILL.md` states the route classification once as one trigger → owner table, keeps every router-owned rule, template, suffix, and reapproval trigger, points implementation internals to `dev-implementation`, and has no line over 300 characters; `Route impact` is defined only in `dev-handoff` with one pointer line in each of the 8 support skills; the plan-rethink trigger rule lives only in `references/plan-rethink.md` (method unchanged) with one pointer line in each of its 5 callers and the ADR index naming it; the product family carries one pass-through/resolve line instead of papercut's resolve rules; `dev-continual-learning`, `dev-verification`, and `dev-handoff` point to their owners instead of restating them; `plan-orchestration.md` carries neither residual OMP phrase; all guard checks and deterministic suites still pass and behavior is unchanged.
- Authority: Technical specification `.agents/artifacts/2026-09-28_agent-skills-lean-down-batch2-spec.md` revision `agent-skills-lean-down-batch2/spec-v1` (SHA-256 `1c7f9c0e17b8278f1709c8837713b2e4e5e4380acecdc31bb146a375806f11aa`; AC-2 withdrawn and intentionally unused), which owns exact edit targets, pointer meanings, invariants, check scripts S1–S13 (§6.1), and error stops in its §4, §6, and §9; it derives from the human-approved proposal `.agents/artifacts/2026-09-28_agent-skills-lean-down-proposal.md` (SHA-256 `a1efc66c6e5546f83bb32e22d0b71e24a7d201f5655715c5b3d32cb66b0180f1`) items 5 14 16 19, advisory ADV-1 from the batch-1 review, the binding owner intent and Reconcile/Retrace guard recorded in spec §1, and the governing contracts `docs/adr/INDEX.md` and ADR-0002 D30, whose decisions stay true.
- Assurance: standard

## Scope and effects

- Scope: Exactly the files in the spec §6.1 S13 allowlist, edited as spec §4 directs, plus a dev-ask fixture `case.json` only in the T1 case spec §4 describes; baseline is `HEAD` `69eff72` and spec line numbers refer to it (re-locate by content if lines drift). In acceptance checks `Sn` means: save the spec §6.1 block `Sn` verbatim to `/tmp/b2/Sn.py` (creating `/tmp/b2/`), then run `python3 /tmp/b2/Sn.py` with the stated argument from the repository root; a block is every line after the ` ```python ` line that follows the bare `Sn` label, up to the next line consisting only of ` ``` ` (S2 and S11 contain inline triple backticks, so do not end a block at the first ` ``` `); AC-21's `<task>` is the current task ID. At baseline, S2, S3, S4, S10, S12 and `S13 T1`/`T2`/`T3` print `ok` and the others fail as expected. Tasks run serially T1 → T2 → T3 because T1 and T2 share `dev-ask/SKILL.md` and T2 and T3 share `dev-handoff/SKILL.md`; shared files carry per-surface targets so no two tasks own the same surface. An acceptance item the spec lists under several tasks is owned by the last listed task; items the spec lists under one task keep that owner; every earlier listed boundary and the reruns below remain gating: T1 must also observe AC-1, AC-15, AC-20, AC-22, AC-23, AC-25 and `S13 T1`; T2 must also observe AC-3, AC-4, AC-5, AC-6 (T2 edits `dev-ask/SKILL.md`), AC-8, AC-20, AC-22, AC-23, AC-25, AC-26, AC-27, AC-28 and `S13 T2`; T3 runs AC-21 as `S13 T3`. A failing gating rerun blocks that task's Handoff like an owned check. AC-24 (`npm test`) runs once, at T3.
- Effects: Repository changes only, cumulative per task and limited to the S13 allowlist plus the T1 fixture case; writing the throwaway check scripts under `/tmp/b2/`. No deletions and no new repository files; no git staging, commits, or pushes; no network access; no omp-update live runs; no edits to `.config/agents/references/impl-rethink/MAINTENANCE.md`, plans, `.agents/papercuts.json`, or `.scratch`; clean cutover without aliases, notes, or compatibility text.
- Non-goals: Proposal items 1–4, 6–13, 15, 17, 18 and 20, including the eval shrink (item 9) and the grilling merge (item 13); `grill-me`, `grill-with-docs` and `wayfinder` route-impact field mentions; `product-ask`'s own route-impact continuation rule (L91); `dev-continual-learning` L61 and everything outside the item-16 ranges; any edit to `harnesses/omp/agent-return.md`, `papercut/**`, `execution-recovery.md`, `completion-presentation-input.md`, `skills/reconcile/`, `skills/retrace/`, `skills/rethink/`, `skills/omp-update/`, `references/packed-label.md`, or `harnesses/omp/acp-controller/`; any new file, skill, rule, test, or eval case; any word-count target for dev-ask.

## Tasks

- [x] T1. Rewrite dev-ask as one trigger → owner table with router-owned rules kept and implementation internals pointed to dev-implementation
  completed 2026-09-28-2253
  - Owner: lean-dev-ask-child
  - Depends on: none
  - Targets: .config/agents/skills/dev-ask/SKILL.md (item-5 rewrite per spec §4 T1; plan-rethink follow-up paragraph L204–214 kept in meaning, re-wrap only), .config/agents/skills/dev-ask/evals/evals.json (minimal consistent case edit only if spec §4 requires), .config/agents/skills/dev-ask/evals/fixtures/*/case.json (inputs mirrored only for an edited evals.json case)
  - Acceptance: AC-3, AC-4, AC-5, AC-6, AC-7
  - Receiver: route-agent dev-implementation controller

- [x] T2. Define Route impact once in dev-handoff, the plan-rethink trigger once in plan-rethink.md, and papercut settlement once via a product pass-through line
  completed 2026-09-28-2257
  - Owner: lean-define-once-child
  - Depends on: T1
  - Targets: .config/agents/skills/dev-handoff/SKILL.md (L38 Route impact definition), .config/agents/skills/dev-codebase-design/SKILL.md, .config/agents/skills/dev-domain-modeling/SKILL.md, .config/agents/skills/dev-grilling/SKILL.md, .config/agents/skills/dev-improve-codebase-architecture/SKILL.md, .config/agents/skills/dev-prototype/SKILL.md, .config/agents/skills/dev-requirements/SKILL.md, .config/agents/skills/dev-research/SKILL.md, .config/agents/skills/dev-triage/SKILL.md, .config/agents/references/plan-rethink.md, .config/agents/skills/dev-specification/SKILL.md (step 8 plan-rethink line), .config/agents/skills/dev-ticketing/SKILL.md (step 7 plan-rethink line), .config/agents/skills/dev-implementation/SKILL.md (Planless contract authoring plan-rethink line), .config/agents/rules/plan.md (L20–28 plan-rethink line; L30–32 kept), .config/agents/skills/dev-ask/SKILL.md (plan-rethink follow-up paragraph to one line), docs/adr/INDEX.md (L31 third cell), .config/agents/skills/product-ask/SKILL.md, .config/agents/skills/product-ask/WORKFLOW.md, .config/agents/skills/product-grilling/SKILL.md, .config/agents/skills/product-prd/SKILL.md
  - Acceptance: AC-1, AC-9, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15
  - Receiver: route-agent dev-implementation controller

- [x] T3. Replace restated handoff, recovery, and local-delta text with owner pointers and make plan-orchestration host-neutral
  completed 2026-09-28-2305
  - Owner: lean-pointers2-child
  - Depends on: T2
  - Targets: .config/agents/skills/dev-continual-learning/SKILL.md (L42–60), .config/agents/skills/dev-verification/SKILL.md (## Execution recovery), .config/agents/skills/dev-handoff/SKILL.md (L37 and L43–48), .config/agents/skills/dev-implementation/references/plan-orchestration.md (L36 and L47)
  - Acceptance: AC-8, AC-16, AC-17, AC-18, AC-19, AC-20, AC-21, AC-22, AC-23, AC-24, AC-25, AC-26, AC-27, AC-28
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. dev-ask lines at most 300 characters
  Behavior: No `dev-ask/SKILL.md` line exceeds 300 characters.
  Check: `python3 -c "m=max(map(len,open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read().splitlines()));print('ok' if m<=300 else m)"`; expect `ok`.

- [x] AC-3. Classification stated once
  Behavior: The classification is stated once: one table names every catalog owner, and no owner is restated more than once outside it.
  Check: `S1`; expect `ok`.

- [x] AC-4. Templates and suffixes kept
  Behavior: The Route Overview template (five fields in order, start and continue approval lines), the candidates form, the product-authority stop and both route-ending suffixes are kept.
  Check: `S2`; expect `ok`.

- [x] AC-5. Reapproval triggers and router references kept
  Behavior: All reapproval triggers and the router-owned references and terms are kept: `authority-change-required`, completion input, packed-label, compact checklist, task sizing, render script, `Status: DONE`, plan-rethink, `WORKFLOW.md`, the compact learning line, `dev-test-audit` and `recap`.
  Check: `S3`; expect `ok`.

- [x] AC-6. No implementation internals in dev-ask
  Behavior: `dev-ask` carries no implementation internals; they point to `dev-implementation`.
  Check: `python3 -c "import re;t=re.sub(r'\s+',' ',open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read());print(re.findall(r'(?i)attempt 2|semantic attempt|same verifier|verifier repair|review never reruns|recovery rethink|code-then-test|fan-in',t) or 'ok')"`; expect `ok`.

- [x] AC-7. dev-ask evals intact
  Behavior: dev-ask evals keep every case, ID, order and key set, and each fixture's `inputs` equals its `evals.json` `inputs`.
  Check: `S4`; expect `ok`.

- [x] AC-8. Route impact defined only in dev-handoff
  Behavior: The meaning of `Route impact` is defined only in `dev-handoff`.
  Check: `S5`; expect `ok`.

- [x] AC-9. Support skills point to dev-handoff
  Behavior: Each of the 8 support skills names `Route impact` and points to `dev-handoff`.
  Check: `S6`; expect `ok`.

- [x] AC-10. Plan-rethink trigger single owner
  Behavior: The plan-rethink trigger rule is stated only in `plan-rethink.md`, which holds each trigger concept, and each of the 5 callers has exactly one line naming `plan-rethink.md`.
  Check: `S7`; expect `ok`.

- [x] AC-11. Plan-rethink method unchanged
  Behavior: The plan-rethink method is unchanged: every non-blank baseline line of `plan-rethink.md` is still present.
  Check: `python3 -c "import subprocess;f='.config/agents/references/plan-rethink.md';b=subprocess.run(['git','show','69eff72:'+f],capture_output=True,text=True).stdout.splitlines();n=open(f,encoding='utf-8').read().splitlines();print([l for l in b if l.strip() and l not in n] or 'ok')"`; expect `ok`.

- [x] AC-12. ADR index names plan-rethink owner
  Behavior: The ADR index names `plan-rethink.md` as the owner of rethink timing and exclusions.
  Check: `python3 -c "r=[l for l in open('docs/adr/INDEX.md',encoding='utf-8') if 'ADR-0002 D30' in l and 'rethink' in l];print('ok' if len(r)==1 and 'plan-rethink.md' in r[0] and 'author/caller contract for' not in r[0] else r)"`; expect `ok`.

- [x] AC-13. Product family free of resolve rules
  Behavior: The product family no longer restates papercut resolve rules.
  Check: `S8`; expect `ok`.

- [x] AC-14. Product pass-through and boundaries kept
  Behavior: `product-ask`, `product-grilling` and `product-prd` each carry the pass-through/resolve line and a ledger boundary, and `product-ask` keeps the non-product-evidence boundary.
  Check: `S9`; expect `ok`.

- [x] AC-15. dev-implementation owner sections byte-identical
  Behavior: The `dev-implementation` sections that dev-ask now points to are byte-identical to the baseline.
  Check: `S10`; expect `ok`.

- [x] AC-16. dev-continual-learning points to dev-handoff
  Behavior: `dev-continual-learning` no longer re-lists the Handoff headings, and keeps its `dev-handoff` pointer, its three Learning lines and its ledger boundary.
  Check: `S11 AC-16`; expect `ok`.

- [x] AC-17. dev-verification points to execution-recovery
  Behavior: `dev-verification` no longer restates the execution-recovery algorithm and points to `execution-recovery.md`.
  Check: `S11 AC-17`; expect `ok`.

- [x] AC-18. dev-handoff local delta once and recovery pointer
  Behavior: `dev-handoff` states the local-delta rule once, points to `execution-recovery.md` instead of restating it, and keeps its envelope byte-identical.
  Check: `S11 AC-18`; expect `ok`.

- [x] AC-19. plan-orchestration host-neutral
  Behavior: `plan-orchestration.md` carries neither residual OMP phrase.
  Check: `python3 -c "import re;t=re.sub(r'\s+',' ',open('.config/agents/skills/dev-implementation/references/plan-orchestration.md',encoding='utf-8').read());print(re.findall(r'(?i)busy send|\baside\b|native .yield',t) or 'ok')"`; expect `ok`.

- [x] AC-20. Changed Markdown references resolve
  Behavior: Every relative link, `skill://`, `rule://` and `~/.agents/` reference, and every `#anchor`, in each changed Markdown file resolves.
  Check: `S12`; expect `ok`.

- [x] AC-21. Only owned files differ
  Behavior: Only files owned by the current and earlier tasks differ from the baseline. The append-only journal and every other path stay untouched.
  Check: `S13 <task>`; expect `ok`.

- [x] AC-22. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-23. Guarded paths and pointer owners unchanged
  Behavior: The guarded paths and the pointer-target owners are unchanged against the baseline and the working tree.
  Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md .config/agents/skills/papercut .config/agents/skills/dev-implementation/references/execution-recovery.md .config/agents/references/completion-presentation-input.md"; git status --porcelain -- $P; git diff --name-only 69eff72 -- $P`; expect empty output.

- [x] AC-24. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

- [x] AC-25. Prompt files load offline
  Behavior: The real protocol and Retrace prompt files still load offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-26. Plan validator suite passes
  Behavior: The plan validator suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

- [x] AC-27. Plan-sync suite passes
  Behavior: The plan-sync extension suite still passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-28. Papercut ledger suite passes
  Behavior: The papercut ledger suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff; resume at the first incomplete task in T1 → T2 → T3 order within this plan's authority. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`; rollback of listed paths is the owner's call through git against baseline `69eff72`, and implementation performs none.
- Stops: Any guard check (AC-22 through AC-25) fails at any boundary where it runs; any owned check or gating boundary rerun named in Scope fails after permitted repair; a removal or pointer would need a rule its owner lacks (report it and never copy it back); any change would touch a guarded path, an AC-23 owner file, or git state, or need a path outside the S13 allowlist or an undeclared effect; a dev-ask eval would need more than a minimal consistent edit; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: `dev-ask/SKILL.md` rewritten around one trigger → owner table with implementation rules pointing to `dev-implementation`; route impact defined once in `dev-handoff`; the plan-rethink trigger rule owned by `plan-rethink.md` with one line per caller; product-family papercut settlement reduced to a pass-through/resolve line; `dev-continual-learning`, `dev-verification` and `dev-handoff` restatements replaced by pointers; the two residual OMP phrases removed from `plan-orchestration.md`.
- Tasks: T1 item 5; T2 items 14 and 19; T3 item 16 and ADV-1. All attempt 1; attempt 2 unused.
- Assurance: review APPROVED (advisories ADV-1 route-impact `changed` wording, ADV-2 learning draft fix-in-place wording, ADV-3 recap row order); verification VERIFIED, AC-1 and AC-3..AC-28 pass (AC-2 withdrawn in spec rethink); `Learning: no durable learning`.
- Commits: none. Nothing pushed.
