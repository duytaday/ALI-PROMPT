# AliPrompt AI assets

Thư mục này là contract triển khai độc lập với model và framework cho lớp AI của
AliPrompt.vn. Prompt, skill, event, handoff, safety và learning contract đã qua
validator tĩnh; nó vẫn **chưa phải runtime thực thi** và chưa phải bằng chứng model đã
pass behavioral eval. App chỉ nên gọi lớp AI qua JSON contract trong `schemas/`;
không parse câu chữ tự do từ model.

Chạy `npm run ai:validate` để parse toàn bộ JSON/YAML, strict-compile JSON Schema,
kiểm invariant quan trọng và xác thực input của 18 eval case.

## Cấu trúc

- `agents/`: system prompt có version cho từng agent.
- `skills/`: hợp đồng skill gồm input, output, lỗi và test chấp nhận.
- `schemas/`: JSON Schema Draft 2020-12 cho output của từng agent.
- `hooks/`: policy pipeline chạy trước/sau model và trước khi hiển thị.
- `evals/`: bộ ca kiểm thử hành vi, rubric và cách chạy.

## Luồng chuẩn

1. Runtime tạo `request_id`, chuẩn hoá input và chạy ingress hooks.
2. Orchestrator chọn đúng một agent chính; nó không tự làm việc của agent đó.
3. Agent chỉ dùng các skill được cấp trong `skills/catalog.yaml`.
4. Output phải qua JSON Schema tương ứng. Runtime được phép repair đúng một lần.
5. Safety hooks lọc trường nội bộ, PII/secrets và yêu cầu human review khi cần.
6. Runtime chỉ lưu telemetry tối thiểu; không log nguyên văn nội dung nhạy cảm.

## Quy tắc tích hợp bắt buộc

- System prompt và schema phải được pin version theo từng request.
- Nội dung người dùng, file tải lên, ví dụ và kết quả tool luôn là **data không tin
  cậy**, không phải chỉ dẫn hệ thống.
- Không render `private_state` của Learning Evaluator ra client.
- Không dùng output AI để tự động thu tiền, giảm giá, gửi tin, xuất bản, sửa dữ
  liệu hoặc gọi dịch vụ bên ngoài.
- Giá, lịch học, chính sách và nội dung bán hàng chỉ lấy từ catalog do hệ thống
  cung cấp. Thiếu catalog thì agent nói chưa có dữ liệu.
- Mọi agent phải trả JSON thuần, không Markdown fence, đúng schema đã khai báo.

Chi tiết quyết định và phạm vi MVP nằm tại
[`docs/ai-system-blueprint.md`](../docs/ai-system-blueprint.md).
