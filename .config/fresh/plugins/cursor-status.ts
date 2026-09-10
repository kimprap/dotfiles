import { countGraphemes } from "../vendor/unicode-segmenter-0.17.3/grapheme.js";

const editor = getEditor();

// One token avoids the native cursor token's padding before the total.
// Count the live line prefix in graphemes, not UTF-8 bytes or UTF-16 units.
editor.registerStatusBarElement("cursor_total", "Line:column|total lines");
let refreshing = false;
let previousBuffer: number | null = null;
let previousValue = "";
let previousPrefix: string | undefined;
let previousColumn = 1;

registerHandler("refreshCursorStatus", async () => {
  if (refreshing) return;
  refreshing = true;
  try {
    const bufferId = editor.getActiveBufferId();
    const splitId = editor.getActiveSplitId();
    const info = editor.getBufferInfo(bufferId);
    const cursor = editor.getPrimaryCursor();
    if (!info || !cursor) return;

    const total = info.line_count ?? "?";
    let value = info.is_terminal ? "" : `?:?|${total}`;
    if (!info.is_terminal && cursor.line !== null) {
      const stillCurrent = () => {
        const current = editor.getPrimaryCursor();
        return (
          editor.getActiveBufferId() === bufferId &&
          editor.getActiveSplitId() === splitId &&
          current?.position === cursor.position &&
          current?.line === cursor.line &&
          editor.getBufferInfo(bufferId)?.line_count === info.line_count
        );
      };
      const start = await editor.getLineStartPosition(cursor.line);
      if (!stillCurrent()) return;
      let column: number | string = "?";
      if (start !== null) {
        const prefix = await editor.getBufferText(bufferId, start, cursor.position);
        if (!stillCurrent()) return;
        if (prefix !== previousPrefix) {
          previousPrefix = prefix;
          previousColumn = countGraphemes(prefix) + 1;
        }
        column = previousColumn;
      }
      value = `${cursor.line + 1}:${column}|${total}`;
    }
    if (bufferId !== previousBuffer || value !== previousValue) {
      editor.setStatusBarValue(bufferId, "cursor_total", value);
      previousBuffer = bufferId;
      previousValue = value;
    }
  } finally {
    refreshing = false;
  }
});
// History replay bypasses edit hooks and can preserve all snapshot fields.
// Read the live prefix each frame; coalesce in-flight reads and unchanged output.
editor.on("render_start", "refreshCursorStatus");
