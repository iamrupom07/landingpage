import type {
  AnalyticsSummary,
  CreateManualLeadPayload,
  Lead,
  LeadSource,
  LeadStatus,
  PaginatedLeads,
  SendEmailPayload,
} from "@/types/admin";
import { apiFetch } from "@/lib/api";

type GetLeadsParams = {
  page?:     number;
  pageSize?: number;
  search?:   string;
  status?:   LeadStatus | "all";
  plan?:     Lead["plan"] | "all" | string;
  source?:   LeadSource | "all";
};

type ApiLeadsResponse = {
  success:    boolean;
  leads:      Lead[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};

type ApiAnalyticsResponse = {
  success: boolean;
  data:    AnalyticsSummary;
};

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getLeads(
  params: GetLeadsParams = {},
  token?: string
): Promise<PaginatedLeads> {
  const { page = 1, pageSize = 10, search = "", status = "all", plan = "all", source = "all" } = params;

  const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search)          query.set("search", search);
  if (status !== "all") query.set("status", status);
  if (plan   !== "all") query.set("plan",   plan);
  if (source !== "all") query.set("source", source);

  const res = await apiFetch<ApiLeadsResponse>(`/api/leads?${query}`, { token });

  return {
    leads:      res.leads,
    total:      res.total,
    page:       res.page,
    pageSize:   res.pageSize,
    totalPages: res.totalPages,
  };
}

export async function getLead(id: string, token?: string): Promise<Lead> {
  const res = await apiFetch<{ success: boolean; data: Lead }>(`/api/leads/${id}`, { token });
  return res.data;
}

export async function createManualLead(
  payload: CreateManualLeadPayload,
  token?: string
): Promise<Lead> {
  const res = await apiFetch<{ success: boolean; data: Lead }>("/api/leads/manual", {
    method: "POST",
    body:   JSON.stringify(payload),
    token,
  });
  return res.data;
}

export async function updateLeadStatus(
  id:     string,
  status: LeadStatus,
  token?: string
): Promise<Lead> {
  const res = await apiFetch<{ success: boolean; data: Lead }>(`/api/leads/${id}/status`, {
    method: "PATCH",
    body:   JSON.stringify({ status }),
    token,
  });
  return res.data;
}

export async function sendEmailToLead(
  id:      string,
  payload: SendEmailPayload,
  token?:  string
): Promise<void> {
  await apiFetch(`/api/leads/${id}/email`, {
    method: "POST",
    body:   JSON.stringify(payload),
    token,
  });
}

export async function deleteLead(id: string, token?: string): Promise<void> {
  await apiFetch(`/api/leads/${id}`, { method: "DELETE", token });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(token?: string): Promise<AnalyticsSummary> {
  const res = await apiFetch<ApiAnalyticsResponse>("/api/analytics/summary", { token });
  return res.data;
}
