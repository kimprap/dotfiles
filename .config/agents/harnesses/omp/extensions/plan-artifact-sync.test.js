import { afterEach, describe, expect, mock, test } from "bun:test";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

mock.module("@oh-my-pi/pi-coding-agent/internal-urls", () => ({
  resolveLocalUrlToPath(url, options) {
    if (!options?.localRoot) throw new Error("missing test local protocol options");
    return join(options.localRoot, url.slice("local://".length));
  },
}));

const { default: planArtifactSync } = await import("./plan-artifact-sync.js");

const DOTFILES = "/Users/kim/.dotfiles";
const HELPER = join(DOTFILES, "bin/omp-copy-plan-artifact");
const ACTIVE_DIR = [".agents", "plans"];
const cleanups = new Set();

function planBytes({
  datetime = "2026-07-31-1718",
  status = "PENDING",
  body = "",
  lineEnding = "\n",
} = {}) {
  return Buffer.from([
    "# Demo plan",
    "",
    `**Datetime**: ${datetime}`,
    "**Scope**: Test plan artifacts",
    "**Summary**: Exercise deterministic plan projection.",
    `**Status**: ${status}`,
    "",
    "## Tasks",
    "- [x] T1. Exercise plan artifacts",
    "",
    "## Verification / Done criteria",
    "- [x] The test fixture is deterministic",
    body,
  ].filter((line) => line !== "").join(lineEnding) + lineEnding);
}

async function temporaryDirectory(prefix) {
  const directory = await fs.mkdtemp(join(tmpdir(), prefix));
  cleanups.add(directory);
  return directory;
}

