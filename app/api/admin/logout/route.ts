import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/api/config";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth.constants";

export async function POST(request: Request) {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await fetch(`${getApiBaseUrl()}/auth/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
  }

  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
