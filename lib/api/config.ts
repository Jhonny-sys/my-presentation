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
  { id: "profile", label: "Perfil", namespace: "profile" },
  { id: "experience", label: "Experiencia", namespace: "experience" },
  { id: "studies", label: "Estudios", namespace: "studies" },
  { id: "technologies", label: "Tecnologías", namespace: "technologies" },
] as const;
