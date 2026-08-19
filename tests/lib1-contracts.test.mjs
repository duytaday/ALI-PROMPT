import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("LIB1 stores only private workspace metadata and owner-scoped notes", async () => {
  const [schema, collections, items, usage, notes, panel, workspace] = await Promise.all([
    source("db/schema.ts"),
    source("app/api/library/collections/route.ts"),
    source("app/api/library/collections/[collectionId]/items/[promptId]/route.ts"),
    source("app/api/library/usage/route.ts"),
    source("app/api/library/notes/[promptId]/route.ts"),
    source("app/_components/PromptUsePanel.tsx"),
    source("lib/prompt-workspace.ts"),
  ]);
  assert.match(schema, /prompt_collections/);
  assert.match(schema, /prompt_collection_items_collection_prompt_unique/);
  assert.match(schema, /prompt_usage_events_owner_idempotency_unique/);
  assert.match(schema, /prompt_notes_owner_prompt_unique/);
  assert.match(collections, /eq\(promptCollections\.userId, user\.id\)/);
  assert.match(items, /getOwnedCollection\(collectionId\.data, context\.user\.id\)/);
  assert.match(schema, /onDelete: "cascade"/);
  assert.match(usage, /idempotencyKey/);
  assert.match(usage, /getUsableWorkspacePrompt/);
  assert.doesNotMatch(usage, /promptVersions\.body|prompts\.body/);
  assert.match(notes, /eq\(promptNotes\.userId, user\.id\)/);
  assert.match(workspace, /max\(2_000\)/);
  assert.doesNotMatch(notes, /dangerouslySetInnerHTML|prompts\.body/);
  assert.match(panel, /await navigator\.clipboard\.writeText\(copyText\)/);
  assert.match(panel, /fetch\("\/api\/library\/usage"/);
  assert.match(panel, /crypto\.randomUUID\(\)/);
});

test("LIB1 keeps private lists bounded, no-store, and unavailable prompts body-free", async () => {
  const [collectionPage, recentPage, readiness, workspace] = await Promise.all([
    source("app/library/collections/page.tsx"),
    source("app/library/recent/page.tsx"),
    source("lib/request-security.ts"),
    source("lib/prompt-workspace.ts"),
  ]);
  assert.match(collectionPage, /\.limit\(50\)/);
  assert.match(collectionPage, /\.limit\(500\)/);
  assert.match(collectionPage, /moderationStatus, "approved"/);
  assert.match(recentPage, /\.limit\(20\)/);
  assert.match(recentPage, /promptUsageEvents\.userId, user\.id/);
  assert.match(readiness, /Cache-Control": "no-store/);
  assert.doesNotMatch(workspace, /prompts\.body|promptVersions\.body/);
});
