import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/features/admin/auth/session";
import { getApiBaseUrl } from "@/lib/api";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const FORWARDED_RESPONSE_HEADERS = [
  "content-disposition",
  "content-type",
] as const;

async function proxyAdminRequest(request: NextRequest, context: RouteContext) {
  const token = await getAdminToken();

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { path = [] } = await context.params;
  const target = new URL(
    `/api/${path.map((part) => encodeURIComponent(part)).join("/")}`,
    getApiBaseUrl()
  );
  target.search = request.nextUrl.search;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const backendResponse = await fetch(target, {
    method: request.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers({
    "cache-control": "no-store",
  });

  for (const header of FORWARDED_RESPONSE_HEADERS) {
    const value = backendResponse.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  const responseBody =
    backendResponse.status === 204 || backendResponse.status === 304
      ? null
      : await backendResponse.arrayBuffer();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyAdminRequest;
export const POST = proxyAdminRequest;
export const PATCH = proxyAdminRequest;
export const DELETE = proxyAdminRequest;
