import type { RuntimeEnvironmentInspection } from "./runtime-env";

export type ReadinessCheckStatus = "pass" | "fail" | "skipped";

export interface ReadinessCheck {
  name: "configuration" | "database" | "blob";
  status: ReadinessCheckStatus;
  code: string;
}

export interface PlatformReadiness {
  status: "ready" | "not_ready";
  environment: RuntimeEnvironmentInspection["environment"];
  checkedAt: string;
  checks: ReadinessCheck[];
  configurationIssues: RuntimeEnvironmentInspection["issues"];
}

interface ReadinessInput {
  inspection: RuntimeEnvironmentInspection;
  databaseUrl: string | undefined;
  probeDatabase: (databaseUrl: string, timeoutMs: number) => Promise<void>;
  probeBlob: (timeoutMs: number) => Promise<void>;
  timeoutMs?: number;
  now?: () => Date;
}

class ReadinessTimeoutError extends Error {}

async function withTimeout<T>(work: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new ReadinessTimeoutError()), timeoutMs);
  });

  try {
    return await Promise.race([work, deadline]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

/** Runs dependency checks and emits only allowlisted status codes. */
export async function evaluatePlatformReadiness({
  inspection,
  databaseUrl,
  probeDatabase,
  probeBlob,
  timeoutMs = 2_000,
  now = () => new Date(),
}: ReadinessInput): Promise<PlatformReadiness> {
  const checks: ReadinessCheck[] = [];

  if (!inspection.ok || !databaseUrl) {
    checks.push({ name: "configuration", status: "fail", code: "configuration_invalid" });
    checks.push({ name: "database", status: "skipped", code: "configuration_invalid" });
    checks.push({ name: "blob", status: "skipped", code: "configuration_invalid" });

    return {
      status: "not_ready",
      environment: inspection.environment,
      checkedAt: now().toISOString(),
      checks,
      configurationIssues: inspection.issues,
    };
  }

  checks.push({ name: "configuration", status: "pass", code: "configuration_valid" });

  try {
    await withTimeout(probeDatabase(databaseUrl, timeoutMs), timeoutMs);
    checks.push({ name: "database", status: "pass", code: "database_reachable" });
  } catch {
    checks.push({ name: "database", status: "fail", code: "database_unavailable" });
  }

  try {
    await withTimeout(probeBlob(timeoutMs), timeoutMs);
    checks.push({ name: "blob", status: "pass", code: "blob_reachable" });
  } catch {
    checks.push({ name: "blob", status: "fail", code: "blob_unavailable" });
  }

  return {
    status: checks.every((check) => check.status === "pass") ? "ready" : "not_ready",
    environment: inspection.environment,
    checkedAt: now().toISOString(),
    checks,
    configurationIssues: [],
  };
}
