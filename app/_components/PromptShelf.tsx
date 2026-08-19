import PromptCard from "./PromptCard";
import type { ComponentProps } from "react";
import { getMessages, type Locale } from "../../lib/i18n";
import PromptRail from "./PromptRail";

type Prompt = ComponentProps<typeof PromptCard>["prompt"];

export default function PromptShelf({ title, description, prompts, signedIn = false, locale = "vi", layout = "rail" }: { title: string; description: string; prompts: Prompt[]; signedIn?: boolean; locale?: Locale; layout?: "rail" | "masonry" }) {
  const copy = getMessages(locale).catalog;
  const cards = prompts.map((prompt) => <PromptCard key={prompt.slug} prompt={prompt} signedIn={signedIn} locale={locale} presentation={layout === "masonry" ? "visual" : "compact"} />);
  const masonryColumns = Array.from({ length: 4 }, (_, index) => cards.filter((_, cardIndex) => cardIndex % 4 === index));
  return <section className="prompt-shelf" aria-label={title}>
    <div className="section-heading"><div><p>{copy.discover}</p><h2>{title}</h2><span>{description}</span></div><span>{prompts.length} {copy.itemCount}</span></div>
    {prompts.length ? layout === "masonry" ? <div className="prompt-masonry">{masonryColumns.map((column, index) => <div className="prompt-masonry-column" key={index}>{column}</div>)}</div> : <PromptRail label={title}>{cards}</PromptRail> : <div className="catalog-empty"><h3>{copy.shelfEmptyTitle}</h3><p>{copy.shelfEmptyBody}</p></div>}
  </section>;
}
