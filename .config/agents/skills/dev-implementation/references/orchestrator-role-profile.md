# Orchestrator Role Profile v1

`dev-implementation` owns this provider-neutral launch contract. It binds the current capable parent to one exact Task Contract, Executor Plan, and authority revision. It is capability evidence, not a lifecycle skill, model selector, runtime ledger, or permission grant.

## Profile

The backend supplies one secret-free JSON profile:

```json
{
  "schema": "orchestrator-role-profile/v1",
  "task_contract_sha256": "<64 lowercase hex>",
  "executor_plan_sha256": "<64 lowercase hex>",
  "authority_revision": "<exact revision>",
  "runtime": {
    "identity": "<concrete parent identity>",
    "harness_adapter": "<adapter identity>",
    "model_selector": "<configured selector>",
    "model_selector_source": "<configuration source>",
    "model_resolved": "<resolved model identity>",
    "reasoning_level": "<resolved level>",
    "fallback": "none"
  },
  "capabilities": {
    "read": "native|contract-equivalent|unavailable",
    "write": "native|contract-equivalent|unavailable",
    "schedule": "native|contract-equivalent|unavailable",
    "delegate": "native|contract-equivalent|unavailable",
    "observe": "native|contract-equivalent|unavailable",
    "control": "native|contract-equivalent|unavailable",
    "handoff": "native|contract-equivalent|unavailable",
    "identity": "native|contract-equivalent|unavailable",
    "recovery": "native|contract-equivalent|unavailable"
  },
  "limits": {
    "max_child_depth": 1,
    "max_concurrency": 4,
    "isolation": "<effective isolation mechanics>",
    "fan_in": "<effective neutral fan-in mechanics>",
    "effects": "<effective external-effect limit>"
  },
  "evidence": {
    "<every bound dotted field>": "live-attested|documentation-inferred"
  },
  "downgrade": "none"
}
```

`downgrade` may instead be the exact plan-approved object:

```json
{
  "mode": "one-owner-sequential",
  "approved": true,
  "executor_plan_sha256": "<same exact plan digest>",
  "owner": "<one qualified owner>",
  "preserves": [
    "acceptance",
    "assurance",
    "authority",
    "effects",
    "handoff-boundaries",
    "recovery",
    "task-contracts"
  ]
}
```

The preservation list is closed and sorted. It cannot waive isolation or fan-in required by the approved plan.

## Launch attestation

The harness adapter returns `orchestrator-attestation/v1` with the same task/plan/authority, runtime, capability, limit, and evidence fields. Evidence states are field-level; configuration or documentation can be recorded as inferred but cannot begin full orchestration. No prompt assertion, filesystem presence, model label, or skill prose upgrades an inferred field.

Run before dispatch:

```text
python3 scripts/orchestrator_profile.py assess \
  --profile <exact-profile.json> \
  --attestation <fresh-launch-attestation.json>
```

Results are exactly:

- `full-orchestration`: every bound field agrees, every load-bearing field is `live-attested`, every capability is effective, limits satisfy the profile, and fallback is `none`.
- `one-owner-sequential`: full orchestration is unavailable only because delegation/observation/control or child-depth/concurrency cannot satisfy the profile, while the exact approved downgrade, core direct capabilities, authority, identity/model/reasoning, isolation/fan-in, effects, and digests remain live and exact.
- `transport-unavailable`: every other missing, malformed, inferred, mismatched, unavailable, fallback, or unapproved case.

Task/plan digest, authority, runtime identity, adapter, selector/source/resolved model, reasoning, fallback, isolation, fan-in, and effect mismatches always fail closed; they cannot select the downgrade. The assessor is read-only and provider-neutral. Each supported OMP or Grok backend launch binds its fresh adapter-supplied attestation and the exact no-fallback assessment before dispatch; adapter config, rule/persona discovery, or a model mapping is never attestation. Adapters own how live fields are obtained and disclose their different identity, model, tool, isolation, storage, and recovery mechanics without changing this contract.
