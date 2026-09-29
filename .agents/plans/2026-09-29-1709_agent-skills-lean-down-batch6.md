# Agent-skills lean-down batch 6

**Datetime**: 2026-09-29-1709
**Scope**: Agent-skills lean-down batch 6 (proposal item 8, Reconcile and Retrace method vs OMP driver split)
**Summary**: Move the root-session controller I/O of the `reconcile` and `retrace` skills verbatim into a new OMP driver `harnesses/omp/acp-controller/driver.md` with disjoint `## Reconcile` and `## Retrace` sections, leaving one pointer line per moved group in each skill and keeping every rendered controller prompt byte-identical.
**Status**: DONE
**Completed At**: 2026-09-29-1728

## Outcome and authority

- Outcome: The new `.config/agents/harnesses/omp/acp-controller/driver.md` holds exactly the spec §4.5 outline: `## Reconcile` with the moved groups RC1–RC4 and `## Retrace` with RT1, verbatim in baseline order except the §4.4 adaptations A1–A4 and the §4.3 new headings; `.config/agents/skills/reconcile/SKILL.md` and `.config/agents/skills/retrace/SKILL.md` keep every other paragraph verbatim and in place plus the pointers P1–P4 and P5 (driver link without a `#fragment`); every normalized baseline paragraph of both skills lands exactly once across the three files; the controller renders byte-identical prompts; guarded paths are unchanged and every suite stays green.
- Authority: Technical specification `.agents/artifacts/2026-09-29_agent-skills-lean-down-batch6-spec.md` revision `agent-skills-lean-down-batch6/spec-v2` (SHA-256 `7a9702e60200a77b02ea4428da6543283449cbdbf470fa71fc8a01038bd812f3`), baseline `6b0902c`, human-approved after a Reconcile review with D1–D5 settled (§1), which owns the paragraph and normalization rule (§4.1), the move tables RC1–RC4 and RT1 (§4.2), the complete new-text list P1–P5 and H (§4.3), the adaptation table A1–A4 (§4.4), the driver layout and append rule (§4.5), the invariants (§4.6), effects, migration, rollback and the D5 live-run gate (§5), acceptance, the T1 boundary gates and the check scripts S1–S4 with their SHA-256 values (§6, §6.1), and task boundaries (§8). `Sn` in a Check means the spec §6 rule: extract §6.1 block `Sn` to `/tmp/b6/Sn.py` (every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to but not including the first line that is exactly ```` ``` ````; the file holds those lines joined with newlines plus one final newline) and run `python3 /tmp/b6/Sn.py`, passing the mode as the one argument for `S2 <mode>` and `S3 <mode>`; `shasum -a 256 /tmp/b6/S*.py` must print `S1.py` `9b356313451505ac1bc50d70fb9df9452b0ad7ac0f78fdf3713e1607e7f88193`, `S2.py` `4d37cbaafda0ff91c84907e45687f2bcd0848aa2c8af4cbf23b1c11c9bf84056`, `S3.py` `f767d892336f177c95a981984361bdec363eea1aaf017042ef54309161746823`, `S4.py` `5184c3cfd672ca2beebaa38ff0e8219d45000a5030dc398c2a6be23043f44e98` before any `Sn` result counts. Run every command from the repository root.
- Assurance: standard

## Scope and effects

- Scope: Exactly the spec S4 union allowlist, changed as spec §4 directs. T1 rewrites `.config/agents/skills/reconcile/SKILL.md` (RC1–RC4 out, P1–P4 in) and creates `.config/agents/harnesses/omp/acp-controller/driver.md` holding only `## Reconcile` and its four groups (§4.5 with A1, A2, A4), ending with exactly one newline. T2 rewrites `.config/agents/skills/retrace/SKILL.md` (RT1 out, P5 in) and appends `## Retrace` and its one group (A3) to the driver. The tasks run sequentially (T2 dispatched only after T1's Handoff) because the driver is one shared file with disjoint sections; the two section-qualified driver Targets name the same file, so ownership is by byte range, not by path. Byte contract: T1 owns every driver byte it writes; T2 may only append bytes after T1's final byte, and the appended bytes start with `\n## Retrace\n` (the separating blank line, then the heading), so the driver becomes T1's exact bytes followed by T2's; T2 changes, reflows or reorders no byte before `## Retrace`, and AC-14 is the proof. Each child edits only its own Targets. T1 boundary gates (spec §6; owned as ACs by T2 on the final tree): before its Handoff T1 also runs S1, S4, the AC-7 and AC-8 commands and AC-10 and must see `ok`, `ok`, `ok`, empty and `0`; they pass at T1's boundary because T1 changes neither file S1 and AC-10 load (the reviewer protocol and `retrace/SKILL.md`), S4 allows the untracked driver, and AC-8's `:(exclude)` pathspec drops the driver from both its `git status` and `git diff` (spec §6 single-task-state simulation observed exactly these results). T1 records the output of `shasum -a 256 .config/agents/harnesses/omp/acp-controller/driver.md` in its Handoff; the controller passes that hex value to T2 in T2's dispatch context, and T2 runs the AC-14 command after its append and compares the printed hex with that value. Sizing: each task is a verbatim cut-and-paste of one skill's groups plus its pointer lines, well inside one fresh context; merging would also fit, but the split keeps each boundary checkable against one skill (spec §8, the approved task graph). Check prerequisites are local only (no network, live host or eval kernel): `node`, `npm`, `bun`, `python3`, git read-only commands, and the ignored `acp-controller/node_modules` and `extensions/node_modules` already present in this checkout; AC-9 runs in the foreground with a timeout of at least 300 s.
- Effects: Repository working-tree changes only, limited to the Scope paths: two rewrites (T1 `reconcile/SKILL.md`, T2 `retrace/SKILL.md`) and one new file (driver, created by T1 and appended by T2); writing throwaway check scripts and an optional throwaway line-range builder under `/tmp/b6/` (nothing throwaway is committed); running the listed checks and suites. No destructive deletion, no git staging, commit, checkout or other git state change, no live run or simulation of omp-update R1–R3, no home-directory or `node_modules` change. The tree is never committed between tasks. Shipping precondition of the route, not a task effect (spec §5, D5): the plan reaches DONE on the offline proof; the commit is blocked until the human reports that omp-update R1, R2 and R3 pass on the candidate tree; the agent running that gate records the driver SHA-256 with the step-g hashes before and after each run and reruns `S2 all` and `S3 all` right before the commit, and the driver hash at commit must equal the one taken before R1 (§9 residual seam); on any R1–R3 failure or the owner's call the rollback is `git checkout 6b0902c -- .config/agents/skills/reconcile/SKILL.md .config/agents/skills/retrace/SKILL.md` and `rm .config/agents/harnesses/omp/acp-controller/driver.md`, performed only by the owner's decision, never by an implementation task.
- Non-goals: Any semantic compression or rewording beyond §4.3 and §4.4 (D1); any driver title, introduction or other prose; any change to kept skill text; either skill's `evals/` (D4); `.config/agents/skills/reconcile/references/` (reviewer protocol), `skills/rethink/`, `skills/omp-update/`, `references/packed-label.md`, `harnesses/omp/agent-return.md`, every controller file other than the new driver, CLI or version pins, ADRs; any permanent test; every other proposal item.

## Tasks

- [x] T1. Split the Reconcile skill and create the driver with its Reconcile section
  completed 2026-09-29-1719
  - Owner: lean-6-reconcile-child
  - Depends on: none
  - Targets: .config/agents/skills/reconcile/SKILL.md, .config/agents/harnesses/omp/acp-controller/driver.md (create; ## Reconcile section only)
  - Acceptance: AC-2, AC-4
  - Receiver: route-agent dev-implementation controller

- [x] T2. Split the Retrace skill, append the driver's Retrace section and own the whole-tree invariants and guards
  completed 2026-09-29-1719
  - Owner: lean-6-retrace-child
  - Depends on: T1
  - Targets: .config/agents/skills/retrace/SKILL.md, .config/agents/harnesses/omp/acp-controller/driver.md (append-only; ## Retrace section after T1's bytes)
  - Acceptance: AC-1, AC-3, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-14
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. Rendered prompts byte-identical
  Behavior: The real `lib/prompts.mjs` loader renders every reviewer and scope template from the working tree byte-identical to the templates it renders from a `git archive` copy of the baseline's protocol and Retrace skill.
  Check: `S1`; expect `ok`.

- [x] AC-2. Reconcile split loses no rule
  Behavior: The new Reconcile skill and the driver's `## Reconcile` section, as normalized paragraph sequences, equal the baseline Reconcile skill split by §4.2, with P1–P4, the three new Reconcile group headings and A1, A2, A4 applied; nothing is lost, added, reordered or reworded.
  Check: `S2 reconcile`; expect `ok`.

- [x] AC-3. Both splits lose no rule
  Behavior: The same holds for both skills and the whole driver: every normalized baseline paragraph of both SKILL.md files lands exactly once across the three files, with only §4.3 new text and §4.4 adaptations.
  Check: `S2 all`; expect `ok`.

- [x] AC-4. Reconcile driver section complete and skill clean
  Behavior: The driver's outline starts with the §4.5 Reconcile headings; its Reconcile section holds every Reconcile CLI form, the request keys, the resume JSON, the exit statement and the never-rerun rule; the Reconcile skill holds no `cli.mjs`, `versions.mjs` or `modelRoles` and links the driver file without a fragment; every relative link and anchor in the skill and the driver resolves.
  Check: `S3 reconcile`; expect `ok`.

- [x] AC-5. Whole driver complete and both skills clean
  Behavior: As AC-4 for both skills and the whole driver: exact §4.5 outline, the Retrace section's CLI forms, keys, exit statement and never-rerun rule, no forbidden token outside Retrace's pulled sections and prompt bodies, both skills link the driver file without a fragment, and every link resolves.
  Check: `S3 all`; expect `ok`.

- [x] AC-6. Only batch-6 files differ
  Behavior: Only batch-6 paths differ from the baseline (union allowlist: the two SKILL.md files and the untracked driver), and nothing is deleted.
  Check: `S4`; expect `ok`.

- [x] AC-7. Guard markers intact
  Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
  Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ 	]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

- [x] AC-8. Guarded paths unchanged
  Behavior: The reviewer protocol, both skills' evals, `rethink/`, `omp-update/`, `packed-label.md`, every controller file other than the new driver, and `agent-return.md` are unchanged against the baseline and in the working tree.
  Check: `P=".config/agents/skills/reconcile/references .config/agents/skills/reconcile/evals .config/agents/skills/retrace/evals .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; X=':(exclude).config/agents/harnesses/omp/acp-controller/driver.md'; git status --porcelain -- $P "$X"; git diff --name-only 6b0902c -- $P "$X"`; expect empty output.

- [x] AC-9. acp-controller suites pass
  Behavior: The acp-controller preflight, reconcile and retrace suites pass.
  Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

- [x] AC-10. Prompt files load offline
  Behavior: The real protocol and Retrace skill still load through the CLI offline.
  Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

- [x] AC-11. Plan validator suite passes
  Behavior: The plan validator suite passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` (14 tests) and exit 0.

- [x] AC-12. Plan-sync suite passes
  Behavior: The plan-sync extension suite passes.
  Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

- [x] AC-13. Papercut ledger suite passes
  Behavior: The papercut ledger suite passes.
  Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` (19 tests) and exit 0.

- [x] AC-14. Driver Reconcile bytes preserved
  Behavior: T2 only appended to the driver: every byte before `## Retrace` is the file T1 left.
  Check: `python3 -c "import hashlib;b=open('.config/agents/harnesses/omp/acp-controller/driver.md','rb').read();print(hashlib.sha256(b[:b.index(b'\n## Retrace\n')]).hexdigest())"`; expect the `driver.md` SHA-256 recorded in T1's completion Handoff.

## Recovery and stops

- Recovery: Preserve every completed task and its Handoff, including T1's recorded driver SHA-256, which binds AC-14. T2 starts only after T1's Handoff reports AC-2 and AC-4 `ok`, the five gates passing and the recorded hash; an incomplete T1 resumes alone within this plan's authority, and an incomplete or failed T2 resumes from the T1 driver bytes without touching T1's Targets or any byte before `## Retrace`. A T2 failure never rolls back, rewrites or revalidates T1's Handoff'd bytes: T2 repairs only its own appended bytes and `retrace/SKILL.md`, and if the recorded hash no longer matches the prefix, T2 stops instead of re-recording it. Execution-mechanism failures are assessed under `skill://dev-implementation/references/execution-recovery.md`. Rollback (spec §5: `git checkout 6b0902c -- .config/agents/skills/reconcile/SKILL.md .config/agents/skills/retrace/SKILL.md` and `rm .config/agents/harnesses/omp/acp-controller/driver.md`) is the owner's call; implementation performs none.
- Stops: An extracted `Sn` script's SHA-256 differs from spec §6.1; any guard check (AC-1, AC-6 through AC-14) or T1 boundary gate fails at any boundary where it runs; any owned check fails after permitted repair; S2 reports a difference the spec §4 tables do not explain, S2 finds a moved Reconcile paragraph equal to a moved Retrace paragraph, or a moved paragraph contains a relative link (each needs a spec revision); `git show 6b0902c:<path>` fails; T2 would change any driver byte T1 wrote; a change would touch a path outside the S4 allowlist, a sibling task's Targets, a guarded path or git state, or need an undeclared effect; the route owner reverses D1–D5; the specification revision or content identity no longer matches.

## Completion Summary

- Outcome: `reconcile/SKILL.md` (685→603 lines) and `retrace/SKILL.md` (559→515) keep their method text verbatim; the root-session controller I/O moved verbatim into the new `harnesses/omp/acp-controller/driver.md` (147 lines: `## Reconcile` with capability preflight, roles check, controller invocation, resume/abandon; `## Retrace` with invoke the controller). Only the pinned pointer lines P1–P5 and adaptations A1–A4 are new wording. Rendered controller prompts byte-identical to `6b0902c`; `reviewer-protocol.md`, both `evals/`, `rethink/`, `omp-update/`, `packed-label.md`, `agent-return.md` and controller code unchanged.
- Tasks: T1 then T2 sequential on the shared driver (T2 append-only; AC-14 prefix hash `da3671f7…67cf`); both attempt 1, no correction passes.
- Authority: spec-v2 after a Reconcile review (VALID on `b2e12a57…a829`) and one plan-rethink (single-owner ACs, AC-14 append proof, plain driver links without `#fragment`); plan rethink added the byte-range ownership contract and the AC-14 input path.
- Assurance: review APPROVED, no findings (independent 285-paragraph coverage, 10 rendered templates byte-identical, R1–R3 walk-through; advisories: S2 normalization gap ruled out by unnormalized diff, A1 names a rule without heading, 147 vs 145 lines is an observation); verification VERIFIED AC-1..AC-14 plus closure (validator valid, 16 ticks, 2 modified + 3 untracked, spec hash bound); `Learning: no durable learning` (L1 `#fragment` guidance deferred as a Deep proposal for `craft-skill`).
- Shipping gate (D5): plan DONE on offline proof; commit blocked until the human reports omp-update R1, R2 and R3 pass on this tree; rollback `git checkout 6b0902c -- .config/agents/skills/reconcile/SKILL.md .config/agents/skills/retrace/SKILL.md && rm .config/agents/harnesses/omp/acp-controller/driver.md`. Accepted residuals: R1–R3 do not hash the driver's bytes; omp-update L24 wording stale.
- Commits: none. Nothing pushed.
