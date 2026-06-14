# 2026-06-11 Targeted Search, Snippet Tools, and Skills

## Objective
Replace broad, token-heavy context gathering (raw grep + multiple read_file calls) with precise, high-signal retrieval mechanisms. Turn the best retrieval patterns into reusable skills.

## Why High-Signal
Community tools repeatedly praised on X (semble, code-review-graph, etc.) achieve 90%+ token reductions by returning only useful snippets instead of whole files or massive grep output. This directly attacks one of the biggest sources of context bloat in coding agents.

## Grok Harness Mechanisms
- Custom MCP for smart search
- Skills (slash commands) that encapsulate good retrieval workflows
- AGENTS.md rules about "never read more than necessary"
- Subagents specialized in research/search
- PreToolUse hooks to steer away from raw broad searches

## Step-by-Step Implementation

1. Analyze recent sessions: what search patterns are you (or the agent) using most?

2. Build or adopt a better search primitive:
   - Semantic or structural search
   - Returns ranked, small snippets + file + line ranges
   - Optional "expand around this snippet" follow-up

3. Wrap the best patterns as skills (e.g. `/smart-search`, `/find-usage`, `/explain-symbol`).

4. Add strong guidance in AGENTS.md:
   - Prefer smart search over raw grep + read
   - Read the smallest possible relevant region or ask for a targeted summary first.
   - For understanding relationships between code, prefer call-graph / usage search over dumping multiple files.

5. Optionally create a dedicated "researcher" persona/subagent that is only allowed to use efficient search tools.

## Example Skill Idea

Create `.grok/skills/targeted-search/SKILL.md` with clear instructions for the agent on when and how to use the project's preferred search tools.

Example AGENTS.md rule:

```markdown
## Search Discipline (Token Efficiency)

- Never start with a broad `grep` across the whole codebase unless the task explicitly requires it.
- Use the project's smart search tools or MCP first.
- When you do need to read a file, request the smallest relevant range or ask for a targeted summary first.
- For understanding relationships between code, prefer call-graph / usage search over dumping multiple files.
```

## Validation
- Pick 3 recent "I need to understand this area" tasks.
- Re-do them using only the new targeted search approach.
- Measure tokens spent on context gathering and time to relevant understanding.

## Risks / Gotchas
- Overly narrow search can miss things (the smart search must have good recall + easy expansion).
- Requires investment in the search backend.

## Related Plans
- `2026-06-11_07_code-as-api-mcp-progressive-discovery.md`
- `2026-06-11_05_compression-filtering-layers.md`

## Next Actions
- [ ] Inventory the last 10 times the agent did significant searching/reading
- [ ] Define the ideal "targeted search" contract for this project
- [ ] Implement or integrate one improved search tool (MCP or wrapped existing tool)
- [ ] Create at least one reusable skill for common search workflows
- [ ] Add Search Discipline rules to AGENTS.md
- [ ] Test on a real exploration task
