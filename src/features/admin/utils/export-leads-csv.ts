"use client";

import type { Lead } from "@/types/admin";

const CSV_HEADERS = [
  "ID", "Business", "Contact", "Email", "Phone",
  "Address", "Provider", "Employees", "Plan",
  "Status", "IP Address", "Submitted",
];

function escapeCell(value: string): string {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}

/** Client-side CSV export from already-fetched lead data */
export function exportLeadsCSV(leads: Lead[]): void {
  const rows = leads.map((lead) => [
    lead.id,
    lead.businessName,
    lead.contactName,
    lead.email,
    lead.phone,
    lead.businessAddress,
    lead.currentProvider ?? "",
    lead.employees ?? "",
    lead.plan ?? "",
    lead.status,
    lead.ipAddress ?? "",
    new Date(lead.createdAt).toLocaleDateString(),
  ]);

  const csv  = [CSV_HEADERS, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href     = url;
  link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
