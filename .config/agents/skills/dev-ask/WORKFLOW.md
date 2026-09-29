# Engineering Flow

This is the short, non-runtime human map of the generic engineering flow. It
runs no work, stores no state, and wins no conflict: executable skills and
rules are authoritative, and any mismatch with this map is an edit-time defect
to fix here.

## Common routes

A request takes the smallest route that settles its outcome:

- sufficient current evidence → direct answer;
- one bounded factual gap → `dev-research`, then back to `dev-ask`;
- raw issue or pull-request intake → `dev-triage`;
- incomplete behavior, acceptance, scope, or constraints → `dev-requirements`;
- a candidate plan, hypothesis, or design to refine → `dev-grilling`, reading
  repository evidence when it bears on the decision;
- a hard unexplained defect or regression → `dev-diagnosing-bugs`;
- missing durable technical authority → `dev-specification`; complete
  authority that still needs a dependency graph → `dev-ticketing`;
- settled authority, a known fix, or an approved graph → `dev-implementation`;
- genuine multi-session decision fog → `wayfinder`.

## Flow

1. **Route** — `dev-ask` classifies the request, presents the Route Overview,
   and starts only the first owner after approval.
2. **Prerequisites** — only when missing: requirements, specification,
   ticketing, research, or diagnosis, each by its own skill.
3. **Implement** — `dev-implementation` controls the work; each code-changing
   task belongs to a child that returns a lean Handoff.
4. **Assure** — `dev-code-review`, `dev-verification`, and
   `dev-continual-learning`, per `dev-implementation` Assurance for the
   approved level.
5. **Finish** — `papercut` runs per the papercut scheduling rule, then
   `completion-presentation` renders the terminal result.

## Separate routes

- `dev-test-audit` is an explicit, read-only permanent-test audit; its audit
  protocol owns the loop.
- `dev-shipping` handles separately authorized commit, push, deploy, or
  release.
- Custom controllers such as `reconcile` and `retrace` own their own
  contracts.

## Decisions

Durable decisions, their IDs, and supersession links live in
[`docs/adr/INDEX.md`](../../../../docs/adr/INDEX.md).

## Maintenance

Change the owning skill or rule first, then this map and the ADR index, in one
change.
