"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { Lead, LeadStatus, SendEmailPayload } from "@/types/admin";
import {
  deleteLeadAction,
  getLeadsAction,
  sendEmailToLeadAction,
  updateLeadStatusAction,
} from "@/features/admin/services/lead-actions";
// BUG FIX: was copy-pasted locally — now imported from single source of truth
import { STATUS_LABELS, STATUS_COLORS, PLAN_LABELS } from "@/lib/lead-constants";

const PAGE_SIZE = 20;

// BUG FIX: The original loaded 100 rows on mount and filtered entirely in the
// browser with leads.filter() on every keystroke — O(n) client-side scan.
// Replaced with debounced server-side filtering (same pattern as LeadsContent)
// so search/status changes issue a single targeted API call with pagination.
export default function FormSubmissionsPage() {
  const [data, setData]                 = useState<{ leads: Lead[]; total: number; totalPages: number } | null>(null);
  const [page, setPage]                 = useState(1);
  const [search, setSearch]             = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailForm, setEmailForm]       = useState<SendEmailPayload>({ subject: "", body: "" });
  const [emailError, setEmailError]     = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isPending, startTransition]    = useTransition();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(() => {
    startTransition(async () => {
      const res = await getLeadsAction({
        source: "form",
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setData(res);
    });
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    startTransition(async () => {
      const updated = await updateLeadStatusAction(id, status);
      setData((prev) => prev ? { ...prev, leads: prev.leads.map((l) => (l.id === id ? updated : l)) } : prev);
      if (selectedLead?.id === id) setSelectedLead(updated);
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteLeadAction(id);
      setData((prev) => prev ? { ...prev, leads: prev.leads.filter((l) => l.id !== id), total: Math.max(0, prev.total - 1) } : prev);
      if (selectedLead?.id === id) setSelectedLead(null);
      setDeleteConfirm(null);
    });
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead) return;
    setEmailError(null);
    setEmailSuccess(false);
    startTransition(async () => {
      try {
        await sendEmailToLeadAction(selectedLead.id, emailForm);
        setEmailSuccess(true);
        setEmailForm({ subject: "", body: "" });
      } catch (err: unknown) {
        setEmailError(err instanceof Error ? err.message : "Failed to send email.");
      }
    });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const leads = data?.leads ?? [];
  const loading = !data && isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Form Submissions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Leads submitted through your public landing page</p>
      </div>

      {/* Filters — server-side now */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
          <input
            type="search"
            placeholder="Search name, business, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as LeadStatus | "all"); setPage(1); }}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        {isPending && <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>}
        {!isPending && <span className="ml-auto text-xs text-gray-400">{data?.total ?? 0} submission{data?.total !== 1 ? "s" : ""}</span>}
      </div>

      <div className="p-6 flex gap-6" style={{ minHeight: "calc(100vh - 133px)" }}>
        {/* Table */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading submissions…</div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p className="text-sm">{search || statusFilter !== "all" ? "No submissions match your filters." : "No form submissions yet."}</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-5 py-3">Contact</th>
                      <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-4 py-3">Business</th>
                      <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-4 py-3">Plan</th>
                      <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-4 py-3">Status</th>
                      <th className="text-left font-medium text-gray-500 text-xs uppercase tracking-wide px-4 py-3">Submitted</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => { setSelectedLead(lead); setEmailSuccess(false); setEmailError(null); }}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedLead?.id === lead.id ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{lead.contactName}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{lead.businessName}</td>
                        <td className="px-4 py-3 text-gray-500">{lead.plan ? PLAN_LABELS[lead.plan] ?? lead.plan : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}`}>
                            {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(lead.createdAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(lead.id); }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-gray-500">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.total)} of {data.total}
                  </p>
                  <div className="flex gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isPending} className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">←</button>
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => (
                        <span key={p} className="contents">
                          {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 py-1.5 text-gray-400">…</span>}
                          <button
                            onClick={() => setPage(p)}
                            className={`px-3 py-1.5 border rounded-lg ${p === page ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "border-gray-300 hover:bg-gray-50"}`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}
                    <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages || isPending} className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50">→</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail + Reply Panel */}
        {selectedLead && (
          <div className="w-96 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selectedLead.contactName}</h2>
                <p className="text-sm text-gray-500">{selectedLead.businessName}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Info */}
            <div className="p-5 border-b border-gray-100 space-y-2">
              {[
                ["Email",    selectedLead.email],
                ["Phone",    selectedLead.phone],
                ["Address",  selectedLead.businessAddress],
                ["Provider", selectedLead.currentProvider],
                ...(selectedLead.plan ? [["Plan", PLAN_LABELS[selectedLead.plan] ?? selectedLead.plan]] : []),
                ...(selectedLead.employees ? [["Employees", selectedLead.employees]] : []),
                ...(selectedLead.ipAddress ? [["IP Address", selectedLead.ipAddress]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
                  <span className="text-gray-800 break-all">{value}</span>
                </div>
              ))}
              {selectedLead.comments && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  <p className="text-xs font-medium text-gray-400 mb-1">Message from client</p>
                  {selectedLead.comments}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Update Status</p>
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPending}
              >
                {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Reply by Email */}
            <div className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Reply by Email</p>
              {emailSuccess && (
                <div className="mb-3 bg-green-50 border border-green-200 text-green-800 text-sm px-3 py-2 rounded-lg">
                  ✓ Reply sent to {selectedLead.email}
                </div>
              )}
              {emailError && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                  {emailError}
                </div>
              )}
              <form onSubmit={handleSendEmail} className="space-y-3">
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Write your reply…"
                  value={emailForm.body}
                  onChange={(e) => setEmailForm((f) => ({ ...f, body: e.target.value }))}
                  required
                  rows={6}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {isPending ? "Sending…" : "Send Reply"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Submission?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={isPending} className="flex-1 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors">
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
