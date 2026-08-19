/* eslint-disable @next/next/no-img-element -- Private media is streamed through an authenticated app route and has no trustworthy dimensions for next/image. */
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import MarketplaceShell from "../../_components/MarketplaceShell";
import PromptUsePanel from "../../_components/PromptUsePanel";
import PromptWorkspaceControls from "../../_components/PromptWorkspaceControls";
import PromptCommunityControls from "../../_components/PromptCommunityControls";
import FavoriteButton from "../../_components/FavoriteButton";
import { getPromptUseData, getPublicPrompt, getPublicPromptMedia, getViewerFavorite, getViewerReaction } from "../../../lib/catalog";
import { getCurrentUser } from "../../../lib/auth";
import { hasActiveEntitlement } from "../../../lib/commerce";
import { getMessages, isLocale } from "../../../lib/i18n";

export const dynamic = "force-dynamic";

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const copy = getMessages(locale).catalog;
  const prompt = await getPublicPrompt(slug);
  if (!prompt) notFound();
  const user = await getCurrentUser();
  const [reaction, saved, entitled, media] = await Promise.all([getViewerReaction(prompt.id, user?.id), getViewerFavorite(prompt.id, user?.id), hasActiveEntitlement(user?.id, prompt.productId), getPublicPromptMedia(prompt.id)]);
  const paid = prompt.accessKind === "paid";
  const canUsePrompt = !paid || entitled;
  const useData = canUsePrompt ? await getPromptUseData(prompt.id) : null;
  const author = prompt.contributorId && prompt.contributorName
    ? <Link href={`/contributors/${prompt.contributorId}`}>Bởi {prompt.contributorName}</Link>
    : prompt.guestAuthorName ? <span>Bởi {prompt.guestAuthorName}</span> : <span>Biên soạn bởi ALIPROMPT</span>;
  return <MarketplaceShell><main className="prompt-detail"><Link className="back-link" href="/">← Quay lại thư viện</Link><p className="route-kicker">{prompt.categoryName ?? "ALIPROMPT"}</p><h1>{prompt.title}</h1><p className="prompt-summary">{prompt.summary}</p>
    <div className="prompt-detail-meta"><span>{prompt.viewCount} {copy.views}</span><span>{prompt.likeCount} {copy.helpfulCount}</span><span>{copy.model}: {prompt.modelCompatibility}</span><span>{copy.contentLanguage}: {prompt.contentLanguage === "en" ? "English" : prompt.contentLanguage === "multilingual" ? "VI + EN" : "Tiếng Việt"}</span>{author}</div><FavoriteButton promptId={prompt.id} promptSlug={prompt.slug} signedIn={Boolean(user)} initialSaved={saved} locale={locale} />
    {media.length ? <div className="prompt-media" aria-label="Ảnh minh họa prompt">{media.map((item) => <div key={item.id}><img src={`/api/media/${item.id}`} alt={item.altText} loading="lazy" /></div>)}</div> : null}
    {canUsePrompt && useData ? <PromptUsePanel prompt={useData.body} promptId={prompt.id} trackingEnabled={Boolean(user)} locale={locale} version={useData.version} variableDefinitions={useData.variableDefinitions} usageMetadata={useData.usageMetadata} outputSchema={useData.outputSchema} lastTestedAt={useData.lastTestedAt} /> : <section className="prompt-paywall"><h2>Tài nguyên trả phí của ALIPROMPT</h2><p>Bạn cần sở hữu sản phẩm này để xem prompt đầy đủ và lưu vào thư viện riêng.</p>{prompt.productSlug ? <Link href={`/checkout/${prompt.productSlug}`}>Xem lựa chọn truy cập</Link> : <p>Gói truy cập đang được chuẩn bị. ALIPROMPT sẽ không mở nội dung trước khi sản phẩm được cấu hình.</p>}</section>}
    {user ? <PromptWorkspaceControls promptId={prompt.id} locale={locale} /> : null}
    <PromptCommunityControls promptId={prompt.id} promptSlug={prompt.slug} signedIn={Boolean(user)} initialReaction={reaction} initialLikes={prompt.likeCount} initialDislikes={prompt.dislikeCount} />
  </main></MarketplaceShell>;
}
