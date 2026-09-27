#!/usr/bin/env node
// Scripted ACP agent for the offline suite (never calls a model or OMP).
//
// Run as a program it is an ACP agent over stdio that accepts the production
// launch argv (`acp --model <id> ... --session-dir <dir>`) and advertises
// `resume`. `--fail-resume` makes every session/resume fail. Behavior comes
// from the JSON plan in env SCRIPTED_ACP_PLAN: `{ "<model>": [entry, ...] }`,
// one entry consumed per received prompt across every process of that model.
// An entry is a response string, or `{ "when": "<substring>", "then": "<response>" }`
// which only matches a prompt containing `when`. Responses:
//   yield:<data JSON>          completed success `yield` with that data
//   invalid:<data JSON>        the same wire shape (data the domain rejects)
//   prose                      message text only, end_turn
//   unfinished-yield           `yield` start without a terminal update
//   failed-yield               `yield` start, then a failed terminal update
//   forbidden-tool[:<data>]    a completed `execute` tool call (then optional yield)
// A prompt with no matching entry fails the turn with an ACP error.
// Every event is appended as one JSON line to env SCRIPTED_ACP_LOG:
//   {event:"start"|"exit", model, pid, at}
//   {event:"session-new"|"session-resume", model, sessionId, ok, pid, at}
//   {event:"prompt", model, sessionId, passMarker, promptSha, response, pid, at}
// `passMarker` is the value of the prompt's first `Pass:` or `Phase:` line, or null.
// Each prompt adds 100 tokens and 0.01 USD to its session's cumulative usage.
//
// Imported as a module it exports createScriptedLauncher(), which writes an
// executable launcher that sets the plan/log environment (the controller runs
// agents under a sanitized environment) and execs this agent.
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { fileURLToPath } from "node:url";

const SELF = fileURLToPath(import.meta.url);

/** Writes `<dir>/scripted-omp` and returns its absolute path (use as `ompPath`). */
export function createScriptedLauncher({ dir, plan, log, failResume = false }) {
  const q = (s) => `'${String(s).replaceAll("'", "'\\''")}'`;
  const launcher = path.join(dir, "scripted-omp");
  const extra = failResume ? " --fail-resume" : "";
  fs.writeFileSync(launcher, `#!/bin/sh\nSCRIPTED_ACP_PLAN=${q(plan)} SCRIPTED_ACP_LOG=${q(log)} exec ${q(process.execPath)} ${q(SELF)} "$@"${extra}\n`, { mode: 0o755 });
  return launcher;
}

