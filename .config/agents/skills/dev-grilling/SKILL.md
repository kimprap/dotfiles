---
name: dev-grilling
description: >
  Run a scoped, round-based decision interview for a user-presented candidate
  plan, design, hypothesis, or idea. Skip factual lookup, missing-requirements
  intake, settled direct work, and ordinary ambiguity.
---

# Iterative Engineering Grilling

Shape one unsettled candidate into immutable decision evidence without becoming a router, requirements owner, or implementation authority.

## Intake and near misses

Require a candidate approach, hypothesis, plan, design direction, or choice plus explicit refinement, challenge, stress-testing, comparison, or validation intent. Bind the requesting authority/revision, decision scope, evidence already current, and one requesting owner.

Do not activate for a direct answer from sufficient evidence, bounded factual research, incomplete observable behavior or acceptance with no candidate, unresolved product authority, a hard unexplained defect, a known/routine fix, settled direct implementation, a large specified graph, a fidelity prototype question, an architecture survey request, or Wayfinder-scale route fog. Return each to its existing owner rather than interviewing around it.

## Round-by-round decision frontier

Map the load-bearing choices as a design tree. A frontier is every decision whose prerequisites are already settled. Treat a supplied dependency graph as authoritative, keep the tree inside the candidate's approved scope, and leave questions whose answers depend on an open decision for a later round.

For every round:

1. **Resolve facts first.** Find repository, environment, and primary-source facts with available tools. Route a genuinely cross-context factual question through the current lifecycle owner to bounded `dev-research`, then consume only its Research Evidence and Handoff. Never ask the user for a discoverable fact.
2. **Ask the whole current frontier.** Batch every currently independent decision into one numbered round. Give each question a distinct concrete recommendation and reason. Select the harness's native structured-question tool from the live tool inventory, never by assumed harness or tool name. Use it when it can faithfully present the whole round, including choices and recommendations, in one interaction; otherwise ask the complete round in conversation and briefly explain the fallback.
3. **Wait for the user's answers.** Do not answer for them or ask downstream questions in the same round.
4. **Recompute the tree.** Incorporate the answers, surface contradictions or silently assumed branches, and ask the next complete frontier.

Continue for as many rounds as the decision tree requires. There is no arbitrary round maximum. The interview is complete only when the frontier is empty, every in-scope branch is settled, and the user explicitly confirms the summarized shared understanding. That confirmation completes this interview artifact; it is not another `dev-ask` Route Overview approval and grants no downstream authority.

Stop earlier only when the user pauses or ends the interview, a human-authority or evidence blocker prevents the next frontier, or the frontier repeats without a decision/evidence change. Return the exact settled decisions and resumable unresolved frontier rather than inventing an answer or broadening scope.

## Decision-evidence return

Record the requesting authority and revision, exact confirmed decisions, rejected alternatives and reasons, unresolved human authority, evidence links without copied source prose, and immutable artifact identity.

Emit one common Handoff with `route-impact: unchanged|changed` per `dev-handoff`, the evidence identity, any named blocker, and exactly one concrete receiver. A standalone router-dispatched interview returns to the bound route agent with next-owner role `dev-ask`; a bounded support interview returns to its one concrete requesting lifecycle owner.

The interview and its wrappers never authorize requirements, specification, ticketing, implementation, destructive/external effects, or shipping.
