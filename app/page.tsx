import { LandingShell } from "@/components/landing/LandingShell";
import { getAssetUrls } from "@/lib/api/config";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n/landing";
import { fetchI18nBundle, fetchPortfolio } from "@/lib/api/server-client";

export const dynamic = "force-dynamic";

async function loadMessagesByLang() {
  const entries = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (item) => {
      try {
        const bundle = await fetchI18nBundle(item.code);
        return [item.code, bundle.messages] as const;
      } catch {
        return [item.code, {}] as const;
      }
    }),
  );

  return Object.fromEntries(entries) as Record<LangCode, Record<string, string>>;
}

export default async function HomePage() {
  const assets = getAssetUrls();
  let portfolio = null;
  let messagesByLang: Record<LangCode, Record<string, string>> = {
    es: {},
    en: {},
    pt: {},
  };
  let error = "";

  try {
    const [portfolioData, bundles] = await Promise.all([
      fetchPortfolio(),
      loadMessagesByLang(),
    ]);
    portfolio = portfolioData;
    messagesByLang = bundles;
  } catch {
    error = "No se pudo cargar el contenido. Verifica que la API esté activa.";
  }

  const profile = portfolio?.profile;
  const name = profile?.full_name ?? "Jhonny Alexander Fonseca";

  const imageUrl = assets.image || profile?.avatar_url || "";
  const cvUrl = assets.cv || profile?.resume_url || "";
  const letterUrl = profile?.letter_url || assets.letter;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050508] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.12),transparent_35%)]" />
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-10 pt-8">
        <LandingShell
          portfolio={portfolio}
          messagesByLang={messagesByLang}
          name={name}
          error={error}
          cvUrl={cvUrl}
          letterUrl={letterUrl}
          imageUrl={imageUrl}
        />
      </div>
    </main>
  );
}
