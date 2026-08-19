import { redirect } from "next/navigation";
import { getCurrentUser, type AuthenticatedUser } from "./auth";

export function isAdminUser(user: AuthenticatedUser) {
  return user.role === "admin";
}

export async function getAdminUser(): Promise<AuthenticatedUser | null> {
  const user = await getCurrentUser();
  return user && isAdminUser(user) ? user : null;
}

export async function requireAdminUser(returnTo: string): Promise<AuthenticatedUser | null> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?return_to=${encodeURIComponent(returnTo)}`);
  return isAdminUser(user) ? user : null;
}
