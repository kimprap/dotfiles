---
name: dev-prototype
description: Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Choose the decision shape

Identify the exact question and the lifecycle owner that needs its answer:

- **"Does this logic / state model feel right?"** → read [LOGIC.md](LOGIC.md) and build the smallest interactive logic artifact that exposes the uncertain transitions.
- **"What should this look like?"** → read [UI.md](UI.md) and build materially different visible variants that expose the uncertain interaction or layout.

If the question is ambiguous, return it to the requesting `dev-requirements`, `dev-grilling`, or `dev-specification` owner. Do not prototype around an unresolved product or architecture decision.

## Rules that apply to both

1. **Use an approved disposable task.** The Task Contract names the question, allowed artifact surface, isolation requirement, target identity, and disposal or preservation rule. The adapter chooses the mechanism; this skill prescribes no version-control or provider transport.
2. **Keep production unchanged.** Build only inside the approved disposable artifact. Never fold, promote, or copy a winner into real code.
3. **Make it runnable.** Provide the smallest repeatable launch path supported by the disposable environment.
4. **Avoid incidental systems.** Keep state in memory unless persistence itself is the question; use only clearly disposable data.
5. **Skip production polish.** Add only enough error handling and structure to answer the decision safely.
6. **Expose the evidence.** Surface relevant state, variants, inputs, and observations so the verdict can be checked.
7. **Stop when the question is answered.** Additional implementation belongs to a newly approved implementation contract.

## Decision-evidence return

Return:

- the exact question and requesting owner;
- the observed verdict and evidence, including rejected variants or transitions;
- the immutable artifact identity and location;
- the required disposal or preservation action, expressed without transport assumptions;
- explicit uncertainty and decisions still owned by a human or lifecycle stage; and
- the next owner: `dev-requirements`, `dev-grilling`, or `dev-specification`.

The prototype is decision evidence only. It is not a production implementation, accepted test seam, shipping artifact, or completion claim. Never fold it into production, prescribe a branch, or perform the downstream change.
