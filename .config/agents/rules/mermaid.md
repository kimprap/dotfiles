---
description: Validate agent-authored Mermaid before emitting or writing diagrams in chat, Markdown, or other artifacts.
---

# Mermaid syntax gate

- Before emitting or writing Mermaid, run `~/.dotfiles/bin/mermaid-check` on the exact final diagram source via stdin or a temporary file, or on the exact Markdown containing it. This includes chat output and session-local artifacts. Any edit invalidates the check: check the edited source again before emitting or writing it.
- Require exit 0. On syntax or lint failure, fix the source and recheck; never emit or write unchecked Mermaid. If the checker is unavailable (including missing runtime or dependencies), disclose that and use plain text instead. If the deliverable specifically requires Mermaid, report it blocked rather than silently substituting or emitting unchecked source.
- In `stateDiagram` and `stateDiagram-v2` transition labels, use commas instead of semicolons: Mermaid can end the label at a semicolon and silently create extra states. This is not a ban on semicolons in other diagram types.

This is an instruction-driven syntax check using `mermaid.parse`, not a render check or a harness output interceptor. Plain-text trees, pseudocode, and other non-Mermaid output do not require it.
