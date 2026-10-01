// Comment toggling and line duplication keep carets and selections on the
// same source text; both share the UTF-8 offset helpers.
export function lineEdits(editor: EditorAPI): void {
  function utf8LineStarts(text: string): number[] {
    const starts = [0];
    let bytes = 0;
    for (const ch of text) {
      bytes += editor.utf8ByteLength(ch);
      if (ch === "\n") starts.push(bytes);
    }
    return starts;
  }

  function utf8LineIndex(starts: number[], pos: number): number {
    let line = 0;
    for (let i = 0; i < starts.length; i++) {
      if (starts[i] <= pos) line = i;
      else break;
    }
    return line;
  }

  function utf8Slice(text: string, start: number, end: number): string {
    let b = 0;
    let out = "";
    for (const ch of text) {
      const n = editor.utf8ByteLength(ch);
      if (b >= end) break;
      if (b >= start) out += ch;
      b += n;
    }
    return out;
  }

  type MarkerRange = { start: number; end: number };

  function asMarker(value: unknown): MarkerRange | null {
    if (!value || typeof value !== "object") return null;
    const m = value as { start?: unknown; end?: unknown };
    if (typeof m.start !== "number" || typeof m.end !== "number") return null;
    return { start: m.start, end: m.end };
  }

  async function selectByteRange(
    id: number,
    start: number,
    end: number,
    forward: boolean,
  ): Promise<void> {
    if (end <= start) {
      editor.setBufferCursor(id, start);
      await editor.flush();
      return;
    }
    if (forward) {
      editor.setBufferCursor(id, start);
      await editor.flush();
      for (; ;) {
        const cur = editor.getPrimaryCursor();
        if (!cur || cur.position >= end) return;
        const before = cur.position;
        editor.executeAction("select_right");
        await editor.flush();
        const next = editor.getPrimaryCursor();
        if (!next || next.position === before || next.position > end) return;
      }
    }
    editor.setBufferCursor(id, end);
    await editor.flush();
    for (; ;) {
      const cur = editor.getPrimaryCursor();
      if (!cur || cur.position <= start) return;
      const before = cur.position;
      editor.executeAction("select_left");
      await editor.flush();
      const next = editor.getPrimaryCursor();
      if (!next || next.position === before || next.position < start) return;
    }
  }

  async function toggleCommentPreserveCursor(): Promise<void> {
    const id = editor.getActiveBufferId();
    const primary = editor.getPrimaryCursor();
    if (!primary) {
      editor.executeAction("toggle_comment");
      return;
    }
    if (editor.getAllCursors().length > 1) {
      editor.executeAction("toggle_comment");
      await editor.flush();
      return;
    }
    const sel = primary.selection;
    const forward = !sel || primary.position >= sel.end;
    editor.createMarker(id, "__fresh_comment_caret", primary.position, primary.position, {});
    if (sel) {
      editor.createMarker(id, "__fresh_comment_sel", sel.start, sel.end, {});
    }
    editor.executeAction("toggle_comment");
    await editor.flush();
    const caret = asMarker(editor.getMarker(id, "__fresh_comment_caret"));
    const mappedSel = sel ? asMarker(editor.getMarker(id, "__fresh_comment_sel")) : null;
    editor.deleteMarker(id, "__fresh_comment_caret");
    if (sel) editor.deleteMarker(id, "__fresh_comment_sel");
    if (mappedSel && mappedSel.end > mappedSel.start) {
      await selectByteRange(id, mappedSel.start, mappedSel.end, forward);
      return;
    }
    if (caret) editor.setBufferCursor(id, caret.start);
  }

  // A buffer closed while a command awaits ends it quietly; other failures still reject.
  async function unlessClosed(id: number, work: Promise<void>): Promise<void> {
    try {
      await work;
    } catch (error) {
      if (editor.getBufferInfo(id)) throw error;
    }
  }

  registerHandler("toggleCommentPreserveCursor", () =>
    unlessClosed(editor.getActiveBufferId(), toggleCommentPreserveCursor()),
  );
  editor.registerCommand(
    "Toggle Comment (preserve cursor)",
    "Toggle comments while keeping the caret on the same source character",
    "toggleCommentPreserveCursor",
  );

  type DupSnap = {
    pos: number;
    sel: { start: number; end: number } | null;
    forward: boolean;
    span: { start: number; end: number };
  };

  function cursorLineSpan(
    text: string,
    starts: number[],
    c: { position: number; selection: { start: number; end: number } | null },
  ): { start: number; end: number } {
    const a = c.selection ? c.selection.start : c.position;
    const b = c.selection ? c.selection.end : c.position;
    const sl = utf8LineIndex(starts, a);
    const el = utf8LineIndex(starts, b > a ? b - 1 : b);
    return {
      start: starts[sl],
      end: starts[el + 1] ?? editor.utf8ByteLength(text),
    };
  }

  function spanHeight(text: string, span: { start: number; end: number }): number {
    const block = utf8Slice(text, span.start, span.end);
    if (!block) return 1;
    let n = 1;
    for (const ch of block) {
      if (ch === "\n") n++;
    }
    if (block.endsWith("\n")) n--;
    return Math.max(1, n);
  }

  function uniqueCursors(
    primary: {
      position: number;
      selection: { start: number; end: number } | null;
    },
    all: {
      position: number;
      selection: { start: number; end: number } | null;
    }[],
  ): typeof all {
    return [
      primary,
      ...all.filter(
        (c) =>
          c.position !== primary.position ||
          (c.selection?.start ?? -1) !== (primary.selection?.start ?? -1) ||
          (c.selection?.end ?? -1) !== (primary.selection?.end ?? -1),
      ),
    ];
  }

  async function selectedEquals(id: number, needle: string): Promise<boolean> {
    const p = editor.getPrimaryCursor();
    if (!p?.selection) return false;
    const t = await editor.getBufferText(id, p.selection.start, p.selection.end);
    return t === needle;
  }

  async function reselectNeedle(
    id: number,
    needle: string,
    forward: boolean,
  ): Promise<void> {
    if (!needle) return;
    const cur = editor.getPrimaryCursor();
    if (cur?.selection) {
      editor.executeAction(forward ? "move_right" : "move_left");
      await editor.flush();
    }
    let units = 0;
    for (; ;) {
      units++;
      editor.executeAction("select_left");
      await editor.flush();
      if (await selectedEquals(id, needle)) break;
      const p = editor.getPrimaryCursor();
      if (!p?.selection || units >= 256) return;
    }
    if (!forward) return;
    editor.executeActions([
      { action: "move_right" },
      { action: "move_left", count: units },
      { action: "select_right", count: units },
    ]);
    await editor.flush();
  }

  function extraNeedle(
    text: string,
    snaps: DupSnap[],
  ): { needle: string; forward: boolean } | null {
    const needle = snaps[0]?.sel
      ? utf8Slice(text, snaps[0].sel.start, snaps[0].sel.end)
      : "";
    if (
      !needle ||
      !snaps.every(
        (s) =>
          s.sel != null &&
          utf8Slice(text, s.sel.start, s.sel.end) === needle &&
          s.forward === snaps[0].forward,
      )
    ) {
      return null;
    }
    return { needle, forward: snaps[0].forward };
  }

  async function duplicateLines(direction: "below" | "above"): Promise<void> {
    const id = editor.getActiveBufferId();
    const primary = editor.getPrimaryCursor();
    const all = editor.getAllCursors();
    if (!primary || all.length === 0) return;
    const cursors = uniqueCursors(primary, all);
    const text = await editor.getBufferText(id);
    const starts = utf8LineStarts(text);
    const nl = text.includes("\r\n") ? "\r\n" : "\n";
    const snaps: DupSnap[] = cursors.map((c) => ({
      pos: c.position,
      sel: c.selection,
      forward: !c.selection || c.position >= c.selection.end,
      span: cursorLineSpan(text, starts, c),
    }));
    const extra = snaps.length > 1;
    const heights = snaps.map((s) => spanHeight(text, s.span));
    const height = heights[0] ?? 1;
    const uniformHeight = heights.every((h) => h === height);

    if (direction === "above") {
      const aboveOrder = snaps
        .map((_, i) => i)
        .sort((a, b) => snaps[b].span.start - snaps[a].span.start);
      for (const i of aboveOrder) {
        const block = utf8Slice(text, snaps[i].span.start, snaps[i].span.end);
        const payload = block.endsWith("\n") ? block : block + nl;
        editor.insertText(id, snaps[i].span.start, payload);
      }
      await editor.flush();
      if (extra) {
        editor.executeAction(snaps[0].forward ? "move_right" : "move_left");
        await editor.flush();
        if (uniformHeight) {
          for (let n = 0; n < height; n++) {
            editor.executeAction("move_up");
            await editor.flush();
          }
        }
        const extraSel = extraNeedle(text, snaps);
        if (extraSel) await reselectNeedle(id, extraSel.needle, extraSel.forward);
        return;
      }
      const copyStart = snaps[0].span.start;
      if (snaps[0].sel) {
        await selectByteRange(
          id,
          copyStart + (snaps[0].sel.start - snaps[0].span.start),
          copyStart + (snaps[0].sel.end - snaps[0].span.start),
          snaps[0].forward,
        );
      } else {
        editor.setBufferCursor(id, copyStart + (snaps[0].pos - snaps[0].span.start));
      }
      return;
    }

    if (extra) {
      const belowOrder = snaps
        .map((_, i) => i)
        .sort((a, b) => snaps[b].span.end - snaps[a].span.end);
      for (const i of belowOrder) {
        const block = utf8Slice(text, snaps[i].span.start, snaps[i].span.end);
        const payload = block.endsWith("\n") ? block : nl + block;
        editor.insertText(id, snaps[i].span.end, payload);
      }
      await editor.flush();
      editor.executeAction(snaps[0].forward ? "move_right" : "move_left");
      await editor.flush();
      if (uniformHeight) {
        for (let n = 0; n < height; n++) {
          editor.executeAction("move_down");
          await editor.flush();
        }
      }
      const extraSel = extraNeedle(text, snaps);
      if (extraSel) await reselectNeedle(id, extraSel.needle, extraSel.forward);
      return;
    }

    editor.executeAction("duplicate_line");
    await editor.flush();
    const copyStart = editor.getPrimaryCursor()?.position ?? 0;
    if (snaps[0].sel) {
      await selectByteRange(
        id,
        copyStart + (snaps[0].sel.start - snaps[0].span.start),
        copyStart + (snaps[0].sel.end - snaps[0].span.start),
        snaps[0].forward,
      );
      return;
    }
    const rel = snaps[0].pos - snaps[0].span.start;
    if (rel !== 0) editor.setBufferCursor(id, copyStart + rel);
  }

  registerHandler("duplicateLinesBelow", () =>
    unlessClosed(editor.getActiveBufferId(), duplicateLines("below")),
  );
  registerHandler("duplicateLinesAbove", () =>
    unlessClosed(editor.getActiveBufferId(), duplicateLines("above")),
  );
  editor.registerCommand(
    "Duplicate Lines Below",
    "Duplicate the affected lines below and keep carets on the copies",
    "duplicateLinesBelow",
  );
  editor.registerCommand(
    "Duplicate Lines Above",
    "Duplicate the affected lines above and keep carets on the copies",
    "duplicateLinesAbove",
  );
}
