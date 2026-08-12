import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const TECH_PREFIXES = "simple-icons,logos,devicon,skill-icons,carbon";

function iconifyUrl(iconId: string) {
  const [prefix, name] = iconId.split(":");
  if (!prefix || !name) return "";
  return `https://api.iconify.design/${prefix}/${name}.svg`;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ items: [], query: q });
  }

  const url = new URL("https://api.iconify.design/search");
  url.searchParams.set("query", q);
  url.searchParams.set("limit", "24");
  url.searchParams.set("prefixes", TECH_PREFIXES);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json(
      { detail: "No se pudo buscar iconos" },
      { status: 502 },
    );
  }

  const data = (await response.json()) as { icons?: string[] };
  const items = (data.icons ?? [])
    .map((iconId) => {
      const iconUrl = iconifyUrl(iconId);
      if (!iconUrl) return null;
      const label = iconId.split(":").pop()?.replace(/-/g, " ") ?? iconId;
      return {
        id: iconId,
        label,
        preview_url: iconUrl,
        icon_url: iconUrl,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items, query: q });
}
