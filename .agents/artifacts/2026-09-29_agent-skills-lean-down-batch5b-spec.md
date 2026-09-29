# Agent-skills lean-down, batch 5b: technical specification

- **Revision:** `agent-skills-lean-down-batch5b/spec-v3`
- **Date:** 2026-09-29
- **Assurance:** standard
- **Baseline:** repository `HEAD` `214ff74`. The only commit after the earlier baseline `52d6e3c` is `chore(omp): set second-opinion reviewers to medium thinking` (`harnesses/omp/config.yml` L85–86 only); no batch-5b file or fact changes. Line numbers refer to that baseline; re-locate by content if lines drift.

## 1. Authority and approved outcome

**Authority.**

- The human-approved proposal [`2026-09-28_agent-skills-lean-down-proposal.md`](2026-09-28_agent-skills-lean-down-proposal.md), ranked item 9 (row L36): "State the rubric once. Turn each trigger group into one table-driven case. Move the OMP cases to harness evals. Target 30–40 cases. Delete the copied fixtures."
- Carried from batch 5a ([spec-v2](2026-09-29_agent-skills-lean-down-batch5a-spec.md) §9 "Eval prompts stay"): the `/skill:` prompts in the `init-ask` and `product-ask` evals and the `/Users/kim` path in dev-ask eval data belong to 5b. Portable skills' evals carry no host syntax and no machine path.
- Owner decisions (settled):
  - **D1 — schema.** dev-ask keeps its own eval schema, bumped to `lean-dev-workflow-evals/v2`. The shared rubric is stated once at top level. Cases that differ by one trigger or fact become one group case with a variants table. Every baseline case id is kept (as a single case or a variant row) or mapped in an explicit table.
  - **D2 — fixtures.** Delete `skills/dev-ask/evals/fixtures/` entirely, including the git-ignored scratch bank `fixtures/l-routing/banks/…/mnemopi.db*`, by `rm -rf` (authorized local destructive delete; no `git rm`). The two files that are not case copies are inlined into their cases or dropped per an explicit table (§4.5).
  - **D3 — harness eval home** (route owner, 2026-09-29): `harnesses/omp/evals.json`, same v2 schema, linked from nowhere.
  - **D4 — host-neutral invocation** (route owner, 2026-09-29): the prompt prefix ``Invoke `<name>`. `` replaces `/skill:<name>. `.
  - **D5 — bytecode** (route owner, 2026-09-29): delete the ignored `dev-ask/evals/__pycache__/` with the fixtures.
- Never lose a rule, applied to evals as tests: every baseline case's tested behavior (criterion, inputs, scripted replies, expected route/owners/gates/outcome, required and forbidden events, capabilities, proof, tier, rubric) is held by exactly one v2 record, or the case is in the drop table with its reason.
- "Target 30–40 cases" is a goal. No check pins a case, row or line count.
- Guard: no change to `skills/{reconcile,retrace,rethink,omp-update}/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`. Guard markers stay exactly once. The acp-controller, roles, executor_plan, extensions and papercut-ledger suites stay green.
- Owner intent: lean, host/repo/topic-agnostic portable skills; one owner per rule; never lose a rule.
- Precedent: batch 1–5a specs in `.agents/artifacts/` (structure, `LIVE`, guard ACs, extraction rule, union allowlist).

**Approved outcome.**

- `dev-ask/evals/` holds only `evals.json`, in schema v2: seven shared rubric lines stated once, one `defaults` block, 42 cases (18 groups with variant rows plus 24 single cases), 79 records. Counts are observations, never targets.
- The two OMP-specific backend cases live in a new harness eval file `harnesses/omp/evals.json` with the same v2 schema.
- No case is dropped. Every baseline id except the two OMP cases is a dev-ask record.
- The copied fixtures and the scratch bank are gone. `answer.txt` and `registry.md` live inline in their cases as `files`.
- No dev-ask or harness eval carries a machine path or `/skill:`. `init-ask` and `product-ask` eval prompts use a host-neutral invocation.
- Nothing in the guard changes, and every suite stays green.

**Non-goals.** No eval runner, scanner or observer (batch 3 deleted them; none returns). No change to what any case tests beyond the §4.5 rewrite table. No change to `SKILL.md`, `WORKFLOW.md` or any other skill text. No change to other skills' evals (the `reconcile` evals hold `/Users/kim/.dotfiles/…` but are guarded). No change to `.agents/papercuts.json`, historical plans or artifacts. No live host runs, no commits.

## 2. Current system and constraints

Baseline facts (all verified at `214ff74`):

- `skills/dev-ask/evals/evals.json`: 4,243 lines, 226,879 bytes, top-level `{schema, cases}`, schema `lean-dev-workflow-evals/v1`. The file is byte-identical to `json.dumps(d, ensure_ascii=False, indent=2) + "\n"`.
- 81 cases: 64 `router`, 16 `backend`, 1 `live`. Every case has `id, layer, fixture_dir, criterion, inputs, scripted_replies, expected, required_events, forbidden_events, required_capabilities, absent_capabilities, proof, repetition_tier, rubric`. Optional: `approval_state` (17 cases), `additional_files` (15, all `[]`), `trace_scope` (6, all `terminal-snapshot`), `runtime_read_only` (1).
- Repetition: 368 rubric lines, 159 distinct; four lines repeat 36–37×, one 27×, one 9×, the three T5 reapproval lines 10× each. 50 distinct criteria (the top one 32×). 28 distinct proofs (the top one 39×). `scripted_replies`: `[]` ×44, `["APPROVE the current Route Overview"]` ×29, `["approve"]` ×7, one caveat reply. `repetition_tier`: `hard` ×80, `once` ×1.
- `fixtures/`: 2.0 MB. 81 tracked `<dir>/case.json`, each byte-equal in content to its case's `{additional_files, inputs, scripted_replies}` (0 mismatches). Two other tracked files: `l-routing/answer.txt` (`42\n`, referenced only by `L-ROUTING`) and `r-t5-history-nonexecution/registry.md` (217 bytes, referenced only by `R-T5-HISTORY-NONEXECUTION`). Git-ignored: `l-routing/banks/l-routing-1tmmzmu1tugw7/mnemopi.db{,-wal,-shm}` (1.7 MB; `.gitignore` `banks/`) and `evals/__pycache__/` (bytecode of the deleted `compare_trace.py` and `observe_case.py`; `.gitignore` `__pycache__/`).
- No live consumer: outside historical plans and artifacts, nothing names `evals/fixtures`, `fixture_dir` or `lean-dev-workflow-evals`. `.agents/papercuts.json` L150 and L209 name the deleted `compare_trace.py` and `scan_stale_contracts.py`, not the fixtures. ADR-0010 L36: "The eval catalogs are specification fixtures." No runner executes them.
- OMP-specific text (OMP, `taskDepth`, wake, job, `agent://`, Reconcile, Retrace) appears only in `B-LEAN-REVIEW-REPAIR` and `B-LEAN-VERIFIER-REPAIR`. Elsewhere "controller" is the generic `dev-implementation` controller. Their repair semantics are only partly held elsewhere; §3 lists the residue.
- The only machine path is in `B-T4-LEARNING-USER-LEVEL-NEAR-MISS`: `inputs.request` ("… editing /Users/kim/.agents/AGENTS.md …") and one rubric line ("Reject direct and indirect mutation of /Users/kim/.agents/AGENTS.md.").
- `R-GRILL` and `R-APPROACH-REFINEMENT` share criterion, rubric, scripted replies, required events and every `expected` key but `outcome`, yet test different activation paths: `R-GRILL` is an explicit ask to stress-test a decision, `R-APPROACH-REFINEMENT` an implicit candidate approach ("Give me a refined approach"). Both stay, as rows of one group.
- `harnesses/omp/` holds `acp-controller/`, `agent-return.md`, `agents/`, `config.yml`, `config.yml.lock`, `extensions/`, `keybindings.yml`, `lsp.json`, `plan-transport.md`. No eval file.
- `skills/init-ask/evals/evals.json` (`{skill_name, evals}`, 93 lines, same dump format): only `INIT-EMPTY-PROPOSAL`'s prompt starts `/skill:init-ask. `. `skills/product-ask/evals/evals.json` (42 lines): all three prompts (`P-FIVE-FIELD-COMPLETION`, `P-PAPERCUT-SETTLEMENT-FIVE-FIELD`, `P-COMPLETION-STOPS`) start `/skill:product-ask. `.
- `LIVE` (the live pathspec S2 greps): `.config/agents`, `docs`, `.agents/AGENTS.md`, `.agents/GENERIC-AGENTS.md`, `.agents/papercuts.json`, `bin`, `.config/scripts`, `.grok`, `.cursor`. `.scratch/`, `archive/` and historical `.agents/plans|artifacts` are not live.

