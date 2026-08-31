# Manual Reconcile Workflow

**Datetime**: 2026-08-29-1827
**Mode**: implementation
**Scope**: Portable manual reconciliation skill, shared read-only reviewer protocol, narrow semantic evals, and two OMP reviewer bindings with bootstrap installation mappings
**Summary**: Add one manual `reconcile` workflow that keeps the invoking main agent in control while two distinct persistent read-only reviewers refine one exact candidate through mandatory first-pass rethink and progress-based convergence. Bind the logical reviewers to the confirmed OMP model roles without changing core `dev-*`, ADR, Grok, plan, completion, or audit contracts.
**Status**: DONE
**Completed At**: 2026-08-31-0238

## Objective

- Outcome: OUT-RECONCILE-01
- Observable end state: Explicit `/skill:reconcile` invocation preflights capability and readable context, obtains one approved Reconcile brief, runs A initial → same-A rethink → B initial → same-B rethink before any eligible terminal verdict, applies only finalized authorized revisions, alternates the same two reviewers until exact current-candidate validity or a named progress stop, and presents every round before the final proposal or resumable stop. A disposable OMP v18.0.11 project overlay resolves both thin reviewer bindings to the confirmed distinct models; each wrapper uses injected `hub send` only as the finalized-response channel back to Main, with no OMP runtime change or other reviewer messaging. The existing `~/.agents` and default-profile config symlinks immediately project the new skill and role rows, while the live default profile cannot dispatch the absent `second-opinion-*` agents until the two bootstrap mappings are installed under separate later authority.
- Progress signal: One named AC-RECONCILE criterion passes on the exact current target, or one named BLK-RECONCILE blocker is resolved. Another opinion, repeated wording, elapsed time, an unchanged candidate, or additional machinery is not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-RECONCILE-DESIGN | Human-confirmed workflow design plus bounded final plan-body revision | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T10-06-59-070Z_01a04cfc-9dfe-72ac-bec0-4bff0eb8a743/local/reconcile-workflow-final-handoff.md`; `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T11-11-46-184Z_01a04d37-ee08-74e3-9c28-1c28497a973a/local/reconcile-plan-final-revision-handoff.md` | Design `sha256:8ab737150a338c4a1f654c99f2087e78effb3bd65c5d434b5d79ba9f2220890c`; final plan-body revision `sha256:520aed2e27a8b7eec090449668962846101d884cfecfd0e023d9e27504b6a156`; authority revision `AUTH-RECONCILE-20260829-R1` | Confirmed for exact design reuse and these seven bounded plan-body corrections. Repository implementation begins only after native approval of this exact revised plan; staging, shipping, and unrelated effects remain unauthorized. |
| AUTH-RECONCILE-HUB-RESPONSE | Human-authorized narrow reviewer response-channel exception and continuation | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-hub-response-authority.json` | `sha256:997a0d5f57139cadd95f054474ab852ce9bd75ada5a2745ca9d42e78385dab8d`; authority revision `AUTH-RECONCILE-20260830-R2` | Confirmed after `BLK-RECONCILE-OMP`. Supersedes only the zero-reviewer-`hub` and dependent response-transport clauses: the portable workflow uses a host-provided finalized-response channel, and each thin OMP wrapper may use injected `hub send` only to return its finalized response to Main. No OMP runtime/tool change, broader peer messaging, or other scope expansion is authorized. Continuation requires native approval of this exact revised plan. |
| AUTH-RECONCILE-OMP-1811 | Human-authorized installed proof-environment rebind and continuation | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-omp-v1811-authority.json` | `sha256:208756b5b47e6a8436388d38e5c3eb01758c9f6221ea1dccd2a9ae96f8383c23`; authority revision `AUTH-RECONCILE-20260830-R3` | User selected “Rebind to v18.0.11” after exact v18.0.10/v18.0.11 blocker disclosure. Supersedes only the unavailable OMP v18.0.10 proof-environment fact: use the installed `/Users/kim/.local/bin/omp` v18.0.11 and prove compatibility rather than assuming it. No install, downgrade, runtime/tool change, semantic target change, or wider scope is authorized. Continuation requires native approval of this exact revised plan. |
| AUTH-RECONCILE-R4-REPAIR | Human-authorized permanent-eval correction and causal effect-proof isolation | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-r4-eval-isolation-authority.json` | `sha256:4d0558c08ba93b194634a0b2449d99505ea1e88a97bbf84a8f48f7133d88af14`; authority revision `AUTH-RECONCILE-20260830-R4` | User selected “Authorize bounded R4 repair” after the exact R3 7/10 proof result. Supersedes only R3’s no-target-change clause for the exact `REC-SEMANTIC-REVALIDATION` prompt prefix and replaces noncausal whole-tree effect attribution with sandbox-enforced causal isolation. No production skill/protocol/wrapper/config/bootstrap behavior, assertion, model, response channel, runtime/tool, installation, delivery, or wider scope changes. Continuation requires native approval of this exact revised plan. |
| AUTH-RECONCILE-R5-DAEMON | Human-authorized exact OMP daemon-runtime exception and continuation | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-r5-daemon-authority.json` | `sha256:b0263fee3f6d77a91fdaa08156e0a01657b1f7135c0704ee2720c24cb710db0e`; authority revision `AUTH-RECONCILE-20260830-R5` | User selected “Authorize exact daemon subtree” after the R4 sandbox blocked mandatory OMP startup `mkdir`. Supersedes only R4’s direct-home allowlist by adding `/Users/kim/.omp/run/daemons/6ba95a22da8dffb4` for the exact recreated smoke root. Target bytes, repository/Mnemopi/other-home denial, models, assertions, behavior, runtime/tool bytes, and delivery boundary remain unchanged. Continuation requires native approval of this exact revised plan. |
| AUTH-RECONCILE-R6-REPAIR | Human-authorized semantic-fixture, trace-retention, and operational-effect repair | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-r6-repair-authority.json` | `sha256:b5034a2011e2435f19bd5bb55abc8b54aaa1a36f398454fa59f5110421d5bef7`; authority revision `AUTH-RECONCILE-20260830-R6` | User selected “Authorize bounded R6 repair” after the final R5 attempt exhausted. Supersedes only the exact `REC-SEMANTIC-REVALIDATION` prompt bytes, live-proof session retention, and bounded `agent.db` operational-effect classification. Exact plan approval remains required after this parser-valid revision is hashed. |
| AUTH-RECONCILE-R7-FINALIZATION | Human-authorized one-shot capture and exact saved-session cache effect | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-r7-finalization-authority.json` | `sha256:57c7d16875cbc43326bc8213c7aa9a60b9aa6f2685ed373c0b6adaa535c0ede3`; authority revision `AUTH-RECONCILE-20260830-R7` | User selected “Authorize bounded R7 finalization” after R6 exhausted with exact live behavior/traces, one unpersisted semantic result, and repeatable smoke-bound `session:sticky` rows. Supersedes only the semantic evidence capture sequence and cache row-class admission; target/runtime/model/path/credential/delivery contracts remain exact. Exact plan approval is required after this revision is parser-valid and hashed. |
| AUTH-RECONCILE-BASE | Interrupted repository continuation baseline | `git:e6df2b7a31dfdd647a611920c8650652899e55bd`; current target `sha256:75e3a1f36b52eec24017dd248ecee1132e1b71a15745121e563fcf73746deda3` | Exact current seven-path identities in the Target map and unchanged preservation manifest | Continuation starts only from the declared current bytes. Pre-existing user work remains owned by the user. |

Authority precedence is AUTH-RECONCILE-R7-FINALIZATION for exact one-shot semantic capture and smoke-bound `session:sticky` cache admission; then AUTH-RECONCILE-R6-REPAIR, AUTH-RECONCILE-R5-DAEMON, AUTH-RECONCILE-R4-REPAIR, AUTH-RECONCILE-OMP-1811, AUTH-RECONCILE-HUB-RESPONSE, AUTH-RECONCILE-DESIGN, and exact current repository patterns/bytes. Current and final seven-path target is fixed at `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e`; R7 permits no semantic target change. All seven R6 bytes, OMP v18.0.11, exact models, response channel, session-dir, sandbox path allow-list, credential-payload requirement, installation, and delivery boundaries remain unchanged.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-RECONCILE-MANUAL | AUTH-RECONCILE-DESIGN | Create `reconcile` with minimal frontmatter and exact `disable-model-invocation: true`. Every successful invocation performs capability/context preflight, then shows one Reconcile brief and waits for its local approval before reviewer dispatch or candidate mutation. This gate is not `dev-ask` route, implementation, external-effect, or shipping approval. |
| DEC-RECONCILE-CANDIDATE | AUTH-RECONCILE-DESIGN | Infer the candidate from an explicit proposal/artifact, otherwise the latest substantive assistant proposal, otherwise `unresolved`. Bind conversation text as `conversation@sha256:{exact-content-digest}` and an artifact as `{exact-readable-locator}@sha256:{exact-file-digest}`, where each digest is lowercase SHA-256 of the exact UTF-8 proposal bytes or exact file bytes. Supply bounded exact content or a child-readable locator, never an opaque cross-session reference. |
| DEC-RECONCILE-OWNERSHIP | AUTH-RECONCILE-DESIGN; AUTH-RECONCILE-HUB-RESPONSE | The invoking main agent is the sole controller, canonical-candidate owner, mutator, validator, cycle detector, ephemeral round recorder, and presenter. Logical reviewers A and B are distinct persistent read-only children; they never edit, spawn, control the loop, read counterpart `history://` or `agent://` artifacts, or present the final user response. A reviewer may use only the host-provided response channel to return the complete current response to the invoking Main controller; it sends no reviewer-to-reviewer, unsolicited, loop-control, dispatch, or other message. B receives A’s work only through the main agent’s finalized response packet. |
| DEC-RECONCILE-FIRST | AUTH-RECONCILE-DESIGN | Run A initial, same-A explicit `rethink`, B initial, same-B explicit `rethink` in that exact order whenever context and transport remain available. Initial responses are provisional and superseded. Only each reviewer’s post-rethink first-iteration response may change the candidate; A post-rethink `VALID` never skips B; B post-rethink `VALID` is the earliest eligible terminal verdict. |
| DEC-RECONCILE-LATER | AUTH-RECONCILE-DESIGN | After B post-rethink, apply a finalized `REVISE`, re-identify the candidate, and alternate the same existing A and B with the counterpart’s latest finalized response. No later pass loads `rethink`. Every semantic candidate change invalidates prior `VALID` verdicts for the old identity and requires counterpart revalidation. |
| DEC-RECONCILE-VERDICTS | AUTH-RECONCILE-DESIGN | Every reviewer response contains exactly one verdict, as the bare uppercase line 1 token `VALID`, `REVISE`, or `BLOCKED`, followed by the exact matching complete template below. Duplicate verdicts, raw `rethink` verdicts such as `extend`, lowercase/synonym/qualified/multiple verdicts, missing fields, wrong reviewer/pass, or stale identity are malformed and return to the same reviewer for contract correction; the main agent invents no semantic edit. |
| DEC-RECONCILE-MUTATION | AUTH-RECONCILE-DESIGN | Apply only a finalized authorized `REVISE`: replace complete conversation proposals or edit only the approved artifact. Re-read, rehash, and run an existing artifact-native validator after every artifact edit when available. Never mutate supporting context, apply a provisional response, or create a mirrored proposal, temporary source of truth, or runtime ledger. |
| DEC-RECONCILE-STOPS | AUTH-RECONCILE-DESIGN | Stop without validity on repeated candidate identity in an A/B cycle, no substantive change after `REVISE`, repeated unresolved frontier, unavailable persistent reviewer or same-child follow-up, unreadable required context, authority conflict, or a reviewer still `BLOCKED` after available context correction. Use progress, not a round cap. |
| DEC-RECONCILE-RECOMMENDATIONS | AUTH-RECONCILE-DESIGN | Apply compatible editorial-only recommendations directly, re-identify the candidate, and record the terminal identity without counterpart revalidation. Applying any recommendation that changes meaning, scope, acceptance, constraint, architecture, or mechanism requires counterpart `VALID` on the new identity. Conflicting authority blocks instead of being silently applied. |
| DEC-RECONCILE-OUTPUT | AUTH-RECONCILE-DESIGN | Always render `## Review rounds` first with columns Step, Reviewer, Pass, Verdict, Adjustment and every provisional/final/later pass. Success then renders `## Final proposal`: complete text in conversation mode, or short change summary plus exact artifact locator/current identity in artifact mode. A stop renders `## Reconcile stopped` with the last identity, blocker, and resumable frontier and makes no validity claim. |
| DEC-RECONCILE-PACKAGE | AUTH-RECONCILE-DESIGN | Add only one portable skill, one shared reviewer protocol, and a minimal declarative eval registry. Add no controller agent, router, scheduler, state machine, runtime store, persisted round counter, persisted protocol state object, runtime ledger, audit tuple, attestation, receipt, protocol registry, Common Handoff inside the review loop, script, asset, WORKFLOW file, or repository helper. Main-owned per-invocation step numbering, round rows, and ephemeral seen identity/reviewer/frontier sets are required and never persisted. |
| DEC-RECONCILE-OMP | AUTH-RECONCILE-DESIGN; AUTH-RECONCILE-HUB-RESPONSE; AUTH-RECONCILE-OMP-1811; AUTH-RECONCILE-R5-DAEMON; AUTH-RECONCILE-R6-REPAIR; AUTH-RECONCILE-R7-FINALIZATION | Use installed `/Users/kim/.local/bin/omp` v18.0.11 without installation, downgrade, or runtime/tool change. Bind `second-opinion-a` through `@second_opinion_a` to `openai-codex/gpt-5.6-sol:xhigh` and `second-opinion-b` through `@second_opinion_b` to `xai-oauth/grok-4.6:xhigh`. Each wrapper declares data tools exactly `read`, `grep`, and `glob`; OMP auto-adds hidden `yield` and ensures `hub`. Initial provisional responses use ordinary task results. Each Main-requested post-rethink, later, or contract-correction pass uses exactly one injected `hub send` to invoking Main with only the complete outer response; no await, peer read/message, or other `hub` operation. Parent `hub` remains Main-owned. Live proof may create coordination state only below the exact authorized project daemon subtree and must remove only absent-before smoke-created residue after stopping the process tree. R6 proof invocations replace `--no-session` with `--session-dir {exact-smoke-root}/sessions`; the worker hash-seals exact parent and fresh A/B traces before the process stops and removes the absent-before smoke root. This changes proof retention only, not workflow or runtime behavior. |
| DEC-RECONCILE-EVALS | AUTH-RECONCILE-DESIGN; AUTH-RECONCILE-HUB-RESPONSE; AUTH-RECONCILE-R4-REPAIR; AUTH-RECONCILE-R6-REPAIR; AUTH-RECONCILE-R7-FINALIZATION; `test-value/v1` | Preserve the exact three-case registry at `sha256:941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7`. For proof only, execute exactly one fresh `completion()` per complete prompt in a dedicated capture step; normalize only a returned string or JSON-serializable object to exact UTF-8, write and hash the named evidence artifact immediately, and perform assertion grading only in a later step reading that sealed artifact. A call without a sealed artifact fails and is never retried. Add no hidden wrapper; change no prompt, expected output, assertion, model, or production byte. |

