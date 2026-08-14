---
description: Interrupt Bash only before Git commands that can change repository, index, worktree, configuration, or remote state.
condition:
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+(?:checkout|cherry-pick|clone|commit|gc|init|merge|mv|pack-refs|pull|rebase|repack|reset|restore|revert|switch|update-index|update-ref)\\b"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+(?:add|clean|fetch|prune|push|rm)\\b(?![^\\n;&|]*[ \\t](?:-n|--dry-run)\\b)"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+apply\\b(?![^\\n;&|]*[ \\t](?:--check|--stat|--numstat|--summary)\\b)"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+am\\b(?![^\\n;&|]*[ \\t]--show-current-patch\\b)"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+branch[ \\t]+(?:(?:-[dDmMcC]|--(?:delete|move|copy|edit-description|set-upstream-to|unset-upstream))\\b|[^\\s;&|/-][^\\s;&|]*)"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+tag[ \\t]+(?:(?:-[adfsu]|--(?:annotate|delete|force|sign|local-user))\\b|[^\\s;&|/-][^\\s;&|]*)"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+config(?:[ \\t]+(?:--(?:global|system|local|worktree)|--file(?:=\\S+|[ \\t]+\\S+)))*[ \\t]+(?:(?:set|unset|rename-section|remove-section)\\b|--(?:add|replace-all|unset(?:-all)?|remove-section|rename-section)\\b|[^-\\s]\\S*[ \\t]+\\S+)"
  - "\\bgit(?:[ \\t]+(?:(?:-C|-c|--git-dir|--work-tree|--namespace)[ \\t]+\\S+|--(?:git-dir|work-tree|namespace)=\\S+|--(?:bare|no-pager)))*[ \\t]+(?:bisect[ \\t]+(?:start|good|bad|new|old|skip|reset|run)|maintenance[ \\t]+(?:register|run|start|stop|unregister)|notes[ \\t]+(?:add|append|copy|edit|merge|prune|remove)|reflog[ \\t]+(?:delete|expire)|remote[ \\t]+(?:add|remove|rename|set-head|set-branches|set-url|prune|update)|sparse-checkout[ \\t]+(?:add|disable|init|reapply|set)|stash(?:[ \\t]+(?:push|pop|apply|drop|clear|store|create)\\b|(?=[ \\t]*(?:$|[;&|])))|submodule[ \\t]+(?:add|deinit|init|set-branch|set-url|sync|update)|worktree[ \\t]+(?:add|lock|move|prune|remove|repair|unlock))\\b"
scope:
  - "tool:bash"
interruptMode: "tool-only"
---

# Git state-change gate

Before retrying the matched command:

1. Read and apply `rule://git`.
2. Apply any repository-specific Git rule and staging helper.
3. Confirm that the command, intended paths, and ref targets are authorized.

Read-only inspection is outside this interrupt. Do not broaden it to `git status`, `git diff`, `git log`, `git show`, or `git rev-parse`.
