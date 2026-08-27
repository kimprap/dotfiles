# Worker closure v1

`worker-closure/v1` is identified by the SHA-256 digest of this file. This reference owns the only exact round-one and round-two prompt text. Other skills, rules, ADRs, plans, evals, receipts, and Handoffs reference this file and digest; they must not copy either prompt.

## Applicability and control

Run closure after a work attempt or admitted Build repair has a candidate and before task-local smoke or the one Common Handoff. It applies to attempt one, an eligible fresh-child attempt two, and each repair admitted by the one run-wide post-assurance token. It does not apply to verification, neutral integration, review, continual learning, an audit controller, or an audit opinion.

The candidate is nonterminal. The root records the child, task, attempt, unchanged Task Contract, candidate target, and this reference digest, then uses native same-child control. Round one is mandatory. Round two runs only when round one caused at least one contract-relevant correction. The same child performs every check and correction; a new child, parent review, copied prompt, or summarized prompt is not equivalent. There is no third round.

## Exact round-one prompt

```text
WORKER-CLOSURE ROUND ONE — worker-closure/v1

Continue in this same child with the unchanged Task Contract, authority, owned acceptance and proof recipes, target/effect boundary, child identity, and attempt identity. Treat the current candidate as nonterminal. Challenge the candidate only against that unchanged contract. Identify every concrete contract-relevant omission, incorrect behavior, preservation failure, undeclared effect, unsupported permanent-test decision, or missing task-local smoke obligation. Assign stable finding IDs WC1-F1, WC1-F2, and so on in discovery order. Repair every concrete finding now within the existing target/effect boundary, and record each correction and disposition. Do not redesign authority, broaden scope, add or reassign a task or criterion, inspect another child transcript, run an assurance role, or emit the Common Handoff. If a finding cannot be repaired under the unchanged contract, leave it explicit and stop completion rather than weakening it. Respond to the root with a bounded round-one receipt naming the unchanged child, task, attempt, contract, candidate-before, and reference identities; every finding ID with its evidence, correction, and disposition; whether any contract-relevant correction occurred; the candidate-after identity; and every remaining finding. Do not run round two unless the root sends the exact round-two prompt.
```

## Exact round-two prompt

```text
WORKER-CLOSURE ROUND TWO — worker-closure/v1

Continue in this same child with the unchanged Task Contract, authority, owned acceptance and proof recipes, target/effect boundary, child identity, attempt identity, worker-closure reference identity, and accepted round-one receipt. Round one caused a contract-relevant correction. Check only the corrected round-one findings and regressions plausibly caused by those corrections; do not reopen unaffected candidate work or broaden the contract. Assign stable finding IDs WC2-F1, WC2-F2, and so on in discovery order. Repair every concrete round-two finding now within the existing target/effect boundary, and record each correction and disposition. Do not redesign authority, add or reassign a task or criterion, inspect another child transcript, run an assurance role, request a third round, or emit a second result envelope. If a finding cannot be repaired under the unchanged contract, leave it explicit and stop completion rather than weakening it. Respond to the root with a bounded round-two receipt naming the unchanged child, task, attempt, contract, round-one, candidate-before, and reference identities; every round-two finding ID with its evidence, correction, and disposition; the candidate-after identity; and every remaining finding.
```

## Close the attempt

After round one reports no contract-relevant correction, or after the permitted round two completes, the same child:

1. Confirms that no concrete closure finding remains. Any remaining finding makes the attempt non-success and stays visible in its Common Handoff.
2. Runs task-local smoke against every owned acceptance criterion, every corrected finding, and every correction-caused regression surface. Closure reasoning or a passing broad suite does not substitute for this smoke.
3. Applies [`test-value.md`](test-value.md) to every changed permanent test. Retain, merge, or remove tests before sealing the result; comparison artifacts and closure receipts are not permanent tests.
4. Emits exactly one existing Common Handoff. In its worker delta, record `worker-closure/v1`, this file's exact digest, round count, the same child/task/attempt identities, candidate-before and final target identities, all finding IDs, corrections and dispositions, final smoke evidence, and any remaining blocker. Reference the prompts by file, section, and digest without reproducing their text.
5. Stops semantic work. The post-Handoff papercut soft look follows as state-neutral accounting and does not create another Handoff or closure round.

The root checks these identities and fields mechanically. It does not reinterpret findings, conduct another challenge, or decide semantic sufficiency.
