# Engineering Requirements Brief: Reconcile and Retrace production cutover to acpx + native `omp acp`

**Revision:** `reconcile-retrace-acp-production-requirements/v2`
**Supersedes:** `reconcile-retrace-acp-production-requirements/v1` (SHA-256 `1a38a35a1f34a7f792ffa461e312a10d75376e5fdb63c5235a468a0e39c99af7`). Only change: human answers to S1–S4 projected as confirmed requirements (2026-09-27), A5 static-check exemptions replaced by the confirmed S2 set, and the baseline updated with the matches that set now fails.
**Stage:** `dev-requirements` (approved route, standard assurance)
**Date:** 2026-09-27
**Repository:** `/Users/kim/.dotfiles` at HEAD `de06da2`

Notation: **[V]** = verbatim or near-verbatim projection of approved authority (no new confirmation needed). **[H]** = human-confirmed requirement, confirmed 2026-09-27 (answers to v1's S1–S4). Where the text quotes authority exactly, it is in quotation marks.

## Authority

### Governing artifacts (bound by SHA-256)

| Role | Path | SHA-256 |
|---|---|---|
| Approved request authority (route, decisions 1–6, user approval) | `local://prod/handoff-v1.md` (`/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-25T08-29-25-475Z_01a0d7af-0063-70ea-80be-c60baf3163e4/local/prod/handoff-v1.md`) | `c52f2222947be1ea7b01141b7020fe88810d31f7af48dec857f316a33ac2afd6` |
| Trial spec-v10 (carry-forward source, provenance otherwise) | `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-spec.md` | `d38f487721c78df7b53d41c31d4b5f37a3c31a699f0d196ee88192c1e0c956ba` |
| Lean spec-v2 (intent, keep lists, nine decisions; provenance otherwise) | `.agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md` | `376fd634f0c6c772252fe6929547a2d1bc0a5ba161477935a9cdaa7e1635fe51` |
| Trial decisions v8 (provenance) | `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-decision-evidence.md` | `561a35a1132f70779a592447b1ca7f32005fe9d123be52908ae84e2f1c812d84` |
| Permanent-test value rule named by the handoff | `.config/agents/skills/dev-implementation/references/test-value.md` | `42702a4ad007ae6a2d8f42c08d97de820e0d0a5e0b846509629de6e82f211f04` |

Precedence **[V]**: the handoff governs. "Older artifacts are provenance only." "If the trial state model conflicts with a kept skill semantic, the skill semantic wins and the state model is adapted." The lean-redesign plan is not followed and neither lean artifact is revised into the production spec.

### Approvals

- **Granted [V]:** first approval — route `dev-requirements → dev-specification → dev-ticketing → dev-implementation → dev-code-review → dev-verification → dev-continual-learning → completion-presentation`, standard assurance, decisions 1–6 with the recommended option each. User words: "approve. At the second approval, show the exact staged path list for the checkpoint commit (decision 4) before committing."
- **Still required [V]:**
  1. **Second approval** — SHA-256 of the written spec and plan, the checkpoint commit (with its exact staged path list shown first), and closing the lean plan. After it, execution to DONE needs no further go-ahead except the audit's two approvals.
  2. **Audit scope Route Overview** — the exact ordered `dev-test-audit` file list.
  3. **Fix-batch Route Overview** — the exact accepted batch.
- Human confirmation of v1's synthesized items S1–S4: **received 2026-09-27** (see "Confirmed human requirements").

### Settled human decisions (projected, not re-opened) [V]

1. **KB1 wording.** "Only the admitted, domain-valid native `yield` candidate counts as a reply. Task, hub, Eval, any other `yield`, ordinary output, transcripts, history, agent output and generic collectors never count and are never a fallback."
2. **Models.** At run time reviewer A uses `modelRoles.second_opinion_a`, reviewer B uses `modelRoles.second_opinion_b`, and a production scope evaluator uses reviewer A's model. No scope role is invented. The pair is not pinned in the controller.
3. **Version pins.** "Refuse to start unless `omp --version` reports 18.3.0 and acpx is exactly 0.19.2. A new version requires the offline suite and the live runs to pass on it first." No binary SHA pin.
4. **Checkpoint commit.** Before the first cutover edit, one local commit of every modified or untracked path under `.config/agents/` and `docs/adr/`, plus `.agents/papercuts.json`; staged with `./bin/dot-add .config/agents docs/adr .agents/papercuts.json` (stop and report if `dot-add` rejects a path); excludes `.config/cursor`, `.config/karabiner`, untracked plans and artifacts; subject `chore(agents): checkpoint lifecycle-plugin state before acp cutover`; body "Checkpoint only. It separates current dirty bytes from cutover edits. No verification is claimed. It includes the working-tree modelRoles rewrite and other in-flight edits named in the handoff."
5. **Close the lean plan.** After the checkpoint, one local commit adding only the unchanged lean spec (`376fd634…fe51`) and `.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md` with only its Status line changed to `**Status**: CLOSED`. Not DONE. No push.
6. **Test-audit scope.** Every permanent test file the cutover creates or keeps for the controller, plus `reconcile/evals/evals.json` and `retrace/evals/evals.json`. Excludes the frozen trial bundle, the deleted `lifecycle-plugin.test.js`, the unrelated `plan-artifact-sync.test.js`, and temporary live-run proof. Exact ordered list shown at the audit's own approval.

### Standing intent [V]

"Keep both skills' mechanics and semantics. Every other accumulated rule, ADR, contract, gate and proof mechanism may be revised or removed, and no backward compatibility is required." (lean spec L12)

## Observable behavior

### Normal behavior

- **B1 Reconcile, Conversation and Artifact modes [V].** Actor: a human (or Retrace, delegated) in a real OMP session invoking `reconcile`. The skill's root session collects the KR1 brief approval, then runs one Node CLI through bash with no tool deadline. The CLI drives reviewers A and B as native `omp acp` sessions through acpx 0.19.2 and prints the KR15 result (Review rounds / Final proposal) or the Reconcile stopped record on stdout.
- **B2 Retrace [V].** Actor: a human invoking `retrace`. The root session collects the KT2 complete-table approval, then runs the CLI once; the CLI drives scope evaluators and delegated Reconciles and prints the Retrace result (final aggregate) or the stop record on stdout.
- **B3 Reply admission [V, decision 1 + trial carry-forward].** Only the admitted, domain-valid native `yield` candidate is a reply. Submission uses tolerant domain validation; the reply keyword and required fields live inside the `yield` `data` ("No C5 text framing"). Observation uses `watchSession` journal windows and A1 C4 closure; recovery observes without resubmission; restore is same-session only.
- **B4 Identity [V].** The controller holds every revision-label identity (C1).
- **B5 Prompts [V].** The controller loads, at run time, the reviewer prompt from `reconcile/references/reviewer-protocol.md` and the Retrace scope prompt from inside the retrace skill. One editable copy each.
- **B6 Models [V].** Reviewer A = `modelRoles.second_opinion_a`, reviewer B = `modelRoles.second_opinion_b`, scope evaluator = A's model, read from config at run time.
- **B7 Isolation [V, trial carry-forward].** Each child launches with argv `--tools read,glob,grep,yield --no-extensions --no-skills --no-rules --no-lsp`, the overlay config, private HOME and TMPDIR, `PI_CODING_AGENT_DIR`, the direct-child session-folder rule, `mcpServers: []`, deny-all permissions, and the detect-after tool policy.
- **B8 Disposal [V].** A4 observed disposal: disposal counts only once process exit is observed (KS4); both reviewers are disposed at the end and a failed disposal blocks success (KR14).
- **B9 Nonterminal replies [V].** KS6's `terminal: false` exception for `source-need` and `scope-paused` is controller behavior; such replies return to the same step of the same scope (KT4).
- **B10 Budget [V].** No token or USD cap ends a live run. The standard `dev-implementation` attempt limit and `execution-recovery.md` keep repair loops finite. Spend is reported.

### Failure and boundary behavior

| Trigger | Observable response | Recovery boundary |
|---|---|---|
| `omp --version` ≠ 18.3.0 or acpx ≠ exactly 0.19.2 **[V]** | Refuse to start (no child launched); stop record on stdout | New version only after the offline suite and live runs pass on it |
| A prior run's `omp acp` PIDs or session folder remain **[V]** | Preflight refuses to start | Prior run disposed (existing disposal authority) |
| 4th invalid return for one original expectation **[V]** | Stop (3 re-asks per original expectation; "3, all current categories") | New invocation |
| KR13 identity-preserving repair situation **[V]** | Production behavior defined by spec; never "stop and start over"; nothing rolls back automatically; if a same-session resume cannot keep the reviewer identities, stop and ask | Human answer |
| Failed disposal **[V]** | Success blocked (KR14) | Stop record |
| Any other KR12 stop-list condition **[V]** | Reconcile stopped format (KR15) | Per KR12 |
| Non-admitted output (Task, hub, Eval, other `yield`, transcripts, history, agent output, collectors) **[V]** | Never counts, never a fallback | — |
| Batch member fails **[V]** | Successful siblings kept (KS5) | — |

No graceful fallback or compatibility path is authorized. Degraded behavior beyond the table: none authorized.

## Guards (the 29 kept IDs) [V]

Source: lean spec-v2 L55–92, with the handoff overlays noted. KS8 is **not** adopted.

- **Reconcile (16):** KR1 five-field brief, its approval, candidate order · KR2 Conversation replacement and Artifact edits · KR3 cap `none` or positive integer, counts committed applications, one closure-only iteration · KR4 A and B persistent, read-only, never replaced · KR5 A starts every outer iteration; B only when a REVISE needs a counterpart · KR6 initial → same-reviewer rethink → post-rethink on first real review; later skip rethink; `source-need` continues the pass and never repeats the rethink · KR7 VALID/REVISE/BLOCKED meanings; recommendations never applied · KR8 a REVISE is one complete replacement or one complete edit set against the unchanged outer base · KR9 negotiation ends at first VALID for the current label; BLOCKED gets one retry with approved context; no turn cap · KR10 at most one application per outer iteration, then re-read, count, validate, next iteration with A · KR11 artifact mode checks the file is unchanged before the final report · KR12 stop list minus the synchronization stop; invalid-return entries become the fourth invalid return · KR13 identity-preserving repair allowed; nothing rolls back automatically · KR14 both reviewers disposed at end; failed disposal blocks success · KR15 Review rounds, Final proposal, Reconcile stopped formats; controller never rewrites reviewer text · KR16 delegated use stays report-only.
- **Retrace (5):** KT1 invocation contract, finding eligibility, three entry types · KT2 normalized scope table, human approves the complete table incl. `requires`, shared-evidence and potential-conflict links · KT3 ≤4 direct actors, ordered by `requires` depth then authored order; a slot frees only when its actor is `disposed` · KT4 per-scope flow evaluate → `candidate-ready` → parent accepts → `begin-reconcile` → delegated Reconcile → dispose reviewers → `scope-result` → parent accepts → dispose scope and subtree; nonterminal `source-need`/`scope-paused` returns to the same step · KT5 the retrace sections listed at lean spec L78 left as written.
- **Both (1):** KB1 — wording replaced by decision 1.
- **Supervisor mechanics (7):** KS1 first reply kept, only the owning parent sees it · KS2 reply, turn result and reuse state separate · KS3 a request stays pending until reply, concrete terminal failure, or explicit abort · KS4 disposal counts only on observed process exit · KS5 a failed batch member keeps successful siblings · KS6 an actor disposes owned children before its terminal reply; `terminal: false` exception kept as controller behavior (C6 schema dropped) · KS7 D31 clause 9 verbatim: generic ADR-0002 collection contracts and generic execution-recovery policy stay unchanged, and their implementation-child exemptions do not replace or weaken the named custom-controller lifecycle contracts.

Count: 16 + 5 + 1 + 7 = **29**.

## Acceptance

Each criterion is falsifiable on the named surface. A1–A7 project the handoff "Checks" one-to-one; A8–A13 project other approved outcome/decision text.

- **A1 Checkpoint [V, Check 1].** After the second approval and before the first cutover edit: `git -C . show --stat HEAD` lists only paths under `.config/agents/`, `docs/adr/` and `.agents/papercuts.json`; afterwards `git -C . status --short -- .config/agents docs/adr .agents/papercuts.json` prints nothing. The staged path list was shown to the human before committing.
- **A2 Lean-plan close [V, Check 2].** `git -C . show --stat HEAD` lists exactly the lean spec and the lean plan; `shasum -a 256` of the committed spec is `376fd634f0c6c772252fe6929547a2d1bc0a5ba161477935a9cdaa7e1635fe51`; `python3 .config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md` reports `"status": "valid"` and `"lifecycle_status": "CLOSED"`.
- **A3 Offline suite [V, Check 3].** An offline controller suite, through public acpx against a scripted ACP server, covers C4, KR5, KR6, KR8, KR9, KR10, KR11, KR14, KS4, KT3, KT4, KS5 and the undisposed-run preflight refusal (13 items), and passes; no model spend.
- **A4 Guard mapping [V, Check 4].** Each of the 29 guard IDs above points to at least one live skill line or controller location; zero IDs unmapped; KS8 absent.
- **A5 Static checks [V, Check 5; H-S1, H-S2, H-S3].** (a) No live `lifecycle_channel`, `lifecycle-plugin`, `lifecycle[- ]consumer`, `tool.lifecycle`, `xd://lifecycle`, `Ready: reviewer`, or `Synchronized` protocol text under `.config/agents` or `docs/adr` (excluding `node_modules`). Patterns match case-sensitively (H-S1). Exempt only (H-S2): (1) sections headed History, Revision history, Changelog, Supersession, or Rejected alternatives; (2) `references/agent-return/test_decode.py`; (3) `lifecycle-plugin` when it is part of the identifier `replacement-lifecycle-plugin` (the ADR-0010 filename and links to it, `replacement-lifecycle-plugin/spec-v5`, and that spec's and plan's paths). Every other match fails. (b) `reconcile/references/execution-flow.md`, `second-opinion-a.md`, `second-opinion-b.md` absent; (c) `config.yml` loads no lifecycle plugin; (d) `node --check` passes on every controller file; (e) all remaining extension tests pass (H-S3).
- **A6 Test audit [V, Check 6].** The audit Handoff records the approved ordered file list and either the accepted proposal or a named stop; the fix-batch task records the applied batch or "no accepted findings" plus original A's closure result (recorded even when `NOT CLOSED`); the offline suite passes after the batch. There is never a second batch.
- **A7 Live runs [V, Check 7; H-S4].** Three live runs started from a real OMP session through the skills (not the trial runner): Conversation mode reaches a first VALID; Artifact mode on a harmless temp copy makes one committed application and does the KR11 reread; Retrace has ≥2 scopes, one `requires` link, a delegated Reconcile, and the final aggregate. For each run: every `omp acp` PID shows ESRCH, the session folder is removed, protected sources are unchanged (SHA-256 before vs after, H-S4), spend is reported.
- **A8 Ordering [V].** No live run starts before the written spec and plan are approved (second approval) and before the audit + fix-batch task (plan order 3–4) complete.
- **A9 Version pin [V, decision 3].** With `omp --version` ≠ 18.3.0 or acpx ≠ 0.19.2, the CLI refuses before launching any child and prints a stop record.
- **A10 Removals [V].** Absent after cutover: `lifecycle-plugin.js`, `lifecycle-supervisor.js`, `lifecycle-consumers.js`, `lifecycle-plugin.test.js`, `lifecycle-read-verbatim.yml`, `extensions/fixtures/lifecycle-rpc-worker.js`, `reconcile/references/execution-flow.md`, `harnesses/omp/agents/second-opinion-{a,b}.md`, `.config/scripts/bootstrap` L28–29 lines; `~/.omp/agent/agents/second-opinion-{a,b}.md` removed only if they are symlinks to those repo files; bootstrap not run; no `prompts/semantic/*` file ported; no two editable copies of either prompt.
- **A11 Isolation from trial [V].** No controller file imports from `.agents/artifacts/acpx-omp-acp-trial/`; that folder is byte-unchanged; `AGENT_ID` ≠ `omp-trial`; session-folder prefix ≠ `acpx-trial-`; none of `pins.mjs`, `run.mjs`, `t3.mjs`, `debugloop.mjs`, `fixtures/mechanics/*`, `fixtures/native/approval-drift.json` copied.
- **A12 Code location [V].** Controller lives at `.config/agents/harnesses/omp/acp-controller/` with its own `package.json` and lockfile resolving acpx 0.19.2 and `@agentclientprotocol/sdk` 1.4.0, engines Node ≥22.13.
- **A13 References [V].** ADR-0010 rewritten in place (D31 clauses 1–6 restated; 7–8 dropped or restated without plugin sentences; clause 9 verbatim); INDEX L18 and L26 updated; ADR-0004 L39 second sentence and L52 bullet deleted, L62 unchanged; every carve-out site found by the repo-wide search replaced with controller wording and nothing else changed in those files; `references/agent-return/test_decode.py` unedited; both skills' evals re-derived with the sync-repair eval renamed.

## Scope

### Included

- New controller + CLI + pin module + offline suite at `.config/agents/harnesses/omp/acp-controller/` (adapted from the trial modules named in the handoff).
- Rewrites of `reconcile/SKILL.md`, `retrace/SKILL.md`, `reconcile/references/reviewer-protocol.md` (prompt merge), Retrace scope prompt inside the retrace skill; re-derived `reconcile/evals/evals.json` and `retrace/evals/evals.json`.
- All removals in A10; plugin line removal from `harnesses/omp/config.yml`; dependency removal only where nothing else imports it.
- ADR and carve-out reference updates in A13.
- Checkpoint and lean-plan-close commits (decisions 4–5); one `dev-test-audit` and its one fix batch; three live runs; standard review and verification.

### Non-goals [V]

- Revising or following the lean-redesign spec/plan; KS8; the trial SHA pin, limits, pools, B2–B6, debug loop, rehearsal, T1–T3 evidence, `verify.mjs`, `probe*.mjs`; C2/C5 text grammar, C6 `lifecycle_channel` schema, transport probe, lean task graph; a scope model role; pinning models in the controller; a second fix batch; editing generic contracts beyond carve-out wording (KS7); pushing.

## Constraints

- **Preserved [V]:** both skills' mechanics and semantics via the 29 guards; KT5 retrace sections; generic ADR-0002 collection contracts and generic execution-recovery policy (KS7); `modelRoles.second_opinion_a/b` keys in `config.yml` (decision 2 reads them); `plan-artifact-sync.js` and its `@oh-my-pi/pi-coding-agent` dependency; `references/agent-return/test_decode.py`; ADR-0004 L62.
- **Approved removals / clean cutover [V]:** everything in A10, the plugin line in `config.yml`, the lifecycle-consumer protocol text and the Reconcile/Retrace carve-outs (replaced, not aliased). "No backward compatibility is required." No shim, alias or dual path.
- **Approved hard failures [V]:** version-pin refusal; undisposed-run preflight refusal; 4th invalid return stop; KR13 stop-and-ask when identities cannot be kept; failed disposal blocks success; KR12 stops.
- **Operational [V]:** no tool deadline on the CLI (trial S1–S3 took 3,057,029 ms); no token/USD cap; the tool policy is detect-after, not a sandbox; runs touch the live OAuth store for token refresh; the `config.yml` change applies only to newly started OMP sessions; `~/.omp/agent/config.yml` is a symlink to the repo file (working-tree model values already live).
- **Stage constraints (this stage only):** no edits to live `config.yml`, `.config/agents`, or `docs/adr`; no Git state change; no native acpx/`omp acp` run; PID 56135 and `/Users/kim/.omp/profiles/acpx-trial-inspect` untouched; live OMP session JSONL not read.

## Evidence and assumptions

### Observed baseline (2026-09-27, HEAD `de06da2`, working tree)

- `omp --version` → `omp/18.3.0`.
- `git status --short -- .config/agents docs/adr .agents/papercuts.json` → 29 `M` + 7 `??` (= 28 modified + 7 untracked under `.config/agents`/`docs/adr`, plus modified `.agents/papercuts.json`); matches decision 4.
- `harnesses/omp/config.yml` L50: `- ~/.dotfiles/.config/agents/harnesses/omp/extensions/lifecycle-plugin.js` (absent at HEAD); L86–87 working tree `second_opinion_a: anthropic/claude-opus-5-5:medium`, `second_opinion_b: xai-oauth/grok-4.7:medium`; HEAD `openai-codex/gpt-6-astra:xhigh` / `xai-oauth/grok-4.6:xhigh`. `~/.omp/agent/config.yml` → symlink to the repo file.
- `.config/scripts/bootstrap` L28–29: the two second-opinion symlink entries. `~/.omp/agent/agents/second-opinion-{a,b}.md` are symlinks to the repo files.
- Only consumers of `second-opinion-a/b` names: `lifecycle-consumers.js` L7–8, `lifecycle-plugin.test.js` L19–20, ADR-0010 L53–54, bootstrap L28–29 (repo search of `.config`, `docs`, `bin`).
- `harnesses/omp/extensions/` holds `lifecycle-{plugin,supervisor,consumers}.js`, `lifecycle-plugin.test.js`, `lifecycle-read-verbatim.yml`, `fixtures/lifecycle-rpc-worker.js`, `plan-artifact-sync{,.test}.js`, `key-remaps.js`; `package.json` devDependencies `@oh-my-pi/pi-coding-agent` 18.2.6, `@oh-my-pi/pi-utils` 18.2.6, `@types/bun`, `typescript`; `plan-artifact-sync.js` L9 imports `@oh-my-pi/pi-coding-agent/internal-urls`.
- Current protocol sites in the skills: `reconcile/SKILL.md` L12 (named lifecycle consumer), L21 (execution-flow link), L290–291 (`Ready: reviewer A/B`), L328 and L519 (`lifecycle_channel`), L465 (`Synchronized`); `retrace/SKILL.md` L133 (`lifecycle_channel.reply`); `reviewer-protocol.md` L209 (`Synchronized`); `reconcile/references/execution-flow.md` (102 lines).
- Current evals: reconcile 12 (incl. `REC-SYNC-REPAIR-RESUME`, the sync-repair eval), retrace 21.
- Case-sensitive static-pattern baseline (A5a patterns): hits in 25 files — `harnesses/omp/{agent-return.md, config.yml, agents/second-opinion-{a,b}.md, extensions/lifecycle-supervisor.js, extensions/lifecycle-plugin.test.js, extensions/fixtures/lifecycle-rpc-worker.js}`, `references/agent-return/{return.md, test_decode.py}`, `skills/dev-ask/{SKILL.md, WORKFLOW.md, evals/evals.json, references/execution-flow.md}`, `skills/dev-implementation/{SKILL.md, references/plan-orchestration.md}`, `skills/reconcile/{SKILL.md, evals/evals.json, references/execution-flow.md, references/reviewer-protocol.md}`, `skills/retrace/{SKILL.md, evals/evals.json}`, `docs/adr/{0002-executor-plans-and-orchestration.md, 0010-replacement-lifecycle-plugin.md, INDEX.md}`. Lowercase "synchronized" in `skills/dev-test-audit/references/audit-protocol.md` L40 and `skills/dev-test-audit/evals/evals.json` L53 does not match (H-S1).
- Baseline under the confirmed S2 exemption set:
  - Exempt today: `test_decode.py` L42–44; `replacement-lifecycle-plugin` identifiers at ADR-0010 filename, INDEX L18 link, ADR-0010 L64 (`replacement-lifecycle-plugin/spec-v5`, `.agents/artifacts/2026-09-18_replacement-lifecycle-plugin-spec.md`, `.agents/plans/2026-09-18-2248_replacement-lifecycle-plugin.md`). No current hit lies inside an exempt-headed section.
  - Failing today, all at planned edit/deletion sites: deleted files (`lifecycle-{supervisor,plugin.test}.js`, `fixtures/lifecycle-rpc-worker.js`, `second-opinion-{a,b}.md`, `reconcile/references/execution-flow.md`); `config.yml` L50; rewritten `reconcile/SKILL.md` (L12, L290–291, L328, L465, L519), `retrace/SKILL.md` L133, `reviewer-protocol.md` (L15, L45–46, L88, L159, L209); re-derived evals (reconcile L6, L16, L44, L52, L75, L90, L145, L174, L184, L190; retrace L239); carve-out sites `harnesses/omp/agent-return.md` (L12–15, L29, L34, L70, L72, L140, L288, L362, L375, L419), `return.md` L53, dev-implementation `SKILL.md` L22, L134, `plan-orchestration.md` L13, dev-ask `SKILL.md` L68, `WORKFLOW.md` L30, L119, dev-ask `references/execution-flow.md` L74, L110, dev-ask evals L3728, ADR-0002 L61, L64, INDEX L26.
  - Failing today in ADR-0010 outside exempt sections, so the in-place rewrite must remove them: D31 clause 1 (L20, `lifecycle_channel`) and "Affected contracts" L48, L50 (`lifecycle-plugin.js`, `lifecycle-consumers.js` paths).
  - Failing today outside any planned edit/deletion site: **none**.
  - Note: INDEX L83 heading "Supersession discipline" is not one of the exact S2 headings; it has no hits today.
- Handoff known sites confirmed by content: dev-implementation `SKILL.md` L22, L133–135; `plan-orchestration.md` L13; dev-ask `SKILL.md` L67–69; ADR-0004 L39, L52; INDEX L18, L26.
- Trial bundle (read-only): `controller.mjs` (sha256 `8fe2ddd0772339f488c421bc6de932fba326622affa35bd7c69b56fad499f43b`) L295–305 records `repairAuthority` and stops; `lib/native/adapter.mjs` L15 `AGENT_ID = "omp-trial"`; `lib/native/env.mjs` L162 and `pins.mjs` L69 use `acpx-trial-`; all modules the handoff names to adapt exist.
- Lean plan `.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md` L6 `**Status**: PENDING`.
- Baseline SHA-256 prefixes: `reconcile/SKILL.md` `b33e854319d3`, `retrace/SKILL.md` `d5c469d3494f`, `reviewer-protocol.md` `934a4c3aa744`, `reconcile/references/execution-flow.md` `3666099fe40d`, reconcile evals `2fb09b4ad045`, retrace evals `d52ac51a5a94`, `config.yml` `079142573a2e`, bootstrap `81319bd3316a`, ADR-0010 `1bf8dd7f1c62`, lean plan `b4a1008606ba`.

### Assumptions

- The working tree at the checkpoint equals the observed baseline, except user edits made in between (the checkpoint commits whatever is present, per decision 4).
- `[INFERENCE]` PID 56135 and `acpx-trial-inspect` belong to the trial, not to a production run; the preflight's notion of "prior run" is the production controller's own runs.

## Open engineering questions

| # | Question | Owner | Blocking |
|---|---|---|---|
| Q1 | Controller module layout, CLI argv/stdin interface, stdout record shape and exit codes | dev-specification | Blocks spec only |
| Q2 | KR13 production mechanism (what identity-preserving repair does, within: no "stop and start over", no automatic rollback, stop-and-ask when a same-session resume cannot keep reviewer identities) | dev-specification | Blocks spec only |
| Q3 | Prompt-merge wording for `reviewer-protocol.md` and the in-skill Retrace scope prompt; where in `retrace/SKILL.md` the prompt lives | dev-specification | Blocks spec only |
| Q4 | Pin module: how acpx "exactly 0.19.2" and `omp --version` are read at preflight | dev-specification | Blocks spec only |
| Q5 | How preflight identifies a prior production run's `omp acp` PIDs and session folder (new prefix, new `AGENT_ID` values) without matching trial leftovers such as PID 56135 | dev-specification | Blocks spec only |
| Q6 | Exact permanent test file paths chosen contract-first under `test-value.md` (feeds decision-6 audit list) | dev-specification | Blocks spec only |
| Q7 | How the controller reads `modelRoles.second_opinion_a/b` at run time | dev-specification | Blocks spec only |
| Q8 | ADR-0010 clauses 7–8: drop or restate; exact carve-out replacement wording; new name for the renamed sync-repair eval | dev-specification | Blocks spec only |
| Q9 | Which `extensions/package.json` devDependencies (if any) become unused after the plugin removal | dev-specification | Blocks spec only |
| Q10 | Spend source and report format per live run | dev-specification | Blocks spec only |
| Q11 | (Resolved 2026-09-27) Human confirmation of v1's S1–S4 | Human (via Main) | Not blocking |

## Confirmed human requirements (confirmed 2026-09-27)

Human answers to v1's synthesized items, verbatim:

- **H-S1 — static-check matching:** "Case-sensitive"
- **H-S2 — static-check exemptions:** "Exempt only: (1) sections headed History, Revision history, Changelog, Supersession, or Rejected alternatives; (2) references/agent-return/test_decode.py; (3) "lifecycle-plugin" when it is part of the identifier "replacement-lifecycle-plugin" (the ADR-0010 filename and links to it, replacement-lifecycle-plugin/spec-v5, and that spec's and plan's paths). Every other match fails."
- **H-S3 — remaining extension tests** (v1 question: every `*.test.js` left under `harnesses/omp/extensions/`, today only `plan-artifact-sync.test.js`, passes with `bun test`): "Yes, all remaining"
- **H-S4 — protected sources unchanged** (v1 question: SHA-256 identity before vs after each live run of every source the run treats as read-only evidence, plus the frozen trial bundle and live `config.yml`, with the Artifact-mode temp copy the only allowed write target): "Yes, SHA before/after"

Remaining human confirmations for this revision: none.

## Next owner

- Route impact: **unchanged**.
- Receiver: **Main** (route owner); next-owner role **`dev-specification`**, which writes `.agents/artifacts/<YYYY-MM-DD>_reconcile-retrace-acp-production-spec.md` quoting the operative rules.
