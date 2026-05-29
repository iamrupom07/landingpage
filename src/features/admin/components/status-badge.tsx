import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/admin";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  new: { label: "New", bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
  contacted: { label: "Contacted", bg: "#fffbeb", text: "#b45309", dot: "#f59e0b" },
  qualified: { label: "Qualified", bg: "#f5f3ff", text: "#7c3aed", dot: "#8b5cf6" },
  closed_won: { label: "Won", bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  closed_lost: { label: "Lost", bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn("status-badge", className)}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="status-dot"
        style={{ background: cfg.dot }}
        aria-hidden
      />
      {cfg.label}
    </span>
  );
}

export { STATUS_CONFIG };
