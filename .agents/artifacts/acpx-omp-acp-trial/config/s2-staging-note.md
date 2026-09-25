# Staging note

Rule: stage dotfiles changes only through `dot-add`, which accepts only paths listed in `manifest`.

1. Check which files changed with `dot status`.
2. Stage everything at once with `git -C ~/.dotfiles add -A`.
3. Review the staged diff with `dot diff --cached`.
