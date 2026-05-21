# Starship prompt presets

Examples assume repo `~/.dotfiles`, cwd `~/.dotfiles/.config/yazi/plugins`, branch `main`, clean git.

## Path display (`[directory]`)

| Style | Settings | Line 1 example |
|-------|----------|----------------|
| **Leaf only** (like milo `%1~`) | `truncation_length = 1`, `truncate_to_repo = false` | `plugins` |
| **Repo tail 2** (recommended) | `truncation_length = 2`, `truncate_to_repo = true` | `yazi/plugins` |
| **Repo tail 3** (monorepo) | `truncation_length = 3`, `truncate_to_repo = true` | `.config/yazi/plugins` |
| **Full from repo root** | `truncation_length = 8`, `truncate_to_repo = true` | `.config/yazi/plugins` |

`truncate_to_repo = true` is widely used with Starship: paths are relative to the git root, not `$HOME`, so you always know which project you're in.

Starship does **not** built-in `foo/.../bar` middle ellipsis; community options are:

- Increase `truncation_length` (simplest)
- Use `fish_style_pwd_dir_length = 1` for fish-style shortening (first char per segment)
- Third-party: accept longer paths or use `format` with custom logic

## Full prompt alternatives

### A — Minimal (current default in `starship.toml`)

```
yazi/plugins|main
⇒
```

With dirty git:

```
yazi/plugins|main(!?)
⇒
```

### B — Branch on second line

```toml
format = "$directory$git_status\n$git_branch$character"
```

```
yazi/plugins(!?)
main
⇒
```

### C — Single line (compact)

```toml
format = "$directory$git_branch$git_status $character"
[character]
success_symbol = "⇒ "
```

```
yazi/plugins|main ⇒
```

### D — Show gcloud only when needed

```toml
[gcloud]
disabled = false
format = "☁️ [$account]($style) "
```

After `gcloud config configurations activate default`:

```
yazi/plugins|main ☁️ sura.prap@gmail.com
⇒
```

## Fix deprecated GCP account in prompt

The email comes from **active gcloud configuration**, not Starship:

```bash
gcloud config configurations list
gcloud config configurations activate default   # sura.prap@gmail.com
```

Or disable `[gcloud]` in `starship.toml` (default in repo).
