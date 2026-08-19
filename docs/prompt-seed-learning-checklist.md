# Prompt seed dataset — learning checklist

## Stage 1 — Scope and safety gate

- [x] Problem: the catalog needs a realistic bilingual synthetic dataset to test discovery, filters, detail pages, media delivery, moderation, and responsive layouts without exposing personal, paid, or production data.
- [x] Requested target: 1,000 records across 10 categories, with one generated image per record.
- [x] Active constraint: `APPROVE_BILLABLE_IMAGE_GENERATION=false`; therefore a full paid 1,000-image run is not authorized.
- [x] Chosen first step: generate exactly 20 dry-run metadata records, run structural/safety/duplicate checks, and publish an explicit full-run estimate. Do not substitute placeholders as generated images.
- [x] Database boundary: `db/schema.ts` maps only catalog primitives (`categories`, `prompts`, `prompt_media`), so canonical synthetic metadata remains JSONL and an adapter documents unmapped fields. No migration, database seed, Blob upload, or Production write is permitted.

## Stage 2 — Prompt corpus and dry run

- [x] Create a deterministic local-only runner and output the 20-record dry-run package at `test-data/prompt-seed-v1-chatgpt-v2-dry-run`.
- [x] Create a ChatGPT-authored prompt-only corpus of 1,000 bilingual records at `test-data/prompt-seed-v1-chatgpt-v2`.
- [x] Verify bilingual fields, ID/slug uniqueness, prompt word limits, safety scan, normalized-hash duplicate scan, and a lexical-similarity proxy. Result: 0 schema errors, 0 duplicate IDs/slugs/hashes, maximum lexical similarity 0.837.
- [x] Report zero API calls/images, pending image status, a 100-batch full-run plan, retry policy, and clearly labeled cost/time/storage assumptions.
- [x] Preserve the distinction between a lexical proxy and semantic evaluation: no semantic evaluator is available, so the report does not claim a semantic pass.

## Stage 3 — Full image execution (requires a new explicit approval)

- [ ] Receive `APPROVE_BILLABLE_IMAGE_GENERATION=true` and the approved model/provider, price basis, budget ceiling, and destination.
- [ ] Generate one distinct image per approved prompt, validate WebP magic bytes/decode/dimensions/SHA-256, create thumbnails, moderate, and retain retry/checkpoint evidence.
- [ ] Independently review the 1,000-record/1,000-image acceptance report before calling the dataset complete.

## Why this matters

The two-stage approach prevents an irreversible paid batch or a misleading test dataset. A prompt record may be structurally valid while its image is intentionally `pending`; that record cannot be represented as an approved/generated asset. Keeping this distinction protects catalog QA, billing integrity, and future media-import correctness.
