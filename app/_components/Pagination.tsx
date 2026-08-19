import Link from "next/link";

export default function Pagination({ page, total, pageSize, query, topic, order }: { page: number; total: number; pageSize: number; query?: string; topic?: string; order?: string }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount < 2) return null;
  function href(nextPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (topic) params.set("topic", topic);
    if (order && order !== "newest") params.set("order", order);
    params.set("page", String(nextPage));
    return `/?${params.toString()}`;
  }
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => start + index);
  return <nav className="pagination" aria-label="Phân trang kết quả"><Link aria-disabled={page === 1} tabIndex={page === 1 ? -1 : undefined} href={page === 1 ? href(1) : href(page - 1)}>Trước</Link>{pages.map((item) => <Link key={item} aria-current={item === page ? "page" : undefined} href={href(item)}>{item}</Link>)}<Link aria-disabled={page === pageCount} tabIndex={page === pageCount ? -1 : undefined} href={page === pageCount ? href(pageCount) : href(page + 1)}>Sau</Link></nav>;
}
