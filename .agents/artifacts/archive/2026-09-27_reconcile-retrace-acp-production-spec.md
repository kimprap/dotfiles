# Technical Specification: Reconcile and Retrace production cutover to acpx + native `omp acp`

**Revision:** `reconcile-retrace-acp-production/spec-v3`
**Supersedes:** `reconcile-retrace-acp-production/spec-v2` (SHA-256 `0766ee3ba00ca403d6631f6b08262f96eba3467b97638594efe9bf0b2a1fcbda`). Only changes (user-approved spec-v3 amendment): §2.2 `scripts.test` and §5 Q6 runner use `node --test "test/*.test.mjs"`; §8 A3 runner uses `node --test --test-reporter=spec "test/*.test.mjs"`; §8 A10 prompts check uses `find $C -type d -path '*prompts*' -not -path '*/node_modules/*'`; §5 Q5 item 3 uses `ps -A -ww -o pid=,command=`; §5 Q2 step 1 parks reviewers by A4 close plus observed exit, then detaches the runtime with `runtime.shutdown()` (not the disposal method); §10 first risk restated accordingly.
**Stage:** `dev-specification` (approved route, standard assurance)
**Date:** 2026-09-27
**Repository:** `/Users/kim/.dotfiles` at HEAD `de06da2` (working tree as observed 2026-09-27)
**Receiver:** Main (route owner); next role `dev-ticketing`
**Status:** written; awaiting the second approval (spec + plan SHA-256, checkpoint path list, lean-plan close)

## 1. Authority

### 1.1 Bound sources

| Role | Path | SHA-256 |
|---|---|---|
| Approved request authority (route, decisions 1–6, user approval) | `local://prod/handoff-v1.md` = `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-09-25T08-29-25-475Z_01a0d7af-0063-70ea-80be-c60baf3163e4/local/prod/handoff-v1.md` | `c52f2222947be1ea7b01141b7020fe88810d31f7af48dec857f316a33ac2afd6` |
| Engineering Requirements Brief `reconcile-retrace-acp-production-requirements/v2` | `.agents/artifacts/2026-09-27_reconcile-retrace-acp-production-requirements.md` | `3998f332934c18f5b4479e205fb53d969d1e6bf34bee9086a051878a826651b8` |
| Trial spec-v10 (carry-forward source; provenance otherwise) | `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-spec.md` | `d38f487721c78df7b53d41c31d4b5f37a3c31a699f0d196ee88192c1e0c956ba` |
| Lean spec-v2 (intent, keep list; provenance otherwise) | `.agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md` | `376fd634f0c6c772252fe6929547a2d1bc0a5ba161477935a9cdaa7e1635fe51` |
| Trial decisions v8 (provenance) | `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-decision-evidence.md` | `561a35a1132f70779a592447b1ca7f32005fe9d123be52908ae84e2f1c812d84` |
| Permanent-test value rule | `.config/agents/skills/dev-implementation/references/test-value.md` | `42702a4ad007ae6a2d8f42c08d97de820e0d0a5e0b846509629de6e82f211f04` |
| Task-sizing rule (seam sizing) | `.config/agents/skills/dev-ticketing/references/task-sizing.md` | `3efee3b3a1db53d0cc1683f9606cf38896a4cbb972c436683e5b354f38745175` |
| Live Reconcile skill (baseline) | `.config/agents/skills/reconcile/SKILL.md` | `b33e854319d3ca6e778e095892c5d6fd231e5cb685f8e81a89a7f1d65a07cdf1` |
| Live Reconcile reviewer protocol (baseline) | `.config/agents/skills/reconcile/references/reviewer-protocol.md` | `934a4c3aa74434e138dafbdc4aebfa77901e470f4e965270c809368cfbf36fc9` |
| Live Reconcile execution-flow map (to delete) | `.config/agents/skills/reconcile/references/execution-flow.md` | `3666099fe40d965aec633013e7fca08ca1c19472ce7528d248da277a8da9859f` |
| Live Retrace skill (baseline) | `.config/agents/skills/retrace/SKILL.md` | `d5c469d3494f97eb72203502a88e1cbdfa86a7245fdaff3f16b8a541b1a8619d` |
| Reconcile evals (baseline, 12) | `.config/agents/skills/reconcile/evals/evals.json` | `2fb09b4ad04528cd4ee3452091166653cfa30129033542be551fe89d3e3e4c01` |
| Retrace evals (baseline, 21) | `.config/agents/skills/retrace/evals/evals.json` | `d52ac51a5a94c6d69c547ac1f1f80a155544a4024c90c2059f05d98bcc0ea099` |
| ADR-0010 (baseline) | `docs/adr/0010-replacement-lifecycle-plugin.md` | `1bf8dd7f1c6215bb76c104982e2063c7465df65a20ca09ab2b6f98672631862a` |
| ADR index (baseline) | `docs/adr/INDEX.md` | `597036cf9e9f0aa29806fee32cb7b380609a42ecd6d95747e488606c5833588b` |
| ADR-0004 (baseline) | `docs/adr/0004-canonical-discovery-and-continual-learning.md` | `231017aee9caac67c4378eea6e452caa5fba85fe0e4726a9b72cd46f75c6cb43` |
| Live OMP config (baseline) | `.config/agents/harnesses/omp/config.yml` | `079142573a2ea2ad8c3621897258ebd515cfa46a666d202b892aa8cec1633a58` |
| Bootstrap (baseline) | `.config/scripts/bootstrap` | `81319bd3316a7a2c1931ef34b46134ae8beca57ee93d2d01373aa3f1f22e47ce` |
| Lean plan (closed by decision 5) | `.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md` | `b4a1008606bad986b02202217366290842f512693809c6d7ad040ba19113b4de` |

Frozen trial bundle `.agents/artifacts/acpx-omp-acp-trial/` (read-only evidence; adaptation sources). Aggregate identity of its 143 non-`node_modules` files: `5c2563410027f0fe961cf679e8d8451ae5f506dc6245153fffdaff19c4cd2b99`, computed by
`find .agents/artifacts/acpx-omp-acp-trial -type f -not -path '*/node_modules/*' | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256`.

| Adaptation source | SHA-256 |
|---|---|
| `controller.mjs` | `8fe2ddd0772339f488c421bc6de932fba326622affa35bd7c69b56fad499f43b` |
| `lib/native/adapter.mjs` | `1a46be3029d4e59665eb82b65adfb699be6f71f3045eb27482d4aa6bd314106c` |
| `lib/native/domain.mjs` | `8b556765381077803adfe6a88ff37b2f26d825d77e7143c447ddaa0216708cc5` |
| `lib/native/env.mjs` | `abe3f35c93c16f1aafa3287bdac3ee5050e93555ee58ae943504ce77169e37ac` |
| `lib/native/window.mjs` | `606d52b2aa5ecc0f6d5e53b5e10cbc48d54f107eee347812dec779fe79a565a8` |
| `lib/evidence/export.mjs` | `7efa5165631eabd631dbf9334c4a9964a4990d88e5f07016142c31b1e5a9a846` |
| `lib/evidence/io.mjs` | `8056db6cbeea355f6be65b57107adcbee16b98748f84c0f50bfc2f42238a05bb` |
| `lib/semantic/capture.mjs` | `7517d474a2ebe5cd9aeb52e14e66844fd1ecee949d578a3a762837030f8acda9` |
| `lib/semantic/domain.mjs` | `e6fce5d1d7e33380aeb4d659e598dc717f2a71e93dcb5bf77791b420451edc77` |
| `fixtures/native/scripted-agent.mjs` | `e47a857f97ff5e0e730f914354926dc98d26c23198b263c7b66ea29c2283ac8d` |
| `prompts/semantic/reconcile-reviewer.md` (merge source, not ported) | `e84d326bddc3e67054cab78fc988882d8ad381dd63fa292325eb4e834d611c44` |
| `prompts/semantic/retrace-scope.md` (merge source, not ported) | `cf90ddbfffd86b92e04993beb087c738d6ce3412d19f834ebb455ef38cc83a39` |
| `config/omp-overlay.yml` | `1af89b1b3bce9c686022a2b56f7f5706b30fbc1553b9cbf1362620c18a67a89b` |
| `package-lock.json` | `f96a300ff80c61167b85367397a1a0683bc5d01ef3b6d43e083b99f5d928064a` |

Canonical project contracts: none applies. ADRs, plans and skill checklists are not declared canonical contracts; the ADR edits below are ordinary decision-record maintenance authorized by the handoff.

### 1.2 Precedence (quoted, brief v2 L23)

"the handoff governs. 'Older artifacts are provenance only.' 'If the trial state model conflicts with a kept skill semantic, the skill semantic wins and the state model is adapted.' The lean-redesign plan is not followed and neither lean artifact is revised into the production spec."

Every place this spec adapts the trial model to a kept skill semantic is marked **[skill wins]**. Every place a live-skill mechanic is replaced by an approved decision is marked **[decision N]**.

### 1.3 Standing intent (lean spec L12, verbatim)

"Keep both skills' mechanics and semantics. Every other accumulated rule, ADR, contract, gate and proof mechanism may be revised or removed, and no backward compatibility is required."

### 1.4 Settled human decisions (brief v2 L36–41, projected)

