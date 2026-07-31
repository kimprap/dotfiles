# Proportional Engineering Workflow

**Datetime**: 2026-07-31-1523
**Scope**: Proportional assurance policy and temporary specialty-flow guidance for the `dev-ask` engineering lifecycle
**Summary**: Preserve the current high-assurance end-to-end flow while adding a compact path for low-risk work, removing unnecessary approval and curation round-trips, and documenting how future frontend/backend/infra vertical flows return to the single engineering lifecycle.
**Status**: COMPLETE

## Context

The current workflow already classifies lifecycle depth and execution topology, but every mutation converges on the same terminal verification, review, curation, and completion-approval machinery. Refine that existing seam rather than adding middleware: `dev-ask` will select an assurance profile orthogonal to lifecycle depth and topology, and `dev-implementation` will apply the approved profile without weakening universal authority, safety, smoke, evidence, target-identity, residual-risk, or shipping gates. Add only temporary specialty-flow guidance now; the actual frontend/backend/infra workflows remain unimplemented.

## Route Overview

Goal: Make the engineering lifecycle proportional for low-risk work and record the temporary future specialty-flow seam.
Route: `dev-implementation`
Why: Product and engineering authority are settled; the cross-skill behavior is decision-complete in this plan and remains one cohesive lineage, so requirements, specification, tickets, Wayfinder, fan-in, and shipping are unnecessary.
Artifacts: revised workflow skills, `dev-ask` overview, declarative eval registry, and three paired eval fixtures.
Gates: plan approval; current OMP discovery/auth/transport for behavioral verification; material authority or scope drift.
Execution: one owner; assurance: standard.
First action: revise `dev-ask` classification, approval, and completion contracts, then propagate the immutable assurance contract through downstream owners.

## Tasks

- [ ] T1. Add assurance classification and approval proportionality
- [ ] T2. Implement compact execution and evidence coalescing
- [ ] T3. Make compact continual learning trigger-driven
- [ ] T4. Document temporary vertical specialty-flow composition
- [ ] T5. Update behavioral evaluations and verify the workflow

## Approach

### T1. Add assurance classification and approval proportionality

Extend `dev-ask` rather than adding middleware. After artifact-depth classification and before topology, select immutable `compact | standard | high-consequence` assurance from consequence evidence; `standard` is the fallback when compact eligibility is not fully established and no high-consequence trigger applies. Keep lifecycle depth and topology independent from assurance. Preserve the seven-field Route Overview and format its existing field as `Execution: <one owner | small local batch | full orchestration>; assurance: <compact | standard | high-consequence>`; direct answers use `Execution: none; assurance: not applicable`. Put the reason and any disqualifier in `Why`.

For a direct read-only answer, emit the ordinary seven-field Route Overview and the evidence-backed answer in the same response with `Gates: none`; do not wait for approval or perform a pre-effect identity recheck. Preserve approval before mutation, delegation, external effects, or shipping. When an initially approved route already names terminal presentation and its authority, scope, route, target, safety, and capabilities remain current, emit the recomputed completion Route Overview and terminal report in the same response with no completion approval; retain reapproval for material drift, topology escalation, destructive/external effects, or shipping. Remove completion itself from the reapproval-trigger list and from promised downstream gates.
In `dev-ask/SKILL.md`, update the frontmatter description and ownership sentence so approval applies to executable/routed work rather than every invocation. Add assurance to `Classify in order`; keep the closed Route outcomes list unchanged except for direct-answer and completion-presentation semantics. Rewrite the Route Overview instructions so every invocation still emits the seven fields, but only dispatchable/executable routes ask for approval. In Dispatch and baton, replace “execute the approved direct answer,” remove `completion is claimed` from reapproval triggers, and remove the distinct downstream completion approval paragraph; keep current-artifact rereads and one-first-owner dispatch for executable routes. In Completion and stops, require curation evidence only when the assurance contract says `required` or compact curation was triggered.

