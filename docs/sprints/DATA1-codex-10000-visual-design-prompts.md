# ALIPROMPT — DATA10K: Codex Visual Design Prompt Corpus

## Program control

| Field | Value |
| --- | --- |
| Program ID | DATA10K |
| Version | 1.0.0 |
| Status | Draft / Product Owner review required |
| Created | 2026-08-19 |
| Target | 10,000 canonical visual-design prompts |
| Languages | Vietnamese and English |
| Demo media | One representative generated image per accepted prompt |
| Data target | Local artifacts + isolated Supabase/Vercel Preview |
| Production import/publish | Not authorized |

## Goal

Dùng Codex xây một pipeline có thể tiếp tục, kiểm định và rollback để tạo 10.000 prompt nguyên bản chuyên cho image generation/design, có metadata VI/EN và một ảnh demo đại diện được tạo từ chính prompt; nạp toàn bộ corpus đạt chuẩn vào isolated Preview dưới trạng thái draft/pending, không sao chép PromptVN hoặc nguồn khác và không tự xuất bản hàng loạt lên Production.

## Important product decision

10.000 là số **canonical prompts**, không phải số dòng bản dịch. Không được tạo 5.000 ý tưởng rồi nhân đôi VI/EN để báo cáo thành 10.000. Mỗi canonical prompt phải có localization VI và EN, nhưng chỉ tính một lần vào target.

Repo roadmap hiện yêu cầu chỉ 150–300 prompt được human review để publish giai đoạn đầu; generated data còn lại ở staging/Preview. DATA10K không được thay đổi guardrail này nếu Product Owner chưa phê duyệt change request riêng.

## Delivery gates

| Gate | Output | Approval required |
| --- | --- | --- |
| G0 | Taxonomy, JSON schema, rubric, provenance, cost/storage estimate, rollback design | `DATA10K_G0_APPROVED` |
| G1 | 100 prompts + 100 representative demo images on Preview | `DATA10K_PILOT_APPROVED` |
| G2 | 1,000 accepted prompts + images, reconciliation and quality report | `DATA10K_1K_APPROVED` |
| G3 | 10,000 accepted prompts + images imported to isolated Preview | `DATA10K_PREVIEW_ACCEPTED` |
| G4 | First 150–300 human-reviewed publish candidates | Separate Production/publish approval |

No gate may be inferred from silence. A later gate does not authorize Production.

## Candidate taxonomy

Use 25 controlled design categories with a candidate quota of 400 canonical prompts each. Dev must generate the G0 distribution manifest and report gaps/overlap before generation.

1. Brand identity systems
2. Abstract mark and logo exploration
3. Packaging design
4. Product photography
5. Advertising key visuals
6. Social media campaign design
7. Poster design
8. Editorial and magazine design
9. Original book and album cover concepts
10. Typography and lettering exploration
11. Infographics and data visuals
12. UI/UX hero and onboarding illustration
13. Icons and pictograms
14. 2D editorial illustration
15. 3D illustration
16. Isometric scenes
17. Patterns, textures and materials
18. Presentation and product mockups
19. Architecture visualization
20. Interior visualization
21. Fashion editorial
22. Food and beverage imagery
23. Beauty and cosmetics imagery
24. Portrait and lifestyle photography
25. Motion storyboard and keyframes

Do not use living-artist imitation, copyrighted characters, real trademarks, public-figure likeness, deceptive documents or unsafe/high-risk use cases to fill quotas.

## Canonical record contract

Every accepted prompt must have, at minimum:

- `schemaVersion`
- `corpusRunId`
- stable `promptKey`
- unique `slug`
- `categorySlug`
- localized `title`, `summary`, `usageInstructions` and image prompt template for `vi` and `en`
- provider-neutral canonical image prompt
- approved provider adapter metadata where verified
- `variableDefinitions`
- `usageMetadata`: use case, expected result, difficulty, setup time, output type and steps
- `designMetadata`: subject, composition, visual hierarchy, art direction, medium, lighting, color palette, texture, camera/lens when relevant, aspect ratio, typography constraints and negative constraints
- `modelCompatibility` backed by a reviewed manifest; use `Unknown` rather than guessing
- `contentLanguage`
- prompt version
- safety/taxonomy flags
- provenance: Codex surface/model ID if available, generator template version, timestamps, reviewer state and original-content declaration
- normalized content hash and dedupe cluster
- `demoImage`: kind, generation prompt hash, provider/model/snapshot when available, dimensions, MIME, bytes, SHA-256, perceptual hash, Blob key and localized alt text
- deterministic quality results and semantic-review results

