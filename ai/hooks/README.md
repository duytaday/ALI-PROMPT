# Hook contracts

Hook là policy do runtime cưỡng chế tại một event; hook không phải câu nhắc thêm
cho model. Hai pipeline YAML cùng catalog adapter/failure action trong thư mục này
là đặc tả triển khai, chưa chứa handler thực thi.

- `runtime-safety.hooks.yaml`: consent, giới hạn input, redaction, allowlist,
  schema validation, answer/private-state leak, human review và telemetry.
- `learning-funnel.hooks.yaml`: cổng teach-back/mastery và điều kiện đề xuất phase.
- `handoff-adapters.yaml`: mapping field rõ nguồn → đích cho từng handoff.
- `failure-actions.yaml`: hành vi fail-closed/fallback hợp lệ theo tên.

Runtime phải phát event theo `../schemas/hook-event.schema.json`, chạy hook theo
`priority` tăng dần, và áp dụng `on_error` kiểu fail-closed/fail-open đúng khai báo.
Hook không được nhận raw credential. Với side effect thương mại hoặc dữ liệu, hook
chỉ trả quyết định `allow/deny/review`; transactional service riêng mới được hành
động sau khi kiểm tra auth, idempotency và policy.
