// Reopen Closed Tab (Cmd+Shift+T). Fresh has no closed-tab stack;
// remember file-backed buffers and reopen the last closed path.
export function reopenClosedTab(editor: EditorAPI): void {
  const closedFilePaths: string[] = [];
  const bufferPaths = new Map<number, string>();

  function rememberBufferPath(bufferId: number): void {
    const info = editor.getBufferInfo(bufferId);
    if (!info || info.is_virtual || info.is_terminal || !info.path) return;
    bufferPaths.set(bufferId, info.path);
  }

  registerHandler("rememberActiveBufferPath", () => {
    rememberBufferPath(editor.getActiveBufferId());
  });
  registerHandler("rememberOpenedBufferPath", (payload: { buffer_id: number }) => {
    rememberBufferPath(payload.buffer_id);
  });
  registerHandler("recordClosedBuffer", (payload: { buffer_id: number }) => {
    const path = bufferPaths.get(payload.buffer_id);
    bufferPaths.delete(payload.buffer_id);
    if (!path) return;
    if (closedFilePaths[closedFilePaths.length - 1] !== path) {
      closedFilePaths.push(path);
    }
    if (closedFilePaths.length > 50) closedFilePaths.shift();
  });
  registerHandler("reopenClosedTab", () => {
    const path = closedFilePaths.pop();
    if (path) editor.openFile(path);
  });

  editor.on("buffer_activated", "rememberActiveBufferPath");
  editor.on("after_file_open", "rememberOpenedBufferPath");
  editor.on("buffer_closed", "recordClosedBuffer");
  editor.registerCommand(
    "Reopen Closed Tab",
    "Reopen the last closed file tab",
    "reopenClosedTab",
  );
}
