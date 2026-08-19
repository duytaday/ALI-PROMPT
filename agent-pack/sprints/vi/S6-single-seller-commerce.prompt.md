# [VI] Prompt S6 — Commerce, Webhook và Entitlement chỉ ALIPROMPT

`prompt_version: 1.2.0`  
`run_only: S6`
`canonical_envelope: sprintId=S6; predecessorSprintId=S5; predecessorAcceptance=S5_ACCEPTED; applicableGates=[G2,G3,G4,G5]; exitAcceptance=S6_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là commerce/security lead S6 của ALIPROMPT. Chỉ implement sandbox single-seller commerce rồi dừng.

ENTRY VÀ AN TOÀN
- Đọc instruction, predecessor handoff S5 schema-valid có `predecessorAcceptance=S5_ACCEPTED`, master/domain/Vercel contracts, COM-01–08, exact applicable set G2/G3/G4/G5 và schema. Chạy lại build/contract, security, commerce, paid-leak và contributor-authority baseline.
- Snapshot/claim/giữ dirty và concurrent work. Dùng provider-neutral adapter + safe local/sandbox. Không bịa credential, cài/kích hoạt live provider, charge/refund tiền thật, migrate/deploy Production hay bật contributor selling nếu thiếu explicit authority.

SCOPE
ALIPROMPT owner-only free/paid price/license/version/publication rules; integer-minor-unit server price; order/item snapshot; sandbox checkout; server-only Route Handler webhook có raw-body provider signature/timestamp; unique event/idempotency/wrong-environment checks; durable transactional hoặc compensating fulfillment/reconciliation; exact product/version entitlement; secure paid reveal/copy/history; refund/dispute/revocation; audit và operations view. Chỉ ALIPROMPT nhận doanh thu.

NON-GOALS
Không seller onboarding, member pricing, commission, revenue share, split tax, KYC, payout, marketplace dispute, live payment, production provider, tự bịa accounting/legal hay Production deploy.

CÔNG VIỆC THEO THỨ TỰ
1. Trả execution packet với evidence S5, payment trust/data flow, exact file, provider adapter, acceptance, risk, compensation/rollback.
2. Implement owner-only catalog price/license/version state và immutable order snapshot. Server tính lại total/currency; không tin client/AI/query metadata.
3. Implement sandbox checkout attempt/order lifecycle và safe retry. Bind provider object với internal order, buyer, seller/environment và expected amount/currency.
4. Verify webhook signature trên raw bytes trước parse; persist unique event; reject wrong account/environment/order/amount/currency; xử lý duplicate/out-of-order/replay/concurrent không regression/double fulfillment.
5. Tạo entitlement đúng một lần bằng transaction hoặc durable outbox/compensation. Reconciliation tìm provider/order/event/entitlement mismatch, bounded retry/alert.
6. Reveal protected_body chỉ cho authenticated owner hoặc active exact entitlement; private,no-store, không public cache/serialization. Implement history/receipt và refund/dispute/revoke behavior đã định nghĩa.
7. Thêm least-privilege audited admin operations và independent commerce/security review.

NHÁNH VÀ EDGE CASE
- Client tamper price/user/role; stale/version price; zero/free/paid; unsupported currency; abandoned/expired checkout; retry/concurrent checkout.
- Signature thiếu/sai, body mutation, stale timestamp, unknown/wrong environment account, duplicate/out-of-order/replayed/concurrent webhook, timeout sau event persist, partial fulfillment, reconciliation repair.
- Anonymous/wrong-buyer/revoked entitlement, refund trước/sau fulfillment, partial-refund policy gate, dispute, version access, cache/log/error/search/meta leak; contributor thử mọi commerce/admin action.

TEST VÀ EVIDENCE
- Ghi format/lint/type/unit/integration/build/migration commands và sandbox contract/E2E results.
- Golden flow: paid browse -> auth -> server checkout -> verified webhook -> fulfilled entitlement -> reveal/copy/history -> sandbox refund/dispute policy -> revoke/deny.
- Boundary test amount minor units/currency/stale price/client tamper; invalid signature/raw body; duplicate/out-of-order/replay/concurrency/retry; atomicity/compensation/reconciliation.
- Exhaustive negative authorization/IDOR và contributor price/publish/payment/refund/payout denial có audit.
- Scan API/HTML/RSC/bundle/meta/JSON-LD/search/analytics/log/error/source map/shared cache cho protected body; assert private,no-store. Validate handoff đúng 19 key.

EXIT GATE
Chỉ pass khi mọi S6 applicable gate G2/G3/G4/G5 đều pass, sandbox golden/failure pass, money/payment truth thuộc server/provider, fulfillment exactly-once/reconcilable, protected content fail closed, contributor isolation và independent security review pass, rồi reviewer được chỉ định phát hành `S6_ACCEPTED`. Không chạy S7.

OUTPUT CONTRACT
Trả redacted evidence và đúng 19 schema key: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S6/gate trong field hợp lệ; không sprintId, secret, raw webhook hay PII.
```
