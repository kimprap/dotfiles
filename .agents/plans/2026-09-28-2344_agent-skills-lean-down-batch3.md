# Agent-skills lean-down batch 3

**Datetime**: 2026-09-28-2344
**Scope**: Agent-skills lean-down batch 3 (proposal items 6 and 11 and the ADR-0002 D21 ADR-format point)
**Summary**: Replace stale authority citations in ADRs 0001–0004 and 0006–0010 with one approval line each, make ADR-0002 D21 host-neutral with one link to the OMP return adapter, and trim `docs/adr/INDEX.md` to its record table, precedence and supersession sections.
**Status**: DONE
**Completed At**: 2026-09-29-0003

## Outcome and authority

- Outcome: No ADR or `docs/adr/INDEX.md` carries a session-file citation, SHA-256 hash, revision id or "Current governing authority" line; each ADR that had one carries one "Approved by the owner on <date(s)>; history in git." line, and specs stored in the repository stay linked; ADR-0002 D21 keeps every host-neutral decision, links to `.config/agents/harnesses/omp/agent-return.md` for native return mechanics, restates none of them, and ends with Why, Rejected alternatives and Reopen when only; `INDEX.md` keeps its intro, record table (ADR-0002 scope cell host-neutral), "Authority and precedence" and "Supersession discipline", and drops "Decision discovery", "Current generic execution map" and "Current evidence baseline"; every decision ID stays defined exactly once in its ADR, every link into or inside `docs/adr` resolves, and all guard checks and deterministic suites still pass.
- Authority: Technical specification `.agents/artifacts/2026-09-28_agent-skills-lean-down-batch3-spec.md` revision `agent-skills-lean-down-batch3/spec-v1` (SHA-256 `fc3e627551e3a4f6717725f9da6d6db393a3f6ded2652a55a33ea000b5966526`), which owns exact edit targets and approval lines (§4), invariants and errors (§4), effects (§5), acceptance and check scripts S1–S9 with their SHA-256 values (§6, §6.1), and stops (§9); it derives from the human-approved proposal `.agents/artifacts/2026-09-28_agent-skills-lean-down-proposal.md` (SHA-256 `a1efc66c6e5546f83bb32e22d0b71e24a7d201f5655715c5b3d32cb66b0180f1`) ranked items 6 and 11 and its "Other recommendations" ADR-format point for D21, the approved Route Overview rules (every decision ID stays defined once in its ADR; any live link into a removed INDEX section is repaired; only `docs/adr/**` plus such repairs may change), the binding owner intent and Reconcile/Retrace guard recorded in spec §1, and the governing contracts `docs/adr/INDEX.md` and ADR-0001 D01 / ADR-0004 D23, whose decisions stay true.
- Assurance: standard

## Scope and effects

