import { fileURLToPath } from "node:url";
import { discoverAgents, getAgent } from "@oh-my-pi/pi-coding-agent/task";

const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const PROFILE_NAMES = Object.freeze({
    task: "task",
    reviewerA: "second-opinion-a",
    reviewerB: "second-opinion-b",
});
const READ_ONLY_TOOLS = Object.freeze(["read", "grep", "glob"]);
const READ_VERBATIM_CONFIG = fileURLToPath(new URL("./lifecycle-read-verbatim.yml", import.meta.url));

function invalid(message) {
    const error = new Error(message);
    error.code = "INVALID_INPUT";
    return error;
}

function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactKeys(value, required, optional = []) {
    if (!isRecord(value)) return false;
    const allowed = new Set([...required, ...optional]);
    return required.every((key) => Object.hasOwn(value, key)) && Object.keys(value).every((key) => allowed.has(key));
}

function safeId(value, label) {
    if (typeof value !== "string" || !SAFE_ID.test(value)) {
        throw invalid(`${label} must be a non-empty safe identifier`);
    }
    return value;
}

function actor({
    actorId,
    role,
    profile,
    owner,
    parentActorId = undefined,
    direct = false,
    requestTargets = [],
    disposeChildrenBeforeReply = false,
}) {
    return Object.freeze({
        actorId,
        role,
        profile,
        owner,
        parentActorId,
        direct,
        requestTargets: Object.freeze([...requestTargets]),
        disposeChildrenBeforeReply,
    });
}

function reviewerActors(owner, prefix = "") {
    const a = `${prefix}reviewer-a`;
    const b = `${prefix}reviewer-b`;
    return [
        actor({ actorId: a, role: "reviewer-a", profile: PROFILE_NAMES.reviewerA, owner }),
        actor({ actorId: b, role: "reviewer-b", profile: PROFILE_NAMES.reviewerB, owner }),
    ];
}

function compileReconcile(binding) {
    if (!isRecord(binding)) throw invalid("reconcile binding must be an object");
    if (binding.mode === "standalone") {
        if (!exactKeys(binding, ["mode", "controller"])) throw invalid("standalone reconcile binding is incomplete");
        safeId(binding.controller, "binding.controller");
        return {
            definition: "reconcile",
            binding: Object.freeze({ ...binding }),
            maxDirectActors: 2,
            actors: reviewerActors("root").map((entry) => Object.freeze({ ...entry, direct: true })),
        };
    }
    if (binding.mode === "delegated") {
        if (!exactKeys(binding, ["mode", "controller", "scope"])) {
            throw invalid("delegated reconcile binding is incomplete");
        }
        safeId(binding.controller, "binding.controller");
        safeId(binding.scope, "binding.scope");
        return {
            definition: "reconcile",
            binding: Object.freeze({ ...binding }),
            maxDirectActors: 2,
            actors: reviewerActors("root").map((entry) => Object.freeze({ ...entry, direct: true })),
        };
    }
    throw invalid("reconcile binding.mode must be standalone or delegated");
}

function assertAcyclic(scopes) {
    const byId = new Map(scopes.map((scope) => [scope.id, scope]));
    const visiting = new Set();
    const visited = new Set();
    const visit = (id) => {
        if (visited.has(id)) return;
        if (visiting.has(id)) throw invalid("retrace scope dependencies must be acyclic");
        visiting.add(id);
        for (const dependency of byId.get(id).requires) visit(dependency);
        visiting.delete(id);
        visited.add(id);
    };
    for (const scope of scopes) visit(scope.id);
}