## 3. Architecture and ownership

| Concern | Owner after 5b |
|---|---|
| Portable dev-ask routing evals (router, backend, live) | `skills/dev-ask/evals/evals.json` (v2) |
| OMP bridge and yield-wait behavior under lean review and verifier repair | `harnesses/omp/evals.json` (v2; new) |
| Portable repair semantics | split; see the residue table below |

Repair-semantics residue after the OMP cases move (D3 stands; no dev-ask case is added):

| Semantics | Held by after 5b |
|---|---|
| One review with no rerun; attempt-2 eligibility; no extra attempt; same-verifier complete closure | `dev-code-review/evals` `DCR-REPAIR-NO-RERUN`; `dev-verification/evals` `DV-VERIFIER-OWNED-CLOSURE`, `DV-REVIEW-REPAIR-FINAL` |
| No controller self-Handoff (`handoff:controller-to-self` forbidden) | dev-ask `B-LEAN-STANDARD`, `R-UNCHANGED-HANDOFF`, `R-LEAN-COMPACT`, `B-CONTROLLER-ENTRY-TOPOLOGY`, `B-PREREQUISITE-CONTROLLER-RETURNS` |
| Attempt-1 papercut look | dev-ask `B-LEAN-STANDARD` |
| The same implementation child repairs (`replacement:implementation-child` forbidden); the attempt-2 Handoff returns to the same controller; a papercut look on attempt 2; the other-host native token path | only the moved cases, in `harnesses/omp/evals.json`. dev-ask's catalog keeps no repair-route case. |
| The v2 expansion rule | the `expansion` string at the top of each v2 file (§4.1), so the catalog explains itself without a runner |
| Scenario files for `L-ROUTING` and `R-T5-HISTORY-NONEXECUTION` | the case's own `files` map |
| `init-ask` / `product-ask` eval prompts | same files, host-neutral wording |

Nothing links to the harness eval file; no caller exists (the dev-ask evals had none either). The harness file is OMP-owned test data beside the other OMP adapter files.

## 4. Interfaces, data, invariants and errors

### 4.1 Schema `lean-dev-workflow-evals/v2`

Top level, in this key order: `schema`, `expansion`, `rubric`, `defaults`, `cases`.

- `schema`: `"lean-dev-workflow-evals/v2"`.
- `expansion`: exactly this string (S1 pins it):

  > Each case with variants yields one record per variant; a case without variants is one record. A record starts from defaults, then applies the case, then the variant: inputs and expected merge by key, rubric appends, and every other field replaces. {name} placeholders take the variant's vars. The record's rubric is the shared rubric lines named in shared_rubric, then its own lines. Ids starting with G- name groups, never records.

- `rubric`: map from a short key to one shared rubric line.
- `defaults`: field values every record starts from.
- `cases`: list. A case is either a single case (its `id` is the record id) or a group (`id` starts `G-`, at least two `variants`). A group id is never a record id.

Fields (on `defaults`, cases and rows): `layer`, `approval_state`, `trace_scope`, `runtime_read_only`, `criterion`, `proof`, `repetition_tier`, `required_capabilities`, `absent_capabilities`, `scripted_replies`, `files`, `inputs`, `expected`, `required_events`, `forbidden_events`, `shared_rubric`, `rubric`. Cases also carry `id` and optionally `variants`. Rows carry `id` (the baseline case id), optional `vars` (string map) and field overrides.

Expansion (S1 implements it exactly):

1. Start from a deep copy of `defaults`.
2. Apply the case, then the row: `inputs` and `expected` merge key by key; `rubric` appends; every other field replaces.
3. Substitute each `{name}` in every string with the row's `vars[name]`. An unbound `{name}` is an error.
4. The record's `rubric` is `rubric[k]` for each `k` in `shared_rubric`, then its own lines. `shared_rubric` does not appear in the record.

Removed fields: `fixture_dir` (no fixtures) and `additional_files` (every value was `[]`). New field: `files`, a map from file name to its full text, which a runner would materialize in the disposable fixture.

Invariants (S1 checks):

- *Coverage.* Every baseline id is exactly one record, in dev-ask or (only the two OMP ids) the harness file. Its record equals the baseline case on every field except `id`, `fixture_dir`, `additional_files` and `rubric`, after the §4.5 rewrite. `files` equals the baseline fixture dir's non-`case.json` files. The rubric equals the baseline rubric as a multiset (order may change: shared lines come first). No record id is new.
- *Readable rows.* Every record's `inputs.request` is written on its own row (or single case), verbatim; no group or default holds a request. A reader sees each scenario without expanding anything.
- *Stated once.* No rubric text appears twice in a file (shared map, defaults, cases and rows together); every shared key is used by at least two records. No case restates a default; no row restates the value it inherits; no field (or `inputs`/`expected` key) is set identically on every row of a group; `G-REAPPROVAL`'s criterion is templated on `{trigger}` and every row binds `trigger`.
- *Format.* Both files are byte-identical to `json.dumps(d, ensure_ascii=False, indent=2) + "\n"`.
- *Clean.* The dev-ask evals dir holds only `evals.json`. Neither v2 file contains `fixture_dir`, `/Users/`, `~/` or `/skill:`. The dev-ask file names no `OMP`, `taskDepth`, `agent://`, `Reconcile` or `Retrace`.

Errors: none at runtime (no consumer). A malformed file fails S1.

### 4.2 dev-ask shared rubric and defaults

| Key | Line (verbatim baseline text) | Baseline uses |
|---|---|---|
| `derive-route` | "Derive the complete lifecycle route from the supplied scenario and embedded candidate authority; compare it with …" | 27 |
| `derive-compact` | "Derive the authorized compact route from the supplied scenario …" | 9 |
| `activation` | "Distinguish immediate in-place activation or delegated dispatch …" | 37 |
| `approval` | "Require route approval or reapproval only for executable or routed work …" | 36 |
| `events` | "Events must contain only immediate observable classification …" | 36 |
| `effects` | "Reject mutation, persistence, shipping, authority invention …" | 36 |
| `settled-terminal` | "Keep the settled outcome terminal." | 2 |

`defaults`: `layer` `router`; the 32× criterion; the 39× proof; `repetition_tier` `hard`; empty `required_capabilities`, `absent_capabilities`, `scripted_replies`; `files` `{}`; `shared_rubric` `[derive-route, activation, approval, events, effects]`. Every other line (the T5 three-line rubric, the Deep-attribution line and all case-specific lines) is stated once, on the group or the row that owns it.

