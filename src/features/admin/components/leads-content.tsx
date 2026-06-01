"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CreateManualLeadPayload, Lead, LeadSource, LeadStatus, PaginatedLeads } from "@/types/admin";
import { downloadCSV } from "../utils/export-leads-csv";
import { formatDate, formatPlan } from "../utils/format";
import { createManualLeadAction, exportLeadsAction, getLeadsAction } from "../services/lead-actions";
import { LeadDrawer } from "./lead-drawer";
import { StatusBadge } from "./status-badge";

const PAGE_SIZE = 10;

const EMPTY_FORM: CreateManualLeadPayload = {
  businessName: "",
  businessAddress: "",
  contactName: "",
  phone: "",
  email: "",
  currentProvider: "",
  interestedPlan: undefined,
  employeeCount: undefined,
  comments: "",
  status: "new",
};

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

const SOURCE_OPTIONS: { value: LeadSource | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "form", label: "Form" },
  { value: "manual", label: "Manual" },
];

export default function LeadsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">(() => getInitialStatus(searchParams.get("status")));
  const [plan, setPlan] = useState("all");
  const [source, setSource] = useState<LeadSource | "all">(() => getInitialSource(searchParams.get("source")));
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [createForm, setCreateForm] = useState<CreateManualLeadPayload>(EMPTY_FORM);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(
    async (
      overrides: Partial<{
        page: number;
        search: string;
        status: LeadStatus | "all";
        plan: string;
        source: LeadSource | "all";
      }> = {}
    ) => {
      const next = {
        page,
        search: debouncedSearch,
        status,
        plan,
        source,
        ...overrides,
      };

      setLoading(true);

      try {
        const result = await getLeadsAction({
          page: next.page,
          pageSize: PAGE_SIZE,
          search: next.search,
          status: next.status,
          plan: next.plan,
          source: next.source,
        });
        setData(result);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, page, plan, source, status]
  );

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

  function handleLeadDelete() {
    setSelectedLead(null);
    router.push("/admin/leads");

    if (data?.leads.length === 1 && page > 1) {
      setPage((value) => Math.max(1, value - 1));
      return;
    }

    void fetchLeads();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const result = await exportLeadsAction({ search: debouncedSearch, status, plan, source });
      downloadCSV(result.csv, result.filename);
    } finally {
      setExporting(false);
    }
  }

  function clearFilters() {
    setStatus("all");
    setPlan("all");
    setSource("all");
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  }

  function handleCreateFormChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setCreateForm((current) => ({
      ...current,
      [name]: name === "employeeCount"
        ? value === "" ? undefined : Number(value)
        : value === "" ? undefined : value,
    }));
  }

  async function handleCreateLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreating(true);

    try {
      const created = await createManualLeadAction(createForm);
      setCreateForm(EMPTY_FORM);
      setShowCreateLead(false);
      setStatus("all");
      setPlan("all");
      setSource("all");
      setSearch("");
      setDebouncedSearch("");
      setPage(1);
      setSelectedLead(created);
      await fetchLeads({ page: 1, search: "", status: "all", plan: "all", source: "all" });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Unable to create lead.");
    } finally {
      setCreating(false);
    }
  }

  const hasActiveFilters =
    status !== "all" || plan !== "all" || source !== "all" || Boolean(debouncedSearch);

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
          <button onClick={() => setShowCreateLead(true)} className="createbtn">
            <Plus className="h-4 w-4" /> New Lead
          </button>
          <button onClick={handleExport} disabled={exporting || !data?.total} className="expbtn">
            <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export CSV"}
          </button>
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
          <FilterGroup
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) => {
              setStatus(value as LeadStatus | "all");
              setPage(1);
            }}
          />
          <FilterGroup
            label="Plan"
            options={PLAN_OPTIONS}
            value={plan}
            onChange={(value) => {
              setPlan(value);
              setPage(1);
            }}
          />
          <FilterGroup
            label="Source"
            options={SOURCE_OPTIONS}
            value={source}
            onChange={(value) => {
              setSource(value as LeadSource | "all");
              setPage(1);
            }}
          />
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
                  <th className="hdmd">Source</th>
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
                    <td className="hdmd">
                      <span className="pchip">{formatSource(lead.source)}</span>
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
          onClose={() => {
            setSelectedLead(null);
            router.push("/admin/leads");
          }}
          onUpdate={handleLeadUpdate}
          onDelete={handleLeadDelete}
        />
      )}

      {showCreateLead && (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Create manual lead">
            <div className="admin-modal-header">
              <div>
                <h2 className="admin-modal-title">New Lead</h2>
                <p className="admin-modal-sub">Add a lead gathered outside the public form.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateLead(false)}
                className="admin-modal-close"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {createError && (
              <div className="admin-form-error" role="alert">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateLead} className="create-lead-form">
              <div className="form-grid-2">
                <TextField name="contactName" label="Contact Name" value={createForm.contactName} onChange={handleCreateFormChange} required />
                <TextField name="businessName" label="Business Name" value={createForm.businessName} onChange={handleCreateFormChange} required />
                <TextField name="email" label="Email" type="email" value={createForm.email} onChange={handleCreateFormChange} required />
                <TextField name="phone" label="Phone" type="tel" value={createForm.phone} onChange={handleCreateFormChange} required />
              </div>

              <TextField
                name="businessAddress"
                label="Business Address"
                value={createForm.businessAddress}
                onChange={handleCreateFormChange}
                required
              />

              <div className="form-grid-2">
                <TextField
                  name="currentProvider"
                  label="Current Provider"
                  value={createForm.currentProvider}
                  onChange={handleCreateFormChange}
                  required
                />
                <TextField
                  name="employeeCount"
                  label="Employees"
                  type="number"
                  value={createForm.employeeCount ?? ""}
                  onChange={handleCreateFormChange}
                  min={1}
                />
                <SelectField
                  name="interestedPlan"
                  label="Interested Plan"
                  value={createForm.interestedPlan ?? ""}
                  onChange={handleCreateFormChange}
                  options={[
                    { value: "", label: "None" },
                    { value: "starter", label: "Starter" },
                    { value: "professional", label: "Professional" },
                    { value: "enterprise", label: "Enterprise" },
                  ]}
                />
                <SelectField
                  name="status"
                  label="Initial Status"
                  value={createForm.status ?? "new"}
                  onChange={handleCreateFormChange}
                  options={STATUS_OPTIONS.filter((option) => option.value !== "all")}
                />
              </div>

              <label className="admin-field">
                <span>Notes</span>
                <textarea
                  name="comments"
                  value={createForm.comments ?? ""}
                  onChange={handleCreateFormChange}
                  rows={3}
                  className="admin-field-input admin-field-textarea"
                />
              </label>

              <div className="admin-modal-actions">
                <button type="button" onClick={() => setShowCreateLead(false)} className="drawer-cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="createbtn">
                  {creating ? "Creating..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type FilterOption = {
  value: string;
  label: string;
};

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="fg">
      <p className="fl">{label}</p>
      <div className="fo">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`fc${value === option.value ? " fc-on" : ""}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type FieldProps = {
  name: string;
  label: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  required?: boolean;
  type?: string;
  min?: number;
};

function TextField({ name, label, value, onChange, required, type = "text", min }: FieldProps) {
  return (
    <label className="admin-field">
      <span>{label}{required ? " *" : ""}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="admin-field-input"
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  value,
  onChange,
  options,
}: FieldProps & { options: FilterOption[] }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange} className="admin-field-input">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function getInitialStatus(value: string | null): LeadStatus | "all" {
  const allowed = STATUS_OPTIONS.map((option) => option.value);
  return allowed.includes(value as LeadStatus | "all") ? (value as LeadStatus | "all") : "all";
}

function getInitialSource(value: string | null): LeadSource | "all" {
  const allowed = SOURCE_OPTIONS.map((option) => option.value);
  return allowed.includes(value as LeadSource | "all") ? (value as LeadSource | "all") : "all";
}

function formatSource(value: LeadSource) {
  return value === "manual" ? "Manual" : "Form";
}
