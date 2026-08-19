import { and, eq, or } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getDb } from "../../../../db";
import { promptMedia, prompts } from "../../../../db/schema";
import { readPromptMedia } from "../../../../lib/blob";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await params;
  const [media] = await getDb().select({ blobKey: promptMedia.blobKey }).from(promptMedia).innerJoin(prompts, eq(promptMedia.promptId, prompts.id))
    .where(and(eq(promptMedia.id, mediaId), eq(prompts.moderationStatus, "approved"), or(eq(promptMedia.status, "validated"), eq(promptMedia.status, "public")))).limit(1);
  if (!media) return new Response("Not found.", { status: 404, headers: { "Cache-Control": "no-store" } });
  const result = await readPromptMedia(media.blobKey);
  if (!result) return new Response("Not found.", { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(result.stream, { headers: { "Content-Type": result.blob.contentType, "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
}
