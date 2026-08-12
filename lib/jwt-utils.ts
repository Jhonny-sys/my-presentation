export function isAccessTokenExpired(token: string, leewaySeconds = 30): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    if (!payload.exp) return true;
    return payload.exp * 1000 <= Date.now() + leewaySeconds * 1000;
  } catch {
    return true;
  }
}

export function hasValidSessionCookies(
  accessToken?: string,
  refreshToken?: string,
): boolean {
  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return true;
  }
  return Boolean(refreshToken);
}
