// Native Markdown compose toggle gates on path suffix (.md/.markdown), so an
// unnamed language=markdown buffer cannot use the built-in command. This local
// toggle applies the same view-mode/settings; native lines_changed still
// renders because it gates on compose, not path.
export function markdownPreview(editor: EditorAPI): void {
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
}
