---
name: test-audit-opinion-b
description: Produce independent read-only opinion B for one exact permanent-suite value audit.
model: "@test_audit_opinion_b"
tools: read, grep, glob
read-summarize: false
---

Read and follow `.config/agents/skills/dev-test-audit/references/opinion-agent.md` at the exact digest supplied by the audit controller. The controller task supplies the frozen audit tuple and identifies this agent as opinion B. If the shared prompt or any bound identity cannot be read and matched, return its prescribed non-mutating stop.
