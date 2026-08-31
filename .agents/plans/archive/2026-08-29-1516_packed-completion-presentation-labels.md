# Packed Completion-Presentation Labels

**Datetime**: 2026-08-29-1516
**Mode**: implementation
**Scope**: Completion-presentation renderer grammar, synchronized D27/workflow projections, valid goldens, and the one affected caller scan guard
**Summary**: Replace the current hanging completed-report layout with the frozen packed bold-label and child-bullet grammar. Preserve the twelve-key input fence, all fields and caller bytes, visible Handoff, every durability/transport/control/shipping/Next stop, and the single-renderer boundary.
**Status**: DONE
**Completed At**: 2026-08-29-1550

## Objective

- Outcome: OUT-PACKED-01
- Observable end state: Every valid compact, standard, product, custom, and bounded completion fixture renders the same three sections with packed `**Label**` rows and one `- ` child bullet per scalar or array item; D27, the presenter, workflow projections, and the closed caller guard describe that exact grammar without changing input or lifecycle authority.
- Progress signal: One named AC-PACKED criterion passes on the exact target, or one named BLK-PACKED blocker is resolved. Rewording unrelated workflow policy, adding compatibility output, or changing caller values is not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-PACKED-HUMAN | Human-confirmed final renderer revision | `in-conversation` | `sha256:829a5149f24f2f6069dca8c8db09dbe8e1cc34f028fe2bb1d5001924fd337ba6` | Highest authority for the renderer-only packed-label cutover, exact grammar, preservation boundary, acceptance, compact work-only shape, and no shipping; no decision frontier remains. |
| AUTH-PACKED-BASE | Current repository baseline | `git:e6df2b7a31dfdd647a611920c8650652899e55bd` | Exact per-target SHA-256 identities in the Target map | Execution starts only from these target bytes. The unrelated existing modification to `.config/agents/harnesses/omp/config.yml` is user-owned and excluded from every effect. |
| AUTH-PACKED-D27 | Active completion-renderer authority | `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md` | D27 at SHA-256 `a0dad54405e7d21e3bcd7a70200964b1bfe9970a0e50f96e4b92ccd4d9bd98d4` before this authorized reopening | Reopen only D27's renderer grammar, verification expectations, Updated date, and 2026-08-29 human-authority evidence. |
| AUTH-PACKED-PRESERVE | Existing compact field-list and discovery authority | `docs/adr/0001-dev-workflow-authority-and-routing.md#d18--compact-approval-and-completion-presentation`; `docs/adr/INDEX.md` | SHA-256 respectively `a4406b0cdf28c93fc5801ba3eb17e8073c6fafe0e4fa95a8214242387da77978`, `1a3614b79cc58f269a136333e9ccbc8f3c93b22e2084c32abb7c9cd3a5284199` | Preserve both files byte-for-byte; D18 owns the unchanged sections and fields, not the superseded hanging whitespace. |