Reflect the same low-resolution contract in `WORKFLOW.md`: lifecycle becomes `classify → select assurance → approve executable work → … → curate when required or triggered → complete → separately authorize shipping`; Interface distinguishes immediate direct answers from approved first dispatch; Durable contracts state that Route Overview and Task Contract carry assurance; Terminal evidence and Invariants make curation profile-aware and preserve one external seam.

### T2. Implement compact execution and evidence coalescing

Add assurance intake/revalidation to `dev-implementation`. Compact requires all of: settled authority/design/acceptance/verification; bounded one-context and one-lineage ownership; reversible effects; deterministic proof; no prior implementation/verification failure; and no material consequential surface. Disqualify compact for any unresolved authority/design, shared/public interface or schema, security/privacy/auth/permission/credential concern, stored data/migration/destructive/external effect, multiple lineage, unresolved UI judgment, hard/flaky/performance diagnosis, prior failure, durable recovery, broad/ambiguous/bias-prone work, or explicit heightened-assurance request. Route material security/privacy/auth/permission, data-loss/migration/destructive, public/shared compatibility, concurrency/recovery/reliability/performance, or explicitly heightened work to `high-consequence`; route remaining noncompact work to `standard`. Reclassification upward is a material route change returned to `dev-ask`; never silently downgrade an approved profile.
Add this exact immutable Task Contract block:

```markdown
## Assurance
- Profile: compact | standard | high-consequence
- Selection evidence and checked compact disqualifiers
- Verification/review arrangement: same non-implementer identity | separate identities | decorrelated identities
- Curation: qualifying-trigger only | required
```

`compact` binds `same non-implementer identity` and `qualifying-trigger only`; `standard` binds `separate identities` and `required`; `high-consequence` binds `decorrelated identities` and `required`. Profile changes create a new Task Contract revision.

For eligible compact work, keep one implementation owner and implementer smoke. Bind verification and review as two ordered semantic attempts to one fresh non-implementer identity: the verifier attempt emits its own Handoff and must reach `VERIFIED` before the reviewer attempt receives the immutable target plus verification Handoff and emits the separate Standards/Specification review Handoff. Preserve the existing canonical verifier/reviewer state owners even when the adapter reuses one physical agent; if the adapter cannot reuse that identity, fall back to two fresh non-implementers without weakening either output. Skip specification, ticketing, and integration only when their existing entry conditions are absent. Keep high-consequence behavior on the current full path.
Update `dev-code-review` to consume and report the immutable assurance profile. Replace its informal low-risk exception with the compact-only same-identity rule above; standard requires a reviewer identity distinct from the verifier, and high-consequence additionally requires decorrelated attempts/capabilities. Record verifier identity, reviewer identity, profile, separation mode, exact target, and the separate verification/review evidence in the Review Handoff. Integration or ticketing alone does not choose assurance.
For `high-consequence`, “decorrelated identities” means distinct non-implementer attempt identities, fresh contexts, and role-specific Context Packs/prompts; use different equivalent Role Profiles or model families when the live capability profile offers them. If it does not, retain distinct fresh contexts, disclose the same-model residual, and stop only when the approved Task Contract explicitly requires model-family separation. The reviewer may consume the verification Handoff but never worker reasoning.
Do not add task/run states or a new `evaluator` role. Extend the adapter capability profile only to report whether one non-implementer identity can be reused across the ordered verifier and reviewer attempts. Lack of reuse is a disclosed stronger-separation fallback, not a profile change or approval gate. Update `dev-implementation` Intake, Task Contract, state-transition explanations, ready-frontier steps 5/7/8, review/curation mappings, completion evidence, and next-owner language; leave retry, integration, and shipping mechanics unchanged.

### T3. Make compact continual learning trigger-driven

