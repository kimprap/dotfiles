---
name: product-grilling
description: >
  Run a round-based product decision interview for one approved product iteration. Use only when
  product-ask dispatches an idea, strategy, experience, scope, priority, metric, rollout,
  positioning, pricing, or business-model candidate for refinement. Skip PRD drafting, factual
  research alone, technical design, marketing execution, and settled product authority.
---

# Iterative Product Grilling

Shape one unsettled product candidate into human-confirmed Product Decision Evidence. Do not become a router, researcher, PRD author, marketer, or engineering owner.

## Intake

Require:

- the approved Product Route Overview;
- one stable product iteration ID;
- the exact target PRD identity, path, approved revision, and digest, or `new`;
- one candidate idea, strategy, experience, or change objective;
- fixed interview scope and non-goals;
- current evidence and known evidence gaps;
- one requesting owner.

Reject stale or conflicting baselines, missing route approval, an unspecified candidate, and requests to decide technical architecture or implementation. Return those gaps to `product-ask`.

## Product decision tree

Map only the load-bearing choices in the approved scope. Typical branches are:

- problem, evidence, affected context, and why now;
- target users, buyer or stakeholder roles, and priority segments;
- desired outcomes, value, and measurable success;
- user journeys, required product behavior, and failure or trust expectations;
- scope, priority, non-goals, and explicit trade-offs;
- positioning, pricing, business model, launch, or growth only when in scope;
- product constraints, dependencies, risks, rollout, and learning plan.

Order the tree by dependency. A frontier is every decision whose prerequisites are settled. Do not ask downstream questions before their inputs are known.

## Each round

1. Resolve discoverable facts from current artifacts, repository evidence, and primary sources before asking the user. If a decision needs broad or unavailable product evidence, stop with `PRODUCT EVIDENCE REQUIRED`; do not invent it.
2. Ask the whole current frontier as one numbered round. Batch independent decisions.
3. Give each question one concrete `Recommendation:` and a short evidence-based reason. A recommendation is not product authority.
4. Wait for the user's answers. Do not answer on the user's behalf or ask dependent questions in the same round.
5. Recompute the tree. Surface contradictions, changed assumptions, and newly exposed dependencies.

Continue for as many rounds as the decision tree requires. There is no explicit round limit. Complete only when the frontier is empty and the user explicitly confirms the summarized shared understanding.

Stop earlier only when the user pauses or ends the interview, evidence or human authority blocks the next frontier, the baseline becomes stale, or the same frontier repeats without a decision or evidence change.

## Durable Product Decision Evidence

On completion, pause, or a blocker, write or update:

```text
docs/product/iterations/<iteration-id>/DECISIONS.md
```

Use a repository-declared product-artifact location instead when one exists. Record only compact decision evidence, not the transcript:

```markdown
# Product Decision Evidence: <iteration>
## Identity
- Iteration ID
- Status: exploring | confirmed | paused | blocked | abandoned
- Target PRD identity and baseline revision/digest, or new
- Current evidence revision and digest
- Approved interview scope and non-goals
## Confirmed decisions
- Decision → human confirmation evidence
## Rejected alternatives
- Alternative → reason
## Evidence and assumptions
- Source identities
- Confirmed or disproved assumptions
## Candidate PRD delta
- Target PRD or new identity, affected sections, dependencies, and product behavior expected to change
## Open frontier
- Decision → owner → blocker or prerequisite
## Route impact
- unchanged | changed, with exact changed route facts
## Next receiver
- product-prd | product-ask
```

Do not record unconfirmed model proposals as decisions. A confirmed iteration record is product decision evidence, but it is not the approved product interface to engineering.

## Product Handoff

Return one Product Handoff that names the route approval, iteration, target PRD and baseline identities, decision-evidence identity, confirmed decisions, unresolved frontier, expected versus observed decision progress, `route-impact: unchanged|changed`, and exactly one receiver. When the intake carried a complete papercut candidate, also return its one originating `PC-ID` unchanged as non-product evidence plus only an explicit candidate-specific owner result; otherwise return `none`. Never inspect or mutate papercut storage.

Use `product-prd` when the frontier is empty, the user confirmed the shared understanding, and the approved route includes PRD work. Use `product-ask` for a pause, blocker, changed route, abandoned iteration, or a completed interview with no PRD route.

Never authorize PRD promotion, engineering work, external research or experiments, publication, or shipping.
