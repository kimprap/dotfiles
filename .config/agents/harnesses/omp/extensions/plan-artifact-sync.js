// OMP extension: plan-artifact-sync
//
// Mirrors plan-mode artifacts from local://<slug>-plan.md into .agents/plans/
// without interfering with OMP's own plan review / resolve flow.
//
// The original OMP artifact remains the source of truth for plan mode. This
// hook only creates or updates the repo-local copy.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { $ } from "bun";

const PLAN_FILENAME_RE = /^(?<slug>[a-z0-9_-]+)-plan\.md$/i;
const LOCAL_PLAN_HEADER_RE = /\[local:\/\/(?<file>[a-z0-9_-]+-plan\.md)#[0-9A-F]{4}\]/i;
const MIRROR_FILENAME_RE = /^(?<datetime>\d{4}-\d{2}-\d{2}-\d{4})_(?<slug>[A-Za-z0-9_-]+)\.md$/;
const REQUIRED_HEADER_RE = /\*\*Datetime\*\*:/;
const TARGET_DIR = ".agents/plans";

function notify(ctx, message) {
  if (ctx?.ui?.notify) {
    ctx.ui.notify(message, "warning");
  } else {
    console.error(message);
  }
}


function humanizeSlug(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractSlugFromPlanFilename(fileName) {
  const match = PLAN_FILENAME_RE.exec(fileName);
  return match?.groups?.slug?.toLowerCase() || undefined;
}

function expandHomePath(filePath) {
  if (typeof filePath !== "string" || filePath.length === 0) return undefined;
  if (filePath === "~") return process.env.HOME || filePath;
  if (!filePath.startsWith("~/") && !filePath.startsWith("~\\")) return filePath;

  const home = process.env.HOME;
  if (!home) return filePath;
  return path.join(home, filePath.slice(2));
}

function extractSlugFromPlanPath(rawPath) {
  if (typeof rawPath !== "string" || rawPath.length === 0) return undefined;

  if (rawPath.startsWith("local://")) {
    return extractSlugFromPlanFilename(rawPath.replace(/^local:\/\//i, ""));
  }

  if (!/(^|[\\/])local[\\/]/i.test(rawPath)) return undefined;
  return extractSlugFromPlanFilename(path.basename(rawPath));
}

function extractSlugFromWriteEvent(event) {
  return extractSlugFromPlanPath(String(event.input?.path ?? ""));
}

function extractSlugFromEditEvent(event) {
  const rawInput = typeof event.input?.input === "string"
    ? event.input.input
    : typeof event.input?._input === "string"
      ? event.input._input
      : "";
  const match = LOCAL_PLAN_HEADER_RE.exec(rawInput);
  if (match?.groups?.file) return extractSlugFromPlanFilename(match.groups.file);

  const detailsPath = typeof event.details?.path === "string" ? event.details.path : undefined;
  return extractSlugFromPlanPath(detailsPath);
}

async function resolveMirrorDatetime(cwd, slug, slugToDatetime) {
  const cached = slugToDatetime.get(slug);
  if (cached) return cached;

  try {
    const targetDir = path.join(cwd, TARGET_DIR);
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const candidates = [];

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const match = MIRROR_FILENAME_RE.exec(entry.name);
      if (!match?.groups) continue;
      if (match.groups.slug.toLowerCase() !== slug) continue;
      const fullPath = path.join(targetDir, entry.name);
      const stat = await fs.stat(fullPath).catch(() => null);
      candidates.push({ datetime: match.groups.datetime, mtimeMs: stat?.mtimeMs ?? 0 });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
      const reused = candidates[0].datetime;
      slugToDatetime.set(slug, reused);
      return reused;
    }
  } catch {
    // No existing mirror yet — fall through to a fresh datetime.
  }

  const created = (await $`date +%Y-%m-%d-%H%M`.quiet()).text().trim();
  slugToDatetime.set(slug, created);
  return created;
}

function ensureRequiredPlanHeader(content, slug, datetime) {
  const title = (content.match(/^#\s+(.+?)\s*$/m)?.[1] || humanizeSlug(slug)).trim();
  let text = content;

  if (!/^#\s+/m.test(text)) {
    text = `# ${title}\n\n${text.trimStart()}`;
  }

  if (!REQUIRED_HEADER_RE.test(text)) {
    const headerBlock = [
      `**Datetime**: ${datetime}`,
      `**Scope**: ${title}`,
      `**Summary**: Mirrored OMP plan artifact for ${title}.`,
      `**Status**: PENDING`,
      "",
    ].join("\n");
    return text.replace(/^#\s+.+$/m, match => `${match}\n\n${headerBlock}`);
  }

  return text.replace(/^\*\*Datetime\*\*:\s*.*$/m, `**Datetime**: ${datetime}`);
}

async function resolveScriptPath() {
  const bundled = path.resolve(import.meta.dir, "../../../../../bin/omp-copy-plan-artifact");
  try {
    await fs.access(bundled);
    return bundled;
  } catch {
    const fromPath = Bun.which("omp-copy-plan-artifact");
    if (fromPath) return fromPath;
    throw new Error("omp-copy-plan-artifact is not installed or not executable");
  }
}

async function mirrorPlanContent({ cwd, slug, content, datetime, ctx }) {
  const normalized = ensureRequiredPlanHeader(content, slug, datetime);
  const tmp = path.join(
    process.env.TMPDIR || "/tmp",
    `omp-plan-${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}.md`,
  );

  try {
    await Bun.write(tmp, normalized);
    const script = await resolveScriptPath();
    const proc = Bun.spawn(
      [script, "--slug", slug, "--datetime", datetime, "--content-file", tmp],
      { cwd, stdout: "pipe", stderr: "pipe" },
    );

    const [stdout, stderr, code] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);

    if (code !== 0) {
      notify(ctx, `plan-artifact-sync: script exited ${code}\n${(stderr || stdout).trim()}`.trim());
    }
  } finally {
    await fs.unlink(tmp).catch(() => {});
  }
}

export default function planArtifactSync(pi) {
  pi.setLabel("plan-artifact-sync");

  // Stable slug -> datetime mapping for the current OMP process so repeated
  // local:// updates overwrite the same mirrored file.
  const slugToDatetime = new Map();

  pi.on("tool_result", async (event, ctx) => {
    if (event.isError) return;
    if (event.toolName !== "write" && event.toolName !== "edit") return;

    try {
      const cwd = ctx?.cwd || process.cwd();
      let slug;
      let content;

      if (event.toolName === "write") {
        slug = extractSlugFromWriteEvent(event);
        content = typeof event.input?.content === "string" ? event.input.content : undefined;
      } else {
        slug = extractSlugFromEditEvent(event);
        const rawDetailsPath = typeof event.details?.path === "string" ? event.details.path : undefined;
        const absolutePath = expandHomePath(rawDetailsPath);
        if (slug && absolutePath) {
          content = await Bun.file(absolutePath).text();
        }
      }

      if (!slug || typeof content !== "string" || content.trim().length === 0) return;

      const datetime = await resolveMirrorDatetime(cwd, slug, slugToDatetime);
      await mirrorPlanContent({ cwd, slug, content, datetime, ctx });
    } catch (err) {
      notify(ctx, `plan-artifact-sync error: ${err?.message || err}`);
    }
  });
}
