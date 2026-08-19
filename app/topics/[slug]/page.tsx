import { notFound } from "next/navigation";
import CatalogSearch from "../../_components/CatalogSearch";
import MarketplaceShell from "../../_components/MarketplaceShell";
import PromptCard from "../../_components/PromptCard";
import { getActiveCategories, listPublicPrompts } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, prompts] = await Promise.all([getActiveCategories(), listPublicPrompts({ topic: slug })]);
  const topic = categories.find((category) => category.slug === slug);
  if (!topic) notFound();
  return <MarketplaceShell><main className="catalog-route"><p className="route-kicker">CHỦ ĐỀ</p><h1>{topic.name}</h1><p>{topic.description ?? "Những prompt được tuyển chọn cho chủ đề này."}</p><CatalogSearch categories={categories} topic={slug} />
    {prompts.length ? <div className="prompt-grid">{prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}</div> : <div className="catalog-empty"><h2>Chủ đề này đang được bổ sung</h2><p>Không có prompt công khai phù hợp ở thời điểm này.</p></div>}
  </main></MarketplaceShell>;
}
