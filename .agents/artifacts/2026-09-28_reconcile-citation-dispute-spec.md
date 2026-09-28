# Reconcile citation check and one-dispute revert — technical specification

Revision: `reconcile-citation-dispute/spec-v2` (2026-09-28; one plan-rethink pass over spec-v1). Assurance: standard.

## 1. Authority and approved outcome

- Approved requirements (user-approved, reconciled): `/tmp/omp-reconcile-cycle/approved-proposal.md`, refinements 1, 2 and 4 and its six acceptance bullets. Incident evidence only: `/tmp/omp-reconcile-cycle/original-handoff.md`.
- Governing durable decision: ADR-0010 D31 (`docs/adr/0010-replacement-lifecycle-plugin.md`). Clause 7 keeps the Reconcile skill and reviewer protocol as semantic owners of re-ask budgets, verdicts, continuation and stops; the controller implements them. This change stays inside D31: no ADR or `docs/adr/INDEX.md` edit. ADR-0010 "Verification expectations" (offline suite, skills, protocol, zero A5 violations, standard review and verification) applies.
- Outcome: a finalized `REVISE` may carry citations that the controller checks against file bytes. A mismatch is an invalid return. A revert that would stop as a repeated A/B cycle and carries at least one passing citation gets one counterpart dispute turn instead. Loop protection otherwise stays as strong as today. Delegated Reconcile inside Retrace behaves identically.
- Out of scope: reviewer B thinking level; `.config/agents/skills/craft-skill/` (parked uncommitted user work, must stay byte-identical); turn caps; reviewer replacement; live acpx/`omp acp` runs; commits.

## 2. Current system and constraints

- `controller.mjs` `reconcileLoop`: per outer iteration a local `seen` set holds `${role}:${identity(working)}` for each finalized applicable `REVISE`. On a repeat it adds a `stop` row `repeated A/B cycle` and stops with detail `the same proposal returned to the same reviewer`. In the incident, A produced `d6a…` (`A:d6a…`), B produced `0e0…`, A's cited revert reproduced `d6a…` and stopped.
- `expectReview` owns the single C4 budget (`C4_MAX_REASKS = 3`; fourth invalid return stops with `invalid returns exhausted`). It calls a synchronous `applicable(v)` only for finalized passes (`post-rethink`, `later`); the provisional `initial` pass passes `null`. An inapplicable result becomes the re-ask `DEFECT`, and no working proposal changes.
- `lib/schema.mjs` `validateReview` has no citation field; `VARIANTS.review` lists the declared fields; `exampleFor("review")` renders the worked example.
- `lib/prompts.mjs` `REQUIRED_MARKERS.reviewer` is `initial, rethink, later, source, reask`; `renderPrompt` fills slots in one pass and throws on an unfilled slot.
- The reviewer's readable surface is any absolute path through `read`/`glob`/`grep` (protocol "Reviewer role and authority"). Direct runs carry no root field: the Reconcile skill ("Controller invocation") runs `cli.mjs` with the repository root as working directory. Delegated runs get Retrace's `request.root` and `request.evidence`, bounded by `inBoundary(ctx, locator)` (lexical: strictly inside the root, or exactly an evidence locator).
- The park state persists `rs` as JSON (`parkRun … { reconcile: rs … }`), and `resumeReconcile` re-enters `reconcileLoop` with the persisted `rs`.
- There is no existing offline test for the cycle stop. The scripted fixture (`test/fixtures/scripted-acp-agent.mjs`) logs `passMarker` and `promptSha`, not prompt text. `{when, then}` plan entries claim only a prompt that contains `when`; a prompt with no matching entry fails the turn.

## 3. Architecture and ownership

No new module or dependency. Dependency direction stays: skills/protocol (semantics, prompt text) → `lib/prompts.mjs` (loads markers) → `controller.mjs` (mechanics) → `lib/schema.mjs` (shape).

