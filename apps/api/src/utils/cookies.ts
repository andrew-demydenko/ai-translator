export function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx !== -1) {
      const key = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (key) cookies[key] = value;
    }
  }
  return cookies;
}
