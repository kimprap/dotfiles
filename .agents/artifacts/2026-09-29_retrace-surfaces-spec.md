# Retrace surfaces in the Reconcile concept — technical specification

**Revision:** `retrace-surfaces/spec-v2`
**Date:** 2026-09-29
**Assurance:** standard
**Baseline:** `HEAD` `31cb615` (clean tree; includes batch-6 commits `363e59d`, `339e181`, `0a401e0`)

## 1. Authority and settled decisions

Authority, in precedence order:

1. Human settlement `/tmp/reconcile-7.DFqywT/settlement.md` (human reply, verbatim: "approve - drop the r1-3 runs requirements. this is not needed."). It overrides the proposal where they conflict.
2. Reconcile-reviewed proposal `/tmp/reconcile-7.DFqywT/final-proposal-rendered.md` (Reconcile VALID on `sha256:2778ee73262af52409f8021ee87b191707d9012bf420ddaef54aecca67d3b709`).
3. Reconcile reviewer recommendation (binding here): pin the exact new `## Result` item-5 wording (§4.3 C1) and the renderer's prose fallback (§4.4 R3–R4).

Settled decisions:

- **D1** B1, the record-level change: the controller renderer and the evaluator summary rule change. B2 (a model-authored digest) is rejected.
- **D2** Reviewed reports stay verbatim and move last, into a trailing `### Reviewed reports`.
- **D3** Manifest entries keep full absolute locators and full hashes; only the line format may change. The baseline line is already `- {locator} ({role}) {identity}` (§2.3), so the manifest line needs no change.
- **D4** The `## Result` item-5 summary rule is the one accepted rendered-prompt diff.
- **D5 (amended by the human)** No omp-update live runs R1, R2 or R3 are required, before or after commit. The work closes on offline proof. Agents make no commits, pushes, staging, checkouts or live runs; a commit needs a separate explicit shipping request. The throwaway offline render of an R3-like request (S5, a scripted agent, no model) is an offline check, not a live run.
- **D6** Part A adds labelled context lines around the unchanged table; step 4 of `## Normalize and approve` is not edited.

Goal (proposal): Retrace's pre-execution approval surface and post-execution record read like Reconcile's: labelled brief before, compact bulleted outcomes after, verbose material last.

Out of scope (proposal): Reconcile presentation and record; `reviewer-protocol.md`; `agent-return.md`; `retrace/evals` content; the omp-update `controller-exit` probe line; shrinking the reviewed reports themselves.

## 2. Verified current system (baseline `31cb615`)

Paths below are under `.config/agents/`. Every line reference was read with `git show 31cb615:<path>`.

### 2.1 Prompt loading (`harnesses/omp/acp-controller/lib/prompts.mjs`, 144 lines)

- `PROMPT_SOURCES` (L19–22) names `skills/reconcile/references/reviewer-protocol.md` and `skills/retrace/SKILL.md`; `REQUIRED_MARKERS` (L23–26) are reviewer `initial, rethink, later, source, reask, dispute` and scope `evaluate, continue, reask, normalize`.
- `extractMarkers` (L55–71): a template body runs from its `<!-- prompt:NAME -->` marker to the next marker or the next heading outside a fence.
- `headingSection` (L74–84): `{{SECTION:Name}}` pulls the unique heading's body up to the next heading of the same or higher level, blank-trimmed.
- `loadPrompts({reviewerProtocolPath, retraceSkillPath})` (L119–129) is the override seam S1 uses.
- The Retrace templates pull `Finding eligibility`, `Evidence boundary`, `Method`, `Readiness`, `Result` (all in `evaluate`, `SKILL.md` L452–460) and `Normalize and approve` (in `normalize`, L509). So `## Result` reaches only `scope.evaluate`; `## Invocation contract` and `## Freshness and aggregate` reach no prompt. Verified by S1: at baseline `S1 none` prints `ok`; on the simulated target only `scope.evaluate` differs, and exactly by C1 (§6).

### 2.2 `skills/retrace/SKILL.md` (515 lines)

- `## Invocation contract` L16; L45 is the sentence "After approval, invoke the controller, handle its exit codes, and bind its models as the "Retrace" section of [the driver](…) says." (A2 anchor).
- `## Normalize and approve` L74; step 4 at L79 begins "4. Present only the complete two-column `Scope | Evaluate` table for approval …" and owns the table, re-presentation, the `roles` check and "show its `Models:` list stdout verbatim directly after the table". Unchanged (D6).
- `## Result` L359; items 1–6 at L367–372. Item 5 (L371) holds the summary rule quoted in §4.3 C1 (old). L374: "Keep the direction coherent across sections. Do not emit a native handoff."
- `## Freshness and aggregate` L376; intro L384 ("Emit exactly these four H2 aggregate sections in order … Use H3 headings for individual scope displays and short bold labels within them."); item 3 L388 (`## Findings and Directions`), item 4 L389 (`## Evidence and Limits`), both quoted in §4.3 C2/C3 (old).
- `## Scope evaluator prompts` L419; markers `evaluate` L429, `continue` L474, `reask` L483, `normalize` L492.

### 2.3 Retrace record renderer (`harnesses/omp/acp-controller/controller.mjs`, 1257 lines)

- `fenced(text)` L1138–1141 wraps text in a collision-safe fence from `fenceFor` (L57), info string `text`.
- `aggregateSummary(report)` L1143–1164 (doc comment from L1143): finds the first line matching `^\*\*Aggregate summary(?::\*\*|\*\*:?)\s*(.*)$`, takes inline text as the first entry, reads until a heading or a bold-label line, drops blanks, and turns each line into a `- ` list line (nested `   - ` items kept).
- `renderRetrace` L1166–1201 emits, in order: `## Result` (Aggregate bullets), `## Scope Results` (table `Scope | Disposition | Outer rounds | Report updates | VALID by round`, then one H3 per scope with `**Review status**`, `**Evidence freshness**`, optional `**Frontier**`), `## Findings and Directions` (L1184–1190: per scope with a report, H3 plus `**Finding and direction**` and the summary list or "- the reviewed report carries no scope-authored Aggregate summary; its complete text is under Evidence and Limits"; if no scope has a report, `**Findings**` / "- no reviewed report exists"), `## Evidence and Limits` (L1191–1199: `**Approved table**`, `**Approval**`, then per scope H3 with `**Events**` one bullet per event (L1195), `**Manifest**` `- {locator} ({role}) {observed}` (L1196, `observed` is `sha256:<hex>`, `absent` or `unreadable (<code>)`, set at L983), `**Provisional-to-final**` (L1197) and `**Reviewed report**` fenced (L1198)).
- L1203 is the `// ---…--- normalizer` divider; `runNormalize` follows. `## Spend` is appended by the caller after the record.

### 2.4 Renderer tests (`harnesses/omp/acp-controller/test/retrace.test.mjs`, 316 lines)

- `candidate(id, report)` L58: default report `Kind: conversation\n\n**Aggregate summary**\n\n- ${id} holds`.
- `scopeEvents` L123–128 reads the per-scope `**Events**` bullet list; used by KT4 (L130–170) and KS6 (L259–284), which pin `- event` bullets.
- KS5 (L187–257) pins the Findings section of an inline-form summary (L236–251) — the old record shape.
- Other files (`preflight.test.mjs`, `reconcile.test.mjs`, `fixtures/scripted-acp-agent.mjs`) do not read the Retrace record.

### 2.5 `harnesses/omp/acp-controller/driver.md` (147 lines)

- `## Reconcile` L1–97 (subsections L3, L24, L36, L72). Its L64 has its own stdout sentence; untouched.
- `## Retrace` L99; `### Invoke the controller` L101. L129–132: "Except for a successful / `roles` call, stdout carries only the rendered record followed by `## Spend`; / stderr carries diagnostics. Present stdout / verbatim." (C4 anchor at L130). The driver has no approval-surface text today.

### 2.6 Other verified facts

