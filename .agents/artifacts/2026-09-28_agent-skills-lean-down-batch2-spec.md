# Agent-skills lean-down, batch 2: technical specification

- **Revision:** `agent-skills-lean-down-batch2/spec-v1`
- **Date:** 2026-09-28
- **Assurance:** standard
- **Baseline:** repository `HEAD` `69eff72`, clean. Every line number below refers to that baseline; re-locate by content if lines drift.

## 1. Authority and approved outcome

**Authority.**

- The human-approved proposal [`2026-09-28_agent-skills-lean-down-proposal.md`](2026-09-28_agent-skills-lean-down-proposal.md), SHA-256 `a1efc66c6e5546f83bb32e22d0b71e24a7d201f5655715c5b3d32cb66b0180f1` (checked). Batch 2 is its ranked items 5, 14, 16 and 19, plus advisory ADV-1 from the batch-1 review. Nothing else in the proposal is in scope.
- Batch-1 precedent (committed `7eec949`): [spec](2026-09-28_agent-skills-lean-down-batch1-spec.md) and [plan](../plans/2026-09-28-1920_agent-skills-lean-down-batch1.md). This spec reuses their pathspec conventions and guard checks, and their lesson: every AC is satisfiable at its owning task's boundary, and file-list checks skip paths deleted but not committed.
- Owner intent (binding):
  - Skills stay lean and agnostic to host, repository and topic, with no brittle exact wording.
  - Replacing a copy with a pointer never loses a rule. If the owner lacks the text, stop and report; never copy it back.
  - Behavior is unchanged.
  - Protected: the Reconcile/Retrace guard only. No change to `skills/reconcile/`, `skills/retrace/`, `skills/rethink/`, `skills/omp-update/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`.
- Governing contracts (`'/Users/kim/.agents/rules/canonical-project-contracts.md'`): `docs/adr/INDEX.md` and ADR-0002 D30 (planning rethink). D30's decisions stay true after this batch. INDEX L31 names "the applicable author/caller contract" as the owner of rethink timing and exclusions, which item 14 moves into `plan-rethink.md`, so that cell is updated in the same change (T2). No ADR restates route impact, dev-ask section text or product papercut settlement, so no other ADR changes. No external anchor points into a dev-ask heading (checked with `git grep`).

**Outcome.** When the batch is done, all of the following hold:

1. **Item 5.** `dev-ask/SKILL.md` states the route classification once, as one trigger → owner table. Compact disqualifiers stay by reference. The Route Overview template and reapproval triggers stay. Implementation internals are replaced by pointers to `dev-implementation`. Every line is at most 300 characters. The file should shrink by about 40% [INFERENCE]; that figure is an expectation, not acceptance. The route-ending suffix stays owned by dev-ask. dev-ask evals get only minimal, consistent updates and no shrink.
2. **Item 14.** `Route impact` is defined once, in `dev-handoff`. The plan-rethink trigger rule (when, who, inline or delegated, exclusions) lives once, in `references/plan-rethink.md`. Each caller keeps one line.
3. **Item 16.** `dev-continual-learning`, `dev-verification` and `dev-handoff` replace their restated text with short pointers.
4. **Item 19.** The product family carries one pass-through line instead of copies of papercut's resolve rules.
5. **ADV-1.** `plan-orchestration.md` loses its two residual OMP phrases.
6. All guard checks and deterministic suites still pass.

**Non-goals.**

- Proposal items 1–4, 6–13, 15, 17, 18 and 20, including the eval shrink (item 9) and the grilling merge (item 13).
- `grill-me`, `grill-with-docs` and `wayfinder` field mentions of `route-impact`. They carry no explanation to remove, and item 13 owns the wrappers.
- `product-ask`'s own route-impact continuation rule (L91). It is product-router behavior, not a support-skill copy.
- `dev-continual-learning` L61 (its papercut-boundary sentence) and everything outside the item-16 ranges.
- Any edit to `harnesses/omp/agent-return.md` (ADV-1 relies on it already owning the phrases), `papercut/**`, `execution-recovery.md` or `completion-presentation-input.md`. These are the pointer targets and stay unchanged.
- No new file, skill, rule, test or eval case.

## 2. Current system and constraints

Pathspecs follow batch 1. `CFG` = `.config/agents ':!**/evals/**' ':!.config/agents/references/impl-rethink/MAINTENANCE.md'`. Python checks read tracked plus untracked `.md` files under `.config/agents`, excluding `evals/` and the journal, and skip paths that no longer exist on disk.

**Item 5 — `dev-ask/SKILL.md`** (260 lines, 4,216 words; longest line 1,448 characters). The classification appears three times:

- the numbered "Classify in order" list (L39–49);
- the near-misses paragraph (L73), plus the grilling paragraph (L101);
- the "Route outcomes" list (L109–123).

It restates `dev-implementation` internals that already have an owner:

| dev-ask text | Owner that already holds it |
|---|---|
| L43 sentences 3–4 (semantic attempt 2, review never reruns, same-verifier closure); L118 from "Attempt 1 includes…" to "…eligible repair closure"; L216 from "The controller binds…" to "…never reruns" | `dev-implementation/SKILL.md` `## Attempt 2 and stops`, `## Assurance` ("Review runs exactly once…same verification owner closes…") |
| L45 "Use planless implementation only when…require a lean repository plan" | `dev-implementation/SKILL.md` `## Intake` L36 |
| L49 (child ownership per plan task, mechanical controller, planned fan-in, separate controller); L119 last sentence; L127 (planned fan-in route); L216 first four sentences; L252 | `dev-implementation/SKILL.md` L8, `## Controller entry and identity`, L78 (authored fan-in task is child-owned) |
| L51–57 (execution recovery stays with the execution owner) | `dev-implementation/references/execution-recovery.md` L3, L21 |
| L118 "Eligible execution-machinery recovery…replenishes semantic attempts" | `execution-recovery.md` L76 |

These are router-owned and have **no** other owner. They stay in dev-ask, compressed:

