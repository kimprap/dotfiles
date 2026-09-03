# Reconcile Controller Redesign

**Datetime**: 2026-09-03-0550
**Mode**: implementation
**Scope**: Reconcile controller and reviewer protocol, OMP reviewer projections, semantic evals, non-runtime human flow map, and D15/D23 source-role projections
**Summary**: Implement the confirmed single-reviewer-convergence design while preserving Main-only mutation, persistent A/B reviewers, bounded provenance, and safe repair. Add a human-only execution-flow map and synchronize the focused ADR/index authority without changing generic workflow runtime behavior.
**Status**: DONE
**Completed At**: 2026-09-03-1342

## Objective

### Context

The user confirmed the complete Reconcile redesign at `conversation@sha256:ea069ab70366f5d79f44155014a4a8201e5fe7fbb2042d5ee09f5a88b08ad3d5`. The confirmed Handoff adds one non-blocking clarification: at every outer-iteration start, the working proposal equals the outer base; finalized `REVISE` Corrections define only later changed working proposals. The implementation must replace the current mandatory A-then-B and mutate-on-REVISE behavior, keep IRC as the sole authoritative finalized-response channel, and make `references/execution-flow.md` a non-runtime human maintenance map.

- Outcome: OUT-RECONCILE-REDESIGN
- Observable end state: Explicit Reconcile invocation binds the optional application cap, retains both reviewers before review, negotiates an ephemeral working proposal until one finalized exact `VALID`, synchronizes the already-live counterpart before any mutation or terminal presentation, applies at most once per outer iteration, and repeats from an A-led outer base until unchanged closure or a named stop. The two executable owners, their OMP reviewer projections, five semantic eval cases, the non-runtime human map, and D15/D23 discovery agree on that behavior.
- Progress signal: One named AC-RECONCILE criterion passes on the exact final target, or one named BLK-RECONCILE blocker is resolved with new evidence. Another opinion, repeated wording, elapsed time, or an unchanged proposal is not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-RECONCILE-REDESIGN | Human-confirmed design evidence and Common Handoff | `agent://ReconcileDesignGrill` | `conversation@sha256:ea069ab70366f5d79f44155014a4a8201e5fe7fbb2042d5ee09f5a88b08ad3d5`; artifact `sha256:2d0e98117d73963f0d02a035964917980ecd304572009124bc0ad109e97d935f` | User confirmed VALID on 2026-09-03; repository execution still requires native approval of this exact plan. |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-RECONCILE-CONVERGENCE | AUTH-RECONCILE-REDESIGN | Use single-reviewer acceptance, not A/B agreement. The first finalized current-identity VALID ends inner negotiation; provisional initial VALID is nonterminal; VALID never applies recommendations. |
| DEC-RECONCILE-CANDIDATES | AUTH-RECONCILE-REDESIGN | Preserve immutable run original and outer base. Initialize working proposal to the outer base, then let each finalized REVISE completely supersede ephemeral working state with bounded lineage while canonical bytes remain unchanged. |
| DEC-RECONCILE-REVIEWERS | AUTH-RECONCILE-REDESIGN | Spawn and retain both persistent read-only reviewers before outer iteration one. Each reviewer runs initial then post-rethink exactly once on its first actual reviewing turn; every later review uses later without rethink. |
| DEC-RECONCILE-TRANSPORT | AUTH-RECONCILE-REDESIGN | IRC alone authorizes finalized responses. One exact final local echo is inspectability-only and ignored by Main; provisional initial uses the ordinary result; context synchronization produces only a delivery receipt. |
| DEC-RECONCILE-CONTROLLER | AUTH-RECONCILE-REDESIGN | Every outer iteration starts with A. REVISE alternates reviewers without numeric turn cap, VALID triggers counterpart synchronization, and Main mutates once only after successful synchronization. |
| DEC-RECONCILE-CAP-REPAIR | AUTH-RECONCILE-REDESIGN | Bind a default-none positive-integer application cap with one read-only closure iteration. Preserve VALID only across identity-preserving repair; content identity changes invalidate it. |
| DEC-RECONCILE-MAP | AUTH-RECONCILE-REDESIGN | Keep exactly two executable semantic owners. Use `references/execution-flow.md` only as a human chart/table for control-flow maintenance, with edit-time synchronization and no live load or authority. |
| ADR-0001 | D15 at `sha256:b14c7740d9555fb32467c9103386c815c4c15173cdb21db99d182ec58081632d` | Amend the active semantic-source-role decision in place; do not create a new decision ID or superseding ADR. |
| ADR-0004 | D23 at `sha256:f5dc8835f8a602096bd03d154142445ab0dde958d8debb84489993926f3530ea` | Amend focused provenance in place and project the refined scope through the existing index entries. |

## Scope, non-goals, and prohibited effects

