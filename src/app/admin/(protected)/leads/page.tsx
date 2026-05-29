import { Suspense } from "react";
import { AdminPageLoading } from "@/features/admin/components/admin-page-loading";
import LeadsContent from "@/features/admin/components/leads-content";

export default function LeadsPage() {
  return (
    <Suspense fallback={<AdminPageLoading />}>
      <LeadsContent />
    </Suspense>
  );
}
