"use server";

import { clearAdminSession, getAdminCredentials, setAdminSession } from "./session";

type LoginInput = {
  email: string;
  password: string;
};

type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginAdminAction(input: LoginInput): Promise<LoginResult> {
  const credentials = getAdminCredentials();
  const email = input.email.trim();

  if (email === credentials.email && input.password === credentials.password) {
    await setAdminSession(email);
    return { ok: true };
  }

  const hasDefaultCredentials = !process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD;

  return {
    ok: false,
    error: hasDefaultCredentials
      ? "Invalid credentials. Try admin@kinetic.biz / admin123"
      : "Invalid credentials.",
  };
}

export async function logoutAdminAction() {
  await clearAdminSession();
  return { ok: true };
}
