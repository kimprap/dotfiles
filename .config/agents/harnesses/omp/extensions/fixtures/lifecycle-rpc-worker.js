#!/usr/bin/env bun

import { appendFileSync } from "node:fs";

const behavior = process.env.LIFECYCLE_FIXTURE_BEHAVIOR ?? "normal";
const logPath = process.env.LIFECYCLE_FIXTURE_LOG;
const barrierDirectory = process.env.LIFECYCLE_FIXTURE_BARRIER_DIR;
const MAX_FRAME_BYTES = 1_048_576;
const MAX_REASSEMBLED_BYTES = 67_108_864;
let protocolVersion = 1;
let hostSequence = 0;
const pendingHostCalls = new Map();
let predecessorTerminalPending = false;
let predecessorTerminalRequestId;

function log(event, details = {}) {
    if (!logPath) return;
    appendFileSync(logPath, `${JSON.stringify({ event, pid: process.pid, behavior, ...details })}\n`);
}

log("start", { argv: process.argv.slice(2) });
if (behavior === "start-exit") {
    log("startup-exit", { code: 19 });
    process.exit(19);
}

function writeFrame(value) {
    const bytes = Buffer.from(JSON.stringify(value));
    if (protocolVersion !== 2 || bytes.length + 1 <= MAX_FRAME_BYTES) {
        process.stdout.write(bytes);
        process.stdout.write("\n");
        return;
    }
    if (bytes.length > MAX_REASSEMBLED_BYTES) throw new Error("fixture frame exceeds reassembly limit");
    const chunkSize = 256 * 1024;
    const count = Math.ceil(bytes.length / chunkSize);
    const chunkId = `fixture-chunk-${hostSequence}`;
    for (let index = 0; index < count; index += 1) {
        const data = bytes.subarray(index * chunkSize, Math.min(bytes.length, (index + 1) * chunkSize)).toString("base64");
        process.stdout.write(`${JSON.stringify({
            type: "rpc_chunk",
            chunkId,
            index,
            count,
            byteLength: bytes.length,
            data,
        })}\n`);
    }
}

function response(command, data = undefined, success = true, error = undefined) {
    const frame = { id: command.id, type: "response", command: command.type, success };
    if (data !== undefined) frame.data = data;
    if (error !== undefined) frame.error = error;
    writeFrame(frame);
}

function behaviorFromPrompt(command) {
    try {
        const envelope = JSON.parse(command.message);
        return { envelope, body: envelope.body ?? "" };
    } catch {
        return { envelope: {}, body: command.message };
    }
}

function replyBody(body) {
    for (const prefix of [
        "reply:",
        "reply-delay-end:",
        "reply-exit:",
        "reply-exit-delay:",
        "reply-duplicate:",
        "reply-stale-terminal:",
    ]) {
        if (body.startsWith(prefix)) return body.slice(prefix.length);
    }
    if (body === "fixture-pid") return String(process.pid);
    if (body.startsWith("large-reply-size:")) return "x".repeat(Number.parseInt(body.slice("large-reply-size:".length), 10));
    return body;
}

function hostCall(kind, argumentsValue, metadata = {}) {
    const id = `host-${++hostSequence}`;
    pendingHostCalls.set(id, { ...metadata, kind });
    writeFrame({
        type: "host_tool_call",
        id,
        toolCallId: `tool-${hostSequence}`,
        toolName: "lifecycle_channel",
        arguments: argumentsValue,
    });
}

function sessionEvent(frame) {
    writeFrame(frame);
    log("session-event", { frame });
}

function startTurn() {
    sessionEvent({ type: "turn_start" });
}

function endTurn() {
    sessionEvent({ type: "turn_end", message: { role: "assistant", content: [] }, toolResults: [] });
}

function finishTurn() {
    sessionEvent({ type: "agent_end", messages: [], isTerminal: true });
}
async function waitForBarrier(name) {
    if (!barrierDirectory) throw new Error("fixture barrier directory is unavailable");
    log("barrier-wait", { name });
    const path = `${barrierDirectory}/${name}`;
    while (!(await Bun.file(path).exists())) await Bun.sleep(5);
    log("barrier-open", { name });
}

