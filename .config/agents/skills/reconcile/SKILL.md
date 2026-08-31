---
name: reconcile
description: >
  Refine one exact proposal or artifact through two persistent read-only
  reviewers. Use only when explicitly invoked to reconcile a named or latest
  substantive proposal before presenting it.
disable-model-invocation: true
---

# Reconcile

Keep the invoking main agent as the sole controller, canonical-candidate owner,
mutator, validator, cycle detector, ephemeral round recorder, and presenter.
Before any reviewer dispatch, read and follow
[the reviewer protocol](references/reviewer-protocol.md) completely; its child
contract is mandatory.

## Preflight and approval

1. Resolve two distinct host-provided persistent read-only reviewer bindings,
   logical A and B, with same-child normal-prompt follow-up. Verify that the
   main agent can retain each exact child identity, bind its own invoking
   controller identity and a host-provided finalized-response channel, make
   required context readable to the intended reviewer, and apply and
   re-identify the approved candidate mode. Do not emulate the pair with one
   child, replace a lost child, or weaken persistence or the response channel.
2. Infer the candidate in this order: an explicitly named proposal or artifact;
   otherwise the latest substantive assistant decision or proposal; otherwise
   `unresolved`. Bind exact UTF-8 proposal bytes as
   `conversation@sha256:{exact-content-digest}` and exact artifact bytes as
   `{exact-readable-locator}@sha256:{exact-file-digest}`. Digests are lowercase
   SHA-256. Supply bounded exact content or a child-readable locator, never an
   opaque cross-session reference.
3. Verify every decision-bearing locator before showing the gate. A missing
   capability or unreadable required locator stops before the brief, with no
   reviewer dispatch or candidate mutation.
4. Render exactly one binding gate:

```markdown
## Reconcile brief

- **Goal:** {approved goal text}
- **Candidate:** {latest proposal summary, or exact artifact locator and identity}
- **Context:** {approved user intent, constraints, and decision-bearing references}
- **Mode:** {conversation replacement, or edits limited to the named artifact}

Reply **approve** to start, or **approve — {adjustments}**.
```

For an unresolved candidate, render `Candidate: unresolved — name one proposal
or artifact` and wait; approval alone cannot dispatch it. Plain `approve`
starts the displayed binding. An unambiguous `approve — {adjustments}` updates
that binding and starts without another gate. A correction without approval or
a conflicting or ambiguous adjustment renders one revised brief and waits.
This is only local approval of the displayed review binding; it grants no other
authority or effect.

## Ephemeral controller state

Build a fresh packet containing only:

- the approved goal and user intent;
- decisions, constraints, and exclusions;
- the complete current proposal text, or exact artifact locator and current
  identity;
- decision-bearing readable context;
- the current shared-protocol locator and digest;
- the logical reviewer and pass;
- the invoking main controller identity and host-provided finalized-response
  channel; and
- the counterpart's latest finalized response when one exists.

Use native shared-artifact transport for large context only when both children
can read it. The packet must not depend on a session ID or opaque locator by
itself.

Assign monotonically increasing `Step` values to one ephemeral round list. Keep
ephemeral seen sets for candidate-identity/reviewer pairs and unresolved
frontiers. Never persist the counter, list, sets, or a protocol state object.

## Mandatory first iteration

After approval, execute this exact order while context and transport remain
available:

1. Spawn logical A once, retain its exact child identity, and request an
   `initial` review of the approved candidate and packet. Collect its complete
   outer response through the ordinary host task result. Validate it, record it
   as provisional and superseded, and never apply it.
2. Send a normal-prompt follow-up to that same A. Explicitly require A to read
   and load the existing `skill://rethink`, reassess its own immediately
   preceding provisional response from first principles, and return exactly one
   complete finalized outer response with pass `post-rethink` through the
   supplied response channel to the bound invoking main identity. Retain the
   load/content trace. The outer Reconcile response contract supersedes
   `rethink`'s internal verdict vocabulary. Only now may the main agent apply a
   finalized A `REVISE`; A `VALID` never skips B.
