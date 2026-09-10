const editor = getEditor();

// Fresh next_split/prev_split change the active split chrome but leave
// KeyContext::FileExplorer in place, so the caret never enters the pane.
// These registers are replayed from file-explorer Cmd+Shift+HJKL bindings.
// fresh:macro n — cycle next split, then take editor focus
editor.defineMacro("n", [
  { action: "next_split" },
  { action: "focus_editor" },
]);
// fresh:end macro n

// fresh:macro p — cycle previous split, then take editor focus
editor.defineMacro("p", [
  { action: "prev_split" },
  { action: "focus_editor" },
]);
// fresh:end macro p

// Fresh 0.5.1 emits no plain-arrow movement at the selection's boundary line,
// leaving its anchor intact. Keep native movement everywhere else.
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
    editor.error(`Boundary selection movement: ${error}`);
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

// Per-file explorer icons. Fresh has no built-in filetype glyphs; plugins
// set them via leading slots. Folders keep the tree_indicator glyphs.
type FileIcon = { text: string; color: [number, number, number] };

const FILE_ICON_NS = "file-icons";
const FILE_ICON_MAX = 8000;
const FILE_ICON_DEPTH = 12;
const FILE_ICON_DEFAULT: FileIcon = { text: "\uf15b", color: [109, 128, 134] };
const FILE_ICON_SKIP: Record<string, true> = {
  ".git": true,
  node_modules: true,
  target: true,
  dist: true,
  build: true,
  ".build": true,
  vendor: true,
  __pycache__: true,
  ".venv": true,
  venv: true,
  ".direnv": true,
  ".cache": true,
  ".next": true,
  coverage: true,
  ".turbo": true,
  ".pnpm-store": true,
};

const FILE_ICONS_BY_NAME: Record<string, FileIcon> = {
  ".gitignore": { text: "\ue702", color: [243, 79, 41] },
  ".gitmodules": { text: "\ue702", color: [243, 79, 41] },
  ".gitattributes": { text: "\ue702", color: [243, 79, 41] },
  dockerfile: { text: "\ue7b0", color: [69, 147, 202] },
  makefile: { text: "\ue673", color: [106, 128, 134] },
  "package.json": { text: "\ue718", color: [139, 195, 74] },
  "package-lock.json": { text: "\ue718", color: [139, 195, 74] },
  "tsconfig.json": { text: "\ue628", color: [81, 154, 186] },
  "cargo.toml": { text: "\ue68b", color: [222, 165, 132] },
  "cargo.lock": { text: "\ue68b", color: [222, 165, 132] },
  gemfile: { text: "\ue739", color: [112, 21, 22] },
  license: { text: "\uf718", color: [210, 190, 80] },
  "license.md": { text: "\uf718", color: [210, 190, 80] },
};

