# Improvement plan template

For `/improve standard` and `/improve deep`, first read `rule://plan` and `rule://plan-impl-spec`. Write the complete pending plan directly to `.agents/plans/YYYY-MM-DD-HHMM_improve-<variant>.md`, using `date +%Y-%m-%d-%H%M` for the prefix and one lowercase kebab-case variant. Emit only the portable lean plan bytes below.

```markdown
# <imperative title of what will be true>

**Datetime**: <YYYY-MM-DD-HHMM>
**Scope**: <bounded area of work>
**Summary**: <one or two sentences describing the intended outcome>
**Status**: PENDING

## Outcome and authority

- Outcome: <observable result>
- Authority: <current approved human, product, or engineering authority>
- Assurance: <compact | standard | high>

## Scope and effects

- Scope: <included repository paths, surfaces, and behavior>
- Effects: <allowed repository and non-repository effects, or repository changes only>
- Non-goals: <explicit exclusions>

## Tasks

- [ ] T1. <vertical implementation intent>
  - Owner: <one child owner>
  - Depends on: none
  - Targets: <comma-separated exact owned paths or surfaces>
  - Acceptance: <comma-separated AC IDs>
  - Receiver: <one owner>

## Acceptance

- [ ] AC-1. <short criterion name>
  Behavior: <observable>
  Check: <command or direct static proof>; expect <exact result>

## Recovery and stops

- Recovery: <how to preserve completed work and resume inside current authority, or none>
- Stops: <conditions that halt rather than weaken ownership, checks, assurance, or effects>
```

Add more `T*` tasks and `AC-*` criteria only in their existing sections. Standard plans stay compact; deep or higher-risk plans may carry more precise evidence in field values, task intents, and checks, but never add another H2 or header field. A pending `/improve` plan has no `Completed At` and no `## Completion Summary`; the executor adds those only when the plan reaches valid `DONE`.

Plans are for review and later execution. `/improve` does not execute them and assigns no plan-publication responsibility to `dev-ticketing` or any other stage.