- Reconcile's brief (`skills/reconcile/SKILL.md` L127–151) is a `## Reconcile brief` heading, bold labels each followed by `- ` children, then a reply line; `references/packed-label.md` allows a table as a field's children. Part A mirrors that layout.
- `skills/omp-update/SKILL.md` step g (L55) hashes `driver.md` only as a before/after pair around live runs, with no stored value, so a driver edit does not break it. R3's pass condition (L135) requires the four H2s in order; unchanged by this work.
- `skills/retrace/evals/` holds only `evals.json` (21 model-graded evals). No runner exists in the repository (searched `bin/`, `.config/scripts/`, `skills/craft-skill/`). "Evals pass" therefore means: the content is unchanged (AC-8) and no assertion is contradicted by the new texts (§9). [INFERENCE: no mechanical runner exists.]
- Guard suites at baseline: `npm test` 51 pass `fail 0`; `cli.mjs roles` exit 0 (`Models:` then the A and B role lines); `test_executor_plan.py` 14 tests `OK`; extensions `bun test` 20 pass 0 fail; `test_papercut_ledger.py` 19 tests `OK`.

## 3. Architecture and ownership

One owner per rule:

| Rule | Sole owner | Change |
|---|---|---|
| Approval table, re-presentation, `roles` check, `Models:` placement | `retrace/SKILL.md` step 4 (L79) | none (D6) |
| Approval-surface layout (labelled lines around the table) | `driver.md` `## Retrace` › new `### Approval surface` | new (T1) |
| When the root reads that layout | `retrace/SKILL.md` `## Invocation contract` pointer | new sentence (T1) |
| Evaluator's Aggregate summary format | `retrace/SKILL.md` `## Result` item 5 | C1 (T3) |
| Record layout, as prose | `retrace/SKILL.md` `## Freshness and aggregate` items 3–4 | C2, C3 (T3) |
| Record layout, as bytes | `controller.mjs` `renderRetrace` and helpers | R1–R8 (T2) |
| What stdout holds | `driver.md` `### Invoke the controller` stdout sentence | C4 (T3), points to the skill's section |

Flow: the root session reads the skill, is pointed to the driver's approval layout, renders the labelled surface with step 4's table, binds the request as before (the labelled lines bind nothing new). The controller runs scope evaluators whose `evaluate` prompt carries the new item-5 rule, so reports carry labelled summaries; the renderer projects them into fixed bullets, falling back to authored prose when a summary is not in the fixed form.

Why the pointer sentence (A2): without it, the root session reads the driver only "after approval" (L45), so it would never see the layout before presenting the table. A2 sits in `## Invocation contract`, which no prompt pulls, so rendered prompts stay byte-identical after T1 (S1 `none`).

## 4. Exact changes

Texts in this section are normative and byte-exact; S2 embeds the same strings. A block's content is the text between its fence lines.

### 4.1 T1 — Part A

**A1** — insert into `driver.md` directly after the `## Retrace` heading line and its following blank line (baseline L100), before `### Invoke the controller`. The inserted bytes are exactly:

````text
### Approval surface

Render each table that step 4 of Retrace's "Normalize and approve" presents,
including a re-presented one, in this layout. Step 4 alone owns the table, its
approval and re-presentation rules, and the `roles` check with its `Models:`
list; this layout only adds labelled context lines before the table.

```markdown
## Retrace scope table

**Root**

- {bound absolute root}

**Objective**

- {each raw human objective, in authored order}

**Evidence**

- {each exact evidence locator} ({current | historical})

**Protected behavior**

- {each protected behavior}

**Exclusions**

- {each exclusion}

**Links**

- {each edge as `{ID} requires {ID}`, `{ID} shares evidence with {ID}`, or `{ID} may conflict with {ID}`}

**Scopes**

| Scope | Evaluate |
|---|---|
| {ID} {name} | {one observable objective} |
```

Give each item its own child line; an item bound to only some scopes starts
with their IDs and a colon. A field with no item has the one child `- none`.
The labelled lines add no binding: the request binds what step 4 names.
````

(the block ends with one blank line, so `### Invoke the controller` follows after exactly one blank line).

**A2** — insert into `retrace/SKILL.md` immediately before baseline L45 (the "After approval, invoke the controller…" line), as its own paragraph followed by one blank line:

````text
Render each table for approval in the layout under "Approval surface" in the "Retrace" section of [the driver](../../harnesses/omp/acp-controller/driver.md).
````

### 4.2 T2 — renderer and tests

See §4.4 for the record shape and §7 for tests. T2 edits only `controller.mjs` between the line starting `/**` of the `aggregateSummary` doc comment (baseline L1143) and the normalizer divider (baseline L1203, exclusive), and `test/retrace.test.mjs`.

### 4.3 T3 — prompt, skill prose, driver stdout

Each replacement's old text occurs exactly once at baseline.

**C1** — `retrace/SKILL.md` `## Result` item 5 (L371). The only accepted rendered-prompt diff (D4). Old:

````text
Include a short **Aggregate summary** authored by the scope: the applicable finding and consequence, direction, and required validation; for `no-change` or `blocker`, state the corresponding disposition and frontier instead. This summary remains inside the report reviewed by Reconcile.
````

New:

````text
Include a short **Aggregate summary** authored by the scope: put the bold label `**Aggregate summary**` on its own line, then give each distinct finding as four one-line bullets in this order: `- Identity: {objective class} · {owner} · {root-cause class} · {evaluand}` with its complete four-part identity, `- Finding: {finding and consequence}`, `- Direction: {direction}`, and `- Validation: {required validation}`. For `no-change` or `blocker`, Identity may be `none`, Finding states the corresponding disposition and frontier, and Direction and Validation are `none` when nothing applies. This summary remains inside the report reviewed by Reconcile.
````

**C2** — `retrace/SKILL.md` `## Freshness and aggregate` item 3 (L388), old:

````text
3. `## Findings and Directions` — materialize each distinct finding as one entry in this section whose complete four-part identity gives the `objective class`, `owner`, `root-cause class`, and `evaluand` with all four values together, followed by its concise finding and consequence, reviewed direction, and required validation.
````

New:

````text
3. `## Findings and Directions` — materialize each distinct finding as one entry in this section of one-line `Identity`, `Finding`, `Direction` and `Validation` bullets: its complete four-part identity gives the `objective class`, `owner`, `root-cause class`, and `evaluand` with all four values together, followed by its concise finding and consequence, reviewed direction, and required validation. Disposition stays in the Scope Results row and is not repeated. A scope-authored summary without those bullets is shown as authored, and no identity is invented for it.
````

The rest of the L388 line after this sentence ("A pointer to supporting detail, …") is unchanged.

**C3** — `retrace/SKILL.md` item 4 (L389), old sentence:

````text
4. `## Evidence and Limits` — retain the exact approved table and approval binding, complete immutable reviewed reports, finding identities and contributors, manifests, provisional-to-final changes, disagreements, and authoritative review evidence.
````

New (the old sentence plus one sentence):

````text
4. `## Evidence and Limits` — retain the exact approved table and approval binding, complete immutable reviewed reports, finding identities and contributors, manifests, provisional-to-final changes, disagreements, and authoritative review evidence. Show each scope's ordered events as one arrow-joined line and each manifest entry as `locator (role) identity`, and put the complete immutable reviewed reports last, under `### Reviewed reports`, one bold scope label per report.
````

**C4** — `driver.md` `### Invoke the controller` (L129–132; the match must lie after `## Retrace`). Old:

````text
`roles` call, stdout carries only the rendered record followed by `## Spend`;
stderr carries diagnostics. Present stdout
verbatim.
````

New:

````text
`roles` call, stdout carries only the rendered record, laid out as Retrace's
"Freshness and aggregate" section describes, followed by `## Spend`;
stderr carries diagnostics. Present stdout
verbatim.
````

No other byte of either file changes. In particular `## Normalize and approve`, `## Reconcile` in the driver, every other `## Result` item and every prompt marker stay byte-identical.

