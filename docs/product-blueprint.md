# AliPrompt.vn — Product Blueprint V1

## 1. Bài toán thật sự

Khách hàng không mua “một đoạn prompt”. Họ mua một kết quả công việc nhanh hơn, ít vòng sửa hơn và một cách tự chẩn đoán khi AI làm sai.

Ba nhánh vấn đề cần tách rõ:

1. **Không biết hỏi**: mục tiêu, bối cảnh, dữ liệu hoặc format đầu ra chưa rõ. Prompt theo ngành có thể giải quyết.
2. **AI chưa hiểu cách mình làm việc**: cần instruction lâu dài, hồ sơ công việc, ví dụ đạt/chưa đạt, memory và checklist. Đây là Phase 2.
3. **Công việc có nhiều bước lặp lại**: cần trigger, tools, trạng thái, phê duyệt và xử lý lỗi. Đây mới là bài toán AI Agent ở Phase 3.

“Dạy AI” trong Phase 2 không mặc định là fine-tuning. Phần lớn khách hàng ban đầu cần cấu hình context, instruction, examples, memory và workflow.

## 2. Khách hàng đầu tiên

V1 tập trung vào **nhân sự Marketing & Content tại SME hoặc freelancer**, đã dùng ChatGPT vài lần mỗi tuần nhưng đầu ra còn chung chung.

Lý do chọn:

- Công việc lặp lại hằng ngày và dễ thử ngay.
- Kết quả trước/sau dễ nhìn thấy.
- Có cầu nối tự nhiên từ prompt đến “trợ lý hiểu thương hiệu”.
- Dễ tiếp cận qua nội dung mạng xã hội và cộng đồng nghề nghiệp.

Các ngành Sales, Nhân sự và Vận hành chỉ thu waitlist trong V1. Không mở thư viện rỗng để tạo cảm giác quy mô giả.

## 3. Thang giá trị và doanh thu

```text
Nội dung miễn phí
  → Prompt Lab: tạo và copy một prompt thật
  → Chấm lỗi đầu ra + nhận câu lệnh sửa
  → Prompt pack theo nghề (thử nghiệm 79K–129K)
  → Workshop “Dạy AI hiểu việc” 2 giờ — 199K
  → Bài đánh giá mức độ sẵn sàng
  → Waitlist khóa AI Agent 4–5 buổi
```

Nguyên tắc chuyển đổi:

- Cho khách một kết quả đầu tiên trước khi xin thông tin liên hệ.
- Chỉ giới thiệu Phase 2 sau khi đã thử sửa prompt và nhận ra lỗi thuộc context/data/tool/memory/workflow.
- Chỉ giới thiệu Phase 3 khi khách có một việc lặp lại, input và tiêu chuẩn kiểm tra đủ rõ.
- Không dùng khan hiếm giả, lời hứa thu nhập hoặc tuyên bố “AI làm thay hoàn toàn”.

## 4. Phạm vi web đã triển khai

Trang V1 là một conversion system một trang, gồm:

- Bộ định tuyến tự nhận diện Phase hiện tại.
- Danh mục ngành, với Marketing & Content là ngành đang mở.
- Prompt Lab tạo prompt từ bốn mảnh bối cảnh, copy được mà không cần đăng nhập.
- Vòng feedback chẩn đoán năm loại lỗi và đưa câu lệnh sửa tiếp.
- Landing workshop 2 giờ, giá và đầu ra minh bạch.
- Giới thiệu đúng bản chất Phase 3 và thu waitlist.
- Form đăng ký lưu bền vững, có consent, chuẩn hóa email/số điện thoại và ghi nhận số lần gửi lặp.
- Khối an toàn dữ liệu và giới hạn trách nhiệm.

## 5. Data model V1

Catalog prompt nên là nội dung version-controlled trong source. D1 chỉ lưu dữ liệu vận hành.

Hiện tại:

- `leads`: tên, kênh liên hệ, vai trò/ngành, intent, nguồn, consent, thời điểm tạo, số lần gửi và lần gửi gần nhất.
- Unique key theo `contact + intent` để double-click không tạo lead trùng.

Khi có giao dịch thật mới thêm:

- `orders`: một sản phẩm/đơn, số tiền, trạng thái và tham chiếu thanh toán.
- `access_grants`: quyền truy cập được backend cấp sau xác nhận thanh toán.
- `workshop_sessions` và `enrollments`: lịch, sức chứa, điểm danh.
- `prompt_feedback`: prompt, điểm và reason code, không lưu nội dung nhạy cảm.
- `events`: anonymous/user id, event name, entity key và metadata tối thiểu.

## 6. Chỉ số cần đo

North-star metric giai đoạn đầu:

> Số người hoàn thành brief, copy prompt và báo rằng kết quả “đã dùng được”.

Funnel metrics:

1. Xem Prompt Lab → hoàn thành bốn input.
2. Hoàn thành input → copy prompt.
3. Copy → gửi feedback.
4. Feedback lỗi nền tảng → xem workshop.
5. Xem workshop → để lại đăng ký.
6. Đăng ký → thanh toán → tham dự.
7. Sau workshop → tạo được Assistant Spec đạt rubric.

Chỉ số chứng minh workshop có giá trị không phải số vé bán; đó là tỷ lệ học viên tự tạo và test được một trợ lý V1 cho công việc thật.

## 7. Không xây trong V1

- Chat UI riêng hoặc gọi model trực tiếp.
- Multi-agent tự trị, RAG đa tenant hoặc vector database phức tạp.
- Marketplace prompt cộng đồng.
- Subscription, cart, coupon hoặc affiliate.
- LMS, chứng chỉ và cộng đồng nội bộ.
- App mobile.
- Tự động cấp quyền, hoàn tiền hoặc đổi giá bằng model AI.

Những phần này chỉ mở sau khi dữ liệu funnel cho thấy chúng giải quyết một nút thắt thật.

## 8. Điều kiện mở rộng

- Mở ngành thứ hai khi ít nhất một nhóm waitlist đủ lớn và có 15–25 prompt đã được kiểm chứng.
- Tự động hóa thanh toán khi xác nhận thủ công trở thành nút thắt vận hành.
- Thêm dashboard khi đã có nội dung trả phí cần quyền truy cập.
- Xây Phase 3 khi học viên Phase 2 có workflow lặp lại và đủ dữ liệu test.
