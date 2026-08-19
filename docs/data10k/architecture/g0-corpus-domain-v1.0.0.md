# DATA10K G0 corpus domain contract v1.0.0

Status: architecture candidate only. No database migration, import, Blob upload, paid call, or Production action is authorized by this document.

## Verified repository baseline

The 2026-08-19 local schema currently provides:

- `prompts`: unique `slug`; one `title`, `summary`, and `body`; `content_language` allows `vi`, `en`, or `multilingual`; no stable corpus key; `source_kind` allows only `aliprompt` or `community`.
- `prompt_versions`: unique `(prompt_id, version)`; one `body`; JSONB `variable_definitions`, `usage_metadata`, and optional `output_schema`; no localization relation or design/provenance contract.
- `prompt_media`: one `alt_text`, Blob key, state, bytes, MIME, and prompt relation; no prompt-version link, image-generation receipt, image hash, dimensions, or localized alt text.

This is adequate for the current catalog but cannot truthfully represent versioned VI/EN bodies and generated-media lineage for DATA10K without additive storage. G0 therefore defines a provider-neutral artifact contract and recommendations only.

## Domain model

```text
CorpusRun 1 ── * CorpusItemReceipt * ── 1 CanonicalPrompt
                                               │
                                               ├── * PromptVersion
                                               │       ├── 2 VersionLocalization (vi, en)
                                               │       ├── 1 Design/Usage/Variable contract
                                               │       └── * QualityReceipt
                                               │
                                               └── * DemoImageReceipt ── 1 SanitizedMedia
```

- `CanonicalPrompt` owns stable identity (`promptKey`, `slug`, category) and is the only counting unit.
- `PromptVersion` freezes the provider-neutral prompt, variables, design metadata, safety state, and normalized hash.
- `VersionLocalization` stores a natural title, summary, instructions, and prompt template for exactly one locale. Both `vi` and `en` are required for acceptance.
- `DemoImageReceipt` links the exact prompt version and canonical variable set to one image attempt. `placeholder_cover` is explicit missing-work state and never satisfies a generated-demo gate.
- `CorpusRun` and item receipts make generation, validation, import, reconciliation, and rollback resumable and auditable.

## Canonical count rule

For an accepted run `R`:

```text
canonical_count(R) = count(distinct promptKey where state = accepted)
locale_coverage(R, locale) = count(distinct promptKey with a valid localization for locale)
```

Acceptance requires `canonical_count = locale_coverage(vi) = locale_coverage(en)`. Localization rows are attributes and never add to `canonical_count`.

Example: 400 accepted keys in `packaging-design` produce 800 localization rows (400 VI + 400 EN), but the category count remains 400. Across 25 categories, 10,000 keys produce 20,000 localization rows and still count as exactly 10,000 canonical prompts.

Raw candidates, rejected items, held items, translations, prompt versions, image attempts, placeholders, and regenerated demos never increment the canonical accepted count.

## Contract files

- `data/corpus/contracts/corpus-record.schema.v1.0.0.json`: one complete canonical artifact record.
- `data/corpus/contracts/corpus-manifest.schema.v1.0.0.json`: immutable run summary and artifact hash contract.
- `data/corpus/contracts/taxonomy.v1.0.0.json`: controlled categories, quotas, and anti-padding axes.
- `data/corpus/contracts/reason-codes.v1.0.0.json`: stable rejection/hold/remediation vocabulary.
- `data/corpus/contracts/samples/*.v1.0.0.json`: two clean-room, schema-valid references.

Semver rules:

- Patch: documentation or non-semantic clarification; existing valid records remain valid.
- Minor: additive optional fields/enums; old records remain valid under their declared schema.
- Major: changed required fields, counting semantics, normalization projection, or incompatible enum/shape changes.
- Every record declares `schemaVersion`; validators route by exact version and must never silently coerce an unknown version.

## Placeholder contract

Placeholders use exact `{{camelCaseName}}` form. For every record, deterministic validation must enforce:

1. `placeholder === "{{" + name + "}}"` for every definition.
2. Variable names are unique.
3. The extracted placeholder set from `canonicalImagePrompt`, `localizations.vi.promptTemplate`, and `localizations.en.promptTemplate` is exactly the variable-definition name set.
4. No placeholder may appear only in one locale; localization may change sentence structure but not control semantics.
5. `default`, `demoValue`, examples, enum values, and numeric bounds match the declared type.
6. `demoImage.canonicalVariables` has exactly the definition keys and uses each `demoValue` for the reference generation fixture.
7. Rendering a template with the demo map leaves no `{{...}}` token, introduces no extra key, and is deterministic under Unicode NFC.

The JSON Schema checks syntax and structural presence. Equality, type-specific values, and round-trip checks are application-level deterministic invariants because JSON Schema cannot conveniently compare placeholder strings across three templates.

## Normalized content hash

`data10k-normalize-v1` uses the following immutable projection, in this order of meaning:

```text
schemaVersion, promptKey, categorySlug, promptVersion,
localizations, canonicalImagePrompt, variableDefinitions,
usageMetadata, designMetadata
```

Normalization algorithm:

1. Recursively sort object keys lexicographically; preserve array order.
2. Normalize every string to Unicode NFC, convert CRLF/CR to LF, trim outer whitespace, and collapse horizontal whitespace runs to one ASCII space. Do not lowercase content.
3. Serialize as compact UTF-8 JSON with JSON number/boolean/null semantics and no trailing newline.
4. Store lowercase hex `SHA-256(serialized_projection)`.

