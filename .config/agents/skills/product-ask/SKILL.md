---
name: product-ask
description: >
  Route product-development work through product decision refinement, PRD creation or revision,
  and handoff of approved product authority to engineering. Use for product ideas, product
  strategy choices, PRD work, or an explicit Product Route Overview. Skip marketing execution,
  technical design, code implementation, and settled read-only answers unless routing is requested.
---

# Product Development Flow

Be the one thin, stateless interface for the product-development workflow. Own route selection, one compact route approval, one first dispatch, material reapproval, and completion presentation. Do not conduct the interview, write a PRD, persist iteration state, make product decisions, or perform engineering work.

## Authority and evidence

Use only current evidence from:

- explicit human product-owner decisions;
- the exact current approved PRD artifacts relevant to the request;
- the current product iteration and candidate identities;
- the latest valid Product Handoff;
- cited product, customer, market, operational, legal, and repository evidence.

Precedence is current explicit human authority → exact relevant approved PRD revisions → confirmed current iteration evidence → Product Handoff → other evidence. A draft, candidate, index, transcript, prototype, plan, or Handoff is not approved product authority.

## Classify in order

1. **Direct answer** — answer a bounded read-only product question when current evidence is sufficient. Do not start a workflow for explanation alone.
2. **Decision refinement** — route a product idea, strategy, hypothesis, candidate experience, scope choice, priority, metric, rollout, positioning, pricing, or business-model choice to `product-grilling` when the user asks to develop, challenge, compare, or decide it.
3. **PRD creation or revision** — route to `product-prd` when confirmed product authority is complete enough to draft. If load-bearing product choices remain open, use `product-grilling → product-prd`.
4. **Iteration continuation** — resume the exact current iteration from its target PRD or `new`, baseline revision, confirmed decisions, candidate identity, and open frontier. Do not restart discovery or overwrite an approved PRD revision.
5. **Engineering handoff** — a direct engineering request with one or more exact human-approved PRDs and no blocking product decisions routes through `product-prd → dev-ask` so `product-prd` can validate and emit the Product Handoff. If that exact current Product Handoff already exists, route directly to `dev-ask`. Engineering derives observable requirements and technical design; this workflow does not.
6. **Missing evidence** — stop when a product decision depends on unavailable customer, market, legal, financial, operational, or experimental evidence. Do not replace evidence with an interview or model judgment.
7. **Out of scope** — marketing execution remains with its workflow or human owner. Engineering requirements, architecture, implementation, verification, shipping, and delivery route to `dev-ask` only when current approved product authority and its Product Handoff exist; otherwise return the exact missing product prerequisite.

A user-named product stage is a strong preference, not a prerequisite bypass. Ask one gating question only when its answer changes the first owner. Otherwise choose the smallest route that can produce approved product authority.

## Route outcomes

Choose only from:

- direct read-only answer;
- `product-grilling`;
- `product-prd`;
- `product-grilling → product-prd`;
- `product-prd → dev-ask`;
- `dev-ask` from an already current approved PRD and Product Handoff;
- `PRODUCT EVIDENCE REQUIRED`;
- a stop for missing human product authority, stale iteration state, or conflicting approved product authority.

## Compact route approval

Before an interview or artifact mutation, present exactly:

```markdown
## Goal
  <one product outcome>

## Route
  <exact ordered product skill route and `dev-ask` only when handoff is requested>

## Plan
  <one or two sentences covering the decision frontier, durable artifacts, and approval point>

## Safety
  <product authority, preservation, external research/effect, and engineering/shipping limits>

## Approval
  Reply **approve** to start.
```

The route approval authorizes the named process and artifact locations. It does not approve product decisions, a candidate PRD, engineering work, external research, experiments, publication, or shipping.

Reapprove only when the product objective, target users, material scope, route, canonical artifact location, external effects, or engineering-handoff intent changes. New interview rounds, candidate revisions, and an unchanged iteration frontier do not create route approvals.

## Dispatch, iterations, and Handoffs

After route approval, invoke exactly one first owner. `product-grilling` and `product-prd` each return one Product Handoff with exact artifact identities, `route-impact: unchanged|changed`, and one receiver.
A complete papercut Learning Candidate may accompany current product work only as non-product evidence. Bind its one immutable originating `PC-ID` alongside the approved route and preserve it unchanged through every Product Handoff; an incomplete or mismatched candidate remains evidence-only. This does not add a product stage, route approval, product decision, PRD field, or publication authority. Product leaf owners never access the papercut ledger.

Each product iteration targets one existing PRD identity and revision or `new`; it may reference other PRDs as dependencies. A new round does not create a new iteration. A candidate revision does not replace an approved PRD revision. Promotion requires explicit human approval of the exact candidate revision and digest, proposed identity and destination, and every publication effect.

When route impact is unchanged, continue to the next owner already named by the approved route. Recompute and request reapproval only for a material route fact above. Never keep a router-owned iteration ledger.
After the current product-workflow owner returns an explicit candidate-specific papercut outcome to `product-ask`, `product-ask` is the sole settlement owner: validate the unchanged originating `PC-ID` and invoke the portable `papercut` settlement procedure once for terminal `fixed | rejected | superseded`. Product leaf owners never invoke settlement.

Papercut evidence remains `non-product-evidence`; ordinary leaf completion causes no settlement call, and papercut processing leaves existing product authority and the product result unchanged. `completed`, interview confirmation, PRD approval/publication, P07 approval, a broad product result, `paused | blocked | abandoned | authority-change-required`, incomplete evidence, or an unrelated result is `open` and performs no settlement call.

Narrow authority is disclosed report-only/open without a helper call. A helper failure after one attempted procedure is report-only/open, performs no successful settlement or retry, and does not change the product result. Never infer product authority from papercut evidence or settle an unrelated ID.

## Evidence stop

Return:

```text
PRODUCT EVIDENCE REQUIRED
Decision blocked: <specific product decision>
Missing evidence: <customer, market, legal, financial, operational, or experimental evidence>
Current safe evidence: <artifact and source identities>
Next owner: <human product owner or future evidence-producing workflow>
Resume condition: <specific evidence or confirmed decision>
```

## Completion

Present only:

```markdown
## Route
  <completed route>

## Result
  <confirmed decisions, approved PRD, or exact stop>

## Artifacts
  <current iteration and PRD identities>

## Next
  <one required next action or receiver>
```

Omit `Next` when no action remains. Do not imply engineering completion, delivery, or publication.
When papercut evidence accompanied the route, include its unchanged originating `PC-ID` and exact settled or open/report-only result under `Artifacts`; do not add another completion section.

Read [WORKFLOW.md](WORKFLOW.md) only when maintaining, auditing, or extending the complete product-development flow.
