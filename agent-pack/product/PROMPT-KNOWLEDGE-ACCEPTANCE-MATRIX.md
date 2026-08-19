# ALIPROMPT Prompt Knowledge Network — Acceptance Matrix

`decision_id: AP-PDN-001`  
`artifact_status: target_acceptance`

| ID | Scenario | Expected product behavior | Evidence required |
|---|---|---|---|
| PK-01 | Verified member asks a complete question | pending moderation; duplicate suggestions recorded | API + UI + DB/audit test |
| PK-02 | Guest attempts to ask | rejected; no draft/blob created | authz test |
| PK-03 | Creator shares prompt with clean image | Question + Answer + Version + evidence created atomically | transaction/integration test |
| PK-04 | Answer lacks output evidence | remains draft; cannot rank/publish | validation test |
| PK-05 | Output is text rather than image | accepted as text evidence with safe rendering | XSS/content test |
| PK-06 | Fake MIME/malware/oversized upload | quarantined/rejected; never publicly addressable | upload security test |
| PK-07 | Question owner accepts an answer | exactly one accepted answer; prior acceptance replaced atomically | concurrency test |
| PK-08 | Non-owner accepts an answer | forbidden; no state/reputation change | authz test |
| PK-09 | User votes own answer | rejected server-side | invariant test |
| PK-10 | User changes vote | one current vote; compensating reputation event idempotent | ledger test |
| PK-11 | Third party records success | binds exact version and contributes to WVSA only after moderation | analytics/query test |
| PK-12 | Author tests own answer | visible if valid but excluded from independent WVSA | metric test |
| PK-13 | Prompt is revised | new version; old attempts remain on old version | history test |
| PK-14 | Question marked duplicate | signpost remains; canonical link; no cycle | graph/SEO test |
| PK-15 | Tag synonym selected | stored/resolved to canonical tag | taxonomy test |
| PK-16 | Report submitted | moderation case opens; content not auto-deleted | workflow test |
| PK-17 | Public leaderboard requested | no email/PII; quality metrics replace post-count-first ordering | privacy contract test |
| PK-18 | Legacy prompt migrated | self-answered Question preserves attribution/content/media mapping | reconciliation test |
| PK-19 | Legacy only has aggregate likes | no synthetic voter or reputation event created | migration test |
| PK-20 | Search has no result | zero-result event; CTA asks or shares without dead end | UI/analytics test |
| PK-21 | Suspended user mutates content | forbidden; public attribution follows retention policy | policy test |
| PK-22 | Moderator reverses decision | new immutable decision/audit entry; projection converges | audit test |
| PK-23 | Two retries send same command | idempotency prevents duplicate answer/vote/attempt/event | reliability test |
| PK-24 | Model version is deprecated | historical evidence retained and visibly scoped; health warning possible | product query test |

## Product release minimum

Không được gọi Knowledge MVP là verified/released nếu PK-01 đến PK-20 chưa pass ở môi trường mục tiêu, hoặc privacy/security/data migration reviewer chưa chấp nhận evidence tương ứng. PK-21 đến PK-24 có thể được chia slice nhưng invariant nền của chúng phải được thiết kế trước khi production write mở.

## Owner decisions still required in S0

- target WVSA và cửa sổ đo đầu tiên;
- file size/page/pixel caps sau cost/security evidence;
- thời gian chờ accept self-answer;
- reputation point policy và threshold privilege;
- moderation SLA theo staffing thực;
- initial tag set ngoài 31 vertical categories;
- retention/appeal policy theo tư vấn pháp lý và vận hành.