### 4.4 Record shape (T2)

Only `## Findings and Directions` and `## Evidence and Limits` change. `## Result`, `## Scope Results` (table and per-scope H3s), `**Approved table**`, `**Approval**`, `**Manifest**`, `**Provisional-to-final**` and `## Spend` are byte-identical to baseline.

- **R1 Summary block.** Unchanged locator: the first report line whose trimmed text matches `^\*\*Aggregate summary(?::\*\*|\*\*:?)\s*(.*)$`; inline text after the label is the block's first line; the block runs to the next heading line (`^#{1,6} `) or bold-label-only line; blank lines are dropped; lines are right-trimmed.
- **R2 Labelled form.** A block is labelled when every line matches `^- (?:\*\*(L):\*\*|\*\*(L)\*\*:|(L):)\s+(\S.*)$` with `L` one of `Identity|Finding|Direction|Validation`, and the lines group, in order, into one or more findings of an optional `Identity` followed by exactly `Finding`, `Direction`, `Validation`. Values are kept verbatim (full locators included).
- **R3 Labelled rendering.** Per scope H3, finding `N` (from 1) renders `**Finding N**`, a blank line, then `- Identity: v` (only when the scope authored an Identity line; none is invented), `- Finding: v`, `- Direction: v`, `- Validation: v`; one blank line between findings. Disposition is not repeated (it stays in the Scope Results row).
- **R4 Prose fallback.** When the block exists but is not labelled (any line breaks R2, including a wrong order or a missing field), the scope renders exactly as at baseline: `**Finding and direction**`, a blank line, and the baseline list conversion (each line becomes `- text`, a leading `- ` not doubled, indented `- ` items kept nested). No block at all renders the baseline no-summary line. A scope without a report is omitted; no report anywhere renders the baseline `**Findings**` / `- no reviewed report exists`.
- **R5 Events.** Per scope, `**Events**`, a blank line, then one line: `- ` followed by the events in order joined with ` → ` (U+2192 with one space each side), or `- none` when there are none.
- **R6 Manifest.** Unchanged: `- {locator} ({role}) {observed}`, full absolute locator and full `sha256:<64 hex>` (D3).
- **R7 Reviewed reports last.** No per-scope `**Reviewed report**`. After the last per-scope H3 of `## Evidence and Limits`, when at least one scope has a report: `### Reviewed reports`, then per such scope in graph order a blank line, `**{ID} {name}**`, a blank line, and the report in the baseline `fenced()` form (collision-safe fence, info `text`), byte-verbatim (D2).
- **R8** Nothing else in the record changes; the record still ends with one newline before `## Spend`.

Reference implementation (the simulated target that produced W1 and passes §7; the code form is free, the behavior R1–R8 is not). `renderRetrace` calls `findingLines(sc.report)` in the Findings loop and applies R5 and R7 in the Evidence loop:

```js
/**
 * The scope-authored **Aggregate summary** block of a report as its nonblank
 * lines, or null. Both `**Aggregate summary**` and `**Aggregate summary:** <text>`
 * open it; text on the label line is its first line. It ends at the next heading
 * or bold label.
 */
function summaryBlock(report) {
  const lines = report.split("\n");
  const label = /^\*\*Aggregate summary(?::\*\*|\*\*:?)\s*(.*)$/;
  const i = lines.findIndex((l) => label.test(l.trim()));
  if (i < 0) return null;
  const inline = label.exec(lines[i].trim())[1];
  const out = inline ? [inline] : [];
  for (const l of lines.slice(i + 1)) {
    if (/^#{1,6} /.test(l) || /^\*\*[^*]+\*\*$/.test(l.trim())) break;
    if (l.trim() !== "") out.push(l.trimEnd());
  }
  return out.length ? out : null;
}

/** Prose fallback: every block line as a Markdown list line, nested items kept nested. */
function proseLines(block) {
  return block.map((l) => (/^\s+- /.test(l) ? l : `- ${l.trim().replace(/^- /, "")}`));
}

const FIELD = /^- (?:\*\*(Identity|Finding|Direction|Validation):\*\*|\*\*(Identity|Finding|Direction|Validation)\*\*:|(Identity|Finding|Direction|Validation):)\s+(\S.*)$/;

/** Labelled findings `[{ identity?, finding, direction, validation }]`, or null when any line breaks the fixed bullet form. */
function labelledFindings(block) {
  const fields = [];
  for (const l of block) {
    const m = FIELD.exec(l);
    if (!m) return null;
    fields.push([m[1] ?? m[2] ?? m[3], m[4]]);
  }
  const groups = [];
  let i = 0;
  while (i < fields.length) {
    const g = {};
    if (fields[i][0] === "Identity") g.identity = fields[i++][1];
    for (const name of ["Finding", "Direction", "Validation"]) {
      if (fields[i]?.[0] !== name) return null;
      g[name.toLowerCase()] = fields[i++][1];
    }
    groups.push(g);
  }
  return groups.length ? groups : null;
}

/** The `## Findings and Directions` display of one reviewed report. */
function findingLines(report) {
  const block = summaryBlock(report);
  const groups = block && labelledFindings(block);
  if (!groups) return ["**Finding and direction**", "", ...(block ? proseLines(block) : ["- the reviewed report carries no scope-authored Aggregate summary; its complete text is under Evidence and Limits"])];
  return groups.flatMap((g, i) => [...(i ? [""] : []), `**Finding ${i + 1}**`, "", ...(g.identity !== undefined ? [`- Identity: ${g.identity}`] : []), `- Finding: ${g.finding}`, `- Direction: ${g.direction}`, `- Validation: ${g.validation}`]);
}
```

**Worked example W1.** An R3-like request (root with `lib/versions.mjs` and `cli.mjs`, objective from omp-update R3, four scopes: `s1` labelled `proposal` with two findings, `s2` inline prose `no-change` requiring `s1`, `s3` labelled `no-change` with `Identity: none`, `s4` labelled `blocker`), scripted evaluator and reviewers, real prompts. `{ROOT}` replaces the temporary root; `{REPORT}` replaces each report hash. It shows the labelled groups (s1), the `no-change` and `blocker` cases (s3, s4), the prose fallback (s2, which is also at depth 1 and so renders last), the arrow Events line, the unchanged manifest line and the trailing reviewed reports. S5 regenerates it and compares.

W1
````markdown
exit 1
## Result

**Aggregate**

- partial
- resolved scopes: 3 of 4
- dispositions: proposal 1, no-change 2, blocker 1
- evaluation only: no implementation was performed

## Scope Results

| Scope | Disposition | Outer rounds | Report updates | VALID by round |
|---|---|---|---|---|
| s1 Version check | proposal | 1 | 0 | 1: A |
| s3 Refusal exit | no-change | 1 | 0 | 1: A |
| s4 Installed SDK | blocker | 1 | 0 | 1: A |
| s2 Call order | no-change | 1 | 0 | 1: A |

### s1 Version check

**Review status**

- complete

**Evidence freshness**

- current

### s3 Refusal exit

**Review status**

- complete

**Evidence freshness**

- current

### s4 Installed SDK

**Review status**

- complete

**Evidence freshness**

- current

### s2 Call order

**Review status**

- complete

**Evidence freshness**

- current

## Findings and Directions

### s1 Version check

**Finding 1**

- Identity: pin-independent version-refusal coverage · acp-controller preflight owner · missing lock comparison · lib/versions.mjs
- Finding: {ROOT}/lib/versions.mjs compares the installed acpx version but not the locked one, so a lock drift passes preflight.
- Direction: compare the locked acpx version in checkVersions in {ROOT}/lib/versions.mjs.
- Validation: npm test with a drifted lock fixture refuses with exit 2.

**Finding 2**

- Identity: pin-independent version-refusal coverage · acp-controller preflight owner · missing SDK comparison · lib/versions.mjs
- Finding: {ROOT}/lib/versions.mjs never reads the ACP SDK version, so an SDK drift passes preflight.
- Direction: add the ACP SDK comparison to checkVersions in {ROOT}/lib/versions.mjs.
- Validation: npm test with a drifted SDK fixture refuses with exit 2.

### s3 Refusal exit

**Finding 1**

- Identity: none
- Finding: no-change: {ROOT}/cli.mjs refuses with exit 2 before any launch; frontier: none.
- Direction: none
- Validation: none

### s4 Installed SDK

**Finding 1**

- Identity: none
- Finding: blocker: no readable ACP SDK install is in the approved evidence; frontier: supply the installed SDK package manifest.
- Direction: none
- Validation: none

### s2 Call order

**Finding and direction**

- Scope s2 is `no-change`.
- {ROOT}/cli.mjs calls checkVersions before readModelRoles.

## Evidence and Limits

**Approved table**

| Scope | Evaluate |
|---|---|
| s1 Version check | checkVersions compares omp, acpx and ACP SDK versions to its own constants |
| s2 Call order | cli.mjs calls checkVersions before readModelRoles and any runtime |
| s3 Refusal exit | a version mismatch refuses with exit 2 before any launch |
| s4 Installed SDK | the installed ACP SDK version is readable |

**Approval**

- approve (2026-09-29T12:00:00Z)

### s1 Version check

**Events**

- evaluate → candidate-ready admitted → begin-reconcile → reviewers disposed → scope-result → scope-result admitted → evaluator disposed

**Manifest**

- {ROOT}/lib/versions.mjs (current) sha256:a2ad577c08685eb4c195b4672898ee1fb194da320974d7f7dc03b2ce1cf4e1b6

**Provisional-to-final**

- unchanged sha256:{REPORT}

### s3 Refusal exit

**Events**

- evaluate → candidate-ready admitted → begin-reconcile → reviewers disposed → scope-result → scope-result admitted → evaluator disposed

**Manifest**

- {ROOT}/cli.mjs (current) sha256:700a54e61d3cc8a5336fb0d812e847189ae35b4072f17c25f8276c8ad2cff0a1

**Provisional-to-final**

- unchanged sha256:{REPORT}

### s4 Installed SDK

**Events**

- evaluate → candidate-ready admitted → begin-reconcile → reviewers disposed → scope-result → scope-result admitted → evaluator disposed

**Manifest**

- {ROOT}/lib/versions.mjs (current) sha256:a2ad577c08685eb4c195b4672898ee1fb194da320974d7f7dc03b2ce1cf4e1b6

**Provisional-to-final**

- unchanged sha256:{REPORT}

### s2 Call order

**Events**

- evaluate → candidate-ready admitted → begin-reconcile → reviewers disposed → scope-result → scope-result admitted → evaluator disposed

**Manifest**

- {ROOT}/cli.mjs (current) sha256:700a54e61d3cc8a5336fb0d812e847189ae35b4072f17c25f8276c8ad2cff0a1

**Provisional-to-final**

- unchanged sha256:{REPORT}

### Reviewed reports

**s1 Version check**

```text
Kind: conversation

