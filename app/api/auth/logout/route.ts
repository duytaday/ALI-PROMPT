import { NextRequest } from "next/server";
import { destroyCurrentSession, expiredSessionCookie } from "../../../../lib/auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  await destroyCurrentSession();
  const response = noStoreJson({ ok: true });
  response.headers.append("Set-Cookie", expiredSessionCookie());
  return response;
}
