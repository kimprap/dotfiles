#!/usr/bin/env node
// Exact spec-v9 A3 scripted ACP server for the public-acpx 2 MiB fixture.
// Mechanics-only: one turn, never calls a model. Raw LF-delimited JSON-RPC 2.0
// over stdio so every emitted line is exactly the specified compact JSON.
import { createInterface } from "node:readline";

const SID = "fixture-2m";
const TID = "yield-2m";
const P = "BEGIN-2M\n" + "x".repeat(2097152 - 17) + "\nEND-2M\n";
const D = { kind: "transport-result", payload: P };
const rawInput = { data: D };
const rawOutput = { content: [{ type: "text", text: "Result submitted." }], details: { data: D, status: "success" } };
const startUpdate = { sessionUpdate: "tool_call", toolCallId: TID, title: "yield", kind: "other", status: "in_progress", rawInput };
const terminalUpdate = {
  sessionUpdate: "tool_call_update", toolCallId: TID, title: "yield", kind: "other", status: "completed",
  content: [{ type: "content", content: { type: "text", text: "Result submitted." } }],
  rawOutput,
};

const write = (obj) => new Promise((resolve) => (process.stdout.write(`${JSON.stringify(obj)}\n`) ? resolve() : process.stdout.once("drain", resolve)));
const respond = (id, result) => write({ jsonrpc: "2.0", id, result });

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.trim()) continue;
  const msg = JSON.parse(line);
  if (msg.id === undefined) continue; // notifications (e.g. session/cancel) need no reply
  switch (msg.method) {
    case "initialize":
      await respond(msg.id, { protocolVersion: 1, agentCapabilities: { sessionCapabilities: { resume: {} } } });
      break;
    case "session/new":
      await respond(msg.id, { sessionId: SID });
      break;
    case "session/resume":
      await respond(msg.id, {});
      break;
    case "session/prompt":
      await write({ jsonrpc: "2.0", method: "session/update", params: { sessionId: SID, update: startUpdate } });
      await write({ jsonrpc: "2.0", method: "session/update", params: { sessionId: SID, update: terminalUpdate } });
      await respond(msg.id, { stopReason: "end_turn" });
      break;
    default:
      await write({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: "Method not found" } });
  }
}
