import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packRoot = path.resolve(scriptDir, "..");
const activeContractPath = path.join(packRoot, "product", "ACTIVE-PRODUCT-CONTRACT.md");
const catalogPath = path.join(packRoot, "skills", "catalog.yaml");

const requiredSections = [
  "Metadata",
  "Sprint envelope",
  "Problem and evidence",
  "Target actor and outcome",
  "Scope",
  "Non-scope",
  "Current behavior and constraints",
  "Required behavior",
  "Acceptance criteria",
  "Negative, permission, and edge cases",
  "Allowed write paths",
  "Required approvals",
  "Security, privacy, payment, and protected-content impact",
  "Analytics and observability impact",
  "Dependencies",
  "Test evidence required",
  "Migration, rollout, and rollback",
  "Risks, assumptions, and unresolved decisions",
  "Definition of Ready result"
];

const requiredMetadata = [
  "Status",
  "DRI",
  "Independent reviewer",
  "Human approver",
  "Risk level",
  "Parent product contract"
];

const envelopeFields = [
  "sprintId",
  "predecessorSprintId",
  "predecessorAcceptance",
  "applicableGates",
  "exitAcceptance",
  "evidenceRefs",
  "reviewerAcceptance"
];

const requiredNarrativeSections = [
  "Problem and evidence",
  "Target actor and outcome",
  "Scope",
  "Non-scope",
  "Current behavior and constraints",
  "Required behavior",
  "Negative, permission, and edge cases",
  "Security, privacy, payment, and protected-content impact",
  "Analytics and observability impact",
  "Dependencies",
  "Test evidence required",
  "Migration, rollout, and rollback",
  "Risks, assumptions, and unresolved decisions",
  "Definition of Ready result"
];

function section(content, title) {
  const marker = `## ${title}`;
  const start = content.indexOf(marker);
  if (start < 0) return "";
  const bodyStart = start + marker.length;
  const nextSection = content.indexOf("\n## ", bodyStart);
  return content.slice(bodyStart, nextSection < 0 ? undefined : nextSection).trim();
}

function activeContract() {
  const content = fs.readFileSync(activeContractPath, "utf8");
  const id = content.match(/`contract_id:\s*([^`]+)`/)?.[1]?.trim();
  const version = content.match(/`version:\s*([^`]+)`/)?.[1]?.trim();
  if (!id || !version) throw new Error("Cannot read contract_id/version from ACTIVE-PRODUCT-CONTRACT.md");
  return { id, version };
}

function isMeaningful(value) {
  const normalized = value.replace(/[`*_]/g, "").trim();
  return Boolean(normalized) && !/^(?:TBD|UNSET|\[[^\]]+\]|-|none|n\/a)$/i.test(normalized);
}

function listValues(content) {
  return content.split(/\r?\n/)
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.replace(/^-\s+/, "").trim());
}

function nonEmptyMetadata(content, label) {
  const line = content.match(new RegExp(`^- ${label}:\\s*(.+)$`, "m"))?.[1]?.trim();
  return isMeaningful(line ?? "");
}

function valueFor(content, field) {
  return content.match(new RegExp("^- `" + field + "`:\\s*(.+)$", "m"))?.[1]?.trim() ?? "";
}

function validate(content, source) {
  const errors = [];
  for (const title of requiredSections) {
    if (!new RegExp(`^## ${title.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*$`, "m").test(content)) {
      errors.push(`missing section: ${title}`);
    }
  }
  for (const title of requiredNarrativeSections) {
    if (!isMeaningful(section(content, title))) errors.push(`empty or placeholder section: ${title}`);
  }
  for (const label of requiredMetadata) {
    if (!nonEmptyMetadata(content, label)) errors.push(`missing or placeholder metadata: ${label}`);
  }
  for (const field of envelopeFields) {
    const value = valueFor(content, field);
    if (!isMeaningful(value)) errors.push(`missing or placeholder sprint field: ${field}`);
  }
  const acceptance = section(content, "Acceptance criteria");
  if (!/^1\.\s+\S+/m.test(acceptance)) errors.push("acceptance criteria needs at least one numbered item");
  const allowedPaths = section(content, "Allowed write paths");
  const allowedPathValues = listValues(allowedPaths);
  if (allowedPathValues.length === 0 || allowedPathValues.some((value) => !isMeaningful(value))) {
    errors.push("allowed write paths needs only concrete, non-placeholder paths");
  }
  const approvals = section(content, "Required approvals");
  const approvalValues = listValues(approvals);
  if (approvalValues.length === 0 || approvalValues.some((value) => !isMeaningful(value))) {
    errors.push("required approvals needs only explicit, non-placeholder decisions or a none-required rationale");
  }
  const dor = section(content, "Definition of Ready result");
  if (!/\bReady\b/i.test(dor)) errors.push("Definition of Ready result must explicitly state Ready or Not ready");

  const parent = activeContract();
  const parentLine = content.match(/^- Parent product contract:\s*(.+)$/m)?.[1] ?? "";
  if (!parentLine.includes(parent.id) || !parentLine.includes(`v${parent.version}`)) {
    errors.push(`parent product contract must reference ${parent.id} v${parent.version}`);
  }

  const sprintId = valueFor(content, "sprintId").replace(/`/g, "");
  const catalog = yaml.load(fs.readFileSync(catalogPath, "utf8"));
  const expected = catalog?.spec?.invocationContract?.sequence?.[sprintId];
  if (!expected) {
    errors.push(`unknown sprintId: ${sprintId || "(empty)"}`);
  } else {
    const predecessor = valueFor(content, "predecessorSprintId").replace(/`/g, "");
    const acceptanceLabel = valueFor(content, "predecessorAcceptance").replace(/`/g, "");
    const exitLabel = valueFor(content, "exitAcceptance").replace(/`/g, "");
    const gates = valueFor(content, "applicableGates").match(/G[0-7]/g) ?? [];
    const expectedPredecessor = expected.predecessor ?? "null";
    if (predecessor !== expectedPredecessor) errors.push(`predecessorSprintId must be ${expectedPredecessor} for ${sprintId}`);
    if (acceptanceLabel !== expected.predecessorAcceptance) errors.push(`predecessorAcceptance must be ${expected.predecessorAcceptance} for ${sprintId}`);
    if (exitLabel !== expected.exitAcceptance) errors.push(`exitAcceptance must be ${expected.exitAcceptance} for ${sprintId}`);
    if (JSON.stringify(gates) !== JSON.stringify(expected.applicableGates)) errors.push(`applicableGates must be ${expected.applicableGates.join(", ")} for ${sprintId}`);
  }

  return errors.map((error) => `${source}: ${error}`);
}