- Read surfaces: Confirmed Handoff; current Reconcile skill, protocol, evals, reviewer adapters, `skill://rethink`, packed-label and craft-skill guidance; D15, D23, ADR index; current OMP configuration, reviewer symlinks, CLI/RPC documentation; plan and Handoff contracts.
- Change surfaces: `.config/agents/skills/reconcile/SKILL.md`, `.config/agents/skills/reconcile/references/reviewer-protocol.md`, `.config/agents/skills/reconcile/references/execution-flow.md`, `.config/agents/skills/reconcile/evals/evals.json`, `.config/agents/harnesses/omp/agents/second-opinion-a.md`, `.config/agents/harnesses/omp/agents/second-opinion-b.md`, `docs/adr/0001-dev-workflow-authority-and-routing.md`, `docs/adr/0004-canonical-discovery-and-continual-learning.md`, and `docs/adr/INDEX.md` only.
- Non-goals: Changing `rethink`, reviewer models or role mappings, OMP runtime/configuration, bootstrap mappings, generic catalog skills or their root `WORKFLOW.md`, dev-ask runtime/evals, the stale-contract scanner, other ADR decisions, a repository eval runner, persistent Reconcile state, or a runtime chart parser. Existing unrelated `.config/agents/harnesses/omp/config.yml` work and `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md` remain untouched.
- Prohibited effects: No package installation, network-fetched tooling, credential/login/config mutation, bootstrap execution, live profile rewrite, broad repository formatting, staging, commit, push, review request, release, deploy, branch/history mutation, or shipping.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-RECONCILE-REPO | Repository write | AUTH-RECONCILE-REDESIGN | After native plan approval, change only the nine named target paths. Preserve unrelated work and use no staging or delivery action. |
| EFF-RECONCILE-SMOKE | Disposable local smoke, bounded model inference, and ordinary OMP runtime accounting | AUTH-RECONCILE-REDESIGN | Authorize one supervised OMP RPC process, the five one-shot generators and five one-shot graders, existing configured provider access, append-only provider usage, and ordinary process-created OMP log/audit/usage records under the existing home. Redirect session payload and memory to the fresh smoke root where supported; remove only that verified root. Do not install, authenticate, change credentials/settings/config/models, or delete shared operational records. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-RECONCILE-CANDIDATE | Run-original, outer-base, working-proposal, and bounded-lineage semantics | T1 | DEC-RECONCILE-CANDIDATES | T1 |
| CONTRACT-RECONCILE-REVIEW | Persistent reviewer lifecycle, pass authority, response grammar, IRC echo, and context synchronization | T1 | DEC-RECONCILE-REVIEWERS; DEC-RECONCILE-TRANSPORT | T1 |
| CONTRACT-RECONCILE-CONTROL | A-led negotiation, first VALID, one mutation, cap, repair, progress, stops, and presentation | T1 | DEC-RECONCILE-CONVERGENCE; DEC-RECONCILE-CONTROLLER; DEC-RECONCILE-CAP-REPAIR | T1 |
| CONTRACT-RECONCILE-MAP | Two executable owners plus one non-runtime chart/table and focused ADR discovery | T1 | DEC-RECONCILE-MAP; ADR-0001 D15; ADR-0004 D23 | T1 |
| CONTRACT-RECONCILE-EVALS | Five declarative semantic cases with thirty behavior assertions | T1 | AUTH-RECONCILE-REDESIGN | T1 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-RECONCILE-SKILL | `.config/agents/skills/reconcile/SKILL.md` | T1 | `sha256:d08e88c746eaeb351bd6bf1eb138e4fbde44ac234401fff04172320232a525a8` | Explicit `/skill:reconcile`, protocol, semantic cases | AC-RECONCILE-CONTROLLER, AC-RECONCILE-TRANSPORT, AC-RECONCILE-STATE, AC-RECONCILE-MAP |
| TGT-RECONCILE-PROTOCOL | `.config/agents/skills/reconcile/references/reviewer-protocol.md` | T1 | `sha256:f708baf1512b27c811ed1148ed8f5ddcedc0e512863a1e28e730e6a88ff07192` | Reconcile controller, OMP reviewer adapters, semantic cases | AC-RECONCILE-CONTROLLER, AC-RECONCILE-TRANSPORT, AC-RECONCILE-STATE, AC-RECONCILE-MAP |
| TGT-RECONCILE-REVIEWER-A | `.config/agents/harnesses/omp/agents/second-opinion-a.md` | T1 | `sha256:c399875bea1faf6f844707dc74a1525326359820821c131bb5a9aee6b4a6de15` | OMP agent discovery and live symlink | AC-RECONCILE-TRANSPORT |
| TGT-RECONCILE-REVIEWER-B | `.config/agents/harnesses/omp/agents/second-opinion-b.md` | T1 | `sha256:4c843efb9d439398cd0943f21eb751e15e52a3cbcfe15dbff4fee1741f560ac9` | OMP agent discovery and live symlink | AC-RECONCILE-TRANSPORT |
| TGT-RECONCILE-EVALS | `.config/agents/skills/reconcile/evals/evals.json` | T1 | `sha256:941336b6c88bba99bc71a1b97e9726cd0eed32dd21ff1ddac6f29970ec51c5e7` | Stateless semantic completion and assertion grading | AC-RECONCILE-CONTROLLER, AC-RECONCILE-TRANSPORT, AC-RECONCILE-STATE |
| TGT-RECONCILE-FLOW | `.config/agents/skills/reconcile/references/execution-flow.md` | T1 | Absent on 2026-09-03 by exact path read | Human control-flow maintenance only | AC-RECONCILE-MAP |
| TGT-RECONCILE-ADR-D15 | `docs/adr/0001-dev-workflow-authority-and-routing.md` | T1 | `sha256:b14c7740d9555fb32467c9103386c815c4c15173cdb21db99d182ec58081632d` | ADR readers and index D15 entry | AC-RECONCILE-MAP |
| TGT-RECONCILE-ADR-D23 | `docs/adr/0004-canonical-discovery-and-continual-learning.md` | T1 | `sha256:f5dc8835f8a602096bd03d154142445ab0dde958d8debb84489993926f3530ea` | ADR readers and index D23 entry | AC-RECONCILE-MAP |
| TGT-RECONCILE-ADR-INDEX | `docs/adr/INDEX.md` | T1 | `sha256:53ead59b4cc7fb7d90e135ce5673caef17b830fcdce4f6f4478ec3542b655fa4` | Repository conditional ADR discovery | AC-RECONCILE-MAP |

