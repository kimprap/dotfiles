---
name: retrace
description: >
  Evaluate the current repository's agent-harness configuration against one human
  improvement objective, with optional execution and history evidence, by zooming out
  across discovery and zooming in to the causal instruction. Use only when explicitly
  invoked for this read-only evaluation; skip non-repository evaluands, mutation or
  implementation requests, and persistent state or result storage.
disable-model-invocation: true
---

# Retrace

Evaluate one bound repository harness without taking ownership of the change that may follow.

## Invocation contract

Fix one existing readable workspace or repository root before discovery; a validated session working directory may supply it. Bind one human improvement objective. When the explicit request is general harness refinement, keep that exact request as the objective rather than asking the human to narrow it.

On first read, bind any supplied expected-leaf locator as an evaluand locator, and bind any supplied execution record or transcript, handoff, plan, prior Retrace result, and implemented-fix locator by exact identity. Their absence never blocks static evaluation. Disclose evidence that is absent or unreadable and cap claims that depend on it.

Ask the whole current human-owned frontier in one round: the objective's intended meaning, protected behavior, exclusions, and remaining trade-offs. Iterate while any part remains missing, including constraints on a generic objective. Do not ask for repository facts that discovery can answer. Ask for later confirmation only when an answer changes the originally bound objective or protected behavior.

An invalid or unreadable root, or contradictory current authorities, produces the stable `blocker` disposition.

Treat an objective-linked instruction that conflicts with the bound human objective or protected behavior as a causal candidate, not as unresolved authority. Use the blocker only when mutually incompatible current authorities remain after applying the bound human choices.

## Evidence boundary

Use only the bound root and exact locators admitted by this boundary. Before every target-file operation, classify its exact locator immediately by pointing to locator text that appears verbatim in intake, an injected repository declaration, or already-read content, or to an existing active-harness conventional name while no declaration resolves. Start with repository-declared guidance and configuration entries. The conventional-candidate class is narrow, never materializes a candidate, and expires as soon as any declaration resolves. After declaration resolution, admit only the three verbatim sources and close discovery over exact files. A filename token, role, directory, prefix, suffix, locator pattern, or any combination of those hints cannot supply a locator. If no class applies, do not perform the operation; preserve the exact unresolved gap.

Classify each operation by causality before it runs. An evaluand operation can affect the bound repository evaluation; a supplied-evidence operation reads only an exact optional-evidence locator. Both classes remain inside the locator closure above. A runtime-control operation exists only when an independently injected higher-priority obligation requires it; path, name, content, or an operation's own label is never enough. Keep every runtime-control operation and its authority visible in the trace, but quarantine its contents from Retrace: they cannot admit or seed a target locator, role model, finding, evidence claim, readiness input, or direction. A runtime-control operation neither widens nor satisfies the evaluand closure; if its contents cross that boundary, do not return an evaluation result.

Build an objective-bound role model covering the guidance entry, setup and injection, maps and indexes, responsibility owners, leaf instructions, protected behavior, and exclusions. Classify authority as current or historical. An exact declared guidance path may be read inside a hidden directory, but do not list, glob, grep, or search that directory for state or prior results.

Read optional execution, history, candidate, cost, check, and implemented-fix evidence only at supplied locators. Treat an explicitly supplied broad-search candidate locator as supplied evidence: read that exact file exactly once before adjudicating its objective and directional linkage. Its contents cannot admit or seed a target locator, role graph or model, finding identity, readiness input, direction, or other discovery. Return exact locators and only the minimal redacted quotations needed for a claim. Do not search an ambient transcript corpus, history, memory, hidden state, prior-result collection, or ledger.

Historical contents cannot prove a current fact or normally admit a current locator. A single provisional-locator bridge applies only when a supplied history identity's normalized objective class exactly matches the current normalized objective class and the current declared walk ends at a missing edge: take only the exact root-relative leaf locator in that identity's evaluand, resolve it beneath the bound current root, and read that exact file as an evaluand. Bind the current owner, invariants, and evaluand only from that current file's contents and the current walk. Do not use the bridge for a different objective class, unsupplied history, an absent or unreadable current file, a directory or ambient search, or a locator outside that exact identity.

