import { redirect } from "next/navigation";
import { isAdminSessionActive } from "@/lib/api/admin-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  return children;
}
