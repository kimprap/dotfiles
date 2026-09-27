# Native probe prompts

Fixed in-bundle prompts for the T1 native probe (spec acpx-omp-acp-trial/spec-v9). Each section between
`<!-- prompt:NAME -->` and `<!-- /prompt -->` is sent verbatim after `{{PLACEHOLDER}}` substitution.
No external reference is loaded. The only accepted reply is one final native `yield` call with explicit `data`.

<!-- prompt:canary -->
This is a transport probe. Follow these steps in order.

1. Write exactly one short sentence of your own about the weather.
2. Try to create the file `{{CANARY_PATH}}` containing the word `canary`, using a write tool if you have one, and also try the shell command `touch {{CANARY_PATH}}` using a bash tool if you have one. If those tools are unavailable or refused, just continue; do not look for workarounds.
3. Remember this token for later: `{{TOKEN}}`.
4. Finish by calling the `yield` tool exactly once with explicit `data` of this shape and nothing else:

Worked example (use your own sentence):

```json
{"data": {"kind": "probe-canary", "sentence": "It is a mild and cloudy day."}}
```
<!-- /prompt -->

<!-- prompt:reuse -->
This is the second probe step in the same session. Do not use any tools other than `yield`.

Finish by calling the `yield` tool exactly once with explicit `data` where `token` is the token you were asked to remember in the previous step (write `unknown` if you do not have it):

Worked example:

```json
{"data": {"kind": "probe-reuse", "token": "TOKEN-EXAMPLE-0000"}}
```
<!-- /prompt -->

<!-- prompt:short -->
This is a transport probe. Do not use any tools other than `yield`.

Write one short sentence of your own about rivers, and remember this token for later: `{{TOKEN}}`.

Finish by calling the `yield` tool exactly once with explicit `data` of this shape:

Worked example (use your own sentence):

```json
{"data": {"kind": "probe-short", "sentence": "Rivers carry water to the sea."}}
```
<!-- /prompt -->

<!-- prompt:restore -->
This is the next probe step in the same session. Do not use any tools other than `yield`.

Finish by calling the `yield` tool exactly once with explicit `data` where `token` is the token you were asked to remember in the previous step (write `unknown` if you do not have it):

Worked example:

```json
{"data": {"kind": "probe-restore", "token": "TOKEN-EXAMPLE-0000"}}
```
<!-- /prompt -->

<!-- prompt:reask -->
Your previous reply for this step was not accepted: {{DEFECT}}

Repeat the same step. The only accepted reply is one final call to the `yield` tool with explicit `data` of exactly this shape (`kind` must be `{{KIND}}` and `{{FIELD}}` must be a non-empty string):

```json
{{EXAMPLE}}
```
<!-- /prompt -->
