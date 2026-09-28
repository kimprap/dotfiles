# Agent-skills lean-down, batch 3: technical specification

- **Revision:** `agent-skills-lean-down-batch3/spec-v1`
- **Date:** 2026-09-28
- **Assurance:** standard
- **Baseline:** repository `HEAD` `45e9e50`, clean. Line numbers refer to that baseline; re-locate by content if lines drift.

## 1. Authority and approved outcome

**Authority.**

- The human-approved proposal [`2026-09-28_agent-skills-lean-down-proposal.md`](2026-09-28_agent-skills-lean-down-proposal.md) (sha256 `a1efc66c…80f1`, as bound by the route). Batch 3 is:
  - ranked item 6: stale authority links in ADRs 0001–0010 and `INDEX.md`;
  - ranked item 11: `INDEX.md` keeps the record table, precedence list and supersession rules; the question table and execution map go;
  - the "Other recommendations" ADR-format point: ADR-0002 D21 links to the OMP adapter instead of restating OMP mechanics. The ADR format (decision, reason, rejected alternatives, reopen when) applies only where these items already edit. No full rewrite.
- The human-approved Route Overview adds two rules: every decision ID stays defined once, in its ADR; any live link into a removed INDEX section is repaired. Only `docs/adr/**` plus such link repairs may change.
- Precedent: batch 1 and 2 [spec](2026-09-28_agent-skills-lean-down-batch2-spec.md) and [plan](../plans/2026-09-28-2245_agent-skills-lean-down-batch2.md). This spec reuses their `LIVE` pathspec, guard checks and lessons: every AC is satisfiable at its owning task's boundary; file-list checks skip paths deleted but not committed; no incidental counts or word targets are pinned.
- Owner intent (binding): lean and agnostic, no brittle wording, never lose a decision. Reconcile and Retrace stay untouched: no change to `skills/reconcile/`, `skills/retrace/`, `skills/rethink/`, `skills/omp-update/`, `references/packed-label.md` or `harnesses/omp/acp-controller/`. ADR-0010's decision section stays as-is (proposal "Keep as-is": ADRs 0005, 0008 and 0010's decision section); only its stale citations change.
- Governing contracts (`canonical-project-contracts`): `docs/adr/INDEX.md` and the ADRs themselves. ADR-0001 D01 and ADR-0004 D23 make the index the discovery surface for IDs, scope, status and supersession. Both decisions hold after this batch: the record table keeps all of that.

**Outcome.** When the batch is done:

1. **Item 6.** No ADR or `INDEX.md` carries a `local://` citation, a SHA-256 hash, a revision id (`…/v3.1`, `spec-v3`, `…-r1`) or the "Current governing authority" line. Each ADR that had one carries one line meaning "Approved by the owner on <date(s)>; history in git." Specs stored in the repo stay linked. INDEX's "Current evidence baseline" section is gone, and so is the A2 citation (ADR-0002 L109, the `local://archive-direct-contract.md` line from `1f44a60`).
2. **Item 11.** `INDEX.md` keeps its intro, the record table, "Authority and precedence" and "Supersession discipline". "Decision discovery" and "Current generic execution map" are gone.
3. **D21.** ADR-0002 D21 keeps every host-neutral decision, links to `.config/agents/harnesses/omp/agent-return.md` for native return mechanics, and restates none of them. The block ends with Why, Rejected alternatives and Reopen when only.
4. Every decision ID is defined exactly once in its ADR. Every link into or inside `docs/adr` resolves. All guard checks and deterministic suites still pass.

**Non-goals.**

- Every other proposal item, including item 20's stale `.agents/AGENTS.md` line ("five ACTIVE … seven-event envelope") and `papercut/WORKFLOW.md` L34 ADR numbers (item 18).
- ADR-0005 (already clean) and every ADR section outside the authority/evidence text, except D21 and ADR-0010's `spec-v3` reference in its verification expectations.
- Any ADR-format rewrite beyond D21, including renaming "Evidence / source revisions" headings.
- `spec-v3` mentions in the acp-controller code comments and `omp-update/SKILL.md` L18. Both are guarded. ADR-0010 keeps linking the archived spec those comments name.
- No new file, ADR, decision ID, test or eval case.

## 2. Current system and constraints

`LIVE` = `.config/agents docs/adr .agents/AGENTS.md .agents/GENERIC-AGENTS.md ':!.config/agents/references/impl-rethink/MAINTENANCE.md'` (batch 1).

**Stale citations at baseline.** S1 (§6.1) flags exactly these lines (`S1 adr` the ADR rows, `S1 index` the INDEX row):

| File | Lines | Content |
|---|---|---|
| 0001 | 159 | "Current governing authority" with three `local://` files, `dev-workflow-streamlining/v3.1` (confirmed 2026-09-04), `lean-dev-workflow-spec/v1`, task-sizing contract (confirmed 2026-09-06) |
| 0002 | 105–109 | the same governing line; `verification-proof-design/v1` and `verification-policy-implementation/v1` (2026-09-11); `execution-recovery-policy/v1` + SHA (2026-09-13); `planning-authoring-rethink/v1` + SHA (2026-09-14); the A2 archive line with `local://` + SHA (2026-09-27) |
| 0003 | 89–91 | governing line; the 2026-09-11 and 2026-09-13 lines |
| 0004 | 55 | governing line |
| 0006 | 41, 49 | `local://…papercuts-plan.md`, Datetime, 64-hex revision; Human authority names `SELF-IMPROVEMENT-DESIGN-20260812-r1` "and the exact executor plan revision above" |
| 0007 | 57 | governing line |
| 0008 | 41 | `local://…init-ask-spec.md`, `PAPERCUT-AUTOMATION-SPEC-20260812-r1`, SHA |
| 0009 | 72 | governing line |
| 0010 | 59, 67 | `reconcile-retrace-acp-production/spec-v3` + SHA and `replacement-lifecycle-plugin/spec-v5` + SHA, each with a working link to its archived spec; "(spec-v3 A3)" |
| INDEX | 95–100 | the "Current evidence baseline" list |

