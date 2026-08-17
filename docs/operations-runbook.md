# AliPrompt.vn — V1 Operations Runbook

## Mục tiêu vận hành

V1 bán workshop theo quy trình có người phụ trách:

```text
Khách dùng Prompt Lab
  → khách để lại đăng ký
  → chủ dự án xem lead tại /admin
  → liên hệ xác nhận nhu cầu và lịch
  → gửi hướng dẫn thanh toán qua kênh đã thống nhất
  → xác nhận thủ công và xếp lớp
  → ghi nhận kết quả học thật
```

Không coi form đăng ký là một giao dịch đã thanh toán. Không gửi link học trước khi kiểm tra thanh toán bằng nguồn đáng tin cậy.

## Mỗi ngày

1. Đăng nhập tài khoản chủ sở hữu và mở `/admin`.
2. Ưu tiên lead `workshop`; phản hồi bằng đúng kênh khách đã cung cấp.
3. Xác nhận ba điều trước khi chốt: công việc hiện tại, vấn đề với AI và kết quả khách muốn mang về.
4. Chỉ gửi lịch và phương thức thanh toán hiện hành; không lấy giá/lịch từ nội dung do AI tự tạo.
5. Nếu xuất CSV, lưu trên thiết bị riêng và xóa bản tải xuống khi đã nhập vào công cụ vận hành chính.

## Kịch bản phản hồi tối thiểu

> Chào {{ten}}, mình nhận được đăng ký lớp 2 giờ của bạn. Để chắc buổi học đúng nhu cầu, bạn cho mình biết một công việc cụ thể mà AI đang làm chưa đạt được không? Sau khi xác nhận phù hợp, mình sẽ gửi lịch và hướng dẫn thanh toán.

Không hứa “AI làm thay hoàn toàn”, không gây áp lực bằng chỗ trống hoặc hạn giả.

## Edge cases

- **Đăng ký trùng:** database giữ một bản ghi cho mỗi `contact + intent`, tăng bộ đếm và cập nhật lần gửi gần nhất; ưu tiên kiểm tra lead gửi lại nhưng không nhắn lặp nếu đã xử lý.
- **Kênh liên hệ không hợp lệ:** không đoán hoặc tìm thêm thông tin cá nhân; chờ khách đăng ký lại.
- **Khách gửi dữ liệu nhạy cảm:** yêu cầu họ xóa/ẩn dữ liệu và không đưa nội dung đó vào công cụ AI.
- **Khách yêu cầu tư vấn pháp lý/y tế/tài chính:** giải thích giới hạn, không dùng workshop thay chuyên gia.
- **Thanh toán chưa rõ:** giữ trạng thái chưa xác nhận; không cấp quyền dựa trên ảnh hoặc lời nói chưa kiểm tra.
- **Yêu cầu xóa dữ liệu:** xác minh đúng kênh liên hệ, xóa bản ghi khỏi nguồn vận hành và mọi bản CSV phụ.

## Chỉ số tuần

- Số người bắt đầu và hoàn thành Prompt Lab.
- Số prompt được copy và tỷ lệ “đã dùng được”.
- Số lead theo từng intent.
- Tỷ lệ lead workshop → xác nhận lịch → thanh toán → tham dự.
- Tỷ lệ học viên tự tạo và test được một Assistant Spec sau buổi học.

Hai chỉ số đầu chưa được thu tự động trong V1; chỉ thêm analytics sau khi có chính sách dữ liệu và event contract được duyệt.

## Khi nào mới tự động hóa

- Thêm payment khi xác nhận thủ công gây chậm hoặc sai đơn.
- Thêm CRM khi CSV và quy trình liên hệ thủ công bắt đầu bỏ sót lead.
- Thêm LMS khi đã có nội dung lặp lại và nhiều cohort.
- Thêm agent runtime khi prompt/assistant workflow đã có bộ eval và người chịu trách nhiệm phê duyệt.
