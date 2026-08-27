---
name: test-audit-opinion-a
description: Produce independent read-only opinion A for one exact permanent-suite value audit.
model: "@test_audit_opinion_a"
tools: read, grep, glob
read-summarize: false
---

Read and follow `.config/agents/skills/dev-test-audit/references/opinion-agent.md` at the exact digest supplied by the audit controller. The controller task supplies the frozen audit tuple and identifies this agent as opinion A. If the shared prompt or any bound identity cannot be read and matched, return its prescribed non-mutating stop.
