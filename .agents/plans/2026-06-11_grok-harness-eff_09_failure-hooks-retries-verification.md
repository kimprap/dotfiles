# 2026-06-11 Failure Hooks, Retries Management, and Verification Gates

## Objective
Reduce wasted turns from tool failures, hallucinations, and incomplete work by intercepting failures, implementing smarter recovery, and enforcing strong verification before the agent considers work "done."

## Why High-Signal
- Directly attacks retry loops and repeated mistakes.
- `PostToolUseFailure`, `StopFailure`, and `PermissionDenied` hooks give visibility and control.
- Verification discipline ("Never mark a task complete without proving it works") is a recurring theme in high-quality agent playbooks shared on X.
- Guards against the specific compaction retry loop problem reported in subagents.

## Grok Harness Mechanisms
- `PostToolUseFailure`, `StopFailure`, `PermissionDenied` hooks
- `PreToolUse` (preventive)
- Strong AGENTS.md rules + lessons.md integration
- Subagent verification tasks
- External test/build feedback loops (combined with micro-step pattern)

## Step-by-Step Implementation

1. Create hooks for failure events.

2. In failure hooks:
   - Log the exact failure with context
   - Suggest or trigger a recovery strategy
   - Update lessons.md with the failure pattern

3. Add mandatory verification language to AGENTS.md:
   - "After changes, run relevant tests/builds and confirm success before claiming completion."
   - "For non-trivial work, use a dedicated verification subagent or explicit checklist."

4. Handle the known compaction loop issue:
   - In subagent usage rules: "If a subagent appears to be stuck in a compaction/retry cycle, interrupt and move state to external files + start a fresh subagent or main-agent coordination."

5. Combine with the lessons capture system.

## Example Failure Hook

`.grok/hooks/failure-handlers.json`:

```json
{
  "hooks": {
    "PostToolUseFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".grok/hooks/scripts/log-failure-and-suggest-recovery.sh"
          }
        ]
      }
    ],
    "StopFailure": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".grok/hooks/scripts/capture-stop-failure.sh"
          }
        ]
      }
    ]
  }
}
```

The scripts should append structured entries to `tasks/lessons.md` or a dedicated `tasks/failures.log`.

## AGENTS.md Verification Rules (strong version)

```markdown
## Verification Before Completion

- Never declare a task complete until you have external proof it works.
- For code changes: run the relevant tests, linter, type checker, or build and show clean results.
- For behavior changes: describe (or demonstrate) the before/after.
- If verification is expensive, use a subagent whose only job is verification.
- If you hit repeated failures or compaction loops in a subagent, surface the problem and use external state + a fresh attempt rather than looping.
```

## Validation
- Measure "number of failed tool turns per successful task" before and after.
- Track how often the agent attempts to close a task without verification.

## Risks / Gotchas
- Overly strict verification can slow down exploration phases.
- Hooks must be reliable — a broken failure hook is worse than none.

## Related Plans
- `2026-06-11_03_lessons-capture-self-improvement.md` (failures feed lessons)
- `2026-06-11_06_pretooluse-guards-routing.md`
- `2026-06-11_10_memory-compaction-hygiene.md` (directly addresses compaction loops)

## Next Actions
- [ ] Create failure hooks for at least `PostToolUseFailure` and `StopFailure`
- [ ] Add strong Verification Before Completion rules to AGENTS.md
- [ ] Add explicit guidance about detecting and escaping subagent compaction loops
- [ ] Run a task that previously had several failures and observe the new behavior
- [ ] Ensure failures are being captured into lessons
