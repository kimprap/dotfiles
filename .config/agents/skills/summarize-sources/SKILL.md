---
name: summarize-sources
description: >
  Summarize one or more public URLs into concise agent-readable Markdown notes.
  Use when the user provides links to articles, blog posts, docs, GitHub repos,
  papers, or X posts/threads and wants reusable summaries for later browsing,
  comparison, or option extraction.
disableModelInvocation: true
---

# summarize-sources

Turn links into compact source notes that future agents can scan fast.

Default output root: `local://source-summaries/<YYYY-MM-DD>/` unless the caller gives a path.

Suggested manual invocation: `/summarize-sources <url...>`

## Read first

Before writing any summary, read `assets/source-summary-template.md` and use it as the starting shape. Remove any section that would be empty.

## Tagging convention

Use lowercase kebab-case tags in `facet/value` form.

Required facets:

- exactly one `domain/<broad-domain>`
- at least one `topic/<specific-topic>`
- exactly one `kind/<resource-kind>`

Optional facets when they add retrieval value:

- `method/<approach-or-technique>`
- `system/<tool-project-or-company>`
- `signal/<high-mixed-speculative>`
- `region/<country-or-market>`
- `audience/<builder-operator-researcher-exec>`

Examples:

- `domain/agentic`
- `topic/programmatic-agents`
- `topic/agents-memory`
- `topic/frontend-design-skills`
- `kind/x-thread`
- `method/multi-agent`
- `system/anthropic`
- `signal/high`

## Checklist

- [ ] Normalize the input into one canonical URL per source. Skip duplicates.
- [ ] Fetch the cleanest readable version first. Prefer official Markdown pages, `llms.txt` / `llms-full.txt`, GitHub README/docs, or reader-mode extraction. Use a browser only when static reads are incomplete.
- [ ] For X posts or threads, capture the visible post text, engagement counts if visible, and any high-signal replies you can actually read. Do not invent hidden replies behind login walls.
- [ ] Extract source metadata: title, source URL, author or org, source type, published date if visible.
- [ ] Set `coverage` accurately: `complete`, `partial`, or `metadata-only`. If the fetch was incomplete or blocked, lower `confidence` and say why.
- [ ] Assign 3-8 tags using the required facets first. Prefer retrieval value over cleverness.
- [ ] Write one summary file per URL using the template. Keep the TL;DR to 1-2 sentences and the rest dense, concrete, and skimmable.
- [ ] Preserve specifics that matter later: named systems, options, comparisons, metrics, dates, caveats, and links the source relies on.
- [ ] Delete empty headings. Do not emit placeholder text, boilerplate conclusions, or long quote dumps.
- [ ] Report the output paths and a one-line relevance cue for each file.

## Quality bar

Good summaries are:

- short enough to skim in under a minute;
- specific enough that another agent can decide whether to reopen the original;
- faithful about evidence, uncertainty, and source quality;
- structured consistently enough for folder-wide scanning.

Avoid:

- generic prose that says the source was "interesting" or "important";
- flattening compared approaches into one blended answer;
- copying the source instead of compressing it;
- hiding uncertainty when the source is thin, speculative, or partially fetched.

## Filename pattern

Unless the caller specifies otherwise, write files under:

`local://source-summaries/<YYYY-MM-DD>/`

Use:

`<kind>--<slug>.md`

Examples:

- `x-thread--anthropic-llms-full-txt.md`
- `blog-post--multi-agent-research-system.md`
- `github-repo--agent-harness-examples.md`

## Output policy

One file per source. Do not merge multiple URLs into one summary unless the caller explicitly asks for a synthesis note.