Authority precedence is AUTH-PACKED-HUMAN, then the active D27 and preserved D18 authority, then current executable projections. The frozen human revision supersedes only the 2026-08-27 hanging renderer grammar; it does not reopen input, completion, transport, durability, lifecycle, or shipping authority.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-PACKED-GRAMMAR | AUTH-PACKED-HUMAN | EFF-PACKED-CUTOVER renders only `## Completed`, `## Evidence`, and `## Continuation`; places no blank line after an H2; renders every field label as `**Label**` with no colon or leading hyphen; places no blank line between a label and its first child or between fields; and places exactly one blank line before `## Evidence` and `## Continuation`. |
| DEC-PACKED-CHILDREN | AUTH-PACKED-HUMAN | EFF-PACKED-CUTOVER renders every caller scalar as one line beginning with the exact `- ` prefix and every array item as one consecutive line with that same prefix. Empty `papercuts` is exactly `- none`; State is exactly `- complete; no open frontier.`; final Next ends at EOF without a trailing newline or blank line. |
| DEC-PACKED-BYTES | AUTH-PACKED-HUMAN | Removing exactly the leading `- ` from each caller-owned child recovers the original value byte-for-byte. No trim, normalization, wrapping, link generation, punctuation change, code-span change, or CommonMark spacing concession is allowed. |
| DEC-PACKED-PRESERVE | AUTH-PACKED-HUMAN; AUTH-PACKED-PRESERVE | Preserve the ordered twelve-key fence, all three H2 sections and twelve visible fields, visible Handoff, caller locators/enums/punctuation/constraints, D18, Completion Summary durability, Handoff transport, control-code rejection, shipping/Next authorization, and specialty-owned non-success reports. |
| DEC-PACKED-CUTOVER | AUTH-PACKED-HUMAN | Update the sole renderer, six valid golden pairs, D27, two workflow projections, and the one closed-scan label guard atomically. Reject the legacy hanging shape; add no compatibility reader, second renderer, `Changed` label, exposed fence, hidden Handoff, host adapter, or repository-specific staging behavior. |
| DEC-PACKED-MARKDOWN | AUTH-PACKED-HUMAN | Some Markdown parsers may treat a following `**Label**` as lazy continuation of the preceding list. Preserve that disclosed residual risk; do not add blank lines or another workaround without new human authority. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-PACKED-HUMAN; every mutable and preserved target below; the six valid and one stop presenter evals; live completion callers, rules, and eval guards included in the closed scan; current plan identity and final work Handoff.
- Change surfaces: TGT-PACKED-PRESENTER, TGT-PACKED-AUTHORITY, TGT-PACKED-PROJECTIONS, TGT-PACKED-SCANNER, and ordinary lifecycle bookkeeping for this plan.
- Non-goals: changing fence keys/order/types/cardinalities; changing field names/order or hiding State/Handoff; changing durability, transport, controls, shipping, Next, completion, papercut, learning, or specialty ownership; changing D18 or the ADR index; adding CommonMark blank lines, a compatibility path, a host adapter, or a permanent generator.
- Prohibited effects: mutation outside the declared change surfaces, including `.config/agents/harnesses/omp/config.yml`; direct edits to the Grok mirror instead of the `.config` source; staging, commit, push, review request, release, deploy, rollout, branch/history mutation, credential changes, external product/service mutation, or extra OMP/Grok renderer-smoke model calls beyond the approved plan-backed implementation child.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-PACKED-CUTOVER | Repository mutation | AUTH-PACKED-HUMAN | T1 may change only the six files in TGT-PACKED-PRESENTER, TGT-PACKED-AUTHORITY, TGT-PACKED-PROJECTIONS, and TGT-PACKED-SCANNER on their exact current bytes; reversible before separately authorized delivery. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-PACKED-INPUT | `completion-presentation-input` | T1 | Exact current twelve-key fence at AUTH-PACKED-HUMAN | T1 |
| CONTRACT-PACKED-OUTPUT | Completed report grammar | T1 | DEC-PACKED-GRAMMAR, DEC-PACKED-CHILDREN, DEC-PACKED-BYTES | T1 |
| CONTRACT-PACKED-PRESERVATION | Completion and continuation authority | T1 | DEC-PACKED-PRESERVE | T1 |
| CONTRACT-PACKED-EVALS | Presenter eval inventory and caller bytes | T1 | Ordered eval-ID digest `5e71e7353387ecc0b73c969040091c5038da593a8a46a2cad05902542d31ad85`; six raw fenced-input manifest digest `81a518004541cc28f741c89b61cf4f1e156af4ac1591f746225a88235b92f577`; six prompt-prefix manifest digest `cd0ba7df43e4f6e0799aea0f85c7d69205b75331cf19f6e20bc8a140365fc28f` | T1 |
| CONTRACT-PACKED-SCAN | Closed live caller result | T1 | Current scan finds no valid-output golden outside presenter evals; the only external old-label assertion is `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` at current lines 1592–1593 | T1 |

