---
name: mnemopi-retain
description: >
  Curate and retain high-signal Mnemopi memories from current or resumed sessions.
  Use for old-session imports, durable memory summaries, retain-only workflows,
  and avoiding noisy /memory enqueue transcript mining.
---

# mnemopi-retain

Turn a session into concise durable memories. Prefer explicit `retain` calls over backend transcript mining when quality matters.

## When to use

- The user asks to summarize and retain memory from a current or resumed session.
- Importing old sessions before deciding whether to run OMP `/memory enqueue`.
- The user wants high-signal memory without raw transcript noise.
- Before `mnemopi-cleanup`, when the problem is prevention rather than cleanup.
## Default policy

Use this as the default daily memory path when the user wants future recall quality:

1. Review the session for durable facts only.
2. Draft a short candidate list first, especially after a noisy or long session.
3. Retain only the final durable items.
4. Skip `/memory enqueue` unless the user explicitly wants broad backend retention.

Treat `retain` as the prevention path and `mnemopi-cleanup` as the repair path.


## What to retain

Retain only durable information that should help future sessions:

- user preferences and operating style;
- project conventions, workflows, and guardrails;
- architectural decisions and their current rationale;
- resolved gotchas, failure causes, and exact fixes;
- durable tool/config facts not already obvious from current repo files;
- commit or file references only when they help future provenance.

Exclude:

- failed guesses, dead ends, transient debugging, logs, and command output;
- stale setup snapshots, old version/restart notices, and one-off tasks;
- facts already documented in repo files unless they encode a user decision or preference;
- raw transcript excerpts, conversation scaffolding, cleanup chatter, greetings, memory-audit/meta conversations, and one-off operational probes;
- tool inventory or harness-behavior discussions unless they produced a durable decision, convention, or fix;
- secrets, tokens, credentials, or pasted private data.

## Workflow

1. Review the current/resumed session context for durable facts only.
2. Group overlapping points and remove duplicates before writing memory.
3. Draft concise standalone memory items. Each item must include enough context to be useful outside the session.
4. Default to showing the candidate list first after noisy, long, or meta-heavy sessions; ask before retaining when the user asked for review.
5. If the user asked to retain/import, call `retain` with the final concise list.
6. Report the retained themes and count. Do not claim backend consolidation unless `/memory enqueue` was actually run.

Useful prompt shape:

```text
Review this session and retain only durable facts, decisions, preferences, project conventions, and resolved gotchas. Exclude transient debugging, stale state, logs, failed guesses, command output, and anything already documented in repo files unless it captures a user preference or decision.
```

## Enqueue policy

Do not call `/memory enqueue` by default. `retain` is the high-quality import path.

Only run `/memory enqueue` when the user explicitly wants backend retention/sleep/consolidation over the session and accepts possible cleanup. If enqueue is used after retain, immediately recommend `mnemopi-cleanup` to audit raw transcript noise, malformed facts, duplicates, and orphan embeddings.

## Retain item quality

Good retained memories are:

- specific, dated when useful, and self-contained;
- written as facts, decisions, preferences, or gotchas;
- scoped to the relevant project/tool/user preference;
- current, not contradicted by later turns;
- short enough to recall cleanly.

Bad retained memories are:

- generic summaries like "worked on config";
- full assistant final reports;
- command transcripts or copied logs;
- stale intermediate states;
- implied instructions extracted from syntax fragments.

## Reporting

Report:

- retained count;
- short bullets naming the retained themes;
- anything intentionally skipped as stale/noisy;
- whether `/memory enqueue` was skipped or run.

Do not retain the summarization transcript itself. Retain only the final durable memory items.