- Scope: Exactly the ten files in the spec §6.1 S7 allowlist, edited as spec §4 directs: the nine ADRs 0001–0004 and 0006–0010 (T1) and `docs/adr/INDEX.md` (T2); spec §2 found no live link into a removed INDEX section outside `docs/adr`, so no other link repair is in scope. Baseline is `HEAD` `45e9e50` and spec line numbers refer to it (re-locate by content if lines drift). In acceptance checks `Sn` means: extract the spec §6.1 block `Sn` to `/tmp/b3/Sn.py` (creating `/tmp/b3/`) and run `python3 /tmp/b3/Sn.py` from the repository root with the argument shown, if any; a block is every line after the ` ```python ` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ` ``` `; each file holds the block's lines joined with newlines plus one final newline, and `shasum -a 256 /tmp/b3/*.py` must match the §6.1 table before any `Sn` result counts. `LIVE` in AC-10 is the spec §2 pathspec `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md ':!.config/agents/references/impl-rethink/MAINTENANCE.md'`, substituted literally. At baseline `S1 adr`, `S1 index`, S3, S4 and S5 fail as expected and S2, S6, S7, S8 and S9 print `ok`. Two serial tasks per spec §8: T1 keeps the nine same-pattern evidence edits and the D21 rewrite together because splitting them would put two owners on ADR-0002 with no independently checkable gain, and the D21 rewrite needs the adapter in one context; T2 depends on T1 because the ADR-0002 row cell summarizes the new D21 and AC-2 cross-checks the ADRs. An acceptance item the spec lists under both tasks is owned by T2, the last listed task; items the spec lists under one task keep that owner; every earlier listed boundary remains gating: T1 must also observe AC-2, AC-6, AC-7, AC-8, AC-11, AC-12, AC-13 and AC-15 before its Handoff. A failing gating rerun blocks that task's Handoff like an owned check. AC-14 (`npm test`) and AC-16…AC-18 run once, at T2.
- Effects: Repository changes only, cumulative per task and limited to the S7 allowlist: T1 edits the nine ADRs, T2 edits `docs/adr/INDEX.md`; writing the throwaway check scripts under `/tmp/b3/`. No file deletions, new repository files or renames; no git staging, commits or pushes; no network access; no omp-update live runs; no edits to `.config/agents/harnesses/omp/agent-return.md`, ADR-0005, plans, `.agents/papercuts.json` or `.scratch`; clean cutover without "formerly" notes or compatibility text.
- Non-goals: Every other proposal item, including item 20's stale `.agents/AGENTS.md` line and item 18's `papercut/WORKFLOW.md` L34 ADR numbers; ADR-0005 and every ADR section outside the authority/evidence text, except D21 and ADR-0010's `spec-v3` reference in its verification expectations; ADR-0010's decision section; any ADR-format rewrite beyond D21, including renaming "Evidence / source revisions" headings; `spec-v3` mentions in acp-controller code comments and `omp-update/SKILL.md` L18; any change to `skills/reconcile/`, `skills/retrace/`, `skills/rethink/`, `skills/omp-update/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`; any new file, ADR, decision ID, test or eval case; any line or word target for `INDEX.md`.

## Tasks

- [x] T1. Replace stale ADR authority citations with one approval line each and make D21 host-neutral with one adapter link
  completed 2026-09-28-2349
  - Owner: lean-adr-citations-child
  - Depends on: none
  - Targets: docs/adr/0001-dev-workflow-authority-and-routing.md, docs/adr/0002-executor-plans-and-orchestration.md, docs/adr/0003-bounded-assurance-and-repair.md, docs/adr/0004-canonical-discovery-and-continual-learning.md, docs/adr/0006-generic-papercut-evidence.md, docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md, docs/adr/0008-repository-agent-integration-setup.md, docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md, docs/adr/0010-replacement-lifecycle-plugin.md
  - Acceptance: AC-1, AC-4, AC-5, AC-9
  - Receiver: route-agent dev-implementation controller

- [x] T2. Trim INDEX to its record table, precedence and supersession sections with a host-neutral ADR-0002 row
  completed 2026-09-28-2355
  - Owner: lean-index-trim-child
  - Depends on: T1
  - Targets: docs/adr/INDEX.md
  - Acceptance: AC-2, AC-3, AC-6, AC-7, AC-8, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AC-17, AC-18, AC-19
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. ADRs free of stale citations
  Behavior: No ADR file carries a `local://` citation, a 64-hex hash, "SHA-256", a revision id or the "Current governing authority" line.
  Check: `S1 adr`; expect `ok`.

- [x] AC-2. Decision IDs defined once and indexed
  Behavior: Every decision ID keeps its defining ADR, is defined in exactly one ACTIVE ADR, and the index lists the same IDs per ADR.
  Check: `S2`; expect `ok`.