| Owner | Change |
|---|---|
| `.config/agents/skills/reconcile/SKILL.md` | Citation rule, checkable roots, invalid-return list, dispute rule, stop frontiers, state list, `dispute` trace milestone (§4.6) |
| `.config/agents/skills/reconcile/references/reviewer-protocol.md` | `citations` field, invalid-return wording, disputed-revert paragraph, `{{DISPUTE}}` slot in `later`, new `prompt:dispute` section (§4.7) |
| `lib/schema.mjs` | Validate and normalize `citations` (§4.1) |
| `controller.mjs` | Checkable predicate, byte matching, async applicability, dispute state and stops, rows, delegated root pass-through (§4.2–4.5) |
| `lib/prompts.mjs` | Add `dispute` to `REQUIRED_MARKERS.reviewer` and to the `loadPrompts` doc comment |
| `cli.mjs` | Add `repoRoot: process.cwd()` to the controller `deps` |
| `.config/agents/skills/craft-rule/SKILL.md` | One hygiene line (§4.8) |
| `test/reconcile.test.mjs`, `test/retrace.test.mjs` | `dispute` template and `{{DISPUTE}}` in the local `PROMPTS`; new tests (§7) |

`.config/agents/skills/retrace/SKILL.md` stays unchanged. Its scope-logic item 4 already delegates "response re-asks" and review to delegated Reconcile, and its "Evidence boundary" defines the root that §4.2 reuses. The eval catalogs stay unchanged: `REC-VERDICT-PROGRESS-STOPS` branch V carries no citations and still stops, and ADR-0010 marks the catalogs as separately gated specification fixtures.

## 4. Interfaces, data, invariants and errors

### 4.1 `citations` shape (`lib/schema.mjs`)

- Add `citations` to `VARIANTS.review`.
- `REVISE`: `citations` is optional. `undefined`/`null` normalize to `[]`. Otherwise it must be an array, else defect ``field `citations` must be an array of citation objects``. Each entry must be an object with:
  - `path`: a non-empty string with `path.isAbsolute(path)` true (import `node:path`);
  - `line`: a positive integer (`Number.isInteger`, ≥ 1);
  - `end_line`: optional integer ≥ `line`;
  - `quote`: a string with at least one non-whitespace character. It is kept untrimmed.
  Otherwise the defect is ``citations[<i>] needs an absolute `path`, a positive integer `line`, an optional integer `end_line` not below `line`, and a non-empty `quote` ``. No numeric-string, relative-path or keyword tolerance applies. These are data, not control keywords.
- Normalized value: `value.citations = [{ path, line, end_line, quote }]` in reply order, with `end_line` defaulting to `line`.
- `VALID`/`BLOCKED` with a non-empty `citations` array: defect ``verdict <VERDICT> carries no citations``. An absent/`null`/empty value is accepted and not carried.
- `exampleFor("review")` REVISE examples (both modes) gain `citations: [{ path: "/abs/path/file.md", line: 12, quote: "Exact text on line 12." }]`.
- Schema defects stay ordinary schema invalid returns (existing closed-list item).

### 4.2 Checkable files (`controller.mjs`)

`rs.citationScope = { root: string | null, evidence: string[] }` is fixed at run start in `runReconcile` (passed to `newReviewState`), persisted with `rs` on park, and reused unchanged on resume.

- Direct run: `{ root: deps.repoRoot ?? null, evidence: mode === "artifact" ? [rs.artifact] : [] }`. `cli.mjs` sets `deps.repoRoot = process.cwd()`, which the Reconcile skill requires to be the repository root. Library callers without `repoRoot` have no checkable root.
- Delegated run (`options.reportOnly`): `runScope` passes `options.citationScope = { root: ctx.request.root, evidence: ctx.request.evidence.map((e) => e.locator) }`. This is exactly the Retrace evidence boundary already used for `source-need` and manifest admission.
- Extract the lexical test from `inBoundary` into `insideRoot(root, p)`: `rel = path.relative(root, p)`, then `rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel)`. `inBoundary` calls it, so the two boundaries cannot drift.
- A citation path `p` is **in scope** when `(root && insideRoot(root, p)) || evidence.includes(p)`. This is the approved "readable repository or evidence file": for direct runs the repository and the Artifact-edits artifact; for delegated runs the Retrace boundary. Files named only in Context or supplied through `source-need` outside the repository are not checked. The rule is deliberately lexical and closed, so no Context text parsing is needed.
- A citation is **checkable** when it is in scope and `fs.readFile(p)` (no encoding) succeeds. Any read error (`ENOENT`, `EACCES`, `EISDIR`, …) makes it unchecked. Symlinks are followed; the containment test is lexical, as for `inBoundary`.
- An unchecked citation is neither a mismatch nor passing. Uncited claims are never checked. The provisional `initial` pass is never checked because `applicable` is `null` there.