## Refinement Direction, No Change, or Blocker

See the report body.

**Aggregate summary**

- Identity: pin-independent version-refusal coverage · acp-controller preflight owner · missing lock comparison · lib/versions.mjs
- Finding: {ROOT}/lib/versions.mjs compares the installed acpx version but not the locked one, so a lock drift passes preflight.
- Direction: compare the locked acpx version in checkVersions in {ROOT}/lib/versions.mjs.
- Validation: npm test with a drifted lock fixture refuses with exit 2.

- Identity: pin-independent version-refusal coverage · acp-controller preflight owner · missing SDK comparison · lib/versions.mjs
- Finding: {ROOT}/lib/versions.mjs never reads the ACP SDK version, so an SDK drift passes preflight.
- Direction: add the ACP SDK comparison to checkVersions in {ROOT}/lib/versions.mjs.
- Validation: npm test with a drifted SDK fixture refuses with exit 2.
```

**s3 Refusal exit**

```text
Kind: conversation

## Refinement Direction, No Change, or Blocker

See the report body.

**Aggregate summary**

- Identity: none
- Finding: no-change: {ROOT}/cli.mjs refuses with exit 2 before any launch; frontier: none.
- Direction: none
- Validation: none
```

**s4 Installed SDK**

```text
Kind: conversation

## Refinement Direction, No Change, or Blocker

See the report body.

**Aggregate summary**

- Identity: none
- Finding: blocker: no readable ACP SDK install is in the approved evidence; frontier: supply the installed SDK package manifest.
- Direction: none
- Validation: none
```

**s2 Call order**

```text
Kind: conversation

**Aggregate summary:** Scope s2 is `no-change`.

- {ROOT}/cli.mjs calls checkVersions before readModelRoles.
```
````

### 4.5 Invariants

- I1 The record has exactly the four H2s `## Result`, `## Scope Results`, `## Findings and Directions`, `## Evidence and Limits`, in order, then `## Spend`.
- I2 The Scope Results columns and per-scope H3s are unchanged.
- I3 Every approval binding, manifest locator and full hash, provisional-to-final line and reviewed report byte is still present.
- I4 Rendered prompts: only `scope.evaluate` differs from baseline, and only by C1 (S1 `item5`); after T1 alone and T2 alone they are byte-identical (S1 `none`).
- I5 `driver.md` bytes before `\n## Retrace\n\n` equal baseline (S2).
- I6 Step 4 is the sole owner of the table rule; A1 references it and restates none of it.
- I7 Every prompt marker and pulled heading appears exactly once (AC-7).
- I8 Never lose a rule: `retrace/SKILL.md` and `driver.md` equal baseline plus exactly A1, A2, C1–C4 (S2 `all`); C1–C3 keep every baseline requirement (identity, finding and consequence, direction, validation, disposition/frontier, full-locator rule, reviewed-report retention) and add form only.
- I9 The finding identity is rendered only when the scope authored it; the renderer never invents or reorders content.

## 5. Effects, rollback and compatibility

- Effects: working-tree edits to four tracked files: `harnesses/omp/acp-controller/driver.md`, `skills/retrace/SKILL.md`, `harnesses/omp/acp-controller/controller.mjs`, `harnesses/omp/acp-controller/test/retrace.test.mjs`. No new repository file. No staging, commit, push, live run, home-directory or `node_modules` change.
- Rollback: `git checkout 31cb615 -- .config/agents/harnesses/omp/acp-controller/driver.md .config/agents/skills/retrace/SKILL.md .config/agents/harnesses/omp/acp-controller/controller.mjs .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs`. No new file exists to remove. (This is a rollback instruction for the owner, not an agent step; agents make no git state change.)
- Compatibility: request and CLI shapes are unchanged. Reports with free-prose summaries still render (R4), so reports from an evaluator that ignores C1 lose nothing. A consumer reading the old per-scope `**Reviewed report**` or bulleted events must read `### Reviewed reports` and the arrow line; the only in-repo consumers are the tests T2 rewrites (verified by `grep` over `.config/agents`: only `controller.mjs` and `test/retrace.test.mjs` contain `Reviewed report`, `**Events**` or `Finding and direction`). [INFERENCE: out-of-repo consumers do not exist.]
- The tree between tasks is never committed.

## 6. Acceptance

Run every command from the repository root. `Sn` means: extract §6.1 block `Sn` to `/tmp/rs/Sn.py` and run `python3 /tmp/rs/Sn.py`; `S1 <mode>` and `S2 <mode>` pass the mode as the one argument. Extraction rule: a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````. No block contains such a line; backticks inside a block are characters, never a fence. §6.1 lists each extracted file's SHA-256 (`shasum -a 256 /tmp/rs/S*.py`). Each AC has one owner; a task runs every AC it owns at its boundary, plus the gates listed for it in §8.

**AC-1** — T3
Behavior: The real loader renders every reviewer and scope template from the working tree equal to the baseline templates, except `scope.evaluate`, which equals the baseline with the C1 old text replaced by the C1 new text.
Check: `S1 item5`; expect `ok`.

