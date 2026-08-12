export const SUPPORTED_LANGUAGES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const ORB_LABEL_FALLBACKS: Record<
  LangCode,
  Record<"profile" | "experience" | "studies" | "technologies", string>
> = {
  es: {
    profile: "Perfil",
    experience: "Experiencia",
    studies: "Estudios",
    technologies: "Stack",
  },
  en: {
    profile: "Profile",
    experience: "Experience",
    studies: "Studies",
    technologies: "Stack",
  },
  pt: {
    profile: "Perfil",
    experience: "Experiência",
    studies: "Estudos",
    technologies: "Stack",
  },
};

export function orbLabel(
  lang: LangCode,
  id: keyof (typeof ORB_LABEL_FALLBACKS)["es"],
  messages: Record<string, string>,
) {
  return messages[`orb.${id}`] ?? ORB_LABEL_FALLBACKS[lang][id];
}

const HEADLINE_FALLBACKS: Record<LangCode, string> = {
  es: "Desarrollador",
  en: "Developer",
  pt: "Desenvolvedor",
};

/** Texto traducido del bundle i18n, con fallback al perfil solo en español. */
export function localizedProfileText(
  messages: Record<string, string>,
  key: string,
  lang: LangCode,
  profileFallback?: string | null,
  staticFallback = "",
): string {
  if (messages[key]) return messages[key];
  if (lang === "es" && profileFallback?.trim()) return profileFallback.trim();
  return staticFallback;
}

export function localizedHeadline(
  messages: Record<string, string>,
  lang: LangCode,
  profileHeadline?: string | null,
): string {
  return localizedProfileText(
    messages,
    "profile.headline",
    lang,
    profileHeadline,
    HEADLINE_FALLBACKS[lang],
  );
}

export function localizedBio(
  messages: Record<string, string>,
  lang: LangCode,
  profileBio?: string | null,
): string {
  return localizedProfileText(messages, "profile.bio", lang, profileBio, "");
}
