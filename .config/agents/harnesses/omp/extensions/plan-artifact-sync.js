// OMP extension: plan-artifact-sync
//
// The session-local local://<slug>-plan.md artifact is authoritative. This
// extension projects that exact file into .agents/plans/ and exposes the
// explicit completion-gated archive action.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { resolveLocalUrlToPath } from "@oh-my-pi/pi-coding-agent/internal-urls";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCAL_PLAN_URL_RE = /^local:\/\/(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)-plan\.md$/;
const HASHLINE_LOCAL_PLAN_HEADER_RE = /^\[local:\/\/(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)-plan\.md#[0-9A-F]{4}\]\r?$/gm;
const APPROVED_PLAN_INSTRUCTION_RE = /You MUST read `local:\/\/(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)-plan\.md` before executing\./g;

function notify(ctx, message) {
  if (ctx?.ui?.notify) {
    ctx.ui.notify(message, "warning");
  } else {
    console.error(message);
  }
}

function localPlanUrl(slug) {
  return `local://${slug}-plan.md`;
}

function slugFromLocalPlanUrl(value) {
  if (typeof value !== "string") return undefined;
  return LOCAL_PLAN_URL_RE.exec(value)?.groups?.slug;
}

function slugsFromHashlineEdit(event) {
  if (typeof event.input?.input !== "string") return [];
  return [...new Set(
    [...event.input.input.matchAll(HASHLINE_LOCAL_PLAN_HEADER_RE)]
      .map((match) => match.groups?.slug)
      .filter(Boolean),
  )];
}

function slugFromApprovedExecutionPrompt(event) {
  if (typeof event.prompt !== "string" || !event.prompt.startsWith("Plan approved.")) {
    return undefined;
  }

  const matches = [...event.prompt.matchAll(APPROVED_PLAN_INSTRUCTION_RE)]
    .map((match) => match.groups?.slug)
    .filter(Boolean);
  return matches.length === 1 ? matches[0] : undefined;
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

async function runHelper(pi, { operation, slug, ctx }) {
  const sourcePath = await resolveLocalUrlToPath(localPlanUrl(slug), ctx.localProtocolOptions);
  const script = await resolveScriptPath();
  const result = await pi.exec(
    script,
    [operation, "--slug", slug, "--content-file", sourcePath],
    { cwd: ctx.cwd },
  );
  if (result.code !== 0) {
    const detail = (result.stderr || result.stdout || `exit ${result.code}`).trim();
    throw new Error(`${operation} failed: ${detail}`);
  }

  return result.stdout.trim();
}

async function synchronizeSlugs(pi, ctx, slugs) {
  const failures = [];
  for (const slug of slugs) {
    try {
      await runHelper(pi, { operation: "sync", slug, ctx });
    } catch (error) {
      failures.push(`${slug}: ${error?.message ?? error}`);
    }
  }

  if (failures.length > 0) {
    notify(
      ctx,
      `plan-artifact-sync: could not synchronize the current local plan artifact. ${failures.join("; ")}`,
    );
  }
}

export default function planArtifactSync(pi) {
  const { z } = pi.zod;
  pi.setLabel("plan-artifact-sync");

  pi.on("tool_result", async (event, ctx) => {
    if (event.isError) return;

    if (event.toolName === "write") {
      const slug = slugFromLocalPlanUrl(event.input?.path);
      if (slug) await synchronizeSlugs(pi, ctx, [slug]);
      return;
    }

    if (event.toolName === "edit") {
      await synchronizeSlugs(pi, ctx, slugsFromHashlineEdit(event));
    }
  });

  pi.on("before_agent_start", async (event, ctx) => {
    const slug = slugFromApprovedExecutionPrompt(event);
    if (slug) await synchronizeSlugs(pi, ctx, [slug]);
  });

  pi.registerTool({
    name: "archive_plan_artifact",
    label: "Archive plan artifact",
    description: "Synchronizes and atomically archives the current session's completed local://<slug>-plan.md only after the base completion contract is satisfied.",
    parameters: z.object({
      slug: z.string().regex(SLUG_PATTERN, "slug must be canonical lowercase kebab-case"),
    }),
    loadMode: "essential",
    async execute(_toolCallId, { slug }, signal, _onUpdate, ctx) {
      if (signal?.aborted) {
        throw new Error("archive_plan_artifact was cancelled");
      }

      const output = await runHelper(pi, { operation: "archive", slug, ctx });
      return {
        content: [{ type: "text", text: output }],
        details: { slug, operation: "archive" },
      };
    },
  });
}
