// Template only: rendered into a disposable full profile by check.py.
const editor = getEditor();
const ROOT = __FRESH_COMPAT_ROOT__;
const RUN_ID = __FRESH_COMPAT_RUN_ID__;
const FIXTURE = ROOT + "/fixture";
const REQUEST = ROOT + "/request.json";
const RESPONSE = ROOT + "/response.json";
let lastSeq = 0;
let stopping = false;
editor.defineMode("compat-editable", [], false, false, false);

async function snap() {
  await editor.flush();
  const bufferId = editor.getActiveBufferId();
  const info = editor.getBufferInfo(bufferId);
  if (!info) throw new Error("active buffer has no BufferInfo");
  let text: string | null;
  try {
    text = await editor.getBufferText(bufferId, 0, info.length);
  } catch (error) {
    if (!info.is_virtual) throw error;
    text = null;
  }
  const primary = editor.getPrimaryCursor();
  const all = [...editor.getAllCursors()].sort((a, b) => a.position - b.position);
  const selected: (string | null)[] = [];
  for (const cursor of all) {
    selected.push(cursor.selection && text !== null
      ? await editor.getBufferText(bufferId, cursor.selection.start, cursor.selection.end)
      : null);
  }
  return {
    bufferId, path: info.path, name: info.name, language: info.language,
    view_mode: info.view_mode, length: info.length, line_count: info.line_count,
    is_terminal: info.is_terminal, is_virtual: info.is_virtual,
    text, primary, all, selected, cursorCount: all.length,
    mode: editor.getEditorMode() ?? null, search: editor.hasActiveSearch(),
    panes: editor.describeWorkspace().panes.map(pane => ({
      splitId: pane.splitId, bufferId: pane.bufferId, kind: pane.kind,
      path: pane.path, active: pane.active, x: pane.x, y: pane.y,
      width: pane.width, height: pane.height,
    })),
    splits: editor.listSplits(), buffers: editor.listBuffers(),
  };
}

async function respond(seq: number, status: string, error: string | null = null) {
  const state = await snap();
  const next = RESPONSE + ".next";
  if (!editor.writeFile(next, JSON.stringify({run_id: RUN_ID, seq, status, state, error})) ||
      !editor.renamePath(next, RESPONSE)) throw new Error("cannot publish probe response");
}

async function handle(op: string, args: Record<string, unknown>) {
  switch (op) {
    case "snapshot": break;
    case "open-path": {
      const path = args.path;
      if (typeof path !== "string" || !path.startsWith(FIXTURE + "/") ||
          path.split("/").some(part => part === ".." || part === ".")) {
        throw new Error("open-path outside fixture root");
      }
      await editor.openFile(path);
      break;
    }
    case "cursor": {
      const position = args.position;
      if (typeof position !== "number" || !Number.isSafeInteger(position) || position < 0)
        throw new Error("invalid cursor byte position");
      editor.setBufferCursor(editor.getActiveBufferId(), position);
      break;
    }
    case "action":
      if (typeof args.name !== "string") throw new Error("missing setup action");
      editor.executeAction(args.name);
      break;
    case "mode":
      if (args.name !== null && args.name !== "compat-editable")
        throw new Error("unsupported setup mode");
      editor.setEditorMode(args.name as string | null);
      break;
    case "stop": stopping = true; break;
    default: throw new Error("unsupported probe primitive: " + op);
  }
  await editor.flush();
}

async function loop() {
  await respond(0, "ready");
  while (!stopping) {
    await editor.delay(40);
    const raw = editor.readFile(REQUEST);
    if (!raw) continue;
    let request;
    try { request = JSON.parse(raw); } catch { continue; }
    if (request.run_id !== RUN_ID || !Number.isSafeInteger(request.seq) || request.seq <= lastSeq)
      continue;
    if (request.seq !== lastSeq + 1) {
      await respond(request.seq, "error", "nonconsecutive request sequence");
      stopping = true;
      continue;
    }
    lastSeq = request.seq;
    try {
      await handle(request.op, request.args ?? {});
      await respond(lastSeq, "ok");
    } catch (error) {
      await respond(lastSeq, "error", String(error));
    }
  }
  // All buffers belong to this throwaway session; nothing is saved on shutdown.
  editor.executeAction("force_quit");
}
editor.on("ready", "freshCompatReady");
registerHandler("freshCompatReady", () => { void loop(); });