- disjoint non-outcome observation → terminal advisory;
- independently serious safety → separate-authority intake;
- disjoint outcome-relevant non-safety defect → `authority-change-required`, with no silent repair, verification restart, learning, approval or completion;
- indeterminate governing authority → its owner;
- post-completion advisory cleanup → fresh maintenance outcome;
- `dev-integration` only as a validated direct stage, never on the ordinary route;
- outcome-first continuation (L45 except the planless sentence);
- evidence precedence, presentation rules, the candidates form, the product-authority stop, the Route Overview template, dispatch, the delegation confirmations (L218–226), reapproval triggers (L228–241), completion validation and stops (L243–258).

**dev-ask evals.** The file has 81 cases; each fixture `case.json` `inputs` equals its `evals.json` `inputs` (checked). No case quotes a sentence this rewrite removes. The only verbatim overlaps are the ordered-route rule (`evals.json` L1323, L1343), "Present one owner per numbered Route line…" (L2745) and "Prerequisite Handoffs preserve their authored next-owner role…" (L3741). Each describes behavior the rewrite keeps, so no eval edit is expected.

**Item 14 — route impact.** `dev-handoff/SKILL.md` L38 allows one `Route impact:` line but does not define its values. Explanations of `unchanged`/`changed` are restated in:

- `dev-grilling` L38;
- `dev-improve-codebase-architecture` L76;
- `dev-prototype` L40;
- `dev-requirements` L45 (last sentence) and L78;
- `dev-research` L70.

`dev-codebase-design` L14, `dev-domain-modeling` L78, `dev-research` L32 and `dev-triage` L83 name the field with skill-specific receiver rules. These eight are the proposal's "8 support skills".

**Item 14 — plan-rethink.** `references/plan-rethink.md` (44 lines) owns the method (steps 1–6) but not the trigger rule. The trigger rule is restated in:

- `dev-specification` step 8 (L40–46);
- `dev-ticketing` step 7 (L42–49);
- `dev-ask` L204–214 (the caller follow-up);
- `dev-implementation` L44–53 (inline planless pass);
- `rules/plan.md` L20–28.

The restated clauses:

- after a substantive candidate, once, before final submission, approval, readiness or Handoff;
- inline authors read it as a separate step;
- a delegated author returns the candidate first, then applies the caller's follow-up in the same author;
- at most one bounded correction to author-owned decisions;
- a newly selected graph is substantive;
- exclusions: exact unchanged projection, storage copy, lifecycle/checkbox-only update, unchanged approved contract;
- the caller follow-up adds no owner, stage, gate or authority, and if the same author cannot receive it, stop rather than substitute;
- distinct from implementation rethink; manufactures no plan.

`rules/plan.md` L30–32 (draft persistence before the pass) is plan-storage-specific and stays in the rule.

**Item 16.**

