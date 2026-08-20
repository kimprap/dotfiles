# Session Lifecycle Envelope

**Datetime**: 2026-08-20-2012
**Authority kind**: local-authority
**Mode**: high-consequence
**Scope**: Generic session lifecycle envelope, portable continual-learning semantics, engineering tail adaptation, papercut settlement preservation, and bounded fixtures.
**Summary**: Establish one evented session envelope and one portable continual-learning owner while preserving the engineering workflow's single assurance tail and papercut's separate capture and exact-record settlement.
**Status**: PENDING

## Objective

- Outcome: OUT-SESSION-LIFECYCLE-ENVELOPE
- Observable end state: Supported work specialties compose inside one intake-to-assessment session envelope, and the engineering standard/high-consequence tail invokes the portable continual-learning `assess` mode exactly once without making ADRs, transcripts, session titles, or papercut capture into runtime authority.
- Progress signal: A named AC-SLE-* criterion passes on an exact target revision, or a named BLK-SLE-* blocker is resolved.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820 | human-confirmed decision evidence | authority://session-lifecycle-envelope/2026-08-20 | confirmed-holding-set-2026-08-20 | Plan authoring is approved; implementation still requires native approval of this exact plan revision. |
| AUTH-SLE-ACTIVE | current focused workflow authority | `docs/adr/0001-dev-workflow-authority-and-routing.md`; `0002-executor-plans-and-orchestration.md`; `0003-bounded-assurance-and-repair.md`; `0004-canonical-discovery-and-continual-learning.md`; `0007-automated-papercut-lifecycle-and-lean-evidence.md`; `0008-repository-agent-integration-setup.md`; `docs/adr/INDEX.md` | SHA-256 respectively `79bebf143805dabd2caa80963548887d33d1081f9b44bf1969350cab81ab4307`, `74bf00ccb41c85c223388e38d88193424d051837b9cf36a39c0494ce5c181197`, `61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b`, `3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734`, `1012162a94bdfd5a9b7f27eb6868f56927352dc39a2ae805cefac6a01317d506`, `e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3`, `64526de3423fd73ef0c3cd00a4483e8f0106db06acbee4bfb9f195351a952b89` | Preserve existing decision ownership; revise only the D07/D23/D24 and discovery/tail projections named by this plan. |
| AUTH-SLE-CURRENT | current executable and current-behavior baseline | `.config/agents/skills/dev-ask/WORKFLOW.md`; `dev-continual-learning/SKILL.md`; `dev-implementation/SKILL.md`; `dev-code-review/SKILL.md`; `dev-handoff/SKILL.md`; `papercut/SKILL.md`; `papercut/WORKFLOW.md`; `.agents/AGENTS.md` | SHA-256 respectively `2fc5a46af5be75b3d200c183e79ce4a554037cde3f47f8131d07eb0e3efc4664`, `6a6ccfae27da7ac20412029757ed05d16b9ba63d43bd50e6f4331565cb54d105`, `8c6258b25645d606ebf024335b32baf27a1f019d080aa8d7be1fc56361778585`, `44274d866a92db4fe5561d464e91e76c7fc76d2abc61ddbd4ccad92c36c0c0d4`, `1e56911f5fb7ce82cc75234bad94dc60aad4c308d404493a1778e50dc04e9499`, `5a990e08d42a3a7fa83786f8c3b867db599b4b19032d08237c8d82a80341b91d`, `3cd6dc39396114cadc68c2d8c5bcf52e959a92d366f9c07aa362dc04a6d605b3`, `840c44a316e5266ab38b9fe9784f6d32bad8b904dda82f2fdbc898e72b38ebe4` | Current dirty working bytes are authoritative baseline evidence; unrelated hunks remain user-owned. |
| AUTH-SLE-PLAN-CONTRACT | current Executor Plan and OMP transport contract | `rule://plan`; `rule://plan-impl-spec`; `rule://plan-omp-transport`; `rule://plan-repo-storage` | SHA-256 respectively `053627f116078f0144119b7e9b66b44360925469f0cde921cec832dfe615c9fd`, `8f53958305b59b20cd19f5b16085afe232d8458d7f08451afc4b667ef2141be1`, `df3a4c75c548770513dd738d4bb1fd95577b30d3eaf1c6d3b37c460bce2fb925`, `cd537adc74d2908dc08e2c2e380568b9ca78cdaf292915bca28d620e0f898dbd` | Governs this local authority, structural validation, projection synchronization, and later native execution approval; grants no implementation or shipping effect by itself. |
| AUTH-SLE-BASE | repository state and preservation boundary | `/Users/kim/.dotfiles` | Git HEAD `479dce6de60cde01c8c87627241618765ef05454` plus the exact working-byte identities in the Target map | Preserve unstaged and untracked user work; no staging or shipping is authorized. |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| ADR-0001 | `sha256:79bebf143805dabd2caa80963548887d33d1081f9b44bf1969350cab81ab4307` | Apply D01/D15 source roles and D13 clean cutover across every affected skill, caller, fixture, scanner, current document, and active ADR; retain no `Standard` alias or duplicated curation body in the dev adapter. |
| ADR-0002 | `sha256:74bf00ccb41c85c223388e38d88193424d051837b9cf36a39c0494ce5c181197` | Preserve D08's stable visible profile-tail owner and equivalent optional-numbered/backend-scheduled plan shapes; no parser or plan-schema change is authorized. |
| ADR-0003 | `sha256:61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b` | Preserve D03/D04/D22: one assurance tail, one final review, existing repair/review budgets, advisory terminality, and equivalent numbered-versus-backend scheduling. |
| ADR-0004 | `sha256:3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734` | Preserve D07 qualification, compact deferral, reporter-owned frozen Evaluation tuple, one neutral curator, mutation proof, outcomes/payload, Deep boundary, and PC-ID result; apply D23 focused discovery. D07 remains ACTIVE through the portable owner plus thin adapter and is not superseded by D27. |
| ADR-0007 | `sha256:1012162a94bdfd5a9b7f27eb6868f56927352dc39a2ae805cefac6a01317d506` | Preserve D24 candidate-triggered post-Handoff capture and exact-record settlement; incomplete, blocked, deferred, broad, and unrelated records stay open. |
| ADR-0008 | `sha256:e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3` | Preserve D25's nine-row setup catalog; the portable skill creates no opt-in seam or catalog row. |
| DEC-SLE-D27 | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820@confirmed-holding-set-2026-08-20 | Materialize D27 as the generic evented session envelope, portable assess/review/deep API, evidence-pointed review boundary, ADR-free host-neutral adapter contract, and explicit transcript/JSONL/score/ledger/rethink exclusions in ADR-0009. |

## Scope, non-goals, and prohibited effects

- Read surfaces: Current generic workflow, continual-learning, assurance, Handoff, papercut, setup, discovery, and fixture authority named by the approved decision evidence.
- Change surfaces: One new envelope ADR, one generic envelope workflow reference, one portable continual-learning skill and its evals, the thin engineering adapter and exact tail callers, active projections, and only fixtures made stale by the clean cutover.
- Non-goals: Frontend workflow implementation; Flue, Cloudflare Workers, dashboard, or host migration code; transcript or JSONL mining; automatic rethink; scores or eval ledgers; count-based papercut review; ADR copies in consumer repositories; agent memory; a new init-ask seam; shipping; Wayfinder; or edits to the separate assurance-tail-efficiency plan.
- Prohibited effects: No staging, commit, push, release, deployment, credentials, external mutation, consumer-repository mutation, production papercut-ledger mutation, user-level AGENTS.md mutation, historical-plan mutation, or unrelated dirty-hunk replacement.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-SLE-AUTHORITY | repository-write | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820 | Named current-behavior and ADR targets only; preserve unrelated bytes; reversible before separately authorized delivery. |
| EFF-SLE-RUNTIME | repository-write | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820 | Portable skill, thin adapter, and exact engineering caller seams only; no host or external state. |
| EFF-SLE-EVAL | repository-write | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820 | Bounded skill/workflow fixture additions and stale-string cutover only; disposable proof output stays outside repository authority. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-SLE-ENVELOPE | Conceptual session event order | T1 | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820@confirmed-holding-set-2026-08-20 | T1, T2 |
| CONTRACT-SLE-ASSESS | Assess eligibility and skip-empty boundary | T1 | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820@confirmed-holding-set-2026-08-20 | T1, T2 |
| CONTRACT-SLE-MODES | Assess, review, and deep ownership and near misses | T1 | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820@confirmed-holding-set-2026-08-20 | T1, T2 |
| CONTRACT-SLE-MUTATION | Candidate qualification, frozen Evaluation tuple, mutation proof, and result payload | T1 | D07@sha256:3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734 | T1, T2 |
| CONTRACT-SLE-ADAPTER | One engineering tail owner invokes one portable mode in the same task | T2 | D03/D04/D07/D22 plus AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820 | T2 |
| CONTRACT-SLE-HANDOFF | One dev Common Handoff carries the portable mode/result identity | T2 | dev-handoff@sha256:1e56911f5fb7ce82cc75234bad94dc60aad4c308d404493a1778e50dc04e9499 | T2 |
| CONTRACT-SLE-PAPERCUT | Post-Handoff capture and exact originating-record settlement | T2 | D24@sha256:1012162a94bdfd5a9b7f27eb6868f56927352dc39a2ae805cefac6a01317d506 | T2 |
| CONTRACT-SLE-DISTRIBUTION | ADR-free portable executable owner and host-neutral semantics | T1 | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820@confirmed-holding-set-2026-08-20 | T1, T2 |
| CONTRACT-SLE-NOTES | Temporary non-authoritative future-intent payload | T1 | AUTH-USER-SESSION-LIFECYCLE-ENVELOPE-20260820@confirmed-holding-set-2026-08-20 | T1 |
| CONTRACT-SLE-PORTABLE-EVALS | Skill-local portable behavior cases | T1 | continual-learning-evals/v1 | T1 |
| CONTRACT-SLE-DEV-EVALS | Dev adapter/backend/discovery fixture cutover | T2 | existing dev receipt schemas plus closed case inventory below | T2 |
| CONTRACT-SLE-PRESERVE | Exact no-effect surfaces and pre-existing work | T2 | Plan-publication SHA-256 set plus PRE-SLE-WORKTREE | T1, T2 |
| CONTRACT-SLE-SHARED-SLICES | Disjoint learning-integration anchors on shared dirty targets | T2 | Exact six-path slice table below | T2 |

