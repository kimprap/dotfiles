# mini.surround + mini.ai — Quick Reference

**Your setup (minimal & practical)**
- `mini.surround`: `n_lines=0`, `search_method="cover_or_next"`, `silent=true`
- `mini.ai`: defaults for quotes, brackets, function calls, arguments, tags + custom `a=`/`i=`
- Next/last variants (`an`/`in`/`al`/`il`) **disabled**
- `search_method = "cover_or_next"`, `silent = true` (ai)

---

## mini.surround

| Action              | Keys                  | Example                  | Effect |
|---------------------|-----------------------|--------------------------|--------|
| Add surrounding     | `sa` + textobject + char | `saiw"`                 | `word` → `"word"` |
| Add function call   | `sa` + textobject + `f` | `saiwf` (cursor on `bar`) | `bar` → `foo(bar)` (prompts for name) |
| Add tag             | `sa` + textobject + `t` | `saiwt`                 | content → `<tag>content</tag>` |
| Delete surrounding  | `sd` + char           | `sd"`                    | `"word"` → `word` |
| Delete function call| `sd` + `f`            | `sdf` (inside `foo(bar)`) | `foo(bar)` → `bar` |
| Delete tag          | `sd` + `t`            | `sdt`                    | `<tag>foo</tag>` → `foo` |
| Replace surrounding | `sr` + old + new      | `sr([`                   | `(word)` → `[word]` |
| Find next / prev    | `sf` / `sF` + char    | `sf"`                    | Jump to next `"` pair |
| Highlight current   | `sh`                  | `sh`                     | Briefly flash the surrounding |
| Interactive         | `sa?` / `sd?` / `sr?` | `sa?` then type left/right | Custom delimiters (e.g. `<!-- -->`) |

**Special chars**: `f` = function call, `t` = tag, `?` = prompt for any pair.

**Notes**
- Works with motions, visual mode, and operators.
- Fully dot-repeatable.
- Combines beautifully with mini.ai (see combos below).

---

## mini.ai (textobjects)

Use with `d`, `c`, `y`, `v`, or directly with surround (`sa`/`sd`/`sr`).

| Textobject       | Keys     | Example (`viX` / `ciX`)                  | What you get |
|------------------|----------|------------------------------------------|--------------|
| Double quotes    | `a"` / `i"` | `vi"` (cursor inside `"foo"`)           | `foo` |
| Single quotes    | `a'` / `i'` | `ci'`                                    | Change inside `'...'` |
| Backticks        | ``a` `` / ``i` `` | `va``                               | Around `` `code` `` |
| Parentheses      | `a(` / `i(` | `da(` (on `(args)`)                     | Delete whole `(args)` |
| Brackets         | `a[` / `i[` | `vi[`                                    | Inside `[1, 2]` |
| Braces           | `a{` / `i{` | `ci{`                                    | Inside `{ ... }` |
| Function call    | `af` / `if` | `daf` (cursor inside `foo(bar)`)        | Delete `foo(bar)`, keep args |
| Argument         | `a,` / `i,` | `vi,` (inside `call(a, b, c)`)          | Current arg (`b`) |
| Tag (HTML/JSX)   | `at` / `it` | `cit`                                    | Inside `<tag>content</tag>` |
| Assignment (custom) | `a=` / `i=` | `vi=` on `const x = foo(bar)`       | `foo(bar)` (value) |
|                  |          | `va=` on same                          | `const x = foo(bar)` (full) |
| Whitespace block | `a<Space>` / `i<Space>` | `vi<Space>` (indented block)     | Contiguous whitespace |

**Edge movement** (works on the last textobject you used)

| Keys | Example (after `vi,`) | Effect |
|------|-----------------------|--------|
| `g[` | `vi,g[`              | Jump to start of current textobject |
| `g]` | `vi=g]`              | Jump to end of current textobject |

**Common powerful combos**

- `ci,` — change just the current argument
- `daf` — delete a whole function call
- `ci=` — change only the value of an assignment
- `sdf` — delete surrounding function call (surround + ai)
- `srf` — replace function call wrapper
- `va=` then `sa"` — grab value then surround it

**Notes for your config**
- Next/last variants (`an`/`in` etc.) are disabled.
- Only custom textobject is `=`. `:` is disabled (avoids default punctuation separator behavior).
- Everything else uses mini.ai's strong defaults.
- Plays extremely well with your `mini.surround`.

---

Save this file and keep it handy. All examples are dot-repeatable.