## Execution policy

- Assurance: compact
- Topology: one-owner
- Max concurrency: 1
- Isolation: shared tree
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: One fresh semantic owner holds all nine target paths; no sibling may write them.
- Decomposition: One bounded work task keeps executable prose, adapter projections, evals, map, and ADR/index synchronization atomic.
- Effect limit: EFF-RECONCILE-REPO, EFF-RECONCILE-SMOKE
- Orchestrator profile: full-orchestration with `downgrade: none`; the root is mechanical and dispatches T1 to a fresh child.

Compact remains work-only and tail-free. T1 loads `craft-skill`, applicable repository rules, and the exact authority Handoff; uses `Methods: none`; performs same-child worker closure and test-value settlement before final smoke; and returns one Common Handoff to the backend. No independent verification, final review, continual-learning, or audit task is added.

## Tasks

- [x] T1. Implement the confirmed Reconcile controller redesign
  - completed 2026-09-03-1342
  - Owner: reconcile-maintainer
  - Intent: Make Reconcile converge safely before one controlled mutation.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-REVIEWER-A, TGT-RECONCILE-REVIEWER-B, TGT-RECONCILE-EVALS, TGT-RECONCILE-FLOW, TGT-RECONCILE-ADR-D15, TGT-RECONCILE-ADR-D23, TGT-RECONCILE-ADR-INDEX
  - Contracts: CONTRACT-RECONCILE-CANDIDATE, CONTRACT-RECONCILE-REVIEW, CONTRACT-RECONCILE-CONTROL, CONTRACT-RECONCILE-MAP, CONTRACT-RECONCILE-EVALS
  - Criteria: AC-RECONCILE-CONTROLLER, AC-RECONCILE-TRANSPORT, AC-RECONCILE-STATE, AC-RECONCILE-MAP
  - Effects: EFF-RECONCILE-REPO, EFF-RECONCILE-SMOKE
  - Output: OUTP-RECONCILE-T1
  - Receiver: dev-implementation backend
  - Verification: VR-RECONCILE-CONTROLLER, VR-RECONCILE-TRANSPORT, VR-RECONCILE-STATE, VR-RECONCILE-MAP
  - Lineage: shared

### T1 approach

