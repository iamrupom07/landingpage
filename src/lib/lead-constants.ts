/**
 * Single source of truth for lead status and plan display labels/colours.
 *
 * Keys match the API's lowercase values ("new", "contacted", etc.) and the
 * LeadStatus type in types/admin.ts. Do NOT use uppercase keys here — the
 * API returns lowercase and indexing uppercase keys with lowercase values
 * returns undefined, breaking every badge and label in the admin UI.
 */

import type { LeadStatus } from "@/types/admin";

export type { LeadStatus };

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new:         "New",
  contacted:   "Contacted",
  qualified:   "Qualified",
  closed_won:  "Won",
  closed_lost: "Lost",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new:         "bg-blue-100 text-blue-800 border-blue-200",
  contacted:   "bg-amber-100 text-amber-800 border-amber-200",
  qualified:   "bg-purple-100 text-purple-800 border-purple-200",
  closed_won:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed_lost: "bg-slate-100 text-slate-600 border-slate-200",
};

// Plan keys match the API's lowercase values ("starter", "professional", "enterprise")
export const PLAN_LABELS: Record<string, string> = {
  starter:      "300 Mbps",
  professional: "1 Gig",
  enterprise:   "2 Gig",
};
