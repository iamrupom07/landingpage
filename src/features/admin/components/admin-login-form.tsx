"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Wifi } from "lucide-react";
import { loginAdminAction } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminLoginFormProps = {
  defaultEmail: string;
  defaultPassword: string;
};

export function AdminLoginForm({ defaultEmail, defaultPassword }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await loginAdminAction({ email, password });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="admin-login-shell">
      <div aria-hidden className="admin-grid-bg" />

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
          <h1 className="mt-3 text-2xl font-extrabold text-slate-950">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Access your lead management dashboard</p>
        </div>

        {error && (
          <div className="admin-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="admin-input mt-1.5"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Password
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-input pr-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-2 h-11 w-full bg-slate-950 font-bold text-white hover:bg-slate-800"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in to dashboard"
            )}
          </Button>
        </form>

      </div>
    </div>
  );
}