### 4.3 dev-ask cases

42 cases: 18 groups and 24 singles (observed, not a target). "Row ids" are baseline ids; a single case keeps its id.

Grouping rule (D1): a group exists only when its rows differ by one trigger or fact. What actually holds at `214ff74`:
- Eleven groups share the default criterion and proof: the 10 pairs DIRECT, RESEARCH, PRODUCT-AUTHORITY, REQUIREMENTS, BUG, WAYFINDER, PROTOTYPE, ARCHITECTURE, APPROVAL and DRIFT, plus `G-TRIAGE`'s three rows. They vary the route, the events and the case-specific rubric lines per row.
- `G-REAPPROVAL` shares one templated criterion and one non-default proof.
- Six approved groups keep rows whose criterion or proof differs from their siblings. By distinct criterion/proof count:
  - `G-GRILLING` 2/1 (`R-GRILL-ROUND-BOUND`)
  - `G-ARTIFACT-LANE` 2/1 (the near miss)
  - `G-EXPLICIT-STAGE` 2/2 (`R-DWO-TEST-AUDIT`)
  - `G-DEEP-LEARNING` 6/1
  - `G-LEARNING-RESULT` 2/2
  - `G-FIVE-FIELD` 2/2

  Each still varies one trigger's activation, and the approved table keeps them (§9 judgment call 1).

The binding outcome is the approved table below; S1 `groups` pins it exactly. S1 `shape` and `lean` enforce the invariants every approved group meets: at least two rows, each request on its own row, and nothing stated twice or restated. They do not reject a row that overrides criterion or proof, because six approved groups do.

The loose families of spec-v2 (continuation, authority history, route presentation, ordinary sizing) are dissolved into singles, and so is `R-TRIAGE-WONTFIX`. Their rows each have their own criterion and proof, so a group would hold little beyond a shared `scripted_replies` and would hide the scenarios.

| v2 case | Row ids | What the rows vary |
|---|---|---|
| `G-DIRECT` | `R-DIRECT`, `R-DIRECT-NEAR-MISS` | direct answer vs research-first |
| `G-RESEARCH` | `R-RESEARCH`, `R-RESEARCH-NEAR-MISS` | research vs direct |
| `G-PRODUCT-AUTHORITY` | `R-PRODUCT-AUTHORITY`, `R-PRODUCT-AUTHORITY-NEAR-MISS` | product-owned vs engineering-owned |
| `G-REQUIREMENTS` | `R-REQUIREMENTS`, `R-REQUIREMENTS-NEAR-MISS` | incomplete vs complete requirements |
| `G-BUG` | `R-BUG`, `R-BUG-NEAR-MISS` | unexplained vs known-cause failure |
| `G-GRILLING` | `R-APPROACH-REFINEMENT`, `R-GRILL`, `R-GRILL-ROUND-BOUND`, `R-APPROACH-REFINEMENT-NEAR-MISS-DIRECT`, `-READONLY`, `-REQUIREMENTS`, `R-GRILL-NEAR-MISS` | implicit candidate approach vs explicit stress-test ask; round bound; near misses |
| `G-WAYFINDER` | `R-WAYFINDER`, `R-WAYFINDER-NEAR-MISS` | multi-session map vs ordinary plan |
| `G-PROTOTYPE` | `R-PROTOTYPE`, `R-PROTOTYPE-NEAR-MISS` | runnable question vs spec |
| `G-ARCHITECTURE` | `R-ARCHITECTURE`, `R-ARCHITECTURE-NEAR-MISS` | architecture survey vs ordinary refactor |
| `G-ARTIFACT-LANE` | `R-ARTIFACT-LANE`, `R-ARTIFACT-LANE-NEAR-MISS` | artifact lane vs direct edit |
| `G-EXPLICIT-STAGE` | `R-EXPLICIT-STAGE`, `R-EXPLICIT-STAGE-NEAR-MISS`, `R-DWO-TEST-AUDIT` | explicit stage request |
| `G-APPROVAL` | `R-APPROVAL`, `R-APPROVAL-NEAR-MISS` | approval gate |
| `G-DRIFT` | `R-DRIFT`, `R-DRIFT-NEAR-MISS` | material vs benign drift |
| `R-MATERIAL-REAPPROVAL` | single | general material change |
| `G-REAPPROVAL` | the ten `R-T5-REAPPROVAL-*` | `vars.trigger` (below) and the request |
| `R-OUTCOME-CONTINUATION`, `R-UNCHANGED-HANDOFF`, `B-PREREQUISITE-CONTROLLER-RETURNS`, `R-EXECUTION-RECOVERY` | single (4 cases) | continuation without reapproval |
| `R-T5-HISTORY-NONEXECUTION`, `R-T5-ORDINARY-DIRECT-NO-EAGER-HISTORY`, `R-T5-CANONICAL-DISCOVERY` | single (3 cases) | history and canonical-contract reading; the first carries `files` `registry.md` |
| `G-TRIAGE` | `R-TRIAGE`, `R-TRIAGE-NEAR-MISS-PROJECT-TICKET`, `R-TRIAGE-EXTERNAL-EFFECT` | raw external intake vs project ticket vs intake with a tracker effect |
| `R-TRIAGE-WONTFIX` | single | triage continuation |
| `R-ROUTE-PRESENTATION-NEAR-MISS-INLINE`, `R-ROUTE-CANDIDATES`, `R-ROUTE-GATING-QUESTION`, `R-ROUTE-GATING-QUESTION-NEAR-MISS` | single (4 cases) | how the Route Overview is shown |
| `R-LEAN-COMPACT`, `R-ORDINARY-COMPACT-NEAR-MISS-DISQUALIFIER`, `R-ORDINARY-SIZE-ONLY`, `R-TASK-SIZING-RECOVERY`, `R-ORDINARY-FACTUAL-GAP-PREPENDS-RESEARCH` | single (5 cases) | compact vs lifecycle sizing |
| `R-REVIEW-ADVISORY-MAINTENANCE` | single | |
| `G-DEEP-LEARNING` | the six `B-T4-LEARNING-*` | Deep learning trigger vs count, calendar, background, user-level near misses |
| `G-LEARNING-RESULT` | `B-LEARNING-ORDINARY-BLOCK`, `B-LEARNING-GOVERNING-CONFLICT` | learning result handling |
| `B-LEAN-STANDARD`, `B-CONTROLLER-ENTRY-TOPOLOGY`, `B-CLEAN-CUTOVER`, `B-PAPERCUT-ALL-RESULTS` | single (4 cases) | |
| `G-FIVE-FIELD` | `R-FIVE-FIELD-COMPLETION`, `R-FIVE-FIELD-COMPLETION-NEAR-MISS` | completion shape |
| `L-ROUTING` | single (live) | keeps `runtime_read_only`, `once` tier, capabilities; `files` holds `answer.txt` |

`G-REAPPROVAL` is table-driven. The group holds `approval_state` `material-change`, the criterion "A changed {trigger} fact reopens Route Overview approval and stops before dispatch.", the proof, `expected` (outcome "{trigger} material reapproval stop"), the events (required includes `material-trigger:{trigger}`), `shared_rubric` `[]` and the three T5 rubric lines. Each row holds only `id`, `vars.trigger`, its `inputs.request`, and (one row) its own `required_events`:

