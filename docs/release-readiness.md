# AliPrompt.vn — Release Readiness

Tài liệu này phân biệt rõ ba mức: **đã chạy**, **mới là thiết kế**, và **cần quyết định của chủ dự án**. Không dùng blueprint như bằng chứng rằng một tính năng đã hoạt động.

## Đã chạy trong V1

- Landing page giải thích ba phase và đưa khách về một hành động phù hợp.
- Prompt Lab Marketing & Content chạy trực tiếp trên trình duyệt, theo logic xác định trước; đây chưa phải model AI.
- Form đăng ký có validation, consent, giới hạn kích thước và lưu vào D1.
- Trang `/admin` chỉ cho account chủ dự án đã được allowlist; có danh sách lead và CSV export.
- Build production và test contract nguồn phải pass trước mỗi lần deploy.

## Contract đã sẵn để triển khai nhưng chưa có runtime

- 5 AI agents, 6 skills, 12 strict JSON schemas, safety/learning hooks, handoff mappings và 18 eval fixtures trong thư mục `ai/`.
- Validator đã parse mọi JSON/YAML, strict-compile schema, kiểm 8 invariant và xác thực input của 18/18 eval case.
- Các file này là implementation-ready contract, nhưng không tự gọi model, không tự chạy hook và chưa chứng minh chất lượng model.
- Chỉ được gọi là “AI runtime đã kiểm chứng” khi có handler thực thi, model/provider được cấu hình, eval harness chạy thật, log an toàn và approval gate được test.

## Cổng bắt buộc trước khi mở public

- [ ] Chủ dự án xác nhận customer đầu tiên, kết quả trả phí đầu tiên và dấu hiệu chứng minh giá trị.
- [ ] Chủ dự án cho phép đổi quyền truy cập từ owner-only sang public.
- [ ] Chốt domain/canonical dùng khi public.
- [ ] Chốt đơn vị kiểm soát dữ liệu, kênh liên hệ riêng tư, thời hạn giữ lead và quy trình xóa.
- [ ] Chốt cách thanh toán, cách xác minh, chính sách hoàn/hủy và cách xếp lớp.
- [ ] Chạy smoke test trên production: landing → Prompt Lab → đăng ký → thấy lead ở `/admin` → export CSV.
- [ ] Xác minh focus bàn phím, mobile và nội dung tiếng Việt trên trình duyệt thật.

## Vertical slice kinh doanh nên đo đầu tiên

```text
khách phù hợp
  → hoàn thành Prompt Lab
  → nhận ra khoảng trống không thể sửa chỉ bằng prompt
  → đăng ký workshop
  → được xác nhận thủ công
  → thanh toán
  → tham dự
  → tự tạo và test được một Assistant Spec
```

Chỉ số giá trị cốt lõi của workshop không phải số người để lại form. Đó là tỷ lệ học viên sau buổi học có thể tự tạo, kiểm thử và giải thích một Assistant Spec cho đúng công việc của họ.

## Những việc không tự động hóa ở V1

- Không để AI tự đặt giá, hứa lịch, xác nhận thanh toán hoặc cấp quyền học.
- Không dùng AI để suy đoán thông tin liên hệ hay bổ sung dữ liệu cá nhân.
- Không mở khoá Phase 3 chỉ vì khách nói “muốn học agent”; cần có nhu cầu workflow lặp lại, dữ liệu/công cụ và tiêu chí đánh giá rõ.
- Không thêm analytics theo dõi hành vi trước khi event contract và chính sách dữ liệu được duyệt.
