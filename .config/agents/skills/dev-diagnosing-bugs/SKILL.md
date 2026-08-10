---
name: dev-diagnosing-bugs
description: Diagnose hard bugs and performance regressions. Use when the user explicitly asks to diagnose/debug, or reports an unexplained reproducible failure, exception, regression, or slowdown that needs investigation. Skip feature work, routine failures encountered during implementation, generic quality audits, and fixes whose cause and scope are already established.
---

# Diagnosing Bugs

A bounded diagnostic discipline for hard unexplained defects. One invocation establishes the loop and returns evidence; it never mutates production behavior.

When exploring the codebase, read `CONTEXT.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Intake and single-entry gate

Accept only a hard unexplained bug or performance regression with settled expected behavior or threshold, current product/engineering authority, and a stable observed reproduction whose symptom matches that authority. Reject feature work, generic quality or security audits, routine implementation/smoke/verification/review failures, and defects whose cause and bounded change surface are already known; those return directly to `dev-implementation` for owner repair under its current budget.

Bind a defect identity from the expected-behavior authority, symptom, target, and environment before creating a feedback-loop artifact, instrumenting, or changing diagnostic state. One bounded invocation owns that defect's reproduction, hypotheses, and probes. The same defect cannot re-enter diagnosis on an unchanged hypothesis set and evidence frontier; return `no-progress-stop` with the prior identities instead. Materially expanded product, architecture, scope, acceptance, or effect authority returns to its canonical owner and cannot be decided here. If expected behavior is missing, return to `dev-requirements`; if product intent is ambiguous, return to product authority; if the observed reproduction is not stable enough to establish the discrepancy, return a blocker naming the exact missing evidence and resume condition.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal for the bug — one that goes red on _this_ bug — you will find the cause; bisection, hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one — try them in roughly this order

1. **Failing test** at whatever seam reaches the bug — unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, drive _them_ with `scripts/hitl-loop.template.sh` so the loop is still structured. Captured output feeds back to you.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is tight — a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not — keep raising the rate until it's debuggable.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

### Completion criterion — a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** — a script path, a test invocation, a curl — that you have **already run at least once** (paste the invocation and its output), and that is:

- [ ] **Red-capable** — it drives the actual bug code path and asserts the **user's exact symptom**, so it can go red on this bug and green once fixed. Not "runs without erroring" — it must be able to _catch this specific bug_.
- [ ] **Deterministic** — same verdict every run (flaky bugs: a pinned, high reproduction rate, per above).
- [ ] **Fast** — seconds, not minutes.
- [ ] **Agent-runnable** — you can run it unattended; a human in the loop only via `scripts/hitl-loop.template.sh`.

If you catch yourself reading code to build a theory before this command exists, **stop — jumping straight to a hypothesis is the exact failure this skill prevents.** No red-capable command, no Phase 2.

## Phase 2 — Reproduce + minimise

Run the loop. Watch it go red — the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described — not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut — keep only what's load-bearing for the failure.

Why bother: a minimal repro shrinks the hypothesis space in Phase 3 and gives the later implementation worker precise regression-test input without authorizing a test or fix here.

Done when **every remaining element is load-bearing** — removing any one of them makes the loop go green.

Do not proceed until you have reproduced **and** minimised.

## Phase 3 — Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe — discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it — proceed with your ranking if the user is AFK.

## Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Performance path.** For performance regressions, establish a like-for-like baseline measurement, then test one falsifiable cause at a time. Return the baseline, probe evidence, and bounded fix hypothesis; implementation owns any production change.

## Phase 5 — Return bounded diagnosis evidence

Stop before writing a regression test or applying a production fix. This single invocation establishes one red-capable minimized loop, 3–5 ranked falsifiable hypotheses, their one-variable probes, and bounded cause evidence; `dev-implementation` alone issues mutation authority to a worker.

First remove or discard every disposable diagnostic effect and prove the inspected production target still has its original identity. If safe restoration or target identity is uncertain, return an evidence-backed blocker. Diagnostic evidence may be retained only at an authorized non-production destination.

Return exactly one outcome:

### Fix contract

- Exact expected behavior and governing authority
- Original and minimized reproduction, reproduction rate, and feedback-loop command/scenario
- Ranked hypotheses, probes, and the established cause
- Bounded change surface and predicted correction without implementing it
- Correct regression-test seam, or explicit evidence that no correct seam exists
- Acceptance and verification scenarios, including the original unminimized reproduction
- Security, data, migration, performance, or rollback risks
- Exact target and evidence identities
- Next owner: `dev-implementation`, with the same defect identity and current inherited budget

### Blocker

State the missing environment, permission, stable reproduction, evidence, or safe diagnostic capability; what was tried; preserved target identity; unchanged or changed hypothesis/evidence frontier; smallest human prerequisite; and exact resume condition. A blocker cannot authorize another diagnosis invocation.

### Architecture finding

When no correct test seam or safe bounded fix surface exists, return the exact coupling/seam evidence to the current architecture authority owner. Do not propose or apply an architecture change, dispatch a survey, or expand the approved route here.

Use the common `dev-handoff` shape and return to exactly one Task-Contract-eligible receiver. Include every observed check, all hypothesis/probe results, the defect identity, diagnosis-entry consumption, and uncertainty. Do not declare the bug fixed, write a regression test, change production code, create a commit, ship, perform independent verification, or restart the lifecycle.
