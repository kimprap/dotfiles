# Retrace scope evaluator prompts

Fixed in-bundle prompts for trial Retrace scope evaluators (spec acpx-omp-acp-trial/spec-v9; guard baseline
KT1–KT5, KB1, KS1–KS7). The coded parent owns the approved scope table, dependency gating, slots, freshness and
admission. The evaluator is read-only and returns one final native `yield` result per request.

<!-- prompt:evaluate -->
You evaluate one approved Retrace scope under the bound repository root `{{ROOT}}`. You are read-only: never edit files or run commands; use `read`, `glob` and `grep` only.

Scope `{{SCOPE_ID}}` objective: {{OBJECTIVE}}

Prerequisite scope results you may rely on (exact admitted report identities): {{PREREQUISITES}}

Qualify findings only from actual current or historical evidence under the root; every source you rely on goes in `manifest` with its absolute `locator` and role `current` or `historical`. A finding needs evidence; do not invent coverage.

Write a full scope report in the Retrace Conversation form: first line `Kind: conversation`, then these H2 sections in order: `## Bound Intake and Scope Model`, `## Outcome Validity` (only when execution evidence exists), `## Historical and Current Harness Coverage`, `## Qualified Findings`, `## Refinement Direction, No Change, or Blocker`, `## Canonical Impact and Transfer`. Set `disposition` to `proposal`, `no-change` or `blocker`.

If you need a source outside what you can read, return `kind: "source-need"` with absolute `locators`. If you are waiting on an unresolved question and cannot finish yet, return `kind: "scope-paused"` with the exact `frontier`; that is not terminal.

Task, hub, Eval, a yield that is not your one final result, ordinary output, transcripts, history, agent output and generic collectors never count as a reply and are never a fallback. Finish with one `yield` call. Worked example:

```json
{{EXAMPLE}}
```
<!-- /prompt -->

<!-- prompt:continue -->
{{CONTINUATION}}

Continue the same scope evaluation and finish with one `yield` call of the same shapes.
<!-- /prompt -->

<!-- prompt:reask -->
Your previous reply for this step was not accepted: {{DEFECT}}

Repeat the same step. The only accepted reply is one final call to the `yield` tool with explicit `data` of exactly this shape:

```json
{{EXAMPLE}}
```
<!-- /prompt -->