`CONTRACT-SLE-ENVELOPE` is conceptual, host-neutral, and non-persistent. Its only order is `intake → classify → work-specialty → Handoff → papercut look (or silent skip) → assess (or silent skip)`. A specialty's internal lifecycle stays opaque. Repair, reapproval, user promotion, explicit review, shipping, and other re-entry are events against the current envelope, never additional stages, nested orchestration, or a DAG. `dev-*` is one specialty, not the envelope owner.

`CONTRACT-SLE-ASSESS` requires a settled eligible outcome, its completed Handoff, and a nonempty affected-artifact manifest; it forwards every complete Learning Candidate and leaves incomplete candidates as named evidence-only input. An affected-artifact outcome remains eligible when it has zero complete candidates and may return `NO DURABLE LEARNING`. No affected artifact and no complete candidate is empty: the envelope does not load the skill or emit learning output. An explicitly invoked empty/ineligible `assess` reports the missing eligibility without reading unrelated evidence. A session title or name never supplies eligibility. An unnamed single-session plan run may assess when it has the required Handoff and affected plan artifact. An open-ended discussion without the required settled Handoff/artifacts does not.

`CONTRACT-SLE-MODES` assigns semantics only to the portable skill:

- `assess`: the bounded eligible-outcome mode above. If a specialty adapter already owns this outcome's tail, that adapter is the only `assess` path for that outcome; no second portable tail row, owner, Handoff, or state is valid. If no specialty adapter owns the outcome, an explicit portable `assess` invocation remains valid when CONTRACT-SLE-ASSESS eligibility holds.
- `review`: only an explicit human pointer to `this session`, one path, or one ID qualifies. It reads only pointed evidence and returns proposals/missing evidence with no mutation, dispatch, score, or state. A title/name alone is not a pointer. A transcript or JSONL path may be read only when explicitly pointed under current authority; it never becomes qualification, a primary evaluator, or a corpus. Future locator adapters may resolve a pointer but never own these semantics.
- `deep`: an explicit human request, or settled severe/recurring/cross-contract/stale-conflict evidence. It remains separately authorized unless an exact current contradiction blocks correctness. Count, time, calendar, artifact volume, title, transcript mining, unchanged Handoff, or a score never triggers it.

If no specialty adapter owns the outcome, explicit portable `review` and `deep` invocations also remain valid when their mode-specific eligibility holds. The envelope itself never auto-dispatches any mode.

`dev-code-review`, `papercut review`, and `continual-learning review` remain distinct owners. No caller may select one from the bare word `review`.

`CONTRACT-SLE-MUTATION` preserves this exact reporter-owned tuple:

```text
id; candidate_revision
source: identity, revision, expected, proof, baseline
adjacent: identity, revision, expected, proof, independence, baseline=fresh-required
proof_mode: deterministic | semantic | mixed
semantic_evaluator: none | separate
```

The lifecycle adapter validates authority, freshness, completeness, adjacent independence, and proof classification; canonicalizes sorted-key compact UTF-8 JSON; and binds one `CE-` identity to its lowercase SHA-256 digest before the portable curator can write. The portable owner cannot create, replace, weaken, or omit the binding. Matching source evidence may be reused; the adjacent baseline is always fresh; both rerun afterward. Deterministic proof uses no second evaluator. Each semantic facet uses one fresh read-only non-curator `PASS | FAIL | FLAKY | INCONCLUSIVE` result bound to the tuple. Terminal outcomes remain exactly `CURATED | NO DURABLE LEARNING | BLOCKED`, with exactly `Updated`, `Added`, `Removed`, `Skipped`, `Validation`, `Deep candidate`, and `Papercut outcome`. Stable safe deterministic or semantic failure restores only the curator delta and returns `NO DURABLE LEARNING`; missing/stale/tampered/flaky/inconclusive/unsafe proof returns `BLOCKED`.

`CONTRACT-SLE-ADAPTER` keeps the visible route/plan owner literal `dev-continual-learning`. A standard/high-consequence numbered or backend-scheduled tail dispatches that adapter once; it invokes portable `assess` once inside the same task. A separately authorized engineering Deep route invokes portable `deep` through the same adapter. The adapter contains no copied qualification, curation, result-mapping, or scheduling procedure, creates no alias mode named `Standard`, and emits no second task, owner, receiver, Handoff, curator identity, state transition, or tail row. Compact dispatches neither adapter nor portable owner. The exact parser tuple `dev-verification → dev-code-review → dev-continual-learning` remains unchanged.

`CONTRACT-SLE-HANDOFF` keeps the current Common Handoff as the sole dev task/recovery envelope. An adapter Handoff adds `Methods: none`, exact portable mode, portable result identity, reviewed target, terminal outcome, seven-field payload, and exactly one receiver `dev-implementation`. Portable session events are evidence inside that Handoff, not backend lifecycle transitions.

`CONTRACT-SLE-PAPERCUT` keeps capture before assessment: the work Handoff completes, then one soft rule look may capture one candidate, then an eligible assessment may run. The portable owner carries one unchanged originating `PC-ID` and returns candidate-specific mapping evidence but never reads or writes the ledger. The current workflow/session adapter alone maps `fixed | rejected | superseded | open` and calls `papercut resolve` at most once for one terminal exact ID. Incomplete, blocked, deferred, global, broad, unrelated, narrow-authority, or helper-failure results remain open; they are reconsidered only through later current recurrence, an authorized pointed Deep route, or explicit proposal-only papercut review. No ledger-wide count/timer review exists.

`CONTRACT-SLE-DISTRIBUTION` requires `.config/agents/skills/continual-learning/SKILL.md` to run without loading this repository's ADRs or WORKFLOW documents. Thin specialty adapters may retain their current decision IDs and name specialty-specific intake, but they delegate portable qualification, curation, and result semantics rather than forking them. OMP `/skill:continual-learning` and Grok `/continual-learning` invoke the same body; syntax changes no mode, eligibility, authority, or result semantics. Current bootstrap already links the whole executable tree. A consumer install consists of executable skills/activation rules plus only the existing opt-in `.agents/papercuts.json` seam and an optional thin repository AGENTS pointer; it does not copy this repository's `docs/adr/` corpus, add an init-ask catalog row, create a setup registry, or add a host adapter.

`CONTRACT-SLE-NOTES` writes the following exact payload only at the end of new ADR-0009, after verification expectations. It is not copied into either WORKFLOW or any SKILL body:

```markdown
## Temporary future-agent notes
These lines are not current executable authority. They exist so a later iteration can resume intent without re-deriving it from transcripts. Delete each note when that work is specified or rejected.

- Frontend specialty workflow (name not confirmed): plug in as isolated lineages plus Standards/criteria through the applicable-project-rule manifest on the existing one D04 verification and one D22 final review; never a nested review or nested orchestrator.
- Consumer-repo executable-pack distribution beyond current `init-ask` seams: ship skills/activation rules only; never clone this repo's ADR corpus.
- Host runtime (Flue, Cloudflare Workers, a dashboard, later migration): keep contracts host-neutral; do not name a host in executable skills.
```

`CONTRACT-SLE-PORTABLE-EVALS` creates exactly these skill-local IDs under top-level `skill_name: continual-learning`, each with `prompt`, `expected_output`, and behavioral `assertions`: `CL-ENVELOPE-SEQUENCE`, `CL-ASSESS-ELIGIBILITY`, `CL-ASSESS-SKIP-EMPTY`, `CL-REVIEW-POINTED-EVIDENCE`, `CL-DEEP-TRIGGERS`, `CL-FROZEN-EVALUATION`, `CL-PAPERCUT-ID-BOUNDARY`, `CL-NO-TRANSCRIPT-SCORE-LEDGER-RETHINK`, `CL-PORTABLE-ADAPTER-BOUNDARY`, and `CL-REVIEW-NAME-COLLISIONS`. `CL-PORTABLE-ADAPTER-BOUNDARY` proves both branches: adapter-owned outcome means one adapter invocation and no direct duplicate; no-adapter eligible custom/raw/direct outcome permits one explicit portable invocation; the envelope auto-dispatches neither. Do not add a dev receipt-harness layer, session fixture store, result ledger, or score.

`CONTRACT-SLE-DEV-EVALS` preserves all existing case IDs and the stable visible dev route owner. Retarget portable-only qualification/procedure claims to the portable result; retain backend cases only as adapter, binding, accounting, completion, compact exclusion, and settlement integration. Update the registry and mirrored `case.json` request together for this closed 40-case set:

- Core: `B-FULL`, `B-LEARNING`, `B-COMPLETION`.
- Portable-result integration: `B-T4-LEARNING-STANDARD`, `B-T4-LEARNING-DEEP-EXPLICIT`, `B-T4-LEARNING-DEEP-EVENT`, `B-T4-LEARNING-COUNT-NEAR-MISS`, `B-T4-LEARNING-CALENDAR-NEAR-MISS`, `B-T4-LEARNING-BACKGROUND-NEAR-MISS`, `B-T4-LEARNING-USER-LEVEL-NEAR-MISS`, `B-T4-CURATION-NO-DURABLE`, `B-T4-CURATION-UNBOUND-CANDIDATE`, `B-T4-CURATION-TUPLE-DRIFT`, `B-T4-CURATION-DETERMINISTIC-FAILURE`, `B-T4-CURATION-SEMANTIC-VERDICT`, `B-T4-CURATION-SEMANTIC-FAILURE`, `B-T4-CURATION-SEMANTIC-VERDICT-MISSING`, `B-T4-CURATION-FLAKY`, `B-T4-CURATION-INCONCLUSIVE`, `B-T4-CURATION-BLOCKED`.
- One-tail/advisory: `B-PLAN-TAIL-PROFILE`, `B-PLAN-TAIL-OMITTED`, `B-T5-COMPLETION-ASSURED`, `B-T5-COMPLETION-MISSING-ASSURANCE`, `B-REVIEW-WORDING-ADVISORY`, `B-T4-CHECKPOINT-PROOF-CLOSE`, `R-REVIEW-ADVISORY-MAINTENANCE`.
- Compact controls: `B-COMPACT`, `B-COMPACT-CURATION-TRIGGER`, `B-COMPACT-DEFERRED-LEARNING-CANDIDATE`, `B-T4-CURATION-COMPACT-NOT-TRIGGERED`, `R-COMPLETE-COMPACT-NO-LEARNING`.
- Exact-ID adapter integration: `B-T4-PAPERCUT-CANDIDATE-BINDING`, `B-T4-PAPERCUT-SETTLEMENT-FIXED`, `B-T4-PAPERCUT-SETTLEMENT-REJECTED`, `B-T4-PAPERCUT-SETTLEMENT-SUPERSEDED`, `B-T4-PAPERCUT-SETTLEMENT-OPEN`, `B-T4-PAPERCUT-SETTLEMENT-GLOBAL`, `B-T4-PAPERCUT-NARROW-AUTHORITY`.
- Discovery: `R-T5-CANONICAL-DISCOVERY`.
Each fixture path is exactly `.config/agents/skills/dev-ask/evals/fixtures/` plus the ASCII-lowercase case ID plus `/case.json`; no case has an alias or alternate fixture path.

