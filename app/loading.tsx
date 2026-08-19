export default function Loading() {
  return (
    <main className="route-loading" aria-busy="true" aria-live="polite">
      <section className="route-loading-status" role="status">
        <div className="route-loading-brand" aria-hidden="true">
          <span className="route-loading-mark">A</span>
          <strong>ALIPROMPT</strong>
        </div>
        <div className="route-loading-pulse" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="route-loading-kicker">AI PROMPT WORKSPACE</p>
        <h1>Đang chuẩn bị thư viện prompt</h1>
        <p className="route-loading-copy">
          Chúng tôi đang kết nối dữ liệu và sắp xếp nội dung phù hợp cho bạn.
        </p>
        <div className="route-loading-progress" aria-hidden="true"><span /></div>
        <p className="route-loading-note">Thường chỉ mất vài giây</p>
      </section>

      <section className="route-loading-preview" aria-hidden="true">
        <div className="route-loading-preview-heading">
          <span />
          <span />
        </div>
        <div className="route-loading-preview-grid">
          {Array.from({ length: 3 }, (_, index) => (
            <article key={index}>
              <div />
              <span />
              <span />
              <span />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
