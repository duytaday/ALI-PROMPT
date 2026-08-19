import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Ajv2020 = require("ajv/dist/2020");
const contractDirectory = path.dirname(fileURLToPath(import.meta.url));

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(contractDirectory, relativePath), "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizedValue(value) {
  if (Array.isArray(value)) return value.map(normalizedValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizedValue(value[key])]),
    );
  }
  if (typeof value !== "string") return value;
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .trim()
    .replace(/[\t \f\v]+/g, " ");
}

function normalizedContentHash(record) {
  const projection = {
    schemaVersion: record.schemaVersion,
    promptKey: record.promptKey,
    categorySlug: record.categorySlug,
    promptVersion: record.promptVersion,
    localizations: record.localizations,
    canonicalImagePrompt: record.canonicalImagePrompt,
    variableDefinitions: record.variableDefinitions,
    usageMetadata: record.usageMetadata,
    designMetadata: record.designMetadata,
  };
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(normalizedValue(projection)), "utf8")
    .digest("hex");
}

function placeholderNames(template) {
  return [...template.matchAll(/\{\{([a-z][a-zA-Z0-9]{1,39})\}\}/g)].map((match) => match[1]);
}

function renderTemplate(template, values) {
  return template.replace(/\{\{([a-z][a-zA-Z0-9]{1,39})\}\}/g, (_, name) => String(values[name]));
}

const recordSchema = readJson("corpus-record.schema.v1.0.0.json");
const manifestSchema = readJson("corpus-manifest.schema.v1.0.0.json");
const taxonomy = readJson("taxonomy.v1.0.0.json");
const reasonCodeContract = readJson("reason-codes.v1.0.0.json");
const samplePaths = [
  "samples/packaging-herbal-infusion-refill.v1.0.0.json",
  "samples/motion-storyboard-modular-object.v1.0.0.json",
];
const samples = samplePaths.map((samplePath) => ({ samplePath, record: readJson(samplePath) }));

const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
ajv.addFormat("date-time", {
  type: "string",
  validate: (value) =>
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    !Number.isNaN(Date.parse(value)),
});
const validateRecord = ajv.compile(recordSchema);
ajv.compile(manifestSchema);

const categories = taxonomy.categories;
assert(categories.length === 25, `Expected 25 categories, received ${categories.length}`);
assert(new Set(categories.map(({ slug }) => slug)).size === 25, "Category slugs must be unique");
assert(categories.every(({ canonicalQuota }) => canonicalQuota === 400), "Every category quota must be 400");
assert(categories.reduce((total, category) => total + category.canonicalQuota, 0) === 10_000, "Category quotas must sum to 10,000");
assert(categories.every(({ useCaseFamilies }) => useCaseFamilies.length === 5), "Every category must have five use-case families");
assert(Object.values(taxonomy.commonDistribution.complexity).reduce((a, b) => a + b, 0) === 400, "Complexity allocation must sum to 400");
assert(Object.values(taxonomy.commonDistribution.aspectRatioBands).reduce((a, b) => a + b, 0) === 400, "Aspect-ratio allocation must sum to 400");
assert(taxonomy.commonDistribution.localeCoverage.vi === 400 && taxonomy.commonDistribution.localeCoverage.en === 400, "Each category must cover VI and EN for all 400 keys");

const taxonomySlugs = categories.map(({ slug }) => slug).sort();
const schemaSlugs = [...recordSchema.$defs.categorySlug.enum].sort();
assert(JSON.stringify(taxonomySlugs) === JSON.stringify(schemaSlugs), "Taxonomy and record-schema categories differ");

const reasonCodes = reasonCodeContract.reasonCodes.map(({ code }) => code);
const reasonCodeSet = new Set(reasonCodes);
assert(reasonCodeSet.size === reasonCodes.length, "Reason codes must be unique");

for (const { samplePath, record } of samples) {
  assert(validateRecord(record), `${samplePath} failed JSON Schema: ${ajv.errorsText(validateRecord.errors, { separator: " | " })}`);

  const definitions = record.variableDefinitions.map(({ name }) => name).sort();
  assert(new Set(definitions).size === definitions.length, `${samplePath} has duplicate variable names`);
  assert(
    record.variableDefinitions.every(({ name, placeholder }) => placeholder === `{{${name}}}`),
    `${samplePath} has a non-exact placeholder mapping`,
  );

  const templates = [
    record.canonicalImagePrompt,
    record.localizations.vi.promptTemplate,
    record.localizations.en.promptTemplate,
  ];
  for (const template of templates) {
    const templateSet = [...new Set(placeholderNames(template))].sort();
    assert(JSON.stringify(templateSet) === JSON.stringify(definitions), `${samplePath} has a placeholder-set mismatch`);
    assert(!/{{[^{}]+}}/.test(renderTemplate(template, record.demoImage.canonicalVariables)), `${samplePath} leaves an unresolved placeholder after demo rendering`);
  }

  assert(
    JSON.stringify(Object.keys(record.demoImage.canonicalVariables).sort()) === JSON.stringify(definitions),
    `${samplePath} demo-variable keys differ from definitions`,
  );
  for (const definition of record.variableDefinitions) {
    const demoValue = record.demoImage.canonicalVariables[definition.name];
    assert(Object.is(demoValue, definition.demoValue), `${samplePath} demo value differs for ${definition.name}`);
    if (definition.allowedValues) {
      assert(definition.allowedValues.includes(definition.default), `${samplePath} default is outside allowedValues for ${definition.name}`);
      assert(definition.allowedValues.includes(definition.demoValue), `${samplePath} demoValue is outside allowedValues for ${definition.name}`);
    }
    if (definition.type === "integer") {
      assert(Number.isInteger(definition.default) && Number.isInteger(definition.demoValue), `${samplePath} integer variable has non-integer values`);
    }
    if (definition.minimum !== undefined) assert(definition.demoValue >= definition.minimum, `${samplePath} demoValue is below minimum`);
    if (definition.maximum !== undefined) assert(definition.demoValue <= definition.maximum, `${samplePath} demoValue is above maximum`);
  }

  assert(normalizedContentHash(record) === record.hashing.normalizedContentHash, `${samplePath} normalized content hash differs`);
  const usedReasonCodes = [...record.safetyTaxonomy.reasonCodes, ...record.qualityResults.semantic.reasonCodes];
  assert(usedReasonCodes.every((code) => reasonCodeSet.has(code)), `${samplePath} uses an unknown reason code`);
}

assert(new Set(samples.map(({ record }) => record.promptKey)).size === samples.length, "Sample prompt keys collide");
assert(new Set(samples.map(({ record }) => record.slug)).size === samples.length, "Sample slugs collide");
assert(new Set(samples.map(({ record }) => record.hashing.normalizedContentHash)).size === samples.length, "Sample content hashes collide");

const invalidAcceptedPlaceholder = structuredClone(samples[0].record);
invalidAcceptedPlaceholder.lifecycleState = "accepted";
assert(!validateRecord(invalidAcceptedPlaceholder), "An accepted record must not validate with only a placeholder cover");

console.log("PASS schemas compiled: 2");
console.log("PASS sample records schema-valid: 2");
console.log("PASS taxonomy categories: 25; quota sum: 10000; each: 400");
console.log("PASS common complexity/ratio distributions: 400 each/category");
console.log(`PASS reason codes unique: ${reasonCodes.length}`);
console.log("PASS placeholder set + round trip + exact demo mapping: 2/2");
console.log("PASS normalized SHA-256 recomputation + sample identity uniqueness: 2/2");
console.log("PASS negative control: accepted lifecycle rejects placeholder_cover");
