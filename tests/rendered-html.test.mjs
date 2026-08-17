import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the AliPrompt conversion experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="vi">/i);
  assert.match(html, /AliPrompt/);
  assert.match(html, /Từ biết hỏi/);
  assert.match(html, /Prompt Lab/);
  assert.match(html, /199\.000đ/);
  assert.match(html, /Gửi đăng ký/);
  assert.match(html, /\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps product metadata, D1 binding, and API contract in source", async () => {
  const [page, layout, component, packageJson, hosting, route] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/AliPromptExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../app/api/leads/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /generateMetadata/);
  assert.match(page, /x-forwarded-host/);
  assert.match(layout, /lang="vi"/);
  assert.match(component, /fetch\("\/api\/leads"/);
  assert.match(component, /Không nhập dữ liệu khách hàng/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.deepEqual(JSON.parse(hosting).d1, "DB");
  assert.match(route, /ALLOWED_STAGES/);
  assert.match(route, /payload\.consent !== true/);
});

