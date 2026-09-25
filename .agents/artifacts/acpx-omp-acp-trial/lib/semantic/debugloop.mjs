// B4 native-debugging loop accounting (spec-v9 B4, approved T1/T2 extension).
// Pure state machine over cause/fix records kept in the discovering
// execution's existing run evidence; no separate retry ledger is created.
import { PROBE_SOAK_POOL } from "../native/pins.mjs";

export const FIXES_PER_CAUSE = 2;
export const PRODUCTION_LIMIT = Object.freeze({ usd: 20, tokens: 2_000_000, wallMs: 120 * 60_000 });
export const NARROW_POOLS = Object.freeze({ "probe-soak": { usd: PROBE_SOAK_POOL.usd, wallMs: PROBE_SOAK_POOL.wallMs }, rehearsal: { usd: 1, wallMs: 15 * 60_000 } });

const CODE_FAULT = "trial-code";
const NOT_CODE = new Set(["native-limitation", "delivery-uncertain", "model-behavior", "semantic-stop", "desired-outcome", "unvisited-branch"]);

export class DebugLoop {
  constructor({ owners, extensionApproved }) {
    this.owners = owners; // target -> retained owner
    this.extensionApproved = extensionApproved === true;
    this.causes = new Map();
    this.ended = null; // null | { reason, at }
    this.finalAssurance = false;
    this.spend = { production: { usd: 0, tokens: 0, wallMs: 0 }, "probe-soak": { usd: 0, wallMs: 0 }, rehearsal: { usd: 0, wallMs: 0 } };
    this.closedEntries = new Set();
    this.proofUnits = [];
  }

  /** Records an evidenced cause. Non-code classes never become fix triggers. */
  recordCause({ id, cls, invariant, target, discoveredIn, evidence }) {
    if (NOT_CODE.has(cls)) return { accepted: false, reason: `${cls} is not a code-fix trigger` };
    if (cls !== CODE_FAULT) return { accepted: false, reason: "unknown cause class" };
    if (!evidence?.snapshot || !evidence?.independent) return { accepted: false, reason: "a trial-code cause needs a preserved snapshot and independent evidence" };
    if (this.causes.has(id)) return { accepted: false, reason: "cause already recorded; recurrence is not a new cause" };
    this.causes.set(id, { id, invariant, target, discoveredIn, fixes: [], status: "open" });
    this.closedEntries.add(discoveredIn); // an unfixed bug closes its affected entry
    return { accepted: true };
  }

  /** Eligibility of one fix for a cause; returns { eligible, reason }. */
  eligibility(causeId, fix) {
    const c = this.causes.get(causeId);
    if (!c) return { eligible: false, reason: "no evidenced cause" };
    if (c.fixes.length >= FIXES_PER_CAUSE) return { eligible: false, reason: "cause exhausted (two fixes used); assurance repair cannot replenish it" };
    if (this.ended && !this.finalAssurance) return { eligible: false, reason: `debug loop ended: ${this.ended.reason}` };
    if (this.finalAssurance && fix.route !== "attempt-2") return { eligible: false, reason: "final assurance started; only the remaining attempt-2 authority applies" };
    if (["T1", "T2"].includes(c.target.task) && !this.extensionApproved) return { eligible: false, reason: "T1/T2 extension not approved" };
    if (fix.owner !== this.owners[c.target.file]) return { eligible: false, reason: "fix is not by the retained target owner" };
    if (!(fix.red?.failed === true && fix.green?.passed === true && fix.red.at < fix.green.at)) return { eligible: false, reason: "offline reproducer red-before/green-after not evidenced" };
    if (fix.fullChecks !== true) return { eligible: false, reason: "full applicable deterministic checks did not pass" };
    if (fix.changesApprovedBehavior) return { eligible: false, reason: "correction changes approved behavior/acceptance/effects; human decision required" };
    return { eligible: true };
  }

  applyFix(causeId, fix) {
    const e = this.eligibility(causeId, fix);
    if (!e.eligible) return e;
    const c = this.causes.get(causeId);
    c.fixes.push({ owner: fix.owner, at: fix.green.at, route: fix.route ?? "debug-loop" });
    c.status = "fixed-offline";
    this.closedEntries.delete(c.discoveredIn); // repair of the bug that closed its own entry
    return { eligible: true, fixNumber: c.fixes.length };
  }

  /** Regenerated proof units are recorded; they never count as new fixes. */
  recordProofUnit(causeId, unit) {
    this.proofUnits.push({ causeId, unit });
  }

  /** Recurrence after the second fix ends the loop for every cause. */
  recordRecurrence(causeId) {
    const c = this.causes.get(causeId);
    if (!c) return { ended: false };
    c.status = "recurred";
    this.closedEntries.add(c.discoveredIn);
    if (c.fixes.length >= FIXES_PER_CAUSE) this.ended ??= { reason: `cause ${causeId} recurred after its second fix` };
    return { ended: Boolean(this.ended) };
  }

  /** Spend accounting; only the production limit ends the loop. */
  charge(pool, { usd = 0, tokens = 0, wallMs = 0 }) {
    const s = this.spend[pool];
    s.usd += usd;
    s.wallMs += wallMs;
    if (pool === "production" || pool === "rehearsal") {
      // Rehearsal spend also counts inside the production limit.
      const p = this.spend.production;
      if (pool === "rehearsal") {
        p.usd += usd;
        p.wallMs += wallMs;
      }
      p.tokens += tokens;
    }
    const p = this.spend.production;
    if (p.usd >= PRODUCTION_LIMIT.usd || p.tokens >= PRODUCTION_LIMIT.tokens || p.wallMs >= PRODUCTION_LIMIT.wallMs) this.ended ??= { reason: "production limit exhausted" };
  }

  /** A narrow pool's exhaustion stops only its native work. */
  nativeWorkAllowed(pool) {
    if (pool === "production") return !this.ended || this.ended.reason !== "production limit exhausted";
    const lim = NARROW_POOLS[pool];
    const s = this.spend[pool];
    return s.usd < lim.usd && s.wallMs < lim.wallMs && this.nativeWorkAllowed("production");
  }

  startFinalAssurance() {
    this.finalAssurance = true;
    this.ended ??= { reason: "final independent review started" };
  }

  /** Extra production executions only for bugs that appeared in production. */
  productionRerunAllowed(causeId) {
    const c = this.causes.get(causeId);
    return Boolean(c && c.discoveredIn === "production" && c.status === "fixed-offline");
  }

  /** A known unfixed trial-code bug blocks DONE; a truthful not-supported does not. */
  blocksDone() {
    return [...this.causes.values()].some((c) => c.status !== "fixed-offline");
  }

  entryOpen(entry) {
    return !this.closedEntries.has(entry);
  }
}
