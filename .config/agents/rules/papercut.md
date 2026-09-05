---
description: Schedule one papercut look after every completed repository-work boundary.
alwaysApply: true
---

# Papercut scheduling

After every completed repository-work boundary, load `skill://papercut` exactly once. For workflow work, the same child loads it after emitting its completed lean Handoff; the parent falls back only when that child is unavailable. For direct non-workflow implementation, the direct owner loads it after verification and before completion.

This rule decides only timing and ownership. Papercut owns discovery, qualification, redaction, consolidation, persistence, exclusions, and the compact result. Do not prequalify candidates or cap results here. Retain results in authored-task order for completion.

A workflow boundary is complete when its final lean Handoff is emitted, including a Handoff that preserves repository work and reports a blocker. Read-only work and work abandoned before a repository-work Handoff do not create a boundary. The look changes no task state and is never a task, Methods token, stage, todo phase, assurance event, code/test review, or learning trigger.