## Scope, non-goals, and prohibited effects

- Read surfaces: all authority revisions through AUTH-RECONCILE-R7-FINALIZATION, all prior blocked-attempt Handoffs/evidence including final R6 A2, every preserved target below, `.config/agents/skills/craft-skill/SKILL.md`, current `rethink`, `recap`, test-audit reviewer, OMP config/agent/runtime/session/cache shape, bootstrap, semantic-eval patterns, current plan identity, and final work Handoff.
- Change surfaces: proof-recipe/context/evidence artifacts and ordinary lifecycle bookkeeping for this plan only. All seven semantic target files are read/preserve surfaces; R7 authorizes no repository semantic change.
- Non-goals: modifying `rethink`; installing or downgrading OMP; changing OMP runtime/tool source or adding a follow-up-result API; changing or routing any core `dev-*` skill, `WORKFLOW.md`, active ADR, completion presenter, Common Handoff, plan lifecycle, audit workflow, Grok configuration, model catalog, `task.agentModelOverrides`, manifest, existing test-audit roles/agents, or project `.omp`; supporting arbitrary hosts by weakening the two-persistent-reviewer contract; installing a controller agent or persisted protocol state. Main-owned per-invocation step numbering and ephemeral round/seen sets remain required.
- Prohibited effects: semantic repository writes or repository writes outside plan bookkeeping; direct writes under `~/.omp` except the exact `agent.db` triplet and exact daemon subtree; any session path outside the exact smoke root; broad bootstrap execution; live reviewer-wrapper symlinks; credential login/copy/reconfiguration or payload hash/length change; external mutation beyond bounded model inference, provider-managed OAuth timestamps/revisions, exact operational rows already admitted by R6, and smoke-bound `session:sticky` rows tied to exact parent/reviewer session identities and live window; manual DB seed/delete/restore/normalization; staging, commit, push, review, release, deploy, rollout, branch/history mutation, or shipping. Smoke/session/daemon paths begin absent and must be absent after verified shutdown.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-RECONCILE-REPO | Preserved repository target with disclosed existing-symlink projection | AUTH-RECONCILE-DESIGN through AUTH-RECONCILE-R7-FINALIZATION plus native approval of this exact revised plan | Current/final semantic target is fixed at `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e` with eval `sha256:941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7`. R7 permits no target mutation. Existing skill and role rows project through declared symlinks; live reviewer wrappers remain absent; plan lifecycle bookkeeping is the only repository write. |
| EFF-RECONCILE-SMOKE | Bounded model inference, existing-auth use, exact daemon/session coordination, atomic semantic evidence capture, and enforced isolation | AUTH-RECONCILE-DESIGN through AUTH-RECONCILE-R7-FINALIZATION plus native approval of this exact revised plan and existing OMP provider authorization | Recreate the exact absent smoke root; use installed OMP v18.0.11, final config plus memory-off overlay, unchanged sandbox path allow-list, and session storage only below the smoke root. Hash-seal parent/A/B traces before verified stop and cleanup. In agent.db admit unchanged-payload OAuth timestamp/revision refresh; exact-provider usage-report cache/history; exact smoke command usage; exact bound-model performance; and `session:sticky` cache events only when key/value binds to an exact smoke parent or reviewer child session identity and the event falls inside the exact live window. Disclose concurrent deltas; any unmatched sticky row, payload change, other table/class/path, or manual DB mutation is non-success. Each semantic call is immediately sealed before separate grading and is never retried. |

