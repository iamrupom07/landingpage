/**
 * Shared API client for the backend.
 * Works in both browser (client components) and Node.js (server actions).
 */

const API_BASE =
  (typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL   // browser
    : process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL  // server
  ) ?? "http://localhost:5000";

type FetchOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...init } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  // CSV / binary responses
  if (res.headers.get("content-type")?.includes("text/csv")) {
    return res as unknown as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json.message ?? "Request failed",
      json.errors
    );
  }

  return json as T;
}
