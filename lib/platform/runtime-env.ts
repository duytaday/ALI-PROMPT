export const PLATFORM_ENVIRONMENTS = ["development", "preview", "production"] as const;

export type PlatformEnvironment = (typeof PLATFORM_ENVIRONMENTS)[number];

export type RuntimeEnvironmentIssueCode =
  | "missing_vercel_environment"
  | "invalid_vercel_environment"
  | "missing_application_environment"
  | "invalid_application_environment"
  | "application_environment_mismatch"
  | "non_development_environment_outside_vercel"
  | "missing_application_url"
  | "invalid_application_url"
  | "missing_database_url"
  | "invalid_database_url"
  | "missing_database_environment"
  | "invalid_database_environment"
  | "database_environment_mismatch"
  | "missing_blob_token"
  | "invalid_blob_token"
  | "missing_blob_environment"
  | "invalid_blob_environment"
  | "blob_environment_mismatch";

export interface RuntimeEnvironmentIssue {
  code: RuntimeEnvironmentIssueCode;
  variable: string;
}

interface SafeResourceState {
  configured: boolean;
  environment: PlatformEnvironment | null;
}

export interface RuntimeEnvironmentInspection {
  ok: boolean;
  provider: "local" | "vercel";
  environment: PlatformEnvironment;
  resources: {
    database: SafeResourceState;
    blob: SafeResourceState;
  };
  issues: RuntimeEnvironmentIssue[];
}

type EnvironmentInput = Record<string, string | undefined>;

function normalized(value: string | undefined) {
  const candidate = value?.trim();
  return candidate ? candidate : undefined;
}

function parsePlatformEnvironment(value: string | undefined): PlatformEnvironment | undefined {
  const candidate = normalized(value);
  return PLATFORM_ENVIRONMENTS.find((environment) => environment === candidate);
}

function isPostgresUrl(value: string) {
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "postgres:" || parsed.protocol === "postgresql:") &&
      Boolean(parsed.hostname) &&
      parsed.pathname.length > 1
    );
  } catch {
    return false;
  }
}

function isApplicationUrl(value: string, requireHttps: boolean) {
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "https:" || (!requireHttps && parsed.protocol === "http:")) &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password &&
      (parsed.pathname === "/" || parsed.pathname === "") &&
      !parsed.search &&
      !parsed.hash
    );
  } catch {
    return false;
  }
}

function isPlaceholder(value: string) {
  return /^(?:change[-_ ]?me|replace[-_ ]?with.*|example|placeholder|todo|<.+>)$/i.test(
    value.trim(),
  );
}

function inspectResourceEnvironment(
  issues: RuntimeEnvironmentIssue[],
  input: EnvironmentInput,
  variable: "ALIPROMPT_DATABASE_ENVIRONMENT" | "ALIPROMPT_BLOB_ENVIRONMENT",
  expected: PlatformEnvironment,
) {
  const raw = normalized(input[variable]);
  const resourceEnvironment = parsePlatformEnvironment(raw);
  const databaseResource = variable === "ALIPROMPT_DATABASE_ENVIRONMENT";

  if (!raw) {
    issues.push({
      code: databaseResource ? "missing_database_environment" : "missing_blob_environment",
      variable,
    });
  } else if (!resourceEnvironment) {
    issues.push({
      code: databaseResource ? "invalid_database_environment" : "invalid_blob_environment",
      variable,
    });
  } else if (resourceEnvironment !== expected) {
    issues.push({
      code: databaseResource ? "database_environment_mismatch" : "blob_environment_mismatch",
      variable,
    });
  }

  return resourceEnvironment ?? null;
}

/**
 * Validates platform configuration without returning credential values.
 * Resource tags stop a valid Preview credential from silently targeting
 * Production data.
 */
export function inspectRuntimeEnvironment(
  input: EnvironmentInput = process.env,
): RuntimeEnvironmentInspection {
  const issues: RuntimeEnvironmentIssue[] = [];
  const rawVercelEnvironment = normalized(input.VERCEL_ENV);
  const vercelEnvironment = parsePlatformEnvironment(rawVercelEnvironment);
  const rawApplicationEnvironment = normalized(input.ALIPROMPT_ENVIRONMENT);
  const applicationEnvironment = parsePlatformEnvironment(rawApplicationEnvironment);
  const provider = input.VERCEL === "1" || Boolean(rawVercelEnvironment) ? "vercel" : "local";
  const environment = vercelEnvironment ?? applicationEnvironment ?? "development";

  if (provider === "vercel" && !rawVercelEnvironment) {
    issues.push({ code: "missing_vercel_environment", variable: "VERCEL_ENV" });
  } else if (rawVercelEnvironment && !vercelEnvironment) {
    issues.push({ code: "invalid_vercel_environment", variable: "VERCEL_ENV" });
  }

  if (provider === "vercel" && !rawApplicationEnvironment) {
    issues.push({
      code: "missing_application_environment",
      variable: "ALIPROMPT_ENVIRONMENT",
    });
  } else if (rawApplicationEnvironment && !applicationEnvironment) {
    issues.push({
      code: "invalid_application_environment",
      variable: "ALIPROMPT_ENVIRONMENT",
    });
  } else if (applicationEnvironment && applicationEnvironment !== environment) {
    issues.push({
      code: "application_environment_mismatch",
      variable: "ALIPROMPT_ENVIRONMENT",
    });
  }

  if (provider === "local" && applicationEnvironment && applicationEnvironment !== "development") {
    issues.push({
      code: "non_development_environment_outside_vercel",
      variable: "ALIPROMPT_ENVIRONMENT",
    });
  }

  const applicationUrl = normalized(input.ALIPROMPT_APP_URL);
  if (!applicationUrl) {
    issues.push({ code: "missing_application_url", variable: "ALIPROMPT_APP_URL" });
  } else if (!isApplicationUrl(applicationUrl, environment !== "development")) {
    issues.push({ code: "invalid_application_url", variable: "ALIPROMPT_APP_URL" });
  }

  const databaseUrl = normalized(input.POSTGRES_URL);
  if (!databaseUrl) {
    issues.push({ code: "missing_database_url", variable: "POSTGRES_URL" });
  } else if (!isPostgresUrl(databaseUrl)) {
    issues.push({ code: "invalid_database_url", variable: "POSTGRES_URL" });
  }

  const blobToken = normalized(input.BLOB_READ_WRITE_TOKEN);
  if (!blobToken) {
    issues.push({ code: "missing_blob_token", variable: "BLOB_READ_WRITE_TOKEN" });
  } else if (blobToken.length < 24 || isPlaceholder(blobToken)) {
    issues.push({ code: "invalid_blob_token", variable: "BLOB_READ_WRITE_TOKEN" });
  }

  const databaseEnvironment = inspectResourceEnvironment(
    issues,
    input,
    "ALIPROMPT_DATABASE_ENVIRONMENT",
    environment,
  );
  const blobEnvironment = inspectResourceEnvironment(
    issues,
    input,
    "ALIPROMPT_BLOB_ENVIRONMENT",
    environment,
  );

  return {
    ok: issues.length === 0,
    provider,
    environment,
    resources: {
      database: { configured: Boolean(databaseUrl), environment: databaseEnvironment },
      blob: { configured: Boolean(blobToken), environment: blobEnvironment },
    },
    issues,
  };
}