**AC-2** — T1
Behavior: `driver.md` and `retrace/SKILL.md` equal the baseline with exactly A1 and A2 applied (C1–C4 may also be present); `driver.md` `## Reconcile` is byte-identical.
Check: `S2 t1`; expect `ok`.

**AC-3** — T3
Behavior: `driver.md` and `retrace/SKILL.md` equal the baseline with exactly A1, A2 and C1–C4 applied; nothing else is added, lost, reordered or reworded; `## Reconcile` is byte-identical.
Check: `S2 all`; expect `ok`.

**AC-4** — T3
Behavior: Only this change's four paths differ from the baseline (union allowlist), nothing is deleted and nothing untracked is added.
Check: `S3`; expect `ok`.

**AC-5** — T2
Behavior: `controller.mjs` differs from the baseline only inside the renderer region (from the `aggregateSummary` doc comment to the normalizer divider).
Check: `S4`; expect `ok`.

**AC-6** — T2
Behavior: An offline render of the R3-like request through the real controller, prompts and scripted agent equals W1 byte for byte: labelled findings, `no-change`/`blocker` cases, prose fallback, arrow events, unchanged manifest, trailing reviewed reports.
Check: `S5`; expect `ok` (a unified diff otherwise).

**AC-7** — guard; T3
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-8** — guard; T3
Behavior: All of `skills/reconcile/`, `retrace/evals/`, `rethink/`, `omp-update/`, `packed-label.md`, `agent-return.md` and every `acp-controller` file other than `controller.mjs`, `test/retrace.test.mjs` and `driver.md` are unchanged against the baseline and in the working tree.
Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace/evals .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; X1=':(exclude).config/agents/harnesses/omp/acp-controller/controller.mjs'; X2=':(exclude).config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs'; X3=':(exclude).config/agents/harnesses/omp/acp-controller/driver.md'; git status --porcelain -- $P "$X1" "$X2" "$X3"; git diff --name-only 31cb615 -- $P "$X1" "$X2" "$X3"`; expect empty output.

**AC-9** — T2
Behavior: The acp-controller suites pass, including the rewritten Retrace renderer tests and KT5 (§7).
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, foreground, timeout ≥ 300 s; expect `pass 52` (the baseline 51 plus KT5), `fail 0`, exit 0.

**AC-10** — guard; T3
Behavior: The real protocol and Retrace skill still load through the CLI offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-11** — guard; T3
Behavior: The plan validator suite passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` (14 tests), exit 0.

**AC-12** — guard; T3
Behavior: The plan-sync extension suite passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `20 pass`, `0 fail`, exit 0.

**AC-13** — guard; T3
Behavior: The papercut ledger suite passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` (19 tests), exit 0.

**AC-14** — T3
Behavior: `retrace/evals` pass as far as they can offline: content unchanged (AC-8) and no assertion contradicted by A1, A2, C1–C4 or R1–R8.
Check: review each `evals.json` assertion naming the approval table, `Findings and Directions`, `Evidence and Limits`, reviewed reports, four-part identity or H3 displays against the final texts and W1; expect no contradiction beyond the §9 items, recorded in T3's Handoff. [INFERENCE: no mechanical runner exists (§2.6).]

**Baseline results** (run at `31cb615` in this checkout): S1 `none` `ok`; `S1 item5` `["differs scope.evaluate"]`; `S2 t1` and `S2 all` `['…/driver.md differs at line 101', '…/retrace/SKILL.md differs at line 45']`; S3 `ok`; S4 `ok`; S5 prints a diff (old Events list, per-scope reports, old Findings shape); AC-7 `ok`; AC-8 empty; AC-9 51 pass `fail 0`; AC-10 `0`; AC-11 14 tests `OK`; AC-12 20 pass 0 fail; AC-13 19 tests `OK`. Expected to fail before their task: AC-2 (T1); AC-6 and AC-9's `pass 52` (T2; AC-5 is already `ok` and guards the region); AC-1, AC-3 (T3).

**Target simulation.** A fresh `git archive 31cb615` copy (`/tmp/rs-full`) was edited into the §4 target by throwaway builders (A1, A2, C1–C4 applied by string replacement from these exact texts; the renderer and tests as in §4.4 and §7). The S-scripts ran in the copy with `GIT_DIR` at this repository, `GIT_WORK_TREE` at the copy and `GIT_OPTIONAL_LOCKS=0`; `acp-controller/node_modules` and `extensions/node_modules` were symlinked from this checkout and excluded through `core.excludesFile`. Results: `S1 item5`, `S2 t1`, `S2 all`, S3, S4 and AC-7 printed `ok`; `S1 none` printed `["differs scope.evaluate"]` as required at the final state; the S5 render equals W1 (W1 was produced by it); `retrace.test.mjs` 7 pass 0 fail (including KT5); `cli.mjs roles` exit 0; executor_plan `OK`; papercut `OK`; `bun test` 20 pass 0 fail. Full `npm test` on the copy: `tests 52`, `pass 52`, `fail 0`.

**Single-task state.** A second copy with T1 only (`/tmp/rs-t1`): `S1 none`, `S2 t1`, S3 and S4 printed `ok`; `S1 item5` and `S2 all` failed as expected (T3 owns them; `S2 all` names driver L175 and skill L373, the C4 and C1 sites). T2 touches neither skill nor driver, so `S1 none` holds after T2 alone as well.

**Negative probes** (each on the correct target copy, restored after):

| Probe | Red |
|---|---|
| a line inserted inside `driver.md` `## Reconcile` | `S2 all` (differs at line 3; "driver Reconcile section changed") |
| one word changed in C1's new text ("in this order" → "in that order") | `S1 item5`, `S2 all` |
| one word changed in step 4 of `## Normalize and approve` | `S1 item5` (`differs scope.normalize`), `S2 all` |
| `reconcile/references/reviewer-protocol.md` edited | S3, AC-8 |
| a stray untracked `skills/retrace/notes.md` | S3 |
| a line added before or after the renderer region of `controller.mjs` | S4 |
| the Events joiner changed from ` → ` to ` -> ` | S5 |

**Why each AC sits where it does.**

- T1 owns AC-2 only; it touches the driver's new H3 and one unpulled skill sentence, so `S2 t1` accepts T3's later edits and passes whatever T2's state.
- T2 owns the renderer ACs (AC-5, AC-6, AC-9); none reads the skill or driver, so they pass whatever T1's state. The scripted agent answers by phase and scope, so W1 does not depend on prompt text. T2 runs no prompt gate: it edits no prompt source, and AC-1 on the final tree covers the prompts.
- T3 edits only Markdown that neither the scripted suites nor S5 depend on for their outcome, so it does not rerun AC-6 or AC-9; the full-target simulation ran both with T3's edits in place (§6), and `dev-verification` reruns every AC on the final tree.
- T3 runs last on the final tree, so it owns every whole-tree invariant (AC-1, AC-3, AC-4, AC-7, AC-8, AC-10–AC-14). S2 compares exact bytes (no normalization), so it also proves T3 kept T1's A1/A2 bytes and did not touch `## Reconcile`.

### 6.1 Check scripts

Copy each block verbatim under the §6 extraction rule. Each file holds the block's lines joined with newlines, plus one final newline. Expected `shasum -a 256`:

| File | SHA-256 |
|---|---|
| `S1.py` | `bde416b4c7bd25172364ff4749535552b203ab9963bb978a3327f970cb20cd78` |
| `S2.py` | `79dc9779392801f9ef7826b47fd708bfd7f4b9b7080311db0feec4804ded86e9` |
| `S3.py` | `b8a3215368634bcf27c151e3f37b50d14917de395ce4ee522418e9395c57fa1f` |
| `S4.py` | `dad0f0f926c89656b2c495fb73b874e39930a5fe23a4a91919791bccb04e88ff` |
| `S5.py` | `86172ed3edb1f6ba241447a187eac9f9dff5155b8c5d2e91a639bed985acb52b` |

