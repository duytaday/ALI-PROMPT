# ALIPROMPT Agent Pack — Language Index

`pack_version: 1.2.0`

## Tiếng Việt

- Program goal riêng: [`PROGRAM-GOAL-VI.md`](./PROGRAM-GOAL-VI.md)
- Controller system prompt riêng: [`CONTROLLER-SYSTEM-PROMPT-VI.md`](./CONTROLLER-SYSTEM-PROMPT-VI.md)
- Program goal + controller prompt: [`PROGRAM-GOAL-AND-CONTROLLER-PROMPT-VI.md`](./PROGRAM-GOAL-AND-CONTROLLER-PROMPT-VI.md)
- Prompt chính: [`PROMPT-CHO-CHAT-DEV.md`](./PROMPT-CHO-CHAT-DEV.md)
- Chín role prompt: [`agents/vi/`](./agents/vi/)
- Tám prompt sprint dán chạy lần lượt: [`sprints/vi/`](./sprints/vi/)

Dùng bộ này khi owner/reviewer/team vận hành chủ yếu bằng tiếng Việt.

## English

- Lead-orchestrator prompt: [`MASTER-PROMPT.md`](./MASTER-PROMPT.md)
- Nine role prompts: [`agents/en/`](./agents/en/)
- Eight paste-ready, sequential sprint prompts: [`sprints/en/`](./sprints/en/)

Use this set when the coding environment or engineering team works more consistently in English.

## Parity rule

Không nạp hai ngôn ngữ của cùng role vào một agent. Hai bộ phải giữ cùng:

- product mode: đúng một commercial seller + authenticated member contribution miễn phí có kiểm duyệt; guest path là feature flag tắt mặc định nếu cần parity;
- deployment target: native Next.js trên Vercel, PostgreSQL từ Vercel Marketplace, private-quarantine/public-sanitized Vercel Blob, isolated Development/Preview/Production và reversible cutover;
- full public capability baseline: shell/theme, home/category, filters/empty state, rails/cards/modal/actions, auth/library, submit/moderation, contributor/leaderboard, blog, floating/responsive/a11y;
- commerce: free/paid, checkout/webhook/entitlement/refund;
- contributor không có price/publish/payment/refund/payout authority;
- clean-room và original ALIPROMPT route/design/copy/data rules;
- domain/security/privacy/limit/state invariants;
- Product Owner giữ problem/outcome/scope/priority/metric và product acceptance intent; Architect giữ technical design; Orchestrator giữ điều phối; QA giữ verdict độc lập;
- scope conflict giữa current product và future marketplace phải được quyết định rõ, không âm thầm gộp;
- role/file ownership, skills/hooks/schemas, S0–S7, canonical predecessor/applicable-gate/exit-acceptance envelope, stop và handoff contract đúng 19 top-level key.

Khi sửa logic, cập nhật cả `MASTER-PROMPT.md` và `PROMPT-CHO-CHAT-DEV.md` trong cùng task, tăng version và chạy parity check. YAML/JSON trong `skills/`, `hooks/`, `schemas/`, `evals/` là contract machine-readable canonical dùng chung.

## Shared references

- Two-chat Product Owner + Dev 1 operating system: [`TWO-CHAT-OPERATING-SYSTEM.md`](./TWO-CHAT-OPERATING-SYSTEM.md)
- Token-efficient model router: [`models/model-routing-policy.yaml`](./models/model-routing-policy.yaml)
- Capability matrix: [`references/promptvn-capability-matrix.md`](./references/promptvn-capability-matrix.md)
- Domain limits/invariants: [`references/domain-invariants.md`](./references/domain-invariants.md)
- Vercel deployment/migration contract: [`references/vercel-deployment-contract.md`](./references/vercel-deployment-contract.md)
- Sprint prompt index: [`sprints/README.md`](./sprints/README.md)
- Runbook: [`RUNBOOK.md`](./RUNBOOK.md)
- Owner teach-back: [`LEARNING-CHECKLIST.md`](./LEARNING-CHECKLIST.md)

Tên file reference có thể giữ vì định tuyến kỹ thuật; nội dung và UI/copy đích chỉ dùng brand **ALIPROMPT**. URL `https://promptvn.com/` chỉ xuất hiện khi ghi rõ đây là nguồn tham chiếu không đáng tin cậy.
