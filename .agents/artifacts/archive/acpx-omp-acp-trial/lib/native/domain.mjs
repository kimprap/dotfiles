// Controller-owned domain schema for the T1 probe expectations.
// Tolerant: accepts unambiguous syntactic variants of the declared control keyword
// (`kind`), ignores irrelevant extra fields (without exporting them), rejects
// missing/conflicting required fields and never case-folds payload text.

export const VARIANTS = Object.freeze({
  "probe-canary": { field: "sentence" },
  "probe-reuse": { field: "token" },
  "probe-short": { field: "sentence" },
  "probe-restore": { field: "token" },
});

export function exampleFor(kind) {
  const { field } = VARIANTS[kind];
  const value = field === "token" ? "TOKEN-EXAMPLE-0000" : "One short sentence.";
  return JSON.stringify({ data: { kind, [field]: value } });
}

/** Normalizes a control keyword: case, surrounding space, `_`/space vs `-`. */
export function normalizeKind(value) {
  if (typeof value !== "string") return undefined;
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

/**
 * Validates a candidate `data` value once against the expected variant.
 * Returns { valid, defects[], projection } where projection holds only the
 * known required fields (exact values) for retained evidence.
 */
export function validateCandidate(expectedKind, data) {
  const variant = VARIANTS[expectedKind];
  if (!variant) throw new Error(`unknown expected kind ${expectedKind}`);
  const defects = [];
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    defects.push(`data must be an object, got ${data === null ? "null" : Array.isArray(data) ? "array" : typeof data}`);
    return { valid: false, defects, projection: { dataType: data === null ? "null" : Array.isArray(data) ? "array" : typeof data } };
  }
  const projection = projectDomainData(data);
  const kind = normalizeKind(data.kind);
  if (data.kind === undefined) defects.push("missing required field `kind`");
  else if (kind !== expectedKind) defects.push(`field \`kind\` must be \`${expectedKind}\``);
  const value = data[variant.field];
  if (value === undefined) defects.push(`missing required field \`${variant.field}\``);
  else if (typeof value !== "string" || value.trim() === "") defects.push(`field \`${variant.field}\` must be a non-empty string`);
  return { valid: defects.length === 0, defects, projection };
}

/**
 * Closed A7 projection of a candidate data object: only the declared control
 * keyword and the declared result fields, as exact strings. Unknown extras are
 * counted, never exported.
 */
export function projectDomainData(data) {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return { dataType: data === null ? "null" : Array.isArray(data) ? "array" : typeof data };
  }
  const out = { dataType: "object" };
  const known = new Set(["kind", "sentence", "token"]);
  for (const key of known) {
    if (typeof data[key] === "string") out[key] = data[key];
    else if (data[key] !== undefined) out[`${key}Type`] = Array.isArray(data[key]) ? "array" : data[key] === null ? "null" : typeof data[key];
  }
  out.extraKeyCount = Object.keys(data).filter((k) => !known.has(k)).length;
  return out;
}
