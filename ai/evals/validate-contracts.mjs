import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const aiRoot = path.join(root, "ai");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function collectRelativeReferences(value, sourceFile, trail = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectRelativeReferences(item, sourceFile, [...trail, String(index)]),
    );
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, item] of Object.entries(value)) {
    const nextTrail = [...trail, key];
    if (typeof item === "string" && /(?:_ref|_schema|file)$/u.test(key) && /^\.\.?\//u.test(item)) {
      const filePart = item.split("#", 1)[0];
      const target = path.resolve(path.dirname(sourceFile), filePart);
      assert(
        statSync(target, { throwIfNoEntry: false })?.isFile(),
        `${path.relative(root, sourceFile)}:${nextTrail.join(".")} points to missing ${item}`,
      );
    }
    collectRelativeReferences(item, sourceFile, nextTrail);
  }
}

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item?.id).filter(Boolean);
  assert(ids.length === new Set(ids).size, `${label} contains duplicate ids`);
}

const files = walk(aiRoot);
const jsonFiles = files.filter((file) => file.endsWith(".json"));
const yamlFiles = files.filter((file) => /\.ya?ml$/u.test(file));
const parsed = new Map();

for (const file of jsonFiles) {
  parsed.set(file, JSON.parse(readFileSync(file, "utf8")));
}

for (const file of yamlFiles) {
  const document = yaml.load(readFileSync(file, "utf8"));
  parsed.set(file, document);
  collectRelativeReferences(document, file);
}

const schemaFiles = jsonFiles.filter((file) =>
  file.startsWith(path.join(aiRoot, "schemas") + path.sep),
);
const schemas = schemaFiles.map((file) => parsed.get(file));
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateFormats: false,
});

for (const schema of schemas) {
  assert(typeof schema.$id === "string", `${schema.title ?? "schema"} is missing $id`);
  ajv.addSchema(schema);
}

for (const schema of schemas) {
  assert(ajv.getSchema(schema.$id), `${schema.$id} did not compile`);
}

// Subschema guards are compiled in isolation, where parent type information is
// intentionally unavailable. Full schemas above still compile in strict mode.
const guardAjv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
for (const schema of schemas) guardAjv.addSchema(schema);

function assertRejectedBy(schemaRef, value, label) {
  const validate = guardAjv.compile({ $ref: schemaRef });
  assert(!validate(value), `${label} was unexpectedly accepted`);
}

assertRejectedBy(
  "https://aliprompt.vn/schemas/orchestrator-decision.schema.json#/allOf/2",
  {
    primary_route: "prompt_coach",
    handoff: {
      target_agent: "assistant_trainer",
      adapter_id: "orchestrator_to_assistant_trainer_v1",
    },
  },
  "route/target mismatch",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/learning-evaluation.schema.json#/allOf/0",
  {
    stage_status: "mastered",
    next_action: "advance",
    priority_gaps: [],
    criteria: [{ required: true, status: "partial" }],
  },
  "mastered stage with an unmet required criterion",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/safety-review.schema.json#/allOf/4",
  {
    risk_level: "critical",
    action: "allow",
    detections: [],
    safe_to_log: false,
  },
  "critical content allowed without a detection",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/hook-critical-payloads.schema.json#/$defs/routeSelected",
  {},
  "route.selected with an empty payload",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/learning-evaluation.schema.json#/allOf/4",
  {
    user_view: { question: { type: "multiple_choice", options: [] } },
    private_state: { correct_option_id: null },
  },
  "multiple-choice question without options or a server-side answer",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/safety-review.schema.json#/allOf/6",
  {
    detections: [{ type: "secret" }],
    action: "allow",
  },
  "secret detection with allow action",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/safety-review.schema.json#/allOf/7",
  {
    direction: "outbound",
    continuation: "continue",
    allowed_destinations: ["log"],
  },
  "outbound continuation without user_response destination",
);
assertRejectedBy(
  "https://aliprompt.vn/schemas/safety-review.schema.json#/allOf/8",
  {
    detections: [{ type: "private_state_leak" }],
    action: "allow",
  },
  "private-state leak with allow action",
);

const skillCatalog = parsed.get(path.join(aiRoot, "skills", "catalog.yaml"));
assertUniqueIds(skillCatalog.skills, "skill catalog");

const hookEventSchema = parsed.get(path.join(aiRoot, "schemas", "hook-event.schema.json"));
const declaredEvents = hookEventSchema.properties.event_name.enum;
const mappedEvents = new Set(
  hookEventSchema.allOf
    .map((branch) => branch?.if?.properties?.event_name?.const)
    .filter(Boolean),
);
assert(
  declaredEvents.every((eventName) => mappedEvents.has(eventName)),
  `hook events without payload contracts: ${declaredEvents.filter((eventName) => !mappedEvents.has(eventName)).join(", ")}`,
);

