# Repository agent memory canonical-artifact integration

**Datetime**: 2026-08-14-1038
**Authority kind**: direct-repository
**Scope**: Comprehensive design re-evaluation of repository agent memory against canonical artifact ownership and lifecycle seams
**Summary**: Re-evaluate a residual memory model, bounded loading, and canonical workflow integration, then deliver an implementation-grade handoff without implementing or activating memory.
**Status**: PENDING

## Objective

Produce one evidence-backed design decision and implementation-grade handoff for repository agent memory. The re-evaluation must preserve canonical-owner precedence, keep durable state in plain Markdown/Git, and define bounded recall without creating a hidden retrieval service. Progress is a settled design criterion or an exact blocker, not artifact volume or elapsed time.

## Authority and current ownership

The current human-approved facts in this plan are constraints. The re-evaluation may expose missing owners or lifecycle seams, but it must not duplicate, silently replace, or weaken an existing owner.

| Conceptual area | Current/default owner | Memory boundary |
|---|---|---|
| Project purpose | Repository `AGENTS.md` | Reference or route to it; do not copy it into memory. |
| Product context | Future product-workflow artifact | Keep product context with the product workflow; generic memory must not become a temporary shadow owner. |
| Current focus | Plans, tickets, and Handoffs | Treat as transient execution authority; do not promote it as durable memory. |
| System and architecture patterns | `ARCHITECTURE.md` | Keep architectural intent in the canonical architecture contract; absence is a gap to report, not permission to create a duplicate. |
| Technical setup | Existing runbooks, configuration, and tooling documentation | Route updates upstream; retain only a residual lesson that has no better owner. |
| Progress | Plans, tickets, and Handoffs | Read current state from its lifecycle artifacts; do not maintain a parallel progress record. |

No new file is proposed for any of these six areas. Canonical artifacts remain authoritative even when a derived index or memory record links to them.

`rule://plan` and `rule://plan-repo-storage` govern this artifact. `rule://plan-impl-spec` is not activated because execution is limited to investigation/design and a later implementation-authority handoff; this revision authorizes no code or agent-behavior implementation.

## Residual memory purpose

Separate agent memory is only residual durable knowledge with no better canonical owner: hard-won operational lessons, repository-specific hazards, external constraints, repeated corrections, and effective workflows. Each active record carries one claim with explicit repository/scope, provenance, owning authority or authority gap, evidence, significance, validation state, and supersession links. A candidate is evidence, never active memory or authority.

## Session injection and bounded recall

- Keep a tiny repository `AGENTS.md` bootstrap that points to a bounded, derived routing index; do not inject memory bodies globally.
- Select active records by explicit repository, task, path, tool, and topic scope. Load only the smallest scope-matched set needed for the current task.
- Preserve explicit subagent Context Packs until end-to-end propagation of selected records is proven; never assume parent context reaches a subagent.
- Exclude raw candidates and inactive archives from recall. Resolve conflicts before loading; an unresolved canonical or record conflict blocks consumption.
- Rebuild the routing index deterministically from reviewed active records. The index is navigation, not authority, and can be discarded and reproduced.
- Consider optional derived retrieval only after measured bounded-index failure. Any later search aid remains derived and non-authoritative; no vector, embedding, service, or daemon becomes an owner.

## Lifecycle, CRUD, staleness, significance, and growth

The required lifecycle is:

```text
settled outcome
→ candidate
→ ownership, deduplication, evidence, and conflict checks
→ canonical-artifact update or reviewed residual-memory promotion
→ indexed active record
→ bounded recall
→ revalidation
→ update, supersession, or archive
```

- **Create / promote:** keep candidates separate; first route the claim to the six-area canonical owner. Promote residual memory only after ownership, duplicate, evidence, significance, sensitivity, and conflict checks pass.
- **Read:** traverse the bounded derived index, then load only active, scope-matched records. Never load the candidate set or archive as ordinary context.
- **Update:** revalidate the claim and its evidence, update the canonical artifact when it owns the concern, or publish a reviewed residual revision that preserves provenance and supersedes the prior record.
- **Delete:** hard-delete only sensitive material or invalid noise. Preserve valid history through supersession and archival; never silently overwrite, delete, or resolve a conflict.
- **Staleness:** use evidence such as changed upstream authority, invalidated scope, contradicted observations, or failed revalidation. Age alone never decays or deletes a claim.
- **Old but valid:** rank recall by scope match, authority, evidence quality, and recorded significance, not recency or usage count. An old, still-valid high-significance hazard remains eligible ahead of newer weak or irrelevant claims.
- **Growth:** enforce the promotion gate, canonicalize upstream, consolidate duplicates, bound the root index, create only real-scope shards after a concrete byte threshold is selected, exclude inactive archives from recall, and rebuild indexes deterministically. Add optional derived retrieval only after measured need.

## Keep

- Canonical-owner precedence and one writer per durable concern.
- Plain Markdown tracked in Git, with provenance and reviewable history.
- Candidate/promotion separation, conflict blocking, and explicit supersession/archival.
- Tiny `AGENTS.md` bootstrap, bounded derived routing index, and selective scope-matched loading.
- One claim per record with explicit authority, evidence, significance, and validation state.
- Evidence-based staleness with no age-only decay.
- Explicit subagent Context Packs until propagation is proven.
- Promotion gates, upstream canonicalization, duplicate consolidation, threshold-driven real-scope sharding, inactive archive exclusion, and deterministic rebuild.

