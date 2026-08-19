"use client";

import Link from "next/link";
import { useRef } from "react";
import { getMessages, type Locale } from "../../lib/i18n";

type Category = { slug: string; name: string };

function filterHref({ query, topic, order }: { query?: string; topic?: string; order?: string }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (topic) params.set("topic", topic);
  if (order && order !== "newest") params.set("order", order);
  const search = params.toString();
  return search ? `/?${search}` : "/";
}

export default function TopicCarousel({
  categories,
  query,
  topic,
  order,
  locale = "vi",
}: {
  categories: Category[];
  query?: string;
  topic?: string;
  order?: string;
  locale?: Locale;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const copy = getMessages(locale).catalog;
  const move = (direction: 1 | -1) => railRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });

  return <section className="topic-carousel" aria-labelledby="topic-carousel-title">
    <div className="topic-carousel-heading">
      <p id="topic-carousel-title">{copy.topicCarouselTitle}</p>
      <div className="topic-carousel-controls">
        <button type="button" aria-label={copy.previousTopics} onClick={() => move(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m14.5 5.5-6.5 6.5 6.5 6.5" /></svg>
        </button>
        <button type="button" aria-label={copy.nextTopics} onClick={() => move(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" /></svg>
        </button>
      </div>
    </div>
    <div ref={railRef} className="topic-carousel-track" aria-label={copy.topic}>
      <Link href={filterHref({ query, order })} aria-current={topic ? undefined : "page"}>{copy.allTopics}</Link>
      {categories.map((category) => <Link key={category.slug} href={filterHref({ query, topic: category.slug, order })} aria-current={topic === category.slug ? "page" : undefined}>{category.name}</Link>)}
    </div>
  </section>;
}