The projection excludes lifecycle state, quality verdict, reviewer identity, media, and the hash itself, so deterministic validation/review does not mutate prompt identity. A content change requires a new `promptVersion` and a new hash. Exact dedupe is zero-tolerance on this hash. Semantic cluster membership is separate and pilot-calibrated.

## Additive persistence recommendation (non-binding)

The migration owner should verify naming, retention, and row-level-security policy before any DDL. One compatible shape is:

1. Add nullable `prompt_key` to `prompts`, backfill DATA10K rows only, then create a partial unique index. Existing human/community prompts stay unchanged. If `source_kind = generated` is desired, expand its check constraint through an explicitly reviewed migration; do not overload `community`.
2. Add `prompt_version_localizations(prompt_version_id, locale, title, summary, usage_instructions, prompt_template, content_hash, created_at)` with unique `(prompt_version_id, locale)` and locale check `vi/en`.
3. Add `prompt_version_metadata(prompt_version_id, schema_version, category_slug, canonical_image_prompt, design_metadata, model_compatibility, safety_taxonomy, provenance, normalized_content_hash, dedupe_cluster)` with a unique one-to-one version relation.
4. Add `corpus_runs(run_id, contract_versions, environment, state, immutable_manifest_hash, approvals, counters, timestamps)` and `corpus_item_receipts(run_id, prompt_key, prompt_version, state, hashes, failure_reason_codes, prompt_id, prompt_version_id, timestamps)`.
5. Add `prompt_media_provenance(prompt_media_id, prompt_version_id, run_id, kind, canonical_variables, generation_prompt_hash, provider, model, snapshot, parameters, attempt, generated_at, width, height, sha256, perceptual_hash, sanitization_receipt)`.
6. Add `prompt_media_localizations(prompt_media_id, locale, alt_text)` unique on `(prompt_media_id, locale)`. The legacy `prompt_media.alt_text` can remain a compatibility projection during rollout.

Recommended indexes, subject to `EXPLAIN (ANALYZE, BUFFERS)` on representative Preview data:

- Unique partial `prompts(prompt_key) WHERE prompt_key IS NOT NULL`.
- Unique `prompt_version_localizations(prompt_version_id, locale)` and lookup `(locale, prompt_version_id)`.
- Unique `prompt_version_metadata(normalized_content_hash)` for exact dedupe and index `dedupe_cluster` for review routing.
- Unique `corpus_item_receipts(run_id, prompt_key, prompt_version)` plus `(run_id, state, prompt_key)` for resume/reconcile/rollback.
- Unique `prompt_media_provenance(prompt_media_id)` and idempotency index `(run_id, prompt_version_id, generation_prompt_hash, attempt)`.
- Unique `prompt_media_localizations(prompt_media_id, locale)`.
- Catalog pagination should use a stable keyset such as `(published_at, id)` or the approved product ordering, never unbounded offset scans. Search indexes and extensions must be justified by actual query plans; G0 does not prescribe `pg_trgm` or full-text configuration without evidence.

Do not put the 10,000 records in `db/seed.ts`. Large JSONL and media stay in the approved artifact boundary; Git contains contracts, compact manifests, hashes, code, and evidence only.

## Import state and rollback recommendation

- External writes require isolated Preview proof, immutable manifest hash, and the exact gate approval. Production remains denied.
- Upsert identity is stable `(promptKey, promptVersion)` and may update only rows owned by the same DATA10K run/receipt. Never overwrite a pre-existing prompt matched only by slug or title.
- Initial records are free and `draft`/`pending`, `publishedAt = null`, and all engagement counters are zero. They must not create users, contributors, reviews, favorites, purchases, attempts, products, prices, orders, or north-star metrics.
- Link media only after `generated_demo` passes sanitization and its version/hash relation reconciles. A `placeholder_cover` remains visible only as explicit incomplete state and cannot satisfy G1/G2/G3.
- Rollback selects receipts by exact `run_id`, verifies ownership, detaches/deletes only media and prompt rows created by that run, records every affected ID/key/hash, and leaves pre-existing/user/commerce rows untouched. Blob deletion is driven from owned media receipts and produces tombstones/orphan-cleanup evidence.
- Reconciliation compares manifest key sets, versions, content hashes, localization coverage, media hashes/links, moderation state, and run receipts. Any mismatch keeps the gate failed.

## Decisions fixed at v1.0.0

- Exactly 25 controlled categories and 400 accepted canonical keys per category.
- Exactly `vi` and `en` localization objects per accepted key; one canonical count.
- Provider-neutral canonical prompt and additive localized prompt templates.
- Compatibility is `Unknown` unless a reviewed manifest supplies evidence.
- Stable reason codes separate reject, hold, and remediation class.
- Placeholder covers are contract-valid incomplete records but are not generated demos.
- General design properties, movements, materials, and techniques replace named-creator imitation.

## Unresolved for the Orchestrator/Product Owner

- Approve taxonomy v1.0.0 and whether category balance must stay exactly 400 after pilot evidence, or whether a separately approved rebalance may preserve the 10,000 total.
- Choose the persisted localization topology and legacy-field projection after query/load testing.
- Approve the exact source-kind value and moderation workflow for generated records.
- Calibrate lexical/semantic near-duplicate thresholds, human sampling strata, and score agreement on the 100-item pilot.
- Approve provider/model/config, maximum spend, retry ceiling, image dimensions/quality, storage/egress assumptions, and account access before any image call.
- Define retention and deletion policy for rejected raw candidates, provider outputs, receipts, and review evidence.
- Decide whether search indexes need language-specific Vietnamese/English tokenization after measured Preview queries.

