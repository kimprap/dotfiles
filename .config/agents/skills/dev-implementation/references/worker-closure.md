# Worker closure v1

`worker-closure/v1` is identified by the SHA-256 digest of this file. This reference owns the only exact round-one and round-two prompt text. Other skills, rules, ADRs, plans, evals, receipts, and Handoffs reference this file and digest; they must not copy either prompt.

## Applicability and control

Run closure after a semantic work owner has a candidate and before changed-test settlement, task-local smoke, or the one Common Handoff. It applies to exactly these work shapes:

1. a planless same-context semantic owner;
2. each plan-backed task child;
3. an eligible fresh-child attempt-two owner; and
4. each admitted Build-repair worker.

It does not apply to a mechanical plan root, neutral integration, verification, final review, continual learning, an audit controller, or an audit opinion.

The candidate is nonterminal. The controlling implementation owner records the same child or semantic owner, task, attempt, unchanged Task Contract, candidate target, and this reference digest, then uses native same-child control. Round one is mandatory. Round two runs only when round one made at least one actual admitted correction. The same owner performs every check and correction; a new child, parent review, copied prompt, or summarized prompt is not equivalent. There is no third round.

## Exact round-one prompt

```text
WORKER-CLOSURE ROUND ONE — worker-closure/v1

Continue in this same semantic owner with the unchanged Task Contract, authority, owned acceptance and proof recipes, target/effect boundary, child or owner identity, task identity, and attempt identity. Treat the current candidate as nonterminal. Challenge only this candidate and its changed surfaces/callers; do not scan unrelated or untouched portfolio surfaces.

Run one combined round over all of these obligations:
1. correctness: directly observable behavior and every changed contract/caller remain correct;
2. preservation: protected contracts, declared non-goals, compatibility, safety, accessibility, and unrelated user work remain preserved;
3. effects: every repository, runtime, external, and delivery effect stays inside the declared effect boundary;
4. owned acceptance: every owned criterion and its task-local proof/smoke obligation is completely implemented;
5. solution discipline: reconsider the candidate against the first sufficient ladder—reuse current code, then the standard library, then the native platform, then an installed dependency, then minimum new code—and identify any candidate-local structural regression;
6. permanent tests: apply the bound unchanged test-value/v1 only to every permanent test changed by this attempt, assigning an exact keep, merge, or remove disposition, or, when no permanent test changed, record the closest existing coverage and concrete no-new-contract basis. Do not inspect untouched portfolio tests.

Classify and admit findings in this order:
- A directly evidenced correctness, preservation, declared-effect, or owned-acceptance violation is a contract finding. Admit and repair it even when the smallest correct in-boundary repair adds code or complexity. A smaller or earlier-rung replacement is not an admission gate. If current authority cannot repair it, keep it as an explicit non-success blocker.
- A simplification, structural, or permanent-test quality proposal is a quality finding only when it names the exact surface, concrete defect, exact earlier-rung or smaller replacement or exact test disposition, and preservation proof. Apply the correction only when all fields are present. Otherwise record no quality correction; do not turn the proposal into a correctness blocker.

Assign stable finding IDs WC1-F1, WC1-F2, and so on in discovery order. Repair every admitted finding now within the existing target/effect boundary and record its evidence, classification, correction or no-correction decision, disposition, and preservation proof. Do not redesign authority, broaden scope, add or reassign a task or criterion, inspect another child transcript, run task smoke or an assurance role, emit the Common Handoff, or request another round.

Respond to the controlling implementation owner with a bounded round-one receipt naming the unchanged owner/child, task, attempt, contract, candidate-before, and worker-closure reference identities; every finding ID and required row above; the changed-test rows or concrete no-new-contract basis; whether any actual admitted correction occurred; the candidate-after identity; and every remaining blocker. Do not run round two unless the controlling owner sends the exact round-two prompt.
```

## Exact round-two prompt

```text
WORKER-CLOSURE ROUND TWO — worker-closure/v1

Continue in this same semantic owner with the unchanged Task Contract, authority, owned acceptance and proof recipes, target/effect boundary, child or owner identity, task identity, attempt identity, worker-closure reference identity, and accepted round-one receipt. Round one made at least one actual admitted correction.

Check only each corrected round-one finding and regressions plausibly caused by those corrections. Recheck the correction's behavior, preservation proof, declared effects, affected owned acceptance/smoke obligations, solution-ladder claim, candidate-local structure, and changed permanent-test disposition or no-new-contract basis as applicable. Do not reopen unaffected candidate work, scan untouched portfolio tests, or broaden the contract.

Use the same admission boundary: directly evidenced correctness, preservation, effect, or owned-acceptance violations are admitted regardless of added complexity; a quality correction requires the exact surface, concrete defect, exact earlier-rung or smaller replacement or exact test disposition, and preservation proof. Assign stable finding IDs WC2-F1, WC2-F2, and so on in discovery order. Repair every admitted round-two finding now within the existing target/effect boundary and record its evidence, classification, correction or no-correction decision, disposition, and preservation proof. If current authority cannot repair a contract finding, keep it as an explicit non-success blocker.

Do not redesign authority, add or reassign a task or criterion, inspect another child transcript, run task smoke or an assurance role, emit a second result envelope, request a third round, or reopen unaffected candidate work. Respond with a bounded round-two receipt naming the unchanged owner/child, task, attempt, contract, round-one, candidate-before, and worker-closure reference identities; every round-two finding row; final changed-test rows or concrete no-new-contract basis; the candidate-after identity; and every remaining blocker. No third round exists even when round two makes a correction.
```

## Close the attempt

After round one reports no actual admitted correction, or after the permitted round two completes, the same semantic owner:

1. Confirms that no admitted contract finding remains. Any remaining contract finding makes the attempt non-success and stays visible. An unqualified quality proposal remains a recorded no-quality-correction decision, not a correctness blocker.
2. Applies [`test-value.md`](test-value.md) to every permanent test changed by the final candidate and settles each row as `keep`, `merge`, or `remove` before smoke. When no permanent test changed, records the closest existing coverage and concrete no-new-contract basis. Comparison artifacts and closure receipts are not permanent tests; untouched portfolio tests are not read.
3. Runs task-local smoke against every owned acceptance criterion, every corrected finding, and every plausible correction-caused regression surface. Closure reasoning or a passing broad suite does not substitute for this smoke.
4. Emits exactly one existing Common Handoff. In its worker delta, records `worker-closure/v1`, this file's exact digest, round count, the same owner/child, task, and attempt identities, candidate-before and final target identities, all finding IDs, corrections and dispositions, changed-test rows or no-new-contract basis, final smoke evidence, and any remaining blocker. It references the prompts by file, section, and digest without reproducing their text.
5. Stops semantic work. The post-Handoff papercut soft look follows as state-neutral accounting and does not create another Handoff or closure round.

The controlling implementation owner checks these identities and fields mechanically. It does not reinterpret findings, conduct another challenge, or decide semantic sufficiency.
