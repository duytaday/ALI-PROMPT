# ALIPROMPT Prompt Knowledge Network — Product Requirements

`decision_id: AP-PDN-001`  
`status: approved_next`  
`owner: ALIPROMPT human owner`  
`effective_date: 2026-08-17`  
`reference_observed: https://promptvn.com/`  
`reference_observed_at: 2026-08-17`

## 1. Product thesis

ALIPROMPT trở thành **mạng tri thức hỏi–đáp dành cho việc giải quyết bài toán bằng AI prompt**:

> Người dùng mô tả bài toán; chuyên gia trả lời bằng prompt có output; người khác thử lại, vote và giúp giải pháp đáng tin nhất nổi lên.

Đơn vị giá trị không phải một đoạn prompt đứng riêng, mà là:

`bài toán + prompt answer + hướng dẫn chạy + output minh chứng + kết quả thử lại + tín hiệu cộng đồng`.

Commerce một người bán của ALIPROMPT tiếp tục là domain riêng. Contributor cộng đồng không được đặt giá, nhận payout hay tự publish sản phẩm trả phí.

## 2. Bằng chứng baseline từ PromptVN

Khảo sát read-only cho thấy PromptVN hiện có:

- 31 danh mục ngành/ngách;
- tìm kiếm theo từ khóa và danh mục;
- form guest/member đăng tên tác giả, danh mục, tiêu đề, prompt và một ảnh tối đa 3 MB;
- like, dislike, favorite, copy, report và view count;
- các shelf “xem nhiều nhất”, “nhiều like nhất”, “mới nhất”;
- leaderboard xếp theo số bài, rồi lượt xem và lượt thích;
- prompt detail mở trong modal, chưa có URL tri thức canonical riêng;
- leaderboard đang hiển thị email thành viên ra công khai.

Baseline có supply và taxonomy ban đầu nhưng vẫn là **gallery một tầng**. Nó chưa biểu diễn được một bài toán có nhiều giải pháp, accepted answer, output do người khác thử, revision history, duplicate, reputation ledger hoặc quyền moderation theo uy tín.

### Quyết định clean-room

Chỉ học mô hình hành vi và khoảng trống sản phẩm. Không sao chép source code, asset, copy, dữ liệu cá nhân hay nội dung prompt của website tham khảo khi chưa có quyền sử dụng.

## 3. ICP và jobs-to-be-done

### Người cần kết quả

Khi có một bài toán cụ thể, họ muốn tìm hoặc hỏi một prompt đã có bằng chứng để giảm số lần thử sai.

### Prompt Expert

Khi có giải pháp tốt, họ muốn chứng minh năng lực, tích lũy uy tín theo ngách và được cộng đồng công nhận.

### Reviewer/Moderator

Khi thư viện tăng trưởng, họ muốn gom duplicate, sửa nội dung và loại spam để tri thức không xuống cấp.

### ALIPROMPT

Muốn tích lũy dữ liệu “prompt nào hoạt động, với model nào, trong bối cảnh nào” để tạo traffic, retention và nhu cầu cho sản phẩm/dịch vụ do ALIPROMPT bán.

## 4. Content model

| Khái niệm | Ý nghĩa |
|---|---|
| Question | Bài toán, mục tiêu, bối cảnh, input và ràng buộc cần AI giải quyết |
| Prompt Answer | Một giải pháp gồm prompt, biến, cách chạy, model tương thích và output của tác giả |
| Attempt | Một người khác thử Prompt Answer và ghi success/partial/fail cùng output tùy chọn |
| Accepted Answer | Prompt Answer mà chủ Question xác nhận đã giải quyết bài toán của họ |
| Vote | Đánh giá nội dung hữu ích hay không; khác với Attempt |
| Comment | Yêu cầu làm rõ hoặc góp ý nhỏ, không phải một giải pháp mới |
| Revision | Lịch sử chỉnh sửa có attribution và rollback |
| Tag | Ngành, tác vụ, model hoặc loại output để tìm và quản trị tri thức |
| Duplicate link | Một Question trỏ về canonical Question đã giải quyết cùng bài toán |
| Reputation | Uy tín tích lũy từ đóng góp hữu ích, được ghi bằng ledger |

