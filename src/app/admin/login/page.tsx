import { redirect } from "next/navigation";
import { getAdminSession } from "@/features/admin/auth/session";
import { AdminLoginForm } from "@/features/admin/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  // No defaults — users must type their credentials
  return <AdminLoginForm defaultEmail="" defaultPassword="" />;
}
