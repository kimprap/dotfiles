#!/usr/bin/env node
// Mechanics-only scripted ACP agent for rehearsing the B1 soak controller
// without a model. Answers soak-token/soak-size prompts with one native-shaped
// `yield` tool call; the first attempt of any expectation whose token contains
// "-E4-" in session 2 returns a wrong token to exercise the shared re-ask path.
// Remembered tokens live in per-session files under the (private) cwd so they survive an
// idle-expiry process restart, like a restored session.
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { randomUUID } from "node:crypto";

// One file per session: concurrent fixture processes never share a file.
const memFile = (sid) => path.join(process.cwd(), `.soak-fixture-${sid}.token`);
const recall = (sid) => (fs.existsSync(memFile(sid)) ? fs.readFileSync(memFile(sid), "utf8") : undefined);
const remember = (sid, token) => fs.writeFileSync(memFile(sid), token);
const write = (obj) => new Promise((resolve) => (process.stdout.write(`${JSON.stringify(obj)}\n`) ? resolve() : process.stdout.once("drain", resolve)));
const respond = (id, result) => write({ jsonrpc: "2.0", id, result });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function reply(sid, text) {
  let token = /`token` is exactly `([^`]+)`/.exec(text)?.[1] ?? /Line NNNN: ([^ ]+) /.exec(text)?.[1];
  const size = /`kind` is `soak-size`/.test(text) || /"kind": "soak-size"/.test(text);
  if (token) remember(sid, token);
  else token = recall(sid) ?? "unknown";
  if (!size && token.includes("S2-E4-") && !/was not accepted/.test(text)) {
    return { kind: "soak-token", token: "WRONG" };
  }
  if (size) return { kind: "soak-size", payload: Array.from({ length: 700 }, (_, i) => `Line ${String(i + 1).padStart(4, "0")}: ${token} the quick brown fox jumps over the lazy dog.`).join("\n") };
  return { kind: "soak-token", token };
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
      const D = reply(sid, text);
      const tid = `yield-${randomUUID().slice(0, 8)}`;
      await sleep(300);
      await write({ jsonrpc: "2.0", method: "session/update", params: { sessionId: sid, update: { sessionUpdate: "tool_call", toolCallId: tid, title: "yield", kind: "other", status: "in_progress", rawInput: { data: D } } } });
      await sleep(300);
      await write({ jsonrpc: "2.0", method: "session/update", params: { sessionId: sid, update: { sessionUpdate: "tool_call_update", toolCallId: tid, title: "yield", kind: "other", status: "completed", content: [{ type: "content", content: { type: "text", text: "Result submitted." } }], rawOutput: { content: [{ type: "text", text: "Result submitted." }], details: { data: D, status: "success" } } } } });
      await respond(msg.id, { stopReason: "end_turn" });
      break;
    }
    default:
      await write({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: "Method not found" } });
  }
}
