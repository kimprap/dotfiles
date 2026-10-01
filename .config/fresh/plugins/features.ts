// Entry plugin for the profile's workaround features: one module per feature
// group in ../features/, each installed with this plugin's editor handle.
// Retiring a feature removes its module and its import and call here.
import { boundarySelection } from "../features/boundary-selection.ts";
import { explorerFocus } from "../features/explorer-focus.ts";
import { explorerIcons } from "../features/explorer-icons.ts";
import { lineEdits } from "../features/line-edits.ts";
import { markdownPreview } from "../features/markdown-preview.ts";
import { paneLayout } from "../features/pane-layout.ts";
import { reopenClosedTab } from "../features/reopen-closed-tab.ts";
import { searchHighlights } from "../features/search-highlights.ts";
import { tabMove } from "../features/tab-move.ts";
import { terminalFocus } from "../features/terminal-focus.ts";

const editor = getEditor();

explorerFocus(editor);
boundarySelection(editor);
explorerIcons(editor);
reopenClosedTab(editor);
terminalFocus(editor);
searchHighlights(editor);
markdownPreview(editor);
tabMove(editor);
paneLayout(editor);
lineEdits(editor);