`FIXTURE-SLE-40` binds the exact current preimage of every closed-set fixture by repository-relative path and SHA-256; no aggregate identity is authoritative:

```text
57a7a66f86d0bbba51e6cdaf2e83dc42a67385ae030b9ad30375234a8d8190dc  .config/agents/skills/dev-ask/evals/fixtures/b-compact-curation-trigger/case.json
3a4c66e320f12d645c51e385c017b6094ea767f4209c23f86301945c12ca59cd  .config/agents/skills/dev-ask/evals/fixtures/b-compact-deferred-learning-candidate/case.json
a9ea91a6775130324a4e7117ab5762893d8f4a2c2aade961c3a2fd3a12ff3a8b  .config/agents/skills/dev-ask/evals/fixtures/b-compact/case.json
911ddf35d0f2bdc7fca14424c34743417aaa889ea7d02863e6dd86458f242fb5  .config/agents/skills/dev-ask/evals/fixtures/b-completion/case.json
dca98adaef3ec3955b6e1f96ab1cce3c9cfccbf437aac5bf53a6d0ad7a0c08b7  .config/agents/skills/dev-ask/evals/fixtures/b-full/case.json
8b9fda27f5f69a6c9df355aeda898fa09981c408f4b099c6d0dc1f9656043802  .config/agents/skills/dev-ask/evals/fixtures/b-learning/case.json
b5e6efd9301039d80139caec3083a2afba83fcf8b8d8c4b56545b8e5d9efb2e3  .config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-omitted/case.json
9291e66fc9daa6aebf80645db7a0de3e34091274872da6c865aa72256249ec09  .config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-profile/case.json
e746f6fc7caab9d6f2f735e30d4570b64128d00732295f65a7769e5e0f005447  .config/agents/skills/dev-ask/evals/fixtures/b-review-wording-advisory/case.json
1fec312f1bacf2f6e83c22eacb87c741e5f11186d6397fa53665521a65653245  .config/agents/skills/dev-ask/evals/fixtures/b-t4-checkpoint-proof-close/case.json
3e173e948ea36aa76dec2ee9957f8f114f4964e5cd32fcd11d5d74f5f2bc6822  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-blocked/case.json
6269f775b4e1b289829ab550cac7a3f931caeeff8dacab0dd39f4b6eb9d255a7  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-compact-not-triggered/case.json
5c64531a7a879e84a48f6ea990b8306ea76a0901ec75cc37b4dfb81b72bb5584  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-deterministic-failure/case.json
ca29dff44ce0d272d8a7a77915f0d849ea9a486c2728b3201972778c645ffa70  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-flaky/case.json
5c6155feaea51be26eee7daf8e359364320f89a66e26d4f995f2032ddadacfef  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-inconclusive/case.json
8b8952ca854a533ce13e57223f0aa4f81b1ccfd46116282d996f605363dd51ec  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-no-durable/case.json
e22eb4fe09276fa33911d7c952107bd67b17af0c2e8320b7093c819017087a18  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-semantic-failure/case.json
590ae7ac88fd30fc1d61c0bd04d80cbec62e9b43a14fd46acd6bfea89d4d1fb5  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-semantic-verdict-missing/case.json
ddd61807c4f0b434f31581a646e8da444cfb85edc8244a5d1e378ecfaa8965a5  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-semantic-verdict/case.json
bb8344ba10d5dc9062877b69a0cbe171820c69d67832f0c5360dea7531fd7823  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-tuple-drift/case.json
49ff39f10995ab66b959b8f187c1054caf0f1491b96f4c34176e0a26467a1e2a  .config/agents/skills/dev-ask/evals/fixtures/b-t4-curation-unbound-candidate/case.json
2062d6caf4e02ffea82a9d72bee7b692bd935d66e1c0438852da90ea3746c6e7  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-background-near-miss/case.json
62e8f919db74c3008252c6a9e64f67429d4b4b981803122beae2bd62f4173008  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-calendar-near-miss/case.json
f920b65fd1c4093fae57256feda1ca8d1ab1dfbb44b30bd5682dfc2dd8c31ef2  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-count-near-miss/case.json
cc8578b6046cbebff62653835acec2601e3027331446d34917c240cdca164894  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-deep-event/case.json
9c5ed37290149724fb2adc01e0ccc4c910cda23717985ba29f9b6c0f1a566a0a  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-deep-explicit/case.json
9e87f5499fe1525d6ead1c166895e1745f98c534166fc847563b8f3520fdfa28  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-standard/case.json
7a00be5ecd84711db6f367dc0744ef163fbf5073a78d5a1e1eef1422e879be68  .config/agents/skills/dev-ask/evals/fixtures/b-t4-learning-user-level-near-miss/case.json
75a4221b45263972ff054b4920c067ce6e9a37a26493b80b68e204f173dc2bfa  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-candidate-binding/case.json
806055e2a3623f7bf3a6638bcdf7828d21995455a99a132df40d045715a31ee7  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-narrow-authority/case.json
d7dec23d073fe0f2207e81084b21539a23cd4a5e5cbf5234f685a11854a57c9d  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-settlement-fixed/case.json
d4fc5dedc410bf4028cbb9917efe21db20d954f28201497baccb07425f42569b  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-settlement-global/case.json
27e26776d6abb0fc10442e8e251478b66cbb42b75db84c4769f6f1b3ed823cb4  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-settlement-open/case.json
0ce78574753a516f6c8b9af0aedeee525ffd2c8ff72ec590898fd9906311e116  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-settlement-rejected/case.json
eb2bd95e3bc72d97a3b518913bf8c318db9a364ac714ab2277890a4a364cc643  .config/agents/skills/dev-ask/evals/fixtures/b-t4-papercut-settlement-superseded/case.json
2844c26f9f981f06b8896e8f5615b41a7d005408530fe7c603ce36fe4b09aee8  .config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-assured/case.json
79c2a3a8d71166bfe46bb813a5909dee665fe3689d835604a224b0b1783abe30  .config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-missing-assurance/case.json
6c8a0548f25810c7c2f9a1dd03d45ec7debae1b706125ccc08ad5f41c8f9afeb  .config/agents/skills/dev-ask/evals/fixtures/r-complete-compact-no-learning/case.json
7aec57052c6cfb44c91fd556881c691ae1303259b1d2561c14df0dae0f2880b3  .config/agents/skills/dev-ask/evals/fixtures/r-review-advisory-maintenance/case.json
d2e1ff1404601120aa5e080a2add94c63179b100b9c4f35af3f5ce1236aa9c57  .config/agents/skills/dev-ask/evals/fixtures/r-t5-canonical-discovery/case.json
```


In those cases, route/task/receiver/Methods/compact-forbidden literals `dev-continual-learning` stay unchanged. Tail evidence adds portable mode `assess` and forbids a second `continual-learning` owner/task/Handoff/state. Deep/near-miss cases attribute qualification to portable mode and backend snapshots only account for the result. Tuple cases keep backend binding and treat procedure output as portable. Papercut cases treat the payload as adapter-carried and leave settlement in the backend. `R-T5-CANONICAL-DISCOVERY` finds both WORKFLOW documents, ADR-0009/D27, five core generic ADRs, separate ADR-0005/0007/0008, and superseded ADR-0006.

Both `compare_trace.py` and `scan_stale_contracts.py` start with exact `REWRITE_IDS = {B-COMPACT, B-COMPACT-CURATION-TRIGGER, B-T4-REPAIR-REMAINING-BLOCKER, R-COMPLETE-COMPACT-NO-LEARNING}`. Add exactly these 34 IDs and remove none:

```text
B-COMPACT-DEFERRED-LEARNING-CANDIDATE
B-COMPLETION
B-FULL
B-LEARNING
B-REVIEW-WORDING-ADVISORY
B-T4-CURATION-BLOCKED
B-T4-CURATION-COMPACT-NOT-TRIGGERED
B-T4-CURATION-DETERMINISTIC-FAILURE
B-T4-CURATION-FLAKY
B-T4-CURATION-INCONCLUSIVE
B-T4-CURATION-NO-DURABLE
B-T4-CURATION-SEMANTIC-FAILURE
B-T4-CURATION-SEMANTIC-VERDICT
B-T4-CURATION-SEMANTIC-VERDICT-MISSING
B-T4-CURATION-TUPLE-DRIFT
B-T4-CURATION-UNBOUND-CANDIDATE
B-T4-LEARNING-BACKGROUND-NEAR-MISS
B-T4-LEARNING-CALENDAR-NEAR-MISS
B-T4-LEARNING-COUNT-NEAR-MISS
B-T4-LEARNING-DEEP-EVENT
B-T4-LEARNING-DEEP-EXPLICIT
B-T4-LEARNING-STANDARD
B-T4-LEARNING-USER-LEVEL-NEAR-MISS
B-T4-PAPERCUT-CANDIDATE-BINDING
B-T4-PAPERCUT-NARROW-AUTHORITY
B-T4-PAPERCUT-SETTLEMENT-FIXED
B-T4-PAPERCUT-SETTLEMENT-GLOBAL
B-T4-PAPERCUT-SETTLEMENT-OPEN
B-T4-PAPERCUT-SETTLEMENT-REJECTED
B-T4-PAPERCUT-SETTLEMENT-SUPERSEDED
B-T5-COMPLETION-ASSURED
B-T5-COMPLETION-MISSING-ASSURANCE
R-REVIEW-ADVISORY-MAINTENANCE
R-T5-CANONICAL-DISCOVERY
```

