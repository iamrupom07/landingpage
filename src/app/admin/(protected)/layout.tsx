import { requireAdminSession } from "@/features/admin/auth/session";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