S1
```python
# S1 (AC-1; T1 gate): the real loader renders the working-tree prompts; mode none = byte-identical to the baseline, item5 = only the item-5 summary rule differs
import subprocess,sys,tempfile,shutil,os
B='31cb615';L=os.path.abspath('.config/agents/harnesses/omp/acp-controller/lib/prompts.mjs')
F=['.config/agents/skills/reconcile/references/reviewer-protocol.md','.config/agents/skills/retrace/SKILL.md']
OLD='Include a short **Aggregate summary** authored by the scope: the applicable finding and consequence, direction, and required validation; for `no-change` or `blocker`, state the corresponding disposition and frontier instead. This summary remains inside the report reviewed by Reconcile.'
NEW='Include a short **Aggregate summary** authored by the scope: put the bold label `**Aggregate summary**` on its own line, then give each distinct finding as four one-line bullets in this order: `- Identity: {objective class} · {owner} · {root-cause class} · {evaluand}` with its complete four-part identity, `- Finding: {finding and consequence}`, `- Direction: {direction}`, and `- Validation: {required validation}`. For `no-change` or `blocker`, Identity may be `none`, Finding states the corresponding disposition and frontier, and Direction and Validation are `none` when nothing applies. This summary remains inside the report reviewed by Reconcile.'
mode=sys.argv[1] if len(sys.argv)>1 else ''
if mode not in ('none','item5'):print('unknown mode');sys.exit(2)
JS=r"""import { pathToFileURL } from "node:url";
const [lib, rp, rs, mode, oldText, newText] = process.argv.slice(1);
const { loadPrompts, PROMPT_SOURCES } = await import(pathToFileURL(lib).href);
const cur = await loadPrompts(PROMPT_SOURCES);
const base = await loadPrompts({ reviewerProtocolPath: rp, retraceSkillPath: rs });
const bad = [];
if (!cur.ok) bad.push("working tree: " + cur.problems.join("; "));
if (!base.ok) bad.push("baseline: " + base.problems.join("; "));
if (cur.ok && base.ok) {
  if (base.sources.retraceSkill.path === cur.sources.retraceSkill.path) bad.push("baseline copy not used");
  for (const g of ["reviewer", "scope"]) {
    const names = new Set([...Object.keys(cur.prompts[g]), ...Object.keys(base.prompts[g])]);
    for (const n of names) {
      let want = base.prompts[g][n];
      if (mode === "item5" && g === "scope" && n === "evaluate") {
        if (want.split(oldText).length !== 2) bad.push("baseline scope.evaluate does not hold the old item-5 rule once");
        want = want.replace(oldText, newText);
      }
      if (cur.prompts[g][n] !== want) bad.push(`differs ${g}.${n}`);
    }
  }
}
console.log(bad.length ? JSON.stringify(bad) : "ok");
"""
d=tempfile.mkdtemp(prefix='rs-s1-')
try:
    a=subprocess.run(['git','archive',B,'--',*F],capture_output=True)
    if a.returncode or subprocess.run(['tar','-x','-C',d],input=a.stdout).returncode:print('stop: git archive');sys.exit(2)
    r=subprocess.run(['node','--input-type=module','-e',JS,'--',L,*[os.path.join(d,f) for f in F],mode,OLD,NEW],capture_output=True,text=True)
    if r.returncode:print('stop: node '+r.stderr.strip()[-300:]);sys.exit(2)
    print(r.stdout.strip())
finally:shutil.rmtree(d)
```

S2
```python
# S2 (AC-2, AC-3): driver.md and retrace/SKILL.md equal the baseline with exactly the pinned edits; mode t1 = T1 edits (T3 edits may also be present), all = T1 and T3 edits
import subprocess,sys,os
B='31cb615';DR='.config/agents/harnesses/omp/acp-controller/driver.md';RT='.config/agents/skills/retrace/SKILL.md';RH='\n## Retrace\n\n'
A1='### Approval surface\n\nRender each table that step 4 of Retrace\'s "Normalize and approve" presents,\nincluding a re-presented one, in this layout. Step 4 alone owns the table, its\napproval and re-presentation rules, and the `roles` check with its `Models:`\nlist; this layout only adds labelled context lines before the table.\n\n```markdown\n## Retrace scope table\n\n**Root**\n\n- {bound absolute root}\n\n**Objective**\n\n- {each raw human objective, in authored order}\n\n**Evidence**\n\n- {each exact evidence locator} ({current | historical})\n\n**Protected behavior**\n\n- {each protected behavior}\n\n**Exclusions**\n\n- {each exclusion}\n\n**Links**\n\n- {each edge as `{ID} requires {ID}`, `{ID} shares evidence with {ID}`, or `{ID} may conflict with {ID}`}\n\n**Scopes**\n\n| Scope | Evaluate |\n|---|---|\n| {ID} {name} | {one observable objective} |\n```\n\nGive each item its own child line; an item bound to only some scopes starts\nwith their IDs and a colon. A field with no item has the one child `- none`.\nThe labelled lines add no binding: the request binds what step 4 names.\n\n'
A2P='Render each table for approval in the layout under "Approval surface" in the "Retrace" section of [the driver](../../harnesses/omp/acp-controller/driver.md).\n\n'
A2A='After approval, invoke the controller, handle its exit codes, and bind its models as the "Retrace" section of [the driver](../../harnesses/omp/acp-controller/driver.md) says.\n'
C=[(RT,'Include a short **Aggregate summary** authored by the scope: the applicable finding and consequence, direction, and required validation; for `no-change` or `blocker`, state the corresponding disposition and frontier instead. This summary remains inside the report reviewed by Reconcile.','Include a short **Aggregate summary** authored by the scope: put the bold label `**Aggregate summary**` on its own line, then give each distinct finding as four one-line bullets in this order: `- Identity: {objective class} · {owner} · {root-cause class} · {evaluand}` with its complete four-part identity, `- Finding: {finding and consequence}`, `- Direction: {direction}`, and `- Validation: {required validation}`. For `no-change` or `blocker`, Identity may be `none`, Finding states the corresponding disposition and frontier, and Direction and Validation are `none` when nothing applies. This summary remains inside the report reviewed by Reconcile.'),(RT,'3. `## Findings and Directions` — materialize each distinct finding as one entry in this section whose complete four-part identity gives the `objective class`, `owner`, `root-cause class`, and `evaluand` with all four values together, followed by its concise finding and consequence, reviewed direction, and required validation.','3. `## Findings and Directions` — materialize each distinct finding as one entry in this section of one-line `Identity`, `Finding`, `Direction` and `Validation` bullets: its complete four-part identity gives the `objective class`, `owner`, `root-cause class`, and `evaluand` with all four values together, followed by its concise finding and consequence, reviewed direction, and required validation. Disposition stays in the Scope Results row and is not repeated. A scope-authored summary without those bullets is shown as authored, and no identity is invented for it.'),(RT,'4. `## Evidence and Limits` — retain the exact approved table and approval binding, complete immutable reviewed reports, finding identities and contributors, manifests, provisional-to-final changes, disagreements, and authoritative review evidence.',"4. `## Evidence and Limits` — retain the exact approved table and approval binding, complete immutable reviewed reports, finding identities and contributors, manifests, provisional-to-final changes, disagreements, and authoritative review evidence. Show each scope's ordered events as one arrow-joined line and each manifest entry as `locator (role) identity`, and put the complete immutable reviewed reports last, under `### Reviewed reports`, one bold scope label per report."),(DR,'`roles` call, stdout carries only the rendered record followed by `## Spend`;\nstderr carries diagnostics. Present stdout\nverbatim.','`roles` call, stdout carries only the rendered record, laid out as Retrace\'s\n"Freshness and aggregate" section describes, followed by `## Spend`;\nstderr carries diagnostics. Present stdout\nverbatim.')]
def show(p):
    r=subprocess.run(['git','show',B+':'+p],capture_output=True,text=True)
    if r.returncode:print('stop: git show '+p);sys.exit(2)
    return r.stdout