Both scripts retain exact `ADDED_IDS = {B-COMPACT-PLAN-NO-TAIL, B-PLAN-TAIL-OMITTED, B-PLAN-TAIL-PROFILE, B-T4-CHECKPOINT-PROOF-CLOSE, B-T4-COMPACT-WORTH-NOT-TRIGGERED, B-T4-REVISION-WORTH-OPINION, B-TASK-METHOD-TDD, R-COMPACT-PLAN-WITH-TAIL}` with `ADDED_IDS` delta `none`. Thus final `REWRITE_IDS` is the original four plus the exact 34-name block, while final `ADDED_IDS` is the unchanged eight-name set. The three closed-set cases already in `REWRITE_IDS` and three already in `ADDED_IDS`, plus the 34 additions, account for all 40; `B-T4-REPAIR-REMAINING-BLOCKER` remains a rewritten keep-check exception outside this plan's closed fixture set. Neither script gains a portable layer. Remove only the obsolete preserved hashes for the intentionally changed repo `.agents/AGENTS.md` and monolithic `dev-continual-learning/SKILL.md`; retain every other preservation entry and every compact owner prohibition.

`CONTRACT-SLE-PRESERVE` binds these no-effect bytes:

- `.config/agents/rules/plan.md` `053627f116078f0144119b7e9b66b44360925469f0cde921cec832dfe615c9fd`; `plan-impl-spec.md` `8f53958305b59b20cd19f5b16085afe232d8458d7f08451afc4b667ef2141be1`; `plan-omp-transport.md` `df3a4c75c548770513dd738d4bb1fd95577b30d3eaf1c6d3b37c460bce2fb925`; `plan-repo-storage.md` `cd537adc74d2908dc08e2c2e380568b9ca78cdaf292915bca28d620e0f898dbd`.
- `dev-implementation/scripts/executor_plan.py` `55f913edeb82bc5e48aa4264c5987e55a0bc1895c917aba60d1fbf02c213447c`; `test_executor_plan.py` `63f748714b1cfcf5abdccc7b32d36e5a6e235e15ab1e228572b07a10499013b7`; `fixtures/executor_plan/complete.md` `b6dfff99a25530c211c6eb7d9260431bab51632aba648efd0e1f2451b8883b71`; `fan_in.md` `2ff6954b2d70d3b18f9f30f6a3ccdae01a9e2d06edaa1d87f9bf273cadf7f4fc`.
- `.config/agents/rules/papercut.md` `c16c0458a0d8561905b1b70b958fac970efbdde7ce3d2bbc7872bf856f97636d`; `papercut/SKILL.md` `5a990e08d42a3a7fa83786f8c3b867db599b4b19032d08237c8d82a80341b91d`; `papercut_ledger.py` `2c1d15522362d2aebcb1de58635dc8fa61454ebe6567d61f820f2b552f97e431`; `test_papercut_ledger.py` `4f9a74671f1bf6a6e717446c2b98f7581e22d56706583bef38187a458ac359fb`; `.agents/papercuts.json` `c7a2b0741028aeb5692656b98f08908de828e9881379ecf7744bbf6879cfad44`.
- `init-ask/SKILL.md` `4d4f88dd06fa567850aefcff74c00d48007b2aabd4f2b22e7d6a001c24d93ad5`; `init-ask/evals/evals.json` `327fda86b016c1c0871e2f21e74c10dae4f7b7fac666acf191399696e5e36829`; ADR-0008 `e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3`; `.config/scripts/bootstrap` `4a7c48c5f59aa6a6195e4e3e23225cc6ddc71b3fbaab0aa74730660586525a79`.
- `dev-ask/SKILL.md` `ea9917411c115241b91edea9ce5821da3177a01390b897d79ac8ebd06062ef0c`; `dev-verification/SKILL.md` `179272eb2d73a0b3dde9cfa816307580a61a010c240498d1896ee2462d01c7bd`; `rethink/SKILL.md` `7786c31ccf399c1efa6b0a3f5d7c2d1117a965f85a9b698b32fdecc78a71a8d4`; `observe_case.py` `9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd`.
- ADR-0002 `74bf00ccb41c85c223388e38d88193424d051837b9cf36a39c0494ce5c181197`; ADR-0005 `5c4978ccb225ea04a65dde02742c1b39c2366ef27ca848d73ee1a70a1624a9ff`; `product-ask/SKILL.md` `8b29f210590abe1a91eba01c9faefedca9a6d27f4d04d75c3183865c672888c4`; `product-ask/WORKFLOW.md` `4c030c4641c50274c81a6b6bf6e5ca7c95d1fb4c3a78c054987ce9b643da6530`; `product-ask/evals/evals.json` `21017eb083db99ce988a82cfb97f9578d898b651630492bdc0dbc4909ca7d4e5`.
- `.config/agents/AGENTS.md` and `/Users/kim/.agents/AGENTS.md` both `1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9`; OMP config `0780d64b06133eb8a93f4f0421a70bfbd79f44d626d0d24adbb85cefeb51de3c`; Grok config `7e59abf2777cc4717788e9a95157e5d63f0e4d6374846a3b7b23555c5367eb19`.
- Separate pending `.agents/plans/2026-08-19-1400_assurance-tail-efficiency.md` `fd11f2594e9c71b59f4e927f6489b351466ea080fb927d8065269ed3afffff36`; do not read it as semantic input, edit it, merge it, supersede it, execute it, or use its identity for this plan.

Before any T1 write, seal disposable `PRE-SLE-WORKTREE` evidence outside repository authority. Record the canonical NUL-safe porcelain-v2 status and, for every pre-existing tracked-dirty or untracked object except this plan's transport-managed local authority/projection and declared disposable observation roots, its path, status, object kind, mode, and deletion marker, symlink-target bytes, or full-content SHA-256. Also record every changed target's approved full preimage. For each dirty or untracked changed target, map the exact plan-owned anchored slices authorized by the T1/T2 implementation contracts and hash every complementary byte slice. No edit may widen a plan-owned slice after the first write. Post-smoke proof must reconstruct each final target from its preimage by replacing only those recorded slices, require every complementary slice byte-identical, require every non-target object's status and bytes byte-identical, and keep every pre-existing deletion absent. Ambiguous, overlapping, binary, or widened regions enter BLK-SLE-OVERLAP or BLK-SLE-DRIFT before mutation; path-name inspection alone is insufficient.

`CONTRACT-SLE-SHARED-SLICES` is the complete plan-owned slice manifest for targets also dirty before this plan and named as shared with the protected pending plan:

| Shared path | Plan-owned anchored slices | Frozen complement |
|---|---|---|
| `docs/adr/0003-bounded-assurance-and-repair.md` | In D04, only the second `Decision` row's `dev-continual-learning` terminal-row explanation; in D22, only the `Consequences` clause `one already-scheduled learning assessment`; in `Affected contracts`, only the row ending with `dev-continual-learning/SKILL.md` | Every D03 byte; all D04 verification/fan-in/assurance mechanics; all D22 review eligibility, finding, budget, and one-pass mechanics; every other row and verification expectation |
| `.config/agents/skills/dev-ask/WORKFLOW.md` | Human-overview parent-envelope sentence; Generic-decision `Discovery, noncompact continual learning...` row and active-generic count sentence; Stage/surface `dev-continual-learning` row; complete-implementation route row's terminal-learning phrase; procedure-owner learning clause; the two profile-tail paragraphs; the Learning Candidate and terminal-assessment paragraphs; the `dev-continual-learning` catalog row plus adjacent new portable row; maintenance-role learning clause | Every D03 checkpoint/worth/repair clause, every D04 verification/fan-in clause, every D22 review/finding clause, route approval, plan schema, method, shipping, and all unrelated catalog/maintenance text |
| `.config/agents/skills/dev-implementation/SKILL.md` | Task Contract paragraphs beginning `For a standard/high-consequence Learning Candidate` and `A complete papercut-originated candidate`; Assurance-list terminal-assessment and one-tail sentences; state-machine sentences beginning `After every work task`, `Curation CURATED`, `For a complete papercut-originated candidate`, `Read-only dev-implementation lifecycle eval observations`, `Only the backend records transitions`, and `When an observation explicitly requests a full task-shape projection`; execute-frontier tail-source paragraph, step 9, and its papercut-origin paragraph | All D03/D04 labels; semantic-attempt, repair, worth, verification, integration, review-slot, D22 finding, and state-transition mechanics; every sentence not explicitly anchored |
| `.config/agents/skills/dev-handoff/SKILL.md` | In `Common Handoff`, only the sentence beginning `Curator Handoffs add` | Every D03 label and same-outcome recovery/worth/Close field; reviewer/verifier/worker payloads; Methods and receiver mechanics |
| `.config/agents/skills/dev-code-review/SKILL.md` | Append one sentence to Procedure step 7 stating that portable `continual-learning review` is distinct, is never invoked by code review, and cannot add a pass or tail | All existing bytes, including every D03 label, D22 Standards/finding policy, review eligibility/slot/budget, verdict, Handoff, and stop mechanic |
| `.config/agents/skills/dev-ask/evals/evals.json` | Within the 40 exact case objects only: `inputs.request` and mirrored fixture request; plus only learning/curation/portable-assessment string or list elements under `criterion`, `expected.artifacts`, `expected.gates`, `expected.outcome`, `expected.owners`, `forbidden_events`, `proof`, `required_events`, and `rubric`. Core and portable-result groups may retarget generic procedure/result ownership; one-tail/advisory cases may change only assessment-row/result/duplicate-assessment phrases; compact cases only assessment/curation exclusion phrases; exact-ID cases only assessor/adapter result-origin phrases; discovery only workflow/ADR/count/owner answers. | Case IDs, fixture paths, schema fields, route/task/receiver/Methods literals, non-learning event order, parser/transport/method/verification/review/repair semantics, settlement mappings, and every case outside the closed 40 |