### Hai cửa vào, một model

1. **Đặt bài toán** tạo Question, chờ cộng đồng trả lời.
2. **Chia sẻ prompt** tạo Question và Prompt Answer của chính người chia sẻ trong một transaction.

Không tạo content type “prompt post” thứ ba. Quy tắc này giữ navigation dễ hiểu và cho phép migrate prompt cũ thành self-answered Question.

## 5. Core journeys

### Journey A — Tìm giải pháp

`Search/tag → Question canonical → so sánh Prompt Answers → xem output/attempt → copy/save → thử → gửi Attempt`

### Journey B — Đặt bài toán

`Đăng nhập → nhập goal/context/input/constraint → gợi ý duplicate → chọn tag → moderation → nhận answers → thử → accept`

### Journey C — Chia sẻ prompt

`Đăng nhập → mô tả use case → nhập prompt/variables/model → upload output → preview → moderation → publish self-answer`

### Journey D — Community governance

`System/user flag → review queue → leave/edit/duplicate/close/reject → audit event → notify author`

## 6. Business rules khóa cho MVP

### Question

- Chỉ tài khoản đã xác minh email mới được tạo Question.
- Bắt buộc có title theo outcome, goal, context, constraint và từ 1–5 tag.
- Không chứa secret, raw PII hoặc nội dung khách hàng chưa được phép chia sẻ.
- Trước submit phải hiện các Question có khả năng duplicate.
- Question có thể `draft`, `pending`, `published`, `closed`, `duplicate`, `archived`.

### Prompt Answer

- Bắt buộc có prompt body, hướng dẫn thay biến, model/tool đã chạy và ít nhất một Output Evidence.
- Output Evidence có thể là text, JPG, PNG, WebP hoặc PDF trong MVP.
- Một answer không có evidence chỉ được lưu draft, không được tính vào ranking.
- Owner của Question có thể accept đúng một answer và có thể đổi lựa chọn.
- Self-answer được phép; acceptance của self-answer không tạo reputation và phải qua thời gian chờ cấu hình.
- Mỗi thay đổi prompt body tạo Prompt Version; Attempt luôn trỏ tới đúng version đã thử.

### Vote, save và attempt

- Một user có tối đa một vote trên mỗi Question hoặc Answer; vote có thể đổi hoặc rút.
- Không được vote nội dung của chính mình.
- Vote đo tính hữu ích; Attempt đo kết quả thực nghiệm. Không gộp hai tín hiệu.
- Một user được tạo nhiều Attempt khi model/version hoặc thời điểm thử khác nhau; mỗi Attempt phải khai báo outcome `success`, `partial` hoặc `failed`.
- Favorite hiện tại trở thành bookmark cá nhân và không tác động reputation/ranking trực tiếp.

### Moderation và privacy

- Guest submission mặc định tắt theo Active Product Contract.
- Email, IP, abuse fingerprint và file quarantine metadata không bao giờ hiển thị công khai.
- Public leaderboard chỉ hiển thị display name, reputation, helpful answers, accepted answers và verified attempts.
- Upload phải kiểm tra MIME thực, dung lượng, malware, metadata nhạy cảm và moderation trước khi public.
- Report không tự động xóa nội dung; nó mở moderation case có reason, evidence và audit trail.

## 7. Ranking

Không xếp hạng chỉ theo view hoặc tổng số bài.

### Question feed

Tách rõ các tab:

- `Cần câu trả lời`: chưa có Prompt Answer đủ evidence;
- `Đang hoạt động`: có tương tác gần đây;
- `Đã kiểm chứng`: có Attempt success từ người khác;
- `Mới nhất`;
- `Theo tag của tôi`.

### Answer order

Thứ tự mặc định dùng score có điều chỉnh, không dùng average thô:

1. accepted signal;
2. helpful vote score với Bayesian/Wilson adjustment;
3. tỷ lệ Attempt success có confidence theo sample size;
4. freshness và model-version compatibility;
5. moderation/trust penalty.

Công thức và trọng số phải versioned, observable và chống gaming; Product Owner không khóa số khi chưa có dữ liệu S0.