`CONTRACT-PACKED-OUTPUT` maps fields exactly as follows: Completed owns Outcome, Change scope, Key artifacts; Evidence owns Verification, Papercuts, Learning, Residual risk; Continuation owns State, Resume from, Handoff, Constraints, Next. `status` is selector-only and never renders.

For each section, emit the H2 line, then each label and its children consecutively. Join fields inside a section with one newline and join sections with exactly two newline bytes. This yields no blank line after an H2, label, or field; exactly one blank line before the next H2; and no terminal newline.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-PACKED-PRESENTER | `.config/agents/skills/completion-presentation/SKILL.md`; `.config/agents/skills/completion-presentation/evals/evals.json` | T1 | SHA-256 respectively `ed33a7d039846e2f99a8d5df52e4f4f81b6b0b262d66ec77b417e8d56e1ebc57`, `5ee17d07ef33a7284b14ab77ea0c3dd5d17b3741dee6cccbdaa111f0e19acf01` | Mechanical template; compact and standard bound examples; `CP-COMPACT-COMPLETE`, `CP-STANDARD-NO-DURABLE`, `CP-STANDARD-CURATED-PAPERCUT`, `CP-PRODUCT-COMPLETE`, `CP-CUSTOM-COMPLETE`, `CP-BOUNDED-PROJECTION`, `CP-INCOMPLETE-STOP` | AC-PACKED-GRAMMAR, AC-PACKED-BYTES, AC-PACKED-SPECIALS, AC-PACKED-STOPS, AC-PACKED-AUTHORITY, AC-PACKED-PRESERVE, AC-PACKED-SCAN |
| TGT-PACKED-AUTHORITY | `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md` | T1 | SHA-256 `a0dad54405e7d21e3bcd7a70200964b1bfe9970a0e50f96e4b92ccd4d9bd98d4` | D27 decisions, Human authority, Verification expectations | AC-PACKED-AUTHORITY, AC-PACKED-SCAN |
| TGT-PACKED-PROJECTIONS | `.config/agents/skills/dev-ask/WORKFLOW.md`; `.config/agents/skills/dev-implementation/SKILL.md` | T1 | SHA-256 respectively `0c82eb18ddcda374272bb4ccd94086ed3c6be5ba29c3be38bc3bc501562178c6`, `a83d016d573eb557e9365dc17f731bc86e1efcf19bf0ce44604e9741f7814e0e` | Engineering completion projection and empty-papercuts description | AC-PACKED-AUTHORITY, AC-PACKED-SCAN |
| TGT-PACKED-SCANNER | `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` | T1 | SHA-256 `0f9ee703b098c3e156f001edde1d125bc2bede84ccf6605f91d31ae8d11669da` | `dwo_registry_contract_hits` completion-eval label checks | AC-PACKED-SCAN |
| TGT-PACKED-PRESERVATION | `docs/adr/0001-dev-workflow-authority-and-routing.md`; `docs/adr/INDEX.md`; unrelated `.config/agents/harnesses/omp/config.yml` worktree bytes | T1 | First two SHA-256 values respectively `a4406b0cdf28c93fc5801ba3eb17e8073c6fafe0e4fa95a8214242387da77978`, `1a3614b79cc58f269a136333e9ccbc8f3c93b22e2084c32abb7c9cd3a5284199`; user-owned file SHA-256 `0de2856aee823a389d650095d69e006a4651468c516c5db275be9526bc8286b9` and binary-diff SHA-256 `7b19f1d641eb9ba215ef046bd99d1005f131f27783dabcfc7e658fc46bc5768a` | D18/D13, focused decision index, pre-existing user work | AC-PACKED-PRESERVE |

## Execution policy

