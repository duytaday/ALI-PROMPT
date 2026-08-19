import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const MAX_AGE_MS = 20 * 60 * 1000;

function secret() {
  const configured = process.env.SUBMISSION_CAPTCHA_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "aliprompt-local-submission-captcha-only";
  throw new Error("SUBMISSION_CAPTCHA_SECRET is required for public submissions.");
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSubmissionCaptcha() {
  const left = randomInt(3, 10);
  const right = randomInt(2, 10);
  const issuedAt = Date.now();
  const payload = `${left}.${right}.${issuedAt}`;
  return { question: `${left} + ${right} = ?`, token: `${payload}.${signature(payload)}` };
}

export function verifySubmissionCaptcha(token: unknown, answer: unknown, now = Date.now()) {
  if (typeof token !== "string" || typeof answer !== "string") return false;
  const [leftRaw, rightRaw, issuedAtRaw, providedSignature, ...extra] = token.split(".");
  if (extra.length || !leftRaw || !rightRaw || !issuedAtRaw || !providedSignature) return false;
  const payload = `${leftRaw}.${rightRaw}.${issuedAtRaw}`;
  const expectedSignature = signature(payload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;
  const left = Number(leftRaw);
  const right = Number(rightRaw);
  const issuedAt = Number(issuedAtRaw);
  const submitted = Number(answer.trim());
  return Number.isInteger(left) && Number.isInteger(right) && Number.isFinite(issuedAt)
    && now >= issuedAt && now - issuedAt <= MAX_AGE_MS && Number.isInteger(submitted) && submitted === left + right;
}
