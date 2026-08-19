import type { JsonObject } from "./types";

/** Baseline contract. The architect-owned versioned schema may be injected by the orchestrator later. */
export const coreRecordJsonSchema: JsonObject = {
  $id: "data10k/core-record/1.0.0",
  type: "object",
  additionalProperties: true,
  required: ["schemaVersion", "corpusRunId", "promptKey", "slug", "categorySlug", "promptVersion", "localizations", "canonicalImagePrompt", "variableDefinitions", "usageMetadata", "designMetadata", "modelCompatibility", "safetyFlags", "provenance"],
  properties: {
    schemaVersion: { const: "1.0.0" }, corpusRunId: { type: "string", minLength: 1 },
    promptKey: { type: "string", pattern: "^[a-z0-9][a-z0-9-]{2,127}$" },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", maxLength: 160 },
    categorySlug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" }, promptVersion: { type: "integer", minimum: 1 },
    localizations: { type: "object", required: ["vi", "en"], properties: { vi: { $ref: "#/$defs/localized" }, en: { $ref: "#/$defs/localized" } } },
    canonicalImagePrompt: { type: "string", minLength: 20, maxLength: 8000 },
    variableDefinitions: { type: "array", maxItems: 30, items: { type: "object", required: ["name", "type"], properties: { name: { type: "string", pattern: "^[a-z][a-z0-9_]{0,63}$" }, type: { enum: ["string", "number", "boolean", "enum"] } } } },
    usageMetadata: { type: "object", required: ["useCase", "expectedResult", "difficulty", "setupTimeMinutes", "outputType", "steps"], properties: { difficulty: { enum: ["beginner", "intermediate", "advanced"] }, setupTimeMinutes: { type: "number", minimum: 0 }, steps: { type: "array", minItems: 1 } } },
    designMetadata: { type: "object", required: ["objective", "deliverable", "subject", "context", "composition", "visualHierarchy", "artDirection", "aspectRatio"], properties: { aspectRatio: { enum: ["1:1", "3:2", "4:3", "4:5", "9:16", "16:9"] } } },
    modelCompatibility: { anyOf: [{ const: "Unknown" }, { type: "object" }] }, safetyFlags: { type: "array", items: { type: "string" } },
    provenance: { type: "object", required: ["generatorTemplateVersion", "originalContentDeclaration", "createdAt", "reviewerState"], properties: { originalContentDeclaration: { const: true }, reviewerState: { enum: ["pending", "accepted", "rejected", "held"] } } },
    contentHash: { type: "string", pattern: "^[a-f0-9]{64}$" },
  },
  $defs: { localized: { type: "object", required: ["title", "summary", "usageInstructions", "promptTemplate"], properties: { title: { type: "string", minLength: 3, maxLength: 180 }, summary: { type: "string", minLength: 10, maxLength: 1200 }, usageInstructions: { type: "string", minLength: 10, maxLength: 2400 }, promptTemplate: { type: "string", minLength: 20, maxLength: 8000 } } } },
};
