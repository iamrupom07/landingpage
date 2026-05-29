import type { AnalyticsSummary, Lead, LeadStatus, PaginatedLeads } from "@/types/admin";
import { INITIAL_LEADS } from "../data/mock-leads";

let leadsStore = [...INITIAL_LEADS];

type GetLeadsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: LeadStatus | "all";
  plan?: Lead["plan"] | "all" | string;
};

export async function getLeads(params: GetLeadsParams = {}): Promise<PaginatedLeads> {
  const { page = 1, pageSize = 10, search = "", status = "all", plan = "all" } = params;
  const query = search.trim().toLowerCase();

  const filtered = leadsStore
    .filter((lead) => {
      const matchSearch =
        !query ||
        lead.businessName.toLowerCase().includes(query) ||
        lead.contactName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.businessAddress.toLowerCase().includes(query);
      const matchStatus = status === "all" || lead.status === status;
      const matchPlan = plan === "all" || lead.plan === plan;

      return matchSearch && matchStatus && matchPlan;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;

  return {
    leads: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getLead(id: string): Promise<Lead> {
  const lead = leadsStore.find((item) => item.id === id);

  if (!lead) {
    throw new Error("Lead not found");
  }

  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const index = leadsStore.findIndex((lead) => lead.id === id);

  if (index === -1) {
    throw new Error("Lead not found");
  }

  leadsStore[index] = {
    ...leadsStore[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  return leadsStore[index];
}

export async function deleteLead(id: string): Promise<void> {
  leadsStore = leadsStore.filter((lead) => lead.id !== id);
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const total = leadsStore.length;
  const closedWon = leadsStore.filter((lead) => lead.status === "closed_won").length;
  const sevenDaysAgo = Date.now() - 7 * 86400000;

  return {
    total,
    new: leadsStore.filter((lead) => lead.status === "new").length,
    contacted: leadsStore.filter((lead) => lead.status === "contacted").length,
    qualified: leadsStore.filter((lead) => lead.status === "qualified").length,
    closed_won: closedWon,
    closed_lost: leadsStore.filter((lead) => lead.status === "closed_lost").length,
    byPlan: {
      starter: leadsStore.filter((lead) => lead.plan === "starter").length,
      professional: leadsStore.filter((lead) => lead.plan === "professional").length,
      enterprise: leadsStore.filter((lead) => lead.plan === "enterprise").length,
    },
    recentCount: leadsStore.filter((lead) => new Date(lead.createdAt).getTime() > sevenDaysAgo).length,
    conversionRate: total > 0 ? Math.round((closedWon / total) * 100) : 0,
  };
}
