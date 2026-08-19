# [VI] Prompt S4 — Vercel Blob Upload, Submission và Moderation

`prompt_version: 1.2.0`  
`run_only: S4`
`canonical_envelope: sprintId=S4; predecessorSprintId=S3; predecessorAcceptance=S3_ACCEPTED; applicableGates=[G2,G3,G5,G7]; exitAcceptance=S4_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là lead S4 của ALIPROMPT. Chỉ implement secure member media contribution và moderation rồi dừng.

ENTRY VÀ AN TOÀN
- Đọc instruction, handoff S3 đã pass, master/domain/Vercel contracts, matrix CAP-12/13/21, gates và handoff schema. Chạy lại S2 ownership và S3 public-leak check liên quan.
- Snapshot/claim/giữ dirty và concurrent work. Dùng local/test Blob adapter hoặc isolated Preview store đã được duyệt; không bịa credential/token, cài live provider, dùng Production store/data/deploy hay delete không bounded.

SCOPE
Authenticated member draft media; scoped short-lived upload intent; direct upload tới private Vercel Blob quarantine; verify completed-object ownership; deterministic image validation/decode/re-encode/orientation/metadata stripping/variants; copy sanitized derivative sang public store riêng; anti-spam submission; moderation queue và changes/reject/approve; separate authorized idempotent free publication; member status UI; bounded audited orphan/quarantine retention job.

NON-GOALS
Không bật guest submission, không paid community item, persistent engagement/blog, checkout/payment hay Production Cron/provider provisioning. Moderator không được price; contributor không approve/publish.

CÔNG VIỆC THEO THỨ TỰ
1. Trả execution packet với predecessor evidence, Blob/Function trust boundary, exact file, limits, abuse risk, tests, rollback.
2. Implement upload-intent state bound tới authenticated member + owned draft + count/bytes/MIME/expiry/single operation. Không tin arbitrary Blob URL/key.
3. Ưu tiên secure direct client upload để scale và tách quarantine. Verify/ghi current official Function limit. Fallback được support rõ có thể nhận một ảnh hợp lệ 3 MiB nhưng phải reject request từ 4.5 MB trở lên trước parse/buffer và không aggregate tổng 12 MiB qua một Function. Callback/retry phải authenticated và idempotent.
4. Validate extension/declared type/magic bytes/bytes/dimensions/frame/decode cost; reject malformed/truncated/polyglot/bomb/active/unsupported. Decode/re-encode raster, normalize, strip metadata; chỉ sanitized bounded variant được public.
5. Enforce text/image limits server-side, CSRF, rate limit, nonce, honeypot/time, fingerprint/dedupe, optional challenge, quarantine và non-enumerating receipt.
6. Implement đúng năm contributor-visible state: draft -> pending_moderation -> changes_requested|rejected|published và changes_requested -> draft. Upload/scan/transform/review/approval là internal event. Chỉ owner-authorized approval/publication mới vào published và tạo free product đúng một lần; thêm reason/audit/stale-state check.
7. Implement bounded cleanup có prefix/state/age checks, lease/idempotency, dry-run, checkpoint, alert. Independent security/QA review.

NHÁNH VÀ EDGE CASE
- Intent expired/replayed/forged; cross-member/cross-draft object; arbitrary URL; upload incomplete/callback duplicate/out-of-order; submit race processing; retry sau network; count/total boundary.
- MIME/magic mismatch, EXIF/GPS/orientation, huge dimensions, decompression bomb, animated/active input, encoder failure, derivative copy failure, raw object vô tình public.
- Duplicate/spam flood, stale moderation, double publish, approval thành công nhưng publication phải compensate/giữ pending_moderation, rejected stale resubmit, moderator cross-scope, cleanup overlap/failure/escape prefix.

TEST VÀ EVIDENCE
- Chạy recorded format/lint/type/unit/integration/build, disposable/local Blob contract và image fixture ở mọi boundary.
- Security test auth/CSRF/IDOR/token scope/expiry/replay/arbitrary URL/cross-owner; Function payload path chứng minh bytes đi direct, không proxy quá limit.
- Verify raw private, sanitized derivative public, metadata removed, dimension/type bounded và failure không để public asset. Test processing/callback/publish idempotency.
- State/role/anti-spam/rate, stale/double moderation, contributor price/publish denial + audit. Cleanup dry-run/overlap/idempotency/bounded-prefix tests.
- UI E2E status/loading/progress/error/retry/changes + keyboard/a11y. Validate handoff đúng 19 key.

EXIT GATE
Chỉ pass khi member ownership, private quarantine, sanitized-public boundary, default limits, moderation/free-publication separation và bounded cleanup có positive/negative evidence cùng independent approval. Không chạy S5.

OUTPUT CONTRACT
Trả exact evidence và chỉ 19 handoff key: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S4/gate trong field hợp lệ; không sprintId, credential, signed URL/token hay PII.
```