The later disposable isolation overlay is exactly:

```yaml
memory:
  backend: off
```

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-RECONCILE-BRIEF | Manual candidate-binding gate | T1 | DEC-RECONCILE-MANUAL, DEC-RECONCILE-CANDIDATE | T1 |
| CONTRACT-RECONCILE-PACKET | Ephemeral candidate/review packet and identities | T1 | DEC-RECONCILE-CANDIDATE, DEC-RECONCILE-OWNERSHIP | T1 |
| CONTRACT-RECONCILE-REVIEW | Shared reviewer response, host-provided finalized-response channel, and lightweight revision Handoff | T1 | DEC-RECONCILE-OWNERSHIP, DEC-RECONCILE-VERDICTS | T1 |
| CONTRACT-RECONCILE-SEQUENCE | Controller order, mutation, freshness, recommendations, and stops | T1 | DEC-RECONCILE-FIRST, DEC-RECONCILE-LATER, DEC-RECONCILE-MUTATION, DEC-RECONCILE-STOPS, DEC-RECONCILE-RECOMMENDATIONS | T1 |
| CONTRACT-RECONCILE-OUTPUT | Terminal success and stop presentation | T1 | DEC-RECONCILE-OUTPUT | T1 |
| CONTRACT-RECONCILE-PORTABLE | Skill/reference/eval package boundary | T1 | DEC-RECONCILE-PACKAGE, DEC-RECONCILE-EVALS | T1 |
| CONTRACT-RECONCILE-OMP | OMP logical-role adapter and installation mapping | T1 | DEC-RECONCILE-OMP | T1 |

`CONTRACT-RECONCILE-BRIEF` renders exactly:

```markdown
## Reconcile brief

- **Goal:** {approved goal text}
- **Candidate:** {latest proposal summary, or exact artifact locator and identity}
- **Context:** {approved user intent, constraints, and decision-bearing references}
- **Mode:** {conversation replacement, or edits limited to the named artifact}

Reply **approve** to start, or **approve — {adjustments}**.
```

`approve` starts the displayed binding. An unambiguous `approve — {adjustments}` updates that binding and starts without another gate. A correction without approval, or a conflicting/ambiguous adjustment, produces one revised brief and waits. An unresolved candidate renders `Candidate: unresolved — name one proposal or artifact` and waits; approval alone cannot dispatch it. Capability/context preflight failure stops before the brief with the missing capability or unreadable locator and no reviewer or mutation.

`CONTRACT-RECONCILE-PACKET` contains only the approved goal/user intent; decisions, constraints, and exclusions; complete current proposal text or exact artifact locator/current identity; decision-bearing readable context; current shared-protocol locator/digest; logical reviewer and pass; invoking Main controller identity plus the host-provided finalized-response channel; and the counterpart’s latest finalized response when one exists. Large context uses native shared-artifact transport only when both children can read it. The packet never depends on a session ID or opaque locator by itself.

The complete finalized reviewer response is the lightweight revision Handoff; it is not an engineering Common Handoff, persisted schema, or separate artifact. The verdict appears exactly once, on line 1. Use exactly one complete template:

```text
VALID
Reviewer: {A or B}
Pass: {initial, post-rethink, or later}
Candidate: {exact reviewed identity}

Blocking issues: none
Revision: none
Recommendations:
- none
```

```text
REVISE
Reviewer: {A or B}
Pass: {initial, post-rethink, or later}
Candidate: {exact reviewed identity}

Blocking issues:
- {at least one blocking issue}
Correction:
{complete conversation replacement, or exact bounded artifact edits}
Preserve:
- none
```

```text
BLOCKED
Reviewer: {A or B}
Pass: {initial, post-rethink, or later}
Candidate: {exact reviewed identity}

Blocker: {missing evidence, authority, or transport}
Resume with: {exact input needed}
Revision: none
```

`VALID` `Recommendations` may replace `- none` with bullets prefixed exactly `editorial:` or `semantic:`. `REVISE` `Preserve` may replace `- none` with decisions or rejected overreach that must survive. A duplicate verdict, raw `rethink` verdict such as `extend`, lowercase/synonym/qualified/multiple verdict, missing field, wrong reviewer/pass, stale identity, or non-applicable correction returns to the same child; the main agent invents no semantic edit.

The shared protocol is transport-neutral. Initial provisional review returns through the ordinary host task result. Every Main-requested post-rethink, later, or response-contract-correction pass returns exactly one complete outer response through the supplied host response channel to the invoking Main controller identity. A reviewer sends no other peer message and never spawns, mutates, controls the loop, reads counterpart `history://` or `agent://` artifacts, or contacts the other reviewer; B receives A only through Main’s finalized response packet. Initial/later review asks the named logical reviewer to inspect the supplied exact candidate and packet read-only and return only the outer response contract. Each first-iteration same-child follow-up is a normal-prompt message that explicitly loads the existing `rethink` skill, reassesses the child’s own immediately preceding provisional response from first principles, and returns only one finalized outer `VALID`, `REVISE`, or `BLOCKED`; the outer Reconcile verdict contract supersedes `rethink`’s internal `reject`, `reuse`, `extend`, `test`, or `proceed` presentation vocabulary. No other pass loads `rethink`. The shared protocol names no provider-specific transport; each thin host adapter binds the supplied channel.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-RECONCILE-PORTABLE | `.config/agents/skills/reconcile/SKILL.md`; `.config/agents/skills/reconcile/references/reviewer-protocol.md`; `.config/agents/skills/reconcile/evals/evals.json` | T1 | Current/final bytes: `f7b17329505b354cc823fd074cc9808f43c745e2989f9175a2d74baee8b3f07a`; `f708baf1512b27c811ed1148ed8f5ddcedc0e512863a1e28e730e6a88ff07192`; `941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7`. Exact aggregate target `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e`. R7 proof capture changes no target byte. | Portable skill discovery and shared read-only protocol; exact permanent semantic registry | AC-RECONCILE-BRIEF, AC-RECONCILE-PAIR, AC-RECONCILE-VERDICTS, AC-RECONCILE-MUTATION, AC-RECONCILE-STOPS, AC-RECONCILE-REVALIDATION, AC-RECONCILE-OUTPUT, AC-RECONCILE-PORTABLE |
| TGT-RECONCILE-OMP | `.config/agents/harnesses/omp/agents/second-opinion-a.md`; `.config/agents/harnesses/omp/agents/second-opinion-b.md`; `.config/agents/harnesses/omp/config.yml` | T1 | Interrupted-continuation bytes: wrappers `c399875bea1faf6f844707dc74a1525326359820821c131bb5a9aee6b4a6de15` and `4c843efb9d439398cd0943f21eb751e15e52a3cbcfe15dbff4fee1741f560ac9`; config `50bf0937a98ebc969c7a31d96b5d81b2fbf3b9e10af70eae15e906a40c7d47c0`; removing its two role rows reconstructs the original current-worktree baseline `0de2856aee823a389d650095d69e006a4651468c516c5db275be9526bc8286b9` and pre-existing binary diff `7b19f1d641eb9ba215ef046bd99d1005f131f27783dabcfc7e658fc46bc5768a` | OMP v18.0.11 custom-agent discovery, `modelRoles`, injected narrow reviewer-to-Main `hub send`, and live task/hub persistence smoke | AC-RECONCILE-PAIR, AC-RECONCILE-OMP, AC-RECONCILE-PRESERVE |
| TGT-RECONCILE-BOOTSTRAP | `.config/scripts/bootstrap` `SYMLINKS` | T1 | Interrupted-continuation SHA-256 `99bd13af3de1df681f140e6a181c25bd295463ad009fc173a34b2fe1beeef377`; removing the two second-opinion mappings reconstructs baseline `b9c6c031ae870a6737e41b2b2c0bb1bf42791e7a0e59634fe0ebcacfe260f7c8` | Default-profile `~/.omp/agent/agents` installation; existing backup-before-overwrite loop | AC-RECONCILE-OMP, AC-RECONCILE-PRESERVE |
| TGT-RECONCILE-PRESERVATION | Existing patterns, core contracts, Grok adapter, manifest, and pre-existing user work listed below | T1 | Canonical compact-JSON ordered path/hash manifest SHA-256 `59717ed223eec3775b949250ed4980edea9230fd367e848f13381637c5241683` | Pattern reuse and no-change boundary | AC-RECONCILE-PORTABLE, AC-RECONCILE-PRESERVE |

