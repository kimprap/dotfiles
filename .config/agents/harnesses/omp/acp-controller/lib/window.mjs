// Journal-window assembly for one request, driven by projected watch events
// (lib/export.mjs). The window is opened by `turn_started R` and closed by
// `turn_result R`; only messages carrying requestId R inside it have authority.
// A later window or null-requestId line is never bound backward to R.

const YIELD_KEYS = new Set(["type", "data", "error"]);
const ALLOWED_KINDS = new Set(["read", "search"]);

/** Yield-candidate signature (observational; does not authenticate the tool name). */
export function isYieldSignature(inv) {
  if (inv.acpKind !== "other" || !inv.input) return false;
  return inv.input.undeclaredKeyCount === 0 && inv.input.declaredYieldKeys.every((k) => YIELD_KEYS.has(k));
}

export class RequestWindow {
  constructor({ requestId, knownRequestIds }) {
    this.requestId = requestId;
    this.known = knownRequestIds; // Set of other request IDs on this handle
    this.state = "before"; // before | open | closed
    this.events = []; // retained projected events relevant to this window
    this.seenCursors = new Set();
    this.duplicateCursorCount = 0;
    this.nullTraffic = 0;
    this.otherKnown = 0;
    this.unknownRequestIds = [];
    this.anomalies = [];
    this.invocations = new Map();
    this.firstCandidate = undefined; // { cursor, toolCallId }
    this.turnResult = undefined;
    this.startCursor = undefined;
    this.endCursor = undefined;
    this.rpc = { initialize: 0, sessionNew: 0, sessionResume: [], sessionLoad: 0, prompt: 0, errors: [] };
    this.usage = [];
  }

  /** Feeds one projected watch event; returns true once the window is closed. */
  accept(ev) {
    if (ev.cursor !== undefined) {
      if (this.seenCursors.has(ev.cursor)) {
        this.duplicateCursorCount++;
        return this.state === "closed";
      }
      this.seenCursors.add(ev.cursor);
    }
    const rid = ev.requestId;
    if (rid === null || rid === undefined) {
      if (this.state === "open") this.nullTraffic++;
      return this.state === "closed";
    }
    if (rid !== this.requestId) {
      if (this.known.has(rid)) this.otherKnown++;
      else if (!this.unknownRequestIds.includes(rid)) this.unknownRequestIds.push(rid);
      return this.state === "closed";
    }
    if (ev.type === "turn_started") {
      if (this.state !== "before") this.anomalies.push("repeated-turn-started");
      else {
        this.state = "open";
        this.startCursor = ev.cursor;
        this.events.push(ev);
      }
      return false;
    }
    if (this.state === "before") {
      this.anomalies.push(`pre-window-${ev.type}`);
      return false;
    }
    if (this.state === "closed") {
      this.anomalies.push(`post-window-${ev.type}`);
      return true;
    }
    this.events.push(ev);
    if (ev.type === "turn_result") {
      this.state = "closed";
      this.turnResult = ev.result;
      this.endCursor = ev.cursor;
      return true;
    }
    if (ev.type === "message") this.#message(ev);
    return false;
  }

  #message(ev) {
    const m = ev.message;
    if (m.rpc === "request" || m.rpc === "notification") {
      if (m.method === "initialize") this.rpc.initialize++;
      if (m.method === "session/new") this.rpc.sessionNew++;
      if (m.method === "session/resume") this.rpc.sessionResume.push({ cursor: ev.cursor, id: m.id, sessionId: m.sessionId });
      if (m.method === "session/load") this.rpc.sessionLoad++;
      if (m.method === "session/prompt") this.rpc.prompt++;
    }
    if (m.rpc === "response" && m.error) this.rpc.errors.push({ cursor: ev.cursor, id: m.id, code: m.error.code });
    if (m.rpc === "response") {
      for (const r of this.rpc.sessionResume) if (r.id === m.id && r.responseCursor === undefined) {
        r.responseCursor = ev.cursor;
        r.ok = !m.error;
      }
    }
    const tool = m.update?.tool;
    if (m.update?.usage) this.usage.push(m.update.usage);
    if (!tool || tool.toolCallId === undefined) return;
    let inv = this.invocations.get(tool.toolCallId);
    if (!inv) {
      inv = { toolCallId: tool.toolCallId, firstCursor: ev.cursor, acpKind: undefined, input: undefined, starts: 0, terminal: undefined, updates: 0 };
      this.invocations.set(tool.toolCallId, inv);
    }
    if (m.update.kind === "tool_call") inv.starts++;
    else inv.updates++;
    inv.acpKind ??= tool.acpKind;
    inv.input ??= tool.input;
    if ((tool.status === "completed" || tool.status === "failed") && !inv.terminal) {
      inv.terminal = { cursor: ev.cursor, status: tool.status, detailsStatus: tool.output?.detailsStatus, hasData: tool.output?.hasData === true };
      if (!this.firstCandidate && this.#admissible(inv, tool)) {
        this.firstCandidate = { cursor: ev.cursor, toolCallId: tool.toolCallId };
      }
    }
  }

  /** First completed, non-error, terminal native result submission with explicit data. */
  #admissible(inv, tool) {
    if (tool.status !== "completed" || !isYieldSignature(inv)) return false;
    if (tool.output?.detailsStatus !== "success" || tool.output?.hasData !== true) return false;
    if (inv.input?.typeIsArray || inv.input?.useLastTurn) return false;
    return true;
  }

  /** Yield-shaped invocations started without a terminal update (delivery uncertainty). */
  unfinishedYields() {
    return [...this.invocations.values()].filter((i) => isYieldSignature(i) && !i.terminal).map((i) => i.toolCallId);
  }

  /** Tool-policy facts: attempts vs failed/denied vs completed, per allowed class. */
  toolFacts() {
    const facts = [];
    for (const inv of this.invocations.values()) {
      const yieldSig = isYieldSignature(inv);
      facts.push({
        toolCallId: inv.toolCallId,
        acpKind: inv.acpKind ?? "unknown",
        recognizedYield: yieldSig,
        allowedByPolicy: ALLOWED_KINDS.has(inv.acpKind) || yieldSig,
        started: inv.starts > 0,
        terminalStatus: inv.terminal?.status ?? "unfinished",
        detailsStatus: inv.terminal?.detailsStatus,
        inputPath: inv.input?.path,
      });
    }
    return facts;
  }

  /** Completed tool calls outside the permitted classes (detect-after policy; a start alone is an attempt). */
  forbiddenCompleted() {
    return this.toolFacts().filter((f) => !f.allowedByPolicy && f.terminalStatus === "completed");
  }
}