For compact work, replace mandatory neutral curation dispatch with a backend trigger screen after review. Dispatch `dev-continual-learning` only when the settled result carries a Learning Candidate, an explicit durable correction/decision, repeated settled process evidence, or a severe qualifying incident; otherwise the backend records `curation not triggered` plus the checked trigger facts in terminal evidence and creates no curation task/Handoff. Do not add a fourth `dev-continual-learning` outcome. When invoked, preserve its neutral ownership, qualification rules, and exact `CURATED | NO DURABLE LEARNING | BLOCKED` outcomes; `BLOCKED` still prevents completion. Standard and high-consequence retain mandatory terminal assessment.
Update `dev-continual-learning` description, terminal-gate framing, Trigger, and next-owner language so compact runs are invoked only by the backend trigger screen; the skill still owns qualification after dispatch and emits only its existing three outcomes. Update `dev-implementation` review/curation mapping and completion accounting to accept either required/triggered curation evidence or compact backend evidence that no trigger existed. Update `dev-ask` completion evidence and `WORKFLOW.md` terminal ownership text to the same conditional rule.

### T4. Document temporary vertical specialty-flow composition

Insert this exact temporary section after `## Invariants` and before `## Maintenance` in `dev-ask/WORKFLOW.md`:

```markdown
## Temporary specialty-flow seam

This is a temporary, non-executable boundary until specialty contracts exist. The engineering flow remains the single horizontal lifecycle. Future explicit `frontend-ask`, `backend-ask`, and `infra-ask` entrypoints may own vertical interviewing or discovery and capture human-approved, revision-bound specialty authority or evidence. Each returns that approved artifact—or the common Handoff only when its existing Task Contract and receiver requirements are satisfied—to `dev-ask` for reclassification and continuation.

For frontend work, interviewing and optional UI-prototype evidence may produce a human-approved Frontend Experience Brief. The main flow then owns requirements, specification and tickets when needed, implementation, frontend-aware verification, review, and completion. Specialty flows must not duplicate those authorities, execution state, orchestration, integration, shipping, or define a second router ledger, baton, or state machine. Add executable specialty routes only when their intake, approved-output, and return contracts exist.
```

For this specialty concern, make no executable change to `dev-ask`, `dev-requirements`, `dev-handoff`, module ownership, route outcomes, eval owners/routes, aliases, or fixture behavior. Preserve both generic `future product flow` stops and the existing common-Handoff eligibility rules.

### T5. Update behavioral evaluations and verify the workflow

Bump `.config/agents/skills/dev-ask/evals/evals.json` `schema_version` from `1` to `2`, keep `expected.mode` exclusively for topology, and add optional `expected.assurance_profile` assertions to the assurance-focused cases. Apply the changed approval/completion semantics consistently to the registry and each paired `case.json`: `R-DIRECT` and `L-ROUTING` require informational overview plus immediate answer with empty gates/replies and no approval event; `R-DIRECT-NEAR-MISS`, `R-APPROVAL`, and `R-APPROVAL-NEAR-MISS` explicitly remain executable-route approval controls. Remove every completion-only approval reference found by searching `completion.*approval` across `evals/**`; this includes the requirements, bug, grill/Wayfinder near-miss, architecture, artifact-lane, drift/completion, and four live execution cases. Preserve initial/recomputed approvals for executable work and real drift. `R-COMPLETE` becomes the positive terminal-evidence/no-reapproval case; `R-COMPLETE-NEAR-MISS` still rejects incomplete evidence and requires a new approval only when further work changes the approved route.

