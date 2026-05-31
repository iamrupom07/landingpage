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

// ─── JWT decode helper (no-verify — token already verified by backend) ─────────

function decodeJwtPayload(token: string): { email?: string } {
  try {
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return {};
    // atob is available in Node 18+ / Edge runtime; Buffer fallback for older Node
    const json =
      typeof atob !== "undefined"
        ? atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(payloadB64, "base64").toString("utf8");
    return JSON.parse(json) as { email?: string };
  } catch {
    return {};
  }
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function requireAdminToken(): Promise<string> {
  const token = await getAdminToken();
  if (!token) redirect("/admin/login");
  return token;
}

// BUG FIX: was returning hardcoded { email: "admin" }; now decodes the JWT
// payload so the sidebar shows the real admin email.
export async function requireAdminSession(): Promise<{ email: string }> {
  const token = await requireAdminToken();
  const { email } = decodeJwtPayload(token);
  return { email: email ?? "admin" };
}

// ─── Kept for backward-compat with admin-login-form.tsx ──────────────────────
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = await getAdminToken();
  if (!token) return null;
  const { email } = decodeJwtPayload(token);
  return { email: email ?? "admin", token };
}

export function getAdminLoginDefaults() {
  return { email: "", password: "" };
}
