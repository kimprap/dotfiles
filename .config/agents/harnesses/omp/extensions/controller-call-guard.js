// Controller calls, bump-omp kill-scope launches, and the controller suite must
// run through `bash` with `timeout: 0` and no service fields: the 300 s default
// kills long calls, and `name` turns the call into a supervised service with
// the login PATH. Rewrite those calls' arguments before they run instead of
// blocking them, since a block costs a retry that can repeat the mistake.
//
// The handler does no I/O and never throws: a throwing or slow `tool_call`
// handler blocks the call.

const KILL_SCOPE_FOLDER = "/tmp/acp-killscope-";
const SEPARATORS = new Set([";", "&", "|", "\n", "(", ")"]);
const REDIRECTS = new Set(["<", ">"]);
const WRAPPERS = new Set(["exec", "env", "command", "time", "nohup"]);
const ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/;

const SHAPES = {
    controller: { label: "controller call", forbidden: ["name", "ready", "async", "pty"] },
    killScope: { label: "kill-scope launch", forbidden: ["name", "ready", "async", "pty"] },
    suite: { label: "controller suite", forbidden: ["name", "ready", "pty"] },
};

// Split a shell command into simple commands, each a list of argument words
// with quotes removed and redirection targets dropped.
function simpleCommands(command) {
    const commands = [];
    let words = [];
    let word = "";
    let inWord = false;
    let skipNext = false;
    let quote = "";

    const endWord = () => {
        if (inWord) {
            if (skipNext) skipNext = false;
            else words.push(word);
        }
        word = "";
        inWord = false;
    };
    const endCommand = () => {
        endWord();
        if (words.length > 0) commands.push(words);
        words = [];
        skipNext = false;
    };

    for (let index = 0; index < command.length; index += 1) {
        const char = command[index];
        if (quote) {
            if (char === quote) quote = "";
            else if (char === "\\" && quote === '"' && index + 1 < command.length) word += command[++index];
            else word += char;
        } else if (char === "'" || char === '"') {
            quote = char;
            inWord = true;
        } else if (char === "\\" && index + 1 < command.length) {
            const next = command[++index];
            if (next !== "\n") word += next;
            inWord = true;
        } else if (SEPARATORS.has(char)) {
            endCommand();
        } else if (REDIRECTS.has(char)) {
            if (/^\d+$/.test(word)) inWord = false;
            endWord();
            while (REDIRECTS.has(command[index + 1]) || command[index + 1] === "&") index += 1;
            skipNext = true;
        } else if (/\s/.test(char)) {
            endWord();
        } else {
            word += char;
            inWord = true;
        }
    }
    endCommand();
    return commands;
}

function basename(word) {
    return word.slice(word.lastIndexOf("/") + 1);
}

function programAndArgs(words) {
    let index = 0;
    while (index < words.length && (ASSIGNMENT.test(words[index]) || WRAPPERS.has(words[index]))) index += 1;
    return { program: basename(words[index] ?? ""), args: words.slice(index + 1) };
}

function classify(command, cwd) {
    for (const words of simpleCommands(command)) {
        const { program, args } = programAndArgs(words);
        if (program === "node") {
            const script = args.find((arg) => !arg.startsWith("-"));
            if (script?.endsWith("acp-controller/cli.mjs")) return SHAPES.controller;
        } else if (program === "omp") {
            if (args.some((arg) => arg === "-p" || arg === "--print") && command.includes(KILL_SCOPE_FOLDER)) {
                return SHAPES.killScope;
            }
        } else if (program === "npm") {
            const end = args.indexOf("--");
            const npmArgs = end === -1 ? args : args.slice(0, end);
            if (npmArgs.includes("test") && (command.includes("acp-controller") || cwd.includes("acp-controller"))) {
                return SHAPES.suite;
            }
        }
    }
    return undefined;
}

function guard(event) {
    if (event?.toolName !== "bash") return undefined;
    const input = event.input;
    if (!input || typeof input !== "object" || typeof input.command !== "string") return undefined;

    const shape = classify(input.command, typeof input.cwd === "string" ? input.cwd : "");
    if (!shape) return undefined;

    const removed = shape.forbidden.filter((field) => input[field] !== undefined);
    const fixTimeout = input.timeout !== 0;
    if (!fixTimeout && removed.length === 0) return undefined;

    const revised = { ...input, timeout: 0 };
    for (const field of removed) delete revised[field];

    const changes = [];
    if (fixTimeout) {
        const was = input.timeout === undefined ? "unset" : JSON.stringify(input.timeout);
        changes.push(`set timeout to 0 (was ${was})`);
    }
    if (removed.length > 0) changes.push(`removed ${removed.join(", ")}`);
    return {
        input: revised,
        additionalContext: `controller-call-guard rewrote this ${shape.label}: ${changes.join("; ")}.`,
    };
}

export default function controllerCallGuard(pi) {
    pi.setLabel("controller-call-guard");

    pi.on("tool_call", (event) => {
        try {
            return guard(event);
        } catch {
            return undefined;
        }
    });
}
