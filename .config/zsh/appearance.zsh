# ls/diff colors (ported from OMZ lib/theme-and-appearance.zsh, prompt parts removed)

if command diff --color /dev/null{,} &>/dev/null; then
  function diff {
    command diff --color "$@"
  }
fi

[[ "$DISABLE_LS_COLORS" = true ]] && return 0

export LSCOLORS="Gxfxcxdxbxegedabagacad"

if [[ -z "$LS_COLORS" ]]; then
  if (( $+commands[dircolors] )); then
    [[ -f "$HOME/.dircolors" ]] \
      && source <(dircolors -b "$HOME/.dircolors") \
      || source <(dircolors -b)
  else
    export LS_COLORS="di=1;36:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43"
  fi
fi

typeset -g _LS_BIN=ls
if (( $+commands[gls] )); then
  _LS_BIN=gls
elif [[ -x /opt/homebrew/opt/coreutils/libexec/gnubin/gls ]]; then
  _LS_BIN=/opt/homebrew/opt/coreutils/libexec/gnubin/gls
elif [[ -x /usr/local/opt/coreutils/libexec/gnubin/gls ]]; then
  _LS_BIN=/usr/local/opt/coreutils/libexec/gnubin/gls
fi

typeset -g _LS_GROUP_DIRS=()
if [[ "$_LS_BIN" != ls ]] && "$_LS_BIN" --group-directories-first / >/dev/null 2>&1; then
  _LS_GROUP_DIRS=(--group-directories-first)
fi

# Drop stale la/ll functions or aliases before redefining.
unalias ls la ll 2>/dev/null
unfunction la ll 2>/dev/null

# ls: visible only | la: include dotfiles | ll: long + dotfiles
# Dirs first via gls --group-directories-first; no custom reordering.
if [[ "$_LS_BIN" != ls ]]; then
  alias ls="${_LS_BIN} --color=auto -CF ${_LS_GROUP_DIRS[*]}"
  alias la="${_LS_BIN} --color=auto -ACF ${_LS_GROUP_DIRS[*]}"
  alias ll="${_LS_BIN} --color=auto -AlhF ${_LS_GROUP_DIRS[*]}"
else
  alias ls='ls -GCF'
  alias la='ls -GACF'
  alias ll='ls -GAhlF'
fi

[[ -z "$LS_COLORS" ]] || zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