Within that closure, never target a directory path with a read, list, glob, grep, search, or other discovery operation, and do not probe a locator outside the closure. Direct reads of exact named files beneath directories remain allowed and are required for every objective-linked file bound by the closure.

## Method

1. Bind the root, objective, human-owned constraints, evidence identities, protected behavior, and exclusions. Stop discovery outside that scope.
2. Immediately before each file operation in this and later steps, classify it as evaluand, supplied evidence, or runtime control. For an evaluand or supplied-evidence operation, apply the evidence-boundary classification to its exact locator; an unclassified locator remains a named gap rather than an operation. For a runtime-control operation, require its independently injected higher-priority obligation and enforce the trace-visible quarantine above. Independently reconstruct the canonical owners and coverage a correct fresh run should load for the objective. Complete that reconstruction from current authority in both directions before reading a supplied execution locator or comparing its loaded coverage, and keep historical authority separate from current authority.
3. Walk from each declared entry toward required leaves and from each named required leaf back toward its harness entry. A bound expected-leaf locator names required expected coverage: after reading the entry, injection rule, and applicable map in successive waves, read that exact leaf even when the forward chain omits it, assess the leaf on its own terms, and reverse-trace its owner and harness link. Work in named-gap waves: resolve only the next objective-linked missing owner, map, injection edge, or instruction, then repeat until both directions close or an exact gap remains. Do not substitute one exhaustive search. For an explicitly supplied broad-search candidate, perform the required supplied-evidence read before adjudicating linkage; exclude it when it has no objective link or either directional trace, state the missing objective and directional linkage, and derive no finding identity, readiness input, or direction from it.
4. When execution evidence is bound, judge delivered-outcome validity against its acceptance evidence separately from harness quality. Then compare independently reconstructed expected coverage with loaded coverage. Repeated, redundant, or missing harness work may qualify as waste without invalidating a delivered outcome that is valid.
5. For each candidate finding, bind the objective impact, root cause, owner, evaluand, invariants, and one identity with exactly four parts: objective class, owner, root-cause class, and evaluand. Normalize objective class as `<stable scope qualifiers> <missing capability> coverage`: derive the stable scope qualifiers from the complete bound objective, retain every qualifier in its original order, form the missing capability from the desired postcondition that the objective lacks rather than copying the objective's activity head, and exclude symptom and recommendation wording. When that desired-state capability is nonempty without a generic activity head, omit the head so it cannot remain immediately before `coverage`; append `coverage` exactly once. Normative contrasts: `fresh-run` plus omitted `process-cost review` becomes `fresh-run process-cost coverage`, never `fresh run process-cost review coverage` or `fresh-run process-cost review coverage`; preserving all responsibilities and accepted outputs while eliminating duplicate owner resolution becomes `all-responsibilities and accepted-outputs preserving single owner coverage`, never `all-responsibilities and accepted-outputs preserving single owner resolution coverage`. For a directional discovery-chain gap, normalize the root-cause class to `discovery-chain omission` and the evaluand to the exact broken map-to-leaf edge written `<map locator> to <leaf locator>`; do not broaden either part to the whole role model. When either map or leaf locator is beneath the bound root, render it root-relative with portable `/` separators in the identity only and retain its full exact locator in the evidence fields. Keep current evidence and historical claims distinct.
6. If the walk exposes a new human-owned uncertainty, ask the whole current frontier together and iterate. Never turn a discoverable fact into a question.
7. Compare, in order, no change, reuse, the smallest extension, bounded validation, and redesign without favoring the incumbent. Count implementation, integration, migration, review, runtime, conflict, and ongoing ownership cost. Select one coherent direction. For every evaluated redesign candidate, determine and report separately whether it preserves the named responsibilities and invariants, names one adjacent check, and proves total cost lower than no change, reuse, the smallest extension, and bounded validation. Mark each gate `proved` or `absent`. If any gate is absent, reject redesign and name every absent gate as a rejection reason; unrelated objective linkage or directional coverage, generic cost, and generic scope cannot substitute for a gate verdict. Admit redesign only when all three gates are proved.
8. Before any proposal, normalize the current objective class and compare it with the objective class in each supplied four-part history identity. Apply the evidence boundary's provisional-locator bridge only after its predicates pass, then complete the current identity from current evidence and compare all four parts. The same identity with the gap proved gone is `no-change`. The same identity with the gap still present after a supplied promoted or implemented fix is `failed-fix`; explain exactly why that resolution missed. A different identity is `novel`. With no prior-result or implemented-fix locator, disclose `history unbound` and continue without a historical claim.

