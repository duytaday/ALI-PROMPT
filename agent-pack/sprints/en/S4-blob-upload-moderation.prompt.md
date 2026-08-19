# [EN] S4 Prompt — Vercel Blob Upload, Submission, and Moderation

`prompt_version: 1.2.0`  
`run_only: S4`
`canonical_envelope: sprintId=S4; predecessorSprintId=S3; predecessorAcceptance=S3_ACCEPTED; applicableGates=[G2,G3,G5,G7]; exitAcceptance=S4_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
You are the ALIPROMPT S4 lead. Implement only secure member media contribution and moderation, then stop.

ENTRY AND SAFETY
- Read instructions, passed S3 handoff, master/domain/Vercel contracts, matrix CAP-12/13/21, gates and handoff schema. Re-run relevant S2 ownership and S3 public-leak checks.
- Snapshot/claim/preserve dirty and concurrent work. Use local/test Blob adapters or explicitly approved isolated Preview stores; no fake credential or invented token, live provider install, Production store/data/deploy or unbounded deletion.

SCOPE
Authenticated member draft media; scoped short-lived upload intent; direct upload to private Vercel Blob quarantine; completed-object ownership verification; deterministic image validation/decode/re-encode/orientation/metadata stripping/variants; sanitized derivatives copied to a distinct public store; anti-spam submission; moderation queue and changes/reject/approve decisions; separate authorized idempotent free publication; member status UI; bounded audited orphan/quarantine retention job.

NON-GOALS
Guest submission activation, paid community items, persistent engagement/blog, checkout/payment or Production Cron/provider provisioning. Moderators cannot price; contributors cannot approve/publish.

ORDERED WORK
1. Return execution packet with predecessor evidence, Blob/function trust boundaries, exact files, limits, abuse risks, tests and rollback.
2. Implement upload-intent state bound to authenticated member + owned draft + count/bytes/MIME/expiry/single operation. Never trust arbitrary Blob URL/key.
3. Prefer secure direct client upload for scalability and quarantine isolation. Verify and record the current official Function limit. An explicitly supported fallback may handle one valid 3 MiB image but must reject a request at or above 4.5 MB before parsing/buffering and never aggregate the 12 MiB total through one Function. Callback/retry is authenticated and idempotent.
4. Validate extension/declared type/magic bytes/bytes/dimensions/frame/decode cost; reject malformed/truncated/polyglot/bomb/active/unsupported files. Decode/re-encode raster, normalize and strip metadata; only sanitized bounded variants become public.
5. Enforce text/image limits server-side, CSRF, rate limit, nonce, honeypot/time, fingerprint/dedupe, optional challenge, quarantine and non-enumerating receipt.
6. Implement exactly five contributor-visible states: draft -> pending_moderation -> changes_requested|rejected|published and changes_requested -> draft. Upload/scan/transform/review/approval are internal events. Only the owner-authorized approval/publication workflow may enter published and create the free product exactly once; add reason/audit/stale-state checks.
7. Implement bounded cleanup with prefix/state/age checks, lease/idempotency, dry-run, checkpoint and alert. Independent security/QA review.

BRANCHES AND EDGE CASES
- Expired/replayed/forged intent; cross-member/cross-draft object; arbitrary URL; upload incomplete/callback duplicate/out of order; submit races processing; retry after network failure; count/total boundary.
- MIME/magic mismatch, EXIF/GPS/orientation, huge dimensions, decompression bomb, animated/active input, encoder failure, derivative copy failure, raw object accidentally public.
- Duplicate/spam flood, stale moderation action, double publish, approval succeeds but publication compensates/remains pending_moderation, rejected stale resubmit, moderator cross-scope, cleanup overlap/failure/escaping prefix.

TESTS AND EVIDENCE
- Run recorded format/lint/type/unit/integration/build, disposable/local Blob contract tests and image fixture tests at every boundary.
- Security tests for auth/CSRF/IDOR/token scope/expiry/replay/arbitrary URL/cross-owner; Function payload path proves bytes are direct, not proxied above limit.
- Verify raw object private, sanitized derivative public, metadata removed, dimensions/types bounded and failures leave no public asset. Test processing/callback and publish idempotency.
- State/role/anti-spam/rate tests, stale/double moderation, contributor price/publish denials and audit. Cleanup dry-run/overlap/idempotency/bounded-prefix tests.
- UI E2E status/loading/progress/error/retry/changes flow plus keyboard/a11y. Validate exact 19-key handoff.

EXIT GATE
Pass only when member ownership, private quarantine, sanitized-public boundary, all default limits, moderation/free-publication separation and bounded cleanup have positive/negative evidence with independent approval. Do not start S5.

OUTPUT CONTRACT
Return exact evidence and only the 19 handoff keys: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Encode S4/gates inside allowed fields; no sprintId, credential, signed URL/token or PII.
```