def t1(f):
    d=f[DR]
    if d.count(RH)!=1:print('stop: baseline Retrace heading');sys.exit(2)
    i=d.index(RH)+len(RH)
    if not d[i:].startswith('### Invoke the controller\n') or f[RT].count(A2A)!=1:print('stop: T1 anchors');sys.exit(2)
    return {DR:d[:i]+A1+d[i:],RT:f[RT].replace(A2A,A2P+A2A)}
def t3(f):
    f=dict(f)
    for p,o,n in C:
        if f[p].count(o)!=1 or (p==DR and f[p].index(o)<f[p].index(RH)):print('stop: T3 anchor '+o[:40]);sys.exit(2)
        f[p]=f[p].replace(o,n)
    return f
mode=sys.argv[1] if len(sys.argv)>1 else ''
if mode not in ('t1','all'):print('unknown mode');sys.exit(2)
base={p:show(p) for p in (DR,RT)};w1=t1(base);w3=t3(w1)
ok=[w3] if mode=='all' else [w1,w3]
bad=[]
for p in (DR,RT):
    if not os.path.isfile(p):bad.append('missing '+p);continue
    got=open(p,encoding='utf-8').read()
    if not any(got==w[p] for w in ok):
        want=ok[0][p];n=min(len(got),len(want));i=next((k for k in range(n) if got[k]!=want[k]),n)
        bad.append(p+' differs at line '+str(want[:i].count('\n')+1))