3. Spawn logical B once with an exact child identity distinct from A. Give B
   the current candidate, the approved packet, and A's latest finalized
   response. Request B's `initial` review and collect its complete outer
   response through the ordinary host task result. Validate it, record it as
   provisional and superseded, and never apply it.
4. Send the equivalent normal-prompt `skill://rethink` follow-up to that same B,
   require pass `post-rethink`, and collect exactly one complete finalized outer
   response through the supplied response channel to the bound invoking main
   identity. Retain the load/content trace. Only now may the main agent apply a
   finalized B `REVISE`. B's post-rethink `VALID` is the earliest eligible
   terminal verdict.

Exactly those two first-iteration same-child follow-ups load `rethink`. Initial
provisional responses use ordinary host task results. If the host wraps an
initial result in a task transport envelope, extract its designated
response/content value before protocol validation; transport metadata is not
part of the reviewer response. Every main-requested post-rethink, later, or
response-contract-correction pass returns exactly one complete outer response
through the packet's supplied response channel to the bound invoking main
identity; the complete outer response is the entire payload. Reject any
reviewer-to-reviewer or unsolicited message, any other use of the response
channel, or any reviewer attempt to await, read a peer, mutate, dispatch, or
control the loop.

A response-contract correction returns to the same child and preserves the
response's provisional or finalized authority. A `BLOCKED` response may receive
already-approved readable context through the same child; if it remains blocked
after available correction, stop. `BLOCKED` never authorizes mutation or
invented authority.

## Mutation, later passes, and freshness

Accept only one exact complete protocol response for the expected reviewer,
pass, and current identity. Return malformed, stale, mismatched, or
non-applicable responses to the same child for contract correction; the main
agent invents no semantic edit.

Apply only a finalized authorized `REVISE`. In conversation mode, replace the
complete canonical proposal with the complete returned replacement. In
artifact mode, edit only the approved candidate artifact with the exact bounded
correction. Keep supporting context read-only. Re-read and rehash after every
edit, and run an existing artifact-native validator when available. Do not
create a mirror, temporary source of truth, or runtime ledger.

After B post-rethink, an exact `VALID` may terminate only when it binds the
current identity and no applied semantic recommendation changes that identity.
Otherwise apply one complete finalized `REVISE`, re-identify the candidate, and
send the new candidate plus the revising reviewer's finalized response to the
existing counterpart child. Alternate those same A and B children, collecting
each requested complete response through the supplied response channel. Later
passes use pass `later` and never load `rethink`. Every semantic candidate
change invalidates all `VALID` verdicts for earlier identities and requires an
exact counterpart `VALID` on the new identity.

For `VALID` recommendations, apply compatible `editorial:` items directly,
re-identify the candidate, and record the terminal identity without counterpart
revalidation. Applying any compatible `semantic:` item requires counterpart
review and `VALID` on the changed identity. A recommendation that conflicts
with approved authority blocks instead of being silently applied.

## Progress and stops

Progress means resolving a named issue or blocker. Another opinion, repeated
wording, elapsed time, an unchanged candidate, or additional machinery is not
progress. Never impose a fixed round count.

Stop before another review, without claiming validity, when:

- a finalized `REVISE` leaves bytes or meaning unchanged;
- the same candidate identity would return to the same reviewer without new
  evidence or authority, including a repeated A/B cycle;
- the same unresolved frontier repeats;
- either persistent child or its required same-child follow-up is unavailable;
- required context cannot be made readable;
- approved authority conflicts with the requested adjustment; or
- a reviewer remains `BLOCKED` after available context correction.

## Presentation

Always render the rounds section first, including every provisional, finalized,
and later pass in order. Mark each provisional initial response as superseded
rather than hiding it.

```markdown
## Review rounds

| Step | Reviewer | Pass | Verdict | Adjustment |
|---|---|---|---|---|
```

On success, follow it with `## Final proposal`. Conversation mode includes the
complete final proposal. Artifact mode includes only a concise change summary,
the exact artifact locator, and the current identity; do not duplicate the full
artifact.

On any stop, follow the rounds section with `## Reconcile stopped`, the last
exact candidate identity, the exact blocker, and the resumable frontier. Do not
render `## Final proposal` or make a validity claim.