Before editing any shared path, PRE-SLE-WORKTREE records these anchored slices and their complements. Any required edit outside this table, any overlap with D03/D04/D22 mechanics, or any shared-target change that prevents byte-preserving composition enters BLK-SLE-OVERLAP before mutation.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-SLE-NEW-AUTHORITY | New `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md` at D27 and its exact temporary-note tail | T1 | absent on 2026-08-20; `docs/adr/INDEX.md` confirms ADR-0009/D27 unallocated | T2 INDEX/D23/discovery projections | AC-SLE-ENVELOPE, AC-SLE-MODES, AC-SLE-NOTES |
| TGT-SLE-PORTABLE | New `.config/agents/skills/continual-learning/SKILL.md`, `WORKFLOW.md`, and `evals/evals.json` | T1 | all three paths absent on 2026-08-20 | thin dev adapter; direct eligible envelope invocation; CL-* cases | AC-SLE-ENVELOPE, AC-SLE-ELIGIBILITY, AC-SLE-MODES, AC-SLE-MUTATION, AC-SLE-PORTABILITY |
| TGT-SLE-ACTIVE-AUTHORITY | `docs/adr/0001-dev-workflow-authority-and-routing.md`; `0003-bounded-assurance-and-repair.md`; `0004-canonical-discovery-and-continual-learning.md`; `0007-automated-papercut-lifecycle-and-lean-evidence.md`; `docs/adr/INDEX.md` | T2 | SHA-256 respectively `79bebf143805dabd2caa80963548887d33d1081f9b44bf1969350cab81ab4307`, `61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b`, `3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734`, `1012162a94bdfd5a9b7f27eb6868f56927352dc39a2ae805cefac6a01317d506`, `64526de3423fd73ef0c3cd00a4483e8f0106db06acbee4bfb9f195351a952b89` | D01/D13/D15, D03/D04/D22, D07/D23, D24, D27 discovery | AC-SLE-TAIL, AC-SLE-PAPERCUT, AC-SLE-CUTOVER |
| TGT-SLE-DISCOVERY | `.agents/AGENTS.md`; `.config/agents/skills/dev-ask/WORKFLOW.md`; `.config/agents/skills/papercut/WORKFLOW.md` | T2 | SHA-256 respectively `840c44a316e5266ab38b9fe9784f6d32bad8b904dda82f2fdbc898e72b38ebe4`, `2fc5a46af5be75b3d200c183e79ce4a554037cde3f47f8131d07eb0e3efc4664`, `3cd6dc39396114cadc68c2d8c5bcf52e959a92d366f9c07aa362dc04a6d605b3` | `R-T5-CANONICAL-DISCOVERY`; papercut `P-DOCUMENTATION-DISCOVERY`; ordinary no-eager-loading control | AC-SLE-PAPERCUT, AC-SLE-CUTOVER |
| TGT-SLE-ADAPTERS | `.config/agents/skills/dev-continual-learning/SKILL.md`; `dev-implementation/SKILL.md`; `dev-handoff/SKILL.md`; `dev-code-review/SKILL.md` | T2 | SHA-256 respectively `6a6ccfae27da7ac20412029757ed05d16b9ba63d43bd50e6f4331565cb54d105`, `8c6258b25645d606ebf024335b32baf27a1f019d080aa8d7be1fc56361778585`, `1e56911f5fb7ce82cc75234bad94dc60aad4c308d404493a1778e50dc04e9499`, `44274d866a92db4fe5561d464e91e76c7fc76d2abc61ddbd4ccad92c36c0c0d4` | stable plan-tail owner/parser; backend candidate binding/accounting; one Common Handoff; one final code review | AC-SLE-TAIL, AC-SLE-HANDOFF, AC-SLE-PAPERCUT, AC-SLE-CUTOVER |
| TGT-SLE-EVAL-CUTOVER | `dev-ask/evals/evals.json`; `scan_stale_contracts.py`; `compare_trace.py`; the closed 40 mirrored fixture files in CONTRACT-SLE-DEV-EVALS; `papercut/evals/evals.json` | T2 | SHA-256 `6f34a1a793807fb3950c1f4e2d34de00bfefb847ec915f09346da86572f73c76`, `84c6fdcb202c1fea5a296589ec6ab7719d2ba61c70b94783c0d4ded7721dcf87`, `1f11e6a2ed7c0a0240d1e333be9c3d30528d229927aab2ac6f5dc984224337d6`, exact 40 per-file identities in FIXTURE-SLE-40, and papercut evals `d6aebb35940c08cb64e5f8f918c999fb1c6e8e399857a4dba92ab507138dc11f` | dev receipt observations; portable skill evals remain separate; stale scan and trace comparison | AC-SLE-TAIL, AC-SLE-HANDOFF, AC-SLE-PAPERCUT, AC-SLE-CUTOVER |
| TGT-SLE-PRESERVE | Exact files and production/config state enumerated by CONTRACT-SLE-PRESERVE plus every object sealed by PRE-SLE-WORKTREE | T2 | Exact per-path SHA-256 set in CONTRACT-SLE-PRESERVE and runtime pre-T1 object/region manifest | plan/tail parser, papercut mechanics/ledger, setup, product, user guidance, hosts, unrelated dirty/untracked work, separate plan | AC-SLE-PRESERVE |

Immediately before T2, recompute every FIXTURE-SLE-40 file's SHA-256 and compare each path/hash pair exactly; any missing, extra, or mismatched entry enters BLK-SLE-DRIFT rather than silently changing the closed inventory. No aggregate digest or alternate path normalization may substitute for the per-file identities.

## Execution policy

- Assurance: high-consequence
- Topology: one-owner sequential
- Max concurrency: 1
- Isolation: shared lineage
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: Before each edit, reread the exact target and compare its approved base identity; preserve unrelated dirty hunks and stop on a load-bearing semantic conflict rather than resetting, overwriting, or choosing a winner.
- Decomposition: One qualified implementation owner executes the ordered work tasks; no child delegation, isolated lineage, neutral fan-in, or nested orchestrator.
- Effect limit: EFF-SLE-AUTHORITY, EFF-SLE-RUNTIME, and EFF-SLE-EVAL only
- Orchestrator profile: One-owner contract-preserving sequential projection; omit a numbered profile tail so the backend schedules the existing high-consequence `dev-verification`, `dev-code-review`, and thin `dev-continual-learning` adapter once.

## Tasks

- [ ] T1. Define the portable session envelope and learning owner
  - Owner: dev-implementation worker
  - Intent: Make session learning portable and evidence-bound.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-SLE-NEW-AUTHORITY, TGT-SLE-PORTABLE
  - Contracts: CONTRACT-SLE-ENVELOPE, CONTRACT-SLE-ASSESS, CONTRACT-SLE-MODES, CONTRACT-SLE-MUTATION, CONTRACT-SLE-DISTRIBUTION, CONTRACT-SLE-NOTES, CONTRACT-SLE-PORTABLE-EVALS, CONTRACT-SLE-PRESERVE
  - Criteria: AC-SLE-ENVELOPE, AC-SLE-ELIGIBILITY, AC-SLE-MODES, AC-SLE-MUTATION, AC-SLE-PORTABILITY, AC-SLE-NOTES
  - Effects: EFF-SLE-AUTHORITY, EFF-SLE-RUNTIME, EFF-SLE-EVAL
  - Output: OUTP-SLE-T1
  - Receiver: T2
  - Verification: VR-SLE-ENVELOPE, VR-SLE-ELIGIBILITY, VR-SLE-MODES, VR-SLE-MUTATION, VR-SLE-PORTABILITY, VR-SLE-NOTES
  - Lineage: shared
- [ ] T2. Cut over engineering adapters and active projections
  - Owner: dev-implementation worker
  - Intent: Use the portable owner without duplicating lifecycle work.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-DISCOVERY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER, TGT-SLE-PRESERVE
  - Contracts: CONTRACT-SLE-ENVELOPE, CONTRACT-SLE-ASSESS, CONTRACT-SLE-MODES, CONTRACT-SLE-MUTATION, CONTRACT-SLE-ADAPTER, CONTRACT-SLE-HANDOFF, CONTRACT-SLE-PAPERCUT, CONTRACT-SLE-DISTRIBUTION, CONTRACT-SLE-DEV-EVALS, CONTRACT-SLE-PRESERVE, CONTRACT-SLE-SHARED-SLICES
  - Criteria: AC-SLE-TAIL, AC-SLE-HANDOFF, AC-SLE-PAPERCUT, AC-SLE-CUTOVER, AC-SLE-PRESERVE
  - Effects: EFF-SLE-AUTHORITY, EFF-SLE-RUNTIME, EFF-SLE-EVAL
  - Output: OUTP-SLE-T2
  - Receiver: dev-verification
  - Verification: VR-SLE-TAIL, VR-SLE-HANDOFF, VR-SLE-PAPERCUT, VR-SLE-CUTOVER, VR-SLE-PRESERVE
  - Lineage: shared

### T1 implementation contract