## 8. Reputation và đặc quyền

Reputation là ledger sự kiện, không chỉ là một counter có thể sửa tùy ý. Event gợi ý gồm `answer_upvoted`, `answer_accepted`, `attempt_helpful`, `valid_flag`, `content_penalty`, `vote_reversal`.

Trong MVP, reputation chỉ tạo tín hiệu và badge; quyền moderation nhạy cảm vẫn do editor/admin. Chỉ mở privilege tự động khi có đủ dữ liệu chống abuse. Threshold là cấu hình có version, không hard-code vào UI.

Privilege theo lộ trình:

- comment và đề xuất edit;
- review first posts/answers;
- tạo hoặc sửa tag;
- vote duplicate/close/reopen;
- direct edit với revision/rollback;
- truy cập moderation tools giới hạn.

## 9. Scope

### MUST — MVP knowledge loop

- Question, Prompt Answer, Output Evidence và Attempt;
- ask và self-answer share flow;
- canonical detail URL có indexability;
- tag, search và duplicate suggestion;
- up/down vote, bookmark và accepted answer;
- prompt versioning;
- report, moderation queue và audit trail;
- public profile không lộ PII;
- reputation ledger ở chế độ signal-only;
- migration tương thích dữ liệu catalog hiện có.

### LATER

- bounty bằng reputation/credit;
- privilege moderation tự mở;
- comments nâng cao, chat và follow;
- semantic/vector search;
- arbitrary office/archive upload;
- creator payout hoặc multi-vendor;
- AI auto-judge chất lượng prompt;
- tiền thật trong bounty.

### OUT

- sao chép code/data/asset từ PromptVN;
- public email leaderboard;
- anonymous auto-publish;
- lấy view count hoặc số bài làm thước đo chất lượng chính;
- contributor tự biến community answer thành paid product.

## 10. Product outcome và metrics

### Outcome

Người dùng tìm hoặc nhận được Prompt Answer có bằng chứng, thử nó và để lại tín hiệu xác nhận đủ tốt để người sau quyết định nhanh hơn.

### North-star

`Weekly Verified Successful Attempts (WVSA)` = số Attempt `success` hợp lệ mỗi tuần, do người không phải tác giả answer gửi, không bị moderation loại và gắn với một Prompt Version cụ thể.

Target tuyệt đối: `TBD_IN_S0_WITH_OWNER`.

### Leading metrics

- tỷ lệ Question nhận answer đủ evidence trong 24/72 giờ;
- time-to-first-evidenced-answer;
- tỷ lệ view Question → copy/save;
- tỷ lệ copy → Attempt;
- answer coverage theo tag;
- tỷ lệ user quay lại 7/30 ngày;
- tỷ lệ self-share được người khác thử.

### Guardrails

- report hợp lệ trên 1.000 lượt xem;
- duplicate rate và unanswered rate;
- moderation SLA và appeal overturn rate;
- suspicious-vote reversal rate;
- upload rejection/malware rate;
- storage/bandwidth cost trên một WVSA;
- PII exposure incidents = 0;
- prompt failure tăng sau model update.

## 11. Go / pivot / stop

- **Go:** người dùng ngoài tác giả tạo Attempt success lặp lại và Question có evidence answer tăng theo cohort.
- **Pivot:** traffic/copy tăng nhưng Attempt rất thấp; phải giảm friction hoặc thay cách thu evidence trước khi mở rộng feature.
- **Stop mở rộng community privilege:** vote gaming, PII, moderation backlog hoặc abuse vượt guardrail.
- **Không suy luận:** nhiều prompt/view không chứng minh knowledge loop hoạt động.

## 12. Product acceptance

MVP chỉ đạt product intent khi một user có thể đặt bài toán, một user khác trả lời bằng prompt + output, người hỏi accept, user thứ ba gửi Attempt, và toàn bộ vote/reputation/moderation/version history nhất quán qua success, unauthorized, duplicate, edit và report branches.

Technical QA và release approval vẫn do reviewer/gate tương ứng; Product Owner không tự biến tài liệu này thành bằng chứng đã implemented hoặc released.