const FILE_ICONS_BY_EXT: Record<string, FileIcon> = {
  lua: { text: "\ue620", color: [81, 160, 207] },
  ts: { text: "\ue628", color: [81, 154, 186] },
  tsx: { text: "\ue7ba", color: [81, 154, 186] },
  js: { text: "\ue74e", color: [203, 203, 65] },
  jsx: { text: "\ue7ba", color: [32, 201, 212] },
  mjs: { text: "\ue74e", color: [203, 203, 65] },
  cjs: { text: "\ue74e", color: [203, 203, 65] },
  json: { text: "\ue60b", color: [203, 203, 65] },
  jsonc: { text: "\ue60b", color: [203, 203, 65] },
  md: { text: "\ue609", color: [81, 154, 186] },
  markdown: { text: "\ue609", color: [81, 154, 186] },
  py: { text: "\ue606", color: [255, 188, 3] },
  rs: { text: "\ue68b", color: [222, 165, 132] },
  toml: { text: "\ue6b2", color: [156, 66, 33] },
  yaml: { text: "\ue615", color: [109, 128, 134] },
  yml: { text: "\ue615", color: [109, 128, 134] },
  xml: { text: "\ue619", color: [228, 79, 79] },
  html: { text: "\ue736", color: [228, 79, 57] },
  htm: { text: "\ue736", color: [228, 79, 57] },
  css: { text: "\ue749", color: [86, 61, 245] },
  scss: { text: "\ue749", color: [201, 97, 150] },
  go: { text: "\ue627", color: [0, 173, 216] },
  sh: { text: "\ue795", color: [137, 224, 81] },
  bash: { text: "\ue795", color: [137, 224, 81] },
  zsh: { text: "\ue795", color: [137, 224, 81] },
  fish: { text: "\ue795", color: [74, 163, 116] },
  vim: { text: "\ue62b", color: [1, 152, 51] },
  svg: { text: "\uf1c5", color: [255, 181, 67] },
  png: { text: "\uf1c5", color: [165, 184, 73] },
  jpg: { text: "\uf1c5", color: [165, 184, 73] },
  jpeg: { text: "\uf1c5", color: [165, 184, 73] },
  gif: { text: "\uf1c5", color: [165, 184, 73] },
  webp: { text: "\uf1c5", color: [165, 184, 73] },
  lock: { text: "\uf023", color: [187, 187, 187] },
  txt: { text: "\uf15c", color: [137, 151, 155] },
  log: { text: "\uf15c", color: [137, 151, 155] },
  conf: { text: "\ue615", color: [109, 128, 134] },
  ini: { text: "\ue615", color: [109, 128, 134] },
  cfg: { text: "\ue615", color: [109, 128, 134] },
  env: { text: "\uf462", color: [250, 222, 80] },
  sql: { text: "\ue706", color: [218, 165, 32] },
  rb: { text: "\ue739", color: [112, 21, 22] },
  php: { text: "\ue608", color: [162, 119, 182] },
  c: { text: "\ue61e", color: [89, 151, 214] },
  h: { text: "\ue61e", color: [89, 151, 214] },
  cpp: { text: "\ue61d", color: [243, 75, 125] },
  cc: { text: "\ue61d", color: [243, 75, 125] },
  hpp: { text: "\ue61d", color: [243, 75, 125] },
  swift: { text: "\ue755", color: [250, 139, 31] },
  kt: { text: "\ue634", color: [122, 102, 225] },
  java: { text: "\ue738", color: [204, 62, 68] },
  zig: { text: "\ue6a9", color: [247, 164, 29] },
  nix: { text: "\uf313", color: [126, 186, 200] },
  vue: { text: "\ue6a1", color: [139, 195, 74] },
  svelte: { text: "\ue697", color: [255, 62, 0] },
  csv: { text: "\uf1c0", color: [137, 224, 81] },
  wasm: { text: "\ue6a1", color: [101, 77, 223] },
};

function iconForFile(name: string): FileIcon {
  const lower = name.toLowerCase();
  const byName = FILE_ICONS_BY_NAME[lower];
  if (byName) return byName;
  const dot = lower.lastIndexOf(".");
  if (dot <= 0 || dot === lower.length - 1) return FILE_ICON_DEFAULT;
  return FILE_ICONS_BY_EXT[lower.slice(dot + 1)] ?? FILE_ICON_DEFAULT;
}

function collectFileIconSlots(
  dir: string,
  depth: number,
  slots: Record<string, unknown>[],
): void {
  if (depth > FILE_ICON_DEPTH || slots.length >= FILE_ICON_MAX) return;
  let entries: DirEntry[];
  try {
    entries = editor.readDir(dir);
  } catch {
    return;
  }
  if (!Array.isArray(entries)) return;
  for (let i = 0; i < entries.length; i++) {
    if (slots.length >= FILE_ICON_MAX) return;
    const entry = entries[i];
    const path = editor.pathJoin(dir, entry.name);
    if (entry.is_dir) {
      if (!FILE_ICON_SKIP[entry.name]) {
        collectFileIconSlots(path, depth + 1, slots);
      }
      continue;
    }
    if (!entry.is_file) continue;
    const icon = iconForFile(entry.name);
    slots.push({
      path,
      leading: { text: icon.text, color: icon.color, minWidth: 2 },
      priority: 10,
    });
  }
}

let fileIconsInFlight = false;
let fileIconsPending = false;

function refreshFileIcons(): void {
  if (fileIconsInFlight) {
    fileIconsPending = true;
    return;
  }
  fileIconsInFlight = true;
  try {
    const slots: Record<string, unknown>[] = [];
    collectFileIconSlots(editor.getCwd(), 0, slots);
    if (slots.length === 0) {
      editor.clearFileExplorerSlots(FILE_ICON_NS);
    } else {
      editor.setFileExplorerSlots(FILE_ICON_NS, slots);
    }
  } finally {
    fileIconsInFlight = false;
    if (fileIconsPending) {
      fileIconsPending = false;
      refreshFileIcons();
    }
  }
}

