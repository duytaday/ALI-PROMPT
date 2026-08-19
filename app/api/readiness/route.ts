import { getPlatformReadiness } from "@/lib/platform/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
};

export async function GET() {
  const readiness = await getPlatformReadiness();
  return Response.json(readiness, {
    status: readiness.status === "ready" ? 200 : 503,
    headers: NO_STORE_HEADERS,
  });
}