### 4.3 Matching rule

For each checkable citation, work only on the file `Buffer`:

1. Lines are the byte segments separated by `0x0A`. Line count is the number of `0x0A` bytes, plus one when the file is non-empty and does not end in `0x0A`. An empty file has 0 lines. A `0x0D` before `0x0A` stays part of its line.
2. If `end_line` > line count, the citation mismatches with reason `the file has <n> line(s)`.
3. The cited region is the exact bytes from the start of line `line` through the end of line `end_line`, excluding that line's terminating `0x0A`. Inner `0x0A` separators are included.
4. It passes iff `region.indexOf(Buffer.from(quote, "utf8")) >= 0`: a contiguous byte match. There is no trimming, case folding, Unicode normalization, whitespace collapsing or CRLF translation. A quote spanning lines needs a range covering them. Otherwise the reason is `quote not found in the cited line(s)`.
5. Range label `<range>` is `<line>` when `end_line === line`, else `<line>-<end_line>`.

Each mismatch yields the defect `citation mismatch: <path>:<range>: <reason>`, in reply order.

`checkCitations(rs, citations)` (async, module-private) returns `{ passing, defects }`, where `passing` holds the checkable citations that matched, in reply order.

### 4.4 Invalid return and re-ask

- `expectReview` awaits applicability: `const check = applicable ? await applicable(v) : { ok: true }`. Nothing else in the C4 path changes: the same `invalid`/`rs.invalidReturns` counters, the same `reask` request, and the same stop at the fourth invalid return.
- `reconcileLoop`'s `applicable` becomes async. For `REVISE` it computes `applyCorrection` and `checkCitations`, then collects the defects: first ``correction not applicable: …`` when present, then every citation defect. With defects it returns `{ ok: false, defect: defects.join("; ") }`, which the re-ask sends as `DEFECT`. Otherwise it returns `{ ok: true, bytes, passing }`.
- An invalid return never assigns `working`, adds no row and records no `seen` key. So no working version appears in the record: only a later valid reply's row or the C4 stop row (identity of the unchanged working proposal) appears.

### 4.5 One dispute per revert pair (`reconcileLoop`)

Per outer iteration, beside `seen`: `disputed = new Set()` (unordered pair keys) and `dispute = null` (`{ to, undone, prompt }`). Both reset at each outer iteration and are not persisted. Park happens only after negotiation ends.

Request values: `reviewTurn(ctx, role, { PROPOSAL, OUTER_BASE, BLOCKED_RETRY, DISPUTE: dispute?.to === role ? dispute.prompt : "" }, applicable)`. `reviewerPrompt` defaults `DISPUTE: ""`. The `source` and `reask` requests of the same pass do not repeat it; the session keeps it.

After an admitted finalized verdict (row added as today):

- `VALID`: clear `dispute`; accept as today.
- `BLOCKED`: unchanged. `dispute` stays set, so the one approved-context retry request to the same reviewer carries the same `DISPUTE` text. Persistent `BLOCKED` stops as today.
- `REVISE` (applicable, no citation mismatch). With `prior = working`, `working = derived.bytes`, `key = ${role}:${identity(working)}`, evaluate in this order:
  1. If `dispute` is set: take `d = dispute`, then clear `dispute`. If `identity(working) === d.undone`, stop (c).
  2. If `seen.has(key)` (a would-be cycle):
     - `derived.passing.length === 0` → stop (a).
     - `pair = [identity(prior), identity(working)].sort().join(" ")`; if `disputed.has(pair)`, stop (b).
     - Otherwise add `pair` to `disputed`. Add row `dispute`, pass `—`, identity `identity(working)`, outcome `<role> restored a replaced proposal with <n> checked citation(s); <counterpart> reviews it once`. Set `dispute = { to: counterpart, undone: identity(prior), prompt: renderPrompt(ctx.deps.prompts.reviewer.dispute, { AUTHOR: role, CITATIONS }) }`.
  3. Else `seen.add(key)`.
  4. `role = counterpart`.