1. **Bind the exact target before mutation.** Re-read all nine target paths and compare the eight current SHA-256 values and one absent path with the Target map. Preserve the current unrelated modification to `.config/agents/harnesses/omp/config.yml` and the untracked progressive-checkpoints plan. If a named target changed, compare it with AUTH-RECONCILE-REDESIGN; continue only for nonconflicting drift that can be preserved, otherwise return `authority-change-required`. If `execution-flow.md` unexpectedly exists or is a symlink, stop rather than overwrite it.
2. **Replace controller semantics as one clean cutover.** Preserve Reconcile's minimal frontmatter, manual invocation, candidate inference and digest rules, packed-label grammar, sole-Main mutation, read-only reviewers, and protocol pointer. Add the diagnostic-only execution-flow pointer and the brief field `Maximum controller-applied outer iterations`, whose value is exactly `none` by default or a positive integer and is accepted by plain approval. Remove mandatory A-then-B first-iteration completion, B-only earliest validity, immediate canonical mutation after REVISE, automatic application of VALID recommendations, and the old five-column trace.
3. **Define the controller state and transitions explicitly.** Keep only ephemeral state for run original, canonical candidate, outer index, immutable outer base, working proposal and origin, bounded lineage, persistent A/B identities, each reviewer's first-actual-review flag, application count and cap, closure-only state, terminal response, context-sync receipt, repair state, cycle/frontier sets, and event trace. Bounded lineage contains exactly outer iteration, outer-base identity, parent proposal identity, author reviewer, author pass, and source finalized-response digest; packets carry the complete current working proposal plus that lineage, never full response history. At every outer start execute the conceptual transition `outer base := canonical candidate`, `working proposal := outer base`, `working origin := outer-base`, parent identity := outer-base identity, author/pass/source-response := none, next reviewer := A. In artifact mode this initial state is the unchanged artifact, never an empty patch.
4. **Bind both persistent reviewers before review.** Preflight must prove two distinct enabled read-only persistent role bindings plus the ordinary provisional-result, same-child rethink, authoritative IRC-send, context-delivery-receipt, and retained-child seams. After approval, spawn A and B as one retained pair using bootstrap instructions that produce no verdict, do not load rethink, and wait for Main's first review request. Begin outer iteration one only after both child identities exist; never replace a lost child. On each child's first actual review, even in a later outer iteration, send the full run-original content or approved readable locator, collect provisional `initial` through its ordinary task result, then prompt the same child to load `skill://rethink` and send finalized `post-rethink` through IRC. Later packets retain the run-original identity without resending its bytes, use finalized `later`, and never load rethink. Every outer iteration starts with existing A, accepting documented A-first framing bias.
5. **Negotiate without canonical mutation.** A changed applicable finalized REVISE replaces the complete ephemeral working proposal and lineage, records the prior working identity as parent, then goes to the existing counterpart. Conversation Correction is a complete replacement. Artifact Correction is one complete set of exact bounded edits against the immutable outer base and completely supersedes every previous unapplied Correction. Reject unchanged or non-applicable REVISE and repeated working-identity/reviewer cycles under the named liveness stops.
6. **Terminate negotiation on one exact VALID.** Treat the first finalized current-working-identity VALID from either reviewer as pure acceptance. Leave every recommendation unapplied. Send the already-live counterpart the terminal context-only packet and require its one-way delivery receipt before mutation, unchanged presentation, or cap stop. The packet identifies the final revised proposal, terminal reviewer response and disposition, forbids review/response/mutation/dispatch/channel use, and produces no verdict, rethink, IRC response, or local echo.
7. **Apply once, close, or stop at capacity.** When accepted working state equals the outer base, complete without mutation after synchronization. When it differs and application count is below the bound or the cap is none, apply exactly once, re-read and hash, run any existing artifact-native validator, count one committed changed application, and start a new A-led outer iteration with working equal to the new base. After N committed applications, permit one final read-only closure iteration; unchanged VALID succeeds, while another accepted change is synchronized and stops `CAP_REACHED` before mutation with canonical and pending identities preserved. Reviewer turns, corrections, sync, no-change closure, and identity-preserving repair never consume the cap.
8. **Make failure recovery and terminal reporting identity-safe.** On failed/partial apply or native-validator failure, stop on observed bytes and present the accepted base/Correction identities, exact failure, proposed repair, and explicit repair-authority request. Preserve VALID only when explicit authority restores the exact outer base or fixes permission, transport, or validator availability without changing base, Correction, or intended final content. After verifying that identity, retry only the exact failed step: application after base restoration or permission repair, or native validation on the unchanged applied identity. Any content identity change stales VALID and starts a fresh A-led outer iteration only when target, mode, scope, authority, children, and lineage remain current; otherwise require a revised Reconcile binding. Never auto-rollback, replace a lost child, or exempt a different committed canonical identity from the cap. Also stop on unchanged/non-applicable REVISE, repeated reviewer/proposal without new evidence, repeated frontier, persistent BLOCKED, uncorrectable malformed or stale response, unreadable required context after the one allowed approved-context correction, lost child/follow-up/channel, failed synchronization, authority conflict, capacity, or apply/validation failure. Keep a full ephemeral trace; project user-facing Review rounds once per authoritative verdict plus sync, apply, validate, cap, and stop milestones as `Step | Outer | Actor/event | Pass | Proposal identity | Outcome`, excluding the local echo.
9. **Align reviewer protocol and OMP projections.** Split review-turn and context-only packet behavior in `reviewer-protocol.md`; preserve the exact current VALID, REVISE, and BLOCKED field templates while binding `Candidate:` to working-proposal identity and making VALID pure non-mutating acceptance. Make IRC the sole authoritative transport for finalized post-rethink, later, and complete contract-correction responses. After the IRC send, require one exact non-authoritative final local echo and stop; Main never awaits, parses, compares, records, or gates on it, and no Submit Result is required. Provisional initial remains ordinary-result-only. A correctable malformed or stale response returns to the same child without reviewer switch or extra rethink; approved original context may be resent only to correct BLOCKED, and persistent BLOCKED stops. Update both second-opinion adapter files as thin projections of that exact protocol, removing their current prohibition on the local echo without making either adapter a third semantic owner.
10. **Add the human-only flow map.** Create `references/execution-flow.md` with non-runtime captions, exactly one compact `stateDiagram-v2` Mermaid state machine, and one minimal table with columns `Event or guard`, `Main action`, and `Canonical mutation allowed`. The diagram and table cover approval and pair spawn, outer initialization, first-review initial-to-rethink versus later review, REVISE alternation, VALID synchronization, sync failure, unchanged success, changed apply/validate/new outer, cap closure and cap stop, liveness stops, and identity-preserving repair versus changed-content re-review/rebinding. Exclude packet fields, response templates, IRC/local-echo rules, ADR rationale, and eval IDs. State only the edit-time guard: behavior changes update executable prose, affected edge/row, and at least one semantic eval; mismatch is a documentation defect and executable owners win.
11. **Synchronize durable source roles without a new ADR.** Set both touched ADR `Updated` fields to T1's repository-mutation calendar date. Amend D15's existing seven-field decision unit with one source-role sentence distinguishing non-runtime skill-local `references/execution-flow.md` from non-runtime root `WORKFLOW.md`, while preserving one semantic owner and projection/rationale boundaries. Amend D23's existing seven-field unit with filename, diagnostic-only loading, chart-plus-table form, edit-time integrity, custom-controller qualification, and the rejected runtime-load, co-authority, and generic-catalog reuse choices. Qualify the pattern only for custom skills with genuine controller loops; tiny linear skills and generic catalog skills already using root WORKFLOW are excluded. Record the native-approved repository plan path and SHA-256 plus AUTH-RECONCILE-REDESIGN's conversation identity in each ADR's evidence/human-authority sections without copying the algorithm. Refine only the existing ADR-0001, ADR-0004, D15, and D23 index rows; retain IDs, ACTIVE status, paths, and supersession links. Do not add D30 or edit root WORKFLOW files.
12. **Replace the permanent semantic registry with five focused cases.** Preserve root/object key order and `files: []`. Final IDs are `REC-ORDER-AUTHORITY`, `REC-SEMANTIC-REVALIDATION`, `REC-VERDICT-PROGRESS-STOPS`, `REC-ARTIFACT-CUMULATIVE-CAP`, and `REC-SYNC-REPAIR-RESUME`, with exactly the following six nonempty behavior assertions per case and thirty total. Rewrite the first three completely and add the last two.
    - `REC-ORDER-AUTHORITY`
      1. Preflight and the cap-bearing approval brief finish before spawn or review, and the non-runtime flow map is never loaded.
      2. Plain approval spawns and retains distinct read-only A and B before outer iteration one; bootstrap is not review and loads no rethink.
      3. Outer one binds canonical C1 as both immutable outer base and initial working proposal, with A first.
      4. A's first actual review yields provisional initial only through the ordinary result, then exactly one rethink and authoritative post-rethink IRC response followed by one ignored exact local echo and no Submit Result.
      5. A's finalized current-identity VALID may terminate negotiation; already-live B receives context-only synchronization and yields only a delivery receipt before success, with no review, rethink, verdict, IRC send, or echo.
      6. Main performs no canonical mutation in the unchanged case and both reviewers remain read-only.
    - `REC-SEMANTIC-REVALIDATION`
      1. Outer one starts from C1 as outer base and working proposal, led by A.
      2. A's first finalized REVISE creates complete W1 and B's first finalized REVISE creates complete W2; both are ephemeral replacements while canonical C1 remains unchanged.
      3. A's later finalized VALID accepts exact W2 and B context synchronization succeeds before application.
      4. Main applies W2 once as C2, increments the committed-application count once, re-identifies and validates, then starts outer two with base and working C2 and existing A.
      5. A's outer-two pass is later with no repeated rethink, and VALID recommendations cause no edit; every applied change requires a new REVISE identity.
      6. Each replacement carries the six bounded lineage fields, full history is omitted, and any stale-identity verdict is rejected.
    - `REC-VERDICT-PROGRESS-STOPS`
      1. VALID, REVISE, and BLOCKED use the exact reviewer, pass, Candidate, and body grammar; duplicate, lowercase, missing-field, wrong-role/pass, stale-identity, or non-applicable output is malformed.
      2. Correctable malformed output returns to the same child as one complete authoritative IRC response plus one ignored exact local echo, without reviewer switch, extra rethink, or Submit Result.
      3. Only a changed applicable REVISE replaces working state; unchanged or non-applicable REVISE stops and canonical state remains unchanged.
      4. Six alternating progressive later REVISE turns continue without numeric inner cap and without rethink.
      5. Persistent BLOCKED, unreadable required context after the one allowed approved-context correction, lost child/follow-up/channel, failed sync, repeated state/frontier, authority conflict, capacity, and apply/validation failure each stop without false success or unauthorized mutation.
      6. The user-facing six-column projection records each authoritative verdict once plus sync/apply/validate/cap/stop milestones, excludes local echoes, and reports exact terminal state.
    - `REC-ARTIFACT-CUMULATIVE-CAP`
      1. Artifact outer iteration starts with F0 as canonical outer base and working proposal, never an empty or synthetic patch.
      2. A's P1 is one complete Correction against F0; working identity changes to P1 while canonical F0 remains unchanged.
      3. B's P2 is one complete Correction against the same F0 and fully supersedes P1 rather than applying on P1; canonical F0 remains unchanged.
      4. After current-identity VALID and successful context sync, Main applies only P2 once, rehashes/validates, and increments the committed-application count once.
      5. At capacity, the closure outer starts from applied F2 as both base and working proposal with A; unchanged VALID succeeds after synchronization.
      6. A changed accepted closure proposal synchronizes then stops `CAP_REACHED` before mutation, preserving exact canonical F2 and pending proposal identities.
    - `REC-SYNC-REPAIR-RESUME`
      1. The counterpart context-only packet carries terminal working proposal, identity/provenance, terminal response, and disposition and yields only one delivery receipt.
      2. Failed context delivery stops before mutation, unchanged presentation, or cap presentation.
      3. Partial application or native-validator failure stops on exact observed bytes and requests explicit authority for one exact proposed repair without automatic rollback.
      4. Byte-identical base restoration or content-preserving permission, transport, or validator repair retains VALID, retries only the failed application or validator step on its exact expected identity, and does not consume another cap count.
      5. Any changed base, Correction, or intended final content invalidates VALID and, only with unchanged approved target/mode/scope and live bindings/lineage, starts a fresh A-led outer iteration.
      6. Changed target, mode, scope, authority, child binding, or lineage requires a revised Reconcile binding; a lost child is never replaced.
