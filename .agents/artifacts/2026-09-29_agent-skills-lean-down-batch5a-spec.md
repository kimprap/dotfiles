# Agent-skills lean-down, batch 5a: technical specification

- **Revision:** `agent-skills-lean-down-batch5a/spec-v2`
- **Date:** 2026-09-29
- **Assurance:** standard
- **Baseline:** repository `HEAD` `edf59e0`, clean. Line numbers refer to that baseline; re-locate by content if lines drift.

## 1. Authority and approved outcome

**Authority.**

- The human-approved proposal [`2026-09-28_agent-skills-lean-down-proposal.md`](2026-09-28_agent-skills-lean-down-proposal.md), ranked items 10, 13, 17, 18 and 20, plus three carried follow-ups (below). Item 9 (dev-ask evals shrink) is batch 5b and out of scope.
- Owner decisions (settled):
  - Item 13: delete both `grill-me` and `grill-with-docs`. `dev-ask` routes to `dev-grilling` with "read repository evidence when it bears on the decision". No alias remains.
  - Item 17: delete `dev-integration` and every reference. An ordinary fan-in implementation task covers merges (proposal row 17).
  - Follow-up A: revert `rules/plan.md` frontmatter to description-only (remove `paths`). Batch-4 O1 evidence: `paths` is inert on OMP and Grok.
  - Follow-up B: `craft-rule` L94 and its eval id 1 recommend a separate "repository-storage companion" the repo no longer uses. Update both to current practice: one portable rule owns storage; host transport lives in `harnesses/<host>/`. (Batch-4 O2.)
  - Follow-up C: `.agents/AGENTS.md` L20's stale "five ACTIVE core workflow ADRs … seven-event session envelope" sentence (item 20).
  - Destinations (route owner, 2026-09-29): Atlas text goes to a new description-only rule `rules/atlas-research.md` (D1); the user's naming taste goes to a new description-only rule `rules/naming-taste.md` (D2); Grok `prompt_file` uses the absolute `/Users/kim/.agents/...` path, since harness config is machine-specific by nature (D3).
- `dev-ask/evals/evals.json` stays valid JSON. Only the cases and fixtures that name a deleted skill change, and only to repair those names. Nothing else in the evals changes (5b owns shrinking).
- Guard: no change to `skills/{reconcile,retrace,rethink,omp-update}/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`. The guard markers stay exactly once. The acp-controller, roles, executor_plan, extensions and papercut-ledger suites stay green.
- Owner intent: lean and host/repo/topic-agnostic portable skills; one owner per rule with pointers elsewhere; never lose a rule.
- Precedent: batch 1–4 specs in `.agents/artifacts/` (structure, `LIVE`, guard ACs, extraction rule, union allowlist). Batch 1 amended ADR decision text in place (ADR-0003 L10/L84, ADR-0004 D23) under item authority; this batch does the same for ADR-0003 D04 and ADR-0001 D11.

**Approved outcome.**

- Three wrapper or stage skills are gone, and every live caller routes to the owner that remains (`dev-grilling`; ordinary child-owned fan-in).
- `dev-test-audit/SKILL.md` keeps intake, scope and boundaries. The loop lives only in `references/audit-protocol.md`.
- Portable skills, rules and references carry no machine path (`~/.agents`, `/Users/kim`, `~/.dotfiles`), no host invocation syntax, no one-user taste and no ADR numbers. Each moved clause has a named owner (§3).
- The small item-20 fixes and the three follow-ups are applied.
- Nothing in the guard changes, and every suite stays green.

**Non-goals.** No new skill, stage or field. No change to grilling, audit, papercut, research, naming or plan semantics beyond the named moves. No eval shrink (5b). No change to `omp-update` or the other guarded paths, to the copy helper, the extension code, `bootstrap`, or historical plans/artifacts. No live host runs.

## 2. Current system and constraints

`LIVE` = `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md bin .config/scripts ':!.config/agents/references/impl-rethink/MAINTENANCE.md'` (as in batch 4). `.scratch/`, `archive/` and historical `.agents/plans|artifacts` are not live.

**How hosts load these files** (unchanged by this batch).

- `~/.agents` is a symlink to `.config/agents`. OMP loads `~/.agents/AGENTS.md` (user level) and `~/.agents/rules/*.md` as rulebook rules (description-driven, `rule://<name>`), and skills from `~/.agents/skills`. Grok loads `~/.grok/AGENTS.md -> ~/.agents/AGENTS.md` everywhere and, inside this repo, every `.grok/rules/*.md` (symlink to `.config/agents/rules`) in full. Codex loads `~/.codex/AGENTS.md -> .config/agents/AGENTS.md`.
- `harnesses/grok/config.toml` is linked to `~/.grok/config.toml` by `.config/scripts/bootstrap` L28. Its two roles set `prompt_file = ".config/agents/skills/dev-test-audit/references/opinion-agent.md"` (L37, L45), a repo-relative path that works only when Grok runs from the repo root. Grok's docs show only a relative example (`.grok/prompts/researcher.md`) and do not say how `prompt_file` is resolved or whether `~` is expanded.
- `harnesses/grok/personas/` and `roles/` are empty, untracked directories. `config.toml` defines roles inline and names neither. `bootstrap` `LEGACY_SYMLINKS` (L50–51) names `roles/planner.toml` and `personas/planner.toml` only to remove old links from `~/.grok`; that stays.

**Item 13 — grill wrappers.** `skills/grill-me/SKILL.md` and `skills/grill-with-docs/SKILL.md` (one body line each) run `dev-grilling` as a "stateless adapter" or a "repository-evidence adapter". Live callers: `dev-ask/SKILL.md` L47 (route row), `dev-ask/WORKFLOW.md` L16–17 (human map), `dev-domain-modeling/SKILL.md` L62 (gate caller list), `dev-grilling/SKILL.md` L40 ("its wrappers"). `dev-grilling` step 1 already finds repository facts with available tools, and its intake already lists the near misses.

**Item 17 — `dev-integration`.** One `SKILL.md` (neutral fan-in of independently verified lineages). Live callers: `dev-ask/SKILL.md` L50 (direct-stage row: trigger word "integrate" and the `dev-integration` clause), eval `R-ARTIFACT-LANE` (a forbidden event and a rubric phrase), ADR-0003 L10 (scope "neutral fan-in" and applies-to list), L40 (D04 sentence), L44 (reopen "fan-in neutrality"), L84 (affected contracts), ADR-0001 L59 (D11 "standalone `dev-integration`"). Ordinary fan-in is already owned by `dev-implementation/SKILL.md` L72, `dev-ticketing/SKILL.md` L30, ADR-0003 D04 (first sentence) and ADR-0001 D11. `docs/adr/INDEX.md` names neither skill.

**dev-ask evals.** `evals.json` is `{"schema","cases"}` with 81 cases, serialized exactly as `json.dumps(d, ensure_ascii=False, indent=2) + "\n"`; so is each `fixtures/<dir>/case.json`. Seven cases name a deleted skill:

| Case | Fields naming a deleted skill |
|---|---|
| `R-GRILL` (fixture `r-grill`) | `expected.first_owner`, `expected.owners[0]`, `expected.route`, `inputs.request` ("Route first to grill-me"), `required_events` `dispatch:grill-me` |
| `R-APPROACH-REFINEMENT` | `expected.first_owner`, `owners[0]`, `route`, `required_events` `dispatch:grill-with-docs` |
| `R-APPROACH-REFINEMENT-NEAR-MISS-DIRECT` | `forbidden_events` `dispatch:grill-me`, `dispatch:grill-with-docs` (adjacent) |
| `R-APPROACH-REFINEMENT-NEAR-MISS-REQUIREMENTS` | same two forbidden events |
| `R-PROTOTYPE-NEAR-MISS` (fixture `r-prototype-near-miss`) | `first_owner`, `owners[0]`, `route`, `inputs.request` ("after grill-me returns"), `required_events` |
| `R-ARTIFACT-LANE` | `forbidden_events` `dispatch:dev-integration`; `rubric[1]` "ordinary dev-integration" |
| `R-GRILL-ROUND-BOUND` | `first_owner`, `owners[0]`, `route`, `required_events`, `rubric[0]` "first to grill-with-docs" |

The two fixtures' `inputs` equal their case's `inputs` at baseline; no other fixture names a deleted skill.

**Item 10 — `dev-test-audit/SKILL.md`** (53 lines). L13 already calls `references/audit-protocol.md` "the sole audit-loop contract". `## A-first orchestration` (L27–41) and `## Read-only result and later fixes` (L43–49) restate the protocol. Only `SKILL.md`, `evals/evals.json`, `references/audit-protocol.md` and `references/opinion-agent.md` exist; the proposal's `WORKFLOW.md` copy is already gone. No file links the two section names.

**Item 18 — harness-specific text in portable files** (complete baseline inventory; every hit is covered by an AC):