- `dev-continual-learning/SKILL.md` L42–60 re-lists the `dev-handoff` headings and envelope rules. Adapter-specific rules are mixed into that range: no re-invocation, the fields to include, and never touching the ledger, review, repair, presentation or shipping.
- `dev-verification/SKILL.md` `## Execution recovery` (L61–92) restates `execution-recovery.md`. The owner holds every clause: L7–13 (eligibility and caps, required owner not replaceable), L51–56 (recovery rethink, smallest complete scenario, no stitching), L58–68 (limits), L72–76 (evidence, verifier read-only, fresh aggregate, unchanged fixed-set rerun, one-shot review).
- `dev-handoff/SKILL.md`: L37 and L40 state the local-delta rule twice (the proposal's "L43 = L46"; dev-handoff is unchanged since `4c0d815`, and the proposal's line numbers came from a subagent read). L43–48 restate `execution-recovery.md` L64 and L72 (the proposal's "L51–57").

**Item 19 — product family.**

- `product-ask/SKILL.md` copies papercut resolve rules in L92, L94, L96, and in L113 and L129 (settlement clauses). L87 holds the product-owned boundary: non-product evidence; leaf owners never access the ledger.
- `product-ask/WORKFLOW.md` L135 repeats them. It is the product human map, so it is included.
- `product-grilling` L93 and `product-prd` L24, L46 and L79 carry pass-through sentences.
- The owner `papercut/SKILL.md` L71–73 holds: exact `PC-ID`, `fixed | rejected | superseded`, call once, narrower authority → proposal only, settle only the unchanged ID, blocked/incomplete/unrelated stays open, the workflow owner supplies the disposition. L51 holds "do not retry a failed call".
- `completion-presentation-input.md` L38 owns the `Papercut:` line format.

**ADV-1.** `dev-implementation/references/plan-orchestration.md`:

- L36: "terminal-completes a type-absent ordinary candidate by direct native `yield`";
- L47: "a busy send is an aside, not another wake".

The adapter holds both: `harnesses/omp/agent-return.md` L159–171 (direct native `yield`) and L215–216 (injection is an aside in the busy child's turn).

**Verified commands** (run 2026-09-28 at `69eff72`):

- `npm test` in `harnesses/omp/acp-controller`: `ℹ fail 0`, exit 0, about 165 s.
- `cli.mjs roles`: exit 0.
- `test_executor_plan.py`: OK.
- `test_papercut_ledger.py`: OK.
- `bun test` in `harnesses/omp/extensions`: `0 fail`.
- Guard markers and headings: each appears once.
- Every S-script in §6.1 ran: S2, S3, S4, S10 and S12 print `ok` and S13 prints `ok` for T1–T3 (preservation guards); S1, S5–S9 and S11 fail as expected before the change.

## 3. Architecture and ownership

| Concern | Sole owner after the batch | Everyone else |
|---|---|---|
| Route classification (trigger → owner) | one table in `dev-ask/SKILL.md` | none |
| Compact disqualifiers | `dev-implementation/references/compact-checklist.md` | dev-ask reads it by reference (unchanged) |
| Route-ending suffix, Route Overview template, reapproval triggers, route stops | `dev-ask/SKILL.md` | unchanged |
| Attempts, repair, review-once, same-verifier closure, controller topology, planless/plan choice, authored fan-in | `dev-implementation/SKILL.md` | dev-ask: one pointer line |
| Execution recovery | `dev-implementation/references/execution-recovery.md` | pointers in dev-ask, `dev-verification` and `dev-handoff` |
| `Route impact` values and meaning | `dev-handoff/SKILL.md` `Outcome` rule | 8 support skills: one line naming the field per `dev-handoff` |
| Plan-rethink trigger (when, who, inline/delegated, exclusions, caller follow-up) | `references/plan-rethink.md` | 5 callers: one line each |
| Handoff envelope | `dev-handoff/SKILL.md` | `dev-continual-learning`: pointer |
| Papercut settlement mechanics | `papercut/SKILL.md` `resolve` | product family: one pass-through line |
| Papercut is non-product evidence; leaf owners never touch the ledger | `product-ask/SKILL.md` (product-owned) | leaf line repeats only the pass-through |
| OMP return phrasing | `harnesses/omp/agent-return.md` | `plan-orchestration.md`: host-neutral |

Dependency direction: pointers target owners; owners never point back. No rule moves from a rule or ADR into a skill. The one move into an owner is the plan-rethink trigger into `plan-rethink.md`, which item 14 names as its home.

## 4. Interfaces, data, invariants and errors

The interfaces here are prose load paths, pointers and one eval data file. Wording is free unless a check below needs a token.

**T1 — `dev-ask/SKILL.md` rewrite (item 5).**

- Keep the frontmatter byte-identical; the description drives triggering.
- Target shape, in this order:
  1. role (one short paragraph);
  2. evidence and precedence;
  3. sizing pointer (`task-sizing.md`; boundary rationale in `Plan`; route presentation is not dispatch);
  4. one trigger → owner Markdown table in classification order, first matching row wins;
  5. assurance by reference to `compact-checklist.md`;
  6. an implementation-pointer line;
  7. router-owned outcomes and stops;
  8. the route-ending suffix and prerequisite-owner rule;
  9. presentation rules and the candidates form;
  10. the product-authority stop template;
  11. the Route Overview section and template;
  12. dispatch and Handoff;
  13. reapproval triggers;
  14. completion and stops;
  15. the `WORKFLOW.md` pointer.
- The table covers every owner in the current L39–49 list and L109–123 outcomes: direct answer, `dev-research`, `dev-triage`, `wayfinder`, `product-ask`/`PRODUCT AUTHORITY REQUIRED`, `dev-requirements`, `dev-diagnosing-bugs`, `grill-with-docs`/`grill-me`, `dev-implementation`, `dev-specification`, `dev-ticketing`, `dev-prototype`, `dev-improve-codebase-architecture`, `dev-test-audit` and the validated direct stages.
- Each row folds in its near miss and its unique outcome fact. Examples:
  - research needs Route Overview approval before dispatch and returns to the requesting route owner;
  - a triage tracker mutation needs external-effect approval;
  - requirements asks only about synthesized human-owned requirements;
  - grilling confirmation is not a router gate;
  - a survey returns a selection and starts no refactor;
  - a prototype is disposable evidence returned to its exact owner;
  - a Wayfinder map never authorizes work;
  - shipping needs delivery authority;
  - audit intake shows the exact scope and ordered test-file list before approval and launches no auditor;
  - `dev-integration` only as a validated direct stage;
  - `recap` is an exact-name manual fallback only.
- After the table, no owner name is restated more than once outside it (S1).
- The implementation pointer, in meaning: implementation is `dev-implementation`, activated in place by default; attempts, repair, review, verification closure, recovery, topology and plan-versus-planless follow `dev-implementation`; the router grants no retries and holds no run state. Keep "A finite host observation window ending does not reopen routing or prove a missing report." and the batch-1 exemption sentence (L59–62) in meaning.
- Keep every router-owned rule listed in §2, compressed. Remove the rows in the §2 owner table.
- Keep the route-ending suffix paragraph (L125) without its "semantic owners…in place" sentence. Delete L127; the planned route is the spec → ticketing prefix plus the standard suffix, which the table and suffix already give.
- **Keep the plan-rethink follow-up paragraph (L204–214) in meaning.** T2 turns it into one line after its owner exists. T1 may only re-wrap it.
- One rule per line; no line longer than 300 characters (tables and templates included).
- `dev-ask/evals`: edit a case only where its text quotes wording that no longer holds. None is expected (§2). Keep every case ID, order and key set. When a case's `inputs` change, change its fixture `case.json` `inputs` identically. Do not delete, merge or add cases.

**T2 — route impact (item 14).**

- `dev-handoff/SKILL.md` L38 becomes the single definition. Meaning:
  - a lifecycle owner adds one `Route impact: unchanged|changed` line to `Outcome` when its receiver needs it;
  - `unchanged`: the result preserves the approved authority and route, and the receiver continues to the next owner already named, with no router hop or reapproval;
  - `changed`: names the changed route facts, and the receiver's route owner recomputes with next-owner role `dev-ask`, reapproving only for a named material trigger;
  - neither value authorizes a route by itself;
  - ordinary task Handoffs omit the line.
- Each of the 8 support skills removes its `unchanged`/`changed` explanation sentences. It keeps its skill-specific receiver rules, such as `dev-triage`'s state → receiver map and the `dev-codebase-design`/`dev-domain-modeling` "only when route facts materially change" receiver choice, and names the field once with a `dev-handoff` pointer. In `dev-requirements`, merge L45's last sentence and L78's `changed` sentence into that pointer.

**T2 — plan-rethink (item 14).**

- `references/plan-rethink.md`: keep every existing line (the method is "keep as-is"). Add one short section, e.g. `## When it runs`, holding the trigger clauses listed in §2: timing, inline, delegated, caller follow-up, same-author-or-stop, substantive graphs, exclusions, adds no owner/stage/gate, distinct from implementation and recovery rethink, creates no plan.
- Callers each keep exactly one line containing `plan-rethink.md`, meaning "apply/send it once as `plan-rethink.md` directs":
  - `dev-specification` step 8;
  - `dev-ticketing` step 7;
  - `dev-implementation` `## Planless contract authoring` (inline);
  - `rules/plan.md` (keep L30–32);
  - `dev-ask` (caller: after a delegated spec, ticketing or plan author's first substantive candidate, send the follow-up to that same author).
- `docs/adr/INDEX.md` L31, third cell becomes: `.config/agents/references/plan-rethink.md` for timing, substantive decisions and mechanical exclusions; author and caller contracts keep one pointer.

**T2 — product family (item 19).**

- `product-ask/SKILL.md`:
  - Replace L92, L94 and L96 with the approved line: "Pass papercut results through unchanged; settle them with `papercut` resolve."
  - Compress L87 to the product-owned boundary: a complete papercut candidate and its unchanged `PC-ID` travel only as non-product evidence and never change product authority or the product result; product leaf owners never read or write the ledger.
  - In L113, drop the two settlement sentences ("Open evidence causes no settlement call…" and "A terminal `fixed | rejected | superseded` result…") and keep "any papercut settlement has finished".
  - In L129, "Completed open and report-only/open papercut accounting are not stops" becomes "Open papercut accounting is not a stop."
  - L119, L123 and L127 stay.
- `product-ask/WORKFLOW.md` L135 becomes the same two ideas (boundary, then pass-through/resolve line). The Handoff template's `## Papercut evidence` heading stays.
- `product-grilling` L93 (its two papercut sentences), `product-prd` L24, L46 and L79 (papercut clauses): one line each meaning "Pass papercut results through unchanged and never touch the ledger; `product-ask` settles them with `papercut` resolve." A leaf never settles.

**T3 — item 16 and ADV-1.**

- `dev-continual-learning` L42–60 becomes a few short lines:
  - load `'/Users/kim/.agents/skills/dev-handoff/SKILL.md'` and return one Handoff on the first return, following its envelope;
  - the portable assessment evidence and the one `Learning:` line go in `Checks`, with no invented acceptance IDs;
  - the bound lifecycle controller is the sole receiver;
  - check the draft against `dev-handoff` before sending.
  
  Keep the adapter-specific rules, compressed: no re-invocation, re-emit, second assessment or second Handoff; include curated guidance paths, candidate-specific papercut dispositions and the exact residual or governing conflict; never read or write the ledger, rerun review or verification, repair, present or ship. The heading enumeration goes.
- `dev-verification` `## Execution recovery` becomes a pointer of at most three lines. When an execution failure blocks a required observation, assess and recover under `execution-recovery.md` before escalating. The same verifier owns recovery, stays read-only toward the target, and changes of target, behavior, check meaning, expected result, ownership or effect return to authority. Keep `## One eligible implementation repair` unchanged.
- `dev-handoff`:
  - delete L37 (L40 keeps the rule);
  - replace L43–48 with one line: record execution-recovery evidence inside `Checks` and `Blocker/risk` as `execution-recovery.md` directs; add no recovery field or ledger;
  - keep the T2 route-impact definition and the fenced envelope byte-identical.
- `plan-orchestration.md`:
  - L36: "…terminal-completes a type-absent ordinary candidate by direct native `yield` before…" becomes "…returns its candidate by terminal ordinary completion before…", matching `dev-implementation` L128.
  - L47: delete "; a busy send is an aside, not another wake".

**Invariants.**

- Every clause removed from a file exists in its §3 owner. The owner files `papercut/**`, `execution-recovery.md`, `completion-presentation-input.md` and `agent-return.md` are unchanged (AC-23), and the `dev-implementation` owner sections are byte-identical (AC-15).
- Behavior is unchanged; no routing, assurance, approval or return semantics change.

**Errors and stops.** If a removal needs a rule its owner lacks, stop and report it; never copy it back. Stop if a guard check fails.

## 5. Effects, migration, rollback and compatibility

Allowed effects: edits to exactly the files in the S13 allowlist (§6.1), cumulative per task, plus a fixture `case.json` only in the T1 case described in §4.

- No deletions and no new files.
- No git staging, commits or pushes.
- No edits to `MAINTENANCE.md`, plans, `.agents/papercuts.json` or `.scratch`.
- No network access.
- No omp-update live runs, because no Reconcile or Retrace skill or protocol text changes.

The cutover is clean: no aliases, notes or compatibility text. Rollback is the owner's call through git from `69eff72`.

## 6. Acceptance

Run every command from the repository root. `Sn` means: save the §6.1 block `Sn` to `/tmp/b2/Sn.py`, then run `python3 /tmp/b2/Sn.py` with the stated argument. A task runs every AC it owns at its boundary. The verifier runs the complete set once on the final target.

**AC-1** — T1, T2
Behavior: No `dev-ask/SKILL.md` line exceeds 300 characters.
Check: `python3 -c "m=max(map(len,open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read().splitlines()));print('ok' if m<=300 else m)"`; expect `ok`.

**AC-3** — T1
Behavior: The classification is stated once: one table names every catalog owner, and no owner is restated more than once outside it.
Check: `S1`; expect `ok`.

**AC-4** — T1
Behavior: The Route Overview template (five fields in order, start and continue approval lines), the candidates form, the product-authority stop and both route-ending suffixes are kept.
Check: `S2`; expect `ok`.

**AC-5** — T1
Behavior: All reapproval triggers and the router-owned references and terms are kept: `authority-change-required`, completion input, packed-label, compact checklist, task sizing, render script, `Status: DONE`, plan-rethink, `WORKFLOW.md`, the compact learning line, `dev-test-audit` and `recap`.
Check: `S3`; expect `ok`.

**AC-6** — T1
Behavior: `dev-ask` carries no implementation internals; they point to `dev-implementation`.
Check: `python3 -c "import re;t=re.sub(r'\s+',' ',open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read());print(re.findall(r'(?i)attempt 2|semantic attempt|same verifier|verifier repair|review never reruns|recovery rethink|code-then-test|fan-in',t) or 'ok')"`; expect `ok`.

**AC-7** — T1
Behavior: dev-ask evals keep every case, ID, order and key set, and each fixture's `inputs` equals its `evals.json` `inputs`.
Check: `S4`; expect `ok`.

**AC-8** — T2, T3
Behavior: The meaning of `Route impact` is defined only in `dev-handoff`.
Check: `S5`; expect `ok`.

**AC-9** — T2
Behavior: Each of the 8 support skills names `Route impact` and points to `dev-handoff`.
Check: `S6`; expect `ok`.

**AC-10** — T2
Behavior: The plan-rethink trigger rule is stated only in `plan-rethink.md`, which holds each trigger concept, and each of the 5 callers has exactly one line naming `plan-rethink.md`.
Check: `S7`; expect `ok`.

**AC-11** — T2
Behavior: The plan-rethink method is unchanged: every non-blank baseline line of `plan-rethink.md` is still present.
Check: `python3 -c "import subprocess;f='.config/agents/references/plan-rethink.md';b=subprocess.run(['git','show','69eff72:'+f],capture_output=True,text=True).stdout.splitlines();n=open(f,encoding='utf-8').read().splitlines();print([l for l in b if l.strip() and l not in n] or 'ok')"`; expect `ok`.

**AC-12** — T2
Behavior: The ADR index names `plan-rethink.md` as the owner of rethink timing and exclusions.
Check: `python3 -c "r=[l for l in open('docs/adr/INDEX.md',encoding='utf-8') if 'ADR-0002 D30' in l and 'rethink' in l];print('ok' if len(r)==1 and 'plan-rethink.md' in r[0] and 'author/caller contract for' not in r[0] else r)"`; expect `ok`.

**AC-13** — T2
Behavior: The product family no longer restates papercut resolve rules.
Check: `S8`; expect `ok`.

**AC-14** — T2
Behavior: `product-ask`, `product-grilling` and `product-prd` each carry the pass-through/resolve line and a ledger boundary, and `product-ask` keeps the non-product-evidence boundary.
Check: `S9`; expect `ok`.

**AC-15** — T1, T2
Behavior: The `dev-implementation` sections that dev-ask now points to are byte-identical to the baseline.
Check: `S10`; expect `ok`.

**AC-16** — T3
Behavior: `dev-continual-learning` no longer re-lists the Handoff headings, and keeps its `dev-handoff` pointer, its three Learning lines and its ledger boundary.
Check: `S11 AC-16`; expect `ok`.

**AC-17** — T3
Behavior: `dev-verification` no longer restates the execution-recovery algorithm and points to `execution-recovery.md`.
Check: `S11 AC-17`; expect `ok`.

**AC-18** — T3
Behavior: `dev-handoff` states the local-delta rule once, points to `execution-recovery.md` instead of restating it, and keeps its envelope byte-identical.
Check: `S11 AC-18`; expect `ok`.

**AC-19** — T3
Behavior: `plan-orchestration.md` carries neither residual OMP phrase.
Check: `python3 -c "import re;t=re.sub(r'\s+',' ',open('.config/agents/skills/dev-implementation/references/plan-orchestration.md',encoding='utf-8').read());print(re.findall(r'(?i)busy send|\baside\b|native .yield',t) or 'ok')"`; expect `ok`.

**AC-20** — T1, T2, T3
Behavior: Every relative link, `skill://`, `rule://` and `~/.agents/` reference, and every `#anchor`, in each changed Markdown file resolves.
Check: `S12`; expect `ok`.

**AC-21** — T1 (`S13 T1`), T2 (`S13 T2`), T3 (`S13 T3`)
Behavior: Only files owned by the current and earlier tasks differ from the baseline. The append-only journal and every other path stay untouched.
Check: `S13 <task>`; expect `ok`.

**AC-22** — guard; T1, T2, T3
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-23** — guard; T1, T2, T3
Behavior: The guarded paths and the pointer-target owners are unchanged against the baseline and the working tree.
Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md .config/agents/skills/papercut .config/agents/skills/dev-implementation/references/execution-recovery.md .config/agents/references/completion-presentation-input.md"; git status --porcelain -- $P; git diff --name-only 69eff72 -- $P`; expect empty output.

**AC-24** — guard; T3
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

**AC-25** — guard; T1, T2, T3
Behavior: The real protocol and Retrace prompt files still load offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-26** — T2, T3
Behavior: The plan validator suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

**AC-27** — T2, T3
Behavior: The plan-sync extension suite still passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-28** — T2, T3
Behavior: The papercut ledger suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

**Why each AC sits where it does.**

- AC-1 and AC-15 re-run in T2 because T2 edits `dev-ask` and `dev-implementation`.
- AC-8 re-runs in T3 because T3 edits `dev-handoff`.
- AC-24 runs once, at T3: no task edits a file the controller loads, and AC-22, AC-23 and AC-25 give per-task guard evidence cheaply.
- AC-26, AC-27 and AC-28 run in T2 and T3, the tasks that edit plan and papercut-adjacent prose.

### 6.1 Check scripts

Copy each block verbatim.

S1
```python
# S1 (AC-3): the classification appears once, as one trigger -> owner table
import re
L=open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read().splitlines()
tab=[l for l in L if l.lstrip().startswith('|')];out=[l for l in L if not l.lstrip().startswith('|')]
O=['dev-research','dev-triage','wayfinder','product-ask','dev-requirements','dev-diagnosing-bugs','grill-me','grill-with-docs','dev-implementation','dev-specification','dev-ticketing','dev-prototype','dev-improve-codebase-architecture','dev-test-audit']
miss=[o for o in O if not any(re.search(r'(?<![\w-])'+re.escape(o)+r'(?![\w-])',l) for l in tab)]
rep={o:n for o in O[:8]+['dev-prototype','dev-improve-codebase-architecture'] for n in [sum(len(re.findall(r'(?<![\w-])'+re.escape(o)+r'(?![\w-])',l)) for l in out)] if n>1}
print('ok' if not miss and not rep else {'missing_from_table':miss,'restated_outside_table':rep})
```

S2
```python
# S2 (AC-4): Route Overview template, candidates form, product stop and route-ending suffix kept
import re
s=open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read();n=re.sub(r'\s+',' ',s)
m=re.search(r'```markdown\n## Route overview\n(.*?)```',s,re.S);t=m.group(1) if m else ''
c={'fields':re.findall(r'\*\*(Goal|Route|Plan|Safety|Approval)\*\*',t)==['Goal','Route','Plan','Safety','Approval'],
'start':'Reply **approve** to start.' in t,'continue':'Reply **approve** to continue.' in s,
'candidates':all(x in s for x in ['## Route candidates','Recommended','Alternative','Trade-off']),
'stop':all(x in s for x in ['PRODUCT AUTHORITY REQUIRED','Unresolved decisions:','Current safe evidence:','Next owner:','Resume input:']),
'compact':bool(re.search(r'dev-implementation`?\W+`?completion-presentation',n)),
'standard':bool(re.search(r'dev-implementation`?\W+`?dev-code-review`?\W+`?dev-verification`?\W+`?dev-continual-learning`?\W+`?completion-presentation',n))}
print('ok' if all(c.values()) else [k for k,v in c.items() if not v])
```

S3
```python
# S3 (AC-5): reapproval triggers and router-owned references kept
import re
s=open('.config/agents/skills/dev-ask/SKILL.md',encoding='utf-8').read();low=re.sub(r'\s+',' ',s).lower()
tr=['product or architecture authority','route','material scope','acceptance','topology','independence','destructive or external','shipping','shared assumption','capability','drift']
keep=['authority-change-required','completion-presentation-input.md','packed-label.md','compact-checklist.md','task-sizing.md','render.py','Status: DONE','plan-rethink.md','WORKFLOW.md','Learning: skipped for compact','dev-test-audit','recap']
m=[x for x in tr if x not in low]+[x for x in keep if x not in s]
print(m or 'ok')
```

S4
```python
# S4 (AC-7): dev-ask evals keep every case and stay consistent with their fixtures
import json,subprocess
E='.config/agents/skills/dev-ask/evals/';d=json.load(open(E+'evals.json'))['cases']
b=json.loads(subprocess.run(['git','show','69eff72:'+E+'evals.json'],capture_output=True,text=True).stdout)['cases']
bad=[] if [x['id'] for x in d]==[x['id'] for x in b] else ['case ids changed']
bad+=[x['id'] for x,y in zip(d,b) if set(x)!=set(y) or json.load(open(E+x['fixture_dir']+'/case.json'))['inputs']!=x['inputs']]
print(bad or 'ok')
```

S5
```python
# S5 (AC-8): route impact is defined only in dev-handoff
import os,re,subprocess
fs=[f for f in subprocess.run(['git','ls-files','-co','--exclude-standard','.config/agents'],capture_output=True,text=True).stdout.split() if f.endswith('.md') and '/evals/' not in f and not f.endswith('impl-rethink/MAINTENANCE.md') and os.path.exists(f)]
H='.config/agents/skills/dev-handoff/SKILL.md'
R=r'(?i)\bunchanged`?\s+(means|preserves|resumes)\b|\bchanged`?\s+(reports|identifies)\b'
cp=[f for f in fs if f!=H and re.search(R,re.sub(r'\s+',' ',open(f,encoding='utf-8').read()))]
own=any(re.search(r'(?i)route.impact',p) and re.search(r'\bunchanged\b',p) and re.search(r'(?<!un)\bchanged\b',p) for p in re.split(r'\n\s*\n',open(H,encoding='utf-8').read()))
print('ok' if own and not cp else {'owner_defines':own,'copies':cp})
```

S6
```python
# S6 (AC-9): each support skill names Route impact and points to dev-handoff
import re
S=['dev-codebase-design','dev-domain-modeling','dev-grilling','dev-improve-codebase-architecture','dev-prototype','dev-requirements','dev-research','dev-triage']
bad=[s for s in S for t in [open('.config/agents/skills/%s/SKILL.md'%s,encoding='utf-8').read()] if not (re.search(r'(?i)route.impact',t) and 'dev-handoff' in t)]
print(bad or 'ok')
```

S7
```python
# S7 (AC-10): the plan-rethink trigger rule lives only in plan-rethink.md; each caller keeps one pointer line
import os,re,subprocess
fs=[f for f in subprocess.run(['git','ls-files','-co','--exclude-standard','.config/agents'],capture_output=True,text=True).stdout.split() if f.endswith('.md') and '/evals/' not in f and not f.endswith('impl-rethink/MAINTENANCE.md') and os.path.exists(f)]
P='.config/agents/references/plan-rethink.md'
R=r'(?i)delegated author first returns|explicitly reads it as a separate|exact unchanged projection|same author cannot receive|storage copy'
cp=[f for f in fs if f!=P and re.search(R,re.sub(r'\s+',' ',open(f,encoding='utf-8').read()))]
p=re.sub(r'\s+',' ',open(P,encoding='utf-8').read()).lower()
miss=[k for k in ['inline','delegated','same author','follow-up','substantive','unchanged projection','storage cop','lifecycle','stop'] if k not in p]
C=['.config/agents/skills/dev-specification/SKILL.md','.config/agents/skills/dev-ticketing/SKILL.md','.config/agents/skills/dev-ask/SKILL.md','.config/agents/skills/dev-implementation/SKILL.md','.config/agents/rules/plan.md']
ln={c:n for c in C for n in [sum('plan-rethink.md' in l for l in open(c,encoding='utf-8'))] if n!=1}
print('ok' if not (cp or miss or ln) else {'copies':cp,'owner_missing':miss,'caller_lines':ln})
```

S8
```python
# S8 (AC-13): product skills no longer restate papercut resolve rules
import re
F=['.config/agents/skills/product-ask/SKILL.md','.config/agents/skills/product-ask/WORKFLOW.md','.config/agents/skills/product-grilling/SKILL.md','.config/agents/skills/product-prd/SKILL.md']
R=r'(?i)fixed \| rejected \| superseded|narrow(er)? authority|helper failure|report-only/open|unrelated (ID|result)|sole settlement owner|settlement procedure|successful call'
h={f:[m.group(0) for m in re.finditer(R,re.sub(r'\s+',' ',open(f,encoding='utf-8').read()))] for f in F}
print({f:v for f,v in h.items() if v} or 'ok')
```

S9
```python
# S9 (AC-14): product skills pass papercut results through and keep the product boundary
import re
t=lambda f:re.sub(r'\s+',' ',open('.config/agents/skills/'+f,encoding='utf-8').read())
F=['product-ask/SKILL.md','product-grilling/SKILL.md','product-prd/SKILL.md']
bad=[f for f in F if not re.search(r'(?i)papercut[^.;]*unchanged[^.]*resolve|unchanged[^.;]*papercut[^.]*resolve',t(f))]
bad+=[f+': ledger boundary' for f in F if not re.search(r'(?i)ledger|papercut storage',t(f))]
bad+=[] if re.search(r'(?i)non-product',t(F[0])) else ['product-ask: non-product evidence']
print(bad or 'ok')
```

S10
```python
# S10 (AC-15): dev-implementation's controller, attempt-2 and assurance sections are byte-identical to the baseline
import re,subprocess
D='.config/agents/skills/dev-implementation/SKILL.md'
sec=lambda t,h:(re.search(r'(?ms)^## '+re.escape(h)+r'\n.*?(?=^## |\Z)',t) or [None])[0]
b=subprocess.run(['git','show','69eff72:'+D],capture_output=True,text=True).stdout;c=open(D,encoding='utf-8').read()
print([h for h in ['Controller entry and identity','Attempt 2 and stops','Assurance'] if sec(c,h) is None or sec(b,h)!=sec(c,h)] or 'ok')
```

S11
```python
# S11 (AC-16..18): item-16 pointers replace restated text
import re,subprocess
n=lambda t:re.sub(r'\s+',' ',t)
L=n(open('.config/agents/skills/dev-continual-learning/SKILL.md',encoding='utf-8').read())
V=n(open('.config/agents/skills/dev-verification/SKILL.md',encoding='utf-8').read())
H0=open('.config/agents/skills/dev-handoff/SKILL.md',encoding='utf-8').read();H=n(H0)
B=subprocess.run(['git','show','69eff72:.config/agents/skills/dev-handoff/SKILL.md'],capture_output=True,text=True).stdout
tpl=lambda t:(re.search(r'```markdown\n.*?```',t,re.S) or [None])[0]
r={'AC-16':not re.search(r'## (Outcome|Changed targets/effects|Checks|Blocker/risk|Next receiver)',L) and all(k in L for k in ['dev-handoff','Learning: curated','Learning: no durable learning','Learning: blocked','ledger']),
'AC-17':not re.search(r'(?i)per-cause|stitch|initial execution allocation|transient|corrected execution|decisive observation',V) and 'execution-recovery.md' in V,
'AC-18':H.count('material preserved behavior')==1 and not re.search(r'(?i)decisive observation|transient basis|error wording',H) and 'execution-recovery.md' in H and tpl(H0)==tpl(B) and tpl(B) is not None}
import sys;k=sys.argv[1];print('ok' if r[k] else 'fail')
```

S12
```python
# S12 (AC-20): every relative link, skill://, rule:// and ~/.agents/ reference in changed Markdown resolves, including #anchors
import os,re,subprocess
F=[f for f in subprocess.run(['git','diff','--name-only','69eff72','--','.config/agents','docs'],capture_output=True,text=True).stdout.split() if f.endswith('.md') and os.path.exists(f)]
def slug(h):
    h=re.sub(r'[`*_]','',h.strip().lower());h=re.sub(r'[^\w\- ]','',h);return h.replace(' ','-')
heads=lambda p:{slug(m) for m in re.findall(r'(?m)^#{1,6} +(.+?) *$',open(p,encoding='utf-8').read())}
def res(src,u):
    if u.startswith('skill://'):return '.config/agents/skills/'+u[8:]
    if u.startswith('rule://'):return '.config/agents/rules/'+u[7:]+'.md'
    if u.startswith('~/.agents/'):return '.config/agents/'+u[10:]
    return os.path.normpath(os.path.join(os.path.dirname(src),u))
bad=[]
for f in F:
    t=open(f,encoding='utf-8').read()
    for u in re.findall(r'\]\(([^)\s]+)\)',t)+re.findall(r'(?:skill|rule)://[\w./-]+|~/\.agents/[\w./-]+',t):
        if re.match(r'https?:|mailto:',u):continue
        p,_,a=u.partition('#');p=p.rstrip('.,;:');g=res(f,p) if p else f
        if not os.path.exists(g):bad.append((f,u));continue
        if a and os.path.isfile(g) and slug(a) not in heads(g):bad.append((f,u))
print(bad or 'ok')
```

S13
```python
# S13 (AC-21): only files owned by tasks up to the named one differ from the baseline
import subprocess,sys
S='.config/agents/skills/';T=sys.argv[1];K=['T1','T2','T3']
A={'T1':[S+'dev-ask/SKILL.md',S+'dev-ask/evals/evals.json'],
'T2':[S+x+'/SKILL.md' for x in ['dev-codebase-design','dev-domain-modeling','dev-grilling','dev-improve-codebase-architecture','dev-prototype','dev-requirements','dev-research','dev-triage','dev-handoff','dev-specification','dev-ticketing','dev-implementation','dev-ask','product-ask','product-grilling','product-prd']]+[S+'product-ask/WORKFLOW.md','.config/agents/references/plan-rethink.md','.config/agents/rules/plan.md','docs/adr/INDEX.md'],
'T3':[S+'dev-continual-learning/SKILL.md',S+'dev-verification/SKILL.md',S+'dev-handoff/SKILL.md',S+'dev-implementation/references/plan-orchestration.md']}
ok={f for k in K[:K.index(T)+1] for f in A[k]}
g=lambda *a:subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n')
ch={l for l in g('diff','--name-only','69eff72','--','.config/agents','docs')+g('ls-files','--others','--exclude-standard','--','.config/agents','docs') if l}
fx=lambda f:f.startswith(S+'dev-ask/evals/fixtures/') and f.endswith('/case.json')
print(sorted(f for f in ch if f not in ok and not fx(f)) or 'ok')
```

## 7. Test seams

- This batch changes prose and pointers only. The behavior is structural: single ownership, pointers present, links resolve, copies absent. So the checks are static scripts plus the existing deterministic suites at the seams that could break: the prompt loader (AC-24/25), the plan validator, plan-sync and the papercut ledger.
- Content preservation is guarded by:
  - byte-identical owner sections (AC-15, AC-18 envelope, AC-11 method);
  - unchanged owner files (AC-23);
  - kept router-owned terms (AC-3–5, AC-14, AC-16).

  Review confirms clause by clause that every removed rule exists in its §3 owner. Static checks cannot prove that.
- Every single-owner check tests for absent copies plus a present owner; none pins exact new wording. Where a check needs a token, §4 names it.
- No word-count bound: the proposal's −40% is an inference, and a numeric target could push a rewrite to drop router-owned rules. AC-3 (classification once) and AC-6 (internals moved out) enforce the approved reduction; AC-1 encodes the approved 300-character rule.
- Permanent tests: none added or changed. There is no new contract that a durable test could defend beyond these one-time structural checks. The closest existing coverage is the dev-ask evals, kept unchanged (AC-7).
- [INFERENCE] Routing behavior is unchanged. No live agent run proves it; none is in scope.

## 8. Implementation boundaries and dependencies

A lean plan with three serial tasks:

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — dev-ask rewrite** (item 5) | `dev-ask/SKILL.md` (keeping the plan-rethink paragraph in meaning); `dev-ask/evals/evals.json` and fixture `case.json` only if §4 requires it | — | AC-1, AC-3…7, AC-15, AC-20…23, AC-25 |
| **T2 — define once** (items 14, 19) | `dev-handoff` (L38 only); the 8 support skills; `plan-rethink.md`; the plan-rethink lines in `dev-specification`, `dev-ticketing`, `dev-implementation`, `rules/plan.md` and `dev-ask`; `docs/adr/INDEX.md` L31; `product-ask/SKILL.md`, `product-ask/WORKFLOW.md`, `product-grilling`, `product-prd` | T1 (shares `dev-ask/SKILL.md`) | AC-1, AC-8…15, AC-20…23, AC-25…28 |
| **T3 — pointers and ADV-1** (item 16, ADV-1) | `dev-continual-learning`, `dev-verification`, `dev-handoff` (L37, L43–48), `plan-orchestration.md` | T2 (shares `dev-handoff`) | AC-8, AC-16…28 |

**Sizing rationale.**

- T1 is one cohesive rewrite of a 4.2k-word file. It needs its owners in context (`dev-implementation`, `compact-checklist.md`, `execution-recovery.md`) and a grep over the 4,246-line evals. That fits one fresh context but not alongside T2's twenty-file sweep.
- T2 is many small, same-pattern edits. Item 19 joins item 14 because both are "define once, keep one line" and neither shares files with T3 except `dev-handoff`.
- T3 is small, and it is kept separate because it depends on T2's `dev-handoff` edit.
- Serial order is forced by the shared files. Each task is independently checkable at its own boundary: every AC it owns concerns only files it or an earlier task finished.
- This matches the expected three-task shape; no adjustment was needed.

## 9. Risks, assumptions, stops and open decisions

**Assumptions.**

- *plan-rethink.md edit versus "Keep as-is".* The proposal's keep-as-is list names `plan-rethink.md`. Item 14, which the human selected for batch 2, names it as the home of the rule. Read together: the method stays byte-for-byte (AC-11) and only a trigger section is added.
- *Plan-rethink callers.* The proposal says "3 skills". The trigger text is actually in five places: three skills with the full paragraph plus `dev-implementation` and `rules/plan.md`. "Define once" is false unless all five become one line, so all five are in scope. `rules/plan.md` keeps its plan-storage sentence.
- *`product-ask/WORKFLOW.md` included.* It is the family's human map and repeats the same resolve rules. Item 19 covers "the product-ask family".
- *Leaf wording.* The leaf line says `product-ask` settles, not "settle them", to keep "leaf owners never settle" true. This is an allowed wording variant of the approved sentence, not a behavior change.
- *No eval edits expected.* The baseline overlap check found only quotes of retained behavior.

**Risks.**

- *Pointer drops a router-owned rule in the dev-ask rewrite.* This is the main risk. It is mitigated by the §2 split into owned and router-owned rules, by AC-3–6, and by review against the §2 list.
- *S1 can be satisfied cosmetically,* for example by dropping backticks. Review judges the table's completeness.
- *npm test takes about 3 minutes.* Run it in the foreground with an explicit timeout.

**Stops.**

- Any guard check fails (AC-22…25).
- A removal needs a rule its owner lacks.
- Any change would touch a guarded path, an owner file in AC-23, or git state.
- An eval would need more than a minimal consistent edit.

**Open decisions for the owner.** None blocks this batch; nothing here needs a new human-owned decision.

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch2/spec-v1`, after one plan-rethink pass. That pass made one bounded correction to proof choices: it withdrew AC-2 (dev-ask at most 75% of baseline words). That bound pinned an inferred figure rather than approved behavior, and it could conflict with "never lose a rule". AC-2 is left unused so the other labels stay stable. The pass also confirmed:
  - AC-1 encodes the approved 300-character rule.
  - The byte-identity guards (AC-11, AC-15, AC-18 envelope, AC-23) cover only text that no task owns.
  - Every AC is satisfiable at its owning task's boundary, and final-target reruns stay true after later tasks.

  Boundaries, effects, assurance and inherited acceptance are unchanged.
- Next owner: `dev-ticketing`, to project T1 → T2 → T3 into a lean plan. After that: `dev-implementation`, then review, verification and learning, at standard assurance. No live runs.
- Route impact: unchanged.