function selfTest() {
  const parent = activeContract();
  const validFixture = `# TASK-FIXTURE — Validator fixture

## Metadata

- Status: Ready
- DRI: product-owner
- Independent reviewer: qa-release-reviewer
- Human approver: ALIPROMPT human owner
- Risk level: Low
- Parent product contract: ${parent.id} v${parent.version}

## Sprint envelope

- \`sprintId\`: \`S0\`
- \`predecessorSprintId\`: \`null\`
- \`predecessorAcceptance\`: \`START\`
- \`applicableGates\`: \`G0\`, \`G1\`
- \`exitAcceptance\`: \`S0_ACCEPTED\`
- \`evidenceRefs\`: local command output
- \`reviewerAcceptance\`: independent review pending

## Problem and evidence

Fixture evidence.

## Target actor and outcome

Fixture outcome.

## Scope

Fixture scope.

## Non-scope

Fixture non-scope.

## Current behavior and constraints

Fixture constraints.

## Required behavior

Fixture behavior.

## Acceptance criteria

1. Fixture acceptance.

## Negative, permission, and edge cases

Fixture negative case.

## Allowed write paths

- \`agent-pack/tasks/**\`

## Required approvals

- No additional approval is required for this fixture.

## Security, privacy, payment, and protected-content impact

No sensitive impact.

## Analytics and observability impact

No analytics impact.

## Dependencies

Existing repository files.

## Test evidence required

Validator self-test.

## Migration, rollout, and rollback

No migration.

## Risks, assumptions, and unresolved decisions

Low risk fixture.

## Definition of Ready result

Ready for fixture validation.
`;
  if (validate(validFixture, "in-memory-valid-fixture").length !== 0) throw new Error("self-test failed: valid fixture was rejected");
  const missingSections = validate("# TASK-BAD\n\n## Metadata\n", "in-memory-missing-fixture");
  const placeholderScope = validate(validFixture.replace("Fixture scope.", "TBD"), "in-memory-placeholder-scope");
  const placeholderPath = validate(validFixture.replace("`agent-pack/tasks/**`", "`TBD`"), "in-memory-placeholder-path");
  const placeholderApproval = validate(validFixture.replace("No additional approval is required for this fixture.", "TBD"), "in-memory-placeholder-approval");
  if ([missingSections, placeholderScope, placeholderPath, placeholderApproval].some((errors) => errors.length === 0)) {
    throw new Error("self-test failed: an invalid fixture was accepted");
  }
  console.log(`SELF-TEST PASS: rejected missing sections, placeholder scope, placeholder path, and placeholder approval`);
}

const args = process.argv.slice(2);
if (args.includes("--self-test")) selfTest();
const all = args.includes("--all");
const fileArg = args.find((arg) => !arg.startsWith("--"));
const files = all
  ? fs.readdirSync(path.join(packRoot, "tasks")).filter((name) => name.endsWith(".md")).map((name) => path.join(packRoot, "tasks", name))
  : fileArg ? [path.resolve(process.cwd(), fileArg)] : [];

if (files.length === 0) {
  if (!args.includes("--self-test")) console.error("Usage: node agent-pack/scripts/validate-task-contract.mjs <task.md> | --all [--self-test]");
  process.exit(args.includes("--self-test") ? 0 : 2);
}

const failures = files.flatMap((file) => validate(fs.readFileSync(file, "utf8"), path.relative(process.cwd(), file)));
if (failures.length > 0) {
  console.error("TASK CONTRACT INVALID");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
for (const file of files) console.log(`TASK CONTRACT PASS: ${path.relative(process.cwd(), file)}`);
