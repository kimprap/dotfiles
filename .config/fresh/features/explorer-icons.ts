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

export function explorerIcons(editor: EditorAPI): void {
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
  // native explorer is refreshed. A recursive watch holds one descriptor per
  // entry and exhausts the fd limit in large trees, so watch only the root's
  // direct children; deeper entries refresh on the explorer and save events.
  let fileIconWatch: number | null = null;
  let fileIconRefreshTimer: number | null = null;
  registerHandler("refreshExternalFileIcons", () => {
    fileIconRefreshTimer = null;
    refreshFileIcons();
  });
  registerHandler(
    "externalFileIconsChanged",
    (event: { handle: number; kind: string }) => {
      if (event.handle !== fileIconWatch || event.kind === "modify") return;
      // Coalesce filesystem bursts without polling or a timer per path.
      if (fileIconRefreshTimer === null) {
        fileIconRefreshTimer = editor.setTimeout(100, "refreshExternalFileIcons");
      }
    },
  );
  editor.on("path_changed", "externalFileIconsChanged");
  void editor.watchPath(editor.getCwd(), false).then(
    (handle) => { fileIconWatch = handle; },
    (error) => { editor.error(`File icon watcher: ${error}`); },
  );
}