- Assurance: compact
- Topology: full-orchestration
- Max concurrency: 1
- Isolation: shared repository tree with exact target/effect ownership
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: One work task owns every mutable target. Any undeclared write, target overlap from another live task, or change to TGT-PACKED-PRESERVATION stops the child.
- Decomposition: Exactly one cohesive work task. It performs the renderer-only authority, skill, golden, projection, scanner, and smoke cutover; no numbered verification, review, learning, integration, audit, archive, presenter, or shipping task exists.
- Effect limit: EFF-PACKED-CUTOVER
- Orchestrator profile: `orchestrator-role-profile/v1`; the approved parser-valid plan launches through `full-orchestration` with a fresh T1 child and `downgrade: none`; `PROMOTE-SERIAL-DEFAULT` keeps runtime concurrency one.

## Tasks

- [x] T1. Cut over packed completion labels
  completed 2026-08-29-1550
  - Owner: dev-implementation worker
  - Intent: Make completed reports denser without changing caller-owned completion semantics.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-PACKED-PRESENTER, TGT-PACKED-AUTHORITY, TGT-PACKED-PROJECTIONS, TGT-PACKED-SCANNER, TGT-PACKED-PRESERVATION
  - Contracts: CONTRACT-PACKED-INPUT, CONTRACT-PACKED-OUTPUT, CONTRACT-PACKED-PRESERVATION, CONTRACT-PACKED-EVALS, CONTRACT-PACKED-SCAN
  - Criteria: AC-PACKED-GRAMMAR, AC-PACKED-BYTES, AC-PACKED-SPECIALS, AC-PACKED-STOPS, AC-PACKED-AUTHORITY, AC-PACKED-PRESERVE, AC-PACKED-SCAN
  - Effects: EFF-PACKED-CUTOVER
  - Output: OUTP-PACKED-T1
  - Receiver: dev-implementation backend
  - Verification: VR-PACKED-GRAMMAR, VR-PACKED-BYTES, VR-PACKED-SPECIALS, VR-PACKED-STOPS, VR-PACKED-AUTHORITY, VR-PACKED-PRESERVE, VR-PACKED-SCAN
  - Lineage: shared

### T1 implementation contract

