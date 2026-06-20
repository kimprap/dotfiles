// OMP currently handles Debug Tools before editor keybindings with a hardcoded
// Ctrl+Shift+D chord. Remap at the terminal-input layer so Ctrl+Shift+D can be
// used by the editor and Ctrl+Alt+D opens Debug Tools instead.

const CTRL_SHIFT_D = new Set([
    "\u001b[100;6u", // CSI-u: d + Ctrl+Shift
    "\u001b[68;5u", // CSI-u variant: D + Ctrl
]);

const CTRL_ALT_D = new Set([
    "\u001b[100;7u", // CSI-u: d + Ctrl+Alt
    "\u001b[68;7u", // CSI-u variant: D + Ctrl+Alt
]);

export default function keyRemaps(pi) {
    pi.setLabel("key-remaps");

    pi.on("session_start", (_event, ctx) => {
        ctx.ui.onTerminalInput((data) => {
            if (CTRL_ALT_D.has(data)) {
                return { data: "\u001b[100;6u" };
            }

            if (CTRL_SHIFT_D.has(data)) {
                return { data: "\u001bd" };
            }
        });
    });
}
