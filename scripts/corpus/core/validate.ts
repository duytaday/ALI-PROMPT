import Ajv from "ajv";
import { contentHash, normalizeText } from "./canonical";
import { coreRecordJsonSchema } from "./schema";
import type { CorpusRecord, QuotaPolicy, ValidationIssue, ValidationOptions, ValidationResult } from "./types";

const DEFAULT_FORBIDDEN = ["disney", "marvel", "nike", "coca-cola", "taylor swift", "in the style of"];
const PLACEHOLDER = /\{\{\s*([a-z][a-z0-9_]*)\s*\}\}/gu;

function textFields(record: CorpusRecord): Array<[string, string]> {
  return [["canonicalImagePrompt", record.canonicalImagePrompt], ...(["vi", "en"] as const).flatMap((locale) => {
    const value = record.localizations?.[locale];
    return value ? [[`localizations.${locale}.title`, value.title], [`localizations.${locale}.summary`, value.summary], [`localizations.${locale}.usageInstructions`, value.usageInstructions], [`localizations.${locale}.promptTemplate`, value.promptTemplate]] as Array<[string, string]> : [];
  })];
}
function variables(value: string): { names: Set<string>; malformed: boolean } {
  const names = new Set<string>(); let match: RegExpExecArray | null;
  PLACEHOLDER.lastIndex = 0; while ((match = PLACEHOLDER.exec(value))) names.add(match[1]);
  const braces = (value.match(/\{\{|\}\}/gu) ?? []).length;
  return { names, malformed: braces !== names.size * 2 };
}
function compareSets(left: Set<string>, right: Set<string>): boolean { return left.size === right.size && [...left].every((item) => right.has(item)); }

export function validateRecord(candidate: unknown, options: ValidationOptions = {}): ValidationResult {
  const issues: ValidationIssue[] = [];
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(coreRecordJsonSchema);
  if (!validate(candidate)) for (const error of validate.errors ?? []) issues.push({ code: "SCHEMA", path: error.instancePath || "/", message: error.message ?? "schema violation" });
  if (issues.length) return { valid: false, issues };
  const record = candidate as CorpusRecord;
  if (options.schemaVersion && record.schemaVersion !== options.schemaVersion) issues.push({ code: "SCHEMA_VERSION", path: "/schemaVersion", message: `Expected ${options.schemaVersion}` });
  if (options.categories && !options.categories.includes(record.categorySlug)) issues.push({ code: "CATEGORY", path: "/categorySlug", message: "Category is not in the controlled taxonomy" });
  const expectedHash = contentHash(record);
  if (record.contentHash && record.contentHash !== expectedHash) issues.push({ code: "CONTENT_HASH", path: "/contentHash", message: "Derived content hash does not match normalized record" });
  const definitions = new Set(record.variableDefinitions.map((definition) => definition.name));
  if (definitions.size !== record.variableDefinitions.length) issues.push({ code: "VARIABLE_DUPLICATE", path: "/variableDefinitions", message: "Variable names must be unique" });
  for (const [path, value] of [["canonicalImagePrompt", record.canonicalImagePrompt], ["localizations.vi.promptTemplate", record.localizations.vi.promptTemplate], ["localizations.en.promptTemplate", record.localizations.en.promptTemplate]] as Array<[string, string]>) {
    const found = variables(value);
    if (found.malformed || !compareSets(found.names, definitions)) issues.push({ code: "PLACEHOLDER_ROUND_TRIP", path, message: "Placeholders must be well-formed and exactly match variableDefinitions" });
  }
  for (const [path, value] of textFields(record)) {
    if (value.includes("\uFFFD") || value !== value.normalize("NFC")) issues.push({ code: "UNICODE", path: `/${path}`, message: "Text must be valid NFC Unicode without replacement characters" });
  }
  if (options.requireVietnameseDiacritic && !/[\u00C0-\u1EF9]/u.test(record.localizations.vi.title + record.localizations.vi.summary + record.localizations.vi.promptTemplate)) issues.push({ code: "VI_LOCALE", path: "/localizations/vi", message: "Vietnamese localization lacks a Vietnamese-specific character" });
  for (const forbidden of options.forbiddenTerms ?? DEFAULT_FORBIDDEN) for (const [path, value] of textFields(record)) if (normalizeText(value).includes(normalizeText(forbidden))) issues.push({ code: "FORBIDDEN_TERM", path: `/${path}`, message: `Forbidden term matched: ${forbidden}` });
  return { valid: issues.length === 0, issues, contentHash: expectedHash };
}

export function validateCorpus(records: readonly CorpusRecord[], options: ValidationOptions = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = []; const keys = new Set<string>(); const slugs = new Set<string>(); const hashes = new Set<string>(); const counts = new Map<string, number>();
  for (const record of records) {
    for (const issue of validateRecord(record, options).issues) issues.push({ ...issue, path: `/${record.promptKey}${issue.path}` });
    for (const [set, value, code] of [[keys, record.promptKey, "PROMPT_KEY_DUPLICATE"], [slugs, record.slug, "SLUG_DUPLICATE"], [hashes, contentHash(record), "CONTENT_HASH_DUPLICATE"]] as const) { if (set.has(value)) issues.push({ code, path: `/${record.promptKey}`, message: `${value} is not unique` }); set.add(value); }
    counts.set(record.categorySlug, (counts.get(record.categorySlug) ?? 0) + 1);
  }
  applyQuotaPolicy(counts, options.quotaPolicy, issues); return issues;
}
function applyQuotaPolicy(counts: Map<string, number>, policy: QuotaPolicy | undefined, issues: ValidationIssue[]): void {
  if (!policy) return;
  for (const [category, quota] of Object.entries(policy.quotas)) { const count = counts.get(category) ?? 0; if (count > quota || (policy.requireExact && count !== quota)) issues.push({ code: "QUOTA", path: `/category/${category}`, message: `Expected ${policy.requireExact ? "exactly" : "at most"} ${quota}; got ${count}` }); }
  for (const category of counts.keys()) if (!(category in policy.quotas)) issues.push({ code: "QUOTA_CATEGORY", path: `/category/${category}`, message: "Category has no quota" });
}