async function pathExists(filePath) {
  try {
    await fs.lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function activePath(cwd, datetime, slug) {
  return join(cwd, ...ACTIVE_DIR, `${datetime}_${slug}.md`);
}

function archivePath(cwd, datetime, slug) {
  return join(cwd, ...ACTIVE_DIR, "archive", `${datetime}_${slug}.md`);
}

async function runProcess(command, args, cwd) {
  const process = Bun.spawn([command, ...args], { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);
  return { code, stdout: stdout.trim(), stderr: stderr.trim() };
}

function runHelper(cwd, operation, slug, contentFile) {
  return runProcess(HELPER, [operation, "--slug", slug, "--content-file", contentFile], cwd);
}

async function writeLocalPlan(localRoot, slug, bytes) {
  const sourcePath = join(localRoot, `${slug}-plan.md`);
  await fs.writeFile(sourcePath, bytes);
  return sourcePath;
}

async function lockPathFor(cwd, datetime, slug) {
  const root = await fs.realpath(cwd);
  const planId = `${datetime}_${slug}`;
  const key = createHash("sha256").update(`${root}\0${planId}`).digest("hex");
  return join(tmpdir(), "omp-plan-artifact-locks", `${key}.lock`);
}

function createFakePi() {
  const handlers = new Map();
  const tools = [];
  const warnings = [];
  const z = {
    string() {
      return {
        regex() {
          return { type: "string" };
        },
      };
    },
    object(shape) {
      return { shape };
    },
  };

  return {
    handlers,
    tools,
    warnings,
    zod: { z },
    setLabel() {},
    on(name, handler) {
      handlers.set(name, handler);
    },
    registerTool(tool) {
      tools.push(tool);
    },
    async exec(command, args, { cwd }) {
      return runProcess(command, args, cwd);
    },
  };
}

function extensionContext(cwd, localRoot, warnings) {
  return {
    cwd,
    localProtocolOptions: { localRoot },
    ui: {
      notify(message) {
        warnings.push(message);
      },
    },
  };
}

afterEach(async () => {
  await Promise.all([...cleanups].map((directory) => fs.rm(directory, { recursive: true, force: true })));
  cleanups.clear();
});

describe("omp-copy-plan-artifact", () => {
  test("derives the identity from canonical metadata and preserves bytes", async () => {
    const cwd = await temporaryDirectory("omp-plan-helper-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const source = await writeLocalPlan(
      localRoot,
      "demo",
      planBytes({ datetime: "2024-02-29-2359", lineEnding: "\r\n" }),
    );

    const result = await runHelper(cwd, "sync", "demo", source);
    const target = activePath(cwd, "2024-02-29-2359", "demo");

    expect(result.code).toBe(0);
    expect(result.stdout).toBe("plan-artifact-synced: .agents/plans/2024-02-29-2359_demo.md");
    expect(await fs.readFile(target)).toEqual(await fs.readFile(source));

    const uppercase = await runHelper(cwd, "sync", "Demo", source);
    expect(uppercase.code).not.toBe(0);
    expect(await fs.readdir(join(cwd, ...ACTIVE_DIR))).toEqual(["2024-02-29-2359_demo.md"]);

    const quoted = await writeLocalPlan(
      localRoot,
      "quoted",
      planBytes({ body: "## Completion Summary\n**Datetime**: quoted plan identity\n**Status**: quoted status" }),
    );
    expect((await runHelper(cwd, "sync", "quoted", quoted)).code).toBe(0);
    expect(await pathExists(activePath(cwd, "2026-07-31-1718", "quoted"))).toBe(true);
  });

  test("rejects invalid, duplicate, misplaced, and non-UTF-8 metadata without writes", async () => {
    const cwd = await temporaryDirectory("omp-plan-helper-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const invalidFixtures = [
      ["calendar", planBytes({ datetime: "2026-02-29-1718" })],
      ["duplicate", Buffer.from(planBytes().toString().replace("## Tasks", "**Datetime**: 2026-07-31-1718\n\n## Tasks"))],
      ["misplaced", Buffer.from("# Demo\n\n## Tasks\n**Datetime**: 2026-07-31-1718\n")],
      ["nonutf8", Buffer.from([0x23, 0x20, 0xff])],
    ];

    for (const [slug, bytes] of invalidFixtures) {
      const source = await writeLocalPlan(localRoot, slug, bytes);
      const result = await runHelper(cwd, "sync", slug, source);
      expect(result.code).not.toBe(0);
      expect(await pathExists(activePath(cwd, "2026-07-31-1718", slug))).toBe(false);
    }
  });

  test("fails closed for ambiguity and refuses a non-DONE archive", async () => {
    const cwd = await temporaryDirectory("omp-plan-helper-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const source = await writeLocalPlan(localRoot, "demo", planBytes());
    const active = activePath(cwd, "2026-07-31-1718", "demo");
    const archived = archivePath(cwd, "2026-07-31-1718", "demo");
    await fs.mkdir(join(cwd, ...ACTIVE_DIR, "archive"), { recursive: true });
    await fs.writeFile(active, "active before ambiguity");
    await fs.writeFile(archived, "archive before ambiguity");

    const ambiguous = await runHelper(cwd, "sync", "demo", source);
    expect(ambiguous.code).not.toBe(0);
    expect(await fs.readFile(active, "utf8")).toBe("active before ambiguity");
    expect(await fs.readFile(archived, "utf8")).toBe("archive before ambiguity");

    await fs.rm(archived);
    const nonDoneArchive = await runHelper(cwd, "archive", "demo", source);
    expect(nonDoneArchive.code).not.toBe(0);
    expect(await fs.readFile(active, "utf8")).toBe("active before ambiguity");
  });

  test("archives a completed source directly when no projection exists", async () => {
    const cwd = await temporaryDirectory("omp-plan-helper-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const source = await writeLocalPlan(localRoot, "demo", planBytes());
    const active = activePath(cwd, "2026-07-31-1718", "demo");
    const archived = archivePath(cwd, "2026-07-31-1718", "demo");

    const rejected = await runHelper(cwd, "archive", "demo", source);
    expect(rejected.code).not.toBe(0);
    expect(await pathExists(active)).toBe(false);
    expect(await pathExists(archived)).toBe(false);

    await fs.writeFile(source, planBytes({ status: "DONE", body: "## Completion Summary\nDirect archive." }));

    const result = await runHelper(cwd, "archive", "demo", source);
    expect(result.stdout).toBe("plan-artifact-archived: .agents/plans/archive/2026-07-31-1718_demo.md");
    expect(await pathExists(active)).toBe(false);
    expect(await fs.readFile(archived)).toEqual(await fs.readFile(source));
  });

  test("archives once and refreshes only the archived identity thereafter", async () => {
    const cwd = await temporaryDirectory("omp-plan-helper-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const source = await writeLocalPlan(localRoot, "demo", planBytes());
    const active = activePath(cwd, "2026-07-31-1718", "demo");
    const archived = archivePath(cwd, "2026-07-31-1718", "demo");

    expect((await runHelper(cwd, "sync", "demo", source)).code).toBe(0);
    await fs.writeFile(source, planBytes({ status: "DONE", body: "## Completion Summary\nDone." }));
    const archivedResult = await runHelper(cwd, "archive", "demo", source);
    expect(archivedResult.stdout).toBe("plan-artifact-archived: .agents/plans/archive/2026-07-31-1718_demo.md");
    expect(await pathExists(active)).toBe(false);
    expect(await fs.readFile(archived)).toEqual(await fs.readFile(source));

    await fs.writeFile(source, planBytes({ status: "DONE", body: "## Completion Summary\nLater override." }));
    const repeatArchive = await runHelper(cwd, "archive", "demo", source);
    expect(repeatArchive.stdout).toBe("plan-artifact-already-archived: .agents/plans/archive/2026-07-31-1718_demo.md");
    const postArchiveSync = await runHelper(cwd, "sync", "demo", source);
    expect(postArchiveSync.stdout).toBe("plan-artifact-synced: .agents/plans/archive/2026-07-31-1718_demo.md");
    expect(await pathExists(active)).toBe(false);
    expect(await fs.readFile(archived)).toEqual(await fs.readFile(source));
  });

  test("keeps distinct identities for matching slugs with distinct datetimes", async () => {
    const cwd = await temporaryDirectory("omp-plan-helper-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const first = await writeLocalPlan(localRoot, "demo", planBytes({ datetime: "2026-07-30-1718" }));
    const second = join(localRoot, "second-plan.md");
    await fs.writeFile(second, planBytes({ datetime: "2026-07-31-1718" }));

    expect((await runHelper(cwd, "sync", "demo", first)).code).toBe(0);
    expect((await runHelper(cwd, "sync", "demo", second)).code).toBe(0);
    expect(await pathExists(activePath(cwd, "2026-07-30-1718", "demo"))).toBe(true);
    expect(await pathExists(activePath(cwd, "2026-07-31-1718", "demo"))).toBe(true);
  });

  test("converges planner and executor copies through the extension and archives explicitly", async () => {
    const cwd = await temporaryDirectory("omp-plan-extension-");
    const plannerRoot = await temporaryDirectory("omp-plan-planner-");
    const executorRoot = await temporaryDirectory("omp-plan-executor-");
    const pi = createFakePi();
    planArtifactSync(pi);
    const toolResult = pi.handlers.get("tool_result");
    const beforeAgentStart = pi.handlers.get("before_agent_start");
    const archiveTool = pi.tools.find((tool) => tool.name === "archive_plan_artifact");
    const plannerContext = extensionContext(cwd, plannerRoot, pi.warnings);
    const executorContext = extensionContext(cwd, executorRoot, pi.warnings);
    const active = activePath(cwd, "2026-07-31-1718", "demo");
    const archived = archivePath(cwd, "2026-07-31-1718", "demo");

    expect(archiveTool.loadMode).toBe("essential");
    await writeLocalPlan(plannerRoot, "demo", planBytes({ body: "Planner draft." }));
    await toolResult({ isError: false, toolName: "write", input: { path: "local://demo-plan.md" } }, plannerContext);
    expect(await fs.readFile(active)).toEqual(await fs.readFile(join(plannerRoot, "demo-plan.md")));

    await fs.writeFile(join(plannerRoot, "demo-plan.md"), planBytes({ body: "Review overlay." }));
    await toolResult(
      { isError: false, toolName: "edit", input: { input: "[local://demo-plan.md#ABCD]\nSWAP 1.=1:\n+# Demo" } },
      plannerContext,
    );
    await fs.copyFile(join(plannerRoot, "demo-plan.md"), join(executorRoot, "demo-plan.md"));
    await beforeAgentStart(
      { prompt: "Plan approved.\nYou MUST read `local://demo-plan.md` before executing.\n" },
      executorContext,
    );
    expect(await fs.readFile(active)).toEqual(await fs.readFile(join(executorRoot, "demo-plan.md")));

    await fs.writeFile(
      join(executorRoot, "demo-plan.md"),
      planBytes({ status: "DONE", body: "## Completion Summary\nExecutor completion evidence." }),
    );
    await toolResult(
      { isError: false, toolName: "edit", input: { input: "[local://demo-plan.md#C0DE]\nSWAP 1.=1:\n+# Demo" } },
      executorContext,
    );
    expect(await fs.readFile(active)).toEqual(await fs.readFile(join(executorRoot, "demo-plan.md")));

    const toolResultValue = await archiveTool.execute("call", { slug: "demo" }, undefined, undefined, executorContext);
    expect(toolResultValue.content[0].text).toBe("plan-artifact-archived: .agents/plans/archive/2026-07-31-1718_demo.md");
    expect(await pathExists(active)).toBe(false);
    expect(await fs.readFile(archived)).toEqual(await fs.readFile(join(executorRoot, "demo-plan.md")));

    await fs.writeFile(
      join(executorRoot, "demo-plan.md"),
      planBytes({ status: "DONE", body: "## Completion Summary\nLater executor override." }),
    );
    await toolResult(
      { isError: false, toolName: "edit", input: { input: "[local://demo-plan.md#D00D]\nSWAP 1.=1:\n+# Demo" } },
      executorContext,
    );
    expect(await pathExists(active)).toBe(false);
    expect(await fs.readFile(archived)).toEqual(await fs.readFile(join(executorRoot, "demo-plan.md")));
    expect(pi.warnings).toEqual([]);
  });

  test("ignores working-tree edits and non-approved prompts", async () => {
    const cwd = await temporaryDirectory("omp-plan-extension-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const pi = createFakePi();
    planArtifactSync(pi);
    const context = extensionContext(cwd, localRoot, pi.warnings);
    await writeLocalPlan(localRoot, "demo", planBytes());

    await pi.handlers.get("tool_result")(
      {
        isError: false,
        toolName: "edit",
        input: { input: "[/workspace/notes.md#ABCD]\nSWAP 1.=1:\n+[local://demo-plan.md#C0DE]" },
      },
      context,
    );
    await pi.handlers.get("before_agent_start")(
      { prompt: "Please read `local://demo-plan.md` before executing." },
      context,
    );

    expect(await pathExists(activePath(cwd, "2026-07-31-1718", "demo"))).toBe(false);
    expect(pi.warnings).toEqual([]);
  });

  test("serializes overlapping sync and archive, reclaims dead or malformed locks, and times out live locks", async () => {
    const cwd = await temporaryDirectory("omp-plan-lock-");
    const localRoot = await temporaryDirectory("omp-plan-local-");
    const source = await writeLocalPlan(
      localRoot,
      "demo",
      planBytes({ status: "DONE", body: "## Completion Summary\nDone." }),
    );
    const active = activePath(cwd, "2026-07-31-1718", "demo");
    const archived = archivePath(cwd, "2026-07-31-1718", "demo");

    expect((await runHelper(cwd, "sync", "demo", source)).code).toBe(0);
    const gateLock = await lockPathFor(cwd, "2026-07-31-1718", "demo");
    await fs.mkdir(gateLock, { recursive: true });
    await fs.writeFile(join(gateLock, "owner.json"), JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
    const sync = Bun.spawn([HELPER, "sync", "--slug", "demo", "--content-file", source], { cwd, stdout: "pipe", stderr: "pipe" });
    const archive = Bun.spawn([HELPER, "archive", "--slug", "demo", "--content-file", source], { cwd, stdout: "pipe", stderr: "pipe" });
    await Bun.sleep(100);
    expect(await pathExists(active)).toBe(true);
    expect(await pathExists(archived)).toBe(false);
    await fs.rm(gateLock, { recursive: true, force: true });
    const [syncCode, archiveCode] = await Promise.all([sync.exited, archive.exited]);
    expect(syncCode).toBe(0);
    expect(archiveCode).toBe(0);
    expect(await pathExists(active)).toBe(false);
    expect(await pathExists(archived)).toBe(true);

    const deadCwd = await temporaryDirectory("omp-plan-dead-lock-");
    const deadSource = await writeLocalPlan(localRoot, "dead", planBytes());
    const deadLock = await lockPathFor(deadCwd, "2026-07-31-1718", "dead");
    await fs.mkdir(deadLock, { recursive: true });
    await fs.writeFile(join(deadLock, "owner.json"), JSON.stringify({ pid: 2_147_483_647, createdAt: new Date().toISOString() }));
    const reclaimed = await runHelper(deadCwd, "sync", "dead", deadSource);
    expect(reclaimed.code).toBe(0);
    expect(await pathExists(activePath(deadCwd, "2026-07-31-1718", "dead"))).toBe(true);

    const abandonedCwd = await temporaryDirectory("omp-plan-abandoned-claim-");
    const abandonedSource = await writeLocalPlan(localRoot, "abandoned", planBytes());
    const abandonedLock = await lockPathFor(abandonedCwd, "2026-07-31-1718", "abandoned");
    await fs.mkdir(abandonedLock, { recursive: true });
    await fs.writeFile(join(abandonedLock, "owner.json"), JSON.stringify({ pid: 2_147_483_647, createdAt: new Date().toISOString() }));
    await fs.writeFile(join(abandonedLock, "reclaim.json"), JSON.stringify({ pid: 2_147_483_647, createdAt: new Date().toISOString() }));
    const abandonedRecovered = await runHelper(abandonedCwd, "sync", "abandoned", abandonedSource);
    expect(abandonedRecovered.code).toBe(0);
    expect(await pathExists(activePath(abandonedCwd, "2026-07-31-1718", "abandoned"))).toBe(true);

    const competingCwd = await temporaryDirectory("omp-plan-competing-reclaim-");
    const competingSource = await writeLocalPlan(localRoot, "competing", planBytes());
    const competingLock = await lockPathFor(competingCwd, "2026-07-31-1718", "competing");
    await fs.mkdir(competingLock, { recursive: true });
    await fs.writeFile(join(competingLock, "owner.json"), JSON.stringify({ pid: 2_147_483_647, createdAt: new Date().toISOString() }));
    const firstReclaimer = Bun.spawn([HELPER, "sync", "--slug", "competing", "--content-file", competingSource], { cwd: competingCwd, stdout: "pipe", stderr: "pipe" });
    const secondReclaimer = Bun.spawn([HELPER, "sync", "--slug", "competing", "--content-file", competingSource], { cwd: competingCwd, stdout: "pipe", stderr: "pipe" });
    expect(await Promise.all([firstReclaimer.exited, secondReclaimer.exited])).toEqual([0, 0]);
    expect(await pathExists(activePath(competingCwd, "2026-07-31-1718", "competing"))).toBe(true);
    expect(await pathExists(archivePath(competingCwd, "2026-07-31-1718", "competing"))).toBe(false);

    const malformedCwd = await temporaryDirectory("omp-plan-malformed-lock-");
    const malformedSource = await writeLocalPlan(localRoot, "malformed", planBytes());
    const malformedLock = await lockPathFor(malformedCwd, "2026-07-31-1718", "malformed");
    await fs.mkdir(malformedLock, { recursive: true });
    await fs.writeFile(join(malformedLock, "owner.json"), "{");
    const staleTime = new Date(Date.now() - 2_000);
    await fs.utimes(malformedLock, staleTime, staleTime);
    const malformedReclaimed = await runHelper(malformedCwd, "sync", "malformed", malformedSource);
    expect(malformedReclaimed.code).toBe(0);
    expect(await pathExists(activePath(malformedCwd, "2026-07-31-1718", "malformed"))).toBe(true);

    const liveCwd = await temporaryDirectory("omp-plan-live-lock-");
    const liveSource = await writeLocalPlan(localRoot, "live", planBytes());
    const liveLock = await lockPathFor(liveCwd, "2026-07-31-1718", "live");
    await fs.mkdir(liveLock, { recursive: true });
    await fs.writeFile(join(liveLock, "owner.json"), JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
    const timedOut = await runHelper(liveCwd, "sync", "live", liveSource);
    expect(timedOut.code).not.toBe(0);
    expect(await pathExists(activePath(liveCwd, "2026-07-31-1718", "live"))).toBe(false);
    await fs.rm(liveLock, { recursive: true, force: true });
  }, 20_000);
});