function argValue(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function runAgent() {
  const { AgentSideConnection, ndJsonStream } = await import("@agentclientprotocol/sdk");
  const argv = process.argv.slice(2);
  const model = argValue(argv, "--model") ?? "unknown";
  const sessionDir = argValue(argv, "--session-dir");
  const failResume = argv.includes("--fail-resume");
  const planFile = process.env.SCRIPTED_ACP_PLAN;
  const logFile = process.env.SCRIPTED_ACP_LOG;
  const claims = planFile ? `${planFile}.claims` : undefined;
  const usage = new Map(); // sessionId -> { tokens, cost }

  const log = (event, fields = {}) => {
    if (logFile) fs.appendFileSync(logFile, `${JSON.stringify({ event, model, ...fields, pid: process.pid, at: Date.now() })}\n`);
  };

  /** Claims the first unclaimed plan entry for this model that matches the prompt. */
  const claim = (text) => {
    if (!planFile) return undefined;
    const entries = JSON.parse(fs.readFileSync(planFile, "utf8"))[model] ?? [];
    fs.mkdirSync(claims, { recursive: true });
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const response = typeof e === "string" ? e : e.then;
      if (typeof e !== "string" && !text.includes(e.when)) continue;
      try {
        fs.mkdirSync(path.join(claims, `${encodeURIComponent(model)}.${i}`));
        return response;
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
    }
    return undefined;
  };

  const yieldUpdates = (id, data, status) => [
    { sessionUpdate: "tool_call", toolCallId: id, title: "yield", kind: "other", status: "in_progress", rawInput: { data } },
    status === "success"
      ? {
          sessionUpdate: "tool_call_update", toolCallId: id, title: "yield", kind: "other", status: "completed",
          content: [{ type: "content", content: { type: "text", text: "Result submitted." } }],
          rawOutput: { content: [{ type: "text", text: "Result submitted." }], details: { data, status: "success" } },
        }
      : { sessionUpdate: "tool_call_update", toolCallId: id, title: "yield", kind: "other", status: "failed", rawOutput: { details: { status: "error" } } },
  ];

  class ScriptedAgent {
    constructor(conn) {
      this.conn = conn;
    }
    async initialize() {
      return { protocolVersion: 1, agentCapabilities: { sessionCapabilities: { resume: {} } } };
    }
    async newSession() {
      const sessionId = randomUUID();
      if (sessionDir) {
        fs.mkdirSync(sessionDir, { recursive: true });
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        fs.writeFileSync(path.join(sessionDir, `${ts}_${sessionId}.jsonl`), `${JSON.stringify({ type: "session", id: sessionId })}\n`);
      }
      log("session-new", { sessionId, ok: true });
      return { sessionId };
    }
    async resumeSession(params) {
      log("session-resume", { sessionId: params.sessionId, ok: !failResume });
      if (failResume) throw new Error(`ACP session not found: ${params.sessionId}`);
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
      const response = claim(text);
      log("prompt", {
        sessionId,
        passMarker: /^(?:Pass|Phase):\s*(.+?)\s*$/m.exec(text)?.[1] ?? null,
        promptSha: createHash("sha256").update(text).digest("hex"),
        response: response ?? null,
      });
      if (response === undefined) throw new Error(`scripted plan has no entry for ${model}`);
      const u = usage.get(sessionId) ?? { tokens: 0, cost: 0 };
      u.tokens += 100;
      u.cost = Number((u.cost + 0.01).toFixed(6));
      usage.set(sessionId, u);
      await send({ sessionUpdate: "agent_message_chunk", content: { type: "text", text: "working" } });
      const sep = response.indexOf(":");
      const [mode, arg] = sep < 0 ? [response, undefined] : [response.slice(0, sep), response.slice(sep + 1)];
      if (mode === "yield" || mode === "invalid") {
        for (const x of yieldUpdates(`yield-${randomUUID()}`, JSON.parse(arg), "success")) await send(x);
      } else if (mode === "unfinished-yield") {
        await send(yieldUpdates(`yield-${randomUUID()}`, { kind: "unfinished" }, "success")[0]);
      } else if (mode === "failed-yield") {
        for (const x of yieldUpdates(`yield-${randomUUID()}`, { kind: "failed" }, "failed")) await send(x);
      } else if (mode === "forbidden-tool") {
        const id = `exec-${randomUUID()}`;
        await send({ sessionUpdate: "tool_call", toolCallId: id, title: "bash", kind: "execute", status: "in_progress", rawInput: { command: "true" } });
        await send({ sessionUpdate: "tool_call_update", toolCallId: id, status: "completed", rawOutput: { details: { status: "success" } } });
        if (arg !== undefined) for (const x of yieldUpdates(`yield-${randomUUID()}`, JSON.parse(arg), "success")) await send(x);
      } else if (mode === "prose") {
        await send({ sessionUpdate: "agent_message_chunk", content: { type: "text", text: "prose only" } });
      } else throw new Error(`unknown scripted response ${response}`);
      await send({ sessionUpdate: "usage_update", used: u.tokens, size: 200_000, cost: { amount: u.cost, currency: "USD" } });
      return { stopReason: "end_turn", usage: { inputTokens: u.tokens / 2, outputTokens: u.tokens / 2, totalTokens: u.tokens } };
    }
  }

  log("start");
  process.on("exit", () => log("exit"));
  const stream = ndJsonStream(Writable.toWeb(process.stdout), Readable.toWeb(process.stdin));
  new AgentSideConnection((conn) => new ScriptedAgent(conn), stream);
}

// Serves ACP only for the launch argv (`acp ...`); any other run, including the
// test runner loading this file, exits at once.
if (process.argv[2] === "acp" && process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(SELF)) await runAgent();
