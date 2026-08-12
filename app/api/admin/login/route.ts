import { NextResponse } from "next/server";
import type { TokenResponse } from "@/lib/api/types";
import { getApiBaseUrl } from "@/lib/api/config";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth.constants";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  const apiResponse = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!apiResponse.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data: TokenResponse = await apiResponse.json();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ACCESS_TOKEN_COOKIE, data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: data.expires_in,
    path: "/",
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, data.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: data.refresh_expires_in,
    path: "/",
  });

  return response;
}