function compileRetrace(binding) {
    if (!exactKeys(binding, ["controller", "scopes", "maxDirectActors"], ["normalizer"])) {
        throw invalid("retrace binding is incomplete");
    }
    safeId(binding.controller, "binding.controller");
    if (binding.maxDirectActors !== 4) throw invalid("retrace maxDirectActors must equal 4");
    if (!Array.isArray(binding.scopes) || binding.scopes.length === 0) {
        throw invalid("retrace scopes must be a non-empty array");
    }

    let normalizer;
    if (binding.normalizer !== undefined) {
        if (!exactKeys(binding.normalizer, ["id"])) throw invalid("retrace normalizer is invalid");
        normalizer = Object.freeze({ id: safeId(binding.normalizer.id, "binding.normalizer.id") });
    }

    const seen = new Set(normalizer ? [normalizer.id] : []);
    const scopes = binding.scopes.map((value, index) => {
        if (!exactKeys(value, ["id", "requires"])) throw invalid(`binding.scopes[${index}] is invalid`);
        const id = safeId(value.id, `binding.scopes[${index}].id`);
        if (seen.has(id)) throw invalid(`duplicate actor identifier: ${id}`);
        seen.add(id);
        if (!Array.isArray(value.requires)) throw invalid(`binding.scopes[${index}].requires must be an array`);
        const requires = value.requires.map((dependency, dependencyIndex) =>
            safeId(dependency, `binding.scopes[${index}].requires[${dependencyIndex}]`)
        );
        if (new Set(requires).size !== requires.length) throw invalid(`duplicate dependency in scope ${id}`);
        return Object.freeze({ id, requires: Object.freeze(requires) });
    });

    const scopeIds = new Set(scopes.map((scope) => scope.id));
    for (const scope of scopes) {
        for (const dependency of scope.requires) {
            if (!scopeIds.has(dependency) || dependency === scope.id) {
                throw invalid(`scope ${scope.id} has an invalid dependency`);
            }
        }
    }
    assertAcyclic(scopes);

    const actors = [];
    if (normalizer) {
        actors.push(actor({
            actorId: normalizer.id,
            role: "normalizer",
            profile: PROFILE_NAMES.task,
            owner: "root",
            direct: true,
        }));
    }
    for (const scope of scopes) {
        const reviewerIds = [`${scope.id}/reviewer-a`, `${scope.id}/reviewer-b`];
        actors.push(actor({
            actorId: scope.id,
            role: "scope",
            profile: PROFILE_NAMES.task,
            owner: "root",
            direct: true,
            requestTargets: reviewerIds,
            disposeChildrenBeforeReply: true,
        }));
        actors.push(...reviewerActors(`actor:${scope.id}`, `${scope.id}/`).map((entry) =>
            Object.freeze({ ...entry, parentActorId: scope.id })
        ));
    }

    return {
        definition: "retrace",
        binding: Object.freeze({
            controller: binding.controller,
            normalizer,
            scopes: Object.freeze(scopes),
            maxDirectActors: 4,
        }),
        maxDirectActors: 4,
        actors,
    };
}

export function compileConsumer(definition, binding) {
    if (definition === "reconcile") return Object.freeze(compileReconcile(binding));
    if (definition === "retrace") return Object.freeze(compileRetrace(binding));
    const error = new Error("definition must be reconcile or retrace");
    error.code = "UNKNOWN_DEFINITION";
    throw error;
}

function profileUnavailable(message) {
    const error = new Error(message);
    error.code = "PROFILE_UNAVAILABLE";
    return error;
}

function orderedSelectors(agent) {
    if (agent.model === undefined) return [];
    return Array.isArray(agent.model) ? agent.model : [agent.model];
}

function resolveModel(agent, models) {
    for (const selector of orderedSelectors(agent)) {
        if (typeof selector !== "string" || selector.length === 0) continue;
        const resolved = models.resolve(selector);
        if (resolved) return resolved;
    }
    if (orderedSelectors(agent).length > 0) return undefined;
    return models.current();
}

export async function resolveProfiles(topology, { cwd, models, discover = discoverAgents } = {}) {
    if (typeof cwd !== "string" || !models || typeof models.resolve !== "function" || typeof models.current !== "function") {
        throw profileUnavailable("profile resolution context is unavailable");
    }
    const discovered = await discover(cwd);
    if (!isRecord(discovered) || !Array.isArray(discovered.agents)) {
        throw profileUnavailable("agent discovery returned an invalid result");
    }

    const required = [...new Set(topology.actors.map((entry) => entry.profile))];
    const profiles = new Map();
    for (const name of required) {
        const agent = getAgent(discovered.agents, name);
        if (!agent || typeof agent.systemPrompt !== "string" || agent.systemPrompt.length === 0) {
            throw profileUnavailable(`required agent profile is unavailable: ${name}`);
        }
        const model = resolveModel(agent, models);
        if (!model || typeof model.provider !== "string" || typeof model.id !== "string") {
            throw profileUnavailable(`required model is unavailable for profile: ${name}`);
        }
        profiles.set(name, Object.freeze({
            name,
            systemPrompt: agent.systemPrompt,
            provider: model.provider,
            model: model.id,
            tools: READ_ONLY_TOOLS,
            readOverlayArgs: agent.readSummarize === false ? Object.freeze(["--config", READ_VERBATIM_CONFIG]) : Object.freeze([]),
        }));
    }
    return profiles;
}

export const lifecycleProfileNames = PROFILE_NAMES;