1. Before any repository write, create PRE-SLE-WORKTREE exactly as CONTRACT-SLE-PRESERVE specifies. Then recheck that all three TGT-SLE-PORTABLE paths and ADR-0009 remain absent. Any existing object or D27 allocation enters BLK-SLE-IDENTITY; do not adopt or overwrite it.
2. Create `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md` with H1 `Session lifecycle envelope and portable continual learning`; metadata `Status: ACTIVE`, `Date: 2026-08-20`, `Updated: 2026-08-20`, `Decision IDs: D27`, and related authority ADR-0001 D01/D13/D15, ADR-0003 D03/D04/D22, ADR-0004 D07/D23, and ADR-0007 D24. Follow the current focused-ADR order: Scope; Context / problem; Decisions; `D27 — Session lifecycle envelope and portable learning` with Scope, Decision, Why, Rejected alternatives / why not, Consequences, Reopen when; Affected contracts; Evidence / source revisions; Human authority; Supersession; Verification expectations; then the exact CONTRACT-SLE-NOTES payload. State that D27 is additive and does not supersede D07 or D24. Do not copy D07's tuple/proof procedure or D24's ledger mechanics into D27; reference those owners.
3. In D27, project every CONTRACT-SLE-ENVELOPE/ASSESS/MODES/ADAPTER/DISTRIBUTION boundary and these rejected paths: a dev-* clone, persisted DAG/state machine, title/name qualification, transcript or JSONL primary evaluation, background mining, automatic `rethink`, scores/weakness metrics, a session/eval/learning ledger, per-task learning, count/timer papercut review, ADR copies in consumers, a new init-ask row, nested frontend review/orchestration, and host-specific runtime work. Record only the supplied temporary notes; implement none of them.
4. Create `.config/agents/skills/continual-learning/SKILL.md` as the sole portable semantic owner. Use exact frontmatter `name: continual-learning` and description: `Assess settled affected-artifact outcomes, review only explicitly pointed-at evidence, or run separately authorized Deep maintenance after an explicit, severe, or recurring trigger. Skip empty or ineligible intake; never mine transcripts, score sessions, keep a learning ledger, or run beside a specialty adapter.` Use H1 `Continual Learning` and the ordered H2s `Activation and modes`, `Session envelope intake`, `Qualification and authority`, `Bound evaluation for guidance mutation`, `Procedure`, `Terminal result`, and `Portability and stops`.
5. In that SKILL, implement CONTRACT-SLE-ASSESS/MODES/MUTATION/PAPERCUT/DISTRIBUTION directly. Reuse the current `dev-continual-learning` qualification, tuple, source-reuse/fresh-adjacent proof, least-specific sufficient guidance, safe-restoration, three outcomes, and seven-field payload; replace backend/Task Contract/Context Pack/Common Handoff details with host-neutral semantic inputs supplied by the caller. Route adapter-owned outcomes only through their adapter and reject a second direct invocation; permit one explicit portable `assess`, `review`, or `deep` call when no adapter owns the outcome and that mode's eligibility holds; never auto-dispatch from the envelope. Never reference an ADR ID/path, WORKFLOW document, dev route/state, user-specific absolute path, provider, host, session title, transcript corpus, JSONL engine, score, ledger, or setup seam. Without a mode, return only the three modes without reading evidence.
6. Create `.config/agents/skills/continual-learning/WORKFLOW.md` as maintenance-only current behavior, not executable authority. Use H1 `Session Lifecycle Envelope` and exactly five H2s in order: `Human overview`, `Event envelope`, `Continual-learning modes`, `Adapters and settlement`, `Authority and maintenance`. Describe the conceptual sequence and source roles from the fixed contracts, link current rationale to `docs/adr/INDEX.md`, state that ordinary mode execution reads only SKILL.md, and omit the temporary-note payload and implementation history.
7. Create `.config/agents/skills/continual-learning/evals/evals.json` using the existing portable schema and exactly the ten CONTRACT-SLE-PORTABLE-EVALS IDs. Each case proves observable behavior, including the unnamed-plan/title/open-discussion boundary, explicit review pointers, mode-name collisions, no candidate versus empty intake, frozen mutation proof, exact PC-ID return without ledger access, OMP/Grok same-body behavior, adapter-owned no-duplicate behavior, no-adapter explicit custom/raw/direct invocation, envelope no-auto-dispatch, and all locked exclusions. Do not add per-case files or modify the dev receipt harness.
8. Run VR-SLE-ENVELOPE through VR-SLE-NOTES on the exact T1 bytes. Emit one Common Handoff with the changed-path/SHA-256 manifest, every observed result, no method skill, and receiver T2. Do not register D27 or alter existing callers in T1; T2 owns the atomic existing-surface cutover.

No equivalent portable owner or generic envelope file exists at the approved base. Reuse `papercut/SKILL.md` plus its skill-local eval shape for a portable deep module, and `grill-me/SKILL.md` only for the thin-adapter principle. Avoid dev-ask's receipt schema in the new portable eval directory.

### T2 implementation contract

1. Recheck every T2 target identity, every FIXTURE-SLE-40 path/hash pair, every CONTRACT-SLE-PRESERVE identity, PRE-SLE-WORKTREE, and CONTRACT-SLE-SHARED-SLICES before the first T2 edit. Preserve every complementary slice and unrelated current object. If the separate assurance-tail plan or another actor changed a shared target, apply BLK-SLE-OVERLAP; never copy from, edit, or supersede that plan.
2. Replace the monolithic `.config/agents/skills/dev-continual-learning/SKILL.md` body with a genuine adapter. Keep exact `name: dev-continual-learning`; use description `Adapt one eligible engineering terminal assessment or separately authorized Deep route to the portable continual-learning skill. Skip compact, keep one Common Handoff, and never fork qualification, curation, settlement, or scheduling semantics.` The adapter may retain current decision IDs and name engineering Task Contract, Context Pack, and Common Handoff intake. Map one settled standard/high-consequence tail to portable `assess`, and a separately authorized engineering Deep route to portable `deep`. Bind the exact reviewed target, affected-artifact and applicable-rule manifests, advisories, complete candidates, frozen tuple/PC-ID, Methods `none`, and receiver; invoke the portable body once; return its identity/outcome/seven fields in one Common Handoff to `dev-implementation`. Remove every copied qualification/procedure/result rule and the obsolete `Standard` alias. Direct evidence-pointed `continual-learning review` does not route through this adapter.
3. In `dev-implementation/SKILL.md`, edit only its CONTRACT-SLE-SHARED-SLICES anchors: keep `dev-continual-learning` as the sole tail row/evidence source; bind the portable mode and input at the existing candidate/tail step; state that generic session events are evidence rather than backend transitions; accept the same three outcomes/seven fields; preserve backend-only exact-ID settlement and every numbered/backend-scheduled/compact rule. Add direct portable invocation to the engineering compact forbidden controls so compact cannot bypass its no-learning boundary. Retain every existing `D03`/`D04` decision ID and every repair, verification, review, budget, order, and state mechanic byte outside the named slices.
4. In `dev-handoff/SKILL.md`, edit only the sentence beginning `Curator Handoffs add` to require the portable mode/result identity before the existing target/outcome/payload; retain one Common Handoff and one receiver. In `dev-code-review/SKILL.md`, append only the CONTRACT-SLE-SHARED-SLICES sentence to Procedure step 7 stating that portable continual-learning `review` is distinct, is never invoked by code review, and cannot add a pass or tail. Retain every `D03` decision ID and all review eligibility, slots, verdicts, tags, repair relevance, advisory handling, and other bytes.
5. Synchronize current authority without moving ownership: register ACTIVE ADR-0009 and D27 in `docs/adr/INDEX.md` with no supersession; keep D07/D23 in ACTIVE ADR-0004 and D24 in ACTIVE ADR-0007. Update ADR-0001 only at the current-reference affected-contract and AC01/AC02 discovery counts/ranges. In ADR-0003, edit only the three CONTRACT-SLE-SHARED-SLICES learning-owner anchors to project portable semantics through the stable dev adapter; retain every D03 byte and every D04/D22 verification, fan-in, review, repair, budget, ordering, and verification-expectation mechanic. Update ADR-0004 D07 scope/decisions/affected contracts/AC12 to `assess`/`deep`, the thin adapter, and skill-local eval ownership while preserving its complete tuple/proof/outcome/PC-ID content, and update D23/AC01/AC02/AC13 for both WORKFLOW documents and D01-D27; update ADR-0007 only at the generic assessment-owner projection. Use this approved plan revision as D27's human decision evidence and preserve every existing rationale/supersession citation.
6. Update `.agents/AGENTS.md` as one conditional discovery bullet: generic session-lifecycle or engineering-workflow maintenance reads `continual-learning/WORKFLOW.md`, `dev-ask/WORKFLOW.md`, and `docs/adr/INDEX.md`; ordinary work still loads only its applicable executable contract. Keep papercut maintenance separate, adding ADR-0009 only as an applicable owner. In `dev-ask/WORKFLOW.md`, edit only its CONTRACT-SLE-SHARED-SLICES anchors to add the parent-envelope link, D27 maps/count, portable `continual-learning` catalog row, thin `dev-continual-learning` row, and one-assess-tail projection; do not alter any D03/D04/D22 repair, verification, or review mechanic, copy the envelope, or add a route stage. In `papercut/WORKFLOW.md`, change only the generic assessment/settlement ownership projection and stranded-open explanation. Keep papercut capture flow/mechanics unchanged and add no executable or future-note wording.
7. Apply CONTRACT-SLE-DEV-EVALS and CONTRACT-SLE-SHARED-SLICES exactly. Keep every existing case ID and route-owner literal; move portable semantic ownership into the new skill-local cases while the 40 dev cases assert adapter/binding/accounting behavior. Within shared `evals.json`, change only the named per-field learning strings, and update each changed registry `inputs.request` with its mirrored fixture request identically. Update papercut `P-DOCUMENTATION-DISCOVERY` for the new WORKFLOW/D27 and leave the other portable papercut cases unchanged. In both `compare_trace.py` and `scan_stale_contracts.py`, add exactly the named 34-ID `REWRITE_IDS` delta, keep the four existing rewrite IDs, keep the exact eight `ADDED_IDS` with no additions/removals, add the new active paths and exact required/stale ownership needles, preserve the compact `dev-continual-learning` prohibition and add direct portable-dispatch prohibition, remove only the two obsolete preservation entries named by CONTRACT-SLE-DEV-EVALS, and retain every other check.
8. Run VR-SLE-TAIL through VR-SLE-PRESERVE. Seal a changed-path/SHA-256 manifest excluding this plan authority/projection and disposable observation roots; include exact expected/observed smoke for every T2 criterion and the unchanged preservation set. Emit one Common Handoff to `dev-verification`. Do not stage, ship, run host/frontend work, mutate the production papercut ledger, or mark this plan complete; the backend owns the subsequent high-consequence tail and lifecycle status.

