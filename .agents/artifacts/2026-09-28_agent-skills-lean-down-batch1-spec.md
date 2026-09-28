# Agent-skills lean-down, batch 1: technical specification

- **Revision:** `agent-skills-lean-down-batch1/spec-v1`
- **Date:** 2026-09-28
- **Assurance:** standard
- **Baseline:** repository `HEAD` `4c0d815`, clean except the untracked proposal artifact. Every line number below refers to that baseline.

## 1. Authority and approved outcome

**Authority.**

- The reviewed, human-approved proposal [`2026-09-28_agent-skills-lean-down-proposal.md`](2026-09-28_agent-skills-lean-down-proposal.md), SHA-256 `a1efc66c6e5546f83bb32e22d0b71e24a7d201f5655715c5b3d32cb66b0180f1` (checked). Batch 1 is its items 1, 3 and 12 (decided), items 2 and 4, and its "Reconcile and Retrace guard" section. Nothing else in the proposal is in scope.
- These human decisions are binding:
  - Delete `dev-tdd` entirely, together with every reference to it. Add no replacement paragraph: `test-value.md` is the only test policy.
  - Delete `dev-ask/references/execution-flow.md` and every link to it. `dev-ask/WORKFLOW.md` becomes the only human map.
  - Delete `dev-ask/evals/scan_stale_contracts.py`. Its failing `same-child-rethink` check goes with it.
  - Reconcile and Retrace keep working. This batch keeps everything the guard lists. It makes no change to the acp-controller code, `cli.mjs`, `lib/versions.mjs`, `omp-update`, or any Reconcile or Retrace skill or protocol text.
- Owner intent:
  - Skills stay lean, robust, agnostic to agent, harness, repository and topic, and free of brittle exact wording.
  - Governing rules that live outside skills stay outside skills.
  - External sources inform the work but are not gates.
- Governing contracts: `docs/adr/INDEX.md` together with ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0007 and ADR-0009. ADR-0004 D23 owns the human-map relationship. This batch amends D23 in place, because the human authorized "WORKFLOW.md becomes the only human map".

**Outcome.** When the batch is done, all of the following hold:

1. The scanner, `dev-tdd` and `execution-flow.md` are gone from live files, and so is every reference to them.
2. The OMP and acpx host mechanics live only in `harnesses/omp/agent-return.md`. Portable skills keep one host-return pointer. The Reconcile/Retrace exemption sentence appears exactly once, in the adapter.
3. Each of the four restated rules has exactly one owner. Every other file carries a one-phrase pointer instead of a copy.
4. `dev-ask/WORKFLOW.md` is one short human map with no copied rules. Its ADR decision map is replaced by a pointer to `docs/adr/INDEX.md`.
5. All deterministic suites and guard checks still pass.

**Non-goals.** This batch leaves the following unchanged:

- Proposal items 5–11 and 13–20.
- The ADR `local://`, hash and revision cleanup (item 6).
- The INDEX question table and "Current generic execution map" (item 11).
- ADR-0002 D21's own restated OMP text ("Other recommendations").
- The `dev-ask/evals` shrink (item 9).
- `SOURCES.md`.
- `~/.agents/...` path cleanup (item 18).
- Other skills' OMP mentions, such as `craft-rule`, `mnemopi-*` and plan rules (item 18/7).
- `dev-continual-learning` text (item 16).
- The optional banned-phrase guard offered in item 1. The human did not request it.

## 2. Current system and constraints

"Live files" means `.config/agents/**`, `docs/adr/**`, `.agents/AGENTS.md` and `.agents/GENERIC-AGENTS.md`. The following are not live:

- `.agents/plans/**` (plans, active or archived);
- `.agents/artifacts/**`, including this spec and the proposal;
- `.agents/papercuts.json` (ledger data);
- `.scratch/**` (historical research notes);
- `archive/`;
- the append-only journal `.config/agents/references/impl-rethink/MAINTENANCE.md`, which L40 keeps as history.

Git-ignored files, such as `node_modules` and `__pycache__`, are not live either.

Live references found by `git grep -P 'dev-tdd|TDD|execution-flow|scan_stale_contracts'` at the baseline:

