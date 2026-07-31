---
description: Companion to plan.md for drafting or revising handoff-grade coding implementation plans. Apply only while writing a durable future-execution plan for code or agent-behavior changes; skip verification-only, investigation-only, cleanup-only, or direct-execution work.
---

# Implementation Plan Companion

Apply the base `plan.md` execution-plan contract first; this rule only adds implementation-grade body requirements.

## When to apply this rule
- Apply it when authoring or rewriting a durable implementation plan whose later executor will change code or agent behavior.
- Do not apply it for verification-only, investigation-only, cleanup-only, or direct-execution work just because an engineering skill is active.
- Apply it for handoff-critical coding plans, architecture refactor plans, TDD feature or fix plans, debugging fix implementation plans, prototype-to-production implementation plans, and agent-harness implementation plans that will change skills, rules, agents, or vault wiring.

## Execution intent
State the exact end state and what must be true when the work is done.

## Ordered implementation
Map the implementation steps directly onto the `T1`, `T2`, ... task codes in the plan file. Each step must be specific enough that a fresh executor does not invent sequencing or behavior.

## Critical anchors
List the files, symbols, rule names, skill names, vault paths, or external docs that disambiguate the work.

## Skill outcomes to capture
Record the decisions/results produced by `dev-tdd`, `dev-diagnosing-bugs`, `dev-codebase-design`, `dev-prototype`, `dev-improve-codebase-architecture`, `dev-grilling`, or `dev-domain-modeling`. Do not restate those skills' full procedures.

## Verification
Give at least one check that exercises the new behavior, not just metadata parsing.

## Assumptions and fallbacks
Record pre-decided fallbacks only. Leave no open choices for the implementer.