The final OMP config bytes must equal the TGT-RECONCILE-OMP baseline bytes with only these two sibling lines inserted under `modelRoles`, after the existing test-audit opinion roles; no other byte may change:

```yaml
  second_opinion_a: openai-codex/gpt-5.6-sol:xhigh
  second_opinion_b: xai-oauth/grok-4.6:xhigh
```

The final bootstrap bytes must equal the TGT-RECONCILE-BOOTSTRAP baseline bytes with only these two rows inserted beside the existing test-audit agent mappings; do not add an OMP config mapping or run the broad script:

```bash
"$HOME/.dotfiles/.config/agents/harnesses/omp/agents/second-opinion-a.md|$HOME/.omp/agent/agents/second-opinion-a.md"
"$HOME/.dotfiles/.config/agents/harnesses/omp/agents/second-opinion-b.md|$HOME/.omp/agent/agents/second-opinion-b.md"
```

TGT-RECONCILE-PRESERVATION is this ordered path/hash manifest, encoded as compact JSON pairs before hashing:

- `.config/agents/skills/rethink/SKILL.md` — `dd1e035e520434536621f26cacafeb9572f35df7b1e21200064ee4b6d96aeb36`
- `.config/agents/skills/dev-test-audit/references/opinion-agent.md` — `7b0d04dccecca46243d150139963b3374caf56d9c2c65979d5444edf9b054c4d`
- `.config/agents/harnesses/omp/agents/test-audit-opinion-a.md` — `c57ef51eccca02b9adc56cd1c2c615b3433ab4b0ca2724f611d5a2cb9ef71dc5`
- `.config/agents/harnesses/omp/agents/test-audit-opinion-b.md` — `c6243ec490a2b23975fdfd6ed34f28b5b1cc4153d43b9a29ee953ca239955794`
- `.config/agents/harnesses/grok/config.toml` — `a49237129b6b2508fc759e2931eb37d5feb3724363e5bdf0de29892853dd5162`
- `manifest` — `2970316c1ae861f5939f419c69c14ee293eaf1cf32b43e32482a9676cec33278`
- `.config/agents/skills/completion-presentation/SKILL.md` — `b1896876ea47e70e86641dd414b9135cb006c8aa076da36510a1395e2ff2b6c4`
- `.config/agents/skills/completion-presentation/evals/evals.json` — `9b9828a9c542f54d1df3d0a82ebfc5c3b7b993e5cda36c74e78040127b747172`
- `.config/agents/skills/dev-ask/WORKFLOW.md` — `823486c33ea3d7cb9cf1bde0aec0894cce57b95ccf66ef1b2bda405fc6bfb17b`
- `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` — `2f54924d8d1b51f79da71f11b2b03a2b65cbce787e5b3ad1866b23c450af678e`
- `.config/agents/skills/dev-implementation/SKILL.md` — `bb913b2b8684485d421142a35a33f142bdcdf30ea7d1b0c6260f5811b092a227`
- `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md` — `3959f17a34d0af41190d1123979a558a48b11155c65a07bfe0a1d11de933ad08`
- `.agents/plans/archive/2026-08-29-1516_packed-completion-presentation-labels.md` — `744e2e906615a05b01bf6bbcacc9def81aa464eda827af40931aa24527b039de`

## Execution policy

- Assurance: compact
- Topology: full-orchestration
- Max concurrency: 1
- Isolation: shared repository tree with exact target/effect ownership
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: One work task owns every mutable target. Any undeclared write, overlapping live mutation, target drift, protected-manifest drift, or unexpected existing new-file destination stops the child.
- Decomposition: Exactly one cohesive work task owns the portable skill/protocol/evals, OMP bindings/config, bootstrap mappings, semantic simulations, and live smoke. No numbered verification, review, learning, integration, audit, archive, presenter, or shipping task exists.
- Effect limit: EFF-RECONCILE-REPO, EFF-RECONCILE-SMOKE
- Orchestrator profile: `orchestrator-role-profile/v1`; after native approval of this exact revised plan, launch through `full-orchestration` with a fresh T1 child, fresh revised Task Contract and proof recipes, and `downgrade: none`; `PROMOTE-SERIAL-DEFAULT` keeps runtime concurrency one.

## Tasks

- [x] T1. Add the manual Reconcile workflow
  completed 2026-08-31-0238
  - Owner: dev-implementation worker
  - Intent: Make proposal refinement repeatable while preserving one human-facing owner.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-RECONCILE-PORTABLE, TGT-RECONCILE-OMP, TGT-RECONCILE-BOOTSTRAP, TGT-RECONCILE-PRESERVATION
  - Contracts: CONTRACT-RECONCILE-BRIEF, CONTRACT-RECONCILE-PACKET, CONTRACT-RECONCILE-REVIEW, CONTRACT-RECONCILE-SEQUENCE, CONTRACT-RECONCILE-OUTPUT, CONTRACT-RECONCILE-PORTABLE, CONTRACT-RECONCILE-OMP
  - Criteria: AC-RECONCILE-BRIEF, AC-RECONCILE-PAIR, AC-RECONCILE-VERDICTS, AC-RECONCILE-MUTATION, AC-RECONCILE-STOPS, AC-RECONCILE-REVALIDATION, AC-RECONCILE-OUTPUT, AC-RECONCILE-PORTABLE, AC-RECONCILE-OMP, AC-RECONCILE-PRESERVE
  - Effects: EFF-RECONCILE-REPO, EFF-RECONCILE-SMOKE
  - Output: OUTP-RECONCILE-T1
  - Receiver: dev-implementation backend
  - Verification: VR-RECONCILE-BRIEF, VR-RECONCILE-PAIR, VR-RECONCILE-VERDICTS, VR-RECONCILE-MUTATION, VR-RECONCILE-STOPS, VR-RECONCILE-REVALIDATION, VR-RECONCILE-OUTPUT, VR-RECONCILE-PORTABLE, VR-RECONCILE-OMP, VR-RECONCILE-PRESERVE
  - Lineage: shared

### T1 implementation contract