registerHandler("refreshFileIcons", refreshFileIcons);
editor.on("editor_initialized", "refreshFileIcons");
editor.on("after_file_explorer_change", "refreshFileIcons");
editor.on("after_file_save", "refreshFileIcons");
refreshFileIcons();

// External creates do not emit after_file_explorer_change, even when the
// native explorer is refreshed. Keep slots ready when those files appear.
let fileIconWatch: number | null = null;
let fileIconRefreshTimer: number | null = null;
const fileIconRoot = editor.getCwd();
registerHandler("refreshExternalFileIcons", () => {
  fileIconRefreshTimer = null;
  refreshFileIcons();
});
registerHandler(
  "externalFileIconsChanged",
  (event: { handle: number; path: string; kind: string }) => {
    if (event.handle !== fileIconWatch || event.kind === "modify") return;
    if (!event.path.startsWith(fileIconRoot + "/")) return;
    const parts = event.path.slice(fileIconRoot.length + 1).split("/");
    if (
      parts.length > FILE_ICON_DEPTH + 1 ||
      parts.slice(0, -1).some((part) => FILE_ICON_SKIP[part])
    ) return;
    // Coalesce filesystem bursts without polling or a timer per path.
    if (fileIconRefreshTimer === null) {
      fileIconRefreshTimer = editor.setTimeout(100, "refreshExternalFileIcons");
    }
  },
);
editor.on("path_changed", "externalFileIconsChanged");
void editor.watchPath(fileIconRoot, true).then(
  (handle) => { fileIconWatch = handle; },
  (error) => { editor.error(`File icon watcher: ${error}`); },
);

// Reopen Closed Tab (Cmd+Shift+T). Fresh has no closed-tab stack;
// remember file-backed buffers and reopen the last closed path.
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

// Cmd+J: focus an existing integrated terminal. Native focus_terminal only
// enters PTY mode when a terminal buffer is already active.
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

// Fresh exposes a native search range through Add Cursor at Next Match:
// its first invocation selects that exact match, not the surrounding word.
// Read the selection after flushing, then restore the native search caret.
const SEARCH_CURRENT_NS = "search-current-match";
const SEARCH_YELLOW_BG: [number, number, number] = [250, 253, 84];
const SEARCH_YELLOW_FG: [number, number, number] = [37, 37, 37];
const SELECTION_BLUE: [number, number, number] = [48, 78, 117];
const MULTI_CURSOR_GREY: [number, number, number] = [101, 101, 101];

let paintedSearchBuffer: number | null = null;
let paintedSearchPosition: number | null = null;
let searchCommands = Promise.resolve();
let pendingSearchCommands = 0;
let searchWasActive = false;
let multiCursorGreyOn = false;

function syncMultiCursorSelection(): void {
  if (editor.hasActiveSearch()) return;
  const multi = Math.max(editor.getAllCursors().length, editor.getAllCursorPositions().length) > 1;
  if (multi === multiCursorGreyOn) return;
  multiCursorGreyOn = multi;
  editor.overrideThemeColors({
    "editor.selection_bg": multi ? MULTI_CURSOR_GREY : SELECTION_BLUE,
  });
}

function clearSearchPaint(): void {
  if (paintedSearchBuffer === null) return;
  editor.clearNamespace(paintedSearchBuffer, SEARCH_CURRENT_NS);
  paintedSearchBuffer = null;
  paintedSearchPosition = null;
}

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
  syncMultiCursorSelection();
  // Built-in confirmation bypasses prompt hooks and searchPrompt Enter bindings.
  // Observe its state transition, but never mutate overlays on every frame.
  if (active && !searchWasActive && pendingSearchCommands === 0) {
    queueSearchAction(null);
  }
  searchWasActive = active;
});
registerHandler("onSearchCursorMoved", syncMultiCursorSelection);
editor.on("render_start", "onSearchRenderStart");
editor.on("cursor_moved", "onSearchCursorMoved");

// Native Markdown compose toggle gates on path suffix (.md/.markdown), so an
// unnamed language=markdown buffer cannot use the built-in command. This local
// toggle applies the same view-mode/settings; native lines_changed still
// renders because it gates on compose, not path.

