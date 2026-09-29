---
description: Use when the task names Atlas or the workspace exposes an Atlas capability, and engineering research may reuse or persist evidence there.
---

# Atlas research

Atlas is one optional research store for `dev-research`. Use Atlas only when the current workspace or user configuration exposes a qualified live capability. Filesystem presence or advertised intent is not proof.

- A `current` topic may answer through its source-artifact identities and citations.
- A `dirty`, `refreshing`, or `blocked` topic stops with the freshness state, affected sources, and the explicit refresh action required. Never silently serve stale evidence. Report that state in the Research Evidence freshness line; it is a `dev-research` stop.
- A missing or insufficient topic falls back to direct portable research.
- Persist into Atlas only for Atlas-scoped work or explicit durable-capture opt-in.
- Scheduling, daily acquisition, topic refresh, credentials, and transport remain Atlas or adapter responsibilities; do not claim or implement them in research.