1. Rehash all seven targets and require current/final aggregate `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e`; reconstruct config/bootstrap baselines; recompute protected manifest; confirm exact OMP v18.0.11; verify exact smoke root and daemon subtree absent; and re-read all authority revisions through AUTH-RECONCILE-R7-FINALIZATION plus exact R6 A2 Handoff/evidence. Any semantic target/protected/version/path drift, project `.omp` shadow, reviewer override, or pre-existing disposable path enters BLK-RECONCILE-DRIFT; R7 permits no target edit.
2. Preserve `.config/agents/skills/reconcile/SKILL.md` exactly at `sha256:f7b17329505b354cc823fd074cc9808f43c745e2989f9175a2d74baee8b3f07a`, including only `name: reconcile`, its concise explicit-invocation description, and `disable-model-invocation: true` in frontmatter. Preserve the mandatory `references/reviewer-protocol.md` link and all production controller behavior; R6 authorizes no production skill change.
3. Resolve logical A and B during preflight from distinct host-provided persistent read-only reviewer bindings and bind the invoking Main controller identity plus finalized-response channel in every packet. Spawn A once and retain its exact child identity; collect A initial through the ordinary task result; send a normal-prompt follow-up to that same child explicitly requiring a read/load of the existing `rethink` skill and first-principles reassessment; retain the `skill://rethink` load/content trace; collect A’s complete post-rethink response through the supplied channel; then and only then apply finalized A `REVISE`. Spawn B once against the current candidate plus A’s finalized response, retain a distinct child identity, and perform the same B initial → normal-prompt same-B `rethink` → supplied-channel finalized response sequence before applying finalized B `REVISE`. Complete all four phases when transport/context remain available; neither provisional `VALID` nor A post-rethink `VALID` terminates the first iteration.
4. After B post-rethink, terminate only on eligible exact `VALID` for the current identity with no applied semantic recommendation. Otherwise apply one complete authorized finalized `REVISE`, re-read/re-identify, and send the new candidate plus the counterpart’s latest finalized response to the existing other child. Alternate those same children with no later `rethink` load; every later finalized response returns through the supplied channel. A `BLOCKED` response may receive already-approved readable context or a response-contract correction through the same child; each Main request receives one complete response and never authorizes candidate mutation or invented authority.
5. Assign monotonically increasing per-invocation Step values to one ephemeral round list and keep an ephemeral seen identity/reviewer/frontier set. Stop before another review when a `REVISE` leaves bytes/meaning unchanged, when the same identity would return to a reviewer without new evidence/authority, or when the same unresolved frontier repeats. Never persist the Step counter, list, set, or a protocol state object, and never impose a fixed round count. Mark provisional first responses as superseded in the final table rather than hiding them.
6. Update `references/reviewer-protocol.md` as the sole portable child contract. Define read-only roles/input, the invoking Main identity and host-provided finalized-response channel, all three complete one-line-1-verdict templates, ordinary initial return, later instruction, normal-prompt same-child post-rethink instruction, initial-versus-finalized authority, contract-correction behavior, and prohibitions on mutation/delegation/controller/final-output authority. Require exactly one complete response through the supplied channel for each Main-requested post-rethink, later, or contract-correction pass; prohibit every other peer message, spawn, mutation, and counterpart `history://`/`agent://` read; require B to consume A only through Main’s finalized packet. The complete finalized response itself is the lightweight revision Handoff supplied to the counterpart; add no provider-specific transport name, separate file/schema/version/digest registry, or runtime machinery.
7. Preserve `evals/evals.json` exactly at SHA-256 `941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7`, including all three prompts, expected outputs, assertions, `files: []`, ordering, formatting, and runner/host/model bindings. R7 changes proof capture only and authorizes no semantic fixture or assertion edit.
8. Preserve `second-opinion-a.md` and `second-opinion-b.md` byte-exact at their declared hashes. Keep current audit-agent frontmatter, role-backed quoted models, declared `tools: read, grep, glob`, `read-summarize: false`, protocol digest binding, A/B identity, and non-mutating `BLOCKED` fallback. R6 authorizes no wrapper edit.
9. Preserve and reverify the exact two `second_opinion_*` role rows in current config bytes and the exact two agent-file mappings in current bootstrap bytes. Removing those additions must reconstruct the original declared baselines. Preserve the pre-existing config formatting/user delta, every test-audit role/mapping, `task.showResolvedModelBadge`, backup-before-overwrite behavior, Grok config, manifest, lock file, project `.omp`, and all protected bytes. Do not add `task.agentModelOverrides`, an OMP config bootstrap mapping, a named-profile mapping, or execute bootstrap. Verify the repository edits project the skill through `~/.agents` and role rows through the existing default-profile config symlink while live `~/.omp/agent/agents/second-opinion-*.md` remains absent.
10. Run every VR-RECONCILE recipe on one exact final target.
    - Semantic grader: parse final JSON structurally, then run exactly one fresh stateless `completion()` per case in three separate capture-only steps with exact final skill/protocol and complete prompt. Each step accepts only a string or JSON-serializable return, converts it deterministically to UTF-8, writes the named local output artifact, and records its SHA-256 before returning. Run assertion grading later in separate steps that read only sealed bytes. Missing sealed output is failure and never triggers retry. Add no hidden wrapper; record pass/fail, plausible bug, and `keep`.
    - Live overlay: recreate exact smoke root `/private/var/folders/z6/yrrqx1_s4vv57r21kc48yz3c0000gn/T/reconcile-r4-smoke-fbvfb_15`, populate final skills/wrappers/candidate/context and exact `memory.backend: off` isolation config, and use only OMP v18.0.11. Canonical sandbox denies repository and `/Users/kim/.omp` writes except exact smoke root, agent.db triplet, and daemon subtree. Run final repository config first and isolation config second through `/usr/bin/sandbox-exec` with `--cwd {exact-smoke-root} --add-dir /Users/kim/.dotfiles --no-extensions --session-dir {exact-smoke-root}/sessions --skills=reconcile,rethink`; do not use `--no-session`. Before stopping, locate, read, and hash-seal exact parent plus fresh A/B child traces from the smoke-root session tree, proving child identities, same-child follow-ups, rethink loads/content, complete finalized sends, and forbidden-operation absence. Run the approved conversation and artifact scenarios only; no install, profile/runtime/tool/model change, or live-wrapper write.
    - Isolation evidence: snapshot config, absent daemon/smoke/session paths, DB rows, Mnemopi, plans, repository/status, and probes. After closure, run live proof under unchanged sandbox paths and retain/hash traces before stop. Admit unchanged-payload OAuth timestamp/revision refresh; exact-provider usage-report cache/history; exact smoke command usage; exact bound-model performance; and only those `session:sticky` cache events whose key/value binds to exact smoke parent/reviewer child IDs and whose event falls within the exact live window. Disclose concurrent rows without attribution and reject unmatched classes. Stop exact process tree, prove no descendant/client, remove absent-before daemon/smoke/session state, verify absent, and bind all repository/protected/projection/staging boundaries.
    - Closure: finish any directly evidenced in-boundary candidate repair before candidate readiness, then run exact same-child worker closure, settle changed tests, and run final smoke. A semantic target correction discovered after closure makes that attempt non-success and requires an otherwise eligible fresh attempt; byte-exact restoration of OMP-normalized config from its pre-smoke snapshot is mechanical cleanup, not a semantic correction. Return one Common Handoff with the exact seven-path target manifest, worker-closure result, smoke evidence, eval dispositions, protected identities, live-projection/residual-install status, and receiver `dev-implementation backend`.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-RECONCILE-BRIEF | Explicit invocation with a resolved or unresolved candidate, plus approval, correction, or approval-adjustment | Capability/readability preflight precedes exactly one brief; no dispatch/edit occurs first; plain approval starts the displayed binding; clear approval-adjustment starts once; ambiguous/corrective/unresolved input revises or waits without dispatch | TGT-RECONCILE-PORTABLE | T1 |
