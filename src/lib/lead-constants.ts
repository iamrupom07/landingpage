/**
 * Single source of truth for lead status and plan display labels/colours.
 *
 * BUG FIX: STATUS_LABELS, STATUS_COLORS, and PLAN_LABELS were copy-pasted
 * identically into FormSubmissionsPage.tsx, ManualLeadsPage.tsx, and
 * leads.schema.ts. Any future update had to be made in 3+ places.
 * Centralised here so the whole codebase imports from one location.
 */

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CLOSED_WON: "Won",
  CLOSED_LOST: "Lost"
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 border-blue-200",
  CONTACTED: "bg-amber-100 text-amber-800 border-amber-200",
  QUALIFIED: "bg-purple-100 text-purple-800 border-purple-200",
  CLOSED_WON: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CLOSED_LOST: "bg-slate-100 text-slate-600 border-slate-200"
};

export const PLAN_LABELS: Record<string, string> = {
  STARTER: "300 Mbps",
  PROFESSIONAL: "1 Gig",
  ENTERPRISE: "2 Gig"
};
