// Spend accumulation and the `## Spend` section (spec-v3 §5 Q10). No token or
// USD cap exists. A missing value prints `unknown`; a total with any unknown
// member prints `≥ <known sum> (unknown members)`.

const round = (n) => Number(n.toFixed(6));

/**
 * Per-actor spend from public status samples. `record` takes the usage of the
 * last sample before close; a counter lower than the previous one (a new
 * process after same-session restore) adds the previous value to a carried base.
 */
export class Spend {
  constructor(rows = []) {
    this.rows = new Map(rows.map((r) => [r.actor, { ...r }]));
  }
  static fromJSON(json) {
    return new Spend(Array.isArray(json) ? json : []);
  }
  toJSON() {
    return [...this.rows.values()];
  }
  /** `role` = `{ model, thinking }`; `usage` = `{ totalTokens, costAmount, costCurrency }` (adapter sampleStatus shape). */
  record(actor, role, usage) {
    const row = this.rows.get(actor) ?? { actor, tokensBase: 0, tokensLast: null, costBase: 0, costLast: null, currency: null };
    row.model = role.model;
    row.thinking = role.thinking;
    const carry = (baseKey, lastKey, value) => {
      if (typeof value !== "number") return;
      if (row[lastKey] !== null && value < row[lastKey]) row[baseKey] += row[lastKey];
      row[lastKey] = value;
    };
    carry("tokensBase", "tokensLast", usage?.totalTokens);
    carry("costBase", "costLast", usage?.costAmount);
    if (typeof usage?.costCurrency === "string") row.currency = usage.costCurrency;
    this.rows.set(actor, row);
  }
  render() {
    return renderSpend(this.toJSON());
  }
}

const tokensOf = (r) => (r.tokensLast === null ? null : r.tokensBase + r.tokensLast);
const costOf = (r) => (r.costLast === null || !r.currency ? null : { amount: round(r.costBase + r.costLast), currency: r.currency });

function total(values, format) {
  const known = values.filter((v) => v !== null);
  const text = format(known);
  return known.length === values.length ? text : `≥ ${text} (unknown members)`;
}

function costText(costs) {
  if (!costs.length) return "0";
  const byCurrency = new Map();
  for (const c of costs) byCurrency.set(c.currency, round((byCurrency.get(c.currency) ?? 0) + c.amount));
  return [...byCurrency].map(([cur, amount]) => `${amount} ${cur}`).join(" + ");
}

/** Renders the `## Spend` section for spend rows (Spend#toJSON shape). */
export function renderSpend(rows) {
  const lines = ["## Spend", "", "| Actor | Model | Thinking | Tokens | Cost |", "|---|---|---|---|---|"];
  for (const r of rows) {
    const t = tokensOf(r);
    const c = costOf(r);
    lines.push(`| ${r.actor} | ${r.model} | ${r.thinking ?? "unknown"} | ${t ?? "unknown"} | ${c ? `${c.amount} ${c.currency}` : "unknown"} |`);
  }
  const tokens = total(rows.map(tokensOf), (k) => String(k.reduce((s, n) => s + n, 0)));
  const cost = total(rows.map(costOf), costText);
  lines.push(`| Total | | | ${tokens} | ${cost} |`);
  return `${lines.join("\n")}\n`;
}
