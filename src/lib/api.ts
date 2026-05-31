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

  // CSV / binary responses — return early before any JSON parsing
  if (res.headers.get("content-type")?.includes("text/csv")) {
    return res as unknown as T;
  }

  // FIX: parse JSON safely — the server may return an empty body (e.g. 204,
  // rate-limit responses, or network-level errors that reach us as HTML).
  // Calling res.json() on a non-JSON body throws a SyntaxError that bypasses
  // ApiError entirely and surfaces as an unhandled "Internal server error" on
  // the client. We guard it here so every error path becomes a clean ApiError.
  let json: Record<string, unknown> = {};
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      json = await res.json();
    } catch {
      // Body was declared as JSON but couldn't be parsed (truncated, empty, etc.)
      if (!res.ok) {
        throw new ApiError(res.status, `Request failed (${res.status})`);
      }
    }
  } else if (!res.ok) {
    // Non-JSON error body (HTML rate-limit page, proxy error, etc.)
    throw new ApiError(
      res.status,
      `Request failed (${res.status} ${res.statusText || "Unknown Error"})`
    );
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (json.message as string) ?? "Request failed",
      json.errors as Record<string, string[]> | undefined
    );
  }

  return json as T;
}