Use an additive localization design. Do not count two localized rows as two canonical prompts. Do not place both languages into one unreadable body field merely to avoid a schema decision.

## Visual prompt quality contract

Each prompt must:

- state the design objective and intended deliverable;
- define subject, context, composition and visual hierarchy;
- specify medium/style through general design language, movements or techniques, not living-artist imitation;
- define palette, lighting, material/texture and camera/lens only when relevant;
- include aspect ratio and output usage;
- use typed variables with examples/defaults where useful;
- contain constraints that prevent logos, watermarks, copied brands, accidental text or unsafe content when applicable;
- avoid meaningless adjective stacking and contradictory art directions;
- produce a materially distinct use case, not a noun swap of another record;
- have natural, professional VI/EN localization rather than literal word-for-word translation;
- be original and clean-room: no copied PromptVN prompt bodies, titles, taxonomy, images or assets.

## Demo-image contract

Every accepted prompt requires one **representative generated demo image** created from that prompt with safe canonical variable values.

- A branded template cover may be used while waiting, but must be labelled `placeholder_cover`; it does not satisfy the final demo-image gate.
- `generated_demo` means an actual image-model output derived from the versioned prompt and recorded canonical variables.
- Current official image-model availability, pricing, account access and rate limits must be rechecked at execution time.
- Do not begin a paid 10,000-image run until Product Owner approves the documented maximum spend and provider credentials are available.
- Pilot images must use neutral, synthetic subjects and must not contain real customer data, public figures, trademarks, copied artwork, watermarks or living-artist imitation.
- Store generation provenance and prompt/image hashes so the output is reproducible/auditable to the degree supported by the provider.
- Decode and re-encode to an allowed delivery format, strip metadata, verify magic bytes, dimensions, MIME, file size and image integrity.
- Use a bounded target such as WebP with a documented dimension/quality policy; measure actual average and p95 bytes before estimating 10,000-image storage.
- Produce localized alt text of at most the current schema limit.
- Detect blank/corrupt outputs, accidental watermark/logo/text, unsafe imagery, extreme artifacts, near-duplicate images and unreadable visual hierarchy.
- Store only sanitized derivatives in the approved Preview Blob boundary. Raw provider output must not be exposed as public media.
- Uploads are resumable and idempotent by run/prompt/version hash. Retry must not create orphan or duplicate Blob objects.

## Quality gates

- Exactly 10,000 accepted canonical prompt keys after validation; translations do not increase the count.
- 100% schema-valid JSONL records.
- 100% unique prompt key and slug.
- Zero duplicate normalized content hashes.
- Near-duplicate rate below the approved threshold after deterministic and semantic clustering.
- 100% placeholders match `variableDefinitions`; no missing, unused or malformed variables.
- 100% of accepted items pass safety/licensing/trademark rules.
- 100% of accepted items have one validated `generated_demo` before G3 can be accepted.
- Every generated demo has correct prompt/version linkage, hash, MIME, dimensions, bytes and localized alt text.
- Visual QA runs on all images using deterministic checks; bounded vision review follows the approved sampling/routing plan.
- Human QA is stratified by category/language and includes all flagged/low-confidence items. At least 5% of the pilot and scale set must be sampled unless G0 approves a stronger evidence-based rule.
- No generated items may create fake users, contributors, reviews, votes, favorites, views, purchases, attempts or north-star metrics.

## Token-efficient Codex routing

- Deterministic code performs schema validation, counting, hashing, sorting, placeholder checks, image decoding, checksums, exact dedupe, import and reconciliation.
- Use the current efficient/high-volume Codex model for bounded classification, localization checks and metadata normalization when available.
- Use the balanced Codex model for batch drafting and ordinary semantic review.
- Use the frontier Codex model for taxonomy/rubric design, safety calibration, hard conflicts, migration/rollback review and final stratified audit.
- Verify actual model availability and current official guidance before fixing model IDs. Do not invent an unavailable model.
- Stable instructions/schema/rubric form a reusable prefix; dynamic batch manifest is kept small.
- Models return structured JSONL only for batch work. No narration or repeated policy text in each item.
- Generate more candidates than needed and promote the best 10,000; do not relax gates merely to hit the count.