| AC-RECONCILE-PAIR | Approved readable candidate with available two-reviewer transport | Exactly two distinct persistent reviewer identities execute A initial, same-A normal-prompt `rethink`, B initial, same-B normal-prompt `rethink` in order; exactly those two follow-ups load existing `rethink`; initial responses use ordinary task results and complete finalized responses use only the supplied reviewer-to-Main channel; only post-rethink first-iteration responses can mutate; B receives A finalized and later passes receive the counterpart finalized response | TGT-RECONCILE-PORTABLE, TGT-RECONCILE-OMP | T1 |
| AC-RECONCILE-VERDICTS | Valid, actionable, blocked, raw `rethink`, duplicate, synonymous, qualified, multiple, or malformed reviewer replies | Exactly one line-1 `VALID`, `REVISE`, or `BLOCKED` with its complete matching reviewer/pass/identity/body template is accepted; raw `extend`, duplicate/malformed verdicts, and mismatched fields return to the same reviewer; main invents no correction | TGT-RECONCILE-PORTABLE | T1 |
| AC-RECONCILE-MUTATION | Finalized first/later `REVISE` in conversation or artifact mode | Main alone replaces the complete conversation candidate or edits only the approved artifact; every edit yields a new exact identity and native validation when available; supporting context and provisional responses never mutate | TGT-RECONCILE-PORTABLE | T1 |
| AC-RECONCILE-STOPS | Repeated identity, no-change revision, repeated frontier, lost persistent child/follow-up, unreadable context, authority conflict, or persistent `BLOCKED` | Workflow stops without `## Final proposal` or validity claim and returns rounds, last identity, exact blocker, and resumable frontier; progressive rounds continue without a fixed cap | TGT-RECONCILE-PORTABLE | T1 |
| AC-RECONCILE-REVALIDATION | A compatible editorial or semantic recommendation follows `VALID` | Editorial-only change is re-identified and recorded without counterpart review; every applied semantic change returns to the counterpart and cannot terminate until exact `VALID` binds the new identity | TGT-RECONCILE-PORTABLE | T1 |
| AC-RECONCILE-OUTPUT | Eligible success in conversation or artifact mode | Every pass appears in the ordered five-column rounds table; conversation output includes the complete final proposal; artifact output includes only concise change summary, exact locator, and current identity | TGT-RECONCILE-PORTABLE | T1 |
| AC-RECONCILE-PORTABLE | Complete portable package and semantic registry | Frontmatter is minimal/manual, the shared protocol is linked once, the response channel remains host-generic, and the T1 dev-implementation worker runs and assertion-grades exactly three unique behavior cases for ordering/freshness/stops; JSON parse/inventory are structural only; portable files contain no host/provider/dotfiles/core-workflow runtime dependency or duplicated controller/audit machinery | TGT-RECONCILE-PORTABLE, TGT-RECONCILE-PRESERVATION | T1 |
| AC-RECONCILE-OMP | Current OMP config plus two thin wrappers in a fresh disposable project overlay | Exact agent names resolve through exact role selectors with no fallback; declared data tools are exactly read/grep/glob while injected `yield`/`hub` are recorded; A/B child IDs differ, each rethink reuses its own ID and loads existing `rethink`; each Main-requested finalized/correction pass produces exactly one reviewer `hub send` only to Main containing the complete outer response, with no reviewer peer read/message, await, loop control, dispatch, or mutation; bootstrap contains exactly the two new default-profile agent mappings | TGT-RECONCILE-OMP, TGT-RECONCILE-BOOTSTRAP | T1 |
| AC-RECONCILE-PRESERVE | Complete final target, pre-existing user work, and disclosed live projections | Exactly seven semantic repository files remain byte-exact at the R7 target; config/bootstrap constructive baselines, symlink projections, live-wrapper absence, and protected hashes match; smoke writes only exact smoke/daemon/session state and admitted DB rows, including exact-session-bound live-window `session:sticky`; credential payload hashes/lengths remain unchanged; zero Mnemopi/extension/repository/other-home/Grok/core/manifest/staged/shipping effect occurs | TGT-RECONCILE-OMP, TGT-RECONCILE-BOOTSTRAP, TGT-RECONCILE-PRESERVATION | T1 |

## Verification / Done criteria

