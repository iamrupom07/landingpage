"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, LoaderCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch, ApiError } from "@/lib/api";

// ─── Inner form (needs useSearchParams, so wrapped in Suspense below) ─────────

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState(false);
  const [isPending, startTransition]          = useTransition();

  // Missing or obviously malformed token — don't show the form at all
  if (!token) {
    return (
      <div className="admin-login-card" style={{ textAlign: "center" }}>
        <div className="admin-login-brand">
          <div className="admin-brand-icon">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Kinetic Business</p>
            <p className="text-lg font-extrabold leading-tight text-slate-950">Admin Portal</p>
          </div>
        </div>
        <div className="admin-login-divider" />
        <p className="mt-4 text-sm font-semibold text-red-600">Invalid or missing reset link.</p>
        <p className="mt-1 text-sm text-slate-500">
          Please request a new password reset from the login page.
        </p>
        <Button
          className="mt-6 w-full bg-slate-950 font-bold text-white hover:bg-slate-800"
          onClick={() => router.push("/admin/login")}
        >
          Back to login
        </Button>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      try {
        await apiFetch("/api/auth/password-reset/confirm", {
          method: "POST",
          body: JSON.stringify({ token, newPassword }),
        });
        setSuccess(true);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unable to connect to the server. Please try again.");
        }
      }
    });
  }

  if (success) {
    return (
      <div className="admin-login-card" style={{ textAlign: "center" }}>
        <div className="admin-login-brand">
          <div className="admin-brand-icon">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Kinetic Business</p>
            <p className="text-lg font-extrabold leading-tight text-slate-950">Admin Portal</p>
          </div>
        </div>
        <div className="admin-login-divider" />
        <div
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          ✓ Password updated successfully.
        </div>
        <p className="mt-3 text-sm text-slate-500">
          You can now sign in with your new password.
        </p>
        <Button
          className="mt-5 w-full bg-slate-950 font-bold text-white hover:bg-slate-800"
          onClick={() => router.push("/admin/login")}
        >
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="admin-login-card">
      <div className="admin-login-brand">
        <div className="admin-brand-icon">
          <Wifi className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Kinetic Business</p>
          <p className="text-lg font-extrabold leading-tight text-slate-950">Admin Portal</p>
        </div>
      </div>

      <div className="admin-login-divider" />

      <div className="admin-login-header">
        <div className="admin-lock-badge">
          <LockKeyhole className="h-4 w-4 text-blue-600" />
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-950">Set new password</h1>
        <p className="mt-1 text-sm text-slate-500">Enter a new password for your admin account.</p>
      </div>

      {error && (
        <div className="admin-login-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wide text-slate-500">
            New password
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="admin-input pr-10"
              required
              autoComplete="new-password"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Confirm new password
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="admin-input mt-1.5"
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          className="mt-2 h-11 w-full bg-slate-950 font-bold text-white hover:bg-slate-800"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Updating password…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Page (Suspense boundary required for useSearchParams in App Router) ──────

export default function ResetPasswordPage() {
  return (
    <div className="admin-login-shell">
      <div aria-hidden className="admin-grid-bg" />
      <Suspense
        fallback={
          <div className="admin-login-card flex items-center justify-center">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
