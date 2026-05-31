import { DashboardContent } from "@/features/admin/components/dashboard-content";
import { getAnalyticsAction, getLeadsAction } from "@/features/admin/services/lead-actions";

export default async function DashboardPage() {
  const [summary, { leads: recentLeads }] = await Promise.all([
    getAnalyticsAction(),
    getLeadsAction({ page: 1, pageSize: 5 }),
  ]);

  return <DashboardContent summary={summary} recentLeads={recentLeads} />;
}
