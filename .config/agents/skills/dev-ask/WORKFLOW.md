# Engineering Flow

## Purpose

The engineering flow accepts an ordinary engineering request with current authority and evidence, a human-approved product brief or PRD, or a bounded non-product objective. It carries that input through the smallest safe lifecycle to a verified, reviewed, locally complete outcome while remaining provider-neutral.

Product strategy and product authority remain outside this flow. Missing product authority returns to its human owner rather than being inferred by an engineering module.

## Interface

[`dev-ask`](SKILL.md) is the external seam. An engineering request plus current authority and evidence enter; every invocation produces one seven-field Route Overview. A direct read-only answer leaves with that overview in the same response. Executable or routed work leaves only after exact approval and dispatch to exactly one first owner. Its current skill defines the field schema and classification procedure.

Drift in authority, target, route, constraints, or required capabilities invalidates executable-route approval and requires a refreshed Route Overview. Missing authority or acceptance, stale evidence, unsafe effects, and unavailable non-equivalent capabilities stop at the owner of the missing contract.

## Lifecycle

`classify → select assurance → approve executable work → establish authority or requirements → specify and ticket when needed → implement and smoke → verify → integrate when needed → review → curate when required or triggered → complete → separately authorize shipping`

Settled inputs may skip a stage whose entry contract is already satisfied. Authority, approval, freshness, safety, immutable-target evidence, and capability gates cannot be skipped.

## Module ownership

| Seam | Modules and ownership |
|---|---|
| Entry and authority | [`dev-ask`](SKILL.md) owns entry and routing; [`dev-requirements`](../dev-requirements/SKILL.md) owns observable engineering requirements; [`dev-research`](../dev-research/SKILL.md) owns bounded factual evidence. |
| Durable planning | [`dev-specification`](../dev-specification/SKILL.md) owns the revision-bound technical contract; [`dev-ticketing`](../dev-ticketing/SKILL.md) owns the approved acyclic work graph. |
| Execution and transfer | [`dev-implementation`](../dev-implementation/SKILL.md) owns execution topology, attempts, smoke, and completion accounting; [`dev-handoff`](../dev-handoff/SKILL.md) owns the common transfer contract. |
| Proof and fan-in | [`dev-verification`](../dev-verification/SKILL.md) owns fresh acceptance proof; [`dev-integration`](../dev-integration/SKILL.md) owns neutral all-lineage fan-in; [`dev-code-review`](../dev-code-review/SKILL.md) owns final read-only review. |
| Terminal assessment and delivery | [`dev-continual-learning`](../dev-continual-learning/SKILL.md) owns terminal learning assessment when the assurance profile requires or triggers it; [`dev-shipping`](../dev-shipping/SKILL.md) owns separately authorized delivery. |
| Conditional engineering support | [`dev-grilling`](../dev-grilling/SKILL.md), [`dev-domain-modeling`](../dev-domain-modeling/SKILL.md), [`dev-diagnosing-bugs`](../dev-diagnosing-bugs/SKILL.md), [`dev-prototype`](../dev-prototype/SKILL.md), [`dev-codebase-design`](../dev-codebase-design/SKILL.md), [`dev-improve-codebase-architecture`](../dev-improve-codebase-architecture/SKILL.md), and [`dev-tdd`](../dev-tdd/SKILL.md) own their reusable decision, modeling, diagnosis, prototyping, design, survey, and test-first disciplines. |

## Durable contracts

- **Route Overview** — [`dev-ask`](SKILL.md) owns the approved route boundary and its assurance profile.
- **Engineering Requirements** — [`dev-requirements`](../dev-requirements/SKILL.md) owns observable build authority.
- **Engineering Specification** — [`dev-specification`](../dev-specification/SKILL.md) owns durable technical authority.
- **Ticket graph** — [`dev-ticketing`](../dev-ticketing/SKILL.md) owns dependency and acceptance structure.
- **Task Contract and Context Pack** — [`dev-implementation`](../dev-implementation/SKILL.md) owns immutable attempt input, including immutable assurance.
- **Handoff** — [`dev-handoff`](../dev-handoff/SKILL.md) owns one common result contract per attempt.
- **Verification and integration evidence** — [`dev-verification`](../dev-verification/SKILL.md) owns criterion-level proof; [`dev-integration`](../dev-integration/SKILL.md) owns neutral fan-in evidence when applicable.
- **Final review** — [`dev-code-review`](../dev-code-review/SKILL.md) owns the standards and specification judgment.
- **Terminal evidence** — [`dev-implementation`](../dev-implementation/SKILL.md) owns completion accounting; [`dev-continual-learning`](../dev-continual-learning/SKILL.md) owns required or triggered terminal assessment; and [`dev-ask`](SKILL.md) owns completion presentation.
- **Shipping evidence** — [`dev-shipping`](../dev-shipping/SKILL.md) owns evidence for separately authorized delivery.

## Invariants

- Humans retain product, architecture, material-scope, and destructive authority.
- The router is thin and stateless, is the sole current external seam, and dispatches exactly one first owner.
- One deepest module owns each procedure; other modules link to that owner.
- Every attempt consumes current immutable authority and produces one Handoff.
- Workers smoke their changes, fresh verifiers prove acceptance, neutral integration combines every required lineage, and reviewers never repair.
- Lifecycle depth and execution topology remain independent from immutable assurance.
- Curation follows the immutable assurance profile: required for standard and high-consequence work, and trigger-driven for compact work.
- Local completion never authorizes shipping.
- An unavailable capability uses an equivalent disclosed fallback or stops.
- The user-level `/Users/kim/.agents/AGENTS.md` remains human-owned.

## Temporary specialty-flow seam

This is a temporary, non-executable boundary until specialty contracts exist. The engineering flow remains the single horizontal lifecycle. Future explicit `frontend-ask`, `backend-ask`, and `infra-ask` entrypoints may own vertical interviewing or discovery and capture human-approved, revision-bound specialty authority or evidence. Each returns that approved artifact—or the common Handoff only when its existing Task Contract and receiver requirements are satisfied—to `dev-ask` for reclassification and continuation.

For frontend work, interviewing and optional UI-prototype evidence may produce a human-approved Frontend Experience Brief. The main flow then owns requirements, specification and tickets when needed, implementation, frontend-aware verification, review, and completion. Specialty flows must not duplicate those authorities, execution state, orchestration, integration, shipping, or define a second router ledger, baton, or state machine. Add executable specialty routes only when their intake, approved-output, and return contracts exist.


## Maintenance

Change this file only when the workflow interface, lifecycle, ownership seams, durable contracts, or invariants change.

Exclude run status, calendar timestamps, digests, plan or evidence links, provider and adapter snapshots, exact skill totals, migration history, source and license ledgers, evaluation repetitions, and release evidence.
