// Fresh next_split/prev_split change the active split chrome but leave
// KeyContext::FileExplorer in place, so the caret never enters the pane.
// File-explorer Cmd+Shift+HJKL bindings replay these registers.
export function explorerFocus(editor: EditorAPI): void {
  // n: cycle next split, then take editor focus
  editor.defineMacro("n", [
    { action: "next_split" },
    { action: "focus_editor" },
  ]);
  // p: cycle previous split, then take editor focus
  editor.defineMacro("p", [
    { action: "prev_split" },
    { action: "focus_editor" },
  ]);
}
