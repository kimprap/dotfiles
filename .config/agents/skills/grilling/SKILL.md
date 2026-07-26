---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you have not heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Treat a dependency graph the user supplies as authoritative. Its currently unblocked named decisions are the whole round: do not pull dependent decisions forward, and do not invent prerequisite questions ahead of that named frontier. Expand newly discovered subdecisions only in later rounds after the current frontier is settled. Format every numbered item with a distinct **Recommendation:** that gives a concrete default and why.

Each answer set reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a later round, not this one.

Finding **facts** is your job, never the user's. For every independent environment lookup needed by the current frontier, delegate to an independent read-only research worker when the host supports subagents; launch independent lookups concurrently when possible. If delegation is unavailable, perform the lookups directly. Do not block the interview on unrelated research: while lookups run, ask every frontier question that does not depend on them. Wait only when an outstanding lookup is the sole blocker. Incorporate results, recompute the frontier, and continue. The **decisions** are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