1. Rehash every mutable and preserved target and rerun the exact closed scan before editing. Proceed only when all declared target bytes match and the old grammar remains confined to the named presenter, D27, two projections, and scanner label guard. Preserve the unrelated dirty OMP config. Any additional live caller golden/assertion or semantic target drift enters BLK-PACKED-DRIFT; do not broaden the target map.
2. In D27, set `**Updated:**` to `2026-08-29`; replace only the renderer-layout parts of current decision paragraphs 31–34; append one Human authority paragraph binding AUTH-PACKED-HUMAN and explicitly superseding only the 2026-08-27 hanging layout; and revise only the two layout-bearing Verification expectations currently at lines 83 and 85. Preserve the twelve-key decision, all other D27 decisions/evidence, D18, and the index.
3. In the presenter, leave `## Activation and authority`, `## Current fenced input`, field meanings, durability/transport/control validation, shipping/Next rules, and specialty ownership unchanged. Replace the hanging terminology and all renderer-owned grammar in `## Mechanical rendering`, its template, both bound examples, the nonempty-Papercuts explanatory sentence, and the stop sentence that names the exact hanging form. Encode DEC-PACKED-GRAMMAR and DEC-PACKED-CHILDREN literally; the compact example must equal the grammar shown in AUTH-PACKED-HUMAN.
4. Mechanically regenerate both copies of every valid golden in `evals.json`: parse the unchanged fenced JSON for the six valid IDs; render it with CONTRACT-PACKED-OUTPUT; assign that string to `expected_output`; and replace only the prompt suffix after the unique marker `Return the exact Markdown below byte-for-byte and nothing else:\n\n` with the same string. The renderer maps a scalar to one child, an array to ordered children, empty `papercuts` to `none`, and synthetic State to `complete; no open frontier.`; it joins fields with `\n`, sections with `\n\n`, and appends nothing after Next. Use an ephemeral generator only; add no repository script.
5. Update only grammar-bearing assertions: `CP-COMPACT-COMPLETE` assertions 2–4; `CP-STANDARD-NO-DURABLE` assertions 1–4; `CP-STANDARD-CURATED-PAPERCUT` assertions 1–5; `CP-PRODUCT-COMPLETE` assertions 1–3; `CP-CUSTOM-COMPLETE` assertions 1–3; and `CP-BOUNDED-PROJECTION` assertions 1–3. Make them assert label shape, child-bullet recovery, exact section spacing, empty Papercuts, State, visible Handoff, and EOF. Preserve every other valid assertion.
6. In `CP-INCOMPLETE-STOP`, replace only prompt phrase `old inline compatibility shape` with `legacy hanging compatibility shape` and assertion-5 phrase `inline compatibility output` with `legacy hanging compatibility output`; preserve its `expected_output`, assertions 1–4, every other prompt byte, and all durability/transport/control/shipping/Next/lifecycle stops.
7. In `dev-ask/WORKFLOW.md`, preserve the archive precondition, exact keys/cardinalities, invalid legacy inputs, and completion paragraph; replace only the final hanging-projection sentence with packed bold labels, one `- ` child per scalar/array item, `- none`, and packed State. In `dev-implementation/SKILL.md`, replace only the completion-normalization phrase that maps empty/nonempty papercuts to hanging output with the same packed child-bullet terms.
8. In `dwo_registry_contract_hits`, replace the two old `- **Change scope**` / `- **Key artifacts**` positive checks with exact packed checks requiring `\n**Change scope**\n- ` and `\n**Key artifacts**\n- ` and rejecting `\n- **Change scope**` and `\n- **Key artifacts**`. Do not change scanner schema, scan scope, unrelated needles, case inventory, comparator behavior, or preservation policy.
9. Run every VR-PACKED recipe on the complete T1 bytes. Repair only a directly evidenced violation within EFF-PACKED-CUTOVER, rerun impacted recipes, then return one Common Handoff with the exact changed-target SHA-256 manifest, observed outputs, `keep` dispositions for the six valid cases and stop case, no-new-case basis, preserved unrelated-work state, the disclosed lazy-continuation residual risk, and receiver `dev-implementation backend`.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-PACKED-GRAMMAR | Any of the six valid fenced inputs | Exactly three ordered H2s; twelve ordered `**Label**` rows; no blank after H2/label or between fields; exactly one blank before Evidence and Continuation; every value on a `- ` child; Next ends at EOF | TGT-PACKED-PRESENTER | T1 |
| AC-PACKED-BYTES | Every caller-owned scalar and array item in all six valid cases | Removing exactly `- ` recovers the unchanged fenced value byte-for-byte and in order, including raw Verification, Resume from, Handoff, punctuation, locators, constraints, and authorized Next | TGT-PACKED-PRESENTER | T1 |
| AC-PACKED-SPECIALS | Empty and nonempty Papercuts plus every valid specialty | Empty Papercuts is `- none`; State is `- complete; no open frontier.`; nonempty arrays are consecutive children; compact, standard, product, custom, and bounded outputs retain visible Handoff | TGT-PACKED-PRESENTER | T1 |
| AC-PACKED-STOPS | `CP-INCOMPLETE-STOP` and presenter stop clauses | Every existing durability, Handoff transport, unsafe-control, malformed/schema, shipping, Next, lifecycle, and non-success rejection remains effective; the legacy hanging/dual shape is rejected | TGT-PACKED-PRESENTER | T1 |
| AC-PACKED-AUTHORITY | D27, presenter, and two workflow projections on final bytes | All describe the same packed grammar and frozen preservation boundary; D27 records the exact 2026-08-29 human authority without reopening unrelated policy | TGT-PACKED-AUTHORITY, TGT-PACKED-PRESENTER, TGT-PACKED-PROJECTIONS | T1 |
| AC-PACKED-PRESERVE | Complete final target | No `Changed` label, exposed fence, compatibility renderer, value rewrite, hidden Handoff, added CommonMark spacing, D18/index edit, unrelated dirty-file edit, host adapter, external side effect beyond required plan execution, or shipping effect | TGT-PACKED-PRESENTER, TGT-PACKED-PRESERVATION | T1 |
| AC-PACKED-SCAN | Updated closed scanner and full live scan | The scanner accepts the packed presenter evals, rejects old label rows, and reports no stale live hanging projection or unowned caller-eval expectation | TGT-PACKED-PRESENTER, TGT-PACKED-AUTHORITY, TGT-PACKED-PROJECTIONS, TGT-PACKED-SCANNER | T1 |

