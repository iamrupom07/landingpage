import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "kb_admin_session";
const DEFAULT_ADMIN_EMAIL = "admin@kinetic.biz";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const SESSION_MAX_AGE = 60 * 60 * 8;

export type AdminSession = {
  email: string;
};

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
  };
}

export function getAdminLoginDefaults() {
  const credentials = getAdminCredentials();

  return {
    email: credentials.email,
    password: process.env.ADMIN_PASSWORD ? "" : DEFAULT_ADMIN_PASSWORD,
  };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!value?.startsWith("mock:")) {
    return null;
  }

  try {
    const email = decodeURIComponent(value.slice(5));

    return email ? { email } : null;
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, `mock:${encodeURIComponent(email)}`, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
