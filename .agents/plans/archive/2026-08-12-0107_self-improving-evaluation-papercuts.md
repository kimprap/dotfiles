# Generic evaluation hardening and papercut capture

**Datetime**: 2026-08-12-0107
**Authority kind**: local-authority
**Scope**: Cross-workflow guidance evaluation and repository-owned friction capture for dotfiles-managed agent behavior
**Summary**: Harden the existing continual-learning evaluation seam and define a generic, low-noise papercut-capture module usable with dev, product, or no custom workflow, without background mining or workflow-specific ownership.
**Status**: DONE


## Objective

- Outcome: OUT-SELF-IMPROVING-AGENT-LOOP-20260812
- Observable end state: every AC-EVAL, AC-PAPER, and AC-PROV criterion passes at the exact bound target while every prohibited/preserved surface remains unchanged
- Progress signal: one named AC observable, named blocker resolution, or authorized revision change; artifact count, observation count, elapsed time, another review, or a ledger entry alone is not progress

1. A curator cannot change the source case, independent adjacent case, expected behavior, proof method, or tuple identity after dispatch.
2. Deterministic and semantic-only proof have exact distinct ownership and terminal mappings while the existing curation route, outcomes, six-field payload, and Common Handoff remain intact.
3. A tiny globally installed rule exposes a small `papercut` skill interface; one standard-library helper hides schema validation, safe persistence, deduplication mechanics, atomic update, and compact resolution behind that interface.
4. Repository persistence is explicit, opt-in, non-authoritative, not automatically loaded, and separate from transcripts, Mnemopi, future `.agents/memory/`, trackers, and repair authority.


`HANDOFF-SELF-IMPROVEMENT-20260811-r1` is discussion evidence, not authority. Fresh checks qualify its sources: Google `agents-cli` supports anti-gaming guidance, optional validation data, deterministic code metrics, and reasoned LLM metrics, but does not enforce a frozen or independently owned seam and may reuse training data for validation; Steve Ruiz's first-party posts support proactive concise capture and explicitly user-triggered transcript review, but do not supply this plan's recurrence, repository-ownership, redaction, deduplication, or promotion policy. Those are human-confirmed local design choices.