- [x] AC-3. INDEX keeps only table, precedence and supersession
  Behavior: INDEX has exactly the record table, precedence and supersession sections; the table links every ADR file with unchanged statuses and rows (ADR-0002's scope cell excepted, now host-neutral); precedence and supersession are byte-identical.
  Check: `S3`; expect `ok`.

- [x] AC-4. D21 host-neutral with adapter link
  Behavior: D21 links the OMP adapter, keeps its host-neutral decisions and the Why / Rejected alternatives / Reopen when format without Consequences, and restates no OMP mechanics.
  Check: `S4`; expect `ok`.

- [x] AC-5. Approval line present
  Behavior: Each ADR that lost a stale citation carries an "Approved by the owner on <date>…; history in git." line.
  Check: `S5`; expect `ok`.

- [x] AC-6. docs/adr links resolve
  Behavior: Every relative link in `docs/adr`, and every live Markdown link into `docs/adr`, resolves, including `#anchors`.
  Check: `S6`; expect `ok`.

- [x] AC-7. Only batch-3 files differ
  Behavior: Only the ten batch-3 files (the nine ADRs and `INDEX.md`) differ from the baseline in `.config/agents`, `docs` and the two AGENTS files. Which task edits which of them is the plan's target ownership (§8), enforced by the controller.
  Check: `S7`; expect `ok`.

- [x] AC-8. ADRs byte-identical outside edited sections
  Behavior: Outside the authority/evidence sections, D21, ADR-0010's verification paragraph and `Updated` lines, every ADR is byte-identical to the baseline.
  Check: `S8`; expect `ok`.

- [x] AC-9. Non-stale evidence lines survive
  Behavior: Every baseline line in those sections that carries no stale citation and no "historical support" qualifier is still present.
  Check: `S9`; expect `ok`.

- [x] AC-10. No live file names a removed INDEX section
  Behavior: No live file names a removed INDEX section.
  Check: `git grep --untracked -n -I -E 'Decision discovery|Current generic execution map|Current evidence baseline' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

- [x] AC-11. dev-ask evals intact
  Behavior: The dev-ask evals, including `R-T5-CANONICAL-DISCOVERY`, are intact.
  Check: `git status --porcelain -- .config/agents/skills/dev-ask/evals; git diff --name-only 45e9e50 -- .config/agents/skills/dev-ask/evals`; expect empty output.

- [x] AC-12. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-13. Guarded paths and D21 pointer target unchanged
  Behavior: The guarded paths and the D21 pointer target are unchanged against the baseline and the working tree.
  Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; git status --porcelain -- $P; git diff --name-only 45e9e50 -- $P`; expect empty output.

- [x] AC-14. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

- [x] AC-15. Prompt files load offline
  Behavior: The real protocol and Retrace prompt files still load offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-16. Plan validator suite passes
  Behavior: The plan validator suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

- [x] AC-17. Plan-sync suite passes
  Behavior: The plan-sync extension suite still passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-18. Papercut ledger suite passes
  Behavior: The papercut ledger suite, which cites an ADR-0007 path, still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

- [x] AC-19. INDEX free of stale citations
  Behavior: `INDEX.md` carries no `local://` citation, 64-hex hash, "SHA-256", revision id or "Current governing authority" line.
  Check: `S1 index`; expect `ok`.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff; resume at the first incomplete task in T1 → T2 order within this plan's authority. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`; rollback of listed paths is the owner's call through git against baseline `45e9e50`, and implementation performs none.
- Stops: Any guard check (AC-12 through AC-15) fails at any boundary where it runs; any owned check or gating boundary rerun named in Scope fails after permitted repair; an extracted `Sn` script's SHA-256 differs from spec §6.1; a D21 clause is neither host-neutral nor held by the adapter (report it and never copy it into the adapter); a removed INDEX row states a decision its named ADR lacks; any change would touch a guarded path, `agent-return.md`, ADR-0005, git state, or a path outside the S7 allowlist, or need an undeclared effect; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: stale `'/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-27T16-11-28-383Z_01a0e3a2-bcff-71f9-84e1-0915519f2d49/local'` citations, hashes, revision ids and governing-authority lines in ADRs 0001–0004 and 0006–0010 replaced by one owner-approval line each (history in git); ADR-0002 D21 host-neutral with one link to the OMP return adapter; INDEX.md trimmed to its record table, precedence and supersession sections (103 → 39 lines) with a host-neutral ADR-0002 row.
- Tasks: T1 ADRs; T2 INDEX. Both attempt 1; attempt 2 unused.
- Assurance: review APPROVED with no findings; verification VERIFIED, AC-1..AC-19 pass; `Learning: no durable learning`.
- Commits: none. Nothing pushed.