| File | Lines | Term |
|---|---|---|
| `.config/agents/skills/dev-tdd/**` (`SKILL.md`, `LICENSE.md`, `tests.md`, `mocking.md`) | whole folder | dev-tdd |
| `.config/agents/skills/dev-implementation/SKILL.md` | L90 (last sentence) | TDD, dev-tdd |
| `.config/agents/skills/dev-ask/SKILL.md` | L129 (`use TDD, `); L270 | TDD; execution-flow |
| `.config/agents/skills/dev-ask/WORKFLOW.md` | L62 (second sentence), L199 (`and the human execution map`) | execution-flow |
| `.config/agents/skills/dev-ticketing/SKILL.md` | L39 (`and explicit TDD authority`) | TDD |
| `.config/agents/skills/dev-implementation/references/test-value.md` | L3 (`TDD, `) | TDD |
| `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` | whole file | scanner |
| `docs/adr/0001-…` | L92, L153 | execution-flow |
| `docs/adr/0003-…` | L10, L72, L84; L85 (`stale-contract scanner`, `human maps`) | TDD, scanner |
| `docs/adr/0004-…` | L11, L34, L49; L35 (`the human maps`) | execution-flow |
| `docs/adr/0007-…` | L53 | execution-flow |
| `docs/adr/0009-…` | L65; L68 (`Stale-contract scans`) | execution-flow, scanner |
| `docs/adr/0002-…` | L131 (`Human maps`) | plural map |
| `docs/adr/INDEX.md` | L39 | execution-flow |

The `dev-ask/evals` files (`evals.json`, fixtures) quote none of the deleted paths and none of the moved text as file content. Their OMP cases (`B-LEAN-REVIEW-REPAIR`, `B-LEAN-VERIFIER-REPAIR`) describe behavior that stays true once the adapter owns the text, so they need no edits. The ignored `dev-ask/evals/__pycache__/scan_stale_contracts.cpython-314.pyc` exists.

**OMP/acpx text in portable files (item 2).** The adapter `harnesses/omp/agent-return.md` already holds each rule below. Its matching sections, by line, are:

- depth gate: L129–134;
- direct native `yield`: L162–169;
- request rules: L171–177;
- receipt dispatch: L215–224;
- first-row and `agentUrlId` rule: L235–241;
- held IDs: L243–248;
- the no-job wait stop: L260–273;
- same-turn wait: L76–98;
- no token or restatement branch: L283–285.

Copies of that text sit in these portable files:

- `skills/dev-implementation/SKILL.md`: L18–24 (the whole OMP gate paragraph); L80–83; L135–142 (the acpx sentence, plus "On OMP use child-bound wake jobs…"); step 2 L147 (from "On OMP every terminal return…" to the end); step 4 L150–163; step 5 L164; step 6 L165 (the OMP and one-outstanding-request clauses); L183–195 (the OMP attempt-2 paragraph).
- `skills/dev-implementation/references/compact-checklist.md`: item 3 L8–11; item 4 L12, from "On OMP use `write agent://<child>`" through "…neither capability means `transport-unavailable`."; L13–32.
- `skills/dev-implementation/references/plan-orchestration.md`: L10–16; L46–65; attempt-2 step 2 L75 (after its first sentence); step 3 L76; L80 (the OMP sentence).
- `skills/dev-ask/SKILL.md`: L67–70 (the acpx sentence).
- `skills/dev-ask/WORKFLOW.md`: L24–32, L117–140. This file is rewritten under item 12 (T3).
- `references/agent-return/return.md`: L51–55 (the "Retrace and Reconcile" section); L72–103 (the OMP paragraph); L107 (`an OMP fallback`).
- `harnesses/omp/agent-return.md` itself has the acpx sentence 5 times: L40–43, L135–138, L286–288, L401–403 and L446–448.

At the baseline, the acpx sentence "Reconcile and Retrace run under their acpx controller" appears 12 times in live `.md` files, after whitespace is normalized. Eleven are in `.config/agents` and one is in ADR-0002 L64, which is out of scope.

**Restated rules (item 4).** Each rule already has an owner and copies elsewhere:

- **R1 — compact runs no review, verification or learning.** Owner: `dev-implementation/SKILL.md` L208. Copies:
  - `compact-checklist.md` L36;
  - `plan-orchestration.md` L100;
  - `dev-ask/SKILL.md` L253;
  - `dev-ask/WORKFLOW.md` L147;
  - `execution-flow.md` (deleted in T1).