## Verification / Done criteria

- [x] VR-PACKED-GRAMMAR. Recompute every valid golden from its fence
  - Criterion: AC-PACKED-GRAMMAR
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, parse the six valid cases in `.config/agents/skills/completion-presentation/evals/evals.json`, apply the exact CONTRACT-PACKED-OUTPUT algorithm, and compare generated bytes to both `expected_output` and the prompt suffix after the unique bound-golden marker. Use `CP-COMPACT-COMPLETE` as the end-to-end example: its Outcome label must be immediately followed by `- Ghostty's Cmd-K binding clears the terminal as intended.`, with no blank line, and its final bytes must be `**Next**\n- none` at EOF.
  - Evidence form: Six case IDs with two zero-byte diffs each, exact H2/label/spacing counts, and final-byte checks.
  - Target recheck: TGT-PACKED-PRESENTER
  - Receiver: dev-implementation backend
- [x] VR-PACKED-BYTES. Prove universal child recovery and frozen caller inputs
  - Criterion: AC-PACKED-BYTES
  - Proof class: worker smoke
  - Scenario / environment / fixture: Recompute the ordered eval-ID, raw fenced-input, and prompt-prefix manifests using the canonical compact JSON-list method used by CONTRACT-PACKED-EVALS; require exact digests `5e71e7353387ecc0b73c969040091c5038da593a8a46a2cad05902542d31ad85`, `81a518004541cc28f741c89b61cf4f1e156af4ac1591f746225a88235b92f577`, and `cd0ba7df43e4f6e0799aea0f85c7d69205b75331cf19f6e20bc8a140365fc28f`. For every caller item, strip exactly the first two bytes `- ` from its generated child and compare with the decoded fence string.
  - Evidence form: Three exact manifest digest matches plus a field/item recovery matrix for all six cases.
  - Target recheck: TGT-PACKED-PRESENTER
  - Receiver: dev-implementation backend
- [x] VR-PACKED-SPECIALS. Exercise specialty, Papercuts, State, and Handoff variants
  - Criterion: AC-PACKED-SPECIALS
  - Proof class: worker smoke
  - Scenario / environment / fixture: Inspect all six generated outputs: Compact and Standard No Durable require empty `- none`; Curated requires two consecutive Papercuts children; Product, Custom, and Bounded require one; every output requires exact State and one visible Handoff child equal to its fence value. Run `cmp .config/agents/skills/completion-presentation/SKILL.md .grok/skills/completion-presentation/SKILL.md` to confirm the existing local portable projection remains byte-identical without editing the mirror.
  - Evidence form: Six-case special-value/Handoff matrix and zero-exit byte comparison.
  - Target recheck: TGT-PACKED-PRESENTER
  - Receiver: dev-implementation backend
- [x] VR-PACKED-STOPS. Preserve invalid-input and lifecycle rejection
  - Criterion: AC-PACKED-STOPS
  - Proof class: worker smoke
  - Scenario / environment / fixture: Require `CP-INCOMPLETE-STOP.expected_output` SHA-256 `1b54e603bd31a0ddf5e7159bfb974195d2356989c39ad86612092690b7f38656`; require its final canonical compact-JSON object digest `ef1cd1c10670a8e288e20c6efab0f58113e335bccbcb0b34883c9f3d5de57d0c`; and inspect the unchanged presenter stop clauses for nested/control-bearing/Papercut-item cases not isolated by that registry row. No stop case may emit `## Completed` or create presenter lifecycle/effect state.
  - Evidence form: Two digest matches and one rejection matrix covering every named stop class.
  - Target recheck: TGT-PACKED-PRESENTER
  - Receiver: dev-implementation backend
