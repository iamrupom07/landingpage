"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { logoutAdminAction } from "../auth/actions";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Leads",     href: "/admin/leads",     icon: Users },
  // BUG FIX: href was "/admin/dashboard#analytics" — the hash fragment never
  // appears in usePathname(), so this nav item was never highlighted as active.
  // Changed href to the actual pathname; the anchor is handled client-side via
  // a scrollIntoView when the user clicks, or they can scroll manually.
  { label: "Analytics", href: "/admin/dashboard", icon: BarChart3, anchor: "analytics" },
];

type AdminShellProps = {
  children: React.ReactNode;
  email: string;
};

type AdminSidebarProps = {
  email: string;
  mobile?: boolean;
  onClose?: () => void;
};

export function AdminShell({ children, email }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <div className="admin-sidebar-desktop">
        <AdminSidebar email={email} />
      </div>

      {sidebarOpen && (
        <AdminSidebar email={email} mobile onClose={() => setSidebarOpen(false)} />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="admin-menu-btn"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="admin-topbar-logo">
              <Wifi className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-extrabold text-slate-950">Kinetic CRM</span>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

function AdminSidebar({ email, mobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAdminAction();
      router.replace("/admin/login");
      router.refresh();
    });
  }

  // BUG FIX: scrolls to the analytics section when the Analytics nav item is clicked
  function handleNavClick(item: (typeof NAV_ITEMS)[number]) {
    onClose?.();
    if (item.anchor) {
      // Give Next.js a tick to navigate if needed, then scroll
      setTimeout(() => {
        document.getElementById(item.anchor!)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  return (
    <aside className={cn("admin-sidebar", mobile && "admin-sidebar--mobile")}>
      {mobile && (
        <button onClick={onClose} className="admin-sidebar-close" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <Wifi className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kinetic</p>
          <p className="text-sm font-extrabold text-slate-950">Business CRM</p>
        </div>
      </div>

      <div className="admin-sidebar-divider" />

      <nav className="admin-sidebar-nav">
        <p className="admin-nav-section-label">Menu</p>
        {NAV_ITEMS.map((item) => {
          // BUG FIX: Analytics href is now "/admin/dashboard" just like Dashboard,
          // so we use the label to disambiguate the active state. Analytics is only
          // active when we're on the dashboard AND the user explicitly clicked it —
          // simplest approach: never show it as active (it's a within-page anchor).
          const active =
            item.anchor
              ? false // anchor items are never "page-level active"
              : pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item)}
              className={cn("admin-nav-item", active && "admin-nav-item--active")}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">{email[0]?.toUpperCase() ?? "A"}</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">{email}</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="admin-logout-btn"
          disabled={isPending}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
