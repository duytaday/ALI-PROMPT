# DATA10K Corpus Architect validation evidence — 2026-08-19

Scope: local contract artifacts only. No provider/API/Preview/Production calls and no database, Blob, application-runtime, migration, package, or shared-manifest writes.

## Reproducible command

From repository root:

```powershell
node data/corpus/contracts/validate-contracts.mjs
```

Result (exit code 0):

```text
PASS schemas compiled: 2
PASS sample records schema-valid: 2
PASS taxonomy categories: 25; quota sum: 10000; each: 400
PASS common complexity/ratio distributions: 400 each/category
PASS reason codes unique: 44
PASS placeholder set + round trip + exact demo mapping: 2/2
PASS normalized SHA-256 recomputation + sample identity uniqueness: 2/2
PASS negative control: accepted lifecycle rejects placeholder_cover
```

The validator uses the repository's existing Ajv dependency. It compiles both JSON Schema 2020-12 contracts, validates both sample records, verifies taxonomy/schema category agreement, quota/distribution sums, reason-code uniqueness, cross-locale placeholder equality, exact demo-value mapping, deterministic rendering, and `data10k-normalize-v1` SHA-256 recomputation. A negative control also proves that changing a placeholder-only reference to `lifecycleState = accepted` fails validation.

The two reference records intentionally use `demoImage.kind = placeholder_cover` with all generation/media fields null. This is schema-valid G0 incomplete state but does not satisfy any generated-demo gate; no image-generation claim is made.
