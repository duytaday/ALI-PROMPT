import Link from "next/link";
import { getMessages, type Locale } from "../../lib/i18n";
import FavoriteButton from "./FavoriteButton";
import PromptReactionButtons from "./PromptReactionButtons";

type PromptCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  accessKind: string;
  modelCompatibility?: string | null;
  contentLanguage?: string | null;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  categoryName: string | null;
  categorySlug: string | null;
  contributorId: string | null;
  contributorName: string | null;
  guestAuthorName: string | null;
  mediaId?: string | null;
};

export default function PromptCard({ prompt, signedIn = false, initialSaved = false, locale = "vi", presentation = "compact" }: { prompt: PromptCardData; signedIn?: boolean; initialSaved?: boolean; locale?: Locale; presentation?: "compact" | "visual" }) {
  const copy = getMessages(locale).catalog;
  const visualCard = presentation === "visual";
  const author = prompt.contributorId && prompt.contributorName
    ? <Link href={`/contributors/${prompt.contributorId}`}>{locale === "en" ? `By ${prompt.contributorName}` : `Bởi ${prompt.contributorName}`}</Link>
    : prompt.guestAuthorName ? <span>{locale === "en" ? `By ${prompt.guestAuthorName}` : `Bởi ${prompt.guestAuthorName}`}</span>
      : <span>{copy.authoredBy}</span>;
  return (
    <article className={`prompt-card${visualCard ? " prompt-card--visual" : ""}`}>
      {visualCard ? prompt.mediaId ? <Link className="prompt-card-media" href={`/prompts/${prompt.slug}`} aria-label={locale === "en" ? `Open ${prompt.title}` : `Mở ${prompt.title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- approved media is served by the app's access-controlled route. */}
        <img src={`/api/media/${prompt.mediaId}`} alt="" loading="lazy" />
      </Link> : <div className="prompt-card-media prompt-card-media-placeholder" aria-hidden="true"><span>{prompt.categoryName ?? "ALIPROMPT"}</span></div> : null}
      <div className="prompt-card-topline">
        {prompt.categorySlug && prompt.categoryName ? <Link href={`/topics/${prompt.categorySlug}`}>{prompt.categoryName}</Link> : <span>ALIPROMPT</span>}
        <span className={`access-pill ${prompt.accessKind === "paid" ? "is-paid" : "is-free"}`}>{prompt.accessKind === "paid" ? copy.paid : copy.free}</span>
      </div>
      <h2><Link href={`/prompts/${prompt.slug}`}>{prompt.title}</Link></h2>
      <p>{prompt.summary}</p>
      <div className="prompt-card-facts" aria-label={locale === "en" ? "Prompt details" : "Thông tin prompt"}>
        <span>{copy.model}: {prompt.modelCompatibility ?? "General AI chat"}</span>
        <span>{copy.contentLanguage}: {prompt.contentLanguage === "en" ? "English" : prompt.contentLanguage === "multilingual" ? "VI + EN" : "Tiếng Việt"}</span>
      </div>
      <footer>
        {author}
        <span>{prompt.viewCount} {copy.views}</span>
      </footer>
      <div className="prompt-card-actions"><PromptReactionButtons promptId={prompt.id} promptSlug={prompt.slug} promptTitle={prompt.title} signedIn={signedIn} initialLikes={prompt.likeCount} initialDislikes={prompt.dislikeCount} /><FavoriteButton promptId={prompt.id} promptSlug={prompt.slug} signedIn={signedIn} initialSaved={initialSaved} locale={locale} /></div>
    </article>
  );
}
