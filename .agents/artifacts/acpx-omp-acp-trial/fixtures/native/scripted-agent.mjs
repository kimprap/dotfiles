#!/usr/bin/env node
// Scripted ACP agent for offline T1 adapter mechanics (never calls a model).
// Mechanics-only: it proves the trial adapter's public-acpx handling, not native
// OMP behavior. Prompt text selects the scripted turn:
//   SCRIPT:valid:<kind>:<field>:<value>     one completed success yield
//   SCRIPT:invalid:<kind>                   completed success yield with missing field
//   SCRIPT:noresult                         prose only, end_turn
//   SCRIPT:unfinished                       yield start without terminal update
//   SCRIPT:twoyields:<kind>:<field>:<a>:<b> invalid first candidate then a valid one
//   SCRIPT:forbidden                        failed execute attempt then valid yield
// Every turn also emits a read tool whose output carries a canary string that
// must never reach retained evidence.
import { Readable, Writable } from "node:stream";
import { randomUUID } from "node:crypto";
import { AgentSideConnection, ndJsonStream } from "@agentclientprotocol/sdk";

const CANARY = "CANARY-SCRIPTED-OUTPUT-7f3a";

function yieldUpdates(id, data) {
  return [
    { sessionUpdate: "tool_call", toolCallId: id, title: "yield", kind: "other", status: "in_progress", rawInput: { data } },
    {
      sessionUpdate: "tool_call_update", toolCallId: id, title: "yield", kind: "other", status: "completed",
      content: [{ type: "content", content: { type: "text", text: "Result submitted." } }],
      rawOutput: { content: [{ type: "text", text: "Result submitted." }], details: { data, status: "success", secretMeta: CANARY } },
    },
  ];
}

class ScriptedAgent {
  constructor(conn) {
    this.conn = conn;
  }
  async initialize() {
    return { protocolVersion: 1, agentCapabilities: { sessionCapabilities: { resume: {} } } };
  }
  async newSession() {
    return { sessionId: `scripted-${randomUUID()}` };
  }
  async resumeSession(params) {
    // `--fail-resume` reproduces the native T1 negative: the agent rejects a
    // same-ID session/resume with an internal error.
    if (process.argv.includes("--fail-resume")) throw new Error(`ACP session not found: ${params.sessionId}`);
    return {};
  }
  async authenticate() {
    return {};
  }
  async cancel() {}
  async prompt(params) {
    const text = params.prompt.map((b) => (b.type === "text" ? b.text : "")).join("");
    const sessionId = params.sessionId;
    const send = (update) => this.conn.sessionUpdate({ sessionId, update });
    const readId = `read-${randomUUID()}`;
    await send({ sessionUpdate: "tool_call", toolCallId: readId, title: "read", kind: "read", status: "in_progress", rawInput: { path: "notes.txt" } });
    await send({ sessionUpdate: "tool_call_update", toolCallId: readId, status: "completed", rawOutput: { content: CANARY, details: { status: "success", data: CANARY } } });
    await send({ sessionUpdate: "agent_message_chunk", content: { type: "text", text: `working ${CANARY}` } });
    const tagged = /SCRIPT:(\S+)/.exec(text)?.[1];
    const exampleKind = /"kind": "(probe-[a-z]+)"/.exec(text)?.[1];
    const field = /\{"data": \{"kind": "probe-[a-z]+", "(\w+)"/.exec(text)?.[1];
    // Untagged probe prompts get a valid reply of the worked-example shape.
    const [mode, ...args] = (tagged ?? (exampleKind && field ? `valid:${exampleKind}:${field}:scripted` : "noresult")).split(":");
    if (mode === "valid") {
      const [kind, field, value] = args;
      for (const u of yieldUpdates(`yield-${randomUUID()}`, { kind, [field]: value, extra: { nested: CANARY } })) await send(u);
    } else if (mode === "invalid") {
      for (const u of yieldUpdates(`yield-${randomUUID()}`, { kind: args[0] })) await send(u);
    } else if (mode === "unfinished") {
      await send({ sessionUpdate: "tool_call", toolCallId: `yield-${randomUUID()}`, title: "yield", kind: "other", status: "in_progress", rawInput: { data: { kind: "x" } } });
    } else if (mode === "twoyields") {
      const [kind, field, a, b] = args;
      for (const u of yieldUpdates(`yield-${randomUUID()}`, { kind, [field]: "" , note: a })) await send(u);
      for (const u of yieldUpdates(`yield-${randomUUID()}`, { kind, [field]: b })) await send(u);
    } else if (mode === "forbidden") {
      const id = `exec-${randomUUID()}`;
      await send({ sessionUpdate: "tool_call", toolCallId: id, title: "bash", kind: "execute", status: "in_progress", rawInput: { command: `echo ${CANARY}` } });
      await send({ sessionUpdate: "tool_call_update", toolCallId: id, status: "failed", rawOutput: { error: `tool not found ${CANARY}` } });
      const [kind, field, value] = args;
      for (const u of yieldUpdates(`yield-${randomUUID()}`, { kind, [field]: value })) await send(u);
    } else {
      await send({ sessionUpdate: "agent_message_chunk", content: { type: "text", text: "prose only" } });
    }
    return { stopReason: "end_turn" };
  }
}

const stream = ndJsonStream(Writable.toWeb(process.stdout), Readable.toWeb(process.stdin));
new AgentSideConnection((conn) => new ScriptedAgent(conn), stream);
