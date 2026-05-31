"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { setAdminToken, clearAdminToken } from "./session";

type LoginInput  = { email: string; password: string };
type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginAdminAction(input: LoginInput): Promise<LoginResult> {
  try {
    const data = await apiFetch<{
      success: boolean;
      data: { token: string; user: { email: string; name: string } };
    }>("/api/auth/login", {
      method: "POST",
      body:   JSON.stringify({ email: input.email, password: input.password }),
    });

    await setAdminToken(data.data.token);
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.message };
    }
    return { ok: false, error: "Unable to connect to the server. Please try again." };
  }
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminToken();
  redirect("/admin/login");
}
