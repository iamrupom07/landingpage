import { DashboardContent } from "@/features/admin/components/dashboard-content";
import { getAnalytics, getLeads } from "@/features/admin/services/leads";

export default async function DashboardPage() {
  const [summary, { leads: recentLeads }] = await Promise.all([
    getAnalytics(),
    getLeads({ page: 1, pageSize: 5 }),
  ]);

  return <DashboardContent summary={summary} recentLeads={recentLeads} />;
}
