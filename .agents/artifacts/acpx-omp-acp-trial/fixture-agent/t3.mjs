#!/usr/bin/env node
// Mechanics-only scripted ACP agent for the T3 self-test (never a model
// judgment). It answers the fixed reviewer/evaluator prompts with one
// native-shaped `yield` per prompt:
//   reviewers: REVISE while the proposal contains `FLAW` (Conversation:
//     replacement; Artifact: one exact edit), otherwise VALID with one
//     informational recommendation; reviewer B's first reply in a
//     Conversation review omits `verdict` once (shared C4 re-ask); reviewer A's
//     first Artifact reply asks for the artifact as a source (source-need).
//   evaluators: scope s3 pauses once on a frontier; every scope then returns a
//     candidate-ready report citing `<root>/evidence-<scope>.md`.
// Session state is per process; the self-test uses the normal TTL only.
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline";

const write = (obj) => new Promise((resolve) => (process.stdout.write(`${JSON.stringify(obj)}\n`) ? resolve() : process.stdout.once("drain", resolve)));
const respond = (id, result) => write({ jsonrpc: "2.0", id, result });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sessions = new Map();

const between = (text, start, end) => {
  const i = text.indexOf(start);
  if (i < 0) return undefined;
  const j = text.indexOf(end, i + start.length);
  return j < 0 ? undefined : text.slice(i + start.length, j);
};

function reviewerReply(st, text) {
  const reask = /was not accepted/.test(text);
  const source = /The controller supplied the sources/.test(text);
  const proposal = between(text, "Current proposal:\n\n````text\n", "\n````");
  if (proposal !== undefined) st.proposal = proposal;
  if (/This is your first review in this session/.test(text)) st.phase = "initial";
  else if (/rethink it once in this same session/.test(text)) st.phase = "rethink";
  else if (/Review the current proposal below for outer iteration/.test(text)) st.phase = "later";
  if (st.mode === "artifact" && st.role === "A" && st.phase === "initial" && !st.askedSource && !reask && !source) {
    st.askedSource = true;
    return { kind: "source-need", locators: [st.candidateRef], reason: "read the artifact copy itself" };
  }
  if (st.mode === "conversation" && st.role === "B" && !st.reasked && !st.nested) {
    st.reasked = true;
    return { kind: "review", rationale: "verdict deliberately omitted once" };
  }
  const p = st.proposal ?? "";
  if (p.includes("FLAW")) {
    const correction = st.mode === "artifact" ? { edits: [{ old: "FLAW", new: "fixed" }] } : { replacement: p.replaceAll("FLAW", "fixed") };
    return { kind: "review", verdict: "REVISE", rationale: `scripted ${st.phase}: the proposal still contains a flaw marker`, correction };
  }
  return { kind: "review", verdict: "VALID", rationale: `scripted ${st.phase}: no flaw marker`, recommendations: ["informational only"] };
}

function evaluatorReply(st, text) {
  if (/You evaluate one approved Retrace scope/.test(text)) {
    st.root = between(text, "bound repository root `", "`");
    st.scope = between(text, "Scope `", "`");
  }
  if (st.scope === "s3" && !st.paused) {
    st.paused = true;
    return { kind: "scope-paused", frontier: "scripted frontier for s3" };
  }
  const report = ["Kind: conversation", "", "## Bound Intake and Scope Model", `Scope ${st.scope} under ${st.root}.`, "", "## Historical and Current Harness Coverage", "Scripted coverage.", "", "## Qualified Findings", `Finding for ${st.scope} from evidence-${st.scope}.md.`, "", "## Refinement Direction, No Change, or Blocker", "No change.", "", "## Canonical Impact and Transfer", "None."].join("\n");
  return { kind: "candidate-ready", report, manifest: [{ locator: `${st.root}/evidence-${st.scope}.md`, role: "current" }], disposition: "no-change" };
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.trim()) continue;
  const msg = JSON.parse(line);
  if (msg.id === undefined) continue;
  switch (msg.method) {
    case "initialize":
      await respond(msg.id, { protocolVersion: 1, agentCapabilities: { sessionCapabilities: { resume: {} } } });
      break;
    case "session/new":
      await respond(msg.id, { sessionId: `fixture-${randomUUID()}` });
      break;
    case "session/resume":
      await respond(msg.id, {});
      break;
    case "session/prompt": {
      const sid = msg.params.sessionId;
      const text = (msg.params.prompt ?? []).map((b) => b.text ?? "").join("\n");
      const st = sessions.get(sid) ?? {};
      sessions.set(sid, st);
      const role = /You are Reconcile reviewer (\w+)\./.exec(text)?.[1];
      if (role) {
        st.kind = "reviewer";
        st.role = role;
        st.mode = /- Mode: Artifact edits/.test(text) ? "artifact" : "conversation";
        st.candidateRef = between(text, "- Candidate: ", "\n");
        st.nested = /this review may replace only the scope report/.test(text);
      } else if (/You evaluate one approved Retrace scope/.test(text)) st.kind = "evaluator";
      const D = st.kind === "evaluator" ? evaluatorReply(st, text) : reviewerReply(st, text);
      const tid = `yield-${randomUUID().slice(0, 8)}`;
      await sleep(st.kind === "evaluator" ? 700 : 150);
      await write({ jsonrpc: "2.0", method: "session/update", params: { sessionId: sid, update: { sessionUpdate: "tool_call", toolCallId: tid, title: "yield", kind: "other", status: "in_progress", rawInput: { data: D } } } });
      await sleep(st.kind === "evaluator" ? 700 : 150);
      await write({ jsonrpc: "2.0", method: "session/update", params: { sessionId: sid, update: { sessionUpdate: "tool_call_update", toolCallId: tid, title: "yield", kind: "other", status: "completed", content: [{ type: "content", content: { type: "text", text: "Result submitted." } }], rawOutput: { content: [{ type: "text", text: "Result submitted." }], details: { data: D, status: "success" } } } } });
      await respond(msg.id, { stopReason: "end_turn" });
      break;
    }
    default:
      await write({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: "Method not found" } });
  }
}