Lines that only qualify the removed revision ("… remains historical support where …consistent with this revision/cutover"): 0001 L160, 0002 L110, 0003 L93, 0004 L57, 0009 L73.

The "lean projection" dates come from ADR text: v3.1 confirmed 2026-09-04 (0001 L159) and the lean projection of ADRs 0001–0004, 0007 and 0009 authorized on 2026-09-06 (INDEX L93, L101).

**Decision IDs.** Definitions are `### Dnn —` headings (and `N. **Pnn —` in ADR-0005). Each ID is defined once, except D24: historical in superseded ADR-0006 and active in ADR-0007. That is the intended supersession, so the invariant is "each ID defined in exactly one ACTIVE ADR, and no ADR gains, loses or moves a definition". The INDEX record table's Decision IDs column matches the definitions (S2 passes at baseline).

**D21 (ADR-0002 L59–71).** OMP mechanics sit in L61, L62, L64, L65 and L70 (Consequences). The adapter already owns each one:

| D21 mechanic | `agent-return.md` owner (baseline lines) |
|---|---|
| `taskDepth > 0` stop, depth-0 capability gate | `## Implementation candidate job collection` L127–131 |
| same-turn native wait, original result/row retention, auto-delivery not a reply | L66–123, L180–185 |
| direct native `yield`, "Result submitted." bridge failure, `{"response":…}` launch schema | L145–165 |
| receipt outcomes `failed`/`injected`/`revived`/`woken`; busy injection is an aside | `## Implementation follow-up wake jobs` L203–217 |
| `write agent://`, `agentUrlId` binding, no job-ID equality | L225–245 |
| no-job wait stop (`No running background jobs to wait for.`), `wakeRelay` | L247–270 |
| OMP has no token, send-and-wait or restatement branch | L278 |
| Reconcile/Retrace run under the acpx controller (exemption sentence) | `## Allocation, addressability, and turns` L40–41; also ADR-0010 D31 item 8 |

Host-neutral D21 decisions (must stay): capability loss stops `transport-unavailable` with no delegated-controller substitution; attempt-1 candidate admitted once from the exact allocated launch after original-result retention, adapter validation and exact task/attempt/owner/receiver/phase checks; attempt 2 resumes the same child; follow-up binding of controller/child/task/attempt/receiver/phase, report identity, invocation and schema; relays, alternate sources and failed jobs are unadmitted; after either admission the same child gets the implementation rethink (code then test, at most one correction, direct checks and changed-path smoke, one lean Handoff); job settlement is neither completion nor disposal; no second self-rethink; L63 (recovery-rethink separation); the L64 collection exemption and "adds no observer, service, ledger, deadline or unattended-completion promise"; no resend, replacement, reset, polling or alternate-source recovery; L65's portable token path for hosts with native reply correlation and the `transport-unavailable` stop for hosts with neither; L66 (code rethink); L67 (`test-value.md`); from L70, "Already-authorized recovery returns use the same seam and exemption without a second implementation rethink" and "Assurance and audit roles never perform this rethink"; custom-controller lifecycle and count rules stay preserved (ADR-0010 D31).

**INDEX.** 103 lines. Record table L5–18. "Decision discovery" L20–44. Precedence L46–56. Execution map L58–81. Supersession L83–89. Evidence baseline L91–103. The ADR-0002 row's scope cell (L10) restates OMP mechanics ("child-bound OMP wake-job … native token/message rules").

**Readers of ADR/INDEX text** (checked with `git grep` across the repository, archives excluded):

