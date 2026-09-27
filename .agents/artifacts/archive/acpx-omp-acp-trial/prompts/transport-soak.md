# Transport soak prompts

Fixed in-bundle prompts for the T2 B1 native soak (spec acpx-omp-acp-trial/spec-v9). Each section between
`<!-- prompt:NAME -->` and `<!-- /prompt -->` is sent verbatim after `{{PLACEHOLDER}}` substitution.
No external reference is loaded and no reference directory is written. The only accepted reply is one final
native `yield` call with explicit `data`; ordinary text is never a reply.

<!-- prompt:soak-token -->
This is transport soak step {{EXPECTATION}} of 10 in this session. Do not use any tools other than `yield`.

Finish by calling the `yield` tool exactly once with explicit `data` where `kind` is `soak-token` and `token` is exactly `{{TOKEN}}` (copy it character for character).

Worked example (use the token given above, not this one):

```json
{"data": {"kind": "soak-token", "token": "S0-E0-EXAMPLE"}}
```
<!-- /prompt -->

<!-- prompt:soak-size -->
This is transport soak step {{EXPECTATION}} of 10 in this session. It tests delivery of one large result. Do not use any tools other than `yield`.

Build a text `payload` of about 48 KiB (at least 40000 characters) made of numbered lines, one per line, from `Line 0001` to `Line 0700`, each of the form:

`Line NNNN: {{TOKEN}} the quick brown fox jumps over the lazy dog.`

Then finish by calling the `yield` tool exactly once with explicit `data` where `kind` is `soak-size` and `payload` is that whole text. Do not shorten, summarize or elide the lines.

Worked example (shortened here only to show the shape; your payload must contain all 700 lines):

```json
{"data": {"kind": "soak-size", "payload": "Line 0001: S0-E0-EXAMPLE the quick brown fox jumps over the lazy dog.\nLine 0002: S0-E0-EXAMPLE the quick brown fox jumps over the lazy dog.\n..."}}
```
<!-- /prompt -->

<!-- prompt:reask -->
Your previous reply for this step was not accepted: {{DEFECT}}

Repeat the same step. The only accepted reply is one final call to the `yield` tool with explicit `data` of exactly this shape:

```json
{{EXAMPLE}}
```
<!-- /prompt -->
