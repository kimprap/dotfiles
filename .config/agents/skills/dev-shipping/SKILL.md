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
1. Confirm the exact authorized actions, target, destination, checks, destructive effects, and rollback boundary before the first effect. Do not recap them as a user-facing template. Obtain approval for any expansion.
2. Recheck target identity and working state immediately before the first effect. Preserve unrelated work and obey repository-specific staging rules.
3. Perform only the named actions. Do not rewrite history, bypass hooks, skip checks, force an effect, or broaden rollout without explicit authority.
4. Observe the complete required-check set. One green subset is not success.
5. When a required check fails, classify it as deterministic target defect, flake, infrastructure, unrelated failure, permission blocker, or unresolved. Establish one cause before changing the target.
6. A deterministic target defect ends the shipping attempt before any target repair. Return one lean Handoff to the bound implementation owner and send the defect through the approved `dev-implementation` route for a new implementation revision, smoke, the current single final code review then verification, learning, and completion accounting. Because delivery authorization is bound to an exact target identity, require renewed explicit shipping authorization for the new revision before resuming.
7. For flakes, infrastructure, unrelated failures, or unavailable permissions, preserve evidence and apply only the configured safe retry or human escalation. Never hide or waive a required check.
8. For release/deploy/rollout, observe the declared health signals and execute the approved rollback when its threshold is met. Ambiguous or irreversible effects stop for human authority.
9. Keep delivery, check, rollout, and rollback evidence tied to exact identities. Report those facts in the human reply or in the one Handoff that a real receiver needs; do not invent a second envelope.

## Reporting

The requesting human in this conversation is not a Handoff receiver. After same-conversation staging, commit, or push, reply with the landed identity, what was included, what was left unstaged, and whether anything left the machine. Do not emit a Common Handoff, shipping-payload headings, `SHIPPED`, or `route-impact` as the user-facing format.

Emit one lean `dev-handoff` only when ownership actually crosses: a failed shipping attempt returning a deterministic target defect to the bound implementation owner, or a named receiver outside this conversation who must consume a delivery identity. Use the common envelope once. Add only the shipping facts that receiver needs (authorization, delivered identity, required checks, rollout, rollback). Do not add a second envelope.

## Permissions and stops

Shipping cannot review its own target, repair code, infer authority, bypass hooks/checks, alter unrelated work, or combine local completion with delivery permission. Stop on stale evidence, missing authorization, unavailable required capability, check nonpass, unsafe partial effect, credential/account requirement, or ambiguous rollback. Human-facing stops name the smallest missing prerequisite in ordinary prose and leave local completion truth unchanged. A defect return uses exactly one Handoff to the bound implementation owner.
