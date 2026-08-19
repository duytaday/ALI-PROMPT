import MarketplaceShell from "../../_components/MarketplaceShell";
import PromptCard from "../../_components/PromptCard";
import { notFound } from "next/navigation";
import { getPublicContributor, listPublicPrompts } from "../../../lib/catalog";
import { getCurrentUser } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function ContributorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contributor, prompts, user] = await Promise.all([getPublicContributor(id), listPublicPrompts({ contributor: id }), getCurrentUser()]);
  if (!contributor) notFound();
  return <MarketplaceShell><main className="catalog-route"><p className="route-kicker">NGƯỜI ĐÓNG GÓP</p><h1>{contributor.displayName}</h1><p>Những prompt miễn phí đã được duyệt và công khai trong cộng đồng ALIPROMPT.</p>
    {prompts.length ? <div className="prompt-grid">{prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} signedIn={Boolean(user)} />)}</div> : <div className="catalog-empty"><h2>Chưa có prompt công khai</h2><p>Thành viên này chưa có đóng góp được duyệt để hiển thị.</p></div>}
  </main></MarketplaceShell>;
}
