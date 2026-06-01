import type { ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Flame,
  Inbox,
  PhoneCall,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import type { AnalyticsSummary, Lead } from "@/types/admin";
import { formatRelative } from "../utils/format";
import { StatusBadge } from "./status-badge";

type DashboardContentProps = {
  summary: AnalyticsSummary;
  recentLeads: Lead[];
};

type StatCardProps = {
  label: string;
  value: number | string;
  icon: ElementType;
  accent: string;
  sub?: string;
  trend?: string;
};

export function DashboardContent({ summary, recentLeads }: DashboardContentProps) {
  return (
    <div className="dash-shell">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Welcome back. Here&rsquo;s your lead pipeline overview.</p>
        </div>
        <Link href="/admin/leads" className="dash-cta-btn">
          View all leads
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total Leads"
          value={summary.total}
          icon={Users}
          accent="stat-accent-blue"
          sub={`${summary.recentCount} this week`}
        />
        <StatCard
          label="New Leads"
          value={summary.new}
          icon={Flame}
          accent="stat-accent-amber"
          sub="Awaiting contact"
        />
        <StatCard
          label="Qualified"
          value={summary.qualified}
          icon={Star}
          accent="stat-accent-purple"
          sub="Ready to close"
        />
        <StatCard
          label="Won"
          value={summary.closed_won}
          icon={CheckCircle2}
          accent="stat-accent-green"
          sub={`${summary.conversionRate}% conversion`}
        />
      </div>

      <div className="charts-row">
        <PipelineBar summary={summary} />
        <PlanCard summary={summary} />
      </div>

      <div className="recent-card">
        <div className="recent-header">
          <div>
            <p className="pipeline-title">Recent Leads</p>
            <p className="recent-sub">Latest 5 submissions</p>
          </div>
          <Link href="/admin/leads" className="recent-all-link">
            All leads <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="recent-list">
          {/* BUG FIX: was rendering nothing when recentLeads was empty — now shows an empty state */}
          {recentLeads.length === 0 ? (
            <div className="recent-empty">
              <Inbox className="h-8 w-8 text-slate-300" />
              <p className="recent-empty-text">No leads yet. Your first submission will appear here.</p>
            </div>
          ) : (
            recentLeads.map((lead) => (
              <Link key={lead.id} href={`/admin/leads?id=${lead.id}`} className="recent-row">
                <div className="recent-row-avatar">{lead.businessName[0]}</div>
                <div className="recent-row-info">
                  <p className="recent-row-biz">{lead.businessName}</p>
                  <p className="recent-row-contact">
                    {lead.contactName} &middot; {lead.email}
                  </p>
                </div>
                <div className="recent-row-meta">
                  <StatusBadge status={lead.status} />
                  <span className="recent-row-time">
                    <Clock className="mr-1 inline h-3 w-3 opacity-50" />
                    {formatRelative(lead.createdAt)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="quick-actions">
        <Link href="/admin/leads?status=new" className="quick-action-card">
          <div className="qa-icon qa-icon--blue">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <p className="qa-title">Follow Up New Leads</p>
            <p className="qa-sub">{summary.new} awaiting contact</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-slate-300" />
        </Link>
        <Link href="/admin/leads?status=qualified" className="quick-action-card">
          <div className="qa-icon qa-icon--purple">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <p className="qa-title">Close Qualified Leads</p>
            <p className="qa-sub">{summary.qualified} ready to close</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-slate-300" />
        </Link>
        <Link href="/admin/leads" className="quick-action-card">
          <div className="qa-icon qa-icon--green">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="qa-title">View Full Pipeline</p>
            <p className="qa-sub">All {summary.total} leads</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-slate-300" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent, sub }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-inner">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
          {sub && <p className="stat-sub">{sub}</p>}
        </div>
        <div className={`stat-icon-wrap ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function PipelineBar({ summary }: { summary: AnalyticsSummary }) {
  const stages = [
    { label: "New",       value: summary.new,         color: "#3b82f6" },
    { label: "Contacted", value: summary.contacted,    color: "#f59e0b" },
    { label: "Qualified", value: summary.qualified,    color: "#8b5cf6" },
    { label: "Won",       value: summary.closed_won,   color: "#22c55e" },
    { label: "Lost",      value: summary.closed_lost,  color: "#ef4444" },
  ];
  const total = summary.total || 1;

  return (
    <div className="pipeline-card">
      <div className="pipeline-header">
        <p className="pipeline-title">Pipeline Breakdown</p>
        <p className="pipeline-total">{summary.total} total leads</p>
      </div>
      <div className="pipeline-bar-track">
        {stages.map((stage) => (
          <div
            key={stage.label}
            style={{
              width: `${(stage.value / total) * 100}%`,
              background: stage.color,
              minWidth: stage.value > 0 ? "4px" : 0,
            }}
            className="pipeline-bar-segment"
            title={`${stage.label}: ${stage.value}`}
          />
        ))}
      </div>
      <div className="pipeline-legend">
        {stages.map((stage) => (
          <div key={stage.label} className="pipeline-legend-item">
            <span className="pipeline-dot" style={{ background: stage.color }} />
            <span className="pipeline-legend-label">{stage.label}</span>
            <span className="pipeline-legend-value">{stage.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ summary }: { summary: AnalyticsSummary }) {
  const plans = [
    { label: "Starter",      value: summary.byPlan.starter,      color: "#64748b" },
    { label: "Professional", value: summary.byPlan.professional,  color: "#3b82f6" },
    { label: "Enterprise",   value: summary.byPlan.enterprise,    color: "#8b5cf6" },
  ];
  const total = summary.total || 1;

  return (
    <div className="plan-card">
      <p className="pipeline-title plan-title-spaced">Leads by Plan</p>
      <div className="plan-rows">
        {plans.map((plan) => (
          <div key={plan.label} className="plan-row">
            <div className="plan-row-label">
              <span className="pipeline-dot" style={{ background: plan.color }} />
              {plan.label}
            </div>
            <div className="plan-row-bar-wrap">
              <div className="plan-row-bar-track">
                <div
                  className="plan-row-bar-fill"
                  style={{ width: `${(plan.value / total) * 100}%`, background: plan.color }}
                />
              </div>
            </div>
            <span className="plan-row-val">{plan.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
