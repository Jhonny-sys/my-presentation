export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
}

export function getClientSecret(): string {
  const secret = process.env.API_CLIENT_SECRET;
  if (!secret) {
    throw new Error("API_CLIENT_SECRET no configurada");
  }
  return secret;
}

export function getAssetUrls() {
  return {
    image: process.env.NEXT_PUBLIC_ASSET_IMAGE_URL ?? "",
    cv: process.env.NEXT_PUBLIC_ASSET_CV_URL ?? "",
    letter: process.env.NEXT_PUBLIC_ASSET_LETTER_URL ?? "",
  };
}

export const ADMIN_SECTIONS = [
  { id: "profile", label: "Perfil", table: "personal_info" },
  { id: "information", label: "Información", table: "personal_info" },
  { id: "experience", label: "Experiencia", table: "experience" },
  { id: "studies", label: "Estudios", table: "studies" },
  { id: "technologies", label: "Tecnologías", table: "technologies" },
] as const;