`CITATIONS` renders each passing citation in reply order as `<path>:<range>`, a newline, then the quote in a fence whose backtick run is `max(3, longest backtick run in quote + 1)` with info string `text`. Entries are joined by one blank line. Extract the fence-length computation from `supplySources` into one shared helper that both use.

Stops. All use cause `repeated A/B cycle`, a `stop` row with outcome `repeated A/B cycle` and identity `identity(working)`, `step: ${role} ${res.pass}` and `pending: working`, exactly like today's stop. Only the detail differs:

| Case | Condition | `detail` |
|---|---|---|
| (a) | would-be cycle, no passing citation | `the same proposal returned to the same reviewer` (unchanged) |
| (b) | would-be cycle, passing citation, pair already disputed this outer iteration | `the same proposal pair repeated after its one dispute` |
| (c) | the disputed counterpart's `REVISE` restores the undone proposal | `after its one dispute, <counterpart> restored the proposal <author> replaced` (roles of the dispute, e.g. `after its one dispute, B restored the proposal A replaced`) |

Rendered blocker line: `- repeated A/B cycle: <detail> (step: <role> <pass>)`. A delegated scope frontier is `repeated A/B cycle: <detail>` (existing `${cause}: ${detail}` form).

Invariants:

- There is no inner-turn cap, no reviewer replacement and no new counter of invalid returns. `disputed` is liveness state and never consumes or refunds a re-ask.
- A dispute always goes to the counterpart's `later` pass: the counterpart produced the undone proposal through a finalized `REVISE`, so its first actual review is complete.
- Each unordered proposal pair gets at most one dispute per outer iteration. A different pair gets its own.
- Stops (a)–(c) are semantic stops (exit 1, non-resumable, cleanup first) and are never relabeled.

### 4.6 Reconcile skill text (`reconcile/SKILL.md`)

- "Reviewer progression", the sentence beginning "An invalid return is a turn that completes without a `yield`": append the item "or a finalized `REVISE` citation whose quote does not match its checkable file". The list stays closed.
- Same section, new paragraph right after that re-ask paragraph. It states: a finalized `REVISE` may list citations, each an absolute path, a line or inclusive line range, and an exact quote. The checkable files are those of §4.2: for direct review, the controller's working directory (the repository root), and the Artifact-edits artifact; for delegated review, the bound Retrace root and the approved Retrace evidence locators, and only when readable. The byte rule is §4.3. A mismatch names every failing citation in the re-ask and creates no working proposal. Uncheckable citations and uncited claims are not checked, and neither passes. Provisional `initial` responses are never checked.
- "Ephemeral state and identities", the bullet "seen working-identity/reviewer pairs and unresolved frontiers": change it to name also the current outer iteration's disputed proposal pairs and pending dispute.
- "Outer iterations and negotiation", after the paragraph beginning "After each changed applicable finalized `REVISE`": add the §4.5 rule. A revert is a finalized `REVISE` whose new working identity repeats a pair its reviewer already recorded in this outer iteration. A revert with a passing citation whose unordered proposal pair has had no dispute in this outer iteration makes the controller request the counterpart once, with the passing citations attached. The dispute ends at the counterpart's next finalized `VALID` or `REVISE`, and its approved-context `BLOCKED` retry carries the same citations. Every other revert stops as a repeated A/B cycle.
- "Liveness, failure, and repair", replace the bullet "a repeated working-identity/reviewer pair without new evidence or authority, an A/B cycle, or a repeated unresolved frontier;" with one that names a repeated A/B cycle as: a revert without a passing citation; a counterpart that restores the replaced proposal after its one dispute; or a proposal pair repeating after its one dispute in the same outer iteration. The bullet keeps "or a repeated unresolved frontier".
- "Presentation": add `dispute` to the milestone list ("apply, validate, freshness, cleanup, cap, park, resume, and stop").

