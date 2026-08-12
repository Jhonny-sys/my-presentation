export function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function whatsAppWebUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

export function gmailComposeUrl(to: string): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: to.trim(),
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function outlookComposeUrl(to: string): string {
  const recipient = encodeURIComponent(to.trim());
  return `https://outlook.office.com/owa/?path=/mail/action/compose&to=${recipient}`;
}

function isAppleDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Mac OS X|Macintosh/i.test(navigator.userAgent);
}

/** Abre Apple Maps en iOS/macOS y Google Maps en el resto. */
export function buildMapsUrl(location: string): string {
  const trimmed = location.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeExternalUrl(trimmed);
  }

  const query = encodeURIComponent(trimmed);
  if (isAppleDevice()) {
    return `https://maps.apple.com/?q=${query}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function openMapsLocation(location: string): void {
  const url = buildMapsUrl(location);
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
