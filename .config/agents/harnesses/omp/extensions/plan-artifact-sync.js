// OMP extension: plan-artifact-sync
//
// A session-local local://<slug>-plan.md artifact is an adapter-owned draft.
// After every successful write or edit, this extension asks the repository
// helper to copy that exact draft into the active repository plan or archive
// valid terminal bytes.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { resolveLocalUrlToPath } from "@oh-my-pi/pi-coding-agent/internal-urls";

const SLUG_SOURCE = "[a-z0-9]+(?:-[a-z0-9]+)*";
const SLUG_RE = new RegExp(`^${SLUG_SOURCE}$`);
const LOCAL_PLAN_URL_RE = new RegExp(`^local:\/\/(?<slug>${SLUG_SOURCE})-plan\\.md$`);
const PLAN_FILENAME_RE = new RegExp(`^(?<slug>${SLUG_SOURCE})-plan\\.md$`);
const PLAN_ID_RE = new RegExp(`^\\d{4}-\\d{2}-\\d{2}-\\d{4}_(?<slug>${SLUG_SOURCE})$`);
const HASHLINE_PATH_RE = /^\[(?<path>[^\]\r\n]+)#[0-9A-F]{4}\]\r?$/gm;
const MUTATION_TOOLS = new Set(["write", "edit"]);
const WARNING_PREFIX = "plan-artifact-sync: ";
const HELPER_PROTOCOL = "plan-artifact-copy/v1";
const WARNING_RESULT_SCHEMA = "plan-artifact-sync-result/v1";

const DISCOVERY_CODES = new Set([
    "PLAN_SYNC_DISCOVERY_MISSING",
    "PLAN_SYNC_DISCOVERY_UNREADABLE",
    "PLAN_SYNC_DISCOVERY_UNSAFE",
    "PLAN_SYNC_UNAVAILABLE",
]);
const HELPER_CODES = new Set([
    "PLAN_ARTIFACT_INVALID",
    "PLAN_IDENTITY_MISMATCH",
    "PLAN_IDENTITY_CONFLICT",
    "PLAN_ARCHIVE_CONFLICT",
    "PLAN_FILE_KIND_UNSAFE",
    "PLAN_SOURCE_STALE",
    "PLAN_TARGET_STALE",
    "PLAN_POSTCONDITION_FAILED",
    "PLAN_SYNC_PROTOCOL_MISMATCH",
]);
const EXTENSION_SYNC_CODES = new Set([
    "PLAN_SYNC_HELPER_UNAVAILABLE",
    "PLAN_SYNC_HELPER_FAILED",
    "PLAN_SYNC_ACK_INVALID",
]);
const DISCOVERY_SCOPES = new Set(["active", "archive", "local root", "identity"]);
const SYNC_SCOPES = new Set(["active", "archive", "identity"]);
const EFFECTS = new Set(["none", "possible-complete"]);

function canonicalSlug(value) {
    return typeof value === "string" && SLUG_RE.test(value) ? value : undefined;
}

// This is the only adapter into the warning sink. Invalid internal input closes
// to the generic discovery record rather than widening the warning vocabulary.
function warningRecord(kind, scope, code, identity = undefined, effect = undefined) {
    const slug = canonicalSlug(identity);
    if (kind === "discovery" && DISCOVERY_SCOPES.has(scope) && DISCOVERY_CODES.has(code)) {
        return Object.freeze({ kind, scope, code, identity: slug ?? null });
    }
    if (
        kind === "sync" &&
        SYNC_SCOPES.has(scope) &&
        (HELPER_CODES.has(code) || EXTENSION_SYNC_CODES.has(code)) &&
        slug &&
        EFFECTS.has(effect)
    ) {
        return Object.freeze({ kind, scope, code, identity: slug, effect });
    }
    return Object.freeze({ kind: "discovery", scope: "identity", code: "PLAN_SYNC_UNAVAILABLE", identity: null });
}

function serializeWarning(record) {
    const safe = warningRecord(record.kind, record.scope, record.code, record.identity, record.effect);
    if (safe.kind === "sync") {
        return `${safe.identity}: ERROR: ${safe.code} scope="${safe.scope}" effect=${safe.effect}`;
    }
    if (safe.identity) return `${safe.identity}: ERROR: ${safe.code} scope="${safe.scope}"`;
    return `${safe.scope}: ERROR: ${safe.code}`;
}

function emitWarnings(ctx, records) {
    if (records.length === 0) return undefined;
    const message = `${WARNING_PREFIX}${records.map(serializeWarning).join("; ")}`;
    try {
        if (ctx?.ui?.notify) {
            ctx.ui.notify(message, "warning");
            return message;
        }
    } catch {
        // Sink failures carry no safe diagnostic data. Preserve the existing
        // console fallback with the already closed message.
    }
    console.error(message);
    return message;
}