function handlePrompt(command) {
    const { envelope, body } = behaviorFromPrompt(command);
    log("prompt", { actorId: envelope.actorId, requestId: envelope.requestId, body });
    if (body === "delivery-unknown") return;
    if (body === "pre-ack-exit") {
        process.exit(34);
        return;
    }
    if (predecessorTerminalPending) {
        const predecessorRequestId = predecessorTerminalRequestId;
        predecessorTerminalPending = false;
        predecessorTerminalRequestId = undefined;
        response(command, { agentInvoked: true });
        void (async () => {
            await waitForBarrier("emit-predecessor-terminal");
            finishTurn();
            log("predecessor-terminal", { requestId: predecessorRequestId });
            hostCall("predecessor-terminal-barrier", { op: "fixture-barrier" });
            await waitForBarrier("start-successor");
            sessionEvent({ type: "agent_start" });
            startTurn();
            writeFrame({ type: "message_end", message: { role: "assistant", content: [{ type: "text", text: "not authoritative" }] } });
            hostCall("reply", { op: "reply", body: replyBody(body), requestId: envelope.requestId }, { body });
        })();
        return;
    }
    response(command, { agentInvoked: true });
    sessionEvent({ type: "agent_start" });
    if (body === "pre-reply-events") {
        startTurn();
        endTurn();
        sessionEvent({ type: "agent_end", messages: [], isTerminal: false });
        hostCall("event-barrier", { op: "fixture-barrier" });
        return;
    }
    if (body.startsWith("reply-stale-terminal:")) {
        predecessorTerminalRequestId = envelope.requestId;
        startTurn();
    }
    if (body === "silent") return;
    if (body === "post-ack-exit") {
        setTimeout(() => process.exit(31), 5);
        return;
    }
    if (body === "no-reply") {
        finishTurn();
        return;
    }
    if (body === "scope-flow" || body === "scope-children-hold") {
        hostCall("scope-request", {
            op: "request",
            calls: [
                { target: `${envelope.actorId}/reviewer-a`, phase: "initial", body: "reply:A result" },
                { target: `${envelope.actorId}/reviewer-b`, phase: "initial", body: "reply:B result" },
            ],
        }, { actorId: envelope.actorId, hold: body === "scope-children-hold" });
        return;
    }
    writeFrame({ type: "message_end", message: { role: "assistant", content: [{ type: "text", text: "not authoritative" }] } });
    hostCall("reply", { op: "reply", body: replyBody(body), requestId: envelope.requestId }, { body });
}

function handleHostResult(frame) {
    const pending = pendingHostCalls.get(frame.id);
    pendingHostCalls.delete(frame.id);
    log("host-result", { kind: pending?.kind, success: frame.result?.ok, result: frame.result });
    if (!pending) return;
    if (pending.kind === "reply") {
        if (pending.body.startsWith("reply-duplicate:")) {
            hostCall("duplicate", { op: "reply", body: "replacement" });
            return;
        }
        if (pending.body.startsWith("reply-exit-delay:")) {
            setTimeout(() => process.exit(33), 100);
            return;
        }
        if (pending.body.startsWith("reply-exit:")) {
            setTimeout(() => process.exit(32), 5);
            return;
        }
        if (pending.body.startsWith("reply-delay-end:")) {
            setTimeout(finishTurn, 100);
            return;
        }
        if (pending.body.startsWith("reply-stale-terminal:")) {
            void (async () => {
                await waitForBarrier("release-predecessor");
                endTurn();
                predecessorTerminalPending = true;
            })();
            return;
        }
        finishTurn();
        return;
    }
    if (pending.kind === "duplicate") {
        finishTurn();
        return;
    }
    if (pending.kind === "scope-request") {
        if (pending.hold) return;
        hostCall("dispose-a", { op: "dispose", actorId: `${pending.actorId}/reviewer-a`, subtree: false }, pending);
        return;
    }
    if (pending.kind === "dispose-a") {
        hostCall("dispose-b", { op: "dispose", actorId: `${pending.actorId}/reviewer-b`, subtree: false }, pending);
        return;
    }
    if (pending.kind === "dispose-b") {
        hostCall("scope-reply", { op: "reply", body: "scope-result" });
        return;
    }
    if (pending.kind === "scope-reply") finishTurn();
}

function handleCommand(command) {
    switch (command.type) {
        case "negotiate_protocol":
            protocolVersion = 2;
            response(command, { protocolVersion: 2 });
            return;
        case "set_host_tools":
            response(command, { toolNames: command.tools.map((tool) => tool.name) });
            return;
        case "set_auto_retry":
            response(command, { enabled: command.enabled });
            return;
        case "prompt":
            handlePrompt(command);
            return;
        case "abort":
            response(command);
            finishTurn();
            return;
        default:
            response(command);
    }
}

function handleLine(line) {
    let frame;
    try {
        frame = JSON.parse(line);
    } catch {
        writeFrame({ type: "response", command: "parse", success: false, error: "invalid JSON" });
        return;
    }
    if (frame.type === "host_tool_result") {
        handleHostResult(frame);
        return;
    }
    if (frame.type === "host_tool_update") return;
    handleCommand(frame);
}

writeFrame({
    type: "ready",
    protocolVersion: 1,
    supportedProtocolVersions: [1, 2],
    maxFrameBytes: MAX_FRAME_BYTES,
    maxReassembledFrameBytes: MAX_REASSEMBLED_BYTES,
});

let buffer = "";
for await (const chunk of Bun.stdin.stream()) {
    buffer += new TextDecoder().decode(chunk, { stream: true });
    for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) break;
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) handleLine(line);
    }
}
