"use client";

import { useMemo, useState, type FormEvent } from "react";

type Intent = "workshop" | "agent_waitlist" | "prompt_pack";
type StageKey = "ask" | "teach" | "delegate";
type FeedbackKey = "generic" | "tone" | "missing" | "invented" | "good";

const stages: Array<{
  key: StageKey;
  number: string;
  label: string;
  title: string;
  body: string;
  action: string;
  target: string;
}> = [
  {
    key: "ask",
    number: "01",
    label: "BIẾT HỎI",
    title: "Tôi chưa biết hỏi AI thế nào",
    body: "Chọn đúng tình huống trong nghề, điền bối cảnh và nhận một prompt có tiêu chuẩn đầu ra rõ ràng.",
    action: "Thử Prompt Lab",
    target: "prompt-lab",
  },
  {
    key: "teach",
    number: "02",
    label: "BIẾT DẠY",
    title: "AI trả lời hay nhưng không dùng được",
    body: "Đừng chỉ sửa câu chữ. Hãy dạy AI về công việc, giọng điệu, ví dụ tốt và điều tuyệt đối không được bịa.",
    action: "Xem lớp 2 giờ",
    target: "workshop",
  },
  {
    key: "delegate",
    number: "03",
    label: "BIẾT GIAO VIỆC",
    title: "Tôi lặp lại cùng một việc mỗi ngày",
    body: "Đóng gói mục tiêu, dữ liệu, công cụ và bước kiểm tra thành một quy trình AI Agent có kiểm soát.",
    action: "Kiểm tra độ sẵn sàng",
    target: "agent-path",
  },
];

const feedback: Record<
  FeedbackKey,
  { label: string; title: string; diagnosis: string; fix: string }
> = {
  generic: {
    label: "Quá chung chung",
    title: "AI đang thiếu bối cảnh, không thiếu mỹ từ.",
    diagnosis:
      "Hãy bổ sung điểm khác biệt của sản phẩm, một nỗi đau cụ thể và hành động bạn muốn người đọc thực hiện.",
    fix: "Hỏi lại tôi tối đa 3 câu để làm rõ điểm khác biệt, nỗi đau ưu tiên và CTA trước khi viết lại.",
  },
  tone: {
    label: "Sai giọng",
    title: "Một tính từ chưa đủ để dạy giọng thương hiệu.",
    diagnosis:
      "Cho AI 1–2 ví dụ bạn thấy đúng giọng, kèm một ví dụ không đạt và lý do. Ví dụ mạnh hơn lời mô tả mơ hồ.",
    fix: "Đối chiếu bản nháp với các ví dụ giọng thương hiệu. Nêu 3 điểm lệch giọng rồi mới viết lại.",
  },
  missing: {
    label: "Thiếu dữ kiện",
    title: "Đây là lỗi dữ liệu, không phải lỗi prompt.",
    diagnosis:
      "AI không thể biết giá, bằng chứng hay chính sách bạn chưa cung cấp. Tách rõ dữ kiện đã có và dữ kiện cần hỏi lại.",
    fix: "Không tự điền dữ kiện còn thiếu. Đánh dấu [CẦN XÁC NHẬN] và liệt kê thông tin tôi phải bổ sung.",
  },
  invented: {
    label: "Có dấu hiệu bịa",
    title: "Cần một hàng rào kiểm chứng trước khi dùng.",
    diagnosis:
      "Yêu cầu AI gắn nhãn giả định, không tạo số liệu hoặc nguồn và lập checklist những gì con người phải xác minh.",
    fix: "Tách câu trả lời thành: dữ kiện từ đầu vào, suy luận và phần chưa thể xác minh. Không tạo nguồn hoặc con số mới.",
  },
  good: {
    label: "Đã dùng được",
    title: "Tốt. Bây giờ hãy lưu cách làm, không chỉ lưu đáp án.",
    diagnosis:
      "Giữ lại prompt, dữ liệu đầu vào và checklist đã giúp bạn đạt kết quả để lần sau không phải thử lại từ đầu.",
    fix: "Tóm tắt prompt này thành một quy trình tái sử dụng gồm input bắt buộc, các bước và tiêu chí đạt.",
  },
};