- **R2 — standard/high order is review → verification → learning.** Owner: `dev-implementation/SKILL.md` L210–216. Copies: `plan-orchestration.md` L101–103; `dev-ask/SKILL.md` L76 and L253; `WORKFLOW.md` L149–155. The route suffix in `dev-ask/SKILL.md` L133/L135 is the route ending that dev-ask owns, so it is not a copy.
- **R3 — papercut timing.** Owner: the always-applied rule `.config/agents/rules/papercut.md`. Copies:
  - `dev-implementation/SKILL.md` L167 and L201–202;
  - `compact-checklist.md` L35;
  - `plan-orchestration.md` L81;
  - `dev-ask/WORKFLOW.md` L142–143 and L181–183;
  - `papercut/SKILL.md` L12–15 and L17 (its boundary-definition sentences);
  - `papercut/WORKFLOW.md` L5 (its first three sentences), L11 (after "owner") and L15 (step 1).
- **R4 — the role-and-purpose collection exemption.** Owner: `dev-implementation/SKILL.md` L119–138 ("Owner-directed return preflight"). Copies:
  - `compact-checklist.md` L12 ("This exact collection needs no additional consent…") and L33;
  - `plan-orchestration.md` L35–42 and L92–93;
  - `dev-ask/SKILL.md` L58–66;
  - `dev-ask/WORKFLOW.md` L19–28;
  - `harnesses/omp/agent-return.md` L278–281 and L405–408.

**Guard facts.** The guard checks all pass at the baseline:

- The reviewer-protocol and Retrace markers and headings each appear exactly once.
- `controller.mjs` hard-codes `RETHINK_SKILL_PATH`.
- `agent-return.md` has 15 `blob/v18.3.0` citations.

**Verified commands.** Each baseline result below was run on 2026-09-28:

- `npm test` in `harnesses/omp/acp-controller` (`node --test "test/*.test.mjs"`) gave 51 pass and 0 fail, in about 170 s.
- `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` exited 0.
- `test_executor_plan.py` ran 14 tests: OK.
- `test_papercut_ledger.py` ran 19 tests: OK.
- `bun test` in `harnesses/omp/extensions` gave 20 pass.

## 3. Architecture and ownership

Ownership after the batch:

| Concern | Sole owner | Everyone else |
|---|---|---|
| Portable return contract (declared bodies, lifecycle facts, extraction, retention, authority boundary, token path for correlation-capable hosts) | `references/agent-return/return.md` | load it at the return seam |
| OMP host mechanics (depth gate, direct `yield`, receipts, wake jobs, no-job stop, same-cell collection, request rules) | `harnesses/omp/agent-return.md` | reached only through `return.md`'s single adapter link |
| Reconcile/Retrace exemption from generic child collection | one sentence in `harnesses/omp/agent-return.md` "Allocation, addressability, and turns" (L39–43) | none |
| R1 compact assurance, R2 assurance order | `dev-implementation/SKILL.md` `## Assurance` | pointer "per `dev-implementation` Assurance" |
| Route ending (route suffix per assurance) | `dev-ask/SKILL.md` L133–135 | unchanged |
| R3 papercut timing and owner | `rules/papercut.md` (always applied, so every agent sees it) | pointer "per the papercut scheduling rule" |
| R4 exemption purpose list | `dev-implementation/SKILL.md` `## Owner-directed return preflight` | pointer to that section |
| Human map | `dev-ask/WORKFLOW.md` (only map) | ADR decision IDs live in `docs/adr/INDEX.md` |

Dependency direction runs one way. Skills → `return.md` → the host adapter. Skills never link the adapter directly. Pointers target the owner; owners never point back to copies. No rule moves from a rule or ADR into a skill.

## 4. Interfaces, data, invariants and errors

The interfaces here are prose load paths and link targets.

- **Host-return pointer.** `dev-implementation/SKILL.md` keeps exactly one host-return pointer sentence, in `## Intake`, replacing the last sentence of L50. Its meaning: load the portable agent-return contract (relative link `../../references/agent-return/return.md`) and the host's return adapter for every child launch, follow-up and collection; if the host cannot keep the same child, stop `transport-unavailable`. The wording is free; the link and the stop term are required.
  - `compact-checklist.md` item 3 and `plan-orchestration.md` Enter step 3 keep the host-neutral `transport-unavailable` sentences they already have.
  - `dev-implementation/SKILL.md` L16 (required-owner continuity) stays.
- **`return.md`.** Keep its only OMP mention as the adapter link on L10.
  - Rewrite "Host-selected implementation follow-ups" as host-neutral. It covers the implementation follow-ups (the authorized attempt-2 candidate, the implementation-rethink Handoff and an already-authorized same-child recovery return). Bind child, controller/receiver, task, attempt, operation/report identity, phase and declared response schema before sending. The loaded host adapter owns the capability gate, delivery-outcome dispatch, collection, registration failures, the missing-reply stop and identity binding. Job settlement is neither task completion nor disposal.
  - Keep L105–109 and change "is an OMP fallback" to "is a fallback for a host that uses completion jobs".
  - Delete the "Retrace and Reconcile" section.
  - Everything else is unchanged.
