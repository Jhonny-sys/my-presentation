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
