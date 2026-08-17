import type { Metadata } from "next";
import { headers } from "next/headers";
import AliPromptExperience from "./_components/AliPromptExperience";

const title = "AliPrompt — Từ biết hỏi đến biết giao việc";
const description =
  "Prompt theo ngành, lớp thực hành 2 giờ và lộ trình AI Agent giúp người Việt biến AI thành trợ lý làm việc có kiểm soát.";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "aliprompt.vn";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "vi_VN",
      type: "website",
      images: [{ url: image, width: 1536, height: 1024, alt: "AliPrompt — Từ biết hỏi đến biết giao việc" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function Home() {
  return <AliPromptExperience />;
}