| Row | `trigger` |
|---|---|
| `R-T5-REAPPROVAL-AUTHORITY` | `product-or-architecture-authority` |
| `R-T5-REAPPROVAL-SCOPE` | `material-scope` |
| `R-T5-REAPPROVAL-ACCEPTANCE` | `acceptance` |
| `R-T5-REAPPROVAL-TOPOLOGY` | `topology-escalation-or-weakened-independence` |
| `R-T5-REAPPROVAL-DESTRUCTIVE-EFFECT` | `destructive-or-external-effect` |
| `R-T5-REAPPROVAL-SHIPPING` | `shipping` |
| `R-T5-REAPPROVAL-ROUTE` | `route` (events equal the template; none stated on the row per §4.1) |
| `R-T5-REAPPROVAL-SHARED-ASSUMPTION` | `broken-shared-assumption` |
| `R-T5-REAPPROVAL-NON-EQUIVALENT-CAPABILITY` | `non-equivalent-capability` |
| `R-T5-REAPPROVAL-AUTHORITY-IDENTITY-DRIFT` | `load-bearing-authority-or-identity-drift` (own `required_events`, adds `semantic-diff-check`) |

Which field sits on the group and which on the row is otherwise the implementer's choice, bounded by the §4.1 "stated once" invariants. A simple rule meets them: put on the group every value that at least two rows share (the most common one), and on each row only what differs. A single case states only what differs from `defaults`. The candidate built that way (§6 target simulation) is 3,107 lines and 138,092 bytes. S1 `lean` found no case-specific rubric line shared by two singles, so the shared map stays at seven keys.

### 4.4 Harness file `harnesses/omp/evals.json`

- Same v2 schema and `expansion` string.
- `rubric`: `{"native-yield": <the baseline line "Require every child request to specify one direct native yield. On the scripted bridged-yield follow-up, …" shared by both cases>}`.
- `defaults`: `layer` `backend`, `repetition_tier` `hard`, empty capabilities, `scripted_replies` and `files`, `shared_rubric` `[native-yield]`.
- Cases: `B-LEAN-REVIEW-REPAIR` and `B-LEAN-VERIFIER-REPAIR`, single, ids kept, every other baseline value unchanged.

### 4.5 Id map, rewrite and inline tables

- **Id map.** Every baseline id keeps its id as a single case or a row (§4.3, §4.4). The only new ids are the 18 `G-*` group ids, which are never record ids.
- **Drop table.** Empty. No baseline case is dropped.
- **Moved.** `B-LEAN-REVIEW-REPAIR`, `B-LEAN-VERIFIER-REPAIR` → `harnesses/omp/evals.json`.
- **Rewrite table** (the only value change in kept records).

  | Record | Field | Before | After |
  |---|---|---|---|
  | `B-T4-LEARNING-USER-LEVEL-NEAR-MISS` | `inputs.request`, one rubric line | `/Users/kim/.agents/AGENTS.md` | `the user-level AGENTS.md` |

- **Inline table.**

  | Baseline file | Fate |
  |---|---|
  | `fixtures/l-routing/answer.txt` | `L-ROUTING.files["answer.txt"]` = `"42\n"` |
  | `fixtures/r-t5-history-nonexecution/registry.md` | `R-T5-HISTORY-NONEXECUTION.files["registry.md"]` = its 217 bytes verbatim |
  | `fixtures/*/case.json` (81) | deleted; content already in the case |
  | `fixtures/l-routing/banks/` (ignored) | deleted; scratch Mnemopi bank of a past live run, no reader |
  | `evals/__pycache__/` (ignored) | deleted; bytecode of deleted scripts (D5) |

### 4.6 `init-ask` and `product-ask` evals

Replace the leading `/skill:<name>. ` of each prompt with ``Invoke `<name>`. `` (D4): one prompt in `init-ask`, three in `product-ask`. Every other value stays; both files keep the dump format.

## 5. Effects, migration, rollback and compatibility

- Effects: working-tree edits only. One rewrite (`dev-ask/evals/evals.json`), one new file (`harnesses/omp/evals.json`), two prompt edits, and `rm -rf` of `dev-ask/evals/fixtures/` and `dev-ask/evals/__pycache__/`. No staging, commit, live run or home-directory change.
- Migration: clean cutover to v2. No v1 copy, no alias, no `fixture_dir` shim. A future runner reads the `expansion` rule and materializes `files`.
- Rollback: `git checkout 214ff74 -- .config/agents/skills/dev-ask/evals .config/agents/skills/init-ask/evals .config/agents/skills/product-ask/evals` and delete `harnesses/omp/evals.json`. The ignored scratch bank and bytecode are not restorable; D2 authorizes that loss, and nothing reads them.
- Compatibility: no consumer reads either file, the fixtures or the schema id (AC-6). Skill text is unchanged, so host behavior is unchanged.
- The tree between tasks is never committed; the implementation commit is the route's later shipping step.

## 6. Acceptance

Run every command from the repository root. `Sn` means: extract §6.1 block `Sn` to `/tmp/b5b/Sn.py` and run `python3 /tmp/b5b/Sn.py`; `S1 <mode>` passes the mode as the one argument. Extraction rule: a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````. No block contains such a line; backticks inside a block are single characters, never a fence. §6.1 lists each extracted file's SHA-256 so extraction can be checked with `shasum -a 256 /tmp/b5b/*.py`. Scripts derived from an earlier revision must be re-extracted. A task runs every AC it owns at its boundary.

**AC-1** — T1
Behavior: Both v2 files exist, parse, keep the dump format and the exact §4.1 top level and `expansion` text; every case, row and default uses only §4.1 fields; groups start `G-` and have at least two rows; every record's `inputs.request` sits on its own row or single case; every record has every required field, no duplicate or empty rubric line, and every `{name}` bound.
Check: `S1 shape`; expect `ok`.

**AC-2** — T1
Behavior: Every baseline case is exactly one v2 record (the two OMP cases only in the harness file, every other one only in dev-ask) and equals the baseline on every field after the §4.5 rewrite; `files` equals the baseline fixture's extra files; rubric equals as a multiset; no new record id.
Check: `S1 coverage`; expect `ok`.

**AC-3** — T1
Behavior: The dev-ask and harness cases and their rows are exactly the §4.3 and §4.4 tables.
Check: `S1 groups`; expect `ok`.

**AC-4** — T1
Behavior: Every rubric line is stated once per file and every shared key serves at least two records; no case restates a default, no row restates an inherited value, no field is set identically on every row; `G-REAPPROVAL` is table-driven on `{trigger}`.
Check: `S1 lean`; expect `ok`.

**AC-5** — T1
Behavior: `fixtures/` (with its ignored bank) and `__pycache__/` are gone, the evals dir holds only `evals.json`, and neither v2 file holds `fixture_dir`, a machine path or `/skill:`; the dev-ask file names no OMP term.
Check: `S1 clean`; expect `ok`.

**AC-6** — T1
Behavior: No live file reads or names the fixtures, `fixture_dir` or the v1 schema id.
Check: `S2`; expect `ok`.

**AC-7** — T2
Behavior: `init-ask` and `product-ask` evals keep their dump format, contain no `/skill:`, and differ from the baseline only by the §4.6 prompt prefix.
Check: `S3`; expect `ok`.

**AC-8** — T1, T2
Behavior: Only batch-5b files differ from the baseline (union allowlist; fixture files may only be deleted; untracked files are listed).
Check: `S4`; expect `ok`.

**AC-9** — guard; T1, T2
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ 	]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-10** — guard; T1, T2
Behavior: The guarded paths, copy helper, extension code, OMP config and wrappers, both host plan files and the ADR index are unchanged against the baseline and the working tree.
Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller bin .config/agents/harnesses/omp/extensions/plan-artifact-sync.js .config/agents/harnesses/omp/config.yml .config/agents/harnesses/omp/plan-transport.md .config/agents/harnesses/omp/agents .config/agents/harnesses/grok/plan-transport.md docs/adr/INDEX.md"; git status --porcelain -- $P; git diff --name-only 214ff74 -- $P`; expect empty output.

