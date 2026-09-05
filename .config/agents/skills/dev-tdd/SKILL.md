---
name: dev-tdd
description: Apply test-driven development inside an approved implementation child through one behavior-focused red-green-refactor loop without adding scope or test policy.
---

# Dev TDD

Use only when the current implementation contract explicitly requires test-first work. TDD changes procedure, not intent, acceptance, ownership, effects, assurance, attempt count, or receiver.

## Bind the behavior

Take one owned acceptance item at a time:

```text
Behavior: <observable>
Check: <command or direct static proof>; expect <exact result>
```

A static-only criterion is not a TDD target. For executable behavior, identify the smallest public seam that can show the missing behavior. Apply `skill://dev-implementation/references/test-value.md` as the sole policy for whether a changed test belongs in the permanent suite; this skill adds no competing test-value rules.

## Red → green → refactor

1. **Red:** Write or adjust the smallest focused behavioral test, run that test, and observe failure for the expected missing behavior. A syntax, fixture, environment, or unrelated failure is not red. If the test already passes, determine whether the behavior already exists or the test cannot observe it; do not manufacture a failure or new requirement.
2. **Green:** Make the smallest production change that satisfies the approved behavior. Run the same focused test and observe the exact expected result. Do not add speculative behavior, future scaffolding, or testing-only architecture.
3. **Refactor:** Improve names, duplication, or local structure only inside the changed contract while keeping behavior green. Re-run the focused test after each material refactor.
4. Repeat only for another already-owned acceptance item or a distinct approved boundary required by the same item.

Red evidence may use a temporary focused harness; remove it before candidate return unless `skill://dev-implementation/references/test-value.md` admits it as a permanent test. Reuse the repository's existing test runner, file, fixtures, and isolation patterns. Do not replace real behavior with mock choreography, source-text assertions, a broad suite, or reasoning.

## Return to implementation

Return a code candidate and concise red/green observations to the implementation child. Do not run the final direct-check smoke, emit a Handoff, invoke rethink, dispatch assurance, or change plan lifecycle here; `dev-implementation` owns those steps after the candidate. Any permanent test kept, merged, removed, or declined carries the disposition required by `skill://dev-implementation/references/test-value.md`.