Pin existing assurance-heavy controls rather than weakening them: `B-SINGLE`, `B-ROLES`, `B-VERIFY`, `B-REVIEW`, `B-LEARNING`, `B-COMPLETION`, `B-FALLBACK`, and `B-FALLBACK-NEAR-MISS-SILENT-DOWNGRADE` assert `standard`; `B-FULL` asserts `standard` with full-orchestration topology, proving the axes remain independent. Convert `L-MUTATION` into the compact live path: initial mutation approval remains, `counter.txt` still changes from `1` to `2`, one fresh non-implementer identity emits separate verification and review evidence, curation records `not triggered`, terminal evidence returns, and `dev-ask` presents completion without another approval. Keep `L-ONE-OWNER`, `L-DELEGATION`, and `L-FULL` as explicit standard controls with required curation and automatic completion presentation.

Add exactly three backend registry/fixture pairs: `B-COMPACT` / `fixtures/b-compact/case.json` proves eligible one-owner compact execution, same non-implementer identity with separate verifier/reviewer Handoffs, no learning trigger, and backend `curation not triggered`; `B-COMPACT-CURATION-TRIGGER` / `fixtures/b-compact-curation-trigger/case.json` adds one declared Learning Candidate and requires bounded `dev-continual-learning` evidence before completion; `B-COMPACT-NEAR-MISS-HIGH-CONSEQUENCE` / `fixtures/b-compact-near-miss-high-consequence/case.json` requests compact for an authorization/credential boundary and must select `high-consequence`, distinct decorrelated verifier/reviewer identities, and required curation. Extend the repeated router/live rubrics so approval is required only for executable routes and never solely for terminal completion presentation. Do not add specialty-flow owners or routes to behavioral evals.

## Critical files & anchors

- `.config/agents/skills/dev-ask/SKILL.md` — classification order, Route Overview, approval, dispatch/re-entry, and completion semantics.
- `.config/agents/skills/dev-ask/WORKFLOW.md` — lifecycle, ownership, invariants, maintenance exclusions, and temporary specialty-flow guidance.
- `.config/agents/skills/dev-implementation/SKILL.md` — execution-mode selection, Task Contract execution policy, ready-frontier procedure, curation gate, and completion accounting.
- `.config/agents/skills/dev-code-review/SKILL.md` — existing low-risk permission for one fresh non-implementer to verify and review with separate outputs.
- `.config/agents/skills/dev-continual-learning/SKILL.md` — mandatory assessment trigger and terminal outcomes.

## Verification / Done criteria

Run all commands from `/Users/kim/.dotfiles`.

- [ ] `python3 -m json.tool .config/agents/skills/dev-ask/evals/evals.json >/dev/null` exits `0`.
- [ ] Run the following deterministic contract check; it exits without output:

  ```bash
  python3 - <<'PY'
  import json
  import re
  from pathlib import Path

  root = Path(".config/agents/skills/dev-ask/evals")
  data = json.loads((root / "evals.json").read_text())
  cases = {case["id"]: case for case in data["cases"]}
  assert data["schema_version"] == 2
  assert len(cases) == len(data["cases"]) == 57

  for case in data["cases"]:
      paired = json.loads((root / case["fixture_dir"] / "case.json").read_text())
      assert paired["inputs"] == case["inputs"], case["id"]
      assert paired["scripted_replies"] == case["scripted_replies"], case["id"]

  direct = cases["R-DIRECT"]
  assert direct["expected"]["gates"] == []
  assert direct["required_events"] == ["overview", "direct-answer"]
  assert direct["scripted_replies"] == []
  assert cases["L-ROUTING"]["expected"]["gates"] == []
  assert "approval" not in cases["L-ROUTING"]["required_events"]

  required = {
      "B-COMPACT": "compact",
      "B-COMPACT-CURATION-TRIGGER": "compact",
      "B-COMPACT-NEAR-MISS-HIGH-CONSEQUENCE": "high-consequence",
      "B-SINGLE": "standard",
      "B-FULL": "standard",
      "L-MUTATION": "compact",
      "L-ONE-OWNER": "standard",
  }
  for case_id, profile in required.items():
      assert cases[case_id]["expected"]["assurance_profile"] == profile

  serialized = json.dumps(data)
  assert not re.search(r"completion[^\"\\n]{0,48}approval", serialized, re.I)
  for future in ("frontend-ask", "backend-ask", "infra-ask"):
      assert future not in serialized
  PY
  ```

