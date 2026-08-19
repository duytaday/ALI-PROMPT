import { getDb, closeDatabase } from "./index";
import { categories, prompts } from "./schema";

const seedCategories = [
  { slug: "lam-ro-brief", name: "Làm rõ brief", description: "Biến một yêu cầu mơ hồ thành đầu vào có thể làm việc.", sortOrder: 10 },
  { slug: "noi-dung-chien-dich", name: "Nội dung & chiến dịch", description: "Lập kế hoạch, thông điệp và nội dung có ràng buộc rõ.", sortOrder: 20 },
  { slug: "van-hanh-sop", name: "Vận hành & SOP", description: "Chuẩn hóa công việc lặp lại và điểm kiểm tra.", sortOrder: 30 },
  { slug: "hoc-va-nghien-cuu", name: "Học & nghiên cứu", description: "Học nhanh hơn mà vẫn phân biệt dữ kiện, giả định và nguồn.", sortOrder: 40 },
] as const;

const seedPrompts = [
  {
    slug: "brief-khach-hang-khong-bo-sot",
    categorySlug: "lam-ro-brief",
    title: "Chuyển yêu cầu khách hàng mơ hồ thành brief có thể thực thi",
    summary: "Tạo bộ câu hỏi làm rõ, giả định và tiêu chí nghiệm thu trước khi bắt tay làm.",
    body: `Bạn là người điều phối dự án. Dựa trên yêu cầu dưới đây, đừng tạo ra phương án ngay.

1. Tóm tắt mục tiêu và đầu ra mà bạn đã hiểu.
2. Liệt kê các thông tin còn thiếu theo mức độ ảnh hưởng.
3. Hỏi tối đa 5 câu quan trọng nhất.
4. Tách rõ dữ kiện đã có, giả định và điều cần khách hàng xác nhận.
5. Đề xuất tiêu chí nghiệm thu có thể kiểm tra.

Yêu cầu gốc: [DÁN YÊU CẦU]
Ràng buộc: [NGÂN SÁCH / THỜI GIAN / KÊNH / PHÁP LÝ]`,
  },
  {
    slug: "ke-hoach-noi-dung-co-chung-cu",
    categorySlug: "noi-dung-chien-dich",
    title: "Lập kế hoạch nội dung từ insight đã được cung cấp",
    summary: "Xây kế hoạch có góc tiếp cận, bằng chứng còn thiếu và CTA phù hợp thay vì các ý tưởng chung chung.",
    body: `Bạn là chiến lược gia nội dung. Chỉ sử dụng dữ liệu tôi cung cấp; không tạo số liệu, review hay cam kết mới.

Hãy tạo bảng gồm: insight, mối quan tâm của khách, góc nội dung, hook, định dạng, CTA, dữ liệu cần xác minh.
Sau đó tự kiểm tra: các ý có khác nhau thật không, và câu nào đang dựa trên giả định?

Sản phẩm: [SẢN PHẨM]
Khách hàng: [KHÁCH HÀNG]
Dữ liệu đã xác minh: [DỮ LIỆU]
Mục tiêu: [MỤC TIÊU]`,
  },
  {
    slug: "sop-cong-viec-lap-lai",
    categorySlug: "van-hanh-sop",
    title: "Đóng gói việc lặp lại thành SOP có điểm kiểm tra",
    summary: "Biến một công việc lặp lại thành quy trình để con người hoặc AI hỗ trợ có kiểm soát.",
    body: `Bạn là chuyên viên vận hành. Hãy chuyển công việc dưới đây thành SOP ngắn gọn.

Với mỗi bước, nêu: đầu vào, thao tác, đầu ra, người chịu trách nhiệm, điều kiện dừng và lỗi thường gặp.
Chỉ rõ bước nào AI có thể hỗ trợ, bước nào phải có người phê duyệt và lý do.
Nếu thiếu dữ liệu, hãy hỏi trước khi suy đoán.

Công việc: [MÔ TẢ]
Tần suất: [TẦN SUẤT]
Tiêu chuẩn đạt: [TIÊU CHUẨN]`,
  },
  {
    slug: "doc-tai-lieu-khong-nham-lan",
    categorySlug: "hoc-va-nghien-cuu",
    title: "Đọc tài liệu và phân biệt dữ kiện với suy luận",
    summary: "Tóm tắt tài liệu mà vẫn giữ được nguồn, mức độ chắc chắn và câu hỏi mở.",
    body: `Đọc tài liệu dưới đây và tạo ba phần riêng biệt:

A. Dữ kiện được nêu trực tiếp, kèm vị trí hoặc trích đoạn ngắn.
B. Suy luận hợp lý nhưng chưa được khẳng định.
C. Câu hỏi cần tìm nguồn khác để trả lời.

Không thêm kiến thức bên ngoài nếu tôi không yêu cầu. Cuối cùng, viết tóm tắt 5 gạch đầu dòng cho người ra quyết định.

Tài liệu: [DÁN NỘI DUNG]`,
  },
] as const;

async function seed() {
  const environment = process.env.ALIPROMPT_ENVIRONMENT;
  if (environment !== "development" && environment !== "preview") {
    throw new Error("Refusing to seed outside development or Preview.");
  }

  const db = getDb();
  await db.insert(categories).values([...seedCategories]).onConflictDoNothing({ target: categories.slug });
  const storedCategories = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const categoryBySlug = new Map(storedCategories.map((category) => [category.slug, category.id]));

  await db.insert(prompts).values(seedPrompts.map((prompt) => ({
    slug: prompt.slug,
    title: prompt.title,
    summary: prompt.summary,
    body: prompt.body,
    categoryId: categoryBySlug.get(prompt.categorySlug),
    sourceKind: "aliprompt" as const,
    moderationStatus: "approved" as const,
    accessKind: "free" as const,
    publishedAt: new Date().toISOString(),
  }))).onConflictDoNothing({ target: prompts.slug });
}

seed().then(() => closeDatabase()).catch(async (error) => {
  await closeDatabase();
  console.error(error instanceof Error ? error.message : "Unable to seed ALIPROMPT content.");
  process.exitCode = 1;
});
