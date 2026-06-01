"use server";

import type { CreateManualLeadPayload, LeadStatus, SendEmailPayload } from "@/types/admin";
import { requireAdminToken } from "../auth/session";
import {
  createManualLead,
  deleteLead,
  exportLeads,
  getAnalytics,
  getLead,
  getLeads,
  sendEmailToLead,
  updateLeadStatus,
} from "./leads";

export async function getLeadsAction(params: Parameters<typeof getLeads>[0]) {
  const token = await requireAdminToken();
  return getLeads(params, token);
}

export async function getLeadAction(id: string) {
  const token = await requireAdminToken();
  return getLead(id, token);
}

export async function exportLeadsAction(params: Parameters<typeof exportLeads>[0]) {
  const token = await requireAdminToken();
  return exportLeads(params, token);
}

export async function getAnalyticsAction() {
  const token = await requireAdminToken();
  return getAnalytics(token);
}

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  const token = await requireAdminToken();
  return updateLeadStatus(id, status, token);
}

export async function createManualLeadAction(payload: CreateManualLeadPayload) {
  const token = await requireAdminToken();
  return createManualLead(payload, token);
}

export async function sendEmailToLeadAction(id: string, payload: SendEmailPayload) {
  const token = await requireAdminToken();
  return sendEmailToLead(id, payload, token);
}

export async function deleteLeadAction(id: string) {
  const token = await requireAdminToken();
  await deleteLead(id, token);
}
