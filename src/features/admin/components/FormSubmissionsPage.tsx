"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Lead, LeadStatus, PaginatedLeads } from "@/types/admin";
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

export default function FormSubmissionsPage() {
  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(
    async (nextPage = page) => {
      setLoading(true);

      try {
        const result = await getLeadsAction({
          source: "form",
          page: nextPage,
          pageSize: PAGE_SIZE,
          search: debouncedSearch,
          status,
        });
        setData(result);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, page, status]
  );

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setPage(1);
  }

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

  function handleLeadDelete() {
    setSelectedLead(null);

    if (data?.leads.length === 1 && page > 1) {
      setPage((value) => Math.max(1, value - 1));
      return;
    }

    void fetchLeads();
  }

  const hasActiveFilters = status !== "all" || Boolean(debouncedSearch);

  return (
    <div className="ls">
      <div className="lh">
        <div>
          <h1 className="lt">Form Submissions</h1>
          <p className="lsub">
            {data ? `${data.total} public form submission${data.total !== 1 ? "s" : ""}` : "Loading..."}
          </p>
        </div>
        <div className="lead-actions">
          <button onClick={() => fetchLeads()} className="refbtn" title="Refresh">
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
            <p>{hasActiveFilters ? "No submissions match your filters." : "No form submissions yet."}</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="ereset">
                Clear filters
              </button>
            )}
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
                      <span className="pchip">{formatPlan(lead.plan) || "None"}</span>
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
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, data.total)} of {data.total}
          </p>
          <div className="pgbtns">
            <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="pb">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: data.totalPages }, (_, index) => index + 1)
              .filter((item) => item === 1 || item === data.totalPages || Math.abs(item - page) <= 1)
              .map((item, index, visiblePages) => (
                <span key={item} className="contents">
                  {index > 0 && visiblePages[index - 1] !== item - 1 && <span className="pellip">...</span>}
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
          onClose={() => setSelectedLead(null)}
          onUpdate={handleLeadUpdate}
          onDelete={handleLeadDelete}
        />
      )}
    </div>
  );
}
