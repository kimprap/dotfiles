// Cmd+J: focus an existing integrated terminal. Native focus_terminal only
// enters PTY mode when a terminal buffer is already active.
export function terminalFocus(editor: EditorAPI): void {
  registerHandler("focusIntegratedTerminal", async () => {
    const terminals = editor.listBuffers().filter((b) => b.is_terminal);
    if (terminals.length === 0) return;

    const termPanes = editor
      .describeWorkspace()
      .panes.filter((p) => p.kind === "terminal")
      .sort((a, b) => b.y - a.y);
    if (termPanes.length > 0) {
      editor.focusSplit(termPanes[0].splitId);
      await editor.flush();
      editor.executeAction("focus_terminal");
      return;
    }

    const visible = terminals.find((b) => b.splits.length > 0);
    if (!visible) return;
    const splitId = visible.splits[0];
    editor.setSplitBuffer(splitId, visible.id);
    editor.focusSplit(splitId);
    await editor.flush();
    editor.executeAction("focus_terminal");
  });
  editor.registerCommand(
    "Focus Integrated Terminal",
    "Focus an existing terminal pane if one is open",
    "focusIntegratedTerminal",
  );
}