function unsavedMarkdownComposeWidth(): number | undefined {
  const cfg = editor.getConfig() as {
    editor?: { page_width?: number | null };
    languages?: Record<string, { page_width?: number | null } | undefined>;
  } | null;
  const lang = cfg?.languages?.markdown?.page_width;
  if (typeof lang === "number" && lang > 0) return lang;
  const global = cfg?.editor?.page_width;
  if (typeof global === "number") return global > 0 ? global : undefined;
  if (global === null) return undefined;
  return 80;
}

function enableUnsavedMarkdownPreview(bufferId: number): void {
  editor.setViewMode(bufferId, "compose");
  editor.setLineNumbersDefault(bufferId, false);
  editor.setFoldIndicators(bufferId, false);
  editor.setLineWrap(bufferId, null, true);
  editor.setLayoutHints(bufferId, null, { composeWidth: unsavedMarkdownComposeWidth() });
  editor.refreshLines(bufferId);
}

function disableUnsavedMarkdownPreview(bufferId: number): void {
  editor.clearVirtualTextNamespace(bufferId, "md-tb");
  editor.clearVirtualTextNamespace(bufferId, "md-ls");
  editor.removeVirtualTextsByPrefix(bufferId, "mdcr:");
  const memos = (editor.queryMarkers(bufferId, 0, 0x7fffffff) as Array<{ id: string }>) || [];
  for (const m of memos) {
    if (m.id.startsWith("tw")) editor.deleteMarker(bufferId, m.id);
  }
  editor.setViewMode(bufferId, "source");
  editor.setLineNumbersDefault(bufferId, null);
  editor.setFoldIndicators(bufferId, null);
  const wrap = (editor.getConfig() as { editor?: { line_wrap?: boolean } } | null)?.editor?.line_wrap;
  editor.setLineWrap(bufferId, null, wrap === true);
  editor.setLayoutHints(bufferId, null, {});
  editor.clearNamespace(bufferId, "md-emphasis");
  editor.clearConcealNamespace(bufferId, "md-syntax");
  editor.clearSoftBreakNamespace(bufferId, "md-wrap");
  editor.clearScrollbarMarkers(bufferId, "md-headings");
  editor.refreshLines(bufferId);
}

registerHandler("toggleUnsavedMarkdownPreview", async () => {
  const bufferId = editor.getActiveBufferId();
  const info = editor.getBufferInfo(bufferId);
  if (!info) return;
  if (info.language !== "markdown" || info.path) {
    editor.setStatus(
      info.language !== "markdown"
        ? "Unsaved Markdown preview: set language to markdown first"
        : "Use Markdown: Toggle Compose/Preview for named files",
    );
    return;
  }
  if (info.view_mode === "compose") {
    disableUnsavedMarkdownPreview(bufferId);
    editor.setStatus("Unsaved Markdown preview off");
  } else {
    enableUnsavedMarkdownPreview(bufferId);
    editor.setStatus("Unsaved Markdown preview on");
  }
  await editor.flush();
});
editor.registerCommand(
  "Toggle Unsaved Markdown Preview",
  "Preview an unnamed markdown buffer without saving",
  "toggleUnsavedMarkdownPreview",
);

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
  const needle = await editor.getBufferText(bufferId, range.start, range.end);
  if (!needle) return;
  const text = await editor.getBufferText(bufferId);
  let total = 0;
  for (let i = 0; i < text.length; ) {
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
  syncMultiCursorSelection();
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
  editor.executeAction("search");
  await editor.flush();
  editor.executeActions([
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

// Cmd+Ctrl+Shift+jj/kk/ll/ii: source-only move of the current editor tab.
// Native moveBufferToSplit strips every other pane's copy of the buffer.
type EditorTabDir = "left" | "right" | "up" | "down";

function rangeOverlap(a0: number, a1: number, b0: number, b1: number): number {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}

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

function adjacent(a: number, b: number, span: number): boolean {
  return a === b + span || a === b + span + 1;
}

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

function lineEndingOf(text: string): string {
  return text.includes("\r\n") ? "\r\n" : "\n";
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
    for (;;) {
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
  for (;;) {
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

registerHandler("toggleCommentPreserveCursor", () =>
  toggleCommentPreserveCursor(),
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
  for (;;) {
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
  const nl = lineEndingOf(text);
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

registerHandler("duplicateLinesBelow", () => duplicateLines("below"));
registerHandler("duplicateLinesAbove", () => duplicateLines("above"));
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

