# 2026-06-11 Lessons Capture and Self-Improvement Loop

## Objective
Turn every correction and insight into durable project rules so the agent stops repeating the same mistakes. Create a compounding "lessons learned" system.

## Why High-Signal
Core pattern from orchestration playbooks shared on X:
- "After ANY correction from the user: update 'tasks/lessons.md' with the pattern"
- "Write rules for yourself that prevent the same mistake"
- "Ruthlessly iterate on these lessons until mistake rate drops"
- "Review lessons at session start for relevant project"

This is one of the highest-leverage ways to improve long-term agent reliability and reduce wasted turns.

## Grok Harness Mechanisms
- `AGENTS.md` (and subdirectory versions) — the primary place to inject rules
- Dedicated `tasks/lessons.md` (or `.agents/lessons.md`)
- `/flush` + memory system to persist insights across sessions
- Hooks (optional) to remind or auto-capture at end of session
- Subagent personas that can be instructed to "review against lessons"

## Step-by-Step Implementation

1. Create the lessons file:
   ```bash
   mkdir -p tasks
   touch tasks/lessons.md
   ```

2. Add a strong instruction in root `AGENTS.md` (and relevant subdirs).

3. Establish the ritual:
   - After any user correction, immediately capture:
     - What went wrong
     - The root cause / pattern
     - The preventive rule (written as an instruction the agent should follow)
   - At the start of relevant sessions, explicitly "review lessons" in the prompt or via a skill.

4. Keep lessons.md high-signal:
   - One line per rule when possible
   - Group by category (e.g., Testing, Git, Styling, Tool Use, Architecture)
   - Periodically prune or promote rules into AGENTS.md

5. Optional automation: Create a small skill or hook that helps format lessons.

## Recommended AGENTS.md Section

```markdown
## Self-Improvement & Lessons

After any user correction or important realization:
1. Immediately update `tasks/lessons.md` with:
   - The specific mistake or inefficiency
   - The pattern to watch for
   - A clear, actionable rule I must follow in the future

At the beginning of any non-trivial session, review the most relevant lessons from `tasks/lessons.md` and `AGENTS.md`.

Never repeat the same class of mistake without having updated the lessons file.
```

## Example tasks/lessons.md Structure

```markdown
# Project Lessons (Self-Improvement)

## Tool Use
- Always read the file (or relevant section) before proposing edits. Never guess line numbers or content.
- For terminal commands that produce large output, use a summarizer or limit flags first. Never dump raw logs into context unless explicitly asked.

## Testing & Verification
- After any code change that could affect behavior, run the relevant test or build command and confirm it passes before declaring the task complete.
- For UI changes, describe what was verified (manual or automated).

## Git & Changes
- Stage only the files that were intentionally changed for the current task. Use `git status` and `git diff --name-only` to verify.

## Architecture / Styling
- Prefer minimal, local changes over broad refactors unless the task explicitly calls for architecture work.
- Follow the existing patterns in the immediate directory rather than imposing new conventions.

## Session Hygiene
- When switching from debugging to new feature work, start a fresh session or /flush + summarize decisions first.
```

## Validation
- After 2 weeks, count how many times the agent repeated a previously corrected mistake.
- Review the lessons file — it should be growing with high-quality, specific rules.
- Agent should spontaneously reference lessons in plans or reasoning.

## Risks / Gotchas
- Lessons can become noisy if not curated.
- The agent may "forget" to update lessons unless the instruction is strong and repeated.
- Promote the best rules into AGENTS.md so they are always present.

## Related Plans
- `2026-06-11_02_plan-subagents-session-hygiene.md`
- `2026-06-11_09_failure-hooks-retries-verification.md` (lessons pair extremely well with verification)
- `2026-06-11_10_memory-compaction-hygiene.md`

## Next Actions
- [ ] Create `tasks/lessons.md` with initial seed rules from recent pain points
- [ ] Add the Self-Improvement section to root AGENTS.md
- [ ] For the next correction (from user or self-review), immediately update lessons.md
- [ ] Add a "Review lessons" step to your standard plan mode template