- No live file links to an INDEX anchor or names a removed section. The only hits for the three section names are INDEX's own headings. `dev-ask/WORKFLOW.md` L50 links `INDEX.md` without an anchor. So no link repair is needed outside `docs/adr`.
- `dev-ask/evals` case `R-T5-CANONICAL-DISCOVERY` (evals.json L2995–3030) expects the index path, active generic ADRs 0001/0002/0003/0004/0007/0009, ADR-0005 product and ADR-0008 setup, superseded ADR-0006, D23 owning the human map and journal relationship, and `craft-skill` owning the journal convention. The record table rows (unchanged except ADR-0002's scope cell) and ADR-0004 D23 (L34–36) carry all of it. `R-T5-ORDINARY-DIRECT-NO-EAGER-HISTORY` only forbids reading the index. No eval edit is needed.
- `test_papercut_ledger.py` L107 uses the string `docs/adr/0007-…md#D24` as fixture data; the file name does not change.
- `omp-update/SKILL.md` L24 relies on ADR-0010 naming `lib/versions.mjs` (L34, Consequences, unchanged). The acp-controller code reads no ADR (`grep` for `docs/adr|INDEX.md|ADR-0|D31` in its `.mjs/.js/.json`: no hits).

**Verified commands** (run 2026-09-28 at `45e9e50`):

- `npm test` in `harnesses/omp/acp-controller`: `ℹ tests 51`, `ℹ fail 0`, exit 0, about 165 s.
- `cli.mjs roles`: exit 0.
- `test_executor_plan.py`: 14 tests, OK. `test_papercut_ledger.py`: 19 tests, OK.
- `bun test` in `harnesses/omp/extensions`: `0 fail`.
- Guard markers and headings: each once. Guarded paths: no diff.
- S1–S9 at baseline: S1, S3, S4 and S5 fail as expected; S2, S6, S7, S8 and S9 print `ok`. An in-memory simulation (trimmed INDEX, host-neutral D21 with the adapter link) made S2, S3, S4, S6 and S8 print `ok`. Negative probes failed as intended: a changed D03 heading (S8), an OMP token in D21 (S4), a dropped provenance line (S9).

## 3. Architecture and ownership

| Concern | Owner after the batch | Everyone else |
|---|---|---|
| Durable decisions and their rationale | the defining ADR section (unchanged except D21) | INDEX lists IDs only |
| Decision discovery (ID, scope, status, supersession) | INDEX record table | no question table |
| Approval provenance | one "Approved by the owner on …; history in git." line per ADR; git history | no session-file links, hashes or revision ids |
| OMP native return mechanics | `harnesses/omp/agent-return.md` (unchanged) | D21: one adapter link |
| Generic engineering flow map | `dev-ask/WORKFLOW.md` (ADR-0004 D23) | INDEX: none |
| Precedence and supersession rules | INDEX (byte-identical) | unchanged |

Dependency direction: ADRs point to the adapter and to in-repo specs; nothing points back into removed INDEX sections.

## 4. Interfaces, data, invariants and errors

The interfaces are Markdown sections, the approval line and one link. Wording is free unless a check needs a token.

**T1 — ADR citation cleanup (item 6) and D21.**

In each "Evidence / source revisions" section, replace the flagged lines and the "historical support" lines (§2) with one approval line. Keep every other line unchanged (S9). Target lines:

| ADR | Approval line |
|---|---|
| 0001 | `- Approved by the owner on 2026-09-04 and 2026-09-06; history in git.` (L161 stays) |
| 0002 | `- Approved by the owner on 2026-09-04, 2026-09-06, 2026-09-11, 2026-09-13, 2026-09-14 and 2026-09-27; history in git.` (L111 stays) |
| 0003 | `- Approved by the owner on 2026-09-04, 2026-09-06, 2026-09-11 and 2026-09-13; history in git.` (L92 stays) |
| 0004 | `- Approved by the owner on 2026-09-04 and 2026-09-06; history in git.` (L56 stays) |
| 0006 | `- Approved by the owner on 2026-08-12; history in git.` (L42–45 external sources stay) |
| 0007 | `- Approved by the owner on 2026-09-04 and 2026-09-06; history in git.` (L58 stays) |
| 0008 | `- Approved by the owner on 2026-08-12; history in git.` (L42 stays) |
| 0009 | `- Approved by the owner on 2026-09-04 and 2026-09-06; history in git.` |

- **0006 Human authority L49.** Drop the design id and "the exact executor plan revision above", keeping the meaning: the owner approved the papercut design and its executor plan, which select the local boundaries; external sources are advisory only.
- **0010 "Authority and evidence" L59.** One paragraph, in meaning: "Approved by the owner on 2026-09-18 and 2026-09-27; history in git." The current contract is the linked [production cutover specification](../../.agents/artifacts/archive/2026-09-27_reconcile-retrace-acp-production-spec.md) and its [implementation plan](../../.agents/plans/archive/2026-09-27-0134_reconcile-retrace-acp-production.md). The original decision is the linked [replacement lifecycle plugin specification](../../.agents/artifacts/archive/2026-09-18_replacement-lifecycle-plugin-spec.md). Keep the last sentence (archived files keep their pre-archive citations and are not edited), without "spec-v3". All three links stay.
- **0010 Verification expectations L67.** "(spec-v3 A3)" becomes a reference to A3 of the linked production specification, without a revision id. A5 and A7 stay. The rest of the paragraph is unchanged.
- **Headers.** Set `**Updated:**` to the change date in each edited ADR that has that line (0001–0004, 0007–0009). Add none to 0006 or 0010.
- **D21 (ADR-0002).** Rewrite the block in place under the same heading:
  - Replace L61, L62, L64 and L65 with host-neutral Decision bullets that keep every host-neutral decision in §2. One bullet says native return collection (capability gates, wait and delivery observation, launch and follow-up binding, and their stops) follows the host's return adapter; on OMP that is a relative link `../../.config/agents/harnesses/omp/agent-return.md`.
  - Keep L63, L66 and L67 verbatim.
  - Delete the Consequences bullet (L70). Its two host-neutral decisions move into a Decision bullet.
  - Keep Why (L68), Rejected alternatives (L69) and Reopen when (L71) verbatim.
  - Name no OMP tool, field, receipt value, job kind, error text or the acp controller (S4 token list). The word "OMP" may appear only to name the adapter.
- ADR-0005 is not edited.

**T2 — INDEX (items 11 and 6).**

- Delete "Decision discovery" (L20–44), "Current generic execution map" (L58–81) and "Current evidence baseline" (L91–103).
- Keep the intro, the record table, "Authority and precedence" and "Supersession discipline" byte-identical. The one exception: the ADR-0002 row's scope cell becomes host-neutral (e.g. "exact candidate admission through the host return adapter" instead of the OMP wake-job and token wording), matching the new D21. Its link, status and Decision IDs stay.
- The result is about 35–40 lines. That is an expectation, not acceptance.

**Invariants.**

- No ADR gains, loses or moves a decision definition. Each ID is defined in exactly one ACTIVE ADR. The index lists the same IDs (S2).
- Outside the authority/evidence sections, D21, ADR-0010's verification paragraph and `Updated` lines, every ADR is byte-identical (S8).
- Every non-stale line in those sections survives (S9).
- Every mechanic removed from D21 already exists in the adapter (§2 table). The adapter is unchanged (AC-13).

**Errors and stops.** If a D21 clause is neither host-neutral nor held by the adapter, stop and report it; never copy it into the adapter. Stop if a removed INDEX row states a decision its named ADR lacks.

## 5. Effects, migration, rollback and compatibility

- Allowed effects: edits to exactly the S7 allowlist: the nine ADRs, owned by T1, and `INDEX.md`, owned by T2. No live link repair is needed outside `docs/adr` (§2), so none is allowed.
- No deletions of files, no new files, no renames: every ADR path stays, so external path references keep working.
- No git staging, commits or pushes; no network; no omp-update live runs (no Reconcile or Retrace text changes).
- Clean cutover: no "formerly" notes or compatibility text. Rollback is the owner's call through git from `45e9e50`.

## 6. Acceptance

Run every command from the repository root. `Sn` means: extract §6.1 block `Sn` to `/tmp/b3/Sn.py` and run `python3 /tmp/b3/Sn.py` with the argument shown, if any. Extraction rule: a block is every line after the ```` ```python ```` line that follows the bare label line `Sn`, up to (not including) the first line that is exactly ```` ``` ````. No block contains such a line; backticks inside a block are single characters, never a fence. §6.1 lists each extracted file's SHA-256 so extraction can be checked with `shasum -a 256 /tmp/b3/*.py`. `LIVE` is the §2 pathspec; substitute it literally. A task runs every AC it owns at its boundary. Every AC stays true after later tasks, so the verifier runs the complete set once on the final target.

**AC-1** — T1
Behavior: No ADR file carries a `local://` citation, a 64-hex hash, "SHA-256", a revision id or the "Current governing authority" line.
Check: `S1 adr`; expect `ok`.

**AC-2** — T1, T2
Behavior: Every decision ID keeps its defining ADR, is defined in exactly one ACTIVE ADR, and the index lists the same IDs per ADR.
Check: `S2`; expect `ok`.

**AC-3** — T2
Behavior: INDEX has exactly the record table, precedence and supersession sections; the table links every ADR file with unchanged statuses and rows (ADR-0002's scope cell excepted, now host-neutral); precedence and supersession are byte-identical.
Check: `S3`; expect `ok`.

**AC-4** — T1
Behavior: D21 links the OMP adapter, keeps its host-neutral decisions and the Why / Rejected alternatives / Reopen when format without Consequences, and restates no OMP mechanics.
Check: `S4`; expect `ok`.

**AC-5** — T1
Behavior: Each ADR that lost a stale citation carries an "Approved by the owner on <date>…; history in git." line.
Check: `S5`; expect `ok`.

**AC-6** — T1, T2
Behavior: Every relative link in `docs/adr`, and every live Markdown link into `docs/adr`, resolves, including `#anchors`.
Check: `S6`; expect `ok`.

**AC-7** — T1, T2
Behavior: Only the ten batch-3 files (the nine ADRs and `INDEX.md`) differ from the baseline in `.config/agents`, `docs` and the two AGENTS files. Which task edits which of them is the plan's target ownership (§8), enforced by the controller.
Check: `S7`; expect `ok`.

**AC-8** — T1, T2
Behavior: Outside the authority/evidence sections, D21, ADR-0010's verification paragraph and `Updated` lines, every ADR is byte-identical to the baseline.
Check: `S8`; expect `ok`.

**AC-9** — T1
Behavior: Every baseline line in those sections that carries no stale citation and no "historical support" qualifier is still present.
Check: `S9`; expect `ok`.

**AC-10** — T2
Behavior: No live file names a removed INDEX section.
Check: `git grep --untracked -n -I -E 'Decision discovery|Current generic execution map|Current evidence baseline' -- LIVE; echo "exit=$?"`; expect only `exit=1`.

**AC-11** — T1, T2
Behavior: The dev-ask evals, including `R-T5-CANONICAL-DISCOVERY`, are intact.
Check: `git status --porcelain -- .config/agents/skills/dev-ask/evals; git diff --name-only 45e9e50 -- .config/agents/skills/dev-ask/evals`; expect empty output.

**AC-12** — guard; T1, T2
Behavior: Every Reconcile/Retrace prompt marker and pulled heading appears exactly once.
Check: `python3 -c "import re;R='.config/agents/skills/';c={R+'reconcile/references/reviewer-protocol.md':(['initial','rethink','later','source','reask','dispute'],['Reviewer role and authority','Review-turn packet','Complete response contract','Review passes and yield return']),R+'retrace/SKILL.md':(['evaluate','continue','reask','normalize'],['Finding eligibility','Evidence boundary','Method','Readiness','Result','Normalize and approve'])};bad=[(f,x) for f,(m,h) in c.items() for t in [open(f).read()] for x in ['<!-- prompt:%s -->'%k for k in m]+h if (t.count(x) if x.startswith('<!--') else len(re.findall(r'(?m)^#+ '+re.escape(x)+r'[ \t]*$',t)))!=1];print(bad or 'ok')"`; expect `ok`.

**AC-13** — guard; T1, T2
Behavior: The guarded paths and the D21 pointer target are unchanged against the baseline and the working tree.
Check: `P=".config/agents/skills/reconcile .config/agents/skills/retrace .config/agents/skills/rethink .config/agents/skills/omp-update .config/agents/references/packed-label.md .config/agents/harnesses/omp/acp-controller .config/agents/harnesses/omp/agent-return.md"; git status --porcelain -- $P; git diff --name-only 45e9e50 -- $P`; expect empty output.

**AC-14** — guard; T2
Behavior: The acp-controller preflight, reconcile and retrace suites pass.
Check: `npm test` with cwd `.config/agents/harnesses/omp/acp-controller`, in the foreground with a timeout of at least 300 s; expect `fail 0` and exit 0.

**AC-15** — guard; T1, T2
Behavior: The real protocol and Retrace prompt files still load offline.
Check: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles >/dev/null; echo $?`; expect `0`.

**AC-16** — T2
Behavior: The plan validator suite still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; expect `OK` and exit 0.

**AC-17** — T2
Behavior: The plan-sync extension suite still passes.
Check: `bun test` with cwd `.config/agents/harnesses/omp/extensions`; expect `0 fail` and exit 0.

**AC-18** — T2
Behavior: The papercut ledger suite, which cites an ADR-0007 path, still passes.
Check: `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py`; expect `OK` and exit 0.

**AC-19** — T2
Behavior: `INDEX.md` carries no `local://` citation, 64-hex hash, "SHA-256", revision id or "Current governing authority" line.
Check: `S1 index`; expect `ok`.

**Why each AC sits where it does.**

- AC-1 covers the ADRs and belongs to T1, which alone edits them. AC-19 covers INDEX and belongs to T2, because INDEX keeps its evidence baseline until T2.
- AC-7 uses the union allowlist so it holds at T1, at T2 and on the final target. A per-task allowlist for T1 would be false on the final target.
- AC-2 runs in T1 as well as T2: T1 can break a definition, and T2 can break the index's ID column.
- AC-3 and AC-10 concern only INDEX, so they belong to T2. INDEX sections stay in place during T1, so no T1 AC depends on them.
- AC-1, AC-4, AC-5 and AC-9 concern only ADR files, which T2 does not touch.
- AC-14 and AC-16…18 run once, at T2: no task edits a file those suites load. AC-12, AC-13 and AC-15 give cheap per-task guard evidence.

### 6.1 Check scripts

Copy each block verbatim under the §6 extraction rule. Each file holds the block's lines joined with newlines, plus one final newline. The `local:/{2}` pattern avoids the literal scheme string, which some harnesses expand in commands. Expected `shasum -a 256` of the extracted files:

| File | SHA-256 |
|---|---|
| `S1.py` | `7fd50b06f1c2d7ac6d8a8b699830c22d056a28b44b4b4d6d0a860a530c9ccc96` |
| `S2.py` | `f66d1feccc98d50114b8875be81b220851890f686faa1504476c676b9af85aa7` |
| `S3.py` | `36db9f29dd9881e984d57b750c9f3e95917a4f4ecf03ab0528530a5527c1707a` |
| `S4.py` | `4f0f09b507432a37e5e50f5afd70f12f09bb9253e0e5f5d2389c43363f27f89d` |
| `S5.py` | `5994da1876df66e0a1e828b7638e0267bd313d9fdb56cc03f366466ac7363ed3` |
| `S6.py` | `a8371b8973c866b91312803c42a2da01ba405eb60688f501182ffb85e81c9a39` |
| `S7.py` | `808bff4876d4b9123d21e94e256c82c104442baa25aab4ba7e59b3a53ffbe303` |
| `S8.py` | `36af618a6e27f43eebd7c8420295ca31ee70c0cf98905a6e52650602c9c6e62f` |
| `S9.py` | `d71f46991628b9d0b68cf42f86c86408d87cf51881f37fbfe798fa299e73d4f4` |

S1
```python
# S1 (AC-1 adr, AC-19 index): no stale authority citations remain
import glob,re,sys
R=re.compile(r'local:/{2}|\b[0-9a-fA-F]{64}\b|SHA-256|\b[\w.-]+/v\d+(?:\.\d+)*\b|\bspec-v\d+\b|\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-r\d+\b|Current governing authority')
bad=[(f,i) for f in sorted(glob.glob('docs/adr/*.md')) if f.endswith('INDEX.md')==(sys.argv[1]=='index') for i,l in enumerate(open(f,encoding='utf-8'),1) if R.search(l)]
print(bad or 'ok')
```

S2
```python
# S2 (AC-2): every decision ID keeps its one defining ADR; the index lists the same IDs
import glob,re,subprocess
B='45e9e50'
def defs(t):return re.findall(r'(?m)^(?:#{2,4} |\d+\. \*\*)([DP]\d\d)\b',t)
def base(f):return subprocess.run(['git','show',B+':'+f],capture_output=True,text=True).stdout
fs=sorted(subprocess.run(['git','ls-tree','--name-only',B,'docs/adr/'],capture_output=True,text=True).stdout.split())
fs=[f for f in fs if re.search(r'/\d{4}-',f)]
bad=[f for f in fs if defs(open(f,encoding='utf-8').read())!=defs(base(f))]
act={}
for f in fs:
    t=open(f,encoding='utf-8').read()
    if re.search(r'(?m)^\*\*Status:\*\* ACTIVE',t):
        for d in defs(t):act.setdefault(d,[]).append(f)
bad+=[d for d,v in act.items() if len(v)!=1]
def ex(c):
    o=[]
    for p in re.split(r',\s*',c.replace('(historical)','').strip()):
        m=re.match(r'([DP])(\d+)\s*[–-]\s*[DP]?(\d+)$',p.strip())
        o+=['%s%02d'%(m[1],n) for n in range(int(m[2]),int(m[3])+1)] if m else [p.strip()]
    return o
rows=[l for l in open('docs/adr/INDEX.md',encoding='utf-8') if re.match(r'\| \[ADR-\d{4}',l)]
for r in rows:
    c=[x.strip() for x in r.strip().strip('|').split('|')];f='docs/adr/'+re.search(r'\((\d{4}-[^)]+)\)',c[0])[1]
    if sorted(ex(c[-1]))!=sorted(set(defs(open(f,encoding='utf-8').read()))):bad.append(('index',f))
print(bad or 'ok')
```

S3
```python
# S3 (AC-3): INDEX keeps the record table, precedence and supersession; drops the three cut sections
import glob,re,subprocess
I='docs/adr/INDEX.md';t=open(I,encoding='utf-8').read()
b=subprocess.run(['git','show','45e9e50:'+I],capture_output=True,text=True).stdout
sec=lambda s,h:(re.search(r'(?ms)^## '+re.escape(h)+r'\n.*?(?=^## |\Z)',s) or [None])[0]
heads=re.findall(r'(?m)^## (.+?)\s*$',t)
files={f[9:] for f in glob.glob('docs/adr/0*.md')}
linked=set(re.findall(r'\]\((\d{4}-[^)#]+\.md)\)',sec(t,'Current records') or ''))
st=lambda s:[(m[0],m[1].strip()) for m in re.findall(r'(?m)^\| \[(ADR-\d{4})[^|]*\]\([^)]*\) \| ([^|]+)\|',s)]
c={'sections':heads==['Current records','Authority and precedence','Supersession discipline'],
'records_list_every_adr':linked==files,
'statuses_unchanged':st(t)==st(b),
'precedence_unchanged':sec(t,'Authority and precedence')==sec(b,'Authority and precedence'),
'supersession_unchanged':sec(t,'Supersession discipline')==sec(b,'Supersession discipline')}
rw=lambda s:[l for l in s.splitlines() if l.startswith('| [ADR-') and not l.startswith('| [ADR-0002')]
c['other_rows_unchanged']=rw(t)==rw(b)
row=[l for l in t.splitlines() if l.startswith('| [ADR-0002')]
c['adr0002_row_host_neutral']=len(row)==1 and not re.search(r'OMP|wake.job|token/message',row[0])
print('ok' if all(c.values()) else [k for k,v in c.items() if not v])
```

S4
```python
# S4 (AC-4): D21 links the OMP adapter, keeps its host-neutral decisions and ADR format, and restates no OMP mechanics
import os,re
A='docs/adr/0002-executor-plans-and-orchestration.md';t=open(A,encoding='utf-8').read()
m=re.search(r'(?ms)^### D21\b.*?(?=^#{2,3} |\Z)',t);d=m[0] if m else ''
tgt=os.path.normpath('.config/agents/harnesses/omp/agent-return.md')
links=[os.path.normpath(os.path.join('docs/adr',u.split('#')[0])) for u in re.findall(r'\]\(([^)\s]+)\)',d)]
M=r'taskDepth|wakeRelay|receipts|agentUrlId|Result submitted|No running background|agent:/{2}|details\.|wake.job|\bwoken\b|\binjected\b|\brevived\b|native `?wait|acp-controller|acpx|same-turn|busy|\{"response"'
c={'links_adapter':tgt in links and os.path.isfile(tgt),
'no_mechanics':not re.search(M,d),
'keeps':all(k in d for k in ['transport-unavailable','test-value.md','recovery-rethink.md','execution-recovery.md','**Why:**','**Rejected alternatives:**','**Reopen when:**']),
'format':'**Consequences:**' not in d}
print('ok' if all(c.values()) else [k for k,v in c.items() if not v])
```

S5
```python
# S5 (AC-5): each ADR whose stale citation was cut carries the approval line
import re
F=['0001-dev-workflow-authority-and-routing','0002-executor-plans-and-orchestration','0003-bounded-assurance-and-repair','0004-canonical-discovery-and-continual-learning','0006-generic-papercut-evidence','0007-automated-papercut-lifecycle-and-lean-evidence','0008-repository-agent-integration-setup','0009-session-lifecycle-envelope-and-portable-learning','0010-replacement-lifecycle-plugin']
R=r'Approved by the owner on 20\d\d-\d\d-\d\d[^\n]*?history in git\.'
print([f for f in F if not re.search(R,open('docs/adr/%s.md'%f,encoding='utf-8').read())] or 'ok')
```

S6
```python
# S6 (AC-6): every relative link in docs/adr, and every live Markdown link into docs/adr, resolves, #anchors included
import os,re,subprocess
L=['.config/agents','docs/adr','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md']
fs=[f for f in subprocess.run(['git','ls-files','-co','--exclude-standard','--']+L,capture_output=True,text=True).stdout.split() if f.endswith('.md') and os.path.exists(f) and not f.endswith('impl-rethink/MAINTENANCE.md')]
def slug(h):
    h=re.sub(r'[`*_]','',h.strip().lower());h=re.sub(r'[^\w\- ]','',h);return h.replace(' ','-')
heads=lambda p:{slug(m) for m in re.findall(r'(?m)^#{1,6} +(.+?) *$',open(p,encoding='utf-8').read())}
bad=[]
for f in fs:
    for u in re.findall(r'\]\(([^)\s]+)\)',open(f,encoding='utf-8').read()):
        if re.match(r'[a-z]+:',u):continue
        p,_,a=u.partition('#');g=os.path.normpath(os.path.join(os.path.dirname(f),p)) if p else f
        if not (f.startswith('docs/adr/') or g.startswith('docs/adr')):continue
        if not os.path.exists(g) or (a and os.path.isfile(g) and slug(a) not in heads(g)):bad.append((f,u))
print(bad or 'ok')
```

S7
```python
# S7 (AC-7): only the ten batch-3 files differ from the baseline
import subprocess
ok={'docs/adr/%s.md'%x for x in ['0001-dev-workflow-authority-and-routing','0002-executor-plans-and-orchestration','0003-bounded-assurance-and-repair','0004-canonical-discovery-and-continual-learning','0006-generic-papercut-evidence','0007-automated-papercut-lifecycle-and-lean-evidence','0008-repository-agent-integration-setup','0009-session-lifecycle-envelope-and-portable-learning','0010-replacement-lifecycle-plugin','INDEX']}
g=lambda *a:subprocess.run(['git',*a],capture_output=True,text=True).stdout.split('\n')
P=['.config/agents','docs','.agents/AGENTS.md','.agents/GENERIC-AGENTS.md']
ch={l for l in g('diff','--name-only','45e9e50','--',*P)+g('ls-files','--others','--exclude-standard','--',*P) if l}
print(sorted(ch-ok) or 'ok')
```

S8
```python
# S8 (AC-8): outside the authority/evidence text and D21, every ADR is byte-identical to the baseline
import glob,re,subprocess
X={'Evidence / source revisions','Human authority','Authority and evidence'}
def parts(t,f):
    s=re.split(r'(?m)^(?=## )',t);h=re.sub(r'(?m)^\*\*Updated:\*\*.*\n','',s[0]);o={'':h}
    for p in s[1:]:
        k=p.split('\n',1)[0][3:].strip()
        if k in X or (f.endswith('0010-replacement-lifecycle-plugin.md') and k=='Verification expectations'):continue
        if f.endswith('0002-executor-plans-and-orchestration.md') and k=='Decisions':p=re.sub(r'(?ms)^### D21\b.*?(?=^### |\Z)','',p)
        o[k]=p
    return o
bad=[]
for f in sorted(glob.glob('docs/adr/0*.md')):
    b=subprocess.run(['git','show','45e9e50:'+f],capture_output=True,text=True).stdout
    c,o=parts(open(f,encoding='utf-8').read(),f),parts(b,f)
    bad+=[(f[9:13],k) for k in set(c)|set(o) if c.get(k)!=o.get(k)]
print(sorted(bad) or 'ok')
```

S9
```python
# S9 (AC-9): in the edited authority/evidence sections, every baseline line without a stale citation survives
import glob,re,subprocess
R=re.compile(r'local:/{2}|\b[0-9a-fA-F]{64}\b|SHA-256|\b[\w.-]+/v\d+(?:\.\d+)*\b|\bspec-v\d+\b|\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-r\d+\b|Current governing authority|historical support')
X=r'(?ms)^## (?:Evidence / source revisions|Human authority|Authority and evidence|Verification expectations)\n.*?(?=^## |\Z)'
bad=[]
for f in sorted(glob.glob('docs/adr/0*.md')):
    b=subprocess.run(['git','show','45e9e50:'+f],capture_output=True,text=True).stdout
    now=open(f,encoding='utf-8').read().splitlines()
    bad+=[(f[9:13],l[:60]) for s in re.findall(X,b) for l in s.splitlines() if l.strip() and not R.search(l) and l not in now]
print(bad or 'ok')
```

## 7. Test seams

- This batch changes Markdown only. The behavior is structural: stale citations absent, decision definitions and retained text byte-stable, links resolving, one adapter pointer. The checks are static scripts plus the existing suites at the seams that could notice: the prompt loader (AC-14/15), the plan validator, plan-sync and the papercut ledger (which names an ADR path).
- Content preservation is guarded three ways: byte-identity outside the edited sections (AC-8), line survival inside them (AC-9), and stable ID definitions (AC-2). Review confirms clause by clause that each removed D21 clause is either kept host-neutrally or held by the adapter (§2 table), and that each removed INDEX row pointed only to decisions its ADR still states. Static checks cannot prove that.
- S4's token list names OMP mechanics, not new wording. The kept tokens are file names and the ADR-format labels, which survive paraphrase.
- The approval line is pinned only to "Approved by the owner on <date>" and "history in git", the proposal's approved wording. Dates are not pinned by any check.
- No line or word target: "about 35 lines" is the proposal's estimate.
- Permanent tests: none added or changed. This is a one-time documentation cleanup with no new consumer-visible contract. The closest existing coverage is the dev-ask discovery eval (unchanged, AC-11) and the papercut ledger suite (AC-18).
- [INFERENCE] Agent discovery behavior is unchanged: the discovery eval's facts stay in the record table and ADR-0004. No live run proves it; none is in scope.

## 8. Implementation boundaries and dependencies

A lean plan with two serial tasks:

| Task | Owns | Depends on | Acceptance |
|---|---|---|---|
| **T1 — ADR citations and D21** (item 6 for ADRs; D21) | ADRs 0001, 0002, 0003, 0004, 0006, 0007, 0008, 0009, 0010 | — | AC-1, AC-2, AC-4…9, AC-11…13, AC-15 |
| **T2 — INDEX trim** (item 11; item 6 for INDEX) | `docs/adr/INDEX.md` | T1 (the ADR-0002 row summarizes the new D21; AC-2 cross-checks the ADRs) | AC-2, AC-3, AC-6…8, AC-10…19 |

**Sizing rationale.**

- T1 is nine small, same-pattern evidence edits plus one careful D21 rewrite. The rewrite needs the 439-line adapter in context to confirm each removed mechanic. That fits one fresh context. Splitting D21 from the citation sweep would put two tasks on `0002` with no independently checkable gain.
- T2 is one file of deletions plus one table cell. It is kept separate because it is a different item with its own acceptance, and its row cell depends on T1's D21 wording.
- Serial order follows that dependency. Each task's ACs concern only files it or an earlier task finished.
- This matches the route's expected shape (T1 items 6 + D21; T2 INDEX after T1).

## 9. Risks, assumptions, stops and open decisions

**Assumptions.**

- *A2 line.* "My A2 citation" is ADR-0002 L109, the `local://archive-direct-contract.md` line added by `1f44a60`. It is the only ADR-0002 evidence line with a session-file citation added by the proposal's author, and it goes with the rest of item 6.
- *Superseded ADR-0006 is edited.* INDEX says "preserve superseded records; do not rewrite them to resemble current runtime". Item 6 names ADRs 0001–0010, and cutting an unresolvable citation does not make the record resemble runtime. Its decision, scope and supersession text stay byte-identical (AC-8).
- *Dates.* Every date comes from repository text. The lean-workflow dates are ADR-0001 L159 (2026-09-04, 2026-09-06) and INDEX L93/L101 (the 2026-09-06 projection of ADRs 0001–0004, 0007 and 0009); the others are in the cited evidence lines. For ADR-0010: 2026-09-18 is its `**Date:**`, when it was already bound to the owner-approved original spec (L59). 2026-09-27 is when the approved production plan ran (archived plan header: Datetime `2026-09-27-0134`, `Completed At` `2026-09-27-1356`, authority spec-v3), with cutover commit `d42f7c5` the same day.
- *"Historical support" lines are dropped.* They only qualify the removed revisions; "history in git" replaces them.
- *ADR-0002 row cell.* The item-11 "keep the record table" is read as keeping its structure and data. Its ADR-0002 scope cell loses OMP wording so it agrees with the new D21, under the same ADR-format point.
- *D21 Consequences removed.* The approved ADR format lists decision, reason, rejected alternatives and reopen when. D21 is being edited, so its Consequences bullet goes and its two host-neutral decisions move into a Decision bullet.

**Risks.**

- *D21 rewrite drops a host-neutral decision.* This is the main risk. §2 lists them and review checks each one; S4 checks only anchors.
- *S4 blocks a legitimate word* (e.g. "busy" in a host-neutral sentence). Rephrase; the list names OMP mechanics.
- *npm test takes about 3 minutes.* Run it in the foreground with an explicit timeout.

**Stops.**

- Any guard check fails (AC-12…15).
- A D21 clause is neither host-neutral nor held by the adapter.
- A removed INDEX row names a decision its ADR lacks.
- Any change would touch a path outside the S7 allowlist or git state.

**Open decisions for the owner.** None blocks this batch; nothing here needs a new human-owned decision. The assumptions above are visible for review.

## 10. Revision and next owner

- Revision: `agent-skills-lean-down-batch3/spec-v1`, after one plan-rethink pass. That pass made one bounded correction to proof and wording choices:
  - AC-1 is limited to the ADRs (`S1 adr`). The new AC-19 (`S1 index`, T2) covers INDEX.
  - AC-7 uses a union allowlist (`S7`, no argument), so the verifier's final-target run is true; per-task file ownership stays with the plan.
  - ADR-0010's dates are grounded in its `Date` header and the archived plan header, not inferred.
  - §6 states an exact block-extraction rule and each script's SHA-256.

  Boundaries, effects, assurance and inherited acceptance are unchanged.
- Next owner: `dev-ticketing`, to project T1 → T2 into a lean plan. After that: `dev-implementation`, then review, verification and learning, at standard assurance. No live runs.
- Route impact: unchanged.
