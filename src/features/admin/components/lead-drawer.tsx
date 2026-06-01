"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Trash2,
  Users,
  Wifi,
  X,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types/admin";
import {
  useDeleteLeadMutation,
  useSendEmailToLeadMutation,
  useUpdateLeadStatusMutation,
} from "../api/admin-leads-api";
import { STATUS_CONFIG } from "./status-badge";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed_won", "closed_lost"];
const EMPTY_EMAIL_FORM = {
  subject: "",
  body: "",
};

interface LeadDrawerProps {
  lead: Lead;
  initialEmailComposerOpen?: boolean;
  onClose: () => void;
  onUpdate: (updated: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadDrawer({
  lead,
  initialEmailComposerOpen = false,
  onClose,
  onUpdate,
  onDelete,
}: LeadDrawerProps) {
  const [current, setCurrent] = useState<Lead>(lead);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailForm, setEmailForm] = useState(EMPTY_EMAIL_FORM);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [updateLeadStatus, { isLoading: updating }] = useUpdateLeadStatusMutation();
  const [deleteLead, { isLoading: deleting }] = useDeleteLeadMutation();
  const [sendEmailToLead, { isLoading: sendingEmail }] = useSendEmailToLeadMutation();

  useEffect(() => {
    setCurrent(lead);
    setConfirmDelete(false);
    setShowEmailComposer(initialEmailComposerOpen);
    setEmailForm(EMPTY_EMAIL_FORM);
    setEmailError(null);
    setEmailSent(false);
  }, [initialEmailComposerOpen, lead]);

  async function handleStatusChange(status: LeadStatus) {
    if (status === current.status) return;
    try {
      const updated = await updateLeadStatus({ id: current.id, status }).unwrap();
      setCurrent(updated);
      onUpdate(updated);
    } catch {
      // Keep the current drawer state if the status update fails.
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteLead(current.id).unwrap();
      onDelete(current.id);
      onClose();
    } catch {
      // Keep the drawer open so the user can retry.
    }
  }

  function handleEmailFormChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setEmailForm((form) => ({ ...form, [name]: value }));
    setEmailError(null);
    setEmailSent(false);
  }

  async function handleSendEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError(null);
    setEmailSent(false);

    try {
      await sendEmailToLead({ id: current.id, payload: emailForm }).unwrap();
      setEmailForm(EMPTY_EMAIL_FORM);
      setShowEmailComposer(false);
      setEmailSent(true);
    } catch (err) {
      setEmailError(getMutationErrorMessage(err, "Unable to send email."));
    }
  }

  const plan = current.plan
    ? { starter: "Starter", professional: "Professional", enterprise: "Enterprise" }[current.plan]
    : "Not specified";

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} aria-hidden />

      {/* Drawer */}
      <aside className="lead-drawer" role="dialog" aria-label="Lead details">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-info">
            <div className="drawer-avatar">{current.businessName[0]}</div>
            <div>
              <p className="drawer-biz-name">{current.businessName}</p>
              <p className="drawer-contact-name">{current.contactName}</p>
            </div>
          </div>
          <button onClick={onClose} className="drawer-close-btn" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Plan + submitted */}
        <div className="drawer-meta-row">
          <span className="drawer-plan-badge">
            <Wifi className="h-3 w-3" />
            {plan}
          </span>
          <span className="drawer-date">
            <Clock className="h-3 w-3" />
            {new Date(current.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </span>
        </div>

        {/* Status changer */}
        <div className="drawer-section">
          <p className="drawer-section-title">Status</p>
          <div className="status-selector">
            {STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = s === current.status;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating}
                  className="status-option"
                  style={{
                    background: active ? cfg.bg : "transparent",
                    color: active ? cfg.text : "#94a3b8",
                    border: active ? `1.5px solid ${cfg.dot}40` : "1.5px solid transparent",
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  <span className="status-dot" style={{ background: cfg.dot }} aria-hidden />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact info */}
        <div className="drawer-section">
          <p className="drawer-section-title">Contact</p>
          <div className="drawer-field-list">
            <a href={`mailto:${current.email}`} className="drawer-field-link">
              <Mail className="h-3.5 w-3.5 text-blue-500" />
              {current.email}
            </a>
            <a href={`tel:${current.phone}`} className="drawer-field-link">
              <Phone className="h-3.5 w-3.5 text-blue-500" />
              {current.phone}
            </a>
            <div className="drawer-field">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {current.businessAddress}
            </div>
          </div>
        </div>

        <div className="drawer-section">
          <p className="drawer-section-title">
            <Mail className="h-3.5 w-3.5 inline mr-1" />
            Email
          </p>

          {emailSent && (
            <div className="drawer-email-success" role="status">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Email sent to {current.email}.
            </div>
          )}

          {emailError && (
            <div className="drawer-email-error" role="alert">
              {emailError}
            </div>
          )}

          {showEmailComposer ? (
            <form onSubmit={handleSendEmail} className="drawer-email-form">
              <label className="admin-field">
                <span>Subject</span>
                <input
                  name="subject"
                  value={emailForm.subject}
                  onChange={handleEmailFormChange}
                  className="admin-field-input"
                  required
                />
              </label>
              <label className="admin-field">
                <span>Message</span>
                <textarea
                  name="body"
                  value={emailForm.body}
                  onChange={handleEmailFormChange}
                  className="admin-field-input admin-field-textarea"
                  rows={4}
                  required
                />
              </label>
              <div className="drawer-email-actions">
                <button type="submit" className="createbtn" disabled={sendingEmail}>
                  {sendingEmail ? (
                    <>
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send Email
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="drawer-cancel-btn"
                  onClick={() => {
                    setShowEmailComposer(false);
                    setEmailError(null);
                  }}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="drawer-email-btn"
              onClick={() => {
                setShowEmailComposer(true);
                setEmailError(null);
                setEmailSent(false);
              }}
            >
              <Send className="h-3.5 w-3.5" />
              Send Email
            </button>
          )}
        </div>

        {/* Business info */}
        <div className="drawer-section">
          <p className="drawer-section-title">Business Info</p>
          <div className="drawer-field-list">
            <div className="drawer-field">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500 text-xs">Provider:</span>
              {current.currentProvider}
            </div>
            {current.employees && (
              <div className="drawer-field">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500 text-xs">Employees:</span>
                {current.employees}
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        {current.comments && (
          <div className="drawer-section">
            <p className="drawer-section-title">
              <MessageSquare className="h-3.5 w-3.5 inline mr-1" />
              Comments
            </p>
            <p className="drawer-comments">{current.comments}</p>
          </div>
        )}

        {/* Delete */}
        <div className="drawer-footer">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`drawer-delete-btn ${confirmDelete ? "drawer-delete-btn--confirm" : ""}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? "Deleting..." : confirmDelete ? "Confirm delete?" : "Delete lead"}
          </button>
          {confirmDelete && !deleting && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="drawer-cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </aside>

    </>
  );
}

function getMutationErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;

  if (typeof err === "object" && err && "data" in err) {
    const data = (err as { data?: unknown }).data;

    if (typeof data === "object" && data && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
  }

  return fallback;
}
