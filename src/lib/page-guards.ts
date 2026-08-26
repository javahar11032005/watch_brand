import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";

export async function requireAdminPage(nextPath: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