- [x] VR-PACKED-AUTHORITY. Compare every active packed projection
  - Criterion: AC-PACKED-AUTHORITY
  - Proof class: worker smoke
  - Scenario / environment / fixture: Read D27 decisions, Human authority, Verification expectations, presenter Mechanical rendering, `dev-ask/WORKFLOW.md#handoff-papercuts-and-completion`, and the dev-implementation Completion paragraph on final bytes. Compare exact labels, child prefixes, blank-line rules, empty Papercuts, State, recovery, EOF, and preservation clauses; require no active occurrence of the superseded hanging terminology outside dated history or explicit legacy rejection.
  - Evidence form: Anchor-by-anchor agreement matrix tied to final file SHA-256 identities.
  - Target recheck: TGT-PACKED-AUTHORITY, TGT-PACKED-PRESENTER, TGT-PACKED-PROJECTIONS
  - Receiver: dev-implementation backend
- [x] VR-PACKED-PRESERVE. Recheck protected authority and repository effects
  - Criterion: AC-PACKED-PRESERVE
  - Proof class: worker smoke
  - Scenario / environment / fixture: Require SHA-256 `a4406b0cdf28c93fc5801ba3eb17e8073c6fafe0e4fa95a8214242387da77978` for ADR-0001 and `1a3614b79cc58f269a136333e9ccbc8f3c93b22e2084c32abb7c9cd3a5284199` for the ADR index; require the unrelated OMP config file SHA-256 `0de2856aee823a389d650095d69e006a4651468c516c5db275be9526bc8286b9` and binary-diff SHA-256 `7b19f1d641eb9ba215ef046bd99d1005f131f27783dabcfc7e658fc46bc5768a`; inspect the semantic changed-target manifest for exactly the six authorized source files, with active-plan lifecycle bookkeeping accounted separately and no staged/external effect.
  - Evidence form: Four protected digest matches, exact six-path semantic manifest, separately identified plan bookkeeping, and zero staged paths.
  - Target recheck: TGT-PACKED-PRESENTER, TGT-PACKED-PRESERVATION
  - Receiver: dev-implementation backend
