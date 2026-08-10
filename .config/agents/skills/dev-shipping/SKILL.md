---
name: dev-shipping
description: >
  Perform only explicitly authorized delivery actions and complete-check-set CI
  recovery with rollback evidence. Use when a human separately requests staging,
  commit, push, review-request, release, deploy, or rollout; never infer shipping
  permission from local completion, review approval, or a passing subset of checks.
---

# Engineering Shipping

Own the separately approved boundary from locally complete work to delivery. Local completion authorizes no shipping action.

## Intake and authority

Require:

- exact locally complete target and terminal evidence identities;
- explicit human authorization naming the delivery actions and destination;
- repository and destructive authority required by those actions;
- the complete required-check set and protected delivery rules;
- rollout, observation, and rollback criteria when external effects are possible; and
- a safe available adapter capability.

Reject silence, implication, stale completion evidence, missing destination, missing permission, unavailable required checks, or a request to bypass a guard. Do not authenticate, fund, rotate, or expose an account or credential.

## Procedure

1. Restate the exact authorized actions, target, destination, checks, destructive effects, and rollback boundary. Obtain approval for any expansion.
2. Recheck target identity and working state immediately before the first effect. Preserve unrelated work and obey repository-specific staging rules.
3. Perform only the named actions. Do not rewrite history, bypass hooks, skip checks, force an effect, or broaden rollout without explicit authority.
4. Observe the complete required-check set. One green subset is not success.
5. When a required check fails, classify it as deterministic target defect, flake, infrastructure, unrelated failure, permission blocker, or unresolved. Establish one cause before changing the target.
6. A deterministic target defect ends the shipping attempt before any target repair. Emit a failed Shipping Handoff and return the defect through the approved route/backend for a new implementation revision, smoke, fresh verification, neutral integration when needed, final review, curation, and completion accounting. Because delivery authorization is bound to an exact target identity, require renewed explicit shipping authorization for the new revision before resuming.
7. For flakes, infrastructure, unrelated failures, or unavailable permissions, preserve evidence and apply only the configured safe retry or human escalation. Never hide or waive a required check.
8. For release/deploy/rollout, observe the declared health signals and execute the approved rollback when its threshold is met. Ambiguous or irreversible effects stop for human authority.
9. Emit delivery, check, rollout, and rollback evidence tied to exact identities.

## Shipping payload in the Common Handoff

Emit one Common Handoff and extend its role payload with the fields below; never create a second shipping result envelope.

```markdown
## Shipping authority
- Explicit human authorization, actions, destination, and destructive gates
## Delivered identity
- Local source revision and resulting delivery identity
## Required checks
- Complete required-check set → status → evidence
- Failure classification and changed cause per revision
## Rollout and observation
- Environment, signals, thresholds, and observed result
## Rollback
- Approved procedure, trigger, execution status, and resulting identity
## Outcome
- SHIPPED | BLOCKED | FAILED | ROLLED BACK
## Next receiver
- Exactly one Task-Contract-eligible human, requesting, or backend owner plus any exact resume condition
```

## Permissions and stops

Shipping cannot review its own target, repair code, infer authority, bypass hooks/checks, alter unrelated work, or combine local completion with delivery permission. Stop on stale evidence, missing authorization, unavailable required capability, check nonpass, unsafe partial effect, credential/account requirement, or ambiguous rollback. Every exit records `route-impact: unchanged|changed` and exactly one receiver in the Common Handoff; report the smallest human prerequisite and leave local completion truth unchanged.
