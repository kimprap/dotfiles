// AC-MAPPING: the complete 29-obligation allocation (guard baseline
// 2026-09-23_reconcile-retrace-lean-redesign-spec.md "Keep unchanged").
// responsibility: "coded" = controller-enforced; "llm" = pre-run LLM
// responsibility carried by fixed prompts; "coded+llm" = both.
// enforcement: file#symbol locators; proof: mechanics case names (group:name)
// or retained-evidence JSON pointers. C2 keyword lines, C5 frames and every
// unadmitted/ordinary-output source are excluded by KB1.

const P = "prompts/semantic/reconcile-reviewer.md";
const S = "prompts/semantic/retrace-scope.md";
const C = "controller.mjs";

export const GUARD_MAPPING = Object.freeze([
  { id: "KR1", responsibility: "coded+llm", note: "LLM infers the candidate in the preserved order before the runner; the controller validates the exact approved five-field brief and rejects missing/ambiguous approval", enforcement: [`${C}#validateApproval`, `${P}#bootstrap`], proof: ["reconcile:reject-missing-approval", "reconcile:reject-invalid-mode", "reconcile:reject-artifact-with-conversation-fallback"] },
  { id: "KR2", responsibility: "coded", enforcement: [`${C}#validateApproval`, `${C}#applyCorrection`], proof: ["reconcile:reject-invalid-mode", "reconcile:reject-artifact-with-conversation-fallback", "reconcile:artifact-edit-application-closure"] },
  { id: "KR3", responsibility: "coded", enforcement: [`${C}#validateApproval`, `${C}#runReconcile`], proof: ["reconcile:reject-cap-zero", "reconcile:reject-cap-string-number", "reconcile:artifact-cap-one-closure-only-stops"] },
  { id: "KR4", responsibility: "coded+llm", enforcement: [`${C}#runReconcile`, `${P}#bootstrap`], proof: ["reconcile:revise-lazy-b-application-closure", "reconcile:a-first-valid-no-b"] },
  { id: "KR5", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:a-first-valid-no-b", "reconcile:revise-lazy-b-application-closure"] },
  { id: "KR6", responsibility: "coded+llm", enforcement: [`${C}#reviewTurn`, `${C}#expectResult`, `${P}#rethink`], proof: ["reconcile:revise-lazy-b-application-closure", "reconcile:source-need-continues-pass", "reconcile:a-first-valid-no-b"] },
  { id: "KR7", responsibility: "coded+llm", enforcement: [`${C}#runReconcile`, "lib/semantic/domain.mjs#validateResult", `${P}#bootstrap`], proof: ["reconcile:valid-recommendations-ignored", "reconcile:revise-correction-conflict-reasked", "window:review-valid-with-correction-conflicts"] },
  { id: "KR8", responsibility: "coded", enforcement: [`${C}#applyCorrection`, "lib/semantic/domain.mjs#validateResult"], proof: ["reconcile:noop-correction-reasked", "reconcile:artifact-nonunique-edit-reasked", "reconcile:artifact-edit-application-closure", "window:review-artifact-edits-shape"] },
  { id: "KR9", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:blocked-retry-then-valid", "reconcile:persistent-blocked-stops", "reconcile:a-first-valid-no-b"] },
  { id: "KR10", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:artifact-edit-application-closure", "reconcile:artifact-cap-one-closure-only-stops", "reconcile:artifact-validation-failure-no-rollback"] },
  { id: "KR11", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:artifact-drift-before-application-stops", "reconcile:artifact-final-reread-drift-stops"] },
  { id: "KR12", responsibility: "coded", note: "C4 amendment: shared three re-asks; fourth invalid return stops", enforcement: [`${C}#expectResult`, `${C}#runReconcile`], proof: ["reconcile:shared-c4-fourth-invalid-stops", "reconcile:c4-not-reset-by-source-need", "reconcile:c4-third-reask-recovers", "reconcile:repeated-source-request-stops", "reconcile:repeated-revise-pair-stops", "reconcile:delivery-uncertain-no-c4-no-replay"] },
  { id: "KR13", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:artifact-validation-failure-no-rollback", "reconcile:artifact-write-failure-stops", "reconcile:artifact-drift-before-application-stops"] },
  { id: "KR14", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:failed-disposal-blocks-success", "reconcile:a-first-valid-no-b"] },
  { id: "KR15", responsibility: "coded", enforcement: [`${C}#renderReconcile`], proof: ["reconcile:render-reviewer-text-verbatim", "reconcile:a-first-valid-no-b"] },
  { id: "KR16", responsibility: "coded", enforcement: [`${C}#runReconcile`], proof: ["reconcile:reject-report-only-artifact", "retrace:nested-report-only-reconcile-with-owned-reviewers"] },
  { id: "KT1", responsibility: "coded+llm", note: "invocation contract, finding eligibility and entry types are the evaluator's pre-run instructions; locator closure is coded", enforcement: [`${C}#validateScopeTable`, `${C}#runRetrace`, `${S}#evaluate`], proof: ["retrace:dependency-order-overlap-and-admitted-identity", "retrace:manifest-locator-outside-closure-reasked"] },
  { id: "KT2", responsibility: "coded", enforcement: [`${C}#validateScopeTable`], proof: ["retrace:reject-unapproved-or-cyclic-table", "retrace:dependency-order-overlap-and-admitted-identity"] },
  { id: "KT3", responsibility: "coded", enforcement: [`${C}#runRetrace`], proof: ["retrace:four-actor-slot-limit", "retrace:requires-depth-then-authored-order", "retrace:slot-frees-only-on-observed-disposal"] },
  { id: "KT4", responsibility: "coded", enforcement: [`${C}#runRetrace`], proof: ["retrace:dependency-order-overlap-and-admitted-identity", "retrace:unresolved-prerequisite-blocks-dependent-preserves-sibling", "retrace:scope-paused-nonterminal-continues", "retrace:repeated-paused-frontier-stops", "retrace:stale-at-acceptance-blocks-dependent", "retrace:blocker-disposition-is-unresolved"] },
  { id: "KT5", responsibility: "coded+llm", note: "status/freshness/outcome labels and aggregate columns are coded; report sections, method and readiness text are evaluator instructions", enforcement: [`${C}#runRetrace`, `${C}#aggregateRows`, `${S}#evaluate`], proof: ["retrace:final-freshness-invalidates-requires-dependents-only", "retrace:stale-at-acceptance-blocks-dependent", "retrace:blocker-disposition-is-unresolved", "retrace:manifest-locator-outside-closure-reasked"] },
  { id: "KB1", responsibility: "coded+llm", note: "trial-only amendment: the only reply source is the admitted native yield candidate of the owning request window", enforcement: ["lib/semantic/capture.mjs#closeRequest", "lib/native/window.mjs#RequestWindow", `${P}#bootstrap`, `${S}#evaluate`], proof: ["window:ordinary-output-is-not-a-reply", "window:foreign-and-null-owned-candidates-rejected", "window:pre-and-post-window-candidates-rejected", "window:two-terminal-submissions-first-wins", "window:malformed-missing-field"] },
  { id: "KS1", responsibility: "coded", enforcement: [`${C}#admitAtRoot`, "lib/native/window.mjs#RequestWindow"], proof: ["root-admission:root-admits-scope-owned-result", "root-admission:root-rejects-nested-review-result", "root-admission:root-rejects-foreign-owner", "window:two-terminal-submissions-first-wins"] },
  { id: "KS2", responsibility: "coded", enforcement: ["lib/semantic/capture.mjs#closeRequest", "lib/native/adapter.mjs#runRequest"], proof: ["window:retained-result-then-turn-failure", "window:failed-turn-without-result", "public:same-id-restore"] },
  { id: "KS3", responsibility: "coded", enforcement: ["lib/semantic/capture.mjs#closeRequest", "lib/semantic/capture.mjs#recoverObservation"], proof: ["window:missing-completion-at-closed-window", "window:missing-turn-result-window-unavailable", "public:observer-loss-recovered", "reconcile:delivery-uncertain-no-c4-no-replay"] },
  { id: "KS4", responsibility: "coded", enforcement: ["lib/native/adapter.mjs#closeAndObserve", `${C}#runRetrace`], proof: ["retrace:slot-frees-only-on-observed-disposal", "reconcile:failed-disposal-blocks-success", "public:observed-closes"] },
  { id: "KS5", responsibility: "coded", enforcement: [`${C}#runRetrace`], proof: ["retrace:dependent-failure-preserves-siblings", "retrace:unresolved-prerequisite-blocks-dependent-preserves-sibling"] },
  { id: "KS6", responsibility: "coded", enforcement: [`${C}#runRetrace`, `${C}#invariant`], proof: ["retrace:undisposed-children-fail-fast-snapshot", "retrace:scope-paused-nonterminal-continues", "retrace:nested-report-only-reconcile-with-owned-reviewers"] },
  { id: "KS7", responsibility: "coded", note: "D31 clause 9 verbatim: generic ADR-0002 collection contracts and the generic execution-recovery policy stay unchanged; the trial edits none of them and its custom-controller lifecycle checks are not weakened by their exemptions", enforcement: ["config/protected-sources.json", `${C}#invariant`], proof: ["evidence:/safety/protectedUnchanged", "retrace:undisposed-children-fail-fast-snapshot"] },
]);

export const GUARD_IDS = Object.freeze([
  ...Array.from({ length: 16 }, (_, i) => `KR${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `KT${i + 1}`),
  "KB1",
  ...Array.from({ length: 7 }, (_, i) => `KS${i + 1}`),
]);
