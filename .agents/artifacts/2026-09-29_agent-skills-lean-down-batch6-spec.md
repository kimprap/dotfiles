# Agent-skills lean-down, batch 6: technical specification

- **Revision:** `agent-skills-lean-down-batch6/spec-v2`
- **Date:** 2026-09-29
- **Assurance:** standard (the route owner owns assurance; nothing here raises or lowers it)
- **Baseline:** repository `HEAD` `6b0902c` (tree clean). Line numbers are baseline line numbers from `git show 6b0902c:<path>`. They locate text; no check pins a line number.

## 1. Authority and approved outcome

**Authority.**

- The human-approved final proposal for batch 6 (proposal item 8, the last ranked item) after its Reconcile review, held by the route owner at `/tmp/reconcile-6.ZWpdXD/final-proposal.md` (a session-local file; this spec restates every rule it relies on). Item 8: split `reconcile` and `retrace` into their portable method and one OMP driver file. Survey evidence: `/tmp/reconcile-6.ZWpdXD/survey-evidence.md`.
- Owner decisions (settled; approved defaults of the final proposal):
  - **D1 — split only.** Verbatim moves at paragraph granularity; only the §4.4 reference adaptations; no compression toward the proposal's "about 150–250 lines each" in this batch.
  - **D2 — driver path.** `.config/agents/harnesses/omp/acp-controller/driver.md`.
  - **D3 — pulled sections frozen.** Every controller-pulled section body stays byte-identical, so the rendered prompts are byte-identical.
  - **D4 — evals untouched.** `skills/reconcile/evals/` and `skills/retrace/evals/` do not change.
  - **D5 — live-run gate.** The commit is gated on the human's omp-update live runs R1–R3 on the candidate tree (§5).
- Reviewer notes the route owner carried into this spec (binding):
  - B: the driver is outside omp-update's L55 hash list, so R1–R3 do not pin its bytes. Recorded as an accepted residual in §9 with a cheap seam that edits no guarded file.
  - B: the moved `roles` paragraph (Reconcile L205–213) says "step 1's capability preflight"; it is the fourth adaptation row (§4.4 A4).
  - A: the "their two copies are not identical" rationale in the proposal's scope rule applies only to the items that have two copies (execution-recovery adoption, `begin-reconcile` construction and validation, frozen-record identity, reply admission and return transport, terminal cleanup). The rethink step has one copy and stays because it is method (§3).
