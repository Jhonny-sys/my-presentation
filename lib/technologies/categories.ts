import type { LangCode } from "@/lib/i18n/landing";

export const TECH_CATEGORY_IDS = [
  "backend",
  "frontend",
  "database",
  "cloud",
] as const;

export type TechCategoryId = (typeof TECH_CATEGORY_IDS)[number];

export const TECH_CATEGORY_OPTIONS: {
  id: TechCategoryId;
  adminLabel: string;
}[] = [
  { id: "backend", adminLabel: "Backend" },
  { id: "frontend", adminLabel: "Frontend" },
  { id: "database", adminLabel: "Base de datos" },
  { id: "cloud", adminLabel: "Cloud" },
];

const CATEGORY_LABELS: Record<LangCode, Record<TechCategoryId, string>> = {
  es: {
    backend: "Backend",
    frontend: "Frontend",
    database: "Base de datos",
    cloud: "Cloud",
  },
  en: {
    backend: "Backend",
    frontend: "Frontend",
    database: "Database",
    cloud: "Cloud",
  },
  pt: {
    backend: "Backend",
    frontend: "Frontend",
    database: "Banco de dados",
    cloud: "Cloud",
  },
};

const OTHER_LABEL: Record<LangCode, string> = {
  es: "Otros",
  en: "Other",
  pt: "Outros",
};

export function techCategoryLabel(lang: LangCode, category: string): string {
  if (TECH_CATEGORY_IDS.includes(category as TechCategoryId)) {
    return CATEGORY_LABELS[lang][category as TechCategoryId];
  }
  return OTHER_LABEL[lang];
}

export function isPrimaryTechCategory(category: string): category is TechCategoryId {
  return TECH_CATEGORY_IDS.includes(category as TechCategoryId);
}

export function groupTechnologiesByCategory<T extends { category: string }>(
  items: T[],
): { category: string; items: T[] }[] {
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const key = isPrimaryTechCategory(item.category) ? item.category : "other";
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }

  const groups: { category: string; items: T[] }[] = TECH_CATEGORY_IDS.filter((id) =>
    buckets.has(id),
  ).map((id) => ({ category: id, items: buckets.get(id)! }));

  if (buckets.has("other")) {
    groups.push({ category: "other", items: buckets.get("other")! });
  }

  return groups;
}