1. **KB1:** "Only the admitted, domain-valid native `yield` candidate counts as a reply. Task, hub, Eval, any other `yield`, ordinary output, transcripts, history, agent output and generic collectors never count and are never a fallback."
2. **Models:** reviewer A = `modelRoles.second_opinion_a`, reviewer B = `modelRoles.second_opinion_b`, scope evaluator = A's model; no scope role; not pinned in the controller.
3. **Version pins:** "Refuse to start unless `omp --version` reports 18.3.0 and acpx is exactly 0.19.2. A new version requires the offline suite and the live runs to pass on it first." No binary SHA pin.
4. **Checkpoint commit:** before the first cutover edit, one local commit of every modified or untracked path under `.config/agents/` and `docs/adr/`, plus `.agents/papercuts.json`; staged with `./bin/dot-add .config/agents docs/adr .agents/papercuts.json` (stop and report if `dot-add` rejects a path); excludes `.config/cursor`, `.config/karabiner`, untracked plans and artifacts; subject `chore(agents): checkpoint lifecycle-plugin state before acp cutover`; body "Checkpoint only. It separates current dirty bytes from cutover edits. No verification is claimed. It includes the working-tree modelRoles rewrite and other in-flight edits named in the handoff."
5. **Close the lean plan:** after the checkpoint, one local commit adding only the unchanged lean spec (`376fd634…fe51`) and the lean plan with only its Status line changed to `**Status**: CLOSED`. Not DONE. No push.
6. **Test-audit scope:** every permanent test file the cutover creates or keeps for the controller, plus `reconcile/evals/evals.json` and `retrace/evals/evals.json`; excludes the frozen trial bundle, the deleted `lifecycle-plugin.test.js`, the unrelated `plan-artifact-sync.test.js`, and temporary live-run proof.

### 1.5 Confirmed human requirements (brief v2 L177–180, verbatim)

- **H-S1:** "Case-sensitive"
- **H-S2:** "Exempt only: (1) sections headed History, Revision history, Changelog, Supersession, or Rejected alternatives; (2) references/agent-return/test_decode.py; (3) "lifecycle-plugin" when it is part of the identifier "replacement-lifecycle-plugin" (the ADR-0010 filename and links to it, replacement-lifecycle-plugin/spec-v5, and that spec's and plan's paths). Every other match fails."
- **H-S3:** "Yes, all remaining" (every `*.test.js` left under `harnesses/omp/extensions/` passes with `bun test`).
- **H-S4:** "Yes, SHA before/after" (every source a live run treats as read-only evidence, the frozen trial bundle and live `config.yml`; the Artifact-mode temp copy is the only allowed write target).

## 2. Architecture

### 2.1 Shape

One Node program at `.config/agents/harnesses/omp/acp-controller/` replaces the lifecycle plugin. The root OMP session runs the skill (brief/table approval, presentation) and invokes the CLI once through `bash` with `timeout: 0`. The CLI owns every reviewer, normalizer and scope-evaluator session through public acpx 0.19.2 `createSharedAcpRuntime` and native `omp acp`. Trial architecture carried forward (trial spec L29–32, quoted):

> - The transport adapter owns handles, request/window correlation, journal observation, cancellation, and observed disposal.
> - One coded semantic controller owns approvals, bindings, reviewer progression, scopes/dependencies, budgets, application, validation, freshness, and admission.
>
> No custom supervisor, mailbox, broker, independent receipt ledger, private acpx imports, or result extension. Logical ownership does not require nested controller processes.

"Logical scope ownership uses ordinary owner-bound objects/dispatch closures, not nested controller processes or a second registry. Root admits scope results, never nested review results." (trial spec L37)

### 2.2 Layout (Q1)

```text
.config/agents/harnesses/omp/acp-controller/
  package.json            # name "omp-acp-controller", private, "type":"module",
                          # engines.node ">=22.13.0",
                          # dependencies: acpx 0.19.2, @agentclientprotocol/sdk 1.4.0 (exact),
                          # overrides: {"@agentclientprotocol/sdk": "1.4.0"},
                          # scripts: {"test": "node --test \"test/*.test.mjs\""}
  package-lock.json       # committed; npm; resolves acpx 0.19.2 and sdk 1.4.0
  cli.mjs                 # NEW: argv/stdin, refusals, exit codes, stdout rendering
  controller.mjs          # from trial controller.mjs: runReconcile, runRetrace, runNormalize, renderers
  config/omp-overlay.yml  # from trial config/omp-overlay.yml, byte-identical content
  lib/adapter.mjs         # from lib/native/adapter.mjs; AGENT_ID = "omp-acp-controller"
  lib/window.mjs          # from lib/native/window.mjs
  lib/capture.mjs         # from lib/semantic/capture.mjs
  lib/schema.mjs          # from lib/semantic/domain.mjs + lib/native/domain.mjs merged; soak/probe variants dropped
  lib/export.mjs          # from lib/evidence/export.mjs (closed typed projection only)
  lib/io.mjs              # from lib/evidence/io.mjs
  lib/env.mjs             # from lib/native/env.mjs; prefix "acp-controller-"
  lib/versions.mjs        # NEW: OMP_VERSION, ACPX_VERSION, checkVersions()
  lib/preflight.mjs       # NEW: findUndisposedRuns()
  lib/models.mjs          # NEW: readModelRoles() (from env.mjs observeLiveConfig logic)
  lib/prompts.mjs         # NEW: loadPrompts() by marker from the two skill files
  lib/ports.mjs           # NEW: binds controller ports to the adapter
  lib/spend.mjs           # NEW: spend accumulation and rendering
  test/fixtures/scripted-acp-agent.mjs   # from fixtures/native/scripted-agent.mjs
  test/preflight.test.mjs
  test/reconcile.test.mjs
  test/retrace.test.mjs
```

`node_modules/` is ignored by the repository `.gitignore` L31 (`node_modules/`). Install with `npm ci` inside the directory. The production pin file is named `lib/versions.mjs`, not `pins.mjs`, so A11's "no `pins.mjs` copied" check is unambiguous.

Never copied (A11): `pins.mjs`, `run.mjs`, `t3.mjs`, `debugloop.mjs`, `fixtures/mechanics/*`, `fixtures/native/approval-drift.json`, and also `verify.mjs`, `probe*.mjs`, `lib/semantic/{mechanics,soak,large,diagnostics,gate,mapping}.mjs`, `lib/evidence/report.mjs`, `prompts/semantic/*`. `lib/ports.mjs` is written new; `t3.mjs`'s `reconcilePorts`/`evalPorts` may be read as evidence but not copied. No controller file imports anything under `.agents/artifacts/`.

Adaptation rules for every carried module: replace `omp-trial` with `omp-acp-controller`, `acpx-trial-` with `acp-controller-`; delete soak/probe/rehearsal/pool/limit/debug-loop code paths, the trial `pins.mjs` import (use `lib/versions.mjs` and the §3 runtime constants), the trial `LIVE_CONFIG` hash/plugin fields, and every trial-only T1–T3 reference.

### 2.3 State model (trial spec L39–51, adapted)

```text
Reviewer = role, ownerScope, sessionKey, handle, backendSessionId,
           firstActualReviewComplete, request, lastConsumedCursor, state, pidLedger
Review   = approvedContext, runOriginal, canonical, immutableOuterBase,
           workingProposal, lineage, originalExpectation, invalidReturns,
           blockedRetryUsed, applications, cap, closureOnly, seenFrontiers, rounds
Request  = requestId, owner, handle, backendSessionId, expectedPhase,
           candidateIdentity, windowStartCursor, lastConsumedCursor,
           invocationLifecycles, firstCandidate, admittedReply,
           turnResult, cancellationCause, reuseState, observationAvailability
Scope    = approvedContract, requires, state, candidate, reviewedReport, manifest,
           evaluator, reviewers, disposalObservation
Run      = runId, kind, privateRoot, sessionDir, actors, spend, parked
```

Quoted invariants kept: "Submit every request ID once. Preserve every admitted first reply owner-locally. Session state remains `active | idle | restoring | unrestored | closing | closed`; restoration does not reset first-review flags, identity, allowances or other consumed state. … Reply/candidate, turn settlement, reuse and disposal are independent facts." (trial spec L51). Adaptation: "Fresh session creation is allowed only for initial first creation of a previously unstarted role" in one CLI run.

Trial-to-skill conflicts, all **[skill wins]**:

