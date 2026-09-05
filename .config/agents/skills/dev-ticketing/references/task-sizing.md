# Task sizing

Use this read-only guidance when choosing a new implementation-task boundary. Reading it does not invoke `dev-ticketing`, add a lifecycle stage, or create runtime state.

## Size a complete attempt

1. Start from the actual outcome, acceptance, targets and effects, dependencies, and receiver. Do not size from file count or a preferred solution shape.
2. Make a best-effort estimate for one complete fresh-worker attempt: necessary reading and context acquisition, reasoning, editing, the one same-child code-then-test rethink and any permitted correction, every direct check and changed-path smoke, and the lean Handoff. Aim for approximately 200k tokens. Do not pad a task with independent route-level review, verification, or learning.
3. Separately decide whether the bounded working set can fit one reliable fresh context. The estimate is a rough planning aid, not evidence of context fit, a quota, a runtime cutoff, a billable-token meter, or a promise that different workers will produce identical estimates.
4. Prefer cohesive, independently checkable behavior slices at real ownership and dependency seams. Smaller cohesive tasks are valid. When the whole attempt is unlikely to fit, use safe subdivision; an overall atomic cutover may still be implemented by dependency-ordered tasks.
5. Keep coupled work together when splitting would create artificial scaffolding, an unsafe intermediate state, or no independently checkable behavior, provided one owner can reliably complete it in a fresh context. Crossing the rough target alone does not force a split or change assurance.
6. If the work cannot fit one fresh context, use known safe ownership or dependency seams and durable recovery where needed. If no safe seam is known, return through the existing design, authority, or recovery path; do not invent a scaffold or claim that the task fits.

## Record only the decision

Briefly explain a material boundary choice in prose the owning artifact already has: the Route Overview's `Plan`, a specification's implementation-ownership discussion, a direct contract, or an appropriate existing plan field. Do not add a numeric estimate, range, status, section, schema field, validator rule, grader, telemetry, ledger, runtime counter, quota, cutoff, or active skill.

Sizing is independent of assurance and does not itself require specification, ticketing, or Wayfinder. Use `dev-specification` only when technical authority is missing and `dev-ticketing` only when necessary task or dependency ownership is missing. Reuse a complete specification or graph rather than regenerating it to demonstrate sizing.

Apply this guidance while authoring new boundaries. An implementation controller projects an approved graph exactly and does not split, merge, or otherwise repartition it from a later estimate alone. Any real change to approved ownership, dependencies, scope, acceptance, effects, or context-fit assumptions follows the existing authority and reapproval rules.
