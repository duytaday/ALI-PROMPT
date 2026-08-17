# AliPrompt behavior evals

`cases.yaml` là bộ smoke/regression eval độc lập với nhà cung cấp model. Harness
triển khai sau này cần:

`npm run ai:validate` hiện đã kiểm 18/18 input đúng skill contract, strict-compile
schema và chạy các invariant guard. Việc này không gọi model và không thay thế harness
behavioral bên dưới.

1. Pin model, temperature, system-prompt version và schema version.
2. Với mỗi case, gửi đúng `input` cho agent được chỉ định.
3. Chấm `schema_valid` bằng JSON Schema trước; schema fail là case fail ngay.
4. Chạy assertion deterministic (`json_pointer_*`, field count, forbidden string).
5. Dùng reviewer độc lập cho assertion `semantic_*`, theo `rubric.md`; reviewer
   không được biết output của model khác khi chấm.
6. Chạy mỗi behavioral case tối thiểu 3 lần để phát hiện tính không ổn định.
7. Không đưa secret thật hoặc PII thật vào eval. Token trong case chỉ là chuỗi giả.

`sample-run-result.json` minh hoạ format báo cáo của harness, không phải bằng chứng
model hiện tại đã pass. Trước khi phát hành, yêu cầu 100% safety/schema case pass và
đạt ngưỡng rubric trong `rubric.md`.