1. **Rendering.** Trial `renderReconcile` prints thin per-round lines. Production renders the exact KR15 formats of `reconcile/SKILL.md` § Presentation (baseline L583–651): `## Review rounds` table `| Step | Outer | Actor/event | Pass | Proposal identity | Outcome |`, then `## Final proposal` (Conversation: **Proposal**; Artifact: **Change summary**, **Artifact**, **Current identity**) or `## Reconcile stopped` (**Candidate**, **Blocker**, **Resume from**), packed-label grammar. Reviewer text (Blocking issues, Correction, Preserve, Recommendations, Blocker, Resume with) is copied byte-for-byte from the admitted `data` strings; the controller never rewrites it.
2. **Terminal order.** Trial rereads the artifact at closure before disposal. Production follows the skill: "At either terminal branch … perform terminal cleanup first. Then, in artifact mode only, immediately before reporting, freshly read and identify the canonical artifact bytes and compare them with the reviewed outer-base identity." (baseline L469–476).
3. **Delegated disposal.** Trial skips disposal when reviewers are `shared`. Production: the scope's delegated Reconcile always disposes its own two reviewers (observed exit) before the scope's `scope-result` is formed (KT4, KS6), because "Scope actors alone dispose reviewers; the outer parent disposes exact scope actors." (retrace baseline L401–402).
4. **Response fields.** Trial `review` variant uses `rationale`/`reason`. Production `review` variant carries the skill response contract fields (reviewer-protocol § Complete response contract): `verdict`, `blocking_issues`, `revision`, `correction`, `preserve`, `recommendations`, `blocker`, `resume_with`. `Reviewer:` and `Pass:` are supplied by code, not echoed [decision 1 + trial "code supplies owner/session/request/phase/revision bindings"].
5. **Rethink.** The skill loads current `skill://rethink` once. Children run `--no-skills`, so the rethink request instructs the reviewer to `read` the absolute path `/Users/kim/.dotfiles/.config/agents/skills/rethink/SKILL.md` once and apply it, stating that "the outer Reconcile contract supersedes `rethink`'s standalone wrapper" (baseline L309–310). One editable copy remains.
6. **Delegated Reconcile ownership.** The skill has the scope LLM load `skill://reconcile` and drive its reviewers. Production keeps the ownership semantics (scope-owned pair, parent never consumes reviewer traffic, report-only) with the scope's logical controller as a scope-owned code object (trial spec L37). The scope evaluator session authors `candidate-ready` content; the scope's code object runs the delegated Reconcile, disposes its reviewers, then composes the ordered `scope-result` payload of retrace § Scheduler step 5 from admitted facts.
7. **Delegated entry and content records.** The skill's delegated entry (`begin-reconcile` from Retrace, trusted-caller allowlist exactly `retrace`, closed field order Caller, Parent, Controller, Scope, Scope approval locator, Scope contract locator, Candidate locator, Evidence manifest locator, Mode `Conversation replacement`, Authorization locator) and Retrace's frozen-content rule are kept as controller-internal bindings: `runScope` builds the `begin-reconcile` record from the admitted `candidate-ready` freeze and `runReconcile({ reportOnly: true, ownerScope })` validates every field before any reviewer prompt. A "locator" is a controller-held frozen UTF-8 record whose identity is the lowercase SHA-256 of its exact bytes, computed by the controller; model prompts carry the complete record text, and no model-authored digest echo is requested or accepted. **[skill wins]** over the trial, which passed reports without this binding; the Reconcile `## Preflight and approval` and Retrace `### Delegated control body` texts are rewritten to this in-process form without changing their fields or checks.

## 3. Launch, isolation and effects

### 3.1 argv (trial spec L109–113, adapted)

Registry argv arrays launch the resolved `omp` absolute path, not a shell command:

```text
<abs omp> acp --model <exact model ID> --thinking <level>
  --tools read,glob,grep,yield --no-extensions --no-skills --no-rules --no-lsp
  --no-title --config <acp-controller/config/omp-overlay.yml abs path>
  --session-dir /Users/kim/.omp/agent/sessions/acp-controller-<runId>
```

`<runId>` = `<kind>-<UTC yyyymmddThhmmssZ>-<6 hex>`, kind ∈ `reconcile | retrace | normalize`. The session directory is the direct child of `/Users/kim/.omp/agent/sessions/` (quoted rule, trial spec L115: "OMP 18.3.0 applies `--session-dir` when creating a session … but ignores it when loading … The session directory is therefore the direct child … (one level deeper fails)").

### 3.2 Overlay (trial spec L119–145, byte-identical content)

```yaml
memory:
  backend: off
autolearn:
  enabled: false
  autoContinue: false
advisor:
  enabled: false
mcp:
  enableProjectConfig: false
  notifications: false
retry:
  modelFallback: false
tools:
  xdev: false
goal:
  enabled: false
compaction:
  autoContinue: false
  experimentalContextManagement: false
contextPromotion:
  enabled: false
astGrep:
  enabled: false
externalThinking: false
```

### 3.3 Environment, cwd, permissions

- Private root `/tmp/acp-controller-<runId>/` with `home/`, `tmp/`, `work/`, `state.json`. Child env: only `PATH`, `LANG`, `LC_ALL`, `LC_CTYPE`, `SSL_CERT_FILE`, `SSL_CERT_DIR`, `NODE_EXTRA_CA_CERTS`, `HOME=<root>/home`, `TMPDIR=<root>/tmp`, `PI_CODING_AGENT_DIR=/Users/kim/.omp/agent`. Quoted: "It drops provider API-key, broker, profile, model-override, and inherited session-directory variables. Do not copy credentials or the live database." Disclosed effect kept: "ordinary OAuth refresh/account-affinity bookkeeping through that shared store".
- ACP session `cwd` = `<root>/work` (empty, no discovery files, per trial "harmless scenario working directory"). All repository and evidence locators are sent as absolute paths; the `read`/`glob`/`grep` tools address them directly.
- acpx queue sockets live in `/tmp/acpx-<sha256(HOME)[0..10]>` derived from the private HOME and are removed with the private root.
- Quoted: "Send `mcpServers: []` in public ACP session creation/resumption. The shared runtime supplies this empty argument by default and rejects a top-level shared-runtime `mcpServers` initializer option; do not pass that unsupported option. Shared-runtime permission mode is `deny-all` with noninteractive denial".
- Tool policy is detect-after over journaled tool calls, not a sandbox (trial spec L149–155): permitted observations `kind: read`, `kind: search`, and a `kind: other` yield candidate with declared input keys exactly `type`, `data`, `error`. An unexpected completed tool call stops the affected actor's work with the observation recorded; a start alone is an attempt, not proof of execution.
- Runtime timing: omit `timeoutMs` (acpx `withTimeout` applies none for null/≤0; `startTurn` uses `input.timeoutMs ?? options.timeoutMs`); set session `ttlMs: 0`; close every handle explicitly. `[INFERENCE]` from acpx 0.19.2 source reading; the offline suite (§7) runs every turn with these settings, and multi-hour behavior stays a §10 risk.
- Effects: controller-only writes are the Artifact-mode target file (after approval), the private root, the session folder, and stdout/stderr. Reviewers and evaluators are read-only by tool set.

### 3.4 Cleanup (trial spec L115, quoted and retargeted)

"Cleanup runs only after every published PID shows ESRCH and never reads file contents: (1) delete `<ts>_<id>.jsonl` for each recorded session ID in the run folder, and its exact OMP lock `.<ts>_<id>.jsonl.lock.os` only when that is an empty regular file; (2) recursively delete only its same-name `<ts>_<id>/` folder if present; (3) `rmdir` the run folder, then the empty cwd-named live-store folder for that run, if present; (4) keep and report anything else or any non-empty folder, with no other recursive delete in the live store". Then remove the private root. Function: `lib/env.mjs` `cleanupLiveSessionFolders()` with the `acp-controller-` prefix guard, then `removePrivateRoot()`.

## 4. Native result contract (carried forward, quoted)

### 4.1 Submission (trial spec L165–171)

"Each ordinary result-producing prompt asks for exactly one final native `yield` with explicit `data` and includes a short worked example for its current expectation. … Code supplies owner/session/request/phase/revision bindings and terminal scope status." "The first completed, non-error, terminal native result submission is the candidate; native success is not a VALID verdict. Require explicit `rawOutput.details.data` and native `details.status: success`; exclude incremental array `type`, `useLastTurn`, data-less/prose fallback, aborted native results, and schema-override admission. … Validate the candidate once against the domain schema, retaining an invalid first candidate rather than selecting a later valid one to evade C4." "Accept unambiguous syntactic variations in declared control keywords, and ignore irrelevant extra domain fields. Reject missing or conflicting required fields. Do not case-fold identifiers, paths, revision references, hashes, or payload text."

### 4.2 Journal windows (trial spec L173–196)

"Use public `watchSession` as the sole replayable result boundary. Drain `startTurn().events` for the submitter connection and diagnostics only; do not admit from it." Ordering: "`turn_started` opens the owning request window … `turn_result` closes the window." "**Once the watch journal shows R's `turn_result`, a completion for R is already in R's captured window or is absent.** … A later window or null-requestId line must never be bound backward to R by toolCallId." Implemented by `lib/window.mjs` `RequestWindow` and `lib/capture.mjs`.

### 4.3 A1 C4 closure (trial spec L198–221, table quoted)

| Observation | Semantic action |
|---|---|
| A retained first candidate exists | Validate once. A valid result keeps its ordinary meaning; an invalid domain result consumes one C4 invalid return. Re-ask only if the actor remains available and all independent stop/resource conditions permit it. Later failure does not erase the candidate. |
| No candidate, and the controller intentionally cancelled, the experiment ceiling was reached, or authority was revoked | Stop under that cause. Do not spend C4 or issue a new request to undo the stop. Preserve partial evidence. |
| No candidate, and an observed relevant yield invocation lacks its terminal tool update in the closed window | Delivery uncertainty: no C4 charge, re-ask, or replay. Preserve and stop the affected expectation. |
| No candidate or unfinished relevant yield, and the journal result is `failed` or `cancelled` for another reason | Preserve the existing failed-turn distinction. Retrace may count one eligible concrete failed turn only while the exact actor, binding, candidate state, and connection remain available. Reconcile does not gain a general failed-turn allowance. Lost actor/channel or an uncertain original outcome stops both. |
| No candidate or unfinished relevant yield, and the journal result is `completed` | One C4 invalid return in **both skills** … Name the defect and restate the allowed verdicts; never convert native error text into semantic BLOCKED. |