if os.path.isfile(DR) and open(DR,encoding='utf-8').read().split(RH)[0]!=base[DR].split(RH)[0]:bad.append('driver Reconcile section changed')
print(bad or 'ok')
```

S3
```python
# S3 (AC-4): only this change's paths differ from the baseline (union allowlist; nothing deleted or added)
import subprocess
C='.config/agents/'
ok={C+'skills/retrace/SKILL.md',C+'harnesses/omp/acp-controller/driver.md',C+'harnesses/omp/acp-controller/controller.mjs',C+'harnesses/omp/acp-controller/test/retrace.test.mjs'}
g=lambda *a:[l for l in subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n') if l]
P=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md','bin','.config/scripts','.grok','.cursor']
got=set(g('diff','--name-only','31cb615','--',*P)+g('ls-files','--others','--exclude-standard','--',*P))
gone=set(g('diff','--name-only','--diff-filter=D','31cb615','--',*P))
print(sorted((got-ok)|gone) or 'ok')
```

S4
```python
# S4 (AC-5): controller.mjs differs from the baseline only inside the Retrace record renderer region
import subprocess,sys
B='31cb615';P='.config/agents/harnesses/omp/acp-controller/controller.mjs'
START='/**\n * The scope-authored **Aggregate summary**';END='// ------------------------------------------------------------------ normalizer\n'
r=subprocess.run(['git','show',B+':'+P],capture_output=True,text=True)
if r.returncode:print('stop: git show');sys.exit(2)
b=r.stdout;w=open(P,encoding='utf-8').read()
if b.count(START)!=1 or b.count(END)!=1:print('stop: baseline anchors');sys.exit(2)
head=b[:b.index(START)];tail=b[b.index(END):]
bad=[]
if not w.startswith(head):bad.append('changed before the renderer region')
if not w.endswith(tail):bad.append('changed after the renderer region')
if w.count(END)!=1:bad.append('normalizer divider not unique')
print(bad or 'ok')
```

S5
```python
# S5 (AC-6): throwaway offline render of an R3-like Retrace request (scripted agent, no model, no live run) equals worked example W1
import subprocess,sys,os,re,difflib
SPEC='.agents/artifacts/2026-09-29_retrace-surfaces-spec.md';CTL=os.path.abspath('.config/agents/harnesses/omp/acp-controller')
JS='import fs from "node:fs";\nimport os from "node:os";\nimport path from "node:path";\nimport { pathToFileURL } from "node:url";\nconst C = path.resolve(process.argv[1]);\nconst imp = (p) => import(pathToFileURL(path.join(C, p)).href);\nconst { runRetrace } = await imp("controller.mjs");\nconst { createScriptedLauncher } = await imp("test/fixtures/scripted-acp-agent.mjs");\nconst { socketDirFor } = await imp("lib/env.mjs");\nconst { loadPrompts, PROMPT_SOURCES } = await imp("lib/prompts.mjs");\nconst dir = fs.mkdtempSync(path.join(os.tmpdir(), "rs-s5-"));\nconst root = path.join(dir, "root");\nconst sessionsRoot = path.join(dir, "sessions");\nconst tmpRoot = path.join(dir, "tmp");\nfor (const d of [path.join(root, "lib"), sessionsRoot, tmpRoot]) fs.mkdirSync(d, { recursive: true });\nconst plan = path.join(dir, "plan.json");\nconst log = path.join(dir, "scripted.log");\nconst y = (data) => `yield:${JSON.stringify(data)}`;\nconst VALID = y({ kind: "review", verdict: "VALID", summary: ["Accepts the report"], blocking_issues: [], revision: "none", recommendations: [] });\nconst versions = path.join(root, "lib", "versions.mjs");\nconst cli = path.join(root, "cli.mjs");\nfs.writeFileSync(versions, "export function checkVersions() {}\\n");\nfs.writeFileSync(cli, "checkVersions(); readModelRoles();\\n");\nconst summary = (lines) => ["Kind: conversation", "", "## Refinement Direction, No Change, or Blocker", "", "See the report body.", "", "**Aggregate summary**", "", ...lines].join("\\n");\nconst scopes = [\n  { id: "s1", name: "Version check", objective: "checkVersions compares omp, acpx and ACP SDK versions to its own constants", file: versions, disposition: "proposal", report: summary([\n    "- Identity: pin-independent version-refusal coverage · acp-controller preflight owner · missing lock comparison · lib/versions.mjs",\n    `- Finding: ${versions} compares the installed acpx version but not the locked one, so a lock drift passes preflight.`,\n    `- Direction: compare the locked acpx version in checkVersions in ${versions}.`,\n    "- Validation: npm test with a drifted lock fixture refuses with exit 2.",\n    "",\n    "- Identity: pin-independent version-refusal coverage · acp-controller preflight owner · missing SDK comparison · lib/versions.mjs",\n    `- Finding: ${versions} never reads the ACP SDK version, so an SDK drift passes preflight.`,\n    `- Direction: add the ACP SDK comparison to checkVersions in ${versions}.`,\n    "- Validation: npm test with a drifted SDK fixture refuses with exit 2.",\n  ]) },\n  { id: "s2", name: "Call order", objective: "cli.mjs calls checkVersions before readModelRoles and any runtime", file: cli, disposition: "no-change", requires: ["s1"], report: ["Kind: conversation", "", "**Aggregate summary:** Scope s2 is `no-change`.", "", `- ${cli} calls checkVersions before readModelRoles.`].join("\\n") },\n  { id: "s3", name: "Refusal exit", objective: "a version mismatch refuses with exit 2 before any launch", file: cli, disposition: "no-change", report: summary(["- Identity: none", `- Finding: no-change: ${cli} refuses with exit 2 before any launch; frontier: none.`, "- Direction: none", "- Validation: none"]) },\n  { id: "s4", name: "Installed SDK", objective: "the installed ACP SDK version is readable", file: versions, disposition: "blocker", report: summary(["- Identity: none", "- Finding: blocker: no readable ACP SDK install is in the approved evidence; frontier: supply the installed SDK package manifest.", "- Direction: none", "- Validation: none"]) },\n];\nconst entries = (s) => [\n  { when: `Phase: evaluate\\nScope: ${s.id}\\n`, then: y({ kind: "candidate-ready", report: s.report, manifest: [{ locator: s.file, role: "current" }], disposition: s.disposition }) },\n  { when: `Owner: ${s.id}\\n`, then: VALID },\n  { when: `Owner: ${s.id}\\n`, then: VALID },\n];\nfs.writeFileSync(plan, JSON.stringify({ "scripted/a": scopes.flatMap(entries) }));\nconst prompts = await loadPrompts(PROMPT_SOURCES);\nif (!prompts.ok) throw new Error(prompts.problems.join("; "));\nconst request = {\n  root,\n  objectives: ["Assess whether lib/versions.mjs and cli.mjs implement the version refusal, without depending on the current pin values."],\n  constraints: [],\n  exclusions: [],\n  evidence: [{ locator: versions, role: "current" }, { locator: cli, role: "current" }],\n  table: { scopes: scopes.map((s) => ({ id: s.id, name: s.name, objective: s.objective, evaluand: path.relative(root, s.file), protected: ["the evidence files are read-only"], exclusions: [], requires: s.requires ?? [], sharedEvidence: [], potentialConflict: [] })) },\n  approval: { text: "approve", at: "2026-09-29T12:00:00Z" },\n};\nconst deps = { ompPath: createScriptedLauncher({ dir, plan, log }), roles: { a: { model: "scripted/a", thinking: "low" }, b: { model: "scripted/b", thinking: "low" } }, prompts: prompts.prompts, sessionsRoot, tmpRoot, env: { PATH: process.env.PATH }, log: () => {} };\ntry {\n  const out = await runRetrace(request, deps);\n  process.stdout.write(`exit ${out.exitCode}\\n${out.markdown.replaceAll(root, "{ROOT}")}`);\n} finally {\n  for (const name of fs.existsSync(tmpRoot) ? fs.readdirSync(tmpRoot) : []) fs.rmSync(socketDirFor(path.join(tmpRoot, name, "home")), { recursive: true, force: true });\n  fs.rmSync(dir, { recursive: true, force: true });\n}\n'
L=open(SPEC,encoding='utf-8').read().split('\n')
try:
    i=L.index('W1');j=L.index('````',i+2)
except ValueError:print('stop: W1 not found');sys.exit(2)
if L[i+1]!='````markdown':print('stop: W1 fence');sys.exit(2)
want='\n'.join(L[i+2:j])
r=subprocess.run(['node','--input-type=module','-e',JS,CTL],capture_output=True,text=True,timeout=600)
if r.returncode:print('stop: node '+r.stderr.strip()[-300:]);sys.exit(2)
got=r.stdout.split('\n## Spend\n')[0].rstrip('\n')
got=re.sub(r'unchanged sha256:[0-9a-f]{64}','unchanged sha256:{REPORT}',got)
if got==want:print('ok')
else:print('\n'.join(list(difflib.unified_diff(want.split('\n'),got.split('\n'),'W1','render',lineterm=''))[:60]))
```

## 7. Test seams and permanent tests (T2)

Per `skill://dev-implementation/references/test-value.md`: old-shape pins are rewritten to the new contract, never re-pinned.

- `scopeEvents(markdown, id)` parses the one arrow line under the scope's `**Events**` and returns bare event names; it asserts the line exists.
- KT4 and KS6 keep their behavioral assertions (event order; disposal-not-established event) against bare names.
- KS5 keeps its partial-aggregate, stopped-alone and review-status assertions; its inline-form report and Findings pin move into KT5 (it uses the default `candidate("S2")`).
- New test `KT5: labelled summaries render as fixed finding bullets, other summaries as authored prose, reviewed reports last`, four scopes through `runRetrace` with the scripted agent:
  - S1: two labelled findings, the second without Identity and in `- **Label:** v` / `- **Label**: v` forms → `**Finding 1**` with Identity, `**Finding 2**` without, all normalized to `- Label: v`.
  - S2: inline-form prose summary with a nested item → baseline `**Finding and direction**` conversion.
  - S3: labelled lines missing `Direction` → prose fallback, lines verbatim.
  - S4: no summary → baseline no-summary line.
  - Asserts the exact `## Findings and Directions` text, S1's exact Events arrow line and Manifest line (full path, full SHA-256 of the fixture content), that `### Reviewed reports` is the last H3 of `## Evidence and Limits`, and its exact content (four bold labels, four verbatim fenced reports).
- Plausible bugs caught: a malformed labelled summary silently dropped or partly rendered; an invented identity; reports rendered before per-scope details or not verbatim; events split across lines or reordered; manifest truncated.
- No test pins wording of `retrace/SKILL.md` or `driver.md`; those are covered by the throwaway S-scripts, which are not added to the repository.

## 8. Tasks and file ownership

| Task | Target | Depends on | Owns ACs | Gates at its boundary |
|---|---|---|---|---|
| **T1 — Part A** | A1 into `driver.md` `## Retrace`; A2 into `retrace/SKILL.md` `## Invocation contract` | — | AC-2 | `S1 none`, S3, AC-7, AC-8, AC-10 |
| **T2 — Renderer + tests** | `controller.mjs` renderer region (§4.2), `test/retrace.test.mjs` (§7) | — | AC-5, AC-6, AC-9 | S3, AC-8, AC-10 |
| **T3 — Prompt, prose, stdout** | C1–C3 in `retrace/SKILL.md`; C4 in `driver.md` | T1, T2 | AC-1, AC-3, AC-4, AC-7, AC-8, AC-10–AC-14 | — |

T1 and T2 run in parallel; T3 starts after both Handoffs.

Shared-file ownership:

- `driver.md`: bytes before `\n## Retrace\n\n` (all of `## Reconcile`, baseline L1–98) are owned by no task and must stay byte-identical. T1 owns only the A1 insertion (from after the `## Retrace` heading's blank line up to, not including, `### Invoke the controller`). T3 owns only the C4 lines inside `### Invoke the controller` (baseline L129–132). No task edits any other driver byte.
- `retrace/SKILL.md`: T1 owns only the A2 paragraph (before baseline L45). T3 owns only C1 (L371), C2 (L388), C3 (L389). No task edits `## Normalize and approve`, the prompt section or any other line.
- `controller.mjs` and `test/retrace.test.mjs`: T2 only.

## 9. Residual risks

- **Evaluator compliance.** C1 is a prompt rule; a model may still write prose. R4 renders it as authored, losing nothing but the fixed form. No live run proves compliance (D5 as amended).
- **Root-session layout unproven live.** A1 is followed by the root session only; no offline check exercises a model rendering it. S2 proves the text; D5 waives the live R3.
- **Eval `RETRACE-SCOPE-APPROVAL` assertion** "The only approval presentation is the complete Scope | Evaluate table…" could be read as forbidding surrounding lines. D6 settles that the labelled lines are accepted; eval content stays unchanged by rule.
- **Eval `RETRACE-SYNTHESIS`** also asks for "material readiness, owner and protections" in each Findings entry; the baseline item 3 already does not require them, and this work does not change that gap.
- **`### Reviewed reports`** is an H3 that is not a scope display; the L384 rule ("H3 headings for individual scope displays") is read as permitting it because C3 names it explicitly. [INFERENCE: evaluators of `RETRACE-REVIEWED-BLOCKER` accept it.]

## 10. Revision and next owner

- Revision: `retrace-surfaces/spec-v2`. Changes from spec-v1 (plan rethink): A1 no longer restates step 4's `Models:` placement (the table-last layout already honors it, and step 4 stays the sole owner, I6); T2 drops its conditional `S1 none` gate and T3 drops redundant AC-6/AC-9 reruns; T1 no longer records file hashes nobody consumes (S2 compares exact bytes). S2's hash changed. Next owner: `dev-implementation` (the route skips ticketing), with T1 ∥ T2 → T3, then `dev-code-review`, `dev-verification`, `dev-continual-learning`, `completion-presentation`.
- Simulation scaffolds live only under `/tmp/rs-sim`, `/tmp/rs-full`, `/tmp/rs-t1` and `/tmp/rs`; none enters the repository.
- New human-owned decisions: none.
