# Reconcile execution flow

This is a non-runtime, non-normative human maintenance map. Ordinary Reconcile
invocation and execution never load or interpret it. `../SKILL.md` and
`reviewer-protocol.md` are the executable owners and win on mismatch.

**Non-runtime diagram caption.** Direction-changing controller branches from
approval through convergence, capacity, stops, and repair.

```mermaid
stateDiagram-v2
    [*] --> Preflight
    Preflight --> Brief: capabilities and binding valid
    Brief --> Brief: binding corrected without approval
    Brief --> Pair: approve bound brief
    Pair --> OuterInit: distinct A and B retained
    OuterInit --> PassChoice: base = working; next = A
    state PassChoice <<choice>>
    PassChoice --> Initial: reviewer's first actual turn
    PassChoice --> Later: reviewer already reviewed
    Initial --> Rethink: provisional initial complete
    Rethink --> Admit: finalized post-rethink
    Later --> Admit: finalized later
    Admit --> PassChoice: changed applicable REVISE; alternate
    Admit --> Sync: exact current-identity VALID
    Admit --> Stopped: liveness or authority stop
    Sync --> RepairStop: delivery fails; stop before presentation
    Sync --> Accepted: delivery receipt succeeds
    state Accepted <<choice>>
    Accepted --> Succeeded: working equals outer base
    Accepted --> CapStopped: changed and closure-only
    Accepted --> Apply: changed and capacity remains
    Apply --> RepairStop: failed or partial application
    Apply --> Validate: committed changed application
    Validate --> RepairStop: native validation fails
    Validate --> ClosureInit: valid result and count reaches cap
    Validate --> OuterInit: valid result and capacity remains
    ClosureInit --> PassChoice: applied base = working; next = A; closure-only
    RepairStop --> Sync: identity-preserving sync repair
    RepairStop --> Apply: exact base or permission repair
    RepairStop --> Validate: validator repair; applied identity unchanged
    RepairStop --> OuterInit: content changed; binding remains current
    RepairStop --> Rebind: target, mode, scope, authority, child, or lineage changed
    CapStopped --> [*]
    Succeeded --> [*]
    Stopped --> [*]
    Rebind --> [*]
```

**Non-runtime table caption.** Main's action and mutation boundary at each guard.

| Event or guard | Main action | Canonical mutation allowed |
|---|---|---|
| Preflight passes and the bound brief is approved | Retain distinct read-only A and B, then initialize outer one | No |
| Outer initialization | Set canonical candidate as immutable base and initial working proposal; start with A | No |
| Reviewer's first actual turn | Collect provisional initial, then same-child rethink and finalized post-rethink | No |
| Reviewer has already reviewed | Request finalized later pass without rethink | No |
| Changed applicable REVISE | Replace ephemeral working proposal and alternate to the counterpart | No |
| Exact current-identity VALID | Synchronize the already-live counterpart | No |
| Synchronization receipt fails | Stop at the exact working identity | No |
| Synchronized working proposal equals outer base | Present unchanged success | No |
| Synchronized proposal changed and capacity remains | Apply once, re-identify, validate, and begin a new A-led outer | Once, after synchronization |
| A committed application reaches the cap | Begin one closure-only outer from the applied base | No further mutation |
| Closure accepts another changed proposal | Synchronize, then stop `CAP_REACHED` with canonical and pending identities | No |
| Liveness, persistent blocking, malformed response, lost child, or authority guard fails | Stop at the exact frontier | No |
| Application or validation fails | Stop on observed bytes and request one exact repair authority | No automatic mutation or rollback |
| Explicit repair preserves every bound content identity | Verify identity and retry only the failed sync, apply, or validation step | Only the already-accepted exact apply retry |
| Repair changes content while the binding remains current | Invalidate VALID and begin a fresh A-led outer | No until freshly accepted and synchronized |
| Target, mode, scope, authority, child binding, or lineage changes | Require a revised Reconcile binding | No |

Behavior-changing maintenance updates the owning executable prose, every affected
diagram edge or table row, and at least one semantic eval in the same change.
Presentation-only wording does not require a map edit. A mismatch is an edit-time
documentation defect, never a live controller stop.