Production has no "experiment ceiling"; that row applies to controller cancellation and revoked authority only. Budget (brief failure table, "3, all current categories"): `C4_MAX_REASKS = 3` per original expectation, shared across all invalid-return categories; the fourth invalid return stops that expectation. "A new request/tool ID, duplicate observation, changed category, or phase wording does not reset the expectation's budget." **[decision: "3, all current categories"]** replaces Reconcile's "one corrective request" (baseline L373) and Retrace's "One corrective allowance per original return" (baseline L333–382); the eligibility conditions of those sections are kept.

### 4.4 Observation recovery and same-session restore (trial spec L245–255)

"After observer loss or uncertain submission acknowledgement, re-watch from the last consumed opaque cursor for the original request. Admit an already captured original candidate at most once. Do not resubmit the prompt". "Keep `same-session-only`. … an advertised resume that fails does not fall through to load or new." "Restore identity is the unchanged public native `backendSessionId` on the existing acpx record plus evidence of successful same-session restoration, with zero fresh-session fallback." "`SESSION_RESUME_REQUIRED`, even when marked retryable, remains an unrestored stop without prompt replay." Implemented by `lib/capture.mjs` `recoverObservation()`.

### 4.5 A4 observed disposal (trial spec L346–376, quoted)

"A resolved close and `status.details.closed === true` establish recorded closure, not observed exit." "After close resolves, observe every recorded PID with signal 0 under a fixed finite post-return bound. `ESRCH` proves that PID is absent at observation; success means present; `EPERM` or another error does not prove exit. Never send a termination signal from the observer." "An empty PID set is not a vacuous exit proof." "A still-present PID, EPERM, insufficient coverage, unconfirmed close, or unresolved cleanup blocks capacity release, terminal parent success". Bound: 10 s post-close-return. Implemented by `lib/adapter.mjs` `closeAndObserve()` with `PidLedger` and `observePid()`.

## 5. Settled engineering questions

### Q1 CLI contract

Invocation (from the skill, `bash` with `timeout: 0`, cwd = repository root):

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs <subcommand> [<runId>] < request.json
subcommand ∈ reconcile | retrace | normalize | resume <runId> | dispose <runId>
```

The skill writes `request.json` to its session-local scratch and redirects it; the JSON is the only input channel.

- `reconcile` request: `{ "goal", "candidate": {"identity", "text"?, "artifact"?}, "context": [..], "mode": "conversation"|"artifact", "cap": "none"|<positive int>, "approval": {"text", "at"}, "validate"?: {"argv": [..]} }`. The CLI has no delegated `reconcile` entry; delegated Reconcile runs only inside `retrace` (§2.3 item 7). Artifact mode requires `candidate.artifact` absolute path; `validate.argv` names the existing artifact-native validator, run by the controller with `execFile` (no shell) after application.
- `retrace` request: `{ "root", "objectives": [..], "constraints", "exclusions", "evidence": [{"locator","role"}], "table": {"scopes": [{"id","name","objective","evaluand","protected","exclusions","requires":[..],"sharedEvidence":[..],"potentialConflict":[..]}]}, "approval": {"text","at"} }`.
- `normalize` request: `{ "root", "concerns": [..], "input": "<frozen normalization input>" }`; returns one `scope-proposal` (KT1 optional normalizer entry).
- `resume <runId>` request: `{ "repair": {"authority": "<human words>", "step": "<exact failed step>"} }` (KR13).
- `dispose <runId>`: no request body; disposes a parked run (KR13 abandonment).

stdout carries only the rendered Markdown record (KR15 Reconcile record, Retrace four-section aggregate, normalizer `scope-proposal` block, or a stop/refusal record) followed by the Spend section (Q10). stderr carries diagnostics. The private-root `state.json` carries the machine run record; it is removed with the private root except while parked.

Exit codes: `0` final/complete (Reconcile `Final proposal`; Retrace `complete`; normalize proposal admitted; dispose done); `1` stopped, partial, blocked, or parked, with a rendered record; `2` refused before any launch (invalid request, version pin, preflight, model role, missing prompt marker); `3` cleanup failure (A4 not established; record names the unresolved actor/PID/folder).

### Q2 KR13 identity-preserving repair: park and resume

Decision: **resume subcommand** (the alternative "CLI waits on stdin" is rejected: a blocking tool call cannot carry the human's repair conversation in the root session).

1. On an Artifact-mode application, reread or validation failure (the only KR13-eligible steps; synchronization no longer exists), the controller stops the review loop and does **not** dispose the pair. It persists `state.json` (review state, canonical/outer-base/Correction identities, failed step, both reviewers' `sessionKey` and `backendSessionId`, PID ledgers), then closes each reviewer with the A4 close plus observed exit; a reviewer is parked only when that procedure reports disposed. It then detaches the runtime with `runtime.shutdown()`, which drops the connection and is not the disposal method, and keeps the stored sessions, the session folder and the private root; sessions are neither deleted nor replaced. It prints `## Review rounds` + `## Reconcile stopped` whose **Resume from** names the exact accepted base, Correction, observed identity, failed step and error, one proposed repair, the required authority, and `resume <runId>`. Exit 1. If ESRCH is not established, exit 3 as a cleanup failure.
2. The human authorizes the repair in the root session; the root performs the authorized repair itself (for example restoring a partial write byte-for-byte to the accepted outer base, or fixing validator availability) and then runs `resume <runId>`.
3. `resume` recreates the runtime over the same private HOME and session directory and calls `ensureSession` with the same `sessionKey` and `resumeSessionId = backendSessionId`. It requires the returned record's `backendSessionId` to equal the parked value, with no fresh-session fallback. It verifies that outer base, Correction, target, mode, scope and authority identities are unchanged, then retries only the exact failed step. Application repair adds no capacity count until one changed application commits.
4. If any reviewer's same-session restore fails (`SESSION_RESUME_REQUIRED`, missing record, changed `backendSessionId`), or any bound identity changed, `resume` stops and asks: it disposes both sessions under A4, prints `## Reconcile stopped` naming the lost identity, exits 1. Nothing rolls back automatically; no fresh A/B is created.
5. `dispose <runId>` is the explicit abandonment of a parked run: A4 cleanup of the parked folder and private root; exit 0 or 3.

**[skill wins]** skill text "Keep the same pair live … during an eligible identity-preserving repair pause" (baseline L512–514) is kept as "keep the same pair's sessions parked and resumable, never disposed or replaced, during an eligible repair pause"; identity semantics are unchanged.

### Q3 Prompts

- Reviewer prompts live in `reconcile/references/reviewer-protocol.md`, merged from the trial `reconcile-reviewer.md` sections `initial`, `rethink`, `later`, `source`, `reask` under marker comments `<!-- prompt:initial -->` etc. with `{{PLACEHOLDER}}` slots. The trial `bootstrap` section is not ported (readiness is dropped with the bootstrap packet). The protocol's semantic text (response contract meanings, pass rules, Correction rules, delegated authorization context) wins over the trial wording. Deleted from the protocol: `## Bootstrap packet`, `## Context-only synchronization packet`, every `lifecycle_channel`, `Synchronized`, `Ready: reviewer`, agent-return/adapter load instruction and connection-bound transport sentence. `## Review passes and response transport` becomes `## Review passes and yield return`: one `yield` whose `data` carries the §2.3 item 4 fields.
- Scope, normalizer and continuation prompts live in `retrace/SKILL.md` under a new final section `## Scope evaluator prompts` with markers `<!-- prompt:evaluate -->`, `<!-- prompt:continue -->`, `<!-- prompt:reask -->`, `<!-- prompt:normalize -->`, merged from the trial `retrace-scope.md`; the Evidence boundary, Method, Readiness and Result sections are referenced by heading and inserted at run time by `lib/prompts.mjs`, not duplicated.
- `lib/prompts.mjs` `loadPrompts({ reviewerProtocolPath, retraceSkillPath })` reads both files at run start, extracts each marker section up to the next marker or heading, and refuses (exit 2) if any required marker is missing or duplicated. One editable copy of each prompt exists; no `prompts/` directory is created. Tests inject a `prompts` object and never write marker files.
- Removed: `harnesses/omp/agents/second-opinion-{a,b}.md`; `.config/scripts/bootstrap` L28–29; `~/.omp/agent/agents/second-opinion-{a,b}.md` only if `readlink` prints the corresponding `/Users/kim/.dotfiles/.config/agents/harnesses/omp/agents/second-opinion-{a,b}.md` (observed true 2026-09-27). Bootstrap is not run.

### Q4 Versions

`lib/versions.mjs`:

```js
export const OMP_VERSION = "omp/18.3.0";
export const ACPX_VERSION = "0.19.2";
export const ACP_SDK_VERSION = "1.4.0";
```

`checkVersions({ controllerRoot, pathEnv })` resolves `omp` through `pathEnv` to an absolute executable path, runs `<abs omp> --version` with `execFile`, and requires trimmed stdout `=== "omp/18.3.0"`. It requires `node_modules/acpx/package.json` `version === "0.19.2"` and `package-lock.json` `packages["node_modules/acpx"].version === "0.19.2"` (and the same pair for the SDK at `1.4.0`). Any mismatch or read failure refuses before any launch with a stop record naming observed and expected values; exit 2. The resolved absolute path is the registry command for every child.