- **The adapter's single acpx sentence.** Keep L39–43 and delete the other four occurrences. At L401–403 the section then opens with its "Except for…" paragraph. Collapse the double blank line at L444–445.
  - T3 turns L278–281 into a pointer: these collections use the `dev-implementation` owner-directed return-preflight exemption unchanged.
  - T3 turns L405's "the three exact `dev-implementation` controller collection purposes defined above" into "the collections that `dev-implementation` exempts in its owner-directed return preflight".
  - Evidence scope (L10–24), the 15 `blob/v18.3.0` citations and every host rule listed in §2 must stay.
- **dev-implementation after T2.** No OMP names or host mechanics. The steps say "collect through the loaded host adapter's collection rules, then admit exact task/attempt/owner/receiver/phase once".
  - The host-neutral attempt-1 preflight (declared response-object schema, non-isolated resumable child, exact bindings) stays.
  - Step 6 and L190–195 keep only a pointer to `return.md` for correlation-capable hosts.
- **Pointer phrases for item 4.**
  - R1/R2: "per `dev-implementation` Assurance".
  - R3: "per the papercut scheduling rule".
  - R4: "the `dev-implementation` owner-directed return-preflight exemption".
  - The exact wording is free if the meaning is kept. The checks look only for the absence of copies.
- **dev-ask pointer edits (T3).**
  - L58–66 becomes one sentence: the approved implementation route also covers the collections `dev-implementation` exempts in its owner-directed return preflight, so do not re-enter router intake or seek further human consent for them. Keep the sentence "A finite host observation window ending does not reopen routing or prove a missing report."
  - L76 gate 3 ends at "select standard or high".
  - In L253, delete the two sentences "Compact has no independent review, verifier, or learning…" and "Standard and high require the one review before…". Keep "compact records `Learning: skipped for compact`" by folding it into the existing "selected assurance path is settled" clause as "(per `dev-implementation` Assurance; compact records `Learning: skipped for compact`)".
- **dev-implementation pointer edits (T3).**
  - Step 8 L167 becomes "Papercut accounting follows the papercut scheduling rule."
  - In L201–202, replace "The same child then performs papercut accounting." with the same pointer.
- **compact-checklist pointer edits (T3).**
  - Item 7 becomes the same papercut pointer.
  - Item 8 keeps its route-end and stop text but replaces its R1 sentence with "Compact assurance is per `dev-implementation` Assurance."
  - In item 4 and item 5, the exemption sentences become R4 pointers.
- **plan-orchestration pointer edits (T3).**
  - L35–42 and L92–93 become R4 pointers.
  - Close step 2 (L81) becomes the papercut pointer.
  - L100–103 become one bullet: "Run assurance per `dev-implementation` Assurance for the approved level; each role returns to the concrete controller."
  - L104 (plan completion) stays.
- **Papercut family (T3).**
  - `papercut/SKILL.md`: L12–15 and the boundary-definition sentences in L17 become one pointer: "The papercut scheduling rule decides when, and by whom, one `capture` look runs." The rest of L17 stays (skill ownership, and `Papercut: none` without ledger access). The description on L3 stays because it drives triggering.
  - `papercut/WORKFLOW.md`: in L5, L11 and L15, replace the timing clauses with the same pointer.
- **`dev-ask/WORKFLOW.md` rewrite (T3).** One short, plain-text human map, no Mermaid, at most 800 words, containing:
  1. a non-runtime notice: executable skills and rules win, and a mismatch is an edit-time defect;
  2. the common-routes list (the current L46–58, condensed);
  3. a five-stage flow — route (`dev-ask`), prerequisites only when missing, implement (`dev-implementation`), assure (`dev-code-review`, `dev-verification`, `dev-continual-learning` per `dev-implementation` Assurance), finish (papercut scheduling rule; `completion-presentation`) — each stage naming its owner;
  4. separate routes: `dev-test-audit` (the audit protocol owns the loop) and `dev-shipping`; custom controllers (`reconcile`, `retrace`) own their contracts;
  5. one pointer to `docs/adr/INDEX.md` for durable decisions and IDs;
  6. one maintenance line: change the owning skill or rule, then this map and the index, in one change.

  It carries no OMP or acpx text, no ADR numbers or D-IDs, and no copied procedure. That includes attempts, repair, recovery, return collection, the learning adapter, the five-field input, the audit steps and the journal convention. INDEX's records and decision-discovery tables already cover every D-ID in the current L73–84 table (D01, D02, D05, D10–D20, D26, D06, D08, D09, D21, D29, D30, D03, D04, D22, D28, D07, D23, D24, D27), and the INDEX L20 and L23 rows cover L64's custom boundary. Nothing needs to be added to `docs/adr`.