- Guard (the proposal's "Reconcile and Retrace guard"): the protocol is byte-identical; prompt markers and pulled headings appear exactly once; the rendered prompts are byte-identical; no change to the controller code, CLI or version pins, `skills/omp-update/`, `references/packed-label.md`, `skills/rethink/SKILL.md` or `harnesses/omp/agent-return.md`; `npm test` `fail 0`; `cli.mjs roles` exit 0; the executor_plan, bun and papercut-ledger suites pass.
- Owner intent: lean, host-agnostic portable skills; one owner per rule; never lose a rule.
- Precedent: batch 5b [spec-v3](2026-09-29_agent-skills-lean-down-batch5b-spec.md) (§-numbering, extraction rule, §6.1 hash table, union allowlist, guard set, single-task-state simulation).

**Approved outcome.**

- A new driver, `harnesses/omp/acp-controller/driver.md`, holds only the root-session controller I/O the approved intent names: the request JSON, the `cli.mjs` calls (`roles`, `reconcile <`, `retrace <`, `resume`, `dispose`), the exit codes, the capability-preflight refusal list, and resume/abandon. It has two disjoint sections, `## Reconcile` and `## Retrace`, each holding its skill's moved paragraphs verbatim in baseline order under one heading per moved group.
- `skills/reconcile/SKILL.md` and `skills/retrace/SKILL.md` keep every other paragraph verbatim and in place, plus one pointer line (with a relative link to the driver) where each moved group was.
- Every normalized baseline paragraph of both skills lands exactly once across the three files; the only exceptions are the §4.3 new-text list and the §4.4 adaptations.
- The controller renders byte-identical prompts. Nothing in the guard changes, and every suite stays green.
- The work is not done until the human reports omp-update R1–R3 pass on the candidate tree (D5, §5).

**Non-goals.** No semantic compression of method prose (D1). No change to either skill's evals (D4), the reviewer protocol, the controller code, omp-update, ADRs or any other file. No new driver prose beyond §4.3 (no title, no introduction). No permanent test. No live runs by agents, no commits.

## 2. Current system and constraints

Baseline facts (verified at `6b0902c`):

- The controller reads exactly two skill files at run start. `lib/prompts.mjs` L18 sets `AGENTS_ROOT` from the controller directory; `PROMPT_SOURCES` (L19–22) names `skills/reconcile/references/reviewer-protocol.md` and `skills/retrace/SKILL.md`. `cli.mjs` L159 calls `loadPrompts(PROMPT_SOURCES)` for every subcommand, including `roles`, and refuses with exit 2 on any problem (L160).
- The loader extracts each `<!-- prompt:NAME -->` body up to the next marker or heading outside a code fence (L55–71) and expands `{{SECTION:Heading}}` from the same file: the heading must be unique (L75–76), and the section runs from the heading to the line before the next heading of the same or higher level (L79–82), blank-trimmed.
- `loadPrompts({ reviewerProtocolPath, retraceSkillPath })` (L119) takes both source paths as optional overrides; S1 uses this seam. It returns `{ ok, prompts: { reviewer, scope }, sources }`; `sources` carries each file's SHA-256. `cli.mjs` L175 passes `sources` to the controller as `promptSources`, which no controller code reads (repository search: `cli.mjs` L175 is the only occurrence), so the changed Retrace file hash has no consumer.
- `skills/rethink/SKILL.md` is never read by the loader; its absolute path is the hard-coded `RETHINK_SKILL_PATH` (`controller.mjs` L21) filled into the `RETHINK_SKILL` slot (L242). The offline suites stub the loader (survey); only `cli.mjs roles` and live runs read the real files.
- `reconcile/SKILL.md` is 685 lines; `retrace/SKILL.md` 559. `acp-controller/` holds no Markdown file and no skill loads anything from it.
- Pulled Retrace sections: `### Finding eligibility` (L26, section L26–31, ends at `### Explicit child entries` L32), `## Normalize and approve` (L118–125; `cli.mjs` at L121 and L123, `modelRoles` at L123), `## Evidence boundary` (L367), `## Method` (L381), `## Readiness` (L392), `## Result` (L403); markers `evaluate`, `continue`, `reask`, `normalize` inside `## Scope evaluator prompts` (L463–559). The Reconcile skill has no pulled section.
- `omp-update/SKILL.md` step g (L55) hashes both SKILL.md files, the protocol and `config.yml` before and after each live run; R2 resumes a parked run "per the Reconcile skill" (L115). L24 states "The Reconcile skill and ADR-0010 name the file, not the numbers" (the version-pin file). No R1–R3 pass condition (L93, L111, L115, L135) mentions `versions.mjs` or reads skill text; R2's resume (L113) happens in the same session after P1 has loaded the driver, and P4 names the resume group at the skill's resume step.
- ADR-0010 "Affected contracts" lists `.config/agents/harnesses/omp/acp-controller/` and both SKILL.md files, so the driver falls inside an already-listed contract; no ADR changes.
- The moved paragraphs contain no relative Markdown link (verified); the kept ones link `references/reviewer-protocol.md`, `../dev-implementation/references/execution-recovery.md` and `../../references/packed-label.md`.
- Guard suites at baseline: `npm test` 51 pass `fail 0`; `cli.mjs roles` exit 0; `test_executor_plan.py` 14 tests `OK`; extensions `bun test` 20 pass 0 fail; `test_papercut_ledger.py` 19 tests `OK`.

## 3. Architecture and ownership

| Concern | Owner after batch 6 |
|---|---|
| Review method: candidate inference and binding, brief field map and approval rules, ephemeral state, lineage, reviewer progression, re-asks, citations, negotiation, application, capacity, terminal cleanup, liveness, repair semantics, presentation | `skills/reconcile/SKILL.md` (unchanged text) |
| Reviewer prompts and reviewer sections | `skills/reconcile/references/reviewer-protocol.md` (byte-identical) |
| Retrace intake, finding eligibility, entries, execution-recovery adoption, normalize and approve (pulled), transport, scheduler, re-asks, evaluation sections, aggregate, stops, scope prompts | `skills/retrace/SKILL.md` (unchanged text) |
| Root-session controller I/O: capability preflight and its refusal list, `roles` check, request JSON, `cli.mjs reconcile`/`retrace`, stdout and exit codes, never-rerun, `modelRoles` binding, `resume` and `dispose` | `harnesses/omp/acp-controller/driver.md` (new; moved text) |

Items that stay in their skill although they mention the controller (proposal scope rule): execution-recovery adoption; `begin-reconcile` construction and validation; frozen-record identity; reply admission and return transport; terminal cleanup; identity-preserving repair semantics; the rethink step; presentation. The first five have one copy in each skill, and the copies are not identical, so moving them would need a rewrite (D1 forbids it). Repair semantics, the rethink step and presentation have one copy each and stay because they are method (reviewer note A).

Dependency direction: each skill loads the driver through a relative link (`../../harnesses/omp/acp-controller/driver.md`, the batch-5a convention); the driver links nothing. The controller does not read the driver. Retrace's `Normalize and approve` keeps its two `cli.mjs` lines (L121, L123) because the controller pulls that section into the normalizer prompt (D3).

## 4. Interfaces, data, invariants and errors

### 4.1 Paragraphs and normalization

A *paragraph* is what the S2 `paras` function returns (§6.1): a fenced code block from its opening to its closing fence line; a heading line; a top-level list item (a line starting `- `, `* ` or `N. ` with no indent) with its continuation lines; or any other run of non-blank lines. Blank lines separate paragraphs. *Normalized* text removes one leading heading marker (`#`…`######`) or list marker from a non-fenced paragraph and collapses every whitespace run to one space. All ranges below were checked against this rule at `6b0902c`: every range starts and ends on a paragraph boundary.

### 4.2 Moves

`reconcile/SKILL.md` **keeps** L1–100, L120–204, L251–572 and L599–685 (L101, L204, L214, L250, L573, L598 are blank). Moved groups, in baseline order:

| Group | Baseline lines | Paragraphs | Content | Driver heading |
|---|---|---|---|---|
| RC1 | L102–119 | 1 (list item 1) | capability preflight: exit 2 refusals, `versions.mjs`, `modelRoles`, prompt marker, abandoned-run `dispose`, exit 3, no patching | new `### Capability preflight` |
| RC2 | L205–213 | 1 | the `roles` call before each brief and its `Models:` list | new `### Roles check before each brief` |
| RC3 | L215–249 | 6 (heading; L217–218; JSON L220–229; L231–237; command L239–241; L243–249) | the whole `## Controller invocation` section: request JSON, `cli.mjs reconcile <`, stdout and `## Spend`, exit 0–3, one call per binding, never rerun | its own baseline heading, demoted to `### Controller invocation` |
| RC4 | L574–597 | 2 (command L574–576; L578–597) | `cli.mjs resume`, the "with the request …" resume JSON and resume-semantics paragraph, `dispose` abandon | new `### Resume and abandon a parked run` |

Kept and unchanged, as the proposal lists: L321 (frozen rethink path), L341ff (reply admission), L508–531 (terminal cleanup), L566–572 (identity-preserving repair, ending in the colon that now introduces pointer P4), L609–685 (presentation).

`retrace/SKILL.md` **keeps** L1–44 and L91–559 (L44 and L90 are blank). L1–44 includes `### Explicit child entries` (L32) and its ownership paragraph (L34–43), so the pulled `Finding eligibility` section still ends at L31.

| Group | Baseline lines | Paragraphs | Content | Driver heading |
|---|---|---|---|---|
| RT1 | L45–89 | 7 (L45–46; command L48–50; L52; JSON L54–64; exit/stdout/never-rerun/`dispose` L66–82; `modelRoles` L84–89) | invocation sentence, `cli.mjs retrace <`, request JSON, exit codes, abandoned-run `dispose`, `modelRoles` binding | new `### Invoke the controller` |

The L118–125 `Normalize and approve` section keeps its `cli.mjs` lines (L121, L123): controller-pulled (D3).

Identical-copy deduplication: none. No moved Reconcile paragraph equals a moved Retrace paragraph after normalization (the two `dispose` passages sit inside different, non-identical paragraphs), so each copy lands once under its own skill's section. S2 stops if that ever stops holding.

### 4.3 New text (the complete list)

Exact text; the implementer copies it byte for byte.

| Id | File, place | Text |
|---|---|---|
| P1 | reconcile, replaces list item 1 (between L100 and L120, no blank line before item 2) | ``1. Load [the driver](../../harnesses/omp/acp-controller/driver.md) and run its Reconcile capability preflight.`` |
| P2 | reconcile, where RC2 was (after L203, own paragraph) | ``Immediately before rendering each brief, including a revised one, run the roles check under "Roles check before each brief" in [the driver](../../harnesses/omp/acp-controller/driver.md).`` |
| P3 | reconcile, where RC3 was (after P2, own paragraph; directly followed by `## Ephemeral state and identities`) | ``After approval, invoke the controller as "Controller invocation" in [the driver](../../harnesses/omp/acp-controller/driver.md) says.`` |
| P4 | reconcile, where RC4 was (after L572's colon, own paragraph, before L599) | ``the resume command under "Resume and abandon a parked run" in [the driver](../../harnesses/omp/acp-controller/driver.md), which also gives the abandon command.`` |
| P5 | retrace, where RT1 was (after L43, own paragraph, before L91) | ``After approval, invoke the controller, handle its exit codes, and bind its models as the "Retrace" section of [the driver](../../harnesses/omp/acp-controller/driver.md) says.`` |
| H | driver | `## Reconcile`, `## Retrace`, and the three new group headings of §4.2 (RC3 uses its own moved heading) |

The kept "step 4 below" reference (Reconcile L95) stays correct, because P1 keeps the list numbering. The driver has no title, introduction or other prose.

### 4.4 Adaptation table (driver copies only)

Each row is one exact substitution on the normalized paragraph that contains the named line; no other wording changes. The implementer keeps baseline line breaks and may reflow only an adapted paragraph.

| Id | Baseline line | Before | After |
|---|---|---|---|
| A1 | Reconcile L213 | `the rule above` | `the Reconcile brief adjustment rule` |
| A2 | Reconcile L248–249 | `under Liveness, failure, and repair` | `under the Reconcile skill's Liveness, failure, and repair` |
| A3 | Retrace L75 | `that Stops requires` | `that Retrace's Stops section requires` |
| A4 | Reconcile L207–208 | `step 1's capability preflight` | `the Reconcile capability preflight above` |

A1–A3 are the proposal's rows; A4 is reviewer B's fourth row. The driver's RC1 group directly precedes RC2, so "above" is exact. The moved text holds no relative link; if one appeared it would be re-rooted from the driver's directory and added here by spec revision. Kept skill text is never adapted.

### 4.5 Driver layout

```text
## Reconcile
### Capability preflight            RC1 (L102–119)
### Roles check before each brief   RC2 (L205–213, A1, A4)
### Controller invocation           RC3 (L217–249, A2; heading is baseline L215)
### Resume and abandon a parked run RC4 (L574–597)
## Retrace
### Invoke the controller           RT1 (L45–89, A3)
```

Blank lines separate every heading and paragraph; the file ends with one newline. Task T1 writes only `## Reconcile` and its groups; task T2 appends `## Retrace` and its group. Pointers link the driver file without a `#fragment` and name the target section in quoted prose: OMP's `read` tool treats `driver.md#section` as a missing path (observed: `Path '…/SKILL.md#presentation' not found`), so a fragment link would send the root session to a dead path. T2 appends only: it adds the blank line, `## Retrace` and its group after the last byte T1 wrote and changes no byte before it (AC-14).

### 4.6 Invariants and errors

- *I1 rendered prompts identical* (S1): the real loader renders the same reviewer and scope templates from the working tree as from a `git archive` of the baseline.
- *I2 never lose a rule* (S2): each of the three files, as a normalized paragraph sequence, equals the baseline sequence with §4.2 moves, §4.3 new text and §4.4 adaptations applied. Order is checked, so every baseline paragraph lands exactly once, in baseline order.
- *I3 driver completeness and skill cleanliness* (S3): the driver's heading outline is exactly §4.5; its Reconcile section holds `cli.mjs roles`, `cli.mjs reconcile <`, `cli.mjs resume {runId} <`, `cli.mjs dispose {runId}`, `lib/versions.mjs`, `modelRoles`, the request keys `goal`, `candidate`, `context`, `mode`, `cap`, `approval`, the resume JSON (`{"repair": {"authority":` … `"step":`), the exit statement and the never-rerun rule; its Retrace section holds `cli.mjs retrace <`, `cli.mjs dispose {runId}`, `modelRoles`, the keys `root`, `objectives`, `constraints`, `exclusions`, `evidence`, `table`, `approval`, the exit statement and the never-rerun rule. Outside controller-pulled sections and prompt bodies, neither skill contains `cli.mjs`, `versions.mjs` or `modelRoles`; the frozen rethink path (L321) and exit wording in kept method prose are allowed. Each skill links the driver by `../../harnesses/omp/acp-controller/driver.md`, so omp-update R2's "resume per the Reconcile skill" stays reachable through a file the skill loads.
- *I4 links resolve* (S3): every relative Markdown link outside code fences in the three files resolves to an existing file, every `#fragment` into a Markdown file names one of its heading slugs, and no link to the driver carries a fragment.
- *I5 guard*: markers and pulled headings exactly once; guarded paths unchanged; union allowlist; suites green.

Runtime errors: none new. A broken pulled section makes `cli.mjs` refuse with exit 2 (`missing prompt marker`), which AC-10 and S1 would catch offline.

## 5. Effects, migration, rollback and compatibility

- Effects: working-tree edits only. Two rewrites (`skills/reconcile/SKILL.md`, `skills/retrace/SKILL.md`) and one new file (`harnesses/omp/acp-controller/driver.md`). No staging, commit, live run, home-directory or `node_modules` change.
- Migration: clean cutover. The moved text exists only in the driver; no copy, alias or fallback stays in the skills.
- **Live-run gate (D5; guard rule 3).** The split changes skill text, so it is not done until the human runs omp-update R1, R2 (Reconcile) and R3 (Retrace) on the candidate tree. Route: offline implementation → review → verification → plan DONE on the offline proof (§6). The **commit is blocked** until the human reports that R1–R3 pass. The human runs them per omp-update step g; the agent records the SHA-256 of `driver.md` next to the step-g hashes before and after each run (the §9 residual seam). No agent runs or simulates R1–R3.
- **Rollback** (any R1–R3 failure, or the owner's call): `git checkout 6b0902c -- .config/agents/skills/reconcile/SKILL.md .config/agents/skills/retrace/SKILL.md` and `rm .config/agents/harnesses/omp/acp-controller/driver.md`. Nothing else is touched, so nothing else needs restoring; AC-6 and AC-8 then read `ok` and empty, and S1 stays `ok`.
- Compatibility: the controller, its prompts and its CLI are unchanged (AC-1, AC-8), so every controller run behaves as before. Root-session behavior changes only in where the root reads its CLI steps (one load line); only R1–R3 prove it (§9).
- The tree between tasks is never committed.

## 6. Acceptance

Run every command from the repository root. `Sn` means: extract §6.1 block `Sn` to `/tmp/b6/Sn.py` and run `python3 /tmp/b6/Sn.py`; `S2 <mode>` and `S3 <mode>` pass the mode as the one argument. Extraction rule: a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````. No block contains such a line; backticks inside a block are characters, never a fence. §6.1 lists each extracted file's SHA-256, so extraction can be checked with `shasum -a 256 /tmp/b6/S*.py`. Each AC has one owner. A task runs every AC it owns at its boundary. **T1 boundary gates** (not owned by T1; T2 owns them as ACs): T1 also runs S1, S4, the AC-7 and AC-8 commands and AC-10 and must see `ok`, `ok`, `ok`, empty and `0` before its Handoff, and records `shasum -a 256 .config/agents/harnesses/omp/acp-controller/driver.md` in that Handoff for AC-14. S1 needs `node` and the ignored `acp-controller/node_modules` (present in this checkout).

**AC-1** — T2
Behavior: The real `lib/prompts.mjs` loader renders every reviewer and scope template from the working tree byte-identical to the templates it renders from a `git archive` copy of the baseline's protocol and Retrace skill.
Check: `S1`; expect `ok`.

**AC-2** — T1
Behavior: The new Reconcile skill and the driver's `## Reconcile` section, as normalized paragraph sequences, equal the baseline Reconcile skill split by §4.2, with P1–P4, the three new Reconcile group headings and A1, A2, A4 applied; nothing is lost, added, reordered or reworded.
Check: `S2 reconcile`; expect `ok`.

**AC-3** — T2
Behavior: The same holds for both skills and the whole driver: every normalized baseline paragraph of both SKILL.md files lands exactly once across the three files, with only §4.3 new text and §4.4 adaptations.
Check: `S2 all`; expect `ok`.

**AC-4** — T1
Behavior: The driver's outline starts with the §4.5 Reconcile headings; its Reconcile section holds every Reconcile CLI form, the request keys, the resume JSON, the exit statement and the never-rerun rule; the Reconcile skill holds no `cli.mjs`, `versions.mjs` or `modelRoles` and links the driver file without a fragment; every relative link and anchor in the skill and the driver resolves.
Check: `S3 reconcile`; expect `ok`.

**AC-5** — T2
Behavior: As AC-4 for both skills and the whole driver: exact §4.5 outline, the Retrace section's CLI forms, keys, exit statement and never-rerun rule, no forbidden token outside Retrace's pulled sections and prompt bodies, both skills link the driver file without a fragment, and every link resolves.
Check: `S3 all`; expect `ok`.

**AC-6** — T2
Behavior: Only batch-6 paths differ from the baseline (union allowlist: the two SKILL.md files and the untracked driver), and nothing is deleted.
Check: `S4`; expect `ok`.

**AC-7** — guard; T2
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ 	]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-8** — guard; T2
Behavior: The reviewer protocol, both skills' evals, `rethink/`, `omp-update/`, `packed-label.md`, every controller file other than the new driver, and `agent-return.md` are unchanged against the baseline and in the working tree.
Check: `P=".config/agents/skills/reconcile/references .config/agents/skills/reconcile/evals .config/agents/skills/retrace/evals .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; X=':(exclude).config/agents/harnesses/omp/acp-controller/driver.md'; git status --porcelain -- $P "$X"; git diff --name-only 6b0902c -- $P "$X"`; expect empty output.

**AC-9** — guard; T2
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

**AC-10** — guard; T2
Behavior: The real protocol and Retrace skill still load through the CLI offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-11** — guard; T2
Behavior: The plan validator suite passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` (14 tests) and exit 0.

**AC-12** — guard; T2
Behavior: The plan-sync extension suite passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-13** — guard; T2
Behavior: The papercut ledger suite passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` (19 tests) and exit 0.

**AC-14** — T2
Behavior: T2 only appended to the driver: every byte before `## Retrace` is the file T1 left.
Check: `python3 -c "import hashlib;b=open('.config/agents/harnesses/omp/acp-controller/driver.md','rb').read();print(hashlib.sha256(b[:b.index(b'\n## Retrace\n')]).hexdigest())"`; expect the `driver.md` SHA-256 recorded in T1's completion Handoff.

**Baseline results** (run at `6b0902c`; no file under the S4 pathspec is untracked, since this spec lives under `.agents/artifacts/`, outside it). Expected to fail before their task:

- T1: AC-2 (the Reconcile skill lacks P1–P4 and still holds RC1–RC4; `missing …/driver.md`), AC-4 (`missing …/driver.md`; S3 stops there).
- T2: AC-3 (as AC-2 plus the Retrace skill lacks P5 and still holds RT1), AC-5 (`missing …/driver.md`).

AC-14 cannot run before T1 (no driver). Already true: AC-1 (`ok`), AC-6 (`ok`), AC-7 (`ok`), AC-8 (empty), AC-9 (51 pass, `fail 0`), AC-10 (`0`), AC-11 (14 tests `OK`), AC-12 (20 pass, 0 fail), AC-13 (19 tests `OK`).

**Target simulation.** A fresh `git archive 6b0902c` copy was edited by a throwaway builder into the §4 target (not committed; `/tmp/b6/build.py`). The candidate has reconcile 603 lines, retrace 515, driver 145 (observations, not targets). The extracted S1–S4 ran in the copy with `GIT_DIR` pointing at this repository, `GIT_WORK_TREE` at the copy and `GIT_OPTIONAL_LOCKS=0`; `acp-controller/node_modules` and `extensions/node_modules` were symlinked from this checkout and excluded through `core.excludesFile` (a real checkout ignores them as directories; `.gitignore` does not match a symlink named `node_modules/`). All of S1, `S2 reconcile`, `S2 all`, `S3 reconcile`, `S3 all` and S4 printed `ok`; AC-8 printed nothing (driver present and non-empty, excluded by `:(exclude)`); AC-14 matched the T1-state driver hash (`f1ed7b9c…79ee`). In the copy: AC-7 `ok`, AC-9 51 pass, `fail 0`, AC-10 `0`, AC-11 `OK`, AC-12 20 pass 0 fail, AC-13 `OK`.

**Single-task state.** A second fresh copy built with T1 only (new Reconcile skill and a driver holding only `## Reconcile`; Retrace at baseline): S1, `S2 reconcile`, `S3 reconcile`, S4 and the AC-7 command printed `ok`, AC-8 printed nothing and AC-10 printed `0`, so T1 owns only ACs and gates that pass at its own boundary. `S2 all` and `S3 all` failed as expected, since T2 owns them (Retrace still holds RT1's paragraphs, S3 names L49, L78, L84, and lacks P5; the driver outline lacks `## Retrace`).

**Negative probes** (each on a fresh copy of the correct target; the checks that turned red):

| Probe | Red |
|---|---|
| a kept Reconcile paragraph (L535–538) dropped | `S2 reconcile`, `S2 all` |
| the moved `modelRoles` paragraph (Retrace L84–89) dropped from the driver | `S2 all`, `S3 all` |
| one word changed in the pulled `Readiness` section | S1, `S2 all` |
| the pulled `Normalize and approve` `roles` sentence replaced by a driver pointer | S1, `S2 all` |
| P5 placed under `### Finding eligibility` instead of after L43 (the pulled section grows) | S1, `S2 all` |
| a stray `cli.mjs roles` line added to the Reconcile skill | `S2 reconcile`, `S2 all`, `S3 reconcile`, `S3 all` |
| a stray `modelRoles` line added to Retrace method prose | `S2 all`, `S3 all` |
| P1's link path broken (dangling file) | `S2 reconcile`, `S2 all`, `S3 reconcile`, `S3 all` |
| P5's driver link given a `#retrace` fragment | `S2 all`, `S3 all` |
| T2 rewords a word inside `## Reconcile` ("explicitly names" → "names") | `S2 reconcile`, `S2 all`, AC-14 |
| T2 inserts a paragraph under `### Controller invocation` | `S2 reconcile`, `S2 all`, AC-14 |
| T2 reflows a `## Reconcile` paragraph (whitespace only) | AC-14 |
| A1 not applied in the driver | `S2 reconcile`, `S2 all` |
| an unlisted wording change in the driver ("Never rerun it" → "Do not rerun it") | `S2 reconcile`, `S2 all`, `S3 reconcile`, `S3 all` |
| a driver group heading renamed | `S2 reconcile`, `S2 all`, `S3 reconcile`, `S3 all` |
| driver sections swapped (`## Retrace` first) | `S2 reconcile`, `S2 all`, `S3 reconcile`, `S3 all` |
| the reviewer protocol edited | S4, AC-8 |
| a stray `acp-controller/README.md` added | S4, AC-8 |
| `lib/prompts.mjs` edited (one trailing space) | S4, AC-8 |
| `rethink/SKILL.md` and `lib/versions.mjs` edited | AC-8 (both listed) |

**Why each AC sits where it does.**

- T1 owns the Reconcile split and creates the driver with `## Reconcile`; its ACs (AC-2, AC-4) read only the Reconcile skill and the driver up to `## Retrace`, so they pass whatever T2's state. S1, S4 and the AC-7, AC-8 and AC-10 commands are cheap guards that hold after T1 alone; T1 runs them as gates, and T2 owns them as AC-1, AC-6, AC-7, AC-8 and AC-10 on the final tree.
- T2 appends `## Retrace` to the same file, so it depends on T1 (shared file, disjoint sections). Its boundary runs every invariant (`all` modes) and the heavy suites once, because no task edits a file those suites load and the offline suites stub the loader.
- S1 reads the working-tree protocol and Retrace skill; T1 changes neither, so the S1 gate at T1 proves T1 did not touch them.
- AC-14 protects T1's accepted bytes across the dependency: S2 catches any word, paragraph or order change T2 makes inside `## Reconcile`, and AC-14 also catches whitespace-only changes S2 normalizes away.

### 6.1 Check scripts

Copy each block verbatim under the §6 extraction rule. Each file holds the block's lines joined with newlines, plus one final newline. Expected `shasum -a 256` of the extracted files:

| File | SHA-256 |
|---|---|
| `S1.py` | `9b356313451505ac1bc50d70fb9df9452b0ad7ac0f78fdf3713e1607e7f88193` |
| `S2.py` | `4d37cbaafda0ff91c84907e45687f2bcd0848aa2c8af4cbf23b1c11c9bf84056` |
| `S3.py` | `f767d892336f177c95a981984361bdec363eea1aaf017042ef54309161746823` |
| `S4.py` | `5184c3cfd672ca2beebaa38ff0e8219d45000a5030dc398c2a6be23043f44e98` |

S1
```python
# S1 (AC-1): the real loader renders byte-identical prompts from the working tree and from a git archive of the baseline
import subprocess,sys,tempfile,shutil,os
B='6b0902c';L=os.path.abspath('.config/agents/harnesses/omp/acp-controller/lib/prompts.mjs')
F=['.config/agents/skills/reconcile/references/reviewer-protocol.md','.config/agents/skills/retrace/SKILL.md']
JS='''import { pathToFileURL } from "node:url";
const [lib, rp, rs] = process.argv.slice(1);
const { loadPrompts, PROMPT_SOURCES } = await import(pathToFileURL(lib).href);
const cur = await loadPrompts(PROMPT_SOURCES);
const base = await loadPrompts({ reviewerProtocolPath: rp, retraceSkillPath: rs });
const bad = [];
if (!cur.ok) bad.push("working tree: " + cur.problems.join("; "));
if (!base.ok) bad.push("baseline: " + base.problems.join("; "));
if (cur.ok && base.ok) {
  if (base.sources.retraceSkill.path === cur.sources.retraceSkill.path) bad.push("baseline copy not used");
  for (const g of ["reviewer", "scope"]) {
    const names = new Set([...Object.keys(cur.prompts[g]), ...Object.keys(base.prompts[g])]);
    for (const n of names) if (cur.prompts[g][n] !== base.prompts[g][n]) bad.push(`differs ${g}.${n}`);
  }
}
console.log(bad.length ? JSON.stringify(bad) : "ok");
'''
d=tempfile.mkdtemp(prefix='b6-s1-')
try:
    a=subprocess.run(['git','archive',B,'--',*F],capture_output=True)
    if a.returncode or subprocess.run(['tar','-x','-C',d],input=a.stdout).returncode:print('stop: git archive');sys.exit(2)
    r=subprocess.run(['node','--input-type=module','-e',JS,'--',L,*[os.path.join(d,f) for f in F]],capture_output=True,text=True)
    if r.returncode:print('stop: node '+r.stderr.strip()[-300:]);sys.exit(2)
    print(r.stdout.strip())
finally:shutil.rmtree(d)
```

S2
```python
# S2 (AC-2, AC-3): never lose a rule; argv[1] = reconcile | all
import re,sys,subprocess,difflib,os
B='6b0902c';K='.config/agents/skills/';RC=K+'reconcile/SKILL.md';RT=K+'retrace/SKILL.md'
DR='.config/agents/harnesses/omp/acp-controller/driver.md';D='../../harnesses/omp/acp-controller/driver.md'
# moved groups: (first line, last line, pointer left in the skill, new driver heading or None)
MOVES={RC:[(102,119,'1. Load [the driver]('+D+') and run its Reconcile capability preflight.','### Capability preflight'),
(205,213,'Immediately before rendering each brief, including a revised one, run the roles check under "Roles check before each brief" in [the driver]('+D+').','### Roles check before each brief'),
(215,249,'After approval, invoke the controller as "Controller invocation" in [the driver]('+D+') says.',None),
(574,597,'the resume command under "Resume and abandon a parked run" in [the driver]('+D+'), which also gives the abandon command.','### Resume and abandon a parked run')],
RT:[(45,89,'After approval, invoke the controller, handle its exit codes, and bind its models as the "Retrace" section of [the driver]('+D+') says.','### Invoke the controller')]}
SECTION={RC:'## Reconcile',RT:'## Retrace'}
# adaptation table A1-A4: (file, baseline line inside the paragraph, before, after); driver copy only
ADAPT=[(RC,213,'the rule above','the Reconcile brief adjustment rule'),
(RC,249,'under Liveness, failure, and repair',"under the Reconcile skill's Liveness, failure, and repair"),
(RT,75,'that Stops requires',"that Retrace's Stops section requires"),
(RC,207,"step 1's capability preflight",'the Reconcile capability preflight above')]
FENCE=re.compile(r'^\s*(```|~~~)')
def paras(text):
    L=text.split('\n')
    if L and L[-1]=='':L=L[:-1]
    out=[];cur=[];st=[None];fence=False
    def flush():
        if cur:out.append((st[0],st[0]+len(cur)-1,'\n'.join(cur)))
        cur.clear();st[0]=None
    for i,l in enumerate(L,1):
        if fence:
            cur.append(l)
            if FENCE.match(l):fence=False;flush()
            continue
        if FENCE.match(l):flush();st[0]=i;cur.append(l);fence=True;continue
        if l.strip()=='':flush();continue
        if re.match(r'^#{1,6}\s',l):flush();out.append((i,i,l));continue
        if re.match(r'^([-*]|\d+\.)\s',l):flush()
        if st[0] is None:st[0]=i
        cur.append(l)
    flush();return out
def norm(t):
    if not FENCE.match(t):t=re.sub(r'^(#{1,6}|[-*]|\d+\.)\s+','',t)
    return ' '.join(t.split())
def show(p):
    r=subprocess.run(['git','show',B+':'+p],capture_output=True,text=True)
    if r.returncode:print('stop: git show '+p);sys.exit(2)
    return r.stdout
def expect(p):
    skill=[];drv=[norm(SECTION[p])];used=set();moved[p]=set()
    for a,b,t in paras(show(p)):
        g=[m for m in MOVES[p] if m[0]<=a and b<=m[1]]
        if not g:
            if any(m[0]<=b and a<=m[1] for m in MOVES[p]):print('stop: range splits paragraph %s L%d'%(p,a));sys.exit(2)
            skill.append(norm(t));continue
        m=g[0];n=norm(t);moved[p].add(n)
        if m[0] not in used:
            used.add(m[0]);skill.append(norm(m[2]))
            if m[3]:drv.append(norm(m[3]))
        for f,line,x,y in ADAPT:
            if f==p and a<=line<=b:
                if n.count(x)!=1:print('stop: adaptation %r at %s L%d'%(x,p,line));sys.exit(2)
                n=n.replace(x,y)
        drv.append(n)
    return skill,drv
def read(p):
    if not os.path.isfile(p):bad.append('missing '+p);return None
    return [norm(t) for a,b,t in paras(open(p,encoding='utf-8').read())]
def cmp(name,want,got):
    for op,i1,i2,j1,j2 in difflib.SequenceMatcher(None,want,got,autojunk=False).get_opcodes():
        if op=='equal':continue
        bad.extend(name+' missing: '+w[:70] for w in want[i1:i2])
        bad.extend(name+' unexpected: '+g[:70] for g in got[j1:j2])
mode=sys.argv[1];bad=[];moved={}
if mode not in ('reconcile','all'):print('unknown mode');sys.exit(2)
files=[RC] if mode=='reconcile' else [RC,RT]
drv_want=[]
for p in files:
    s,d=expect(p);drv_want+=d
    got=read(p)
    if got is not None:cmp(p,s,got)
if mode=='all' and moved[RC]&moved[RT]:print('stop: identical moved copies need the dedup rule');sys.exit(2)
drv=read(DR)
if drv is not None:
    if mode=='reconcile':
        cut=[i for i,x in enumerate(drv) if x==norm(SECTION[RT])]
        drv=drv[:cut[0]] if cut else drv
    cmp(DR,drv_want,drv)
print(bad or 'ok')
```

S3
```python
# S3 (AC-4, AC-5): driver completeness, skill cleanliness, fragment-free driver links, links resolve; argv[1] = reconcile | all
import re,sys,os
K='.config/agents/skills/';RC=K+'reconcile/SKILL.md';RT=K+'retrace/SKILL.md'
DR='.config/agents/harnesses/omp/acp-controller/driver.md';D='../../harnesses/omp/acp-controller/driver.md'
OUT={RC:['## Reconcile','### Capability preflight','### Roles check before each brief','### Controller invocation','### Resume and abandon a parked run'],
RT:['## Retrace','### Invoke the controller']}
NEED={RC:['cli.mjs roles','cli.mjs reconcile <','cli.mjs resume {runId} <','cli.mjs dispose {runId}','lib/versions.mjs','modelRoles',
'"goal":','"candidate":','"context":','"mode":','"cap":','"approval":','{"repair": {"authority":','"step":',
'Exit `0` is `## Final proposal`','Never rerun it to retry a stopped run'],
RT:['cli.mjs retrace <','cli.mjs dispose {runId}','modelRoles','"root":','"objectives":','"constraints":','"exclusions":','"evidence":','"table":','"approval":',
'Exit `0` means aggregate `complete`','Never rerun the controller to retry a stopped or partial scope']}
PULLED={RT:['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve']}
FORBID=re.compile(r'cli\.mjs|versions\.mjs|modelRoles')
FENCE=re.compile(r'^\s*(```|~~~)');HEAD=re.compile(r'^(#{1,6})\s+(.*?)\s*#*\s*$');MARK=re.compile(r'^\s*<!--\s*prompt:([\w-]+)\s*-->\s*$')
def rows(p):
    fence=False;out=[]
    for l in open(p,encoding='utf-8').read().split('\n'):
        f=FENCE.match(l);inf=fence or bool(f)
        if f:fence=not fence
        h=None if inf else HEAD.match(l)
        out.append((l,inf,(len(h.group(1)),h.group(2)) if h else None))
    return out
def slugs(p):
    seen={};out=set()
    for l,inf,h in rows(p):
        if not h:continue
        s=re.sub(r'[^\w\- ]','',h[1].lower()).replace(' ','-')
        n=seen.get(s,0);seen[s]=n+1;out.add(s if n==0 else '%s-%d'%(s,n))
    return out
mode=sys.argv[1];bad=[]
if mode not in ('reconcile','all'):print('unknown mode');sys.exit(2)
skills=[RC] if mode=='reconcile' else [RC,RT]
for p in [DR]+skills:
    if not os.path.isfile(p):bad.append('missing '+p)
if bad:print(bad);sys.exit(0)
R=rows(DR);heads=['#'*h[0]+' '+h[1] for l,inf,h in R if h]
if mode=='reconcile' and '## Retrace' in heads:heads=heads[:heads.index('## Retrace')]
want=[x for p in skills for x in OUT[p]]
if heads!=want:bad.append('driver outline %s'%heads)
for p in skills:
    lines=[l for l,inf,h in R];a=[i for i,(l,inf,h) in enumerate(R) if h and '#'*h[0]+' '+h[1]==OUT[p][0]]
    if len(a)!=1:bad.append('driver section '+OUT[p][0]);continue
    e=next((i for i in range(a[0]+1,len(R)) if R[i][2] and R[i][2][0]<=2),len(R))
    sec=' '.join(' '.join(lines[a[0]:e]).split())
    bad+=['driver %s lacks %s'%(OUT[p][0],x) for x in NEED[p] if x not in sec]
for p in skills:
    S=rows(p);skip=set()
    for i,(l,inf,h) in enumerate(S):
        if h and h[1] in PULLED.get(p,[]):
            j=i+1
            while j<len(S) and not (S[j][2] and S[j][2][0]<=h[0]):j+=1
            skip.update(range(i,j))
        if not inf and MARK.match(l):
            j=i+1
            while j<len(S) and (S[j][1] or not (MARK.match(S[j][0]) or S[j][2])):j+=1
            skip.update(range(i,j))
    bad+=['%s:%d holds %s'%(p,i+1,m.group(0)) for i,(l,inf,h) in enumerate(S) if i not in skip for m in [FORBID.search(l)] if m]
    if '](%s)'%D not in open(p,encoding='utf-8').read():bad.append(p+' does not link the driver')
for p in [DR]+skills:
    for i,(l,inf,h) in enumerate(rows(p)):
        if inf:continue
        for t in re.findall(r'\]\(([^)\s]+)\)',l):
            if re.match(r'^[a-z][a-z0-9+.-]*:',t):continue
            f,_,frag=t.partition('#');q=os.path.normpath(os.path.join(os.path.dirname(p),f)) if f else p
            if not os.path.isfile(q):bad.append('%s:%d dangling %s'%(p,i+1,t));continue
            if frag and q==os.path.normpath(DR):bad.append('%s:%d driver link has a fragment %s'%(p,i+1,t))
            elif frag and q.endswith('.md') and frag not in slugs(q):bad.append('%s:%d dangling anchor %s'%(p,i+1,t))
print(bad or 'ok')
```

S4
```python
# S4 (AC-6): only batch-6 paths differ from the baseline (union allowlist; nothing deleted)
import subprocess
C='.config/agents/'
ok={C+'skills/reconcile/SKILL.md',C+'skills/retrace/SKILL.md',C+'harnesses/omp/acp-controller/driver.md'}
g=lambda *a:[l for l in subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n') if l]
P=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts','.grok','.cursor']
got=set(g('diff','--name-only','6b0902c','--',*P)+g('ls-files','--others','--exclude-standard','--',*P))
gone=set(g('diff','--name-only','--diff-filter=D','6b0902c','--',*P))
print(sorted((got-ok)|gone) or 'ok')
```

## 7. Test seams

- Prompt identity uses the loader's own path-override seam (`loadPrompts({ reviewerProtocolPath, retraceSkillPath })`, L119): the same real loader renders the working tree and a `git archive` copy of the baseline, so S1 compares exactly what the controller would send, without stubbing or reimplementing the loader. It compares templates after `{{SECTION:…}}` expansion and before per-request slot filling; slot filling is unchanged code.
- S2 makes "never lose a rule" mechanical: it rebuilds each expected file from `git show 6b0902c:` by the §4 tables (encoded as `MOVES` and `ADAPT`) and diffs normalized paragraph sequences, naming each missing or unexpected paragraph. Whitespace and reflow are tolerated; any wording, order or placement change is not.
- S3 checks what S2 cannot see: heading levels (the §4.5 outline), required CLI tokens per section, forbidden tokens outside pulled sections (it cuts pulled sections with the loader's own heading and marker rules), the driver link, and link and anchor resolution.
- No permanent test is added or changed. The controller suites stub the loader and do not read skill text, so no suite covers this change; the S-checks are acceptance scripts. The root session's behavior with the driver is proven only by R1–R3 (§5).

## 8. Implementation boundaries and dependencies

A lean plan with two dependent tasks:

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — Reconcile split** | rewrite `skills/reconcile/SKILL.md` (§4.2 RC1–RC4 out, P1–P4 in); create `harnesses/omp/acp-controller/driver.md` with `## Reconcile` and its four groups (§4.5, A1, A2, A4) | — | AC-2, AC-4 (gates: S1, S4, AC-7, AC-8, AC-10 commands; records the driver SHA-256) |
| **T2 — Retrace split** | rewrite `skills/retrace/SKILL.md` (RT1 out, P5 in); append `## Retrace` and its group to `driver.md` (A3) | T1 | AC-1, AC-3, AC-5…AC-14 |

(Paths without a leading directory are under `.config/agents/`.)

**Sizing rationale.**

- The driver is one shared file with disjoint sections, so T2 depends on T1 and runs after it. Each task is a verbatim cut-and-paste of one skill's groups plus its pointer lines, well inside one fresh context. Merging them would also fit; the split keeps each boundary checkable against one skill (the proposal's approved task graph).
- The implementer may use a throwaway line-range script (like `/tmp/b6/build.py`) or edit by hand; S2 is the proof either way. Nothing throwaway is committed.
- Review focus (standard assurance): read the driver end to end for order, headings and ownership (proposal risk 3: paragraph coverage tolerates a paragraph under a misleading heading); check each adapted reference (A1–A4) and each pointer (P1–P5) against its target; re-run S2 `all`.

## 9. Risks, assumptions, residuals and stops

**Assumptions.**

- *The loader is the only controller reader.* `PROMPT_SOURCES` names only the protocol and the Retrace skill; `rethink` is a hard-coded path; no code reads the driver (§2).
- *Normalization is safe.* Collapsing whitespace and dropping a leading list or heading marker changes no rule; S3 separately pins the driver's heading levels.
- *The changed Retrace hash has no consumer.* `sources` reaches the controller as `promptSources`, which nothing reads (§2).

**Risks** (from the proposal, with mitigations).

1. *A root session skips the load line* and lacks its CLI calls. P1 is Reconcile's preflight step 1, P5 sits where Retrace's invocation text was, and S3 forbids stray copies, so there is one place to fix. Only R1–R3 prove the root follows the link.
2. *S1 proves only the reviewer and evaluator prompts.* Root-session behavior with the driver is proven only by R1–R3 (D5 gate).
3. *Paragraph coverage tolerates a misleading heading.* Review reads the driver end to end (§8).
4. *The driver's resume group starts with a command block and a lowercase "with the request …" paragraph.* This is the verbatim continuation of L566–572; P4 carries the sentence in the skill and the driver heading names the step. D1 forbids rewording it.

**Accepted residuals.**

- *Driver bytes are outside omp-update's L55 hash list* (reviewer B), so R1–R3 do not pin them, and omp-update is guarded. Cheap seam that edits no guarded file: the agent running the D5 gate records `shasum -a 256 .config/agents/harnesses/omp/acp-controller/driver.md` together with the step-g hashes before and after each run and reruns `S2 all` and `S3 all` on the candidate tree right before the commit; the driver hash at commit must equal the one taken before R1. This lives in the plan's gate step and the verification record, not in omp-update.
- *omp-update L24* says "The Reconcile skill and ADR-0010 name the file, not the numbers." After the split the version-pin path lives in the driver, not the skill. The rule it protects (no version numbers in skill or driver text) still holds; the wording is stale and belongs to a later omp-update change, not this batch (guarded).
- *"Only Reconcile semantic owners"* (protocol L3, Reconcile L21–24): the resume paragraph moved to the driver, which the skill loads (P1, P4). Neither sentence may change here (protocol byte-identical; kept text not adapted). [INFERENCE] The claim still holds through the skill's load; a later batch may name the driver there.
- *Evals.* Both skills' evals mention CLI calls and resume (D4 leaves them); they describe behavior, which is unchanged. [INFERENCE] No eval runner exists to prove it.
- *Sizes.* About 603 / 515 / 145 lines. The proposal's 150–250 lines per skill is not reachable by moving text (D1).

**Stops.**

- Any guard check or T1 gate fails (AC-1, AC-6…AC-14).
- S2 reports a difference the §4 tables do not explain, or a moved paragraph contains a relative link (both need a spec revision).
- A change would touch a path outside the S4 allowlist or git state.
- R1–R3 fail: roll back per §5; the commit stays blocked.

**Open decisions for the owner.** None. D1–D5 are settled; the pointer wording (§4.3), A4's wording, the group headings and RC3's demoted heading are engineering details inside that authority (§10).

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch6/spec-v2`. Changes from spec-v1 (plan rethink): P2–P5 link the driver file without a `#fragment` and name the section in prose, and S3 rejects a fragment on a driver link; AC-1, AC-6, AC-7, AC-8 and AC-10 are owned by T2 alone and run by T1 as boundary gates; new AC-14 (T2 appends without changing T1's bytes); the simulation excludes the `node_modules` symlinks; omp-update's pin wording is L24, not L20 as the survey said; S2 and S3 hashes changed.
- Proposal ranges: every range was re-checked against `git show 6b0902c:` at paragraph boundaries and is correct (Reconcile keeps L1–100, L120–204, L251–572, L599–685; moves L102–119, L205–213, L215–249, L574–597; Retrace keeps L1–44, L91–559; moves L45–89; `Normalize and approve` L118–124 with `cli.mjs` at L121 and L123). Corrections and resolutions:
  - `lib/prompts.mjs`: `PROMPT_SOURCES` is L19–22 (L18 sets `AGENTS_ROOT`), and the same-or-higher heading stop is L80 (the loop starts at L79). The proposal cited L18–21 and L79. No effect on the design.
  - RC3 is a whole section; its baseline heading `## Controller invocation` moves with it and serves as that group's heading, demoted to `###` so the driver's `## Reconcile` section stays one section. No extra heading is added for RC3.
  - The proposal gave only P1's wording; P2–P5 are pinned here so S2 can check them exactly.
  - A4 (reviewer B) reads `step 1's capability preflight` → `the Reconcile capability preflight above`.
  - Adaptations apply to normalized text because two of them span a line break in the baseline (A2 L248–249, A4 L207–208).
  - Identical-copy deduplication list: empty (§4.2).
- Next owner: `dev-ticketing` projects T1–T2 into a lean plan (T2 depends on T1), with the D5 gate and the §9 driver-hash seam in the plan's closure notes. Then `dev-implementation`, review, verification and learning at standard assurance. Plan DONE on the offline proof; the commit waits for the human's R1–R3 report.
- Route impact: unchanged.

**Handoff.**

- Result: technical specification for batch 6 (proposal item 8), revision `agent-skills-lean-down-batch6/spec-v2`, baseline `6b0902c`.
- Receiver: the route owner; next-owner role `dev-ticketing`.
- Scope: T1 (Reconcile split, driver `## Reconcile`) then T2 (Retrace split, driver `## Retrace`); AC-1…14 (each with one owner); S1–S4 hashes in §6.1.
- Evidence: baseline, target-simulation, single-task-state and negative-probe results in §6.
- Open: none (D1–D5 settled).