## Exclude

- Copies or shadow owners for any of the six conceptual areas.
- Injection of all memory bodies, raw candidates, inactive archives, transient execution state, or secrets.
- Automatic background transcript crawling, candidate creation, or promotion.
- Vector, embedding, retrieval-service, or daemon authority; usage-count authority; or hidden runtime state.
- Silent overwrite, deletion, promotion, conflict resolution, or authority adoption.
- Temporary generic memory as a product-context owner.
- Implementation, migration, activation, automatic ingestion, delivery, or shipping under this plan.

## Later comprehensive re-evaluation boundary

The later execution is a read-only investigation and design pass over the current canonical artifacts, active decisions, workflow owners, injection surfaces, and any existing memory-shaped evidence. It must:

1. Confirm the six-area owner matrix against current repository evidence and report missing, overlapping, or stale ownership without creating artifacts.
2. Test the residual-record, candidate, conflict, provenance, CRUD, staleness, old-valid ranking, recall, and growth contracts against representative repository scenarios.
3. Resolve every implementation-bearing choice needed for an implementation-grade handoff, including the record/index contract, scope selectors, byte threshold, deterministic rebuild contract, failure behavior, and proof seams.
4. Stop on any product, architecture, privacy, authority, or lifecycle decision that lacks human or canonical authority; record the smallest resume condition.
5. End with one handoff to `dev-ask` for a separately approved implementation route. The handoff may propose targets, migration, activation, and verification contracts, but cannot authorize or perform them.

## Canonical workflow integration

- Re-evaluate the future product-workflow artifact and current `product-*` authority before assigning product-context read/write behavior. Product authority stays in that workflow; residual memory can only link to it.
- Re-evaluate the existing `dev-*` continual-learning loop, including `dev-continual-learning`, as the lifecycle owner for canonical guidance and artifact updates. Define how its settled-outcome candidate seam reaches either the canonical owner or a reviewed residual-memory promotion without adding background mining.
- Assign exactly one writer for each canonical artifact and exactly one reviewed promoter for residual memory. A candidate router, index builder, recall selector, or retrieval aid is never a second writer.
- Treat the product-workflow and `dev-*` continual-learning joins as unresolved lifecycle seams until the re-evaluation proves ownership, handoff fields, conflict behavior, and authority gates. Any dual-writer or shadow-authority design blocks the implementation-grade handoff.

## Tasks

- [ ] T1. Re-establish the evidence-backed canonical ownership map and identify missing, overlapping, stale, or conflicting lifecycle authority without changing repository artifacts.
- [ ] T2. Evaluate and settle the residual record, candidate/promotion, provenance, conflict, CRUD, staleness, old-valid significance, and supersession contracts against representative cases.
- [ ] T3. Evaluate and settle session injection, explicit subagent Context Packs, bounded recall, deterministic indexing, byte-threshold sharding, archive exclusion, and measured-need retrieval behavior.
- [ ] T4. Resolve the product-workflow and `dev-*` continual-learning seams into one-writer ownership and handoff contracts, or stop on the exact authority blocker.
- [ ] T5. Produce one implementation-grade design handoff with selected contracts, proposed targets, acceptance/proof seams, risks, blockers, and one `dev-ask` receiver; perform no implementation or activation.

## Verification / Done criteria

- [ ] V1. The final evidence maps all six conceptual areas to the owners above and identifies zero duplicate or shadow authority.
- [ ] V2. Representative cases objectively cover residual qualification, one-claim records, candidate separation, provenance, conflict blocking, create/read/update/delete, evidence-based staleness, old-but-valid ranking, and supersession/archive behavior.
- [ ] V3. Recall cases show a bounded bootstrap/index path, selective active-record loading, explicit subagent Context Packs, no candidate/archive bulk load, and deterministic rebuild expectations.
- [ ] V4. Growth evidence names a concrete byte threshold and real-scope shard rule, proves inactive archives are excluded, and keeps optional retrieval derived until measured need.
- [ ] V5. The lifecycle map names exactly one writer for each canonical concern and one reviewed residual promoter; product-workflow and `dev-*` continual-learning seams are resolved or returned as exact blockers.
- [ ] V6. The final handoff is implementation-grade, names one `dev-ask` receiver and all required later authority gates, and contains no implementation, migration, activation, ingestion, delivery, or shipping effect.
- [ ] V7. Every task and prior criterion is checked with observed evidence before the plan is marked `DONE`; unresolved authority leaves the plan incomplete rather than self-approved.

## Non-goals and safety

This plan does not approve a memory store, schema, path, migration, hook, service, ingestion source, background job, or runtime injection change. It does not edit canonical artifacts, user-level memory/guidance, product artifacts, ADRs, skills, rules, configuration, plans other than this authority, or archives. Human plan review remains the execution gate, and every later repository mutation, migration, activation, delivery, and shipping effect requires its own current authority.
