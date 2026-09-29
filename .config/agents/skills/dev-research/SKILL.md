---
name: dev-research
description: >
  Investigate a bounded factual engineering question, prioritize primary sources,
  reconcile contradictions, and return cited evidence to the requesting owner.
  Skip when current evidence is sufficient; never use research to decide product
  strategy, engineering authority, or implementation scope.
---

# Engineering Research

Own evidence collection and synthesis for one bounded question. The requesting lifecycle owner keeps decision authority.

## Intake

Require:

- the exact question and why its answer changes an engineering decision;
- the requesting owner and expected receiver;
- scope, freshness needs, and stop conditions;
- approved artifact revisions that constrain the investigation; and
- whether durable capture is explicitly requested.

Reject open-ended product discovery, market/customer/positioning/pricing/launch/growth work, authority decisions, and requests that already have sufficient current evidence.

## Procedure

1. Restate a falsifiable research question and the decision it informs. Split independent questions; do not broaden the objective.
2. Search primary sources first: official documentation, specifications, source code, papers, or first-party announcements. Use secondary sources only to locate or corroborate primary evidence.
3. Record immutable source identity when available, publication/access dates, exact relevant claims, and limitations. Distinguish observation from inference.
4. Reconcile contradictions and report gaps. Do not force consensus where the sources differ.
5. Return concise cited evidence and one common Handoff to the concrete named requesting owner. State what the evidence supports, what it does not establish, the smallest remaining question, and `route-impact: unchanged|changed` per `dev-handoff`.

## Optional research store

Use a durable research store only when the current workspace or user configuration exposes a qualified live capability. Filesystem presence or advertised intent is not proof. Never silently serve stale evidence: stored evidence the store reports as not current stops with its freshness state, affected sources, and the refresh action it requires. A missing or insufficient stored answer falls back to direct portable research. Persist only for store-scoped work or explicit durable-capture opt-in; scheduling, refresh, credentials, and transport stay with the store or its adapter.

## Research Evidence

```markdown
# Research Evidence: <question>
## Authority and scope
- Requesting owner and governing revisions
- Bounded question and stop condition
## Sources
- Primary source identity, date, link, and relevant claim
- Corroborating source when needed
## Findings
- Established facts
- Contradictions and gaps
- Explicit inferences
## Decision coverage
- What the evidence supports
- What it does not decide
## Freshness and capture
- Stored-evidence freshness state, or `not applicable`
- Durable capture location or `none`
## Next owner
- The one exact requesting lifecycle owner
```

Do not choose product direction, rewrite requirements or specifications, implement the answer, or create domain artifacts. If evidence reveals an authority conflict, name it in the Handoff to the exact requesting owner; do not reroute it independently.

The Handoff binds the Research Evidence identity, reports any broken assumption or authority conflict, and names exactly one concrete receiver. Research never selects the route or authorizes a downstream stage.

## Stop conditions

Stop for an unbounded question, missing requesting owner, conflicting authority, unavailable required primary evidence, or stored evidence whose required freshness is not current. Return the evidence gap and exact next owner; do not fill it with an authority decision.
