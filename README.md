# AliPrompt.vn

AliPrompt giúp người Việt đi từ **biết hỏi AI**, đến **biết dạy AI hiểu công việc**, rồi **biết giao việc qua một quy trình AI Agent có kiểm soát**.

## V1 gồm những gì

- Landing page phân tuyến khách theo ba Phase.
- Prompt Lab cho Marketing & Content: điền brief, tạo/copy prompt, chẩn đoán lỗi và nhận câu lệnh sửa.
- Landing workshop thực hành 2 giờ, giá 199.000đ.
- Waitlist các ngành tiếp theo và lộ trình AI Agent.
- Lead capture lưu trong Cloudflare D1, có consent, validation và chống gửi trùng.
- Bộ agent prompts, skill specs, JSON schemas, hooks và eval cases trong `ai/`.

## Chạy local

Yêu cầu Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Kiểm tra bản production:

```bash
npm run build
```

Khi schema D1 thay đổi:

```bash
npm run db:generate
```

## Cấu trúc quan trọng

- `app/`: website và API lead capture.
- `db/`: schema và lớp truy cập D1.
- `drizzle/`: migration được áp dụng khi deploy.
- `ai/`: agent system có version, schema và eval.
- `docs/product-blueprint.md`: mô hình kinh doanh và phạm vi V1.
- `docs/ai-system-blueprint.md`: cách điều phối agent, skill và hook.
- `docs/learning-checklist.md`: checklist kiến thức cần chủ dự án tự giải thích được.

## Ranh giới V1

V1 chưa có cổng thanh toán, dashboard học viên, LMS hoặc agent runtime gọi model thật. Form hiện thu lead để kiểm chứng nhu cầu và vận hành workshop thủ công. Chỉ tự động hóa giao dịch sau khi funnel đã có dữ liệu thật.

