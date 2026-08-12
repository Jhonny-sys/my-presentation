import { cookies } from "next/headers";
import type { I18nEntry, TokenResponse } from "./types";
import { getApiBaseUrl } from "./config";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth.constants";
import { isAccessTokenExpired } from "@/lib/jwt-utils";

async function getTokensFromCookies() {
  const store = await cookies();
  return {
    accessToken: store.get(ACCESS_TOKEN_COOKIE)?.value,
    refreshToken: store.get(REFRESH_TOKEN_COOKIE)?.value,
  };
}

async function refreshAdminToken(refreshToken: string): Promise<string | null> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data: TokenResponse = await response.json();
  return data.access_token;
}

export async function getAdminAccessToken(): Promise<string | null> {
  const { accessToken, refreshToken } = await getTokensFromCookies();

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return accessToken;
  }

  if (!refreshToken) return null;
  return refreshAdminToken(refreshToken);
}

export async function isAdminSessionActive(): Promise<boolean> {
  const token = await getAdminAccessToken();
  if (!token) return false;

  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return response.ok;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAdminAccessToken();
  if (!token) throw new Error("No autenticado");

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function fetchAdminI18nEntries(): Promise<I18nEntry[]> {
  return adminFetch<I18nEntry[]>("/i18n");
}

export async function createAdminI18nEntry(body: {
  key: string;
  source_text: string;
  namespace?: string;
}): Promise<I18nEntry> {
  return adminFetch<I18nEntry>("/i18n", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateAdminI18nEntry(
  key: string,
  body: { source_text: string },
): Promise<I18nEntry> {
  return adminFetch<I18nEntry>(`/i18n/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
