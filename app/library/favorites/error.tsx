"use client";

export default function FavoritesError({ reset }: { reset: () => void }) {
  return <main className="system-state"><h1>We couldn’t load saved prompts.</h1><p>Please retry. Your saved prompts have not been changed.</p><button type="button" onClick={reset}>Try again</button></main>;
}