const roles = [
  {
    name: "Marketing & Content",
    result: "Insight → kế hoạch → nội dung",
    status: "ĐANG MỞ",
    active: true,
  },
  {
    name: "Sales & CSKH",
    result: "Tư vấn → follow-up → xử lý từ chối",
    status: "SẮP CÓ",
    active: false,
  },
  {
    name: "Nhân sự",
    result: "JD → phỏng vấn → phản hồi",
    status: "SẮP CÓ",
    active: false,
  },
  {
    name: "Vận hành",
    result: "Biên bản → SOP → kế hoạch",
    status: "SẮP CÓ",
    active: false,
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function AliPromptExperience() {
  const [selectedStage, setSelectedStage] = useState<StageKey>("ask");
  const [product, setProduct] = useState("Khoá học viết content bằng AI");
  const [audience, setAudience] = useState("Chủ shop online đã thử ChatGPT nhưng nội dung còn giống đối thủ");
  const [goal, setGoal] = useState("Lên 7 ý tưởng content giúp khách hiểu điểm khác biệt và nhắn tin tư vấn");
  const [tone, setTone] = useState("Thẳng, gần gũi, có ví dụ; không hô hào");
  const [copied, setCopied] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackKey | null>(null);
  const [intent, setIntent] = useState<Intent>("workshop");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const prompt = useMemo(
    () => `Bạn là chiến lược gia content thực chiến cho doanh nghiệp nhỏ tại Việt Nam.

MỤC TIÊU
${goal || "[Điền kết quả công việc cần đạt]"}

BỐI CẢNH
- Sản phẩm/dịch vụ: ${product || "[Điền sản phẩm/dịch vụ]"}
- Khách hàng: ${audience || "[Điền khách hàng mục tiêu]"}
- Giọng thương hiệu: ${tone || "[Điền giọng thương hiệu]"}

HÃY THỰC HIỆN
1. Tóm tắt điều bạn đã hiểu và đánh dấu mọi giả định.
2. Đề xuất 7 ý tưởng content, mỗi ý tưởng gắn với một nỗi đau hoặc câu hỏi thật của khách hàng.
3. Với mỗi ý tưởng, viết: góc tiếp cận, hook mở đầu, 3 ý chính và CTA.
4. Sắp xếp kết quả thành bảng dễ đọc.

RÀNG BUỘC
- Không tự tạo số liệu, phản hồi khách hàng hoặc cam kết chưa được cung cấp.
- Tránh sáo ngữ như “đột phá”, “bùng nổ”, “giải pháp toàn diện”.
- Nếu thiếu thông tin quan trọng, hỏi tối đa 3 câu trước khi viết.

TỰ KIỂM TRA TRƯỚC KHI TRẢ LỜI
- Mỗi ý tưởng có khác nhau thật sự không?
- Có chi tiết nào bị suy đoán thành sự thật không?
- CTA có phù hợp với mục tiêu “nhắn tin tư vấn” không?`,
    [audience, goal, product, tone],
  );

  async function copyPrompt() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = prompt;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  function chooseIntent(nextIntent: Intent) {
    setIntent(nextIntent);
    setSubmitState("idle");
    setSubmitMessage("");
    window.setTimeout(() => scrollToSection("reserve"), 20);
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    if (form.get("website")) return;

    const consent = form.get("consent") === "on";
    if (!consent) {
      setSubmitState("error");
      setSubmitMessage("Bạn cần đồng ý để AliPrompt liên hệ về lựa chọn này.");
      return;
    }

    setSubmitState("loading");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          contact: String(form.get("contact") ?? ""),
          role: String(form.get("role") ?? ""),
          stage: intent,
          source: "homepage",
          consent,
        }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error || "Không thể gửi đăng ký.");

      setSubmitState("success");
      setSubmitMessage(
        intent === "workshop"
          ? "Đã giữ thông tin của bạn. AliPrompt sẽ gửi lịch lớp và hướng dẫn thanh toán sau khi xác nhận suất học."
          : "Bạn đã vào danh sách ưu tiên. AliPrompt sẽ liên hệ khi lộ trình phù hợp được mở.",
      );
      formElement.reset();
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    }
  }

  const selectedStageData = stages.find((stage) => stage.key === selectedStage)!;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AliPrompt — về đầu trang">
          <span className="brand-mark">A</span>
          <span>AliPrompt</span>
        </a>
        <nav aria-label="Điều hướng chính">
          <a href="#path">Lộ trình</a>
          <a href="#prompt-lab">Prompt Lab</a>
          <a href="#workshop">Lớp 2 giờ</a>
        </nav>
        <button className="header-cta" type="button" onClick={() => scrollToSection("prompt-lab")}>
          Thử miễn phí <Arrow />
        </button>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow">PROMPT THEO NGÀNH · LỚP THỰC HÀNH · AI AGENT</p>
          <h1>
            Từ biết hỏi
            <br />
            đến biết <em>giao việc.</em>
          </h1>
          <p className="hero-lede">
            Bắt đầu bằng prompt đúng nghề. Sau đó học cách đưa bối cảnh, tiêu chuẩn và quy trình để AI trở thành một trợ lý làm việc có kiểm soát.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => scrollToSection("path")}>
              Tìm lộ trình của tôi <span aria-hidden="true">↓</span>
            </button>
            <button className="text-link" type="button" onClick={() => scrollToSection("prompt-lab")}>
              Thử một prompt thật <Arrow />
            </button>
          </div>
          <ul className="micro-proof" aria-label="Cam kết trải nghiệm">
            <li>Không cần biết code</li>
            <li>Có ví dụ đầu ra</li>
            <li>Có bước kiểm tra lỗi</li>
          </ul>
        </div>

        <div className="work-order" aria-label="Minh hoạ một phiếu giao việc cho AI">
          <div className="work-order-top">
            <span>PHIẾU GIAO VIỆC</span>
            <span>#001</span>
          </div>
          <div className="work-order-title">“Viết cho hay” chưa phải là một brief.</div>
          <ol className="work-order-list">
            <li>
              <span>01</span>
              <div><strong>Mục tiêu</strong><small>Muốn thay đổi điều gì?</small></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>Bối cảnh</strong><small>AI cần biết điều gì?</small></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>Tiêu chuẩn</strong><small>Thế nào mới được xem là đạt?</small></div>
            </li>
            <li>
              <span>04</span>
              <div><strong>Kiểm tra</strong><small>Điều gì con người phải xác minh?</small></div>
            </li>
          </ol>
          <div className="hand-note">Prompt không phải câu thần chú ↙</div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Ba nguyên tắc của AliPrompt">
        <span><b>01</b> Một kết quả đầu tiên</span>
        <span><b>02</b> Một cách tự sửa lỗi</span>
        <span><b>03</b> Một lộ trình đúng lúc</span>
      </section>

      <section className="path-section section-shell" id="path">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BẮT ĐẦU TỪ ĐIỂM VƯỚNG</p>
            <h2>Bạn đang mắc ở đâu?</h2>
          </div>
          <p>Không cần học mọi thứ về AI. Chỉ cần tiến đúng một nấc so với cách bạn đang làm việc hôm nay.</p>
        </div>

        <div className="stage-grid">
          {stages.map((stage) => (
            <button
              className={`stage-card ${selectedStage === stage.key ? "is-selected" : ""}`}
              key={stage.key}
              type="button"
              onClick={() => setSelectedStage(stage.key)}
              aria-pressed={selectedStage === stage.key}
            >
              <span className="stage-number">{stage.number}</span>
              <span className="stage-label">{stage.label}</span>
              <strong>{stage.title}</strong>
              <span>{stage.body}</span>
            </button>
          ))}
        </div>

        <div className="stage-result" aria-live="polite">
          <div>
            <span>LỘ TRÌNH PHÙ HỢP HIỆN TẠI</span>
            <strong>{selectedStageData.label}</strong>
          </div>
          <p>{selectedStageData.body}</p>
          <button className="text-link" type="button" onClick={() => scrollToSection(selectedStageData.target)}>
            {selectedStageData.action} <Arrow />
          </button>
        </div>
      </section>

      <section className="roles-section">
        <div className="section-shell">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">PROMPT ĐI THEO CÔNG VIỆC</p>
              <h2>Bạn làm nghề gì?</h2>
            </div>
            <p>V1 mở một ngành thật sâu trước khi mở rộng. Marketing & Content là thư viện đầu tiên.</p>
          </div>
          <div className="role-list">
            {roles.map((role, index) => (
              <button
                key={role.name}
                className={role.active ? "role-row active" : "role-row"}
                type="button"
                onClick={() => role.active ? scrollToSection("prompt-lab") : chooseIntent("prompt_pack")}
              >
                <span className="role-index">0{index + 1}</span>
                <strong>{role.name}</strong>
                <span>{role.result}</span>
                <small>{role.status}</small>
                <Arrow />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="prompt-lab section-shell" id="prompt-lab">
        <div className="lab-intro">
          <p className="eyebrow">PROMPT LAB · MARKETING & CONTENT</p>
          <h2>Thử trước khi tin.</h2>
          <p>
            Điền bốn mảnh bối cảnh. AliPrompt ghép chúng thành một phiếu giao việc có ràng buộc và bước tự kiểm tra — miễn phí, không cần đăng nhập.
          </p>
        </div>

        <div className="lab-grid">
          <form className="brief-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-kicker"><span>01</span> Điền brief của bạn</div>
            <label>
              Sản phẩm / dịch vụ
              <input value={product} onChange={(event) => setProduct(event.target.value)} />
            </label>
            <label>
              Khách hàng mục tiêu
              <textarea rows={3} value={audience} onChange={(event) => setAudience(event.target.value)} />
            </label>
            <label>
              Kết quả cần đạt
              <textarea rows={3} value={goal} onChange={(event) => setGoal(event.target.value)} />
            </label>
            <label>
              Giọng thương hiệu
              <input value={tone} onChange={(event) => setTone(event.target.value)} />
            </label>
            <p className="privacy-note">Không nhập dữ liệu khách hàng, tài liệu mật hoặc thông tin bạn chưa được phép chia sẻ.</p>
          </form>

          <div className="prompt-output">
            <div className="prompt-toolbar">
              <div><span>02</span> Prompt đã được đóng gói</div>
              <span className="version">V1.0 · FREE</span>
            </div>
            <pre>{prompt}</pre>
            <div className="prompt-actions">
              <button className="button button-dark" type="button" onClick={copyPrompt}>
                {copied ? "Đã sao chép ✓" : "Sao chép prompt"}
              </button>
              <span>Dán vào công cụ AI bạn đang dùng.</span>
            </div>
          </div>
        </div>

        <div className="feedback-panel">
          <div className="feedback-heading">
            <span>03</span>
            <div><strong>AI trả lời thế nào?</strong><p>Chọn đúng lỗi để nhận một câu lệnh sửa tiếp.</p></div>
          </div>
          <div className="feedback-options" role="group" aria-label="Đánh giá kết quả AI">
            {(Object.keys(feedback) as FeedbackKey[]).map((key) => (
              <button
                type="button"
                key={key}
                className={selectedFeedback === key ? "is-selected" : ""}
                onClick={() => setSelectedFeedback(key)}
                aria-pressed={selectedFeedback === key}
              >
                {feedback[key].label}
              </button>
            ))}
          </div>
          {selectedFeedback && (
            <div className="diagnosis" aria-live="polite">
              <div>
                <span>CHẨN ĐOÁN</span>
                <h3>{feedback[selectedFeedback].title}</h3>
                <p>{feedback[selectedFeedback].diagnosis}</p>
              </div>
              <div className="repair-command">
                <span>CÂU LỆNH SỬA TIẾP</span>
                <p>{feedback[selectedFeedback].fix}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="workshop-section" id="workshop">
        <div className="section-shell workshop-grid">
          <div className="workshop-copy">
            <p className="eyebrow light">PHASE 2 · LỚP THỰC HÀNH TRỰC TUYẾN</p>
            <h2>Prompt tốt vẫn chưa đủ khi AI chưa hiểu cách bạn làm việc.</h2>
            <p>
              Trong 2 giờ, bạn tự tạo phiên bản đầu tiên của một trợ lý AI có bối cảnh công việc, tiêu chuẩn đầu ra và checklist tự kiểm tra.
            </p>
            <div className="definition-note">
              <b>“Dạy AI” ở đây nghĩa là gì?</b>
              <span>Cung cấp instruction, bối cảnh, ví dụ và quy trình — không phải huấn luyện lại mô hình.</span>
            </div>
          </div>

          <div className="workshop-ticket">
            <div className="ticket-top"><span>VÉ LỚP THỰC HÀNH</span><span>ONLINE · LIVE</span></div>
            <div className="price-line"><strong>199.000đ</strong><span>/ người</span></div>
            <p>2 giờ · Thực hành trên chính công việc của bạn</p>
            <ul>
              <li><span>✓</span> Hồ sơ công việc cho AI</li>
              <li><span>✓</span> Bộ instruction dùng lại</li>
              <li><span>✓</span> Ví dụ đạt / chưa đạt</li>
              <li><span>✓</span> Checklist chống bịa và sai ý</li>
            </ul>
            <button className="button button-accent" type="button" onClick={() => chooseIntent("workshop")}>
              Giữ chỗ lớp 2 giờ <Arrow />
            </button>
            <small>Lịch học và thanh toán chỉ được gửi sau khi bạn xác nhận. Không tạo khan hiếm giả.</small>
          </div>
        </div>

        <div className="section-shell agenda">
          <p className="agenda-title">Một buổi, bốn khối thực hành</p>
          <ol>
            <li><span>00—25’</span><strong>Phân biệt prompt, context, memory và tool</strong></li>
            <li><span>25—60’</span><strong>Viết hồ sơ công việc để AI hiểu đúng</strong></li>
            <li><span>60—95’</span><strong>Dạy bằng ví dụ và tiêu chuẩn đầu ra</strong></li>
            <li><span>95—120’</span><strong>Test, sửa lỗi và mang trợ lý V1 về dùng</strong></li>
          </ol>
        </div>
      </section>

      <section className="agent-section section-shell" id="agent-path">
        <div className="agent-stamp">PHASE 3 · MỞ SAU</div>
        <div className="agent-copy">
          <p className="eyebrow">TỪ PROMPT ĐẾN QUY TRÌNH</p>
          <h2>Khi một việc lặp lại đủ nhiều, đừng viết lại prompt.</h2>
          <p>
            Lộ trình AI Agent dành cho người đã biết giao việc và muốn nối các bước, công cụ, dữ liệu cùng cơ chế phê duyệt thành một trợ lý vận hành được.
          </p>
          <button className="text-link" type="button" onClick={() => chooseIntent("agent_waitlist")}>
            Tham gia danh sách chờ <Arrow />
          </button>
        </div>
        <div className="agent-flow" aria-label="Minh hoạ quy trình agent">
          <div><span>TRIGGER</span><strong>Có brief mới</strong></div>
          <i aria-hidden="true">→</i>
          <div><span>AI</span><strong>Phân tích & soạn</strong></div>
          <i aria-hidden="true">→</i>
          <div className="human-step"><span>CON NGƯỜI</span><strong>Duyệt trước khi gửi</strong></div>
        </div>
      </section>

      <section className="trust-section">
        <div className="section-shell trust-grid">
          <div>
            <p className="eyebrow">NGUYÊN TẮC DÙNG AI</p>
            <h2>AI làm nhanh.<br />Bạn chịu trách nhiệm cuối cùng.</h2>
          </div>
          <ul>
            <li><span>01</span><p>Xác minh tên, số liệu và nguồn trước khi sử dụng.</p></li>
            <li><span>02</span><p>Không nhập dữ liệu khách hàng hoặc nội bộ khi chưa được phép.</p></li>
            <li><span>03</span><p>Không dùng AI thay chuyên gia cho quyết định pháp lý, y tế hoặc tài chính.</p></li>
            <li><span>04</span><p>Mọi prompt AliPrompt đều có bước kiểm tra, không chỉ bước tạo.</p></li>
          </ul>
        </div>
      </section>

      <section className="reserve-section section-shell" id="reserve">
        <div className="reserve-copy">
          <p className="eyebrow">BƯỚC TIẾP THEO</p>
          <h2>
            {intent === "workshop"
              ? "Giữ chỗ lớp thực hành 2 giờ."
              : intent === "agent_waitlist"
                ? "Vào danh sách chờ AI Agent."
                : "Nhận tin khi ngành của bạn mở."}
          </h2>
          <p>
            {intent === "workshop"
              ? "Để lại một kênh liên hệ. Bạn sẽ nhận lịch lớp và hướng dẫn thanh toán rõ ràng trước khi quyết định."
              : "Để lại đúng vai trò và nhu cầu. AliPrompt chỉ liên hệ khi có nội dung phù hợp."}
          </p>
          <div className="intent-switcher" role="group" aria-label="Chọn nội dung muốn đăng ký">
            <button type="button" onClick={() => setIntent("workshop")} aria-pressed={intent === "workshop"}>Lớp 2 giờ</button>
            <button type="button" onClick={() => setIntent("agent_waitlist")} aria-pressed={intent === "agent_waitlist"}>AI Agent</button>
            <button type="button" onClick={() => setIntent("prompt_pack")} aria-pressed={intent === "prompt_pack"}>Ngành mới</button>
          </div>
        </div>

        <form className="lead-form" onSubmit={submitLead}>
          <label>
            Tên của bạn
            <input name="name" required minLength={2} maxLength={80} placeholder="Ví dụ: Linh" autoComplete="name" />
          </label>
          <label>
            Email hoặc số điện thoại
            <input name="contact" required minLength={6} maxLength={120} placeholder="Để nhận lịch / thông báo" autoComplete="email" />
          </label>
          <label>
            Công việc hiện tại
            <input name="role" required minLength={2} maxLength={120} placeholder="Ví dụ: Content marketing cho SME" />
          </label>
          <label className="honeypot" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="consent-row">
            <input name="consent" type="checkbox" />
            <span>Tôi đồng ý để AliPrompt liên hệ về lựa chọn trên. Không gửi quảng cáo không liên quan.</span>
          </label>
          <button className="button button-primary wide" type="submit" disabled={submitState === "loading"}>
            {submitState === "loading" ? "Đang gửi…" : "Gửi đăng ký"} <Arrow />
          </button>
          {submitMessage && (
            <p className={`form-status ${submitState}`} role="status">{submitMessage}</p>
          )}
        </form>
      </section>

      <section className="faq-section section-shell">
        <div>
          <p className="eyebrow">HỎI THẲNG, ĐÁP THẬT</p>
          <h2>Trước khi bạn bỏ tiền.</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Tôi mới dùng ChatGPT, có học được không?</summary>
            <p>Có. Prompt Lab dành cho người mới. Lớp 2 giờ bắt đầu từ cách phân biệt yêu cầu, bối cảnh và tiêu chuẩn, không yêu cầu biết code.</p>
          </details>
          <details>
            <summary>AliPrompt có “train” lại mô hình AI không?</summary>
            <p>Không mặc định. “Dạy AI” ở Phase 2 là cấu hình instruction, context, ví dụ, memory và quy trình. Fine-tuning chỉ là một kỹ thuật riêng, thường chưa cần cho người mới.</p>
          </details>
          <details>
            <summary>Học xong AI có làm thay tôi hoàn toàn không?</summary>
            <p>Không. Mục tiêu là giao việc rõ hơn, giảm vòng sửa và biết điểm nào phải có con người kiểm tra hoặc phê duyệt.</p>
          </details>
          <details>
            <summary>Vì sao chưa mở luôn khóa AI Agent?</summary>
            <p>Agent chỉ có ý nghĩa khi bạn đã có một công việc lặp lại, input rõ và tiêu chuẩn kiểm tra. Bán sớm hơn sẽ khiến người học tốn tiền nhưng chưa dùng được.</p>
          </details>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <a className="brand" href="#top"><span className="brand-mark">A</span><span>AliPrompt</span></a>
          <p>Từ biết hỏi đến biết giao việc.</p>
          <span>© 2026 AliPrompt.vn</span>
        </div>
      </footer>
    </main>
  );
}
