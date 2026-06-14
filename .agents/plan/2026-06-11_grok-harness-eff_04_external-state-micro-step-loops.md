# 2026-06-11 External State + Micro-Step Loops

## Objective
Move as much state and history as possible out of the LLM context window. Run the agent in a tight "plan one micro-step → execute → get external feedback → update tiny summary" loop instead of long multi-turn conversations with full history.

## Why High-Signal
Directly from @grok on X:
"A practical low-token loop for coding agents:

while not done:
 plan = prompt_agent("Goal + short summary. Output ONE micro-step as JSON {action, file, desc}")
 apply(plan)
 feedback = run_tests() # concise
 update_summary(feedback) # keep tiny

Why few tokens:
- State lives in files + running summary (no full history)
- One tiny action per turn
- Structured JSON outputs
- External validation/tools"

This is one of the most powerful patterns for long-running or complex work.

## Grok Harness Mechanisms
- Strong prompting / skills for structured output
- External files (tasks/todo.md, running-summary.md, etc.)
- Subagents (can run parts of the loop)
- Hooks (PostToolUse, Stop) to help maintain summaries
- Plan mode + ACP (for more sophisticated outer loops)
- `/flush` and memory system

## Step-by-Step Implementation

1. Create supporting files in the project:
   ```bash
   mkdir -p tasks
   touch tasks/current-summary.md
   touch tasks/todo.md
   ```

2. Add a "Micro-Step Discipline" section to AGENTS.md.

3. Define a consistent micro-step format (JSON or very strict markdown).

4. For complex tasks:
   - Start with a high-level goal + short summary in the prompt.
   - Instruct the agent to output **exactly one** micro-step.
   - After the step is applied, feed back concise external results (test output, diff summary, etc.).
   - Update the running summary file with what was learned.

5. Use subagents for the "apply + verify" parts when beneficial.

6. (Advanced) Build or use a small skill that enforces the loop format.

## Recommended AGENTS.md Section

```markdown
## Micro-Step Loop (Token Efficiency)

When working on non-trivial or long tasks, use the external micro-step loop:

- Keep a short "current goal + summary" in the prompt (never the full history).
- Output **exactly one** micro-step at a time in this format:

```json
{
  "action": "edit | run | research | verify",
  "target": "path/to/file or command",
  "description": "one-sentence description of this step",
  "expected_outcome": "what success looks like"
}
```

- After the step, I will provide concise feedback (test results, diff summary, etc.).
- Immediately update `tasks/current-summary.md` with key decisions and state.
- Only move to the next micro-step after the current one has external validation.
```

## Supporting File: tasks/current-summary.md (example structure)

```markdown
# Current Task Summary (keep this very short)

**Goal:** Add rate limiting to the API endpoint.

**Key Decisions So Far:**
- Using token bucket algorithm
- Configurable via env var `RATE_LIMIT_TOKENS`
- Middleware placed before auth

**Current State:**
- Middleware skeleton exists in `src/middleware/rate-limit.ts`
- Tests failing on the 429 response shape

**Next Micro-Step Focus:** Fix test expectation and verify with a manual curl.
```

## Validation
- On a complex task, compare token usage of "normal conversation style" vs "strict micro-step + external summary" style.
- The summary file should stay small (under ~2k tokens even for long tasks).
- Agent should resist the urge to do multiple steps in one response.

## Risks / Gotchas
- Can feel slower for the human in the loop on simple tasks.
- Requires discipline from both the user and the agent.
- The agent may still try to do too much in one turn — strong instructions + examples help.

## Related Plans
- `2026-06-11_02_plan-subagents-session-hygiene.md`
- `2026-06-11_05_compression-filtering-layers.md` (micro-steps benefit hugely from concise feedback)
- `2026-06-11_11_acp-custom-harness-wrapper.md` (ACP is the natural place to automate this loop)

## Next Actions
- [ ] Add Micro-Step Loop section to AGENTS.md
- [ ] Create `tasks/current-summary.md` and `tasks/todo.md`
- [ ] Run one medium task end-to-end using strict micro-step discipline
- [ ] Capture any friction in `tasks/lessons.md`