The observed working tree has 29 unstaged and 13 untracked paths, including concurrent changes in `dev-implementation`, `WORKFLOW.md`, `evals.json`, ADR-0004, and the ADR index. Execution must re-read and semantically rebind those exact targets before each edit, preserve unrelated bytes, and stop for material authority drift rather than resetting or overwriting current work.
## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-USER | Human product/design authority | Current conversation and confirmed grilling answers | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Evaluation binding, proof ownership, global activation, automatic opt-in, ledger shape, retention, review, and memory boundaries confirmed; native approval of this exact plan revision still required |
| AUTH-HANDOFF | Discussion evidence | Attached `HANDOFF-SELF-IMPROVEMENT-20260811-r1` | `HANDOFF-SELF-IMPROVEMENT-20260811-r1` | Evidence only; no implementation authority |
| AUTH-ADR-LEARNING | Active canonical decision | `docs/adr/0004-canonical-discovery-and-continual-learning.md` | `e1b1d376020aeebd18b6689554b9123e1c7c9b8ba5d4fb87682e2d64bd5bec0e` | ACTIVE D07/D23; this plan is authorized to reopen their validation and non-authoritative-state boundaries after native plan approval |
| AUTH-PLAN-CONTRACT | Current plan structure and OMP transport | `.config/agents/rules/plan.md`; `.config/agents/rules/plan-impl-spec.md`; `.config/agents/rules/plan-omp-transport.md`; `.config/agents/rules/plan-repo-storage.md`; `executor_plan.py` | respectively `260997c25550c45860394a22a758cee50be435e7c75c8e7280edc74e7669f88c`, `287e618316876d2922ee92124597184af16ab2727fb4e125b52961c40df9d1ff`, `a752fb947d3d682c88d0ed2f7ee5057c0543a2f90bb7934e6abba2c049311556`, `f29e80e210bf3d9e5ab751d438278b2bff7d4419a3c2820375c125efffbda1d6`, `5139dcbac9d91676e78188912c4f0ade78babe9670cc5975a7e97331cf74d015` | Applicable structural/transport authority only; no semantic or effect authority |
| AUTH-PROJECT | Project-owned operating guidance | `.agents/AGENTS.md` | `dda9ed020c155569914e99a3bbc5a054f6fc6a7bac462c34f4294597a6a88ddd` | Active repository authority |
| AUTH-FOUNDATION | Human-managed foundational guidance | `/Users/kim/.agents/AGENTS.md` | `562f99208b0aa862353ad3c3f151a12852623059f4a925b73b658f7c9103028b` | Read-only exclusion: no direct or indirect mutation |
| AUTH-GOOGLE-EVAL | External implementation evidence | [Google status `2086874630032073142`](https://x.com/GoogleCloudTech/status/2086874630032073142), inaccessible linked article `2086871505124589568`, and [`google/agents-cli` evaluation sources](https://github.com/google/agents-cli/tree/5a306f8956cb1eeae69f9709de0e4d61b44e11e7) | commit `5a306f8956cb1eeae69f9709de0e4d61b44e11e7`; relevant blobs `8314f9795ad97d275b73782d3e56f4a1566c5411`, `47dbe0ecec12f720e5b96f5fc46472df3bdb5ebe`, `73c7307f88faeae7ad805bac72232ccb298bd7bc`, `527a7b98c016a0b40d1004ad32ec0c261476ee6b` | Repository facts are advisory evidence; inaccessible article body/title/rule summary remain discussion-only |
| AUTH-RUIZ-PAPERCUT | External behavior evidence | X statuses [`2075303919664734295`](https://x.com/steveruizok/status/2075303919664734295), [`2075304096328798401`](https://x.com/steveruizok/status/2075304096328798401), [`2075329969169850651`](https://x.com/steveruizok/status/2075329969169850651); media [`HMz1tvqWoAA6wh2`](https://pbs.twimg.com/media/HMz1tvqWoAA6wh2.png:large), [`HM0NkRFXEAAOLHv`](https://pbs.twimg.com/media/HM0NkRFXEAAOLHv.jpg:large) | first-party identities rechecked 2026-08-12; UTC publication date 2026-07-09 | Advisory evidence only |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-EVAL-BINDING | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Reuse the curator Task Contract's existing `Acceptance`/`Verification` seam. A Learning Candidate reporter proposes one `CE-...` tuple per mutating candidate; the backend validates authority, freshness, completeness, adjacent-case independence, and proof classification, then freezes the canonical tuple and SHA-256 in the Task Contract/Context Pack before curator dispatch. |
| DEC-EVAL-PROOF | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Stable deterministic proof needs no separate reasoned evaluator. Any semantic-only claim requires one fresh read-only non-curator evaluator inside the same curation task; mixed proof applies each rule to its facet. No new lifecycle state, route stage, verdict, or Handoff is introduced. |
| DEC-EVAL-BASELINE | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Exact settled source evidence may be reused only while target revision, environment, expectation, and proof method match. The adjacent case always runs fresh before mutation. Both cases rerun after mutation against the frozen expectations. |
| DEC-EVAL-OUTCOME | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Complete proof is required for `CURATED`; a stable deterministic failure restores only the curator's exact delta and yields `NO DURABLE LEARNING`; stale/missing/tampered binding, missing semantic verdict, flaky proof, inconclusive proof, or unsafe rollback yields `BLOCKED` with an exact resume condition. Existing `NO DURABLE LEARNING` assessment evidence remains valid when no mutation occurs. |
| DEC-PAPERCUT-INTERFACE | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Add one tiny `alwaysApply` rule that loads one model-discoverable `papercut` skill only after qualifying friction appears. The rule is the activation interface; the skill is the semantic interface; the helper/schema are the implementation. No workflow-specific adapter or lifecycle stage is added. |
| DEC-PAPERCUT-QUALIFICATION | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Persist the first reproducible, repository-owned, reusable, redacted observation. Reject or route task/plan/runtime state, tracked or blocking defects, secrets, security incidents, external outages, harness/tool-contract defects, and one-off operator mistakes. The repository must be able to mitigate the friction through its own docs, configuration, tooling, or workflow. |
| DEC-PAPERCUT-PERSISTENCE | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | `.agents/papercuts.json` with `schema_version: 1` and `capture_mode: automatic` is explicit repository opt-in and standing permission for qualified in-the-moment upserts. This plan initializes the dotfiles ledger. Absence never triggers creation during ordinary work. |
| DEC-PAPERCUT-MODULE | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | The skill performs semantic qualification, redaction, and existing-record selection. One Python standard-library helper plus bundled JSON Schema owns deterministic `init`, `validate`, `summary`, `upsert`, and `resolve`; safe path checks; expected-digest concurrency; OS-temporary locking; same-directory atomic replacement; stable structured output; and compact resolution. No storage-adapter abstraction is added before a real second store exists. |
| DEC-PAPERCUT-DATA | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Open records retain only generalized summary/surface/repository scope, UTC first/last dates, redacted activity→friction→workaround observations and digest IDs, a generic independence basis, and optional cause/fix explicitly marked unverified. Exclude usernames, models, prompts, transcripts, raw output, task/plan/session IDs, and rich execution provenance. |
| DEC-PAPERCUT-LIFECYCLE | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Records are only `open` or `resolved`; candidate readiness is derived, not stored. Exact duplicate observations are no-ops; semantically matching independent observations merge. Resolution keeps the generalized statement, dates, observation digests, and exact fix/rejection disposition while removing redundant prose. No time/count expiry or background compaction exists. |
| DEC-PAPERCUT-AUTHORITY | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Automatic capture fails safe to report-only when explicit read-only/no-write authority, an exact Task Contract write set, immutable verification/review identity, or staging/shipping excludes the ledger. Every actual ledger mutation is disclosed. A qualified Learning Candidate returns to the current lifecycle owner or final response; explicit `review` proposes only and never dispatches, repairs, curates, writes trackers, retains memory, or ships. |
| DEC-MEMORY-BOUNDARY | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | No transcript mining or automatic Mnemopi/`.agents/memory/` integration. The ledger is non-authoritative repository evidence and is never auto-loaded. A future memory adapter requires its own approved authority, schema, privacy, and deduplication contract. |
| DEC-PROVENANCE | derived design under ADR-0004 D23 | Reopen ADR-0004 D07/D23 for the stronger curation seam and explicit non-memory carve-out; create focused ADR-0006 D24 as the sole owner of cross-workflow papercut rationale; add ADR-0006/D24 discovery to the index without copying source history into executable rules or skills. |
| DEC-REJECT-EVAL | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Reject guidance-only anti-gaming, a semantic sidecar, human approval per tuple, backend-invented expectations, hidden-case infrastructure, a second evaluator for deterministic proof, curator self-grading of semantic proof, post-change-only baselines, and universal optimizer/scoring loops. |
| DEC-REJECT-PAPERCUT | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | Reject mutation of global `AGENTS.md`; TTSR/relevance-only activation; Markdown, append-only, memory-path, or response-only storage; recurrence-only or capture-everything intake; stored candidate states; rich provenance; automatic repair/review/transcript mining/memory retention; dev-only routing; and ledger writes that override narrower task or delivery authority. |

## Scope, non-goals, and prohibited effects

- Read surfaces: current project/foundational guidance; `dev-implementation`, `dev-continual-learning`, `dev-ask/WORKFLOW.md`, current curation registry/fixtures, ADR-0004/index, OMP/Grok skill/rule discovery, manifest/bootstrap coverage, current Mnemopi configuration, and the immutable/advisory Google and Ruiz sources in AUTH-GOOGLE-EVAL/AUTH-RUIZ-PAPERCUT.
- Change surfaces: the exact existing/new targets TGT-LEARNING through TGT-ADR-INDEX; no implicit directory-wide mutation.
- Non-goals: redesigning lifecycle routing, product workflow, Common Handoff, memory backends, tracker triage, automatic optimization, general issue tracking, or the human-managed foundational guide; measuring model improvement; importing Ruiz's CLI implementation; capturing current task history as ledger data.
- Prohibited effects: transcript or memory mining; automatic Mnemopi retention; `.agents/memory/` creation; global `AGENTS.md` mutation or bypass; background jobs, timers, counters, or audits; candidate queues/state machines; automatic repair, curation, tracker mutation, staging, commit, push, release, deploy, or shipping; overwrite/reset of concurrent work; ledger writes during conflicting read-only, exact-target, or delivery authority.

External sources constrain claims but do not grant local design authority. The implementation must preserve the distinction between source behavior and the local evaluator-independence, qualification, redaction, and promotion safeguards in AUTH-USER.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-CONTRACT | Existing workflow/skill/eval mutation | AUTH-USER, AUTH-ADR-LEARNING | Only TGT-LEARNING, TGT-BACKEND, TGT-WORKFLOW, TGT-DEV-EVAL-REGISTRY, and TGT-DEV-EVAL-FIXTURES; preserve route, payload, outcomes, and concurrent bytes |
| EFF-GLOBAL-RULE | New globally installed rule/skill behavior | AUTH-USER | Only TGT-PAPERCUT-RULE and TGT-PAPERCUT-SKILL/module assets; rule remains tiny and skill loads only on a candidate or explicit invocation |
| EFF-LEDGER | New repository-owned data/config artifact | AUTH-USER | Initialize only dotfiles TGT-PAPERCUT-LEDGER with empty records and `capture_mode: automatic`; ordinary work never creates another repository ledger implicitly |
| EFF-ADR | Canonical decision documentation | AUTH-USER, AUTH-ADR-LEARNING | Update ADR-0004/index and create ADR-0006 only; executable contracts remain the behavior source |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-EVAL | Embedded curator Task Contract evaluation binding and proof/result mapping | T1 | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | T1, T3 |
| CONTRACT-CANDIDATE | Existing Learning Candidate fields plus a non-authoritative evaluation proposal for any candidate that may mutate guidance | T1 | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | T1, T2, T3 |
| CONTRACT-CURATION-COMPAT | Existing one curation task, three outcomes, six payload fields, Common Handoff, terminal ownership, and no recursive curation | T1 | ADR-0004 D07 at `e1b1d376020aeebd18b6689554b9123e1c7c9b8ba5d4fb87682e2d64bd5bec0e` plus AUTH-USER | T1, T3 |
| CONTRACT-PAPERCUT-ACTIVATION | Tiny global rule and on-demand skill interface | T2 | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | T2, T3 |
| CONTRACT-PAPERCUT-LEDGER | Versioned opt-in JSON data, record identity, open/resolved invariants, and compact disposition | T2 | `papercut-ledger/v1` | T2, T3 |
| CONTRACT-PAPERCUT-CLI | Deterministic stateful helper operations and structured results | T2 | `papercut-ledger-cli/v1` | T2 |
| CONTRACT-PAPERCUT-ROUTING | Qualification, exclusion, report-only fallback, candidate delivery, and proposal-only review | T2 | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | T2, T3 |
| CONTRACT-MEMORY | Papercut evidence remains non-authoritative, explicit-read, and separate from transcripts, Mnemopi, and `.agents/memory/` | T2 | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | T2, T3 |
| CONTRACT-PROVENANCE | ADR-0004 owns dev curation; ADR-0006 D24 owns cross-workflow papercut rationale; index owns discovery | T3 | `SELF-IMPROVEMENT-DESIGN-20260812-r1` | T3 |

### Curation binding

For every reported candidate that may mutate guidance, the reporter supplies one complete proposal and the backend embeds it under the existing curator Task Contract `## Verification` heading before dispatch:

```json
{
  "id": "CE-STABLE-ID",
  "candidate_revision": "EXACT-CANDIDATE-REVISION",
  "source": {
    "identity": "SOURCE-CASE-OR-OBSERVABLE-ID",
    "revision": "EXACT-SOURCE-REVISION",
    "expected": "OBSERVABLE-SOURCE-BEHAVIOR",
    "proof": "EXACT-DETERMINISTIC-CHECK-OR-SEMANTIC-RUBRIC",
    "baseline": "SETTLED-EVIDENCE-ID-OR-FRESH-REQUIRED"
  },
  "adjacent": {
    "identity": "INDEPENDENT-NEAR-MISS-ID",
    "revision": "EXACT-ADJACENT-REVISION",
    "expected": "OBSERVABLE-UNCHANGED-BEHAVIOR",
    "proof": "EXACT-DETERMINISTIC-CHECK-OR-SEMANTIC-RUBRIC",
    "independence": "REASON-CASE-DID-NOT-DERIVE-THE-CHANGE",
    "baseline": "fresh-required"
  },
  "proof_mode": "deterministic | semantic | mixed",
  "semantic_evaluator": "none | separate"
}
```

The Task Contract records `CE-STABLE-ID @ SHA256` where `SHA256` is the 64-character lowercase digest over canonical UTF-8 JSON with sorted keys and compact separators. The backend, not the curator, validates the proposal and binds the digest in the exact Context Pack. A curator may not add, replace, weaken, or omit a tuple. A Standard assessment with no bound mutating candidate may return `NO DURABLE LEARNING`; a curator-discovered unbound candidate is recorded under existing `Skipped`/`Deep candidate` semantics for a later bound route and is never mutated in the same assessment.

Post-mutation semantic evidence is an internal read-only result, not a Handoff:

```json
{
  "tuple_sha256": "BOUND-64-CHARACTER-LOWERCASE-DIGEST",
  "evaluator_identity": "FRESH-NON-CURATOR-IDENTITY",
  "verdict": "PASS | FAIL | FLAKY | INCONCLUSIVE",
  "source_observed": "OBSERVED-SOURCE-RESULT",
  "adjacent_observed": "OBSERVED-ADJACENT-RESULT",
  "rationale": "REASONED-COMPARISON-TO-FROZEN-EXPECTATIONS"
}
```

`Validation` cites the matching tuple, reused/fresh baselines, post-mutation results, evaluator result when required, destination checks, and final destination identity. Failed deterministic proof restores the exact curator delta only when the current bytes still match that delta; concurrent drift or unsafe restoration is `BLOCKED`, never an overwrite.

### Learning Candidate proposal

Preserve the existing candidate fields: proposed durable statement, exact source revisions, project scope/suggested destination, recurrence or severity, prevention relationship, sensitivity/redaction, and conflicts/supersession. Add one `Evaluation proposal` containing the complete source/adjacent/proof object above. It remains non-authoritative until backend validation and binding; incomplete proposals may remain evidence but cannot authorize a curator mutation.

### Papercut ledger

The helper and JSON Schema enforce this logical shape:

```json
{
  "schema_version": 1,
  "capture_mode": "automatic",
  "records": {
    "pc-0123456789abcdef": {
      "summary": "REDACTED-SUMMARY-STRING-LENGTH-1-THROUGH-240",
      "surface": "REPOSITORY-OWNED-SURFACE-STRING-LENGTH-1-THROUGH-160",
      "scope": "repository",
      "status": "open",
      "first_seen": "YYYY-MM-DD",
      "last_seen": "YYYY-MM-DD",
      "observation_digests": ["obs-0123456789abcdef"],
      "observations": {
        "obs-0123456789abcdef": {
          "observed_on": "YYYY-MM-DD",
          "activity": "GENERIC-REDACTED-ACTIVITY-STRING-LENGTH-1-THROUGH-500",
          "friction": "GENERIC-REDACTED-FRICTION-STRING-LENGTH-1-THROUGH-500",
          "workaround": null,
          "independence_basis": "GENERIC-INDEPENDENCE-BASIS-STRING-LENGTH-1-THROUGH-500"
        }
      },
      "hypothesis": null,
      "disposition": null
    }
  }
}
```

`hypothesis`, when present, contains exactly `status: unverified` plus `cause` and `fix`, each either null or a string of 1 through 500 characters. `workaround` follows the same null-or-string limit. A resolved record has `status: resolved`, an empty `observations` object, retained ordered unique `observation_digests`, and a non-null disposition with: `kind` exactly `fixed | rejected | superseded`; `resolved_on` as `YYYY-MM-DD`; `reference` as an exact durable reference of 1 through 500 characters; and `summary` of 1 through 500 characters. Every object rejects unknown keys. Record IDs are the first 16 hex characters of SHA-256 over the exact validated `surface + NUL + summary` UTF-8 bytes; observation IDs are the first 16 hex characters of SHA-256 over canonical UTF-8 observation JSON with sorted keys and compact separators. Persisted ledgers use sorted keys, two-space indentation, LF, one final newline, and SHA-256 over those exact file bytes. The helper rejects collisions, malformed dates, duplicate list entries, key/digest disagreement, first/last-date inconsistency, resolved records with observations, and open records with dispositions.

### Papercut helper and semantic seam

The single helper exposes:

```text
papercut_ledger.py init     --repo PATH [--dry-run]
papercut_ledger.py validate --repo PATH
papercut_ledger.py summary  --repo PATH [--id PC-ID]
papercut_ledger.py upsert   --repo PATH --input JSON_PATH --expected-sha256 SHA256 [--dry-run]
papercut_ledger.py resolve  --repo PATH --id PC-ID --input JSON_PATH --expected-sha256 SHA256 [--dry-run]
```
`upsert` input is exactly one object with `record_id`, `summary`, `surface`, `observed_on`, `observation`, and `hypothesis`. `observation` contains `activity`, `friction`, nullable `workaround`, and `independence_basis`; `hypothesis` is null or the v1 unverified object. The helper recomputes and verifies the record ID, computes the observation digest, creates a new record or appends one new observation to the explicitly selected matching record, treats an exact observation digest as unchanged, permits only null-to-unverified hypothesis enrichment, and rejects a conflicting record/hypothesis as `id_collision`. It never searches semantically or rewrites existing prose.

`resolve` input is exactly one object with `kind`, `resolved_on`, `reference`, and `summary`, using the v1 disposition limits above. Plain `summary` returns only ID, generalized summary/surface, state, dates, observation count/digests, and disposition; `summary --id` returns exactly one full validated record for post-candidate deduplication/review. `init` writes only the canonical empty object `{ "schema_version": 1, "capture_mode": "automatic", "records": {} }`.


Success emits one bounded JSON object with schema `papercut-ledger-cli/v1`, operation, one status from `created`, `valid`, `changed`, `unchanged`, `resolved`, or `dry-run`, ledger SHA-256, and applicable record/observation IDs. Errors are nonzero, write nothing, and name one stable code: `not_initialized`, `already_initialized`, `invalid_input`, `schema_invalid`, `unsafe_path`, `ledger_changed`, `id_collision`, `record_missing`, `lock_unavailable`, or `io_failed`. The helper implements explicit v1 validation; it does not interpret arbitrary JSON Schema or add a validator dependency. Stateful operations use an OS-temporary advisory lock keyed by canonical ledger path, compare the caller's expected digest while locked, write a same-directory temporary file, flush/fsync it, atomically replace, fsync the parent directory, and leave no repository lock/temp file.

The skill—not the helper—decides whether friction qualifies, redacts it, semantically chooses an existing record, assesses observation independence, and constructs a complete Learning Candidate. It reads only the compact summary after a candidate exists, reads one selected record when needed, performs at most one semantic rebind after `ledger_changed`, and otherwise falls back to report-only. The helper never infers qualification or candidate readiness from counts.

### Papercut skill modes

The always-apply rule has valid minimal frontmatter plus at most six nonblank body lines: notice only plausible current repository-owned reusable friction; load `papercut` before the terminal response; otherwise do not load the skill, inspect storage, or emit output. It contains no schema, command, workflow, memory, or repair procedure. The skill owns four modes:

1. `capture` is the only automatic mode. After one candidate exists, apply qualification/redaction, read compact state only if the ledger is initialized, choose at most one exact record, call `upsert` when current authority permits, and emit one bounded terminal line only for a qualified candidate: `Papercut: recorded|updated|unchanged|report-only PC-ID — REDACTED-SUMMARY`. Report-only names the exact boundary and supplies the reusable redacted observation to the current owner without pretending persistence.
2. `init` runs only on explicit `/skill:papercut init` or `/papercut init`, rechecks repository/write authority, and calls helper `init`; it never runs from automatic capture.
3. `review` runs only on explicit request, validates the ledger, reads the compact summary and only selected records, then returns deduplication, resolution, or Learning Candidate proposals. It writes nothing and does not repair, dispatch, curate, retain, track, or ship.
4. `resolve` runs only on an explicit record/disposition request, rechecks write authority, requires an exact durable fixed/rejected/superseded reference, and calls helper `resolve`; it never infers success from the current task.

OMP `/skill:papercut` and Grok `/papercut` expose the same modes. Any explicit invocation under read-only, plan, immutable-target, verification/review, staging, or shipping authority remains read/proposal-only. No-candidate ordinary work produces no line or section.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-LEARNING | `.config/agents/skills/dev-continual-learning/SKILL.md` | T1 | SHA-256 `5e58c99208b0aa862353ad3c3f151a128526230594a925b73b658f7c9103028b` | backend dispatch, every Learning Candidate reporter, curator, curation payload | AC-EVAL-01, AC-EVAL-02, AC-EVAL-03, AC-EVAL-04 |
| TGT-BACKEND | `.config/agents/skills/dev-implementation/SKILL.md` | T1 | SHA-256 `248ad55c0e4bf4da5fd8df26e559e30892952708a1027801792d3c773f30f11b` | Task Contract/Context Pack, curation dispatch, terminal mapping/accounting | AC-EVAL-01, AC-EVAL-02, AC-EVAL-03, AC-EVAL-04 |
| TGT-WORKFLOW | `.config/agents/skills/dev-ask/WORKFLOW.md` | T1 | SHA-256 `fa6fefbdbcdbd7f1d3e56813e5272617badaad73fa8031a5da23eca46118e407` | current behavior summary and decision map | AC-EVAL-04 |
| TGT-DEV-EVAL-REGISTRY | `.config/agents/skills/dev-ask/evals/evals.json` | T1 | SHA-256 `d982432ef1e7e8d0cd1eb8ccfe772f79d80f8ffc9408682b7de42c2d959dd920` | backend/router model traces | AC-EVAL-01, AC-EVAL-02, AC-EVAL-03, AC-EVAL-04 |
| TGT-DEV-EVAL-FIXTURES | existing `b-t4-learning-standard`, `b-compact-curation-trigger`, `b-t4-curation-no-durable`, `b-t4-curation-blocked`, and `b-t4-curation-compact-not-triggered`; new `b-t4-curation-unbound-candidate`, `b-t4-curation-tuple-drift`, `b-t4-curation-deterministic-failure`, `b-t4-curation-semantic-verdict`, `b-t4-curation-semantic-verdict-missing`, `b-t4-curation-flaky`, and `b-t4-curation-inconclusive` `case.json` paths under `.config/agents/skills/dev-ask/evals/fixtures/` | T1 | existing SHA-256 values respectively `40e7321c424313c0ebde527c4724b6e68ba046b10ebcb17a10f4b48ae77226a4`, `33cc76c3a1777311efcf5cf9d29d078c9d9c5667d2a413666bdfbe6ea1a9ec0b`, `75af6b15fcc5738446c3ff78d58c512d55094247331793d4f9ca7964cef42157`, `99851cae044755344d9efa4fa4a3f9f184ce6be8f088828284fba637391d4396`, and `04f26df3e788319d8065d98c669d3e413e91ec4462acd385862f63841686be72`; seven new paths absent | TGT-DEV-EVAL-REGISTRY entries and targeted OMP traces | AC-EVAL-01, AC-EVAL-02, AC-EVAL-03, AC-EVAL-04 |
| TGT-PAPERCUT-RULE | `.config/agents/rules/papercut.md` | T2 | absent | every turn; activation only | AC-PAPER-01, AC-PAPER-02, AC-PAPER-07 |
| TGT-PAPERCUT-SKILL | `.config/agents/skills/papercut/SKILL.md` | T2 | absent | global rule, explicit OMP `/skill:papercut`, explicit Grok `/papercut`, future callers | AC-PAPER-01, AC-PAPER-02, AC-PAPER-03, AC-PAPER-05, AC-PAPER-06, AC-PAPER-07 |
| TGT-PAPERCUT-SCHEMA | `.config/agents/skills/papercut/assets/papercuts.schema.json` | T2 | absent | helper, ledger tests, maintainers | AC-PAPER-04, AC-PAPER-05 |
| TGT-PAPERCUT-HELPER | `.config/agents/skills/papercut/scripts/papercut_ledger.py` | T2 | absent | papercut skill only | AC-PAPER-03, AC-PAPER-04, AC-PAPER-05 |
| TGT-PAPERCUT-TESTS | `.config/agents/skills/papercut/scripts/test_papercut_ledger.py` | T2 | absent | Python unittest discovery | AC-PAPER-03, AC-PAPER-04, AC-PAPER-05 |
| TGT-PAPERCUT-EVALS | `.config/agents/skills/papercut/evals/evals.json` | T2 | absent | skill/rule discovery and positive/near-miss model smoke | AC-PAPER-01, AC-PAPER-02, AC-PAPER-03, AC-PAPER-05, AC-PAPER-06, AC-PAPER-07 |
| TGT-PAPERCUT-LEDGER | `.agents/papercuts.json` | T2 | absent | dotfiles opt-in and helper end-to-end smoke | AC-PAPER-03, AC-PAPER-04, AC-PAPER-05, AC-PAPER-07 |
| TGT-ADR-LEARNING | `docs/adr/0004-canonical-discovery-and-continual-learning.md` | T3 | SHA-256 `e1b1d376020aeebd18b6689554b9123e1c7c9b8ba5d4fb87682e2d64bd5bec0e` | D07/D23 curation and non-memory boundary | AC-PROV-01, AC-PROV-02 |
| TGT-ADR-PAPERCUT | `docs/adr/0006-generic-papercut-evidence.md` | T3 | absent | sole D24 rationale/source owner | AC-PROV-01, AC-PROV-02 |
| TGT-ADR-INDEX | `docs/adr/INDEX.md` | T3 | SHA-256 `201088947bed32a5127992774b06c6c3a7d1df82db07c492ed01134a620ddaaf` | ADR-0006 and D24 discovery | AC-PROV-01, AC-PROV-02 |

## Execution policy

- Assurance: standard — globally visible behavior and repository data writes require independent final proof/review, while explicit opt-in, report-only fallback, no secrets/transcripts, no destructive migration, and no external/shipping effect keep the route below high-consequence.
- Topology: single-lineage
- Max concurrency: 1
- Isolation: none — use the current shared working tree because exact uncommitted target bytes are authority inputs; never copy a stale committed baseline into an isolated worktree.
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: one cohesive implementation owner; reread every overlapping existing target immediately before edit; preserve unrelated concurrent bytes; re-run semantic binding after drift; new files remain exclusive to this plan; material authority/contract drift returns BLK-DRIFT rather than choosing a winner.
- Decomposition: prohibited — T1 and T2 have fixed interfaces but share one final canonical/evaluation boundary; no worker delegation, nested plan, or parallel mutation.
- Effect limit: EFF-CONTRACT, EFF-GLOBAL-RULE, EFF-LEDGER, EFF-ADR only; no staging, commit, push, global-guide, memory, tracker, product-workflow, or external effect.
- Orchestrator profile: one qualified owner with standard verifier/reviewer separation; full orchestration is unnecessary and no downgrade/fan-in path exists.

## Tasks

- [x] T1. Bind and prove the curation evaluation bar
  completed 2026-08-12-0949
  - Owner: implementation owner
  - Wave: W0
  - Depends on: none
  - Targets: TGT-LEARNING, TGT-BACKEND, TGT-WORKFLOW, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES
  - Contracts: CONTRACT-EVAL, CONTRACT-CANDIDATE, CONTRACT-CURATION-COMPAT
  - Criteria: AC-EVAL-01, AC-EVAL-02, AC-EVAL-03, AC-EVAL-04
  - Effects: EFF-CONTRACT
  - Output: OUTP-EVAL
  - Receiver: T3
  - Verification: VR-EVAL-01, VR-EVAL-02, VR-EVAL-03, VR-EVAL-04
  - Lineage: shared
- [x] T2. Build the generic papercut evidence module
  completed 2026-08-12-0949
  - Owner: implementation owner
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-SCHEMA, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER
  - Contracts: CONTRACT-CANDIDATE, CONTRACT-PAPERCUT-ACTIVATION, CONTRACT-PAPERCUT-LEDGER, CONTRACT-PAPERCUT-CLI, CONTRACT-PAPERCUT-ROUTING, CONTRACT-MEMORY
  - Criteria: AC-PAPER-01, AC-PAPER-02, AC-PAPER-03, AC-PAPER-04, AC-PAPER-05, AC-PAPER-06, AC-PAPER-07
  - Effects: EFF-GLOBAL-RULE, EFF-LEDGER
  - Output: OUTP-PAPERCUT
  - Receiver: T3
  - Verification: VR-PAPER-01, VR-PAPER-02, VR-PAPER-03, VR-PAPER-04, VR-PAPER-05, VR-PAPER-06, VR-PAPER-07
  - Lineage: shared
- [x] T3. Synchronize canonical ownership and final target
  completed 2026-08-12-0949
  - Owner: implementation owner
  - Wave: W2
  - Depends on: T1, T2
  - Targets: TGT-ADR-LEARNING, TGT-ADR-PAPERCUT, TGT-ADR-INDEX
  - Contracts: CONTRACT-EVAL, CONTRACT-CANDIDATE, CONTRACT-CURATION-COMPAT, CONTRACT-PAPERCUT-ACTIVATION, CONTRACT-PAPERCUT-LEDGER, CONTRACT-PAPERCUT-ROUTING, CONTRACT-MEMORY, CONTRACT-PROVENANCE
  - Criteria: AC-PROV-01, AC-PROV-02
  - Effects: EFF-ADR
  - Output: OUTP-FINAL
  - Receiver: dev-verification
  - Verification: VR-PROV-01, VR-PROV-02
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-EVAL-01 | A reported Learning Candidate may mutate guidance | Before curator readiness, the exact reporter proposal is authority/freshness/completeness/independence checked, embedded under Task Contract `Verification`, canonically hashed, and bound in the Context Pack; absence, staleness, or curator tampering permits no write and no `CURATED` | TGT-LEARNING, TGT-BACKEND, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES | T1 |
| AC-EVAL-02 | The bound source has exact settled evidence and the adjacent case is independent | Matching settled source evidence is reused; stale/mismatched source evidence reruns; adjacent always runs fresh before mutation; source and adjacent both rerun after mutation against unchanged expectations | TGT-LEARNING, TGT-BACKEND, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES | T1 |
| AC-EVAL-03 | Deterministic, semantic, mixed, stable-failure, missing-verdict, flaky, and inconclusive cases execute | Deterministic facets need no separate evaluator; semantic facets have one fresh read-only non-curator reasoned result; complete pass alone yields `CURATED`; stable deterministic failure safely restores and yields `NO DURABLE LEARNING`; stale/missing/flaky/inconclusive/unsafe-restoration paths yield `BLOCKED` | TGT-LEARNING, TGT-BACKEND, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES | T1 |
| AC-EVAL-04 | The strengthened seam is compared with current routing and outputs | One curation task, route position, Common Handoff, three outcomes (`CURATED`, `NO DURABLE LEARNING`, `BLOCKED`), exact six payload fields, compact trigger behavior, terminal ownership, and no recursive curation remain byte-level contract invariants | TGT-LEARNING, TGT-BACKEND, TGT-WORKFLOW, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES | T1 |
| AC-PAPER-01 | Equivalent qualifying friction occurs during dev, product, custom, and direct work in OMP/Grok | The tiny always-apply rule loads the same `papercut` skill interface only after the candidate appears; no workflow-specific stage, adapter, duplicated procedure, or foundational-guide edit exists | TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS | T2 |
| AC-PAPER-02 | Qualifying and excluded observations are presented | Reproducible repository-owned reusable redacted friction qualifies; task/plan state, tracked/blocking defects, secrets, security incidents, external outages, harness/tool-contract defects, and one-off operator mistakes are rejected or sent to their existing owner with zero ledger mutation | TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS | T2 |
| AC-PAPER-03 | A qualified candidate encounters initialized, absent, manual-conflict, exact-target, or concurrent-change conditions | Initialized automatic ledger upserts and is disclosed; absent ledger is not created; narrower authority falls back to report-only; expected-digest drift gets at most one semantic rebind then report-only; no scope or immutable-target invalidation occurs | TGT-PAPERCUT-SKILL, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER | T2 |
| AC-PAPER-04 | Helper `init`, `validate`, `summary`, `upsert`, and `resolve` run in temporary repositories and dotfiles | CLI/schema v1 structured outputs and stable error codes match; dry-run writes nothing; path/symlink/schema/digest/collision failures write nothing; successful changes lock, fsync, atomically replace, leave no repo temp/lock file, and require no dependency beyond Python standard library | TGT-PAPERCUT-SCHEMA, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-LEDGER | T2 |
| AC-PAPER-05 | First observation, exact duplicate, semantically matching independent recurrence, and resolution execute | First observation creates one open record; exact duplicate is unchanged; recurrence merges without count-only qualification; resolved form drops observation prose but keeps generalized data, dates, digests, and exact disposition; no candidate state, expiry, or background compaction appears | TGT-PAPERCUT-SKILL, TGT-PAPERCUT-SCHEMA, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER | T2 |
| AC-PAPER-06 | A record gains sufficient independent evidence or explicit review runs | The skill emits the existing Learning Candidate fields plus complete evaluation proposal to the current owner/final response, or names why it is evidence-only; review validates/deduplicates and proposes only; neither path dispatches, repairs, curates, writes trackers, retains memory, or ships | TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS | T2 |
| AC-PAPER-07 | Ordinary work has no candidate, or transcript/memory/background capture is proposed | No skill load, ledger read, empty output section, candidate inventory, transcript read, memory write, background job, count/calendar trigger, or automatic ledger creation occurs | TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER | T2 |
| AC-PROV-01 | A fresh maintainer uses canonical discovery | ADR-0004 D07/D23 resolves dev curation and non-memory boundaries; ADR-0006 D24 alone resolves papercut rationale; INDEX names both; executable skill/rule text contains behavior but no duplicated source history | TGT-ADR-LEARNING, TGT-ADR-PAPERCUT, TGT-ADR-INDEX | T3 |
| AC-PROV-02 | External source claims and preservation boundaries are audited | ADR evidence uses pinned Google commit/blobs and Ruiz first-party identities with corrected UTC dates/limitations; the inaccessible Google article body remains discussion-only; no claim attributes independent enforcement or local filters to those sources; global AGENTS, product workflow, bootstrap, manifest, Mnemopi, tracker, and shipping surfaces remain unchanged | TGT-ADR-LEARNING, TGT-ADR-PAPERCUT, TGT-ADR-INDEX | T3 |

## Verification / Done criteria

- [x] VR-EVAL-01. Reject stale or curator-modified tuples
  completed 2026-08-12-0949
  - Criterion: AC-EVAL-01
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: strict-parse the 130-case dev registry and exact fixture parity, then feed `B-T4-CURATION-UNBOUND-CANDIDATE` and `B-T4-CURATION-TUPLE-DRIFT` `inputs.request` values unchanged to `omp -p --no-session --no-tools --cwd /Users/kim/.dotfiles`; inspect the Task Contract/Context Pack source for reporter ownership, canonical tuple digest, readiness rejection, and no mutation
  - Evidence form: valid registry; missing reported proposal and curator-modified/stale proposal each stop before write with exact `BLOCKED`; frozen `CE-...` identity cannot be replaced; no `CURATED`
  - Target recheck: TGT-LEARNING, TGT-BACKEND, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES
  - Receiver: dev-verification
- [x] VR-EVAL-02. Prove source reuse and fresh adjacent baselines
  completed 2026-08-12-0949
  - Criterion: AC-EVAL-02
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run exact OMP traces for revised `B-T4-LEARNING-STANDARD` and new `B-T4-CURATION-DETERMINISTIC-FAILURE`; compare bound source revision/environment/proof identity, fresh adjacent pre-run, unchanged expectations, and both post-runs
  - Evidence form: one `CURATED` deterministic pass reusing exact source evidence; one safe-restoration `NO DURABLE LEARNING` stable failure; no post-only or stale baseline
  - Target recheck: TGT-LEARNING, TGT-BACKEND, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES
  - Receiver: dev-verification
- [x] VR-EVAL-03. Prove deterministic and semantic terminal mapping
  completed 2026-08-12-0949
  - Criterion: AC-EVAL-03
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run exact OMP traces for `B-T4-CURATION-SEMANTIC-VERDICT`, `B-T4-CURATION-SEMANTIC-VERDICT-MISSING`, `B-T4-CURATION-FLAKY`, and `B-T4-CURATION-INCONCLUSIVE`; statically verify mixed proof evaluates deterministic and semantic facets separately
  - Evidence form: separate non-curator PASS required for semantic `CURATED`; missing verdict, flaky proof, and inconclusive proof each yield exact `BLOCKED`; no extra deterministic evaluator
  - Target recheck: TGT-LEARNING, TGT-BACKEND, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES
  - Receiver: dev-verification
- [x] VR-EVAL-04. Preserve the curation lifecycle contract
  completed 2026-08-12-0949
  - Criterion: AC-EVAL-04
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run `python3 -m unittest discover -s .config/agents/skills/dev-implementation/scripts -p 'test_*.py'`; re-run exact OMP traces for revised `B-COMPACT-CURATION-TRIGGER`, `B-T4-CURATION-NO-DURABLE`, `B-T4-CURATION-BLOCKED`, and `B-T4-CURATION-COMPACT-NOT-TRIGGERED`; inspect `WORKFLOW.md`
  - Evidence form: all existing implementation tests pass; compact positive dispatch accepts the complete bound proposal; one curation task, three outcomes, six fields, Common Handoff, compact no-dispatch path, and terminal backend ownership remain exact
  - Target recheck: TGT-LEARNING, TGT-BACKEND, TGT-WORKFLOW, TGT-DEV-EVAL-REGISTRY, TGT-DEV-EVAL-FIXTURES
  - Receiver: dev-verification
- [x] VR-PAPER-01. Prove portable cross-workflow activation
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-01
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: verify live OMP `skill://papercut` and `.config/agents/rules/papercut.md` discovery plus Grok's shared skill/rule mapping; run `P-CROSS-WORKFLOW` through both `omp -p --no-session --no-tools` and `grok -p --no-memory --no-subagents --permission-mode plan`
  - Evidence form: dev, product, custom, and direct variants choose the same skill and no workflow stage/adapter; OMP `/skill:papercut` and Grok `/papercut` explicit invocation resolve the same body
  - Target recheck: TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS
  - Receiver: dev-verification
- [x] VR-PAPER-02. Reject noise and route owned defects
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-02
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run `P-NOISE-EXCLUSIONS` with one case each for task/plan state, tracked/blocking bug, secret, security incident, external outage, harness/tool-contract inconsistency, and operator typo, plus one positive repository-owned workaround
  - Evidence form: seven excluded cases produce zero ledger mutation and exact existing-owner routing; the positive case alone reaches capture after redaction
  - Target recheck: TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS
  - Receiver: dev-verification
- [x] VR-PAPER-03. Prove opt-in and write-boundary behavior
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-03
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: in separate temporary repositories, exercise absent ledger, explicit `init --dry-run`, explicit `init`, automatic upsert, explicit read-only/exact-target/delivery conflicts, one expected-digest drift with rebind, and repeated drift; run `P-WRITE-BOUNDARY`
  - Evidence form: only initialized automatic repository changes; absent/conflicting/repeated-drift cases are report-only; every change is disclosed; no out-of-scope target byte changes
  - Target recheck: TGT-PAPERCUT-SKILL, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER
  - Receiver: dev-verification
- [x] VR-PAPER-04. Prove helper safety and observable CLI
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-04
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run `ruff check` and `ruff format --check` on TGT-PAPERCUT-HELPER/TESTS; run `python3 -m unittest discover -s .config/agents/skills/papercut/scripts -p 'test_*.py'`; run helper `validate --repo /Users/kim/.dotfiles`; exercise all five commands and every stable error in temporary repositories
  - Evidence form: formatter/linter/tests pass; dotfiles ledger validates; structured CLI status/digests match; dry-run and every failure leave byte-identical ledgers; successful writes are atomic and leave no repository lock/temp file
  - Target recheck: TGT-PAPERCUT-SCHEMA, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-LEDGER
  - Receiver: dev-verification
- [x] VR-PAPER-05. Prove deduplication and compact resolution
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-05
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: use helper tests and `P-RESOLUTION-COMPACTION` for first create, same-day exact retry, semantically selected independent recurrence, collision rejection, fixed disposition, and rejected disposition
  - Evidence form: one stable record; duplicate unchanged; independent observation merged; candidate readiness not inferred by helper; resolved JSON retains only approved compact fields and exact reference
  - Target recheck: TGT-PAPERCUT-SKILL, TGT-PAPERCUT-SCHEMA, TGT-PAPERCUT-HELPER, TGT-PAPERCUT-TESTS, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER
  - Receiver: dev-verification
- [x] VR-PAPER-06. Prove candidate delivery and proposal-only review
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-06
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run `P-RECURRENCE-CANDIDATE` once with an active lifecycle owner and once without one, then run `P-REVIEW-PROPOSE-ONLY` over one qualified and one incomplete record
  - Evidence form: exact existing candidate fields plus complete evaluation proposal reach only the current owner/final response; incomplete record is evidence-only; review performs no dispatch, repair, curation, tracker, memory, or shipping effect
  - Target recheck: TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS
  - Receiver: dev-verification
- [x] VR-PAPER-07. Prove zero ambient capture and memory separation
  completed 2026-08-12-0949
  - Criterion: AC-PAPER-07
  - Proof class: worker smoke plus independent verification
  - Scenario / environment / fixture: run `P-NO-CANDIDATE` and `P-TRANSCRIPT-MEMORY-NEAR-MISS` in OMP and Grok plan/read-only modes against repositories with and without ledgers
  - Evidence form: no skill/ledger access or output when no candidate; transcript/memory/background proposal is rejected before reads/writes; no hidden state, empty section, file creation, count, calendar, or job
  - Target recheck: TGT-PAPERCUT-RULE, TGT-PAPERCUT-SKILL, TGT-PAPERCUT-EVALS, TGT-PAPERCUT-LEDGER
  - Receiver: dev-verification
- [x] VR-PROV-01. Verify one canonical owner per decision
  completed 2026-08-12-0949
  - Criterion: AC-PROV-01
  - Proof class: independent verification
  - Scenario / environment / fixture: fresh-read ADR-0004, ADR-0006, INDEX, current skill/rule/WORKFLOW surfaces, and decision/source links from only project guidance
  - Evidence form: D07/D23/D24 each resolve once; current behavior and rationale/source history are not duplicated; no product or memory authority is implied
  - Target recheck: TGT-ADR-LEARNING, TGT-ADR-PAPERCUT, TGT-ADR-INDEX
  - Receiver: dev-verification
- [x] VR-PROV-02. Verify source attribution and final preservation
  completed 2026-08-12-0949
  - Criterion: AC-PROV-02
  - Proof class: independent verification plus final Standards/Specification review
  - Scenario / environment / fixture: re-read the pinned Google commit/blobs, record the Google article body as inaccessible unless fresh primary evidence changes that fact, and re-read Ruiz status/media identities; strict-parse all changed JSON; compare the final exact target manifest with TGT-LEARNING through TGT-ADR-INDEX and the pre-task status snapshot; run one final `dev-code-review` after `VERIFIED`
  - Evidence form: qualified repository/source claims, explicit article limitation, and corrected dates; exact target identities; unrelated working-tree bytes preserved; no global AGENTS/product/bootstrap/manifest/memory/tracker/shipping mutation; review `APPROVED` with blockers/advisories reported
  - Target recheck: TGT-ADR-LEARNING, TGT-ADR-PAPERCUT, TGT-ADR-INDEX
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-EVAL | T1 | Exact TGT-LEARNING/BACKEND/WORKFLOW/DEV-EVAL target plus smoke identities | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | T3 | One Common Handoff mapping every AC-EVAL/VR-EVAL ID, final target digests, exact commands/results, mutations, residual risks, and route impact |
| OUTP-PAPERCUT | T2 | Exact rule/skill/schema/helper/tests/evals/initialized-ledger target plus smoke identities | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | T3 | One Common Handoff mapping every AC-PAPER/VR-PAPER ID, CLI/eval outputs, final target digests, mutations, residual risks, and route impact |
| OUTP-FINAL | T3 | One revision-bound manifest and aggregate identity for TGT-LEARNING through TGT-ADR-INDEX | completed, blocked, failed | dev-verification | One Common Handoff mapping every task, criterion, recipe, dependency, target, preserved surface, blocker, and exact smoke result; no staging or delivery authority |

`Status: DONE` is legal only after T1-T3 and every VR checkbox are complete, final independent verification returns `VERIFIED`, final Standards/Specification review returns its exact verdict, the required Standard terminal learning assessment is accounted for, the Completion Summary names all effects and remaining risks, and the plan/archive projection is current. Completion does not imply staging, commit, push, release, deployment, memory retention, or tracker mutation.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-PREFLIGHT | backend | Fresh `executor-plan-preflight/v1` eligible result at this exact revision and current local authority | all | No execution on stale, unavailable, or structurally invalid plan metadata | Approved preflight names the same plan identity and all bound inputs |
| BLK-DRIFT | backend | Fresh target/dependency hashes plus field-by-field semantic comparison | T1, T2, T3 | Unrelated bytes refresh identity; governing authority, scope, acceptance, contract, dependency, effect, capability, or verification drift requires a new revision and affected descendant invalidation | Every load-bearing binding is current or the human owner approves the revised route |
| BLK-CAPABILITY | backend | Observed required OMP/Grok/model/tool capability or an explicitly approved revised proof recipe | T1, T2, T3 | No silent substitution, reduced harness coverage, or weaker proof | Required capability is available and the original recipe reruns, or a new plan revision is approved |
| BLK-CONFLICT | implementation owner | Current exact bytes, owning authority, and a non-overwriting reconciliation | T1, T2, T3 | Concurrent user work or immutable target/authority conflict; never reset, overwrite, or hide it | Rebound target preserves unrelated work and remains semantically equivalent, otherwise return for authority |
| BLK-RESTORE | implementation owner | Byte-exact safe restoration proof and post-restoration source/adjacent results | T1 | A curation experiment changed guidance but cannot prove safe restoration | Guidance is restored and independently checked; otherwise T1 stays blocked with no further mutation |
| BLK-LEDGER | implementation owner | Valid schema/path/symlink/digest/lock state or report-only evidence | T2 | Automatic persistence is optional and never bypasses a failed boundary | Existing initialized ledger validates, or capture safely finishes report-only without claiming persistence |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-USER | authority | Current conversation plus this approved local plan revision | Owns evaluation policy, global-rule authorization, automatic opt-in, ledger schema/lifecycle, cross-workflow activation, and rejected alternatives |
| ANC-HANDOFF | evidence | `HANDOFF-SELF-IMPROVEMENT-20260811-r1` | Preserves prior research/proposals as discussion evidence only |
| ANC-LEARNING | skill | `.config/agents/skills/dev-continual-learning/SKILL.md` | Current curation qualification, outcome, and `Validation` interface |
| ANC-BACKEND | skill | `.config/agents/skills/dev-implementation/SKILL.md` | Candidate dispatch, Context Pack, readiness, attempts, and completion owner |
| ANC-WORKFLOW | reference | `.config/agents/skills/dev-ask/WORKFLOW.md` | Current route position and five-section lifecycle projection |
| ANC-ADR-LEARNING | ADR | `docs/adr/0004-canonical-discovery-and-continual-learning.md` D07/D23 | Canonical dev curation and non-memory rationale |
| ANC-ADR-PAPERCUT | ADR | `docs/adr/0006-generic-papercut-evidence.md` D24 | New canonical cross-workflow papercut rationale and rejected alternatives |
| ANC-INSTALL | mapping | `.config/scripts/bootstrap` shared rules/skills links plus `.grok/skills -> ../.config/agents/skills` | Existing OMP/Grok discovery mechanism; inspect only, do not edit |
| ANC-GLOBAL | preserved guidance | `/Users/kim/.agents/AGENTS.md` SHA-256 `562f99208b0aa862353ad3c3f151a12852623059f4a925b73b658f7c9103028b` | Human-managed global guide; capture behavior must not be added here |
| ANC-GOOGLE | external source | [status `2086874630032073142`](https://x.com/GoogleCloudTech/status/2086874630032073142) and linked article `2086871505124589568` (body inaccessible on 2026-08-12); [`google/agents-cli` commit `5a306f8956cb1eeae69f9709de0e4d61b44e11e7`](https://github.com/google/agents-cli/tree/5a306f8956cb1eeae69f9709de0e4d61b44e11e7): [evaluation guide](https://github.com/google/agents-cli/blob/5a306f8956cb1eeae69f9709de0e4d61b44e11e7/docs/src/guide/evaluation.md) blob `8314f9795ad97d275b73782d3e56f4a1566c5411`; [skill](https://github.com/google/agents-cli/blob/5a306f8956cb1eeae69f9709de0e4d61b44e11e7/skills/google-agents-cli-eval/SKILL.md) blob `47dbe0ecec12f720e5b96f5fc46472df3bdb5ebe`; [metrics](https://github.com/google/agents-cli/blob/5a306f8956cb1eeae69f9709de0e4d61b44e11e7/skills/google-agents-cli-eval/references/metrics-guide.md) blob `73c7307f88faeae7ad805bac72232ccb298bd7bc`; [optimizer](https://github.com/google/agents-cli/blob/5a306f8956cb1eeae69f9709de0e4d61b44e11e7/src/google/agents/cli/eval/cmd_optimize.py) blob `527a7b98c016a0b40d1004ad32ec0c261476ee6b` | Qualified repository evidence for pass-criteria guidance, anti-gaming, multiple metrics, flakiness, optional validation data, and delayed optimization; not local authority or an enforced independent/frozen seam; inaccessible article claims remain discussion-only |
| ANC-RUIZ | external source | X statuses [`2075303919664734295`](https://x.com/steveruizok/status/2075303919664734295), [`2075304096328798401`](https://x.com/steveruizok/status/2075304096328798401), [`2075329969169850651`](https://x.com/steveruizok/status/2075329969169850651); first-party media [`HMz1tvqWoAA6wh2`](https://pbs.twimg.com/media/HMz1tvqWoAA6wh2.png:large), [`HM0NkRFXEAAOLHv`](https://pbs.twimg.com/media/HM0NkRFXEAAOLHv.jpg:large); published 2026-07-09 UTC, accessed/rechecked 2026-08-12 UTC | Qualified evidence for concise in-the-moment capture and explicit transcript-review requests; not authority for local storage, redaction, qualification, or lifecycle |
| ANC-MEMORY | excluded/future seam | active Mnemopi is harness memory; `.agents/memory/` has no approved generic repository-memory contract in the inspected project | Papercut ledger remains explicit-read evidence; any future memory adapter requires separate authority |

- ASM-1: One generic papercut module serves dev, product, custom, and direct work. A future workflow-specific policy may narrow qualification through a separately approved adapter but must not fork the ledger or core semantics.
- ASM-2: `papercut_ledger.py` is the sole ledger mutation seam. The skill owns semantic qualification, record selection, deduplication judgment, candidate readiness, and routing; the helper owns schema/path/digest/lock/atomic-write mechanics only.
- ASM-3: The initialized dotfiles ledger is deliberate repository-local opt-in, not a default for other repositories. Other repositories remain report-only until a human explicitly runs `init`.
- ASM-4: Existing Mnemopi, global `AGENTS.md`, product-workflow, tracker, bootstrap, manifest, and shipping behavior are preservation surfaces, not hidden extension points for this change.

## Completion Summary

- Delivered the frozen curator-evaluation tuple, source/adjacent baseline rules, deterministic/semantic/mixed result mapping, one portable cross-workflow papercut rule and skill, canonical v1 ledger/schema/CLI, OMP/Grok evaluation coverage, and focused ADR ownership.
- Final repaired target: `OUTP-FINAL-REPAIRED` aggregate `d4b6365461a58fa061a26357364dca816394bea0ecaaba4264b10235ba95d556` over the ordered 27-path manifest at `local://outp-final-repaired.json`.
- Independent verification: all `AC-EVAL-01..04`, `AC-PAPER-01..07`, and `AC-PROV-01..02` are `VERIFIED`; targeted backend tests passed 50/50, papercut helper tests passed 7/7, the dev registry strict-parsed with 131 unique cases and exact fixture parity, and required OMP/Grok behavior traces passed.
- Final review: the initial pass found `REV-EVAL-001`; the sole consolidated repair `REPAIR-REV-EVAL-001-20260812-r1` mapped a bound semantic `FAIL` through byte-exact safe curator-delta restoration to `NO DURABLE LEARNING`, retained unsafe restoration as `BLOCKED`, and added `B-T4-CURATION-SEMANTIC-FAILURE`. Reverification returned `VERIFIED`; the sole review rerun returned Standards `PASS`, Specification `PASS`, Overall `APPROVED`, with no blockers or advisories.
- Attempts and gates: T1, T2, T3, and the repair each completed attempt 1/3; the run-wide repair token is consumed 1/1; the review rerun is consumed 1/1. Terminal Standard continual learning returned `NO DURABLE LEARNING` with no write and no Deep candidate.
- Preservation: `/Users/kim/.agents/AGENTS.md` remained byte-identical at SHA-256 `1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9`; the earlier `562f...` anchor was clerical, not observed content. Product workflow, bootstrap, manifest, Mnemopi, tracker, shipping, staging, and delivery surfaces were unchanged.
- Residual risk: nine unaffected papercut/provenance criteria were rebound after repair by exact per-path identity rather than broadly re-audited. No staging, commit, push, release, deployment, tracker mutation, or memory retention was authorized or performed.