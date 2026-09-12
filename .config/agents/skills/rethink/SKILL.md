---
name: rethink
description: >
  Re-evaluate a consequential proposal from first principles. Use only when
  explicitly invoked to challenge the immediately preceding or named idea,
  plan, design, workflow, policy, or mechanism before committing to it.
  Skip ordinary implementation, grilling interviews, and requests that only
  restate values or ask to think harder with no named candidate.
disable-model-invocation: true
---

Treat the candidate—including your own prior answer—as a hypothesis. Separate
the desired outcome from the proposed mechanism. A candidate is that named
idea or prior answer, not a mood, slogan, or transcript dump. Adjectives and
philosophy keywords are desired-outcome flavor, not extra constraints.

Inspect only decision-bearing context. Find relevant existing capabilities,
owners, contracts, prior decisions, and observed failures yourself; do not ask
the user for discoverable facts.

Bind the candidate's desired outcome and every confirmed constraint before
comparing mechanisms. An option is ineligible if it weakens a required
outcome or constraint. When a mechanism is rejected, preserve that outcome
and choose among remaining eligible paths.

Compare only viable, evidence-backed paths across no change, reuse,
extension, bounded test, and new mechanism; do not invent a rung. Treat the
order as a presumption: a later path displaces an earlier eligible path only
when its total lifecycle cost is strictly lower. Choose the eligible path
that covers the residual gap at lowest total lifecycle cost, not fewest
files. For both chosen and displaced paths, count ownership, state,
integration, migration, conflict, review, operating cost, indirection, and
independently editable copies of the same invariant.

New active machinery is a new responsibility, owner, runtime, state, or
invocation surface; it is justified only when an established required gap
survives every cheaper eligible path. A read-only artifact loaded by existing
owners is an extension when it creates none of those boundaries, but its
loading, integration, and indirection costs still count. Identical
copies that must not diverge may justify one read-only source of truth; do
not centralize merely similar guidance. If value is plausible but unobserved,
choose a bounded test before selecting a mechanism. Do not require a runtime
failure for an inspectable constraint violation. Ignore sunk cost.

Challenge the user's premise and your own equally. Ask only about a remaining
human-owned trade-off.

## Presentation ownership

Perform the reassessment once, then obey exactly one output owner.

- When an already-loaded caller supplies an outer response contract or requires
  only a complete corrected proposal, that caller owns rendering. Use
  `rethink` internally and return only the caller-owned response. Do not emit
  the standalone `Rethink:` conclusion, `## Assessment`, or `## Final proposal`
  wrapper.
- Otherwise use the standalone response below. Subject, scope, and evaluation
  instructions do not change its shape. Only an explicit presentation request
  such as `verdict only`, `delta only`, or `do not restate` may replace it.

## Standalone response

Before rendering, read and follow
[packed-label](../../references/packed-label.md). The conclusion line is the
sole preface outside the packed-label surface.

Lead with `Rethink: **<disposition> — <concrete implication>**`. Choose the
disposition relative to the candidate, independently of its mechanism class:

- `Keep unchanged`: the candidate needs no revision.
- `Revise`: correct the candidate within the same approach.
- `Replace`: adopt a specified alternative instead of the candidate.
- `Test before deciding`: gather bounded evidence before selecting a mechanism.
- `Do not proceed`: do not adopt the candidate; name the current behavior to
  retain and any unmet need.

The implication names what this means now: distinguish an already-applied
change from an unimplemented proposal, and acknowledge pending verification.
Keeping an applied candidate may mean no further edits, not that it is proven;
keeping a proposal leaves implementation pending. A favorable assessment grants
no execution authority, and rejecting an applied candidate authorizes no rollback.
Mechanism classes guide the internal comparison, not the public disposition.

Render these packed-label sections with `list` fields in the stated order.
Use concise, distinct children as needed; do not force a single child per field.

- `## Assessment`
  - `Why` (required): decisive evidence and material lifecycle cost or trade-off
    against the strongest viable alternative.
  - `What changes` (required): the concrete delta, or explicitly none.
  - `Limits` (conditional): material uncertainty, pending proof, a blocker, or
    evidence that would reverse the decision. Omit when none is material.
- `## Final proposal`
  - `Proposal` (required): the complete operative decision set, self-contained
    without Assessment. Preserve relevant outcome, ownership, scope, behavior,
    constraints, exclusions, exact artifacts/interfaces, and required actions,
    including decisions that remain unchanged. Incorporate corrections; omit
    superseded alternatives and process narration.
  - `Checks` (conditional): relevant observed checks and pending checks,
    explicitly distinguished. For a bounded test, include the question,
    measurement, decision threshold, and stop condition; state that no mechanism
    is selected yet. Propose concrete bounds and a threshold when none are
    supplied, labeling them as proposals rather than observed or approved facts;
    do not leave the test criteria to be defined later.
  - `Next action` (required): the remaining action and authority boundary, or
    explicitly none. Preserve an established receiver; do not invent one.

The final proposal is portable decision content, not automatic workflow approval
or a new Handoff. Do not add a duplicate status field.

Do not implement the candidate.
