# dotfiles

Personal dotfiles for macOS, managed as a normal Git repository at `~/.dotfiles`.

## Features

- Minimal and performant Zsh configuration (using Antidote)
- Modern prompt powered by Starship
- Neovim configuration using `vim.pack`
- Ghostty terminal configuration
- Yazi file manager setup
- Useful tools: fzf, zoxide, fd, ripgrep, etc.

## Setup on a New Machine

1. Clone this repository:

   ```bash
   git clone https://github.com/kimprap/dotfiles.git ~/.dotfiles
   ```

2. Run the bootstrap script:

   ```bash
   ~/.dotfiles/.config/scripts/bootstrap
   ```

3. Restart your terminal.

The script installs required packages, fonts, and creates symlinks from `~/.config/` into the repo.

## Requirements

- macOS (Apple Silicon recommended)
- Homebrew

## Managed Tools

| Tool       | Repo path                         | Live path                 |
|------------|-----------------------------------|---------------------------|
| Zsh        | `.config/zsh/`                    | `~/.config/zsh/`          |
| Starship   | `.config/starship/starship.toml`  | `~/.config/starship.toml` |
| Neovim     | `.config/nvim/`                   | `~/.config/nvim/`         |
| Ghostty    | `.config/ghostty/`                | `~/.config/ghostty/`      |
| Yazi       | `.config/yazi/`                   | `~/.config/yazi/`         |

## Archive

Reference-only snapshots (not symlinked or loaded):

| Path              | Description                                      |
|-------------------|--------------------------------------------------|
| `archive/omz/`    | Pre-migration Oh My Zsh install + `zshrc.backup` |

See `archive/omz/README.md` for details.

## Working with the repo

Use the `dot` and `dot-add` aliases (defined in `.config/zsh/zshrc`):

```bash
dot status
dot diff
dot commit -am "update starship prompt"
```

**Never** run `dot add .config` or `dot add -A`. Only add paths listed in `manifest`:

```bash
dot-add zsh
dot-add archive
```

## Adding a new tool

1. Create `~/.dotfiles/.config/<tool>/` with your config files.
2. Add `.config/<tool>` to `manifest`.
3. Symlink: `ln -sfn ~/.dotfiles/.config/<tool> ~/.config/<tool>`
4. `bin/dot-add <tool>`
5. `dot commit -m "add <tool> config"`

## Notes

- A Nerd Font is required for proper Starship symbols (installed automatically via bootstrap).
- This setup is currently macOS-only.
- Only managed config directories live in the repo; other `~/.config/` tools stay local.
