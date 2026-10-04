# Verification skills

Read this only when the human explicitly asks to create or maintain a verification skill: a project-local skill that lets an agent drive the real app the way a user does and capture proof.

## Reuse first

Extend an existing verification rule, skill, or harness before writing a new one. For example, Neovim checks in the dotfiles repo extend `.agents/rules/nvim-testing.md` and its helper `bin/nvim-headless` instead of adding a parallel skill.

## Create

1. Study the repo before asking the human. Find what users touch, how the app starts, how an agent can drive it (existing harness first), what evidence it can capture, and whether two copies can run side by side. Ask only about what the repo cannot show. If the base does not build or start, fix it or report the exact failure before writing anything. Done when each question has an answer from the repo or one named open question.
2. Write the skill with these sections, each grounded in what step 1 found, with no placeholders:
   - **Launch:** the exact start command, the ready signal, and teardown.
   - **Doctor:** one read-only health check that says whether this instance is worth driving.
   - **Drive:** the harness recipe with this repo's real commands and stable handles.
   - **Evidence:** what proof to capture and where it lives. Capture the action and the resulting state, not only the final screen; check side effects alongside what is visible; when the safe path is a dry run, check what it actually skips by watching what it does, not by trusting its name. Choose which proof a change needs by `skill://dev-implementation/references/test-value.md`; do not copy its rules here.
   - **Cleanup:** stop only what the run started and remove scratch state; never remove evidence.
   - **Helpers:** every script the skill ships is executable, and the skill body shows how to call it.
3. Start a feature map: an index plus 3–5 feature files for the main user-facing features. Each file has these sections: `Sub-features`, `How to get to it (user POV)`, `Driving it with <harness>`, and `Gotchas`. Done when the index lists exactly the feature files present.
4. Run the skill end to end once before handing it over: launch, doctor, drive one mapped feature, capture evidence, clean up. After cleanup, confirm the evidence still exists where the skill says. A skill that has never run is a draft, not a deliverable.

## Maintain

- Edit only the verification skill's own folder and the harness scripts it owns. Never edit app code.
- Tidy the index, read each feature's source, and do a required live run, even when the source looks clean. Run Doctor before the first drive and again after any failed or surprising drive.
- Fix outdated docs and gaps in the driving harness. Report app bugs without fixing them.
- Mark a feature unreachable only when you can name the missing prerequisite.
- End with `clean` (nothing to fix), `changed` (proven corrections made), or `blocked` (state exactly what stopped the run).

Neither workflow ships its result: open no PR and make no commit or push as part of the work. Shipping happens only on explicit human request, through `dev-shipping`.
