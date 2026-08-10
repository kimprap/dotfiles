// OMP extension: plan-artifact-sync
//
// A session-local local://<slug>-plan.md artifact is authoritative. After each
// successful write or edit, this extension asks the repository helper to mirror
// that exact artifact and, when its lifecycle is complete, archive only the
// repository projection.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { resolveLocalUrlToPath } from "@oh-my-pi/pi-coding-agent/internal-urls";

const LOCAL_PLAN_URL_RE = /^local:\/\/(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)-plan\.md$/;
const PLAN_FILENAME_RE = /^(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)-plan\.md$/;
const HASHLINE_PATH_RE = /^\[(?<path>[^\]\r\n]+)#[0-9A-F]{4}\]\r?$/gm;
const MUTATION_TOOLS = new Set(["write", "edit"]);

function notify(ctx, message) {
    if (ctx?.ui?.notify) ctx.ui.notify(message, "warning");
    else console.error(message);
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

async function localRoot(ctx) {
    const configured = expandHome(ctx?.localProtocolOptions?.localRoot);
    const candidate =
        typeof configured === "string"
            ? path.resolve(configured)
            : path.dirname(resolveLocalUrlToPath("local://plan-artifact-root-plan.md", ctx?.localProtocolOptions));
    const rootStat = await fs.lstat(candidate);
    if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
        throw new Error("local artifact root must be a regular non-symlink directory");
    }
    return fs.realpath(candidate);
}

function isDirectChild(root, candidate) {
    const relative = path.relative(root, candidate);
    return (
        relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative) && path.dirname(relative) === "."
    );
}

async function slugFromPhysicalPath(value, ctx, root) {
    const expanded = expandHome(value);
    if (typeof expanded !== "string" || expanded.startsWith("local://")) return undefined;
    const candidate = path.resolve(ctx.cwd, expanded);
    let candidateStat;
    try {
        candidateStat = await fs.lstat(candidate);
    } catch (error) {
        if (error?.code === "ENOENT") return undefined;
        throw error;
    }
    if (!candidateStat.isFile() || candidateStat.isSymbolicLink()) return undefined;

    const canonical = await fs.realpath(candidate);
    if (!isDirectChild(root, canonical)) return undefined;
    return PLAN_FILENAME_RE.exec(path.basename(canonical))?.groups?.slug;
}

async function slugsFromMutation(event, ctx) {
    const root = await localRoot(ctx);
    const slugs = new Set();
    const errors = [];
    for (const candidate of eventPathCandidates(event)) {
        try {
            const logical = localPlanSlug(candidate);
            if (logical) {
                const resolved = await fs.realpath(resolveLocalUrlToPath(candidate, ctx.localProtocolOptions));
                if (isDirectChild(root, resolved)) slugs.add(logical);
                continue;
            }
            const physical = await slugFromPhysicalPath(candidate, ctx, root);
            if (physical) slugs.add(physical);
        } catch (error) {
            errors.push(`${candidate}: ${error?.message ?? String(error)}`);
        }
    }
    return { slugs: [...slugs], errors };
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
        `^(?:plan-artifact-synced: \\.agents/plans/${identity}|plan-artifact-(?:archived|already-archived): \\.agents/plans/archive/${identity})\\n?$`
    ).test(stdout);
}

async function synchronize(pi, slug, ctx) {
    const source = resolveLocalUrlToPath(`local://${slug}-plan.md`, ctx.localProtocolOptions);
    const result = await pi.exec(await helperPath(), ["sync", "--slug", slug, "--content-file", source], {
        cwd: ctx.cwd,
    });
    if (result.code !== 0) {
        throw new Error((result.stderr || result.stdout || `helper exited ${result.code}`).trim());
    }
    if ((result.stderr ?? "").trim() !== "" || !hasExactAcknowledgement(result.stdout, slug)) {
        throw new Error("helper acknowledgement was missing or invalid after a possible storage effect");
    }
}

export default function planArtifactSync(pi) {
    pi.on("tool_result", async (event, ctx) => {
        if (event.isError || !MUTATION_TOOLS.has(event.toolName)) return undefined;
        try {
            const { slugs, errors } = await slugsFromMutation(event, ctx);
            for (const slug of slugs) {
                try {
                    await synchronize(pi, slug, ctx);
                } catch (error) {
                    errors.push(`${slug}: ${error?.message ?? String(error)}`);
                }
            }
            if (errors.length > 0) notify(ctx, `plan-artifact-sync: ${errors.join("; ")}`);
        } catch (error) {
            notify(ctx, `plan-artifact-sync: ${error?.message ?? String(error)}`);
        }
        return undefined;
    });
}
