import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DATASET_VERSION = "prompt-seed-v1";
const CREATED_AT = "2026-08-19T00:00:00.000Z";
const DEFAULT_OUTPUT_ROOT = path.resolve("test-data/prompt-seed-v1");
const DRY_RUN_OUTPUT_ROOT = path.resolve("test-data/prompt-seed-v1-dry-run");
const CATEGORY_SIZE = 100;
const RATIOS = [
  ["1:1", 1024, 1024, 20],
  ["4:5", 1024, 1280, 20],
  ["9:16", 1024, 1820, 15],
  ["16:9", 1820, 1024, 20],
  ["3:2", 1536, 1024, 15],
  ["2:3", 1024, 1536, 10],
];
const DIFFICULTIES = [
  ["beginner", 30],
  ["intermediate", 45],
  ["advanced", 25],
];

/**
 * Each pair changes the subject and the delivery objective. The remaining visual
 * dimensions rotate independently so this is not a same-prompt word swap.
 */
const categories = [
  {
    id: "social-media-short-video", vi: "Mạng xã hội và video ngắn", en: "Social Media & Short Video",
    useCase: "creator content", styleTags: ["creator-ready", "short-form"],
    subjects: [["a fictional ceramicist shaping a cobalt cup", "một nghệ nhân gốm hư cấu đang tạo hình chiếc cốc xanh cobalt"], ["a street-food vendor plating herb noodles", "một người bán đồ ăn đường phố đang bày tô mì rau thơm"], ["a runner tying shoes before sunrise", "một người chạy bộ buộc dây giày trước bình minh"], ["a home baker glazing citrus cakes", "một thợ làm bánh tại nhà phủ men bánh cam"], ["a florist assembling a wildflower bundle", "một người cắm hoa kết bó hoa dại"], ["a vinyl selector cueing a record", "một người chọn nhạc vinyl đặt kim vào đĩa"], ["a travel maker packing a small carry-on", "một nhà sáng tạo du lịch xếp hành lý xách tay"], ["a maker restoring a wooden stool", "một người thợ phục chế ghế gỗ"], ["a barista pouring leaf-shaped foam", "một barista rót bọt sữa hình chiếc lá"], ["a product stylist arranging handmade stationery", "một stylist sản phẩm sắp xếp văn phòng phẩm thủ công"]],
    concepts: [["a six-second vertical process hook", "hook quy trình dọc sáu giây"], ["a save-worthy before-and-after story", "câu chuyện trước–sau đáng lưu"], ["a thumbnail for a practical tutorial", "thumbnail cho tutorial thực hành"], ["a three-frame launch teaser", "teaser ra mắt ba khung hình"], ["a quiet day-in-the-life reel cover", "bìa reel day-in-the-life nhẹ nhàng"], ["a creator challenge announcement", "thông báo thử thách dành cho creator"], ["a short review montage", "montage review ngắn"], ["a community question sticker background", "nền sticker câu hỏi cộng đồng"], ["a behind-the-scenes carousel opener", "mở đầu carousel hậu trường"], ["a vertical recap card", "thẻ recap dọc"]],
  },
  {
    id: "marketing-branding-aeo", vi: "Marketing, thương hiệu và AEO", en: "Marketing, Branding & AEO",
    useCase: "campaign concept", styleTags: ["brand-safe", "campaign"],
    subjects: [["a fictional Northstar Coffee seasonal cup", "ly đồ uống theo mùa của Northstar Coffee hư cấu"], ["a Luma Studio design workshop table", "bàn workshop thiết kế của Luma Studio"], ["a Verde Market produce crate", "thùng nông sản của Verde Market"], ["an Orbit SaaS customer dashboard concept", "concept dashboard khách hàng của Orbit SaaS"], ["a Mộc Living linen chair", "ghế bọc vải lanh của Mộc Living"], ["a neighborhood repair service toolkit", "bộ dụng cụ dịch vụ sửa chữa khu phố"], ["a refill-store glass dispenser wall", "tường bình phân phối bằng kính của cửa hàng refill"], ["a small-batch tea discovery set", "bộ khám phá trà sản xuất nhỏ"], ["a circular-fashion textile swatch", "mẫu vải thời trang tuần hoàn"], ["a local maker-market welcome desk", "quầy chào đón chợ phiên của người làm địa phương"]],
    concepts: [["an answer-engine-ready explainer visual", "visual giải thích sẵn sàng cho answer engine"], ["a trust-building campaign key visual", "key visual chiến dịch xây dựng niềm tin"], ["a comparison landing-page hero", "hero cho landing page so sánh"], ["a search-intent content cover", "bìa nội dung theo search intent"], ["a launch narrative with room for a short headline", "câu chuyện ra mắt có chỗ cho headline ngắn"], ["a customer-proof social card", "social card bằng chứng khách hàng"], ["a brand values editorial image", "ảnh editorial về giá trị thương hiệu"], ["a conversion-oriented offer background", "nền ưu đãi hướng chuyển đổi"], ["a partnership announcement visual", "visual thông báo hợp tác"], ["a FAQ section illustration", "minh họa cho phần FAQ"]],
  },
  {
    id: "ecommerce-product-visuals", vi: "Thương mại điện tử và hình ảnh sản phẩm", en: "Ecommerce & Product Visuals",
    useCase: "product merchandising", styleTags: ["product-photography", "commerce"],
    subjects: [["a matte ceramic travel mug", "cốc du lịch gốm mờ"], ["a folded organic-cotton shirt", "áo cotton hữu cơ gấp gọn"], ["a clear glass skincare jar with no label", "hũ chăm sóc da thủy tinh trong không nhãn"], ["a handmade desk organizer", "kệ tổ chức bàn làm việc thủ công"], ["a recycled-paper notebook", "sổ giấy tái chế"], ["a linen table runner", "khăn trải bàn vải lanh"], ["a compact wireless speaker with no logo", "loa không dây nhỏ không logo"], ["a natural soy candle", "nến đậu nành tự nhiên"], ["a stainless lunch container", "hộp cơm inox"], ["a woven market basket", "giỏ đi chợ đan lát"]],
    concepts: [["a clean marketplace listing hero", "hero listing marketplace sạch"], ["a social-commerce bundle tile", "tile gói sản phẩm social commerce"], ["a texture-focused product detail", "ảnh chi tiết tập trung vào texture"], ["a gifting-season collection image", "ảnh bộ sưu tập mùa quà tặng"], ["a comparison-ready product lineup", "bố cục sản phẩm sẵn sàng so sánh"], ["a mobile-first offer card", "thẻ ưu đãi mobile-first"], ["a lifestyle usage scene", "cảnh sử dụng theo lifestyle"], ["a sustainable-material story image", "ảnh kể chuyện vật liệu bền vững"], ["a catalog thumbnail with strong silhouette", "thumbnail catalog có silhouette rõ"], ["a landing-page conversion visual", "visual chuyển đổi landing page"]],
  },
  {
    id: "visual-design-ai-art", vi: "Thiết kế thị giác và AI art", en: "Visual Design & AI Art",
    useCase: "editorial visual", styleTags: ["editorial", "art-direction"],
    subjects: [["a sculptural paper moon", "mặt trăng bằng giấy điêu khắc"], ["a weathered chrome chair", "chiếc ghế chrome phong hóa"], ["a hand-built type-block composition without readable text", "bố cục khối chữ làm tay không có chữ đọc được"], ["a translucent resin object", "vật thể nhựa resin trong mờ"], ["a fractured clay vessel", "bình đất sét có vết nứt"], ["a luminous fabric tunnel", "đường hầm vải phát sáng"], ["a modular ink landscape", "phong cảnh mực mô-đun"], ["a rough-cut collage of abstract materials", "collage cắt thô từ vật liệu trừu tượng"], ["a folded metal mobile", "mobile kim loại gấp"], ["a hand-printed color field", "mảng màu in thủ công"]],
    concepts: [["an imperfect-by-design magazine opener", "mở đầu tạp chí imperfect-by-design"], ["a cinematic festival poster background", "nền poster lễ hội điện ảnh"], ["an experimental album-cover concept", "concept bìa album thử nghiệm"], ["a gallery invitation visual", "visual thiệp mời gallery"], ["a design-system moodboard anchor", "điểm neo moodboard design system"], ["a large-format editorial spread", "trang editorial khổ lớn"], ["a tactile art-direction study", "nghiên cứu art direction giàu xúc giác"], ["an abstract product-launch visual", "visual ra mắt sản phẩm trừu tượng"], ["a cultural-program campaign image", "ảnh chiến dịch chương trình văn hóa"], ["a visual identity exploration", "khám phá visual identity"]],
  },
  {
    id: "business-startup-ai-agents", vi: "Kinh doanh, startup và AI agents", en: "Business, Startup & AI Agents",
    useCase: "business communication", styleTags: ["business", "workflow"],
    subjects: [["a small team mapping a support workflow", "nhóm nhỏ vẽ luồng hỗ trợ khách hàng"], ["a fictional agent handoff dashboard", "dashboard bàn giao agent hư cấu"], ["a founder reviewing a simple weekly plan", "nhà sáng lập xem kế hoạch tuần đơn giản"], ["a service blueprint on a studio wall", "service blueprint trên tường studio"], ["a calm operations desk with paper checklists", "bàn vận hành gọn gàng với checklist giấy"], ["a customer-feedback sorting board", "bảng phân loại phản hồi khách hàng"], ["a remote workshop with shared notes", "workshop từ xa có ghi chú chung"], ["a product discovery roadmap", "roadmap khám phá sản phẩm"], ["a lightweight automation map", "sơ đồ automation gọn nhẹ"], ["a pilot metrics review scene", "cảnh rà soát số liệu pilot"]],
    concepts: [["a trustworthy AI-agent explainer", "visual giải thích AI agent đáng tin"], ["a startup pitch-deck section", "phần của pitch deck startup"], ["an operations playbook cover", "bìa operations playbook"], ["a workflow adoption announcement", "thông báo triển khai workflow"], ["a team-planning workshop visual", "visual workshop lập kế hoạch nhóm"], ["a customer-journey improvement slide", "slide cải thiện customer journey"], ["a practical productivity guide", "hướng dẫn năng suất thực tế"], ["a service-design case-study card", "thẻ case study service design"], ["a responsible-automation post", "bài đăng về automation có trách nhiệm"], ["a quarterly planning visual", "visual lập kế hoạch quý"]],
  },
  {
    id: "education-learning", vi: "Giáo dục và học tập", en: "Education & Learning",
    useCase: "learning material", styleTags: ["education", "clear-explainer"],
    subjects: [["a classroom table sorting geometric shapes", "bàn lớp học đang phân loại hình học"], ["a science club observing leaf textures", "câu lạc bộ khoa học quan sát texture lá"], ["an adult learner annotating a diagram", "người học trưởng thành chú thích sơ đồ"], ["a language group practicing conversation cards", "nhóm học ngôn ngữ luyện thẻ hội thoại"], ["a mentor and learner building a timeline", "người hướng dẫn và người học xây timeline"], ["a library research station", "góc nghiên cứu trong thư viện"], ["a workshop table with simple prototypes", "bàn workshop có prototype đơn giản"], ["a mathematics activity using colored blocks", "hoạt động toán với khối màu"], ["a field notebook beside harmless specimens", "sổ ghi chép thực địa cạnh mẫu vật vô hại"], ["a study group preparing a presentation", "nhóm học chuẩn bị thuyết trình"]],
    concepts: [["a lesson-opening visual", "visual mở đầu bài học"], ["a step-by-step concept explainer", "ảnh giải thích khái niệm theo bước"], ["a printable activity cover", "bìa hoạt động có thể in"], ["a training-module thumbnail", "thumbnail mô-đun đào tạo"], ["a visual study guide", "hướng dẫn học bằng hình ảnh"], ["a workshop facilitation card", "thẻ điều phối workshop"], ["a classroom discussion prompt", "prompt thảo luận lớp học"], ["a learning-progress reflection image", "ảnh phản tư tiến độ học"], ["a skills-practice scenario", "tình huống luyện kỹ năng"], ["an accessible course banner", "banner khóa học dễ tiếp cận"]],
  },
  {
    id: "technology-saas-coding", vi: "Công nghệ, SaaS và lập trình", en: "Technology, SaaS & Coding",
    useCase: "technology communication", styleTags: ["saas", "developer-friendly"],
    subjects: [["a fictional analytics dashboard on a laptop", "dashboard phân tích hư cấu trên laptop"], ["a developer sketching an API flow", "lập trình viên phác thảo luồng API"], ["a privacy settings interface concept", "concept giao diện cài đặt quyền riêng tư"], ["a cloud architecture whiteboard", "bảng trắng kiến trúc cloud"], ["a clean code-review workspace", "không gian review code gọn gàng"], ["a reliability monitor with abstract status signals", "màn hình reliability với tín hiệu trạng thái trừu tượng"], ["a mobile onboarding flow prototype", "prototype luồng onboarding mobile"], ["a subscription management interface", "giao diện quản lý gói thuê bao"], ["a secure login concept with no real credentials", "concept đăng nhập an toàn không dùng thông tin thật"], ["a product team testing a responsive layout", "nhóm sản phẩm thử layout responsive"]],
    concepts: [["a SaaS feature-launch hero", "hero ra mắt tính năng SaaS"], ["a developer-documentation cover", "bìa tài liệu developer"], ["a product-update social graphic", "social graphic cập nhật sản phẩm"], ["a UI-pattern case-study visual", "visual case study UI pattern"], ["a technical onboarding guide", "hướng dẫn onboarding kỹ thuật"], ["a trust-and-security explainer", "visual giải thích trust và security"], ["a performance-improvement story", "câu chuyện cải thiện hiệu năng"], ["a release-notes banner", "banner release notes"], ["a responsive-design presentation", "bài trình bày responsive design"], ["a support-center article image", "ảnh bài viết support center"]],
  },
  {
    id: "career-personal-branding", vi: "Sự nghiệp và thương hiệu cá nhân", en: "Career & Personal Branding",
    useCase: "professional profile", styleTags: ["career", "professional"],
    subjects: [["a fictional strategist arranging portfolio pages", "một strategist hư cấu sắp trang portfolio"], ["a designer presenting a process board", "designer trình bày process board"], ["a researcher organizing field notes", "researcher sắp xếp ghi chú hiện trường"], ["a craftsperson photographing finished work", "người làm thủ công chụp sản phẩm hoàn thiện"], ["a facilitator preparing workshop cards", "facilitator chuẩn bị thẻ workshop"], ["a writer editing a professional bio", "writer chỉnh sửa tiểu sử nghề nghiệp"], ["a consultant hosting a small roundtable", "consultant tổ chức roundtable nhỏ"], ["a photographer planning a project book", "nhiếp ảnh gia lên kế hoạch sách dự án"], ["a product manager mapping achievements", "product manager hệ thống hóa thành tựu"], ["a recent graduate rehearsing a presentation", "sinh viên mới tốt nghiệp tập thuyết trình"]],
    concepts: [["a portfolio-cover visual", "visual bìa portfolio"], ["a résumé-adjacent profile banner", "banner profile hỗ trợ résumé"], ["a professional thought-leadership post", "bài đăng thought leadership chuyên nghiệp"], ["a case-study introduction", "mở đầu case study"], ["a skills-development workshop card", "thẻ workshop phát triển kỹ năng"], ["a career-transition story image", "ảnh kể chuyện chuyển đổi sự nghiệp"], ["a speaking-event announcement", "thông báo sự kiện diễn thuyết"], ["a mentoring-program visual", "visual chương trình mentoring"], ["a client-ready capability deck", "capability deck sẵn sàng gửi khách"], ["a calm professional homepage hero", "hero trang cá nhân chuyên nghiệp"]],
  },
  {
    id: "architecture-interior-real-estate", vi: "Kiến trúc, nội thất và bất động sản", en: "Architecture, Interior & Real Estate",
    useCase: "space visualization", styleTags: ["architecture", "interior"],
    subjects: [["a sunlit compact apartment living room", "phòng khách căn hộ nhỏ có nắng"], ["a calm courtyard house entrance", "lối vào nhà sân trong yên tĩnh"], ["a flexible co-working nook", "góc co-working linh hoạt"], ["a small café with timber details", "quán cà phê nhỏ có chi tiết gỗ"], ["a restorative bedroom with linen textures", "phòng ngủ thư giãn với texture vải lanh"], ["a neighborhood pocket park", "công viên nhỏ trong khu phố"], ["a simple kitchen with durable surfaces", "bếp đơn giản với bề mặt bền"], ["a boutique hotel lobby", "sảnh khách sạn boutique"], ["a daylight-filled study room", "phòng học ngập ánh sáng ngày"], ["a shaded residential balcony garden", "vườn ban công có bóng râm"]],
    concepts: [["a real-estate listing hero", "hero listing bất động sản"], ["an interior-material story", "câu chuyện vật liệu nội thất"], ["an architectural concept-board image", "ảnh concept board kiến trúc"], ["a property-detail social card", "social card chi tiết bất động sản"], ["a hospitality mood visual", "visual mood hospitality"], ["an amenity highlight image", "ảnh nhấn tiện ích"], ["a renovation-planning visual", "visual lập kế hoạch cải tạo"], ["an urban-living editorial cover", "bìa editorial sống đô thị"], ["a calm rental-guide thumbnail", "thumbnail hướng dẫn thuê nhà"], ["a residential development presentation", "bài trình bày dự án nhà ở"]],
  },
  {
    id: "food-travel-wellness-lifestyle", vi: "Ẩm thực, du lịch, wellness và lifestyle", en: "Food, Travel, Wellness & Lifestyle",
    useCase: "lifestyle campaign", styleTags: ["lifestyle", "editorial"],
    subjects: [["a seasonal vegetable breakfast table", "bàn bữa sáng rau củ theo mùa"], ["a quiet coastal walking trail", "đường đi bộ ven biển yên tĩnh"], ["a traveler journaling at a window seat", "du khách viết nhật ký bên cửa sổ"], ["a gentle morning stretch in a bright room", "bài giãn cơ buổi sáng nhẹ nhàng trong phòng sáng"], ["a market basket with local fruit", "giỏ chợ có trái cây địa phương"], ["a tea ritual with handmade cups", "nghi thức uống trà với cốc thủ công"], ["a city bicycle pause beside a tree", "khoảnh dừng xe đạp thành phố cạnh gốc cây"], ["a picnic blanket with simple vegetarian food", "khăn picnic với đồ ăn chay đơn giản"], ["a restorative bath setup with no medical claims", "góc tắm thư giãn không có tuyên bố y tế"], ["a small cabin reading corner", "góc đọc sách trong căn cabin nhỏ"]],
    concepts: [["a mindful-travel campaign image", "ảnh chiến dịch du lịch chánh niệm"], ["a wellness journal cover", "bìa nhật ký wellness"], ["a food-story editorial opener", "mở đầu editorial câu chuyện ẩm thực"], ["a healthy-routine social post", "bài đăng thói quen lành mạnh"], ["a slow-weekend itinerary visual", "visual lịch trình cuối tuần chậm rãi"], ["a hospitality experience card", "thẻ trải nghiệm hospitality"], ["a seasonal menu background", "nền menu theo mùa"], ["a nature-respect travel guide", "hướng dẫn du lịch tôn trọng thiên nhiên"], ["a lifestyle newsletter banner", "banner bản tin lifestyle"], ["a calm brand story visual", "visual câu chuyện thương hiệu nhẹ nhàng"]],
  },
];