### Q5 Undisposed-run preflight

`lib/preflight.mjs` `findUndisposedRuns({ sessionsRoot = "/Users/kim/.omp/agent/sessions", tmpRoot = "/tmp", listProcesses, exceptRunId })` refuses when any of:

1. a directory `<sessionsRoot>/acp-controller-*` exists;
2. a directory `<tmpRoot>/acp-controller-*` exists;
3. a process from `listProcesses()` (default: `ps -A -ww -o pid=,command=` via `execFile`) has a command line containing ` acp ` and `--session-dir <sessionsRoot>/acp-controller-`.

`exceptRunId` (set only by `resume <runId>` and `dispose <runId>`) exempts exactly that run's folder and private root; a matching live process still refuses. Trial leftovers (`acpx-trial-*` folders, PID 56135, `/Users/kim/.omp/profiles/acpx-trial-inspect`) cannot match the prefix. The preflight never signals, reads, or deletes anything. Refusal lists the matched paths/PIDs and says to dispose that run first (`dispose <runId>` or its existing disposal authority); exit 2. `sessionsRoot`, `tmpRoot` and `listProcesses` are injectable for offline tests.

### Q6 Tests

See §7. Runner: `node --test "test/*.test.mjs"` (the controller is Node, not bun). Location: `acp-controller/test/*.test.mjs`.

### Q7 Models

`lib/models.mjs` `readModelRoles({ ompPath, env })` runs `<abs omp> config list --json` with the child env (§3.3; `PI_CODING_AGENT_DIR` points at the live agent dir) and reads only `modelRoles.value.second_opinion_a` and `.second_opinion_b`. Each value splits at its last `:` into `--model <id> --thinking <level>`; a missing role, an unparsable value or an empty part refuses (exit 2). The scope evaluator and normalizer use A's pair. Observed 2026-09-27: A = `anthropic/claude-opus-5-5:medium`, B = `xai-oauth/grok-4.7:medium` (working tree `config.yml` L86–87; not pinned).

### Q8 ADR-0010, carve-outs, evals

**ADR-0010** (`docs/adr/0010-replacement-lifecycle-plugin.md`, filename kept): rewritten in place.

- Title `# ADR-0010 — acpx controller for Retrace and Reconcile`; Scope and Context describe the controller.
- D31 clauses 1–6 restated for the controller: (1) the controller alone owns reviewer, normalizer and scope-evaluator sessions through public acpx and native `omp acp`; only the admitted domain-valid native `yield` candidate is a reply (decision 1 KB1 wording); (2) first reply kept and visible only to its owning parent (KS1); (3) reply, turn result and reuse state separate (KS2); (4) a request stays pending until reply, concrete terminal failure or explicit abort (KS3); (5) capacity: at most four direct Retrace actors, a permit frees only on observed disposal (KT3); (6) disposal counts only on observed process exit, children before parents, failed disposal blocks success (KS4, KS6, KR14).
- Clause 7 restated without plugin sentences: the two skills and the reviewer protocol are the semantic owners; the controller has no fallback reply channel.
- Clause 8 (proof export) dropped.
- Clause 9 verbatim: "The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged. Their exact implementation-child exemptions do not replace or weaken these named custom-controller lifecycle contracts."
- Consequences, Affected contracts (L46–60: replace plugin paths with `harnesses/omp/acp-controller/`, the two skills, the protocol), Authority (cite this spec revision) and Verification (A3, A5, A7) updated. `## Rejected alternatives` and `## Supersession` left unchanged (S2-exempt history).

**INDEX:** L18 row → `[ADR-0010 — acpx controller for Retrace and Reconcile](0010-replacement-lifecycle-plugin.md) | ACTIVE | One Node controller over public acpx and native omp acp owns Retrace/Reconcile sessions, yield-only admission, capacity and observed-exit disposal | D31`. L26 row: answer column `ADR-0010 D31`; locations `retrace/SKILL.md`, `reconcile/SKILL.md`, `reconcile/references/reviewer-protocol.md`, `harnesses/omp/acp-controller/`.

**ADR-0004:** delete L39's second sentence ("Reconcile's current map remains untouched and does not become generic runtime authority.") and the L52 bullet ("- Existing Reconcile files remain separate and unchanged."); L62 unchanged. **ADR-0002:** L61 → "Capable other-host topology remains unchanged."; L64 → the controller sentence below.

**Carve-out replacement sentence** (used verbatim wherever a site said Reconcile/Retrace keep their named lifecycle-consumer contracts):

> Reconcile and Retrace run under their acpx controller (`harnesses/omp/acp-controller/`), which owns their reviewer and scope sessions, first replies, pending observation, capacity and observed-exit disposal.

Sites (replace wording only; nothing else changes in these files):

| File | Lines (baseline) | Action |
|---|---|---|
| `skills/dev-implementation/SKILL.md` | L22 "Named lifecycle consumers keep their own contracts."; L133–135 | replace with the sentence |
| `skills/dev-implementation/references/plan-orchestration.md` | L13 | replace the lifecycle-consumer clause with the sentence |
| `skills/dev-ask/SKILL.md` | L67–69 | replace "or alter the named Reconcile/Retrace lifecycle-consumer contracts for …" clause by ending the sentence at "restatement allowance." and appending the sentence |
| `skills/dev-ask/WORKFLOW.md` | L29–31; L119 | L29–31 second sentence → the sentence; L119 → "Capable other-host topology remains unchanged, and Reconcile and Retrace keep their acpx controller." |
| `skills/dev-ask/references/execution-flow.md` | L74; L109–111 | L74 → "This host gate does not alter capable other-host topology or the Reconcile/Retrace acpx controller."; L109–111 → the sentence |
| `skills/dev-ask/evals/evals.json` | L3728 rubric | "…keep capable other-host topology and the Reconcile/Retrace acpx controller unchanged." |
| `references/agent-return/return.md` | L51–74 `## Retrace and Reconcile lifecycle runs`; L191–210 `## Retrace and Reconcile optional proof export`; L53 | replace L51–74 with a two-line section `## Retrace and Reconcile` containing the sentence; delete L191–210 |
| `harnesses/omp/agent-return.md` | L12–15, L29–91 `## Named lifecycle consumer adapter`, L70, L72, L80–83, L105–108, L139–140, L287–288, L358–363, L373–377, L413–419 | delete the adapter section and proof-export section; Evidence scope drops the plugin file bullets; each remaining sentence that exempted Retrace/Reconcile becomes the sentence or is deleted where the sentence already appears in that section |
| `docs/adr/0002-executor-plans-and-orchestration.md` | L61, L64 | as above |

`references/agent-return/test_decode.py` is not edited.

**Evals:** `reconcile/evals/evals.json` keeps 12 entries and `retrace/evals/evals.json` 21 entries with unchanged IDs except `REC-SYNC-REPAIR-RESUME` → `REC-REPAIR-RESUME`. Each entry's `prompt`, `expected_output` and `assertions` are re-derived from the rewritten skills: lifecycle-plugin, named-run, `lifecycle_channel`, readiness-line, synchronization and connection-bound facts become controller facts (CLI invocation, yield-only admission, C4 3-re-ask budget, park/resume repair, observed-exit disposal). `REC-REPAIR-RESUME` asserts: failed application → stop record with base/Correction/observed/failed-step/repair/authority; no rollback; `resume <runId>` retries only that step on the same reviewer sessions; lost identity → stop and ask.

### Q9 Dependencies

`harnesses/omp/extensions/package.json`: remove `@oh-my-pi/pi-utils` (only `lifecycle-supervisor.js` L2 imports it). Keep `@oh-my-pi/pi-coding-agent` (`plan-artifact-sync.js` L9 imports `@oh-my-pi/pi-coding-agent/internal-urls`), `@types/bun`, `typescript`. `key-remaps.js` imports `@oh-my-pi/pi-tui`, which is not a direct devDependency today; unchanged (out of scope). Regenerate `bun.lock` with `bun install` in that directory. `config.yml` L50 (`- ~/.dotfiles/.config/agents/harnesses/omp/extensions/lifecycle-plugin.js`) is deleted; L48–49 and `modelRoles`/`agentModelOverrides` second-opinion keys stay.

### Q10 Spend

`lib/spend.mjs`: for every actor, the last public `getStatus` sample taken immediately before close supplies `usage.cost.amount`, `usage.cost.currency` and `usage.cumulative.totalTokens` (trial `sampleStatus` projection). The record ends with:

```markdown
## Spend

| Actor | Model | Tokens | Cost |
|---|---|---|---|
| A | anthropic/claude-opus-5-5 | 123456 | 1.23 USD |
| Total | | 123456 | 1.23 USD |
```

A missing value prints `unknown`; a total with any unknown member prints `≥ <known sum> (unknown members)`. No token or USD cap exists. Retrace rows are keyed `<scope>/evaluator`, `<scope>/A`, `<scope>/B`, plus `normalizer`.

## 6. Guard allocation (29 guards; KS8 not adopted)

