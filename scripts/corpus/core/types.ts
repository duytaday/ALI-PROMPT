export const CORE_SCHEMA_VERSION = "1.0.0";

export type Locale = "vi" | "en";
export type JsonObject = Record<string, unknown>;

export interface VariableDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "enum";
  required?: boolean;
  default?: string | number | boolean;
  example?: string | number | boolean;
  enumValues?: string[];
}

export interface LocalizedPrompt {
  title: string;
  summary: string;
  usageInstructions: string;
  promptTemplate: string;
}

export interface CorpusRecord extends JsonObject {
  schemaVersion: string;
  corpusRunId: string;
  promptKey: string;
  slug: string;
  categorySlug: string;
  promptVersion: number;
  localizations: Record<Locale, LocalizedPrompt>;
  canonicalImagePrompt: string;
  variableDefinitions: VariableDefinition[];
  usageMetadata: {
    useCase: string;
    expectedResult: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    setupTimeMinutes: number;
    outputType: string;
    steps: string[];
  };
  designMetadata: {
    objective: string;
    deliverable: string;
    subject: string;
    context: string;
    composition: string;
    visualHierarchy: string;
    artDirection: string;
    aspectRatio: "1:1" | "3:2" | "4:3" | "4:5" | "9:16" | "16:9";
    palette?: string;
    lighting?: string;
    texture?: string;
    cameraLens?: string;
    typographyConstraints?: string;
    negativeConstraints?: string;
  };
  modelCompatibility: "Unknown" | JsonObject;
  safetyFlags: string[];
  provenance: {
    generatorTemplateVersion: string;
    originalContentDeclaration: boolean;
    createdAt: string;
    reviewerState: "pending" | "accepted" | "rejected" | "held";
    codexSurface?: string;
    modelId?: string;
  };
  contentHash?: string;
}

export interface ManifestEntry {
  promptKey: string;
  contentHash: string;
  categorySlug: string;
  promptVersion: number;
}

export interface ImmutableManifest {
  schemaVersion: string;
  runId: string;
  createdAt: string;
  records: ManifestEntry[];
  hash: string;
}

export interface BatchCheckpoint {
  schemaVersion: string;
  runId: string;
  batchId: string;
  sourceHash: string;
  completedLine: number;
  acceptedKeys: string[];
  rejected: Array<{ line: number; reasonCodes: string[] }>;
  updatedAt: string;
}

export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  contentHash?: string;
}

/** Allows the resumable pipeline to use a stricter, versioned corpus contract. */
export type RecordValidator = (candidate: unknown) => ValidationResult;

export interface QuotaPolicy {
  quotas: Record<string, number>;
  requireExact?: boolean;
}

export interface ValidationOptions {
  schemaVersion?: string;
  categories?: readonly string[];
  forbiddenTerms?: readonly string[];
  quotaPolicy?: QuotaPolicy;
  requireVietnameseDiacritic?: boolean;
}

export interface NearDuplicateCandidate {
  leftPromptKey: string;
  rightPromptKey: string;
  jaccard: number;
  simHashDistance: number;
}

export interface NearDuplicateConfig {
  shingleSize?: number;
  jaccardThreshold: number;
  simHashMaxDistance: number;
  calibrationId: string;
}

export interface StructuredModelRequest {
  stablePrefix: string;
  dynamicBatch: JsonObject;
  schemaVersion: string;
}

export interface StructuredModelResponse {
  jsonl: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface StructuredModelAdapter {
  generate(request: StructuredModelRequest): Promise<StructuredModelResponse>;
}

export interface TokenLedger {
  inputTokens: number;
  outputTokens: number;
  attempts: number;
}