## Artifact and import contract

- Do not make `db/seed.ts` a 10,000-item source file.
- Create separate resumable corpus CLI/jobs with run IDs, checkpoints and bounded batches.
- Raw large artifacts and images remain outside Git in an approved local/artifact directory and Preview Blob; commit schemas, taxonomy, code, compact manifests, hashes and evidence.
- Suggested commands: `corpus:plan`, `corpus:pilot`, `corpus:generate`, `corpus:validate`, `corpus:image`, `corpus:import:preview`, `corpus:reconcile`, `corpus:rollback:preview`.
- Import in bounded transactions and use stable keys/upserts. Never overwrite existing human/community prompts.
- All imported records initially use an explicit generated provenance and `draft` or `pending`; do not auto-set `approved` or `publishedAt`.
- Initial generated corpus is free content; do not create products, prices, orders or entitlements automatically.
- Track `corpus_runs`/item receipts or an equivalent auditable mechanism for status, hashes, prompt/media IDs, failures, retry and rollback.
- Reconciliation must compare manifest counts, canonical key sets, content/image hashes, prompt-version links, media links and moderation state.
- Rollback by run ID removes only rows/media created by that run and never touches pre-existing prompts, user data or commerce data.

## Master Dev Prompt

```text
# DEV MASTER PROMPT — DATA10K VISUAL DESIGN CORPUS

Bạn là Principal Data Product Engineer, Prompt Corpus Architect, Visual Design Prompt Specialist, Media Pipeline Engineer và QA Lead của ALIPROMPT.

NHIỆM VỤ
Dùng Codex xây và vận hành một pipeline resumable để tạo 10.000 canonical prompts nguyên bản chuyên cho image generation/design. Mỗi prompt phải có localization tiếng Việt + tiếng Anh, structured design metadata và một representative generated demo image tạo từ chính prompt. Nạp corpus đạt chuẩn vào isolated Supabase/Vercel Preview dưới trạng thái draft/pending. Không Production import/publish nếu chưa có approval riêng.

COUNTING RULE
- Target là 10.000 canonical prompt IDs.
- VI và EN là localization của cùng canonical prompt, không được tính thành hai prompts.
- Không được tạo 5.000 ý tưởng rồi nhân đôi bản dịch để báo cáo 10.000.

CURRENT REPOSITORY FACTS CẦN VERIFY
- Next.js App Router, TypeScript, Drizzle, postgres-js, Supabase PostgreSQL và Vercel Blob.
- prompts, prompt_versions và prompt_media đã tồn tại.
- prompt_media hiện có Blob key, alt text, status, bytes và MIME nhưng có thể thiếu complete generation provenance.
- db/seed.ts chỉ là seed Development/Preview nhỏ, không phù hợp làm corpus source.
- Repo có Codex agent pack, model routing policy, evals và business roadmap.
- Business roadmap hiện chỉ cho 150–300 human-reviewed prompts publish ban đầu; generated corpus còn lại phải ở staging/Preview.
- Working tree đang dirty; thay đổi của owner/agent khác phải được bảo toàn.
Không tin mù facts: đọc AGENTS.md, Next.js docs local có liên quan trước khi sửa Next.js code, schema/migrations, catalog, PromptUsePanel, media/Blob paths, i18n, tests, agent-pack model policy và roadmap.

AUTHORITY BOUNDARY
- Safe local implementation, tests và artifact generation nằm trong scope.
- External image API spend, provider credential use, Preview Blob/DB writes và Production actions là các boundary riêng.
- Không bắt đầu paid image generation run nếu chưa có Product Owner approval cho maximum spend.
- Không tự import/publish Production.
- Không log secrets, API keys, private Blob URLs hoặc full paid content.

DELIVERY GATES
G0: taxonomy + schema + rubric + cost/storage estimate + rollback design.
G1: 100 prompts + 100 actual generated demos trên isolated Preview.
G2: 1.000 prompts + images + reconciliation.
G3: 10.000 prompts + images trên isolated Preview.
G4: chỉ 150–300 human-reviewed publish candidates, cần approval riêng.

Exact approvals:
- DATA10K_G0_APPROVED
- DATA10K_PILOT_APPROVED
- DATA10K_1K_APPROVED
- DATA10K_PREVIEW_ACCEPTED

Không suy diễn approval từ im lặng. Approval của gate sau không đồng nghĩa Production approval.

PHASE 1 — BASELINE VÀ ARCHITECTURE
1. Chạy git status; không reset/xóa/ghi đè unrelated changes.
2. Chạy baseline TypeScript, lint, tests, Drizzle check và build; ghi exact results.
3. Inventory prompt/version/localization/media/provenance schema và import paths.
4. Tạo additive architecture để 10.000 canonical prompts có VI/EN mà không duplicate canonical rows.
5. Tạo versioned JSON Schema cho corpus record và manifest.
6. Tạo corpus-run receipt/provenance/rollback design.
7. Tạo cost model trước paid work: model/config, candidates, accepted count, retry ceiling, expected images, estimated input/output usage, image spend ceiling, storage average/p95, Blob egress assumptions và safety margin. Không invent giá; dùng current official provider pricing/access evidence.

PHASE 2 — TAXONOMY VÀ DISTRIBUTION
Dùng 25 candidate design categories, mỗi category target 400 canonical prompts:
brand identity; abstract marks; packaging; product photography; advertising key visuals; social campaigns; posters; editorial; original book/album covers; typography; infographics; UI/UX illustration; icons; 2D illustration; 3D illustration; isometric; patterns/textures; mockups; architecture; interiors; fashion; food/beverage; beauty/cosmetics; portrait/lifestyle; motion storyboard/keyframes.

1. Tạo distribution manifest theo category, use case, complexity, aspect ratio, medium, output type và locale coverage.
2. Chống quota padding: mỗi record phải là use case khác biệt về mục tiêu/đầu ra, không chỉ đổi noun/color.
3. Exclude living-artist imitation, copyrighted characters, public figures, real brands/trademarks, deceptive documents, unsafe sexual/violent material, fraud, impersonation và high-risk regulated outcomes.
4. Không scrape/copy PromptVN hoặc marketplace khác; clean-room original content only.

PHASE 3 — RECORD CONTRACT
Mỗi canonical item phải có:
- stable promptKey + unique slug;
- localized VI/EN title, summary, usage instructions và prompt template;
- provider-neutral canonical prompt;
- typed variables, examples/defaults và exact placeholder mapping;
- usageMetadata;
- designMetadata: objective, deliverable, subject, context, composition, hierarchy, medium, general style language, palette, lighting, texture/material, camera/lens khi relevant, aspect ratio, typography constraints và negative constraints;
- reviewed modelCompatibility hoặc Unknown;
- version, safety flags, original provenance, generator template/model identifiers;
- content hash, semantic cluster và quality results;
- demo-image generation manifest và localized alt text.

Không gộp VI/EN thành một body khó sử dụng chỉ để tránh migration. Không tự tuyên bố model compatibility khi chưa verify provider contract.

PHASE 4 — TOKEN-EFFICIENT CODEX PIPELINE
1. Deterministic first: schema, exact counts, hashes, placeholder validation, sorting, exact dedupe, image decode/checksum, import và reconciliation không dùng model.
2. Dùng current high-volume/economy Codex model cho bounded classification/normalization/localization checks nếu available.
3. Dùng balanced Codex model cho batch drafting và ordinary semantic review.
4. Dùng frontier Codex model cho rubric/taxonomy, safety calibration, hard cases, migration/rollback và final stratified audit.
5. Verify current official model IDs/availability before execution; không invent model.
6. Stable prefix chỉ gồm contract, taxonomy slice, JSON schema, rubric và output format. Batch input chỉ có compact work order + exclusions + accepted cluster hashes.
7. Output batch là JSONL only, không narration.
8. Mỗi batch 25–100 candidates theo measured context/quality; checkpoint sau mỗi batch.
9. Generate oversupply, validate và lấy top 10.000. Không hạ quality bar để đủ số.
10. Tối đa ba bounded agents song song; mỗi agent chỉ ghi batch file riêng. Một orchestrator serialize manifest/import writes.

PHASE 5 — PROMPT QUALITY VÀ DEDUPE
1. Deterministic validation 100% records: schema, lengths, locales, placeholders, allowed enums, contradictions, forbidden terms, exact hashes.
2. Near-duplicate clustering bằng deterministic n-gram/MinHash/SimHash hoặc equivalent; threshold phải được calibrate trên pilot.
3. Semantic reviewer kiểm tra use-case uniqueness, design coherence, natural VI/EN, actionable variables, safe/original direction và truthful compatibility.
4. Rubric tối thiểu: objective clarity, design specificity, composition/hierarchy, controllability, output usefulness, localization, safety/originality, internal consistency và uniqueness.
5. Rejected records giữ reason code; retry phải sửa diagnosed cause, không lặp cùng input/model/prompt.
6. 100% flagged/low-confidence records review; human QA stratified ít nhất 5% trừ khi G0 phê duyệt rule mạnh hơn.

PHASE 6 — REPRESENTATIVE DEMO IMAGES
1. Mỗi accepted prompt cần một actual representative image-model output với safe canonical variables.
2. Template cover chỉ được đánh dấu placeholder_cover và không thỏa demo gate.
3. Trước run, verify current image model, endpoints/tool availability, snapshot, pricing, rate limits và account access từ official docs.
4. Không gọi paid image generation trước approved maximum spend.
5. Pilot 100 phải tạo actual generated_demo cho cả 100 items.
6. Lưu generation provenance: promptKey, prompt version, canonical variable set, generation prompt hash, provider/model/snapshot nếu available, parameters, attempt number và timestamp.
7. Không dùng real person/public figure/trademark/copyrighted character/living-artist imitation/customer data.
8. Sanitize media: verify magic bytes, decodeability, dimensions, MIME/extension, size; strip metadata và re-encode approved derivative.
9. Automated QA all images: corrupt/blank, unsafe, accidental text/logo/watermark, severe artifact/crop, perceptual duplicates, visual mismatch và contrast/hierarchy.
10. Vision review theo bounded routing plan; human review stratified + all flags.
11. Bounded concurrency, exponential backoff, retry ceiling, spend counter và circuit breaker. Dừng khi projected spend vượt approved ceiling.
12. Upload sanitized derivative vào isolated Preview Blob bằng idempotent run/prompt/version key. Retry không tạo duplicate/orphan.
13. Liên kết đúng prompt_media hoặc additive media-provenance schema; alt text VI/EN trong giới hạn hiện tại.
14. Raw provider output không được public. Không dùng Production Blob.

PHASE 7 — RESUMABLE ARTIFACTS VÀ IMPORT
1. Không nhét corpus vào db/seed.ts.
2. Implement corpus CLI/jobs: plan, pilot, generate, validate, image, import:preview, reconcile, rollback:preview.
3. Raw JSONL/images nằm trong ignored local artifact directory và Preview Blob; Git chỉ chứa code, schemas, taxonomy, compact manifests, hashes và QA evidence.
4. Mọi job dùng run ID, batch ID, checkpoint, retry receipt và resume cursor.
5. Import bằng bounded transactions; upsert theo stable prompt key nhưng không overwrite human/community/existing content.
6. Imported items có generated provenance, sourceKind phù hợp, accessKind=free, moderationStatus=draft hoặc pending, publishedAt=null, all engagement counters=0.
7. Không tạo fake users, contributors, reactions, favorites, views, attempts, products, orders hoặc entitlements.
8. Reconcile manifest count/key/hash với prompts, versions, localizations, media, Blob objects và moderation states.
9. Rollback run chỉ xóa rows/media do exact run tạo; không chạm pre-existing prompt/user/commerce data.

PHASE 8 — SCALE GATES
G1 / 100:
- Full pipeline + actual demos + QA + Preview import + rollback rehearsal.
- Product Owner reviews taxonomy fit, prompt usefulness, localization và image quality.

G2 / 1.000:
- Measure acceptance/retry/duplicate rate, token usage, image spend, storage average/p95, latency, failures và reviewer agreement.
- Recalculate projected 10K ceiling before approval.

G3 / 10.000:
- Exact 10.000 canonical accepted prompts, each VI/EN and each linked to one validated generated_demo on isolated Preview.
- Zero schema errors, duplicate keys/hashes, orphan records/media và paid-body/secret leaks.
- Counts/hashes reconcile; rollback/resume documented and tested.
- Corpus remains draft/pending.

G4 / PUBLISH CANDIDATES:
- Chọn 150–300 items bằng stratified human review.
- Human reviewer identity/time/verdict/evidence recorded.
- Chỉ approved items mới có publishedAt và public visibility sau separate approval.
- Synthetic data không được tính thành WVSA hoặc quality truth.

REQUIRED TESTS
- JSON Schema/property tests; Unicode VI/EN; placeholder round-trip.
- Exact/near duplicate fixtures; taxonomy quota and no-padding checks.
- Forbidden trademark/public figure/living artist/copyright character cases.
- Idempotent generation receipt, image retry, Blob upload và DB import.
- Partial batch failure/resume; duplicate retry; concurrency; spend circuit breaker.
- Wrong environment and Preview→Production isolation.
- Corrupt/oversize/wrong MIME/blank/duplicate/unsafe image.
- Manifest↔DB↔Blob reconciliation and rollback by run ID.
- Catalog/search/detail rendering with 10K scale, bounded pagination, indexes and no N+1.
- VI/EN, Light/Dark/System, responsive image layout and alt text.
- Paid content, secrets, private Blob URLs and user data leakage scan.

DEFINITION OF DONE FOR DATA10K PREVIEW
- Exact 10.000 canonical accepted prompt keys, not translation rows.
- Every item has natural VI + EN localization.
- Every item passes schema, placeholder, safety, originality and dedupe gates.
- Every item has one validated representative generated_demo tied to exact prompt version.
- Preview DB/Blob counts and hashes reconcile with immutable manifest.
- No fake engagement/business metrics.
- Performance remains bounded at catalog scale.
- Test/build/migration checks pass.
- Human sample QA and independent reviewer report exist.
- Rollback/resume rehearsed.
- Product Owner issues exact DATA10K_PREVIEW_ACCEPTED.
- Production remains unauthorized.

HANDOFF FORMAT AT EVERY GATE
1. Verdict: Pass / Partial / Blocked.
2. Run ID, revision and environment.
3. Counts: generated, accepted, rejected, duplicate, safety-held, imaged, imported and reconciled.
4. Distribution by category and locale.
5. Model/tool routing and token usage; no hidden reasoning.
6. Image provider/model evidence, attempts, spend actual/projected and Blob storage actual/projected.
7. Quality scores, duplicate clusters, human/vision review agreement and representative samples.
8. Files, schemas, migrations and commands changed.
9. Exact test results and Preview URLs without secrets.
10. Failures, risks, retry plan and rollback receipt.
11. Exact next approval required.

Bắt đầu bằng G0. Implement mọi safe local code/artifact work cần thiết. Dừng đúng boundary trước paid image calls, Preview external writes hoặc Production actions nếu chưa có authority. Không tuyên bố thành công khi mới có placeholder covers, unreviewed drafts hoặc unreconciled counts.
```

## Official references used for this prompt

- https://developers.openai.com/api/docs/guides/latest-model
- https://developers.openai.com/api/docs/models/gpt-image-2

## Multi-agent controller pack

- Vietnamese: `docs/sprints/DATA10K-multi-agent-dev-prompts-VI.md`
- English: `docs/sprints/DATA10K-multi-agent-dev-prompts-EN.md`

## Product-owner teach-back

- [ ] Phân biệt 10.000 canonical prompts với 10.000 localization rows.
- [ ] Giải thích vì sao template cover không được tính là representative generated demo.
- [ ] Giải thích vì sao pipeline phải dừng ở 100 và 1.000 để hiệu chỉnh trước 10.000.
- [ ] Nêu dữ liệu nào được phép và không được phép dùng để tính chất lượng/north-star.
- [ ] Giải thích vì sao 10.000 draft ở Preview không đồng nghĩa 10.000 prompt được publish.
- [ ] Biết rằng paid image generation cần spend ceiling được phê duyệt riêng.
