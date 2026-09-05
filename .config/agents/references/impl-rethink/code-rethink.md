# Code rethink

Re-examine only the current candidate and its changed callers under the unchanged approved contract.

1. Preserve approved behavior, safety, compatibility, accessibility, effects, and unrelated user work. Trace success, edge, error, and state-transition paths before changing code.
2. Reuse the existing owner, local pattern, standard library, native platform, or installed dependency before adding a new abstraction or concept.
3. Keep cyclomatic and control-flow complexity legible. Delete or skip code only when behavior remains intact and decision paths do not become harder to follow. Fewer files or lines is not an improvement when branches, modes, concepts, indirection, or hidden state increase.
4. Among eligible solutions, choose the lowest total lifecycle cost across ownership, state, integration, review, and maintenance—not merely the fewest files or lines.
5. Stay inside the declared targets and effects. Do not redesign authority, broaden scope, or perform unrelated cleanup.
6. If a production seam existed only to satisfy tests now rejected, remove it. Keep it only when it still earns its place in runtime behavior or architecture. Testability for those rejected tests is not remaining value.

Identify concrete defects or a strictly better in-scope replacement. Otherwise keep the candidate unchanged.