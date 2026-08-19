# [VI] Prompt S2 — Identity, RBAC và Contributor Workspace

`prompt_version: 1.2.0`  
`run_only: S2`
`canonical_envelope: sprintId=S2; predecessorSprintId=S1; predecessorAcceptance=S1_ACCEPTED; applicableGates=[G2,G3,G5]; exitAcceptance=S2_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là lead S2 của ALIPROMPT. Chỉ implement outcome identity/RBAC/member workspace rồi dừng.

ENTRY VÀ AN TOÀN
- Đọc instruction, predecessor handoff/evidence S1 đã verify, master/domain/Vercel contracts, gates và handoff schema. Yêu cầu S1 overallStatus=passed và chạy lại foundation check quan trọng.
- Snapshot dirty/concurrent work và claim exact file. Giữ unrelated changes; cấm destructive Git/file action.
- Dùng approved adapter hoặc safe local/test auth/email. Không bịa credential, gửi live email, cài live provider, deploy Production hay migrate Production nếu thiếu explicit approval.

SCOPE
Register/login/logout/forgot/reset; secure session lifecycle; deterministic server-side RBAC + resource ownership + audit; member public-profile consent/handle; authenticated contributor workspace để create/list/read/edit/discard/submit và theo dõi owned free-prompt draft. Submit tạo contracted non-public state; media processing/moderation UI thuộc S4. ALIPROMPT vẫn là seller duy nhất.

NON-GOALS
Không redesign public catalog, làm Blob byte pipeline, moderation decision/publish UI, engagement/leaderboard/blog, checkout/payment/entitlement, bật guest submission, social login hay multi-vendor role.

CÔNG VIỆC THEO THỨ TỰ
1. Trả execution packet với evidence S1, owned path, auth/data trust boundaries, acceptance, migration risk và rollback.
2. Implement provider-neutral identity/session/recovery interface và local/test delivery. Normalize identifier; hash password/token theo approved policy; non-enumerating response; rotate/revoke session.
3. Enforce CSRF cho unsafe method dùng cookie auth, secure cookie, rate limit, redirect allowlist. Authorization chỉ server-side.
4. Implement role/ownership matrix cho member, buyer, moderator, owner/admin. Contributor ID/handle không bao giờ ngụ ý seller ID/privilege.
5. Implement member profile opt-in và canonical five-state owned submission lifecycle: field/limit, optimistic concurrency hoặc stale-write protection tương đương, submit tới pending_moderation, changes_requested -> draft, rejected/published terminal visibility và truthful history/UI. Internal processing event không được tạo visible state mới.
6. Audit privileged/denied action có redaction. Schema/migration tối thiểu đi qua safe process S1 và independent review.

NHÁNH VÀ EDGE CASE
- Identity hiện có hoặc adapter mới; duplicate/confusable/reserved handle; email/account enumeration; login fixation; reset expired/reused/concurrent; logout/session revoke; open redirect; CSRF.
- Anonymous/wrong-member draft access, IDOR, stale edit/submit, double submit, edit sau transition, deleted account, role change giữa session, contributor thử price/publish/payment/refund/payout/admin.

TEST VÀ EVIDENCE
- Chạy và ghi repo-native format/lint/type/unit/integration/build + schema/migration checks.
- Contract/integration: register/login/logout/forgot/reset success + non-enumeration; hash/expiry/single-use; session rotation/revocation; cookie/CSRF/rate/redirect boundary.
- Authorization matrix cho mọi role/action, anonymous/wrong-owner IDOR, cross-draft, stale/double submit và mọi contributor commerce/privileged denial có audit evidence.
- UI/E2E cho loading/empty/validation/error/retry và keyboard/focus auth/workspace. Secret scan và client-bundle/env inspection. Validate handoff đúng 19 key.

EXIT GATE
Chỉ pass khi identity/recovery/session và owned-draft journey chạy với isolated data, negative authz/IDOR fail closed, member submit không thể publish/price, migration/rollback được review và QA độc lập accept. Không chạy S3.

OUTPUT CONTRACT
Trả exact evidence và JSON chỉ có: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S2/gate trong field hợp lệ; không sprintId, secret hay raw PII.
```
