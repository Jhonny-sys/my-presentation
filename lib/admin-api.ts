import type { Experience, Portfolio, Study, Technology, PersonalInfo } from "@/lib/api/types";

async function ensureSession() {
  const response = await fetch("/api/admin/session", { method: "POST" });
  if (!response.ok) throw new Error("Sesión expirada");
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  await ensureSession();
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function uploadFile(file: File): Promise<string> {
  await ensureSession();
  const form = new FormData();
  form.append("file_1", file);
  const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
  if (!response.ok) throw new Error("Error al subir archivo");
  const data = (await response.json()) as { files: { url: string }[] };
  return data.files[0]?.url ?? "";
}

export async function saveProfile(body: {
  bio?: string;
  avatar_url?: string | null;
  resume_url?: string | null;
  letter_url?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  languages?: string | null;
  github?: string | null;
  linkedin?: string | null;
}) {
  return api<PersonalInfo>("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function createExperience(body: Record<string, unknown>) {
  return api<Experience>("/api/admin/experience", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateExperience(id: string, body: Record<string, unknown>) {
  return api<Experience>(`/api/admin/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteExperience(id: string) {
  return api<void>(`/api/admin/experience/${id}`, { method: "DELETE" });
}

export async function createStudy(body: Record<string, unknown>) {
  return api<Study>("/api/admin/studies", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateStudy(id: string, body: Record<string, unknown>) {
  return api<Study>(`/api/admin/studies/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteStudy(id: string) {
  return api<void>(`/api/admin/studies/${id}`, { method: "DELETE" });
}

export async function createTechnology(body: Record<string, unknown>) {
  return api<Technology>("/api/admin/technologies", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateTechnology(id: string, body: Record<string, unknown>) {
  return api<Technology>(`/api/admin/technologies/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteTechnology(id: string) {
  return api<void>(`/api/admin/technologies/${id}`, { method: "DELETE" });
}

export type { Portfolio };
