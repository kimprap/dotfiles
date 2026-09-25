// AC-PRODUCTION-GATE derivation and B6 conditional completion (spec-v9).
// Allow only when every input holds; any missing/failed/stale/inconclusive/
// unsafe input denies before model work. Validating a closed gate is not
// permission to spend.

export const T2_CRITERIA = ["AC-MAPPING", "AC-MECHANICS", "AC-TRANSPORT", "AC-RESTORE", "AC-REQUESTS", "AC-DIAGNOSTICS", "AC-DEBUGLOOP"];

/**
 * inputs = {
 *   t1: { capability, t2EntryPermitted, evaluationComplete, cleanup, verifyOk },
 *   criteria: { "AC-...": "PASS" | "FAIL" | ... },   // the other seven T2 criteria
 *   soakCapability: "supported" | "not-supported" | "inconclusive",
 *   identities: { current: {...}, recorded: {...} },  // source/config/pin identities
 *   cleanup: { complete: boolean }, safety: { protectedUnchanged, unsafeRetention },
 *   unfixedCodeBug: boolean,
 * }
 */
export function deriveGate(inputs) {
  const reasons = [];
  const t1 = inputs.t1 ?? {};
  if (t1.capability !== "supported") reasons.push(`T1 capability ${t1.capability ?? "missing"}`);
  if (t1.t2EntryPermitted !== true) reasons.push("T1 did not permit T2 entry");
  if (t1.cleanup !== "complete") reasons.push("T1 cleanup not complete");
  if (t1.verifyOk !== true) reasons.push("T1 independent check did not pass");
  for (const id of T2_CRITERIA) if (inputs.criteria?.[id] !== "PASS") reasons.push(`${id} ${inputs.criteria?.[id] ?? "missing"}`);
  if (inputs.soakCapability !== "supported") reasons.push(`soak capability ${inputs.soakCapability ?? "missing"}`);
  const cur = inputs.identities?.current;
  const rec = inputs.identities?.recorded;
  if (!cur || !rec) reasons.push("identities missing");
  else for (const k of new Set([...Object.keys(cur), ...Object.keys(rec)])) if (cur[k] !== rec[k]) reasons.push(`identity changed: ${k}`);
  if (inputs.cleanup?.complete !== true) reasons.push("cleanup not settled");
  if (inputs.safety?.protectedUnchanged !== true) reasons.push("protected sources changed or unobserved");
  if (inputs.safety?.unsafeRetention) reasons.push("unsafe retained evidence");
  if (inputs.unfixedCodeBug) reasons.push("known unfixed trial-code bug");
  return { production_allowed: reasons.length === 0, reasons };
}

/**
 * B6: an entered branch completes its evaluation when its code checks pass,
 * evidence/cleanup are complete and no unfixed code bug or authority problem
 * remains, independent of whether the native capability was supported.
 */
export function evaluationComplete({ codeChecksPassed, evidenceComplete, cleanupComplete, unfixedCodeBug, authorityOk }) {
  return codeChecksPassed === true && evidenceComplete === true && cleanupComplete === true && unfixedCodeBug !== true && authorityOk === true;
}
