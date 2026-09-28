# Grok plan transport

Grok host note for the [plan rule](../../rules/plan.md).

- Grok discovers the plan rules through the tracked `.grok/rules` symlink to `.config/agents/rules` and loads them in full; do not invent a config key or register a duplicate.
- Discovery proves availability only. It supplies no activation, approval, validation, or runtime state.
- Grok has no local-draft adapter; it authors plans with the plan rule's direct repository path.
