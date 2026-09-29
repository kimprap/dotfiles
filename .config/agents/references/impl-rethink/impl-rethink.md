# Implementation rethink

Continue in the same implementation child with the unchanged authority, task, semantic-attempt number, owned targets, effects, acceptance, and receiver.

1. Apply [`code-rethink.md`](code-rethink.md) to the current candidate.
2. Then apply [`test-rethink.md`](test-rethink.md).
3. Make one bounded correction pass for the concrete in-scope findings, if any.
4. Run the task's direct checks and changed-path smoke, then return one lean Handoff.

This is the only self-rethink for this candidate. Do not load a general rethink skill, request another self-rethink, broaden the task, or replace direct checks with reasoning.

This implementation candidate rethink is separate from execution recovery.
Execution retries use [`recovery-rethink.md`](recovery-rethink.md)
before every retry and do not create another implementation self-rethink.

Maintenance-only provenance: [`MAINTENANCE.md`](MAINTENANCE.md). Maintainers may consult it when changing this bundle; never load it during invocation or rethink, and assign it no runtime authority.