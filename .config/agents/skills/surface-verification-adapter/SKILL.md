---
name: surface-verification-adapter
description: Manual shared contract for repository-specific surface verification adapters; load only by exact skill invocation or a frozen adapter recipe.
disable-model-invocation: true
---

# Surface Verification Adapter

Define one manual repository-owned adapter for one distinct launch, isolation, drive, evidence, and cleanup contract. This package is a shared contract, not a product adapter and not the `dev-implementation` Orchestrator Role Profile runtime adapter. It owns no routing, profile, provider, model, credential, dispatch, recovery, acceptance, verdict, repair, review, or shipping authority.

## Binding

Bind an adapter only from an already-frozen complete `surface-proof-recipe/v1` object. The recipe names the symlink-free canonical `file://` URI of the adapter root `SKILL.md` and its exact `surface-verification-adapter-tree/v1` digest. Never search by description, infer an equivalent adapter, or invoke creation or maintenance during ordinary implementation, verification, testing, review, or setup.

Run `scripts/adapter_contract.py adapter --root PATH` against the named root. A missing, stale, unsafe, or mismatched identity blocks before use. Adapter presence changes no route, proof class, compact eligibility, assurance profile, lifecycle depth, topology, repair budget, or shipping boundary.

## Launch and readiness

The generated adapter states one exact host-neutral launch contract, readiness observation, assigned-resource policy, and owned instance identity. It must use repository-native or platform-native mechanics and accept externally assigned ports, data roots, terminals, or equivalent isolation inputs when the surface supports them.

Launch only for the frozen target and recipe. Record the exact command or native action, environment, target identity, process or terminal identity, readiness expectation, observation, and blocking evidence. Never repair a broken checkout or product through the adapter.

## Doctor

Doctor runs once at readiness only when the frozen recipe names this adapter. It checks current capability and guidance against that recipe, cleans every disposable probe, preserves its evidence, and returns one `surface-verification-doctor/v1` receipt validated by `scripts/adapter_contract.py doctor --input JSON`.

Doctor never satisfies an acceptance criterion, worker smoke, verifier proof, or review result. Product failure is blocking product evidence, not adapter maintenance. A stale URI, digest, instruction, capability, or unclean probe blocks readiness without creating or maintaining anything.

## Stable paths

- `.config/agents/skills/surface-verification-adapter/SKILL.md`

Every generated adapter replaces this shared-contract path with at least one real user-visible path through its own target surface. An optional external feature map may deepen already-approved paths but cannot add acceptance criteria, task coverage, or proof ownership.

## Drive

The generated adapter defines deterministic actions against each approved stable path and names the observable resulting state. Drive only the frozen scenario. Record action, expected state, observed state, target identity, and runtime identity. A stale surface after readiness blocks stale proof.

## Evidence

Evidence lives outside the adapter package and survives cleanup. Record canonical evidence URI and digest, action, expected and observed state, runtime identity, uncertainty, and any product blocker. Collector or worker conclusions are not verdict authority.

## Isolation

Use dedicated assigned ports, data roots, process identities, pseudo-terminals, browser contexts, or serialized groups as the surface requires. One adapter may serve multiple visible entry points only when their launch, isolation, drive, evidence, and cleanup mechanics are compatible. Never isolate by broad process-name ownership.

## Cleanup

Remove only instances and scratch state started by the adapter. Never kill by process name, remove pre-existing state, or delete evidence. Record every removed resource, remaining scratch state, surviving evidence, and cleanup uncertainty. A recipe may authorize one exact cleanup retry; no implicit retry exists.

## Helper interface

Use the package-local helper without importing it into product code:

```text
adapter_contract.py adapter --root PATH
adapter_contract.py recipe --input JSON
adapter_contract.py doctor --input JSON
adapter_contract.py --self-test
```

Each success emits one sorted-key compact JSON object. Validation failure emits one stable error object and exits nonzero. The helper creates no file, launches no process, and mutates no target.
