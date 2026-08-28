# Test audit protocol v1

`test-audit/v1` is identified by the SHA-256 digest of this file. It defines exact-target intake, the read-only opinion receipt, deterministic evidence aggregation, and the audit extension to the existing Common Handoff. It is not a cleanup request, a second completion envelope, an implementation task, an assurance gate, or a scheduler.

## Frozen audit tuple

Before dispatch, bind one tuple:

- evidence locator for the explicit user or external-scheduler request;
- an exact target locator and identity for either a content-addressed working-tree manifest or commit;
- one complete repository-suite boundary, or one complete named-subsystem boundary with the subsystem's stable name;
- permanent-suite manifest locator/digest, discovery rule/boundary, ordered stable selectors, content identities, and selector-set digest;
- optional completed-plan or parent-outcome provenance identity, with authority `none`;
- `test-value/v1` URI/digest;
- this protocol URI/digest;
- portable opinion-prompt URI/digest;
- exact controller-supplied role-table URI/digest and one native binding attestation for each logical opinion; and
- the allowed Common Handoff receiver.

The target is exact only when it is a commit or the working-tree manifest content-addresses the complete declared target. The suite manifest is complete only when its discovery boundary accounts for every permanent test in the declared repository or named-subsystem scope and every manifest row has one stable selector and current content identity. A named subsystem excludes repository tests outside its declared boundary but must enumerate every permanent test inside it. Generated artifacts, temporary comparison data, audit data, and non-permanent tracer tests stay outside the suite only when the bound discovery rule excludes them explicitly. Changed-tests-only, incomplete, stale, moving, or contradictory target/suite intake is ineligible and returns `blocked` before either opinion dispatch. Completed-plan provenance is optional and contributes no authority.

The two opinions receive the same frozen target, suite, policy, protocol, prompt, role-table, and request-provenance identities; each receives only its own controller-supplied binding attestation and no other opinion output.

## Opinion receipt

Each opinion returns one native child artifact whose controller-facing projection contains only:

```text
outcome: completed | transport-unavailable
opinion: A | B
attestation: exact agent and logical role; fresh child identity; role-table identity; native binding identity; requested and resolved model; reasoning; capability/tool boundary; isolation; fallback none; target identity; suite identity; policy identity; protocol identity
coverage: manifest row count; ledger row count; selector-set digest; disposition counts; duplicate or omitted selectors
ledger: native artifact locator; SHA-256 digest
candidate index: one bounded entry for every non-keep ledger row
transport mismatches: exact expected and observed values
```

A completed receipt requires every attestation field to match the frozen tuple and controller-supplied binding, zero duplicate or omitted selectors, equal manifest/ledger counts, equal selector-set digests, and disposition counts that sum to the manifest count. A mismatch returns `transport-unavailable`; the child does not continue and the controller does not substitute another role. Transport failure changes only this explicit audit.

The complete ledger remains behind its native locator. It contains exactly one row per manifest selector:

```text
row identity and stable selector
source path and current test identity
observable contract, regression, or invariant, or concrete absent/unknown evidence
closest existing coverage and whether it subsumes the row
stable public seam
independent oracle
one plausible bug the test uniquely catches, or concrete absent/unknown evidence
disposition: keep | merge | remove | unknown
evidence references and uncertainty
merge/remove destination when applicable
row digest
```

Apply `test-value/v1` in order. Do not reward path uniqueness, implementation details, snapshots, coverage, production-coupled oracles, or another opinion's claim. `unknown` is required when available evidence cannot support a value decision.

The bounded candidate index is not a partial ledger. It contains every non-`keep` selector exactly once and only: selector; proposed disposition; a concise bounded projection of the observable value or concrete absence evidence, closest coverage comparison, stable seam, oracle, plausible bug or absence evidence, and uncertainty; merge/remove destination when present; ledger row digest; native row locator; and concise evidence locators. These fields let the controller validate the originating recommendation without fetching its full row. Receipt counts and the selector-set digest prove complete coverage while full `keep` rows and unbounded analysis stay out of controller context.

## Controller admission

Reject the pair as `transport-unavailable` when either receipt is missing, mismatched, fallback-backed, not read-only, not exact-model/exact-reasoning, not fresh, fails its supplied binding attestation, or shares a child identity. Never accept a single opinion, sequential self-opinions from one child, a copied ledger, or a substitute role or model.

For an admitted pair:

1. Union the candidate-index selectors without changing order: opinion A index order first, then previously unseen opinion B selectors.
2. For each A candidate fetch only B's exact counterpart ledger row; for each B-only candidate fetch only A's exact counterpart row. Verify every row digest and selector against its opinion ledger receipt. Do not fetch unrelated `keep` rows or either full ledger.
3. Validate each recommendation independently against `test-value/v1`. A recommendation with a missing contract/value basis, closest-coverage comparison, stable seam, independent oracle, plausible bug, or concrete absence evidence is unsupported.
4. Aggregate by evidence, never by vote:
   - `remove` only when both independent supported rows recommend removal and prove the same test is tautological, duplicate, or subsumed without losing an observable contract; a subsumption claim names the retained selector.
   - `merge` only when both independent supported rows recommend merge, identify the same compatible retained destination, and preserve every unique observable contract.
   - `keep` when both supported rows keep, or when one supported keep row proves unique observable value and the opposing non-keep row is unsupported.
   - `unknown` for supported disagreement, different non-keep destinations/dispositions, missing counterpart evidence, any source `unknown`, only one supported non-keep recommendation, or any unresolved uncertainty.
5. Preserve every unsupported or `unknown` case. Aggregate `remove` and `merge` are read-only recommendations, not mutation authority.

Recommendation count, confidence adjectives, model reputation, test length, file age, coverage percentage, and implementation similarity alone never decide a row.

## Stability and result

After counterpart reads, rehash the exact target, suite manifest, selector set, and policy. Any drift yields a non-mutating blocked Common Handoff naming the changed identity; do not publish stale candidates. When exact, emit one existing Common Handoff extended with:

```markdown
## Test audit
- Protocol identity: test-audit/v1 URI and digest
- Frozen target, suite, selector-set, and policy identities; evidence prose states explicit user or external-scheduler provenance, target kind, repository-complete or named-subsystem repository-partial scope, and optional completed-plan/parent-outcome provenance with authority none
- Opinion A: exact binding attestation, child identity, receipt locator/digest, ledger locator/digest, coverage proof
- Opinion B: exact binding attestation, child identity, receipt locator/digest, ledger locator/digest, coverage proof
- Pair admission and distinct-identity result
- Candidate union order and exact counterpart rows fetched
- Aggregate selector → keep | merge | remove | unknown → evidence rule → opinion row references
- Unsupported and unknown selectors preserved
- Pre/post identity equality and repository no-mutation evidence
- Audit outcome: completed | transport-unavailable | blocked; evidence prose labels named-subsystem results partial relative to the repository
- Cleanup authority: none
```

The Handoff references native artifacts instead of copying ledgers. `transport-unavailable` names every expected/observed binding mismatch and any unstarted or cancelled counterpart. `blocked` names the exact ineligible, incomplete, stale, or moving non-transport field and records opinion dispatch count zero when preflight fails. Neither outcome changes implementation, assurance, repair, review, learning, completion, plan, or suite state. No audit role runs worker closure.
