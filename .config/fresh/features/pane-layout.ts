// Grow and shrink the active editor side on both axes; equalize every leaf pane.

function adjacent(a: number, b: number, span: number): boolean {
  return a === b + span || a === b + span + 1;
}

export function paneLayout(editor: EditorAPI): void {
  function activeIsFirstChild(): boolean | null {
    const workspace = editor.describeWorkspace();
    const active = workspace.panes.find((pane) => pane.active);
    if (!active) return null;
    const others = workspace.panes.filter((pane) => pane.splitId !== active.splitId);
    const sameHeight = others.filter(
      (pane) => pane.y === active.y && pane.height === active.height,
    );
    const sameWidth = others.filter(
      (pane) => pane.x === active.x && pane.width === active.width,
    );
    const right = sameHeight.find((pane) => adjacent(pane.x, active.x, active.width));
    const left = sameHeight.find((pane) => adjacent(active.x, pane.x, pane.width));
    const below = sameWidth.find((pane) => adjacent(pane.y, active.y, active.height));
    const above = sameWidth.find((pane) => adjacent(active.y, pane.y, pane.height));
    const vertical = (left ? 1 : 0) + (right ? 1 : 0);
    const horizontal = (above ? 1 : 0) + (below ? 1 : 0);
    if (vertical === 1 && horizontal === 0) return Boolean(right);
    if (horizontal === 1 && vertical === 0) return Boolean(below);
    if (vertical === 0 && horizontal === 0) return null;
    if (right) return true;
    if (left) return false;
    if (below) return true;
    if (above) return false;
    return null;
  }

  function resizeActiveEditorPane(grow: boolean): void {
    const first = activeIsFirstChild();
    if (first === null) {
      editor.executeAction(grow ? "increase_split_size" : "decrease_split_size");
      return;
    }
    editor.executeAction(
      grow === first ? "increase_split_size" : "decrease_split_size",
    );
  }

  registerHandler("growActiveEditorPane", () => resizeActiveEditorPane(true));
  registerHandler("shrinkActiveEditorPane", () => resizeActiveEditorPane(false));
  editor.registerCommand(
    "Grow Active Editor Pane",
    "Increase the size of the active editor pane",
    "growActiveEditorPane",
  );
  editor.registerCommand(
    "Shrink Active Editor Pane",
    "Decrease the size of the active editor pane",
    "shrinkActiveEditorPane",
  );

  registerHandler("equalizeAllPanes", () => {
    editor.distributeSplitsEvenly();
  });
  editor.registerCommand(
    "Equalize All Panes",
    "Give every leaf pane equal space across nested splits",
    "equalizeAllPanes",
  );
}
