const resendEndpoint = "https://api.resend.com/emails";

function appUrl() {
  const value = process.env.ALIPROMPT_APP_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (process.env.ALIPROMPT_ENVIRONMENT === "production" && url.protocol !== "https:") return null;
    return url.toString().replace(/\/$/, "");
  } catch { return null; }
}

export function isPasswordResetDeliveryConfigured() {
  return process.env.ALIPROMPT_EMAIL_PROVIDER === "resend"
    && Boolean(process.env.RESEND_API_KEY?.trim())
    && Boolean(process.env.ALIPROMPT_EMAIL_FROM?.trim())
    && Boolean(appUrl());
}

export async function sendPasswordResetEmail(email: string, rawToken: string) {
  const baseUrl = appUrl();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ALIPROMPT_EMAIL_FROM?.trim();
  if (!isPasswordResetDeliveryConfigured() || !baseUrl || !apiKey || !from) return false;
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
  const response = await fetch(resendEndpoint, {
    method: "POST", cache: "no-store",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [email], subject: "Khôi phục mật khẩu ALIPROMPT", text: `Bạn đã yêu cầu khôi phục mật khẩu ALIPROMPT. Liên kết này hết hạn sau 30 phút: ${resetUrl}\n\nNếu không phải bạn, hãy bỏ qua email này.` }),
  }).catch(() => null);
  return Boolean(response?.ok);
}
