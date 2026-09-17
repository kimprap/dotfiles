# Execution recovery

Use this shared policy whenever a concrete invocation, runner, transport, environment, automation, collection, capture, disposable-fixture, or task-local helper failure prevents approved generic `dev-*` work from continuing or would otherwise be escalated as an execution-related blocker. Before escalating, the current execution owner assesses the failure here. Assessment grants no retry or effect authority; only an eligible proposal proceeds to the retry procedure below. This reference alone owns generic eligibility, recurrence, transient fallback, evidence, and stop rules. Callers point here instead of copying the algorithm. It adds no skill, stage, reviewer, scheduler, or recovery ledger.

## Preserve authority and semantics

Execution recovery restores execution of an already approved operation under unchanged authority. It may correct malformed commands or tool arguments, working-directory or enclosing invocation settings, incidental browser or mobile automation, disposable fixtures, collection or capture, and task-local execution helpers. Role distinguishes disposable execution machinery from evaluated behavior; temporary location, a code-free change, or small patch size alone does not establish eligibility.

Recovery must not change the deliverable, required behavior, acceptance, required evidence, ownership, evaluated target, or authorized effects. Tighter explicit restrictions and existing effect, spending, and duration limits always win; configured access alone grants no effect authority. Any correction to the evaluated implementation or deliverable is semantic repair and remains subject to the existing attempt, review, verification, and ownership rules.

Required execution and assurance ownership is distinct from disposable resource identity. A process, browser session, fixture, scenario actor, or invocation may be recreated only when its identity is not required by acceptance, its effects remain authorized, and the existing cause allowance permits replacement. Never replace a required implementation owner or independent verifier, pretend to resume a disposed actor, reconstruct missing authority or provenance, or reset any allowance through a fresh resource.

An initial execution allocation is not automatically a prohibition on eligible recovery. An explicit total execution, spending, duration, effect, or custom-protocol cap remains binding and is never replenished by replacing a disposable resource.

## Assess before escalation

1. Preserve the failed or inconclusive observation and identify the execution mechanism that prevented continuation. A lower-level `blocked`, failed, or inconclusive label alone does not prove that authorized recovery is exhausted.
2. Establish whether authority, acceptance, required evidence, required owners, target, effects, cause history, and every tighter limit are known and unchanged. Missing authority, unknown effects or allowance history, exhausted applicable limits, and unavailable required owners are stops.
3. If recovery is eligible, return one concrete correction question or proposal to the responsible execution owner instead of escalating the premature blocker. If it is ineligible, report the exact unmet condition and preserve completed work.

When a `dev-implementation` controller validates a child Handoff containing an execution-related stop, it checks whether the stop names a condition this policy actually requires. If not, it returns the specific unresolved eligibility question to the same responsible owner. The controller does not redo semantic judgment, manufacture eligibility, repair execution machinery, or repeatedly challenge the same settled blocker.

## Custom controller boundary

Custom controllers do not inherit this generic policy automatically. Adoption
must be explicit before the affected operation starts, through either one named
invocation's existing contract or a current custom-skill contract that names
this policy as its sole machinery-recovery owner. A skill-level adoption is
reusable only for that skill's later invocations under their separately approved
scope; it is not retroactive authority for a running, paused, stopped, or
historical invocation. Existing invocation-local grants remain local and grant
nothing to another run.

Either form binds the actual operation, execution owner, authorized effects, and
tighter limits in the custom controller's existing state. It creates no launch
template, framework integration, durable workflow state, protocol approval, or
restart authority. Arbitrary custom controllers remain opted out.

The responsible owner may diagnose eligible outer argument, setup, transport,
collection, capture, and task-local execution failures under that adoption. A
custom protocol rejection is not automatically an execution-machinery failure:
the protocol's current contract alone owns admission, required actors, evidence,
correction and return budgets, terminal decisions, and cleanup. Generic recovery
may correct eligible outer machinery only; it never starts a replacement
invocation to bypass a protocol refusal or manufactures approval, scope
authority, provenance, or another semantic allowance. Observing or collecting a
still-pending operation through an already-supported path is ordinary
continuation; correcting a failed observation invocation is recovery and follows
the retry procedure below. Neither authorizes replay of child work.

## Before every retry

1. Retain the failed observation and establish one concrete cause from evidence. When the cause or prior effects are uncertain, perform only a safe non-repeating diagnostic or report the exact blocker.
2. Form the smallest recovery proposal: a targeted execution correction or an eligible transient retry under unchanged acceptance and effects. Include safe cleanup and directly coupled failure paths.
3. Before executing the proposal, the same execution owner explicitly reads `~/.agents/references/impl-rethink/recovery-rethink.md` and applies it once. This is required before corrected and unchanged retries. The rethink may correct the proposal once; it is not an independent opinion, another implementation rethink, an assurance pass, or recursive permission to rethink again.
4. Execute the smallest complete valid scenario that can establish the required observation. A frozen failed or inconclusive result stays failed or inconclusive. Do not reconstruct missing authority or stitch incompatible partial runs into a pass.

## Recurrence and transient limits

A corrected execution is an execution after changing execution machinery for one concrete cause. Across the approved outcome:

- permit at most two corrected executions for that cause;
- permit the second only when new evidence supports a materially different correction;
- do not reset or replenish the allowance because error wording, agent, or root identity changed, or because temporary success preceded recurrence;
- stop autonomous execution when the cause persists or recurs after both corrected executions, or when prior allowance is unknown; and
- apply no workflow-wide numeric ceiling to genuinely distinct eligible causes, while continuing to obey all tighter authority, effect, spending, duration, and task-specific limits.

For a temporary service or transport failure, use its existing finite retry policy. When none exists, permit at most one safe unchanged retry. Unknown prior side effects prohibit repetition. A transient attempt does not replenish corrected executions, and relabeling a cause as transient or corrected does not erase its history.

## Evidence and continuation

Record the concrete cause, correction or transient basis, decisive observation, proceed/stop decision, and corrected or unchanged executions already used in existing execution evidence. Transfer those facts through the current lean Handoff when work crosses an owner or context boundary; do not create separate retry state. Unknown history never implies a fresh allowance.

Preserve failed or inconclusive observations as historical evidence together with safe cleanup, prior fixes, valid independent results, and completed work. Safe partial continuation is allowed only when acceptance and conditions remain compatible. Rerun the smallest complete valid scenario rather than combining incomplete executions. After eligible recovery, a retained verifier may issue a fresh complete aggregate from compatible valid observations without relabeling failures or stitching incompatible runs.

Implementation owners may correct their task-local execution machinery without consuming a semantic attempt only while the evaluated target and deliverable remain unchanged. Exhausted semantic repair prohibits another deliverable change, not otherwise eligible execution-machinery recovery under its existing allowance. A verifier remains read-only toward the evaluated target and may correct only its permitted task-local execution machinery; it never repairs product or code under recovery. After semantic repair, the same verifier still reruns the complete unchanged fixed check set. One-shot review, one learning invocation, custom-controller authority, and every existing semantic-attempt limit remain unchanged.

After successful recovery, continue through the remaining already-approved outcome rather than stopping at the corrected execution, next candidate, or Handoff. Stop only for an exact condition above or another current authority's tighter limit.
