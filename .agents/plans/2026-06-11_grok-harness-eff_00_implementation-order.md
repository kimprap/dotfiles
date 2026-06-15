# 2026-06-11 Grok Agent Harness Efficiency Implementation Order

## Purpose
This document defines the recommended order for implementing the efficiency improvements for the Grok CLI / Grok Build agent harness. The order prioritizes:

- Quick wins with high impact and low risk
- Foundational hygiene before advanced control
- Declarative/config changes before executable code (hooks, MCP)
- Observability and guardrails before deep architectural changes
- Building on Grok's native extension points (config, AGENTS.md, hooks, subagents, MCP, ACP, plugins)

## Phased Implementation Order

### Phase 1: Foundations & Quick Wins (Do these first — 1-2 days)
1. **Per-Project Config Scoping and Bloat Elimination** (`2026-06-11_01_config-scoping-bloat.md`)
   - Highest immediate token savings ("48k tax").
   - Purely declarative, no new code.
   - Enables everything else by reducing baseline noise.

2. **Plan Mode Default + Subagents + Session Hygiene** (`2026-06-11_02_plan-subagents-session-hygiene.md`)
   - Dramatically reduces main context pressure.
   - Changes daily workflow with almost zero setup.
   - Prevents the most common source of token waste and "workstream confusion".

3. **Lessons Capture and Self-Improvement Loop** (`2026-06-11_03_lessons-capture-self-improvement.md`)
   - Creates compounding returns on every correction.
   - Mostly AGENTS.md + a simple tasks/lessons.md file.
   - Turns the agent into a learning system.

### Phase 2: Context & Tool Hygiene (Next priority)
4. **External State + Micro-Step Loops** (`2026-06-11_04_external-state-micro-step-loops.md`)
   - Moves state out of the context window.
   - Directly implements the low-token loop pattern discussed on X.

5. **Compression and Filtering Layers via Hooks/MCP** (`2026-06-11_05_compression-filtering-layers.md`)
   - Replicates the value of external tools (headroom, rtk, context-mode) inside the Grok harness.
   - High token savings on noisy tools (bash, reads, logs).

6. **PreToolUse Guards and Smart Tool Routing** (`2026-06-11_06_pretooluse-guards-routing.md`)
   - Prevents bad/expensive calls before they consume tokens.
   - Natural place for many efficiency rules.

### Phase 3: Advanced Tool & MCP Patterns
7. **Code-as-API MCP + Progressive Tool Discovery** (`2026-06-11_07_code-as-api-mcp-progressive-discovery.md`)
   - Biggest architectural lever for tool-use efficiency (98%+ savings in cited examples).
   - Requires writing a small MCP server but pays off massively.

8. **Targeted Search, Snippet Tools, and Skills** (`2026-06-11_08_targeted-search-skills.md`)
   - Replace broad context dumping with precise retrieval.
   - Skills turn repeated efficient patterns into one command.

### Phase 4: Reliability, Retries & Compaction
9. **Failure Hooks, Retries Management, and Verification Gates** (`2026-06-11_09_failure-hooks-retries-verification.md`)
   - Reduces wasted turns on errors and hallucinations.
   - Includes guarding against known subagent compaction retry loops.

10. **Memory Primitives, Compaction Hooks, and Long-Session Hygiene** (`2026-06-11_10_memory-compaction-hygiene.md`)
    - Proper use of /flush, /memory, /dream (where available).
    - Controlled compaction via hooks.
    - Addresses the compaction loop problem reported on X.

### Phase 5: Harness Engineering (Most powerful but highest effort)
11. **ACP Custom Outer Harness Wrapper** (`2026-06-11_11_acp-custom-harness-wrapper.md`)
    - Full control over the agent loop (micro-steps, custom memory, proxies, multi-model, token accounting).
    - The ultimate "agent harness engineering" layer.

12. **Plugins Packaging + Multi-Model / Personas** (`2026-06-11_12_plugins-multi-model-personas.md`)
    - Package everything above for reuse across projects.
    - Cost-optimize by routing work to the right model + focused personas.

## Implementation Principles
- **Measure first**: Before and after each phase, note rough token usage (use `grok inspect`, external trackers like Tokei if available, or manual session summaries).
- **Start declarative**: Config, AGENTS.md, and prompting changes have zero runtime risk.
- **Add hooks before new MCPs**: Hooks are the fastest way to inject behavior.
- **Use subagents aggressively** during implementation of later phases.
- **Capture lessons immediately**: Every time something works or fails during this rollout, update the lessons file.
- **Test in a small project first**: Use a throwaway or low-stakes repo before applying to .dotfiles or important work.
- **Leverage /flush and fresh sessions** between major implementation steps.

## Success Criteria (Overall)
- Noticeably lower token consumption per comparable task (target: 30-60%+ reduction on routine work).
- Fewer "tool call sprawl" and repeated failed attempts.
- Compaction happens cleanly without retry loops.
- The agent follows project conventions more consistently over time without re-explaining.
- Ability to run longer, more complex tasks without context explosion.

## Notes
- Order is designed so early phases deliver value even if later phases are never completed.
- Many phases have natural synergies (e.g., PreToolUse guards + compression layers; lessons.md + verification gates).
- Revisit this order after Phase 2 — real usage data from your workflows may change priorities.

See individual plan files for detailed steps, example content, and Grok-specific implementation instructions.
