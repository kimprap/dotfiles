#!/usr/bin/env python3
"""Detect stale generic-engineering workflow contracts and preservation drift."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from compare_trace import compare_semantic_case


SCHEMA = "lean-stale-scan/v1"
STALE_NEEDLES = [
    "standard is the fallback",
    "three semantic attempts",
    "three attempt task budget",
    "three semantic attempt ceiling",
    "no fourth attempt",
    "compact uses dev-implementation then dev-verification",
    "compact uses an ordered separate reviewer",
    "compact uses a separate ordered reviewer attempt after verified",
    "compact binds two ordered semantic attempts",
    "compact uses one fresh non-implementer identity for two ordered semantic attempts",
    "after compact review, the backend screens",
    "compact work reaches this skill only when",
    "compact dispatches learning only after",
    "through bounded work, smoke, independent verification, neutral fan in, review,",
    "lineage, integration, final, or high consequence boundary using fresh read only",
    "planner-role-profile/v4",
    "canonical planner persona/projector",
    "When dispatching the canonical planner, also read",
    "wording mismatch is a same-outcome blocker",
    "rerun every parent criterion after repair",
    "advisory repair restarts verification",
    "review finding becomes a parent criterion",
    "Do not create a curation task, Handoff, trigger screen",
    "Every task has one implementation owner, output, receiver, target, acceptance criterion, and proof recipe",
    "Standard and high-consequence plans require a numbered profile tail",
    "A compact plan may include a profile tail",
    "Task Intent is optional",
    "Methods accepts ponytail",
    "Papercut capture schedules continual learning",
    "later review repeats the whole scope",
    "finding lineage is the file path",
    "a grant admits a repair finding",
    "verifier verdict becomes the review verdict",
    "completion reruns criterion proof",
    "rebuild the applicable project rule manifest",
    "dev-ask completion presentation",
]
REQUIRED_NEEDLES = [
    "compact is the default",
    "two semantic attempts",
    "compact never dispatches",
    "dev-implementation then completion-presentation",
    "observable changed-contract consumer",
    "complete causal impact map",
    "terminal advisories recorded as residual risk",
    "new maintenance outcome",
    "one in-conversation worker Common Handoff",
    "curation Handoff",
    "one short human Intent sentence",
    "Methods: none | tdd",
    "may omit the numbered profile tail or append one exact final suffix",
    "compact work may use a direct Task Contract without an Executor Plan",
    "Methods: tdd is explicit test-first authority",
    "After every work-task Common Handoff is emitted, apply this rule exactly once as a soft look",
    "No candidate means no skill or ledger access and no papercut output",
    "dispatches no learning",
    "Papercut is never a task, Methods token",
    "frozen acceptance cases, fixtures, oracles",
    "never independent verifier evidence",
    "backend freezes one action for every parent criterion",
    "verifier independently accepts or rejects",
    "original-initial is the one whole-scope discovery pass",
    "Paths are evidence, not identity",
    "disjoint outcome-relevant non-safety defect remains CHANGES REQUIRED",
    "authority-change-required",
    "exact URI and SHA-256",
    "binds each manifest exactly once",
    "executes zero criterion proof recipes",
    "Verifier receipts are inputs, never the review verdict",
    "one complete canonical surface-proof-recipe/v1 object",
    "doctor is readiness evidence only",
    "adapter presence does not disqualify compact",
    "recanonicalize each once-bound recipe",
    "final adapter digest and final canonical recipe",
    "normal example, boundary case, and failure case",
    "disabled from ordinary model invocation",
    "cannot create a missing adapter",
    "validate_recipe_generation(...)",
    "criterion → old recipe ID → new recipe ID → target-delta edge or none → fresh-or-reuse",
    "invalid current intake",
    "one fresh complete aggregate",
]
EXPECTED_DESCRIPTIONS = {
    ".config/agents/skills/dev-implementation/SKILL.md": (
        "Execute an approved direct contract or dependency-wired implementation tickets "
        "through bounded work, smoke, and evidence-backed completion. Profile-required "
        "independent verification, neutral fan-in, final review, and curation run only "
        "when the selected assurance profile or topology requires them. Defer compact "
        "Learning Candidates and own read-only backend lifecycle or terminal-evidence "
        "traces. Reject stale contracts; default cohesive work to one owner."
    ),
    ".config/agents/skills/dev-verification/SKILL.md": (
        "Independently verify declared acceptance criteria at an approved immutable target "
        "only when the selected assurance profile or topology requires independent "
        "verification. Produce a fresh aggregate verdict from fresh impacted proof and "
        "independently accepted exact unaffected evidence; never repair, reformat, merge, "
        "or trust worker conclusions."
    ),
}
CORE_SCAN_PATHS = [
    ".agents/AGENTS.md",
    ".config/agents/rules/plan.md",
    ".config/agents/rules/plan-impl-spec.md",
    ".config/agents/rules/papercut.md",
    ".config/agents/rules/plan-repo-storage.md",
    ".grok/rules/plan-repo-storage.md",
    ".config/agents/rules/plan-omp-transport.md",
    ".grok/rules/plan-omp-transport.md",
    ".config/agents/rules/plan-grok-transport.md",
    ".grok/rules/plan-grok-transport.md",
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-specification/SKILL.md",
    ".config/agents/skills/dev-ticketing/SKILL.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-handoff/SKILL.md",
    ".config/agents/skills/dev-tdd/SKILL.md",
    ".config/agents/skills/dev-verification/SKILL.md",
    ".config/agents/skills/dev-code-review/SKILL.md",
    ".config/agents/skills/dev-continual-learning/SKILL.md",
    ".config/agents/skills/surface-verification-adapter/SKILL.md",
    ".config/agents/skills/surface-verification-adapter/scripts/adapter_contract.py",
    ".config/agents/skills/create-surface-verification-adapter/SKILL.md",
    ".config/agents/skills/maintain-surface-verification-adapter/SKILL.md",
    ".config/agents/skills/init-ask/SKILL.md",
    ".config/agents/skills/continual-learning/SKILL.md",
    ".config/agents/skills/continual-learning/WORKFLOW.md",
    ".config/agents/skills/completion-presentation/SKILL.md",
    ".config/agents/skills/product-ask/SKILL.md",
    ".config/agents/skills/product-ask/WORKFLOW.md",
    ".config/agents/skills/papercut/SKILL.md",
    ".config/agents/skills/papercut/WORKFLOW.md",
    ".config/agents/skills/papercut/evals/evals.json",
    "docs/adr/0001-dev-workflow-authority-and-routing.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/0003-bounded-assurance-and-repair.md",
    "docs/adr/0004-canonical-discovery-and-continual-learning.md",
    "docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md",
    "docs/adr/0008-repository-agent-integration-setup.md",
    "docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md",
    "docs/adr/INDEX.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-ask/evals/evals.json",
]
EXECUTOR_PLAN_CASE_IDS = {
    "B-PLAN-TAIL-OMITTED",
    "B-T5-EXECUTOR-PLAN-CYCLE",
    "B-T5-EXECUTOR-PLAN-DANGLING",
    "B-T5-EXECUTOR-PLAN-GROK",
    "B-T5-EXECUTOR-PLAN-MISSING",
    "B-T5-EXECUTOR-PLAN-OMP",
    "R-COMPACT-PLAN-WITH-TAIL",
}
EXECUTOR_PLAN_SCOPED_PATHS = {
    ".config/agents/rules/plan.md",
    ".grok/rules/plan.md",
    ".config/agents/rules/plan-impl-spec.md",
    ".grok/rules/plan-impl-spec.md",
    ".config/agents/rules/plan-repo-storage.md",
    ".grok/rules/plan-repo-storage.md",
    ".config/agents/rules/plan-omp-transport.md",
    ".grok/rules/plan-omp-transport.md",
    ".config/agents/rules/plan-grok-transport.md",
    ".grok/rules/plan-grok-transport.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-implementation/scripts/executor_plan.py",
    ".config/agents/skills/dev-implementation/scripts/test_executor_plan.py",
    ".config/agents/skills/dev-implementation/scripts/fixtures/executor_plan/complete.md",
    ".config/agents/skills/dev-implementation/scripts/fixtures/executor_plan/fan_in.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/improve/references/plan-template.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/INDEX.md",
}
EXECUTOR_PLAN_OBSOLETE_NEEDLES = (
    "executor-plan-preflight/v1",
    "authority_outcome",
    "--context",
    "--consumer",
    "--local-root",
    "--local-plan",
    "repository projection",
    "exact <slug>-plan.md counterpart",
    "same-identity local counterpart",
    "same-identity session counterpart",
    "local authority and projection differ",
    "local-authority",
    "direct-repository",
)
PLAN_ARTIFACT_SCOPED_NEEDLES = {
    "bin/omp-copy-plan-artifact": (
        "omp-copy-plan-artifact sync",
        "expected operation 'sync'",
        "inspectHeaderBytes",
        "validatePlanBytes",
        "terminalLifecycleComplete",
    ),
    ".config/agents/harnesses/omp/extensions/plan-artifact-sync.js": (
        '["sync", "--slug"',
        "inspectHeaderBytes",
        "validatePlanBytes",
        "terminalLifecycleComplete",
    ),
}
REWRITE_IDS = {
    "B-ASSURANCE-REUSE-DRIFT",
    "B-ASSURANCE-REUSE-UNAFFECTED",
    "B-COMPACT",
    "B-COMPACT-CURATION-TRIGGER",
    "B-COMPACT-DEFERRED-LEARNING-CANDIDATE",
    "B-COMPLETION",
    "B-FULL",
    "B-LEARNING",
    "B-REVIEW",
    "B-REVIEW-WORDING-ADVISORY",
    "B-T4-CURATION-BLOCKED",
    "B-T4-CURATION-COMPACT-NOT-TRIGGERED",
    "B-T4-CURATION-DETERMINISTIC-FAILURE",
    "B-T4-CURATION-FLAKY",
    "B-T4-CURATION-INCONCLUSIVE",
    "B-T4-CURATION-NO-DURABLE",
    "B-T4-CURATION-SEMANTIC-FAILURE",
    "B-T4-CURATION-SEMANTIC-VERDICT",
    "B-T4-CURATION-SEMANTIC-VERDICT-MISSING",
    "B-T4-CURATION-TUPLE-DRIFT",
    "B-T4-CURATION-UNBOUND-CANDIDATE",
    "B-T4-LEARNING-BACKGROUND-NEAR-MISS",
    "B-T4-LEARNING-CALENDAR-NEAR-MISS",
    "B-T4-LEARNING-COUNT-NEAR-MISS",
    "B-T4-LEARNING-DEEP-EVENT",
    "B-T4-LEARNING-DEEP-EXPLICIT",
    "B-T4-LEARNING-STANDARD",
    "B-T4-LEARNING-USER-LEVEL-NEAR-MISS",
    "B-T4-PAPERCUT-CANDIDATE-BINDING",
    "B-T4-PAPERCUT-NARROW-AUTHORITY",
    "B-T4-PAPERCUT-SETTLEMENT-FIXED",
    "B-T4-PAPERCUT-SETTLEMENT-GLOBAL",
    "B-T4-PAPERCUT-SETTLEMENT-OPEN",
    "B-T4-PAPERCUT-SETTLEMENT-REJECTED",
    "B-T4-PAPERCUT-SETTLEMENT-SUPERSEDED",
    "B-T4-REPAIR-REMAINING-BLOCKER",
    "B-T5-COMPLETION-ASSURED",
    "B-T5-COMPLETION-MISSING-ASSURANCE",
    "B-T5-EXECUTOR-PLAN-CYCLE",
    "B-T5-EXECUTOR-PLAN-DANGLING",
    "B-T5-EXECUTOR-PLAN-GROK",
    "B-T5-EXECUTOR-PLAN-MISSING",
    "B-T5-EXECUTOR-PLAN-OMP",
    "B-T5-PARENT-PROFILE-DOWNGRADE",
    "L-DELEGATION",
    "L-FULL",
    "L-MUTATION",
    "L-ONE-OWNER",
    "R-APPROACH-REFINEMENT-NEAR-MISS-DIRECT",
    "R-ARCHITECTURE-NEAR-MISS",
    "R-ARTIFACT-LANE",
    "R-ARTIFACT-LANE-NEAR-MISS",
    "R-BUG",
    "R-BUG-NEAR-MISS",
    "R-COMPLETE",
    "R-COMPLETE-COMPACT-NO-LEARNING",
    "R-COMPLETE-NEAR-MISS",
    "R-DRIFT-NEAR-MISS",
    "R-GRILL-NEAR-MISS",
    "R-ORDINARY-COMPACT-DIRECT",
    "R-ORDINARY-COMPACT-NEAR-MISS-DISQUALIFIER",
    "R-ORDINARY-SIZE-ONLY",
    "R-OUTCOME-CONTINUATION",
    "R-REQUIREMENTS",
    "R-REQUIREMENTS-NEAR-MISS",
    "R-REVIEW-ADVISORY-MAINTENANCE",
    "R-ROUTE-CANDIDATES",
    "R-ROUTE-GATING-QUESTION-NEAR-MISS",
    "R-ROUTE-PRESENTATION-NEAR-MISS-INLINE",
    "R-T5-CANONICAL-DISCOVERY",
    "R-T5-ORDINARY-DIRECT-NO-EAGER-HISTORY",
    "R-TODO-PROJECTION-EQUIVALENT-A",
    "R-TODO-PROJECTION-EQUIVALENT-B",
    "R-TRIAGE-NEAR-MISS-PROJECT-TICKET",
    "R-UNCHANGED-HANDOFF",
    "R-WAYFINDER-NEAR-MISS",
}
ADDED_IDS = {
    "B-ASSURANCE-RECEIPT-COMPLETION",
    "B-ASSURANCE-GENERATION-CONFLICT",
    "B-ASSURANCE-RECIPE-CONSTRUCTION",
    "B-ASSURANCE-REUSE-DISPOSITIONS",
    "B-ASSURANCE-REUSE-DRIFT",
    "B-ASSURANCE-REUSE-UNAFFECTED",
    "B-COMPACT-PLAN-NO-TAIL",
    "B-PLAN-TAIL-OMITTED",
    "B-PLAN-TAIL-PROFILE",
    "B-REVIEW-SET-AGGREGATE-VERDICT",
    "B-REVIEW-SET-DISJOINT-ADVISORY",
    "B-REVIEW-SET-DISJOINT-OUTCOME",
    "B-REVIEW-SET-DISJOINT-SAFETY",
    "B-REVIEW-SET-GRANT-HYPOTHESIS-ONLY",
    "B-REVIEW-SET-IDENTITY-COLLISION",
    "B-REVIEW-SET-POST-VERIFIED-BLOCKER",
    "B-REVIEW-SET-RENAMED-CLOSURE",
    "B-REVIEW-SET-REPAIR-REGRESSION",
    "B-T4-CHECKPOINT-PROOF-CLOSE",
    "B-T4-COMPACT-WORTH-NOT-TRIGGERED",
    "B-T4-REVISION-WORTH-OPINION",
    "B-TASK-METHOD-TDD",
    "B-TERMINAL-PLAN-ARCHIVE-MATRIX",
    "R-COMPACT-PLAN-WITH-TAIL",
    "B-DWO-PAPERCUT-RECEIPTS",
    "B-DWO-TEST-VALUE",
    "B-DWO-UNDECLARED-MUTATION",
    "B-DWO-WORKER-CLOSURE",
    "R-DWO-TEST-AUDIT",
}
DWO_PROJECTION_PATHS = {
    ".config/agents/rules/plan-impl-spec.md",
    ".config/agents/rules/plan-omp-transport.md",
    ".config/agents/rules/plan-grok-transport.md",
    ".config/agents/rules/papercut.md",
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/orchestrator-role-profile.md",
    ".config/agents/skills/dev-implementation/references/plan-orchestration.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-handoff/SKILL.md",
    ".config/agents/skills/dev-code-review/SKILL.md",
    ".config/agents/skills/dev-continual-learning/SKILL.md",
    ".config/agents/skills/continual-learning/SKILL.md",
    ".config/agents/skills/continual-learning/WORKFLOW.md",
    ".config/agents/skills/dev-tdd/SKILL.md",
    ".config/agents/skills/completion-presentation/SKILL.md",
    ".config/agents/skills/product-ask/SKILL.md",
    ".config/agents/skills/product-ask/WORKFLOW.md",
    ".config/agents/skills/papercut/SKILL.md",
    ".config/agents/skills/papercut/WORKFLOW.md",
    "docs/adr/0001-dev-workflow-authority-and-routing.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/0003-bounded-assurance-and-repair.md",
    "docs/adr/0004-canonical-discovery-and-continual-learning.md",
    "docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md",
    "docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md",
    "docs/adr/INDEX.md",
}
DWO_STALE_PROJECTION_FRAGMENTS = (
    "grant counter",
    "grant cycle",
    "grant-scoped",
    "worth frame",
    "same-plan exhaustion record",
    "grant: pending",
    "Close disposition:",
    "Continue**, **Second opinion**, and **Close",
    "Continue / Second opinion / Close",
    '"papercut":',
    "parent-as-worker",
    "parent as worker",
    "root-as-worker",
    "root worker fallback",
    "root performs semantic work",
)
DWO_PLAN_ROOT_FALLBACK_FRAGMENTS = (
    "A shallow graph without one of those triggers remains one owner or a bounded batch",
    "uses an already approved, contract-preserving sequential or one-qualified-owner projection",
)
DWO_CONTINUATION_CASE_IDS = (
    "B-REVIEW-SET-GRANT-HYPOTHESIS-ONLY",
    "B-T4-REPAIR-REMAINING-BLOCKER",
    "B-T4-CHECKPOINT-PROOF-CLOSE",
    "B-T4-REVISION-WORTH-OPINION",
    "B-T4-COMPACT-WORTH-NOT-TRIGGERED",
)
DWO_SEMANTIC_CASE_FIXTURES = {
    "B-DWO-WORKER-CLOSURE": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "b-dwo-worker-closure/case.json"
    ),
    "R-DWO-TEST-AUDIT": (
        ".config/agents/skills/dev-ask/evals/fixtures/r-dwo-test-audit/case.json"
    ),
    "B-FULL": ".config/agents/skills/dev-ask/evals/fixtures/b-full/case.json",
    "B-T5-COMPLETION-ASSURED": (
        ".config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-assured/case.json"
    ),
    "B-T5-COMPLETION-MISSING-ASSURANCE": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "b-t5-completion-missing-assurance/case.json"
    ),
    "R-COMPLETE": ".config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json",
    "R-COMPLETE-COMPACT-NO-LEARNING": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "r-complete-compact-no-learning/case.json"
    ),
}
DWO_RESUME_CASE_IDS = (
    "B-FULL",
    "B-T5-COMPLETION-ASSURED",
    "B-T5-COMPLETION-MISSING-ASSURANCE",
)
DWO_RESUME_STALE_FRAGMENTS = (
    "grant counter",
    "attempt-or-grant",
)
DWO_RESUME_ACTIVE_PATHS = frozenset(DWO_RESUME_CASE_IDS) | frozenset(
    DWO_SEMANTIC_CASE_FIXTURES[case_id] for case_id in DWO_RESUME_CASE_IDS
)
DWO_PLAN_BACKED_CASE_IDS = (
    "B-COMPACT-PLAN-NO-TAIL",
    "B-PLAN-TAIL-OMITTED",
    "B-PLAN-TAIL-PROFILE",
)
DWO_COMPLETION_CASE_IDS = (
    "R-COMPLETE",
    "R-COMPLETE-COMPACT-NO-LEARNING",
    "B-COMPLETION",
    "L-MUTATION",
    "L-ONE-OWNER",
    "L-DELEGATION",
    "L-FULL",
    "B-T5-COMPLETION-ASSURED",
    "B-T4-PAPERCUT-CANDIDATE-BINDING",
    "B-T4-PAPERCUT-SETTLEMENT-FIXED",
    "B-T4-PAPERCUT-SETTLEMENT-REJECTED",
    "B-T4-PAPERCUT-SETTLEMENT-SUPERSEDED",
    "B-T4-PAPERCUT-SETTLEMENT-OPEN",
    "B-T4-PAPERCUT-SETTLEMENT-GLOBAL",
    "B-T4-PAPERCUT-NARROW-AUTHORITY",
    "B-ASSURANCE-RECEIPT-COMPLETION",
)
TERMINAL_ARCHIVE_CALLER_PATHS = {
    ".config/agents/rules/plan.md",
    ".config/agents/rules/plan-omp-transport.md",
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-implementation/references/plan-orchestration.md",
}
TERMINAL_ARCHIVE_STALE_FRAGMENTS = (
    "active or archive locator",
    "may proceed before archive",
    "resume from binds that active file",
    "active plan durability",
)
TERMINAL_ARCHIVE_SEMANTIC_CASE_FIXTURES = {
    "B-COMPACT-PLAN-NO-TAIL": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "b-compact-plan-no-tail/case.json"
    ),
    "B-PLAN-TAIL-OMITTED": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "b-plan-tail-omitted/case.json"
    ),
    "B-PLAN-TAIL-PROFILE": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "b-plan-tail-profile/case.json"
    ),
    "R-COMPLETE": ".config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json",
    "R-COMPLETE-COMPACT-NO-LEARNING": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "r-complete-compact-no-learning/case.json"
    ),
    "B-TERMINAL-PLAN-ARCHIVE-MATRIX": (
        ".config/agents/skills/dev-ask/evals/fixtures/"
        "b-terminal-plan-archive-matrix/case.json"
    ),
}
TERMINAL_ARCHIVE_REQUIRED_EVENTS = {
    "B-COMPACT-PLAN-NO-TAIL": (
        "state:complete|owner:backend|output:mechanical admission passed for "
        "distinct child, target ownership, closure, smoke coverage, Handoff, and "
        "papercut accounting; compact tail absent",
        "state:plan-terminal|owner:backend|output:PLAN-C changed from IN_PROGRESS "
        "to parser-valid DONE; exact terminal bytes sha256:"
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc bound",
        "plan-archive:postcondition|owner:backend|output:PLAN-C archive action 1; "
        "active absent; archive byte-identical sha256:"
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        "snapshot:completion-terminal|owner:backend|output:successful normal "
        "completion terminal; presentation count 1; resume from "
        ".agents/plans/archive/2030-01-02-0304_plan-c.md@sha256:"
        "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
        "#completion-summary; automatic portfolio-audit dispatches 0; audit "
        "epilogue absent",
    ),
    "B-PLAN-TAIL-OMITTED": (
        "state:complete|owner:backend|output:terminal dev-continual-learning "
        "accounted once; omitted tail consumed by backend scheduling; no audit coupling",
        "state:plan-terminal|owner:backend|output:PLAN-O changed from IN_PROGRESS "
        "to parser-valid DONE; exact terminal bytes sha256:"
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bound",
        "plan-archive:postcondition|owner:backend|output:PLAN-O archive action 1; "
        "active absent; archive byte-identical sha256:"
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "snapshot:completion-terminal|owner:backend|output:successful normal "
        "completion terminal; presentation count 1; resume from "
        ".agents/plans/archive/2030-01-02-0305_plan-o.md@sha256:"
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        "#completion-summary; automatic portfolio-audit dispatches 0; audit "
        "epilogue absent",
    ),
    "B-PLAN-TAIL-PROFILE": (
        "state:complete|owner:backend|output:numbered dev-continual-learning "
        "consumed once; no duplicate backend tail",
        "state:plan-terminal|owner:backend|output:PLAN-P changed from IN_PROGRESS "
        "to parser-valid DONE; exact terminal bytes sha256:"
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bound",
        "plan-archive:postcondition|owner:backend|output:PLAN-P archive action 1; "
        "active absent; archive byte-identical sha256:"
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        "snapshot:completion-terminal|owner:backend|output:successful normal "
        "completion terminal; presentation count 1; resume from "
        ".agents/plans/archive/2030-01-02-0306_plan-p.md@sha256:"
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        "#completion-summary; automatic portfolio-audit dispatches 0; audit "
        "epilogue absent",
    ),
    "R-COMPLETE": (
        "terminal-evidence-check",
        "plan-archive:validated|owner:dev-ask|output:PLAN-R active absent; archive "
        "byte-identical sha256:"
        "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd; "
        "archive actions 0",
        "completion-normalization",
        "completion-input:resume-archive|owner:dev-ask|output:"
        ".agents/plans/archive/2030-01-02-0307_plan-r.md@sha256:"
        "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
        "#completion-summary",
        "completion-input:fenced-same-turn",
        "completion-presented:Completed,Evidence,Continuation; Change scope list; "
        "Key artifacts list; Change scope list; Key artifacts list; Papercuts none; "
        "Learning NO DURABLE LEARNING; immutable Common Handoff; no Route",
    ),
    "R-COMPLETE-COMPACT-NO-LEARNING": (
        "terminal-evidence-check",
        "planless-archive-control|owner:dev-ask|output:repository plan lookups 0; "
        "archive actions 0; archive receipts 0; synthetic plans 0",
        "completion-normalization",
    ),
    "B-TERMINAL-PLAN-ARCHIVE-MATRIX": (
        "state:plan-terminal|owner:backend|output:PLAN-DONE changed from IN_PROGRESS "
        "to parser-valid DONE; exact terminal bytes sha256:"
        "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee bound",
        "plan-archive:postcondition|owner:backend|output:PLAN-DONE archive action 1; "
        "active absent; archive byte-identical sha256:"
        "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "snapshot:completion-terminal|owner:backend|output:PLAN-DONE successful "
        "normal completion terminal; presentation count 1; resume from "
        ".agents/plans/archive/2030-01-02-0308_plan-done.md@sha256:"
        "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        "#completion-summary",
        "state:plan-terminal|owner:backend|output:PLAN-CLOSED changed from "
        "IN_PROGRESS to parser-valid CLOSED; exact terminal bytes sha256:"
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff bound",
        "plan-archive:postcondition|owner:backend|output:PLAN-CLOSED archive action 1; "
        "active absent; archive byte-identical sha256:"
        "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "snapshot:cancellation-close|owner:backend|output:PLAN-CLOSED cancellation "
        "close count 1 after archive; completed presentations 0",
        "state:already-terminal|owner:backend|output:PLAN-ALREADY-CLOSED intake "
        "parser-valid CLOSED; transitions 0; repository plan lookups 0; archive "
        "actions 0; reconciliations 0; historical sweeps 0; storage mutations 0; "
        "completed presentations 0; path identity unchanged; content identity unchanged",
        "plan-archive:blocker|owner:backend|output:both identity paths present; "
        "storage retries 0; second Handoffs 0; visible storage blocker; existing "
        "bytes preserved; overwrites 0; completed presentations 0; cancellation "
        "closes 0; semantic continuations 0",
        "plan-archive:blocker|owner:backend|output:divergent archive; storage "
        "retries 0; second Handoffs 0; visible storage blocker; existing bytes "
        "preserved; overwrites 0; completed presentations 0; cancellation closes 0; "
        "semantic continuations 0",
        "plan-archive:blocker|owner:backend|output:parser-invalid terminal bytes; "
        "storage retries 0; second Handoffs 0; visible storage blocker; existing "
        "bytes preserved; overwrites 0; completed presentations 0; cancellation "
        "closes 0; semantic continuations 0",
        "plan-archive:blocker|owner:backend|output:unsafe file kind; storage retries "
        "0; second Handoffs 0; visible storage blocker; existing bytes preserved; "
        "overwrites 0; completed presentations 0; cancellation closes 0; semantic "
        "continuations 0",
        "plan-archive:blocker|owner:backend|output:source drift; storage retries 0; "
        "second Handoffs 0; visible storage blocker; existing bytes preserved; "
        "overwrites 0; completed presentations 0; cancellation closes 0; semantic "
        "continuations 0",
        "plan-archive:blocker|owner:backend|output:target drift; storage retries 0; "
        "second Handoffs 0; visible storage blocker; existing bytes preserved; "
        "overwrites 0; completed presentations 0; cancellation closes 0; semantic "
        "continuations 0",
        "plan-archive:blocker|owner:backend|output:uncertain postcondition; storage "
        "retries 0; second Handoffs 0; visible storage blocker; existing bytes "
        "preserved; overwrites 0; completed presentations 0; cancellation closes 0; "
        "semantic continuations 0",
        "planless-archive-control|owner:backend|output:repository plan lookups 0; "
        "archive actions 0; archive receipts 0; synthetic plans 0",
    ),
}
TERMINAL_ARCHIVE_REQUIRED_FORBIDDEN = {
    "B-COMPACT-PLAN-NO-TAIL": (
        "archive-before-assurance",
        "completion-before-archive",
        "active-plan-resume",
        "historical-sweep",
        "second-archive-action",
    ),
    "B-PLAN-TAIL-OMITTED": (
        "archive-before-assurance",
        "completion-before-archive",
        "active-plan-resume",
        "historical-sweep",
        "second-archive-action",
    ),
    "B-PLAN-TAIL-PROFILE": (
        "archive-before-assurance",
        "completion-before-archive",
        "active-plan-resume",
        "historical-sweep",
        "second-archive-action",
    ),
    "R-COMPLETE": (
        "normalization-before-archive-validation",
        "active-plan-resume",
        "presenter-owned-archival",
        "archive-retry",
    ),
    "R-COMPLETE-COMPACT-NO-LEARNING": (
        "plan-archive:",
        "repository-plan-resume",
        "synthetic-plan-created",
    ),
    "B-TERMINAL-PLAN-ARCHIVE-MATRIX": (
        "completion-before-archive",
        "cancellation-close-before-archive",
        "active-plan-resume",
        "historical-sweep",
        "archive-overwrite",
        "storage-retry",
        "semantic-continuation-after-blocker",
        "presenter-owned-archival",
        "second-archive-action",
        "second-Handoff",
        "new-archive-receipt-schema",
    ),
}

DTA_AUDIT_REGISTRY_PATH = ".config/agents/skills/dev-test-audit/evals/evals.json"
DTA_AUDIT_CASE_IDS = (
    "DTA-DISCOVERY",
    "DTA-DISCOVERY-NEAR-MISS",
    "DTA-INDEPENDENT-PAIR",
    "DTA-DISAGREEMENT-EVIDENCE",
    "DTA-TRANSPORT-UNAVAILABLE",
    "DTA-READ-ONLY",
    "DTA-BOUNDED-INDEX",
    "DTA-UNKNOWN-PRESERVED",
    "DTA-PARTIAL-BOUNDARY",
    "DTA-CHANGED-TESTS-ONLY-NEAR-MISS",
)
DTA_COMPLETION_CASE_IDS = (
    "B-COMPACT",
    "B-COMPACT-PLAN-NO-TAIL",
    "B-FULL",
    "B-PLAN-TAIL-OMITTED",
    "B-PLAN-TAIL-PROFILE",
    "R-COMPLETE",
    "R-COMPLETE-COMPACT-NO-LEARNING",
    "B-T5-COMPLETION-ASSURED",
    "B-T5-COMPLETION-MISSING-ASSURANCE",
)
DTA_SELECTED_FIXTURE_PATHS = {
    ".config/agents/skills/dev-ask/evals/fixtures/b-dwo-worker-closure/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/r-dwo-test-audit/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/b-compact/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/b-compact-plan-no-tail/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/b-full/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-omitted/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-profile/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/"
    "r-complete-compact-no-learning/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/"
    "b-t5-completion-assured/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/"
    "b-t5-completion-missing-assurance/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/b-review/case.json",
    ".config/agents/skills/dev-ask/evals/fixtures/"
    "b-review-wording-advisory/case.json",
}
DTA_ACTIVE_EXECUTABLE_PATHS = {
    ".config/agents/skills/dev-ask/SKILL.md",
    ".config/agents/skills/dev-ask/WORKFLOW.md",
    ".config/agents/skills/dev-ask/evals/evals.json",
    ".config/agents/skills/dev-implementation/SKILL.md",
    ".config/agents/skills/dev-implementation/references/worker-closure.md",
    ".config/agents/skills/dev-implementation/references/plan-orchestration.md",
    ".config/agents/skills/dev-implementation/references/compact-checklist.md",
    ".config/agents/skills/dev-code-review/SKILL.md",
    ".config/agents/skills/dev-test-audit/SKILL.md",
    ".config/agents/skills/dev-test-audit/references/audit-protocol.md",
    ".config/agents/skills/dev-test-audit/references/opinion-agent.md",
    DTA_AUDIT_REGISTRY_PATH,
    "docs/adr/0001-dev-workflow-authority-and-routing.md",
    "docs/adr/0002-executor-plans-and-orchestration.md",
    "docs/adr/0003-bounded-assurance-and-repair.md",
    "docs/adr/0004-canonical-discovery-and-continual-learning.md",
    "docs/adr/INDEX.md",
} | DTA_SELECTED_FIXTURE_PATHS
DTA_HOST_BINDING_ALLOWLIST = {
    ".config/agents/skills/dev-test-audit/SKILL.md",
    ".config/agents/harnesses/omp/agents/test-audit-opinion-a.md",
    ".config/agents/harnesses/omp/agents/test-audit-opinion-b.md",
    ".config/agents/harnesses/omp/config.yml",
    ".config/agents/harnesses/grok/config.toml",
}
DTA_HOST_BINDING_FRAGMENTS = (
    "openai-codex/",
    "xai-oauth/",
    "gpt-5.6-sol",
    "grok-4.6",
    "@test_audit_opinion_",
    "test-audit-opinion-a",
    "test-audit-opinion-b",
)
DTA_SOURCE_BRANDING_FRAGMENTS = (
    "dietrichgebert/ponytail",
    "cursor/plugins",
    "thermo-nuclear-code-quality-review",
)
DTA_COMPLETION_AUDIT_FRAGMENTS = (
    "after plan completion",
    "only after plan done",
    "post-completion portfolio audit",
    "completion-gated audit",
    "completion tail dispatches dev-test-audit",
    "completion-presentation then dev-test-audit",
    "run dev-test-audit after completion",
    "audit after completion",
    "completed plan required for audit",
)
DTA_BLANKET_CLOSURE_FRAGMENTS = (
    "admit every quality finding",
    "repair every simplification proposal",
    "quality correction without exact replacement",
    "all quality findings repaired",
    "every finding is repaired",
    "all findings repaired",
)
DTA_IDENTITY_ALIAS_FRAGMENTS = (
    "worker-closure/v2",
    "test-audit/v2",
    "test-value/v2",
    "no-new-contract disposition",
    "no-new-contract enum",
    "repository-partial schema field",
)
DTA_NEGATING_FRAGMENTS = (
    " no ",
    " never ",
    " absent",
    " zero",
    " reject",
    " block",
    " stop",
    " ineligible",
    " cannot ",
    " not an eligible",
)
DTA_PROTECTED_SECTIONS = {
    (
        "docs/adr/0001-dev-workflow-authority-and-routing.md",
        "D14 — Separate shipping authority",
    ): "6fbf3635ae509400b85c6fe0190126e502159df75b6f555a9ea9911d0097a629",
    (
        "docs/adr/0003-bounded-assurance-and-repair.md",
        "D28 — Permanent test portfolio value",
    ): "e56ffe40b4c392b3b3b5502d8f8f5b4ac79d5db6560010e283ad27e18c2cbc26",
}
PRESERVED = {
    ".config/agents/skills/dev-ask/evals/fixtures/l-mutation/counter.txt": "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
    ".agents/papercuts.json": "6653bf3c12330e7985c9f23dbd1fe84a62c3d6abb0b30a4330f958db0ed83d57",
    "/Users/kim/.agents/AGENTS.md": "1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9",
    ".config/agents/AGENTS.md": "1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9",
    ".agents/GENERIC-AGENTS.md": "3ce780b05a9dbcd62aae05c3c4fbde39b8c7e05d72f074b2c4eaa51a92c6093c",
    ".config/agents/skills/papercut/scripts/papercut_ledger.py": "2c1d15522362d2aebcb1de58635dc8fa61454ebe6567d61f820f2b552f97e431",
    "docs/adr/0005-product-development-workflow-and-prd-authority.md": "5c4978ccb225ea04a65dde02742c1b39c2366ef27ca848d73ee1a70a1624a9ff",
    "docs/adr/0008-repository-agent-integration-setup.md": "e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3",
    ".config/agents/skills/dev-shipping/SKILL.md": "0b472f2c25a0313e8efde1323f18e9b9e0a64a7b7f9e5e7f94d660e29fdb7966",
    ".agents/plans/archive/2026-06-16-1608_skill-craft.md": "877a604d6e26d7a810e343a35c2ce1f160daef64666456795b33c24d684fddde",
    ".agents/plans/archive/2026-06-17-0005_IMPROVE_skill-craft.md": "97ee26d4bfb564e60ca7c9d948374640bab85853e8fa2de71813a3af63c4753a",
    ".agents/plans/archive/2026-06-29-1412_agent-harness-craft-skills.md": "20699baa5b51122b276e30f802bbe771a6568d8f3d715286e0a922d1e783ff62",
    ".agents/plans/archive/2026-07-09-1503_atlas-umbrella-scaffold.md": "27072beb3718b99f94ee69a3a60a07168c08fd2ddd248e4f81661b1f28b50574",
    ".agents/plans/archive/2026-07-13-1504_plan-rule-skill-refinement.md": "4ce06bb710f632dc4419822b07a57fa0eb68d8ae725dd3132101202e80097869",
    ".agents/plans/archive/2026-07-15-1018_directory-access-probe.md": "1e441982448ca643b1914e5337ec25f746464900d1254cb38ec573f339046fe2",
    ".agents/plans/archive/2026-07-16-1445_migrate-workspaces-to-dev.md": "cbc3de411f0094ce4b16c5c0adf1c7c47ed078c2b89b77d972690eb08f081d73",
    ".agents/plans/archive/2026-07-26-1752_sync-matt-skills-wayfinder.md": "5f99c251266782bf9bde632a00633ae116c1e700107e7cd7af5ad4b783852ebb",
    ".agents/plans/archive/2026-07-28-0033_chart-agent-workflow-map.md": "611474f8a4dc5669b38bdb591a9cd09a6de768ca78caf2997fe231a8b86a8d34",
    ".agents/plans/archive/2026-07-28-2309_eng-flow-implementation.md": "9c62737b95cc90a1deefa668c26901a0d90cc144dfb90cb5dfa0fdfd3d2ff90e",
    ".agents/plans/archive/2026-07-30-1356_IMPROVE_standard.md": "2ba0fa24e556225eef1ac7e0caade2b669eefa98b028765dd410710ae1887309",
    ".agents/plans/archive/2026-07-30-2344_refine-workflow-prefix-naming.md": "224743e0c4099934273f4c599f44c5109e68545f43dca8fe101f6590f3da9021",
    ".agents/plans/archive/2026-07-31-0024_rename-engineering-skills-to-dev.md": "320e545a6513dfa68f6f3fec51fbad99366b7611a7c4b5d50dc9e31684372b2f",
    ".agents/plans/archive/2026-07-31-1231_rename-dev-flow-interface.md": "db7c0269c1e2913cdae5cc0ad71bfa9b4749efcd4bcdd49056270c4c0e30ec78",
    ".agents/plans/archive/2026-07-31-1523_proportional-dev-workflow.md": "19eda4f15d386b806e7f3be699f0d41c8e8484f7f02c0fcc7a399ebd8fd4f7f8",
    ".agents/plans/archive/2026-08-09-1616_dev-workflow-convergence-refinement.md": "7056607c7c486772a7ad98de75655d028f1552b8d88bb2989ea1eb442fde56b8",
    ".agents/plans/archive/2026-08-12-0107_self-improving-evaluation-papercuts.md": "ed39b611624835aab4e8a82d580ed6cbbc5571e8bc96e74cbdde6e6fd7093677",
    ".agents/plans/archive/2026-08-12-2202_automated-papercut-lifecycle-init-ask.md": "79c00f11b8cbaf48db42337d2d0119b159dce8125aec17caa19883a0ab82aadb",
    ".agents/plans/archive/2026-08-13-0119_dev-workflow-mechanical-convergence.md": "b665889323a832cb01be64537567a36e08f741da9fbb3015daa3b77338f99470",
    ".agents/plans/archive/2026-08-13-1230_IMPROVE_standard.md": "740d596b09db3a7bd93dc9dbb4ede7753e3ed9edb01647b7c6cc014da23c9373",
    ".agents/plans/archive/2026-08-13-1603_dev-workflow-lean-ordinary-path.md": "da59251da8ac829554890bf701b718078187d63196627159195f831be3f525b7",
    ".agents/plans/archive/2026-08-15-1744_receipt-skill-digest-binding.md": "c6b775d9df918f7c369b4ef972c734aa0f0834a576688a7d3b4ffd152e848ce1",
    ".agents/plans/archive/2026-08-16-1459_restore-pre-prep-lean-tree.md": "e16601cc982feb2363d4ec3e9b37365e5d03406e42317b81760566926e244072",
    ".agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md": "512b29347572a2aef557a905f8a768e61675fec4127feeced34488bcb44fb375",
    ".agents/plans/archive/2026-08-17-1428_assurance-relevance-and-proof-scope.md": "1f5601782b72e3757c49161be3ccf0b3ab4a25694cf4c46e11df44eb2ba25eee",
    ".agents/plans/archive/2026-08-17-2347_rethink-skill.md": "c6331688fa99878987726cd9316b66577ad5d5061b5a83b51638af9f811534e2",
    ".agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md": "bdf7a7432ecec22f5bb51e5e7b66ef2d39461b0086e116b621cc25d9fd057755",
}


class ScanError(RuntimeError):
    pass


def normalize(value: str) -> str:
    normalized = value.casefold().replace("`", "")
    for arrow in ("->", "→", "⇒"):
        normalized = normalized.replace(arrow, " then ")
    for separator in ("-", "–", "—", "_"):
        normalized = normalized.replace(separator, " ")
    return " ".join(normalized.split())


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repository_root() -> Path:
    return Path(__file__).resolve().parents[5]


def load_registry(root: Path) -> dict[str, dict[str, Any]]:
    path = root / ".config/agents/skills/dev-ask/evals/evals.json"
    try:
        registry = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ScanError(f"cannot parse registry: {error}") from error
    cases = registry.get("cases") if isinstance(registry, dict) else None
    if not isinstance(cases, list):
        raise ScanError("registry cases must be a list")
    result: dict[str, dict[str, Any]] = {}
    for case in cases:
        if not isinstance(case, dict) or not isinstance(case.get("id"), str):
            raise ScanError("registry contains a malformed case")
        if case["id"] in result:
            raise ScanError(f"duplicate case id: {case['id']}")
        result[case["id"]] = case
    return result


def scan_paths(root: Path) -> list[str]:
    cases = load_registry(root)
    expected_changed = REWRITE_IDS | ADDED_IDS
    missing = sorted(expected_changed - cases.keys())
    if missing:
        raise ScanError(f"changed fixture ids missing from registry: {missing}")
    fixture_paths: list[str] = []
    for case_id in sorted(expected_changed):
        fixture_dir = cases[case_id].get("fixture_dir")
        if not isinstance(fixture_dir, str):
            raise ScanError(f"fixture_dir missing for {case_id}")
        fixture_paths.append(
            f".config/agents/skills/dev-ask/evals/{fixture_dir}/case.json"
        )
    return list(
        dict.fromkeys(
            CORE_SCAN_PATHS
            + sorted(
                EXECUTOR_PLAN_SCOPED_PATHS
                | PLAN_ARTIFACT_SCOPED_NEEDLES.keys()
                | DWO_PROJECTION_PATHS
                | DTA_ACTIVE_EXECUTABLE_PATHS
            )
            + fixture_paths
        )
    )


def executor_plan_fixture_paths(cases: dict[str, dict[str, Any]]) -> set[str]:
    paths: set[str] = set()
    for case_id in EXECUTOR_PLAN_CASE_IDS:
        fixture_dir = cases[case_id].get("fixture_dir")
        if not isinstance(fixture_dir, str):
            raise ScanError(f"fixture_dir missing for {case_id}")
        paths.add(f".config/agents/skills/dev-ask/evals/{fixture_dir}/case.json")
    return paths


def exact_obsolete_hits(
    path: str, text: str, *, force_executor_scope: bool = False
) -> list[dict[str, Any]]:
    if not force_executor_scope and path not in (
        EXECUTOR_PLAN_SCOPED_PATHS | PLAN_ARTIFACT_SCOPED_NEEDLES.keys()
    ):
        return []
    needles = list(EXECUTOR_PLAN_OBSOLETE_NEEDLES)
    needles.extend(PLAN_ARTIFACT_SCOPED_NEEDLES.get(path, ()))
    hits: list[dict[str, Any]] = []
    for line_number, source in enumerate(text.splitlines(), 1):
        for needle in needles:
            if needle in source:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": needle,
                        "text": source,
                    }
                )
    return hits


def executor_plan_case_hits(cases: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    hits: list[dict[str, Any]] = []
    for case_id in sorted(EXECUTOR_PLAN_CASE_IDS):
        serialized = json.dumps(cases[case_id], ensure_ascii=False, indent=2)
        hits.extend(
            exact_obsolete_hits(
                f".config/agents/skills/dev-ask/evals/evals.json#{case_id}",
                serialized,
                force_executor_scope=True,
            )
        )
    return hits


def dwo_projection_hits(path: str, text: str) -> list[dict[str, Any]]:
    if path not in DWO_PROJECTION_PATHS:
        return []
    hits: list[dict[str, Any]] = []
    for line_number, folded, source in active_normalized_lines(text.splitlines()):
        for fragment in DWO_STALE_PROJECTION_FRAGMENTS:
            if normalize(fragment) in folded:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": f"removed DWO projection: {fragment}",
                        "text": source,
                    }
                )
        if (
            "full orchestration" in folded
            or "plan-backed" in folded
            or "executor plan" in folded
        ):
            for fragment in DWO_PLAN_ROOT_FALLBACK_FRAGMENTS:
                if normalize(fragment) in folded:
                    hits.append(
                        {
                            "path": path,
                            "line": line_number,
                            "needle": f"plan root-worker fallback: {fragment}",
                            "text": source,
                        }
                    )
        if "one owner sequential" in folded and (
            "plan backed" in folded
            or "approved parser valid implementation plan" in folded
        ):
            hits.append(
                {
                    "path": path,
                    "line": line_number,
                    "needle": "plan-backed one-owner-sequential selection",
                    "text": source,
                }
            )
    return hits


def terminal_archive_projection_hits(path: str, text: str) -> list[dict[str, Any]]:
    if path not in TERMINAL_ARCHIVE_CALLER_PATHS:
        return []
    hits: list[dict[str, Any]] = []
    for line_number, folded, source in active_normalized_lines(text.splitlines()):
        for fragment in TERMINAL_ARCHIVE_STALE_FRAGMENTS:
            if normalize(fragment) in folded:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": f"stale terminal archive fallback: {fragment}",
                        "text": source,
                    }
                )
    return hits


def dwo_contract_hit(path: str, needle: str, text: str) -> dict[str, Any]:
    return {"path": path, "line": 0, "needle": needle, "text": text}


def terminal_archive_registry_contract_hits(
    root: Path, cases: dict[str, dict[str, Any]]
) -> list[dict[str, Any]]:
    hits: list[dict[str, Any]] = []
    for case_id, fixture_relative in TERMINAL_ARCHIVE_SEMANTIC_CASE_FIXTURES.items():
        fixture_path = root / fixture_relative
        try:
            fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as error:
            raise ScanError(
                f"cannot parse terminal archive fixture {fixture_relative}: {error}"
            ) from error
        comparison = compare_semantic_case(cases, case_id, fixture)
        for mismatch in comparison["mismatches"]:
            hits.append(
                dwo_contract_hit(
                    fixture_relative,
                    f"terminal archive semantic case parity: {mismatch}",
                    case_id,
                )
            )

    for case_id, expected_events in TERMINAL_ARCHIVE_REQUIRED_EVENTS.items():
        case = cases.get(case_id)
        if case is None:
            hits.append(
                dwo_contract_hit(case_id, "required terminal archive case", "<missing>")
            )
            continue
        events = case.get("required_events")
        if not isinstance(events, list) or any(
            not isinstance(event, str) for event in events
        ):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "terminal archive required_events must be a string list",
                    repr(events),
                )
            )
            continue
        positions: list[int] = []
        complete = True
        for event in expected_events:
            count = events.count(event)
            if count != 1:
                complete = False
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        f"terminal archive required event count 1: {event}",
                        f"count={count}",
                    )
                )
            else:
                positions.append(events.index(event))
        if complete and positions != sorted(positions):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "terminal archive event order",
                    repr(positions),
                )
            )

        forbidden = case.get("forbidden_events")
        if not isinstance(forbidden, list) or any(
            not isinstance(event, str) for event in forbidden
        ):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "terminal archive forbidden_events must be a string list",
                    repr(forbidden),
                )
            )
        else:
            for event in TERMINAL_ARCHIVE_REQUIRED_FORBIDDEN[case_id]:
                if forbidden.count(event) != 1:
                    hits.append(
                        dwo_contract_hit(
                            case_id,
                            f"terminal archive forbidden event count 1: {event}",
                            f"count={forbidden.count(event)}",
                        )
                    )

        for event in events:
            lowered = event.casefold()
            if (
                "resume" in lowered
                and ".agents/plans/" in event
                and ".agents/plans/archive/" not in event
            ):
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        "active-plan terminal Resume from",
                        event,
                    )
                )

        if case_id == "R-COMPLETE-COMPACT-NO-LEARNING":
            exact_control = expected_events[1]
            for event in events:
                if (
                    event.startswith("planless-archive-control|")
                    and event != exact_control
                ) or event.startswith("plan-archive:"):
                    hits.append(
                        dwo_contract_hit(
                            case_id,
                            "planless archive behavior must remain zero",
                            event,
                        )
                    )
        if case_id == "B-TERMINAL-PLAN-ARCHIVE-MATRIX":
            exact_control = expected_events[-1]
            controls = [
                event
                for event in events
                if event.startswith("planless-archive-control|")
            ]
            if controls != [exact_control]:
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        "matrix planless archive behavior must remain zero",
                        repr(controls),
                    )
                )

    matrix = cases.get("B-TERMINAL-PLAN-ARCHIVE-MATRIX", {})
    expected = matrix.get("expected") if isinstance(matrix, dict) else None
    if not isinstance(expected, dict) or (
        expected.get("mode") != "read-only terminal lifecycle matrix"
        or expected.get("first_owner") != "backend"
        or expected.get("owners") != ["backend"]
        or expected.get("route") != "dev-implementation backend"
    ):
        hits.append(
            dwo_contract_hit(
                "B-TERMINAL-PLAN-ARCHIVE-MATRIX",
                "matrix mode and backend ownership",
                repr(expected),
            )
        )
    return hits


def dwo_resume_projection_hits(path: str, text: str) -> list[dict[str, Any]]:
    if path not in DWO_RESUME_ACTIVE_PATHS:
        return []
    folded = normalize(text)
    return [
        dwo_contract_hit(
            path,
            f"removed resume state: {fragment}",
            text,
        )
        for fragment in DWO_RESUME_STALE_FRAGMENTS
        if normalize(fragment) in folded
    ]


def dwo_registry_contract_hits(
    root: Path, cases: dict[str, dict[str, Any]]
) -> list[dict[str, Any]]:
    hits: list[dict[str, Any]] = []
    semantic_fixtures: dict[str, Any] = {}
    for case_id, fixture_relative in DWO_SEMANTIC_CASE_FIXTURES.items():
        fixture_path = root / fixture_relative
        try:
            fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as error:
            raise ScanError(
                f"cannot parse DWO semantic fixture {fixture_relative}: {error}"
            ) from error
        semantic_fixtures[case_id] = fixture
        comparison = compare_semantic_case(cases, case_id, fixture)
        for mismatch in comparison["mismatches"]:
            hits.append(
                dwo_contract_hit(
                    fixture_relative,
                    f"semantic case parity: {mismatch}",
                    case_id,
                )
            )

    if "R-COMPLETE-NEAR-MISS" in DWO_SEMANTIC_CASE_FIXTURES:
        hits.append(
            dwo_contract_hit(
                "R-COMPLETE-NEAR-MISS",
                "near miss excluded from semantic parity map",
                repr(DWO_SEMANTIC_CASE_FIXTURES),
            )
        )
    dta_dev_case_needles = {
        "B-DWO-WORKER-CLOSURE": (
            "planless same-context owner",
            "plan-backed task child",
            "eligible fresh-child attempt two",
            "admitted Build-repair worker",
            "correctness, preservation, effects, and owned acceptance",
            "first-sufficient solution ladder",
            "candidate-local structural regression",
            "correctness repair adds code or complexity",
            "quality correction only with exact surface",
            "round counts 1, 2, and 2",
            "no third round",
            "unique keep, redundant merge, unsupported remove",
            "no-new-contract",
            "untouched portfolio selectors absent",
            "closure and final test settlement precede task-local smoke",
            "audit opinions invoke worker closure zero times",
        ),
        "R-DWO-TEST-AUDIT": (
            "explicit user request",
            "external-scheduler request",
            "completed-plan provenance is absent",
            "content-addressed working-tree target",
            "complete repository or complete named-subsystem",
            "changed-tests-only, incomplete, stale, and moving",
            "dispatches 0",
            "controller-supplied adapter-table identity",
            "transport-unavailable for explicit audit only",
            "deterministic index union",
            "starts fresh through dev-ask",
            "one-context cleanup planless",
            "uses new Executor Plan",
        ),
    }
    for case_id, needles in dta_dev_case_needles.items():
        case = cases.get(case_id)
        if case is None:
            hits.append(dwo_contract_hit(case_id, "required DTA case", "<missing>"))
            continue
        serialized = normalize(json.dumps(case, ensure_ascii=False))
        for needle in needles:
            if normalize(needle) not in serialized:
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        f"DTA semantic contract: {needle}",
                        serialized,
                    )
                )

    for case_id in DTA_COMPLETION_CASE_IDS:
        case = cases.get(case_id)
        if case is None:
            hits.append(
                dwo_contract_hit(case_id, "required DTA completion case", "<missing>")
            )
            continue
        serialized = normalize(json.dumps(case, ensure_ascii=False))
        for needle in (
            "automatic portfolio-audit dispatches 0",
            "audit epilogue absent",
        ):
            if normalize(needle) not in serialized:
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        f"terminal completion contract: {needle}",
                        serialized,
                    )
                )
    missing_assurance = normalize(
        json.dumps(cases["B-T5-COMPLETION-MISSING-ASSURANCE"], ensure_ascii=False)
    )
    if normalize("audit cannot bypass") not in missing_assurance:
        hits.append(
            dwo_contract_hit(
                "B-T5-COMPLETION-MISSING-ASSURANCE",
                "missing assurance audit bypass control",
                missing_assurance,
            )
        )

    review_needles = {
        "B-REVIEW": (
            "FIND-CALLER",
            "FIND-SUITE",
            "material suite degradation",
            "CHANGES REQUIRED with FIND-CALLER and FIND-SUITE only",
            "exactly one Standards/Specification review",
        ),
        "B-REVIEW-WORDING-ADVISORY": (
            "ADV-STRUCTURE",
            "ADV-TEST-NONMATERIAL",
            "no parent, fixed-contract, or consumer harm",
            "suite degradation is not material",
            "one Standards/Specification review",
        ),
    }
    for case_id, needles in review_needles.items():
        serialized = normalize(json.dumps(cases[case_id], ensure_ascii=False))
        for needle in needles:
            if normalize(needle) not in serialized:
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        f"review classification contract: {needle}",
                        serialized,
                    )
                )

    for case_id in DWO_RESUME_CASE_IDS:
        fixture_relative = DWO_SEMANTIC_CASE_FIXTURES[case_id]
        case = cases[case_id]
        active = {
            key: case.get(key)
            for key in ("criterion", "expected", "inputs", "required_events", "rubric")
        }
        hits.extend(
            dwo_resume_projection_hits(
                case_id,
                json.dumps(active, ensure_ascii=False),
            )
        )
        fixture = semantic_fixtures[case_id]
        fixture_active = {
            "inputs": fixture.get("inputs") if isinstance(fixture, dict) else None
        }
        hits.extend(
            dwo_resume_projection_hits(
                fixture_relative,
                json.dumps(fixture_active, ensure_ascii=False),
            )
        )

    assurance_case_needles = {
        "B-ASSURANCE-RECIPE-CONSTRUCTION": (
            "lifecycle identity changes produce zero recipe ID changes",
            "only the already-listed digest changes and URI set remains exact",
        ),
        "B-ASSURANCE-GENERATION-CONFLICT": (
            "recipe_generation_binding_conflict",
            "verifier dispatches=0",
            "proof invocations=0",
        ),
        "B-ASSURANCE-REUSE-UNAFFECTED": (
            "AC-A → PR-A-OLD → PR-A-NEW → "
            "(file://target-a, sha256:old-a, sha256:new-a) → fresh",
            "AC-B → PR-B → PR-B → none → reuse",
            "fresh aggregate VERIFIED over complete current AC-A and AC-B set",
        ),
        "B-ASSURANCE-REUSE-DRIFT": (
            "PR-B invocations=1 fresh",
            "INCONCLUSIVE before proof",
            "proof invocations=0",
        ),
        "B-ASSURANCE-REUSE-DISPOSITIONS": (
            "missing prior aggregate → all-fresh",
            "ambiguous edge → all-fresh",
            "approved semantic change → all-fresh",
            "unapproved semantic change → authority-change-required",
            "AC-A → PR-A-OLD → PR-A-NEW → "
            "(file://target-a, sha256:old-a, sha256:new-a) → fresh",
            "AC-B → PR-B → PR-B → none → reuse",
        ),
    }
    for case_id, needles in assurance_case_needles.items():
        case = cases.get(case_id)
        if case is None:
            hits.append(
                dwo_contract_hit(case_id, "required assurance case", "<missing>")
            )
            continue
        serialized = normalize(json.dumps(case, ensure_ascii=False))
        for needle in needles:
            if normalize(needle) not in serialized:
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        f"assurance contract: {needle}",
                        serialized,
                    )
                )

    for case_id in DWO_CONTINUATION_CASE_IDS:
        events = cases[case_id].get("required_events", [])
        serialized = "\n".join(events) if isinstance(events, list) else ""
        stale = (
            "grant cycle",
            "worth frame",
            "human checkpoint action",
            "close disposition",
            "grant:",
            "opinion:",
        )
        for needle in stale:
            if needle.casefold() in serialized.casefold():
                hits.append(
                    dwo_contract_hit(
                        case_id,
                        f"removed continuation state: {needle}",
                        serialized,
                    )
                )
        if (
            "no state change" not in serialized
            or "continuation receipt" not in serialized
        ):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "changed-hypothesis continuation controls",
                    serialized,
                )
            )

    for case_id in DWO_PLAN_BACKED_CASE_IDS:
        case = cases[case_id]
        expected = case.get("expected", {})
        events = "\n".join(case.get("required_events", []))
        if expected.get("mode") != "full orchestration":
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "plan-backed full orchestration mode",
                    repr(expected.get("mode")),
                )
            )
        if "downgrade none" not in events or "distinct" not in events:
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "plan-backed no-downgrade distinct-child evidence",
                    events,
                )
            )
        if "one-owner-sequential" in events:
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "plan-backed one-owner-sequential selection",
                    events,
                )
            )

    downgrade = cases["B-T5-PARENT-PROFILE-DOWNGRADE"]
    downgrade_events = "\n".join(downgrade.get("required_events", []))
    if (
        downgrade.get("expected", {}).get("outcome")
        != "plan-backed downgrade rejected as transport-unavailable"
        or "one-owner-sequential" in downgrade_events
    ):
        hits.append(
            dwo_contract_hit(
                "B-T5-PARENT-PROFILE-DOWNGRADE",
                "plan-backed downgrade rejection",
                downgrade_events,
            )
        )

    for case_id in DWO_COMPLETION_CASE_IDS:
        case = cases[case_id]
        active = {
            key: case.get(key)
            for key in ("criterion", "expected", "inputs", "required_events", "rubric")
        }
        serialized = json.dumps(active, ensure_ascii=False)
        active_text = "\n".join(
            [
                str(case.get("criterion", "")),
                str(case.get("inputs", {}).get("request", "")),
                *[str(item) for item in case.get("required_events", [])],
                *[str(item) for item in case.get("rubric", [])],
            ]
        )
        if (
            '"papercut":' in active_text
            or "normalized papercut" in active_text.casefold()
        ):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "scalar completion papercut",
                    serialized,
                )
            )
        if "papercuts" not in serialized.casefold():
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "plural completion papercuts",
                    serialized,
                )
            )
        if (
            '"changed":' in active_text
            or "one to three changed artifacts" in active_text.casefold()
            or "outcome, changed" in active_text.casefold()
        ):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "legacy completion changed field",
                    serialized,
                )
            )
        if "completion-input:scope-key-artifacts" not in serialized:
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "completion scope and key artifacts",
                    serialized,
                )
            )
        if (
            "completion-input:resume-summary-index" not in serialized
            or "exact target manifest reference" not in serialized.casefold()
        ):
            hits.append(
                dwo_contract_hit(
                    case_id,
                    "completion summary resume index",
                    serialized,
                )
            )

    completion_path = (
        root / ".config/agents/skills/completion-presentation/evals/evals.json"
    )
    completion = json.loads(completion_path.read_text(encoding="utf-8"))
    for case in completion.get("evals", []):
        serialized = json.dumps(case, ensure_ascii=False)
        raw_text = (
            str(case.get("prompt", "")) + "\n" + str(case.get("expected_output", ""))
        )
        case_id = str(case.get("id"))
        if case_id == "CP-INCOMPLETE-STOP":
            lowered = raw_text.casefold()
            if '"papercut":' not in raw_text or "scalar" not in lowered:
                hits.append(
                    dwo_contract_hit(
                        str(completion_path.relative_to(root)),
                        "scalar papercut near miss",
                        case_id,
                    )
                )
            if (
                '"changed"' not in raw_text
                or "scalar change_scope" not in lowered
                or "scalar key_artifacts" not in lowered
                or "completion summary missing the exact manifest reference"
                not in lowered
            ):
                hits.append(
                    dwo_contract_hit(
                        str(completion_path.relative_to(root)),
                        "scope artifact and summary near misses",
                        case_id,
                    )
                )
            continue
        if '"papercut":' in raw_text or '"papercuts":' not in raw_text:
            hits.append(
                dwo_contract_hit(
                    str(completion_path.relative_to(root)),
                    "completion eval plural papercuts",
                    case_id,
                )
            )
        if (
            '"changed":' in raw_text
            or "- Changed:" in raw_text
            or '"change_scope":' not in raw_text
            or '"key_artifacts":' not in raw_text
            or "- **Change scope**" not in raw_text
            or "- **Key artifacts**" not in raw_text
        ):
            hits.append(
                dwo_contract_hit(
                    str(completion_path.relative_to(root)),
                    "completion eval scope and key artifacts",
                    case_id,
                )
            )
        if (
            "#completion-summary" not in raw_text
            or "exact applicable manifest reference" not in raw_text.casefold()
        ):
            hits.append(
                dwo_contract_hit(
                    str(completion_path.relative_to(root)),
                    "completion eval summary resume index",
                    case_id,
                )
            )

    product_path = root / ".config/agents/skills/product-ask/evals/evals.json"
    product = json.loads(product_path.read_text(encoding="utf-8"))
    for case in product.get("evals", []):
        serialized = json.dumps(case, ensure_ascii=False)
        if (
            "presenter-papercut:" in serialized
            or "presenter-papercuts" not in serialized
        ):
            hits.append(
                dwo_contract_hit(
                    str(product_path.relative_to(root)),
                    "product plural papercuts",
                    str(case.get("id")),
                )
            )
        if (
            "presenter-changed" in serialized
            or "presenter-change-scope" not in serialized
            or "presenter-key-artifacts" not in serialized
        ):
            hits.append(
                dwo_contract_hit(
                    str(product_path.relative_to(root)),
                    "product scope and key artifacts",
                    str(case.get("id")),
                )
            )
        if (
            "presenter-summary-index" not in serialized
            or "#completion-summary" not in serialized
        ):
            hits.append(
                dwo_contract_hit(
                    str(product_path.relative_to(root)),
                    "product summary resume index",
                    str(case.get("id")),
                )
            )

    papercut_path = root / ".config/agents/skills/papercut/evals/evals.json"
    papercut = json.loads(papercut_path.read_text(encoding="utf-8"))
    papercut_ids = {case.get("id") for case in papercut.get("evals", [])}
    required_papercut_ids = {
        "P-POST-WORK-HANDOFF",
        "P-ROOT-FALLBACK",
        "P-RECEIPT-ORDER",
    }
    if not required_papercut_ids <= papercut_ids:
        hits.append(
            dwo_contract_hit(
                str(papercut_path.relative_to(root)),
                "per-child fallback and receipt-order papercut cases",
                repr(sorted(papercut_ids)),
            )
        )
    return hits

def dta_audit_registry_hits(root: Path) -> list[dict[str, Any]]:
    path = root / DTA_AUDIT_REGISTRY_PATH
    try:
        registry = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ScanError(f"cannot parse DTA audit registry: {error}") from error
    evals = registry.get("evals") if isinstance(registry, dict) else None
    if not isinstance(evals, list):
        raise ScanError("DTA audit registry evals must be a list")
    ids = [case.get("id") for case in evals if isinstance(case, dict)]
    hits: list[dict[str, Any]] = []
    if tuple(ids) != DTA_AUDIT_CASE_IDS:
        hits.append(
            dwo_contract_hit(
                DTA_AUDIT_REGISTRY_PATH,
                "exact ten-case DTA audit inventory",
                repr(ids),
            )
        )
    cases = {
        case["id"]: case
        for case in evals
        if isinstance(case, dict) and isinstance(case.get("id"), str)
    }
    case_needles = {
        "DTA-DISCOVERY": (
            "content-addressed working-tree manifest",
            "completed-plan provenance is optional",
        ),
        "DTA-DISCOVERY-NEAR-MISS": (
            "changed-tests-only scope is ineligible",
            "dispatch count zero",
            "unfinished plan status alone",
        ),
        "DTA-INDEPENDENT-PAIR": (
            "controller-supplied exact adapter-table identity",
            "fresh and distinct",
            "no peer output",
        ),
        "DTA-DISAGREEMENT-EVIDENCE": (
            "deterministic evidence rule",
            "rather than counting votes",
        ),
        "DTA-TRANSPORT-UNAVAILABLE": (
            "binding attestation mismatch",
            "stop only the explicit audit",
        ),
        "DTA-READ-ONLY": (
            "Cleanup authority: none",
            "fresh dev-ask maintenance classification",
            "routes the bounded cohesive settled one-context request planless",
            "new Executor Plan",
        ),
        "DTA-BOUNDED-INDEX": (
            "1200 selectors",
            "T7, T900, T1000",
        ),
        "DTA-UNKNOWN-PRESERVED": (
            "Aggregate unknown and preserve the test",
            "fresh dev-ask maintenance classification",
        ),
        "DTA-PARTIAL-BOUNDARY": (
            "complete named-subsystem",
            "partial relative to the repository",
            "without adding a schema field",
        ),
        "DTA-CHANGED-TESTS-ONLY-NEAR-MISS": (
            "changed-tests-only intake before opinion dispatch",
            "dispatch count is zero",
        ),
    }
    for case_id, needles in case_needles.items():
        case = cases.get(case_id)
        if case is None:
            hits.append(
                dwo_contract_hit(
                    DTA_AUDIT_REGISTRY_PATH,
                    f"required audit case: {case_id}",
                    "<missing>",
                )
            )
            continue
        serialized = normalize(json.dumps(case, ensure_ascii=False))
        for needle in needles:
            if normalize(needle) not in serialized:
                hits.append(
                    dwo_contract_hit(
                        DTA_AUDIT_REGISTRY_PATH,
                        f"{case_id} contract: {needle}",
                        serialized,
                    )
                )
    return hits


def heading(line: str) -> tuple[int, str] | None:
    match = re.match(r"^(#{1,6})\s+(.*?)\s*$", line)
    if not match:
        return None
    return len(match.group(1)), match.group(2)


def active_normalized_lines(
    lines: list[str], *, excluded_heading_prefixes: tuple[str, ...] = ()
) -> list[tuple[int, str, str]]:
    active: list[tuple[int, str, str]] = []
    skipped_level: int | None = None
    normalized_exclusions = tuple(
        normalize(prefix) for prefix in excluded_heading_prefixes
    )
    for line_number, line in enumerate(lines, 1):
        parsed = heading(line)
        if parsed:
            level, text = parsed
            if skipped_level is not None and level <= skipped_level:
                skipped_level = None
            folded_heading = normalize(text)
            if (
                folded_heading == normalize("Rejected alternatives / why not")
                or folded_heading.startswith("historical")
                or any(
                    folded_heading.startswith(prefix)
                    for prefix in normalized_exclusions
                )
            ):
                skipped_level = level
                continue
        if skipped_level is not None:
            continue
        folded = normalize(line)
        if "rejected alternative" in folded or "superseded by" in folded:
            continue
        active.append((line_number, folded, line))
    return active


def dta_negated(folded: str) -> bool:
    padded = f" {folded} "
    return any(fragment in padded for fragment in DTA_NEGATING_FRAGMENTS)

def dta_active_fragment(folded: str, fragment: str) -> bool:
    normalized_fragment = normalize(fragment)
    return any(
        normalized_fragment in clause and not dta_negated(clause)
        for clause in re.split(r"[.;!?]+", folded)
    )

def dta_changed_tests_only_active(folded: str) -> bool:
    fragment = normalize("changed-tests-only")
    matching_clauses = [
        clause for clause in re.split(r"[.;!?]+", folded) if fragment in clause
    ]
    positive_markers = (" eligible", " admit", " accept", " dispatch", " intake")
    if any(
        not dta_negated(clause)
        and any(marker in f" {clause} " for marker in positive_markers)
        for clause in matching_clauses
    ):
        return True
    return bool(matching_clauses) and not dta_negated(folded)


def dta_executable_lines(path: str, text: str) -> list[tuple[int, str, str]]:
    if not path.endswith(".json"):
        excluded = (
            ("evidence", "source revisions") if path.startswith("docs/adr/") else ()
        )
        return active_normalized_lines(
            text.splitlines(), excluded_heading_prefixes=excluded
        )
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return active_normalized_lines(text.splitlines())

    strings: list[str] = []

    def collect(value: Any, *, key: str | None = None) -> None:
        if key in {"id", "absent_capabilities", "forbidden_events"}:
            return
        if isinstance(value, dict):
            for child_key, child in value.items():
                collect(child, key=child_key)
        elif isinstance(value, list):
            for child in value:
                collect(child)
        elif isinstance(value, str):
            strings.extend(value.splitlines() or [""])

    collect(payload)
    return [
        (line_number, normalize(source), source)
        for line_number, source in enumerate(strings, 1)
    ]


def dta_active_contract_hits(path: str, text: str) -> list[dict[str, Any]]:
    if path not in DTA_ACTIVE_EXECUTABLE_PATHS:
        return []
    hits: list[dict[str, Any]] = []
    for line_number, folded, source in dta_executable_lines(path, text):
        for fragment in DTA_COMPLETION_AUDIT_FRAGMENTS:
            if dta_active_fragment(folded, fragment):
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": f"stale completion-gated audit: {fragment}",
                        "text": source,
                    }
                )
        for fragment in DTA_BLANKET_CLOSURE_FRAGMENTS:
            if dta_active_fragment(folded, fragment):
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": f"blanket closure admission: {fragment}",
                        "text": source,
                    }
                )
        for fragment in DTA_IDENTITY_ALIAS_FRAGMENTS:
            if normalize(fragment) in folded:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": f"identity or schema alias: {fragment}",
                        "text": source,
                    }
                )
        if dta_changed_tests_only_active(folded):
            hits.append(
                {
                    "path": path,
                    "line": line_number,
                    "needle": "changed-tests-only audit intake",
                    "text": source,
                }
            )
        for fragment in DTA_SOURCE_BRANDING_FRAGMENTS:
            if normalize(fragment) in folded:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": f"source branding in executable prompt: {fragment}",
                        "text": source,
                    }
                )
        if path not in DTA_HOST_BINDING_ALLOWLIST:
            for fragment in DTA_HOST_BINDING_FRAGMENTS:
                if fragment.casefold() in source.casefold():
                    hits.append(
                        {
                            "path": path,
                            "line": line_number,
                            "needle": f"host binding outside allowlist: {fragment}",
                            "text": source,
                        }
                    )
    return hits


def protected_section_bytes(text: str, title: str) -> bytes:
    lines = text.splitlines(keepends=True)
    start: int | None = None
    level: int | None = None
    end = len(lines)
    for index, line in enumerate(lines):
        parsed = heading(line.rstrip("\r\n"))
        if parsed is None:
            continue
        current_level, current_title = parsed
        if start is None:
            if normalize(current_title) == normalize(title):
                start = index
                level = current_level
            continue
        if level is not None and current_level <= level:
            end = index
            break
    if start is None:
        raise ScanError(f"protected section heading missing: {title}")
    return "".join(lines[start:end]).encode("utf-8")


def scan_text(path: str, text: str) -> tuple[list[dict[str, Any]], set[str]]:
    hits: list[dict[str, Any]] = []
    seen_required: set[str] = set()
    for line_number, folded, source in active_normalized_lines(text.splitlines()):
        for needle in STALE_NEEDLES:
            if normalize(needle) in folded:
                hits.append(
                    {
                        "path": path,
                        "line": line_number,
                        "needle": needle,
                        "text": source,
                    }
                )
        for needle in REQUIRED_NEEDLES:
            if normalize(needle) in folded:
                seen_required.add(needle)
    return hits, seen_required


def frontmatter_description(text: str) -> str | None:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    end = next(
        (index for index in range(1, len(lines)) if lines[index].strip() == "---"), None
    )
    if end is None:
        return None
    for index in range(1, end):
        match = re.match(r"^description:\s*(.*)$", lines[index])
        if not match:
            continue
        value = match.group(1).strip()
        if value in (">", "|", ">-", "|-", ">+", "|+"):
            parts: list[str] = []
            for following in lines[index + 1 : end]:
                if following and not following[0].isspace():
                    break
                parts.append(following.strip())
            return " ".join(parts)
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            value = value[1:-1]
        return value
    return None


def scan_repository(root: Path) -> dict[str, Any]:
    hits: list[dict[str, Any]] = []
    required_seen: set[str] = set()
    cases = load_registry(root)
    executor_fixture_paths = executor_plan_fixture_paths(cases)
    paths = scan_paths(root)
    for relative in paths:
        path = root / relative
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            hits.append(
                {
                    "path": relative,
                    "line": 0,
                    "needle": "readable scanned path",
                    "text": str(error),
                }
            )
            continue
        path_hits, path_required = scan_text(relative, text)
        hits.extend(path_hits)
        required_seen.update(path_required)
        hits.extend(dwo_projection_hits(relative, text))
        hits.extend(terminal_archive_projection_hits(relative, text))
        hits.extend(dta_active_contract_hits(relative, text))
        if (
            relative in EXECUTOR_PLAN_SCOPED_PATHS
            or relative in PLAN_ARTIFACT_SCOPED_NEEDLES
            or relative in executor_fixture_paths
        ):
            hits.extend(exact_obsolete_hits(relative, text, force_executor_scope=True))
        if relative in EXPECTED_DESCRIPTIONS:
            actual = frontmatter_description(text)
            if actual is None or normalize(actual) != normalize(
                EXPECTED_DESCRIPTIONS[relative]
            ):
                hits.append(
                    {
                        "path": relative,
                        "line": 1,
                        "needle": "exact profile-aware frontmatter description",
                        "text": actual or "<missing>",
                    }
                )
    hits.extend(executor_plan_case_hits(cases))
    hits.extend(dwo_registry_contract_hits(root, cases))
    hits.extend(terminal_archive_registry_contract_hits(root, cases))
    hits.extend(dta_audit_registry_hits(root))
    missing_required = sorted(set(REQUIRED_NEEDLES) - required_seen)
    return {
        "schema": SCHEMA,
        "status": "pass" if not hits and not missing_required else "fail",
        "hits": hits,
        "missing_required": missing_required,
        "scanned": paths,
    }


def preserve_check(root: Path) -> dict[str, Any]:
    hits: list[dict[str, Any]] = []
    scanned: list[str] = []
    for raw, expected in PRESERVED.items():
        path = Path(raw) if Path(raw).is_absolute() else root / raw
        scanned.append(raw)
        try:
            actual = sha256_file(path)
        except OSError as error:
            hits.append(
                {"path": raw, "line": 0, "needle": expected, "text": str(error)}
            )
            continue
        if actual != expected:
            hits.append(
                {
                    "path": raw,
                    "line": 0,
                    "needle": expected,
                    "text": actual,
                }
            )
    for (raw, title), expected in DTA_PROTECTED_SECTIONS.items():
        scanned.append(f"{raw}#{title}")
        path = root / raw
        try:
            text = path.read_text(encoding="utf-8")
            actual = hashlib.sha256(protected_section_bytes(text, title)).hexdigest()
        except (OSError, UnicodeError, ScanError) as error:
            hits.append(
                {
                    "path": raw,
                    "line": 0,
                    "needle": expected,
                    "text": str(error),
                }
            )
            continue
        if actual != expected:
            hits.append(
                {
                    "path": raw,
                    "line": 0,
                    "needle": expected,
                    "text": actual,
                }
            )
    return {
        "schema": SCHEMA,
        "status": "pass" if not hits else "fail",
        "hits": hits,
        "missing_required": [],
        "scanned": scanned,
    }


def description_matches(path: str, value: str) -> bool:
    expected = EXPECTED_DESCRIPTIONS[path]
    return normalize(value) == normalize(expected)


def run_selftest(root: Path) -> dict[str, Any]:
    checks: list[str] = []
    current_router = (root / ".config/agents/skills/dev-ask/SKILL.md").read_text(
        encoding="utf-8"
    )
    compact_line = next(
        (
            line
            for line in current_router.splitlines()
            if "Compact uses `dev-implementation` then `completion-presentation`"
            in line
        ),
        None,
    )
    if compact_line is None:
        raise ScanError("current compact arrow-form source sentence is unavailable")
    for needle in STALE_NEEDLES:
        source = needle
        if needle == "compact uses dev-implementation then dev-verification":
            source = compact_line.replace(
                "`completion-presentation`", "`dev-verification`"
            )
        hits, _ = scan_text("selftest", source)
        if len(hits) != 1 or hits[0]["needle"] != needle:
            raise ScanError(f"stale-needle self-test failed: {needle}")
        checks.append(f"stale:{needle}")
    all_required = "\n".join(REQUIRED_NEEDLES)
    hits, seen = scan_text("selftest", all_required)
    if hits or seen != set(REQUIRED_NEEDLES):
        raise ScanError("required-needle positive self-test failed")
    for omitted in REQUIRED_NEEDLES:
        source = "\n".join(item for item in REQUIRED_NEEDLES if item != omitted)
        hits, seen = scan_text("selftest", source)
        if hits or omitted in seen or seen != set(REQUIRED_NEEDLES) - {omitted}:
            raise ScanError(f"required-needle omission self-test failed: {omitted}")
        checks.append(f"required:{omitted}")
    old_implementation = (
        "Execute an approved direct contract or dependency-wired implementation tickets "
        "through bounded work, smoke, independent verification, neutral fan-in, review, "
        "curation, and evidence-backed completion."
    )
    old_verification = (
        "Independently verify declared acceptance criteria at an approved immutable lineage, "
        "integration, final, or high-consequence boundary using fresh read-only evidence."
    )
    for path, old in (
        (".config/agents/skills/dev-implementation/SKILL.md", old_implementation),
        (".config/agents/skills/dev-verification/SKILL.md", old_verification),
    ):
        other = next(
            value for key, value in EXPECTED_DESCRIPTIONS.items() if key != path
        )
        if description_matches(path, old):
            raise ScanError(f"unqualified description unexpectedly passed: {path}")
        if description_matches(path, other):
            raise ScanError(f"cross-bound description unexpectedly passed: {path}")
        if not description_matches(path, EXPECTED_DESCRIPTIONS[path]):
            raise ScanError(f"exact description unexpectedly failed: {path}")
        checks.append(f"description:{path}")
    exclusions = {
        "rejected-heading": "## Rejected alternatives / why not\nstandard is the fallback",
        "historical-heading": "### Historical context\nstandard is the fallback",
        "line-rejected-alternative": "Rejected alternative: standard is the fallback",
        "line-superseded-by": "standard is the fallback; superseded by D26",
    }
    for name, source in exclusions.items():
        hits, _ = scan_text("selftest", source)
        if hits:
            raise ScanError(f"exclusion self-test failed: {name}")
        checks.append(f"exclusion:{name}")
    for needle in EXECUTOR_PLAN_OBSOLETE_NEEDLES:
        found = exact_obsolete_hits(
            ".config/agents/rules/plan.md",
            f"active contract contains {needle}",
            force_executor_scope=True,
        )
        if len(found) != 1 or found[0]["needle"] != needle:
            raise ScanError(f"executor-plan exact-needle self-test failed: {needle}")
        checks.append(f"executor-plan-stale:{needle}")
    for path, needles in PLAN_ARTIFACT_SCOPED_NEEDLES.items():
        for needle in needles:
            found = exact_obsolete_hits(path, f"obsolete {needle}")
            if not any(hit["needle"] == needle for hit in found):
                raise ScanError(
                    f"plan-artifact exact-needle self-test failed: {path}: {needle}"
                )
            checks.append(f"plan-artifact-stale:{path}:{needle}")
    executor_false_positive_controls = {
        "generic-projection": (
            ".config/agents/rules/plan.md",
            "A todo is a non-authoritative projection of route facts.",
        ),
        "d27-terminal-projection": (
            ".config/agents/skills/dev-ask/WORKFLOW.md",
            "D27 preserves the terminal projection.",
        ),
        "semantic-context": (
            ".config/agents/skills/dev-ask/WORKFLOW.md",
            "Generic semantic context remains portable.",
        ),
        "protected-d26-plan-preflight": (
            "docs/adr/0001-dev-workflow-authority-and-routing.md",
            "Compact requires no Executor Plan or plan preflight.",
        ),
        "portable-authority-section": (
            ".config/agents/rules/plan.md",
            "## Authority",
        ),
        "exact-plan-sha": (
            ".config/agents/rules/plan.md",
            "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        ),
        "orp-fields": (
            ".config/agents/rules/plan.md",
            "Orchestrator Role Profile fields remain provider-neutral.",
        ),
    }
    for name, (path, source) in executor_false_positive_controls.items():
        if exact_obsolete_hits(path, source):
            raise ScanError(f"executor-plan false-positive self-test failed: {name}")
        checks.append(f"executor-plan-allowed:{name}")
    for fragment in DWO_STALE_PROJECTION_FRAGMENTS:
        source = f"Active workflow selects {fragment}."
        found = dwo_projection_hits(
            ".config/agents/skills/dev-implementation/SKILL.md", source
        )
        if not any(fragment in hit["needle"] for hit in found):
            raise ScanError(f"DWO projection stale self-test failed: {fragment}")
        checks.append(f"dwo-stale:{fragment}")

    for fragment in DWO_PLAN_ROOT_FALLBACK_FRAGMENTS:
        source = f"Full orchestration selects {fragment}."
        found = dwo_projection_hits(
            ".config/agents/skills/dev-implementation/SKILL.md", source
        )
        if not any(fragment in hit["needle"] for hit in found):
            raise ScanError(f"DWO plan-root fallback self-test failed: {fragment}")
        checks.append(f"dwo-stale:plan-root:{fragment}")

    plan_downgrade = dwo_projection_hits(
        ".config/agents/skills/dev-implementation/SKILL.md",
        "Plan-backed execution selects one-owner-sequential.",
    )
    if not any(
        hit["needle"] == "plan-backed one-owner-sequential selection"
        for hit in plan_downgrade
    ):
        raise ScanError("plan-backed downgrade stale self-test failed")
    checks.append("dwo-stale:plan-backed-one-owner-sequential")

    allowed_dwo_controls = {
        "generic-direct-downgrade": (
            ".config/agents/skills/dev-implementation/SKILL.md",
            "A planless direct assessment may return one-owner-sequential.",
        ),
        "generic-direct-approved-downgrade": (
            "docs/adr/0002-executor-plans-and-orchestration.md",
            "A direct route uses an already approved, contract-preserving sequential or one-qualified-owner projection.",
        ),
        "executor-plan-v1": (
            ".config/agents/rules/plan-impl-spec.md",
            "Executor Plan v1 remains the portable grammar.",
        ),
        "compact": (
            ".config/agents/rules/plan-impl-spec.md",
            "A compact work-only plan remains valid.",
        ),
        "optional-tail": (
            ".config/agents/rules/plan-impl-spec.md",
            "The optional profile tail remains valid.",
        ),
        "fan-in": (
            ".config/agents/rules/plan-impl-spec.md",
            "Portable fan-in remains valid.",
        ),
        "direct-integration": (
            ".config/agents/rules/plan-impl-spec.md",
            "Direct dev-integration remains available.",
        ),
        "historical-scalar": (
            ".config/agents/skills/completion-presentation/SKILL.md",
            '## Historical context\nThe prior input used "papercut":.',
        ),
    }
    for name, (path, source) in allowed_dwo_controls.items():
        if dwo_projection_hits(path, source):
            raise ScanError(f"DWO false-positive self-test failed: {name}")
        checks.append(f"dwo-allowed:{name}")

    for fragment in TERMINAL_ARCHIVE_STALE_FRAGMENTS:
        source = f"Active caller says {fragment}."
        found = terminal_archive_projection_hits(
            ".config/agents/skills/dev-implementation/SKILL.md", source
        )
        if not any(fragment in hit["needle"] for hit in found):
            raise ScanError(
                f"terminal archive caller-path stale self-test failed: {fragment}"
            )
        if terminal_archive_projection_hits(
            ".config/agents/skills/completion-presentation/SKILL.md", source
        ):
            raise ScanError(
                f"terminal archive renderer false-positive self-test failed: {fragment}"
            )
        checks.append(f"terminal-archive-stale:{fragment}")
        checks.append(f"terminal-archive-renderer-allowed:{fragment}")

    dta_stale_controls = {
        "former-after-plan-completion": (
            ".config/agents/skills/dev-ask/WORKFLOW.md",
            "- [`dev-test-audit`](../dev-test-audit/SKILL.md) — separately routed "
            "two-opinion read-only audit after plan completion.",
            "stale completion-gated audit:",
        ),
        "blanket-quality-admission": (
            ".config/agents/skills/dev-implementation/references/worker-closure.md",
            "Admit every quality finding.",
            "blanket closure admission:",
        ),
        "blanket-all-findings": (
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-dwo-worker-closure/case.json",
            "Every finding is repaired.",
            "blanket closure admission:",
        ),
        "identity-alias": (
            ".config/agents/skills/dev-test-audit/references/audit-protocol.md",
            "Use test-audit/v2 for compatibility.",
            "identity or schema alias:",
        ),
        "changed-tests-only": (
            DTA_AUDIT_REGISTRY_PATH,
            "Changed-tests-only audit intake is eligible.",
            "changed-tests-only audit intake",
        ),
        "source-branding": (
            ".config/agents/skills/dev-test-audit/references/opinion-agent.md",
            "Portable prompt imports DietrichGebert/ponytail.",
            "source branding in executable prompt:",
        ),
        "host-binding": (
            ".config/agents/skills/dev-ask/evals/fixtures/b-review/case.json",
            "Resolve openai-codex/example.",
            "host binding outside allowlist:",
        ),
    }
    for name, (path, source, needle_prefix) in dta_stale_controls.items():
        found = dta_active_contract_hits(path, source)
        if not any(hit["needle"].startswith(needle_prefix) for hit in found):
            raise ScanError(f"DTA active-contract stale self-test failed: {name}")
        checks.append(f"dta-stale:{name}")

    dta_prompt_mutations = {
        "completion-gated-audit": (
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "r-dwo-test-audit/case.json",
            "Run dev-test-audit after completion.",
            "stale completion-gated audit:",
        ),
        "blanket-all-findings": (
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-dwo-worker-closure/case.json",
            "Every finding is repaired.",
            "blanket closure admission:",
        ),
        "identity-alias": (
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "r-dwo-test-audit/case.json",
            "Use test-audit/v2 for compatibility.",
            "identity or schema alias:",
        ),
        "changed-tests-only": (
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "r-dwo-test-audit/case.json",
            "Changed-tests-only audit intake is eligible.",
            "changed-tests-only audit intake",
        ),
        "source-branding": (
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "r-dwo-test-audit/case.json",
            "Portable prompt imports DietrichGebert/ponytail.",
            "source branding in executable prompt:",
        ),
        "host-binding": (
            ".config/agents/skills/dev-ask/evals/fixtures/b-review/case.json",
            "Resolve openai-codex/example.",
            "host binding outside allowlist:",
        ),
    }
    for name, (path, mutation, needle_prefix) in dta_prompt_mutations.items():
        prompt_copy = json.loads((root / path).read_text(encoding="utf-8"))
        prompt_copy["inputs"]["request"] += f" {mutation}"
        found = dta_active_contract_hits(
            path, json.dumps(prompt_copy, ensure_ascii=False)
        )
        if not any(hit["needle"].startswith(needle_prefix) for hit in found):
            raise ScanError(
                f"DTA current-prompt mutation self-test failed: {name}"
            )
        checks.append(f"dta-prompt-mutation:{name}")

    dta_allowed_controls = {
        "negated-completion": (
            ".config/agents/skills/dev-ask/WORKFLOW.md",
            "Post-completion portfolio audit is absent.",
        ),
        "blocked-changed-only": (
            DTA_AUDIT_REGISTRY_PATH,
            "Changed-tests-only audit intake is blocked before opinions.",
        ),
        "adr-evidence-source": (
            "docs/adr/0003-bounded-assurance-and-repair.md",
            "## Evidence / source revisions\n"
            "Pinned DietrichGebert/ponytail and cursor/plugins locators.",
        ),
        "rejected-source": (
            ".config/agents/skills/dev-test-audit/references/opinion-agent.md",
            "## Rejected alternatives / why not\n"
            "Portable prompt imports DietrichGebert/ponytail.",
        ),
        "audit-skill-binding": (
            ".config/agents/skills/dev-test-audit/SKILL.md",
            "The exact table row resolves openai-codex/example.",
        ),
        "changed-not-eligible": (
            DTA_AUDIT_REGISTRY_PATH,
            "Changed-tests-only is not an eligible complete suite boundary.",
        ),
        "opinion-agent-heading": (
            ".config/agents/skills/dev-test-audit/references/opinion-agent.md",
            "# Test audit opinion agent",
        ),
        "json-forbidden-event-metadata": (
            ".config/agents/skills/dev-ask/evals/evals.json",
            json.dumps(
                {
                    "id": "CONTROL",
                    "forbidden_events": [
                        "completion-gated-audit",
                        "changed-tests-only-dispatch",
                    ],
                }
            ),
        ),
    }
    for name, (path, source) in dta_allowed_controls.items():
        if dta_active_contract_hits(path, source):
            raise ScanError(f"DTA active-contract false-positive self-test failed: {name}")
        checks.append(f"dta-allowed:{name}")

    baseline_audit_hits = dta_audit_registry_hits(root)
    if baseline_audit_hits:
        raise ScanError(
            f"DTA audit registry baseline self-test failed: {baseline_audit_hits}"
        )
    checks.append("dta-audit-registry:exact-ten-case-baseline")

    for (raw, title), expected in DTA_PROTECTED_SECTIONS.items():
        text = (root / raw).read_text(encoding="utf-8")
        actual = hashlib.sha256(protected_section_bytes(text, title)).hexdigest()
        if actual != expected:
            raise ScanError(f"DTA protected-section self-test failed: {raw}#{title}")
        checks.append(f"dta-protected:{raw}#{title}")


    cases = load_registry(root)
    baseline_dwo_hits = dwo_registry_contract_hits(root, cases)
    if baseline_dwo_hits:
        raise ScanError(f"DWO registry baseline self-test failed: {baseline_dwo_hits}")
    checks.append("dwo-registry:baseline")

    expected_semantic_pairs = (
        (
            "B-DWO-WORKER-CLOSURE",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-dwo-worker-closure/case.json",
        ),
        (
            "R-DWO-TEST-AUDIT",
            ".config/agents/skills/dev-ask/evals/fixtures/r-dwo-test-audit/case.json",
        ),
        (
            "B-FULL",
            ".config/agents/skills/dev-ask/evals/fixtures/b-full/case.json",
        ),
        (
            "B-T5-COMPLETION-ASSURED",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-t5-completion-assured/case.json",
        ),
        (
            "B-T5-COMPLETION-MISSING-ASSURANCE",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-t5-completion-missing-assurance/case.json",
        ),
        (
            "R-COMPLETE",
            ".config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json",
        ),
        (
            "R-COMPLETE-COMPACT-NO-LEARNING",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "r-complete-compact-no-learning/case.json",
        ),
    )
    if tuple(DWO_SEMANTIC_CASE_FIXTURES.items()) != expected_semantic_pairs:
        raise ScanError("DWO semantic parity map inventory self-test failed")
    if "R-COMPLETE-NEAR-MISS" in DWO_SEMANTIC_CASE_FIXTURES:
        raise ScanError("DWO semantic near-miss exclusion self-test failed")
    checks.append("dwo-semantic:exact-map-and-near-miss-exclusion")

    registry_only_mutation = copy.deepcopy(cases)
    registry_only_mutation["B-DWO-WORKER-CLOSURE"]["inputs"]["request"] += (
        " Registry mutation."
    )
    if not any(
        hit["needle"] == "semantic case parity: field inputs mismatch"
        for hit in dwo_registry_contract_hits(root, registry_only_mutation)
    ):
        raise ScanError("DWO semantic registry-only mutation self-test failed")
    checks.append("dwo-semantic:registry-only-mutation")

    fixture_relative = DWO_SEMANTIC_CASE_FIXTURES["R-DWO-TEST-AUDIT"]
    fixture_only_mutation = json.loads(
        (root / fixture_relative).read_text(encoding="utf-8")
    )
    fixture_only_mutation["scripted_replies"].append("Fixture mutation.")
    fixture_comparison = compare_semantic_case(
        cases, "R-DWO-TEST-AUDIT", fixture_only_mutation
    )
    if fixture_comparison["mismatches"] != ["field scripted_replies mismatch"]:
        raise ScanError("DWO semantic fixture-only mutation self-test failed")
    checks.append("dwo-semantic:fixture-only-mutation")

    baseline_terminal_archive_hits = terminal_archive_registry_contract_hits(
        root, cases
    )
    if baseline_terminal_archive_hits:
        raise ScanError(
            "terminal archive registry baseline self-test failed: "
            f"{baseline_terminal_archive_hits}"
        )
    checks.append("terminal-archive-registry:baseline")

    expected_terminal_archive_pairs = (
        (
            "B-COMPACT-PLAN-NO-TAIL",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-compact-plan-no-tail/case.json",
        ),
        (
            "B-PLAN-TAIL-OMITTED",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-plan-tail-omitted/case.json",
        ),
        (
            "B-PLAN-TAIL-PROFILE",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-plan-tail-profile/case.json",
        ),
        (
            "R-COMPLETE",
            ".config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json",
        ),
        (
            "R-COMPLETE-COMPACT-NO-LEARNING",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "r-complete-compact-no-learning/case.json",
        ),
        (
            "B-TERMINAL-PLAN-ARCHIVE-MATRIX",
            ".config/agents/skills/dev-ask/evals/fixtures/"
            "b-terminal-plan-archive-matrix/case.json",
        ),
    )
    if (
        tuple(TERMINAL_ARCHIVE_SEMANTIC_CASE_FIXTURES.items())
        != expected_terminal_archive_pairs
    ):
        raise ScanError("terminal archive semantic parity map self-test failed")
    checks.append("terminal-archive-semantic:exact-six-case-map")

    terminal_registry_mutation = copy.deepcopy(cases)
    terminal_registry_mutation["B-COMPACT-PLAN-NO-TAIL"]["inputs"]["request"] += (
        " Registry-only drift."
    )
    if not any(
        hit["needle"]
        == "terminal archive semantic case parity: field inputs mismatch"
        for hit in terminal_archive_registry_contract_hits(
            root, terminal_registry_mutation
        )
    ):
        raise ScanError("terminal archive registry-only drift self-test failed")
    checks.append("terminal-archive-semantic:registry-only-drift")

    terminal_fixture_relative = TERMINAL_ARCHIVE_SEMANTIC_CASE_FIXTURES[
        "B-PLAN-TAIL-PROFILE"
    ]
    terminal_fixture_mutation = json.loads(
        (root / terminal_fixture_relative).read_text(encoding="utf-8")
    )
    terminal_fixture_mutation["scripted_replies"].append("Fixture-only drift.")
    terminal_fixture_comparison = compare_semantic_case(
        cases,
        "B-PLAN-TAIL-PROFILE",
        terminal_fixture_mutation,
    )
    if terminal_fixture_comparison["mismatches"] != [
        "field scripted_replies mismatch"
    ]:
        raise ScanError("terminal archive fixture-only drift self-test failed")
    checks.append("terminal-archive-semantic:fixture-only-drift")

    missing_failure_branch = copy.deepcopy(cases)
    missing_failure_branch["B-TERMINAL-PLAN-ARCHIVE-MATRIX"][
        "required_events"
    ].remove(
        TERMINAL_ARCHIVE_REQUIRED_EVENTS[
            "B-TERMINAL-PLAN-ARCHIVE-MATRIX"
        ][7]
    )
    if not any(
        hit["needle"].startswith("terminal archive required event count 1:")
        for hit in terminal_archive_registry_contract_hits(
            root, missing_failure_branch
        )
    ):
        raise ScanError("terminal archive missing failure branch self-test failed")
    checks.append("terminal-archive-semantic:missing-failure-branch")

    wrong_archive_output_order = copy.deepcopy(cases)
    wrong_events = wrong_archive_output_order[
        "B-TERMINAL-PLAN-ARCHIVE-MATRIX"
    ]["required_events"]
    archive_event = TERMINAL_ARCHIVE_REQUIRED_EVENTS[
        "B-TERMINAL-PLAN-ARCHIVE-MATRIX"
    ][1]
    output_event = TERMINAL_ARCHIVE_REQUIRED_EVENTS[
        "B-TERMINAL-PLAN-ARCHIVE-MATRIX"
    ][2]
    archive_index = wrong_events.index(archive_event)
    output_index = wrong_events.index(output_event)
    wrong_events[archive_index], wrong_events[output_index] = (
        wrong_events[output_index],
        wrong_events[archive_index],
    )
    if not any(
        hit["needle"] == "terminal archive event order"
        for hit in terminal_archive_registry_contract_hits(
            root, wrong_archive_output_order
        )
    ):
        raise ScanError("terminal archive output-order self-test failed")
    checks.append("terminal-archive-semantic:archive-before-output")

    active_plan_resume = copy.deepcopy(cases)
    active_plan_resume["R-COMPLETE"]["required_events"].append(
        "completion-input:resume-active|owner:dev-ask|output:"
        ".agents/plans/2030-01-02-0307_plan-r.md#completion-summary"
    )
    if not any(
        hit["needle"] == "active-plan terminal Resume from"
        for hit in terminal_archive_registry_contract_hits(root, active_plan_resume)
    ):
        raise ScanError("terminal archive active-plan Resume self-test failed")
    checks.append("terminal-archive-semantic:active-plan-resume")

    nonzero_planless = copy.deepcopy(cases)
    nonzero_events = nonzero_planless[
        "R-COMPLETE-COMPACT-NO-LEARNING"
    ]["required_events"]
    exact_planless = TERMINAL_ARCHIVE_REQUIRED_EVENTS[
        "R-COMPLETE-COMPACT-NO-LEARNING"
    ][1]
    nonzero_events[nonzero_events.index(exact_planless)] = exact_planless.replace(
        "archive actions 0", "archive actions 1"
    )
    if not any(
        hit["needle"] == "planless archive behavior must remain zero"
        for hit in terminal_archive_registry_contract_hits(root, nonzero_planless)
    ):
        raise ScanError("terminal archive nonzero planless self-test failed")
    checks.append("terminal-archive-semantic:nonzero-planless-archive")

    stale_resume_grant = copy.deepcopy(cases)
    stale_resume_grant["B-FULL"]["required_events"].append(
        "snapshot:resume|owner:backend|output:grant counter restored"
    )
    if not any(
        hit["path"] == "B-FULL"
        and hit["needle"] == "removed resume state: grant counter"
        for hit in dwo_registry_contract_hits(root, stale_resume_grant)
    ):
        raise ScanError("DWO resume grant-counter stale self-test failed")
    checks.append("dwo-registry:resume-grant-counter")

    stale_resume_tuple = copy.deepcopy(cases)
    stale_resume_tuple["B-T5-COMPLETION-ASSURED"]["inputs"]["request"] += (
        " Exact duplicate attempt-or-grant tuple."
    )
    if not any(
        hit["path"] == "B-T5-COMPLETION-ASSURED"
        and hit["needle"] == "removed resume state: attempt-or-grant"
        for hit in dwo_registry_contract_hits(root, stale_resume_tuple)
    ):
        raise ScanError("DWO resume attempt-or-grant stale self-test failed")
    checks.append("dwo-registry:resume-attempt-or-grant")

    for fragment in DWO_RESUME_STALE_FRAGMENTS:
        stale_fixture = dwo_resume_projection_hits(
            DWO_SEMANTIC_CASE_FIXTURES[
                "B-T5-COMPLETION-MISSING-ASSURANCE"
            ],
            json.dumps({"inputs": {"request": f"restore the {fragment} state"}}),
        )
        if not any(
            hit["needle"] == f"removed resume state: {fragment}"
            for hit in stale_fixture
        ):
            raise ScanError(f"DWO resume fixture {fragment} stale self-test failed")
        checks.append(f"dwo-fixture:resume-{fragment}")

    historical_resume = (
        "## Historical context\n"
        "The prior attempt-or-grant tuple restored a grant counter."
    )
    if dwo_projection_hits(
        ".config/agents/skills/dev-implementation/SKILL.md",
        historical_resume,
    ) or dwo_resume_projection_hits(
        ".config/agents/skills/dev-ask/evals/fixtures/history/case.json",
        historical_resume,
    ):
        raise ScanError("DWO resume historical-prose false-positive self-test failed")
    checks.append("dwo-allowed:historical-resume-prose")

    stale_continuation = copy.deepcopy(cases)
    stale_continuation["B-T4-REPAIR-REMAINING-BLOCKER"]["required_events"].append(
        "state:ready|owner:backend|output:grant cycle 1"
    )
    if not any(
        hit["needle"] == "removed continuation state: grant cycle"
        for hit in dwo_registry_contract_hits(root, stale_continuation)
    ):
        raise ScanError("DWO continuation stale self-test failed")
    checks.append("dwo-registry:removed-continuation")

    stale_plan = copy.deepcopy(cases)
    stale_plan["B-COMPACT-PLAN-NO-TAIL"]["expected"]["mode"] = "one owner"
    if not any(
        hit["needle"] == "plan-backed full orchestration mode"
        for hit in dwo_registry_contract_hits(root, stale_plan)
    ):
        raise ScanError("DWO plan mode stale self-test failed")
    checks.append("dwo-registry:plan-mode")

    stale_downgrade = copy.deepcopy(cases)
    stale_downgrade["B-T5-PARENT-PROFILE-DOWNGRADE"]["required_events"].append(
        "snapshot:orchestrator-profile|owner:backend|output:one-owner-sequential"
    )
    if not any(
        hit["needle"] == "plan-backed downgrade rejection"
        for hit in dwo_registry_contract_hits(root, stale_downgrade)
    ):
        raise ScanError("DWO downgrade stale self-test failed")
    checks.append("dwo-registry:plan-downgrade")

    scalar_completion = copy.deepcopy(cases)
    scalar_completion["B-COMPLETION"]["required_events"].append(
        'completion-input:{"papercut":"none"}'
    )
    if not any(
        hit["needle"] == "scalar completion papercut"
        for hit in dwo_registry_contract_hits(root, scalar_completion)
    ):
        raise ScanError("DWO scalar completion self-test failed")
    checks.append("dwo-registry:scalar-papercut")

    legacy_changed = copy.deepcopy(cases)
    legacy_changed["B-COMPLETION"]["required_events"].append(
        'completion-input:{"changed":["artifact"]}'
    )
    if not any(
        hit["needle"] == "legacy completion changed field"
        for hit in dwo_registry_contract_hits(root, legacy_changed)
    ):
        raise ScanError("DWO legacy completion changed self-test failed")
    checks.append("dwo-registry:legacy-changed")

    missing_scope_artifacts = copy.deepcopy(cases)
    scope_case = missing_scope_artifacts["B-COMPLETION"]
    scope_case["required_events"].remove("completion-input:scope-key-artifacts")
    scope_case["inputs"]["request"] = scope_case["inputs"]["request"].replace(
        "completion-input:scope-key-artifacts\n", ""
    )
    if not any(
        hit["needle"] == "completion scope and key artifacts"
        for hit in dwo_registry_contract_hits(root, missing_scope_artifacts)
    ):
        raise ScanError("DWO completion scope and artifacts self-test failed")
    checks.append("dwo-registry:completion-scope-artifacts")

    missing_summary_index = copy.deepcopy(cases)
    missing_case = missing_summary_index["B-COMPLETION"]
    missing_case["required_events"].remove("completion-input:resume-summary-index")
    missing_case["inputs"]["request"] = missing_case["inputs"]["request"].replace(
        "completion-input:resume-summary-index\n", ""
    )
    if not any(
        hit["needle"] == "completion summary resume index"
        for hit in dwo_registry_contract_hits(root, missing_summary_index)
    ):
        raise ScanError("DWO completion summary index self-test failed")
    checks.append("dwo-registry:completion-summary-index")
    return {
        "schema": "lean-stale-scan-selftest/v1",
        "status": "pass",
        "checks": checks,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--preserve", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    try:
        root = repository_root()
        if args.self_test:
            output = run_selftest(root)
        elif args.preserve:
            output = preserve_check(root)
        else:
            output = scan_repository(root)
        print(json.dumps(output, sort_keys=True))
        return 0 if output.get("status") == "pass" else 1
    except (ScanError, OSError, UnicodeError, json.JSONDecodeError) as error:
        output = {
            "schema": SCHEMA,
            "status": "fail",
            "hits": [
                {
                    "path": "<scanner>",
                    "line": 0,
                    "needle": "valid scanner execution",
                    "text": str(error),
                }
            ],
            "missing_required": [],
            "scanned": [],
        }
        print(json.dumps(output, sort_keys=True))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
