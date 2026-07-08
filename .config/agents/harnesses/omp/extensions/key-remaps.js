// OMP currently handles Debug Tools before editor keybindings with a hardcoded
// Ctrl+Shift+D chord. Remap at the terminal-input layer so Ctrl+Shift+D stays
// bound to forward word-delete in the editor and Ctrl+Shift+G opens Debug Tools.

import { matchesKey } from "@oh-my-pi/pi-tui";

const ALT_D = "\u001bd";
const DEBUG_CTRL_SHIFT_D = "\u001b[100;6u";

export default function keyRemaps(pi) {
    pi.setLabel("key-remaps");

    let detach;

    function clear() {
        detach?.();
        detach = undefined;
    }

    function install(ctx) {
        if (!ctx?.hasUI || typeof ctx?.ui?.onTerminalInput !== "function") {
            return;
        }
        clear();
        detach = ctx.ui.onTerminalInput((data) => {
            if (matchesKey(data, "ctrl+shift+g")) {
                return { data: DEBUG_CTRL_SHIFT_D };
            }

            if (matchesKey(data, "ctrl+shift+d")) {
                return { data: ALT_D };
            }

            return undefined;
        });
    }

    pi.on("session_start", (_event, ctx) => {
        install(ctx);
    });
    pi.on("session_switch", (_event, ctx) => {
        install(ctx);
    });
    pi.on("session_branch", (_event, ctx) => {
        install(ctx);
    });
    pi.on("session_shutdown", () => {
        clear();
    });
}
