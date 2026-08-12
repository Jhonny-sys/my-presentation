import { isAdminSessionActive } from "@/lib/api/admin-client";

export async function isAdminAuthenticated(): Promise<boolean> {
  return isAdminSessionActive();
}
