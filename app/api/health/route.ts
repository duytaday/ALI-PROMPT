export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
};

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "aliprompt-web",
      checkedAt: new Date().toISOString(),
    },
    { status: 200, headers: NO_STORE_HEADERS },
  );
}
