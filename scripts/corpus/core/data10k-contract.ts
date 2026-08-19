import Ajv2020 from "ajv/dist/2020.js";
import contractSchema from "../../../data/corpus/contracts/corpus-record.schema.v1.0.0.json";
import type { RecordValidator, ValidationResult } from "./types";

const ajv = new Ajv2020({ allErrors: true, strict: false });
ajv.addFormat("date-time", {
  type: "string",
  validate: (value: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u.test(value) && !Number.isNaN(Date.parse(value)),
});
const validateSchema = ajv.compile(contractSchema);

/**
 * Adapter for the architect-owned DATA10K record contract. It deliberately keeps
 * semantic scoring, pilot-calibrated dedupe, and generated-demo approval outside
 * this deterministic schema gate.
 */
export const validateData10kContractRecord: RecordValidator = (candidate): ValidationResult => {
  if (validateSchema(candidate)) {
    const record = candidate as { hashing?: { normalizedContentHash?: unknown } };
    return { valid: true, issues: [], contentHash: typeof record.hashing?.normalizedContentHash === "string" ? record.hashing.normalizedContentHash : undefined };
  }
  return {
    valid: false,
    issues: (validateSchema.errors ?? []).map((error) => ({
      code: "DATA10K_CONTRACT_SCHEMA",
      path: error.instancePath || "/",
      message: error.message ?? "DATA10K contract violation",
    })),
  };
};
