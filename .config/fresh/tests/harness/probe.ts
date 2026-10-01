// Test-only probe template. tests/harness/session.py renders it into each
// per-case profile copy as plugins/zz-test-probe.ts; it never exists in the repo
// profile. Protocol: the harness atomically writes DIR/req-<n>.json
// ({op, args}); the probe polls for the next <n> every 50 ms, then writes
// DIR/resp-<n>.json ({seq, ok, result, error, state}) followed by DIR/resp-<n>.done.
// Every path is new, so neither renamePath nor replaceFile is needed.
const editor = getEditor();
const DIR: string = __PROBE_DIR__;
let next = 1;
let busy = false;
let stopped = false;

async function textOf(bufferId: number, start: number, end: number): Promise<string | null> {
  try {
    return await editor.getBufferText(bufferId, start, end);
  } catch {
    return null;
  }
}

async function snapshot() {
  await editor.flush();
  const bufferId = editor.getActiveBufferId();
  const info = editor.getBufferInfo(bufferId);
  const text = info ? await textOf(bufferId, 0, info.length) : null;
  const cursors = [...editor.getAllCursors()].sort((a, b) => a.position - b.position);
  const selected: (string | null)[] = [];
  for (const cursor of cursors) {
    selected.push(cursor.selection && text !== null
      ? await textOf(bufferId, cursor.selection.start, cursor.selection.end)
      : null);
  }
  const workspace = editor.describeWorkspace();
  return {
    buffer: info, text, primary: editor.getPrimaryCursor(), cursors, selected,
    mode: editor.getEditorMode() ?? null, search: editor.hasActiveSearch(),
    viewport: editor.getViewport(), panes: workspace.panes,
    splits: editor.listSplits(), buffers: editor.listBuffers(),
  };
}

async function handle(op: string, args: Record<string, unknown>): Promise<unknown> {
  switch (op) {
    case "snapshot":
      return null;
    case "open":
      if (typeof args.path !== "string") throw new Error("open needs a path");
      return editor.openFile(args.path, (args.line as number) ?? null, (args.column as number) ?? null);
    case "cursor":
      if (typeof args.position !== "number") throw new Error("cursor needs a position");
      return editor.setBufferCursor(editor.getActiveBufferId(), args.position);
    case "action":
      if (typeof args.name !== "string") throw new Error("action needs a name");
      return editor.executeAction(args.name);
    case "quit":
      stopped = true;
      return editor.executeAction(args.force === false ? "quit" : "force_quit");
    default:
      throw new Error("unknown probe op: " + op);
  }
}

async function zzTestProbeTick() {
  try {
    if (!busy) {
      const raw = editor.readFile(`${DIR}/req-${next}.json`);
      if (raw !== null && raw !== undefined) {
        busy = true;
        const seq = next;
        next += 1;
        let reply: Record<string, unknown>;
        try {
          const request = JSON.parse(raw);
          const result = await handle(request.op, request.args ?? {});
          await editor.flush();
          reply = { seq, ok: true, result: result ?? null, error: null, state: await snapshot() };
        } catch (error) {
          reply = { seq, ok: false, result: null, error: String(error), state: null };
        }
        editor.writeFile(`${DIR}/resp-${seq}.json`, JSON.stringify(reply));
        editor.writeFile(`${DIR}/resp-${seq}.done`, "1");
        busy = false;
      }
    }
  } catch (error) {
    busy = false;
    editor.writeFile(`${DIR}/probe-error-${next}.txt`, String(error));
  } finally {
    if (!stopped) editor.setTimeout(50, "zzTestProbeTick");
  }
}

registerHandler("zzTestProbeTick", zzTestProbeTick);
editor.setTimeout(50, "zzTestProbeTick");
