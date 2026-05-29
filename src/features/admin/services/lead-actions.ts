"use server";

import type { LeadStatus } from "@/types/admin";
import { requireAdminSession } from "../auth/session";
import { deleteLead, getAnalytics, getLead, getLeads, updateLeadStatus } from "./leads";

export async function getLeadsAction(params: Parameters<typeof getLeads>[0]) {
  await requireAdminSession();
  return getLeads(params);
}

export async function getLeadAction(id: string) {
  await requireAdminSession();
  return getLead(id);
}

export async function getAnalyticsAction() {
  await requireAdminSession();
  return getAnalytics();
}

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  await requireAdminSession();
  return updateLeadStatus(id, status);
}

export async function deleteLeadAction(id: string) {
  await requireAdminSession();
  await deleteLead(id);
}
