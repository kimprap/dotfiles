Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 05, 09
Status: resolved

## Question

What concise, self-explanatory, author-neutral name should replace an `ask-matt`-style label for the single always-invoked router, while fitting the settled local skill inventory and `eng-` grouping? Use `craft-name` to present genuinely distinct naming families, narrow from the user's reactions, and finish with one primary recommendation and one backup; do not rename files while resolving this ticket.

## Answer

### Primary

Name the single engineering router **`eng-flow`** and install it at:

```text
.config/agents/skills/eng-flow/
```

Its frontmatter `name` must also be `eng-flow`.

`eng-flow` is short enough for repeated direct invocation, joins the approved `eng-*` capability group, and communicates movement through an adaptive lifecycle without claiming that the router itself implements, orchestrates, verifies, or ships. It is author-neutral and does not preserve `ask-matt` provenance in the user-facing name.

The name now carries an important scope boundary: this is the primary interface for the **engineering** lifecycle, not an umbrella for creating and growing a product as a business.

`eng-flow` may begin from:

- an approved external product brief or PRD;
- a settled engineering request;
- a bounded non-product engineering objective.

It may dispatch the conditional `eng-requirements` gate, but it stops with `PRODUCT AUTHORITY REQUIRED` when market or product strategy is missing. General product development, marketing, SEO, positioning, pricing, launch, sales, maintenance of the product business, and growth belong to a future separately named end-to-end product flow.

### Backup

Use **`eng-workflow`** only as the backup if a future hard naming conflict makes `eng-flow` unavailable. It is more literal but longer, more generic, and less pleasant to invoke repeatedly.

Do not install both names. Do not create `ask-matt`, `router`, `flow`, or `eng-workflow` aliases.

### DX

`eng-flow` is the documented primary interface. Retain `grill-me`, `grill-with-docs`, and `wayfinder` as explicit expert entry points; retain direct invocation of `eng-*` capabilities when the user intentionally pins a valid stage. Every route enters the same canonical capability graph rather than a parallel lifecycle.
