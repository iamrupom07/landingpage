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

type ExportLeadsParams = Pick<GetLeadsParams, "search" | "status" | "plan" | "source">;

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

export async function exportLeads(
  params: ExportLeadsParams = {},
  token?: string
): Promise<{ csv: string; filename: string }> {
  const { search = "", status = "all", plan = "all", source = "all" } = params;
  const query = new URLSearchParams();

  if (search)           query.set("search", search);
  if (status !== "all") query.set("status", status);
  if (plan   !== "all") query.set("plan",   plan);
  if (source !== "all") query.set("source", source);

  const suffix = query.toString() ? `?${query}` : "";
  const res = await apiFetch<Response>(`/api/leads/export${suffix}`, { token });
  const disposition = res.headers.get("content-disposition") ?? "";
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);

  return {
    csv: await res.text(),
    filename: filenameMatch?.[1] ?? `leads-${new Date().toISOString().slice(0, 10)}.csv`,
  };
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