function warningResultPatch(event, records, message) {
    if (!message) return undefined;
    const currentDetails =
        typeof event.details === "object" && event.details !== null && !Array.isArray(event.details)
            ? event.details
            : {};
    return {
        content: [
            ...(Array.isArray(event.content) ? event.content : []),
            {
                type: "text",
                text: message,
            },
        ],
        details: {
            ...currentDetails,
            planArtifactSync: {
                schema: WARNING_RESULT_SCHEMA,
                status: "failed",
                warnings: records.map((record) =>
                    warningRecord(record.kind, record.scope, record.code, record.identity, record.effect)
                ),
            },
        },
    };
}

function expandHome(value) {
    if (typeof value !== "string") return undefined;
    if (value === "~") return process.env.HOME;
    if (value.startsWith("~/") && process.env.HOME) {
        return path.join(process.env.HOME, value.slice(2));
    }
    return value;
}

function localPlanSlug(value) {
    if (typeof value !== "string") return undefined;
    return LOCAL_PLAN_URL_RE.exec(value)?.groups?.slug;
}

function eventPathCandidates(event) {
    const candidates = [];
    const add = (value) => {
        if (typeof value === "string" && value.length > 0) candidates.push(value);
    };

    add(event.input?.path);
    add(event.details?.path);
    add(event.details?.resolvedPath);
    add(event.details?.resolved_path);

    if (typeof event.input?.input === "string") {
        for (const match of event.input.input.matchAll(HASHLINE_PATH_RE)) {
            add(match.groups?.path);
        }
    }
    return [...new Set(candidates)];
}

function errorCode(error) {
    try {
        return typeof error === "object" && error !== null && typeof error.code === "string" ? error.code : undefined;
    } catch {
        return undefined;
    }
}

function discoveryWarning(error, scope, identity = undefined) {
    const code = errorCode(error);
    if (code === "ENOENT") return warningRecord("discovery", scope, "PLAN_SYNC_DISCOVERY_MISSING", identity);
    if (code === "EACCES" || code === "EPERM") {
        return warningRecord("discovery", scope, "PLAN_SYNC_DISCOVERY_UNREADABLE", identity);
    }
    if (code === "ELOOP" || code === "ENOTDIR") {
        return warningRecord("discovery", scope, "PLAN_SYNC_DISCOVERY_UNSAFE", identity);
    }
    return warningRecord("discovery", scope, "PLAN_SYNC_UNAVAILABLE", identity);
}

function fileIdentity(stat) {
    return `${stat.dev}:${stat.ino}`;
}

function sameIdentity(stat, identity) {
    return fileIdentity(stat) === identity;
}

function plausibleCandidate(value) {
    const logicalSlug = localPlanSlug(value);
    if (logicalSlug) return { value, slug: logicalSlug, logical: true };

    const expanded = expandHome(value);
    if (typeof expanded !== "string" || expanded.startsWith("local://")) return undefined;
    const slug = PLAN_FILENAME_RE.exec(path.basename(expanded))?.groups?.slug;
    return slug ? { value: expanded, slug, logical: false } : undefined;
}

async function discoverCandidate(candidate, ctx) {
    let physical;
    try {
        if (candidate.logical) {
            physical = resolveLocalUrlToPath(candidate.value, ctx.localProtocolOptions);
            if (typeof physical !== "string") {
                return {
                    warning: warningRecord("discovery", "identity", "PLAN_SYNC_UNAVAILABLE", candidate.slug),
                };
            }
            physical = path.resolve(physical);
        } else {
            physical = path.resolve(ctx.cwd, candidate.value);
        }

        const before = await fs.lstat(physical);
        if (!before.isFile() || before.isSymbolicLink()) {
            return {
                warning: warningRecord("discovery", "identity", "PLAN_SYNC_DISCOVERY_UNSAFE", candidate.slug),
            };
        }
        await fs.access(physical, fs.constants.R_OK);
        const canonical = await fs.realpath(physical);
        const after = await fs.lstat(canonical);
        if (!after.isFile() || after.isSymbolicLink() || fileIdentity(before) !== fileIdentity(after)) {
            return {
                warning: warningRecord("discovery", "identity", "PLAN_SYNC_UNAVAILABLE", candidate.slug),
            };
        }
        return {
            binding: {
                slug: candidate.slug,
                path: canonical,
                identity: fileIdentity(after),
            },
        };
    } catch (error) {
        // A plan-looking event leaf that is already absent is the existing benign
        // no-candidate case for both logical and physical event forms.
        if (errorCode(error) === "ENOENT") return {};
        return { warning: discoveryWarning(error, "identity", candidate.slug) };
    }
}

