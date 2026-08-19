# AliPrompt.vn — Learning & Decision Checklist

Tài liệu này theo dõi những điều chủ dự án cần hiểu và có thể tự giải thích lại trước khi hệ thống được xem là bàn giao hoàn chỉnh.

## Cổng 1 — Hiểu bài toán kinh doanh

- [ ] Nói được khách hàng đầu tiên là ai và công việc nào khiến họ cần AI.
- [ ] Nói được họ trả tiền lần đầu cho kết quả gì, không chỉ cho “một bộ prompt”.
- [ ] Giải thích được vì sao prompt tốt vẫn có lúc cho kết quả kém.
- [ ] Phân biệt được ba nhánh nhu cầu: dùng prompt, cá nhân hoá trợ lý, xây AI agent.
- [ ] Nói được dấu hiệu nào khiến một khách hàng nên chuyển từ Phase 1 sang Phase 2.

### Giả định đang dùng để tiếp tục thiết kế

- Khách hàng đầu tiên là người đi làm/chủ kinh doanh nhỏ tại Việt Nam, chưa rành kỹ thuật nhưng đã thử ChatGPT.
- Sản phẩm vào cửa là bộ quy trình prompt theo nghề, tập trung vào kết quả công việc có thể dùng ngay.
- Workshop 2 giờ giá dự kiến 199.000đ là bước chẩn đoán và “xoá mù”: khách tự cấu hình được một trợ lý AI cơ bản.
- Khoá AI Agent chỉ được giới thiệu sau khi khách có nhu cầu lặp lại, cần dữ liệu/quy trình/công cụ phối hợp.

## Cổng 2 — Hiểu giải pháp và quyết định thiết kế

- [ ] Vẽ lại được funnel: nội dung miễn phí → prompt theo nghề → workshop → khoá chuyên sâu.
- [ ] Giải thích được vì sao V1 tối ưu cho một hành động chính thay vì xây sàn học tập đầy đủ.
- [ ] Nói được vai trò, đầu vào, đầu ra và ranh giới của từng AI agent.
- [ ] Phân biệt được agent, skill, prompt và hook.
- [ ] Phân biệt được blueprint/contract với runtime đã gọi model và eval đã chạy thật.
- [ ] Giải thích được vì sao agent không tự ý hứa kết quả, giảm giá hoặc gửi dữ liệu nhạy cảm.
- [ ] Nêu được các edge case: người dùng mới hoàn toàn, kỳ vọng sai, prompt chứa dữ liệu nhạy cảm, thanh toán lỗi, đăng ký trùng.

## Cổng 3 — Hiểu tác động vận hành

- [ ] Nói được dữ liệu nào cần đo ở từng bước funnel.
- [ ] Xác định được chỉ số chứng minh workshop tạo giá trị thật.
- [ ] Nói được nội dung nào con người phải duyệt trước khi xuất bản hoặc gửi cho khách.
- [ ] Giải thích được khi nào nên đầu tư đăng nhập, thanh toán tự động, CRM và hệ thống học tập.
- [ ] Chốt được ai kiểm soát dữ liệu, giữ lead bao lâu và xử lý yêu cầu xóa bằng cách nào trước khi mở public.
- [ ] Có thể tự mô tả một vòng cải tiến: quan sát → chẩn đoán → thử nghiệm → đo → cập nhật prompt/skill.

## Bằng chứng đã hiểu

Ghi lại câu trả lời, quyết định hoặc ví dụ do chủ dự án tự diễn đạt trong các buổi rà soát. Không đánh dấu chỉ vì đã đọc tài liệu.

## Cổng 4 — Hiểu quy trình GitHub → Vercel

- [ ] Phân biệt được commit local, push lên GitHub và deploy lên Vercel.
- [ ] Giải thích được vì sao không commit `.env`, token hoặc `.vercel/`.
- [ ] Biết GitHub không tự cấp biến môi trường cho Vercel; mỗi môi trường phải cấu hình riêng.
- [ ] Biết Preview cần được kiểm thử và chấp nhận trước khi deploy Production.
- [ ] Biết cách xác nhận branch, commit SHA và deployment URL đang được kiểm thử.