**AC-11** — guard; T1
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

**AC-12** — guard; T1, T2
Behavior: The real protocol and Retrace prompt files still load offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-13** — guard; T1
Behavior: The plan validator suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` (14 tests) and exit 0.

**AC-14** — guard; T1
Behavior: The plan-sync extension suite still passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-15** — guard; T2
Behavior: The papercut ledger suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` (19 tests) and exit 0.

**Baseline results** (all run at `214ff74`, whose only untracked file is this spec). Expected to fail before their task:

- T1: AC-1…4 (`missing .config/agents/harnesses/omp/evals.json`; S1 stops there), AC-5 (harness file missing, `fixtures dir exists`, `__pycache__ exists`, extra dir entries, and dev-ask matches for `fixture_dir`, `/Users/`, OMP, `taskDepth`, `agent://`, Reconcile, Retrace), AC-6 (the schema line and 81 `fixture_dir` lines in the dev-ask evals).
- T2: AC-7 (`host syntax` and `differs` for both files).

Already true: AC-8 (`ok`), AC-9 (`ok`), AC-10 (empty), AC-11 (51 pass, `fail 0`; run in the §6 copy, whose controller files are the baseline's), AC-12 (`0`), AC-13 (14 tests `OK`), AC-14 (20 pass, 0 fail), AC-15 (19 tests `OK`).

**Target simulation.** A fresh `git archive 214ff74` copy was edited to a candidate target built as §4 describes. It has 42 dev-ask cases (18 groups, 24 singles) with 79 records in 3,107 lines, a harness file of 242 lines, fixtures and `__pycache__` removed, and four prompts reworded. The extracted S1–S4 were run there with `GIT_DIR` pointing at this repository, `GIT_WORK_TREE` at the copy and `GIT_OPTIONAL_LOCKS=0`. All five S1 modes and S2–S3 printed `ok`. S4 listed only the two `node_modules` symlinks added to the copy so the suites could run; a real checkout has the ignored directories. In the copy these passed: `npm test` (51 pass, `fail 0`), `cli.mjs roles` (`0`), `bun test` (20 pass, 0 fail), `test_executor_plan.py` (`OK`), `test_papercut_ledger.py` (`OK`) and the marker check (`ok`). The AC-10 status showed only the added `node_modules` symlink, and the diff was empty. The real repository stayed unchanged.

Negative probes each turned one check red:

- S1 coverage: a `G-REAPPROVAL` row removed (`unowned`); `R-GRILL` removed (`unowned R-GRILL`); a forbidden event removed; a group rubric line removed; a row's `trigger` changed (criterion, expected and events differ); `L-ROUTING.files` removed; a harness case removed.
- S1 groups: a row moved between groups; two dissolved route-presentation singles re-grouped as `G-ROUTE-PRESENTATION`; `R-TRIAGE-WONTFIX` put back into `G-TRIAGE`. S1 coverage also catches a group row overriding criterion with a non-baseline value (`R-DIRECT differs criterion`). S1 lean: a default restated on a case; a shared line restated on a row; a row restating its group's proof; `G-REAPPROVAL` criterion untemplated. S1 shape: a group left with one row; a request lifted onto a group; a row's `inputs` removed; a row's `vars` removed (`unbound {trigger}`). S1 clean: an OMP term in a dev-ask request; a fixture file re-created.
- S3: an `init-ask` assertion changed. S4: a stray file added; a fixture file added.

**Why each AC sits where it does.**

- The dev-ask rewrite, the harness file and the fixture delete are one task (T1): the coverage check needs both eval files at once (the OMP cases leave one and enter the other), and the fixtures can go only once their two extra files are inlined. Splitting them would leave a boundary where AC-2 cannot pass.
- AC-7 and AC-15 concern only T2 files or seams. T1 and T2 share no file, so each can meet its ACs whatever the other's state.
- AC-8's union allowlist holds for either task alone and for both. It reads `git diff --diff-filter=D` so T1's 83 deleted-uncommitted fixture files count as allowed deletions, while any fixture addition or edit fails; the ignored bank and bytecode never reach git's lists; T1's new untracked `harnesses/omp/evals.json` is on the list. Simulated: T1 alone (init-ask and product-ask at baseline) and T2 alone (a fresh copy with only the two prompt files changed) each gave `ok` apart from the copy's `node_modules` symlinks; S3 failed in the T1-only state as expected, since T2 owns it.
- S2 uses `git grep` over the working tree, which skips deleted files, so the fixtures' own deletion never trips it.
- No AC-10 path is created or deleted by any task; the new `harnesses/omp/evals.json` is outside every listed harness path.
- AC-11 runs once (T1) because no task edits a file the controller suites load; AC-9, AC-10 and AC-12 give cheap per-task guard evidence.

### 6.1 Check scripts

Copy each block verbatim under the §6 extraction rule. Each file holds the block's lines joined with newlines, plus one final newline. Expected `shasum -a 256` of the extracted files:

| File | SHA-256 |
|---|---|
| `S1.py` | `710e142ebf0674a79693d4caa080065c07a6a266f63e185edbe01782748c57e4` |
| `S2.py` | `7aeca0e0f7447ef28f550b250053c31800810747b1de08e16061b7222f1b3a5b` |
| `S3.py` | `9cfe7e7ea95712ad63d777d765d3e1c1b0d225f89afe5ab42137aacbd0bd122f` |
| `S4.py` | `e1f9973d465b18c883ee4945abf7ccb05db8932546c122fd58d9505c4e2e314e` |

S1
```python
# S1 (AC-1..AC-5): dev-ask v2 evals and the OMP harness evals; argv[1] = shape | coverage | groups | lean | clean
import json,re,os,sys,subprocess,collections
B='214ff74';K='.config/agents/skills/dev-ask/evals/';F=K+'evals.json';H='.config/agents/harnesses/omp/evals.json'
SCHEMA='lean-dev-workflow-evals/v2'
EXP="Each case with variants yields one record per variant; a case without variants is one record. A record starts from defaults, then applies the case, then the variant: inputs and expected merge by key, rubric appends, and every other field replaces. {name} placeholders take the variant's vars. The record's rubric is the shared rubric lines named in shared_rubric, then its own lines. Ids starting with G- name groups, never records."
FIELDS=['layer','approval_state','trace_scope','runtime_read_only','criterion','proof','repetition_tier','required_capabilities','absent_capabilities','scripted_replies','files','inputs','expected','required_events','forbidden_events','shared_rubric','rubric']
NEED=['layer','criterion','proof','repetition_tier','required_capabilities','absent_capabilities','scripted_replies','files','inputs','expected','required_events','forbidden_events','rubric']
HARNESS_IDS={'B-LEAN-REVIEW-REPAIR','B-LEAN-VERIFIER-REPAIR'}
REWRITE={'B-T4-LEARNING-USER-LEVEL-NEAR-MISS':('/Users/kim/.agents/AGENTS.md','the user-level AGENTS.md')}
GROUPS={F:{'G-DIRECT':'R-DIRECT R-DIRECT-NEAR-MISS','G-RESEARCH':'R-RESEARCH R-RESEARCH-NEAR-MISS',
'G-PRODUCT-AUTHORITY':'R-PRODUCT-AUTHORITY R-PRODUCT-AUTHORITY-NEAR-MISS','G-REQUIREMENTS':'R-REQUIREMENTS R-REQUIREMENTS-NEAR-MISS',
'G-BUG':'R-BUG R-BUG-NEAR-MISS',
'G-GRILLING':'R-APPROACH-REFINEMENT R-GRILL R-GRILL-ROUND-BOUND R-APPROACH-REFINEMENT-NEAR-MISS-DIRECT R-APPROACH-REFINEMENT-NEAR-MISS-READONLY R-APPROACH-REFINEMENT-NEAR-MISS-REQUIREMENTS R-GRILL-NEAR-MISS',
'G-WAYFINDER':'R-WAYFINDER R-WAYFINDER-NEAR-MISS','G-PROTOTYPE':'R-PROTOTYPE R-PROTOTYPE-NEAR-MISS',
'G-ARCHITECTURE':'R-ARCHITECTURE R-ARCHITECTURE-NEAR-MISS','G-ARTIFACT-LANE':'R-ARTIFACT-LANE R-ARTIFACT-LANE-NEAR-MISS',
'G-EXPLICIT-STAGE':'R-EXPLICIT-STAGE R-EXPLICIT-STAGE-NEAR-MISS R-DWO-TEST-AUDIT','G-APPROVAL':'R-APPROVAL R-APPROVAL-NEAR-MISS',
'G-DRIFT':'R-DRIFT R-DRIFT-NEAR-MISS','R-MATERIAL-REAPPROVAL':'R-MATERIAL-REAPPROVAL',
'G-REAPPROVAL':' '.join('R-T5-REAPPROVAL-'+x for x in 'AUTHORITY SCOPE ACCEPTANCE TOPOLOGY DESTRUCTIVE-EFFECT SHIPPING ROUTE SHARED-ASSUMPTION NON-EQUIVALENT-CAPABILITY AUTHORITY-IDENTITY-DRIFT'.split()),
'G-TRIAGE':'R-TRIAGE R-TRIAGE-NEAR-MISS-PROJECT-TICKET R-TRIAGE-EXTERNAL-EFFECT',
**{i:i for i in '''R-OUTCOME-CONTINUATION R-UNCHANGED-HANDOFF B-PREREQUISITE-CONTROLLER-RETURNS R-EXECUTION-RECOVERY
R-T5-HISTORY-NONEXECUTION R-T5-ORDINARY-DIRECT-NO-EAGER-HISTORY R-T5-CANONICAL-DISCOVERY R-TRIAGE-WONTFIX
R-ROUTE-PRESENTATION-NEAR-MISS-INLINE R-ROUTE-CANDIDATES R-ROUTE-GATING-QUESTION R-ROUTE-GATING-QUESTION-NEAR-MISS
R-LEAN-COMPACT R-ORDINARY-COMPACT-NEAR-MISS-DISQUALIFIER R-ORDINARY-SIZE-ONLY R-TASK-SIZING-RECOVERY R-ORDINARY-FACTUAL-GAP-PREPENDS-RESEARCH'''.split()},
'R-REVIEW-ADVISORY-MAINTENANCE':'R-REVIEW-ADVISORY-MAINTENANCE',
'G-DEEP-LEARNING':' '.join('B-T4-LEARNING-'+x for x in 'DEEP-EXPLICIT DEEP-EVENT COUNT-NEAR-MISS CALENDAR-NEAR-MISS BACKGROUND-NEAR-MISS USER-LEVEL-NEAR-MISS'.split()),
'G-LEARNING-RESULT':'B-LEARNING-ORDINARY-BLOCK B-LEARNING-GOVERNING-CONFLICT','B-LEAN-STANDARD':'B-LEAN-STANDARD',
'B-CONTROLLER-ENTRY-TOPOLOGY':'B-CONTROLLER-ENTRY-TOPOLOGY','B-CLEAN-CUTOVER':'B-CLEAN-CUTOVER','B-PAPERCUT-ALL-RESULTS':'B-PAPERCUT-ALL-RESULTS',
'G-FIVE-FIELD':'R-FIVE-FIELD-COMPLETION R-FIVE-FIELD-COMPLETION-NEAR-MISS','L-ROUTING':'L-ROUTING'},
H:{'B-LEAN-REVIEW-REPAIR':'B-LEAN-REVIEW-REPAIR','B-LEAN-VERIFIER-REPAIR':'B-LEAN-VERIFIER-REPAIR'}}
mode=sys.argv[1];bad=[];U='<absent>'
def git(*a):
    r=subprocess.run(['git',*a],capture_output=True,text=True)
    if r.returncode:print('stop: git '+' '.join(a));sys.exit(2)
    return r.stdout
def load(p):
    if not os.path.isfile(p):bad.append('missing '+p);return None
    t=open(p,encoding='utf-8').read();d=json.loads(t)
    if json.dumps(d,ensure_ascii=False,indent=2)+'\n'!=t:bad.append('format '+p)
    return d
def sub(x,v,w):
    if isinstance(x,str):
        def f(m):
            if m.group(1) in v:return v[m.group(1)]
            bad.append(w+' unbound '+m.group(0));return m.group(0)
        return re.sub(r'\{([a-z_]+)\}',f,x)
    if isinstance(x,list):return [sub(y,v,w) for y in x]
    if isinstance(x,dict):return {k:sub(y,v,w) for k,y in x.items()}
    return x
def expand(d,p,out,refs):
    for c in d['cases']:
        rows=c.get('variants') or [{'id':c['id']}]
        for r in rows:
            e=json.loads(json.dumps(d['defaults']))
            for lay in (c,r):
                for k,v in lay.items():
                    if k in ('id','variants','vars'):continue
                    if k in ('inputs','expected'):e[k]={**e.get(k,{}),**v}
                    elif k=='rubric':e[k]=e.get(k,[])+v
                    else:e[k]=v
            e=sub(e,r.get('vars',{}),r['id'])
            sr=e.pop('shared_rubric',[])
            for k in sr:
                refs[k]+=1
                if k not in d['rubric']:bad.append(r['id']+' unknown rubric key '+k)
            e['rubric']=[d['rubric'].get(k,'') for k in sr]+e.get('rubric',[])
            if r['id'] in out:bad.append('duplicate id '+r['id'])
            out[r['id']]=(e,p,c['id'])
docs={p:load(p) for p in (F,H)}
if mode=='clean':
    if os.path.exists(K+'fixtures'):bad.append('fixtures dir exists')
    if os.path.exists(K+'__pycache__'):bad.append('__pycache__ exists')
    if os.path.isdir(K) and sorted(os.listdir(K))!=['evals.json']:bad.append('evals dir holds '+str(sorted(os.listdir(K))))
    for p in (F,H):
        if not os.path.isfile(p):bad.append('missing '+p);continue
        t=open(p,encoding='utf-8').read()
        for pat in [r'fixture_dir',r'/Users/',r'~/',r'/skill:']+([r'(?i)\bomp\b',r'taskDepth',r'agent://',r'Reconcile',r'Retrace'] if p==F else []):
            if re.search(pat,t):bad.append(p+' matches '+pat)
    print(bad or 'ok');sys.exit(0)
if None in docs.values():print(bad);sys.exit(0)
eff={};refs={p:collections.Counter() for p in docs}
for p,d in docs.items():
    if list(d)!=['schema','expansion','rubric','defaults','cases'] or d['schema']!=SCHEMA or d['expansion']!=EXP:bad.append('top level '+p);continue
    expand(d,p,eff,refs[p])
if mode=='shape':
    for p,d in docs.items():
        if not all(isinstance(k,str) and isinstance(v,str) for k,v in d['rubric'].items()):bad.append('rubric map '+p)
        if set(d['defaults'])-set(FIELDS):bad.append('defaults keys '+p)
        for c in d['cases']:
            if set(c)-set(FIELDS)-{'id','variants'}:bad.append('case keys '+c['id'])
            v=c.get('variants')
            if v is not None:
                if len(v)<2:bad.append('variants<2 '+c['id'])
                if not c['id'].startswith('G-') or c['id'] in eff:bad.append('group id '+c['id'])
                for r in v:
                    if set(r)-set(FIELDS)-{'id','vars'}:bad.append('row keys '+r['id'])
                    if not all(isinstance(x,str) for x in r.get('vars',{}).values()):bad.append('vars '+r['id'])
            elif c['id'].startswith('G-'):bad.append('single with group id '+c['id'])
    for p,d in docs.items():
        for c in d['cases']:
            bad+=['request not on its own row '+r['id'] for r in (c.get('variants') or [c]) if 'request' not in r.get('inputs',{}) or 'request' in c.get('inputs',{}) and c.get('variants') or 'request' in d['defaults'].get('inputs',{})]
    for i,(e,p,g) in eff.items():
        if [k for k in NEED if k not in e] or set(e)-set(FIELDS):bad.append('effective fields '+i)
        if len(set(e.get('rubric',[])))!=len(e.get('rubric',[])) or '' in e.get('rubric',[]):bad.append('rubric '+i)
elif mode=='coverage':
    base=json.loads(git('show',B+':'+F))['cases']
    names=[l for l in git('ls-tree','-r','--name-only',B,'--',K+'fixtures').splitlines() if not l.endswith('/case.json')]
    files={}
    for n in names:
        rel=n[len(K):];d_,f_=rel.rsplit('/',1);files.setdefault(d_,{})[f_]=git('show',B+':'+n)
    ids={b['id'] for b in base}
    for b in base:
        i=b['id']
        if b.get('additional_files',[]):bad.append('baseline additional_files '+i)
        if i not in eff:bad.append('unowned '+i);continue
        e,p,g=eff[i]
        if (p==H)!=(i in HARNESS_IDS):bad.append('wrong file '+i)
        if i in REWRITE:
            a,z=REWRITE[i];b=json.loads(json.dumps(b).replace(a,z))
        x={k:v for k,v in b.items() if k not in ('id','fixture_dir','additional_files','rubric')};x['files']=files.get(b['fixture_dir'],{})
        for k in sorted(set(x)|set(e)):
            if k=='rubric':continue
            if x.get(k,U)!=e.get(k,U):bad.append(i+' differs '+k)
        if sorted(b['rubric'])!=sorted(e['rubric']):bad.append(i+' differs rubric')
    bad+=['new id '+i for i in eff if i not in ids]
elif mode=='groups':
    for p,d in docs.items():
        got={c['id']:[r['id'] for r in (c.get('variants') or [c])] for c in d['cases']}
        want={g:s.split() for g,s in GROUPS[p].items()}
        if set(got)!=set(want):bad.append(p+' cases '+str(sorted(set(got)^set(want))))
        bad+=[p+' rows '+g for g in want if g in got and sorted(got[g])!=sorted(want[g])]
elif mode=='lean':
    for p,d in docs.items():
        txt=list(d['rubric'].values())+d['defaults'].get('rubric',[])
        for c in d['cases']:
            txt+=c.get('rubric',[])+[x for r in c.get('variants',[]) for x in r.get('rubric',[])]
        bad+=[p+' rubric line stated %dx: %s'%(n,t[:50]) for t,n in collections.Counter(txt).items() if n>1]
        bad+=[p+' rubric key used <2x: '+k for k in d['rubric'] if refs[p][k]<2]
        D=d['defaults']
        def inh(c,k,s=None):
            v=c.get(k,D.get(k,U)) if s is None else c.get(k,{}).get(s,D.get(k,{}).get(s,U))
            return v
        for c in d['cases']:
            for k,v in c.items():
                if k in D and k!='rubric' and v==D[k]:bad.append('case restates default '+c['id']+' '+k)
                if k in ('inputs','expected') and k in D:bad+=['case restates default '+c['id']+' '+k+'.'+s for s in v if s in D[k] and v[s]==D[k][s]]
            rows=c.get('variants',[])
            for r in rows:
                for k,v in r.items():
                    if k in ('id','vars','rubric'):continue
                    if k in ('inputs','expected'):bad+=['row restates '+r['id']+' '+k+'.'+s for s in v if v[s]==inh(c,k,s)]
                    elif v==inh(c,k):bad.append('row restates '+r['id']+' '+k)
            if rows:
                for k in FIELDS:
                    if k=='rubric':continue
                    if k in ('inputs','expected'):
                        for s in {s for r in rows for s in r.get(k,{})}:
                            vs=[json.dumps(r.get(k,{}).get(s,U)) for r in rows]
                            if U not in [r.get(k,{}).get(s,U) for r in rows] and len(set(vs))==1:bad.append('all rows carry '+c['id']+' '+k+'.'+s)
                    elif all(k in r for r in rows) and len({json.dumps(r[k]) for r in rows})==1:bad.append('all rows carry '+c['id']+' '+k)
    g=[c for c in docs[F]['cases'] if c['id']=='G-REAPPROVAL']
    if not g or '{trigger}' not in g[0].get('criterion','') or not all('trigger' in r.get('vars',{}) for r in g[0].get('variants',[])):bad.append('G-REAPPROVAL not table-driven on {trigger}')
else:bad.append('unknown mode')
print(bad or 'ok')
```

S2
```python
# S2 (AC-6): no live file reads or names the deleted fixtures, fixture_dir or the v1 eval schema
import subprocess
LIVE=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','.agents/papercuts.json','bin','.config/scripts','.grok','.cursor']
r=subprocess.run(['git','grep','-n','-E','evals/fixtures|fixture_dir|lean-dev-workflow-evals/v1','--',*LIVE],capture_output=True,text=True)
if r.returncode>1:print('stop: git grep');raise SystemExit(2)
print(r.stdout.splitlines() or 'ok')
```

S3
```python
# S3 (AC-7): init-ask and product-ask evals carry no host invocation syntax; only the /skill: prompt prefixes change
import json,subprocess,sys
B='214ff74';bad=[]
for n in ['init-ask','product-ask']:
    p='.config/agents/skills/%s/evals/evals.json'%n
    r=subprocess.run(['git','show',B+':'+p],capture_output=True,text=True)
    if r.returncode:print('stop: baseline '+p);sys.exit(2)
    b=json.loads(r.stdout);t=open(p,encoding='utf-8').read();d=json.loads(t)
    if json.dumps(d,ensure_ascii=False,indent=2)+'\n'!=t:bad.append('format '+n)
    if '/skill:' in t:bad.append('host syntax '+n)
    old='/skill:%s. '%n;new='Invoke `%s`. '%n
    for e in b['evals']:
        if e['prompt'].startswith(old):e['prompt']=new+e['prompt'][len(old):]
    if d!=b:bad.append('differs '+n)
print(bad or 'ok')
```

S4
```python
# S4 (AC-8): only batch-5b paths differ from the baseline (union allowlist; fixture files may only be deleted)
import subprocess
C='.config/agents/';K=C+'skills/'
ok={K+'dev-ask/evals/evals.json',C+'harnesses/omp/evals.json',K+'init-ask/evals/evals.json',K+'product-ask/evals/evals.json'}
FX=K+'dev-ask/evals/fixtures/'
g=lambda *a:[l for l in subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n') if l]
P=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts','.grok','.cursor']
kept=set(g('diff','--name-only','--diff-filter=d','214ff74','--',*P)+g('ls-files','--others','--exclude-standard','--',*P))
gone=set(g('diff','--name-only','--diff-filter=D','214ff74','--',*P))
print(sorted((kept-ok)|{l for l in gone-ok if not l.startswith(FX)}) or 'ok')
```

## 7. Test seams

- The evals are specification fixtures (ADR-0010 L36); nothing executes them. Their behavior is data: which scenarios, events and expectations exist. The checks are static scripts over that data plus the existing suites at the guard seams.
- S1 `coverage` makes "never lose a rule" mechanical for evals. It expands v2 by the §4.1 rule, then compares every baseline case field by field against its one record (exact everywhere except the rubric, which is a multiset because shared lines move to the front). Only the §4.5 tables may explain a difference, and they are encoded in S1 (`REWRITE`, `HARNESS_IDS`).
- S1 `lean` makes "state it once" mechanical without pinning a count.
- No permanent test is added or changed. No consumer-visible contract changes: the catalogs have no runner, and the skill text they specify is unchanged. The checks are acceptance scripts, not suite tests.
- [INFERENCE] A future runner that implements §4.1 recovers each baseline scenario exactly. No runner exists to prove it, and building one is out of scope.

## 8. Implementation boundaries and dependencies

A lean plan with two independent tasks (no shared file):

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — dev-ask evals v2, OMP harness evals, fixtures delete** | rewrite `skills/dev-ask/evals/evals.json`; create `harnesses/omp/evals.json`; `rm -rf skills/dev-ask/evals/fixtures skills/dev-ask/evals/__pycache__` (after inlining the two extra files) | — | AC-1…6, AC-8…14 |
| **T2 — Host-neutral init-ask and product-ask eval prompts** | `skills/init-ask/evals/evals.json`, `skills/product-ask/evals/evals.json` | — | AC-7…10, AC-12, AC-15 |

(Paths without a leading directory are under `.config/agents/`.)

**Sizing rationale.**

- T1 is one data migration with one invariant (coverage). Doing it by hand across 81 cases is error-prone, so the implementer should write a throwaway builder (not committed) that loads the baseline, applies §4.2–4.5, writes both files in the dump format, and then runs S1. The builder and its output are reviewable against S1 and the §4 tables; the file itself is too large for line-by-line review.
- T2 is four prompt prefixes.
- Serial order is unnecessary. `dev-ticketing` may still serialize them for review convenience.
- Review focus (standard assurance): the reviewer re-runs S1 `coverage`, reads the rewrite and inline tables against the baseline cases, and reads each group's rows to confirm the group form stays readable; the rest is mechanical.

## 9. Risks, assumptions, stops and open decisions

**Assumptions.**

- *No consumer.* Batch 3 deleted the scanner and observer; S2 proves nothing live names the fixtures, `fixture_dir` or the v1 schema.
- *Order-free rubric.* A rubric is a set of grading lines; moving the shared lines to the front changes no meaning. S1 compares rubrics as multisets.
- *`files` is equivalent to the fixture extras.* A fixture dir held `case.json` (a copy of the case) plus these files; a runner writes `files` into the disposable fixture instead of copying a dir.
- *The OMP cases are harness-specific.* Their inputs and rubric are about OMP bridged yields and job waits. The move loses no rule, since both cases move verbatim and S1 `coverage` proves it. Portable coverage does shrink: the same-child repair, the attempt-2 return to the same controller, the attempt-2 papercut look and the other-host token path now live only in the OMP harness file (§3 residue table). D3 accepts that; no dev-ask case is added.
- *Determinism.* Every baseline and target JSON file round-trips byte-exactly through the dump format (verified), so S1 and S3 are deterministic.

**Risks.**

- *A behavior is lost in the regroup.* S1 `coverage` compares every field of every case, and no case is dropped.
- *The group form hides a scenario.* Each row keeps its verbatim request (S1 `shape`); shared fields sit once on the group, and the file's `expansion` string says how they combine.
- *Judgment calls the owner approved.*
  1. Some remaining groups are near-miss tables rather than pure one-variable templates: `G-GRILLING`, `G-ARTIFACT-LANE`, `G-EXPLICIT-STAGE`, `G-DEEP-LEARNING`, `G-LEARNING-RESULT` and `G-FIVE-FIELD` have rows with their own criterion or proof (§4.3 counts), and `G-TRIAGE`'s external-effect row adds a gate. Each still varies one trigger's activation, and coverage stays exact.
  2. The OMP case move leaves the §3 residue in the harness file only.
  3. The ignored scratch bank and bytecode are unrecoverable once deleted. `L-ROUTING` relies on a future runner materializing `files`.
- *Hand edits drift.* The builder route keeps the output mechanical; S1 `lean` rejects restated values, which is where hand edits usually drift.
- *The scratch bank is unrecoverable.* It is ignored, unread and was produced by a past live run; D2 authorizes its deletion.
- *npm test takes about 3 minutes.* Run it in the foreground with an explicit timeout.

**Stops.**

- Any guard check fails (AC-9…15).
- S1 `coverage` finds a difference the §4.5 tables do not explain, or a case looks like a true duplicate (any drop needs the owner).
- A change would touch a path outside the S4 allowlist or git state.
- The route owner reverses D3–D5: S1 (D3 path, D5 dir listing) or S3 (D4 wording) then needs a spec revision before that task.

**Open decisions for the owner.** None. D3–D5 (§1) settled the three candidate questions as recommended.

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch5b/spec-v3`. It supersedes spec-v2.
- spec-v3 note (Reconcile correction, route-owner approved against the final proposal):
  - Baseline moved to `214ff74`. S1, S3 and S4 diff against it.
  - Grouping follows the approved table. G-CONTINUATION, G-AUTHORITY-HISTORY, G-ROUTE-PRESENTATION and G-ORDINARY-SIZING are dissolved into singles. G-TRIAGE keeps three rows; `R-TRIAGE-WONTFIX` is single. That gives 18 groups and 24 singles.
  - §4.3 states the D1 rule and what actually holds. The owner confirmed that the six groups with row-level criterion or proof stay, and that S1 enforces only the invariants they meet.
  - §2, §3 and §9 replace the "already covered elsewhere" repair claim with the residue table.
  - The target was re-simulated on a fresh `214ff74` copy. All four scripts were re-extracted and re-hashed.
- spec-v3 erratum (route owner, after code review, prose only; no check or hash in §6 changes): §4.3 wrongly marked `R-T5-REAPPROVAL-ROUTE` as carrying its own `required_events`; its events equal the template, so per §4.1 the row states none. Only `R-T5-REAPPROVAL-AUTHORITY-IDENTITY-DRIFT` carries its own.
- spec-v2 note: `R-GRILL` is kept as a `G-GRILLING` row, and the readable-rows invariant was added.
- Next owner: `dev-ticketing` (the route owner approved the batch-5b proposal) projects T1–T2 into a lean plan, then `dev-implementation`, review (case-by-case coverage against the baseline), verification and learning, at standard assurance. No live runs, no commits.
- Route impact: unchanged.

**Handoff.**

- Result: technical specification for batch 5b (proposal item 9 plus the 5a carry-over), revision `agent-skills-lean-down-batch5b/spec-v3`, baseline `214ff74`.
- Receiver: the route owner; next-owner role `dev-ticketing`.
- Scope: T1 (dev-ask evals v2, OMP harness evals, fixtures and bytecode delete) and T2 (init-ask/product-ask prompts), independent; AC-1…15; S1–S4 hashes in §6.1.
- Evidence: baseline, target-simulation and single-task-state results in §6; negative probes listed.
- Open: none (D3–D5 settled).
