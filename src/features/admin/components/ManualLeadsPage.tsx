"use client";

import { useEffect, useState, useTransition } from "react";
import type { CreateManualLeadPayload, Lead, LeadStatus, SendEmailPayload } from "@/types/admin";
import {
  createManualLeadAction,
  deleteLeadAction,
  getLeadsAction,
  sendEmailToLeadAction,
  updateLeadStatusAction,
} from "@/features/admin/services/lead-actions";

// BUG FIX: was copy-pasted locally — now imported from single source of truth
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/lead-constants";

const EMPTY_FORM: CreateManualLeadPayload = {
  businessName:    "",
  businessAddress: "",
  contactName:     "",
  phone:           "",
  email:           "",
  currentProvider: "",
  interestedPlan:  undefined,
  employeeCount:   undefined,
  comments:        "",
  status:          "new",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManualLeadsPage() {
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [loaded, setLoaded]             = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState<CreateManualLeadPayload>(EMPTY_FORM);
  const [formError, setFormError]       = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailForm, setEmailForm]       = useState<SendEmailPayload>({ subject: "", body: "" });
  const [emailError, setEmailError]     = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isPending, startTransition]    = useTransition();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // BUG FIX: was calling startTransition inside the render body (if !loaded),
  // which triggers in every render pass and causes React Strict Mode double-fires.
  // Moved to useEffect so it runs once after mount.
  useEffect(() => {
    startTransition(async () => {
      const res = await getLeadsAction({ source: "manual", pageSize: 100 });
      setLeads(res.leads);
      setLoaded(true);
    });
  }, []);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value === "" ? undefined : value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    startTransition(async () => {
      try {
        const lead = await createManualLeadAction(form);
        setLeads((prev) => [lead, ...prev]);
        setShowForm(false);
        setForm(EMPTY_FORM);
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "Failed to create lead.");
      }
    });
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    startTransition(async () => {
      const updated = await updateLeadStatusAction(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      if (selectedLead?.id === id) setSelectedLead(updated);
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteLeadAction(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Manual Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">Leads you create manually and manage from the dashboard</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setFormError(null); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> New Lead
        </button>
      </div>

      <div className="p-6 flex gap-6" style={{ minHeight: "calc(100vh - 73px)" }}>
        {/* Lead List */}
        <div className="flex-1 min-w-0">
          {!loaded ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading leads…</div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7l5-5h11a2 2 0 012 2v14a2 2 0 01-2 2zM9 2v5H4"/></svg>
              <p className="text-sm">No manual leads yet. Click <strong>+ New Lead</strong> to add one.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => { setSelectedLead(lead); setEmailSuccess(false); setEmailError(null); }}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedLead?.id === lead.id ? "bg-blue-50" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {lead.contactName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{lead.contactName}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.businessName} · {lead.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[lead.status]}`}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(lead.id); }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                    title="Delete lead"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail / Email Panel */}
        {selectedLead && (
          <div className="w-96 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
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
                ...(selectedLead.plan ? [["Plan", selectedLead.plan]] : []),
                ...(selectedLead.comments ? [["Notes", selectedLead.comments]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
                  <span className="text-gray-800 break-all">{value}</span>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="p-5 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
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

            {/* Send Email */}
            <div className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Send Email</p>
              {emailSuccess && (
                <div className="mb-3 bg-green-50 border border-green-200 text-green-800 text-sm px-3 py-2 rounded-lg">
                  ✓ Email sent successfully!
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
                  placeholder="Write your message…"
                  value={emailForm.body}
                  onChange={(e) => setEmailForm((f) => ({ ...f, body: e.target.value }))}
                  required
                  rows={5}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {isPending ? "Sending…" : "Send Email"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Create Lead Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add Manual Lead</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">{formError}</div>
              )}
              {[
                { name: "contactName",     label: "Contact Name",      type: "text" },
                { name: "businessName",    label: "Business Name",     type: "text" },
                { name: "businessAddress", label: "Business Address",  type: "text" },
                { name: "email",           label: "Email",             type: "email" },
                { name: "phone",           label: "Phone",             type: "tel" },
                { name: "currentProvider", label: "Current Provider",  type: "text" },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
                  <input
                    type={type}
                    name={name}
                    value={(form as Record<string, unknown>)[name] as string ?? ""}
                    onChange={handleFormChange}
                    required
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Interested Plan</label>
                <select
                  name="interestedPlan"
                  value={form.interestedPlan ?? ""}
                  onChange={handleFormChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— None —</option>
                  <option value="starter">Starter (300 Mbps)</option>
                  <option value="professional">Professional (1 Gig)</option>
                  <option value="enterprise">Enterprise (2 Gig)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Initial Status</label>
                <select
                  name="status"
                  value={form.status ?? "new"}
                  onChange={handleFormChange}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="comments"
                  value={form.comments ?? ""}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isPending ? "Creating…" : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Lead?</h3>
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