const agentOutputRefs = {
  orchestrator: "orchestrator-decision.schema.json",
  prompt_coach: "prompt-coach-result.schema.json",
  assistant_trainer: "assistant-training-plan.schema.json",
  learning_evaluator: "learning-evaluation.schema.json",
  agent_architect: "agent-architecture.schema.json",
};
for (const [agent, schemaRef] of Object.entries(agentOutputRefs)) {
  const parityBranch = hookEventSchema.allOf.find(
    (branch) => branch?.if?.properties?.metadata?.properties?.agent_id?.const === agent,
  );
  assert(parityBranch, `hook event metadata has no output parity rule for ${agent}`);
  assert(
    parityBranch.then.properties.payload.properties.validated_output.$ref === schemaRef,
    `hook event metadata maps ${agent} to the wrong output schema`,
  );
}

const criticalPayloads = parsed.get(
  path.join(aiRoot, "schemas", "hook-critical-payloads.schema.json"),
);
assert(
  criticalPayloads.$defs.learningStageEvaluated.required.includes("learning_checkpoint"),
  "mastery gate payload must include the authoritative learning checkpoint",
);
assert(
  !Object.hasOwn(criticalPayloads.$defs.responseBeforeRender.properties, "agent_id"),
  "response identity must have one authority in metadata, not a mutable payload duplicate",
);
assert(
  criticalPayloads.$defs.responseBeforeRender.required.includes("claim_decision"),
  "render pipeline must carry the commercial claim decision",
);

const runtimeSafety = parsed.get(path.join(aiRoot, "hooks", "runtime-safety.hooks.yaml"));
const renderPriorities = Object.fromEntries(
  runtimeSafety.handlers
    .filter((handler) => handler.event === "response.before_render")
    .map((handler) => [handler.id, handler.priority]),
);
assert(
  renderPriorities.prepare_public_output < renderPriorities.apply_commercial_claim_decision &&
    renderPriorities.apply_commercial_claim_decision < renderPriorities.review_outbound_content &&
    renderPriorities.review_outbound_content < renderPriorities.finalize_reviewed_render_output,
  "render pipeline must apply claim removal before outbound review and final authorization",
);

const handoffAdapters = parsed.get(path.join(aiRoot, "hooks", "handoff-adapters.yaml"));
assertUniqueIds(handoffAdapters.adapters, "handoff adapter catalog");
for (const adapter of handoffAdapters.adapters) {
  assert(adapter.trigger_event, `${adapter.id} is missing trigger_event`);
  assert(adapter.required_sources?.length > 0, `${adapter.id} is missing required_sources`);
  assert(adapter.field_mappings?.adapted_input, `${adapter.id} is missing explicit field mappings`);
}

const evalCases = parsed.get(path.join(aiRoot, "evals", "cases.yaml"));
assertUniqueIds(evalCases.cases, "eval cases");

const inputContracts = {
  orchestrator: parsed.get(path.join(aiRoot, "skills", "classify-learning-need.skill.yaml")).input.schema,
  prompt_coach: parsed.get(path.join(aiRoot, "skills", "transform-prompt.skill.yaml")).input.schema,
  assistant_trainer: parsed.get(path.join(aiRoot, "skills", "build-assistant-instruction.skill.yaml")).input.schema,
  learning_evaluator: "https://aliprompt.vn/schemas/learning-evaluator-request.schema.json",
  agent_architect: parsed.get(path.join(aiRoot, "skills", "draft-agent-system.skill.yaml")).input.schema,
};
const inputValidators = Object.fromEntries(
  Object.entries(inputContracts).map(([agent, contract]) => [
    agent,
    typeof contract === "string" ? ajv.getSchema(contract) : ajv.compile(contract),
  ]),
);

for (const evalCase of evalCases.cases) {
  const validate = inputValidators[evalCase.agent];
  assert(validate, `${evalCase.id} has no input contract for ${evalCase.agent}`);
  assert(
    validate(evalCase.input),
    `${evalCase.id} input violates its skill contract: ${ajv.errorsText(validate.errors)}`,
  );
}

console.log(
  JSON.stringify({
    json_documents: jsonFiles.length,
    yaml_documents: yamlFiles.length,
    strict_schemas: schemas.length,
    invariant_guards: 8,
    skill_ids: skillCatalog.skills.length,
    eval_case_ids: evalCases.cases.length,
    validated_eval_inputs: evalCases.cases.length,
    status: "passed",
  }),
);
