---
name: dev-grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you have not heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Treat a dependency graph the user supplies as authoritative. Its currently unblocked named decisions are the whole round: do not pull dependent decisions forward, and do not invent prerequisite questions ahead of that named frontier. Expand newly discovered subdecisions only in later rounds after the current frontier is settled. Format every numbered item with a distinct **Recommendation:** that gives a concrete default and why.

Each answer set reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a later round, not this one.

Finding **facts** is your job, never the user's. Keep trivial facts available in the current context as direct read-only tool work. For any factual lookup that crosses a context or worker boundary, request a bounded `dev-research` attempt through the current lifecycle/backend owner with the exact question, authority, source/freshness needs, decision-coverage limit, attempt identity, and receiver. Independent lookups may use an approved batch only when the backend contract and capability profile permit it. Incorporate only canonical Research Evidence and its Handoff; the research owner never makes the interview decision. Continue asking every frontier question that does not depend on the lookup, and wait only when evidence is the sole blocker.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

## Decision-evidence return

After the user explicitly confirms shared understanding, emit one immutable decision-evidence artifact plus the common Handoff. Record the requesting authority and revision, exact settled decisions, rejected alternatives and reasons, unresolved human authority, evidence links without copied source prose, artifact identity, and one approved next receiver: `dev-ask`, `dev-requirements`, `dev-specification`, or `wayfinder`. The Handoff names the emitting role and pre/post state and cannot authorize implementation. Before confirmation, or while any frontier branch remains open, return a blocker/resume Handoff instead of treating the interview as complete.