- [ ] Search active workflow bodies for `completion is claimed|completion Route Overview approval|completion presentation approval|After valid approval, execute the approved direct answer`; it returns no matches. Search the eval tree for `completion.*approval`; it returns no matches.
- [ ] Static contract inspection confirms: Route Overview still has exactly seven fields; assurance is present only inside `Execution`; Task Contract contains the exact `## Assurance` block; compact/standard/high-consequence keep lifecycle depth and topology independent; no new evaluator role or Handoff outcome exists.
- [ ] Use a fresh OMP session against `fixtures/l-routing`: invoke `/skill:dev-ask`, ask it to read `answer.txt`, and observe one response containing the seven-field overview plus `42`, with no approval request and no fixture mutation.
- [ ] Copy `fixtures/l-mutation` to a disposable directory, start a fresh OMP session there, invoke `/skill:dev-ask` with the paired request, approve the initial mutation overview, and observe `counter.txt` become exactly `2\n`. The trace must name compact assurance, one implementation owner, implementer smoke, the same non-implementer identity across separate verifier and reviewer Handoffs, `curation not triggered`, terminal evidence, and automatic completion presentation; it must contain no completion approval, learning Handoff, shipping, or mutation outside the disposable fixture.
- [ ] No current evaluation runner or schema file exists; do not recreate the archived harness. After the deterministic checks and two live OMP scenarios, use one fresh read-only verifier to compare only these changed/new case contracts against the final skill bodies: `R-DIRECT`, `R-DIRECT-NEAR-MISS`, `R-APPROVAL`, `R-APPROVAL-NEAR-MISS`, all router cases changed by completion-gate removal, `R-COMPLETE`, `R-COMPLETE-NEAR-MISS`, `R-DRIFT`, `R-DRIFT-NEAR-MISS`, the three new `B-COMPACT*` cases, the assurance-pinned `B-*` controls, and `L-ROUTING`, `L-MUTATION`, `L-ONE-OWNER`, `L-DELEGATION`, `L-FULL`. The verifier must return criterion-level evidence for profile, gate, event order, role identity, curation, and completion semantics; any contradiction is `NOT VERIFIED`.
- [ ] Inspect `WORKFLOW.md` and confirm the exact temporary section is between Invariants and Maintenance; all three future entrypoint names appear only there; `dev-ask` remains the sole current external seam; no executable specialty owner, route, module link, alias, fixture, or alternate state machine was added.

## Assumptions & contingencies

- Preserve the exact seven-field Route Overview; place assurance in `Execution` rather than adding a field.
- Keep topology and assurance independent: high-consequence work may still use one owner, and large cohesive work does not become orchestrated solely due to size.
- Model compact coalescing as two semantic attempts/Handoffs with one non-implementer identity, not a new evaluator role or combined Handoff. If an adapter cannot reuse one identity, use two fresh non-implementers and record the disclosed fallback; evidence and state ownership remain unchanged.
- If future specialty skills need executable routing, add those route outcomes only when their intake, output authority, and Handoff contracts exist; until then WORKFLOW guidance is documentation-only.
- Existing configured OMP is the sole required live adapter for this change; Grok and Cursor are not acceptance dependencies. If OMP discovery/auth/transport is unavailable, finish deterministic checks but leave behavioral verification blocked rather than substituting narrated evidence.
- During read-only planning, a scout unexpectedly materialized `.agents/plans/2026-07-31-1523_proportional-dev-workflow.md` with SHA-256 `4581c87251ee6aa0dbee89b0c10a9c795016ab93384c54ebe725d575b70c22cd`. It is not the canonical plan. During post-success cleanup, remove it only if its digest is still exact; if it changed, preserve it as user work and report the residual file.
