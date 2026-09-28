## Lean-down proposal

This is a ranked proposal only. Nothing is implemented; whichever batch you pick needs its own route and approval.

**The main problem is copies of the same text.**

- **Harness details sit inside skills that should work anywhere.** Many portable skills contain instructions that only apply to one agent tool (OMP, which runs these agents, and acpx, which runs Reconcile and Retrace).
- **The same rule is written in 4 to 9 places.** One rule sits in a skill, an ADR, the ADR index, the workflow map, a maintenance notes file and the scanner. Rewording any one copy breaks another. That is exactly why the scanner fails.
- **The core safety design is sound; the wording around it is the bloat.** That design is one approval, a review and then a separate verification, at most one repair attempt, and one test policy (`test-value.md`). Skill text mostly grew from copying these rules into more files.

Sizes checked with `wc`:

| File | Words |
|---|---|
| `retrace` | 7,333 |
| `reconcile` | 5,203 |
| `dev-ask` | 4,345 |
| `dev-implementation` | 2,721 |
| `test-value.md` | 1,107 |
| `dev-tdd` | 367 |

### Ranked findings

You have already decided items 1, 3 and 12; their rows say how to carry them out. Any item that touches Reconcile or Retrace follows the guard in the next section.

| # | Item | Verdict | Evidence | Proposal |
|---|---|---|---|---|
| 1 | `dev-ask/evals/scan_stale_contracts.py` (626 lines) | **Delete** (decided) | It requires 20 exact sentences to appear and hard-codes 58 paths, including ADR numbers, inside a portable skill folder. Nothing runs it: no script, CI job or eval runner. Commits touched it 16 times. `impl-rethink/MAINTENANCE.md` L40 already treats its failing `same-child-rethink` check as the accepted baseline. Every later lean-down item would break it. | Delete it; that removes the failing check. Drop the scanner from ADR-0003's and ADR-0009's affected-contract lists. `MAINTENANCE.md` L40 stays as append-only history. If you want a guard against old terms returning, keep only its list of 27 banned phrases as a small repo-level check outside `skills/`. |
| 2 | OMP/acpx mechanics spread through portable files: `dev-implementation/SKILL.md`, `compact-checklist.md`, `plan-orchestration.md`, `dev-ask/SKILL.md`, dev-ask's `WORKFLOW.md`, `references/agent-return/return.md` | **Move** | The acpx controller sentence appears 9 times, the OMP child-depth check 4 times, the yield rule 4 or more times. `harnesses/omp/agent-return.md` already owns all of it. | Each skill keeps one line: "Use the host's return adapter; if it can't keep the same child, stop `transport-unavailable`." OMP detail lives only in `harnesses/omp/`. The sentence that exempts Reconcile and Retrace from generic child collection stays once, in `harnesses/omp/agent-return.md`. About 150 lines leave skills; `return.md` drops from about 230 lines to about 90. |
| 3 | `dev-tdd/` | **Delete** (decided) | Callers: `dev-implementation` L90 and "use TDD" in dev-ask's direct-stage list (L129). Other mentions: `dev-ticketing` L39 ("explicit TDD authority"), `test-value.md` L3 ("TDD" among its callers) and ADR-0003 L10, L72 and L84. The body only points to `test-value.md`, which already asks that a bug fix's new test fail on pre-fix code when practical. `tests.md` and `mocking.md` are referenced only by its `LICENSE.md`. | Remove the whole folder and every reference listed here. Add no replacement skill or paragraph: `test-value.md` is the only test policy. Done when a search for `dev-tdd` and `TDD` outside archived plans and artifacts finds nothing. |
| 4 | Same rule restated across files | **One owner, pointers elsewhere** | "Compact runs no review, verification or learning": 6 copies. The review → verification → learning order: 5. Papercut timing: 5. The "three role-and-purpose calls need no new consent" exemption: 4. | Apply what already works for `test-value.md` (12 callers, 0 copies): the assurance order belongs to dev-implementation, the route ending to dev-ask, papercut timing to its rule. Everywhere else, one-phrase pointers. |
| 5 | `dev-ask/SKILL.md` | **Rewrite** (about −40% [INFERENCE]) | Several lines exceed 768 characters, and the read tool cut them off. It restates implementation internals (attempt 2, verifier repair, recovery, fan-in). The same classification appears 3 times: the ordered list, the "near misses" paragraph, and the route-outcome list. | One trigger → owner table, compact disqualifiers by reference, the Route Overview template, and the reapproval triggers. Implementation rules point to dev-implementation. Rule of thumb: one rule per line, under about 300 characters. |
| 6 | Stale authority links in ADRs 0001–0010 and `INDEX.md` | **Cut** | About 10 `local://` session-file citations (those files aren't in the repo), 5 SHA-256 hashes, and revision ids like `v3.1` and `spec-v3`. The same "Current governing authority: local://…" line is repeated in 6 ADRs. | Replace each with "Approved by the owner on <date>; history in git." Link only specs stored in the repo. Delete INDEX's "Current evidence baseline" section. This undoes my A2 citation, which is the same kind of stale link. |
| 7 | Five plan rules (`plan`, `plan-impl-spec`, `plan-repo-storage`, `plan-omp-transport`, `plan-grok-transport`) | **Merge; move transport** | Each opens by pointing to `plan.md`. `repo-storage` repeats OMP transport steps; the Grok rule repeats `repo-storage`; the archive bans appear in 4 files. `plan.md` is scoped to every path (`paths: ["**"]`). | One portable plan rule and one plan grammar (with the validator). OMP and Grok draft-copy steps move to `harnesses/<host>/`. Narrow the scope to `.agents/plans/**` or remove it. |
| 8 | `reconcile` and `retrace` | **Split into method and driver, under the guard** | Both only run under the OMP acp-controller: exit codes, the JSON schema, `dispose`, `/Users/kim` paths, SHA-256 locators. `retrace` copies reconcile's controller text and its delegated-control section. The controller reads its prompt templates from `reviewer-protocol.md` and `retrace/SKILL.md` and pulls named headings from both files into them. | Keep the review and evaluation method in each skill (target about 150–250 lines each). Move the controller I/O the root session needs (request JSON, `cli.mjs` calls, exit codes, resume and dispose) into one driver file under `harnesses/omp/acp-controller/` that each skill loads at run time. A README the skills don't load would break both. The prompt markers and the headings they pull in stay in their current files. |
| 9 | `dev-ask/evals/` (`evals.json`: 4,246 lines, 85 cases, plus 85 fixture folders) | **Shrink** | Every fixture `case.json` repeats text already in `evals.json`; only `registry.md` and `answer.txt` are unique. Every case repeats the same 5-line rubric. Some groups differ by one trigger word (reapproval: 10 cases). Some cases use OMP-only terms. There is no runner. | State the rubric once. Turn each trigger group into one table-driven case. Move the OMP cases to harness evals. Target 30–40 cases. Delete the copied fixtures. |
| 10 | `dev-test-audit` A-first loop | **Merge** | The 7-step loop is written in `SKILL.md`, `audit-protocol.md` and `WORKFLOW.md`. The skill itself calls the protocol "the sole audit-loop contract". | `SKILL.md` keeps intake, scope and boundaries, and points to the protocol. |
| 11 | `INDEX.md` question table and execution map | **Cut** | 20 question rows restate decision contents, and the execution map duplicates dev-ask's `WORKFLOW.md`. | Keep a record table, the precedence list and the supersession rules (about 35 lines). |
| 12 | dev-ask `references/execution-flow.md` and `WORKFLOW.md` | **Delete `execution-flow.md` (decided); shrink `WORKFLOW.md`** | Two human maps that are never loaded at runtime. Both restate OMP details and other rules. Links to `execution-flow.md`: dev-ask `SKILL.md` L270, `WORKFLOW.md` L62 (L199 also names it), ADR-0001 L92 and L153, ADR-0004 L11, L34 and L49, ADR-0007 L53, ADR-0009 L65, `INDEX.md` L39, and the scanner. | Delete the file and every link. Amend ADR-0004 D23 so `WORKFLOW.md` is the only human map, and make "human maps" singular in ADR-0002 and ADR-0003. Cut `WORKFLOW.md` to one short map with no copied rules; move its ADR decision map (L64, L77–84) to `docs/adr`. |
| 13 | `grill-me` and `grill-with-docs` | **Merge into `dev-grilling`** | Each is a one-line wrapper. dev-ask routes only to them, while 5 other skills call `dev-grilling` directly. | dev-ask routes to `dev-grilling` with "read repository evidence when it bears on the decision". Keep `grill-me` only as a name you can type, if you want. |
| 14 | `route-impact` explanation in 8 support skills; the plan-rethink paragraph in 3 skills | **Define once** | Near-identical paragraphs in each. | `route-impact` is defined in `dev-handoff`; the plan-rethink rule lives in `plan-rethink.md`. Each skill keeps one line. |
| 15 | plan-rethink on compact direct work | **Drop for compact** | Compact work gets 2 rethink passes (plan-rethink, then the code-and-test rethink). The plan-rethink steps for sizing and ownership do nothing for a single-child contract. | Keep plan-rethink for delegated spec, ticket and plan authors only. A small loss of safety; the code-and-test rethink still runs. |
| 16 | `dev-continual-learning` L42–60; `dev-verification` L60–85; `dev-handoff` L43/L46 and L51–57 | **Rewrite** | Each restates another file: dev-handoff's headings, `execution-recovery.md`, or itself (L43 = L46). | Replace each with a short pointer. |
| 17 | `dev-integration` (about 80 lines) | **Cut** [INFERENCE: unused] | Used only as a direct stage. An eval forbids it on the ordinary route. No upstream equivalent. | An ordinary fan-in implementation task covers merges. Upstream `resolving-merge-conflicts` is available if a merge skill is ever needed. |
| 18 | Harness-specific text in portable skills | **Move** | `dev-research`: Atlas (L34–42, L74). `improve` L12: `/Users/kim`. "OMP `/skill:x`, Grok `/x`" lines in 4 skills. `craft-name`: hard-coded naming taste. `papercut/WORKFLOW.md` L34: ADR numbers. About 10 skills: `~/.agents/...` paths. | Move to harness adapters or personal rules. Use `skill://` or relative references. `omp-update` stays where it is, unchanged. It is OMP-only by design, skills install from `~/.agents/skills`, the controller's version refusal and `versions.mjs` point to its path, and its live-run prompts need `/skill:reconcile` and `/skill:retrace`. |
| 19 | `product-ask` family: papercut settlement text | **Cut** | About 5 paragraphs in `product-ask`, plus repeats in `product-grilling` and `product-prd`, duplicate papercut's own resolve rules. | "Papercut results pass through unchanged; settle them with `papercut` resolve." |
| 20 | Minor cleanup | **Small fixes** | `harnesses/grok/personas/` and `roles/` are empty. `human-facing-language.md` overlaps `AGENTS.md` Reporting. `.agents/AGENTS.md` mentions "five ACTIVE ADRs, seven-event envelope", which is stale. `mermaid.md` hard-codes a `~/.dotfiles` path. `agent-return.md` has 15 links pinned to exact lines of oh-my-pi v18.3.0. `plan-artifact-sync.test.js` checks full message text and `config.yml` wiring. `grok/config.toml` uses a repo-relative `prompt_file`. | Delete, fold in or move each. In `agent-return.md`, drop the line anchors but keep the file-level citations and the one source version; `omp-update` steps b and h use them. For the test, check error codes rather than message text. `packed-label.md` stays: six skills and the controller's rendered record use it. |

### Reconcile and Retrace guard

Both work today. Items 2, 8 and 20 touch them, and item 18 would if its path cleanup reached `reconcile`, `retrace` or `omp-update`. Every such change keeps these intact:

- **Reviewer prompts:** `reconcile/references/reviewer-protocol.md` keeps the `<!-- prompt:* -->` markers `initial`, `rethink`, `later`, `source`, `reask` and `dispute`, and the four headings the controller pulls into them by exact name: "Reviewer role and authority", "Review-turn packet", "Complete response contract" and "Review passes and yield return".
- **Scope prompts:** `retrace/SKILL.md` keeps the markers `evaluate`, `continue`, `reask` and `normalize`, and the headings pulled in by exact name: "Finding eligibility", "Evidence boundary", "Method", "Readiness", "Result" and "Normalize and approve".
- **Uniqueness:** each of those markers and headings appears exactly once in its file. A new heading inside a prompt section cuts that prompt short.
- **Rethink path:** `rethink/SKILL.md` stays at `/Users/kim/.dotfiles/.config/agents/skills/rethink/SKILL.md`, which `controller.mjs` hard-codes.
- **Root-session instructions:** `reconcile/SKILL.md` and `retrace/SKILL.md` keep giving the root session its `cli.mjs` calls (`roles`, `reconcile` or `retrace`, `resume`, `dispose`), directly or through a file they load.
- **Rendering:** `references/packed-label.md` stays; the Reconcile brief and the controller's rendered record follow it.
- **Controller:** no item changes the acp-controller code, `cli.mjs` or `lib/versions.mjs`.
- **omp-update:** stays at `skills/omp-update/` with its live-run prompts unchanged. `harnesses/omp/agent-return.md` keeps file-level citations and its source version for omp-update's steps b and h.

Proof for each such change, before it counts as done:

1. `npm test` in `harnesses/omp/acp-controller` passes: the preflight, reconcile and retrace suites.
2. `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` from the repository root exits 0. The suites stub the prompt loader, so this is the offline check that the real protocol and Retrace files still load. It launches nothing.
3. A change to Reconcile or Retrace skill or protocol text also needs omp-update's live runs, run by you: R1 and R2 for Reconcile, R3 for Retrace.

### Outside sources: one maintained file

The source references are in three places, in three formats:

- `impl-rethink/MAINTENANCE.md`;
- 9 `LICENSE.md` files (8 once `dev-tdd` goes);
- `product-ask/WORKFLOW.md` L160–175.

The Matt Pocock repo is pinned to two different commits. Once `dev-tdd` goes, `ed37663` is in six `LICENSE.md` files (`dev-codebase-design`, `dev-diagnosing-bugs`, `dev-domain-modeling`, `dev-improve-codebase-architecture`, `dev-prototype`, `wayfinder`). `bfdaef8` is in `dev-grilling`, `dev-triage` and the `product-ask` source list.

**Proposal:** create one file, `.config/agents/SOURCES.md`, with these columns:

- source URL;
- pinned commit and date;
- the local skills that use it;
- what was adopted and what was rejected, with the reason;
- the license.

The `LICENSE.md` files keep only the MIT notice plus one source line. The `product-ask` source list points to `SOURCES.md`. `MAINTENANCE.md` is append-only under ADR-0004 D23, so it gets one new entry pointing to `SOURCES.md`, and D23's source-row rule names `SOURCES.md`.

I couldn't find the Cursor article in the repo or in memory, so I used [Best practices for coding with agents](https://cursor.com/blog/agent-best-practices).

**How local skills compare with the outside sources:**

- **Where they are right:**
  - Pocock: small, composable skills, each owning its own procedure.
  - Cursor: plan, approve, build, with tests as the goal; add rules only for mistakes that recur.
  - The local router does the opposite: it restates every stage's rules.
- **Where local rules go beyond both, justifiably:**
  - review, then a separate verification against a fixed set of checks;
  - the same child owns any repair;
  - explicit reapproval triggers;
  - rules for which tests to keep permanently.
- **Drift from upstream:**
  - Close to upstream: `dev-prototype`, `dev-domain-modeling`, `dev-diagnosing-bugs` phases 1–4.
  - Gained 30–50% routing text: grilling, triage, diagnosis intake.

### Workflow after lean-down

The changes simplify compact tasks the most:

| Measure | Compact task now | Compact task after | Standard planned task (3 tasks) |
|---|---|---|---|
| Approvals | 1 | 1 | 1 |
| Handoffs between agents | 4 | 4 | about 26 |
| Rethink passes | 2 | 1 | 6 |
| Reference-file reads | about 11 | about 5 [INFERENCE] | — |

The target shape, by stage:

1. **Route:** dev-ask classifies the request with one table and shows one Route Overview.
2. **Missing prerequisites only:** requirements, spec, tickets or diagnosis run only when missing. Each is a standalone skill that returns a Handoff.
3. **Implement:** dev-implementation assigns each code task to a child. The child implements it, does one code-and-test rethink and runs its checks. At most one repair attempt is allowed.
4. **Assure (standard or high only):** one review, then one verification (the same verifier closes any repair), then one learning pass.
5. **Finish:** papercut timing is owned by its rule, and the completion renderer produces the report.

Three things change underneath:

- `test-value.md` is the only test policy; `dev-tdd` is gone.
- Host mechanics exist only in `harnesses/<host>/`, except `omp-update` and what the guard keeps in `reconcile` and `retrace`.
- Evals check behavior and never exact wording.

### Keep as-is

- **Workflow core:**
  - `test-value.md` (its caller list only loses "TDD");
  - the four `impl-rethink/*` prompts and `plan-rethink.md`;
  - the Route Overview template and reapproval triggers;
  - `completion-presentation-input.md`;
  - the `dev-handoff` format.
- **Reconcile and Retrace:** everything the guard lists, including `rethink` at its current path, `packed-label.md` and `omp-update`.
- **Skills that earn their size:**
  - `dev-shipping`;
  - the fixed-check sections of `dev-verification`;
  - `dev-codebase-design` and `dev-prototype`;
  - `dev-ticketing`;
  - `rethink`, `recap`, `show-me` and `wayfinder`.
- **Tested scripts:** the acp-controller code and its tests; `papercut_ledger.py`, `executor_plan.py`, `render.py` and `decode.py` with their tests.
- **Rules:** `git.md` and `git-state-change.md`.
- **ADRs:** 0005, 0008 and 0010's decision section.

### Other recommendations

- **One test command.** Add a single command that runs the automated test suites: node (acp-controller), bun (plan sync) and the Python script tests. Today nothing runs them together. None of the 17 `evals.json` files has a runner, so treat them as documentation.
- **ADR format.** Limit ADRs to the decision, the reason, the rejected alternatives and "reopen when". No text that repeats skills. ADR-0002's D21 should link to the adapter instead of restating OMP mechanics.
- **Invocation flag.** Mark exact-name-only skills with Pocock's `disable-model-invocation` frontmatter instead of prose in their descriptions.
- **Re-vendor Pocock-derived skills.** Update them against one upstream commit, and record each local change in `SOURCES.md`.

Some limits on the evidence:

- Line counts for items 2, 5 and 8 come from the subagents' reads, not `wc`.
- Item 17 ("unused") is inferred from callers.
- I didn't check whether the deterministic tests pass during this survey. `executor_plan` and plan-sync passed earlier today.

**Which items do you want to pursue?** Items 1, 3 and 12 are decided. Suggested first batch: 1, 3, 12, 2 and 4, which fixes the scanner and unlocks the rest. Item 2 needs the guard's proof.