- [x] VR-RECONCILE-BRIEF. Exercise the manual gate before transport
  - Criterion: AC-RECONCILE-BRIEF
  - Proof class: worker smoke
  - Scenario / environment / fixture: Confirm `/Users/kim/.local/bin/omp` reports exact v18.0.11. Build the disposable overlay and exact `memory.backend: off` isolation file from T1 step 10. Launch a fresh hub-managed process through that exact binary with final repository config first, isolation config second, `--cwd {smoke-root} --add-dir /Users/kim/.dotfiles --no-extensions --session-dir {smoke-root}/sessions --skills=reconcile,rethink`. Invoke `/skill:reconcile` once with no identifiable candidate and once with a named conversation candidate. Before approval, inspect process/task activity; then send one ambiguous correction and one unambiguous `approve — {adjustments}`.
  - Evidence form: Exact brief bytes for both modes, zero pre-approval child dispatches/mutations, one revised-wait trace, one single-gate start trace, and no Mnemopi/extension write in the immediate before/after manifests.
  - Target recheck: TGT-RECONCILE-PORTABLE
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-PAIR. Drive the mandatory persistent-reviewer sequence
  - Criterion: AC-RECONCILE-PAIR
  - Proof class: worker smoke
  - Scenario / environment / fixture: In the approved OMP v18.0.11 conversation-mode live smoke, use a self-contained no-change candidate and inspect raw parent task/hub plus child read traces. Require exactly one A spawn and ordinary initial result, a normal-prompt same-A follow-up that reads/loads existing `rethink` and returns one complete post-rethink response through the supplied channel, then exactly one B spawn and ordinary initial result followed by the same B follow-up/channel sequence; record all four outer responses and candidate identities, and require no later `rethink` load.
  - Evidence form: Ordered event trace with two distinct child IDs, two same-ID normal-prompt follow-ups, exactly two `skill://rethink` load/content events bound to the protected skill bytes, exactly two finalized reviewer-to-Main response sends for the no-change first iteration, provisional rows marked superseded, no provisional mutation, no reviewer-to-reviewer or unsolicited message, no later load, and B post-rethink as the first possible terminal row.
  - Target recheck: TGT-RECONCILE-PORTABLE, TGT-RECONCILE-OMP
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-VERDICTS. Run exact verdict grammar cases
  - Criterion: AC-RECONCILE-VERDICTS
  - Proof class: worker smoke
  - Scenario / environment / fixture: The T1 dev-implementation worker runs `REC-VERDICT-PROGRESS-STOPS` as one fresh read-only semantic simulation with the exact final skill/protocol and grades every listed assertion. Cover all complete positive templates plus duplicate verdict, raw `extend`, lowercase, synonym, qualified, multiple, missing-field, wrong-reviewer, wrong-pass, and stale-identity near misses.
  - Evidence form: Simulation output plus worker-graded assertion matrix showing only one line-1 exact verdict and its complete matching body are admitted; every malformed response returns to the same child without candidate mutation.
  - Target recheck: TGT-RECONCILE-PORTABLE
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-MUTATION. Exercise bounded artifact revision and identity refresh
  - Criterion: AC-RECONCILE-MUTATION
  - Proof class: worker smoke
  - Scenario / environment / fixture: Under the exact OMP v18.0.11 live environment, create one disposable candidate file outside the repository inside the approved smoke root and one read-only supporting-context file. Invoke artifact mode with an explicit constraint that the candidate violates, approve, allow only a finalized post-rethink/later `REVISE`, and compare complete before/after bytes and SHA-256 identities. Use `--add-dir` for only that disposable root.
  - Evidence form: Candidate old/new locator-digest pair, exact bounded diff matching the finalized correction, unchanged supporting-context hash, reviewer histories with no mutation tool, and artifact-mode final summary/path/current identity without full-file duplication.
  - Target recheck: TGT-RECONCILE-PORTABLE
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-STOPS. Prove progress-based convergence stops
  - Criterion: AC-RECONCILE-STOPS
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `REC-VERDICT-PROGRESS-STOPS` against the exact final portable package. Include unchanged `REVISE`, repeated identity/reviewer pair, repeated frontier, persistent `BLOCKED`, unreadable locator, lost same-child transport, authority conflict, and more than four genuinely progressive passes.
  - Evidence form: Stop/progress matrix with no fixed cap, no false final proposal/validity on any stop, and exact last identity/blocker/resume frontier.
  - Target recheck: TGT-RECONCILE-PORTABLE
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-REVALIDATION. Reject stale validity after semantic change
  - Criterion: AC-RECONCILE-REVALIDATION
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run the exact final `REC-SEMANTIC-REVALIDATION` prompt, whose opening pure-simulator instructions state that this is not a live invocation, forbid production preflight/repository inference/brief/approval, supply fixture identities/transport/events, and require both branches completely. The single run contains A finalized `VALID` on R1, B provisional then finalized `REVISE`, main-owned R2, later counterpart validation, and one editorial-only recommendation. Require every semantic edit to change identity and invalidate old verdicts; distinguish editorial-only terminal handling. No hidden wrapper or retry.
  - Evidence form: Revision/verdict matrix proving terminal success only on current-identity validity, counterpart revalidation after semantic change, and direct recorded terminal handling only for editorial change.
  - Target recheck: TGT-RECONCILE-PORTABLE
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-OUTPUT. Verify rounds-first success and stop surfaces
  - Criterion: AC-RECONCILE-OUTPUT
  - Proof class: worker smoke
  - Scenario / environment / fixture: Inspect the OMP v18.0.11 conversation live run, disposable artifact live run, and one semantic stop run. Require the exact five-column table first and every actual pass in order; compare mode-specific terminal sections and identities.
  - Evidence form: Three output captures showing complete conversation proposal, concise artifact summary/locator/identity, and stopped identity/blocker/frontier with no `## Final proposal`.
  - Target recheck: TGT-RECONCILE-PORTABLE
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-PORTABLE. Validate package structure and semantic eval value
  - Criterion: AC-RECONCILE-PORTABLE
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, run `PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/reconcile/evals/evals.json` as syntax-only proof, assert the exact three-file package/minimal frontmatter, and confirm eval SHA-256 `941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7`. Run three separate capture-only `completion()` steps, one per exact complete registry prompt; each must seal exact UTF-8 output bytes and digest before returning. Grade each sealed artifact later in a separate step. No hidden wrapper, retry, or source change.
  - Evidence form: Zero-exit JSON/frontmatter/inventory structural checks explicitly labeled non-runs, three separate grader reports with complete assertion pass/fail and `keep` dispositions plus unique plausible bugs, one direct protocol link, and zero forbidden active dependencies.
  - Target recheck: TGT-RECONCILE-PORTABLE, TGT-RECONCILE-PRESERVATION
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-OMP. Resolve the exact OMP agents, roles, models, persistence, and tools
  - Criterion: AC-RECONCILE-OMP
  - Proof class: worker smoke
  - Scenario / environment / fixture: Confirm `/Users/kim/.local/bin/omp` reports exact v18.0.11; query final model roles, run `bash -n .config/scripts/bootstrap`, and parse both final agent frontmatters. Build the disposable overlay, snapshot owned config, then launch one fresh hub-managed smoke under the exact sandbox with final repository config first, isolation config second, `--cwd {smoke-root} --add-dir /Users/kim/.dotfiles --no-extensions --session-dir {smoke-root}/sessions --skills=reconcile,rethink`. Do not use `--no-session`, alter `PI_CODING_AGENT_DIR`, install, or change live profile/runtime/tool source. Before stopping, retain and hash exact parent/A/B trace bytes from the smoke-root session tree; then prove process exit and remove the whole absent-before smoke root.
  - Evidence form: Exact two role/value rows, wrapper names/models, declared data tools exactly read/grep/glob, injected `yield`/`hub` inventory, exactly two bootstrap rows, no project shadow/override, A/B exact models with fallback false, two distinct child IDs, exactly two same-ID normal-prompt follow-ups, exactly two bound `skill://rethink` load/content events and no later load, ordinary initial results, exactly two finalized reviewer `hub send` calls to Main with complete outer-response-only payloads, and zero forbidden reviewer operations. Every claim binds to a hash-sealed parent/A/B trace retained from `{smoke-root}/sessions` before cleanup; UI-only inference is insufficient.
  - Target recheck: TGT-RECONCILE-OMP, TGT-RECONCILE-BOOTSTRAP
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-PRESERVE. Recheck exact repository and external-effect boundaries
  - Criterion: AC-RECONCILE-PRESERVE
  - Proof class: worker smoke
  - Scenario / environment / fixture: Require protected digest `59717ed223eec3775b949250ed4980edea9230fd367e848f13381637c5241683`, constructive baselines, final target `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e`, exact projections, and absent live wrappers. Use unchanged smoke-root/agent.db/daemon path exceptions and session storage below smoke root. Require unchanged credential payloads and exact row-level admission for provider usage cache/history, smoke command usage, bound-model performance, and exact-session-bound live-window `session:sticky`; reject unmatched rows/classes. Capture traces, stop/clean exact absent-before state, and recheck target/protected/staged/effect boundaries.
  - Evidence form: Exact protected/final target manifest; constructive config/bootstrap equality; unchanged user work; projections and absent wrappers; zero Mnemopi/extension/repository writes outside scope; exact admitted DB row receipts including parent/child identity and live-window binding for every `session:sticky` event; unchanged credential payload hashes/lengths; hash-sealed session traces; removed smoke/session/daemon state; zero staged/direct-home/Grok/core/manifest/shipping effect.
  - Target recheck: TGT-RECONCILE-OMP, TGT-RECONCILE-BOOTSTRAP, TGT-RECONCILE-PRESERVATION
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-RECONCILE-T1 | T1 | Exact seven-path target manifest, all VR receipts, three eval dispositions, protected identity, sandbox/daemon/database effect proof, disposable cleanup, and one Common Handoff | completed, blocked, authority-change-required, transport-unavailable | dev-implementation backend | One immutable Common Handoff under `dev-handoff`, carrying AUTH-RECONCILE-DESIGN through AUTH-RECONCILE-R5-DAEMON, task/attempt/target/criterion identities, worker closure, fresh smoke, changed-test dispositions, exact daemon/effect/cleanup evidence, papercut accounting, receiver, route-impact, and residuals for non-OMP hosts and uninstalled default-profile reviewer wrappers. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-RECONCILE-DRIFT | T1 | Exact seven-path final hashes, protected manifest, all authority revisions through R7, exact R6 A2 Handoff/evidence, and disposable-path absence | T1 | Target must remain `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e`. Any target/protected/version/path drift, project shadow, extra caller, wider messaging, or pre-existing smoke/daemon/session path returns `authority-change-required`; unrelated work remains untouched. | Exact revised plan approved; identities/paths match; OMP reports v18.0.11. |
| BLK-RECONCILE-TRANSPORT | dev-implementation backend | Current Orchestrator Role Profile and `assess-plan-backed` result | T1 | Missing or non-equivalent plan-backed full orchestration cannot downgrade this approved plan. | Fresh assessment returns `full-orchestration` with `downgrade: none`. |
| BLK-RECONCILE-OMP | T1 | Exact OMP v18.0.11 identity, fresh disposable-project discovery, retained smoke-root parent/A/B trace bytes, raw task/finalized responses, child identity, model resolution/fallback, and tool-boundary evidence | T1 | Missing exact runtime/agent/role/model, persistent child, same-child continuation, complete response transport, or hash-sealed exact trace is `transport-unavailable`; no UI inference, substitute, one-agent emulation, fresh-child replacement, install, runtime/tool/profile change, or fallback selector is permitted. | Exact v18.0.11 and both bindings complete; required trace bytes are retained under the smoke root before stop, sealed into immutable evidence, then disposable state is removed. |
| BLK-RECONCILE-SMOKE | T1 | Failing VR, exact target/runtime, sandbox/session profile, sealed semantic outputs, DB row deltas, expected/observed behavior, and concurrent manifests | T1 | After closure do not edit target, retry a semantic call, grade unsealed output, add hidden wrapper, change models, relax sandbox paths, or manually mutate DB. Cleanup is mechanical only. | Every VR passes on unchanged R7 target with three one-shot outputs sealed before grading, only admitted DB classes including exact-session-bound live-window sticky rows, exact traces, and verified cleanup; otherwise return blocker unchanged. |
| BLK-RECONCILE-AUTHORITY | T1 | Exact requested decision and conflict with active authority through AUTH-RECONCILE-R7-FINALIZATION | T1 | Any semantic target change, different OMP version/model, added path/table/row class, unmatched sticky admission, credential payload change, install/runtime/tool/profile/bootstrap/live-wrapper change, wider messaging, core workflow/controller/persistence change, or wider acceptance needs new human authority and material reapproval. | New approved authority plus parser-valid revised plan; otherwise exact R7 target/effect/capture boundary remains fixed. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-RECONCILE-AUTHORITY | Human-confirmed base design, plan-body revision, response-channel exception, OMP rebind, eval/isolation repair, and exact daemon exception | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T10-06-59-070Z_01a04cfc-9dfe-72ac-bec0-4bff0eb8a743/local/reconcile-workflow-final-handoff.md@sha256:8ab737150a338c4a1f654c99f2087e78effb3bd65c5d434b5d79ba9f2220890c`; `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T11-11-46-184Z_01a04d37-ee08-74e3-9c28-1c28497a973a/local/reconcile-plan-final-revision-handoff.md@sha256:520aed2e27a8b7eec090449668962846101d884cfecfd0e023d9e27504b6a156`; `local://reconcile-hub-response-authority.json@sha256:997a0d5f57139cadd95f054474ab852ce9bd75ada5a2745ca9d42e78385dab8d`; `local://reconcile-omp-v1811-authority.json@sha256:208756b5b47e6a8436388d38e5c3eb01758c9f6221ea1dccd2a9ae96f8383c23`; `local://reconcile-r4-eval-isolation-authority.json@sha256:4d0558c08ba93b194634a0b2449d99505ea1e88a97bbf84a8f48f7133d88af14`; `local://reconcile-r5-daemon-authority.json@sha256:b0263fee3f6d77a91fdaa08156e0a01657b1f7135c0704ee2720c24cb710db0e` | Exact current authority `AUTH-RECONCILE-20260830-R5`: unchanged target plus one ephemeral daemon subtree for isolated live proof. R6 repair authority: `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-r6-repair-authority.json@sha256:b5034a2011e2435f19bd5bb55abc8b54aaa1a36f398454fa59f5110421d5bef7`. R7 finalization authority: `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-29T12-36-04-938Z_01a04d85-1eca-7792-8841-1283829cbd6c/local/reconcile-r7-finalization-authority.json@sha256:57c7d16875cbc43326bc8213c7aa9a60b9aa6f2685ed373c0b6adaa535c0ede3`. |
| ANC-RECONCILE-AUTHORING | Skill authoring pattern | `.config/agents/skills/craft-skill/SKILL.md@sha256:16a357847b738007066cb9a075dbd3f1168e62c56834a81c982c9a84a33ed611`; `.config/agents/skills/rethink/SKILL.md@sha256:dd1e035e520434536621f26cacafeb9572f35df7b1e21200064ee4b6d96aeb36` | Minimal manual frontmatter, thin package, direct reference, and mandatory inner rethink discipline. |
| ANC-RECONCILE-OMP | OMP binding pattern and exact installed proof environment | `.config/agents/harnesses/omp/agents/test-audit-opinion-a.md`; `.config/agents/harnesses/omp/agents/test-audit-opinion-b.md`; `.config/agents/harnesses/omp/config.yml`; `/Users/kim/.local/bin/omp` v18.0.11 | Exact custom-agent frontmatter, role map, read-only source tools, model resolution, and live task/hub smoke shape; compatibility is established only by current recipe proof. |
| ANC-RECONCILE-BOOTSTRAP | Installation pattern | `.config/scripts/bootstrap#SYMLINKS` | Two additive default-profile agent mappings while preserving backup-before-overwrite behavior; the script itself is never executed for smoke. |
| ANC-RECONCILE-PLAN | Parser and launch contract | `.config/agents/skills/dev-implementation/scripts/executor_plan.py validate PLAN`; `rule://plan`; `rule://plan-impl-spec`; `rule://plan-omp-transport` | Validate exact active repository plan and require full/no-downgrade child execution. |

