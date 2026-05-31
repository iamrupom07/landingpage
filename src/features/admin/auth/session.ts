import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const TOKEN_COOKIE    = "kb_admin_token";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type AdminSession = {
  email: string;
  token: string;
};

// ─── Token storage ────────────────────────────────────────────────────────────

export async function setAdminToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    maxAge:   SESSION_MAX_AGE,
    path:     "/",
    sameSite: "lax",
    secure:   process.env.NODE_ENV === "production",
  });
}

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function clearAdminToken(): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function requireAdminToken(): Promise<string> {
  const token = await getAdminToken();
  if (!token) redirect("/admin/login");
  return token;
}

// Legacy alias used by lead-actions.ts
export async function requireAdminSession(): Promise<{ email: string }> {
  const token = await requireAdminToken();
  // We don't need to decode the JWT here — just confirm it exists
  return { email: "admin" };
}

// ─── Kept for backward-compat with admin-login-form.tsx ──────────────────────
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = await getAdminToken();
  if (!token) return null;
  return { email: "admin", token };
}

export function getAdminLoginDefaults() {
  return { email: "", password: "" };
}
