---
name: dev-handoff
description: Transfer one bounded task result across a real ownership or context boundary with local delta, direct checks, blockers, and exactly one receiver.
---

# Dev Handoff

Use one lean Handoff when task ownership or context changes, a completed implementation attempt returns to its concrete bound controller, an explicitly delegated controller returns to its concrete route owner, or blocked recovery must survive a boundary. Do not emit one for an intermediate candidate, ambient status, an in-place role change, a controller handing work to itself, or terminal presentation.

## Required envelope

Use these headings once and in this order:

```markdown
# Handoff: <task and semantic attempt, or exact stage>

## Outcome
- <completed result or exact non-success state>
- <approved intent/acceptance delta needed by the receiver>

## Changed targets/effects
- <exact changed path or surface and observable effect, or none>
- <other allowed effect performed, or none>

## Checks
- <AC-ID or reviewer closure ID>
  Behavior: <observable>
  Check: <command or direct static proof>; expect <exact result>
  Observed: <actual result and pass/fail>

## Blocker/risk
- <none, or exact blocker/risk and the smallest permitted recovery condition>

## Next receiver
- <exactly one owner>
```
`Changed targets/effects` lists only the local delta. Include every declared target actually changed, material preserved behavior, and any allowed non-file effect.
`Outcome` names the task and semantic attempt when implementation is transferred. A lifecycle owner may add one `Route impact:` line there when its receiver needs that fact; ordinary task Handoffs omit it.

`Changed targets/effects` is the local delta, not a repository manifest. Include every declared target actually changed, material preserved behavior, and any allowed non-file effect. Do not include hashes, proof recipes, adapter bindings, receipts, generation maps, or transcript summaries.

`Checks` preserves each owned acceptance item's exact `Behavior` and `Check` lines and records what was observed. Failed or unrun checks remain explicit; reasoning and broad suite status do not substitute. Review findings use their direct closure checks in the same grammar.
When execution recovery occurred, keep its evidence inside the existing
`Checks` and `Blocker/risk` fields. Record the concrete cause, correction or
transient basis, decisive observation, proceed/stop decision, and corrected or
unchanged executions already used. Preserve any unknown or exhausted allowance
and uncertain prior effects as blockers; new error wording, agent, or root
identity and temporary success do not imply a reset. Add no recovery field or ledger.

`Blocker/risk` separates completion-blocking facts from residual risk. A blocked Handoff names the current failure, affected acceptance, completed work worth preserving, and the condition under which the receiver may proceed. It grants no new attempt, scope, or effect.

`Next receiver` contains one concrete bound actor, not merely a skill name or generic `dev-ask`. A semantic next-owner field may remain `dev-implementation` or `dev-ask`, but the Handoff receiver names the actor already bound to perform that role. Parallel results each carry their own receiver; the controller orders them without merging envelopes. Required identities are reused or resumed, never replaced under the same role name. A Handoff does not approve shipping, decide semantic sufficiency for an independent role, or authorize work beyond its source contract.