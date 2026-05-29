"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Trash2,
  Users,
  Wifi,
  X,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types/admin";
import { deleteLeadAction, updateLeadStatusAction } from "../services/lead-actions";
import { STATUS_CONFIG } from "./status-badge";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed_won", "closed_lost"];

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updated: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadDrawer({ lead, onClose, onUpdate, onDelete }: LeadDrawerProps) {
  const [current, setCurrent] = useState<Lead>(lead);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setCurrent(lead);
    setConfirmDelete(false);
  }, [lead]);

  async function handleStatusChange(status: LeadStatus) {
    if (status === current.status) return;
    setUpdating(true);
    try {
      const updated = await updateLeadStatusAction(current.id, status);
      setCurrent(updated);
      onUpdate(updated);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteLeadAction(current.id);
      onDelete(current.id);
      onClose();
    } finally {
      setDeleting(false);
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
