import type { Lead, Plan } from "@/types/admin";

const PLAN_LABELS: Record<Plan, string> = {
  starter:      "300 Mbps",
  professional: "1 Gig",
  enterprise:   "2 Gig",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

export function formatPlan(plan: Lead["plan"]): string {
  if (!plan) return "";
  return PLAN_LABELS[plan] ?? plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function formatRelative(iso: string): string {
  const diff    = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60_000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}
