# 2026-06-11 Plugins, Skills, Multi-Model Routing, and Personas

## Objective
Package the efficiency improvements into reusable plugins and skills. Use model routing and specialized personas/agents to send the right work to the right model and behavioral profile, further optimizing cost and token usage.

## Why High-Signal
- Plugins are the official distribution mechanism for hooks, skills, agents, and MCPs.
- Multi-model usage (cheaper models for routine work, strong models for hard reasoning) is a recurring recommendation in agent optimization discussions.
- Focused personas and agent definitions let you create "concise researcher", "strict verifier", "elegance auditor", etc., which naturally produce more efficient behavior.

## Grok Harness Mechanisms
- Plugin system (`grok plugin install`, marketplace, local paths, `.grok/plugins/`)
- Skills directories (project and user)
- Agent definitions in `.grok/agents/` and `~/.grok/agents/`
- `[subagents.personas]` and `[subagents.models]` in config.toml
- Custom models configuration
- `--agent` flag and agent profiles

## Step-by-Step Implementation

1. **Package what you've built**:
   - Move useful hooks, skills, and any local MCPs into a proper plugin structure (with `plugin.json` manifest if desired).
   - Install it locally or via git for reuse across projects.

2. **Create specialized personas / agents**:
   - Concise Executor
   - Research-only (restricted tool access)
   - Strict Verifier
   - Lessons Auditor
   - These can be simple markdown definitions in `.grok/agents/`

3. **Configure model routing**:
   - Use cheaper/faster models for routine verification, search, or simple edits.
   - Reserve the strongest model for planning, architecture, and hard debugging.
   - Wire this via custom models + subagent model assignment or ACP client logic.

4. **Skills for efficiency patterns**:
   - Turn the micro-step loop, smart search workflows, compression usage, etc. into invocable slash commands.

5. **Distribute**:
   - Use the plugin marketplace features or just git + `grok plugin install ./path --trust` for team use.

## Example Agent Definition (`.grok/agents/concise-verifier.md`)

```markdown
# Concise Verifier

You are a focused verification specialist. Your only job is to confirm that changes work correctly with minimal additional context.

Rules:
- Be extremely concise.
- Only read the minimal files needed for verification.
- Prefer running tests/builds over reading code.
- Report pass/fail + one-sentence summary.
- Never propose new features or refactors.
```

Then spawn it via subagents or `--agent`.

## Validation
- Create 2-3 focused personas/agents and measure token usage when the main agent delegates to them vs. doing the work itself.
- Package one plugin containing your most useful efficiency hooks + skills and test installing it in another project.

## Risks / Gotchas
- Plugin trust model means hooks/MCP from plugins require explicit trust.
- Too many personas can become management overhead.
- Model routing requires good observability (know which model is actually being used).

## Related Plans
- All previous plans — this is the packaging and specialization layer on top.
- Especially valuable after you have working hooks, skills, and MCPs.

## Next Actions
- [ ] Identify 2-3 reusable efficiency components worth packaging
- [ ] Create a minimal local plugin containing your best hooks + at least one skill
- [ ] Define 2-3 focused agent/persona definitions
- [ ] Experiment with routing a routine task (e.g. verification or search) to a cheaper model or restricted persona
- [ ] Document the plugin and agents so they can be versioned alongside this plan directory
- [ ] Consider publishing the plugin (or keeping it private in your dotfiles)
