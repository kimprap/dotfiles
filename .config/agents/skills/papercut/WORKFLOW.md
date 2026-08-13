# Papercut workflow

## Human overview

Papercut records small, reusable friction in repository-owned work. It activates only after current work exposes one plausible candidate. An initialized repository can record it automatically; an uninitialized or read-only repository receives a disclosed report-only result. Repositories opt in explicitly through `papercut init` or an exact approved `init-ask` effect. Durable guidance still uses its existing workflow and assurance.

## Module design

The always-applied rule notices candidates. `SKILL.md` owns qualification, redaction, semantic record selection, Learning Candidate construction, routing, exact workflow-result mapping, and disclosure. `scripts/papercut_ledger.py` is private mechanics with four operations: `init`, `list`, `record`, and `resolve`. The repository ledger stores compact v2 evidence only. `init-ask` may delegate one approved initialization call but owns no papercut semantics or storage. No host adapter, workflow stage, setup registry, queue, or second papercut owner exists.

## Current flow

1. Current work exposes reusable repository-owned friction.
2. The skill rejects owned, noisy, or sensitive cases; redacts one candidate; and checks exact authority.
3. With initialized writable storage, `record` creates, deduplicates, updates, or reopens one stable record. Otherwise the skill reports without mutation.
4. Independent evidence may form one complete Learning Candidate with an immutable originating `PC-ID`; the current lifecycle owner evaluates it.
5. The authoritative current owner preserves that `PC-ID` and returns one candidate-specific result. The dev backend, product router, custom owner, or direct-response owner then performs at most one settlement call through the same portable seam.
6. Durable correction maps to `fixed`, candidate-specific rejection to `rejected`, and replacement to `superseded`. Blocked, incomplete, deferred, broad, global, or unrelated outcomes remain open.
7. Resolution removes current observation prose. A later distinct recurrence reopens the same stable record and retains its latest resolution.

## Included, excluded, and deferred

Included: current-work capture; explicit opt-in through `papercut` or approved `init-ask`; redaction; semantic deduplication; compact evidence; proposal-only review; immutable candidate delivery; exact-record settlement across dev, product, custom, and direct work; OMP/Grok portable invocation.

Excluded: transcript/history/memory mining; counts or calendars as proof; background jobs; tracker or repair state; product, domain, or ADR authority; workflow dispatch; staging, shipping, or external effects; automatic repository initialization.

Deferred: generic repository agent memory and any new supported setup integration without an approved owner and observable seam.

## Authority and maintenance

ADR-0007 D24 governs this module. ADR-0004 D07 owns generic engineering continual-learning evaluation and curation. ADR-0008 D25 owns the separate repository setup interface. Product P07 and custom workflow owners retain their outcomes; papercut settlement cannot create or alter them. The ledger is evidence, never authority. When changing this module, update the rule, skill, helper, evals, workflow documentation, and current ADR projection together; preserve exact four-mode/four-operation interfaces; and verify clean removal of v1 command and sidecar contracts.
