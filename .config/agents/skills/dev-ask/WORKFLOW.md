# Engineering Flow

## Purpose

The engineering flow accepts an ordinary engineering request with current authority and evidence, a human-approved product brief or PRD, or a bounded non-product objective. It carries that input through the smallest safe lifecycle to a verified, reviewed, locally complete outcome while remaining provider-neutral.

Product strategy and product authority remain outside this flow. Missing product authority returns to its human owner rather than being inferred by an engineering module.

## Interface

[`dev-ask`](SKILL.md) is the external seam. An engineering request plus current authority and evidence enter; one seven-field Route Overview, exact approval, and dispatch to exactly one first owner leave. Its current skill defines the field schema and classification procedure.

Drift in authority, target, route, constraints, or required capabilities invalidates approval and requires a refreshed Route Overview. Missing authority or acceptance, stale evidence, unsafe effects, and unavailable non-equivalent capabilities stop at the owner of the missing contract.

## Lifecycle

`classify → approve → establish authority or requirements → specify and ticket when needed → implement and smoke → verify → integrate when needed → review → curate → complete → separately authorize shipping`

Settled inputs may skip a stage whose entry contract is already satisfied. Authority, approval, freshness, safety, immutable-target evidence, and capability gates cannot be skipped.

## Module ownership

| Seam | Modules and ownership |
|---|---|
| Entry and authority | [`dev-ask`](SKILL.md) owns entry and routing; [`dev-requirements`](../dev-requirements/SKILL.md) owns observable engineering requirements; [`dev-research`](../dev-research/SKILL.md) owns bounded factual evidence. |
| Durable planning | [`dev-specification`](../dev-specification/SKILL.md) owns the revision-bound technical contract; [`dev-ticketing`](../dev-ticketing/SKILL.md) owns the approved acyclic work graph. |
| Execution and transfer | [`dev-implementation`](../dev-implementation/SKILL.md) owns execution topology, attempts, smoke, and completion accounting; [`dev-handoff`](../dev-handoff/SKILL.md) owns the common transfer contract. |
| Proof and fan-in | [`dev-verification`](../dev-verification/SKILL.md) owns fresh acceptance proof; [`dev-integration`](../dev-integration/SKILL.md) owns neutral all-lineage fan-in; [`dev-code-review`](../dev-code-review/SKILL.md) owns final read-only review. |
| Terminal assessment and delivery | [`dev-continual-learning`](../dev-continual-learning/SKILL.md) owns terminal learning assessment; [`dev-shipping`](../dev-shipping/SKILL.md) owns separately authorized delivery. |
| Conditional engineering support | [`dev-grilling`](../dev-grilling/SKILL.md), [`dev-domain-modeling`](../dev-domain-modeling/SKILL.md), [`dev-diagnosing-bugs`](../dev-diagnosing-bugs/SKILL.md), [`dev-prototype`](../dev-prototype/SKILL.md), [`dev-codebase-design`](../dev-codebase-design/SKILL.md), [`dev-improve-codebase-architecture`](../dev-improve-codebase-architecture/SKILL.md), and [`dev-tdd`](../dev-tdd/SKILL.md) own their reusable decision, modeling, diagnosis, prototyping, design, survey, and test-first disciplines. |

## Durable contracts

- **Route Overview** — [`dev-ask`](SKILL.md) owns the approved route boundary.
- **Engineering Requirements** — [`dev-requirements`](../dev-requirements/SKILL.md) owns observable build authority.
- **Engineering Specification** — [`dev-specification`](../dev-specification/SKILL.md) owns durable technical authority.
- **Ticket graph** — [`dev-ticketing`](../dev-ticketing/SKILL.md) owns dependency and acceptance structure.
- **Task Contract and Context Pack** — [`dev-implementation`](../dev-implementation/SKILL.md) owns immutable attempt input.
- **Handoff** — [`dev-handoff`](../dev-handoff/SKILL.md) owns one common result contract per attempt.
- **Verification and integration evidence** — [`dev-verification`](../dev-verification/SKILL.md) owns criterion-level proof; [`dev-integration`](../dev-integration/SKILL.md) owns neutral fan-in evidence when applicable.
- **Final review** — [`dev-code-review`](../dev-code-review/SKILL.md) owns the standards and specification judgment.
- **Terminal evidence** — [`dev-implementation`](../dev-implementation/SKILL.md) owns completion accounting, [`dev-continual-learning`](../dev-continual-learning/SKILL.md) owns terminal assessment, and [`dev-ask`](SKILL.md) owns completion presentation.
- **Shipping evidence** — [`dev-shipping`](../dev-shipping/SKILL.md) owns evidence for separately authorized delivery.

## Invariants

- Humans retain product, architecture, material-scope, and destructive authority.
- The router is thin and stateless, and it dispatches exactly one first owner.
- One deepest module owns each procedure; other modules link to that owner.
- Every attempt consumes current immutable authority and produces one Handoff.
- Workers smoke their changes, fresh verifiers prove acceptance, neutral integration combines every required lineage, and reviewers never repair.
- Local completion never authorizes shipping.
- An unavailable capability uses an equivalent disclosed fallback or stops.
- The user-level `/Users/kim/.agents/AGENTS.md` remains human-owned.

## Maintenance

Change this file only when the workflow interface, lifecycle, ownership seams, durable contracts, or invariants change.

Exclude run status, calendar timestamps, digests, plan or evidence links, provider and adapter snapshots, exact skill totals, migration history, source and license ledgers, evaluation repetitions, and release evidence.
