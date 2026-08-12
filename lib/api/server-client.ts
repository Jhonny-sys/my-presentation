import type {
  I18nBundle,
  I18nEntry,
  Portfolio,
  TokenResponse,
} from "./types";
import { getApiBaseUrl, getClientSecret } from "./config";

type TokenCache = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

async function fetchTokens(): Promise<TokenCache> {
  const response = await fetch(`${getApiBaseUrl()}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_secret: getClientSecret() }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo autenticar con la API");
  }

  const data: TokenResponse = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 30_000,
  };
}

async function refreshTokens(refreshToken: string): Promise<TokenCache> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    return fetchTokens();
  }

  const data: TokenResponse = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 30_000,
  };
}

export async function getAccessToken(): Promise<string> {
  if (!tokenCache || Date.now() >= tokenCache.expiresAt) {
    if (tokenCache?.refreshToken) {
      tokenCache = await refreshTokens(tokenCache.refreshToken);
    } else {
      tokenCache = await fetchTokens();
    }
  }
  return tokenCache.accessToken;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function fetchPortfolio(): Promise<Portfolio> {
  return apiFetch<Portfolio>("/portfolio");
}

export async function fetchI18nBundle(lang: string): Promise<I18nBundle> {
  return apiFetch<I18nBundle>(`/i18n/bundle/${lang}`);
}

export async function fetchI18nEntries(namespace?: string): Promise<I18nEntry[]> {
  const query = namespace ? `?namespace=${encodeURIComponent(namespace)}` : "";
  return apiFetch<I18nEntry[]>(`/i18n${query}`);
}

export async function createI18nEntry(body: {
  key: string;
  source_text: string;
  namespace?: string;
  description?: string;
}): Promise<I18nEntry> {
  return apiFetch<I18nEntry>("/i18n", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateI18nEntry(
  key: string,
  body: { source_text: string; description?: string },
): Promise<I18nEntry> {
  return apiFetch<I18nEntry>(`/i18n/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
