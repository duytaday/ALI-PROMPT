# DATA10K G0 Gate Packet — 2026-08-19

## 1. Gate and verdict

- Gate: `G0` — local architecture, contract, deterministic pipeline, and media-control design.
- Verdict: **G0_PASS (implementation evidence complete; Product Owner acceptance pending).**
- Required next approval: exact `DATA10K_G0_APPROVED`.
- Environment: local only. No provider call, Preview write, database write, Blob write, import, publication, migration, or Production action occurred.
- Revision observed: `944121f3fc8313cf52eaf7f8f9068c5f2591b26a` on `main`; the worktree was already dirty and all unrelated paths were preserved.

`G0_PASS` is not `DATA10K_G0_APPROVED`, and it grants no G1, spend, Preview, or Production authority.

## 2. Agents, routing, and exclusive paths

| Lane | Routing | Exclusive write paths | Result |
| --- | --- | --- | --- |
| Corpus Architect | `gpt-5.6-sol`, high | `docs/data10k/architecture/**`, `data/corpus/contracts/**` | Pass |
| Corpus Pipeline Engineer | `gpt-5.6-terra`, medium | `scripts/corpus/core/**`, `tests/corpus/core/**` | Pass |
| Visual Media Engineer | `gpt-5.6-terra`, medium | `scripts/corpus/media/**`, `tests/corpus/media/**` | Pass |
| Orchestrator integration | deterministic code + review | `docs/data10k/G0-gate-packet-2026-08-19.md`; adapter integration | Pass |

No child agent spawned another agent. The economy route was not selected because no high-volume generation or classification work ran. Token usage is not exposed by this execution surface and is therefore recorded as `not measured`, not estimated.

## 3. Corpus architecture and counting rule

- Controlled taxonomy: 25 visual-design categories × 400 candidate canonical prompts = **10,000 canonical prompt IDs**.
- Each canonical ID must carry VI and EN localizations. Localizations do not add to the canonical count; 20,000 localized text objects still represent 10,000 prompts.
- Anti-padding rule: a candidate must differ on at least three material axes, including design objective or deliverable; noun/color swaps do not qualify.
- Compatibility defaults to `Unknown` without reviewed provider evidence.
- Initial generated items remain draft/pending and free; they must not create fake engagement, users, votes, attempts, reputation, products, orders, or entitlements.

Authoritative local artifacts:

- [Taxonomy](E:/aliprompt.vn/docs/data10k/architecture/taxonomy-v1.0.0.md)
- [Domain design and non-binding migration/index recommendations](E:/aliprompt.vn/docs/data10k/architecture/g0-corpus-domain-v1.0.0.md)
- [Quality rubric](E:/aliprompt.vn/docs/data10k/architecture/quality-rubric-v1.0.0.md)
- [Clean-room safety policy](E:/aliprompt.vn/docs/data10k/architecture/clean-room-safety-v1.0.0.md)
- [Record schema](E:/aliprompt.vn/data/corpus/contracts/corpus-record.schema.v1.0.0.json)
- [Manifest schema](E:/aliprompt.vn/data/corpus/contracts/corpus-manifest.schema.v1.0.0.json)
- [Taxonomy manifest](E:/aliprompt.vn/data/corpus/contracts/taxonomy.v1.0.0.json)
- [Reason codes](E:/aliprompt.vn/data/corpus/contracts/reason-codes.v1.0.0.json)

## 4. Sample, schema, and quality evidence

Two clean-room reference records were schema-validated with exact placeholder/demo mappings:

| Canonical prompt key | Category | Normalized content hash |
| --- | --- | --- |
| `data10k:packaging-design:0001` | packaging design | `68a532ffb53e2c7edfa8cc8cb922427341cd1f210244848589918cd2d1fb5e25` |
| `data10k:motion-storyboard-keyframes:0001` | motion storyboard/keyframes | `fa3aabf833bf1b8520e4cd5cae1329b45e39a0447cfdf381e1c03f71bf56a367` |

The contract validator proves: 2 schemas compiled; 2/2 samples valid; 25 categories; quota sum 10,000; 44 unique reason codes; placeholder round-trip; normalized-hash recomputation; and rejection of an accepted record that uses `placeholder_cover`.

Quality and safety policy excludes living-artist imitation, copyrighted characters, real trademarks/trade dress, public figures, personal data, deceptive documents, fraud/impersonation, unsafe sexual/violent/hate content, and high-risk regulated claims. No external source content, PromptVN assets, or marketplace content was used.

## 5. Pipeline and media controls

The local core pipeline provides JSONL streaming, atomic checkpoints, immutable manifest hashing, source-hash-safe resume, deterministic key/slug/hash/placeholder/Unicode/enum/forbidden/quota validation, exact dedupe, pilot-calibrated near-duplicate hooks, structured-JSONL model adapter contracts, non-identical retry requirements, and token accounting interfaces.

