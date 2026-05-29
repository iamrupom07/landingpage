import { redirect } from "next/navigation";
import { getAdminLoginDefaults, getAdminSession } from "@/features/admin/auth/session";
import { AdminLoginForm } from "@/features/admin/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  const defaults = getAdminLoginDefaults();

  return (
    <AdminLoginForm
      defaultEmail={defaults.email}
      defaultPassword={defaults.password}
    />
  );
}