13. **Close the worker against observable behavior.** Run worker closure before final smoke; apply only admitted corrections and run a second closure round only if round one changes the candidate. Settle all five changed permanent eval cases under `test-value/v1`; each must retain one unique bug claim and independent expected assertions. Run every VR below on final hashes. Emit sorted compact UTF-8 `local://reconcile-redesign-target-manifest.json` covering exactly the nine target paths, then one immutable `local://reconcile-redesign-common-handoff.md` with criterion evidence, eval dispositions, smoke traces, preservation state, residuals, and receiver.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-RECONCILE-CONTROLLER | Approved conversation candidate enters an outer iteration and reviewers return REVISE or VALID | Working begins exactly equal to outer base, REVISE changes only ephemeral state, first finalized exact VALID triggers sync, and Main performs no more than one canonical application before a new A-led outer iteration. | TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-EVALS | T1 |
| AC-RECONCILE-TRANSPORT | Both OMP reviewers are available and one reviewer reaches its first finalized response | A and B are already live; first actual review alone runs initial then rethink; IRC supplies the only authoritative finalized response; one ignored local echo follows; context sync produces no reviewer response; no Submit Result or dual-delivery comparison gates progress. | TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-REVIEWER-A, TGT-RECONCILE-REVIEWER-B, TGT-RECONCILE-EVALS | T1 |
| AC-RECONCILE-STATE | Artifact Corrections, a configured application cap, or application failure exercises boundary behavior | Corrections remain cumulative against one immutable outer base; closure cap counts only committed changed applications; sync failure stops before mutation; only identity-preserving repair retains VALID; every changed identity requires fresh A-led review or rebinding. | TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-EVALS | T1 |
| AC-RECONCILE-MAP | A maintainer diagnoses Reconcile control flow from repository guidance | SKILL and protocol are the only executable owners; the diagnostic pointer excludes live loading; the human map shows every direction-changing branch without operational duplication; D15, D23, and INDEX discover the non-runtime source role with no new decision ID. | TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-FLOW, TGT-RECONCILE-ADR-D15, TGT-RECONCILE-ADR-D23, TGT-RECONCILE-ADR-INDEX | T1 |

