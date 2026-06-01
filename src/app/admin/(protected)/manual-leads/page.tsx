import { redirect } from "next/navigation";

export default function ManualLeadsRedirectPage() {
  redirect("/admin/leads?source=manual");
}