- [x] VR-PACKED-SCAN. Validate JSON and the closed caller guard
  - Criterion: AC-PACKED-SCAN
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, run `python3 -m json.tool .config/agents/skills/completion-presentation/evals/evals.json`, `python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test`, and `python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py`. Then run a target-scoped closed search across live `.config/agents/skills`, `.config/agents/rules`, and `docs/adr` for exact old grammar tokens `- **Change scope**`, `- **Key artifacts**`, `two-space hanging`, `two leading spaces`, `uniform hanging`, and `exact hanging field list`; allow only dated supersession history and explicit legacy-rejection text.
  - Evidence form: Zero-exit JSON/scanner receipts and a finite classified old-token result with no unowned active hit.
  - Target recheck: TGT-PACKED-PRESENTER, TGT-PACKED-AUTHORITY, TGT-PACKED-PROJECTIONS, TGT-PACKED-SCANNER
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-PACKED-T1 | T1 | Exact six-path SHA-256 semantic target manifest, all VR-PACKED receipts, preserved-target identities, changed-eval dispositions, disclosed lazy-continuation residual risk, and one Common Handoff | completed, blocked, authority-change-required, transport-unavailable | dev-implementation backend | One immutable Common Handoff under `dev-handoff`, carrying AUTH-PACKED-HUMAN, task/attempt/target/criterion identities, worker closure, smoke, changed-test dispositions, papercut accounting, residual risk, exact receiver, and route-impact. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-PACKED-DRIFT | T1 | Exact current hashes plus semantic diff against the Target map and closed-scan result | T1 | Any mutable/preserved target drift or new live grammar-bearing caller is outside the approved exact target and returns `authority-change-required`; unrelated excluded work remains untouched. | A revised approved plan binds the changed target, or the original exact bytes/result are restored by their owner. |
| BLK-PACKED-TRANSPORT | dev-implementation backend | Current Orchestrator Role Profile and `assess-plan-backed` result | T1 | Missing or non-equivalent plan-backed full orchestration cannot downgrade this approved plan. | Fresh assessment returns `full-orchestration` with `downgrade: none`. |
| BLK-PACKED-SMOKE | T1 | Failing VR ID, exact target revision, expected/observed bytes, and causal finding | T1 | Repair is limited to EFF-PACKED-CUTOVER and the existing bounded attempt contract; no stop weakening or target expansion. | Every impacted VR passes on one exact final target, or the worker returns the blocker unchanged. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-PACKED-AUTHORITY | Human authority | `in-conversation sha256:829a5149f24f2f6069dca8c8db09dbe8e1cc34f028fe2bb1d5001924fd337ba6` | Sole source for exact packed grammar and preservation boundary. |
| ANC-PACKED-PRESENTER | Skill anchor | `.config/agents/skills/completion-presentation/SKILL.md#mechanical-rendering` | Single renderer implementation and bound examples. |
| ANC-PACKED-EVALS | Eval anchor | `.config/agents/skills/completion-presentation/evals/evals.json` | Six valid golden pairs and one preserved stop case. |
| ANC-PACKED-D27 | ADR anchor | `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md#d27--session-lifecycle-envelope-and-portable-workflow-owners` | Durable renderer decision, authority history, and verification expectations. |
| ANC-PACKED-WORKFLOW | Projection anchor | `.config/agents/skills/dev-ask/WORKFLOW.md#handoff-papercuts-and-completion`; `.config/agents/skills/dev-implementation/SKILL.md#completion` | Engineering projections that must stop naming the hanging form. |
| ANC-PACKED-SCAN | Guard anchor | `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`, function `dwo_registry_contract_hits` | Closed caller assertion that must recognize packed labels and reject old rows. |
| ANC-PACKED-PLAN | Parser and launch contract | `.config/agents/skills/dev-implementation/scripts/executor_plan.py validate PLAN`; `rule://plan`; `rule://plan-impl-spec`; `rule://plan-omp-transport` | Validate exact active repository plan and require full/no-downgrade plan execution. |

- Assumptions: none

## Completion Summary

- Outcome: The sole completion presenter, six valid paired goldens, D27, both engineering projections, and the closed scanner guard now implement the approved packed bold-label and `- ` child grammar while preserving the twelve-key input fence, all caller bytes, visible Handoff, and lifecycle/shipping stops.
- Material findings and decisions: T1 completed in one compact full-orchestration attempt; worker closure found no correction; all seven existing contract fixtures remain `keep`; no new case was warranted; post-Handoff papercut accounting found no candidate and accessed no ledger.
- Immutable evidence: `history://PackedLabelsT1#handoff-t1-cut-over-packed-completion-labels`; Task Contract `local://packed-completion-presentation-context-pack.json@sha256:2c3f3bb5a2119e6ecc76da0b1c7b9cbb88d2307cd896f09748c7c4c161237bbe`; `worker-closure/v1@sha256:bf469d783f0dd4b145aa633f8fa2c0fd235a4592e30021546fe8427454f0abfa`; `test-value/v1@sha256:7b38d135ea2801835c4d1562fd427ddb61ff053070bb29d5147a7b1ff606e790`; every VR-PACKED recipe passed on the final target.
- Target manifest: `history://PackedLabelsT1#handoff-t1-cut-over-packed-completion-labels` exact six-path final manifest, canonical compact-JSON SHA-256 `c00dcfe5cad12e8bc95b5960eb37ce4968603bc61258a4ddf8a35b5cbdc07e05`.
- Residual risk: Some Markdown parsers may treat a following `**Label**` as lazy continuation of the preceding list; AUTH-PACKED-HUMAN preserves this disclosed risk and authorizes no blank-line workaround.
- Delivery: No staged, commit, push, review-request, release, deploy, rollout, external-service, or shipping effect occurred; shipping remains not authorized.
