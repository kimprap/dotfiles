// Fresh 0.5.1 emits no plain-arrow movement at the selection's boundary line,
// leaving its anchor intact. Keep native movement everywhere else.
export function boundarySelection(editor: EditorAPI): void {
  let boundaryMoves: Promise<void> | null = null;

  function moveClearingBoundarySelection(down: boolean): void | Promise<void> {
    const bufferId = editor.getActiveBufferId();
    const windowId = editor.activeWindow();
    const splitId = editor.getActiveSplitId();
    const action = down ? "move_down" : "move_up";
    const documentAction = down ? "move_document_end" : "move_document_start";
    const cursor = editor.getPrimaryCursor();
    const selection = cursor?.selection;
    const single = () =>
      editor.getAllCursors().length <= 1 && editor.getAllCursorPositions().length <= 1;

    if (!boundaryMoves) {
      if (!selection || !single()) {
        editor.executeAction(action);
        return;
      }
      if (down ? selection.end === editor.getBufferLength(bufferId) : selection.start === 0) {
        editor.executeAction(documentAction);
        return;
      }
    }

    // Only non-endpoint selections need a boundary check. Queue following arrows
    // through the flush so key repeats observe the preceding native movement.
    const pending = (boundaryMoves ?? Promise.resolve()).then(async () => {
      if (editor.getActiveBufferId() !== bufferId || editor.activeWindow() !== windowId ||
        editor.getActiveSplitId() !== splitId) return;
      const before = editor.getPrimaryCursor();
      const range = before?.selection;
      if (!range || !single()) {
        editor.executeAction(action);
        await editor.flush();
        return;
      }
      const length = editor.getBufferLength(bufferId);
      const unchanged = () => {
        if (editor.getActiveBufferId() !== bufferId || editor.activeWindow() !== windowId ||
          editor.getActiveSplitId() !== splitId ||
          editor.getBufferLength(bufferId) !== length || !single()) return false;
        const current = editor.getPrimaryCursor();
        return current?.position === before.position &&
          current.selection?.start === range.start && current.selection?.end === range.end;
      };
      // The stock line-position/count APIs copy the entire document. Read only
      // bounded chunks toward the relevant edge, stopping at the first newline.
      let edge = down ? range.end : range.start;
      let boundary = true;
      while (down ? edge < length : edge > 0) {
        const start = down ? edge : Math.max(0, edge - 1024);
        const end = down ? Math.min(length, edge + 1024) : edge;
        const text = await editor.getBufferText(bufferId, start, end);
        if (!unchanged()) return;
        if (!text || text.includes("\n")) {
          boundary = false;
          break;
        }
        edge = down ? end : start;
      }
      editor.executeAction(boundary ? documentAction : action);
      await editor.flush();
    }).catch((error) => {
      // A buffer closed mid-read ends the move quietly.
      if (editor.getBufferInfo(bufferId)) editor.error(`Boundary selection movement: ${error}`);
    });
    boundaryMoves = pending;
    void pending.then(() => {
      if (boundaryMoves === pending) boundaryMoves = null;
    });
    return pending;
  }

  registerHandler("moveUpClearingBoundarySelection", () => moveClearingBoundarySelection(false));
  registerHandler("moveDownClearingBoundarySelection", () => moveClearingBoundarySelection(true));
  editor.registerCommand(
    "Move Up (clear boundary selection)",
    "Move up natively, clearing a single first-line selection to document start",
    "moveUpClearingBoundarySelection",
  );
  editor.registerCommand(
    "Move Down (clear boundary selection)",
    "Move down natively, clearing a single last-line selection to document end",
    "moveDownClearingBoundarySelection",
  );
}