The local media pipeline is provider-neutral. It requires runtime injection of a provider and contains no provider/model defaults, credentials, or network calls. It distinguishes `placeholder_cover` from gate-valid `generated_demo`, applies provenance linkage, spend ledger/circuit breaker, magic bytes/decode/re-encode/MIME/dimension/size/SHA checks, pHash and visual-QA interfaces, deterministic Preview-only Blob keys, and orphan-cleanup receipt shapes.

The first integration review found that the generic core schema did not accept canonical keys such as `data10k:packaging-design:0001`. The integration adds `validateData10kContractRecord`, compiled with JSON Schema Draft 2020-12 and deterministic `date-time` validation. The canonical sample now passes the strict DATA10K schema while the intentionally older generic validator remains separate; this prevents silently weakening the canonical contract.

## 6. Cost, storage, and spend evidence

| Measure | Result |
| --- | --- |
| Actual image API calls | 0 |
| Actual image spend | 0 |
| Actual Blob storage | 0 bytes |
| Actual generated demos | 0 |
| Actual Preview/DB imports | 0 |
| Projected image spend | Not computed: provider, model, price basis, and approved maximum spend are absent. |
| Projected storage | Formula-only; requires measured G1 pilot average/p95 sanitized WebP and thumbnail bytes. |
| Retry policy | Runtime must record attempts before retry and circuit-break before projected spend exceeds the approved ceiling. |

No price, model capability, rate-limit, or account-access claim has been invented.

## 7. Schema, migration, and rollback disposition

- `db/schema.ts`, `drizzle/**`, `db/seed.ts`, package scripts, and application runtime were not changed by DATA10K G0.
- The architecture provides additive persistence/index recommendations only. They require a separately owned migration/import design after Preview approval; no migration is proposed as applied evidence.
- A future importer must use run receipts, stable keys, bounded transactions, generated provenance, draft/pending moderation state, zero engagement counters, and reconciliation against immutable manifest hashes.
- A future rollback may remove only rows/media created by the exact run ID. Blob failures produce cleanup receipts. G0 rollback is simply removal/reversion of local code and artifacts; there is no remote state to undo.

## 8. Commands and exact results

```text
node data/corpus/contracts/validate-contracts.mjs
PASS schemas compiled: 2; samples schema-valid: 2; categories: 25; quota: 10000;
reason codes: 44; placeholder/demo/hash checks: pass.

npx tsc --noEmit --pretty false
PASS

npx tsx --test tests/corpus/core/pipeline.test.ts tests/corpus/media/media-pipeline.test.ts
PASS 11/11

npx eslint scripts/corpus tests/corpus
PASS

npm test
PASS: production build, 41 JavaScript tests, 1 TypeScript payment test

npm run lint
PASS

npm run db:check
PASS

git diff --check
PASS (only pre-existing CRLF warnings)
```

## 9. Counts, outcomes, and held work

| State | Canonical prompts | Images | Imports |
| --- | ---: | ---: | ---: |
| G0 schema plan | 10,000 target (25 × 400) | 10,000 required by G3 | 0 |
| G0 reference samples | 2 | 0 (`placeholder_cover`, explicitly not accepted demos) | 0 |
| G0 accepted production-ready corpus | 0 | 0 | 0 |
| Rejected/duplicate/safety-held generated items | 0 / 0 / 0 | n/a | n/a |

The pre-existing 1,000 prompt-only synthetic test corpus remains unrelated legacy local test data; it was not imported, promoted, or counted toward DATA10K.

## 10. External blockers and exact next approval

Before G1, the Product Owner must review this packet and issue exactly:

```text
DATA10K_G0_APPROVED
```

G1 additionally remains blocked until the owner approves a bounded 100-item pilot and supplies: approved provider/model configuration, current official provider/pricing/rate-limit/account evidence, maximum spend ceiling, retry ceiling, isolated Preview database and Blob authorization, and a named human/independent QA review plan. Existing S0/Preview ownership evidence remains an external platform dependency; this G0 packet does not waive it.

Production is unauthorized in every state of DATA10K.

## 11. Product Owner learning checkpoint

Before approving G0, the owner should be able to explain:

- Why 10,000 canonical IDs are not 20,000 prompts when each has VI and EN localization.
- Why `placeholder_cover` cannot satisfy a representative `generated_demo` gate.
- Why the system stops at 100 and 1,000 before a 10,000-image run.
- Why model/provider compatibility is `Unknown` without evidence.
- Why Preview drafts and synthetic records cannot count toward public quality metrics or WVSA.
