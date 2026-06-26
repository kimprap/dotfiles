---
note_type: source-summary
title: "<resource title>"
source_url: "<canonical url>"
source_type: "article|blog-post|docs|github-repo|paper|x-post|x-thread|video|podcast|other"
author: "<person or org>"
publisher: "<site or org>"
published: "YYYY-MM-DD"
summarized: "YYYY-MM-DD"
coverage: "complete|partial|metadata-only"
confidence: "high|medium|low"
tags:
  - domain/<broad-domain>
  - topic/<primary-topic>
  - kind/<resource-kind>
  # optional:
  # - topic/<secondary-topic>
  # - method/<approach>
  # - system/<tool-or-project>
  # - signal/<high-mixed-speculative>
---

<!-- Copy this template. Keep the frontmatter keys. Delete any section that would be empty. -->
<!-- Frontmatter is the machine source of truth. The rendered header below is for humans. Keep them in sync. -->
<!-- source_type: one of article|blog-post|docs|github-repo|paper|x-post|x-thread|video|podcast|other -->
<!-- Tags use lowercase kebab-case in facet/value form: domain/..., topic/..., kind/..., optional method/... system/... signal/... -->

# <resource title>

**Source**: [<resource title>](<canonical url>)  
**Author**: <person or org>  
**Published**: <YYYY-MM-DD or Unknown>  
**Summarized**: <YYYY-MM-DD>  
**Coverage**: <complete|partial|metadata-only>  
**Confidence**: <high|medium|low>

> **TL;DR**: 1-2 sentences on the main point and why it matters.

## Key points

- 3-7 dense bullets.
- Prefer concrete claims, named systems, numbers, dates, and direct tradeoffs.

## Approaches / mechanics

- Methods, architectures, workflows, protocols, clinical pathways, investment processes, interventions, decision rules, or compared options.
- If the source compares multiple approaches, keep them separate.

## Evidence / examples

- Benchmarks, user reports, code pointers, case studies, citations, or other specifics.
- Include numbers and dates when they matter.

## Caveats / open questions

- Limits, assumptions, conflicts, unclear points, or what the source does not prove.
- If coverage is partial or metadata-only, say why here (paywall, JS-heavy page, rate limit, login wall, etc.).

## Reuse cues

- The future questions or tasks this note is most useful for.
- Add 2-5 natural-language queries or tasks another agent would plausibly run later (for example, `agent harnesses ranked by community effectiveness` or `factor models with out-of-sample decay data`).

## Links

- Canonical: <canonical url>
- Referenced: <url> — <why it matters>
