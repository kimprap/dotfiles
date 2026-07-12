---
description: >
  Foundational handling of project source-of-truth Markdown docs
  (ARCHITECTURE.md, DESIGN.md, and similar) when they exist in a repo.
alwaysApply: true
---

# Project truth docs

Many agentic repos keep a small set of **canonical Markdown contracts** for durable intent. This rule is project-neutral: apply only to docs that **exist** in the current workspace. Do not invent, require, or scaffold a truth doc just because it appears in this catalog.

## What counts

A **truth doc** is a deliberate source-of-truth Markdown file for a durable concern—not a plan, ADR log, README tour, or skill checklist. Common names (illustrative, not mandatory):

| Doc | Typical concern (when present) |
|---|---|
| `ARCHITECTURE.md` | System structure, invariants, ownership, integration seams |
| `DESIGN.md` | Product/UI/interaction design decisions (often frontends) |
| `DOMAIN.md` / `MODEL.md` | Domain language and model boundaries |
| Other project-declared SO Markdown | Same treatment when the repo clearly treats the file as a contract |

Also check common homes before concluding a doc is absent: repo root, `.agents/`, `docs/`. Prefer the path the project already uses; do not duplicate the same contract in two places.

## Presence and absence

- **If present:** treat it as authoritative for its concern. Read it before material work that could contradict it. Keep it accurate when that work changes the contract.
- **If absent:** do nothing special. Do not create it proactively. Infer from code, tests, `AGENTS.md`/rules, and the user. Only create a truth doc when the user or an explicit project convention asks for one.
- **Partial sets are normal.** A backend may have architecture without design; a UI package may have design without a full architecture file. Missing siblings are not errors.

## When present — operating contract

1. **Read before changing** the concern the doc owns (structure, public seams, design system, domain rules).
2. **Prefer the doc over improvisation** when it clearly covers the decision. If reality and the doc disagree, fix the mismatch deliberately—update the doc, or change the system to match—do not silently diverge.
3. **Update in the same change** when you alter an invariant the doc states. Do not leave a known-stale truth doc after intentional contract changes.
4. **Do not paste the whole doc** into every reply; cite the path and only the clauses that matter.
5. **Conflict order:** more local/specific project instructions and the user’s direct request win for *task scope*; for *durable system intent*, prefer the truth doc unless the user explicitly supersedes it. If two truth docs conflict, state the conflict and resolve with the user or the more specific doc.

## Non-goals

- Not a license to create documentation sprawl or mirror README content into truth docs.
- Not a substitute for tests, schemas, or typed APIs when those already enforce the contract.
- Not a requirement that every repo adopt the full catalog above.