function ratioAt(index) {
  let cursor = 0;
  for (const [aspectRatio, width, height, count] of RATIOS) {
    if (index < cursor + count) return { aspectRatio, width, height };
    cursor += count;
  }
  throw new Error(`No aspect ratio for index ${index}`);
}

function difficultyAt(index) {
  let cursor = 0;
  for (const [difficulty, count] of DIFFICULTIES) {
    if (index < cursor + count) return difficulty;
    cursor += count;
  }
  throw new Error(`No difficulty for index ${index}`);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 110);
}

function normalise(value) {
  return value.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function sha(value) {
  return createHash("sha256").update(value).digest("hex");
}

function jaccard(left, right) {
  const a = new Set(normalise(left).split(" ").filter((word) => word.length > 3));
  const b = new Set(normalise(right).split(" ").filter((word) => word.length > 3));
  const intersection = [...a].filter((word) => b.has(word)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function csvEscape(value) {
  const source = Array.isArray(value) ? value.join(" | ") : value == null ? "" : String(value);
  return /[",\n\r]/.test(source) ? `"${source.replaceAll('"', '""')}"` : source;
}

function wordCount(value) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function makeRecord(category, categoryIndex, sequence) {
  const subject = category.subjects[sequence % 10];
  const concept = category.concepts[Math.floor(sequence / 10)];
  const { aspectRatio, width, height } = ratioAt(sequence);
  const difficulty = difficultyAt(sequence);
  const id = `seed-${category.id}-${String(sequence + 1).padStart(4, "0")}`;
  const titleEn = `${concept[0]}: ${subject[0]}`;
  const titleVi = `${concept[1]}: ${subject[1]}`;
  const palette = ["cobalt and warm cream", "moss green and clay", "indigo and soft peach", "charcoal and amber", "sage and off-white"][sequence % 5];
  const paletteVi = ["xanh cobalt và kem ấm", "xanh rêu và đất nung", "chàm và đào nhạt", "than chì và hổ phách", "xanh sage và trắng ngà"][sequence % 5];
  const light = ["soft morning side light", "diffused overcast window light", "warm late-afternoon light", "controlled studio light with gentle shadow", "cool twilight ambience"][Math.floor(sequence / 2) % 5];
  const lightVi = ["ánh sáng cạnh mềm buổi sáng", "ánh sáng cửa sổ tán xạ", "ánh chiều muộn ấm", "ánh sáng studio kiểm soát với bóng nhẹ", "không khí chạng vạng mát"][Math.floor(sequence / 2) % 5];
  const camera = ["eye-level medium frame", "high three-quarter view", "close crop with generous negative space", "wide environmental composition", "low-angle detail frame"][sequence % 5];
  const cameraVi = ["khung trung cảnh ngang mắt", "góc ba phần tư từ trên", "cận cảnh có khoảng trống rộng", "bố cục môi trường góc rộng", "khung chi tiết góc thấp"][sequence % 5];
  const texture = ["honest grain, paper fibers, and tactile surfaces", "subtle textile texture and natural wear", "matte materials with restrained reflections", "layered handmade texture with clean edges", "realistic surface detail without visual clutter"][Math.floor(sequence / 3) % 5];
  const textureVi = ["vân thật, sợi giấy và bề mặt có xúc giác", "texture vải nhẹ và dấu vết tự nhiên", "vật liệu mờ với phản chiếu tiết chế", "texture thủ công nhiều lớp, cạnh sạch", "chi tiết bề mặt chân thực, không rối mắt"][Math.floor(sequence / 3) % 5];
  const storyBeat = [
    "show the first deliberate preparation step with one useful tool nearby",
    "capture the handoff between a simple process and its visible outcome",
    "reveal a quiet decision point, with the next action readable at a glance",
    "place the subject just after a small transformation has happened",
    "show an everyday ritual interrupted by one distinctive detail",
    "stage a practical comparison between raw material and finished result",
    "use a lived-in setting that explains why the moment matters",
    "make the viewer feel the rhythm of a repeated craft or workflow",
    "focus on a useful detail that a first-time viewer might otherwise miss",
    "end on a calm, confident result with a trace of the work that preceded it",
  ][sequence % 10];
  const sceneDirection = [
    "Keep the subject anchored in the lower third so the top area can breathe.",
    "Use foreground depth to make the process feel immediate without crowding the frame.",
    "Let one secondary object explain scale, then keep the background deliberately quiet.",
    "Build a clear left-to-right visual path from context to action to outcome.",
    "Frame the scene around a tactile edge or surface rather than a generic backdrop.",
    "Use a single decisive gesture as the focal point and leave the rest understated.",
    "Show enough environment to establish purpose, but stop before it becomes a stock scene.",
    "Balance an expressive close detail with a recognisable functional context.",
    "Treat the supporting elements as evidence of care, not decorative filler.",
    "Make the final composition feel specific to this use case rather than universally generic.",
  ][Math.floor(sequence / 10)];
  const imagePrompt = `Original ${category.en} visual for ${concept[0]}. Feature ${subject[0]}; ${storyBeat}. ${sceneDirection} Camera: ${camera}. Light: ${light}. Palette: ${palette}. Surface treatment: ${texture}. Deliver a ${aspectRatio} composition with concise negative space for a later overlay, not readable in-image copy. The visual should serve ${category.useCase} with a clear hierarchy. Exclude logos, trademarked packaging, watermarks, identifiable people, licensed characters, graphic violence, sexual content, misleading medical or financial claims, and malformed anatomy.`;
  const promptEn = `Develop a ${difficulty} creative brief for ${concept[0]}, centred on ${subject[0]}. The narrative beat is to ${storyBeat}; ${sceneDirection} Specify the ${aspectRatio} frame, ${camera}, ${light}, ${palette} palette, and ${texture}. Explain why these choices support ${category.useCase}, how the eye should move through the frame, and which details need a human quality review. Keep any overlay area empty and enforce the stated safety exclusions.`;
  const promptVi = `Hãy phát triển brief sáng tạo mức ${difficulty} cho ${concept[1]}, lấy ${subject[1]} làm trung tâm. Nhịp kể chuyện cần thể hiện hành động cụ thể thay vì ảnh minh họa chung; bố cục phải có mục đích rõ ràng cho ${category.useCase}. Quy định khung ${aspectRatio}, ${cameraVi}, ${lightVi}, bảng màu ${paletteVi} và ${textureVi}. Giải thích hướng di chuyển của mắt, vùng để overlay ngắn và chi tiết cần người kiểm duyệt. Không dùng thương hiệu thật, người có thể nhận diện, watermark, dữ liệu cá nhân hay chữ dài trong ảnh.`;
  return {
    id,
    slug: `${slugify(`${category.id}-${concept[0]}-${subject[0]}`)}-${String(sequence + 1).padStart(4, "0")}`,
    dataset_version: DATASET_VERSION,
    source_type: "synthetic",
    environment: "local",
    category_id: category.id,
    category_name_vi: category.vi,
    category_name_en: category.en,
    title_vi: titleVi,
    title_en: titleEn,
    description_vi: `Prompt song ngữ cho ${concept[1]}, dùng ${subject[1]} làm trọng tâm và không sử dụng thương hiệu hay người thật.`,
    description_en: `Bilingual prompt for ${concept[0]}, centred on ${subject[0]} and free of real brands or identifiable people.`,
    prompt_vi: promptVi,
    prompt_en: promptEn,
    image_prompt_used: imagePrompt,
    negative_prompt: "logos, trademarks, recognizable people, celebrity likenesses, copyrighted characters, watermark, unreadable central text, distorted anatomy, graphic violence, sexual content, personal data",
    expected_output_vi: `Ảnh ${aspectRatio} nguyên bản, rõ chủ thể và có khoảng trống hợp lý cho overlay ngắn.`,
    expected_output_en: `An original ${aspectRatio} image with a clear subject and usable negative space for a short overlay.`,
    difficulty,
    use_case: category.useCase,
    style_tags: category.styleTags,
    topic_tags: [slugify(subject[0]).split("-").slice(0, 3).join("-"), slugify(concept[0]).split("-").slice(0, 3).join("-")],
    aspect_ratio: aspectRatio,
    width,
    height,
    image_model: "not-called-billable-generation-disabled",
    generation_seed: 100000 + categoryIndex * CATEGORY_SIZE + sequence,
    image_status: "pending",
    image_path: `images/${category.id}/${id}.webp`,
    thumbnail_path: `thumbnails/${category.id}/${id}.webp`,
    image_mime_type: "image/webp",
    image_sha256: null,
    image_width: width,
    image_height: height,
    alt_text_vi: `Minh họa ${concept[1]} với ${subject[1]}.`,
    alt_text_en: `Illustration for ${concept[0]} featuring ${subject[0]}.`,
    moderation_status: "approved",
    quality_score: 0,
    semantic_similarity_max: 0,
    license: "synthetic-test-only",
    created_by: "aliprompt-chatgpt-synthetic-generator",
    created_at: CREATED_AT,
  };
}

function validate(records, requestedCount) {
  const schemaErrors = [];
  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phonePattern = /\b(?:\+?\d[\s.-]?){8,}\d\b/;
  const livingArtistStylePattern = /\bin the style of\s+[a-z]/i;
  for (const record of records) {
    const required = ["id", "slug", "title_vi", "title_en", "prompt_vi", "prompt_en", "image_prompt_used", "category_id", "image_path", "thumbnail_path"];
    for (const key of required) if (!record[key]) schemaErrors.push({ id: record.id, field: key, reason: "required" });
    const count = wordCount(record.image_prompt_used);
    if (count < 40 || count > 160) schemaErrors.push({ id: record.id, field: "image_prompt_used", reason: `word_count_${count}` });
    const haystack = `${record.title_en} ${record.description_en} ${record.prompt_en} ${record.image_prompt_used}`;
    if (emailPattern.test(haystack)) schemaErrors.push({ id: record.id, field: "safety", reason: "possible_email" });
    if (phonePattern.test(haystack)) schemaErrors.push({ id: record.id, field: "safety", reason: "possible_phone" });
    if (livingArtistStylePattern.test(haystack)) schemaErrors.push({ id: record.id, field: "safety", reason: "living_artist_style_request" });
  }
  const duplicateIds = records.map((record) => record.id).filter((id, index, all) => all.indexOf(id) !== index);
  const duplicateSlugs = records.map((record) => record.slug).filter((slug, index, all) => all.indexOf(slug) !== index);
  const hashes = new Map();
  for (const record of records) {
    const key = sha(normalise(record.image_prompt_used));
    hashes.set(key, [...(hashes.get(key) ?? []), record.id]);
  }
  const duplicatePromptHashes = [...hashes.entries()].filter(([, ids]) => ids.length > 1).map(([hash, ids]) => ({ hash, ids }));
  let maxSimilarity = 0;
  let maxPair = null;
  for (let left = 0; left < records.length; left += 1) for (let right = left + 1; right < records.length; right += 1) {
    const similarity = jaccard(records[left].image_prompt_used, records[right].image_prompt_used);
    if (similarity > maxSimilarity) { maxSimilarity = similarity; maxPair = [records[left].id, records[right].id]; }
  }
  return { schemaErrors, duplicateIds, duplicateSlugs, duplicatePromptHashes, maxSimilarity, maxPair, requestedCount };
}

async function ensureFreshOutput(root) {
  if (!existsSync(root)) return;
  const files = [];
  async function collectFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const resolved = path.join(directory, entry.name);
      if (entry.isDirectory()) await collectFiles(resolved);
      else files.push(resolved);
    }
  }
  await collectFiles(root);
  if (files.length) throw new Error(`Refusing to overwrite output directory with existing files: ${root}`);
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function run() {
  const mode = process.env.SEED_MODE ?? "prompt-only";
  const approved = process.env.APPROVE_BILLABLE_IMAGE_GENERATION === "true";
  const isDryRun = mode === "dry-run";
  if (!isDryRun && mode !== "prompt-only") throw new Error("SEED_MODE must be dry-run or prompt-only");
  if (approved) throw new Error("This generator intentionally has no billable image provider. Use a separately approved image execution runner after this prompt-only corpus passes review.");
  const requestedCount = isDryRun ? Number(process.env.DRY_RUN_COUNT ?? 20) : Number(process.env.TOTAL_PROMPTS ?? 1000);
  if (isDryRun && requestedCount !== 20) throw new Error("Dry run must contain exactly 20 records.");
  if (!isDryRun && requestedCount !== 1000) throw new Error("Prompt-only run must contain exactly 1,000 records.");
  const root = path.resolve(process.env.OUTPUT_ROOT ?? (isDryRun ? DRY_RUN_OUTPUT_ROOT : DEFAULT_OUTPUT_ROOT));
  if (path.resolve(root) === path.parse(root).root) throw new Error("OUTPUT_ROOT must not be a filesystem root.");
  await ensureFreshOutput(root);
  await mkdir(root, { recursive: true });
  for (const category of categories) {
    await mkdir(path.join(root, "images", category.id), { recursive: true });
    await mkdir(path.join(root, "thumbnails", category.id), { recursive: true });
  }

  const records = [];
  if (isDryRun) {
    for (let sequence = 0; sequence < 2; sequence += 1) categories.forEach((category, index) => records.push(makeRecord(category, index, sequence)));
  } else {
    categories.forEach((category, index) => { for (let sequence = 0; sequence < CATEGORY_SIZE; sequence += 1) records.push(makeRecord(category, index, sequence)); });
  }
  if (records.length !== requestedCount) throw new Error(`Generated ${records.length}, expected ${requestedCount}`);
  const validation = validate(records, requestedCount);
  if (validation.schemaErrors.length || validation.duplicateIds.length || validation.duplicateSlugs.length || validation.duplicatePromptHashes.length) throw new Error(`Prompt-only validation failed: ${JSON.stringify(validation)}`);
  records.forEach((record) => { record.semantic_similarity_max = Number(validation.maxSimilarity.toFixed(4)); });

  const counts = Object.fromEntries(categories.map((category) => [category.id, records.filter((record) => record.category_id === category.id).length]));
  const imageLog = records.map((record) => JSON.stringify({ id: record.id, status: "not_requested", api_calls: 0, reason: "APPROVE_BILLABLE_IMAGE_GENERATION=false", image_path: record.image_path }));
  const fields = Object.keys(records[0]);
  const csv = [fields.join(","), ...records.map((record) => fields.map((field) => csvEscape(record[field])).join(","))].join("\n");
  const fullPlan = {
    requested_image_api_calls: 1000,
    actual_image_api_calls: 0,
    actual_image_files: 0,
    estimated_cost: { value: null, currency: null, status: "not_computable", reason: "No approved provider, SKU, or price basis was supplied." },
    estimated_time: { value: "50 minutes at an illustrative 20 successful images/minute, plus up to 85 minutes of specified retry backoff", status: "assumption—not-provider-SLA" },
    estimated_storage: { original_webp_mb: 600, thumbnails_mb: 80, total_mb: 680, basis: "illustrative average 600 KB/image and 80 KB/thumbnail" },
    batches: 100,
    records_per_batch: 10,
    retry_policy: [{ attempt: 1, backoff_seconds: 5 }, { attempt: 2, backoff_seconds: 20 }, { attempt: 3, backoff_seconds: 60 }],
  };
  const qa = {
    status: "incomplete_pending_image_generation",
    run_mode: mode,
    total_prompt_records: records.length,
    total_image_files: 0,
    total_thumbnail_files: 0,
    category_count: categories.length,
    records_per_category: counts,
    image_status_counts: { pending: records.length },
    missing_image_files: records.length,
    duplicate_ids: validation.duplicateIds.length,
    duplicate_slugs: validation.duplicateSlugs.length,
    duplicate_normalized_prompt_hashes: validation.duplicatePromptHashes.length,
    invalid_images: 0,
    schema_errors: validation.schemaErrors.length,
    production_writes: 0,
    lexical_similarity_proxy: { maximum: Number(validation.maxSimilarity.toFixed(4)), pair: validation.maxPair, threshold: 0.88, result: validation.maxSimilarity <= 0.88 ? "pass" : "review" },
    semantic_evaluator: "not_available—not claimed as semantic validation",
    moderation: { status: "template-safety-scan-pass", records: records.length, human_or_vision_review_required_before_approval: true },
    image_qa: { status: "not-run—no images were generated" },
    full_run_estimate: fullPlan,
  };
  const importReport = {
    status: "adapter-only-no-database-write",
    canonical_source: "prompts.jsonl",
    repository_schema_read: ["db/schema.ts", "drizzle/0009_far_serpent_society.sql"],
    mapping: {
      categories: { target: "categories", map: { slug: "category_id", name: "category_name_vi", description: "description_vi" }, lookup_required: true },
      prompts: { target: "prompts", map: { slug: "slug", title: "title_vi", summary: "description_vi", body: "prompt_vi + prompt_en", contentLanguage: "multilingual", moderationStatus: "approved", accessKind: "free" }, lookup_required: true },
      prompt_media: { target: "prompt_media", status: "blocked_until_validated_asset_exists", map: { blobKey: "image_path", altText: "alt_text_vi", mimeType: "image_mime_type" } },
    },
    unmapped_metadata: ["title_en", "description_en", "prompt_en", "image_prompt_used", "negative_prompt", "expected_output_*", "difficulty", "use_case", "style_tags", "topic_tags", "aspect_ratio", "generation_seed", "image_sha256", "quality_score", "semantic_similarity_max", "license"],
    required_before_import: ["Owner approval for Development or isolated Preview only", "validated generated WebP and thumbnail for each record", "Blob upload authorization", "import adapter review", "no Production environment"],
  };
  await writeFile(path.join(root, "prompts.jsonl"), `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
  await writeFile(path.join(root, "prompts.csv"), `${csv}\n`, "utf8");
  await writeFile(path.join(root, "image-generation-log.jsonl"), `${imageLog.join("\n")}\n`, "utf8");
  await writeFile(path.join(root, "failures.jsonl"), "", "utf8");
  await writeJson(path.join(root, "categories.json"), categories.map(({ id, vi, en }) => ({ id, name_vi: vi, name_en: en })));
  await writeJson(path.join(root, "duplicate-report.json"), { normalized_text_hash_duplicates: validation.duplicatePromptHashes, lexical_similarity_proxy: qa.lexical_similarity_proxy, semantic_evaluator: qa.semantic_evaluator });
  await writeJson(path.join(root, "qa-report.json"), qa);
  await writeJson(path.join(root, "import-report.json"), importReport);
  await writeJson(path.join(root, "manifest.json"), { dataset_version: DATASET_VERSION, run_mode: mode, complete: false, generated_at: CREATED_AT, output_root: root, counts: { prompts: records.length, images: 0, thumbnails: 0, categories: categories.length }, production_writes: 0, full_run_estimate: fullPlan });
  await writeFile(path.join(root, "README.md"), `# ALIPROMPT synthetic prompt seed\n\nThis is a ${mode} corpus generated by ChatGPT-authored local logic. It contains ${records.length} bilingual synthetic prompt records and **zero generated images** because APPROVE_BILLABLE_IMAGE_GENERATION=false. It is not a completed 1,000-image dataset and must not be imported, uploaded, or used in Production. See qa-report.json and import-report.json.\n`, "utf8");
  console.log(JSON.stringify({ root, mode, records: records.length, schemaErrors: validation.schemaErrors.length, images: 0, qaStatus: qa.status }, null, 2));
}

run().catch((error) => { console.error(error instanceof Error ? error.stack : error); process.exitCode = 1; });