Every exported/visible owner remains `dev-continual-learning`; the new `continual-learning` name is an internal/direct portable semantic owner, never a compatibility alias or fourth profile-tail owner. The clean cutover deletes the old adapter body rather than keeping both implementations.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-SLE-ENVELOPE | A session enters one work specialty and reaches its Handoff | Current guidance exposes exactly `intake → classify → work-specialty → Handoff → papercut look/skip → assess/skip`; specialty internals stay opaque and every re-entry is an event, not a new stage, DAG, or nested orchestrator. | TGT-SLE-NEW-AUTHORITY, TGT-SLE-PORTABLE | T1 |
| AC-SLE-ELIGIBILITY | Compare a settled unnamed plan run with affected plan artifact, a titled session without evidence, an empty outcome, and an open-ended discussion | The first assesses once; a nonempty affected-artifact outcome with no complete candidate may return `NO DURABLE LEARNING`; the other three cause no automatic skill load/output. Titles never qualify, and complete candidates are forwarded without making incomplete evidence ready. | TGT-SLE-PORTABLE | T1 |
| AC-SLE-MODES | Invoke `review` with `this session`, a path, and an ID; invoke Deep explicitly and from settled severe/recurring evidence; present code-review/papercut-review near misses | Review inspects only the pointed evidence and is proposal-only; Deep remains separately authorized by the exact triggers; names/count/time/transcript mining do not qualify; all three review owners remain distinct. | TGT-SLE-NEW-AUTHORITY, TGT-SLE-PORTABLE | T1 |
| AC-SLE-MUTATION | Supply valid deterministic/semantic/mixed tuples and missing, stale, tampered, failed, flaky, inconclusive, and unsafe-restoration variants | No guidance write occurs before the frozen reporter tuple; source/adjacent proof and evaluator ownership match CONTRACT-SLE-MUTATION; only complete proof yields `CURATED`, safe stable failure yields `NO DURABLE LEARNING`, and invalid proof yields `BLOCKED` with the unchanged seven-field result contract. | TGT-SLE-PORTABLE | T1 |
| AC-SLE-PORTABILITY | Run the portable executable skill body without this repository's ADR/WORKFLOW corpus in OMP and Grok for an adapter-owned eligible outcome, a no-adapter eligible custom/raw/direct outcome, and envelope-only intake | Both hosts select the same semantics; the portable skill requires no framework ADR label/path; the adapter-owned outcome invokes only through its adapter and rejects a direct duplicate; the no-adapter outcome permits one explicit portable mode invocation; envelope-only intake auto-dispatches none; no host file, init row, consumer ADR copy, state service, score, transcript/JSONL primary evaluator, or automatic rethink is created. | TGT-SLE-PORTABLE | T1 |
| AC-SLE-NOTES | Inspect the implemented deferred-intent payload | The exact three-note payload appears once at the end of ADR-0009 and nowhere in SKILL/WORKFLOW bodies; no deferred frontend, consumer distribution, or host runtime is implemented. | TGT-SLE-NEW-AUTHORITY | T1 |
| AC-SLE-TAIL | Exercise numbered and omitted standard/high-consequence plan tails plus compact | Each noncompact source schedules exactly one `dev-continual-learning` task, which invokes portable mode `assess` once in-task; compact schedules neither; parser owner/order/Methods/receiver contracts remain byte-identical and no portable owner appears as a route task or backend transition. | TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER | T2 |
| AC-SLE-HANDOFF | Complete an eligible assess adapter result and an advisory-only reviewed result | Exactly one Methods-none Common Handoff carries the portable mode/result identity, reviewed target, terminal outcome, seven fields, and receiver `dev-implementation`; backend alone records state/completion, and code review never invokes continual-learning `review` or adds another pass. | TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER | T2 |
| AC-SLE-PAPERCUT | Exercise no-candidate capture, complete/incomplete PC candidates, every terminal mapping, helper failure, recurrence, Deep, and explicit papercut review | Handoff precedes one soft look; assessment is separate; the assessor never accesses the ledger; only one exact terminal PC-ID may settle; all nonterminal/narrow/global cases remain open; no count/timer/ledger-wide review or second curation state appears. | TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-DISCOVERY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER | T2 |
| AC-SLE-CUTOVER | Inspect active contracts, the registry/scanners, both discovery cases, and the closed 40-case dev fixture set after T2 | ADR-0009/D27 is ACTIVE with no supersession; D07/D23/D24 remain active owners; both WORKFLOW documents are conditionally discoverable; the dev adapter contains no generic procedure/Standard alias; the portable SKILL alone has no framework ADR/WORKFLOW dependency; engineering decision IDs remain intact; every fixture pair agrees; exact rewrite/add sets pass keep-check; no stale generic-ownership claim or duplicate evaluator remains. | TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-DISCOVERY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER | T2 |
| AC-SLE-PRESERVE | Compare CONTRACT-SLE-PRESERVE and PRE-SLE-WORKTREE before T1 and after all smoke | Every exact no-effect byte remains identical; every non-target dirty/untracked status and object remains byte-identical; only predeclared plan-owned target slices differ and every complementary slice reconstructs byte-identically; production papercut evidence, user-level guidance, product/setup/host behavior, plan-tail parser, separate assurance-tail plan, and shipping state are untouched. | TGT-SLE-PRESERVE | T2 |

## Verification / Done criteria

- [ ] VR-SLE-ENVELOPE. Exercise the conceptual event sequence and re-entry boundary
  - Criterion: AC-SLE-ENVELOPE
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, give one fresh read-only evaluator only the implemented portable SKILL and WORKFLOW plus `CL-ENVELOPE-SEQUENCE`; use one dev specialty and one non-dev specialty, then present repair, reapproval, user promotion, explicit review, and shipping re-entry.
  - Evidence form: One result with the exact six ordered envelope events, silent optional skips, opaque specialty internals, and every re-entry rejected as a stage/DAG edge.
  - Target recheck: TGT-SLE-NEW-AUTHORITY, TGT-SLE-PORTABLE
  - Receiver: T2
- [ ] VR-SLE-ELIGIBILITY. Distinguish eligible affected work from names and empty discussion
  - Criterion: AC-SLE-ELIGIBILITY
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `CL-ASSESS-ELIGIBILITY` and `CL-ASSESS-SKIP-EMPTY` against exact T1 bytes with the four AC-SLE-ELIGIBILITY inputs and both zero-candidate/nonempty-artifact and complete-candidate variants.
  - Evidence form: Expected/observed table showing one eligible unnamed-plan assessment, valid `NO DURABLE LEARNING` with no candidate, and no automatic load/output for title-only, empty, or open discussion.
  - Target recheck: TGT-SLE-PORTABLE
  - Receiver: T2
- [ ] VR-SLE-MODES. Prove pointed review, Deep triggers, and name collisions
  - Criterion: AC-SLE-MODES
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `CL-REVIEW-POINTED-EVIDENCE`, `CL-DEEP-TRIGGERS`, and `CL-REVIEW-NAME-COLLISIONS` with an explicit current-session pointer, explicit path, explicit ID, title-only near miss, recurring/severe evidence, count/calendar near misses, `dev-code-review`, and `papercut review`.
  - Evidence form: Proposal-only review results, separately authorized Deep candidates, zero mutation/dispatch for review, and distinct owner/mode classifications.
  - Target recheck: TGT-SLE-NEW-AUTHORITY, TGT-SLE-PORTABLE
  - Receiver: T2
- [ ] VR-SLE-MUTATION. Prove frozen evaluation and terminal outcomes
  - Criterion: AC-SLE-MUTATION
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `CL-FROZEN-EVALUATION` over valid deterministic, semantic, and mixed pass/failure facets; stale source evidence; stale adjacent evidence; semantic missing verdict; tuple drift as the tampered variant; flaky and inconclusive proof; and unsafe restoration, using the exact CONTRACT-SLE-MUTATION tuple.
  - Evidence form: One matrix mapping every input to no-write-before-binding, correct source reuse/fresh-adjacent behavior, mixed-facet aggregation, stale/tampered rejection, evaluator ownership, restoration, exact outcome, seven fields, and blocker resume condition.
  - Target recheck: TGT-SLE-PORTABLE
  - Receiver: T2
- [ ] VR-SLE-PORTABILITY. Run the same executable pack without framework documents
  - Criterion: AC-SLE-PORTABILITY
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `CL-PORTABLE-ADAPTER-BOUNDARY` and `CL-NO-TRANSCRIPT-SCORE-LEDGER-RETHINK` in fresh OMP and Grok read-only contexts that receive the exact portable SKILL bytes but no repository ADR or WORKFLOW bytes. Exercise three branches: an eligible outcome whose existing specialty adapter invokes portable `assess` once while a direct duplicate is attempted; an eligible custom/raw/direct outcome with no adapter and one explicit portable `assess`, `review`, or `deep` invocation under that mode's eligibility; and envelope-only intake with no explicit invocation. Parse the new eval registry with `python3 -m json.tool .config/agents/skills/continual-learning/evals/evals.json`.
  - Evidence form: Semantically equivalent host results; one adapter-owned invocation and rejected duplicate; one successful no-adapter explicit invocation; zero envelope auto-dispatch; valid JSON; and explicit absence of framework lookup, second task/Handoff/state/tail, transcript/JSONL qualification, score, ledger, rethink, setup, or host effects.
  - Target recheck: TGT-SLE-PORTABLE
  - Receiver: T2
- [ ] VR-SLE-NOTES. Check the exact temporary-note placement
  - Criterion: AC-SLE-NOTES
  - Proof class: worker smoke
  - Scenario / environment / fixture: Compare ADR-0009's final H2 and bytes with CONTRACT-SLE-NOTES; inspect the two new WORKFLOW/SKILL bodies and all changed always-loaded executable bodies.
  - Evidence form: Exact payload match at one path, zero duplicate payloads, and zero implemented deferred host/frontend/distribution artifacts.
  - Target recheck: TGT-SLE-NEW-AUTHORITY
  - Receiver: T2