- Machine paths in Markdown (`~/.agents`, `/Users/kim`, `~/.dotfiles`), outside the guard and evals: `rules/plan.md` L22, L76; `rules/mermaid.md` L7; `skills/dev-ask/SKILL.md` L200; `skills/dev-code-review/references/review-rethink.md` L5–6; `skills/dev-implementation/SKILL.md` L47, L95, L124; its `references/compact-checklist.md` L8, `execution-recovery.md` L55, `plan-orchestration.md` L47; `skills/dev-specification/SKILL.md` L41; `skills/dev-ticketing/SKILL.md` L41; `skills/dev-test-audit/SKILL.md` L32, L35; its `references/audit-protocol.md` L27; `skills/improve/SKILL.md` L12; `references/impl-rethink/impl-rethink.md` L5, L6, L13; `references/agent-return/return.md` L8.
- Host invocation syntax: `papercut/SKILL.md` L21, `papercut/WORKFLOW.md` L26, `init-ask/SKILL.md` L106, `craft-skill/SKILL.md` L73, `continual-learning/SKILL.md` L75. ADR-0008 D25 (L29–30) already records "OMP `/skill:init-ask` and Grok `/init-ask` use one body".
- ADR numbers: `papercut/WORKFLOW.md` L34 (ADR-0007 D24, ADR-0004 D07, ADR-0009 D27 with the stale "seven-event envelope", ADR-0008 D25, Product P07). No other portable file outside the guard names an ADR number.
- `dev-research/SKILL.md`: `## Optional Atlas capability` L34–42, the template line L62 (`Current/dirty/refreshing/blocked/not applicable`), and the stop condition L74. Atlas is the user's own research store.
- `craft-name/SKILL.md`: `## Default bias for this user` L25–39 (bias bullets and "evidence from prior discussion": Kairos, Talaria, Portolan → Kaira) and `## Example transformations` L69–75 (the same user's names).
- Left in place on purpose: `omp-update` (guard; OMP-only by design); `reconcile`/`retrace`/`rethink` (guard); `craft-rule` and the `mnemopi-*` skills (their subject is OMP rule authoring or OMP memory); `references/agent-return/return.md` L10's link to the OMP adapter (batch-2 design); `harnesses/*` files (host adapters by definition); eval prompts that start `/skill:` (`init-ask`, `product-ask`) and eval fixtures naming `/Users/kim/.agents/AGENTS.md` (eval inputs, 5b scope); `hooks/scripts/ttsr-guard.py`, `completion-presentation/scripts/render.py` (code, not portable Markdown); `.agents/AGENTS.md` (repository guidance, not portable).
- Relative Markdown links from skills and references to `../../references/...` and `../../harnesses/omp/...` are the established pattern (`packed-label`, `completion-presentation-input`, `agent-return`).

**Item 20 — small fixes.**

- `rules/human-facing-language.md` (`alwaysApply: true`): paragraph 1 (familiar, concise, precise language on human surfaces) overlaps `.config/agents/AGENTS.md` `## Reporting` L13. Paragraph 2 (never simplify internal plans, IDs, schemas, code, tool output or agent transport) is not in AGENTS.md. No live file names the rule. Every host that loads the rule also loads user-level AGENTS.md.
- `.agents/AGENTS.md` L20: `docs/adr/INDEX.md` lists nine ACTIVE ADRs, and ADR-0009 is now "Terminal envelope and lean completion protocol".
- `rules/mermaid.md` L7 names `~/.dotfiles/bin/mermaid-check`. The checker (`bin/mermaid-check`) is not on `PATH`; only this rule (and `show-me` through `rule://mermaid`) uses it.
- `harnesses/omp/agent-return.md`: four file-level oh-my-pi citations (L16–19) and eleven links with `#L` line anchors (L132, L356, L359, L362, L369–372, L375–376, L379), all at `blob/v18.3.0`. L13 records the source version. `omp-update` step b (L42) reviews "the files cited in `agent-return.md`" and step h (L61) re-verifies each cited file and keeps the version pin; both work from file-level citations.
- `harnesses/omp/extensions/plan-artifact-sync.test.js` (20 tests): L178–180 reads `config.yml` for the extension's path (wiring), and four helper assertions compare full `stderr` prose (L625–631, L642, L658–664, L680–686). The helper's `ERROR: <CODE>: plan=… state=… path=… effect=…: <text>` prefix is the machine contract the extension parses; the trailing text is prose. The extension's serialized warnings (`plan-artifact-sync: <identity>: ERROR: <CODE> scope="…" effect=…`) are a closed, redacted format documented in `harnesses/omp/plan-transport.md` L10 and carry codes and fields only, so those assertions stay.
- `references/packed-label.md` stays (guard).

**Follow-ups.** `rules/plan.md` L3 is `paths: [".agents/plans/**"]`. `craft-rule/SKILL.md` L64 ("Harness shim — OMP/local transport/runtime behavior only.") and L94 ("Separate universal semantic contracts, repository storage companions, and harness transport shims. …") teach the pre-batch-4 layout; eval id 1 `expected_output` and `assertions[1]` expect "a repository-storage companion".

## 3. Architecture and ownership

After this batch each clause below has one owner. "Dropped" rows are deliberate and cite their authority.

**Item 13 — grill wrapper clauses.**

| Baseline clause | Owner after 5a |
|---|---|
| grill-with-docs: read "only decision-bearing current code, contracts, terminology, module boundaries, architecture, or guidance" | `dev-grilling` step 1 ("read repository evidence only when it bears on the decision") and the `dev-ask` route row |
| grill-me: "stateless adapter: no repository-evidence lane is implied" | Dropped (owner decision: one interview that reads repository evidence when it bears) |
| Both: iterative round-by-round frontier; immutable decision evidence or named blocker; one Handoff with `route-impact` to the exact requesting owner | `dev-grilling` (round frontier, L37–38) |
| grill-with-docs: "`dev-domain-modeling` alone qualifies and human-gates any durable glossary, context-map, or ADR write" | `dev-domain-modeling` L62 gate, which applies identically to direct and `dev-grilling` callers |
| Near misses: research, missing requirements, settled direct work, prototype, architecture survey, Wayfinder, read-only explanation | `dev-grilling` intake (L16; "direct answer from sufficient evidence" covers read-only explanation) |
| grill-with-docs near miss "documentation keywords" | Dropped: `dev-grilling` activates only on a candidate plus refinement intent, which keywords alone never supply |
| Both descriptions: "use only when invoked by exact skill name or when dev-ask dispatches" | Dropped (owner decision): `dev-grilling`'s own description governs activation |

**Item 17 — `dev-integration`.** The whole capability (combining independently verified lineages into a new target under mechanical-conflict authority) is dropped by owner decision. Ordinary fan-in keeps its owners: `dev-implementation` L72, `dev-ticketing` L30, ADR-0003 D04 and ADR-0001 D11. ADR-0003 D04 now also says that no standalone integration stage exists and that combining separately produced work is an authored child-owned implementation task. That task goes through the target's normal review and verification.

**Item 10 — `dev-test-audit` loop.** Every clause of the removed sections already has its owner in `references/audit-protocol.md`:

| SKILL.md (baseline) | Owner |
|---|---|
| L29–37 seven-step A-first sequence, rethink once per auditor, no deferred wrapper path | protocol `## Persistent A-first loop` L24–34 |
| L37 agreement accepts and synchronizes | protocol L38–40 |
| L39 complete proposal contract; skipped file is `unknown` and preserved; fields read through test-value | protocol L3, L20, L38; `opinion-agent.md` L19–37 |
| L41 named liveness stops; no winner, round cap, replacement or mutation | protocol L42 |
| L45 one lean Handoff; audit roles change nothing | protocol L46, L56–60 |
| L47 accepted fixes return to `dev-ask`; one approved batch | protocol L44–48 |
| L49 original-A closure and its nonblocking unavailability | protocol L50–54 |

The SKILL keeps L1–25 (frontmatter, owner line, L13 protocol pointer, intake and scope) and L51–53 (boundaries), unchanged.

**Item 18 — moves.**

| Baseline text | Owner after 5a |
|---|---|
| `~/.agents/...` pointers (all files listed in §2) | Relative Markdown links to the same files (§4). A `return.md` self-path ("Installed root") is dropped: the file needs no pointer to itself |
| `improve` L12 `/Users/kim/.agents/AGENTS.md` and `/Users/kim/.dotfiles/.config/agents/AGENTS.md` | `improve` L12, reworded: the user-level [`AGENTS.md`](../../AGENTS.md) at the installed agents root "or any path that resolves to it, including its repository-backed source" |
| `mermaid.md` `~/.dotfiles/bin/mermaid-check` | `mermaid.md`: "`mermaid-check` from the `bin/` directory at the root of the repository that installs these agent files". The existing "checker unavailable → plain text / blocked" rule covers a missing checker |
| Host invocation forms (`/skill:<name>`, `/<name>`) | Dropped from skills. `craft-skill` keeps "verify syntax from live inventory"; ADR-0008 D25 keeps the verified OMP/Grok forms for `init-ask`. Each skill keeps the host-neutral statement ("every host's invocation runs this same body") |
| `papercut/WORKFLOW.md` L34 ADR/decision numbers | `docs/adr/INDEX.md` (records and decision-ID columns). WORKFLOW names the governed topics and "the repository's ADR index". The stale "seven-event envelope" phrase is dropped |
| `dev-research` Atlas states, fallback, persistence, responsibilities, stop | New rule `rules/atlas-research.md` (D1). `dev-research` keeps a generic `## Optional research store` section (qualified capability, never serve stale evidence, fallback, opt-in persistence, store owns scheduling/refresh/credentials/transport), a generic freshness template line and a generic stop |
| `craft-name` user bias, prior-discussion evidence, example transformations | New rule `rules/naming-taste.md` (D2). `craft-name` keeps a `## User preferences` pointer: apply the user's known naming preferences, from rules, memory or prior reactions, before its generic moves |

**Item 20 and follow-ups.**

| Baseline text | Owner after 5a |
|---|---|
| `human-facing-language.md` ¶1 (human surfaces; familiar, concise, precise) | `.config/agents/AGENTS.md` `## Reporting` L13 (surfaces list added to the existing sentence) |
| `human-facing-language.md` ¶2 (never simplify internal surfaces) | Same L13, one added sentence |
| `.agents/AGENTS.md` L20 count and envelope detail | Dropped; L20 points to `docs/adr/INDEX.md`, "which names the ACTIVE workflow ADRs" |
| `agent-return.md` `#L` anchors | Dropped. File-level URLs and `v18.3.0` stay (`omp-update` b/h) |
| Test: `config.yml` contains the extension path | Dropped: wiring, not a behavior contract (`test-value.md`) |
| Test: helper `stderr` prose | Replaced by the parsed code and fields (`code`, `plan`, `state`, `path`, `effect`); the obsolete-operation case asserts exit 2, empty stdout and an `ERROR: ` prefix |
| `plan.md` `paths` | Dropped (follow-up A) |
| `craft-rule` L64/L94 companion advice; eval id 1 | Rewritten to current practice (follow-up B) |

## 4. Interfaces, data, invariants and errors

No code interface changes. The following text edits are normative. Wording marked "exact" is checked. Other wording may be adjusted if every §6 check passes.

**T1 — deletions and callers.**

- Delete `.config/agents/skills/grill-me/`, `grill-with-docs/`, `dev-integration/` (each holds only `SKILL.md`).
- `dev-ask/SKILL.md`:
  - L47 second cell (exact): `` `dev-grilling`: read repository evidence when it bears on the decision; breadth alone never triggers it. ``
  - L50 becomes `| Explicit request to verify, review, ship, curate, or maintain domain authority | Validated direct stage: check its exact intake and human gates; shipping needs separate delivery authority. |`
  - L200: `` `~/.agents/references/plan-rethink.md` `` becomes `` [`plan-rethink.md`](../../references/plan-rethink.md) ``.
- `dev-ask/WORKFLOW.md` L16–17: `` - a candidate plan, hypothesis, or design to refine → `dev-grilling`, reading `` / `  repository evidence when it bears on the decision;` (the arrow clause is exact).
- `dev-grilling/SKILL.md`: step 1's first sentence becomes "Find repository, environment, and primary-source facts with available tools; read repository evidence only when it bears on the decision." (exact tail). L40 becomes "The interview never authorizes requirements, …" (no "wrappers").
- `dev-domain-modeling/SKILL.md` L62: remove `` `grill-with-docs`, `` so the list reads `` `dev-requirements`, `dev-grilling`, Wayfinder, or architecture-survey callers `` (exact).
- `dev-ask/evals/evals.json` (load, edit, dump with `json.dumps(d, ensure_ascii=False, indent=2) + "\n"`):
  - Exact values `grill-me` and `grill-with-docs` become `dev-grilling`; `dispatch:grill-me` and `dispatch:grill-with-docs` become `dispatch:dev-grilling`. In a list, a duplicate that results is kept once, at the first position (the two near-miss `forbidden_events`).
  - Remove `dispatch:dev-integration` from `R-ARTIFACT-LANE.forbidden_events`.
  - Free text: each `route` replaces the old name with `dev-grilling`; `R-GRILL.inputs.request` "Route first to dev-grilling"; `R-PROTOTYPE-NEAR-MISS.inputs.request` "after dev-grilling returns"; `R-GRILL-ROUND-BOUND.rubric[0]` "first to dev-grilling"; `R-ARTIFACT-LANE.rubric[1]` "ordinary dev-integration" becomes "a standalone integration stage".
  - Every other value in all 81 cases stays identical.
- Fixtures `r-grill/case.json`, `r-prototype-near-miss/case.json`: `inputs` becomes the edited case's `inputs`; same dump format; other keys unchanged.
- ADR-0003: L10 `neutral fan-in` becomes `ordinary planned fan-in` and `` `dev-integration`, `` is removed from the applies-to list; L40's second sentence becomes "No standalone integration stage exists; combining separately produced work is likewise an authored child-owned implementation task." (first and last sentences unchanged); L44 `fan-in neutrality changes` becomes `fan-in ownership changes`; L84 removes `` `dev-integration`, ``; L5 `**Updated:**` becomes the implementation date. No line is added or removed.
- ADR-0001: L59 `or standalone `dev-integration`.` becomes `or a standalone integration stage.`; L5 `**Updated:**` becomes the implementation date. L61 and L147 (rejected alternatives naming "standalone verified-lineage integration" / "ordinary standalone integration") stay: they record rejected designs, not the skill.

**T2 — machine paths and plan frontmatter.** Replace each `` `~/.agents/<p>` `` with `` [`<basename>`](<relative path to .config/agents/<p> from the file>) ``:

| File | Links |
|---|---|
| `rules/plan.md` L22, L76 | `../references/plan-rethink.md`, `../harnesses/omp/plan-transport.md`, `../harnesses/grok/plan-transport.md` (link text may keep `harnesses/<host>/plan-transport.md`) |
| `skills/dev-code-review/references/review-rethink.md` L5–6 | `../../../references/impl-rethink/code-rethink.md`, `…/test-rethink.md` |
| `skills/dev-implementation/SKILL.md` L47, L95, L124 | `../../references/plan-rethink.md`, `../../references/impl-rethink/recovery-rethink.md`, `../../references/impl-rethink/impl-rethink.md` |
| `skills/dev-implementation/references/{compact-checklist,execution-recovery,plan-orchestration}.md` | `../../../references/impl-rethink/{impl-rethink,recovery-rethink,impl-rethink}.md` |
| `skills/dev-specification/SKILL.md` L41, `skills/dev-ticketing/SKILL.md` L41 | `../../references/plan-rethink.md` |
| `skills/dev-test-audit/references/audit-protocol.md` L27 | `../../../references/impl-rethink/test-rethink.md` |
| `references/impl-rethink/impl-rethink.md` L5, L6, L13 | `code-rethink.md`, `test-rethink.md`, `recovery-rethink.md` |

Also in T2:

- `references/agent-return/return.md` L8: delete the sentence ``Installed root: `~/.agents/references/agent-return/return.md`.`` and keep "The decoder is `decode.py` beside this file. …".
- `skills/improve/SKILL.md` L12: "…reject a scope that names the user-level [`AGENTS.md`](../../AGENTS.md) at the installed agents root or any path that resolves to it, including its repository-backed source: that user-level policy file is outside this skill's authority. Never create, edit, append, merge, deduplicate, reformat, or delete it."
- `rules/mermaid.md` L7: "run `mermaid-check` from the `bin/` directory at the root of the repository that installs these agent files" instead of "run `~/.dotfiles/bin/mermaid-check`"; rest unchanged.
- `rules/plan.md` frontmatter: delete L3 (`paths: …`); the `description` line stays byte-identical.
- Sending rule: when a sentence says "send [`x.md`](…)" to a child, the sender resolves the link against the file that contains it and sends that readable path. This is plain Markdown resolution, as for the existing `packed-label` and `agent-return` links; no new text states it.

**T3 — harness-text moves and the audit skill.**

- `dev-test-audit/SKILL.md`: delete `## A-first orchestration` and `## Read-only result and later fixes` (L27–50). Keep every other line.
- `papercut/SKILL.md` L21: "…without reading storage. Every host's invocation runs this same body."
- `papercut/WORKFLOW.md` L26: `OMP/Grok portable invocation` becomes `host-portable invocation`. L34: the first four sentences and "Product P07" become "Where the repository has an ADR index, it names the records that govern this module, generic engineering assessment qualification and the thin dev adapter projection, portable continual learning and completion, and the separate repository setup interface. Product and custom workflow owners retain their outcomes; …"; the rest of L34 is unchanged. The line keeps the phrase `ADR index`.
- `init-ask/SKILL.md` L106 (keep the `## Portability` heading): "Every host's invocation runs this same body. Invocation syntax changes no catalog, status, approval, owner, or effect semantics."
- `craft-skill/SKILL.md` L73: "- Prefer each host's native skill invocation over a new wrapper; verify syntax from live inventory. Hosts differ only at this seam."
- `continual-learning/SKILL.md` L75: "OMP and Grok may invoke it differently" becomes "Hosts may invoke it differently".
- `dev-research/SKILL.md`: replace L34–42 with

  ```text
  ## Optional research store

  Use a durable research store only when the current workspace or user configuration exposes a qualified live capability. Filesystem presence or advertised intent is not proof. Never silently serve stale evidence: stored evidence the store reports as not current stops with its freshness state, affected sources, and the refresh action it requires. A missing or insufficient stored answer falls back to direct portable research. Persist only for store-scoped work or explicit durable-capture opt-in; scheduling, refresh, credentials, and transport stay with the store or its adapter.
  ```

  L62 becomes "- Stored-evidence freshness state, or `not applicable`". L74's tail becomes "…unavailable required primary evidence, or stored evidence whose required freshness is not current."
- New `rules/atlas-research.md` (D1), description-only:

  ```text
  ---
  description: Use when the task names Atlas or the workspace exposes an Atlas capability, and engineering research may reuse or persist evidence there.
  ---

  # Atlas research

  Atlas is one optional research store for `dev-research`. Use Atlas only when the current workspace or user configuration exposes a qualified live capability. Filesystem presence or advertised intent is not proof.

  - A `current` topic may answer through its source-artifact identities and citations.
  - A `dirty`, `refreshing`, or `blocked` topic stops with the freshness state, affected sources, and the explicit refresh action required. Never silently serve stale evidence. Report that state in the Research Evidence freshness line; it is a `dev-research` stop.
  - A missing or insufficient topic falls back to direct portable research.
  - Persist into Atlas only for Atlas-scoped work or explicit durable-capture opt-in.
  - Scheduling, daily acquisition, topic refresh, credentials, and transport remain Atlas or adapter responsibilities; do not claim or implement them in research.
  ```

- `craft-name/SKILL.md`: replace L25–40 (`## Default bias for this user` through the blank line before `## Naming moves`) with `## User preferences`, a blank line, "Apply the user's known naming preferences, from rules, memory, or prior reactions, before these generic moves." and a blank line. Delete `## Example transformations` (L69–75); the file ends after the `## Response pattern` list.
- New `rules/naming-taste.md` (D2), description-only: frontmatter `description: Use when generating or refining names for the user's projects, products, brands, companies, teams, or codenames; not for code identifiers.`, heading `# Naming taste`, the line "Apply with `craft-name` unless the user asks otherwise.", then baseline `craft-name` L29–33 (bias bullets, under "Default bias:"), L35–39 (evidence) and L71–75 (examples), verbatim.

**T4 — small fixes.**

- `rmdir .config/agents/harnesses/grok/personas .config/agents/harnesses/grok/roles` (both empty; `rmdir` fails safely if not).
- `harnesses/grok/config.toml` L37 and L45 (D3, exact): `prompt_file = "/Users/kim/.agents/skills/dev-test-audit/references/opinion-agent.md"`. Nothing else changes.
- Delete `rules/human-facing-language.md`. `.config/agents/AGENTS.md` L13 becomes: "Use the simplest precise language that preserves accuracy, necessary technical terms, and the requested level of detail on human-facing surfaces: replies, questions, approval screens, completions, and artifacts marked human-only. Never simplify internal plans, IDs, schemas, code, tool output, or agent transport; they keep their exact technical language. Prefer active voice, use one term per concept, define unfamiliar abbreviations on first use, and use lists when they improve scanning."
- `.agents/AGENTS.md` L20: "- When changing or diagnosing the generic engineering workflow, read `.config/agents/skills/dev-ask/WORKFLOW.md` and `docs/adr/INDEX.md`, which names the ACTIVE workflow ADRs. Ordinary tasks read only the applicable skill/rule and active ADRs named in their Task Contract."
- `harnesses/omp/agent-return.md`: remove every `#L<n>` or `#L<n>-L<m>` suffix from `https://github.com/can1357/oh-my-pi/blob/v18.3.0/…` URLs. Nothing else changes.
- `harnesses/omp/extensions/plan-artifact-sync.test.js`:
  - Delete the `CONFIG` constant and the `readFile(CONFIG, …)` assertion. Rename that test "registers only the successful mutation listener".
  - Add one parser, `helperError(stderr)`, returning `{ code, plan, state, path, effect }` from `^ERROR: (PLAN_[A-Z_]+): plan=(\S+) state=(\S+) path=(\S+) effect=(\S+): ` or `null`.
  - The three coded helper assertions compare `{ ...result, stderr: helperError(result.stderr) }` with the same exit code, empty stdout and the same five fields.
  - The obsolete-operation case asserts exit 2, empty stdout and `stderr` matching `/^ERROR: /`.
  - All other tests, names and assertions stay. The extension, helper and `config.yml` do not change.
- `craft-rule/SKILL.md`: L64 becomes "- Harness shim — host transport/runtime behavior only, kept in a host adapter file (here `harnesses/<host>/`) that the owning rule links; not a rule." L94 becomes "- Keep one portable rule for each semantic contract, including the repository storage it governs; put host transport in host adapter files (here `harnesses/<host>/`) that the rule links. Never hide a cross-transport content contract behind a path guard."
- `craft-rule/evals/evals.json` id 1 (same dump format; `prompt` and assertions 0, 2, 3 unchanged):
  - `expected_output`: "One portable description-only rule that is available before drafting and also owns .agents/plans naming and archival, with host transport in linked host adapter files; the cross-transport contract is not hidden behind TTSR or a path guard."
  - `assertions[1]`: "The response keeps .agents/plans naming and archival in that one portable rule rather than a second storage rule, and puts host transport in host adapter files".

**Invariants.** Guarded paths, the copy helper (`bin/omp-copy-plan-artifact`), `plan-artifact-sync.js`, `config.yml`, both `plan-transport.md` files, `opinion-agent.md`, the OMP agent wrappers and `docs/adr/INDEX.md` stay byte-identical. Every JSON file stays valid, in its baseline dump format. No git state changes.

**Errors.** Each check prints `ok` or the list of failures. `git show edf59e0:<path>` failing (missing baseline object) is a stop, not a pass.

## 5. Effects, migration, rollback and compatibility

- Effects: working-tree edits only. Deletions: three skill directories and one rule file. `rmdir` of two untracked empty directories (no git trace; AC-11 checks them). Two new rule files. No staging, commit, live host run or home-directory change.
- Migration is a clean cutover: no alias for `grill-me`, `grill-with-docs` or `dev-integration`. After this change an explicit `/skill:grill-me` (OMP) or `/grill-me` (Grok) no longer resolves; `dev-grilling` is the interview. [INFERENCE] Hosts pick up the removed skills and rules at their next session start; OMP's skill-description cache is host state, not a repo file.
- Rollback: `git checkout edf59e0 -- <S17 allowlist paths>`, delete the two new rules, and `mkdir` the two Grok directories if wanted (nothing uses them).
- Compatibility: `omp-update` steps b and h keep working (file-level citations and `v18.3.0` stay). The acp-controller reads only guarded files. Grok roles keep the same prompt file. They now resolve it independently of the working directory (D3).
- The tree between tasks is never committed; the implementation commit is the route's later shipping step.

## 6. Acceptance

Run every command from the repository root. `Sn` means: extract §6.1 block `Sn` to `/tmp/b5a/Sn.py` and run `python3 /tmp/b5a/Sn.py`. Extraction rule: a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````. No block contains such a line; backticks inside a block are single characters, never a fence. §6.1 lists each extracted file's SHA-256 so extraction can be checked with `shasum -a 256 /tmp/b5a/*.py`. `LIVE` is the §2 pathspec (S1 and S12 embed it). A task runs every AC it owns at its boundary. Every AC reads only files its owning task edits (S17 excepted: its allowlist is the union), so each stays true while sibling tasks run and on the final target. The verifier runs the complete set once on the final target.

**AC-1** — T1
Behavior: `grill-me`, `grill-with-docs` and `dev-integration` no longer exist, and no live file names them.
Check: `S1`; expect `ok`.

**AC-2** — T1
Behavior: `dev-ask` routes a candidate approach to `dev-grilling` with the owner's repository-evidence phrase and has no integrate trigger or machine path; its map routes to `dev-grilling`; `dev-grilling` limits repository reading to decision-bearing evidence and names no wrappers; `dev-domain-modeling` lists `dev-grilling` without `grill-with-docs`; `dev-ask` links `plan-rethink.md` relatively.
Check: `S2`; expect `ok`.

**AC-3** — T1
Behavior: The dev-ask evals stay valid and in their dump format. Exactly the §4 T1 eval edits happen: the four grilling cases require and first-dispatch `dev-grilling`, both near misses forbid `dispatch:dev-grilling` once, `R-ARTIFACT-LANE` no longer lists `dispatch:dev-integration`, free text that named a removed skill names none (and names `dev-grilling` where it named a grill skill). Every other value in every case is unchanged. The two fixtures carry their case's new `inputs` and nothing else changes.
Check: `S3`; expect `ok`.

**AC-4** — T1
Behavior: ADR-0003 changes only L5, L10, L40, L44 and L84, and ADR-0001 only L5 and L59, with no line added or removed. ADR-0003 D04 still opens with the ordinary-fan-in decision and ends with the audit sentence. Scope and reopen lines say fan-in without "neutral". ADR-0001 D11 still rejects pre-fan-in lineage verification.
Check: `S4`; expect `ok`.

**AC-5** — T2
Behavior: The T2 files carry no machine path. Every former `~/.agents/<p>` pointer (other than `return.md`'s self-path) is a relative link to the same file. Every relative link in those files resolves. `mermaid.md` still names `mermaid-check`.
Check: `S5`; expect `ok`.

**AC-6** — T2
Behavior: `plan.md` frontmatter holds only its baseline `description` line, and every other non-blank baseline line survives except the rewritten L21–22 and L76.
Check: `S6`; expect `ok`.

**AC-7** — T3
Behavior: `dev-test-audit/SKILL.md` has only its title, `Intake and scope` and `Boundaries` headings, no numbered loop and no machine path. It still points to `audit-protocol.md` as the sole loop contract. Every non-blank baseline line in L1–25 and L51–53 survives.
Check: `S7`; expect `ok`.

**AC-8** — T3
Behavior: `papercut` (skill and map), `init-ask`, `craft-skill` and `continual-learning` name no host or `/skill:` syntax. They keep their host-neutral statements. The papercut map names no ADR or decision number and points to the ADR index. Every other non-blank baseline line survives.
Check: `S8`; expect `ok`.

**AC-9** — T3
Behavior: `dev-research` names no Atlas and keeps generic stored-evidence rules (qualified capability, no stale evidence, fallback, opt-in persistence, freshness section). Every non-rewritten line survives. `rules/atlas-research.md` is a description-only rule that holds the Atlas states, the no-stale rule, the responsibilities line and the `dev-research` stop, with no machine path.
Check: `S9`; expect `ok`.

**AC-10** — T3
Behavior: `craft-name` holds no one-user taste or names and points to known user naming preferences; every non-moved line survives. `rules/naming-taste.md` is a description-only rule holding every moved bias, evidence and example line verbatim.
Check: `S10`; expect `ok`.

**AC-11** — T4
Behavior: Both Grok roles use the absolute `prompt_file` `/Users/kim/.agents/skills/dev-test-audit/references/opinion-agent.md` (D3), which resolves to the opinion contract. The rest of `config.toml` is unchanged. `personas/` and `roles/` are gone.
Check: `S11`; expect `ok`.

**AC-12** — T4
Behavior: `human-facing-language.md` is gone. AGENTS.md `## Reporting` holds both of its clauses. Every other AGENTS.md line survives, and no live file names the rule.
Check: `S12`; expect `ok`.

**AC-13** — T4
Behavior: `.agents/AGENTS.md` drops the ADR count and envelope detail and still points to the workflow map, `docs/adr/INDEX.md` and the Task Contract rule. Every other line survives.
Check: `S13`; expect `ok`.

**AC-14** — T4
Behavior: `agent-return.md` equals its baseline with only the oh-my-pi `#L` anchors removed (file URLs and `v18.3.0` kept).
Check: `S14`; expect `ok`.

**AC-15** — T4
Behavior: The plan-sync tests no longer read `config.yml` or assert helper prose. Every baseline `PLAN_*` code is still asserted, and every baseline test survives except the renamed wiring test.
Check: `S15`; expect `ok`.

**AC-16** — T4
Behavior: `craft-rule` teaches one portable rule per contract that owns its storage, with host transport in host adapter files, and never mentions a storage companion. Every other non-blank line survives. Its evals stay valid and in their dump format, and only eval id 1's `expected_output` and `assertions[1]` change.
Check: `S16`; expect `ok`.

**AC-17** — T1, T2, T3, T4
Behavior: Only batch-5a files differ from the baseline (union allowlist; deleted-uncommitted paths count as allowed changes, and untracked files are listed).
Check: `S17`; expect `ok`.

**AC-18** — guard; T1, T2, T3, T4
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-19** — guard; T1, T2, T3, T4
Behavior: The guarded paths, copy helper, extension code, OMP config and wrappers, both host plan files, the opinion contract and the ADR index are unchanged against the baseline and the working tree.
Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller bin .config/agents/harnesses/omp/extensions/plan-artifact-sync.js .config/agents/harnesses/omp/config.yml .config/agents/harnesses/omp/plan-transport.md .config/agents/harnesses/omp/agents .config/agents/harnesses/grok/plan-transport.md .config/agents/skills/dev-test-audit/references/opinion-agent.md docs/adr/INDEX.md"; git status --porcelain -- $P; git diff --name-only edf59e0 -- $P`; expect empty output.

**AC-20** — guard; T4
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

**AC-21** — guard; T1, T2, T3, T4
Behavior: The real protocol and Retrace prompt files still load offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-22** — T2
Behavior: The plan validator suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

**AC-23** — T4
Behavior: The plan-sync extension suite passes with the changed assertions.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-24** — T3
Behavior: The papercut ledger suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

**Baseline results** (all run at `edf59e0`, clean tree). Expected to fail before their task:

- T1: AC-1 (the three directories and every caller line), AC-2 (all eight parts), AC-3 (each edited field of the seven cases), AC-4 (`0003 scope/reopen` only; the other ADR parts already hold).
- T2: AC-5 (every listed path), AC-6 (`frontmatter`).
- T3: AC-7 (two extra headings, numbered loop, machine path), AC-8 (host names in five files, ADR numbers), AC-9 (Atlas in the skill; rule missing), AC-10 (taste in the skill; rule missing).
- T4: AC-11 (repo-relative path; both directories exist), AC-12 (rule exists; clauses missing), AC-13 (both stale phrases), AC-14 (`differs`), AC-15 (config and prose strings present), AC-16 (companion advice and eval).

Already true: AC-17 (`ok`), AC-18 (`ok`), AC-19 (empty), AC-20 (51 pass, `fail 0`), AC-21 (`0`), AC-22 (14 tests `OK`), AC-23 (20 pass, 0 fail), AC-24 (19 tests `OK`).

**Target simulation.** A `git archive edf59e0` copy was edited to a candidate target with exactly the §4 texts (D1–D3). S1–S17 were run there with `GIT_DIR` pointing at this repository, `GIT_WORK_TREE` at the copy and `GIT_OPTIONAL_LOCKS=0`. S1–S16 printed `ok`. S17 listed only a `node_modules` symlink added to the copy so that `bun test` could run; a real checkout has the ignored directory. In the copy, `bun test` passed (20 pass, 0 fail), and so did `test_executor_plan.py` (`OK`), `test_papercut_ledger.py` (`OK`) and the marker check (`ok`). The AC-19 diff was empty. The real repository stayed clean.

Negative probes each turned one check red:

- S3: a non-target case id renamed; the near-miss `dispatch:dev-grilling` dropped; a fixture request drifted.
- S4: an extra ADR line changed. S5: a relative link broken. S6: a `paths` key re-added. S7: a numbered line added.
- S8: an ADR number re-added. S9: the no-stale sentence reworded. S10: a moved bias line dropped from the rule. S11: another config line changed.
- S12: an internal-surface term dropped. S13: the stale count restored. S14: a non-anchor edit. S15: a code dropped.
- S16: the host-adapter clause removed from L94. S2: the step-1 limit removed. S1: a grill name restored.

**Why each AC sits where it does.**

- AC-1…4 concern only T1 files (the deleted skills, their callers, the dev-ask evals and fixtures, two ADRs). AC-5, AC-6 and AC-22 concern only T2 files. AC-7…10 and AC-24 concern only T3 files, including the two rules T3 creates. AC-11…16 and AC-23 concern only T4 files. No task edits another task's file, so the four tasks are independent. Each can meet its ACs at its own boundary, whatever the others' state.
- The machine-path cleanup is split by file owner. `dev-ask/SKILL.md` L200 is in T1 (AC-2), the `dev-test-audit/SKILL.md` lines go with the loop in T3 (AC-7), and the rest is T2 (AC-5). The baseline inventory in §2 is complete, so the three checks together cover every hit.
- No pathspec in a Check covers a directory where a task creates a file. The new rules are under `rules/`, which AC-19 does not cover. S1 and S12 grep `LIVE`, but a new rule could fail them only by naming a removed skill or rule, which would be a real defect. File-list checks (S17) treat deleted-uncommitted paths as changes to allowed paths. S1 and S12 use `git grep`, which skips deleted files.
- AC-17 uses the union allowlist so it holds at every task boundary and on the final target.
- AC-20 runs once, at T4, because no task edits a file the controller suites load. AC-18, AC-19 and AC-21 give cheap per-task guard evidence.

### 6.1 Check scripts

Copy each block verbatim under the §6 extraction rule. Each file holds the block's lines joined with newlines, plus one final newline. Expected `shasum -a 256` of the extracted files:

| File | SHA-256 |
|---|---|
| `S1.py` | `2d6ab24655363527aae4ecbae9c3d0b88e9aadef42e7fea307eff82448fada4b` |
| `S2.py` | `169835c535a299cd9ccb08b4f1d830a1752dacb861ea300a9055ebf807accfb9` |
| `S3.py` | `3542b15c39bae6e5ea0fe62a79fbfcd6919863a63259b748a6f414f7c3486b56` |
| `S4.py` | `d44185463ad4e4e91cc2d5a85f156b3d7047575035b06dca6ebc93d9a346b947` |
| `S5.py` | `bbbdd6bf9e4ace1da8295cd567fbe1ed84d32ca68c3a67c3d6f0b12fef9caa49` |
| `S6.py` | `90f0c18c3afa2dd2aaf2e965218e46d557f0bd1765e6d3ed2a53953487291040` |
| `S7.py` | `af98bfda45be1119c63e811bd694b41db21b4a6638a9f19cafa9b3f52541da45` |
| `S8.py` | `149d5f3a42e74ffd191c05cdab3b38f1dc16c3188011e28c26ed9ec2d1e2bba1` |
| `S9.py` | `6e7a33a9057660494d8eeee8bccb796b7b2c8981a85c4cde10dd9f10ac34e588` |
| `S10.py` | `a2e14ef8bf6f2506c4f00253c37ec1e43c3c81f001475e7c1a9a9f8cd96ca097` |
| `S11.py` | `78cc674e60d8e86adfa7458f2a49811165b14b8a7a749f7acbe76c5c04b7f771` |
| `S12.py` | `05d497d7136ac35a92533fd4dc431b9bdeebb6375b53cf8dc5e5dd023969f340` |
| `S13.py` | `367dd118150244e6216f9e1d6212ad3de6f8147e712394f4d99befca511c65ad` |
| `S14.py` | `340088102b7be7d34308e3f2cb8d6590b15b6d616f701b1c9017504f89e8bedf` |
| `S15.py` | `27854917c825123e141321b51b5f111bd1b7b4a6e8128321a21bb38924e6eb39` |
| `S16.py` | `a28642c240e0a60d055c653a1cb8b99fd9a5a60dca401a8a98ed2d098e3716b4` |
| `S17.py` | `b4a5e30db93025c76792ab52569c35a104f953cf5fc08afea2b95376b763a8ba` |

S1
```python
# S1 (AC-1): the three skills are gone and no live file names them
import os,subprocess
C='.config/agents/'
bad=[d for d in ('grill-me','grill-with-docs','dev-integration') if os.path.exists(C+'skills/'+d)]
LIVE=['.config/agents','docs/adr','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts',':!.config/agents/references/impl-rethink/MAINTENANCE.md']
r=subprocess.run(['git','grep','--untracked','-n','-I','-E','grill-me|grill-with-docs|dev-integration','--',*LIVE],capture_output=True,text=True)
bad+=[l[:100] for l in r.stdout.splitlines()]
print(bad or 'ok')
```

S2
```python
# S2 (AC-2): dev-ask, its map, dev-grilling and dev-domain-modeling route to dev-grilling
import os,re
K='.config/agents/skills/';bad=[]
t=open(K+'dev-ask/SKILL.md',encoding='utf-8').read()
rows=[l for l in t.splitlines() if l.startswith('| The user presents a candidate approach')]
if len(rows)!=1 or '`dev-grilling`' not in rows[0] or 'read repository evidence when it bears on the decision' not in rows[0]:bad.append('candidate row')
rows=[l for l in t.splitlines() if l.startswith('| Explicit request to verify')]
if len(rows)!=1 or re.search(r'(?i)integrat',rows[0]):bad.append('direct-stage row')
if re.search(r'~/\.agents|/Users/',t):bad.append('dev-ask machine path')
if not any(os.path.normpath(os.path.join(K+'dev-ask',l))==os.path.normpath('.config/agents/references/plan-rethink.md') for l in re.findall(r'\]\(([^)#\s]+)',t)):bad.append('plan-rethink link')
w=' '.join(open(K+'dev-ask/WORKFLOW.md',encoding='utf-8').read().split())
if not re.search(r'a candidate plan, hypothesis, or design to refine → `dev-grilling`',w):bad.append('map line')
g=open(K+'dev-grilling/SKILL.md',encoding='utf-8').read()
if 'wrapper' in g:bad.append('grilling wrappers')
s1=[l for l in g.splitlines() if l.startswith('1. **Resolve facts first.**')]
if len(s1)!=1 or 'read repository evidence only when it bears on the decision' not in s1[0]:bad.append('grilling step 1')
if '`dev-requirements`, `dev-grilling`, Wayfinder, or architecture-survey callers' not in open(K+'dev-domain-modeling/SKILL.md',encoding='utf-8').read():bad.append('domain callers')
print(bad or 'ok')
```

S3
```python
# S3 (AC-3): the dev-ask evals name dev-grilling where they named a wrapper, drop the dev-integration forbid, and change nothing else
import json,re,subprocess
E='.config/agents/skills/dev-ask/evals/';B='edf59e0'
N=re.compile(r'grill-me|grill-with-docs|dev-integration')
M={'grill-me':'dev-grilling','grill-with-docs':'dev-grilling','dispatch:grill-me':'dispatch:dev-grilling','dispatch:grill-with-docs':'dispatch:dev-grilling'}
W=object()
def base(f):return subprocess.run(['git','show',B+':'+f],capture_output=True,text=True,check=True).stdout
def f(o):
    if isinstance(o,dict):return {k:f(v) for k,v in o.items()}
    if isinstance(o,list):
        if not N.search(json.dumps(o)):return [f(v) for v in o]
        out=[]
        for v in o:
            if v=='dispatch:dev-integration':continue
            v=M.get(v,f(v)) if isinstance(v,str) else f(v)
            if isinstance(v,tuple) or v not in out:out.append(v)
        return out
    if isinstance(o,str) and N.search(o):return M.get(o,('G' if re.search('grill',o) else 'I',W))
    return o
def eq(n,e,p):
    if isinstance(e,tuple) and len(e)==2 and e[1] is W:
        return [] if isinstance(n,str) and not N.search(n) and (e[0]=='I' or 'dev-grilling' in n) else [p]
    if e is W:return [] if isinstance(n,str) and not N.search(n) else [p]
    if isinstance(e,dict):
        if not isinstance(n,dict) or n.keys()!=e.keys():return [p]
        return [x for k in e for x in eq(n[k],e[k],p+'/'+k)]
    if isinstance(e,list):
        if not isinstance(n,list) or len(n)!=len(e):return [p]
        return [x for i in range(len(e)) for x in eq(n[i],e[i],p+'/'+str(i))]
    return [] if n==e else [p]
bad=[];t=open(E+'evals.json',encoding='utf-8').read();now=json.loads(t)
if json.dumps(now,ensure_ascii=False,indent=2)+'\n'!=t:bad.append('format')
bad+=eq(now,f(json.loads(base(E+'evals.json'))),'')
c={x['id']:x for x in now['cases']}
for i in ('R-GRILL','R-APPROACH-REFINEMENT','R-PROTOTYPE-NEAR-MISS','R-GRILL-ROUND-BOUND'):
    x=c[i]
    if x['expected']['first_owner']!='dev-grilling' or 'dispatch:dev-grilling' not in x['required_events']:bad.append(i)
for i in ('R-APPROACH-REFINEMENT-NEAR-MISS-DIRECT','R-APPROACH-REFINEMENT-NEAR-MISS-REQUIREMENTS'):
    if 'dispatch:dev-grilling' not in c[i]['forbidden_events']:bad.append(i)
for i,d in (('R-GRILL','r-grill'),('R-PROTOTYPE-NEAR-MISS','r-prototype-near-miss')):
    p=E+'fixtures/'+d+'/case.json';ft=open(p,encoding='utf-8').read();fx=json.loads(ft);fb=json.loads(base(p))
    if json.dumps(fx,ensure_ascii=False,indent=2)+'\n'!=ft or fx['inputs']!=c[i]['inputs'] or fx.keys()!=fb.keys() or any(fx[k]!=fb[k] for k in fb if k!='inputs'):bad.append(d)
print(bad or 'ok')
```

S4
```python
# S4 (AC-4): ADR-0003 and ADR-0001 change only the named lines; ordinary fan-in stays decided
import subprocess
B='edf59e0';bad=[]
def base(f):return subprocess.run(['git','show',B+':'+f],capture_output=True,text=True,check=True).stdout.splitlines()
A3='docs/adr/0003-bounded-assurance-and-repair.md';A1='docs/adr/0001-dev-workflow-authority-and-routing.md'
for f,ok in ((A3,{5,10,40,44,84}),(A1,{5,59})):
    b=base(f);n=open(f,encoding='utf-8').read().splitlines()
    if len(b)!=len(n):bad.append((f[9:17],'lines'));continue
    bad+=[(f[9:17],i+1) for i in range(len(b)) if b[i]!=n[i] and i+1 not in ok]
    if not n[4].startswith('**Updated:** '):bad.append((f[9:17],'Updated'))
n=open(A3,encoding='utf-8').read().splitlines()
if not n[39].startswith("- **Decision:** Ordinary planned fan-in is an authored child-owned implementation task completed before the assembled target's one final review and verification.") or not n[39].endswith('Manual permanent-test audit is separate explicit intake and never follows normal completion automatically.'):bad.append('0003 L40')
if 'neutral' in n[9]+n[43] or 'fan-in' not in n[9] or 'fan-in' not in n[43]:bad.append('0003 scope/reopen')
if 'it does not route through pre-fan-in lineage verification' not in open(A1,encoding='utf-8').read().splitlines()[58]:bad.append('0001 L59')
print(bad or 'ok')
```

S5
```python
# S5 (AC-5): T2 files carry no machine-specific path; each former ~/.agents pointer is a relative link to the same file; all relative links resolve
import os,re,subprocess
C='.config/agents/';B='edf59e0'
F=['rules/plan.md','rules/mermaid.md','skills/dev-code-review/references/review-rethink.md','skills/dev-implementation/SKILL.md','skills/dev-implementation/references/compact-checklist.md','skills/dev-implementation/references/execution-recovery.md','skills/dev-implementation/references/plan-orchestration.md','skills/dev-specification/SKILL.md','skills/dev-ticketing/SKILL.md','skills/dev-test-audit/references/audit-protocol.md','references/impl-rethink/impl-rethink.md','references/agent-return/return.md','skills/improve/SKILL.md']
X=re.compile(r'~/\.agents|/Users/|~/\.dotfiles|\.dotfiles/')
bad=[]
for f in F:
    t=open(C+f,encoding='utf-8').read();d=os.path.dirname(C+f)
    if X.search(t):bad.append((f,X.search(t)[0]))
    ls=[os.path.normpath(os.path.join(d,l)) for l in re.findall(r'\]\(([^)#\s]+)',t) if not re.match(r'[a-z]+:',l)]
    bad+=[(f,l) for l in ls if not os.path.exists(l)]
    b=subprocess.run(['git','show',B+':'+C+f],capture_output=True,text=True,check=True).stdout
    for p in sorted(set(re.findall(r'(?:~|/Users/kim)/\.agents/([\w./-]*\w)',b))):
        if os.path.normpath(C+p)!=os.path.normpath(C+f) and os.path.normpath(C+p) not in ls:bad.append((f,'no link',p))
if 'mermaid-check' not in open(C+'rules/mermaid.md',encoding='utf-8').read():bad.append('mermaid-check')
print(bad or 'ok')
```

S6
```python
# S6 (AC-6): plan.md frontmatter is description-only with the baseline description; kept lines survive
import re,subprocess
f='.config/agents/rules/plan.md'
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout
t=open(f,encoding='utf-8').read();bad=[]
m=re.match(r'---\n(.*?)\n---\n',t,re.S)
if not m or m[1]!=b.split('\n')[1]:bad.append('frontmatter')
now=set(t.splitlines())
bad+=[n for n,l in enumerate(b.splitlines(),1) if l.strip() and n not in {3,21,22,76} and l not in now]
print(bad or 'ok')
```

S7
```python
# S7 (AC-7): dev-test-audit keeps intake, scope and boundaries, and leaves the loop to the protocol
import re,subprocess
f='.config/agents/skills/dev-test-audit/SKILL.md'
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout.splitlines()
t=open(f,encoding='utf-8').read();bad=[]
h=re.findall(r'(?m)^#{1,6} .*$',t)
if h!=['# Engineering Test Audit','## Intake and scope','## Boundaries']:bad.append(h)
if re.search(r'(?m)^\d+\. ',t):bad.append('numbered loop')
if re.search(r'~/\.agents|/Users/',t):bad.append('machine path')
if 'skill://dev-test-audit/references/audit-protocol.md' not in t or 'sole audit-loop contract' not in t:bad.append('protocol pointer')
now=set(t.splitlines())
bad+=[n for n,l in enumerate(b,1) if l.strip() and (n<=25 or n>=51) and l not in now]
print(bad or 'ok')
```

S8
```python
# S8 (AC-8): host invocation syntax and ADR numbers leave these portable files; the host-neutral statements and all other lines stay
import re,subprocess
K='.config/agents/skills/';bad=[]
F={'papercut/SKILL.md':({21},['same body']),'papercut/WORKFLOW.md':({26,34},['ADR index','The ledger is evidence, never authority.']),'init-ask/SKILL.md':({106},['## Portability','same body']),'craft-skill/SKILL.md':({73},['verify syntax from live inventory']),'continual-learning/SKILL.md':({75},['mode eligibility, qualification, curation, statuses, and stops are the same'])}
for f,(skip,need) in F.items():
    t=open(K+f,encoding='utf-8').read()
    b=subprocess.run(['git','show','edf59e0:'+K+f],capture_output=True,text=True,check=True).stdout.splitlines()
    m=re.search(r'\bOMP\b|\bGrok\b|/skill:',t)
    if m:bad.append((f,m[0]))
    bad+=[(f,x) for x in need if x not in t]
    now=set(t.splitlines());bad+=[(f,n) for n,l in enumerate(b,1) if l.strip() and n not in skip and l not in now]
m=re.search(r'ADR-\d{4}|\b[DP]\d{2}\b',open(K+'papercut/WORKFLOW.md',encoding='utf-8').read())
if m:bad.append(('WORKFLOW',m[0]))
print(bad or 'ok')
```

S9
```python
# S9 (AC-9): dev-research is Atlas-free with generic stored-evidence rules; the Atlas rule owns the Atlas specifics
import re,subprocess
f='.config/agents/skills/dev-research/SKILL.md';r='.config/agents/rules/atlas-research.md';bad=[]
t=open(f,encoding='utf-8').read()
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout.splitlines()
if re.search(r'(?i)atlas',t):bad.append('atlas in skill')
bad+=[x for x in ['Filesystem presence or advertised intent is not proof','Never silently serve stale evidence','falls back to direct portable research','explicit durable-capture opt-in','## Freshness and capture'] if x not in t]
now=set(t.splitlines());bad+=[n for n,l in enumerate(b,1) if l.strip() and not (34<=n<=42 or n in {62,74}) and l not in now]
try:a=open(r,encoding='utf-8').read()
except OSError:a='';bad.append('rule missing')
m=re.match(r'---\ndescription: [^\n]*Atlas[^\n]*\n---\n',a)
if not m:bad.append('rule frontmatter')
bad+=[x for x in ['`current`','`dirty`','`refreshing`','`blocked`','Never silently serve stale evidence','Scheduling, daily acquisition, topic refresh, credentials, and transport','`dev-research`'] if x not in a]
if re.search(r'~/\.agents|/Users/|\.dotfiles',a):bad.append('rule machine path')
print(bad or 'ok')
```

S10
```python
# S10 (AC-10): craft-name holds no one-user taste; the naming-taste rule owns it
import re,subprocess
f='.config/agents/skills/craft-name/SKILL.md';r='.config/agents/rules/naming-taste.md';bad=[]
t=open(f,encoding='utf-8').read()
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout.splitlines()
m=re.search(r'Kair|Talar|Talora|Portolan|Azimuth|Azira|for this user|prior discussion',t)
if m:bad.append(m[0])
if 'naming preferences' not in t:bad.append('preference pointer')
now=set(t.splitlines());bad+=[n for n,l in enumerate(b,1) if l.strip() and not (25<=n<=39 or 69<=n<=75) and l not in now]
try:a=open(r,encoding='utf-8').read()
except OSError:a='';bad.append('rule missing')
if not re.match(r'---\ndescription: [^\n]*nam[^\n]*\n---\n',a):bad.append('rule frontmatter')
bad+=[l.strip() for l in b[28:39]+b[70:75] if l.strip() and l.strip() not in a]
print(bad or 'ok')
```

S11
```python
# S11 (AC-11): both Grok roles read the opinion contract through a absolute D3 path; nothing else in the config changes
import os,subprocess,tomllib
f='.config/agents/harnesses/grok/config.toml';bad=[]
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout
t=open(f,encoding='utf-8').read();d=tomllib.loads(t)
V={'/Users/kim/.agents/skills/dev-test-audit/references/opinion-agent.md'}
p={r['prompt_file'] for r in d['subagents']['roles'].values()}
if len(p)!=1 or not p<=V or not os.path.isfile(os.path.expanduser(next(iter(p)))):bad.append(p)
o='prompt_file = ".config/agents/skills/dev-test-audit/references/opinion-agent.md"'
if len(p)==1 and t.replace('prompt_file = "%s"'%next(iter(p)),o)!=b:bad.append('other lines')
bad+=[x for x in ('personas','roles') if os.path.lexists('.config/agents/harnesses/grok/'+x)]
print(bad or 'ok')
```

S12
```python
# S12 (AC-12): the human-facing-language rule is folded into AGENTS.md Reporting and gone
import os,re,subprocess
f='.config/agents/AGENTS.md';bad=[]
if os.path.lexists('.config/agents/rules/human-facing-language.md'):bad.append('rule exists')
t=open(f,encoding='utf-8').read()
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout.splitlines()
s=' '.join(re.search(r'(?ms)^## Reporting\n(.*?)(?=^## )',t)[1].split())
bad+=[x for x in ['approval screens','human-only','internal plans, IDs, schemas, code, tool output, or agent transport','exact technical language','Use the simplest precise language'] if x not in s]
now=set(t.splitlines());bad+=[n for n,l in enumerate(b,1) if l.strip() and n!=13 and l not in now]
LIVE=['.config/agents','docs/adr','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts',':!.config/agents/references/impl-rethink/MAINTENANCE.md']
bad+=subprocess.run(['git','grep','--untracked','-n','-I','human-facing-language','--',*LIVE],capture_output=True,text=True).stdout.splitlines()
print(bad or 'ok')
```

S13
```python
# S13 (AC-13): .agents/AGENTS.md drops the stale ADR count and envelope detail and keeps the pointers
import subprocess
f='.agents/AGENTS.md';bad=[]
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout.splitlines()
t=open(f,encoding='utf-8').read()
bad+=[x for x in ['five ACTIVE','seven-event'] if x in t]
l=[x for x in t.splitlines() if '.config/agents/skills/dev-ask/WORKFLOW.md' in x]
if len(l)!=1 or 'docs/adr/INDEX.md' not in l[0] or 'Task Contract' not in l[0]:bad.append('pointer line')
now=set(t.splitlines());bad+=[n for n,x in enumerate(b,1) if x.strip() and n!=20 and x not in now]
print(bad or 'ok')
```

S14
```python
# S14 (AC-14): agent-return.md equals its baseline with only the oh-my-pi #L anchors removed
import re,subprocess
f='.config/agents/harnesses/omp/agent-return.md'
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout
e=re.sub(r'(https://github\.com/can1357/oh-my-pi/blob/v18\.3\.0/[^)#\s]+)#L\d+(?:-L\d+)?',r'\1',b)
t=open(f,encoding='utf-8').read()
print('ok' if t==e and e!=b and '#L' not in t else 'differs')
```

S15
```python
# S15 (AC-15): the plan-sync tests assert codes, not helper prose or config wiring, and keep every test and code
import re,subprocess
f='.config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js';bad=[]
b=subprocess.run(['git','show','edf59e0:'+f],capture_output=True,text=True,check=True).stdout
t=open(f,encoding='utf-8').read()
bad+=[x for x in ['CONFIG','config.yml','helper wire protocol is not supported','content file identity must match slug','unsupported operation'] if x in t]
code=lambda s:set(re.findall(r'PLAN_[A-Z_]*[A-Z]',s.replace('${"LOCK"}','LOCK')))
bad+=sorted(code(b)-code(t))
name=lambda s:set(re.findall(r'\btest\("([^"]+)"',s))
bad+=sorted(name(b)-name(t)-{'keeps the configured extension and registers only the successful mutation listener'})
print(bad or 'ok')
```

S16
```python
# S16 (AC-16): craft-rule teaches one portable rule that owns storage, with host transport in host adapter files; only eval id 1 changes
import json,re,subprocess
K='.config/agents/skills/craft-rule/';bad=[]
g=lambda f:subprocess.run(['git','show','edf59e0:'+K+f],capture_output=True,text=True,check=True).stdout
t=open(K+'SKILL.md',encoding='utf-8').read()
if re.search(r'(?i)storage\s+companion',t):bad.append('skill companion')
g94=[l for l in t.splitlines() if 'behind a path guard' in l]
if len(g94)!=1 or 'harnesses/<host>/' not in g94[0] or 'one portable rule' not in g94[0]:bad.append('skill advice')
now=set(t.splitlines());bad+=[n for n,l in enumerate(g('SKILL.md').splitlines(),1) if l.strip() and n not in {64,94} and l not in now]
e=open(K+'evals/evals.json',encoding='utf-8').read();d=json.loads(e);b=json.loads(g('evals/evals.json'))
if json.dumps(d,ensure_ascii=False,indent=2)+'\n'!=e:bad.append('format')
if d.keys()!=b.keys() or [x['id'] for x in d['evals']]!=[x['id'] for x in b['evals']]:bad.append('ids')
bad+=[x['id'] for x,y in zip(d['evals'],b['evals']) if x['id']!=1 and x!=y]
one=[x for x in d['evals'] if x['id']==1][0];s=json.dumps(one)
if re.search(r'(?i)companion',s) or not re.search(r'(?i)host adapter',s):bad.append('id 1')
o=[x for x in b['evals'] if x['id']==1][0]
if one['prompt']!=o['prompt'] or [a for i,a in enumerate(one['assertions']) if i!=1]!=[a for i,a in enumerate(o['assertions']) if i!=1]:bad.append('id 1 kept parts')
print(bad or 'ok')
```

S17
```python
# S17 (AC-17): only batch-5a files differ from the baseline (union allowlist; deletions count as allowed)
import subprocess
C='.config/agents/';K=C+'skills/'
ok={C+x for x in ['rules/plan.md','rules/mermaid.md','rules/atlas-research.md','rules/naming-taste.md','rules/human-facing-language.md','AGENTS.md','references/impl-rethink/impl-rethink.md','references/agent-return/return.md','harnesses/omp/agent-return.md','harnesses/omp/extensions/plan-artifact-sync.test.js','harnesses/grok/config.toml']}
ok|={K+x for x in ['grill-me/SKILL.md','grill-with-docs/SKILL.md','dev-integration/SKILL.md','dev-ask/SKILL.md','dev-ask/WORKFLOW.md','dev-ask/evals/evals.json','dev-ask/evals/fixtures/r-grill/case.json','dev-ask/evals/fixtures/r-prototype-near-miss/case.json','dev-grilling/SKILL.md','dev-domain-modeling/SKILL.md','dev-code-review/references/review-rethink.md','dev-implementation/SKILL.md','dev-implementation/references/compact-checklist.md','dev-implementation/references/execution-recovery.md','dev-implementation/references/plan-orchestration.md','dev-specification/SKILL.md','dev-ticketing/SKILL.md','dev-test-audit/SKILL.md','dev-test-audit/references/audit-protocol.md','improve/SKILL.md','papercut/SKILL.md','papercut/WORKFLOW.md','init-ask/SKILL.md','craft-skill/SKILL.md','continual-learning/SKILL.md','dev-research/SKILL.md','craft-name/SKILL.md','craft-rule/SKILL.md','craft-rule/evals/evals.json']}
ok|={'docs/adr/0001-dev-workflow-authority-and-routing.md','docs/adr/0003-bounded-assurance-and-repair.md','.agents/AGENTS.md'}
g=lambda *a:subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n')
P=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts','.grok','.cursor']
ch={l for l in g('diff','--name-only','edf59e0','--',*P)+g('ls-files','--others','--exclude-standard','--',*P) if l}
print(sorted(ch-ok) or 'ok')
```

## 7. Test seams

- Most of this batch is Markdown and JSON text. Its behavior is structural: removed names gone, one owner per clause, pointers resolving, kept lines byte-stable, evals changed only where a removed name forced it. The checks are static scripts plus the existing suites at the seams that could notice: the controller suites and roles loader (guard), the plan validator, the extension suite, the papercut ledger.
- Kept-line checks (S6–S10, S12, S13, S16) make "never lose a rule" mechanical for the text that stays. §3 places every moved or dropped clause; review checks the rest against those tables.
- S3 computes the expected evals from the baseline by the §4 name mapping. Free text that named a removed skill may be reworded, but it may name none. Every other value is compared exactly.
- Permanent tests: one existing test file changes (`plan-artifact-sync.test.js`), and only to stop asserting wiring and prose. That follows `test-value.md`: wiring and incidental message text are not consumer contracts, while the helper's code and fields are what the extension parses. No test is added. No new consumer-visible contract exists.
- [INFERENCE] Hosts still find `dev-grilling`, the two new rules and the edited skills at their next session. No live run proves it; none is in scope.

## 8. Implementation boundaries and dependencies

A lean plan with four independent tasks (no task edits another's file):

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — Delete the wrapper and integration skills; migrate callers** | delete `skills/{grill-me,grill-with-docs,dev-integration}/`; `skills/dev-ask/SKILL.md`, `skills/dev-ask/WORKFLOW.md`, `skills/dev-ask/evals/evals.json`, `skills/dev-ask/evals/fixtures/{r-grill,r-prototype-near-miss}/case.json`, `skills/dev-grilling/SKILL.md`, `skills/dev-domain-modeling/SKILL.md`, `docs/adr/0001-…`, `docs/adr/0003-…` | — | AC-1…4, AC-17, AC-18, AC-19, AC-21 |
| **T2 — Relative links and plan frontmatter** | `rules/plan.md`, `rules/mermaid.md`, `skills/dev-code-review/references/review-rethink.md`, `skills/dev-implementation/SKILL.md` and `references/{compact-checklist,execution-recovery,plan-orchestration}.md`, `skills/dev-specification/SKILL.md`, `skills/dev-ticketing/SKILL.md`, `skills/dev-test-audit/references/audit-protocol.md`, `skills/improve/SKILL.md`, `references/impl-rethink/impl-rethink.md`, `references/agent-return/return.md` | — | AC-5, AC-6, AC-17, AC-18, AC-19, AC-21, AC-22 |
| **T3 — Move harness and personal text; trim the audit skill** | `skills/dev-test-audit/SKILL.md`, `skills/papercut/{SKILL,WORKFLOW}.md`, `skills/init-ask/SKILL.md`, `skills/craft-skill/SKILL.md`, `skills/continual-learning/SKILL.md`, `skills/dev-research/SKILL.md`, `skills/craft-name/SKILL.md`; create `rules/atlas-research.md`, `rules/naming-taste.md` | — | AC-7…10, AC-17, AC-18, AC-19, AC-21, AC-24 |
| **T4 — Small fixes and follow-ups** | `harnesses/grok/{config.toml,personas/,roles/}`, `AGENTS.md`, delete `rules/human-facing-language.md`, `.agents/AGENTS.md`, `harnesses/omp/agent-return.md`, `harnesses/omp/extensions/plan-artifact-sync.test.js`, `skills/craft-rule/SKILL.md`, `skills/craft-rule/evals/evals.json` | — | AC-11…16, AC-17…21, AC-23 |

(Paths without a leading directory are under `.config/agents/`.)

**Sizing rationale.**

- T1 is one cutover. The deletions and their callers must land together for AC-1 to hold, and the eval edits need the same name mapping. The ADR edits are small, but they carry the same cutover.
- T2 is about fifteen one-line link rewrites plus the frontmatter line. It is mechanical and reviewable against one table.
- T3 needs clause placement judgment: generic versus Atlas-specific, taste versus technique, and the audit loop against the protocol. It also creates the two rules that hold the moved text. It fits one fresh context (about 2,500 words of source).
- T4 groups the independent small fixes. The only code-adjacent edit is the test file. `bun test` proves it, and the task needs no other file's context.
- Serial order is unnecessary. `dev-ticketing` may still serialize them for review convenience.

## 9. Risks, assumptions, stops and open decisions

**Assumptions.**

- *In-place ADR amendment.* As in batch 1, the approved item authorizes editing ADR-0003 D04 and ADR-0001 D11 in place. No new ADR or supersession entry is needed, because no decision ID changes meaning beyond removing the dropped stage.
- *Relative links reach children.* Senders resolve a relative link against the file that contains it before sending the path. That is the existing `packed-label`/`agent-return` pattern. [INFERENCE] OMP and Grok agents resolve `skill://`-loaded files to `~/.agents/skills/…`, so `../../references/…` resolves.
- *Eval prompts stay.* `/skill:` prompts in `init-ask`/`product-ask` evals and `/Users/kim/.agents/AGENTS.md` in dev-ask eval inputs are eval data (5b), not portable instructions.
- *craft-rule L64 is in scope.* It states the same storage/transport advice as L94. Changing only L94 would leave the skill teaching both layouts.
- *ADR `Updated` date.* S4 accepts any `**Updated:**` value.
- *S3 is deterministic.* The baseline `dev-ask/evals/evals.json` is byte-identical to `json.dumps(json.load(f), ensure_ascii=False, indent=2)+"\n"` (verified), so the mapped expected output is fully determined.

**Risks.**

- *A clause is lost in a move.* §3 places each one, and kept-line checks and anchor strings catch drops.
- *Grok `prompt_file` resolution.* D3's absolute path needs no working-directory or `~` resolution; the file exists. [INFERENCE] Grok reads an absolute `prompt_file` as given; no live Grok run proves it, and none is in scope.
- *Eval semantics shift.* `R-GRILL` and `R-APPROACH-REFINEMENT` used to test two wrappers; both now test the one `dev-grilling` route, which is the owner decision. 5b may merge them.
- *npm test takes about 3 minutes.* Run it in the foreground with an explicit timeout.

**Stops.**

- Any guard check fails (AC-18…21).
- A baseline clause has no owner in §3, or its owner would not hold it.
- A change would touch a path outside the S17 allowlist, the extension, the helper or `config.yml`, or git state.
- The route owner reverses D1, D2 or D3. S9, S10 or S11 then need a spec revision before that task.

**Settled destinations** (route owner, 2026-09-29; recorded so the checks' fixed values have authority).

- *D1 — Atlas text:* a new description-only rule `rules/atlas-research.md`. Its description names Atlas, so OMP's description-driven rulebook surfaces it for Atlas-bearing research only. Grok loads it in full inside this repo (short). Checked by S9.
- *D2 — Naming taste:* a new description-only rule `rules/naming-taste.md`. Its description scopes it to naming projects, products, brands, companies, teams or codenames, and excludes code identifiers. Checked by S10.
- *D3 — Grok `prompt_file`:* the absolute `/Users/kim/.agents/skills/dev-test-audit/references/opinion-agent.md`. Harness config is machine-specific by nature. Checked by S11.

**Open decisions for the owner.** None.

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch5a/spec-v2`. It supersedes spec-v1, the first candidate.
- spec-v2 note (after one plan-rethink pass): the route owner settled D1–D3, recorded in §1 and §9, and no decisions remain open. S11 now accepts only the D3 absolute path. The Atlas rule description is narrowed so it fires only when Atlas is named or exposed, and the naming-taste description excludes code identifiers. Rethink confirmed the rest:
  - no two tasks share a file;
  - S17's union allowlist is task-independent, so it holds for any subset of landed tasks;
  - no AC-19 path is created or deleted by any task;
  - only T1 files name the deleted skills;
  - the baseline evals round-trip byte-exactly through the S3 dump format.

  Of the §6.1 hashes, only S11's changes.
- Next owner: `dev-ticketing`, to project T1–T4 into a lean plan. After that: `dev-implementation`, then review, verification and learning, at standard assurance. No live runs, no commits.
- Route impact: unchanged.