## Verification / Done criteria

### Shared semantic-eval proof protocol

For each exact case ID, build a generator prompt from the final SKILL bytes, final reviewer-protocol bytes, immutable `skill://rethink` bytes, and that case's `prompt` only. Call one fresh stateless `completion()` with `model="default"` and the explicit system instruction: `Apply only the supplied executable Reconcile authorities to the supplied semantic fixture; return the complete observable controller result requested by the fixture; use no files, tools, memory, or unstated facts.` Do not expose `expected_output` or `assertions` to the generator.

Immediately write the unmodified UTF-8 response to a session-local locator formed as `local://reconcile-redesign-` plus the lowercased case ID plus `-response.txt`, compute its SHA-256, and only then grade it. The grader is a second fresh stateless `completion()` with `model="default"`, the sealed response and digest, exact `expected_output`, and all six assertions. Require a strict object containing exact `case_id`; aggregate `status` of `PASS` or `FAIL`; and exactly six ordered assertion objects containing one-based `index`, boolean `pass`, and nonempty quoted or event-row `evidence`. `status` is PASS only when indices are 1 through 6 and every assertion passes. Write that object to the analogous `-grade.json` locator and hash it. Any call, schema, ordering, evidence, or assertion failure is BLK-RECONCILE-EVAL; never retry, edit the sealed output, weaken the case, or count source inspection as a semantic pass.

- [x] VR-RECONCILE-CONTROLLER. Grade controller convergence and progress behavior
  - Criterion: AC-RECONCILE-CONTROLLER
  - Proof class: worker smoke
  - Scenario / environment / fixture: Exact final SKILL, reviewer protocol, and `skill://rethink` bytes plus final `REC-SEMANTIC-REVALIDATION` and `REC-VERDICT-PROGRESS-STOPS` prompts; one fresh stateless `completion()` per case, each raw response sealed before a separate assertion-grade step; no flow map or ADR context, no hidden wrapper, and no retry.
  - Evidence form: Two raw UTF-8 response locators and SHA-256 identities plus complete six-row PASS matrices proving outer initialization, ephemeral REVISE state, one post-sync application, A-led restart, pure VALID, truthful progress and stops.
  - Target recheck: TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-EVALS
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-TRANSPORT. Exercise the actual explicit Reconcile surface and reviewer transport
  - Criterion: AC-RECONCILE-TRANSPORT
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, first require `/Users/kim/.local/bin/omp --version` to report `omp/18.1.5` or a capability-equivalent current version and verify both live reviewer symlinks still resolve to the two target adapters. Hash all nine targets before the smoke. Create a fresh temporary smoke root containing only a session directory and a config overlay whose complete bytes are `memory:\n  backend: off\n`, then start `/Users/kim/.local/bin/omp` through `hub` as one uniquely named non-PTY process using `--mode rpc`, `--cwd` at that root, `--add-dir /Users/kim/.dotfiles`, the repository OMP config followed by the memory-off overlay, `--session-dir` under the root, `--approval-mode write`, `--no-extensions`, `--no-lsp`, and `--skills=reconcile,rethink`. Remain on bounded protocol v1 only while every frame stays below the advertised limit, send `set_subagent_subscription` at `events`, then prompt `/skill:reconcile` with this exact fixture: goal is to return the fixed approved conversation candidate exactly; candidate is the five lowercase ASCII bytes `alpha`; the sole requirement and complete desired proposal are exactly `alpha`, every different byte is invalid, and no artifact mutation is permitted; mode is conversation; maximum controller-applied outer iterations is one. Require the first terminal `agent_end` within 600 seconds to be the plain-text brief and require no child lifecycle event before it. Send the exact follow-up `approve`; require final successful `agent_end` within 600 seconds; then request `get_subagents` and `get_subagent_messages` for both child identities. Stop only the exact process this recipe started, rehash the nine targets, and remove only the verified smoke root. Also run the one-shot `REC-ORDER-AUTHORITY` semantic protocol. No write approval, credential action, model/config change, frame overflow, semantic retry, or alternate TUI run is permitted.
  - Evidence form: Ready/response frames; exact parent and subagent event/message traces; no pre-approval child event; two distinct persistent read-only child identities before the first review event; ordinary provisional result; authoritative finalized IRC event; one matching non-authoritative local echo ignored by Main; counterpart context-only delivery receipt with no counterpart verdict, rethink, IRC send, or echo; byte-identical before/after target hashes; verified process stop and smoke-root removal; and one six-row semantic PASS matrix that also proves no runtime flow-map load.
  - Target recheck: TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-REVIEWER-A, TGT-RECONCILE-REVIEWER-B, TGT-RECONCILE-EVALS
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-STATE. Grade artifact, cap, synchronization, and repair branches
  - Criterion: AC-RECONCILE-STATE
  - Proof class: worker smoke
  - Scenario / environment / fixture: Exact final executable-owner bytes plus final `REC-ARTIFACT-CUMULATIVE-CAP` and `REC-SYNC-REPAIR-RESUME` prompts; one fresh stateless completion per case, immediate raw-output sealing, then separate grading against all assertions; no retry or source-text substitution.
  - Evidence form: Two raw response locators and SHA-256 identities plus two complete six-row PASS matrices showing cumulative outer-base Corrections, one committed application, closure success and cap stop, silent context sync, exact repair ask, retained VALID only for identical content, and A-led re-review after changed content.
  - Target recheck: TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-EVALS
  - Receiver: dev-implementation backend