- ASM-RECONCILE-LIVE-CONFIG: `~/.agents` resolves to `/Users/kim/.dotfiles/.config/agents`, `~/.omp/agent/config.yml` resolves to the repository OMP config, and live `~/.omp/agent/agents/second-opinion-*.md` is absent. Consequence: the approved repository edits immediately project the skill and role rows, but not the reviewer wrappers. Fallback: smoke through the disposable project overlay, do not write live paths or execute bootstrap, and report the default-profile dispatch residual; if live installation becomes required, return BLK-RECONCILE-AUTHORITY.
- ASM-RECONCILE-HUB-RESPONSE: R5 live behavior proved the reviewer sequence and mode outputs, but final A2 lost complete fresh child histories after `--no-session` cleanup. Consequence: R6 replaces only proof retention with `--session-dir {smoke-root}/sessions`, captures and hash-seals exact parent/A/B trace bytes before stop, and still removes all absent-before smoke state. Fallback: missing exact trace, identity, load/send, or forbidden-operation evidence returns BLK-RECONCILE-OMP without UI inference.
- ASM-RECONCILE-PROVIDERS: R6 A2 proved credential payload hashes/lengths can remain unchanged and that 17 `session:sticky` events repeat as native saved-session operations. Consequence: R7 admits sticky events only when key/value binds to exact smoke parent/reviewer child IDs and event timing is inside the live window, while retaining every prior operational-row and credential bound. Fallback: unmatched sticky, payload change, other class/path, or manual DB mutation returns BLK-RECONCILE-SMOKE.
- ASM-RECONCILE-DAEMON: R4 proved OMP v18.0.11 attempts `mkdir /Users/kim/.omp/run/daemons/6ba95a22da8dffb4` before TUI when exact smoke root `/private/var/folders/z6/yrrqx1_s4vv57r21kc48yz3c0000gn/T/reconcile-r4-smoke-fbvfb_15` is used; both paths are absent before R5. Consequence: recreate only that smoke root, allow only that daemon subtree, snapshot contents, stop the process tree, and remove only smoke-created residue. Fallback: any different daemon hash/path, pre-existing state, additional home write, live descendant/client, or cleanup uncertainty returns BLK-RECONCILE-AUTHORITY/SMOKE without broadening.
- ASM-RECONCILE-R6-FIXTURE: Final R5 A2 proved the prior semantic prompt could still trigger production preflight. Consequence: only the exact `REC-SEMANTIC-REVALIDATION` prompt changes to the pure-simulator fixture at `sha256:941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7`; production skill/protocol behavior and all assertions remain exact. Fallback: any branch still unexecuted in its single fresh run blocks without retry or hidden wrapper.
- ASM-RECONCILE-R7-CAPTURE: R6 A2 completed one semantic call but lost its result to a caller TypeError before persistence. Consequence: R7 runs each call in a dedicated capture-only step that seals exact UTF-8 bytes/digest before any separate grader reads them. Fallback: no sealed artifact means failed one-shot with no retry; prior-generation output cannot substitute.

## Completion Summary

- Outcome: The portable manual `reconcile` skill, shared reviewer protocol, exact three-case semantic registry, two OMP reviewer bindings, model-role rows, and bootstrap mappings implement the approved two-reviewer refinement workflow. All ten acceptance recipes passed on the unchanged R7 target.
- Material findings and decisions: R7 preserved every semantic target byte, sealed each of three one-shot semantic completions before separate grading, and admitted only exact-session-bound live-window `session:sticky` events. Worker closure found no correction; all three permanent evals remain `keep`; post-Handoff papercut accounting found no qualifying candidate and accessed no ledger.
- Immutable evidence: Common Handoff `local://reconcile-t1-r7-common-handoff.md@sha256:a215350134d8df0aecf9463ba4a59b79a114d696ad417dbb56900694286ce1ab`; aggregate proof `local://reconcile-t1-r7-proof-receipts.json@sha256:d6afc52d8fdc853109c90827485cdf37ad8262367c70cb52b5639b436adb675c`; semantic proof `local://reconcile-t1-r7-semantic-grades.json@sha256:a6dc587c5d64cae8ab0df93c34caa8352367d5cdcf5c75f8d079ae441f4a6cf4`; live trace `local://reconcile-t1-r7-trace-receipt.json@sha256:36e05433bf3cbb05b9f784f8bc3817eeee44e4b386847665310db0401c3abd2f`; effect proof `local://reconcile-t1-r7-db-effects.json@sha256:16b3eb31df039748c5516963e994493dcc9ead342b2ae5a5df2b0816c3e18962`; cleanup boundary `local://reconcile-t1-r7-boundary-receipt.json@sha256:3c953aba71c086beb43396711728c973a026a148c52ba2d5eaab987b3b6ca2ad`.
- Target manifest: Exact seven-path canonical compact-pair identity `sha256:6b9b91dd4159718266347e08593502f1c0a76e73f35841ca33020038d7676e7e`; protected aggregate `sha256:59717ed223eec3775b949250ed4980edea9230fd367e848f13381637c5241683`.
- Residual risk: Live default-profile `~/.omp/agent/agents/second-opinion-*.md` wrappers remain intentionally uninstalled, so direct default-profile dispatch requires separately authorized bootstrap installation. The portable protocol is structurally host-generic, but only the OMP v18.0.11 binding was exercised.
- Delivery: No staging, commit, push, review request, release, deploy, rollout, bootstrap execution, live-wrapper installation, runtime/profile/model change, or shipping effect occurred; shipping remains unauthorized.
