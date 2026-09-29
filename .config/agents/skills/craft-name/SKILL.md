---
name: craft-name
description: >
  Generate and refine names for projects, brands, products, companies, teams,
  codenames, or related naming targets. Use when the user asks for naming
  options, wants a shortlist or naming direction, reacts to a candidate, or
  needs iterative refinement around tone, symbolism, brevity, brand feel, or
  sibling fit.
---

# craft-name

Generate names that fit meaning, sound, and future range. Stay directional, not rigid.

## Default workflow

1. Infer the naming target and surface area: internal codename, repo or workspace, public product, company, team, feature, or umbrella brand.
2. Extract the active axes from the request and prior reactions: literal versus symbolic, premium versus playful, terse versus descriptive, single-word versus compound, root family, sibling fit, and how visible the function should be.
3. First pass: give a real spread. Most lists should span multiple root families and sound shapes, not just suffix variations on one stem.
4. Once the user likes a direction, narrow quickly. Preserve the liked properties and vary only the unresolved ones.
5. End every pass with 3-5 clear next directions the user can choose for the next cycle.

Ask only when different naming families would lead to materially different outputs and the conversation does not already supply enough signal.

## User preferences

Apply the user's known naming preferences, from rules, memory, or prior reactions, before these generic moves.

## Naming moves

- Start from meaning, then choose how directly to expose it. Literal names explain; abstract names travel better.
- Prefer single-word forms when the goal is premium or durable branding. Add a second word only when clarity or disambiguation materially helps.
- Use visible roots when symbolism matters, but do not let the reference dominate the name.
- Coin blends only when they stay pronounceable and memorable.
- Separate layers when relevant: workspace or repo, public brand, package or binary, company or team name, codename, and release line may deserve different naming styles.
- Do not claim uniqueness, trademark safety, or domain availability unless you actually checked.

## Diversity rule

Within one shortlist, ensure candidates differ meaningfully in some combination of root family, phonetic shape, explicitness, cadence, or emotional tone.
Avoid a list of near-identical suffix swaps unless the user explicitly asks for a tight family exploration.
If you do offer a focused family pass, keep it short and say that it is intentionally narrow.

## Response pattern

- Opening pass: 8-12 candidates, one line each.
- Narrow pass: 5-7 candidates around the strongest family.
- Final pass: 3-5 high-confidence candidates, with one primary recommendation and one backup.
- After every pass, offer distinct next-cycle routes, for example:
  - shorter or sharper
  - more premium or more elegant
  - more symbolic or more mythic
  - more technical or more explicit
  - closer to one chosen root
  - different root families with the same vibe
