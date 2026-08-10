---
name: dev-improve-codebase-architecture
description: Explicitly survey a codebase for deepening opportunities, present a visual HTML report, and grill the selected option. Use only when invoked by exact skill name or when dev-ask dispatches an approved architecture survey; do not auto-activate for ordinary refactoring, code review, or implementation.
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

This command is _informed_ by the project's domain model and built on a shared design vocabulary:

- Use the `dev-codebase-design` skill for the architecture vocabulary (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and its principles (the deletion test, "the interface is the test surface", "one adapter = hypothetical seam, two = real"). Use these terms exactly in every suggestion — don't drift into "component," "service," "API," or "boundary."
- The domain language in `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record decisions this command should not re-litigate.

## Agent-harness reviews

- This skill may review agent-harness architecture, not only traditional app code.
- For harness reviews, candidate areas include skill directories, rule layering, extensions/hooks, vault organization, memory-bank placement, agent persona boundaries, and research framework file layout.
- When reviewing vault design, evaluate whether the structure exposes a small, stable navigation contract for agents and humans, avoids scattered duplicated concepts, and makes related research artifacts easy to find.
- Continue using `dev-codebase-design` vocabulary; use `dev-domain-modeling` when the issue is terminology/context modeling, and use `craft-skill` or `craft-rule` when the chosen fix edits skills or rules.

## Process

### 1. Explore

**Scope before you scan — YAGNI.** Deepening a module pays off by making future changes to it easier, so put extra weight on the parts of the codebase that have recently changed. Decide _where_ to look before you look:

- If the user named a direction — a module, subsystem, or pain point — take it and skip the inference below.
- Otherwise, inspect a meaningful stretch of commit history (`git log --oneline`) for hot spots — files and areas that keep changing — and let those paths pull your attention first. Widen the net only when the changes are scattered with no clear hot spot.

Read the project's domain glossary (`CONTEXT.md`) and any ADRs in the area you're touching first.

Explore the scoped areas with the host's available read-only codebase tools. When the scope contains independent areas and the host supports subagents, delegate focused explorations in parallel; otherwise explore them directly. Don't follow rigid heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it for the user — `xdg-open <path>` on Linux, `open <path>` on macOS, `start <path>` on Windows — and tell them the absolute path.

The report uses **Tailwind via CDN** for layout and styling, and **Mermaid via CDN** for diagrams where a graph/flow/sequence reliably communicates the structure. Mix Mermaid with hand-crafted CSS/SVG visuals — use Mermaid when relationships are graph-shaped (call graphs, dependencies, sequences), and hand-built divs/SVG when you want something more editorial (mass diagrams, cross-sections, collapse animations). Each candidate gets a **before/after visualisation**. Be visual.

For each candidate, render a card with:

- **Files** — which files/modules are involved
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram** — side-by-side, custom-drawn, illustrating the shallowness and the deepening
- **Recommendation strength** — one of `Strong`, `Worth exploring`, `Speculative`, rendered as a badge

End the report with a **Top recommendation** section: which candidate you'd tackle first and why.

**Use CONTEXT.md vocabulary for the domain, and the `dev-codebase-design` vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

See [HTML-REPORT.md](HTML-REPORT.md) for the full HTML scaffold, diagram patterns, and styling guidance.

Do NOT propose interfaces yet. After the file is written, ask the user: "Which of these would you like to explore?"

### 3. Iterative candidate interview

Once the user picks a candidate, use `dev-grilling` round by round until its decision frontier is empty, the user pauses, or a named evidence/authority blocker remains. Preserve one complete batch of currently independent questions per round; never impose an arbitrary interview-round maximum. Return immutable decision evidence or the exact resumable frontier.

Use `dev-codebase-design` and its approved design-it-twice contract only to explore alternative interfaces for the selected module. Route any qualifying domain write through `dev-domain-modeling`, which exclusively owns artifact qualification, exact-content/destination confirmation, and mutation.

### 4. Return the selected change

Return the survey evidence, chosen architecture change, settled constraints, open authority decisions, observable acceptance, and exact artifact identities in one common Handoff to `dev-ask`. Include `route-impact: unchanged|changed` and no alternative receiver. `unchanged` preserves an already-approved continuation; `changed` identifies the material route facts for recomputation and possible reapproval. This skill surveys and selects; it never authorizes or starts requirements, specification, ticketing, implementation, destructive effects, or shipping.