- **ADR and INDEX edits (T1).**
  - **ADR-0001:** L92's last sentence becomes "`dev-ask/WORKFLOW.md` is the non-runtime human map."; L153 becomes "- `.config/agents/skills/dev-ask/SKILL.md` and `WORKFLOW.md`."; `**Updated:**` becomes 2026-09-28.
  - **ADR-0002:** L131 `Human maps,` becomes `The human map,`.
  - **ADR-0003:** delete `` `dev-tdd`, `` from L10 and L84. L72: `Runtime rethink, review, TDD, and audit references` becomes `Runtime rethink, review, and audit references`. L85 becomes "- `dev-ask`, its human map, and focused evals." `Updated` becomes 2026-09-28.
  - **ADR-0004:**
    - L11: delete `` `dev-ask/references/execution-flow.md`, ``.
    - L34 (D23): "Keep `dev-ask/WORKFLOW.md` as the single concise, non-runtime human map. Executable `dev-ask`, `dev-implementation`, and stage skills remain authoritative. The map runs no work, stores no state, and wins no conflict."
    - L35: `the human maps` becomes `the human map`.
    - L49 becomes "- `.config/agents/skills/dev-ask/WORKFLOW.md` for the non-runtime human map."
    - `Updated` becomes 2026-09-28.
  - **ADR-0007:** L53 becomes "- `.config/agents/skills/dev-ask/WORKFLOW.md` and caller projections."
  - **ADR-0009:** L65 becomes "- `.config/agents/skills/dev-ask/SKILL.md`, `WORKFLOW.md`, and focused evals."; L68 becomes "- ADR discovery."
  - **INDEX:** the L39 row's third cell becomes "`dev-ask/WORKFLOW.md`; the map never overrides runtime".
- **Other T1 text edits.**
  - `dev-implementation/SKILL.md` L90: delete "If TDD was explicitly requested, bind `dev-tdd` without adding scope or acceptance."
  - `dev-ask/SKILL.md` L129: delete `use TDD, `. L270: delete the line and its preceding blank line.
  - `dev-ask/WORKFLOW.md`: in L62, delete the sentence "The human execution diagram is …" and change "Neither file runs" to "It does not run"; in L199, delete "and the human execution map" and make "are synchronized projections" singular.
  - `dev-ticketing/SKILL.md` L39: "Preserve project instructions, but do not create…".
  - `test-value.md` L3: "Authoring, implementation, rethink, review, verification, and audit callers…".
- **Invariants.**
  - Every rule deleted from a portable file stays present in its owner (AC-8, AC-10, AC-11, AC-12).
  - No new file, skill, rule, schema, eval or test is created.
- **Errors.** If an edit would need a rule that the owner does not contain, stop and report it; never copy it back into a portable file. If any guard check fails, stop.

## 5. Effects, migration, rollback and compatibility

Allowed effects are limited to edits and deletions of tracked files under `.config/agents/**` and `docs/adr/**`, as listed in §4, plus these local deletions:

- the folder `.config/agents/skills/dev-tdd/`;
- `.config/agents/skills/dev-ask/references/execution-flow.md`, then the empty `dev-ask/references/` directory;
- `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`;
- the ignored `dev-ask/evals/__pycache__/scan_stale_contracts.cpython-314.pyc`.

This batch has no other effects:

- no git staging, commits or pushes;
- no edits to `MAINTENANCE.md` (no new entry is needed, because no impl-rethink file changes);
- no edits to plans, `papercuts.json` or `.scratch`;
- no edits to `.agents/AGENTS.md`;
- no network access;
- no omp-update live runs, because no Reconcile or Retrace skill or protocol text changes.

The cutover is clean: no aliases, stubs or compatibility notes. Rollback is the owner's call through git on the listed paths, since the baseline is `4c0d815`. The implementation performs none.

## 6. Acceptance

The commands run from the repository root. `LIVE` stands for the pathspec `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md ':!.config/agents/references/impl-rethink/MAINTENANCE.md'`. `CFG` stands for `.config/agents ':!**/evals/**' ':!.config/agents/references/impl-rethink/MAINTENANCE.md'`.