- [x] VR-RECONCILE-MAP. Validate package structure, source roles, and human navigation
  - Criterion: AC-RECONCILE-MAP
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, run `PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/reconcile/evals/evals.json`, then run `PYTHONDONTWRITEBYTECODE=1 python3 -c 'import json,pathlib; d=json.loads(pathlib.Path(".config/agents/skills/reconcile/evals/evals.json").read_text()); ids=["REC-ORDER-AUTHORITY","REC-SEMANTIC-REVALIDATION","REC-VERDICT-PROGRESS-STOPS","REC-ARTIFACT-CUMULATIVE-CAP","REC-SYNC-REPAIR-RESUME"]; assert list(d)==["skill_name","evals"] and d["skill_name"]=="reconcile"; assert [e["id"] for e in d["evals"]]==ids; assert all(list(e)==["id","prompt","expected_output","files","assertions"] and e["files"]==[] and len(e["assertions"])==6 and all(isinstance(a,str) and a.strip() for a in e["assertions"]) for e in d["evals"]); print("5 cases / 30 assertions")'`. Inspect minimal Reconcile frontmatter, direct protocol and diagnostic-map pointers, one balanced Mermaid fence, one three-column guard table, all named direction-changing branches, D15/D23 seven-field decision-unit shapes, and the existing ADR/index links. No Mermaid renderer, network fetch, source-text snapshot test, root WORKFLOW edit, runtime chart read, or stale-contract scanner result is used as behavioral proof.
  - Evidence form: Zero-exit JSON/schema receipt reporting exactly `5 cases / 30 assertions`, frontmatter/package inventory, resolved D15/D23 index links, manual map readability/coverage checklist, exact final target manifest, and evidence that executable owners win without a live chart-conflict stop.
  - Target recheck: TGT-RECONCILE-SKILL, TGT-RECONCILE-PROTOCOL, TGT-RECONCILE-FLOW, TGT-RECONCILE-ADR-D15, TGT-RECONCILE-ADR-D23, TGT-RECONCILE-ADR-INDEX
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-RECONCILE-T1 | T1 | Exact nine-path target manifest, five eval dispositions, semantic outputs and grades, RPC smoke trace, structural receipts, and final target identity | completed, blocked, failed, timed-out, transport-unavailable, authority-change-required | dev-implementation backend | One immutable Common Handoff from `dev-handoff` carrying authority, task/attempt identity, before/after target identities, worker closure, permanent-test value, criterion-to-smoke evidence, disposable-effect cleanup, preservation, papercut accounting, route impact, residual risk, and exact receiver. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-RECONCILE-AUTHORITY | reconcile-maintainer | Current target hashes, exact conflicting bytes, and comparison with AUTH-RECONCILE-REDESIGN | T1 | Any changed target, mode, scope, semantic owner, acceptance, effect, or user-owned content requires `authority-change-required` and revised human approval. | Exact approved target/effect contract is current and unrelated work remains untouched. |
| BLK-RECONCILE-TRANSPORT | reconcile-maintainer | OMP version, RPC ready frame, agent discovery, live symlink targets, reviewer identities, IRC/subagent events, and failure trace | T1 | Missing or non-equivalent RPC, persistent-child, ordinary-result, same-child, IRC, or event-trace capability returns `transport-unavailable`; do not install `omp_rpc`, change models/config, use TUI inference, or downgrade to source checks. | Existing OMP exposes the equivalent required seams and the disposable smoke reaches a terminal frame with complete evidence. |
| BLK-RECONCILE-EVAL | reconcile-maintainer | Exact case ID, sealed raw output, grader matrix, target hashes, and failed assertion | T1 | A missing/failed completion, unsealed output, missing assertion evidence, or semantic FAIL blocks completion; no retry, prompt weakening, hidden wrapper, or source-text pass is authorized. | All five one-shot outputs are sealed and all thirty assertions pass on exact final executable-owner bytes. |
| BLK-RECONCILE-SMOKE | reconcile-maintainer | Exact running effects, process/session state, repository/temp manifests, declared OMP operational records, and cleanup result | T1 | Unexpected write request, credential action, undeclared persistent mutation, nonterminal/hung RPC, repository mutation, uncertain process stop, or uncertain temporary cleanup stops without broad cleanup or inferred success. | Process is stopped, exact evidence retained, repository targets match expected final hashes, disposable smoke state is absent, and only declared append-only OMP/provider accounting remains. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-RECONCILE-AUTHORITY | Confirmed decision evidence | `agent://ReconcileDesignGrill@sha256:2d0e98117d73963f0d02a035964917980ecd304572009124bc0ad109e97d935f` and `conversation@sha256:ea069ab70366f5d79f44155014a4a8201e5fe7fbb2042d5ee09f5a88b08ad3d5` | Governs every semantic edit and the outer-start clarification. |
| ANC-RECONCILE-EXECUTABLE | Current executable owners and adapters | Reconcile SKILL/protocol hashes in Target map; second-opinion adapter hashes in Target map | Defines the clean cutover and all transport callsites. |
| ANC-RECONCILE-RETHINK | Preserved dependency | `skill://rethink/SKILL.md@sha256:3a1ad779f47ea149ae43d367f66cc3de60f77e9a5b5f019840d263cbff84f665` | Supplies first-actual-review reassessment only; remains read-only. |
| ANC-RECONCILE-ADRS | Canonical source-role authority | `docs/adr/0001-dev-workflow-authority-and-routing.md#d15--semantic-ownership-and-source-roles`; `docs/adr/0004-canonical-discovery-and-continual-learning.md#d23--focused-decision-provenance`; `docs/adr/INDEX.md` | Owns rationale, rejected alternatives, and discovery without runtime authority. |
| ANC-RECONCILE-TOOLS | Execution and proof contracts | `skill://craft-skill`; `skill://dev-handoff`; `rule://plan`; `rule://plan-impl-spec`; `omp://rpc.md`; `/Users/kim/.local/bin/omp` observed as `omp/18.1.5` | Constrains skill authoring, Handoff, plan-backed execution, and live smoke transport. |

