// Cmd+Ctrl+Shift+jj/kk/ll/ii: source-only move of the current editor tab.
// Native moveBufferToSplit strips every other pane's copy of the buffer.
type EditorTabDir = "left" | "right" | "up" | "down";

function rangeOverlap(a0: number, a1: number, b0: number, b1: number): number {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}

export function tabMove(editor: EditorAPI): void {
  function nearestEditorPane(
    active: PaneDescription,
    dir: EditorTabDir,
  ): PaneDescription | null {
    let best: PaneDescription | null = null;
    let bestScore = Infinity;
    for (const pane of editor.describeWorkspace().panes) {
      if (pane.kind === "terminal") continue;
      if (pane.splitId === active.splitId) continue;
      let along: number;
      let cross: number;
      if (dir === "left") {
        const edge = pane.x + pane.width;
        if (edge > active.x) continue;
        along = active.x - edge;
        cross = rangeOverlap(
          active.y,
          active.y + active.height,
          pane.y,
          pane.y + pane.height,
        );
      } else if (dir === "right") {
        if (pane.x < active.x + active.width) continue;
        along = pane.x - (active.x + active.width);
        cross = rangeOverlap(
          active.y,
          active.y + active.height,
          pane.y,
          pane.y + pane.height,
        );
      } else if (dir === "up") {
        const edge = pane.y + pane.height;
        if (edge > active.y) continue;
        along = active.y - edge;
        cross = rangeOverlap(
          active.x,
          active.x + active.width,
          pane.x,
          pane.x + pane.width,
        );
      } else {
        if (pane.y < active.y + active.height) continue;
        along = pane.y - (active.y + active.height);
        cross = rangeOverlap(
          active.x,
          active.x + active.width,
          pane.x,
          pane.x + pane.width,
        );
      }
      const activeMid =
        dir === "left" || dir === "right"
          ? active.y + active.height / 2
          : active.x + active.width / 2;
      const paneMid =
        dir === "left" || dir === "right"
          ? pane.y + pane.height / 2
          : pane.x + pane.width / 2;
      const score = (cross > 0 ? 0 : 1_000_000) + along * 1000 + Math.abs(paneMid - activeMid);
      if (score < bestScore) {
        bestScore = score;
        best = pane;
      }
    }
    return best;
  }

  function bufferInSplit(bufferId: number, splitId: number): boolean {
    const info = editor.listBuffers().find((buffer) => buffer.id === bufferId);
    return !!info && info.splits.includes(splitId);
  }

  async function establishBufferInSplit(
    bufferId: number,
    splitId: number,
  ): Promise<boolean> {
    // setSplitBuffer updates the leaf display but does not add a dest tab.
    // showBuffer -> set_active_buffer calls add_buffer, keeping dest's other tabs.
    editor.focusSplit(splitId);
    await editor.flush();
    editor.showBuffer(bufferId);
    await editor.flush();
    return bufferInSplit(bufferId, splitId);
  }

  async function moveEditorTab(dir: EditorTabDir): Promise<void> {
    const bufferId = editor.getActiveBufferId();
    if (!bufferId) return;
    const info = editor.listBuffers().find((buffer) => buffer.id === bufferId);
    if (!info || info.is_terminal) return;

    const source = editor.describeWorkspace().panes.find((pane) => pane.active);
    if (!source || source.kind === "terminal") return;

    const caret = editor.getPrimaryCursor()?.position ?? editor.getCursorPosition();
    const existing = nearestEditorPane(source, dir);

    if (!existing) {
      const created = await editor.splitWindow({
        direction: dir === "left" || dir === "right" ? "vertical" : "horizontal",
        place: dir === "left" || dir === "up" ? "before" : "after",
      });
      await editor.flush();
      if (!bufferInSplit(bufferId, created.splitId)) return;
      editor.focusSplit(source.splitId);
      await editor.flush();
      editor.executeAction("close_tab");
      await editor.flush();
      editor.focusSplit(created.splitId);
      editor.setBufferCursor(bufferId, caret);
      await editor.flush();
      return;
    }

    if (!(await establishBufferInSplit(bufferId, existing.splitId))) return;
    editor.focusSplit(source.splitId);
    await editor.flush();
    editor.executeAction("close_tab");
    await editor.flush();
    editor.focusSplit(existing.splitId);
    editor.setBufferCursor(bufferId, caret);
    await editor.flush();
  }

  registerHandler("moveEditorTabLeft", () => moveEditorTab("left"));
  registerHandler("moveEditorTabDown", () => moveEditorTab("down"));
  registerHandler("moveEditorTabRight", () => moveEditorTab("right"));
  registerHandler("moveEditorTabUp", () => moveEditorTab("up"));
  editor.registerCommand(
    "Move Editor Tab Left",
    "Move the current editor tab to the nearest pane on the left, creating one if needed",
    "moveEditorTabLeft",
  );
  editor.registerCommand(
    "Move Editor Tab Down",
    "Move the current editor tab to the nearest pane below, creating one if needed",
    "moveEditorTabDown",
  );
  editor.registerCommand(
    "Move Editor Tab Right",
    "Move the current editor tab to the nearest pane on the right, creating one if needed",
    "moveEditorTabRight",
  );
  editor.registerCommand(
    "Move Editor Tab Up",
    "Move the current editor tab to the nearest pane above, creating one if needed",
    "moveEditorTabUp",
  );
}
