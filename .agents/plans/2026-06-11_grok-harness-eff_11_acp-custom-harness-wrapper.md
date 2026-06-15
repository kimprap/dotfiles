# 2026-06-11 ACP Custom Outer Harness Wrapper

## Objective
Use the Agent Client Protocol (`grok agent stdio` / serve) to run Grok as a subordinate and build a thin custom outer loop that implements advanced efficiency behaviors (micro-step orchestration, custom memory, output proxies, token accounting, multi-model routing, etc.) that would be difficult or impossible to achieve with hooks and prompts alone.

## Why High-Signal
- This is the most powerful "agent harness engineering" capability available in Grok.
- Allows you to own the execution loop while still benefiting from Grok's excellent tool use, permissions, sandbox, MCP integration, subagents, etc.
- Directly enables the low-token micro-step loop, external proxies (rtk/context-mode style), full token tracking, and sophisticated orchestration at the harness level.
- Official SDKs exist (TypeScript, Rust, Python, Go, Kotlin).

## Grok Harness Mechanisms
- `grok agent stdio`
- `grok agent serve` (WebSocket)
- Rich `x.ai/*` extension methods (fs, git, terminal, search, session control, etc.)
- Full streaming of `agent_message_chunk`, `agent_thought_chunk`, `tool_call`, etc.
- Session `_meta` options for `rules` and `systemPromptOverride`

## Step-by-Step Implementation

1. Choose a language and set up the official ACP SDK.

2. Start with a minimal client that can:
   - Spawn a Grok agent session
   - Send prompts
   - Receive structured updates
   - Handle tool permission requests

3. Layer on efficiency features in the client:
   - Micro-step state machine (external todo + summary)
   - Automatic output filtering / compression before results are passed back to the model
   - Custom retry and backoff logic
   - Token / cost accounting per step
   - Smart model or persona routing

4. Use the extension methods for deep control (worktrees, precise file ops, terminal sessions, etc.).

5. Treat the ACP client as your "harness" and Grok as the powerful "reasoning + tool execution engine."

## Example High-Level Flow in ACP Client

```
while not done:
    current_goal = load_from_external_summary()
    plan = call_grok_with_tiny_prompt("Current goal + summary. Output ONE micro-step as JSON")
    result = execute_or_delegate(plan)   # can apply filtering here
    update_external_summary(result)
    if needs_verification:
        verify_with_subagent_or_external_process()
```

## Validation
- Build a small prototype that runs a multi-step task through your ACP wrapper.
- Demonstrate lower token usage or better control than the native TUI for the same logical work.
- Measure how much custom logic you can keep out of the agent's context.

## Risks / Gotchas
- Higher initial development cost.
- You become responsible for session management, permissions UI/automation, streaming UX, etc.
- The protocol and extension methods are still expanding — stay current with updates.

## Related Plans
- Almost all previous plans can be *enforced* or *automated* at the ACP layer (especially micro-steps, compression, retries, verification, memory).
- `2026-06-11_12_plugins-multi-model-personas.md`

## Next Actions
- [ ] Pick a language and clone / set up the relevant ACP SDK
- [ ] Get a minimal `grok agent stdio` client running that can send a prompt and receive updates
- [ ] Implement a basic external micro-step loop in the client
- [ ] Add one efficiency feature (e.g., automatic output filtering or token counter)
- [ ] Document the wrapper in `.agents/` so it can be versioned and shared
- [ ] Decide which workflows will use the native TUI vs. the ACP harness
