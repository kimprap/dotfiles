# 2026-06-11 Memory Primitives, Compaction Hooks, and Long-Session Hygiene

## Objective
Make proper use of Grok's memory features (`/memory`, `/flush`, `/dream` where available), control compaction via hooks, and maintain long sessions without context degradation or retry loops.

## Why High-Signal
- X reports of painful compaction loops in subagents (hitting threshold → compact → retry → repeat).
- Recent Grok Build updates improved rewind across compaction boundaries and large session resume.
- Proper memory management is repeatedly called out as critical for agentic workflows that last longer than a single context window.
- `/flush` is highlighted as a way to capture value before compaction destroys it.

## Grok Harness Mechanisms
- Built-in commands: `/memory`, `/flush`, `/dream` (or equivalents)
- `PreCompact` and `PostCompact` hooks
- Workspace and global memory layers
- External `tasks/` files + `current-summary.md` as complement
- Per-project AGENTS.md rules for when to flush

## Step-by-Step Implementation

1. Learn the current memory commands available in your version (`/memory` to explore).

2. Establish flush discipline:
   - Before starting a risky or long subagent session
   - When switching major workstreams
   - At natural "checkpoint" moments in complex tasks

3. Create `PreCompact` / `PostCompact` hooks that:
   - Produce a high-quality summary in the format your project prefers
   - Can inject or extract the summary from external files

4. Use `tasks/current-summary.md` (or similar) as the single source of truth for "what matters right now" that survives compaction.

5. Periodically run any available consolidation/dedup command (`/dream`).

6. Add rules about not letting subagents bloat the main context and how to recover from compaction events.

## Recommended AGENTS.md Rules

```markdown
## Memory and Compaction Hygiene

- Use /flush at natural checkpoints and before handing off to long-running subagents.
- Maintain `tasks/current-summary.md` as the authoritative short-term state. Keep it under ~1500 tokens.
- Before compaction is likely, ensure the most important decisions are captured in the summary file and/or flushed to memory.
- If a subagent enters a compaction/retry loop, interrupt it, externalize its state, and restart with a clean subagent or main-agent coordination.
- Review workspace memory at the start of sessions that span multiple days.
```

## Compaction Hook Sketch

Use `PreCompact` to generate a clean handoff summary, and `PostCompact` to re-inject the most important parts if needed.

## Validation
- Run a deliberately long task and observe compaction behavior.
- After compaction, can you still answer "what were the key decisions so far?" accurately from the summary + memory?
- Measure how often you have to re-explain context after compaction.

## Risks / Gotchas
- Memory features are still evolving — test commands in your current version.
- Over-flushing can create noise in the memory store (use `/dream` or manual curation).

## Related Plans
- `2026-06-11_02_plan-subagents-session-hygiene.md`
- `2026-06-11_04_external-state-micro-step-loops.md`
- `2026-06-11_09_failure-hooks-retries-verification.md`

## Next Actions
- [ ] Explore current `/memory`, `/flush`, and any consolidation commands
- [ ] Add Memory and Compaction Hygiene rules to AGENTS.md
- [ ] Create `PreCompact` / `PostCompact` hooks that maintain your preferred summary format
- [ ] Practice using /flush on the next 3-5 substantial tasks
- [ ] Document any version-specific behaviors or gotchas in lessons.md
