// Search stepping, cleared search, select-all-occurrences and the fixed
// interaction colors share one paint state.
const SEARCH_CURRENT_NS = "search-current-match";
const SEARCH_YELLOW_BG: [number, number, number] = [250, 253, 84];
const SEARCH_YELLOW_FG: [number, number, number] = [37, 37, 37];
const SELECTION_BLUE: [number, number, number] = [48, 78, 117];
const MULTI_CURSOR_GREY: [number, number, number] = [101, 101, 101];

export function searchHighlights(editor: EditorAPI): void {
  // Fixed interaction and tab colors sit above any selected base theme. Editor
  // backgrounds and syntax remain theme-owned; search overlays use the constants above.
  const CUSTOM_HIGHLIGHTS: Record<string, [number, number, number]> = {
    "editor.indentation_guide_fg": [218, 220, 64],
    "editor.selection_bg": SELECTION_BLUE,
    "ui.semantic_highlight_bg": [73, 73, 73],
    "ui.tab_active_bg": [91, 91, 91],
    "ui.tab_inactive_bg": [50, 55, 65],
    "ui.status_warning_indicator_bg": [63, 120, 167],
    "ui.status_warning_indicator_fg": [255, 255, 255],
    "ui.status_warning_indicator_hover_bg": [63, 120, 167],
    "ui.status_warning_indicator_hover_fg": [255, 255, 255],
    "search.match_bg": MULTI_CURSOR_GREY,
    "search.match_fg": [220, 220, 220],
  };
  let customHighlightsDirty = true;

  let paintedSearchBuffer: number | null = null;
  let paintedSearchPosition: number | null = null;
  let searchCommands = Promise.resolve();
  let pendingSearchCommands = 0;
  let searchWasActive = false;
  let multiCursorGreyOn = false;

  function syncCustomHighlights(): void {
    const multi = editor.hasActiveSearch()
      ? multiCursorGreyOn
      : Math.max(editor.getAllCursors().length, editor.getAllCursorPositions().length) > 1;
    if (!customHighlightsDirty && multi === multiCursorGreyOn) return;
    multiCursorGreyOn = multi;
    CUSTOM_HIGHLIGHTS["editor.selection_bg"] = multi ? MULTI_CURSOR_GREY : SELECTION_BLUE;
    if (editor.overrideThemeColors(CUSTOM_HIGHLIGHTS)) customHighlightsDirty = false;
  }

  registerHandler("refreshCustomHighlights", () => {
    // Config reload can reapply the same named theme, clearing runtime overrides.
    customHighlightsDirty = true;
    syncCustomHighlights();
  });
  editor.on("config_changed", "refreshCustomHighlights");
  syncCustomHighlights();

  // Applying the same theme still replaces its colors, but need not emit
  // config_changed. Invalidate on directory events because atomic config saves
  // can report only the temporary source path of the rename. Events coalesce
  // into one palette update at the next render; idle renders do not repaint it.
  let highlightConfigWatch: number | null = null;
  const highlightConfigDir = editor.getConfigDir();
  registerHandler(
    "onHighlightConfigWrite",
    (event: { handle: number }) => {
      if (event.handle === highlightConfigWatch) {
        customHighlightsDirty = true;
      }
    },
  );
  editor.on("path_changed", "onHighlightConfigWrite");
  void editor.watchPath(highlightConfigDir, false).then(
    (handle) => { highlightConfigWatch = handle; },
    (error) => { editor.error(`Highlight config watcher: ${error}`); },
  );

  function clearSearchPaint(): void {
    if (paintedSearchBuffer === null) return;
    editor.clearNamespace(paintedSearchBuffer, SEARCH_CURRENT_NS);
    paintedSearchBuffer = null;
    paintedSearchPosition = null;
  }

  // Fresh exposes a native search range through Add Cursor at Next Match:
  // its first invocation selects that exact match, not the surrounding word.
  // Read the selection after flushing, then restore the native search caret.
  async function runSearchAction(action: string | null, bufferId: number, windowId: number): Promise<void> {
    if (editor.getActiveBufferId() !== bufferId || editor.activeWindow() !== windowId) return;
    clearSearchPaint();
    if (action !== null) editor.executeAction(action);
    await editor.flush();
    if (!editor.hasActiveSearch() || editor.getActiveBufferId() !== bufferId || editor.activeWindow() !== windowId) return;

    const cursor = editor.getPrimaryCursor();
    if (!cursor || cursor.selection) return;

    editor.executeAction("add_cursor_next_match");
    await editor.flush();
    if (editor.getActiveBufferId() !== bufferId || editor.activeWindow() !== windowId) {
      editor.setBufferCursor(bufferId, cursor.position);
      return;
    }
    const selected = editor.getPrimaryCursor();
    const range = selected?.selection;
    if (!range || selected.position !== range.end) return;

    editor.setBufferCursor(bufferId, cursor.position);
    if (!editor.hasActiveSearch()) return;
    editor.addOverlay(bufferId, SEARCH_CURRENT_NS, range.start, range.end, {
      bg: SEARCH_YELLOW_BG,
      fg: SEARCH_YELLOW_FG,
    });
    paintedSearchBuffer = bufferId;
    paintedSearchPosition = cursor.position;
    await editor.flush();
  }

  function queueSearchAction(action: string | null): Promise<void> {
    // Serialize rapid navigation so one command cannot read another's selection.
    const bufferId = editor.getActiveBufferId();
    const windowId = editor.activeWindow();
    pendingSearchCommands++;
    searchCommands = searchCommands
      .then(() => runSearchAction(action, bufferId, windowId))
      .catch((error) => {
        clearSearchPaint();
        editor.error(`Current search highlight: ${error}`);
      })
      .finally(() => {
        pendingSearchCommands--;
      });
    return searchCommands;
  }

  registerHandler("stepSearchNext", () => queueSearchAction("find_next"));
  registerHandler("stepSearchPrev", () => queueSearchAction("find_previous"));
  editor.registerCommand("Find Next", "Find next match and mark it yellow", "stepSearchNext");
  editor.registerCommand("Find Previous", "Find previous match and mark it yellow", "stepSearchPrev");

  registerHandler("onSearchRenderStart", () => {
    const active = editor.hasActiveSearch();
    if (!active || editor.getActiveBufferId() !== paintedSearchBuffer ||
      (pendingSearchCommands === 0 && editor.getPrimaryCursor()?.position !== paintedSearchPosition)) {
      clearSearchPaint();
    }
    syncCustomHighlights();
    // Built-in confirmation bypasses prompt hooks and searchPrompt Enter bindings.
    // Observe its state transition, but never mutate overlays on every frame.
    if (active && !searchWasActive && pendingSearchCommands === 0) {
      queueSearchAction(null);
    }
    searchWasActive = active;
  });
  registerHandler("onSearchCursorMoved", syncCustomHighlights);
  editor.on("render_start", "onSearchRenderStart");
  editor.on("cursor_moved", "onSearchCursorMoved");

  // Cmd+Shift+D: one native add_cursor_next_match per remaining exact match.
  // Occupied matches are skipped natively, so a repeat adds no duplicates.
  registerHandler("selectAllOccurrences", async () => {
    let cursor = editor.getPrimaryCursor();
    if (!cursor?.selection) {
      editor.executeAction("add_cursor_next_match");
      await editor.flush();
      cursor = editor.getPrimaryCursor();
      if (!cursor?.selection) return;
    }
    const bufferId = editor.getActiveBufferId();
    const range = cursor.selection;
    let needle: string;
    let text: string;
    try {
      needle = await editor.getBufferText(bufferId, range.start, range.end);
      if (!needle) return;
      text = await editor.getBufferText(bufferId);
    } catch (error) {
      if (editor.getBufferInfo(bufferId)) throw error;
      return; // the buffer closed mid-read
    }
    let total = 0;
    for (let i = 0; i < text.length;) {
      const found = text.indexOf(needle, i);
      if (found < 0) break;
      total++;
      i = found + needle.length;
    }
    const have = editor.getAllCursors().filter((c) => c.selection).length;
    const remaining = total - have;
    if (remaining > 0) {
      editor.executeActions([{ action: "add_cursor_next_match", count: remaining }]);
      await editor.flush();
    }
    syncCustomHighlights();
  });
  editor.registerCommand(
    "Select All Occurrences",
    "Add a cursor at every exact occurrence of the current selection",
    "selectAllOccurrences",
  );

  // Cmd+F: keep native search, but after an empty confirm (no active search and
  // no selected text) do not prefill the last nonempty history entry.
  registerHandler("startSearchRespectingClear", async () => {
    const selection = editor.getPrimaryCursor()?.selection;
    if (editor.hasActiveSearch() || (selection && selection.end > selection.start)) {
      editor.executeAction("search");
      return;
    }
    // One batch, so a query typed right after Cmd+F lands after the clearing.
    editor.executeActions([
      { action: "search" },
      { action: "prompt_select_all" },
      { action: "prompt_backspace" },
      { action: "clear_search" },
    ]);
    await editor.flush();
  });
  editor.registerCommand(
    "Search Respecting Cleared Query",
    "Open native search; keep the box empty after an empty confirm",
    "startSearchRespectingClear",
  );
}
