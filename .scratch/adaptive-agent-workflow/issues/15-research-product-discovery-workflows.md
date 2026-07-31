Type: research
Parent: [Portable adaptive agent implementation workflow](../map.md)
Status: resolved

## Question

Which current, public, source-verifiable agent skills and established product-development sources provide reusable practices for a business-side product path before engineering specification? Prioritize relevant entries in Cursor's public plugin catalog, then primary sources for customer and problem discovery, market or competitor evidence, target customer and jobs, positioning, business model and pricing assumptions, product strategy, success metrics, risk, launch or go-to-market, experiments, and feedback. Distinguish a product brief or PRD from an engineering implementation specification, and record license or attribution constraints for any candidate skill text.

## Answer

### Corrected source scope

Product research is supporting context for the end-to-end agent workflow, not its organizing concern. No government product-development source is retained. Cursor candidate inputs are limited to the [agent-swarm article](https://cursor.com/blog/agent-swarm-model-economics), public [`orchestrate`](https://github.com/cursor/plugins/tree/ba7b5907843e1e21ec692418c180e1f912cbf7d3/orchestrate), [`cursor-team-kit/skills`](https://github.com/cursor/plugins/tree/ba7b5907843e1e21ec692418c180e1f912cbf7d3/cursor-team-kit/skills), [`continual-learning`](https://github.com/cursor/plugins/tree/ba7b5907843e1e21ec692418c180e1f912cbf7d3/continual-learning), and another public Cursor directory only when a later ticket establishes a directly relevant durable discipline. Cursor's separate pstack end-to-end workflow is excluded from synthesis and reserved for comparison after this map is decision-complete.

### Matt research boundary

Matt Pocock's current [`research` skill](https://github.com/mattpocock/skills/blob/ed37663cc5fbef691ddfecd080dff42f7e7e350d/skills/engineering/research/SKILL.md) is intentionally thin: investigate a bounded question against primary sources, preserve citations, and write one Markdown finding in the repository's established location. It does not define product strategy, longitudinal evidence identity, freshness, scheduling, or later retrieval. The adapted portable skill should retain that methodology without making research a mandatory stage for ordinary product or implementation work.

### Atlas optional coverage

Atlas at `/Users/kim/dev/atlas/app` is the relevant optional durable evidence system. Its architecture and skills define logical `vault://atlas/…` source, run, registry, topic, pass, and freshness roles; web retrieval remains a host capability. `atlas-research` is vault-only by default, `atlas-answer` is exact and freshness-gated, and `atlas-refresh` is explicit. The current façade and continuous-research scheduler are incomplete, so portable integration must capability-detect a qualified adapter and retain a non-Atlas cited-artifact fallback.

Repository evidence:

- `/Users/kim/dev/atlas/app/.agents/ARCHITECTURE.md`
- `/Users/kim/dev/atlas/app/.agents/skills/atlas-research/SKILL.md`
- `/Users/kim/dev/atlas/app/.agents/skills/atlas-answer/SKILL.md`
- `/Users/kim/dev/atlas/app/.agents/plans/2026-07-27-0153_atlas-agent-tools-and-campaign-closure.md`
- `/Users/kim/dev/atlas/app/.agents/plans/2026-07-14-1337_atlas-evaluation-continuous-research.md`

### Product-bridge consequence

An engineering specification needs approved product authority only when product decisions govern the request; bounded bugs, maintenance, internal tooling, migrations, and architecture work may instead begin from settled engineering authority. This effort does not import a broad product-research methodology. Research may support bounded engineering requirements or feasibility, optionally through Atlas, but never manufactures missing product authority.

### Later scope correction

The user subsequently separated broad product development from the engineering workflow. Customer/market discovery, positioning, pricing, product strategy, launch, sales, and growth findings in this research are reserved for a future dedicated product flow. The current engineering workflow may reuse only the bounded primary-source method and optional Atlas evidence coverage for engineering requirements or feasibility; it never uses research to manufacture missing product authority.
