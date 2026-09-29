# Agent-skills lean-down batch 5b

**Datetime**: 2026-09-29-1610
**Scope**: Agent-skills lean-down batch 5b (proposal item 9, dev-ask evals shrink, plus the batch-5a eval carry-over)
**Summary**: Rewrite the dev-ask evals as a v2 table-driven catalog with the shared rubric stated once, move the two OMP backend cases to a new `harnesses/omp/evals.json`, delete the copied dev-ask eval fixtures and bytecode, and make the `init-ask` and `product-ask` eval prompts host-neutral.
**Status**: DONE
**Completed At**: 2026-09-29-1628

## Outcome and authority

- Outcome: `.config/agents/skills/dev-ask/evals/` holds only `evals.json` in schema `lean-dev-workflow-evals/v2` (the `expansion` rule, shared rubric stated once, one `defaults` block, the spec §4.3 groups and singles) with every baseline case held by exactly one record and no case dropped; the two OMP backend cases live unchanged in the new `.config/agents/harnesses/omp/evals.json` (same v2 schema, linked from nowhere); `answer.txt` and `registry.md` are inlined as `files` and the fixtures, the ignored scratch bank and the ignored bytecode are gone; no dev-ask or harness eval carries a machine path or `/skill:`; the `init-ask` and `product-ask` eval prompts use ``Invoke `<name>`. ``; guarded paths are unchanged and every suite stays green.
- Authority: Technical specification `.agents/artifacts/2026-09-29_agent-skills-lean-down-batch5b-spec.md` revision `agent-skills-lean-down-batch5b/spec-v3` (SHA-256 `b580c9c10ec183854d4b355a3f2a3cf7cb2f0518b9696be1c8299c822cfa7825`, rebound from `03f75b02…2db2` after the spec's §10 prose-only erratum; revision unchanged), baseline `214ff74`, human-approved after a Reconcile review, which owns the v2 schema, expansion rule and invariants (§4.1), shared rubric and defaults (§4.2), the approved case table (§4.3), the harness file (§4.4), the id map, empty drop table, rewrite and inline tables (§4.5), the prompt prefix (§4.6), effects, migration and rollback (§5), acceptance and the check scripts S1–S4 with their SHA-256 values (§6, §6.1), task boundaries and sizing (§8), and stops (§9); it derives from the human-approved proposal `.agents/artifacts/2026-09-28_agent-skills-lean-down-proposal.md` ranked item 9 and the batch-5a spec-v2 §9 carry-over, with owner decisions D1–D5 settled in spec §1.
- Assurance: standard

## Scope and effects

- Scope: Exactly the spec §6.1 S4 union allowlist, changed as spec §4 directs and partitioned by task with no shared file. T1 rewrites `.config/agents/skills/dev-ask/evals/evals.json` to v2 (§4.1–4.3, §4.5), creates `.config/agents/harnesses/omp/evals.json` (§4.4), and deletes `.config/agents/skills/dev-ask/evals/fixtures/` and `.config/agents/skills/dev-ask/evals/__pycache__/` last, in this order: (1) write both v2 files with `answer.txt` and `registry.md` inlined as `files` (§4.5 inline table); (2) run S1 `shape`, `coverage`, `groups` and `lean` and observe `ok` for each (these read the fixtures only from baseline `214ff74` git objects, never from the working tree); (3) only then `rm -rf` both directories and run S1 `clean`, S2 and the remaining owned checks. A non-`ok` in step 2 stops before any deletion. T2 replaces the leading `/skill:<name>. ` prompt prefix with ``Invoke `<name>`. `` in `.config/agents/skills/init-ask/evals/evals.json` (one prompt) and `.config/agents/skills/product-ask/evals/evals.json` (three prompts) (§4.6). T1 and T2 are independent and run concurrently; each child edits only its own Targets and never a sibling's. T1 stays one task because S1 `coverage` needs both v2 files at once (the OMP cases leave one and enter the other) and the fixtures can go only once their two extra files are inlined, so any split leaves a boundary where AC-2 cannot pass; spec §8 recommends a throwaway builder (never committed) that loads the baseline, applies §4.2–4.5, writes both files in the dump format and then runs S1. T2 is four prompt prefixes kept separate because it shares no file or check with T1. Each task runs every AC it owns at its boundary. The whole-tree ACs AC-8, AC-9, AC-10 and AC-12 are owned by T1 and are gating reruns at T2's boundary (T2 runs them and stops on failure but does not own or tick them); AC-11, AC-13 and AC-14 run only at T1 because no T2 file is loaded by those suites. After both Handoffs the controller reruns AC-8, AC-9, AC-10 and AC-12 once on the final tree. Every `Sn` check is run per spec §6: extract §6.1 block `Sn` under the spec's extraction rule (every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to but not including the first line that is exactly ```` ``` ````; the block's lines joined with newlines plus one final newline) to `/tmp/b5b/Sn.py`, confirm `shasum -a 256 /tmp/b5b/*.py` equals the §6.1 values, and run `python3 /tmp/b5b/Sn.py` (`S1 <mode>` passes the mode as the one argument); re-extract any script derived from an earlier revision.
- Effects: Repository working-tree changes only, limited to the Scope paths: one rewrite and one new file (T1), two prompt-file edits (T2), and authorized destructive local deletion by T1 with `rm -rf` (no `git rm`) of `.config/agents/skills/dev-ask/evals/fixtures/`, including the git-ignored scratch Mnemopi bank `fixtures/l-routing/banks/…/mnemopi.db*`, and of the git-ignored `.config/agents/skills/dev-ask/evals/__pycache__/` (D2, D5; neither ignored item is restorable and nothing reads them); writing throwaway check scripts and T1's throwaway builder under `/tmp/b5b/`; running the listed suites. The tree is never committed between tasks; it is committed once after both tasks land, as the route's later shipping step, not a task effect. No git staging, commits or pushes; no network access; no live OMP or other host runs; no home-directory change.
- Non-goals: Every other proposal item; any eval runner, scanner or observer; any change to what a case tests beyond the §4.5 rewrite table; any new, dropped or merged-away baseline case id; any change to `SKILL.md`, `WORKFLOW.md` or other skill text; any other skill's evals (including the guarded `reconcile` evals); `.agents/papercuts.json`, historical plans and artifacts; `skills/{reconcile,retrace,rethink,omp-update}/`, `references/packed-label.md`, `harnesses/omp/acp-controller/`, `bin/`, `harnesses/omp/extensions/plan-artifact-sync.js`, `harnesses/omp/config.yml`, `harnesses/omp/agents/`, both `plan-transport.md` files and `docs/adr/INDEX.md`; any permanent test; any link to the harness eval file.