async function discoverLocalRoot(ctx) {
    try {
        const configured = expandHome(ctx?.localProtocolOptions?.localRoot);
        const candidate =
            typeof configured === "string"
                ? path.resolve(configured)
                : path.dirname(resolveLocalUrlToPath("local://plan-artifact-root-plan.md", ctx?.localProtocolOptions));
        const before = await fs.lstat(candidate);
        if (!before.isDirectory() || before.isSymbolicLink()) {
            return { warning: warningRecord("discovery", "local root", "PLAN_SYNC_DISCOVERY_UNSAFE") };
        }
        await fs.access(candidate, fs.constants.R_OK | fs.constants.X_OK);
        const canonical = await fs.realpath(candidate);
        const after = await fs.lstat(canonical);
        if (!after.isDirectory() || after.isSymbolicLink() || fileIdentity(before) !== fileIdentity(after)) {
            return { warning: warningRecord("discovery", "local root", "PLAN_SYNC_UNAVAILABLE") };
        }
        return { root: { path: canonical, identity: fileIdentity(after) } };
    } catch (error) {
        return { warning: discoveryWarning(error, "local root") };
    }
}

function isDirectChild(root, candidate) {
    const relative = path.relative(root, candidate);
    return (
        relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative) && path.dirname(relative) === "."
    );
}

async function candidatesFromMutation(event, ctx) {
    const plausible = eventPathCandidates(event).map(plausibleCandidate).filter(Boolean);
    if (plausible.length === 0) return { candidates: [], warnings: [] };

    const warnings = [];
    const slugOrder = [];
    const discoveredBySlug = new Map();
    for (const candidate of plausible) {
        if (!slugOrder.includes(candidate.slug)) slugOrder.push(candidate.slug);
        const result = await discoverCandidate(candidate, ctx);
        if (result.warning) warnings.push(result.warning);
        if (result.binding && !discoveredBySlug.has(candidate.slug)) {
            discoveredBySlug.set(candidate.slug, result.binding);
        }
    }
    if (discoveredBySlug.size === 0) return { candidates: [], warnings };

    const rootResult = await discoverLocalRoot(ctx);
    if (!rootResult.root) return { candidates: [], warnings: [...warnings, rootResult.warning] };

    const candidates = [];
    for (const slug of [...slugOrder].sort()) {
        const binding = discoveredBySlug.get(slug);
        if (!binding) continue;
        if (!isDirectChild(rootResult.root.path, binding.path)) {
            warnings.push(warningRecord("discovery", "identity", "PLAN_SYNC_DISCOVERY_UNSAFE", binding.slug));
            continue;
        }
        candidates.push({ ...binding, root: rootResult.root });
    }
    return { candidates, warnings };
}

async function revalidateCandidate(binding) {
    let phase = "local root";
    try {
        const rootBefore = await fs.lstat(binding.root.path);
        if (!rootBefore.isDirectory() || rootBefore.isSymbolicLink()) {
            return warningRecord("discovery", "local root", "PLAN_SYNC_DISCOVERY_UNSAFE");
        }
        if (!sameIdentity(rootBefore, binding.root.identity)) {
            return warningRecord("discovery", "local root", "PLAN_SYNC_UNAVAILABLE");
        }
        phase = "identity";

        const candidateBefore = await fs.lstat(binding.path);
        if (!candidateBefore.isFile() || candidateBefore.isSymbolicLink()) {
            return warningRecord("discovery", "identity", "PLAN_SYNC_DISCOVERY_UNSAFE", binding.slug);
        }
        if (!sameIdentity(candidateBefore, binding.identity)) {
            return warningRecord("discovery", "identity", "PLAN_SYNC_UNAVAILABLE", binding.slug);
        }
        await fs.access(binding.path, fs.constants.R_OK);
        const canonical = await fs.realpath(binding.path);
        if (canonical !== binding.path || !isDirectChild(binding.root.path, canonical)) {
            return warningRecord("discovery", "identity", "PLAN_SYNC_DISCOVERY_UNSAFE", binding.slug);
        }

        const candidateAfter = await fs.lstat(binding.path);
        if (
            !candidateAfter.isFile() ||
            candidateAfter.isSymbolicLink() ||
            !sameIdentity(candidateAfter, binding.identity)
        ) {
            return warningRecord("discovery", "identity", "PLAN_SYNC_UNAVAILABLE", binding.slug);
        }
        phase = "local root";
        const rootAfter = await fs.lstat(binding.root.path);
        if (!rootAfter.isDirectory() || rootAfter.isSymbolicLink() || !sameIdentity(rootAfter, binding.root.identity)) {
            return warningRecord("discovery", "local root", "PLAN_SYNC_UNAVAILABLE");
        }
        return undefined;
    } catch (error) {
        return discoveryWarning(error, phase, phase === "identity" ? binding.slug : undefined);
    }
}

