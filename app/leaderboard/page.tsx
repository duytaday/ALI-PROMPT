import Link from "next/link";
import MarketplaceShell from "../_components/MarketplaceShell";
import { getContributorLeaderboard } from "../../lib/leaderboard";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const contributors = await getContributorLeaderboard();
  return <MarketplaceShell><main className="leaderboard-page"><p className="route-kicker">ĐÓNG GÓP CỘNG ĐỒNG</p><h1>Bảng xếp hạng người chia sẻ.</h1><p>Điểm đóng góp = 10 điểm cho mỗi prompt cộng đồng đã duyệt + số lượt được cộng đồng đánh giá hữu ích. Chỉ hiển thị tên công khai, không công bố email hay dữ liệu riêng tư.</p>
    {contributors.length ? <ol className="leaderboard-list">{contributors.map((contributor, index) => <li key={contributor.id}><span aria-label={`Hạng ${index + 1}`}>{index + 1}</span><Link href={`/contributors/${contributor.id}`}>{contributor.displayName}</Link><small>{contributor.promptCount} prompt đã duyệt · {contributor.helpfulCount} hữu ích</small><strong>{contributor.score} điểm</strong></li>)}</ol> : <div className="catalog-empty"><h2>Chưa có người đóng góp đủ điều kiện</h2><p>Khi các prompt cộng đồng đầu tiên được duyệt, bảng này sẽ cập nhật tự động.</p></div>}
  </main></MarketplaceShell>;
}
