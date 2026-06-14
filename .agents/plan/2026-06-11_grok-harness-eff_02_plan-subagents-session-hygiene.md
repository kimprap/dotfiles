# 2026-06-11 Plan Mode Default + Subagents + Session Hygiene

## Objective
Make plan mode the default for non-trivial work, aggressively use subagents to keep the main context clean, and maintain strict session boundaries so context does not accumulate "workstream confusion."

## Why High-Signal
Repeatedly emphasized by @grok and in shared orchestration playbooks on X:
- "Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)"
- "Subagent Strategy to keep main context window clean — Offload research, exploration, and parallel analysis to subagents"
- "/new or /flush between distinct tasks (prevents workstream confusion)"

This changes behavior more than almost any other single practice.

## Grok Harness Mechanisms
- Plan mode (enter via command or prompt)
- Subagent spawning (native + personas)
- `/new`, `/flush`, fresh terminal sessions
- Per-directory AGENTS.md (different rules for different parts of the tree)
- Subagent configuration in config.toml or agent profiles

## Step-by-Step Implementation

1. **Update AGENTS.md** (root and key subdirectories) with strong plan-mode and subagent guidance.

2. **Train the habit**:
   - For any task that would take >5-10 minutes or involves >2 files/architecture: explicitly start with "Enter plan mode and ..."

3. **Use subagents liberally**:
   - Research → dedicated subagent
   - Testing / verification → dedicated subagent
   - Exploration of unfamiliar code → subagent
   - One focused task per subagent

4. **Session hygiene rules**:
   - New major feature or bug class → new session or `/flush` + clear summary
   - After context feels "noisy" → `/flush` then consider `/new`

5. **Create supporting structure**:
   - `tasks/plan.md` or use the built-in plan mode artifacts
   - Consistent naming for subagent handoffs

## Recommended AGENTS.md Additions (add to root and relevant subdirs)

```markdown
## Workflow Discipline (Efficiency)

### Plan Mode
- For any task with 3+ steps, architectural impact, or uncertainty: start in plan mode.
- Write a clear plan before touching code.
- If things go sideways, STOP and re-plan rather than continuing.

### Subagents
- Offload research, code exploration, parallel testing, and analysis to subagents.
- Keep the main agent context focused on coordination and final implementation.
- One clear objective per subagent.

### Session Boundaries
- Use /new or /flush when switching major workstreams.
- Do not let old debugging context pollute new feature work.
```

## Validation
- Track how often you enter plan mode on medium+ tasks.
- After 1 week, compare average context usage and "feels clean" rating on similar tasks.
- Subagent usage should be visible in the tasks pane and should materially reduce main-agent token burn on research-heavy work.

## Risks / Gotchas
- Over-using subagents can create coordination overhead.
- Some users forget to review subagent output thoroughly.
- Plan mode can feel slower on trivial tasks — be explicit about the threshold.

## Related Plans
- Works extremely well with `2026-06-11_03_lessons-capture-self-improvement.md` (plan mode makes it easy to capture lessons).
- `2026-06-11_04_external-state-micro-step-loops.md` (subagents pair nicely with external state).
- `2026-06-11_10_memory-compaction-hygiene.md`

## Next Actions
- [ ] Add the Workflow Discipline section to root AGENTS.md
- [ ] Add a similar (lighter) section to 2-3 high-traffic subdirectories
- [ ] For the next 5 non-trivial tasks, explicitly start in plan mode and spawn at least one subagent
- [ ] Note any coordination friction and capture it in lessons