async function helperPath() {
    const candidate = path.resolve(import.meta.dir, "../../../../../bin/omp-copy-plan-artifact");
    await fs.access(candidate, fs.constants.X_OK);
    return candidate;
}

function hasExactAcknowledgement(stdout, slug) {
    if (typeof stdout !== "string") return false;
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const identity = `\\d{4}-\\d{2}-\\d{2}-\\d{4}_${escapedSlug}\\.md`;
    return new RegExp(
        `^(?:plan-artifact-copied: \\.agents/plans/${identity}|plan-artifact-archived: \\.agents/plans/archive/${identity})\\n?$`
    ).test(stdout);
}

function helperProtocolWarning(stderr, slug) {
    if (typeof stderr !== "string" || stderr.includes("\r")) return undefined;
    const line = stderr.endsWith("\n") ? stderr.slice(0, -1) : stderr;
    if (line.includes("\n")) return undefined;
    const match =
        /^ERROR: (?<code>[A-Z0-9_]+): plan=(?<plan>[^ ]+) state=(?<state>[A-Za-z0-9:_-]+) path=(?<path>[^ ]+) effect=(?<effect>none|possible-complete): [^\n]*$/.exec(
            line
        );
    if (!match || !HELPER_CODES.has(match.groups.code)) return undefined;

    const fullIdentity = PLAN_ID_RE.exec(match.groups.plan);
    if (match.groups.plan !== slug && fullIdentity?.groups?.slug !== slug) return undefined;

    let scope = "identity";
    if (match.groups.path !== "none") {
        const pathMatch =
            /^\.agents\/plans\/(?:(?<archive>archive)\/)?(?<identity>\d{4}-\d{2}-\d{2}-\d{4}_[a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(
                match.groups.path
            );
        if (!pathMatch || PLAN_ID_RE.exec(pathMatch.groups.identity)?.groups?.slug !== slug) return undefined;
        if (fullIdentity && pathMatch.groups.identity !== match.groups.plan) return undefined;
        scope = pathMatch.groups.archive ? "archive" : "active";
    }

    return warningRecord("sync", scope, match.groups.code, slug, match.groups.effect);
}

async function synchronize(pi, binding, ctx) {
    const { slug } = binding;
    const invoke = pi.exec.bind(pi);
    const cwd = ctx.cwd;
    let executable;
    try {
        executable = await helperPath();
    } catch {
        return warningRecord("sync", "identity", "PLAN_SYNC_HELPER_UNAVAILABLE", slug, "none");
    }

    const revalidationWarning = await revalidateCandidate(binding);
    if (revalidationWarning) return revalidationWarning;

    let result;
    try {
        result = await invoke(
            executable,
            ["copy", "--protocol", HELPER_PROTOCOL, "--slug", slug, "--content-file", binding.path],
            { cwd }
        );
    } catch {
        return warningRecord("sync", "identity", "PLAN_SYNC_HELPER_FAILED", slug, "possible-complete");
    }

    if (!result || result.code !== 0) {
        return (
            helperProtocolWarning(result?.stderr, slug) ??
            warningRecord("sync", "identity", "PLAN_SYNC_HELPER_FAILED", slug, "possible-complete")
        );
    }
    if (
        typeof result.stderr !== "string" ||
        result.stderr.trim() !== "" ||
        !hasExactAcknowledgement(result.stdout, slug)
    ) {
        return warningRecord("sync", "identity", "PLAN_SYNC_ACK_INVALID", slug, "possible-complete");
    }
    return undefined;
}

export default function planArtifactSync(pi) {
    pi.on("tool_result", async (event, ctx) => {
        if (event.isError || !MUTATION_TOOLS.has(event.toolName)) return undefined;
        const warnings = [];
        try {
            const discovered = await candidatesFromMutation(event, ctx);
            warnings.push(...discovered.warnings);
            for (const candidate of discovered.candidates) {
                const warning = await synchronize(pi, candidate, ctx);
                if (warning) warnings.push(warning);
            }
        } catch {
            warnings.push(warningRecord("discovery", "identity", "PLAN_SYNC_UNAVAILABLE"));
        }
        const message = emitWarnings(ctx, warnings);
        return warningResultPatch(event, warnings, message);
    });
}