## Readiness

Readiness is cumulative completeness, never confidence or a score:

- **G1** binds a valid root and objective and cites evidence with current or historical classification.
- **G2** closes entry-to-leaf and leaf-to-harness coverage and independently reconstructs expected fresh-run coverage; when execution exists, it also binds loaded coverage.
- **G3** binds root cause, owner, evaluand, invariants, the four-part finding identity, and objective linkage.
- **G4** closes the solution ladder, rejected alternatives, total cost, validation or adjacent proof, canonical and route impact, and the required comparison with supplied history.

No G1 permits only `blocker`. G1 alone is `low`; G1 through G2 is `medium`; G1 through G3 is `mid-high`; G1 through G4 is `high`. The weakest unmet gate caps the label. At `low`, emit no proposal. At `medium`, only a `bounded-validation` proposal is permitted. At `mid-high` or `high`, a `refinement` proposal is permitted only when its ladder rung passes; redesign additionally requires its preservation, adjacent-check, and winning-total-cost gates. A proved `no-change` is not a proposal and remains governed by the history comparison.

## Result

Before returning the result, inspect every section and render every claim-bearing repository-file reference, not only an evidence citation, as its full exact locator resolved against the bound root, or preserve its full URI and selector. Only the evaluand field inside a four-part identity may render a beneath-root locator root-relative; every other repository-file name, shorthand, or root-relative reference blocks return until fully rendered.

Return these Markdown sections in this exact order, omitting only `Outcome Validity` when no execution evidence is bound:

1. `## Bound Intake and Scope Model` — root, objective, bound or absent evidence, human-owned constraints, role model, protected behavior, and exclusions.
2. `## Outcome Validity` — delivered acceptance judgment and its evidence, kept separate from harness quality.
3. `## Historical and Current Harness Coverage` — current and historical authority, expected fresh-run coverage, both directional walks, loaded-coverage comparison when applicable, history branch, and excluded issues.
4. `## Qualified Findings` — each finding's four-part identity, readiness, root cause, owner, evaluand, invariants, objective impact, full exact evidence locators resolved against the bound root with schemes and selectors preserved, and minimal redacted quotations.
5. `## Refinement Direction, No Change, or Blocker` — exactly one disposition: `proposal`, `no-change`, or `blocker`. A proposal has subtype `refinement` or `bounded-validation` and obeys the readiness cap. State the one direction, five-rung solution ladder, rejected alternatives, total cost, and required validation. For every evaluated redesign candidate, report separate `proved` or `absent` verdicts for named-responsibility-and-invariant preservation, one adjacent check, and total cost lower than each smaller rung; when redesign is rejected, include every absent gate among its rejection reasons. For a blocker, state the exact resume condition.
6. `## Canonical Impact and Transfer` — canonical and route impact, owners to reopen, and the caller-owned next transfer.

Keep the direction coherent across sections. Do not emit a native handoff.

## Stops

Bare non-repository URLs, documents, and service traces are ineligible evaluands. Missing optional evidence limits claims but does not stop static evaluation; contradictory current authority does.

Remain a read-only lens. Do not mutate repository or external state; dispatch work; approve a decision; author a plan; implement or repair a change; own a handoff, route, or lifecycle state; run automatically; probe hidden state; mine broad history; or create a store, ledger, index, result artifact, or other persistent evaluator state. Stop above planning and leave every handoff, plan, mutation, route action, and delivery effect to the caller and its existing owners.
