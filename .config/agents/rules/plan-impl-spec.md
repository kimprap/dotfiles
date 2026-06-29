---
description: Implementation-grade companion to plan.md. Use when creating or refining a durable plan for code, agent-harness, architecture, debugging, TDD, prototype-to-production, or other execution work where a fresh executor must make zero material decisions.
---

# Implementation Plan Companion

Read .config/agents/rules/plan.md first; this rule only adds implementation-grade body requirements.

## When to apply this rule
- Apply it when an engineering skill is producing or reshaping a durable implementation plan.
- Do not apply it just because an engineering skill is invoked for direct execution. Examples: direct `eng-tdd` work that writes tests now, direct `eng-diagnosing-bugs` repro construction, or an exploratory `eng-prototype` can skip it unless the result is being converted into a plan.
- Apply it for handoff-critical plans, architecture refactor plans, TDD feature plans, debugging fix plans, prototype-to-production plans, and agent-harness changes involving skills/rules/agents/vaults where a fresh executor should not invent decisions.

## Execution intent
State the exact end state and what must be true when the work is done.

## Ordered implementation
Map the implementation steps directly onto the `T1`, `T2`, ... task codes in the plan file. Each step must be specific enough that a fresh executor does not invent sequencing or behavior.

## Critical anchors
List the files, symbols, rule names, skill names, vault paths, or external docs that disambiguate the work.

## Skill outcomes to capture
Record the decisions/results produced by `eng-tdd`, `eng-diagnosing-bugs`, `eng-codebase-design`, `eng-prototype`, `eng-improve-codebase-architecture`, `grilling`, or `domain-modeling`. Do not restate those skills' full procedures.

## Verification
Give at least one check that exercises the new behavior, not just metadata parsing.

## Assumptions and fallbacks
Record pre-decided fallbacks only. Leave no open choices for the implementer.