## Tasks

- [x] T1. Rewrite the dev-ask evals as v2, move the OMP cases to harness evals, delete the fixtures and own the whole-tree guards and long suites
  completed 2026-09-29-1619
  - Owner: lean-5b-evals-child
  - Depends on: none
  - Targets: .config/agents/skills/dev-ask/evals/evals.json, .config/agents/skills/dev-ask/evals/fixtures/, .config/agents/skills/dev-ask/evals/__pycache__/, .config/agents/harnesses/omp/evals.json
  - Acceptance: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-14
  - Receiver: route-agent dev-implementation controller

- [x] T2. Make the init-ask and product-ask eval prompts host-neutral
  completed 2026-09-29-1619
  - Owner: lean-5b-prompts-child
  - Depends on: none
  - Targets: .config/agents/skills/init-ask/evals/evals.json, .config/agents/skills/product-ask/evals/evals.json
  - Acceptance: AC-7, AC-15
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. v2 eval files well-formed
  Behavior: Both v2 files exist, parse, keep the dump format and the exact §4.1 top level and `expansion` text; every case, row and default uses only §4.1 fields; groups start `G-` and have at least two rows; every record's `inputs.request` sits on its own row or single case; every record has every required field, no duplicate or empty rubric line, and every `{name}` bound.
  Check: `S1 shape`; expect `ok`.

- [x] AC-2. Every baseline case held by exactly one record
  Behavior: Every baseline case is exactly one v2 record (the two OMP cases only in the harness file, every other one only in dev-ask) and equals the baseline on every field after the §4.5 rewrite; `files` equals the baseline fixture's extra files; rubric equals as a multiset; no new record id.
  Check: `S1 coverage`; expect `ok`.

- [x] AC-3. Cases and rows match the approved tables
  Behavior: The dev-ask and harness cases and their rows are exactly the §4.3 and §4.4 tables.
  Check: `S1 groups`; expect `ok`.

- [x] AC-4. Everything stated once
  Behavior: Every rubric line is stated once per file and every shared key serves at least two records; no case restates a default, no row restates an inherited value, no field is set identically on every row; `G-REAPPROVAL` is table-driven on `{trigger}`.
  Check: `S1 lean`; expect `ok`.

- [x] AC-5. Fixtures, bytecode and host terms gone
  Behavior: `fixtures/` (with its ignored bank) and `__pycache__/` are gone, the evals dir holds only `evals.json`, and neither v2 file holds `fixture_dir`, a machine path or `/skill:`; the dev-ask file names no OMP term.
  Check: `S1 clean`; expect `ok`.