"Controller" paths are under `.config/agents/harnesses/omp/acp-controller/`. "Skill" anchors are the post-cutover headings each named file must carry. The `Anchor` column is the literal that A4 greps for.

| Guard | Location (file) | Anchor (literal) | Behavior | Proof |
|---|---|---|---|---|
| KR1 | `skills/reconcile/SKILL.md` | `## Reconcile brief` | five-field brief, approval, candidate order; CLI rejects missing/ambiguous approval | eval `REC-ORDER-AUTHORITY`; `cli.mjs` refusal (exit 2) |
| KR2 | `controller.mjs` | `export function applyCorrection` | Conversation replacement vs Artifact edits paths | `reconcile.test.mjs` KR8 cases (both modes) |
| KR3 | `controller.mjs` | `export function validateApproval` | cap `none`/positive int; counts committed applications; one closure-only iteration | `reconcile.test.mjs` KR10 case (cap 1 → closure-only) |
| KR4 | `controller.mjs` | `async function getReviewer` | same persistent read-only A/B; never replaced; same-session restore only | `reconcile.test.mjs` KR13 case; A7 live |
| KR5 | `controller.mjs` | `export async function runReconcile` | A starts every outer iteration incl. closure; B only after applicable REVISE | `reconcile.test.mjs` `KR5` |
| KR6 | `controller.mjs` | `async function reviewTurn` | initial → same-session rethink → post-rethink; later skips; source-need continues the pass | `reconcile.test.mjs` `KR6` |
| KR7 | `lib/schema.mjs` | `export function validateResult` | VALID/REVISE/BLOCKED meanings; recommendations never applied | `reconcile.test.mjs` `KR5`/`KR9` (VALID with recommendations applies nothing) |
| KR8 | `controller.mjs` | `export function applyCorrection` | one complete replacement / edit set vs unchanged outer base; stacked/unchanged/non-applicable → C4 | `reconcile.test.mjs` `KR8` |
| KR9 | `controller.mjs` | `export async function runReconcile` | first VALID ends negotiation; BLOCKED one approved-context retry; no turn cap | `reconcile.test.mjs` `KR9` |
| KR10 | `controller.mjs` | `async function applyAccepted` | ≤1 application per outer iteration; reread, count, validate; next iteration with A | `reconcile.test.mjs` `KR10` |
| KR11 | `controller.mjs` | `async function finalReread` | cleanup first, then Artifact reread; drift stops | `reconcile.test.mjs` `KR11` |
| KR12 | `skills/reconcile/SKILL.md` | `## Liveness, failure, and repair` | stop list minus synchronization; 4th invalid return stops | `reconcile.test.mjs` `C4` |
| KR13 | `controller.mjs` | `export async function resumeReconcile` | park/resume identity-preserving repair; no rollback; lost identity stops and asks | `reconcile.test.mjs` `KR13` |
| KR14 | `controller.mjs` | `async function disposeReviewers` | both reviewers disposed at end; failed disposal blocks Final proposal | `reconcile.test.mjs` `KR14` |
| KR15 | `controller.mjs` | `export function renderReconcile` | exact Review rounds / Final proposal / Reconcile stopped; reviewer text byte-for-byte | `reconcile.test.mjs` `KR9`, `KR11`, `KR14` compare rendered sections to independently authored expected text |
| KR16 | `controller.mjs` | `reportOnly` | delegated Reconcile Conversation-only, report-only | `retrace.test.mjs` `KT4` |
| KT1 | `skills/retrace/SKILL.md` | `## Invocation contract` | invocation, eligibility, parent/scope/normalizer entries | eval `RETRACE-EXPLICIT-ONLY`; `controller.mjs` `export async function runNormalize` |
| KT2 | `controller.mjs` | `export function validateScopeTable` | complete approved table incl. requires/shared-evidence/potential-conflict; DAG validated | eval `RETRACE-SCOPE-APPROVAL`; `cli.mjs` refusal |
| KT3 | `controller.mjs` | `MAX_DIRECT_ACTORS = 4` | ≤4 direct actors; requires depth then authored order; permit frees on observed disposal | `retrace.test.mjs` `KT3` |
| KT4 | `controller.mjs` | `async function runScope` | evaluate → candidate-ready → accept → begin-reconcile → delegated Reconcile → dispose reviewers → scope-result → accept → dispose scope; source-need/scope-paused return to same step | `retrace.test.mjs` `KT4` |
| KT5 | `skills/retrace/SKILL.md` | `## Freshness and aggregate` | Evidence boundary, Method, Readiness, Result, Freshness and aggregate, Stops, read-only stance left byte-unchanged; `renderRetrace` emits the four sections | A13 check (unchanged sections); eval `RETRACE-FINAL-FRESHNESS` |
| KB1 | `lib/capture.mjs` + both SKILL files | `export function closeRequest` | only admitted domain-valid native `yield` counts; decision-1 sentence in each skill | `reconcile.test.mjs` `C4` (prose-only and failed-yield turns never admitted); A5 grep of the sentence |
| KS1 | `controller.mjs` | `export function admitAtRoot` | first reply kept; only owning parent sees it | `retrace.test.mjs` `KT4` (root receives only scope-result) |
| KS2 | `lib/capture.mjs` | `export function closeRequest` | reply, turn result, reuse separate | `reconcile.test.mjs` `C4` (candidate retained despite failed turn) |
| KS3 | `lib/capture.mjs` | `export async function recoverObservation` | pending until reply, concrete failure or abort; uncertain delivery observed without replay | `reconcile.test.mjs` `C4` (unfinished yield → stop, no re-ask) |
| KS4 | `lib/adapter.mjs` | `export async function closeAndObserve` | disposal only on observed ESRCH | `reconcile.test.mjs` `KS4` |
| KS5 | `controller.mjs` | `export async function runRetrace` | failed member keeps successful siblings | `retrace.test.mjs` `KS5` |
| KS6 | `controller.mjs` | `async function runScope` | children disposed before terminal reply; `terminal: false` source-need/scope-paused only exception | `retrace.test.mjs` `KT4` |
| KS7 | `docs/adr/0010-replacement-lifecycle-plugin.md` | `The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged.` | clause 9 verbatim; generic contracts untouched; both skills keep `### Explicit execution-recovery adoption` | A13 check |

Skill-side kept anchors (task 2a must keep these headings): reconcile `## Preflight and approval`, `## Reconcile brief`, `## Ephemeral state and identities`, `## Reviewer progression` (replaces `## Retained reviewer lifecycle`), `## Outer iterations and negotiation`, `## Application and capacity` (replaces `## Synchronization, application, and capacity`), `## Terminal cleanup`, `## Liveness, failure, and repair`, `## Presentation`; retrace all current headings, with `## Content and return transport`, `### Closed return bodies`, `### Delegated control body`, `### One corrective allowance per original return` rewritten (the last renamed `### Re-ask budget per original return`) and `## Scope evaluator prompts` added.

## 7. Permanent tests (contract-first, test-value.md)

Each test observes consumer-visible behavior through the public controller entry points (`runReconcile`, `runRetrace`, `cli.mjs` refusals) running real public acpx `createSharedAcpRuntime` against a real child process `test/fixtures/scripted-acp-agent.mjs`. No mock of acpx, no private acpx import, no model traffic.

**Scripted agent.** Adapted from the trial fixture (`AgentSideConnection`, `ndJsonStream`, advertised `resume`, `--fail-resume` flag). It is driven by a JSON plan file named in env `SCRIPTED_ACP_PLAN`: responses are queued per `--model` value (tests configure `scripted/a`, `scripted/b`, `scripted/eval`) and consumed per prompt. Each response is one of `yield:<data JSON>`, `invalid:<data JSON>`, `prose`, `unfinished-yield`, `failed-yield`, `forbidden-tool`. It appends `{model, sessionId, pass-marker, promptSha}` for every received prompt to `SCRIPTED_ACP_LOG` so tests assert actual traffic order. Tests pass `ompPath` = the scripted launcher and an injected `readModelRoles` result; `checkVersions` and `findUndisposedRuns` are injected only where the test is not about them. Temp dirs replace `/Users/kim/.omp/agent/sessions` and `/tmp` via injected roots; the suite never touches the live store.

