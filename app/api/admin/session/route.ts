import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { TokenResponse } from "@/lib/api/types";
import { getApiBaseUrl } from "@/lib/api/config";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth.constants";
import { isAccessTokenExpired } from "@/lib/jwt-utils";

export async function POST() {
  const store = await cookies();
  const access = store.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh = store.get(REFRESH_TOKEN_COOKIE)?.value;

  if (access && !isAccessTokenExpired(access)) {
    return NextResponse.json({ ok: true });
  }

  if (!refresh) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiResponse = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
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
