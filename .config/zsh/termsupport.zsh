# Terminal tab titles and cwd reporting (ported from OMZ lib/termsupport.zsh)

zmodload zsh/langinfo

function _urlencode() {
  emulate -L zsh
  setopt norematchpcre

  local -a opts
  zparseopts -D -E -a opts r m P

  local in_str="$@"
  local spaces_as_plus
  if [[ -z $opts[(r)-P] ]]; then spaces_as_plus=1; fi
  local str="$in_str"

  local encoding=$langinfo[CODESET]
  local safe_encodings
  safe_encodings=(UTF-8 utf8 US-ASCII)
  if [[ -z ${safe_encodings[(r)$encoding]} ]]; then
    str=$(echo -E "$str" | iconv -f $encoding -t UTF-8)
    if [[ $? != 0 ]]; then
      echo "Error converting string from $encoding to UTF-8" >&2
      return 1
    fi
  fi

  local i byte ord LC_ALL=C
  export LC_ALL
  local reserved=';/?:@&=+$,'
  local mark='_.!~*''()-'
  local dont_escape="[A-Za-z0-9"
  if [[ -z $opts[(r)-r] ]]; then
    dont_escape+=$reserved
  fi
  if [[ -z $opts[(r)-m] ]]; then
    dont_escape+=$mark
  fi
  dont_escape+="]"

  local url_str=""
  for (( i = 1; i <= ${#str}; ++i )); do
    byte="$str[i]"
    if [[ "$byte" =~ "$dont_escape" ]]; then
      url_str+="$byte"
    else
      if [[ "$byte" == " " && -n $spaces_as_plus ]]; then
        url_str+="+"
      elif [[ "$PREFIX" = *com.termux* ]]; then
        url_str+="$byte"
      else
        ord=$(( [##16] #byte ))
        url_str+="%$ord"
      fi
    fi
  done
  echo -E "$url_str"
}

function title {
  setopt localoptions nopromptsubst

  [[ -n "${INSIDE_EMACS:-}" && "$INSIDE_EMACS" != vterm ]] && return

  : ${2=$1}

  case "$TERM" in
    cygwin|xterm*|putty*|rxvt*|konsole*|ansi|mlterm*|alacritty*|st*|foot*|contour*|wezterm*)
      print -Pn "\e]2;${2:q}\a"
      print -Pn "\e]1;${1:q}\a"
      ;;
    screen*|tmux*)
      print -Pn "\ek${1:q}\e\\"
      ;;
    *)
      if [[ "$TERM_PROGRAM" == "iTerm.app" ]]; then
        print -Pn "\e]2;${2:q}\a"
        print -Pn "\e]1;${1:q}\a"
      elif (( ${+terminfo[fsl]} && ${+terminfo[tsl]} )); then
        print -Pn "${terminfo[tsl]}$1${terminfo[fsl]}"
      fi
      ;;
  esac
}

ZSH_THEME_TERM_TAB_TITLE_IDLE="%15<..<%~%<<"
ZSH_THEME_TERM_TITLE_IDLE="%n@%m:%~"
if [[ "$TERM_PROGRAM" == Apple_Terminal ]]; then
  ZSH_THEME_TERM_TITLE_IDLE="%n@%m"
fi

function termsupport_precmd {
  [[ "${DISABLE_AUTO_TITLE:-}" != true ]] || return 0
  title "$ZSH_THEME_TERM_TAB_TITLE_IDLE" "$ZSH_THEME_TERM_TITLE_IDLE"
}

function termsupport_preexec {
  [[ "${DISABLE_AUTO_TITLE:-}" != true ]] || return 0

  emulate -L zsh
  setopt extended_glob

  local -a cmdargs
  cmdargs=("${(z)2}")
  if [[ "${cmdargs[1]}" = fg ]]; then
    local job_id jobspec="${cmdargs[2]#%}"
    case "$jobspec" in
      <->) job_id=${jobspec} ;;
      ""|%|+) job_id=${(k)jobstates[(r)*:+:*]} ;;
      -) job_id=${(k)jobstates[(r)*:-:*]} ;;
      [?]*) job_id=${(k)jobtexts[(r)*${(Q)jobspec}*]} ;;
      *) job_id=${(k)jobtexts[(r)${(Q)jobspec}*]} ;;
    esac

    if [[ -n "${jobtexts[$job_id]}" ]]; then
      1="${jobtexts[$job_id]}"
      2="${jobtexts[$job_id]}"
    fi
  fi

  local CMD="${1[(wr)^(*=*|sudo|ssh|mosh|rake|-*)]:gs/%/%%}"
  local LINE="${2:gs/%/%%}"

  title "$CMD" "%100>...>${LINE}%<<"
}

autoload -Uz add-zsh-hook

if [[ -z "$INSIDE_EMACS" || "$INSIDE_EMACS" = vterm ]]; then
  add-zsh-hook precmd termsupport_precmd
  add-zsh-hook preexec termsupport_preexec
fi

if [[ -n "$INSIDE_EMACS" || -n "$SSH_CLIENT" || -n "$SSH_TTY" ]]; then
  return
fi

case "$TERM" in
  xterm*|putty*|rxvt*|konsole*|mlterm*|alacritty*|screen*|tmux*) ;;
  contour*|foot*) ;;
  *)
    case "$TERM_PROGRAM" in
      Apple_Terminal|iTerm.app) ;;
      *) return ;;
    esac ;;
esac

function termsupport_cwd {
  setopt localoptions unset
  local URL_HOST URL_PATH
  URL_HOST="$(_urlencode -P $HOST)" || return 1
  URL_PATH="$(_urlencode -P $PWD)" || return 1

  [[ -z "$KONSOLE_PROFILE_NAME" && -z "$KONSOLE_DBUS_SESSION" ]] || URL_HOST=""

  printf "\e]7;file://%s%s\e\\" "${URL_HOST}" "${URL_PATH}"
}

add-zsh-hook precmd termsupport_cwd