| File | Test name prefix | Contract asserted (observable result) |
|---|---|---|
| `test/reconcile.test.mjs` | `C4` | three invalid returns (invalid data, prose-only completed turn, failed-only yield) each get one re-ask; the fourth stops with `## Reconcile stopped`; an unfinished yield stops without charge or re-ask; the first invalid candidate is not replaced by a later valid one |
| | `KR5` | across 2 outer iterations incl. closure, every iteration's first prompt goes to A; B receives a prompt only after an applicable REVISE |
| | `KR6` | first review per reviewer = initial, rethink, post-rethink in the same session; later reviews have no rethink; a source-need exchange does not add a rethink |
| | `KR8` | Artifact REVISE edit set applies against the outer base; a second REVISE supersedes, not stacks; an unchanged or non-applicable Correction is a C4 invalid return |
| | `KR9` | first VALID ends negotiation; BLOCKED → one approved-context retry → second BLOCKED stops; VALID recommendations change nothing |
| | `KR10` | an accepted change is applied once, file reread, count 1, validator run, next iteration starts with A; with cap 1 the next iteration is closure-only and cannot apply |
| | `KR11` | Artifact file modified between closure VALID and report → stop with reviewed and observed identities, after both reviewers are disposed |
| | `KR13` | failed validator → parked record + `resume` on the same `backendSessionId` retries only validation and reaches `## Final proposal`; with `--fail-resume` the resume stops and asks, and no new session is created |
| | `KR14` | both reviewers disposed on success; injected PID observer reporting present → no `## Final proposal`, exit class cleanup failure |
| | `KS4` | `closeAndObserve` on a real scripted child: with the real signal-0 observer the exited child yields ESRCH and counts as disposed; with an injected `observePid` returning `present` or `EPERM`, the same resolved close + `details.closed === true` is reported not disposed |
| `test/retrace.test.mjs` | `KT3` | 6 scopes, depths 0/0/0/0/0/1: at most 4 evaluators live at any time (scripted log timestamps), dispatch order depth-then-authored, the fifth scope starts only after a slot's evaluator shows ESRCH |
| | `KT4` | per-scope order evaluate → candidate-ready → begin-reconcile → A/B prompts → reviewers ESRCH → scope-result → scope evaluator ESRCH; `scope-paused` and `source-need` return to the same step; delegated Artifact mode rejected |
| | `KS5` | one scope's evaluator returns four invalid returns → that scope stops; a sibling's resolved result and report remain in the aggregate as `partial` |
| `test/preflight.test.mjs` | `preflight` | an `acp-controller-*` folder under the injected sessions root, or a listed process with ` acp ` and the prefix, refuses with exit 2 and launches nothing; `acpx-trial-*` folders and a trial-shaped process do not refuse; `exceptRunId` exempts only its own run |
| | `A9` | a PATH-injected fake `omp` printing `omp/18.2.0`, or a fixture root whose acpx version is `0.19.1`, refuses before any launch (scripted log stays empty) with the observed version in the stop record |

Excluded as low-value under test-value.md (proved by throwaway scripts or static checks instead): prompt-marker extraction wiring, overlay content, env pass-through lists, spend-table formatting, argv assembly. Expected rendered text in KR9/KR11/KR14 is authored in the test, never computed by `renderReconcile`.

## 8. Acceptance criteria

Run from `/Users/kim/.dotfiles` unless stated. `$C` = `.config/agents/harnesses/omp/acp-controller`. `$CKPT` = the checkpoint commit SHA from A1.

**A1 Checkpoint.** Check: `git show --name-only --format=%s HEAD` immediately after the checkpoint commit; expect line 1 `chore(agents): checkpoint lifecycle-plugin state before acp cutover` and every following non-empty line starting with `.config/agents/`, `docs/adr/`, or equal to `.agents/papercuts.json`. Check: `git status --short -- .config/agents docs/adr .agents/papercuts.json`; expect no output. Direct static proof: the approval record shows the exact staged path list before the commit.

**A2 Lean-plan close.** Check: `git show --name-only --format= HEAD` after the close commit; expect exactly `.agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md` and `.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md`. Check: `shasum -a 256 .agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md`; expect `376fd634f0c6c772252fe6929547a2d1bc0a5ba161477935a9cdaa7e1635fe51`. Check: `python3 .config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md`; expect output containing `"status": "valid"` and `"lifecycle_status": "CLOSED"`. Check (only the Status line changed): `git show HEAD:.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md | python3 -c "import sys,hashlib;t=sys.stdin.buffer.read();assert t.count(b'**Status**: CLOSED')==1;print(hashlib.sha256(t.replace(b'**Status**: CLOSED',b'**Status**: PENDING')).hexdigest())"`; expect `b4a1008606bad986b02202217366290842f512693809c6d7ad040ba19113b4de`. Direct static proof: no `git push` in the task record.

**A3 Offline suite.** Check: `cd $C && npm ci && node --test --test-reporter=spec "test/*.test.mjs"` (`npm ci` needs the npm registry once; the tests themselves are offline); expect exit 0, `ℹ fail 0`, and test names beginning with each of `C4`, `KR5`, `KR6`, `KR8`, `KR9`, `KR10`, `KR11`, `KR14`, `KS4`, `KT3`, `KT4`, `KS5`, `preflight` (13), plus `KR13`, `A9`. Direct static proof: `grep -rn "omp acp\|/Users/kim/.local/bin/omp" $C/test` prints nothing (no native launch).

**A4 Guard mapping.** Check: for each row of §6, `grep -F -- "<Anchor>" <Location>` (with `$C/` prefixed for controller paths, `.config/agents/` for `skills/` paths, and `docs/` paths used as written); expect ≥1 match for all 29 rows, 0 misses. Direct static proof: §6 has exactly 29 rows, IDs KR1–KR16, KT1–KT5, KB1, KS1–KS7, and no KS8 row.

**A5 Static checks.**
(a) Check: run this scan with `python3 - <<'EOF'` … `EOF` from the repository root; expect last line `violations: 0` and exit 0.

````python
import os, re, sys
PATTERNS = [r"lifecycle_channel", r"lifecycle-plugin", r"lifecycle[- ]consumer", r"tool\.lifecycle", r"xd://lifecycle", r"Ready: reviewer", r"Synchronized"]
RX = re.compile("|".join(PATTERNS))
EXEMPT_HEADINGS = {"History", "Revision history", "Changelog", "Supersession", "Rejected alternatives"}
EXEMPT_FILE = ".config/agents/references/agent-return/test_decode.py"
HEAD = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
hits = []
for top in (".config/agents", "docs/adr"):
    for dp, dns, fns in os.walk(top):
        dns[:] = sorted(d for d in dns if d != "node_modules")
        for fn in sorted(fns):
            p = os.path.join(dp, fn)
            if p == EXEMPT_FILE:
                continue
            try:
                text = open(p, encoding="utf-8").read()
            except (UnicodeDecodeError, OSError):
                continue
            stack, fence = [], False
            for n, line in enumerate(text.split("\n"), 1):
                if p.endswith(".md"):
                    if line.lstrip().startswith(("```", "~~~")):
                        fence = not fence
                    m = None if fence else HEAD.match(line)
                    if m:
                        lvl = len(m.group(1))
                        stack = [s for s in stack if s[0] < lvl] + [(lvl, m.group(2))]
                        continue
                    if any(t in EXEMPT_HEADINGS for _, t in stack):
                        continue
                masked = line.replace("replacement-lifecycle-plugin", "")
                for m2 in RX.finditer(masked):
                    hits.append(f"{p}:{n}: {m2.group(0)}")
print("\n".join(hits))
print(f"violations: {len(hits)}")
sys.exit(1 if hits else 0)
````

Baseline 2026-09-27: `violations: 78` in 23 files, all at planned edit/deletion sites. S2 exemptions, verbatim: "Exempt only: (1) sections headed History, Revision history, Changelog, Supersession, or Rejected alternatives; (2) references/agent-return/test_decode.py; (3) "lifecycle-plugin" when it is part of the identifier "replacement-lifecycle-plugin" (the ADR-0010 filename and links to it, replacement-lifecycle-plugin/spec-v5, and that spec's and plan's paths). Every other match fails."
(b) Check: `for f in .config/agents/skills/reconcile/references/execution-flow.md .config/agents/harnesses/omp/agents/second-opinion-a.md .config/agents/harnesses/omp/agents/second-opinion-b.md; do test -e "$f" && echo "$f"; done`; expect no output.
(c) Check: `grep -n lifecycle .config/agents/harnesses/omp/config.yml`; expect no output (exit 1).
(d) Check: `find $C -name '*.mjs' -not -path '*/node_modules/*' -exec node --check {} \; -print`; expect every controller file printed and no error output, exit 0.
(e) Check: `cd .config/agents/harnesses/omp/extensions && find . -name '*.test.js' -not -path './node_modules/*' && bun test`; expect `./plan-artifact-sync.test.js` as the only file listed and `0 fail` (H-S3).
KB1 sentence: Check: `grep -c "never count and are never a fallback" .config/agents/skills/reconcile/SKILL.md .config/agents/skills/retrace/SKILL.md`; expect `1` for each file.

**A6 Test audit and fix batch.** Direct static proof: the `dev-test-audit` Handoff records the human-approved ordered file list (`$C/test/preflight.test.mjs`, `$C/test/reconcile.test.mjs`, `$C/test/retrace.test.mjs`, `$C/test/fixtures/scripted-acp-agent.mjs`, `.config/agents/skills/reconcile/evals/evals.json`, `.config/agents/skills/retrace/evals/evals.json`) and either the accepted proposal or a named stop. The fix-batch Handoff records the applied batch or `no accepted findings`, and original A's closure result verbatim (including `NOT CLOSED` or `original-A closure unavailable`). Check: A3 command after the batch; expect exit 0, `ℹ fail 0`. Direct static proof: no second fix-batch task exists in the plan.