### 4.7 Reviewer protocol (`reviewer-protocol.md`)

- "Complete response contract": add a `citations` bullet after `preserve`. It says: `REVISE` only, optional; the shape of §4.1; cite the source lines that support a factual claim the Correction relies on; the controller checks each quote byte for byte against the cited lines of a checkable file (pointing to the Reconcile skill's "Reviewer progression"); a quote not found there is an invalid return; other citations are not checked. Add one citation to the `REVISE` JSON example. In the invalid-return paragraph ("A missing or conflicting field, …") add "a citation whose quote the controller does not find in its cited lines".
- "Review passes and yield return": after the approved-context retry paragraph, add: a `later` request may carry a disputed revert, meaning the other reviewer restored a proposal you replaced and supported it with citations the controller checked; weigh them and review the current working proposal once; restoring the proposal it replaced stops the run as a repeated cycle.
- `<!-- prompt:later -->`: insert a line `{{DISPUTE}}` between the first paragraph and `Goal: {{GOAL}}`.
- New section `<!-- prompt:dispute -->`, placed directly after the `later` section. Slots `{{AUTHOR}}` and `{{CITATIONS}}` only. Text: "Disputed revert: reviewer {{AUTHOR}} restored the proposal you replaced and cited the sources below. The controller found each quote in its cited lines. This is your one dispute turn for these two proposals; if you restore the proposal {{AUTHOR}} replaced, the run stops as a repeated cycle." Then a blank line and `{{CITATIONS}}`.

### 4.8 Citation hygiene (`craft-rule/SKILL.md`)

Exactly one added line: step `5.` at the end of the numbered list under `## Update / refine a rule`: `5. When a proposal or rule cites a file, cite it by section heading or quoted text, not bare line numbers.` Nothing else in that file changes. `craft-skill/` is not touched.

## 5. Effects, migration, rollback and compatibility

- Repository file edits only (§3). No non-repository effect, live run, commit or config change.
- Clean cutover: every caller of `applicable`/`expectReview` is in `controller.mjs`; all prompt consumers get the `dispute` marker. `cli.mjs` refuses a protocol lacking `prompt:dispute` (existing missing-marker refusal).
- Replies without `citations` behave exactly as before, apart from stop (a)'s unchanged path.
- A run parked before this change has no `rs.citationScope`. No compatibility branch is added: such a run is disposed on human instruction instead of resumed ([ASSUMPTION] none is parked; see §9).
- Rollback: revert the listed files together.

## 6. Acceptance

Run commands from `.config/agents/harnesses/omp/acp-controller/` unless the check names the repository root. Every `node --test` check here expects the named tests to pass with no failures. `Check` lines give the exact summary counts.

AC-1
Behavior: The review schema accepts `citations` only on `REVISE`, as a list of an absolute `path`, a positive integer `line`, an optional integer `end_line` not below `line`, and a non-empty untrimmed `quote`. It rejects relative paths, bad lines and citations on `VALID`/`BLOCKED` with the §4.1 defects.
Check: `node --test --test-name-pattern "^citations: REVISE-only" test/reconcile.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-2
Behavior: A finalized `REVISE` whose quote does not occur in the cited lines of a checkable file is an invalid return. The re-ask `DEFECT` names `citation mismatch: <path>:<range>: …`, and the mismatched Correction's identity appears nowhere in the record. A citation outside the checkable files with a wrong quote causes no re-ask.
Check: `node --test --test-name-pattern "^citations: a mismatched quote" test/reconcile.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-3
Behavior: Incident replay (A fix, B moves the two `craft-rule` bullet citations to wrong lines without citing, A reverts citing the exact line-103 and line-104 bullet text). A's revert gets exactly one `dispute` row. B's `later` request carries both checked citations, B's `VALID` accepts A's version, and the run ends exit 0 with `## Final proposal` of A's version.
Check: `node --test --test-name-pattern "^dispute: incident replay, counterpart accepts" test/reconcile.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-4
Behavior: Same incident replay, but B's dispute turn reapplies its edit. The run stops exit 1 after that one dispute with blocker `- repeated A/B cycle: after its one dispute, B restored the proposal A replaced (step: B later)` and no `## Final proposal`.
Check: `node --test --test-name-pattern "^dispute: incident replay, counterpart reapplies" test/reconcile.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-5
Behavior: A revert with no passing citation (none, or only an uncheckable one) stops exactly as today: stop row `repeated A/B cycle`, blocker `- repeated A/B cycle: the same proposal returned to the same reviewer (step: A later)`, no `dispute` row and no counterpart turn after the revert.
Check: `node --test --test-name-pattern "^dispute: a revert without a passing citation" test/reconcile.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-6
Behavior: Within one outer iteration a new proposal pair gets its own dispute, and the same unordered pair repeating after its dispute stops with detail `the same proposal pair repeated after its one dispute`.
Check: `node --test --test-name-pattern "^dispute: one dispute per proposal pair" test/reconcile.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-7
Behavior: Delegated Reconcile in Retrace checks citations against the bound Retrace root and evidence locators. A mismatch inside the root is re-asked, and a wrong quote in a file outside the root is not checked. A cited revert gets one dispute whose counterpart `VALID` completes the scope with row `| S1 Area S1 | proposal | 2 | 1 | 1: B; 2: A |`.
Check: `node --test --test-name-pattern "^citations and dispute: delegated review resolves" test/retrace.test.mjs`; expect `ℹ pass 1` and `ℹ fail 0`.

AC-8 is retired (spec-v2): the delegated stop test would duplicate AC-4 on the same path; see §7.

AC-9
Behavior: The existing and new Reconcile, Retrace and preflight tests all pass.
Check: `node --test test/reconcile.test.mjs test/retrace.test.mjs test/preflight.test.mjs`; expect `ℹ tests 51`, `ℹ pass 51` and `ℹ fail 0` (baseline 44 plus 7 new).

AC-10
Behavior: The real protocol loads with the new `dispute` marker, and `later` renders `{{DISPUTE}}`.
Check: `node --input-type=module -e 'import { loadPrompts } from "./lib/prompts.mjs"; const r = await loadPrompts(); console.log(r.ok, Object.keys(r.prompts.reviewer).join(","), r.prompts.reviewer.later.includes("{{DISPUTE}}"), /\{\{AUTHOR\}\}[\s\S]*\{\{CITATIONS\}\}/.test(r.prompts.reviewer.dispute))'`; expect `true initial,rethink,later,source,reask,dispute true true`.

AC-11
Behavior: Every controller module still parses, and the ADR-0010 static cutover scan stays clean.
Check: `find . -name '*.mjs' -not -path '*/node_modules/*' -exec node --check {} \;`; expect no output and exit 0. Check (repository root): the A5 (a) Python scan under **A5 Static checks** in `.agents/artifacts/archive/2026-09-27_reconcile-retrace-acp-production-spec.md`; expect last line `violations: 0` and exit 0.

AC-12
Behavior: Semantic owners state the new rules: the reconcile skill names citation mismatch as an invalid return and the dispute stops, and the protocol carries the `citations` field and `prompt:dispute`.
Check (repository root): `grep -c "citation whose quote does not match its checkable file" .config/agents/skills/reconcile/SKILL.md; grep -c "after its one dispute" .config/agents/skills/reconcile/SKILL.md; grep -c '^<!-- prompt:dispute -->$' .config/agents/skills/reconcile/references/reviewer-protocol.md; grep -c '`citations`' .config/agents/skills/reconcile/references/reviewer-protocol.md`; expect `1`, a value ≥ `1`, `1`, and a value ≥ `1`, in that order.

AC-13
Behavior: Exactly one hygiene line is added to `craft-rule`, under `## Update / refine a rule`, and `craft-skill/` is byte-unchanged.
Check (repository root): `git diff --numstat -- .config/agents/skills/craft-rule/SKILL.md`; expect `1	0	.config/agents/skills/craft-rule/SKILL.md`. Check: `awk '/^## /{s=$0} /cite it by section heading or quoted text, not bare line numbers/{print s}' .config/agents/skills/craft-rule/SKILL.md`; expect exactly `## Update / refine a rule`. Check: `shasum -a 256 .config/agents/skills/craft-skill/SKILL.md .config/agents/skills/craft-skill/evals/evals.json .config/agents/skills/craft-skill/references/maintenance-journal.md`; expect `61167e1a8afca15622c3d28cc983c625dfac5211dda0d62c923ee8d19e84fef0`, `904ae8c5ce1587bd2b3a4c42212004641a11e9748651289bf4c86c0a7e39595a`, `3b13f2e4760e12eca413b76f130f3bb7605a254fe3272f084b104177e1d4217f` in that order.

Mapping of approved acceptance bullets: quote mismatch → AC-2 (and AC-1 shape); one dispute plus reapply stop → AC-3, AC-4, AC-6; cycle without passing citation → AC-5; incident replay, both branches → AC-3, AC-4; Retrace parity → AC-7; existing tests → AC-9. Supporting checks for requirements 1, 2 and 4 and ADR-0010 → AC-10 to AC-13.

## 7. Test seams and proof selection

- Public seams only: `runReconcile` (direct, `deps({ repoRoot })`), `runRetrace` (delegated), and exported `validateResult`, through the scripted launcher. No private export is added for tests.
- Both test files add `dispute: "Dispute from {{AUTHOR}}:\n{{CITATIONS}}"` to their local `PROMPTS.reviewer`, and `\n{{DISPUTE}}` to `later`. A `{ when: "Dispute from A:\n<path>:103", then: … }` entry for scripted B proves attachment: a prompt without the citations would match nothing and fail the turn. `{ when: "citation mismatch: <path>:<range>", then: … }` proves the re-ask names the mismatch.
- Incident fixture (reconcile, AC-3/AC-4): repo root `t.dir/repo`. File `repo/craft-rule/SKILL.md` has 102 filler lines, then line 103 `- Separate universal semantic contracts, repository storage companions, and harness transport shims. Never hide a cross-transport content contract behind a path guard.`, line 104 `- Use always-apply only for tiny universal invariants that must survive every turn.` and line 105 `- Prefer tooling, config, linters, tests, or templates when behavior can be enforced deterministically.`. P0 is a candidate with one flaw that cites lines 103/104. A: provisional VALID, then post-rethink `REVISE`→P1 (fix, keeps 103/104). B: provisional and post-rethink `REVISE`→P2 (moves to 105/106, uncited). A later: `REVISE`→P1 with citations (103, exact bullet text without `- `) and (104, same). AC-3 continues with B's `VALID` (dispute), then A later `VALID` in outer 2. The expected prompt order is `a:initial, a:rethink, b:initial, b:rethink, a:later, b:later, a:later`, with rows A post-rethink (P0) REVISE, B post-rethink (P1) REVISE, A later (P2) REVISE, `dispute` (P1), B later (P1) VALID, `apply` (P1), outer-2 A later (P1) VALID, `closure`, `cleanup`. For AC-4, B's dispute turn is `REVISE`→P2, followed by the `stop` row (P2) and the §4.5 (c) blocker.
- AC-2: A post-rethink `REVISE` cites an in-root line with a wrong quote plus an outside file (`t.dir/outside.md`) with a wrong quote. The re-ask matching `citation mismatch: <in-root path>:<line>` returns `VALID`. Expect prompts `a:initial, a:rethink, a:reask`, exit 0 and unchanged `## Final proposal`, with the Correction's `sha256` absent from the markdown. The unchecked outside citation is proven by the re-ask defect naming only the in-root path; the `when` includes the full defect text, joined by `; ` when there are several.
- AC-5: same A/B/A shape as AC-3 with A's revert uncited in one run (a test may use one run whose revert carries only the outside citation). Exact record: stop row at P1 identity, blocker (a), no `dispute`, prompts end at `a:later`.
- AC-6 sequence: A:P1 → B:P2 → A:P1 cited (dispute on {P1,P2}) → B:P3 → A:P1 cited (new pair {P1,P3}: second dispute) → B:P2 cited (passing) → stop (b). Expect two `dispute` rows and the (b) blocker.
- Retrace (AC-7): evidence `t.root/S1.md`. The report cites `t.root/S1.md` lines. Scripted A reviewer entries use `when: "Owner: S1\n"`; B entries use `when` on the dispute or plain order. Assert the Scope Results row, no frontier and `assertCleanedUp()`.
- Permanent-test value (`dev-implementation/references/test-value.md`): each new test defends a consumer-visible contract, with one plausible bug each:
  - AC-1: citations accepted on `VALID`, or a relative path silently unchecked.
  - AC-2: the mismatch applied as a new version, or the re-ask not naming it.
  - AC-3: the cited revert stopped (the incident regression; fails on pre-fix code with `repeated A/B cycle`, and should be observed failing before the fix).
  - AC-4/AC-6: an unbounded dispute loop.
  - AC-5: an uncited cycle weakened.
  - AC-7: a delegated path passing the wrong boundary (outside file checked, or root file unchecked) or losing dispute state.
  - No delegated stop test: stops (a)–(c) run through the same `reconcileLoop`, and the scope frontier reuses the existing `${cause}: ${detail}` rendering. A delegated copy of AC-4 would duplicate the same path (wiring), so it is not a permanent test.
  There is no existing cycle test to strengthen. Schema validation stays at the `validateResult` seam used by the existing summary test.
- AC-10 is a throwaway command over the real loader, not a permanent test. No permanent test loads the real protocol today, and marker presence is already refused at CLI preflight.
- Baseline for AC-9: the unchanged three-suite run observed `ℹ tests 44`, `ℹ pass 44`, `ℹ fail 0` (spec author, pre-edit); the implementer reconfirms it before editing. The 7 new tests are reconcile 6 (AC-1 to AC-6) and retrace 1 (AC-7).

## 8. Implementation boundary

One cohesive child under a direct contract. Rationale (task sizing): the schema field, controller logic, prompt marker and protocol/skill text share one contract (field names, slot names, defect and detail strings) and are only independently checkable together through the controller suites. Splitting them would create an unsafe intermediate state: a marker missing makes the CLI refuse, and schema without matching would accept unchecked citations. The working set is about 10 files with focused edits in known sections plus 7 tests, which fits one fresh context. The craft-rule line is trivial and independent, but it rides the same child rather than adding a coordination edge. Next owner: `dev-implementation`, then standard independent review, verification and learning.

## 9. Risks, assumptions, stops and open decisions

- [RISK] A trivially short quote (for example `-`) can pass and earn a dispute. The approved rule sets no minimum. The dispute is still bounded to one per pair and the counterpart decides, so loop protection holds.
- [RISK] Direct root depends on the skill-mandated working directory. A run from another cwd narrows or shifts the checkable root. It never widens checks outside a real readable file, and uncheckable citations only lose dispute eligibility.
- [ASSUMPTION] No Reconcile run is parked from before this change. §5 handles one by disposal.
- [RESIDUAL OBLIGATION] ADR-0010 "Verification expectations" says behavior-changing maintenance gets live proof (A7) "from a new OMP session through the skills". The same paragraph requires separate current authority for native or model-backed execution, and this route's constraints forbid live acpx/`omp acp` runs. So A7 does not gate the dev-implementation handoff, review or verification here; AC-1 to AC-13 are the complete offline acceptance. It is not waived either. Owner: the route owner (Main) records it as an open residual at completion and asks the human either to authorize one A7 live run in a new OMP session or to accept the offline proof. Neither implementer nor verifier may run it or claim it.
- Stops for the implementer: any need to change a public request field, add a counter, alter `C4_MAX_REASKS`, touch `craft-skill/`, or edit an ADR returns to the route owner.
- Open decisions: none.

## 10. Revision and next owner

`reconcile-citation-dispute/spec-v2`. Changes from spec-v1, all from one plan-rethink pass:

- The direct checkable root drops the Context-substring clause, leaving the repository root plus the artifact.
- The duplicate delegated-stop test (AC-8) is retired, so AC-9 now expects 51 tests.
- A7 live proof is now an owned residual obligation instead of a risk.

Next owner role `dev-implementation` (direct contract, standard assurance).