- [ ] VR-SLE-TAIL. Prove one stable dev tail invokes one assess
  - Criterion: AC-SLE-TAIL
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`, then receipt-bound observations for `B-PLAN-TAIL-PROFILE`, `B-PLAN-TAIL-OMITTED`, `B-LEARNING`, `B-T5-COMPLETION-ASSURED`, `B-T5-COMPLETION-MISSING-ASSURANCE`, `B-COMPACT`, and `B-T4-CURATION-COMPACT-NOT-TRIGGERED` against the exact T2 target.
  - Evidence form: Passing parser matrix plus observations with one stable adapter owner, one `assess` result, no fourth tail row/direct portable transition, correct missing-assurance stop, and no compact dispatch.
  - Target recheck: TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER
  - Receiver: dev-verification
- [ ] VR-SLE-HANDOFF. Prove one adapter result envelope and one code review
  - Criterion: AC-SLE-HANDOFF
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe `B-FULL`, `B-COMPLETION`, `B-T4-LEARNING-STANDARD`, `B-REVIEW-WORDING-ADVISORY`, and `R-REVIEW-ADVISORY-MAINTENANCE` with exact current target/fixture receipts.
  - Evidence form: One Methods-none Common Handoff per adapter attempt with portable identity/mode/result, backend-owned state/completion, one final code review, advisory residual input, and no continual-learning review pass.
  - Target recheck: TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER
  - Receiver: dev-verification
- [ ] VR-SLE-PAPERCUT. Preserve capture and exact-record settlement
  - Criterion: AC-SLE-PAPERCUT
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; evaluate `CL-PAPERCUT-ID-BOUNDARY`, papercut `P-POST-WORK-HANDOFF`, `P-NO-CANDIDATE`, `P-RECURRENCE-CANDIDATE`, `P-REVIEW-PROPOSE-ONLY`, and every `B-T4-PAPERCUT-*` case named in CONTRACT-SLE-DEV-EVALS against disposable ledgers only. Also run `CL-DEEP-TRIGGERS` with a separately authorized pointed Deep reconsideration of the same exact open `PC-ID`.
  - Evidence form: Passing helper tests and a mapping table proving Handoff-before-look, assessor-no-ledger, recurrence delivery with unchanged `PC-ID`, Deep authority binding, proposal/open state until an authorized terminal result reaches backend mapping, at-most-one exact settlement, all other open branches, unchanged unrelated IDs, and no production-ledger byte change.
  - Target recheck: TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-DISCOVERY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER
  - Receiver: dev-verification
- [ ] VR-SLE-CUTOVER. Validate every active caller and fixture pair
  - Criterion: AC-SLE-CUTOVER
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, run `python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test`, `python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py`, `python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json`, and `python3 .config/agents/skills/dev-ask/evals/compare_trace.py --keep-check --baseline-blob 3a2053bb1f03e7b32a77895b8fe8748189cda170 --baseline-commit 479dce6de60cde01c8c87627241618765ef05454 --baseline-sha256 bd5a27fe1b676f69731b7bb5eb931388725f3293a9ebc9db37d9f4bc3db086ba --current .config/agents/skills/dev-ask/evals/evals.json --repo-root /Users/kim/.dotfiles`; seal and compare fresh receipt-bound observations for all 40 CONTRACT-SLE-DEV-EVALS cases plus portable `P-DOCUMENTATION-DISCOVERY`; verify each registry `inputs.request` equals its mirrored fixture request.
  - Evidence form: Passing scanner/self-tests and pinned-baseline keep-check; final `REWRITE_IDS` equals the exact original-four-plus-34 set and `ADDED_IDS` equals the unchanged eight set; exact baseline-union inventory; byte-identical keep cases/fixtures; forty passing sealed changed-case receipts with exact changed-path manifests; portable discovery pass; five active generic ADRs with D01-D27 resolved once; retained engineering D03/D04 labels; and zero stale owner/Standard-alias or portable-SKILL ADR/WORKFLOW dependency hits.
  - Target recheck: TGT-SLE-ACTIVE-AUTHORITY, TGT-SLE-DISCOVERY, TGT-SLE-ADAPTERS, TGT-SLE-EVAL-CUTOVER
  - Receiver: dev-verification
- [ ] VR-SLE-PRESERVE. Recheck every prohibited-effect target
  - Criterion: AC-SLE-PRESERVE
  - Proof class: worker smoke
  - Scenario / environment / fixture: Seal PRE-SLE-WORKTREE immediately before T1. After all smoke, hash every CONTRACT-SLE-PRESERVE path; compare the canonical status/object manifest for every non-target pre-existing dirty/untracked object; reconstruct every changed dirty/untracked target from its approved preimage and recorded plan-owned slices; compare every complementary slice; and inspect staging, production papercut ledger identity, user-level guidance identity, and the separate assurance-tail plan identity.
  - Evidence form: Exact all-equal fixed-path and non-target object manifests, byte-identical complementary slices with differences confined to predeclared plan-owned slices, zero staged/shipping/external effect, no undeclared changed path, and explicit unchanged verdict for parser, product, setup, hosts, ledger, user guidance, and protected plan.
  - Target recheck: TGT-SLE-PRESERVE
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-SLE-T1 | T1 | Exact TGT-SLE-NEW-AUTHORITY and TGT-SLE-PORTABLE revisions plus AC-SLE-ENVELOPE through AC-SLE-NOTES smoke | completed, blocked, authority-change-required | T2 | Common Handoff from dev-handoff with Methods none, changed-path/SHA manifest, criterion evidence, and no implementation claim for deferred notes |
| OUTP-SLE-T2 | T2 | Sealed exact changed-path/SHA-256 manifest for every non-preserve target plus all AC-SLE-TAIL through AC-SLE-PRESERVE smoke | completed, blocked, failed, transport-unavailable, authority-change-required | dev-verification | Common Handoff from dev-handoff with Methods none, closed caller/fixture accounting, preservation manifest, and backend-scheduled high-consequence tail source |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-SLE-IDENTITY | dev-implementation backend | Exact existing object/registry row, current bytes, provenance, and semantic comparison with D27/portable contracts | T1, T2 | A pre-existing ADR-0009, D27, or portable target is a load-bearing identity conflict; do not renumber, adopt, overwrite, alias, or continue without a revised exact plan and native reapproval | Named paths are absent and ADR-0009/D27 remain unallocated, or revised human authority resolves the collision. |
| BLK-SLE-DRIFT | dev-implementation backend | Fresh target hashes, all 40 FIXTURE-SLE-40 per-file identities, changed hunks, and semantic comparison with this plan | T1, T2 | Unrelated drift is preserved and does not reapprove; authority/scope/acceptance/topology/effect/shared-contract drift requires a revised exact plan and native reapproval | Current bytes still permit the named surgical edits without replacing user work. |
| BLK-SLE-OVERLAP | dev-implementation backend | Current shared-target identities plus evidence separating this plan's contracts from `.agents/plans/2026-08-19-1400_assurance-tail-efficiency.md` | T2 | Never read the other plan as semantic authority or edit/merge/supersede it. Unrelated landed hunks are preserved; a changed tail/eval/shared assumption is load-bearing and returns to plan revision/reapproval | Shared current bytes preserve both contracts without a semantic winner or dropped input. |
| BLK-SLE-CAPABILITY | dev-implementation backend | Fresh provider-neutral evidence for one qualified sequential owner, fresh portable semantic evaluators, sealed dev receipts, and the existing high-consequence tail | all | No fallback to full orchestration, nested planners, unsealed semantic claims, or weaker assurance; a non-equivalent capability requires material reapproval | One-owner sequential work, required smoke, and backend-scheduled independent verification/review/assessment are available. |
| BLK-SLE-SEMANTIC | authority owner | Exact conflicting clause, affected AC-SLE-* IDs, dependency cone, and proposed authority revision | T1, T2 | Stop before writes outside settled authority; resume only on revised approved bytes | The conflict is resolved without inventing product, architecture, destructive, external, host, or shipping authority. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-SLE-D07-D23 | active ADR | `docs/adr/0004-canonical-discovery-and-continual-learning.md`, D07 and D23 | Preserve frozen learning proof and focused discovery while projecting the portable owner; D07 stays ACTIVE. |
| ANC-SLE-PORTABLE-PATTERN | reusable skills | `.config/agents/skills/papercut/SKILL.md`, `papercut/WORKFLOW.md`, `papercut/evals/evals.json`; `.config/agents/skills/grill-me/SKILL.md` | Reuse the portable module/eval shape and thin-adapter boundary; do not copy papercut storage or the grill procedure. |
| ANC-SLE-BACKEND | executable caller | `.config/agents/skills/dev-implementation/SKILL.md`, candidate binding, route-to-task tail source, state/result accounting, Execute-ready-frontier step 9, and exact PC-ID settlement | Keep one dev tail caller, backend state ownership, tuple binding, and settlement while invoking portable `assess` once. |
| ANC-SLE-EVALS | eval contracts | `.config/agents/skills/dev-ask/evals/evals.json`; `scan_stale_contracts.py`; `compare_trace.py`; CONTRACT-SLE-DEV-EVALS | Closed direct-caller inventory and receipt-backed adapter proof; portable semantics stay in the new skill-local registry. |
| ANC-SLE-PAPERCUT | cross-workflow owner | `docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md` D24; `papercut/SKILL.md` capture/candidate/resolve sections | Preserve post-Handoff capture, proposal-only review, exact-ID settlement, and open-record behavior. |

- ASM-SLE-D27: `docs/adr/INDEX.md` at `sha256:64526de3423fd73ef0c3cd00a4483e8f0106db06acbee4bfb9f195351a952b89` ends at ADR-0008/D26 and the exact new paths are absent. If any identity appears before T1, enter BLK-SLE-IDENTITY; do not choose another number or name.
- ASM-SLE-D07: Locked authority requires the ADR-0004 D07 projection and its bound-eval/compact invariants; no approved supersession exists. Keep D07 ACTIVE and additive with D27. Any approved supersession discovered before execution is authority drift requiring plan revision/reapproval.
- ASM-SLE-WORKFLOW-PATH: Existing maintenance documents colocate SKILL.md, WORKFLOW.md, and skill-local evals, and the new generic module path is absent. Use `.config/agents/skills/continual-learning/WORKFLOW.md`, not dev-ask, dev-continual-learning, a root duplicate, or a new workflow directory. If occupied, enter BLK-SLE-IDENTITY.
- ASM-SLE-DISCOVERY: `.grok/skills` resolves to `../.config/agents/skills`, bootstrap links the whole `.config/agents` tree, and init-ask has a fixed generic rules/skills row. Add no registration or setup row. If current discovery no longer sees a new frontmatter skill, stop as a host/distribution authority change rather than editing harness files.
- ASM-SLE-EVAL-MANIFEST: The closed 40 paths exist at the exact FIXTURE-SLE-40 per-file SHA-256 identities; each registry request has one mirrored fixture. Any missing, extra, or mismatched path/hash pair enters BLK-SLE-DRIFT. Do not compute or trust an aggregate substitute, silently add/drop a case, or admit a new direct semantic caller without a revised inventory and plan revision.
- ASM-SLE-PENDING-PLAN: The separate assurance-tail plan projection exists at the exact preserved hash and may not be merged, edited, or superseded. Preserve its bytes and use BLK-SLE-OVERLAP for shared-target drift; never inspect its plan prose to decide this outcome.
