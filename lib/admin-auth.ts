import { env } from "cloudflare:workers";
import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "../app/chatgpt-auth";

type AliPromptRuntimeEnv = {
  ALIPROMPT_ADMIN_USER_ID?: string;
};

function configuredAdminUserId() {
  const runtime = env as unknown as AliPromptRuntimeEnv;
  return runtime.ALIPROMPT_ADMIN_USER_ID?.trim() ?? "";
}

export function isAdminUserId(userId: string) {
  const adminUserId = configuredAdminUserId();
  return Boolean(adminUserId) && userId === adminUserId;
}

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return user && isAdminUserId(user.userId) ? user : null;
}

export async function requireAdminUser(returnTo: string): Promise<ChatGPTUser | null> {
  const user = await requireChatGPTUser(returnTo);
  return isAdminUserId(user.userId) ? user : null;
}

