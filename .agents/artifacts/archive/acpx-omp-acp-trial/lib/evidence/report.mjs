// Minimal report/finalization path owned by T1. Works without T2/T3 code:
// renders T1 execution reports and T2/T3 authorized not-run reports.

const line = (k, v) => `- ${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`;

export function renderT1Markdown(report) {
  const c = report.capability;
  const out = [
    `# T1 native probe report — ${report.run_id}`,
    "",
    `Spec: ${report.bindings.spec_revision} (${report.bindings.spec_sha256}); decisions: ${report.bindings.decisions_revision}.`,
    `Mode: ${report.mode}. Branch: ${report.branch}.`,
    "",
    "## Verdicts (kept separate)",
    "",
    line("implementation checks", report.implementation.status),
    line("native capability (overall)", c.overall),
    line("production allowed", report.production_allowed),
    line("T2 native entry permitted", report.t2_entry_permitted),
    line("T1 evaluation complete", report.evaluation_complete),
    line("production adoption", "not authorized"),
    "",
    "## Capability observations",
    "",
    ...Object.entries(c).filter(([k]) => k !== "overall").map(([k, v]) => line(k, v)),
    "",
    "## Expectations",
    "",
    "| # | handle | kind | outcome | first try | submissions | invalid returns | re-asks |",
    "|---|---|---|---|---|---|---|---|",
    ...report.expectations.map((e) => `| ${e.index} | ${e.handle} | ${e.kind} | ${e.outcome} | ${e.firstTryValid} | ${e.submissions} | ${e.invalidReturns} | ${e.reasksUsed} |`),
    "",
    "## Cleanup",
    "",
    line("status", report.cleanup.status),
    ...report.cleanup.notes.map((n) => `- ${n}`),
    "",
    "## Accounting (probe/soak pool USD2 / 20 min, cumulative)",
    "",
    line("this execution wall ms", report.accounting.wallMs),
    line("reported cost", report.accounting.cost),
    line("prior pool wall ms", report.accounting.priorWallMs),
    "",
    "## Stops and causes",
    "",
    ...(report.stops.length ? report.stops.map((s) => `- ${s}`) : ["- none"]),
    "",
    "## Limits (disclosed, not repaired)",
    "",
    ...report.limits.map((l) => `- ${l}`),
    "",
  ];
  return out.join("\n");
}

export function renderNotRunMarkdown(report) {
  return [
    `# ${report.task} not-run report — ${report.run_id}`,
    "",
    `Upstream: ${report.upstream.path} (report sha256 ${report.upstream.report_sha256}).`,
    `Upstream capability: ${report.upstream.capability_overall}; upstream evaluation complete: ${report.upstream.evaluation_complete}.`,
    "",
    line("branch", report.branch),
    line("implementation entered", report.implementation_entered),
    line("model work", report.model_work),
    line("production allowed", report.production_allowed),
    line("evaluation complete", report.evaluation_complete),
    line("production adoption", "not authorized"),
    "",
    "## Criteria on the not-run branch",
    "",
    ...Object.entries(report.criteria).map(([k, v]) => `- ${k}: ${v.status} — ${v.reason}`),
    "",
    "## Durations",
    "",
    line("production durations", report.durations),
    "",
  ].join("\n");
}