**AC-1** — T1
Behavior: The stale-contract scanner and every live reference to it are gone.
Check: `test ! -e .config/agents/skills/dev-ask/evals/scan_stale_contracts.py && git grep --untracked -n -I -P 'scan_stale_contracts|stale-contract' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

**AC-2** — T1
Behavior: `dev-tdd` is deleted and no live file mentions it or TDD.
Check: `test ! -e .config/agents/skills/dev-tdd && git grep --untracked -n -I -P 'dev-tdd|TDD' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

**AC-3** — T1
Behavior: `execution-flow.md` and every live link to it are gone.
Check: `test ! -e .config/agents/skills/dev-ask/references && git grep --untracked -n -I -P 'execution-flow' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

**AC-4** — T1
Behavior: ADR-0004 D23 names `dev-ask/WORKFLOW.md` as the single human map, and ADR-0002/0003 use the singular.
Check: `python3 -c "a=open('docs/adr/0004-canonical-discovery-and-continual-learning.md').read();d=a.split('### D23',1)[1].split('\n## ',1)[0];o=[open(f).read().lower() for f in ['docs/adr/0002-executor-plans-and-orchestration.md','docs/adr/0003-bounded-assurance-and-repair.md']];c=['dev-ask/WORKFLOW.md' in d,'human maps' not in d]+['human maps' not in x for x in o];print('ok' if all(c) else c)"`; expect `ok`.

**AC-5** — T1
Behavior: The append-only journal is untouched.
Check: `git diff --quiet HEAD -- .config/agents/references/impl-rethink/MAINTENANCE.md; echo $?`; expect `0`.

**AC-6** — T2 for the first four paths, T3 for `WORKFLOW.md`
Behavior: The portable skills carry no OMP or acpx mechanics.
Check: `git grep --untracked -n -I -P 'taskDepth|wakeRelay|receipts\[|agentUrlId|Result submitted|acp-controller|acpx|harnesses/omp|write agent://|tool\.yield|No running background jobs|\bOMP\b' -- .config/agents/skills/dev-implementation/SKILL.md .config/agents/skills/dev-implementation/references/compact-checklist.md .config/agents/skills/dev-implementation/references/plan-orchestration.md .config/agents/skills/dev-ask/SKILL.md .config/agents/skills/dev-ask/WORKFLOW.md; echo "exit=$?"`; expect only `exit=1`.

**AC-7** — T2
Behavior: The portable return contract carries no OMP mechanics beyond its single adapter-link line, and `dev-implementation` keeps its link to the portable return contract and the `transport-unavailable` stop.
Check: `python3 -c "r=open('.config/agents/references/agent-return/return.md').read();d=open('.config/agents/skills/dev-implementation/SKILL.md').read();import re;c=[not re.search(r'taskDepth|wakeRelay|receipts\\[|agentUrlId|Result submitted|acp-controller|acpx|write agent://|No running background jobs',r),sum('OMP' in l for l in r.splitlines())==1,'references/agent-return/return.md' in d,'transport-unavailable' in d];print('ok' if all(c) else c)"`; expect `ok`.

**AC-8** — T2
Behavior: The OMP adapter still holds every host rule removed from the portable files, and every pinned-source URL it cited at the baseline.
Check: `python3 -c "import re,subprocess;f='.config/agents/harnesses/omp/agent-return.md';t=open(f).read();b=subprocess.run(['git','show','4c0d815:'+f],capture_output=True,text=True).stdout;u=lambda s:set(re.findall(r'https://github\.com/\S*?/blob/v18\.3\.0/[^)\s]+',s));k=['taskDepth\` 0','taskDepth > 0','transport-unavailable','Result submitted.','details.message.receipts[].outcome','No running background jobs to wait for.','agentUrlId','wakeRelay','write agent://<child>','injected','revived','outputSchema','isolated: true'];m=[x for x in k if x not in t]+sorted(u(b)-u(t));print(m or 'ok')"`; expect `ok`.

**AC-9** — T3
Behavior: The Reconcile/Retrace exemption sentence appears exactly once in `.config/agents`, in the OMP adapter.
Check: `python3 -c "import os,re,subprocess;fs=[f for f in subprocess.run(['git','ls-files','--cached','--others','--exclude-standard','.config/agents'],capture_output=True,text=True).stdout.split() if f.endswith('.md') and os.path.exists(f)];print([(f,n) for f in fs for n in [re.sub(r'\s+',' ',open(f,encoding='utf-8').read()).count('run under their acpx controller')] if n])"`; expect `[('.config/agents/harnesses/omp/agent-return.md', 1)]`.

**AC-10** — T3
Behavior: Compact assurance and the review → verification → learning order are stated only in `dev-implementation`.
Check: `git grep --untracked -l -I -P '(?i)dispatches no independent|no independent review|then one independent .dev-verification|review before the one verifier|one learning assessment in that order' -- CFG`; expect exactly `.config/agents/skills/dev-implementation/SKILL.md`.

**AC-11** — T3
Behavior: Papercut timing and ownership are stated only in the papercut rule.
Check: `git grep --untracked -l -I -P '(?i)(parent|controller) (falls back|fallback|substitutes)|child is unavailable|unavailable-child|child unavailability|after verification and before completion' -- CFG`; expect exactly `.config/agents/rules/papercut.md`.

**AC-12** — T3
Behavior: The role-and-purpose collection exemption is stated only in `dev-implementation`.
Check: `git grep --untracked -l -I -P 'abort-capability|role-and-purpose' -- CFG`; expect exactly `.config/agents/skills/dev-implementation/SKILL.md`.

**AC-13** — T3
Behavior: `WORKFLOW.md` is one short map that names each stage owner, points to the ADR index, and contains no ADR decision map.
Check: `python3 -c "import re;t=open('.config/agents/skills/dev-ask/WORKFLOW.md').read();p=[len(t.split())<=800,'docs/adr/INDEX.md' in t,not re.search(r'ADR-\d{4}|\bD\d{2}\b',t)]+[s in t for s in ['dev-implementation','dev-code-review','dev-verification','dev-continual-learning','completion-presentation','dev-test-audit','dev-shipping','papercut']];print('ok' if all(p) else p)"`; expect `ok`.

**AC-14** — guard; T2 and T3
Behavior: Every marker and heading the guard names appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-15** — guard; T1, T2 and T3
Behavior: The Reconcile, Retrace, rethink, omp-update and packed-label files and the controller are unchanged.
Check: `git status --porcelain -- .config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller`; expect empty output.

**AC-16** — guard; T2 and T3
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, run in the foreground with a timeout ≥ 300 s; expect `fail 0` and exit 0.

**AC-17** — guard; T2 and T3
Behavior: The real protocol and Retrace prompt files still load offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-18** — T1, T2 and T3
Behavior: The plan validator suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

**AC-19** — T1, T2 and T3
Behavior: The plan-sync extension suite still passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-20** — T3
Behavior: The papercut ledger suite still passes after the papercut-family edits.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

`LIVE` and `CFG` are placeholders for the pathspecs defined at the top of this section; substitute them literally. The check for the portable-file OMP absence (AC-6) is split by owner: T2 proves the first four paths and T3 proves `WORKFLOW.md`. The verifier runs the full set once on the final target.

## 7. Test seams

- This batch changes prose, links, deletions and ADR lines only. The behavior is inherently structural: single ownership, links that resolve, and absent references. So the direct checks are static greps and counts, plus the existing deterministic suites for the code-adjacent seams that could break: the prompt loader (AC-16/17), the plan validator, plan-sync and the papercut ledger.
- AC-8 is the content-preservation check. It stops the move from turning into a deletion.
- AC-10/11/12 check that copies are absent, never exact wording. The owners may be reworded freely.
- Permanent tests:
  - No test is added or changed.
  - The scanner is settled as `remove` by human decision. Its contract was exact wording, which is not observable behavior. It had no runner, and its only baseline check was the accepted failure.
  - `dev-tdd/tests.md` and `mocking.md` are guidance documents, not tests.
- No runtime agent behavior can be exercised offline. The load chain skill → `return.md` → adapter is proven by static link presence (AC-7) and the intact adapter (AC-8). [INFERENCE] Agents that follow these pointers behave as before; that is not proven here.

## 8. Implementation boundaries and dependencies

A lean plan with three serial tasks, because shared files force the ordering:

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — deletions and links** (items 1, 3 and 12's deletion) | the deletions in §5; text edits in `dev-implementation/SKILL.md` L90, `dev-ask/SKILL.md` L129/L270, `dev-ask/WORKFLOW.md` L62/L199, `dev-ticketing/SKILL.md`, `test-value.md`; the ADR and INDEX edits in §4 | — | AC-1…5, AC-15, AC-18, AC-19 |
| **T2 — move OMP/acpx mechanics** (item 2) | `dev-implementation/SKILL.md`, `compact-checklist.md`, `plan-orchestration.md`, `dev-ask/SKILL.md` (L67–70 only), `references/agent-return/return.md`, `harnesses/omp/agent-return.md` (acpx dedupe only) | T1 (shares `dev-implementation/SKILL.md` and `dev-ask/SKILL.md`) | AC-6 (first four paths), AC-7, AC-8, AC-9, AC-14…19 |
| **T3 — single-owner pointers and map rewrite** (items 4 and 12's shrink) | pointer edits in `dev-implementation/SKILL.md`, `compact-checklist.md`, `plan-orchestration.md`, `dev-ask/SKILL.md`, `harnesses/omp/agent-return.md` (L278–281, L405), `papercut/SKILL.md`, `papercut/WORKFLOW.md`; full rewrite of `dev-ask/WORKFLOW.md` | T2 (same files; it removes the OMP text that the pointers replace) | AC-6 (`WORKFLOW.md`), AC-10…20 |

**Sizing rationale.** Together the batch reads about 23k words across about 25 files and rewrites four large prose bodies. That is unlikely to fit one reliable fresh context. The shared files block parallel work, and each task is independently checkable at its own boundary, so serial T1 → T2 → T3 is the smallest safe split.

The `WORKFLOW.md` rewrite belongs to T3, not T2: T3 replaces the whole file, so editing its OMP paragraphs in T2 would be wasted work. T1 touches only the link sentences. The guard proof (AC-14…17) runs for T2 and T3 because both edit `harnesses/omp/agent-return.md`.

## 9. Risks, assumptions, stops and open decisions

**Assumptions.**

- *Live scope.* "Live files" means the four roots in §2. The proposal's "outside archived plans and artifacts" is read as excluding historical `.scratch` notes, `.agents/papercuts.json` data and all plan and artifact files.
- *ADR-0002 D21 stays as it is.* It keeps its copy of the acpx sentence and its restated OMP text, so AC-9 is scoped to `.config/agents`. Its rewrite is a later "Other recommendations" item.
- *`return.md` size.* It will not drop to the proposal's estimate of about 90 lines. The host-neutral token path for correlation-capable hosts is not OMP text and stays.
- *`dev-continual-learning` description and L10.* These describe when the skill runs (its trigger), so they stay. Item 16 owns them.
- *Papercut pointers.* The papercut rule is `alwaysApply: true`, which makes a one-phrase pointer safe in every caller.

**Risks.**

- *Pointers could lose behavior.* This is a prose-only regression risk. AC-8 and the owner-presence checks mitigate it. Review should confirm that each deleted clause exists in its owner.
- *Test runtime.* `npm test` takes about 3 minutes. It must run in the foreground with an explicit timeout.
- *Stale pending plan.* The PENDING plan `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md` (L75, L198, L333) cites the scanner. It already cites removed `observe_case.py`/`compare_trace.py`, so it is stale either way.

**Stops.**

- Any guard check fails (AC-14…17).
- Moving a rule would require a rule that the owner lacks.
- Any change would touch the controller, `cli.mjs`, `versions.mjs`, `omp-update`, or Reconcile/Retrace/rethink text.
- Any git state change is required.

**Open decisions for the owner.** None of them blocks this batch.

1. The PENDING checkpoint plan still cites the scanner. Revising or closing it is that plan's own authority, not this batch's.
2. Papercut ledger entry `pc-cb1b8cb02f18d49b` has the deleted scanner as its surface. Resolving it is a separate `papercut resolve` action.
3. Confirm the live-scope reading. If `.scratch/adaptive-agent-workflow/**` must also be scrubbed of "TDD", that is an extra edit to historical notes and is not specified here.

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch1/spec-v1`, after one plan-rethink pass. That pass made one bounded correction to proof choices: AC-7 became a single pass/fail check, AC-8 now compares the baseline citation set instead of pinning a citation count, and AC-16 no longer pins an incidental pass count. It also confirmed three facts: `dev-ask/references/` holds only `execution-flow.md`; `MAINTENANCE.md` L40 stays as history; and the proposal's item-4 owners hold, with dev-ask keeping the route-ending suffix. Boundaries, effects, assurance and inherited acceptance are unchanged.
- Next owner: `dev-ticketing`, to project T1 → T2 → T3 into a lean plan. After that: `dev-implementation`, then review, verification and learning, at standard assurance.
- Route impact: unchanged.

## Erratum 2026-09-28 (human-approved)

AC-9 is owned by T3, not T2: the last duplicate sentence is in `dev-ask/WORKFLOW.md`, which only T3 edits. Its check now skips paths that no longer exist on disk, because files deleted but not yet committed stay in `git ls-files --cached`. Behavior and expected result are unchanged.