- ASM-RECONCILE-OMP: Plan drafting observed OMP `18.1.5`, live reviewer files as symlinks to the two repository adapters, and no installed Python `omp_rpc` package. Use the hub-supervised raw JSONL RPC process without installing a client. If the OMP version changes, proceed only after the same ready, prompt, subagent-event, persistent-reviewer, IRC, and terminal-event seams are observed; otherwise return BLK-RECONCILE-TRANSPORT.
- ASM-RECONCILE-EVAL: No repository runner consumes the Reconcile `skill_name`/`evals` schema. Use the exact Eval `completion()` and separate assertion-grading procedure above as session-local proof. If either capability is unavailable, return BLK-RECONCILE-EVAL rather than treating JSON or source inspection as behavior.
- ASM-RECONCILE-MAP: No installed Mermaid renderer was found. The accepted proof is balanced Markdown plus direct human inspection of topology/table coverage and semantic eval behavior; do not fetch or install a renderer. If the user later requires rendered-image proof, that is new effect/tool authority.
- ASM-RECONCILE-WORKTREE: Drafting observed unrelated user work in `.config/agents/harnesses/omp/config.yml` and `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md`. Preserve it exactly. At readiness, rebind the current status and all target hashes; never overwrite or stage unrelated paths.

## Completion Summary

- **Outcome**: Completed T1 as the approved clean cutover across the nine named Reconcile, reviewer, evaluation, flow-map, and ADR/index targets.
- **Final target**: `sha256:515119308bec77fd6c26e235a425d850a2348d6d8926cbcd8c44f4b39278e170`; exact source target manifest `local://reconcile-redesign-continuation-2-attempt-2-target-manifest.json@sha256:93f72104b9513ad825a9e9dc020e0446b906fda9f2ed46c626307d9ca3f8adc8`; final proof manifest `local://reconcile-redesign-synchronous-proof-manifest.json@sha256:4bb3d671851ce1994bd15ea9c095be4ac97c593517683a4b84d04fd0a6e6842e`.
- **Verification**: AC-RECONCILE-CONTROLLER, AC-RECONCILE-TRANSPORT, AC-RECONCILE-STATE, and AC-RECONCILE-MAP passed. Five synchronous generators and five synchronous graders produced five complete `PASS 6/6` matrices, aggregate `PASS 30/30` at `sha256:a57dd081785f3c148ff64e8e624d7984c40b5bf29a603162d1013312431c8505`. Exact-identity structural and live RPC evidence also passed; no new RPC was started.
- **Worker closure**: One mandatory same-child round completed with no findings or corrections; a second round was ineligible.
- **Material decisions**: Retained single-reviewer convergence and the persistent A/B pair; kept context synchronization as no-prose counterpart wait plus one-way delivery receipt; rebound proof to exact committed `rethink` identity `sha256:5aaa441931c3c4a4e24e9c36907a14a889ad6c381ad68ef838b59a3e3d2cc6e5`; used synchronous capture-before-grade completion calls to prevent evidence loss.
- **Continuation authority**: Fresh cycle-4 proof authority is recorded at `local://reconcile-redesign-synchronous-proof-continuation-receipt.json@sha256:480881466177ff5494f967de134f0f778687528d6cb2c9f8fdcf873a8dc5f328`.
- **Handoff**: `local://reconcile-redesign-synchronous-proof-common-handoff.md@sha256:e3127fa4df6f89d7f7a2e13e7fe5409b0592e94f4256146315580e5806001ad6`.
- **Preservation**: `.config/agents/harnesses/omp/config.yml` remained `sha256:5bf1b3ceee5bd9bb0422e910903dc38c8afa075293a4742bed3d9c1d6364c74e`; `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md` remained `sha256:cf33b3790bd73c0131022c7e5cf85821100739fa379907c2ac608e7eace4c4cf`.
- **Residual risk**: Semantic proof uses stateless model generation and model grading. Live transport proof is exact-identity reused RPC evidence rather than a fresh RPC because the final continuation expressly prohibited another RPC.
- **Papercut**: Report-only candidate — semantic proof drivers do not enforce capture-before-analysis for synchronous completion results. The proven workaround is `response = completion(...)`, type-check, seal/hash, then run the separate synchronous grader. No ledger access or repository mutation occurred.
- **Shipping**: Not authorized; no staging, commit, push, review request, release, or deployment occurred.
