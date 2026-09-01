# Packed-label grammar

Visual grammar only. Read this file before rendering a packed-label surface.
Do not copy these spacing rules into consumers. Each consumer owns its H2
titles, field set, order, child kind, omit rules, uniqueness, and any trailer.

## Grammar

1. One or more H2 section titles owned by the consumer.
2. Each field is `**Label**` with no leading hyphen, colon, or trailing space.
   Do not bullet the label.
3. After every H2 and after every `**Label**`, emit one blank line, then the
   field's children.
4. After a field's last child, emit one blank line before the next `**Label**`
   or H2. Do not emit a blank line after the last child of the last field
   unless the consumer defines a trailer.
5. Consecutive children of the same field have no blank line between them.
6. Default child kind is `list`: each child is one line beginning with `- `.
   `ordered` uses `1.` `2.` ... with the same spacing. `table` is a GFM table
   after the blank line: as the whole section body with no `**Label**`, or as
   the children of a labeled field.
7. A consumer may omit a field entirely. It must not emit an empty label.

## Example

```markdown
## Section

**Goal**

- one sentence

**Route**

1. `first-owner`
2. `completion-presentation`
```
