"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Lead, LeadStatus, PaginatedLeads } from "@/types/admin";
import { exportLeadsCSV } from "../utils/export-leads-csv";
import { formatDate, formatPlan } from "../utils/format";
import { getLeadsAction } from "../services/lead-actions";
import { LeadDrawer } from "./lead-drawer";
import { StatusBadge } from "./status-badge";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
];

const PLAN_OPTIONS = [
  { value: "all", label: "All Plans" },
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];

export default function LeadsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">(() =>
    getInitialStatus(searchParams.get("status"))
  );
  const [plan, setPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  // BUG FIX: removed `allLeads` state — the original code fired two API calls
  // on every pagination click (10 leads for display + 1 000 leads for CSV export).
  // The 1 000-row fetch has been moved to an on-demand handleExport() handler
  // that only runs when the user actually clicks "Export CSV".
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);

    try {
      // BUG FIX: single request — removed the second 1 000-row fetch that ran
      // on every page/filter change solely to pre-populate the CSV export buffer.
      const result = await getLeadsAction({ page, pageSize: PAGE_SIZE, search: debouncedSearch, status, plan });
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, plan, status]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const id = searchParams.get("id");

    if (id && data?.leads) {
      const lead = data.leads.find((item) => item.id === id);

      if (lead) {
        setSelectedLead(lead);
      }
    }
  }, [data, searchParams]);

  function handleLeadUpdate(updated: Lead) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            leads: prev.leads.map((lead) => (lead.id === updated.id ? updated : lead)),
          }
        : prev
    );
    setSelectedLead(updated);
  }

  function handleLeadDelete(id: string) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            leads: prev.leads.filter((lead) => lead.id !== id),
            total: Math.max(0, prev.total - 1),
          }
        : prev
    );
    setSelectedLead(null);
    router.push("/admin/leads");
  }

  // BUG FIX: export is now on-demand — only fetches the large dataset when
  // the user explicitly clicks "Export CSV", not on every page navigation.
  async function handleExport() {
    setExporting(true);
    try {
      const all = await getLeadsAction({ page: 1, pageSize: 5000, search: debouncedSearch, status, plan });
      exportLeadsCSV(all.leads);
    } finally {
      setExporting(false);
    }
  }

  function clearFilters() {
    setStatus("all");
    setPlan("all");
    setSearch("");
    setPage(1);
  }

  const hasActiveFilters = status !== "all" || plan !== "all" || Boolean(debouncedSearch);

  return (
    <div className="ls">
      <div className="lh">
        <div>
          <h1 className="lt">Leads</h1>
          <p className="lsub">
            {data ? `${data.total} total lead${data.total !== 1 ? "s" : ""}` : "Loading..."}
          </p>
        </div>
        <div className="lead-actions">
          <button onClick={handleExport} disabled={exporting || !data?.total} className="expbtn">
            <Download className="h-4 w-4" /> {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <button onClick={fetchLeads} className="refbtn" title="Refresh">
            <RefreshCw className={`h-4 w-4${loading ? " spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="swrap">
          <Search className="sico h-4 w-4" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search business, contact, email..."
            className="sinp"
          />
          {search && (
            <button onClick={() => setSearch("")} className="sclear" aria-label="Clear search">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((value) => !value)}
          className={`fbtn${hasActiveFilters ? " fbtn-on" : ""}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="fbtl">Filters</span>
          {hasActiveFilters && <span className="fdot" />}
        </button>
      </div>

      {showFilters && (
        <div className="fpanel">
          <div className="fg">
            <p className="fl">Status</p>
            <div className="fo">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatus(option.value);
                    setPage(1);
                  }}
                  className={`fc${status === option.value ? " fc-on" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="fg">
            <p className="fl">Plan</p>
            <div className="fo">
              {PLAN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setPlan(option.value);
                    setPage(1);
                  }}
                  className={`fc${plan === option.value ? " fc-on" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="fclr">
              <X className="h-3.5 w-3.5" /> Clear all
            </button>
          )}
        </div>
      )}

      <div className="twrap">
        {loading ? (
          <div className="ldg">
            <div className="spn" />
          </div>
        ) : !data?.leads.length ? (
          <div className="empty">
            <Filter className="empty-icon h-8 w-8" />
            <p>No leads match your filters.</p>
            <button onClick={clearFilters} className="ereset">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="tscroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Business</th>
                  <th className="hdsm">Contact</th>
                  <th className="hdmd">Plan</th>
                  <th>Status</th>
                  <th className="hdmd">Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="tr">
                    <td>
                      <div className="bizcell">
                        <div className="avt">{lead.businessName[0]}</div>
                        <div>
                          <p className="bname">{lead.businessName}</p>
                          <p className="esm">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hdsm">
                      <p className="tp">{lead.contactName}</p>
                      <p className="ts">{lead.email}</p>
                    </td>
                    <td className="hdmd">
                      <span className="pchip">{formatPlan(lead.plan) || <>&mdash;</>}</span>
                    </td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="hdmd ts">{formatDate(lead.createdAt)}</td>
                    <td>
                      <button
                        className="vbtn"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedLead(lead);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="pgn">
          <p className="pginfo">
            Showing {(page - 1) * PAGE_SIZE + 1}&ndash;{Math.min(page * PAGE_SIZE, data.total)} of {data.total}
          </p>
          <div className="pgbtns">
            <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="pb">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: data.totalPages }, (_, index) => index + 1)
              .filter((item) => item === 1 || item === data.totalPages || Math.abs(item - page) <= 1)
              .map((item, index, visiblePages) => (
                <span key={item} className="contents">
                  {index > 0 && visiblePages[index - 1] !== item - 1 && <span className="pellip">&hellip;</span>}
                  <button onClick={() => setPage(item)} className={`pb pnum${item === page ? " pb-on" : ""}`}>
                    {item}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((value) => Math.min(data.totalPages, value + 1))}
              disabled={page === data.totalPages}
              className="pb"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => {
            setSelectedLead(null);
            router.push("/admin/leads");
          }}
          onUpdate={handleLeadUpdate}
          onDelete={handleLeadDelete}
        />
      )}
    </div>
  );
}

function getInitialStatus(value: string | null): LeadStatus | "all" {
  const allowed = STATUS_OPTIONS.map((option) => option.value);

  return allowed.includes(value as LeadStatus | "all") ? (value as LeadStatus | "all") : "all";
}