- [x] AC-6. No live reference to fixtures or the v1 schema
  Behavior: No live file reads or names the fixtures, `fixture_dir` or the v1 schema id.
  Check: `S2`; expect `ok`.

- [x] AC-7. init-ask and product-ask prompts host-neutral
  Behavior: `init-ask` and `product-ask` evals keep their dump format, contain no `/skill:`, and differ from the baseline only by the §4.6 prompt prefix.
  Check: `S3`; expect `ok`.

- [x] AC-8. Only batch-5b files differ
  Behavior: Only batch-5b files differ from the baseline (union allowlist; fixture files may only be deleted; untracked files are listed).
  Check: `S4`; expect `ok`.

- [x] AC-9. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ 	]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-10. Guarded paths unchanged
  Behavior: The guarded paths, copy helper, extension code, OMP config and wrappers, both host plan files and the ADR index are unchanged against the baseline and the working tree.
  Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller bin .config/agents/harnesses/omp/extensions/plan-artifact-sync.js .config/agents/harnesses/omp/config.yml .config/agents/harnesses/omp/plan-transport.md .config/agents/harnesses/omp/agents .config/agents/harnesses/grok/plan-transport.md docs/adr/INDEX.md"; git status --porcelain -- $P; git diff --name-only 214ff74 -- $P`; expect empty output.

- [x] AC-11. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

- [x] AC-12. Prompt files load offline
  Behavior: The real protocol and Retrace prompt files still load offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-13. Plan validator suite passes
  Behavior: The plan validator suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` (14 tests) and exit 0.

- [x] AC-14. Plan-sync suite passes
  Behavior: The plan-sync extension suite still passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-15. Papercut ledger suite passes
  Behavior: The papercut ledger suite still passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` (19 tests) and exit 0.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff; the tasks are independent, so resume any incomplete task alone within this plan's authority without touching the sibling's Targets. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`; rollback (`git checkout 214ff74 -- .config/agents/skills/dev-ask/evals .config/agents/skills/init-ask/evals .config/agents/skills/product-ask/evals` and deleting `.config/agents/harnesses/omp/evals.json`, per spec §5; the ignored scratch bank and bytecode are not restorable) is the owner's call, and implementation performs none.
- Stops: Any guard check (AC-9 through AC-15) or gating boundary rerun named in Scope fails at any boundary where it runs; any owned check fails after permitted repair; an extracted `Sn` script's SHA-256 differs from spec §6.1; `git show 214ff74:<path>` fails (missing baseline object); S1 `coverage` finds a difference the spec §4.5 tables do not explain, or a baseline case looks like a true duplicate (any drop needs the owner); a change would touch a path outside the S4 allowlist, a sibling task's Targets, a guarded path or git state, or need an undeclared effect; the route owner reverses D1–D5; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: `dev-ask/evals/evals.json` rewritten to `lean-dev-workflow-evals/v2` (42 cases: 18 `G-*` groups + 24 singles expanding to 79 records; shared rubric of 7 lines stated once; `answer.txt`/`registry.md` inlined as `files`; the one machine path reads "the user-level AGENTS.md"); the two OMP backend cases moved verbatim to new `harnesses/omp/evals.json` (linked from nowhere); `dev-ask/evals/fixtures/` (83 tracked files plus the ignored Mnemopi bank) and `__pycache__/` removed with `rm -rf`; four `init-ask`/`product-ask` eval prompts now start ``Invoke `<name>`.``. Every baseline case has exactly one v2 owner; drop table empty.
- Tasks: T1 and T2 ran concurrently on disjoint targets; both attempt 1, no correction passes.
- Authority: spec-v3 after a Reconcile review (four loose groups dissolved, repair-semantics claim replaced by the §3 residue table, D1 rule recorded as what holds with six exception groups per owner option A); one post-review prose-only erratum in §4.3/§10 (R-T5-REAPPROVAL-ROUTE carries no own `required_events`), plan rebound to the new spec hash with the revision unchanged.
- Assurance: review APPROVED, no findings (independent full 81-case expansion; three non-blocking notes: S1 `groups` ignores row order, S1 REWRITE is path-wide, §4.3 prose erratum); verification VERIFIED AC-1..AC-15 plus closure (validator valid, 17 ticks, 3 modified + 83 deleted + 3 untracked, spec hash bound); `Learning: no durable learning`.
- Commits: none. Nothing pushed.