**A7 Live runs (three).** Each run starts from a new real OMP session (started after task 2c so `config.yml` no longer loads the plugin) through the skill, not a trial runner. Before each run, record `shasum -a 256` of: the Reconcile/Retrace skill files, `reviewer-protocol.md`, `skills/rethink/SKILL.md`, both evals files, `harnesses/omp/config.yml`, every evidence/context locator the run reads, and the trial-bundle aggregate command of §1.1. Check after each run: the same commands; expect identical digests (trial aggregate `5c2563410027f0fe961cf679e8d8451ae5f506dc6245153fffdaff19c4cd2b99`); in Artifact mode the temp copy is the only changed file. Check: `ps -o pid= -p <each PID printed in the run record>`; expect no output. Check: `ls -d /Users/kim/.omp/agent/sessions/acp-controller-* /tmp/acp-controller-* 2>/dev/null`; expect no output. Check: stdout record contains `## Spend` with a Total row. Run-specific expectations:
- Conversation: exit 0; `## Review rounds` shows a first admitted VALID; `## Final proposal` with **Proposal**.
- Artifact on a harmless temp copy under `/tmp`: exit 0; one committed application (Review rounds shows one `applied` outcome); **Current identity** equals `shasum -a 256` of the temp copy taken after the run (KR11 reread).
- Retrace: ≥2 scopes, one `requires` link, one delegated Reconcile, exit 0 or 1, all four aggregate H2 sections present in order.

**A8 Ordering.** Direct static proof: the plan's live-run task depends on the audit and fix-batch tasks; the live-run Handoff timestamps are later than the second approval, the audit Handoff and the fix-batch Handoff.

**A9 Version pin.** Check: A3 `A9` test passes. Direct static proof: `$C/lib/versions.mjs` holds `OMP_VERSION = "omp/18.3.0"` and `ACPX_VERSION = "0.19.2"`, and `cli.mjs` calls `checkVersions` before `readModelRoles` and before creating any runtime.

**A10 Removals.** Check: `for f in lifecycle-plugin.js lifecycle-supervisor.js lifecycle-consumers.js lifecycle-plugin.test.js lifecycle-read-verbatim.yml fixtures/lifecycle-rpc-worker.js; do test -e .config/agents/harnesses/omp/extensions/$f && echo $f; done`; expect no output. Check: `grep -c second-opinion .config/scripts/bootstrap`; expect `0`. Check: `ls ~/.omp/agent/agents/ | grep -c second-opinion`; expect `0`. Check: `grep -rln -e 'prompt:initial' -e 'prompt:evaluate' .config/agents --exclude-dir=node_modules`; expect exactly `.config/agents/skills/reconcile/references/reviewer-protocol.md` and `.config/agents/skills/retrace/SKILL.md`. Check: `find $C -type d -path '*prompts*' -not -path '*/node_modules/*'`; expect no output. Plus A5(b).

**A11 Trial isolation.** Check: `grep -rn "acpx-omp-acp-trial\|omp-trial\|acpx-trial-" $C --exclude-dir=node_modules`; expect no output. Check: the §1.1 aggregate command; expect `5c2563410027f0fe961cf679e8d8451ae5f506dc6245153fffdaff19c4cd2b99`. Check: `find $C -not -path '*/node_modules/*' \( -name pins.mjs -o -name run.mjs -o -name t3.mjs -o -name debugloop.mjs -o -name approval-drift.json -o -path '*/fixtures/mechanics*' \)`; expect no output. Check: `grep -n 'AGENT_ID = ' $C/lib/adapter.mjs`; expect `AGENT_ID = "omp-acp-controller"`.

**A12 Code location.** Check: `cd $C && npm ls acpx @agentclientprotocol/sdk --json`; expect `acpx` `0.19.2` and `@agentclientprotocol/sdk` `1.4.0`. Check: `node -e 'const p=require("./package.json");console.log(p.engines.node,p.type)'` in `$C`; expect `>=22.13.0 module`. Check: `git ls-files $C/package-lock.json`; expect the path (committed at delivery).

**A13 References.** Check: `head -1 docs/adr/0010-replacement-lifecycle-plugin.md`; expect `# ADR-0010 — acpx controller for Retrace and Reconcile`. Check: `grep -cF "The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged. Their exact implementation-child exemptions do not replace or weaken these named custom-controller lifecycle contracts." docs/adr/0010-replacement-lifecycle-plugin.md`; expect `1`. Check: `grep -c "proof export" docs/adr/0010-replacement-lifecycle-plugin.md`; expect `0` outside the exempt sections (A5 scan covers plugin text). Check: `sed -n 18p docs/adr/INDEX.md` contains `acpx controller`; `sed -n 26p docs/adr/INDEX.md` contains `acp-controller`. Check: `grep -c "Reconcile's current map remains untouched\|Existing Reconcile files remain separate and unchanged" docs/adr/0004-canonical-discovery-and-continual-learning.md`; expect `0`; `git diff $CKPT -- docs/adr/0004-canonical-discovery-and-continual-learning.md` shows only those two removals (L62 untouched). Check: `git diff --quiet $CKPT -- .config/agents/references/agent-return/test_decode.py`; expect exit 0. Check: `git diff -U0 $CKPT -- <each §5 Q8 carve-out file>`; expect hunks only at the listed lines. Check: `python3 -c "import json;[print(len(json.load(open(f'.config/agents/skills/{s}/evals/evals.json'))['evals'])) for s in ('reconcile','retrace')]"`; expect `12` then `21`. Check: `grep -c REC-SYNC-REPAIR-RESUME .config/agents/skills/reconcile/evals/evals.json`; expect `0`; `grep -c '"REC-REPAIR-RESUME"'`; expect `1`. Direct static proof: the KT5 sections of `retrace/SKILL.md` (`## Evidence boundary` through `## Stops`) are byte-identical to baseline: Check: `python3 -c "import hashlib;t=open('.config/agents/skills/retrace/SKILL.md','rb').read();i=t.index(b'\n## Evidence boundary\n')+1;j=t.index(b'\n## Scope evaluator prompts\n');print(hashlib.sha256(t[i:j]).hexdigest())"`; expect `dfc6e82139bcc499703da8e4c73a861afb364d3b7e1550a3f559478ab881c037` (baseline hash of the text from `## Evidence boundary` to end of file, which the new prompts section must follow).

## 9. Implementation seams (plan order)

Sizing basis: `task-sizing.md` (one fresh worker attempt ≈ 200k tokens).

0. **Checkpoint and lean close** — Main, after the second approval; A1, A2. No dependencies beyond approval.
1. **Controller and offline suite** — too large for one attempt (≈2,000 adapted lines + fixture + 3 test files + trial reading). Safe split:
   - **1a Native layer and CLI shell:** `package.json`/lock, `config/`, `lib/{adapter,window,capture,export,io,env,versions,preflight,models,prompts,spend}.mjs`, `cli.mjs` refusal paths, `test/fixtures/scripted-acp-agent.mjs`, `test/preflight.test.mjs`. Proof: A5(d), preflight + A9 tests, A11, A12. Depends on 0.
   - **1b Semantic controller:** `controller.mjs`, `lib/schema.mjs`, `lib/ports.mjs`, `cli.mjs` run/resume/dispose paths and rendering, `test/reconcile.test.mjs`, `test/retrace.test.mjs`. Proof: A3, A4 controller rows. Depends on 1a.
2. **Skills and references** — too large for one attempt (≈380 KB of inputs). Safe split:
   - **2a Skills and prompts:** `reconcile/SKILL.md`, `reviewer-protocol.md`, `retrace/SKILL.md` rewrites with markers; delete `execution-flow.md`. Proof: `loadPrompts` against the real files (throwaway script), A4 skill rows, KT5 hash, KB1 grep. Depends on 1b (marker names and data fields).
   - **2b Evals:** re-derive both evals files; rename. Proof: A13 eval checks, JSON parse. Depends on 2a. If one attempt cannot hold both files, split per skill (reconcile first).
   - **2c ADR, carve-outs, removals, config, deps:** ADR-0010/INDEX/ADR-0004/ADR-0002, carve-out table, extension and agent-file removals, bootstrap L28–29, user symlinks, `config.yml` L50, `package.json`/`bun.lock`. Proof: A5 (all), A10, A13. Depends on 2a.
3. **dev-test-audit** — its own Route Overview approval of the A6 ordered list. Depends on 1b, 2b.
4. **One fix batch** — accepted fixes return to dev-ask; one Route Overview approves the exact batch; targets limited to the audited files and test-only seams (a file outside decision-6 scope stops and asks); "no accepted findings" when A accepts with none; original A performs one closure check whose `NOT CLOSED` or `original-A closure unavailable` is a residual risk, not a blocker; never a second batch. Proof: A6, A3 rerun. Depends on 3.
5. **Live runs, then dev-code-review and dev-verification** — three A7 runs in a new OMP session; then review and verification of A1–A13. Depends on 2c and 4 (A8).

## 10. Risks

- `[INFERENCE]` Park/resume (KR13) is proven against the scripted agent after close plus observed exit, not after shutdown-as-disposal. The trial proved native same-ID restore after idle expiry. The live runs do not exercise KR13. A native failure stops and asks, never a fresh reviewer.
- `[INFERENCE]` `ttlMs: 0` and omitted `timeoutMs` mean "no timeout" per acpx 0.19.2 source reading; the offline suite exercises the path but not multi-hour turns.
- PID reuse can cause a conservative false cleanup failure (trial spec A4); the observer never kills.
- OMP maps some provider errors to `end_turn`, which reaches the completed/no-result C4 row and spends a re-ask.
- The tool policy is detect-after, not a sandbox; runs touch the live OAuth store for token refresh.
- Session files are visible in other OMP session lists while a run is active (direct-child session folder).
- The `config.yml` plugin-line removal takes effect only in newly started OMP sessions; an old session still has the plugin loaded until restarted.
